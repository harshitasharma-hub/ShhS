// "What we found": six plain findings, each one a claim with a test. A finding that no longer holds is replaced by a plain pointer to its chart.
import { $, h, int } from '../lib/dom.js';
import { facts, claimMap } from '../lib/claims.js';
import { COUNTS } from '../data/generated.js';

/** Turn "a *b* c" into text with <em> around b. Our own sentences only. */
export function rich(el, str) {
  el.replaceChildren(...str.split('*').map((part, i) => (i % 2 ? h('em', null, part) : document.createTextNode(part))));
}

export function initSummary() {
  const list = $('#found-list');
  if (!list) return;
  const F = facts();
  const C = claimMap(F);
  const n = (v) => (v == null || Number.isNaN(v) ? 'n/a' : String(Math.round(v * 100)));
  const b = F.bracol, u = F.uganda;
  const items = [
    { ids: ['clean-train', 'clean-syn', 'clean-both'], link: '#qa-clean', title: 'Training helps on clean photos.',
      text: `The untrained AI answers *${n(b.base.acc)}* out of 100 clean photos right. After training on real photos it answers *${n(b.real.acc.mean)}*. Practice photos alone give *${n(b.syn.acc.mean)}* too, and both together give *${n(b.mix.acc.mean)}*.` },
    { ids: ['field-no-gain'], link: '#qa-field', title: 'On real farm photos, the practice photos did not help.',
      text: `On ${int(COUNTS.uganda.kept)} photos from Ugandan farms, real photos alone answer *${n(u.real.acc.mean)}* out of 100 right. Practice photos alone give *${n(u.syn.acc.mean)}*, both together *${n(u.mix.acc.mean)}*, and the untrained AI *${n(u.base.acc)}*.` },
    { ids: ['field-rust-caught', 'field-phoma'], link: '#qa-why', title: 'They find more rust, and they also call another disease rust.',
      text: `Both together find *${n(u.mix.sens.mean)}* of 100 rust leaves (real photos alone: ${n(u.real.sens.mean)}). But only *${n(u.mix.other.mean)}* of 100 phoma leaves get the right answer, "no rust" (real photos alone: ${n(u.real.other.mean)}).` },
    { ids: ['v3-moved'], link: '#qa-v3', title: 'Our first fix, set 3, moved the errors.',
      text: `Set 3 swaps in look-alike photos. Phoma answers improve (${n(u.mix.other.mean)} to *${n(u.v3.mix.other.mean)}* of 100), but healthy leaves get worse (${n(u.mix.healthy.mean)} to *${n(u.v3.mix.healthy.mean)}*) and so does rust found (${n(u.mix.sens.mean)} to *${n(u.v3.mix.sens.mean)}*).` },
    { ids: ['v4-better', 'v4-trade'], link: '#qa-v3', title: 'Our second fix, set 4, nearly closes the gap.', skip: !(u.v4 && u.v4.mix.n),
      text: `Set 4 keeps all of set 1 and adds the look-alikes. Right answers rise from ${n(u.mix.acc.mean)} to *${n(u.v4.mix.acc.mean)}* out of 100, close to the ${n(u.real.acc.mean)} of real photos alone, and phoma leaves answered right from ${n(u.mix.other.mean)} to *${n(u.v4.mix.other.mean)}*. But it finds less rust than real photos alone: *${n(u.v4.mix.sens.mean)}* of 100 against ${n(u.real.sens.mean)}. We made sets 3 and 4 after we studied these same photos, so read them as a lead, not as proof.` },
    { ids: ['cal-100'], link: '#qa-local', title: 'About 100 local photos are enough to set the cut-off.',
      text: C['cal-100'].ok ? `${C['cal-100'].text}${C['cal-set4'].ok ? ' ' + C['cal-set4'].text : ''}` : '' },
    { ids: ['plain-phone', 'demo-numbers'], link: '#demo', title: 'A laptop demo works. The phone app is not built yet.',
      text: C['plain-phone'].ok && C['demo-numbers'].ok ? `${C['demo-numbers'].text} The phone code returns the plain yes or no, not the score. ${C['plain-phone'].text}` : '' },
  ];
  const shown = items.filter((it) => !it.skip);
  shown.forEach((it, i) => {
    const ok = it.ids.every((id) => C[id] && C[id].ok);
    const li = h('li', { class: shown.length % 2 && i === shown.length - 1 ? 'is-wide' : '' }, h('b', null, it.title), h('span', { class: 'found__text' }), h('a', { class: 'found__more', href: it.link }, 'See the chart'));
    const span = li.querySelector('.found__text');
    if (ok && it.text) rich(span, it.text); else span.textContent = 'The numbers changed since we wrote this line. Open the chart for the current figures.';
    list.append(li);
  });
}
