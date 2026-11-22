/* engine/quiz.js: one quiz for every game (owner, 21 November 2026: "If a wrong answer is selected, it must advise and highlight the right answer.
   Show the right one, pause and move on." Quizzes are 3 or 4 questions; docs/STANDARD.md, "Story first").
   runQuiz({ title, items, sound, done }) shows a panel over the game. Each item: { q, note?, opts: [{ t, ok, say? }], why? }.
   - A right pick turns green and its line shows (o.say, else item.why), then the next question comes after a short pause.
   - A wrong pick turns red, the right answer turns green, the line says why, and the next question comes after a longer pause.
   - Nobody can fail and nobody tries again. "Next" lets a quick reader go on at once.
   - At the end: "You got 3 of 4." and a button that calls done({ right, of }).
   Pure helpers (readTime, judge, trimQuiz, scoreLine) are tested in node by tests/quiz.mjs. */

export const QUIZ_MAX = 4;
/* how long a line stays before the quiz moves on: long enough for a slow young reader */
export function readTime(text, { base = 1600, perWord = 300, min = 2200, max = 6500 } = {}) {
  const words = String(text || '').split(/\s+/).filter(Boolean).length;
  return Math.max(min, Math.min(max, base + words * perWord));
}
/* what a pick means: was it right, which answer is right, and the line to show */
export function judge(item, i) {
  const right = item.opts.findIndex((o) => o.ok), picked = item.opts[i] || {}, ok = !!picked.ok;
  const good = item.opts[right] || {};
  const line = ok ? (picked.say || item.why || 'Yes!') : (picked.say ? picked.say + ' ' : 'Not that one. ') + (item.why || ('The answer is: ' + good.t + '.'));
  return { ok, right, line: line.trim() };
}
/* keep the first n questions (the game lists its best ones first) */
export function trimQuiz(items, n = QUIZ_MAX) { return items.slice(0, Math.max(1, n)); }
export function scoreLine(right, of) { return right === of ? `You got all ${of}. Well done!` : `You got ${right} of ${of}. Well done for trying!`; }

const CSS = `#quizpanel{position:fixed;inset:0;z-index:8500;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.45);padding:16px}
#quizpanel[hidden]{display:none}
#quizpanel .qz{background:var(--paper,#f1e7d3);color:var(--paper-ink,#2a2418);border-radius:12px;padding:18px 20px;max-width:30rem;width:100%;max-height:calc(100% - 8px);overflow:auto;box-shadow:0 10px 40px rgba(0,0,0,.5)}
#quizpanel .qp{font-size:.85rem;opacity:.75;margin:0 0 .3em;font-weight:700;letter-spacing:.02em}
#quizpanel h2{margin:0 0 .25em;font-family:var(--display,inherit);font-size:1.3rem;line-height:1.25}
#quizpanel .qn{margin:0 0 .7em;font-size:.95rem;opacity:.85}
#quizpanel .qo{display:flex;flex-direction:column;gap:8px}
#quizpanel .qo button{min-height:48px;text-align:left;padding:.55em .9em;border-radius:8px;font:inherit;font-size:1.02rem;cursor:pointer;border:2px solid var(--paper-ink,#2a2418);background:transparent;color:inherit}
#quizpanel .qo button.yes{background:#2f7d3a;border-color:#2f7d3a;color:#fff}
#quizpanel .qo button.no{background:#b23a2e;border-color:#b23a2e;color:#fff}
#quizpanel .qo button.dim{opacity:.45}
#quizpanel .qo button:disabled{cursor:default}
#quizpanel .ql{margin:.8em 0 0;font-size:1.02rem;line-height:1.4;min-height:1.4em;font-weight:600}
#quizpanel .qb{display:flex;justify-content:flex-end;margin-top:.7em}
#quizpanel .qb button{min-height:44px;min-width:7rem;padding:.45em 1em;border-radius:8px;font:inherit;font-weight:700;cursor:pointer;border:2px solid var(--paper-ink,#2a2418);background:var(--paper-ink,#2a2418);color:var(--paper,#f1e7d3)}
#quizpanel .qb button[hidden]{display:none}`;

let panel = null;
function ensure() {
  if (panel) return panel;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  panel = document.createElement('div'); panel.id = 'quizpanel'; panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-labelledby', 'quizq');
  panel.innerHTML = '<div class="qz"><p class="qp" id="quizprog"></p><h2 id="quizq"></h2><p class="qn" id="quiznote"></p><div class="qo" id="quizopts"></div><p class="ql" id="quizline" aria-live="polite"></p><div class="qb"><button type="button" id="quiznext" hidden>Next</button></div></div>';
  document.body.appendChild(panel);
  panel.addEventListener('keydown', (e) => e.stopPropagation());   /* the game's own keys stay quiet while the quiz is up */
  for (const t of ['pointerdown', 'touchstart']) panel.addEventListener(t, (e) => e.stopPropagation(), { passive: true });
  return panel;
}
export const quizOpen = () => !!panel && !panel.hidden;

/* runQuiz: returns a promise of { right, of }; done (if given) is called with the same */
export function runQuiz({ title = 'Quiz', items, max = QUIZ_MAX, sound = null, done = null, fast = false } = {}) {
  const P = ensure(), list = trimQuiz(items || [], max), $ = (id) => P.querySelector('#' + id);
  const snd = (k) => { try { if (sound) sound(k); } catch { /* no sound */ } };
  dispatchEvent(new Event('blur'));   /* let go of held keys and the joystick, as engine/exit.js does */
  P.hidden = false;
  return new Promise((resolve) => {
    let k = 0, right = 0, timer = 0;
    const finish = () => { clearTimeout(timer); P.hidden = true; const r = { right, of: list.length }; if (done) done(r); resolve(r); };
    const end = () => {
      $('quizprog').textContent = title; $('quizq').textContent = scoreLine(right, list.length); $('quiznote').textContent = ''; $('quizopts').replaceChildren(); $('quizline').textContent = '';
      const nb = $('quiznext'); nb.textContent = 'Go on'; nb.hidden = false; nb.onclick = finish; nb.focus({ preventScroll: true }); snd('goal');
    };
    const next = () => { clearTimeout(timer); k++; if (k >= list.length) end(); else show(); };
    const show = () => {
      const it = list[k]; $("quizprog").textContent = `Question ${k + 1} of ${list.length}`; $('quizq').textContent = it.q; $('quiznote').textContent = it.note || ''; $('quiznote').hidden = !it.note; $('quizline').textContent = '';
      const nb = $('quiznext'); nb.hidden = true; nb.textContent = 'Next'; nb.onclick = next;
      const box = $('quizopts'); box.replaceChildren();
      it.opts.forEach((o, i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = o.t; b.onclick = () => pick(i); box.appendChild(b); });
      box.firstChild?.focus({ preventScroll: true });
    };
    const pick = (i) => {
      const it = list[k], r = judge(it, i), bs = [...$('quizopts').children];
      bs.forEach((b, j) => { b.disabled = true; if (j === r.right) b.classList.add('yes'); else if (j === i) b.classList.add('no'); else b.classList.add('dim'); });
      if (r.ok) right++; snd(r.ok ? 'goal' : 'tap');
      $('quizline').textContent = r.line; const nb = $('quiznext'); nb.hidden = false; nb.focus({ preventScroll: true });
      timer = setTimeout(next, fast ? 30 : readTime(r.line) + (r.ok ? 0 : 900));   /* a wrong pick stays a little longer, so the right answer is seen */
    };
    if (!list.length) { finish(); return; }
    show();
  });
}
