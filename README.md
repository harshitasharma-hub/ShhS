# ShhS

ShhS answers one question from a phone photo of a coffee leaf: does it have rust? We fine-tune a small vision-language model, Gemma 4 E2B, to say yes or no. Then we test it on real farm photos.

We built it for the Hack-Nation x World Bank "Small AI for development" hackathon, challenge 04b (agriculture). Team ShhS.

What we found:

- Leaves we render in Blender do about as well as the real photos they come from. On clean BRACOL photos the AUC is 0.977 for renders only and 0.978 for real photos. On 1,792 real Uganda phone photos it is 0.937 and 0.946.
- Adding renders to the real photos doesn't help on real farm photos. On Uganda, AUC falls from 0.946 to 0.931, and the model raises more false alarms on phoma leaves.
- A cut-off set on local Uganda photos lifts the untrained model's accuracy there by 5 points, and about 100 local photos are almost as good as 1,492. Set this way, the "not sure" rule works on farm photos.

## Where things stand

This repo holds a finished study and a talk. It doesn't hold a phone app yet.

What exists:

- BRACOL, a public set of 1,747 coffee leaf photos, with labels and one frozen train, validation and test split.
- A Blender pipeline that turns BRACOL train photos into field-like renders. It made two sets of 1,353 photos, plus 150 bad photos for the "not sure" test.
- 33 finished runs: the model as it comes, and LoRA fine-tunes on real photos, on renders only and on both. We score each run on BRACOL test photos and on real farm photos from Uganda and Kenya.
- A talk in one HTML file, `presentation/shhs-talk.html`. It runs offline in any browser.

The brief sets five rules.

| Rule in the brief | Where we stand |
| --- | --- |
| Runs on a phone the user already has | Not built. Gemma 4 E2B has a ready on-device build (LiteRT-LM, 2.6 GB). We haven't exported our fine-tuned model or run it on a phone. |
| The core feature works offline | Scoring needs no network, only the model file. We ran it on a Mac and on a rented GPU, not on a phone. |
| The model file is small enough to side-load | It is 2.6 GB. That can be side-loaded, but it is big. For scale, Wadhwani AI's cotton pest app runs an 11.2M-parameter detector on the phone, with an app size budget of about 50 MB (arXiv:2402.00015). |
| One interaction in a named local language | Not built. The talk shows a phone sketch with Swahili lines. A native speaker hasn't checked them. |
| The tool says "not sure" instead of guessing | Partly. Set on BRACOL photos, the rule rarely fires for the fine-tuned models. Set on local Uganda photos, it answers 24 to 76% of test photos at 93 to 97% accuracy. We haven't scored the 150 bad photos yet. See [the "not sure" rule](#the-not-sure-rule). |

The brief also scores the data statement. It is in [Data](#data).

## The question

Noor, the farmer in the brief, grows coffee, maize and beans on 2 hectares. Her yields dropped and she can't say why. One possible cause is coffee leaf rust, a fungus that shows as yellow-orange spots on the leaf.

The brief notes that public crop disease sets are studio photos, and that models trained on them do badly on field photos. Mohanty, Hughes and Salathe (2016) measured the gap: 99.35% on held-out photos, and 31.4% on photos taken under other conditions.

So we ask one question. If we render leaves in field-like scenes, does a small model get better at finding rust on real phone photos?

![Rows from top to bottom: real Uganda rust photos, rendered rust close-ups, real Uganda healthy photos, rendered close-ups of leaves without rust](data/synthetic/compare_real_vs_synthetic.jpg)

Rows from top to bottom: real Uganda rust photos, our rendered rust close-ups, real Uganda healthy photos, and our rendered close-ups of leaves without rust. "No rust" includes leaves with other damage, such as brown patches.

## How we tested it

Four arms:

| Arm | What the model saw in training |
| --- | --- |
| Zero-shot | Nothing. Gemma 4 E2B-it as released. |
| Real | 10, 25, 50 or 100% of the 1,225 BRACOL train photos. |
| Renders | 1,353 Blender renders (set v1), and no real photo. |
| Renders + real | The real photos above, plus the renders made from those same leaves. |

Every trained cell ran with 3 seeds. The full grid uses an image detail of 140, which is the model's soft-token budget per photo. Detail 70 and 280 ran once each, on all the real photos.

The model sees the photo and this prompt: "Look at this coffee leaf. Does it show coffee leaf rust, which looks like yellow or orange spots? Answer with one word: Yes or No." The score is the logit for "Yes" minus the logit for "No". A higher score means more likely rust.

We train a LoRA adapter (rank 16, about 24 million trainable parameters) on the attention and MLP layers of the language model. It runs 3 epochs at learning rate 1e-4, with 16 photos per update, in bf16. Only the answer token carries a loss. A render gets the label of the BRACOL leaf it was made from.

We report AUC first, because it doesn't depend on a cut-off. We also report accuracy and the share of rust caught. In the main tables the cut-off is the one with the best F1 on the BRACOL validation photos, used unchanged on every test set, so nothing is tuned on the field photos. A later section sets it on local photos instead. Intervals are 95% bootstrap intervals (1,000 resamples).

Three test sets:

| Test set | Photos | What it tells us |
| --- | --- | --- |
| BRACOL test | 261 (102 rust) | Clean photos with the same look as training. It shows whether a model does harm there. |
| Uganda | 1,792 (605 rust, 737 healthy, 450 phoma) | Real smartphone photos from farms. This is our main test of whether renders help in the field. |
| Kenya | 197 (84 rust) | Small 128 px photos with shifted colours. A stress test only. |

## Results

Detail 140. Each row is the mean of 3 seeds, except zero-shot, which is one run. Accuracy, "rust caught" and "phoma right" use the cut-off from BRACOL validation. "Phoma right" is the share of the 450 Uganda phoma photos answered "no rust".

| Model | BRACOL AUC | BRACOL accuracy | Uganda AUC | Uganda accuracy | Uganda rust caught | Uganda phoma right |
| --- | --- | --- | --- | --- | --- | --- |
| Zero-shot | 0.928 | 86.6% | 0.946 | 85.2% | 61.8% | 92.7% |
| Real, all 1,225 photos | 0.978 | 92.8% | 0.946 | 88.2% | 84.6% | 76.5% |
| Renders only | 0.977 | 92.5% | 0.937 | 85.7% | 89.4% | 62.9% |
| Renders + all real photos | 0.984 | 93.9% | 0.931 | 81.7% | 93.5% | 46.8% |
| Real, 10% (128 photos) | 0.964 | 89.7% | 0.958 | 88.6% | 90.2% | 70.1% |
| Renders + 10% real | 0.966 | 91.3% | 0.953 | 86.7% | 92.1% | 63.0% |

AUC by share of real photos used, mean of 3 seeds:

| Real photos | BRACOL, real only | BRACOL, with renders | Uganda, real only | Uganda, with renders |
| --- | --- | --- | --- | --- |
| 128 (10%) | 0.964 | 0.966 | 0.958 | 0.953 |
| 312 (25%) | 0.969 | 0.972 | 0.952 | 0.937 |
| 614 (50%) | 0.971 | 0.977 | 0.947 | 0.938 |
| 1,225 (100%) | 0.978 | 0.984 | 0.946 | 0.931 |

### What the numbers say

1. On BRACOL, fine-tuning helps a lot. AUC goes from 0.928 to 0.978. Renders alone reach 0.977, so a model that never saw a real photo matches one that saw 1,225. The renders still come from BRACOL train leaves, so that model has seen BRACOL textures.
2. On BRACOL, adding renders to real photos raises AUC by 0.002 to 0.006 at every data size. One run's 95% interval is about 0.04 wide, so we don't call this a win. Renders do help the mildest rust: the share of severity 1 rust caught rises from 84% to 90% (62 test photos).
3. On Uganda, renders alone score 0.937, close to the 0.946 of all the real photos. Adding renders to real photos lowers AUC at every data size, by 0.005 to 0.015. One run's 95% interval on these 1,792 photos is about 0.02 wide. We haven't tested the gaps for significance.
4. The untrained model already ranks Uganda photos well (AUC 0.946). A small real subset does a little better (0.958 at 10%). With all the real photos it falls back to 0.946.
5. Renders push the model toward "rust". With all the real photos, adding renders takes the share of Uganda rust caught from 84.6% to 93.5%. The share of phoma photos answered correctly falls from 76.5% to 46.8%, and accuracy falls from 88.2% to 81.7%.
6. At the BRACOL cut-off, the untrained model catches only 62% of Uganda rust. The next section sets the cut-off on local photos instead, and that lifts its accuracy by 5 points.
7. Kenya AUC is weak for every model. The arm means run from 0.42 to 0.68. The photos are 128 px with shifted colours, so we read nothing into the order.
8. The cheapest image detail did as well on BRACOL. AUC is 0.986 at detail 70, 0.978 at 140 and 0.985 at 280 (one seed each at 70 and 280). That matters for a phone.

Every number comes from `runs/*/metrics.json` and `runs/*/field_*.json`. The full tables, with every run, are in [results/summary.md](results/summary.md).

## Setting the cut-off on local photos

The BRACOL cut-off doesn't fit farm photos well. So we tried setting the cut-off, and the "not sure" margin, on local photos instead. We hold out 300 Uganda photos (150 rust, 150 not) as the test. The other 1,492 Uganda photos form the local pool. We would leave out any pool photo with a near copy in the test sample, and there were none. The cut-off is the one with the best balanced accuracy on the pool. The margin is the smallest one that lets the answered photos reach 95% balanced accuracy on the pool. Nothing trains on the pool.

| Model | Accuracy, BRACOL cut-off | Accuracy, local cut-off | "Not sure": share answered | Right when it answers |
| --- | --- | --- | --- | --- |
| Zero-shot | 81.0% | 86.0% | 72.0% | 95.6% |
| Real, 10% | 89.3% | 89.6% | 76.0% | 96.6% |
| Real, all photos | 87.8% | 88.3% | 23.6% | 94.7% |
| Renders only | 86.9% | 86.9% | 57.2% | 93.4% |
| Renders + 10% real | 87.8% | 89.4% | 75.9% | 95.7% |
| Renders + all real photos | 85.8% | 85.8% | 43.4% | 94.8% |

A local cut-off lifts the untrained model by 5 points and the fine-tuned ones by 0 to 1.6 points. We also drew smaller pools. With 100 local photos instead of 1,492, accuracy falls by about 1 point: zero-shot 85.0% instead of 86.0%, 10% real 89.0% instead of 89.6%, all real 87.1% instead of 88.3%. So about 100 labelled local photos get most of the benefit. The pool and the test come from the same Uganda set, so this shows what local calibration can do. It doesn't show how the model travels to a new region. The full tables are in [results/calibration.md](results/calibration.md).

## The "not sure" rule

The brief wants a tool that says "not sure, ask a person" instead of guessing. Our rule: if the score is within a margin of the cut-off, the answer is "not sure". We pick the smallest margin that lets the answered photos reach 95% accuracy.

- Set on BRACOL validation photos, the untrained model answers 57 to 78% of the BRACOL test photos, at 93 to 95% accuracy. The fine-tuned models already reach 95% on validation (96.2% on average), so the rule picks a margin of zero and they never say "not sure". On test, the same runs score 92.8%. This holds for 23 of the 29 fine-tuned runs.
- Set on the local Uganda pool (previous section), the rule works. The untrained model answers 72% of the test photos and is right on 95.6% of those. The model trained on 10% of the real photos answers 76% at 96.6%. The model trained on all real photos is more cautious: it answers 24% at 94.7%.
- We rendered 150 photos that no model should judge: no leaf, a tiny leaf, out of focus, glare, and too dark, 30 of each (`data/synthetic/unusable/`). No run has scored them yet. We don't know how often each kind of bad photo gets "not sure".

Wadhwani AI uses a similar idea: the phone model answers, and a photo it is unsure about goes to a larger cloud model and then to a human expert (Agrawal, Papanai and White, arXiv:2402.00015).

## Data

| Dataset | Source and license | Size | What it does not cover |
| --- | --- | --- | --- |
| BRACOL leaf photos | Krohling, Esgario and Ventura, Mendeley Data, doi 10.17632/yy2k5y8mxg.1. CC BY 4.0. We use a complete copy on Hugging Face (luisangelico/bracol, revision 66178a0), because the Mendeley zip is cut off. | 1,747 photos at 2048x1024, about 210 MB. Split: 1,225 train, 261 validation, 261 test. 684 have rust. | Field conditions. Each photo shows one whole leaf on a plain light background (we checked 24 photos by eye, not all). One severity per leaf. Rust severity 3 and 4 come from 67 train leaves. |
| Our renders | Made by us from BRACOL train leaves with `scripts/synth/` in Blender. Adapted from BRACOL, so BRACOL's credit applies. | v1 and v2: 1,353 photos each (v1 has 610 rust), about 33 MB each. `unusable`: 150 photos. Only v1 was used in training. | Real plants. A leaf is a bent sheet, background leaves float, and there are no berries, insects or hands. Rust looks as it does on the 480 train leaves with rust. Real phone lenses and phone processing. |
| Uganda smartphone photos | Chelangat, Anirwoth, Mayanja and Sserwadda (2025), Mendeley Data, doi 10.17632/k36wnd6knb.1. CC BY 4.0. | 1,792 unique photos kept from 3,322 files (zip 26 MB), 256x256. 300 balanced photos (150 rust) are held out as the calibration test. The other 1,492 form the local pool. | Other regions, whole plants, severity labels. The photos are close-ups, often blurred, and some labels look doubtful. Flipped and rotated copies added by the authors may remain. |
| Kenya JMuBEN sample | JMuBEN and JMuBEN2, Mutira plantation, Kirinyaga County. Mendeley Data, doi 10.17632/tgv3zb82nd.1 and 10.17632/t2r6rszp5c.1. CC BY. We read it through Hugging Face (Project-AgML/arabica_coffee_leaf_disease_classification, CC BY 4.0). | 197 photos kept from a random sample, 128x128. | Phone cameras, whole plants, severity. In this copy the colours look shifted, so we use it as a stress test only. |

The model is Gemma 4 E2B-it by Google DeepMind ([google/gemma-4-E2B-it](https://huggingface.co/google/gemma-4-E2B-it), Apache 2.0). It has 5.1 billion parameters with embeddings (2.3 billion effective), and takes 10 GB in bf16.

How we use each set:

- BRACOL train photos train the model. Validation photos pick the BRACOL cut-off. Test photos are for reporting only.
- Renders are for training only.
- Uganda and Kenya photos are never used to train or to make renders. The 300 held-out Uganda photos are never used to pick anything. The Uganda pool sets the local cut-off and margin, and nothing else.

Rules the code enforces:

- A render comes only from a train leaf. In a run with 10, 25 or 50% real photos, a render joins only if its source leaf is in that real subset. Otherwise the other leaves leak in through the textures. `scripts/train.py` does this.
- The split is frozen (seed 42, 12 strata, the same 39% rust in each part). Two near-duplicate pairs stay in one split.

BRACOL has a shortcut. Three numbers, the median colour of each photo's border, predict rust with AUC 0.74 on the train photos. Leaves with rust were photographed on other backgrounds than leaves without it. In our whole-leaf renders the backgrounds are random, and the same check gives 0.50. So BRACOL test scores flatter a model that learns the background. `scripts/synth/audit_shortcuts.py` repeats the check.

The renders are real BRACOL leaf textures in synthetic scenes. They aren't free of real data, and we say so wherever we report them. More detail is in [data/synthetic/README.md](data/synthetic/README.md), [data/bracol/README.md](data/bracol/README.md) and the READMEs in `data/field/`.

## Run it

You need git-lfs, uv, and Python 3.12 or 3.13. Training needs a GPU: 12 to 16 GB of GPU memory per run. A CUDA card works, and so does an Apple Silicon Mac, only slower. Blender 5.2 is needed only to make new renders. The finished renders and field photos are in the repo.

1. Clone. The BRACOL photos come through Git LFS. The full history is about 480 MB, so a shallow clone is quicker.

```bash
git lfs install
git clone --depth 1 https://github.com/harshitasharma-hub/ShhS.git
cd ShhS
```

2. Install the Python packages.

```bash
uv venv .venv --python 3.12
# On a CUDA machine, run `export UV_TORCH_BACKEND=auto` first, so uv installs the CUDA build of torch.
uv pip install --python .venv/bin/python -r requirements-train.txt
```

If you can't use Git LFS, get the BRACOL photos from Hugging Face instead:

```bash
.venv/bin/hf download luisangelico/bracol --repo-type dataset \
  --revision 66178a06febde553e2c9d6f4d90dfc462e018268 --local-dir BRACOL_coffee_leaf_images
```

3. Download the model (10 GB).

```bash
.venv/bin/hf download google/gemma-4-E2B-it --local-dir models/gemma-4-E2B-it
```

4. Run the study. Each run writes `runs/<name>/` with its scores, settings and `metrics.json`.

```bash
# the model as it comes -> runs/zeroshot_d140/
.venv/bin/python scripts/score.py --detail 140

# LoRA on all real photos -> runs/real_d140_f100_s0/
.venv/bin/python scripts/train.py --detail 140 --epochs 3

# renders only, then renders plus all real photos. Both also score the field photos.
.venv/bin/python scripts/train.py --fraction 0   --synthetic-manifest data/synthetic/v1/manifest.csv --field uganda,kenya
.venv/bin/python scripts/train.py --fraction 100 --synthetic-manifest data/synthetic/v1/manifest.csv --field uganda,kenya

# the full grid: 10, 25, 50 and 100% real photos, 3 seeds
.venv/bin/python scripts/train.py --grid --fractions 10,25,50,100 --seeds 0,1,2

# score a finished run on all 1,792 Uganda photos, set the cut-off on local photos, rebuild the tables
.venv/bin/python scripts/score_field.py --run real_d140_f100_s0 --field uganda --all
python3 scripts/calibrate_field.py
python3 scripts/make_results.py
```

A run that already has `metrics.json` is skipped, so a stopped job can restart. `scripts/batch_step1.sh` and `scripts/batch_step34.sh` hold the exact job lists we ran.

Time and cost. A 24 GB Apple M2 trains at 1.8 s per photo at detail 70 and 3.0 s at detail 140. That is 38 and 62 minutes per epoch on 1,225 photos. One rented L40S (48 GB, $1.10 per hour on RunPod) trained a 3-epoch run on all 1,225 photos in 5 to 21 minutes. The time depended on how many jobs shared the GPU. `scripts/remote_run.sh` copies the project to any GPU machine you can reach over SSH, starts a job there, and copies the results back.

The trained adapters aren't in the repo, because they are large. `runs/` keeps the scores and settings, so every number above can be traced.

## What is where

```
BRACOL_coffee_leaf_images/  BRACOL photos and dataset.csv (Git LFS)
data/bracol/                labels, the frozen split, and the checks we ran
data/synthetic/             renders (v1, v2) and the 150 bad photos, with a README
data/field/                 Uganda and Kenya photos. Never used to train
scripts/                    prepare, train, score, calibrate, results, and rented-GPU helpers
scripts/synth/              the Blender pipeline
runs/                       one folder per run: settings, scores, metrics.json
results/                    summary and calibration tables, and the Mac timing trial
presentation/               the talk, as one HTML file, and its source
checklist/                  a small local progress page we used during the hackathon
fpls-15-1360113.pdf         Klein et al. 2024, the synthetic data paper we followed
requirements-train.txt      pinned Python packages
```

## What this study can't tell you

- BRACOL test scores are optimistic for field use, because of the background shortcut above. We haven't run that check on the Uganda photos.
- Uganda photos are 256 px close-ups, and some labels look doubtful. Near copies may remain. One run's AUC has a 95% interval about 0.02 wide there. We didn't test the gaps between arms for significance.
- Kenya is a stress test. The photos are 128 px and the colours look shifted.
- The local calibration uses photos from the same Uganda set as the test. It shows what local photos can do, not how the model travels to another region.
- The share of rust caught moves between seeds. At 25% real photos plus renders, its standard deviation across seeds is 6.5 points on the 1,792 Uganda photos.
- The renders show a bent sheet for a leaf. Rust looks as it does on the 480 train leaves with rust, and severity 3 and 4 come from 67 leaves.
- The model says rust or no rust. It doesn't name other diseases or give a severity.
- A photo shows today's leaf. It can't forecast an outbreak.

## Credits and licenses

Our code is released under the MIT license, in [LICENSE](LICENSE). Data and model licenses are in the [Data](#data) section.

We followed Klein et al. (2024), "Synthetic data at scale: a development model to efficiently leverage machine learning in agriculture", Frontiers in Plant Science 15:1360113 (CC BY, PDF in the repo root). Its lesson: judge synthetic data by the score on real photos, not by how real the renders look.

The talk uses Three.js (MIT) and the fonts Bricolage Grotesque, Instrument Sans and DM Mono (SIL Open Font License). Its own README, `presentation/README.md`, lists its sources.
