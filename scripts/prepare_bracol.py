#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow"]
# ///
"""Organize the BRACOL leaf photos for the rust yes or no study.

Reads BRACOL_coffee_leaf_images/dataset.csv, checks every photo, and writes
manifest.csv, splits.json, audit.json and README.md to data/bracol/.
The raw folder is never changed. The split is frozen: this script refuses to
overwrite an existing splits.json unless you pass --force.

Run from the repo root: uv run scripts/prepare_bracol.py
"""
import argparse
import csv
import hashlib
import json
import math
import random
import sys
from collections import Counter, defaultdict
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "BRACOL_coffee_leaf_images"
OUT = ROOT / "data" / "bracol"

PREDOMINANT = {0: "healthy", 1: "miner", 2: "rust", 3: "phoma", 4: "cercospora", 5: "undetermined"}
STRESSES = ("miner", "rust", "phoma", "cercospora")
FRACTIONS = (10, 25, 50, 100)
SUBSET_SEEDS = (0, 1, 2)
NEAR_DUP_BITS = 18  # of 256 dHash bits. Photos closer than this count as one leaf.
# Same-leaf pairs sit at 0 and 15 bits. The closest pairs of different leaves sit at 21.
FIELDS = ["id", "image", "source", "split", "group", "rust", "miner", "phoma", "cercospora",
          "severity", "predominant", "n_stress", "stratum", "width", "height", "sha256"]


def examine(path):
    """Decode one photo in full and return its facts. Runs in a worker process."""
    try:
        data = path.read_bytes()
        with Image.open(path) as img:
            img.load()
            small = img.convert("L").resize((17, 16), Image.Resampling.BILINEAR).tobytes()
            facts = {
                "sha256": hashlib.sha256(data).hexdigest(),
                "bytes": len(data),
                "width": img.width,
                "height": img.height,
                "mode": img.mode,
                "orientation": img.getexif().get(274, 1),
            }
        bits = 0
        for row in range(16):
            for col in range(16):
                bits = (bits << 1) | (small[row * 17 + col] < small[row * 17 + col + 1])
        facts["dhash"] = f"{bits:064x}"
        return facts
    except Exception as err:
        return {"error": f"{type(err).__name__}: {err}"}


def group_of(row):
    """Say what kind of leaf this is. Only the rust label comes from the study decision."""
    if row["rust"]:
        return "rust"
    if row["n_stress"]:
        return "other"
    return "healthy" if row["predominant"] == "healthy" else "unclear"


def stratum_of(row):
    """Name the stratum a leaf is split in, so every split gets the same mix."""
    if row["group"] == "rust":
        severity = "s3plus" if row["severity"] >= 3 else f"s{row['severity']}"
        return f"rust_{severity}_{'mixed' if row['n_stress'] > 1 else 'pure'}"
    if row["group"] == "other":
        found = [k for k in STRESSES if row[k]]
        return f"other_{found[0]}" if len(found) == 1 else "other_multi"
    return row["group"]


def read_labels():
    """Read dataset.csv and derive the labels used in this study."""
    raw = (RAW / "dataset.csv").read_bytes()
    rows = {}
    for r in csv.DictReader(raw.decode("utf-8").splitlines()):
        flags = {k: int(r[k]) for k in STRESSES}
        row = {
            "id": int(r["id"]),
            "rust": flags["rust"],
            "miner": flags["miner"],
            "phoma": flags["phoma"],
            "cercospora": flags["cercospora"],
            "severity": int(r["severity"]),
            "predominant": PREDOMINANT[int(r["predominant_stress"])],
            "n_stress": sum(flags.values()),
        }
        row["group"] = group_of(row)
        row["stratum"] = stratum_of(row)
        rows[row["id"]] = row
    return rows, hashlib.sha256(raw).hexdigest()


def label_checks(rows):
    """List leaves whose labels disagree with each other. Nothing is changed or dropped."""
    checks = defaultdict(list)
    for i, r in rows.items():
        if r["predominant"] in STRESSES and not r[r["predominant"]]:
            checks["predominant_problem_not_marked"].append(i)
        if not r["n_stress"] and r["predominant"] != "healthy":
            checks["nothing_marked_but_not_healthy"].append(i)
        if r["n_stress"] and r["predominant"] == "healthy":
            checks["problem_marked_but_healthy"].append(i)
        if r["severity"] == 0 and r["n_stress"]:
            checks["severity_0_with_a_problem"].append(i)
        if r["severity"] > 0 and not r["n_stress"]:
            checks["severity_above_0_without_a_problem"].append(i)
    return {k: sorted(v) for k, v in sorted(checks.items())}


def photo_groups(facts):
    """Join exact and near copies, so one leaf never lands in two splits."""
    ids = sorted(facts)
    parent = {i: i for i in ids}

    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    hashes = {i: int(facts[i]["dhash"], 16) for i in ids}
    nearest = dict.fromkeys(ids, 256)
    close = []
    for n, a in enumerate(ids):
        for b in ids[n + 1:]:
            bits = (hashes[a] ^ hashes[b]).bit_count()
            nearest[a] = min(nearest[a], bits)
            nearest[b] = min(nearest[b], bits)
            if bits <= 40:
                close.append((bits, a, b))
            if bits < NEAR_DUP_BITS or facts[a]["sha256"] == facts[b]["sha256"]:
                parent[find(a)] = find(b)
    members = defaultdict(list)
    for i in ids:
        members[find(i)].append(i)
    groups = sorted(sorted(m) for m in members.values())
    edges = [0, 1, 6, 11, 21, 41, 81, 257]
    histogram = {}
    for lo, hi in zip(edges, edges[1:]):
        label = f"{lo}" if hi - lo == 1 else f"{lo}-{hi - 1}" if hi < 257 else f"{lo}+"
        histogram[label] = sum(lo <= v < hi for v in nearest.values())
    return groups, histogram, sorted(close)[:10]


def split_groups(rows, groups, val_frac, test_frac, seed):
    """Split whole photo groups into train, val and test inside each stratum."""
    rng = random.Random(seed)
    by_stratum = defaultdict(list)
    for g in groups:
        by_stratum[rows[g[0]]["stratum"]].append(g)
    split = {}
    for name in sorted(by_stratum):
        chosen = by_stratum[name]
        rng.shuffle(chosen)
        n = sum(len(g) for g in chosen)
        want = {"test": round(n * test_frac), "val": round(n * val_frac)}
        have = Counter()
        for g in chosen:
            part = next((p for p in ("test", "val") if have[p] < want[p]), "train")
            for i in g:
                split[i] = part
            have[part] += len(g)
    return split


def make_subsets(rows, split):
    """Make stratified subsets of train. For one seed each subset sits inside the next larger one."""
    train = defaultdict(list)
    for i in sorted(rows):
        if split[i] == "train":
            train[rows[i]["stratum"]].append(i)
    subsets = {}
    for seed in SUBSET_SEEDS:
        rng = random.Random(seed)
        order = {}
        for name in sorted(train):
            order[name] = train[name][:]
            rng.shuffle(order[name])
        subsets[str(seed)] = {
            str(frac): sorted(i for ids in order.values() for i in ids[: math.ceil(len(ids) * frac / 100)])
            for frac in FRACTIONS
        }
    return subsets


def plural(n, word):
    return f"{n} {word}" if n == 1 else f"{n} {word}s"


def join_and(items):
    items = [str(i) for i in items]
    return items[0] if len(items) == 1 else ", ".join(items[:-1]) + " and " + items[-1]


CHECK_TEXT = {
    "predominant_problem_not_marked": "Leaves whose main problem is not marked",
    "nothing_marked_but_not_healthy": "Leaves with no problem marked that BRACOL does not call healthy",
    "problem_marked_but_healthy": "Leaves called healthy that have a problem marked",
    "severity_0_with_a_problem": "Leaves with severity 0 and a problem marked",
    "severity_above_0_without_a_problem": "Leaves with a severity above 0 and no problem marked",
}


def write_readme(rows, split, subsets, audit, args, labels_sha, splits_sha):
    def part(name):
        return [r for r in rows.values() if r["split"] == name]

    def count(name, group):
        return sum(r["group"] == group for r in part(name))

    n_groups = Counter(r["group"] for r in rows.values())
    lines = [
        "# BRACOL data for the rust study",
        "",
        "This folder has the labels and the frozen split for the BRACOL coffee leaf photos. "
        "The photos stay untouched in `BRACOL_coffee_leaf_images/`.",
        "",
        "## Files",
        "",
        "- `manifest.csv`: one row per leaf, with the photo path, labels, split and a checksum.",
        "- `splits.json`: the frozen split, plus nested subsets of `train` for the data-scarcity runs.",
        "- `audit.json`: the results of the photo and label checks.",
        "",
        "## The label",
        "",
        "`rust` is 1 when BRACOL marks rust on the leaf, and 0 for every other leaf. "
        "A leaf with rust and another problem is 1. The 0 leaves fall in three groups, "
        "shown in the `group` column:",
        "",
        f"- `healthy`: BRACOL says healthy and no problem is marked. {n_groups['healthy']} leaves.",
        f"- `other`: no rust, but leaf miner, phoma or cercospora is marked. {n_groups['other']} leaves.",
        f"- `unclear`: no problem is marked, but BRACOL says undetermined. {n_groups['unclear']} leaves.",
        "",
        "Report results for `healthy` and `other` separately, and by `severity`. "
        "BRACOL gives one severity per leaf, even when the leaf has more than one problem.",
        "",
        "## Splits",
        "",
        f"Seed {args.seed}, with {round(100 * (1 - args.val - args.test))}% train, {round(100 * args.val)}% val "
        f"and {round(100 * args.test)}% test. Leaves are split inside {len(set(r['stratum'] for r in rows.values()))} "
        "strata (rust or not, severity, and which other problem), so every split has the same mix.",
        "",
        "| Split | Leaves | Rust | Healthy | Other | Unclear |",
        "| --- | ---: | ---: | ---: | ---: | ---: |",
    ]
    for name in ("train", "val", "test"):
        lines.append(f"| {name} | {len(part(name))} | {count(name, 'rust')} | {count(name, 'healthy')} "
                     f"| {count(name, 'other')} | {count(name, 'unclear')} |")
    lines += ["", "Rust leaves by severity:", "", "| Split | 1 | 2 | 3 | 4 |", "| --- | ---: | ---: | ---: | ---: |"]
    for name in ("train", "val", "test"):
        by_sev = Counter(r["severity"] for r in part(name) if r["rust"])
        lines.append(f"| {name} | " + " | ".join(str(by_sev[s]) for s in (1, 2, 3, 4)) + " |")
    sizes = ", ".join(f"{frac}%: {len(subsets['0'][str(frac)])}" for frac in FRACTIONS)
    lines += [
        "",
        "Severities 3 and 4 share one stratum, so their counts are not matched between `val` and `test`.",
        "",
        "Pick checkpoints and thresholds on `val`. Use `test` only to report results. "
        "The split is frozen: the script refuses to overwrite it unless you pass `--force`, "
        "so use that only before any experiment has run.",
        "",
        "## Data-scarcity subsets",
        "",
        f"`splits.json` lists subsets of `train` at {join_and([f'{f}%' for f in FRACTIONS])}, "
        f"for seeds {join_and(SUBSET_SEEDS)}. Each subset keeps the mix of `train`, "
        f"and for one seed each subset sits inside the next larger one. Leaves per subset: {sizes}.",
        "",
        "## What the checks found",
        "",
    ]
    ok, bad = audit["photos_ok"], audit["photos_failed"]
    lines.append(f"- {plural(ok, 'photo')} decoded without errors." if not bad
                 else f"- {plural(ok, 'photo')} decoded. {plural(len(bad), 'photo')} failed: {sorted(bad)}.")
    sizes_seen = audit["sizes"]
    lines.append(f"- All photos are {next(iter(sizes_seen))} pixels." if len(sizes_seen) == 1
                 else f"- Photo sizes vary: {dict(sizes_seen)}.")
    odd = {k: v for k, v in audit["orientation_tags"].items() if k != "1"}
    lines.append("- No photo has an EXIF orientation tag that rotates it." if not odd
                 else f"- Some photos carry an EXIF orientation tag: {odd}. Apply `ImageOps.exif_transpose` when loading.")
    dup = audit["duplicate_groups"]
    lines.append("- No exact or near copies were found." if not dup
                 else f"- {plural(len(dup), 'group')} of exact or near copies were found: "
                      + "; ".join(f"ids {join_and(g)}" for g in dup) + ". Each group stays in one split.")
    flagged = {k: v for k, v in audit["label_checks"].items() if v}
    if flagged:
        lines.append("- Some labels disagree with each other. They are kept as given, and the ids are in `audit.json`:")
        lines += [f"  - {CHECK_TEXT[k]}: {len(v)}." for k, v in flagged.items()]
    else:
        lines.append("- The labels agree with each other.")
    lines.append("- Checked by eye on 2026-10-04, on a random sample of 24 photos: each shows one whole leaf "
                 "on a plain light background, with some change in tone and light. These are not field photos.")
    lines += [
        "",
        "## Rebuild",
        "",
        "```bash",
        "uv run scripts/prepare_bracol.py",
        "```",
        "",
        f"The checksums in `manifest.csv` show whether a photo changed. `dataset.csv` has sha256 `{labels_sha}`. "
        f"`splits.json` has sha256 `{splits_sha}`.",
        "",
    ]
    (OUT / "README.md").write_text("\n".join(lines), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--val", type=float, default=0.15)
    parser.add_argument("--test", type=float, default=0.15)
    parser.add_argument("--force", action="store_true", help="overwrite a frozen split")
    args = parser.parse_args()
    if (OUT / "splits.json").exists() and not args.force:
        sys.exit("data/bracol/splits.json already exists and the split is frozen. "
                 "Use --force only before any experiment has run.")

    rows, labels_sha = read_labels()
    ids = sorted(rows)
    paths = {i: RAW / "images" / f"{i}.jpg" for i in ids}
    missing = [i for i in ids if not paths[i].exists()]
    if missing:
        sys.exit(f"Photos missing for ids {missing[:10]}")
    with ProcessPoolExecutor() as pool:
        facts = dict(zip(ids, pool.map(examine, [paths[i] for i in ids], chunksize=16)))
    failed = {i: f["error"] for i, f in facts.items() if "error" in f}
    for i in failed:
        del rows[i], facts[i]

    groups, histogram, closest = photo_groups(facts)
    split = split_groups(rows, groups, args.val, args.test, args.seed)
    subsets = make_subsets(rows, split)
    for i, r in rows.items():
        r.update(split=split[i], source="real", image=f"{RAW.name}/images/{i}.jpg",
                 width=facts[i]["width"], height=facts[i]["height"], sha256=facts[i]["sha256"])

    audit = {
        "photos_ok": len(facts),
        "photos_failed": failed,
        "sizes": dict(Counter(f"{f['width']}x{f['height']}" for f in facts.values())),
        "modes": dict(Counter(f["mode"] for f in facts.values())),
        "orientation_tags": dict(Counter(str(f["orientation"]) for f in facts.values())),
        "file_bytes": {"min": min(f["bytes"] for f in facts.values()),
                       "max": max(f["bytes"] for f in facts.values()),
                       "mean": round(sum(f["bytes"] for f in facts.values()) / len(facts))},
        "duplicate_groups": [g for g in groups if len(g) > 1],
        "near_duplicate_threshold_bits_of_256": NEAR_DUP_BITS,
        "nearest_neighbour_bits_histogram": histogram,
        "closest_pairs": [{"bits": b, "ids": [a, c]} for b, a, c in closest],
        "label_checks": label_checks(rows),
    }

    OUT.mkdir(parents=True, exist_ok=True)
    with open(OUT / "manifest.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows[i] for i in sorted(rows))
    splits = {
        "seed": args.seed,
        "val_fraction": args.val,
        "test_fraction": args.test,
        "stratified_by": "stratum column of manifest.csv",
        "ids": {name: sorted(i for i in rows if split[i] == name) for name in ("train", "val", "test")},
        "subsets_of_train": subsets,
    }
    (OUT / "splits.json").write_text(json.dumps(splits, indent=1) + "\n", encoding="utf-8")
    (OUT / "audit.json").write_text(json.dumps(audit, indent=1) + "\n", encoding="utf-8")
    splits_sha = hashlib.sha256((OUT / "splits.json").read_bytes()).hexdigest()
    write_readme(rows, split, subsets, audit, args, labels_sha, splits_sha)

    print(f"Wrote {OUT.relative_to(ROOT)}: {len(rows)} leaves, "
          + ", ".join(f"{n} {len(splits['ids'][n])}" for n in ("train", "val", "test")))
    print("nearest-neighbour bits:", histogram)
    print("closest pairs:", audit["closest_pairs"][:5])
    print("duplicate groups:", audit["duplicate_groups"])
    print("label checks:", {k: len(v) for k, v in audit["label_checks"].items()})


if __name__ == "__main__":
    main()
