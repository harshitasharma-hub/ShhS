// Try it: pick a real test photo and see what each version said. Real scores, including the wrong ones.
import { $, $$, h, icon } from '../lib/dom.js';
import { PHOTOS, SCORES } from '../data/generated.js';
import { MODELS, VERDICT, marginFor, verdictOf, isRight, truthText, scoreFor, gaugePos, gaugeBand } from '../lib/verdict.js';

export function initTryit() {
  const tray = $('#tray');
  if (!tray || !PHOTOS || !PHOTOS.length || !SCORES) return;
  const models = MODELS.filter((m) => SCORES[m.key]);
  const margins = Object.fromEntries(models.map((m) => [m.key, marginFor(m.key)]));
  let cur = 0;

  const sets = [['bracol', 'Clean photos (BRACOL test)'], ['uganda', 'Real farm photos (Uganda)']];
  const order = [];
  sets.forEach(([key, label]) => {
    tray.append(h('p', { class: 'tray__sep', role: 'presentation' }, label));
    PHOTOS.filter((p) => p.set === key).forEach((p) => {
      const i = PHOTOS.indexOf(p);
      order.push(i);
      tray.append(h('button', { type: 'button', 'aria-pressed': 'false', 'aria-label': `${key === 'bracol' ? 'BRACOL' : 'Uganda'} photo ${p.id}`, 'data-i': i, style: { backgroundImage: `url(${p.file})` }, onclick: () => select(i) }));
    });
  });

  const img = $('#try-img'), tag = $('#try-tag'), truth = $('#try-truth'), list = $('#try-models'), note = $('#try-note'), photo = $('#try-photo');

  const verdictFor = (p, key) => verdictOf(scoreFor(key, p), key, margins[key]);

  /** What the photo shows (from the stored note, without its talk of models), then what each version said, worked out from the scores. */
  function describe(p) {
    const what = (p.note || '').split(/\.\s+(?=[A-Z])/).map((t) => t.replace(/\.$/, '')).filter((t) => t && !/\bmodels?\b|\bmix score\b|threshold/i.test(t)).join('. ');
    const wrong = [], unsure = [];
    models.forEach((m) => {
      const v = verdictFor(p, m.key);
      if (!v) return;
      if (v === 'unsure') unsure.push(m.name); else if (!isRight(v, p.rust)) wrong.push(m.name);
    });
    const bits = [];
    if (!wrong.length && !unsure.length) bits.push('Every version gets it right.');
    else {
      bits.push(wrong.length === models.length ? 'Every version gets it wrong.' : wrong.length ? `Wrong: ${wrong.join(', ')}.` : 'No version is wrong.');
      if (unsure.length) bits.push(`Not sure: ${unsure.join(', ')}.`);
    }
    return `${what}${what ? '. ' : ''}${bits.join(' ')}`;
  }

  function select(i) {
    cur = i;
    const p = PHOTOS[i];
    $$('button', tray).forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.i) === i)));
    photo.dataset.set = p.set;
    img.src = p.file;
    img.alt = `${p.set === 'bracol' ? 'A BRACOL' : 'A Uganda'} coffee leaf photo. Truth: ${truthText(p)}.`;
    tag.replaceChildren(h('span', { class: 'tag' }, 'Real photo'), `${p.set === 'bracol' ? 'BRACOL test #' + p.id.replace(/^b/, '') : 'Uganda ' + p.id.replace(/^u_/, '')}, CC BY 4.0`);
    truth.replaceChildren('The label from the dataset: ', h('b', null, truthText(p)));
    note.textContent = describe(p);
    paint();
  }

  function paint() {
    const p = PHOTOS[cur];
    list.replaceChildren(...models.map((m) => {
      const sc = scoreFor(m.key, p);
      if (sc == null) return h('li', { class: `model-row ${m.cls}` }, h('h5', null, m.name), h('span', { class: 'verdict' }, 'n/a'));
      const mv = verdictFor(p, m.key);
      const right = isRight(mv, p.rust);
      const pos = gaugePos(sc, m.key) * 100;
      const [bl, bh] = gaugeBand(margins[m.key], m.key);
      return h('li', { class: `model-row ${m.cls}` },
        h('div', null, h('h5', null, m.name), h('small', null, `${m.sub}. Score ${sc >= 0 ? '+' : ''}${sc.toFixed(1)}`)),
        h('span', { class: 'verdict', 'data-v': mv }, mv === 'unsure' ? null : icon(right ? 'check' : 'cross'), VERDICT[mv].short),
        h('div', { class: 'gauge', 'aria-hidden': 'true' },
          h('i', { class: 'gauge__end gauge__end--l' }, 'No rust'), h('i', { class: 'gauge__end gauge__end--r' }, 'Rust'),
          h('i', { class: 'gauge__track' }),
          h('i', { class: 'gauge__band', style: { left: bl * 100 + '%', width: (bh - bl) * 100 + '%' } }),
          h('i', { class: 'gauge__cut', style: { left: '50%' } }),
          h('i', { class: 'gauge__dot', style: { left: pos + '%', '--k2': mv === 'yes' ? 'var(--rust)' : mv === 'no' ? 'var(--leaf)' : 'var(--ink-3)' } })));
    }));
  }

  // Start on a photo where the versions disagree, because that is the interesting one
  const disagree = PHOTOS.findIndex((p) => p.set === 'uganda' && new Set(models.map((m) => verdictFor(p, m.key)).filter(Boolean)).size > 1);
  select(disagree >= 0 ? disagree : 0);

  tray.addEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    const pos = order.indexOf(cur);
    const next = order[(pos + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + order.length) % order.length];
    select(next);
    $(`button[data-i="${next}"]`, tray).focus();
    e.preventDefault();
  });
}
