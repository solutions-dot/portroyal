/* engine/hud.js: small rules for the words on the screen that every game shares (owner's rule 10: fix it here, not game by game).
   hudTidy() is called once by each game's main.js. Every game has a toast (#toast, a line of words that comes up for a few seconds) and an action button (#talk).
   - The toast sits just above the action button, however tall the button is. With a two-line label ("Go back to the street") the button covered the toast on a
     phone (Port Royal, 17 November 2026).
   - The toast wraps its words. On one line with the end cut off, a long sentence could not be read on a narrow phone.
   - On short screens, the place caption steps aside while a toast is visible.
   - The "This way" arrow (#nudge) is a brighter gold with a glow. */
const HUD_CSS = '#nudge svg path{fill:#ffd65c;stroke:#fff6dc;stroke-width:2.5}#nudge svg{filter:drop-shadow(0 0 7px rgba(255,214,92,.95)) drop-shadow(0 0 2px rgba(255,255,255,.8))}#nudge span{color:#fff;background:rgba(16,34,43,.92)}@media(max-height:460px){#hud:has(#toast:not([hidden])) #place{visibility:hidden}}';   /* the "This way" arrow: brighter, with a glow (owner, 17 November 2026), the same in every game */
export function hudTidy({ toast = 'toast', button = 'talk', gap = 10 } = {}) {
  if (!document.getElementById('hudTidyCss')) { const s = document.createElement('style'); s.id = 'hudTidyCss'; s.textContent = HUD_CSS; document.head.appendChild(s); }
  const t = document.getElementById(toast); if (!t || t.dataset.tidy) return; t.dataset.tidy = '1';
  Object.assign(t.style, { whiteSpace: 'normal', width: 'max-content', lineHeight: '1.3', overflow: 'visible', textOverflow: 'clip' });
  let was = '';
  const fit = () => {
    if (!t.hidden) { const k = document.getElementById(button), cs = k && getComputedStyle(k), r = k && !k.hidden && cs.display !== 'none' && cs.visibility !== 'hidden' ? k.getBoundingClientRect() : null;
      t.style.bottom = ''; const base = parseFloat(getComputedStyle(t).bottom) || 128, want = r && r.height > 1 ? Math.max(base, innerHeight - r.top + gap) : base;   /* the style sheet's own place when no button is up */
      const v = want + 'px'; t.style.bottom = v; was = v; }
    else if (was) { t.style.bottom = ''; was = ''; } };
  const place = () => { fit(); requestAnimationFrame(place); };
  requestAnimationFrame(place);
  /* Also at once when the toast or the button comes up or changes its words, not only on the next drawn frame: on a slow phone (and in the layout test, where
     frames are rare) the toast lay across the button until a frame was drawn (Kendal at 390x800, 17 November 2026). Only `hidden`, the class and the words are
     watched, never the style this rule sets itself. */
  if (typeof MutationObserver !== 'undefined') { const mo = new MutationObserver(fit), k = document.getElementById(button), what = { attributes: true, attributeFilter: ['hidden', 'class'], childList: true, characterData: true, subtree: true };
    mo.observe(t, what); if (k) mo.observe(k, what); }
}
