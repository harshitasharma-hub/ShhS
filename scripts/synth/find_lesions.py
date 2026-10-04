#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["numpy", "opencv-python-headless", "scipy", "pillow"]
# ///
"""Find where the lesions are on each cut-out leaf texture, so close-up renders can aim at them.

A close-up of a rust leaf must show rust, or the label is wrong. BRACOL has no spot positions, so
this finds them by colour: yellow-orange blobs for rust, dark brown blobs for other damage.
Writes data/synthetic/textures/lesions.json. Positions are (u, v) in texture space: u from the left,
v from the bottom, both 0 to 1, the same as the UV map in Blender.

  uv run scripts/synth/find_lesions.py            # every cut texture
  uv run scripts/synth/find_lesions.py --ids 897 1664 --preview
"""
import argparse
import json
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import cv2
import numpy as np
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parent.parent.parent
TEX = ROOT / "data" / "synthetic" / "textures"
W = 640  # work width


def blobs(score, mask, thr, k, sigma=5):
    """Centres of the k strongest blobs of a lesion score, as (x, y, mass) in pixels."""
    s = cv2.GaussianBlur(score.astype(np.float32), (0, 0), sigma) * mask
    lab, n = ndi.label(s > thr)
    if n == 0:
        return []
    idx = range(1, n + 1)
    mass = ndi.sum(s, lab, idx)
    cms = ndi.center_of_mass(s, lab, idx)
    order = np.argsort(mass)[::-1][:k]
    return [(float(cms[i][1]), float(cms[i][0]), float(mass[i])) for i in order]


def analyse(leaf_id):
    img = cv2.imread(str(TEX / f"{leaf_id}.jpg"), cv2.IMREAD_COLOR)
    mask = cv2.imread(str(TEX / f"{leaf_id}_mask.png"), cv2.IMREAD_GRAYSCALE)
    if img is None or mask is None:
        return leaf_id, None
    h0, w0 = mask.shape
    sc = W / w0
    img = cv2.resize(img, (W, int(h0 * sc)), interpolation=cv2.INTER_AREA)
    mask = cv2.resize(mask, (W, int(h0 * sc)), interpolation=cv2.INTER_AREA) > 127
    h, w = mask.shape
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV_FULL).astype(np.float32)
    hue, sat, val = hsv[..., 0] * 360.0 / 255.0, hsv[..., 1] / 255.0, hsv[..., 2] / 255.0
    inner = ndi.binary_erosion(mask, iterations=max(3, int(0.012 * w)))
    # yellow-orange: rust spots and their yellow halo. Green leaf sits near 90 to 130 degrees.
    orange = np.clip(1 - np.abs(hue - 38) / 22, 0, 1) * np.clip((sat - 0.30) / 0.30, 0, 1) * (val > 0.45)
    # dark brown: necrosis from other problems
    brown = np.clip(1 - np.abs(hue - 22) / 22, 0, 1) * np.clip((sat - 0.25) / 0.30, 0, 1) * (val < 0.62) * (val > 0.08)
    area = float(mask.sum())
    out = {
        "orange_frac": round(float(((orange > 0.5) & inner).sum() / area), 5),
        "brown_frac": round(float(((brown > 0.5) & inner).sum() / area), 5),
        "aspect": round(w0 / h0, 3),
    }

    def norm(pts):
        return [[round(x / w, 4), round(1 - y / h, 4), round(m, 2)] for x, y, m in pts]

    out["aim_orange"] = norm(blobs(orange * inner, inner, 0.12, 8))
    out["aim_brown"] = norm(blobs(brown * inner, inner, 0.20, 8))
    # a few random places well inside the leaf, for leaves with nothing to aim at
    rng = np.random.default_rng(int(leaf_id))
    ys, xs = np.nonzero(ndi.binary_erosion(mask, iterations=int(0.06 * w)))
    if len(xs):
        pick = rng.choice(len(xs), size=min(8, len(xs)), replace=False)
        out["aim_random"] = [[round(float(xs[i] / w), 4), round(float(1 - ys[i] / h), 4), 1.0] for i in pick]
    else:
        out["aim_random"] = []
    return leaf_id, out


def preview(ids, results):
    from PIL import Image, ImageDraw
    cell = (480, 240)
    sheet = Image.new("RGB", (cell[0] * 3, cell[1] * ((len(ids) + 2) // 3)), (20, 20, 20))
    for i, k in enumerate(ids):
        im = Image.open(TEX / f"{k}.jpg").convert("RGB").resize(cell)
        d = ImageDraw.Draw(im)
        for x, y, _ in results[k]["aim_orange"][:6]:
            X, Y = x * cell[0], (1 - y) * cell[1]
            d.ellipse((X - 9, Y - 9, X + 9, Y + 9), outline=(255, 0, 255), width=2)
        for x, y, _ in results[k]["aim_brown"][:4]:
            X, Y = x * cell[0], (1 - y) * cell[1]
            d.rectangle((X - 8, Y - 8, X + 8, Y + 8), outline=(0, 255, 255), width=2)
        d.text((4, 3), f"{k} orange {results[k]['orange_frac']:.3f} brown {results[k]['brown_frac']:.3f}", fill=(255, 235, 80))
        sheet.paste(im, ((i % 3) * cell[0], (i // 3) * cell[1]))
    out = TEX / "lesion_preview.jpg"
    sheet.save(out, quality=88)
    print("preview", out)


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--ids", nargs="*", type=int)
    ap.add_argument("--preview", action="store_true")
    ap.add_argument("--jobs", type=int, default=3)
    a = ap.parse_args()
    ids = a.ids or sorted(int(p.stem) for p in TEX.glob("*.jpg") if p.stem.isdigit())
    with ProcessPoolExecutor(a.jobs) as ex:
        res = dict(ex.map(analyse, ids, chunksize=8))
    res = {str(k): v for k, v in res.items() if v}
    path = TEX / "lesions.json"
    old = json.loads(path.read_text()) if path.exists() else {}
    old.update(res)
    path.write_text(json.dumps(old))
    print(f"analysed {len(res)} leaves -> {path}")
    if a.preview:
        preview([str(i) for i in ids], {str(k): v for k, v in res.items()})


if __name__ == "__main__":
    main()
