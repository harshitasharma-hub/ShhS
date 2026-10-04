#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["numpy", "opencv-python-headless", "scipy"]
# ///
"""Paint yellow, golden or orange rims around the brown lesions of leaves that do NOT have rust.

Why: in v1 and v2, orange shows up almost only on rust leaves, so a model can learn "orange means rust".
Real photos of other diseases (phoma, cercospora) have big brown lesions with a yellow or orange rim.
This script makes such leaves from real BRACOL train textures, so orange alone is no longer a rust sign.

Only leaves with rust = 0 are touched. Each one stays a no-rust leaf. The rim is painted in Lab colour, so the
veins and the leaf texture show through. Output:
  data/synthetic/textures_rim/<id>_r<k>.jpg, <id>_r<k>_mask.png   the painted texture and its (unchanged) outline
  data/synthetic/textures_rim/rims.json                           where the lesions are, and the rim settings

  uv run scripts/synth/add_rims.py                  # all eligible leaves, 2 variants each
  uv run scripts/synth/add_rims.py --ids 365 1016 --preview
"""
import argparse
import csv
import json
import math
import random
import zlib
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import cv2
import numpy as np
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parent.parent.parent
TEX = ROOT / "data" / "synthetic" / "textures"
OUT = ROOT / "data" / "synthetic" / "textures_rim"
# rim colours as Lab targets (L, a, b) with the share of leaves that get each one
PALETTE = [("yellow", (80.0, -6.0, 62.0), 0.40), ("golden", (72.0, 10.0, 62.0), 0.35), ("orange", (64.0, 26.0, 60.0), 0.25)]
MIN_AREA = 250  # px of a lesion in the texture, about 0.2 cm2


def find_lesions(bgr, inside):
    """Brown or dark dead tissue. Returns a labelled image and the count.
    BRACOL leaves are yellow-green (hue 60 to 90), so brown has to be 48 degrees or lower."""
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV_FULL).astype(np.float32)
    hue, sat, val = hsv[..., 0] * 360.0 / 255.0, hsv[..., 1] / 255.0, hsv[..., 2] / 255.0
    brown = ((hue <= 48) & (sat >= 0.30) & (val <= 0.62)) | ((val <= 0.20) & (hue <= 70))
    brown &= ndi.binary_erosion(inside, iterations=4)
    brown = ndi.binary_opening(brown, structure=np.ones((3, 3)))
    brown = ndi.binary_closing(brown, structure=np.ones((7, 7)))
    brown = ndi.binary_fill_holes(brown)
    lab, n = ndi.label(brown)
    keep = np.zeros_like(lab)
    k = 0
    total = float(inside.sum())
    for i in range(1, n + 1):
        area = int((lab == i).sum())
        if MIN_AREA <= area <= 0.20 * total:
            k += 1
            keep[lab == i] = k
    return keep, k


def fill_white_holes(bgr, lesions, rng):
    """Some lesions have a hole where the white paper shows through. Make it dead brown tissue instead."""
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV_FULL).astype(np.float32)
    white = (hsv[..., 2] / 255.0 > 0.78) & (hsv[..., 1] / 255.0 < 0.25) & (lesions > 0)
    white = ndi.binary_dilation(white, iterations=2) & (lesions > 0)
    if not white.any():
        return bgr
    out = bgr.copy()
    ring = (lesions > 0) & ~white
    med = np.median(bgr[ring], axis=0) if ring.any() else np.array([40, 50, 70])
    noise = cv2.GaussianBlur(rng.standard_normal(white.shape).astype(np.float32), (0, 0), 2.0) * 9.0
    fill = np.clip(med[None, :] + noise[white][:, None], 0, 255)
    out[white] = fill.astype(np.uint8)
    return out


def smooth_noise(h, w, rng, sigma=18.0):
    n = cv2.GaussianBlur(rng.standard_normal((h, w)).astype(np.float32), (0, 0), sigma)
    return np.clip(n / (n.std() * 2.5 + 1e-6), -1, 1)


def paint(bgr, inside, lesions, n, rng, color, width_k, strength, power):
    h, w = inside.shape
    lab = cv2.cvtColor(bgr.astype(np.float32) / 255.0, cv2.COLOR_BGR2LAB)
    alpha = np.zeros((h, w), np.float32)
    noise = smooth_noise(h, w, rng)
    info = []
    for i in range(1, n + 1):
        comp = lesions == i
        area = int(comp.sum())
        r_eq = math.sqrt(area / math.pi)
        width = float(np.clip(width_k * r_eq * rng.uniform(0.85, 1.15), 10, 72))
        d = ndi.distance_transform_edt(~comp).astype(np.float32)
        a = np.clip(1.0 - (d - 9.0 * noise) / width, 0.0, 1.0) ** power
        a[comp] = 0.0
        alpha = np.maximum(alpha, a)
        ys, xs = np.nonzero(comp)
        info.append({"cx": float(xs.mean() / w), "cy": float(1 - ys.mean() / h), "area": area, "diam_frac": float(2 * r_eq / w), "rim_px": round(width, 1)})
    alpha *= inside.astype(np.float32)
    alpha[lesions > 0] = 0.0
    a_ = alpha * strength
    L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
    lr, ar, br = color
    detail = L - cv2.GaussianBlur(L, (0, 0), 6)  # keep the veins and the fine texture
    lab[..., 0] = L * (1 - 0.65 * a_) + lr * 0.65 * a_ + 0.5 * detail * a_
    lab[..., 1] = A * (1 - a_) + ar * a_
    lab[..., 2] = B * (1 - a_) + br * a_
    out = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    return np.clip(out * 255.0, 0, 255).astype(np.uint8), info


def one_leaf(args):
    leaf_id, variants = args
    bgr = cv2.imread(str(TEX / f"{leaf_id}.jpg"), cv2.IMREAD_COLOR)
    msk = cv2.imread(str(TEX / f"{leaf_id}_mask.png"), cv2.IMREAD_GRAYSCALE)
    if bgr is None or msk is None:
        return []
    inside = msk > 127
    lesions, n = find_lesions(bgr, inside)
    if n == 0:
        return []
    results = []
    for k in range(variants):
        rng = np.random.default_rng(zlib.crc32(f"rim-{leaf_id}-{k}".encode()))
        r = random.Random(zlib.crc32(f"rimcolor-{leaf_id}-{k}".encode()))
        name, lab_color, _ = r.choices(PALETTE, weights=[p[2] for p in PALETTE])[0]
        width_k = r.uniform(0.35, 0.90)
        strength = r.uniform(0.70, 0.95)
        power = r.uniform(1.0, 2.0)
        base = fill_white_holes(bgr, lesions, rng)
        painted, info = paint(base, inside, lesions, n, rng, lab_color, width_k, strength, power)
        tid = f"{leaf_id}_r{k}"
        OUT.mkdir(parents=True, exist_ok=True)
        cv2.imwrite(str(OUT / f"{tid}.jpg"), painted, [cv2.IMWRITE_JPEG_QUALITY, 94])
        cv2.imwrite(str(OUT / f"{tid}_mask.png"), msk)
        results.append((tid, {"leaf": int(leaf_id), "color": name, "width_k": round(width_k, 2), "strength": round(strength, 2),
                              "power": round(power, 2), "lesions": info}))
    return results


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--ids", nargs="*", type=int)
    ap.add_argument("--variants", type=int, default=1)
    ap.add_argument("--jobs", type=int, default=4)
    ap.add_argument("--preview", action="store_true")
    a = ap.parse_args()
    man = {r["id"]: r for r in csv.DictReader(open(ROOT / "data/bracol/manifest.csv"))}
    tex = {r["id"]: r for r in csv.DictReader(open(TEX / "textures.csv"))}
    ids = [str(i) for i in a.ids] if a.ids else [k for k in sorted(tex, key=int) if tex[k]["mask_ok"] == "1"]
    # Only train leaves with another disease and NO rust. A rust leaf could end up with a close-up that shows a
    # rimmed lesion and no rust. Healthy leaves have no lesion to rim.
    ids = [k for k in ids if man[k]["split"] == "train" and man[k]["rust"] == "0" and man[k]["group"] == "other"]
    with ProcessPoolExecutor(a.jobs) as ex:
        res = [x for part in ex.map(one_leaf, [(k, a.variants) for k in ids], chunksize=4) for x in part]
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / "rims.json"
    old = json.loads(path.read_text()) if path.exists() else {}
    old.update(dict(res))
    path.write_text(json.dumps(old))
    leaves = {v["leaf"] for _, v in res}
    print(f"{len(res)} painted textures from {len(leaves)} of {len(ids)} no-rust leaves -> {path}")
    if a.preview:
        from PIL import Image, ImageDraw
        sel = [t for t, _ in res][:12]
        W, H, cols = 480, 230, 3
        sheet = Image.new("RGB", (W * cols, H * ((len(sel) + cols - 1) // cols) * 2), (20, 20, 20))
        for i, t in enumerate(sel):
            orig = Image.open(TEX / f"{t.split('_r')[0]}.jpg").convert("RGB")
            new = Image.open(OUT / f"{t}.jpg").convert("RGB")
            for j, im in enumerate((orig, new)):
                im.thumbnail((W - 4, H - 4))
                ImageDraw.Draw(im).text((3, 1), (t if j else "original") + (" " + old[t]["color"] if j else ""), fill=(255, 235, 80))
                sheet.paste(im, ((i % cols) * W + 2, ((i // cols) * 2 + j) * H + 2))
        sheet.save(OUT / "preview.jpg", quality=88)
        print("preview", OUT / "preview.jpg")


if __name__ == "__main__":
    main()
