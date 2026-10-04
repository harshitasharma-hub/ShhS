// "Rust is orange": hotspots on a real leaf, and a severity ruler tied to what the base model catches.
import { $, $$, h } from '../lib/dom.js';
import { PIPELINE, SEVERITY } from '../data/generated.js';
import { baseRun, cell, agg } from '../lib/stats.js';

export function initRust() {
  const hot = $('#spec-hot');
  const tipBox = $('#spec-tip');
  if (hot && PIPELINE && PIPELINE.lesions) {
    const L = PIPELINE.lesions;
    // Blender UV coordinates start at the bottom, so v is flipped to get the picture position.
    const brown = (L.brown || []).slice(0, 1);
    const nearBrown = (l) => brown.some((b) => Math.hypot(l[0] - b[0], l[1] - b[1]) < 0.07);
    const orange = (L.orange || []).filter((l) => l[2] > 90 && !nearBrown(l)).slice(0, 5);
    const add = (arr, kind) => arr.forEach(([u, v, m]) => {
      const r = Math.max(5, Math.min(10.5, 3.6 + Math.sqrt(m / 1575) * 5.5));
      const li = h('li', { tabindex: '0', 'data-kind': kind, 'aria-label': kind === 'brown' ? 'Brown patch, not rust' : 'Rust spot', style: { '--x': (u * 100).toFixed(1) + '%', '--y': ((1 - v) * 100).toFixed(1) + '%', '--r': r.toFixed(1) + '%' } });
      hot.append(li);
    });
    add(orange, 'orange');
    add(brown, 'brown');
    const say = (kind) => {
      tipBox.classList.toggle('is-brown', kind === 'brown');
      tipBox.replaceChildren(
        h('b', null, kind === 'brown' ? 'Brown patch' : 'Rust spot'),
        h('span', null, kind === 'brown'
          ? 'BRACOL marks leaf miner damage on this leaf. It is not rust, so on its own it would still be a "no".'
          : 'Yellow-orange, often with a pale ring. This is what the "rust" label is about.'));
      $$('li', hot).forEach((x) => x.classList.toggle('is-on', x.dataset.kind === kind && x === document.activeElement));
    };
    hot.addEventListener('pointerover', (e) => { const li = e.target.closest('li'); if (li) say(li.dataset.kind); });
    hot.addEventListener('focusin', (e) => { const li = e.target.closest('li'); if (li) say(li.dataset.kind); });
  }

  // Severity ruler
  const range = $('#sev-range');
  const imgEl = $('#sev-img');
  const val = $('#sev-val');
  const note = $('#sev-note');
  const photo = $('.sev__photo');
  if (!range || !SEVERITY) return;
  const base = baseRun();
  const mix = cell('mix', 100);
  let flip = 0;
  const of100 = (v) => `${Math.round(v * 100)} of 100`;
  const show = () => {
    const k = Number(range.value);
    const list = SEVERITY[String(k)] || [];
    const item = list[flip % Math.max(1, list.length)];
    if (item) { imgEl.style.opacity = '0'; setTimeout(() => { imgEl.src = item.file; imgEl.alt = k === 0 ? 'A healthy coffee leaf' : `A coffee leaf with rust of severity ${k}`; imgEl.style.opacity = '1'; }, 120); }
    val.textContent = k === 0 ? 'Healthy' : `Severity ${k}`;
    const key = k === 1 ? 'sev1' : k === 2 ? 'sev2' : 'sev34';
    if (k === 0) {
      note.textContent = 'A healthy leaf. The right answer is no.';
    } else {
      const b = base && base.bracol ? base.bracol[key] : null;
      const m = agg(mix, 'bracol', key);
      const grade = k === 1 ? 'The mildest rust grade, and the hardest to see.' : k === 2 ? 'Clear spots, still a small share of the leaf.' : 'Rust over a large part of the leaf.';
      note.textContent = `${grade} On the clean test photos, the untrained AI finds ${of100(b)} leaves of severity ${k >= 3 ? '3 and 4' : k}. After training on real and practice photos it finds ${of100(m.mean)}.`;
    }
  };
  range.addEventListener('input', () => { flip = 0; show(); });
  photo.addEventListener('click', () => { flip++; show(); });
  show();
}
