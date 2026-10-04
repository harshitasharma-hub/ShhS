#!/usr/bin/env python3
"""Read leaf photos with a trained adapter and answer: rust, no rust, or not sure.

  .venv/bin/python scripts/model/predict.py leaf1.jpg leaf2.jpg --run real_d140_f10_s0 --lang es
The adapter is runs/<run>/adapter. The cut-off and the "not sure" margin come from runs/<run>/field_calibration.json,
which scripts/analyze/save_calibration.py writes. If the score is within the margin of the cut-off, the answer is "not sure".
This is the same scoring the study used (logit "Yes" minus logit "No"). It runs on this computer and needs no network.
"""
import argparse
import json
from pathlib import Path

import torch

from rust_common import RUNS, load_model, pick_device, score_rows

ANSWERS = {
    "en": {"rust": "Rust: yes", "no_rust": "Rust: no", "not_sure": "Not sure. Ask a person to look at this leaf."},
    "es": {"rust": "Roya: sí", "no_rust": "Roya: no", "not_sure": "No estoy seguro. Pida a una persona que mire esta hoja."},
    "pt": {"rust": "Ferrugem: sim", "no_rust": "Ferrugem: não", "not_sure": "Não tenho certeza. Peça a uma pessoa para olhar esta folha."},
}


def verdict(score, cutoff, margin):
    if abs(score - cutoff) < margin:
        return "not_sure"
    return "rust" if score >= cutoff else "no_rust"


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("photos", nargs="+", help="leaf photo files")
    ap.add_argument("--run", default="real_d140_f10_s0")
    ap.add_argument("--lang", default="en", choices=sorted(ANSWERS))
    args = ap.parse_args()

    run = RUNS / args.run
    info = json.loads((run / "metrics.json").read_text())
    calibration = json.loads((run / "field_calibration.json").read_text())
    device, dtype = pick_device(), torch.bfloat16
    processor, model = load_model(device, dtype)
    processor.image_processor.max_soft_tokens = info["detail"]
    from peft import PeftModel
    model = PeftModel.from_pretrained(model, str(run / "adapter"))

    rows = [{"image": str(Path(p).resolve())} for p in args.photos]
    scores = score_rows(model, processor, rows, device, dtype, batch_size=1, log_every=0)
    print()
    for path, score in zip(args.photos, scores):
        answer = ANSWERS[args.lang][verdict(score, calibration["cutoff"], calibration["margin"])]
        print(f"{Path(path).name}: {answer}   (score {score:+.2f}, cut-off {calibration['cutoff']:+.2f}, margin {calibration['margin']:.2f})")


if __name__ == "__main__":
    main()
