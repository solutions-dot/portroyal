/* engine/rate.js: the round star button (it was an "i") on every game's own title screen (owner, 22 November 2026: "i wanted the 'i' moved to the other screen
   and it opens the pop up from there, and not have the 'i' on the main screen"). tools/dist.mjs puts this script into every published game
   page, as it does engine/freshen.js, so no game's own files change.

   The button sits after the title's Exit link (#allgames), in the same style. On a phone or tablet it is placed at the screen's top right
   corner, with padding (owner, 22 November 2026: "put it at the top right (with padding)", "on mobile devices"). It stays in the Exit link's
   row in the page either way, so it keeps that style and hides with the title. It opens the menu's own pop-up for this game (the kind
   of story, the age, the stars and More like this) over the title screen: the menu page with ?embed=1&rate=<game id>, in a see-through
   frame (menu/library.js, "embed"). Closing the pop-up, Escape, or a press outside it closes the frame. Stars given here are the same stars
   the menu shows. Plain script, no imports: it runs apart from the game's own code. */
(function () {
  var m = location.pathname.match(/\/games\/([a-z0-9-]+)\//);
  if (!m || m[1].charAt(0) === '_') return;
  var id = m[1];
  /* the doubled id outranks each game's own "#title .title-actions .btn" rules, so the corner place and size hold */
  var CSS = '#infobtn#infobtn{display:inline-grid;place-items:center;width:48px;min-width:48px;max-width:48px;height:48px;min-height:48px;padding:0;cursor:pointer;font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:1.35rem;line-height:1}'
    /* on a phone or tablet it moves to the screen's top right corner (owner, 22 November 2026: "on mobile devices"); on a computer it stays in the row */
    + '@media (max-width:760px),(hover:none) and (pointer:coarse){#infobtn#infobtn{position:fixed;top:calc(env(safe-area-inset-top,0px) + 16px);right:calc(env(safe-area-inset-right,0px) + 16px);z-index:20;margin:0;background:rgba(16,22,30,.5)}}'
    + '#infoframe{position:fixed;inset:0;z-index:9400;width:100%;height:100%;border:0;background:transparent;color-scheme:normal;opacity:0;transition:opacity .18s ease}#infoframe.on{opacity:1}';
  function start() {
    var exit = document.getElementById('allgames');
    if (!exit || document.getElementById('infobtn')) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var btn = document.createElement('button'); btn.id = 'infobtn'; btn.type = 'button'; btn.className = exit.className;
    btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" style="display:block;margin:auto"><path fill="currentColor" d="M12 2.6l2.8 6.1 6.6.7-4.9 4.5 1.4 6.5L12 17.1l-5.9 3.3 1.4-6.5-4.9-4.5 6.6-.7z"/></svg>';   /* a star (owner, 23 November 2026: it was the letter i) */
    btn.setAttribute('aria-label', 'About this story, and rate it'); btn.setAttribute('aria-haspopup', 'dialog'); btn.title = 'About this story';
    exit.insertAdjacentElement('afterend', btn);
    var frame = null;
    function close() { if (!frame) return; frame.remove(); frame = null; btn.focus(); }
    btn.addEventListener('click', function (e) {
      e.stopPropagation(); if (frame) return;
      frame = document.createElement('iframe'); frame.id = 'infoframe'; frame.title = 'About this story';
      frame.setAttribute('allowtransparency', 'true');
      frame.src = '../../../menu/?intro=0&embed=1&rate=' + encodeURIComponent(id);
      document.body.appendChild(frame);
      setTimeout(function () { if (frame) frame.classList.add('on'); }, 3000);   /* in case the pop-up never says it is up */
      frame.addEventListener('load', function () { try { frame.contentWindow.focus(); } catch (err) { /* focus stays */ } });
    });
    /* the frame stays invisible while the menu page loads, and fades in when the pop-up is up (no flash of the menu: owner, 22 November 2026) */
    addEventListener('message', function (e) { if (e.origin !== location.origin || !e.data) return; if (e.data.pastport === 'sheet-open' && frame) frame.classList.add('on'); if (e.data.pastport === 'close-sheet') close(); });
    addEventListener('keydown', function (e) { if (frame && e.key === 'Escape') close(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
