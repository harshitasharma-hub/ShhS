#!/usr/bin/env bash
# A last try after v3: the v1 synthetic set plus only the 547 new rimmed other-disease photos from v3 (no new rendering). Was batch_combo.sh.
# Needs data/synthetic/combo_v1_v3rim/manifest.csv, which points at the v1 and v3 image folders. Run it on the GPU machine,
# from the project folder. Pass a or b to start one stream: a is synthetic plus 100 percent real, b is synthetic only.
#   nohup bash scripts/gpu/jobs/renders_combo.sh > logs/renders_combo.log 2>&1 &
# Seeds 0 and 1. Every run also scores the field photos. A run that already has metrics.json is skipped.
set -uo pipefail
PY=.venv/bin/python
mkdir -p logs
COMMON="--detail 140 --epochs 3 --synthetic-manifest data/synthetic/combo_v1_v3rim/manifest.csv --tag combo --field uganda,kenya"
which="${1:-both}"

if [ "$which" != "b" ]; then
  (
    for seed in 0 1; do
      $PY scripts/model/train.py --fraction 100 --seed $seed $COMMON
    done
  ) > logs/stream7.log 2>&1 &
fi

if [ "$which" != "a" ]; then
  (
    for seed in 0 1; do
      $PY scripts/model/train.py --fraction 0 --seed $seed $COMMON
    done
  ) > logs/stream8.log 2>&1 &
fi

wait
echo "combo streams finished"
