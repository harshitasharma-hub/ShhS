import * as THREE from 'three';

// HTML labels pinned to 3D points. Crisp text, thin leader line, one style.
// A scene registers tags once, then shows the ones it wants per beat.
export class Tags {
  constructor(container, camera) {
    this.root = container;
    this.camera = camera;
    this.items = new Map();
    this._v = new THREE.Vector3();
    this.w = window.innerWidth;
    this.h = window.innerHeight;
  }

  resize(w, h) { this.w = w; this.h = h; }

  // spec: { id, text, sub, anchor: Vector3 | () => Vector3, side: 'r'|'l', len, color, big, dark }
  add(spec) {
    if (this.items.has(spec.id)) this.remove(spec.id);
    const el = document.createElement('div');
    el.className = `tag tag--${spec.side || 'r'}${spec.big ? ' tag--big' : ''}${spec.dark ? ' tag--dark' : ''}`;
    if (spec.color) el.style.setProperty('--c', spec.color);
    el.style.setProperty('--len', `${spec.len ?? 26}px`);
    el.innerHTML = `<i class="tag__dot"></i><span class="tag__body"><i class="tag__line"></i><span class="tag__text">${spec.text}${spec.sub ? `<small>${spec.sub}</small>` : ''}</span></span>`;
    this.root.appendChild(el);
    const item = { spec, el, on: false, x: 0, y: 0, shown: false };
    this.items.set(spec.id, item);
    return item;
  }

  remove(id) {
    const it = this.items.get(id);
    if (it) { it.el.remove(); this.items.delete(id); }
  }

  // Show exactly these ids, hide the rest.
  only(ids) {
    const set = new Set(ids);
    for (const [id, it] of this.items) {
      it.on = set.has(id);
      it.el.classList.toggle('is-on', it.on);
    }
  }

  clear() { this.only([]); }

  setText(id, text, sub) {
    const it = this.items.get(id);
    if (!it) return;
    const t = it.el.querySelector('.tag__text');
    t.innerHTML = `${text}${sub ? `<small>${sub}</small>` : ''}`;
  }

  update() {
    const cam = this.camera;
    for (const it of this.items.values()) {
      if (!it.on) continue;
      const a = typeof it.spec.anchor === 'function' ? it.spec.anchor() : it.spec.anchor;
      this._v.copy(a).project(cam);
      const inView = this._v.z < 1 && this._v.z > -1 && Math.abs(this._v.x) < 1.15 && Math.abs(this._v.y) < 1.15;
      const x = (this._v.x * 0.5 + 0.5) * this.w;
      const y = (-this._v.y * 0.5 + 0.5) * this.h;
      if (inView) {
        it.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
        if (!it.shown) { it.shown = true; it.el.style.visibility = 'visible'; }
      } else if (it.shown) {
        it.shown = false; it.el.style.visibility = 'hidden';
      }
    }
  }
}
