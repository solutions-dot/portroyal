/* games/tivoli/src/story.js: saving, the journal and the chapters list. Progress is kept in this browser only (localStorage): which journal pages are unlocked,
   which chapters are done, and where you are in the chapter you are playing (who you have talked to), so Continue on the title brings you back there.
   The journal has "simple" lines for everyone and "Dig deeper" lines (a closed <details>) for older readers. Pages come from content.js; nothing here is invented. */
import { CHAPTERS, JOURNAL, PAGES_FOR } from './content.js';

const KEY = 'tivoli-save', $ = (id) => document.getElementById(id);
let SAVE = { unlocked: [], done: [], cur: null, unseen: 0 }; try { const t = JSON.parse(localStorage.getItem(KEY) || 'null'); if (t && Array.isArray(t.unlocked) && Array.isArray(t.done)) SAVE = { cur: null, unseen: 0, ...t }; } catch (e) { /* a fresh start */ }
const store = () => { try { localStorage.setItem(KEY, JSON.stringify(SAVE)); } catch (e) { /* ignore */ } };
let H = null;
let unseen = Number.isInteger(SAVE.unseen) ? SAVE.unseen : 0;   /* pages found since the journal was last opened: the Journal button glows and shows how many */
let selectedPage = null;
const notice = () => { const b = $('jbtn'), c = $('jcount'); if (!b || !c) return; c.textContent = unseen; c.hidden = !unseen; b.classList.toggle('glow', unseen > 0); b.setAttribute('aria-label', unseen ? 'Journal, ' + unseen + ' new page' + (unseen > 1 ? 's' : '') : 'Journal'); SAVE.unseen = unseen; };

export const isUnlocked = (id) => SAVE.unlocked.includes(id), isDone = (ch) => SAVE.done.includes(ch);
export function nextChapter() { if (SAVE.cur && CHAPTERS.some((x) => x.id === SAVE.cur.ch)) return SAVE.cur.ch; const c = CHAPTERS.find((x) => x.playable && !isDone(x.id)); return (c || CHAPTERS.find((x) => x.playable)).id; }
/* a saved game: any page, any chapter done, or a chapter in progress (the title then says Continue) */
export const hasSave = () => SAVE.unlocked.length > 0 || SAVE.done.length > 0 || !!SAVE.cur;
/* where you are in the chapter you are playing: its number and who you have talked to (null when no chapter is open) */
export function saveProgress(ch, talked) { SAVE.cur = ch ? { ch, talked: talked.slice() } : null; store(); }
export function savedTalked(ch) { return SAVE.cur && SAVE.cur.ch === ch ? SAVE.cur.talked.slice() : []; }
export const saveData = () => JSON.parse(JSON.stringify(SAVE));   /* dev only (?test=all): what is saved now */
export function loadData(d) { if (d && Array.isArray(d.unlocked) && Array.isArray(d.done)) { SAVE = { cur: null, unseen: 0, ...JSON.parse(JSON.stringify(d)) }; store(); unseen = SAVE.unseen || 0; notice(); refreshJournal(); refreshChapters(); } }
export function unlock(id, quiet) {
  if (isUnlocked(id)) return false; SAVE.unlocked.push(id); store(); const pg = JOURNAL.find((p) => p.id === id);
  if (!quiet && pg) { unseen++; notice(); store(); toast('New journal page: ' + pg.title); if (H && H.uiSound) H.uiSound('page'); } refreshJournal(); return true;
}
export function finishChapter(ch) { if (!isDone(ch)) SAVE.done.push(ch); if (SAVE.cur && SAVE.cur.ch === ch) SAVE.cur = null; store(); for (const id of PAGES_FOR(ch)) unlock(id, true); refreshChapters(); refreshJournal(); }
/* a short note at the bottom; one that comes while someone is talking waits until the dialogue box closes (it never covers it), as in Kendal */
const TOASTQ = [];
export function toast(t, ms = 3200) { if (!$('dialogue').hidden) { if (!TOASTQ.some((q) => q[0] === t)) TOASTQ.push([t, ms]); return; } const e = $('toast'); e.textContent = t; e.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => { e.hidden = true; if (TOASTQ.length && $('dialogue').hidden) toast(...TOASTQ.shift()); }, ms); }
export function flushToasts() { if (TOASTQ.length && $('dialogue').hidden && $('toast').hidden) toast(...TOASTQ.shift()); }

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
  const n = SAVE.unlocked.length; $('jpcount').textContent = n + ' of ' + JOURNAL.length + ' pages';
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
    if (c.playable) b.onclick = () => { closeChapters(); H.startChapter(c.id); };
    row.append(b); return row;
  }));
}
/* the panels: opening one stops you walking (busy), closing the last one lets you walk again, as in every game */
const PANELS = ['journal', 'chapters', 'credits'];
export const panelOpen = () => PANELS.some((id) => !$(id).hidden);
const settle = () => { if (H && H.setBusy) H.setBusy(panelOpen() || !$('dialogue').hidden || !$('chcard').hidden); };
export function openChapters() { $('journal').hidden = true; refreshChapters(); $('chapters').hidden = false; settle(); const f = $('chlist').querySelector('button:not(:disabled)'); (f || $('chclose')).focus(); }
export function closeChapters() { if ($('chapters').hidden) return; $('chapters').hidden = true; settle(); }
export function openJournal() { if (!$('journal').hidden) return; unseen = 0; notice(); store(); refreshJournal(); $('journal').hidden = false; settle(); $('jclose').focus(); }
export function closeJournal() { if ($('journal').hidden) return; $('journal').hidden = true; settle(); }
export function closeCredits() { if ($('credits').hidden) return; $('credits').hidden = true; settle(); }
/* h: { startChapter(id), uiSound(kind), setBusy(bool) } */
export function initStory(h) {
  H = h; refreshJournal(); refreshChapters();
  $('chbtn').onclick = openChapters; $('chclose').onclick = closeChapters; $('jbtn').onclick = openJournal;
  $('jclose').onclick = closeJournal; $('jchap').onclick = openChapters;
  $('chteacher').onclick = () => { for (const p of JOURNAL) unlock(p.id, true); refreshJournal(); toast('All journal pages unlocked'); };
  $('chcred').onclick = () => { $('chapters').hidden = true; $('credits').hidden = false; settle(); };
  $('creditsclose').onclick = () => { $('credits').hidden = true; openChapters(); };
  $('chreset').onclick = () => { if (!confirm('Restart Tivoli and clear your saved chapters and journal pages?')) return; eraseAll(); };
  notice();
}
/* start the whole story again: forget every page, chapter and place in a chapter */
export function eraseAll() { SAVE = { unlocked: [], done: [], cur: null, unseen: 0 }; store(); unseen = 0; notice(); location.reload(); }
