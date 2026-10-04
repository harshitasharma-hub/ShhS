#!/usr/bin/env python3
"""Pick the best renders and real photos for the talk, shrink them, and write src/assets/.

Run from the presentation folder, then rebuild:
  python3 tools/prepare_assets.py          everything
  python3 tools/prepare_assets.py --lab    only the leaf lab pictures and src/labData.js (they come from ../site)
  npm run build

Sources are in the ShhS repo root (data/synthetic, data/field, data/bracol/raw, data/bracol).
To swap in a better render, change its path in the tables below and run this again.
Every image in the talk comes from one of these tables, so it is easy to check where it came from.
"""
import csv
import json
import os
import re
import random
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageFilter

HERE = Path(__file__).resolve().parent.parent          # presentation/talk/
ROOT = HERE.parent.parent                               # repo root
SYN = ROOT / "data" / "synthetic"
OUT = HERE / "src" / "assets"
BRACOL_IMG = ROOT / "data" / "bracol" / "raw" / "images"
MANIFEST = ROOT / "data" / "bracol" / "manifest.csv"
FIELD = ROOT / "data" / "field" / "uganda"
V2 = ROOT / "presentation" / "site"                     # the scroll site: the leaf lab (photo, cut-out, 3D leaf, eight scenes) comes from here
LAB_PREFIX = "leaf_"                                    # the lab pictures keep this prefix. A run without presentation/site leaves them alone.

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
# --- the leaf lab: one leaf (BRACOL 897) through six stages. Pictures and numbers come from presentation/site ---
# key, name on the chip, the order the scenes are listed in. The files are presentation/site/img/dial/897_<key>_raw.webp and _phone.webp.
LAB_PRESETS = [("overcast", "Overcast"), ("sun", "Sun"), ("golden", "Golden hour"), ("shade", "Shade"),
               ("backlit", "Backlit"), ("rain", "Rain"), ("sun_wet", "After rain"), ("studio", "Studio")]
# the three renders of leaf 897 that are in set 1 (data/synthetic/v1/jobs.json has exactly three jobs for it)
LAB_TRAIN = ["v0897_whole_0", "v0897_closeup_1", "v0897_whole_2"]
# the numbers of one render that the readouts show (the rest of the Blender log stays out)
LAB_META_KEYS = ["light", "sky", "sun_el", "sun_az", "kelvin", "sun_energy", "exposure_ev", "lens_mm", "fstop", "cam_tilt_deg",
                 "cam_dist_m", "leaf_len_m", "cover", "render_s", "seed", "phone"]

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


def copy_webp(src, name):
    """Copy a picture that is already a small WebP, as it is. A second encode would only lose quality."""
    dst = OUT / f"{name}.webp"
    shutil.copyfile(src, dst)
    written.append((name, "webp", os.path.getsize(dst)))


def lab():
    """The leaf lab: the photo, the cut-out, eight renders (raw and with phone effects) and the numbers behind them.

    Everything is copied from presentation/site, then src/labData.js is written from its data files.
    Without presentation/site the lab pictures and labData.js already in the folder stay as they are."""
    img = V2 / "img"
    if not img.exists():
        have = len(list(OUT.glob(f"{LAB_PREFIX}*")))
        print(f"presentation/site not found: the {have} lab pictures already in src/assets stay as they are")
        return
    copy_webp(img / "pipeline" / "897_original.webp", f"{LAB_PREFIX}photo")
    copy_webp(img / "pipeline" / "897_cutout.webp", f"{LAB_PREFIX}cutout")
    for i, tid in enumerate(LAB_TRAIN):
        copy_webp(img / "pipeline" / f"{tid}.webp", f"{LAB_PREFIX}train_{i}")
    meta = json.load(open(img / "dial" / "dial_meta.json"))
    whole = {it["preset"]: it for it in meta["items"] if it["mode"] == "whole"}
    presets = []
    for key, name in LAB_PRESETS:
        it = whole[key]
        copy_webp(img / "dial" / it["file_raw"], f"{LAB_PREFIX}{key}_raw")
        copy_webp(img / "dial" / it["file_phone"], f"{LAB_PREFIX}{key}_phone")
        m = it["meta"]
        presets.append({"key": key, "name": name, "raw": f"{LAB_PREFIX}{key}_raw", "phone": f"{LAB_PREFIX}{key}_phone",
                        "meta": {k: m[k] for k in LAB_META_KEYS if k in m}})
    # the lesions and the training renders of this leaf are in the generated data of presentation/site
    gen = (V2 / "src" / "data" / "generated.js").read_text()
    pipe, _ = json.JSONDecoder().raw_decode(gen[gen.index("export const PIPELINE = ") + len("export const PIPELINE = "):])
    counts, _ = json.JSONDecoder().raw_decode(gen[gen.index("export const COUNTS = ") + len("export const COUNTS = "):])
    train = [{"id": t["id"], "img": f"{LAB_PREFIX}train_{i}", "preset": t["preset"], "mode": t["mode"], "seed": t["seed"], "w": t["w"], "h": t["h"]}
             for i, t in enumerate(pipe["trainRenders"])]
    assert [t["id"] for t in train] == LAB_TRAIN, "the training renders in presentation/site changed: update LAB_TRAIN"
    # set 1, render by render: whether the leaf it was made from has rust, and where the renders of this leaf sit in the list
    jobs = json.load(open(SYN / "v1" / "jobs.json"))
    bracol = {r["id"]: r for r in csv.DictReader(open(MANIFEST))}
    set1 = {
        "n": len(jobs),
        "rustFlags": "".join("1" if bracol[str(j["leaf"])]["rust"] == "1" else "0" for j in jobs),
        "thisLeaf": [i for i, j in enumerate(jobs) if j["leaf"] == pipe["leafId"]],
    }
    assert set1["n"] == counts["synthetic"]["v1"] and len(set1["thisLeaf"]) == len(pipe["trainRenders"]), "set 1 changed: check presentation/site and data/synthetic/v1"
    data = {
        "leaf": {"id": pipe["leafId"], "labels": pipe["labels"], "textureW": pipe["textureW"], "textureH": pipe["textureH"]},
        "lesions": pipe["lesions"],
        "presets": presets,
        "train": train,
        "counts": {"texturesUsable": counts["textures"]["usable"], "texturesOfTrain": counts["textures"]["ofTrain"], "setV1": counts["synthetic"]["v1"]},
        "set1": set1,
    }
    body = ["// Generated by tools/prepare_assets.py from presentation/site. Do not edit by hand.",
            "// The numbers are the real log of each render (Blender job and phone effects), not made-up values.", ""]
    for key, label in (("leaf", "LEAF"), ("lesions", "LESIONS"), ("presets", "PRESETS"), ("train", "TRAIN"), ("counts", "COUNTS"), ("set1", "SET1")):
        text = json.dumps(data[key], indent=1)
        text = re.sub(r"\[\s+([-0-9.eE,\s]+?)\s+\]", lambda m: "[" + re.sub(r"\s+", " ", m.group(1)) + "]", text)   # numbers on one line
        body.append(f"export const {label} = {text};")
    (HERE / "src" / "labData.js").write_text("\n".join(body) + "\n")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for f in OUT.glob("*"):
        if f.suffix in (".jpg", ".webp") and not f.name.startswith(LAB_PREFIX):
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
    # BRACOL as a wall: 4 by 8 leaves on plain backgrounds, rust and no rust taking turns. Big tiles, so each leaf can be read.
    ids = [r["id"] for pair in zip(pick(other_t, 16), pick(rust_t, 16)) for r in pair]
    save(mosaic([BRACOL_IMG / f"{i}.jpg" for i in ids], 4, 8, 256, 128, 6), "mosaic_plain", quality=78)
    # the Kenya sample (128 px photos, the size of the copy we have): 35 of 197, drawn with a fixed seed so the classes are mixed
    kenya = sorted((ROOT / "data" / "field" / "kenya" / "images").glob("*.jpg"))
    save(mosaic(random.Random(11).sample(kenya, 35), 7, 5, 128, 128, 4), "mosaic_kenya", quality=80)
    # the two photo grids of the data-gap step: 32 lab photos (BRACOL) and 32 farm photos (Uganda), 8 by 4
    lab_ids = [r["id"] for pair in zip(pick(other_t, 16), pick(rust_t, 16)) for r in pair]
    save(mosaic([BRACOL_IMG / f"{i}.jpg" for i in lab_ids], 8, 4, 192, 96, 6), "mosaic_lab", quality=76)
    save(mosaic([ROOT / r["image"] for r in pick(fm, 32)], 8, 4, 128, 128, 4), "mosaic_farm", quality=74)

    # the leaf lab (presentation/site)
    lab()
    write_index()


def write_index():
    """The index the code imports from. It lists every picture in the folder, so the lab pictures stay in it
    when this script runs without presentation/site."""
    files = sorted((p for p in OUT.iterdir() if p.suffix in (".jpg", ".webp")), key=lambda p: p.stem)
    names = [p.stem for p in files]
    ext = {p.stem: p.suffix[1:] for p in files}
    lines = ["// Generated by tools/prepare_assets.py. Do not edit by hand.", ""]
    lines += [f"import {n} from './{n}.{ext[n]}';" for n in names]
    lines += ["", "export const IMG = {", *[f"  {n}," for n in names], "};", ""]
    (OUT / "index.js").write_text("\n".join(lines))

    sizes = [(p.stem, p.suffix[1:], p.stat().st_size) for p in files]
    total = sum(s for _, _, s in sizes)
    for n, e, s in sizes:
        print(f"{n}.{e:5} {s / 1024:7.1f} KB")
    print(f"\n{len(sizes)} files, {total / 1024 / 1024:.2f} MB (about {total * 1.34 / 1024 / 1024:.1f} MB once inlined)")


if __name__ == "__main__":
    if "--lab" in sys.argv[1:]:          # only the leaf lab pictures and src/labData.js, the rest stays as it is
        OUT.mkdir(parents=True, exist_ok=True)
        lab()
        write_index()
    else:
        sys.exit(main())
