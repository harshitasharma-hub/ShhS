import * as THREE from 'three';
import { BEATS } from './content.js';
import { U, setEnv, updateEnv } from './core/env.js';
import { Seam } from './core/seam.js';
import { CameraRig } from './core/camera.js';
import { Tags } from './core/tags.js';
import { Panels } from './ui/panels.js';
import { Rail } from './ui/rail.js';
import { Input } from './ui/input.js';
import { BaseScene } from './scenes/baseScene.js';
import { FarmScene } from './scenes/farmScene.js';
import { clamp } from './core/math.js';

const DEFAULT_POSE = { pos: [0, 4, 46], target: [0, 2, 0], fov: 34, parallax: 0.6 };

class StubScene extends BaseScene {
  pose() { return DEFAULT_POSE; }
}

// yield to the browser without waiting for a frame (a hidden tab pauses requestAnimationFrame)
const nextFrame = () => new Promise((r) => setTimeout(r, 0));

export class App {
  constructor(sceneClasses = {}) {
    this.index = -1;
    this.count = BEATS.length;
    this.pointer = { x: 0, y: 0 };
    this.sceneClasses = sceneClasses;
    this.swapTimer = 0;
    this.active = null;
    this.perf = { acc: 0, n: 0, skip: 90, slow: 0 };
    this.lite = false;
    this.paused = false;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const qs = new URLSearchParams(location.search);
    this.maxDpr = Math.min(window.devicePixelRatio || 1, parseFloat(qs.get('dpr') || '1.5'));
    this.dpr = this.maxDpr;
    this.aa = qs.get('aa') !== '0';
    this.forceNoGL = qs.get('nogl') === '1'; // test hook for the plain-text fallback
  }

  // ------------------------------------------------------------------ boot
  async boot() {
    window.__app = this;
    const canvas = document.getElementById('gl');
    this.canvas = canvas;
    // The talk text goes first, so it can still be read where WebGL is missing.
    this.panels = new Panels(this);
    try {
      if (this.forceNoGL) throw new Error('WebGL switched off for testing');
      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: this.aa, alpha: true, powerPreference: 'high-performance' });
    } catch (err) {
      this._noGL();
      return;
    }
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.quality = window.innerWidth < 800 ? 0.7 : 1;
    this.scene3d = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.5, 5000);
    this.rig = new CameraRig(this.camera);
    this.seam = new Seam(document.getElementById('seam'));
    this.tags = new Tags(document.getElementById('tags'), this.camera);
    setEnv('dawn', true);
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('pointermove', (e) => {
      this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    this.rail = new Rail();
    this.input = new Input(this);
    this._chrome();

    // canvas text needs the fonts, so wait for them (but never longer than 2.5 s)
    const fontJobs = ['800 40px Bricolage', '700 40px Bricolage', '400 30px Instrument', '600 30px Instrument', '700 30px Instrument', '400 24px DMMono', '500 24px DMMono'].map((f) => document.fonts.load(f).catch(() => {}));
    await Promise.race([Promise.all(fontJobs), new Promise((r) => setTimeout(r, 2500))]);

    // scenes
    const bar = document.getElementById('preloaderBar');
    const names = [...new Set(BEATS.map((b) => b.scene))];
    this.scenes = {};
    for (let k = 0; k < names.length; k++) {
      const name = names[k];
      const Cls = this.sceneClasses[name] || StubScene;
      const s = new Cls(this);
      this.scenes[name] = s;
      this.scene3d.add(s.group);
      await nextFrame();
      s.build((p) => { bar.style.width = `${((k + p) / names.length) * 100}%`; });
      s.built = true;
    }
    bar.style.width = '100%';

    // first beat from the address bar, if any
    const hash = location.hash.replace('#', '');
    let start = BEATS.findIndex((b) => b.id === hash);
    if (start < 0) start = 0;
    this.go(start, { instant: true });
    await nextFrame();
    document.body.classList.add('is-ready');
    if (start === 0) this.seam.go(0.5, { mode: 'follow' });
    this._keepAwake();

    canvas.addEventListener('click', (e) => { if (this.active) this.active.pick(e.clientX, e.clientY); });
    window.addEventListener('hashchange', () => {
      const j = BEATS.findIndex((b) => b.id === location.hash.replace('#', ''));
      if (j >= 0 && j !== this.index) this.go(j);
    });
    this.last = performance.now();
    requestAnimationFrame((t) => this._frame(t));
  }

  // No WebGL: show the whole talk as a plain readable page.
  _noGL() {
    document.body.classList.add('no-gl', 'is-ready');
    const note = document.getElementById('nogl');
    note.hidden = false;
    this.panels.root.before(note);
    this.panels.els.forEach((el) => { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); el.classList.add('is-active'); });
  }

  // A 10 minute talk should not be interrupted by the screen going to sleep.
  _keepAwake() {
    const ask = async () => { try { this._wake = await navigator.wakeLock?.request('screen'); } catch (e) { /* not granted, that is fine */ } };
    ask();
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') ask(); });
  }

  _chrome() {
    document.getElementById('btnNotes').addEventListener('click', () => this.toggleNotes());
    document.getElementById('btnKeys').addEventListener('click', () => this.toggleKeys());
    document.getElementById('btnFull').addEventListener('click', () => this.fullscreen());
    document.getElementById('brand').addEventListener('click', (e) => { e.preventDefault(); this.go(0); });
  }

  // ------------------------------------------------------------------ sizing
  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    const v = new THREE.Vector2();
    this.renderer.getDrawingBufferSize(v);
    U.uRes.value.copy(v);
    this.tags.resize(w, h);
    if (this.seam) this.seam._write();
    if (this.scenes) for (const s of Object.values(this.scenes)) s.resize(w, h);
  }

  // Keep the frame rate up on weaker machines by trading resolution, never effects.
  _perf(dt) {
    const p = this.perf;
    if (p.skip > 0) { p.skip--; return; }
    p.acc += dt; p.n++;
    if (p.n < 80) return;
    const avg = p.acc / p.n;
    p.acc = 0; p.n = 0;
    if (avg > 0.024 && this.dpr > 1.0) { this.dpr = Math.max(1.0, this.dpr - 0.15); this.resize(); p.skip = 40; p.slow = 0; }
    else if (avg > 0.034 && this.dpr <= 1.0 && !this.lite) { if (++p.slow >= 2) this.setLite(true); }
    else if (avg < 0.0135 && this.dpr < this.maxDpr && !this.lite) { this.dpr = Math.min(this.maxDpr, this.dpr + 0.1); this.resize(); p.skip = 40; p.slow = 0; }
    else p.slow = 0;
  }

  // Lite mode: fewer details so a weak laptop keeps up. Press Q to flip it by hand.
  setLite(on) {
    this.lite = on;
    document.body.dataset.lite = on ? '1' : '0';
    if (this.scenes) for (const s of Object.values(this.scenes)) s.setLite?.(on);
    if (on) { this.dpr = 1.0; this.resize(); }
  }

  // ------------------------------------------------------------------ steps
  next() { this.go(this.index + 1); }
  prev() { this.go(this.index - 1); }

  go(i, { instant = false } = {}) {
    i = clamp(i, 0, this.count - 1);
    if (i === this.index && !instant) return;
    const prev = BEATS[this.index];
    const beat = BEATS[i];
    this.index = i;
    try { history.replaceState(null, '', `#${beat.id}`); } catch (e) { /* file:// in some browsers */ }
    const b = document.body;
    b.dataset.chapter = beat.chapter;
    b.dataset.beat = beat.id;
    b.dataset.grid = beat.grid ? '1' : '0';
    this.panels.show(i);
    this.rail.update(i);
    this._notes();
    setEnv(beat.env, instant);
    this.seam.show(beat.seam.show);
    const [tagL, tagR] = beat.seamTags || ['Photo', 'Labels'];
    document.querySelector('.seam__tag--l').textContent = tagL;
    document.querySelector('.seam__tag--r').textContent = tagR;
    this.seam.go(beat.seam.v, { mode: beat.seam.mode, instant });
    this.tags.clear();

    const scene = this.scenes[beat.scene];
    const pose = scene.pose(beat.id);
    const swap = () => {
      if (this.active && this.active !== scene) { this.active.group.visible = false; this.active.leave(); }
      scene.group.visible = true;
      this.active = scene;
      scene.enter(beat.id, prev && prev.id);
      return true;
    };
    clearTimeout(this.swapTimer);
    const sceneChanged = !prev || prev.scene !== beat.scene || this.active !== scene;
    if (instant) {
      swap();
      this.rig.jumpTo(pose);
    } else if (sceneChanged) {
      this.canvas.classList.add('is-fading');
      this.swapTimer = setTimeout(() => {
        swap();
        this.rig.jumpTo(this._pulled(pose, 0.16));
        this.rig.flyTo(pose, 1.9);
        this.canvas.classList.remove('is-fading');
      }, 300);
    } else {
      swap();
      const dist = this.rig.pos.distanceTo(new THREE.Vector3().fromArray(pose.pos));
      this.rig.flyTo(pose, clamp(1.2 + dist / 90, 1.3, 2.4));
    }
  }

  _pulled(pose, k) {
    const t = new THREE.Vector3().fromArray(pose.target), p = new THREE.Vector3().fromArray(pose.pos);
    p.sub(t).multiplyScalar(1 + k).add(t);
    return { ...pose, pos: p.toArray() };
  }

  // ------------------------------------------------------------------ controls
  control(name, el, ev) { if (this.active) this.active.control(name, el, ev); }

  action(name) {
    switch (name) {
      case 'next': this.next(); break;
      case 'first': this.go(0); break;
      case 'sources': this.panels.openSheet(); break;
      case 'closeSheet': this.panels.closeSheet(); break;
      case 'closeOverlays':
        document.getElementById('notes').hidden = true; document.getElementById('btnNotes').setAttribute('aria-pressed', 'false');
        document.getElementById('keys').hidden = true; document.getElementById('btnKeys').setAttribute('aria-pressed', 'false');
        break;
      default: break;
    }
  }

  toggleNotes() {
    const n = document.getElementById('notes');
    n.hidden = !n.hidden;
    document.getElementById('btnNotes').setAttribute('aria-pressed', String(!n.hidden));
  }
  toggleKeys() {
    const n = document.getElementById('keys');
    n.hidden = !n.hidden;
    document.getElementById('btnKeys').setAttribute('aria-pressed', String(!n.hidden));
  }
  fullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  }

  _notes() {
    document.getElementById('notesText').textContent = BEATS[this.index].notes;
  }

  currentBeat() { return BEATS[this.index].id; }

  // ------------------------------------------------------------------ loop
  togglePause() {
    this.paused = !this.paused;
    document.body.dataset.paused = this.paused ? '1' : '0';
  }

  // Decorative motion (conveyors, drift) stops when paused or when the person asked their
  // system for reduced motion. Things the person starts themselves, like a new render, still run.
  get motion() { return !this.paused && !this.reduced; }

  _frame(now) {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const motion = this.motion;
    if (motion) U.uTime.value += dt;
    updateEnv(dt);
    this.seam.update(dt);
    this.rig.update(dt, U.uTime.value, this.pointer);
    if (this.active) this.active.update(dt, U.uTime.value, motion);
    this.tags.update();
    this.renderer.render(this.scene3d, this.camera);
    this._perf(dt);
    window.__fps = 1 / Math.max(dt, 0.001);
    requestAnimationFrame((t) => this._frame(t));
  }
}
