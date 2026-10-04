import { BaseScene } from './baseScene.js';
import { IMG } from '../assets/index.js';
import { WORLDS, FIRST_WORLD, REAL_PHOTO, LABELED, REFUSE, REFUSE_TOTAL, WORLD_NOTE, FX_NOTE } from '../showcase.js';

// The two steps that show real pictures instead of a 3D scene.
//   worlds: a real BRACOL photo on the left of the seam, the same leaf rendered in Blender on the right.
//   labels: a grid of renders, each with the label it inherited from its source leaf.
// The WebGL canvas stays empty on both. The pictures live in #reveal and #gallery (see index.html).

const el = (tag, cls) => { const n = document.createElement(tag); if (cls) n.className = cls; return n; };

export class ShowcaseScene extends BaseScene {
  constructor(app) {
    super(app);
    this.world = FIRST_WORLD;
    this.fx = false;
    this.front = 0;
    this.tab = 'labeled';
    const still = { pos: [0, 4, 46], target: [0, 2, 0], fov: 34, parallax: 0 };
    this.poses = { worlds: still, labels: still };
  }

  build() {
    this._buildReveal();
    this._buildGallery();
    this.built = true;
  }

  // ------------------------------------------------------------- real photo against render
  _buildReveal() {
    const host = document.getElementById('reveal');
    host.textContent = '';
    const left = el('div', 'reveal__side reveal__side--l');
    const real = el('img', 'reveal__img');
    real.src = IMG[REAL_PHOTO]; real.alt = 'A real BRACOL photo of a leaf with rust, on a plain background.';
    real.width = 1536; real.height = 768; real.decoding = 'async';
    left.append(real);
    const right = el('div', 'reveal__side reveal__side--r');
    this.slots = [el('img', 'reveal__img is-on'), el('img', 'reveal__img')];
    this.slots.forEach((s) => { s.alt = ''; s.width = 1024; s.height = 512; s.decoding = 'async'; right.append(s); });
    this.slots[0].src = this._src();
    this.slots[0].alt = this._alt();
    host.append(left, right, el('div', 'reveal__shade'));
  }

  _src() {
    const w = WORLDS.find((x) => x.key === this.world) || WORLDS[0];
    return IMG[this.fx ? w.phone : w.clean];
  }

  _alt() {
    const w = WORLDS.find((x) => x.key === this.world) || WORLDS[0];
    return `The same leaf rendered in Blender. Scene: ${w.name.toLowerCase()}${this.fx ? ', with phone effects' : ''}.`;
  }

  // Fade to the new picture on the hidden slot, then swap which slot is showing.
  _swap() {
    const back = this.slots[1 - this.front];
    const front = this.slots[this.front];
    const src = this._src();
    if (front.src === src) return;
    const show = () => { back.classList.add('is-on'); front.classList.remove('is-on'); front.alt = ''; this.front = 1 - this.front; };
    back.src = src;
    back.alt = this._alt();
    if (back.decode) back.decode().then(show, show); else show();
  }

  _chips() {
    document.querySelectorAll('[data-ctl="world"]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.world === this.world)));
    document.querySelectorAll('[data-ctl="fx"]').forEach((b) => b.setAttribute('aria-pressed', String(this.fx)));
  }

  // ------------------------------------------------------------- the labeled gallery
  _buildGallery() {
    const host = document.getElementById('gallery');
    host.textContent = '';
    const grid = (items, name, head) => {
      const g = el('div', `gallery__set gallery__set--${name}`);
      g.dataset.set = name;
      // every synthetic picture is marked as synthetic, as the brief asks
      const h = el('div', 'gallery__head');
      h.innerHTML = `<span class="chip chip--sim">Synthetic</span><span>${head}</span>`;
      g.append(h);
      items.forEach((t, i) => {
        const f = el('figure', `tile tile--${t.cls}`);
        f.style.setProperty('--i', i);
        const img = el('img');
        img.src = IMG[t.img]; img.alt = t.alt;
        img.width = 1024; img.height = 512; img.decoding = 'async';
        const cap = el('figcaption');
        cap.innerHTML = `<i class="tile__dot" aria-hidden="true"></i><b>${t.label}</b><span>${t.scene}${t.leaf ? ` · leaf ${t.leaf}` : ''}</span>`;
        f.append(img, cap);
        g.append(f);
      });
      host.append(g);
      return g;
    };
    const nb = (t) => `<span class="nobr" translate="no">${t}</span>`; // names stay whole in a translated page
    this.sets = {
      labeled: grid(LABELED, 'labeled', `${LABELED.length} ${nb('Blender')} renders from ${LABELED.length} different ${nb('BRACOL')} leaves`),
      refuse: grid(REFUSE, 'refuse', `${REFUSE.length} of ${REFUSE_TOTAL} ${nb('Blender')} renders made to be unusable`),
    };
    this._showTab('labeled', false);
  }

  _showTab(name, announce = true) {
    this.tab = name;
    Object.entries(this.sets).forEach(([k, g]) => { g.hidden = k !== name; g.classList.remove('is-in'); });
    document.querySelectorAll('[data-ctl="tab"]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tab === name)));
    // two frames, so the tiles start hidden and then slide in
    requestAnimationFrame(() => requestAnimationFrame(() => this.sets[name].classList.add('is-in')));
    if (announce) {
      this.app.panels.out('note', name === 'refuse'
        ? 'These are made on purpose, to test that the model answers "not sure" and does not guess. We have not scored them yet.'
        : 'Only train-split leaves are used. No validation or test leaf feeds a render.');
    }
  }

  // ------------------------------------------------------------- lifecycle
  enter(id) {
    const tags = this.app.tags;
    tags.only([]);
    if (id === 'worlds') {
      this.world = FIRST_WORLD; this.fx = false;
      this.slots.forEach((s, i) => { s.classList.toggle('is-on', i === 0); s.alt = ''; });
      this.front = 0;
      this.slots[0].src = this._src();
      this.slots[0].alt = this._alt();
      this._chips();
      this.app.panels.out('note', WORLD_NOTE);
    } else if (id === 'labels') {
      this._showTab('labeled', false);
    }
  }

  control(name, el2) {
    if (name === 'world') { this.world = el2.dataset.world; this._swap(); this._chips(); }
    else if (name === 'fx') {
      this.fx = !this.fx; this._swap(); this._chips();
      this.app.panels.out('note', this.fx ? FX_NOTE : WORLD_NOTE);
    }
    else if (name === 'tab') this._showTab(el2.dataset.tab);
  }
}
