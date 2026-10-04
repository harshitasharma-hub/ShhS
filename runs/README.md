# runs

One folder per training or scoring run. The folder name says what the run was.

## Reading a run name

```
<arm>[-<recipe>]_d<detail>_f<real percent>_s<seed>
```

| Part | Meaning |
| --- | --- |
| arm | `zeroshot`: the model as released, no training. `real`: trained on real BRACOL photos only. `syn`: trained on renders only. `mix`: trained on renders plus real photos. |
| recipe | Which render set. No tag means v1 (set 1). `v3` means set 3. `combo` means set 4. |
| `d` | Image detail: the soft-token budget per photo. 70, 140 or 280. |
| `f` | Share of the 1,225 BRACOL train photos used. 0, 10, 25, 50 or 100. |
| `s` | Random seed: 0, 1 or 2. |

Examples:

- `real_d140_f10_s0`: real photos only, detail 140, 10% of the photos (128), seed 0.
- `mix-v3_d140_f100_s1`: renders from set 3 plus all real photos, detail 140, seed 1.
- `syn_d140_f0_s2`: renders only (set 1), detail 140, seed 2.
- `zeroshot_d140`: no training. `zeroshot_d140_cuda` is the same test on the rented GPU.

`scripts/analyze/make_results.py` and `scripts/analyze/calibrate_field.py` group runs by the arm in the name. Keep this scheme for new runs.

## What is in a run folder

| File | What it holds |
| --- | --- |
| `config.json` | The settings: detail, epochs, learning rate, number of photos, render manifest, device and train time |
| `metrics.json` | The scores on BRACOL validation and test, the cut-off picked on validation, and the "not sure" margin |
| `scores_val.csv`, `scores_test.csv` | One score per BRACOL photo |
| `field_uganda.json`, `field_kenya.json` | The scores on the farm photos (Uganda: the 300 test photos) |
| `field_uganda_all.json` | The same for all 1,792 Uganda photos |
| `scores_field_*.csv` | One score per farm photo |
| `train_log.csv` | The loss at each training step |
| `field_calibration.json` | The cut-off and the "not sure" margin set on local Uganda photos. Only some runs have it |
| `adapter/` | The trained LoRA weights. Not in git, because they are large |

A zero-shot run has only `metrics.json` and the score files. It has no `config.json`, no `train_log.csv` and no `adapter/`.

A run that has `metrics.json` is finished. `scripts/model/train.py` skips it on a restart unless you pass `--force`.

The numbers of all runs are in `results/summary.md`.
