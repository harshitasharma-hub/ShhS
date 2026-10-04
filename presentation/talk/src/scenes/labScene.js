import * as THREE from 'three';
import { BaseScene } from './baseScene.js';
import { COL, GFX, imageTexture } from './diagram.js';
import { IMG } from '../assets/index.js';
import { BEATS } from '../content.js';
import { LEAF, LESIONS, PRESETS, TRAIN, SET1 } from '../labData.js';
import { fitFrame } from '../core/frame.js';
import { damp, clamp, lerp, easeOutBack } from '../core/math.js';
import { LeafSheet, BENDS, bendValue, bendPos, LEAF_L, LEAF_W } from './labLeaf.js';
import { worldTexture, paintSome, LOOKS, BENCH, kelvinColor, sunDirection, sunShare } from './labWorld.js';

// The leaf lab: one real leaf (BRACOL 897) through the six stages that make a labelled render.
//   1 the photo   2 the cut-out and its spots   3 the leaf bent in 3D   4 the field   5 the phone camera   6 the label
//
// The picture is a live preview drawn here. The numbers next to it, and the small pictures, are the real log and the
// real renders of the Blender pipeline (src/labData.js). The preview says so on screen.
//
// Layout: the picture is a 2:1 viewfinder, the shape of the BRACOL photos and of the renders. The canvas is cut to that
// rectangle (layoutFor), and a column beside it holds the numbers and the sliders.

const STEPS = BEATS.filter((b) => b.scene === 'lab').map((b) => b.id);
const INDEX = Object.fromEntries(BEATS.map((b, i) => [b.id, i]));

// Where the cut-out sits on the photo (the leaf spans 75.5% of the frame, from 14.25% across and 23.5% down). Checked by laying one over the other.
const SHARE = 0.755, CUT_X = 0.1425, CUT_Y = 0.235;
const FRAME_W = LEAF_L / SHARE, FRAME_H = FRAME_W / 2;
const AT = new THREE.Vector3((CUT_X + SHARE / 2 - 0.5) * FRAME_W, (0.5 - CUT_Y - LEAF_W / FRAME_H / 2) * FRAME_H, 0);
const SKY_SHADOW = 0.5;     // the share of the sky light that comes straight down and leaves a soft shadow
const GROUND_Z = -8.5;      // how far behind the leaf the ground is
const GROUND_SCALE = 1.7;   // the ground is bigger than the picture, so it never ends inside it

// Where each step wants things. view is the turn of the leaf (yaw, pitch).
const STATE = {
  'leaf-1': { photo: 1, scan: 0, lit: 0, bend: 0, rings: 0, ground: 'bench', stamp: 0, view: [0, 0] },
  'leaf-2': { photo: 0, scan: 1, lit: 0, bend: 0, rings: 1, ground: 'bench', stamp: 0, view: [0, 0] },
  'leaf-3': { photo: 0, scan: 1, lit: 1, bend: 1, rings: 0, ground: 'bench', stamp: 0, view: [-0.46, 0.3] },
  'leaf-4': { photo: 0, scan: 1, lit: 1, bend: 1, rings: 0, ground: 'preset', stamp: 0, view: [-0.4, 0.26] },
  'leaf-5': { photo: 0, scan: 1, lit: 1, bend: 1, rings: 0, ground: 'preset', stamp: 0, view: [-0.4, 0.26] },
  'leaf-6': { photo: 0, scan: 1, lit: 1, bend: 1, rings: 0, ground: 'preset', stamp: 1, view: [-0.4, 0.26] },
};

const PHONE_NAMES = { exposure_gain: 'exposure gain', mood_t: 'colour mood', sat: 'saturation', blur_sigma: 'blur', noise: 'sensor noise', jpeg_q: 'JPEG quality', out_size: 'output size', rescale: 'rescale', motion_px: 'motion blur', veil: 'glare veil' };
const SKY_NAMES = { 'hdri:city': 'city panorama', 'hdri:forest': 'forest panorama', 'hdri:courtyard': 'courtyard panorama', 'hdri:sunrise': 'sunrise panorama', flat: 'flat white', flat_cloud: 'flat cloud' };

const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
const signed = (n) => `${n >= 0 ? '+' : '-'}${Math.abs(n)}`;
const nb = (t) => `<span class="nobr" translate="no">${t}</span>`;
const brand = (t) => t.replace(/(BRACOL|Blender)/g, (m) => nb(m));                  // model and dataset names stay whole in a translated page
const unit = (v) => String(v).replace(/ x /g, ' \u00d7 ').replace(/ /g, '\u00a0');   // a number and its unit stay together, and sizes use the times sign
// how far the leaf may be turned: yaw (around the vertical) and pitch (nodding). It stays in front of the ground.
const YAW = [-0.48, 0.42], PITCH = [-0.3, 0.55];

// a tile of fine noise for the phone grain, made once
function grainTile() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d'), d = x.createImageData(128, 128);
  let s = 12345;
  for (let i = 0; i < d.data.length; i += 4) {
    s = (Math.imul(s, 1664525) + 1013904223) | 0;
    const bell = (((s >>> 8) & 255) + ((s >>> 16) & 255) + ((s >>> 24) & 255)) / 3;        // three draws make a bell shape
    d.data[i] = d.data[i + 1] = d.data[i + 2] = 128 + (bell - 127.5) * 0.5;
    d.data[i + 3] = 255;
  }
  x.putImageData(d, 0, 0);
  return c.toDataURL('image/png');
}

// a thin line of light with a soft glow, for the scan that cuts the leaf out
function scanTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 256, 0);
  g.addColorStop(0, 'rgba(242,85,44,0)'); g.addColorStop(0.36, 'rgba(242,85,44,0.18)'); g.addColorStop(0.47, 'rgba(255,120,70,0.55)');
  g.addColorStop(0.5, 'rgba(255,255,255,1)'); g.addColorStop(0.53, 'rgba(255,120,70,0.55)'); g.addColorStop(0.64, 'rgba(242,85,44,0.18)'); g.addColorStop(1, 'rgba(242,85,44,0)');
  x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  x.globalCompositeOperation = 'destination-in';
  const v = x.createLinearGradient(0, 0, 0, 256);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(0.1, 'rgba(0,0,0,1)'); v.addColorStop(0.9, 'rgba(0,0,0,1)'); v.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = v; x.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class LabScene extends BaseScene {
  constructor(app) {
    super(app);
    this.step = STEPS[0];
    this.si = 0;
    this.preset = PRESETS[0];
    this.phoneOn = true;
    this.sunAz = null;                                           // null: the angle of the scene. A number: what the slider says.
    this.dragged = false;
    this.bendPos = Object.fromEntries(Object.keys(BENDS).map((k) => [k, bendPos(k, BENDS[k].def)]));   // slider positions, 0..1
    this.bendGoal = { ...this.bendPos };                          // where they are heading, when a button moves them
    this.touched = false;                                       // the sliders were moved by hand
    this.v = { photo: 1, lit: 0, bend: 0, rings: 0, phone: 0, stamp: 0, yaw: 0, pitch: 0, scan: 0 };   // what is on screen now
    this.groundKey = null;
    this.mixing = false;
    this.geo = null;
  }

  // ------------------------------------------------------------- build
  build() {
    const g = this.group;

    // the frame of the picture is centred on the origin; the leaf sits where the cut-out sits on the photo
    this.framePts = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, y]) => [x * FRAME_W / 2, y * FRAME_H / 2, 0]);

    // lights: a sun, and the sky. Both stay still while the leaf turns, like a leaf on a turntable.
    this.sun = new THREE.DirectionalLight(0xffffff, 0);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    const sc = this.sun.shadow.camera;
    sc.left = -26; sc.right = 26; sc.top = 20; sc.bottom = -20; sc.near = 5; sc.far = 190;
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.15;
    this.sun.shadow.radius = 4;
    this.hemi = new THREE.HemisphereLight(0xffffff, 0x888888, 0);
    this.hemi.position.set(0, 0, 1);                              // the sky is on the camera side of the leaf
    // Part of the sky light comes straight down, through a small and blurry shadow map. It gives the soft shadow that
    // skylight leaves under a leaf, the one you see in the overcast render, where there is no sun.
    this.skyLight = new THREE.DirectionalLight(0xffffff, 0);
    this.skyLight.position.set(0, 0, 70);
    this.skyLight.castShadow = true;
    this.skyLight.shadow.mapSize.set(256, 256);
    const kc = this.skyLight.shadow.camera;
    kc.left = -26; kc.right = 26; kc.top = 20; kc.bottom = -20; kc.near = 5; kc.far = 120;
    this.skyLight.shadow.bias = -0.0006;
    this.skyLight.shadow.normalBias = 0.25;
    this.skyLight.shadow.radius = 5;
    g.add(this.sun, this.sun.target, this.skyLight, this.skyLight.target, this.hemi);
    this.L = {                                                    // the light now, easing toward the light of the step
      dir: new THREE.Vector3(0, 0, 1), sunColor: new THREE.Color(1, 1, 1), sunI: 0, sky: new THREE.Color(1, 1, 1), gnd: new THREE.Color(0.5, 0.5, 0.5), amb: 0.5, trans: 0.25,
    };
    this._lk = { sunColor: new THREE.Color(), sky: new THREE.Color(), gnd: new THREE.Color(), dir: new THREE.Vector3() };

    // the photo, flat, in front of the ground
    const photoTex = imageTexture('leaf_photo');
    this.photo = new THREE.Mesh(new THREE.PlaneGeometry(FRAME_W * 1.02, FRAME_H * 1.02), new THREE.MeshBasicMaterial({ map: photoTex, transparent: true, depthWrite: false }));
    this.photo.position.z = -0.4;
    this.photo.renderOrder = 2;

    // the ground: soil and blurred leaves, or a sheet of paper. Two pictures can blend while one scene gives way to another.
    this.U = { lit: { value: 0 }, mix: { value: 0 }, map2: { value: null } };
    const first = worldTexture('studio', GFX.aniso);
    this.U.map2.value = first;
    const bd = new THREE.MeshStandardMaterial({ map: first, roughness: 1, metalness: 0 });
    bd.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, { uLit: this.U.lit, uMix: this.U.mix, uMap2: this.U.map2 });
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform float uLit;\nuniform float uMix;\nuniform sampler2D uMap2;')
        .replace('#include <map_fragment>', '#include <map_fragment>\n  diffuseColor.rgb = mix( diffuseColor.rgb, texture2D( uMap2, vMapUv ).rgb, uMix );')
        .replace('#include <opaque_fragment>', '  outgoingLight = mix( diffuseColor.rgb, outgoingLight, uLit );\n  #include <opaque_fragment>');
    };
    bd.customProgramCacheKey = () => 'lab-ground';
    this.ground = new THREE.Mesh(new THREE.PlaneGeometry(FRAME_W * GROUND_SCALE, FRAME_H * GROUND_SCALE), bd);
    this.ground.position.z = GROUND_Z;
    this.ground.receiveShadow = true;
    this.groundMat = bd;
    this.groundKey = 'studio';

    // the leaf, on a pivot so it can be turned
    this.leaf = new LeafSheet();
    this.pivot = new THREE.Group();
    this.pivot.position.copy(AT);
    this.pivot.add(this.leaf.mesh);
    this.leaf.U.lit = this.U.lit;                                 // one lit amount for the leaf and the ground

    // rings around the spots the script found
    this.rings = new THREE.Group();
    this.pivot.add(this.rings);
    this._rings();

    // the scan that cuts the leaf out
    this.scanBar = new THREE.Mesh(new THREE.PlaneGeometry(2.6, FRAME_H * 0.9), new THREE.MeshBasicMaterial({ map: scanTexture(), transparent: true, depthWrite: false, depthTest: false }));
    this.scanBar.position.z = 0.6;
    this.scanBar.renderOrder = 5;
    this.scanBar.visible = false;

    g.add(this.ground, this.photo, this.pivot, this.scanBar);

    this._dom();
    this._tags();
    this._measureCards();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this._measureCards());
    window.__lab = this;
    // compile the shaders now, behind the loading screen, so the first visit does not stall
    try {
      this.group.visible = true;
      this.app.renderer.compile(this.app.scene3d, this.app.camera);
    } catch (err) { /* it compiles on the first frame instead */ }
    this.group.visible = false;
    this.built = true;
  }

  // the rings: orange for the spots, brown for the patch. The sizes follow how much of the leaf each one covers.
  _rings() {
    const brown = LESIONS.brown.slice(0, 1);
    const nearBrown = (l) => brown.some((b) => Math.hypot(l[0] - b[0], l[1] - b[1]) < 0.07);
    const list = [...LESIONS.orange.filter((l) => l[2] > 90 && !nearBrown(l)).slice(0, 6).map((l) => ({ l, kind: 'orange' })), ...brown.map((l) => ({ l, kind: 'brown' }))];
    this.ringList = list.map(({ l, kind }, n) => {
      const pct = clamp(3.6 + Math.sqrt(l[2] / 1575) * 5.5, 5, 10.5);          // the width of the ring, as a share of the leaf length
      const r = (pct / 100) * LEAF_L / 2;
      const grp = new THREE.Group();
      const color = kind === 'brown' ? new THREE.Color(COL.real) : new THREE.Color(COL.alarm);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.84, 1, 56), new THREE.MeshBasicMaterial({ color, transparent: true, depthTest: false }));
      const halo = new THREE.Mesh(new THREE.RingGeometry(1, 1.17, 56), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, depthTest: false }));
      ring.renderOrder = halo.renderOrder = 6;
      ring.material.userData.o = 1; halo.material.userData.o = 0.95;
      grp.add(halo, ring);
      grp.scale.setScalar(0.0001);
      this.leaf.flatPoint(l[0], l[1], grp.position);
      grp.position.z = 0.5;
      this.rings.add(grp);
      return { grp, r, n, kind, t: 0 };
    });
  }

  // ------------------------------------------------------------- the page around the picture
  _dom() {
    const host = document.getElementById('lab');
    host.textContent = '';
    // on the picture: where it comes from, what it is, the phone effects, the stamp
    const view = el('div', 'lab__view');
    this.chip = el('span', 'chip lab__chip');
    this.cap = el('p', 'lab__cap');
    this.fx = el('div', 'lab__fx');
    this.fx.style.setProperty('--grain-img', `url(${grainTile()})`);
    this.stamp = el('div', 'lab__stamp', `<b>Rust</b><span>Severity ${LEAF.labels.severity} · label kept</span>`);
    this.stamp.setAttribute('role', 'img');
    this.stamp.setAttribute('aria-label', `Label kept from the source leaf: rust, severity ${LEAF.labels.severity}`);
    // the last step shows the real picture the pipeline makes: the Blender render of the chosen scene, with the phone effects
    this.out = el('img', 'lab__out');
    this.out.alt = ''; this.out.width = 1024; this.out.height = 512; this.out.decoding = 'async';
    view.append(this.fx, this.out, this.chip, this.cap, this.stamp);
    this.viewEl = view;
    // Turning the leaf is a drag, so the picture also takes the keyboard (Tab to it, then the arrow keys; Home puts it back).
    view.addEventListener('keydown', (e) => {
      if (this.si < 2 || this.si > 4) return;
      const k = 0.08;
      if (e.key === 'ArrowLeft') this.t.yaw = clamp(this.t.yaw - k, YAW[0], YAW[1]);
      else if (e.key === 'ArrowRight') this.t.yaw = clamp(this.t.yaw + k, YAW[0], YAW[1]);
      else if (e.key === 'ArrowUp') this.t.pitch = clamp(this.t.pitch - k, PITCH[0], PITCH[1]);
      else if (e.key === 'ArrowDown') this.t.pitch = clamp(this.t.pitch + k, PITCH[0], PITCH[1]);
      else if (e.key === 'Home') { this.t.yaw = STATE[this.step].view[0]; this.t.pitch = STATE[this.step].view[1]; }
      else return;
      this.dragged = true;
      e.preventDefault();
      e.stopPropagation();                                           // the arrow keys turn the leaf here; they do not change the step
    });
    this.status = el('p', 'sr-only');                            // tells a screen reader what a click changed
    this.status.setAttribute('role', 'status');
    view.append(this.status);

    // beside it: a header, and one body for each step
    const side = el('aside', 'lab__side');
    side.setAttribute('aria-label', 'Numbers for this step');
    this.what = el('div', 'lab__what');
    this.whatKind = el('b', 'lab__kind');
    this.whatSay = el('span', 'lab__say');
    this.what.append(this.whatKind, this.whatSay);
    side.append(this.what);
    this.bodies = {};
    const body = (id, cls = '') => { const b = el('div', `lab__body ${cls}`); b.hidden = true; b.dataset.step = id; side.append(b); this.bodies[id] = b; return b; };
    const dl = () => { const d = el('dl', 'lab__dl'); d.translate = false; return d; };
    this.dls = {};
    for (const id of ['leaf-1', 'leaf-2']) { const b = body(id); this.dls[id] = b.appendChild(dl()); }
    {
      const L = LEAF.labels, sev = L.severity;
      this.bodies['leaf-1'].append(el('div', 'lab__labels', `
        <p class="lab__h">Labels that come with the photo</p>
        <ul class="lab__marks">${[['Rust', L.rust], ['Leaf miner', L.miner], ['Phoma', L.phoma], ['Cercospora', L.cercospora]].map(([n, v]) => `<li class="${v ? 'is-yes' : ''}"><i aria-hidden="true"></i><span>${n}</span><b>${v ? 'yes' : 'no'}</b></li>`).join('')}</ul>
        <div class="lab__ladder" role="img" aria-label="Severity ${sev} of 4"><span>Severity</span>${[1, 2, 3, 4].map((n) => `<i class="${n <= sev ? 'is-on' : ''}"></i>`).join('')}<b>${sev} of 4</b></div>`));
      this.bodies['leaf-2'].append(el('div', 'lab__pair', `
        <figure><div class="lab__thumb"><img src="${IMG.leaf_photo}" alt="The photo, with its paper" width="1600" height="800" decoding="async"></div><figcaption>Photo</figcaption></figure>
        <span class="lab__arrow" aria-hidden="true">&rarr;</span>
        <figure><div class="lab__thumb is-alpha"><img src="${IMG.leaf_cutout}" alt="The leaf on its own, the paper removed" width="1400" height="525" decoding="async"></div><figcaption>Cut-out</figcaption></figure>`));
    }

    // step 3: the sliders
    const b3 = body('leaf-3', 'lab__sliders');
    const band = (k) => `--b0:${((BENDS[k].band[0] - BENDS[k].lo) / (BENDS[k].hi - BENDS[k].lo)) * 100}%;--b1:${((BENDS[k].band[1] - BENDS[k].lo) / (BENDS[k].hi - BENDS[k].lo)) * 100}%`;
    const row = (k, label, extra, value) => `<label class="lab__row"><span class="lab__k">${label}</span><span class="lab__v" data-v="${k}" aria-hidden="true"></span><input class="lab__range" type="range" min="0" max="100" step="1" value="${value}" data-k="${k}" aria-label="${label}"${extra}></label>`;
    b3.innerHTML = `${Object.keys(BENDS).map((k) => row(k, BENDS[k].label, ` style="${band(k)}"`, Math.round(this.bendPos[k] * 100))).join('')}
      <label class="lab__row"><span class="lab__k">Sun angle</span><span class="lab__v" data-v="sun" aria-hidden="true"></span><input class="lab__range lab__range--sun" type="range" min="0" max="359" step="1" value="${BENCH.sun.az}" data-k="sun" aria-label="Sun angle"></label>
      <p class="lab__note"><i class="lab__swatch"></i>The blue band is the range Blender draws from for each render.</p>
      <div class="lab__actions"><button class="btn btn--soft" type="button" data-act="random">Draw at random</button><button class="btn btn--soft" type="button" data-act="reset">Reset</button></div>`;
    this.sliders = [...b3.querySelectorAll('input[data-k]')];
    this.outs = Object.fromEntries([...b3.querySelectorAll('[data-v]')].map((o) => [o.dataset.v, o]));
    this.sliderBy = Object.fromEntries(this.sliders.map((r) => [r.dataset.k, r]));
    side.addEventListener('input', (e) => { const r = e.target.closest('input[data-k]'); if (r) this._slide(r); });
    side.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      if (b.dataset.act === 'random') this._random(); else this._reset();
      if (e.detail > 0) b.blur();                                   // after a mouse click the button must not keep the focus, or the Space key would press it again
    });

    // steps 4 and 5: the real Blender render, with its real numbers
    for (const id of ['leaf-4', 'leaf-5']) {
      const b = body(id);
      const fig = el('figure', 'lab__shot');
      const box = el('div', 'lab__shotimgs');
      const a = el('img'), c = el('img');
      for (const im of [a, c]) { im.width = 1024; im.height = 512; im.decoding = 'async'; im.alt = ''; }
      a.className = 'is-on';
      box.append(a, c);
      const cap = el('figcaption', 'lab__shotcap');
      fig.append(box, cap);
      b.append(fig);
      this.dls[id] = b.appendChild(dl());
      this.bodies[id].shot = { fig, imgs: [a, c], cap, front: 0 };
    }

    // step 6: the three renders of this leaf in set 1
    const b6 = body('leaf-6');
    const fan = el('ul', 'lab__fan');
    fan.setAttribute('aria-label', `The ${TRAIN.length} renders of this leaf in set 1`);
    TRAIN.forEach((t, i) => {
      const li = el('li');
      li.style.setProperty('--i', i);
      const im = el('img');
      const scene = (PRESETS.find((p) => p.key === t.preset) || { name: t.preset }).name.toLowerCase();
      im.src = IMG[t.img]; im.alt = `A render of leaf ${LEAF.id}: ${scene} scene, ${t.mode === 'closeup' ? 'close-up' : 'whole leaf'}`; im.width = t.w; im.height = t.h; im.decoding = 'async';
      li.append(im, el('span', null, `${scene} · ${t.mode === 'closeup' ? 'close-up' : 'whole'}`));
      fan.append(li);
    });
    b6.append(fan);
    b6.append(this._dots());

    host.append(view, side);
    this.side = side;
  }

  // Set 1 as a field of dots, one for each of the 1,353 renders, in the order of the job list (it is sorted by source leaf).
  // The dots of rust leaves are orange. The three renders of this leaf are ringed.
  _dots() {
    const COLS = 54, PITCH = 12, rows = Math.ceil(SET1.n / COLS);
    const c = document.createElement('canvas');
    c.width = COLS * PITCH; c.height = rows * PITCH;
    c.setAttribute('role', 'img');
    c.setAttribute('aria-label', `All ${SET1.n.toLocaleString('en-US')} renders of set 1 as dots. ${SET1.thisLeaf.length} of them, ringed, come from leaf ${LEAF.id}.`);
    const x = c.getContext('2d');
    for (let i = 0; i < SET1.n; i++) {
      x.fillStyle = SET1.rustFlags[i] === '1' ? 'rgba(242, 85, 44, 0.55)' : '#c9d0e6';
      x.beginPath(); x.arc((i % COLS) * PITCH + PITCH / 2, Math.floor(i / COLS) * PITCH + PITCH / 2, 3.4, 0, 6.2832); x.fill();
    }
    for (const i of SET1.thisLeaf) {
      const cx = (i % COLS) * PITCH + PITCH / 2, cy = Math.floor(i / COLS) * PITCH + PITCH / 2;
      x.fillStyle = '#f2552c'; x.beginPath(); x.arc(cx, cy, 4.6, 0, 6.2832); x.fill();
      x.lineWidth = 2.2; x.strokeStyle = '#151834'; x.beginPath(); x.arc(cx, cy, 9, 0, 6.2832); x.stroke();
    }
    const fig = el('figure', 'lab__dots');
    const rust = SET1.rustFlags.split('1').length - 1;
    fig.append(c, el('figcaption', 'lab__dotscap', `<span class="lab__key"><i style="--c:rgba(242,85,44,.55)"></i>${rust} from rust leaves</span><span class="lab__key"><i style="--c:#c9d0e6"></i>${SET1.n - rust} from the others</span><span class="lab__key"><i class="is-ring"></i>${SET1.thisLeaf.length} from leaf ${LEAF.id}</span>`));
    return fig;
  }

  // labels for the spots, shown with the cut-out
  _tags() {
    const t = this.app.tags;
    const at = (u, v) => this.leaf.flatPoint(u, v, new THREE.Vector3()).add(AT);
    t.add({ id: 'lab-orange', text: 'Orange spots', sub: `found: ${LESIONS.orange.length}`, anchor: at(LESIONS.orange[1][0], LESIONS.orange[1][1]), side: 'd', len: 38, color: COL.alarm, big: true });
    t.add({ id: 'lab-brown', text: 'Brown patch', sub: `found: ${LESIONS.brown.length}`, anchor: at(LESIONS.brown[0][0], LESIONS.brown[0][1]), side: 'l', len: 44, color: COL.real, big: true });
  }

  // ------------------------------------------------------------- layout
  // All six cards have the height of the tallest, so the picture above them is the same size on every step.
  _measureCards() {
    const root = document.documentElement.style;
    root.setProperty('--lab-card-h', '0px');
    let m = 0;
    for (const id of STEPS) {
      const c = this.app.panels.els[INDEX[id]].querySelector('.panel__card');
      if (c) m = Math.max(m, c.offsetHeight);
    }
    root.setProperty('--lab-card-h', `${Math.ceil(m)}px`);
  }

  resize() { if (this.built) this._measureCards(); }

  // The picture is 2:1 and as tall as the stage allows. A column for the numbers sits beside it when there is room.
  layoutFor(id, S) {
    const pad = window.innerWidth < 861 ? 16 : 0;                // on a phone the picture keeps a margin, like the cards
    const x0 = S.x + pad, w0 = S.w - 2 * pad;
    const GAP = 18, COL_MIN = clamp(w0 * 0.24, 250, 340), COL_MAX = 470;      // the column is wider on a wider screen
    let vh = S.h, vw = vh * 2, colW = w0 - vw - GAP;
    if (colW < COL_MIN) {
      const vw2 = w0 - GAP - COL_MIN;
      if (vw2 >= 0.62 * Math.min(w0, 2 * S.h)) { vw = vw2; vh = vw / 2; colW = COL_MIN; }
      else { vw = Math.min(w0, 2 * S.h); vh = vw / 2; colW = 0; }
    }
    colW = Math.min(colW, COL_MAX);
    const total = vw + (colW ? GAP + colW : 0);
    const vx = x0 + (w0 - total) / 2, vy = S.y + (S.h - vh) / 2;
    const r = { x: vx, y: vy, w: vw, h: vh };
    this.geo = r;
    const s = document.documentElement.style;
    s.setProperty('--col-x', `${vx + vw + GAP}px`);
    s.setProperty('--col-y', `${vy}px`);
    s.setProperty('--col-w', `${colW}px`);
    s.setProperty('--col-h', `${vh}px`);
    document.getElementById('lab').classList.toggle('no-col', !colW);
    return r;
  }

  pose(id) {
    const early = id === 'leaf-1' || id === 'leaf-2';
    return fitFrame({ pts: this.framePts, az: 0, el: 0, fov: 28, pad: [-0.012, -0.012], parallax: early ? 0 : 0.3, drift: early ? 0 : 0.3 }, this.app.layout.aspect);
  }

  // ------------------------------------------------------------- life
  enter(id, prevId) {
    const fromOutside = !STEPS.includes(prevId);
    this.step = id;
    this.si = STEPS.indexOf(id);
    const cv = this.app.canvas;
    cv.classList.add('is-view');
    cv.setAttribute('data-drag', '');
    this._bindDrag(true);
    // each step has its own turn of the leaf, unless the person has turned it by hand
    const st = STATE[id];
    if (!this.t || !this.dragged || this.si < 2) this.t = { yaw: st.view[0], pitch: st.view[1] };
    if (id === 'leaf-5' && !this.seen5) { this.seen5 = true; this.phoneOn = true; }
    if (fromOutside) this._snap(); else if (this.app.reduced) this._snap();
    this._ui();
    this._warm();
    this._tagsOn = null;
    this.app.tags.only([]);
  }

  leave() {
    const cv = this.app.canvas;
    cv.classList.remove('is-view', 'is-orbit', 'is-drag');
    cv.removeAttribute('data-drag');
    cv.style.filter = '';
    document.documentElement.classList.remove('is-turning');
    this.app.renderer.setScissorTest(false);
    this._pp = -1; this._pl = -1;
    this._bindDrag(false);
    this.app.tags.only([]);
  }

  // jump to the state of this step, with no easing
  _snap() {
    const T = this._targets();
    Object.assign(this.v, { photo: T.photo, lit: T.lit, bend: T.bend, rings: T.rings, phone: T.phone, stamp: T.stamp, yaw: T.yaw, pitch: T.pitch, scan: T.scan });
    this.ringList.forEach((r) => { r.t = T.rings ? 1 : 0; });
    this._lightNow = true;
  }

  // Lite mode (key Q): the soft sky shadow goes, the sun shadow stays
  setLite(on) {
    if (this.skyLight) this.skyLight.castShadow = !on;
  }

  // Paint the other scenes a little at a time, between frames, so a click on a scene is instant and nothing stalls.
  _warm() {
    if (this._warmed) return;
    this._warmed = true;
    this.warmKeys = PRESETS.map((p) => p.key).filter((k) => k !== 'studio');
  }

  _targets() {
    const st = STATE[this.step];
    const T = { photo: st.photo, scan: st.scan, lit: st.lit, bend: st.bend, rings: st.rings, stamp: st.stamp, yaw: this.t ? this.t.yaw : st.view[0], pitch: this.t ? this.t.pitch : st.view[1] };
    T.phone = this.si >= 4 && this.phoneOn ? 1 : 0;
    return T;
  }

  update(dt, time, motion) {
    if (!this.built) return;
    const V = this.v, snap = this.app.reduced;
    const T = this._targets();
    const e = (rate) => (snap ? 1 : 1 - Math.exp(-rate * dt));

    // the scan runs at a steady pace; the photo stays until the cut-out is complete
    const gap = T.scan - V.scan, pace = dt * (gap > 0 ? 0.62 : 1.5);
    V.scan = snap || Math.abs(gap) <= pace ? T.scan : V.scan + Math.sign(gap) * pace;
    if (this.step === 'leaf-2') { T.photo = V.scan < 0.999 ? 1 : 0; T.rings = V.scan >= 0.999 && V.photo < 0.55 ? 1 : 0; }

    V.photo += (T.photo - V.photo) * e(7);
    V.lit += (T.lit - V.lit) * e(2.2);
    V.bend += (T.bend - V.bend) * e(2.4);
    V.phone += (T.phone - V.phone) * e(3);
    V.stamp = T.stamp;
    V.yaw += (T.yaw - V.yaw) * e(4);
    V.pitch += (T.pitch - V.pitch) * e(4);

    // photo, scan bar, ground, leaf
    this.photo.material.opacity = V.photo;
    this.photo.visible = V.photo > 0.003;
    this.leaf.U.scan.value = V.scan;
    this.scanBar.visible = V.scan > 0.002 && V.scan < 0.998;
    this.scanBar.position.x = AT.x + (V.scan - 0.5) * LEAF_L;
    this.U.lit.value = V.lit;
    // the leaf drifts a little when nothing else moves, so the 3D shows without a touch (not when paused, or when motion is turned down)
    const sway = motion && this.si >= 2 && this.si <= 4 && !this.drag ? 1 : 0;
    this.swayK = (this.swayK || 0) + (sway - (this.swayK || 0)) * e(2);
    this.pivot.rotation.set(V.pitch + Math.sin(time * 0.37 + 1) * 0.02 * this.swayK, V.yaw + Math.sin(time * 0.5) * 0.035 * this.swayK, 0, 'YXZ');

    // the sliders glide to where a button sent them; the leaf follows the sliders
    for (const k of Object.keys(BENDS)) {
      const d = this.bendGoal[k] - this.bendPos[k];
      if (d !== 0) {
        this.bendPos[k] = snap || Math.abs(d) < 0.002 ? this.bendGoal[k] : this.bendPos[k] + d * e(6);
        this._bendDirty = true;
        const sl = this.sliders.find((x) => x.dataset.k === k);
        if (sl) sl.value = String(Math.round(this.bendPos[k] * 100));
        this._slideOutBend(k);
      }
    }
    const kb = easeBend(V.bend);
    if (kb !== this._kb || this._bendDirty) {
      this._kb = kb; this._bendDirty = false;
      const P = {};
      for (const k of Object.keys(BENDS)) P[k] = bendValue(k, this.bendPos[k]);
      this.leaf.setBend(P, kb);
    }

    // rings pop in one after the other
    for (const r of this.ringList) {
      const want = V.scan >= 0.999 && T.rings ? 1 : 0;
      r.t = clamp(r.t + (want ? dt : -dt * 3), 0, 2);
      const k = clamp((r.t - r.n * 0.09) / 0.5, 0, 1);
      r.grp.scale.setScalar(Math.max(0.0001, r.r * (k < 1 ? easeOutBack(k) : 1)));
      r.grp.visible = k > 0.001;
      r.grp.children.forEach((c) => { c.material.opacity = clamp(k * 1.5, 0, 1) * c.material.userData.o; });
    }

    // the labels for the spots come with the rings
    const tagsOn = this.step === 'leaf-2' && this.ringList[0].t > 0.4 && T.rings === 1;
    if (tagsOn !== this._tagsOn) { this._tagsOn = tagsOn; this.app.tags.only(tagsOn ? ['lab-orange', 'lab-brown'] : []); }

    // a few milliseconds a frame go to painting the scenes that are not painted yet
    if (this.warmKeys && this.warmKeys.length && paintSome(this.warmKeys[0], 3)) this.warmKeys.shift();

    // draw only inside the picture: the canvas is cut to it anyway, so the rest would be work nobody sees
    // (the whole buffer is cleared first, so nothing from an earlier frame or scene stays outside the picture)
    const r = this.app.renderer, st = this.app.rig.stage;
    r.setScissorTest(false);
    r.clear(true, true, true);
    r.setScissorTest(true);
    r.setScissor(Math.floor(st.x) - 2, Math.floor(window.innerHeight - st.y - st.h) - 2, Math.ceil(st.w) + 4, Math.ceil(st.h) + 4);

    const look = this._look();
    this._moveLight(look, dt, snap);
    this._moveGround(look, dt);
    this._phone();
  }

  // ------------------------------------------------------------- light and ground
  // what the light should be, from the scene or the bench, and the sun slider
  _look() {
    if (STATE[this.step].ground === 'bench') {
      const b = BENCH;
      return { world: b.world, ...b.look, sun: { ...b.sun, az: this.sunAz != null ? this.sunAz : b.sun.az } };
    }
    const m = this.preset.meta, L = LOOKS[this.preset.key];
    const sun = m.sun_el != null ? { el: m.sun_el, az: this.sunAz != null ? this.sunAz : m.sun_az, kelvin: m.kelvin, energy: m.sun_energy } : null;
    return { world: this.preset.key, ...L, sun };
  }

  _moveLight(look, dt, snap) {
    const Lc = this.L, k = this._lk;
    const t = snap || this._lightNow ? 1 : 1 - Math.exp(-4 * dt);
    this._lightNow = false;
    if (look.sun) {
      sunDirection(look.sun.el, look.sun.az, k.dir);
      kelvinColor(look.sun.kelvin, k.sunColor);
    } else { k.dir.copy(Lc.dir); k.sunColor.copy(Lc.sunColor); }
    const sunI = look.sun ? sunShare(look.sun.energy) * (look.sunMul || 1) * Math.PI : 0;
    Lc.dir.lerp(k.dir, t).normalize();
    Lc.sunColor.lerp(k.sunColor, t);
    Lc.sunI += (sunI - Lc.sunI) * t;
    k.sky.set(look.sky); k.gnd.set(look.gnd);
    Lc.sky.lerp(k.sky, t); Lc.gnd.lerp(k.gnd, t);
    // the sky gives what the sun leaves of the brightness this scene asks for
    const lumSky = 0.2126 * k.sky.r + 0.7152 * k.sky.g + 0.0722 * k.sky.b;
    const sunMul = look.sunMul || 1;
    const sunOnGround = look.sun ? sunShare(look.sun.energy) * sunMul * Math.sin((look.sun.el * Math.PI) / 180) : 0;
    const amb = Math.max(0.05, (look.illum - sunOnGround) / Math.max(0.2, lumSky));
    Lc.amb += (amb - Lc.amb) * t;
    Lc.trans += (look.trans - Lc.trans) * t;
    this.sun.position.copy(Lc.dir).multiplyScalar(70);
    this.sun.intensity = Lc.sunI;
    this.sun.color.copy(Lc.sunColor);
    this.hemi.color.copy(Lc.sky); this.hemi.groundColor.copy(Lc.gnd);
    this.hemi.intensity = Lc.amb * Math.PI * (1 - SKY_SHADOW);
    this.skyLight.color.copy(Lc.sky);
    this.skyLight.intensity = Lc.amb * Math.PI * SKY_SHADOW;
    this.leaf.U.trans.value = Lc.trans;
    if (this._wetKey !== look.world) {
      this._wetKey = look.world;
      const L = LOOKS[look.world] || look;
      this.leaf.setWet(L.wet || 0, L.drops || 0, L.rough ?? 0.5);
    }
  }

  // the ground blends from one scene to the next
  _moveGround(look, dt) {
    const want = look.world;
    if (want !== this.groundKey) {
      if (this.mixing) this._finishMix();
      this.U.map2.value = worldTexture(want, GFX.aniso);
      this.U.mix.value = 0;
      this.mixing = true;
      this.pending = this.U.map2.value;
      this.groundKey = want;
    }
    if (this.mixing) {
      this.U.mix.value = this.app.reduced ? 1 : damp(this.U.mix.value, 1, 7, dt);
      if (this.U.mix.value > 0.995) this._finishMix();
    }
  }
  _finishMix() {
    this.groundMat.map = this.pending;
    this.U.mix.value = 0;
    this.mixing = false;
  }

  // the phone camera, as a filter on the picture and a layer of grain and vignette on top
  _phone() {
    const p = this.v.phone, lit = this.v.lit;
    if (Math.abs(p - (this._pp ?? -1)) < 0.004 && Math.abs(lit - (this._pl ?? -1)) < 0.004 && this._ppKey === this.preset.key) return;
    this._pp = p; this._pl = lit; this._ppKey = this.preset.key;
    const ph = this.preset.meta.phone || {};
    // Blender's view transform pulls colours a little toward grey. The lit leaf gets the same, the plain photo does not.
    const sat = lerp(1, ph.sat ?? 1, p) * (1 - 0.14 * lit), bri = lerp(1, clamp(1 + ((ph.exposure_gain ?? 1) - 1) * 0.2, 0.85, 1.4), p);
    const blur = ((ph.blur_sigma ?? 0.5) * 0.6 + (ph.motion_px ? ph.motion_px * 0.05 : 0)) * p;
    this.app.canvas.style.filter = p > 0.004 || lit > 0.004 ? `saturate(${sat.toFixed(3)}) brightness(${bri.toFixed(3)}) contrast(${lerp(1, 1.07, p).toFixed(3)}) blur(${blur.toFixed(2)}px)` : '';
    this.fx.style.opacity = p.toFixed(3);
    this.fx.style.setProperty('--grain', clamp((ph.noise ?? 0.004) * 30, 0.12, 0.42).toFixed(3));
  }

  // ------------------------------------------------------------- the step on screen
  _ui() {
    const id = this.step, i = this.si;
    const kinds = [['REAL', 'BRACOL leaf 897, photographed on plain paper'], ['CUT-OUT', 'Real texture, no paper'], ['3D SHEET', 'A browser preview of the Blender step'],
      ['RENDER', `${this.preset.name} scene, made in Blender`], this.phoneOn ? ['RENDER + PHONE', 'The same render, phone effects added'] : ['RENDER', 'The raw render, before the phone effects'], ['LABEL', `Inherited from leaf ${LEAF.id}`]];
    this.whatKind.textContent = kinds[i][0];
    this.whatSay.innerHTML = brand(kinds[i][1]);
    this.what.classList.toggle('is-render', i >= 2);
    for (const [k, b] of Object.entries(this.bodies)) b.hidden = k !== id;
    // where the picture comes from, as the brief asks for every synthetic image
    this.chip.className = `chip lab__chip ${i < 2 ? 'chip--real' : 'chip--sim'}`;
    this.chip.textContent = i === 0 ? 'Real photo' : i === 1 ? 'Real leaf, cut out' : i === 5 ? 'Synthetic · render with phone effects' : 'Synthetic · browser preview';
    this._caption();
    this._rows();
    this._chips();
    this._shot();
    this._slideOut();
    this.stamp.classList.toggle('is-in', id === 'leaf-6');
    this.out.classList.toggle('is-on', i === 5);
    if (i === 5) this.out.src = IMG[this.preset.phone];
    const turn = ' Use the arrow keys to turn the leaf.';
    this.viewEl.setAttribute('aria-label', ['The real photo of the leaf', 'The leaf cut out of the photo, with its spots ringed', `The leaf as a 3D sheet you can bend.${turn}`, `The leaf in the ${this.preset.name.toLowerCase()} scene.${turn}`, `The leaf with phone effects ${this.phoneOn ? 'on' : 'off'}.${turn}`, `The labelled render, as it goes into the training set: rust, severity ${LEAF.labels.severity}.`][i]);
    if (i >= 2 && i <= 4) {                                                    // a picture you can turn is a small application, a picture you cannot is an image
      this.viewEl.setAttribute('role', 'application');
      this.viewEl.setAttribute('aria-roledescription', '3D view');
      this.viewEl.tabIndex = 0;
    } else {
      this.viewEl.setAttribute('role', 'img');
      this.viewEl.removeAttribute('aria-roledescription');
      this.viewEl.removeAttribute('tabindex');
    }
    this.app.canvas.classList.toggle('is-orbit', i >= 2 && i <= 4);
  }

  _caption() {
    const i = this.si, p = this.preset;
    this.cap.innerHTML = brand([`BRACOL ${LEAF.id} · 2048 \u00d7 1024 px`, `Texture ${LEAF.textureW} \u00d7 ${LEAF.textureH} px`, 'Drag the leaf to turn it', `${p.name} · browser preview`, `${this.phoneOn ? 'Phone effects on' : 'Raw render'} · browser preview`, `Label: rust, severity ${LEAF.labels.severity}`][i]);
  }

  _rows() {
    const m = this.preset.meta, L = LEAF.labels;
    const R = {
      'leaf-1': [['source', `BRACOL #${LEAF.id}`], ['split', 'train'], ['photo', '2048 x 1024 px']],
      'leaf-2': [['texture', `${LEAF.textureW} x ${LEAF.textureH} px`], ['orange spots found', LESIONS.orange.length], ['brown patches found', LESIONS.brown.length], ['mask check', 'passed']],
    };
    const real = [['light', m.light]];
    if (m.sky) real.push(['sky', SKY_NAMES[m.sky] || m.sky]);
    if (m.sun_el != null) real.push(['sun height', `${m.sun_el} deg`], ['sun angle', `${m.sun_az} deg`], ['warmth', `${m.kelvin} K`]);
    real.push(['exposure', `${signed(m.exposure_ev)} EV`], ['lens', `${m.lens_mm} mm f/${m.fstop}`], ['camera tilt', `${m.cam_tilt_deg} deg`], ['leaf length', `${m.leaf_len_m} m`], ['render time', `${m.render_s} s`], ['seed', m.seed]);
    R['leaf-4'] = real;
    const ph = m.phone || {};
    R['leaf-5'] = Object.entries(ph).filter(([, v]) => v != null && typeof v !== 'object').map(([k, v]) => [PHONE_NAMES[k] || k, k === 'motion_px' ? `${v} px` : v]);
    for (const [id, dl] of Object.entries(this.dls)) {
      dl.textContent = '';
      (R[id] || []).forEach(([k, v]) => { dl.append(el('dt', null, k), el('dd', null, unit(v))); });
    }
  }

  _chips() {
    document.querySelectorAll('[data-ctl="env"]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.key === this.preset.key)));
    document.querySelectorAll('[data-ctl="look"]').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.look === 'phone') === this.phoneOn)));
  }

  // the small real render beside the preview (steps 4 and 5)
  _shot() {
    for (const id of ['leaf-4', 'leaf-5']) {
      const s = this.bodies[id].shot;
      const phone = id === 'leaf-5' && this.phoneOn;
      const src = IMG[phone ? this.preset.phone : this.preset.raw];
      const front = s.imgs[s.front];
      const alt = `A real Blender render of leaf ${LEAF.id}: ${this.preset.name.toLowerCase()} scene${phone ? ', with phone effects' : ''}`;
      s.cap.innerHTML = `<span class="chip chip--sim"><i style="--c:#fff" aria-hidden="true"></i>Synthetic</span><span>Real ${nb('Blender')} render · ${this.preset.name.toLowerCase()}${phone ? ' · phone photo' : id === 'leaf-5' ? ' · raw' : ''}</span>`;
      if (front.getAttribute('src') === src) { front.alt = alt; continue; }
      const back = s.imgs[1 - s.front];
      back.alt = alt;
      back.onload = () => {
        back.onload = null;
        back.classList.add('is-on'); front.classList.remove('is-on'); front.alt = '';
        s.front = 1 - s.front;
      };
      back.src = src;
      if (back.complete && back.naturalWidth) back.onload && back.onload();
    }
  }

  // ------------------------------------------------------------- controls
  control(name, elm) {
    if (name === 'env') this._setPreset(elm.dataset.key);
    else if (name === 'look') { this.phoneOn = elm.dataset.look === 'phone'; this._ui(); this.status.textContent = this.phoneOn ? 'Phone effects on.' : 'Raw render.'; }
  }

  _setPreset(key) {
    const p = PRESETS.find((x) => x.key === key);
    if (!p) return;
    this._applyPreset(p);
    this.sunAz = null;                                             // each scene brings its own sun angle
    this._ui();
    this._slideOut();
    this.status.textContent = `${p.name} scene. ${this.si === 3 ? 'The numbers show the real log of one Blender render of it.' : ''}`;
  }

  _applyPreset(p) { this.preset = p; this._ppKey = null; }

  _slide(r) {
    const k = r.dataset.k;
    if (k === 'sun') { this.sunAz = Number(r.value); }
    else { this.bendPos[k] = this.bendGoal[k] = Number(r.value) / 100; this._bendDirty = true; this.touched = true; }
    this._slideOut();
  }

  // what Blender does for every render: draw each value at random from its range (and the sun from the whole circle)
  _random() {
    for (const k of Object.keys(BENDS)) {
      const b = BENDS[k], lo = (b.band[0] - b.lo) / (b.hi - b.lo), hi = (b.band[1] - b.lo) / (b.hi - b.lo);
      this.bendGoal[k] = lo + Math.random() * (hi - lo);
    }
    this.sunAz = Math.round(Math.random() * 359);
    this.touched = true;
    this._slideOut();
  }
  _reset() {
    for (const k of Object.keys(BENDS)) this.bendGoal[k] = bendPos(k, BENDS[k].def);
    this.sunAz = null;
    this.touched = false;
    this._slideOut();
  }

  // the numbers next to the sliders
  _slideOutBend(k) {
    const v = bendValue(k, this.bendPos[k]);
    const text = `${v >= 0 ? '' : '-'}${Math.round(Math.abs(v) * 100)}%`;
    this.outs[k].textContent = text;
    this.sliderBy[k].setAttribute('aria-valuetext', text);
  }
  _slideOut() {
    for (const k of Object.keys(BENDS)) this._slideOutBend(k);
    const az = this.sunAz != null ? this.sunAz : BENCH.sun.az;
    this.outs.sun.textContent = `${Math.round(az)}\u00a0deg`;
    this.sliderBy.sun.setAttribute('aria-valuetext', `${Math.round(az)} degrees`);
    const sunSlider = this.sliders.find((s) => s.dataset.k === 'sun');
    if (sunSlider && Number(sunSlider.value) !== Math.round(az)) sunSlider.value = String(Math.round(az));
  }

  // turn the leaf with the mouse or a finger
  _bindDrag(on) {
    const cv = this.app.canvas;
    if (!this._drag) {
      this._drag = {
        down: (e) => {
          if (this.si < 2 || this.si > 4) return;
          this.drag = { x: e.clientX, y: e.clientY, yaw: this.t.yaw, pitch: this.t.pitch };
          try { cv.setPointerCapture(e.pointerId); } catch (err) { /* the pointer is gone */ }
          cv.classList.add('is-drag');
          document.documentElement.classList.add('is-turning');           // no text gets selected while the leaf turns
        },
        move: (e) => {
          if (!this.drag) return;
          this.t.yaw = clamp(this.drag.yaw + (e.clientX - this.drag.x) * 0.006, YAW[0], YAW[1]);
          this.t.pitch = clamp(this.drag.pitch + (e.clientY - this.drag.y) * 0.005, PITCH[0], PITCH[1]);
          this.dragged = true;
        },
        up: (e) => {
          this.drag = null;
          cv.classList.remove('is-drag');
          document.documentElement.classList.remove('is-turning');
          try { cv.releasePointerCapture(e.pointerId); } catch (err) { /* already released */ }
        },
      };
    }
    const d = this._drag, f = on ? 'addEventListener' : 'removeEventListener';
    cv[f]('pointerdown', d.down); cv[f]('pointermove', d.move); cv[f]('pointerup', d.up); cv[f]('pointercancel', d.up);
  }
}

// the bend eases in, so the leaf seems to come alive
function easeBend(t) { return t * t * (3 - 2 * t); }
