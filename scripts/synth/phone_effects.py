#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["numpy", "opencv-python-headless"]
# ///
"""Make clean renders look like photos from a cheap phone.

Adds what a phone camera does after the light reaches it: auto exposure, white
balance drift, contrast and sharpening, blur, resolution loss, sensor noise,
vignette, JPEG compression and, now and then, rain streaks. Every random draw
comes from the seed in the file name, so a run can be repeated exactly.

  uv run scripts/synth/phone_effects.py data/synthetic/probe/*.png --out data/synthetic/probe_phone
"""
import argparse
import json
import math
import zlib
from pathlib import Path

import cv2
import numpy as np


def srgb_to_lin(x):
    return np.where(x <= 0.04045, x / 12.92, ((x + 0.055) / 1.055) ** 2.4)


def lin_to_srgb(x):
    x = np.clip(x, 0, 1)
    return np.where(x <= 0.0031308, x * 12.92, 1.055 * x ** (1 / 2.4) - 0.055)


def rain_streaks(h, w, rng, density, length, angle_deg, blur):
    layer = np.zeros((h, w), np.float32)
    n = int(density * h * w / 1000)
    ang = math.radians(angle_deg)
    for _ in range(n):
        x, y = rng.uniform(0, w), rng.uniform(0, h)
        ln = length * rng.uniform(0.5, 1.4)
        x2, y2 = x + math.sin(ang) * ln, y + math.cos(ang) * ln
        cv2.line(layer, (int(x), int(y)), (int(x2), int(y2)), float(rng.uniform(0.4, 1.0)), 1, cv2.LINE_AA)
    return cv2.GaussianBlur(layer, (0, 0), blur)


def apply(bgr, rng, rainy=False, level=1.0, out_max=None, force=None):
    """bgr is uint8. level scales how strong the damage is: 0 none, 1 normal, 2 harsh.
    out_max shrinks the longest side to this many pixels. force holds settings for unusable photos."""
    force = force or {}
    h, w = bgr.shape[:2]
    img = srgb_to_lin(bgr[..., ::-1].astype(np.float32) / 255.0)  # linear RGB
    log = {}

    # 1. auto exposure: the phone brings the middle of the frame to a mid level, with some error
    c = img[h // 4: 3 * h // 4, w // 4: 3 * w // 4]
    med = float(np.median(0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]))
    target = rng.uniform(0.10, 0.22)  # linear, about 0.35 to 0.5 in sRGB
    gain = float(np.clip(target / max(med, 1e-4), 0.4, 6.0))
    if force.get("skip_ae"):  # glare and dark photos keep the exposure they were rendered with
        gain = 1.0
    img = img * gain
    log["exposure_gain"] = round(gain, 2)

    # 2. auto white balance pulls a colour cast part of the way back to grey, then it drifts a little.
    # The pull is limited so a green leaf does not turn grey.
    mean_c = img.reshape(-1, 3).mean(0)
    pull = (mean_c.mean() / np.maximum(mean_c, 1e-4)) ** rng.uniform(0.2, 0.6)
    img = img * np.clip(pull, 0.8, 1.25).astype(np.float32)
    wb = np.array([rng.normal(1.0, 0.03 * level), 1.0, rng.normal(1.0, 0.03 * level)], np.float32)
    img = img * wb

    # 3. soft highlight roll-off, then contrast and saturation like a phone's HDR look
    img = img / (1.0 + 0.25 * img)
    s = lin_to_srgb(img)
    contrast = rng.uniform(0.0, 0.35)
    s = s + contrast * (s - 0.5) * (1 - np.abs(2 * s - 1))
    gray = s.mean(2, keepdims=True)
    sat = rng.uniform(0.92, 1.22)
    s = np.clip(gray + (s - gray) * sat, 0, 1)

    # 4. blur: lens softness, hand shake or a missed focus
    r = rng.random()
    if force.get("blur_sigma"):
        sig = rng.uniform(*force["blur_sigma"])
        s = cv2.GaussianBlur(s, (0, 0), sig)
        log["blur_sigma"] = round(float(sig), 2)
    elif r < 0.50 * level:
        sig = rng.uniform(0.4, 1.4) * level
        s = cv2.GaussianBlur(s, (0, 0), sig)
        log["blur_sigma"] = round(float(sig), 2)
    elif r < 0.70 * level:
        k = int(rng.integers(5, 13))
        kern = np.zeros((k, k), np.float32)
        cv2.line(kern, (0, k // 2), (k - 1, k // 2), 1.0, 1)
        M = cv2.getRotationMatrix2D((k / 2 - 0.5, k / 2 - 0.5), float(rng.uniform(0, 180)), 1.0)
        kern = cv2.warpAffine(kern, M, (k, k))
        kern /= max(kern.sum(), 1e-6)
        s = cv2.filter2D(s, -1, kern)
        log["motion_px"] = k

    # 4b. final size: close-ups are small crops in the field sets
    if out_max and max(h, w) > out_max:
        f = out_max / max(h, w)
        s = cv2.resize(s, (int(round(w * f)), int(round(h * f))), interpolation=cv2.INTER_AREA)
        h, w = s.shape[:2]
        log["out_size"] = [w, h]

    # 5. resolution loss (digital zoom, messaging apps)
    if rng.random() < 0.40 * level:
        f = rng.uniform(0.45, 0.85)
        s = cv2.resize(cv2.resize(s, (int(w * f), int(h * f)), interpolation=cv2.INTER_AREA),
                       (w, h), interpolation=cv2.INTER_LINEAR)
        log["rescale"] = round(float(f), 2)

    # 6. sharpening, which phones overdo
    amt = rng.uniform(0.0, 0.7)
    s = np.clip(s + amt * (s - cv2.GaussianBlur(s, (0, 0), 1.6)), 0, 1)

    # 7. noise: stronger in dark frames
    dark = float(np.clip(1.4 - 2.2 * s.mean(), 0.2, 1.5))
    sig_n = rng.uniform(0.0, 0.022) * dark * level * force.get("noise_mult", 1.0)
    if sig_n > 0.002:
        luma = rng.normal(0, 1, (h, w, 1)).astype(np.float32)
        chroma = rng.normal(0, 1, (h, w, 3)).astype(np.float32)
        s = np.clip(s + sig_n * (0.7 * luma + 0.3 * chroma), 0, 1)
        log["noise"] = round(float(sig_n), 4)

    # 8. vignette
    v = rng.uniform(0.0, 0.28)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    rr = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    s = s * (1 - v * np.clip(rr - 0.3, 0, 1)[..., None] ** 1.5)

    # 9. falling rain in front of the lens
    if rainy and rng.random() < 0.40:
        layer = rain_streaks(h, w, rng, density=rng.uniform(3, 14), length=rng.uniform(10, 38),
                             angle_deg=rng.uniform(-18, 18), blur=rng.uniform(0.6, 1.4))
        a = rng.uniform(0.10, 0.28)
        s = np.clip(s + a * layer[..., None] * (1.0 - s * 0.4), 0, 1)
        log["rain_streaks"] = 1

    out = (np.clip(s, 0, 1) * 255 + 0.5).astype(np.uint8)[..., ::-1]
    q = int(rng.integers(52, 96))
    log["jpeg_q"] = q
    return np.ascontiguousarray(out), q, log


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="+")
    ap.add_argument("--out", required=True)
    ap.add_argument("--variants", type=int, default=1, help="how many phone versions per render")
    ap.add_argument("--level", type=float, default=1.0)
    a = ap.parse_args()
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    for f in a.files:
        p = Path(f)
        im = cv2.imread(str(p), cv2.IMREAD_COLOR)
        meta_p = p.with_suffix(".json")
        rainy = False
        if meta_p.exists():
            rainy = "rain" in json.load(open(meta_p)).get("preset", "") or "wet" in json.load(open(meta_p)).get("preset", "")
        for k in range(a.variants):
            rng = np.random.default_rng(zlib.crc32(f"{p.stem}-{k}".encode()))
            img, q, log = apply(im, rng, rainy, a.level)
            name = p.stem + (f"_p{k}" if a.variants > 1 else "") + ".jpg"
            cv2.imwrite(str(out / name), img, [cv2.IMWRITE_JPEG_QUALITY, q])
    print(f"wrote {len(a.files) * a.variants} images to {out}")


if __name__ == "__main__":
    main()
