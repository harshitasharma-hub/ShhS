#!/usr/bin/env bash
# Real photos only, on one GPU machine: zero-shot at details 70, 140 and 280, then LoRA on real BRACOL photos. Two streams run side by side.
# Was batch_step1.sh ("Step 1" in checklist/items.json). Run it on the machine, from the project folder:
#   nohup bash scripts/gpu/jobs/real_photos.sh > logs/real_photos.log 2>&1 &
# Every run writes runs/<name>/metrics.json, and a run that already has one is skipped.
set -uo pipefail
PY=.venv/bin/python
mkdir -p logs

(
  $PY scripts/model/train.py --detail 140 --epochs 3 --fraction 100 --seed 0
  $PY scripts/model/train.py --grid --detail 140 --epochs 3 --seeds 0,1
) > logs/stream1.log 2>&1 &

(
  $PY scripts/model/score.py --detail 140 --name zeroshot_d140_cuda
  $PY scripts/model/score.py --detail 70
  $PY scripts/model/score.py --detail 280
  $PY scripts/model/train.py --detail 70 --epochs 3 --fraction 100 --seed 0
  $PY scripts/model/train.py --detail 280 --epochs 3 --fraction 100 --seed 0
  $PY scripts/model/train.py --grid --detail 140 --epochs 3 --seeds 2
) > logs/stream2.log 2>&1 &

wait
echo "step 1 batch finished"
