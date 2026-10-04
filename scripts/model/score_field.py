#!/usr/bin/env python3
"""Score real field photos (Uganda, Kenya) with finished runs, to see how far they carry beyond BRACOL.

Run from the repo root, after the runs have finished:
  .venv/bin/python scripts/model/score_field.py --run real_d140_f100_s0
  .venv/bin/python scripts/model/score_field.py --run zeroshot_d140_cuda real_d140_f10_s0 --field uganda
Each run's folder says which detail and adapter to use, and which threshold it picked on BRACOL val.
The model loads once, so list many runs in one call. Nothing is tuned on the field photos.
Results go to runs/<run>/field_<set>.json and scores_field_<set>.csv, with _all added to the name for --all.
"""
import argparse
import json

import torch

from rust_common import RUNS, empty_cache, evaluate_field, load_model, pick_device


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--run", nargs="+", required=True, help="names of finished runs in runs/")
    ap.add_argument("--field", nargs="+", default=["uganda", "kenya"], help="folders in data/field/")
    ap.add_argument("--all", action="store_true", help="score every photo, not only the in_eval sample")
    ap.add_argument("--batch-size", type=int)
    ap.add_argument("--force", action="store_true", help="score again even when the run already has field results")
    args = ap.parse_args()

    device, dtype = pick_device(), torch.bfloat16
    processor, model = load_model(device, dtype)
    for name in args.run:
        run = RUNS / name
        tags = [f"{s}_all" if args.all else s for s in args.field]
        if not args.force and all((run / f"field_{t}.json").exists() for t in tags):
            print(f"skip {name}: field results exist", flush=True)
            continue
        done = json.loads((run / "metrics.json").read_text())
        processor.image_processor.max_soft_tokens = done["detail"]
        peft_model = None
        if (run / "adapter").exists():
            from peft import PeftModel
            peft_model = PeftModel.from_pretrained(model, str(run / "adapter"))
        print(f"=== {name}: detail {done['detail']}, adapter {peft_model is not None} ===", flush=True)
        evaluate_field(peft_model or model, processor, run, done["threshold_from_val"], device, dtype, args.field,
                       args.batch_size or (8 if device == "cuda" else 1), args.all, name)
        if peft_model is not None:
            model = peft_model.unload()
            del peft_model
            empty_cache(device)


if __name__ == "__main__":
    main()
