/* Port Royal's dev checks (dev builds only: main.js calls wireChecks under __DEV__, so none of this ships).
     ?test=audit   the place audit in every place (engine/audit.js auditPlace): floating things, people inside solids or each other, seats, spots that cannot be
                   reached, things standing on nothing, solid things cut into each other. &p=town,tavern picks places. Also answers collision and seating.
     ?test=layout  interface text that overlaps, is cut off or runs off the screen, in each state (run at 390x800, 667x375, 800x500 and 1280x720)
     ?test=walkers every walking body walks whole loops at the speed the game moves it (engine/audit.js auditWalk): feet slide, sink or float
     ?test=life    everyone in every place does something: nobody frozen on an idle for long, no crowd in step, no head turned past what a neck can do,
                   no walk or run clip while standing still, nobody gliding on a standing clip, walkers paced to their speed
     ?test=all     the shared runner (engine/checks.js): journal, links, a11y, keys, chapters, steps, map, faces, budget, autoplay, camera, rule4, sound,
                   continuity, errors. &checks=journal,map runs some.
   Every check prints into #autolog and puts its count in the page title (docs/TESTING.md, section 5). */
import * as THREE from 'three';
import { snapMeshes, auditPlace, auditWalk, headWatch } from '../../../engine/audit.js';
import { faceCheck, skinShape } from '../../../engine/faces.js';
import { checkAll } from '../../../engine/checks.js';
import { CL, isSeated, strideOf, WALKS } from '../../../engine/anim.js';
import { AU, setSound } from '../../../engine/audio.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const $ = (id) => document.getElementById(id);
const log = (lines, title) => { let el = $('autolog'); if (!el) { el = document.createElement('pre'); el.id = 'autolog'; el.hidden = true; document.body.appendChild(el); } el.textContent = lines.join('\n'); if (title) document.title = title; };
const until = async (fn, ms = 120000) => { const t0 = Date.now(); while (!fn()) { if (Date.now() - t0 > ms) throw new Error('timed out waiting for the game to load'); await sleep(200); } };

/* who is who: the id each animated body goes by in the reports */
function idOf(A, m) {
  if (m === A.abba) return 'abba'; if (m === A.galdy) return 'galdy'; if (A.SOLDIER.m === m) return 'soldier';
  for (const [k, v] of Object.entries(A.people)) if (v === m) return k;
  for (const [k, v] of Object.entries(A.survivors)) if (v === m) return k + ' (camp)';
  const fb = A.FBG; if (fb.d && fb.d[0] === m) return 'Tom (drill)'; if (fb.d && fb.d[1] === m) return 'Dick (drill)'; if (fb.carrier === m) return 'sailor with crates (1670)';
  if (fb.cast && fb.cast.includes(m)) return 'buccaneer ' + fb.cast.indexOf(m) + ' (1670)';
  return m.userData.devId || ('person ' + m.uuid.slice(0, 4));
}
const shown = (o) => { for (let a = o; a; a = a.parent) if (!a.visible) return false; return true; };
/* every animated person drawn in the current place (Galdy only in the third-person view) */
function peopleHere(A) {
  const out = []; A.scene.traverse((o) => { if (o.userData && o.userData.anim && o !== A.galdy && shown(o)) out.push(o); });
  let k = 0; for (const m of out) if (!m.userData.devId && idOf(A, m).startsWith('person')) m.userData.devId = 'camp person ' + (++k);
  return out;
}
const clipOf = (m) => { const a = m.userData.anim; if (!a) return ''; let best = a.cur, bw = -1; for (const x of a.mx._actions) { const w = x.isRunning() ? x.getEffectiveWeight() : 0; if (w > bw) { bw = w; best = x; } } return best ? best.getClip().name : ''; };
const actionOf = (m) => { const a = m.userData.anim; if (!a) return null; let best = null, bw = -1; for (const x of a.mx._actions) { const w = x.isRunning() ? x.getEffectiveWeight() : 0; if (w > bw) { bw = w; best = x; } } return best; };

/* ---------- the places ---------- */
/* each place: how to get there, its edges, and the paths its walkers keep to (for the audit's route checks) */
function placeList(A) {
  const S = A.state, raw = A.raw, SH = A.SHORE;
  const back = (p) => [...p, ...p.slice(0, -1).reverse()];   /* a walker who goes there and back (the audit treats a path as a loop) */
  const reset = () => { A.hideCard(); A.closeJournal(); A.closeChapters(); if (!$('dialogue').hidden) A.leaveTalk(); A.fbReset(); A.busy = false; };   /* as playChapter does */
  return [
    { id: 'town', name: 'Port Royal, 1690 (harbour, main street, new street, Fort Charles)', bounds: { x0: A.X0 - 1.2, x1: 70, z0: -45, z1: 24 }, cell: 0.5,
      go: async () => { reset(); A.playChapter(A.CHAPTERS[0]); await sleep(50); S.x = 43; S.z = 0; },
      views: [[43, 0, Math.PI / 2], [21, 0.4, Math.PI / 2], [4, 0.2, Math.PI / 2], [10, 17.6, Math.PI / 2], [12, -27, Math.PI / 2], [-8, 0, -Math.PI / 2]],
      paths: () => ({ kofi: back(A.NPCS[0].route), soldier: back([[-6.18, -4.45], ...A.SOLDIER.path.slice(1)]),   /* he steps in at the tavern door, where he is hidden */ ...Object.fromEntries(Object.entries(A.STROLL).map(([k, p]) => [k === 'peter' ? 'peter' : k, p])) }) },
    { id: 'tavern', name: 'The Turtle tavern, 1690', bounds: { x0: A.IN.x0, x1: A.IN.x1, z0: A.IN.z0, z1: A.IN.z1 }, cell: 0.25, floors: [[A.IN.x0 + 0.3, A.IN.z0 + 0.3, A.IN.x1 - 0.3, -1.4]],   /* behind the bar: Abba's side, where the player does not go */
      go: async () => { reset(); A.playChapter(A.CHAPTERS[0]); await sleep(50); A.setPlace('in'); S.x = -203; S.z = 2.3; S.yaw = 0; },
      views: [[-203, 2.3, 0], [-199.5, 1.4, Math.PI / 2]] },
    { id: 'flashback', name: 'Ned’s story, August 1670', bounds: { x0: SH - 9.5, x1: SH + 22, z0: -5.5, z1: 6.5 }, cell: 0.5,
      go: async () => { reset(); A.playChapter(A.CHAPTERS[0]); await sleep(50); raw.fbStart(); await sleep(50); },
      views: [[SH + 15, 0, Math.PI / 2], [SH - 1, 1.6, Math.PI / 2]], paths: () => ({ 'sailor with crates (1670)': back([[SH + 1, 0.45], [SH + 10, 0.45]]) }) },
    { id: 'warehouse', name: 'Galdy’s warehouse, 1691', bounds: { x0: A.WX0, x1: A.WX1, z0: -2.2, z1: 5.2 }, cell: 0.25,
      go: async () => { reset(); raw.beginWare(); await sleep(50); }, views: [[-249, -0.4, Math.PI / 2]] },
    { id: 'quake', name: '7 June 1692, the calm before the shock', bounds: { x0: A.X0 - 1.2, x1: 70, z0: -45, z1: 24 }, cell: 0.5, noAudit: true,
      go: async () => { reset(); raw.beginQuake(); await sleep(50); }, views: [[1, 0.6, -Math.PI / 2]] },
    { id: 'sea', name: 'In the sea after the second shock', bounds: { x0: SH + 3.5, x1: SH + 75.5, z0: 8.5, z1: 75.5 }, cell: 1.0,
      go: async () => { reset(); raw.beginQuake(); await sleep(50); A.toSea(); await sleep(50); }, views: [[SH + 12, 22, 0]] },
    { id: 'camp', name: 'The survivors’ camp, 1692', bounds: { x0: A.X0 + 0.3, x1: 0.7, z0: -4.2, z1: 4.2 }, cell: 0.25,
      go: async () => { reset(); raw.beginAfter(); await sleep(50); }, views: [[-1.6, 0, Math.PI / 2], [-8, 0.2, Math.PI / 2]] },
    { id: 'yard', name: 'St Peter’s churchyard', bounds: { x0: A.YX + 0.5, x1: A.YX + 13.3, z0: A.YZ - 13.3, z1: A.YZ + 4.8 }, cell: 0.25,
      go: async () => { reset(); raw.toYard(); await sleep(50); }, views: [[A.YX + 11, A.YZ + 3.5, 0.95]] },
  ];
}
async function goPlace(A, id) { const P = placeList(A).find((p) => p.id === id); await P.go(); A.busy = false; for (let i = 0; i < 3; i++) A.tick(1 / 30); P.start = [A.state.x, A.state.z]; return P; }

/* walking: the game's own clamp, in small steps, sliding along walls as the frame loop does */
function makeMove(A) {
  return (from, to) => {
    const S = A.state, keep = [S.x, S.z, S.fz]; S.x = from[0]; S.z = from[1]; S.fz = null; if (A.FORT.ready && A.onSpit(S.x, S.z)) { try { S.fz = A.fz(S.x, S.z, null); } catch (e) { /* off the fort */ } }
    window.__prNoPeople = true;
    try { const d = Math.hypot(to[0] - from[0], to[1] - from[1]), n = Math.max(1, Math.ceil(d / 0.1));
      for (let i = 1; i <= n; i++) { const tx = from[0] + (to[0] - from[0]) * i / n, tz = from[1] + (to[1] - from[1]) * i / n; let [nx, nz] = A.clamp(tx, tz);
        if (Math.hypot(nx - tx, nz - tz) > 1e-4) { const [ax, az] = A.clamp(tx, S.z), [bx, bz] = A.clamp(S.x, tz), da = Math.hypot(ax - S.x, az - S.z), db = Math.hypot(bx - S.x, bz - S.z), dn = Math.hypot(nx - S.x, nz - S.z); if (da > dn && da >= db) { nx = ax; nz = az; } else if (db > dn) { nx = bx; nz = bz; } }
        if (nx === S.x && nz === S.z) break; S.x = nx; S.z = nz; }
      return [S.x, S.z]; }
    finally { window.__prNoPeople = false; [S.x, S.z, S.fz] = keep; }
  };
}
/* where the player can walk in a place: a grid filled from the start through the game's own clamp (people left out, so the spots they stand on count) */
function walkGrid(A, P) {
  const move = makeMove(A), b = P.bounds, c = P.cell || 0.5, nx = Math.ceil((b.x1 - b.x0) / c) + 1, nz = Math.ceil((b.z1 - b.z0) / c) + 1, seen = new Uint8Array(nx * nz);
  const at = (i, j) => [b.x0 + i * c, b.z0 + j * c], q = [];
  const si = Math.round((P.start[0] - b.x0) / c), sj = Math.round((P.start[1] - b.z0) / c);
  for (let d = 0; d <= 3 && !q.length; d++) for (let i = si - d; i <= si + d; i++) for (let j = sj - d; j <= sj + d; j++) { if (i < 0 || j < 0 || i >= nx || j >= nz || seen[i * nz + j]) continue; const p = at(i, j), r = move(P.start, p); if (Math.hypot(r[0] - p[0], r[1] - p[1]) < 1e-4) { seen[i * nz + j] = 1; q.push([i, j]); } }
  while (q.length) { const [i, j] = q.pop(), p = at(i, j);
    for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) { if (!di && !dj) continue; const a = i + di, e = j + dj; if (a < 0 || e < 0 || a >= nx || e >= nz || seen[a * nz + e]) continue; const t = at(a, e), r = move(p, t); if (Math.hypot(r[0] - t[0], r[1] - t[1]) < 1e-4) { seen[a * nz + e] = 1; q.push([a, e]); } } }
  const free = (x, z) => { const i = Math.round((x - b.x0) / c), j = Math.round((z - b.z0) / c); if (!(i >= 0 && j >= 0 && i < nx && j < nz && seen[i * nz + j] === 1)) return false; const p = move(at(i, j), [x, z]); return Math.hypot(p[0] - x, p[1] - z) < 1e-4; };   /* a reached grid centre does not make nearby points inside a fort wall walkable */
  /* the cells nobody can walk on, as rectangles (each row's runs), for the audit's walking walls */
  const floor = (x, z) => (P.floors || []).some((f) => x > f[0] && x < f[2] && z > f[1] && z < f[3]);   /* floor people stand on that the player does not walk (behind a bar) */
  const walls = []; for (let j = 0; j < nz; j++) { let s = -1; for (let i = 0; i <= nx; i++) { const open = i < nx && (seen[i * nz + j] === 1 || floor(...at(i, j))); if (!open && s < 0 && i < nx) s = i; if ((open || i === nx) && s >= 0) { walls.push([b.x0 + s * c - c / 2, b.z0 + j * c - c / 2, b.x0 + (i - 1) * c + c / 2, b.z0 + j * c + c / 2]); s = -1; } } }
  return { free, walls, cells: seen.reduce((a, v) => a + v, 0) };
}

/* the still scenery of the current place, for the audit: people, carried things, the sky and other places are left out */
function placeSnap(A, P) {
  const off = [], hide = (root) => root && root.traverse((o) => { if (o.isMesh && o.visible) { o.visible = false; off.push(o); } });
  for (const m of peopleHere(A)) { hide(m); hide(m.userData.mug); } for (const m of [A.abba, A.galdy, A.SOLDIER.m, ...Object.values(A.people), ...Object.values(A.survivors)]) hide(m);
  hide(A.SOLDIER.pike); for (const g of A.GULLS || []) hide(g); hide(A.KP.box); hide(A.FBG.box); hide(A.NS.basket); for (const s of A.KP.stack || []) hide(s);
  for (const c of A.scene.children) { if (c.isLight) continue; if (!c.visible || c.userData.far) hide(c); }
  if (A.Q.boat && P.id !== 'sea') hide(A.Q.boat); if (A.Q.boat) hide(A.Q.boat.userData.mark);   /* the gold marker over the boat is a sign for the player, not a thing */ for (const d of A.Q.debris) if (P.id !== 'sea') hide(d);
  try { const home = A.state.place === 'in' ? A.indoor : A.state.place === 'ware' ? A.wareG : A.scene, b = P.bounds, m = 25, out = snapMeshes(home);   /* only what is in and around this place (the places share one scene) */
    const near = (e) => e.b.max.x > b.x0 - m && e.b.min.x < b.x1 + m && e.b.max.z > b.z0 - m && e.b.min.z < b.z1 + m, keep = out.filter(near); keep.inst = (out.inst || []).filter(near); return keep; }
  finally { for (const o of off) o.visible = true; }
}
function placeAudit(A, P) {
  const grid = walkGrid(A, P), snap = placeSnap(A, P), paths = P.paths ? P.paths() : {};
  const npcs = peopleHere(A).map((m) => { const p = m.getWorldPosition(new THREE.Vector3()), id = idOf(A, m), base = id.replace(/ \(.*$/, '');
    return { id, x: p.x, z: p.z, anim: m.userData.sits ? 'SitIdle' : clipOf(m), ground: Math.max(p.y, m.userData.ground || 0, A.groundYAt(p.x, p.z)), path: paths[id] || paths[base], h: 1.75 * (m.scale.y || 1), r: 0.22, offWall: [[0, 0], [0.4, 0], [-0.4, 0], [0, 0.4], [0, -0.4]].some(([dx, dz]) => grid.free(p.x + dx, p.z + dz)) }; });   /* offWall: the walking walls here are half-metre grid rows that include the player's own 32 cm margin round every prop, so a seller right behind her stall is "in" one without touching anything. A person counts as inside a walking wall only when there is no walkable ground within 40 cm. */
  const acts = A.ACTIONS.filter((a) => !!A.FB.on === !!a.fb).map((a) => [a, a.where()]).filter(([, w]) => w).map(([a, w]) => ({ label: a.label, x: w[0], z: w[1], r: a.r }));
  const talk = acts.filter((a) => /^Talk|^Reach/.test(a.label)).map((a) => ({ id: a.label, x: a.x, z: a.z, anim: '' }));
  const r = auditPlace({ id: P.id, snap, npcs, walls: grid.walls, bounds: P.bounds, start: { x: P.start[0], z: P.start[1] }, actions: acts, people: talk, groundAt: (x, z) => A.groundYAt(x, z) });
  /* look-alikes (engine/faces.js faceCheck): two people with one body and face within 2.5 m of each other, story people and townsfolk alike */
  const twins = faceCheck(peopleHere(A).map((m) => { const p = m.getWorldPosition(new THREE.Vector3()), id = idOf(A, m); return { id, m, face: m.userData.face, x: p.x, z: p.z, path: paths[id] || paths[id.replace(/ \(.*$/, '')] }; }));
  r.inside.push(...twins);
  if (/[?&]faces/.test(location.search)) r.inside.push('faces: ' + peopleHere(A).map((m) => { const p = m.getWorldPosition(new THREE.Vector3()); return idOf(A, m) + '=' + (m.userData.face || skinShape(m)) + '@' + p.x.toFixed(1) + ',' + p.z.toFixed(1); }).join(' | '));
  return { ...r, grid, npcs: npcs.length, meshes: snap.length };
}

/* ---------- ?test=audit ---------- */
async function runAudit(A, q) {
  const ids = (q.get('p') || 'town,tavern,flashback,warehouse,sea,camp,yard').split(','), out = []; let count = 0;
  for (const id of ids) { const P = await goPlace(A, id); const r = placeAudit(A, P), n = r.floating.length + r.inside.length + r.stuck.length; count += n;
    out.push(`${id}: ${n} issues (${r.npcs} people, ${r.meshes} meshes, ${r.grid.cells} walkable cells)`); for (const l of [...r.floating, ...r.inside, ...r.stuck]) out.push('  ' + l); log(out); }
  out.unshift('audit: ' + count + ' issues'); log(out, 'AUDIT ' + count);
}

/* ---------- ?test=layout ---------- */
async function runLayout(A) {
  const out = [], W = innerWidth, H = innerHeight; const st = document.createElement('style'); st.textContent = '*{transition:none!important;animation:none!important}'; document.head.appendChild(st);
  await goPlace(A, 'town'); A.startGame(); $('hud').hidden = false; $('title').hidden = true;
  const IDS = ['goal', 'topr', 'talk', 'hint', 'toast', 'dialogue', 'cinner', 'nudge'], rect = (id) => { const e = id === 'cinner' ? document.querySelector('#card .cardin') : $(id); if (!e || e.hidden || (id === 'cinner' && $('card').hidden)) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || +cs.opacity < 0.05 || cs.visibility === 'hidden') return null; const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 ? { id, r, e } : null; };
  const check = (name) => { const L = IDS.map(rect).filter(Boolean); for (const a of L) { if (a.r.left < -1 || a.r.top < -1 || a.r.right > W + 1 || a.r.bottom > H + 1) out.push(`${W}x${H} ${name}: ${a.id} is off the screen (${a.r.left | 0},${a.r.top | 0},${a.r.right | 0},${a.r.bottom | 0})`); if (a.e.scrollWidth > a.e.clientWidth + 2 && getComputedStyle(a.e).overflow !== 'visible' && a.id !== 'dialogue') out.push(`${W}x${H} ${name}: ${a.id} text is cut off`); }
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const a = L[i].r, b = L[j].r, ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (ox > 4 && oy > 4) out.push(`${W}x${H} ${name}: ${L[i].id} overlaps ${L[j].id} by ${ox | 0}x${oy | 0}`); } };
  const reset = () => { A.hideCard(); if (!$('dialogue').hidden) A.leaveTalk(); for (const id of ['talk', 'toast', 'nudge']) $(id).hidden = true; $('hint').hidden = true; A.busy = false; };
  const settle = () => sleep(700), talkBtn = (label) => { const a = A.ACTIONS.find((x) => x.label === label) || { label }; A.setActionButton(a); $('talk').hidden = false; };
  const goal = (t) => { A.setGoalText(t); A.showGoal(true); };
  reset(); goal('Find 4 things in the tavern. Found: 2 of 4.'); talkBtn('Look at the little box'); A.showHint(); A.toast('Journal: Onion bottles'); await settle(); check('play: goal, action, hint, toast');
  reset(); goal('Walk to Fort Charles, along the beach past the houses.'); talkBtn('Talk to the dockworker'); await settle(); check('play: talk button');
  reset(); A.startConvo([{ who: 'Symon Benning', text: 'Look under a plate for our mark: a pineapple!' }]); await settle(); check('dialogue');
  reset(); A.startConvo([{ who: 'Grace', text: 'A watermelon costs one real. Carrots cost one real too.', choices: [{ t: 'Two reales', ok: true }, { t: 'One real' }, { t: 'Three reales' }], hint: '' }]); await settle(); check('dialogue with three choices');
  reset(); A.card('7 June 1692', ['Two years later. Lewis is now a merchant.', 'Next comes the great earthquake. It is loud, and it may be scary.'], [{ t: 'Begin', go: () => {} }, { t: 'Read what happened instead', go: () => {} }]); await settle(); check('card with two buttons');
  reset(); A.card('Saved', ['Hands pull you over the side of the boat. You are alive.', 'Behind you, most of Port Royal is under the sea.', 'Four new pages are in your journal.'], [{ t: 'Go on: the days after', go: () => {} }, { t: 'Play the earthquake again', go: () => {} }, { t: 'Go back to 1690', go: () => {} }]); await settle(); check('card with three buttons');
  reset(); goal('Talk to old Ned at the table. He has a story.'); $('nudge').hidden = false; $('nudge').style.left = (W * 0.75 | 0) + 'px'; $('nudge').style.top = (H * 0.45 | 0) + 'px'; talkBtn('Talk to old Ned'); await settle(); check('helper arrow with talk button');
  reset(); A.raw.fbStart(); await sleep(100); A.tick(1 / 30); goal('Watch the sword drill on the beach.'); talkBtn('Watch the sword drill'); A.toast('Port Royal, August 1670'); await settle(); check('Ned’s story: leave button, goal, action, toast'); A.fbReset();
  reset(); goal('Ask Abba for some stew.'); talkBtn('Go back to the street'); A.toast('Abba: \u201cNot in my tavern, boys! Take it outside!\u201d'); await settle(); check('a long toast over a two-line action button'); { const e = $('toast'); if (e.scrollWidth > e.clientWidth + 2) out.push(`${W}x${H} a long toast: its words are cut off`); }
  const covered = (name, panel, ids) => { for (const id of ids) { const e = $(id), r = e.getBoundingClientRect(), t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!t || !$(panel).contains(t)) out.push(`${W}x${H} ${name}: ${id} is covered by ${t ? (t.id || t.className || t.tagName) : 'nothing'}`); else if (r.right > W + 1 || r.top < -1 || r.bottom > H + 1 || r.left < -1) out.push(`${W}x${H} ${name}: ${id} is off the screen`); } };
  reset(); goal('Find the woman in the white head wrap.'); talkBtn('Talk to Abba'); await settle();
  A.openChapters(); await settle(); covered('chapters panel in play', 'chapters', ['chtitle', 'chclose']); A.closeChapters();
  A.openJournal(); await settle(); covered('journal panel in play', 'journal', ['jtitle', 'jclose', 'jhome']); A.closeJournal();
  $('credits').hidden = false; await settle(); covered('credits panel in play', 'credits', ['crtitle', 'crclose']); $('credits').hidden = true;
  reset(); A.playChapter(A.CHAPTERS[0]);
  log(out.length ? out : [W + 'x' + H + ': no layout problems'], 'LAYOUT ' + out.length);
}

/* ---------- ?test=walkers ---------- */
async function runWalkers(A) {
  const out = []; let bad = 0; window.requestAnimationFrame = () => 0;
  const LIST = [['kofi', 'Carry', 1.25, 'Kofi with a crate'], ['kofi', 'Walk', 1.25, 'Kofi going back for the next crate'], ['soldier', 'Walk', 0.85, 'the soldier'], ['constable', 'Walk', 0.75, 'Constable Hart strolling'], ['mendes', 'Walk', 0.75, 'Daniel Mendes strolling'], ['turtler', 'Walk', 0.75, 'Peter strolling'], ['kofi', 'Carry', 1.0, 'the sailor carrying crates in 1670 (Kofi’s body)'], ['abba', 'Run', 4.6, 'Abba running in the earthquake'], ['galdy', 'Walk', 2.7, 'Lewis Galdy (third person)'], ['galdy', 'Walk', 1.75, 'Lewis Galdy (third person, slow)']];
  for (const [body, clip, v, name] of LIST) {
    let G; try { G = body === 'abba' ? A.skClone(A.abba) : A.prep((await A.model(body)).scene); } catch (e) { out.push(name + ': ' + body + ' did not load'); bad++; continue; }
    if (body === 'galdy') G.scale.multiplyScalar(0.94); A.scene.add(G); G.visible = true; G.position.set(14, 0, 0.4); G.rotation.y = Math.PI / 2; A.animate(G, clip);
    const r = auditWalk(name, G, v, {});
    out.push(`${name} (${body}, ${clip}): stride ${(r.stride * 100).toFixed(0)} cm, ${v.toFixed(2)} m/s, clip speed ${r.pace.toFixed(2)}, slide ${r.slide.toFixed(1)} cm a loop, shoes ${r.sink.toFixed(1)} to ${r.float.toFixed(1)} cm, biggest jump ${r.pop.toFixed(1)}x`);
    for (const l of r.lines) { out.push('  ' + l); bad++; } A.scene.remove(G); await sleep(0); }
  out.unshift('walkers: ' + bad + ' issues'); log(out, 'WALKERS ' + bad);
}

/* ---------- ?test=life ---------- */
/* Run each place for a while from each view (frames stepped by hand, nothing drawn) and watch every person within 18 m of the player. */
const STANDING = /^(Idle|IdleM|IdleSturdy|HappyIdle|OldIdle|CarryIdle|Sad1|Sad2|Pray|Terrified|Cry|SitIdle|SitDisbelief|SitDrink)/;
const BIND = new WeakMap();
function headTurn(m) {   /* how far the head is turned left or right from the chest, measured from the body's rest pose, in radians */
  const hd = m.getObjectByName('mixamorigHead'), ch = m.getObjectByName('mixamorigSpine2') || m.getObjectByName('mixamorigSpine1'); if (!hd || !ch) return 0;
  let rest = BIND.get(m); if (rest === undefined) { rest = null; m.traverse((o) => { if (rest || !o.isSkinnedMesh) return; const sk = o.skeleton, ih = sk.bones.findIndex((b) => b.name === hd.name), ic = sk.bones.findIndex((b) => b.name === ch.name); if (ih < 0 || ic < 0) return;
      const q = (i) => { const p = new THREE.Vector3(), r = new THREE.Quaternion(), s = new THREE.Vector3(); sk.boneInverses[i].clone().invert().decompose(p, r, s); return r; }; rest = q(ic).invert().multiply(q(ih)); }); BIND.set(m, rest); }
  const rel = ch.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(hd.getWorldQuaternion(new THREE.Quaternion())); if (rest) rel.premultiply(rest.clone().invert());
  const a = 2 * Math.atan2(rel.y, rel.w); return Math.atan2(Math.sin(a), Math.cos(a)); }
async function lifeIssues(A, P, { secs = 40, near = 18, quiet = 12 } = {}) {
  const out = [], seen = new Set(), add = (k, l) => { if (!seen.has(k)) { seen.add(k); out.push(l); } }, sync = new Map();
  const w2 = (key, c, ids) => { const k = key + '|' + c, n = (sync.get(k) || 0) + 1; sync.set(k, n); if (n >= 3) add('sync ' + k, `${P.id}: ${ids.join(' and ')} play ${c} in step`); };   /* in step at three checks in a row (3 s) */
  for (const [vx, vz, vyaw] of P.views || [[A.state.x, A.state.z, A.state.yaw]]) {
    A.state.x = vx; A.state.z = vz; A.state.yaw = vyaw; A.busy = false; A.endTalk(); for (let i = 0; i < 3; i++) A.tick(1 / 30);
    const watch = new Map(), dt = 1 / 30, N = Math.round(secs / dt);
    for (let f = 0; f < N; f++) { A.state.x = vx; A.state.z = vz; A.tick(dt); const t = f * dt;
      for (const m of peopleHere(A)) { const p = m.getWorldPosition(new THREE.Vector3()); if (Math.hypot(p.x - vx, p.z - vz) > near) { watch.delete(m); continue; }
        const id = idOf(A, m), clip = clipOf(m), act = actionOf(m), ry = m.getWorldQuaternion(new THREE.Quaternion()), hy = headTurn(m);
        let w = watch.get(m); if (!w) { w = { id, clip, p: p.clone(), ry: ry.clone(), hy, since: t, still: 0, moveT: 0, lastP: p.clone() }; watch.set(m, w); continue; }
        const v = Math.hypot(p.x - w.lastP.x, p.z - w.lastP.z) / dt; w.lastP.copy(p);   /* along the ground: rising and sinking (sitting, kneeling) is not moving */
        const changed = clip !== w.clip || p.distanceTo(w.p) > 0.25 || ry.angleTo(w.ry) > 0.2 || Math.abs(hy - w.hy) > 0.2;
        if (changed) { w.clip = clip; w.p.copy(p); w.ry.copy(ry); w.hy = hy; w.since = t; }
        else if (t - w.since > quiet && STANDING.test(clip) && A.speaker !== m) add('frozen ' + id, `${P.id}: ${id} stands on ${clip} with nothing changing for over ${quiet} s (seen from ${vx.toFixed(0)},${vz.toFixed(0)})`);
        if (Math.abs(hy) > 1.45) add('head ' + id, `${P.id}: ${id} turns the head ${(Math.abs(hy) * 57.3).toFixed(0)} degrees from the chest on ${clip}`);
        const walking = WALKS.test(clip), fast = /^Run/.test(clip);
        w.moveT = v < 0.08 && (walking || fast) && !/^Carry$/.test(clip) ? w.moveT + dt : (v < 0.08 && walking ? w.moveT + dt : 0);
        if (w.moveT > 1.2) add('inplace ' + id, `${P.id}: ${id} plays ${clip} while standing still (walking on the spot)`);
        w.glide = !walking && !fast && v > 0.3 && !/^(Tread)/.test(clip) && !m.userData.seatAnchor ? (w.glide || 0) + dt : 0;   /* someone sitting in a moving boat is carried, not gliding */
        if (w.glide > 0.5) add('glide ' + id, `${P.id}: ${id} moves ${v.toFixed(2)} m/s on a standing clip (${clip})`);
        if ((walking || fast) && v > 0.2 && act) { const s = strideOf(m, act.getClip()); if (s > 0.05) { const ground = s * Math.abs(act.timeScale) / act.getClip().duration, k = v / ground; if (k < 0.7 || k > 1.4) { w.slide = (w.slide || 0) + dt; if (w.slide > 1.5) add('slide ' + id, `${P.id}: ${id}'s feet slide: moving ${v.toFixed(2)} m/s but ${clip} steps ${ground.toFixed(2)} m/s`); } else w.slide = 0; } }
      }
      /* three or more people on the same looping clip, in step */
      /* in step: two people side by side (within 3 m), or three within 8 m of each other, on the same clip at the same moment and speed */
      if (f % 30 === 15) { const L = []; for (const [m, w] of watch) { const a = actionOf(m); if (!a || !a.isRunning()) continue; L.push({ id: w.id, c: a.getClip().name, ph: (a.time % a.getClip().duration) / a.getClip().duration, ts: a.timeScale, p: m.getWorldPosition(new THREE.Vector3()) }); }
        for (const a of L) { const mates = L.filter((b) => b !== a && b.c === a.c && Math.abs(b.ts - a.ts) < 0.02 && Math.min(Math.abs(b.ph - a.ph), 1 - Math.abs(b.ph - a.ph)) < 0.03); const close = mates.filter((b) => b.p.distanceTo(a.p) < 3), group = mates.filter((b) => b.p.distanceTo(a.p) < 8);
          const run = close.length ? [a, ...close] : group.length >= 2 ? [a, ...group] : null; if (run) { const ids = run.map((x) => x.id).sort(); w2(ids.join(), a.c, ids); } } }
    }
  }
  return out;
}
async function runLife(A, q) {
  const ids = (q.get('p') || 'town,tavern,flashback,warehouse,quake,sea,camp,yard').split(','), out = []; let n = 0; const rr = A.renderer.render; A.renderer.render = () => {}; window.requestAnimationFrame = () => 0;
  try { for (const id of ids) { const P = await goPlace(A, id); const l = await lifeIssues(A, P, { secs: +(q.get('secs') || 40) }); n += l.length; out.push(id + ': ' + l.length + ' issues'); for (const x of l) out.push('  ' + x); log(out); } }
  finally { A.renderer.render = rr; }
  out.unshift('life: ' + n + ' issues'); log(out, 'LIFE ' + n);
}

/* ---------- ?test=all: the shared runner's hooks ---------- */
export function makeAdapter(A) {
  const move = makeMove(A); let P = null, grid = null;
  const speakers = () => { const s = new Set(), walk = (o, d = 0) => { if (!o || d > 6) return; if (Array.isArray(o)) { for (const x of o) walk(x, d + 1); return; } if (typeof o === 'object') { if (typeof o.who === 'string' && typeof o.text === 'string') s.add(o.who); for (const v of Object.values(o)) if (typeof v === 'object') walk(v, d + 1); } }; walk(A.CONVOS); return [...s]; };
  return {
    ready: async () => { await until(() => A.townReady && A.tavernReady && A.built && A.people.morgan && A.people.ned && A.galdy && A.NS.ready && A.SOLDIER.m); window.__prNoFade = true; if (!A.state.started) A.startGame(); },
    journal: async () => {   /* who speaks and what unlocks which page, read from the source (served next to the dev build), so lines inside closures count too */
      let src = ''; try { src = await (await fetch('../src/main.js')).text(); } catch (e) { /* not served: use what the game holds */ }
      const ids = A.JOURNAL.map((p) => p.id), named = new Set([...src.matchAll(/unlock(?:\(|:\s*)'(\w+)'/g)].map((m) => m[1]));
      const unlocks = [...named, ...ids.filter((id) => { const all = src.split("'" + id + "'").length - 1, own = src.split("id: '" + id + "'").length - 1; return all > own; })];
      const who = new Set([...speakers(), ...[...src.matchAll(/who: '([^']+)'/g)].map((m) => m[1])]);
      return { pages: A.JOURNAL.map((p) => ({ id: p.id, title: p.title, simple: p.simple, deeper: p.deeper })), unlocks: [...new Set(unlocks)], refs: ids, speakers: [...who] }; },
    screens: () => ({
      play: async () => { await goPlace(A, 'town'); A.setGoalText('Walk down the pier and into the town.'); A.showGoal(true); },
      dialogue: async () => { A.startConvo([{ who: 'Abba', text: 'Welcome to Port Royal! Is this your first time here?', choices: [{ t: 'Yes, I just got off the ship', ok: true }, { t: 'No' }], hint: '' }]); },
      journal: async () => { A.leaveTalk(); A.openJournal(); },
      chapters: async () => { A.closeJournal(); A.openChapters(); },
      card: async () => { A.closeChapters(); A.card('7 June 1692', ['Two years later. Lewis is now a merchant.'], [{ t: 'Begin', go: () => A.hideCard() }, { t: 'Read what happened instead', go: () => A.hideCard() }]); },
      done: async () => { A.hideCard(); } }),
    chapters: () => A.CHAPTERS.map((c) => ({ name: c.name, year: c.year })),
    openChapter: async (i) => { A.hideCard(); A.closeChapters(); A.state.ch.all = true; const c = A.CHAPTERS[i]; c.go(); await sleep(100); let n = 0; while (!$('card').hidden && n++ < 6) { const b = $('cbtns').querySelector('button'); if (b) b.click(); await sleep(100); } A.busy = false; },
    step: () => A.chapterNow() + ':' + (A.state.place) + ':' + (A.Q.on ? A.Q.phase : A.FB.on ? 'fb' + A.FB.step : '-'),
    people: () => peopleHere(A).map((m) => ({ id: idOf(A, m), name: idOf(A, m), body: m.userData.body || null })),
    steps: () => placeList(A).map((p) => p.id),
    goStep: async (id) => { P = await goPlace(A, id); grid = walkGrid(A, P); },
    place: () => P && grid ? { id: P.id, start: P.start, bounds: P.bounds, walls: [], blocked: (x, z) => !grid.free(x, z), r: 0.25, groundAt: (x, z) => A.groundYAt(x, z) } : null,
    targets: () => A.ACTIONS.filter((a) => !!A.FB.on === !!a.fb).map((a) => [a, a.where()]).filter(([, w]) => w).map(([a, w]) => ({ id: a.label, x: w[0], z: w[1], r: a.r })),
    snapshot: () => ({ journal: [...A.state.unlocked], pos: A.state.place === 'out' && !A.Q.on && !A.FB.on ? [A.state.x, A.state.z] : undefined }),
    save: () => { A.saveGame(); return A.loadGame(); },
    restore: async (d) => { A.applySave(d); for (let i = 0; i < 3; i++) A.tick(1 / 30); },
    places: () => placeList(A).map((p) => p.id),
    goPlace: async (id) => { P = await goPlace(A, id); grid = walkGrid(A, P); },
    move: (from, to) => move(from, to),
    faces: () => peopleHere(A).filter((m) => { const p = m.getWorldPosition(new THREE.Vector3()); return Math.hypot(p.x - A.state.x, p.z - A.state.z) < 40; }).map((m) => ({ id: idOf(A, m), body: m })),
    renderer: () => A.renderer, scene: () => A.scene,
    frame: async (dt) => { A.tick(dt, true); },
    autoplay: async () => { const r = await A.autoRun(0, false, { quiet: true }); return { ok: r.ok, why: r.why, stalls: r.stalls }; },
    camera: () => ({ x: A.camera.position.x, y: A.camera.position.y, z: A.camera.position.z }),
    clips: () => { const cam = A.camera, fr = new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));
      return peopleHere(A).map((m) => { const a = actionOf(m), p = m.getWorldPosition(new THREE.Vector3()), hips = m.getObjectByName('mixamorigHips'); let h;
        if (hips) { const hy = hips.getWorldPosition(new THREE.Vector3()).y - (m.userData.ground || 0); if (!m.userData.hip0) m.userData.hip0 = 0.95 * (m.scale.y || 1); h = hy / m.userData.hip0; }
        return { id: idOf(A, m), clip: a ? a.getClip().name : '', t: a ? (a.time % a.getClip().duration) / a.getClip().duration : 0, dist: Math.hypot(p.x - cam.position.x, p.z - cam.position.z), inView: fr.containsPoint(p.clone().setY(p.y + 1)), hips: h }; }); },
    audio: () => AU, setSound: (on) => setSound(on), talking: () => !$('dialogue').hidden,
  };
}
export const CHECK_TABLES = {
  real: ['Henry Morgan', 'Exquemelin', 'Emmanuel Heath', 'Symon Benning', 'Lewis Galdy'],
  /* the sword drill in Ned's story is practice, ends with a laugh, and the partner's Sword2 is cut before its fall (main.js, drillClip); its other half is Sword1 */
  allowClips: { '1:out:fb0': ['Sword1'], '1:out:fb1': ['Sword1'], '1:out:fb2': ['Sword1'], '1:out:fb3': ['Sword1'] },
  lights: {},
  budget: { frameMs: 400, calls: 260, triangles: 600000 },   /* software drawing in headless Chrome is many times slower than a phone; checked on a phone with ?stats */
  settle: 100,
};

/* ---------- ?test=heads : nobody's head spins. In every place you stand in front of and to each side of each person in turn, a second and a half at each, with the game's own loop
   running; every head is watched every frame (engine/audit.js headWatch): turned more than 80 degrees from the chest, gone right round, or turning faster than a person can.
   Written after the owner saw the pewterer's head on backwards (17 November 2026): a look added on top of a pose that was not set again each frame piled up. ---------- */
async function runHeads(A, q) {
  const out = [], ids = (q.get('p') || placeList(A).map((p) => p.id).join(',')).split(','); let count = 0, n = 0;
  for (const id of ids) { await goPlace(A, id); const W = headWatch(), dt = 1 / 30; let tm = 0; const who = peopleHere(A);
    for (const m of who) { const p = m.getWorldPosition(new THREE.Vector3()), ry = m.rotation.y;
      for (const a of [0, 1.4, -1.4]) { A.state.x = p.x + Math.sin(ry + a) * 1.7; A.state.z = p.z + Math.cos(ry + a) * 1.7; A.busy = false;
        for (let f = 0; f < 45; f++) { A.tick(dt); tm += dt; W.sample(tm, who.map((o) => ({ id: idOf(A, o), m: o, clip: clipOf(o) }))); n++; } } }
    const l = W.lines(); count += l.length; out.push(`${id}: ${l.length} issues (${who.length} people)`); for (const x of l) out.push('  ' + x); log(out); }
  out.unshift('heads: ' + count + ' issues (' + n + ' frames)'); log(out, 'HEADS ' + count);
}
/* ---------- wiring ---------- */
export function wireChecks(A) {
  window.__prA = A; window.__prDev = { makeMove, walkGrid, placeList, goPlace, placeAudit, peopleHere, idOf, clipOf, lifeIssues, makeAdapter };   /* for poking at the game from a test script */
  const q = new URLSearchParams(location.search), t = q.get('test'); if (!t) return;
  const start = async () => { await makeAdapter(A).ready(); };
  const run = (fn) => (async () => { try { await start(); await fn(); } catch (e) { log(['ERROR ' + (e && e.stack || e)], 'ERROR ' + (e && e.message)); console.error(e); } })();
  if (t === 'audit') run(() => runAudit(A, q));
  if (t === 'heads') run(() => runHeads(A, q));
  if (t === 'layout') run(() => runLayout(A));
  if (t === 'walkers') run(() => runWalkers(A));
  if (t === 'life') run(() => runLife(A, q));
  if (t === 'all') run(() => checkAll(makeAdapter(A), CHECK_TABLES));
}
export { lifeIssues, placeList, goPlace };
