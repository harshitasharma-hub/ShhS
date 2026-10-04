// What our data does not cover (the brief scores this), the region plan, and the two drawers: the word list and the to-do list.
import { $, $$, h } from '../lib/dom.js';
import { COVERAGE, LIMITS, BRIEF_RULES, REGION, EXTRA_PENDING, WORDS } from '../content.js';
import { facts, claimMap } from '../lib/claims.js';
import { DIAL_META } from '../data/inline.js';
import { missingRuns, ARM } from '../lib/stats.js';

const STATUS = { full: 'Covered', part: 'Partly covered', none: 'Not covered', unk: 'Not checked' };

export function initLimits() {
  const table = $('#matrix');
  if (table) {
    table.append(
      h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Kind of photo'), COVERAGE.cols.map((c) => h('th', { scope: 'col' }, c.name, h('small', null, c.sub))))),
      h('tbody', null, COVERAGE.rows.map((r) => h('tr', null, h('th', { scope: 'row' }, r.name), r.cells.map((c) => h('td', null, h('span', { class: 'cov', 'data-s': c.s }, h('i'), h('span', { class: 'vh' }, STATUS[c.s] + ': '), c.t)))))));
    table.parentElement.after(h('p', { class: 'matrix-key' },
      ...Object.entries(STATUS).map(([k, v]) => h('span', { class: 'cov', 'data-s': k }, h('i'), v))));
  }
  const list = $('#limits-list');
  if (list) {
    const C = claimMap(facts());
    LIMITS.forEach((l) => {
      const extra = l.claim && C[l.claim] && C[l.claim].ok ? ' ' + C[l.claim].text.replace(/\*/g, '') : '';
      list.append(h('li', { 'data-reveal': '' }, h('b', null, l.h), l.t + extra));
    });
  }
}

/** The brief's five rules, with the mark of the coverage map and one plain sentence each. */
export function initBrief() {
  const ol = $('#rules');
  if (!ol) return;
  const C = claimMap(facts());
  BRIEF_RULES.forEach((r) => {
    const text = r.q ? (C[r.q] && C[r.q].ok ? C[r.q].text.replace(/\*/g, '') : 'The numbers changed since we wrote this line. See the not-sure section.') : r.t;
    ol.append(h('li', { class: 'rule' },
      h('h4', { class: 'rule__q' }, r.rule),
      h('p', { class: 'cov rule__status', 'data-s': r.s }, h('i'), h('span', null, r.label)),
      h('p', { class: 'rule__a' }, text)));
  });
}

export function initRegion() {
  const seg = $('#region-seg'), body = $('#region-body');
  if (!seg || !body) return;
  const packs = { general: REGION.general, highland: REGION.highland, lowland: REGION.yours };
  const strip = ((DIAL_META && DIAL_META.items) || []).filter((i) => i.mode === 'whole').slice(0, 6);
  function show(key) {
    const p = packs[key];
    const kids = [];
    if (key === 'general' && strip.length) kids.push(h('div', { class: 'region__strip', 'aria-label': 'Practice photos from the general pack' }, strip.map((i) => h('img', { src: (i.file_phone || '').includes('/') ? i.file_phone : 'img/dial/' + i.file_phone, alt: '', loading: 'lazy', width: 160, height: 80 }))));
    kids.push(h('p', { class: 'note', style: { margin: '4px 0 6px' } }, p.note));
    p.rows.forEach(([k, v]) => kids.push(h('div', { class: 'knobrow' + (key === 'general' ? '' : ' is-planned') }, h('b', null, k), h('span', null, v))));
    body.replaceChildren(...kids);
  }
  $$('button', seg).forEach((b) => b.addEventListener('click', () => { $$('button', seg).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); show(b.dataset.pack); }));
  show('general');
}

/** The word list and the to-do list. Only one drawer is open at a time. */
export function initDrawers() {
  const wordsD = $('#words-drawer'), pendD = $('#pending-drawer');
  const wordsB = $('#btn-words'), pendB = $('#btn-pending');
  const wl = $('#words-list'), pl = $('#pending-list'), count = $('#pending-count');

  WORDS.forEach((w) => wl.append(h('div', { id: 'w-' + w.id }, h('dt', null, w.term), h('dd', null, w.def))));

  // To-do items: the ones marked in the page, the ones in content.js and the planned runs that are missing
  const seen = new Map();
  $$('[data-pending]').forEach((el) => {
    const id = el.dataset.pending;
    if (seen.has(id)) return;
    const title = (el.querySelector('b') ? el.querySelector('b').textContent : el.textContent).replace(/[.:]$/, '').trim();
    seen.set(id, { id, el, title, need: el.dataset.need || '' });
  });
  EXTRA_PENDING.forEach((e) => seen.set(e.id, { id: e.id, el: null, title: e.title, need: e.need }));
  const miss = missingRuns();
  if (miss.length) {
    const g = {};
    miss.forEach((m) => { const k = (m.arm === 'syn' ? 'Practice photos only' : `${ARM[m.arm].label} ${m.realPct}%`) + (m.rs === 'v3' ? ', set 3' : ''); (g[k] = g[k] || []).push('seed ' + m.seed); });
    seen.set('runs', { id: 'runs', el: $('#bench'), title: `Finish ${miss.length} planned run${miss.length > 1 ? 's' : ''}`, need: Object.entries(g).map(([k, v]) => `${k}: ${v.join(', ')}`).join('. ') });
  }
  const items = [...seen.values()];
  count.textContent = String(items.length);
  items.forEach((it) => pl.append(h('li', null, h('button', { type: 'button', onclick: () => go(it) }, h('b', null, it.title), h('span', null, it.need)))));

  function go(it) {
    close(pendD, pendB);
    if (it.el) {
      const det = it.el.closest('details');
      if (det) det.open = true;
      it.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      it.el.classList.remove('is-flash'); void it.el.offsetWidth; it.el.classList.add('is-flash');
    }
  }
  function open(d, b) {
    [[wordsD, wordsB], [pendD, pendB]].forEach(([od, ob]) => { if (od !== d) close(od, ob); });
    d.hidden = false;
    b.setAttribute('aria-expanded', 'true');
  }
  function close(d, b) { d.hidden = true; b.setAttribute('aria-expanded', 'false'); }
  const toggle = (d, b) => (d.hidden ? open(d, b) : close(d, b));

  wordsB.addEventListener('click', () => toggle(wordsD, wordsB));
  pendB.addEventListener('click', () => toggle(pendD, pendB));
  $$('[data-close]').forEach((b) => b.addEventListener('click', () => {
    const w = b.dataset.close === 'words';
    close(w ? wordsD : pendD, w ? wordsB : pendB);
    (w ? wordsB : pendB).focus();
  }));
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!wordsD.hidden) { close(wordsD, wordsB); wordsB.focus(); }
    if (!pendD.hidden) { close(pendD, pendB); pendB.focus(); }
  });

  // A dotted word in the text opens the list at that word
  $$('.term').forEach((t) => t.addEventListener('click', () => {
    open(wordsD, wordsB);
    const id = t.dataset.term;
    const row = id ? $('#w-' + id) : null;
    if (row) {
      row.scrollIntoView({ block: 'center' });
      row.classList.remove('is-flash'); void row.offsetWidth; row.classList.add('is-flash');
    }
  }));
}
