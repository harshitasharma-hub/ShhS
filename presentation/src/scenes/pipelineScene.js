import * as THREE from 'three';
import { BaseScene } from './baseScene.js';
import { COL, makeCard, cardTexture, Flow, guide, plinth, edges, matte, studioLights, RoundedBoxGeometry } from './diagram.js';
import { damp, easeOut, mulberry32 } from '../core/math.js';

// The plan, as a model you can walk around.
//   back row:  Blender leaf -> Blender scene -> render -> synthetic set   (all synthetic)
//   front row: BRACOL photos (real) -> Gemma 4 E2B with LoRA -> test and phone
//   left:      the scarcity staircase, 10 / 25 / 50 / 100% of the real photos
// Nothing here spreads or grows. The leaf in station 2 just gets new spots on every image.

const P = {
  real: [0, 0, 10], scar: [-27, 0, 10], s1: [-24, 0, -14], s2: [0, 0, -14], s3: [24, 0, -14], s4: [48, 0, -14], s5: [38, 0, 10], s6: [72, 0, 10],
};

const STEPS = ['rec-1', 'rec-2', 'rec-3', 'rec-4', 'rec-5', 'rec-6', 'rec-7', 'rec-8'];
const ADD = {
  'rec-1': ['real', 's5', 's6'],
  'rec-2': ['s1', 's2'],
  'rec-3': ['s3'],
  'rec-4': ['s4', 'syn'],
  'rec-5': ['s5x'],
  'rec-6': ['scar'],
  'rec-7': ['s6x', 'real2'],
  'rec-8': [],
};
const SHOW = {};
STEPS.forEach((id, i) => { SHOW[id] = STEPS.slice(0, i + 1).flatMap((k) => ADD[k]); });

function trapezoid(wTop, wBot, h, depth, color) {
  const s = new THREE.Shape();
  s.moveTo(-wBot / 2, 0); s.lineTo(wBot / 2, 0); s.lineTo(wTop / 2, h); s.lineTo(-wTop / 2, h); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: 0.12, bevelThickness: 0.12, bevelSegments: 2 });
  g.translate(0, 0, -depth / 2);
  const m = new THREE.Mesh(g, matte(color, 0.5));
  m.castShadow = true; m.receiveShadow = true;
  edges(m, COL.ink, 0.25, 35);
  return m;
}
void trapezoid;

function textPlane(w, h, draw, px = 512) {
  const c = document.createElement('canvas');
  c.width = px; c.height = Math.round(px * (h / w));
  const ctx = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide }));
  m.userData.redraw = () => { ctx.clearRect(0, 0, c.width, c.height); draw(ctx, c.width, c.height); tex.needsUpdate = true; };
  m.userData.redraw();
  return m;
}

const rrect = (ctx, x, y, w, h, r) => {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
};

// a rust severity (0 to 4) from a spot count, so the label on the render matches what is drawn
const severityOf = (n) => (n === 0 ? 0 : n <= 3 ? 1 : n <= 6 ? 2 : n <= 10 ? 3 : 4);
const SPOT_COUNTS = [0, 2, 5, 8, 13, 17];

export class PipelineScene extends BaseScene {
  build(progress) {
    const g = this.group;
    this.rig = studioLights(g, 130);
    this.items = {};
    this.flows = [];
    this.t = 0;
    const reg = (name, group, pos) => {
      group.position.set(...pos);
      group.userData.cur = 0; group.userData.tgt = 0; group.userData.base = pos[1];
      this.items[name] = group; g.add(group);
      return group;
    };

    reg('real', this._real(), P.real);
    reg('s1', this._s1(), P.s1);
    reg('s2', this._s2(), P.s2);
    reg('s3', this._s3(), P.s3);
    reg('s4', this._s4(), P.s4);
    reg('syn', this._synBranch(), [0, 0, 0]);
    reg('s5', this._s5(), P.s5);
    reg('s5x', this._s5x(), P.s5);
    reg('s6', this._s6(), P.s6);
    reg('s6x', this._s6x(), P.s6);
    reg('real2', this._realBranch(), [0, 0, 0]);
    reg('scar', this._scar(), P.scar);
    progress && progress(0.8);
    this._poses();
    this._tags();
    this.built = true;
  }

  // ------------------------------------------------------------ stations
  _real() {
    // BRACOL: single leaves on plain light backgrounds
    const g = new THREE.Group();
    g.add(plinth(15, 8, 0.9, '#ffffff', COL.real));
    const n = 9;
    for (let i = 0; i < n; i++) {
      const c = makeCard('studio', i, COL.real, i === 0 ? 'BRACOL' : null, 1.15);
      c.position.set(-5.6 + i * 1.4, 2.3, 0.4 - i * 0.05);
      c.rotation.y = -0.35 + i * 0.01;
      c.rotation.x = -0.1;
      g.add(c);
    }
    // the train photos travel to the model
    const items = [];
    for (let i = 0; i < 7; i++) { const c = makeCard('studio', i + 20, COL.real, null, 0.55); g.add(c); items.push(c); }
    const f = new Flow([[8, 1.6, 0], [16, 1.6, 0], [24, 1.6, 0], [30, 1.6, 0]], items, { speed: 0.06, fade: 0.1 });
    f.group = 'real'; this.flows.push(f);
    g.userData.guide = guide([[8, 0.4, 0.2], [18, 0.4, 0.2], [30, 0.4, 0.2]], COL.real, 0.6);
    g.add(g.userData.guide);
    return g;
  }

  _s1() {
    // the Blender leaf: a ladder of five leaves, severity 0 (healthy) to 4
    const g = new THREE.Group();
    g.add(plinth(17, 11, 0.9, '#ffffff', COL.sim));
    this.ladder = [];
    for (let st = 0; st < 5; st++) {
      const tp = textPlane(3, 3.6, (ctx, w, h) => {
        ctx.fillStyle = '#fff'; rrect(ctx, 4, 4, w - 8, h - 8, 36); ctx.fill();
        ctx.lineWidth = 8; ctx.strokeStyle = COL.sim; ctx.stroke();
        ctx.save(); ctx.translate(w / 2, h * 0.43); ctx.rotate(-0.45);
        ctx.beginPath(); ctx.moveTo(-w * 0.34, 0); ctx.bezierCurveTo(-w * 0.17, -h * 0.26, w * 0.17, -h * 0.26, w * 0.34, 0); ctx.bezierCurveTo(w * 0.17, h * 0.26, -w * 0.17, h * 0.26, -w * 0.34, 0);
        ctx.fillStyle = '#1f6b3a'; ctx.fill();
        const rng = mulberry32(5 + st);
        const nSp = [0, 3, 6, 10, 16][st];
        for (let k = 0; k < nSp; k++) {
          const x = (rng() - 0.5) * w * 0.5, y = (rng() - 0.5) * h * 0.2, r = 7 + st * 5 * rng();
          ctx.fillStyle = 'rgba(240,215,60,0.95)'; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.28); ctx.fill();
          ctx.fillStyle = st >= 3 ? '#4a2a12' : 'rgba(210,95,14,0.95)'; ctx.beginPath(); ctx.arc(x, y, r * 0.5, 0, 6.28); ctx.fill();
        }
        ctx.restore();
        ctx.fillStyle = COL.ink; ctx.font = '600 40px "DMMono", monospace'; ctx.textAlign = 'center'; ctx.fillText(`severity ${st}`, w / 2, h * 0.9);
      }, 384);
      tp.position.set(-6.4 + st * 3.2, 3.0, 0.5);
      tp.rotation.y = 0.12;
      g.add(tp);
      this.ladder.push(tp);
    }
    // what changes from image to image
    const rules = textPlane(9, 2.4, (ctx, w, h) => {
      ctx.fillStyle = '#fff'; rrect(ctx, 4, 4, w - 8, h - 8, 28); ctx.fill();
      ctx.lineWidth = 6; ctx.strokeStyle = COL.sim; ctx.stroke();
      ctx.fillStyle = COL.ink; ctx.font = '700 38px "Instrument", sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('Rust spots: number, size, place', 34, 70);
      ctx.font = '400 30px "Instrument", sans-serif'; ctx.fillStyle = COL.slate;
      ctx.fillText('Severity 0 to 4, the same scale as BRACOL', 34, 124);
    }, 720);
    rules.position.set(0, 0.95, 4.4);
    rules.rotation.x = -0.9;
    g.add(rules);
    return g;
  }

  _backdrop(kind) {
    const c = document.createElement('canvas'); c.width = 384; c.height = 256;
    const ctx = c.getContext('2d'); const rng = mulberry32(300 + kind * 17);
    if (kind === 0) {
      // plain and light, like the BRACOL photos
      const gr = ctx.createRadialGradient(192, 120, 20, 192, 128, 230);
      gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#e3e7f0');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, 384, 256);
    } else if (kind === 1) {
      // soil
      ctx.fillStyle = '#7a4d33'; ctx.fillRect(0, 0, 384, 256);
      for (let i = 0; i < 260; i++) { ctx.fillStyle = `rgba(${40 + rng() * 60},${22 + rng() * 30},${10 + rng() * 20},0.35)`; ctx.beginPath(); ctx.arc(rng() * 384, rng() * 256, 3 + rng() * 14, 0, 6.283); ctx.fill(); }
    } else {
      // other leaves
      ctx.fillStyle = '#1e4a2e'; ctx.fillRect(0, 0, 384, 256);
      for (let i = 0; i < 40; i++) {
        ctx.save(); ctx.translate(rng() * 384, rng() * 256); ctx.rotate(rng() * 6.28);
        ctx.fillStyle = `hsl(${105 + rng() * 40},${35 + rng() * 25}%,${16 + rng() * 22}%)`;
        ctx.beginPath(); ctx.ellipse(0, 0, 40 + rng() * 40, 14 + rng() * 14, 0, 0, 6.283); ctx.fill(); ctx.restore();
      }
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    return t;
  }

  _leafGeometry() {
    const L = 5.6, Wd = 1.7;
    const s = new THREE.Shape();
    s.moveTo(-L / 2, 0);
    s.bezierCurveTo(-L * 0.25, Wd * 1.1, L * 0.2, Wd * 1.05, L / 2, 0);
    s.bezierCurveTo(L * 0.2, -Wd * 1.05, -L * 0.25, -Wd * 1.1, -L / 2, 0);
    const geo = new THREE.ShapeGeometry(s, 28);
    const pos = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      uv.setXY(i, x / L + 0.5, y / (Wd * 2.2) + 0.5);
      pos.setZ(i, 0.28 * (1 - ((2 * x) / L) ** 2) - 0.1 * (y / Wd) ** 2); // a gentle fold
    }
    geo.computeVertexNormals();
    return geo;
  }

  _drawLeaf(seed, n) {
    const c = this.leafCanvas, ctx = c.getContext('2d'), w = c.width, h = c.height;
    const rng = mulberry32(seed);
    const gr = ctx.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#2f7a46'); gr.addColorStop(0.5, '#236538'); gr.addColorStop(1, '#2f7a46');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    ctx.lineWidth = 2;
    for (let i = 1; i < 9; i++) {
      const x = (i / 9) * w;
      ctx.beginPath(); ctx.moveTo(x, h / 2); ctx.lineTo(x + 40, h / 2 - 70); ctx.moveTo(x, h / 2); ctx.lineTo(x + 40, h / 2 + 70); ctx.stroke();
    }
    for (let i = 0; i < n; i++) {
      const x = w * (0.1 + 0.8 * rng()), y = h * (0.3 + 0.4 * rng()), r = 7 + rng() * 14;
      ctx.fillStyle = 'rgba(235, 214, 70, 0.95)'; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
      ctx.fillStyle = 'rgba(205, 92, 14, 0.95)'; ctx.beginPath(); ctx.arc(x, y, r * 0.5, 0, 6.283); ctx.fill();
    }
    this.leafTex.needsUpdate = true;
  }

  _s2() {
    // the Blender scene: one leaf, a light, a camera and a backdrop. Every 2 seconds it is a new image.
    const g = new THREE.Group();
    g.add(plinth(20, 14, 0.9, '#ffffff', COL.sim));
    this.bgTex = [0, 1, 2].map((k) => this._backdrop(k));
    const frame = new THREE.Mesh(new RoundedBoxGeometry(11.6, 7.6, 0.3, 2, 0.15), matte(COL.ink, 0.5));
    frame.position.set(0, 5.0, -4.7); frame.castShadow = true; g.add(frame);
    this.bg = new THREE.Mesh(new THREE.PlaneGeometry(11, 7), new THREE.MeshBasicMaterial({ map: this.bgTex[0] }));
    this.bg.position.set(0, 5.0, -4.53); g.add(this.bg);

    this.leafCanvas = document.createElement('canvas'); this.leafCanvas.width = 512; this.leafCanvas.height = 256;
    this.leafTex = new THREE.CanvasTexture(this.leafCanvas);
    this.leafTex.colorSpace = THREE.SRGBColorSpace; this.leafTex.anisotropy = 4;
    this.reseed = 0;
    this._drawLeaf(11, SPOT_COUNTS[2]);
    const leaf = new THREE.Mesh(this._leafGeometry(), new THREE.MeshStandardMaterial({ map: this.leafTex, roughness: 0.55, side: THREE.DoubleSide }));
    leaf.position.set(0, 4.8, -1.2);
    leaf.castShadow = true;
    g.add(leaf);
    this.leaf = leaf;

    // the label that comes with each image
    this.curLabel = 'rust yes · severity 2';
    this.labelPlane = textPlane(7.6, 1.5, (ctx, w, h) => {
      ctx.fillStyle = '#fff'; rrect(ctx, 4, 4, w - 8, h - 8, 30); ctx.fill();
      ctx.lineWidth = 6; ctx.strokeStyle = COL.sim; ctx.stroke();
      ctx.fillStyle = COL.slate; ctx.font = '500 26px "DMMono", monospace'; ctx.textAlign = 'left'; ctx.fillText('LABEL', 36, 52);
      ctx.fillStyle = COL.ink; ctx.font = '700 44px "Instrument", sans-serif'; ctx.fillText(this.curLabel, 36, 112);
    }, 640);
    this.labelPlane.position.set(0, 1.55, 5.2);
    this.labelPlane.rotation.x = -0.75;
    g.add(this.labelPlane);

    // a camera that moves around the leaf, and a light that crosses the sky
    const cam = new THREE.Group();
    const body = new THREE.Mesh(new RoundedBoxGeometry(1.7, 1.2, 1.0, 2, 0.2), matte(COL.ink, 0.35)); body.castShadow = true; cam.add(body);
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.8, 20), matte('#0b0d22', 0.2));
    lens.rotation.x = Math.PI / 2; lens.position.z = 0.85; cam.add(lens);
    g.add(cam); this.cam3 = cam;
    this.sun = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 14), new THREE.MeshBasicMaterial({ color: '#ffd27a' }));
    g.add(this.sun);
    const arc = new THREE.Line(new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0, 0, 9, 5, 0, Math.PI, false, 0).getPoints(50).map((p) => new THREE.Vector3(p.x, p.y + 7, -2))),
      new THREE.LineDashedMaterial({ color: COL.ink, transparent: true, opacity: 0.35, dashSize: 0.4, gapSize: 0.3 }));
    arc.computeLineDistances();
    g.add(arc);
    return g;
  }

  _s3() {
    const g = new THREE.Group();
    g.add(plinth(17, 11, 0.9, '#ffffff', COL.sim));
    // the virtual camera, shaped like a phone
    const phone = new THREE.Group();
    const body = new THREE.Mesh(new RoundedBoxGeometry(2.4, 4.6, 0.36, 3, 0.3), matte(COL.ink, 0.35));
    body.castShadow = true;
    phone.add(body);
    const screen = textPlane(2.0, 4.1, (ctx, w, h) => {
      ctx.fillStyle = '#0d1030'; ctx.fillRect(0, 0, w, h);
      const img = cardTexture('sim', 3, null, null).image;
      ctx.drawImage(img, 14, 60, w - 28, h * 0.62);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; const m = 34, L = 40;
      for (const [x, y, dx, dy] of [[m, 56, 1, 1], [w - m, 56, -1, 1], [m, h * 0.62 + 56, 1, -1], [w - m, h * 0.62 + 56, -1, -1]]) { ctx.beginPath(); ctx.moveTo(x, y + dy * L); ctx.lineTo(x, y); ctx.lineTo(x + dx * L, y); ctx.stroke(); }
      ctx.fillStyle = '#f2552c'; ctx.beginPath(); ctx.arc(40, 34, 9, 0, 6.28); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(w / 2, h - 70, 30, 0, 6.28); ctx.fill();
      ctx.fillStyle = '#0d1030'; ctx.beginPath(); ctx.arc(w / 2, h - 70, 22, 0, 6.28); ctx.fill();
    }, 256);
    screen.position.z = 0.19; phone.add(screen);
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.12, 24), matte('#0b0d22', 0.2));
    lens.rotation.x = Math.PI / 2; lens.position.set(-0.6, 1.9, -0.22); phone.add(lens);
    phone.position.set(-5.2, 3.2, 1.2);
    phone.rotation.y = 0.45;
    g.add(phone);
    this.phone = phone;
    // knobs panel: what changes on every image
    this.knobs = textPlane(9.2, 6.2, (ctx, w, h) => this._drawKnobs(ctx, w, h), 768);
    this.knobs.position.set(2.2, 4.1, 2.2);
    this.knobs.rotation.y = -0.18;
    g.add(this.knobs);
    this.knobVals = [0.2, 0.7, 0.4, 0.15, 0.6]; this.knobTgt = [0.5, 0.3, 0.8, 0.5, 0.2]; this.knobT = 0;
    // image and label leave toward the synthetic set
    const items = [];
    for (let i = 0; i < 6; i++) {
      const pair = new THREE.Group();
      const a = makeCard('sim', i, COL.sim, 'SYNTHETIC', 1); const b = makeCard('mask', i, COL.sim, 'LABEL', 1);
      a.position.y = 1.15; b.position.y = -1.15;
      pair.add(a, b); pair.scale.setScalar(0.5);
      g.add(pair); items.push(pair);
    }
    const f = new Flow([[9, 3.0, 2], [14, 3.0, 0], [19, 3.0, 0]], items, { speed: 0.05, fade: 0.12 });
    f.group = 's3'; this.flows.push(f);
    this.pairFlow = f;
    return g;
  }

  _drawKnobs(ctx, w, h) {
    ctx.fillStyle = '#fff'; rrect(ctx, 6, 6, w - 12, h - 12, 36); ctx.fill();
    ctx.lineWidth = 8; ctx.strokeStyle = COL.sim; ctx.stroke();
    ctx.fillStyle = COL.ink; ctx.font = '700 44px "Instrument", sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('Changes on every image', 44, 82);
    const names = ['Rust spots', 'Light', 'Camera angle', 'Distance', 'Background'];
    names.forEach((n, i) => {
      const y = 150 + i * 72;
      ctx.fillStyle = COL.slate; ctx.font = '400 34px "Instrument", sans-serif'; ctx.fillText(n, 44, y + 10);
      ctx.fillStyle = '#e1e6f2'; rrect(ctx, 330, y - 8, 380, 16, 8); ctx.fill();
      ctx.fillStyle = COL.sim; rrect(ctx, 330, y - 8, 380 * (this.knobVals?.[i] ?? 0.5), 16, 8); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.strokeStyle = COL.ink; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(330 + 380 * (this.knobVals?.[i] ?? 0.5), y, 17, 0, 6.28); ctx.fill(); ctx.stroke();
    });
  }

  _s4() {
    // the synthetic set: a folder of renders and the table our training script reads
    const g = new THREE.Group();
    g.add(plinth(20, 11, 0.9, '#ffffff', COL.sim));
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
      const card = makeCard('sim', r * 6 + c + 2, COL.sim, r === 0 && c === 0 ? 'SYNTHETIC' : null, 0.62);
      card.position.set(-8.2 + c * 1.35, 1.9 + r * 1.35, 1.6 - r * 0.5);
      card.rotation.x = -0.45;
      g.add(card);
    }
    const table = textPlane(8.4, 6.0, (ctx, w, h) => {
      ctx.fillStyle = '#fff'; rrect(ctx, 6, 6, w - 12, h - 12, 34); ctx.fill();
      ctx.lineWidth = 8; ctx.strokeStyle = COL.sim; ctx.stroke();
      ctx.fillStyle = COL.ink; ctx.font = '700 40px "DMMono", monospace'; ctx.textAlign = 'left';
      ctx.fillText('manifest.csv', 40, 74);
      ctx.fillStyle = COL.slate; ctx.font = '500 30px "DMMono", monospace';
      ctx.fillText('image', 40, 138); ctx.fillText('rust', 400, 138); ctx.fillText('split', 520, 138);
      ctx.fillStyle = COL.fog; ctx.fillRect(40, 154, w - 80, 3);
      const rows = [['leaf_0001.png', 1], ['leaf_0002.png', 0], ['leaf_0003.png', 1], ['leaf_0004.png', 0], ['leaf_0005.png', 1]];
      rows.forEach(([name, rust], i) => {
        const y = 204 + i * 52;
        ctx.fillStyle = COL.ink; ctx.font = '400 30px "DMMono", monospace'; ctx.fillText(name, 40, y);
        ctx.fillStyle = rust ? COL.alarm : COL.healthy; ctx.font = '700 30px "DMMono", monospace'; ctx.fillText(String(rust), 410, y);
        ctx.fillStyle = COL.ink; ctx.font = '400 30px "DMMono", monospace'; ctx.fillText('train', 520, y);
      });
    }, 640);
    table.position.set(5.0, 4.3, 1.0);
    table.rotation.y = -0.22;
    g.add(table);
    return g;
  }

  _synBranch() {
    // the renders join the real photos at the model
    const g = new THREE.Group();
    const pts = [[48, 2.0, -8], [45, 2.6, -2], [41, 2.6, 3], [39, 2.4, 5.4]];
    g.add(guide(pts, COL.sim, 0.6));
    const items = [];
    for (let i = 0; i < 5; i++) { const c = makeCard('sim', 70 + i, COL.sim, null, 0.5); g.add(c); items.push(c); }
    const f = new Flow(pts, items, { speed: 0.05, fade: 0.1 });
    f.group = 'syn'; this.flows.push(f);
    return g;
  }

  _realBranch() {
    // real test photos go to the test bench and never to training
    const g = new THREE.Group();
    g.add(guide([[6, 0.3, 12], [26, 0.3, 17], [50, 0.3, 17], [66, 0.3, 14]], COL.real, 0.55));
    const items = [];
    for (let i = 0; i < 4; i++) { const c = makeCard(i % 2 ? 'field' : 'studio', 50 + i, COL.real, null, 0.5); g.add(c); items.push(c); }
    const f = new Flow([[6, 1.0, 12], [26, 1.0, 17], [50, 1.0, 17], [66, 1.4, 14]], items, { speed: 0.04, fade: 0.1 });
    f.group = 'real2'; this.flows.push(f);
    return g;
  }

  _s5() {
    // the model: a stack of layers. Always present.
    const g = new THREE.Group();
    g.add(plinth(15, 11, 0.9, '#ffffff', COL.ink));
    this.layers = [];
    for (let i = 0; i < 8; i++) {
      const trained = i >= 6;
      const m = new THREE.Mesh(new RoundedBoxGeometry(8.6, 0.62, 6.2, 2, 0.12), matte(trained ? COL.ink : '#dfe4f2', 0.5));
      m.position.set(0, 1.3 + i * 0.86, 0);
      m.castShadow = true; m.receiveShadow = true;
      edges(m, COL.ink, trained ? 0.0 : 0.25, 30);
      g.add(m);
      this.layers.push(m);
    }
    return g;
  }

  _s5x() {
    // the LoRA layer on top, the three answers, and the three training mixes
    const g = new THREE.Group();
    for (let i = 6; i < 8; i++) {
      const lug = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.5, 5.2, 2, 0.1), matte(COL.ink, 0.4));
      lug.position.set(4.6, 1.3 + i * 0.86, 0); g.add(lug);
    }
    const outs = [[COL.alarm, 0.0], [COL.healthy, 1.4], ['#c9d0e6', 2.8]]; // rust, no rust, not sure
    outs.forEach(([c, z], i) => {
      const o = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.1, 20), matte(c, 0.35));
      o.rotation.z = Math.PI / 2; o.position.set(6.2, 3.6 + i * 0.0, -1.4 + z); o.castShadow = true;
      g.add(o);
    });
    // what each run trains on: real only (brown), renders only (blue), renders plus real (both)
    this.phases = [];
    const mix = [[0, 1], [1, 0], [0.5, 0.5]];
    mix.forEach(([s, r], i) => {
      const grp = new THREE.Group();
      const H = 4.2;
      if (s > 0) { const b = new THREE.Mesh(new RoundedBoxGeometry(1.5, H * s, 1.5, 2, 0.1), matte(COL.sim, 0.5)); b.position.y = H * r + (H * s) / 2; b.castShadow = true; grp.add(b); }
      if (r > 0) { const b = new THREE.Mesh(new RoundedBoxGeometry(1.5, H * r, 1.5, 2, 0.1), matte(COL.real, 0.5)); b.position.y = (H * r) / 2; b.castShadow = true; grp.add(b); }
      grp.position.set(-5.4 + i * 2.1, 0.95, 7.2);
      g.add(grp); this.phases.push(grp);
    });
    return g;
  }

  _s6() {
    // the test, and the end of the line: the model that goes to a phone
    const g = new THREE.Group();
    g.add(plinth(15, 11, 0.9, '#ffffff', COL.ink));
    const m = new THREE.Mesh(new RoundedBoxGeometry(4.2, 3.4, 4.2, 3, 0.4), matte('#cfd5e8', 0.45));
    m.position.set(0, 2.8, 0); m.castShadow = true;
    edges(m, COL.ink, 0.3, 30);
    g.add(m);
    this.endModel = m;
    return g;
  }

  _s6x() {
    // the model shrinks to a chip for the phone, and the test bench shows what it is scored on
    const g = new THREE.Group();
    const chip = new THREE.Mesh(new RoundedBoxGeometry(1.3, 0.5, 1.3, 2, 0.12), matte(COL.ink, 0.35));
    chip.position.set(-4.6, 1.3, 3.2); chip.castShadow = true; g.add(chip);
    this.chip = chip;
    const bench = [];
    for (let i = 0; i < 4; i++) {
      const c = makeCard(i < 2 ? 'studio' : 'field', 60 + i, COL.real, i < 2 ? 'TEST' : 'FARM', 0.82);
      c.position.set(-3.3 + i * 2.2, 1.9, 5.0);
      c.rotation.x = -0.15;
      g.add(c); bench.push(c);
    }
    this.bench = bench;
    return g;
  }

  _scar() {
    // the scarcity staircase: 10, 25, 50 and 100% of the real photos, with the same renders added on top
    const g = new THREE.Group();
    g.add(plinth(21, 11, 0.9, '#ffffff', COL.real));
    this.scarTops = [];
    [0.1, 0.25, 0.5, 1.0].forEach((f, i) => {
      const H = 0.8 + f * 5.2;
      const x = -7.2 + i * 4.8;
      const real = new THREE.Mesh(new RoundedBoxGeometry(3.6, H, 3.6, 3, 0.35), matte(COL.real, 0.5));
      real.position.set(x, 0.9 + H / 2, 0.4); real.castShadow = true; real.receiveShadow = true; edges(real, COL.ink, 0.25, 30); g.add(real);
      const syn = new THREE.Mesh(new RoundedBoxGeometry(3.6, 1.3, 3.6, 3, 0.35), matte(COL.sim, 0.45));
      syn.position.set(x, 0.9 + H + 0.75, 0.4); syn.castShadow = true; g.add(syn);
      this.scarTops.push(syn);
    });
    return g;
  }

  // ------------------------------------------------------------ camera + tags
  _poses() {
    // the text card sits low and left, so each station is framed up and to the right
    this.poses = {
      'rec-1': { pos: [34, 46, 104], target: [34, -14, 8], fov: 40, parallax: 0.5 },
      'rec-2': { pos: [-12, 32, 44], target: [-12, -4, -12], fov: 38, parallax: 0.5 },
      'rec-3': { pos: [30, 28, 36], target: [30, -4, -12], fov: 34, parallax: 0.5 },
      'rec-4': { pos: [44, 36, 44], target: [44, -3, -4], fov: 38, parallax: 0.5 },
      'rec-5': { pos: [34, 30, 58], target: [37, 1, 6], fov: 36, parallax: 0.5 },
      'rec-6': { pos: [-24, 30, 50], target: [-24, 0, 6], fov: 38, parallax: 0.5 },
      'rec-7': { pos: [60, 30, 50], target: [62, 0, 8], fov: 36, parallax: 0.5 },
      'rec-8': { pos: [26, 90, 80], target: [26, -10, 2], fov: 44, parallax: 0.4 },
    };
  }

  _tags() {
    const t = this.app.tags;
    const at = (x, y, z) => new THREE.Vector3(x, y, z);
    t.add({ id: 'p-real', text: 'BRACOL', sub: 'real leaves · train 1,225 · test 261', anchor: at(-4, 4.6, 0), side: 'r', len: 22, color: COL.real, big: true });
    t.add({ id: 'p-s1', text: 'Blender leaf', sub: '3D leaf, rust material, severity 0 to 4', anchor: at(...P.s1).add(at(0, 5.8, 0)), side: 'l', len: 40, color: COL.sim, big: true });
    t.add({ id: 'p-s2', text: 'Blender scene', sub: 'leaf, light, camera, backdrop', anchor: at(...P.s2).add(at(0, 9.6, 0)), side: 'r', len: 40, color: COL.sim, big: true });
    t.add({ id: 'p-s3', text: 'Render', sub: 'an image and its label, every time', anchor: at(...P.s3).add(at(0, 6.2, 0)), side: 'r', len: 40, color: COL.sim, big: true });
    t.add({ id: 'p-s4', text: 'Synthetic set', sub: 'images + table: image, rust, split', anchor: at(...P.s4).add(at(0, 7.6, 0)), side: 'r', len: 40, color: COL.sim, big: true });
    t.add({ id: 'p-blender', text: 'Blender', sub: 'leaf, scene, render', anchor: at(10, 9.4, -14), side: 'r', len: 40, color: COL.sim, big: true });
    t.add({ id: 'p-syn', text: 'Renders join the real photos', anchor: at(44, 3.4, -1), side: 'r', len: 30, color: COL.sim });
    t.add({ id: 'p-s5', text: 'Gemma 4 E2B', sub: '2.3B effective parameters', anchor: at(P.s5[0] - 4.3, 9.4, P.s5[2] + 3), side: 'l', len: 26, color: COL.ink, big: true });
    t.add({ id: 'p-frozen', text: 'Frozen', sub: 'the base model', anchor: at(P.s5[0] - 4.3, 3.4, P.s5[2]), side: 'l', len: 26, color: '#9aa3c6' });
    t.add({ id: 'p-train', text: 'LoRA', sub: 'a thin layer we train', anchor: at(P.s5[0] + 4.6, 7.2, P.s5[2]), side: 'r', len: 26, color: COL.ink });
    t.add({ id: 'p-out', text: 'Answers', sub: 'rust · no rust · not sure', anchor: at(P.s5[0] + 6.4, 3.9, P.s5[2]), side: 'r', len: 36, color: COL.alarm });
    t.add({ id: 'p-pa', text: 'Real only', sub: 'step 1', anchor: at(P.s5[0] - 5.4, 5.6, P.s5[2] + 7.2), side: 'l', len: 20, color: COL.real });
    t.add({ id: 'p-pb', text: 'Renders only', sub: 'step 3', anchor: at(P.s5[0] - 3.3, 7.8, P.s5[2] + 7.2), side: 'r', len: 16, color: COL.sim });
    t.add({ id: 'p-pc', text: 'Renders + real', sub: 'step 4', anchor: at(P.s5[0] - 1.2, 5.6, P.s5[2] + 7.2), side: 'r', len: 24, color: COL.ink });
    t.add({ id: 'p-s6', text: 'Test', sub: '261 BRACOL leaves no run trains on', anchor: at(...P.s6).add(at(0, 6.4, 0)), side: 'l', len: 30, color: COL.ink, big: true });
    t.add({ id: 'p-farm', text: 'Real farm photos', sub: 'the field test', anchor: at(P.s6[0] + 1.1, 4.3, P.s6[2] + 5), side: 'r', len: 36, color: COL.real, big: true });
    t.add({ id: 'p-chip', text: 'Android build', sub: 'size and speed not measured yet', anchor: at(P.s6[0] - 4.6, 2.4, P.s6[2] + 3.2), side: 'l', len: 40, color: COL.ink });
    [['10%', '128 leaves'], ['25%', '312 leaves'], ['50%', '614 leaves'], ['100%', '1,225 leaves']].forEach(([a, b], i) => {
      const H = 0.8 + [0.1, 0.25, 0.5, 1.0][i] * 5.2;
      t.add({ id: `p-sc${i}`, text: a, sub: b, anchor: at(P.scar[0] - 7.2 + i * 4.8, 0.9 + H + 2.0, P.scar[2] + 0.4), side: i < 2 ? 'l' : 'r', len: i % 2 ? 36 : 22, color: COL.real, big: i === 0 });
    });
    t.add({ id: 'p-scar', text: 'Brown: real photos', sub: 'Blue: renders added on top', anchor: at(P.scar[0] + 6, 1.2, P.scar[2] + 5.4), side: 'r', len: 30, color: COL.sim });
  }

  // ------------------------------------------------------------ lifecycle
  enter(id) {
    const show = new Set(SHOW[id] || []);
    Object.entries(this.items).forEach(([k, g]) => { g.userData.tgt = show.has(k) ? 1 : 0; });
    const t = this.app.tags;
    const tags = {
      'rec-1': ['p-real', 'p-s5', 'p-s6'],
      'rec-2': ['p-s1', 'p-s2'],
      'rec-3': ['p-s3'],
      'rec-4': ['p-s4', 'p-syn'],
      'rec-5': ['p-s5', 'p-frozen', 'p-train', 'p-out', 'p-pa', 'p-pb', 'p-pc'],
      'rec-6': ['p-sc0', 'p-sc1', 'p-sc2', 'p-sc3', 'p-scar'],
      'rec-7': ['p-s6', 'p-farm', 'p-chip'],
      'rec-8': ['p-real', 'p-blender', 'p-s4', 'p-s5', 'p-s6'],
    };
    t.only(tags[id] || []);
    this.beat = id;
  }

  leave() {}

  update(dt, t, motion = true) {
    if (motion) this.t += dt;
    const time = this.t;
    // reveal animation
    for (const g of Object.values(this.items)) {
      const u = g.userData;
      u.cur = damp(u.cur, u.tgt, 4.5, dt);
      const e = easeOut(Math.min(1, u.cur));
      g.visible = u.cur > 0.01;
      g.scale.setScalar(0.55 + 0.45 * e);
      if (!g.userData.keepY) g.position.y = u.base - (1 - e) * 4;
    }
    for (const f of this.flows) {
      const grp = this.items[f.group];
      f.visible = !!grp && grp.visible && grp.userData.cur > 0.5;
      f.update(time);
    }
    // station 2: every 2 seconds a new image. New spots, new backdrop, new label.
    if (this.leaf) {
      const step = Math.floor(time / 2.2);
      if (step !== this._step) {
        this._step = step;
        const n = SPOT_COUNTS[step % SPOT_COUNTS.length];
        this._drawLeaf(40 + step * 7, n);
        this.bg.material.map = this.bgTex[step % 3];
        this.bg.material.needsUpdate = true;
        const sev = severityOf(n);
        this.curLabel = sev ? `rust yes · severity ${sev}` : 'rust no · healthy';
        this.labelPlane.userData.redraw();
      }
      const a = Math.sin(time * 0.7) * 0.75;
      this.cam3.position.set(Math.sin(a) * 8.0, 4.2 + Math.sin(time * 0.5) * 0.7, -1.2 + Math.cos(a) * 6.4);
      this.cam3.lookAt(this.leaf.position);
      this.leaf.rotation.set(-0.1 + Math.sin(time * 0.6) * 0.12, 0.25 + Math.sin(time * 0.45) * 0.3, Math.sin(time * 0.5) * 0.12);
      const s = (time * 0.35) % Math.PI;
      this.sun.position.set(Math.cos(Math.PI - s) * 9, Math.sin(s) * 5 + 7, -2);
    }
    // station 3: the virtual camera sweeps, the knobs wander
    if (this.phone) {
      this.phone.position.x = -5.2 + Math.sin(time * 0.9) * 0.9;
      this.phone.rotation.y = 0.45 + Math.sin(time * 0.9) * 0.18;
      this.knobT += dt;
      if (this.knobT > 1.0) { this.knobT = 0; this.knobTgt = this.knobTgt.map(() => 0.12 + Math.random() * 0.76); }
      let moved = false;
      this.knobVals = this.knobVals.map((v, i) => { const n = damp(v, this.knobTgt[i], 3, dt); if (Math.abs(n - v) > 0.0008) moved = true; return n; });
      if (moved && this.knobs.parent && this.knobs.parent.visible) this.knobs.userData.redraw();
    }
    // station 5: the three training mixes take turns
    if (this.phases) this.phases.forEach((p, i) => { const on = Math.floor(time / 2.2) % 3 === i; p.scale.y = damp(p.scale.y, on ? 1.0 : 0.82, 6, dt); });
    // scarcity staircase: the blue caps breathe, one step at a time
    if (this.scarTops) this.scarTops.forEach((m, i) => { const on = Math.floor(time / 1.6) % 4 === i; m.scale.y = damp(m.scale.y, on ? 1.25 : 1.0, 5, dt); });
    // station 6: the model shrinks to a chip and back
    if (this.endModel) {
      const k = this.items.s6x && this.items.s6x.userData.cur > 0.5 ? 0.42 : 1;
      this.endModel.scale.setScalar(damp(this.endModel.scale.x, k, 3, dt));
      this.endModel.position.y = 0.9 + 1.7 * this.endModel.scale.x + 0.1;
    }
    if (this.bench) this.bench.forEach((c, i) => { c.position.y = 1.9 + Math.sin(time * 2 + i) * 0.05; });
  }
}
