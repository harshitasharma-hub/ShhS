#!/usr/bin/env bash
# Run the BRACOL training on any GPU machine you can SSH into, such as a rented RunPod or Vast.ai pod.
# Set the machine first, using the values from the pod's Connect tab:
#   export GPU_SSH="root@HOST" GPU_PORT=PORT
# The key defaults to ~/.ssh/shhs-gpu. The remote folder defaults to /workspace/shhs.
#
#   scripts/remote_run.sh push                     copy scripts, labels and photos to the machine
#   scripts/remote_run.sh setup                    install the packages and download the model there
#   scripts/remote_run.sh run "<script and args>"  start a job in the background, for example "scripts/train.py --grid"
#   scripts/remote_run.sh status                   show the end of the log, GPU use and finished runs
#   scripts/remote_run.sh pull                     copy runs/ back here, without the adapters
# Stop or delete the pod in the provider's page when you are done. It bills until you do.
set -euo pipefail

: "${GPU_SSH:?set GPU_SSH, for example root@203.0.113.7}"
GPU_PORT="${GPU_PORT:-22}"
KEY="${GPU_KEY:-$HOME/.ssh/shhs-gpu}"
DIR="${GPU_DIR:-/workspace/shhs}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SSH_OPTS=(-i "$KEY" -p "$GPU_PORT" -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30)

remote() { ssh "${SSH_OPTS[@]}" "$GPU_SSH" "$@"; }

push() {
  until remote true 2>/dev/null; do echo "waiting for SSH..."; sleep 8; done
  remote "mkdir -p $DIR"
  (cd "$ROOT" && tar czf - scripts data requirements-train.txt \
    BRACOL_coffee_leaf_images/dataset.csv BRACOL_coffee_leaf_images/images \
    --exclude='__pycache__' --exclude='data/synthetic' | remote "tar xzf - -C $DIR")
  echo "pushed to $GPU_SSH:$DIR"
}

setup() {
  remote "export DIR=$DIR; bash -s" <<'SH'
set -euo pipefail
cd "$DIR"
nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader
export PATH="$HOME/.local/bin:$PATH"
export UV_TORCH_BACKEND=auto
command -v uv >/dev/null || curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv .venv --python 3.12
uv pip install --python .venv/bin/python -r requirements-train.txt
.venv/bin/python -c "import torch; print('torch', torch.__version__, 'cuda', torch.cuda.is_available(), torch.cuda.get_device_name(0))"
mkdir -p models logs
.venv/bin/hf download google/gemma-4-E2B-it --local-dir models/gemma-4-E2B-it > /dev/null
du -sh models/gemma-4-E2B-it
SH
}

run() {
  local job="${1:?usage: remote_run.sh run \"scripts/train.py --grid --detail 140\"}"
  remote "cd $DIR && mkdir -p logs && nohup .venv/bin/python $job > logs/run_\$(date +%H%M%S).log 2>&1 < /dev/null & echo started"
}

status() {
  remote "cd $DIR && tail -n 12 \"\$(ls -t logs/*.log | head -1)\"; echo; nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total --format=csv,noheader; echo 'finished runs:'; ls runs/*/metrics.json 2>/dev/null | wc -l"
}

pull() {
  mkdir -p "$ROOT/runs"
  remote "cd $DIR && tar czf - --exclude=adapter runs" | tar xzf - -C "$ROOT"
  echo "runs copied to $ROOT/runs"
}

case "${1:-}" in
  push) push ;;
  setup) setup ;;
  run) shift; run "$@" ;;
  status) status ;;
  pull) pull ;;
  *) sed -n '2,15p' "$0" ;;
esac
