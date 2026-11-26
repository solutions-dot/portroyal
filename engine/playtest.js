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

  /* Anonymous play analytics for every visitor unless this browser turned them off.
     A random browser id (localStorage) counts returning players; a random tab id groups one sitting.
     No IP address, name, email, birth year or GPS position is sent. */
  function browserId() {
    try {
      let saved = JSON.parse(localStorage.getItem('pastport-analytics-id') || 'null');
      if (!saved || typeof saved.id !== 'string' || !/^[a-f0-9-]{36}$/.test(saved.id)) saved = { id: crypto.randomUUID(), first: Date.now(), opens: 0 };
      saved.opens = Math.min(1_000_000, (saved.opens || 0) + 1);
      localStorage.setItem('pastport-analytics-id', JSON.stringify(saved));
      return saved;
    } catch { return { id: crypto.randomUUID(), first: Date.now(), opens: 1 }; }
  }

  function describeDevice() {
    const ua = navigator.userAgent, data = navigator.userAgentData;
    const touch = navigator.maxTouchPoints > 0;
    const device = /iPad|Tablet/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ||
      (/Android/.test(ua) && !/Mobile/.test(ua)) ? 'Tablet' : /Mobi|iPhone|iPod/i.test(ua) || data?.mobile ? 'Phone' : 'Desktop';
    const browser = /Edg/i.test(ua) ? 'Edge' : /Firefox|FxiOS/i.test(ua) ? 'Firefox' :
      /SamsungBrowser/.test(ua) ? 'Samsung Internet' : /Chrome|CriOS/i.test(ua) ? 'Chrome' : /Safari/i.test(ua) ? 'Safari' : 'Other';
    const version = (re) => (ua.match(re) || [])[1] || '';
    const browserVersion = browser === 'Edge' ? version(/Edg\w*\/(\d+)/) : browser === 'Firefox' ? version(/(?:Firefox|FxiOS)\/(\d+)/) :
      browser === 'Samsung Internet' ? version(/SamsungBrowser\/(\d+)/) : browser === 'Chrome' ? version(/(?:Chrome|CriOS)\/(\d+)/) :
      browser === 'Safari' ? version(/Version\/(\d+(?:\.\d+)?)/) : '';
    let os = 'Other', osVersion = '';
    if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) {
      os = 'iOS'; osVersion = version(/OS (\d+(?:_\d+)?)/).replace('_', '.') || version(/Version\/(\d+(?:\.\d+)?)/);
    } else if (/Android/.test(ua)) { os = 'Android'; osVersion = version(/Android (\d+(?:\.\d+)?)/); }
    else if (/CrOS/.test(ua)) os = 'ChromeOS';
    else if (/Windows/.test(ua)) { os = 'Windows'; osVersion = version(/Windows NT (\d+\.\d+)/); }
    else if (/Macintosh/.test(ua)) { os = 'macOS'; osVersion = version(/Mac OS X (\d+[_.]\d+)/).replace('_', '.'); }
    else if (/Linux/.test(ua)) os = 'Linux';
    let gpu = '', webgl = false;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        webgl = true;
        const info = gl.getExtension('WEBGL_debug_renderer_info');
        gpu = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER) || '')
          .replace(/ANGLE \(|\)$|, or similar|Direct3D\w*|vs_\d_\d ps_\d_\d|D3D\d+|\(0x[0-9a-f]+\)/gi, ' ')
          .replace(/[^\w .,+()-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    } catch { /* Some browsers block the graphics probe. */ }
    const connection = navigator.connection;
    return {
      device, browser, browserVersion: browserVersion.slice(0, 8), os, osVersion: osVersion.slice(0, 8), touch,
      screenW: Math.round(screen.width) || 0, screenH: Math.round(screen.height) || 0,
      dpr: Math.round((devicePixelRatio || 1) * 100) / 100,
      cores: navigator.hardwareConcurrency | 0, memory: Number(navigator.deviceMemory) || 0, gpu, webgl,
      lang: String(navigator.language || '').replace(/[^\w-]/g, '').slice(0, 16),
      net: String(connection?.effectiveType || '').replace(/[^\w-]/g, '').slice(0, 8),
      saveData: Boolean(connection?.saveData), standalone: matchMedia('(display-mode: standalone)').matches
    };
  }

  function cleanMessage(value) {
    return String(value || '').replace(/https?:\/\/[^\s)'"]+\/([^\s/)'"?#]*)[^\s)'"]*/g, '$1')
      .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]').replace(/[^\w .,:;'"()[\]{}<>=!?/+*&%#-]/g, ' ')
      .replace(/\s+/g, ' ').trim().slice(0, 160);
  }

  function startTracking() {
    const events = new AbortController();
    const { signal } = events;
    const observers = [];
    let pending;
    const id = session('pastport-playtest-visitor') || crypto.randomUUID();
    session('pastport-playtest-visitor', id);
    const user = browserId();
    const page = crypto.randomUUID(), startedAt = Date.now();
    const title = document.getElementById('title');
    let sequence = 0, seconds = 0, elapsed = 0, exit = '', played = false;
    let lastTick = performance.now(), activeUntil = lastTick + 90_000;
    let visible = document.visibilityState === 'visible';

    const env = describeDevice();
    let referrer = '';
    try { const from = document.referrer && new URL(document.referrer); if (from) referrer = from.origin === location.origin ? 'pastport' : from.hostname.slice(0, 80); } catch { /* no referrer */ }
    const landscape = matchMedia('(orientation: landscape)');
    const orientation = () => landscape.matches ? 'Landscape' : 'Portrait';
    const startOrientation = orientation(), issues = [], reached = [];
    let rotations = 0, issueTimer = 0, loadMs = null, interactions = 0;
    let lastChapter = null;

    /* Frame rate while the game is visible and started: a histogram of one-second samples, plus the longest stall. */
    const fpsBuckets = new Array(13).fill(0);   // 0-4, 5-9, ... 55-59, 60+
    let frames = 0, frameStart = performance.now(), lastFrame = frameStart, longestFrame = 0, fpsSamples = 0, fpsTotal = 0;
    const frame = (now) => {
      if (signal.aborted) return;
      if (visible && played) {
        const gap = now - lastFrame;
        if (gap < 10_000) longestFrame = Math.max(longestFrame, gap);
        if (gap > 4000 && gap < 60_000) recordIssue('Long freeze', '', 0, 0, `Page stopped responding for ${(gap / 1000).toFixed(1)} s`);
        frames++;
        if (now - frameStart >= 1000) {
          const fps = Math.round(frames * 1000 / (now - frameStart));
          if (now - frameStart < 3000) { fpsBuckets[Math.min(12, Math.floor(fps / 5))]++; fpsSamples++; fpsTotal += Math.min(fps, 240); }
          frames = 0; frameStart = now;
        }
      } else { frames = 0; frameStart = now; }
      lastFrame = now;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    const fpsLow = () => {   // the 10th percentile, from the buckets
      let need = Math.ceil(fpsSamples * 0.1), i = 0;
      for (; i < fpsBuckets.length; i++) { need -= fpsBuckets[i]; if (need <= 0) break; }
      return Math.min(60, i * 5);
    };

    function checkpoint() {
      try { return played ? window.PastPortProgress?.() || {} : {}; } catch { return {}; }
    }
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
      const progress = checkpoint();
      const chapter = Number.isInteger(progress.chapter) ? progress.chapter : null;
      if (chapter !== null && chapter !== lastChapter) {
        lastChapter = chapter;
        if (!reached.some(([c]) => c === chapter) && reached.length < 40) reached.push([chapter, seconds]);
      }
      const screen = !game ? 'menu' : !played ? 'title' :
        ['journal', 'chapters', 'dialogue', 'card', 'chcard', 'fade']
          .find((id) => { const element = document.getElementById(id); return element && !element.hidden && element.getClientRects().length; }) || 'game';
      const body = JSON.stringify({
        page, visitor: id, game, startedAt, sequence: ++sequence,
        seconds, played, chapter, step: Number.isInteger(progress.step) ? progress.step : null,
        exit: exit || reason, screen, device: env.device, browser: env.browser, startOrientation, orientation: orientation(),
        rotations, build: String(window.__BUILD || '').slice(0, 64), issues,
        user: user.id, firstSeen: user.first, opens: user.opens, referrer,
        env: { ...env, device: undefined, browser: undefined, viewW: innerWidth | 0, viewH: innerHeight | 0 },
        perf: { load: loadMs, fps: fpsSamples ? Math.round(fpsTotal / fpsSamples) : null, fpsLow: fpsSamples ? fpsLow() : null,
          longest: Math.round(longestFrame), samples: fpsSamples, taps: interactions },
        reached
      });
      fetch('/api/pastport?action=progress', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body, keepalive: true, referrerPolicy: 'no-referrer'
      }).catch(() => {});
    };
    function recordIssue(kind, source = '', line = 0, column = 0, message = '') {
      if (signal.aborted || !analyticsAllowed()) return;
      const position = checkpoint(), view = orientation();
      let file = '';
      try {
        const url = new URL(source, location.href);
        if (source) {
          const name = url.pathname.split('/').pop();
          if (/^[a-z0-9_.-]{1,80}$/i.test(name)) file = url.origin === location.origin ? name : (url.hostname + '/' + name).slice(0, 80).replace(/[^a-z0-9_.-]/gi, '_');
        }
      } catch { /* Some browser errors have no source file. */ }
      line = Number.isInteger(line) && line > 0 ? line : 0;
      column = Number.isInteger(column) && column > 0 ? column : 0;
      message = cleanMessage(message);
      const chapter = Number.isInteger(position.chapter) ? position.chapter : null;
      const step = Number.isInteger(position.step) ? position.step : null;
      const previous = issues.find(x => x.kind === kind && x.file === file && x.line === line && x.message === message &&
        x.column === column && x.chapter === chapter && x.step === step && x.orientation === view);
      if (previous) previous.count = Math.min(65535, previous.count + 1);
      else if (issues.length < 16) issues.push({ kind, message, file, line, column, chapter, step, orientation: view, count: 1, at: Math.floor(performance.now() / 1000) });
      if (!issueTimer) issueTimer = setTimeout(() => { issueTimer = 0; send(); }, 300);
    }
    addEventListener('error', e => {
      if (e instanceof ErrorEvent) recordIssue('Script error', e.filename, e.lineno, e.colno, e.message || e.error?.message);
      else if (e.target?.tagName && ['SCRIPT', 'LINK', 'IMG', 'AUDIO', 'VIDEO', 'SOURCE'].includes(e.target.tagName))
        recordIssue('Asset load failure', e.target.currentSrc || e.target.src || e.target.href, 0, 0, e.target.tagName.toLowerCase() + ' did not load');
    }, { capture: true, signal });
    addEventListener('unhandledrejection', (e) => {
      const reason = e.reason, stack = String(reason?.stack || '');
      const at = stack.match(/(https?:\/\/[^\s)]+):(\d+):(\d+)/);
      recordIssue('Unhandled rejection', at?.[1] || '', at ? +at[2] : 0, at ? +at[3] : 0,
        reason instanceof Error ? reason.name + ': ' + reason.message : typeof reason === 'string' ? reason : reason?.message || '');
    }, { signal });
    document.addEventListener('webglcontextlost', () => recordIssue('Graphics context lost', '', 0, 0, 'The 3D view was lost (often low memory)'), { capture: true, signal });
    for (const id of ['loadnote', 'ctitle']) {
      const el = document.getElementById(id);
      if (!el) continue;
      const check = () => { if (/could not load|failed to load|did not load/i.test(el.textContent)) recordIssue(id === 'ctitle' ? 'Chapter load failure' : 'Startup failure', '', 0, 0, el.textContent); };
      const observer = new MutationObserver(check);
      observer.observe(el, { childList: true, subtree: true, characterData: true });
      observers.push(observer);
      check();
    }
    /* Load time: from the page request to the moment Start can be pressed. */
    const start = document.getElementById('start');
    if (game && start) {
      const ready = () => {
        if (loadMs !== null || start.disabled) return;
        loadMs = Math.min(600_000, Math.round(performance.now()));
        send();
      };
      const observer = new MutationObserver(ready);
      observer.observe(start, { attributes: true, attributeFilter: ['disabled'] });
      observers.push(observer);
      ready();
    } else if (!game) loadMs = Math.min(600_000, Math.round(performance.now()));
    landscape.addEventListener('change', () => { rotations = Math.min(65535, rotations + 1); send(); }, { signal });
    for (const event of ['pointermove', 'keydown']) addEventListener(event, active, { passive: true, signal });
    addEventListener('pointerdown', () => { interactions = Math.min(1_000_000, interactions + 1); active(); }, { passive: true, signal });
    document.addEventListener('visibilitychange', () => {
      tick();
      visible = document.visibilityState === 'visible';
      lastFrame = frameStart = performance.now(); frames = 0;   // a hidden tab is not a freeze
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
      clearTimeout(issueTimer);
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
