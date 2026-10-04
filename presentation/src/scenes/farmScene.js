import * as THREE from 'three';
import { BaseScene } from './baseScene.js';
import { Farm } from '../world/farm.js';
import { heightAt, terraceZ } from '../world/terrain.js';
import { U, setEnv, skyStops } from '../core/env.js';
import { clamp, mulberry32 } from '../core/math.js';

const LIGHTS = [
  { name: 'dawn', label: 'dawn light' },
  { name: 'noon', label: 'noon sun' },
  { name: 'overcast', label: 'overcast' },
  { name: 'late', label: 'late sun' },
];

// Plant severity (0 to 1) for each step of the BRACOL scale: 0 is healthy, 4 is the worst.
const LEVEL = [0, 0.14, 0.32, 0.56, 0.86];

// Noor's farm: the hero, the story, the render lab, and the preview photo shoot.
// Nothing here spreads or grows over time. Each shrub just has a rust level, set by hand.
export class FarmScene extends BaseScene {
  constructor(app) {
    super(app);
    this.level = 2;
    this.labOn = false;
    this.patch = new THREE.Vector3();
    this.pairs = 0;
    this.shooting = false;
  }

  build(progress) {
    this.farm = new Farm({ quality: this.app.quality, onProgress: progress });
    this.group.add(this.farm.group);
    this.sev = new Float32Array(this.farm.shrubs.length);

    const pz = terraceZ(0, 9, 0.4);
    this.patch.set(0, heightAt(0, pz), pz);
    this.defaultSeed = this._nearest(this.patch.x, this.patch.z);
    this.target = this.defaultSeed;
    // the wide shots show a bigger patch: a dozen neighbours with rust
    const near = this.farm.shrubs.map((q, i) => [Math.hypot(q.x - this.patch.x, q.z - this.patch.z), i]).sort((a, b) => a[0] - b[0]);
    this.heroSeeds = near.slice(0, 12).map((q) => q[1]);
    this._poses();
    this._tags();
    this.built = true;
  }

  _nearest(x, z) {
    let best = 0, bd = 1e9;
    this.farm.shrubs.forEach((s, i) => { const d = Math.hypot(s.x - x, s.z - z); if (d < bd) { bd = d; best = i; } });
    return best;
  }

  _poses() {
    const s = this.farm.shrubs[this.defaultSeed];
    this.poses = {
      open: { pos: [112, 64, 186], target: [-2, 33, 4], fov: 27, parallax: 1 },
      'noor-1': { pos: [-88, 62, 112], target: [-2, 16, 2], fov: 31, parallax: 0.8 },
      'noor-2': { pos: [38, 40, 20], target: [0, 21, -20], fov: 31, parallax: 0.8 },
      'noor-3': { pos: [s.x + 1.0, s.y + 1.8, s.z + 3.7], target: [s.x - 0.1, s.y + 1.2, s.z + 0.1], fov: 38, parallax: 0.4, drift: 0.3 },
      lab: this._viewPose(this.defaultSeed, -0.38, 5.6, 1.9),
      pairs: { pos: [s.x - 2.4, s.y + 1.7, s.z + 5.6], target: [s.x, s.y + 1.15, s.z], fov: 46, parallax: 0.4, drift: 0.4 },
      close: { pos: [-104, 62, 150], target: [2, 22, -2], fov: 28, parallax: 1 },
    };
  }

  // A camera looking at one shrub from `az` radians around it, `dist` metres away, `h` metres up.
  // The text card covers the lower left, so the shrub is framed up and to the right of the middle.
  _viewPose(i, az, dist, h) {
    const s = this.farm.shrubs[i];
    const k = dist * 0.2; // how far to look to the left of the shrub
    return { pos: [s.x + Math.sin(az) * dist, s.y + h, s.z + Math.cos(az) * dist], target: [s.x - Math.cos(az) * k, s.y + 0.8, s.z + Math.sin(az) * k], fov: 40, parallax: 0.4, drift: 0.3 };
  }

  _tags() {
    const t = this.app.tags, f = this.farm;
    t.add({ id: 't-coffee', text: 'Coffee', sub: 'upper slope', anchor: f.anchor('coffee'), side: 'r', len: 40 });
    t.add({ id: 't-maize', text: 'Maize', sub: 'middle', anchor: f.anchor('maize'), side: 'r', len: 40 });
    t.add({ id: 't-beans', text: 'Beans', sub: 'lower', anchor: f.anchor('beans'), side: 'r', len: 40 });
    t.add({ id: 't-house', text: "Noor's house", sub: 'no Wi-Fi, 3G bundles', anchor: f.anchor('house'), side: 'l', len: 50 });
    t.add({ id: 't-coop', text: 'Cooperative', sub: 'sells to a middleman', anchor: f.anchor('coop'), side: 'l', len: 40 });
    t.add({ id: 't-noor', text: 'Noor', sub: 'checking her coffee', anchor: f.anchor('noor'), side: 'r', len: 36, big: true });
    t.add({ id: 't-spots', text: 'First spots', sub: 'a few mm wide', anchor: () => this._spotAnchor(), side: 'r', len: 46, color: '#ffe14d', big: true });
    t.add({ id: 't-officer', text: 'Extension officer', sub: 'two visits a year, at best', anchor: new THREE.Vector3(46, heightAt(46, 56) + 2.2, 56), side: 'l', len: 46 });
  }

  _spotAnchor() {
    const s = this.farm.shrubs[this.defaultSeed];
    return new THREE.Vector3(s.x - 0.1, s.y + 2.3, s.z + 0.3);
  }

  // ------------------------------------------------------------- state
  // Give the shrubs around `centers` a rust level `peak`, fading over `radius` metres.
  // With one center, that shrub gets exactly `peak`, so the label matches what the camera sees.
  _paint(centers, peak, radius) {
    const shrubs = this.farm.shrubs, sev = this.sev;
    sev.fill(0);
    if (peak > 0) {
      for (let i = 0; i < shrubs.length; i++) {
        const s = shrubs[i];
        let w = 0;
        for (const c of centers) {
          const q = shrubs[c];
          const d = Math.hypot(s.x - q.x, s.z - q.z) / radius;
          w = Math.max(w, Math.exp(-d * d));
        }
        if (w > 0.06) sev[i] = Math.min(1, peak * w * (0.8 + 0.4 * s.seed));
      }
      if (centers.length === 1) sev[centers[0]] = peak;
    }
    this._apply();
  }

  _apply() {
    const n = this.sev.length;
    for (let i = 0; i < n; i++) this.farm.setSeverity(i, this.sev[i]);
    this.farm.flush();
  }

  _paintTarget() {
    this._paint([this.target], LEVEL[this.level], 2.4);
    this._readout();
  }

  _readout() {
    if (!this.labOn) return;
    const p = this.app.panels;
    p.out('level', String(this.level));
    p.out('label', this.level ? `rust yes · severity ${this.level}` : 'rust no · healthy');
    p.setRange('level', this.level);
  }

  _lights(name = 'dawn') {
    document.querySelectorAll('[data-ctl="light"]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.light === name)));
  }

  setLite(on) { this.lite = on; this.farm.shadows.mesh.visible = !on; if (this.built && this.app.index >= 0) { this._setLOD(this._lodRadius || 0); } }

  _setLOD(radius) {
    this._lodRadius = radius;
    this.farm.assignLOD(this.patch.x, this.patch.z, this.lite ? 0 : radius);
    this._apply();
  }

  // ------------------------------------------------------------- beats
  enter(id) {
    const app = this.app, tags = app.tags;
    this.labOn = false;
    app.phoneFrame(false);
    setEnv('dawn');
    this._lights('dawn');
    this.farm.setWide(id === 'open' || id === 'noor-1' || id === 'close');
    this.target = this.defaultSeed;
    switch (id) {
      case 'open': this._setLOD(0); this._paint(this.heroSeeds, 0.78, 5.5); tags.only([]); break;
      case 'noor-1': this._setLOD(0); this._paint(this.heroSeeds, 0.72, 5.0); tags.only(['t-coffee', 't-maize', 't-beans']); break;
      case 'noor-2': this._setLOD(20); this._paint([this.defaultSeed], 0.36, 3.6); tags.only(['t-noor']); break;
      case 'noor-3': this._setLOD(14); this._paint([this.defaultSeed], 0.2, 2.2); tags.only(['t-spots']); break;
      case 'lab':
        this.level = 2; this.labOn = true;
        this._setLOD(16); tags.only([]);
        this._paintTarget();
        break;
      case 'pairs': this._setLOD(16); this._paint([this.defaultSeed], 0.32, 2.4); tags.only([]); app.phoneFrame(true); break;
      case 'close': this._setLOD(0); this._paint(this.heroSeeds, 0.8, 8); tags.only([]); break;
      default: break;
    }
  }

  leave() { this.app.phoneFrame(false); }

  // ------------------------------------------------------------- controls
  control(name, el) {
    switch (name) {
      case 'level': this.level = clamp(parseInt(el.value, 10) || 0, 0, 4); this._paintTarget(); break;
      case 'light': setEnv(el.dataset.light); this._lights(el.dataset.light); break;
      case 'view': {
        const az = (Math.random() * 2 - 1) * 1.2, dist = 3.8 + Math.random() * 2.6, h = 1.0 + Math.random() * 1.8;
        this.app.rig.flyTo(this._viewPose(this.target, az, dist, h), 1.0);
        break;
      }
      case 'spot': {
        const pool = this.farm.shrubs.map((s, i) => i).filter((i) => this.farm.shrubs[i].lod === 1 && i !== this.target);
        if (!pool.length) break;
        this._goTo(pool[Math.floor(Math.random() * pool.length)]);
        break;
      }
      case 'shutter': this.shoot(1); break;
      case 'batch': this.shoot(12); break;
      default: break;
    }
  }

  _goTo(i) {
    this.target = i;
    this._paintTarget();
    this.app.rig.flyTo(this._viewPose(i, -0.38, 5.6, 1.9), 1.2);
  }

  pick(x, y) {
    if (!this.labOn) return false;
    const cam = this.app.camera, v = new THREE.Vector3();
    let best = -1, bd = 46 * 46;
    const w = window.innerWidth, h = window.innerHeight;
    this.farm.shrubs.forEach((s, i) => {
      if (s.lod !== 1) return;
      v.set(s.x, s.y + 1.0, s.z).project(cam);
      if (v.z > 1) return;
      const sx = (v.x * 0.5 + 0.5) * w, sy = (-v.y * 0.5 + 0.5) * h;
      const d = (sx - x) ** 2 + (sy - y) ** 2;
      if (d < bd) { bd = d; best = i; }
    });
    if (best < 0) return false;
    this._goTo(best);
    return true;
  }

  // ------------------------------------------------------------- the preview photo shoot
  // One image and its label view, from the current camera. Returns two canvases.
  _grab(rect) {
    const app = this.app, gl = app.renderer.domElement;
    const sc = gl.width / window.innerWidth;
    const sx = Math.max(0, rect.left * sc), sy = Math.max(0, rect.top * sc);
    const sw = Math.min(gl.width - sx, rect.width * sc), sh = Math.min(gl.height - sy, rect.height * sc);
    const out = [];
    const old = U.uSeam.value;
    const stops = skyStops();
    for (const labels of [false, true]) {
      U.uSeam.value = labels ? 0 : 1;
      app.renderNow();
      const c = document.createElement('canvas');
      c.width = 240; c.height = Math.round(240 * (sh / sw));
      const ctx = c.getContext('2d');
      if (labels) { ctx.fillStyle = '#2a1b52'; ctx.fillRect(0, 0, c.width, c.height); }
      else {
        const g = ctx.createLinearGradient(0, 0, 0, c.height);
        g.addColorStop(0, stops[0]); g.addColorStop(0.3, stops[1]); g.addColorStop(0.5, stops[2]); g.addColorStop(0.68, stops[3]);
        ctx.fillStyle = g; ctx.fillRect(0, 0, c.width, c.height);
      }
      ctx.drawImage(gl, sx, sy, sw, sh, 0, 0, c.width, c.height);
      out.push(c);
    }
    U.uSeam.value = old;
    app.renderNow();
    return out;
  }

  // Healthy about one time in five, then severity 1 to 4 in equal parts.
  _pickLevel(rng) {
    const r = rng();
    return r < 0.2 ? 0 : 1 + Math.min(3, Math.floor(((r - 0.2) / 0.8) * 4));
  }

  async shoot(count) {
    if (this.shooting) return;
    this.shooting = true;
    const app = this.app;
    const frame = document.getElementById('phoneFrame');
    const rect = frame.getBoundingClientRect();
    const keepPose = { pos: app.rig.pos.toArray(), target: app.rig.target.toArray(), fov: app.rig.fov, parallax: 0.4, drift: 0.4 };
    const rng = mulberry32(Date.now() % 100000);
    const pool = this.farm.shrubs.map((s, i) => i).filter((i) => this.farm.shrubs[i].lod === 1);
    if (!pool.length) pool.push(this.defaultSeed);
    app.panels.busy(true);
    for (let k = 0; k < count; k++) {
      const i = pool[Math.floor(rng() * pool.length)];
      const s = this.farm.shrubs[i];
      const level = this._pickLevel(rng);
      const light = LIGHTS[Math.floor(rng() * LIGHTS.length)];
      const az = rng() * Math.PI * 2, dist = 3.6 + rng() * 3.6, hgt = 0.7 + rng() * 1.9;
      this._paint([i], LEVEL[level], 2.4);
      setEnv(light.name, true);
      app.rig.jumpTo({ pos: [s.x + Math.cos(az) * dist, s.y + hgt, s.z + Math.sin(az) * dist], target: [s.x, s.y + 1.1, s.z], fov: 38 + rng() * 14, parallax: 0, drift: 0 });
      app.renderNow();
      const [photo, mask] = this._grab(rect);
      const label = level ? `rust yes · severity ${level}` : 'rust no · healthy';
      app.panels.addPair(photo, mask, `${label} · ${light.label}`);
      this.pairs++;
      app.panels.out('pairs', String(this.pairs));
      await new Promise((r) => setTimeout(r, count > 1 ? 260 : 0));
    }
    setEnv('dawn', true);
    this._paint([this.defaultSeed], 0.32, 2.4);
    app.rig.jumpTo(keepPose);
    app.panels.busy(false);
    this.shooting = false;
  }
}
