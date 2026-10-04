import { MeshBuilder } from './builder.js';
import { mulberry32, range, clamp } from '../core/math.js';

// Procedural plant models. All units are meters, stylised ~1.6x so leaves read from far away.
// Every generator returns one merged BufferGeometry (see MeshBuilder for attributes).

const norm = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const rotY = (v, a) => { const c = Math.cos(a), s = Math.sin(a); return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c]; };

// One leaf: a pointed ellipse folded along the midrib, with a gentle arch and droop.
// u runs base to tip, v runs edge to edge. Front face = upper surface (winding matters).
function addLeaf(B, o, dir, len, wid, rnd, ao, tb, opt = {}) {
  const { curl = -0.2, rows = 4, cols = 2, broad = false, foldAmt = 0.4 } = opt;
  const d = norm(dir);
  const s = norm(cross([0, 1, 0], Math.abs(d[1]) > 0.97 ? [1, 0, 0] : d));
  const n = cross(d, s);
  B.grid(rows, cols, (u, v) => {
    const prof = broad
      ? Math.pow(Math.sin(Math.PI * Math.pow(u, 0.62)), 0.65)
      : Math.pow(Math.sin(Math.PI * Math.pow(u, 0.75)), 0.85);
    const hw = wid * 0.5 * prof;
    const fold = Math.abs(v) * hw * foldAmt;
    const arch = Math.sin(Math.PI * u * 0.9) * len * 0.07 + u * u * len * curl;
    const wave = Math.sin(u * 15 + rnd * 6.28) * 0.012 * Math.abs(v);
    const lat = v * hw;
    const h = arch + fold + wave;
    return {
      p: [o[0] + d[0] * u * len + s[0] * lat + n[0] * h, o[1] + d[1] * u * len + s[1] * lat + n[1] * h, o[2] + d[2] * u * len + s[2] * lat + n[2] * h],
      d: [rnd, clamp(0.25 * u + 0.75 * tb), ao * (0.82 + 0.18 * u), 0],
    };
  }, 1);
}

// A long ribbon along a curve (maize and banana blades).
function addRibbon(B, curve, halfW, rows, rnd, ao, tb0, tb1, fold = 0.25, wavy = 0.02) {
  const up = [0, 1, 0];
  B.grid(rows, 2, (u, v) => {
    const p = curve(u), p2 = curve(Math.min(1, u + 0.01)), p1 = curve(Math.max(0, u - 0.01));
    const t = norm([p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]]);
    const s = norm(cross(up, Math.abs(t[1]) > 0.97 ? [1, 0, 0] : t));
    const nn = cross(t, s);
    const hw = halfW(u);
    const h = Math.abs(v) * hw * fold + Math.sin(u * 18 + rnd * 6.28) * wavy * Math.abs(v);
    const lat = v * hw;
    return {
      p: [p[0] + s[0] * lat + nn[0] * h, p[1] + s[1] * lat + nn[1] * h, p[2] + s[2] * lat + nn[2] * h],
      d: [rnd, clamp(tb0 + (tb1 - tb0) * u), ao, 0],
    };
  }, 1);
}

// ------------------------------------------------------------------ coffee
// opts: tiers, nodeK (leaf nodes per branch), leafRows/leafCols (leaf mesh detail),
// berries, leafScale, woodSides. LOW is for the wide shots, HIGH for close-ups.
export const COFFEE_LOW = { tiers: 6, nodeK: 0.6, leafRows: 2, leafCols: 1, berries: false, leafScale: 1.35, woodSides: 3, branchSegs: 2 };
export const COFFEE_HIGH = { tiers: 10, nodeK: 0.95, leafRows: 4, leafCols: 2, berries: true, leafScale: 1.0, woodSides: 4, branchSegs: 3 };

export function buildCoffee(seed, o = COFFEE_HIGH) {
  const rng = mulberry32(seed);
  const B = new MeshBuilder();
  const H = range(rng, 1.3, 1.6);
  const tiers = o.tiers;
  const fruitiness = o.berries ? range(rng, 0.35, 0.8) : 0;
  const leafOpt = { rows: o.leafRows, cols: o.leafCols };

  B.tube([[0, 0, 0], [0.015, H * 0.35, 0.01], [-0.01, H * 0.7, 0.02], [0, H, 0]], [0.055, 0.04, 0.024, 0.01], Math.max(3, o.woodSides + 1), 0, (t) => [0, 0.05 * t, 0.55, 0]);

  for (let k = 0; k < tiers; k++) {
    const f = k / (tiers - 1);
    const y = 0.3 + (H - 0.3) * Math.pow(f, 0.95);
    const base = k * (Math.PI / 2) + rng() * 0.3;
    for (let pair = 0; pair < 2; pair++) {
      const az = base + pair * Math.PI + (rng() - 0.5) * 0.35;
      const L = (1.35 * (1 - Math.pow(f, 1.1)) + 0.22) * range(rng, 0.9, 1.1);
      const dir = [Math.cos(az), 0, Math.sin(az)];
      const rise = range(rng, 0.08, 0.18);
      const droop = (0.5 - 0.25 * f) * range(rng, 0.8, 1.2);
      const at = (t) => [dir[0] * L * t, y + (rise * t - droop * t * t) * L, dir[2] * L * t];
      const pts = [], rads = [];
      for (let i = 0; i <= o.branchSegs; i++) { const t = i / o.branchSegs; pts.push(at(t)); rads.push(0.019 * (1 - t) + 0.005); }
      B.tube(pts, rads, o.woodSides, 0, (t) => [0, 0.3 + 0.6 * t, 0.5, 0]);

      const nodes = Math.max(3, Math.round((5 + 4 * (1 - 0.5 * f)) * o.nodeK));
      for (let j = 0; j < nodes; j++) {
        const t = 0.14 + 0.86 * (j / (nodes - 1));
        const p = at(t);
        const tan = norm([dir[0] * L, (rise - 2 * droop * t) * L, dir[2] * L]);
        const ao = (0.5 + 0.5 * Math.pow(f, 0.7)) * (0.72 + 0.28 * t);
        const tb = clamp(t * (0.55 + 0.45 * f));
        for (const side of [-1, 1]) {
          const ld = rotY(tan, side * range(rng, 0.9, 1.25));
          ld[1] += range(rng, 0.0, 0.28);
          const len = range(rng, 0.3, 0.38) * (1 - 0.15 * f) * o.leafScale;
          addLeaf(B, p, ld, len, len * 0.46, rng(), ao, tb, { ...leafOpt, curl: range(rng, -0.28, -0.1) });
        }
        if (o.berries && rng() < fruitiness * (0.4 + 0.6 * (1 - f))) {
          const ripe0 = rng();
          const nb = 3 + Math.floor(rng() * 3);
          for (let b = 0; b < nb; b++) {
            const r = range(rng, 0.032, 0.044);
            B.ball(p[0] + range(rng, -0.04, 0.04), p[1] - range(rng, 0.02, 0.07), p[2] + range(rng, -0.04, 0.04), r, 2,
              [rng(), tb, ao, clamp(ripe0 + range(rng, -0.12, 0.12))], 1, 1.15, 1);
          }
        }
      }
      const pe = at(1);
      const te = norm([dir[0] * L, (rise - 2 * droop) * L, dir[2] * L]);
      for (const side of [-1, 1]) {
        const ld = rotY(te, side * 0.5); ld[1] += 0.1;
        addLeaf(B, pe, ld, 0.3 * o.leafScale, 0.14 * o.leafScale, rng(), 0.8, 1, { ...leafOpt, curl: -0.15 });
      }
    }
  }
  for (let i = 0; i < 6; i++) {
    const az = (i / 6) * Math.PI * 2 + rng() * 0.4;
    addLeaf(B, [0, H - 0.02, 0], [Math.cos(az) * 0.55, 0.75, Math.sin(az) * 0.55], range(rng, 0.25, 0.32) * o.leafScale, 0.12 * o.leafScale, rng(), 0.95, 0.95, { ...leafOpt, curl: -0.12 });
  }
  return B.build();
}

// ------------------------------------------------------------------ maize
export function buildMaize(seed, q = 1) {
  const rng = mulberry32(seed);
  const B = new MeshBuilder();
  const H = range(rng, 1.9, 2.3);
  const lean = [range(rng, -0.05, 0.05), range(rng, -0.05, 0.05)];
  const stalkPts = [];
  for (let i = 0; i <= 5; i++) { const t = i / 5; stalkPts.push([lean[0] * t * t, H * t, lean[1] * t * t]); }
  B.tube(stalkPts, [0.034, 0.03, 0.026, 0.021, 0.016, 0.01], 5, 0, (t) => [0, t * 0.15, 0.6, 0]);

  const n = Math.max(6, Math.round(11 * q));
  const rowsN = q < 0.8 ? 3 : 8;
  for (let i = 0; i < n; i++) {
    const f = i / (n - 1);
    const y0 = 0.18 + H * 0.78 * Math.pow(f, 0.92);
    const az = i * Math.PI + (rng() - 0.5) * 0.6;
    const len = (0.7 + 0.55 * Math.sin(Math.PI * (0.15 + 0.75 * f))) * range(rng, 0.92, 1.1);
    const hwMax = 0.058 * (0.8 + 0.4 * Math.sin(Math.PI * (0.2 + 0.7 * f)));
    const dir = [Math.cos(az), Math.sin(az)];
    const lift = 0.55 - 0.18 * f, drp = 0.7 - 0.2 * f;
    const sx = lean[0] * f * f, sz = lean[1] * f * f;
    const curve = (t) => [sx + dir[0] * len * 0.8 * t, y0 + len * (lift * t - drp * t * t), sz + dir[1] * len * 0.8 * t];
    const hw = (t) => hwMax * (0.3 + 0.7 * Math.sin(Math.PI * (0.08 + 0.85 * t))) * (1 - 0.92 * Math.pow(Math.max(0, (t - 0.82) / 0.18), 1.5));
    addRibbon(B, curve, hw, rowsN, rng(), 0.55 + 0.45 * f, 0.15 + 0.2 * f, 0.95, 0.2, 0.025);
  }
  // tassel
  for (let i = 0; i < 6; i++) {
    const az = (i / 6) * Math.PI * 2 + rng();
    const p0 = stalkPts[5];
    B.tube([[p0[0], p0[1], p0[2]], [p0[0] + Math.cos(az) * 0.1, p0[1] + 0.18, p0[2] + Math.sin(az) * 0.1], [p0[0] + Math.cos(az) * 0.22, p0[1] + 0.26, p0[2] + Math.sin(az) * 0.22]],
      [0.008, 0.006, 0.003], 3, 3, () => [rng(), 1, 0.95, 0]);
  }
  // ear
  const ey = H * 0.55;
  B.ball(0.07, ey, 0.03, 0.045, 2, [rng(), 0.1, 0.8, 0.5], 1, 3.0, 1);
  return B.build();
}

// ------------------------------------------------------------------ beans
export function buildBean(seed, q = 1) {
  const rng = mulberry32(seed);
  const B = new MeshBuilder();
  const stems = q < 0.8 ? 3 : 4;
  for (let s = 0; s < stems; s++) {
    const az = (s / stems) * Math.PI * 2 + rng() * 0.6;
    const L = range(rng, 0.28, 0.42);
    const dir = [Math.cos(az), Math.sin(az)];
    const at = (t) => [dir[0] * L * 0.55 * t, 0.04 + L * (0.9 * t - 0.25 * t * t), dir[1] * L * 0.55 * t];
    const pts = [at(0), at(0.4), at(0.75), at(1)];
    B.tube(pts, [0.011, 0.009, 0.007, 0.005], 3, 0, (t) => [0, t, 0.6, 0]);
    const nodesB = q < 0.8 ? 2 : 3;
    for (let j = 0; j < nodesB; j++) {
      const t = 0.5 + 0.3 * j;
      const p = at(t);
      const base = norm([dir[0], 0.35, dir[1]]);
      for (let k = -1; k <= 1; k++) {
        const ld = rotY(base, k * 0.75 + range(rng, -0.15, 0.15)); ld[1] += 0.22;
        const len = range(rng, 0.12, 0.17);
        addLeaf(B, p, ld, len, len * 0.95, rng(), 0.6 + 0.4 * t, clamp(t), { rows: 2, cols: 2, broad: true, curl: -0.25, foldAmt: 0.3 });
      }
    }
  }
  return B.build();
}

// ------------------------------------------------------------------ banana
export function buildBanana(seed) {
  const rng = mulberry32(seed);
  const B = new MeshBuilder();
  const H = range(rng, 2.5, 3.1);
  const pts = [], rads = [];
  for (let i = 0; i <= 4; i++) { const t = i / 4; pts.push([0, H * t, 0]); rads.push(0.17 - 0.07 * t); }
  B.tube(pts, rads, 7, 0, () => [0, 0.05, 0.6, 0]);
  const n = 8;
  for (let i = 0; i < n; i++) {
    const az = (i / n) * Math.PI * 2 + rng() * 0.5;
    const len = range(rng, 2.0, 2.7);
    const dir = [Math.cos(az), Math.sin(az)];
    const lift = range(rng, 0.45, 0.9);
    const curve = (t) => [dir[0] * len * 0.7 * t, H - 0.1 + len * (lift * t - 0.85 * t * t), dir[1] * len * 0.7 * t];
    const hw = (t) => 0.34 * Math.pow(Math.sin(Math.PI * (0.04 + 0.9 * t)), 0.6) * (1 - 0.5 * t * t);
    addRibbon(B, curve, hw, 10, rng(), 0.75, 0.2, 1, 0.12, 0.03);
  }
  const bx = 0.18, by = H - 0.5;
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 4;
    const r = 0.05;
    B.ball(bx + Math.cos(a) * 0.1, by - Math.floor(i / 6) * 0.1 - 0.05, Math.sin(a) * 0.1, r, 2, [rng(), 0.1, 0.8, 0.3 + rng() * 0.2], 1, 1.7, 1);
  }
  return B.build();
}
