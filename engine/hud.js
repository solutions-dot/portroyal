/* engine/hud.js: small rules for the words on the screen that every game shares (owner's rule 10: fix it here, not game by game).
   hudTidy() is called once by each game's main.js. Every game has a toast (#toast, a line of words that comes up for a few seconds) and an action button (#talk).
   - The toast sits just above the action button, however tall the button is. With a two-line label ("Go back to the street") the button covered the toast on a
     phone (Port Royal, 17 November 2026).
   - The toast wraps its words. On one line with the end cut off, a long sentence could not be read on a narrow phone. */
export function hudTidy({ toast = 'toast', button = 'talk', gap = 10 } = {}) {
  const t = document.getElementById(toast); if (!t || t.dataset.tidy) return; t.dataset.tidy = '1';
  Object.assign(t.style, { whiteSpace: 'normal', width: 'max-content', lineHeight: '1.3', overflow: 'visible', textOverflow: 'clip' });
  let was = '';
  const place = () => {
    if (!t.hidden) { const k = document.getElementById(button), cs = k && getComputedStyle(k), r = k && !k.hidden && cs.display !== 'none' && cs.visibility !== 'hidden' ? k.getBoundingClientRect() : null;
      t.style.bottom = ''; const base = parseFloat(getComputedStyle(t).bottom) || 128, want = r && r.height > 1 ? Math.max(base, innerHeight - r.top + gap) : base;   /* the style sheet's own place when no button is up */
      const v = want + 'px'; t.style.bottom = v; was = v; }
    else if (was) { t.style.bottom = ''; was = ''; }
    requestAnimationFrame(place); };
  requestAnimationFrame(place);
}
