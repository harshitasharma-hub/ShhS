import * as THREE from 'three';
import { easeInOut, damp, clamp } from './math.js';

// A camera rig that flies between named poses, with a little pointer parallax
// and a slow idle drift so a still shot never looks frozen.
export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.pos = new THREE.Vector3(0, 30, 160);
    this.target = new THREE.Vector3(0, 10, 0);
    this.fov = 32;
    this.from = null;
    this.to = null;
    this.t = 1;
    this.dur = 1.6;
    this.arc = 0;
    this.px = 0; this.py = 0;         // smoothed pointer, -1..1
    this.parallax = 1;                // 0 turns it off for diagram shots
    this.drift = 1;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._right = new THREE.Vector3();
    this._up = new THREE.Vector3();
    this._fwd = new THREE.Vector3();
    this._tmp = new THREE.Vector3();
    this.flying = false;
  }

  jumpTo(p) {
    this.pos.fromArray(p.pos);
    this.target.fromArray(p.target);
    this.fov = p.fov ?? 32;
    this.parallax = p.parallax ?? 1;
    this.drift = p.drift ?? 1;
    this.t = 1;
    this.flying = false;
  }

  flyTo(p, dur = 1.8) {
    if (this.reduced) { this.jumpTo(p); return; }
    this.from = { pos: this.pos.clone(), target: this.target.clone(), fov: this.fov };
    this.to = { pos: new THREE.Vector3().fromArray(p.pos), target: new THREE.Vector3().fromArray(p.target), fov: p.fov ?? 32 };
    this.parallax = p.parallax ?? 1;
    this.drift = p.drift ?? 1;
    this.t = 0;
    this.dur = dur;
    this.arc = Math.min(this.from.pos.distanceTo(this.to.pos) * 0.07, 10);
    this.flying = true;
  }

  update(dt, time, pointer) {
    if (this.t < 1) {
      this.t = Math.min(1, this.t + dt / this.dur);
      const e = easeInOut(this.t);
      this.pos.lerpVectors(this.from.pos, this.to.pos, e);
      this.pos.y += Math.sin(Math.PI * e) * this.arc;
      this.target.lerpVectors(this.from.target, this.to.target, e);
      this.fov = this.from.fov + (this.to.fov - this.from.fov) * e;
      if (this.t >= 1) this.flying = false;
    }
    this.px = damp(this.px, pointer.x, 2.4, dt);
    this.py = damp(this.py, pointer.y, 2.4, dt);

    const cam = this.camera;
    cam.position.copy(this.pos);
    cam.lookAt(this.target);
    cam.updateMatrixWorld();
    this._right.setFromMatrixColumn(cam.matrixWorld, 0);
    this._up.setFromMatrixColumn(cam.matrixWorld, 1);
    this._fwd.subVectors(this.target, this.pos);
    const dist = this._fwd.length();
    const k = this.reduced ? 0 : this.parallax;
    const amp = Math.min(dist * 0.035, 6) * k;
    const dr = this.reduced ? 0 : this.drift;
    const driftX = Math.sin(time * 0.17) * 0.012 * dist * dr;
    const driftY = Math.sin(time * 0.13 + 1.3) * 0.006 * dist * dr;
    this._tmp.copy(this._right).multiplyScalar(-this.px * amp + driftX).addScaledVector(this._up, this.py * amp * 0.6 + driftY);
    cam.position.add(this._tmp);
    cam.lookAt(this.target);
    // poses are framed for a wide laptop screen. On tall screens widen the lens so the same width fits.
    const aspectK = clamp(1.6 / cam.aspect, 1, 1.9);
    const eff = (2 * Math.atan(Math.tan((this.fov * Math.PI) / 360) * aspectK) * 180) / Math.PI;
    if (Math.abs(cam.fov - eff) > 0.001) {
      cam.fov = eff;
      cam.updateProjectionMatrix();
    }
  }
}
