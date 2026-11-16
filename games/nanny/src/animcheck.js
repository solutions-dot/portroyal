/* games/nanny/src/animcheck.js: the animation check (?test=anim, dev builds only), part of ?test=all.
   The owner, November 2026: "too much standing around looking like zombies". This runs the game's real frame loop with a stepped clock (nothing is drawn)
   through each scene where people are about, and watches every person in view:
     frozen   an idle clip (Idle, IdleM, OldIdle, Sad1, Sad2, Kneel, CarryHeadIdle) with no step, turn, clip change or head turn for more than FROZEN seconds,
              within NEAR metres of you (a far figure on a hillside may stand still)
     sync     three or more people near you on the same clip at the same moment of it (a crowd that moves in step)
     head     a head turned further than a person can against the chest (LIMIT.yaw to either side, LIMIT.pitch up or down), or turning faster than LIMIT.speed
     run      a walking or running clip played while the body stands still (running in place) for more than 0.3 s
     slide    a standing clip while the body moves over 0.2 m/s (feet sliding) for more than 0.2 s, or a walk played well off its stride's pace
   Head angles are measured as in games/selassie/src/headcheck.js: the head's forward against the chest's own frame, from the bind pose. */
import * as THREE from 'three';
import { WALKS, strideOf } from '../../../engine/anim.js';

export const LIMIT = { yaw: 80, pitch: 60, speed: 320 };
const FROZEN = 12, NEAR = 30, IDLE = /^(Idle|IdleM|OldIdle|Sad1|Sad2|Kneel|CarryHeadIdle|CarryIdle)$/, D2R = Math.PI / 180;
const AXES = new WeakMap(), _q = new THREE.Quaternion(), _f = new THREE.Vector3(), _u = new THREE.Vector3(), _r = new THREE.Vector3(), _h = new THREE.Vector3();
function axesOf(m) {
  let a = AXES.get(m); if (a !== undefined) return a; const sk = []; m.traverse((o) => o.isSkinnedMesh && sk.push(o)); const s = sk[0] && sk[0].skeleton; if (!s) { AXES.set(m, null); return null; }
  const get = (name) => { const i = s.bones.findIndex((b) => b.name === 'mixamorig' + name); if (i < 0) return null; const q = new THREE.Quaternion(); new THREE.Matrix4().copy(s.boneInverses[i]).invert().decompose(new THREE.Vector3(), q, new THREE.Vector3()); q.invert();
    return { bone: s.bones[i], f: new THREE.Vector3(0, 0, 1).applyQuaternion(q), u: new THREE.Vector3(0, 1, 0).applyQuaternion(q) }; };
  a = { chest: get('Spine2'), head: get('Head') }; if (!a.chest || !a.head) a = null; AXES.set(m, a); return a;
}
export function headAngles(m) {
  const a = axesOf(m); if (!a) return null; a.chest.bone.getWorldQuaternion(_q); _f.copy(a.chest.f).applyQuaternion(_q); _u.copy(a.chest.u).applyQuaternion(_q); _r.crossVectors(_u, _f);
  a.head.bone.getWorldQuaternion(_q); _h.copy(a.head.f).applyQuaternion(_q); return { yaw: Math.atan2(_h.dot(_r), _h.dot(_f)) / D2R, pitch: Math.asin(Math.max(-1, Math.min(1, _h.dot(_u)))) / D2R };
}
function dominant(ctl) { let best = null, bw = 0; for (const x of ctl.mx._actions) { const w = x.isRunning() ? x.getEffectiveWeight() : 0; if (w > bw) { bw = w; best = x; } } return best || ctl.cur; }

/* scenes: [{ name, setup: async () => {}, seconds, step(t, dt) (moves you, if you walk), people: () => [n...] }]; update(dt) is the game's frame; player() gives [x, z] */
export async function animCheck({ scenes, update, player, people: everyone, dt = 1 / 30 }) {
  const lines = [], stats = [];
  for (const sc of scenes) {
    await sc.setup(); const who = sc.people || everyone; const S = new Map(), seen = new Set(), add = (n, kind, text) => { const k = (n.id || n.base) + '|' + kind; if (seen.has(k)) return; seen.add(k); lines.push(`${sc.name}: ${n.id || n.base} ${text}`); };
    const steps = Math.round((sc.seconds || 30) / dt); let samples = 0, lastSync = new Set();
    for (let f = 0; f < steps; f++) {
      const t = f * dt; if (sc.step) sc.step(t, dt); update(dt); const [px, pz] = player(), syncs = new Map();
      for (const n of who()) {
        const m = n.m; if (!m || !m.visible || !n.ctl) continue; m.updateMatrixWorld(true);
        const p = m.position, d = Math.hypot(p.x - px, p.z - pz), act = dominant(n.ctl), clip = act.getClip().name, ha = headAngles(m);
        let s = S.get(n); if (!s) { s = { x: p.x, z: p.z, ry: m.rotation.y, clip, yaw: ha ? ha.yaw : 0, still: 0, worst: 0, runT: 0, slideT: 0, paceT: 0 }; S.set(n, s); continue; }
        const v = Math.hypot(p.x - s.x, p.z - s.z) / dt, walking = WALKS.test(clip); samples++;
        /* frozen */
        const headMove = ha && Math.abs(ha.yaw - s.yaw) > 0.4, changed = v > 0.05 || Math.abs(m.rotation.y - s.ry) > 0.002 || clip !== s.clip || !IDLE.test(clip) || headMove;
        s.still = changed ? 0 : s.still + dt; if (d < NEAR && !n.far) s.worst = Math.max(s.worst, s.still); if (s.still > FROZEN && d < NEAR && !n.far) add(n, 'frozen', `stands frozen on ${clip} for over ${FROZEN} s (${d.toFixed(0)} m from you)`);
        /* head */
        if (ha) { if (Math.abs(ha.yaw) > LIMIT.yaw) add(n, 'yaw', `turns the head ${ha.yaw.toFixed(0)} degrees against the chest (clip ${clip})`); if (Math.abs(ha.pitch) > LIMIT.pitch) add(n, 'pitch', `bends the head ${ha.pitch.toFixed(0)} degrees (clip ${clip})`);
          const sp = Math.abs(ha.yaw - s.yaw) / dt; s.fast = sp > LIMIT.speed ? (s.fast || 0) + dt : 0; if (s.fast > 0.1) add(n, 'speed', `turns the head at ${sp.toFixed(0)} degrees a second (clip ${clip})`); }
        /* run in place, slide, pace */
        s.runT = walking && v < 0.15 ? s.runT + dt : 0; if (s.runT > 0.3) add(n, 'run', `plays ${clip} while standing still (running in place)`);
        s.slideT = !walking && v > 0.2 ? s.slideT + dt : 0; if (s.slideT > 0.2) add(n, 'slide', `moves ${v.toFixed(2)} m/s on the standing clip ${clip} (feet slide)`);
        if (walking && v > 0.15) { const sd = strideOf(m, act.getClip()), want = sd > 0.05 ? sd * act.timeScale / act.getClip().duration : 0; s.paceT = want && Math.abs(v - want) > 0.1 + 0.3 * want ? s.paceT + dt : 0; if (s.paceT > 0.4) add(n, 'pace', `moves ${v.toFixed(2)} m/s but ${clip} is paced for ${want.toFixed(2)} m/s (feet slide)`); }
        /* sync: near people on the same looping clip at the same moment */
        if (d < NEAR && !walking && f % 15 === 0) { const k = clip + '@' + act.timeScale.toFixed(2); syncs.set(k, (syncs.get(k) || []).concat([[n, (act.time / act.getClip().duration) % 1]])); }
        s.x = p.x; s.z = p.z; s.ry = m.rotation.y; s.clip = clip; if (ha) s.yaw = ha.yaw;
      }
      if (f % 15 === 0) { const now = new Set();   /* three or more on the same clip at the same speed, within 3 % of the clip of each other, in two samples running: they move in step */
        for (const [k, ns] of syncs) { if (ns.length < 3) continue; ns.sort((a, b) => a[1] - b[1]); const ring = ns.concat(ns.map(([n, ph]) => [n, ph + 1]));
          for (let i = 0; i < ns.length; i++) if (ring[i + 2][1] - ring[i][1] < 0.03) { const ids = ring.slice(i, i + 3).map(([n]) => n.id || n.base + '#' + who().indexOf(n)).sort().join(', '), key = k.split('@')[0] + ': ' + ids; now.add(key);
            if (lastSync.has(key) && !seen.has('sync|' + key)) { seen.add('sync|' + key); lines.push(`${sc.name}: three people play ${key.replace(':', ' in step:')}`); } } }
        lastSync = now; }
    }
    let worst = 0; for (const s of S.values()) worst = Math.max(worst, s.worst); stats.push(`${sc.name}: ${S.size} people, ${samples} samples, longest still near you ${worst.toFixed(1)} s`);
  }
  return { lines, stats };
}
