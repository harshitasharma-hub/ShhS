import * as THREE from 'three';
import { U } from '../core/env.js';
import { COMMON_UNIFORMS, NOISE, LIGHTING } from '../gl/chunks.js';

// Clouds under and behind the model, and soft ground shadows that follow the sun.

const CLOUD_VERT = /* glsl */ `
varying vec2 vUv; varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz; vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const CLOUD_FRAG = /* glsl */ `
${COMMON_UNIFORMS}
${NOISE}
${LIGHTING}
uniform vec2 uScale; uniform float uSpeed; uniform float uAlpha; uniform float uSeed; uniform vec3 uTint; uniform float uFadeY;
varying vec2 vUv; varying vec3 vWorld;
void main() {
  float photo = onLabelSide() ? 0.0 : 1.0;
  vec2 p = vUv * uScale + vec2(uTime * uSpeed, 0.0) + uSeed * 17.0;
  float n = fbm(p) * 0.65 + fbm(p * 2.1 + 5.0) * 0.35;
  float a = smoothstep(0.38, 0.78, n);
  // fade toward the plane's edges so no hard borders show
  vec2 e = abs(vUv - 0.5) * 2.0;
  float edge = 1.0 - smoothstep(0.55, 1.0, max(e.x, uFadeY > 0.5 ? e.y : e.x * 0.0));
  float edgeY = uFadeY > 0.5 ? 1.0 : 1.0 - smoothstep(0.55, 1.0, e.y);
  a *= edge * edgeY * uAlpha * photo;
  float light = 0.9 + 0.2 * smoothstep(0.3, 0.9, n);
  vec3 col = mix(uFogColor, vec3(1.0), 0.35) * uTint * light;
  col = mix(col, uFogColor, 1.0 - exp(-0.00002 * dot(vWorld - cameraPosition, vWorld - cameraPosition)));
  gl_FragColor = vec4(col, a);
  #include <colorspace_fragment>
}`;

export function buildClouds() {
  const g = new THREE.Group();
  const make = (w, h, pos, rotX, scale, speed, alpha, seed, tint, fadeY = 0) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h, 1, 1),
      new THREE.ShaderMaterial({
        vertexShader: CLOUD_VERT, fragmentShader: CLOUD_FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: {
          ...U, uScale: { value: new THREE.Vector2(...scale) }, uSpeed: { value: speed }, uAlpha: { value: alpha },
          uSeed: { value: seed }, uTint: { value: new THREE.Color(tint) }, uFadeY: { value: fadeY },
        },
      }),
    );
    m.position.set(...pos);
    m.rotation.x = rotX;
    m.frustumCulled = false;
    m.renderOrder = 5;
    g.add(m);
    return m;
  };
  // seas of cloud beneath the block
  make(700, 700, [0, -13, 10], -Math.PI / 2, [5, 5], 0.004, 0.95, 1, '#ffffff');
  make(520, 520, [0, -18, 20], -Math.PI / 2, [4, 4], -0.003, 0.9, 2, '#f1e8f6');
  make(700, 700, [0, -24, 0], -Math.PI / 2, [3, 3], 0.002, 1.0, 3, '#e8e2f2');
  // soft banks of mist standing behind the model
  make(1100, 150, [0, 14, -250], 0, [7, 1.6], 0.003, 0.5, 4, '#e8def4', 0);
  make(1300, 170, [0, 22, -420], 0, [6, 1.4], -0.002, 0.45, 5, '#dcd8f2', 0);
  return g;
}

// Ground shadows. Each plant casts an ellipse away from the sun. Length follows sun height.
const DECAL_VERT = /* glsl */ `
${COMMON_UNIFORMS}
attribute vec3 aBase;   // plant base
attribute vec3 aDims;   // length, width, height
varying vec2 vUv;
void main() {
  vec2 sd = -uSunDir.xz;
  float horiz = max(length(sd), 0.0001);
  vec2 dir = sd / horiz;
  vec2 perp = vec2(-dir.y, dir.x);
  float stretch = clamp(horiz / max(uSunDir.y, 0.05), 0.35, 2.6);
  float len = aDims.x * (0.45 + 0.55 * stretch) + aDims.z * stretch * 0.25;
  float wid = aDims.y;
  vec2 q = position.xy; // plane is in xy, -0.5..0.5
  vec2 off = dir * (q.x * len + len * 0.28) + perp * q.y * wid;
  vec3 world = vec3(aBase.x + off.x, aBase.y + 0.06, aBase.z + off.y);
  vUv = position.xy * 2.0;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}`;

const DECAL_FRAG = /* glsl */ `
${COMMON_UNIFORMS}
${LIGHTING}
varying vec2 vUv;
void main() {
  float photo = onLabelSide() ? 0.0 : 1.0;
  float r = length(vUv);
  float a = pow(clamp(1.0 - r, 0.0, 1.0), 1.4) * 0.5 * photo;
  gl_FragColor = vec4(vec3(0.05, 0.025, 0.04), a);
  #include <colorspace_fragment>
}`;

export class Shadows {
  constructor(capacity) {
    const base = new THREE.PlaneGeometry(1, 1);
    const g = new THREE.InstancedBufferGeometry();
    g.index = base.index;
    g.setAttribute('position', base.getAttribute('position'));
    this.aBase = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3), 3);
    this.aDims = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3), 3);
    g.setAttribute('aBase', this.aBase);
    g.setAttribute('aDims', this.aDims);
    g.instanceCount = 0;
    this.geometry = g;
    this.count = 0;
    this.mesh = new THREE.Mesh(g, new THREE.ShaderMaterial({
      vertexShader: DECAL_VERT, fragmentShader: DECAL_FRAG, uniforms: { ...U },
      transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
    }));
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 2;
  }

  add(x, y, z, len, wid, height) {
    const i = this.count++;
    this.aBase.setXYZ(i, x, y, z);
    this.aDims.setXYZ(i, len, wid, height);
    this.geometry.instanceCount = this.count;
    this.aBase.needsUpdate = true; this.aDims.needsUpdate = true;
  }
}
