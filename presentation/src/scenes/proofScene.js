import * as THREE from 'three';
import { BaseScene } from './baseScene.js';
import { COL, makeCard, plinth, matte, studioLights, RoundedBoxGeometry } from './diagram.js';
import { mulberry32 } from '../core/math.js';

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
const BAR_H = 10;
// five groups: no real photos at all, then 10, 25, 50 and 100% of them
const GROUPS = [
  { name: '0%', sub: 'no real photos', bars: [['Zero-shot', GREY], ['Renders only', COL.sim]] },
  { name: '10%', sub: '128 leaves', bars: [['Real only', COL.real], ['Real + renders', null]] },
  { name: '25%', sub: '312 leaves', bars: [['Real only', COL.real], ['Real + renders', null]] },
  { name: '50%', sub: '614 leaves', bars: [['Real only', COL.real], ['Real + renders', null]] },
  { name: '100%', sub: '1,225 leaves', bars: [['Real only', COL.real], ['Real + renders', null]] },
];
const GX = (k) => -20 + k * 10;

export class ProofScene extends BaseScene {
  build() {
    const g = this.group;
    this.t = 0;
    this.rig = studioLights(g, 120);

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
        const q = textMesh(2, 2, (ctx, w, h) => { ctx.fillStyle = color || COL.ink; ctx.font = '700 150px "Bricolage", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', w / 2, h / 2 + 6); }, 128);
        q.position.set(x, 0.8 + BAR_H / 2, 1.7);
        chart.add(q);
        this.bars.push(q);
      });
    });
    rig.add(chart);

    // the locked test: the same 261 BRACOL leaves for every run
    const test = new THREE.Group();
    test.add(plinth(15, 12, 0.8, '#ffffff', COL.real));
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
      const card = makeCard('studio', (r * 4 + c) % 9, COL.real, r === 0 && c === 0 ? 'TEST' : null, 0.95);
      card.position.set(-4.5 + c * 3.0, 2.4 + r * 2.6, -1.0 + r * 0.5); card.rotation.x = -0.2; test.add(card);
    }
    // a padlock: nothing trains on these
    const lock = new THREE.Group();
    const body = new THREE.Mesh(new RoundedBoxGeometry(3.0, 2.4, 1.4, 3, 0.35), matte(COL.ink, 0.4)); body.position.y = 1.2; body.castShadow = true; lock.add(body);
    const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.24, 12, 28, Math.PI), matte(COL.slate, 0.35)); shackle.position.y = 2.4; shackle.castShadow = true; lock.add(shackle);
    lock.position.set(0, 8.6, 1.2);
    test.add(lock);
    test.position.set(44, 0, 0);
    rig.add(test);
    rig.add(this._arrow([28, 1.5, 7.6], [38, 1.5, 5]));

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
    const spots = [[-26, 16, 4], [-24, 4, -12], [24, 20, -14], [28, 6, 12], [-6, 29, -4], [-6, -5, 16]];
    spots.forEach(([x, y, z]) => {
      const s = new THREE.Mesh(new THREE.SphereGeometry(3.4, 16, 12), new THREE.MeshBasicMaterial({ color: COL.alarm, wireframe: true, transparent: true, opacity: 0.55 }));
      s.position.set(x, y, z); cloud.add(s); this.pockets.push(s);
    });
    this._poses();
    this._tags();
    this.built = true;
  }

  _arrow(a, b) {
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(...a), new THREE.Vector3((a[0] + b[0]) / 2, 3.2, (a[2] + b[2]) / 2 + 1), new THREE.Vector3(...b)]);
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(30)), new THREE.LineDashedMaterial({ color: COL.ink, transparent: true, opacity: 0.5, dashSize: 0.45, gapSize: 0.3 }));
    l.computeLineDistances();
    return l;
  }

  _poses() {
    this.poses = {
      'proof-1': { pos: [14, 30, 94], target: [14, -9, 0], fov: 40, parallax: 0.5 },
      'proof-2': { pos: [8, 48, 100], target: [8, -4, 0], fov: 40, parallax: 0.7 },
    };
  }

  _tags() {
    const t = this.app.tags;
    const at = (x, y, z) => new THREE.Vector3(x, y, z);
    GROUPS.forEach((grp, k) => {
      t.add({ id: `pf-g${k}`, text: grp.name, sub: grp.sub, anchor: at(GX(k) - 2.5, BAR_H + 2.6, 0), side: 'r', len: 12, color: k === 0 ? COL.slate : COL.real, big: k === 0 });
    });
    t.add({ id: 'pf-test', text: 'Locked test', sub: '261 BRACOL leaves', anchor: at(44, 13.4, 1.2), side: 'r', len: 22, color: COL.real, big: true });
    t.add({ id: 'pf-metric', text: 'Score: AUC', sub: 'higher is better', anchor: at(GX(0) - 5.4, 0.8 + BAR_H * 0.55, 1.6), side: 'l', len: 18, color: COL.ink });
    t.add({ id: 'pc-x', text: 'Light', sub: 'dawn to overcast', anchor: at(16, 0, 11), side: 'r', len: 30, color: COL.slate });
    t.add({ id: 'pc-y', text: 'Backdrop', sub: 'plain to cluttered', anchor: at(-16, 22, 11), side: 'l', len: 30, color: COL.slate });
    t.add({ id: 'pc-z', text: 'Rust severity', sub: '0 to 4', anchor: at(16, 0, -11), side: 'r', len: 30, color: COL.slate });
    t.add({ id: 'pc-sim', text: 'Synthetic images', sub: 'fill the space', anchor: at(2, 16, 2), side: 'r', len: 40, color: COL.sim, big: true });
    t.add({ id: 'pc-real', text: 'Real photos', sub: 'a thin slice', anchor: at(9, 2.2, 7), side: 'r', len: 36, color: COL.real, big: true });
    ['Farm photos', 'Other diseases', 'Clean renders', 'A small test', 'Phones', 'Languages'].forEach((n, i) => {
      const p = [[-26, 16, 4], [-24, 4, -12], [24, 20, -14], [28, 6, 12], [-6, 29, -4], [-6, -5, 16]][i];
      t.add({ id: `pc-g${i}`, text: `<b class="num">${i + 1}</b>${n}`, anchor: at(p[0], p[1], p[2]), side: p[0] > 8 ? 'r' : 'l', len: 26, color: COL.alarm });
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
