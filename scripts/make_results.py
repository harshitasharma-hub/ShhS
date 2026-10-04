#!/usr/bin/env python3
"""Collect every finished run in runs/ into results/summary.csv and results/summary.md.

  python3 scripts/make_results.py
The tables are: real field photos by arm (the main result), data scarcity on clean BRACOL photos, every run, and field results per run.
Arms: zeroshot (no training), real (BRACOL only), syn (synthetic only), mix (synthetic plus BRACOL).
A recipe tag follows a dash, so mix-v3 is the mix arm trained on the v3 synthetic set.
Uses only the standard library, so it runs on any machine.
"""
import csv
import json
import statistics
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RUNS = ROOT / "runs"
OUT = ROOT / "results"
ARMS = ("zeroshot", "real", "syn", "mix")
NAMES = {"zeroshot": "Zero-shot", "real": "Real only", "syn": "Synthetic only", "mix": "Synthetic + real"}
FIELDS = ("uganda", "kenya", "uganda_all")


def family(arm):
    return arm.split("-")[0]


def label(arm):
    tag = arm.split("-", 1)[1] if "-" in arm else ""
    return NAMES[family(arm)] + (f" ({tag})" if tag else "")


def order(r):
    return (ARMS.index(family(r["arm"])), r["arm"], r["detail"] or 0, r["real_percent"] or 0, r["seed"] or 0, r["run"])


def pct(x, digits=1):
    return "-" if x is None else f"{100 * x:.{digits}f}"


def num(x, digits=3):
    return "-" if x is None else f"{x:.{digits}f}"


def sev_34(sev):
    n = sum(sev[k]["n"] for k in ("3", "4") if k in sev)
    return sum(sev[k]["sensitivity"] * sev[k]["n"] for k in ("3", "4") if k in sev) / n if n else None


def load_runs():
    runs = []
    for d in sorted(RUNS.iterdir()):
        f = d / "metrics.json"
        if not f.exists():
            continue
        m = json.loads(f.read_text())
        if "test" not in m:
            continue
        t, arm = m["test"], d.name.split("_")[0]
        if family(arm) not in ARMS:
            continue
        sev, grp = t.get("rust_sensitivity_by_severity", {}), t.get("by_group", {})
        row = {
            "run": d.name, "arm": arm, "detail": m.get("detail"), "real_percent": m.get("fraction"), "seed": m.get("seed"),
            "train_photos": m.get("train_photos"), "synthetic_photos": m.get("synthetic_photos"),
            "train_minutes": m["train_seconds"] / 60 if m.get("train_seconds") else None,
            "auc": t["auc"], "auc_lo": t["auc_ci95"][0], "auc_hi": t["auc_ci95"][1],
            "accuracy": t["accuracy"], "acc_lo": t["accuracy_ci95"][0], "acc_hi": t["accuracy_ci95"][1],
            "sensitivity": t["sensitivity"], "specificity": t["specificity"],
            "sev1": sev.get("1", {}).get("sensitivity"), "sev2": sev.get("2", {}).get("sensitivity"),
            "sev3_4": sev_34(sev),
            "healthy_correct": grp.get("healthy", {}).get("correct"), "other_correct": grp.get("other", {}).get("correct"),
            "not_sure_coverage": m.get("not_sure", {}).get("test", {}).get("coverage"),
            "not_sure_accuracy": m.get("not_sure", {}).get("test", {}).get("accuracy_answered"),
        }
        for name in FIELDS:
            g = d / f"field_{name}.json"
            if g.exists():
                fj = json.loads(g.read_text())
                row[f"{name}_auc"], row[f"{name}_accuracy"] = fj["auc"], fj["accuracy"]
                row[f"{name}_sensitivity"], row[f"{name}_specificity"] = fj["sensitivity"], fj["specificity"]
                for kind in ("rust", "healthy", "other"):
                    row[f"{name}_{kind}_correct"] = fj.get("by_group", {}).get(kind, {}).get("correct")
        runs.append(row)
    return runs


def mean_sd(values):
    values = [v for v in values if v is not None]
    if not values:
        return "-"
    if len(values) == 1:
        return f"{values[0]:.3f} (1 seed)"
    return f"{statistics.mean(values):.3f} +/- {statistics.stdev(values):.3f} ({len(values)} seeds)"


def mean_only(rs, key, scale=1.0, digits=1):
    values = [r[key] * scale for r in rs if r.get(key) is not None]
    return f"{statistics.mean(values):.{digits}f}" if values else "-"


def field_by_arm_table(runs, detail=140):
    by = defaultdict(list)
    for r in runs:
        if r["detail"] == detail and r.get("uganda_all_auc") is not None:
            by[(r["arm"], r["real_percent"] or 0)].append(r)
    if not by:
        return []
    head = ["Arm", "Real %", "Runs", "Uganda AUC", "Accuracy", "Rust caught", "Healthy ok", "Other disease ok", "Kenya AUC"]
    lines = [f"## Real field photos, by arm (detail {detail})", "",
             "Main result. Uganda is the full set of 1,792 unique smartphone photos: 605 rust, 737 healthy, 450 other disease. "
             "These photos were never used in training. The cut-off is the one picked on BRACOL validation photos. "
             "Rust caught, Healthy ok and Other disease ok are the share answered correctly in each kind of photo. "
             "Kenya is 197 small photos with odd colours, a stress test only. Numbers are means over seeds.", "",
             "| " + " | ".join(head) + " |", "|" + "---|" * len(head)]
    for arm, p in sorted(by, key=lambda k: (ARMS.index(family(k[0])), k[0], k[1])):
        rs = by[(arm, p)]
        aucs = [r["uganda_all_auc"] for r in rs]
        auc = f"{statistics.mean(aucs):.3f}" + (f" +/- {statistics.stdev(aucs):.3f}" if len(aucs) > 1 else "")
        lines.append(f"| {label(arm)} | {p} | {len(rs)} | {auc} | {mean_only(rs, 'uganda_all_accuracy', 100)} | "
                     f"{mean_only(rs, 'uganda_all_rust_correct', 100)} | {mean_only(rs, 'uganda_all_healthy_correct', 100)} | "
                     f"{mean_only(rs, 'uganda_all_other_correct', 100)} | {mean_only(rs, 'kenya_auc', 1, 3)} |")
    return lines + [""]


def scarcity_table(runs, detail):
    by = defaultdict(list)
    for r in runs:
        if r["detail"] == detail and family(r["arm"]) in ("real", "syn", "mix"):
            by[(r["arm"], r["real_percent"])].append(r)
    zero = sorted((r for r in runs if r["arm"] == "zeroshot" and r["detail"] == detail), key=lambda r: "cuda" not in r["run"])
    mixes = sorted({a for a, _ in by if family(a) == "mix"})
    head = ["Real %", "Real only"] + [label(a) for a in mixes]
    lines = [f"## Data scarcity on clean BRACOL photos, detail {detail}", "",
             "Test AUC on the 261 BRACOL test photos, mean +/- standard deviation over seeds. "
             "Real % is the share of the 1,225 BRACOL train photos used. The synthetic columns add synthetic photos "
             "made only from the leaves in that real share.", "",
             "| " + " | ".join(head) + " |", "|" + "---|" * len(head)]
    if zero:
        lines.append("| " + " | ".join(["0 (no training)", num(zero[0]["auc"])] + ["-"] * len(mixes)) + " |")
    if any(family(a) == "syn" for a, _ in by):
        cells = [mean_sd([r["auc"] for r in by.get((a.replace("mix", "syn"), 0), [])]) for a in mixes]
        lines.append("| " + " | ".join(["0 (synthetic only)", "-"] + cells) + " |")
    for p in (10, 25, 50, 100):
        real = by.get(("real", p), [])
        cells = [mean_sd([r["auc"] for r in by.get((a, p), [])]) for a in mixes]
        if real or any(c != "-" for c in cells):
            lines.append("| " + " | ".join([str(p), mean_sd([r["auc"] for r in real])] + cells) + " |")
    return lines + [""]


def all_runs_table(runs):
    head = ["Run", "Test AUC (95% interval)", "Accuracy", "Rust caught", "Healthy ok", "Other ok", "Rust sev 1", "Sev 2", "Sev 3-4"]
    lines = ["## Every run on clean BRACOL photos", "",
             "Percentages are on the 261 BRACOL test photos at the threshold picked on the validation photos. "
             "Rust caught is sensitivity. Healthy ok and Other ok are the share of healthy and other-disease photos answered No.", "",
             "| " + " | ".join(head) + " |", "|" + "---|" * len(head)]
    for r in sorted(runs, key=order):
        lines.append(f"| {r['run']} | {num(r['auc'])} ({num(r['auc_lo'])}-{num(r['auc_hi'])}) | {pct(r['accuracy'])} | "
                     f"{pct(r['sensitivity'])} | {pct(r['healthy_correct'])} | {pct(r['other_correct'])} | "
                     f"{pct(r['sev1'])} | {pct(r['sev2'])} | {pct(r['sev3_4'])} |")
    return lines + [""]


def field_table(runs):
    scored = [r for r in runs if any(f"{n}_auc" in r for n in FIELDS)]
    if not scored:
        return []
    lines = ["## Real field photos, every run", "",
             "Uganda is a sample of 300 balanced photos (150 rust). Uganda all is the full set of 1,792 photos. "
             "Kenya is 197 small photos, a stress test only. The threshold is the one picked on BRACOL validation, "
             "so nothing is tuned on these photos.", "",
             "| Run | Uganda AUC | Uganda accuracy | Uganda rust caught | Uganda not-rust ok | Uganda all AUC | Uganda all accuracy | Kenya AUC | Kenya accuracy |",
             "|---|---|---|---|---|---|---|---|---|"]
    for r in sorted(scored, key=order):
        lines.append(f"| {r['run']} | {num(r.get('uganda_auc'))} | {pct(r.get('uganda_accuracy'))} | {pct(r.get('uganda_sensitivity'))} | "
                     f"{pct(r.get('uganda_specificity'))} | {num(r.get('uganda_all_auc'))} | {pct(r.get('uganda_all_accuracy'))} | "
                     f"{num(r.get('kenya_auc'))} | {pct(r.get('kenya_accuracy'))} |")
    return lines + [""]


def main():
    runs = load_runs()
    OUT.mkdir(exist_ok=True)
    columns = list(dict.fromkeys(k for r in runs for k in r))
    with open(OUT / "summary.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=columns)
        w.writeheader()
        w.writerows(runs)
    details = sorted({r["detail"] for r in runs if r["arm"] != "zeroshot"} or {140})
    md = ["# Results summary", "", f"{len(runs)} finished runs. Made by scripts/make_results.py from runs/*/metrics.json.", ""]
    md += field_by_arm_table(runs)
    for d in details:
        md += scarcity_table(runs, d)
    md += all_runs_table(runs) + field_table(runs)
    (OUT / "summary.md").write_text("\n".join(md))
    print(f"{len(runs)} runs -> results/summary.csv and results/summary.md")


if __name__ == "__main__":
    main()
