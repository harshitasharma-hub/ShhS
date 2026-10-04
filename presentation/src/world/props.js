import * as THREE from 'three';
import { U } from '../core/env.js';
import { COMMON_UNIFORMS, NOISE, LIGHTING } from '../gl/chunks.js';
import { MeshBuilder } from './builder.js';
import { mulberry32, range, noise2 } from '../core/math.js';

// Buildings, trees and the people, as flat-colored low-poly props.
// Same instancing attributes as plants (aPos, aRS, aState) so PlantBatch can place them.

const VERT = /* glsl */ `
${COMMON_UNIFORMS}
attribute vec4 aData;
attribute vec3 color;
attribute vec3 aPos;
attribute vec2 aRS;
attribute vec2 aState;
uniform float uSway;
varying vec3 vN; varying vec3 vWorld; varying vec3 vCol; varying float vAO; varying float vWob;
void main() {
  float c = cos(aRS.x), s = sin(aRS.x);
  mat3 R = mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  vec3 world = aPos + R * (position * aRS.y);
  // canopies move a little in the wind: aData.y holds the sway weight
  float k = aData.y * uSway;
  world.x += sin(uTime * 0.9 + world.z * 0.2 + aState.y * 6.0) * k * uWind.x;
  world.z += sin(uTime * 0.7 + world.x * 0.2 + aState.y * 4.0) * k * uWind.z;
  vN = R * normal; vWorld = world; vCol = color; vAO = aData.z; vWob = aData.x;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}`;

const FRAG = /* glsl */ `
${COMMON_UNIFORMS}
${NOISE}
${LIGHTING}
uniform vec3 uLabelColor;
uniform float uStripes;
varying vec3 vN; varying vec3 vWorld; varying vec3 vCol; varying float vAO; varying float vWob;
void main() {
  if (onLabelSide()) {
    gl_FragColor = vec4(uLabelColor, 1.0);
    #include <colorspace_fragment>
    return;
  }
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 n = normalize(vN);
  n = faceforward(n, -V, n);
  vec3 albedo = vCol * (0.92 + 0.16 * vnoise(vWorld.xz * 1.6 + vWorld.y));
  if (uStripes > 0.5) albedo *= 0.9 + 0.1 * sin((vWorld.x + vWorld.z) * 16.0);
  vec3 col = shade(albedo, n, V, vAO, uStripes > 0.5 ? 0.0 : 0.25, uStripes > 0.5 ? 0.35 : 0.0);
  col = applyFog(col, length(cameraPosition - vWorld));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

export function propMaterial({ label = '#6d5db4', sway = 0, stripes = 0 } = {}) {
  return new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, side: THREE.DoubleSide,
    uniforms: { ...U, uLabelColor: { value: new THREE.Color(label) }, uSway: { value: sway }, uStripes: { value: stripes } },
  });
}

const col = (hex) => { const c = new THREE.Color(hex); return [c.r, c.g, c.b]; };

// An axis-aligned box with flat shading and a per-box color. Rotated about Y if asked.
function box(B, cx, cy, cz, sx, sy, sz, hex, rot = 0, ao = 0.9, sway = 0) {
  const c = col(hex);
  const cs = Math.cos(rot), sn = Math.sin(rot);
  const R = (x, z) => [cx + x * cs + z * sn, cz - x * sn + z * cs];
  const hx = sx / 2, hz = sz / 2;
  const faces = [
    [[-hx, 0, hz], [hx, 0, hz], [hx, sy, hz], [-hx, sy, hz]],
    [[hx, 0, -hz], [-hx, 0, -hz], [-hx, sy, -hz], [hx, sy, -hz]],
    [[hx, 0, hz], [hx, 0, -hz], [hx, sy, -hz], [hx, sy, hz]],
    [[-hx, 0, -hz], [-hx, 0, hz], [-hx, sy, hz], [-hx, sy, -hz]],
    [[-hx, sy, hz], [hx, sy, hz], [hx, sy, -hz], [-hx, sy, -hz]],
    [[-hx, 0, -hz], [hx, 0, -hz], [hx, 0, hz], [-hx, 0, hz]],
  ];
  for (const f of faces) {
    const ids = f.map(([x, y, z]) => { const [px, pz] = R(x, z); return B.vert(px, cy + y, pz, 0, 0, [0, sway, ao, 0], 0, c); });
    B.quad(ids[0], ids[1], ids[2], ids[3]);
  }
}

// A pitched roof: two sloped quads and two gable triangles.
function roof(B, cx, cy, cz, sx, sz, rise, hex, rot = 0, over = 0.25) {
  const c = col(hex);
  const cs = Math.cos(rot), sn = Math.sin(rot);
  const R = (x, z) => [cx + x * cs + z * sn, cz - x * sn + z * cs];
  const hx = sx / 2 + over, hz = sz / 2 + over;
  const v = (x, y, z, ao = 0.95) => { const [px, pz] = R(x, z); return B.vert(px, cy + y, pz, 0, 0, [0, 0, ao, 0], 0, c); };
  const a = v(-hx, 0, hz), b = v(hx, 0, hz), cc = v(hx, rise, 0), d = v(-hx, rise, 0);
  B.quad(a, b, cc, d);
  const e = v(hx, 0, -hz), f = v(-hx, 0, -hz), g = v(-hx, rise, 0), h = v(hx, rise, 0);
  B.quad(e, f, g, h);
  const t1 = [v(-hx, 0, hz, 0.8), v(-hx, rise, 0, 0.8), v(-hx, 0, -hz, 0.8)];
  B.tri(t1[0], t1[1], t1[2]);
  const t2 = [v(hx, 0, -hz, 0.8), v(hx, rise, 0, 0.8), v(hx, 0, hz, 0.8)];
  B.tri(t2[0], t2[1], t2[2]);
}

function cyl(B, cx, cy, cz, r0, r1, h, sides, hex, ao = 0.9, sway = 0) {
  const c = col(hex);
  const rings = [];
  for (let k = 0; k < 2; k++) {
    const ring = [];
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2;
      const r = k ? r1 : r0;
      ring.push(B.vert(cx + Math.cos(a) * r, cy + k * h, cz + Math.sin(a) * r, 0, 0, [0, sway, ao, 0], 0, c));
    }
    rings.push(ring);
  }
  for (let i = 0; i < sides; i++) { const j = (i + 1) % sides; B.quad(rings[0][i], rings[0][j], rings[1][j], rings[1][i]); }
  const top = B.vert(cx, cy + h, cz, 0, 0, [0, sway, ao, 0], 0, c);
  for (let i = 0; i < sides; i++) B.tri(rings[1][i], rings[1][(i + 1) % sides], top);
}

// A lumpy canopy: subdivided icosahedron pushed around by noise, shaded by height.
function blob(B, cx, cy, cz, r, sx, sy, sz, hexLo, hexHi, seed, lump = 0.22, sway = 1) {
  const t = (1 + Math.sqrt(5)) / 2;
  let V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]]
    .map((v) => { const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l]; });
  let F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  for (let s = 0; s < 2; s++) {
    const cache = new Map(); const NF = [];
    const mid = (a, b) => {
      const k = a < b ? `${a}_${b}` : `${b}_${a}`;
      if (cache.has(k)) return cache.get(k);
      const m = [(V[a][0] + V[b][0]) / 2, (V[a][1] + V[b][1]) / 2, (V[a][2] + V[b][2]) / 2];
      const l = Math.hypot(...m); V.push([m[0] / l, m[1] / l, m[2] / l]);
      cache.set(k, V.length - 1); return V.length - 1;
    };
    for (const [a, b, c] of F) { const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a); NF.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]); }
    F = NF;
  }
  const lo = col(hexLo), hi = col(hexHi);
  const ids = V.map((v) => {
    const n = noise2(v[0] * 2.2 + seed, v[2] * 2.2 + v[1] * 1.7) - 0.5;
    const k = 1 + n * lump * 2;
    const h = (v[1] + 1) / 2;
    const cc = [lo[0] + (hi[0] - lo[0]) * h, lo[1] + (hi[1] - lo[1]) * h, lo[2] + (hi[2] - lo[2]) * h];
    const j = 0.9 + n * 0.5;
    return B.vert(cx + v[0] * r * sx * k, cy + v[1] * r * sy * k, cz + v[2] * r * sz * k, 0, 0, [0, sway, 0.55 + 0.45 * h, 0], 0, [cc[0] * j, cc[1] * j, cc[2] * j]);
  });
  for (const [a, b, c] of F) B.tri(ids[a], ids[b], ids[c]);
}

export function buildHouse() {
  const B = new MeshBuilder();
  // main house
  box(B, 0, 0, 0, 5.2, 2.5, 3.6, '#e8e1d2');
  roof(B, 0, 2.5, 0, 5.2, 3.6, 1.1, '#8b95a6', 0, 0.35);
  box(B, -0.9, 0, 1.81, 0.9, 1.7, 0.08, '#3a2a2a');          // door
  box(B, 1.2, 0.9, 1.81, 0.8, 0.7, 0.08, '#2b3a4e');          // window
  box(B, 1.9, 0, 1.0, 0.7, 0.9, 0.7, '#8c7a63', 0.2);         // wood pile
  // kitchen annex
  box(B, 3.6, 0, -0.4, 2.4, 2.0, 2.4, '#d8cdb7');
  roof(B, 3.6, 2.0, -0.4, 2.4, 2.4, 0.8, '#7f8999', 0, 0.3);
  // water tank
  cyl(B, -3.4, 0, -0.6, 0.62, 0.62, 1.4, 10, '#6f8fb0');
  cyl(B, -3.4, 1.4, -0.6, 0.62, 0.05, 0.25, 10, '#5d7b9b');
  return B.build(true);
}

export function buildCoop() {
  // the cooperative's receiving shed with a drying yard
  const B = new MeshBuilder();
  box(B, 0, 0, 0, 9.0, 3.4, 5.4, '#dcd5c6');
  roof(B, 0, 3.4, 0, 9.0, 5.4, 1.5, '#6f7c8e', 0, 0.5);
  box(B, 0, 0, 2.75, 3.0, 2.3, 0.1, '#3d3a46');                // big door
  box(B, -3.2, 0.9, 2.75, 1.0, 0.9, 0.1, '#2b3a4e');
  box(B, 3.2, 0.9, 2.75, 1.0, 0.9, 0.1, '#2b3a4e');
  box(B, 0, 2.5, 2.8, 4.4, 0.6, 0.08, '#19b3c8');              // sign board
  // sacks of parchment coffee
  for (let i = 0; i < 6; i++) box(B, -4.8 + (i % 3) * 0.7, Math.floor(i / 3) * 0.5, 3.6 + Math.floor(i / 3) * 0.1, 0.6, 0.5, 0.4, '#d8c9a3', 0.1 * i);
  return B.build(true);
}

export function buildDryingBeds() {
  // raised African drying beds with parchment coffee spread on mesh
  const B = new MeshBuilder();
  for (let b = 0; b < 3; b++) {
    const z = b * 1.9;
    for (const [lx, lz] of [[-1.7, -0.7], [1.7, -0.7], [-1.7, 0.7], [1.7, 0.7]]) box(B, lx, 0, z + lz, 0.1, 0.8, 0.1, '#5a4331');
    box(B, 0, 0.8, z, 4.0, 0.08, 1.7, '#7a6a52');
    box(B, 0, 0.88, z, 3.8, 0.1, 1.5, '#a07844');
  }
  return B.build(true);
}

export function buildTree(seed) {
  const rng = mulberry32(seed);
  const B = new MeshBuilder();
  const H = range(rng, 7, 9);
  cyl(B, 0, 0, 0, 0.45, 0.22, H * 0.7, 6, '#5a4331', 0.7, 0.02);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + rng();
    blob(B, Math.cos(a) * 2.2, H * 0.78 + range(rng, -0.4, 0.6), Math.sin(a) * 2.2, 3.3, 1.2, 0.45, 1.2, '#2c5f3a', '#6f9e4a', seed + i * 3.1, 0.25, 1);
  }
  blob(B, 0, H * 0.9, 0, 3.6, 1.2, 0.5, 1.2, '#2f6a3d', '#7ba94f', seed + 9.7, 0.25, 1);
  return B.build(true);
}

export function buildPerson() {
  // Noor, about 1.6 m, in a teal wrap with a yellow headscarf, holding a phone
  const B = new MeshBuilder();
  const skin = col('#8a5a3c'), scarf = col('#f4c542');
  cyl(B, -0.08, 0, 0, 0.065, 0.06, 0.8, 5, '#8a5a3c', 0.9);
  cyl(B, 0.08, 0, 0, 0.065, 0.06, 0.8, 5, '#8a5a3c', 0.9);
  cyl(B, 0, 0.55, 0, 0.23, 0.12, 0.85, 8, '#1f7a96', 0.95);
  cyl(B, 0.17, 1.05, 0.05, 0.045, 0.04, 0.35, 5, '#8a5a3c');
  cyl(B, -0.17, 1.05, 0.05, 0.045, 0.04, 0.35, 5, '#8a5a3c');
  B.ball(0, 1.52, 0, 0.11, 0, [0, 0, 0.95, 0], 1, 1.1, 1, skin);
  B.ball(0, 1.58, -0.015, 0.125, 0, [0, 0, 0.95, 0], 1, 0.8, 1, scarf);
  box(B, 0.0, 1.0, 0.24, 0.1, 0.17, 0.015, '#dff3ff');
  return B.build(true);
}

export function buildRocks(seed) {
  const rng = mulberry32(seed);
  const B = new MeshBuilder();
  blob(B, 0, 0.3, 0, 0.8, 1.2, 0.7, 1.0, '#6c6a78', '#a6a4b4', seed, 0.3, 0);
  blob(B, 0.9, 0.2, 0.4, 0.5, 1.1, 0.7, 1.0, '#6c6a78', '#a6a4b4', seed + 2, 0.3, 0);
  void rng;
  return B.build(true);
}
