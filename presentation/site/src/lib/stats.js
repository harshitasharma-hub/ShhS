// Aggregate the run records (src/data/generated.js) for the charts and the copy.
import { RUNS } from '../data/generated.js';
import { mean, sd } from './dom.js';

export const ARMS = [
  { key: 'zeroshot', label: 'Untrained AI', short: 'Untrained', color: 'var(--ink-3)', cls: 'zero', blurb: 'Gemma 4 E2B as it comes. We taught it nothing.' },
  { key: 'real', label: 'Real photos only', short: 'Real', color: 'var(--s-real)', cls: 'real', blurb: 'Taught with the real BRACOL training photos.' },
  { key: 'syn', label: 'Practice photos only', short: 'Practice', color: 'var(--s-syn)', cls: 'syn', blurb: 'Taught with our 3D practice photos. No real photo.' },
  { key: 'mix', label: 'Both together', short: 'Both', color: 'var(--s-mix)', cls: 'mix', blurb: 'Taught with the real photos and the practice photos.' },
];
export const ARM = Object.fromEntries(ARMS.map((a) => [a.key, a]));
/** The same two 3D arms, taught with the two later practice sets. Same colour family as the first sets, a different marker.
 *  Set 3 swaps 547 of set 1's photos for look-alikes. Set 4 keeps all of set 1 and adds the 547 look-alikes. */
export const V3_ARMS = [
  { key: 'syn', rs: 'v3', label: 'Practice only, set 3', short: 'Practice, set 3', color: 'var(--s-syn)', mark: 'square' },
  { key: 'mix', rs: 'v3', label: 'Both, set 3', short: 'Both, set 3', color: 'var(--s-mix)', mark: 'square' },
];
export const V4_ARMS = [
  { key: 'syn', rs: 'combo', label: 'Practice only, set 4', short: 'Practice, set 4', color: 'var(--s-syn)', mark: 'triangle' },
  { key: 'mix', rs: 'combo', label: 'Both, set 4', short: 'Both, set 4', color: 'var(--s-mix)', mark: 'triangle' },
];

/** `field` is the key inside a run record. The page's "real farm photos" are all 1,792 Uganda photos. */
export const SETS = {
  bracol: { label: 'Clean photos', long: 'the 261 clean BRACOL test photos', n: 261, field: 'bracol' },
  uganda: { label: 'Real farm photos', long: 'the 1,792 real Uganda photos', n: 1792, field: 'ugandaAll' },
  kenya: { label: 'Kenya stress test', long: 'the 197 small Kenya photos', n: 197, field: 'kenya' },
};
export const FRACTIONS = [10, 25, 50, 100];
export const SEEDS = [0, 1, 2];
export const DETAIL = 140;

const runs = RUNS || [];

export function baseRun(detail = DETAIL) {
  return runs.find((r) => r.name === `zeroshot_d${detail}_cuda`) || runs.find((r) => r.arm === 'zeroshot' && r.detail === detail) || null;
}

/** The runs of one cell. `rs` is the render set: 'v1' (the first results) or 'v3' (adds look-alike photos). */
export function cell(arm, realPct, detail = DETAIL, rs = 'v1') {
  if (arm === 'zeroshot') return [baseRun(detail)].filter(Boolean);
  return runs.filter((r) => r.arm === arm && r.detail === detail && (r.renderSet || 'v1') === rs && (arm === 'syn' ? true : r.realPct === realPct));
}

export const get = (run, set, key) => {
  const f = SETS[set] ? SETS[set].field : set;
  return run && run[f] && run[f][key] != null ? run[f][key] : null;
};

export function agg(list, set, key) {
  const values = list.map((r) => get(r, set, key)).filter((v) => v != null);
  return { n: values.length, mean: values.length ? mean(values) : NaN, sd: sd(values), values, min: Math.min(...values), max: Math.max(...values) };
}

/** Runs we planned (3 seeds per cell) but do not have yet. Drives the "to do" list. */
export function missingRuns() {
  const out = [];
  const has = (arm, rs, f, s) => runs.some((r) => r.arm === arm && r.detail === DETAIL && (r.renderSet || 'v1') === rs && (arm === 'syn' || r.realPct === f) && r.seed === s);
  for (const arm of ['real', 'mix']) {
    for (const f of FRACTIONS) for (const s of SEEDS) if (!has(arm, 'v1', f, s)) out.push({ arm, realPct: f, seed: s, rs: 'v1' });
  }
  for (const s of SEEDS) if (!has('syn', 'v1', 0, s)) out.push({ arm: 'syn', realPct: 0, seed: s, rs: 'v1' });
  for (const [arm, f] of [['mix', 10], ['mix', 100], ['syn', 0]]) {
    for (const s of SEEDS) if (!has(arm, 'v3', f, s)) out.push({ arm, realPct: f, seed: s, rs: 'v3' });
  }
  return out;
}

export const RUN_COUNT = runs.length;
export const hasRuns = (rs) => runs.some((r) => r.renderSet === rs);
/** Seeds present for one cell, for an honest "2 runs, not 3" note. */
export const seedsOf = (arm, realPct, rs) => runs.filter((r) => r.arm === arm && r.detail === DETAIL && (r.renderSet || 'v1') === rs && (arm === 'syn' || r.realPct === realPct)).map((r) => r.seed).sort();
