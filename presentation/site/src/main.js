// ShhS, "Does this leaf have rust?" Page boot.
import { bindText, f2 } from './lib/dom.js';
import { initMotion, initReveals, initNav, initKeys } from './lib/engine.js';
import { COUNTS, SHORTCUT } from './data/generated.js';
import { V3 } from './data/v3.js';
import { DEMO } from './data/demo.js';
import { initHero } from './scenes/hero.js';
import { initSummary } from './scenes/summary.js';
import { initRust } from './scenes/rust.js';
import { initGap } from './scenes/gap.js';
import { initPipeline } from './scenes/pipeline.js';
import { initDial } from './scenes/dial.js';
import { initDataset } from './scenes/dataset.js';
import { initModel } from './scenes/model.js';
import { initResults } from './scenes/results.js';
import { initAnswers } from './scenes/answers.js';
import { initTryit } from './scenes/tryit.js';
import { initNotSure } from './scenes/notsure.js';
import { initLimits, initBrief, initRegion, initDrawers } from './scenes/limits.js';

function safe(name, fn) {
  try { fn(); } catch (e) { console.error(`[shhs] ${name} failed`, e); }
}

function boot() {
  safe('motion', initMotion);
  safe('reveals', initReveals);
  safe('nav', initNav);

  // Numbers from the files, so the copy cannot drift from the data
  const c = COUNTS || {};
  const synth = c.synthetic || {};
  safe('bind', () => bindText(document, {
    n: { bracol: c.bracol || {}, uganda: c.uganda || {}, textures: c.textures || {}, synthetic: { ...synth, both: (synth.v1 || 0) + (synth.v2 || 0), all: (synth.v1 || 0) + (synth.v2 || 0) + (V3.newHardNegatives || 0) } },
    v3: { newHardNegatives: V3.newHardNegatives, copiedFromV1: V3.copiedFromV1 },
    demo: { pool: DEMO.pool },
    shortcut: { bracol: { auc: SHORTCUT ? f2(SHORTCUT.bracol.auc) : null }, synthetic: { auc: SHORTCUT ? f2(SHORTCUT.synthetic.auc) : null } },
  }));

  safe('hero', initHero);
  safe('summary', initSummary);
  safe('rust', initRust);
  safe('gap', initGap);
  safe('pipeline', initPipeline);
  safe('dial', initDial);
  safe('dataset', initDataset);
  safe('model', initModel);
  safe('results', initResults);
  safe('answers', initAnswers);
  safe('notsure', initNotSure);
  safe('tryit', initTryit);
  safe('brief', initBrief);
  safe('limits', initLimits);
  safe('region', initRegion);
  safe('drawers', initDrawers);   // last: it lists the to-do items and wires every dotted word
  safe('keys', initKeys);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
