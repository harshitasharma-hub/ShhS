// The phone sketch and the "will it run on a phone" facts. The photos and answers are real model output; the app itself is not built yet.
import { $, $$, h, icon, int } from '../lib/dom.js';
import { PHOTOS, SCORES, PLAIN, COUNTS } from '../data/generated.js';
import { marginFor, verdictOf, scoreFor, VERDICT } from '../lib/verdict.js';
import { tableTwin } from '../lib/charts.js';

const ICON = { yes: 'spots', no: 'check', unsure: 'ask' };

export function initModel() {
  initPhone();
  initPlain();
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
