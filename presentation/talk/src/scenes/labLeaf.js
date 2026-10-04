import * as THREE from 'three';
import { GFX, whenLoaded } from './diagram.js';
import { mulberry32 } from '../core/math.js';

// The leaf of the leaf lab: the real cut-out of BRACOL leaf 897, as a sheet that bends the way Blender bends it.
//
// The bend is the height function of scripts/synth/blender_render.py (LeafShape.z), so a leaf you bend here is a leaf
// Blender could draw: a V fold along the midrib, an arch along the length, a twist, wavy edges, and a few small ripples.
// Blender draws the four values at random from a range for every render (BENDS[..].band). The sliders go a little
// further on both sides, so you can see what the range leaves out.

export const LEAF_L = 24;                       // the length of the leaf, in scene units
export const LEAF_ASPECT = 1400 / 525;          // the cut-out picture
export const LEAF_W = LEAF_L / LEAF_ASPECT;
const NX = 140, NY = 56;                        // the grid Blender uses

// lo and hi are the ends of the slider. band is what Blender draws from. def is where the leaf starts.
export const BENDS = {
  fold: { label: 'Fold', lo: -0.10, hi: 0.40, band: [-0.05, 0.30], def: 0.18 },
  droop: { label: 'Droop', lo: -0.08, hi: 0.24, band: [-0.04, 0.14], def: 0.07 },
  twist: { label: 'Twist', lo: -0.30, hi: 0.30, band: [-0.22, 0.22], def: 0.10 },
  wave: { label: 'Wavy edge', lo: 0, hi: 0.12, band: [0, 0.07], def: 0.04 },
};
export const bendValue = (k, pos) => BENDS[k].lo + (BENDS[k].hi - BENDS[k].lo) * pos;           // slider position 0..1 to a value
export const bendPos = (k, v) => (v - BENDS[k].lo) / (BENDS[k].hi - BENDS[k].lo);               // and back

const WAVE_N = 4.5, WAVE_P = 0.9;
const SWIRL = [[1.4, 0.7, 2.1, 0.012], [2.2, 3.9, 0.4, 0.009], [0.9, 5.2, 4.4, 0.016]];

// A water bead on the leaf: a dark rim, a clear middle and a bright spot, like the drops Blender puts on a wet leaf.
function bead(ctx, x, y, r, rng) {
  const rx = r, ry = r * (0.85 + rng() * 0.25);
  const g = ctx.createRadialGradient(x - r * 0.2, y - r * 0.25, r * 0.1, x, y, r);
  g.addColorStop(0, 'rgba(255,255,255,0.30)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.06)');
  g.addColorStop(0.88, 'rgba(8,24,14,0.42)');
  g.addColorStop(1, 'rgba(8,24,14,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.2832); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath(); ctx.ellipse(x - r * 0.34, y - r * 0.4, r * 0.2, r * 0.13, -0.6, 0, 6.2832); ctx.fill();
}

export class LeafSheet {
  constructor() {
    this.geo = new THREE.PlaneGeometry(LEAF_L, LEAF_W, NX, NY);
    // the parts of the bend that do not depend on the sliders, worked out once
    const pos = this.geo.attributes.position, n = pos.count;
    this.n = n;
    this.XN = new Float32Array(n); this.YN = new Float32Array(n);
    this.A13 = new Float32Array(n); this.A16 = new Float32Array(n);
    this.SIN = new Float32Array(n); this.RIP = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const xn = pos.getX(i) / (LEAF_L / 2), yn = pos.getY(i) / (LEAF_W / 2);
      this.XN[i] = xn; this.YN[i] = yn;
      this.A13[i] = Math.pow(Math.abs(yn), 1.3);
      this.A16[i] = Math.pow(Math.abs(yn), 1.6);
      this.SIN[i] = Math.sin(Math.PI * WAVE_N * xn + WAVE_P);
      let r = 0;
      for (const [f, a, b, amp] of SWIRL) r += amp * LEAF_W * Math.sin(f * Math.PI * xn + a) * Math.sin(f * 0.8 * Math.PI * yn + b);
      this.RIP[i] = r;
    }

    // the skin: the cut-out, with water drops painted on it when the leaf is wet
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1400; this.canvas.height = 525;
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.anisotropy = GFX.aniso;
    this.img = null;
    this.drops = 0;
    this.ready = false;
    whenLoaded('leaf_cutout', (img) => { this.img = img; this.ready = true; this._paint(); });
    this._paint();

    // what the shader reads: how much of the leaf is cut out so far, how much it is lit (0 shows the plain photo pixels),
    // and how much light shines through it
    this.U = { scan: { value: 1 }, lit: { value: 1 }, trans: { value: 0.25 } };
    const mat = new THREE.MeshPhysicalMaterial({
      map: this.tex, bumpMap: this.tex, bumpScale: 1.2, alphaTest: 0.5, alphaToCoverage: true, side: THREE.DoubleSide,
      roughness: 0.5, metalness: 0, specularIntensity: 0.4, clearcoat: 0, clearcoatRoughness: 0.06,
    });
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, { uScan: this.U.scan, uLit: this.U.lit, uTrans: this.U.trans });
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform float uScan;\nuniform float uLit;\nuniform float uTrans;')
        // the cut-out grows from the left, like a scan
        .replace('#include <map_fragment>', '#include <map_fragment>\n  if ( vMapUv.x > uScan ) discard;')
        // light that shines through from the other side, then the blend between the plain photo and the lit leaf
        .replace('#include <opaque_fragment>', `
          #if NUM_DIR_LIGHTS > 0
            outgoingLight += diffuseColor.rgb * directionalLights[ 0 ].color * max( 0.0, dot( -normal, directionalLights[ 0 ].direction ) ) * uTrans;
          #endif
          outgoingLight = mix( diffuseColor.rgb, outgoingLight, uLit );
          #include <opaque_fragment>`);
    };
    mat.customProgramCacheKey = () => 'lab-leaf';
    this.mat = mat;

    this.mesh = new THREE.Mesh(this.geo, mat);
    this.mesh.castShadow = true;
    this.mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: this.tex, alphaTest: 0.5 });   // a shadow in the shape of the leaf
    this.mesh.frustumCulled = false;
    this.P = { fold: 0, droop: 0, twist: 0, wave: 0 };
    this.k = 0;
    this.setBend(this.P, 0);
  }

  // P holds the four values. k scales the whole bend from 0 (flat, as in the photo) to 1.
  setBend(P, k = 1) {
    Object.assign(this.P, P);
    this.k = k;
    const z = this.geo.attributes.position;
    const { fold, droop, twist, wave } = this.P;
    const W = LEAF_W, L = LEAF_L;
    for (let i = 0; i < this.n; i++) {
      const v = fold * W * this.A13[i] - droop * L * this.XN[i] * this.XN[i] * 0.5 + twist * W * this.YN[i] * this.XN[i] + wave * W * this.SIN[i] * this.A16[i] + this.RIP[i];
      z.setZ(i, v * k);
    }
    z.needsUpdate = true;
    this.geo.computeVertexNormals();
  }

  // wet leaves are darker and glossy, and carry drops
  setWet(wet, drops, rough) {
    this.mat.roughness = rough;
    this.mat.clearcoat = 0.55 * wet;
    const c = 1 - 0.1 * wet;
    this.mat.color.setRGB(c, c, c);
    if (drops !== this.drops) { this.drops = drops; this._paint(); }
  }

  _paint() {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, 1400, 525);
    if (!this.img) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(this.img, 0, 0, 1400, 525);
    if (this.drops > 0) {
      const rng = mulberry32(897);
      ctx.globalCompositeOperation = 'source-atop';     // only on the leaf
      for (let i = 0; i < this.drops; i++) {
        const big = rng() < 0.3;
        bead(ctx, 80 + rng() * 1240, 40 + rng() * 445, big ? 15 + rng() * 14 : 6 + rng() * 8, rng);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    this.tex.needsUpdate = true;
  }

  // the position of a point of the flat cut-out, from its place in the picture (u from the left, v from the bottom)
  flatPoint(u, v, out = new THREE.Vector3()) {
    return out.set((u - 0.5) * LEAF_L, (v - 0.5) * LEAF_W, 0.04);
  }
}
