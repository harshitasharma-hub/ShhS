import * as THREE from 'three';
import { mulberry32 } from '../core/math.js';

// A tileable noise texture, baked once. Shaders sample it instead of running 4-octave
// noise per pixel, which is what made the big cloud and ground layers slow.
//   R: fbm   G: a second, different fbm   B: ridged noise   A: white noise
export function makeNoiseTexture(size = 256) {
  const rng = mulberry32(1337);
  const data = new Uint8Array(size * size * 4);

  function lattice(period) {
    const a = new Float32Array(period * period);
    for (let i = 0; i < a.length; i++) a[i] = rng();
    return a;
  }
  const smooth = (t) => t * t * (3 - 2 * t);
  function sample(lat, period, x, y) {
    const fx = x * period, fy = y * period;
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    const tx = smooth(fx - x0), ty = smooth(fy - y0);
    const xa = ((x0 % period) + period) % period, xb = (xa + 1) % period;
    const ya = ((y0 % period) + period) % period, yb = (ya + 1) % period;
    const a = lat[ya * period + xa], b = lat[ya * period + xb], c = lat[yb * period + xa], d = lat[yb * period + xb];
    return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
  }
  const periods = [8, 16, 32, 64];
  const mk = () => periods.map((p) => ({ p, lat: lattice(p) }));
  const layers = [mk(), mk(), mk()];
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const x = i / size, y = j / size;
      const out = [0, 0, 0];
      for (let k = 0; k < 3; k++) {
        let amp = 0.5, sum = 0, norm = 0;
        for (const { p, lat } of layers[k]) {
          let v = sample(lat, p, x, y);
          if (k === 2) v = 1 - Math.abs(v * 2 - 1);
          sum += v * amp; norm += amp; amp *= 0.5;
        }
        out[k] = sum / norm;
      }
      const o = (j * size + i) * 4;
      data[o] = Math.min(255, out[0] * 255 * 1.15 - 20);
      data[o + 1] = Math.min(255, out[1] * 255 * 1.15 - 20);
      data[o + 2] = out[2] * 255;
      data[o + 3] = rng() * 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}
