import * as THREE from 'three';

const EDGE = 10; // px a label keeps clear of the edge of the stage

// HTML labels pinned to 3D points. Crisp text, thin leader line, one style.
// A scene registers tags once, then shows the ones it wants per beat.
//
// Labels place themselves. A label is given a side, but each frame it tries all four sides and a few leader
// lengths, and takes the place that stays inside the stage (the part of the screen the text panel leaves
// free) and clear of the other labels and their dots. Along the edge of the stage it slides, and the leader
// line still touches it. It keeps its place unless another is clearly better, so labels do not flicker.
export class Tags {
  constructor(container, camera) {
    this.root = container;
    this.camera = camera;
    this.items = new Map();
    this._v = new THREE.Vector3();
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.bounds = { x: 0, y: 0, w: this.w, h: this.h };
    this.k = 1;
    this.resize(this.w, this.h);
    // label sizes change once the web font arrives, so measure again then
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { for (const it of this.items.values()) it.tw = 0; });
  }

  // labels grow with the window (see .tag in the stylesheet), and so do their leader lines
  resize(w, h) { this.w = w; this.h = h; this.k = Math.min(15, Math.max(10.5, w * 0.008)) / 10.5; if (w < 861) this.k = 1; for (const it of this.items.values()) it.tw = 0; }
  setBounds(r) { this.bounds = { x: r.x, y: r.y, w: r.w, h: r.h }; }

  // spec: { id, text, sub, anchor: Vector3 | () => Vector3, side: 'r'|'l'|'u'|'d', len, color, big, dark }
  add(spec) {
    if (this.items.has(spec.id)) this.remove(spec.id);
    const side = spec.side || 'r';
    const el = document.createElement('div');
    el.className = `tag tag--${side}${spec.big ? ' tag--big' : ''}${spec.dark ? ' tag--dark' : ''}`;
    if (spec.color) el.style.setProperty('--c', spec.color);
    el.style.setProperty('--len', `${spec.len ?? 26}px`);
    el.innerHTML = `<i class="tag__dot"></i><span class="tag__body"><i class="tag__line"></i><span class="tag__text">${spec.text}${spec.sub ? `<small>${spec.sub}</small>` : ''}</span></span>`;
    this.root.appendChild(el);
    const item = { spec, el, text: el.querySelector('.tag__text'), side, tw: 0, th: 0, dx: 0, dy: 0, on: false, x: 0, y: 0, shown: false };
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
    it.tw = 0;
  }

  // where the text box would sit for a side, from the anchor at (x, y)
  _box(side, x, y, tw, th, len) {
    const d = 5 * this.k;                                  // the radius of the dot
    switch (side) {
      case 'l': return { l: x - d - len - tw, r: x - d - len, t: y - th / 2, b: y + th / 2 };
      case 'u': return { l: x - tw / 2, r: x + tw / 2, t: y - d - len - th, b: y - d - len };
      case 'd': return { l: x - tw / 2, r: x + tw / 2, t: y + d + len, b: y + d + len + th };
      default: return { l: x + d + len, r: x + d + len + tw, t: y - th / 2, b: y + th / 2 };
    }
  }

  // the part of a box that lies outside the stage
  _outside(box) {
    const B = this.bounds;
    return Math.max(0, B.x + EDGE - box.l) + Math.max(0, box.r - (B.x + B.w - EDGE)) + Math.max(0, B.y + EDGE - box.t) + Math.max(0, box.b - (B.y + B.h - EDGE));
  }

  _setSide(it, side) {
    if (it.side === side) return;
    it.el.classList.remove(`tag--${it.side}`);
    it.el.classList.add(`tag--${side}`);
    it.side = side;
  }

  update() {
    const cam = this.camera;
    const B = this.bounds;
    const live = [];
    for (const it of this.items.values()) {
      if (!it.on) continue;
      const a = typeof it.spec.anchor === 'function' ? it.spec.anchor() : it.spec.anchor;
      this._v.copy(a).project(cam);
      const x = (this._v.x * 0.5 + 0.5) * this.w;
      const y = (-this._v.y * 0.5 + 0.5) * this.h;
      const inView = this._v.z < 1 && this._v.z > -1 && x > B.x - 30 && x < B.x + B.w + 30 && y > B.y - 30 && y < B.y + B.h + 30;
      if (!inView) {
        if (it.shown) { it.shown = false; it.el.style.visibility = 'hidden'; }
        continue;
      }
      if (!it.tw) { it.tw = it.text.offsetWidth; it.th = it.text.offsetHeight; }
      live.push({ it, x, y });
    }
    // the dots are obstacles too, and the big labels choose first
    const dr = 9 * this.k;
    const dots = live.map(({ x, y }) => ({ l: x - dr, r: x + dr, t: y - dr, b: y + dr }));
    const order = live.map((L, i) => i).sort((p, q) => (live[q].it.spec.big ? 1 : 0) - (live[p].it.spec.big ? 1 : 0));
    const placed = [];
    for (const idx of order) {
      const { it, x, y } = live[idx];
      const want = it.spec.side || 'r', len0 = (it.spec.len ?? 26) * this.k;
      const sides = [want, OPP[want], ...PERP[want]];
      let best = null;
      for (let si = 0; si < sides.length; si++) for (let li = 0; li < 3; li++) {
        const side = sides[si], len = li === 0 ? len0 : Math.max(10, len0 * 0.5) + li * 24;
        const box = this._box(side, x, y, it.tw, it.th, len);
        // along the edge of the stage the box slides
        let dx = 0, dy = 0;
        if (side === 'u' || side === 'd') {
          const lim = it.tw / 2 - 14;
          dx = Math.max(-lim, Math.min(lim, Math.min(Math.max(box.l, B.x + EDGE), B.x + B.w - EDGE - it.tw) - box.l));
        } else {
          const lim = it.th / 2 - 7;
          dy = Math.max(-lim, Math.min(lim, Math.min(Math.max(box.t, B.y + EDGE), B.y + B.h - EDGE - it.th) - box.t));
        }
        const fb = { l: box.l + dx, r: box.r + dx, t: box.t + dy, b: box.b + dy };
        let cost = this._outside(fb) * 4 + si * 2.5 + li * 1.2;
        for (const p of placed) cost += overlap(fb, p) / 30;
        for (let d = 0; d < dots.length; d++) if (d !== idx) cost += overlap(fb, dots[d]) / 8;
        if (it.side === side && it.lenNow === len) cost -= 2;            // keep the place it has unless another is clearly better
        if (!best || cost < best.cost) best = { cost, side, len, dx, dy, fb };
      }
      this._setSide(it, best.side);
      if (it.lenNow !== best.len) { it.lenNow = best.len; it.el.style.setProperty('--len', `${best.len}px`); }
      if (Math.abs(best.dx - it.dx) > 0.5 || Math.abs(best.dy - it.dy) > 0.5) {
        it.dx = best.dx; it.dy = best.dy;
        it.text.style.transform = best.dx || best.dy ? `translate(${best.dx.toFixed(1)}px, ${best.dy.toFixed(1)}px)` : '';
      }
      placed.push(best.fb);
      it.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      if (!it.shown) { it.shown = true; it.el.style.visibility = 'visible'; }
    }
  }
}

const OPP = { r: 'l', l: 'r', u: 'd', d: 'u' };
const PERP = { r: ['u', 'd'], l: ['u', 'd'], u: ['r', 'l'], d: ['r', 'l'] };
const overlap = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
