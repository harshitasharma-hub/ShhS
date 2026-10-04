// Turn a model score into an answer. A score is logit(Yes) minus logit(No) from our own runs.
// Rust above the cut-off, no rust below it, "not sure" inside a band around it.
// The cut-off comes from the BRACOL validation photos. Nothing here is tuned on test or field photos.
import { SCORES } from '../data/generated.js';

export const MODELS = [
  { key: 'zeroshot', name: 'Untrained AI', short: 'Untrained', sub: 'We taught it nothing', cls: 'zero-k' },
  { key: 'real', name: 'Real photos', short: 'Real photos', sub: 'Taught with real BRACOL photos', cls: 'real-k' },
  { key: 'syn', name: 'Practice photos', short: 'Practice photos', sub: 'Taught with 3D photos only', cls: 'syn-k' },
  { key: 'mix', name: 'Both together', short: 'Both', sub: 'Real and practice photos', cls: 'mix-k' },
  { key: 'mix3', name: 'Both, with set 3', short: 'Both, set 3', sub: 'Swaps in look-alike photos', cls: 'mix3-k' },
  { key: 'mix4', name: 'Both, with set 4', short: 'Both, set 4', sub: 'Adds look-alike photos', cls: 'mix4-k' },
];

export const VERDICT = {
  yes: {
    word: 'Rust found', short: 'Rust', gloss: 'The AI sees signs of rust on this leaf.',
    phone: { en: { word: 'Yes', sub: 'Rust found', help: 'Check the leaves nearby.' }, sw: { word: 'Ndiyo', sub: 'Kutu ya majani ya kahawa', help: 'Angalia majani ya karibu.' } },
  },
  no: {
    word: 'No rust found', short: 'No rust', gloss: 'The AI sees no rust on this leaf.',
    phone: { en: { word: 'No', sub: 'No rust found', help: 'No rust seen on this leaf.' }, sw: { word: 'Hapana', sub: 'Hakuna dalili za kutu', help: 'Hakuna dalili za kutu kwenye jani hili.' } },
  },
  unsure: {
    word: 'Not sure', short: 'Not sure', gloss: 'The AI cannot tell. Ask a person.',
    phone: { en: { word: 'Not sure', sub: 'Ask a person', help: 'Take a closer photo, or ask the extension officer.' }, sw: { word: 'Sina uhakika', sub: 'Wasiliana na afisa ugani', help: 'Jaribu tena.' } },
  },
};

export function quantile(sorted, q) {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos), hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

/** Half-width of the "not sure" band: the distance from the cut-off that holds `share` of the validation photos. */
export function marginFor(key, share = 0.12) {
  const m = SCORES && SCORES[key];
  if (!m) return 0;
  const rows = m.bracolVal || m.bracolTest || [];
  const d = rows.map((r) => Math.abs(r[2] - m.threshold)).sort((a, b) => a - b);
  return quantile(d, share);
}

export function verdictOf(score, key, margin) {
  const m = SCORES[key];
  if (score == null || !m) return null;
  const d = score - m.threshold;
  if (Math.abs(d) <= margin) return 'unsure';
  return d > 0 ? 'yes' : 'no';
}

export const isRight = (v, rust) => (v === 'yes' && rust === 1) || (v === 'no' && rust === 0);

export function truthText(p) {
  if (p.rust === 1) return p.severity != null ? `rust, severity ${p.severity}` : 'rust';
  if (p.group === 'healthy') return 'no rust, a healthy leaf';
  if (p.group === 'other') return p.set === 'uganda' ? 'no rust, but another disease (phoma)' : 'no rust, but another problem';
  return 'no rust';
}

/** The score a model gave one of our picked photos. The Uganda photos use the full 1,792-photo run, like the rest of the page. */
const lookups = {};
function table(model, setKey) {
  const k = model + ':' + setKey;
  if (!lookups[k]) {
    const rows = (SCORES && SCORES[model] && SCORES[model][setKey]) || [];
    lookups[k] = new Map(rows.map((r) => [String(r[0]), r[2]]));
  }
  return lookups[k];
}
export function scoreFor(model, p) {
  const v = p.set === 'bracol'
    ? table(model, 'bracolTest').get(String(p.id).replace(/^b/, ''))
    : table(model, 'ugandaAll').get(String(p.id).replace(/^u_/, ''));
  if (v != null) return v;
  return p.scores && p.scores[model] != null ? p.scores[model] : null;
}

/** Where a score sits on a gauge from 0 to 1, compressed so far scores stay on the track. */
export function gaugePos(score, key, scale = 5) {
  const m = SCORES[key];
  const d = (score - m.threshold) / scale;
  return 0.5 + 0.5 * Math.tanh(d);
}
export function gaugeBand(margin, key, scale = 5) {
  const lo = 0.5 + 0.5 * Math.tanh(-margin / scale);
  const hi = 0.5 + 0.5 * Math.tanh(margin / scale);
  return [lo, hi];
}
