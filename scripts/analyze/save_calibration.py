#!/usr/bin/env python3
"""Write runs/<run>/field_calibration.json: the cut-off and the "not sure" margin set on the Uganda local pool.

  python3 scripts/analyze/save_calibration.py --run real_d140_f10_s0
scripts/model/predict.py reads this file. The pool is the Uganda photos outside the 300 test photos, as in calibrate_field.py.
The run needs scores_field_uganda_all.csv, made by scripts/model/score_field.py --all. Uses only the standard library.
"""
import argparse
import csv
import json
from pathlib import Path

from calibrate_field import TARGET, best_cutoff, margin_for_target, test_result

ROOT = Path(__file__).resolve().parent.parent.parent


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--run", required=True)
    args = ap.parse_args()
    run = ROOT / "runs" / args.run

    manifest = {r["id"]: r for r in csv.DictReader(open(ROOT / "data/field/uganda/manifest.csv"))}
    test_ids = [i for i, r in manifest.items() if r["in_eval"] == "1"]
    test_clusters = {manifest[i]["cluster"] for i in test_ids}
    pool_ids = [i for i, r in manifest.items() if r["in_eval"] != "1" and r["cluster"] not in test_clusters]
    scores = {r["id"]: (int(r["rust"]), float(r["score"])) for r in csv.DictReader(open(run / "scores_field_uganda_all.csv"))}

    yp, sp = [scores[i][0] for i in pool_ids], [scores[i][1] for i in pool_ids]
    yt, st = [scores[i][0] for i in test_ids], [scores[i][1] for i in test_ids]
    cutoff = best_cutoff(yp, sp)
    margin = margin_for_target(yp, sp, cutoff)
    result = {
        "run": args.run,
        "cutoff": cutoff,
        "margin": margin,
        "set_on": f"{len(pool_ids)} Uganda photos outside the 300 test photos",
        "margin_rule": f"smallest margin for which the answered photos reach {TARGET:.0%} balanced accuracy on those photos",
        "on_the_300_test_photos": test_result(yt, st, cutoff, margin),
    }
    (run / "field_calibration.json").write_text(json.dumps(result, indent=1) + "\n")
    print(json.dumps(result, indent=1))


if __name__ == "__main__":
    main()
