/* PastPort analytics dashboard. Reads the private visit records through /api/pastport and draws every report in the browser.
   One record is one page open (the menu or a game). Records carry a tab id (visitor), a browser id (user, from late November 2026),
   the device, screen, speed, problems and the chapters reached. Older records lack some fields; every report skips what is missing. */
(() => {
  const $ = (id) => document.getElementById(id);
  const el = (tag, props = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value);
    }
    node.append(...children.filter((c) => c !== null && c !== undefined && c !== false));
    return node;
  };
  const SVG = 'http://www.w3.org/2000/svg';
  const svg = (tag, attrs = {}) => {
    const node = document.createElementNS(SVG, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    return node;
  };
  const status = $('status');
  const login = $('login');
  const settingsForm = $('settings');
  const HOUR = 3_600_000, DAY = 86_400_000, JM = 5 * HOUR;
  const jmDay = (ms) => new Date(ms - JM).toISOString().slice(0, 10);
  const jmHour = (ms) => new Date(ms - JM).getUTCHours();
  const dateFormat = new Intl.DateTimeFormat('en-JM', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Jamaica' });
  const shortDay = new Intl.DateTimeFormat('en-JM', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  const date = (ms) => ms ? dateFormat.format(ms) : '';
  const nf = new Intl.NumberFormat('en');
  const n = (value) => nf.format(Math.round(value || 0));
  const plural = (value, one, many = one + 's') => n(value) + ' ' + (Math.round(value) === 1 ? one : many);
  const pct = (part, whole) => whole ? Math.round(100 * part / whole) + '%' : '–';
  const duration = (seconds) => {
    seconds = Math.round(seconds || 0);
    if (seconds < 60) return seconds + 's';
    const h = Math.floor(seconds / 3600), m = Math.floor(seconds / 60) % 60;
    return h ? `${h}h ${m}m` : `${m}m ${seconds % 60}s`;
  };
  const median = (values) => {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b), mid = sorted.length >> 1;
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };
  const mean = (values) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const count = (map, key, by = 1) => map.set(key, (map.get(key) || 0) + by);
  const exits = { 'left-page': 'Closed or left the page', 'game-exit': 'Exit button', 'menu-link': 'Back to the menu' };
  const screens = { menu: 'Menu', title: 'Title screen', journal: 'Journal', chapters: 'Chapter list', dialogue: 'Talking', card: 'Story card', chcard: 'Chapter card', fade: 'Chapter change', game: 'Playing' };
  const countries = new Intl.DisplayNames(['en'], { type: 'region' });
  const countryName = (code) => { try { return code ? countries.of(code) : 'Unknown'; } catch { return code; } };
  const languages = new Intl.DisplayNames(['en'], { type: 'language' });
  const langName = (code) => { try { return code ? languages.of(code) : 'Unknown'; } catch { return code; } };
  const placeOf = (r) => [r.city, r.country && countryName(r.country)].filter(Boolean).join(', ') || 'Unknown';
  const tabs = [...document.querySelectorAll('[data-tab]')];
  const loaded = new Map();
  let password = '', catalog = [], revision = null;
  let all = [], previous = [], days = [], generation = 0, activeTab = 'overview', selectedGame = '';
  const title = (id) => id ? (catalog.find((game) => game.id === id)?.title || id) : 'Menu';
  const say = (message) => { status.textContent = message; };
  $('day').value = jmDay(Date.now());

  async function api(params, body) {
    const response = await fetch('/api/pastport?' + new URLSearchParams({ action: 'admin', ...params }), {
      method: body ? 'POST' : 'GET',
      headers: { Authorization: 'Bearer ' + password, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body && JSON.stringify(body)
    });
    let result = {};
    try { result = await response.json(); } catch { /* an empty or broken reply */ }
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

  /* ---------- tables ---------- */
  function row(table, values, messageColumn = false) {
    const tr = table.insertRow();
    const headings = table.closest('table').tHead.rows[0].cells;
    values.forEach((value, index) => {
      const cell = tr.insertCell();
      if (value instanceof Node) cell.append(value);
      else cell.textContent = value ?? '';
      if (values.length > 1 && headings[index]) cell.dataset.label = headings[index].textContent;
    });
    if (values.length === 1) tr.firstElementChild.colSpan = headings.length;
    if (messageColumn) tr.lastElementChild.className = 'message';
    return tr;
  }
  /* Click a heading to sort a table that has class "sortable". Numbers sort by the data-sort value when present. */
  document.addEventListener('click', (event) => {
    const th = event.target.closest('table.sortable th');
    if (!th) return;
    const table = th.closest('table'), index = [...th.parentNode.cells].indexOf(th), body = table.tBodies[0];
    const ascending = th.dataset.dir !== 'asc';
    for (const cell of th.parentNode.cells) delete cell.dataset.dir;
    th.dataset.dir = ascending ? 'asc' : 'desc';
    const key = (tr) => { const cell = tr.cells[index]; const v = cell?.dataset.sort ?? cell?.textContent ?? ''; return v !== '' && !isNaN(v) ? Number(v) : v.toLowerCase(); };
    const rows = [...body.rows].filter((tr) => tr.cells.length > 1);
    rows.sort((a, b) => { const x = key(a), y = key(b); return (x > y ? 1 : x < y ? -1 : 0) * (ascending ? 1 : -1); });
    body.append(...rows);
  });
  const sortCell = (text, value) => { const span = el('span', { text }); span.dataset.sortValue = value; return span; };
  function fillSortValues(tbody) {
    for (const cell of tbody.querySelectorAll('td')) {
      const span = cell.querySelector('[data-sort-value]');
      if (span) cell.dataset.sort = span.dataset.sortValue;
    }
  }

  /* ---------- the hover tip ---------- */
  const tip = $('tip');
  function showTip(event, lines) {
    tip.replaceChildren(...lines.map((line, i) => el(i ? 'div' : 'strong', { text: line })));
    tip.hidden = false;
    const box = tip.getBoundingClientRect();
    let x = event.clientX + 14, y = event.clientY + 14;
    if (x + box.width > innerWidth - 8) x = event.clientX - box.width - 14;
    if (y + box.height > innerHeight - 8) y = event.clientY - box.height - 14;
    tip.style.transform = `translate(${Math.max(8, x)}px, ${Math.max(8, y)}px)`;
  }
  const hideTip = () => { tip.hidden = true; };
  addEventListener('scroll', hideTip, { passive: true });

  /* ---------- charts (inline SVG, one y axis each) ---------- */
  const SERIES = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)'];
  function niceMax(value) {
    if (value <= 5) return 5;   // five gridlines, so small counts tick in whole numbers
    const p = 10 ** Math.floor(Math.log10(value)), f = value / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  }
  function legend(target, names) {
    $(target).replaceChildren(...names.map((name, i) => el('span', {}, el('i', { style: `background:${SERIES[i]}` }), name)));
  }
  /* Lines over days. series: [{ name, values: [] }]. format: value -> text. */
  function lineChart(container, labels, series, format = n, { percent = false } = {}) {
    const box = typeof container === 'string' ? $(container) : container;
    box.replaceChildren();
    if (!labels.length) { box.append(el('p', { class: 'empty', text: 'No data in this period.' })); return; }
    const W = Math.max(320, box.clientWidth || 640), H = 220, L = 40, R = 12, T = 12, B = 28;
    const max = percent ? Math.min(100, niceMax(Math.max(5, ...series.flatMap((s) => s.values)))) : niceMax(Math.max(1, ...series.flatMap((s) => s.values)));
    const x = (i) => labels.length === 1 ? L + (W - L - R) / 2 : L + i * (W - L - R) / (labels.length - 1);
    const y = (v) => T + (H - T - B) * (1 - v / max);
    const chart = svg('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: H, role: 'img', 'aria-label': series.map((s) => s.name).join(' and ') + ' by day' });
    for (let k = 0; k <= 5; k++) {
      const v = max * k / 5;
      chart.append(svg('line', { x1: L, x2: W - R, y1: y(v), y2: y(v), class: k ? 'grid' : 'axis' }));
      const t = svg('text', { x: L - 6, y: y(v) + 4, 'text-anchor': 'end', class: 'tick' });
      t.textContent = percent ? Math.round(v) + '%' : (v >= 1000 ? (v / 1000) + 'k' : String(Math.round(v * 10) / 10));
      chart.append(t);
    }
    const every = Math.ceil(labels.length / Math.max(2, Math.floor((W - L - R) / 64)));
    labels.forEach((label, i) => {
      if (i % every && i !== labels.length - 1) return;
      const t = svg('text', { x: x(i), y: H - 8, 'text-anchor': 'middle', class: 'tick' });
      t.textContent = shortDay.format(Date.parse(label + 'T12:00:00Z'));
      chart.append(t);
    });
    series.forEach((s, si) => {
      if (labels.length > 1) chart.append(svg('path', { d: s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(''), fill: 'none', stroke: SERIES[si], 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
      if (labels.length <= 45) s.values.forEach((v, i) => chart.append(svg('circle', { cx: x(i), cy: y(v), r: labels.length > 14 ? 2.5 : 4, fill: SERIES[si], stroke: 'var(--panel)', 'stroke-width': 2 })));
    });
    const cross = svg('line', { y1: T, y2: H - B, class: 'cross', visibility: 'hidden' });
    chart.append(cross);
    const hit = svg('rect', { x: L, y: T, width: W - L - R, height: H - T - B, fill: 'transparent' });
    hit.addEventListener('pointermove', (event) => {
      const rect = chart.getBoundingClientRect();
      const px = (event.clientX - rect.left) * W / rect.width;
      const i = labels.length === 1 ? 0 : Math.max(0, Math.min(labels.length - 1, Math.round((px - L) / ((W - L - R) / (labels.length - 1)))));
      cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.setAttribute('visibility', 'visible');
      showTip(event, [shortDay.format(Date.parse(labels[i] + 'T12:00:00Z')), ...series.map((s) => `${s.name}: ${format(s.values[i])}`)]);
    });
    hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); hideTip(); });
    chart.append(hit);
    box.append(chart);
  }
  /* Vertical bars, one series (hours of the day). */
  function columnChart(container, labels, values, format = n, tipLabel = (l) => l) {
    const box = $(container);
    box.replaceChildren();
    if (!values.some(Boolean)) { box.append(el('p', { class: 'empty', text: 'No data in this period.' })); return; }
    const W = Math.max(300, box.clientWidth || 480), H = 200, L = 34, R = 6, T = 10, B = 26;
    const max = niceMax(Math.max(...values)), slot = (W - L - R) / values.length, bw = Math.max(2, slot - 2);
    const y = (v) => T + (H - T - B) * (1 - v / max);
    const chart = svg('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: H, role: 'img', 'aria-label': 'Column chart' });
    for (let k = 0; k <= 5; k++) {
      const v = max * k / 5;
      chart.append(svg('line', { x1: L, x2: W - R, y1: y(v), y2: y(v), class: k ? 'grid' : 'axis' }));
      const t = svg('text', { x: L - 6, y: y(v) + 4, 'text-anchor': 'end', class: 'tick' });
      t.textContent = String(Math.round(v * 10) / 10);
      chart.append(t);
    }
    values.forEach((v, i) => {
      const x0 = L + i * slot + 1, top = y(v), h = H - B - top;
      if (v > 0) chart.append(svg('path', { d: `M${x0},${H - B}V${top + Math.min(4, h)}q0,-${Math.min(4, h)} ${Math.min(4, bw / 2)},-${Math.min(4, h)}H${x0 + bw - Math.min(4, bw / 2)}q${Math.min(4, bw / 2)},0 ${Math.min(4, bw / 2)},${Math.min(4, h)}V${H - B}Z`, fill: SERIES[0] }));
      if (i % Math.ceil(values.length / 12) === 0) {
        const t = svg('text', { x: x0 + bw / 2, y: H - 8, 'text-anchor': 'middle', class: 'tick' });
        t.textContent = labels[i];
        chart.append(t);
      }
      const hit = svg('rect', { x: L + i * slot, y: T, width: slot, height: H - T - B, fill: 'transparent' });
      hit.addEventListener('pointermove', (event) => showTip(event, [tipLabel(labels[i]), format(v)]));
      hit.addEventListener('pointerleave', hideTip);
      chart.append(hit);
    });
    box.append(chart);
  }
  /* Ranked horizontal bars: entries [[label, value, extra?]]. */
  function bars(container, entries, { limit = 8, format = n, total = null, sort = true, color = SERIES[0], note = null } = {}) {
    const box = typeof container === 'string' ? $(container) : container;
    box.replaceChildren();
    let list = [...entries].filter(([, v]) => v > 0);
    if (sort) list.sort((a, b) => b[1] - a[1]);
    if (!list.length) { box.append(el('p', { class: 'empty', text: 'No data in this period.' })); return; }
    if (limit && list.length > limit) {
      const rest = list.slice(limit - 1);
      list = [...list.slice(0, limit - 1), [`Other (${rest.length})`, rest.reduce((s, [, v]) => s + v, 0)]];
    }
    const max = Math.max(...list.map(([, v]) => v));
    const sum = total ?? list.reduce((s, [, v]) => s + v, 0);
    for (const [label, value, extra] of list) {
      const line = el('div', { class: 'bar' },
        el('span', { class: 'bar-label', text: label }),
        el('span', { class: 'bar-value', text: format(value) + (total !== false ? ' · ' + pct(value, sum) : '') }),
        el('span', { class: 'bar-track' }, el('i', { style: `width:${Math.max(1.5, 100 * value / max)}%;background:${color}` })));
      line.addEventListener('pointermove', (event) => showTip(event, [label, format(value) + (total !== false ? ` (${pct(value, sum)})` : ''), ...(extra ? [extra] : [])]));
      line.addEventListener('pointerleave', hideTip);
      box.append(line);
    }
    if (note) box.append(el('p', { class: 'note', text: note }));
  }
  /* Stacked columns by day: series [{ name, values }]. */
  function stackedDays(container, labels, series) {
    const box = $(container);
    box.replaceChildren();
    const totals = labels.map((_, i) => series.reduce((s, x) => s + x.values[i], 0));
    if (!totals.some(Boolean)) { box.append(el('p', { class: 'empty', text: 'No data in this period.' })); return; }
    const W = Math.max(320, box.clientWidth || 640), H = 220, L = 40, R = 8, T = 10, B = 28;
    const max = niceMax(Math.max(...totals)), slot = (W - L - R) / labels.length, bw = Math.max(2, Math.min(36, slot - 2));
    const y = (v) => T + (H - T - B) * (1 - v / max);
    const chart = svg('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: H, role: 'img', 'aria-label': series.map((s) => s.name).join(' and ') + ' by day' });
    for (let k = 0; k <= 5; k++) {
      const v = max * k / 5;
      chart.append(svg('line', { x1: L, x2: W - R, y1: y(v), y2: y(v), class: k ? 'grid' : 'axis' }));
      const t = svg('text', { x: L - 6, y: y(v) + 4, 'text-anchor': 'end', class: 'tick' });
      t.textContent = String(Math.round(v * 10) / 10);
      chart.append(t);
    }
    const every = Math.ceil(labels.length / Math.max(2, Math.floor((W - L - R) / 64)));
    labels.forEach((label, i) => {
      const x0 = L + i * slot + (slot - bw) / 2;
      let base = 0;
      series.forEach((s, si) => {
        const v = s.values[i];
        if (!v) return;
        const top = y(base + v), bottom = y(base);
        chart.append(svg('rect', { x: x0, y: top, width: bw, height: Math.max(0, bottom - top - (base ? 2 : 0)), fill: SERIES[si], rx: 2 }));
        base += v;
      });
      if (i % every === 0 || i === labels.length - 1) {
        const t = svg('text', { x: x0 + bw / 2, y: H - 8, 'text-anchor': 'middle', class: 'tick' });
        t.textContent = shortDay.format(Date.parse(label + 'T12:00:00Z'));
        chart.append(t);
      }
      const hit = svg('rect', { x: L + i * slot, y: T, width: slot, height: H - T - B, fill: 'transparent' });
      hit.addEventListener('pointermove', (event) => showTip(event, [shortDay.format(Date.parse(label + 'T12:00:00Z')), ...series.map((s) => `${s.name}: ${n(s.values[i])}`)]));
      hit.addEventListener('pointerleave', hideTip);
      chart.append(hit);
    });
    box.append(chart);
  }
  function kpis(target, items) {
    $(target).replaceChildren(...items.map(({ label, value, before, note, tone, better = 'up' }) => {
      let delta = null;
      if (typeof before === 'number' && typeof value === 'number') {
        const now = value;
        if (before === 0 && now === 0) delta = null;
        else {
          const change = before ? Math.round(100 * (now - before) / before) : null;
          const good = better === 'up' ? now >= before : now <= before;
          delta = el('span', { class: 'delta ' + (now === before ? '' : good ? 'up' : 'down'), text: change === null ? 'new' : (change > 0 ? '▲ ' : change < 0 ? '▼ ' : '') + Math.abs(change) + '% vs previous' });
        }
      }
      const shown = items.find((x) => x.label === label).format ? items.find((x) => x.label === label).format(value) : (typeof value === 'number' ? n(value) : value);
      return el('div', { class: 'kpi' + (tone ? ' ' + tone : '') }, el('span', { class: 'kpi-label', text: label }), el('strong', { text: shown }), delta, note ? el('span', { class: 'kpi-note', text: note }) : null);
    }));
  }

  /* ---------- turning page records into sittings, sessions and players ---------- */
  const userOf = (r) => r.user || 'tab:' + r.visitor;
  function filtered(rows) {
    const game = $('f-game').value, device = $('f-device').value, country = $('f-country').value;
    return rows.filter((r) => (!game || r.game === game) && (!device || r.device === device) && (!country || r.country === country));
  }
  function analyse(rows) {
    const plays = rows.filter((r) => r.played && r.game);
    const users = new Map(), sessions = new Map();
    for (const r of rows) {
      const u = userOf(r);
      if (!users.has(u)) users.set(u, { id: u, rows: [], first: r.firstSeen || null, seconds: 0, games: new Set(), country: r.country, latest: r });
      const user = users.get(u);
      user.rows.push(r);
      if (r.firstSeen && (!user.first || r.firstSeen < user.first)) user.first = r.firstSeen;
      if (r.updatedAt > user.latest.updatedAt) user.latest = r;
      if (r.played) { user.seconds += r.seconds; user.games.add(r.game); }
      if (!sessions.has(r.visitor)) sessions.set(r.visitor, { id: r.visitor, user: u, rows: [], latest: r });
      const session = sessions.get(r.visitor);
      session.rows.push(r);
      if (r.updatedAt > session.latest.updatedAt) session.latest = r;
    }
    const withIssues = plays.filter((r) => (r.issues || []).length);
    const measured = plays.filter((r) => Array.isArray(r.issues));
    return { rows, plays, users, sessions, withIssues, measured, seconds: plays.reduce((s, r) => s + r.seconds, 0) };
  }
  const isNew = (user, startMs) => user.first ? user.first >= startMs : null;

  /* ---------- loading ---------- */
  function periodDays(endDay, length) {
    const end = Date.parse(endDay + 'T12:00:00Z');
    return Array.from({ length }, (_, i) => new Date(end - (length - 1 - i) * DAY).toISOString().slice(0, 10));
  }
  async function loadDays(list, request, label) {
    const rows = [];
    let done = 0;
    const queue = [...list];
    await Promise.all(Array.from({ length: 4 }, async () => {
      while (queue.length) {
        const day = queue.shift();
        if (request !== generation) return;
        const result = await api({ kind: 'day', day });
        rows.push(...result.rows);
        done++;
        if (request === generation) $('loading').textContent = `Loading ${label}: ${done} of ${list.length} days`;
      }
    }));
    return rows;
  }
  async function usage() {
    const request = ++generation;
    if (!$('day').value) throw new Error('Choose an ending date.');
    const length = Number($('period').value);
    const list = periodDays($('day').value, length);
    $('workspace').setAttribute('aria-busy', 'true');
    $('export-usage').disabled = true;
    try {
      const current = await loadDays(list, request, 'this period');
      let before = [];
      if (length <= 30) {
        const prior = periodDays(new Date(Date.parse(list[0] + 'T12:00:00Z') - DAY).toISOString().slice(0, 10), length);
        before = await loadDays(prior, request, 'the period before');
      }
      if (request !== generation) return;
      all = current.sort((a, b) => b.startedAt - a.startedAt);
      previous = before;
      days = list;
      fillFilterOptions();
      drawAll();
      $('loading').textContent = `${n(all.length)} page opens loaded · updated ${date(Date.now())}`;
      $('export-usage').disabled = false;
    } finally {
      if (request === generation) $('workspace').removeAttribute('aria-busy');
    }
  }
  function fillFilterOptions() {
    const keep = (select, options) => {
      const old = select.value, first = select.options[0];
      select.replaceChildren(first, ...options.map(([value, label]) => new Option(label, value)));
      select.value = options.some(([v]) => v === old) ? old : '';
    };
    const games = new Set(all.map((r) => r.game).filter(Boolean));
    keep($('f-game'), [...new Set([...catalog.map((g) => g.id), ...games])].map((id) => [id, title(id)]));
    const codes = [...new Set(all.map((r) => r.country).filter(Boolean))].sort((a, b) => countryName(a).localeCompare(countryName(b)));
    keep($('f-country'), codes.map((c) => [c, countryName(c)]));
  }

  /* ---------- reports ---------- */
  function drawAll() {
    const rows = filtered(all), before = filtered(previous);
    const now = analyse(rows), then = analyse(before);
    drawLive();
    drawOverview(now, then);
    drawGames(now);
    drawPlayers(now, then);
    drawDevices(now);
    drawHealth(now, then);
    drawSessions(now);
  }
  function drawLive() {
    const recent = new Set(all.filter((r) => Date.now() - r.updatedAt < 2.5 * 60_000 && !r.exit).map((r) => r.visitor));
    $('live').hidden = false;
    $('live-count').textContent = recent.size;
    $('live').classList.toggle('on', recent.size > 0);
  }
  const startOfPeriod = () => Date.parse(days[0] + 'T05:00:00Z');
  function drawOverview(a, b) {
    const start = startOfPeriod();
    const newUsers = [...a.users.values()].filter((u) => isNew(u, start) === true).length;
    const crashFree = a.measured.length ? 100 * (1 - a.withIssues.length / a.measured.length) : null;
    const crashFreeBefore = b.measured.length ? 100 * (1 - b.withIssues.length / b.measured.length) : null;
    const fps = a.plays.map((r) => r.perf?.fps).filter((v) => typeof v === 'number' && v > 0);
    const comparable = previous.length > 0;
    kpis('kpis', [
      { label: 'Players', value: a.users.size, before: comparable ? b.users.size : undefined, note: newUsers ? `${n(newUsers)} new` : null },
      { label: 'Game starts', value: a.plays.length, before: comparable ? b.plays.length : undefined },
      { label: 'Active play', value: a.seconds, before: comparable ? b.seconds : undefined, format: duration },
      { label: 'Average per start', value: a.plays.length ? a.seconds / a.plays.length : 0, before: comparable && b.plays.length ? b.seconds / b.plays.length : undefined, format: duration },
      { label: 'Page opens', value: a.rows.length, before: comparable ? b.rows.length : undefined },
      { label: 'Sittings without a problem', value: crashFree === null ? '–' : crashFree, before: comparable && crashFreeBefore !== null && crashFree !== null ? crashFreeBefore : undefined, format: (v) => typeof v === 'number' ? v.toFixed(1) + '%' : v, tone: crashFree !== null && crashFree < 95 ? 'warn' : '' },
      { label: 'Average frame rate', value: fps.length ? Math.round(mean(fps)) : '–', format: (v) => typeof v === 'number' ? v + ' fps' : v, tone: fps.length && mean(fps) < 25 ? 'warn' : '' }
    ]);
    const playersByDay = new Map(days.map((d) => [d, new Set()])), startsByDay = new Map(days.map((d) => [d, 0]));
    for (const r of a.rows) playersByDay.get(jmDay(r.startedAt))?.add(userOf(r));
    for (const r of a.plays) if (startsByDay.has(jmDay(r.startedAt))) count(startsByDay, jmDay(r.startedAt));
    legend('trend-legend', ['Players', 'Game starts']);
    lineChart('trend', days, [
      { name: 'Players', values: days.map((d) => playersByDay.get(d).size) },
      { name: 'Game starts', values: days.map((d) => startsByDay.get(d)) }
    ]);
    const hours = new Array(24).fill(0);
    for (const r of a.plays) hours[jmHour(r.startedAt)]++;
    columnChart('hours', hours.map((_, h) => String(h).padStart(2, '0')), hours, (v) => plural(v, 'start'), (h) => `${h}:00 to ${h}:59`);
    const byGame = new Map();
    for (const r of a.plays) count(byGame, title(r.game));
    bars('ov-games', [...byGame]);
    const places = new Map();
    for (const u of a.users.values()) count(places, countryName(u.latest.country));
    bars('ov-places', [...places], { format: (v) => plural(v, 'player') });
    const devices = new Map();
    for (const u of a.users.values()) count(devices, u.latest.device || 'Unknown');
    bars('ov-devices', [...devices], { format: (v) => plural(v, 'player') });
  }

  function gameStats(a) {
    const games = new Map();
    for (const r of a.plays) {
      if (!games.has(r.game)) games.set(r.game, { id: r.game, plays: [], users: new Set() });
      const g = games.get(r.game);
      g.plays.push(r);
      g.users.add(userOf(r));
    }
    return [...games.values()].map((g) => {
      const furthestByUser = new Map();
      for (const r of g.plays) {
        const best = Math.max(r.chapter || 0, ...(r.reached || []).map(([c]) => c));
        furthestByUser.set(userOf(r), Math.max(furthestByUser.get(userOf(r)) || 0, best));
      }
      const furthest = Math.max(0, ...furthestByUser.values());
      const fps = g.plays.map((r) => r.perf?.fps).filter((v) => v > 0);
      const loads = g.plays.map((r) => r.perf?.load).filter((v) => v > 0);
      const measured = g.plays.filter((r) => Array.isArray(r.issues));
      return {
        ...g, furthestByUser, furthest,
        seconds: g.plays.reduce((s, r) => s + r.seconds, 0),
        medianSeconds: median(g.plays.map((r) => r.seconds)),
        reached2: [...furthestByUser.values()].filter((c) => c >= 2).length,
        phones: g.plays.filter((r) => r.device === 'Phone').length,
        problem: measured.filter((r) => r.issues.length).length, measured: measured.length,
        fps: fps.length ? mean(fps) : null, load: loads.length ? median(loads) : null
      };
    }).sort((x, y) => y.plays.length - x.plays.length);
  }
  function drawGames(a) {
    const stats = gameStats(a);
    const table = $('game-table');
    table.replaceChildren();
    for (const g of stats) {
      const tr = row(table, [
        el('button', { type: 'button', class: 'link', text: title(g.id), onclick: () => { selectedGame = g.id; drawGameDetail(a, stats); } }),
        sortCell(n(g.users.size), g.users.size), sortCell(n(g.plays.length), g.plays.length), sortCell(duration(g.seconds), g.seconds),
        sortCell(duration(g.seconds / g.plays.length), g.seconds / g.plays.length), sortCell(duration(g.medianSeconds), g.medianSeconds),
        sortCell(pct(g.reached2, g.users.size), g.reached2 / g.users.size), sortCell(g.furthest ? 'Chapter ' + g.furthest : '–', g.furthest),
        sortCell(pct(g.phones, g.plays.length), g.phones / g.plays.length),
        sortCell(g.measured ? pct(g.problem, g.measured) : '–', g.measured ? g.problem / g.measured : -1),
        sortCell(g.fps ? Math.round(g.fps) + ' fps' : '–', g.fps || 0), sortCell(g.load ? (g.load / 1000).toFixed(1) + ' s' : '–', g.load || 0)
      ]);
      if (g.id === selectedGame) tr.classList.add('selected');
    }
    fillSortValues(table);
    if (!stats.length) row(table, ['No game starts in this period']);
    if (!stats.some((g) => g.id === selectedGame)) selectedGame = stats[0]?.id || '';
    drawGameDetail(a, stats);
  }
  function drawGameDetail(a, stats) {
    const g = stats.find((x) => x.id === selectedGame);
    $('game-detail').hidden = !g;
    for (const tr of $('game-table').rows) tr.classList.toggle('selected', tr.cells[0]?.textContent === title(selectedGame));
    if (!g) return;
    $('game-detail-title').textContent = title(g.id);
    const chapters = Array.from({ length: Math.max(1, g.furthest) }, (_, i) => i + 1);
    bars('funnel', chapters.map((c) => [`Chapter ${c}`, [...g.furthestByUser.values()].filter((f) => f >= c).length]),
      { sort: false, limit: 0, total: g.users.size, format: (v) => plural(v, 'player'), note: g.users.size ? `${n(g.users.size)} players started ${title(g.id)}.` : null });
    const stops = new Map();
    for (const r of g.plays) {
      if (!r.exit && Date.now() - r.updatedAt < 5 * 60_000) continue;
      count(stops, (r.chapter ? `Chapter ${r.chapter}` + (r.step != null ? `, step ${r.step}` : '') : 'Before chapter 1') + ' · ' + (screens[r.screen] || r.screen));
    }
    bars('stops', [...stops], { limit: 10, format: (v) => plural(v, 'sitting') });
    const times = new Map();
    for (const r of g.plays) for (const [c, s] of r.reached || []) { if (!times.has(c)) times.set(c, []); times.get(c).push(s); }
    bars('chapter-time', [...times].sort((x, y) => x[0] - y[0]).map(([c, list]) => [`Chapter ${c}`, median(list) / 60, plural(list.length, 'sitting')]),
      { sort: false, limit: 0, total: false, format: (v) => v.toFixed(1) + ' min', color: SERIES[2] });
    const byDay = new Map(days.map((d) => [d, 0]));
    for (const r of g.plays) if (byDay.has(jmDay(r.startedAt))) count(byDay, jmDay(r.startedAt));
    lineChart('game-trend', days, [{ name: 'Starts', values: days.map((d) => byDay.get(d)) }]);
  }

  function drawPlayers(a, b) {
    const start = startOfPeriod();
    const users = [...a.users.values()];
    const known = users.filter((u) => u.first);
    const fresh = known.filter((u) => isNew(u, start)).length;
    const multi = users.filter((u) => new Set(u.rows.map((r) => jmDay(r.startedAt))).size > 1).length;
    const playing = users.filter((u) => u.seconds > 0);
    kpis('player-kpis', [
      { label: 'Players', value: users.length, before: previous.length ? b.users.size : undefined },
      { label: 'New this period', value: fresh, note: known.length < users.length ? `${n(users.length - known.length)} from older builds not counted` : null },
      { label: 'Returning', value: known.length - fresh },
      { label: 'Came back on another day', value: multi, note: pct(multi, users.length) + ' of players' },
      { label: 'Sessions (tabs)', value: a.sessions.size, before: previous.length ? b.sessions.size : undefined },
      { label: 'Median play per player', value: median(playing.map((u) => u.seconds)), format: duration }
    ]);
    const newByDay = days.map(() => 0), oldByDay = days.map(() => 0);
    for (const u of users) {
      const seen = new Set(u.rows.map((r) => jmDay(r.startedAt)));
      for (const d of seen) {
        const i = days.indexOf(d);
        if (i < 0) continue;
        const firstDay = u.first ? jmDay(u.first) : null;
        if (firstDay === d) newByDay[i]++; else oldByDay[i]++;
      }
    }
    legend('nr-legend', ['New', 'Returning']);
    stackedDays('new-returning', days, [{ name: 'New', values: newByDay }, { name: 'Returning', values: oldByDay }]);
    const cs = new Map(), cities = new Map(), refs = new Map(), langs = new Map(), gpp = new Map(), tpp = new Map();
    for (const u of users) {
      const r = u.latest;
      count(cs, countryName(r.country));
      count(cities, placeOf(r));
      const ref = u.rows.map((x) => x.referrer).find((x) => x && x !== 'pastport');
      count(refs, ref || (u.rows.some((x) => x.referrer !== undefined) ? 'Direct or typed in' : 'Unknown (older build)'));
      count(langs, langName(u.rows.find((x) => x.lang)?.lang));
      count(gpp, u.games.size === 0 ? 'Menu only' : u.games.size === 1 ? '1 game' : u.games.size + ' games');
      const s = u.seconds;
      count(tpp, s === 0 ? 'Did not start a game' : s < 60 ? 'Under 1 minute' : s < 300 ? '1 to 5 minutes' : s < 900 ? '5 to 15 minutes' : s < 1800 ? '15 to 30 minutes' : s < 3600 ? '30 to 60 minutes' : 'Over an hour');
    }
    bars('countries', [...cs], { limit: 12, format: (v) => plural(v, 'player') });
    bars('cities', [...cities], { limit: 12, format: (v) => plural(v, 'player') });
    bars('referrers', [...refs], { limit: 10, format: (v) => plural(v, 'player') });
    bars('languages', [...langs], { limit: 8, format: (v) => plural(v, 'player') });
    const gppOrder = ['Menu only', '1 game', ...Array.from({ length: 20 }, (_, i) => (i + 2) + ' games')];
    bars('games-per-player', gppOrder.filter((k) => gpp.has(k)).map((k) => [k, gpp.get(k)]), { sort: false, limit: 0 });
    const tppOrder = ['Did not start a game', 'Under 1 minute', '1 to 5 minutes', '5 to 15 minutes', '15 to 30 minutes', '30 to 60 minutes', 'Over an hour'];
    bars('time-per-player', tppOrder.filter((k) => tpp.has(k)).map((k) => [k, tpp.get(k)]), { sort: false, limit: 0, color: SERIES[2] });
  }

  function drawDevices(a) {
    const users = [...a.users.values()];
    const type = new Map(), os = new Map(), browser = new Map(), gpu = new Map(), memory = new Map(), net = new Map();
    for (const u of users) {
      const r = u.rows.find((x) => x.os) || u.latest;
      count(type, r.device || 'Unknown');
      count(os, r.os ? r.os + (r.osVersion ? ' ' + r.osVersion.split('.')[0] : '') : 'Unknown (older build)');
      count(browser, (r.browser || 'Unknown') + (r.browserVersion ? ' ' + r.browserVersion.split('.')[0] : ''));
      count(gpu, r.gpu || (r.webgl === false ? 'No 3D graphics' : 'Unknown'));
      count(memory, r.memory ? r.memory + ' GB' : 'Not reported');
      count(net, r.net ? r.net.toUpperCase() : 'Not reported');
    }
    const players = { format: (v) => plural(v, 'player') };
    bars('d-type', [...type], players);
    bars('d-os', [...os], { ...players, limit: 10 });
    bars('d-browser', [...browser], { ...players, limit: 10 });
    bars('d-gpu', [...gpu], { ...players, limit: 10 });
    bars('d-memory', [...memory].sort((x, y) => parseFloat(x[0]) - parseFloat(y[0]) || 0), { ...players, sort: false, limit: 0 });
    bars('d-net', [...net], players);
    const orient = new Map(), turns = new Map(), view = new Map();
    for (const r of a.plays) {
      if (!r.orientation) continue;
      count(orient, (r.device ? r.device + ' · ' : '') + r.orientation);
      count(turns, r.rotations === 0 ? 'Never' : r.rotations === 1 ? 'Once' : r.rotations <= 4 ? '2 to 4 times' : '5 or more');
    }
    for (const r of a.rows) {
      if (!r.viewW) continue;
      const w = r.viewW;
      count(view, w < 400 ? 'Under 400' : w < 600 ? '400 to 599' : w < 900 ? '600 to 899' : w < 1280 ? '900 to 1279' : w < 1600 ? '1280 to 1599' : '1600 or wider');
    }
    bars('d-orient', [...orient], { format: (v) => plural(v, 'sitting') });
    bars('d-rotate', ['Never', 'Once', '2 to 4 times', '5 or more'].filter((k) => turns.has(k)).map((k) => [k, turns.get(k)]), { sort: false, limit: 0, format: (v) => plural(v, 'sitting') });
    bars('d-view', ['Under 400', '400 to 599', '600 to 899', '900 to 1279', '1280 to 1599', '1600 or wider'].filter((k) => view.has(k)).map((k) => [k, view.get(k)]), { sort: false, limit: 0, format: (v) => plural(v, 'page open') });
    const groups = new Map();
    for (const r of a.plays) {
      const key = [r.device || 'Unknown', r.os || '', r.browser || ''].filter(Boolean).join(' · ');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(r);
    }
    const table = $('d-speed');
    table.replaceChildren();
    for (const [key, list] of [...groups].sort((x, y) => y[1].length - x[1].length)) {
      const fps = list.map((r) => r.perf?.fps).filter((v) => v > 0), low = list.map((r) => r.perf?.fpsLow).filter((v) => typeof v === 'number' && list.length);
      const loads = list.map((r) => r.perf?.load).filter((v) => v > 0);
      const measured = list.filter((r) => Array.isArray(r.issues));
      const problems = measured.filter((r) => r.issues.length).length;
      row(table, [key, sortCell(n(list.length), list.length),
        sortCell(fps.length ? Math.round(mean(fps)) + ' fps' : '–', fps.length ? mean(fps) : 0),
        sortCell(low.length ? Math.round(mean(low)) + ' fps' : '–', low.length ? mean(low) : 0),
        sortCell(loads.length ? (median(loads) / 1000).toFixed(1) + ' s' : '–', loads.length ? median(loads) : 0),
        sortCell(measured.length ? n(100 * problems / measured.length) : '–', measured.length ? problems / measured.length : -1)]);
    }
    fillSortValues(table);
    if (!groups.size) row(table, ['No game sittings in this period']);
  }

  function issueGroups(a) {
    const groups = new Map();
    for (const r of a.rows) for (const issue of r.issues || []) {
      const key = [issue.kind, issue.message || '', issue.file, issue.line, r.game].join('|');
      if (!groups.has(key)) groups.set(key, { issue, game: r.game, sessions: new Set(), events: 0, chapters: new Map(), devices: new Map(), browsers: new Map(), builds: new Set(), last: 0, rows: [] });
      const g = groups.get(key);
      g.sessions.add(r.visitor);
      g.events += issue.count || 1;
      count(g.chapters, issue.chapter ? 'Ch ' + issue.chapter + (issue.step != null ? '.' + issue.step : '') : 'Opening');
      count(g.devices, [r.device, r.os].filter(Boolean).join(' '));
      count(g.browsers, [r.browser, r.browserVersion?.split('.')[0]].filter(Boolean).join(' '));
      if (r.build) g.builds.add(r.build);
      g.last = Math.max(g.last, r.updatedAt);
      g.rows.push(r);
    }
    return [...groups.values()].sort((x, y) => y.sessions.size - x.sessions.size || y.events - x.events);
  }
  const top = (map, k = 3) => [...map].sort((x, y) => y[1] - x[1]).slice(0, k).map(([name, v]) => `${name || 'Unknown'} (${v})`).join(', ');
  function drawHealth(a, b) {
    const groups = issueGroups(a);
    const crashFree = a.measured.length ? 100 * (1 - a.withIssues.length / a.measured.length) : null;
    const scriptErrors = a.plays.filter((r) => (r.issues || []).some((i) => ['Script error', 'Unhandled rejection'].includes(i.kind))).length;
    const lost = a.plays.filter((r) => (r.issues || []).some((i) => i.kind === 'Graphics context lost')).length;
    const failed = a.rows.filter((r) => (r.issues || []).some((i) => ['Startup failure', 'Asset load failure', 'Chapter load failure'].includes(i.kind))).length;
    const slow = a.plays.filter((r) => r.perf?.fps > 0 && r.perf.fps < 20);
    const loads = a.rows.filter((r) => r.game).map((r) => r.perf?.load).filter((v) => v > 0);
    kpis('health-kpis', [
      { label: 'Sittings without a problem', value: crashFree === null ? '–' : crashFree, format: (v) => typeof v === 'number' ? v.toFixed(1) + '%' : v, tone: crashFree !== null && crashFree < 95 ? 'warn' : '',
        before: previous.length && b.measured.length && crashFree !== null ? 100 * (1 - b.withIssues.length / b.measured.length) : undefined },
      { label: 'Script errors', value: scriptErrors, note: 'Game sittings', tone: scriptErrors ? 'bad' : '', better: 'down', before: previous.length ? b.plays.filter((r) => (r.issues || []).some((i) => ['Script error', 'Unhandled rejection'].includes(i.kind))).length : undefined },
      { label: '3D view lost', value: lost, note: 'Often low memory on phones', tone: lost ? 'warn' : '', better: 'down' },
      { label: 'Failed to load', value: failed, note: 'Page opens', tone: failed ? 'warn' : '', better: 'down' },
      { label: 'Slow sittings', value: slow.length, note: 'Under 20 fps average', better: 'down' },
      { label: 'Median load time', value: loads.length ? median(loads) / 1000 : '–', format: (v) => typeof v === 'number' ? v.toFixed(1) + ' s' : v, note: 'Until Start can be pressed' }
    ]);
    const badge = $('health-badge');
    badge.hidden = !a.withIssues.length;
    badge.textContent = a.withIssues.length;
    const perDay = days.map((d) => {
      const list = a.measured.filter((r) => jmDay(r.startedAt) === d);
      return list.length ? 100 * list.filter((r) => r.issues.length).length / list.length : 0;
    });
    lineChart('health-trend', days, [{ name: 'With a problem', values: perDay }], (v) => v.toFixed(1) + '%', { percent: true });
    const table = $('health-rows');
    table.replaceChildren();
    for (const g of groups) {
      const where = g.issue.file ? `${g.issue.file}:${g.issue.line}:${g.issue.column}` : '–';
      const tr = row(table, [
        el('span', { class: 'pill ' + (['Script error', 'Unhandled rejection', 'Startup failure'].includes(g.issue.kind) ? 'bad' : 'warn'), text: g.issue.kind }),
        g.issue.message || '(no message: older build)', where, title(g.game), top(g.chapters), top(g.devices), top(g.browsers),
        [...g.builds].slice(0, 3).join(', ') || '–', sortCell(n(g.sessions.size), g.sessions.size), sortCell(n(g.events), g.events), sortCell(date(g.last), g.last)
      ]);
      tr.classList.add('clickable');
      tr.addEventListener('click', () => openSession(g.rows.sort((x, y) => y.updatedAt - x.updatedAt)[0].visitor));
    }
    fillSortValues(table);
    $('health-summary').textContent = a.measured.length
      ? `${n(a.withIssues.length)} of ${n(a.measured.length)} game sittings reported a problem. Select a row to open the most recent session it happened in. A browser that closes suddenly may only have sent its last checkpoint.`
      : 'No diagnostic data in this period.';
    if (!groups.length) row(table, [a.measured.length ? 'No problems reported in this period.' : 'No diagnostic data in this period.']);
    const slowTable = $('slow-rows');
    slowTable.replaceChildren();
    for (const r of slow.sort((x, y) => x.perf.fps - y.perf.fps).slice(0, 40)) {
      const tr = row(slowTable, [title(r.game), [r.device, r.os, r.osVersion, r.browser].filter(Boolean).join(' '), r.gpu || '–', r.perf.fps + ' fps', (r.perf.fpsLow ?? '–') + ' fps',
        r.perf.longest ? (r.perf.longest / 1000).toFixed(1) + ' s' : '–', r.viewW ? `${r.viewW}×${r.viewH} @${r.dpr}x` : '–', date(r.updatedAt)]);
      tr.classList.add('clickable');
      tr.addEventListener('click', () => openSession(r.visitor));
    }
    if (!slow.length) row(slowTable, ['No slow sittings in this period.']);
  }

  let sessionLimit = 60;
  function drawSessions(a) {
    const query = $('session-search').value.trim().toLowerCase();
    const list = [...a.sessions.values()].sort((x, y) => y.latest.updatedAt - x.latest.updatedAt).filter((s) => {
      if (!query) return true;
      const text = s.rows.map((r) => [title(r.game), placeOf(r), r.device, r.os, r.browser, r.gpu, ...(r.issues || []).map((i) => i.kind + ' ' + i.message)].join(' ')).join(' ').toLowerCase();
      return text.includes(query);
    });
    const table = $('session-rows');
    table.replaceChildren();
    for (const s of list.slice(0, sessionLimit)) {
      const r = s.latest, plays = s.rows.filter((x) => x.played);
      const furthest = plays.length ? plays.map((x) => `${title(x.game)} ch ${Math.max(x.chapter || 0, ...(x.reached || []).map(([c]) => c)) || '–'}`).slice(0, 2).join('; ') : 'Menu only';
      const problems = s.rows.reduce((sum, x) => sum + (x.issues || []).length, 0);
      const user = a.users.get(s.user);
      const who = (user?.first && isNew(user, startOfPeriod()) ? 'New · ' : user?.first ? 'Returning · ' : '') + 'Player ' + s.user.replace('tab:', '').slice(0, 6);
      const tr = row(table, [date(r.updatedAt), who, placeOf(r), [r.device, r.os, r.browser].filter(Boolean).join(' · ') || 'Unknown',
        [...new Set(plays.map((x) => title(x.game)))].join(', ') || '–', duration(plays.reduce((sum, x) => sum + x.seconds, 0)), furthest,
        problems ? el('span', { class: 'pill bad', text: String(problems) }) : '–']);
      tr.classList.add('clickable');
      tr.addEventListener('click', () => openSession(s.id));
    }
    if (!list.length) row(table, ['No sessions match.']);
    $('more-sessions').hidden = list.length <= sessionLimit;
  }
  $('more-sessions').onclick = () => { sessionLimit += 100; drawSessions(analyse(filtered(all))); };
  let searchTimer;
  $('session-search').oninput = () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { sessionLimit = 60; drawSessions(analyse(filtered(all))); }, 200); };

  /* ---------- one session in full ---------- */
  function openSession(id) {
    const rows = all.filter((r) => r.visitor === id).sort((x, y) => x.startedAt - y.startedAt);
    if (!rows.length) return;
    const first = rows.find((r) => r.os) || rows[0];
    const body = $('drawer-body');
    body.replaceChildren();
    $('drawer-title').textContent = 'Session ' + id.slice(0, 8);
    const facts = [
      ['Place', placeOf(first)], ['Device', [first.device, first.os, first.osVersion].filter(Boolean).join(' ')],
      ['Browser', [first.browser, first.browserVersion].filter(Boolean).join(' ')], ['Graphics', first.gpu || '–'],
      ['Screen', first.screenW ? `${first.screenW}×${first.screenH} at ${first.dpr}x` : '–'], ['Window', first.viewW ? `${first.viewW}×${first.viewH}` : '–'],
      ['Touch', first.touch === undefined ? '–' : first.touch ? 'Yes' : 'No'], ['Memory', first.memory ? first.memory + ' GB' : '–'],
      ['Processor cores', first.cores || '–'], ['Connection', first.net || '–'], ['Language', first.lang ? langName(first.lang) : '–'],
      ['Came from', first.referrer === 'pastport' ? 'PastPort' : first.referrer || (first.referrer === '' ? 'Direct' : '–')],
      ['Player', first.user ? 'Browser ' + first.user.slice(0, 8) + (first.firstSeen ? ', first seen ' + date(first.firstSeen) : '') : 'Older build: tab only'],
      ['Page opens in this browser', first.opens || '–'], ['Installed as an app', first.standalone ? 'Yes' : 'No']
    ];
    body.append(el('dl', { class: 'facts' }, ...facts.flatMap(([k, v]) => [el('dt', { text: k }), el('dd', { text: String(v) })])));
    body.append(el('h3', { text: 'Timeline' }));
    const list = el('ol', { class: 'timeline' });
    for (const r of rows) {
      const head = el('div', { class: 'tl-head' }, el('strong', { text: title(r.game) }), el('span', { class: 'note', text: ' ' + date(r.startedAt) }));
      const lines = [];
      if (r.played) lines.push(`Played ${duration(r.seconds)} active` + (r.chapter ? `, last at chapter ${r.chapter}${r.step != null ? ' step ' + r.step : ''}` : ''));
      else if (r.game) lines.push('Opened the title screen, did not press Start');
      if (r.reached?.length) lines.push('Reached ' + r.reached.map(([c, s]) => `chapter ${c} at ${duration(s)}`).join(', '));
      if (r.perf?.load) lines.push((r.game ? 'Ready to start after ' : 'Menu ready after ') + `${(r.perf.load / 1000).toFixed(1)} s`);
      if (r.perf?.fps) lines.push(`Frame rate ${r.perf.fps} fps on average, ${r.perf.fpsLow} fps in the slowest 10%, longest stall ${(r.perf.longest / 1000).toFixed(1)} s`);
      if (r.orientation) lines.push(`Orientation ${r.startOrientation} then ${r.orientation}, turned ${r.rotations} times`);
      lines.push('Left: ' + (screens[r.screen] || r.screen) + ' · ' + (exits[r.exit] || 'last seen ' + date(r.updatedAt)));
      const item = el('li', {}, head, ...lines.map((t) => el('div', { text: t })));
      for (const i of r.issues || []) {
        item.append(el('div', { class: 'tl-issue' }, el('span', { class: 'pill bad', text: i.kind + (i.count > 1 ? ' ×' + i.count : '') }),
          ' ' + (i.message || '') + (i.file ? ` (${i.file}:${i.line}:${i.column})` : '') + (i.chapter ? `, chapter ${i.chapter}${i.step != null ? ' step ' + i.step : ''}` : '') + `, ${i.orientation}` + (i.at != null ? `, ${duration(i.at)} after opening` : '')));
      }
      list.append(item);
    }
    body.append(list);
    $('drawer').showModal();
  }
  $('drawer-close').onclick = () => $('drawer').close();
  $('drawer').addEventListener('click', (event) => { if (event.target === $('drawer')) $('drawer').close(); });

  /* ---------- settings, newsletter and messages (unchanged behaviour) ---------- */
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
  function drawList(kind) {
    const { rows, cursor } = loaded.get(kind);
    const table = $(kind + '-rows');
    table.replaceChildren();
    for (const entry of rows) {
      if (kind === 'newsletter') row(table, [entry.email, date(entry.receivedAt)]);
      else row(table, [date(entry.receivedAt), entry.name, entry.email, entry.role, entry.enquiry, entry.message], true);
    }
    if (!rows.length) row(table, ['No records yet']);
    document.querySelector(`[data-more="${kind}"]`).hidden = !cursor;
  }
  async function next(kind) {
    const before = loaded.get(kind);
    const result = await api({ kind, ...(before?.cursor ? { cursor: before.cursor } : {}) });
    const rows = [...(before?.rows || []), ...result.rows].sort((a, b) => b.receivedAt - a.receivedAt);
    loaded.set(kind, { rows, cursor: result.cursor });
    drawList(kind);
  }

  const reportTabs = ['overview', 'games', 'players', 'devices', 'health', 'sessions'];
  function showTab(tab) {
    activeTab = tab;
    for (const button of tabs) {
      const selected = button.dataset.tab === tab;
      button.setAttribute('aria-current', String(selected));
      $(button.dataset.tab).hidden = !selected;
    }
    $('filters').hidden = !reportTabs.includes(tab);
    try { sessionStorage.setItem('pastport-admin-tab', tab); } catch { /* not kept */ }
    if (reportTabs.includes(tab) && all) requestAnimationFrame(drawAll);   // charts measure their width once visible
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
      login.reset();
      login.hidden = true;
      $('signout').hidden = false;
      $('workspace').hidden = false;
      let tab = 'overview';
      try { tab = sessionStorage.getItem('pastport-admin-tab') || tab; } catch { /* default */ }
      showTab(tabs.some((b) => b.dataset.tab === tab) ? tab : 'overview');
      await usage();
      if (!['catalog', 'newsletter', 'contact'].includes(activeTab)) showTab(activeTab);
      else if (!loaded.has(activeTab) && activeTab !== 'catalog') await next(activeTab);
      setInterval(() => { if (document.visibilityState === 'visible' && Number($('period').value) === 1 && $('day').value === jmDay(Date.now())) usage().catch(() => {}); }, 120_000);
    });
  });
  $('signout').onclick = () => location.reload();
  for (const button of tabs) button.onclick = () => run(button, async () => {
    const tab = button.dataset.tab;
    if (['newsletter', 'contact'].includes(tab) && !loaded.has(tab)) await next(tab);
    showTab(tab);
  });
  $('refresh').onclick = () => run($('refresh'), usage);
  $('day').onchange = $('period').onchange = () => usage().catch((error) => say(error.message));
  for (const id of ['f-game', 'f-device', 'f-country']) $(id).onchange = () => { sessionLimit = 60; drawAll(); };
  let resizeTimer;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { if (all.length || days.length) drawAll(); }, 250); });
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
    const iso = (ms) => ms ? new Date(ms).toISOString() : '';
    const rows = kind === 'usage'
      ? [['Session', 'Player', 'First seen (UTC)', 'Opened (UTC)', 'Last seen (UTC)', 'Game', 'City', 'Country', 'Started', 'Active seconds', 'Chapter', 'Step', 'Chapters reached', 'Last screen', 'Exit',
          'Device', 'OS', 'OS version', 'Browser', 'Browser version', 'Screen', 'Window', 'Pixel ratio', 'Touch', 'Graphics', 'Memory GB', 'Cores', 'Connection', 'Language', 'Came from',
          'Start orientation', 'Last orientation', 'Orientation changes', 'Load ms', 'Average fps', 'Slowest 10% fps', 'Longest stall ms', 'Build', 'Problems (JSON)'],
        ...entries.map((r) => [r.visitor, r.user, iso(r.firstSeen), iso(r.startedAt), iso(r.updatedAt), title(r.game), r.city, r.country, r.played, r.seconds, r.chapter, r.step,
          (r.reached || []).map(([c, s]) => `${c}@${s}s`).join(' '), r.screen, r.exit, r.device, r.os, r.osVersion, r.browser, r.browserVersion,
          r.screenW ? `${r.screenW}x${r.screenH}` : '', r.viewW ? `${r.viewW}x${r.viewH}` : '', r.dpr, r.touch, r.gpu, r.memory, r.cores, r.net, r.lang, r.referrer,
          r.startOrientation, r.orientation, r.rotations, r.perf?.load, r.perf?.fps, r.perf?.fpsLow, r.perf?.longest, r.build, r.issues && JSON.stringify(r.issues)])]
      : kind === 'contact'
        ? [['Received (ISO UTC)', 'Name', 'Email', 'Role', 'Enquiry', 'Message'], ...entries.map((x) => [iso(x.receivedAt), x.name, x.email, x.role, x.enquiry, x.message])]
        : kind === 'newsletter'
          ? [['Email', 'Signed up (ISO UTC)'], ...entries.map((x) => [x.email, iso(x.receivedAt)])]
          : [['Email'], ...[...new Map(entries.map((x) => [x.email.toLowerCase(), x.email])).values()].sort().map((email) => [email])];
    const content = rows.map((values) => values.map(csvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['﻿', content], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `PastPort-${kind}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
  $('export-usage').onclick = () => downloadCsv('usage', filtered(all));
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
