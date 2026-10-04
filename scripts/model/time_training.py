#!/usr/bin/env python3
"""Time a short LoRA training run of Gemma 4 E2B on BRACOL, on this machine.

For each config (image token budget and batch size) it measures seconds per photo
for training and for scoring, plus peak GPU memory. Then it estimates the cost of
the full study. Only a small JSON of the timings is saved.

Run from the repo root: .venv/bin/python scripts/model/time_training.py
"""
import argparse
import csv
import json
import os
import random
import statistics
import subprocess
import time
from pathlib import Path

os.environ.setdefault("PYTORCH_ENABLE_MPS_FALLBACK", "1")  # must be set before torch loads

import torch  # noqa: E402
from peft import LoraConfig, get_peft_model  # noqa: E402
from PIL import Image  # noqa: E402
from transformers import AutoModelForMultimodalLM, AutoProcessor  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent.parent
MODEL = ROOT / "models" / "gemma-4-E2B-it"
MANIFEST = ROOT / "data" / "bracol" / "manifest.csv"
PROMPT = "Does this coffee leaf have rust? Answer yes or no."
LORA_TARGETS = r".*language_model.*\.(q_proj|k_proj|v_proj|o_proj|gate_proj|up_proj|down_proj)"

# Rough size of the full study: real-only and mixed runs at 4 data fractions with 3 seeds each,
# plus 3 synthetic-only runs. Every run trains for 2 epochs. 2000 synthetic photos is a guess.
TRAIN_PHOTOS, SCORED_PER_RUN = 1225, 261 * 2
FRACTION_PHOTOS, SYNTHETIC_PHOTOS, SEEDS, EPOCHS = (128, 312, 614, 1225), 2000, 3, 2


def sync():
    torch.mps.synchronize()


def sh(*cmd):
    return subprocess.run(cmd, capture_output=True, text=True).stdout.strip()


def pick(rows, n):
    """Take n photos, alternating rust and no rust, in a fixed random order."""
    rng = random.Random(0)
    rust = [r for r in rows if r["rust"] == "1"]
    other = [r for r in rows if r["rust"] == "0"]
    rng.shuffle(rust)
    rng.shuffle(other)
    return [r for pair in zip(rust, other) for r in pair][:n]


def messages(image, answer=None):
    turns = [{"role": "user", "content": [{"type": "image", "image": image}, {"type": "text", "text": PROMPT}]}]
    if answer:
        turns.append({"role": "assistant", "content": [{"type": "text", "text": answer}]})
    return turns


def encode(processor, row, train):
    """Turn one leaf into model inputs. For training, everything before the answer is masked."""
    image = Image.open(ROOT / row["image"]).convert("RGB")
    ask = dict(tokenize=True, return_dict=True, return_tensors="pt")
    prompt = processor.apply_chat_template(messages(image), add_generation_prompt=True, **ask)
    if not train:
        return prompt
    full = processor.apply_chat_template(messages(image, "yes" if row["rust"] == "1" else "no"), **ask)
    labels = full["input_ids"].clone()
    labels[:, : prompt["input_ids"].shape[1]] = -100
    full["labels"] = labels
    return full


def collate(items):
    """Stack photos into one batch. Every photo has the same size here, so padding is rarely needed."""
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


def to_device(batch, dtype):
    return {k: (v.to("mps", dtype) if v.is_floating_point() else v.to("mps")) for k, v in batch.items()}


def gb(n_bytes):
    return n_bytes / 1e9


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--configs", default="70:1,140:1,280:1", help="budget:batch pairs, comma separated")
    ap.add_argument("--steps", type=int, default=6, help="timed training steps per config")
    ap.add_argument("--warmup", type=int, default=2, help="untimed steps per config")
    ap.add_argument("--score-photos", type=int, default=8, help="timed scoring photos per budget")
    ap.add_argument("--dtype", choices=("bf16", "fp16"), default="bf16")
    ap.add_argument("--no-checkpointing", action="store_true", help="keep activations instead of recomputing them")
    args = ap.parse_args()
    dtype = torch.bfloat16 if args.dtype == "bf16" else torch.float16
    configs = [tuple(map(int, c.split(":"))) for c in args.configs.split(",")]

    rows = list(csv.DictReader(open(MANIFEST, newline="")))
    train_rows = [r for r in rows if r["split"] == "train"]
    val_rows = [r for r in rows if r["split"] == "val"]

    processor = AutoProcessor.from_pretrained(MODEL)
    yes_id, no_id = (processor.tokenizer.encode(w, add_special_tokens=False)[0] for w in ("yes", "no"))
    swap_before = sh("sysctl", "-n", "vm.swapusage").split("used =")[1].split()[0]
    start = time.perf_counter()
    model = AutoModelForMultimodalLM.from_pretrained(MODEL, dtype=dtype, device_map="mps")
    load_s = time.perf_counter() - start
    print(f"loaded in {load_s:.0f}s | GPU memory {gb(torch.mps.driver_allocated_memory()):.1f} GB | "
          f"swap used before {swap_before}, now {sh('sysctl', '-n', 'vm.swapusage').split('used =')[1].split()[0]}", flush=True)

    # 1) Scoring with the plain model. This is also the zero-shot setup.
    result = {"scoring": {}, "training": {}}
    model.eval()
    for budget in sorted({b for b, _ in configs}):
        processor.image_processor.max_soft_tokens = budget
        photos = pick(val_rows, args.score_photos + 1)
        inputs = [to_device(collate([encode(processor, r, False)]), dtype) for r in photos]
        times, scores = [], []
        torch.mps.empty_cache()
        with torch.no_grad():
            model(**inputs[0], logits_to_keep=1)  # warm-up, not timed
            for x, r in zip(inputs[1:], photos[1:]):
                sync()
                t = time.perf_counter()
                logits = model(**x, logits_to_keep=1).logits[0, -1].float()
                sync()
                times.append(time.perf_counter() - t)
                scores.append((r["rust"], (logits[yes_id] - logits[no_id]).item()))
        by = {k: statistics.mean(s for lab, s in scores if lab == k) for k in ("1", "0") if any(lab == k for lab, _ in scores)}
        result["scoring"][budget] = {
            "seq_len": inputs[0]["input_ids"].shape[1],
            "sec_per_photo": statistics.median(times),
            "mean_yes_minus_no_score": {"rust": by.get("1"), "no_rust": by.get("0")},
        }
        print(f"score  budget {budget:3}: {statistics.median(times):.2f} s/photo, seq {inputs[0]['input_ids'].shape[1]}, "
              f"mean yes-no score rust {by.get('1')}, no rust {by.get('0')}", flush=True)

    # 2) LoRA training on the language model only.
    if not args.no_checkpointing:
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={"use_reentrant": False})
    model.config.use_cache = False
    model = get_peft_model(model, LoraConfig(r=16, lora_alpha=32, target_modules=LORA_TARGETS))
    model.print_trainable_parameters()
    opt = torch.optim.AdamW([p for p in model.parameters() if p.requires_grad], lr=1e-4)
    model.train()
    for budget, bs in configs:
        processor.image_processor.max_soft_tokens = budget
        photos = pick(train_rows, bs * (args.steps + args.warmup))
        encoded = [encode(processor, r, True) for r in photos]
        batches = [to_device(collate(encoded[i:i + bs]), dtype) for i in range(0, len(encoded), bs)]
        torch.mps.empty_cache()
        times, peak = [], 0
        for i, batch in enumerate(batches):
            sync()
            t = time.perf_counter()
            loss = model(**batch).loss
            loss.backward()
            opt.step()
            opt.zero_grad(set_to_none=True)
            sync()
            dt = time.perf_counter() - t
            peak = max(peak, torch.mps.driver_allocated_memory())
            note = "" if torch.isfinite(loss) else "  NON-FINITE LOSS"
            print(f"train  budget {budget:3} batch {bs}: step {i + 1}/{len(batches)} {dt:6.2f}s loss {loss.item():.3f}{note}"
                  f"{'  (warm-up)' if i < args.warmup else ''}", flush=True)
            if i >= args.warmup:
                times.append(dt)
        per_photo = statistics.median(times) / bs
        result["training"][f"{budget}:{bs}"] = {
            "seq_len": batches[0]["input_ids"].shape[1],
            "sec_per_step": statistics.median(times),
            "sec_per_photo": per_photo,
            "peak_gpu_gb": gb(peak),
        }

    # 3) Estimates for the whole study.
    passes = EPOCHS * SEEDS * (sum(FRACTION_PHOTOS) + sum(SYNTHETIC_PHOTOS + f for f in FRACTION_PHOTOS) + SYNTHETIC_PHOTOS)
    runs = SEEDS * (2 * len(FRACTION_PHOTOS) + 1)
    scored = runs * SCORED_PER_RUN + SCORED_PER_RUN
    print("\nconfig    seq  s/photo train  s/photo score  peak GB  one epoch    whole study (est.)")
    for key, t in result["training"].items():
        budget = int(key.split(":")[0])
        s = result["scoring"][budget]["sec_per_photo"]
        hours = (passes * t["sec_per_photo"] + scored * s) / 3600
        t["epoch_minutes"] = TRAIN_PHOTOS * t["sec_per_photo"] / 60
        t["study_hours"] = hours
        print(f"{key:8} {t['seq_len']:5} {t['sec_per_photo']:14.2f} {s:14.2f} {t['peak_gpu_gb']:8.1f} "
              f"{t['epoch_minutes']:7.0f} min {hours:10.0f} h")
    print(f"\nstudy size used: {passes} training passes, {runs} runs, {scored} scored photos "
          f"({EPOCHS} epochs, {SEEDS} seeds, {SYNTHETIC_PHOTOS} synthetic photos guessed)")

    result["machine"] = {"chip": sh("sysctl", "-n", "machdep.cpu.brand_string"),
                         "ram_gb": int(sh("sysctl", "-n", "hw.memsize")) // 2**30,
                         "torch": torch.__version__, "dtype": args.dtype,
                         "gradient_checkpointing": not args.no_checkpointing, "load_seconds": load_s}
    out = ROOT / "results" / f"timing_{args.dtype}{'_nockpt' if args.no_checkpointing else ''}.json"
    out.parent.mkdir(exist_ok=True)
    out.write_text(json.dumps(result, indent=1) + "\n")
    print(f"saved {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
