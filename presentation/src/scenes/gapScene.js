import * as THREE from 'three';
import { BaseScene } from './baseScene.js';
import { COL, makeImageCard, pictureSheet, plinth, matte, studioLights, RoundedBoxGeometry } from './diagram.js';

// Every picture here is a real photo from src/assets. The wall and the Kenya set are mosaics of many photos.
const PLAIN = ['bracol_960', 'bracol_1664', 'bracol_891', 'bracol_1741', 'bracol_1016', 'bracol_365'];
const FARM = ['field_1', 'field_2', 'field_3', 'field_4', 'field_5'];

// Beat gap-1: a wall of clean studio photos passes a model's gate. Messy field photos bounce.
// Beat gap-2: the coffee sets are leaf close-ups; what Noor needs is not in them.

function label(w, h, draw, px = 512) {
  const c = document.createElement('canvas');
  c.width = px; c.height = Math.round(px * (h / w));
  const ctx = c.getContext('2d');
  draw(ctx, c.width, c.height);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide }));
}

export class GapScene extends BaseScene {
  build() {
    const g = this.group;
    this.rig = studioLights(g, 120);
    this.t = 0;

    // ---- gap-1: wall of plain-background photos (left), gate, field cards (right)
    const wall = pictureSheet('mosaic_plain', 17.1, 11.72);
    wall.position.set(-28.6, 7.4, 0);
    g.add(wall);
    this.wall = wall;
    const board = new THREE.Mesh(new RoundedBoxGeometry(17.85, 12.45, 0.5, 2, 0.2), matte('#ffffff', 0.7));
    board.position.set(-28.6, 7.4, -0.4);
    board.castShadow = true; board.receiveShadow = true;
    g.add(board);

    // the gate: what the model has learned to accept
    const gate = new THREE.Group();
    const mat = matte(COL.ink, 0.4);
    for (const x of [-4.2, 4.2]) { const p = new THREE.Mesh(new RoundedBoxGeometry(1.1, 11, 1.4, 2, 0.25), mat); p.position.set(x, 5.5, 0); p.castShadow = true; gate.add(p); }
    const lintel = new THREE.Mesh(new RoundedBoxGeometry(10.5, 1.3, 1.6, 2, 0.25), mat); lintel.position.set(0, 11.2, 0); lintel.castShadow = true; gate.add(lintel);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 10.2), new THREE.MeshBasicMaterial({ color: COL.healthy, transparent: true, opacity: 0.16, side: THREE.DoubleSide }));
    glow.position.set(0, 5.6, 0); gate.add(glow);
    this.gateGlow = glow;
    const sign = label(7, 1.6, (ctx, w, h) => { ctx.fillStyle = '#fff'; ctx.font = '600 70px "DMMono", monospace'; ctx.textAlign = 'center'; ctx.fillText('THE MODEL', w / 2, h / 2 + 24); }, 600);
    sign.position.set(0, 11.2, 0.85); gate.add(sign);
    gate.position.set(-8, 0, 0);
    g.add(gate);
    this.gate = gate;

    // field photos trying to get through
    this.field = [];
    for (let i = 0; i < 5; i++) {
      const c = makeImageCard(FARM[i], COL.real, null, 1.2, 1);
      c.userData.phase = i * 1.3;
      c.userData.row = i;
      g.add(c); this.field.push(c);
    }
    // studio photos that pass
    this.pass = [];
    for (let i = 0; i < 6; i++) { const c = makeImageCard(PLAIN[i], COL.real, null, 0.9); g.add(c); this.pass.push(c); }
    const floor = new THREE.Mesh(new RoundedBoxGeometry(94, 0.8, 22, 2, 0.3), matte('#ffffff', 0.7));
    floor.position.set(-8, -0.45, 0); floor.receiveShadow = true;
    g.add(floor);

    // ---- gap-2
    const X2 = 120;
    this.g2 = new THREE.Group();
    this.g2.position.set(X2, 0, 0);
    g.add(this.g2);
    const slab = (w, d, color, x, z) => { const m = plinth(w, d, 0.9, '#ffffff', color); m.position.set(x, 0, z); this.g2.add(m); return m; };
    // BRACOL: leaf cards on white backgrounds
    slab(24, 14, COL.real, -22, 0);
    const plain = pictureSheet('mosaic_plain', 15, 10.3);
    plain.position.set(-22, 6.4, -1.6);
    plain.rotation.x = -0.4;
    this.g2.add(plain);
    // Kenya set: one plantation, a camera, many leaf photos
    slab(30, 16, COL.real, 14, 0);
    const kenya = pictureSheet('mosaic_kenya', 25, 12.45);
    kenya.position.set(14, 8.3, 1.6);
    kenya.rotation.x = -0.34;
    this.g2.add(kenya);
    // what Noor needs: a whole shrub, a dashed frame, a question
    const need = new THREE.Group();
    const fr = new THREE.Mesh(new THREE.PlaneGeometry(12, 15), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
    need.add(fr);
    const dash = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(12, 15)),
      new THREE.LineDashedMaterial({ color: COL.alarm, dashSize: 0.7, gapSize: 0.5 }),
    );
    dash.computeLineDistances();
    need.add(dash);
    const q = label(7, 7, (ctx, w, h) => { ctx.fillStyle = COL.alarm; ctx.font = '800 360px "Bricolage", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', w / 2, h / 2 + 20); }, 400);
    q.position.z = 0.05; need.add(q);
    need.position.set(52, 8.6, 0);
    this.g2.add(need);
    this.need = need;

    this._poses();
    this._tags();
    this.built = true;
  }

  _poses() {
    // the card sits low and left, so the scene is framed high
    this.poses = {
      'gap-1': { pos: [-6, 16, 60], target: [-6, -2, 0], fov: 38, parallax: 0.6 },
      'gap-2': { pos: [128, 26, 90], target: [128, -2, 0], fov: 48, parallax: 0.6 },
    };
  }

  _tags() {
    const t = this.app.tags;
    const at = (x, y, z) => new THREE.Vector3(x, y, z);
    t.add({ id: 'g-studio', text: 'Plain-background photos', sub: 'PlantVillage: 54,306 photos · BRACOL shown', anchor: at(-36, 15.6, 0), side: 'r', len: 30, color: COL.real, big: true });
    t.add({ id: 'g-pass', text: 'Same lab conditions', sub: '99.35% correct', anchor: at(-3.2, 11.8, 1), side: 'l', len: 30, color: COL.healthy, big: true });
    t.add({ id: 'g-field', text: 'Photos from other conditions', sub: '31.4% correct', anchor: at(10, 8.4, 0), side: 'r', len: 30, color: COL.alarm, big: true });
    t.add({ id: 'g-bracol', text: 'BRACOL', sub: '1,747 leaves · plain background · 5 phones', anchor: at(93, 12.0, -1), side: 'l', len: 30, color: COL.real, big: true });
    t.add({ id: 'g-kenya', text: 'Kenya set', sub: '58,555 leaves · one plantation · Fujifilm X-T4', anchor: at(134, 16.8, 2), side: 'r', len: 30, color: COL.real, big: true });
    t.add({ id: 'g-need', text: 'What Noor needs', sub: 'mild rust · shade and rain · ordinary phones · real farms', anchor: at(172, 20.5, 0), side: 'l', len: 40, color: COL.alarm, big: true });
  }

  enter(id) {
    const t = this.app.tags;
    this.beat = id;
    if (id === 'gap-1') t.only(['g-studio', 'g-pass', 'g-field']);
    else t.only(['g-bracol', 'g-kenya', 'g-need']);
  }

  update(dt, tt, motion = true) {
    if (motion) this.t += dt;
    const t = this.t;
    // studio photos stream through the gate
    this.pass.forEach((c, i) => {
      const u = ((t * 0.09 + i / this.pass.length) % 1);
      c.position.set(-28 + u * 40, 5.5 + Math.sin(u * 9 + i) * 0.25, 0.4);
      const k = Math.min(1, u / 0.1, (1 - u) / 0.12);
      c.scale.setScalar(0.9 * (0.3 + 0.7 * k));
      const inside = Math.abs(c.position.x - (-8)) < 4.5;
      c.material.color.set(inside ? '#c9f3f8' : '#ffffff');
    });
    // field photos come in, hit the gate, and bounce
    this.field.forEach((c, i) => {
      const ph = c.userData.phase;
      const cyc = (t * 0.42 + ph) % 6.0;
      const approach = Math.min(1, cyc / 3.0);
      const back = cyc > 3.2 ? Math.min(1, (cyc - 3.2) / 2.0) : 0;
      const x = 34 - approach * 28 + back * 14;
      c.position.set(x, 3.0 + i * 1.6 + Math.sin(t * 2 + i) * 0.1, 0.4 + (i % 2) * 0.01);
      c.rotation.z = back > 0 ? Math.sin(cyc * 18) * 0.12 * (1 - back) : 0;
      const bad = cyc > 3.0;
      c.material.color.set(bad ? '#ffc7b8' : '#ffffff');
    });
    this.gateGlow.material.opacity = 0.12 + 0.06 * Math.sin(t * 2.4);
    if (this.need) this.need.position.y = 8.6 + Math.sin(t * 1.4) * 0.25;
  }
}
