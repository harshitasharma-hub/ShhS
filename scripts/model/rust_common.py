"""Shared pieces for training and scoring Gemma 4 E2B on the BRACOL rust yes or no task."""
import csv
import json
import os
import random
import time
from collections import defaultdict
from pathlib import Path

os.environ.setdefault("PYTORCH_ENABLE_MPS_FALLBACK", "1")  # must be set before torch loads

import numpy as np  # noqa: E402
import torch  # noqa: E402
from PIL import Image  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent.parent
MODEL = ROOT / "models" / "gemma-4-E2B-it"
BRACOL = ROOT / "data" / "bracol"
RUNS = ROOT / "runs"
# Picked on 60 val photos: zero-shot AUC 0.90, against 0.77 for a plain "Does this leaf have rust?".
PROMPT = "Look at this coffee leaf. Does it show coffee leaf rust, which looks like yellow or orange spots? Answer with one word: Yes or No."
LORA_TARGETS = r".*language_model.*\.(q_proj|k_proj|v_proj|o_proj|gate_proj|up_proj|down_proj)"
ABSTAIN_TARGET = 0.95  # accuracy we want on the photos the tool answers


def limit_threads():
    """A rented container shows every host CPU but gets a small CPU quota. Torch then starts one thread per host CPU,
    they burn the quota in bursts, and the whole container stalls until the next 100 ms slot."""
    try:
        quota, period = Path("/sys/fs/cgroup/cpu.max").read_text().split()
        torch.set_num_threads(max(1, int(int(quota) / int(period) // 4)))
    except (OSError, ValueError):
        pass  # no quota here: a laptop, or the file says "max"


limit_threads()


def pick_device():
    if torch.cuda.is_available():
        return "cuda"
    return "mps" if torch.backends.mps.is_available() else "cpu"


def sync(device):
    if device == "cuda":
        torch.cuda.synchronize()
    elif device == "mps":
        torch.mps.synchronize()


def empty_cache(device):
    if device == "cuda":
        torch.cuda.empty_cache()
    elif device == "mps":
        torch.mps.empty_cache()


def load_model(device, dtype=torch.bfloat16):
    from transformers import AutoModelForMultimodalLM, AutoProcessor
    processor = AutoProcessor.from_pretrained(MODEL)
    model = AutoModelForMultimodalLM.from_pretrained(MODEL, dtype=dtype, device_map=device)
    return processor, model


def read_manifest(path=None):
    with open(path or BRACOL / "manifest.csv", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def balanced(rows, n, seed=0):
    """Take n photos, alternating rust and no rust, in a fixed random order."""
    rng = random.Random(seed)
    rust = [r for r in rows if r["rust"] == "1"]
    other = [r for r in rows if r["rust"] == "0"]
    rng.shuffle(rust)
    rng.shuffle(other)
    return [r for pair in zip(rust, other) for r in pair][:n]


def train_rows(manifest, fraction, seed):
    """BRACOL train photos for one data fraction (percent) and seed, from the frozen splits."""
    splits = json.loads((BRACOL / "splits.json").read_text())
    if fraction == 100:
        ids = set(splits["ids"]["train"])
    else:
        subsets = splits["subsets_of_train"]
        if str(seed) not in subsets:
            raise SystemExit(f"Subsets exist for seeds {sorted(subsets)}, not {seed}. Use one of those, or --fraction 100.")
        ids = set(subsets[str(seed)][str(fraction)])
    return [r for r in manifest if int(r["id"]) in ids]


def messages(image, answer=None):
    turns = [{"role": "user", "content": [{"type": "image", "image": image}, {"type": "text", "text": PROMPT}]}]
    if answer:
        turns.append({"role": "assistant", "content": [{"type": "text", "text": answer}]})
    return turns


def encode(processor, row, train):
    """Turn one leaf into model inputs. For training, only the yes or no token gets a label."""
    image = Image.open(ROOT / row["image"]).convert("RGB")
    ask = dict(tokenize=True, return_dict=True, return_tensors="pt")
    prompt = processor.apply_chat_template(messages(image), add_generation_prompt=True, **ask)
    if not train:
        return prompt
    full = processor.apply_chat_template(messages(image, "Yes" if row["rust"] == "1" else "No"), **ask)
    n = prompt["input_ids"].shape[1]
    labels = torch.full_like(full["input_ids"], -100)
    labels[:, n] = full["input_ids"][:, n]
    full["labels"] = labels
    return full


def collate(items):
    """Stack photos into one batch, padding on the right when lengths differ."""
    n = max(x["input_ids"].shape[1] for x in items)

    def pad(t, value):
        return torch.nn.functional.pad(t, (0, n - t.shape[1]), value=value)

    batch = {
        "input_ids": torch.cat([pad(x["input_ids"], 0) for x in items]),
        "attention_mask": torch.cat([pad(x["attention_mask"], 0) for x in items]),
        "mm_token_type_ids": torch.cat([pad(x["mm_token_type_ids"], 0) for x in items]),
        "pixel_values": torch.cat([x["pixel_values"] for x in items]),
        "image_position_ids": torch.cat([x["image_position_ids"] for x in items]),
    }
    if "labels" in items[0]:
        batch["labels"] = torch.cat([pad(x["labels"], -100) for x in items])
    return batch


def to_device(batch, device, dtype):
    return {k: (v.to(device, dtype) if v.is_floating_point() else v.to(device)) for k, v in batch.items()}


@torch.no_grad()
def score_rows(model, processor, rows, device, dtype, batch_size=1, log_every=50):
    """Return logit(Yes) minus logit(No) for each photo. Higher means more likely rust."""
    tok = processor.tokenizer
    yes_id, no_id = tok.encode("Yes", add_special_tokens=False)[0], tok.encode("No", add_special_tokens=False)[0]
    model.eval()
    encoded = [encode(processor, r, False) for r in rows]
    by_len = defaultdict(list)
    for i, x in enumerate(encoded):
        by_len[x["input_ids"].shape[1]].append(i)
    scores = [None] * len(rows)
    done, start = 0, time.perf_counter()
    for idx in by_len.values():
        for k in range(0, len(idx), batch_size):
            part = idx[k:k + batch_size]
            batch = to_device(collate([encoded[i] for i in part]), device, dtype)
            logits = model(**batch, logits_to_keep=1, use_cache=False).logits[:, -1, :].float()
            for i, s in zip(part, (logits[:, yes_id] - logits[:, no_id]).tolist()):
                scores[i] = s
            done += len(part)
            if log_every and done % log_every < len(part):
                print(f"  scored {done}/{len(rows)} in {time.perf_counter() - start:.0f}s", flush=True)
    return scores


def auc(y, s):
    y, s = np.asarray(y, dtype=int), np.asarray(s, dtype=float)
    pos, neg = int((y == 1).sum()), int((y == 0).sum())
    if not pos or not neg:
        return float("nan")
    order = np.argsort(s, kind="mergesort")
    ranks, i = np.empty(len(s)), 0
    while i < len(s):
        j = i
        while j + 1 < len(s) and s[order[j + 1]] == s[order[i]]:
            j += 1
        ranks[order[i:j + 1]] = (i + j) / 2 + 1
        i = j + 1
    return float((ranks[y == 1].sum() - pos * (pos + 1) / 2) / (pos * neg))


def at_threshold(y, s, t):
    y, pred = np.asarray(y, dtype=int), np.asarray(s, dtype=float) >= t
    tp, fp = int((pred & (y == 1)).sum()), int((pred & (y == 0)).sum())
    fn, tn = int((~pred & (y == 1)).sum()), int((~pred & (y == 0)).sum())
    prec = tp / (tp + fp) if tp + fp else float("nan")
    rec = tp / (tp + fn) if tp + fn else float("nan")
    f1 = 2 * tp / (2 * tp + fp + fn) if tp + fp + fn else float("nan")
    return {"accuracy": (tp + tn) / len(y), "sensitivity": rec, "specificity": tn / (tn + fp) if tn + fp else float("nan"),
            "precision": prec, "f1": f1}


def best_threshold(y, s):
    """The threshold that gives the best F1. Pick it on val, then use it unchanged on test."""
    cands = sorted(set(np.asarray(s, dtype=float).tolist()))
    return max(cands, key=lambda t: at_threshold(y, s, t)["f1"])


def abstain_margin(y, s, t, target=ABSTAIN_TARGET):
    """The smallest margin around the threshold such that answered photos reach the target accuracy."""
    y, s = np.asarray(y, dtype=int), np.asarray(s, dtype=float)
    right = (s >= t).astype(int) == y
    dist = np.abs(s - t)
    for m in [0.0] + sorted(set(dist.tolist())):
        keep = dist >= m
        if keep.sum() and right[keep].mean() >= target:
            return float(m)
    return float(dist.max() + 1)


def abstain_report(y, s, t, m):
    y, s = np.asarray(y, dtype=int), np.asarray(s, dtype=float)
    keep = np.abs(s - t) >= m
    right = (s >= t).astype(int) == y
    return {"coverage": float(keep.mean()), "accuracy_answered": float(right[keep].mean()) if keep.any() else float("nan")}


def bootstrap(y, s, t, n=1000, seed=0):
    y, s = np.asarray(y, dtype=int), np.asarray(s, dtype=float)
    rng, aucs, accs = np.random.default_rng(seed), [], []
    for _ in range(n):
        i = rng.integers(0, len(y), len(y))
        aucs.append(auc(y[i], s[i]))
        accs.append(at_threshold(y[i], s[i], t)["accuracy"])
    ci = lambda v: [float(np.nanpercentile(v, 2.5)), float(np.nanpercentile(v, 97.5))]
    return {"auc_ci95": ci(aucs), "accuracy_ci95": ci(accs)}


def summarize(val_rows, val_scores, test_rows, test_scores):
    yv, yt = [int(r["rust"]) for r in val_rows], [int(r["rust"]) for r in test_rows]
    t = best_threshold(yv, val_scores)
    m = abstain_margin(yv, val_scores, t)
    by_group = {}
    for g in ("rust", "healthy", "other", "unclear"):
        idx = [i for i, r in enumerate(test_rows) if r["group"] == g]
        if idx:
            hit = [(test_scores[i] >= t) == (yt[i] == 1) for i in idx]
            by_group[g] = {"n": len(idx), "correct": float(np.mean(hit))}
    by_sev = {}
    for sev in sorted({r["severity"] for r in test_rows if r["group"] == "rust"}):
        idx = [i for i, r in enumerate(test_rows) if r["group"] == "rust" and r["severity"] == sev]
        by_sev[sev] = {"n": len(idx), "sensitivity": float(np.mean([test_scores[i] >= t for i in idx]))}
    return {
        "threshold_from_val": t,
        "val": {"n": len(yv), "auc": auc(yv, val_scores), **at_threshold(yv, val_scores, t)},
        "test": {"n": len(yt), "auc": auc(yt, test_scores), **at_threshold(yt, test_scores, t), **bootstrap(yt, test_scores, t),
                 "by_group": by_group, "rust_sensitivity_by_severity": by_sev},
        "not_sure": {"target_accuracy": ABSTAIN_TARGET, "margin_from_val": m,
                     "val": abstain_report(yv, val_scores, t, m), "test": abstain_report(yt, test_scores, t, m)},
    }


def summarize_field(rows, scores, threshold):
    """Metrics on a field set at the threshold the run picked on BRACOL val. Nothing is tuned on the field photos,
    except the last block, which shows what a threshold tuned on them would give."""
    y = [int(r["rust"]) for r in rows]
    by_group = {}
    for g in sorted({r["group"] for r in rows}):
        idx = [i for i, r in enumerate(rows) if r["group"] == g]
        by_group[g] = {"n": len(idx), "correct": float(np.mean([(scores[i] >= threshold) == (y[i] == 1) for i in idx]))}
    own = best_threshold(y, scores)
    return {"n": len(y), "auc": auc(y, scores), **at_threshold(y, scores, threshold), **bootstrap(y, scores, threshold),
            "threshold_from_bracol_val": threshold, "by_group": by_group,
            "if_threshold_tuned_on_field": {"threshold": own, **at_threshold(y, scores, own)}}


def evaluate_run(model, processor, run_dir, args_info, device, dtype, manifest, limit=0, batch_size=1):
    """Score BRACOL val and test, then write scores_*.csv and metrics.json into run_dir."""
    run_dir.mkdir(parents=True, exist_ok=True)
    val = [r for r in manifest if r["split"] == "val"]
    test = [r for r in manifest if r["split"] == "test"]
    if limit:
        val, test = balanced(val, limit), balanced(test, limit)
    start = time.perf_counter()
    scores = {}
    for name, rows in (("val", val), ("test", test)):
        print(f"scoring {name}: {len(rows)} photos", flush=True)
        scores[name] = score_rows(model, processor, rows, device, dtype, batch_size)
        with open(run_dir / f"scores_{name}.csv", "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["id", "rust", "group", "severity", "score"])
            w.writerows([r["id"], r["rust"], r["group"], r["severity"], f"{s:.4f}"] for r, s in zip(rows, scores[name]))
    result = {**args_info, **summarize(val, scores["val"], test, scores["test"]), "scoring_seconds": time.perf_counter() - start}
    (run_dir / "metrics.json").write_text(json.dumps(result, indent=1) + "\n")
    t = result["test"]
    print(f"test AUC {t['auc']:.3f} {t['auc_ci95']} | accuracy {t['accuracy']:.3f} | sensitivity {t['sensitivity']:.3f} | "
          f"specificity {t['specificity']:.3f} | not-sure coverage {result['not_sure']['test']['coverage']:.2f}", flush=True)
    return result


def evaluate_field(model, processor, run_dir, threshold, device, dtype, sets, batch_size=1, all_photos=False, run_name=""):
    """Score real field photos (folders in data/field/) with the model as it is. Writes scores_field_<set>.csv and
    field_<set>.json into run_dir. The threshold comes from BRACOL val, so nothing is tuned on the field photos."""
    results = {}
    for name in sets:
        rows = read_manifest(ROOT / "data" / "field" / name / "manifest.csv")
        if not all_photos:
            rows = [r for r in rows if r["in_eval"] == "1"]
        tag = f"{name}_all" if all_photos else name  # the full set gets its own files, so the sample results stay
        print(f"scoring {name}: {len(rows)} photos", flush=True)
        scores = score_rows(model, processor, rows, device, dtype, batch_size)
        with open(run_dir / f"scores_field_{tag}.csv", "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["id", "rust", "group", "score"])
            w.writerows([r["id"], r["rust"], r["group"], f"{s:.4f}"] for r, s in zip(rows, scores))
        results[tag] = {"run": run_name, "field": name, "all_photos": all_photos, **summarize_field(rows, scores, threshold)}
        (run_dir / f"field_{tag}.json").write_text(json.dumps(results[tag], indent=1) + "\n")
        r = results[tag]
        print(f"{tag}: AUC {r['auc']:.3f} {[round(x, 3) for x in r['auc_ci95']]} | accuracy {r['accuracy']:.3f} | "
              f"sensitivity {r['sensitivity']:.3f} | specificity {r['specificity']:.3f}", flush=True)
    return results
