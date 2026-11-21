/* engine/scene-warning.js: the one card before a cinematic, the same in every game (owner, 21 November 2026).
   The card says what happens. A scene that may be scary adds the two standard lines, "It may be scary." and "Nobody is hurt on the screen.",
   so the words never drift from game to game. A scene that is only loud or big (the Selassie arrival, the Windrush ship scenes) is a plain
   choice: scary: false leaves the two lines out. The buttons are always "Watch scene" and "Read what happened instead". There is no calm mode
   (the owner, 21 November 2026): sceneIsCalm() is always false, kept so the games' calls still work.

     sceneWarning(card, { title, what, scary = true, watch, read, pairs = false })
       card     the game's card(title, lines, buttons, { col }); buttons are { t, go } objects, or [label, fn] pairs with pairs: true
       what     a line or a list of lines: what happens, in plain words
     warningText(what, scary)                           the card's one paragraph (warningLines: the same as a list)
     addSceneWarningOptions(body, watchBtn, readBtn, watch, read)   wire a card the page already has
     readWhatHappened(card, { what, go, pairs })        the card after "Read what happened instead": titled What happened, one paragraph, Go on */
export const SCARY_LINES = ['It may be scary.', 'Nobody is hurt on the screen.'];
export const WATCH = 'Watch scene';
export const READ = 'Read what happened instead';

export function sceneIsCalm() { return false; }

/* the card is centred, words and buttons, on a phone and on a desktop (owner, 21 November 2026) */
const CSS = `.scene-card,.scene-card h1,.scene-card h2,.scene-card h3,.scene-card p{text-align:center!important}
.scene-card :is(h1,h2,h3,p){margin-left:auto!important;margin-right:auto!important}
.scene-card p{max-width:26em!important;text-wrap:balance}
.scene-card :is(#cbtns,.row,.btns){display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;margin-left:auto;margin-right:auto}
.scene-card :is(#cbtns,.row,.btns)>:is(button,a){margin-left:auto!important;margin-right:auto!important;text-align:center!important;justify-content:center;
  white-space:nowrap!important;width:17.5em!important;max-width:100%!important;min-width:0!important;flex:none!important;box-sizing:border-box}
.scene-card :is(#cbtns,.row,.btns){gap:10px!important;width:100%}`;   /* both buttons one width, sized to "Read what happened instead", never wrapped */
export function centreCard(cardEl) { centre(cardEl); }   /* for a card written in the page (Tivoli) */
function centre(cardEl) {
  if (!cardEl) return;
  if (!document.getElementById('scene-card-css')) { const st = document.createElement('style'); st.id = 'scene-card-css'; st.textContent = CSS; document.head.appendChild(st); }
  cardEl.classList.add('scene-card');
  if (!cardEl.sceneWatch) {   /* closed some other way (Escape, a chapter change): the next card is a normal one */
    cardEl.sceneWatch = new MutationObserver(() => { if (cardEl.hidden) cardEl.classList.remove('scene-card'); });
    cardEl.sceneWatch.observe(cardEl, { attributes: true, attributeFilter: ['hidden'] });
  }
}
const uncentre = () => { for (const el of document.querySelectorAll('.scene-card')) el.classList.remove('scene-card'); };
export function endSceneWarning() {}

export function warningLines(what, scary = true) {
  return [...[].concat(what || []), ...(scary ? SCARY_LINES : [])];
}
/* the lines run together as one paragraph, not stacked one per line (owner, 21 November 2026) */
export function warningText(what, scary = true) { return warningLines(what, scary).join(' '); }

export function addSceneWarningOptions(body, watchButton, readButton, watch, read) {
  if (body) body.replaceChildren();
  watchButton.textContent = WATCH;
  readButton.textContent = READ;
  /* the card's own click (for example hiding itself) runs first, then the choice; a card opened again is not wrapped twice */
  const wire = (b, fn) => {
    const own = b.onclick && b.onclick.sceneOwn !== undefined ? b.onclick.sceneOwn : b.onclick;
    const h = (e) => { uncentre(); own?.call(b, e); fn(); }; h.sceneOwn = own || null; b.onclick = h;
  };
  wire(watchButton, watch); wire(readButton, read);
  centre(watchButton.closest('#card,#fightcard,.card,[role=dialog]'));
  watchButton.focus({ preventScroll: true });
}

export function sceneWarning(card, { title, what, scary = true, watch, read, pairs = false }) {
  const noop = () => {};
  const buttons = pairs ? [[WATCH, noop], [READ, noop]] : [{ t: WATCH, go: noop }, { t: READ, go: noop }];
  card(title, [warningText(what, scary)], buttons, { col: true });
  const [watchButton, readButton] = document.getElementById('cbtns').children;
  addSceneWarningOptions(null, watchButton, readButton, watch, read);
}

/* the card after "Read what happened instead", the same in every game (owner, 21 November 2026): the title What happened, the words as one
   centred paragraph, and one button, Go on. go() does what the game needs next (it hides the card itself if the game's card does not). */
export const READ_TITLE = 'What happened';
export const GO_ON = 'Go on';
export function readWhatHappened(card, { what, go, pairs = false }) {
  const text = [].concat(what || []).join(' ');
  card(READ_TITLE, [text], pairs ? [[GO_ON, go]] : [{ t: GO_ON, go }], { col: true });
  centre(document.getElementById('cbtns')?.closest('#card,.card,[role=dialog]'));
}
