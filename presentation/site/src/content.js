// Editable page content that is not a number from a run: the coverage map, the limits, the region plan, the word list, the pending list.
// Numbers that come from the files are filled in by the scenes, not typed here.

/** Coverage map. s is full, part, none or unk (not checked). Keep notes under about eight words. */
export const COVERAGE = {
  cols: [
    { key: 'bracol', name: 'BRACOL', sub: 'Real photos, Brazil' },
    { key: 'renders', name: 'Our practice photos', sub: 'Made from BRACOL leaves' },
    { key: 'uganda', name: 'Uganda photos', sub: 'Test only, 1,792 photos' },
    { key: 'kenya', name: 'Kenya photos', sub: 'Stress test only, 197 photos' },
  ],
  rows: [
    { name: 'One whole leaf on plain paper', cells: [
      { s: 'full', t: 'All 1,747 photos' }, { s: 'full', t: 'Studio scenes' }, { s: 'none', t: 'Close-ups of a part' }, { s: 'unk', t: 'Not checked' }] },
    { name: 'Field background: soil, other leaves', cells: [
      { s: 'none', t: 'Plain paper only' }, { s: 'part', t: 'Blurred leaves, stems, soil. No real plants' }, { s: 'part', t: 'Some background' }, { s: 'unk', t: 'Not checked' }] },
    { name: 'Close-up of one spot', cells: [
      { s: 'none', t: 'Whole leaves only' }, { s: 'full', t: 'Aimed at an orange spot' }, { s: 'full', t: '256 pixel close-ups' }, { s: 'unk', t: 'Not checked' }] },
    { name: 'Rain and wet leaves', cells: [
      { s: 'none', t: 'None' }, { s: 'full', t: 'Rain and wet-sun scenes' }, { s: 'unk', t: 'Not checked' }, { s: 'unk', t: 'Not checked' }] },
    { name: 'Low light and glare', cells: [
      { s: 'part', t: 'Some change in light' }, { s: 'part', t: 'Shade and backlit. Glare only in the not-sure test' }, { s: 'part', t: 'Daylight and low light' }, { s: 'unk', t: 'Not checked' }] },
    { name: 'Rust of severity 3 or 4', cells: [
      { s: 'part', t: '67 training leaves' }, { s: 'part', t: 'Made from those 67' }, { s: 'none', t: 'No severity labels' }, { s: 'none', t: 'No severity labels' }] },
    { name: 'Other diseases that must get "no rust"', cells: [
      { s: 'full', t: 'Miner, phoma, cercospora' }, { s: 'full', t: 'From the leaves. Sets 3 and 4 add look-alikes' }, { s: 'part', t: 'Phoma only' }, { s: 'full', t: 'Miner, phoma, cercospora' }] },
    { name: 'Berries, insects, hands, sky', cells: [
      { s: 'none', t: 'None' }, { s: 'none', t: 'None' }, { s: 'unk', t: 'Not checked' }, { s: 'unk', t: 'Not checked' }] },
    { name: 'A real phone camera', cells: [
      { s: 'full', t: 'Phone photos' }, { s: 'part', t: 'Simulated: blur, noise, JPEG' }, { s: 'full', t: 'Smartphone photos' }, { s: 'unk', t: 'Not checked' }] },
    { name: 'The place the tool will be used', cells: [
      { s: 'none', t: 'Brazil' }, { s: 'none', t: 'Brazilian leaves' }, { s: 'part', t: 'East Africa, not Noor\'s farm' }, { s: 'part', t: 'East Africa, not Noor\'s farm' }] },
  ],
};

export const LIMITS = [
  { h: 'No rust does not mean healthy.', t: 'In BRACOL, 789 of the 1,063 leaves without rust have another problem. "No rust found" means exactly that. The leaf can still be sick.' },
  { h: 'One crop, one disease.', t: 'Arabica coffee and leaf rust only. Other diseases and pests need their own work.' },
  { h: 'Practice photos borrow real leaves.', t: 'Every practice photo starts from a real BRACOL leaf, so they are not free of real data. Rust looks the way it does on the 480 training leaves with rust.' },
  { h: 'The clean test is generous.', t: 'BRACOL test photos share the paper-colour cue with the training photos. A good score there is probably too good for farm photos. The farm photos are the honest test.' },
  { h: 'The farm photos are few and small.', t: 'Uganda is 1,792 photos at 256 pixels with no severity labels, and some labels look doubtful. Kenya is 197 photos at 128 pixels with shifted colours. Kenya is a stress test only.' },
  { h: 'The cut-off comes from clean photos.', t: 'We set rust or no rust on BRACOL validation photos. On farm photos that moves the balance between missed rust and false alarms. About 100 local photos fix most of it.' },
  { h: 'Not tested on a phone yet.', t: 'Model size, speed and the score after conversion are still to do. The phone code gives no score, so the not-sure band needs another method.' },
  { h: 'A photo shows today.', t: 'It does not predict an outbreak and it does not say what to spray. A person decides.' },
];

export const REGION = {
  general: {
    note: 'Built and used in every run you saw.',
    rows: [
      ['Leaves', 'Real BRACOL leaves from Brazil. Training split only.'],
      ['Light and weather', 'Eight presets: overcast, sun, golden hour, shade, backlit, rain, sun after rain, studio.'],
      ['Ground and neighbours', 'Soil, 5 to 24 blurred leaves and up to 2 stems behind. No real plants.'],
      ['Phone camera', 'Simulated: white balance, contrast, blur, noise, vignette, JPEG damage.'],
    ],
  },
  highland: {
    note: 'Planned. Noor\'s farm is fictional, so this pack stands for any East African highland farm.',
    rows: [
      ['Leaves', 'Add local leaf photos next to the Brazilian ones.'],
      ['Light and weather', 'Set the share of rain, cloud and sun from rainfall and solar records for the place (CHIRPS, NASA POWER).'],
      ['Ground and neighbours', 'Soil colour from soil maps (iSDAsoil). Maize and beans next to the coffee, as on Noor\'s farm.'],
      ['Phone camera', 'The phone models people there own (GSMA handset data), plus a few real photos from them.'],
    ],
  },
  yours: {
    note: 'Planned. The same five steps for any place.',
    rows: [
      ['Leaves', 'Photograph 50 to 100 local leaves. An agronomist labels them.'],
      ['Light and weather', 'Read the place\'s rainfall and sun records. Weight the presets.'],
      ['Ground and neighbours', 'Use soil maps and a farm survey (LSMS-ISA) for ground and crops.'],
      ['Phone camera', 'Match the common phones.'],
      ['Check', 'Retrain, then test on local photos the model never saw. Set the cut-off there.'],
    ],
  },
};

/** The word list. Words with an id can be opened from a dotted word in the text. */
export const WORDS = [
  { id: 'auc', term: 'AUC, the ranking score', def: 'Pick one leaf with rust and one without. AUC is how often the AI gives the rust leaf the higher score. 1.0 is perfect. 0.5 is a coin flip.' },
  { id: 'score', term: 'Score', def: 'A number the AI gives each photo. Higher means more like rust. It is the AI\'s own preference for "Yes" minus its preference for "No".' },
  { id: 'cutoff', term: 'Cut-off', def: 'The score above which the AI answers "rust". We set it on clean validation photos, so it is not tuned on any test photo.' },
  { id: 'band', term: 'Not-sure band', def: 'A band of scores around the cut-off. A photo that lands inside it gets "not sure, ask a person".' },
  { id: 'lora', term: 'LoRA', def: 'A cheap way to teach a big AI. We train a small add-on and leave the base model as it is.' },
  { id: 'gemma', term: 'Gemma 4 E2B', def: 'An open AI model from Google DeepMind. It reads photos and text. "E2B" means about 2 billion effective parameters, small enough to aim at a phone.' },
  { id: 'bracol', term: 'BRACOL', def: 'A public set of 1,747 coffee leaf photos from Brazil, on plain paper. Each leaf has labels for rust and other problems.' },
  { id: 'phoma', term: 'Phoma', def: 'Another coffee leaf disease. Its lesions are dark and can have an orange rim, so it can look like rust. The right answer for it is "no rust".' },
  { id: 'practice', term: 'Practice photo', def: 'A picture made by software, not taken with a camera. Ours are made in Blender from real leaf photos. Some call these synthetic or rendered photos.' },
  { id: 'blender', term: 'Blender', def: 'Free 3D software. We use it to bend a real leaf photo into a 3D leaf, put it in a scene and photograph it with a virtual camera.' },
  { id: 'hardneg', term: 'Look-alike photo (hard negative)', def: 'A photo that looks like the target but is not. Set 3 has leaves with another disease and an orange rim around the dark lesion, all labelled "no rust".' },
  { id: 'calibration', term: 'Setting the cut-off locally', def: 'Using a small sample of photos from the place where the tool will be used to choose the cut-off.' },
  { id: 'rustcaught', term: 'Rust found, healthy right, phoma right', def: 'Out of 100 leaves of one kind, how many the AI answers correctly. "Rust found" uses leaves with rust. "Healthy right" and "phoma right" use leaves where the right answer is "no rust".' },
  { id: 'severity', term: 'Severity', def: 'BRACOL grades how much of the leaf shows symptoms, from 0 (none) to 4 (most).' },
  { id: 'seed', term: 'Seed', def: 'The random start of a training run. We repeat each run with three seeds to see how much the results move.' },
];

/** Items that live outside the page markup. The markup items are found by [data-pending]. */
export const EXTRA_PENDING = [
  { id: 'v2-arm', title: 'Train with set 2', need: 'Set 2 (1,353 more practice photos) is made but not used in any run yet.' },
  { id: 'agronomist', title: 'Expert check of the labels', need: 'An agronomist should review the Uganda labels. Some look doubtful.' },
];
