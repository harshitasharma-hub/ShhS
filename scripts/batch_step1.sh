#!/usr/bin/env bash
# Step 1 of the study on one GPU machine: real BRACOL photos only. It runs two streams side by side.
# Run it on the machine, from the project folder:
#   nohup bash scripts/batch_step1.sh > logs/batch_step1.log 2>&1 &
# Every run writes runs/<name>/metrics.json, and a run that already has one is skipped.
set -uo pipefail
PY=.venv/bin/python
mkdir -p logs

(
  $PY scripts/train.py --detail 140 --epochs 3 --fraction 100 --seed 0
  $PY scripts/train.py --grid --detail 140 --epochs 3 --seeds 0,1
) > logs/stream1.log 2>&1 &

(
  $PY scripts/score.py --detail 140 --name zeroshot_d140_cuda
  $PY scripts/score.py --detail 70
  $PY scripts/score.py --detail 280
  $PY scripts/train.py --detail 70 --epochs 3 --fraction 100 --seed 0
  $PY scripts/train.py --detail 280 --epochs 3 --fraction 100 --seed 0
  $PY scripts/train.py --grid --detail 140 --epochs 3 --seeds 2
) > logs/stream2.log 2>&1 &

wait
echo "step 1 batch finished"
