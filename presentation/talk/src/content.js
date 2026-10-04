// The talk. One chapter list for the progress bar, one beat list for the steps.
// Copy rules: short plain sentences, plain hyphens only, every number sourced.
// Each beat: id, chapter, scene, layout, cols, side, env, seam, html (the card), notes.
// layout: 'overlay' is a small floating card over a full-screen picture, 'dock' is a caption strip under the stage,
// 'side' is a column on the left with the stage on its right. See src/core/layout.js.
//
// What this talk says is what the ShhS repository does: Gemma 4 E2B-it, LoRA fine-tuning, the rust
// yes-or-no task on BRACOL, a frozen split, and renders from Blender added as extra training photos.
// We do not model how rust spreads. The scores are the measured ones: tools/sync_results.py copies them from runs/ into src/results.js.
// What is not done is said as not done: the model has not run on a phone, and the 150 bad photos are not scored.

import { WORLDS, FIRST_WORLD, WORLD_NOTE } from './showcase.js';
import { RESULTS } from './results.js';
import { IMG } from './assets/index.js';
import { PRESETS, COUNTS as LAB_COUNTS } from './labData.js';

// dur is the planned seconds. It only sets how wide each chapter is in the bar at the top.
// The Idea chapter is the leaf lab (six steps) and then the photo wipe (one step): the idea, shown on one leaf, and the same leaf in other worlds.
export const CHAPTERS = [
  { id: 'open', name: 'Open', dur: 20 },
  { id: 'noor', name: 'Noor', dur: 60 },
  { id: 'gap', name: 'Gap', dur: 55 },
  { id: 'idea', name: 'Idea', dur: 140 },
  { id: 'photos', name: 'Labels', dur: 35 },
  { id: 'recipe', name: 'Method', dur: 120 },
  { id: 'proof', name: 'Evidence', dur: 150 },
  { id: 'phone', name: 'Phone', dur: 45 },
  { id: 'close', name: 'Close', dur: 15 },
];

const ico = {
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
  wifi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><path d="M4 4l16 16"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M9 9c0-1.2 1-2 2-2s2 .8 2 2c0 1.4-2 1.6-2 3"/></svg>',
  dot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/></svg>',
};

const eyebrow = (text, color = 'var(--ink)') => `<p class="eyebrow"><i class="dot" style="--c:${color}"></i>${text}</p>`;
const chip = (text, kind = '') => `<span class="chip ${kind ? 'chip--' + kind : ''}">${text}</span>`;
const fact = (icon, html) => `<li><span class="ic" aria-hidden="true">${ico[icon] || ico.dot}</span><span>${html}</span></li>`;

// Measured numbers, copied by tools/sync_results.py. An arm is "<arm>[-<recipe>]:<real percent>" (see that script).
// If a run is missing, the card shows a dash and not a made-up number.
const arm = (key, where = 'uganda') => (RESULTS.arms && RESULTS.arms[key] && RESULTS.arms[key][where]) || {};
const auc = (key, where = 'uganda') => (arm(key, where).auc == null ? '-' : arm(key, where).auc.toFixed(3));
const pc = (v) => (v == null ? '-' : `${(v * 100).toFixed(1)}%`);
const pc0 = (v) => (v == null ? '-' : `${Math.round(v * 100)}%`);
const local = (key) => (RESULTS.local && RESULTS.local[key]) || {};
const demo = RESULTS.demo || {};
const T = RESULTS.tests || {};
const n0 = (n) => (n == null ? '-' : Number(n).toLocaleString('en-US'));

export const SOURCES = [
  { k: 'Challenge', t: 'Hack-Nation x World Bank Youth Summit. Small AI for Development Hackathon, Challenge 04, Annex B Agriculture. Concept note, October 2026.' },
  { k: 'FAO', t: 'FAO, 2 December 2019. "Up to 40 percent of global food crops are lost to plant pests and diseases."', href: 'https://www.fao.org/newsroom/detail/FAO-launches-2020-as-the-UN-s-International-Year-of-Plant-Health/' },
  { k: 'Plantwise', t: 'Plantwise (CABI), 17 March 2022. Coffee leaf rust: spotting and managing Hemileia vastatrix.', href: 'https://blog.plantwise.org/2022/03/17/coffee-leaf-rust-spotting-and-managing-hemileia-vastatrix/' },
  { k: 'PlantVillage test', t: 'Mohanty, Hughes, Salathe. Using deep learning for image-based plant disease detection. Frontiers in Plant Science, 2016. 54,306 images; 99.35% on a held-out set, 31.4% on images from other conditions.', href: 'https://arxiv.org/abs/1604.03169' },
  { k: 'BRACOL', t: 'Krohling, Esgario, Ventura. BRACOL: a Brazilian Arabica coffee leaf images dataset. Mendeley Data, 2019. 1,747 leaf images from five phone models. CC BY 4.0. Our own checks: every photo is 2048 by 1024 pixels, and the 24 we looked at show one leaf on a plain light background (ShhS repository, data/bracol/README.md). The median colour of a photo\'s border predicts rust with AUC 0.74 on the train photos, so BRACOL test scores flatter a model that learns the background (scripts/synth/audit_shortcuts.py).', href: 'https://data.mendeley.com/datasets/yy2k5y8mxg/1' },
  { k: 'Kenya set', t: 'Arabica coffee leaf images dataset for coffee leaf disease detection and classification. Data in Brief, 2021. 58,555 leaf images from Mutira, Kirinyaga County, Kenya. Fujifilm X-T4 camera. CC BY. Our stress test uses a sample of 197 photos, shrunk to 128 pixels with shifted colours, read through Hugging Face (Project-AgML).', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8165403/' },
  { k: 'Gemma 4', t: 'Gemma 4 E2B-it model card, Google DeepMind. Apache 2.0. 2.3 billion effective parameters (5.1 billion with embeddings). Takes text, image and audio. Made for phones and laptops.', href: 'https://huggingface.co/collections/google/gemma-4' },
  { k: 'Klein et al.', t: 'Klein, Waller, Pirk, Palubicki, Tester, Michels. Synthetic data at scale: a development model to efficiently leverage machine learning in agriculture. Frontiers in Plant Science, 2024. A tomato-disease classifier trained only on renders: 26 of 29 real images right (89.6%) after a threshold fix. CC BY.', href: 'https://doi.org/10.3389/fpls.2024.1360113' },
  { k: 'Review', t: 'He, Li, Chen, Raj, Fleming, Chen, Karkee, Xiang. From 2D image synthesis to 3D scene generation: a comprehensive review of synthetic data for agricultural vision. Artificial Intelligence Review, 2026. Accepted manuscript.', href: 'https://doi.org/10.1007/s10462-026-11658-8' },
  { k: 'Renders', t: 'Our own renders: Blender 5.2, scripts/synth/ in the ShhS repository. Each one wraps a real BRACOL train leaf (CC BY 4.0) on a bent 3D leaf and keeps that leaf\'s label. Set 1 has 1,353 renders. Set 3 repaints 547 other-disease renders with a rim round the lesions. Set 4 is set 1 plus those 547. They are synthetic scenes built from real leaf textures, not leaf-free synthetic data.' },
  { k: 'Farm photos', t: 'Chelangat, Anirwoth, Mayanja, Sserwadda. A machine learning dataset for classification of common coffee leaf diseases in Uganda. Mendeley Data, 2025. Smartphone photos, CC BY 4.0. Our field test: 1,792 unique photos (605 rust, 737 healthy, 450 phoma), 256 pixels. 300 are held out to test the local cut-off. No run trained on them.', href: 'https://data.mendeley.com/datasets/k36wnd6knb/1' },
  { k: 'Our scores', t: `Every score in the Evidence steps comes from runs/*/metrics.json and runs/*/field_*.json in the ShhS repository: ${(RESULTS.counts || {}).trained ?? '-'} fine-tuning runs of Gemma 4 E2B-it with LoRA, plus the untrained model. Numbers are means over seeds (3 seeds, 2 for set 4) at image detail 140. The cut-off comes from BRACOL validation photos unless a step says it was set on local photos. Full tables: results/summary.md and results/calibration.md.` },
  { k: 'Datasets named in the brief', t: 'PlantVillage, PlantDoc, Cassava Leaf Disease and iBean (Makerere), BRACOL, NASA POWER, CHIRPS, iSDAsoil, Mozilla Common Voice, FLEURS, Meta MMS.' },
  { k: 'Figures', t: 'All diagrams on this page were drawn from scratch for this talk. We read the review paper and did not copy its figures (it is licensed CC BY-NC-ND). The 3D farm and leaf are a Three.js preview. The real renders come from Blender.' },
];

export const BEATS = [
  // ------------------------------------------------------------------ open
  {
    id: 'open', chapter: 'open', scene: 'farm', layout: 'overlay', side: 'left', env: 'dawn',
    seam: { v: 0.5, mode: 'follow', show: true },
    html: `<p class="panel__body">One question. Do coffee leaves rendered in Blender help a small model find rust on real photos? We add them to real photos, then test on photos the model never saw. The model is small and made for phones.</p>
      <div class="chips"><button class="btn" data-go="next" type="button">Start the talk <span aria-hidden="true">&rarr;</span></button></div>`,
    float: `<figure class="hero-card">
        <img src="${IMG.render_golden}" width="1024" height="512" decoding="async" alt="A coffee leaf with rust spots, drawn by Blender. The leaf never existed.">
        <figcaption><span class="chip chip--sim"><i style="--c:#fff"></i>Synthetic</span><span>This leaf never existed. Blender wrapped a real BRACOL leaf skin on a 3D leaf.</span></figcaption>
      </figure>`,
    notes: 'Hi, we are SSHH! Our question: do leaves rendered in Blender help a small model spot coffee rust? We add them to real photos and test on photos the model never saw. Drag the line to see a photo on the left and its label on the right.',
  },

  // ------------------------------------------------------------------ noor
  {
    id: 'noor-1', chapter: 'noor', scene: 'farm', layout: 'overlay', side: 'left', env: 'dawn',
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('The challenge · Agriculture', 'var(--real)')}
      <h2 class="panel__title">Meet Noor.</h2>
      <p class="panel__body">Noor farms 2 hectares in the highlands. Coffee grows on the upper slope. Maize and beans grow below.</p>
      <p class="panel__small">Noor is fictional. Her constraints are real (Challenge 04 brief).</p>`,
    notes: 'The brief gives us Noor. 2 hectares, coffee on the upper slope, maize and beans below. She is fictional, but her limits come from real World Bank work.',
  },
  {
    id: 'noor-2', chapter: 'noor', scene: 'farm', layout: 'overlay', side: 'left', env: 'dawn',
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('The problem', 'var(--real)')}
      <h2 class="panel__title">Her coffee yield dropped. She cannot say why.</h2>
      <ul class="facts">
        ${fact('calendar', 'The extension officer visits the sub-county <b>twice a year</b> at best.')}
        ${fact('wifi', 'There is <b>no Wi-Fi</b> at home. She buys 3G data bundles.')}
        ${fact('search', 'A search needs a name for what she sees. She <b>does not have one</b>.')}
      </ul>`,
    notes: 'She sees spots on her leaves but has no name for them. The officer comes twice a year. A search engine needs words she does not have, and an SMS cannot see a leaf.',
  },
  {
    id: 'noor-3', chapter: 'noor', scene: 'farm', layout: 'overlay', side: 'left', env: 'dawn', wide: true,
    seam: { v: 0.5, mode: 'free', show: true },
    html: `${eyebrow('Problem statement', 'var(--early)')}
      <p class="statement">Because of this tool, Noor will <mark>spot rust while the spots are small</mark>, not after the leaves drop. We know because the officer visits only twice a year.</p>
      <p class="src">Sources: Challenge 04 brief, Annex B · <a href="https://www.fao.org/newsroom/detail/FAO-launches-2020-as-the-UN-s-International-Year-of-Plant-Health/" target="_blank" rel="noopener noreferrer">FAO, 2019</a> · <a href="https://blog.plantwise.org/2022/03/17/coffee-leaf-rust-spotting-and-managing-hemileia-vastatrix/" target="_blank" rel="noopener noreferrer">Plantwise, 2022</a></p>`,
    notes: 'This is our one-sentence problem statement, in the format the brief asks. The evidence: the officer comes twice a year, up to 40% of crops are lost to pests and diseases, and rust spreads on wind and rain. We checked small spots in the test, by severity.',
  },

  // ------------------------------------------------------------------ gap
  {
    id: 'gap-1', chapter: 'gap', scene: 'gap', layout: 'dock', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Data gap', 'var(--real)')}
      <h2 class="panel__title">The photos that exist are not Noor's photos.</h2>
      <p class="panel__body">Most crop-disease sets show one leaf on a plain background. Models trained on them do much worse on photos from other conditions.</p>
      <p class="src">Mohanty, Hughes and Salathe, 2016. PlantVillage, 54,306 images. <a href="https://arxiv.org/abs/1604.03169" target="_blank" rel="noopener noreferrer">Paper</a></p>`,
    notes: 'The brief says it too: most disease sets are studio photos on plain backgrounds. In a well-known test, one model scored 99.35% on lab photos and 31.4% on photos from other conditions. Watch the photos leave the grid, go through the model, and come out with a tick or a cross. Each dot on the boards is one photo: 99 right out of 100 for lab photos, 31 right out of 100 for the others.',
  },
  {
    id: 'gap-2', chapter: 'gap', scene: 'gap', layout: 'dock', side: 'right', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Data gap', 'var(--real)')}
      <h2 class="panel__title">Even the coffee sets are leaf close-ups.</h2>
      <p class="panel__body">BRACOL has 1,747 Arabica leaf photos. The ones we checked each show one leaf on a plain light background. A Kenyan set has 58,555 leaf photos from one plantation, shot with a Fujifilm X-T4.</p>
      <p class="panel__body">Noor needs a model that has seen mild rust, shade, rain and an ordinary phone camera. Labeled photos like that take seasons to collect.</p>
      <div class="chips">${chip('<i style="--c:var(--real)"></i>BRACOL · CC BY 4.0', 'real')}${chip('<i style="--c:var(--real)"></i>Kenya set · CC BY', 'real')}</div>`,
    notes: 'Even the coffee sets are close-ups of single leaves on plain backgrounds. We looked at 24 BRACOL photos by eye to check. What Noor needs, mild rust in shade and rain on an ordinary phone, takes whole seasons to collect by hand.',
  },

  // ------------------------------------------------------------------ idea: the leaf lab
  // The idea, shown on one real leaf, BRACOL 897, through six stages, then the photo wipe (worlds) as step 7. The picture is a live Three.js preview of the Blender step.
  // The numbers and the side pictures are the real log and the real renders (src/labData.js).
  // Every step has the same card height (cols: 'lab'), so the viewfinder above it does not jump.
  {
    id: 'leaf-1', chapter: 'idea', scene: 'lab', layout: 'dock', cols: 'lab', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('The idea · step 1 of 7', 'var(--real)')}
      <h2 class="panel__title">Start with one real leaf.</h2>
      <p class="panel__body">Our idea is to render real leaves in new light and weather, and add them to the real photos. Each render keeps the label of its leaf. We start with BRACOL leaf 897, photographed on plain paper. Its label is rust, severity 4. It is a training leaf.</p>`,
    notes: 'Here is our idea. We take real coffee leaves from BRACOL and render them in new light, weather and backgrounds. Each render keeps the label of its leaf, so the labels are free. We add the renders to the real photos and test if the model gets better. We do not model how rust spreads. Let us follow one real leaf through the pipeline: BRACOL number 897, photographed on white paper. Its label is rust, severity 4. It is in the training split, and only training leaves ever feed a render.',
  },
  {
    id: 'leaf-2', chapter: 'idea', scene: 'lab', layout: 'dock', cols: 'lab', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('The idea · step 2 of 7', 'var(--real)')}
      <h2 class="panel__title">Cut it out. Find the spots.</h2>
      <p class="panel__body">A script finds the leaf against the paper, turns it level and cuts the outline out. Then it looks for orange spots and brown patches by colour. ${LAB_COUNTS.texturesUsable.toLocaleString('en-US')} of the ${LAB_COUNTS.texturesOfTrain.toLocaleString('en-US')} training leaves pass the checks.</p>`,
    notes: 'First the script cuts the leaf out of the paper. It finds the outline, turns the leaf level, and fills the edge so no white fringe shows. Then it finds the orange spots and the brown patch by colour. We keep those positions, so a close-up can aim at a real spot later. 1,221 of the 1,225 training leaves pass the checks.',
  },
  {
    id: 'leaf-3', chapter: 'idea', scene: 'lab', layout: 'dock', cols: 'lab', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('The idea · step 3 of 7', 'var(--sim)')}
      <h2 class="panel__title">Bend it in 3D.</h2>
      <p class="panel__body">Blender bends the leaf with a fold, a droop, a twist and wavy edges. Each render draws its own values from a range, the blue band on each slider. Bend this one yourself, or draw one at random. Drag the leaf to turn it.</p>
      <p class="panel__small">A browser preview of the Blender step: the same bends, a simpler light.</p>`,
    notes: 'Now the leaf becomes 3D. In Blender the photo is wrapped on a sheet with a fold along the midrib, a droop, a twist and wavy edges. Each render draws these values at random from a range, the blue band on each slider. This is a browser preview of the same bends. Drag the sliders and turn the leaf. The sun slider moves the light, so the shadow moves too.',
  },
  {
    id: 'leaf-4', chapter: 'idea', scene: 'lab', layout: 'dock', cols: 'lab', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('The idea · step 4 of 7', 'var(--sim)')}
      <h2 class="panel__title">Put it in the field.</h2>
      <p class="panel__body">Light and weather come from eight scenes. Blurred leaves, stems and soil sit behind the leaf. The camera has a lens, a tilt and depth of field. Pick a scene. The numbers are the real log of one Blender render.</p>
      <div class="scenes" role="group" aria-label="Scene">${PRESETS.map((p) => `<button class="btn btn--soft" type="button" data-ctl="env" data-key="${p.key}" aria-pressed="${p.key === 'overcast'}">${p.name}</button>`).join('')}</div>`,
    notes: 'Next the leaf goes into the field. There are eight scenes: overcast, sun, golden hour, shade, backlit, rain, after rain and studio. Each one sets the light, the sky, the soil, the blurred leaves behind and the camera lens. Pick a scene. The big picture is the browser preview. The small picture is the real Blender render of this leaf in that scene, and the numbers are its real log.',
  },
  {
    id: 'leaf-5', chapter: 'idea', scene: 'lab', layout: 'dock', cols: 'lab', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('The idea · step 5 of 7', 'var(--sim)')}
      <h2 class="panel__title">Make it a phone photo.</h2>
      <p class="panel__body">A second script makes the render look like a cheap phone photo: exposure, white balance, contrast, blur, lost resolution, noise, vignette and JPEG damage. The numbers are the real values for this image.</p>
      <div class="scenes" role="group" aria-label="Picture"><button class="btn btn--soft" type="button" data-ctl="look" data-look="raw" aria-pressed="false">Raw render</button><button class="btn btn--soft" type="button" data-ctl="look" data-look="phone" aria-pressed="true">Phone photo</button></div>`,
    notes: 'Then a second script makes the render look like a phone photo. It changes the exposure and the white balance, adds blur, noise, a vignette and JPEG damage, and sometimes rain streaks. Switch between the raw render and the phone photo. The numbers are the real values used for this image.',
  },
  {
    id: 'leaf-6', chapter: 'idea', scene: 'lab', layout: 'dock', cols: 'lab', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('The idea · step 6 of 7', 'var(--alarm)')}
      <h2 class="panel__title">Keep the label.</h2>
      <p class="panel__body">The render keeps the label of its source leaf: rust, severity 4. For a rust leaf, a close-up aims at an orange spot, so the label stays true. Set 1 holds ${LAB_COUNTS.setV1.toLocaleString('en-US')} labelled renders, and three of them come from this leaf.</p>
      <div class="chips">${chip('<i style="--c:#fff"></i>Blender renders', 'sim')}${chip('<i style="--c:#fff"></i>Free labels', 'sim')}${chip('<i style="--c:#fff"></i>Tested on real photos', 'real')}</div>`,
    notes: 'Last, the label. The picture is now a real Blender render with the phone effects, in the scene you picked. It keeps the label of its source leaf: rust, severity 4. For rust leaves, the close-up renders aim at one of the orange spots we found in step 2, so the label stays true. Set 1 has 1,353 renders. Three of them come from this one leaf, and they are on the right. That is the idea: renders with free labels, added to the real photos. It may not help. That is why we test it on photos the model never saw. Every rendered image is marked Synthetic, as the brief requires.',
  },

  // ------------------------------------------------------------------ idea, last step: the same leaf in other worlds
  {
    id: 'worlds', chapter: 'idea', scene: 'showcase', layout: 'overlay', side: 'top-left', env: 'studio',
    seam: { v: 0.5, mode: 'free', show: true }, seamTags: ['Real BRACOL photo', 'Blender render'],
    html: `${eyebrow('The idea · step 7 of 7', 'var(--sim)')}
      <h2 class="panel__title">One leaf. Many worlds.</h2>
      <p class="panel__body">Drag the line to compare.</p>`,
    dock: `<div class="dock__row" role="group" aria-label="Scene">
        ${WORLDS.map((w) => `<button class="btn btn--soft" type="button" data-ctl="world" data-world="${w.key}" aria-pressed="${w.key === FIRST_WORLD}">${w.name}</button>`).join('')}
        <span class="dock__sep" aria-hidden="true"></span>
        <button class="btn btn--soft" type="button" data-ctl="fx" aria-pressed="false">Phone effects</button>
      </div>
      <p class="dock__note" data-out="note" aria-live="polite">${WORLD_NOTE}</p>`,
    notes: 'Now we compare. On the left is a real BRACOL photo, a rust leaf on a plain background. On the right is the same leaf, cut out, bent in 3D and rendered in Blender. Drag the line, then pick a scene: overcast, sun, golden hour, shade, backlit, rain, after rain. The spots are real pixels, and only the world around the leaf is new. Switch on phone effects to see what Noor\'s phone would add: noise, blur and JPEG.',
  },

  // ------------------------------------------------------------------ labels
  {
    id: 'labels', chapter: 'photos', scene: 'showcase', layout: 'side', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Labels · from the source leaf', 'var(--sim)')}
      <h2 class="panel__title">Every render keeps its leaf's label.</h2>
      <p class="panel__body">Each render starts from one real BRACOL leaf, so it inherits that leaf's label. Leaves with leaf miner, cercospora or phoma stay "no rust", so the model must tell look-alikes apart.</p>
      <div class="scenes" role="group" aria-label="Which renders">
        <button class="btn btn--soft" type="button" data-ctl="tab" data-tab="labeled" aria-pressed="true">Labeled renders</button>
        <button class="btn btn--soft" type="button" data-ctl="tab" data-tab="refuse" aria-pressed="false">Photos to refuse</button>
      </div>
      <p class="panel__small" data-out="note" aria-live="polite">Only train-split leaves are used. No validation or test leaf feeds a render.</p>`,
    notes: 'Each render is made from one real BRACOL train leaf, so its label is that leaf\'s label: healthy, rust with a severity, or another problem. Look-alike problems like leaf miner, cercospora and phoma stay no rust. Validation and test leaves are never used. The second tab shows photos we render on purpose to be unusable: too dark, glare, out of focus, no leaf, too small. There are 30 of each kind, 150 in all. They are meant to test that the model says not sure. We have not scored them yet.',
  },

  // ------------------------------------------------------------------ plan
  {
    id: 'rec-1', chapter: 'recipe', scene: 'pipeline', layout: 'dock', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Step 1 · real photos only', 'var(--real)')}
      <h2 class="panel__title">Fine-tune on the real photos.</h2>
      <p class="panel__body">We start with Gemma 4 E2B, a model made to run on phones and laptops. First we ask it as it comes: does this leaf show coffee leaf rust? Then we fine-tune it on 1,225 BRACOL leaves and score it on 261 it never saw.</p>
      <p class="panel__small">We fine-tune with LoRA. It trains a thin layer on top and leaves the base model alone.</p>`,
    notes: 'Step 1 is the baseline. Gemma 4 E2B is a small multimodal model from Google, with 2.3 billion effective parameters. We ask it a yes or no question about each leaf, first with no training, then after LoRA fine-tuning on the real BRACOL training photos. We score it on 261 test leaves that no run trains on.',
  },
  {
    id: 'rec-2', chapter: 'recipe', scene: 'pipeline', layout: 'dock', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Step 2 · make the synthetic leaves', 'var(--sim)')}
      <h2 class="panel__title">Real leaf skin on a 3D leaf.</h2>
      <p class="panel__body">We cut each leaf out of its BRACOL photo and wrap it on a bent 3D leaf in Blender. The rust spots are real pixels, so they look real. The label comes from the source leaf.</p>
      <div class="chips"><span class="chip chip--sim"><i style="--c:#fff"></i>Synthetic</span></div>
      <p class="panel__small">Only train-split leaves. Validation and test leaves never feed a render.</p>`,
    notes: 'Step 2 is the new part, and the pipeline is built. We cut the leaf out of the photo, wrap it on a bent 3D leaf, and keep the leaf\'s own label, severity included. Only train leaves are used, so no test leaf leaks into the renders. In the data statement we say it plainly: these are synthetic scenes built from real BRACOL leaf textures. We do not model how rust spreads.',
  },
  {
    id: 'rec-3', chapter: 'recipe', scene: 'pipeline', layout: 'dock', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Step 2 · render', 'var(--sim)')}
      <h2 class="panel__title">Light, weather and a phone camera.</h2>
      <p class="panel__body">Each job picks one of eight scenes, such as overcast, sun, shade or rain. Blender adds soil, blurred leaves, water drops and a phone-like lens. Phone effects then add noise, blur and JPEG. One image takes about 2.5 seconds on a laptop.</p>
      <div class="chips"><span class="chip chip--sim"><i style="--c:#fff"></i>Synthetic</span></div>`,
    notes: 'Each job picks a scene and a seed. Blender\'s fast engine draws one image in about 2.4 to 2.8 seconds on this laptop, so about 1,500 an hour with two workers. A second script then makes the image look like it came from a cheap phone: exposure, white balance, blur, noise, JPEG and sometimes rain streaks.',
  },
  {
    id: 'rec-4', chapter: 'recipe', scene: 'pipeline', layout: 'dock', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Step 2 · save', 'var(--sim)')}
      <h2 class="panel__title">A folder of images and one table.</h2>
      <p class="panel__body">Each image gets a row: the file, its source leaf, the label, the scene and the seed. Our training script reads this table, so the renders plug straight in.</p>
      <p class="panel__small">Set 1 has 1,353 renders from 1,221 train leaves.</p>`,
    notes: 'The output is a folder of images and a CSV. Each row keeps the source leaf id, so for the scarcity runs a render may only use leaves from the same subset. Our training script takes that CSV as an option. Set 1 has 1,353 renders from 1,221 train leaves: 832 whole-leaf scenes and 521 close-ups, and 610 of them come from rust leaves.',
  },
  {
    id: 'rec-5', chapter: 'recipe', scene: 'pipeline', layout: 'dock', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Steps 3 and 4 · two more arms', 'var(--ink)')}
      <h2 class="panel__title">Renders only. Then renders plus real.</h2>
      <p class="panel__body">Step 3 trains on the renders alone. Step 4 trains on the renders plus the real photos. Both are scored on BRACOL and on farm photos. The model and the test stay the same as in step 1, so the scores compare.</p>`,
    notes: 'Step 3 asks: can renders alone teach rust? Step 4 asks: do renders add to real photos? Everything else stays the same as step 1, so the scores are comparable. Each run is scored on the clean BRACOL test photos and on the real farm photos.',
  },
  {
    id: 'rec-6', chapter: 'recipe', scene: 'pipeline', layout: 'dock', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('The scarcity curve', 'var(--real)')}
      <h2 class="panel__title">Do renders help most when real photos are few?</h2>
      <p class="panel__body">We repeated steps 1 and 4 with 10, 25, 50 and 100% of the real training photos. That is 128, 312, 614 and 1,225 leaves. Each size ran with 3 random draws.</p>`,
    notes: `The scarcity curve is our main figure. Farmers will rarely have 1,200 labeled leaves. If renders help, we expected it to show most at 10 or 25 percent. Each size ran with 3 seeds so we can see the spread. In all, the study has ${(RESULTS.counts || {}).trained ?? '-'} fine-tuning runs, and the next steps show what they found.`,
  },
  {
    id: 'rec-7', chapter: 'recipe', scene: 'pipeline', layout: 'dock', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Field test', 'var(--real)')}
      <h2 class="panel__title">Then real farm photos.</h2>
      <p class="panel__body">BRACOL is plain-background leaf photos, so we also test on real farm photos: ${n0(T.uganda)} smartphone photos from Uganda, and ${n0(T.kenya)} small ones from Kenya. No run trained on them.</p>
      <p class="panel__small">The last step, a phone, is not done. The model ran on a Mac and on a rented GPU.</p>`,
    notes: `BRACOL is not field photos, so a good score there is not enough. The field test uses real farm photos: ${n0(T.uganda)} from Uganda, with 605 rust, 737 healthy and 450 phoma, and ${n0(T.kenya)} small ones from Kenya, as a stress test only. No run trained on them. The phone step of our plan is not done. Size, speed and battery are not measured.`,
  },
  {
    id: 'rec-8', chapter: 'recipe', scene: 'pipeline', layout: 'dock', side: 'right', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Second round', 'var(--sim)')}
      <h2 class="panel__title">Then fix the phoma mistakes.</h2>
      <p class="panel__body">On farm photos, many mistakes were phoma leaves: a dark lesion with an orange rim. The model had learned that orange means rust. Set 3 paints such rims on other-disease renders. Set 4 is set 1 plus only those new photos.</p>`,
    notes: 'The first round raised false alarms on phoma leaves, which have a big dark lesion with an orange rim. In set 1, orange shows almost only on rust leaves, so the model learned that orange means rust. Set 3 paints a yellow or orange rim round the lesions of other-disease renders. We never paint a rust leaf, or its label could be wrong. Set 4 keeps all of set 1 and adds only the 547 new rimmed photos. We made these sets after we looked at the Uganda mistakes, so their Uganda scores are not a clean test.',
  },

  // ------------------------------------------------------------------ evidence
  // Four charts of measured scores (src/scenes/proofScene.js), then the map of what the data does not cover.
  // Every number below comes from src/results.js, which tools/sync_results.py copies from runs/ and results/.
  {
    id: 'proof-1', chapter: 'proof', scene: 'proof', layout: 'dock', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Evidence · clean photos', 'var(--real)')}
      <h2 class="panel__title">Renders alone match real photos.</h2>
      <ul class="facts">
        ${fact('dot', `Scored on ${T.bracol} BRACOL test leaves that no run trained on. The untrained model scores <b>AUC ${auc('zeroshot', 'bracol')}</b>. Trained on <b>renders only</b>: <b>${auc('syn:0', 'bracol')}</b>. Trained on all 1,225 real photos: <b>${auc('real:100', 'bracol')}</b>.`)}
        ${fact('dot', `Renders added to real photos: <b>${auc('mix:100', 'bracol')}</b>. A gain of ${(arm('mix:100', 'bracol').auc - arm('real:100', 'bracol').auc).toFixed(3)} is inside the noise.`)}
        ${fact('dot', `Renders do help the mildest rust. Severity 1 found: <b>${pc0(arm('real:100', 'bracol').sev1)}</b> with real photos, <b>${pc0(arm('mix:100', 'bracol').sev1)}</b> with renders added (${arm('mix:100', 'bracol').sev1n} leaves).`)}
      </ul>
      <div class="chips">${chip('<i style="--c:#9aa3c6"></i>Zero-shot')}${chip('<i style="--c:var(--sim)"></i>Renders only')}${chip('<i style="--c:var(--real)"></i>Real only')}${chip('<i style="--c:linear-gradient(var(--sim) 50%, var(--real) 50%)"></i>Real + renders')}</div>
      <p class="panel__small">Careful: BRACOL has a shortcut. The colour of a photo's border predicts rust (AUC 0.74), so these scores flatter a model that learns the background.</p>`,
    notes: `Here is the first result, on clean photos. The untrained model scores ${auc('zeroshot', 'bracol')} AUC. Trained on renders only, with no real photo, it scores ${auc('syn:0', 'bracol')}. Trained on all 1,225 real photos, it scores ${auc('real:100', 'bracol')}. So a model that never saw a real photo matches one that saw 1,225. Add the renders to the real photos and it reaches ${auc('mix:100', 'bracol')}. That gain is inside the noise. The renders do help the mildest rust, severity 1: ${pc0(arm('real:100', 'bracol').sev1)} found, then ${pc0(arm('mix:100', 'bracol').sev1)}. That is Noor's case. One caution. BRACOL has a shortcut: the colour of the photo border predicts rust with AUC 0.74. So a good BRACOL score is not the end of the story. The farm photos are.`,
  },
  {
    id: 'proof-2', chapter: 'proof', scene: 'proof', layout: 'dock', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Evidence · real farm photos', 'var(--real)')}
      <h2 class="panel__title">On farms, renders do not beat real photos.</h2>
      <ul class="facts">
        ${fact('dot', `${n0(T.uganda)} smartphone photos from Uganda. No run trained on them. <b>Renders only</b> score <b>AUC ${auc('syn:0')}</b>. <b>Real photos only</b> score <b>${auc('real:100')}</b>.`)}
        ${fact('dot', `Adding renders to real photos <b>lowers</b> the score at every size. With all 1,225 real photos, <b>${auc('real:100')}</b> falls to <b>${auc('mix:100')}</b>.`)}
        ${fact('dot', `The untrained model already scores <b>${auc('zeroshot')}</b> here. Just <b>128</b> real photos did best: <b>${auc('real:10')}</b>.`)}
      </ul>
      <div class="chips">${chip('<i style="--c:#9aa3c6"></i>Zero-shot')}${chip('<i style="--c:var(--sim)"></i>Renders only')}${chip('<i style="--c:var(--real)"></i>Real only')}${chip('<i style="--c:linear-gradient(var(--sim) 50%, var(--real) 50%)"></i>Real + renders')}</div>
      <p class="panel__small">Uganda: 605 rust, 737 healthy, 450 phoma. One run's interval is about 0.02 wide, and we did not test the gaps for significance.</p>`,
    notes: `Now the real test: ${n0(T.uganda)} smartphone photos from Uganda that no run trained on. Renders only score ${auc('syn:0')}. Real photos only score ${auc('real:100')}. Close, but not better. Add renders to the real photos and the score goes down at every size: from ${auc('real:100')} to ${auc('mix:100')} with all 1,225 real photos. The untrained model already scores ${auc('zeroshot')} here, and just 128 real photos did best, at ${auc('real:10')}. So on farm photos, renders matched real photos but did not beat them. One run's interval is about 0.02 wide, and we did not test the gaps for significance.`,
  },
  {
    id: 'proof-3', chapter: 'proof', scene: 'proof', layout: 'dock', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Evidence · why', 'var(--alarm)')}
      <h2 class="panel__title">Renders made the model say rust more often.</h2>
      <ul class="facts">
        ${fact('dot', `With all the real photos, set 1 lifts <b>rust caught</b> from <b>${pc(arm('real:100').rust)}</b> to <b>${pc(arm('mix:100').rust)}</b>. But <b>phoma</b> leaves answered right fall from <b>${pc(arm('real:100').other)}</b> to <b>${pc(arm('mix:100').other)}</b>.`)}
        ${fact('dot', `Set 3 paints a rim round the lesions of other-disease renders. On its own it fixed phoma (<b>${pc(arm('syn-v3:0').other)}</b> right) but caught only <b>${pc(arm('syn-v3:0').rust)}</b> of the rust.`)}
        ${fact('dot', `The best mix, set 4, <b>ties</b> real photos: AUC <b>${auc('mix-combo:100')}</b> against <b>${auc('real:100')}</b>. It does not beat them.`)}
      </ul>
      <div class="chips">${chip('<i style="--c:#b15cf5"></i>Accuracy')}${chip('<i style="--c:var(--alarm)"></i>Rust caught')}${chip('<i style="--c:var(--healthy)"></i>Phoma right')}</div>
      <p class="panel__small">All with the 1,225 real photos, on the Uganda photos. We made set 3 after we looked at the Uganda mistakes, so its Uganda scores are not a clean test.</p>`,
    notes: `Why does it not help? The renders push the model toward saying rust. With all the real photos, rust caught goes from ${pc(arm('real:100').rust)} to ${pc(arm('mix:100').rust)}, but phoma leaves answered right fall from ${pc(arm('real:100').other)} to ${pc(arm('mix:100').other)}. In set 1, orange shows almost only on rust leaves, so the model learned that orange means rust. Set 3 paints a rim round the lesions of other-disease renders. On its own it fixed phoma, ${pc(arm('syn-v3:0').other)} right, but caught only ${pc(arm('syn-v3:0').rust)} of the rust. The best mix, set 4, is set 1 plus only the new rimmed photos. It ties real photos: AUC ${auc('mix-combo:100')} against ${auc('real:100')}, and accuracy ${pc(arm('mix-combo:100').accuracy)} against ${pc(arm('real:100').accuracy)}. It does not beat them. And we made set 3 after we looked at the Uganda mistakes, so those scores are not a clean test.`,
  },
  {
    id: 'proof-4', chapter: 'proof', scene: 'proof', layout: 'dock', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Evidence · local photos', 'var(--healthy)')}
      <h2 class="panel__title">About 100 local photos set the cut-off.</h2>
      <ul class="facts">
        ${fact('dot', `The BRACOL cut-off does not fit farm photos. Set on local Uganda photos, the untrained model gains <b>${Math.round((local('zeroshot').localCut - local('zeroshot').bracolCut) * 100)} points</b> of accuracy: <b>${pc(local('zeroshot').bracolCut)}</b> to <b>${pc(local('zeroshot').localCut)}</b>.`)}
        ${fact('dot', `Just <b>100</b> local photos get almost all of it: <b>${pc(local('zeroshot').local100)}</b>.`)}
        ${fact('dot', `Then "not sure" works. The model trained on 128 real photos answers <b>${pc0(local('real:10').answered)}</b> of the test photos and is right on <b>${pc(local('real:10').right)}</b> of those.`)}
      </ul>
      <div class="chips">${chip('<i style="--c:#cfb2f8"></i>BRACOL cut-off')}${chip('<i style="--c:#b15cf5"></i>100 local photos')}${chip('<i style="--c:#6a2fb8"></i>1,492 local photos')}</div>
      <p class="panel__small">Test: ${T.ugandaHeldOut} held-out Uganda photos, 150 with rust. The cut-off is set on the other ${n0(T.ugandaPool)}. They come from one set, so this is not a test of a new region.</p>`,
    notes: `The cut-off matters too. The scores so far use the BRACOL cut-off, picked on clean photos. Set on local Uganda photos instead, the untrained model gains ${Math.round((local('zeroshot').localCut - local('zeroshot').bracolCut) * 100)} points of accuracy, from ${pc(local('zeroshot').bracolCut)} to ${pc(local('zeroshot').localCut)}. With just 100 local photos it reaches ${pc(local('zeroshot').local100)}. So about 100 labelled local photos get most of the benefit. Then the not sure rule works. The model trained on 128 real photos answers ${pc0(local('real:10').answered)} of the 300 test photos and is right on ${pc(local('real:10').right)} of those. One caution: the local photos and the test come from the same Uganda set. This shows what local photos can do, not how the model travels to a new region.`,
  },
  {
    id: 'proof-5', chapter: 'proof', scene: 'proof', layout: 'side', side: 'left', env: 'studio', grid: true, wide: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('The brief scores this', 'var(--alarm)')}
      <h2 class="panel__title">What our data does not cover.</h2>
      <ol class="gaps">
        <li><b>Farm photos.</b> Training had none. We tested on ${n0(T.uganda)} Uganda photos: 256 px close-ups, some labels doubtful.</li>
        <li><b>Other diseases.</b> The label is rust yes or no. Renders made phoma leaves look like rust.</li>
        <li><b>Simple scenes.</b> The leaf skin is real. A leaf is a bent sheet, with no berries, insects or hands.</li>
        <li><b>A small test.</b> Wide intervals, and no test of the gaps between arms. Sets 3 and 4 are not a clean test on Uganda.</li>
        <li><b>Phones.</b> The model has not run on a phone. BRACOL used 5 phone models.</li>
        <li><b>Languages.</b> Short lines in English, Spanish and Portuguese, and a Swahili sketch. No native speaker has checked them.</li>
      </ol>`,
    notes: 'The brief scores what our data does not cover, so here it is. Training had no farm photos, and the Uganda test is small close-ups with some doubtful labels. The label is only rust or not, and the renders made phoma leaves look like rust. A render is a bent sheet, with no berries, insects or hands. The test intervals are wide, we did not test the gaps between arms, and the scores of sets 3 and 4 on Uganda are not a clean test. The model has not run on a phone. And no native speaker has checked our language lines. BRACOL also has a background shortcut, so its test scores are optimistic.',
  },

  // ------------------------------------------------------------------ phone
  {
    id: 'hands-1', chapter: 'phone', scene: 'phone', layout: 'side', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Small AI rules', 'var(--healthy)')}
      <h2 class="panel__title">Point, shoot, read. No signal needed.</h2>
      <p class="panel__body">Gemma 4 E2B is made to run on a phone, and scoring needs no network. Our model has run on a laptop, not on a phone yet. It answers rust, no rust or not sure, and a person decides.</p>
      <ul class="facts">
        ${fact('dot', `Close to the line between yes and no, it says not sure. The demo model, with its margin set on local photos, answers <b>${pc0(demo.answered)}</b> of the farm test photos and is right on <b>${pc(demo.right)}</b> of those.`)}
        ${fact('dot', 'File size and speed on a phone are not measured. The ready phone build of Gemma 4 E2B is 2.6 GB. We have not exported ours.')}
      </ul>
      <div class="chips">${chip('<i style="--c:var(--healthy)"></i>Offline')}${chip('<i style="--c:var(--healthy)"></i>Gemma 4 E2B')}${chip('<i style="--c:var(--healthy)"></i>English, Spanish, Portuguese')}${chip('<i style="--c:var(--healthy)"></i>A person decides')}</div>
      <p class="panel__small">Why AI and not SMS or search? An SMS cannot see a leaf, and a search needs a name Noor does not have.</p>`,
    notes: `The idea is a phone that works offline. A farmer takes a photo and gets rust, no rust or not sure, and a person always decides. Today the model has run on a laptop, not on a phone. Gemma 4 E2B has a ready phone build of 2.6 gigabytes, and we have not exported ours. Not sure is built in: the margin is set on local photos, so the answers it does give reach about 95 percent. The demo copy, trained on 128 real photos, answers ${pc0(demo.answered)} of the farm test photos and is right on ${pc(demo.right)} of those. The command-line tool answers in English, Spanish or Portuguese. The phone screen is a design sketch, and its Swahili lines have not been checked by a native speaker.`,
  },
  {
    id: 'hands-2', chapter: 'phone', scene: 'phone', layout: 'side', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Optional · not built', 'var(--healthy)')}
      <h2 class="panel__title">A cooperative hub for a second opinion.</h2>
      <p class="panel__body">A laptop at the cooperative could run a bigger copy of the model. Phones would connect over local Wi-Fi, with no internet. We have not built it. Photos leave the phone only if Noor agrees.</p>
      <div class="chips"><button class="btn btn--soft" data-ctl="mode" data-mode="phone" type="button" aria-pressed="true">Phone only</button><button class="btn btn--soft" data-ctl="mode" data-mode="hub" type="button" aria-pressed="false">Phone + hub</button></div>`,
    notes: 'The core works with the phone alone. This hub is an idea for later. We have not built it. Where a cooperative has a laptop, phones could connect over local Wi-Fi for a second opinion from a bigger model.',
  },

  // ------------------------------------------------------------------ close
  {
    id: 'close', chapter: 'close', scene: 'farm', layout: 'overlay', side: 'left', env: 'dawn', wide: true,
    seam: { v: 0.5, mode: 'follow', show: true },
    html: `${eyebrow('Our take', 'var(--healthy)')}
      <h2 class="panel__title">Localizing AI means localizing the data.</h2>
      <p class="panel__body">About 100 local photos set the cut-off and the "not sure" rule. Renders matched real photos but did not beat them on farms. We report it as it came out. For another crop or country, change the leaf and the light in the render, and keep the test.</p>
      <div class="chips"><button class="btn" data-go="sources" type="button">Sources and scorecard</button><button class="btn btn--soft" data-go="first" type="button">Start over</button></div>
      <p class="panel__small">SSHH! · Small AI for Development Hackathon · Challenge 04, Agriculture</p>`,
    notes: 'Our take on localizing AI: it means localizing the data. About 100 local photos set the cut-off and the not sure rule. Renders matched real photos on clean pictures but did not beat them on real farms, and we report that as it came out. For another crop or country, swap the leaf and the light in the render, and keep the test. Thank you. Sources and a judging scorecard are one click away.',
  },
];

export const SCORECARD = [
  ['Built solution (Small AI fidelity)', '25%', `A finished study, not yet an app. Built: the BRACOL audit and frozen split, three sets of 1,353 Blender renders and 150 bad photos, ${(RESULTS.counts || {}).trained ?? '-'} fine-tuning runs of Gemma 4 E2B scored on clean and farm photos, and a command-line tool that answers rust, no rust or not sure in English, Spanish or Portuguese. Not built: the phone app. The Idea steps walk one real leaf through the render pipeline.`],
  ['Development relevance and impact', '20%', `Noor and the problem statement; a test on ${n0(T.uganda)} real Uganda farm photos; a cut-off set with about 100 local photos.`],
  ['Data grounding', '15%', 'The data gap; BRACOL, Uganda and Kenya named with size, license and role; renders from train leaves only; what the data does not cover.'],
  ['Evidence it works', '15%', `${(RESULTS.counts || {}).trained ?? '-'} training runs, 3 seeds each (2 for set 4), with AUC and 95% intervals on clean photos and on farm photos. Result: renders matched real photos and did not beat them on farms. The best mix ties real photos.`],
  ['Clarity, design and value of AI', '15%', 'An SMS cannot see a leaf; a search needs a name Noor lacks. The tool says "not sure" when it is unsure.'],
  ['Scalability and replication', '10%', 'Change the crop and the leaf in Blender; keep the test. The whole study took about 4.5 hours on one rented GPU and about $5.'],
  ['Responsible AI, data and safety', 'Pass/fail', 'Rust, no rust or not sure; a person decides; renders labeled synthetic and said to be built from real BRACOL textures; the limits are listed.'],
];
