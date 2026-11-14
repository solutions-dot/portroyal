/* games/tivoli/src/story.js: saving, the journal and the chapters list. Progress is kept in this browser only (localStorage): which journal pages are unlocked and which chapters are done.
   The journal has "simple" lines for everyone and "Dig deeper" lines (a closed <details>) for older readers. Pages come from content.js; nothing here is invented. */
import { CHAPTERS, JOURNAL, PAGES_FOR } from './content.js';

const KEY = 'tivoli-save', $ = (id) => document.getElementById(id);
let SAVE = { unlocked: [], done: [] }; try { const t = JSON.parse(localStorage.getItem(KEY) || 'null'); if (t && t.unlocked && t.done) SAVE = t; } catch (e) { /* a fresh start */ }
const store = () => { try { localStorage.setItem(KEY, JSON.stringify(SAVE)); } catch (e) { /* ignore */ } };
let H = null;

export const isUnlocked = (id) => SAVE.unlocked.includes(id), isDone = (ch) => SAVE.done.includes(ch);
export function nextChapter() { const c = CHAPTERS.find((x) => x.playable && !isDone(x.id)); return (c || CHAPTERS.find((x) => x.playable)).id; }
export function unlock(id, quiet) {
  if (isUnlocked(id)) return false; SAVE.unlocked.push(id); store(); const pg = JOURNAL.find((p) => p.id === id);
  if (!quiet && pg) { toast('New journal page: ' + pg.title); if (H && H.uiSound) H.uiSound('page'); } refreshJournal(); return true;
}
export function finishChapter(ch) { if (!isDone(ch)) { SAVE.done.push(ch); store(); } for (const id of PAGES_FOR(ch)) unlock(id, true); refreshChapters(); refreshJournal(); }
export function toast(t) { const e = $('toast'); e.textContent = t; e.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => { e.hidden = true; }, 3200); }

function showPage(id) {
  const pg = JOURNAL.find((p) => p.id === id); $('jlist').hidden = true; $('jpage').hidden = false; $('jptitle').textContent = pg.title;
  $('jpsimple').replaceChildren(...pg.simple.map((t) => { const p = document.createElement('p'); p.textContent = t; return p; }));
  $('jpdeeper').replaceChildren(...pg.deeper.map((t) => { const p = document.createElement('p'); p.textContent = t; return p; })); $('jdig').open = false;
}
function refreshJournal() {
  const list = $('jlist'); list.replaceChildren(...JOURNAL.map((pg) => { const b = document.createElement('button'); b.className = 'btn ghost jrow'; b.type = 'button';
    if (isUnlocked(pg.id)) { b.textContent = pg.title; b.onclick = () => showPage(pg.id); } else { b.textContent = 'Locked page'; b.disabled = true; } return b; }));
  const n = SAVE.unlocked.length; $('jcount').textContent = n + ' of ' + JOURNAL.length + ' pages';
}
function refreshChapters() {
  const list = $('chlist'); list.replaceChildren(...CHAPTERS.map((c) => { const row = document.createElement('div'); row.className = 'chrow';
    const t = document.createElement('div'); t.innerHTML = ''; const h = document.createElement('b'); h.textContent = c.id + '. ' + c.name; const w = document.createElement('span'); w.textContent = c.when + (isDone(c.id) ? ' (done)' : ''); const l = document.createElement('p'); l.textContent = c.line; t.append(h, w, l);
    const b = document.createElement('button'); b.type = 'button'; b.className = 'btn' + (c.playable ? '' : ' ghost'); b.textContent = c.playable ? (isDone(c.id) ? 'Play again' : 'Play') : 'Coming soon'; b.disabled = !c.playable;
    if (c.playable) b.onclick = () => { $('chapters').hidden = true; H.startChapter(c.id); }; row.append(t, b); return row; }));
}
/* h: { startChapter(id), uiSound(kind) } */
export function initStory(h) {
  H = h; refreshJournal(); refreshChapters();
  const openCh = () => { refreshChapters(); $('chapters').hidden = false; }, openJ = () => { $('jpage').hidden = true; $('jlist').hidden = false; refreshJournal(); $('journal').hidden = false; };
  $('chbtn').onclick = openCh; $('chclose').onclick = () => { $('chapters').hidden = true; }; $('jbtn').onclick = openJ; $('jhud').onclick = openJ;
  $('jclose').onclick = () => { $('journal').hidden = true; }; $('jback').onclick = () => { $('jpage').hidden = true; $('jlist').hidden = false; };
}
