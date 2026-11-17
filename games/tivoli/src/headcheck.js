/* games/tivoli/src/headcheck.js: ?test=heads (dev builds only, also part of ?test=all as "heads"). Nobody's head spins and nobody spins round on the spot.
   Written after the owner saw heads "spinning 360" (17 November 2026): the story people's head turn (talk.js) was added to itself every frame on
   clips whose neck and head tracks never change, so the head went round and round.
   For every walking chapter it starts the chapter, then runs the game's real update loop with a stepped clock while you walk from the start to each
   person (stopping by them, and talking to them through every line), and on to the end spot; then it runs the May 2010 street scene from start to end.
   Every person on the screen is sampled every frame with the shared engine/audit.js headWatch:
   - a head turned more than 80 degrees from the chest or tipped more than 60 (the game turns a head at most 70 degrees, talk.js HEAD_MAX);
   - a head that goes right round (more than 360 degrees one way on one clip);
   - a head turning faster than 320 degrees a second and faster than its clip turns it on its own (a snap or a spin);
   and the whole body turning faster than 240 degrees a second on the spot or 600 while walking (a spin, not a turn).
   K: { cases() -> [{ label, enter: async () -> route [[x, z], ...], stops: { index: talk id } }], step(dt), people() -> [{ id, m, clip, blend, key, make(clip) }],
        move(x, z, yaw), player() -> { x, z }, talk(id) -> bool (a talk opened), next() -> bool (still talking), done() -> bool (the case has ended) } */
import { headWatch, headAngles } from '../../../engine/audit.js';
import { mixers, WALKS } from '../../../engine/anim.js';

export const LIMIT = { turn: 240, turnWalk: 600 };
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a)), D2R = Math.PI / 180;
const OWN = new Map();
/* how fast a clip moves the head on its own, on a body standing still: a cheer or a look round moves the head quickly; that is the clip, not a spin */
function ownSpeed(p, clip) {
  const key = p.key + '|' + clip; if (OWN.has(key)) return OWN.get(key); let top = 0;
  const b = p.make && p.make(clip);
  if (b) { const c = b.userData.anim, a = c.cur, D = a.getClip().duration, N = Math.max(8, Math.round(D * 30)); let prev = null;
    for (let i = 0; i <= N; i++) { a.time = Math.min(D - 1e-4, D * i / N); c.mx.update(0); const g = headAngles(b); if (prev && g) top = Math.max(top, Math.hypot(wrap((g.yaw - prev.yaw) * D2R), wrap((g.pitch - prev.pitch) * D2R)) / D2R / (D / N)); prev = g; }
    const k = mixers.indexOf(c.mx); if (k >= 0) mixers.splice(k, 1); }
  OWN.set(key, top); return top;
}
export async function headCheck(K, { dt = 1 / 30, still = 2.5, speed = 1.6, max = 120, line = 1.4 } = {}) {
  const lines = [], stats = [];
  for (const C of K.cases()) {
    const route = ((await C.enter()) || []).slice(), w = headWatch({ own: ownSpeed }), turns = new Map(), worst = new Map();
    const add = (key, val, text) => { const o = worst.get(key); if (!o || val > o.val) worst.set(key, { val, text }); };
    let ri = 1, wait = still, t = 0, talkT = 0, talking = false;
    if (route.length) K.move(route[0][0], route[0][1]);
    while (t < max && !K.done() && (route.length ? (ri < route.length || wait > 0 || talking) : true)) {
      if (talking) { talkT -= dt; if (talkT <= 0) { talking = K.next(); talkT = line; } }
      else if (wait > 0) wait -= dt;
      else if (ri < route.length) { const p = K.player(), to = route[ri], d = Math.hypot(to[0] - p.x, to[1] - p.z);
        if (d < 0.08) { ri++; wait = still; const who = C.stops && C.stops[ri - 1]; if (who && K.talk(who)) { talking = true; talkT = line; } }
        else { const k = Math.min(1, speed * dt / d); K.move(p.x + (to[0] - p.x) * k, p.z + (to[1] - p.z) * k, Math.atan2(-(to[0] - p.x), -(to[1] - p.z))); } }
      K.step(dt); t += dt;
      const people = K.people(); w.sample(t, people);
      for (const p of people) {   /* the whole body: never a spin on the spot */
        const ry = p.m.rotation.y, s = turns.get(p.id); if (!s) { turns.set(p.id, { ry, t }); continue; }
        if (t - s.t < 0.1) continue; const rate = Math.abs(wrap(ry - s.ry)) / (t - s.t) / D2R, walk = WALKS.test(p.clip || '') || /^Run/.test(p.clip || '');   /* RunLow and the other runs count as moving */
        if (rate > (walk ? LIMIT.turnWalk : LIMIT.turn)) add('t' + p.id, rate, `turn: ${p.id} turns ${rate.toFixed(0)} degrees a second ${walk ? 'while walking' : 'on the spot'} on ${p.clip}`);
        s.ry = ry; s.t = t;
      }
    }
    for (const l of w.lines()) lines.push(C.label + ': ' + l); for (const o of worst.values()) lines.push(C.label + ': ' + o.text);
    const st = w.stats(); stats.push(`${C.label}: ${t.toFixed(0)} s, ${st.people} people, ${st.samples} head samples`);
  }
  return { lines, stats };
}
