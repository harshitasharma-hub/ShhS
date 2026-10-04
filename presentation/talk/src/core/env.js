import * as THREE from 'three';
import { damp } from './math.js';
import { makeNoiseTexture } from '../gl/noiseTex.js';

// One uniforms object shared (by reference) with every custom material.
export const U = {
  uTime: { value: 0 },
  uSeam: { value: 0.5 },
  uRes: { value: new THREE.Vector2(1, 1) },
  uSunDir: { value: new THREE.Vector3(-0.78, 0.52, -0.22).normalize() },
  uSunColor: { value: new THREE.Color('#ffd2a1') },
  uSkyColor: { value: new THREE.Color('#a9bef0') },
  uGroundColor: { value: new THREE.Color('#8d7468') },
  uFogColor: { value: new THREE.Color('#f3e4e4') },
  uFogDensity: { value: 0.0019 },
  uAmbient: { value: 0.62 },
  uWind: { value: new THREE.Vector3(0.8, 0, 0.35) },
  uLabelGround: { value: new THREE.Color('#2a1b52') },
  uNoiseTex: { value: makeNoiseTexture(256) },
};

// Light presets. "dom" are the four sky stops painted behind the canvas.
// The last stop must match the fog color or distant hills show a seam.
export const ENVS = {
  dawn: {
    sun: [-0.78, 0.52, -0.22], sunColor: '#ffd8ae', sky: '#a9bef0', ground: '#a07c66', fog: '#f3e4e4',
    fogD: 0.0019, amb: 0.56, glow: 0.8, dom: ['#b3c4ef', '#d2d8f3', '#ebdff0', '#f3e4e4'],
  },
  noon: {
    sun: [-0.2, 0.92, 0.25], sunColor: '#fff6e8', sky: '#9fc1f2', ground: '#8a7a6a', fog: '#e9eef8',
    fogD: 0.0017, amb: 0.7, glow: 0, dom: ['#8fb4ee', '#b9d0f3', '#dbe6f7', '#e9eef8'],
  },
  overcast: {
    sun: [0.1, 0.8, 0.3], sunColor: '#e6e8f2', sky: '#c3c9dc', ground: '#8b8a92', fog: '#dfe2ec',
    fogD: 0.0034, amb: 0.95, glow: 0, dom: ['#c3c9dc', '#d0d4e3', '#dadde9', '#dfe2ec'],
  },
  late: {
    sun: [0.7, 0.2, 0.45], sunColor: '#ffb27a', sky: '#9c9ee0', ground: '#7a6258', fog: '#f1d5d0',
    fogD: 0.0022, amb: 0.52, glow: 0.6, dom: ['#9fa4e6', '#c9bde8', '#ecc7d0', '#f1d5d0'],
  },
  // abstract scenes: a clean studio mist so diagrams read
  studio: {
    sun: [-0.35, 0.8, 0.5], sunColor: '#ffffff', sky: '#dfe5f5', ground: '#b9bfd6', fog: '#eef1f8',
    fogD: 0.0009, amb: 0.95, glow: 0, dom: ['#f6f8fd', '#eef1f8', '#eef1f8', '#eef1f8'],
  },
};

const cur = {
  sun: new THREE.Vector3(), sunColor: new THREE.Color(), sky: new THREE.Color(), ground: new THREE.Color(),
  fog: new THREE.Color(), fogD: 0.004, amb: 0.6, glow: 0, dom: [0, 1, 2, 3].map(() => new THREE.Color()),
};
let tgt = null;
let settled = true;

const dist3 = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);

function toTarget(name) {
  const e = ENVS[name] || ENVS.dawn;
  return {
    sun: new THREE.Vector3(...e.sun).normalize(),
    sunColor: new THREE.Color(e.sunColor), sky: new THREE.Color(e.sky), ground: new THREE.Color(e.ground),
    fog: new THREE.Color(e.fog), fogD: e.fogD, amb: e.amb, glow: e.glow, dom: e.dom.map((c) => new THREE.Color(c)),
  };
}

function apply() {
  U.uSunDir.value.copy(cur.sun).normalize();
  U.uSunColor.value.copy(cur.sunColor);
  U.uSkyColor.value.copy(cur.sky);
  U.uGroundColor.value.copy(cur.ground);
  U.uFogColor.value.copy(cur.fog);
  U.uFogDensity.value = cur.fogD;
  U.uAmbient.value = cur.amb;
}

function writeDom() {
  const root = document.documentElement.style;
  for (let i = 0; i < 4; i++) root.setProperty(`--sky-${i}`, '#' + cur.dom[i].getHexString(THREE.SRGBColorSpace));
  root.setProperty('--sky-glow', cur.glow.toFixed(3));
}

export function setEnv(name, instant = false) {
  tgt = toTarget(name);
  settled = false;
  if (instant) {
    cur.sun.copy(tgt.sun); cur.sunColor.copy(tgt.sunColor); cur.sky.copy(tgt.sky); cur.ground.copy(tgt.ground);
    cur.fog.copy(tgt.fog); cur.fogD = tgt.fogD; cur.amb = tgt.amb; cur.glow = tgt.glow;
    cur.dom.forEach((c, i) => c.copy(tgt.dom[i]));
    apply(); writeDom(); settled = true;
  }
}

// Override part of the light, for the "randomize the light" demo.
export function setLight({ sun, sunColor, amb, fog } = {}) {
  if (!tgt) return;
  if (sun) tgt.sun.set(...sun).normalize();
  if (sunColor) tgt.sunColor.set(sunColor);
  if (amb != null) tgt.amb = amb;
  if (fog != null) tgt.fogD = fog;
  settled = false;
}

export function updateEnv(dt) {
  if (!tgt || settled) return;
  const k = 2.4;
  cur.sun.x = damp(cur.sun.x, tgt.sun.x, k, dt);
  cur.sun.y = damp(cur.sun.y, tgt.sun.y, k, dt);
  cur.sun.z = damp(cur.sun.z, tgt.sun.z, k, dt);
  const mix = (a, b) => { a.r = damp(a.r, b.r, k, dt); a.g = damp(a.g, b.g, k, dt); a.b = damp(a.b, b.b, k, dt); };
  mix(cur.sunColor, tgt.sunColor); mix(cur.sky, tgt.sky); mix(cur.ground, tgt.ground); mix(cur.fog, tgt.fog);
  for (let i = 0; i < 4; i++) mix(cur.dom[i], tgt.dom[i]);
  cur.fogD = damp(cur.fogD, tgt.fogD, k, dt);
  cur.amb = damp(cur.amb, tgt.amb, k, dt);
  cur.glow = damp(cur.glow, tgt.glow, k, dt);
  apply();
  writeDom();
  const d = dist3(cur.fog, tgt.fog) + dist3(cur.sky, tgt.sky) + dist3(cur.sunColor, tgt.sunColor)
    + cur.sun.distanceTo(tgt.sun) + Math.abs(cur.amb - tgt.amb) + Math.abs(cur.fogD - tgt.fogD) * 100
    + Math.abs(cur.glow - tgt.glow) + dist3(cur.dom[0], tgt.dom[0]) + dist3(cur.dom[2], tgt.dom[2]);
  if (d < 0.002) settled = true;
}

// The four sky stops currently painted behind the canvas, as CSS hex strings.
export function skyStops() {
  return cur.dom.map((c) => '#' + c.getHexString(THREE.SRGBColorSpace));
}
