// Page engine: one animation loop, scroll-driven scenes, reveals, section tracking in the top bar, tooltip.
import { $, $$, clamp } from './dom.js';

export const state = { motion: true };

/* ---------- Motion: follows the visitor's system setting ---------- */
export function initMotion() {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const forced = /[?&]reduce\b/.test(location.search);   // ?reduce lets you see the reduced-motion page without changing a system setting
  const apply = () => {
    state.motion = !(mq.matches || forced);
    document.documentElement.dataset.motion = state.motion ? 'on' : 'off';
    document.dispatchEvent(new CustomEvent('motionchange'));
  };
  if (mq.addEventListener) mq.addEventListener('change', apply); else if (mq.addListener) mq.addListener(apply);
  apply();
}

/* ---------- Frame loop ---------- */
const frameFns = new Set();
export const onFrame = (fn) => { frameFns.add(fn); return () => frameFns.delete(fn); };
let last = performance.now();
function loop(t) {
  const dt = Math.min(0.05, (t - last) / 1000);
  last = t;
  frameFns.forEach((fn) => fn(t, dt));
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ---------- Scroll scenes ---------- */
const scenes = [];
let measureQueued = false;

/**
 * Register a scene. `track` is the element whose scroll range drives progress p (0 to 1).
 * For a pinned scene the track is the tall wrapper. For a plain section p is how far it has passed through the viewport.
 */
export function scene(el, { track = el, pinned = false, ease = 0.1, onProgress, onVisible } = {}) {
  const sc = { el, track, pinned, ease, onProgress, onVisible, p: 0, target: 0, visible: false, first: true };
  scenes.push(sc);
  measure();
  return sc;
}

function measureAll() {
  measureQueued = false;
  const vh = window.innerHeight;
  for (const sc of scenes) {
    const r = sc.track.getBoundingClientRect();
    if (sc.pinned) {
      const total = r.height - vh;
      sc.target = total > 0 ? clamp(-r.top / total) : 0;
    } else {
      sc.target = clamp((vh - r.top) / (vh + r.height));
    }
    const vis = r.bottom > -vh * 0.25 && r.top < vh * 1.25;
    if (vis !== sc.visible) {
      sc.visible = vis;
      sc.onVisible && sc.onVisible(vis);
    }
  }
}
function measure() {
  if (!measureQueued) { measureQueued = true; requestAnimationFrame(measureAll); }
}
window.addEventListener('scroll', measure, { passive: true });
window.addEventListener('resize', measure);

onFrame((t, dt) => {
  for (const sc of scenes) {
    if (!sc.visible && !sc.first) continue;
    const k = state.motion ? 1 - Math.exp(-dt * (sc.ease * 60)) : 1;
    const next = sc.p + (sc.target - sc.p) * k;
    const moved = Math.abs(next - sc.p) > 0.00005 || sc.first;
    sc.p = Math.abs(sc.target - next) < 0.0002 ? sc.target : next;
    if (moved && sc.onProgress) sc.onProgress(sc.p, dt);
    sc.first = false;
  }
});

/* ---------- Reveals: a small rise. The content is visible without it. ---------- */
export function initReveals() {
  document.documentElement.classList.add('js');
  const items = $$('[data-reveal], .slope');
  items.forEach((el) => {
    const sibs = Array.from(el.parentElement.children).filter((c) => c.hasAttribute('data-reveal'));
    const i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty('--d', Math.min(i * 0.07, 0.35) + 's');
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  items.forEach((el) => io.observe(el));
}

/* ---------- Top bar: mark the chapter you are in ---------- */
export function initNav() {
  const links = $$('.bar__nav a');
  const targets = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if (!targets.length) return;
  let queued = false;
  const update = () => {
    queued = false;
    const line = window.innerHeight * 0.4;
    let cur = null;
    for (const t of targets) if (t.getBoundingClientRect().top <= line) cur = t;
    links.forEach((a) => {
      if (cur && a.getAttribute('href') === '#' + cur.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  };
  const q = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', q, { passive: true });
  window.addEventListener('resize', q);
  update();
}

/* ---------- Tooltip ---------- */
const tipEl = () => $('#tooltip');
export const tip = {
  show(content, x, y) {
    const el = tipEl();
    el.replaceChildren(...(Array.isArray(content) ? content : [content]).map((c) => (c.nodeType ? c : document.createTextNode(String(c)))));
    el.hidden = false;
    const pad = 14, w = el.offsetWidth, hgt = el.offsetHeight;
    let left = x + pad, top = y + pad;
    if (left + w > innerWidth - 8) left = x - w - pad;
    if (top + hgt > innerHeight - 8) top = y - hgt - pad;
    el.style.left = Math.max(8, left) + 'px';
    el.style.top = Math.max(8, top) + 'px';
  },
  hide() { tipEl().hidden = true; },
};

/* ---------- Global keys ---------- */
export function initKeys() {
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.key === 'p' || e.key === 'P') document.body.classList.toggle('show-pending');
  });
}
