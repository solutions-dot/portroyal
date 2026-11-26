/* Shared access settings and browser-wide play analytics preferences. */
(() => {
  const script = document.currentScript;
  const game = script.dataset.game || '';
  const about = script.dataset.page === 'about';
  if (!game && !about) document.documentElement.classList.add('pp-menu-loading');
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
      const footer = box.querySelector('footer');
      if (footer) titleFooterHost()?.append(footer);
      box.remove();
      loadGame();
    });
  }

  const preferenceKey = 'pastport-analytics';
  const legacyKey = 'pastport-playtest-consent';
  function analyticsAllowed() {
    try {
      const saved = localStorage.getItem(preferenceKey);
      if (saved) return saved === 'on';
      if (session(legacyKey) === 'no') {
        localStorage.setItem(preferenceKey, 'off');
        return false;
      }
      return true;
    } catch { return false; }
  }

  function startTracking() {
    const events = new AbortController();
    const { signal } = events;
    const observers = [];
    let pending;
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
      if (signal.aborted || !analyticsAllowed() || Date.now() - startedAt >= 86_400_000) return;
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
    for (const event of ['pointerdown', 'pointermove', 'keydown', 'touchstart']) addEventListener(event, active, { passive: true, signal });
    document.addEventListener('visibilitychange', () => {
      tick();
      visible = document.visibilityState === 'visible';
      if (!visible) send();
    }, { signal });
    addEventListener('pagehide', () => send('left-page'), { signal });
    addEventListener('pageshow', (event) => { if (event.persisted) { exit = ''; active(); send(); } }, { signal });
    addEventListener('click', (event) => {
      const target = event.target.closest?.('a, #exitask .go');
      if (!target) return;
      if (target.matches('#exitask .go')) exit = 'game-exit';
      else if (target.matches('#allgames')) exit = 'menu-link';
      if (exit) send();
    }, { capture: true, signal });
    const updateStarted = () => {
      if (played || !title?.hidden) return;
      active();
      played = true;
      send();
    };
    if (title) {
      const observer = new MutationObserver(updateStarted);
      observer.observe(title, { attributes: true, attributeFilter: ['hidden'] });
      observers.push(observer);
      updateStarted();
    }
    // Save the position as the reader moves through goals, plus a heartbeat for time and abrupt exits.
    const goal = document.getElementById('goal');
    if (goal) {
      const observer = new MutationObserver(() => {
        if (!played) return;
        clearTimeout(pending);
        pending = setTimeout(send, 600);
      });
      observer.observe(goal, { childList: true, characterData: true, subtree: true });
      observers.push(observer);
    }
    const heartbeat = setInterval(() => { if (visible) send(); }, 30_000);
    if (!played) send();
    return () => {
      events.abort();
      clearInterval(heartbeat);
      clearTimeout(pending);
      for (const observer of observers) observer.disconnect();
    };
  }

  function titleFooterHost() {
    return document.querySelector('#title .card') || document.getElementById('title');
  }

  function analyticsFooter() {
    if (embedded || !crypto.randomUUID) return;
    const host = game ? document.getElementById('pp-access') || titleFooterHost()
      : document.querySelector(about ? 'footer' : '#footlinks');
    if (!host) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pp-analytics';
    if (game) {
      const footer = document.createElement('footer');
      footer.append(button);
      host.append(footer);
    } else host.append(button);

    let stop;
    const sync = () => {
      const on = analyticsAllowed();
      button.textContent = on ? 'Turn off play analytics' : 'Turn on play analytics';
      if (on && !about && !stop) stop = startTracking();
      if (!on && stop) { stop(); stop = null; }
    };
    button.addEventListener('click', () => {
      try {
        localStorage.setItem(preferenceKey, analyticsAllowed() ? 'off' : 'on');
      } catch { /* Analytics stays off when browser preferences are unavailable. */ }
      sync();
    });
    addEventListener('storage', (event) => { if (!event.key || event.key === preferenceKey) sync(); });
    addEventListener('pageshow', sync);
    sync();
  }

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const settings = await config;
      if (game) allowGame(settings);
      if (settings.playtest) analyticsFooter();
    } catch {
      if (game) accessMessage('Game settings could not load', 'Please return to the menu and try again.');
    }
  });
})();
