/* engine/follow.js: people who walk with the player, the same way in every game.
   Three kinds, each set up with one call, all moved by one tick a frame:
     follow(n, opts)          someone who comes with you (a child holding your hand, a grandmother, a friend). They walk a comfortable way behind you and to one side,
                              in your own footsteps, so they come round corners and through gates the way you did. With opts.path they keep to that path instead (a narrow trail).
     lead(n, path, opts)      a guide who walks ahead of you along a path. If you fall behind they stop, turn and wait for you (with a small wave if the body has one),
                              and walk on when you catch up.
     goTo(n, x, z, opts)      someone sent to a spot: they walk there round walls and solid things (engine/placement.js walkRoute, or opts.route), then stop and call opts.done(n).
     stop(n)                  the story says they stop: they stand where they are.
     tick(n, dt, world)       call once a frame for each person whose n.fol is set. world says where you are and what is solid (see below).
   The rules every game gets:
     - personal space: a follower never comes closer than opts.space (about 0.9 m, less for a small child). If you walk back into them they step aside.
     - nothing solid: they never step into a wall, a tree, a hut, a rock or another person. world.blocked(x, z, r) says where a person may not stand.
     - pace: they walk at a speed that fits the gap (ctl.pace, so feet do not slide), and run only to catch up, and only if the body has a Run clip.
     - when you stop, they stop a step later and turn to face you. They do not shuffle stop-start: once walking they keep on until they arrive.
     - stuck or left far behind: they reappear at a free spot behind you, out of your view when that is possible, never inside anything.
   n is the game's person: { x, z, m (the body), ctl (its engine/anim.js controller) }. The tick sets n.x, n.z, n.walking, n.clip and the body's turn; the
   body's height belongs to the game: give world.place(n) (land with hills), or the tick sets m.position.x and z and leaves y to groundFeet.
   world: { px, pz (you), blocked(x, z, r) (true where a person may not stand), walls ([[x0, z0, x1, z1]] for routes round furniture), bounds,
            others ([people] to keep clear of), talking (the person you are talking to: they wait), view ({ x, z, yaw } of the camera), place(n) } */
import { walkRoute, segmentHitsWall } from './placement.js';
import { strideOf, MAX_WALK_RATE } from './anim.js';

/* ---------- paths: a list of points [x, z, ...] (anything after z is ignored) ---------- */
export function pathLen(path) { let s = 0; for (let i = 1; i < path.length; i++) s += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); return s; }
/* the point s metres along the path, moved `side` metres to one side; heading is the way the path runs there (as a body's rotation.y) */
export function pathPoint(path, s, side = 0) {
  let i = 1, at = 0; s = Math.max(0, s); for (; i < path.length; i++) { const L = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); if (at + L >= s || i === path.length - 1) break; at += L; }
  i = Math.min(i, path.length - 1); const a = path[i - 1], b = path[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, t = Math.max(0, Math.min(1, (s - at) / L)), hd = Math.atan2(b[0] - a[0], b[1] - a[1]);
  return [a[0] + (b[0] - a[0]) * t + Math.cos(hd) * side, a[1] + (b[1] - a[1]) * t - Math.sin(hd) * side, hd];
}
/* how far along the path the point nearest to (x, z) is */
export function pathS(path, x, z) { let b = 1e9, s = 0, out = 0; for (let i = 1; i < path.length; i++) { const ax = path[i - 1][0], az = path[i - 1][1], dx = path[i][0] - ax, dz = path[i][1] - az, L = Math.hypot(dx, dz) || 1, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (L * L))), k = Math.hypot(x - ax - dx * t, z - az - dz * t); if (k < b) { b = k; out = s + t * L; } s += L; } return out; }
/* every spot a person on this path can stand, from s0 to s1, `step` metres apart: for the place audit (engine/audit.js, place.routes) */
export function pathSpots(path, s0 = 0, s1 = Infinity, side = 0, step = 0.3) { const out = [], end = Math.min(s1, pathLen(path)); for (let s = Math.max(0, s0); s <= end + 1e-6; s += step) { const [x, z] = pathPoint(path, s, side); out.push([x, z]); } return out; }

/* ---------- setting people up ---------- */
const DEF = { gap: 1.5, side: 0.55, space: 0.9, walk: 1.15, run: true, far: 16, wait: 7, resume: 4.5, ahead: 4, wave: true, r: 0.25 };
export function follow(n, opts = {}) { n.fol = { mode: 'follow', ...DEF, ...opts, crumbs: [], hdg: null, still: 0, stuckT: 0, lastX: n.x, lastZ: n.z, moving: false }; if (opts.path) { n.fol.len = pathLen(opts.path); n.fol.s = pathS(opts.path, n.x, n.z); } return n.fol; }
export function lead(n, path, opts = {}) { n.fol = { mode: 'lead', ...DEF, ...opts, path, len: pathLen(path), s: pathS(path, n.x, n.z), waiting: false, waved: -99, t: 0, moving: false }; return n.fol; }
export function goTo(n, x, z, opts = {}) { n.fol = { mode: 'go', ...DEF, speed: 1.3, ...opts, to: [x, z], route: opts.route ? opts.route.map((p) => p.slice()) : null, moving: false }; return n.fol; }   /* opts.route: waypoints already checked by the place audit (the last is the spot); otherwise a route round world.walls */
export function stop(n) { if (!n.fol) return; n.fol = null; gait(n, null); }
export const isFollowing = (n) => !!(n && n.fol && n.fol.mode === 'follow');
export const isLeading = (n) => !!(n && n.fol && n.fol.mode === 'lead');

/* ---------- the tick ---------- */
function gait(n, clip, v) { const c = n.ctl || (n.m && n.m.userData.anim); if (!c) return; if (!clip) { if (n.walking) { n.walking = false; n.running = false; n.clip = null; c.play(null); } return; }
  if (!n.walking || n.clip !== clip) { n.walking = true; n.clip = clip; n.running = clip === 'Run'; c.play(clip); } if (v) c.pace(v); }
const hasRun = (n) => { const c = n.ctl || (n.m && n.m.userData.anim); return !!(c && c.get('Run')); };
function gaitSpeed(n, name, want) {
  const ctl = n.ctl || n.m?.userData.anim, clip = ctl?.get(name)?.getClip?.();
  const stride = clip && strideOf(n.m, clip);
  return stride > 0.05 ? Math.min(want, MAX_WALK_RATE * stride / clip.duration) : want;
}
function turn(n, want, dt, k = 5) { const m = n.m; if (!m) return; let e = want - m.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); m.rotation.y += e * Math.min(1, dt * k); }
const facePlayer = (n, W, dt, k = 3) => turn(n, Math.atan2(W.px - n.x, W.pz - n.z), dt, k);
function place(n, W) { if (W.place) W.place(n); else if (n.m) { n.m.position.x = n.x; n.m.position.z = n.z; } }
const freeAt = (W, x, z, r, n) => !(W.blocked && W.blocked(x, z, r)) && !(W.others || []).some((o) => o !== n && o.m && o.m.visible !== false && Math.hypot(o.x - x, o.z - z) < 0.5);   /* 0.5 m: the room the player needs to pass someone */
/* the spot itself if a person may stand there, else the nearest free spot within 40 cm (your footsteps can run along a wall, where a body does not fit) */
function freeNear(W, x, z, r, n) { if (freeAt(W, x, z, r, n)) return [x, z]; for (const d of [0.15, 0.3, 0.4]) for (let a = 0; a < 8; a++) { const px = x + Math.cos(a * 0.785) * d, pz = z + Math.sin(a * 0.785) * d; if (freeAt(W, px, pz, r, n)) return [px, pz]; } return null; }
/* a straight walk from a to b is clear: no wall rectangle and no blocked spot along it */
function clear(W, a, b, r, n) { if ((W.walls || []).some((w) => segmentHitsWall(a, b, w, r))) return false; const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / 0.25)); for (let i = 1; i <= k; i++) { const x = a[0] + (b[0] - a[0]) * i / k, z = a[1] + (b[1] - a[1]) * i / k; if (W.blocked && W.blocked(x, z, r)) return false; } return true; }
/* one step toward (tx, tz) at speed v: never into a blocked spot or another person, never inside your personal space */
function stepTo(n, tx, tz, v, dt, W, keepOut) {
  const dx = tx - n.x, dz = tz - n.z, d = Math.hypot(dx, dz), f = n.fol; if (d < 1e-4) return 0; const sp = Math.min(d, v * dt), k = f.detour || 1;   /* round something in the way: keep to one side until past it, no dithering */
  for (const a of [0, 0.5 * k, 1.0 * k, 1.5 * k, -0.5 * k, -1.0 * k, -1.5 * k]) { const c = Math.cos(a), s = Math.sin(a), ux = (dx * c - dz * s) / d, uz = (dx * s + dz * c) / d, x = n.x + ux * sp, z = n.z + uz * sp;
    if (keepOut && Math.hypot(x - W.px, z - W.pz) < keepOut && Math.hypot(x - W.px, z - W.pz) < Math.hypot(n.x - W.px, n.z - W.pz)) continue;
    if (!freeAt(W, x, z, f.r, n)) continue; n.x = x; n.z = z; f.detour = a === 0 ? f.detour : Math.sign(a); if (a === 0) f.clearT = (f.clearT || 0) + dt; else f.clearT = 0; if (f.clearT > 1) f.detour = 0; return sp; }
  return 0;
}
export function tick(n, dt, W) {
  const f = n.fol; if (!f || !n.m || n.m.visible === false) return;
  if (W.talking === n) { gait(n, null); facePlayer(n, W, dt, 4); return; }
  if (f.mode === 'follow') (f.path ? followPath : followFree)(n, f, dt, W); else if (f.mode === 'lead') leadTick(n, f, dt, W); else goTick(n, f, dt, W);
  place(n, W);
}
const speedFor = (n, f, lag) => { const k = Math.sqrt((n.m && n.m.scale.y) || 1); return Math.max(0.55 * k, Math.min(5.2, f.walk * k * (0.85 + Math.max(0, lag) * 0.45))); };
const clipFor = (n, f, v) => (f.run && v > (n.running ? 2.0 : 2.4) * Math.sqrt((n.m && n.m.scale.y) || 1) && hasRun(n) ? 'Run' : 'Walk');
/* someone who comes with you, anywhere you walk */
function followFree(n, f, dt, W) {
  const C = f.crumbs, last = C[C.length - 1]; if (!last || Math.hypot(W.px - last[0], W.pz - last[1]) > 0.25) { if (last) f.hdg = Math.atan2(W.px - last[0], W.pz - last[1]); C.push([W.px, W.pz]); if (C.length > 300) C.shift(); }
  const d = Math.hypot(W.px - n.x, W.pz - n.z), pvx = f.ppx === undefined ? 0 : (W.px - f.ppx) / (dt || 1), pvz = f.ppz === undefined ? 0 : (W.pz - f.ppz) / (dt || 1), pv = Math.hypot(pvx, pvz); f.ppx = W.px; f.ppz = W.pz;
  const coming = pv > 0.3 && (pvx * (n.x - W.px) + pvz * (n.z - W.pz)) > 0.4 * pv * d;   /* you are walking toward them */
  if (d < f.space || (coming && d < f.space + 0.2 + pv * 0.45)) {   /* you walked (or are walking) into them: they step aside, across your way rather than in front of you, to a free spot */
    const hx = pv > 0.3 ? pvx / pv : (n.x - W.px) / (d || 1), hz = pv > 0.3 ? pvz / pv : (n.z - W.pz) / (d || 1), side = (hx * (n.z - W.pz) - hz * (n.x - W.px)) >= 0 ? 1 : -1, want = f.space + 0.35; let moved = false;
    const cands = []; for (const k of [side, -side]) cands.push([n.x - hz * k * want, n.z + hx * k * want], [W.px - hz * k * want, W.pz + hx * k * want]);   /* to the side of your way that they are already on, then the other side */ for (const a of [0, 0.7, -0.7, 1.4, -1.4]) { const c = Math.cos(a), s = Math.sin(a), ax = (n.x - W.px) / (d || 1), az = (n.z - W.pz) / (d || 1); cands.push([W.px + (ax * c - az * s) * want, W.pz + (ax * s + az * c) * want]); }
    for (const [x, z] of cands) { if (!freeAt(W, x, z, f.r, n) || Math.hypot(x - W.px, z - W.pz) < f.space) continue; const want = Math.max(1.3, pv * 1.25), clip = want > 2.6 && f.run && hasRun(n) ? 'Run' : 'Walk', v = gaitSpeed(n, clip, want); if (stepTo(n, x, z, v, dt, W, 0) > 0) { gait(n, clip, v); turn(n, Math.atan2(x - n.x, z - n.z), dt, 8); moved = true; break; } }
    if (!moved) { gait(n, null); facePlayer(n, W, dt); } f.moving = moved; return; }
  /* the spot to walk to: in your footsteps `gap` metres back, and to one side if that side is free */
  let back = f.gap, i = C.length - 1, sx = W.px, sz = W.pz, hd = f.hdg ?? Math.atan2(W.px - n.x, W.pz - n.z);
  for (; i > 0 && back > 0; i--) { const L = Math.hypot(C[i][0] - C[i - 1][0], C[i][1] - C[i - 1][1]); if (L >= back) { const t = back / L; sx = C[i][0] + (C[i - 1][0] - C[i][0]) * t; sz = C[i][1] + (C[i - 1][1] - C[i][1]) * t; hd = Math.atan2(C[i][0] - C[i - 1][0], C[i][1] - C[i - 1][1]); back = 0; break; } back -= L; sx = C[i - 1][0]; sz = C[i - 1][1]; }
  if (back > 0) { sx = W.px + (n.x - W.px) / (d || 1) * Math.min(d, f.gap); sz = W.pz + (n.z - W.pz) / (d || 1) * Math.min(d, f.gap); }   /* not enough footsteps yet: stay on this side of you */
  { const c = freeNear(W, sx, sz, f.r, n); if (c) { sx = c[0]; sz = c[1]; } }
  let tx = sx, tz = sz; const ox = Math.cos(hd) * f.side, oz = -Math.sin(hd) * f.side;
  for (const k of [1, -1]) { const x = sx + ox * k, z = sz + oz * k; if (freeAt(W, x, z, f.r, n) && clear(W, [sx, sz], [x, z], f.r, n)) { tx = x; tz = z; break; } }
  const togo = Math.hypot(tx - n.x, tz - n.z), lag = d - f.gap;
  f.pt = (f.pt || 0) + dt; if (f.pt >= 1) { const prog = Math.hypot(n.x - (f.p0x ?? n.x), n.z - (f.p0z ?? n.z)); f.stuckT = prog < 0.3 && lag > 1.5 ? f.stuckT + f.pt : 0; f.p0x = n.x; f.p0z = n.z; f.pt = 0; }   /* stuck: under 30 cm of real progress a second while you are getting away */
  if (d > f.far || (f.stuckT >= 2.5 && lag > 1.5)) { if (rescue(n, f, W)) { f.stuckT = 0; gait(n, null); return; } }
  const go = f.moving ? togo > 0.2 && d > f.space + 0.15 : togo > 0.75 || lag > 0.8;   /* once walking they keep on until they arrive: no stop-start shuffle */
  if (!go) { f.moving = false; f.stuckT = 0; gait(n, null); if (d < 9) facePlayer(n, W, dt); return; }
  /* the way there: straight if nothing is in the way, else along your footsteps (you walked there, so it is open) */
  let wx = tx, wz = tz; if (!clear(W, [n.x, n.z], [tx, tz], f.r, n)) { let bi = -1, bd = 1e9; for (let j = 0; j < C.length; j++) { const k = Math.hypot(C[j][0] - n.x, C[j][1] - n.z); if (k < bd) { bd = k; bi = j; } } for (let j = C.length - 1; j > bi; j--) if (Math.hypot(C[j][0] - n.x, C[j][1] - n.z) < bd + 0.6) { bi = j; break; }   /* where you walked the same ground twice, take your latest footsteps, not the old ones that lead back */ if (bi >= 0) { let j = bi; while (j < C.length - 1 && Math.hypot(C[j][0] - n.x, C[j][1] - n.z) < 0.35) j++; const c = freeNear(W, C[j][0], C[j][1], f.r, n) || C[j]; wx = c[0]; wz = c[1]; } }
  const want = speedFor(n, f, lag), clip = clipFor(n, f, want), v = gaitSpeed(n, clip, want);
  const moved = stepTo(n, wx, wz, v, dt, W, f.space);
  if (moved > 0) { f.moving = true; gait(n, clip, v); turn(n, Math.atan2(wx - n.x, wz - n.z) || n.m.rotation.y, dt, 7); } else { gait(n, null); facePlayer(n, W, dt); }
}
/* reappear at a free spot behind you, out of the camera's view if possible */
function rescue(n, f, W) {
  const C = f.crumbs, cand = []; let acc = 0; for (let i = C.length - 1; i > 0 && acc < f.gap + 5; i--) { acc += Math.hypot(C[i][0] - C[i - 1][0], C[i][1] - C[i - 1][1]); if (acc >= f.gap) cand.push(C[i - 1]); }
  for (let a = 0; a < 12; a++) cand.push([W.px + Math.sin(a / 12 * 6.283) * (f.gap + 0.3), W.pz + Math.cos(a / 12 * 6.283) * (f.gap + 0.3)]);
  const seen = (x, z) => { if (!W.view) return false; const fx = -Math.sin(W.view.yaw), fz = -Math.cos(W.view.yaw), dx = x - W.view.x, dz = z - W.view.z, L = Math.hypot(dx, dz) || 1; return (dx * fx + dz * fz) / L > 0.35; };
  const ok = cand.map(([x, z]) => freeNear(W, x, z, f.r, n)).filter((c) => c && Math.hypot(c[0] - W.px, c[1] - W.pz) >= f.space);
  const best = ok.find(([x, z]) => !seen(x, z)) || ok[0]; if (!best) return false; n.x = best[0]; n.z = best[1]; return true;
}
/* someone who comes with you along a path (a narrow trail): they keep `gap` metres behind you on it, never in your personal space */
function followPath(n, f, dt, W) {
  const sp = pathS(f.path, W.px, W.pz), want = Math.max(f.min || 0, Math.min(f.max ?? f.len, sp - f.gap)), diff = want - f.s, gap = Math.abs(diff), d = Math.hypot(W.px - n.x, W.pz - n.z);
  if (d > f.far && diff > 0) { f.s = want; const [x, z] = pathPoint(f.path, f.s, f.side); n.x = x; n.z = z; gait(n, null); return; }
  pathMove(n, f, diff, gap, dt, W, sp);
}
/* a guide who walks ahead of you along a path, and waits when you fall behind */
function leadTick(n, f, dt, W) {
  f.t += dt; const sp = pathS(f.path, W.px, W.pz), d = Math.hypot(W.px - n.x, W.pz - n.z), ahead = f.s - sp;
  if (!f.waiting && ahead > 0 && d > f.wait) { f.waiting = true; f.moving = false; gait(n, null); if (f.wave && f.t - f.waved > 8) { const c = n.ctl || n.m.userData.anim; if (c && c.get('Wave')) { c.play('Wave', true); f.waved = f.t; } } }
  if (f.waiting) { if (d < f.resume || ahead <= 0) f.waiting = false; else { facePlayer(n, W, dt, 4); return; } }
  if (f.keepAhead) {
    f.playerStill = sp - (f.playerProgress ?? sp) > .005 ? 0 : (f.playerStill || 0) + dt;
    f.playerProgress = sp;
    f.waitingForPlayer = f.t > .9 && f.playerStill > .22;
    if (f.waitingForPlayer) {
      f.moving = false;
      gait(n, null);
      if (d < 9) facePlayer(n, W, dt);
      return;
    }
  }
  const want = Math.max(f.keepAhead ? f.s : f.min || 0, Math.min(f.max ?? f.len, sp + f.ahead)), diff = want - f.s;
  pathMove(n, f, diff, Math.abs(diff), dt, W, sp);
}
function pathMove(n, f, diff, gap, dt, W, sp) {
  const go = f.moving ? gap > 0.1 : gap > 0.9; if (!go) { f.moving = false; gait(n, null); if (Math.hypot(W.px - n.x, W.pz - n.z) < 9) facePlayer(n, W, dt); return; }
  const v = Math.min(f.maxSpeed ?? (gap > 6 ? 5.4 : 4.0), 0.9 + gap * 1.15) * Math.sqrt((n.m && n.m.scale.y) || 1), run = f.run && hasRun(n) && (v > 3.0 || (n.clip === 'Run' && n.walking && v > 2.5));
  let s = f.s + Math.sign(diff) * Math.min(gap, v * dt); const [x, z, hd] = pathPoint(f.path, s, f.side);
  if (f.mode === 'follow' && Math.hypot(x - W.px, z - W.pz) < f.space && diff > 0) { f.moving = false; gait(n, null); facePlayer(n, W, dt); return; }   /* a follower never walks into you */
  if (f.keepAhead && Math.hypot(x - W.px, z - W.pz) < f.space && Math.hypot(x - W.px, z - W.pz) < Math.hypot(n.x - W.px, n.z - W.pz)) { f.moving = false; gait(n, null); return; }
  if (!freeAt(W, x, z, 0, n) && freeAt(W, n.x, n.z, 0, n)) { gait(n, null); return; }   /* someone is in the way on the path: wait for them */
  f.s = s; n.x = x; n.z = z; f.moving = true; gait(n, run ? 'Run' : 'Walk', v); turn(n, diff > 0 ? hd : hd + Math.PI, dt, 6);
}
/* someone sent to a spot */
function goTick(n, f, dt, W) {
  if (!f.route) { f.route = (W.walls && W.walls.length ? walkRoute([n.x, n.z], f.to, W.walls, f.r - 0.03, W.bounds) : []); if (!f.route.length) f.route = [f.to.slice()]; }
  const to = f.route[0], dx = to[0] - n.x, dz = to[1] - n.z, d = Math.hypot(dx, dz), sp = f.speed * dt;
  if (d <= sp) { n.x = to[0]; n.z = to[1]; f.route.shift(); if (!f.route.length) { gait(n, null); if (f.face !== undefined && n.m) n.m.rotation.y = f.face; const done = f.done; n.fol = null; if (done) done(n); return; } }
  else { n.x += dx / d * sp; n.z += dz / d * sp; gait(n, f.gait || 'Walk', f.speed); turn(n, Math.atan2(dx, dz), dt, 7); }
}

/* ---------- the check (?test=follow): drive the player along a real route and watch each follower and guide ----------
   const w = watch({ space, behind }); every frame after the game's update: w.sample(n, px, pz, blocked). w.lines(id) lists the faults:
     too close   a follower inside the personal space (less than space - 5 cm from you)
     inside      standing where blocked(x, z) is true (a wall, a tree, a hut, a rock)
     behind      a follower more than `behind` metres from you for over 2 seconds of walking
     stuck       a guide that has not moved for 3 seconds while you stand close and the path still goes on ahead of them
   w.spots(id) gives every place they stood, for engine/audit.js auditBodies against the real shapes. */
export function watch({ space = 0.9, behind = 6 } = {}) {
  const S = new Map(), get = (n) => S.get(n) || S.set(n, { close: 1e9, inside: 0, insideAt: null, lag: 0, lagT: 0, lagWorst: 0, stuckT: 0, stuckWorst: 0, frames: 0, pts: [], lx: n.x, lz: n.z }).get(n);
  return {
    sample(n, px, pz, blocked, dt = 1 / 30) { if (!n.m || n.m.visible === false) return; const s = get(n), d = Math.hypot(px - n.x, pz - n.z); s.frames++; if (s.frames % 3 === 0) s.pts.push([n.x, n.z]); if (s.frames % 15 === 0) (s.log || (s.log = [])).push(`${s.frames}: you (${px.toFixed(1)},${pz.toFixed(1)}) them (${n.x.toFixed(1)},${n.z.toFixed(1)}) ${n.walking ? n.clip : 'still'}${n.fol && n.fol.stuckT > 0.5 ? ' stuck ' + n.fol.stuckT.toFixed(1) : ''}`);
      const f = n.fol; if (f && (f.mode === 'follow' || f.keepAhead)) { if (d < s.close) s.closeAt = `frame ${s.frames}, you at (${px.toFixed(1)},${pz.toFixed(1)}), they at (${n.x.toFixed(1)},${n.z.toFixed(1)})`; s.close = Math.min(s.close, d); if (f.mode === 'follow' && d > behind) { s.lagT += dt; if (s.lagT > s.lagWorst) { s.lagWorst = s.lagT; s.lagAt = `frame ${s.frames}, you at (${px.toFixed(1)},${pz.toFixed(1)}), they at (${n.x.toFixed(1)},${n.z.toFixed(1)})`; } } else s.lagT = 0; s.lag = Math.max(s.lag, d); }
      if (blocked && blocked(n.x, n.z)) { s.inside++; s.insideAt = s.insideAt || [n.x, n.z]; }
      if (f && f.mode === 'lead') { const movedNow = Math.hypot(n.x - s.lx, n.z - s.lz) > 1e-3, ahead = (f.max ?? f.len) - f.s; if (!movedNow && d < f.resume && ahead > 1 && !f.waiting && !f.waitingForPlayer) { s.stuckT += dt; s.stuckWorst = Math.max(s.stuckWorst, s.stuckT); } else s.stuckT = 0; }
      s.lx = n.x; s.lz = n.z; },
    lines(n, id) { const s = S.get(n); if (!s) return [`${id}: never seen`]; const out = [];
      if (s.close < space - 0.05) out.push(`${id} came ${(s.close * 100).toFixed(0)} cm from you (personal space ${(space * 100).toFixed(0)} cm): ${s.closeAt}`);
      if (s.inside) out.push(`${id} stood inside something ${s.inside} times, first at (${s.insideAt[0].toFixed(1)},${s.insideAt[1].toFixed(1)})`);
      if (s.lagWorst > 2) out.push(`${id} was more than ${behind} m behind you for ${s.lagWorst.toFixed(1)} s (furthest ${s.lag.toFixed(1)} m): ${s.lagAt}`);
      if (s.stuckWorst > 3) out.push(`${id} stood still for ${s.stuckWorst.toFixed(1)} s while you waited near them`);
      return out; },
    stats(n) { const s = S.get(n); return s ? `closest ${s.close < 1e8 ? s.close.toFixed(2) : '-'} m, furthest ${s.lag.toFixed(1)} m, ${s.frames} frames` : 'not seen'; },
    spots(n) { const s = S.get(n); return s ? s.pts : []; },
    trace(n) { const s = S.get(n); return s && s.log ? s.log : []; },
  };
}

/* drive the player along a route for ?test=follow: move(x, z) asks the game where you end up (its own walls and clamp) and returns [x, z]; step(dt) runs one frame of the game.
   stops: route indexes where you stand still for 2.5 seconds. Each frame every person in `people` is sampled by the watch w. Returns where you ended. */
export function drive({ from, route, speed = 2.3, stops = [], dt = 1 / 30, move, step, people, w, blocked }) {
  let p = from.slice(); const look = () => { for (const n of people) w.sample(n, p[0], p[1], blocked, dt); };
  for (let i = 0; i < route.length; i++) { const [tx, tz] = route[i]; let guard = 0;
    while (Math.hypot(tx - p[0], tz - p[1]) > 0.05 && guard++ < 3000) { const d = Math.hypot(tx - p[0], tz - p[1]), k = Math.min(1, speed * dt / d), q = move(p[0] + (tx - p[0]) * k, p[1] + (tz - p[1]) * k); if (Math.hypot(q[0] - p[0], q[1] - p[1]) < 1e-4) break; p = q; step(dt); look(); }
    if (stops.includes(i)) for (let f = 0; f < 75; f++) { step(dt); look(); } }
  return p;
}
