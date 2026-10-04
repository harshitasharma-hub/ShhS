import { U } from './env.js';
import { clamp, damp } from './math.js';

// The seam: the one device the whole page is built around.
// Left of it you see the scene as a camera would. Right of it you see the same
// scene as the model sees it: flat class colors. The shader reads uSeam; the
// DOM layers read --seam-x. Both come from this one number.
export class Seam {
  constructor(el) {
    this.el = el;
    this.value = 1;      // start fully "photo", the intro sweep reveals the labels
    this.target = 1;
    this.mode = 'free';  // 'free' | 'follow'
    this.dragging = false;
    this.pointerX = 0.5;
    this.visible = true;
    this.onChange = null;
    this._bind();
    this._write();
  }

  _bind() {
    const el = this.el;
    const move = (e) => {
      const x = clamp(e.clientX / window.innerWidth, 0.02, 0.98);
      this.value = this.target = x;
      this.mode = 'free';
      this._write();
    };
    el.addEventListener('pointerdown', (e) => {
      this.dragging = true;
      el.classList.add('is-drag');
      el.setPointerCapture(e.pointerId);
      move(e);
    });
    el.addEventListener('pointermove', (e) => { if (this.dragging) move(e); });
    const up = (e) => {
      this.dragging = false;
      el.classList.remove('is-drag');
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { this.nudge(-0.03); e.preventDefault(); e.stopPropagation(); }
      if (e.key === 'ArrowRight') { this.nudge(0.03); e.preventDefault(); e.stopPropagation(); }
    });
    window.addEventListener('pointermove', (e) => { this.pointerX = e.clientX / window.innerWidth; }, { passive: true });
  }

  nudge(d) { this.mode = 'free'; this.target = clamp(this.target + d, 0.02, 0.98); }

  // Move to a place. mode 'follow' means "track the pointer" (used on the title screen).
  go(v, { mode = 'free', instant = false } = {}) {
    this.mode = mode;
    if (mode === 'free') this.target = v;
    if (instant) { this.value = this.target = v; this._write(); }
  }

  // Flip the whole view between photo and labels.
  flip() {
    this.mode = 'free';
    this.target = this.value > 0.5 ? 0.0 : 1.0;
  }

  show(on) {
    this.visible = on;
    document.body.dataset.seam = on ? 'on' : 'off';
  }

  update(dt) {
    if (!this.dragging) {
      if (this.mode === 'follow') {
        const want = clamp(0.5 + (this.pointerX - 0.5) * 0.85, 0.14, 0.86);
        this.target = want;
        this.value = damp(this.value, this.target, 3.2, dt);
      } else {
        this.value = damp(this.value, this.target, 4.0, dt);
        if (Math.abs(this.value - this.target) < 0.0004) this.value = this.target;
      }
    }
    this._write();
  }

  _write(force = false) {
    U.uSeam.value = this.value;
    const w = window.innerWidth;
    const px = clamp(this.value * w, 0, w);
    const key = `${px.toFixed(1)}|${w}`;
    if (!force && key === this._last) return;
    this._last = key;
    document.documentElement.style.setProperty('--seam-x', `${px.toFixed(1)}px`);
    // keep the handle on screen even when the label world has taken the whole frame
    const handleX = clamp(px, 28, w - 28);
    this.el.style.left = `${handleX.toFixed(1)}px`;
    this.el.setAttribute('aria-valuenow', String(Math.round(this.value * 100)));
  }
}
