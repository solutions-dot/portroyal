/* engine/ambient.js: background life. People who are not in the story walk about, chat, work, sit, watch and play, so a place never looks
   like a crowd of statues (owner, November 2026: "too much standing around looking like zombies"). See docs/ENGINE.md, "engine/ambient.js".

   A game gives each background person a behaviour as plain data and runs one shared tick a frame:
     const life = createAmbient({ walls, bounds, blocked, keepOff, seed, phone });
     life.add(n, { kind: 'wander', area: [x0, z0, x1, z1] });
     life.add(a, { kind: 'chat', group: 'well' }); life.add(b, { kind: 'chat', group: 'well' });
     every frame: life.tick(dt, { px, pz, story, talking, view });
   n is the game's person, the same shape engine/follow.js uses: { id, x, z, m (the body), ctl (its engine/anim.js controller) }.
   The tick moves n.x and n.z, turns the body, chooses and paces its clips, turns the head, and updates the mixer, the grips and the feet
   of everyone it owns, nearer people more often than far ones. Leave these people out of the game's own mixer and groundFeet loops.

   Behaviours (spec.kind):
     wander   short walks between a few points (spec.pts) or random free spots in spec.area, round walls (walkRoute), paced so the feet do
              not slide, with pauses to idle or look around.
     chat     two or three people in a small ring (same spec.group), facing each other, taking turns to talk while the others listen,
              with an odd laugh or nod, and a glance at the player who comes near.
     work     a loop at a spot: spec.clip (or spec.clips) with a short rest between. With spec.between: [[x, z], [x, z]] they carry
              between two points instead (spec.walk, e.g. 'Carry', and spec.pick, e.g. 'PickUp', at each end).
     sit      on a seat (spec.seat, or a seatAnchor the game set): SitIdle and its variants, and SitTalk in turn with a neighbour in the same group.
     watch    stand and look toward spec.at with small shifts of weight and stance, and an odd reaction (spec.react: ['Clap', 'Point']).
     errand   walk from spec.from to spec.to carrying something (spec.walk, e.g. 'CarryBagWalk'), wait, and walk back.
     play     a child running, stopping for joy and chasing (spec.chase: another child) in spec.area, slower near the player.
   Every behaviour: random start time and speed on every clip (nobody moves in step), idle variants in turn, a head that turns toward
   the player or a nearby person (limited and eased), personal space (nobody walks into a person, the player or a solid; they yield to the
   right and step aside), and the story first: nobody stands on a story path (opts.keepOff), nobody crowds a story person, and in a sad
   scene (life.mood('sad')) there are fewer people, slower and quieter, but nobody freezes.
   The dev check is ambientCheck / ambientTest (?test=ambient): it runs everyone for a while and reports anyone inside a solid or another
   person, sliding, standing still too long in a lively scene, or blocking a story path. */
import * as THREE from 'three';
import { walkRoute, segmentHitsWall } from './placement.js';
import { groundFeet, strideOf, lookBegin, lookEnd, idleOK } from './anim.js';
import { gripTick } from './grip.js';
import { faceCheck } from './faces.js';
import { snapMeshes, auditSeated } from './audit.js';   /* dev checks only (ambientCheck): the public builds never call it, so the bundler leaves it out */

/* ---------- settings ---------- */
const DEF = {
  full: 14, mid: 30, far: 55, cull: Infinity,   /* metres from the player: full detail, every few frames, a light copy (n.lo) beyond far, hidden beyond cull */
  maxFull: 14, midEvery: 3, farEvery: 8,        /* at most maxFull people get full detail; the rest update their mixer every midEvery or farEvery frames */
  r: 0.24, kidR: 0.19,                          /* body radius for personal space */
  space: 0.8, storySpace: 1.0,                  /* how close a walker comes to the player and to a story person */
  walk: 1.05, run: 2.5,                         /* metres a second for a grown-up; a child is scaled by the square root of its size */
  look: 5, lookYaw: 1.05, lookPitch: 0.3, headMax: 1.35,   /* headMax: the head's whole turn from the hips, clip and look together (77 degrees) */       /* head turns: how far away a person is noticed, the largest turn (radians) */
  still: 12,                                    /* the check: seconds a person may stand without any visible change in a lively scene */
  ground: true, mixers: true,                   /* the tick grounds the feet and updates the mixers of the people it owns */
};
export const MOODS = {
  lively: { speed: 1, pause: 1, laugh: 0.25, react: true, play: true, hide: 0 },
  calm: { speed: 0.9, pause: 1.35, laugh: 0.12, react: true, play: true, hide: 0 },
  sad: { speed: 0.72, pause: 1.8, laugh: 0, react: false, play: false, hide: 0.4 },   /* hide: share of the lively people (wanderers, players, chat) that go away, out of view */
};
const IDLE = /^(Idle|SitIdle|SitPose|CarryIdle|CarryHeadIdle|Sad1|Sad2|Kneel$)/;   /* clips in which a body does next to nothing: too long in one of these is a statue */
const PROP = /^(Carry|CarryIdle|CarryBagWalk|CarryHead|Drink|Write|PlayGuitar|PlayPiano|Rifle)/;   /* clips that show a hand holding something: they need something in the hand */
const TALKS = ['Talk1', 'Talk2', 'Talk3', 'TalkM1', 'TalkM2'], TALKS_M = ['TalkM1', 'TalkM2', 'Talk2'], TALKS_F = ['Talk1', 'Talk2', 'Talk3'];

/* ---------- small helpers ---------- */
function rng(seed) { let a = (seed >>> 0) || 1; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const span = (r, v, d) => (Array.isArray(v) ? v[0] + r() * (v[1] - v[0]) : (v === undefined ? d : v));
const inRect = (w, x, z, r) => x > w[0] - r && x < w[2] + r && z > w[1] - r && z < w[3] + r;
function segDist(px, pz, ax, az, bx, bz) { const dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz || 1, t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / L)); return Math.hypot(px - ax - dx * t, pz - az - dz * t); }
/* is (x, z) on a story path or spot? keepOff entries: { pts: [[x, z], ...], w } (a path, w metres either side) or { at: [x, z], r } (a spot) */
export function onKeepOff(list, x, z, r = 0) {
  for (const k of list || []) {
    if (k.at) { if (Math.hypot(x - k.at[0], z - k.at[1]) < (k.r || 1) + r) return k; continue; }
    const p = k.pts || k, w = (k.w === undefined ? 0.7 : k.w) + r; for (let i = 1; i < p.length; i++) if (segDist(x, z, p[i - 1][0], p[i - 1][1], p[i][0], p[i][1]) < w) return k;
  }
  return null;
}

/* ---------- the system ---------- */
export function createAmbient(opts = {}) {
  const O = { ...DEF, ...(opts.phone ? { full: 10, mid: 22, maxFull: 8, midEvery: 4, farEvery: 10 } : {}), ...opts };
  const people = [], groups = new Map(), R = rng(O.seed === undefined ? 1 : O.seed);
  let mood = O.mood || 'lively', frame = 0, lodT = 0, W = { px: 1e6, pz: 1e6 };
  const life = { people, groups, t: 0, opts: O };
  const keepOff = () => (typeof O.keepOff === 'function' ? O.keepOff() : O.keepOff) || [];
  const M = () => MOODS[mood] || MOODS.lively;

  /* where a person may stand: inside the bounds, out of walls and solids (the game's blocked) */
  function solidFree(x, z, r) {
    const B = O.bounds; if (B && (x < B.x0 + r || x > B.x1 - r || z < B.z0 + r || z > B.z1 - r)) return false;
    if ((O.walls || []).some((w) => inRect(w, x, z, r))) return false; return !(O.blocked && O.blocked(x, z, r));
  }
  function lineFree(a, b, r) {
    if ((O.walls || []).some((w) => segmentHitsWall(a, b, w, r))) return false;
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / 0.25)); for (let i = 1; i <= k; i++) if (!solidFree(a[0] + (b[0] - a[0]) * i / k, a[1] + (b[1] - a[1]) * i / k, r)) return false; return true;
  }
  const story = () => W.story || (O.story ? O.story() : []) || [];
  const visible = (o) => o.m && o.m.visible !== false && !(o.amb && o.amb.gone);
  /* a step from where n is to (x, z) keeps personal space: no closer than need to anyone, unless it takes n further away from them */
  function roomAt(n, x, z) {
    const a = n.amb;
    for (const o of people) { if (o === n || !visible(o)) continue; const need = a.r + o.amb.r + 0.1, d1 = Math.hypot(o.x - x, o.z - z); if (d1 < need && d1 < Math.hypot(o.x - n.x, o.z - n.z) - 1e-4) return false; }
    for (const o of story()) { if (!o || o === n || (o.m && o.m.visible === false)) continue; const d1 = Math.hypot(o.x - x, o.z - z); if (d1 < O.storySpace && d1 < Math.hypot(o.x - n.x, o.z - n.z) - 1e-4) return false; }
    const dp = Math.hypot(W.px - x, W.pz - z); if (dp < O.space && dp < Math.hypot(W.px - n.x, W.pz - n.z) - 1e-4) return false;
    return true;
  }
  /* a free goal: not in a solid, not on a story path, not where someone stands or is heading, and reachable */
  function goalFree(n, g) {
    const a = n.amb; if (!solidFree(g[0], g[1], a.r) || onKeepOff(keepOff(), g[0], g[1], a.r)) return false;
    for (const o of people) { if (o === n || !visible(o)) continue; const need = a.r + o.amb.r + 0.35; if (Math.hypot(o.x - g[0], o.z - g[1]) < need) return false; if (o.amb.goal && Math.hypot(o.amb.goal[0] - g[0], o.amb.goal[1] - g[1]) < need) return false; }
    for (const o of story()) if (o && Math.hypot(o.x - g[0], o.z - g[1]) < O.storySpace + 0.4) return false;
    return true;
  }
  function routeTo(n, g) {
    const a = n.amb, rr = a.r * 0.8 - 0.04, from = [n.x, n.z]; let r = (O.walls && O.walls.length) ? walkRoute(from, g, O.walls, rr, O.bounds) : [g.slice()]; if (!r.length) return null;   /* a little narrower than a step (a.r * 0.8), so someone who stopped against a wall can still set off */
    let p = from; for (const q of r) { if (!lineFree(p, q, rr)) return null; p = q; } return r.map((q) => q.slice());
  }

  /* ---------- clips ---------- */
  const ctlOf = (n) => n.ctl || (n.m && n.m.userData.anim);
  const has = (n, name) => { const c = ctlOf(n); return !!(name && c && c.get(name)); };
  const avail = (n, list) => (list || []).filter((c) => idleOK(c) && has(n, c));   /* never a clip the owner took out of idle time (engine/anim.js NOT_IDLE) */
  function play(n, name, { once = false, speed } = {}) {
    const c = ctlOf(n), a = n.amb; if (!c) return false; const act = c.get(name); if (!act) return false;
    if (act === c.cur) { a.clip = name; return true; }
    const restarting = c.play(name, once); c.timer = 0;   /* the behaviour decides when a clip ends, not the controller's once-timer */
    if (!once) { const phase = a.rnd() * act.getClip().duration; if (restarting !== false) act.time = phase; }   /* never in step with anyone else */
    act.timeScale = speed || (0.88 + a.rnd() * 0.24); a.clip = name; a.clipT = 0; a.changed = life.t; if (n.lo && n.lo.userData.anim) { const lc = n.lo.userData.anim, la = lc.get(name); if (la && la !== lc.cur) { const restartLite = lc.play(name, once); lc.timer = 0; if (restartLite !== false) la.time = act.time; la.timeScale = act.timeScale; } }
    return true;
  }
  const clipLen = (n, name) => { const c = ctlOf(n), act = c && c.get(name); return act ? act.getClip().duration / (act.timeScale || 1) : 2; };
  function strideFor(n, name) { if (O.stride) return O.stride(n, name); const c = ctlOf(n), act = c && c.get(name); return act ? strideOf(n.m, act.getClip()) : 0; }
  /* play a walk at the pace that fits ground speed v on this body, for any walking clip (Carry, CarryBagWalk, CarryHeadWalk, Run...) */
  function pace(n, v) {
    const c = ctlOf(n), act = c && c.cur; if (!act) return; const s = strideFor(n, n.amb.clip);
    if (s > 0.05) act.timeScale = Math.max(0.4, Math.min(2.2, v * act.getClip().duration / s)); else if (c.pace) c.pace(v);
    if (n.lo && n.lo.userData.anim && n.lo.userData.anim.cur) n.lo.userData.anim.cur.timeScale = act.timeScale;
  }
  /* the fastest and slowest a walk clip can be played at without the feet sliding: speeds are kept inside this */
  function okSpeed(n, name, v) { const s = strideFor(n, name), c = ctlOf(n), act = c && c.get(name); if (!(s > 0.05) || !act) return v; const d = act.getClip().duration; return Math.max(0.45 * s / d, Math.min(2.1 * s / d, v)); }

  /* ---------- adding people ---------- */
  life.add = (n, spec = {}) => {
    if (typeof spec === 'string') spec = { kind: spec };
    if (n.m) { n.m.userData.ambOwned = true; if (isOld(n)) n.m.userData.elder = true; }   /* the crowd code runs this person's idles (engine/anim.js fidget leaves them alone) */
    const id = n.id || n.base || people.length, r0 = rng(hash(id) ^ (O.seed || 1) ^ Math.imul(people.length + 1, 2654435761));
    const kid = spec.kid !== undefined ? spec.kid : !!(n.kid || (n.m && n.m.scale.y < 0.88));
    n.amb = { kind: spec.kind || 'wander', spec, rnd: r0, kid, r: spec.r || (kid ? O.kidR : O.r), sk: Math.sqrt((n.m && n.m.scale.y) || 1) * span(r0, [0.9, 1.1]),
      st: 'start', t: 0, goal: null, route: null, clip: null, clipT: 0, changed: 0, blockedT: 0, look: 0, lookP: 0, glance: null, nod: 0, level: 0, acc: 0, n0: frame + ((r0() * 8) | 0),
      sx: n.x, sz: n.z, home: [n.x, n.z], ry0: n.m ? n.m.rotation.y : 0, hide: r0(), pT: 0, pOff: r0() * 9, quiet: 0 };
    if (spec.kind === 'work' && spec.between) n.amb.spec = spec = { drop: true, pick: 'PickUp', walk: 'Carry', idle: 'CarryIdle', back: 'Walk', from: spec.between[0], to: spec.between[1], ...spec };   /* carrying between two points is an errand that puts its load down */
    if (spec.seat && n.m) n.m.userData.seatAnchor = { ...spec.seat };
    if (/^(wander|errand|play)$/.test(n.amb.kind) || spec.between) { n.amb.st = 'pause'; n.amb.t = r0() * 3; }   /* not everyone sets off in the same frame */
    if (spec.group !== undefined) { const g = groups.get(spec.group) || { id: spec.group, kind: spec.kind, members: [], speaker: -1, t: 0, ready: false }; g.members.push(n); groups.set(spec.group, g); n.amb.g = g; }
    people.push(n); return n;
  };
  life.remove = (n) => { const i = people.indexOf(n); if (i >= 0) people.splice(i, 1); if (n.amb && n.amb.g) { const g = n.amb.g; g.members.splice(g.members.indexOf(n), 1); } };
  life.clear = () => { people.length = 0; groups.clear(); };
  life.hold = (n, on = true) => { if (n.amb) n.amb.held = on; if (on) stand(n); };   /* the game takes this person for a while (a talk, a cut scene): they stop, and their clips are the game's */
  life.mood = (m) => { if (m === undefined) return mood; if (!MOODS[m] || m === mood) return mood; mood = m; for (const n of people) n.amb.t = Math.min(n.amb.t, 0.5 + n.amb.rnd() * 1.5); for (const g of groups.values()) g.t = Math.min(g.t, 0.5); return mood; };   /* everyone changes within a second or two, not all in the same frame */

  /* lay a chat group out in a small ring round spec.at (or round where they stand), each facing the middle */
  function arrange(g) {
    g.ready = true; const ms = g.members, k = ms.length; if (g.kind !== 'chat' || !k) return;
    const at = ms[0].amb.spec.at || [ms.reduce((s, n) => s + n.x, 0) / k, ms.reduce((s, n) => s + n.z, 0) / k];
    const rad = ms[0].amb.spec.ring || (k === 2 ? 0.55 : 0.68), a0 = ms[0].amb.spec.turn !== undefined ? ms[0].amb.spec.turn : ms[0].amb.rnd() * Math.PI * 2;
    ms.forEach((n, i) => { if (ms[0].amb.spec.at) { const a = a0 + i * Math.PI * 2 / k; n.x = at[0] + Math.sin(a) * rad; n.z = at[1] + Math.cos(a) * rad; }
      n.amb.face = Math.atan2(at[0] - n.x, at[1] - n.z) + (n.amb.rnd() - 0.5) * 0.25; if (n.m) n.m.rotation.y = n.amb.face; n.amb.home = [n.x, n.z]; });
    g.at = at;
  }

  const isOld = (n) => n.old !== undefined ? n.old : /elder|old|gran|Old|Gran/.test((n.base || '') + ' ' + (n.bodyId || '') + ' ' + (n.model || ''));
  /* ---------- states ---------- */
  function stand(n, clip) { const a = n.amb; a.walking = false; a.route = null; a.goal = null; if (clip) play(n, clip); else if (a.clip && !IDLE.test(a.clip) && /Walk|Run|Carry$/.test(a.clip)) play(n, idleFor(n)); }
  function idleFor(n) {
    const a = n.amb, s = a.spec, old = isOld(n); let list = mood === 'sad' ? avail(n, s.sadIdles || (old ? ['Sad1', 'OldIdle', 'Sad2', 'Idle'] : ['Sad1', 'Sad2', 'Idle'])) : avail(n, s.idles || (old ? ['OldIdle', 'Idle', 'LookAround', 'HeadTurn', 'LookOverShoulder'] : ['Idle', 'LookAround', 'HeadTurn', 'HappyIdle', 'LookOverShoulder', 'HappyIdle2']));   /* with no idles named, a mix (one Idle for ever looked like a statue; owner, 17 November 2026), and an old person's own idle for the old */
    if (a.carrying || (a.carrying === undefined && s.carrying)) { const c = avail(n, [s.idle || 'CarryIdle']); if (c.length) list = c; }   /* hands full: the carrying idle */
    if (!list.length) list = avail(n, ['Idle']); if (!list.length) return null;
    a.iv = ((a.iv === undefined ? (a.rnd() * list.length) | 0 : a.iv + 1)) % list.length; return list[a.iv];   /* in turn, so two pauses in a row look different */
  }
  function talkFor(n) { const s = n.amb.spec, l = avail(n, s.talks || (n.sex === 'm' ? TALKS_M : n.sex === 'f' ? TALKS_F : TALKS)); return l.length ? l[(n.amb.rnd() * l.length) | 0] : null; }
  function walkClip(n) { const a = n.amb, s = a.spec; if (a.running) return avail(n, [s.run || 'Run'])[0] || null; return avail(n, [a.carrying === false ? (s.back || 'Walk') : (s.walk || (n.sex === 'm' ? 'WalkM' : 'Walk')), 'Walk'])[0] || null; }
  function pause(n, lo, hi) { const a = n.amb; a.st = 'pause'; a.t = span(a.rnd, [lo, hi]) * M().pause; a.turnTo = undefined; stand(n, idleFor(n)); if (a.rnd() < 0.6) glance(n, a.rnd() < 0.4 ? [W.px, W.pz] : null); }
  function glance(n, at) { const a = n.amb; if (at && Math.hypot(at[0] - n.x, at[1] - n.z) < 12) { a.glance = { yaw: Math.atan2(at[0] - n.x, at[1] - n.z), t: 1.6 + a.rnd() * 1.6 }; return; } a.glance = { yaw: (n.m ? n.m.rotation.y : 0) + (a.rnd() - 0.5) * 1.6, t: 1.2 + a.rnd() * 1.5 }; }
  function shift(n, toward) {   /* a small change of stance: turn a little, then settle */
    const a = n.amb, base = toward !== undefined ? toward : (a.face !== undefined ? a.face : a.ry0); a.turnTo = base + (a.rnd() - 0.5) * 0.7; a.changed = life.t;
  }
  function pickGoal(n) {
    const a = n.amb, s = a.spec, out = [];
    if (s.pts && s.pts.length) { for (const p of s.pts) if (Math.hypot(p[0] - n.x, p[1] - n.z) > 0.8) out.push(p); out.sort(() => a.rnd() - 0.5); }
    const area = s.area || (s.pts ? null : [a.home[0] - (s.reach || 4), a.home[1] - (s.reach || 4), a.home[0] + (s.reach || 4), a.home[1] + (s.reach || 4)]);
    if (area) for (let i = 0; i < 14; i++) { const g = [area[0] + a.rnd() * (area[2] - area[0]), area[1] + a.rnd() * (area[3] - area[1])], d = Math.hypot(g[0] - n.x, g[1] - n.z); if (d > (s.min || 1.5) && d < (s.max || 9)) out.push(g); }
    for (const g of out) { if (!goalFree(n, g)) continue; const r = routeTo(n, g); if (r) return { g: g.slice(), r }; }
    return null;
  }
  function go(n, g, route, { run = false } = {}) {
    const a = n.amb; a.goal = g; a.route = route || routeTo(n, g); if (!a.route) { a.goal = null; return false; } a.running = run; a.st = 'walk'; a.blockedT = 0;
    const want = Math.atan2(a.route[0][0] - n.x, a.route[0][1] - n.z); if (n.m && Math.abs(wrap(want - n.m.rotation.y)) > 2.0 && !onKeepOff(keepOff(), n.x, n.z, a.r)) { a.st = 'turn'; a.turnTo = want; stand(n); return true; }   /* turn round on the spot first: no backwards walk */
    a.turnTo = undefined; a.walking = true; play(n, walkClip(n)); return true;
  }
  /* one frame of walking along the route: slow on sharp turns, yield to the right, wait, then find another way */
  function walkStep(n, dt) {
    const a = n.amb, s = a.spec, m = n.m, to = a.route && a.route[0]; if (!to) return true;
    const dx = to[0] - n.x, dz = to[1] - n.z, d = Math.hypot(dx, dz); if (d < 0.05) { a.route.shift(); return !a.route.length; }
    const dp = Math.hypot(W.px - n.x, W.pz - n.z); let v = (a.running ? O.run : (s.speed || O.walk)) * a.sk * M().speed;
    if (dp < 4) v *= a.running ? 0.6 : 0.8; if (a.running && (dp < 5 || !M().play)) { a.running = false; play(n, walkClip(n)); }   /* near you a running child slows to a walk */
    const want = Math.atan2(dx, dz), err = m ? wrap(want - m.rotation.y) : 0;
    v *= Math.max(0.35, Math.cos(Math.min(1.4, Math.abs(err)))); v = okSpeed(n, a.clip, v);
    const sp = Math.min(d, v * dt), L = Math.min(0.55, d);
    for (const t of [0, -0.4, -0.8, 0.4, -1.2, 0.8]) {   /* straight on, else bear right (both walkers bear right, so they pass), else left */
      const c = Math.cos(t), si = Math.sin(t), ux = (dx * c + dz * si) / d, uz = (-dx * si + dz * c) / d, x = n.x + ux * sp, z = n.z + uz * sp;
      if (!solidFree(x, z, a.r * 0.8) || !roomAt(n, n.x + ux * L, n.z + uz * L) || !roomAt(n, x, z)) continue;
      n.x = x; n.z = z; a.blockedT = 0; if (!a.walking) { a.walking = true; play(n, walkClip(n)); } pace(n, sp / (dt || 1));
      if (m) { const e2 = wrap(Math.atan2(ux, uz) - m.rotation.y); m.rotation.y += e2 * Math.min(1, dt * 5); }
      return false;
    }
    a.blockedT += dt; if (a.walking) { a.walking = false; play(n, idleFor(n)); }   /* wait for the way to clear */
    if (a.blockedT > (onKeepOff(keepOff(), n.x, n.z, a.r) ? 0.4 : 1.4)) { a.blockedT = 0;   /* never wait on a story path: step off it at once */ if (!backOff(n)) { a.route = null; a.goal = null; a.st = 'stuck'; } }
    return false;
  }
  /* two people who block each other in a narrow way: one steps back out of the way, so the other can pass (the pause after is random, so they do not both come again at once) */
  function backOff(n) {
    const a = n.amb; let bx = 0, bz = 0, best = 1e9;
    for (const o of people) { if (o === n || !visible(o)) continue; const d = Math.hypot(o.x - n.x, o.z - n.z); if (d < best) { best = d; bx = o.x; bz = o.z; } }
    const dp = Math.hypot(W.px - n.x, W.pz - n.z); if (dp < best) { best = dp; bx = W.px; bz = W.pz; } if (best > 2.5) return false;
    const ux = (n.x - bx) / (best || 1), uz = (n.z - bz) / (best || 1);
    const onPath = !!onKeepOff(keepOff(), n.x, n.z, a.r);   /* already on a story path: any free step will do, the next goal takes them off it */
    for (const t of [0, 0.6, -0.6, 1.2, -1.2, 1.8, -1.8]) for (const L of [0.9, 0.6]) { const c = Math.cos(t), si = Math.sin(t), x = n.x + (ux * c + uz * si) * L, z = n.z + (-ux * si + uz * c) * L;
      if (!solidFree(x, z, a.r * 0.8) || (!onPath && onKeepOff(keepOff(), x, z, a.r)) || !lineFree([n.x, n.z], [x, z], a.r * 0.8 - 0.04) || !roomAt(n, x, z)) continue;
      a.resume = a.st; a.route = [[x, z]]; startWalk(n); a.st = 'aside'; return true; }
    return false;
  }
  function startWalk(n) { const a = n.amb; a.st = 'walk'; a.turnTo = undefined; a.walking = true; play(n, walkClip(n)); }
  function turnStep(n, dt, k = 2.2) { const m = n.m, a = n.amb; if (!m || a.turnTo === undefined) return true; const e = wrap(a.turnTo - m.rotation.y); m.rotation.y += Math.sign(e) * Math.min(Math.abs(e), dt * k); return Math.abs(e) < 0.08; }

  /* ---------- behaviours: each returns nothing; it sets a.st, a.t and plays clips ---------- */
  const B = {};
  B.wander = (n, dt) => {
    const a = n.amb;
    if (a.st === 'walk') { if (walkStep(n, dt)) { if (onKeepOff(keepOff(), n.x, n.z, a.r)) { a.st = 'start'; return; } pause(n, ...(a.spec.pause || [2, 6])); } return; }
    if (a.st === 'turn') { if (turnStep(n, dt, 2.6)) startWalk(n); return; }
    if (a.st === 'pause' && a.t > 0) return;
    const p = pickGoal(n); if (p) go(n, p.g, p.r); else pause(n, 1.5, 3);
  };
  B.errand = (n, dt) => {
    const a = n.amb, s = a.spec;
    if (a.leg === undefined) { a.leg = Math.hypot(s.to[0] - n.x, s.to[1] - n.z) < Math.hypot(s.from[0] - n.x, s.from[1] - n.z) ? 0 : 1; if (s.drop) { a.carrying = a.leg === 1; if (s.show) s.show(n, a.carrying); } }   /* leg: where they go next (1 = spec.to); with spec.drop they carry only on the way to spec.to */
    if (a.st === 'walk') { if (walkStep(n, dt)) { a.leg ^= 1; a.st = 'arrive'; a.t = 0; } return; }
    if (a.st === 'turn') { if (turnStep(n, dt, 2.6)) startWalk(n); return; }
    if (a.st === 'arrive') {   /* at one end: put down or pick up (spec.drop), then wait */
      const pk = s.pick || 'PickUp'; if (s.drop && has(n, pk)) { play(n, pk, { once: true, speed: 1 }); a.st = 'pick'; a.t = clipLen(n, pk) * 0.95; a.half = a.t / 2; a.swapped = false; stand(n); a.clip = pk; return; }
      if (s.drop) { a.carrying = !a.carrying; if (s.show) s.show(n, a.carrying); }
      pause(n, ...(s.wait || [3, 8])); return; }
    if (a.st === 'pick' && a.t > 0) { if (a.t < a.half && !a.swapped) { a.swapped = true; a.carrying = !a.carrying; if (s.show) s.show(n, a.carrying); } return; }
    if (a.st === 'pick') { pause(n, ...(s.wait || [1, 3])); return; }
    if (a.st === 'pause' && a.t > 0) return;
    const g = a.leg === 1 ? s.to : s.from; if (!go(n, g.slice())) pause(n, 1.5, 3);
  };
  B.work = (n, dt) => {
    const a = n.amb, s = a.spec;
    if (s.between) { B.errand(n, dt); return; }
    if (a.st === 'turn') { if (turnStep(n, dt)) a.st = 'rest'; return; }
    if (a.t > 0) return;
    if (a.st === 'work') { a.st = 'rest'; a.t = span(a.rnd, s.rest || [1.5, 3.5]) * M().pause; play(n, idleFor(n)); if (a.rnd() < 0.6) glance(n); return; }
    const list = avail(n, s.clips || [s.clip]); if (!list.length) { pause(n, 3, 5); return; }
    const c = list[(a.rnd() * list.length) | 0], once = s.once !== undefined ? s.once : /^(PickUp|Point|WaveSlow|Salute|KneelDown|ReachOut)$/.test(c);
    play(n, c, { once }); a.st = 'work'; a.t = once ? clipLen(n, c) * 0.95 : span(a.rnd, s.work || [5, 10]);
    if (s.face !== undefined && n.m) { a.turnTo = Array.isArray(s.face) ? Math.atan2(s.face[0] - n.x, s.face[1] - n.z) : s.face; }
  };
  B.watch = (n, dt) => {
    const a = n.amb, s = a.spec, poi = s.at, face = poi ? Math.atan2(poi[0] - n.x, poi[1] - n.z) : a.ry0; if (a.face === undefined) { a.face = face; a.turnTo = face + (a.rnd() - 0.5) * 0.4; }
    if (a.t > 0) return;
    const roll = a.rnd(), react = M().react ? avail(n, s.react || []) : [];
    if (react.length && roll < 0.22) { const c = react[(a.rnd() * react.length) | 0], once = /^(Point|WaveSlow|Salute)$/.test(c); play(n, c, { once }); a.t = once ? clipLen(n, c) * 0.95 : 2.5 + a.rnd() * 2.5; return; }
    if (roll < 0.6) shift(n, face); else { const c = idleFor(n); if (c && c !== a.clip) play(n, c); else shift(n, face); glance(n); }   /* a step of weight or another idle, and a look round: always something */
    a.t = span(a.rnd, s.every || [4, 8]) * M().pause;
  };
  B.chat = (n, dt) => {
    const a = n.amb, g = a.g; if (!g) { B.watch(n); return; } if (!g.ready) arrange(g);
    if (a.face !== undefined && a.turnTo === undefined) a.turnTo = a.face;
    if (g.ms !== life.t) {   /* the group's own clock, once a frame: whose turn is it to talk */
      g.ms = life.t; g.t -= dt; const live = g.members.filter((o) => visible(o) && !o.amb.held);
      if (g.t <= 0 && live.length) {
        /* people who meet greet each other first (owner, 17 November 2026: use the Greet clip where people meet): the first turn of a ring of two or more is one
           raised hand from one of them and a nod from the others, where the game ships Greet and the scene is not a sad one. Someone with a thing hanging from the
           hand keeps it still (engine/anim.js gives them the Idle). Angry is for arguments only and is in no mix here. */
        if (!g.greeted && Math.hypot(W.px - n.x, W.pz - n.z) < 16) { g.greeted = true; const first = live[(a.rnd() * live.length) | 0];   /* once, when you are near enough to see it */
          if (live.length > 1 && mood !== 'sad' && has(first, 'Greet') && play(first, 'Greet', { once: true, speed: 1 })) { const d = ctlOf(first).get('Greet').getClip().duration;
            g.speaker = first; first.amb.quiet = 0; g.t = Math.max(1.5, d - 0.4); for (const o of live) if (o !== first) { play(o, idleFor(o)); o.amb.nod = 0.7; } return; } }
        const prev = g.speaker; for (const o of live) o.amb.quiet += 1; let next = live[(a.rnd() * live.length) | 0];
        if (live.length > 1) { const others = live.filter((o) => o !== prev); next = a.rnd() < 0.6 ? others.reduce((p, q) => (q.amb.quiet > p.amb.quiet ? q : p)) : others[(a.rnd() * others.length) | 0]; }   /* mostly the one who has been quiet longest */
        next.amb.quiet = 0;
        g.speaker = live.length > 1 || a.rnd() < 0.5 ? next : null; g.t = span(a.rnd, [3, 7]) * (mood === 'sad' ? 1.4 : 1);
        for (const o of live) { const oa = o.amb; if (o === g.speaker) { const c = mood === 'sad' ? (avail(o, ['Talk3', 'Talk2'])[0] || talkFor(o)) : talkFor(o); if (c) play(o, c); continue; }
          if (prev === o && M().laugh && oa.rnd() < M().laugh && has(o, 'Laugh')) { play(o, 'Laugh'); oa.laughT = 1.8 + oa.rnd() * 1.6; } else play(o, idleFor(o));
          if (oa.rnd() < 0.35) oa.nod = 0.7; }
      }
    }
    if (a.laughT > 0) { a.laughT -= dt; if (a.laughT <= 0 && g.speaker !== n) play(n, idleFor(n)); }
  };
  B.sit = (n) => {
    const a = n.amb, s = a.spec, g = a.g; if (a.t > 0) return;
    const mate = g && g.members.find((o) => o !== n && visible(o));
    if (g && g.talker === n) g.talker = null;   /* a turn of talking ends */
    else if (mate && !g.talker && a.rnd() < (M().laugh > 0 ? 0.45 : 0.15) && has(n, 'SitTalk')) { g.talker = n; play(n, 'SitTalk'); a.t = span(a.rnd, [5, 10]); glance(n, [mate.x, mate.z]); return; }
    const list = mood === 'sad' ? avail(n, s.sadClips || ['SitIdle', 'SitDisbelief']) : avail(n, s.clips || ['SitIdle']); if (list.length) { a.iv = ((a.iv === undefined ? (a.rnd() * list.length) | 0 : a.iv + 1)) % list.length; play(n, list[a.iv]); }
    if (mate && (g.talker === mate || a.rnd() < 0.5)) glance(n, [mate.x, mate.z]); else glance(n, a.rnd() < 0.5 ? [W.px, W.pz] : null);
    a.t = span(a.rnd, s.every || [5, 9]) * M().pause; if (list[a.iv] && /^SitPose/.test(list[a.iv])) a.t = Math.min(a.t, 4);   /* a held pose only for a short while */
  };
  B.play = (n, dt) => {
    const a = n.amb, s = a.spec, dp = Math.hypot(W.px - n.x, W.pz - n.z), t = s.chase;
    if (!M().play) { a.running = false; a.chasing = false; B.wander(n, dt); return; }   /* a sad scene: no games, a slow walk about */
    if (a.st === 'walk') {
      if (a.chasing && t && visible(t)) {   /* after the other child: aim a step behind them, again every half second */
        if (Math.hypot(t.x - n.x, t.z - n.z) < 1.2) { a.chasing = false; joy(n); if (t.amb && !t.amb.walking) t.amb.t = Math.min(t.amb.t, 0.3); return; }
        if ((a.aimT = (a.aimT || 0) - dt) <= 0) { a.aimT = 0.5; const ry = t.m ? t.m.rotation.y : 0, g = [t.x - Math.sin(ry) * 0.9, t.z - Math.cos(ry) * 0.9], r = solidFree(g[0], g[1], a.r) ? routeTo(n, g) : null; if (!r) { a.chasing = false; joy(n); return; } a.route = r; }
      }
      if (walkStep(n, dt)) { a.chasing = false; joy(n); } return; }
    if (a.st === 'turn') { if (turnStep(n, dt, 3.5)) startWalk(n); return; }
    if (a.t > 0) return;
    const run = dp > 6 && has(n, s.run || 'Run') && a.rnd() < 0.75;
    if (t && visible(t) && Math.hypot(t.x - n.x, t.z - n.z) > 1.6 && a.rnd() < 0.5) { const r = routeTo(n, [t.x, t.z]); if (r) { a.chasing = true; a.aimT = 0; go(n, [t.x, t.z], r, { run }); a.goal = null; return; } }
    const p = pickGoal(n) || offPath(n); if (p) go(n, p.g, p.r, { run }); else joy(n);
  };
  /* a child left on a story path with nowhere picked to run to (Nanny Town, 17 November 2026: a girl stood on the way to Cubbenah): the nearest free ground off the path, or home */
  function offPath(n) { const a = n.amb; if (!onKeepOff(keepOff(), n.x, n.z, a.r)) return null;
    for (const L of [1.2, 1.8, 2.6, 3.6]) for (let i = 0; i < 12; i++) { const th = i * Math.PI / 6 + L, g = [n.x + Math.sin(th) * L, n.z + Math.cos(th) * L]; if (!solidFree(g[0], g[1], a.r) || onKeepOff(keepOff(), g[0], g[1], a.r) || !lineFree([n.x, n.z], g, a.r * 0.8 - 0.04)) continue; return { g, r: [g] }; }
    const r = routeTo(n, a.home); return r ? { g: a.home.slice(), r } : null; }
  function joy(n) { const a = n.amb, l = M().play ? avail(n, a.spec.joy || ['Cheer', 'Clap', 'Laugh']) : []; if (onKeepOff(keepOff(), n.x, n.z, a.r)) { a.st = 'pause'; a.walking = false; a.route = null; a.goal = null; a.t = 0.2; play(n, idleFor(n)); return; }   /* a game that ends on a story path does not stop to cheer there: the child runs on at once */
    a.st = 'pause'; a.walking = false; a.route = null; a.goal = null; a.t = 1.4 + a.rnd() * 2.2;
    if (l.length && a.rnd() < 0.7) play(n, l[(a.rnd() * l.length) | 0]); else play(n, idleFor(n)); if (a.rnd() < 0.5) glance(n, [W.px, W.pz]); }

  /* ---------- the head: a look toward the player or a nearby person, limited and eased (after the mixer, which resets the bones) ---------- */
  const BONES = new WeakMap(), _pq = new THREE.Quaternion(), _r = new THREE.Quaternion(), _ax = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0);
  function bonesOf(m) { let b = BONES.get(m); if (!b) { b = { neck: m.getObjectByName('mixamorigNeck'), head: m.getObjectByName('mixamorigHead') }; BONES.set(m, b); } return b; }
  function turnBone(bone, axis, ang) { if (!bone || !bone.parent || Math.abs(ang) < 1e-4) return; bone.parent.updateWorldMatrix(true, false); bone.parent.getWorldQuaternion(_pq); _r.setFromAxisAngle(axis, ang); bone.quaternion.premultiply(_pq.clone().invert().multiply(_r).multiply(_pq)); }
  function lookWant(n) {
    const a = n.amb, m = n.m; if (!m) return [0, 0]; const ry = m.rotation.y, rel = (x, z) => wrap(Math.atan2(x - n.x, z - n.z) - ry);
    if (a.spec.carrying && /^CarryHead/.test(a.spec.idle || '')) return [0, 0];
    if (W.watchTarget && a.kind === 'watch' && a.spec.at) return [rel(...a.spec.at), 0];
    const dp = Math.hypot(W.px - n.x, W.pz - n.z);
    if (W.talking === n) return [rel(W.px, W.pz), -0.05];
    if (dp < O.look && Math.abs(rel(W.px, W.pz)) < 1.9 && ((a.pT + a.pOff) % 9 < 3.5 || !a.g)) return [rel(W.px, W.pz), -0.05];   /* the player who comes near; in a group, a look now and then, then back to the talk */
    if (a.g && a.g.speaker && a.g.speaker !== n) { const s = a.g.speaker; return [rel(s.x, s.z), 0.05]; }
    if (a.glance) return [wrap(a.glance.yaw - ry), 0];
    if (a.spec.at && a.kind === 'watch') return [rel(a.spec.at[0], a.spec.at[1]), 0];
    return [0, 0];
  }
  const _tq = new THREE.Quaternion(), _hw = new THREE.Quaternion(), _fv = new THREE.Vector3(), FWD = new WeakMap();
  /* each bone's own forward, from the bind pose (every body is built facing +z): read once per body */
  function fwdOf(m, bone) {
    let f = FWD.get(bone); if (f !== undefined) return f; f = null;
    m.traverse((o) => { if (f || !o.isSkinnedMesh) return; const i = o.skeleton.bones.indexOf(bone); if (i < 0) return; const q = new THREE.Quaternion(); new THREE.Matrix4().copy(o.skeleton.boneInverses[i]).invert().decompose(new THREE.Vector3(), q, new THREE.Vector3()); f = new THREE.Vector3(0, 0, 1).applyQuaternion(q.invert()); });
    FWD.set(bone, f); return f;
  }
  function yawOf(m, bone) { const f = fwdOf(m, bone); if (!f) return null; bone.getWorldQuaternion(_hw); _fv.copy(f).applyQuaternion(_hw); return Math.atan2(_fv.x, _fv.z); }
  function clipYaw(m, head) {   /* how far the clip alone has turned the head from the hips */
    const hips = head && (m.getObjectByName('mixamorigHips') || m.getObjectByName('mixamorig:Hips')); if (!hips) return 0;
    head.updateWorldMatrix(true, false); const h = yawOf(m, head), p = yawOf(m, hips); return h === null || p === null ? 0 : wrap(h - p);
  }
  function headTick(n, dt, tracking) {
    const a = n.amb, b = bonesOf(n.m); if (!b.neck && !b.head) return; a.pT = tracking && Math.hypot(W.px - n.x, W.pz - n.z) < O.look ? a.pT + dt : 0; let [yaw, pitch] = tracking ? lookWant(n) : [0, 0];
    if (!Number.isFinite(yaw)) yaw = 0; if (!Number.isFinite(pitch)) pitch = 0; if (!Number.isFinite(a.look)) a.look = 0; if (!Number.isFinite(a.lookP)) a.lookP = 0;   /* a look at a point that is not there (the player before the game sets them, a lone sitter with no mate) once gave NaN and the head vanished (Windrush) */
    if (Math.abs(yaw) > 1.9) yaw = 0; yaw = Math.max(-O.lookYaw, Math.min(O.lookYaw, yaw)); pitch = Math.max(-O.lookPitch, Math.min(O.lookPitch, pitch));
    const k = Math.min(1, dt * 3), lim = dt * 3.5; a.look += Math.max(-lim, Math.min(lim, (yaw - a.look) * k)); a.lookP += (pitch - a.lookP) * k;   /* at most 200 degrees a second: a look that swaps sides (the player passing behind) turned the head faster than a person does */
    let nod = 0; if (a.nod > 0) { a.nod = Math.max(0, a.nod - dt); nod = Math.sin((0.7 - a.nod) / 0.7 * Math.PI * 2) * 0.12 * (a.nod > 0 ? 1 : 0); }
    const ry = n.m.rotation.y; _ax.set(Math.cos(ry), 0, -Math.sin(ry));   /* the body's side axis: a turn about it nods */
    /* the mixer only writes a bone whose clip value changed since its last update, and a still head track (Idle) is written once:
       start from the clip's pose again, or each frame's turn adds to the last one and the head spins round (Selassie, November 2026) */
    const hq = a.hq || (a.hq = [b.neck, b.head].map(() => ({ base: new THREE.Quaternion(), after: new THREE.Quaternion(10, 0, 0, 0) })));
    lookBegin([b.neck, b.head]);   /* start from the clip's own pose (engine/anim.js) */
    /* the look and the clip's own head turn together stay within a person's reach (owner, 18 November 2026: a neighbour in Selassie's lane looked back
       at you over a shoulder the clip had already turned, the head right round): the clip's turn from the hips is measured and the look is cut to fit */
    const cy = clipYaw(n.m, b.head), L = O.headMax; const look = Math.max(-L - cy, Math.min(L - cy, a.look));
    turnBone(b.neck, UP, look * 0.4); turnBone(b.head, UP, look * 0.6); turnBone(b.head, _ax, a.lookP + nod);
    /* the clip and the look together: a fast clip (HeadTurn, Cheer, WipeSweat) or a clip change on top of a look snapped the head round at
       300 to 1,400 degrees a second (Kendal, Selassie checks). Neck and head each move at most about 140 degrees a second, so the head never spins */
    const maxA = Math.max(0.02, dt * 2.4);
    [b.neck, b.head].forEach((bone, i) => { if (!bone) return; const h = hq[i]; if (h.shown && dt > 0 && dt < 0.5) { _tq.copy(bone.quaternion); if (h.shown.angleTo(_tq) > maxA) bone.quaternion.copy(h.shown).rotateTowards(_tq, maxA); } (h.shown || (h.shown = new THREE.Quaternion())).copy(bone.quaternion); });
    lookEnd([b.neck, b.head]);
  }

  /* ---------- detail by distance (phones) ---------- */
  function levels() {
    const list = people.map((n) => [Math.hypot(W.px - n.x, W.pz - n.z), n]).sort((p, q) => p[0] - q[0]); let full = 0;
    for (const [d, n] of list) { const a = n.amb; let lv = d < O.full && full < O.maxFull ? 0 : d < O.mid ? 1 : d < O.cull ? 2 : 3; if (lv === 0) full++; a.level = lv; a.dist = d;
      const lo = n.lo && lv >= 2 && d >= O.far; if (n.lo) { n.lo.visible = lo && lv < 3 && !a.gone; } if (n.m && (a.ownVis || lv === 3 || a.gone || n.lo)) { a.ownVis = true; n.m.visible = lv < 3 && !lo && !a.gone; } }
  }
  /* in a sad scene, some lively people go away, only while nobody can see them go */
  function seen(n) { const v = W.view; if (!v) return Math.hypot(W.px - n.x, W.pz - n.z) < 30; const dx = n.x - v.x, dz = n.z - v.z, L = Math.hypot(dx, dz) || 1; return L < 40 && (dx * -Math.sin(v.yaw) + dz * -Math.cos(v.yaw)) / L > 0.2; }
  function moodShow(n) { const a = n.amb, lively = a.kind === 'play' || a.kind === 'wander' || a.kind === 'chat', out = lively && a.hide < M().hide && !a.spec.stay; if (out === !!a.gone || seen(n)) return; a.gone = out; a.ownVis = true; if (n.m) n.m.visible = !out; }

  life.ready = () => { for (const g of groups.values()) if (!g.ready) arrange(g); };
  /* someone standing in the player's way steps aside (wanderers, errands and children; groups and workers keep their place and the game's collision stops the player) */
  function makeWay(n, dt) {
    const a = n.amb; if (!/^(wander|errand|play)$/.test(a.kind) && !a.spec.between) return false; if (a.walking || a.st === 'aside' || a.st === 'pick') return false;
    const dp = Math.hypot(W.px - n.x, W.pz - n.z), vx = W.vx || 0, vz = W.vz || 0, pv = Math.hypot(vx, vz); if (dp > O.space + 0.15 || pv < 0.3 || (vx * (n.x - W.px) + vz * (n.z - W.pz)) < 0.5 * pv * dp) return false;
    for (const k of [1, -1]) { const x = n.x + (-vz / pv) * k * 0.9, z = n.z + (vx / pv) * k * 0.9; if (solidFree(x, z, a.r) && !onKeepOff(keepOff(), x, z, a.r) && Math.hypot(x - W.px, z - W.pz) > dp) { a.st = 'aside'; a.route = [[x, z]]; a.goal = [x, z]; startWalk(n); a.st = 'aside'; return true; } }
    return false;
  }
  /* ---------- the tick ---------- */
  life.tick = (dt, world = {}) => {
    const pp = W; W = { px: 1e6, pz: 1e6, ...world }; if (!Number.isFinite(W.px)) W.px = 1e6; if (!Number.isFinite(W.pz)) W.pz = 1e6;   /* loading callers may explicitly pass undefined; never turn a body toward NaN */ if (pp.px !== undefined && pp.px < 1e5 && dt > 0) { W.vx = (W.px - pp.px) / dt; W.vz = (W.pz - pp.pz) / dt; } life.t += dt; life.ready(); frame++; lodT -= dt; if (lodT <= 0) { lodT = 0.25; levels(); for (const n of people) moodShow(n); }
    for (const n of people) {
      const a = n.amb; if (a.gone) continue;
      a.t -= dt; a.clipT += dt; if (a.glance && (a.glance.t -= dt) <= 0) a.glance = null;
      if (a.held || W.talking === n) { if (a.walking) stand(n, idleFor(n)); if (n.m && W.talking === n) { a.turnTo = Math.atan2(W.px - n.x, W.pz - n.z); turnStep(n, dt, 3); } }
      else if (a.st === 'aside' || makeWay(n, dt)) { if (walkStep(n, dt)) { if (onKeepOff(keepOff(), n.x, n.z, a.r)) { a.st = 'start'; a.t = 0; stand(n); } else pause(n, 0.8, 2); } if (a.st === 'stuck') pause(n, 0.5, 1); }   /* stepped aside onto a story path: walk on at once */
      else { const f = B[a.kind] || B.watch; if (a.st === 'stuck') { a.st = 'start'; a.t = 0; } f(n, dt); if (!a.walking && a.turnTo !== undefined && a.st !== 'turn') turnStep(n, dt, 1.6); }
      if (n.m) { if (O.place) O.place(n); else { n.m.position.x = n.x; n.m.position.z = n.z; } if (n.lo) { n.lo.position.copy(n.m.position); n.lo.rotation.y = n.m.rotation.y; } }
      /* the body: mixer, grips, head and feet, as often as the distance allows */
      a.acc += dt; const every = a.level === 0 ? 1 : a.level === 1 ? O.midEvery : O.farEvery; if ((frame + a.n0) % every !== 0 || a.level === 3) continue;
      const body = n.lo && n.lo.visible ? n.lo : n.m, c = body && body.userData.anim; if (!body) { a.acc = 0; continue; }
      if (O.mixers && c) { c.mx.update(a.acc); if (c.tick) c.tick(a.acc); }
      if (body.userData.grips) gripTick(body);
      // The same body may stay visible when it leaves the nearest tier. Ease out its look as the mixer keeps playing.
      if (body === n.m && (a.level === 0 || a.hq)) headTick(n, a.acc, a.level === 0);
      if (O.ground && !body.userData.noGround) groundFeet(body);
      a.acc = 0;
    }
  };

  /* ---------- setup lines: what is wrong before anyone moves (part of the check) ---------- */
  life.issues = () => {
    life.ready(); const out = [], K = keepOff(), name = (n) => n.id || n.base || '?', pt = (p) => `(${p[0].toFixed(1)},${p[1].toFixed(1)})`;
    for (const n of people) {
      const a = n.amb, s = a.spec, id = name(n), seat = n.m && n.m.userData.seatAnchor;
      const spots = [];
      if (a.kind === 'wander' || a.kind === 'play') (s.pts || []).forEach((p) => spots.push(['a wander point', p]));
      if (a.kind === 'errand' || (a.kind === 'work' && s.between)) { const e = s.between || [s.from, s.to]; spots.push(['one end', e[0]], ['the other end', e[1]]); if (e[0] && e[1] && !lineFree(e[0], e[1], a.r * 0.8) && !((O.walls || []).length && walkRoute(e[0], e[1], O.walls, a.r - 0.02, O.bounds).length)) out.push(`${id} has no way between ${pt(e[0])} and ${pt(e[1])}`); }
      if (/^(chat|work|watch|sit)$/.test(a.kind) && !s.between) spots.push(['their spot', [n.x, n.z]]); else spots.push(['where they start', [n.x, n.z]]);
      for (const [what, p] of spots) { if (!p) { out.push(`${id} (${a.kind}) is missing ${what}`); continue; } if (a.kind !== 'sit' && !solidFree(p[0], p[1], a.r * 0.8)) out.push(`${id}: ${what} ${pt(p)} is inside something solid`); if (onKeepOff(K, p[0], p[1], a.r)) out.push(`${id}: ${what} ${pt(p)} is on a story path`); }
      if (s.area) { const ar = s.area; if (ar[2] - ar[0] < 1.5 || ar[3] - ar[1] < 1.5) out.push(`${id}: the ${a.kind} area is too small to walk in`); }
      const named = [s.clip, ...(s.clips || []), s.walk, s.idle, s.pick, ...(s.react || []), ...(s.idles || []), ...(s.joy || []), ...(s.talks || [])].filter(Boolean);
      for (const c of named) if (!has(n, c)) out.push(`${id} asks for the clip ${c}, which this game does not ship (add it to anim-clips.json)`);
      const holds = !!(s.prop || s.show || (n.m && ((n.m.userData.held || []).length || (n.m.userData.grips || []).some((g) => g.wrap)) || (n.props && n.props.length)));
      for (const c of named) if (PROP.test(c) && !holds && !(s.drop && /Walk$|^Carry$/.test(c))) out.push(`${id} plays ${c} with nothing in the hand (grip a prop, or set spec.prop)`);
      if (a.kind === 'sit' && !seat) out.push(`${id} sits with no seat (give spec.seat or a seatAnchor)`);
      if (a.kind !== 'sit' && seat) out.push(`${id} has a seat but a standing behaviour (${a.kind})`);
      if (a.kind === 'chat' && (!a.g || a.g.members.length < 2)) out.push(`${id} chats alone: give two or three people the same group`);
      if (a.kind === 'chat' && a.g && a.g.members.length > 4) out.push(`${id}: chat group ${a.g.id} has ${a.g.members.length} people (two to four look natural)`);
      if (!ctlOf(n)) out.push(`${id} has no animation controller`);
    }
    return out;
  };
  return life;
}

/* ---------- the check (?test=ambient) ----------
   ambientCheck(life, opts) runs every ambient person for opts.seconds (60) at opts.dt (1/30) without drawing, with the player standing at
   opts.start or walking opts.route ([[x, z], ...], stopping at people the way the game's collision does), and returns { lines, stats }:
     inside   standing in a solid (opts.blocked, the walls, the bounds)
     overlap  two people (or a person and the player) closer than their two body radii
     slide    walking at a speed the clip's pace does not match (more than 25 % off for over 0.3 s), moving on a standing clip, or walking sideways
     still    in a lively scene, on an idle clip with no step, turn or clip change for longer than opts.still seconds (12)
     story    standing on a story path (opts.keepOff) or within a metre of a story person for over a second
   plus the setup lines from life.issues(). ambientTest(life, opts) returns the report as text that starts with "AMBIENT <count>". */
export function ambientCheck(life, opts = {}) {
  const O = life.opts, seconds = opts.seconds || 60, dt = opts.dt || 1 / 30, still = opts.still || O.still, stride = opts.stride || O.stride;
  const blocked = (x, z, r) => { const B = O.bounds; if (B && (x < B.x0 || x > B.x1 || z < B.z0 || z > B.z1)) return true; if ((O.walls || []).some((w) => inRect(w, x, z, r * 0.6))) return true; return !!(O.blocked && O.blocked(x, z, r * 0.6)); };
  const route = opts.route || null, P = route ? route[0].slice() : (opts.start ? opts.start.slice() : [1e6, 1e6]); let ri = 1, wait = 0;
  const S = new Map(), lines = new Set(), K = () => (typeof O.keepOff === 'function' ? O.keepOff() : O.keepOff) || [], storyP = () => (opts.story ? (typeof opts.story === 'function' ? opts.story() : opts.story) : []);
  const fmt = (x, z) => `(${x.toFixed(1)},${z.toFixed(1)})`, name = (n) => n.id || n.base || '?';
  for (const l of life.issues()) lines.add(l);
  for (const n of life.people) S.set(n, { x: n.x, z: n.z, ry: n.m ? n.m.rotation.y : 0, clip: n.amb.clip, stillT: 0, stillWorst: 0, slideT: 0, slideWorst: 0, slideWhy: '', keepT: 0, moved: 0, walkT: 0, seen: 0 });
  const steps = Math.round(seconds / dt);
  const NEAR = new Map();   /* the nearest each two people came (for the look-alike check) */
  for (let f = 0; f < steps; f++) {
    if (route && ri < route.length) {   /* the player walks the route at 2 m/s, and stops at people (the game's collision) */
      if (wait > 0) wait -= dt; else { const t = route[ri], d = Math.hypot(t[0] - P[0], t[1] - P[1]), sp = Math.min(d, 2 * dt), x = P[0] + (t[0] - P[0]) / (d || 1) * sp, z = P[1] + (t[1] - P[1]) / (d || 1) * sp;
        if (!life.people.some((n) => n.m && n.m.visible !== false && !n.amb.gone && Math.hypot(n.x - x, n.z - z) < n.amb.r + 0.3 && Math.hypot(n.x - x, n.z - z) < Math.hypot(n.x - P[0], n.z - P[1]))) { P[0] = x; P[1] = z; }
        if (d < 0.05) { ri++; if (opts.stops && opts.stops.includes(ri - 1)) wait = 2.5; } }
    }
    life.tick(dt, { px: P[0], pz: P[1], story: storyP(), view: opts.view ? opts.view(P) : null });
    const live = life.people.filter((n) => n.m && n.m.visible !== false && !n.amb.gone), lively = life.mood() === 'lively';
    for (const n of live) {
      const s = S.get(n), a = n.amb, v = Math.hypot(n.x - s.x, n.z - s.z) / dt, ry = n.m ? n.m.rotation.y : 0; s.seen++; s.moved += v * dt;
      if (blocked(n.x, n.z, a.r) && a.kind !== 'sit') lines.add(`inside: ${name(n)} stands inside something at ${fmt(n.x, n.z)}`);
      /* slide: the clip's own ground speed against the real one */
      let why = ''; const c = n.ctl || n.m.userData.anim, act = c && c.cur, cn = a.clip;
      if (a.walking && act) { s.walkT += dt; const sd = stride ? stride(n, cn) : strideOf(n.m, act.getClip()); if (sd > 0.05) { const want = sd * act.timeScale / act.getClip().duration; if (Math.abs(v - want) > 0.08 + want * 0.25) why = `walks at ${v.toFixed(2)} m/s on ${cn} paced for ${want.toFixed(2)} m/s`; }
        if (v > 0.3 && Math.abs(wrap(Math.atan2(n.x - s.x, n.z - s.z) - ry)) > 1.0) why = `walks sideways or backwards on ${cn}`; }
      else if (v > 0.1) why = `moves ${v.toFixed(2)} m/s on a standing clip (${cn || 'none'})`;
      if (why) { s.slideT += dt; if (s.slideT > s.slideWorst) { s.slideWorst = s.slideT; s.slideWhy = why + ' at ' + fmt(n.x, n.z); } } else s.slideT = 0;
      /* still: nothing visible changes */
      const headMoved = Math.abs(a.look - (s.lookRef || 0)) > 0.25; if (headMoved) s.lookRef = a.look;   /* a head that turns to look about counts as life */
      const changed = v * dt > 0.004 || Math.abs(wrap(ry - s.ry)) > 0.002 || cn !== s.clip || (cn && !IDLE.test(cn)) || headMoved;
      if (changed) s.stillT = 0; else { s.stillT += dt; s.stillWorst = Math.max(s.stillWorst, lively ? s.stillT : 0); }
      /* story: standing on a story path or next to a story person */
      const onPath = v < 0.05 && (onKeepOff(K(), n.x, n.z, 0) || storyP().some((o) => o && Math.hypot(o.x - n.x, o.z - n.z) < 1.0));
      if (onPath) { s.keepT += dt; if (s.keepT > 1) lines.add(`story: ${name(n)} (${a.kind}${a.st ? ', ' + a.st : ''}) stands on a story path or by a story person at ${fmt(n.x, n.z)}`); } else s.keepT = 0;
      s.x = n.x; s.z = n.z; s.ry = ry; s.clip = cn;
    }
    for (let i = 0; i < live.length; i++) { const p = live[i], pa = p.amb, sitA = pa.kind === 'sit';
      for (let j = i + 1; j < live.length; j++) { const q = live[j], need = (pa.r + q.amb.r) * (sitA && q.amb.kind === 'sit' ? 0.8 : 1), d = Math.hypot(p.x - q.x, p.z - q.z); { let M = NEAR.get(p); if (!M) NEAR.set(p, (M = new Map())); if (!(M.get(q) <= d)) M.set(q, d); } if (d < need - 0.02) lines.add(`overlap: ${name(p)} and ${name(q)} are ${(d * 100).toFixed(0)} cm apart at ${fmt(p.x, p.z)}`); }
      const dp = Math.hypot(P[0] - p.x, P[1] - p.z); if (dp < pa.r + 0.2) lines.add(`overlap: ${name(p)} walked into the player at ${fmt(p.x, p.z)}`); }
  }
  const stats = [];
  for (const n of life.people) { const s = S.get(n), id = name(n);
    if (s.slideWorst > 0.3) lines.add(`slide: ${id} ${s.slideWhy} for ${s.slideWorst.toFixed(1)} s`);
    if (s.stillWorst > still) lines.add(`still: ${id} (${n.amb.kind}) stood with nothing changing for ${s.stillWorst.toFixed(1)} s`);
    stats.push(`${id}: ${n.amb.kind}, walked ${s.moved.toFixed(1)} m (${s.walkT.toFixed(0)} s), longest still ${s.stillWorst.toFixed(1)} s, seen ${s.seen} frames`); }
  /* look-alikes (17 November 2026): two people of one body share one face. Two of them within 2.5 m of each other read as twins, and with nearly the same clothes
     colours as the same person twice (engine/faces.js faceCheck). Measured at the nearest the two came in the whole run, so people who walk about and meet count. */
  /* seated people (owner, 17 November 2026: elders on a bench looked as if they floated): each sitter is judged against the seat under them, with the
     place's solid shapes and no people in them (engine/audit.js auditSeated: height, cutting in, the front and back edges) */
  const sitters = life.people.filter((n) => n.m && n.m.visible !== false && !n.amb.gone && n.amb.kind === 'sit'), root = sitters.length && (opts.place || (() => { let r = sitters[0].m; while (r.parent) r = r.parent; return r === sitters[0].m ? null : r; })());   /* opts.place: the place's own group, when the people are not in it */
  if (root) { const shown = life.people.filter((n) => n.m && n.m.visible !== false); shown.forEach((n) => (n.m.visible = false)); for (const n of sitters) n.m.updateMatrixWorld(true); const snap = opts.snap || snapMeshes(root, { shown: true });   /* shown: a game with every place in one scene hides all but one; the hidden places' furniture stood where these seats are and was counted (Garvey's Liberty Hall, 17 November 2026) */   /* opts.snap: the place's shapes taken before the game merged them (a merged mesh of many seats is no seat to measure) */ shown.forEach((n) => (n.m.visible = true));
    for (const n of sitters) for (const l of auditSeated(name(n), n.m, snap, n.m.userData.ground || 0, stats)) lines.add('seat: ' + l); }
  for (const l of faceCheck(life.people.filter((n) => n.m && n.m.visible !== false), { dist: (p, q) => { const a = NEAR.get(p), b = NEAR.get(q), d = a && a.has(q) ? a.get(q) : b && b.has(p) ? b.get(p) : undefined; return d === undefined ? Math.hypot(p.x - q.x, p.z - q.z) : d; } })) lines.add(l);
  return { lines: [...lines], stats };
}
export function ambientTest(life, opts = {}) { const r = ambientCheck(life, opts); return [`AMBIENT ${r.lines.length}`, ...r.lines, '', ...r.stats].join('\n'); }
