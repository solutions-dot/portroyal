/* engine/checks.js: one runner for the automatic gameplay, continuity and quality checks of every game (?test=all). Dev builds only.
   A game wires it with one block (docs/TESTING.md, section 7):

     if (__DEV__ && q.get('test') === 'all') checkAll(adapter, TABLES);

   `adapter` is a small object of hooks into the game (where the player is, the walls, how to start a chapter...). Every check says which hooks it
   needs; a check whose hooks are missing is listed as "skip" with the hook it waits for, so a game can wire them one at a time. The runner prints
   ALL <n> and a table into #autolog and sets document.title to "ALL <n>". n counts every issue of every check that ran. Expect ALL 0.

   The pure parts (continuityIssues, gridReach, journalIssues, ...) are exported so tests/checks.mjs and tools/lint_content.mjs use the same rules. */
import { segmentHitsWall, walkRoute } from './placement.js';
import { tapTargetIssues, contrastIssues, focusOrderIssues } from './ui-audit.js';
import { skinProbe } from './skinprobe.js';

/* ---------- shared tables ---------- */

/* rule 4 (CLAUDE.md): clips never seen in view. `fight` clips may play in the background (further than `near` metres); the rest never in view.
   Sword2 ends with a fall: past SWORD2_FALL of its length it counts as a fall. Tivoli's May 2010 scenes may allow fight clips behind an opt-in card (tables.intense). */
export const BANNED = {
  fall: ['Defeated', 'StumbleBack', 'JogStumble', 'Stagger', 'InjuredStumble1', 'InjuredStumble2'],
  doubled: ['HurtHoldIdle'],
  fight: ['Punch', 'Block', 'Sword1', 'Sword2', 'SlashIn', 'SlashOut'],
  always: [/^Box/],   /* boxing: BoxIdle, BoxIdle2, BoxTurn */
};
export const SWORD2_FALL = 0.62;   /* the part of Sword2 after which the swordsman goes down (measure with ?shot=sheet&clip=Sword2 before changing) */
/* clips where low hips are expected, so the "looks fallen" test leaves them alone */
export const LOW_OK = /^(Sit|Kneel|Crawl|Pray|Duck|Scared|SitScared|Tread|PlayPiano|AskQuestion|Crouch|RifleCrouch|Pray[234])|Sit/;

/* default phone budgets; a game's TABLES.budget overrides each */
export const BUDGET = { frameMs: 50, calls: 220, triangles: 450000, bytes: 30e6 };

/* the engine's sound names (engine/audio.js); a game adds its own in TABLES.sounds */
export const SOUNDS = { stepSound: ['sand', 'grass', 'wood', 'stone', 'water'], uiSound: ['page', 'goal', 'tap'], cue: ['begin', 'sad', 'end'] };

/* titles that are not a name on their own, for the fictional-note check */
const TITLES = new Set(['mr', 'mrs', 'miss', 'ms', 'mass', 'missis', 'auntie', 'aunty', 'aunt', 'uncle', 'gran', 'granny', 'grandma', 'grandpa', 'dr', 'doctor', 'pastor', 'reverend', 'rev', 'sister', 'brother', 'nurse', 'mother', 'father', 'captain', 'capt', 'sergeant', 'sgt', 'old', 'young', 'little', 'big', 'the', 'a', 'mister', 'sir', 'lady', 'cousin', 'teacher', 'officer', 'constable', 'master', 'mistress', 'baba', 'nana', 'papa', 'mama', 'ma', 'pa', 'dad', 'mum']);
/* speakers that are a role, not a character: no journal note needed */
export const ROLES = /^((the|a|an|one|another|old|young) .+|you|lewis|narrator|voice|voices|everyone|all|crowd|people|someone|a voice|radio|announcer|the radio|man|woman|boy|girl|child|children|soldier|soldiers|police|policeman|guard|sailor|clerk|driver|conductor|porter|guard|vendor|seller|worker|workers|man \d|woman \d|quartermaster|pressman|printer|customer|engineer|friend|steward|traveller|messenger|guide|student|sailor|nurse|older man|share clerk|firefighter|gunner|reporter|teacher|pastor|preacher|youth|police officer)$/i;

/* ---------- small helpers ---------- */
const fix = (v, d = 1) => (typeof v === 'number' ? v.toFixed(d) : String(v));
const inRect = (x, z, w, r = 0) => x > w[0] - r && x < w[2] + r && z > w[1] - r && z < w[3] + r;
const normBounds = (b) => (!b ? null : Array.isArray(b) ? { x0: b[0], z0: b[1], x1: b[2], z1: b[3] } : b);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- continuity ---------- */

/* samples: [{ chapter, step, id, name, body, hat, colours }] in play order. tables.cast maps a character to the ids it uses ({ mama: ['mama', 'mama3'] }).
   changes: [{ id, chapter | step, field }] a declared change (a new hat in chapter 4). A field that differs from the last sample of the same character,
   with no change declared there, is an issue. Names must be spelled one way. */
export function continuityIssues(samples, { cast = {}, changes = [], fields = ['body', 'hat', 'colours', 'name'] } = {}) {
  const who = {}; for (const [c, ids] of Object.entries(cast)) for (const id of ids) who[id] = c;
  const last = {}, out = [];
  for (const s of samples) {
    const c = who[s.id] || s.id, prev = last[c];
    if (prev) for (const f of fields) {
      if (s[f] === undefined || prev[f] === undefined || same(s[f], prev[f])) continue;
      const ok = changes.some((ch) => (ch.id === c || ch.id === s.id) && (!ch.field || ch.field === f) && ((ch.chapter !== undefined && ch.chapter === s.chapter) || (ch.step !== undefined && ch.step === s.step)));
      if (!ok) out.push(`${c}: ${f} changes from ${JSON.stringify(prev[f])} (${prev.where}) to ${JSON.stringify(s[f])} (${where(s)}) with no change declared`);
    }
    last[c] = { ...(prev || {}), ...Object.fromEntries(fields.filter((f) => s[f] !== undefined).map((f) => [f, s[f]])), where: where(s) };
  }
  return out;
}
const where = (s) => (s.step !== undefined ? 'step ' + s.step : 'chapter ' + s.chapter);

/* timeline: [{ step, held: [...] , given: [...] }] in play order. Something given stays held until a step in `drops` ({ item, step }) lets it go. */
export function itemIssues(timeline, { drops = [] } = {}) {
  const have = new Map(), out = [];
  for (const t of timeline) {
    for (const d of drops) if (d.step === t.step) have.delete(d.item);
    for (const [item, from] of have) if (!(t.held || []).includes(item)) { out.push(`${item} (given at step ${from}) is gone at step ${t.step}`); have.delete(item); }
    for (const g of t.given || []) have.set(g, t.step);
  }
  return out;
}

/* what the light is: a game's own word (tod) or the sun's height in degrees */
export function lightKind(light) {
  if (!light) return null; if (light.tod) return String(light.tod).toLowerCase();
  const s = light.sun; if (typeof s !== 'number') return null;
  return s < -6 ? 'night' : s < 8 ? (light.rising === false ? 'dusk' : 'dawn') : 'day';
}
const LIGHT_OK = { night: ['night', 'midnight'], day: ['day', 'morning', 'noon', 'afternoon'], dawn: ['dawn', 'sunrise', 'morning'], dusk: ['dusk', 'evening', 'sunset'] };
/* shown: [{ text, tag, light }]: each line tagged night, day, dawn or dusk was shown in that light */
export function lightIssues(shown) {
  const out = [];
  for (const s of shown) { const k = lightKind(s.light); if (!k || !s.tag) continue; if (!(LIGHT_OK[s.tag] || [s.tag]).includes(k)) out.push(`"${s.text}" is tagged ${s.tag} but plays at ${k}`); }
  return out;
}

/* ages: { id: { born, seen: [[year, age], ...] } } or { id: [[year, age], ...] }: a character seen in two eras ages by the years between */
export function ageIssues(ages, { slack = 1 } = {}) {
  const out = [];
  for (const [id, v] of Object.entries(ages || {})) {
    const seen = Array.isArray(v) ? v : v.seen || [], born = Array.isArray(v) ? null : v.born;
    for (const [y, a] of seen) if (born != null && Math.abs(y - born - a) > slack) out.push(`${id} is ${a} in ${y}, but born ${born} makes ${y - born}`);
    for (let i = 1; i < seen.length; i++) { const [y0, a0] = seen[i - 1], [y1, a1] = seen[i]; if (Math.abs(a1 - a0 - (y1 - y0)) > slack) out.push(`${id} is ${a0} in ${y0} and ${a1} in ${y1}: ${y1 - y0} years but ${a1 - a0} years older`); }
  }
  return out;
}

/* ---------- softlocks: reachable, completable, cannot leave, cannot get stuck ---------- */

/* walk the grid from `start`: a cell is free when it is in the bounds, out of every wall rectangle (with radius r) and not blocked(x, z, r);
   moves go to the 8 neighbours along segments that touch no wall. Returns { reach(x, z, within), cells, free(x, z) } */
export function gridReach({ start, walls = [], bounds, blocked = null, r = 0.25, cell = 0.25, max = 400000 }) {
  const b = normBounds(bounds); if (!b) throw new Error('gridReach needs bounds');
  const nx = Math.ceil((b.x1 - b.x0) / cell) + 1, nz = Math.ceil((b.z1 - b.z0) / cell) + 1;
  const free = (x, z) => x >= b.x0 && x <= b.x1 && z >= b.z0 && z <= b.z1 && !walls.some((w) => inRect(x, z, w, r)) && !(blocked && blocked(x, z, r));
  const at = (i, j) => [b.x0 + i * cell, b.z0 + j * cell], key = (i, j) => i * nz + j, seen = new Uint8Array(nx * nz);
  const si = Math.round((start[0] - b.x0) / cell), sj = Math.round((start[1] - b.z0) / cell);
  let q = [], n = 0;
  /* start from the nearest free cell (the start itself may sit on a cell edge) */
  for (let d = 0; d <= 3 && !q.length; d++) for (let i = si - d; i <= si + d; i++) for (let j = sj - d; j <= sj + d; j++) if (i >= 0 && j >= 0 && i < nx && j < nz && !q.length && free(...at(i, j))) { q.push([i, j]); seen[key(i, j)] = 1; }
  while (q.length && n < max) {
    const next = [];
    for (const [i, j] of q) { n++; const p = at(i, j);
      for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) { if (!di && !dj) continue; const a = i + di, c = j + dj; if (a < 0 || c < 0 || a >= nx || c >= nz || seen[key(a, c)]) continue;
        const qq = at(a, c); if (!free(...qq) || walls.some((w) => segmentHitsWall(p, qq, w, r))) continue; seen[key(a, c)] = 1; next.push([a, c]); } }
    q = next;
  }
  const reached = (x, z) => { const i = Math.round((x - b.x0) / cell), j = Math.round((z - b.z0) / cell); return i >= 0 && j >= 0 && i < nx && j < nz && seen[key(i, j)] === 1; };
  return {
    cells: n, free,
    reach(x, z, within = 1.2) {   /* some reached cell is within `within` metres of (x, z) */
      const k = Math.ceil(within / cell), ci = Math.round((x - b.x0) / cell), cj = Math.round((z - b.z0) / cell);
      for (let i = ci - k; i <= ci + k; i++) for (let j = cj - k; j <= cj + k; j++) { if (i < 0 || j < 0 || i >= nx || j >= nz || !seen[key(i, j)]) continue; const p = at(i, j); if (Math.hypot(p[0] - x, p[1] - z) <= within) return true; }
      return false;
    },
    reached, each(fn) { for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) if (seen[key(i, j)]) fn(...at(i, j)); },
  };
}

/* targets: [{ id, x, z, r }]: each can be reached on foot from start. walkRoute (engine/placement.js) is tried first; the grid walk decides when it finds nothing. */
export function reachIssues({ start, targets, walls = [], bounds, blocked, r = 0.25, cell = 0.25, label = '' }) {
  const out = []; let grid = null;
  for (const t of targets) {
    const near = t.r || 1.2, route = walkRoute(start, [t.x, t.z], walls, r, normBounds(bounds));
    if (route.length && (!blocked || route.every((p, i) => { const a = i ? route[i - 1] : start; for (let s = 0; s <= 1.0001; s += 0.1) { const x = a[0] + (p[0] - a[0]) * s, z = a[1] + (p[1] - a[1]) * s; if (Math.hypot(x - t.x, z - t.z) < near) return true; if (blocked(x, z, r)) return false; } return true; }))) continue;
    grid = grid || gridReach({ start, walls, bounds, blocked, r, cell });
    if (!grid.reach(t.x, t.z, near)) out.push(`${label}${t.id} at (${fix(t.x)},${fix(t.z)}) cannot be reached on foot from (${fix(start[0])},${fix(start[1])})`);
  }
  return out;
}

/* push the player out of the map from every edge and in every direction: move(from, to) is the game's own clamp and must keep them inside */
export function boundsIssues({ move, bounds, start, step = 1, push = 4, tol = 0.05, label = '', blocked = null, r = 0.25 }) {
  const b = normBounds(bounds), out = [], seen = new Set();
  const test = (from, to) => { if (blocked && blocked(from[0], from[1], r)) return; const p = move(from, to); if (!p) return; const [x, z] = p; if (x < b.x0 - tol || x > b.x1 + tol || z < b.z0 - tol || z > b.z1 + tol) { const k = Math.round(x) + ',' + Math.round(z); if (!seen.has(k)) { seen.add(k); out.push(`${label}the player leaves the map at (${fix(x)},${fix(z)}) walking from (${fix(from[0])},${fix(from[1])})`); } } };
  for (let x = b.x0 + 0.3; x <= b.x1 - 0.3; x += step) { test([x, b.z0 + 0.3], [x, b.z0 - push]); test([x, b.z1 - 0.3], [x, b.z1 + push]); }
  for (let z = b.z0 + 0.3; z <= b.z1 - 0.3; z += step) { test([b.x0 + 0.3, z], [b.x0 - push, z]); test([b.x1 - 0.3, z], [b.x1 + push, z]); }
  if (start) for (let a = 0; a < 16; a++) test(start, [start[0] + Math.sin(a * Math.PI / 8) * 500, start[1] + Math.cos(a * Math.PI / 8) * 500]);
  return out;
}

/* a grid of probe points the player can reach: from each, the game's clamp must let them walk at least `min` metres in two or more directions */
export function stuckIssues({ move, start, walls = [], bounds, blocked, r = 0.25, every = 1, dist = 0.6, min = 0.15, label = '' }) {
  const grid = gridReach({ start, walls, bounds, blocked, r, cell: 0.25 }), out = [], b = normBounds(bounds); let probes = 0;
  for (let x = b.x0 + every / 2; x < b.x1; x += every) for (let z = b.z0 + every / 2; z < b.z1; z += every) {
    if (!grid.reached(x, z)) continue; probes++; let ways = 0;
    for (let a = 0; a < 8; a++) { const to = [x + Math.sin(a * Math.PI / 4) * dist, z + Math.cos(a * Math.PI / 4) * dist], p = move([x, z], to); if (p && Math.hypot(p[0] - x, p[1] - z) >= min) ways++; }
    if (ways < 2) out.push(`${label}stuck at (${fix(x)},${fix(z)}): only ${ways} way${ways === 1 ? '' : 's'} out`);
  }
  return { lines: out, probes };
}

/* ---------- camera ---------- */
/* samples: [{ x, y, z, what }]; walls: rectangles [x0, z0, x1, z1, top?] (top defaults to wallTop); solid(x, y, z) for real shapes */
export function cameraIssues(samples, { walls = [], groundAt = () => 0, solid = null, wallTop = 3, margin = 0.08 } = {}) {
  const out = [], seen = new Set();
  const add = (k, line) => { if (!seen.has(k)) { seen.add(k); out.push(line); } };
  for (const s of samples) {
    const g = groundAt(s.x, s.z), k = `${Math.round(s.x * 2)},${Math.round(s.z * 2)}`;
    if (s.y < g + margin) add('g' + k, `camera below the ground at (${fix(s.x)},${fix(s.y, 2)},${fix(s.z)})${s.what ? ' during ' + s.what : ''}`);
    const w = walls.find((w) => inRect(s.x, s.z, w) && s.y < (w[4] ?? wallTop)); if (w) add('w' + k, `camera inside a wall [${w.slice(0, 4).map((v) => fix(v)).join(',')}] at (${fix(s.x)},${fix(s.y, 2)},${fix(s.z)})${s.what ? ' during ' + s.what : ''}`);
    else if (solid && solid(s.x, s.y, s.z)) add('s' + k, `camera inside a solid at (${fix(s.x)},${fix(s.y, 2)},${fix(s.z)})${s.what ? ' during ' + s.what : ''}`);
  }
  return out;
}

/* ---------- save and resume ---------- */
/* before and after: { stage, goal, place, people: [ids], held: [ids], pos: [x, z] }; people and held compared as sets */
export function resumeDiff(before, after, { far = 3 } = {}) {
  const out = [], set = (a) => [...new Set(a || [])].sort();
  for (const k of ['stage', 'goal', 'place']) if (before[k] !== undefined && !same(before[k], after[k])) out.push(`${k}: ${JSON.stringify(before[k])} became ${JSON.stringify(after[k])}`);
  for (const k of ['people', 'held', 'journal']) {
    if (before[k] === undefined) continue; const a = set(before[k]), b = set(after[k]);
    const lost = a.filter((x) => !b.includes(x)), extra = b.filter((x) => !a.includes(x));
    if (lost.length) out.push(`${k} lost: ${lost.join(', ')}`); if (extra.length) out.push(`${k} added: ${extra.join(', ')}`);
  }
  if (before.pos && after.pos && Math.hypot(before.pos[0] - after.pos[0], before.pos[1] - after.pos[1]) > far) out.push(`player put back ${Math.hypot(before.pos[0] - after.pos[0], before.pos[1] - after.pos[1]).toFixed(1)} m away`);
  return out;
}

/* ---------- journal ---------- */
const sentences = (t) => String(t).split(/(?<=[.!?])\s+/).reduce((a, p) => { if (a.length && /\b(Mr|Mrs|Ms|Dr|St|Mt|Rev|Sgt|Capt|Lt)\.$/.test(a[a.length - 1])) a[a.length - 1] += ' ' + p; else a.push(p); return a; }, []);   /* "Mr. Raymond" stays in one sentence */
export const pageText = (p) => [p.title, ...(p.simple || []), ...(p.deeper || []), ...(p.lines || []), ...(typeof p.text === 'string' ? [p.text] : p.text || [])].filter((x) => typeof x === 'string').join(' ');
/* the word a fictional note must name: "Mass Dudley" -> "Dudley", "Auntie Mimba" -> "Mimba", "Gran" -> "Gran" */
export function nameKey(name) { const t = String(name).replace(/[’'`]s\b/g, '').split(/[\s.]+/).filter(Boolean); const k = t.filter((w) => !TITLES.has(w.toLowerCase())); return (k.length ? k[k.length - 1] : t[t.length - 1] || '').replace(/[^\p{L}\p{N}-]/gu, ''); }
/* pages: [{ id, title, simple, deeper, from }]; unlocks: ids the game unlocks; refs: other ids the code names (a journey page, a chapter's pages);
   speakers: names that speak; real: names that are real people or need no note. Rules: every unlock has a page, no page is never unlocked, no
   duplicate ids, and every fictional speaker is named in a sentence that says "fictional" (or a page says everyone you meet is fictional). */
export function journalIssues({ pages = [], unlocks = [], refs = [], speakers = [], real = [], roles = ROLES }) {
  const out = [], ids = new Map(); for (const p of pages) { if (ids.has(p.id)) out.push(`two journal pages have the id '${p.id}'`); ids.set(p.id, p); }
  const un = new Set(unlocks), rf = new Set(refs);
  for (const id of un) if (!ids.has(id)) out.push(`unlock '${id}' has no journal page`);
  for (const p of pages) if (!un.has(p.id) && !rf.has(p.id) && p.from === undefined && !p.always) out.push(`journal page '${p.id}' (${p.title}) is never unlocked`);
  const fict = pages.flatMap((p) => sentences(pageText(p))).filter((s) => /fictional|made[ -]up|not real\b/i.test(s));
  const blanket = fict.some((s) => /(everyone|everybody|all the people|the people you (meet|talk to)|people you talk to|other people|all the characters)\b.*fictional/i.test(s));
  const realK = new Set(real.map((r) => nameKey(r).toLowerCase()));
  const done = new Set();
  for (const sp of speakers) {
    const name = String(sp || '').trim(); if (!name || roles.test(name) || done.has(name)) continue; done.add(name);
    const k = nameKey(name); if (!k || realK.has(k.toLowerCase()) || real.includes(name)) continue;
    const re = new RegExp('\\b' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    if (!fict.some((s) => re.test(s)) && !blanket) out.push(`${name} speaks, but no journal page says "${k} in this game is fictional" (or list ${name} as real)`);
  }
  return out;
}

/* ---------- errors ---------- */
/* watch for script errors, rejected promises, console.error and files that fail to load (a 404 for a model or a sound). Install it first. */
export function watchErrors(win = globalThis) {
  const lines = [], add = (l) => { if (lines.length < 200) lines.push(String(l).slice(0, 300)); };
  if (!win.addEventListener) return { lines, stop() {} };
  const onErr = (e) => { const t = e.target; if (t && t !== win && (t.src || t.href)) add(`failed to load ${t.src || t.href}`); else add(`error: ${e.message || e.error}${e.lineno ? ' @' + e.lineno : ''}`); };
  const onRej = (e) => add(`unhandled rejection: ${(e.reason && (e.reason.stack || e.reason.message)) || e.reason}`);
  win.addEventListener('error', onErr, true); win.addEventListener('unhandledrejection', onRej);
  const ce = win.console && win.console.error; if (ce) win.console.error = function (...a) { add('console.error: ' + a.map((x) => (x && x.message) || String(x)).join(' ')); return ce.apply(this, a); };
  let po = null; try { po = new win.PerformanceObserver((list) => { for (const e of list.getEntries()) if (e.responseStatus >= 400) add(`HTTP ${e.responseStatus} for ${e.name}`); }); po.observe({ type: 'resource', buffered: true }); } catch (e) { /* older browsers */ }
  const f = win.fetch; if (f) win.fetch = async function (...a) { const r = await f.apply(this, a); if (!r.ok && r.status !== 0) add(`HTTP ${r.status} for ${String(a[0] && a[0].url || a[0])}`); return r; };
  return { lines, stop() { win.removeEventListener('error', onErr, true); win.removeEventListener('unhandledrejection', onRej); if (ce) win.console.error = ce; if (po) po.disconnect(); if (f) win.fetch = f; } };
}

/* ---------- sound ---------- */
/* record every node connected straight to the speakers, so a sound that skips the master volume (and so the sound toggle) is found */
export function watchAudio(win = globalThis) {
  const direct = new Set(), N = win.AudioNode; if (!N || N.prototype.__watched) return { direct };
  const c = N.prototype.connect; N.prototype.__watched = true;
  N.prototype.connect = function (dest, ...rest) { if (dest && dest === this.context.destination) direct.add(this); return c.call(this, dest, ...rest); };
  return { direct };
}
/* levels: { bedName: gain }; during dialogue no bed or loop may be louder than `talk` (the level the talk sits over) */
export function levelIssues(levels, { talking = false, talk = 0.3 } = {}) {
  if (!talking) return []; return Object.entries(levels).filter(([, v]) => v > talk + 1e-3).map(([k, v]) => `${k} is at ${v.toFixed(2)} during dialogue (keep it under ${talk})`);
}
/* refs: { stepSound: ['sand', ...] } kinds the game uses; have: the names that exist (SOUNDS plus the game's own) */
export function soundRefIssues(refs, have = SOUNDS) {
  const out = []; for (const [fn, kinds] of Object.entries(refs)) for (const k of kinds) if (have[fn] && !have[fn].includes(k)) out.push(`${fn}('${k}') makes no sound: engine/audio.js knows ${have[fn].join(', ')}`); return out;
}

/* ---------- phone budget ---------- */
export function budgetIssues(stats, budget = {}, label = '') {
  const B = { ...BUDGET, ...budget }, out = [];
  for (const [k, unit] of [['frameMs', ' ms a frame'], ['calls', ' draw calls'], ['triangles', ' triangles in view'], ['bytes', ' bytes to download']]) if (stats[k] !== undefined && stats[k] > B[k]) out.push(`${label}${Math.round(stats[k]).toLocaleString('en')}${unit} (budget ${B[k].toLocaleString('en')})`);
  return out;
}

/* ---------- rule 4 ---------- */
export function bannedKind(clip, t = 0) {
  if (!clip) return null; if (BANNED.always.some((re) => re.test(clip))) return 'boxing';
  if (BANNED.fall.includes(clip)) return 'a fall'; if (BANNED.doubled.includes(clip)) return 'doubled over';
  if (clip === 'Sword2' && t >= SWORD2_FALL) return 'a fall (Sword2 past its fall)';
  if (BANNED.fight.includes(clip)) return 'fight'; return null;
}
/* samples: [{ id, clip, t (0 to 1 through the clip), dist, inView, stage, hips (hip height / standing hip height) }]
   allow: { stage: ['Block', ...] } clips a game's intense scene may show (Tivoli only, behind its card) */
export function clipIssues(samples, { near = 12, allow = {} } = {}) {
  const out = [], seen = new Set();
  for (const s of samples) {
    if (s.inView === false) continue; const k = bannedKind(s.clip, s.t || 0), ok = (allow[s.stage] || []).includes(s.clip);
    let why = null;
    if (k && !ok && (k !== 'fight' || (s.dist ?? 0) < near)) why = k === 'fight' ? `a fight clip (${s.clip}) ${fix(s.dist ?? 0)} m away, in the foreground` : `${k} (${s.clip})`;
    else if (!k && s.hips !== undefined && s.hips < 0.55 && !LOW_OK.test(s.clip || '')) why = `looks fallen (hips at ${Math.round(s.hips * 100)} % of standing, clip ${s.clip || 'none'})`;
    if (why && !seen.has(s.id + why.slice(0, 12))) { seen.add(s.id + why.slice(0, 12)); out.push(`${s.id}${s.stage !== undefined ? ' at step ' + s.stage : ''}: ${why}`); }
  }
  return out;
}
/* entered: [{ stage, card }] every stage the run entered and whether its card was answered; intense: { stage: cardId } */
export function intenseIssues(entered, intense = {}) {
  const out = []; for (const e of entered) if (intense[e.stage] && !e.card) out.push(`step ${e.stage} is tagged intense but started with no opt-in card (${intense[e.stage]})`); return out;
}

/* ---------- faces ---------- */
const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
/* results: [{ id, where, rgb, lo, hi }] from skinProbe: the darkest heading must not read near-black, the mean not too dark, the lightest not pale */
export function faceIssues(results, { minLo = 55, minMean = 75, maxHi = 225 } = {}) {
  const out = [];
  for (const r of results) {
    if (!r.rgb || (!r.rgb[0] && !r.rgb[1] && !r.rgb[2])) { out.push(`${r.id} in ${r.where}: no face found to measure`); continue; }
    if (lum(r.lo) < minLo) out.push(`${r.id} in ${r.where}: face too dark from one side (${r.lo.join(',')}, brightness ${lum(r.lo).toFixed(0)}, needs ${minLo})`);
    else if (lum(r.rgb) < minMean) out.push(`${r.id} in ${r.where}: face too dark (${r.rgb.join(',')}, brightness ${lum(r.rgb).toFixed(0)}, needs ${minMean})`);
    if (lum(r.hi) > maxHi) out.push(`${r.id} in ${r.where}: face too pale (${r.hi.join(',')})`);
  }
  return out;
}

/* ---------- the checks ---------- */
/* Each check: { id, needs: [hook names on the adapter], run(game, tables, ctx) -> lines | { lines, note } }. ctx.run holds what the autoplayer run
   collected (camera spots, clips in view, lines shown, audio levels) so the run happens once. The adapter's hooks are listed in docs/TESTING.md. */
export const CHECKS = [
  { id: 'journal', needs: ['journal'], async run(g, T) { const j = await g.journal(); return journalIssues({ real: T.real || [], ...j }); } },
  { id: 'links', needs: [], async run() {
    const out = [], els = [...document.querySelectorAll('a#allgames, a#jhome')]; if (!els.length) return ['no "All games" or "Main Menu" link (#allgames or #jhome)'];
    for (const a of els) { const u = new URL(a.getAttribute('href'), location.href); if (!/\/menu\/?$/.test(u.pathname) && u.pathname !== '/') out.push(`${a.id} goes to ${u.pathname}, not the menu`); try { const r = await fetch(u.href, { method: 'GET' }); if (!r.ok) out.push(`${a.id}: ${u.href} gives HTTP ${r.status}`); } catch (e) { out.push(`${a.id}: ${u.href} does not load`); } }
    return out; } },
  { id: 'a11y', needs: [], async run(g, T) {
    /* the screen as it is (the title), then each state the adapter can open (play, dialogue, journal, chapters, a card) */
    const unknown = [], out = [], look = (where) => { for (const l of [...tapTargetIssues(document, T.tap || 44), ...contrastIssues(document, { unknown })]) out.push(where + ': ' + l); };
    look('title'); if (g.screens) for (const [name, open] of Object.entries(await g.screens())) { try { await open(); await sleep(250); look(name); } catch (e) { out.push(`${name}: could not open (${e.message})`); } }
    return { lines: [...new Set(out)], note: unknown.length ? new Set(unknown).size + ' texts over the 3D view not judged' : '' }; } },
  { id: 'keys', needs: [], async run(g) {
    const out = focusOrderIssues(document);
    if (g.keyMove) { const r = await g.keyMove(); if (r && !r.moved) out.push('the arrow keys and WASD do not move the player'); if (r && r.talk === false) out.push('Enter or Space does not start a talk next to a person'); }
    return out; } },
  { id: 'chapters', needs: ['chapters', 'openChapter'], async run(g, T, ctx) {
    const out = [], list = await g.chapters();
    for (let i = 0; i < list.length; i++) {
      try { await g.openChapter(i); } catch (e) { out.push(`chapter ${i + 1} (${list[i].name || list[i]}) does not open: ${e.message}`); continue; }
      await sleep(T.settle ?? 300);
      if (g.step) { const s = await g.step(); ctx.chapterSteps.push(s); if (s === undefined || s === null) out.push(`chapter ${i + 1} opened with no step`); }
      if (g.people) for (const p of await g.people()) ctx.cast.push({ samplePass: 'chapters', chapter: i + 1, step: g.step ? await g.step() : undefined, ...p });
      if (g.light) ctx.chapterLight.push({ chapter: i + 1, light: await g.light() });
    }
    return out; } },
  { id: 'continuity', needs: ['people'], after: ['chapters', 'steps'], async run(g, T, ctx) {
    /* Chapter and step probes each restart the story; a probe rewind is not an in-story costume change. */
    const passes = new Map(); for (const s of ctx.cast) { const pass = s.samplePass || 'default'; if (!passes.has(pass)) passes.set(pass, []); passes.get(pass).push(s); }
    const out = [...passes.values()].flatMap(samples => continuityIssues(samples, { cast: T.cast || {}, changes: T.changes || [] }));
    out.push(...ageIssues(T.ages || {}));
    if (ctx.items.length) out.push(...itemIssues(ctx.items, { drops: T.drops || [] }));
    out.push(...lightIssues(ctx.run.lines));
    return out; } },
  { id: 'steps', needs: ['steps', 'goStep'], async run(g, T, ctx) {
    /* every step: its targets reachable on foot, and (when the game saves) save, reload and compare */
    const out = ctx.partial = [], steps = await g.steps(); let done = 0;
    for (const s of steps) { ctx.progress = `${done++} of ${steps.length} steps`;
      try { await g.goStep(s); } catch (e) { out.push(`step ${s} does not start: ${e.message}`); continue; }
      await sleep(T.settle ?? 200);
      if (g.place && g.targets) { const P = await g.place(), t = await g.targets(); if (P && P.bounds && t.length) out.push(...reachIssues({ start: P.start, targets: t, walls: P.walls || [], bounds: P.bounds, blocked: P.blocked, r: P.r || 0.25, label: `step ${s}: ` })); }
      if (g.people) for (const p of await g.people()) ctx.cast.push({ samplePass: 'steps', step: s, ...p });
      if (g.held) ctx.items.push({ step: s, held: await g.held(), given: (T.given || {})[s] || [] });
      if (g.snapshot && g.save && g.restore) {
        const before = await g.snapshot(), data = await g.save(); await g.restore(data); await sleep(T.settle ?? 200);
        out.push(...resumeDiff(before, await g.snapshot()).map((l) => `step ${s} resume: ${l}`));
      }
    }
    return out; } },
  { id: 'map', needs: ['places', 'goPlace', 'place', 'move'], async run(g, T) {
    const out = []; let probes = 0;
    for (const id of await g.places()) {
      await g.goPlace(id); await sleep(T.settle ?? 200); const P = await g.place(); if (!P || !P.bounds) { out.push(`${id}: no bounds`); continue; }
      const move = (a, b) => g.move(a, b, P);
      out.push(...boundsIssues({ move, bounds: P.bounds, start: P.start, blocked: P.blocked, r: P.r || 0.25, label: id + ': ' }));
      const s = stuckIssues({ move, start: P.start, walls: P.walls || [], bounds: P.bounds, blocked: P.blocked, r: P.r || 0.25, every: T.probe || 1, label: id + ': ' }); probes += s.probes; out.push(...s.lines.slice(0, 40));
      if (s.lines.length > 40) out.push(`${id}: ${s.lines.length - 40} more stuck spots`);
    }
    return { lines: out, note: probes + ' probe points' }; } },
  { id: 'faces', needs: ['places', 'goPlace', 'faces', 'renderer', 'scene'], async run(g, T) {
    const res = [];
    for (const id of await g.places()) for (const light of T.lights?.[id] || [null]) {
      await g.goPlace(id, light); await sleep(T.settle ?? 200);
      for (const f of await g.faces()) { const r = skinProbe(g.renderer(), g.scene(), f.body); res.push({ id: f.id, where: id + (light ? ' (' + light + ')' : ''), ...r }); }
    }
    return faceIssues(res, T.faces || {}); } },
  { id: 'budget', needs: ['places', 'goPlace', 'renderer', 'frame'], async run(g, T) {
    const out = [], B = T.budget || {};
    for (const id of await g.places()) {
      await g.goPlace(id); await sleep(T.settle ?? 200); const R = g.renderer(); R.info.autoReset = true;
      const t0 = performance.now(); let calls = 0, tris = 0; const n = 12;
      for (let i = 0; i < n; i++) { await g.frame(1 / 30); calls = Math.max(calls, R.info.render.calls); tris = Math.max(tris, R.info.render.triangles); }
      out.push(...budgetIssues({ frameMs: (performance.now() - t0) / n, calls, triangles: tris }, B, id + ': '));
    }
    try { const bytes = performance.getEntriesByType('resource').reduce((a, e) => a + (e.transferSize || e.encodedBodySize || 0), 0); out.push(...budgetIssues({ bytes }, B, 'download: ')); } catch (e) { /* no timing */ }
    return out; } },
  { id: 'sound', needs: ['audio'], async run(g, T, ctx) {
    const out = [], AU = g.audio(); out.push(...soundRefIssues(T.soundRefs || {}, { ...SOUNDS, ...(T.sounds || {}) }));
    if (!AU || !AU.ctx) return { lines: out, note: 'sound never started' };
    for (const n of ctx.audio.direct) if (n !== AU.master) out.push('a sound is connected to the speakers without the master volume, so the sound toggle cannot silence it');
    if (g.setSound) { g.setSound(false); await sleep(600); if (AU.master.gain.value > 0.01) out.push(`sound off leaves the master volume at ${AU.master.gain.value.toFixed(2)}`); g.setSound(true); }
    for (const l of ctx.run.levels) out.push(...levelIssues(l.levels, { talking: l.talking, talk: T.talkLevel ?? 0.3 }).map((x) => `${l.where}: ${x}`));
    return [...new Set(out)]; } },
  { id: 'autoplay', needs: ['autoplay'], async run(g, T, ctx) {
    /* one scripted playthrough; while it runs, sample the camera, the clips in view, lines shown, the light and the sound levels every 250 ms */
    const sample = async (what) => {
      if (g.camera) { const c = await g.camera(); if (c) ctx.run.camera.push({ ...c, what: what || ('step ' + (g.step ? await g.step() : '?')), at: c.at === undefined ? (g.place ? await g.place() : null) : c.at }); }   /* at: the place the spot was taken in, so it is judged against that place's walls */
      if (g.clips) for (const c of await g.clips()) ctx.run.clips.push({ ...c, stage: g.step ? await g.step() : undefined });
      if (g.line && g.light) { const l = await g.line(); if (l && T.tagged && T.tagged[l]) ctx.run.lines.push({ text: l, tag: T.tagged[l], light: await g.light() }); }
      if (g.audio && g.talking) { const AU = g.audio(); if (AU && AU.ch) ctx.run.levels.push({ where: 'step ' + (g.step ? await g.step() : '?'), talking: !!(await g.talking()), levels: Object.fromEntries(Object.entries(AU.ch).map(([k, n]) => [k, n.gain.value])) }); }
      if (g.step) { const s = await g.step(); if (s !== ctx.run.lastStep) { ctx.run.lastStep = s; ctx.run.entered.push({ stage: s, card: g.cardSeen ? await g.cardSeen((T.intense || {})[s]) : undefined }); } }
    };
    let busy = false; const iv = setInterval(async () => { if (busy) return; busy = true; try { await sample(); } catch (e) { /* the page moved on */ } busy = false; }, 250);
    let r; try { r = await g.autoplay({ sample }); } finally { clearInterval(iv); }
    const out = []; if (r && r.ok === false) out.push(`the autoplayer did not finish: ${r.why || 'stalled'}`); if (r && r.stalls) for (const s of r.stalls) out.push(`stall: ${s}`);
    return { lines: out, note: ctx.run.camera.length + ' camera spots, ' + ctx.run.clips.length + ' clip samples' }; } },
  { id: 'camera', needs: ['camera'], after: ['autoplay'], async run(g, T, ctx) {
    if (g.talks) for (const t of await g.talks()) { await g.talkTo(t); await sleep(400); const c = await g.camera(); if (c) ctx.run.camera.push({ ...c, what: 'talk ' + t, at: c.at === undefined ? (g.place ? await g.place() : null) : c.at }); }
    const now = g.place ? await g.place() : null, groups = new Map();   /* each spot against the walls of the place it was taken in (not the place the run ends in) */
    for (const c of ctx.run.camera) { const P = c.at === undefined ? now : c.at; if (!groups.has(P)) groups.set(P, []); groups.get(P).push(c); }
    const out = []; for (const [P, cs] of groups) out.push(...cameraIssues(cs, { walls: (P && P.walls) || [], groundAt: (P && P.groundAt) || (() => 0), solid: P && P.solid, wallTop: T.wallTop || 3 })); return out; } },
  { id: 'rule4', needs: ['clips'], after: ['autoplay'], async run(g, T, ctx) { return [...clipIssues(ctx.run.clips, { near: T.fightNear || 12, allow: T.allowClips || {} }), ...intenseIssues(ctx.run.entered, T.intense || {})]; } },
  { id: 'errors', needs: [], last: true, async run(g, T, ctx) { return ctx.errors.lines.slice(); } },
];

/* the order they run in: checks that read what others collected (continuity, camera, rule4, sound) come after them; errors last */
export const ORDER = ['journal', 'links', 'a11y', 'keys', 'chapters', 'steps', 'map', 'faces', 'budget', 'autoplay', 'camera', 'rule4', 'sound', 'continuity', 'errors'];

/* run every check whose hooks the adapter has (each may take up to opts.timeout or tables.timeout, 15 minutes by default); opts.only = ['journal', 'map'] limits the list (also ?checks=journal,map in the URL) */
export async function checkAll(game, tables = {}, opts = {}) {
  const ctx = { errors: watchErrors(), audio: watchAudio(), cast: [], items: [], chapterSteps: [], chapterLight: [], run: { camera: [], clips: [], lines: [], levels: [], entered: [], lastStep: undefined } };
  const q = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();
  const only = opts.only || (q.get('checks') ? q.get('checks').split(',') : null), rows = [], t00 = Date.now();
  if (game.ready) await game.ready();
  const order = ORDER.map((id) => CHECKS.find((c) => c.id === id)).filter(Boolean).concat(CHECKS.filter((c) => !ORDER.includes(c.id)));
  for (const c of order) {
    if (only && !only.includes(c.id)) continue;
    const miss = c.needs.filter((h) => typeof game[h] !== 'function' && game[h] === undefined);
    if (miss.length) { rows.push({ id: c.id, status: 'skip', why: 'needs ' + miss.map((m) => 'game.' + m).join(', '), lines: [] }); continue; }
    const t0 = Date.now(); let lines = [], note = '', status = 'ok'; ctx.partial = null; ctx.progress = '';
    try {
      let timer; const limit = new Promise((_, no) => { timer = setTimeout(() => no(new Error('timed out')), opts.timeout || tables.timeout || 900000); });
      const r = await Promise.race([c.run(game, tables, ctx), limit]).finally(() => clearTimeout(timer));
      lines = Array.isArray(r) ? r : (r && r.lines) || []; note = (r && r.note) || '';
    } catch (e) { status = 'error'; lines = [...(ctx.partial || []), `${c.id} ${e.message === 'timed out' ? 'timed out' : 'crashed: ' + e.message}${ctx.progress ? ' after ' + ctx.progress : ''}`]; }
    rows.push({ id: c.id, status, lines, note, ms: Date.now() - t0 });
    if (opts.onRow) opts.onRow(rows[rows.length - 1]);
  }
  ctx.errors.stop();
  const ran = rows.filter((r) => r.status !== 'skip'), n = ran.reduce((a, r) => a + r.lines.length, 0), skipped = rows.length - ran.length;
  const text = [`ALL ${n}` + (skipped ? ` (${skipped} check${skipped === 1 ? '' : 's'} not wired)` : '') + ` in ${((Date.now() - t00) / 1000).toFixed(1)} s`, '',
    'check       issues  time     status', ...rows.map((r) => `${r.id.padEnd(12)}${(r.status === 'skip' ? '-' : String(r.lines.length)).padEnd(8)}${(r.ms === undefined ? '-' : (r.ms / 1000).toFixed(1) + ' s').padEnd(9)}${r.status === 'skip' ? 'skip: ' + r.why : r.status}${r.note ? ' (' + r.note + ')' : ''}`),
    ...ran.filter((r) => r.lines.length).flatMap((r) => ['', `--- ${r.id} (${r.lines.length})`, ...r.lines])].join('\n');
  if (typeof document !== 'undefined') {
    let pre = document.getElementById('autolog'); if (!pre) { pre = document.createElement('pre'); pre.id = 'autolog'; document.body.appendChild(pre); }
    pre.hidden = false; pre.textContent = text; document.title = 'ALL ' + n;
  }
  const result = { n, rows, text }; if (typeof window !== 'undefined') window.__checks = result; return result;
}
