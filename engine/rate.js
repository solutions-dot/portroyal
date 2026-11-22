/* engine/rate.js: the round "i" button on every game's own title screen (owner, 22 November 2026: "i wanted the 'i' moved to the other screen
   and it opens the pop up from there, and not have the 'i' on the main screen"). tools/dist.mjs puts this script into every published game
   page, as it does engine/freshen.js, so no game's own files change.

   The button sits to the right of the title's Exit link (#allgames), in the same style. It opens the menu's own pop-up for this game (the kind
   of story, the age, the stars and More like this) over the title screen: the menu page with ?embed=1&rate=<game id>, in a see-through
   frame (menu/library.js, "embed"). Closing the pop-up, Escape, or a press outside it closes the frame. Stars given here are the same stars
   the menu shows. Plain script, no imports: it runs apart from the game's own code. */
(function () {
  var m = location.pathname.match(/\/games\/([a-z0-9-]+)\//);
  if (!m || m[1].charAt(0) === '_') return;
  var id = m[1];
  var CSS = '#infobtn{display:inline-grid;place-items:center;width:48px;min-width:48px;height:auto;min-height:44px;padding:0;cursor:pointer;font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:1.35rem;line-height:1}'
    + '#infoframe{position:fixed;inset:0;z-index:9400;width:100%;height:100%;border:0;background:transparent;color-scheme:normal;opacity:0;transition:opacity .18s ease}#infoframe.on{opacity:1}';
  function start() {
    var exit = document.getElementById('allgames');
    if (!exit || document.getElementById('infobtn')) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var btn = document.createElement('button'); btn.id = 'infobtn'; btn.type = 'button'; btn.className = exit.className; btn.textContent = 'i';
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
