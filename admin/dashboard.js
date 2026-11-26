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
  const placeOf = (entry) => [entry.city, entry.country && countries.of(entry.country)].filter(Boolean).join(', ') || 'Unavailable';
  const sessionName = (id) => 'Session ' + id.slice(0, 8);
  let reportDays = [], generation = 0;
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

  function rankings(id, counts, limit) {
    const panel = $(id);
    panel.replaceChildren();
    const entries = [...counts];
    if (limit) entries.sort((a,b) => b[1] - a[1]);
    const maximum = Math.max(1, ...entries.map(([,count]) => count));
    for (const [label, count] of entries.slice(0, limit || entries.length)) {
      const line = document.createElement('div');
      line.className = 'rank';
      const name = document.createElement('span'), value = document.createElement('strong');
      name.textContent = label;
      value.textContent = count.toLocaleString();
      const bar = document.createElement('i');
      bar.style.width = (100 * count / maximum) + '%';
      line.append(name, value, bar);
      panel.append(line);
    }
    if (!entries.length) panel.textContent = 'No activity in this period.';
  }

  function summary(rows) {
    const sessions = new Map(), games = new Map(), places = new Map();
    const daily = new Map(reportDays.map(day => [day, 0]));
    let starts = 0, seconds = 0;
    for (const r of rows) {
      let session = sessions.get(r.visitor);
      if (!session) {
        session = {opens:0, starts:0, seconds:0, latest:r};
        sessions.set(r.visitor, session);
      }
      session.opens++;
      if (r.updatedAt > session.latest.updatedAt) session.latest = r;
      if (!r.played) continue;
      starts++; seconds += r.seconds;
      session.starts++; session.seconds += r.seconds;
      games.set(title(r.game), (games.get(title(r.game)) || 0) + 1);
      const day = new Date(r.startedAt - 18000000).toISOString().slice(0,10);
      daily.set(day, (daily.get(day) || 0) + 1);
    }
    const filter = $('visitor-filter'), old = filter.value;
    filter.replaceChildren(new Option('All sessions',''));
    $('sessions').replaceChildren();
    for (const [id, item] of [...sessions].sort((a,b) => b[1].latest.updatedAt - a[1].latest.updatedAt)) {
      const location = placeOf(item.latest);
      places.set(location,(places.get(location) || 0) + 1);
      filter.add(new Option(sessionName(id),id));
      row($('sessions'), [sessionName(id),location,item.opens,item.starts,durations(item.seconds),date(item.latest.updatedAt)]);
    }
    if (sessions.has(old)) filter.value = old;
    if (!sessions.size) row($('sessions'), ['No sessions in this period']);
    $('totals').replaceChildren();
    for (const [label, value] of [['Visitor sessions',sessions.size],['Page opens',rows.length],['Game starts',starts],['Active play',durations(seconds)],['Average per start',durations(starts ? Math.round(seconds/starts) : 0)]]) {
      const card = document.createElement('div'), number = document.createElement('strong');
      number.textContent = value;
      card.append(label,number);
      $('totals').append(card);
    }
    rankings('trend',daily);
    rankings('popular',games,8);
    rankings('locations',places,8);
  }

  async function usage() {
    const request = ++generation;
    const end = Date.parse($('day').value + 'T12:00:00Z');
    if (!Number.isFinite(end)) throw new Error('Choose an ending date.');
    const days = Array.from({length:Number($('period').value)}, (_,i) =>
      new Date(end - (Number($('period').value)-1-i)*86400000).toISOString().slice(0,10));
    const rows = [];
    $('visits').setAttribute('aria-busy','true');
    $('export-usage').disabled = true;
    try {
      for (const day of days) {
        let cursor;
        do {
          if (request !== generation) return;
          const result = await api({kind:'visits',day,...(cursor ? {cursor} : {})});
          rows.push(...result.rows);
          cursor = result.cursor;
        } while (cursor);
      }
      if (request !== generation) return;
      rows.sort((a,b) => b.startedAt - a.startedAt);
      loaded.set('visits',{rows});
      reportDays = days;
      summary(rows);
      draw('visits');
      $('export-usage').disabled = false;
    } catch (error) {
      if (request === generation) {
        loaded.set('visits',{rows:[]});
        reportDays = [];
        summary([]); draw('visits');
        throw error;
      }
    } finally {
      if (request === generation) $('visits').removeAttribute('aria-busy');
    }
  }

  function draw(kind) {
    const { rows, cursor } = loaded.get(kind);
    const table = $(kind === 'visits' ? 'visit-rows' : kind + '-rows');
    table.replaceChildren();
    const visible = kind === 'visits' && $('visitor-filter').value ? rows.filter(r => r.visitor === $('visitor-filter').value) : rows;
    for (const entry of visible) {
      if (kind === 'newsletter') row(table, [entry.email, date(entry.receivedAt)]);
      else if (kind === 'contact') row(table, [date(entry.receivedAt), entry.name, entry.email, entry.role, entry.enquiry, entry.message], true);
      else {
        const place = placeOf(entry);
        const tester = sessionName(entry.visitor);
        const progress = entry.chapter ? 'Chapter ' + entry.chapter + (entry.step === null ? '' : ' · Step ' + entry.step) : '—';
        const exit = screens[entry.screen] + ' · ' + (exits[entry.exit] || 'Last seen ' + date(entry.updatedAt));
        row(table, [date(entry.startedAt), tester, place, title(entry.game) || 'Menu', entry.played ? durations(entry.seconds) : '—', progress, exit]);
      }
    }
    if (!visible.length) row(table, ['No records in this period']);
    if (kind !== 'visits') document.querySelector(`[data-more="${kind}"]`).hidden = !cursor;
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
      await usage();
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
  $('refresh').onclick = () => run($('refresh'), usage);
  $('day').onchange = $('period').onchange = () => usage().catch(error => say(error.message));
  $('visitor-filter').onchange = () => draw('visits');
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
  function csvCell(value) {
    let text = String(value ?? '');
    if (/^\s*[=+\-@＝＋－＠]|^[\t\r\n]/u.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  }

  function downloadCsv(kind, entries) {
    const rows = kind === 'usage'
      ? [['Session','Opened (UTC)','Game','City','Country','Started','Active seconds','Chapter','Step','Last screen','Exit','Last seen (UTC)'], ...entries.map(r => [r.visitor,new Date(r.startedAt).toISOString(),title(r.game)||'Menu',r.city,r.country,r.played,r.seconds,r.chapter,r.step,r.screen,r.exit,new Date(r.updatedAt).toISOString()])]
      : kind === 'contact' 
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

  $('export-usage').onclick = () => downloadCsv('usage',loaded.get('visits').rows);
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
