#!/usr/bin/env bash
# Run the BRACOL training on one EC2 GPU instance, driven from this Mac with the AWS CLI.
# The instance costs money while it runs. It also stops itself after MAX_HOURS as a safety net.
#
#   scripts/aws_run.sh launch [instance-type]   make the key pair, firewall rule and instance (default g5.2xlarge)
#   scripts/aws_run.sh push                     copy scripts, labels and photos to the instance
#   scripts/aws_run.sh setup                    install the packages and download the model on the instance
#   scripts/aws_run.sh run "<script and args>"  start a job in the background, for example "scripts/train.py --grid"
#   scripts/aws_run.sh status                   show the end of the log, GPU use and finished runs
#   scripts/aws_run.sh pull                     copy runs/ back here, without the adapters
#   scripts/aws_run.sh stop                     stop the instance and keep its disk
#   scripts/aws_run.sh terminate                delete the instance and its disk
set -euo pipefail

REGION=us-east-1
KEY_NAME=shhs-key
KEY_FILE="$HOME/.ssh/shhs-aws.pem"
SG_NAME=shhs-ssh
DISK_GB=200
MAX_HOURS=8
AMI_PARAM=/aws/service/deeplearning/ami/x86_64/oss-nvidia-driver-gpu-pytorch-2.14-ubuntu-26.04/latest/ami-id
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STATE="$ROOT/.aws_state"
SSH_OPTS="-i $KEY_FILE -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30"

aws_() { aws --region "$REGION" "$@"; }
load() { [ -f "$STATE" ] || { echo "No instance yet. Run: scripts/aws_run.sh launch"; exit 1; }; source "$STATE"; }
remote() { ssh $SSH_OPTS "ubuntu@$IP" "$@"; }

launch() {
  local type="${1:-g5.2xlarge}" my_ip sg ami root_dev iid ip
  if [ ! -f "$KEY_FILE" ]; then
    mkdir -p "$(dirname "$KEY_FILE")" && chmod 700 "$(dirname "$KEY_FILE")"
    aws_ ec2 create-key-pair --key-name "$KEY_NAME" --query KeyMaterial --output text > "$KEY_FILE"
    chmod 600 "$KEY_FILE"
  fi
  my_ip="$(curl -s https://checkip.amazonaws.com | tr -d '[:space:]')"
  sg="$(aws_ ec2 describe-security-groups --filters Name=group-name,Values="$SG_NAME" --query 'SecurityGroups[0].GroupId' --output text)"
  if [ "$sg" = "None" ]; then
    sg="$(aws_ ec2 create-security-group --group-name "$SG_NAME" --description "SSH for the ShhS training box" --query GroupId --output text)"
  fi
  aws_ ec2 authorize-security-group-ingress --group-id "$sg" --protocol tcp --port 22 --cidr "$my_ip/32" >/dev/null 2>&1 || true
  ami="$(aws_ ssm get-parameter --name "$AMI_PARAM" --query Parameter.Value --output text)"
  root_dev="$(aws_ ec2 describe-images --image-ids "$ami" --query 'Images[0].RootDeviceName' --output text)"
  iid="$(aws_ ec2 run-instances --image-id "$ami" --instance-type "$type" --key-name "$KEY_NAME" --security-group-ids "$sg" \
    --block-device-mappings "DeviceName=$root_dev,Ebs={VolumeSize=$DISK_GB,VolumeType=gp3,DeleteOnTermination=true}" \
    --instance-initiated-shutdown-behavior stop \
    --user-data "#!/bin/bash
shutdown -h +$((MAX_HOURS * 60))" \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=shhs-train}]' \
    --query 'Instances[0].InstanceId' --output text)"
  aws_ ec2 wait instance-running --instance-ids "$iid"
  ip="$(aws_ ec2 describe-instances --instance-ids "$iid" --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)"
  printf 'IID=%s\nIP=%s\nSG=%s\n' "$iid" "$ip" "$sg" > "$STATE"
  echo "Launched $iid ($type) at $ip. It stops itself in $MAX_HOURS hours."
}

push() {
  load
  until remote true 2>/dev/null; do echo "waiting for SSH..."; sleep 8; done
  (cd "$ROOT" && rsync -azR --info=progress2 -e "ssh $SSH_OPTS" scripts data requirements-train.txt \
    BRACOL_coffee_leaf_images/dataset.csv BRACOL_coffee_leaf_images/images "ubuntu@$IP:shhs/")
}

setup() {
  load
  remote 'bash -s' <<'SH'
set -euo pipefail
cd ~/shhs
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
  load
  local job="${1:?usage: aws_run.sh run \"scripts/train.py --grid --detail 140\"}"
  remote "cd ~/shhs && mkdir -p logs && nohup .venv/bin/python $job > logs/run_\$(date +%H%M%S).log 2>&1 < /dev/null & echo started"
}

status() {
  load
  remote 'cd ~/shhs && tail -n 12 "$(ls -t logs/*.log | head -1)"; echo; nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total --format=csv,noheader; echo "finished runs:"; ls runs/*/metrics.json 2>/dev/null | wc -l'
}

pull() {
  load
  mkdir -p "$ROOT/runs"
  rsync -az --exclude 'adapter/' -e "ssh $SSH_OPTS" "ubuntu@$IP:shhs/runs/" "$ROOT/runs/"
  echo "runs copied to $ROOT/runs"
}

case "${1:-}" in
  launch) shift; launch "$@" ;;
  push) push ;;
  setup) setup ;;
  run) shift; run "$@" ;;
  status) status ;;
  pull) pull ;;
  stop) load; aws_ ec2 stop-instances --instance-ids "$IID" --query 'StoppingInstances[0].CurrentState.Name' --output text ;;
  terminate) load; aws_ ec2 terminate-instances --instance-ids "$IID" --query 'TerminatingInstances[0].CurrentState.Name' --output text; rm -f "$STATE" ;;
  *) sed -n '2,12p' "$0" ;;
esac
