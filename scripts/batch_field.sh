#!/usr/bin/env bash
# Score every finished run that has no field results yet, on the real field photos (Uganda and Kenya).
# One model load covers all of them. Run it on the GPU machine, from the project folder:
#   nohup bash scripts/batch_field.sh > logs/batch_field.log 2>&1 &
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
PY=.venv/bin/python
runs=$(for d in runs/*/; do n=$(basename "$d"); if [ -f "$d/metrics.json" ] && [ ! -f "$d/field_uganda.json" ]; then echo "$n"; fi; done)
echo "scoring on the field photos: $runs"
[ -n "$runs" ] && $PY scripts/score_field.py --run $runs --batch-size 2
echo "field scoring finished"
