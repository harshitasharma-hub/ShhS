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
mode, preset and seed. Extra phone versions of the same render (--variants 2 or more) go to manifest_variants.csv,
never to manifest.csv. To train on a data-scarcity subset, keep rows whose source_id is in that subset.
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
           "source_id", "mode", "preset", "seed", "bad", "expect_unsure", "variant", "luma_mean", "luma_std", "sharp"]


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
    cmd = ["nice", "-n", "10", BLENDER, "-b", "--factory-startup", "--python",
           str(ROOT / "scripts/synth/blender_render.py"), "--", str(path)]  # low CPU priority: training shares this Mac
    p = subprocess.run(cmd, capture_output=True, text=True, cwd=ROOT)
    with open(log, "a") as f:
        for line in (p.stdout + p.stderr).splitlines():
            if line.startswith(("[render]", "[fail]", "Traceback", "  File", "Error", "AttributeError", "TypeError", "KeyError")):
                f.write(line + "\n")
    return p.returncode


def finish(job, root, brow, variant=0):
    """Add the phone effects to one raw render. Returns a manifest row, or None if the render is missing.
    The raw render stays on disk, so the effects can be redone or more variants made without Blender.
    Variant 0 is the main picture. Variants 1 and up are the same render with other camera luck."""
    raw = root / "raw" / f"{job['jid']}.png"
    if not raw.exists():
        return None
    stem = job["jid"] if variant == 0 else f"{job['jid']}_v{variant}"
    im = cv2.imread(str(raw), cv2.IMREAD_COLOR)
    rng = np.random.default_rng(zlib.crc32(stem.encode()))
    bad = job.get("bad")
    force = {}
    if bad == "defocus":
        force["blur_sigma"] = (5.0, 11.0)
    if bad == "glare":
        force["veil"] = (0.25, 0.45)
    if bad in ("glare", "dark"):
        force["skip_ae"] = True
    if bad == "dark":
        force["noise_mult"] = 3.0
    out_max = None
    if job["mode"] == "closeup":
        out_max = pick(random.Random(job["seed"] + variant), CLOSEUP_OUT)
    img, q, log = phone.apply(im, rng, rainy=job["preset"] in ("rain", "sun_wet"), out_max=out_max, force=force)
    dst = root / "images" / f"{stem}.jpg"
    cv2.imwrite(str(dst), img, [cv2.IMWRITE_JPEG_QUALITY, q])
    meta = json.loads((root / "raw" / f"{job['jid']}.json").read_text())
    meta["phone"] = log
    meta["variant"] = variant
    (root / "meta").mkdir(exist_ok=True)
    (root / "meta" / f"{stem}.json").write_text(json.dumps(meta))
    draft = root / "raw" / f"{job['jid']}.png.draft.png"
    if draft.exists():
        draft.unlink()
    h, w = img.shape[:2]
    grey = cv2.cvtColor(cv2.resize(img, (256, int(256 * h / w))), cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
    qc = {"luma_mean": round(float(grey.mean()), 3), "luma_std": round(float(grey.std()), 3),
          "sharp": round(float(cv2.Laplacian(grey, cv2.CV_32F).var() * 1000), 2)}
    row = {c: brow.get(c, "") for c in COLUMNS}
    row.update(qc)
    row.update(id=stem, image=str(dst.relative_to(ROOT)), source="synthetic", split="train", width=w, height=h,
               sha256=hashlib.sha256(dst.read_bytes()).hexdigest(), source_id=job["leaf"], mode=job["mode"],
               preset=job["preset"], seed=job["seed"], bad=bad or "", expect_unsure=int(bool(bad)), variant=variant)
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
    ap.add_argument("--variants", type=int, default=1, help="phone versions to make of each render (1 = the main one only)")
    ap.add_argument("--post-only", action="store_true", help="do not render; only make the missing phone versions from the raw renders")
    ap.add_argument("--redo-post", action="store_true", help="with --post-only: delete the finished pictures and make them again")
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
        prefix = a.version[0] if a.version in ("v1", "unusable") else a.version + "_"  # v1 keeps its short ids
        j["jid"] = f"{prefix}{j['leaf']:04d}_{j.get('bad') or j['mode']}_{j['k']}"
        j["out"] = str((root / "raw" / f"{j['jid']}.png").relative_to(ROOT))
    (root / "jobs.json").write_text(json.dumps(jobs))
    print(f"{len(jobs)} jobs from {len(rows)} train leaves")
    print("mode:", dict(Counter(j["mode"] if not j.get("bad") else "bad:" + j["bad"] for j in jobs)))
    print("preset:", dict(Counter(j["preset"] for j in jobs)))
    print("label:", dict(Counter(("rust" if man[str(j["leaf"])]["rust"] == "1" else "no rust") for j in jobs)))
    if a.dry_run:
        return
    mpath = root / "manifest.csv"
    if a.redo_post and mpath.exists():
        for f in (root / "images").glob("*.jpg"):
            f.unlink()
        mpath.unlink()
    vpath = root / "manifest_variants.csv"  # extra phone versions of a render live apart, so train.py never takes them by mistake
    if a.redo_post and vpath.exists():
        vpath.unlink()
    done = {}
    for q in (mpath, vpath):
        if q.exists():
            done.update({r["id"]: r for r in csv.DictReader(open(q))})
    log = ROOT / "logs" / f"generate_{a.version}.log"
    log.parent.mkdir(exist_ok=True)
    new_file, new_vfile = not mpath.exists(), not vpath.exists()
    t0, n_done = time.time(), 0
    with open(mpath, "a", newline="") as mf, open(vpath, "a", newline="") as vf:
        w = csv.DictWriter(mf, fieldnames=COLUMNS)
        wv = csv.DictWriter(vf, fieldnames=COLUMNS)
        if new_file:
            w.writeheader()
        if new_vfile:
            wv.writeheader()

        def post(job_list):
            nonlocal n_done
            for j in job_list:
                for v in range(a.variants):
                    stem = j["jid"] if v == 0 else f"{j['jid']}_v{v}"
                    if stem in done:
                        continue
                    row = finish(j, root, man[str(j["leaf"])], v)
                    if row:
                        (w if v == 0 else wv).writerow(row)
                        done[stem] = row
                        n_done += 1
            mf.flush()
            vf.flush()

        if a.post_only:
            post(jobs)
            print(f"post-only: made {n_done} pictures in {(time.time() - t0) / 60:.1f} min -> {mpath}")
            return
        todo = [j for j in jobs if not (root / "raw" / f"{j['jid']}.png").exists()]
        random.Random(12345).shuffle(todo)  # a stopped run is then still a fair random sample of the leaves
        if a.limit:
            todo = todo[:a.limit]
        # a render that exists but whose picture is not finished yet (an earlier run stopped) only needs the post step
        post([j for j in jobs if (root / "raw" / f"{j['jid']}.png").exists()])
        print(f"{len(done)} pictures done, {len(todo)} to render", flush=True)
        chunks = [todo[i:i + a.chunk] for i in range(0, len(todo), a.chunk)]

        def work(args):
            i, chunk = args
            rc = run_blender(chunk, root / "raw" / f"jobs_{i}.json", log)
            return chunk, rc

        with ThreadPoolExecutor(a.workers) as ex:
            for k, (chunk, rc) in enumerate(ex.map(work, enumerate(chunks))):
                post(chunk)
                (root / "raw" / f"jobs_{k}.json").unlink(missing_ok=True)
                el = time.time() - t0
                print(f"  {len(done)} pictures done, {el / max(n_done, 1):.1f} s per picture, blender exit {rc}", flush=True)
    print(f"finished: {n_done} new pictures in {(time.time() - t0) / 60:.1f} min -> {mpath}")


if __name__ == "__main__":
    main()
