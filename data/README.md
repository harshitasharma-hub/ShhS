# data

Every photo and label of the study is in this folder. There are three kinds of data, one folder each.

| Folder | What it holds | What it is for |
| --- | --- | --- |
| `bracol/` | 1,747 real leaf photos (BRACOL), their labels and one frozen train, validation and test split | Training, picking the cut-off, and a clean test |
| `field/` | Real phone photos from farms in Uganda and Kenya | Testing only. Never used to train or to make renders |
| `synthetic/` | Leaves we render in Blender from BRACOL train photos | Training only |

Each folder has its own README with the source, the license and what the data does not cover.

## How the folders connect

1. `bracol/raw/` is the download, untouched. `scripts/prepare/prepare_bracol.py` reads it and writes `bracol/manifest.csv` and `bracol/splits.json`.
2. `scripts/synth/` cuts leaves out of the BRACOL train photos and renders them. The renders go to `synthetic/`.
3. `scripts/prepare/prepare_field.py` downloads the farm photos and writes `field/`.
4. `scripts/model/` reads the manifests. It trains on `bracol/` and `synthetic/`, and it tests on `bracol/` and `field/`.

## What is in each folder

```
bracol/
  raw/               the BRACOL photos and dataset.csv, as downloaded (Git LFS)
  manifest.csv       one row per leaf: photo path, labels, split, checksum
  splits.json        the frozen split (seed 42), plus the nested subsets for the 10, 25 and 50% runs
  audit.json         the results of the photo and label checks
field/
  uganda/            1,792 photos. 300 of them (in_eval = 1) are the held-out test
  kenya/             197 small photos. A stress test only
synthetic/
  v1/                set 1: 1,353 renders from the first recipe
  v2/                set 2: 1,353 more, same recipe, new random seeds. Not used in training
  v3/                set 3: v1 with 547 new other-disease photos that have a painted rim
  combo_v1_v3rim/    set 4: all of v1 plus those 547 photos. It holds only a manifest
  unusable/          150 bad photos for the "not sure" test. Never train on them
  textures/          the leaf cut-outs the renders are made from (rebuilt, not in git)
  textures_rim/      the cut-outs with the painted rims, made for v3
  previews/          contact sheets to look at by eye
```

"Set 1" to "set 4" are the names used in the talk and on the site. Run names use a tag instead. No tag means v1, `v3` means v3, and `combo` means set 4. `runs/README.md` explains run names.

`v1/`, `v2/`, `v3/` and `unusable/` each have `images/`, `meta/` (the render settings of each photo) and `manifest.csv`. Their `raw/` folder holds the renders before the phone effects. It is not in git.

## Rules

- The label is rust yes or no. A leaf with rust and another problem counts as yes.
- Never train on `field/`. Never render from it. The 300 `in_eval` Uganda photos are never used to pick anything.
- A render comes only from a BRACOL train leaf. It keeps the label of that leaf.
- The renders are synthetic scenes built from real BRACOL textures. They are not free of real data.

## Manifests

Every manifest starts with the same columns: `id`, `image`, `source`, `split`, `group`, `rust` and more. `image` is a path from the repo root, so a script opens a photo with `ROOT / row["image"]`.

## What is not in git

Big or rebuildable files stay out of git. These are `synthetic/textures/`, every `raw/` folder under `synthetic/` and `field/`, the Uganda zip, and the trained adapters in `runs/`. The setup steps in the main README fetch or rebuild what you need. Early test renders in `synthetic/probe*/`, if you have them, are scratch work and part of no experiment.
