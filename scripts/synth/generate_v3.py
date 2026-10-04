#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["numpy", "opencv-python-headless"]
# ///
"""Make v3: a complete replacement for v1 with hard negatives for "orange means rust".

Why: a model trained on v1 calls other-disease leaves "rust" on real Uganda photos, because in v1 orange
shows up almost only on rust leaves. Real phoma and cercospora photos have big dark lesions with a yellow or
orange rim.

What v3 holds (same size as v1, same manifest columns, train leaves only, labels from the source leaf):
  - every v1 photo of a healthy, unclear or rust leaf, copied unchanged. The rust close-ups are as they were.
  - for each other-disease leaf, one NEW render of a texture whose brown lesions got a yellow, golden or
    orange rim (scripts/synth/add_rims.py). 72% close-ups aimed at a lesion, tight enough that the lesion and
    its rim fill much of the frame, 20% whole leaves, 8% plain background.
  - v1 and v2 are not touched.

manifest.csv is written LAST, in one step, after every picture has been checked. While the run goes on, the rows
are in manifest.partial.csv, so nobody can pick up a half-made set.

  uv run scripts/synth/add_rims.py          # first: paint the rims
  uv run scripts/synth/generate_v3.py --dry-run
  uv run scripts/synth/generate_v3.py
"""
import argparse
import csv
import importlib.util
import json
import os
import random
import shutil
import time
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import cv2

spec = importlib.util.spec_from_file_location("generate", Path(__file__).with_name("generate.py"))
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)

ROOT, SYN, COLUMNS = gen.ROOT, gen.SYN, gen.COLUMNS
RIM_DIR = SYN / "textures_rim"
V1, V3 = SYN / "v1", SYN / "v3"
P_STUDIO, P_CLOSEUP = 0.08, 0.72
LEAF_CM = 14.0  # a typical leaf length. The real one is drawn at render time between 11 and 17 cm.


def plan_new(rims, man, healthy_pool):
    jobs = []
    for tid, info in sorted(rims.items(), key=lambda kv: int(kv[0].split("_r")[0])):
        leaf = info["leaf"]
        row = man[str(leaf)]
        assert row["split"] == "train" and row["rust"] == "0" and row["group"] == "other", tid
        rng = random.Random(gen.seed_for("v3", tid))
        r = rng.random()
        if r < P_STUDIO:
            mode = "studio"
        elif r < P_STUDIO + P_CLOSEUP:
            mode = "closeup"
        else:
            mode = "whole"
        job = {"leaf": leaf, "tex_id": tid, "tex_dir": str(RIM_DIR), "seed": gen.seed_for("v3", tid, 0), "k": 0}
        if mode == "closeup":
            les = info["lesions"]
            big = rng.choices(les, weights=[l["area"] ** 1.5 for l in les])[0]  # big lesions first, like the Uganda photos
            frame = min(7.0, max(2.0, big["diam_frac"] * LEAF_CM * rng.uniform(1.7, 3.2)))
            job.update(preset=gen.pick(rng, list(gen.PRESET_WEIGHTS.items())), res=[512, 512], mode="closeup",
                       aim_uv=[big["cx"], big["cy"]], frame_cm=round(frame, 2), lens_cap=140.0, loose_aim=True)
        elif mode == "studio":
            job.update(preset="studio", res=gen.pick(rng, [([1024, 512], 0.7), ([896, 672], 0.3)]), mode="whole")
        else:
            job.update(preset=gen.pick(rng, list(gen.PRESET_WEIGHTS.items())), res=gen.pick(rng, gen.WHOLE_RES), mode="whole")
        job["bg_leaves"] = rng.sample([h for h in healthy_pool if h != leaf], 14)
        job["rim"] = {"color": info["color"], "width_k": info["width_k"], "strength": info["strength"], "power": info["power"]}
        job["jid"] = f"v3_{tid}_{job['mode']}_0"
        job["out"] = str((V3 / "raw" / f"{job['jid']}.png").relative_to(ROOT))
        jobs.append(job)
    return jobs


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--chunk", type=int, default=40)
    ap.add_argument("--workers", type=int, default=1)
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    man = {r["id"]: r for r in csv.DictReader(open(gen.BRACOL))}
    tex = {r["id"]: r for r in csv.DictReader(open(gen.TEX / "textures.csv"))}
    rows = [man[i] for i in sorted(tex, key=int) if tex[i]["mask_ok"] == "1" and man[i]["split"] == "train"]
    healthy_pool = [int(r["id"]) for r in rows if r["group"] == "healthy"]
    rims = json.loads((RIM_DIR / "rims.json").read_text())
    v1 = list(csv.DictReader(open(V1 / "manifest.csv")))
    rim_leaves = {str(v["leaf"]) for v in rims.values()}
    copy_rows = [r for r in v1 if r["source_id"] not in rim_leaves]
    replaced = [r for r in v1 if r["source_id"] in rim_leaves]
    jobs = plan_new(rims, man, healthy_pool)
    expected = len(copy_rows) + len(jobs)
    print(f"v1 has {len(v1)} photos. Copy {len(copy_rows)} unchanged, replace {len(replaced)} with {len(jobs)} new renders.")
    print("copied by group:", dict(Counter(r["group"] for r in copy_rows)))
    print("new by mode:", dict(Counter(("studio" if j["preset"] == "studio" else j["mode"]) for j in jobs)))
    print("new rim colours:", dict(Counter(j["rim"]["color"] for j in jobs)))
    print("expected total:", expected)
    if a.dry_run:
        return

    for d in ("raw", "images", "meta"):
        (V3 / d).mkdir(parents=True, exist_ok=True)
    final, partial = V3 / "manifest.csv", V3 / "manifest.partial.csv"
    if final.exists():
        raise SystemExit("v3/manifest.csv exists already. Move it away first if you want to rebuild.")
    done = {}
    if partial.exists():
        done = {r["id"]: r for r in csv.DictReader(open(partial))}
    t0 = time.time()
    with open(partial, "a", newline="") as mf:
        w = csv.DictWriter(mf, fieldnames=COLUMNS)
        if not done:
            w.writeheader()
        # 1. copy the unchanged v1 photos
        n_copy = 0
        for r in copy_rows:
            if r["id"] in done:
                continue
            src_img, dst_img = ROOT / r["image"], V3 / "images" / Path(r["image"]).name
            shutil.copyfile(src_img, dst_img)
            src_meta = V1 / "meta" / f"{r['id']}.json"
            if src_meta.exists():
                shutil.copyfile(src_meta, V3 / "meta" / src_meta.name)
            row = dict(r)
            row["image"] = str(dst_img.relative_to(ROOT))
            w.writerow(row)
            done[r["id"]] = row
            n_copy += 1
        mf.flush()
        print(f"copied {n_copy} photos from v1", flush=True)

        # 2. render the new ones
        log = ROOT / "logs" / "generate_v3.log"
        log.parent.mkdir(exist_ok=True)
        todo = [j for j in jobs if j["jid"] not in done]
        random.Random(12345).shuffle(todo)  # a stopped run is still a fair sample
        if a.limit:
            todo = todo[:a.limit]
        # renders that exist but were not finished (an earlier run stopped) only need the phone step
        for j in jobs:
            if j["jid"] not in done and (V3 / "raw" / f"{j['jid']}.png").exists():
                row = gen.finish(j, V3, man[str(j["leaf"])], 0)
                if row:
                    w.writerow(row)
                    done[j["jid"]] = row
        todo = [j for j in todo if j["jid"] not in done]
        chunks = [todo[i:i + a.chunk] for i in range(0, len(todo), a.chunk)]
        print(f"{len(done)} rows in the partial manifest, {len(todo)} to render", flush=True)

        def work(args):
            i, chunk = args
            return chunk, gen.run_blender(chunk, V3 / "raw" / f"jobs_{i}.json", log)

        n_new = 0
        with ThreadPoolExecutor(a.workers) as ex:
            for k, (chunk, rc) in enumerate(ex.map(work, enumerate(chunks))):
                for j in chunk:
                    row = gen.finish(j, V3, man[str(j["leaf"])], 0)
                    if row:
                        w.writerow(row)
                        done[j["jid"]] = row
                        n_new += 1
                mf.flush()
                (V3 / "raw" / f"jobs_{k}.json").unlink(missing_ok=True)
                print(f"  {len(done)}/{expected} rows, {(time.time() - t0) / max(n_new, 1):.1f} s per new render, blender exit {rc}", flush=True)

    # 3. check everything, then publish the manifest in one step
    if a.limit:
        print("limit given: the partial manifest stays partial.")
        return
    rows_out = list(csv.DictReader(open(partial)))
    problems = []
    if len(rows_out) != expected:
        problems.append(f"{len(rows_out)} rows, expected {expected}")
    if len({r["id"] for r in rows_out}) != len(rows_out):
        problems.append("duplicate ids")
    for r in rows_out:
        try:
            im = cv2.imread(str(ROOT / r["image"]))
            assert im is not None and im.size > 0
        except Exception:
            problems.append(f"unreadable {r['image']}")
        if r["split"] != "train" or man[r["source_id"]]["split"] != "train":
            problems.append(f"not a train leaf: {r['id']}")
        if r["rust"] != man[r["source_id"]]["rust"]:
            problems.append(f"label differs from source leaf: {r['id']}")
    if problems:
        raise SystemExit("NOT published, manifest.csv not written:\n  " + "\n  ".join(problems[:20]))
    os.replace(partial, final)
    print(f"published {final} with {len(rows_out)} photos in {(time.time() - t0) / 60:.1f} min")


if __name__ == "__main__":
    main()
