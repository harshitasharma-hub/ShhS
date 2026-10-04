# scripts

All the code of the study. Run every command from the repo root.

A file that starts with `#!/usr/bin/env -S uv run --script` carries its own packages, so run it with `uv run`. The training and scoring scripts use the venv: `.venv/bin/python`.

## One folder per job

The folders follow the order you use them.

| Folder | Job | It writes |
| --- | --- | --- |
| `prepare/` | Turn the downloads into labelled data | `data/bracol/`, `data/field/` |
| `synth/` | Cut leaves out of BRACOL photos and render them in Blender | `data/synthetic/` |
| `model/` | Train Gemma 4 E2B, score it, and ask it about one photo | `runs/<name>/` |
| `analyze/` | Turn runs into tables and cut-offs | `results/`, `runs/<name>/field_calibration.json` |
| `gpu/` | Run the jobs on a rented GPU | the same files, on the other machine |

## prepare/

| Script | What it does |
| --- | --- |
| `prepare_bracol.py` | Checks every BRACOL photo. Writes the labels, the frozen split and the audit to `data/bracol/`. It refuses to overwrite a split that exists. |
| `prepare_field.py uganda` (or `kenya`) | Downloads one farm photo set. Writes `data/field/<set>/`. |

## synth/

The Blender pipeline. `data/synthetic/README.md` explains each step. The scripts run in this order.

| Script | What it does |
| --- | --- |
| `extract_textures.py` | Cuts each BRACOL train leaf out of its photo. Writes `data/synthetic/textures/`. |
| `find_lesions.py` | Finds the rust spots and the brown patches on each cut-out, so close-ups can aim at them. |
| `generate.py` | Plans, renders and finishes a set (`v1`, `v2` or `unusable`). It calls `blender_render.py` and `phone_effects.py`. |
| `add_rims.py` | Paints yellow or orange rims around the brown lesions of leaves that have no rust. |
| `generate_v3.py` | Makes set 3. It copies the healthy and rust photos of v1 and renders new photos of the rimmed leaves. |
| `make_combo.py` | Makes set 4: all of v1 plus the new photos of v3. It writes only a manifest. |
| `audit_shortcuts.py` | Checks if the photo background alone predicts rust. |
| `make_sheet.py` | Makes a contact sheet from a manifest, to look at by eye. |
| `write_readme.py` | Writes `data/synthetic/README.md` from the manifests. |

## model/

| Script | What it does |
| --- | --- |
| `rust_common.py` | The code the other scripts share: the prompt, model loading, scoring, the cut-off, the "not sure" margin and the bootstrap. |
| `train.py` | LoRA fine-tune. Writes a run folder. `--grid` runs many fractions and seeds with one model load. |
| `score.py` | Scores BRACOL validation and test with the model as released, or with an adapter. |
| `score_field.py` | Scores the farm photos for runs that are finished. |
| `predict.py` | Answers rust, no rust or not sure for photos you give it. Needs a trained adapter and its `field_calibration.json`. |
| `time_training.py` | Times a short training run on this machine. |

## analyze/

| Script | What it does |
| --- | --- |
| `make_results.py` | Collects `runs/*/metrics.json` into `results/summary.md` and `results/summary.csv`. |
| `calibrate_field.py` | Sets the cut-off and the "not sure" margin on local Uganda photos. Writes `results/calibration.md`. |
| `save_calibration.py` | Saves that setting for one run in `runs/<name>/field_calibration.json`. `predict.py` reads it. |

## gpu/

| File | What it does |
| --- | --- |
| `remote_run.sh` | Copies the project to any GPU machine you can reach over SSH, starts a job there and copies the results back. |
| `aws_run.sh` | The same for one EC2 instance. It makes an instance, so it costs money. We have never run it. |
| `jobs/` | The exact job lists we ran on the rented GPU. |

The files in `jobs/` run on the GPU machine, under `nohup`.

| Job list | What it ran |
| --- | --- |
| `real_photos.sh` | Zero-shot at details 70, 140 and 280, and LoRA on real photos only |
| `renders_v1.sh` | Renders only, and renders + real photos, with set 1 |
| `renders_v3.sh` | The same with set 3 |
| `renders_combo.sh` | The same with set 4 |
| `score_field_missing.sh` | Scores the farm photos for every run that has no field result yet |

## Where to put a new script

Put it in the folder of its job. A script in one of these folders finds the repo root with `Path(__file__).resolve().parent.parent.parent`.
