#!/usr/bin/env bash
# Renders (set v1) on one GPU machine, in two streams side by side. Was batch_step34.sh ("Steps 3 and 4" in checklist/items.json):
#   renders only: fine-tune on synthetic photos only (3 seeds)
#   renders + real: fine-tune on synthetic photos plus 10, 25, 50 and 100 percent of the real BRACOL train photos (3 seeds)
# A synthetic photo only joins a run when its source leaf is in that run's real subset. Every run also scores the field photos.
# Needs data/synthetic/v1/manifest.csv and its images on the machine. Run it there, from the project folder:
#   nohup bash scripts/gpu/jobs/renders_v1.sh > logs/renders_v1.log 2>&1 &
# Pass a or b to start only one stream: a is the mix grid for seeds 0 and 1, b is synthetic only plus the mix grid for seed 2.
# Every run writes runs/<name>/metrics.json, and a run that already has one is skipped.
set -uo pipefail
PY=.venv/bin/python
mkdir -p logs
COMMON="--detail 140 --epochs 3 --synthetic-manifest data/synthetic/v1/manifest.csv --field uganda,kenya"

which="${1:-both}"

if [ "$which" != "b" ]; then
  (
    $PY scripts/model/train.py --grid --fractions 10,25,50,100 --seeds 0,1 $COMMON
  ) > logs/stream3.log 2>&1 &
fi

if [ "$which" != "a" ]; then
  (
    for seed in 0 1 2; do
      $PY scripts/model/train.py --fraction 0 --seed $seed $COMMON
    done
    $PY scripts/model/train.py --grid --fractions 10,25,50,100 --seeds 2 $COMMON
  ) > logs/stream4.log 2>&1 &
fi

wait
echo "steps 3 and 4 finished"
