/* tools/checks/adapters/bog-walk.js: a test adapter that lets engine/checks.js run on Bog Walk's dev build WITHOUT changing the game.
   tools/checks_browser.mjs harness bog-walk injects engine/checks.js (as window.Checks) and this file after the page has loaded; it reads the
   game through window.__bw, the object the dev build already exposes (games/bog-walk/src/main.js, DEV). When the game wires ?test=all itself
   (the one block in docs/TESTING.md, section 7), this adapter moves into games/bog-walk/src/dev.js and `move` calls the game's own clampWorld.
   Plain script (no imports): it runs in the page. */
(() => {
  const D = window.__bw, $ = (id) => document.getElementById(id), sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const WORLD = ['station', 'kingston', 'yard', 'ruins'], CH_OF = { station: 0, kingston: 1, yard: 4, ruins: 5 };
  const chapterOf = (s) => Math.max(0, Math.min(5, Math.floor(s / 10) - 1));
  const settle = async () => { for (let i = 0; i < 200 && D.fading; i++) await sleep(100); await sleep(300); };
  const P = () => (D.cur === 'tube' ? null : D.PL[D.cur]);
  /* the game's clampWorld (main.js), copied: bounds, walls pushed out by 0.25 m, people by 0.5 m. Stepped in 5 cm moves as a frame loop would. */
  const clampWorld = (Q, x, z) => {
    const b = Q.bounds; x = Math.max(b.x0, Math.min(b.x1, x)); z = Math.max(b.z0, Math.min(b.z1, z));
    for (let pass = 0; pass < 2; pass++) for (const [x0, z0, x1, z1] of Q.walls) if (x > x0 - 0.25 && x < x1 + 0.25 && z > z0 - 0.25 && z < z1 + 0.25) { const dl = x - (x0 - 0.25), dr = x1 + 0.25 - x, dt = z - (z0 - 0.25), db = z1 + 0.25 - z, m = Math.min(dl, dr, dt, db); if (m === dl) x = x0 - 0.25; else if (m === dr) x = x1 + 0.25; else if (m === dt) z = z0 - 0.25; else z = z1 + 0.25; }
    for (const n of Q.npcs) { if (!n.m || !n.m.visible) continue; const rr = /^Sit/.test(n.anim || '') ? 0.45 : 0.5, d = Math.hypot(x - n.x, z - n.z); if (d < rr) { x = n.x + (x - n.x) / (d || 1) * rr; z = n.z + (z - n.z) / (d || 1) * rr; } }
    return [x, z];
  };
  const people = () => { const Q = P(); return Q ? Q.people.filter((n) => n.m && n.m.visible) : []; };
  const clipOf = (n) => { const a = n.ctl && n.ctl.cur; return a ? { name: a.getClip().name, t: a.getClip().duration ? (a.time % a.getClip().duration) / a.getClip().duration : 0 } : { name: n.anim, t: 0 }; };

  window.__adapter = {
    async ready() { for (let i = 0; i < 600 && !D.modelsReady; i++) await sleep(200); if (!D.S.started) { D.startGame(); await sleep(200); } },
    journal: () => ({ pages: D.JOURNAL, ...(window.__tables.journal || {}) }),
    chapters: () => D.CHAPTERS.map((c, i) => ({ name: c.name, i })),
    async openChapter(i) { await D.beginChapter(i); await settle(); if (D.cur === 'tube' && i !== 2 && i !== 3) throw new Error('stayed in the Tube'); },
    step: () => D.stage,
    people: () => people().map((n) => ({ id: n.id, name: n.who, body: n.base || n.bodyId, hat: n.hat === undefined ? undefined : JSON.stringify(n.hat) })),
    /* the steps outside the Tube (the Tube's own checks are ?test=audit and ?test=held) */
    steps: () => Object.keys(D.TALK_TARGETS).map(Number).filter((s) => !(s >= 30 && s < 50)).sort((a, b) => a - b),
    async goStep(s) { await D.beginChapter(chapterOf(s), s); await settle(); },
    place() { const Q = P(); if (!Q) return null; return { id: Q.id, walls: Q.walls, bounds: Q.bounds, start: [Q.start.x, Q.start.z], r: 0.25, groundAt: () => 0, blocked: null }; },
    targets() { const Q = P(); if (!Q) return []; return (D.TALK_TARGETS[D.stage] || []).map((id) => { const n = D.byId(id); return n && Q.people.includes(n) ? { id, x: n.x, z: n.z, r: 1.6 } : { id, x: NaN, z: NaN }; }).filter((t) => !isNaN(t.x)); },
    held: () => [],
    snapshot: () => ({ stage: D.stage, goal: $('goal').classList.contains('folded') ? undefined : $('goal').textContent, place: D.cur, people: people().map((n) => n.id) }),
    save() { D.saveGame(); return D.loadGame(); },
    async restore(d) { D.applySave(d); const st = D.stage, ch = chapterOf(st); await D.beginChapter(ch, ch === 2 || ch === 3 ? undefined : st); await settle(); },
    places: () => WORLD,
    async goPlace(id) { await D.beginChapter(CH_OF[id]); await settle(); },
    move(a, b, Q) { Q = Q && Q.walls ? D.PL[Q.id] : P(); let p = a.slice(); const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.05) || 1; for (let i = 1; i <= n; i++) p = clampWorld(Q, p[0] + (b[0] - a[0]) / n, p[1] + (b[1] - a[1]) / n); return p; },
    camera: () => { const c = D.camera.position; return { x: c.x, y: c.y, z: c.z }; },
    async talks() { return (D.TALK_TARGETS[D.stage] || []).filter((id) => { const n = D.byId(id); return n && people().includes(n); }); },
    async talkTo(id) { const n = D.byId(id); if (!n) return; D.S.x = n.x + Math.sin(n.ry || 0) * 1.4; D.S.z = n.z + Math.cos(n.ry || 0) * 1.4; D.startTalk(n); await sleep(300); D.leaveTalk && D.leaveTalk(); },
    clips: () => people().map((n) => { const c = clipOf(n); return { id: n.id, clip: c.name, t: c.t, dist: Math.hypot(n.x - D.S.x, n.z - D.S.z) }; }),
    renderer: () => D.renderer, scene: () => D.scene,
    faces: () => people().map((n) => ({ id: n.id, body: n.m })),
    async frame(dt) { D.tick(dt); D.render(); },
    screens: () => ({
      play: async () => {},
      journal: async () => { D.openJournal(); },
      chapters: async () => { D.closeJournal(); D.openChapters(); },
      card: async () => { D.closeChapters(); D.card('A card', ['One short line.'], [{ t: 'OK', go: D.hideCard }]); },
    }),
  };
  /* this game's tables (the plan in docs/TESTING.md lists what each game fills in) */
  window.__tables = Object.assign(window.__tables || {}, {
    cast: { zeke: ['zeke', 'zekeV'], rudy: ['rudy', 'rudy4'], grant: ['grant'] },
    changes: [{ id: 'zeke', step: 14, field: 'body' }],
    budget: { frameMs: 120, calls: 400, triangles: 800000 },   /* software drawing in the headless browser is slow: phone numbers come from a real phone run with ?stats */
    settle: 300,
  });
})();
