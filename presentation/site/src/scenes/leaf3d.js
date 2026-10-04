// A live 3D leaf: the real BRACOL cut-out, bent with the same four controls the Blender pipeline uses
// (fold, droop, twist, wavy edges). This is a preview in the browser. Blender makes the real renders.
// setEnv() changes the light to suit the chosen background. It is a rough match, not a copy of the Blender light.
import * as THREE from 'three';
import { CUTOUT_TEX } from '../data/inline.js';

const ASPECT = 2.668;      // width over height of the cut-out frame (897)
const LENGTH = 1;
const WIDTH = LENGTH / ASPECT;
const FLAT_SHARE = 0.755;  // the flat leaf spans this share of the frame, so it matches the 2D cut-out
const FRAME_SHARE_OF_CANVAS = 1 / 1.3;

// Light for each background: sky colour, ground colour, sky strength, sun colour, sun strength, rim strength, exposure, sun height, sun turned behind the leaf?
const ENV_LIGHT = {
  overcast: { sky: 0xdfe6ea, ground: 0x4b5a3d, hemi: 1.5, sunCol: 0xe8eef2, sun: 0.7, rim: 0.5, exp: 1.05, elev: 2.6, back: false },
  sun: { sky: 0xcfe3ff, ground: 0x5c6f35, hemi: 1.0, sunCol: 0xfff3d6, sun: 3.2, rim: 0.7, exp: 1.1, elev: 2.4, back: false },
  golden: { sky: 0xffd9a8, ground: 0x5b5a2a, hemi: 0.9, sunCol: 0xffb765, sun: 3.0, rim: 0.9, exp: 1.1, elev: 0.9, back: false, glow: 0.1 },
  shade: { sky: 0x9fb8ad, ground: 0x2b3a2e, hemi: 1.1, sunCol: 0xcfe0d6, sun: 0.35, rim: 0.3, exp: 0.95, elev: 2.6, back: false },
  backlit: { sky: 0xfff0c8, ground: 0x44602f, hemi: 0.9, sunCol: 0xfff0c0, sun: 3.4, rim: 1.1, exp: 1.05, elev: 1.8, back: true, glow: 0.55 },
  rain: { sky: 0xa8b4ba, ground: 0x36473a, hemi: 1.25, sunCol: 0xcdd8de, sun: 0.4, rim: 0.4, exp: 0.95, elev: 2.6, back: false },
  sun_wet: { sky: 0xc9def0, ground: 0x4a6a35, hemi: 1.1, sunCol: 0xfff0d0, sun: 2.8, rim: 0.7, exp: 1.1, elev: 2.2, back: false },
  studio: { sky: 0xffffff, ground: 0xdcdcd4, hemi: 1.6, sunCol: 0xffffff, sun: 1.6, rim: 0.8, exp: 1.0, elev: 2.4, back: false },
};
const NO_ENV = { sky: 0xdfeeff, ground: 0x23362c, hemi: 1.15, sunCol: 0xfff0d0, sun: 2.6, rim: 1.5, exp: 1.1, elev: 2.4, back: false };

export function createLeaf(canvas) {
  if (!CUTOUT_TEX) return null;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { return null; }
  if (!renderer.getContext()) return null;
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const fog = new THREE.Fog(0x06201e, 2.6, 6.2);
  scene.fog = fog;
  const camera = new THREE.PerspectiveCamera(30, 1.6, 0.1, 40);

  const geo = new THREE.PlaneGeometry(LENGTH, WIDTH, 110, 44);
  const base = Float32Array.from(geo.attributes.position.array);
  const tex = new THREE.TextureLoader().load(CUTOUT_TEX, () => { dirty = true; });
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const mat = new THREE.MeshStandardMaterial({ map: tex, bumpMap: tex, bumpScale: 1.4, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.48, metalness: 0 });
  // A little of the picture glows through, so a leaf with the sun behind it is not a black shape
  mat.emissiveMap = tex;
  mat.emissive = new THREE.Color(0xffffff);
  mat.emissiveIntensity = 0;
  const leaf = new THREE.Mesh(geo, mat);
  scene.add(leaf);

  const hemi = new THREE.HemisphereLight(0xdfeeff, 0x23362c, 1.15);
  const sun = new THREE.DirectionalLight(0xfff0d0, 2.6);
  const rim = new THREE.DirectionalLight(0x4a6bff, 1.5);
  rim.position.set(-2.2, 1.4, -2.4);
  scene.add(hemi, sun, rim);

  const grid = new THREE.GridHelper(7, 28, 0x6f8fff, 0x14504a);
  grid.position.y = -0.52;
  grid.material.transparent = true;
  grid.material.opacity = 0.42;
  scene.add(grid);

  const P = { fold: 0, droop: 0, twist: 0, wave: 0, sun: 0.4 };
  let E = NO_ENV;
  const cam = { yaw: 0, pitch: 0, userYaw: 0, userPitch: 0, zoom: 1, dist: 2.1 };
  let dirty = true;
  let w = 0, h = 0;

  function bend() {
    const pos = geo.attributes.position;
    const a = P.fold * 0.6;
    const ca = Math.cos(a), sa = Math.sin(a);
    for (let i = 0; i < pos.count; i++) {
      const ox = base[i * 3], oy = base[i * 3 + 1];
      const u = ox / LENGTH + 0.5;                     // 0 at the base, 1 at the tip
      const v = oy / (WIDTH / 2);                      // -1 to 1 across the leaf
      let y = oy * ca;
      let z = Math.abs(oy) * sa;                       // fold along the midrib
      z += P.wave * 0.05 * Math.sin(u * Math.PI * 12 + 0.6) * Math.pow(Math.abs(v), 1.6);   // wavy edges
      const phi = P.twist * 0.8 * (u - 0.35);          // twist along the length
      const y2 = y * Math.cos(phi) - z * Math.sin(phi);
      const z2 = y * Math.sin(phi) + z * Math.cos(phi);
      const th = P.droop * 0.85 * Math.pow(u, 1.8);    // droop toward the tip
      const bx = ox + LENGTH / 2;
      pos.setXYZ(i, bx * Math.cos(th) - z2 * Math.sin(th) - LENGTH / 2, y2, -bx * Math.sin(th) + z2 * Math.cos(th));
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  function aimSun() {
    const az = P.sun * Math.PI * 2 - 1.2 + (E.back ? Math.PI : 0);
    sun.position.set(Math.cos(az) * 3, E.elev, Math.sin(az) * 3);
  }

  function applyEnv() {
    hemi.color.setHex(E.sky); hemi.groundColor.setHex(E.ground); hemi.intensity = E.hemi;
    sun.color.setHex(E.sunCol); sun.intensity = E.sun;
    rim.intensity = E.rim;
    mat.emissiveIntensity = E.glow || 0;
    renderer.toneMappingExposure = E.exp;
    aimSun();
    dirty = true;
  }

  function placeCamera() {
    const yaw = cam.yaw + cam.userYaw, pitch = cam.pitch + cam.userPitch, r = cam.dist * cam.zoom;
    camera.position.set(Math.sin(yaw) * Math.cos(pitch) * r, Math.sin(pitch) * r + 0.0, Math.cos(yaw) * Math.cos(pitch) * r);
    camera.lookAt(0, -0.08, 0);
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const nw = Math.round(r.width), nh = Math.round(r.height);
    if (nw === w && nh === h) return;
    w = nw; h = nh;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const fov = THREE.MathUtils.degToRad(camera.fov);
    // distance at which the flat leaf spans FLAT_SHARE of the frame
    cam.dist = (LENGTH / (FLAT_SHARE * FRAME_SHARE_OF_CANVAS)) / (2 * Math.tan(fov / 2) * camera.aspect);
    camera.updateProjectionMatrix();
    dirty = true;
  }
  new ResizeObserver(resize).observe(canvas);

  // Drag to orbit
  let drag = null;
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, uy: cam.userYaw, up: cam.userPitch }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    cam.userYaw = Math.max(-1.1, Math.min(1.1, drag.uy + (e.clientX - drag.x) * 0.006));
    cam.userPitch = Math.max(-0.5, Math.min(0.9, drag.up + (e.clientY - drag.y) * 0.005));
    dirty = true;
  });
  const end = () => { drag = null; };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  // Arrow keys turn the leaf too, so the drag has a keyboard twin
  canvas.addEventListener('keydown', (e) => {
    const k = { ArrowLeft: [-0.12, 0], ArrowRight: [0.12, 0], ArrowUp: [0, -0.08], ArrowDown: [0, 0.08] }[e.key];
    if (!k) return;
    cam.userYaw = Math.max(-1.1, Math.min(1.1, cam.userYaw + k[0]));
    cam.userPitch = Math.max(-0.5, Math.min(0.9, cam.userPitch + k[1]));
    dirty = true;
    e.preventDefault();
  });

  aimSun(); bend(); placeCamera();

  return {
    /** Set bend and light from 0 to 1 values. */
    set(p) {
      let ch = false;
      for (const k of Object.keys(P)) if (p[k] != null && Math.abs(P[k] - p[k]) > 1e-4) { P[k] = p[k]; ch = true; }
      if (ch) { bend(); aimSun(); dirty = true; }
    },
    /** Orbit that follows the scroll: from head-on to a three-quarter view. */
    orbit(t) {
      cam.yaw = -0.36 * t;
      cam.pitch = 0.24 * t;
      cam.zoom = 1 + 0.1 * t;
      dirty = true;
    },
    /** Light for a named background. */
    setEnv(name) { E = ENV_LIGHT[name] || NO_ENV; applyEnv(); },
    /** With a background picture behind the leaf, drop the dark fog and the floor grid. */
    setBackdrop(on) {
      const f = on ? null : fog;
      if (scene.fog !== f || grid.visible === on) { scene.fog = f; grid.visible = !on; dirty = true; }
    },
    values: () => ({ ...P }),
    render() {
      resize();
      if (!w) return;
      placeCamera();
      renderer.render(scene, camera);
      dirty = false;
    },
    get dirty() { return dirty; },
    resize,
  };
}
