import * as THREE from 'three';
import { BaseScene } from './baseScene.js';
import { COL, GFX, pictureSheet, imageTexture, plinth, matte, edges, studioLights, fitShadow, RoundedBoxGeometry } from './diagram.js';
import { lerp, smoothstep, easeOut, easeOutBack, mulberry32 } from '../core/math.js';
import { fitFrame, boxPts } from '../core/frame.js';

// Beat gap-1: one model, two kinds of photos.
//   Photos leave a grid, go behind the model's glass and come out with a verdict. Lab photos get a tick almost
//   every time. Farm photos get a cross most of the time. Each lane ends on a board of 100 dots, one per photo.
//   The numbers are the ones in the PlantVillage test (Mohanty et al., 2016): 99.35% and 31.4%.
// Beat gap-2: the coffee sets are leaf close-ups; what Noor needs is not in them.
// Every picture is a real photo from src/assets. The grids and the Kenya set are sheets made of many photos.

const G2_X = 120;                        // where the gap-2 group stands on the stage
const GATE_X = -3;                       // middle of the model
const GATE_W = 12;                       // width of its glass
const GATE_L = GATE_X - GATE_W / 2;
const GATE_R = GATE_X + GATE_W / 2;
const BOARD_X = 19;                      // middle of the two score boards
const GROUND_Y = -0.3;                   // top of the stage everything stands on
const SPEED = 9;                         // units per second along a lane
const PER_LANE = 4;                      // photos on the way at the same time

const LANES = [
  { key: 'lab', sheet: 'mosaic_lab', cols: 8, rows: 4, px: [192, 96], gapPx: 6, size: [2.0, 1.0], pitch: 0.1, cx: -30, y: 12.2, fly: 1.9 },
  { key: 'farm', sheet: 'mosaic_farm', cols: 8, rows: 4, px: [128, 128], gapPx: 4, size: [1.4, 1.4], pitch: 0.1, cx: -30, y: 3.4, fly: 1.7 },
];

// What the model said about each of 100 photos. true is a right answer.
// Lab photos: 99 of 100 right, as in 99.35%. Farm photos: 31 of 100 right, as in 31.4%. The right ones are spread out.
const VERDICT = (() => {
  const lab = Array(100).fill(true); lab[63] = false;
  const farm = Array(100).fill(false), rng = mulberry32(21);
  for (let k = 0; k < 31; k++) {
    let i = Math.min(99, Math.floor((k + rng()) * 100 / 31));
    while (farm[i]) i = (i + 1) % 100;
    farm[i] = true;
  }
  return { lab, farm };
})();

const GOOD = new THREE.Color(COL.healthy), BAD = new THREE.Color(COL.alarm), EMPTY = new THREE.Color('#dde3f3');
const TINT_OK = new THREE.Color('#e6fbff'), TINT_BAD = new THREE.Color('#ffd9cf'), WHITE = new THREE.Color('#ffffff');
const DOT = 0.6;                         // distance between two dots on a board

function label(w, h, draw, px = 512) {
  const c = document.createElement('canvas');
  c.width = px; c.height = Math.round(px * (h / w));
  const ctx = c.getContext('2d');
  draw(ctx, c.width, c.height);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = GFX.aniso;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide }));
  m.userData.redraw = () => { ctx.clearRect(0, 0, c.width, c.height); draw(ctx, c.width, c.height); tex.needsUpdate = true; };
  return m;
}

// a round stamp: a tick on cyan, a cross on orange
function stampTexture(ok) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = ok ? COL.healthy : COL.alarm;
  ctx.beginPath(); ctx.arc(64, 64, 58, 0, 6.2832); ctx.fill();
  ctx.lineWidth = 7; ctx.strokeStyle = '#fff'; ctx.stroke();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 15;
  ctx.beginPath();
  if (ok) { ctx.moveTo(36, 66); ctx.lineTo(56, 86); ctx.lineTo(94, 44); }
  else { ctx.moveTo(42, 42); ctx.lineTo(86, 86); ctx.moveTo(86, 42); ctx.lineTo(42, 86); }
  ctx.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const cubic = (t) => 1 - Math.pow(1 - t, 3);

// width over height of the two sheets made by tools/prepare_assets.py
const SHEET = { plain: 1042 / 1066, kenya: 920 / 656 };

// gap-2: three sets in a row, all the same height, each on a slab
const G2 = { h: 15, pad: 2.6, gap: 3.4, depth: 8, needW: 12, tilt: 0.2 };

// A big sheet of real photos standing on a slab and leaning back a little. w and h are the size of the picture.
function posterOnSlab(name, w, h, accent, { tilt = 0.22, pad = 3.5, depth = 8 } = {}) {
  const g = new THREE.Group();
  g.add(plinth(w + pad, depth, 0.9, '#ffffff', accent));
  const stand = new THREE.Group();                           // turns around the bottom edge of the picture
  stand.position.set(0, 0.95, -depth / 2 + 3.0);
  stand.rotation.x = -tilt;
  const mat = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.7, h + 0.7), new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide }));
  mat.position.set(0, h / 2, -0.04);
  edges(mat, COL.ink, 0.22, 30);
  const pic = pictureSheet(name, w, h);
  pic.position.set(0, h / 2, 0);
  stand.add(mat, pic);
  g.add(stand);
  g.userData.stand = stand;
  g.userData.h = h;
  return g;
}

// a dashed rectangle drawn with thin flat dashes, so it stays visible on a high density screen
function dashedRect(w, h, color, { dash = 1.0, gap = 0.7, thick = 0.17 } = {}) {
  const parts = [];
  const side = (x0, y0, x1, y1) => {
    const len = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.round(len / (dash + gap)));
    const step = len / n, ux = (x1 - x0) / len, uy = (y1 - y0) / len, ang = Math.atan2(uy, ux);
    for (let i = 0; i < n; i++) parts.push({ x: x0 + ux * (i + 0.5) * step, y: y0 + uy * (i + 0.5) * step, ang, l: step - gap });
  };
  side(-w / 2, h / 2, w / 2, h / 2); side(w / 2, h / 2, w / 2, -h / 2); side(w / 2, -h / 2, -w / 2, -h / 2); side(-w / 2, -h / 2, -w / 2, h / 2);
  const im = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, thick), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }), parts.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), po = new THREE.Vector3(), e = new THREE.Euler();
  parts.forEach((d, i) => { q.setFromEuler(e.set(0, 0, d.ang)); sc.set(d.l, 1, 1); po.set(d.x, d.y, 0); im.setMatrixAt(i, m.compose(po, q, sc)); });
  im.instanceMatrix.needsUpdate = true;
  im.frustumCulled = false;
  return im;
}

export class GapScene extends BaseScene {
  build() {
    const g = this.group;
    this.rig = studioLights(g, 120);
    this.t = 0;
    this.beat = null;
    this.fillT = 0;

    this._buildLanes();

    // ---- gap-2: the two real sets side by side at one height, and the set Noor does not have
    this.g2 = new THREE.Group();
    this.g2.position.set(G2_X, 0, 0);
    g.add(this.g2);
    const wB = G2.h * SHEET.plain, wK = G2.h * SHEET.kenya, wN = G2.needW;
    this.wall = posterOnSlab('mosaic_plain', wB, G2.h, COL.real, { tilt: G2.tilt, depth: G2.depth });
    this.kenya = posterOnSlab('mosaic_kenya', wK, G2.h, COL.real, { tilt: G2.tilt, depth: G2.depth });
    const slabs = [wB + G2.pad, wK + G2.pad, wN + G2.pad];
    const total = slabs.reduce((a, b) => a + b, 0) + 2 * G2.gap;
    let cursor = -total / 2;
    const xs = slabs.map((w) => { const c = cursor + w / 2; cursor += w + G2.gap; return c; });
    this.g2x = xs;
    this.wall.position.set(xs[0], 0, 0);
    this.kenya.position.set(xs[1], 0, 0);
    this.g2.add(this.wall, this.kenya);
    // what Noor needs: an empty slot on the ground and a dashed frame hovering above it, with a question mark
    const need = new THREE.Group();
    const footprint = dashedRect(slabs[2], G2.depth, COL.alarm);
    footprint.rotation.x = -Math.PI / 2; footprint.position.y = 0.04;
    const slot = new THREE.Mesh(new THREE.PlaneGeometry(slabs[2], G2.depth), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.5 }));
    slot.rotation.x = -Math.PI / 2; slot.position.y = 0.03;
    need.add(slot, footprint);
    const floater = new THREE.Group();
    const fr = new THREE.Mesh(new THREE.PlaneGeometry(wN, G2.h), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
    floater.add(fr, dashedRect(wN, G2.h, COL.alarm));
    const q = label(7, 7, (ctx, w, h) => { ctx.fillStyle = COL.alarm; ctx.font = '800 360px "Bricolage", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', w / 2, h / 2 + 20); }, 400);
    q.position.z = 0.05; floater.add(q);
    // it hovers just above its slot, and its top lines up with the tops of the two real sets
    floater.position.y = 0.95 + (G2.h * Math.cos(G2.tilt)) - G2.h / 2;
    floater.userData.base = floater.position.y;
    need.add(floater);
    need.position.set(xs[2], 0, 0);
    this.need = floater;
    this.needSet = need;
    this.g2.add(need);

    this._frames();
    this._tags();
    this.built = true;
  }

  // ------------------------------------------------------------ gap-1: the grids, the model, the boards
  _buildLanes() {
    const g1 = new THREE.Group();
    this.group.add(g1);
    this.g1 = g1;

    // the stage
    // The stage does not take shadows itself. The invisible shadow floor just above it does, so the two never fight.
    const ground = new THREE.Mesh(new RoundedBoxGeometry(72, 0.7, 16, 2, 0.25), matte('#ffffff', 0.7));
    ground.position.set(-7, GROUND_Y - 0.35, 0);
    g1.add(ground);

    // the model: a pane of dark glass in a frame, with its name on top
    const ink = matte(COL.ink, 0.4);
    const top = 16.1, bottom = GROUND_Y, mid = (top + bottom) / 2, h = top - bottom;
    for (const s of [-1, 1]) {
      const bar = new THREE.Mesh(new RoundedBoxGeometry(0.9, h, 1.2, 2, 0.2), ink);
      bar.position.set(GATE_X + s * (GATE_W / 2 + 0.45), mid, 0); bar.castShadow = true; g1.add(bar);
    }
    const lintel = new THREE.Mesh(new RoundedBoxGeometry(GATE_W + 2.7, 2.5, 1.4, 2, 0.3), ink);
    lintel.position.set(GATE_X, top + 1.25, 0); lintel.castShadow = true; g1.add(lintel);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(GATE_W, h), new THREE.MeshBasicMaterial({ color: COL.ink, transparent: true, opacity: 0.74, depthWrite: false }));
    glass.position.set(GATE_X, mid, 0.7); glass.renderOrder = 5; g1.add(glass);
    this.sign = label(GATE_W + 1.8, 2.0, (ctx, w, ht) => {
      ctx.fillStyle = '#fff'; ctx.font = '800 112px "Bricolage", "Instrument", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('THE MODEL', w / 2, ht / 2 + 6);
    }, 1024);
    this.sign.position.set(GATE_X, top + 1.25, 0.74);
    this.sign.userData.redraw();
    g1.add(this.sign);
    document.fonts?.ready.then(() => this.sign.userData.redraw());

    // the two lanes
    this.stamps = { ok: stampTexture(true), bad: stampTexture(false) };
    this.lanes = LANES.map((lane, li) => {
      const L = { ...lane, tiles: [], couriers: [], seq: 0, flash: 0, flashColor: GOOD.clone(), rng: mulberry32(40 + li) };
      const [w, hh] = lane.size, p = lane.pitch;
      const gw = lane.cols * w + (lane.cols - 1) * p, gh = lane.rows * hh + (lane.rows - 1) * p;
      // a white board behind the grid
      const back = new THREE.Mesh(new RoundedBoxGeometry(gw + 0.9, gh + 0.9, 0.5, 2, 0.2), matte('#ffffff', 0.7));
      back.position.set(lane.cx, lane.y, -0.45); back.castShadow = true; back.receiveShadow = true; g1.add(back);
      const sw = lane.cols * lane.px[0] + (lane.cols - 1) * lane.gapPx, sh = lane.rows * lane.px[1] + (lane.rows - 1) * lane.gapPx;
      const tex = imageTexture(lane.sheet);
      for (let r = 0; r < lane.rows; r++) for (let c = 0; c < lane.cols; c++) {
        const home = new THREE.Vector3(lane.cx - gw / 2 + w / 2 + c * (w + p), lane.y + gh / 2 - hh / 2 - r * (hh + p), 0.05);
        // an empty slot, which shows when its photo has left
        const slot = new THREE.Mesh(new THREE.PlaneGeometry(w, hh), new THREE.MeshBasicMaterial({ color: '#e7ebf6' }));
        slot.position.set(home.x, home.y, -0.02); g1.add(slot);
        // the photo: one cell of the sheet
        const geo = new THREE.PlaneGeometry(w, hh);
        const left = c * (lane.px[0] + lane.gapPx), topPx = r * (lane.px[1] + lane.gapPx);
        const u0 = left / sw, u1 = (left + lane.px[0]) / sw, v1 = 1 - topPx / sh, v0 = 1 - (topPx + lane.px[1]) / sh;
        const uv = geo.attributes.uv;
        uv.setXY(0, u0, v1); uv.setXY(1, u1, v1); uv.setXY(2, u0, v0); uv.setXY(3, u1, v0);
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(home);
        g1.add(mesh);
        // a coloured edge and a stamp ride along with the photo
        const edge = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.2, hh + 0.2), new THREE.MeshBasicMaterial({ color: GOOD, transparent: true, opacity: 0 }));
        edge.position.z = -0.02; mesh.add(edge);
        const stamp = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.95), new THREE.MeshBasicMaterial({ map: this.stamps.ok, transparent: true }));
        stamp.position.set(w / 2 - 0.05, hh / 2 - 0.05, 0.03); stamp.scale.setScalar(0.001); mesh.add(stamp);
        const shadow = new THREE.Mesh(new THREE.PlaneGeometry(w, hh), new THREE.MeshBasicMaterial({ color: '#0b0d22', transparent: true, opacity: 0, depthWrite: false }));
        shadow.position.set(home.x, home.y, 0.01); shadow.renderOrder = 1; g1.add(shadow);
        L.tiles.push({ mesh, mat, edge, stamp, shadow, home, state: 'home', timer: 0 });
      }
      // the flash of the glass as a photo is judged
      const lanePane = new THREE.Mesh(new THREE.PlaneGeometry(GATE_W, 7.8), new THREE.MeshBasicMaterial({ color: GOOD, transparent: true, opacity: 0, depthWrite: false }));
      lanePane.position.set(GATE_X, lane.y, 0.78); lanePane.renderOrder = 6; g1.add(lanePane);
      L.pane = lanePane;
      const scan = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 7.8), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false }));
      scan.position.set(GATE_L, lane.y, 0.8); scan.renderOrder = 7; g1.add(scan);
      L.scan = scan;
      // the score board: 100 dots, one per photo
      const bw = 10 * DOT + 1.0;
      const board = new THREE.Mesh(new RoundedBoxGeometry(bw, bw, 0.5, 2, 0.25), matte('#ffffff', 0.7));
      board.position.set(BOARD_X, lane.y, -0.4); board.castShadow = true; board.receiveShadow = true; g1.add(board);
      const dots = new THREE.InstancedMesh(new THREE.CircleGeometry(0.23, 16), new THREE.MeshBasicMaterial(), 100);
      const m4 = new THREE.Matrix4();
      for (let i = 0; i < 100; i++) {
        m4.setPosition(BOARD_X + ((i % 10) - 4.5) * DOT, lane.y + (4.5 - Math.floor(i / 10)) * DOT, 0.0);
        dots.setMatrixAt(i, m4);
        dots.setColorAt(i, EMPTY);
      }
      g1.add(dots);
      L.dots = dots; L.filled = -1; L.board = board;
      // the photos on their way
      for (let k = 0; k < PER_LANE; k++) {
        const t0 = 1.0 + li * 0.9 + k * (7.2 / PER_LANE);
        L.couriers.push({ lane: L, tile: null, tau: t0, tau0: t0, ok: true, land: new THREE.Vector3() });
      }
      return L;
    });
  }

  // What must be in the picture for each step. The camera is worked out from the stage (see core/frame.js).
  _frames() {
    const sets = [G2.h * SHEET.plain, G2.h * SHEET.kenya].map((w, k) => boxPts(G2_X + this.g2x[k], 8.4, -1.2, w + 1, 16.6, 6));
    const slots = boxPts(G2_X + this.g2x[2], 8.4, 0, G2.needW + 1, 16.6, 6);
    const labelTops = this.g2x.map((x) => [G2_X + x, 15.7 + 6, 0]);
    this.frames = {
      // the grids, the model and the two boards of dots, with room for the labels above and below
      'gap-1': { pts: [...boxPts(-8, 9, 0, 64, 19.6, 6), [-30, 20.5, 0], [19, -4.6, 0]], az: 0, el: 6, fov: 30, pad: [0.035, 0.05], parallax: 0.3 },
      'gap-2': { pts: [...sets.flat(), ...slots, ...labelTops], az: 0, el: 12, fov: 30, pad: [0.035, 0.05], parallax: 0.3 },
    };
  }

  pose(id) { return this.frames[id] ? fitFrame(this.frames[id], this.app.layout.aspect) : this.poses[id]; }

  _tags() {
    const t = this.app.tags;
    const at = (x, y, z) => new THREE.Vector3(x, y, z);
    t.add({ id: 'g-lab', text: 'Plain-background photos', sub: 'PlantVillage: 54,306 photos · BRACOL shown', anchor: at(-30, 14.6, 0.3), side: 'u', len: 14, color: COL.real, big: true });
    t.add({ id: 'g-farm', text: 'Photos from other conditions', sub: 'farm photos shown · Uganda set', anchor: at(-24.6, 0.9, 0.3), side: 'r', len: 10, color: COL.real, big: true });
    t.add({ id: 'g-lab-out', text: '99.35% correct', sub: 'each dot is one photo', anchor: at(BOARD_X, 15.5, 0.3), side: 'u', len: 5, color: COL.healthy, big: true });
    t.add({ id: 'g-farm-out', text: '31.4% correct', sub: 'other conditions', anchor: at(BOARD_X, 0.2, 0.3), side: 'd', len: 12, color: COL.alarm, big: true });
    // the dot of each label sits on the top edge of the thing it names
    const V = new THREE.Vector3();
    const topOf = (set) => () => { const st = set.userData.stand; st.updateWorldMatrix(true, false); return V.set(0, set.userData.h, 0.02).applyMatrix4(st.matrixWorld); };
    t.add({ id: 'g-bracol', text: 'BRACOL', sub: '1,747 leaves · plain background · 5 phones', anchor: topOf(this.wall), side: 'u', len: 12, color: COL.real, big: true });
    t.add({ id: 'g-kenya', text: 'Kenya set', sub: '58,555 leaves · one plantation · Fujifilm X-T4', anchor: topOf(this.kenya), side: 'u', len: 12, color: COL.real, big: true });
    const needTop = new THREE.Vector3();
    t.add({ id: 'g-need', text: 'What Noor needs', sub: 'mild rust · shade · rain · phones', anchor: () => { this.need.updateWorldMatrix(true, false); return needTop.set(0, G2.h / 2, 0).applyMatrix4(this.need.matrixWorld); }, side: 'u', len: 12, color: COL.alarm, big: true });
  }

  enter(id) {
    const t = this.app.tags;
    this.beat = id;
    // the shadow floor sits a hair above the stage in gap-1 and on the ground in gap-2
    this.rig.floor.position.y = id === 'gap-1' ? GROUND_Y + 0.02 : 0;
    if (id === 'gap-1') fitShadow(this.rig, -7, 36, 40);
    else fitShadow(this.rig, G2_X, 44, 36);
    if (id === 'gap-1') {
      t.only(['g-lab', 'g-farm', 'g-lab-out', 'g-farm-out']);
      this.fillT = 0;
      this.lanes.forEach((L) => {
        L.seq = 0;
        L.tiles.forEach((tl) => this._home(tl));
        L.couriers.forEach((c) => { c.tile = null; c.tau = c.tau0; });
        L.filled = -1;
      });
    } else t.only(['g-bracol', 'g-kenya', 'g-need']);
  }

  // ------------------------------------------------------------ the photos
  _home(tl) {
    tl.state = 'home'; tl.timer = 0;
    tl.mesh.visible = true; tl.mesh.position.copy(tl.home); tl.mesh.scale.setScalar(1); tl.mesh.rotation.set(0, 0, 0);
    tl.mat.opacity = 1; tl.mat.color.set('#ffffff'); tl.mesh.renderOrder = 0;
    tl.edge.material.opacity = 0; tl.stamp.scale.setScalar(0.001);
    tl.shadow.material.opacity = 0;
  }

  _launch(c) {
    const L = c.lane;
    const free = L.tiles.filter((tl) => tl.state === 'home');
    if (!free.length) { c.tile = null; return; }
    const tl = free[Math.floor(L.rng() * free.length)];
    tl.state = 'away';
    c.tile = tl;
    c.ok = VERDICT[L.key][L.seq % 100];
    L.seq += 1;
    tl.stamp.material.map = c.ok ? this.stamps.ok : this.stamps.bad;
    tl.stamp.material.needsUpdate = true;
    tl.edge.material.color.copy(c.ok ? GOOD : BAD);
    c.land.set(BOARD_X - 3.0 + (L.rng() - 0.5) * 2.0, L.y + (L.rng() - 0.5) * 4.0, 1.2);
    c.dur = 0.7 + (c.land.x - tl.home.x) / SPEED + 0.5;   // pop out, then a steady glide, plus the start-up
  }

  // where the photo is, as a function of the time since it left its grid
  _place(c) {
    const L = c.lane, tl = c.tile, m = tl.mesh;
    const POP = 0.7, ACC = 0.9;
    const k = Math.min(1, c.tau / POP);
    const pop = easeOut(k);
    let x = tl.home.x, y = tl.home.y + 0.5 * pop, z = tl.home.z + 3.2 * pop;
    let s = lerp(1, 1.2, pop);
    const a = c.tau - POP;                      // seconds since the glide began
    if (a > 0) {
      // quarter-sine start-up, then a steady belt
      const d = a < ACC ? SPEED * (2 * ACC / Math.PI) * (1 - Math.cos(Math.PI * a / (2 * ACC))) : SPEED * (a - ACC + 2 * ACC / Math.PI);
      x = tl.home.x + d;
      const toLane = smoothstep(0, 9, d);
      y = lerp(tl.home.y + 0.5, L.y, toLane) + Math.sin(a * 2.2 + L.y) * 0.08;
      s = lerp(1.2, L.fly, smoothstep(0, 7, d));
      // behind the glass between the two bars, in front everywhere else
      z = 3.2 - 4.1 * smoothstep(GATE_L - 5, GATE_L - 1, x) + 4.1 * smoothstep(GATE_R + 1, GATE_R + 5, x);
      // towards the board
      const nearBoard = smoothstep(c.land.x - 8, c.land.x, x);
      s = lerp(s, 0.4, nearBoard);
      y = lerp(y, c.land.y, nearBoard);
      z = lerp(z, c.land.z, nearBoard);
    }
    m.position.set(x, y, z);
    m.scale.setScalar(s);
    m.rotation.z = -0.1 * pop * (1 - smoothstep(0, 1.0, Math.max(0, a)));
    const inside = smoothstep(GATE_L - 0.6, GATE_L + 1.4, x) * (1 - smoothstep(GATE_R - 1.4, GATE_R + 0.6, x));
    // the shadow it leaves on its slot while it lifts off
    const lift = pop * (1 - smoothstep(0, 1.4, Math.max(0, a)));
    tl.shadow.material.opacity = 0.3 * lift;
    tl.shadow.position.set(tl.home.x + 0.35 * lift, tl.home.y - 0.35 * lift, 0.01);
    tl.shadow.scale.setScalar(1 + 0.1 * lift);
    const half = L.size[0] / 2 * s;
    m.renderOrder = x + half > GATE_L - 0.2 && x - half < GATE_R + 0.2 ? 4 : 8;   // drawn before the glass while it overlaps it, after it elsewhere
    // the verdict
    const popK = smoothstep(GATE_R + 1.0, GATE_R + 3.0, x);
    tl.stamp.scale.setScalar(popK > 0 ? Math.max(0.001, easeOutBack(popK)) : 0.001);
    tl.edge.material.opacity = popK;
    tl.mat.color.copy(popK <= 0 ? WHITE : c.ok ? TINT_OK : TINT_BAD);
    const fade = 1 - smoothstep(c.land.x - 2.6, c.land.x, x);
    tl.mat.opacity = fade; tl.edge.material.opacity = popK * fade; tl.stamp.material.opacity = fade;
    return { inside, x };
  }

  update(dt, tt, motion = true) {
    if (motion) this.t += dt;
    if (this.beat === 'gap-1') this._updateLanes(motion ? dt : 0, motion);
    if (this.need) this.need.position.y = this.need.userData.base + Math.sin(this.t * 1.4) * 0.3;
  }

  _updateLanes(dt, motion) {
    this.fillT += dt;
    this.lanes.forEach((L) => {
      let best = 0, bestC = null, bestX = GATE_L;
      L.couriers.forEach((c) => {
        c.tau += dt;
        if (c.tau >= 0 && !c.tile) { this._launch(c); if (!c.tile) return; }
        if (!c.tile) return;
        if (c.tau >= c.dur) {                           // landed on the board
          const tl = c.tile;
          tl.state = 'wait'; tl.timer = 0; tl.mesh.visible = false;
          c.tile = null; c.tau = -(0.2 + L.rng() * 0.8);
          return;
        }
        const r = this._place(c);
        if (r.inside > best) { best = r.inside; bestC = c; bestX = r.x; }
      });
      // a photo that left comes back to its grid after a moment
      L.tiles.forEach((tl) => {
        if (tl.state !== 'wait') return;
        tl.timer += dt;
        if (tl.timer > 0.5) {
          this._home(tl); tl.mat.opacity = 0; tl.state = 'grow'; tl.timer = 0;
        }
      });
      L.tiles.forEach((tl) => {
        if (tl.state !== 'grow') return;
        tl.timer += dt;
        tl.mat.opacity = Math.min(1, tl.timer / 0.7);
        if (tl.timer >= 0.7) { tl.state = 'home'; tl.mat.opacity = 1; }
      });
      // the glass lights up as a photo is judged
      L.flash = bestC ? best : Math.max(0, L.flash - dt * 3);
      if (bestC) L.flashColor.copy(bestC.ok ? GOOD : BAD);
      L.pane.material.color.copy(L.flashColor);
      L.pane.material.opacity = 0.34 * L.flash;
      L.scan.visible = !!bestC;
      L.scan.position.x = bestX;
      L.scan.material.opacity = 0.7 * best;
      // the board fills, one dot per photo, a bit after the step opens
      const want = motion ? Math.max(0, Math.min(100, Math.floor((this.fillT - 0.7) * 22))) : 100;
      if (want !== L.filled) {
        const v = VERDICT[L.key];
        for (let i = 0; i < 100; i++) L.dots.setColorAt(i, i < want ? (v[i] ? GOOD : BAD) : EMPTY);
        L.dots.instanceColor.needsUpdate = true;
        L.filled = want;
      }
    });
  }
}
