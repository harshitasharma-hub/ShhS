// "The answers": one plain question at a time, a one-line answer, and one chart that shows it.
// Every sentence comes from src/lib/claims.js and carries a test.
import { $, h, s as svgEl, int, mean } from '../lib/dom.js';
import { ARMS, cell, get } from '../lib/stats.js';
import { scale, ticks, svgRoot, marker, fit, barRows, tableTwin, spreadLabels } from '../lib/charts.js';
import { facts, claimMap, CAL_ARMS, CAL_SIZES } from '../lib/claims.js';
import { CALIBRATION, COUNTS } from '../data/generated.js';
import { V3 } from '../data/v3.js';
import { WHY } from '../data/why.js';
import { tip } from '../lib/engine.js';
import { rich } from './summary.js';

const STALE = 'The numbers changed since this answer was written. Read the chart for the current figures.';
const colorOf = (key) => (ARMS.find((a) => a.key === key) || {}).color || 'var(--ink-3)';
const runWord = (n) => (n === 1 ? '1 run' : `${n} runs`);

/** Answer line: the claim texts joined, or a note that the numbers moved. */
function say(id, C, ids, lead) {
  const el = $(id);
  if (!el) return;
  if (ids.every((k) => C[k] && C[k].ok)) {
    rich(el, ids.map((k) => C[k].text).join(' '));
    if (lead) el.prepend(h('span', { class: 'lead' }, lead + ' '));
  } else el.textContent = STALE;
}

/** Right answers out of 100, one bar per version. */
function bars(plotId, set, label, C, ids, answerId, lead) {
  const plot = $(plotId);
  if (!plot) return;
  say(answerId, C, ids, lead);
  const data = ARMS.map((a) => {
    const list = cell(a.key, 100);
    const vals = list.map((r) => get(r, set, 'acc')).filter((v) => v != null);
    return { a, list, vals, mean: vals.length ? mean(vals) : null };
  });
  // On a narrow screen the short names fit; the table below always has the full names.
  const items = (W) => data.map((d) => ({ label: W < 470 ? d.a.short : d.a.label, sub: d.a.key === 'zeroshot' ? 'No training' : runWord(d.vals.length), color: d.a.color, mean: d.mean, vals: d.vals, tipRows: d.list.map((r) => [r.name, (get(r, set, 'acc') * 100).toFixed(1)]) }));
  fit(plot, (W) => barRows(plot, { items: items(W), W, label, axisLabel: 'Right answers, out of 100' }));
  const fig = plot.closest('figure');
  if (!fig.querySelector('details.tbl')) fig.append(tableTwin(['Version', 'Right answers, out of 100', 'Runs'], data.map((d) => [d.a.label, d.mean == null ? '-' : (d.mean * 100).toFixed(1), d.vals.length])));
}

/** Why not: bars by kind of leaf, and the real photos behind them. */
function why(C) {
  const plot = $('#qa-why-plot');
  if (!plot) return;
  say('#qa-why-a', C, ['field-rust-caught', 'field-phoma'], 'They trade one mistake for another.');
  const u = COUNTS.uganda;
  const kinds = [['Leaves with rust', u.rust, 'sens'], ['Phoma leaves, another disease', u.phoma, 'otherOk'], ['Healthy leaves', u.healthy, 'healthyOk']];
  const items = [];
  kinds.forEach(([title, count, metric]) => {
    items.push({ header: `${title} (${int(count)})` });
    ARMS.forEach((a) => {
      const list = cell(a.key, 100);
      const vals = list.map((r) => get(r, 'uganda', metric)).filter((v) => v != null);
      items.push({ label: a.short, color: a.color, mean: vals.length ? mean(vals) : null, vals, sub: '', tipRows: list.map((r) => [r.name, (get(r, 'uganda', metric) * 100).toFixed(1)]) });
    });
  });
  fit(plot, (W) => barRows(plot, { items, W, rowH: 32, label: 'Right answers out of 100 for rust leaves, phoma leaves and healthy leaves, for each version, on real Uganda photos.', axisLabel: 'Right answers, out of 100' }));
  const fig = plot.closest('figure');
  if (!fig.querySelector('details.tbl')) {
    const rows = [];
    kinds.forEach(([title, , metric]) => ARMS.forEach((a) => { const v = cell(a.key, 100).map((r) => get(r, 'uganda', metric)).filter((x) => x != null); rows.push([title, a.label, v.length ? (mean(v) * 100).toFixed(1) : '-']); }));
    fig.append(tableTwin(['Kind of leaf', 'Version', 'Right answers, out of 100'], rows));
  }
  // The real photos where the versions disagree
  const fill = (id, kind, alt) => {
    const ul = $(id);
    if (!ul || !WHY || !WHY[kind]) return;
    ul.replaceChildren(...WHY[kind].pics.map((p) => h('li', null, h('img', { src: p.file, alt, loading: 'lazy', decoding: 'async', width: 128, height: 128 }))));
  };
  fill('#why-other', 'other', 'A real Uganda photo of a leaf with phoma. It has a dark lesion and no rust.');
  fill('#why-rust', 'rust', 'A real Uganda photo of a leaf labelled rust.');
  const lab = (sel, text) => { const el = $(sel); if (el && !el.querySelector('.why-count')) el.append(' ', h('span', { class: 'why-count' }, text)); };
  if (WHY && WHY.other) lab('#why-other-label', `${WHY.other.count} photos like these. Set 3 fixes ${WHY.other.v3Fixed} of them${WHY.other.v4Fixed != null ? `, set 4 fixes ${WHY.other.v4Fixed}` : ''}.`);
  if (WHY && WHY.rust) lab('#why-rust-label', `${WHY.rust.count} photos like these.`);
}

/** The two fixes: set 3 (swap in look-alikes) and set 4 (add them). Four questions, four versions each. */
function fixes(F, C) {
  const plot = $('#qa-v3-plot');
  if (!plot) return;
  say('#qa-v3-a', C, ['v3-moved'], 'Set 3: no.');
  const has4 = cell('mix', 100, 140, 'combo').length > 0;
  if (has4) say('#qa-v4-a', C, ['v4-better', 'v4-trade'], 'Set 4: nearly.'); else $('#qa-v4-a') && $('#qa-v4-a').remove();
  const versions = [
    { label: 'Real photos only', short: 'Real only', list: cell('real', 100), color: colorOf('real') },
    { label: 'Both, set 1', short: 'Both, set 1', list: cell('mix', 100), color: colorOf('mix') },
    { label: 'Both, set 3', short: 'Both, set 3', list: cell('mix', 100, 140, 'v3'), color: colorOf('mix') },
    ...(has4 ? [{ label: 'Both, set 4', short: 'Both, set 4', list: cell('mix', 100, 140, 'combo'), color: colorOf('mix') }] : []),
  ].filter((v) => v.list.length);
  const kinds = [['Right answers, all photos', 'acc'], ['Phoma leaves, right', 'otherOk'], ['Rust found', 'sens'], ['Healthy leaves, right', 'healthyOk']];
  const valsOf = (v, metric) => v.list.map((r) => get(r, 'uganda', metric)).filter((x) => x != null);
  const items = (W) => {
    const out = [];
    kinds.forEach(([title, metric]) => {
      out.push({ header: title });
      versions.forEach((v) => { const vals = valsOf(v, metric); out.push({ label: W < 470 ? v.short : v.label, color: v.color, mean: vals.length ? mean(vals) : null, vals, sub: '', tipRows: v.list.map((r) => [r.name, (get(r, 'uganda', metric) * 100).toFixed(1)]) }); });
    });
    return out;
  };
  fit(plot, (W) => barRows(plot, { items: items(W), W, rowH: 30, label: 'Right answers out of 100 on real Uganda photos for real photos alone, and for real plus practice photos with set 1, set 3 and set 4.', axisLabel: 'Out of 100' }));
  const fig = plot.closest('figure');
  if (!fig.querySelector('details.tbl')) {
    fig.append(tableTwin(['What we measured', ...versions.map((v) => v.label)], kinds.map(([title, metric]) => [title, ...versions.map((v) => { const x = valsOf(v, metric); return x.length ? (mean(x) * 100).toFixed(1) : '-'; })])));
  }
  const strip = $('#why-strip');
  if (strip && V3 && V3.pictures) {
    strip.replaceChildren(...V3.pictures.map((pic) => h('li', null, h('img', { src: pic.file, alt: 'A practice photo of a leaf with another disease and an orange rim around the dark lesion. The label is no rust.', loading: 'lazy', decoding: 'async', width: 200, height: 200 }))));
  }
}

/** How many local photos set the cut-off: right answers on 300 held-out Uganda photos. */
function local(C) {
  const plot = $('#qa-local-plot');
  if (!plot || !CALIBRATION) return;
  say('#qa-local-a', C, ['cal-100', 'cal-25', 'cal-cutoff', ...(C['cal-set4'].ok ? ['cal-set4'] : [])], 'About 100.');
  const find = (a, p, n) => CALIBRATION.local.find((r) => r.arm === a && (r.realPct ?? null) === p && r.nLocal === n);
  const series = CAL_ARMS.map((c) => ({ a: c.arm, color: colorOf(c.base), name: c.name, mark: c.mark, pts: CAL_SIZES.map((n) => find(c.arm, c.pct, n)) })).filter((sr) => sr.pts.every(Boolean));
  if (!series.length) return;

  function draw(W) {
    const all = series.flatMap((sr) => sr.pts.flatMap((r) => [r.acc - (r.accSd || 0), r.acc + (r.accSd || 0)]));
    const lo = Math.floor(Math.min(...all) * 50 - 0.5) / 50, hi = Math.ceil(Math.max(...all) * 50 + 0.5) / 50;
    const m = { l: 44, r: Math.min(116, W * 0.24), t: 30, b: 56 };
    const H = Math.round(Math.max(320, W * 0.6));
    const x = scale(0, CAL_SIZES.length - 1, m.l + 14, W - m.r), y = scale(lo, hi, H - m.b, m.t);
    const svg = svgRoot(W, H, 'Right answers out of 100 on 300 real Uganda photos, against the number of local photos used to set the cut-off, for four versions.');
    const grid = svgEl('g', { class: 'grid' });
    ticks(lo, hi, 0.02).forEach((v) => { grid.append(svgEl('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) })); svg.append(svgEl('text', { x: m.l - 8, y: y(v) + 4, 'text-anchor': 'end' }, String(Math.round(v * 100)))); });
    svg.prepend(grid);
    svg.append(svgEl('g', { class: 'axis' }, svgEl('line', { x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b })));
    CAL_SIZES.forEach((n, i) => svg.append(svgEl('text', { x: x(i), y: H - m.b + 18, 'text-anchor': 'middle' }, int(n))));
    svg.append(svgEl('text', { x: (m.l + W - m.r) / 2, y: H - 6, 'text-anchor': 'middle' }, 'Local photos used to set the cut-off'));
    svg.append(svgEl('text', { x: 6, y: 14, class: 't-strong' }, 'Right answers, out of 100'));
    // the claim: about 100 photos is enough
    svg.append(svgEl('line', { x1: x(2), x2: x(2), y1: m.t, y2: H - m.b, style: 'stroke:var(--fg-3);stroke-width:1.5;stroke-dasharray:5 5' }));
    svg.append(svgEl('text', { x: x(2) + 6, y: m.t + 12, class: 't-strong' }, 'about enough'));
    const ends = [];
    series.forEach((sr) => {
      sr.pts.forEach((r, i) => { if (r.accSd) svg.append(svgEl('line', { x1: x(i), x2: x(i), y1: y(r.acc - r.accSd), y2: y(r.acc + r.accSd), style: `stroke:${sr.color};stroke-width:2;opacity:.45;stroke-linecap:round` })); });
      svg.append(svgEl('path', { class: 'ln', d: sr.pts.map((r, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(r.acc).toFixed(1)).join(''), style: `stroke:${sr.color}` }));
      sr.pts.forEach((r, i) => svg.append(marker(sr.mark, x(i), y(r.acc), sr.color, 5.5)));
      const last = sr.pts[sr.pts.length - 1];
      ends.push({ sr, y: y(last.acc), v: last.acc });
    });
    spreadLabels(ends, 17);
    ends.forEach((e) => { svg.append(svgEl('text', { x: x(CAL_SIZES.length - 1) + 12, y: e.ly + 4, class: 't-strong' }, `${e.sr.name} ${Math.round(e.v * 100)}`)); });
    // hover: nearest size
    const xh = svgEl('line', { class: 'xhair', y1: m.t, y2: H - m.b });
    const hit = svgEl('rect', { class: 'hit', x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b });
    svg.append(xh, hit);
    const chart = plot.closest('figure');
    hit.addEventListener('pointermove', (e) => {
      const r = svg.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * W;
      let k = 0, best = 1e9;
      CAL_SIZES.forEach((_, i) => { const d = Math.abs(x(i) - px); if (d < best) { best = d; k = i; } });
      xh.setAttribute('x1', x(k)); xh.setAttribute('x2', x(k));
      chart.classList.add('is-hover');
      tip.show([
        h('b', null, `${int(CAL_SIZES[k])} local photos`),
        ...series.map((sr) => h('div', { class: 'row', style: { '--k': sr.color } }, h('span', null, h('i'), sr.name), h('span', { class: 'v' }, (sr.pts[k].acc * 100).toFixed(1) + (sr.pts[k].accSd ? ` +/- ${(sr.pts[k].accSd * 100).toFixed(1)}` : '')))),
      ], e.clientX, e.clientY);
    });
    hit.addEventListener('pointerleave', () => { chart.classList.remove('is-hover'); tip.hide(); });
    plot.replaceChildren(svg);
  }
  fit(plot, draw);
  const fig = plot.closest('figure');
  if (!fig.querySelector('details.tbl')) {
    fig.append(tableTwin(['Local photos', ...series.map((sr) => sr.name)], CAL_SIZES.map((n, i) => [int(n), ...series.map((sr) => { const r = sr.pts[i]; return (r.acc * 100).toFixed(1) + (r.accSd ? ` +/- ${(r.accSd * 100).toFixed(1)}` : ''); })])));
  }
}

export function initAnswers() {
  if (!$('#answers')) return;
  const F = facts();
  const C = claimMap(F);
  bars('#qa-clean-plot', 'bracol', 'Right answers out of 100 on the clean BRACOL test photos, for four versions of the AI.', C, ['clean-train', 'clean-syn', 'clean-both'], '#qa-clean-a', 'Yes.');
  bars('#qa-field-plot', 'uganda', 'Right answers out of 100 on the real Uganda farm photos, for four versions of the AI.', C, ['field-no-gain'], '#qa-field-a', 'No.');
  why(C);
  fixes(F, C);
  local(C);
}
