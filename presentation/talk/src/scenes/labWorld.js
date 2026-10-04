import * as THREE from 'three';
import { mulberry32, clamp } from '../core/math.js';

// The field behind the leaf, and the light on it, for the eight scenes of the leaf lab.
//
// Blender draws soil, 10 to 24 out-of-focus leaves and a few stems behind the leaf, lit by a sky or a sun
// (scripts/synth/blender_render.py, PRESETS). Here each scene is painted from scratch on a canvas, and lit with
// the real numbers of one render: sun height, sun angle, warmth. It is a preview of that step, not a copy of it.

export const WORLD_W = 1536;
export const WORLD_H = 768;

// What each scene paints. soil: the colour at the top and at the bottom. dark and light: the patches of ground.
// leaves: how many out-of-focus leaves, their greens and sizes. stems: how many. grain: how much the soil is speckled.
// plain: a flat studio sheet and nothing else. gain brightens or darkens every colour of the scene, to match the light (see LOOKS).
// The colours were measured on the borders of the eight real renders (the part outside the leaf), so the preview sits in the same range.
const SCENES = {
  overcast: { gain: 1.33, soil: ['#4a3f29', '#4e402c'], dark: '#2a2c16', light: '#5e4c34', leaves: { n: 5, greens: ['#2e3b17', '#343f1c', '#283414'], len: [220, 460], blur: 12 }, stems: 1, grain: 9 },
  sun: { gain: 0.93, soil: ['#605f55', '#565b4f'], dark: '#40493a', light: '#6a6e5c', leaves: { n: 7, greens: ['#4e6a46', '#5a7a50', '#456040'], len: [240, 470], blur: 11 }, stems: 3, grain: 9 },
  golden: { gain: 0.95, soil: ['#5f5543', '#5c5744'], dark: '#4a4637', light: '#6b6f49', leaves: { n: 6, greens: ['#56693e', '#677b46', '#4a5e36'], len: [240, 470], blur: 11 }, stems: 3, grain: 9 },
  shade: { gain: 1.0, soil: ['#555c36', '#6b6149'], dark: '#33421b', light: '#7a6a54', leaves: { n: 8, greens: ['#455929', '#3a4e22', '#546a31'], len: [280, 560], blur: 13 }, stems: 2, grain: 8 },
  backlit: { gain: 0.9, soil: ['#656156', '#636156'], dark: '#52544b', light: '#6a7660', leaves: { n: 6, greens: ['#597651', '#4c6a46', '#668358'], len: [240, 470], blur: 11 }, stems: 2, grain: 9 },
  rain: { gain: 0.91, soil: ['#6e6862', '#56524a'], dark: '#3b4030', light: '#8a8580', leaves: { n: 4, greens: ['#48563f', '#3e4b36'], len: [220, 440], blur: 12 }, stems: 3, grain: 8 },
  sun_wet: { gain: 0.79, soil: ['#5c6063', '#73737b'], dark: '#414f45', light: '#85848a', leaves: { n: 5, greens: ['#4a6151', '#3e5546', '#587061'], len: [240, 470], blur: 11 }, stems: 2, grain: 7 },
  studio: { gain: 0.96, plain: true, soil: ['#d2d2d1', '#c6c7c2'], grain: 4 },
};

// a colour made lighter or darker, by the same factor on every channel
const grade = (hex, k) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * k))).toString(16).padStart(2, '0');
  return `#${c(n >> 16)}${c((n >> 8) & 255)}${c(n & 255)}`;
};

const hashKey = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

// An ellipse or a leaf, blurred without ctx.filter (Safari does not have it): draw the shape far off the canvas
// and let its blurred shadow fall back on it.
const FAR = 6000;
function softShape(ctx, path, color, alpha, blur) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = blur * 2;
  ctx.shadowOffsetX = FAR;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#000';
  path(-FAR);
  ctx.fill();
  ctx.restore();
}
const ellipse = (ctx, x, y, rx, ry, rot) => (dx) => { ctx.beginPath(); ctx.ellipse(x + dx, y, rx, ry, rot, 0, 6.2832); };
const leafShape = (ctx, cx, cy, len, wid, rot) => (dx) => {
  ctx.save();
  ctx.translate(cx + dx, cy);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(-len / 2, 0);
  ctx.bezierCurveTo(-len * 0.25, -wid * 0.75, len * 0.25, -wid * 0.7, len / 2, 0);
  ctx.bezierCurveTo(len * 0.25, wid * 0.7, -len * 0.25, wid * 0.75, -len / 2, 0);
  ctx.closePath();
  ctx.restore();
};

// A tile of fine noise, made once. It gives the soil its grain.
let noise = null;
function noiseTile() {
  if (noise) return noise;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d'), d = x.createImageData(128, 128);
  let s = 7;
  for (let i = 0; i < d.data.length; i += 4) {
    s = (Math.imul(s, 1664525) + 1013904223) | 0;
    const bell = (((s >>> 8) & 255) + ((s >>> 16) & 255) + ((s >>> 24) & 255)) / 3;      // three draws make a bell shape
    d.data[i] = d.data[i + 1] = d.data[i + 2] = 128 + (bell - 127.5) * 0.9;
    d.data[i + 3] = 255;
  }
  x.putImageData(d, 0, 0);
  noise = c;
  return c;
}

// One scene is painted in small steps (a generator that yields now and then), so it can be done a little at a time between
// frames, and the talk never stalls. The soft layers are painted at half size and scaled up: they are blurry anyway, and that costs a quarter.
function* paintSteps(key, c) {
  const S = SCENES[key] || SCENES.studio;
  const k = S.gain || 1;
  const rng = mulberry32(hashKey(key));
  const soil = S.soil.map((x) => grade(x, k)), dark = S.dark && grade(S.dark, k), light = S.light && grade(S.light, k);
  const w2 = WORLD_W / 2, h2 = WORLD_H / 2;
  const half = document.createElement('canvas');
  half.width = w2; half.height = h2;
  const b = half.getContext('2d');
  const g = b.createLinearGradient(0, 0, w2 * 0.25, h2);
  g.addColorStop(0, soil[0]); g.addColorStop(1, soil[1]);
  b.fillStyle = g;
  b.fillRect(0, 0, w2, h2);

  if (S.plain) {
    // a sheet of paper with a soft pool of light in the middle
    const r = b.createRadialGradient(w2 * 0.5, h2 * 0.45, 20, w2 * 0.5, h2 * 0.5, w2 * 0.62);
    r.addColorStop(0, 'rgba(255,255,255,0.5)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    b.fillStyle = r; b.fillRect(0, 0, w2, h2);
  } else {
    // soil: big soft patches of darker and lighter ground, then crumbs
    for (let i = 0; i < 70; i++) {
      const x = rng() * w2, y = rng() * h2, rx = 15 + rng() * 75, ry = rx * (0.5 + rng() * 0.6);
      softShape(b, ellipse(b, x, y, rx, ry, rng() * 3), rng() < 0.55 ? dark : light, 0.14 + rng() * 0.28, 11 + rng() * 17);
      if (i % 8 === 7) yield;
    }
    for (let i = 0; i < 200; i++) {
      const x = rng() * w2, y = rng() * h2, r = 2 + rng() * 7.5;
      softShape(b, ellipse(b, x, y, r, r * (0.6 + rng() * 0.5), rng() * 3), rng() < 0.6 ? dark : light, 0.2 + rng() * 0.3, 1.5 + rng() * 2.5);
      if (i % 40 === 39) yield;
    }
    // stems
    for (let i = 0; i < S.stems; i++) {
      const x0 = rng() * w2, y0 = rng() * h2 * 0.3, x1 = x0 + (rng() - 0.5) * 150, y1 = h2 * (0.7 + rng() * 0.4);
      const w = 4 + rng() * 5, steps = 24;
      for (let q = 0; q <= steps; q++) {
        const t = q / steps, x = x0 + (x1 - x0) * t + Math.sin(t * 3 + i) * 15, y = y0 + (y1 - y0) * t;
        softShape(b, ellipse(b, x, y, w, w * 1.6, 0), grade('#4d5a35', k), 0.1, 4.5);
      }
      yield;
    }
    // out-of-focus leaves, more of them toward the edges so the middle stays calm
    // (the ground is 1.7 times the picture, so the picture shows the middle 59% of it)
    const L = S.leaves;
    const greens = L.greens.map((x) => grade(x, k));
    for (let i = 0; i < L.n; i++) {
      let x, y;
      do {
        x = w2 * (0.17 + rng() * 0.66); y = h2 * (0.12 + rng() * 0.76);
      } while (((x - w2 / 2) / (w2 * 0.25)) ** 2 + ((y - h2 / 2) / (h2 * 0.19)) ** 2 < 1 && rng() < 0.9);
      const len = (L.len[0] + rng() * (L.len[1] - L.len[0])) / 2, rot = rng() * 6.2832, wid = len * (0.38 + rng() * 0.12);
      const base = greens[Math.floor(rng() * greens.length)], blur = (L.blur + rng() * 5) / 2;
      softShape(b, leafShape(b, x, y, len, wid, rot), base, 0.8 + rng() * 0.2, blur);
      // a lighter middle and a pale midrib, so the blur still reads as a leaf
      softShape(b, leafShape(b, x, y, len * 0.72, wid * 0.55, rot), grade(base, 1.14), 0.45, blur * 1.2);
      softShape(b, leafShape(b, x, y, len * 0.9, wid * 0.05, rot), grade(base, 1.3), 0.35, blur * 0.5);
      yield;
    }
  }
  yield;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(half, 0, 0, WORLD_W, WORLD_H);
  yield;
  if (!S.plain) {
    // fine specks of soil, sharp, at full size
    for (let i = 0; i < 260; i++) {
      const x = rng() * WORLD_W, y = rng() * WORLD_H, r = 1.5 + rng() * 4.5;
      softShape(ctx, ellipse(ctx, x, y, r, r * (0.6 + rng() * 0.6), rng() * 3), rng() < 0.55 ? dark : light, 0.25 + rng() * 0.35, 1.2 + rng() * 2);
      if (i % 52 === 51) yield;
    }
  }
  // grain
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = S.grain / 36;
  ctx.fillStyle = ctx.createPattern(noiseTile(), 'repeat');
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  ctx.restore();
}

const cache = new Map();   // a finished scene, as a canvas
const jobs = new Map();    // a scene that is being painted

// Work on a scene for up to `ms` milliseconds. Returns true when it is finished.
export function paintSome(key, ms) {
  if (cache.has(key)) return true;
  let job = jobs.get(key);
  if (!job) {
    const c = document.createElement('canvas');
    c.width = WORLD_W; c.height = WORLD_H;
    job = { c, gen: paintSteps(key, c) };
    jobs.set(key, job);
  }
  const t0 = performance.now();
  do {
    if (job.gen.next().done) { cache.set(key, job.c); jobs.delete(key); return true; }
  } while (performance.now() - t0 < ms);
  return false;
}

// The picture of one scene, as a canvas. If it is not done yet, it is finished now.
export function paintWorld(key) {
  while (!paintSome(key, 1e9)) { /* paintSome only returns false when time ran out, and it has all the time */ }
  return cache.get(key);
}

// A texture of one scene. The crossfade between two scenes happens in the backdrop material.
const texCache = new Map();
export function worldTexture(key, aniso = 4) {
  if (texCache.has(key)) return texCache.get(key);
  const t = new THREE.CanvasTexture(paintWorld(key));
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  texCache.set(key, t);
  return t;
}

// ---------------------------------------------------------------- light
// The colour of a light of this temperature (Tanner Helland's fit), scaled so its largest channel is 1.
export function kelvinColor(k, out = new THREE.Color()) {
  const t = clamp(k, 1000, 12000) / 100;
  let r, g, b;
  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
    b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    b = 255;
  }
  const v = [r, g, b].map((x) => clamp(x, 0, 255) / 255);
  const m = Math.max(...v);
  return out.setRGB(v[0] / m, v[1] / m, v[2] / m, THREE.SRGBColorSpace);
}

// Blender's sun: elevation above the leaf plane, and an angle measured from +Y (scripts/synth/blender_render.py build_world).
// The leaf lies in the XY plane with +Z toward the camera, as in Blender, so the same formula gives the direction to the sun.
export function sunDirection(elDeg, azDeg, out = new THREE.Vector3()) {
  const el = (elDeg * Math.PI) / 180, az = (azDeg * Math.PI) / 180;
  return out.set(-Math.cos(el) * Math.sin(az), Math.cos(el) * Math.cos(az), Math.sin(el)).normalize();
}

// How each scene is lit in the preview. The sun comes from the real log of the render (height, angle, warmth, power).
// illum is how bright a surface that faces the camera comes out, as a share of its painted colour. The light from the sky is worked out
// from it, so a scene with a strong sun has less sky light. sky and gnd are the colours of that light above and below the leaf.
// wet is how wet the leaf is (0 to 1), trans how much light shines through it, drops how many drops sit on it.
// These were set by eye against the eight real renders, so the preview feels like them.
export const LOOKS = {
  overcast: { illum: 0.63, sky: '#eef2fb', gnd: '#75695a', wet: 0, trans: 0.22, drops: 0, rough: 0.5 },
  sun: { illum: 1.2, sky: '#cfe0ff', gnd: '#7b7168', wet: 0, trans: 0.26, drops: 0, rough: 0.46 },
  golden: { illum: 1.0, sky: '#ffd9b8', gnd: '#7a6656', wet: 0, trans: 0.3, drops: 0, rough: 0.46 },
  shade: { illum: 1.19, sky: '#cfe6d2', gnd: '#5f5a46', wet: 0, trans: 0.2, drops: 0, rough: 0.52 },
  backlit: { illum: 1.2, sky: '#dfe6f4', gnd: '#7a7168', wet: 0, trans: 0.7, drops: 0, rough: 0.46 },
  rain: { illum: 1.4, sky: '#e4eaf4', gnd: '#6f6a6c', wet: 1, trans: 0.22, drops: 70, rough: 0.3 },
  sun_wet: { illum: 1.6, sky: '#d3e2ff', gnd: '#6f6c80', wet: 1, trans: 0.28, drops: 34, rough: 0.3 },
  studio: { illum: 0.98, sky: '#ffffff', gnd: '#c8c8c8', wet: 0, trans: 0.18, drops: 0, rough: 0.5 },
};
// The bench used while the leaf is bent (step 3): a studio sheet, lit by a sun like the sun scene.
export const BENCH = { world: 'studio', look: { sunMul: 1.5, illum: 1.12, sky: '#e8eefc', gnd: '#c8c8c8', wet: 0, trans: 0.24, drops: 0, rough: 0.48 }, sun: { el: 46.3, az: 39, kelvin: 6028, energy: 4.09 } };

// The share of full white that the sun gives a surface that faces it, from the real power of the render.
export const sunShare = (energy) => clamp(energy * 0.15, 0, 1.1);
