import * as THREE from 'three';
import { U } from '../core/env.js';
import { COMMON_UNIFORMS, NOISE, LIGHTING } from '../gl/chunks.js';
import { clamp, lerp, smoothstep, fbm2 } from '../core/math.js';

// Noor's slope, built as a model: a block of hillside you can look into from the side.
// Beans at the front, maize in the middle, terraced coffee at the back.
export const T = { x0: -62, x1: 62, z0: -50, z1: 58, floorY: -9, step: 2.4 };

const slopeS = (x, z) => clamp((T.z1 - z) / (T.z1 - T.z0)) + 0.035 * Math.sin(x * 0.045 + z * 0.02) + 0.02 * Math.sin(x * 0.11);

export function heightAt(x, z) {
  const s = slopeS(x, z);
  let h = Math.pow(clamp(s), 1.3) * 33;
  const w = smoothstep(0.46, 0.56, s);
  const k = Math.floor(h / T.step);
  const f = h / T.step - k;
  const hT = (k + smoothstep(0.78, 1.0, f)) * T.step;
  h = lerp(h, hT, w);
  h += (fbm2(x * 0.05 + 3, z * 0.05) - 0.5) * 2.2 * (1 - 0.6 * w);
  return h;
}

// z of the middle of terrace tread k at a given x (fixed-point inverse of the slope).
export function terraceZ(x, k, f = 0.4) {
  const target = (k + f) * T.step;
  const sBase = Math.pow(target / 33, 1 / 1.3);
  let z = T.z1 - sBase * (T.z1 - T.z0);
  for (let i = 0; i < 6; i++) {
    const s = sBase - (slopeS(x, z) - clamp((T.z1 - z) / (T.z1 - T.z0)));
    z = T.z1 - s * (T.z1 - T.z0);
  }
  return z;
}

// The footpath: house to coffee slope, and down to the cooperative track.
export const PATH = [
  [48, 62], [45, 48], [32, 41], [14, 37], [-4, 32], [-18, 26], [-30, 19], [-38, 14],
  [-31, 7], [-22, 1], [-28, -7], [-35, -13], [-27, -19], [-19, -25], [-25, -33], [-31, -39], [-25, -46],
];

export function distToPath(x, z) {
  let best = 1e9;
  for (let i = 0; i < PATH.length - 1; i++) {
    const [ax, az] = PATH[i], [bx, bz] = PATH[i + 1];
    const dx = bx - ax, dz = bz - az;
    const t = clamp(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz));
    const px = ax + dx * t, pz = az + dz * t;
    best = Math.min(best, Math.hypot(x - px, z - pz));
  }
  return best;
}

const TERRAIN_VERT = /* glsl */ `
attribute float aPath;
varying vec3 vWorld;
varying vec3 vN;
varying float vPath;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vPath = aPath;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const TERRAIN_FRAG = /* glsl */ `
${COMMON_UNIFORMS}
${NOISE}
${LIGHTING}
uniform vec3 uSoilCoffee; uniform vec3 uSoilMaize; uniform vec3 uSoilBeans; uniform vec3 uGrass; uniform vec3 uPathCol; uniform vec3 uLabelOther;
varying vec3 vWorld; varying vec3 vN; varying float vPath; void main() {
  if (onLabelSide()) {
    vec3 L = uLabelGround;
    float c = abs(fract(vWorld.y / 2.4 + 0.5) - 0.5);
    L += vec3(0.05, 0.045, 0.09) * smoothstep(0.035, 0.0, c);
    L = mix(L, uLabelOther, vPath);
    gl_FragColor = vec4(L, 1.0);
    #include <colorspace_fragment>
    return;
  }
  vec3 n = normalize(vN);
  vec3 V = normalize(cameraPosition - vWorld);
  float zc = smoothstep(6.0, 0.0, vWorld.z);
  float zb = smoothstep(28.0, 38.0, vWorld.z);
  vec3 soil = mix(mix(uSoilMaize, uSoilCoffee, zc), uSoilBeans, zb);
  soil *= 0.84 + 0.32 * fbm(vWorld.xz * 0.33);
  // planted rows: green understory under the coffee hedge, stripes of maize and beans
  float sSlope = clamp((58.0 - vWorld.z) / 108.0 + 0.035 * sin(vWorld.x * 0.045 + vWorld.z * 0.02) + 0.02 * sin(vWorld.x * 0.11), 0.0, 1.0);
  float tread = fract(pow(sSlope, 1.3) * 33.0 / 2.4);
  float band = zc * smoothstep(0.08, 0.26, tread) * smoothstep(0.74, 0.56, tread);
  soil = mix(soil, vec3(0.09, 0.20, 0.08) * (0.8 + 0.5 * fbm(vWorld.xz * 0.8)), band * 0.8);
  float mz = smoothstep(6.5, 8.5, vWorld.z) * (1.0 - smoothstep(29.0, 33.0, vWorld.z));
  float md = abs(fract((vWorld.z - 9.0) / 2.6 + 0.5) - 0.5);
  soil = mix(soil, vec3(0.22, 0.40, 0.10) * (0.8 + 0.5 * fbm(vWorld.xz * 0.9)), mz * smoothstep(0.30, 0.12, md) * 0.85);
  float bz = smoothstep(32.0, 34.0, vWorld.z);
  float bd = abs(fract((vWorld.z - 35.0) / 2.0 + 0.5) - 0.5);
  soil = mix(soil, vec3(0.30, 0.50, 0.14) * (0.8 + 0.5 * fbm(vWorld.xz * 0.9)), bz * smoothstep(0.32, 0.12, bd) * 0.85);
  float slope = 1.0 - clamp(n.y, 0.0, 1.0);
  float grass = smoothstep(0.28, 0.5, slope);
  vec3 g = uGrass * (0.78 + 0.45 * fbm(vWorld.xz * 0.5));
  vec3 col = mix(soil, g, grass);
  col = mix(col, uPathCol * (0.92 + 0.16 * vnoise(vWorld.xz * 2.0)), vPath * 0.9);
  col = shade(col, n, V, 1.0, 0.0, 0.0);
  // the block dissolves into the mist underneath
  col = mix(uFogColor, col, 0.25 + 0.75 * smoothstep(-8.0, 0.5, vWorld.y));
  col = applyFog(col, length(cameraPosition - vWorld));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

const WALL_VERT = /* glsl */ `
attribute float aDepth;
varying vec3 vWorld; varying vec3 vN; varying float vDepth;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vDepth = aDepth;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const WALL_FRAG = /* glsl */ `
${COMMON_UNIFORMS}
${NOISE}
${LIGHTING}
varying vec3 vWorld; varying vec3 vN; varying float vDepth;
void main() {
  if (onLabelSide()) {
    gl_FragColor = vec4(mix(uLabelGround, vec3(1.0), 0.06), 1.0);
    #include <colorspace_fragment>
    return;
  }
  float wob = (fbm(vec2(vWorld.x + vWorld.z, 0.0) * 0.12) - 0.5) * 2.2;
  float d = vDepth + wob;
  vec3 topsoil = vec3(0.17, 0.085, 0.055);
  vec3 clay    = vec3(0.34, 0.14, 0.085);
  vec3 sand    = vec3(0.52, 0.30, 0.18);
  vec3 rock    = vec3(0.30, 0.27, 0.40);
  vec3 col = topsoil;
  col = mix(col, clay, smoothstep(0.5, 0.9, d));
  col = mix(col, sand, smoothstep(5.0, 5.6, d));
  col = mix(col, clay, smoothstep(9.5, 10.1, d));
  col = mix(col, rock, smoothstep(15.0, 15.6, d));
  // thin horizontal bedding lines
  float line = smoothstep(0.06, 0.0, abs(fract(d * 0.55) - 0.5) - 0.44);
  col *= 1.0 - 0.10 * line;
  col *= 0.9 + 0.2 * vnoise(vec2(vWorld.x + vWorld.z, vWorld.y * 1.5) * 1.3);
  vec3 n = normalize(vN);
  vec3 V = normalize(cameraPosition - vWorld);
  col = shade(col, n, V, 0.9, 0.0, 0.0);
  col = mix(uFogColor, col, 0.12 + 0.88 * smoothstep(-8.5, -0.5, vWorld.y));
  col = applyFog(col, length(cameraPosition - vWorld));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

export function buildTerrain(quality = 1) {
  const nx = Math.round(170 * quality), nz = Math.round(150 * quality);
  const sizeX = T.x1 - T.x0, sizeZ = T.z1 - T.z0;
  const pos = new Float32Array((nx + 1) * (nz + 1) * 3);
  const path = new Float32Array((nx + 1) * (nz + 1));
  let i = 0, j = 0;
  for (let iz = 0; iz <= nz; iz++) {
    for (let ix = 0; ix <= nx; ix++) {
      const x = T.x0 + (ix / nx) * sizeX, z = T.z0 + (iz / nz) * sizeZ;
      pos[i++] = x; pos[i++] = heightAt(x, z); pos[i++] = z;
      path[j++] = smoothstep(1.7, 0.7, distToPath(x, z));
    }
  }
  const idx = [];
  for (let iz = 0; iz < nz; iz++) {
    for (let ix = 0; ix < nx; ix++) {
      const a = iz * (nx + 1) + ix, b = a + 1, c = a + (nx + 1), d = c + 1;
      idx.push(a, c, b, b, c, d); // counter-clockwise seen from above
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aPath', new THREE.BufferAttribute(path, 1));
  g.setIndex(idx);
  g.computeVertexNormals();

  const mat = new THREE.ShaderMaterial({
    vertexShader: TERRAIN_VERT, fragmentShader: TERRAIN_FRAG,
    uniforms: {
      ...U,
      uSoilCoffee: { value: new THREE.Color('#8a4429') },
      uSoilMaize: { value: new THREE.Color('#94603a') },
      uSoilBeans: { value: new THREE.Color('#a77f4f') },
      uGrass: { value: new THREE.Color('#6f9d3f') },
      uPathCol: { value: new THREE.Color('#c9a77f') },
      uLabelOther: { value: new THREE.Color('#6d5db4') },
    },
  });
  const mesh = new THREE.Mesh(g, mat);
  mesh.frustumCulled = false;

  // cut faces on four sides
  const walls = new THREE.Group();
  const wallMat = new THREE.ShaderMaterial({ vertexShader: WALL_VERT, fragmentShader: WALL_FRAG, uniforms: { ...U } });
  const wall = (pts, normal) => {
    const p = [], dp = [], ix = [];
    pts.forEach(([x, z], k) => {
      const y = heightAt(x, z);
      p.push(x, y, z, x, T.floorY, z);
      dp.push(0, y - T.floorY);
      if (k < pts.length - 1) { const a = k * 2; ix.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    geo.setAttribute('aDepth', new THREE.Float32BufferAttribute(dp, 1));
    geo.setIndex(ix);
    geo.computeVertexNormals();
    // make sure normals face outward
    const nrm = geo.getAttribute('normal');
    for (let q = 0; q < nrm.count; q++) {
      if (nrm.getX(q) * normal[0] + nrm.getZ(q) * normal[2] < 0) { nrm.setXYZ(q, -nrm.getX(q), -nrm.getY(q), -nrm.getZ(q)); }
    }
    const m = new THREE.Mesh(geo, wallMat);
    m.material.side = THREE.DoubleSide;
    m.frustumCulled = false;
    walls.add(m);
  };
  const seg = 140;
  const lineX = (z) => Array.from({ length: seg + 1 }, (_, k) => [T.x0 + (k / seg) * sizeX, z]);
  const lineZ = (x) => Array.from({ length: seg + 1 }, (_, k) => [x, T.z0 + (k / seg) * sizeZ]);
  wall(lineX(T.z1), [0, 0, 1]);
  wall(lineX(T.z0), [0, 0, -1]);
  wall(lineZ(T.x0), [-1, 0, 0]);
  wall(lineZ(T.x1), [1, 0, 0]);

  return { mesh, walls };
}
