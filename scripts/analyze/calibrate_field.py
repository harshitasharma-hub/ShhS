#!/usr/bin/env python3
"""Pick the cut-off and the "not sure" margin on Uganda photos outside the test sample, then test on the test sample.

  python3 scripts/analyze/calibrate_field.py
Needs runs/<run>/scores_field_uganda_all.csv, made by scripts/model/score_field.py --all. Uses only the standard library.
Test sample: the 300 in_eval Uganda photos, 150 rust and 150 not. Calibration pool: the other Uganda photos, minus any
photo whose near-copy group also has a photo in the test sample. The cut-off maximizes balanced accuracy. The margin is
the smallest one for which the photos the tool answers reach the target balanced accuracy. Writes results/calibration.md.
"""
import csv
import json
import random
import statistics
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
RUNS = ROOT / "runs"
TARGET = 0.95
SIZES = (25, 50, 100, 200, 500, 0)  # 0 means the whole pool
REPEATS = 40
NAMES = {"zeroshot": "Zero-shot", "real": "Real only", "syn": "Synthetic only", "mix": "Synthetic + real"}
ORDER = ("zeroshot", "real", "syn", "mix")
SHOWN = (("zeroshot", 0), ("real", 10), ("real", 100), ("syn", 0), ("mix", 10), ("mix", 100))


def balanced_accuracy(y, s, t):
    pos = [si >= t for si, yi in zip(s, y) if yi == 1]
    neg = [si < t for si, yi in zip(s, y) if yi == 0]
    if not pos or not neg:
        return float("nan")
    return (sum(pos) / len(pos) + sum(neg) / len(neg)) / 2


def best_cutoff(y, s):
    return max(sorted(set(s)), key=lambda t: balanced_accuracy(y, s, t))


def margin_for_target(y, s, t):
    """The smallest margin around the cut-off for which the answered photos reach the target. Infinite when none does."""
    for m in [0.0] + sorted({abs(si - t) for si in s}):
        keep = [i for i, si in enumerate(s) if abs(si - t) >= m]
        if len(keep) >= 10 and balanced_accuracy([y[i] for i in keep], [s[i] for i in keep], t) >= TARGET:
            return m
    return float("inf")


def test_result(y, s, t, m):
    keep = [i for i, si in enumerate(s) if abs(si - t) >= m]
    answered = balanced_accuracy([y[i] for i in keep], [s[i] for i in keep], t) if len(keep) >= 10 else float("nan")
    return {"accuracy": balanced_accuracy(y, s, t), "coverage": len(keep) / len(y), "answered": answered}


def split_arm(arm):
    family, _, tag = arm.partition("-")
    return family, tag


def name(arm, fraction):
    family, tag = split_arm(arm)
    return NAMES[family] + (f" ({tag})" if tag else "") + (f", {fraction}% real" if family in ("real", "mix") else "")


def pct(x):
    return f"{100 * x:.1f}%"


def mean_pct(values):
    values = [v for v in values if v == v]
    return pct(statistics.mean(values)) if values else "-"


def main():
    manifest = {r["id"]: r for r in csv.DictReader(open(ROOT / "data/field/uganda/manifest.csv"))}
    test_ids = [i for i, r in manifest.items() if r["in_eval"] == "1"]
    test_clusters = {manifest[i]["cluster"] for i in test_ids}
    pool_ids = [i for i, r in manifest.items() if r["in_eval"] != "1" and r["cluster"] not in test_clusters]
    left_out = sum(1 for r in manifest.values() if r["in_eval"] != "1" and r["cluster"] in test_clusters)

    arms = defaultdict(list)  # (arm, real percent) -> [(cut-off picked on BRACOL, scores by id)]
    for d in sorted(RUNS.iterdir()):
        f = d / "scores_field_uganda_all.csv"
        if not f.exists() or ("_d140_" not in d.name and d.name != "zeroshot_d140_cuda"):
            continue
        arm = d.name.split("_")[0]
        fraction = int(d.name.split("_f")[1].split("_")[0]) if split_arm(arm)[0] in ("real", "mix") else 0
        scores = {r["id"]: (int(r["rust"]), float(r["score"])) for r in csv.DictReader(open(f))}
        arms[(arm, fraction)].append((json.loads((d / "metrics.json").read_text())["threshold_from_val"], scores))
    keys = sorted(arms, key=lambda k: (ORDER.index(split_arm(k[0])[0]), k[0], k[1]))

    def labels(scores, ids):
        return [scores[i][0] for i in ids], [scores[i][1] for i in ids]

    lines = ["# Setting the cut-off and the not-sure margin on field photos", "",
             f"Test: {len(test_ids)} Uganda photos, 150 rust and 150 not. Calibration pool: {len(pool_ids)} other Uganda photos "
             f"({left_out} more were left out because a near copy sits in the test sample). "
             f"The cut-off maximizes balanced accuracy on the pool. The not-sure margin is the smallest one for which the answered "
             f"photos reach {TARGET:.0%} balanced accuracy on the pool. Numbers are means over seeds.", "",
             "## With the whole pool", "",
             "| Arm | Accuracy, BRACOL cut-off | Accuracy, field cut-off | Not-sure: answers | Right when it answers |", "|---|---|---|---|---|"]
    for k in keys:
        before, after = [], []
        for bracol_cutoff, scores in arms[k]:
            yp, sp = labels(scores, pool_ids)
            yt, st = labels(scores, test_ids)
            t = best_cutoff(yp, sp)
            after.append(test_result(yt, st, t, margin_for_target(yp, sp, t)))
            before.append(balanced_accuracy(yt, st, bracol_cutoff))
        lines.append(f"| {name(*k)} | {mean_pct(before)} | {mean_pct(r['accuracy'] for r in after)} | "
                     f"{mean_pct(r['coverage'] for r in after)} | {mean_pct(r['answered'] for r in after)} |")

    lines += ["", "## How many local photos are needed", "",
              f"The cut-off and margin are set on a random sample of the pool, {REPEATS} draws each. "
              "Accuracy is on all 300 test photos. Answers and Right when it answers are for the not-sure mode.", "",
              "| Arm | Local photos | Accuracy | Not-sure: answers | Right when it answers |", "|---|---|---|---|---|"]
    rng = random.Random(0)
    for k in keys:
        if k not in SHOWN and "-" not in k[0]:
            continue
        for n in SIZES:
            accs, covs, answered = [], [], []
            for _, scores in arms[k]:
                yt, st = labels(scores, test_ids)
                for _ in range(1 if n == 0 else REPEATS):
                    ids = pool_ids if n == 0 else rng.sample(pool_ids, n)
                    yp, sp = labels(scores, ids)
                    if len(set(yp)) < 2:
                        continue
                    t = best_cutoff(yp, sp)
                    r = test_result(yt, st, t, margin_for_target(yp, sp, t))
                    accs.append(r["accuracy"])
                    covs.append(r["coverage"])
                    answered.append(r["answered"])
            if accs:
                spread = f" +/- {100 * statistics.pstdev(accs):.1f}" if len(accs) > 1 else ""
                lines.append(f"| {name(*k)} | {n or len(pool_ids)} | {pct(statistics.mean(accs))}{spread} | "
                             f"{mean_pct(covs)} | {mean_pct(answered)} |")
    (ROOT / "results" / "calibration.md").write_text("\n".join(lines) + "\n")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
