// Small DOM and math helpers. No framework.
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

export function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'style' && typeof v === 'object') {
      // Custom properties (--x) need setProperty. Object.assign on style silently drops them.
      for (const [sk, sv] of Object.entries(v)) { if (sk.startsWith('--')) e.style.setProperty(sk, sv); else e.style[sk] = sv; }
    } else if (k === 'dataset') Object.assign(e.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else if (v === true) e.setAttribute(k, '');
    else e.setAttribute(k, v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    e.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return e;
}

const NS = 'http://www.w3.org/2000/svg';
export function s(tag, props, ...kids) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.setAttribute('class', v);
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    e.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return e;
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const map = (v, a, b, c, d) => c + ((v - a) / (b - a)) * (d - c);
export const smooth = (t) => t * t * (3 - 2 * t);
export const seg = (p, a, b) => clamp((p - a) / (b - a));           // progress of p inside [a, b]
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
export const sd = (a) => {
  if (a.length < 2) return 0;
  const m = mean(a);
  return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length);
};

export const f3 = (v) => (v == null || Number.isNaN(v) ? 'n/a' : v.toFixed(3));
export const f2 = (v) => (v == null || Number.isNaN(v) ? 'n/a' : v.toFixed(2));
export const pct = (v, d = 1) => (v == null || Number.isNaN(v) ? 'n/a' : (v * 100).toFixed(d) + '%');
export const pct0 = (v) => (v == null || Number.isNaN(v) ? 'n/a' : Math.round(v * 100) + '%');
export const int = (v) => (v == null ? 'n/a' : Number(v).toLocaleString('en-US'));

export function safeStore(key, val) {
  try {
    if (val === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, val);
  } catch (e) { /* private window or blocked storage: the page works without it */ }
  return null;
}

export function icon(name, cls = '') {
  const el = document.createElementNS(NS, 'svg');
  el.setAttribute('aria-hidden', 'true');
  if (cls) el.setAttribute('class', cls);
  const use = document.createElementNS(NS, 'use');
  use.setAttribute('href', '#i-' + name);
  el.append(use);
  return el;
}

/** Fill every [data-bind="a.b.c"] element with a value from a nested object. */
export function bindText(root, values) {
  $$('[data-bind]', root).forEach((el) => {
    const v = el.dataset.bind.split('.').reduce((o, k) => (o == null ? o : o[k]), values);
    if (v != null) el.textContent = typeof v === 'number' ? int(v) : String(v);
  });
}
