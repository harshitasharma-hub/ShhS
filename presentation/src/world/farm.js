import * as THREE from 'three';
import { heightAt, terraceZ, distToPath, buildTerrain, T } from './terrain.js';
import { buildCoffee, buildMaize, buildBean, buildBanana, COFFEE_LOW, COFFEE_HIGH } from './plants.js';
import { plantMaterial, PlantBatch } from './plantMaterial.js';
import { buildHouse, buildCoop, buildDryingBeds, buildTree, buildPerson, buildRocks, propMaterial } from './props.js';
import { buildClouds, Shadows } from './atmosphere.js';
import { mulberry32, range, TAU } from '../core/math.js';

// Noor's farm. Everything is placed from code, with fixed seeds, so the model is the same every run.
export const SPOTS = {
  house: [-40, 12],
  dryer: [-30, 19],
  coop: [42, 47],
  noor: [-2, 0],
};

export class Farm {
  constructor({ quality = 1, onProgress = () => {} } = {}) {
    this.quality = quality;
    this.group = new THREE.Group();
    this.shrubs = [];
    this.batches = { coffee: [] };
    this.spots = {};
    this.onProgress = onProgress;
    this._build();
  }

  _build() {
    const q = this.quality;
    const { mesh, walls } = buildTerrain(q >= 0.8 ? 1 : 0.7);
    this.group.add(mesh, walls);
    this.terrain = mesh;
    this.onProgress(0.15);

    this.shadows = new Shadows(2600);
    this.group.add(this.shadows.mesh);

    const blocked = (x, z) => {
      const around = [[SPOTS.house[0], SPOTS.house[1], 8], [SPOTS.dryer[0], SPOTS.dryer[1], 5], [SPOTS.coop[0], SPOTS.coop[1], 9]];
      for (const [bx, bz, r] of around) if (Math.hypot(x - bx, z - bz) < r) return true;
      return distToPath(x, z) < 2.2;
    };
    this.blocked = blocked;

    this._coffee(blocked);
    this.onProgress(0.5);
    this._maizeAndBeans(blocked);
    this.onProgress(0.75);
    this._props();
    this.onProgress(0.9);

    this.clouds = buildClouds();
    this.group.add(this.clouds);
    for (const b of this.batches.coffee) b.mesh.renderOrder = 1;
    this.onProgress(1);
  }

  _coffee(blocked) {
    const q = this.quality;
    const rng = mulberry32(11);
    const mat = plantMaterial({ sick: 1, sway: 0.16, shine: 0.34, leafA: '#0d3623', leafB: '#2b7a45', under: '#78a27c', labelFlat: '#6d5db4' });
    this.coffeeMat = mat;
    // two levels of detail: cheap shrubs everywhere, rich ones near whatever the camera is studying
    const lo = [0, 1, 2].map((i) => new PlantBatch(buildCoffee(101 + i * 37, COFFEE_LOW), 420, mat));
    const hi = [0, 1, 2].map((i) => new PlantBatch(buildCoffee(101 + i * 37, COFFEE_HIGH), 140, mat));
    this.batches.coffee = [...lo, ...hi];
    this.coffeeLOD = { lo, hi };
    const step = q >= 0.8 ? 2.6 : 3.3;
    for (let k = 6; k <= 13; k++) {
      for (let x = -50; x <= 50; x += step) {
        const xx = x + range(rng, -0.45, 0.45);
        const z = terraceZ(xx, k, 0.4) + range(rng, -0.3, 0.3);
        if (blocked(xx, z)) continue;
        const y = heightAt(xx, z);
        const sc = range(rng, 1.25, 1.55);
        this.shrubs.push({ x: xx, y, z, k, vi: Math.floor(rng() * 3), sc, yaw: rng() * TAU, seed: rng(), sev: 0, lod: 0, slot: 0, id: this.shrubs.length });
        this.shadows.add(xx, y, z, 3.0 * sc, 2.4 * sc, 1.8 * sc);
      }
    }
    for (const b of this.batches.coffee) this.group.add(b.mesh);
    this.assignLOD(0, 0, 0);
  }

  // Put shrubs within `radius` of (cx, cz) on the rich geometry, the rest on the cheap one.
  assignLOD(cx, cz, radius) {
    const { lo, hi } = this.coffeeLOD;
    for (const b of [...lo, ...hi]) b.reset();
    for (const s of this.shrubs) {
      const near = radius > 0 && Math.hypot(s.x - cx, s.z - cz) < radius;
      s.lod = near ? 1 : 0;
      const b = (near ? hi : lo)[s.vi];
      s.slot = b.add(s.x, s.y, s.z, s.yaw, s.sc, s.seed);
      b.setSeverity(s.slot, s.sev);
    }
    this.flush();
  }

  _maizeAndBeans(blocked) {
    const q = this.quality;
    const rng = mulberry32(23);
    const maizeMat = plantMaterial({ sick: 0, sway: 0.2, shine: 0.18, leafA: '#2d6a2c', leafB: '#7fae3f', under: '#8db56a', wood: '#7a8a3a', fruitA: '#d9c46a', fruitC: '#d9c46a', fruitB: '#d9c46a', labelFlat: '#7d6fcb' });
    const beanMat = plantMaterial({ sick: 0, sway: 0.08, shine: 0.2, leafA: '#2a6a35', leafB: '#5fa04a', under: '#86b278', labelFlat: '#5c4fa6' });
    const maizeVar = [0, 1].map((i) => buildMaize(7 + i * 5, 0.55));
    const beanVar = [0, 1].map((i) => buildBean(31 + i * 9, 0.55));
    const mb = maizeVar.map((g) => new PlantBatch(g, 900, maizeMat));
    const bb = beanVar.map((g) => new PlantBatch(g, 1200, beanMat));
    const dx = q >= 0.8 ? 1.5 : 2.4;
    for (let r = 0; r < 9; r++) {
      const zr = 9 + r * 2.6;
      for (let x = -57; x <= 57; x += dx) {
        const xx = x + range(rng, -0.3, 0.3), z = zr + range(rng, -0.25, 0.25);
        if (blocked(xx, z)) continue;
        const y = heightAt(xx, z);
        const vi = Math.floor(rng() * 2);
        const sc = range(rng, 1.1, 1.35);
        mb[vi].add(xx, y, z, rng() * TAU, sc, rng());
        if (rng() < 0.5) this.shadows.add(xx, y, z, 1.2 * sc, 0.8, 2.1 * sc);
      }
    }
    const bx = q >= 0.8 ? 1.4 : 2.2;
    for (let r = 0; r < 10; r++) {
      const zr = 35 + r * 2.0;
      for (let x = -57; x <= 57; x += bx) {
        const xx = x + range(rng, -0.3, 0.3), z = zr + range(rng, -0.2, 0.2);
        if (blocked(xx, z)) continue;
        const y = heightAt(xx, z);
        bb[Math.floor(rng() * 2)].add(xx, y, z, rng() * TAU, range(rng, 1.3, 1.7), rng());
      }
    }
    for (const b of [...mb, ...bb]) this.group.add(b.mesh);
    this.batches.maize = mb; this.batches.beans = bb;
  }

  _props() {
    const rng = mulberry32(5);
    const place = (geo, mat, x, z, yaw = 0, sc = 1, lift = 0) => {
      const b = new PlantBatch(geo, 1, mat);
      const y = heightAt(x, z) + lift;
      b.add(x, y, z, yaw, sc, rng());
      this.group.add(b.mesh);
      return [x, y, z];
    };
    const wallMat = propMaterial({ label: '#6d5db4' });
    const roofMat = propMaterial({ label: '#6d5db4', stripes: 1 });
    void roofMat;
    // house and sheds
    const houseY = heightAt(...SPOTS.house);
    this.spots.house = place(buildHouse(), wallMat, SPOTS.house[0], SPOTS.house[1], 0.25, 1);
    this.spots.dryer = place(buildDryingBeds(), wallMat, SPOTS.dryer[0], SPOTS.dryer[1], 0.25, 1);
    this.spots.coop = place(buildCoop(), wallMat, SPOTS.coop[0], SPOTS.coop[1], -0.2, 1);
    void houseY;
    this.shadows.add(SPOTS.house[0] + 1, heightAt(...SPOTS.house), SPOTS.house[1] + 1, 6.5, 4.6, 3.2);
    this.shadows.add(SPOTS.coop[0] + 1, heightAt(...SPOTS.coop), SPOTS.coop[1] + 1, 9.5, 6.4, 4.2);

    // Noor, standing on a coffee terrace
    const nz = terraceZ(SPOTS.noor[0], 9, 0.72);
    const noorMat = propMaterial({ label: '#f4f1ff' });
    this.spots.noor = place(buildPerson(), noorMat, SPOTS.noor[0], nz, 0.6, 1);

    // shade trees on the terraces
    const treeMat = propMaterial({ label: '#5c4fa6', sway: 0.35 });
    const trees = [[-54, 7], [-33, 10], [33, 8], [51, 11], [22, 12], [-18, 12], [44, 6]];
    const treeGeo = [buildTree(3), buildTree(8)];
    this.spots.trees = [];
    trees.forEach(([x, k], i) => {
      const z = terraceZ(x, k, 0.68);
      if (distToPath(x, z) < 4) return;
      this.spots.trees.push(place(treeGeo[i % 2], treeMat, x, z, rng() * TAU, range(rng, 0.9, 1.15)));
      this.shadows.add(x, heightAt(x, z), z, 8, 5.5, 8);
    });

    // bananas: a grove behind the house and a few shading coffee
    const banMat = plantMaterial({ sick: 0, sway: 0.22, shine: 0.22, leafA: '#2c6a2d', leafB: '#79ad3e', under: '#9bc07a', wood: '#7d9a4a', fruitA: '#8fba4a', fruitC: '#e5cf4a', fruitB: '#e5cf4a', labelFlat: '#8a7cd8' });
    const banGeo = [buildBanana(2), buildBanana(9)];
    const banPts = [[-48, 4], [-45, 9], [-51, 14], [-46, 19], [-35, 3], [50, 38], [52, 44], [-56, 24]];
    banPts.forEach(([x, z], i) => {
      const b = new PlantBatch(banGeo[i % 2], 1, banMat);
      const y = heightAt(x, z);
      b.add(x, y, z, rng() * TAU, range(rng, 0.9, 1.15), rng());
      this.group.add(b.mesh);
      this.shadows.add(x, y, z, 3.2, 2.6, 2.8);
    });
    for (const [x, k] of [[-26, 8], [27, 9], [12, 11], [-8, 13]]) {
      const z = terraceZ(x, k, 0.74);
      const b = new PlantBatch(banGeo[0], 1, banMat);
      const y = heightAt(x, z);
      if (distToPath(x, z) < 3) continue;
      b.add(x, y, z, rng() * TAU, 1, rng());
      this.group.add(b.mesh);
      this.shadows.add(x, y, z, 3.2, 2.6, 2.8);
    }

    // a few rocks along the path
    const rockMat = propMaterial({ label: '#6d5db4' });
    for (const [x, z] of [[20, 38], [-12, 28], [-34, 10], [-30, -10]]) place(buildRocks(Math.floor(x + 50)), rockMat, x, z, rng() * TAU, range(rng, 0.8, 1.3));
    this.group.add(this.shadows.mesh);
  }

  // Clouds only matter in wide shots. Hiding them saves a lot of fill in close views.
  setWide(on) { this.clouds.visible = on; }

  // Where a tag should point.
  anchor(name) {
    const s = this.spots;
    switch (name) {
      case 'house': return new THREE.Vector3(s.house[0], s.house[1] + 3.6, s.house[2]);
      case 'noor': return new THREE.Vector3(s.noor[0], s.noor[1] + 1.9, s.noor[2]);
      case 'coop': return new THREE.Vector3(s.coop[0], s.coop[1] + 4.6, s.coop[2]);
      case 'dryer': return new THREE.Vector3(s.dryer[0], s.dryer[1] + 1.4, s.dryer[2]);
      case 'coffee': return new THREE.Vector3(0, heightAt(0, terraceZ(0, 10, 0.4)) + 3, terraceZ(0, 10, 0.4));
      case 'maize': return new THREE.Vector3(-8, heightAt(-8, 17) + 3.4, 17);
      case 'beans': return new THREE.Vector3(8, heightAt(8, 44) + 1.4, 44);
      default: return new THREE.Vector3();
    }
  }

  setSeverity(i, sev) {
    const s = this.shrubs[i];
    s.sev = sev;
    (s.lod ? this.coffeeLOD.hi : this.coffeeLOD.lo)[s.vi].setSeverity(s.slot, sev);
  }
  flush() { for (const b of this.batches.coffee) b.flush(); }
  shrubPos(i) { const s = this.shrubs[i]; return new THREE.Vector3(s.x, s.y + 1.0, s.z); }
}

export { T };
