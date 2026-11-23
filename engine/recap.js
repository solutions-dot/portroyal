/* engine/recap.js: the end-of-game recap (owner, 21 November 2026). Three things you learned, each a button that opens its journal page.
   It sits on the game's final card only, so it adds no step and no time to the game.
   recapRow(items, open) returns an element to put inside the final card: items are [{ icon, label, page }] (the first three are used), and
   open(page) is the game's own openJournal. recapItems(items, unlocked) keeps the ones whose page the player has (or all, if none is known). */

import { askExit } from './exit.js';
export const RECAP_MAX = 3;
export function recapItems(items, unlocked = null) {
  const list = (items || []).filter((it) => it && it.page && it.label);
  const have = unlocked ? list.filter((it) => unlocked.includes(it.page)) : list;
  return (have.length ? have : list).slice(0, RECAP_MAX);
}

const CSS = `.recaprow{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:.6em 0 .2em}
.recaprow .rc{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:5.6rem;max-width:8rem;min-height:44px;padding:.5em .6em;border-radius:10px;font:inherit;font-size:.9rem;line-height:1.2;cursor:pointer;background:rgba(255,255,255,.08);border:2px solid currentColor;color:inherit}
.recaprow .rc .ri{font-size:1.7rem;line-height:1}
.recaprow .rc .rimg{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:6px;background:rgba(0,0,0,.25)}
.recaprow .rc{width:7.6rem}
#card.recapcard,#chcard.recapcard{text-align:center}#card.recapcard #ctitle,#chcard.recapcard #chcardt{text-align:center}#card.recapcard #cbtns,#chcard.recapcard #chcardb{justify-content:center}
.recaprow .rc:focus-visible{outline:3px solid #ffd65c;outline-offset:2px}
.recaphead{margin:.6em 0 0;font-weight:700;text-align:center}`;
let styled = false;
export function recapRow(items, open, { heading = 'Three things you learned. Tap one to read it again.', unlocked = null } = {}) {
  if (!styled && typeof document !== 'undefined') { const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st); styled = true; }
  const wrap = document.createElement('div'), list = recapItems(items, unlocked);
  const h = document.createElement('p'); h.className = 'recaphead'; h.textContent = heading; wrap.appendChild(h);
  const row = document.createElement('div'); row.className = 'recaprow'; wrap.appendChild(row);
  for (const it of list) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'rc'; b.setAttribute('aria-label', 'Read again: ' + it.label);
    let i; if (it.img) { i = document.createElement('img'); i.className = 'rimg'; i.src = it.img; i.alt = ''; i.loading = 'lazy'; i.onerror = () => { const f = document.createElement('span'); f.className = 'ri'; f.textContent = it.icon || '\u2605'; i.replaceWith(f); }; }   /* a picture from the game itself (owner, 22 November 2026) */
    else { i = document.createElement('span'); i.className = 'ri'; i.textContent = it.icon || '\u2605'; } i.setAttribute('aria-hidden', 'true');
    const l = document.createElement('span'); l.textContent = it.label; b.append(i, l);
    b.addEventListener('click', (e) => { e.stopPropagation(); open(it.page); });
    row.appendChild(b);
  }
  return wrap;
}

/* addRecap: put the recap row on a game's final card, whichever way the game builds it (owner, 22 November 2026: every game has it).
   title is the final card's title (a string or a RegExp); open(page) opens the game's journal; the page's tab is then picked for you (by its
   data-page, or by the page title, which is each item's label). card, titleEl and body are the ids of the game's card parts. */
export function addRecap({ items, open, title, unlocked = null, card = 'card', titleEl = 'ctitle', body = 'cbody' }) {
  const c = typeof document !== 'undefined' && document.getElementById(card); if (!c) return null;
  const pick = (it) => {
    const J = document.getElementById('journal'); if (!J) return;
    const all = [...J.querySelectorAll('button, a, [role="tab"], li')];
    const tab = all.find((e) => e.dataset && (e.dataset.page === it.page || e.dataset.id === it.page)) || all.find((e) => (e.textContent || '').trim() === it.label);
    if (tab) tab.click();
  };
  const check = () => {
    if (c.hidden) { c.classList.remove('recapcard'); return; } const t = ((document.getElementById(titleEl) || {}).textContent || '').trim();
    const ok = title instanceof RegExp ? title.test(t) : t === title; const b = document.getElementById(body);
    if (!ok) { c.classList.remove('recapcard'); return; }
    { const row = c.querySelector('#cbtns, #chcardb, [id$="btns"]'), btns = row ? [...row.querySelectorAll('button')] : [];   /* the last card always offers Exit to the menu (owner, 23 November 2026) */
      if (row && btns.length && !btns.some((x) => (x.textContent || '').trim() === 'Exit')) { const x = btns[btns.length - 1].cloneNode(false); x.textContent = 'Exit'; x.className = btns[btns.length - 1].className; x.removeAttribute('id'); x.addEventListener('click', (e) => { e.stopPropagation(); askExit(); }); row.appendChild(x); } }
    if (!b || b.querySelector('.recapwrap')) return;
    const w = recapRow(items, (pg) => { const it = items.find((x) => x.page === pg); open(pg); setTimeout(() => pick(it), 80); }, { unlocked: typeof unlocked === 'function' ? unlocked() : unlocked });
    w.classList.add('recapwrap'); b.appendChild(w); c.classList.add('recapcard');   /* the final card is centred, like the Who you are card */
  };
  const mo = new MutationObserver(check); mo.observe(c, { attributes: true, attributeFilter: ['hidden'], childList: true, subtree: true, characterData: true });
  return mo;
}
