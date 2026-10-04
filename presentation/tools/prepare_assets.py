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


def mosaic(paths, cols, rows, tw, th, gap, bg=(247, 248, 252)):
    """One picture made of cols x rows photos, each cropped to tw by th."""
    sheet = Image.new("RGB", (cols * tw + (cols - 1) * gap, rows * th + (rows - 1) * gap), bg)
    for i, p in enumerate(paths[: cols * rows]):
        sheet.paste(cover(Image.open(p).convert("RGB"), tw, th), ((i % cols) * (tw + gap), (i // cols) * (th + gap)))
    return sheet


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for f in OUT.glob("*"):
        if f.suffix in (".jpg", ".webp"):
            f.unlink()

    # the real photo that opens the reveal. The leaf sits where the rendered leaf sits (centre at 45.5% across,
    # 46% down, about 54% of the width), on its own paper colour, so the wipe reads as one leaf and a new world.
    real = Image.open(BRACOL_IMG / "897.jpg").convert("RGB")
    W, H = 1536, 768
    border = real.crop((0, 0, real.width, 24)).resize((1, 1), Image.BOX).getpixel((0, 0))
    paper = Image.new("RGB", (W, H), border)
    scale = 0.72
    pw, ph = int(W * scale), int(H * scale)
    photo = real.resize((pw, ph), Image.LANCZOS)
    leaf_dx, leaf_dy = round(21 * scale / 0.72), round(10 * scale / 0.72)   # the leaf sits a little right of and below the photo middle
    target = (round(W * 0.455), round(H * 0.46))
    at = (target[0] - leaf_dx - pw // 2, target[1] - leaf_dy - ph // 2)
    feather = 70
    mask = Image.new("L", (pw, ph), 0)
    mask.paste(255, (feather, feather, pw - feather, ph - feather))
    mask = mask.filter(ImageFilter.GaussianBlur(feather / 2.2))
    paper.paste(photo, at, mask)
    save(paper, "real_897", quality=86)

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
        # every cut-out sits in the middle of the same 2:1 canvas, so one 3D leaf can wear any of them
        canvas = Image.new("RGBA", (512, 256), (0, 0, 0, 0))
        canvas.paste(rgba, (0, (256 - rgba.height) // 2), rgba)
        save(canvas, f"cut_{sev}", ext="webp", quality=86)

    # real farm photos (Uganda, smartphone, CC BY 4.0) for the field-test cards.
    # Picked by eye from the rust-labelled photos: orange rust spots on green leaves, in the field.
    fm = list(csv.DictReader(open(FIELD / "manifest.csv")))
    rust_field = [r for r in fm if r["rust"] == "1"]
    for n, k in enumerate((5, 11, 28, 34, 20)):
        im = Image.open(ROOT / rust_field[k]["image"]).convert("RGB")
        save(im.resize((256, 256), Image.LANCZOS), f"field_{n + 1}", quality=84)

    # mosaics: one picture made of many real photos, for the walls in the data-gap steps
    rows_all = list(csv.DictReader(open(MANIFEST)))
    train = sorted((r for r in rows_all if r["split"] == "train"), key=lambda r: int(r["id"]))
    rust_t = [r for r in train if r["rust"] == "1"]
    other_t = [r for r in train if r["rust"] != "1"]
    pick = lambda lst, n: [lst[round(i * (len(lst) - 1) / (n - 1))] for i in range(n)]
    ids = [r["id"] for pair in zip(pick(other_t, 24), pick(rust_t, 24)) for r in pair]
    save(mosaic([BRACOL_IMG / f"{i}.jpg" for i in ids], 6, 8, 192, 96, 6), "mosaic_plain", quality=74)
    kenya = sorted((ROOT / "data" / "field" / "kenya" / "images").glob("*.jpg"))
    save(mosaic(pick(kenya, 98), 14, 7, 96, 96, 4), "mosaic_kenya", quality=72)

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
