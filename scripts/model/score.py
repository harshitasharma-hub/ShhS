#!/usr/bin/env python3
"""Score BRACOL val and test with Gemma 4 E2B, as it is (zero-shot) or with a trained LoRA adapter.

Run from the repo root:
  .venv/bin/python scripts/model/score.py --detail 140
  .venv/bin/python scripts/model/score.py --detail 140 --adapter runs/real_d140_f100_s0/adapter
Results go to runs/<name>/: scores_val.csv, scores_test.csv and metrics.json.
"""
import argparse
from pathlib import Path

import torch

from rust_common import RUNS, evaluate_run, load_model, pick_device, read_manifest


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--detail", type=int, default=140, choices=(70, 140, 280, 560, 1120), help="image token budget")
    ap.add_argument("--adapter", help="folder of a trained LoRA adapter. Leave out for zero-shot.")
    ap.add_argument("--name")
    ap.add_argument("--limit", type=int, default=0, help="score only this many photos per split, for a quick test")
    ap.add_argument("--batch-size", type=int)
    args = ap.parse_args()

    device, dtype = pick_device(), torch.bfloat16
    name = args.name or (f"zeroshot_d{args.detail}" if not args.adapter else "score_" + Path(args.adapter).parent.name)
    processor, model = load_model(device, dtype)
    processor.image_processor.max_soft_tokens = args.detail
    if args.adapter:
        from peft import PeftModel
        model = PeftModel.from_pretrained(model, args.adapter)
    info = {"name": name, "detail": args.detail, "adapter": args.adapter, "device": device, "torch": torch.__version__}
    evaluate_run(model, processor, RUNS / name, info, device, dtype, read_manifest(), args.limit,
                 args.batch_size or (8 if device == "cuda" else 1))


if __name__ == "__main__":
    main()
