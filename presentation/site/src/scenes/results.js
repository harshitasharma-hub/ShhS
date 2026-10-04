// Results: the four versions, the explorer (three charts that follow one test-set switch, plus a table twin),
// and an honest reading of what the numbers do and do not show.
import { $, $$, h, s as svgEl, int, mean, sd } from '../lib/dom.js';
import { ARMS, ARM, V3_ARMS, V4_ARMS, SETS, FRACTIONS, cell, baseRun, agg, get, missingRuns, RUN_COUNT, hasRuns, seedsOf } from '../lib/stats.js';
import { scale, ticks, svgRoot, marker, fit, spreadLabels } from '../lib/charts.js';
import { facts, claimMap, fmt3 } from '../lib/claims.js';
import { COUNTS } from '../data/generated.js';
import { V3 } from '../data/v3.js';
import { tip } from '../lib/engine.js';
import { rich } from './summary.js';

let set = 'bracol';

function niceDomain(values, floor = 0, ceil = 1) {
  const v = values.filter((x) => x != null && !Number.isNaN(x));
  if (!v.length) return [0.9, 1, 0.02];
  const mn = Math.min(...v), mx = Math.max(...v);
  const span = mx - mn;
  // Pick the smallest round step that keeps the axis to about six ticks.
  const step = [0.005, 0.01, 0.02, 0.05, 0.1].find((s) => (span * 1.3 + 0.01) / s <= 6) || 0.1;
  let lo = Math.floor((mn - span * 0.12 - 0.004) / step) * step;
  let hi = Math.ceil((mx + span * 0.12 + 0.004) / step) * step;
  lo = Math.max(floor, lo); hi = Math.min(ceil, hi);
  return [Math.round(lo * 1000) / 1000, Math.round(hi * 1000) / 1000, step];
}

// Every row of the explorer: the four versions, then the same two 3D versions taught with set 3 and with set 4
const ROWS = [...ARMS.map((a) => ({ ...a, rs: 'v1', mark: { zeroshot: 'ring', real: 'circle', syn: 'diamond', mix: 'circle' }[a.key] })), ...V3_ARMS, ...V4_ARMS].filter((a) => a.rs === 'v1' || cell(a.key, 100, 140, a.rs).length);
const runsOf = (a) => cell(a.key, 100, 140, a.rs);
const rowOf = (key, rs) => ROWS.find((a) => a.key === key && a.rs === rs) || null;
const markOf = (a) => a.mark;

/* ---------- The four versions ---------- */
function renderArms() {
  const root = $('#arms');
  if (!root) return;
  ARMS.forEach((a) => {
    const list = cell(a.key, 100);
    const photos = a.key === 'zeroshot' ? 0 : (list[0] && list[0].trainPhotos) || 0;
    root.append(h('div', { class: `arm arm--${a.cls}` },
      h('h4', null, a.label), h('p', null, a.blurb),
      h('div', { class: 'arm__n' }, h('span', null, `${int(photos)} training photos`), h('span', null, a.key === 'zeroshot' ? 'no training run' : `${list.length} runs`))));
  });
  const note = $('#arms-v3');
  if (note) {
    const n3 = cell('mix', 100, 140, 'v3').length, n4 = cell('mix', 100, 140, 'combo').length;
    const parts = [];
    if (n3) parts.push(`set 3, which swaps in ${int(V3.newHardNegatives)} look-alike photos (${n3} runs of "both together")`);
    if (n4) parts.push(`set 4, which keeps all of set 1 and adds the look-alikes (${n4} runs)`);
    note.textContent = parts.length ? `Later we ran the two practice-photo versions again with ${parts.join(' and with ')}. They appear as "set 3" and "set 4".` : '';
  }
  const legend = $('#arms-legend');
  legend.replaceChildren(...ROWS.map((a) => h('span', { style: { '--k': a.color } }, h('i', { class: a.mark === 'diamond' ? 'dm' : a.mark === 'ring' ? 'ring' : a.mark === 'square' ? 'sq' : a.mark === 'triangle' ? 'tri' : '' }), a.label)));
}

/* ---------- 1. Ranking score (AUC) ---------- */
function drawLadder(W) {
  const plot = $('#ladder-plot');
  const rows = ROWS.map((a) => {
    const list = runsOf(a);
    const vals = list.map((r) => get(r, set, 'auc')).filter((v) => v != null);
    return { a, list, vals, m: vals.length ? mean(vals) : null, d: sd(vals) };
  });
  const [lo, hi, step] = niceDomain(rows.flatMap((r) => r.vals).concat(set === 'kenya' ? [0.5] : []));
  const left = Math.min(168, W * 0.34), right = 54, top = 14, rowH = 52, H = top + rowH * rows.length + 44;
  const x = scale(lo, hi, left, W - right);
  const svg = svgRoot(W, H, `Ranking score, AUC, on ${SETS[set].long}, for six versions of the AI.`);
  const grid = svgEl('g', { class: 'grid' });
  ticks(lo, hi, step).forEach((v) => { grid.append(svgEl('line', { x1: x(v), x2: x(v), y1: top, y2: H - 36 })); svg.append(svgEl('text', { x: x(v), y: H - 18, 'text-anchor': 'middle' }, v.toFixed(step < 0.1 ? 2 : 1))); });
  svg.prepend(grid);
  svg.append(svgEl('text', { x: (left + W - right) / 2, y: H - 2, 'text-anchor': 'middle' }, 'Ranking score (AUC), higher is better'));
  if (set === 'kenya' && lo < 0.5 && hi > 0.5) {
    svg.append(svgEl('line', { class: 'ref', x1: x(0.5), x2: x(0.5), y1: top, y2: H - 36 }));
    svg.append(svgEl('text', { x: x(0.5) + 5, y: top + 10 }, 'coin flip'));
  }
  rows.forEach((r, i) => {
    const y = top + i * rowH + rowH / 2;
    svg.append(svgEl('line', { class: 'ref', x1: left, x2: W - right, y1: y, y2: y, style: 'stroke:var(--line);stroke-width:1' }));
    svg.append(svgEl('text', { x: 0, y: y - 1, class: 't-strong' }, r.a.label));
    svg.append(svgEl('text', { x: 0, y: y + 13 }, r.a.key === 'zeroshot' ? 'No training' : `${r.vals.length} run${r.vals.length === 1 ? '' : 's'}`));
    if (!r.vals.length) { svg.append(svgEl('text', { x: left + 6, y: y + 4 }, 'no result on this set')); return; }
    r.vals.forEach((v, k) => svg.append(marker(markOf(r.a), x(v), y + (k - (r.vals.length - 1) / 2) * 4.5, r.a.color, 5.5)));
    svg.append(svgEl('line', { x1: x(r.m), x2: x(r.m), y1: y - 16, y2: y + 16, style: `stroke:${r.a.color};stroke-width:2.5;stroke-linecap:round` }));
    svg.append(svgEl('text', { x: x(Math.max(...r.vals)) + 14, y: y + 4, class: 't-strong' }, fmt3(r.m)));
    const hit = svgEl('rect', { class: 'hit', x: 0, y: y - rowH / 2, width: W, height: rowH });
    hit.addEventListener('pointermove', (e) => tip.show([
      h('b', null, r.a.label),
      h('div', { class: 'row' }, h('span', null, 'Mean AUC'), h('span', { class: 'v' }, fmt3(r.m) + (r.vals.length > 1 ? ' +/- ' + r.d.toFixed(3) : ''))),
      ...r.list.map((run) => h('div', { class: 'row' }, h('span', null, run.name), h('span', { class: 'v' }, fmt3(get(run, set, 'auc'))))),
    ], e.clientX, e.clientY));
    hit.addEventListener('pointerleave', () => tip.hide());
    svg.append(hit);
  });
  plot.replaceChildren(svg);
}

/* ---------- 2. Fewer real photos ---------- */
function drawScarcity(W) {
  const plot = $('#scarcity-plot');
  const base = baseRun();
  const baseV = get(base, set, 'auc');
  const pts = (arm, rs, fr) => fr.map((f) => ({ f, list: cell(arm, f, 140, rs) })).map((p) => ({ ...p, vals: p.list.map((r) => get(r, set, 'auc')).filter((v) => v != null) })).map((p) => ({ ...p, m: p.vals.length ? mean(p.vals) : null }));
  const series = [
    { a: rowOf('real', 'v1'), pts: pts('real', 'v1', FRACTIONS), dash: false },
    { a: rowOf('mix', 'v1'), pts: pts('mix', 'v1', FRACTIONS), dash: false },
    { a: rowOf('mix', 'v3'), pts: pts('mix', 'v3', [10, 100]), dash: true },
    { a: rowOf('mix', 'combo'), pts: pts('mix', 'combo', [100]), dash: false },
  ].filter((s) => s.a && s.pts.some((p) => p.m != null));
  // Practice photos only sit at "0% real photos"
  const synRows = [[rowOf('syn', 'v1'), -10], [rowOf('syn', 'v3'), 18], [rowOf('syn', 'combo'), 36]].filter(([a]) => a)
    .map(([a, dy]) => ({ a, dy, vals: runsOf(a).map((r) => get(r, set, 'auc')).filter((v) => v != null) })).filter((r) => r.vals.length);
  const allVals = [baseV, ...synRows.flatMap((r) => r.vals), ...series.flatMap((s) => s.pts.flatMap((p) => p.vals))].filter((v) => v != null);
  const [lo, hi, step] = niceDomain(allVals);
  const m = { l: 44, r: Math.min(136, W * 0.28), t: 20, b: 52 };
  const H = Math.round(Math.max(300, W * 0.62));
  const slots = [0, ...FRACTIONS];
  const xs = scale(0, slots.length - 1, m.l + 10, W - m.r);
  const y = scale(lo, hi, H - m.b, m.t);
  const svg = svgRoot(W, H, `Ranking score against the share of real photos used, on ${SETS[set].long}.`);
  const grid = svgEl('g', { class: 'grid' });
  ticks(lo, hi, step).forEach((v) => { grid.append(svgEl('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) })); svg.append(svgEl('text', { x: m.l - 8, y: y(v) + 4, 'text-anchor': 'end' }, v.toFixed(step < 0.1 ? 2 : 1))); });
  svg.prepend(grid);
  svg.append(svgEl('g', { class: 'axis' }, svgEl('line', { x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b })));
  slots.forEach((f, i) => svg.append(svgEl('text', { x: xs(i), y: H - m.b + 18, 'text-anchor': 'middle' }, f === 0 ? '0' : String(f))));
  svg.append(svgEl('text', { x: (m.l + W - m.r) / 2, y: H - 6, 'text-anchor': 'middle' }, 'Real training photos used, % of 1,225'));
  if (baseV != null) {
    svg.append(svgEl('line', { class: 'ref', x1: m.l, x2: W - m.r, y1: y(baseV), y2: y(baseV) }));
    svg.append(svgEl('text', { x: m.l + 8, y: y(baseV) - 7, class: 't-strong' }, `Untrained ${fmt3(baseV)}`));
  }
  const ends = [];
  series.forEach((s) => {
    const have = s.pts.filter((p) => p.m != null);
    const line = have.map((p) => [xs(slots.indexOf(p.f)), y(p.m)]);
    if (line.length > 1) svg.append(svgEl('path', { class: 'ln', d: line.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(''), style: `stroke:${s.a.color}${s.dash ? ';stroke-dasharray:7 5' : ''}` }));
    have.forEach((p) => p.vals.forEach((v) => svg.append(svgEl('circle', { cx: xs(slots.indexOf(p.f)), cy: y(v), r: 3.6, style: `fill:${s.a.color};opacity:.4` }))));
    have.forEach((p) => svg.append(marker(markOf(s.a), xs(slots.indexOf(p.f)), y(p.m), s.a.color, 6)));
    const last = have[have.length - 1];
    if (last) ends.push({ a: s.a, x: xs(slots.indexOf(last.f)), y: y(last.m), v: last.m });
  });
  spreadLabels(ends, 17);
  ends.forEach((e) => {
    svg.append(svgEl('line', { x1: e.x + 8, x2: W - m.r + 6, y1: e.y, y2: e.ly, style: `stroke:${e.a.color};stroke-width:1.2` }));
    svg.append(svgEl('text', { x: W - m.r + 10, y: e.ly + 4, class: 't-strong' }, `${e.a.short} ${fmt3(e.v)}`));
  });
  const synEnds = synRows.map(({ vals, a }) => ({ a, vals, v: mean(vals), y: y(mean(vals)) }));
  spreadLabels(synEnds, 16);
  synEnds.forEach((e) => {
    e.vals.forEach((v) => svg.append(svgEl('circle', { cx: xs(0), cy: y(v), r: 3.6, style: `fill:${e.a.color};opacity:.4` })));
    svg.append(marker(markOf(e.a), xs(0), e.y, e.a.color, 6));
    svg.append(svgEl('text', { x: xs(0) + 14, y: e.ly + 4, class: 't-strong' }, `${e.a.short} ${fmt3(e.v)}`));
  });
  const xh = svgEl('line', { class: 'xhair', y1: m.t, y2: H - m.b });
  const hit = svgEl('rect', { class: 'hit', x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b });
  svg.append(xh, hit);
  const chart = $('#chart-scarcity');
  hit.addEventListener('pointermove', (e) => {
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    let k = 0, best = 1e9;
    slots.forEach((_, i) => { const d = Math.abs(xs(i) - px); if (d < best) { best = d; k = i; } });
    xh.setAttribute('x1', xs(k)); xh.setAttribute('x2', xs(k));
    chart.classList.add('is-hover');
    const f = slots[k];
    const rows = [];
    if (f === 0) synRows.forEach((r) => rows.push([r.a, r.vals]));
    else series.forEach((s) => { const p = s.pts.find((q) => q.f === f); if (p && p.m != null) rows.push([s.a, p.vals]); });
    tip.show([
      h('b', null, f === 0 ? 'No real photos' : `${f}% of the real photos`),
      ...rows.filter(([, v]) => v.length).map(([a, vals]) => h('div', { class: 'row', style: { '--k': a.color } }, h('span', null, h('i'), a.label), h('span', { class: 'v' }, fmt3(mean(vals)) + (vals.length > 1 ? ` (${vals.length} runs)` : ' (1 run)')))),
      baseV != null ? h('div', { class: 'row', style: { '--k': 'var(--ink-3)' } }, h('span', null, h('i'), 'Untrained'), h('span', { class: 'v' }, fmt3(baseV))) : null,
    ].filter(Boolean), e.clientX, e.clientY);
  });
  hit.addEventListener('pointerleave', () => { chart.classList.remove('is-hover'); tip.hide(); });
  plot.replaceChildren(svg);
}

/* ---------- 3. Right answers, by kind of photo ---------- */
function drawRows(W) {
  const plot = $('#severity-plot');
  const title = $('#severity-title');
  const foot = $('#severity-foot');
  const sv = (COUNTS && COUNTS.bracolSeverityTest) || {};
  const spec = set === 'bracol'
    ? { title: '3. Right answers, and rust found by how bad the rust is', rows: [['Right answers, all photos', 'acc'], ['Mildest rust, severity 1', 'sev1'], ['Severity 2', 'sev2'], ['Severity 3 and 4', 'sev34']], foot: `Right answers use the cut-off picked on validation photos. Rust found is the share of rust leaves answered "rust". The test set has ${sv['1'] || '?'} leaves of severity 1, ${sv['2'] || '?'} of severity 2, and ${(sv['3'] || 0) + (sv['4'] || 0)} of severity 3 and 4.` }
    : set === 'uganda'
      ? { title: '3. Right answers, by kind of leaf', rows: [['Right answers, all photos', 'acc'], ['Rust found', 'sens'], ['Healthy leaves, right', 'healthyOk'], ['Phoma leaves, right', 'otherOk']], foot: 'The cut-off was set on clean BRACOL validation photos. Nothing was tuned on these photos. Phoma is a different coffee leaf disease, so the right answer for it is "no rust". Severity labels exist only for BRACOL.' }
      : { title: '3. Right answers, rust found, and no-rust photos answered "no"', rows: [['Right answers, all photos', 'acc'], ['Rust found', 'sens'], ['No rust, answered "no"', 'spec']], foot: 'The cut-off was set on clean BRACOL validation photos. Nothing was tuned on these photos. Severity labels exist only for BRACOL.' };
  title.textContent = spec.title;
  foot.textContent = spec.foot;
  const entries = spec.rows.map(([label, key]) => ({
    label, key,
    pts: ROWS.map((a) => { const list = runsOf(a); const vals = list.map((r) => get(r, set, key)).filter((v) => v != null); return { a, list, vals, m: vals.length ? mean(vals) : null, d: sd(vals) }; }),
  }));
  const all = entries.flatMap((e) => e.pts.flatMap((p) => p.vals));
  const [lo0] = niceDomain(all, 0, 1);
  const lo = Math.max(0, Math.min(lo0, 0.5)), hi = 1, step = hi - lo > 0.35 ? 0.1 : 0.05;
  const left = Math.min(168, W * 0.32), right = 24, top = 12, rowH = 62, H = top + rowH * entries.length + 46;
  const x = scale(lo, hi, left, W - right);
  const svg = svgRoot(W, H, spec.title + ` on ${SETS[set].long}.`);
  const grid = svgEl('g', { class: 'grid' });
  ticks(lo, hi, step).forEach((v) => { grid.append(svgEl('line', { x1: x(v), x2: x(v), y1: top, y2: H - 38 })); svg.append(svgEl('text', { x: x(v), y: H - 20, 'text-anchor': 'middle' }, Math.round(v * 100))); });
  svg.prepend(grid);
  svg.append(svgEl('text', { x: (left + W - right) / 2, y: H - 3, 'text-anchor': 'middle' }, 'Out of 100'));
  entries.forEach((e, i) => {
    const y = top + i * rowH + rowH / 2;
    svg.append(svgEl('line', { x1: left, x2: W - right, y1: y, y2: y, style: 'stroke:var(--line);stroke-width:1' }));
    const words = e.label.split(', ');
    words.forEach((wd, k) => svg.append(svgEl('text', { x: 0, y: y + (k - (words.length - 1) / 2) * 15 + 4, class: k === 0 ? 't-strong' : '' }, wd)));
    e.pts.forEach((p) => { if (p.m != null) svg.append(marker(markOf(p.a), x(p.m), y, p.a.color, 6.5)); });
    const have = e.pts.filter((p) => p.m != null);
    if (have.length) {
      const lowP = have.reduce((p, q) => (q.m < p.m ? q : p)), highP = have.reduce((p, q) => (q.m > p.m ? q : p));
      [lowP, highP].forEach((p, k) => { if (k === 1 && highP === lowP) return; svg.append(svgEl('text', { x: x(p.m), y: y - 14, 'text-anchor': 'middle', class: 't-strong' }, Math.round(p.m * 100))); });
    }
    const hit = svgEl('rect', { class: 'hit', x: 0, y: y - rowH / 2, width: W, height: rowH });
    hit.addEventListener('pointermove', (ev) => tip.show([
      h('b', null, e.label),
      ...e.pts.filter((p) => p.m != null).map((p) => h('div', { class: 'row', style: { '--k': p.a.color } }, h('span', null, h('i'), p.a.label), h('span', { class: 'v' }, (p.m * 100).toFixed(1) + (p.vals.length > 1 ? ` +/- ${(p.d * 100).toFixed(1)}` : '')))),
    ], ev.clientX, ev.clientY));
    hit.addEventListener('pointerleave', () => tip.hide());
    svg.append(hit);
  });
  plot.replaceChildren(svg);
}

/* ---------- Table twin ---------- */
function renderTable() {
  const wrap = $('#results-table');
  const rows = [];
  const push = (label, list) => { if (list.length) rows.push({ label, list }); };
  push('Untrained AI', cell('zeroshot'));
  FRACTIONS.forEach((f) => push(`Real photos ${f}%`, cell('real', f)));
  push('Practice photos only', cell('syn', 0));
  FRACTIONS.forEach((f) => push(`Both together ${f}%`, cell('mix', f)));
  push('Practice only, set 3', cell('syn', 0, 140, 'v3'));
  [10, 100].forEach((f) => push(`Both, set 3, ${f}%`, cell('mix', f, 140, 'v3')));
  push('Practice only, set 4', cell('syn', 0, 140, 'combo'));
  push('Both, set 4, 100%', cell('mix', 100, 140, 'combo'));
  const cols = [['AUC', 'auc'], ['Right', 'acc'], ['Rust found', 'sens'], ['No rust, right', 'spec']];
  const head = ['Version', 'Runs', ...[].concat(...Object.values(SETS).map((s) => cols.map((c) => `${s.label} ${c[0]}`)))];
  const fmtv = (v, key) => (v == null ? '-' : key === 'auc' ? v.toFixed(3) : (v * 100).toFixed(1));
  const t = h('table', null,
    h('thead', null, h('tr', null, head.map((c) => h('th', { scope: 'col' }, c)))),
    h('tbody', null, rows.map((r) => h('tr', null, h('td', null, r.label), h('td', null, String(r.list.length)),
      ...Object.keys(SETS).flatMap((sk) => cols.map(([, key]) => { const a = agg(r.list, sk, key); return h('td', null, a.n ? fmtv(a.mean, key) : '-'); }))))));
  wrap.replaceChildren(t);
}

/* ---------- Text that follows the data ---------- */
function paintSays(F, C) {
  const el = $('#bench-says');
  const b = F.bracol, u = F.uganda;
  if (set === 'bracol') {
    rich(el, `On clean photos the ranking score goes from *${fmt3(b.base.auc)}* with no training to *${fmt3(b.real.auc.mean)}* with real photos, *${fmt3(b.syn.auc.mean)}* with practice photos only and *${fmt3(b.mix.auc.mean)}* with both.${C['clean-every-size'].ok ? ' Adding practice photos scored higher at every data size.' : ''}`);
  } else if (set === 'uganda') {
    rich(el, `${C['field-close'].ok ? C['field-close'].text : `Ranking score on real farm photos: untrained ${fmt3(u.base.auc)}, real ${fmt3(u.real.auc.mean)}, practice only ${fmt3(u.syn.auc.mean)}, both ${fmt3(u.mix.auc.mean)}.`} Set 3 scores lower (*${fmt3(u.v3.mix.auc.mean)}* for both together).${u.v4.mix.n ? ` Set 4 scores *${fmt3(u.v4.mix.auc.mean)}*.` : ''}`);
  } else {
    rich(el, C['kenya-weak'].ok ? 'These photos are only 128 pixels and their colours look shifted. Every version scores *poorly*. We keep them in as a stress test, not as a result.' : 'Stress test on small photos with shifted colours. Read the numbers with care.');
  }
}

function paintHonest(F, C) {
  const yes = $('#honest-yes'), no = $('#honest-no');
  const li = (txt) => { const el = h('li'); rich(el, txt); return el; };
  const yesItems = [];
  if (C['clean-train'].ok) yesItems.push(C['clean-train'].text);
  if (C['clean-syn'].ok) yesItems.push(C['clean-syn'].text + ' The practice photos still start from real leaf textures.');
  if (C['clean-both'].ok) yesItems.push(C['clean-both'].text);
  if (C['field-rust-caught'].ok) yesItems.push(C['field-rust-caught'].text);
  if (C['v4-better'].ok) yesItems.push(C['v4-better'].text);
  if (C['cal-100'].ok) yesItems.push(C['cal-100'].text);
  const noItems = [];
  if (C['field-no-gain'].ok) noItems.push('That practice photos give better answers on real farm photos. ' + C['field-no-gain'].text);
  if (C['field-phoma'].ok) noItems.push('That they stay quiet on other diseases. ' + C['field-phoma'].text);
  if (C['v3-moved'].ok) noItems.push('That set 3 works. ' + C['v3-moved'].text);
  if (C['v4-trade'].ok) noItems.push('That set 4 beats real photos alone. ' + C['v4-trade'].text);
  noItems.push('Anything about a phone. There is no Android build yet, so size, speed and the score after conversion are unknown.');
  noItems.push('That set 2 or a region-matched pack helps. Both are untested.');
  noItems.push('A number for Noor\'s region. We have no photos from there.');
  yes.replaceChildren(...yesItems.map(li));
  no.replaceChildren(...noItems.map(li));
}

function paintRunsNote() {
  const el = $('#runs-note');
  if (!el) return;
  const miss = missingRuns();
  const fewer = [];
  [['Practice only, set 4', 'syn', 0], ['Both, set 4', 'mix', 100]].forEach(([name, arm, f]) => { const n = seedsOf(arm, f, 'combo').length; if (n && n < 3) fewer.push(`${name} (${n} runs, not 3)`); });
  const tail = fewer.length ? ` Fewer than three runs: ${fewer.join(', ')}.` : '';
  if (!miss.length) { el.textContent = `${RUN_COUNT} runs counted. Every planned run is in.${tail}`; return; }
  const groups = {};
  miss.forEach((m) => { const k = (m.arm === 'syn' ? 'Practice photos only' : `${ARM[m.arm].label} ${m.realPct}%`) + (m.rs === 'v3' ? ', set 3' : ''); (groups[k] = groups[k] || []).push('seed ' + m.seed); });
  el.textContent = `${RUN_COUNT} runs counted. Still running: ` + Object.entries(groups).map(([k, v]) => `${k} (${v.join(', ')})`).join('; ') + '.' + tail;
}

/* ---------- Boot ---------- */
export function initResults() {
  if (!$('#results')) return;
  const F = facts();
  const C = claimMap(F);
  renderArms();
  renderTable();
  paintHonest(F, C);
  paintRunsNote();
  const redraw = [];
  redraw.push(fit($('#ladder-plot'), drawLadder));
  redraw.push(fit($('#scarcity-plot'), drawScarcity));
  redraw.push(fit($('#severity-plot'), drawRows));
  const all = () => { redraw.forEach((fn) => fn()); paintSays(F, C); };
  all();
  $$('#bench-set [data-set]').forEach((b) => b.addEventListener('click', () => {
    set = b.dataset.set;
    $$('#bench-set [data-set]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    all();
  }));
  const tbtn = $('#table-toggle'), twrap = $('#results-table');
  tbtn.addEventListener('click', () => {
    const open = twrap.hidden;
    twrap.hidden = !open;
    tbtn.setAttribute('aria-expanded', String(open));
    tbtn.textContent = open ? 'Hide the table' : 'Show the numbers as a table';
  });
}
