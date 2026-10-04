#!/usr/bin/env bash
# Second round of Steps 3 and 4 with the v3 synthetic set, which adds other-disease close-ups with orange or yellow rims
# as hard negatives. Two streams side by side, with the run tag v3 so the results stay apart from the first round.
# Every run also scores the field photos. Needs data/synthetic/v3/manifest.csv and its images on the machine.
# Run it there, from the project folder:
#   nohup bash scripts/batch_v3.sh > logs/batch_v3.log 2>&1 &
# Every run writes runs/<name>/metrics.json, and a run that already has one is skipped.
set -uo pipefail
PY=.venv/bin/python
mkdir -p logs
COMMON="--detail 140 --epochs 3 --synthetic-manifest data/synthetic/v3/manifest.csv --tag v3 --field uganda,kenya"

(
  for seed in 0 1; do
    $PY scripts/train.py --fraction 100 --seed $seed $COMMON
  done
  $PY scripts/train.py --grid --fractions 10 --seeds 0,1,2 $COMMON
) > logs/stream5.log 2>&1 &

(
  for seed in 0 1 2; do
    $PY scripts/train.py --fraction 0 --seed $seed $COMMON
  done
  $PY scripts/train.py --fraction 100 --seed 2 $COMMON
) > logs/stream6.log 2>&1 &

wait
# The full Uganda set, for tighter numbers
runs=$(ls -d runs/*-v3_* 2>/dev/null | xargs -n1 basename)
[ -n "$runs" ] && $PY scripts/score_field.py --run $runs --field uganda --all --batch-size 8
echo "round with v3 finished"
