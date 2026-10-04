// The pipeline: one real leaf (BRACOL 897) goes through six steps while you scroll.
// Step 3 is a live 3D leaf. It rests in the bent pose we use for the practice photos, and the background you pick changes with it.
// The values on the right are the real values of the real files, not made-up numbers.
import { $, $$, h, seg, lerp, easeOut, int } from '../lib/dom.js';
import { scene, state, onFrame } from '../lib/engine.js';
import { PIPELINE } from '../data/generated.js';
import { DIAL_META, PLATE_FILES } from '../data/inline.js';
import { createLeaf } from './leaf3d.js';

export const ENVS = ['overcast', 'sun', 'golden', 'shade', 'backlit', 'rain', 'sun_wet', 'studio'];
export const ENV_NAMES = { overcast: 'Overcast', sun: 'Sun', golden: 'Golden hour', shade: 'Shade', backlit: 'Backlit', rain: 'Rain', sun_wet: 'Sun after rain', studio: 'Studio' };
// Used only when a background picture is missing: sky, horizon, ground
const FALLBACK = {
  overcast: ['#cfd6d6', '#aab4b0', '#4b5a3d'], sun: ['#9fc6ee', '#dfe9d2', '#5c6f35'], golden: ['#f0b36a', '#f6d9a2', '#5b5a2a'],
  shade: ['#5d7468', '#3f5648', '#27382c'], backlit: ['#fff1c6', '#cfe0a6', '#3d5a2e'], rain: ['#8f9aa0', '#6f7c78', '#36473a'],
  sun_wet: ['#b7d3e6', '#d9e7c6', '#4a6a35'], studio: ['#f2f2ee', '#e4e4de', '#cfcfc8'],
};
const fix = (p) => (p && p.includes('/') ? p : 'img/dial/' + p);
const PHONE_NAMES = { exposure_gain: 'exposure gain', mood_t: 'colour mood', sat: 'saturation', blur_sigma: 'blur', noise: 'sensor noise', jpeg_q: 'JPEG quality', out_size: 'output size', rescale: 'rescale', motion_px: 'motion blur', veil: 'glare veil' };
// The pose we use for the practice photos. The leaf starts in it and the sliders start on it.
export const DEFAULT_BEND = { fold: 0.4, droop: 0.5, twist: 0.25, wave: 0.55, sun: 0.4 };

export function initPipeline() {
  const track = $('#pl-track');
  if (!track) return;
  const stage = $('#pl-stage');
  const frame = $('#pl-frame');
  const original = $('.pl-original');
  const cut = $('#pl-cut');
  const scan = $('#pl-scan');
  const canvas3d = $('#pl-canvas');
  const sceneLayer = $('.pl-scene');
  const resolve = $('#pl-resolve');
  const phone = $('.pl-phone');
  const phoneImg = $('#pl-phone-img');
  const fan = $('#pl-fan');
  const controls = $('#pl-controls');
  const envBox = $('#pl-env');
  const tag = $('#pl-tag');
  const readout = $('#pl-readout');
  const label = $('#pl-label');
  const prog = $('#pl-progress');
  const steps = $$('#pl-steps li');
  const plates = [$('#pl-plate-a'), $('#pl-plate-b')];
  const ctx = resolve.getContext('2d');

  /* ---------- Background (environment) ---------- */
  const items = ((DIAL_META && DIAL_META.items) || []).filter((i) => i.mode === 'whole');
  const envs = ENVS.filter((e) => items.some((i) => i.preset === e));
  const itemOf = (e) => items.find((i) => i.preset === e) || items[0] || null;
  const plateOf = (e) => ((PLATE_FILES || []).includes(e + '.webp') ? 'img/plates/' + e + '.webp' : null);
  const fallback = h('div', { class: 'pl-fallback', 'aria-hidden': 'true' });
  frame.prepend(fallback);
  let env = envs.includes('overcast') ? 'overcast' : envs[0];
  let front = 0, plateOp = 0, cur = null;
  const vals = { ...DEFAULT_BEND };

  function setEnv(e, first = false) {
    env = e;
    const it = itemOf(e);
    cur = { item: it, meta: (it && it.meta) || {}, phoneLog: (it && it.meta && it.meta.phone) || {} };
    $$('button', envBox).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.env === e)));
    // background plate: swap the hidden one in, fade the other out
    const src = plateOf(e);
    const next = plates[1 - front], old = plates[front];
    if (src) {
      next.src = src;
      next.alt = '';
      front = 1 - front;
      fallback.style.background = '';
    } else {
      const [a, b, c] = FALLBACK[e] || FALLBACK.overcast;
      fallback.style.background = `linear-gradient(${a} 0 36%, ${b} 56%, ${c} 100%)`;
      old.removeAttribute('src');
    }
    applyPlate();
    if (leaf) leaf.setEnv(e);
    // the render and the phone picture of this leaf in this scene
    if (it) {
      const raw = fix(it.file_raw);
      if (raw !== rawSrc) { rawSrc = raw; rawReady = false; if (loadedRaw) { loadedRaw = false; loadRaw(); } }
      phoneImg.src = fix(it.file_phone);
      phoneImg.alt = `The same leaf in the ${ENV_NAMES[e].toLowerCase()} scene, after phone effects`;
    }
    if (!first && current >= 0) { paintReadout(current); paintTag(current); }
  }
  function applyPlate() {
    const useImg = !!plateOf(env);
    plates.forEach((p, n) => { p.style.opacity = useImg && n === front ? String(plateOp) : '0'; });
    fallback.style.opacity = useImg ? '0' : String(plateOp);
    stage.classList.toggle('has-plate', plateOp > 0.02);
    if (leaf) leaf.setBackdrop(plateOp > 0.02);
  }

  envs.forEach((e) => envBox.append(h('button', { type: 'button', class: 'chip', 'data-env': e, 'aria-pressed': 'false', onclick: () => setEnv(e) }, ENV_NAMES[e])));

  /* ---------- Lesion rings on the cut-out ---------- */
  const lesions = $('#pl-lesions');
  const rings = [];
  if (PIPELINE && PIPELINE.lesions) {
    const brown = (PIPELINE.lesions.brown || []).slice(0, 1);
    const nearBrown = (l) => brown.some((b) => Math.hypot(l[0] - b[0], l[1] - b[1]) < 0.07);
    const orange = (PIPELINE.lesions.orange || []).filter((l) => l[2] > 90 && !nearBrown(l)).slice(0, 6);
    const mk = (arr, kind) => arr.forEach(([u, v, m]) => {
      const r = Math.max(5, Math.min(10.5, 3.6 + Math.sqrt(m / 1575) * 5.5));
      const li = h('li', { 'data-kind': kind, style: { '--x': (u * 100).toFixed(1) + '%', '--y': ((1 - v) * 100).toFixed(1) + '%', '--r': r.toFixed(1) + '%' } });
      lesions.append(li);
      rings.push(li);
    });
    mk(orange, 'orange');
    mk(brown, 'brown');
  }
  const nOrange = PIPELINE && PIPELINE.lesions ? (PIPELINE.lesions.orange || []).length : 0;
  const nBrown = PIPELINE && PIPELINE.lesions ? (PIPELINE.lesions.brown || []).length : 0;

  // The three training renders of this leaf
  if (PIPELINE && PIPELINE.trainRenders) {
    PIPELINE.trainRenders.forEach((t) => fan.append(h('li', { style: { backgroundImage: `url(${t.file})` }, title: t.id }, h('span', null, t.id))));
  }

  /* ---------- 3D leaf ---------- */
  // The WebGL context is made the first time the visitor nears the 3D step, not at page load.
  let leaf = null, leafTried = false;
  const ensureLeaf = () => {
    if (leafTried) return leaf;
    leafTried = true;
    leaf = /[?&]nogl\b/.test(location.search) ? null : createLeaf(canvas3d);
    if (leaf) { leaf.set(vals); leaf.setEnv(env); leaf.setBackdrop(plateOp > 0.02); }
    return leaf;
  };
  controls.addEventListener('input', (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    vals[k] = Number(e.target.value) / 100;
    leaf && leaf.set(vals);
    if (current === 2) paintReadout(2);
  });
  $$('[data-k]', controls).forEach((i) => { i.setAttribute('aria-label', i.parentElement.textContent.trim()); });
  // Back to the pose we use for the practice photos
  $('#pl-reset').addEventListener('click', () => {
    Object.assign(vals, DEFAULT_BEND);
    $$('[data-k]', controls).forEach((i) => { i.value = String(Math.round(vals[i.dataset.k] * 100)); });
    leaf && leaf.set(vals);
    if (current === 2) paintReadout(2);
  });

  /* ---------- Readouts, by step ---------- */
  const orNA = (v, fn = (x) => x) => (v == null || v === '' ? null : fn(v));
  const signed = (n) => (Number(n) >= 0 ? '+' : '') + n;
  const rowsFor = (i) => {
    const L = PIPELINE && PIPELINE.labels ? PIPELINE.labels : { rust: 1, miner: 1, severity: 4 };
    const meta = cur ? cur.meta : {}, phoneLog = cur ? cur.phoneLog : {};
    if (i === 0) return [['source', 'BRACOL #897'], ['split', 'train'], ['rust', L.rust ? 'yes' : 'no'], ['leaf miner', L.miner ? 'yes' : 'no'], ['severity', `${L.severity} of 4`], ['photo', '2048 x 1024 px']];
    if (i === 1) return [['texture', PIPELINE ? `${PIPELINE.textureW} x ${PIPELINE.textureH} px` : null], ['orange spots found', nOrange || null], ['brown patches found', nBrown || null], ['mask check', 'passed']].filter((r) => r[1] != null);
    if (i === 2) return [['fold', Math.round(vals.fold * 100)], ['droop', Math.round(vals.droop * 100)], ['twist', Math.round(vals.twist * 100)], ['wavy edge', Math.round(vals.wave * 100)], ['sun angle', Math.round(vals.sun * 360) + ' deg'], ['background', ENV_NAMES[env]]];
    if (i === 3) {
      return [['scene', ENV_NAMES[env]], ['light', orNA(meta.light)], ['sky', orNA(meta.sky)], ['exposure', orNA(meta.exposure_ev, (v) => signed(v) + ' EV')], ['lens', orNA(meta.lens_mm, (v) => v + ' mm' + (meta.fstop ? ' f/' + meta.fstop : ''))],
        ['camera tilt', orNA(meta.cam_tilt_deg, (v) => v + ' deg')], ['leaf length', orNA(meta.leaf_len_m, (v) => v + ' m')], ['render time', orNA(cur && cur.item && cur.item.render_s, (v) => v + ' s')]].filter((r) => r[1] != null);
    }
    if (i === 4) {
      const out = Object.entries(phoneLog).filter(([, v]) => v != null && typeof v !== 'object').map(([k, v]) => [PHONE_NAMES[k] || k, v]);
      Object.entries(phoneLog).filter(([, v]) => Array.isArray(v)).forEach(([k, v]) => out.push([PHONE_NAMES[k] || k, v.join(' x ')]));
      return out.slice(0, 8);
    }
    return [['label', L.rust ? 'rust' : 'no rust'], ['from leaf', 'BRACOL #897'], ['severity', L.severity], ['in set 1', int(PIPELINE && PIPELINE.trainRenders ? PIPELINE.trainRenders.length : 3) + ' practice photos of it']];
  };
  const TAGS = () => [
    ['Real photo', 'BRACOL leaf 897 on plain paper', false],
    ['Cut out', 'The real leaf texture, paper removed', false],
    ['3D leaf', 'A live preview of the Blender step. Drag to turn it.', true],
    ['Made in 3D', `${ENV_NAMES[env]} scene, rendered in Blender`, true],
    ['Made in 3D + phone', 'The same picture with phone flaws added', true],
    ['Label', 'Copied from leaf 897', true],
  ];

  let current = -1;
  function paintReadout(i) {
    const rows = rowsFor(i);
    readout.replaceChildren(...rows.flatMap(([k, v]) => [h('dt', null, k), h('dd', null, String(v))]));
    readout.classList.toggle('is-on', rows.length > 0);
  }
  function paintTag(i) {
    const t = TAGS()[i];
    tag.replaceChildren(h('b', null, t[0]), h('span', null, t[1]));
    tag.classList.toggle('is-render', t[2]);
  }
  function setStage(i) {
    if (i === current) return;
    current = i;
    steps.forEach((li, n) => { li.classList.toggle('is-on', n === i); li.classList.toggle('is-done', n < i); });
    paintTag(i);
    prog.textContent = `Step ${i + 1} of 6`;
    paintReadout(i);
  }

  /* ---------- Progressive "render": the picture is drawn small and scaled up in steps ---------- */
  const SIZES = [6, 12, 24, 48, 96, 192, 384, 1024];
  const rawImg = new Image();
  rawImg.decoding = 'async';
  let rawReady = false, lastLevel = -1, rawSrc = '', loadedRaw = false;
  rawImg.onload = () => { rawReady = true; lastLevel = -1; drawResolve(resolveT); };
  const tiny = document.createElement('canvas');
  let resolveT = 0;
  function drawResolve(t) {
    resolveT = t;
    if (!rawReady) return;
    const level = Math.min(SIZES.length - 1, Math.floor(t * SIZES.length));
    if (level === lastLevel) return;
    lastLevel = level;
    const w = SIZES[level], hh = Math.max(1, Math.round(w / 2));
    tiny.width = w; tiny.height = hh;
    tiny.getContext('2d').drawImage(rawImg, 0, 0, w, hh);
    ctx.imageSmoothingEnabled = level >= SIZES.length - 1;
    ctx.clearRect(0, 0, resolve.width, resolve.height);
    ctx.drawImage(tiny, 0, 0, resolve.width, resolve.height);
  }
  function loadRaw() { if (!loadedRaw && rawSrc) { loadedRaw = true; rawImg.src = rawSrc; } }

  setEnv(env, true);

  /* ---------- Scroll mapping ---------- */
  const cx = 14.25, cw = 75.5;
  function apply(p) {
    const s = p * 6;
    const idx = Math.min(5, Math.floor(s + 1e-6));
    setStage(idx);

    original.style.opacity = String(1 - seg(s, 1.55, 1.85));
    original.style.transform = `scale(${lerp(0.93, 1, easeOut(seg(s, 0, 0.7))).toFixed(4)})`;

    const rev = seg(s, 1.0, 1.55);
    cut.style.opacity = rev > 0 ? String(1 - seg(s, 2.0, 2.2)) : '0';
    cut.style.clipPath = `inset(0 ${((1 - rev) * 100).toFixed(2)}% 0 0)`;
    scan.style.opacity = rev > 0.001 && rev < 0.999 ? '1' : '0';
    scan.style.left = (cx + cw * rev).toFixed(2) + '%';
    rings.forEach((r, n) => r.classList.toggle('is-on', s > 1.58 + n * 0.07 && s < 2.2));

    // the background fades in with the 3D leaf and out when the render takes over
    plateOp = seg(s, 1.95, 2.2) * (1 - seg(s, 3.08, 3.3));
    applyPlate();

    const o3 = seg(s, 2.0, 2.2) * (1 - seg(s, 3.0, 3.2));
    canvas3d.style.opacity = String(o3);
    canvas3d.style.pointerEvents = o3 > 0.5 ? 'auto' : 'none';
    canvas3d.tabIndex = o3 > 0.5 ? 0 : -1;
    if (s > 1.7) ensureLeaf();
    // sliders only in step 3. The background buttons stay for steps 4 and 5, so the render and the phone picture can change too.
    controls.classList.toggle('is-on', s > 2.45 && s < 4.95);
    controls.classList.toggle('only-env', s >= 3.05 || !leaf);
    if (leaf && s > 1.9 && s < 3.3) leaf.orbit(easeOut(seg(s, 2.1, 2.7)));

    if (s > 2.8) loadRaw();
    const oS = seg(s, 3.1, 3.3) * (1 - seg(s, 4.35, 4.62));
    sceneLayer.style.opacity = String(oS);
    drawResolve(seg(s, 3.12, 3.72));
    phone.style.opacity = String(seg(s, 4.1, 4.6));

    fan.classList.toggle('is-on', s > 5.15);
    label.classList.toggle('is-in', s > 5.3);
  }

  function staticMode() {
    // Motion off: show the finished picture and every step, no scrubbing. The background buttons still work.
    [original, sceneLayer].forEach((e) => { e.style.opacity = '0'; });
    cut.style.opacity = '0'; canvas3d.style.opacity = '0';
    plateOp = 0; applyPlate();
    phone.style.opacity = '1';
    fan.classList.add('is-on'); label.classList.add('is-in');
    controls.classList.add('is-on', 'only-env');
    tag.replaceChildren(h('b', null, 'Made in 3D + phone'), h('span', null, 'The final photo. All six steps are listed above.'));
    tag.classList.add('is-render');
    readout.replaceChildren(...rowsFor(4).flatMap(([k, v]) => [h('dt', null, k), h('dd', null, String(v))]));
    readout.classList.add('is-on');
    prog.textContent = '';
    steps.forEach((li) => li.classList.add('is-on'));
  }

  const sc = scene(track, {
    pinned: true,
    ease: 0.11,
    onProgress: (p) => { if (state.motion) apply(p); },
    onVisible: (v) => { if (v) loadRaw(); },
  });
  document.addEventListener('motionchange', () => { if (state.motion) { current = -1; apply(sc.p); } else staticMode(); });
  if (!state.motion) staticMode(); else apply(0);

  // 3D draw loop: only while the 3D stage is on screen
  onFrame(() => {
    if (!leaf || !state.motion) return;
    const s = sc.p * 6;
    if (s > 1.9 && s < 3.3 && leaf.dirty) leaf.render();
  });
}
