// The guardrail: a band around the cut-off where the AI says "not sure". Real scores, a live trade-off.
import { $, $$, h, s as svgEl, int } from '../lib/dom.js';
import { SCORES, CALIBRATION } from '../data/generated.js';
import { facts, claimMap } from '../lib/claims.js';
import { MODELS, quantile, marginFor } from '../lib/verdict.js';
import { scale, ticks, svgRoot, fit, tableTwin } from '../lib/charts.js';
import { tip } from '../lib/engine.js';
import { rich } from './summary.js';

const pct = (v) => (v == null || Number.isNaN(v) ? 'n/a' : Math.round(v * 100) + '%');

/** How the project sets the band, on clean photos and on local photos, with the whole table behind it. */
function initRule() {
  const box = $('#ns-rule');
  if (!box) return;
  const C = claimMap(facts());
  const put = (id, claim) => { const el = $(id); if (!el) return; if (C[claim].ok) rich(el, C[claim].text); else el.textContent = 'The numbers changed since we wrote this line. Read the table.'; };
  put('#ns-rule-bracol', 'ns-bracol');
  put('#ns-rule-local', 'ns-local');
  const rows = (CALIBRATION && CALIBRATION.whole) || [];
  if (!rows.length) return;
  const name = (r) => {
    const set = r.arm.endsWith('-combo') ? ', set 4' : r.arm.endsWith('-v3') ? ', set 3' : '';
    const base = r.arm.replace(/-(combo|v3)$/, '');
    if (base === 'zeroshot') return 'Untrained AI';
    if (base === 'real') return `Real photos, ${r.realPct}%`;
    if (base === 'syn') return `Practice photos only${set}`;
    return `Both together, ${r.realPct}%${set}`;
  };
  const pc = (v) => (v == null ? '-' : (v * 100).toFixed(1));
  const body = rows.map((r) => [name(r), pc(r.accBracolCut), pc(r.accFieldCut), pc(r.answers), pc(r.right)]);
  const table = tableTwin(['Version', 'Right, clean-photo cut-off', 'Right, local cut-off', 'Answers', 'Right when it answers'], body, 'Show every version as a table');
  const dash = rows.some((r) => r.right == null);
  $('#ns-rule-table').replaceChildren(table, ...(dash ? [h('p', { class: 'note' }, 'A dash means no band reached 95% on the local photos, so the rule would say "not sure" every time. Numbers are out of 100 test photos from Uganda.')] : [h('p', { class: 'note' }, 'Numbers are out of 100 test photos from Uganda.')]));
}

export function initNotSure() {
  initRule();
  const root = $('#notsure');
  if (!root || !SCORES || !SCORES.mix) return;
  let model = 'mix', set = 'bracolTest';
  const range = $('#ns-range'), val = $('#ns-val'), out = $('#ns-out'), plot = $('#band-plot'), answer = $('#ns-answer');
  const modelSeg = $('#ns-model');
  const phomaKey = $('.lg--phoma', $('#band-legend'));
  const models = MODELS.filter((m) => SCORES[m.key]);
  models.forEach((m) => modelSeg.append(h('button', { type: 'button', 'aria-pressed': String(m.key === model), 'data-m': m.key, onclick: () => { model = m.key; $$('button', modelSeg).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.m === model))); redraw(); } }, m.short || m.name)));
  $$('#ns-set [data-set]').forEach((b) => b.addEventListener('click', () => { set = b.dataset.set; $$('#ns-set [data-set]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); redraw(); }));
  range.addEventListener('input', () => redraw());
  range.setAttribute('aria-describedby', 'ns-answer ns-out');

  const widthWord = (v) => (v <= 0 ? 'No band' : v <= 25 ? 'Narrow' : v <= 60 ? 'Medium' : 'Wide');

  function draw(W) {
    const m = SCORES[model];
    const rows = m && m[set];
    if (!rows) { plot.textContent = 'No scores for this version on this set.'; return; }
    const farm = set === 'ugandaAll';
    phomaKey.hidden = !farm;
    const share = (Number(range.value) / 100) * 0.5;
    const margin = marginFor(model, share);
    val.textContent = margin > 0 ? `${widthWord(Number(range.value))}, +/-${margin.toFixed(1)}` : 'No band';
    const thr = m.threshold;

    // What the AI does with these photos, with and without the band
    let answered = 0, right = 0, wrong0 = 0, wrongB = 0;
    rows.forEach(([, y, sc]) => {
      const d = sc - thr;
      const pred = d > 0 ? 1 : 0;
      if (pred !== y) wrong0++;
      if (Math.abs(d) > margin) { answered++; if (pred === y) right++; else wrongB++; }
    });
    const n = rows.length;
    out.replaceChildren(
      h('div', null, h('dt', null, 'It answers'), h('dd', null, pct(answered / n))),
      h('div', null, h('dt', null, 'Right, of those'), h('dd', null, answered ? pct(right / answered) : 'n/a')),
      h('div', { class: 'is-ask' }, h('dt', null, 'Not sure'), h('dd', null, pct((n - answered) / n))),
      h('div', { class: 'is-wide' }, h('dt', null, `Wrong answers, out of ${int(n)} photos`), h('dd', null, `${int(wrong0)} with no band, ${int(wrongB)} with this band`)));
    if (margin <= 0) rich(answer, `With no band the AI answers every photo and is right on *${pct(1 - wrong0 / n)}* of them. Drag the band wider and watch what changes.`);
    else rich(answer, `Yes. With this band the AI answers *${pct(answered / n)}* of the photos and is right on *${pct(right / answered)}* of those. On the other ${pct((n - answered) / n)} it says "not sure". With no band it answers every photo and is right on ${pct(1 - wrong0 / n)}.${farm ? ' The band was set on clean photos, not on these.' : ''}`);

    // Histogram of scores, one area per kind of leaf
    const scores = rows.map((r) => r[2]).sort((a, b) => a - b);
    const lo = quantile(scores, 0.01) - 0.5, hi = quantile(scores, 0.99) + 0.5;
    const bins = 34;
    const bw = (hi - lo) / bins;
    const series = farm
      ? [['Photos without rust', 'var(--leaf)', (r) => r[3] === 0, false], ['Phoma photos', 'var(--leaf)', (r) => r[3] === 1, true], ['Photos with rust', 'var(--rust)', (r) => r[3] === 2, false]]
      : [['Photos without rust', 'var(--leaf)', (r) => !r[1], false], ['Photos with rust', 'var(--rust)', (r) => !!r[1], false]];
    const counts = series.map(() => new Array(bins).fill(0));
    rows.forEach((r) => {
      const k = Math.max(0, Math.min(bins - 1, Math.floor((r[2] - lo) / bw)));
      series.forEach((sr, i) => { if (sr[2](r)) counts[i][k]++; });
    });
    const mx = Math.max(...counts.flat(), 1);
    const H = Math.round(Math.max(300, W * 0.62)), mm = { l: 14, r: 14, t: 30, b: 56 };
    const x = scale(lo, hi, mm.l, W - mm.r), y = scale(0, mx * 1.12, H - mm.b, mm.t);
    const svg = svgRoot(W, H, `Histogram of the AI's scores for real photos with and without rust. The not-sure band is ${margin.toFixed(1)} score points either side of the cut-off.`);
    svg.append(svgEl('defs', null,
      svgEl('pattern', { id: 'band-hatch', width: 8, height: 8, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, svgEl('rect', { width: 8, height: 8, style: 'fill:var(--ink);opacity:.06' }), svgEl('line', { x1: 0, y1: 0, x2: 0, y2: 8, style: 'stroke:var(--ink-3);stroke-width:1.5;opacity:.7' })),
      svgEl('pattern', { id: 'p-phoma', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, svgEl('line', { x1: 0, y1: 0, x2: 0, y2: 6, style: 'stroke:var(--leaf);stroke-width:2.2' }))));
    const bx0 = x(Math.max(lo, thr - margin)), bx1 = x(Math.min(hi, thr + margin));
    if (margin > 0) svg.append(svgEl('rect', { x: bx0, y: mm.t, width: Math.max(1.5, bx1 - bx0), height: H - mm.b - mm.t, style: 'fill:url(#band-hatch);opacity:.9' }));
    svg.append(svgEl('g', { class: 'axis' }, svgEl('line', { x1: mm.l, x2: W - mm.r, y1: H - mm.b, y2: H - mm.b })));
    const step = hi - lo > 40 ? 10 : hi - lo > 18 ? 5 : 2;
    ticks(lo, hi, step).forEach((v) => svg.append(svgEl('text', { x: x(v), y: H - mm.b + 16, 'text-anchor': 'middle' }, (v > 0 ? '+' : '') + v)));
    series.forEach(([, color, , hatched], i) => {
      let d = `M${x(lo)} ${y(0)}`;
      counts[i].forEach((c, k) => { d += `L${x(lo + k * bw)} ${y(c)}L${x(lo + (k + 1) * bw)} ${y(c)}`; });
      d += `L${x(hi)} ${y(0)}Z`;
      svg.append(svgEl('path', { d, style: hatched ? 'fill:url(#p-phoma);opacity:.9' : `fill:${color};opacity:.32` }));
      let dl = '';
      counts[i].forEach((c, k) => { dl += (k ? 'L' : 'M') + `${x(lo + k * bw)} ${y(c)}L${x(lo + (k + 1) * bw)} ${y(c)}`; });
      svg.append(svgEl('path', { class: 'ln', d: dl, style: `stroke:${color}` }));
    });
    svg.append(svgEl('line', { x1: x(thr), x2: x(thr), y1: mm.t - 8, y2: H - mm.b, style: 'stroke:var(--ink);stroke-width:2' }));
    svg.append(svgEl('text', { x: x(thr), y: mm.t - 12, 'text-anchor': 'middle', class: 't-strong' }, 'cut-off'));
    svg.append(svgEl('text', { x: x(thr) - 10, y: mm.t + 14, 'text-anchor': 'end', class: 't-strong' }, 'No rust'));
    svg.append(svgEl('text', { x: x(thr) + 10, y: mm.t + 14, class: 't-strong' }, 'Rust'));
    svg.append(svgEl('text', { x: (mm.l + W - mm.r) / 2, y: H - 6, 'text-anchor': 'middle' }, 'The AI\'s score for the photo. Lower: no rust. Higher: rust.'));
    const hit = svgEl('rect', { class: 'hit', x: mm.l, y: mm.t, width: W - mm.l - mm.r, height: H - mm.t - mm.b });
    hit.addEventListener('pointermove', (e) => {
      const r = svg.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * W;
      const k = Math.max(0, Math.min(bins - 1, Math.floor((x.invert(px) - lo) / bw)));
      tip.show([
        h('b', null, `Score ${(lo + k * bw).toFixed(1)} to ${(lo + (k + 1) * bw).toFixed(1)}`),
        ...series.map(([name, color], i) => h('div', { class: 'row', style: { '--k': color } }, h('span', null, h('i'), name), h('span', { class: 'v' }, String(counts[i][k])))),
      ], e.clientX, e.clientY);
    });
    hit.addEventListener('pointerleave', () => tip.hide());
    svg.append(hit);
    plot.replaceChildren(svg);
  }
  const redraw = fit(plot, draw, 300);
}
