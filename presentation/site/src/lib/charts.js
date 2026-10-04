// Tiny SVG chart helpers. Marks follow the dataviz rules: 2px lines, 8px or larger markers with a 2px surface ring,
// hairline solid grid, text in text colours, direct labels, a table twin for every chart.
import { s, h } from './dom.js';
import { tip } from './engine.js';

export const scale = (d0, d1, r0, r1) => {
  const f = (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
  f.invert = (p) => d0 + ((p - r0) / (r1 - r0)) * (d1 - d0);
  f.domain = [d0, d1];
  f.range = [r0, r1];
  return f;
};

/** Round tick values between lo and hi. */
export function ticks(lo, hi, step) {
  const out = [];
  const start = Math.ceil(lo / step - 1e-9) * step;
  for (let v = start; v <= hi + 1e-9; v += step) out.push(Math.round(v / step) * step);
  return out;
}

export const line = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');

/** Smooth path through points (Catmull-Rom turned into cubic Beziers). */
export function smoothPath(pts, tension = 0.5) {
  if (pts.length < 3) return line(pts);
  let d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * tension * 2, p1[1] + ((p2[1] - p0[1]) / 6) * tension * 2];
    const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * tension * 2, p2[1] - ((p3[1] - p1[1]) / 6) * tension * 2];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

export function svgRoot(w, hgt, label) {
  return s('svg', { viewBox: `0 0 ${w} ${hgt}`, role: 'img', 'aria-label': label, preserveAspectRatio: 'xMidYMid meet' });
}

/** A marker mark. kind: circle, diamond, square, triangle or ring. Always 8px or larger, with a surface ring. */
export function marker(kind, cx, cy, color, r = 5.5, extra = {}) {
  if (kind === 'diamond') {
    const k = r * 1.3;
    return s('path', { class: 'pt', d: `M${cx} ${cy - k}L${cx + k} ${cy}L${cx} ${cy + k}L${cx - k} ${cy}Z`, style: `fill:${color}`, ...extra });
  }
  if (kind === 'square') {
    const k = r * 0.95;
    return s('rect', { class: 'pt', x: cx - k, y: cy - k, width: k * 2, height: k * 2, rx: 1.5, style: `fill:${color}`, ...extra });
  }
  if (kind === 'triangle') {
    const k = r * 1.25;
    return s('path', { class: 'pt', d: `M${cx} ${cy - k}L${cx + k} ${cy + k * 0.8}L${cx - k} ${cy + k * 0.8}Z`, style: `fill:${color}`, ...extra });
  }
  if (kind === 'ring') {
    return s('circle', { class: 'pt', cx, cy, r, style: `fill:var(--card);stroke:${color};stroke-width:2.5`, ...extra });
  }
  return s('circle', { class: 'pt', cx, cy, r, style: `fill:${color}`, ...extra });
}

export const sign = (v, d = 1) => (v >= 0 ? '+' : '') + v.toFixed(d);

/** Call draw(width) now and again when the box changes width. Returns a function that redraws. */
export function fit(plot, draw, min = 300) {
  let w = 0;
  const run = () => { w = Math.max(min, Math.round(plot.clientWidth || 560)); draw(w); };
  let t = null;
  new ResizeObserver(() => {
    const nw = Math.max(min, Math.round(plot.clientWidth || 0));
    if (nw === w) return;
    clearTimeout(t);
    t = setTimeout(run, 120);
  }).observe(plot);
  run();
  return run;
}

/** A closed table under a chart, so the numbers can be read, copied and heard by a screen reader. */
export function tableTwin(head, rows, summary = 'Show the numbers as a table') {
  return h('details', { class: 'tbl' },
    h('summary', null, summary),
    h('div', { class: 'table-wrap' }, h('table', null,
      h('thead', null, h('tr', null, head.map((c) => h('th', { scope: 'col' }, c)))),
      h('tbody', null, rows.map((r) => h('tr', null, r.map((c, i) => (i === 0 ? h('th', { scope: 'row' }, String(c)) : h('td', null, String(c))))))))));
}

const TICKS100 = [0, 0.25, 0.5, 0.75, 1];

/**
 * Horizontal bars out of 100, with the value in one column on the right.
 * items: { header } or { label, sub, color, mean (0 to 1), vals (one per training run), tipRows: [[name, text], ...] }.
 * A tick on a bar is one training run. Bars start at zero.
 */
export function barRows(plot, { items, W, label, axisLabel = 'Out of 100', rowH = 42 }) {
  const left = Math.min(176, Math.round(W * 0.36)), right = 44, top = 6, headH = 38, bottom = 44;
  let y = top;
  const pos = items.map((it) => { const o = { it, y }; y += it.header ? headH : rowH; return o; });
  const H = y + bottom;
  const x = scale(0, 1, left, W - right);
  const svg = svgRoot(W, H, label);
  const grid = s('g', { class: 'grid' });
  TICKS100.forEach((v) => {
    grid.append(s('line', { x1: x(v), x2: x(v), y1: top, y2: y }));
    svg.append(s('text', { x: x(v), y: y + 18, 'text-anchor': 'middle' }, String(Math.round(v * 100))));
  });
  svg.prepend(grid);
  svg.append(s('text', { x: (left + W - right) / 2, y: H - 6, 'text-anchor': 'middle' }, axisLabel));
  pos.forEach(({ it, y: y0 }) => {
    if (it.header) { svg.append(s('text', { x: 0, y: y0 + 24, class: 't-strong t-big' }, it.header)); return; }
    const cy = y0 + rowH / 2;
    svg.append(s('text', { x: 0, y: cy + (it.sub ? -2 : 4), class: 't-strong' }, it.label));
    if (it.sub) svg.append(s('text', { x: 0, y: cy + 12 }, it.sub));
    svg.append(s('rect', { class: 'bar-track', x: x(0), y: cy - 10, width: x(1) - x(0), height: 20, rx: 4 }));
    if (it.mean == null || Number.isNaN(it.mean)) { svg.append(s('text', { x: x(0) + 8, y: cy + 4 }, 'no result')); return; }
    svg.append(s('rect', { x: x(0), y: cy - 10, width: Math.max(3, x(it.mean) - x(0)), height: 20, rx: 4, style: `fill:${it.color}` }));
    if ((it.vals || []).length > 1) it.vals.forEach((v) => svg.append(s('line', { x1: x(v), x2: x(v), y1: cy - 14, y2: cy + 14, style: 'stroke:var(--fg);stroke-width:2.5;stroke-linecap:round;opacity:.55' })));
    svg.append(s('text', { x: x(1) + 10, y: cy + 5, class: 't-val' }, String(Math.round(it.mean * 100))));
    const hit = s('rect', { class: 'hit', x: 0, y: y0, width: W, height: rowH });
    hit.addEventListener('pointermove', (e) => tip.show([
      h('b', null, it.label),
      h('div', { class: 'row' }, h('span', null, it.sub || 'Share right'), h('span', { class: 'v' }, (it.mean * 100).toFixed(1) + ' of 100')),
      ...((it.tipRows || []).map(([k, v]) => h('div', { class: 'row' }, h('span', null, k), h('span', { class: 'v' }, v)))),
    ], e.clientX, e.clientY));
    hit.addEventListener('pointerleave', () => tip.hide());
    svg.append(hit);
  });
  plot.replaceChildren(svg);
}

/** Keep line-end labels apart. items: { y }. Adds .ly (label y), at least `gap` apart, the group centred on where its dots sit. */
export function spreadLabels(items, gap = 17) {
  const a = [...items].sort((p, q) => p.y - q.y);
  a.forEach((it, i) => { it.ly = i ? Math.max(it.y, a[i - 1].ly + gap) : it.y; });
  // shift the pushed-down group back up so it stays centred on its dots
  let i = 0;
  while (i < a.length) {
    let j = i;
    while (j + 1 < a.length && a[j + 1].ly - a[j].ly <= gap + 0.01) j++;
    const moved = a.slice(i, j + 1).reduce((t, it) => t + (it.ly - it.y), 0) / (j - i + 1);
    for (let k = i; k <= j; k++) a[k].ly -= moved;
    i = j + 1;
  }
  return a;
}
