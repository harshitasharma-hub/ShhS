import * as THREE from 'three';
import { BaseScene } from './baseScene.js';
import { COL, makeImageCard, plinth, matte, studioLights, fitShadow, RoundedBoxGeometry } from './diagram.js';
import { mulberry32 } from '../core/math.js';
import { RESULTS } from '../results.js';
import { fitFrame, boxPts } from '../core/frame.js';

// proof-1: the evidence plan. The scarcity curve as an empty chart: every bar is an outline with a "?",
//          because there are no results yet. Next to it, the locked test every run is scored on.
// proof-2: a map of what the data covers, and six regions outside it.

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
// six regions the data does not reach, just outside the cloud of synthetic images (x, y, z)
const POCKETS = [[-21, 15, 3], [-20, 5, -10], [20, 18, -12], [22, 6, 10], [-4, 25, -3], [13, -3, 13]];
// five groups: no real photos at all, then 10, 25, 50 and 100% of them
const GROUPS = [
  { name: '0%', sub: 'no real photos', bars: [['Zero-shot', GREY], ['Renders only', COL.sim]] },
  { name: '10%', sub: '128 leaves', bars: [['Real only', COL.real], ['Real + renders', null]] },
  { name: '25%', sub: '312 leaves', bars: [['Real only', COL.real], ['Real + renders', null]] },
  { name: '50%', sub: '614 leaves', bars: [['Real only', COL.real], ['Real + renders', null]] },
  { name: '100%', sub: '1,225 leaves', bars: [['Real only', COL.real], ['Real + renders', null]] },
];
const GX = (k) => -20 + k * 10;
const TEST_X = 41;                       // where the locked test stands

// The measured score for one bar, or null while the run has not been done.
// Scale: AUC 0.5 is chance (an empty bar) and 1.0 is perfect (the full outline).
function measured(k, j) {
  const frac = [null, '10', '25', '50', '100'][k];
  if (k === 0) return j === 0 ? RESULTS.zeroShot : RESULTS.syn && RESULTS.syn['0'];
  return (j === 0 ? RESULTS.real : RESULTS.mix)?.[frac] || null;
}
const yOf = (auc) => BAR_H * Math.max(0, Math.min(1, (auc - 0.5) / 0.5));

export class ProofScene extends BaseScene {
  build() {
    const g = this.group;
    this.t = 0;
    this.rig = studioLights(g, 120);
    fitShadow(this.rig, 8, 40, 36);

    // ---------------------------------------------------------- proof-1 rig
    const rig = new THREE.Group();
    this.rigGroup = rig;
    g.add(rig);
    const chart = new THREE.Group();
    const base = plinth(54, 14, 0.8, '#ffffff', COL.ink);
    chart.add(base);
    this.bars = [];
    GROUPS.forEach((grp, k) => {
      grp.bars.forEach(([, color], j) => {
        const x = GX(k) + (j ? 2.5 : -2.5);
        const add = (c, y0, h) => {
          const bar = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4.0, h, 3)), new THREE.LineDashedMaterial({ color: c, dashSize: 0.55, gapSize: 0.4 }));
          bar.computeLineDistances();
          bar.position.set(x, 0.8 + y0 + h / 2, 0);
          chart.add(bar);
          // a faint fill, so the empty bar still shows whose it is
          const fill = new THREE.Mesh(new THREE.BoxGeometry(4.0, h, 3), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.07, depthWrite: false }));
          fill.position.copy(bar.position);
          chart.add(fill);
        };
        // renders plus real is drawn as brown below, blue above: both sources in one bar
        if (color) add(color, 0, BAR_H);
        else { add(COL.real, 0, BAR_H / 2); add(COL.sim, BAR_H / 2, BAR_H / 2); }
        const m = measured(k, j);
        if (m && m.auc != null) {
          // a measured bar: filled up to its score, with the 95% interval and the number
          const H = Math.max(0.2, yOf(m.auc));
          const solid = (c, y0, h) => { const b = new THREE.Mesh(new RoundedBoxGeometry(4.0, h, 3, 2, 0.18), matte(c, 0.5)); b.position.set(x, 0.8 + y0 + h / 2, 0); b.castShadow = true; chart.add(b); };
          if (color) solid(color, 0, H); else { solid(COL.real, 0, H / 2); solid(COL.sim, H / 2, H / 2); }
          const lo = yOf(m.lo), hi = yOf(m.hi), ink = matte(COL.ink, 0.4);
          const stem = new THREE.Mesh(new THREE.BoxGeometry(0.16, Math.max(0.05, hi - lo), 0.16), ink); stem.position.set(x, 0.8 + (lo + hi) / 2, 1.7); chart.add(stem);
          for (const yy of [lo, hi]) { const cap = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.14, 0.16), ink); cap.position.set(x, 0.8 + yy, 1.7); chart.add(cap); }
          const val = textMesh(4.4, 2.2, (ctx, w, h) => {
            ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(4, 4, w - 8, h - 8, 26); ctx.fill();
            ctx.lineWidth = 6; ctx.strokeStyle = color || COL.ink; ctx.stroke();
            ctx.fillStyle = COL.ink; ctx.font = '700 84px "DMMono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(m.auc.toFixed(2), w / 2, h * 0.4);
            ctx.fillStyle = COL.slate; ctx.font = '500 38px "DMMono", monospace'; ctx.fillText(`${m.lo.toFixed(2)} to ${m.hi.toFixed(2)}`, w / 2, h * 0.76);
          }, 512);
          val.position.set(x, 0.8 + Math.max(hi, H) + 1.9, 1.8);
          chart.add(val);
        } else {
          const q = textMesh(2, 2, (ctx, w, h) => { ctx.fillStyle = color || COL.ink; ctx.font = '700 150px "Bricolage", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', w / 2, h / 2 + 6); }, 128);
          q.position.set(x, 0.8 + BAR_H / 2, 1.7);
          chart.add(q);
          this.bars.push(q);
        }
      });
    });
    // the scale: AUC 0.5 is chance, 1.0 is perfect
    [[0, '0.5 = chance'], [BAR_H, '1.0']].forEach(([y, txt]) => {
      const tick = textMesh(4.2, 1.0, (ctx, w, h) => { ctx.fillStyle = COL.slate; ctx.font = '500 52px "DMMono", monospace'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(txt, w - 6, h / 2); }, 512);
      tick.position.set(GX(0) - 7.6, 0.8 + y, 1.2);
      chart.add(tick);
    });
    rig.add(chart);

    // the locked test: the same 261 BRACOL leaves for every run
    const test = new THREE.Group();
    test.add(plinth(15, 12, 0.8, '#ffffff', COL.real));
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
      const card = makeImageCard(`test_${r * 3 + c + 1}`, COL.real, r === 0 && c === 0 ? 'TEST' : null, 1.5);
      card.position.set(-3.4 + c * 3.4, 2.0 + r * 1.85, -0.6 + r * 0.4); card.rotation.x = -0.2; test.add(card);
    }
    // a padlock: nothing trains on these
    const lock = new THREE.Group();
    const body = new THREE.Mesh(new RoundedBoxGeometry(3.0, 2.4, 1.4, 3, 0.35), matte(COL.ink, 0.4)); body.position.y = 1.2; body.castShadow = true; lock.add(body);
    const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.24, 12, 28, Math.PI), matte(COL.slate, 0.35)); shackle.position.y = 2.4; shackle.castShadow = true; lock.add(shackle);
    lock.position.set(0, 10.4, 1.2);
    test.add(lock);
    test.position.set(TEST_X, 0, 0);
    rig.add(test);
    rig.add(this._arrow([28, 1.5, 7.6], [TEST_X - 6.5, 1.5, 5]));

    // ---------------------------------------------------------- proof-2 cloud
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

  _arrow(a, b) {
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(...a), new THREE.Vector3((a[0] + b[0]) / 2, 3.2, (a[2] + b[2]) / 2 + 1), new THREE.Vector3(...b)]);
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(30)), new THREE.LineDashedMaterial({ color: COL.ink, transparent: true, opacity: 0.5, dashSize: 0.45, gapSize: 0.3 }));
    l.computeLineDistances();
    return l;
  }

  // What must be in the picture for each step. The camera is worked out from the stage (see core/frame.js).
  _frames() {
    this.frames = {
      // the chart and the locked test, with room for the labels under the bars, above the lock and left of the first bar
      'proof-1': { pts: [...boxPts(0, 7.8, 0, 56, 15.6, 14), ...boxPts(TEST_X, 6.5, 0, 16, 13, 13), [TEST_X, 19.5, 0], [-37, 9, 0], [0, -5.2, 6], [20, -5.2, 6]], az: 0, el: 16, fov: 28, pad: [0.03, 0.05], parallax: 0.3 },
      // the cloud of synthetic images and the six regions it does not reach
      'proof-2': { pts: [...boxPts(0, 11, 0, 32, 22, 22), ...POCKETS.flatMap(([x, y, z]) => boxPts(x, y, z, 7, 7, 7)), [-36, 15, 3], [36, 18, -12], [0, 33, -3], [26, -4, 13], [-34, 4, -10]], az: -6, el: 24, fov: 30, pad: [0.04, 0.06], parallax: 0.35 },
    };
  }

  pose(id) { return fitFrame(this.frames[id], this.app.layout.aspect); }

  _tags() {
    const t = this.app.tags;
    const at = (x, y, z) => new THREE.Vector3(x, y, z);
    GROUPS.forEach((grp, k) => {
      t.add({ id: `pf-g${k}`, text: grp.name, sub: grp.sub, anchor: at(GX(k), 0.85, 5.6), side: 'd', len: 12, color: k === 0 ? COL.slate : COL.real, big: k === 0 });
    });
    t.add({ id: 'pf-test', text: 'Locked test', sub: '261 BRACOL leaves', anchor: at(TEST_X, 14.2, 1.2), side: 'u', len: 14, color: COL.real, big: true });
    t.add({ id: 'pf-metric', text: 'Score: AUC', sub: 'higher is better', anchor: at(GX(0) - 4.55, 0.8 + BAR_H * 0.55, 1.6), side: 'l', len: 18, color: COL.ink });
    t.add({ id: 'pc-x', text: 'Light', sub: 'dawn to overcast', anchor: at(16, 0, 11), side: 'r', len: 30, color: COL.slate });
    t.add({ id: 'pc-y', text: 'Backdrop', sub: 'plain to cluttered', anchor: at(-16, 22, 11), side: 'l', len: 30, color: COL.slate });
    t.add({ id: 'pc-z', text: 'Rust severity', sub: '0 to 4', anchor: at(16, 0, -11), side: 'r', len: 30, color: COL.slate });
    t.add({ id: 'pc-sim', text: 'Synthetic images', sub: 'fill the space', anchor: at(2, 16, 2), side: 'r', len: 40, color: COL.sim, big: true });
    t.add({ id: 'pc-real', text: 'Real photos', sub: 'a thin slice', anchor: at(9, 2.2, 7), side: 'l', len: 30, color: COL.real, big: true });
    ['Farm photos', 'Other diseases', 'Clean renders', 'A small test', 'Phones', 'Languages'].forEach((n, i) => {
      const p = POCKETS[i];
      t.add({ id: `pc-g${i}`, text: `<b class="num">${i + 1}</b>${n}`, anchor: at(p[0], p[1], p[2]), side: i === 4 ? 'u' : i === 5 ? 'd' : p[0] > 8 ? 'r' : 'l', len: 16, color: COL.alarm });
    });
  }

  enter(id) {
    const t = this.app.tags;
    this.rigGroup.visible = id === 'proof-1';
    this.cloud.visible = id === 'proof-2';
    if (id === 'proof-1') t.only(['pf-g0', 'pf-g1', 'pf-g2', 'pf-g3', 'pf-g4', 'pf-test', 'pf-metric']);
    else t.only(['pc-x', 'pc-y', 'pc-z', 'pc-sim', 'pc-real', 'pc-g0', 'pc-g1', 'pc-g2', 'pc-g3', 'pc-g4', 'pc-g5']);
  }

  update(dt, tt, motion = true) {
    if (motion) this.t += dt;
    const t = this.t;
    this.bars.forEach((q, i) => { q.position.y = 0.8 + BAR_H / 2 + Math.sin(t * 1.6 + i * 0.7) * 0.18; });
    this.pockets.forEach((p, i) => { p.rotation.y = t * 0.3 + i; p.scale.setScalar(1 + Math.sin(t * 1.4 + i) * 0.05); });
  }
}
