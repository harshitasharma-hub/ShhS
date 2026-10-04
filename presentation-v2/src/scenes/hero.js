// Hero: a real test photo, and the real answer our best model gave. Truth is shown under it, right or wrong.
import { $, $$, h, icon } from '../lib/dom.js';
import { state, scene } from '../lib/engine.js';
import { PHOTOS, SCORES } from '../data/generated.js';
import { marginFor, verdictOf, isRight, truthText, scoreFor, VERDICT } from '../lib/verdict.js';

const ICON = { yes: 'spots', no: 'check', unsure: 'ask' };

export function initHero() {
  const vf = $('#vf');
  const img = $('#vf-img');
  const res = $('#vf-result');
  const word = $('.result__word', res);
  const sub = $('#vf-sub');
  const glyph = $('.result__icon', res);
  const truth = $('#vf-truth');
  const note = $('#vf-note');
  const thumbs = $('#vf-thumbs');
  const nextBtn = $('#vf-next');
  const autoBtn = $('#vf-auto');
  const list = (PHOTOS || []).filter((p) => p.hero);
  if (!list.length || !SCORES || !SCORES.mix) { vf.hidden = true; return; }

  const baseNote = note.textContent;
  const margin = marginFor('mix');
  let i = -1, timer = null, auto = true, visible = true, token = 0;

  list.forEach((p, n) => {
    const pre = new Image(); pre.decoding = 'async'; pre.src = p.file;
    thumbs.append(h('li', null, h('button', { type: 'button', 'aria-label': `Leaf ${n + 1} of ${list.length}`, style: { backgroundImage: `url(${p.file})` }, onclick: () => { stop(); show(n); } })));
  });

  const paintThumbs = () => $$('button', thumbs).forEach((b, n) => b.setAttribute('aria-current', String(n === i)));

  function setChip(v) {
    res.dataset.verdict = v || '';
    glyph.replaceChildren(icon(ICON[v] || 'spots'));
    if (!v) { word.textContent = 'Reading the leaf'; sub.textContent = ''; return; }
    word.textContent = VERDICT[v].word;
    sub.textContent = VERDICT[v].gloss;
    res.classList.remove('is-new'); void res.offsetWidth; res.classList.add('is-new');
  }

  function show(n) {
    const my = ++token;
    i = (n + list.length) % list.length;
    const p = list[i];
    paintThumbs();
    setChip(null);
    truth.replaceChildren();
    img.classList.add('is-out');
    setTimeout(() => {
      if (my !== token) return;
      img.src = p.file;
      img.alt = `A coffee leaf from the BRACOL test set. Truth: ${truthText(p)}.`;
      note.textContent = `${baseNote} Photo: BRACOL test #${p.id.replace(/^b/, '')}, CC BY 4.0.`;
      requestAnimationFrame(() => {
        img.classList.remove('is-out');
        setTimeout(() => finish(p, my), state.motion ? 700 : 40);
      });
    }, state.motion ? 260 : 0);
  }

  function finish(p, my) {
    if (my !== token) return;
    const v = verdictOf(scoreFor('mix', p), 'mix', margin);
    setChip(v);
    const right = isRight(v, p.rust);
    truth.replaceChildren(
      h('span', null, `The label from the dataset: ${truthText(p)}.`),
      h('span', { class: v === 'unsure' ? '' : right ? 'ok' : 'bad' },
        v === 'unsure' ? null : icon(right ? 'check' : 'cross'),
        v === 'unsure' ? 'The AI asks for a person here.' : right ? 'The AI was right.' : 'The AI was wrong. We show these too.'));
  }

  function syncAuto() {
    const paused = !auto;
    autoBtn.setAttribute('aria-pressed', String(paused));
    autoBtn.querySelector('span').textContent = paused ? 'Play' : 'Pause';
    autoBtn.setAttribute('aria-label', paused ? 'Resume the automatic change of leaf' : 'Pause the automatic change of leaf');
  }
  function stop() { auto = false; clearInterval(timer); syncAuto(); }
  function startAuto() {
    clearInterval(timer);
    if (!auto || !state.motion) return;
    timer = setInterval(() => { if (visible && !document.hidden) show(i + 1); }, 7000);
  }

  nextBtn.addEventListener('click', () => { stop(); show(i + 1); });
  autoBtn.addEventListener('click', () => { if (auto) stop(); else { auto = true; syncAuto(); startAuto(); } });
  window.addEventListener('keydown', (e) => {
    if (!visible || e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.key === 'ArrowRight') { stop(); show(i + 1); }
    if (e.key === 'ArrowLeft') { stop(); show(i - 1); }
  });
  scene($('#top'), { onVisible: (v) => { visible = v; } });
  document.addEventListener('motionchange', () => { if (!state.motion) stop(); });

  show(0);
  startAuto();
}
