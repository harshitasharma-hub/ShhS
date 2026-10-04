#!/bin/bash
# Turn a trained adapter into one phone file (.litertlm) that the Google AI Edge Gallery app can import.
#
#   scripts/phone/make_phone_model.sh real_d140_f10_s0
#
# Steps: merge the adapter into the base weights, export to the LiteRT-LM format (8-bit weights, 140 image tokens),
# swap in a chat template the phone runtime can read, set greedy sampling, and pack the file again.
# Work files and the result go to models/phone/<run>/, which git ignores. The result is
# models/phone/<run>/<run>.litertlm, about 5.2 GB.
#
# The export loads the model in float32, about 20 GB, and needs more while it converts. On a 24 GB Mac it used about
# 45 GB of swap and took 21 minutes. A machine with 64 GB or more should take about 10 minutes.
# Needs uv, the base model in models/gemma-4-E2B-it and runs/<run>/adapter. It builds its own Python 3.11
# environment in models/phone/venv, because the exporter fails on Python 3.14.
set -euo pipefail

RUN=${1:?usage: make_phone_model.sh <run name, for example real_d140_f10_s0>}
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
HERE=$ROOT/scripts/phone
WORK=$ROOT/models/phone/$RUN
VENV=$ROOT/models/phone/venv
mkdir -p "$WORK"

if [ ! -x "$VENV/bin/python" ]; then
  uv venv --python 3.11 "$VENV"
  uv pip install --python "$VENV/bin/python" --prerelease=allow litert-torch-nightly litert-lm-api pillow safetensors
fi

echo "1/4 merge the adapter"
"$VENV/bin/python" "$HERE/merge_adapter.py" "$ROOT/runs/$RUN/adapter" "$WORK/merged"

echo "2/4 export, the long step"
rm -rf "$WORK/out"
"$VENV/bin/python" -m litert_torch.generative.export_hf "$WORK/merged" "$WORK/out" \
  --task=image_text_to_text --experimental_lightweight_conversion=True

echo "3/4 swap in the classifier chat template and greedy sampling"
rm -rf "$WORK/unpacked"
"$VENV/bin/litert-lm-builder" unpack --input "$WORK/out/model.litertlm" --output "$WORK/unpacked"
"$VENV/bin/python" "$HERE/patch_metadata.py" "$WORK/unpacked" "$HERE/gemma4_classifier.jinja"

echo "4/4 pack the file"
(cd "$WORK/unpacked" && "$VENV/bin/litert-lm-builder" toml --path model.toml output --path "$WORK/$RUN.litertlm")
ls -la "$WORK/$RUN.litertlm"
echo "Test it: $VENV/bin/python scripts/phone/test_phone_model.py $WORK/$RUN.litertlm $RUN uganda 60"
