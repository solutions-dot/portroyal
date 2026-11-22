/* games/tivoli/src/scenecheck.js: dev-only checks for the directed street scene (fight.js) and for the clips it chooses. */
import * as THREE from 'three';
import { groundFeet, mixers } from '../../../engine/anim.js';
import { makeBody } from './cast.js';
import { arm, disarm, weaponTick } from './weapons.js';
import { aimDir, yawOf, wrap } from './aim.js';

const DEG = 180 / Math.PI;
/* ?test=clipinfo: what each clip does on a real body: length, the turn it builds into the aim, how much the aim swings during it, how far the feet
   move (a clip that steps or runs in place has feet that travel), and the hips' height (crouched or standing) */
export function clipInfo(clips, { bodyId = 'soldier2010', kind = 'rifle' } = {}) {
  const out = [];
  for (const clip of clips) {
    const b = makeBody({ bodyId, base: bodyId, anim: clip }); if (kind) { arm(b, kind, null); b.userData.weapon.carry = 'ready'; }
    const ctl = b.userData.anim, act = ctl.cur, D = act.getClip().duration, N = 40, P = new THREE.Vector3(), feet = ['LeftFoot', 'RightFoot'].map((n) => b.getObjectByName('mixamorig' + n)), hips = b.getObjectByName('mixamorig' + 'Hips');
    let prev = null, travel = 0, hy0 = 1e9, hy1 = -1e9; const yaws = [];
    for (let i = 0; i <= N; i++) { act.time = Math.min(D - 1e-4, D * i / N); ctl.mx.update(0); for (let k = 0; k < 4; k++) groundFeet(b); b.updateMatrixWorld(true); if (kind) weaponTick(b);
      const d = aimDir(b); yaws.push(yawOf(d)); const now = feet.map((f) => f.getWorldPosition(P).clone()); if (prev) for (let k = 0; k < 2; k++) travel += Math.hypot(now[k].x - prev[k].x, now[k].z - prev[k].z); prev = now;
      const hy = hips.getWorldPosition(P).y; hy0 = Math.min(hy0, hy); hy1 = Math.max(hy1, hy); }
    const sx = yaws.reduce((s, y) => s + Math.sin(y), 0), sz = yaws.reduce((s, y) => s + Math.cos(y), 0), mean = Math.atan2(sx, sz), swing = Math.max(...yaws.map((y) => Math.abs(wrap(y - mean))));
    out.push(`${clip}${act.getClip().name !== clip ? ' (missing: ' + act.getClip().name + ')' : ''}: ${D.toFixed(2)} s, aim turn ${(mean * DEG).toFixed(0)} deg (${aimDir(b).by}), swings ${(swing * DEG).toFixed(0)} deg, feet travel ${(travel / D).toFixed(2)} m/s, hips ${hy0.toFixed(2)} to ${hy1.toFixed(2)} m`);
    if (kind) disarm(b); const k = mixers.indexOf(ctl.mx); if (k >= 0) mixers.splice(k, 1);
  }
  return out;
}

/* how far the feet travel in a clip, in metres a second, on a still body (0 for a clip that stands, 3 to 7 for a walk or a run played in place) */
const TRAVEL = new Map();
export function footTravel(bodyId, clip) {
  const key = bodyId + '|' + clip; if (TRAVEL.has(key)) return TRAVEL.get(key);
  const b = makeBody({ bodyId, base: bodyId, anim: clip }), ctl = b.userData.anim, act = ctl.cur, D = act.getClip().duration, N = 24, P = new THREE.Vector3(), feet = ['LeftFoot', 'RightFoot'].map((n) => b.getObjectByName('mixamorig' + n));
  let prev = null, travel = 0; for (let i = 0; i <= N; i++) { act.time = Math.min(D - 1e-4, D * i / N); ctl.mx.update(0); b.updateMatrixWorld(true); const now = feet.map((f) => f.getWorldPosition(P).clone()); if (prev) for (let k = 0; k < 2; k++) travel += Math.hypot(now[k].x - prev[k].x, now[k].z - prev[k].z); prev = now; }
  const k = mixers.indexOf(ctl.mx); if (k >= 0) mixers.splice(k, 1);
  const v = act.getClip().name === clip ? travel / D : 0; TRAVEL.set(key, v); return v;
}
const STEPPING = 0.8;   /* m/s of foot travel above which a clip is a walk or a run (Ducking, the most a still clip moves its feet, is 0.58) */
function dominant(ctl) { let best = null, bw = 0; for (const x of ctl.mx._actions) { const w = x.isRunning() ? x.getEffectiveWeight() : 0; if (w > bw) { bw = w; best = x; } } return best || ctl.cur; }
function seeded(s) { return () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* ?test=scene: the directed street scene, run from start to end several times (each with its own random timings), with every armed person checked:
   - aim: from the first shots on, every quarter second, once any blend between clips has finished, a raised weapon (FireStand, FireKneel, a pistol aim) must point within AIM_OK of someone on the other
     side, and never within FRIEND of anyone on their own side who stands in front of them; a person who is not moving and not aiming must face within FACE_OK
     of the middle of the other side (the guard at the back watches a side street and is allowed 60 degrees more).
   - feet: a walking or running clip while standing still (running in place) for over 0.3 s; moving over 0.2 m/s in a still clip (sliding) for over 0.2 s;
     walking or running more than 25 % off the speed the clip's stride gives at the pace it plays, for over 0.3 s. */
const AIM_OK = 12 / DEG, FRIEND = 8 / DEG, FACE_OK = 75 / DEG;
export async function sceneCheck({ FIGHT, begin, tick, strideOf, WALKS, CONTACT, seeds = [11, 22, 33], dt = 1 / 30 }) {
  const lines = [], seen = new Set(), stats = { samples: 0, aims: 0 }, keepRandom = Math.random;
  const nm = (a) => `${a.s.look} ${FIGHT.actors.indexOf(a)} (${a.side})`;
  const add = (seed, a, kind, text) => { const k = seed + '|' + FIGHT.actors.indexOf(a) + '|' + kind; if (seen.has(k)) return; seen.add(k); lines.push(`seed ${seed} at ${FIGHT.T.toFixed(1)} s: ${nm(a)} ${text}`); };
  try {
    for (const seed of seeds) {
      Math.random = seeded(seed); if (FIGHT.cleanup) FIGHT.cleanup(); FIGHT.cleanup = null; FIGHT.on = false; FIGHT.freeze = false;
      await begin(); FIGHT.freeze = false; const prev = new Map(), still = new Map(), slide = new Map(), off = new Map(); let nextAim = CONTACT;
      while (FIGHT.on && FIGHT.T < 43.5) {
        tick(dt); for (const b of FIGHT.bodies) { b.userData.anim.mx.update(dt); if (b.visible) groundFeet(b); weaponTick(b); }
        for (const a of FIGHT.actors) {
          const b = a.b, p = prev.get(a); prev.set(a, [b.position.x, b.position.z]); if (!b.visible || !p) continue;
          const speed = Math.hypot(b.position.x - p[0], b.position.z - p[1]) / dt, act = dominant(b.userData.anim), clip = act.getClip().name, steps = footTravel(a.bodyId, clip) > STEPPING; a.chkStill = speed < 0.15 ? (a.chkStill || 0) + dt : 0;
          still.set(a, steps && speed < 0.15 ? (still.get(a) || 0) + dt : 0); if (still.get(a) > 0.3) add(seed, a, 'still', `plays the moving clip ${clip} while standing still (running in place)`);
          slide.set(a, !steps && speed > 0.2 ? (slide.get(a) || 0) + dt : 0); if (slide.get(a) > 0.2) add(seed, a, 'slide', `moves at ${speed.toFixed(2)} m/s in the still clip ${clip} (feet slide)`);
          if (steps && speed > 0.15 && WALKS.test(clip)) { const s = strideOf(b, act.getClip()), want = act.timeScale * s / act.getClip().duration; off.set(a, Math.abs(speed - want) > 0.25 * want ? (off.get(a) || 0) + dt : 0); if (off.get(a) > 0.3) add(seed, a, 'pace', `moves at ${speed.toFixed(2)} m/s but ${clip}'s stride gives ${want.toFixed(2)} m/s (feet slide)`); }
          stats.samples++;
        }
        if (FIGHT.T >= nextAim) { nextAim += 0.25;
          for (const a of FIGHT.actors) {
            const b = a.b; if (!b.visible) continue; const ctl = b.userData.anim, dom = dominant(ctl); if (dom.getEffectiveWeight() < 0.9 || dom !== ctl.cur) continue;   /* a blend under way, up or down: a rifle on its way up is not aimed yet (no shot is fired then), and one being lowered because a friend ran in front is already stopping */
            const d = aimDir(b), p = b.position, clip = dom.getClip().name;
            const own = FIGHT.actors.filter((o) => o !== a && o.side === a.side && o.b.visible), opp = FIGHT.actors.filter((o) => o.side !== a.side && (o.b.visible || o.side === 'gunmen'));
            const ang = (o) => Math.abs(wrap(Math.atan2(o.b.position.x - p.x, o.b.position.z - p.z) - Math.atan2(d.x, d.z)));
            if (d.by === 'weapon') { stats.aims++;
              const near = Math.min(...opp.map(ang)); if (near > AIM_OK) add(seed, a, 'aim', `aims ${(near * DEG).toFixed(0)} degrees away from everyone on the other side (clip ${clip})`);
              for (const o of own) { const x = o.b.position.x - p.x, z = o.b.position.z - p.z; if (x * d.x + z * d.z <= 0) continue; const g = ang(o); if (g < FRIEND) add(seed, a, 'friend' + FIGHT.actors.indexOf(o), `aims ${(g * DEG).toFixed(1)} degrees from ${nm(o)}, ${Math.hypot(x, z).toFixed(1)} m in front of them on their own side (clip ${clip})`); }
            } else if ((a.chkStill || 0) > 0.8 && opp.length) {   /* a person who has just stopped is still turning round */
              let x = 0, z = 0; for (const o of opp) { x += o.b.position.x; z += o.b.position.z; } x /= opp.length; z /= opp.length;
              const g = Math.abs(wrap(Math.atan2(x - p.x, z - p.z) - Math.atan2(d.x, d.z))), lim = FACE_OK + (a.cover === 'guard' ? 60 / DEG : 0);
              if (g > lim) add(seed, a, 'face', `faces ${(g * DEG).toFixed(0)} degrees away from the other side (clip ${clip})`);
            }
          }
        }
      }
      FIGHT.on = false;
    }
  } finally { Math.random = keepRandom; if (FIGHT.cleanup) FIGHT.cleanup(); FIGHT.cleanup = null; FIGHT.on = false; }
  return { lines, stats };
}
