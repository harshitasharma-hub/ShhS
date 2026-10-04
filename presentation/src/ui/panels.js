import { BEATS, SOURCES, SCORECARD } from '../content.js';

// Model and dataset names stay in one piece and are never auto-translated.
// The lookahead skips matches inside a tag, such as an attribute value.
const BRAND = /(Gemma 4 E2B|BRACOL|Blender|LoRA)(?![^<]*>)/g;
const brand = (html) => html.replace(BRAND, '<span class="nobr" translate="no">$1</span>');

// Builds one card per beat, shows the active one, and wires every control inside them.
export class Panels {
  constructor(app) {
    this.app = app;
    this.root = document.getElementById('panels');
    this.els = [];
    this.active = -1;
    BEATS.forEach((b) => {
      const el = document.createElement('section');
      el.className = 'panel';
      el.dataset.side = b.side;
      if (b.wide) el.dataset.wide = '1';
      el.id = `beat-${b.id}`;
      el.innerHTML = `<div class="panel__card">${brand(b.html)}</div>`;
      el.setAttribute('inert', '');
      el.setAttribute('aria-hidden', 'true');
      el.querySelectorAll('.panel__card > *').forEach((c, i) => c.style.setProperty('--i', i));
      this.root.appendChild(el);
      this.els.push(el);
    });
    this._bind();
    this._sheet();
  }

  show(i) {
    if (this.active === i) return;
    const prev = this.els[this.active];
    if (prev) { prev.classList.remove('is-active'); prev.setAttribute('inert', ''); prev.setAttribute('aria-hidden', 'true'); }
    const el = this.els[i];
    el.classList.add('is-active');
    el.removeAttribute('inert');
    el.removeAttribute('aria-hidden');
    this.active = i;
    // tell screen readers where we are, once per step
    const live = document.getElementById('srLive');
    if (live) {
      const t = el.querySelector('.panel__title, .statement');
      live.textContent = `Step ${i + 1} of ${BEATS.length}: ${t ? t.textContent.trim() : 'Introduction'}`;
    }
  }

  _q(sel) { return this.els[this.active] ? this.els[this.active].querySelectorAll(sel) : []; }
  out(name, text) { this._q(`[data-out="${name}"]`).forEach((n) => { if (n.textContent !== text) n.textContent = text; }); }
  setRange(name, v) { this._q(`input[data-ctl="${name}"]`).forEach((n) => { if (document.activeElement !== n) n.value = v; }); }
  busy(on) { this._q('[data-ctl="shutter"], [data-ctl="batch"]').forEach((n) => { n.disabled = on; }); }

  addPair(photo, mask, caption) {
    const strip = this.root.querySelector('#pairStrip');
    if (!strip) return;
    const d = document.createElement('figure');
    d.className = 'pair';
    // the caption says what the pair shows, so the pictures themselves stay out of the reading order
    photo.setAttribute('aria-hidden', 'true'); mask.setAttribute('aria-hidden', 'true');
    const a = document.createElement('div'); a.className = 'pair__img'; a.appendChild(photo);
    const b = document.createElement('div'); b.className = 'pair__img pair__img--mask'; b.appendChild(mask);
    const c = document.createElement('figcaption'); c.textContent = caption;
    d.append(a, b, c);
    strip.prepend(d);
    while (strip.children.length > 12) strip.lastChild.remove();
  }

  _bind() {
    const root = this.root;
    root.addEventListener('click', (e) => {
      const go = e.target.closest('[data-go]');
      if (go) { this.app.action(go.dataset.go); return; }
      const ctl = e.target.closest('button[data-ctl]');
      if (ctl) {
        if (ctl.dataset.ctl === 'mode') { this.app.control('mode', ctl, { mode: ctl.dataset.mode }); return; }
        this.app.control(ctl.dataset.ctl, ctl);
      }
    });
    root.addEventListener('input', (e) => {
      const r = e.target.closest('input[data-ctl]');
      if (r) this.app.control(r.dataset.ctl, r);
    });
  }

  // ---- the sources + scorecard sheet
  _sheet() {
    const s = document.createElement('div');
    s.className = 'sheet';
    s.id = 'sheet';
    s.hidden = true;
    s.setAttribute('role', 'dialog');
    s.setAttribute('aria-label', 'Sources and judging scorecard');
    s.innerHTML = `<div class="sheet__card" data-scroll>
      <button class="sheet__close btn btn--soft" type="button" data-go="closeSheet">Close <kbd>Esc</kbd></button>
      <h2 class="panel__title">Where each judging criterion is answered</h2>
      <table class="score"><thead><tr><th>Criterion</th><th>Weight</th><th>Where in this talk</th></tr></thead><tbody>
        ${SCORECARD.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}
      </tbody></table>
      <h3 class="sheet__h">Sources</h3>
      <ul class="srclist">${SOURCES.map((r) => `<li><b>${r.k}.</b> ${r.t}${r.href ? ` <a href="${r.href}" target="_blank" rel="noopener noreferrer">Open</a>` : ''}</li>`).join('')}</ul>
    </div>`;
    document.body.appendChild(s);
    s.addEventListener('click', (e) => {
      if (e.target === s) this.app.action('closeSheet');
      const go = e.target.closest('[data-go]');
      if (go) this.app.action(go.dataset.go);
    });
    this.sheet = s;
  }

  // While the sheet is open, everything behind it is inert, which also traps the keyboard focus.
  _behind() { return document.querySelectorAll('.stage, .hud, .panels, .rail, .notes, .keys'); }
  openSheet() {
    this._opener = document.activeElement;
    this._behind().forEach((n) => { n.inert = true; });
    this.sheet.hidden = false;
    this.sheet.querySelector('button').focus();
  }
  closeSheet() {
    if (this.sheet.hidden) return;
    this.sheet.hidden = true;
    this._behind().forEach((n) => { n.inert = false; });
    if (this._opener && this._opener.focus) this._opener.focus();
  }
  get sheetOpen() { return !this.sheet.hidden; }
}
