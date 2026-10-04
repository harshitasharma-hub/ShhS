#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["numpy", "opencv-python-headless"]
# ///
"""Check whether the picture background alone predicts rust, in BRACOL and in a synthetic set.

Takes the median colour (Lab) of a thin frame around each picture, fits a 3 number logistic regression
with 5-fold cross-validation, and reports the AUC. 0.5 means the background says nothing about rust.
On BRACOL train it is about 0.74. Whole-leaf synthetic pictures should be near 0.5.

  uv run scripts/synth/audit_shortcuts.py v1
"""
import csv
import json
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent.parent


def border_lab(path, frac=0.04):
    im = cv2.imread(str(ROOT / path), cv2.IMREAD_COLOR)
    h, w = im.shape[:2]
    b = max(4, int(frac * min(h, w)))
    edge = np.concatenate([im[:b].reshape(-1, 3), im[-b:].reshape(-1, 3), im[:, :b].reshape(-1, 3), im[:, -b:].reshape(-1, 3)])
    lab = cv2.cvtColor(edge.reshape(1, -1, 3).astype(np.float32) / 255.0, cv2.COLOR_BGR2LAB).reshape(-1, 3)
    return np.median(lab, axis=0)


def auc(y, s):
    s = np.asarray(s, float)
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


def cv_auc(X, y, seed=0):
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


def run(rows, label):
    X = np.array([border_lab(r["image"]) for r in rows])
    y = np.array([int(r["rust"]) for r in rows])
    single = {k: round(auc(y, X[:, i]), 3) for i, k in enumerate("Lab")}
    return {"set": label, "n": len(y), "rust": int(y.sum()), "single_channel_auc": single, "cv_logistic_auc": round(cv_auc(X, y), 3)}


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else "v1"
    bracol = [r for r in csv.DictReader(open(ROOT / "data/bracol/manifest.csv")) if r["split"] == "train"]
    syn = [r for r in csv.DictReader(open(ROOT / f"data/synthetic/{version}/manifest.csv")) if r["mode"] == "whole" and r["rust"] in ("0", "1")]
    out = [run(bracol, "BRACOL train photos"), run(syn, f"synthetic {version}, whole-leaf scenes")]
    for o in out:
        print(json.dumps(o))
    (ROOT / f"data/synthetic/{version}/audit_shortcuts.json").write_text(json.dumps(out, indent=1) + "\n")


if __name__ == "__main__":
    main()
