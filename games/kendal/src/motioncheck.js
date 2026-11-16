/* games/kendal/src/motioncheck.js: ?test=motion (dev builds only, also part of ?test=all as "motion"). Everyone in view must look alive and move like a person.
   For each step of the story it brings the step's place, then runs the game's own frame loop (main.js update) with a stepped clock while you walk
   from the start to each person and thing the step needs, stopping by each. Every person in view (inside 30 m and inside the view's width) is watched:
   - frozen:  an idle clip (Idle, IdleM, Sad1, Kneel...) with no step, turn, clip change or head turn for over 12 s (20 s in a calm or sad scene);
   - sync:    three or more people in view on the same clip at the same moment of it (within 2% of the loop, at the same speed, for 2 s), like a drill;
   - head:    the head turned more than 80 degrees from the chest, nodded more than 60, or turning faster than 320 degrees a second and faster than the clip turns it on its own (a snap or a spin);
   - turn:    the whole body turning faster than 240 degrees a second on the spot (600 while walking): a spin, not a turn;
   - inplace: a walk or run clip on someone who is not moving (running in place) for over 0.6 s;
   - slide:   someone moving faster than 12 cm a second on a standing clip (feet sliding) for over 0.3 s.
   Head angles are measured the way games/selassie/src/headcheck.js does: the head's forward against the chest's own forward, up and side. */
import * as THREE from 'three';
import { mixers } from '../../../engine/anim.js';

export const LIMIT = { yaw: 80, pitch: 60, speed: 320, turn: 240, turnWalk: 600, frozen: 12, frozenCalm: 20, sync: 0.02, near: 30, fov: 1.15 };
const IDLE = /^(Idle|IdleM|OldIdle|BriefcaseIdle|CarryHeadIdle|TorchIdle|HurtIdle|Sad1|Sad2|SitIdle|SitPose[MF]|Kneel|ComfortChild|ComfortTake)$/;
const WALK = /^(Walk|WalkM|WalkM2|Run|CarryBagWalk|CarryHeadWalk)$/;
const D2R = Math.PI / 180;
const AXES = new WeakMap();
function axesOf(m) {   /* each bone's own forward and up, from the bind pose (every body faces +z and stands up +y) */
  let a = AXES.get(m); if (a) return a; let s = null; m.traverse((o) => { if (!s && o.isSkinnedMesh) s = o.skeleton; }); if (!s) return null;
  const get = (name) => { const i = s.bones.findIndex((b) => b.name === 'mixamorig' + name); if (i < 0) return null; const q = new THREE.Quaternion(); new THREE.Matrix4().copy(s.boneInverses[i]).invert().decompose(new THREE.Vector3(), q, new THREE.Vector3()); q.invert(); return { bone: s.bones[i], f: new THREE.Vector3(0, 0, 1).applyQuaternion(q), u: new THREE.Vector3(0, 1, 0).applyQuaternion(q) }; };
  a = { chest: get('Spine2'), head: get('Head') }; if (!a.chest || !a.head) a = null; AXES.set(m, a); return a;
}
const _q = new THREE.Quaternion(), _f = new THREE.Vector3(), _u = new THREE.Vector3(), _r = new THREE.Vector3(), _h = new THREE.Vector3();
export function headAngles(m) {
  const a = axesOf(m); if (!a) return null; m.updateMatrixWorld(true);
  a.chest.bone.getWorldQuaternion(_q); _f.copy(a.chest.f).applyQuaternion(_q); _u.copy(a.chest.u).applyQuaternion(_q); _r.crossVectors(_u, _f);
  a.head.bone.getWorldQuaternion(_q); _h.copy(a.head.f).applyQuaternion(_q);
  return { yaw: Math.atan2(_h.dot(_r), _h.dot(_f)) / D2R, pitch: Math.asin(Math.max(-1, Math.min(1, _h.dot(_u)))) / D2R };
}
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const clipOf = (n) => { const c = n.ctl || (n.m && n.m.userData.anim), a = c && c.cur; if (!a) return { name: n.anim || '', t: 0 }; const d = a.getClip().duration || 1; return { name: a.getClip().name, t: (a.time % d) / d, ts: a.timeScale }; };

/* how fast a clip moves the head on its own, on a body standing still (a cheer or a laugh moves the head quickly; that is the clip, not a snap) */
const OWN = new Map();
function ownHeadSpeed(K, n, clip) {
  const key = (n.bodyId || n.base) + '|' + clip; if (OWN.has(key)) return OWN.get(key); let top = 0;
  const b = K.body && K.body(n, clip); if (b) { const c = b.userData.anim, a = c.cur, D = a.getClip().duration, N = Math.max(8, Math.round(D * 30)); let prev = null;
    for (let i = 0; i <= N; i++) { a.time = Math.min(D - 1e-4, D * i / N); c.mx.update(0); const g = headAngles(b); if (prev && g) top = Math.max(top, Math.hypot(wrap((g.yaw - prev.yaw) * D2R), wrap((g.pitch - prev.pitch) * D2R)) / (D / N) / D2R); prev = g; }
    const k = mixers.indexOf(c.mx); if (k >= 0) mixers.splice(k, 1); }
  OWN.set(key, top); return top;
}

/* K: { cases() -> [{ label, enter: async () -> the route you walk, [[x, z], ...] }], step(dt), people() -> the place's people, player() -> { x, z, yaw },
   mood() -> 'lively' | 'calm' | 'sad', move(x, z, yaw), body(person, clip) -> a fresh body of the same kind on that clip (for the clip's own head speed) }.
   Each kind of fault is reported once per person and step, with the worst value seen. */
export async function motionCheck(K, { dt = 1 / 30, still = 2.5, speed = 1.6, max = 50 } = {}) {
  const lines = [], stats = [];
  for (const C of await K.cases()) {
    const route = ((await C.enter()) || []).slice(), S = new Map(), worst = new Map();
    const add = (key, val, text) => { const w = worst.get(key); if (!w || val > w.val) worst.set(key, { val, text }); };
    let ri = 1, wait = still, t = 0, frames = 0; const syncSeen = new Map();
    if (route.length) K.move(route[0][0], route[0][1]);
    while (t < max && (ri < route.length || wait > 0)) {
      if (wait > 0) wait -= dt; else { const p = K.player(), to = route[ri], d = Math.hypot(to[0] - p.x, to[1] - p.z); if (d < 0.08) { ri++; wait = still; } else { const k = Math.min(1, speed * dt / d); K.move(p.x + (to[0] - p.x) * k, p.z + (to[1] - p.z) * k, Math.atan2(-(to[0] - p.x), -(to[1] - p.z))); } }
      K.step(dt); t += dt; frames++;
      const P = K.player(), mood = K.mood(), frozenAt = mood === 'lively' ? LIMIT.frozen : LIMIT.frozenCalm, view = [];
      for (const n of K.people()) {
        const m = n.m; if (!m || !m.visible) continue; const id = n.id || n.base, dx = n.x - P.x, dz = n.z - P.z, dist = Math.hypot(dx, dz);
        const inView = dist < LIMIT.near && (dist < 1.5 || Math.abs(wrap(Math.atan2(-dx, -dz) - P.yaw)) < LIMIT.fov);
        const c = clipOf(n), g = headAngles(m), ry = m.rotation.y, wp = m.getWorldPosition(new THREE.Vector3());
        let s = S.get(n); if (!s) { s = { x: wp.x, z: wp.z, ry, clip: c.name, g, stillT: 0, inplaceT: 0, slideT: 0, hy: g ? g.yaw : 0, gT: t, rT: t, rY: ry, gC: c.name }; S.set(n, s); continue; }
        /* far people are posed only every few frames (engine/ambient.js, detail by distance), so a speed is measured over the time since the pose last changed, not over one frame */
        const v = Math.hypot(wp.x - s.x, wp.z - s.z) / dt, walking = WALK.test(c.name), same = c.name === s.clip;
        let turn = 0; if (Math.abs(wrap(ry - s.rY)) > 1e-4) { turn = Math.abs(wrap(ry - s.rY)) / Math.max(dt, t - s.rT) / D2R; s.rY = ry; s.rT = t; }
        let hsp = 0; const gNew = g && s.g0 && (Math.abs(g.yaw - s.g0.yaw) > 0.01 || Math.abs(g.pitch - s.g0.pitch) > 0.01); if (g && !s.g0) s.g0 = g; if (gNew) { if (c.name === s.gC) hsp = Math.hypot(wrap((g.yaw - s.g0.yaw) * D2R), wrap((g.pitch - s.g0.pitch) * D2R)) / Math.max(dt, t - s.gT) / D2R; s.g0 = g; s.gT = t; s.gC = c.name; }
        if (inView) {
          view.push([n, c]);
          if (g) { if (Math.abs(g.yaw) > LIMIT.yaw) add('hy' + id, Math.abs(g.yaw), `head: ${id} turns the head ${g.yaw.toFixed(0)} degrees from the chest on ${c.name}`); if (Math.abs(g.pitch) > LIMIT.pitch) add('hp' + id, Math.abs(g.pitch), `head: ${id} nods the head ${g.pitch.toFixed(0)} degrees on ${c.name}`);
            { const sp = hsp, ct = n.ctl || m.userData.anim, blend = ct && ct.cur && ct.cur.getEffectiveWeight() < 0.98; if (sp > LIMIT.speed && !blend) {   /* while one clip fades into the next (0.35 s) the head moves between two poses: that is the blend, not a snap */ const own = ownHeadSpeed(K, n, c.name); if (sp > own * 1.25 + 60) add('hs' + id, sp, `head: ${id}'s head turns ${sp.toFixed(0)} degrees a second on ${c.name} (the clip alone: ${own.toFixed(0)})`); } } }
          if (turn > (walking ? LIMIT.turnWalk : LIMIT.turn)) add('t' + id, turn, `turn: ${id} turns ${turn.toFixed(0)} degrees a second ${walking ? 'while walking' : 'on the spot'} on ${c.name}`);
          if (walking && v < 0.12) s.inplaceT += dt; else s.inplaceT = 0; if (s.inplaceT > 0.6) add('ip' + id, s.inplaceT, `inplace: ${id} walks in place on ${c.name} for ${s.inplaceT.toFixed(1)} s`);
          if (!walking && v > 0.12) s.slideT += dt; else s.slideT = 0; if (s.slideT > 0.3) add('sl' + id, v, `slide: ${id} moves ${v.toFixed(2)} m/s on a standing clip (${c.name})`);
          const headMoved = g && Math.abs(g.yaw - s.hy) > 6; if (headMoved) s.hy = g.yaw;
          const changed = v * dt > 0.004 || Math.abs(wrap(ry - s.ry)) > 0.002 || !same || !IDLE.test(c.name) || headMoved;
          if (changed) s.stillT = 0; else { s.stillT += dt; if (s.stillT > frozenAt) add('fr' + id, s.stillT, `frozen: ${id} stands on ${c.name} with nothing changing for ${s.stillT.toFixed(0)} s`); }
        } else { s.stillT = 0; s.inplaceT = 0; s.slideT = 0; }
        s.x = wp.x; s.z = wp.z; s.ry = ry; s.clip = c.name; s.g = g;
      }
      /* in step: three or more on the same clip, at the same speed and the same moment of it, for 2 s running (a chance meeting of phases passes) */
      if (frames % 15 === 0) { const by = new Map(), now = new Set(); for (const [n, c] of view) { if (!c.name) continue; (by.get(c.name) || by.set(c.name, []).get(c.name)).push([n, c.t, c.ts]); }
        for (const [clip, L] of by) { if (L.length < 3) continue; L.sort((a, b) => a[1] - b[1]); for (let i = 0; i + 2 < L.length; i++) { const tri = L.slice(i, i + 3); if (tri[2][1] - tri[0][1] >= LIMIT.sync || Math.max(...tri.map((x) => x[2])) - Math.min(...tri.map((x) => x[2])) > 0.01) continue; const ids = tri.map((x) => x[0].id || x[0].base), key = clip + ids.join(); now.add(key); syncSeen.set(key, (syncSeen.get(key) || 0) + 1); if (syncSeen.get(key) >= 4) add('sy' + key, 1, `sync: ${ids.join(', ')} play ${clip} in step with each other`); } }
        for (const k of [...syncSeen.keys()]) if (!now.has(k)) syncSeen.delete(k); }
    }
    for (const w of worst.values()) lines.push(C.label + ': ' + w.text);
    stats.push(`${C.label}: ${t.toFixed(0)} s, ${S.size} people seen`);
  }
  return { lines, stats };
}
