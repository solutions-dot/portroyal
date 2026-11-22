/* engine/mature.js: the Mature 13+ card on the title screen of a mature game (owner, 22 November 2026: the murder mysteries sit "behind the
   mature label", with a warning first).

   The menu hides Mature 13+ games in the Kids profile and shows its own warning card, which is the one age prompt. This file only stops a
   device whose menu profile is Kids from opening the game by its address: it says a grown-up can change who is travelling, and offers
   Exit only. Everyone else goes straight to the title screen.

   It is a soft stop, like the menu's profile: it reads the profile kept on the device and cannot check anyone's age.

     matureGate({ note, exit, skip })  ->  Promise that resolves when the traveller may go on (never, if they may not)
       note   kept so the games' calls still work; the menu's card now says what the story has
       exit   the menu (default '../../../menu/')
       skip   true in test runs (the autoplayer and the checks)
     matureState(profile)              pure: 'open' | 'kids' */
export const MATURE_LABEL = 'Mature 13+';
export const MATURE_AGE = 'For ages 13 and up.';
export const MATURE_KIDS = 'This story is for ages 13 and up. A grown-up can change who is travelling on the menu.';
const PROFILE_KEY = 'pastport-profile';

/* The owner, 22 November 2026: "Playing one of these games has 3 age prompts. Remove the cream coloured one and leave the dark one only."
   So this card no longer asks anyone their age: the menu's dark Mature 13+ card is the one prompt. The only thing left here is the stop
   for a device whose menu profile is Kids, which offers Exit and never asks. */
export function matureState(profile) {
  return profile === 'kids' ? 'kids' : 'open';
}

const CSS = `#maturegate{position:fixed;inset:0;z-index:9500;display:flex;align-items:center;justify-content:center;background:rgba(8,10,14,.93);padding:16px}
#maturegate[hidden]{display:none}
#maturegate .mg{background:var(--paper,#f1e7d3);color:var(--paper-ink,#2a2418);border-radius:12px;padding:22px 22px 20px;max-width:26rem;width:100%;max-height:calc(100% - 8px);overflow:auto;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.6)}
#maturegate .mgl{display:inline-block;margin:0 0 .7em;padding:.3em .9em;border-radius:999px;background:#7a1f1f;color:#fff;font-weight:800;letter-spacing:.04em;font-size:.95rem}
#maturegate h2{margin:0 0 .4em;font-family:var(--display,inherit);font-size:1.45rem;line-height:1.2}
#maturegate p{margin:0 0 .7em;font-size:1.02rem;line-height:1.45;text-wrap:balance}
#maturegate .mgb{display:flex;flex-direction:column;gap:10px;align-items:center;margin-top:1em}
#maturegate .mgb :is(button,a){display:flex;align-items:center;justify-content:center;min-height:48px;width:15em;max-width:100%;box-sizing:border-box;padding:.5em 1em;border-radius:8px;font:inherit;font-weight:700;cursor:pointer;text-decoration:none;border:2px solid var(--paper-ink,#2a2418)}
#maturegate .go{background:var(--paper-ink,#2a2418);color:var(--paper,#f1e7d3)}
#maturegate .out{background:transparent;color:var(--paper-ink,#2a2418)}`;

/* asking for the store can itself throw when a browser blocks storage: then no profile is known, and the game opens */
const read = (store, key) => { try { return window[store].getItem(key); } catch (e) { return null; } };

export function matureGate({ note = [], exit = '../../../menu/', skip = false } = {}) {
  if (skip || typeof document === 'undefined') return Promise.resolve();
  const state = matureState(read('localStorage', PROFILE_KEY));
  if (state === 'open') return Promise.resolve();
  return new Promise((resolve) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const el = document.createElement('div'); el.id = 'maturegate'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'mgtitle');
    const box = document.createElement('div'); box.className = 'mg';
    const add = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; e.textContent = text; box.appendChild(e); return e; };
    add('p', 'mgl', MATURE_LABEL);
    add('h2', '', 'Not for now').id = 'mgtitle';
    add('p', '', MATURE_KIDS);
    const row = document.createElement('div'); row.className = 'mgb'; box.appendChild(row);
    const out = document.createElement('a'); out.className = 'out'; out.href = exit; out.textContent = 'Exit';
    row.appendChild(out); el.appendChild(box); document.body.appendChild(el);
    /* the game's own keys and taps stay quiet while the card is up; Tab stays inside it */
    el.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key !== 'Tab') return;
      const f = [...el.querySelectorAll('button,a')], i = f.indexOf(document.activeElement);
      e.preventDefault(); f[(i + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
    });
    for (const t of ['pointerdown', 'touchstart', 'click']) el.addEventListener(t, (e) => e.stopPropagation(), { passive: true });
    out.focus({ preventScroll: true });
  });
}
