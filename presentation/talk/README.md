# SSHH! A crop doctor trained on leaves that never existed

An interactive talk of about 10 minutes for the World Bank Small AI for Development Hackathon (Hack-Nation), Challenge 04, Agriculture.

The question: do coffee leaves rendered in Blender help a small model find rust on real photos? We add the renders to real photos, then test on photos the model never saw. The model is Gemma 4 E2B, fine-tuned with LoRA, and it is meant to run offline on a phone. The brief's farmer, Noor, grows coffee, maize and beans on 2 hectares.

The 3D scenes are drawn in Three.js. The pictures are real: Blender renders from our pipeline, BRACOL leaf photos and a few farm photos. They sit inside the page, so there is no server and no network call. The page works offline.

This folder is the talk only. It sits in `presentation/talk/` of the ShhS repository. The experiment code (data audit, training and scoring scripts) lives in `scripts/`, `data/` and `runs/` at the repo root.

## Present it

Open `shhs-talk.html` in Chrome, Edge, Safari or Firefox. Double-clicking the file is enough. It is the whole talk in one file (code, fonts and pictures inside), so it is the one to send, copy to a USB stick, or open on the stage laptop. `index.html` is the same talk split into `styles.css`, `dist/app.js` and `fonts/`.

You move through the talk with the arrow keys or by scrolling. A swipe works on a touch screen. Space and the Page keys also work, so a presenter clicker does too.

| Key | What it does |
| --- | --- |
| Right or down arrow, Space | Next step |
| Left or up arrow | Previous step |
| Scroll | Next or previous step |
| S | Flip between photo and label view |
| N | Speaker notes for this step |
| P | Pause the motion |
| Q | Lite mode, for slow laptops |
| F | Full screen |
| ? | List of keys |

- The bar at the top shows where you are. Each chapter is as wide as its planned share of the talk. Click a chapter to jump to its first step.
- The line down the middle of the first screen is the seam. Drag it.
- The Idea chapter has seven steps. Steps 1 to 6 are the Leaf lab. It states the idea and shows it on one real leaf, which goes through the pipeline: the photo, the cut-out with its spots, the leaf bent in 3D, the field, the phone camera and the label. In step 3, drag the sliders to bend the leaf, draw one at random, move the sun, and drag the leaf to turn it. In step 4, pick one of eight scenes. In step 5, switch between the raw render and the phone photo.
- In step 7 of the Idea chapter, the left side is a real BRACOL photo and the right side is the same leaf in Blender. Drag the line, pick one of seven scenes, and switch the phone effects on and off.
- In the Labels step, the first tab shows nine renders with the label each one inherits. The second tab shows the unusable photos we render on purpose, to test the "not sure" answer.
- If it feels slow, press Q. The page also lowers its own resolution when the frame rate drops.

## What the talk says

The talk follows the study in the ShhS repository. The study is finished: 42 fine-tuning runs of Gemma 4 E2B, all scored.

1. Fine-tune Gemma 4 E2B on the real BRACOL photos (1,225 train, 261 validation, 261 test). First score it as it comes, with no training.
2. Make synthetic leaves in Blender, with their labels. Set 1 has 1,353 renders.
3. Fine-tune on the renders only, and on the renders plus the real photos.
4. Repeat with 10, 25, 50 and 100% of the real training photos, 3 random draws each.
5. Test on real farm photos: 1,792 from Uganda, and 197 small ones from Kenya as a stress test.
6. Second round: set 3 paints a rim round the lesions of other-disease renders, and set 4 is set 1 plus those photos.
7. Set the cut-off and the "not sure" margin on local Uganda photos.

What it found (the Evidence chapter has four charts and a map of what the data does not cover):

- On clean BRACOL photos, renders alone match real photos: AUC 0.977 and 0.978.
- On the 1,792 Uganda photos, renders do not beat real photos: 0.937 against 0.946. Adding renders to real photos lowers the score at every size, and the model says "rust" more often. Phoma leaves answered right fall from 76.5% to 46.8%.
- The best mix of the second round ties real photos (AUC 0.940 against 0.946). It does not beat them. Set 3 was made after we looked at the Uganda mistakes, so its Uganda scores are not a clean test.
- About 100 local photos set the cut-off and the "not sure" margin. The untrained model gains 5 points of accuracy, from 81.0% to 86.0%.

Not done, and the talk says so: the model has not run on a phone, the 150 unusable photos are not scored, and no native speaker has checked the language lines. Every number comes from `src/results.js`, which `tools/sync_results.py` copies from the runs.

The farm in the first steps is a Three.js preview. So is the big picture in the Leaf lab: it is drawn live in the browser, with the same bends and the same sun, sky and soil recipe as the Blender scripts, and it says so on screen. The small pictures and the numbers beside it in the Leaf lab are real Blender output and the real log of those renders. From step 7 of the Idea chapter on, the leaf pictures are real Blender output, and each one is marked Synthetic. We do not model how rust spreads.

## Edit it

Copy, speaker notes, sources and the scorecard are in `src/content.js`. Chapter widths for the bar at the top are at the top of that file.

### How a step is laid out

Every step has a text panel and a stage. The panel says it, the stage shows it, and they never overlap. Each step in `src/content.js` has a `layout`:

| Layout | What it is | Used by |
| --- | --- | --- |
| `overlay` | A small floating card over a full-screen picture. | The farm, the photo wipe, the close |
| `dock` | A caption strip along the bottom. The scene fills everything above it. | Gap, Idea (the leaf lab), Method, the four Evidence charts |
| `side` | A column on the left. The scene fills the space on its right. | Labels, the data-gaps cloud, the Phone |

The stage is measured from the real panel (`src/core/layout.js`), so it follows the text, the fonts and the window size. A scene does not place its camera by hand. It lists the points that must be in the picture, and the camera is worked out to fill the stage (`src/core/frame.js`, and `_frames()` in each scene file). Change a scene, and the shot fits again by itself. The 3D labels place themselves inside the stage too (`src/core/tags.js`): they take the side with room, and they keep clear of each other.

Add `?debug=1` to the address to see the stage as a dashed orange outline, and the part a scene draws into (the lab picture) as a dashed blue one.

The farm scene is the one exception. It keeps hand-set camera `poses`, because it is a full-screen picture. Scenes are in `src/scenes/`.

The Leaf lab draws into part of the stage. Its picture is a 2:1 viewfinder (the shape of the BRACOL photos and of the renders) with a column of numbers beside it. The scene says so with `layoutFor()`, which `src/core/layout.js` calls. The camera, the labels and the canvas cut-out all follow that rectangle. The six cards of the lab have the same height, so the picture does not change size from step to step.

Pictures and scores come from the experiment, so two small scripts copy them in:

```bash
python3 tools/prepare_assets.py   # picks and shrinks about 60 pictures into src/assets/ (needs Pillow)
python3 tools/prepare_assets.py --lab   # only the Leaf lab pictures and src/labData.js, copied from ../site
python3 tools/sync_results.py     # copies the scores in ../../runs and ../../results/calibration.md into src/results.js
```

`prepare_assets.py` reads the renders in `../../data/synthetic`, the BRACOL photos and the farm photos in `../../data/field`. The tables at the top of the file say which render is used where. Change them to pick others.

The Leaf lab pictures (the photo, the cut-out, eight scenes with and without phone effects, three training renders) and the numbers behind them come from `../site` (`img/` and `src/data/generated.js`). The script copies them as they are and writes `src/labData.js`. Without `../site` it leaves the lab pictures already in `src/assets/` alone.

`sync_results.py` averages the seeds of each arm at image detail 140 and copies two test sets: the 261 clean BRACOL photos and all 1,792 Uganda photos. It also copies the local cut-off tables from `results/calibration.md`. A bar in an Evidence chart is filled only when its run exists, and a missing run stays a dashed outline with a question mark. Run it again after each new run, then build.

```bash
npm install     # once
npm run build   # writes dist/app.js, shhs-talk.html and dist/artifact.html (the page fragment for a claude.ai artifact)
npm run dev     # rebuild on every change
npm run serve   # optional local server on http://localhost:5273
```

## What is where

```
index.html            page shell and layers
styles.css            tokens, layout, components
src/content.js        the talk: chapters, steps, copy, notes, sources
src/showcase.js       which renders the Renders and Labels steps show
src/results.js        measured scores, written by tools/sync_results.py
src/assets/           the pictures, written by tools/prepare_assets.py
src/app.js            steps, camera flights, seam, input
src/core/layout.js    measures the stage that each step's panel leaves free
src/core/frame.js     fits a camera to the points a step must show
src/core/tags.js      the 3D labels, and where they go
src/world/            the farm: terrain, coffee, maize, beans, props, shaders
src/scenes/           farm, gap, pipeline, proof (the four score charts and the data map), phone, showcase, lab
src/scenes/lab*.js    the Leaf lab: labScene (steps, controls, light), labLeaf (the bendable leaf), labWorld (the eight fields and their light)
src/labData.js        the real log of the lab renders, written by tools/prepare_assets.py
tools/                the two scripts above
```

## Facts to check before you present

- The Blender details come from `../../scripts/synth/`. Each job wraps a real BRACOL train leaf on a bent 3D leaf, and the render keeps that leaf's label. The scenes are overcast, sun, golden hour, shade, backlit, rain, sun after rain and studio (step 7 of the Idea chapter shows the first seven). One image takes about 2.5 seconds with the fast engine. The manifest has the BRACOL columns plus `source_id`, `mode`, `preset` and `seed`. Check these lines again if the scripts change.
- Set 1 has 1,353 renders from 1,221 train leaves: 832 whole-leaf scenes and 521 close-ups, and 610 of them from rust leaves. This comes from `../../data/synthetic/v1/jobs.json`.
- The table on the saved-set slide shows real job names from that plan, with labels from BRACOL.
- Only train-split leaves feed a render. The talk says so because the generator asserts it.
- Every score in the Evidence steps is copied by `tools/sync_results.py` from `../../runs/*/metrics.json` and `field_uganda_all.json`, as means over seeds at image detail 140. The untrained row is the GPU run `zeroshot_d140_cuda`, as in the repo README. The local cut-off numbers come from `../../results/calibration.md`, and the demo model's "not sure" numbers from `../../runs/real_d140_f10_s0/field_calibration.json`. After a new run, compare the cards with `../../README.md` and `../../results/summary.md`.
- The 150 unusable photos are in `../../data/synthetic/unusable/`: 30 each of glare, out of focus, tiny leaf, no leaf and too dark. The Labels step shows five of them. No run has scored them yet, and the step says so.
- BRACOL is described as "one leaf on a plain light background" because we looked at 24 photos by eye (`../../data/bracol/README.md`). We did not look at all 1,747.
- The phone screens are a design sketch, and they say so on screen. No app exists yet. File size and speed on a phone are not measured. The Android build is a to-do.
- Swahili lines on the phone screen ("Piga picha ya jani", "Kutu ya majani", "Sina uhakika", "Muulize afisa ugani", "Angalia majani ya karibu", "Sikiliza", "Hifadhi") should be checked by a native speaker. "Kutu ya majani", "piga picha" and "sina uhakika" were confirmed in public sources. The rest were not.
- The Leaf lab sliders use the same bend formula as `../../scripts/synth/blender_render.py` (`LeafShape.z`: fold, arch, twist, wavy edges and a few ripples), and the blue band on each slider is the range that script draws from. The sun uses the same angle convention as the script. The big picture is a preview: Blender does the real light, the real soil and the real blur. The soil colours were measured on the borders of the eight real renders.
- The numbers beside the lab picture are copied from the log of the renders in `../site/img/dial/dial_meta.json`. Each is one render of leaf 897. Blender draws a new sun, lens and tilt for every job, so another render of the same scene has other values. "Three of them come from this leaf" is checked against `../../data/synthetic/v1/jobs.json`, which has exactly three jobs for leaf 897.
- The cooperative hub is an idea for later. It is not built.
- The farm photos on the slides come from the Uganda phone set (CC BY 4.0). The Kenya sheet comes from `../../data/field/kenya`: a random sample of 35 of the 197 photos we hold, each 128 px. In the Hugging Face copy the colours look shifted (see `../../data/field/kenya/README.md`), so the sheet shows the kind of data, not true colours. Both sets are real photos of other farms, so they show what field photos look like. The field test results are in the Evidence steps.

## Sources

- Hack-Nation x World Bank Youth Summit, Small AI for Development Hackathon, Challenge 04 concept note, Annex B Agriculture.
- FAO, 2 December 2019: up to 40 percent of global food crops are lost to plant pests and diseases every year.
- Plantwise (CABI), 17 March 2022: coffee leaf rust, symptoms and spread.
- Mohanty, Hughes, Salathe (2016): 99.35% on the held-out set, 31.4% on images from other conditions.
- BRACOL (Krohling, Esgario, Ventura, Mendeley Data, 2019): 1,747 leaf images, 5 phone models, CC BY 4.0.
- Kenyan Arabica leaf set (Data in Brief, 2021): 58,555 leaf images, one plantation, Fujifilm X-T4, CC BY.
- Coffee leaf diseases in Uganda (Chelangat, Anirwoth, Mayanja, Sserwadda, Mendeley Data, 2025): smartphone photos, CC BY 4.0.
- Gemma 4 E2B-it model card (Google DeepMind): Apache 2.0, 2.3 billion effective parameters.
- Klein et al., "Synthetic data at scale: a development model to efficiently leverage machine learning in agriculture", Frontiers in Plant Science, 2024 (CC BY): a tomato-disease classifier trained only on renders got 26 of 29 real images right (89.6%) after a threshold fix.
- He et al., "From 2D image synthesis to 3D scene generation: a comprehensive review of synthetic data for agricultural vision", Artificial Intelligence Review, 2026 (accepted manuscript).

The diagrams were drawn from scratch for this talk. The review paper is licensed CC BY-NC-ND, so none of its figures are copied or adapted.

## Licenses of what ships here

Three.js (MIT). Fonts: Bricolage Grotesque, Instrument Sans and DM Mono (SIL Open Font License), self-hosted in `fonts/`. The BRACOL, Uganda and Kenya photos keep their own CC BY licenses. The renders are our own output.
