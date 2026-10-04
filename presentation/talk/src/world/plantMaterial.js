import * as THREE from 'three';
import { U } from '../core/env.js';
import { COMMON_UNIFORMS, NOISE, LIGHTING, WIND } from '../gl/chunks.js';

// One shader for every plant. Coffee turns the "sick" switch on: leaves grow rust
// lesions from the plant's severity, and the label side paints the same lesions
// as class colors. Maize, beans and banana are plain crops with one flat label color.

const VERT = /* glsl */ `
${COMMON_UNIFORMS}
${WIND}
attribute vec4 aData;
attribute float aPart;
attribute vec3 aPos;
attribute vec2 aRS;      // yaw, scale
attribute vec2 aState;   // plant severity 0..1, seed 0..1
uniform float uSway;
uniform float uSick;
varying vec3 vN;
varying vec3 vWorld;
varying vec2 vUv;
varying vec4 vData;
varying float vPart;
varying float vLeafSev;
varying float vSeed;
varying float vPlantSev;
void main() {
  float c = cos(aRS.x), s = sin(aRS.x);
  mat3 R = mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  vec3 world = aPos + R * (position * aRS.y);
  float isLeaf = step(0.5, aPart) * step(aPart, 1.5);
  float sev = 0.0;
  if (uSick > 0.5) sev = clamp((aState.x - aData.x * 0.5) / 0.38, 0.0, 1.0) * isLeaf;
  world += windOffset(world, uSway * aData.y * aRS.y, aState.y * 6.2831 + aData.x * 3.0);
  vN = R * normal;
  vWorld = world;
  vUv = uv;
  vData = aData;
  vPart = aPart;
  vLeafSev = sev;
  vSeed = aState.y;
  vPlantSev = uSick > 0.5 ? aState.x : 0.0;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
  // dead leaves drop, but only once the whole shrub is far gone, so a sick patch still reads from afar
  if (sev > 0.985 && fract(aData.x * 13.7 + aState.y * 5.3) < smoothstep(0.82, 1.0, aState.x)) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`;

const FRAG = /* glsl */ `
${COMMON_UNIFORMS}
${NOISE}
${LIGHTING}
uniform vec3 uLeafA; uniform vec3 uLeafB; uniform vec3 uUnder; uniform vec3 uWood;
uniform vec3 uFruitA; uniform vec3 uFruitB; uniform vec3 uFruitC;
uniform vec3 uLabelFlat; uniform vec3 uLabelLeaf; uniform vec3 uLabelEarly; uniform vec3 uLabelSevere; uniform vec3 uLabelFruit; uniform vec3 uLabelWood;
uniform float uSick;
uniform float uShine;
varying vec3 vN; varying vec3 vWorld; varying vec2 vUv; varying vec4 vData; varying float vPart; varying float vLeafSev; varying float vSeed; varying float vPlantSev;

// Rust-like lesions: a jittered grid of round spots that grow and multiply with severity s.
void lesions(vec2 uv, float seed, float s, out float spot, out float core) {
  spot = 0.0; core = 0.0;
  vec2 g = vec2(uv.x * 6.0, (uv.y * 0.5 + 0.5) * 3.0);
  vec2 id = floor(g);
  vec2 f = fract(g);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j));
      vec2 cid = id + o;
      float h = hash21(cid + seed * 17.0);
      float on = step(h, 0.2 + 0.7 * s);
      vec2 c = o + 0.15 + 0.7 * hash22(cid + seed * 5.0 + 3.1);
      float r = (0.17 + 0.30 * s) * (0.65 + 0.7 * hash21(cid + seed * 9.0));
      vec2 dv = (f - c) * vec2(1.0, 1.15);
      float d = length(dv);
      spot = max(spot, on * smoothstep(r, r * 0.55, d));
      core = max(core, on * smoothstep(r * 0.55, r * 0.15, d) * smoothstep(0.2, 0.55, s));
    }
  }
}

void main() {
  float isWood = step(vPart, 0.5);
  float isLeaf = step(0.5, vPart) * step(vPart, 1.5);
  float isFruit = step(1.5, vPart) * step(vPart, 2.5);
  float s = vLeafSev;
  float spot = 0.0; float core = 0.0;
  if (uSick > 0.5 && isLeaf > 0.5 && s > 0.002) lesions(vUv, vData.x * 3.7 + vSeed, s, spot, core);

  if (onLabelSide()) {
    vec3 L = uLabelFlat;
    if (uSick > 0.5) {
      if (isWood > 0.5) L = uLabelWood;
      else if (isFruit > 0.5) L = uLabelFruit;
      else {
        L = uLabelLeaf;
        if (spot > 0.5) L = (s < 0.42 && core < 0.5) ? uLabelEarly : uLabelSevere;
        if (s > 0.78) L = uLabelSevere;
      }
    }
    gl_FragColor = vec4(L, 1.0);
    #include <colorspace_fragment>
    return;
  }

  vec3 V = normalize(cameraPosition - vWorld);
  vec3 n = normalize(vN);
  n = faceforward(n, -V, n);
  bool upper = gl_FrontFacing;
  vec3 albedo; float spec = 0.0; float trans = 0.0;

  if (isWood > 0.5) {
    albedo = uWood * (0.85 + 0.3 * vnoise(vWorld.xz * 9.0 + vWorld.y * 5.0));
  } else if (isFruit > 0.5) {
    float ripe = vData.w;
    vec3 a = ripe < 0.5 ? mix(uFruitA, uFruitC, ripe * 2.0) : mix(uFruitC, uFruitB, ripe * 2.0 - 1.0);
    albedo = a; spec = 0.55;
  } else if (vPart > 2.5) {
    albedo = vec3(0.78, 0.72, 0.45); trans = 0.4;
  } else {
    float edge = abs(vUv.y);
    float mott = vnoise(vUv * vec2(9.0, 4.0) + vData.x * 12.0);
    float tone = clamp(0.35 * vUv.x + 0.45 * edge + 0.4 * (mott - 0.5) + (hash11(vSeed * 91.0) - 0.5) * 0.25, 0.0, 1.0);
    vec3 top = mix(uLeafA, uLeafB, tone);
    float rib = smoothstep(0.10, 0.0, edge);
    float vein = smoothstep(0.90, 1.0, abs(sin((vUv.x * 7.0 - edge * 2.4) * 3.14159)));
    top = mix(top, top * 1.45 + 0.02, rib * 0.55 + vein * 0.12 * (1.0 - rib));
    vec3 under = uUnder * (0.9 + 0.2 * mott);
    albedo = upper ? top : under;
    if (uSick > 0.5 && s > 0.002) {
      if (upper) {
        vec3 halo = vec3(0.86, 0.80, 0.18);
        vec3 rust = vec3(0.80, 0.36, 0.05);
        vec3 necro = vec3(0.17, 0.08, 0.04);
        albedo = mix(albedo, halo, spot * 0.92);
        albedo = mix(albedo, rust, core * 0.75);
        albedo = mix(albedo, necro, core * smoothstep(0.5, 0.85, s));
        albedo = mix(albedo, vec3(0.45, 0.36, 0.08), smoothstep(0.55, 0.95, s) * 0.65);
      } else {
        float pust = spot * step(0.5, vnoise(vUv * vec2(90.0, 45.0) + vData.x * 40.0));
        albedo = mix(albedo, vec3(0.93, 0.50, 0.06), clamp(spot * 0.5 + pust * 0.7, 0.0, 1.0));
        albedo = mix(albedo, vec3(0.28, 0.16, 0.07), smoothstep(0.7, 0.95, s));
      }
    }
    // a sick shrub turns rusty yellow as a whole, so a sick patch reads from far away
    albedo = mix(albedo, vec3(0.62, 0.5, 0.12), smoothstep(0.18, 0.85, vPlantSev) * 0.5);
    spec = upper ? uShine * (1.0 - 0.7 * spot) : 0.02;
    trans = 0.55;
  }

  float ao = vData.z;
  vec3 col = shade(albedo, n, V, ao, trans, spec);
  col = applyFog(col, length(cameraPosition - vWorld));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

const C = (hex) => new THREE.Color(hex);

export function plantMaterial(opts = {}) {
  const o = {
    leafA: '#133d27', leafB: '#2d7d44', under: '#6f9a74', wood: '#5a4331',
    fruitA: '#6aa84a', fruitC: '#e7c53a', fruitB: '#c4262e',
    sway: 0.1, shine: 0.25, sick: 0, labelFlat: '#6d5db4',
    ...opts,
  };
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    side: THREE.DoubleSide,
    uniforms: {
      ...U,
      uLeafA: { value: C(o.leafA) }, uLeafB: { value: C(o.leafB) }, uUnder: { value: C(o.under) }, uWood: { value: C(o.wood) },
      uFruitA: { value: C(o.fruitA) }, uFruitB: { value: C(o.fruitB) }, uFruitC: { value: C(o.fruitC) },
      uLabelFlat: { value: C(o.labelFlat) }, uLabelLeaf: { value: C('#19b3c8') }, uLabelEarly: { value: C('#ffe14d') },
      uLabelSevere: { value: C('#f2552c') }, uLabelFruit: { value: C('#b15cf5') }, uLabelWood: { value: C('#dcd6f4') },
      uSick: { value: o.sick }, uSway: { value: o.sway }, uShine: { value: o.shine },
    },
  });
}

// One mesh, many plants. Instance attributes: position, yaw+scale, severity+seed.
export class PlantBatch {
  constructor(geometry, capacity, material) {
    this.capacity = capacity;
    this.count = 0;
    const g = new THREE.InstancedBufferGeometry();
    g.index = geometry.index;
    for (const name of ['position', 'normal', 'uv', 'aData', 'aPart', 'color']) { const a = geometry.getAttribute(name); if (a) g.setAttribute(name, a); }
    this.aPos = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3), 3);
    this.aRS = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 2), 2);
    this.aState = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 2), 2);
    this.aState.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('aPos', this.aPos);
    g.setAttribute('aRS', this.aRS);
    g.setAttribute('aState', this.aState);
    g.instanceCount = 0;
    this.geometry = g;
    this.mesh = new THREE.Mesh(g, material);
    this.mesh.frustumCulled = false;
  }

  reset() { this.count = 0; this.geometry.instanceCount = 0; }

  add(x, y, z, yaw, scale, seed) {
    const i = this.count++;
    this.aPos.setXYZ(i, x, y, z);
    this.aRS.setXY(i, yaw, scale);
    this.aState.setXY(i, 0, seed);
    this.geometry.instanceCount = this.count;
    this.aPos.needsUpdate = true; this.aRS.needsUpdate = true; this.aState.needsUpdate = true;
    return i;
  }

  setSeverity(i, sev) { this.aState.array[i * 2] = sev; }
  flush() { this.aState.needsUpdate = true; }
}
