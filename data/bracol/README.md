# BRACOL data for the rust study

This folder has the labels and the frozen split for the BRACOL coffee leaf photos. The photos stay untouched in `BRACOL_coffee_leaf_images/`.

## Files

- `manifest.csv`: one row per leaf, with the photo path, labels, split and a checksum.
- `splits.json`: the frozen split, plus nested subsets of `train` for the data-scarcity runs.
- `audit.json`: the results of the photo and label checks.

## The label

`rust` is 1 when BRACOL marks rust on the leaf, and 0 for every other leaf. A leaf with rust and another problem is 1. The 0 leaves fall in three groups, shown in the `group` column:

- `healthy`: BRACOL says healthy and no problem is marked. 272 leaves.
- `other`: no rust, but leaf miner, phoma or cercospora is marked. 789 leaves.
- `unclear`: no problem is marked, but BRACOL says undetermined. 2 leaves.

Report results for `healthy` and `other` separately, and by `severity`. BRACOL gives one severity per leaf, even when the leaf has more than one problem.

## Splits

Seed 42, with 70% train, 15% val and 15% test. Leaves are split inside 12 strata (rust or not, severity, and which other problem), so every split has the same mix.

| Split | Leaves | Rust | Healthy | Other | Unclear |
| --- | ---: | ---: | ---: | ---: | ---: |
| train | 1225 | 480 | 190 | 553 | 2 |
| val | 261 | 102 | 41 | 118 | 0 |
| test | 261 | 102 | 41 | 118 | 0 |

Rust leaves by severity:

| Split | 1 | 2 | 3 | 4 |
| --- | ---: | ---: | ---: | ---: |
| train | 295 | 118 | 40 | 27 |
| val | 62 | 26 | 10 | 4 |
| test | 62 | 26 | 5 | 9 |

Severities 3 and 4 share one stratum, so their counts are not matched between `val` and `test`.

Pick checkpoints and thresholds on `val`. Use `test` only to report results. The split is frozen: the script refuses to overwrite it unless you pass `--force`, so use that only before any experiment has run.

## Data-scarcity subsets

`splits.json` lists subsets of `train` at 10%, 25%, 50% and 100%, for seeds 0, 1 and 2. Each subset keeps the mix of `train`, and for one seed each subset sits inside the next larger one. Leaves per subset: 10%: 128, 25%: 312, 50%: 614, 100%: 1225.

## What the checks found

- 1747 photos decoded without errors.
- All photos are 2048x1024 pixels.
- No photo has an EXIF orientation tag that rotates it.
- 2 groups of exact or near copies were found: ids 758 and 759; ids 813 and 1022. Each group stays in one split.
- Some labels disagree with each other. They are kept as given, and the ids are in `audit.json`:
  - Leaves with no problem marked that BRACOL does not call healthy: 2.
- Checked by eye on 2026-10-04, on a random sample of 24 photos: each shows one whole leaf on a plain light background, with some change in tone and light. These are not field photos.

## Rebuild

```bash
uv run scripts/prepare_bracol.py
```

The checksums in `manifest.csv` show whether a photo changed. `dataset.csv` has sha256 `e74bb83e681812c225c9b733720b88134819710c9b8acf213c0b25ea904d4a93`. `splits.json` has sha256 `292a780d57d78ff3d9322593abf52e952c8f68e7e0de3a92c01ea4bc360393b6`.
