// The dataset: a mosaic of rendered photos you can filter, and the bad photos a safe model must refuse.
import { $, $$, h, int } from '../lib/dom.js';
import { SYNTH, UNUSABLE } from '../data/generated.js';
import { tip } from '../lib/engine.js';

const PRESET_NAMES = { overcast: 'Overcast', sun: 'Sun', golden: 'Golden hour', shade: 'Shade', backlit: 'Backlit', rain: 'Rain', sun_wet: 'Sun after rain', studio: 'Studio' };
const KIND_NAMES = { no_leaf: 'No leaf', tiny: 'Too small', defocus: 'Out of focus', glare: 'Glare', dark: 'Too dark' };

export function initDataset() {
  const root = $('#synth-mosaic');
  if (!root || !SYNTH) return;
  const tiles = SYNTH.tiles.map((t) => ({ ...t, kind: t.preset === 'studio' ? 'studio' : t.mode === 'closeup' ? 'closeup' : 'whole' }));
  root.style.setProperty('--cols', SYNTH.cols);
  const frag = document.createDocumentFragment();
  tiles.forEach((t, i) => {
    const c = i % SYNTH.cols, r = Math.floor(i / SYNTH.cols);
    const el = h('i', { 'data-i': i });
    el.style.backgroundImage = `url(${SYNTH.file})`;
    el.style.backgroundSize = `${SYNTH.cols * 100}% ${SYNTH.rows * 100}%`;
    el.style.backgroundPosition = `${(c / (SYNTH.cols - 1)) * 100}% ${(r / (SYNTH.rows - 1)) * 100}%`;
    frag.append(el);
  });
  root.append(frag);
  const els = $$('i', root);

  // Filters: one choice per group. Click a chosen chip again to clear it.
  const groups = [
    { key: 'label', items: [['rust', 'Rust'], ['none', 'No rust']] },
    { key: 'kind', items: [['whole', 'Whole leaf'], ['closeup', 'Close-up'], ['studio', 'Studio']] },
    { key: 'set', items: [['v1', 'Set 1'], ['v2', 'Set 2']] },
    { key: 'preset', items: Object.entries(PRESET_NAMES).filter(([k]) => k !== 'studio') },
  ];
  const sel = {};
  const bar = $('#synth-filters');
  groups.forEach((g, gi) => {
    if (gi) bar.append(h('span', { class: 'chip-sep', 'aria-hidden': 'true' }));
    g.items.forEach(([val, label]) => bar.append(h('button', { type: 'button', class: 'chip', 'aria-pressed': 'false', 'data-g': g.key, 'data-v': val, onclick: (e) => {
      const b = e.currentTarget;
      sel[g.key] = sel[g.key] === val ? null : val;
      $$(`[data-g="${g.key}"]`, bar).forEach((x) => x.setAttribute('aria-pressed', String(sel[g.key] === x.dataset.v)));
      apply();
    } }, label)));
  });

  const summary = $('#synth-readout');
  const match = (t) => (!sel.label || (sel.label === 'rust') === !!t.rust)
    && (!sel.kind || t.kind === sel.kind) && (!sel.set || t.set === sel.set) && (!sel.preset || t.preset === sel.preset);
  function apply() {
    let n = 0, r = 0;
    tiles.forEach((t, i) => { const ok = match(t); els[i].classList.toggle('is-off', !ok); if (ok) { n++; if (t.rust) r++; } });
    const active = Object.values(sel).some(Boolean);
    summary.replaceChildren(h('span', null, `${int(n)} of ${int(tiles.length)} shown`), h('span', null, h('b', { class: 'r' }, int(r)), ' with rust'), h('span', null, h('b', { class: 'n' }, int(n - r)), ' without'), h('span', null, active ? 'Point at a photo for its label and settings.' : 'The mosaic shows 240 photos from sets 1 and 2.'));
  }
  apply();

  root.addEventListener('pointermove', (e) => {
    const el = e.target.closest('i');
    if (!el) { tip.hide(); return; }
    const t = tiles[Number(el.dataset.i)];
    const label = t.rust ? 'Rust' : t.group === 'healthy' ? 'No rust (healthy)' : t.group === 'other' ? 'No rust (other disease)' : 'No rust';
    tip.show([
      h('b', null, `Practice photo ${t.id}`),
      h('div', { class: 'row' }, h('span', null, 'Label'), h('span', { class: 'v' }, label + (t.rust && t.severity ? `, severity ${t.severity}` : ''))),
      h('div', { class: 'row' }, h('span', null, 'Scene'), h('span', { class: 'v' }, `${PRESET_NAMES[t.preset] || t.preset}, ${t.kind === 'closeup' ? 'close-up' : t.kind}`)),
      h('div', { class: 'row' }, h('span', null, 'Made from leaf'), h('span', { class: 'v' }, `BRACOL #${t.sourceId}`)),
      h('div', { class: 'row' }, h('span', null, 'Size'), h('span', { class: 'v' }, `${t.w} x ${t.h}`)),
    ], e.clientX, e.clientY);
  });
  root.addEventListener('pointerleave', () => tip.hide());

  // Bad photos on purpose
  const row = $('#unusable-row');
  if (row && UNUSABLE) {
    const seen = new Set();
    UNUSABLE.forEach((u) => {
      if (seen.has(u.kind)) return;
      seen.add(u.kind);
      row.append(h('li', null, h('img', { src: u.file, alt: `A deliberately bad photo: ${KIND_NAMES[u.kind] || u.kind}`, loading: 'lazy', decoding: 'async', width: 320, height: 240 }), h('span', null, KIND_NAMES[u.kind] || u.kind)));
    });
  }
}
