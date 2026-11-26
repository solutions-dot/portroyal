/* The library on the menu: who is travelling (profiles), kinds of story (genres), a details sheet for each game,
   star ratings, and the "For you" picks. Like a streaming library, with no accounts and no server of our own.
   The owner's decisions (22 November 2026) and how each part works are in docs/PLATFORM.md, "The library".

   Everything is kept in this browser only (localStorage), and the page works without it:
     pastport-profile   "kids" or "teen". Kids is the start. The year of birth that opens "teen" is used once and never kept.
     pastport-ratings   { "<game id>": 1 to 5 }, your own stars.
     pastport-visits    { "<game id>": { "n": how many times, "t": the last time } }, set when you press Go there.

   RATINGS_URL is where shared ratings ("for other viewers") live. It is empty on purpose until the owner chooses a small
   backend, exactly like SUBSCRIBE_URL in site.js. While it is empty nothing is sent anywhere and no average is shown.
   When it is set:
     on load    GET  RATINGS_URL  answers { "<game id>": { "sum": 123, "n": 30 }, ... }
     on rating  POST RATINGS_URL  with { "game": "<game id>", "stars": 4, "was": 3 }   ("was" is this device's last rating, or 0)
   Nothing else is ever sent: no name, no device id. Children use this. */
const RATINGS_URL = '';

/* ---------- the thinking: no page needed, so the tests in tests/menu-library.mjs can run it in Node ---------- */
const PastPortLibrary = (() => {
  /* The kinds of story, in the order of the chips. A chip shows only when a game you can see has that kind. */
  const GENRES = [['mystery', 'Mystery'], ['disasters', 'Disasters'], ['freedom', 'Freedom and rights'], ['leaders', 'Leaders'], ['family', 'Family stories'], ['battles', 'Battles']];
  const genreName = (id) => { const g = GENRES.find((x) => x[0] === id); return g ? g[1] : ''; };
  const words = (s) => String(s || '').trim().split(/\s+/).filter(Boolean);
  const shared = (a, b) => a.filter((x) => b.includes(x)).length;

  /* profiles: anything that is not "teen" is Kids */
  const cleanProfile = (v) => (v === 'teen' ? 'teen' : 'kids');
  const isMature = (game) => +game.age >= 13;
  const canSee = (game, profile) => !game.disabled && (!isMature(game) || cleanProfile(profile) === 'teen');
  const visibleGames = (catalog, profile) => catalog.filter((g) => canSee(g, profile));
  /* The year you were born, asked once when Kids changes to Teens and adults. Answers "teen", "kids", or "unclear" for anything that is not a likely year.
     This is a soft gate. It only knows the year, so a child who turns 13 later this year passes, and so does a child who types another year. */
  const gateFromYear = (year, thisYear) => {
    const y = Number(String(year).trim());
    if (!Number.isInteger(y) || y < thisYear - 120 || y > thisYear) return 'unclear';
    return thisYear - y >= 13 ? 'teen' : 'kids';
  };

  const genresInUse = (games) => GENRES.map((g) => g[0]).filter((id) => games.some((g) => g.genres.includes(id)));
  const byGenre = (games, genre) => (!genre || genre === 'all' ? games : games.filter((g) => g.genres.includes(genre)));

  /* what was saved may be old or broken: keep only what makes sense */
  const cleanRatings = (o) => { const out = {}; if (o && typeof o === 'object') for (const k of Object.keys(o)) { const n = Number(o[k]); if (Number.isInteger(n) && n >= 1 && n <= 5) out[k] = n; } return out; };
  const cleanVisits = (o) => { const out = {}; if (o && typeof o === 'object') for (const k of Object.keys(o)) { const v = o[k], n = v && Number(v.n); if (Number.isInteger(n) && n > 0) out[k] = { n, t: Number(v.t) || 0 }; } return out; };

  /* "For you". Only games this profile can see take part, as picks and as reasons.
     A game you know (you went there, or you rated it) is never a pick. Each game you know counts once:
       liked (4 or 5 stars)   +3 for each kind of story it shares with the pick, +1 for each shared tag
       went (no stars, or 3)  +2 for each shared kind, +1 for each shared tag
       not liked (1 or 2)     -3 for each shared kind
     A game with the New badge gets +1. Only a pick that ends above 0 is shown, best first, and ties keep the timeline order.
     With no visits and no ratings that leaves the New games, or nothing at all. */
  const recommend = (catalog, profile, ratings, visits, limit = 3) => {
    const games = visibleGames(catalog, profile), stars = (g) => ratings[g.id] || 0, went = (g) => !!(visits[g.id] && visits[g.id].n > 0), known = (g) => went(g) || stars(g) > 0;
    const sources = games.filter(known).map((g) => ({ game: g, kind: stars(g) >= 4 ? 'liked' : stars(g) >= 1 && stars(g) <= 2 ? 'no' : 'went', t: (visits[g.id] && visits[g.id].t) || 0 }));
    const picks = [];
    for (const g of games) {
      if (known(g)) continue;
      let score = g.isNew ? 1 : 0, best = null;
      for (const s of sources) {
        const kinds = shared(g.genres, s.game.genres);
        if (s.kind === 'no') { score -= 3 * kinds; continue; }
        const pts = (s.kind === 'liked' ? 3 : 2) * kinds + shared(g.tags, s.game.tags);
        score += pts;
        if (pts > 0 && (!best || pts > best.pts || (pts === best.pts && (s.kind === 'liked') > (best.s.kind === 'liked')) || (pts === best.pts && s.kind === best.s.kind && s.t > best.s.t))) best = { s, pts };
      }
      if (score > 0) picks.push({ game: g, score, why: best ? best.s.kind : 'new', reason: best ? (best.s.kind === 'liked' ? 'Because you liked ' : 'Because you went to ') + best.s.game.title : 'New' });
    }
    return picks.sort((a, b) => b.score - a.score).slice(0, limit);
  };

  /* "More like this" on a game's sheet: other games this profile can see, most shared kinds first, then most shared tags. A game that shares nothing is left out. */
  const similar = (game, catalog, profile, limit = 3) => visibleGames(catalog, profile).filter((g) => g.id !== game.id)
    .map((g) => ({ g, kinds: shared(g.genres, game.genres), tags: shared(g.tags, game.tags) })).filter((x) => x.kinds + x.tags > 0)
    .sort((a, b) => b.kinds - a.kinds || b.tags - a.tags).slice(0, limit).map((x) => x.g);

  /* ratings */
  const starWords = (n) => n + ' of 5 stars';
  /* the shared average: "4.1 of 5, from 30 ratings". Nothing under 3 ratings, and nothing if the numbers make no sense. Never a made-up number. */
  const formatAverage = (e) => {
    const n = e ? Number(e.n) : 0, sum = e ? Number(e.sum) : 0;
    if (!Number.isInteger(n) || n < 3 || !(sum >= n) || !(sum <= 5 * n)) return '';
    return (sum / n).toFixed(1) + ' of 5, from ' + n + ' ratings';
  };
  /* this device's own vote, added to the totals it was given, so the number on screen includes it straight away */
  const addVote = (e, stars, was) => ({ sum: Math.max(0, ((e && Number(e.sum)) || 0) + stars - was), n: Math.max(0, ((e && Number(e.n)) || 0) + (stars ? 1 : 0) - (was ? 1 : 0)) });

  return { RATINGS_URL, GENRES, genreName, words, cleanProfile, isMature, canSee, visibleGames, gateFromYear, genresInUse, byGenre, cleanRatings, cleanVisits, recommend, similar, starWords, formatAverage, addVote };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = PastPortLibrary;   /* Node (the tests): only the thinking above, no page */

/* ---------- the page ---------- */
if (typeof document !== 'undefined') (() => {
  const L = PastPortLibrary, root = document.documentElement;
  /* ?embed=1: the page is the "i" pop-up inside a game's title screen (engine/rate.js puts it in an overlay). Only the sheet shows; closing it tells the game. */
  let EMBED = false, EMBED_ID = '';
  try { const q = new URLSearchParams(location.search); EMBED = q.get('embed') === '1'; EMBED_ID = q.get('rate') || ''; } catch (e) { /* not embedded */ }
  if (EMBED) root.classList.add('lib-embed');
  const toGame = (msg) => { try { if (EMBED && parent !== window) parent.postMessage({ pastport: msg }, location.origin); } catch (e) { /* no game around us */ } };
  const PROFILE_KEY = 'pastport-profile', RATINGS_KEY = 'pastport-ratings', VISITS_KEY = 'pastport-visits';
  const NAMES = { kids: 'Kids', teen: 'Teens and adults' }, MATURE = 'Mature 13+';
  const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.6L14.47 9.2 21.51 9.51 15.99 13.9 17.88 20.69 12 16.8 6.12 20.69 8.01 13.9 2.49 9.51 9.53 9.2z"/></svg>';
  const FACE = {   /* the two travellers: a round mango face for Kids, a squarer sea-glass one for Teens and adults */
    kids: '<svg class="lib-face" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><circle cx="20" cy="20" r="19" fill="#FFB627"/><circle cx="14" cy="17" r="2.4" fill="#041B2A"/><circle cx="26" cy="17" r="2.4" fill="#041B2A"/><path d="M12.5 24c2 3.3 4.6 4.8 7.5 4.8s5.5-1.5 7.5-4.8" fill="none" stroke="#041B2A" stroke-width="2.4" stroke-linecap="round"/></svg>',
    teen: '<svg class="lib-face" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect x="1" y="1" width="38" height="38" rx="12" fill="#1FB5A3"/><circle cx="14" cy="17" r="2.2" fill="#041B2A"/><circle cx="26" cy="17" r="2.2" fill="#041B2A"/><path d="M14 25.5c1.8 1.7 3.8 2.4 6 2.4s4.2-.7 6-2.4" fill="none" stroke="#041B2A" stroke-width="2.4" stroke-linecap="round"/></svg>',
  };

  /* storage: every read and write may fail (private mode, a full or blocked store). The page then just forgets when it closes. */
  const read = (key) => { try { return localStorage.getItem(key); } catch (e) { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch (e) { /* not kept: fine */ } };
  const readObject = (key) => { try { return JSON.parse(read(key) || 'null'); } catch (e) { return null; } };

  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const $ = (id) => document.getElementById(id);
  const show = (d) => { if (d.open) return; if (d.showModal) d.showModal(); else d.setAttribute('open', ''); };
  const shut = (d) => { if (!d.open) return; if (d.close) d.close(); else d.removeAttribute('open'); };

  async function start() {
    let settings = {};
    try { settings = await window.PastPortSettings || {}; } catch { /* the game page checks access again */ }
    const list = document.querySelector('.games'), top = $('library');
    if (!list || !top) return;
    const chipsEl = top.querySelector('.lib-chips'), profileBtn = $('profileopen'), forYou = top.querySelector('.lib-foryou'), tilesEl = top.querySelector('.lib-tiles'), statusEl = $('libstatus'), kidsNote = $('kidsnote');
    const profilePanel = $('profilepanel'), sheet = $('gamesheet');

    let profile = 'kids', ratings = {}, visits = {}, genre = 'all', shared = {};
    const sync = () => { profile = L.cleanProfile(read(PROFILE_KEY) || settings.defaultProfile); ratings = L.cleanRatings(readObject(RATINGS_KEY)); visits = L.cleanVisits(readObject(VISITS_KEY)); };
    sync();

    /* ----- the games, read from the cards. Each card is wrapped in a slot, so its round "i" button can sit beside the link and not inside it. ----- */
    const catalog = [...list.querySelectorAll(':scope > a.game[data-game]')].map((card, i) => {
      const h = card.querySelector('h2'), p = card.querySelector('p:not(.tag)'), tag = card.querySelector('.tag');
      const g = { id: card.dataset.game, card, title: (h ? h.textContent : card.dataset.game).trim(), text: p ? p.textContent.trim() : '', year: +card.dataset.year || 0,
        genres: L.words(card.dataset.genres).filter((id) => L.genreName(id)), tags: L.words(card.dataset.tags), age: +card.dataset.age >= 13 ? 13 : 6, warn: (card.dataset.warn || '').trim(), isNew: !!tag && /^\s*new\s*$/i.test(tag.textContent) };
      const setting = settings.games?.[g.id];
      if (setting) {
        g.disabled = !setting.enabled;
        g.age = setting.category === 'teen' ? 13 : 6;
        card.dataset.age = String(g.age);
      }
      const slot = g.slot = el('div', 'slot'); slot.style.setProperty('--i', Math.min(i, 5));   /* --i: the same order the cards rise in after the intro (intro.js) */
      list.insertBefore(slot, card); slot.appendChild(card);
      const info = g.info = el('button', 'lib-info'); info.type = 'button'; info.setAttribute('aria-label', 'About ' + g.title); info.setAttribute('aria-haspopup', 'dialog'); info.appendChild(el('span', '', 'i')).setAttribute('aria-hidden', 'true');
      info.addEventListener('click', () => openSheet(g, false, info));
      /* the "i" button is not on the menu cards (owner, 22 November 2026): it is on each game's own title screen (engine/rate.js) and opens this same sheet. */
      if (h && g.genres[0]) h.parentNode.insertBefore(el('span', 'year lib-genre', L.genreName(g.genres[0])), h);   /* the main kind of story, in the card's own colour */
      g.meta = el('span', 'lib-meta'); (p || h || card).parentNode.appendChild(g.meta);
      if (g.age >= 13) card.appendChild(el('span', 'lib-age', MATURE));
      for (const press of ['click', 'auxclick']) card.addEventListener(press, (e) => leaveFor(g, e));   /* auxclick: the middle mouse button, which opens a new tab */
      return g;
    });
    const byId = (id) => catalog.find((g) => g.id === id);

    /* the card's own picture, for the small tiles and the sheet (two cards keep theirs on ::before) */
    const picture = (g) => {
      if (g.pic == null) { g.pic = ''; for (const pseudo of [null, '::before']) { const m = /url\((["']?)(.*?)\1\)/.exec(getComputedStyle(g.card, pseudo).backgroundImage || ''); if (m) { g.pic = 'url("' + m[2] + '")'; break; } } }
      return g.pic;
    };
    const thumb = (g) => { const t = el('span', 'lib-thumb'); t.setAttribute('aria-hidden', 'true'); if (picture(g)) t.style.backgroundImage = picture(g); return t; };
    const smallStars = (n) => { const s = el('span', 'lib-ministars'); s.setAttribute('aria-hidden', 'true'); s.innerHTML = [1, 2, 3, 4, 5].map((i) => STAR.replace('<svg', '<svg class="' + (i <= n ? 'on' : 'off') + '"')).join(''); return s; };
    const say = (text) => { statusEl.textContent = text; };
    const average = (g) => (RATINGS_URL ? L.formatAverage(shared[g.id]) : '');

    /* ----- going to a game ----- */
    const visit = (g) => { const v = visits[g.id] || { n: 0, t: 0 }; visits[g.id] = { n: v.n + 1, t: Date.now() }; write(VISITS_KEY, JSON.stringify(visits)); };
    function leaveFor(g, e) {   /* apply profile visibility to every route from the menu */
      if (!L.canSee(g, profile)) { e.preventDefault(); return; }
      visit(g);
    }

    /* ----- drawing ----- */
    function drawCards() {
      let hiddenByAge = 0;
      for (const g of catalog) {
        const ok = L.canSee(g, profile); if (!ok && !g.disabled) hiddenByAge++;
        g.slot.hidden = !(ok && (genre === 'all' || g.genres.includes(genre)));
        const mine = ratings[g.id] || 0, avg = average(g); g.meta.textContent = '';
        if (mine) { const you = el('span', 'lib-you'); you.append(el('span', '', 'You'), smallStars(mine), el('span', 'lib-sr', ': ' + L.starWords(mine) + '.')); g.meta.appendChild(you); }
        if (avg) g.meta.appendChild(el('span', 'lib-avg', avg));
      }
      kidsNote.hidden = !(profile === 'kids' && hiddenByAge > 0);
    }
    function drawChips() {
      const use = L.genresInUse(L.visibleGames(catalog, profile)); if (genre !== 'all' && !use.includes(genre)) genre = 'all';
      chipsEl.textContent = '';
      for (const id of ['all', ...use]) { const b = el('button', 'lib-chip', id === 'all' ? 'All' : L.genreName(id)); b.type = 'button'; b.dataset.genre = id; b.setAttribute('aria-pressed', String(id === genre)); chipsEl.appendChild(b); }
    }
    function drawProfile() {
      root.classList.toggle('lib-teen', profile === 'teen');   /* library.css keeps Mature 13+ cards out of sight unless this is set */
      profileBtn.querySelector('.lib-facebox').innerHTML = FACE[profile]; profileBtn.querySelector('.lib-name').textContent = NAMES[profile];
      for (const b of profilePanel.querySelectorAll('.lib-choice')) b.setAttribute('aria-pressed', String(b.dataset.profile === profile));
    }
    const tile = (g, line, lineClass, href) => {
      const a = el('a', 'lib-tile'), box = el('span', 'lib-tiletext'); a.href = href || g.card.href;
      box.appendChild(el('b', '', g.title)); if (g.age >= 13) box.appendChild(el('span', 'lib-agetag', MATURE)); box.appendChild(el('span', 'lib-why' + (lineClass ? ' ' + lineClass : ''), line));
      a.append(thumb(g), box); return a;
    };
    /* "For you" is switched off for now (owner, 22 November 2026: "Remove the for you recommendations feature for now"). The scoring, its tests and
       the visit record stay, so setting FOR_YOU to true brings the strip back as it was. "More like this" in each game's sheet is not part of it. */
    const FOR_YOU = false;
    function drawForYou() {   /* the picks are for the whole library, so they step aside while one kind of story is chosen */
      const picks = FOR_YOU && genre === 'all' ? L.recommend(catalog, profile, ratings, visits, 3) : [];
      tilesEl.textContent = ''; forYou.hidden = !picks.length;
      for (const p of picks) { const a = tile(p.game, p.reason, p.why === 'new' ? 'lib-new' : ''); for (const press of ['click', 'auxclick']) a.addEventListener(press, (e) => leaveFor(p.game, e)); tilesEl.appendChild(a); }
    }
    const drawAll = () => { drawProfile(); drawChips(); drawCards(); drawForYou(); };

    /* ----- kinds of story ----- */
    chipsEl.addEventListener('click', (e) => {
      const b = e.target.closest('.lib-chip'); if (!b) return;
      genre = b.dataset.genre; for (const c of chipsEl.children) c.setAttribute('aria-pressed', String(c === b));
      drawCards(); drawForYou();
      const n = catalog.filter((g) => !g.slot.hidden).length; say(genre === 'all' ? 'Showing all ' + n + ' stories.' : 'Showing ' + n + (n === 1 ? ' story: ' : ' stories: ') + L.genreName(genre) + '.');
    });

    /* ----- a dialog closes on its Close button, on Escape (the browser does that), and on a press outside it ----- */
    const wire = (d, onClose) => {
      for (const b of d.querySelectorAll('[data-close]')) b.addEventListener('click', () => shut(d));
      d.addEventListener('click', (e) => { const r = d.getBoundingClientRect(); if (e.target === d && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) shut(d); });
      d.addEventListener('close', () => { const o = d.opener; d.opener = null; if (onClose) onClose(); if (o && o.isConnected && !o.closest('[hidden]')) o.focus(); });
    };

    /* ----- who is travelling ----- */
    const steps = [...profilePanel.querySelectorAll('.lib-step')], yearForm = profilePanel.querySelector('form'), yearBox = yearForm.querySelector('input'), yearMsg = yearForm.querySelector('.lib-msg');
    const step = (name) => { for (const s of steps) { s.hidden = s.dataset.step !== name; if (!s.hidden) profilePanel.setAttribute('aria-labelledby', s.querySelector('h2').id); } yearBox.value = ''; yearMsg.textContent = ''; };
    const setProfile = (p) => { profile = L.cleanProfile(p); write(PROFILE_KEY, profile); drawAll(); say('Travelling as ' + NAMES[profile] + '.'); };
    for (const b of profilePanel.querySelectorAll('[data-face]')) b.innerHTML = FACE[b.dataset.face];
    profileBtn.addEventListener('click', () => { step('pick'); profilePanel.opener = profileBtn; show(profilePanel); profilePanel.querySelector('.lib-choice[aria-pressed="true"]').focus(); });
    for (const b of profilePanel.querySelectorAll('.lib-choice')) b.addEventListener('click', () => {
      if (b.dataset.profile === profile) return shut(profilePanel);
      if (b.dataset.profile === 'kids') { setProfile('kids'); return shut(profilePanel); }   /* back to Kids needs no check */
      step('year'); yearBox.max = new Date().getFullYear(); yearBox.focus();
    });
    yearForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const answer = L.gateFromYear(yearBox.value, new Date().getFullYear()); yearBox.value = '';   /* the year is used here, once, and kept nowhere */
      if (answer === 'teen') { setProfile('teen'); shut(profilePanel); }
      else if (answer === 'kids') { step('young'); profilePanel.querySelector('[data-step="young"] button').focus(); }
      else { yearMsg.textContent = 'Please type the year you were born, as four numbers.'; yearBox.focus(); }
    });
    profilePanel.querySelector('[data-back]').addEventListener('click', () => { step('pick'); profilePanel.querySelector('.lib-choice[aria-pressed="true"]').focus(); });
    wire(profilePanel, () => step('pick'));

    /* ----- the details sheet ----- */
    const S = { banner: sheet.querySelector('.lib-banner'), genre: $('sheetgenre'), title: $('sheettitle'), age: $('sheetage'), warn: $('sheetwarn'), text: $('sheettext'), go: $('sheetgo'), stars: sheet.querySelector('.lib-starrow'), yours: $('sheetyours'), clear: $('sheetclear'), avg: $('sheetavg'), saved: $('sheetsaved'), more: $('sheetmore'), moreList: sheet.querySelector('.lib-morelist') };
    let sheetGame = null, fromUrl = false;
    const starLabels = [1, 2, 3, 4, 5].map((n) => {
      const lab = el('label', 'lib-star'), input = el('input'); input.type = 'radio'; input.name = 'libstars'; input.value = n;
      lab.appendChild(input); lab.insertAdjacentHTML('beforeend', STAR); lab.appendChild(el('span', 'lib-sr', n === 1 ? '1 star' : n + ' stars')); S.stars.appendChild(lab);
      input.addEventListener('click', () => { if (sheetGame && (ratings[sheetGame.id] || 0) === n) rate(sheetGame, 0); });   /* the same star again takes it back */
      input.addEventListener('change', () => { if (sheetGame && input.checked) rate(sheetGame, n); });
      return lab;
    });
    if (RATINGS_URL) S.saved.textContent = 'Your stars help other travellers choose. We send only the game and the stars.';
    function drawRating(note) {
      const g = sheetGame; if (!g) return; const mine = ratings[g.id] || 0, avg = average(g);
      starLabels.forEach((lab, i) => { lab.classList.toggle('on', i < mine); lab.firstChild.checked = i + 1 === mine; });
      S.yours.textContent = note || (mine ? 'Your rating: ' + L.starWords(mine) : ''); S.clear.hidden = !mine;
      S.avg.hidden = !avg; S.avg.textContent = avg ? 'All travellers: ' + avg : '';
    }
    function rate(g, n) {   /* n is 1 to 5, or 0 to take the rating back */
      const was = ratings[g.id] || 0; if (n === was) return;
      if (n) ratings[g.id] = n; else delete ratings[g.id];
      write(RATINGS_KEY, JSON.stringify(ratings));
      if (RATINGS_URL) { shared[g.id] = L.addVote(shared[g.id], n, was); send(g.id, n, was); }
      drawRating(n ? '' : 'Your rating is cleared.'); drawCards(); drawForYou();
    }
    S.clear.addEventListener('click', () => { if (sheetGame) { rate(sheetGame, 0); starLabels[0].firstChild.focus(); } });
    function openSheet(g, toStars, opener) {
      if (!L.canSee(g, profile)) return;
      sheetGame = g;
      S.banner.style.backgroundImage = picture(g) || 'none'; S.genre.textContent = L.genreName(g.genres[0]); S.title.textContent = g.title; S.text.textContent = g.text;
      S.age.textContent = g.age >= 13 ? MATURE + '. For ages 13 and up.' : 'For ages 6 and up'; S.age.classList.toggle('lib-mature', g.age >= 13); S.warn.textContent = g.age >= 13 ? g.warn : ''; S.warn.hidden = !S.warn.textContent;
      sheet.classList.toggle('lib-here', EMBED && g.id === EMBED_ID);   /* the game you are in: its own title screen already shows its picture, name, story and buttons (owner, 22 November 2026) */
      S.go.href = g.card.href; S.go.hidden = EMBED && g.id === EMBED_ID; if (EMBED) S.go.target = '_top';   /* inside a game: no Go there for the game you are in; another game opens in the whole tab */
      drawRating();
      const others = L.similar(g, catalog, profile, 3); S.more.hidden = !others.length; S.moreList.textContent = '';
      for (const o of others) { const li = el('li'), a = tile(o, L.genreName(o.genres[0]), '', '#' + o.id); a.addEventListener('click', (e) => { e.preventDefault(); openSheet(o, false); }); li.appendChild(a); S.moreList.appendChild(li); }
      if (!sheet.open) { sheet.opener = opener || null; show(sheet); }
      sheet.scrollTop = 0; (toStars ? (S.stars.querySelector('input:checked') || starLabels[0].firstChild) : S.title).focus();
    }
    for (const press of ['click', 'auxclick']) S.go.addEventListener(press, (e) => { if (sheetGame) leaveFor(sheetGame, e); });
    wire(sheet, () => {
      sheetGame = null; if (EMBED) { toGame('close-sheet'); return; } if (!fromUrl) return; fromUrl = false;
      try { const u = new URL(location.href); u.searchParams.delete('rate'); history.replaceState(null, '', u.pathname + u.search); } catch (e) { /* the address stays as it was */ }   /* so loading the page again does not open the sheet again */
    });

    /* ----- a link straight to a game's sheet: ?rate=<game id> (focus on the stars) or #<game id>. A game this profile cannot see stays out of reach. ----- */
    function openFromUrl() {
      let id = '', stars = false;
      try { const q = new URLSearchParams(location.search).get('rate'); if (q) { id = q; stars = true; } else id = decodeURIComponent(location.hash.slice(1)); } catch (e) { return; }
      const g = id && byId(id); if (!g || !L.canSee(g, profile)) return;
      fromUrl = true; openSheet(g, stars);
    }
    const whenMenuShows = (fn) => {   /* a dialog sits above everything, so wait until the intro has gone */
      if (!root.classList.contains('intro-on')) return fn();
      let done = false; const run = () => { if (done) return; done = true; watch.disconnect(); fn(); };
      const watch = new MutationObserver(() => { if (!root.classList.contains('intro-on')) run(); });
      watch.observe(root, { attributes: true, attributeFilter: ['class'] });
      if (!window.IntroSting) setTimeout(run, 8200);   /* intro.js did not load: intro.css hides the overlay by itself after 8 seconds */
    };
    addEventListener('hashchange', () => whenMenuShows(openFromUrl));

    /* ----- shared ratings: off until RATINGS_URL is set. A failure is silent and never blocks the page. ----- */
    function send(game, stars, was) {
      try { fetch(RATINGS_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ game, stars, was }), credentials: 'omit', referrerPolicy: 'no-referrer', keepalive: true }).catch(() => {}); } catch (e) { /* nothing to do */ }
    }
    if (RATINGS_URL) try {
      fetch(RATINGS_URL, { credentials: 'omit', referrerPolicy: 'no-referrer' }).then((r) => (r.ok ? r.json() : null)).then((j) => { if (j && typeof j === 'object') { shared = j; drawCards(); drawRating(); } }).catch(() => {});
    } catch (e) { /* nothing to do */ }

    /* ----- go ----- */
    root.classList.add('lib-on'); root.classList.remove('pp-menu-loading'); top.hidden = false;
    drawAll();
    /* coming back from a game with the Back button, or a change made in another tab: read what is saved again */
    addEventListener('pageshow', (e) => { if (e.persisted) { sync(); drawAll(); } });
    addEventListener('storage', (e) => { if ([PROFILE_KEY, RATINGS_KEY, VISITS_KEY].includes(e.key) && !profilePanel.open && !sheet.open) { sync(); drawAll(); } });
    whenMenuShows(openFromUrl);
    if (EMBED) toGame(sheet.open ? 'sheet-open' : 'close-sheet');   /* the game shows the frame only once the pop-up is up, or takes it away */   /* nothing this profile may see: the game takes the overlay away */
  }
  /* Start when the whole page is read: by then site.js has put the cards in order and the script at the foot of index.html has set their links. */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
