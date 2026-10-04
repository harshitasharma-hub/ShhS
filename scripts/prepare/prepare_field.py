#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow", "numpy"]
# ///
"""Prepare real coffee leaf field photos. They are used only to TEST, never to train.

  uv run scripts/prepare/prepare_field.py uganda
  uv run scripts/prepare/prepare_field.py kenya

Writes data/field/<set>/{images/, manifest.csv, audit.json, README.md}. The manifest has the same
columns the scoring code reads from data/bracol/manifest.csv: id, image, rust, group, severity, split.
Near-duplicates (flips, 90 degree turns, brightness changes) are grouped with a 256 bit image hash,
and one photo per group is kept. Photos turned by other angles cannot be caught this way.
"""
import argparse
import csv
import hashlib
import json
import random
import shutil
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent.parent
FIELD = ROOT / "data" / "field"
FIELDS = ["id", "image", "source", "split", "group", "rust", "severity", "label_name", "width", "height",
          "sha256", "cluster", "cluster_size", "in_eval"]
NEAR_DUP_BITS = 24  # of 256. Checked by eye on the Uganda set, see audit.json.
EVAL_PER_SIDE = 150  # the small balanced set that is scored first


def dihedral_hashes(im):
    """256 bit difference hash of the 8 flips and turns of a photo. Shape (8, 4) words."""
    out = []
    for flip in (False, True):
        base = im.transpose(Image.FLIP_LEFT_RIGHT) if flip else im
        for k in range(4):
            v = base.rotate(90 * k, expand=True) if k else base
            g = np.asarray(v.convert("L").resize((17, 16), Image.LANCZOS), dtype=np.int16)
            bits = (g[:, 1:] > g[:, :-1]).flatten()
            out.append(np.frombuffer(np.packbits(bits).tobytes(), dtype=">u8").astype(np.uint64))
    return np.stack(out)


def cluster(hashes, bits=NEAR_DUP_BITS):
    """Union photos closer than `bits` under any flip or turn. Returns a cluster id per photo."""
    H = np.stack(hashes)  # (n, 8, 4)
    n = len(H)
    parent = list(range(n))

    def find(a):
        while parent[a] != a:
            parent[a] = parent[parent[a]]
            a = parent[a]
        return a

    for s0 in range(0, n, 48):
        block = H[s0:s0 + 48, 0, :]  # (b, 4)
        d = np.bitwise_count(block[:, None, None, :] ^ H[None, :, :, :]).sum(axis=3).min(axis=2)  # (b, n)
        for i, j in zip(*np.nonzero(d <= bits)):
            i += s0
            if i < j:
                parent[find(int(j))] = find(int(i))
    return [find(i) for i in range(n)]


def sweep(hashes, bits_list=(8, 16, 24, 32, 48, 64)):
    return {b: len(set(cluster(hashes, b))) for b in bits_list}


def build(rows, name, source, keep_dir, total_note):
    """rows: dicts with path, label_name, rust (0 or 1), group. Writes the manifest."""
    good, bad = [], []
    for r in rows:
        try:
            with Image.open(r["path"]) as im:
                im.load()
                r["width"], r["height"] = im.size
                r["hashes"] = dihedral_hashes(im.convert("RGB"))
            r["sha256"] = hashlib.sha256(Path(r["path"]).read_bytes()).hexdigest()
            good.append(r)
        except Exception as e:  # empty or broken files exist in the Uganda zip
            bad.append({"path": str(Path(r["path"]).relative_to(ROOT)), "error": type(e).__name__})
    exact = {}
    for r in good:
        exact.setdefault(r["sha256"], []).append(r)
    uniq = [v[0] for v in exact.values()]
    sw = sweep([r["hashes"] for r in uniq])
    cl = cluster([r["hashes"] for r in uniq])
    groups = {}
    for r, c in zip(uniq, cl):
        groups.setdefault(c, []).append(r)
    kept = []
    for c, members in groups.items():
        members.sort(key=lambda r: r["path"])
        rep = members[0]
        # a cluster that mixes rust and no rust is a label conflict, so drop it from the test
        if len({m["rust"] for m in members}) > 1:
            continue
        rep["cluster"], rep["cluster_size"] = f"c{len(kept):05d}", len(members)
        kept.append(rep)
    kept.sort(key=lambda r: r["path"])
    conflicts = sum(1 for m in groups.values() if len({x["rust"] for x in m}) > 1)
    # a small balanced set to score first
    rng = random.Random(42)
    rust = [r for r in kept if r["rust"] == 1]
    other = [r for r in kept if r["rust"] == 0]
    rng.shuffle(rust)
    rng.shuffle(other)
    chosen = {id(r) for r in rust[:EVAL_PER_SIDE] + other[:EVAL_PER_SIDE]}
    out_dir = FIELD / name
    img_dir = out_dir / "images"
    if img_dir.exists():
        shutil.rmtree(img_dir)
    img_dir.mkdir(parents=True)
    manifest = []
    for i, r in enumerate(kept):
        pid = f"{source[:2]}_{i:05d}"
        dst = img_dir / f"{pid}.jpg"
        if Path(r["path"]).suffix.lower() in (".jpg", ".jpeg"):
            shutil.copyfile(r["path"], dst)
        else:
            Image.open(r["path"]).convert("RGB").save(dst, quality=95)
        manifest.append({"id": pid, "image": str(dst.relative_to(ROOT)), "source": source, "split": "test",
                         "group": r["group"], "rust": r["rust"], "severity": "", "label_name": r["label_name"],
                         "width": r["width"], "height": r["height"], "sha256": r["sha256"],
                         "cluster": r["cluster"], "cluster_size": r["cluster_size"], "in_eval": int(id(r) in chosen)})
    with open(out_dir / "manifest.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(manifest)
    by_label = {}
    for m in manifest:
        by_label[m["label_name"]] = by_label.get(m["label_name"], 0) + 1
    audit = {"files_found": len(rows), "unreadable": len(bad), "unreadable_examples": bad[:10],
             "exact_copies_removed": len(good) - len(uniq), "near_duplicate_groups_by_threshold": sw,
             "threshold_used_bits": NEAR_DUP_BITS, "clusters_with_label_conflict_dropped": conflicts,
             "kept": len(manifest), "kept_by_label": by_label, "rust": sum(m["rust"] for m in manifest),
             "in_eval": sum(m["in_eval"] for m in manifest), "note": total_note}
    (out_dir / "audit.json").write_text(json.dumps(audit, indent=1) + "\n")
    print(json.dumps(audit, indent=1))
    return manifest, audit


def uganda():
    base = next((FIELD / "uganda" / "raw").rglob("coffee dataset"))
    names = {"Health leaves": ("healthy", "healthy", 0), "leaf rust": ("rust", "rust", 1), "phoma": ("phoma", "other", 0)}
    rows = []
    for folder, (label, group, rust) in names.items():
        for p in sorted((base / folder).glob("*.jpg")):
            rows.append({"path": str(p), "label_name": label, "group": group, "rust": rust})
    manifest, audit = build(rows, "uganda", "field_uganda", None,
                            "Authors report flips, rotations and brightness changes added to balance classes.")
    readme(FIELD / "uganda", "Uganda smartphone coffee leaf set", manifest, audit, [
        "Source: Chelangat, Anirwoth, Mayanja, Sserwadda (2025), Mendeley Data, doi 10.17632/k36wnd6knb.1, CC BY 4.0.",
        "Zip downloaded 2026-10-04, 26,024,910 bytes, sha256 ceab111e7b17744918e80aee1dffa26d19e5a0abeda53bc0a7dd73ff8faeb70a.",
        "What it is: smartphone photos from farms in Uganda, daylight and low light, one leaf each, 256x256 JPEG.",
        "What it does not cover: Arabica from other regions, whole plants, hands and field clutter at full size, "
        "and severity (no severity labels, so the severity column is empty).",
        "Known problems: 100 empty files in the Healthy folder and 2 in the rust folder. The authors added flips, "
        "rotations and brightness changes to balance classes. Copies that are flips, 90 degree turns or brightness "
        "changes were removed by image hash. Copies turned by other angles may remain.",
        "Use: test only. Never train on it."])


def api(url, tries=8):
    """GET with a pause after each call and a back-off when the server says slow down (429)."""
    for k in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "shhs-field-prep"})
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
            time.sleep(0.6)
            return data
        except urllib.error.HTTPError as e:
            if e.code not in (429, 502, 503) or k == tries - 1:
                raise
            time.sleep(min(60, 8 * (k + 1)))


KENYA_NOTES = [
        "Source: JMuBEN and JMuBEN2, Mutira plantation, Kirinyaga county, Kenya, Mendeley Data doi 10.17632/tgv3zb82nd.1 "
        "and 10.17632/t2r6rszp5c.1, CC BY. Read through the Hugging Face copy Project-AgML/arabica_coffee_leaf_disease_classification "
        "(CC BY 4.0, 58,549 images). Only a random sample of single rows was fetched, a few MB.",
        "What it is: Fujifilm X-T4 photos taken on sunny, windy and cloudy days, both leaf sides, cropped to the centre square, "
        "labelled by a pathologist in the field. In this copy every image is 128x128, so lesions are small.",
        "What it does not cover: whole plants, hands, phone cameras, and severity (the severity column is empty).",
        "Known problems: many photos may come from the same leaf, so neighbouring rows were not taken together. "
        "Near-duplicates under flips and 90 degree turns were removed by image hash.",
        "Warning: in the Hugging Face copy the colours look shifted. Rust photos are pale and mauve with few orange spots, "
        "healthy photos are cyan-green, and many photos come in near-copy pairs. Swapping red and blue does not fix it. "
        "Treat this set as a stress test, not as evidence of field accuracy.",
        "Use: test only. Never train on it."]


def kenya():
    ds = "Project-AgML/arabica_coffee_leaf_disease_classification"
    names = ["Cerscospora", "Healthy", "Leaf_rust", "Miner", "Phoma"]
    raw = FIELD / "kenya" / "raw"
    cached = sorted(raw.glob("*.jpg")) if raw.exists() else []
    if len(cached) >= 200:  # fetched before: do not ask the server again
        lab = {"Leaf_rust": ("rust", "rust", 1), "Healthy": ("healthy", "healthy", 0), "Miner": ("miner", "other", 0),
               "Phoma": ("phoma", "other", 0), "Cerscospora": ("cercospora", "other", 0)}
        rows_c = []
        for p in cached:
            k = p.stem.rsplit("_", 1)[0]
            rows_c.append({"path": str(p), "label_name": lab[k][0], "group": lab[k][1], "rust": lab[k][2]})
        manifest, audit = build(rows_c, "kenya", "field_kenya", None,
                                f"Reused {len(cached)} photos fetched earlier from the Hugging Face rows API, random chunks of 100 rows, "
                                "at most 6 rust and 3 of each other class per chunk.")
        readme(FIELD / "kenya", "Kenya JMuBEN coffee leaf sample", manifest, audit, KENYA_NOTES)
        return
    info = json.loads(api(f"https://datasets-server.huggingface.co/size?dataset={ds}"))
    n_rows = info["size"]["dataset"]["num_rows"]
    quota = {"Leaf_rust": 160, "Healthy": 60, "Miner": 40, "Phoma": 40, "Cerscospora": 40}
    per_chunk = {k: (6 if k == "Leaf_rust" else 3) for k in quota}
    rng = random.Random(7)
    got, picked, seen_chunks = {k: [] for k in quota}, 0, 0
    while any(len(got[k]) < quota[k] for k in quota) and seen_chunks < 120:
        start = rng.randrange(0, n_rows - 100)
        seen_chunks += 1
        q = urllib.parse.urlencode({"dataset": ds, "config": "default", "split": "train", "offset": start, "length": 100})
        rows = json.loads(api(f"https://datasets-server.huggingface.co/rows?{q}"))["rows"]
        rng.shuffle(rows)
        taken = {k: 0 for k in quota}
        for r in rows:
            k = names[r["row"]["label"]]
            if len(got[k]) < quota[k] and taken[k] < per_chunk[k]:
                got[k].append((r["row_idx"], r["row"]["image"]["src"]))
                taken[k] += 1
    raw = FIELD / "kenya" / "raw"
    raw.mkdir(parents=True, exist_ok=True)
    rows_out = []
    for k, items in got.items():
        for idx, src in items:
            p = raw / f"{k}_{idx}.jpg"
            if not p.exists():
                p.write_bytes(api(src))
            rows_out.append({"path": str(p), "label_name": k.lower().replace("leaf_rust", "rust").replace("cerscospora", "cercospora"),
                             "group": "rust" if k == "Leaf_rust" else ("healthy" if k == "Healthy" else "other"),
                             "rust": int(k == "Leaf_rust")})
    manifest, audit = build(rows_out, "kenya", "field_kenya", None,
                            f"Sampled {sum(len(v) for v in got.values())} rows from {n_rows} using the Hugging Face rows API, "
                            f"from {seen_chunks} random chunks of 100, at most 6 rust and 3 of each other class per chunk.")
    readme(FIELD / "kenya", "Kenya JMuBEN coffee leaf sample", manifest, audit, KENYA_NOTES)


def readme(out_dir, title, manifest, audit, lines):
    body = [f"# {title}", "", "Real field photos used only to test the rust yes or no model.", ""]
    body += [f"- {x}" for x in lines]
    body += ["", f"Photos kept: {audit['kept']} ({audit['rust']} rust). Small balanced test set (`in_eval` = 1): {audit['in_eval']}.",
             "", "Photos kept by label:", ""]
    body += [f"- {k}: {v}" for k, v in sorted(audit["kept_by_label"].items())]
    body += ["", "Rebuild: `uv run scripts/prepare/prepare_field.py " + out_dir.name + "`", ""]
    (out_dir / "README.md").write_text("\n".join(body))


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("which", choices=["uganda", "kenya"])
    {"uganda": uganda, "kenya": kenya}[ap.parse_args().which]()
