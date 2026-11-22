/* engine/recap.js: the end-of-game recap (owner, 21 November 2026). Three things you learned, each a button that opens its journal page.
   It sits on the game's final card only, so it adds no step and no time to the game.
   recapRow(items, open) returns an element to put inside the final card: items are [{ icon, label, page }] (the first three are used), and
   open(page) is the game's own openJournal. recapItems(items, unlocked) keeps the ones whose page the player has (or all, if none is known). */

export const RECAP_MAX = 3;
export function recapItems(items, unlocked = null) {
  const list = (items || []).filter((it) => it && it.page && it.label);
  const have = unlocked ? list.filter((it) => unlocked.includes(it.page)) : list;
  return (have.length ? have : list).slice(0, RECAP_MAX);
}

const CSS = `.recaprow{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:.6em 0 .2em}
.recaprow .rc{display:flex;flex-direction:column;align-items:center;gap:4px;min-width:5.6rem;max-width:8rem;min-height:44px;padding:.5em .6em;border-radius:10px;font:inherit;font-size:.9rem;line-height:1.2;cursor:pointer;background:rgba(255,255,255,.08);border:2px solid currentColor;color:inherit}
.recaprow .rc .ri{font-size:1.7rem;line-height:1}
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
    const i = document.createElement('span'); i.className = 'ri'; i.setAttribute('aria-hidden', 'true'); i.textContent = it.icon || '★';
    const l = document.createElement('span'); l.textContent = it.label; b.append(i, l);
    b.addEventListener('click', (e) => { e.stopPropagation(); open(it.page); });
    row.appendChild(b);
  }
  return wrap;
}
