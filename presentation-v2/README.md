# ShhS presentation v2

A page for the Hack-Nation x World Bank Small AI for Development hackathon, Challenge 04, Agriculture. It asks one question, "Does this coffee leaf have rust?", and follows four chapters: the problem, the solution, the results, what is next. It is a new build and does not reuse the old `presentation/` folder.

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
npm run build                                # writes js/app.js
npm run check                                # tests every finding sentence, every image path, and dashes
```

`js/app.js` is committed, so a deploy needs no build.

## Publish as a claude.ai Artifact

```bash
npm run build && node tools/make_artifact.mjs   # writes dist/artifact.html (CSS, JS and fonts inline) and dist/artifact-files.json (the image list)
```

Then publish `dist/artifact.html` with the images from `dist/artifact-files.json` as its files, `root` set to this folder. Published on 2026-10-04: https://claude.ai/artifact/FyZrgrN2AAsjQFwPsax5vv (private until you share it from the page's Share menu). To update it, publish the same file path again. `artifact-test.html` is a local preview of the same page under the host's skeleton.

## Where to edit

- Copy: `index.html`.
- Numbers in the copy come from the data. The finding sentences live in `src/lib/claims.js`. Each has a test. If a new run flips one, `npm run check` fails, the page falls back to a plain pointer to the chart, and that sentence needs a rewrite.
- The short "What we found" list: `src/scenes/summary.js`. The answers with charts: `src/scenes/answers.js`. The explorer: `src/scenes/results.js`.
- Coverage map, limits, region plan, the word list and the extra to-do items: `src/content.js`.
- Static sentences that depend on the data, so re-read them after a new run: the "Our take" paragraph (claims `field-close` and `v4-better`), the chapter 2 and chapter 3 intros, and the hero line "Tested on 1,792 real photos" (a bound number).
- To-do items in the markup: any element with `data-pending` and `data-need`. The "To do" button lists them.
- The 3D leaf and its backgrounds: `src/scenes/pipeline.js` (steps, background buttons) and `src/scenes/leaf3d.js` (the leaf and its light). The background pictures live in `img/plates/` and are listed by `build.mjs`. A missing picture falls back to a plain gradient.

## What the results say

Test sets: 261 clean BRACOL photos, and all 1,792 real photos from Ugandan farms (the main field test). The cut-off comes from BRACOL validation photos, never from a test photo.

- On clean photos, training helps (87 to 93 right out of 100), practice photos alone match real photos, and both together are best (94).
- On real farm photos, practice photos did not help (real 88, practice only 86, both 82, untrained 85). They find more rust (94 of 100 against 85) and call another disease, phoma, rust more often (47 of 100 phoma leaves right, against 77).
- Set 3 (swaps in 547 look-alike photos) moved the errors: phoma 47 to 70, but healthy leaves 93 to 82 and rust found 94 to 85.
- Set 4 (all of set 1 plus the look-alikes, 2 runs per version) comes close to real photos alone on right answers (88 against 88 out of 100), answers phoma better than real photos alone (83 against 77), and finds less rust (81 against 85). It does not beat real photos alone.
- About 100 local photos set the cut-off within about 2 points of the best case (1,492 photos). With a cut-off set on local photos, set 4 reaches the best score of the versions that use all the real photos, on 300 balanced farm photos. That sample and the number of runs (2) are small.
- The phone code (LiteRT-LM) returns plain text, not a score. A plain yes or no from the untrained AI finds 8 of 100 rust leaves.

## Still to do (also in the page)

Android build (size, speed, score after conversion), the not-sure test on the 150 bad photos, a run on set 2, a region scene pack and local photos, a Swahili voice and a native-speaker check of every Swahili line, an agronomist check of the Uganda labels, repo and demo links, team names, photo and videos.

## Sources and licences

Outside facts are checked in `FACTS.md`, with the exact wording that is safe to use. Do not publish anything it lists under "Do not use". Photos: BRACOL (CC BY 4.0), Uganda set (CC BY 4.0), Kenya JMuBEN (CC BY). Renders are ours. Fonts: Big Shoulders, Atkinson Hyperlegible Next, JetBrains Mono (SIL Open Font License). 3D: three.js (MIT). `img/MANIFEST.md` lists every image.

Chart colours were checked with the dataviz validator, all pairs: real photos violet `#8A3FA0`, practice + real `#2B4CEB`, practice only `#0A8DB0`, untrained grey. Orange means rust, green means no rust, blue means made in 3D or taught with 3D photos. Real photos are violet on purpose, so they are never read as rust.
