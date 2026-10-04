# Synthetic coffee leaf photos

These photos are rendered, not taken. Each one starts from a real BRACOL leaf photo from the train split. A script cuts the leaf out, bends it in 3D, and renders it in Blender with a chosen light, weather, background and camera. The label of the real leaf becomes the label of the render.

We made them because BRACOL has one kind of picture: a whole leaf on a plain background. A farmer's phone photo is different. The World Bank brief says models trained on studio photos do badly in the field. The renders put the same leaves into scenes that look more like a field.

## What is here

| Folder | What it holds |
| --- | --- |
| `v1/` | 1353 training photos made from 1221 train leaves. `images/`, `meta/` (the render settings of each photo) and `manifest.csv`. |
| `v2/` | 1353 more training photos from the same leaves, made with the same recipe and new random seeds. Same format as v1. |
| `unusable/` | 150 photos that no model should judge. For testing the 'not sure' answer only. Never train on them. |
| `textures/` | The leaf cut-outs the renders use: 1221 of 1225 train leaves passed the mask checks. Rebuild them with the scripts below. |
| `probe*` | Early test renders. They are not part of any experiment. |

## Counts in v1

1353 photos. 610 show a leaf with rust (45%) and 743 do not. BRACOL train is 39% rust. The share is higher here because the 66 leaves with rust severity 3 or 4 get three renders each.

| Kind of photo | Photos |
| --- | --- |
| Whole leaf in a field scene | 666 |
| Close-up of one spot on the leaf | 521 |
| Whole leaf on a plain light background | 166 |

| Light or weather | Photos |
| --- | --- |
| overcast | 290 |
| sun | 210 |
| rain | 202 |
| shade | 133 |
| sun_wet | 132 |
| golden | 125 |
| backlit | 95 |

Sizes in pixels: 1024x512 (504), 512x512 (207), 896x672 (200), 256x256 (185), 384x384 (129), 768x768 (128).

## How a photo is made

1. `extract_textures.py` cuts the leaf out of the BRACOL photo. It learns the paper colour near the edges, keeps what differs from it, takes off pale patches that touch the leaf edge, and divides out the colour cast of the paper. Leaves with a broken outline, or with a large tan patch stuck to the edge (we think a finger or a piece of paper), are dropped.
2. `find_lesions.py` finds the yellow-orange spots (rust) and the dark brown patches (other damage) on each leaf.
3. `blender_render.py` bends the leaf into a 3D sheet with a fold, a droop, a twist and wavy edges, and puts the photo on it as colour and as a small relief. It adds sky or sun light, shade from leaves above, 5 to 24 blurred leaves and up to 2 stems behind, soil, and a phone-like camera with depth of field. In the rain scenes it adds water drops and a wet shine. A quick test render sets the exposure first, the way a phone meters a scene.
4. In a close-up, the camera looks at one spot. For a leaf with rust it looks at an orange spot, so the photo shows the thing the label is about. For other leaves it looks at a brown patch or a random place.
5. `phone_effects.py` adds what a phone does to the picture: white balance drift, contrast, sharpening, blur, a smaller size, sensor noise, vignette, JPEG damage, and sometimes rain streaks.

`generate.py` plans and runs all of this. The same seed gives the same photo.

## How to use them

Training: pass `data/synthetic/v1/manifest.csv` to `scripts/train.py --synthetic-manifest`. It has the same columns as `data/bracol/manifest.csv`, and the `image` paths start at the repo root. Every row is `split` = train.

The 'not sure' test: `data/synthetic/unusable/manifest.csv` has `expect_unsure` = 1 and the kind of damage in `bad` (no_leaf, tiny, defocus, glare, dark). `rust` is empty on purpose. Count how often the model answers 'not sure' for each kind. Some photos are less damaged than others, so do not expect 100%.

Extra phone versions of the same render, if they exist, are in `manifest_variants.csv`. They are never in `manifest.csv`.

## Labels and rules

A render has the labels of its source leaf: `rust`, `miner`, `phoma`, `cercospora`, `severity`. The column `source_id` is the BRACOL id of that leaf.

- Only leaves from the BRACOL train split are used. No val or test leaf feeds a render.
- For a run with a smaller real subset (10, 25 or 50%), use only the renders whose `source_id` is in that subset. Otherwise the other leaves leak in through the textures.
- Field photos in `data/field/` are for testing. They are never used to make or train on renders.

These are synthetic scenes built from real leaf textures. They are not free of real data. Say so wherever you report results.

## A shortcut we found in BRACOL

The colour of the photo background predicts rust in BRACOL. A small model that sees only three numbers, the median Lab colour of the frame around each photo, scores AUC 0.738 for rust on the 1225 train photos. An AUC of 0.5 would mean the background says nothing. Leaves with rust were photographed on other backgrounds than leaves without it. A model can use that.

The same test on the whole-leaf synthetic photos (832 photos) gives AUC 0.497, because the background is random. `audit_shortcuts.py` repeats the check.

## What the photos do not cover

- Real plants. The leaf is a bent sheet, the background leaves float with a few loose stems, and there are no berries, insects, hands or sky.
- Anything BRACOL does not show. Rust looks the way it looks on the 480 train leaves with rust. Severity 3 and 4 come from only 67 leaves.
- Real phone lenses, flare, and the processing inside a real phone.

## Known problems

- Some cut-outs have a small notch in the leaf edge, and a few keep a thin pale fringe.
- A close-up of a leaf with rust can still miss the rust if the colour finder picked the wrong blob. We did not check every photo.
- Rain streaks or heavy glare can hide small spots. The label stays the same.

## Credit

Leaf photos: BRACOL, by Krohling, Esgario and Ventura, Mendeley Data, doi 10.17632/yy2k5y8mxg.1, licence CC BY 4.0. These renders are adapted from it, so they carry the same credit. We took the photos from a complete copy on Hugging Face (luisangelico/bracol) because the Mendeley zip is cut off.

## Rebuild

```bash
uv run scripts/prepare_bracol.py                       # labels and splits
uv run scripts/synth/extract_textures.py --split train # cut-outs
uv run scripts/synth/find_lesions.py                   # where the spots are
uv run scripts/synth/generate.py v1                    # render and finish the photos
uv run scripts/synth/generate.py unusable              # the bad-photo test set
uv run scripts/synth/audit_shortcuts.py v1             # background check
```

Blender 5.2 is needed at `/Applications/Blender.app`. The render took about 1.6 s per photo on an M2.
