import * as THREE from 'three';

// Framing: say what must be in the picture, and the camera is worked out for the stage it has to fit.
//
//   frame = { pts: [[x, y, z], ...], az: 0, el: 24, fov: 34, pad: [0.06, 0.08] }
//
// pts   the points that must stay inside the stage (corners of the things on show, tops of labels)
// az/el the direction the camera looks from, in degrees: az turns around the scene, el lifts it
// fov   the vertical field of view of the stage, in degrees
// pad   how much of the stage to leave empty at the sides and at the top and bottom (0.06 is 6% of half the stage)
//
// The stage is the part of the screen the text panel leaves free. fitFrame returns a pose that fills it.

const UP = new THREE.Vector3(0, 1, 0);

// the 8 corners of a box, from its middle and its size
export function boxPts(cx, cy, cz, sx, sy, sz) {
  const out = [];
  for (const a of [-1, 1]) for (const b of [-1, 1]) for (const c of [-1, 1]) out.push([cx + (a * sx) / 2, cy + (b * sy) / 2, cz + (c * sz) / 2]);
  return out;
}

// something that stands on the ground: the middle of its footprint, the footprint, and its height
export const standing = (x, z, w, d, h) => boxPts(x, h / 2, z, w, h, d);

export function fitFrame(f, aspect) {
  const { pts, az = 0, el = 24, fov = 34, pad = [0.06, 0.08], parallax = 0.35, drift = 0.5 } = f;
  const a = (az * Math.PI) / 180, e = (el * Math.PI) / 180;
  const dir = new THREE.Vector3(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e));   // from the target to the camera
  const fwd = dir.clone().negate();
  const right = new THREE.Vector3().crossVectors(fwd, UP).normalize();
  const up = new THREE.Vector3().crossVectors(right, fwd).normalize();
  const tanV = Math.tan((fov * Math.PI) / 360), tanH = tanV * aspect;
  const P = pts.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
  const T = new THREE.Vector3();
  P.forEach((p) => T.add(p));
  T.divideScalar(P.length);
  const v = new THREE.Vector3(), C = new THREE.Vector3();
  let D = 80;
  for (let k = 0; k < 40; k++) {
    C.copy(T).addScaledVector(dir, D);
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, depthSum = 0;
    for (const p of P) {
      v.subVectors(p, C);
      const depth = Math.max(0.5, v.dot(fwd));
      const x = v.dot(right) / (depth * tanH), y = v.dot(up) / (depth * tanV);
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      depthSum += depth;
    }
    const depth = depthSum / P.length;
    // move the target toward the middle of what the camera sees, then back off or come closer until it fills the stage
    T.addScaledVector(right, ((x0 + x1) / 2) * depth * tanH).addScaledVector(up, ((y0 + y1) / 2) * depth * tanV);
    const need = Math.max((x1 - x0) / 2 / (1 - pad[0]), (y1 - y0) / 2 / (1 - pad[1]));
    D = Math.max(6, D * (0.4 + 0.6 * need));
  }
  C.copy(T).addScaledVector(dir, D);
  return { pos: C.toArray(), target: T.toArray(), fov, parallax, drift, framed: true };
}
