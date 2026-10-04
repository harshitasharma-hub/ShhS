#!/usr/bin/env python3
"""Run a .litertlm file with the phone runtime and compare its answers with the saved PyTorch scores.

  models/phone/venv/bin/python scripts/phone/test_phone_model.py models/phone/real_d140_f10_s0/real_d140_f10_s0.litertlm \
      real_d140_f10_s0 uganda 60

The last number is how many photos to take from each group (healthy, other disease, rust). Use `bracol` instead of
`uganda` for the clean BRACOL test photos. Add --gpu to run on the graphics chip, as a phone does by default.
Each photo goes through a fresh conversation: the photo and our prompt, greedy decoding, and the first word is the
answer. The PyTorch model answers Yes when its saved score is above 0, so that is the fair comparison. A photo whose
score sits within 0.5 of zero can flip with small number differences, so some flips are expected.
"""
import argparse
import csv
import random
import time
from collections import defaultdict
from pathlib import Path

import litert_lm

ROOT = Path(__file__).resolve().parent.parent.parent
# Same words as PROMPT in scripts/model/rust_common.py. Changing one without the other breaks the comparison.
PROMPT = ("Look at this coffee leaf. Does it show coffee leaf rust, which looks like yellow or orange spots? "
          "Answer with one word: Yes or No.")


def pick_photos(run, which, per_group):
    run_dir = ROOT / "runs" / run
    if which == "uganda":
        scores, manifest = run_dir / "scores_field_uganda_all.csv", ROOT / "data/field/uganda/manifest.csv"
    else:
        scores, manifest = run_dir / "scores_test.csv", ROOT / "data/bracol/manifest.csv"
    images = {r["id"]: r["image"] for r in csv.DictReader(open(manifest))}
    groups = defaultdict(list)
    for row in csv.DictReader(open(scores)):
        groups[row["group"]].append({"id": row["id"], "image": str(ROOT / images[row["id"]]), "rust": int(row["rust"]),
                                     "group": row["group"], "pt_score": float(row["score"])})
    rng = random.Random(0)
    picked = []
    for name in sorted(groups):
        rng.shuffle(groups[name])
        picked += groups[name][:per_group]
    rng.shuffle(picked)
    return picked


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("model", help="the .litertlm file")
    ap.add_argument("run", help="run whose saved scores to compare with, for example real_d140_f10_s0")
    ap.add_argument("which", choices=["uganda", "bracol"])
    ap.add_argument("per_group", type=int)
    ap.add_argument("--gpu", action="store_true", help="use the graphics chip instead of the CPU")
    ap.add_argument("--out", help="CSV to write, default models/phone/<run>/parity_<which>.csv")
    args = ap.parse_args()

    photos = pick_photos(args.run, args.which, args.per_group)
    out = Path(args.out) if args.out else ROOT / "models" / "phone" / args.run / f"parity_{args.which}.csv"
    out.parent.mkdir(parents=True, exist_ok=True)
    cache = ROOT / "models" / "phone" / "cache"
    cache.mkdir(parents=True, exist_ok=True)
    backend = litert_lm.Backend.GPU if args.gpu else litert_lm.Backend.CPU
    print(f"{args.which}: {len(photos)} photos on the {'GPU' if args.gpu else 'CPU'}", flush=True)

    sampler = litert_lm.SamplerConfig(top_k=1, top_p=1.0, temperature=1.0, seed=0)
    thinking = litert_lm.ThinkingConfig(enable_thinking=False)
    rows = []
    with litert_lm.Engine(args.model, backend=backend(), vision_backend=backend(), cache_dir=str(cache)) as engine:
        for i, photo in enumerate(photos, 1):
            message = {"role": "user", "content": [{"type": "image", "path": photo["image"]},
                                                   {"type": "text", "text": PROMPT}]}
            start = time.time()
            with engine.create_conversation(sampler_config=sampler, thinking_config=thinking, max_output_tokens=4) as conv:
                reply = conv.send_message(message)
            text = "".join(c.get("text", "") for c in reply["content"] if c.get("type") == "text").strip()
            word = text.split()[0].strip(".,!").lower() if text.split() else ""
            pred = 1 if word == "yes" else 0 if word == "no" else -1
            rows.append({**photo, "answer": text, "pred": pred, "seconds": round(time.time() - start, 2)})
            if i % 20 == 0:
                print(f"  {i}/{len(photos)}", flush=True)

    with open(out, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "group", "rust", "pt_score", "answer", "pred", "seconds"],
                                extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)

    def pytorch_pred(r):
        return 1 if r["pt_score"] > 0 else 0

    n = len(rows)
    same = sum(1 for r in rows if r["pred"] == pytorch_pred(r))
    print(f"\nSame answer as PyTorch: {same}/{n} = {100 * same / n:.1f}%. Answers that were not yes or no: "
          f"{sum(1 for r in rows if r['pred'] == -1)}")
    print(f"{'group':8} {'n':>4} {'phone runtime right':>20} {'PyTorch right':>14}")
    for name in sorted({r["group"] for r in rows}):
        part = [r for r in rows if r["group"] == name]
        print(f"{name:8} {len(part):>4} {100 * sum(r['pred'] == r['rust'] for r in part) / len(part):>19.1f}% "
              f"{100 * sum(pytorch_pred(r) == r['rust'] for r in part) / len(part):>13.1f}%")
    flips = [r for r in rows if r["pred"] != pytorch_pred(r)]
    if flips:
        print("Different from PyTorch (its score): " + ", ".join(f"{r['id']} ({r['pt_score']:+.2f})" for r in flips))
    times = sorted(r["seconds"] for r in rows)
    print(f"Seconds per photo: median {times[len(times) // 2]:.1f}, slowest {times[-1]:.1f}. Wrote {out}")


if __name__ == "__main__":
    main()
