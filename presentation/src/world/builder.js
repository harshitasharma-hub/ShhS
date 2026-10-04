import * as THREE from 'three';

// Merges many small primitives (tubes, leaves, berries) into one BufferGeometry.
// Per-vertex attributes:
//   position, normal, uv  - uv is leaf-local: u along the blade 0..1, v across -1..1
//   aData  (vec4)         - x per-leaf random, y tip factor (sway), z ambient occlusion, w misc (ripeness)
//   aPart  (float)        - 0 wood, 1 leaf, 2 fruit, 3 tassel/flower
export class MeshBuilder {
  constructor() {
    this.pos = []; this.uv = []; this.data = []; this.part = []; this.col = []; this.idx = [];
    this.n = 0;
  }

  vert(x, y, z, u = 0, v = 0, d = [0, 0, 1, 0], part = 0, col = null) {
    this.pos.push(x, y, z);
    this.uv.push(u, v);
    this.data.push(d[0], d[1], d[2], d[3]);
    this.part.push(part);
    if (col) this.col.push(col[0], col[1], col[2]); else this.col.push(1, 1, 1);
    return this.n++;
  }

  tri(a, b, c) { this.idx.push(a, b, c); }
  quad(a, b, c, d) { this.idx.push(a, b, c, a, c, d); }

  // A tube along a polyline. radii[i] per point. Open ended.
  tube(points, radii, sides, part, dataFn) {
    const rings = [];
    const up = new THREE.Vector3(0, 1, 0);
    const t = new THREE.Vector3(), s = new THREE.Vector3(), b = new THREE.Vector3();
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const a = points[Math.max(0, i - 1)], c = points[Math.min(points.length - 1, i + 1)];
      t.set(c[0] - a[0], c[1] - a[1], c[2] - a[2]).normalize();
      s.crossVectors(Math.abs(t.y) > 0.95 ? new THREE.Vector3(1, 0, 0) : up, t).normalize();
      b.crossVectors(t, s).normalize();
      const ring = [];
      for (let k = 0; k < sides; k++) {
        const ang = (k / sides) * Math.PI * 2;
        const ox = Math.cos(ang) * radii[i], oy = Math.sin(ang) * radii[i];
        ring.push(this.vert(
          p[0] + s.x * ox + b.x * oy, p[1] + s.y * ox + b.y * oy, p[2] + s.z * ox + b.z * oy,
          0, 0, dataFn ? dataFn(i / (points.length - 1)) : [0, 0, 1, 0], part, null,
        ));
      }
      rings.push(ring);
    }
    for (let i = 0; i < rings.length - 1; i++) {
      for (let k = 0; k < sides; k++) {
        const k2 = (k + 1) % sides;
        this.quad(rings[i][k], rings[i][k2], rings[i + 1][k2], rings[i + 1][k]);
      }
    }
  }

  // Blade-shaped surface. rows x cols grid. fn(u, v) returns [x,y,z] and the per-vertex data.
  grid(rows, cols, fn, part) {
    const ids = [];
    for (let r = 0; r <= rows; r++) {
      const u = r / rows;
      const line = [];
      for (let c = 0; c <= cols; c++) {
        const v = -1 + (2 * c) / cols;
        const o = fn(u, v);
        line.push(this.vert(o.p[0], o.p[1], o.p[2], u, v, o.d, part, o.col || null));
      }
      ids.push(line);
    }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // winding so the front face is the blade's upper surface (cross(length, side) = up)
        this.quad(ids[r][c], ids[r + 1][c], ids[r + 1][c + 1], ids[r][c + 1]);
      }
    }
  }

  // Smooth low-poly ball (icosahedron). Normals come from the position.
  ball(cx, cy, cz, r, part, d, sx = 1, sy = 1, sz = 1, col = null) {
    const t = (1 + Math.sqrt(5)) / 2;
    const base = [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
    ].map((v) => { const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l]; });
    const f = [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
    ];
    const ids = base.map((v) => this.vert(cx + v[0] * r * sx, cy + v[1] * r * sy, cz + v[2] * r * sz, 0, 0, d, part, col));
    for (const tri of f) this.tri(ids[tri[0]], ids[tri[1]], ids[tri[2]]);
  }

  build(withColor = false) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setAttribute('aData', new THREE.Float32BufferAttribute(this.data, 4));
    g.setAttribute('aPart', new THREE.Float32BufferAttribute(this.part, 1));
    if (withColor) g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setIndex(this.idx);
    g.computeVertexNormals();
    return g;
  }
}
