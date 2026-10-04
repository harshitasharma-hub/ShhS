import * as THREE from 'three';
import { BaseScene } from './baseScene.js';
import { COL } from './diagram.js';
import { mulberry32, range, damp, clamp } from '../core/math.js';
import { fitFrame, boxPts as cornersOf } from '../core/frame.js';

// A cloud of points that is a street, then becomes Noor's slope.
// Same trick, new domain: whoever makes the scene knows where everything is, so labels are free.

const N = { ground: 15000, big: 8000, mid: 7000, small: 3000, lines: 3000 };

const VERT = /* glsl */ `
attribute vec3 aA; attribute vec3 aB; attribute vec3 aColA; attribute vec3 aColB; attribute float aRand;
uniform float uMix; uniform float uPix; uniform float uTime;
varying vec3 vCol;
void main() {
  float d = aRand * 0.38;
  float e = smoothstep(d, d + 0.62, uMix);
  vec3 p = mix(aA, aB, e);
  p.y += sin(e * 3.14159) * (6.0 + aRand * 14.0);
  p.x += sin(e * 3.14159) * (aRand - 0.5) * 10.0;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp((0.34 + 0.22 * aRand) * uPix / max(-mv.z, 1.0), 1.5, 14.0);
  vCol = mix(aColA, aColB, e);
}`;

const FRAG = /* glsl */ `
varying vec3 vCol;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vCol, smoothstep(0.5, 0.35, d));
  #include <colorspace_fragment>
}`;

const col = (hex) => { const c = new THREE.Color(hex); return [c.r, c.g, c.b]; };

function boxPts(rng, cx, cy, cz, sx, sy, sz, n, withTop = true) {
  const out = [];
  const faces = [sy * sz, sy * sz, sx * sy, sx * sy, sx * sz]; // +x -x +z -z top
  const tot = faces.reduce((a, b) => a + b, 0);
  for (let i = 0; i < n; i++) {
    let r = rng() * tot, f = 0;
    while (f < 4 && r > faces[f]) { r -= faces[f]; f++; }
    const u = rng() - 0.5, v = rng() - 0.5;
    if (f === 0) out.push([cx + sx / 2, cy + (v + 0.5) * sy, cz + u * sz]);
    else if (f === 1) out.push([cx - sx / 2, cy + (v + 0.5) * sy, cz + u * sz]);
    else if (f === 2) out.push([cx + u * sx, cy + (v + 0.5) * sy, cz + sz / 2]);
    else if (f === 3) out.push([cx + u * sx, cy + (v + 0.5) * sy, cz - sz / 2]);
    else out.push([cx + u * sx, cy + sy, cz + v * sz]);
  }
  void withTop;
  return out;
}

function blobPts(rng, cx, cy, cz, rx, ry, rz, n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const u = rng() * 2 - 1, th = rng() * 6.2832, r = Math.cbrt(rng());
    const s = Math.sqrt(1 - u * u);
    out.push([cx + s * Math.cos(th) * rx * r, cy + u * ry * r, cz + s * Math.sin(th) * rz * r]);
  }
  return out;
}

export class IdeaScene extends BaseScene {
  build() {
    const rngA = mulberry32(21), rngB = mulberry32(22);
    const total = N.ground + N.big + N.mid + N.small + N.lines;
    const A = [], B = [], CA = [], CB = [];
    const push = (arrA, arrB, cA, cB) => { A.push(...arrA); B.push(...arrB); CA.push(...cA); CB.push(...cB); };

    // ------- street --------------------------------------------------------
    const street = { ground: [], big: [], mid: [], small: [], lines: [] };
    const sc = { ground: [], big: [], mid: [], small: [], lines: [] };
    for (let i = 0; i < N.ground; i++) {
      const x = (rngA() * 2 - 1) * 64, z = (rngA() * 2 - 1) * 38;
      street.ground.push([x, 0, z]);
      const az = Math.abs(z);
      sc.ground.push(az < 9 ? col('#8d93b4') : az < 13 ? col('#c5cbe3') : col('#dde2f0'));
    }
    const bldgs = [];
    for (let k = 0; k < 9; k++) bldgs.push([-56 + k * 14 + range(rngA, -1, 1), range(rngA, 7, 20), (k % 2 ? 1 : -1) * range(rngA, 22, 30), range(rngA, 9, 13), range(rngA, 8, 12)]);
    const perB = Math.floor(N.big / bldgs.length);
    bldgs.forEach(([x, h, z, w, d], k) => {
      const pts = boxPts(rngA, x, 0, z, w, h, d, k === bldgs.length - 1 ? N.big - perB * (bldgs.length - 1) : perB);
      const base = 0.78 + range(rngA, -0.05, 0.08);
      pts.forEach((p) => { street.big.push(p); const c = new THREE.Color().setHSL(0.64, 0.16, base - (p[1] / h) * 0.06); sc.big.push([c.r, c.g, c.b]); });
    });
    const carCols = [COL.ink, COL.sim, '#ffffff', COL.healthy, '#8d93b4', COL.ink, COL.sim];
    this.cars = [];
    const perCar = Math.floor(N.mid / 7);
    for (let k = 0; k < 7; k++) {
      const x = -50 + k * 15.5 + range(rngA, -2, 2), z = (k % 2 ? 1 : -1) * 4.3, len = 4.8, wid = 2.0;
      const body = boxPts(rngA, x, 0.5, z, len, 1.1, wid, Math.floor(perCar * 0.7));
      const cab = boxPts(rngA, x - 0.2, 1.6, z, len * 0.5, 0.9, wid * 0.92, perCar - Math.floor(perCar * 0.7));
      [...body, ...cab].forEach((p) => { street.mid.push(p); sc.mid.push(col(carCols[k])); });
      this.cars.push({ x, z, len, wid });
    }
    while (street.mid.length < N.mid) { street.mid.push([...street.mid[0]]); sc.mid.push(col(COL.ink)); }
    this.peds = [];
    const perP = Math.floor(N.small / 8);
    for (let k = 0; k < 8; k++) {
      const x = k < 4 ? 17 + k * 1.3 : -40 + k * 9, z = k < 4 ? -4 + k * 2.6 : (k % 2 ? 11 : -11);
      const pts = [...blobPts(rngA, x, 0.9, z, 0.38, 0.9, 0.38, Math.floor(perP * 0.8)), ...blobPts(rngA, x, 1.95, z, 0.28, 0.28, 0.28, perP - Math.floor(perP * 0.8))];
      pts.forEach((p) => { street.small.push(p); sc.small.push(col(COL.early)); });
      this.peds.push({ x, z });
    }
    while (street.small.length < N.small) { street.small.push([...street.small[0]]); sc.small.push(col(COL.early)); }
    // lane markings and the crosswalk
    for (let i = 0; i < N.lines; i++) {
      if (i < 1700) { const dash = Math.floor(rngA() * 18); const x = -60 + dash * 7 + rngA() * 2.6; street.lines.push([x, 0.04, (rngA() - 0.5) * 0.35]); }
      else { const s = Math.floor(rngA() * 9); street.lines.push([15.6 + rngA() * 5.2, 0.04, -8 + s * 2 + rngA() * 1.0]); }
      sc.lines.push(col('#ffffff'));
    }

    // ------- field ---------------------------------------------------------
    const field = { ground: [], big: [], mid: [], small: [], lines: [] };
    const fc = { ground: [], big: [], mid: [], small: [], lines: [] };
    const ty = (z) => { const u = (z + 38) / 76 * 6; const k = Math.floor(u), f = u - k; return k * 1.7 + Math.min(1, Math.max(0, (f - 0.78) / 0.22)) * 1.7; };
    this.ty = ty;
    for (let i = 0; i < N.ground; i++) {
      const x = (rngB() * 2 - 1) * 64, z = (rngB() * 2 - 1) * 38;
      field.ground.push([x, ty(z), z]);
      const u = (z + 38) / 76 * 6, f = u - Math.floor(u);
      fc.ground.push(f > 0.78 ? col('#4f7a3a') : f > 0.3 && f < 0.55 ? col('#2e6b3a') : col('#a8683f'));
    }
    const trees = [[-50, -24], [-30, -8], [-6, -26], [24, -16], [46, -28], [40, 10], [-44, 18]];
    const perT = Math.floor((N.big - 1200) / trees.length);
    trees.forEach(([x, z]) => {
      const y0 = ty(z);
      blobPts(rngB, x, y0 + 7, z, 5.6, 2.1, 5.6, perT).forEach((p) => { field.big.push(p); fc.big.push(col(rngB() < 0.5 ? '#2f7a46' : '#5d9a4a')); });
    });
    boxPts(rngB, -34, ty(26), 28, 7, 3.4, 5, 700).forEach((p) => { field.big.push(p); fc.big.push(col('#e8e1d2')); });
    boxPts(rngB, 38, ty(32), 30, 9, 3.6, 5.4, 500).forEach((p) => { field.big.push(p); fc.big.push(col('#dcd5c6')); });
    while (field.big.length < N.big) { field.big.push([...field.big[0]]); fc.big.push(col('#2f7a46')); }
    // healthy shrubs on the terraces
    this.shrubsB = [];
    const nS = 58, perS = Math.floor(N.mid / nS);
    for (let k = 0; k < nS; k++) {
      const row = k % 6, idx = Math.floor(k / 6);
      const z = -30 + row * 11.6 + 4.4, x = -52 + idx * 11.2 + (row % 2) * 4;
      const y = ty(z) + 1.0;
      blobPts(rngB, x, y, z, 2.3, 1.3, 2.0, perS).forEach((p) => { field.mid.push(p); fc.mid.push(col(rngB() < 0.18 ? COL.healthy : rngB() < 0.5 ? '#2f7a46' : '#1e5a35')); });
      this.shrubsB.push({ x, y, z });
    }
    while (field.mid.length < N.mid) { field.mid.push([...field.mid[0]]); fc.mid.push(col('#2f7a46')); }
    // the sick ones
    this.sick = [];
    const nI = 16, perI = Math.floor(N.small / nI);
    for (let k = 0; k < nI; k++) {
      const row = 2 + (k % 3), z = -30 + row * 11.6 + 4.4, x = -8 + (k % 5) * 4.6 + Math.floor(k / 5) * 2;
      const y = ty(z) + 1.0;
      blobPts(rngB, x, y, z, 2.1, 1.2, 1.8, perI).forEach((p) => { field.small.push(p); fc.small.push(col(rngB() < 0.5 ? COL.early : rngB() < 0.55 ? '#ff9a2e' : COL.alarm)); });
      this.sick.push({ x, y, z });
    }
    while (field.small.length < N.small) { field.small.push([...field.small[0]]); fc.small.push(col(COL.alarm)); }
    for (let i = 0; i < N.lines; i++) {
      const row = Math.floor(rngB() * 6), z = -30 + row * 11.6 + 4.4 + (rngB() - 0.5) * 0.3;
      field.lines.push([(rngB() * 2 - 1) * 60, ty(z) + 0.05, z]); fc.lines.push(col('#f4f1ff'));
    }

    for (const k of ['ground', 'big', 'mid', 'small', 'lines']) push(street[k], field[k], sc[k], fc[k]);
    const flat = (a) => new Float32Array(a.flat());
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(total * 3), 3));
    g.setAttribute('aA', new THREE.BufferAttribute(flat(A), 3));
    g.setAttribute('aB', new THREE.BufferAttribute(flat(B), 3));
    g.setAttribute('aColA', new THREE.BufferAttribute(flat(CA), 3));
    g.setAttribute('aColB', new THREE.BufferAttribute(flat(CB), 3));
    const rr = new Float32Array(total); const rnd = mulberry32(5);
    for (let i = 0; i < total; i++) rr[i] = rnd();
    g.setAttribute('aRand', new THREE.BufferAttribute(rr, 1));
    this.mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: true, uniforms: { uMix: { value: 0 }, uPix: { value: 800 }, uTime: { value: 0 } } });
    this.points = new THREE.Points(g, this.mat);
    this.points.frustumCulled = false;
    this.group.add(this.points);
    this.mix = 0; this.mixTarget = 0;

    // bounding boxes: the free labels
    this.boxesA = new THREE.Group(); this.boxesB = new THREE.Group();
    const mkBox = (cx, cy, cz, sx, sy, sz, color, parent) => {
      const l = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(sx, sy, sz)), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.0 }));
      l.position.set(cx, cy + sy / 2, cz); parent.add(l); return l;
    };
    this.cars.forEach((c) => mkBox(c.x, 0, c.z, c.len + 0.8, 2.9, c.wid + 0.8, COL.sim, this.boxesA));
    this.peds.forEach((p) => mkBox(p.x, 0, p.z, 1.3, 2.5, 1.3, '#d6a800', this.boxesA));
    this.sick.forEach((s) => mkBox(s.x, s.y - 1.2, s.z, 5.6, 3.4, 5.0, COL.alarm, this.boxesB));
    this.group.add(this.boxesA, this.boxesB);

    this._frames();
    this._tags();
    this.built = true;
  }

  // What must be in the picture for each step. The camera is worked out from the stage (see core/frame.js).
  // The street and the field are bigger than the picture, so each shot closes in on the part that carries the labels.
  _frames() {
    const car = this.cars[2], ped = this.peds[1], sick = this.sick[2], ok = this.shrubsB[7];
    this.frames = {
      'idea-1': { pts: [...cornersOf((car.x + ped.x) / 2, 2.2, 0, Math.abs(ped.x - car.x) + 30, 5, 17), [car.x, 9, car.z], [ped.x, 9, ped.z]], az: -10, el: 30, fov: 32, pad: [0.04, 0.08], parallax: 0.4 },
      'idea-2': { pts: [...cornersOf((sick.x + ok.x) / 2, sick.y + 1, (sick.z + ok.z) / 2, Math.abs(sick.x - ok.x) + 34, 5, 26), [sick.x, sick.y + 9, sick.z], [ok.x, ok.y + 9, ok.z]], az: -10, el: 36, fov: 32, pad: [0.04, 0.08], parallax: 0.4 },
    };
  }

  pose(id) { return fitFrame(this.frames[id], this.app.layout.aspect); }

  _tags() {
    const t = this.app.tags;
    const at = (x, y, z) => new THREE.Vector3(x, y, z);
    t.add({ id: 'i-car', text: 'Car', sub: 'label: free', anchor: at(this.cars[2].x, 3.2, this.cars[2].z), side: 'r', len: 30, color: COL.sim, big: true });
    t.add({ id: 'i-ped', text: 'Pedestrian', sub: 'label: free', anchor: at(this.peds[1].x, 2.8, this.peds[1].z), side: 'l', len: 36, color: '#d6a800', big: true });
    t.add({ id: 'i-sick', text: 'Rust, severity 1', sub: 'label: free', anchor: at(this.sick[2].x, this.sick[2].y + 2.4, this.sick[2].z), side: 'r', len: 36, color: COL.alarm, big: true });
    t.add({ id: 'i-ok', text: 'Healthy shrub', sub: 'label: free', anchor: at(this.shrubsB[7].x, this.shrubsB[7].y + 2.2, this.shrubsB[7].z), side: 'l', len: 36, color: COL.healthy, big: true });
  }

  enter(id) {
    this.mixTarget = id === 'idea-2' ? 1 : 0;
    this.app.tags.only(id === 'idea-2' ? ['i-sick', 'i-ok'] : ['i-car', 'i-ped']);
  }

  update(dt, t) {
    this.mix = damp(this.mix, this.mixTarget, 1.1, dt);
    const m = this.mix;
    this.mat.uniforms.uMix.value = clamp(m * 1.02);
    const cam = this.app.camera;
    this.mat.uniforms.uPix.value = this.app.renderer.domElement.height / (2 * Math.tan((cam.fov * Math.PI) / 360));
    this.boxesA.children.forEach((l) => { l.material.opacity = 0.9 * clamp(1 - m * 3.2); });
    this.boxesB.children.forEach((l) => { l.material.opacity = 0.9 * clamp((m - 0.72) * 4); });
    void t;
  }
}
