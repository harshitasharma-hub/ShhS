import * as THREE from 'three';
import { easeInOut, damp, clamp } from './math.js';

// A camera rig that flies between named poses, with a little pointer parallax
// and a slow idle drift so a still shot never looks frozen.
//
// A pose is framed for the stage, not for the whole screen. The stage is the part of the screen
// the text panel leaves free (see layout.js). The rig renders the pose into the stage by sliding
// the lens sideways and tightening the field of view, so the middle of the pose lands in the middle
// of the stage, and the panel never covers it. With no panel the stage is the whole screen.
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
    this.framed = false;              // a framed pose was fitted to the stage, so it needs no widening on a narrow screen
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._right = new THREE.Vector3();
    this._up = new THREE.Vector3();
    this._fwd = new THREE.Vector3();
    this._tmp = new THREE.Vector3();
    this.flying = false;
    this.vw = window.innerWidth; this.vh = window.innerHeight;
    this.stageTo = { x: 0, y: 0, w: this.vw, h: this.vh };
    this.stage = { ...this.stageTo };
    this._applied = { fov: 0, ox: 1e9, oy: 1e9, vw: 0, vh: 0 };
  }

  setViewport(w, h) {
    const wasFull = this._isFull(this.stageTo);
    this.vw = w; this.vh = h;
    if (wasFull) { this.stageTo = { x: 0, y: 0, w, h }; this.stage = { ...this.stageTo }; }
  }

  // where the pose is drawn, in CSS pixels. With instant false the stage glides, as the camera does.
  setStage(r, instant = false) {
    this.stageTo = { x: r.x, y: r.y, w: r.w, h: r.h };
    if (instant || this.reduced) this.stage = { ...this.stageTo };
  }

  _isFull(s) { return Math.abs(s.x) < 0.5 && Math.abs(s.y) < 0.5 && Math.abs(s.w - this.vw) < 0.5 && Math.abs(s.h - this.vh) < 0.5; }

  jumpTo(p) {
    this.pos.fromArray(p.pos);
    this.target.fromArray(p.target);
    this.fov = p.fov ?? 32;
    this.parallax = p.parallax ?? 1;
    this.drift = p.drift ?? 1;
    this.framed = !!p.framed;
    this.t = 1;
    this.flying = false;
  }

  flyTo(p, dur = 1.8) {
    if (this.reduced) { this.jumpTo(p); return; }
    this.from = { pos: this.pos.clone(), target: this.target.clone(), fov: this.fov };
    this.to = { pos: new THREE.Vector3().fromArray(p.pos), target: new THREE.Vector3().fromArray(p.target), fov: p.fov ?? 32 };
    this.parallax = p.parallax ?? 1;
    this.drift = p.drift ?? 1;
    this.framed = !!p.framed;
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

    // the stage glides toward its target
    const s = this.stage, g = this.stageTo;
    if (s.x !== g.x || s.y !== g.y || s.w !== g.w || s.h !== g.h) {
      const kk = 5.5;
      s.x = damp(s.x, g.x, kk, dt); s.y = damp(s.y, g.y, kk, dt); s.w = damp(s.w, g.w, kk, dt); s.h = damp(s.h, g.h, kk, dt);
      if (Math.abs(s.x - g.x) + Math.abs(s.y - g.y) + Math.abs(s.w - g.w) + Math.abs(s.h - g.h) < 0.4) this.stage = { ...g };
    }
    // The pose's field of view is the stage's. Seen through the whole screen it is wider by the ratio of the heights.
    // Poses that are not framed were drawn for a wide laptop screen, so a taller screen widens the lens to keep their width.
    const aspectK = this.framed ? 1 : clamp(1.6 / cam.aspect, 1, 1.9);
    const half = Math.tan((this.fov * Math.PI) / 360) * aspectK * (this.vh / Math.max(1, this.stage.h));
    const eff = (2 * Math.atan(half) * 180) / Math.PI;
    // slide the lens so the middle of the pose lands in the middle of the stage
    const ox = -(this.stage.x + this.stage.w / 2 - this.vw / 2);
    const oy = -(this.stage.y + this.stage.h / 2 - this.vh / 2);
    const a = this._applied;
    if (Math.abs(a.fov - eff) > 0.001 || Math.abs(a.ox - ox) > 0.05 || Math.abs(a.oy - oy) > 0.05 || a.vw !== this.vw || a.vh !== this.vh) {
      cam.fov = eff;
      if (Math.abs(ox) < 0.05 && Math.abs(oy) < 0.05) cam.clearViewOffset();
      else cam.setViewOffset(this.vw, this.vh, ox, oy, this.vw, this.vh);
      cam.updateProjectionMatrix();
      a.fov = eff; a.ox = ox; a.oy = oy; a.vw = this.vw; a.vh = this.vh;
    }
  }
}
