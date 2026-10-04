# ShhS site

A page for the Hack-Nation x World Bank Small AI for Development hackathon, Challenge 04, Agriculture. It asks one question, "Does this coffee leaf have rust?", and follows four chapters: the problem, the solution, the results, what is next. It is a separate build from the talk in `../talk/`.

Everything on it is real: BRACOL and Uganda photos, our Blender renders, and the scores in `runs/`. Nothing is mocked. Where we have no number yet, the page shows a dashed "To do" box.

The look is calm on purpose: one light page, plain words, one idea per block. Colour carries meaning: orange is rust, green is no rust, blue is made in 3D, grey with stripes is not sure. The only dark part is the 3D stage in chapter 2.

## Open it

Double-click `index.html`. It needs no server. To host it, upload this folder as a static site. It is not deployed yet.

Keys: `P` lights up every "To do" item. `Left` and `Right` change the leaf in the hero. Motion follows the visitor's system setting (reduced motion turns off the scroll effects).

## Rebuild after new runs or images

```bash
npm install                                  # once
uv run tools/build_data.py                   # reads runs/, data/ and the repo, writes img/ and src/data/generated.js
uv run tools/build_v3.py                     # six look-alike pictures and the counts of set 3
uv run tools/build_why.py                    # real Uganda photos where the versions disagree
uv run tools/build_demo.py                   # the four photos of the laptop demo and what the demo model says about them
npm run build                                # writes js/app.js
npm run check                                # tests every finding sentence, every image path, and dashes
```

`js/app.js` is committed, so a deploy needs no build.

## Host it on Vercel

The page is static and `js/app.js` is committed, so Vercel serves the files as they are. It is live at https://sshh-leaf-rust.vercel.app (the Vercel project `sshh-leaf-rust`). Only the files the page needs go online: `index.html`, `css/`, `js/`, `fonts/` and `img/` without its `.md` files.

```bash
D=$(mktemp -d) && cp index.html "$D" && cp -R css js fonts "$D" && rsync -a --exclude '*.md' img "$D"
(cd "$D" && vercel deploy --prod --yes --project sshh-leaf-rust)
```

## Where to edit

- Copy: `index.html`.
- Numbers in the copy come from the data. The finding sentences live in `src/lib/claims.js`. Each has a test. If a new run flips one, `npm run check` fails, the page falls back to a plain pointer to the chart, and that sentence needs a rewrite.
- The short "What we found" list: `src/scenes/summary.js`. The answers with charts: `src/scenes/answers.js`. The explorer: `src/scenes/results.js`.
- Coverage map, limits (11 items), the five brief rules (`BRIEF_RULES`), region plan, the word list and the extra to-do items: `src/content.js`. The brief rules and limits are drawn by `src/scenes/limits.js`.
- The laptop demo (four real Uganda photos, three answers, English, Spanish and Portuguese): `initDemo` in `src/scenes/model.js`, with the photos and scores from `tools/build_demo.py` (`src/data/demo.js`). The answer wording is copied from `scripts/model/predict.py`, so change both together.
- The "not sure" rule card (how the band is set, on clean photos and on local photos): `initRule` in `src/scenes/notsure.js`.
- Static sentences that depend on the data, so re-read them after a new run: the "Our take" paragraph (claims `field-close` and `v4-better`), the chapter 2 and chapter 3 intros, and the hero line "Tested on 1,792 real photos" (a bound number).
- To-do items in the markup: any element with `data-pending` and `data-need`. The "To do" button lists them.
- The 3D leaf and its backgrounds: `src/scenes/pipeline.js` (steps, background buttons) and `src/scenes/leaf3d.js` (the leaf and its light). The background pictures live in `img/plates/` and are listed by `build.mjs`. A missing picture falls back to a plain gradient.

## What the results say

Test sets: 261 clean BRACOL photos, and all 1,792 real photos from Ugandan farms (the main field test). The cut-off comes from BRACOL validation photos, never from a test photo.

- On clean photos, training helps (87 to 93 right out of 100), practice photos alone match real photos, and both together are highest (94). That last gain is 1 point, inside the noise of one run (a 95% interval about 0.03 wide in ranking score), so the page does not call it a win.
- On real farm photos, practice photos did not help (real 88, practice only 86, both 82, untrained 85). They find more rust (94 of 100 against 85) and call another disease, phoma, rust more often (47 of 100 phoma leaves right, against 77).
- Set 3 (swaps in 547 look-alike photos) moved the errors: phoma 47 to 70, but healthy leaves 93 to 82 and rust found 94 to 85.
- Set 4 (all of set 1 plus the look-alikes, 2 runs per version) reaches 88 right out of 100, close to the 88 of real photos alone, answers phoma better than real photos alone (83 against 77), and finds less rust (81 against 85). It does not beat real photos alone. On clean photos it scores 95 against 93.
- Sets 3 and 4 were made after we looked at the Uganda photos that set 1 got wrong, and those photos include the 300 used for the local-photo test. The page says so, so their Uganda scores are not a clean test.
- About 100 local photos set the cut-off within about 2 points of the best case (1,492 photos). With a cut-off set on local photos, set 4 reaches 89.7 on 300 balanced farm photos against 88.3 for real photos alone. That gap of 1.4 points is noise: one accuracy on 300 photos has a 95% interval about 6.9 points wide.
- Runs move. With 25% of the real photos plus practice photos, the share of rust found ranged from 79 to 92 out of 100 across 3 runs on the same photos.
- The "not sure" rule: the band is the smallest one for which the answered photos reach 95% accuracy. Set on clean photos it rarely fires (the untrained AI answers 57 to 78 of 100 and is right on 93 to 95). Set on 1,492 local Uganda photos it works: the demo model answers 72 of 100 and is right on 96 of those.
- The laptop demo (`scripts/model/predict.py` with the "real photos, 10%" adapter) is right on 89 of 100 if it must answer every photo. It has not been run on the 150 bad photos.
- The phone code (LiteRT-LM) returns plain text, not a score. A plain yes or no from the untrained AI finds 8 of 100 rust leaves.

The page uses the live counts from `runs/`. The repo README says "42 finished runs" and "23 of the 29 fine-tuned runs" reach the 95% band on clean photos. The data has 46 runs (42 trained, 4 untrained), and 30 of the 42 trained runs have band zero, so the page says 30 of 42. Check the repo README before you quote it.

## Still to do (also in the page)

Android build (size, speed, score after conversion), the not-sure test on the 150 bad photos, a run on set 2, a region scene pack and local photos, a Swahili voice and a native-speaker check of every Swahili line, an agronomist check of the Uganda labels, repo and demo links, team names, photo and videos.

## Sources and licences

Outside facts are checked in `FACTS.md`, with the exact wording that is safe to use. Do not publish anything it lists under "Do not use". Photos: BRACOL (CC BY 4.0), Uganda set (CC BY 4.0), Kenya JMuBEN (CC BY). Renders are ours. Fonts: Big Shoulders, Atkinson Hyperlegible Next, JetBrains Mono (SIL Open Font License). 3D: three.js (MIT). `img/MANIFEST.md` lists every image.

Chart colours were checked with the dataviz validator, all pairs: real photos violet `#8A3FA0`, practice + real `#2B4CEB`, practice only `#0A8DB0`, untrained grey. Orange means rust, green means no rust, blue means made in 3D or taught with 3D photos. Real photos are violet on purpose, so they are never read as rust.
