#!/usr/bin/env python3
"""Pick the best renders and real photos for the talk, shrink them, and write src/assets/.

Run from the presentation folder, then rebuild:
  python3 tools/prepare_assets.py
  npm run build

Sources are in the ShhS repo root (data/synthetic, data/field, BRACOL_coffee_leaf_images, data/bracol).
To swap in a better render, change its path in the tables below and run this again.
Every image in the talk comes from one of these tables, so it is easy to check where it came from.
"""
import csv
import os
import sys
from pathlib import Path

from PIL import Image, ImageFilter

HERE = Path(__file__).resolve().parent.parent          # presentation/
ROOT = HERE.parent                                      # repo root
SYN = ROOT / "data" / "synthetic"
OUT = HERE / "src" / "assets"
BRACOL_IMG = ROOT / "BRACOL_coffee_leaf_images" / "images"
MANIFEST = ROOT / "data" / "bracol" / "manifest.csv"
FIELD = ROOT / "data" / "field" / "uganda"

# --- the same leaf (BRACOL 897, rust severity 4) in seven worlds, after the phone effects ------
WORLDS = {
    "world_overcast": "probe_phone2/k_897_overcast.jpg",
    "world_sun": "probe_phone2/k_897_sun.jpg",
    "world_golden": "probe_phone2/k_897_golden.jpg",
    "world_shade": "probe_phone2/k_897_shade.jpg",
    "world_backlit": "probe_phone2/k_897_backlit.jpg",
    "world_rain": "probe_phone2/v_897_rain.jpg",
    "world_afterrain": "probe_phone2/k_897_sun_wet.jpg",
}
# The same seven worlds before the phone effects: the plain Blender output.
CLEAN = {
    "render_overcast": "probe/k_897_overcast.png",
    "render_sun": "probe/k_897_sun.png",
    "render_golden": "probe/k_897_golden.png",
    "render_shade": "probe/k_897_shade.png",
    "render_backlit": "probe/k_897_backlit.png",
    "render_rain": "probe/v_897_rain.png",
    "render_afterrain": "probe/k_897_sun_wet.png",
}
# --- eight more source leaves: healthy, rust at other severities, and look-alike problems -----
LABELED = {
    "lab_960": "probe_phone2/v_960_overcast.jpg",
    "lab_891": "probe_phone2/v_891_sun.jpg",
    "lab_1664": "probe_phone2/v_1664_golden.jpg",
    "lab_1741": "probe_phone2/v_1741_shade.jpg",
    "lab_1046": "probe_phone2/v_1046_sun_wet.jpg",
    "lab_895": "probe_phone2/v_895_backlit.jpg",
    "lab_1016": "probe_phone2/v_1016_overcast.jpg",
    "lab_365": "probe_phone2/v_365_sun.jpg",
}
# --- photos the model should refuse ---------------------------------------------------------
BAD = {
    "bad_dark": "probe2/bad_dark.png",
    "bad_glare": "probe2/bad_glare.png",
    "bad_defocus": "probe2/bad_defocus.png",
    "bad_cropped": "probe2/bad_cropped.png",
    "bad_no_leaf": "probe2/bad_no_leaf.png",
    "bad_tiny": "probe2/bad_tiny.png",
}
# --- close-ups aimed at a lesion ------------------------------------------------------------
CLOSE = {
    "close_rain": "probe2/c_rust_rain.png",
    "close_sunwet": "probe2/c_brown_sunwet.png",
    "close_overcast": "probe2/c_rust_overcast.png",
    "close_sun": "probe2/c_rust_sun.png",
}
# --- real BRACOL train leaves: the sources of the renders above, and a few more -------------
TRAIN_LEAVES = [960, 897, 1664, 895, 1016, 365, 1741, 1046, 891]
# --- cut-outs for the severity ladder: severity 0 to 4 --------------------------------------
CUTOUTS = {0: 960, 1: 1664, 2: 1741, 3: 1046, 4: 897}

written = []


def save(img, name, ext="jpg", quality=82, **kw):
    path = OUT / f"{name}.{ext}"
    if ext == "jpg":
        img.convert("RGB").save(path, "JPEG", quality=quality, optimize=True, progressive=True, **kw)
    else:
        img.save(path, "WEBP", quality=quality, method=6, **kw)
    written.append((name, ext, os.path.getsize(path)))


def cover(img, w, h):
    """Scale to fill w by h, then crop the middle."""
    s = max(w / img.width, h / img.height)
    img = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    x, y = (img.width - w) // 2, (img.height - h) // 2
    return img.crop((x, y, x + w, y + h))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for f in OUT.glob("*"):
        if f.suffix in (".jpg", ".webp"):
            f.unlink()

    # the real photo that opens the reveal
    real = Image.open(BRACOL_IMG / "897.jpg")
    save(real.resize((1536, 768), Image.LANCZOS), "real_897", quality=84)

    for name, rel in CLEAN.items():
        save(Image.open(SYN / rel).convert("RGB"), name, quality=88)

    for table, quality in ((WORLDS, 84), (LABELED, 82), (BAD, 80)):
        for name, rel in table.items():
            im = Image.open(SYN / rel).convert("RGB")
            if name == "bad_no_leaf":                       # a square scene: keep the middle 2:1
                im = im.crop((0, (im.height - im.width // 2) // 2, im.width, (im.height + im.width // 2) // 2))
            save(im, name, quality=quality)
    for name, rel in CLOSE.items():
        save(Image.open(SYN / rel).convert("RGB"), name, quality=86)

    # real BRACOL train leaves as small 2:1 cards
    for i in TRAIN_LEAVES:
        save(Image.open(BRACOL_IMG / f"{i}.jpg").resize((512, 256), Image.LANCZOS), f"bracol_{i}", quality=80)

    # real BRACOL test leaves (the locked test), picked by label so the set is varied
    rows = list(csv.DictReader(open(MANIFEST)))
    test = [r for r in rows if r["split"] == "test"]
    picks = []
    for want in (lambda r: r["rust"] == "1" and r["severity"] == "1", lambda r: r["rust"] == "1" and r["severity"] == "3",
                 lambda r: r["group"] == "healthy", lambda r: r["group"] == "other", lambda r: r["rust"] == "1" and r["severity"] == "2",
                 lambda r: r["group"] == "healthy"):
        for r in test:
            if want(r) and r["id"] not in picks:
                picks.append(r["id"]); break
    for n, i in enumerate(picks):
        save(Image.open(BRACOL_IMG / f"{i}.jpg").resize((512, 256), Image.LANCZOS), f"test_{n + 1}", quality=80)

    # leaf cut-outs with transparency, for the severity ladder
    for sev, i in CUTOUTS.items():
        tex = Image.open(SYN / "textures" / f"{i}.jpg").convert("RGB")
        mask = Image.open(SYN / "textures" / f"{i}_mask.png").convert("L")
        if mask.size != tex.size:
            mask = mask.resize(tex.size, Image.LANCZOS)
        mask = mask.filter(ImageFilter.GaussianBlur(0.8))
        rgba = tex.convert("RGBA"); rgba.putalpha(mask)
        bbox = rgba.getbbox()
        if bbox: rgba = rgba.crop(bbox)
        s = 512 / rgba.width
        rgba = rgba.resize((512, max(1, round(rgba.height * s))), Image.LANCZOS)
        save(rgba, f"cut_{sev}", ext="webp", quality=86)

    # real farm photos (Uganda, smartphone, CC BY 4.0) for the field-test cards
    fm = list(csv.DictReader(open(FIELD / "manifest.csv")))
    field = [r for r in fm if r["rust"] == "1"][:3] + [r for r in fm if r["group"] == "healthy"][:1]
    for n, r in enumerate(field):
        im = Image.open(ROOT / r["image"]).convert("RGB")
        save(im.resize((256, 256), Image.LANCZOS), f"field_{n + 1}", quality=84)

    # the index the code imports from
    names = sorted(n for n, _, _ in written)
    ext = {n: e for n, e, _ in written}
    lines = ["// Generated by tools/prepare_assets.py. Do not edit by hand.", ""]
    lines += [f"import {n} from './{n}.{ext[n]}';" for n in names]
    lines += ["", "export const IMG = {", *[f"  {n}," for n in names], "};", ""]
    (OUT / "index.js").write_text("\n".join(lines))

    total = sum(s for _, _, s in written)
    for n, e, s in sorted(written):
        print(f"{n}.{e:5} {s / 1024:7.1f} KB")
    print(f"\n{len(written)} files, {total / 1024 / 1024:.2f} MB (about {total * 1.34 / 1024 / 1024:.1f} MB once inlined)")


if __name__ == "__main__":
    sys.exit(main())
