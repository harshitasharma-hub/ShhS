import * as THREE from 'three';
import { BaseScene } from './baseScene.js';
import { COL, makeImageCard, plinth, matte, studioLights, fitShadow, RoundedBoxGeometry } from './diagram.js';
import { mulberry32, easeOut } from '../core/math.js';
import { RESULTS } from '../results.js';
import { fitFrame, boxPts } from '../core/frame.js';

// The evidence. Four charts of measured scores, drawn from src/results.js (tools/sync_results.py copies it from runs/):
//   proof-1  clean BRACOL photos: AUC by share of real photos, with and without renders
//   proof-2  real Uganda farm photos: the same bars
//   proof-3  the mistakes behind it: accuracy, rust caught, and other-disease photos answered right, for each render recipe
//   proof-4  a cut-off set on local photos: accuracy with the BRACOL cut-off, with 100 local photos and with all 1,492
//   proof-5  a map of what the data covers, and six regions outside it
// A bar whose run is missing stays a dashed outline with a "?", so a chart never shows a number that was not measured.

function dot() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 4, 32, 32, 30);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.7, 'rgba(255,255,255,0.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(32, 32, 30, 0, 6.2832); ctx.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function textMesh(w, h, draw, px = 512) {
  const c = document.createElement('canvas'); c.width = px; c.height = Math.round(px * (h / w));
  draw(c.getContext('2d'), c.width, c.height);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, transparent: true, side: THREE.DoubleSide }));
}

const GREY = '#9aa3c6';
const BAR_H = 14;
const BASE = 0.8;                        // the plinth under the bars is this high
const TEST_X = 41;                       // where the test photos stand
// six regions the data does not reach, just outside the cloud of synthetic images (x, y, z)
const POCKETS = [[-21, 15, 3], [-20, 5, -10], [20, 18, -12], [22, 6, 10], [-4, 25, -3], [13, -3, 13]];

// ---------------------------------------------------------------- the numbers
const ARMS = RESULTS.arms || {};
const LOCAL = RESULTS.local || {};
const arm = (key, where) => (ARMS[key] && ARMS[key][where]) || null;
const n0 = (n) => Number(n).toLocaleString('en-US');

// One bar. color null means renders on top of real photos, drawn in two tones. A missing run leaves v undefined.
const aucBar = (color, m) => (m && m.auc != null ? { color, v: m.auc, lo: m.lo, hi: m.hi, text: m.auc.toFixed(3) } : { color });
const pctBar = (color, v) => (v != null ? { color, v, text: `${Math.round(v * 100)}%` } : { color });

// five groups: no real photos at all, then 10, 25, 50 and 100% of them
const SHARES = [[10, 128], [25, 312], [50, 614], [100, 1225]];
const aucGroups = (where) => [
  { name: '0%', sub: 'no real photos', color: COL.slate, bars: [aucBar(GREY, arm('zeroshot', where)), aucBar(COL.sim, arm('syn:0', where))] },
  ...SHARES.map(([p, n]) => ({ name: `${p}%`, sub: `${n0(n)} leaves`, color: COL.real, bars: [aucBar(COL.real, arm(`real:${p}`, where)), aucBar(null, arm(`mix:${p}`, where))] })),
];
// the render recipes with all the real photos, scored on the 1,792 Uganda photos
const recipe = (name, sub, key) => {
  const m = arm(key, 'uganda');
  return { name, sub, color: COL.slate, bars: [pctBar(COL.fruit, m && m.accuracy), pctBar(COL.alarm, m && m.rust), pctBar(COL.healthy, m && m.other)] };
};
// the cut-off set on BRACOL, on 100 local photos, and on all 1,492 of them. All three bars are accuracy, so they share one hue.
// A darker purple means more local photos. The colours of the two charts below were checked with the dataviz palette validator.
const CUTOFF_RAMP = ['#cfb2f8', '#b15cf5', '#6a2fb8'];
const cutoff = (name, sub, key) => {
  const m = LOCAL[key] || {};
  return { name, sub, color: COL.slate, bars: [pctBar(CUTOFF_RAMP[0], m.bracolCut), pctBar(CUTOFF_RAMP[1], m.local100), pctBar(CUTOFF_RAMP[2], m.localCut)] };
};

const VIEWS = {
  bracol: {
    box: 'test', where: 'bracol', min: 0.5, max: 1, spacing: 10, pitch: 5, barW: 4, label: 'auc', dx: 0,
    metric: ['Score: AUC', '0.5 is chance'], boxTag: ['Locked test', `${RESULTS.tests?.bracol ?? 261} BRACOL leaves`],
    groups: aucGroups('bracol'),
  },
  uganda: {
    box: 'farm', where: 'uganda', min: 0.5, max: 1, spacing: 10, pitch: 5, barW: 4, label: 'auc', dx: 0,
    metric: ['Score: AUC', '0.5 is chance'], boxTag: ['Farm test', `${n0(RESULTS.tests?.uganda ?? 1792)} Uganda photos`],
    groups: aucGroups('uganda'),
  },
  mix: {
    box: null, min: 0, max: 1, spacing: 13, pitch: 3.8, barW: 3.3, label: 'pct', dx: 6,
    metric: ['Share right', 'of the farm photos'],
    groups: [recipe('Real only', 'no renders', 'real:100'), recipe('+ set 1', 'first recipe', 'mix:100'), recipe('+ set 3', 'rimmed lesions', 'mix-v3:100'), recipe('+ set 4', 'set 1 + rims', 'mix-combo:100')],
  },
  local: {
    box: null, min: 0.5, max: 1, spacing: 15, pitch: 4.6, barW: 4, label: 'pct', dx: 6,
    metric: ['Accuracy', '50% is chance'],
    groups: [cutoff('Untrained', 'as released', 'zeroshot'), cutoff('Real, 10%', '128 photos', 'real:10'), cutoff('Real, 100%', '1,225 photos', 'real:100')],
  },
};
const VIEW_OF = { 'proof-1': 'bracol', 'proof-2': 'uganda', 'proof-3': 'mix', 'proof-4': 'local' };

const gx = (v, k) => v.dx + (k - (v.groups.length - 1) / 2) * v.spacing;
const barX = (v, k, j) => gx(v, k) + (j - (v.groups[k].bars.length - 1) / 2) * v.pitch;
const firstLeft = (v) => barX(v, 0, 0) - v.barW / 2;
const yOf = (v, x) => BAR_H * Math.max(0, Math.min(1, (x - v.min) / (v.max - v.min)));

export class ProofScene extends BaseScene {
  build() {
    const g = this.group;
    this.t = 0;
    this.grow = 1;
    this.cur = null;
    this.qs = [];
    this.rig = studioLights(g, 120);
    fitShadow(this.rig, 8, 40, 36);

    // ---------------------------------------------------------- the four charts, and the test they are scored on
    const rig = new THREE.Group();
    this.rigGroup = rig;
    g.add(rig);
    this.views = {};
    for (const [name, spec] of Object.entries(VIEWS)) {
      const view = this._chart(spec);
      view.group.visible = false;
      rig.add(view.group);
      this.views[name] = { spec, ...view };
    }
    this.testBox = this._box(['test_1', 'test_2', 'test_3', 'test_4', 'test_5', 'test_6'], 'TEST');
    this.farmBox = this._box(['field_1', 'field_2', 'field_3', 'field_4', 'field_5'], 'FARM');
    rig.add(this.testBox, this.farmBox);
    this.arrow = this._arrow([28, 1.5, 7.6], [TEST_X - 6.5, 1.5, 5]);
    rig.add(this.arrow);

    // ---------------------------------------------------------- proof-5 cloud
    const cloud = new THREE.Group();
    this.cloud = cloud;
    cloud.visible = false;
    g.add(cloud);
    const BX = 32, BY = 22, BZ = 22;
    const box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(BX, BY, BZ)), new THREE.LineBasicMaterial({ color: COL.ink, transparent: true, opacity: 0.45 }));
    box.position.y = BY / 2; cloud.add(box);
    const rng = mulberry32(11);
    const pos = [], colr = [];
    const add = (x, y, z, c) => { pos.push(x, y, z); colr.push(c.r, c.g, c.b); };
    const blue = new THREE.Color(COL.sim), brown = new THREE.Color(COL.real);
    for (let i = 0; i < 5200; i++) {
      add((rng() - 0.5) * BX, rng() * BY, (rng() - 0.5) * BZ, blue.clone().offsetHSL(0, 0, (rng() - 0.5) * 0.12));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colr, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.5, vertexColors: true, map: dot(), transparent: true, alphaTest: 0.2, depthWrite: false, sizeAttenuation: true }));
    cloud.add(pts);
    // real photos: a thin slab (one plain backdrop, one soft light, a few severities), and a few farm shots. Bigger dots so they read.
    const rp = [], rc = [];
    for (let i = 0; i < 240; i++) { rp.push(9 + (rng() - 0.5) * 2.6, 0.6 + rng() * 3.0, 2 + rng() * 8); const c = brown.clone().offsetHSL(0, 0, (rng() - 0.5) * 0.1); rc.push(c.r, c.g, c.b); }
    for (let i = 0; i < 90; i++) { rp.push((rng() - 0.5) * BX * 0.9, 0.6 + rng() * 5, (rng() - 0.5) * BZ); const c = brown.clone().offsetHSL(0, 0, 0.12); rc.push(c.r, c.g, c.b); }
    const rg = new THREE.BufferGeometry();
    rg.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3));
    rg.setAttribute('color', new THREE.Float32BufferAttribute(rc, 3));
    cloud.add(new THREE.Points(rg, new THREE.PointsMaterial({ size: 0.95, vertexColors: true, map: dot(), transparent: true, alphaTest: 0.2, depthWrite: true, sizeAttenuation: true })));
    // six regions the data does not reach
    this.pockets = [];
    POCKETS.forEach(([x, y, z]) => {
      const s = new THREE.Mesh(new THREE.SphereGeometry(3.4, 16, 12), new THREE.MeshBasicMaterial({ color: COL.alarm, wireframe: true, transparent: true, opacity: 0.55 }));
      s.position.set(x, y, z); cloud.add(s); this.pockets.push(s);
    });
    this._frames();
    this._tags();
    this.built = true;
  }

  // One chart: a plinth, a dashed outline for every bar, and a solid bar up to its score with the 95% interval and the number.
  // Bars grow from the plinth when the step opens. The interval and the number appear when the bar is up.
  _chart(v) {
    const group = new THREE.Group();
    const base = plinth(54, 14, BASE, '#ffffff', COL.ink);
    base.position.x = v.dx;
    group.add(base);
    const bars = [];
    const ghostGeo = new THREE.BoxGeometry(v.barW, BAR_H, 3);
    v.groups.forEach((grp, k) => {
      grp.bars.forEach((b, j) => {
        const x = barX(v, k, j);
        // the dashed outline reaches the top of the scale, so a bar is read against the whole range
        const ghost = (c, y0, h) => {
          const geo = h === BAR_H ? ghostGeo : new THREE.BoxGeometry(v.barW, h, 3);
          const o = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineDashedMaterial({ color: c, dashSize: 0.55, gapSize: 0.4 }));
          o.computeLineDistances();
          o.position.set(x, BASE + y0 + h / 2, 0);
          group.add(o);
          const fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.07, depthWrite: false }));
          fill.position.copy(o.position);
          group.add(fill);
        };
        if (b.color) ghost(b.color, 0, BAR_H); else { ghost(COL.real, 0, BAR_H / 2); ghost(COL.sim, BAR_H / 2, BAR_H / 2); }

        if (b.v == null) {
          const q = textMesh(2, 2, (ctx, w, h) => { ctx.fillStyle = b.color || COL.ink; ctx.font = '700 150px "Bricolage", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', w / 2, h / 2 + 6); }, 128);
          q.position.set(x, BASE + BAR_H / 2, 1.7);
          group.add(q);
          this.qs.push(q);
          return;
        }
        const H = Math.max(0.3, yOf(v, b.v));
        const grow = new THREE.Group();
        grow.position.set(x, BASE, 0);
        const solid = (c, y0, h) => {
          const geo = new RoundedBoxGeometry(v.barW, h, 3, 2, 0.18);
          geo.translate(0, h / 2, 0);
          const m = new THREE.Mesh(geo, matte(c, 0.5));
          m.position.y = y0; m.castShadow = true;
          grow.add(m);
        };
        if (b.color) solid(b.color, 0, H); else { solid(COL.real, 0, H / 2); solid(COL.sim, H / 2, H / 2); }
        group.add(grow);

        const late = [];
        let top = H;
        if (b.lo != null && b.hi != null) {
          const lo = yOf(v, b.lo), hi = yOf(v, b.hi), ink = matte(COL.ink, 0.4);
          const stem = new THREE.Mesh(new THREE.BoxGeometry(0.16, Math.max(0.05, hi - lo), 0.16), ink); stem.position.set(x, BASE + (lo + hi) / 2, 1.7); late.push(stem);
          for (const yy of [lo, hi]) { const cap = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.14, 0.16), ink); cap.position.set(x, BASE + yy, 1.7); late.push(cap); }
          top = Math.max(H, hi);
        }
        const auc = v.label === 'auc';
        const lw = auc ? 4.6 : v.pitch - 0.2, lh = auc ? 1.9 : 1.55;
        const val = textMesh(lw, lh, (ctx, w, h) => {
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(4, 4, w - 8, h - 8, h * 0.24); ctx.fill();
          ctx.lineWidth = 6; ctx.strokeStyle = b.color || COL.ink; ctx.stroke();
          ctx.fillStyle = COL.ink; ctx.font = `500 ${Math.round(h * (auc ? 0.62 : 0.78))}px "DMMono", monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(b.text, w / 2, h / 2 + 2);
        }, 384);
        val.position.set(x, BASE + top + 0.6 + lh / 2, 1.8);
        late.push(val);
        late.forEach((o) => { o.visible = false; group.add(o); });
        bars.push({ grow, late });
        return;
      });
    });

    // a dashed line at the score of the untrained model, so every bar is read against doing nothing
    let ref = null;
    const z = v.where && arm('zeroshot', v.where);
    if (z && z.auc != null) {
      const last = v.groups.length - 1;
      const x0 = firstLeft(v) - 0.6, x1 = barX(v, last, v.groups[last].bars.length - 1) + v.barW / 2 + 0.6, y = BASE + yOf(v, z.auc);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x0, y, 2.3), new THREE.Vector3(x1, y, 2.3)]), new THREE.LineDashedMaterial({ color: COL.alarm, dashSize: 0.6, gapSize: 0.4 }));
      line.computeLineDistances();
      group.add(line);
      ref = { x: x0, y, auc: z.auc };
    }
    return { group, bars, ref, tags: [] };
  }

  // The test the scores come from: a plinth with photos on it, and a padlock because nothing trains on them.
  _box(names, tag) {
    const box = new THREE.Group();
    box.visible = false;
    box.add(plinth(15, 12, 0.8, '#ffffff', COL.real));
    names.forEach((nm, i) => {
      const r = i < 3 ? 0 : 1, rowN = r ? names.length - 3 : Math.min(3, names.length), c = (r ? i - 3 : i) - (rowN - 1) / 2;
      const card = makeImageCard(nm, COL.real, i === 0 ? tag : null, 1.5);
      card.position.set(c * 3.4, 2.0 + r * 1.85, -0.6 + r * 0.4); card.rotation.x = -0.2; box.add(card);
    });
    const lock = new THREE.Group();
    const body = new THREE.Mesh(new RoundedBoxGeometry(3.0, 2.4, 1.4, 3, 0.35), matte(COL.ink, 0.4)); body.position.y = 1.2; body.castShadow = true; lock.add(body);
    const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.24, 12, 28, Math.PI), matte(COL.slate, 0.35)); shackle.position.y = 2.4; shackle.castShadow = true; lock.add(shackle);
    lock.position.set(0, 10.4, 1.2);
    box.add(lock);
    box.position.set(TEST_X, 0, 0);
    return box;
  }

  _arrow(a, b) {
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(...a), new THREE.Vector3((a[0] + b[0]) / 2, 3.2, (a[2] + b[2]) / 2 + 1), new THREE.Vector3(...b)]);
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(30)), new THREE.LineDashedMaterial({ color: COL.ink, transparent: true, opacity: 0.5, dashSize: 0.45, gapSize: 0.3 }));
    l.computeLineDistances();
    l.visible = false;
    return l;
  }

  // What must be in the picture for each step. The camera is worked out from the stage (see core/frame.js).
  _frames() {
    // the chart and the test, with room for the numbers above the bars, the labels under them and the one to the left
    const chart = { pts: [...boxPts(0, 7.8, 0, 56, 15.6, 14), ...boxPts(TEST_X, 6.5, 0, 16, 13, 13), [TEST_X, 19.5, 0], [0, 19.2, 2], [-37, 9, 0], [0, -5.2, 6], [20, -5.2, 6]], az: 0, el: 16, fov: 28, pad: [0.03, 0.05], parallax: 0.3 };
    this.frames = {
      'proof-1': chart, 'proof-2': chart, 'proof-3': chart, 'proof-4': chart,
      // the cloud of synthetic images and the six regions it does not reach
      'proof-5': { pts: [...boxPts(0, 11, 0, 32, 22, 22), ...POCKETS.flatMap(([x, y, z]) => boxPts(x, y, z, 7, 7, 7)), [-36, 15, 3], [36, 18, -12], [0, 33, -3], [26, -4, 13], [-34, 4, -10]], az: -6, el: 24, fov: 30, pad: [0.04, 0.06], parallax: 0.35 },
    };
  }

  pose(id) { return fitFrame(this.frames[id], this.app.layout.aspect); }

  _tags() {
    const t = this.app.tags;
    const at = (x, y, z) => new THREE.Vector3(x, y, z);
    for (const [name, view] of Object.entries(this.views)) {
      const v = view.spec;
      v.groups.forEach((grp, k) => {
        const id = `pv-${name}-g${k}`;
        t.add({ id, text: grp.name, sub: grp.sub, anchor: at(gx(v, k), 0.85, 5.6), side: 'd', len: 12, color: grp.color, big: k === 0 });
        view.tags.push(id);
      });
      t.add({ id: `pv-${name}-metric`, text: v.metric[0], sub: v.metric[1], anchor: at(firstLeft(v) - 0.05, BASE + BAR_H * 0.55, 1.6), side: 'l', len: 18, color: COL.ink });
      view.tags.push(`pv-${name}-metric`);
      if (view.ref) {
        t.add({ id: `pv-${name}-ref`, text: 'Untrained', sub: view.ref.auc.toFixed(3), anchor: at(view.ref.x, view.ref.y, 2.3), side: 'l', len: 10, color: COL.alarm });
        view.tags.push(`pv-${name}-ref`);
      }
      if (v.box) {
        t.add({ id: `pv-${name}-box`, text: v.boxTag[0], sub: v.boxTag[1], anchor: at(TEST_X, 14.2, 1.2), side: 'u', len: 14, color: COL.real, big: true });
        view.tags.push(`pv-${name}-box`);
      }
    }
    t.add({ id: 'pc-x', text: 'Light', sub: 'dawn to overcast', anchor: at(16, 0, 11), side: 'r', len: 30, color: COL.slate });
    t.add({ id: 'pc-y', text: 'Backdrop', sub: 'plain to cluttered', anchor: at(-16, 22, 11), side: 'l', len: 30, color: COL.slate });
    t.add({ id: 'pc-z', text: 'Rust severity', sub: '0 to 4', anchor: at(16, 0, -11), side: 'r', len: 30, color: COL.slate });
    t.add({ id: 'pc-sim', text: 'Synthetic images', sub: 'fill the space', anchor: at(2, 16, 2), side: 'r', len: 40, color: COL.sim, big: true });
    t.add({ id: 'pc-real', text: 'Real photos', sub: 'a thin slice', anchor: at(9, 2.2, 7), side: 'l', len: 30, color: COL.real, big: true });
    ['Farm photos', 'Other diseases', 'Simple scenes', 'A small test', 'Phones', 'Languages'].forEach((n, i) => {
      const p = POCKETS[i];
      t.add({ id: `pc-g${i}`, text: `<b class="num">${i + 1}</b>${n}`, anchor: at(p[0], p[1], p[2]), side: i === 4 ? 'u' : i === 5 ? 'd' : p[0] > 8 ? 'r' : 'l', len: 16, color: COL.alarm });
    });
  }

  enter(id) {
    const t = this.app.tags;
    const view = this.views[VIEW_OF[id]] || null;
    this.cur = view;
    this.grow = 0;
    this.rigGroup.visible = !!view;
    this.cloud.visible = !view;
    for (const w of Object.values(this.views)) {
      w.group.visible = w === view;
      w.bars.forEach((b) => { b.grow.scale.y = 0.001; b.late.forEach((o) => { o.visible = false; }); });
    }
    this.testBox.visible = !!view && view.spec.box === 'test';
    this.farmBox.visible = !!view && view.spec.box === 'farm';
    this.arrow.visible = !!view && !!view.spec.box;
    if (view) t.only(view.tags);
    else t.only(['pc-x', 'pc-y', 'pc-z', 'pc-sim', 'pc-real', 'pc-g0', 'pc-g1', 'pc-g2', 'pc-g3', 'pc-g4', 'pc-g5']);
  }

  update(dt, tt, motion = true) {
    if (motion) this.t += dt;
    const t = this.t;
    const view = this.cur;
    if (view) {
      this.grow = motion ? Math.min(1, this.grow + dt / 0.9) : 1;
      const e = easeOut(this.grow), done = this.grow > 0.82;
      for (const b of view.bars) {
        b.grow.scale.y = Math.max(0.001, e);
        if (b.late[0] && b.late[0].visible !== done) b.late.forEach((o) => { o.visible = done; });
      }
    }
    this.qs.forEach((q, i) => { q.position.y = BASE + BAR_H / 2 + Math.sin(t * 1.6 + i * 0.7) * 0.18; });
    this.pockets.forEach((p, i) => { p.rotation.y = t * 0.3 + i; p.scale.setScalar(1 + Math.sin(t * 1.4 + i) * 0.05); });
  }
}
