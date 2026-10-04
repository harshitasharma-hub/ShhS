#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["numpy", "opencv-python-headless"]
# ///
"""Plan, render and finish a synthetic leaf set, then write its manifest.

Every image comes from one real BRACOL TRAIN leaf, so the label is that leaf's label. Val and test
leaves are never used. The run can be stopped and started again: finished images are skipped.

  uv run scripts/synth/generate.py v1 --dry-run          # show the plan only
  uv run scripts/synth/generate.py v1                    # render the train set, one worker
  uv run scripts/synth/generate.py unusable              # about 150 bad photos, for the "not sure" test
  uv run scripts/synth/generate.py v1 --limit 40         # first 40 jobs, to check the look

Output: data/synthetic/<version>/{images/, meta/, manifest.csv, jobs.json}.
manifest.csv has the same columns as data/bracol/manifest.csv, plus source_id (the BRACOL leaf id),
mode, preset and seed. To train on a data-scarcity subset, keep rows whose source_id is in that subset.
"""
import argparse
import csv
import hashlib
import importlib.util
import json
import os
import random
import subprocess
import sys
import time
import zlib
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent.parent
BLENDER = "/Applications/Blender.app/Contents/MacOS/Blender"
SYN = ROOT / "data" / "synthetic"
TEX = SYN / "textures"
BRACOL = ROOT / "data" / "bracol" / "manifest.csv"

spec = importlib.util.spec_from_file_location("phone_effects", Path(__file__).with_name("phone_effects.py"))
phone = importlib.util.module_from_spec(spec)
spec.loader.exec_module(phone)

PRESET_WEIGHTS = {"overcast": 24, "sun": 18, "golden": 10, "shade": 10, "backlit": 6, "rain": 16, "sun_wet": 10}
WHOLE_RES = [([1024, 512], 0.60), ([768, 768], 0.20), ([896, 672], 0.20)]
P_STUDIO, P_CLOSEUP = 0.12, 0.40  # share of renders per leaf. The rest are whole-leaf field scenes.
CLOSEUP_OUT = [(256, 0.35), (384, 0.25), (512, 0.40)]
BAD_KINDS = ["no_leaf", "tiny", "defocus", "glare", "dark"]
COLUMNS = ["id", "image", "source", "split", "group", "rust", "miner", "phoma", "cercospora", "severity",
           "predominant", "n_stress", "stratum", "width", "height", "sha256",
           "source_id", "mode", "preset", "seed", "bad", "expect_unsure"]


def pick(rng, weighted):
    r, acc = rng.random() * sum(w for _, w in weighted), 0.0
    for v, w in weighted:
        acc += w
        if r <= acc:
            return v
    return weighted[-1][0]


def seed_for(*parts):
    return zlib.crc32("-".join(map(str, parts)).encode()) & 0x7FFFFFFF


def closeup_aim(rng, row, les):
    """Where a close-up should look. A rust leaf must be aimed at its orange spots, or the label is wrong."""
    L = les.get(row["id"])
    if not L:
        return None
    if row["rust"] == "1":
        a = L["aim_orange"][:4]
        if not a or L["orange_frac"] < 0.002:
            return None
        p = pick(rng, [(x, x[2]) for x in a])
        return [p[0], p[1]]
    if L["aim_brown"] and rng.random() < 0.6:
        p = rng.choice(L["aim_brown"][:4])
    elif L["aim_random"]:
        p = rng.choice(L["aim_random"])
    else:
        return None
    return [p[0], p[1]]


def plan(version, bad_per_kind, healthy_pool, rows, les):
    jobs = []
    for row in rows:
        rng = random.Random(seed_for(version, "plan", row["id"]))
        severe = row["rust"] == "1" and row["severity"] in ("3", "4")
        n = 3 if severe else 1
        for k in range(n):
            aim = closeup_aim(rng, row, les)
            r = rng.random()
            mode = "studio" if r < P_STUDIO else ("closeup" if (aim and r < P_STUDIO + P_CLOSEUP) else "whole")
            if severe and k == 1 and aim:
                mode = "closeup"  # the three renders of a severe leaf cover different views
            job = {"leaf": int(row["id"]), "seed": seed_for(version, row["id"], k), "k": k}
            if mode == "studio":
                job.update(preset="studio", res=pick(rng, [([1024, 512], 0.7), ([896, 672], 0.3)]), mode="whole")
            elif mode == "closeup":
                job.update(preset=pick(rng, list(PRESET_WEIGHTS.items())), res=[512, 512], mode="closeup", aim_uv=aim)
            else:
                job.update(preset=pick(rng, list(PRESET_WEIGHTS.items())), res=pick(rng, WHOLE_RES), mode="whole")
            job["bg_leaves"] = rng.sample([h for h in healthy_pool if h != job["leaf"]], 14)
            jobs.append(job)
    return jobs


def plan_unusable(version, per_kind, healthy_pool, rows):
    jobs = []
    for kind in BAD_KINDS:
        for k in range(per_kind):
            rng = random.Random(seed_for(version, kind, k))
            row = rng.choice(rows)
            preset = "overcast" if kind in ("no_leaf", "tiny", "defocus") else ("sun_wet" if kind == "glare" else "shade")
            if kind == "dark":
                preset = rng.choice(["shade", "overcast"])
            job = {"leaf": int(row["id"]), "seed": seed_for(version, kind, k), "k": k, "preset": preset, "bad": kind,
                   "res": pick(rng, WHOLE_RES), "mode": "none" if kind == "no_leaf" else "whole",
                   "bg_leaves": rng.sample([h for h in healthy_pool if h != int(row["id"])], 14)}
            jobs.append(job)
    return jobs


def run_blender(chunk, path, log):
    path.write_text(json.dumps(chunk))
    cmd = [BLENDER, "-b", "--factory-startup", "--python", str(ROOT / "scripts/synth/blender_render.py"), "--", str(path)]
    p = subprocess.run(cmd, capture_output=True, text=True, cwd=ROOT, preexec_fn=lambda: os.nice(10))
    with open(log, "a") as f:
        for line in (p.stdout + p.stderr).splitlines():
            if line.startswith(("[render]", "[fail]", "Traceback", "  File", "Error", "AttributeError", "TypeError", "KeyError")):
                f.write(line + "\n")
    return p.returncode


def finish(job, root, brow):
    """Add the phone effects to one raw render. Returns a manifest row, or None if the render is missing."""
    raw = root / "raw" / f"{job['jid']}.png"
    if not raw.exists():
        return None
    im = cv2.imread(str(raw), cv2.IMREAD_COLOR)
    rng = np.random.default_rng(zlib.crc32(job["jid"].encode()))
    bad = job.get("bad")
    force = {}
    if bad == "defocus":
        force["blur_sigma"] = (3.0, 7.0)
    if bad in ("glare", "dark"):
        force["skip_ae"] = True
    if bad == "dark":
        force["noise_mult"] = 3.0
    out_max = None
    if job["mode"] == "closeup":
        out_max = pick(rng if False else random.Random(job["seed"]), CLOSEUP_OUT)
    img, q, log = phone.apply(im, rng, rainy=job["preset"] in ("rain", "sun_wet"), out_max=out_max, force=force)
    dst = root / "images" / f"{job['jid']}.jpg"
    cv2.imwrite(str(dst), img, [cv2.IMWRITE_JPEG_QUALITY, q])
    meta = json.loads((root / "raw" / f"{job['jid']}.json").read_text())
    meta["phone"] = log
    (root / "meta").mkdir(exist_ok=True)
    (root / "meta" / f"{job['jid']}.json").write_text(json.dumps(meta))
    for f in (raw, root / "raw" / f"{job['jid']}.json", root / "raw" / f"{job['jid']}.png.draft.png"):
        if f.exists():
            f.unlink()
    h, w = img.shape[:2]
    row = {c: brow.get(c, "") for c in COLUMNS}
    row.update(id=job["jid"], image=str(dst.relative_to(ROOT)), source="synthetic", split="train", width=w, height=h,
               sha256=hashlib.sha256(dst.read_bytes()).hexdigest(), source_id=job["leaf"], mode=job["mode"],
               preset=job["preset"], seed=job["seed"], bad=bad or "", expect_unsure=int(bool(bad)))
    if bad:
        row.update(group="unusable", rust="", miner="", phoma="", cercospora="", severity="", predominant="", n_stress="", stratum="")
    return row


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("version", help="v1, or unusable")
    ap.add_argument("--workers", type=int, default=1)
    ap.add_argument("--chunk", type=int, default=40, help="jobs per Blender start")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--per-kind", type=int, default=30, help="unusable photos per kind")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    man = {r["id"]: r for r in csv.DictReader(open(BRACOL))}
    tex = {r["id"]: r for r in csv.DictReader(open(TEX / "textures.csv"))}
    les = json.loads((TEX / "lesions.json").read_text())
    rows = [man[i] for i in sorted(tex, key=int) if tex[i]["mask_ok"] == "1" and man[i]["split"] == "train"]
    assert all(r["split"] == "train" for r in rows)
    healthy_pool = [int(r["id"]) for r in rows if r["group"] == "healthy"]
    root = SYN / a.version
    for d in ("raw", "images", "meta"):
        (root / d).mkdir(parents=True, exist_ok=True)
    jobs = plan_unusable(a.version, a.per_kind, healthy_pool, rows) if a.version == "unusable" else \
        plan(a.version, 0, healthy_pool, rows, les)
    for j in jobs:
        j["jid"] = f"{a.version[0]}{j['leaf']:04d}_{j.get('bad') or j['mode']}_{j['k']}"
        j["out"] = str((root / "raw" / f"{j['jid']}.png").relative_to(ROOT))
    (root / "jobs.json").write_text(json.dumps(jobs))
    print(f"{len(jobs)} jobs from {len(rows)} train leaves")
    print("mode:", dict(Counter(j["mode"] if not j.get("bad") else "bad:" + j["bad"] for j in jobs)))
    print("preset:", dict(Counter(j["preset"] for j in jobs)))
    print("label:", dict(Counter(("rust" if man[str(j["leaf"])]["rust"] == "1" else "no rust") for j in jobs)))
    if a.dry_run:
        return
    mpath = root / "manifest.csv"
    done = {}
    if mpath.exists():
        done = {r["id"]: r for r in csv.DictReader(open(mpath))}
    todo = [j for j in jobs if j["jid"] not in done]
    if a.limit:
        todo = todo[:a.limit]
    print(f"{len(done)} already done, {len(todo)} to render", flush=True)
    log = ROOT / "logs" / f"generate_{a.version}.log"
    log.parent.mkdir(exist_ok=True)
    chunks = [todo[i:i + a.chunk] for i in range(0, len(todo), a.chunk)]
    t0, n_done = time.time(), 0
    new_file = not mpath.exists()
    with open(mpath, "a", newline="") as mf:
        w = csv.DictWriter(mf, fieldnames=COLUMNS)
        if new_file:
            w.writeheader()

        def work(args):
            i, chunk = args
            rc = run_blender(chunk, root / "raw" / f"jobs_{i}.json", log)
            return chunk, rc

        with ThreadPoolExecutor(a.workers) as ex:
            for chunk, rc in ex.map(work, enumerate(chunks)):
                for j in chunk:
                    row = finish(j, root, man[str(j["leaf"])])
                    if row:
                        w.writerow(row)
                        n_done += 1
                mf.flush()
                (root / "raw" / f"jobs_{chunks.index(chunk)}.json").unlink(missing_ok=True)
                el = time.time() - t0
                print(f"  {len(done) + n_done}/{len(done) + len(todo)} done, {el / max(n_done, 1):.1f} s per image, "
                      f"blender exit {rc}", flush=True)
    print(f"finished {n_done} images in {(time.time() - t0) / 60:.1f} min -> {mpath}")


if __name__ == "__main__":
    main()
