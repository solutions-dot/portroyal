/* Shared by the published menu and every game. Nothing is recorded until an adult opts in. */
(() => {
  const script = document.currentScript;
  const game = script.dataset.game || '';
  if (!game) document.documentElement.classList.add('pp-menu-loading');
  const builtAge = Number(script.dataset.age) || 6;
  const embedded = new URLSearchParams(location.search).get('embed') === '1';
  const session = (key, value) => {
    try {
      if (value !== undefined) sessionStorage.setItem(key, value);
      return sessionStorage.getItem(key);
    } catch { return null; }
  };
  const profile = (value) => {
    try {
      if (value) localStorage.setItem('pastport-profile', value);
      return localStorage.getItem('pastport-profile');
    } catch { return null; }
  };
  const fetchConfig = () => fetch('/api/pastport', { signal: AbortSignal.timeout(4500) })
    .then((r) => {
      if (r.status === 404 && ['localhost', '127.0.0.1'].includes(location.hostname)) return {};
      if (!r.ok) throw new Error('Game settings are unavailable');
      return r.json();
    });
  const config = fetchConfig();
  window.PastPortSettings = config;
  addEventListener('pageshow', async (event) => {
    if (!event.persisted) return;
    try {
      const [before, after] = await Promise.all([config, fetchConfig()]);
      if (JSON.stringify(before) !== JSON.stringify(after)) location.reload();
    } catch { /* keep the current page if the connection is unavailable */ }
  });
  config.catch(() => {});

  const requested = new URLSearchParams(location.hash.slice(1)).get('playtest');
  const invite = /^[a-f0-9]{16}\.[\w-]{22}$/.test(requested || '')
    ? requested : session('pastport-playtest-invite');
  if (invite && invite === requested) {
    if (invite !== session('pastport-playtest-invite')) session('pastport-playtest-consent', '');
    session('pastport-playtest-invite', invite);
    history.replaceState(history.state, '', location.pathname + location.search);
  }

  function panel(title, message) {
    const box = document.createElement('section');
    box.className = 'pp-panel';
    const heading = document.createElement('h2');
    heading.textContent = title;
    const body = document.createElement('p');
    body.textContent = message;
    box.append(heading, body);
    return box;
  }
  function accessMessage(title, message) {
    const box = panel(title, message);
    box.id = 'pp-access';
    const link = document.createElement('a');
    link.href = '/menu/';
    link.textContent = 'All games';
    box.append(link);
    document.body.append(box);
    link.focus();
    return box;
  }

  function loadGame() {
    const stored = document.querySelector('script[data-pastport-app]');
    if (!stored) return;
    const app = document.createElement('script');
    app.src = stored.dataset.pastportApp;
    app.addEventListener('error', () => accessMessage('Game did not load', 'Please try opening it again.'));
    stored.replaceWith(app);
  }

  function allowGame(settings) {
    const setting = settings.games?.[game];
    if (setting?.enabled === false) {
      accessMessage('Game unavailable', 'This game is turned off right now.');
      return;
    }
    const mature = setting ? setting.category === 'teen' : builtAge >= 13;
    if (!mature || profile() === 'teen') {
      loadGame();
      return;
    }
    if (profile() === 'kids') {
      accessMessage('Mature 13+', 'Switch to Teens and adults on the game menu to play this story.');
      return;
    }
    const box = accessMessage('Mature 13+', 'This story is for ages 13 and up. We use your birth year once and do not keep it.');
    const form = document.createElement('form');
    const label = document.createElement('label');
    label.textContent = 'Birth year ';
    const year = document.createElement('input');
    const now = new Date().getFullYear();
    year.type = 'number';
    year.inputMode = 'numeric';
    year.min = now - 120;
    year.max = now;
    year.required = true;
    label.append(year);
    const submit = document.createElement('button');
    submit.textContent = 'Continue';
    const feedback = document.createElement('p');
    feedback.setAttribute('role', 'status');
    form.append(label, submit, feedback);
    box.append(form);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (now - Number(year.value) < 13) {
        year.value = '';
        feedback.textContent = 'This story is for ages 13 and up.';
        return;
      }
      profile('teen');
      box.remove();
      loadGame();
    });
  }

  function tracking() {
    if (embedded || !crypto.randomUUID) return;
    const consentKey = 'pastport-playtest-consent';
    const previous = session(consentKey);
    if (previous === 'no') return;
    const enable = () => {
      const id = session('pastport-playtest-visitor') || crypto.randomUUID();
      session('pastport-playtest-visitor', id);
      const page = crypto.randomUUID(), startedAt = Date.now();
      const title = document.getElementById('title');
      let sequence = 0, seconds = 0, elapsed = 0, exit = '', played = false;
      let lastTick = performance.now(), activeUntil = lastTick + 90_000;
      let visible = document.visibilityState === 'visible';

      const tick = () => {
        const now = performance.now();
        if (visible && played) elapsed += Math.max(0, Math.min(now, activeUntil) - lastTick);
        seconds = Math.floor(elapsed / 1000);
        lastTick = now;
      };
      const active = () => { tick(); activeUntil = lastTick + 90_000; };
      const send = (reason = '') => {
        if (Date.now() - startedAt >= 86_400_000) return;
        tick();
        const progress = played ? window.PastPortProgress?.() || {} : {};
        const screen = !game ? 'menu' : !played ? 'title' :
          ['journal', 'chapters', 'dialogue', 'card', 'chcard', 'fade']
            .find((id) => { const element = document.getElementById(id); return element && !element.hidden && element.getClientRects().length; }) || 'game';
        const body = JSON.stringify({
          page, visitor: id, invite, game, startedAt, sequence: ++sequence,
          seconds, played, chapter: progress.chapter ?? null, step: progress.step ?? null,
          exit: exit || reason, screen
        });
        fetch('/api/pastport?action=progress', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body, keepalive: true, referrerPolicy: 'no-referrer'
        }).catch(() => {});
      };
      for (const event of ['pointerdown', 'pointermove', 'keydown', 'touchstart']) addEventListener(event, active, { passive: true });
      document.addEventListener('visibilitychange', () => {
        tick();
        visible = document.visibilityState === 'visible';
        if (!visible) send();
      });
      addEventListener('pagehide', () => send('left-page'));
      addEventListener('pageshow', (event) => { if (event.persisted) { exit = ''; active(); send(); } });
      addEventListener('click', (event) => {
        const target = event.target.closest?.('a, #exitask .go');
        if (!target) return;
        if (target.matches('#exitask .go')) exit = 'game-exit';
        else if (target.matches('#allgames')) exit = 'menu-link';
        if (exit) send();
      }, true);
      const updateStarted = () => {
        if (played || !title?.hidden) return;
        active();
        played = true;
        send();
      };
      if (title) {
        new MutationObserver(updateStarted).observe(title, { attributes: true, attributeFilter: ['hidden'] });
        updateStarted();
      }
      // Save the position as the reader moves through goals, plus a heartbeat for time and abrupt exits.
      const goal = document.getElementById('goal');
      if (goal) {
        let pending;
        new MutationObserver(() => {
          if (!played) return;
          clearTimeout(pending);
          pending = setTimeout(send, 600);
        }).observe(goal, { childList: true, characterData: true, subtree: true });
      }
      setInterval(() => { if (visible) send(); }, 30_000);
      if (!played) send();
    };
    if (previous === 'yes') { enable(); return; }
    const box = panel('Help test PastPort', 'If you are an adult, you can share your estimated city and country, the games you play, and where you stop. Children can ask an adult. You can play either way.');
    box.id = 'pp-playtest';
    const yes = document.createElement('button');
    yes.textContent = 'Share playtest data';
    const no = document.createElement('button');
    no.textContent = 'Play without sharing';
    const privacy = document.createElement('a');
    privacy.href = '/about.html#privacy';
    privacy.textContent = 'Privacy';
    box.append(yes, no, privacy);
    yes.onclick = () => { session(consentKey, 'yes'); box.remove(); enable(); };
    no.onclick = () => { session(consentKey, 'no'); box.remove(); };
    document.body.append(box);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const settings = await config;
      if (game) allowGame(settings);
      if (settings.playtest) tracking();
    } catch {
      if (game) accessMessage('Game settings could not load', 'Please return to the menu and try again.');
    }
  });
})();
