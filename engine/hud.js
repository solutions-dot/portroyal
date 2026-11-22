/* engine/hud.js: small rules for the words on the screen that every game shares (owner's rule 10: fix it here, not game by game).
   hudTidy() is called once by each game's main.js. Every game has a toast (#toast, a line of words that comes up for a few seconds) and an action button (#talk).
   - The toast sits just above the action button, however tall the button is. With a two-line label ("Go back to the street") the button covered the toast on a
     phone (Port Royal, 17 November 2026).
   - The toast wraps its words. On one line with the end cut off, a long sentence could not be read on a narrow phone.
   - On short screens, the place caption steps aside while a toast is visible.
   - The "This way" arrow (#nudge) is a brighter gold with a glow. */
const HUD_CSS = '#nudge svg path{fill:#ffd65c;stroke:#fff6dc;stroke-width:2.5}#nudge svg{filter:drop-shadow(0 0 7px rgba(255,214,92,.95)) drop-shadow(0 0 2px rgba(255,255,255,.8))}#nudge span{color:#fff;background:rgba(16,34,43,.92)}@media(max-height:460px){#hud:has(#toast:not([hidden])) #place{visibility:hidden}}';   /* the "This way" arrow: brighter, with a glow (owner, 17 November 2026), the same in every game */
/* The Journal button (owner, 22 November 2026: "the Journal button can shrink in size and the number placed at the top and to the right of the
   word"). A smaller button, still at least 44 px tall to tap on a phone; the count of new pages sits as a badge on its top right corner.
   Put in at import, before engine/exit.js copies the Journal button's size for the Exit button, so the two still match. */
export const JOURNAL_CSS = '#jbtn{padding:.35em .75em!important;font-size:.92rem!important;min-height:44px!important;gap:0!important}'
  + '#jcount{position:absolute;top:-9px;right:-9px;min-width:1.55em;height:1.55em;padding:0 .3em;font-size:.72rem!important;line-height:1;box-shadow:0 1px 3px rgba(0,0,0,.4);pointer-events:none}';
if (typeof document !== 'undefined' && !document.getElementById('hudJournalCss')) { const st = document.createElement('style'); st.id = 'hudJournalCss'; st.textContent = JOURNAL_CSS; (document.head || document.documentElement).appendChild(st); }
/* the badge is placed against the button itself: engine/exit.js puts the button in a row and makes it static, so make it relative again */
function journalBadge() { const jb = document.getElementById('jbtn'); if (jb && getComputedStyle(jb).position === 'static') { jb.style.position = 'relative'; jb.style.top = jb.style.right = jb.style.bottom = jb.style.left = 'auto'; } }   /* relative with the game's own top and right would shift it */

/* The goal banner (owner, 21 November 2026: "The goal can be missed on the top left... put it centred on screen, even for a moment, then an anchor
   to open it again"; 22 November: "the flag should be a permanent button like Journal; only the goal should hide and show when you toggle the flag").
   The goal box is a flag button that is always there. When the goal's words change, they show large in the middle of the screen for a few seconds,
   then shrink into the flag, which flashes. Tapping the flag shows the goal in the middle; tapping it again hides it. It waits while a card, a talk, the journal or the title is open, and never blocks a tap. */
export const BANNER_MS = 2800;
export const BUSY_IDS = ['title', 'card', 'dialogue', 'journal', 'chapters', 'puzzle', 'decl', 'quizpanel', 'exitask', 'chcard', 'aftercard'];
/* should a change of goal words show the banner? Not when empty, not the same words again, not a "Well done" line that ends a chapter */
export function bannerWanted(text, last) { const t = String(text || '').trim(); return !!t && t !== last && t.length <= 160; }
const FLAG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6 21V3' stroke='%23ffd65c' stroke-width='2.4' stroke-linecap='round'/%3E%3Cpath d='M7 3.6h11.2l-2.6 4.2 2.6 4.2H7z' fill='%23ffd65c'/%3E%3C/svg%3E";
const BANNER_CSS = '#goalbanner{position:fixed;left:50%;top:30%;transform:translate(-50%,-50%);z-index:60;max-width:min(30rem,calc(100% - 32px));width:max-content;'
  + 'background:rgba(16,34,43,.94);color:#fff6dc;border:2px solid #ffd65c;border-radius:12px;padding:.7em 1.1em;font-size:clamp(1.05rem,3.6vw,1.45rem);font-weight:700;'
  + 'line-height:1.3;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.45);pointer-events:none;opacity:0;transition:opacity .45s ease,transform .5s ease}'
  + '#goalbanner.on{opacity:1}#goalbanner.off{opacity:0}#goalbanner[hidden]{display:none}'
  + '#goalbanner small{display:block;font-size:.62em;font-weight:600;opacity:.8;letter-spacing:.04em;margin-bottom:.15em}'
  + '@media (prefers-reduced-motion: reduce){#goalbanner,#goalbanner.off{transition:opacity .2s}#goal.goalicon.fresh{animation:none!important;box-shadow:0 0 0 4px rgba(255,214,92,.7)!important}}'
  /* the goal box becomes a round flag icon (owner, 22 November 2026: "an icon they can click on at any time to see the goal, that flashes when there
     is a new one"). The words stay inside it, so screen readers and the games' own code still read them; only the look changes. */
  + '#goal.goalicon{width:46px!important;height:46px!important;min-width:46px!important;max-width:46px!important;flex:0 0 46px!important;padding:0!important;'
  + 'border:2px solid #ffd65c!important;border-radius:10px!important;font-size:0!important;line-height:0!important;color:transparent!important;overflow:hidden!important;white-space:nowrap!important;cursor:pointer;'
  + 'background:rgba(16,34,43,.92) url("' + FLAG + '") center/24px 24px no-repeat!important;box-shadow:0 2px 8px rgba(0,0,0,.35)!important}'
  + '#goal.goalicon{order:-1!important;align-self:flex-start!important}'   /* in a flex row (Bog Walk) the flag comes first, at the top left, like every game */
  + '#goal.goalicon *{font-size:0!important}#goal.goalicon:empty{display:none!important}'
  + '#goal.goalicon.fresh{animation:goalpulse 1.1s ease-in-out 5}'
  + '@keyframes goalpulse{0%,100%{box-shadow:0 0 0 0 rgba(255,214,92,0),0 2px 8px rgba(0,0,0,.35)}50%{box-shadow:0 0 0 8px rgba(255,214,92,.6),0 2px 8px rgba(0,0,0,.35)}}';
/* is anything in front of the game? a card, a talk, the journal, the title, or the chapter fade (#fade) still dark */
const shown = (e) => !!e && !e.hidden && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden';
export function screenBusy() {
  const fade = document.getElementById('fade');
  return BUSY_IDS.some((id) => shown(document.getElementById(id))) || document.body.classList.contains('talking') || document.body.classList.contains('talk') || (shown(fade) && parseFloat(getComputedStyle(fade).opacity) > 0.05);
}
/* once per device, when the screen is clear: the "Who you are" card at the start of each game (owner, 21 November 2026). Not in test views. */
let pending = 0;   /* a "who you are" card still to come: the goal banner waits for it, so the card comes first */
export function onceWhenClear(key, fn) {
  try { if (localStorage.getItem(key)) return; } catch { /* storage blocked: show it */ }
  const q = new URLSearchParams(location.search); if (q.has('test') || q.has('shot') || q.has('auto')) return;
  pending++;
  const tick = () => { if (screenBusy()) { setTimeout(tick, 300); return; } try { localStorage.setItem(key, '1'); } catch { /* ignore */ } pending--; fn(); };
  setTimeout(tick, 400);
}

function goalBanner(goalId) {
  const g = document.getElementById(goalId); if (!g || g.dataset.banner) return; g.dataset.banner = '1';
  const st = document.createElement('style'); st.textContent = BANNER_CSS; document.head.appendChild(st);
  g.classList.add('goalicon');
  /* the flag sits on the same line as the top buttons (owner, 22 November 2026: "this must be properly aligned"), whatever each game's own CSS says */
  const align = () => {
    const jb = document.getElementById('jbtn'), size = Math.round(Math.max(44, Math.min(52, jb && jb.offsetHeight ? jb.offsetHeight : 46)));   /* the same size as the top buttons, square */
    for (const k of ['width', 'height', 'min-width', 'max-width', 'min-height', 'max-height', 'flex-basis']) g.style.setProperty(k, size + 'px', 'important');
    const cs = getComputedStyle(g); if (cs.position !== 'absolute' && cs.position !== 'fixed') return;   /* in a flex row (Bog Walk) the row lines it up */
    const row = document.getElementById('jrow') || jb; if (!row) return;
    const r = row.getBoundingClientRect(); if (!r.height) return;
    const par = cs.position === 'fixed' ? { top: 0 } : (g.offsetParent || document.body).getBoundingClientRect();
    g.style.top = Math.round(r.top - par.top + (r.height - size) / 2) + 'px'; g.style.bottom = 'auto';
  };
  addEventListener('resize', align); new MutationObserver(align).observe(g, { attributes: true, attributeFilter: ['hidden'] });
  let n = 0; const early = setInterval(() => { align(); if (++n > 20) clearInterval(early); }, 250);   /* the Exit row is built after us */
  const label = () => { const t = (g.textContent || '').trim(); g.setAttribute('aria-label', t ? 'Goal: ' + t : 'Goal'); g.title = t; };
  new MutationObserver(label).observe(g, { childList: true, characterData: true, subtree: true }); label();
  const q = new URLSearchParams(location.search); if ((q.has('test') || q.has('shot') || q.has('auto')) && !q.has('banner')) return;   /* test views and screenshots keep a still screen: no banner */
  const b = document.createElement('div'); b.id = 'goalbanner'; b.hidden = true; b.setAttribute('aria-hidden', 'true');   /* the goal box itself is what a screen reader reads */
  document.body.appendChild(b);
  let last = '', timer = 0, wait = 0;
  const busy = () => screenBusy() || pending > 0;
  let fresh = false;
  g.addEventListener('animationend', () => g.classList.remove('fresh'));
  let stay = false;
  const hide = () => { clearTimeout(wait); clearTimeout(timer); stay = false; if (b.hidden) return; b.classList.add('off'); b.classList.remove('on'); timer = setTimeout(() => { b.hidden = true; }, 450); };
  const show = (text, tries = 0) => {
    clearTimeout(wait); clearTimeout(timer);
    if ((g.textContent || '').trim() !== text) { b.hidden = true; return; }   /* the goal moved on while we waited */
    if (busy()) { wait = setTimeout(() => show(text, tries + 1), 400); return; }   /* wait for the title, a card or a talk to close, however long */
    b.innerHTML = ''; const sm = document.createElement('small'); sm.textContent = 'Goal'; b.append(sm, document.createTextNode(text));
    b.style.transform = ''; b.hidden = false; b.classList.remove('off'); void b.offsetWidth; b.classList.add('on');
    if (stay) { const watch = () => { if (b.hidden) return; if (busy() || (g.textContent || '').trim() !== text) { hide(); return; } timer = setTimeout(watch, 400); }; timer = setTimeout(watch, 400); return; }   /* opened with the flag: stays until the flag is tapped again, a talk or card opens, or the goal changes */
    timer = setTimeout(() => {
      const gr = g.getBoundingClientRect(), br = b.getBoundingClientRect();   /* the banner shrinks into the goal box, then the box comes back */
      if (gr.width > 0) b.style.transform = `translate(calc(-50% + ${(gr.left + gr.width / 2) - (br.left + br.width / 2)}px), calc(-50% + ${(gr.top + gr.height / 2) - (br.top + br.height / 2)}px)) scale(.45)`;
      b.classList.add('off'); b.classList.remove('on');
      timer = setTimeout(() => { b.hidden = true; if (fresh) { g.classList.remove('fresh'); void g.offsetWidth; g.classList.add('fresh'); } }, 500);   /* a new goal: the icon flashes a few times */
    }, BANNER_MS);
  };
  const check = () => { const t = (g.textContent || '').trim(); if (!bannerWanted(t, last)) { if (!t) last = ''; return; } last = t; fresh = true; stay = false; show(t); };
  new MutationObserver(check).observe(g, { childList: true, characterData: true, subtree: true });
  g.addEventListener('click', () => { const t = (g.textContent || '').trim(); g.classList.remove('fresh'); if (!b.hidden && b.classList.contains('on')) { hide(); return; } if (t) { fresh = false; stay = true; show(t); } });   /* the flag is a toggle: tap to show the goal, tap again to hide it */
  setTimeout(check, 0);
}

export function hudTidy({ toast = 'toast', button = 'talk', gap = 10, goal = 'goal' } = {}) {
  goalBanner(goal); journalBadge();
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
