import { BEATS } from '../content.js';

// Every step has a text panel and a stage. The panel says it, the stage shows it, and they never overlap.
//   overlay  a small floating card over a full-screen picture (the farm, the photo wipe)
//   dock     a caption strip along the bottom, the stage above it
//   side     a column on the left, the stage on its right
// The stage is measured from the real panel, so it follows the text, the fonts and the window size.
// The scenes frame what they show into this rectangle, and the labels stay inside it.

const SIDE_GAP = 22;      // space between a side column and its stage
const DOCK_GAP = 14;      // space between a stage and the strip under it

export class Layout {
  constructor(app) {
    this.app = app;
    this.rect = { mode: 'overlay', x: 0, y: 0, w: window.innerWidth, h: window.innerHeight };
  }

  get aspect() { return this.rect.w / Math.max(1, this.rect.h); }

  _px(name, fallback) {
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(v) ? v : fallback;
  }

  // the free rectangle for step i, in CSS pixels
  measure(i) {
    const W = window.innerWidth, H = window.innerHeight;
    const mode = BEATS[i].layout || 'overlay';
    const panel = this.app.panels.els[i];
    if (mode === 'overlay' || !panel) return { mode: 'overlay', x: 0, y: 0, w: W, h: H };
    const top = this._px('--top', 68);
    const L = panel.offsetLeft, T = panel.offsetTop, w = panel.offsetWidth;
    const edge = parseFloat(getComputedStyle(document.querySelector('.hud--top')).paddingLeft) || 20;   // the margin of the top bar is the margin of the stage
    if (W < 861) return { mode, x: 0, y: top, w: W, h: Math.max(120, T - top - 8) };     // on a phone every card sits at the bottom
    if (mode === 'dock') return { mode, x: edge, y: top, w: W - 2 * edge, h: Math.max(160, T - top - DOCK_GAP) };
    const x = L + w + SIDE_GAP;
    return { mode, x, y: top, w: Math.max(240, W - x - edge), h: Math.max(240, H - top - edge) };
  }

  // measure, publish to CSS and to the labels. The camera is told by the app, because it may or may not glide.
  // A scene may draw into only part of the stage, such as the viewfinder of the leaf lab. It says so with
  // layoutFor(id, stage), which returns that part. The camera, the labels and the shot are then fitted to it.
  apply(i) {
    const r = this.measure(i);
    const scene = this.app.scenes && this.app.scenes[BEATS[i].scene];
    const v = (scene && scene.layoutFor && scene.layoutFor(BEATS[i].id, r)) || r;
    this.rect = v;
    const s = document.documentElement.style;
    s.setProperty('--stage-x', `${r.x}px`);
    s.setProperty('--stage-y', `${r.y}px`);
    s.setProperty('--stage-w', `${r.w}px`);
    s.setProperty('--stage-h', `${r.h}px`);
    s.setProperty('--view-x', `${v.x}px`);
    s.setProperty('--view-y', `${v.y}px`);
    s.setProperty('--view-w', `${v.w}px`);
    s.setProperty('--view-h', `${v.h}px`);
    document.body.dataset.layout = r.mode;
    this.app.tags.setBounds(v);
    // a card that has to scroll (a small window) must be reachable with the keyboard
    const card = this.app.panels.els[i] && this.app.panels.els[i].querySelector('.panel__card');
    if (card) { if (card.scrollHeight > card.clientHeight + 1) card.setAttribute('tabindex', '0'); else card.removeAttribute('tabindex'); }
    return v;
  }
}
