// The phone sketch and the "will it run on a phone" facts. The photos and answers are real model output; the app itself is not built yet.
import { $, $$, h, icon, int } from '../lib/dom.js';
import { PHOTOS, SCORES, PLAIN, COUNTS } from '../data/generated.js';
import { marginFor, verdictOf, scoreFor, VERDICT } from '../lib/verdict.js';
import { tableTwin } from '../lib/charts.js';
import { DEMO } from '../data/demo.js';
import { facts, claimMap } from '../lib/claims.js';
import { rich } from './summary.js';

const ICON = { yes: 'spots', no: 'check', unsure: 'ask' };
// The three lines of scripts/model/predict.py, word for word
const ANSWERS = {
  en: { yes: 'Rust: yes', no: 'Rust: no', unsure: 'Not sure. Ask a person to look at this leaf.' },
  es: { yes: 'Roya: sí', no: 'Roya: no', unsure: 'No estoy seguro. Pida a una persona que mire esta hoja.' },
  pt: { yes: 'Ferrugem: sim', no: 'Ferrugem: não', unsure: 'Não tenho certeza. Peça a uma pessoa para olhar esta folha.' },
};

export function initModel() {
  initDemo();
  initPhone();
  initPlain();
  initFacts();
}

/** The laptop demo: four real Uganda photos and the answers of the demo model, in the three languages of predict.py. */
function initDemo() {
  const grid = $('#demo-grid'), seg = $('#demo-lang'), stat = $('#demo-numbers');
  if (!grid || !DEMO || !DEMO.photos.length) return;
  let lang = 'en';
  const truth = (p) => (p.rust ? 'rust' : p.group === 'healthy' ? 'no rust, a healthy leaf' : p.group === 'other' ? 'no rust, but another disease (phoma)' : 'no rust');
  const sign = (v) => (v >= 0 ? '+' : '') + v.toFixed(2);
  function paint() {
    grid.replaceChildren(...DEMO.photos.map((p) => {
      const full = ANSWERS[lang][p.verdict], cut = full.indexOf('. ');
      const word = cut < 0 ? full : full.slice(0, cut + 1), rest = cut < 0 ? [] : [full.slice(cut + 2)];
      return h('li', { class: 'demo__item' },
        h('div', { class: 'demo__photo' }, h('img', { src: p.file, alt: `A real Uganda coffee leaf photo. Label: ${truth(p)}.`, width: 256, height: 256, loading: 'lazy', decoding: 'async' })),
        h('div', { class: 'result result--demo', 'data-verdict': p.verdict },
          h('span', { class: 'result__icon' }, icon(ICON[p.verdict])),
          h('div', { class: 'result__body', lang }, h('b', { class: 'result__word' }, word), rest.length ? h('span', { class: 'result__sub' }, rest.join(' ')) : null)),
        h('p', { class: 'demo__truth' }, 'Label from the dataset: ', h('b', null, truth(p))),
        h('p', { class: 'demo__score' }, `score ${sign(p.score)}, cut-off ${sign(DEMO.cutoff)}, band ${DEMO.margin.toFixed(2)}`));
    }));
    $$('button', seg).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }
  $$('button', seg).forEach((b) => b.addEventListener('click', () => { lang = b.dataset.lang; paint(); }));
  paint();
  const C = claimMap(facts());
  if (C['demo-numbers'].ok) rich(stat, C['demo-numbers'].text); else stat.remove();
}

/** Plain sentences from the data: what training costs, and why a smaller picture matters on a phone. */
function initFacts() {
  const C = claimMap(facts());
  const cost = $('#cost-line');
  if (cost) { if (C['train-cost'].ok) cost.textContent = C['train-cost'].text; else cost.remove(); }
  const d = $('#ps-detail');
  if (d) { if (C['detail-small'].ok) d.textContent = C['detail-small'].text; else d.parentElement.remove(); }
}

function initPhone() {
  const root = $('#phone');
  if (!root || !PHOTOS || !SCORES || !SCORES.mix) return;
  const margin = marginFor('mix');
  const heroes = PHOTOS.filter((p) => p.hero);
  const by = (v) => heroes.find((p) => verdictOf(scoreFor('mix', p), 'mix', margin) === v) || heroes[0];
  const picks = { yes: by('yes'), no: by('no'), unsure: by('unsure') };
  let lang = 'sw', v = 'yes';
  const img = $('#phone-img'), res = $('#phone-result'), word = $('#phone-word'), line = $('#phone-line'), help = $('#phone-help');
  const langBtns = $$('[data-lang]'), vBtns = $$('[data-v]', $('.phone-ui'));

  function paint() {
    const t = VERDICT[v].phone[lang];
    img.src = picks[v].file;
    img.alt = 'A coffee leaf photo on the phone screen';
    res.dataset.verdict = v;
    res.lang = lang === 'sw' ? 'sw' : 'en';
    help.lang = res.lang;
    $('.result__icon', res).replaceChildren(icon(ICON[v]));
    word.textContent = t.word;
    line.textContent = t.sub;
    help.textContent = t.help;
    langBtns.forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.lang === lang)));
    vBtns.forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.v === v)));
  }
  langBtns.forEach((b) => b.addEventListener('click', () => { lang = b.dataset.lang; paint(); }));
  vBtns.forEach((b) => b.addEventListener('click', () => { v = b.dataset.v; paint(); }));
  paint();
}

/** What a phone gets if it reads only the AI's plain yes or no, with no score and no cut-off. */
function initPlain() {
  const box = $('#plain');
  if (!box || !PLAIN || !PLAIN.length) return;
  const name = (r) => {
    const set = r.renderSet === 'v3' ? ', set 3' : r.renderSet === 'combo' ? ', set 4' : '';
    if (r.arm === 'zeroshot') return 'Untrained AI';
    if (r.arm === 'real') return `Real photos, ${r.realPct}% of them`;
    if (r.arm === 'syn') return `Practice photos only${set}`;
    return `Both together, ${r.realPct}% of the real photos${set}`;
  };
  const f = (v) => (v == null ? '-' : (v * 100).toFixed(1));
  const head = ['Version', 'Right answers', 'Rust found', 'Healthy leaves, right', 'Phoma leaves, right'];
  const rows = PLAIN.map((r) => [name(r), f(r.acc), f(r.sens), f(r.healthyOk), f(r.otherOk)]);
  const table = h('table', null,
    h('caption', null, `The plain yes or no, on the ${int(COUNTS.uganda.kept)} Uganda photos. Out of 100.`),
    h('thead', null, h('tr', null, head.map((c) => h('th', { scope: 'col' }, c)))),
    h('tbody', null, rows.map((r) => h('tr', null, r.map((c, i) => (i === 0 ? h('th', { scope: 'row' }, c) : h('td', null, c)))))));
  box.replaceChildren(table);
}
