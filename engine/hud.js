/* engine/hud.js: small rules for the words on the screen that every game shares (owner's rule 10: fix it here, not game by game).
   hudTidy() is called once by each game's main.js. Every game has a toast (#toast, a line of words that comes up for a few seconds) and an action button (#talk).
   - The toast sits just above the action button, however tall the button is. With a two-line label ("Go back to the street") the button covered the toast on a
     phone (Port Royal, 17 November 2026).
   - The toast wraps its words. On one line with the end cut off, a long sentence could not be read on a narrow phone.
   - On short screens, the place caption steps aside while a toast is visible.
   - The "This way" arrow (#nudge) is a brighter gold with a glow. */
const HUD_CSS = '#nudge svg path{fill:#ffd65c;stroke:#fff6dc;stroke-width:2.5}#nudge svg{filter:drop-shadow(0 0 7px rgba(255,214,92,.95)) drop-shadow(0 0 2px rgba(255,255,255,.8))}#nudge span{color:#fff;background:rgba(16,34,43,.92)}@media(max-height:460px){#hud:has(#toast:not([hidden])) #place{visibility:hidden}}';   /* the "This way" arrow: brighter, with a glow (owner, 17 November 2026), the same in every game */
/* The goal banner (owner, 21 November 2026: "The goal can be missed on the top left... put it centred on screen, even for a moment, then an anchor
   to open it again"). When the goal's words change, they show large in the middle of the screen for a few seconds, then go; the goal box stays
   where it always was, and tapping it shows the banner again. It waits while a card, a talk, the journal or the title is open, and never blocks a tap. */
export const BANNER_MS = 2800;
export const BUSY_IDS = ['title', 'card', 'dialogue', 'journal', 'chapters', 'puzzle', 'decl', 'quizpanel', 'exitask', 'chcard', 'aftercard'];
/* should a change of goal words show the banner? Not when empty, not the same words again, not a "Well done" line that ends a chapter */
export function bannerWanted(text, last) { const t = String(text || '').trim(); return !!t && t !== last && t.length <= 160; }
const BANNER_CSS = '#goalbanner{position:fixed;left:50%;top:30%;transform:translate(-50%,-50%);z-index:60;max-width:min(30rem,calc(100% - 32px));width:max-content;'
  + 'background:rgba(16,34,43,.94);color:#fff6dc;border:2px solid #ffd65c;border-radius:12px;padding:.7em 1.1em;font-size:clamp(1.05rem,3.6vw,1.45rem);font-weight:700;'
  + 'line-height:1.3;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.45);pointer-events:none;opacity:0;transition:opacity .35s ease,transform .5s ease}'
  + '#goalbanner.on{opacity:1}#goalbanner.off{opacity:0;transform:translate(-50%,-50%) scale(.92)}#goalbanner[hidden]{display:none}'
  + '#goalbanner small{display:block;font-size:.62em;font-weight:600;opacity:.8;letter-spacing:.04em;margin-bottom:.15em}'
  + '@media (prefers-reduced-motion: reduce){#goalbanner,#goalbanner.off{transition:opacity .2s;transform:translate(-50%,-50%)}}';
function goalBanner(goalId) {
  const g = document.getElementById(goalId); if (!g || g.dataset.banner) return; g.dataset.banner = '1';
  const q = new URLSearchParams(location.search); if ((q.has('test') || q.has('shot') || q.has('auto')) && !q.has('banner')) return;   /* test views and screenshots stay as they were */
  const st = document.createElement('style'); st.textContent = BANNER_CSS; document.head.appendChild(st);
  const b = document.createElement('div'); b.id = 'goalbanner'; b.hidden = true; b.setAttribute('aria-hidden', 'true');   /* the goal box itself is what a screen reader reads */
  document.body.appendChild(b);
  let last = '', timer = 0, wait = 0;
  const up = (e) => !!e && !e.hidden && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden';
  const fade = document.getElementById('fade');   /* every game's chapter title and fade to black: wait until it has cleared */
  const busy = () => BUSY_IDS.some((id) => up(document.getElementById(id))) || document.body.classList.contains('talking') || (up(fade) && parseFloat(getComputedStyle(fade).opacity) > 0.05);
  const show = (text, tries = 0) => {
    clearTimeout(wait); clearTimeout(timer);
    if ((g.textContent || '').trim() !== text) return;   /* the goal moved on while we waited */
    if (busy()) { wait = setTimeout(() => show(text, tries + 1), 400); return; }   /* wait for the title, a card or a talk to close, however long */
    b.innerHTML = ''; const sm = document.createElement('small'); sm.textContent = 'Goal'; b.append(sm, document.createTextNode(text));
    b.hidden = false; b.classList.remove('off'); void b.offsetWidth; b.classList.add('on');
    timer = setTimeout(() => { b.classList.add('off'); b.classList.remove('on'); timer = setTimeout(() => { b.hidden = true; }, 550); }, BANNER_MS);
  };
  const check = () => { const t = (g.textContent || '').trim(); if (!bannerWanted(t, last)) { if (!t) last = ''; return; } last = t; show(t); };
  new MutationObserver(check).observe(g, { childList: true, characterData: true, subtree: true });
  g.addEventListener('click', () => { const t = (g.textContent || '').trim(); if (t) show(t); });   /* the anchor: tap the goal to see it big again */
  setTimeout(check, 0);
}

export function hudTidy({ toast = 'toast', button = 'talk', gap = 10, goal = 'goal' } = {}) {
  goalBanner(goal);
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
