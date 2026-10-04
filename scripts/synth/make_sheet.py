#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow"]
# ///
"""Make a contact sheet of random pictures from a synthetic manifest, to check them by eye.

  uv run scripts/synth/make_sheet.py v1 --n 40
  uv run scripts/synth/make_sheet.py v1 --mode closeup --rust 1 --n 24 --out data/synthetic/v1_closeups_rust.jpg
  uv run scripts/synth/make_sheet.py v1 --worst luma_mean --n 24      # the darkest pictures
"""
import argparse
import csv
import random
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent.parent


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("version")
    ap.add_argument("--n", type=int, default=40)
    ap.add_argument("--cols", type=int, default=8)
    ap.add_argument("--mode", help="whole or closeup")
    ap.add_argument("--preset")
    ap.add_argument("--rust", choices=["0", "1"])
    ap.add_argument("--bad", help="a bad-photo kind, or any")
    ap.add_argument("--worst", help="sort by this QC column (luma_mean, luma_std, sharp) instead of random, lowest first")
    ap.add_argument("--highest", action="store_true", help="with --worst: highest first")
    ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--cell", type=int, default=240)
    ap.add_argument("--out")
    a = ap.parse_args()
    rows = list(csv.DictReader(open(ROOT / "data" / "synthetic" / a.version / "manifest.csv")))
    if a.mode:
        rows = [r for r in rows if r["mode"] == a.mode]
    if a.preset:
        rows = [r for r in rows if r["preset"] == a.preset]
    if a.rust:
        rows = [r for r in rows if r["rust"] == a.rust]
    if a.bad:
        rows = [r for r in rows if (r["bad"] == a.bad if a.bad != "any" else r["bad"])]
    if a.worst:
        rows.sort(key=lambda r: float(r[a.worst]), reverse=a.highest)
    else:
        random.Random(a.seed).shuffle(rows)
    rows = rows[:a.n]
    cw = ch = a.cell
    cols = a.cols
    sheet = Image.new("RGB", (cw * cols, ch * ((len(rows) + cols - 1) // cols)), (20, 20, 20))
    for i, r in enumerate(rows):
        im = Image.open(ROOT / r["image"]).convert("RGB")
        im.thumbnail((cw - 4, ch - 4), Image.LANCZOS)
        tag = ("RUST" if r["rust"] == "1" else ("no" if r["rust"] == "0" else "bad:" + r["bad"])) + f" {r['mode'][:5]} {r['preset'][:7]}"
        d = ImageDraw.Draw(im)
        d.rectangle((0, 0, len(tag) * 6 + 6, 12), fill=(0, 0, 0))
        d.text((2, 0), tag, fill=(255, 235, 80) if r["rust"] == "1" else (170, 255, 170))
        sheet.paste(im, ((i % cols) * cw + 2, (i // cols) * ch + 2))
    out = ROOT / (a.out or f"data/synthetic/{a.version}_sheet.jpg")
    sheet.save(out, quality=88)
    print(f"{len(rows)} pictures -> {out}")


if __name__ == "__main__":
    main()
