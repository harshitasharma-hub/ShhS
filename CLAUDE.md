# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A study, not an app. It tests whether Blender-rendered coffee leaves help Gemma 4 E2B-it (fine-tuned with LoRA) find coffee leaf rust, yes or no, on real field photos. The end goal is an offline Android app. It doesn't exist yet. `README.md` has the results, the data statement and the setup steps. Read it first.

## Layout

- `data/`: every dataset. `bracol/` has the real train, validation and test photos (the raw download is in `bracol/raw/`), `field/` has the real farm photos (test only) and `synthetic/` has the renders.
- `scripts/`: one folder per job: `prepare/`, `synth/`, `model/`, `analyze/` and `gpu/`. `scripts/README.md` lists every script.
- `runs/`: one folder per run. `runs/README.md` explains the names.
- `results/`: tables built from `runs/`, and `figures/`.
- `presentation/talk/` and `presentation/site/` are the two web pages. `docs/` holds the brief and the paper. `submission/` holds what we hand in. `checklist/` holds the plan.
- A script in one of the `scripts/` folders finds the repo root with `Path(__file__).resolve().parent.parent.parent`.

## Commands

Run everything from the repo root. Files that start with `#!/usr/bin/env -S uv run --script` carry their own dependencies, so run them with `uv run`. The training and scoring scripts use the venv.

```bash
# setup
uv venv .venv --python 3.12      # the Mac venv uses 3.13, both work
uv pip install --python .venv/bin/python -r requirements-train.txt   # on CUDA, export UV_TORCH_BACKEND=auto first
.venv/bin/hf download google/gemma-4-E2B-it --local-dir models/gemma-4-E2B-it

# runs (each writes runs/<name>/ with config.json, scores_*.csv, metrics.json, field_*.json)
.venv/bin/python scripts/model/score.py --detail 140                    # zero-shot. Add --adapter runs/<name>/adapter for a trained run
.venv/bin/python scripts/model/train.py --detail 140 --epochs 3         # LoRA on all real photos
.venv/bin/python scripts/model/train.py --fraction 0 --synthetic-manifest data/synthetic/v1/manifest.csv --field uganda,kenya   # renders only. Use --fraction 10|25|50|100 for renders + real
.venv/bin/python scripts/model/train.py --grid --fractions 10,25,50,100 --seeds 0,1,2
# --tag v3 names a new synthetic recipe in the run name (mix-v3_d140_...). --synthetic-manifest takes several CSVs, comma separated.
.venv/bin/python scripts/model/score_field.py --run <name> [<name> ...]  # field photos for finished runs, one model load
.venv/bin/python scripts/model/score_field.py --run <name> --field uganda --all   # all 1,792 Uganda photos -> scores_field_uganda_all.csv
python3 scripts/analyze/calibrate_field.py                                 # reads those files -> results/calibration.md
python3 scripts/analyze/make_results.py                                    # runs/*/metrics.json -> results/summary.md and .csv

# data
uv run scripts/prepare/prepare_bracol.py        # labels and frozen split -> data/bracol/
uv run scripts/prepare/prepare_field.py uganda  # or kenya. Downloads, then writes data/field/<set>/
uv run scripts/synth/generate.py v1     # or v2, unusable. --dry-run shows the plan. Needs Blender 5.2 in /Applications

# rented GPU: set GPU_SSH and GPU_PORT from the provider's Connect tab first
scripts/gpu/remote_run.sh push | setup | run "scripts/model/train.py --grid" | status | pull
# scripts/gpu/jobs/*.sh run on the GPU box itself, under nohup

# the talk
cd presentation/talk && npm install && npm run build   # writes dist/app.js and shhs-talk.html
python3 tools/sync_results.py                      # copies scores from runs/ into src/results.js. Build again after it

# the site
cd presentation/site && npm install && npm run build   # writes js/app.js
cd presentation/site && npm run check                   # tests every claim in the page against runs/

# progress page
python3 checklist/server.py                        # http://localhost:8765
```

There is no test suite and no linter. To check a change, run a tiny job and delete its folder, because `presentation/talk/tools/sync_results.py` reads every `runs/*/metrics.json`:

```bash
.venv/bin/python scripts/model/train.py --name smoke --epochs 1 --limit-train 16 --limit-eval 16
rm -r runs/smoke
```

## How the pieces connect

- `data/bracol/raw/` (Git LFS, raw, never edited) feeds `scripts/prepare/prepare_bracol.py`. That writes `data/bracol/manifest.csv` and `splits.json`, and every training and scoring script reads them.
- A manifest row has the BRACOL labels plus `rust` (the yes or no label), `group` (`rust`, `healthy`, `other` or `unclear`), `severity`, `split`, `image` and a sha256. The synthetic manifests add `source_id` (the BRACOL leaf a render came from), `mode`, `preset`, `bad` and `expect_unsure`. The field manifests add `in_eval`, and scoring uses only the rows with `in_eval` 1 unless you pass `--all`.
- `scripts/model/rust_common.py` holds everything shared: the prompt, model loading, encoding, scoring (logit "Yes" minus logit "No"), the F1 cut-off, the "not sure" margin and the bootstrap. `train.py`, `score.py` and `score_field.py` are thin drivers on top of it.
- `train.py` trains a LoRA adapter, scores BRACOL val and test, then scores the field sets at the cut-off it picked on val. `score_field.py` does that last step later for runs that are already finished.
- A run is a folder `runs/<arm>_d<detail>_f<fraction>_s<seed>/`, where arm is `zeroshot`, `real`, `syn` or `mix`, plus `-<tag>` for a tagged synthetic recipe (`mix-v3`). A run with `metrics.json` is skipped on restart unless you pass `--force`. `make_results.py` and `calibrate_field.py` group runs by the arm in the folder name, so keep that scheme.
- These files are generated, so edit the generator and not the file: `data/bracol/*` (`prepare_bracol.py`), `data/synthetic/README.md` (`synth/write_readme.py`), `data/field/*/README.md` (`prepare_field.py`), `results/summary.*` (`make_results.py`), `results/calibration.md` (`calibrate_field.py`), and in `presentation/talk/` the files `src/results.js`, `src/assets/`, `dist/` and `shhs-talk.html`.

## Rules that keep the results valid

- The label is rust yes or no. A leaf with rust and another problem is yes. Report `healthy` and `other` leaves separately, and rust by severity.
- The BRACOL split is frozen (seed 42). Pick cut-offs on val and use test only to report. Don't pass `--force` to `prepare_bracol.py` once a run exists.
- Never train on field photos in `data/field/`, and never render from them. The 300 Uganda photos with `in_eval` 1 are the held-out test, so pick nothing on them. Only `scripts/analyze/calibrate_field.py` may set a cut-off or a "not sure" margin on field photos, and it uses the other Uganda photos (the pool).
- Renders come only from train leaves. In a run with `--fraction` below 100, a render joins only if its `source_id` is in the real subset. A render has the label of its source leaf. Never train on `data/synthetic/unusable/`, whose `rust` column is blank on purpose.
- Call the renders synthetic scenes built from real BRACOL textures. They aren't free of real data.
- Changing `PROMPT`, the "Yes" and "No" answer tokens, or the score in `rust_common.py` breaks comparison with every existing run. Re-run what you compare.
- BRACOL's background colour predicts rust (AUC 0.74), so BRACOL test flatters a model that uses it. The field sets are the main test for the renders. Lead with AUC there, because the BRACOL-val cut-off comes from clean photos.

## Gotchas

- `models/gemma-4-E2B-it/` is git-ignored and 10 GB. It needs transformers 5.5 or newer (the pin is 5.18). Load it with `AutoProcessor` and `AutoModelForMultimodalLM`, put the image before the text, and set the image detail with `processor.image_processor.max_soft_tokens`.
- On a rented container the CPU quota is far below the visible core count. `limit_threads()` in `rust_common.py` caps the torch threads from the cgroup quota. Keep it, or the container stalls.
- Renders use Blender's EEVEE engine. Cycles on Metal took 11 to 18 s per image against 2 to 3 s, and it drew water drops as black balls.

## Cost and safety

- Training ran on one rented RunPod L40S at $1.10 per hour. Never stop, delete or recreate a pod yourself, because a stop can wipe its disk. The user does that in the provider's console. Never confirm a payment or save a card.
- `scripts/gpu/aws_run.sh launch` makes an instance, a key pair and a firewall rule, and it costs money. It has never been run. Ask first.
- Don't read `~/.aws/credentials`. Don't write SSH hosts, ports, keys or tokens into files in this repo.

## Conventions

- Write docs, comments and commit messages in plain English, with the plain hyphen as the only dash.
- `checklist/items.json` is the plan. When a step finishes, set `done` to true and `doneAt` to today's date (YYYY-MM-DD). Add new steps as `{id, text, done: false}`, in the real order of the work.
