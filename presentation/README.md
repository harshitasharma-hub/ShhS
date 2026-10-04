# ShhS: a crop doctor trained on leaves that never existed

An interactive talk of about 10 minutes for the World Bank Small AI for Development Hackathon (Hack-Nation), Challenge 04, Agriculture.

The question: do coffee leaves rendered in Blender help a small model find rust on real photos? We add the renders to real photos, then test on photos the model never saw. The model is Gemma 4 E2B, fine-tuned with LoRA, and it is meant to run offline on a phone. The brief's farmer, Noor, grows coffee, maize and beans on 2 hectares.

Everything is drawn in Three.js. There is no server and no network call. The page works offline.

This folder is the talk only. It sits in `presentation/` of the ShhS repository. The experiment code (data audit, training and scoring scripts) lives next to it, in `scripts/`, `data/` and `runs/` at the repo root.

## Present it

Open `shhs-talk.html` in Chrome, Edge, Safari or Firefox. Double-clicking the file is enough. It is the whole talk in one file (code and fonts inside), so it is the one to send, copy to a USB stick, or open on the stage laptop. `index.html` is the same talk split into `styles.css`, `dist/app.js` and `fonts/`.

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

- The bar at the bottom shows where you are. Each chapter is as wide as its planned share of the talk. It is a display, not a control.
- The line down the middle of the first screen is the seam. Left of it is a photo. Right of it is the label view a render gives for free. Drag it.
- In the Renders step, slide the rust severity from 0 to 4, change the light, or pick another shrub. In the Labels step, press Make 12.
- If it feels slow, press Q. The page also lowers its own resolution when the frame rate drops.

## What the talk says

The talk follows the plan in the ShhS repository. Nothing in it is a result.

1. Fine-tune Gemma 4 E2B on the real BRACOL photos (1,225 train, 261 validation, 261 test). First score it as it comes, with no training.
2. Make synthetic leaves in Blender, with their labels.
3. Fine-tune on the renders only, and test on BRACOL.
4. Fine-tune on the renders plus the real photos, and test on BRACOL.
5. Repeat steps 1 and 4 with 10, 25, 50 and 100% of the real training photos, 3 random draws each.
6. Test on real farm photos. Then convert the best model for Android and try it on a phone.

We do not model how rust spreads. The farm and the leaf in the talk are a Three.js preview of what Blender will render.

## Edit it

Copy, speaker notes, sources and the scorecard are in `src/content.js`. Chapter widths for the bar at the bottom are at the top of that file.

Camera positions are in each scene file, under `poses`. Scenes are in `src/scenes/`.

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
src/app.js            steps, camera flights, seam, input
src/world/            the farm: terrain, coffee, maize, beans, props, shaders
src/scenes/           farm, gap, idea, pipeline, proof, phone
```

## Facts to check before you present

- The Blender details on the slides are our plan, not a record of what was built. They are: what changes on every image (rust spots, light, camera angle, distance, backdrop), the 0 to 4 severity labels, and the table with the columns image, rust and split. The last one matches `--synthetic-manifest` in `../scripts/train.py`. Correct the slides if the real recipe differs.
- How many renders we make is open. `../scripts/time_training.py` assumes about 2,000, and says that is a guess.
- BRACOL is described as "one leaf on a plain light background" because we looked at 24 photos by eye (`../data/bracol/README.md`). We did not look at all 1,747.
- Swahili lines on the phone screen ("Piga picha ya jani", "Kutu ya majani", "Sina uhakika", "Muulize afisa ugani", "Angalia majani ya karibu", "Sikiliza", "Hifadhi") should be checked by a native speaker. "Kutu ya majani", "piga picha" and "sina uhakika" were confirmed in public sources. The rest were not.
- File size and speed on a phone are not measured. The Android build is a to-do.
- The cooperative hub is an idea for later. It is not in the first test.
- There are no results in this talk. The Evidence chapter is a plan, and every bar in it is empty on purpose.

## Sources

- Hack-Nation x World Bank Youth Summit, Small AI for Development Hackathon, Challenge 04 concept note, Annex B Agriculture.
- FAO, 2 December 2019: up to 40 percent of global food crops are lost to plant pests and diseases every year.
- Plantwise (CABI), 17 March 2022: coffee leaf rust, symptoms and spread.
- Mohanty, Hughes, Salathe (2016): 99.35% on the held-out set, 31.4% on images from other conditions.
- BRACOL (Krohling, Esgario, Ventura, Mendeley Data, 2019): 1,747 leaf images, 5 phone models, CC BY 4.0.
- Kenyan Arabica leaf set (Data in Brief, 2021): 58,555 leaf images, one plantation, Fujifilm X-T4, CC BY.
- Gemma 4 E2B-it model card (Google DeepMind): Apache 2.0, 2.3 billion effective parameters.
- Klein et al., "Synthetic data at scale: a development model to efficiently leverage machine learning in agriculture", Frontiers in Plant Science, 2024 (CC BY): a tomato-disease classifier trained only on renders got 26 of 29 real images right (89.6%) after a threshold fix.
- He et al., "From 2D image synthesis to 3D scene generation: a comprehensive review of synthetic data for agricultural vision", Artificial Intelligence Review, 2026 (accepted manuscript).
- Tesla AI Day, August 2021: simulation for rare scenes and auto-labeled clips.

All diagrams were drawn from scratch for this talk. The review paper is licensed CC BY-NC-ND, so none of its figures are copied or adapted.

## Licenses of what ships here

Three.js (MIT). Fonts: Bricolage Grotesque, Instrument Sans and DM Mono (SIL Open Font License), self-hosted in `fonts/`.
