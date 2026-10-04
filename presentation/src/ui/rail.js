import { BEATS, CHAPTERS } from '../content.js';

// The bar at the bottom shows where you are in the talk. Each chapter is as wide as its share of the talk.
// It is a display only. You move with the arrow keys or the scroll wheel.
export class Rail {
  constructor() {
    this.ol = document.getElementById('railChapters');
    this.segs = CHAPTERS.map((c) => {
      const li = document.createElement('li');
      li.style.flex = `${c.dur} 1 0`;
      const seg = document.createElement('span');
      seg.className = 'rail__seg';
      seg.innerHTML = `<span class="rail__name">${c.name}</span>`;
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
    document.getElementById('hudChapter').textContent = CHAPTERS[ci].name;
  }
}
