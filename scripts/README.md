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
| `phone/` | Turn a trained adapter into one file for a phone, and test that file with the phone runtime | `models/phone/<name>/` |
| `analyze/` | Turn runs into tables and cut-offs, and make the pictures of the main README | `results/`, `runs/<name>/field_calibration.json`, `docs/readme/` |
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
| `render_turntable.py` | Renders one 3D leaf swaying in front of a camera, as transparent frames. It reuses the leaf code of `blender_render.py`. `analyze/make_readme_art.py` calls it for the banner. |
| `write_readme.py` | Writes `data/synthetic/README.md` from the manifests. |

## model/

| Script | What it does |
| --- | --- |
| `rust_common.py` | The code the other scripts share: the prompt, model loading, scoring, the cut-off, the "not sure" margin and the bootstrap. |
| `train.py` | LoRA fine-tune. Writes a run folder. `--grid` runs many fractions and seeds with one model load. |
| `score.py` | Scores BRACOL validation and test with the model as released, or with an adapter. |
| `score_field.py` | Scores the farm photos for runs that are finished. |
| `predict.py` | Answers rust, no rust or not sure for photos you give it. Needs a trained adapter and its `field_calibration.json`. |
| `serve.py` | Serves a one-page web app. A phone on the same Wi-Fi sends a leaf photo and gets rust, no rust or not sure, in Spanish, Portuguese or English. The model stays on this computer, so no internet is needed. It uses the same adapter and cut-off as `predict.py`. |
| `serve_page.html` | The page `serve.py` sends to the phone. It is one file and loads nothing from outside. |
| `time_training.py` | Times a short training run on this machine. |

## phone/

Run these with the Python of the phone environment, `models/phone/venv/bin/python`. `make_phone_model.sh` builds it.

| Script | What it does |
| --- | --- |
| `make_phone_model.sh <run>` | Does the whole job for one run: merge the adapter, export to the LiteRT-LM phone format, fix the chat template, pack one `.litertlm` file of about 5.2 GB. It takes 21 minutes on a 24 GB Mac. |
| `merge_adapter.py` | Adds the adapter to the base weights, one tensor at a time, in float32. |
| `patch_metadata.py` | Replaces the chat template and sets greedy sampling inside an unpacked phone file. |
| `gemma4_classifier.jinja` | The chat template. The phone runtime cannot read the one that ships with Gemma 4. This one writes our exact prompt whenever a message has a photo, whatever text came with it. |
| `test_phone_model.py` | Runs a `.litertlm` file with the phone runtime and compares its answers with the saved PyTorch scores. `--gpu` runs it on the graphics chip, as a phone does. |

## analyze/

| Script | What it does |
| --- | --- |
| `make_results.py` | Collects `runs/*/metrics.json` into `results/summary.md` and `results/summary.csv`. |
| `calibrate_field.py` | Sets the cut-off and the "not sure" margin on local Uganda photos. Writes `results/calibration.md`. |
| `save_calibration.py` | Saves that setting for one run in `runs/<name>/field_calibration.json`. `predict.py` reads it. |
| `make_readme_art.py` | Makes the pictures at the top of the main README: the banner (`docs/readme/hero.gif` and `hero-still.png`) and the results chart (`docs/readme/results.png`). It reads the manifests and `results/summary.csv`, and calls Blender and ffmpeg. |

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
