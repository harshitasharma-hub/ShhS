#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow", "numpy", "opencv-python-headless"]
# ///
"""Build the real images and the data module for the presentation/site page.

  uv run --script presentation/site/tools/build_data.py

It reads the repo (runs/, results/calibration.md, data/, data/bracol/raw/) and writes only inside presentation/site/:
  img/{verdict,gap,synth,unusable,severity,pipeline}/*.webp, img/MANIFEST.md and src/data/generated.js.
It never trains or scores a model. It only reads the scores that finished runs already wrote.

Everything is seeded with 42 and nothing depends on the clock, so a rerun on the same inputs gives the same files.
A file whose bytes would not change is left alone, so a rerun after new runs land touches only generated.js (and MANIFEST.md when it changes).
generatedAt is the time of the newest input file that was read, newestRun is the time of the newest file under runs/.
Neither is the time of the build. Set BUILD_NOW=1 to stamp generatedAt with the build time.
The script checks every source image against the sha256 in its manifest, because the Mendeley BRACOL zip is cut off.
"""
import argparse
import csv
import datetime
import hashlib
import io
import json
import math
import os
import random
import re
import shutil
import statistics
import subprocess
import tempfile
from collections import Counter, OrderedDict
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageOps

HERE = Path(__file__).resolve().parent
OUT = HERE.parent  # presentation/site/
ROOT = OUT.parent.parent  # repo root
IMG = OUT / "img"
DATA_JS = OUT / "src" / "data" / "generated.js"
RUNS_DIR = ROOT / "runs"
LANCZOS = Image.Resampling.LANCZOS

SEED = 42
CV_SEED = 0  # the seed audit_shortcuts.py uses, so the AUC matches the README (0.738 and 0.497). Seed 42 gives 0.740 and 0.498.
ARMS = ("zeroshot", "real", "syn", "mix")
SHOWCASE = {"zeroshot": "zeroshot_d140_cuda", "real": "real_d140_f100_s0", "syn": "syn_d140_f0_s0", "mix": "mix_d140_f100_s0"}
SCORE_MODELS = {**SHOWCASE, "mix3": "mix-v3_d140_f100_s0", "mix4": "mix-combo_d140_f100_s0"}  # SCORES keys. The photo verdicts still use SHOWCASE.
UGANDA_G = {"healthy": 0, "other": 1, "rust": 2}  # the g column of SCORES.*.ugandaAll
ARM_NAME = {"zeroshot": "base", "real": "real", "syn": "syn", "mix": "mix"}
IMG_FOLDERS = ("verdict", "gap", "synth", "unusable", "severity", "pipeline")
CALIBRATION_MD = ROOT / "results" / "calibration.md"
# PLAIN cells: (arm, realPct, renderSet). A cell is the mean over the detail-140 runs that have scores_field_uganda_all.csv.
PLAIN_CELLS = [("zeroshot", None, "v1"), ("real", 10, "v1"), ("real", 100, "v1"), ("syn", 0, "v1"), ("mix", 10, "v1"), ("mix", 100, "v1"),
               ("syn", 0, "v3"), ("mix", 10, "v3"), ("mix", 100, "v3"), ("syn", 0, "combo"), ("mix", 100, "combo")]

CREDIT_BRACOL = "BRACOL, Krohling, Esgario and Ventura, CC BY 4.0"
CREDIT_UGANDA = "Uganda coffee leaf set, Chelangat, Anirwoth, Mayanja and Sserwadda, CC BY 4.0"
# key -> (short name, dataset, licence, credit text for the legend in MANIFEST.md)
SOURCES = {
    "bracol": ("BRACOL", "BRACOL coffee leaf images", "CC BY 4.0",
               "Krohling, Esgario and Ventura, Mendeley Data, doi 10.17632/yy2k5y8mxg.1. Real leaf photos on a plain background."),
    "uganda": ("Uganda", "Uganda smartphone coffee leaf set", "CC BY 4.0",
               "Chelangat, Anirwoth, Mayanja and Sserwadda (2025), Mendeley Data, doi 10.17632/k36wnd6knb.1. Smartphone photos from farms in Uganda, 256x256."),
    "kenya": ("Kenya", "Kenya JMuBEN coffee leaf sample", "CC BY 4.0",
              "JMuBEN and JMuBEN2, Mutira plantation, Kirinyaga county, Mendeley Data doi 10.17632/tgv3zb82nd.1 and 10.17632/t2r6rszp5c.1 (CC BY). "
              "We used the Hugging Face copy Project-AgML/arabica_coffee_leaf_disease_classification (CC BY 4.0). The colours in this copy look shifted."),
    "synthetic": ("Synthetic", "ShhS synthetic leaf renders (Blender)", "CC BY 4.0",
                  "This project rendered them from BRACOL train leaves, so they carry the BRACOL credit: Krohling, Esgario and Ventura, CC BY 4.0."),
}

# ---------------------------------------------------------------------------------------------------------------------
# Photos picked by eye. The rules for each role are checked on every run (see build_photos), so if a score changes and a
# rule stops holding, the script stops and says which photo to replace. Each tuple is (id, role, reason).
# The reason says what you see. The script adds which models get it right.
# ---------------------------------------------------------------------------------------------------------------------
BRACOL_PICKS = [
    (598, "rust34", "Heavy rust, severity 4."),
    (1493, "rust34", "Strong rust, severity 3. Large yellow patches."),
    (1329, "rust2", "Rust, severity 2. Clear orange spots."),
    (1422, "rust2", "Rust, severity 2. Many spots."),
    (1508, "mild_base_miss", "Mild rust, severity 1. One clear orange spot."),
    (619, "mild_mix_miss", "Mild rust, severity 1. One small spot near the edge."),
    (1443, "mild_all_ok", "Mild rust, severity 1. Several yellow spots."),
    (6, "healthy", "Healthy leaf."),
    (1196, "healthy", "Healthy, dark green leaf."),
    (845, "healthy", "Healthy, pale green leaf."),
    (243, "phoma", "Phoma damage, not rust. Dark lesions."),
    (70, "miner", "Leaf miner damage, not rust. Brown patches."),
    (1313, "cercospora", "Cercospora, not rust. Small spots, one with an orange centre."),
]
# Hero photos, in display order. The first is an easy rust. "uncertain" is the closest of the three near-threshold photos.
HERO_ORDER = [598, 6, 1508, 1329, 1196, "uncertain"]
UGANDA_PICKS = [
    ("fi_01174", "rust_mix_miss", "Rust. One small, blurry lesion."),
    ("fi_01243", "rust_ok", "Rust. Many clear orange lesions."),
    ("fi_01041", "rust_base_miss", "Rust. One big orange lesion."),
    ("fi_00752", "rust_ok", "Rust. Faint yellow spots on a dark leaf."),
    ("fi_00000", "healthy", "Healthy, bright green leaf."),
    ("fi_00274", "healthy", "Healthy, dark glossy leaf."),
    ("fi_00125", "healthy", "Healthy, pale blue-green leaf."),
    ("fi_01588", "phoma_mix_wrong", "Phoma spot with an orange ring, not rust."),
    ("fi_01367", "phoma_ok", "Phoma lesion on a bright leaf, not rust."),
    ("fi_01702", "phoma_ok", "Large brown phoma lesion, not rust."),
]
SEVERITY_PICKS = {0: [693, 694], 1: [1383, 1528], 2: [1344, 1382], 3: [1359, 1085], 4: [1308, 1297]}
UNUSABLE_PICKS = {
    "no_leaf": ["u0091_no_leaf_13", "u0404_no_leaf_27"],
    "tiny": ["u0298_tiny_4", "u1337_tiny_3"],
    "defocus": ["u0207_defocus_26", "u0815_defocus_25"],
    "glare": ["u1006_glare_4", "u1015_glare_24"],
    "dark": ["u0541_dark_2", "u1520_dark_11"],
}
PIPELINE_LEAF = 897
PIPELINE_RENDERS = ["v0897_whole_0", "v0897_closeup_1", "v0897_whole_2"]

# ---------------------------------------------------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------------------------------------------------
INPUTS = []  # every file read, to date generated.js by the newest one
SAVED = []  # every image this run produced: rel path, what, source key
WRITTEN = []  # the images among them that had to be written because the file was new or different
_verified = set()


def rng_for(name):
    return random.Random(f"{SEED}:{name}")


def num(x, digits=4):
    """A float rounded for the data file. None for missing or not-a-number."""
    if x is None:
        return None
    x = float(x)
    if math.isnan(x) or math.isinf(x):
        return None
    v = round(x, digits)
    return 0.0 if v == 0 else v


def r3(x):
    return num(x, 3)


def read_csv(path):
    path = Path(path)
    INPUTS.append(path)
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def read_json(path):
    path = Path(path)
    INPUTS.append(path)
    return json.loads(path.read_text())


def verify(rel, sha):
    """Stop when a source image does not match the checksum in its manifest."""
    if not sha or rel in _verified:
        return
    got = hashlib.sha256((ROOT / rel).read_bytes()).hexdigest()
    if got != sha:
        raise SystemExit(f"checksum mismatch for {rel}: manifest {sha[:12]}, file {got[:12]}")
    _verified.add(rel)


def load_rgb(rel, sha=None, draft=None):
    verify(rel, sha)
    with Image.open(ROOT / rel) as im:
        if draft:
            im.draft("RGB", draft)  # JPEG decode at 1/2, 1/4 or 1/8 size when the target is small
        im.load()
        return im.convert("RGB")


def save_webp(im, rel, what, source, quality=80, **kw):
    """Encode one WebP for img/. No EXIF, ICC or XMP is passed, so none is written.
    The file on disk is replaced only when the new bytes differ, so a rerun leaves an unchanged picture alone."""
    path = (IMG / rel).resolve()
    if IMG.resolve() not in path.parents:
        raise SystemExit(f"refusing to write outside img/: {path}")
    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=quality, method=6, **kw)
    data = buf.getvalue()
    if not path.exists() or path.read_bytes() != data:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        WRITTEN.append(rel)
    SAVED.append({"rel": rel, "what": what, "source": source})
    return path


def write_text_if_changed(path, text):
    """Write a text file only when its content differs. Returns True when it wrote."""
    path = Path(path)
    if path.exists() and path.read_text(encoding="utf-8") == text:
        return False
    path.write_text(text, encoding="utf-8")
    return True


def prune_stale():
    """Delete files in the folders this script owns that this run did not write (a pick that was replaced, for example)."""
    keep = {(IMG / e["rel"]).resolve() for e in SAVED}
    removed = []
    for folder in IMG_FOLDERS:
        base = IMG / folder
        if not base.exists():
            continue
        for p in sorted(base.rglob("*"), reverse=True):
            if p.is_file() and p.resolve() not in keep:
                p.unlink()
                removed.append(str(p.relative_to(IMG)))
            elif p.is_dir() and not any(p.iterdir()):
                p.rmdir()
    return removed


def kb(rel):
    return os.path.getsize(IMG / rel) / 1024


def auc(y, s):
    """Rank AUC with ties averaged. Same as audit_shortcuts.py and rust_common.py."""
    y, s = np.asarray(y, dtype=int), np.asarray(s, dtype=float)
    order = np.argsort(s, kind="mergesort")
    ranks = np.empty(len(s))
    ranks[order] = np.arange(1, len(s) + 1)
    for v in np.unique(s):
        idx = np.nonzero(s == v)[0]
        if len(idx) > 1:
            ranks[idx] = ranks[idx].mean()
    pos = int(y.sum())
    neg = len(y) - pos
    return float((ranks[y == 1].sum() - pos * (pos + 1) / 2) / (pos * neg))


def border_lab(rel, frac=0.04):
    """Median Lab colour of a thin frame around the picture. Copied from scripts/synth/audit_shortcuts.py."""
    im = cv2.imread(str(ROOT / rel), cv2.IMREAD_COLOR)
    if im is None:
        raise SystemExit(f"cannot read {rel}")
    h, w = im.shape[:2]
    b = max(4, int(frac * min(h, w)))
    edge = np.concatenate([im[:b].reshape(-1, 3), im[-b:].reshape(-1, 3), im[:, :b].reshape(-1, 3), im[:, -b:].reshape(-1, 3)])
    lab = cv2.cvtColor(edge.reshape(1, -1, 3).astype(np.float32) / 255.0, cv2.COLOR_BGR2LAB).reshape(-1, 3)
    return np.median(lab, axis=0)


def cv_auc(X, y, seed=0):
    """5-fold cross-validated logistic regression on 3 numbers. Copied from scripts/synth/audit_shortcuts.py."""
    X = (X - X.mean(0)) / (X.std(0) + 1e-9)
    X = np.c_[X, np.ones(len(X))]
    idx = np.random.default_rng(seed).permutation(len(y))
    scores = np.zeros(len(y))
    for f in np.array_split(idx, 5):
        tr = np.setdiff1d(idx, f)
        w = np.zeros(X.shape[1])
        for _ in range(500):
            p = 1 / (1 + np.exp(-X[tr] @ w))
            w -= 0.5 * X[tr].T @ (p - y[tr]) / len(tr)
        scores[f] = X[f] @ w
    return auc(y, scores)


def largest_remainder(total, weights):
    """Split an integer total across cells in proportion to weights. Ties go to the earlier cell."""
    s = float(sum(weights))
    raw = [total * w / s for w in weights]
    out = [int(math.floor(x)) for x in raw]
    order = sorted(range(len(raw)), key=lambda i: (-(raw[i] - out[i]), i))
    for i in order[: total - sum(out)]:
        out[i] += 1
    return out


def stratified_sample(rows, n, rng, key="group"):
    """n random photos with the same mix of groups as rows (largest remainder), then shuffled."""
    groups = {}
    for r in sorted(rows, key=lambda r: r["id"]):
        groups.setdefault(r[key], []).append(r)
    names = sorted(groups)
    pick = []
    for g, q in zip(names, largest_remainder(n, [len(groups[g]) for g in names])):
        pick += rng.sample(groups[g], q)
    rng.shuffle(pick)
    return pick


def padded(rel):
    """True for a photo with black bars: more than 20 solid-black rows or columns. A few Uganda photos have them."""
    with Image.open(ROOT / rel) as im:
        g = np.asarray(im.convert("L"))
    return int((g.max(axis=1) < 8).sum()) > 20 or int((g.max(axis=0) < 8).sum()) > 20


# ---------------------------------------------------------------------------------------------------------------------
# 2. RUNS
# ---------------------------------------------------------------------------------------------------------------------
def sev34(sev):
    n = sum(sev[k]["n"] for k in ("3", "4") if k in sev)
    return sum(sev[k]["sensitivity"] * sev[k]["n"] for k in ("3", "4") if k in sev) / n if n else None


def split_name(name):
    """'mix-v3_d140_f100_s0' -> ('mix', 'v3'). 'mix_d140_f100_s0' -> ('mix', None)."""
    arm, _, tag = name.split("_")[0].partition("-")
    return arm, (tag or None)


RENDER_SETS = ("v1", "v3", "combo")  # the sets the page knows. The page calls them set 1, set 3 and set 4.


def set_of_folder(folder):
    """data/synthetic/<folder>/manifest.csv -> render set. The folder combo_v1_v3rim is the set 'combo'."""
    return "combo" if folder.startswith("combo") else folder


def render_set(name, manifest, notes):
    """The synthetic render set a run trained on. The tag in the run name wins (mix-v3_..., mix-combo_...), then the folder of
    the manifest (data/synthetic/v3/, data/synthetic/combo_v1_v3rim/), and the default is 'v1'. zeroshot and real runs get 'v1' too,
    it only matters for syn and mix. A set the page does not know, or a name and a manifest that disagree, is noted."""
    tag = split_name(name)[1]
    folders = {set_of_folder(f) for f in re.findall(r"synthetic/([^/]+)/", manifest)}
    from_folder = (set_of_folder(re.search(r"synthetic/([^/]+)/", manifest).group(1)) if folders else None)
    if len(folders) > 1:
        notes.append(f"{name}: the manifests come from several render sets {sorted(folders)}, renderSet follows the name tag or the first manifest")
    label = tag or from_folder or "v1"
    if tag and from_folder and tag != from_folder:
        notes.append(f"{name}: the run name says {tag!r} but the manifest folder says {from_folder!r}, so renderSet is {label!r}")
    if label not in RENDER_SETS:
        notes.append(f"{name}: render set {label!r} is not one of {', '.join(RENDER_SETS)}")
    return label


_syn_rows = {}


def synthetic_manifest_paths(manifest):
    """train.py takes several manifests, comma separated."""
    return [p.strip() for p in manifest.split(",") if p.strip()]


def synthetic_train_rows(manifest):
    """The train rows of the synthetic manifest(s) of a run, as scripts/model/train.py reads them."""
    if manifest not in _syn_rows:
        _syn_rows[manifest] = [r for path in synthetic_manifest_paths(manifest) for r in read_csv(ROOT / path)
                               if r.get("split", "train") == "train"]
    return _syn_rows[manifest]


def uganda_all_block(d, notes):
    """Results on all 1,792 Uganda photos (the team's main field test), or None when the run has no field_uganda_all.json yet."""
    f = d / "field_uganda_all.json"
    if not f.exists():
        return None
    u = read_json(f)
    if u.get("n") != 1792 or not u.get("all_photos"):
        notes.append(f"{d.name}: field_uganda_all.json has n={u.get('n')} all_photos={u.get('all_photos')}, expected 1792 and true")
    return OrderedDict([
        ("n", u["n"]), ("auc", num(u["auc"])), ("aucLo", num(u["auc_ci95"][0])), ("aucHi", num(u["auc_ci95"][1])),
        ("acc", num(u["accuracy"])), ("sens", num(u["sensitivity"])), ("spec", num(u["specificity"])),
        ("healthyOk", num(u["by_group"].get("healthy", {}).get("correct"))), ("otherOk", num(u["by_group"].get("other", {}).get("correct"))),
        ("accIfTunedOnField", num(u["if_threshold_tuned_on_field"]["accuracy"])),
        ("thresholdTunedOnField", num(u["if_threshold_tuned_on_field"]["threshold"], 4)),
    ])


def build_runs(notes):
    splits = read_json(ROOT / "data/bracol/splits.json")
    runs, skipped = [], []
    for d in sorted(RUNS_DIR.iterdir()):
        if not d.is_dir():
            continue
        f = d / "metrics.json"
        if not f.exists():
            skipped.append(d.name)
            continue
        m = read_json(f)
        if "test" not in m:
            skipped.append(d.name + " (no test block)")
            continue
        arm = split_name(d.name)[0]
        if arm not in ARMS:
            skipped.append(d.name + " (unknown arm)")
            continue
        manifest = m.get("synthetic_manifest") or ""
        rset = render_set(d.name, manifest, notes)
        t = m["test"]
        fraction = m.get("fraction")
        seed = m.get("seed")
        # How many photos were real and how many synthetic. The runs wrote synthetic_photos = 0 (the "use all" flag),
        # so rebuild the number the way scripts/model/train.py picks its rows, then check it against train_photos.
        if arm == "zeroshot":
            train, syn_n = 0, 0
        else:
            train = m.get("train_photos")
            if fraction == 100:
                real_ids = set(splits["ids"]["train"])
            elif fraction:
                real_ids = set(splits["subsets_of_train"][str(seed)][str(fraction)])
            else:
                real_ids = set()
            if arm == "real":
                syn_n = 0
            elif not manifest or not all((ROOT / p).exists() for p in synthetic_manifest_paths(manifest)):
                notes.append(f"{d.name}: synthetic manifest {manifest!r} not found, syntheticPhotos set to null")
                syn_n = None
            else:
                syn_train = synthetic_train_rows(manifest)
                if arm == "mix" and 0 < fraction < 100:
                    syn_n = sum(1 for r in syn_train if int(r["source_id"]) in real_ids)
                else:
                    syn_n = len(syn_train)
            if syn_n is not None and train is not None and len(real_ids) + syn_n != train:
                notes.append(f"{d.name}: real {len(real_ids)} + synthetic {syn_n} != train_photos {train}, syntheticPhotos set to null")
                syn_n = None
        sev, grp = t.get("rust_sensitivity_by_severity", {}), t.get("by_group", {})
        ns = m.get("not_sure", {})
        rec = OrderedDict()
        rec["name"] = d.name
        rec["arm"] = arm
        rec["renderSet"] = rset
        rec["detail"] = m.get("detail")
        rec["realPct"] = None if arm == "zeroshot" else fraction
        rec["seed"] = None if arm == "zeroshot" else seed
        rec["trainPhotos"] = train
        rec["syntheticPhotos"] = syn_n
        rec["trainMinutes"] = num(m["train_seconds"] / 60, 1) if m.get("train_seconds") else None
        rec["gpu"] = m.get("device")
        rec["thresholdFromVal"] = num(m.get("threshold_from_val"), 4)
        rec["bracol"] = OrderedDict([
            ("n", t["n"]), ("auc", num(t["auc"])), ("aucLo", num(t["auc_ci95"][0])), ("aucHi", num(t["auc_ci95"][1])),
            ("acc", num(t["accuracy"])), ("accLo", num(t["accuracy_ci95"][0])), ("accHi", num(t["accuracy_ci95"][1])),
            ("sens", num(t["sensitivity"])), ("spec", num(t["specificity"])), ("f1", num(t["f1"])),
            ("healthyOk", num(grp.get("healthy", {}).get("correct"))), ("otherOk", num(grp.get("other", {}).get("correct"))),
            ("sev1", num(sev.get("1", {}).get("sensitivity"))), ("sev2", num(sev.get("2", {}).get("sensitivity"))),
            ("sev34", num(sev34(sev))),
            ("notSure", OrderedDict([("margin", num(ns.get("margin_from_val"))), ("coverage", num(ns.get("test", {}).get("coverage"))),
                                     ("accuracy", num(ns.get("test", {}).get("accuracy_answered")))])),
        ])
        g = d / "field_uganda.json"
        if g.exists():
            u = read_json(g)
            rec["uganda"] = OrderedDict([
                ("n", u["n"]), ("auc", num(u["auc"])), ("aucLo", num(u["auc_ci95"][0])), ("aucHi", num(u["auc_ci95"][1])),
                ("acc", num(u["accuracy"])), ("sens", num(u["sensitivity"])), ("spec", num(u["specificity"])),
                ("otherOk", num(u["by_group"].get("other", {}).get("correct"))),
                ("accIfTunedOnField", num(u["if_threshold_tuned_on_field"]["accuracy"])),
            ])
        else:
            rec["uganda"] = None
        rec["ugandaAll"] = uganda_all_block(d, notes)
        g = d / "field_kenya.json"
        if g.exists():
            k = read_json(g)
            rec["kenya"] = OrderedDict([("n", k["n"]), ("auc", num(k["auc"])), ("acc", num(k["accuracy"])),
                                        ("sens", num(k["sensitivity"])), ("spec", num(k["specificity"]))])
        else:
            rec["kenya"] = None
        runs.append(rec)
    set_order = {s: i for i, s in enumerate(RENDER_SETS)}
    runs.sort(key=lambda r: (ARMS.index(r["arm"]), r["detail"] or 0, set_order.get(r["renderSet"], len(set_order)), r["renderSet"],
                             r["realPct"] or 0, r["seed"] or 0, r["name"]))
    return runs, skipped


# ---------------------------------------------------------------------------------------------------------------------
# 3. SCORES
# ---------------------------------------------------------------------------------------------------------------------
def score_out(x, thr, margin):
    """A score rounded to 3 decimals, except where that would move it across the threshold or the not-sure edge.
    Those few keep their 4th decimal, so a comparison in the page gives the same answer as in the run files."""
    x = float(x)
    v = round(x, 3)
    flips = (v >= thr) != (x >= thr) or (abs(v - thr) >= margin - 1e-9) != (abs(x - thr) >= margin - 1e-9)
    return num(x, 4) if flips else num(v, 3)


def build_scores(notes):
    scores, raw = OrderedDict(), {}
    for arm, run in SCORE_MODELS.items():
        d = RUNS_DIR / run
        if not (d / "metrics.json").exists():
            raise SystemExit(f"the showcase run {run} has no metrics.json")
        m = read_json(d / "metrics.json")
        # Scores get 3 decimals. The threshold and the margin keep 4 (zeroshot is -9.5625 and 4.4375), because a score that sits
        # exactly on either line must still land on the same side as in the run files. check_scores proves it.
        thr, margin = num(m["threshold_from_val"], 4), num(m["not_sure"]["margin_from_val"], 4)
        entry = OrderedDict([("run", run), ("threshold", thr), ("notSureMargin", margin)])
        raw[arm] = {"threshold": m["threshold_from_val"], "margin": m["not_sure"]["margin_from_val"], "metrics": m}
        for key, fname in (("bracolVal", "scores_val.csv"), ("bracolTest", "scores_test.csv"), ("uganda", "scores_field_uganda.csv"),
                           ("ugandaAll", "scores_field_uganda_all.csv")):
            f = d / fname
            if not f.exists():
                entry[key] = None
                raw[arm][key] = None
                notes.append(f"MISSING {run}/{fname}: SCORES.{arm}.{key} is null")
                continue
            rows = read_csv(f)
            if key == "ugandaAll":  # [id, y, score, g] with g 0 healthy, 1 other (phoma), 2 rust
                entry[key] = [[r["id"], int(r["rust"]), score_out(r["score"], thr, margin), UGANDA_G[r["group"]]] for r in rows]
                raw[arm][key] = [(r["id"], int(r["rust"]), float(r["score"])) for r in rows]
                if Counter(row[3] for row in entry[key]) != {0: 737, 1: 450, 2: 605}:
                    notes.append(f"{run}: ugandaAll group counts {dict(Counter(row[3] for row in entry[key]))}, expected 737 healthy, 450 other, 605 rust")
                continue
            cast = str if key == "uganda" else int
            entry[key] = [[cast(r["id"]), int(r["rust"]), score_out(r["score"], thr, margin)] for r in rows]
            raw[arm][key] = [(cast(r["id"]), int(r["rust"]), float(r["score"])) for r in rows]
        scores[arm] = entry
    # the page can index across models by position only if every model lists the photos in the same order
    for key in ("bracolVal", "bracolTest", "uganda", "ugandaAll"):
        orders = {arm: [row[0] for row in scores[arm][key]] for arm in scores if scores[arm][key] is not None}
        if len({tuple(v) for v in orders.values()}) > 1:
            notes.append(f"ORDER differs between models in SCORES.*.{key}")
    return scores, raw


def check_scores(scores, raw, notes):
    """Rebuild AUC, accuracy and not-sure coverage from the exported arrays and compare them with the run files."""
    rows = []
    for arm, run in SCORE_MODELS.items():
        m = raw[arm]["metrics"]
        thr, margin = scores[arm]["threshold"], scores[arm]["notSureMargin"]
        out = {"arm": arm, "run": run}
        if scores[arm]["bracolTest"] is not None:
            y = [r[1] for r in scores[arm]["bracolTest"]]
            s = [r[2] for r in scores[arm]["bracolTest"]]
            a = auc(y, s)
            pred = [v >= thr for v in s]
            acc = sum(p == (t == 1) for p, t in zip(pred, y)) / len(y)
            cov = sum(abs(v - thr) >= margin - 1e-9 for v in s) / len(y)
            out.update(test_auc=a, test_auc_json=m["test"]["auc"], test_acc=acc, test_acc_json=m["test"]["accuracy"],
                       cov=cov, cov_json=m["not_sure"]["test"]["coverage"])
            if abs(a - m["test"]["auc"]) > 0.002:
                raise SystemExit(f"{run}: bracolTest AUC {a:.4f} from SCORES differs from metrics.json {m['test']['auc']:.4f}")
            if abs(acc - m["test"]["accuracy"]) > 1e-9:
                raise SystemExit(f"{run}: accuracy from rounded scores {acc:.4f} differs from metrics.json {m['test']['accuracy']:.4f}")
            if abs(cov - m["not_sure"]["test"]["coverage"]) > 1e-9:
                raise SystemExit(f"{run}: not-sure coverage from the exported numbers {cov:.4f} differs from metrics.json "
                                 f"{m['not_sure']['test']['coverage']:.4f}")
        for key, fname, tag in (("uganda", "field_uganda.json", "uganda"), ("ugandaAll", "field_uganda_all.json", "all")):
            if scores[arm][key] is None:
                continue
            f = RUNS_DIR / run / fname
            if not f.exists():
                notes.append(f"{run}: SCORES.{arm}.{key} has scores but {fname} is missing, so it was not checked")
                continue
            u = read_json(f)
            y = [r[1] for r in scores[arm][key]]
            s = [r[2] for r in scores[arm][key]]
            a = auc(y, s)
            acc = sum((v >= thr) == (t == 1) for v, t in zip(s, y)) / len(y)
            out.update({f"{tag}_auc": a, f"{tag}_auc_json": u["auc"], f"{tag}_acc": acc, f"{tag}_acc_json": u["accuracy"]})
            if abs(a - u["auc"]) > 0.002:
                raise SystemExit(f"{run}: {key} AUC {a:.4f} from SCORES differs from {fname} {u['auc']:.4f}")
            if abs(acc - u["accuracy"]) > 1e-9:
                raise SystemExit(f"{run}: {key} accuracy from rounded scores {acc:.4f} differs from {fname} {u['accuracy']:.4f}")
        rows.append(out)
    return rows


# ---------------------------------------------------------------------------------------------------------------------
# 4. PHOTOS (the try-it demo and the hero)
# ---------------------------------------------------------------------------------------------------------------------
def models_phrase(arms):
    names = [ARM_NAME[a] for a in arms]
    if len(names) == 1:
        return f"The {names[0]} model"
    return "The " + ", ".join(names[:-1]) + " and " + names[-1] + " models"


def verdict_phrase(rust, says):
    """Which models are right, in plain words. says maps arm -> True when the model answers rust."""
    wrong = [a for a in ARMS if says[a] is not None and says[a] != bool(rust)]
    if not wrong:
        return "All four models get it right."
    if len(wrong) == 4:
        return "All four models miss it." if rust else "All four models wrongly say rust."
    one = len(wrong) == 1
    verb = ("misses" if one else "miss") + " it" if rust else ("wrongly says" if one else "wrongly say") + " rust"
    return f"{models_phrase(wrong)} {verb}."


def describe(r):
    """What a photo shows, from its labels."""
    if r["group"] == "rust":
        return f"Rust, severity {r['severity']}."
    if r["group"] == "healthy":
        return "Healthy leaf."
    names = {"miner": "Leaf miner", "phoma": "Phoma", "cercospora": "Cercospora"}
    found = [names[k] for k in names if r[k] == "1"]
    return " and ".join(found) + " damage, not rust."


def build_photos(scores, notes):
    man = {r["id"]: r for r in read_csv(ROOT / "data/bracol/manifest.csv")}
    umm = {r["id"]: r for r in read_csv(ROOT / "data/field/uganda/manifest.csv")}
    thr = {a: scores[a]["threshold"] for a in ARMS}
    bt = {a: ({row[0]: (row[1], row[2]) for row in scores[a]["bracolTest"]} if scores[a]["bracolTest"] else {}) for a in ARMS}
    ug = {a: ({row[0]: (row[1], row[2]) for row in scores[a]["uganda"]} if scores[a]["uganda"] else {}) for a in ARMS}

    def says(table, key):
        return {a: (table[a][key][1] >= thr[a]) if key in table[a] else None for a in ARMS}

    def score_map(table, key):
        return OrderedDict((a, table[a][key][1] if key in table[a] else None) for a in ARMS)

    # ---- BRACOL: check the roles, then add the three photos closest to the mix threshold
    test_ids = {i for i, r in man.items() if r["split"] == "test"}
    problems = []
    flags = lambda r: [k for k in ("miner", "phoma", "cercospora") if r[k] == "1"]
    for pid, role, _ in BRACOL_PICKS:
        r = man[str(pid)]
        v = says(bt, pid)
        right = {a: v[a] == (r["rust"] == "1") for a in ARMS}
        ok = r["split"] == "test"
        if role == "rust34":
            ok &= r["group"] == "rust" and r["severity"] in ("3", "4")
        elif role == "rust2":
            ok &= r["group"] == "rust" and r["severity"] == "2"
        elif role.startswith("mild"):
            ok &= r["group"] == "rust" and r["severity"] == "1"
            if role == "mild_base_miss":
                ok &= not right["zeroshot"] and right["mix"]
            elif role == "mild_mix_miss":
                ok &= not right["mix"]
            else:
                ok &= all(right.values())
        elif role == "healthy":
            ok &= r["group"] == "healthy" and all(right.values())
        elif role in ("miner", "phoma", "cercospora"):
            ok &= r["group"] == "other" and flags(r) == [role]
        if not ok:
            problems.append(f"#{pid} no longer fits role {role}")
    if not any(bt["mix"][p][1] >= thr["mix"] for p, role, _ in BRACOL_PICKS if role in ("miner", "phoma", "cercospora")):
        problems.append("none of the other-disease picks is wrong for the mix model")
    if sum(1 for p, role, _ in BRACOL_PICKS if role.startswith("mild")) != 3:
        problems.append("need exactly 3 severity 1 picks")
    if problems:
        raise SystemExit("PHOTOS rules broken: " + "; ".join(problems))

    chosen = {p for p, _, _ in BRACOL_PICKS}
    pool = sorted(test_ids - {str(c) for c in chosen}, key=int)
    near = sorted(pool, key=lambda i: (round(abs(bt["mix"][int(i)][1] - thr["mix"]), 3), int(i)))[:3]
    uncertain = [int(i) for i in near]

    entries = []
    for pid, role, reason in BRACOL_PICKS:
        entries.append((pid, role, reason))
    for pid in uncertain:
        s = bt["mix"][pid][1]
        entries.append((pid, "uncertain", f"{describe(man[str(pid)])} The mix score ({s:.1f}) is right next to its threshold ({thr['mix']:.1f}), so the mix model is unsure."))

    hero_ids = []
    for h in HERO_ORDER:
        hero_ids.append(uncertain[0] if h == "uncertain" else h)
    # check the hero rules
    for i, h in enumerate(hero_ids):
        r = man[str(h)]
        v = says(bt, h)
        right = {a: v[a] == (r["rust"] == "1") for a in ARMS}
        if i in (0, 3) and not (r["group"] == "rust" and int(r["severity"]) >= 2 and all(right.values())):
            raise SystemExit(f"hero #{h} is not an easy rust")
        if i == 2 and not (r["group"] == "rust" and r["severity"] == "1" and right["mix"] and not right["zeroshot"]):
            raise SystemExit(f"hero #{h} is not a mild rust that the base model misses")
        if i in (1, 4) and not (r["group"] == "healthy" and all(right.values())):
            raise SystemExit(f"hero #{h} is not a healthy leaf that all models get right")
    if len(set(hero_ids)) != 6:
        raise SystemExit("the 6 hero photos must be different")

    photos = []
    for pid, role, reason in entries:
        r = man[str(pid)]
        v = says(bt, pid)
        rel = f"img/verdict/b{pid}.webp"
        what = {"rust": f"BRACOL test photo {pid}, rust severity {r['severity']}", "healthy": f"BRACOL test photo {pid}, healthy leaf"}.get(
            r["group"], f"BRACOL test photo {pid}, other disease ({'+'.join(flags(r))}), severity {r['severity']}")
        im = load_rgb(r["image"], r["sha256"]).resize((1200, 600), LANCZOS)
        save_webp(im, rel[4:], what + ", 1200x600", "bracol", quality=78)
        photos.append(OrderedDict([
            ("id", f"b{pid}"), ("set", "bracol"), ("file", rel), ("w", 1200), ("h", 600), ("rust", int(r["rust"])),
            ("group", r["group"]), ("severity", int(r["severity"])), ("hero", pid in hero_ids),
            ("note", f"{reason} {verdict_phrase(int(r['rust']), v)}"), ("credit", CREDIT_BRACOL), ("scores", score_map(bt, pid)),
            ("_role", role)]))

    # ---- Uganda
    inv = [i for i, r in umm.items() if r["in_eval"] == "1"]
    problems = []
    for uid, role, _ in UGANDA_PICKS:
        r = umm[uid]
        v = says(ug, uid)
        right = {a: v[a] == (r["rust"] == "1") for a in ARMS}
        ok = uid in inv
        if role.startswith("rust"):
            ok &= r["group"] == "rust"
            if role == "rust_mix_miss":
                ok &= not right["mix"]
            elif role == "rust_base_miss":
                ok &= not right["zeroshot"] and right["mix"]
            else:
                ok &= all(right.values())
        elif role == "healthy":
            ok &= r["group"] == "healthy" and all(right.values())
        else:
            ok &= r["group"] == "other" and r["label_name"] == "phoma"
            if role == "phoma_mix_wrong":
                ok &= not right["mix"]
            else:
                ok &= all(right.values())
        if not ok:
            problems.append(f"{uid} no longer fits role {role}")
    cnt = Counter(role.split("_")[0] for _, role, _ in UGANDA_PICKS)
    if cnt != {"rust": 4, "healthy": 3, "phoma": 3}:
        problems.append(f"Uganda picks are {dict(cnt)}")
    if problems:
        raise SystemExit("Uganda PHOTOS rules broken: " + "; ".join(problems))
    for uid, role, reason in UGANDA_PICKS:
        r = umm[uid]
        v = says(ug, uid)
        rel = f"img/verdict/u_{uid}.webp"
        im = load_rgb(r["image"], r["sha256"]).resize((512, 512), LANCZOS)
        save_webp(im, rel[4:], f"Uganda field photo {uid} ({r['label_name']}), 256x256 upsampled to 512x512", "uganda", quality=82)
        photos.append(OrderedDict([
            ("id", f"u_{uid}"), ("set", "uganda"), ("file", rel), ("w", 512), ("h", 512), ("rust", int(r["rust"])),
            ("group", r["group"]), ("severity", None), ("hero", False),
            ("note", f"{reason} {verdict_phrase(int(r['rust']), v)}"), ("credit", CREDIT_UGANDA), ("scores", score_map(ug, uid)),
            ("_role", role)]))

    # heroes first, in display order, then the other BRACOL photos, then Uganda
    order = {f"b{h}": i for i, h in enumerate(hero_ids)}
    photos.sort(key=lambda p: (order.get(p["id"], 100 + (0 if p["set"] == "bracol" else 100)),))
    # stable sort keeps the planned order inside each group
    table = [(p["id"], p["_role"], p["hero"], p["rust"], p["group"], p["severity"], dict(p["scores"])) for p in photos]
    for p in photos:
        del p["_role"]
    return photos, table, {"uncertain": uncertain, "hero": hero_ids}


# ---------------------------------------------------------------------------------------------------------------------
# 5. GAP sprites
# ---------------------------------------------------------------------------------------------------------------------
def sprite(rows, cols, nrows, tw, th, make_tile):
    sheet = Image.new("RGB", (cols * tw, nrows * th), (255, 255, 255))
    for i, r in enumerate(rows):
        sheet.paste(make_tile(r), ((i % cols) * tw, (i // cols) * th))
    return sheet


def build_gap():
    out = OrderedDict()
    # BRACOL: 112 of all 1,747 photos, 39% rust, whole photo at 128x64
    rows = read_csv(ROOT / "data/bracol/manifest.csv")
    rng = rng_for("gap:bracol")
    rust = sorted([r for r in rows if r["rust"] == "1"], key=lambda r: int(r["id"]))
    rest = sorted([r for r in rows if r["rust"] != "1"], key=lambda r: int(r["id"]))
    n_rust = round(0.39 * 112)
    pick = rng.sample(rust, n_rust) + rng.sample(rest, 112 - n_rust)
    rng.shuffle(pick)
    sheet = sprite(pick, 14, 8, 128, 64, lambda r: load_rgb(r["image"], r["sha256"], draft=(256, 128)).resize((128, 64), LANCZOS))
    save_webp(sheet, "gap/bracol.webp", "Sprite sheet of 112 BRACOL photos (14 x 8 tiles of 128x64, 39% rust). Each tile is the whole photo, shrunk. Tiles run row by row", "bracol")
    out["bracol"] = OrderedDict([("file", "img/gap/bracol.webp"), ("cols", 14), ("rows", 8), ("tileW", 128), ("tileH", 64),
                                 ("tiles", [OrderedDict([("id", int(r["id"])), ("rust", int(r["rust"])), ("group", r["group"])]) for r in pick])])
    # Uganda: 112 random photos with the same mix of groups as the set, 128x128. Photos with black bars are left out of the draw.
    rows = [r for r in read_csv(ROOT / "data/field/uganda/manifest.csv") if not padded(r["image"])]
    pick = stratified_sample(rows, 112, rng_for("gap:uganda"))
    sheet = sprite(pick, 14, 8, 128, 128, lambda r: load_rgb(r["image"], r["sha256"]).resize((128, 128), LANCZOS))
    save_webp(sheet, "gap/uganda.webp", "Sprite sheet of 112 random Uganda field photos (14 x 8 tiles of 128x128, same mix of rust, healthy and phoma as the set), row by row", "uganda")
    out["uganda"] = OrderedDict([("file", "img/gap/uganda.webp"), ("cols", 14), ("rows", 8), ("tileW", 128), ("tileH", 128),
                                 ("tiles", [OrderedDict([("id", r["id"]), ("rust", int(r["rust"])), ("group", r["group"])]) for r in pick])])
    # Kenya: 32 random photos with the same mix of groups as the set, 96x96 (a few are not square, so centre-crop)
    rows = [r for r in read_csv(ROOT / "data/field/kenya/manifest.csv") if not padded(r["image"])]
    pick = stratified_sample(rows, 32, rng_for("gap:kenya"))
    sheet = sprite(pick, 8, 4, 96, 96, lambda r: ImageOps.fit(load_rgb(r["image"], r["sha256"]), (96, 96), LANCZOS))
    save_webp(sheet, "gap/kenya.webp", "Sprite sheet of 32 random Kenya photos (8 x 4 tiles of 96x96, centre-cropped, same mix of groups as the set), row by row", "kenya")
    out["kenya"] = OrderedDict([("file", "img/gap/kenya.webp"), ("cols", 8), ("rows", 4), ("tileW", 96), ("tileH", 96),
                                ("tiles", [OrderedDict([("id", r["id"]), ("rust", int(r["rust"])), ("group", r["group"])]) for r in pick])])
    return out


# ---------------------------------------------------------------------------------------------------------------------
# 6. SHORTCUT (does the picture frame alone predict rust?)
# ---------------------------------------------------------------------------------------------------------------------
def build_shortcut(notes):
    bracol = [r for r in read_csv(ROOT / "data/bracol/manifest.csv") if r["split"] == "train"]
    syn = [r for r in read_csv(ROOT / "data/synthetic/v1/manifest.csv") if r["mode"] == "whole" and r["rust"] in ("0", "1")]
    edges = [round(-9.0 + 0.7 * k, 1) for k in range(31)]  # one shared range for both sets, 30 bins
    res = OrderedDict()
    for key, rows, want in (("bracol", bracol, 0.738), ("synthetic", syn, 0.497)):
        for r in rows:
            verify(r["image"], r["sha256"])
        X = np.array([border_lab(r["image"]) for r in rows])
        y = np.array([int(r["rust"]) for r in rows])
        a_all = X[:, 1]
        if a_all.min() < edges[0] or a_all.max() > edges[-1]:
            raise SystemExit(f"{key}: a* outside the shared histogram range {edges[0]} to {edges[-1]}")
        score = cv_auc(X, y, CV_SEED)
        if abs(score - want) > 0.01:
            raise SystemExit(f"{key}: shortcut AUC {score:.3f} is not within 0.01 of {want}")
        notes.append(f"shortcut {key}: cv AUC {score:.4f} with seed {CV_SEED}, {cv_auc(X, y, SEED):.4f} with seed {SEED} (README says {want})")
        hist = OrderedDict([("edges", edges)])
        for name, mask in (("rust", y == 1), ("norust", y == 0)):
            counts, _ = np.histogram(a_all[mask], bins=edges)
            dens = [round(float(c) / int(mask.sum()), 4) for c in counts]
            dens[int(np.argmax(dens))] = round(dens[int(np.argmax(dens))] + (1 - sum(dens)), 4)  # make each class sum to 1
            hist[name] = dens
        res[key] = OrderedDict([("n", len(rows)), ("auc", round(score, 3)),
                                ("a", OrderedDict([("rust", sorted(round(float(v), 2) for v in a_all[y == 1])),
                                                   ("norust", sorted(round(float(v), 2) for v in a_all[y == 0]))])),
                                ("hist", hist)])
    return res


# ---------------------------------------------------------------------------------------------------------------------
# 7. SYNTH mosaic
# ---------------------------------------------------------------------------------------------------------------------
def build_synth():
    sets = OrderedDict((v, read_csv(ROOT / f"data/synthetic/{v}/manifest.csv")) for v in ("v1", "v2"))
    unusable = read_csv(ROOT / "data/synthetic/unusable/manifest.csv")
    presets = sorted({r["preset"] for r in sets["v1"]} | {r["preset"] for r in sets["v2"]})
    if len(presets) != 8 or "studio" not in presets:
        raise SystemExit(f"expected 8 presets with studio, got {presets}")
    rng = rng_for("synth")
    used_sources, tiles = set(), []
    for vi, (ver, rows) in enumerate(sets.items()):
        # 15 per preset. In a field preset the split between whole and close-up is 8/7 or 7/8, swapped between v1 and v2.
        cells = []
        for pi, p in enumerate(presets):
            if p == "studio":
                cells.append((p, "whole", 15))
            else:
                whole = 8 if (pi + vi) % 2 == 0 else 7
                cells += [(p, "whole", whole), (p, "closeup", 15 - whole)]
        rust_quota = largest_remainder(round(0.45 * 120), [c[2] for c in cells])
        for (p, mode, quota), n_rust in zip(cells, rust_quota):
            for want, n in ((1, n_rust), (0, quota - n_rust)):
                cand = sorted([r for r in rows if r["preset"] == p and r["mode"] == mode and r["rust"] == str(want)], key=lambda r: r["id"])
                rng.shuffle(cand)
                fresh = [r for r in cand if r["source_id"] not in used_sources]  # prefer a leaf that is not in the mosaic yet
                take = (fresh + [r for r in cand if r not in fresh])[:n]
                if len(take) < n:
                    raise SystemExit(f"{ver} {p} {mode} rust={want}: only {len(take)} photos for {n}")
                for r in take:
                    used_sources.add(r["source_id"])
                    tiles.append((ver, r))
    rng.shuffle(tiles)
    cols, nrows, tw, th = 20, 12, 128, 96
    if len(tiles) != cols * nrows:
        raise SystemExit(f"{len(tiles)} synthetic tiles, expected {cols * nrows}")

    def make(t):
        return ImageOps.fit(load_rgb(t[1]["image"], t[1]["sha256"]), (tw, th), LANCZOS)

    sheet = sprite(tiles, cols, nrows, tw, th, make)
    save_webp(sheet, "synth/mosaic.webp", "Mosaic of 240 synthetic renders (20 x 12 tiles of 128x96, 120 from v1 and 120 from v2), row by row", "synthetic")
    listing = [OrderedDict([("id", r["id"]), ("set", ver), ("rust", int(r["rust"])), ("group", r["group"]), ("severity", int(r["severity"])),
                            ("mode", r["mode"]), ("preset", r["preset"]), ("sourceId", int(r["source_id"])), ("seed", int(r["seed"])),
                            ("w", int(r["width"])), ("h", int(r["height"]))]) for ver, r in tiles]
    counts = OrderedDict()
    for ver, rows in sets.items():
        counts[ver] = OrderedDict([("total", len(rows)), ("rust", sum(r["rust"] == "1" for r in rows)), ("norust", sum(r["rust"] == "0" for r in rows)),
                                   ("byMode", OrderedDict(sorted(Counter(r["mode"] for r in rows).items()))),
                                   ("byPreset", OrderedDict(sorted(Counter(r["preset"] for r in rows).items())))])
    counts["unusable"] = OrderedDict([("total", len(unusable)), ("byKind", OrderedDict(sorted(Counter(r["bad"] for r in unusable).items())))])
    mosaic_rust = sum(t[1]["rust"] == "1" for t in tiles)
    return OrderedDict([("file", "img/synth/mosaic.webp"), ("cols", cols), ("rows", nrows), ("tileW", tw), ("tileH", th),
                        ("tiles", listing), ("counts", counts)]), mosaic_rust


# ---------------------------------------------------------------------------------------------------------------------
# 8. UNUSABLE, SEVERITY, PIPELINE
# ---------------------------------------------------------------------------------------------------------------------
def build_unusable():
    rows = {r["id"]: r for r in read_csv(ROOT / "data/synthetic/unusable/manifest.csv")}
    out = []
    for kind, ids in UNUSABLE_PICKS.items():
        for n, uid in enumerate(ids, 1):
            r = rows[uid]
            if r["bad"] != kind:
                raise SystemExit(f"{uid} is {r['bad']}, not {kind}")
            im = load_rgb(r["image"], r["sha256"])
            im = im.resize((640, round(im.height * 640 / im.width)), LANCZOS)
            rel = f"unusable/{kind}_{n}.webp"
            save_webp(im, rel, f"Synthetic render {uid}, damage kind {kind}, {im.width}x{im.height}", "synthetic", quality=78)
            out.append(OrderedDict([("kind", kind), ("id", uid), ("file", "img/" + rel)]))
    return out


def build_severity(used_ids):
    man = {int(r["id"]): r for r in read_csv(ROOT / "data/bracol/manifest.csv")}
    out = OrderedDict()
    for sev, ids in SEVERITY_PICKS.items():
        out[str(sev)] = []
        for i in ids:
            r = man[i]
            pure = r["miner"] == "0" and r["phoma"] == "0" and r["cercospora"] == "0"
            want_group = "healthy" if sev == 0 else "rust"
            if r["group"] != want_group or int(r["severity"]) != sev or not pure or i in used_ids:
                raise SystemExit(f"severity pick #{i} does not fit severity {sev} (group {r['group']}, severity {r['severity']}, pure {pure}, used {i in used_ids})")
            im = load_rgb(r["image"], r["sha256"]).resize((900, 450), LANCZOS)
            rel = f"severity/s{sev}_{i}.webp"
            label = "healthy leaf" if sev == 0 else f"pure rust, severity {sev}"
            save_webp(im, rel, f"BRACOL {r['split']} photo {i}, {label}, 900x450", "bracol")
            out[str(sev)].append(OrderedDict([("id", i), ("file", "img/" + rel), ("group", r["group"]), ("split", r["split"])]))
    return out


def build_pipeline():
    leaf = PIPELINE_LEAF
    row = {int(r["id"]): r for r in read_csv(ROOT / "data/bracol/manifest.csv")}[leaf]
    if not (row["split"] == "train" and row["rust"] == "1" and row["severity"] == "4" and row["miner"] == "1"):
        raise SystemExit(f"leaf {leaf} is no longer a train leaf with rust severity 4 and leaf miner")
    original = load_rgb(row["image"], row["sha256"]).resize((1600, 800), LANCZOS)
    save_webp(original, f"pipeline/{leaf}_original.webp", f"BRACOL train photo {leaf} (rust severity 4 and leaf miner), 1600x800", "bracol", quality=82)
    tex_rel = f"data/synthetic/textures/{leaf}.jpg"
    with Image.open(ROOT / tex_rel) as t:
        tex = t.convert("RGB")
    INPUTS.append(ROOT / tex_rel)
    with Image.open(ROOT / f"data/synthetic/textures/{leaf}_mask.png") as mk:
        mask = mk.convert("L")
    INPUTS.append(ROOT / f"data/synthetic/textures/{leaf}_mask.png")
    if tex.size != mask.size:
        raise SystemExit("texture and mask sizes differ")

    def cut(width):
        h = round(tex.height * width / tex.width)
        rgba = tex.resize((width, h), LANCZOS)
        rgba.putalpha(mask.resize((width, h), LANCZOS).filter(ImageFilter.GaussianBlur(1.0)))  # soften the edge by about 1 px
        return rgba

    # exact=True keeps the leaf colour under the transparent pixels, so a WebGL texture has no dark fringe
    save_webp(cut(1400), f"pipeline/{leaf}_cutout.webp", f"Leaf {leaf} cut out of its photo, transparent background, same frame as the texture, 1400 px wide",
              "bracol", quality=85, exact=True)
    save_webp(cut(900), f"pipeline/{leaf}_cutout_tex.webp", f"Same cut-out at 900 px wide, for a WebGL texture", "bracol", quality=85, exact=True)
    lesions = read_json(ROOT / "data/synthetic/textures/lesions.json")[str(leaf)]
    v1 = {r["id"]: r for r in read_csv(ROOT / "data/synthetic/v1/manifest.csv")}
    renders = []
    for rid in PIPELINE_RENDERS:
        r = v1[rid]
        meta = read_json(ROOT / f"data/synthetic/v1/meta/{rid}.json")
        im = load_rgb(r["image"], r["sha256"])
        save_webp(im, f"pipeline/{rid}.webp", f"Synthetic training render {rid} of leaf {leaf} ({r['preset']}, {r['mode']}), native size {im.width}x{im.height}",
                  "synthetic", quality=85)
        renders.append(OrderedDict([("id", rid), ("file", f"img/pipeline/{rid}.webp"), ("preset", r["preset"]), ("mode", r["mode"]),
                                    ("seed", int(r["seed"])), ("w", im.width), ("h", im.height), ("meta", meta)]))
    return OrderedDict([
        ("leafId", leaf),
        ("labels", OrderedDict([("rust", int(row["rust"])), ("miner", int(row["miner"])), ("phoma", int(row["phoma"])),
                                ("cercospora", int(row["cercospora"])), ("severity", int(row["severity"]))])),
        ("original", f"img/pipeline/{leaf}_original.webp"), ("cutout", f"img/pipeline/{leaf}_cutout.webp"),
        ("cutoutTex", f"img/pipeline/{leaf}_cutout_tex.webp"), ("textureW", tex.width), ("textureH", tex.height),
        ("lesions", OrderedDict([("orange", lesions["aim_orange"]), ("brown", lesions["aim_brown"])])),
        ("trainRenders", renders)])


# ---------------------------------------------------------------------------------------------------------------------
# 9. COUNTS
# ---------------------------------------------------------------------------------------------------------------------
COMBO_MANIFEST = "data/synthetic/combo_v1_v3rim/manifest.csv"  # set 'combo': all of v1 plus the new look-alikes of v3


def synthetic_counts(notes):
    """Photos per synthetic set. combo is the rows of its manifest. newLookalikes is the rows of v3 whose id is not in v1,
    the photos that set 3 adds (the other rows of v3 are copied from v1)."""
    v1 = read_csv(ROOT / "data/synthetic/v1/manifest.csv")
    v3 = read_csv(ROOT / "data/synthetic/v3/manifest.csv")
    ids1 = {r["id"] for r in v1}
    new = [r for r in v3 if r["id"] not in ids1]
    out = OrderedDict([("v1", len(v1)), ("v2", len(read_csv(ROOT / "data/synthetic/v2/manifest.csv"))),
                       ("unusable", len(read_csv(ROOT / "data/synthetic/unusable/manifest.csv"))), ("v3", len(v3))])
    if (ROOT / COMBO_MANIFEST).exists():
        combo = read_csv(ROOT / COMBO_MANIFEST)
        out["combo"] = len(combo)
        if {r["id"] for r in combo} != ids1 | {r["id"] for r in new}:
            notes.append("COUNTS: the combo manifest is not exactly all of v1 plus the new look-alikes of v3")
    else:
        out["combo"] = None
        notes.append(f"COUNTS: {COMBO_MANIFEST} not found, synthetic.combo is null")
    out["newLookalikes"] = len(new)
    return out


def build_counts(notes):
    b = read_csv(ROOT / "data/bracol/manifest.csv")
    u = read_csv(ROOT / "data/field/uganda/manifest.csv")
    k = read_csv(ROOT / "data/field/kenya/manifest.csv")
    tex = read_csv(ROOT / "data/synthetic/textures/textures.csv")
    sev = Counter(r["severity"] for r in b if r["split"] == "test" and r["group"] == "rust")
    return OrderedDict([
        ("bracol", OrderedDict([("total", len(b)), ("train", sum(r["split"] == "train" for r in b)), ("val", sum(r["split"] == "val" for r in b)),
                                ("test", sum(r["split"] == "test" for r in b)), ("rust", sum(r["rust"] == "1" for r in b)),
                                ("healthy", sum(r["group"] == "healthy" for r in b)), ("other", sum(r["group"] == "other" for r in b)),
                                ("unclear", sum(r["group"] == "unclear" for r in b))])),
        ("bracolSeverityTest", OrderedDict((s, sev.get(s, 0)) for s in ("1", "2", "3", "4"))),
        ("uganda", OrderedDict([("kept", len(u)), ("rust", sum(r["label_name"] == "rust" for r in u)),
                                ("healthy", sum(r["label_name"] == "healthy" for r in u)), ("phoma", sum(r["label_name"] == "phoma" for r in u)),
                                ("inEval", sum(r["in_eval"] == "1" for r in u))])),
        ("kenya", OrderedDict([("kept", len(k)), ("byGroup", OrderedDict(sorted(Counter(r["group"] for r in k).items())))])),
        ("textures", OrderedDict([("usable", sum(r["mask_ok"] == "1" for r in tex)), ("ofTrain", len(tex))])),
        ("synthetic", synthetic_counts(notes)),
    ])


# ---------------------------------------------------------------------------------------------------------------------
# 10. CALIBRATION (read from results/calibration.md) and PLAIN (the plain Yes/No answer on all 1,792 Uganda photos)
# ---------------------------------------------------------------------------------------------------------------------
CAL_WHOLE = "With the whole pool"
CAL_LOCAL = "How many local photos are needed"
CAL_WHOLE_HEAD = ["Arm", "Accuracy, BRACOL cut-off", "Accuracy, field cut-off", "Not-sure: answers", "Right when it answers"]
CAL_LOCAL_HEAD = ["Arm", "Local photos", "Accuracy", "Not-sure: answers", "Right when it answers"]


def cal_arm(text):
    """The first cell of a calibration row -> (arm, render set, real %).
    'Real only, 10% real' is ('real', 'v1', 10). 'Synthetic + real (combo), 100% real' is ('mix-combo', 'combo', 100).
    The old rows keep arms zeroshot, real, syn and mix. A row of another render set gets the arm plus a dash and the set,
    for example 'syn-v3' or 'mix-combo' (the same naming as the run folders), so a filter on the old arms still works."""
    t = text.strip()
    if t == "Zero-shot":
        return "zeroshot", "v1", None
    m = re.fullmatch(r"Real only, (\d+)% real", t)
    if m:
        return "real", "v1", int(m.group(1))
    m = re.fullmatch(r"(Synthetic only|Synthetic \+ real)(?: \(([A-Za-z0-9_]+)\))?(?:, (\d+)% real)?", t)
    if m:
        base = "syn" if m.group(1) == "Synthetic only" else "mix"
        tag, pct = m.group(2), m.group(3)
        if (base == "syn") != (pct is None):
            raise SystemExit(f"calibration.md: cannot read the arm from {t!r} (the real % is missing or not expected)")
        return (f"{base}-{tag}" if tag else base), (tag or "v1"), (0 if base == "syn" else int(pct))
    raise SystemExit(f"calibration.md: cannot read the arm from {t!r}")


def cal_pct(text, what):
    """'83.6%' -> 0.836. Anything else stops the build."""
    m = re.fullmatch(r"(\d+(?:\.\d+)?)%", text.strip())
    if not m:
        raise SystemExit(f"calibration.md: cannot read {what} from {text!r}")
    return round(float(m.group(1)) / 100, 4)


def cal_right(text, answers):
    """'Right when it answers'. A dash means the model answered no photo (answers is 0%), so there is nothing to be right about."""
    if text.strip() == "-":
        if answers != 0:
            raise SystemExit(f"calibration.md: 'Right when it answers' is '-' but the not-sure answers are {answers}, not 0")
        return None
    return cal_pct(text, "right when it answers")


def build_calibration(notes):
    """results/calibration.md as data. Any table row that does not parse stops the build."""
    INPUTS.append(CALIBRATION_MD)
    text = CALIBRATION_MD.read_text(encoding="utf-8")
    head = re.search(r"Test:\s*(\d+) Uganda photos,\s*(\d+) rust and (\d+) not\.\s*Calibration pool:\s*(\d+) other Uganda photos", text)
    if not head:
        raise SystemExit("calibration.md: cannot find the 'Test: N Uganda photos, N rust and N not. Calibration pool: N other Uganda photos' line")
    test_n, test_rust, test_not, pool_n = (int(x) for x in head.groups())
    if test_n != test_rust + test_not:
        raise SystemExit(f"calibration.md: test photos {test_n} != rust {test_rust} + not {test_not}")
    tables, current = {}, None
    for line in text.splitlines():
        if line.startswith("## "):
            current = line[3:].strip()
            tables[current] = []
        elif current is not None and line.startswith("|"):
            tables[current].append([c.strip() for c in line.strip().strip("|").split("|")])
    for name in tables:
        if name not in (CAL_WHOLE, CAL_LOCAL):
            notes.append(f"calibration.md: unknown section {name!r} was not read")
    out = {}
    for name, want_head, width in ((CAL_WHOLE, CAL_WHOLE_HEAD, 5), (CAL_LOCAL, CAL_LOCAL_HEAD, 5)):
        rows = tables.get(name)
        if not rows or rows[0] != want_head or len(rows) < 3 or not all(set(c) <= set("-: ") for c in rows[1]):
            raise SystemExit(f"calibration.md: section {name!r} has no table with the columns {want_head}")
        out[name] = rows[2:]
    whole, local, seen = [], [], set()
    for cells in out[CAL_WHOLE]:
        if len(cells) != 5:
            raise SystemExit(f"calibration.md: row of the whole-pool table has {len(cells)} cells: {cells}")
        arm, rset, pct = cal_arm(cells[0])
        if rset not in RENDER_SETS:
            notes.append(f"calibration.md: render set {rset!r} in {cells[0]!r} is not one of {', '.join(RENDER_SETS)}")
        if (arm, pct) in seen:
            raise SystemExit(f"calibration.md: duplicate whole-pool row for {cells[0]!r}")
        seen.add((arm, pct))
        answers = cal_pct(cells[3], "not-sure answers")
        whole.append(OrderedDict([("arm", arm), ("renderSet", rset), ("realPct", pct),
                                  ("accBracolCut", cal_pct(cells[1], "accuracy at the BRACOL cut-off")),
                                  ("accFieldCut", cal_pct(cells[2], "accuracy at the field cut-off")),
                                  ("answers", answers), ("right", cal_right(cells[4], answers))]))
    seen = set()
    for cells in out[CAL_LOCAL]:
        if len(cells) != 5:
            raise SystemExit(f"calibration.md: row of the local-photos table has {len(cells)} cells: {cells}")
        arm, rset, pct = cal_arm(cells[0])
        if rset not in RENDER_SETS:
            notes.append(f"calibration.md: render set {rset!r} in {cells[0]!r} is not one of {', '.join(RENDER_SETS)}")
        if not re.fullmatch(r"\d+", cells[1]):
            raise SystemExit(f"calibration.md: cannot read the number of local photos from {cells[1]!r}")
        n_local = int(cells[1])
        if (arm, pct, n_local) in seen:
            raise SystemExit(f"calibration.md: duplicate local row for {cells[0]!r} with {n_local} photos")
        seen.add((arm, pct, n_local))
        m = re.fullmatch(r"(\d+(?:\.\d+)?)%(?: \+/- (\d+(?:\.\d+)?))?", cells[2])
        if not m:
            raise SystemExit(f"calibration.md: cannot read the accuracy from {cells[2]!r}")
        answers = cal_pct(cells[3], "not-sure answers")
        local.append(OrderedDict([("arm", arm), ("renderSet", rset), ("realPct", pct), ("nLocal", n_local),
                                  ("acc", round(float(m.group(1)) / 100, 4)),
                                  ("accSd", None if m.group(2) is None else round(float(m.group(2)) / 100, 4)),
                                  ("answers", answers), ("right", cal_right(cells[4], answers))]))
    # rows of the render set v1 (the old arms) keep their order and their positions. Rows of the other sets follow, in file order.
    whole = [r for r in whole if r["renderSet"] == "v1"] + [r for r in whole if r["renderSet"] != "v1"]
    local = [r for r in local if r["renderSet"] == "v1"] + [r for r in local if r["renderSet"] != "v1"]
    return OrderedDict([("source", "results/calibration.md"), ("testN", test_n), ("testRust", test_rust), ("poolN", pool_n),
                        ("whole", whole), ("local", local)])


def build_plain(runs, notes):
    """What a phone gets if it reads only the plain Yes/No answer (score above 0, no cut-off) on all 1,792 Uganda photos.
    One line per cell of PLAIN_CELLS: the mean over the detail-140 runs of that cell that have scores_field_uganda_all.csv."""
    per_run = {}
    for r in runs:
        f = RUNS_DIR / r["name"] / "scores_field_uganda_all.csv"
        if not f.exists():
            continue
        rows = read_csv(f)
        if len(rows) != 1792:
            notes.append(f"{r['name']}: scores_field_uganda_all.csv has {len(rows)} rows, expected 1792")
        says = [float(x["score"]) > 0 for x in rows]
        group = [x["group"] for x in rows]

        def share(want_group, want_yes):
            hits = [yes for yes, g in zip(says, group) if g == want_group]
            return (sum(hits) if want_yes else len(hits) - sum(hits)) / len(hits)

        per_run[r["name"]] = {
            "acc": sum(yes == (g == "rust") for yes, g in zip(says, group)) / len(rows),
            "sens": share("rust", True), "healthyOk": share("healthy", False), "otherOk": share("other", False),
            "ties": sum(float(x["score"]) == 0 for x in rows)}
    cells, detail = [], []
    for arm, pct, rset in PLAIN_CELLS:
        have = [r["name"] for r in runs if r["arm"] == arm and r["realPct"] == pct and r["renderSet"] == rset and r["detail"] == 140
                and r["name"] in per_run]
        cell = OrderedDict([("arm", arm), ("realPct", pct), ("renderSet", rset), ("runs", len(have))])
        for key in ("acc", "sens", "healthyOk", "otherOk"):
            cell[key] = num(statistics.fmean(per_run[n][key] for n in have)) if have else None
        cells.append(cell)
        detail.append((cell, have, [per_run[n]["ties"] for n in have]))
    return cells, detail


def cell_means(runs):
    """For the console only: the mean over the seeds of each PLAIN cell (detail 140), from the numbers in RUNS. These are at the
    BRACOL-val cut-off, not the plain Yes/No answer. Only runs that have the all-photos results are used, for every number."""
    out = []
    for arm, pct, rset in PLAIN_CELLS:
        cell = [r for r in runs if r["arm"] == arm and r["realPct"] == pct and r["renderSet"] == rset and r["detail"] == 140
                and r["ugandaAll"] is not None]

        def mean(group, key):
            return statistics.fmean(r[group][key] for r in cell) if cell else None

        out.append(OrderedDict([
            ("arm", arm), ("realPct", pct), ("renderSet", rset), ("runs", [r["name"] for r in cell]),
            ("seeds", [r["seed"] for r in cell]),
            ("bracolAuc", mean("bracol", "auc")), ("bracolAcc", mean("bracol", "acc")),
            ("allAuc", mean("ugandaAll", "auc")), ("allAcc", mean("ugandaAll", "acc")),
            ("allRust", mean("ugandaAll", "sens")), ("allHealthy", mean("ugandaAll", "healthyOk")),
            ("allPhoma", mean("ugandaAll", "otherOk"))]))
    return out


# ---------------------------------------------------------------------------------------------------------------------
# output
# ---------------------------------------------------------------------------------------------------------------------
def plain(v):
    """Whole floats become ints, so 5.0 is written as 5."""
    if isinstance(v, dict):
        return {k: plain(x) for k, x in v.items()}
    if isinstance(v, (list, tuple)):
        return [plain(x) for x in v]
    if isinstance(v, (np.integer,)):
        return int(v)
    if isinstance(v, (float, np.floating)):
        v = float(v)
        return int(v) if v.is_integer() else v
    return v


def js(v):
    return json.dumps(plain(v), separators=(",", ":"), ensure_ascii=False, allow_nan=False)


def js_lines(items):
    return "[\n" + ",\n".join(js(x) for x in items) + "\n]"


def js_rows(items, per_row):
    """One list, written per_row elements to a line."""
    rows = [",".join(js(x) for x in items[i:i + per_row]) for i in range(0, len(items), per_row)]
    return "[\n" + ",\n".join(rows) + "\n]"


def js_sprite(d):
    head = {k: v for k, v in d.items() if k not in ("tiles", "counts")}
    text = "{" + ",".join(f'"{k}":{js(v)}' for k, v in head.items()) + f',"tiles":{js_rows(d["tiles"], d["cols"])}'
    if "counts" in d:
        text += f',"counts":{js(d["counts"])}'
    return text + "}"


def js_calibration(c):
    head = ",".join(f'"{k}":{js(c[k])}' for k in ("source", "testN", "testRust", "poolN"))
    return "{" + head + ',\n"whole":' + js_lines(c["whole"]) + ',\n"local":' + js_lines(c["local"]) + "}"


def make_module(meta, runs, scores, photos, gap, shortcut, synth, unusable, severity, pipeline, counts, calibration, plain_cells):
    parts = ["// generated by tools/build_data.py, do not edit", ""]
    parts.append(f"export const META = {js(meta)};")
    parts.append(f"export const RUNS = {js_lines(runs)};")
    sc = []
    for arm, e in scores.items():
        lines = [f'"{arm}":{{"run":{js(e["run"])},"threshold":{js(e["threshold"])},"notSureMargin":{js(e["notSureMargin"])}']
        for key in ("bracolVal", "bracolTest", "uganda", "ugandaAll"):
            lines.append(f'"{key}":{js(e[key])}')
        sc.append(",\n".join(lines) + "}")
    parts.append("export const SCORES = {\n" + ",\n".join(sc) + "\n};")
    parts.append(f"export const PHOTOS = {js_lines(photos)};")
    parts.append("export const GAP = {\n" + ",\n".join(f'"{k}":{js_sprite(v)}' for k, v in gap.items()) + "\n};")
    sh = []
    for k, v in shortcut.items():
        sh.append(f'"{k}":{{"n":{v["n"]},"auc":{js(v["auc"])},\n"a":{{"rust":{js(v["a"]["rust"])},\n"norust":{js(v["a"]["norust"])}}},\n'
                  f'"hist":{{"edges":{js(v["hist"]["edges"])},\n"rust":{js(v["hist"]["rust"])},\n"norust":{js(v["hist"]["norust"])}}}}}')
    parts.append("export const SHORTCUT = {\n" + ",\n".join(sh) + "\n};")
    parts.append(f"export const SYNTH = {js_sprite(synth)};")
    parts.append(f"export const UNUSABLE = {js_lines(unusable)};")
    parts.append("export const SEVERITY = {\n" + ",\n".join(f'"{k}":{js(v)}' for k, v in severity.items()) + "\n};")
    pl = dict(pipeline)
    renders = pl.pop("trainRenders")
    parts.append("export const PIPELINE = {\n" + ",\n".join(f'"{k}":{js(v)}' for k, v in pl.items()) + ',\n"trainRenders":' + js_lines(renders) + "\n};")
    parts.append(f"export const COUNTS = {js(counts)};")
    parts.append(f"export const CALIBRATION = {js_calibration(calibration)};")
    parts.append(f"export const PLAIN = {js_lines(plain_cells)};")
    return "\n".join(parts) + "\n"


def write_manifest(folder_notes):
    lines = ["# Image manifest", "",
             "`tools/build_data.py` makes these files from the repo data, so do not edit them by hand. "
             "Other tools make some folders in img/ (for example dial/), and this list does not cover them.",
             "Rebuild: `uv run --script presentation/site/tools/build_data.py`", "",
             "## Sources and credits", "", "| Source | Dataset | Licence | Credit |", "|---|---|---|---|"]
    used = [k for k in SOURCES if any(e["source"] == k for e in SAVED)]
    for k in used:
        short, dataset, licence, credit = SOURCES[k]
        lines.append(f"| {short} | {dataset} | {licence} | {credit} |")
    lines.append("")
    total = 0.0
    for folder in IMG_FOLDERS:
        entries = sorted((e for e in SAVED if e["rel"].split("/")[0] == folder), key=lambda e: e["rel"])
        if not entries:
            continue
        size = sum(kb(e["rel"]) for e in entries)
        total += size
        lines += [f"## img/{folder}/ ({len(entries)} files, {size:.0f} KB)", "", folder_notes.get(folder, ""), "",
                  "| File | KB | What it is | Source | Licence |", "|---|---:|---|---|---|"]
        for e in entries:
            short, _, licence, _ = SOURCES[e["source"]]
            lines.append(f"| img/{e['rel']} | {kb(e['rel']):.1f} | {e['what']} | {short} | {licence} |")
        lines.append("")
    lines += [f"Total: {total:.0f} KB ({total / 1024:.2f} MB) in {len(SAVED)} files.", ""]
    return write_text_if_changed(IMG / "MANIFEST.md", "\n".join(lines))


FOLDER_NOTES = {
    "verdict": "Photos for the try-it demo and the hero: 16 BRACOL test photos and 10 Uganda photos from the 300-photo test set. "
               "Each one was picked by eye, and the script checks the rule behind each pick. The BRACOL photos show one leaf each on a plain background.",
    "gap": "Sprite sheets for the tidy photos versus messy farms mosaic. generated.js (GAP) lists the tiles row by row.",
    "synth": "One mosaic of 240 synthetic renders. generated.js (SYNTH) lists the tiles row by row.",
    "unusable": "Two examples of each kind of photo that no model should judge: no leaf, tiny leaf, defocus, glare and dark.",
    "severity": "Two leaves for each BRACOL severity level. Severity 0 is healthy. Levels 1 to 4 are leaves with rust only (no other disease marked).",
    "pipeline": "Leaf 897 (a real BRACOL train leaf, rust severity 4 and leaf miner) at each step: the photo, the cut-out and three training renders.",
}


def node_check():
    """Import generated.js in node, when node is installed, and check the export names."""
    node = shutil.which("node")
    if not node:
        print("node not found: skipped the parse check of generated.js")
        return
    with tempfile.TemporaryDirectory() as tmp:
        copy = Path(tmp) / "generated.mjs"
        shutil.copy(DATA_JS, copy)
        code = f"import({json.dumps(copy.as_uri())}).then(m => console.log(Object.keys(m).sort().join(',')))"
        r = subprocess.run([node, "--input-type=module", "-e", code], capture_output=True, text=True)
    want = sorted(["META", "RUNS", "SCORES", "PHOTOS", "GAP", "SHORTCUT", "SYNTH", "UNUSABLE", "SEVERITY", "PIPELINE", "COUNTS",
                   "CALIBRATION", "PLAIN"])
    got = r.stdout.strip().split(",")
    if r.returncode != 0 or got != want:
        raise SystemExit(f"generated.js does not load in node as expected.\n{r.stderr}\nexports: {got}")
    print(f"generated.js loads in node with {len(got)} exports: {', '.join(got)}")


def iso(ts):
    return datetime.datetime.fromtimestamp(ts, datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.parse_args()
    if not (ROOT / "runs").is_dir() or not (ROOT / "data/bracol/manifest.csv").exists():
        raise SystemExit(f"{ROOT} does not look like the ShhS repo")
    for p in (OUT / "src" / "data", IMG):
        p.mkdir(parents=True, exist_ok=True)
    notes = []

    runs, skipped = build_runs(notes)
    scores, raw = build_scores(notes)
    checks = check_scores(scores, raw, notes)
    photos, table, picked = build_photos(scores, notes)
    used = {int(p["id"][1:]) for p in photos if p["set"] == "bracol"}
    gap = build_gap()
    shortcut = build_shortcut(notes)
    synth, mosaic_rust = build_synth()
    unusable = build_unusable()
    severity = build_severity(used)
    pipeline = build_pipeline()
    counts = build_counts(notes)
    calibration = build_calibration(notes)
    plain_cells, plain_detail = build_plain(runs, notes)
    means = cell_means(runs)
    removed = prune_stale()

    newest_run = max(os.path.getmtime(p) for p in INPUTS if RUNS_DIR in Path(p).parents)
    newest_any = max(os.path.getmtime(p) for p in INPUTS)
    generated = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ") if os.environ.get("BUILD_NOW") else iso(newest_any)
    with_all = sum(1 for r in runs if r["ugandaAll"] is not None)
    meta = OrderedDict([("generatedAt", generated), ("newestRun", iso(newest_run)), ("nRuns", len(runs)), ("nRunsWithUgandaAll", with_all),
                        ("note", "generated by tools/build_data.py, do not edit")])
    wrote_js = write_text_if_changed(DATA_JS, make_module(meta, runs, scores, photos, gap, shortcut, synth, unusable, severity, pipeline,
                                                          counts, calibration, plain_cells))
    wrote_md = write_manifest(FOLDER_NOTES)
    for f in (DATA_JS, IMG / "MANIFEST.md"):  # house rule: the plain hyphen is the only dash
        bad = [c for c in (chr(0x2014), chr(0x2013)) if c in f.read_text(encoding="utf-8")]  # em dash and en dash
        if bad:
            raise SystemExit(f"{f.name} has an em or en dash")

    # ---- report
    print(f"runs: {len(runs)} with metrics. skipped: {', '.join(skipped) or 'none'}")
    by = Counter((r["arm"], r["renderSet"]) for r in runs)
    print("runs by arm and render set: " + ", ".join(f"{a}/{rs} {n}" for (a, rs), n in sorted(by.items(), key=lambda kv: (ARMS.index(kv[0][0]), kv[0][1]))))
    print(f"runs with ugandaAll: {with_all} of {len(runs)}. without: {', '.join(r['name'] for r in runs if r['ugandaAll'] is None) or 'none'}")
    for n in notes:
        print("note:", n)
    print("\nSanity: AUC from SCORES vs run files (test = 261 BRACOL test photos, uganda = 300 photos, all = 1,792 photos)")
    for c in checks:
        line = f"  {c['arm']:9s} {c['run']:20s}"
        if "test_auc" in c:
            line += f" test {c['test_auc']:.4f} vs {c['test_auc_json']:.4f}  acc {c['test_acc']:.4f} vs {c['test_acc_json']:.4f}  notsure cov {c['cov']:.4f} vs {c['cov_json']:.4f}"
        if "uganda_auc" in c:
            line += f" | uganda {c['uganda_auc']:.4f} vs {c['uganda_auc_json']:.4f}  acc {c['uganda_acc']:.4f} vs {c['uganda_acc_json']:.4f}"
        if "all_auc" in c:
            line += f" | all {c['all_auc']:.4f} vs {c['all_auc_json']:.4f}  acc {c['all_acc']:.4f} vs {c['all_acc_json']:.4f}"
        print(line)
    print(f"\nPHOTOS: {len(photos)} ({sum(p['hero'] for p in photos)} hero). uncertain {picked['uncertain']}, hero order {picked['hero']}")
    print("  id            role               hero rust group    sev   zeroshot  real     syn      mix   (score, '+' right '-' wrong)")
    thr = {a: scores[a]["threshold"] for a in ARMS}
    for pid, role, hero, rust, group, sev, sc in table:
        cells = []
        for a in ARMS:
            s = sc[a]
            cells.append("   -    " if s is None else f"{s:7.2f}{'+' if (s >= thr[a]) == bool(rust) else '-'}")
        print(f"  {pid:13s} {role:18s} {'H' if hero else ' '}    {rust}    {group:8s} {str(sev):4s} " + " ".join(cells))
    print(f"  thresholds: {thr}")
    print("\nPLAIN (score above 0, no cut-off, all 1,792 Uganda photos, mean over the detail-140 runs that have the all-photos scores)")
    print("  arm      realPct set  runs   acc  sens  healthyOk  otherOk   runs used / scores equal to 0")
    for cell, have, ties in plain_detail:
        def pc(v):
            return "   -" if v is None else f"{100 * v:5.1f}"
        print(f"  {cell['arm']:8s} {str(cell['realPct']):7s} {cell['renderSet']:3s} {cell['runs']:4d} {pc(cell['acc'])} {pc(cell['sens'])}  {pc(cell['healthyOk'])}     {pc(cell['otherOk'])}   "
              f"{', '.join(have) or 'none'} / {ties}")
    print("\nCELL MEANS over seeds (detail 140, at the BRACOL-val cut-off; Uganda = all 1,792 photos; percent)")
    print("  arm      realPct set     seeds (runs with all-photos results)  BRACOL auc  acc | Uganda auc  acc  rust  healthy  phoma")

    def pc(v, width=5):
        return " " * (width - 1) + "-" if v is None else f"{100 * v:{width}.1f}"
    for c in means:
        seeds = ",".join("-" if x is None else str(x) for x in c["seeds"]) or "none"
        print(f"  {c['arm']:8s} {str(c['realPct']):7s} {c['renderSet']:6s} {seeds:38s} {pc(c['bracolAuc'])} {pc(c['bracolAcc'])} | "
              f"{pc(c['allAuc'])} {pc(c['allAcc'])} {pc(c['allRust'])} {pc(c['allHealthy'], 7)} {pc(c['allPhoma'])}")
    by_arm = Counter(r["arm"] for r in calibration["whole"])
    print(f"\nCALIBRATION: whole-pool rows {len(calibration['whole'])}, local-photos rows {len(calibration['local'])}, "
          f"test {calibration['testN']} ({calibration['testRust']} rust), pool {calibration['poolN']}")
    print("  arms in the whole-pool table: " + ", ".join(f"{a} {n}" for a, n in by_arm.items()))
    print("  rows with right = null: " + (", ".join(f"{r['arm']} {r['realPct']} ({r.get('nLocal', 'whole pool')})"
                                                   for r in calibration["whole"] + calibration["local"] if r["right"] is None) or "none"))
    print(f"COUNTS.synthetic: {dict(counts['synthetic'])}")
    print(f"\nSYNTH: {len(synth['tiles'])} tiles, {mosaic_rust} rust ({100 * mosaic_rust / len(synth['tiles']):.1f}%)")
    print("\nimg/ sizes")
    grand = 0.0
    for f in IMG_FOLDERS:
        entries = [e for e in SAVED if e["rel"].split("/")[0] == f]
        s = sum(kb(e["rel"]) for e in entries)
        grand += s
        print(f"  {f:9s} {len(entries):3d} files {s:8.0f} KB")
    print(f"  total     {len(SAVED):3d} files {grand:8.0f} KB ({grand / 1024:.2f} MB)")
    everything = sum(p.stat().st_size for p in IMG.rglob("*") if p.is_file()) / 1024
    print(f"  all of img/ (including folders from other tools): {everything:.0f} KB ({everything / 1024:.2f} MB)")
    print(f"written this run: generated.js {'yes' if wrote_js else 'unchanged'}, MANIFEST.md {'yes' if wrote_md else 'unchanged'}, "
          f"images rewritten {len(WRITTEN)}{' (' + ', '.join(WRITTEN[:5]) + ')' if WRITTEN else ''}, stale images removed {len(removed)}")
    print(f"generated.js {DATA_JS.stat().st_size / 1024:.0f} KB")
    node_check()
    if everything / 1024 >= 9:
        raise SystemExit("img/ is 9 MB or more")


if __name__ == "__main__":
    main()
