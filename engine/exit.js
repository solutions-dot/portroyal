/* engine/exit.js: an Exit button beside the Journal button, in every game (owner, 19 November 2026: "Main Menu" left the journal pages; one Exit,
   to the right of the Journal button, with an "are you sure" that says the progress is kept on this device).
   addExit({ url, save }): url is the menu, save() (if given) saves first. The button copies the Journal button's look and follows it: shown when it
   shows, hidden when it hides. Escape or "Keep playing" closes the question. */
const CSS = `#exitask{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);padding:16px}
#exitask[hidden]{display:none}
#exitask .ex{background:var(--paper,#f1e7d3);color:var(--paper-ink,#2a2418);border-radius:10px;padding:20px 22px;max-width:22rem;width:100%;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.5)}
#exitask h2{margin:0 0 .35em;font-family:var(--display,inherit);font-size:1.5rem}
#exitask p{margin:0 0 1em;font-size:1rem;line-height:1.4}
#exitask .exb{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
#exitask button{min-height:44px;min-width:7.5rem;padding:.5em 1em;border-radius:8px;font:inherit;font-weight:700;cursor:pointer;border:2px solid var(--paper-ink,#2a2418)}
#exitask .go{background:var(--paper-ink,#2a2418);color:var(--paper,#f1e7d3)}
#exitask .stay{background:transparent;color:var(--paper-ink,#2a2418)}`;
const COPY = ['backgroundColor', 'color', 'borderTopWidth', 'borderTopStyle', 'borderTopColor', 'borderRadius', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'lineHeight', 'height', 'minHeight', 'textTransform'];

export function addExit({ url = '../../../menu/', save = null } = {}) {
  const jb = document.getElementById('jbtn'); if (!jb || document.getElementById('exitbtn')) return null;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  const btn = document.createElement('button'); btn.id = 'exitbtn'; btn.type = 'button'; btn.textContent = 'Exit'; btn.setAttribute('aria-label', 'Exit the game');
  const cs = getComputedStyle(jb);
  if (cs.position === 'absolute' || cs.position === 'fixed') {   /* the Journal button is pinned on its own: pin a row in its place and put both in it */
    const row = document.createElement('div'); row.id = 'jrow';
    row.style.cssText = `position:${cs.position};top:${cs.top};right:${cs.right};left:${cs.left === 'auto' ? 'auto' : cs.left};bottom:${cs.bottom === 'auto' ? 'auto' : cs.bottom};z-index:${cs.zIndex};display:flex;gap:8px;align-items:center`;
    jb.parentNode.insertBefore(row, jb); row.appendChild(jb); jb.style.position = 'static'; row.appendChild(btn);
  } else jb.insertAdjacentElement('afterend', btn);
  for (const k of COPY) btn.style[k] = cs[k]; btn.style.borderRightWidth = btn.style.borderBottomWidth = btn.style.borderLeftWidth = cs.borderTopWidth; btn.style.borderStyle = cs.borderTopStyle; btn.style.borderColor = cs.borderTopColor;
  btn.style.cursor = 'pointer'; btn.style.whiteSpace = 'nowrap';
  const ask = document.createElement('div'); ask.id = 'exitask'; ask.hidden = true; ask.setAttribute('role', 'dialog'); ask.setAttribute('aria-modal', 'true'); ask.setAttribute('aria-labelledby', 'exitq');
  ask.innerHTML = '<div class="ex"><h2 id="exitq">Exit?</h2><p>Your progress is saved on this device.</p><div class="exb"><button class="stay" type="button">Keep playing</button><button class="go" type="button">Exit</button></div></div>';
  document.body.appendChild(ask);
  const close = () => { ask.hidden = true; btn.focus(); };
  btn.addEventListener('click', (e) => { e.stopPropagation(); dispatchEvent(new Event('blur')); ask.hidden = false; ask.querySelector('.stay').focus(); });   /* every game lets go of held keys and the joystick on blur, so a walk does not carry on behind the question (Codex review) */
  ask.querySelector('.stay').addEventListener('click', (e) => { e.stopPropagation(); close(); });
  ask.querySelector('.go').addEventListener('click', (e) => { e.stopPropagation(); try { if (save) save(); } catch (err) { /* leave anyway */ } location.href = url; });
  ask.addEventListener('click', (e) => { if (e.target === ask) close(); });
  ask.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Escape') close(); });   /* the game's own keys stay quiet while the question is up */
  for (const t of ['pointerdown', 'touchstart']) ask.addEventListener(t, (e) => e.stopPropagation(), { passive: true });   /* key releases still reach the game, so nothing stays held */
  const follow = () => { const show = !jb.hidden && getComputedStyle(jb).display !== 'none' && getComputedStyle(jb).visibility !== 'hidden'; btn.style.display = show ? '' : 'none'; };
  new MutationObserver(follow).observe(jb, { attributes: true }); setInterval(follow, 500); follow();
  return btn;
}
