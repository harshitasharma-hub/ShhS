// One leaf, eight scenes: real Blender renders of the same leaf, raw and with phone flaws. The label never changes.
import { $, $$, h } from '../lib/dom.js';
import { DIAL_META } from '../data/inline.js';
import { ENVS, ENV_NAMES } from './pipeline.js';

const fix = (p) => (p && p.includes('/') ? p : 'img/dial/' + p);

export function initDial() {
  const root = $('#dial');
  const items = ((DIAL_META && DIAL_META.items) || []).filter((i) => i.mode === 'whole');
  if (!items.length) { root.hidden = true; return; }
  const byPreset = Object.fromEntries(items.map((i) => [i.preset, i]));
  const presets = ENVS.filter((p) => byPreset[p]);
  const raw = $('#dial-raw'), phone = $('#dial-phone'), facts = $('#dial-facts'), chips = $('#dial-chips');
  let cur = presets[0];

  // Load the other pictures in the background, once the section is close
  const preload = () => items.forEach((it) => { const a = new Image(); a.src = fix(it.file_raw); const b = new Image(); b.src = fix(it.file_phone); });
  new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { preload(); io.disconnect(); } }, { rootMargin: '600px' }).observe(root);

  function show(p) {
    cur = p;
    const it = byPreset[p];
    $$('button', chips).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.p === p)));
    raw.src = fix(it.file_raw);
    raw.alt = `The same coffee leaf with rust, rendered in Blender in the ${ENV_NAMES[p].toLowerCase()} scene`;
    phone.src = fix(it.file_phone);
    phone.alt = `The same render in the ${ENV_NAMES[p].toLowerCase()} scene, with phone flaws added`;
    const m = it.meta || {};
    const bits = [`Scene: ${ENV_NAMES[p].toLowerCase()}`];
    if (m.exposure_ev != null) bits.push(`exposure ${m.exposure_ev >= 0 ? '+' : ''}${m.exposure_ev} EV`);
    if (m.lens_mm) bits.push(`lens ${m.lens_mm} mm${m.fstop ? ' f/' + m.fstop : ''}`);
    if (it.render_s != null) bits.push(`this picture took ${it.render_s} seconds to render`);
    facts.textContent = bits.join(', ') + '.';
  }

  presets.forEach((p) => chips.append(h('button', { type: 'button', class: 'chip', 'data-p': p, 'aria-pressed': 'false', onclick: () => show(p) }, ENV_NAMES[p])));
  show(cur);
}
