#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["numpy", "pillow", "opencv-python-headless", "scipy"]
# ///
"""Cut a flat leaf texture and an alpha mask out of each BRACOL photo.

Reads data/bracol/manifest.csv. For each chosen leaf it writes, to
data/synthetic/textures/:
  <id>.jpg        the leaf photo, turned so the long axis is horizontal and cropped
                  to the leaf. Pixels outside the leaf copy the nearest leaf colour,
                  so no white fringe shows when the texture is filtered.
  <id>_mask.png   the leaf outline as an 8 bit alpha mask.
  textures.csv    one row per leaf with the checks (area, solidity, border contact).

Only leaves from the splits you ask for are cut. Use --split train for the study,
so no validation or test leaf ever feeds the synthetic set.

Run from the repo root:
  uv run scripts/synth/extract_textures.py --split train
  uv run scripts/synth/extract_textures.py --ids 960 891 --overlay
"""
import argparse
import csv
import sys
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import cv2
import numpy as np
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parent.parent.parent
MANIFEST = ROOT / "data" / "bracol" / "manifest.csv"
OUT = ROOT / "data" / "synthetic" / "textures"
FIELDS = ["id", "w", "h", "angle_deg", "area_frac", "solidity", "touches_border",
          "n_parts", "mask_ok", "bg_L", "bg_a", "bg_b"]


def segment(bgr):
    """Return a boolean leaf mask and the background colour in Lab."""
    lab = cv2.cvtColor(bgr.astype(np.float32) / 255.0, cv2.COLOR_BGR2LAB)
    band = 24
    border = np.concatenate([lab[:band].reshape(-1, 3), lab[-band:].reshape(-1, 3),
                             lab[:, :band].reshape(-1, 3), lab[:, -band:].reshape(-1, 3)])
    bg = np.median(border, axis=0)
    # distance from the background in colour, plus very dark pixels
    d_ab = np.hypot(lab[..., 1] - bg[1], lab[..., 2] - bg[2])
    score = np.clip(d_ab * 255.0 / 80.0, 0, 255).astype(np.uint8)
    score = cv2.GaussianBlur(score, (0, 0), 1.5)
    thr, _ = cv2.threshold(score, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    thr = max(thr * 0.6, 14)  # lean toward keeping pale lesions at the leaf edge
    mask = score > thr
    mask |= lab[..., 0] < (bg[0] - 45)  # dark necrosis with little colour
    # warm or uneven paper can pass the colour test. Pale, low colour, bright pixels are paper, not leaf.
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV_FULL).astype(np.float32) / 255.0
    paper = (hsv[..., 1] < 0.32) & (hsv[..., 2] > 0.55)
    paper = ndi.binary_opening(paper, structure=np.ones((9, 9)))
    mask &= ~paper
    mask = clean(mask, 5, 9)
    if not mask.any():
        return mask, bg, 0
    mask = clean(refine(lab, mask, bg), 5, 9)
    # A finger, a clip or a patch of paper can touch the leaf edge. These are pale and warm
    # (red above green, low colour, bright). Take them off, but only close to the outline,
    # so pale lesions inside the leaf stay.
    b, g, r = (bgr[..., i].astype(np.float32) for i in range(3))
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    sat, val = (mx - mn) / np.maximum(mx, 1.0), mx / 255.0
    pale_warm = (r > g * 1.0) & (sat < 0.36) & (val > 0.58)
    pale_warm = ndi.binary_opening(pale_warm, structure=np.ones((7, 7)))
    band = mask & ~ndi.binary_erosion(mask, iterations=40)
    mask = clean(mask & ~(pale_warm & band), 5, 9)
    return mask, bg, 1


def clean(mask, open_k, close_k):
    """Remove specks, close small gaps, fill holes, keep the biggest piece."""
    mask = ndi.binary_opening(mask, structure=np.ones((open_k, open_k)))
    mask = ndi.binary_closing(mask, structure=np.ones((close_k, close_k)))
    mask = ndi.binary_fill_holes(mask)
    labels, n = ndi.label(mask)
    if n == 0:
        return mask
    sizes = ndi.sum(mask, labels, range(1, n + 1))
    return labels == (1 + int(np.argmax(sizes)))


def refine(lab, mask, bg):
    """Second look at the outline. Uneven or warm paper fools a single background colour.
    Learn a smooth background colour from the pixels well outside the leaf, then call a pixel leaf
    only if it differs from that local background. Only pixels near the first outline can change."""
    free = ~ndi.binary_dilation(mask, iterations=12)
    sm = 0.25
    small = cv2.resize(lab, None, fx=sm, fy=sm, interpolation=cv2.INTER_AREA)
    ws = cv2.resize(free.astype(np.float32), None, fx=sm, fy=sm, interpolation=cv2.INTER_AREA)
    num = cv2.GaussianBlur(small * ws[..., None], (0, 0), 14)
    den = cv2.GaussianBlur(ws, (0, 0), 14)
    model = num / np.maximum(den[..., None], 1e-3)
    model[den < 0.02] = bg
    model = cv2.resize(model, (lab.shape[1], lab.shape[0]), interpolation=cv2.INTER_LINEAR)
    diff = lab - model
    d_e = cv2.GaussianBlur(np.sqrt((diff ** 2).sum(-1)), (0, 0), 1.5)
    d_ab = cv2.GaussianBlur(np.hypot(diff[..., 1], diff[..., 2]), (0, 0), 1.5)
    # A leaf differs from the paper in colour. A shadow on the paper only gets darker, so it fails the
    # colour test. Very dark pixels count as leaf anyway (dead tissue).
    new = ((d_ab > 6.0) & (d_e > 11.0)) | (lab[..., 0] < model[..., 0] - 45)
    return new & ndi.binary_dilation(mask, iterations=6)


def long_axis_angle(mask):
    ys, xs = np.nonzero(mask)
    pts = np.stack([xs, ys], 1).astype(np.float32)
    mean = pts.mean(0)
    cov = np.cov((pts - mean).T)
    w, v = np.linalg.eigh(cov)
    major = v[:, int(np.argmax(w))]
    ang = np.degrees(np.arctan2(major[1], major[0]))
    if ang > 90:
        ang -= 180
    if ang < -90:
        ang += 180
    return float(ang), mean


def cut(leaf_id, src, overlay=False):
    bgr = cv2.imread(str(src), cv2.IMREAD_COLOR)
    if bgr is None:
        return None
    mask, bg, n_parts = segment(bgr)
    h0, w0 = mask.shape
    # The paper should be neutral. Photos from different phones and days carry a colour cast that
    # also tints the leaf, and the cast can correlate with the label. Divide it out.
    band = 24
    edge = np.concatenate([bgr[:band].reshape(-1, 3), bgr[-band:].reshape(-1, 3),
                           bgr[:, :band].reshape(-1, 3), bgr[:, -band:].reshape(-1, 3)])
    paper = np.median(edge, axis=0).astype(np.float32)
    gains = np.clip(paper.mean() / np.maximum(paper, 1.0), 0.8, 1.25)
    bgr = np.clip(bgr.astype(np.float32) * gains, 0, 255).astype(np.uint8)
    area0 = float(mask.sum())
    if area0 < 0.05 * h0 * w0:
        return {"id": leaf_id, "mask_ok": 0, "n_parts": n_parts}
    ang, center = long_axis_angle(mask)
    # drop 2 px of edge: those pixels are a blend of leaf and white background
    mask_e = ndi.binary_erosion(mask, structure=np.ones((3, 3)), iterations=2)
    # fill the colour outside the leaf with the nearest leaf colour
    _, idx = ndi.distance_transform_edt(~mask_e, return_indices=True)
    filled = bgr[idx[0], idx[1]]
    alpha = cv2.GaussianBlur(mask_e.astype(np.float32), (0, 0), 1.2)
    # turn the long axis horizontal, with padding so nothing is cut off
    M = cv2.getRotationMatrix2D((float(center[0]), float(center[1])), ang, 1.0)
    pad = 400
    M[0, 2] += pad
    M[1, 2] += pad
    size = (w0 + 2 * pad, h0 + 2 * pad)
    rgb_r = cv2.warpAffine(filled, M, size, flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    a_r = cv2.warpAffine(alpha, M, size, flags=cv2.INTER_LINEAR, borderValue=0)
    ys, xs = np.nonzero(a_r > 0.5)
    m = 12
    x0, x1 = max(xs.min() - m, 0), min(xs.max() + m + 1, size[0])
    y0, y1 = max(ys.min() - m, 0), min(ys.max() + m + 1, size[1])
    rgb_c = rgb_r[y0:y1, x0:x1]
    a_c = np.clip(a_r[y0:y1, x0:x1], 0, 1)
    OUT.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(OUT / f"{leaf_id}.jpg"), rgb_c, [cv2.IMWRITE_JPEG_QUALITY, 93])
    cv2.imwrite(str(OUT / f"{leaf_id}_mask.png"), (a_c * 255).astype(np.uint8))
    hull_area = cv2.contourArea(cv2.convexHull(
        max(cv2.findContours((a_c > 0.5).astype(np.uint8), cv2.RETR_EXTERNAL,
                             cv2.CHAIN_APPROX_SIMPLE)[0], key=cv2.contourArea)))
    area = float((a_c > 0.5).sum())
    solidity = area / max(hull_area, 1.0)
    touches = bool(mask[0].any() or mask[-1].any() or mask[:, 0].any() or mask[:, -1].any())
    ch, cw = a_c.shape
    area_frac = area / (ch * cw)
    # a plausible leaf is long, fairly solid (wavy leaves are not convex) and does not touch the photo edge
    ok = int(not touches and solidity > 0.70 and 0.30 < area_frac < 0.90 and cw / ch > 1.5)
    if overlay:
        prev = rgb_c.copy()
        edge = (cv2.Canny((a_c > 0.5).astype(np.uint8) * 255, 50, 150) > 0)
        edge = cv2.dilate(edge.astype(np.uint8), np.ones((3, 3))) > 0
        prev[edge] = (255, 0, 255)
        cv2.imwrite(str(OUT / f"{leaf_id}_overlay.jpg"), prev, [cv2.IMWRITE_JPEG_QUALITY, 85])
    return {"id": leaf_id, "w": cw, "h": ch, "angle_deg": round(ang, 2),
            "area_frac": round(area_frac, 3), "solidity": round(solidity, 3),
            "touches_border": int(touches), "n_parts": n_parts, "mask_ok": ok,
            "bg_L": round(float(bg[0]), 1), "bg_a": round(float(bg[1]), 1), "bg_b": round(float(bg[2]), 1)}


def work(args):
    return cut(*args)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--split", choices=["train", "val", "test"], help="cut every leaf of this split")
    ap.add_argument("--ids", nargs="*", type=int, help="cut only these leaf ids")
    ap.add_argument("--overlay", action="store_true", help="also write a mask outline preview")
    ap.add_argument("--jobs", type=int, default=6)
    a = ap.parse_args()
    rows = list(csv.DictReader(open(MANIFEST)))
    if a.ids:
        rows = [r for r in rows if int(r["id"]) in set(a.ids)]
    elif a.split:
        rows = [r for r in rows if r["split"] == a.split]
    else:
        sys.exit("give --split or --ids")
    jobs = [(int(r["id"]), ROOT / r["image"], a.overlay) for r in rows]
    with ProcessPoolExecutor(a.jobs) as ex:
        res = [r for r in ex.map(work, jobs, chunksize=4) if r]
    OUT.mkdir(parents=True, exist_ok=True)
    csv_path = OUT / "textures.csv"
    old = {}
    if csv_path.exists():
        old = {int(r["id"]): r for r in csv.DictReader(open(csv_path))}
    for r in res:
        old[int(r["id"])] = {k: r.get(k, "") for k in FIELDS}
    with open(csv_path, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        for k in sorted(old):
            w.writerow(old[k])
    ok = sum(1 for r in res if r.get("mask_ok"))
    print(f"cut {len(res)} leaves, {ok} passed the mask checks, {len(res) - ok} failed")


if __name__ == "__main__":
    main()
