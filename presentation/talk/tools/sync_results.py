#!/usr/bin/env python3
"""Copy the real scores from ../../runs and ../../results into src/results.js, so the talk shows what was measured.

  python3 tools/sync_results.py
  npm run build

What is copied, and only that. Nothing here is typed by hand.
  arms      Every run at image detail 140, grouped by arm, render recipe and share of real photos, averaged over seeds.
            Two test sets: the 261 clean BRACOL test photos (metrics.json) and all 1,792 Uganda farm photos (field_uganda_all.json).
  local     The cut-off and "not sure" tables from results/calibration.md (set on local Uganda photos, tested on 300 held-out ones).
  demo      The local setting of the demo run, runs/real_d140_f10_s0/field_calibration.json.
  counts    How many runs finished.

How a run is sorted. The folder name says what it was (see runs/README.md):
  zeroshot_d140_cuda   the model as it comes. It is the one zero-shot run on the same GPU as every trained run
  real_d140_f10_s0     real photos only, 10% of the 1,225 BRACOL train photos
  syn_d140_f0_s0       renders only (set 1), no real photo
  mix_d140_f100_s0     renders (set 1) plus all the real photos
  -v3 / -combo         the same arms with render set 3 or set 4 (combo)
The key of an arm is "<arm>[-<recipe>]:<real percent>", for example "mix-combo:100". The zero-shot key is "zeroshot".
Seeds are averaged. The interval is the widest 95% interval among the seeds.
"""
import glob
import json
import re
import statistics
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
REPO = HERE.parent.parent
RUNS = REPO / "runs"
CALIBRATION = REPO / "results" / "calibration.md"
OUT = HERE / "src" / "results.js"

DETAIL = 140
ZEROSHOT = "zeroshot_d140_cuda"
DEMO = "real_d140_f10_s0"
NAME = re.compile(r"^(zeroshot|real|syn|mix)(?:-([a-z0-9]+))?_d(\d+)(?:_f(\d+))?(?:_s(\d+))?")


def key_of(name):
    """The arm key of a run folder name, or None when the run is not part of the detail-140 grid."""
    if name == ZEROSHOT:
        return "zeroshot"
    m = NAME.match(name)
    if not m or m.group(1) == "zeroshot" or int(m.group(3)) != DETAIL:
        return None
    arm, recipe, _, frac, _ = m.groups()
    return f"{arm}{'-' + recipe if recipe else ''}:{int(frac)}"


def read(path):
    return json.load(open(path)) if path.exists() else None


def group_rates(block):
    g = block.get("by_group", {})
    return {k: g.get(k, {}).get("correct") for k in ("rust", "healthy", "other")}


def pick_bracol(m):
    t = m["test"]
    r = group_rates(t)
    sev1 = t.get("rust_sensitivity_by_severity", {}).get("1", {})
    return dict(auc=t["auc"], lo=t["auc_ci95"][0], hi=t["auc_ci95"][1], accuracy=t["accuracy"],
                rust=r["rust"], healthy=r["healthy"], other=r["other"], sev1=sev1.get("sensitivity"), sev1n=sev1.get("n"))


def pick_uganda(u):
    r = group_rates(u)
    return dict(auc=u["auc"], lo=u["auc_ci95"][0], hi=u["auc_ci95"][1], accuracy=u["accuracy"],
                rust=r["rust"], healthy=r["healthy"], other=r["other"])


def mean(rows, k):
    v = [r[k] for r in rows if r.get(k) is not None]
    return round(statistics.mean(v), 4) if v else None


def pack(rows):
    out = {k: mean(rows, k) for k in rows[0] if k not in ("lo", "hi", "sev1n")}
    out["lo"] = round(min(r["lo"] for r in rows), 4)
    out["hi"] = round(max(r["hi"] for r in rows), 4)
    if "sev1n" in rows[0]:
        out["sev1n"] = rows[0]["sev1n"]
    return out


def pct(cell):
    """'85.0% +/- 1.1' -> 0.85, '-' -> None."""
    m = re.match(r"\s*([\d.]+)%", cell)
    return round(float(m.group(1)) / 100, 4) if m else None


def calib_key(label):
    """'Real only, 10% real' -> 'real:10'. The labels are the ones calibrate_field.py writes."""
    label = label.strip()
    if label == "Zero-shot":
        return "zeroshot"
    if label.startswith("Synthetic only"):
        return {"": "syn:0", " (combo)": "syn-combo:0", " (v3)": "syn-v3:0"}.get(label[len("Synthetic only"):])
    m = re.match(r"Real only, (\d+)% real$", label)
    if m:
        return f"real:{m.group(1)}"
    m = re.match(r"Synthetic \+ real(?: \((combo|v3)\))?, (\d+)% real$", label)
    if m:
        return f"mix{'-' + m.group(1) if m.group(1) else ''}:{m.group(2)}"
    return None


def read_calibration():
    """Rows of results/calibration.md: the whole pool, and 100 local photos."""
    local, small = {}, {}
    if not CALIBRATION.exists():
        return local
    section = None
    for line in CALIBRATION.read_text().splitlines():
        if line.startswith("## "):
            section = line[3:].strip()
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if not line.startswith("|") or len(cells) < 5 or cells[0] in ("Arm", "---") or set(cells[0]) <= {"-"}:
            continue
        if section == "With the whole pool":
            k = calib_key(cells[0])
            if k:
                local[k] = dict(bracolCut=pct(cells[1]), localCut=pct(cells[2]), answered=pct(cells[3]), right=pct(cells[4]))
        elif section == "How many local photos are needed" and cells[1] == "100":
            k = calib_key(cells[0])
            if k:
                small[k] = dict(accuracy=pct(cells[2]), answered=pct(cells[3]), right=pct(cells[4]))
    for k, v in small.items():
        if k in local:
            local[k]["local100"] = v["accuracy"]
    return local


def main():
    groups, finished, trained = {}, 0, 0
    for f in sorted(glob.glob(str(RUNS / "*" / "metrics.json"))):
        folder = Path(f).parent
        m = json.load(open(f))
        if m.get("test", {}).get("n", 0) < 100:        # a smoke test on a handful of photos is not a result
            continue
        finished += 1
        trained += (folder / "config.json").exists()
        k = key_of(folder.name)
        u = read(folder / "field_uganda_all.json")
        if not k or not u:
            continue
        groups.setdefault(k, []).append(dict(name=folder.name, bracol=pick_bracol(m), uganda=pick_uganda(u)))

    arms = {}
    for k, runs in sorted(groups.items()):
        arms[k] = dict(runs=len(runs), names=[r["name"] for r in runs],
                       bracol=pack([r["bracol"] for r in runs]), uganda=pack([r["uganda"] for r in runs]))

    demo = read(RUNS / DEMO / "field_calibration.json")
    res = dict(
        counts=dict(finished=finished, trained=trained),
        tests=dict(bracol=261, uganda=1792, ugandaHeldOut=300, ugandaPool=1492, kenya=197),
        arms=arms,
        local=read_calibration(),
        demo=dict(run=DEMO, accuracy=round(demo["on_the_300_test_photos"]["accuracy"], 4), answered=round(demo["on_the_300_test_photos"]["coverage"], 4),
                  right=round(demo["on_the_300_test_photos"]["answered"], 4)) if demo else None,
    )
    OUT.write_text("// Generated by tools/sync_results.py from ../../runs/*, ../../results/calibration.md. Do not edit by hand.\n"
                   "// Scores are means over seeds at image detail 140. bracol: the 261 clean test photos. uganda: all 1,792 farm photos.\n"
                   f"export const RESULTS = {json.dumps(res, indent=2)};\n")
    print(f"{finished} finished runs ({trained} trained), {len(arms)} arms -> {OUT.relative_to(HERE)}")
    for k, a in arms.items():
        print(f"  {k:14} x{a['runs']}  BRACOL AUC {a['bracol']['auc']}  Uganda AUC {a['uganda']['auc']}  acc {a['uganda']['accuracy']}")
    print(f"  local setting for {len(res['local'])} arms; demo {res['demo']}")


if __name__ == "__main__":
    main()
