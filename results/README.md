# results

Tables and pictures built from `runs/`. Do not edit the tables by hand. Run the script again instead.

| File | What it is | Made by |
| --- | --- | --- |
| `summary.md`, `summary.csv` | Every finished run: BRACOL scores, farm photo scores, and tables by arm | `scripts/analyze/make_results.py` |
| `calibration.md` | The cut-off and the "not sure" margin set on local Uganda photos, and how many local photos are enough | `scripts/analyze/calibrate_field.py` |
| `timing_bf16.json`, `timing_bf16_nockpt.json` | Seconds per photo for training and scoring on a Mac, with and without gradient checkpointing | `scripts/model/time_training.py` |
| `figures/` | Contact sheets we made while we checked the data and the mistakes | No script in the repo |

## figures

| File | What it shows |
| --- | --- |
| `kenya_photos.jpg` | Kenya test photos, enlarged from 128 pixels. Is the rust visible? |
| `three_photo_styles.jpg` | The same question in three photo styles: clean BRACOL, rendered v1, and real Uganda |
| `uganda_disagreements.jpg` | Uganda photos where the model trained on renders plus real photos and the real-only model disagree |
| `v3_samples.jpg` | Random photos from set 3 |
