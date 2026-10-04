#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""Write data/synthetic/README.md from the manifests, so every number in it comes from the data.

  uv run scripts/synth/write_readme.py
"""
import csv
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SYN = ROOT / "data" / "synthetic"


def rows(path):
    return list(csv.DictReader(open(path))) if Path(path).exists() else []


def table(header, body):
    out = ["| " + " | ".join(header) + " |", "| " + " | ".join("---" for _ in header) + " |"]
    out += ["| " + " | ".join(str(c) for c in r) + " |" for r in body]
    return "\n".join(out)


def pct(a, b):
    return f"{100 * a / b:.0f}%" if b else "0%"


def main():
    v1 = rows(SYN / "v1" / "manifest.csv")
    bad = rows(SYN / "unusable" / "manifest.csv")
    train_ids = {r["id"] for r in rows(ROOT / "data" / "bracol" / "manifest.csv") if r["split"] == "train"}
    tex = [t for t in rows(SYN / "textures" / "textures.csv") if t["id"] in train_ids]
    ok = [t for t in tex if t["mask_ok"] == "1"]
    audit_p = SYN / "v1" / "audit_shortcuts.json"
    audit = json.loads(audit_p.read_text()) if audit_p.exists() else []
    n = len(v1)
    rust = sum(r["rust"] == "1" for r in v1)
    leaves = len({r["source_id"] for r in v1})
    modes = Counter(("studio" if r["preset"] == "studio" else r["mode"]) for r in v1)
    presets = Counter(r["preset"] for r in v1 if r["preset"] != "studio")
    sizes = Counter(f"{r['width']}x{r['height']}" for r in v1)
    bads = Counter(r["bad"] for r in bad)
    man = [r for r in rows(ROOT / "data" / "bracol" / "manifest.csv") if r["split"] == "train"]
    train_rust = sum(r["rust"] == "1" for r in man)
    severe_train = sum(r["rust"] == "1" and r["severity"] in ("3", "4") for r in man)
    per_leaf = Counter(r["source_id"] for r in v1)
    n_triple = sum(1 for c in per_leaf.values() if c >= 3)
    mode_names = {"whole": "Whole leaf in a field scene", "closeup": "Close-up of one spot on the leaf",
                  "studio": "Whole leaf on a plain light background"}
    lines = []
    w = lines.append
    w("# Synthetic coffee leaf photos")
    w("")
    w("These photos are rendered, not taken. Each one starts from a real BRACOL leaf photo from the train split. "
      "A script cuts the leaf out, bends it in 3D, and renders it in Blender with a chosen light, weather, background and camera. "
      "The label of the real leaf becomes the label of the render.")
    w("")
    w("We made them because BRACOL has one kind of picture: a whole leaf on a plain background. A farmer's phone photo is different. "
      "The World Bank brief says models trained on studio photos do badly in the field. "
      "The renders put the same leaves into scenes that look more like a field.")
    w("")
    w("## What is here")
    w("")
    w(table(["Folder", "What it holds"], [
        ["`v1/`", f"{n} training photos made from {leaves} train leaves. `images/`, `meta/` (the render settings of each photo) and `manifest.csv`."],
        *([["`v2/`", f"{len(rows(SYN / 'v2' / 'manifest.csv'))} more training photos from the same leaves, made with the same recipe and new random seeds. Same format as v1."]]
          if (SYN / "v2" / "manifest.csv").exists() else []),
        ["`unusable/`", f"{len(bad)} photos that no model should judge. For testing the 'not sure' answer only. Never train on them."],
        ["`textures/`", f"The leaf cut-outs the renders use: {len(ok)} of {len(tex)} train leaves passed the mask checks. Rebuild them with the scripts below."],
        ["`probe*`", "Early test renders. They are not part of any experiment."],
    ]))
    w("")
    w("## Counts in v1")
    w("")
    w(f"{n} photos. {rust} show a leaf with rust ({pct(rust, n)}) and {n - rust} do not. BRACOL train is {pct(train_rust, len(man))} rust. "
      f"The share is higher here because the {n_triple} leaves with rust severity 3 or 4 get three renders each.")
    w("")
    w(table(["Kind of photo", "Photos"], [[mode_names[k], modes[k]] for k in ("whole", "closeup", "studio")]))
    w("")
    w(table(["Light or weather", "Photos"], [[k, v] for k, v in sorted(presets.items(), key=lambda x: -x[1])]))
    w("")
    w("Sizes in pixels: " + ", ".join(f"{k} ({v})" for k, v in sizes.most_common()) + ".")
    w("")
    w("## How a photo is made")
    w("")
    w("1. `extract_textures.py` cuts the leaf out of the BRACOL photo. It learns the paper colour near the edges, keeps what differs from it, "
      "takes off pale patches that touch the leaf edge, and divides out the colour cast of the paper. "
      "Leaves with a broken outline, or with a large tan patch stuck to the edge (we think a finger or a piece of paper), are dropped.")
    w("2. `find_lesions.py` finds the yellow-orange spots (rust) and the dark brown patches (other damage) on each leaf.")
    w("3. `blender_render.py` bends the leaf into a 3D sheet with a fold, a droop, a twist and wavy edges, and puts the photo on it as colour and as a small relief. "
      "It adds sky or sun light, shade from leaves above, 5 to 24 blurred leaves and up to 2 stems behind, soil, and a phone-like camera with depth of field. "
      "In the rain scenes it adds water drops and a wet shine. A quick test render sets the exposure first, the way a phone meters a scene.")
    w("4. In a close-up, the camera looks at one spot. For a leaf with rust it looks at an orange spot, so the photo shows the thing the label is about. "
      "For other leaves it looks at a brown patch or a random place.")
    w("5. `phone_effects.py` adds what a phone does to the picture: white balance drift, contrast, sharpening, blur, a smaller size, sensor noise, vignette, "
      "JPEG damage, and sometimes rain streaks.")
    w("")
    w("`generate.py` plans and runs all of this. The same seed gives the same photo.")
    w("")
    w("## How to use them")
    w("")
    w("Training: pass `data/synthetic/v1/manifest.csv` to `scripts/train.py --synthetic-manifest`. It has the same columns as `data/bracol/manifest.csv`, "
      "and the `image` paths start at the repo root. Every row is `split` = train.")
    w("")
    w("The 'not sure' test: `data/synthetic/unusable/manifest.csv` has `expect_unsure` = 1 and the kind of damage in `bad` "
      "(no_leaf, tiny, defocus, glare, dark). `rust` is empty on purpose. Count how often the model answers 'not sure' for each kind. "
      "Some photos are less damaged than others, so do not expect 100%.")
    w("")
    w("Extra phone versions of the same render, if they exist, are in `manifest_variants.csv`. They are never in `manifest.csv`.")
    w("")
    w("## Labels and rules")
    w("")
    w("A render has the labels of its source leaf: `rust`, `miner`, `phoma`, `cercospora`, `severity`. The column `source_id` is the BRACOL id of that leaf.")
    w("")
    w("- Only leaves from the BRACOL train split are used. No val or test leaf feeds a render.")
    w("- For a run with a smaller real subset (10, 25 or 50%), use only the renders whose `source_id` is in that subset. "
      "Otherwise the other leaves leak in through the textures.")
    w("- Field photos in `data/field/` are for testing. They are never used to make or train on renders.")
    w("")
    w("These are synthetic scenes built from real leaf textures. They are not free of real data. Say so wherever you report results.")
    w("")
    w("## A shortcut we found in BRACOL")
    w("")
    if audit:
        b, s = audit[0], audit[1]
        w(f"The colour of the photo background predicts rust in BRACOL. A small model that sees only three numbers, the median Lab colour of the frame around each photo, "
          f"scores AUC {b['cv_logistic_auc']} for rust on the {b['n']} train photos. An AUC of 0.5 would mean the background says nothing. "
          f"Leaves with rust were photographed on other backgrounds than leaves without it. A model can use that.")
        w("")
        w(f"The same test on the whole-leaf synthetic photos ({s['n']} photos) gives AUC {s['cv_logistic_auc']}, because the background is random. "
          "`audit_shortcuts.py` repeats the check.")
    else:
        w("Not run yet. See `audit_shortcuts.py`.")
    w("")
    w("## What the photos do not cover")
    w("")
    w("- Real plants. The leaf is a bent sheet, the background leaves float with a few loose stems, and there are no berries, insects, hands or sky.")
    w(f"- Anything BRACOL does not show. Rust looks the way it looks on the {train_rust} train leaves with rust. Severity 3 and 4 come from only {severe_train} leaves.")
    w("- Real phone lenses, flare, and the processing inside a real phone.")
    w("")
    w("## Known problems")
    w("")
    w("- Some cut-outs have a small notch in the leaf edge, and a few keep a thin pale fringe.")
    w("- A close-up of a leaf with rust can still miss the rust if the colour finder picked the wrong blob. We did not check every photo.")
    w("- Rain streaks or heavy glare can hide small spots. The label stays the same.")
    w("")
    w("## Credit")
    w("")
    w("Leaf photos: BRACOL, by Krohling, Esgario and Ventura, Mendeley Data, doi 10.17632/yy2k5y8mxg.1, licence CC BY 4.0. "
      "These renders are adapted from it, so they carry the same credit. We took the photos from a complete copy on Hugging Face (luisangelico/bracol) because the Mendeley zip is cut off.")
    w("")
    w("## Rebuild")
    w("")
    w("```bash")
    w("uv run scripts/prepare_bracol.py                       # labels and splits")
    w("uv run scripts/synth/extract_textures.py --split train # cut-outs")
    w("uv run scripts/synth/find_lesions.py                   # where the spots are")
    w("uv run scripts/synth/generate.py v1                    # render and finish the photos")
    w("uv run scripts/synth/generate.py unusable              # the bad-photo test set")
    w("uv run scripts/synth/audit_shortcuts.py v1             # background check")
    w("```")
    w("")
    w("Blender 5.2 is needed at `/Applications/Blender.app`. The render took about "
      f"{sum(float(json.load(open(p)).get('render_s', 0)) + float(json.load(open(p)).get('setup_s', 0)) for p in list((SYN / 'v1' / 'meta').glob('*.json'))[:200]) / max(1, min(200, len(list((SYN / 'v1' / 'meta').glob('*.json'))))):.1f} s per photo on an M2.")
    (SYN / "README.md").write_text("\n".join(lines) + "\n")
    print(f"wrote {SYN / 'README.md'} ({len(lines)} lines)")


if __name__ == "__main__":
    main()
