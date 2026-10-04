import * as THREE from 'three';
import { BaseScene } from './baseScene.js';
import { COL, matte, studioLights, fitShadow, plinth, RoundedBoxGeometry, edges, loadImage, whenLoaded, drawCover } from './diagram.js';
import { damp, easeOut } from '../core/math.js';
import { fitFrame, boxPts } from '../core/frame.js';

// Noor's phone, and the optional cooperative hub. The screen shows three moments in a loop:
// the camera, a result with a plain next step, and an honest "not sure".
// The model answers one question: does this leaf have rust? Yes, no, or not sure.
// Swahili lines: "Piga picha ya jani" (take a photo of the leaf), "Kutu ya majani" (leaf rust),
// "Sina uhakika" (I am not sure), "Muulize afisa ugani" (ask the extension officer).

const SW = 512, SH = 1040;

const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };

function wrapText(ctx, text, x, y, maxW, lh) {
  const words = text.split(' ');
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, y); line = w; y += lh; } else line = test;
  }
  ctx.fillText(line, x, y);
  return y + lh;
}

// The photos on the screen. They are real pictures, but the screens are a design sketch: no app exists yet.
const SHOTS = { camera: 'field_2', result: 'field_4', notsure: 'bad_glare' };
function photo(ctx, name, x, y, w, h, r) {
  const rec = loadImage(name);
  ctx.save(); rr(ctx, x, y, w, h, r); ctx.clip();
  if (rec.done) drawCover(ctx, rec.img, x, y, w, h); else { ctx.fillStyle = '#dfe5f3'; ctx.fillRect(x, y, w, h); }
  ctx.restore();
}

function drawScreen(ctx, state, t) {
  ctx.clearRect(0, 0, SW, SH);
  ctx.fillStyle = '#f6f7fc'; ctx.fillRect(0, 0, SW, SH);
  // status bar: offline
  ctx.fillStyle = COL.ink; ctx.font = '500 22px "DMMono", monospace'; ctx.textAlign = 'left';
  ctx.fillText('DESIGN SKETCH', 30, 46);
  ctx.textAlign = 'right'; ctx.fillText('OFFLINE', SW - 30, 46); ctx.textAlign = 'left';
  ctx.fillStyle = COL.healthy; ctx.beginPath(); ctx.arc(SW - 150, 38, 8, 0, 6.28); ctx.fill();
  if (state === 'camera') {
    ctx.fillStyle = COL.ink; rr(ctx, 24, 70, SW - 48, 640, 30); ctx.fill();
    photo(ctx, SHOTS.camera, 24, 70, SW - 48, 640, 30);
    // viewfinder
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; const m = 78, L = 54, y0 = 150, y1 = 630;
    for (const [x, y, dx, dy] of [[m, y0, 1, 1], [SW - m, y0, -1, 1], [m, y1, 1, -1], [SW - m, y1, -1, -1]]) { ctx.beginPath(); ctx.moveTo(x, y + dy * L); ctx.lineTo(x, y); ctx.lineTo(x + dx * L, y); ctx.stroke(); }
    ctx.fillStyle = COL.ink; ctx.font = '700 40px "Instrument", sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Piga picha ya jani', SW / 2, 790);
    ctx.fillStyle = COL.slate; ctx.font = '400 28px "Instrument", sans-serif'; ctx.fillText('Take a photo of the leaf', SW / 2, 836);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = COL.ink; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(SW / 2, 940, 52, 0, 6.28); ctx.fill(); ctx.stroke();
    ctx.fillStyle = COL.ink; ctx.beginPath(); ctx.arc(SW / 2, 940, 36 + Math.sin(t * 4) * 1.5, 0, 6.28); ctx.fill();
    ctx.textAlign = 'left';
  } else if (state === 'result') {
    photo(ctx, SHOTS.result, 24, 70, SW - 48, 330, 30);
    ctx.fillStyle = '#fff'; rr(ctx, 24, 380, SW - 48, 620, 30); ctx.fill();
    ctx.fillStyle = COL.ink; ctx.textAlign = 'left';
    ctx.font = '800 60px "Bricolage", sans-serif'; ctx.fillText('Kutu ya majani', 56, 470);
    ctx.fillStyle = COL.slate; ctx.font = '500 30px "Instrument", sans-serif'; ctx.fillText('Leaf rust: yes', 56, 516);
    // confidence
    ctx.fillStyle = COL.slate; ctx.font = '500 22px "DMMono", monospace'; ctx.fillText('HOW SURE', 56, 580);
    ctx.fillStyle = '#e1e6f2'; rr(ctx, 56, 596, SW - 112, 18, 9); ctx.fill();
    ctx.fillStyle = COL.healthy; rr(ctx, 56, 596, (SW - 112) * 0.78, 18, 9); ctx.fill();
    ctx.fillStyle = COL.ink; ctx.font = '600 32px "Instrument", sans-serif';
    ctx.fillText('Angalia majani ya karibu', 56, 690);
    ctx.fillStyle = COL.slate; ctx.font = '400 28px "Instrument", sans-serif';
    wrapText(ctx, 'Check the leaves nearby. Show this photo to your extension officer before you spray.', 56, 732, SW - 112, 38);
    ctx.fillStyle = COL.ink; rr(ctx, 56, 880, 190, 70, 20); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '600 28px "Instrument", sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Sikiliza', 151, 925);
    ctx.fillStyle = '#e1e6f2'; rr(ctx, 266, 880, 190, 70, 20); ctx.fill();
    ctx.fillStyle = COL.ink; ctx.fillText('Hifadhi', 361, 925);
    ctx.textAlign = 'left';
  } else {
    photo(ctx, SHOTS.notsure, 24, 70, SW - 48, 330, 30);
    ctx.fillStyle = '#fff'; rr(ctx, 24, 380, SW - 48, 620, 30); ctx.fill();
    ctx.fillStyle = COL.ink;
    ctx.font = '800 60px "Bricolage", sans-serif'; ctx.fillText('Sina uhakika', 56, 470);
    ctx.fillStyle = COL.slate; ctx.font = '500 30px "Instrument", sans-serif'; ctx.fillText('I am not sure about this one', 56, 516);
    ctx.fillStyle = '#e1e6f2'; rr(ctx, 56, 596, SW - 112, 18, 9); ctx.fill();
    ctx.fillStyle = COL.alarm; rr(ctx, 56, 596, (SW - 112) * 0.28, 18, 9); ctx.fill();
    ctx.fillStyle = COL.ink; ctx.font = '600 32px "Instrument", sans-serif'; ctx.fillText('Muulize afisa ugani', 56, 690);
    ctx.fillStyle = COL.slate; ctx.font = '400 28px "Instrument", sans-serif';
    wrapText(ctx, 'Ask the extension officer. The photo is saved on this phone and can be sent when a signal appears.', 56, 732, SW - 112, 38);
    ctx.fillStyle = COL.ink; rr(ctx, 56, 880, 400, 70, 20); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '600 28px "Instrument", sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Hifadhi picha', 256, 925);
    ctx.textAlign = 'left';
  }
}

export class PhoneScene extends BaseScene {
  build() {
    const g = this.group;
    this.rig = studioLights(g, 90);
    fitShadow(this.rig, 16, 22, 32);
    this.t = 0;
    this.hubOn = false;
    this.states = ['camera', 'result', 'camera', 'notsure'];
    this.si = 0; this.ts = 0;

    const stage = plinth(22, 16, 0.8, '#ffffff', COL.healthy);
    stage.position.set(4, 0, 0);
    g.add(stage);

    // the phone
    const phone = new THREE.Group();
    const body = new THREE.Mesh(new RoundedBoxGeometry(8.6, 17.6, 0.9, 4, 0.8), matte(COL.ink, 0.35));
    body.castShadow = true; phone.add(body);
    this.screenCanvas = document.createElement('canvas'); this.screenCanvas.width = SW; this.screenCanvas.height = SH;
    this.sctx = this.screenCanvas.getContext('2d');
    this.screenTex = new THREE.CanvasTexture(this.screenCanvas);
    this.screenTex.colorSpace = THREE.SRGBColorSpace; this.screenTex.anisotropy = 4;
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(8.0, 16.2), new THREE.MeshBasicMaterial({ map: this.screenTex }));
    screen.position.z = 0.47; phone.add(screen);
    phone.position.set(4, 10.4, 0);
    phone.rotation.y = -0.18;
    g.add(phone);
    this.phone = phone;
    this._draw();
    Object.values(SHOTS).forEach((n) => whenLoaded(n, () => this._draw()));

    // fixed list of answers, circling the phone
    this.chips = new THREE.Group();
    const names = ['Rust', 'No rust', 'Not sure'];
    names.forEach((n, i) => {
      const c = document.createElement('canvas'); c.width = 400; c.height = 112;
      const ctx = c.getContext('2d');
      const last = i === names.length - 1;
      ctx.fillStyle = last ? COL.ink : '#fff'; rr(ctx, 4, 4, 392, 104, 52); ctx.fill();
      ctx.lineWidth = 6; ctx.strokeStyle = last ? COL.ink : COL.fog; ctx.stroke();
      ctx.fillStyle = last ? '#fff' : COL.ink; ctx.font = '600 44px "Instrument", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n, 200, 58);
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.23), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide }));
      m.userData.i = i;
      m.position.set(0, 0, 0);
      this.chips.add(m);
    });
    this.chips.position.set(14.5, 10.4, 1);
    g.add(this.chips);

    // the hub: a laptop at the cooperative, and a second phone
    const hub = new THREE.Group();
    hub.add(plinth(16, 12, 0.8, '#ffffff', COL.ink));
    const base = new THREE.Mesh(new RoundedBoxGeometry(9.4, 0.5, 6.4, 2, 0.2), matte('#cfd5e8', 0.4)); base.position.set(0, 1.3, 1.2); base.castShadow = true; hub.add(base);
    const lid = new THREE.Group();
    const lidBody = new THREE.Mesh(new RoundedBoxGeometry(9.4, 6.2, 0.4, 2, 0.2), matte(COL.ink, 0.4)); lidBody.castShadow = true; lid.add(lidBody);
    const hc = document.createElement('canvas'); hc.width = 768; hc.height = 504;
    const hx = hc.getContext('2d');
    hx.fillStyle = '#f6f7fc'; hx.fillRect(0, 0, 768, 504);
    hx.fillStyle = COL.ink; hx.font = '800 54px "Bricolage", sans-serif'; hx.fillText('Cooperative hub', 40, 84);
    hx.fillStyle = COL.slate; hx.font = '400 28px "Instrument", sans-serif'; hx.fillText('Local Wi-Fi only. No internet.', 40, 126);
    [['Second opinion', 'larger copy of the model'], ['Field photos', 'waiting for review'], ['Next test round', 'new cases to learn from']].forEach(([a, b], i) => {
      hx.fillStyle = '#fff'; rr(hx, 40, 160 + i * 106, 688, 90, 22); hx.fill(); hx.strokeStyle = COL.fog; hx.lineWidth = 3; hx.stroke();
      hx.fillStyle = COL.ink; hx.font = '600 32px "Instrument", sans-serif'; hx.fillText(a, 68, 200 + i * 106);
      hx.fillStyle = COL.slate; hx.font = '400 26px "Instrument", sans-serif'; hx.fillText(b, 68, 234 + i * 106);
    });
    const ht = new THREE.CanvasTexture(hc); ht.colorSpace = THREE.SRGBColorSpace; ht.anisotropy = 4;
    const hscr = new THREE.Mesh(new THREE.PlaneGeometry(8.6, 5.6), new THREE.MeshBasicMaterial({ map: ht })); hscr.position.z = 0.21; lid.add(hscr);
    lid.position.set(0, 4.6, -1.8); lid.rotation.x = -0.18;
    hub.add(lid);
    hub.position.set(30, 0, 2);
    hub.visible = false; this.hub = hub; this.hubK = 0;
    g.add(hub);
    // wifi pulses between phone and hub
    this.pulses = [];
    for (let i = 0; i < 6; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 8), new THREE.MeshBasicMaterial({ color: COL.healthy }));
      p.userData.i = i; this.pulses.push(p); hub.add(p);
    }
    this.link = new THREE.CatmullRomCurve3([new THREE.Vector3(-20, 8, -2), new THREE.Vector3(-12, 12, 0), new THREE.Vector3(-4, 10, 1), new THREE.Vector3(0, 5, 0)]);
    const lineG = new THREE.BufferGeometry().setFromPoints(this.link.getPoints(40));
    const line = new THREE.Line(lineG, new THREE.LineDashedMaterial({ color: COL.healthy, dashSize: 0.5, gapSize: 0.35 }));
    line.computeLineDistances(); hub.add(line);

    this._frames();
    this._tags();
    this.built = true;
  }

  _draw() {
    drawScreen(this.sctx, this.states[this.si], this.t);
    this.screenTex.needsUpdate = true;
  }

  // What must be in the picture for each step. The camera is worked out from the stage (see core/frame.js).
  _frames() {
    const phone = boxPts(4, 10.4, 0, 9.4, 18, 2.4), plinth = boxPts(4, 0.4, 0, 22, 0.8, 16), chips = boxPts(14.5, 10.4, 1, 5, 7, 1);
    this.frames = {
      // the phone is the hero: tall, with the three answers beside it and the labels around it
      'hands-1': { pts: [...phone, ...plinth, ...chips, [-7, 20.5, 0], [24, 18.5, 0], [26, 3, 1]], az: -8, el: 12, fov: 30, pad: [0.04, 0.05], parallax: 0.35 },
      'hands-2': { pts: [...phone, ...plinth, ...boxPts(30, 4, 2, 16, 8, 12), [-7, 20.5, 0], [30, 14, 0], [40, 10, 0]], az: -8, el: 14, fov: 30, pad: [0.04, 0.05], parallax: 0.35 },
    };
  }

  pose(id) { return fitFrame(this.frames[id], this.app.layout.aspect); }

  _tags() {
    const t = this.app.tags;
    const at = (x, y, z) => new THREE.Vector3(x, y, z);
    t.add({ id: 'h-sketch', text: 'Design sketch', sub: 'a mockup, not a working app', anchor: at(4, 19.7, 0.6), side: 'u', len: 14, color: COL.slate });
    t.add({ id: 'h-offline', text: 'Offline', sub: 'no signal, no data bundle', anchor: at(8.4, 17.2, 0.6), side: 'r', len: 22, color: COL.healthy, big: true });
    t.add({ id: 'h-list', text: 'Three answers', sub: 'rust, no rust, or not sure', anchor: at(14.5, 13.9, 1), side: 'r', len: 18, color: COL.ink, big: true });
    t.add({ id: 'h-human', text: 'A person decides', sub: 'it says "not sure" and points to the officer', anchor: at(8.3, 3.2, 1.2), side: 'r', len: 24, color: COL.alarm, big: true });
    t.add({ id: 'h-hub', text: 'Cooperative laptop', sub: 'second opinion over local Wi-Fi', anchor: at(30, 8.4, 0), side: 'u', len: 14, color: COL.ink, big: true });
    t.add({ id: 'h-link', text: 'Local Wi-Fi', sub: 'no internet needed', anchor: at(16, 11.5, 0), side: 'u', len: 14, color: COL.healthy });
  }

  enter(id) {
    const t = this.app.tags;
    this.hubOn = id === 'hands-2';
    if (id === 'hands-1') t.only(['h-sketch', 'h-offline', 'h-list', 'h-human']);
    else t.only(['h-sketch', 'h-hub', 'h-link', 'h-offline']);
    this._modeButtons();
  }

  control(name, el, ev) {
    if (name === 'mode') {
      this.hubOn = ev.mode === 'hub';
      this._modeButtons();
      this.app.tags.only(this.hubOn ? ['h-sketch', 'h-hub', 'h-link', 'h-offline'] : ['h-sketch', 'h-offline', 'h-list', 'h-human']);
      this.app.rig.flyTo(this.pose(this.hubOn ? 'hands-2' : 'hands-1'), 1.4);
    }
  }

  _modeButtons() {
    document.querySelectorAll('[data-ctl="mode"]').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.mode === 'hub') === this.hubOn)));
  }

  update(dt, tt, motion = true) {
    if (motion) { this.t += dt; this.ts += dt; }
    const t = this.t;
    if (this.ts > 3.6) { this.ts = 0; this.si = (this.si + 1) % this.states.length; this._draw(); }
    else if (Math.floor(t * 8) !== this._lastDraw) { this._lastDraw = Math.floor(t * 8); this._draw(); }
    this.phone.position.y = 10.4 + Math.sin(t * 1.2) * 0.25;
    this.phone.rotation.y = -0.18 + Math.sin(t * 0.7) * 0.07;
    // the fixed list of answers: a column beside the phone, drifting gently
    this.chips.children.forEach((m) => {
      const i = m.userData.i;
      m.position.set(Math.sin(t * 0.8 + i) * 0.25, 2.6 - i * 2.6 + Math.sin(t * 1.1 + i * 1.7) * 0.12, 0);
      m.quaternion.copy(this.app.camera.quaternion);
    });
    this.hubK = damp(this.hubK, this.hubOn ? 1 : 0, 4, dt);
    this.hub.visible = this.hubK > 0.02;
    this.hub.scale.setScalar(0.5 + 0.5 * easeOut(this.hubK));
    this.pulses.forEach((p, i) => {
      const u = ((t * 0.35 + i / this.pulses.length) % 1);
      const pt = this.link.getPoint(u);
      p.position.copy(pt);
      p.scale.setScalar(Math.sin(u * Math.PI));
    });
  }
}
