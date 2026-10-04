// Shared GLSL. Every custom material uses these so the look stays one look.
//
// Two worlds share one frame. Left of the seam is "photo": lit, fogged, soft.
// Right of the seam is "labels": flat class colors on a dark violet ground,
// the way a segmentation mask looks. Each material picks its own label color.

export const COMMON_UNIFORMS = /* glsl */ `
uniform float uTime;
uniform float uSeam;        // label world starts at this fraction of the canvas width
uniform vec2  uRes;         // drawing buffer size in pixels
uniform vec3  uSunDir;      // unit vector pointing at the sun
uniform vec3  uSunColor;
uniform vec3  uSkyColor;
uniform vec3  uGroundColor;
uniform vec3  uFogColor;
uniform float uFogDensity;
uniform float uAmbient;
uniform vec3  uWind;        // xz direction scaled by strength, y unused
uniform vec3  uLabelGround; // class color for soil and background
`;

export const NOISE = /* glsl */ `
float hash11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float hash21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 hash22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1, 0)), u.x), mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), u.x), u.y);
}
// baked 4-octave noise: one texture fetch instead of sixteen hashes
uniform sampler2D uNoiseTex;
float fbm(vec2 p) { return texture2D(uNoiseTex, p * 0.125).r; }
float fbm2(vec2 p) { return texture2D(uNoiseTex, p * 0.125 + 0.37).g; }
`;

export const LIGHTING = /* glsl */ `
bool onLabelSide() { return gl_FragCoord.x > uSeam * uRes.x; }

vec3 applyFog(vec3 col, float dist) {
  float f = 1.0 - exp(-uFogDensity * uFogDensity * dist * dist);
  return mix(col, uFogColor, clamp(f, 0.0, 1.0));
}

// albedo is linear. n is the surface normal facing the viewer.
vec3 shade(vec3 albedo, vec3 n, vec3 V, float ao, float trans, float spec) {
  float ndl = max(dot(n, uSunDir), 0.0);
  float wrap = clamp((dot(n, uSunDir) + 0.35) / 1.35, 0.0, 1.0);
  vec3 hemi = mix(uGroundColor, uSkyColor, n.y * 0.5 + 0.5);
  vec3 light = hemi * uAmbient * ao + uSunColor * (0.15 * wrap + 0.85 * ndl) * mix(0.55, 1.0, ao);
  // light through thin leaves when the sun is behind them
  light += uSunColor * trans * max(dot(-n, uSunDir), 0.0) * 0.6;
  vec3 col = albedo * light;
  vec3 H = normalize(uSunDir + V);
  col += uSunColor * spec * pow(max(dot(n, H), 0.0), 48.0) * ndl;
  // soft rim to lift silhouettes off the mist
  float rim = pow(1.0 - max(dot(n, V), 0.0), 3.0);
  col += uSkyColor * rim * 0.10;
  return col;
}
`;

// Wind sway. amp is world units at the tip. phase makes neighbors differ.
export const WIND = /* glsl */ `
vec3 windOffset(vec3 worldPos, float amp, float phase) {
  float t = uTime;
  float s = length(uWind.xz) + 0.15;
  float a = sin(t * 1.3 + worldPos.x * 0.35 + worldPos.z * 0.27 + phase) * 0.6
          + sin(t * 2.7 + worldPos.x * 0.8 + phase * 1.7) * 0.4;
  vec2 dir = normalize(uWind.xz + vec2(0.0001));
  return vec3(dir.x, 0.0, dir.y) * a * amp * s;
}
`;
