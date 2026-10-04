// Keyboard, wheel and touch. One gesture moves one step.
export class Input {
  constructor(app) {
    this.app = app;
    this._wheel = { acc: 0, last: 0, locked: false, timer: 0 };
    window.addEventListener('keydown', (e) => this._key(e));
    window.addEventListener('wheel', (e) => this._onWheel(e), { passive: false });
    let sx = 0, sy = 0, st = 0, moved = false;
    window.addEventListener('touchstart', (e) => {
      if (e.target.closest('[data-scroll], input, .seam')) { moved = true; return; }
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = performance.now(); moved = false;
    }, { passive: true });
    window.addEventListener('touchend', (e) => {
      if (moved) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx, dy = t.clientY - sy;
      if (performance.now() - st > 700) return;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? app.next() : app.prev());
      else if (Math.abs(dy) > 70 && Math.abs(dy) > Math.abs(dx) * 1.4) (dy < 0 ? app.next() : app.prev());
    }, { passive: true });
  }

  _key(e) {
    const a = this.app;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tgt = e.target;
    const typing = tgt.matches?.('input[type=text], textarea, select');
    if (typing) return;
    if (e.key === 'Escape') { a.action('closeSheet'); a.action('closeOverlays'); return; }
    // let sliders and the seam keep their own arrow keys
    const ownsArrows = tgt.matches?.('input[type=range], .seam');
    const onButton = tgt.matches?.('button, a');
    switch (e.key) {
      case 'ArrowRight': case 'PageDown':
        if (ownsArrows && e.key === 'ArrowRight') return;
        e.preventDefault(); a.next(); break;
      case 'ArrowLeft': case 'PageUp':
        if (ownsArrows && e.key === 'ArrowLeft') return;
        e.preventDefault(); a.prev(); break;
      case 'ArrowDown': if (ownsArrows) return; e.preventDefault(); a.next(); break;
      case 'ArrowUp': if (ownsArrows) return; e.preventDefault(); a.prev(); break;
      case ' ': case 'Enter':
        if (onButton) return;
        e.preventDefault(); a.next(); break;
      case 'Home': e.preventDefault(); a.go(0); break;
      case 'End': e.preventDefault(); a.go(a.count - 1); break;
      case 's': case 'S': a.seam.flip(); break;
      case 'n': case 'N': a.toggleNotes(); break;
      case 'f': case 'F': a.fullscreen(); break;
      case 'q': case 'Q': a.setLite(!a.lite); break;
      case 'p': case 'P': a.togglePause(); break;
      case '?': a.toggleKeys(); break;
      default: break;
    }
  }

  _onWheel(e) {
    if (e.target.closest?.('[data-scroll], input, .notes')) return;
    if (this.app.panels.sheetOpen) return;
    e.preventDefault();
    const w = this._wheel, now = performance.now();
    if (now - w.last > 220) w.acc = 0;
    w.last = now;
    const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (w.locked) {
      // keep the lock while the trackpad is still gliding
      if (Math.abs(d) > 4) { clearTimeout(w.timer); w.timer = setTimeout(() => { w.locked = false; }, 240); }
      return;
    }
    w.acc += d;
    if (Math.abs(w.acc) > 70) {
      (w.acc > 0 ? this.app.next() : this.app.prev());
      w.acc = 0; w.locked = true;
      clearTimeout(w.timer);
      w.timer = setTimeout(() => { w.locked = false; }, 650);
    }
  }
}
