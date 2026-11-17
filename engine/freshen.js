/* engine/freshen.js: the page keeps itself up to date (owner, 17 November 2026: a phone went on showing an old build after a new one was live).
   This is a plain script, not a module. tools/dist.mjs puts it into the menu and every game's page in the published site, with the build's id in window.__BUILD,
   and writes the same id to /version.json. The page asks for /version.json (never from a cache):
   - when it loads: a page that came out of a cache with an old id loads itself again, once;
   - when you come back to it after 20 seconds or more away (another tab, the phone locked), or when the browser brings it back from its back-and-forward store.
   A game saves your place as you play, so loading the page again loses nothing. Dev builds have no window.__BUILD and do nothing. */
(function () {
  var B = window.__BUILD; if (!B) return; var away = 0;
  function check() {
    fetch('/version.json?t=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || !j.id || j.id === B) return; var tried = null; try { tried = sessionStorage.getItem('freshenTried'); } catch (e) { /* private mode */ }
      if (tried === j.id) return; try { sessionStorage.setItem('freshenTried', j.id); } catch (e) { /* private mode */ } location.reload();   /* once for each new build, so a page can never load itself round and round */
    }).catch(function () { /* offline: keep playing */ });
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) away = Date.now(); else if (away && Date.now() - away > 20000) check(); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) check(); });
  check();
})();
