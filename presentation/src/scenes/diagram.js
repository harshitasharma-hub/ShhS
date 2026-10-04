import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mulberry32, range } from '../core/math.js';

// Shared pieces for the diagram scenes: the palette, procedurally drawn photo cards,
// conveyors, plinths and outlines. Everything here is drawn from scratch.

export const COL = {
  ink: '#151834', slate: '#565c7e', sim: '#2b4de8', real: '#7b4a2d', healthy: '#19b3c8', early: '#ffe14d', alarm: '#f2552c',
  dusk: '#2a1b52', mist: '#eef1f8', fog: '#c9d0e6', paper: '#ffffff', fruit: '#b15cf5', wood: '#dcd6f4',
};

// ---------------------------------------------------------------- card art
const W = 256, H = 320;
const cache = new Map();

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// A pointed leaf shape. Returns nothing; draws the fill and (optionally) a midrib.
function leaf(ctx, cx, cy, len, wid, rot, fill, rib) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(-len / 2, 0);
  ctx.bezierCurveTo(-len * 0.25, -wid * 0.75, len * 0.25, -wid * 0.7, len / 2, 0);
  ctx.bezierCurveTo(len * 0.25, wid * 0.7, -len * 0.25, wid * 0.75, -len / 2, 0);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (rib) {
    ctx.strokeStyle = rib;
    ctx.lineWidth = Math.max(1, wid * 0.05);
    ctx.beginPath(); ctx.moveTo(-len / 2, 0); ctx.lineTo(len / 2, 0); ctx.stroke();
  }
  ctx.restore();
  return { cx, cy, len, wid, rot };
}

// spots on a leaf: pale halo, orange core
function spots(ctx, L, n, rng, stage = 1, flat = false) {
  ctx.save();
  ctx.translate(L.cx, L.cy);
  ctx.rotate(L.rot);
  for (let i = 0; i < n; i++) {
    const x = (rng() - 0.5) * L.len * 0.7, y = (rng() - 0.5) * L.wid * 0.7;
    const r = (3 + rng() * 5) * stage;
    ctx.fillStyle = flat ? '#ffe14d' : 'rgba(235, 214, 70, 0.9)';
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    ctx.fillStyle = flat ? '#f2552c' : 'rgba(205, 92, 14, 0.95)';
    ctx.beginPath(); ctx.arc(x, y, r * 0.5, 0, 6.283); ctx.fill();
  }
  ctx.restore();
}

function grain(ctx, amount, rng, w = W, h = H) {
  const img = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rng() - 0.5) * amount;
    img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

function chip(ctx, text, color, x = 14, y = H - 34) {
  ctx.font = '700 15px "DMMono", ui-monospace, monospace';
  const w = ctx.measureText(text).width + 18;
  rr(ctx, x, y, w, 24, 7); ctx.fillStyle = color; ctx.fill();
  ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.fillText(text, x + 9, y + 12.5);
}

// scene content shared by sim / mask / refined, so a pair shows the same leaves
function plantScene(ctx, mode, seed, stage) {
  const rng = mulberry32(seed);
  const items = [];
  const n = 4 + Math.floor(rng() * 2);
  for (let i = 0; i < n; i++) {
    items.push({ cx: 50 + rng() * 156, cy: 90 + rng() * 150, len: 90 + rng() * 60, wid: 40 + rng() * 22, rot: -1.2 + rng() * 2.4, tone: rng(), sp: Math.floor(rng() * 7 * stage) + (rng() < 0.4 ? 2 : 0), s: rng() });
  }
  const spr = mulberry32(seed + 77);
  for (const it of items) {
    if (mode === 'mask') {
      const L = leaf(ctx, it.cx, it.cy, it.len, it.wid, it.rot, COL.healthy, null);
      spots(ctx, L, it.sp, spr, 1 + stage * 0.5, true);
    } else {
      const g = mode === 'sim' ? `hsl(${128 + it.tone * 14}, 52%, ${30 + it.tone * 10}%)` : `hsl(${112 + it.tone * 24}, 38%, ${22 + it.tone * 14}%)`;
      const L = leaf(ctx, it.cx, it.cy, it.len, it.wid, it.rot, g, 'rgba(255,255,255,0.28)');
      spots(ctx, L, it.sp, spr, 1 + stage * 0.5, false);
    }
  }
}

export function cardCanvas(kind, variant = 0, frame = null, tag = null) {
  const key = `${kind}|${variant}|${frame}|${tag}`;
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  const rng = mulberry32(900 + variant * 31);
  ctx.save();
  rr(ctx, 4, 4, W - 8, H - 8, 22);
  ctx.clip();
  switch (kind) {
    case 'studio': {
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
      const L = leaf(ctx, W / 2 + (rng() - 0.5) * 20, H / 2 - 12, 190, 96, -0.5 + rng() * 1.0, 'hsl(120,45%,32%)', 'rgba(255,255,255,0.35)');
      spots(ctx, L, 3 + Math.floor(rng() * 7), rng, 1.3, false);
      ctx.fillStyle = 'rgba(21,24,52,0.07)'; ctx.fillRect(0, H - 60, W, 60);
      break;
    }
    case 'field': case 'fail': {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#53432f'); g.addColorStop(1, '#2a2118');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 11; i++) {
        const L = leaf(ctx, rng() * W, rng() * H, 70 + rng() * 120, 36 + rng() * 40, rng() * 6.28, `hsl(${100 + rng() * 40}, ${28 + rng() * 22}%, ${14 + rng() * 22}%)`, 'rgba(255,255,255,0.12)');
        if (rng() < 0.5) spots(ctx, L, 1 + Math.floor(rng() * 4), rng, 0.8, false);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(0, 0, W, 60);
      ctx.fillStyle = 'rgba(255,230,170,0.10)'; ctx.fillRect(0, H * 0.55, W, 40);
      grain(ctx, 36, rng);
      ctx.filter = 'blur(1.4px)'; ctx.drawImage(c, 0, 0); ctx.filter = 'none';
      break;
    }
    case 'sim': case 'mask': case 'refined': {
      const stage = (variant % 5) / 4;
      if (kind === 'mask') { ctx.fillStyle = COL.dusk; ctx.fillRect(0, 0, W, H); }
      else {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        if (kind === 'sim') { g.addColorStop(0, '#bcd3f5'); g.addColorStop(0.45, '#dfe8f4'); g.addColorStop(1, '#8c6a4e'); }
        else { g.addColorStop(0, '#a9b9cf'); g.addColorStop(0.5, '#c9c2b4'); g.addColorStop(1, '#5d4634'); }
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      plantScene(ctx, kind, 40 + variant * 13, 0.35 + stage * 0.65);
      if (kind === 'refined') {
        ctx.fillStyle = 'rgba(70,40,10,0.10)'; ctx.fillRect(0, 0, W, H);
        const v = ctx.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, 230);
        v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.38)');
        ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
        grain(ctx, 40, rng);
        ctx.filter = 'blur(0.8px)'; ctx.drawImage(c, 0, 0); ctx.filter = 'none';
      }
      break;
    }
    default: ctx.fillStyle = '#ddd'; ctx.fillRect(0, 0, W, H);
  }
  ctx.restore();
  if (kind === 'fail') {
    ctx.fillStyle = 'rgba(242,85,44,0.18)'; rr(ctx, 4, 4, W - 8, H - 8, 22); ctx.fill();
  }
  if (frame) { rr(ctx, 5, 5, W - 10, H - 10, 21); ctx.lineWidth = 10; ctx.strokeStyle = frame; ctx.stroke(); }
  if (tag) chip(ctx, tag, frame || COL.ink);
  cache.set(key, c);
  return c;
}

const texCache = new Map();
export function cardTexture(kind, variant = 0, frame = null, tag = null) {
  const key = `${kind}|${variant}|${frame}|${tag}`;
  if (texCache.has(key)) return texCache.get(key);
  const t = new THREE.CanvasTexture(cardCanvas(kind, variant, frame, tag));
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  texCache.set(key, t);
  return t;
}

const cardGeo = new THREE.PlaneGeometry(1.6, 2.0);
export function makeCard(kind, variant = 0, frame = null, tag = null, scale = 1) {
  const m = new THREE.Mesh(cardGeo, new THREE.MeshBasicMaterial({ map: cardTexture(kind, variant, frame, tag), transparent: true, side: THREE.DoubleSide }));
  m.scale.setScalar(scale);
  m.userData.kind = kind;
  return m;
}

// ---------------------------------------------------------------- a conveyor
// Items glide along a curve. Each keeps its own phase so they spread out.
export class Flow {
  constructor(points, items, { speed = 0.07, lift = 0.0, fade = 0.08, offset = 0 } = {}) {
    this.curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.3);
    this.items = items;
    this.speed = speed;
    this.lift = lift;
    this.fade = fade;
    this.offset = offset;
    this.visible = true;
    this.base = items.map((m) => m.scale.x);
    this._v = new THREE.Vector3();
  }

  get length() { return this.curve.getLength(); }

  update(t) {
    const n = this.items.length;
    for (let i = 0; i < n; i++) {
      const m = this.items[i];
      const u = ((t * this.speed + i / n + this.offset) % 1 + 1) % 1;
      this.curve.getPointAt(u, this._v);
      m.position.copy(this._v);
      m.position.y += Math.sin(u * Math.PI * 6 + i) * 0.06 + this.lift;
      const k = Math.min(1, u / this.fade, (1 - u) / this.fade);
      const s = this.base[i] * (0.15 + 0.85 * k);
      m.scale.setScalar(s);
      m.visible = this.visible && k > 0.02;
    }
  }
}

// A tube-like guide along a curve, drawn as thin line segments with chevrons.
export function guide(points, color = COL.ink, opacity = 0.5) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.3);
  const g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
  const line = new THREE.Line(g, new THREE.LineDashedMaterial({ color, transparent: true, opacity, dashSize: 0.5, gapSize: 0.35 }));
  line.computeLineDistances();
  return line;
}

// ---------------------------------------------------------------- solids
export function plinth(w, d, h = 0.9, color = '#ffffff', accent = COL.ink) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, 0.28), new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.0 }));
  body.position.y = h / 2;
  body.castShadow = true; body.receiveShadow = true;
  g.add(body);
  // a colored stripe along the front edge says where the data comes from
  const top = new THREE.Mesh(new RoundedBoxGeometry(w - 1.4, 0.1, 0.42, 2, 0.04), new THREE.MeshStandardMaterial({ color: accent, roughness: 0.4 }));
  top.position.set(0, h + 0.02, d / 2 - 0.62);
  g.add(top);
  return g;
}

export function edges(mesh, color = COL.ink, opacity = 0.35, angle = 28) {
  const e = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, angle), new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
  mesh.add(e);
  return e;
}

export function matte(color, rough = 0.6) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0 });
}

// a soft studio rig + a floor that only shows shadows
export function studioLights(group, size = 140) {
  const hemi = new THREE.HemisphereLight(0xffffff, 0xc9d0e6, 1.35);
  const sun = new THREE.DirectionalLight(0xffffff, 2.6);
  sun.position.set(-34, 70, 46);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const s = sun.shadow.camera;
  s.left = -size; s.right = size; s.top = size * 0.7; s.bottom = -size * 0.7; s.near = 10; s.far = 260;
  sun.shadow.bias = -0.0004;
  sun.shadow.radius = 5;
  sun.target.position.set(40, 0, 0);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(size * 4, size * 4), new THREE.ShadowMaterial({ opacity: 0.2, color: 0x2a2f66 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(hemi, sun, sun.target, floor);
  return { hemi, sun, floor };
}

export { RoundedBoxGeometry, range };
