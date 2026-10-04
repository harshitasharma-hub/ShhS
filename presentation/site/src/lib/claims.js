// Numbers and claims for the results copy. Every sentence on the page that states a finding comes from here,
// and each claim carries a test. If a new run flips a claim, the test fails, the page falls back to plain numbers,
// and `npm run check` says which sentence to rewrite.
// "Out of 100" numbers are whole numbers on purpose: 261 or 1,792 photos do not support a decimal.
import { agg, cell, baseRun, FRACTIONS, get } from './stats.js';
import { CALIBRATION, PLAIN } from '../data/generated.js';

const pack = (list, set) => ({
  n: list.length,
  auc: agg(list, set, 'auc'), acc: agg(list, set, 'acc'), sens: agg(list, set, 'sens'), spec: agg(list, set, 'spec'),
  healthy: agg(list, set, 'healthyOk'), other: agg(list, set, 'otherOk'),
  sev1: agg(list, set, 'sev1'), sev2: agg(list, set, 'sev2'), sev34: agg(list, set, 'sev34'),
});

const loc = (arm, pct, n) => ((CALIBRATION && CALIBRATION.local) || []).find((r) => r.arm === arm && (r.realPct ?? null) === pct && r.nLocal === n) || null;
const who = (arm, pct) => ((CALIBRATION && CALIBRATION.whole) || []).find((r) => r.arm === arm && (r.realPct ?? null) === pct) || null;
const plain = (arm, pct, rs) => (PLAIN || []).find((r) => r.arm === arm && (r.realPct ?? null) === pct && r.renderSet === rs) || null;
/** The versions in the local cut-off test. `arm` and `pct` find the rows in results/calibration.md, `base` picks the colour, `set4` is set 4 (called combo in the files). */
export const CAL_ARMS = [
  { arm: 'zeroshot', pct: null, base: 'zeroshot', name: 'Untrained', mark: 'ring' },
  { arm: 'real', pct: 100, base: 'real', name: 'Real', mark: 'circle' },
  { arm: 'syn', pct: 0, base: 'syn', name: 'Practice', mark: 'diamond' },
  { arm: 'mix', pct: 100, base: 'mix', name: 'Both', mark: 'circle' },
  { arm: 'mix-combo', pct: 100, base: 'mix', name: 'Both, set 4', mark: 'triangle' },
];
export const CAL_SIZES = [25, 50, 100, 200, 500, 1492];

export function facts() {
  const out = {};
  const base = baseRun();
  for (const set of ['bracol', 'uganda', 'kenya']) {
    out[set] = {
      base: { auc: get(base, set, 'auc'), acc: get(base, set, 'acc'), sens: get(base, set, 'sens'), spec: get(base, set, 'spec'), healthy: get(base, set, 'healthyOk'), other: get(base, set, 'otherOk'), sev1: get(base, set, 'sev1'), sev2: get(base, set, 'sev2'), sev34: get(base, set, 'sev34') },
      real: pack(cell('real', 100), set),
      syn: pack(cell('syn', 0), set),
      mix: pack(cell('mix', 100), set),
      realF: Object.fromEntries(FRACTIONS.map((f) => [f, pack(cell('real', f), set)])),
      mixF: Object.fromEntries(FRACTIONS.map((f) => [f, pack(cell('mix', f), set)])),
      v3: { syn: pack(cell('syn', 0, 140, 'v3'), set), mix: pack(cell('mix', 100, 140, 'v3'), set), mix10: pack(cell('mix', 10, 140, 'v3'), set) },
      v4: { syn: pack(cell('syn', 0, 140, 'combo'), set), mix: pack(cell('mix', 100, 140, 'combo'), set) },
    };
  }
  out.cal = {
    local: Object.fromEntries(CAL_ARMS.map((c) => [c.arm, Object.fromEntries(CAL_SIZES.map((n) => [n, loc(c.arm, c.pct, n)]))])),
    whole: Object.fromEntries(CAL_ARMS.map((c) => [c.arm, who(c.arm, c.pct)])),
  };
  out.plain = { zero: plain('zeroshot', null, 'v1'), real: plain('real', 100, 'v1') };
  return out;
}

const f3 = (v) => (v == null || Number.isNaN(v) ? 'n/a' : v.toFixed(3));
const n100 = (v) => (v == null || Number.isNaN(v) ? 'n/a' : String(Math.round(v * 100)));
const p1 = (v) => (v == null || Number.isNaN(v) ? 'n/a' : (v * 100).toFixed(1) + '%');
const pts = (v) => (v * 100).toFixed(1);
export { f3 as fmt3, n100 as fmtN, p1 as fmtP1 };

/** Each claim: id, test (ok is true when the sentence still holds) and the sentence. */
export function claims(F = facts()) {
  const b = F.bracol, u = F.uganda, k = F.kenya, c = F.cal, pl = F.plain;
  const gains = FRACTIONS.map((f) => b.mixF[f].auc.mean - b.realF[f].auc.mean);
  const kenyaAll = [k.base.auc, k.real.auc.mean, k.syn.auc.mean, k.mix.auc.mean, ...FRACTIONS.flatMap((f) => [k.realF[f].auc.mean, k.mixF[f].auc.mean])].filter((v) => v != null && !Number.isNaN(v));
  const uAuc = [u.base.auc, u.real.auc.mean, u.syn.auc.mean, u.mix.auc.mean].filter((v) => v != null && !Number.isNaN(v));
  // The cut-off test needs every version in the table. Set 4 is optional, so a missing set 4 row only drops that line.
  const calArms = CAL_ARMS.filter((x) => c.local[x.arm][100] && c.local[x.arm][1492] && c.local[x.arm][25] && c.whole[x.arm]);
  const calOk = ['zeroshot', 'real', 'syn', 'mix'].every((a) => calArms.some((x) => x.arm === a));
  const diff100 = calOk ? Math.max(...calArms.map((x) => c.local[x.arm][1492].acc - c.local[x.arm][100].acc)) : NaN;
  const sd25 = calOk ? calArms.map((x) => c.local[x.arm][25].accSd) : [];
  const zw = calOk ? c.whole.zeroshot : null;
  const w4 = c.whole['mix-combo'], wr = c.whole.real;
  const v3 = u.v3, v4 = u.v4;
  const d1 = (v) => (Math.round(v * 10) / 10).toString();
  const pointsOf = (v) => { const t = d1(v); return `${t} point${t === '1' ? '' : 's'}`; };
  return [
    { id: 'clean-train', ok: b.real.acc.mean > b.base.acc + 0.03,
      text: `On clean photos, training on real photos lifts right answers from ${n100(b.base.acc)} to *${n100(b.real.acc.mean)}* out of 100.` },
    { id: 'clean-syn', ok: Math.abs(b.syn.acc.mean - b.real.acc.mean) <= 0.01 && b.syn.acc.mean > b.base.acc + 0.03,
      text: `Practice photos alone do about as well: *${n100(b.syn.acc.mean)}* out of 100, against ${n100(b.real.acc.mean)} for real photos. That AI never saw a real photo.` },
    { id: 'clean-both', ok: b.mix.acc.mean > b.real.acc.mean && b.mix.acc.mean >= b.syn.acc.mean && Math.max(...gains) < 0.012,
      text: `Both together are best, at *${n100(b.mix.acc.mean)}* out of 100. The gain over real photos alone is small: ${pointsOf((b.mix.acc.mean - b.real.acc.mean) * 100)}.` },
    { id: 'clean-every-size', ok: b.mix.n > 0 && gains.every((g) => g > 0),
      text: `Adding practice photos to real photos scored higher at every data size we ran: ${FRACTIONS.map((f, i) => `+${gains[i].toFixed(3)} at ${f}%`).join(', ')} (ranking score).` },
    { id: 'early-rust', ok: b.syn.sev1.mean >= b.real.sev1.mean + 0.03 && b.mix.sev1.mean >= b.real.sev1.mean + 0.03,
      text: `On the mildest rust (severity 1), the share found goes from ${n100(b.base.sev1)} untrained to ${n100(b.real.sev1.mean)} with real photos, ${n100(b.syn.sev1.mean)} with practice photos and ${n100(b.mix.sev1.mean)} with both.` },
    { id: 'field-no-gain', ok: u.mix.acc.mean < u.real.acc.mean && u.syn.acc.mean < u.real.acc.mean,
      text: `On real farm photos the practice photos did not help. Right answers out of 100: real photos ${n100(u.real.acc.mean)}, practice photos alone ${n100(u.syn.acc.mean)}, both together *${n100(u.mix.acc.mean)}*. The untrained AI gets ${n100(u.base.acc)}.` },
    { id: 'field-rust-caught', ok: u.mix.sens.mean > u.real.sens.mean && u.syn.sens.mean > u.real.sens.mean && u.real.sens.mean > u.base.sens,
      text: `The practice photos find more of the rust: *${n100(u.mix.sens.mean)}* of 100 rust leaves with both, ${n100(u.real.sens.mean)} with real photos alone, ${n100(u.base.sens)} untrained.` },
    { id: 'field-phoma', ok: u.base.other > u.real.other.mean && u.real.other.mean > u.syn.other.mean && u.syn.other.mean > u.mix.other.mean,
      text: `They also call another disease, phoma, rust more often. Phoma leaves answered correctly, out of 100: untrained ${n100(u.base.other)}, real photos ${n100(u.real.other.mean)}, practice photos alone ${n100(u.syn.other.mean)}, both *${n100(u.mix.other.mean)}*.` },
    { id: 'field-tidy', ok: u.realF[10].n > 0 && u.realF[100].n > 0 && u.realF[10].acc.mean >= u.realF[100].acc.mean - 0.005,
      text: `More tidy training photos did not help on farm photos: ${n100(u.realF[10].acc.mean)} out of 100 right with 10% of the real photos, ${n100(u.realF[100].acc.mean)} with all of them.` },
    { id: 'field-close', ok: Math.abs(u.real.auc.mean - u.base.auc) <= 0.02 && Math.abs(u.mix.auc.mean - u.base.auc) <= 0.03,
      text: `On real farm photos every version ranks the photos about as well as the untrained AI (ranking score ${f3(Math.min(...uAuc))} to ${f3(Math.max(...uAuc))}).` },
    { id: 'v3-moved', ok: v3.mix.n > 0 && v3.mix.other.mean >= u.mix.other.mean + 0.1 && v3.mix.healthy.mean <= u.mix.healthy.mean - 0.05 && v3.mix.sens.mean < u.mix.sens.mean && v3.mix.acc.mean < u.mix.acc.mean,
      text: `Set 3 helped with phoma: ${n100(u.mix.other.mean)} to *${n100(v3.mix.other.mean)}* of 100 answered right. It cost more elsewhere. Healthy leaves went from ${n100(u.mix.healthy.mean)} to *${n100(v3.mix.healthy.mean)}*, rust found from ${n100(u.mix.sens.mean)} to *${n100(v3.mix.sens.mean)}*, and right answers overall from ${n100(u.mix.acc.mean)} to *${n100(v3.mix.acc.mean)}*.` },
    { id: 'v4-better', ok: v4.mix.n > 0 && v4.mix.acc.mean > u.mix.acc.mean + 0.03 && v4.mix.acc.mean >= u.real.acc.mean - 0.015 && v4.mix.other.mean > u.mix.other.mean + 0.2 && v4.mix.healthy.mean >= u.mix.healthy.mean - 0.03,
      text: `With set 4, right answers go from ${n100(u.mix.acc.mean)} to *${n100(v4.mix.acc.mean)}* out of 100, close to the ${n100(u.real.acc.mean)} of real photos alone. Phoma leaves answered right go from ${n100(u.mix.other.mean)} to *${n100(v4.mix.other.mean)}*, and healthy leaves stay at ${n100(v4.mix.healthy.mean)}.` },
    { id: 'v4-trade', ok: v4.mix.n > 0 && v4.mix.sens.mean < u.real.sens.mean && v4.mix.acc.mean <= u.real.acc.mean + 0.005,
      text: `Set 4 still does not beat real photos alone. It finds ${n100(v4.mix.sens.mean)} of 100 rust leaves, against ${n100(u.real.sens.mean)} with real photos alone and ${n100(u.mix.sens.mean)} with set 1.` },
    { id: 'cal-100', ok: calOk && diff100 <= 0.03,
      text: `With 100 local photos to set the cut-off, right answers land within *${pointsOf(diff100 * 100)}* of the best case, which uses 1,492 photos.` },
    { id: 'cal-25', ok: calOk && sd25.every((v) => v != null && v >= 0.025),
      text: `With only 25 local photos the result swings by *${d1(Math.min(...sd25) * 100)} to ${d1(Math.max(...sd25) * 100)} points* between draws.` },
    { id: 'cal-set4', ok: !!(w4 && wr) && w4.accFieldCut >= wr.accFieldCut + 0.005 && w4.accFieldCut - w4.accBracolCut >= 0.02,
      text: `Set 4 gains from a local cut-off too: *${n100(w4 && w4.accBracolCut)}* to *${n100(w4 && w4.accFieldCut)}* out of 100 right on 300 balanced farm photos, against ${n100(wr && wr.accBracolCut)} to ${n100(wr && wr.accFieldCut)} for real photos alone.` },
    { id: 'cal-cutoff', ok: calOk && zw.accFieldCut - zw.accBracolCut >= 0.03,
      text: `The cut-off matters most for the untrained AI: *${n100(zw && zw.accBracolCut)}* out of 100 right with the clean-photo cut-off, *${n100(zw && zw.accFieldCut)}* with one set on local photos.` },
    { id: 'plain-phone', ok: !!(pl.zero && pl.real) && pl.zero.sens < 0.2 && pl.real.sens > 0.8,
      text: `If a phone can only read the plain yes or no, the untrained AI finds *${n100(pl.zero && pl.zero.sens)}* of 100 rust leaves. After training on real photos it finds *${n100(pl.real && pl.real.sens)}*.` },
    { id: 'kenya-weak', ok: Math.max(...kenyaAll) < 0.75,
      text: `On the Kenya photos every score is weak (ranking score ${f3(Math.min(...kenyaAll))} to ${f3(Math.max(...kenyaAll))}).` },
  ];
}
export const claimMap = (F) => Object.fromEntries(claims(F).map((c) => [c.id, c]));
