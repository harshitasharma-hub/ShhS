// The data gap: tidy photos against messy farms (a draggable comparison of real mosaics),
// and the paper shortcut (the photo border colour predicts rust in BRACOL but not in our renders).
import { $, $$, h, s as svgEl, clamp, f2 } from '../lib/dom.js';
import { GAP, SHORTCUT } from '../data/generated.js';
import { scale, smoothPath, ticks, svgRoot, fit } from '../lib/charts.js';
import { tip, state } from '../lib/engine.js';

const R = 1.4; // every tile box is 1.4 wide for 1 tall, so both mosaics line up

function tileLayout(spec) {
  const S = spec.tileW / spec.tileH;
  let sx, sy;
  if (S >= R) { sx = (spec.cols * S) / R; sy = spec.rows; } else { sx = spec.cols; sy = (spec.rows * R) / S; }
  const tw = sx / spec.cols, th = sy / spec.rows;
  return (c, r) => ({
    size: `${(sx * 100).toFixed(3)}% ${(sy * 100).toFixed(3)}%`,
    pos: `${(((-(c + 0.5) * tw + 0.5) / (1 - sx)) * 100).toFixed(3)}% ${(((-(r + 0.5) * th + 0.5) / (1 - sy)) * 100).toFixed(3)}%`,
  });
}

function buildMosaic(root, spec, n, label, credit) {
  const lay = tileLayout(spec);
  root.style.setProperty('--cols', spec.cols);
  root.style.setProperty('--ar', R);
  root.replaceChildren();
  const frag = document.createDocumentFragment();
  for (let i = 0; i < Math.min(n, spec.tiles.length); i++) {
    const c = i % spec.cols, r = Math.floor(i / spec.cols);
    const l = lay(c, r);
    const t = h('i', { 'data-i': i });
    t.style.backgroundImage = `url(${spec.file})`;
    t.style.backgroundSize = l.size;
    t.style.backgroundPosition = l.pos;
    frag.append(t);
  }
  root.append(frag);
  root.addEventListener('pointermove', (e) => {
    const t = e.target.closest('i');
    if (!t) return tip.hide();
    const m = spec.tiles[Number(t.dataset.i)];
    tip.show([
      h('b', null, label),
      h('div', null, `${credit} · ${m.id}`),
      h('div', null, m.rust ? 'Label: rust' : `Label: no rust${m.group && m.group !== 'healthy' ? ' (' + m.group + ')' : m.group === 'healthy' ? ' (healthy)' : ''}`),
    ], e.clientX, e.clientY);
  });
  root.addEventListener('pointerleave', () => tip.hide());
}

export function initGap() {
  const cmp = $('#compare');
  if (cmp && GAP && GAP.bracol && GAP.uganda) {
    const n = Math.min(GAP.bracol.tiles.length, GAP.uganda.tiles.length);
    buildMosaic($('#mosaic-tidy'), GAP.bracol, n, 'Real · BRACOL', 'Brazil, plain paper');
    buildMosaic($('#mosaic-messy'), GAP.uganda, n, 'Real · Uganda', 'A phone on a farm');
    const handle = $('#compare-handle');
    const setSplit = (pctv) => {
      pctv = clamp(pctv, 4, 96);
      cmp.style.setProperty('--split', pctv + '%');
      handle.setAttribute('aria-valuenow', String(Math.round(pctv)));
    };
    let dragging = false;
    const fromEvent = (e) => { const r = cmp.getBoundingClientRect(); setSplit(((e.clientX - r.left) / r.width) * 100); };
    handle.addEventListener('pointerdown', (e) => { dragging = true; handle.setPointerCapture(e.pointerId); fromEvent(e); });
    handle.addEventListener('pointermove', (e) => { if (dragging) fromEvent(e); });
    handle.addEventListener('pointerup', () => { dragging = false; });
    cmp.addEventListener('pointerdown', (e) => { if (e.target === cmp || e.target.closest('i')) { if (e.pointerType !== 'mouse') fromEvent(e); } });
    handle.addEventListener('keydown', (e) => {
      const cur = Number(handle.getAttribute('aria-valuenow'));
      if (e.key === 'ArrowLeft') { setSplit(cur - 5); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setSplit(cur + 5); e.preventDefault(); }
    });
    // A small hint swing the first time it scrolls into view
    let hinted = false;
    new IntersectionObserver((en) => {
      if (en[0].isIntersecting && !hinted && state.motion) {
        hinted = true;
        const t0 = performance.now();
        const step = (t) => {
          const k = (t - t0) / 1800;
          if (k >= 1) return setSplit(50);
          setSplit(50 + Math.sin(k * Math.PI * 2) * 28 * (1 - k));
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 }).observe(cmp);
    setSplit(50);
  }
  initShortcut();
}

function initShortcut() {
  const plot = $('#shortcut-plot');
  if (!plot || !SHORTCUT) return;
  const tabs = $$('#chart-shortcut [data-set]');
  let cur = 'bracol';

  function draw(key, W) {
    const d = SHORTCUT[key];
    if (!d) return;
    const H = Math.round(Math.max(250, W * 0.55)), m = { l: 14, r: 14, t: 30, b: 56 };
    const edges = d.hist.edges;
    const centers = d.hist.rust.map((_, i) => (edges[i] + edges[i + 1]) / 2);
    const ymax = Math.max(...d.hist.rust, ...d.hist.norust) * 1.12;
    const x = scale(edges[0], edges[edges.length - 1], m.l, W - m.r);
    const y = scale(0, ymax, H - m.b, m.t);
    const svg = svgRoot(W, H, `Distribution of the photo border colour for leaves with and without rust, ${key === 'bracol' ? 'BRACOL photos' : 'rendered photos'}. AUC ${f2(d.auc)}.`);
    const grid = svgEl('g', { class: 'grid' });
    ticks(Math.ceil(edges[0] / 5) * 5, edges[edges.length - 1], 5).forEach((v) => grid.append(svgEl('line', { x1: x(v), x2: x(v), y1: m.t, y2: H - m.b })));
    svg.append(grid);
    svg.append(svgEl('g', { class: 'axis' }, svgEl('line', { x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b })));
    const paint = (vals, color, name) => {
      const pts = centers.map((c, i) => [x(c), y(vals[i])]);
      const dline = smoothPath(pts);
      svg.append(svgEl('path', { d: `${dline}L${x(centers[centers.length - 1])} ${y(0)}L${x(centers[0])} ${y(0)}Z`, style: `fill:${color};opacity:.12` }));
      svg.append(svgEl('path', { class: 'ln', d: dline, style: `stroke:${color}` }));
    };
    paint(d.hist.norust, 'var(--leaf)', 'no rust');
    paint(d.hist.rust, 'var(--rust)', 'rust');
    // medians as direct labels
    const med = (arr) => { const a = [...arr].sort((p, q) => p - q); return a[Math.floor(a.length / 2)]; };
    const mr = med(d.a.rust), mn = med(d.a.norust);
    [[mr, 'var(--rust)', 'rust median'], [mn, 'var(--leaf)', 'no-rust median']].forEach(([v, col, lab], k) => {
      svg.append(svgEl('line', { x1: x(v), x2: x(v), y1: H - m.b, y2: m.t + 18 + k * 0, style: `stroke:${col};stroke-width:2` }));
    });
    const lab = (v, text, dy) => svg.append(svgEl('text', { x: x(v), y: m.t + dy, 'text-anchor': v >= (edges[0] + edges[edges.length - 1]) / 2 ? 'start' : 'end', dx: v >= (edges[0] + edges[edges.length - 1]) / 2 ? 6 : -6, class: 't-strong' }, text));
    lab(mr, 'rust', 2);
    lab(mn, 'no rust', 18);
    svg.append(svgEl('text', { x: m.l, y: H - 18 }, 'greener'));
    svg.append(svgEl('text', { x: W - m.r, y: H - 18, 'text-anchor': 'end' }, 'redder'));
    svg.append(svgEl('text', { x: W / 2, y: H - 4, 'text-anchor': 'middle' }, 'Colour of the photo border'));
    svg.append(svgEl('text', { x: W - m.r, y: m.t - 10, 'text-anchor': 'end', class: 't-strong', style: 'font-size:15px' }, `AUC ${f2(d.auc)}`));
    // hover readout
    const hit = svgEl('rect', { class: 'hit', x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b });
    const xh = svgEl('line', { class: 'xhair', y1: m.t, y2: H - m.b });
    svg.append(xh, hit);
    const chart = $('#chart-shortcut');
    hit.addEventListener('pointermove', (e) => {
      const r = svg.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * W;
      let k = 0, best = 1e9;
      centers.forEach((c, i) => { const dd = Math.abs(x(c) - px); if (dd < best) { best = dd; k = i; } });
      xh.setAttribute('x1', x(centers[k])); xh.setAttribute('x2', x(centers[k]));
      chart.classList.add('is-hover');
      tip.show([
        h('b', null, 'Border colour band'),
        h('div', { class: 'row', style: { '--k': 'var(--rust)' } }, h('span', null, h('i'), 'Rust leaves'), h('span', { class: 'v' }, (d.hist.rust[k] * 100).toFixed(1) + '%')),
        h('div', { class: 'row', style: { '--k': 'var(--leaf)' } }, h('span', null, h('i'), 'No-rust leaves'), h('span', { class: 'v' }, (d.hist.norust[k] * 100).toFixed(1) + '%')),
      ], e.clientX, e.clientY);
    });
    hit.addEventListener('pointerleave', () => { chart.classList.remove('is-hover'); tip.hide(); });
    plot.replaceChildren(svg);
    
  }

  const redraw = fit(plot, (W) => draw(cur, W), 300);
  tabs.forEach((t) => t.addEventListener('click', () => {
    tabs.forEach((x) => x.setAttribute('aria-pressed', String(x === t)));
    cur = t.dataset.set;
    redraw();
  }));
}
