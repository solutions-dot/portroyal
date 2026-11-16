/* games/tivoli/src/story.js: saving, the journal and the chapters list. Progress is kept in this browser only (localStorage): which journal pages are unlocked and which chapters are done.
   The journal has "simple" lines for everyone and "Dig deeper" lines (a closed <details>) for older readers. Pages come from content.js; nothing here is invented. */
import { CHAPTERS, JOURNAL, PAGES_FOR } from './content.js';

const KEY = 'tivoli-save', $ = (id) => document.getElementById(id);
let SAVE = { unlocked: [], done: [] }; try { const t = JSON.parse(localStorage.getItem(KEY) || 'null'); if (t && t.unlocked && t.done) SAVE = t; } catch (e) { /* a fresh start */ }
const store = () => { try { localStorage.setItem(KEY, JSON.stringify(SAVE)); } catch (e) { /* ignore */ } };
let H = null;
let unseen = 0;
let selectedPage = null;
const notice = () => { const dot = $('jnew'), button = $('jhud'); if (dot) dot.hidden = !unseen; if (button) button.classList.toggle('notice', unseen > 0); };

export const isUnlocked = (id) => SAVE.unlocked.includes(id), isDone = (ch) => SAVE.done.includes(ch);
export function nextChapter() { const c = CHAPTERS.find((x) => x.playable && !isDone(x.id)); return (c || CHAPTERS.find((x) => x.playable)).id; }
export function unlock(id, quiet) {
  if (isUnlocked(id)) return false; SAVE.unlocked.push(id); store(); const pg = JOURNAL.find((p) => p.id === id);
  if (!quiet && pg) { unseen++; notice(); toast('New journal page: ' + pg.title); if (H && H.uiSound) H.uiSound('page'); } refreshJournal(); return true;
}
export function finishChapter(ch) { if (!isDone(ch)) { SAVE.done.push(ch); store(); } for (const id of PAGES_FOR(ch)) unlock(id, true); refreshChapters(); refreshJournal(); }
export function toast(t) { const e = $('toast'); e.textContent = t; e.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => { e.hidden = true; }, 3200); }

function showPage(id) {
  const pg = JOURNAL.find((p) => p.id === id); if (!pg || !isUnlocked(id)) return;
  selectedPage = id; $('jptitle').textContent = pg.title;
  $('jpsimple').replaceChildren(...pg.simple.map((t) => { const p = document.createElement('p'); p.textContent = t; return p; }));
  $('jpdeeper').replaceChildren(...pg.deeper.map((t) => { const p = document.createElement('p'); p.textContent = t; return p; })); $('jdig').hidden = !pg.deeper.length; $('jdig').open = false;
  for (const tab of $('jlist').children) { const active = tab.dataset.page === String(id); tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; }
}
function refreshJournal() {
  const list = $('jlist'); list.replaceChildren(...JOURNAL.map((pg) => { const b = document.createElement('button'); b.className = 'btn ghost jrow'; b.type = 'button';
    b.dataset.page = String(pg.id); b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(pg.id === selectedPage));
    if (isUnlocked(pg.id)) { b.textContent = pg.title; b.onclick = () => showPage(pg.id); } else { b.textContent = 'Locked page'; b.disabled = true; } return b; }));
  const n = SAVE.unlocked.length; $('jcount').textContent = n + ' of ' + JOURNAL.length + ' pages';
  const first = JOURNAL.find(pg => isUnlocked(pg.id));
  if (first) showPage(isUnlocked(selectedPage) ? selectedPage : first.id);
  else { selectedPage = null; $('jptitle').textContent = 'Your journal'; $('jpsimple').textContent = 'Pages open as you play.'; $('jdig').hidden = true; }
}
function refreshChapters() {
  const list = $('chlist'); list.replaceChildren(...CHAPTERS.map((c) => {
    const row = document.createElement('li'); row.className = 'chrow';
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chbtn' + (isDone(c.id) ? ' done' : ''); b.disabled = !c.playable;
    for (const [cls, text] of [['yr', c.when], ['nm', c.id + '. ' + c.name], ['st', !c.playable ? 'Coming soon' : isDone(c.id) ? 'Done' : 'Play'], ['summary', c.line]]) {
      const span = document.createElement('span'); span.className = cls; span.textContent = text; b.append(span);
    }
    if (c.playable) b.onclick = () => { $('chapters').hidden = true; H.startChapter(c.id); };
    row.append(b); return row;
  }));
}
/* h: { startChapter(id), uiSound(kind) } */
export function initStory(h) {
  H = h; refreshJournal(); refreshChapters();
  const openCh = () => { $('journal').hidden = true; refreshChapters(); $('chapters').hidden = false; }, openJ = () => { unseen = 0; notice(); refreshJournal(); $('journal').hidden = false; };
  $('chbtn').onclick = openCh; $('chclose').onclick = () => { $('chapters').hidden = true; }; $('jhud').onclick = openJ;
  $('jclose').onclick = () => { $('journal').hidden = true; }; $('jchap').onclick = openCh;
  $('chteacher').onclick = () => { for (const p of JOURNAL) unlock(p.id, true); refreshJournal(); toast('All journal pages unlocked'); };
  $('chcred').onclick = () => { $('chapters').hidden = true; $('credits').hidden = false; };
  $('creditsclose').onclick = () => { $('credits').hidden = true; openCh(); };
  $('chreset').onclick = () => { if (!confirm('Restart Tivoli and clear your saved chapters and journal pages?')) return; SAVE = { unlocked: [], done: [] }; store(); unseen = 0; notice(); location.reload(); };
  notice();
}
