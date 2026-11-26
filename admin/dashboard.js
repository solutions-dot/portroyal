(() => {
  const $ = (id) => document.getElementById(id);
  const status = $('status');
  const login = $('login');
  const settingsForm = $('settings');
  const dateFormat = new Intl.DateTimeFormat('en-JM', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Jamaica'
  });
  const durations = (seconds) => `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const date = (ms) => dateFormat.format(ms);
  const exits = { 'left-page': 'Left page', 'game-exit': 'Exit button', 'menu-link': 'Returned to menu' };
  const screens = { menu: 'Menu', title: 'Title', journal: 'Journal', chapters: 'Chapters', dialogue: 'Dialogue', card: 'Story card', chcard: 'Chapter card', fade: 'Chapter transition', game: 'In game' };
  const countries = new Intl.DisplayNames(['en'], { type: 'region' });
  const tabs = [...document.querySelectorAll('[data-tab]')];
  const loaded = new Map();
  let password = '', catalog = [], revision = null;
  const title = (id) => catalog.find((game) => game.id === id)?.title || id;
  const say = (message) => { status.textContent = message; };
  $('day').value = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString().slice(0, 10);

  async function api(params, body) {
    const response = await fetch('/api/pastport?' + new URLSearchParams({ action: 'admin', ...params }), {
      method: body ? 'POST' : 'GET',
      headers: { Authorization: 'Bearer ' + password, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body && JSON.stringify(body)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'The dashboard request failed.');
    return result;
  }

  async function run(button, work) {
    button.disabled = true;
    say('');
    try { await work(); }
    catch (error) { say(error.message || 'Please try again.'); }
    finally { button.disabled = false; }
  }

  function row(table, values, messageColumn = false) {
    const tr = table.insertRow();
    const headings = table.closest('table').tHead.rows[0].cells;
    values.forEach((value, index) => {
      const cell = tr.insertCell();
      cell.textContent = value ?? '';
      if (values.length > 1) cell.dataset.label = headings[index].textContent;
    });
    if (values.length === 1) tr.firstElementChild.colSpan = headings.length;
    if (messageColumn) tr.lastElementChild.className = 'message';
  }

  function showSettings(saved) {
    revision = saved.revision;
    settingsForm.elements.defaultProfile.value = saved.settings.defaultProfile;
    const table = $('game-rows');
    table.replaceChildren();
    for (const game of catalog) {
      const setting = saved.settings.games[game.id];
      row(table, [game.title, '', '']);
      const tr = table.lastElementChild;
      const enabled = document.createElement('input');
      enabled.type = 'checkbox';
      enabled.checked = setting?.enabled ?? true;
      enabled.name = game.id + '-enabled';
      enabled.setAttribute('aria-label', 'Enable ' + game.title);
      tr.children[1].append(enabled);
      const category = document.createElement('select');
      category.name = game.id + '-category';
      category.setAttribute('aria-label', game.title + ' category');
      category.add(new Option('Kids (6+)', 'kids'));
      category.add(new Option('Mature 13+', 'teen'));
      category.value = setting?.category ?? game.category;
      tr.children[2].append(category);
    }
  }

  function draw(kind) {
    const { rows, cursor } = loaded.get(kind);
    const table = $(kind === 'visits' ? 'visit-rows' : kind + '-rows');
    table.replaceChildren();
    for (const entry of rows) {
      if (kind === 'newsletter') row(table, [entry.email, date(entry.receivedAt)]);
      else if (kind === 'contact') row(table, [date(entry.receivedAt), entry.name, entry.email, entry.role, entry.enquiry, entry.message], true);
      else {
        const place = [entry.city, entry.country && countries.of(entry.country)].filter(Boolean).join(', ') || 'Unavailable';
        const tester = entry.tester ? (entry.testerLabel || 'Tester ' + entry.tester) : 'Guest ' + entry.visitor.slice(0, 8);
        const progress = entry.chapter ? 'Chapter ' + entry.chapter + (entry.step === null ? '' : ' · Step ' + entry.step) : '—';
        const exit = screens[entry.screen] + ' · ' + (exits[entry.exit] || 'Last seen ' + date(entry.updatedAt));
        row(table, [date(entry.startedAt), tester, place, title(entry.game) || 'Menu', entry.played ? durations(entry.seconds) : '—', progress, exit]);
      }
    }
    if (!rows.length) row(table, ['No records yet']);
    if (kind === 'visits') {
      const players = new Set(rows.map((item) => item.tester || item.visitor)).size;
      const plays = rows.filter((item) => item.played);
      const average = plays.length ? Math.round(plays.reduce((sum, play) => sum + play.seconds, 0) / plays.length) : 0;
      $('totals').textContent = `${players} visitors · ${plays.length} game starts · ${durations(average)} average active play${cursor ? ' (rows loaded)' : ''}`;
    }
    document.querySelector(`[data-more="${kind}"]`).hidden = !cursor;
  }

  async function next(kind, reset = false) {
    const before = reset ? null : loaded.get(kind);
    const day = $('day').value;
    const result = await api({ kind, ...(kind === 'visits' ? { day } : {}), ...(before?.cursor ? { cursor: before.cursor } : {}) });
    const byDate = (entry) => entry.receivedAt || entry.startedAt;
    const rows = [...(before?.rows || []), ...result.rows].sort((a, b) => byDate(b) - byDate(a));
    loaded.set(kind, { rows, cursor: result.cursor });
    draw(kind);
  }

  function showTab(tab) {
    for (const button of tabs) {
      const selected = button.dataset.tab === tab;
      button.setAttribute('aria-current', String(selected));
      $(button.dataset.tab).hidden = !selected;
    }
  }

  login.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = login.querySelector('button');
    run(button, async () => {
      password = login.elements.password.value;
      const [saved, gameList] = await Promise.all([
        api({ kind: 'catalog' }),
        fetch('/playtest-catalog.json').then((response) => {
          if (!response.ok) throw new Error('Could not load the game library.');
          return response.json();
        })
      ]);
      catalog = gameList;
      showSettings(saved);
      await next('visits', true);
      login.reset();
      login.hidden = true;
      $('signout').hidden = false;
      $('workspace').hidden = false;
      showTab('visits');
    });
  });
  $('signout').onclick = () => location.reload();
  for (const button of tabs) button.onclick = () => run(button, async () => {
    const tab = button.dataset.tab;
    if (tab !== 'catalog' && !loaded.has(tab)) await next(tab);
    showTab(tab);
  });
  $('refresh').onclick = () => run($('refresh'), () => next('visits', true));
  $('day').onchange = () => $('refresh').click();
  for (const button of document.querySelectorAll('[data-more]')) button.onclick = () => run(button, () => next(button.dataset.more));
  settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    run(settingsForm.querySelector('button'), async () => {
      const games = {};
      for (const game of catalog) games[game.id] = {
        enabled: settingsForm.elements[game.id + '-enabled'].checked,
        category: settingsForm.elements[game.id + '-category'].value
      };
      const saved = await api({ kind: 'catalog' }, { defaultProfile: settingsForm.elements.defaultProfile.value, games, revision });
      showSettings(saved);
      say('Saved. New page loads will use these settings.');
    });
  });
  $('invite').onclick = () => run($('invite'), async () => {
    const invite = await api({ action: 'invite' }, { label: $('invite-name').value });
    $('invite-link').value = invite.url;
    $('tester-code').textContent = invite.code;
    $('invite-result').hidden = false;
  });
  $('copy').onclick = () => run($('copy'), async () => {
    await navigator.clipboard.writeText($('invite-link').value);
    say('Tester link copied.');
  });

  function csvCell(value) {
    let text = String(value ?? '');
    if (/^\s*[=+\-@＝＋－＠]|^[\t\r\n]/u.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  }

  function downloadCsv(kind, entries) {
    const rows = kind === 'contact'
      ? [['Received (ISO UTC)', 'Name', 'Email', 'Role', 'Enquiry', 'Message'], ...entries.map((x) => [new Date(x.receivedAt).toISOString(), x.name, x.email, x.role, x.enquiry, x.message])]
      : kind === 'newsletter'
        ? [['Email', 'Signed up (ISO UTC)'], ...entries.map((x) => [x.email, new Date(x.receivedAt).toISOString()])]
        : [['Email'], ...[...new Map(entries.map((x) => [x.email.toLowerCase(), x.email])).values()].sort().map((email) => [email])];
    const content = rows.map((values) => values.map(csvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', content], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `PastPort-${kind}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  for (const button of document.querySelectorAll('[data-export]')) button.onclick = () => run(button, async () => {
    const kind = button.dataset.export;
    const entries = [];
    let cursor;
    do {
      const result = await api({ kind: kind === 'emails' ? 'contact' : kind, ...(cursor ? { cursor } : {}) });
      entries.push(...result.rows);
      cursor = result.cursor;
    } while (cursor);
    entries.sort((a, b) => b.receivedAt - a.receivedAt);
    downloadCsv(kind, entries);
    say('Export downloaded.');
  });
})();
