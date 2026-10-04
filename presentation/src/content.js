// The talk. One chapter list for the progress bar, one beat list for the steps.
// Copy rules: short plain sentences, plain hyphens only, every number sourced.
// Each beat: id, chapter, scene, side, env, seam, eyebrow, title, html (rest of the card), notes.
//
// What this talk says is what the ShhS repository does: Gemma 4 E2B-it, LoRA fine-tuning, the rust
// yes-or-no task on BRACOL, a frozen split, and renders from Blender added as extra training photos.
// We do not model how rust spreads. There are no results yet, and the talk says so.

// dur is the planned seconds. It only sets how wide each chapter is in the bar at the bottom.
export const CHAPTERS = [
  { id: 'open', name: 'Open', dur: 20 },
  { id: 'noor', name: 'Noor', dur: 65 },
  { id: 'gap', name: 'Gap', dur: 60 },
  { id: 'idea', name: 'Idea', dur: 45 },
  { id: 'lab', name: 'Renders', dur: 55 },
  { id: 'photos', name: 'Labels', dur: 40 },
  { id: 'recipe', name: 'Plan', dur: 185 },
  { id: 'proof', name: 'Evidence', dur: 70 },
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

export const SOURCES = [
  { k: 'Challenge', t: 'Hack-Nation x World Bank Youth Summit. Small AI for Development Hackathon, Challenge 04, Annex B Agriculture. Concept note, October 2026.' },
  { k: 'FAO', t: 'FAO, 2 December 2019. "Up to 40 percent of global food crops are lost to plant pests and diseases."', href: 'https://www.fao.org/newsroom/detail/FAO-launches-2020-as-the-UN-s-International-Year-of-Plant-Health/' },
  { k: 'Plantwise', t: 'Plantwise (CABI), 17 March 2022. Coffee leaf rust: spotting and managing Hemileia vastatrix.', href: 'https://blog.plantwise.org/2022/03/17/coffee-leaf-rust-spotting-and-managing-hemileia-vastatrix/' },
  { k: 'PlantVillage test', t: 'Mohanty, Hughes, Salathe. Using deep learning for image-based plant disease detection. Frontiers in Plant Science, 2016. 54,306 images; 99.35% on a held-out set, 31.4% on images from other conditions.', href: 'https://arxiv.org/abs/1604.03169' },
  { k: 'BRACOL', t: 'Krohling, Esgario, Ventura. BRACOL: a Brazilian Arabica coffee leaf images dataset. Mendeley Data, 2019. 1,747 leaf images from five phone models. CC BY 4.0. Our own check: every photo is 2048 by 1024 pixels, and the 24 we looked at show one leaf on a plain light background (ShhS repository, data/bracol/README.md).', href: 'https://data.mendeley.com/datasets/yy2k5y8mxg/1' },
  { k: 'Kenya set', t: 'Arabica coffee leaf images dataset for coffee leaf disease detection and classification. Data in Brief, 2021. 58,555 leaf images from Mutira, Kirinyaga County, Kenya. Fujifilm X-T4 camera. CC BY.', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8165403/' },
  { k: 'Gemma 4', t: 'Gemma 4 E2B-it model card, Google DeepMind. Apache 2.0. 2.3 billion effective parameters (5.1 billion with embeddings). Takes text, image and audio. Made for phones and laptops.', href: 'https://huggingface.co/collections/google/gemma-4' },
  { k: 'Klein et al.', t: 'Klein, Waller, Pirk, Palubicki, Tester, Michels. Synthetic data at scale: a development model to efficiently leverage machine learning in agriculture. Frontiers in Plant Science, 2024. A tomato-disease classifier trained only on renders: 26 of 29 real images right (89.6%) after a threshold fix. CC BY.', href: 'https://doi.org/10.3389/fpls.2024.1360113' },
  { k: 'Review', t: 'He, Li, Chen, Raj, Fleming, Chen, Karkee, Xiang. From 2D image synthesis to 3D scene generation: a comprehensive review of synthetic data for agricultural vision. Artificial Intelligence Review, 2026. Accepted manuscript.', href: 'https://doi.org/10.1007/s10462-026-11658-8' },
  { k: 'Tesla AI Day', t: 'Tesla AI Day, August 2021. Simulation for rare scenes and auto-labeled clips for training.' },
  { k: 'Datasets named in the brief', t: 'PlantVillage, PlantDoc, Cassava Leaf Disease and iBean (Makerere), BRACOL, NASA POWER, CHIRPS, iSDAsoil, Mozilla Common Voice, FLEURS, Meta MMS.' },
  { k: 'Figures', t: 'All diagrams on this page were drawn from scratch for this talk. We read the review paper and did not copy its figures (it is licensed CC BY-NC-ND). The 3D farm and leaf are a Three.js preview. The real renders come from Blender.' },
];

export const BEATS = [
  // ------------------------------------------------------------------ open
  {
    id: 'open', chapter: 'open', scene: 'farm', side: 'left', env: 'dawn',
    seam: { v: 0.5, mode: 'follow', show: true },
    html: `${eyebrow('Small AI for Development · Challenge 04 · Agriculture', 'var(--healthy)')}
      <p class="panel__body">One question. Do coffee leaves rendered in Blender help a small model find rust on real photos? We add them to real photos, then test on photos the model never saw. The model runs offline on Noor's phone.</p>
      <p class="panel__small">Drag the line. Left is a photo. Right is the label a render gives for free.</p>
      <div class="chips"><button class="btn" data-go="next" type="button">Start the talk <span aria-hidden="true">&rarr;</span></button></div>`,
    notes: 'Hi, we are ShhS. Our question: do leaves rendered in Blender help a small model spot coffee rust? We add them to real photos and test on photos the model never saw. Drag the line to see a photo on the left and its label on the right.',
  },

  // ------------------------------------------------------------------ noor
  {
    id: 'noor-1', chapter: 'noor', scene: 'farm', side: 'left', env: 'dawn',
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('The challenge · Agriculture', 'var(--real)')}
      <h2 class="panel__title">Meet Noor.</h2>
      <p class="panel__body">Noor farms 2 hectares in the highlands. Coffee grows on the upper slope. Maize and beans grow below.</p>
      <p class="panel__small">Noor is fictional. Her constraints are real (Challenge 04 brief).</p>`,
    notes: 'The brief gives us Noor. 2 hectares, coffee on the upper slope, maize and beans below. She is fictional, but her limits come from real World Bank work.',
  },
  {
    id: 'noor-2', chapter: 'noor', scene: 'farm', side: 'left', env: 'dawn',
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
    id: 'noor-3', chapter: 'noor', scene: 'farm', side: 'left', env: 'dawn', wide: true,
    seam: { v: 0.5, mode: 'free', show: true },
    html: `${eyebrow('Problem statement, as the brief asks', 'var(--early)')}
      <p class="statement">Because of this tool, Noor will <mark>spot leaf rust while the spots are still small</mark>, not after the leaves drop. We know because the officer visits twice a year, and rust travels on wind and rain in between.</p>
      <p class="src">Visits: Challenge 04 brief, Annex B.<br>
      Up to 40% of global food crops are lost to pests and diseases each year (<a href="https://www.fao.org/newsroom/detail/FAO-launches-2020-as-the-UN-s-International-Year-of-Plant-Health/" target="_blank" rel="noopener noreferrer">FAO, 2019</a>).<br>
      Rust starts as small yellow spots, spreads on wind and rain, and makes leaves fall early (<a href="https://blog.plantwise.org/2022/03/17/coffee-leaf-rust-spotting-and-managing-hemileia-vastatrix/" target="_blank" rel="noopener noreferrer">Plantwise, 2022</a>).</p>`,
    notes: 'This is our one-sentence problem statement, in the format the brief asks. The evidence: the officer comes twice a year, up to 40% of crops are lost to pests and diseases, and rust spreads on wind and rain. We will check "small spots" in the test, by severity.',
  },

  // ------------------------------------------------------------------ gap
  {
    id: 'gap-1', chapter: 'gap', scene: 'gap', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Data gap', 'var(--real)')}
      <h2 class="panel__title">The photos that exist are not Noor's photos.</h2>
      <p class="panel__body">Most crop-disease sets show one leaf on a plain background. The brief warns about this. In a classic test, a model scored 99.35% on its own test set and 31.4% on photos taken under other conditions.</p>
      <figure class="chart" role="img" aria-label="Accuracy of one model on two test sets: 99.35 percent on its own lab test set, 31.4 percent on photos from other conditions.">
        <div class="chart__row" title="Lab test set: 99.35% correct"><span class="chart__name">Lab test set</span><span class="chart__track"><i style="--v:99.35"></i></span><b>99.35%</b></div>
        <div class="chart__row" title="Photos from other conditions: 31.4% correct"><span class="chart__name">Other conditions</span><span class="chart__track"><i style="--v:31.4"></i></span><b>31.4%</b></div>
        <div class="chart__axis" aria-hidden="true"><span>0</span><span>50</span><span>100%</span></div>
      </figure>
      <p class="src">Mohanty, Hughes and Salathe, 2016. PlantVillage, 54,306 images. <a href="https://arxiv.org/abs/1604.03169" target="_blank" rel="noopener noreferrer">Paper</a></p>`,
    notes: 'The brief says it too: most disease sets are studio photos on plain backgrounds. In a well-known test, a model scored 99% in the lab and 31% on photos from other conditions.',
  },
  {
    id: 'gap-2', chapter: 'gap', scene: 'gap', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Data gap', 'var(--real)')}
      <h2 class="panel__title">Even the coffee sets are leaf close-ups.</h2>
      <p class="panel__body">BRACOL has 1,747 Arabica leaf photos. The ones we checked each show one leaf on a plain light background. A Kenyan set has 58,555 leaf photos from one plantation, shot with a Fujifilm X-T4.</p>
      <p class="panel__body">Noor needs a model that has seen mild rust, shade, rain and an ordinary phone camera. Labeled photos like that take seasons to collect.</p>
      <div class="chips">${chip('<i style="--c:var(--real)"></i>BRACOL · CC BY 4.0', 'real')}${chip('<i style="--c:var(--real)"></i>Kenya set · CC BY', 'real')}</div>`,
    notes: 'Even the coffee sets are close-ups of single leaves on plain backgrounds. We looked at 24 BRACOL photos by eye to check. What Noor needs, mild rust in shade and rain on an ordinary phone, takes whole seasons to collect by hand.',
  },

  // ------------------------------------------------------------------ idea
  {
    id: 'idea-1', chapter: 'idea', scene: 'idea', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('The idea', 'var(--sim)')}
      <h2 class="panel__title">Self-driving teams do not wait for the rare crash.</h2>
      <p class="panel__body">They simulate roads, rain and pedestrians. The simulator knows where everything is, so the labels are free. Tesla described this at its 2021 AI Day. We borrow the trick, on a much smaller scale.</p>`,
    notes: 'Self-driving teams train on simulated roads for the cases that are rare or dangerous, and the simulator labels everything for free. Tesla showed this at AI Day in 2021. We borrow the idea, but at a much smaller scale.',
  },
  {
    id: 'idea-2', chapter: 'idea', scene: 'idea', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Our version', 'var(--sim)')}
      <h2 class="panel__title">We render the <em>leaf</em>.</h2>
      <p class="panel__body">In Blender we build a 3D coffee leaf with rust spots we control. Light, camera and background change on every image. Each image keeps its label. We add the renders to real photos and check if the model gets better.</p>
      <div class="chips">${chip('<i style="--c:#fff"></i>Blender renders', 'sim')}${chip('<i style="--c:#fff"></i>Free labels', 'sim')}${chip('<i style="--c:var(--real)"></i>Tested on real photos', 'real')}</div>
      <p class="panel__small">It may not help. That is why we test it. Every rendered image is labeled synthetic, as the brief requires.</p>`,
    notes: 'Our idea in one line: render coffee leaves in Blender, add them to real photos, and test if the model improves. We do not model how rust spreads. We only render images. It might not help, and the test will tell us.',
  },

  // ------------------------------------------------------------------ lab
  {
    id: 'lab', chapter: 'lab', scene: 'farm', side: 'left', env: 'dawn',
    seam: { v: 0.78, mode: 'free', show: true },
    html: `${eyebrow('Render lab · preview', 'var(--sim)')}
      <h2 class="panel__title">Turn the knobs.</h2>
      <p class="panel__body">In Blender, the rust, the light and the camera change on every image. Try the same knobs here. Click a shrub to pick another one.</p>
      <div class="lab">
        <label class="lab__slider"><span class="lab__label">Rust severity</span><input type="range" min="0" max="4" step="1" value="2" name="severity" autocomplete="off" data-ctl="level" aria-label="Rust severity, 0 to 4"><output data-out="level" aria-live="off">2</output></label>
        <div class="lab__group" role="group" aria-label="Light">
          <span class="lab__label">Light</span>
          <div class="lab__lights">
            <button class="btn btn--soft" type="button" data-ctl="light" data-light="dawn" aria-pressed="true">Dawn</button>
            <button class="btn btn--soft" type="button" data-ctl="light" data-light="noon" aria-pressed="false">Noon</button>
            <button class="btn btn--soft" type="button" data-ctl="light" data-light="overcast" aria-pressed="false">Overcast</button>
            <button class="btn btn--soft" type="button" data-ctl="light" data-light="late" aria-pressed="false">Late sun</button>
          </div>
        </div>
        <div class="lab__row"><button class="btn btn--soft" data-ctl="view" type="button">New view</button><button class="btn btn--soft" data-ctl="spot" type="button">New shrub</button></div>
        <p class="lab__insight" aria-live="polite" aria-atomic="true">Label saved with this image: <b data-out="label">rust yes · severity 2</b></p>
      </div>
      <p class="panel__small">Preview in Three.js. The real renders come from Blender.</p>`,
    notes: 'This is a Three.js preview of the knobs we turn in Blender. Slide the severity from 0 to 4. Change the light. Pick a new shrub or a new view. In Blender, each change would be a new image with its own label.',
  },

  // ------------------------------------------------------------------ labels
  {
    id: 'pairs', chapter: 'photos', scene: 'farm', side: 'left', env: 'dawn',
    seam: { v: 0.5, mode: 'free', show: true },
    html: `${eyebrow('Synthetic dataset', 'var(--sim)')}
      <h2 class="panel__title">Every render comes with its label.</h2>
      <p class="panel__body">The scene knows which leaves have rust, so each image is saved with its label: rust yes or no. A render can also give a mask of where the rust is. Our first test needs only yes or no.</p>
      <div class="chips"><button class="btn" data-ctl="shutter" type="button">Take a render</button><button class="btn btn--soft" data-ctl="batch" type="button">Make 12</button><span class="chip chip--sim"><i style="--c:#fff"></i>Synthetic</span></div>
      <div class="pairs" id="pairStrip"></div>
      <p class="panel__small" aria-live="polite" aria-atomic="true"><b data-out="pairs">0</b> made. Preview in Three.js. The real renders come from Blender.</p>`,
    notes: 'Each render is saved with its label. A render can also output a mask of the rust, but our first test only needs yes or no. The real images come from Blender. This page only previews them.',
  },

  // ------------------------------------------------------------------ plan
  {
    id: 'rec-1', chapter: 'recipe', scene: 'pipeline', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Step 1 · real photos only', 'var(--real)')}
      <h2 class="panel__title">Fine-tune on the real photos.</h2>
      <p class="panel__body">We start with Gemma 4 E2B, a model made to run on phones and laptops. First we ask it as it comes: does this coffee leaf have rust? Then we fine-tune it on 1,225 BRACOL leaves and score it on 261 it never saw.</p>
      <p class="panel__small">We fine-tune with LoRA. It trains a thin layer on top and leaves the base model alone.</p>`,
    notes: 'Step 1 is the baseline. Gemma 4 E2B is a small multimodal model from Google, with 2.3 billion effective parameters. We ask it a yes or no question about each leaf, first with no training, then after LoRA fine-tuning on the real BRACOL training photos. We score it on 261 test leaves that no run trains on.',
  },
  {
    id: 'rec-2', chapter: 'recipe', scene: 'pipeline', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Step 2 · make the synthetic leaves', 'var(--sim)')}
      <h2 class="panel__title">Build the leaf in Blender.</h2>
      <p class="panel__body">A 3D coffee leaf with a rust material. How many spots, how big and where all change from image to image. We use the same 0 to 4 severity scale as BRACOL, so we can compare by severity.</p>
      <div class="chips"><span class="chip chip--sim"><i style="--c:#fff"></i>Synthetic</span></div>`,
    notes: 'Step 2 is the new part. In Blender we build a coffee leaf with a rust material. We control the spots and give each image a severity from 0 to 4, the same scale BRACOL uses. We do not model how rust spreads.',
  },
  {
    id: 'rec-3', chapter: 'recipe', scene: 'pipeline', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Step 2 · render', 'var(--sim)')}
      <h2 class="panel__title">A virtual camera takes the images.</h2>
      <p class="panel__body">Rust, light, camera angle, distance and background change on every image. Each image is saved with its label.</p>
      <div class="chips"><span class="chip chip--sim"><i style="--c:#fff"></i>Synthetic</span></div>`,
    notes: 'The virtual camera changes the rust, the light, the angle, the distance and the background on every shot. Each image is saved with its label, rust yes or no.',
  },
  {
    id: 'rec-4', chapter: 'recipe', scene: 'pipeline', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Step 2 · save', 'var(--sim)')}
      <h2 class="panel__title">A folder of images and one table.</h2>
      <p class="panel__body">The table has three columns: image, rust and split. Our training script already reads this format, so the renders plug straight in.</p>
      <p class="panel__small">How many renders we make is still open.</p>`,
    notes: 'The output is a folder of images and a CSV with image, rust and split. Our training script takes that CSV as an option. How many renders we make is still open. Our timing script assumes about 2,000, and that is a guess.',
  },
  {
    id: 'rec-5', chapter: 'recipe', scene: 'pipeline', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Steps 3 and 4 · two new runs', 'var(--ink)')}
      <h2 class="panel__title">Renders only. Then renders plus real.</h2>
      <p class="panel__body">Step 3 trains on the renders alone and tests on BRACOL. Step 4 trains on the renders plus the real photos. The model and the test stay the same as in step 1, so the scores compare.</p>`,
    notes: 'Step 3 asks: can renders alone teach rust? Step 4 asks: do renders add to real photos? Everything else stays the same as step 1, so the three scores are comparable.',
  },
  {
    id: 'rec-6', chapter: 'recipe', scene: 'pipeline', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('The scarcity curve', 'var(--real)')}
      <h2 class="panel__title">Do renders help most when real photos are few?</h2>
      <p class="panel__body">We repeat steps 1 and 4 with 10, 25, 50 and 100% of the real training photos. That is 128, 312, 614 and 1,225 leaves. Each size runs with 3 random draws.</p>`,
    notes: 'The scarcity curve is our main figure. Farmers will rarely have 1,200 labeled leaves. If renders help, we expect it to show most at 10 or 25 percent. We do not know yet. Each size runs with 3 seeds so we can see the spread.',
  },
  {
    id: 'rec-7', chapter: 'recipe', scene: 'pipeline', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Field test and phone', 'var(--real)')}
      <h2 class="panel__title">Then real farm photos. Then a phone.</h2>
      <p class="panel__body">BRACOL is plain-background leaf photos, so we also test on real farm photos. Then we convert the best model for Android and try it on a phone.</p>
      <p class="panel__small">Both steps are still to do.</p>`,
    notes: 'BRACOL is not field photos, so a good score there is not enough. The field test uses real farm photos. After that we convert the best model for Android. Size, speed and battery are not measured yet.',
  },
  {
    id: 'rec-8', chapter: 'recipe', scene: 'pipeline', side: 'right', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('The plan, end to end', 'var(--sim)')}
      <h2 class="panel__title">Render. Add. Test on real.</h2>
      <p class="panel__body">Render leaves with free labels. Add them to the real photos. Train the same small model. Score it on photos it never saw, then on a farm, then on a phone.</p>`,
    notes: 'Put together: we change one thing, the training data, and keep the model and the test fixed. Then we read the curve. If the renders do not help, we say so.',
  },

  // ------------------------------------------------------------------ evidence
  {
    id: 'proof-1', chapter: 'proof', scene: 'proof', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Evidence plan', 'var(--real)')}
      <h2 class="panel__title">Will the renders help?</h2>
      <ul class="facts">
        ${fact('dot', 'Every run is scored on the same <b>261 BRACOL test leaves</b>. No run trains on them.')}
        ${fact('dot', 'We report <b>AUC</b> with a 95% interval, rust found by severity, false alarms, and how often it says "not sure".')}
        ${fact('dot', 'One study trained on renders only and got <b>26 of 29</b> real tomato images right. A tiny test: encouraging, not proof (Klein et al., 2024).')}
      </ul>
      <div class="chips">${chip('<i style="--c:#9aa3c6"></i>Zero-shot')}${chip('<i style="--c:var(--sim)"></i>Renders only')}${chip('<i style="--c:var(--real)"></i>Real only')}${chip('<i style="--c:linear-gradient(var(--sim) 50%, var(--real) 50%)"></i>Real + renders')}</div>
      <p class="panel__small">No results yet. This is the plan.</p>`,
    notes: 'Every bar is empty on purpose. We have no results yet. All runs are scored on the same 261 locked BRACOL test leaves, with a 95% interval, rust found by severity, false alarms and the not-sure rate. If asked, be straight: the evidence is mixed. In one watermelon study, gains stopped near 1 real photo for every 10 synthetic ones, so more renders are not always better (He et al., 2026 review). A different 261 leaves pick the settings, so the test stays clean. We will say what we find, even if it is nothing.',
  },
  {
    id: 'proof-2', chapter: 'proof', scene: 'proof', side: 'left', env: 'studio', grid: true, wide: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('The brief scores this', 'var(--alarm)')}
      <h2 class="panel__title">What our data does not cover.</h2>
      <ol class="gaps">
        <li><b>Farm photos.</b> BRACOL leaves sit on a plain light background. The farm test is still to do.</li>
        <li><b>Other diseases.</b> The label is rust yes or no. Leaf miner, phoma and cercospora all count as no.</li>
        <li><b>Clean renders.</b> Real leaves have dirt, water drops and damage that our renders may lack.</li>
        <li><b>A small test.</b> 261 leaves, 102 of them with rust. The intervals will be wide.</li>
        <li><b>Phones.</b> BRACOL used 5 phone models. Noor's phone and the Android build are untested.</li>
        <li><b>Languages.</b> Swahili first. A native speaker still has to check the Swahili text.</li>
      </ol>`,
    notes: 'The brief scores what our data does not cover, so here it is: no farm photos in BRACOL, only rust as a label, renders that may look too clean, a small test set with wide intervals, untested phones, and Swahili text that needs a native speaker.',
  },

  // ------------------------------------------------------------------ phone
  {
    id: 'hands-1', chapter: 'phone', scene: 'phone', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Small AI rules', 'var(--healthy)')}
      <h2 class="panel__title">Point, shoot, read. No signal needed.</h2>
      <p class="panel__body">Gemma 4 E2B is made to run on a phone. We will convert our best model for Android and try it. It answers rust, no rust or not sure. Close to the line between yes and no, it says not sure, and a person decides.</p>
      <div class="chips">${chip('<i style="--c:var(--healthy)"></i>Offline')}${chip('<i style="--c:var(--healthy)"></i>Gemma 4 E2B')}${chip('<i style="--c:var(--healthy)"></i>Swahili first')}${chip('<i style="--c:var(--healthy)"></i>A person decides')}</div>
      <p class="panel__small">File size and speed on a phone are not measured yet. Why AI and not SMS or search? An SMS cannot see a leaf, and a search needs a name Noor does not have.</p>`,
    notes: 'It runs offline on the phone, answers rust, no rust or not sure, and a person always decides. Not sure is built in: we pick the margin on validation photos so the answers it does give are right 95% of the time, and we report how many photos it still answers. The Swahili text is shown first. We have not measured file size or speed on a phone yet.',
  },
  {
    id: 'hands-2', chapter: 'phone', scene: 'phone', side: 'left', env: 'studio', grid: true,
    seam: { v: 1, mode: 'free', show: false },
    html: `${eyebrow('Optional · after the first test', 'var(--healthy)')}
      <h2 class="panel__title">A cooperative hub for a second opinion.</h2>
      <p class="panel__body">A laptop at the cooperative could run a bigger copy of the model. Phones would connect over local Wi-Fi, with no internet. It is not part of our first test. Photos leave the phone only if Noor agrees.</p>
      <div class="chips"><button class="btn btn--soft" data-ctl="mode" data-mode="phone" type="button" aria-pressed="true">Phone only</button><button class="btn btn--soft" data-ctl="mode" data-mode="hub" type="button" aria-pressed="false">Phone + hub</button></div>`,
    notes: 'The core works with the phone alone. This hub is an idea for later, and it is not in our first test. Where a cooperative has a laptop, phones could connect over local Wi-Fi for a second opinion from a bigger model.',
  },

  // ------------------------------------------------------------------ close
  {
    id: 'close', chapter: 'close', scene: 'farm', side: 'left', env: 'dawn', wide: true,
    seam: { v: 0.5, mode: 'follow', show: true },
    html: `${eyebrow('Our take', 'var(--healthy)')}
      <h2 class="panel__title">Localizing AI means localizing the data.</h2>
      <p class="panel__body">Change the crop, the leaf, the light and the phone in the render. Keep the test. Another farm, another country.</p>
      <div class="chips"><button class="btn" data-go="sources" type="button">Sources and scorecard</button><button class="btn btn--soft" data-go="first" type="button">Start over</button></div>
      <p class="panel__small">ShhS · Small AI for Development Hackathon · Challenge 04, Agriculture</p>`,
    notes: 'Our take on localizing AI: it means localizing the data. Swap the crop, the leaf, the light and the phone in the render, and keep the test. Thank you. Sources and a judging scorecard are one click away.',
  },
];

export const SCORECARD = [
  ['Built solution (Small AI fidelity)', '25%', 'This talk presents a plan. Built so far: the BRACOL audit and frozen split, training and scoring scripts for Gemma 4 E2B, and a timing test. The renders and the runs come next. The phone rules are in the Phone step.'],
  ['Development relevance and impact', '20%', 'Noor and the problem statement; a farm-photo test.'],
  ['Data grounding', '15%', 'The data gap; BRACOL named with size, license and split; what the data does not cover.'],
  ['Evidence it works', '15%', 'Four runs and a scarcity curve on one locked test; no results yet.'],
  ['Clarity, design and value of AI', '15%', 'An SMS cannot see a leaf; a search needs a name Noor lacks.'],
  ['Scalability and replication', '10%', 'Change the crop and the leaf in Blender; keep the test.'],
  ['Responsible AI, data and safety', 'Pass/fail', 'Rust, no rust or not sure; a person decides; renders labeled synthetic.'],
];
