import { BEATS, CHAPTERS } from '../content.js';

// The bar at the bottom shows where you are in the talk. Each chapter is as wide as its share of the talk.
// Click a chapter to jump to its first step. The arrow keys and the scroll wheel still move one step at a time.
export class Rail {
  constructor(onGo) {
    this.ol = document.getElementById('railChapters');
    this.segs = CHAPTERS.map((c) => {
      const li = document.createElement('li');
      li.style.flex = `${c.dur} 1 0`;
      li.style.setProperty('--w', `${Math.ceil(c.name.length * 7.4 + 22)}px`);       // a pill is never narrower than its name
      const seg = document.createElement('button');
      seg.type = 'button';
      seg.className = 'rail__seg';
      seg.setAttribute('aria-label', `Go to ${c.name}`);
      seg.innerHTML = `<span class="rail__name">${c.name}</span>`;
      // the whole list item takes the click, so the strip is easy to hit on a phone
      li.addEventListener('click', (e) => {
        onGo(BEATS.findIndex((b) => b.chapter === c.id));
        if (e.detail > 0) seg.blur(); // a mouse click must not leave the button focused, or Space would jump back here
      });
      li.appendChild(seg);
      this.ol.appendChild(li);
      return seg;
    });
  }

  update(i) {
    const beat = BEATS[i];
    const ci = CHAPTERS.findIndex((c) => c.id === beat.chapter);
    const inChapter = BEATS.filter((b) => b.chapter === beat.chapter);
    const within = inChapter.findIndex((b) => b.id === beat.id) + 1;
    this.segs.forEach((seg, k) => {
      seg.classList.toggle('is-past', k < ci);
      seg.classList.toggle('is-current', k === ci);
      seg.style.setProperty('--pf', k < ci ? '1' : k === ci ? String(within / inChapter.length) : '0');
      if (k === ci) seg.setAttribute('aria-current', 'step'); else seg.removeAttribute('aria-current');
    });
  }
}
