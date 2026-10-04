import * as THREE from 'three';
import { BaseScene } from './baseScene.js';
import { Farm } from '../world/farm.js';
import { heightAt, terraceZ } from '../world/terrain.js';
import { setEnv } from '../core/env.js';

// Noor's farm: the hero, the story and the closing shot.
// Nothing here spreads or grows over time. Each shrub just has a rust level, set by hand.
export class FarmScene extends BaseScene {
  constructor(app) {
    super(app);
    this.patch = new THREE.Vector3();
  }

  build(progress) {
    this.farm = new Farm({ quality: this.app.quality, onProgress: progress });
    this.group.add(this.farm.group);
    this.sev = new Float32Array(this.farm.shrubs.length);

    const pz = terraceZ(0, 9, 0.4);
    this.patch.set(0, heightAt(0, pz), pz);
    this.defaultSeed = this._nearest(this.patch.x, this.patch.z);
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
      close: { pos: [-104, 62, 150], target: [2, 22, -2], fov: 28, parallax: 1 },
    };
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
  // Give the shrubs around `centers` a rust level `peak` (0 to 1), fading over `radius` metres.
  // With one center, that shrub gets exactly `peak`.
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

  setLite(on) { this.lite = on; this.farm.shadows.mesh.visible = !on; if (this.built && this.app.index >= 0) { this._setLOD(this._lodRadius || 0); } }

  _setLOD(radius) {
    this._lodRadius = radius;
    this.farm.assignLOD(this.patch.x, this.patch.z, this.lite ? 0 : radius);
    this._apply();
  }

  // ------------------------------------------------------------- beats
  enter(id) {
    const tags = this.app.tags;
    setEnv('dawn');
    this.farm.setWide(id === 'open' || id === 'noor-1' || id === 'close');
    switch (id) {
      case 'open': this._setLOD(0); this._paint(this.heroSeeds, 0.78, 5.5); tags.only([]); break;
      case 'noor-1': this._setLOD(0); this._paint(this.heroSeeds, 0.72, 5.0); tags.only(['t-coffee', 't-maize', 't-beans']); break;
      case 'noor-2': this._setLOD(20); this._paint([this.defaultSeed], 0.36, 3.6); tags.only(['t-noor']); break;
      case 'noor-3': this._setLOD(14); this._paint([this.defaultSeed], 0.2, 2.2); tags.only(['t-spots']); break;
      case 'close': this._setLOD(0); this._paint(this.heroSeeds, 0.8, 8); tags.only([]); break;
      default: break;
    }
  }
}
