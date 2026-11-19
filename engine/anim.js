import { anchorSeat } from './placement.js';
import { joinTick } from './joinbody.js';
/* engine/anim.js: one Mixamo clip library shared by every character (same skeleton).
   loadClips(gltf) fills CL; animate(model, clipName) gives each person a controller. See docs/ENGINE.md. */
import * as THREE from 'three';
export const CL = {};          /* clip name -> AnimationClip, from shared/anims */
export const mixers = [];      /* every mixer made by animate(); the game updates the visible ones each frame */
let peopleClip = null; export function setFallbackClip(c) { peopleClip = c; }   /* used when a named clip is missing */
export function loadClips(gltf) { for (const a of gltf.animations) CL[a.name] = a; }
const _gp = new THREE.Vector3();
export const HIPS_Y = /^(Sit|Injured|StumbleBack|JogStumble|Terrified|Pray|Sad|Sword|Slash|Block|Punch|Laugh|Sheathe|Draw|Write|Kneel|Crawl|Scared|Duck|Hurt|PlayGuitar|PlayPiano|TalkM3$|AskQuestion$)/;   /* clips whose hips go low (sitting, kneeling, crouching, a sore stoop): keep their hips height, or a kneeling body would stand at full height on bent legs */
/* seated clips: the hips stay over the spot the game put the person, and face the way the game turned them. Most are named Sit*, but some seated clips are not. */
export const SEATED = /^(Sit|TalkM3$|AskQuestion$|PlayPiano$|Pray4$)/;
export const isSeated = (name) => SEATED.test(name || '');
/* Clips never used to fill idle time (owner, 19 November 2026: a person standing about and looking around "looks silly"). Every idle, reaction and
   background-life choice in the engine skips them (idleOK), a body never rests on one (animate), and the controller will not play one (play)
   unless a scene asks for it on purpose with ctl.cue(name) (Nanny Town: the soldiers look up into the trees when they hear something). */
export const NOT_IDLE = new Set(['LookAround']);
export const idleOK = (k) => !NOT_IDLE.has(k);
/* walking clips (played in place, paced to the ground speed by ctl.pace) and the looping clips whose ends are joined so they never snap */
export const WALKS = /^(Walk|WalkM|WalkM2|Run|RunM2|Carry|SadWalk|CarryBagWalk|CarryHeadWalk2?|HoldWalk|HurtWalk|InjuredWalk|RifleWalk2?|RifleCrouchWalk)$/;
const SEAM = /^(Walk|WalkM|WalkM2|Run|RunM2|Carry|Tread|SadWalk|CarryBagWalk|CarryHeadWalk2?|HoldWalk|HurtWalk|InjuredWalk|RifleWalk2?|RifleCrouchWalk)$/;
export function seamLoop(c) {   /* make a looping clip end exactly where it starts, spreading the gap over the cycle so it never snaps */
  const qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), err = new THREE.Quaternion(), part = new THREE.Quaternion(), id = new THREE.Quaternion();
  for (const t of c.tracks) { const v = t.values, tm = t.times, n = tm.length; if (!n) continue; const T0 = tm[0], T = tm[n - 1] - T0 || 1;
    if (/quaternion$/.test(t.name)) { qa.fromArray(v, 0).normalize(); qb.fromArray(v, (n - 1) * 4).normalize(); err.copy(qb).invert().premultiply(qa).normalize(); qa.toArray(v, 0);   /* err * last = first */
      for (let i = 1; i < n; i++) { part.copy(id).slerp(err, (tm[i] - T0) / T); qb.fromArray(v, i * 4).normalize().premultiply(part).normalize(); qb.toArray(v, i * 4); } }
    else { const k = v.length / n; for (let j = 0; j < k; j++) { const d = v[j] - v[(n - 1) * k + j]; for (let i = 1; i < n; i++) v[i * k + j] += d * (tm[i] - T0) / T; } } }
  return c; }
export function walkM() {   /* a steadier man's walk from the shared clip: damp the hip and spine twist and the swing of the arms */
  if (CL._wm || !CL.Walk) return CL._wm; const c = CL.Walk.clone(); c.name = 'WalkM'; const q = new THREE.Quaternion(), e = new THREE.Euler(0, 0, 0, 'YXZ');
  const K = { Hips: [0.25, 0.6, 0.35], Spine: [0.3, 0.7, 0.4], Spine1: [0.3, 0.7, 0.4], Spine2: [0.35, 0.8, 0.5], LeftArm: [0.7, 0.75, 1], RightArm: [0.7, 0.75, 1], LeftLeg: [1, 0.72, 1], RightLeg: [1, 0.72, 1] };
  for (const t of c.tracks) { const m = t.name.match(/mixamorig(\w+)\.quaternion$/); if (!m || !K[m[1]]) continue; const [ky, kx, kz] = K[m[1]], v = t.values;
    const avg = new THREE.Euler(0, 0, 0, 'YXZ'); let n = 0, sx = 0, sy = 0, sz = 0; for (let i = 0; i < v.length; i += 4) { e.setFromQuaternion(q.set(v[i], v[i + 1], v[i + 2], v[i + 3])); sx += e.x; sy += e.y; sz += e.z; n++; } avg.set(sx / n, sy / n, sz / n);
    for (let i = 0; i < v.length; i += 4) { e.setFromQuaternion(q.set(v[i], v[i + 1], v[i + 2], v[i + 3])); e.set(avg.x + (e.x - avg.x) * kx, avg.y + (e.y - avg.y) * ky, avg.z + (e.z - avg.z) * kz); if (m[1] === 'Hips' || /Spine/.test(m[1])) e.x = avg.x * 0.4 + (e.x - avg.x);   /* less forward lean */
      q.setFromEuler(e); v[i] = q.x; v[i + 1] = q.y; v[i + 2] = q.z; v[i + 3] = q.w; } }
  CL._wm = c; return c; }
export const BOW = { '^Kneel': { Neck: 0.35, Head: 0.8, Spine2: 0.7, LeftShoulder: 0.3, RightShoulder: 0.3 } };   /* Kneel: keep 35% of the neck's bow, 80% of the head's and 70% of the upper chest's (a flat collar lies on the upper back; bowed fully, the neck pulled away and the collar stood up like a wing) */
/* Posture (16 November 2026). The clips were fitted to our bodies bone by bone, pointing each bone the way the source skeleton's bone points. The source spine is a straight
   line; our bodies' spine is not (at rest the chest bone leans back about 25 degrees and the bone above it comes forward about 19, the natural curve of a back). So every clip
   straightened the spine, which tipped each person's ribcage back by about 20 degrees: lower ribs and belly pushed out, upper chest sunk, the whole body leaning back. On a man in a
   shirt that read as a bust, in every game. The three bones are turned back to the body's own curve here, once, for every clip: the chest bone's parent leans back 18 degrees more,
   the chest comes forward again, and the neck and the two shoulders undo the rest so the head and the arms stay as the clip put them. POSTURE is degrees about the bone's parent's side-to-side axis. */
export const POSTURE = { Spine1: -18, Spine2: 38, Neck: -20 };
/* Standing clips (idles, talking, gestures) were made with the hips back and the knees bent about 30 degrees, so everyone stood in a slump, like a zombie (owner, 17 November 2026).
   For those clips the thigh is turned back, the knee straightened and the foot set flat again. Walking, running, carrying, kneeling and seated clips are left as they are: they do not have the slump. */
export const STANCE = { LeftUpLeg: 14, RightUpLeg: 14, LeftLeg: 28, RightLeg: 28, LeftFoot: -14, RightFoot: -14 };
const STANDING = /^(Angry|Thankful|Greet|LookOverShoulder|HappyIdle2|StandPoseM|Agree|Argue|BriefcaseIdle|Cheer|Clap|Comfort\w*|Cry|Drink|HappyIdle|HeadTurn|HurtIdle|Idle|IdleM|Laugh|ListenMusic|LookAround|Nod|OldIdle|Point|ReachOut|Sad\d|Salute|Scared|Shrug|Speech|Talk\d|TalkM\d|Wave|WaveSlow|Write|Yell|TorchIdle|RifleIdle|CarryIdle|CarryHeadIdle)$/;   /* turning the shoulders back as well was tried: it helped four poses but made the full every-clip gate (tools/review/people-check.mjs) worse in Garvey and Nanny Town, so the arms are left as the clips have them */
function posture(c, name) { const q = new THREE.Quaternion(), r = new THREE.Quaternion(), X = new THREE.Vector3(1, 0, 0), st = STANDING.test(name || '');
  for (const t of c.tracks) { const m = t.name.match(/mixamorig:?(\w+)\.quaternion$/); const deg = m ? (POSTURE[m[1]] || (st ? STANCE[m[1]] : undefined)) : undefined; if (!deg) continue; r.setFromAxisAngle(X, deg * Math.PI / 180); const v = t.values;
    for (let i = 0; i < v.length; i += 4) { q.fromArray(v, i).premultiply(r).toArray(v, i); } } }
export function clipFor(name, keepHips) { let src = name === 'WalkM' ? walkM() : CL[name]; if (!src) return null; if (name === 'SitDrink' && !CL._sd) { CL._sd = THREE.AnimationUtils.subclip(src, 'SitDrink', 140, 455, 30); } if (name === 'SitDrink') src = CL._sd; const c = src.clone(); keepHips = keepHips || HIPS_Y.test(name);
  c.tracks = c.tracks.filter((t) => { if (t.name.endsWith('.scale')) return false; if (!t.name.endsWith('.position')) return true; if (!keepHips || !/Hips/.test(t.name)) return false;
    const v = t.values; let x0 = v[0], z0 = v[2]; if (SEATED.test(name) && CL.Idle) { const it = CL.Idle.tracks.find((k) => k.name === t.name); if (it) { x0 = it.values[0]; z0 = it.values[2]; } }   /* seated clips: keep the hips over the spot we put him, not where the clip wandered to */
 for (let i = 0; i < v.length; i += 3) { v[i] = x0; v[i + 2] = z0; } return true; });   /* running stays in place; the game moves her */
  if (!SEATED.test(name)) posture(c, name);
  if (STANDING.test(name) && name !== 'Idle' && !GRIPS.test(name)) relaxHands(c);
  if (!GRIPS.test(name) && !SEATED.test(name)) restFingers(c);   /* the knuckles gently bent and the fingers together (below) */   /* seated clips keep the pose they were tuned in: their hands rest on the lap, and moving the chest pushed the fingers into the thighs (the cloth check, Garvey, 16 November 2026) */
  if (SEAM.test(name)) seamLoop(c);
  const damp = BOW[Object.keys(BOW).find((k) => new RegExp(k).test(name)) || ''];   /* clips whose neck bows so far that a collar stands off the nape: the neck and head turn only part of the way from standing */
  if (damp && CL.Idle) for (const t of c.tracks) { const m = t.name.match(/mixamorig:?(\w+)\.quaternion$/); const k = m ? damp[m[1]] : undefined; if (k === undefined) continue; const it = CL.Idle.tracks.find((x) => x.name === t.name); if (!it) continue;
    const q0 = new THREE.Quaternion().fromArray(it.values, 0), q = new THREE.Quaternion(), v = t.values; for (let i = 0; i < v.length; i += 4) { q.fromArray(v, i); q0.clone().slerp(q, k).toArray(v, i); } }
  if (SEATED.test(name)) { const t = c.tracks.find((k) => /Hips\.quaternion$/.test(k.name)); if (t) { const v = t.values, q0 = new THREE.Quaternion(v[0], v[1], v[2], v[3]), f = new THREE.Vector3(0, 0, 1).applyQuaternion(q0), fix = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.atan2(f.x, f.z)), q = new THREE.Quaternion();
    for (let i = 0; i < v.length; i += 4) { q.set(v[i], v[i + 1], v[i + 2], v[i + 3]).premultiply(fix); v[i] = q.x; v[i + 1] = q.y; v[i + 2] = q.z; v[i + 3] = q.w; } } }   /* seated clips face the way we set the person, not the way the clip turned */
  return c; }
/* strideOf(model, clip): how many metres of ground one loop of a walking clip covers on THIS body (its leg length and its scale are included).
   Worked out from the clip itself: the foot that is lower is the one on the ground, and how far it travels backwards under the hips is how far the body goes forwards.
   A walker whose ground speed is v must play the clip at v * duration / stride, or the feet slide. ctl.pace(v) below does that. */
const STRIDES = new WeakMap(), _q = [0, 1, 2, 3].map(() => new THREE.Quaternion()), _qb = new THREE.Quaternion(), _p = new THREE.Vector3(), _m3 = new THREE.Matrix3(), _fw = new THREE.Vector3(), _wq = new THREE.Quaternion();
function sampleQ(track, t, out) { const tm = track.times, v = track.values; let i = 1; while (i < tm.length - 1 && tm[i] < t) i++; const a = (t - tm[i - 1]) / ((tm[i] - tm[i - 1]) || 1); out.fromArray(v, (i - 1) * 4); _qb.fromArray(v, i * 4); return out.slerp(_qb, Math.max(0, Math.min(1, a))); }
export function strideOf(m, clip) {
  let per = STRIDES.get(m); if (!per) STRIDES.set(m, per = {}); const key = clip.name + '|' + m.scale.y.toFixed(3); if (per[key] !== undefined) return per[key];
  const B = (n) => m.getObjectByName('mixamorig' + n), T = (n) => clip.tracks.find((t) => t.name === 'mixamorig' + n + '.quaternion'), hips = B('Hips'), tH = T('Hips'); if (!hips || !tH) return (per[key] = 0);
  m.updateMatrixWorld(true); _m3.setFromMatrix4(hips.parent.matrixWorld); _fw.set(0, 0, 1).applyQuaternion(m.getWorldQuaternion(_wq)).normalize();
  const legs = ['Left', 'Right'].map((s) => ({ b: [B(s + 'UpLeg'), B(s + 'Leg'), B(s + 'Foot')], t: [T(s + 'UpLeg'), T(s + 'Leg')] })); if (legs.some((l) => l.b.some((b) => !b) || l.t.some((t) => !t))) return (per[key] = 0);
  const N = 64, D = clip.duration, pos = legs.map(() => []);
  for (let i = 0; i <= N; i++) { const t = D * i / N; sampleQ(tH, t, _q[0]);
    legs.forEach((l, k) => { sampleQ(l.t[0], t, _q[1]); sampleQ(l.t[1], t, _q[2]); _p.copy(l.b[2].position).applyQuaternion(_q[2]).add(l.b[1].position).applyQuaternion(_q[1]).add(l.b[0].position).applyQuaternion(_q[0]).applyMatrix3(_m3); pos[k].push([_p.dot(_fw), _p.y]); }); }
  let dist = 0, on = 0, lo = 1e9, hi = -1e9; for (const l of pos) for (const q of l) { lo = Math.min(lo, q[1]); hi = Math.max(hi, q[1]); } const band = /Run/.test(clip.name) ? lo + (hi - lo) * 0.2 : 1e9;   /* a run has moments with both feet in the air: count a foot only while it is down */
  for (let i = 0; i < N; i++) { const k = (pos[0][i][1] + pos[0][i + 1][1] < pos[1][i][1] + pos[1][i + 1][1]) ? 0 : 1; if (pos[k][i][1] > band || pos[k][i + 1][1] > band) continue; dist += Math.max(0, pos[k][i][0] - pos[k][i + 1][0]); on++; }
  return (per[key] = on ? dist * N / on : 0); }
/* Seated skirt (tools/garvey/era.py, SkirtSeat): a later skirt body carries a second skirt cut close round both thighs. It shows only while a seated or kneeling
   clip plays, and the standing skirt is hidden then, so a lap is covered without the standing skirt's flare tearing. Checked after each mixer update. */
export const LOW_SKIRT = /^(Kneel|Crawl|Pray)/;
const LAP = new WeakMap(), SEAT = new WeakMap();   /* kept outside userData: a game that clones a body copies userData as plain data, and bone references there became empty objects */
export function seatSkirt(m) {
  if (SEAT.has(m)) return SEAT.get(m);
  const seat = [], stand = []; m.traverse((o) => { if (!o.isMesh) return; if (/^SkirtSeat/.test(o.name)) seat.push(o); else if (/^Skirt(_|\d|$)/.test(o.name)) stand.push(o); });
  if (!seat.length) return (SEAT.set(m, null), null);
  for (const o of seat) o.visible = false;
  { const S0 = { seat, stand, on: false }; SEAT.set(m, S0); return S0; }
}
export function skirtTick(m) { const S = SEAT.get(m), a = m.userData.anim; if (!S || !a) return;
  let best = null, bw = 0; for (const x of a.mx._actions) { const w = x.isRunning() ? x.getEffectiveWeight() : 0; if (w > bw) { bw = w; best = x; } }   /* the clip with the most weight now (a.cur lags while a clip fades in, and a tool may play one directly) */
  const c = (best || a.cur) && (best || a.cur).getClip(), n = c ? c.name : '', on = isSeated(n) || LOW_SKIRT.test(n);
  if (on === S.on) return; S.on = on; for (const o of S.seat) o.visible = on; for (const o of S.stand) o.visible = !on; }
/* Hands clear of the cloth: seated and kneeling clips rest the hands on the thighs, and standing ones let them hang by the thighs; but a skirt or an apron makes the lap thicker than the body the clip was made on,
   and the fingers sank into the cloth. After each mixer update, while such a clip plays, each fingertip and wrist is kept outside the lap (the thigh's line plus
   the cloth's own thickness, measured once on this body) by turning the forearm at the elbow. */
const _v1 = new THREE.Vector3(), _v2 = new THREE.Vector3(), _v3 = new THREE.Vector3(), _v4 = new THREE.Vector3(), _hq = new THREE.Quaternion(), _hq2 = new THREE.Quaternion();
function lapSetup(m) { if (LAP.has(m)) return LAP.get(m);
  const bone = (n) => { let b = null; m.traverse((o) => { if (!b && o.isBone && o.name.replace(/[^A-Za-z0-9]/g, '').endsWith(n)) b = o; }); return b; };
  const cloth = []; m.traverse((o) => { if (o.isSkinnedMesh && /^(SkirtSeat|Skirt|Breeches|Apron|JacketSkirt|CoatSkirt)/.test(o.name)) cloth.push(o); });
  const sides = []; for (const S of ['Left', 'Right']) { const up = bone(S + 'UpLeg'), kn = bone(S + 'Leg'), fa = bone(S + 'ForeArm'), hd = bone(S + 'Hand'), tip = bone(S + 'HandMiddle3') || bone(S + 'HandMiddle2') || hd; const tips = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'].map((f) => bone(S + 'Hand' + f + '3') || bone(S + 'Hand' + f + '2')).filter(Boolean); if (up && kn && fa && hd) sides.push({ S, up, kn, fa, hd, tip, tips, R: 0 }); }
  if (!sides.length) return (LAP.set(m, null), LAP.get(m));
  m.updateMatrixWorld(true); const v = new THREE.Vector3();
  for (const sd of sides) { const A = sd.up.getWorldPosition(new THREE.Vector3()), K = sd.kn.getWorldPosition(new THREE.Vector3()), ax = K.clone().sub(A), L2 = ax.lengthSq(); const ds = [];
    for (const o of cloth) { const n = o.geometry.attributes.position.count, step = Math.max(1, n >> 11); for (let i = 0; i < n; i += step) { o.getVertexPosition(i, v).applyMatrix4(o.matrixWorld); const t = v.clone().sub(A).dot(ax) / L2; if (t < 0.25 || t > 0.9) continue; const c = A.clone().addScaledVector(ax, t), d = v.distanceTo(c); const other = sides.find((x) => x !== sd); if (other) { const A2 = other.up.getWorldPosition(new THREE.Vector3()); if (v.distanceTo(A2) < v.distanceTo(A) - 0.02) continue; } ds.push(d); } }
    ds.sort((a, b) => a - b); const ws = m.getWorldScale(new THREE.Vector3()).x || 1; const q = (f) => ds[Math.min(ds.length - 1, Math.floor(ds.length * f))]; sd.flare = ds.length && q(0.85) - q(0.6) > 0.025; sd.R = (ds.length ? (cloth.some((o) => /^Apron/.test(o.name)) || sd.flare ? q(0.85) : q(0.6)) : 0.09) / ws;   /* an apron over the lap, a 1690 coat skirt or wide slops flare well out from the thigh: measure out to the flare */ sd.foot = bone(sd.S + 'Foot'); }
  { const hips = bone('Hips'), sp = bone('Spine1') || bone('Spine'); if (hips && sp) { const A = hips.getWorldPosition(new THREE.Vector3()), B = sp.getWorldPosition(new THREE.Vector3()), ax = B.clone().sub(A), L2 = ax.lengthSq(), ds = []; const waist = []; m.traverse((o) => { if (o.isSkinnedMesh && /^(Belt|Skirt|Breeches|Waistband)/.test(o.name)) waist.push(o); });   /* the belt and the skirt or trouser top (a blouse's sleeves hang at this height too, and made the waist too wide) */
      for (const o of waist) { const n = o.geometry.attributes.position.count, step = Math.max(1, n >> 11); for (let i = 0; i < n; i += step) { o.getVertexPosition(i, v).applyMatrix4(o.matrixWorld); const t = v.clone().sub(A).dot(ax) / L2; if (t < 0.3 || t > 1.0) continue; ds.push(v.distanceTo(A.clone().addScaledVector(ax, t))); } }
      ds.sort((a, b) => a - b); const ws = m.getWorldScale(new THREE.Vector3()).x || 1; sides.waist = { hips, sp, R: (ds.length ? ds[Math.floor(ds.length * 0.6)] : 0.14) / ws }; } }   /* a hand on the hip rests on the belt and skirt top, not in them */
  sides.skirt = cloth.some((o) => /^(SkirtSeat|Skirt)/.test(o.name)); sides.jacket = cloth.some((o) => /^(JacketSkirt|CoatSkirt)/.test(o.name));
  return (LAP.set(m, sides), LAP.get(m)); }
export function lapHands(m, name) { const L = LAP.get(m); if (!L) return; m.updateMatrixWorld(true);   /* every clip: standing, a hand hanging by a skirt or trousers is kept outside them too */
  const sc = m.getWorldScale(_v4).x || 1;
  const push = (sd, T, P, R) => { const off = T.clone().sub(P), d = off.length(); if (d >= R || d < 1e-4) return; const E = sd.fa.getWorldPosition(new THREE.Vector3()), from = T.clone().sub(E), to = T.clone().addScaledVector(off.normalize(), R - d).sub(E);
    _hq.setFromUnitVectors(from.normalize(), to.normalize()); sd.fa.getWorldQuaternion(_hq2); const pq = sd.fa.parent.getWorldQuaternion(new THREE.Quaternion()).invert(); sd.fa.quaternion.copy(pq.multiply(_hq.multiply(_hq2))); sd.fa.updateMatrixWorld(true); };
  if (L.length === 2 && L.skirt) for (let it = 0; it < 2; it++) for (const sd of L) { const A = L[0].up.getWorldPosition(new THREE.Vector3()).add(L[1].up.getWorldPosition(new THREE.Vector3())).multiplyScalar(0.5), K = L[0].kn.getWorldPosition(new THREE.Vector3()).add(L[1].kn.getWorldPosition(new THREE.Vector3())).multiplyScalar(0.5), ax = K.clone().sub(A), L2 = ax.lengthSq(), R = ((L[0].R + L[1].R) / 2 + 0.012) * sc;   /* a skirt spans the gap between the thighs: a hand resting in the middle of the lap lies on that bridge */
    for (const pt of [...sd.tips, sd.hd]) { const T = pt.getWorldPosition(new THREE.Vector3()), t = T.clone().sub(A).dot(ax) / L2; if (t < 0.05 || t > 1.0) continue; push(sd, T, A.clone().addScaledVector(ax, t), R); } }
  for (let it = 0; it < 2; it++) for (const sd of L) for (const leg of L) { const K = leg.kn.getWorldPosition(new THREE.Vector3()), R = (L.skirt || leg.flare ? leg.R + 0.035 : leg.R * 0.95 + 0.02) * sc;   /* full 1690 breeches gather round the knee as thickly as a skirt drapes over it */   /* a skirt drapes thicker over a raised knee */ for (const pt of [...sd.tips, sd.hd]) push(sd, pt.getWorldPosition(new THREE.Vector3()), K, R); }   /* the knee as a ball: fingertips that curl over a bent knee rest on the kneecap, which stands out past the thigh's line */
  for (let it = 0; it < 3; it++) for (const sd of L) for (const leg of (L.waist ? [...L, L.waist] : L)) for (const seg of (leg === L.waist ? [2] : [0, 1])) { if (seg === 1 && !leg.foot) continue; const Ab = seg === 2 ? leg.hips : seg ? leg.kn : leg.up, Kb = seg === 2 ? leg.sp : seg ? leg.foot : leg.kn; if (!Ab || !Kb || !Ab.getWorldPosition || !Kb.getWorldPosition) continue; const A = Ab.getWorldPosition(_v1), K = Kb.getWorldPosition(_v2), ax = _v3.copy(K).sub(A), L2 = ax.lengthSq(), R = ((seg === 1 ? leg.R * 0.75 : leg.R) + (seg === 2 ? 0.008 : seg === 0 && L.skirt ? 0.024 : 0.012)) * sc;   /* a seated skirt lies looser over the thigh than trousers */   /* the thigh, then the shin (a kneeling hand rests on the knee) */
    for (const pt of [...sd.tips, sd.hd]) {   /* every fingertip and the wrist */ const T = pt.getWorldPosition(new THREE.Vector3()), t0 = T.clone().sub(A).dot(ax) / L2, lo = seg === 0 ? -0.3 : seg === 2 ? -0.2 : 0, hi = seg === 2 ? 1.2 : 1.05, t = Math.min(hi, Math.max(lo, t0)); if (t0 <= lo || t0 >= hi) continue;   /* the thigh's line runs on a little above the hip joint, where a hand rests on the hip */
      const Rt = seg === 0 ? R * (1 + 0.35 * Math.min(1, Math.max(0, (0.35 - t) / 0.65))) + (L.jacket ? 0.02 * sc * Math.min(1, Math.max(0, (0.4 - t) / 0.7)) : 0) : R,   /* a jacket's skirt stands out from the hip */ C = A.clone().addScaledVector(ax, t), off = T.clone().sub(C), d = off.length(); if (d >= Rt || d < 1e-4) continue;   /* the top of the thigh widens into the hip */
      const E = sd.fa.getWorldPosition(new THREE.Vector3()), from = T.clone().sub(E), to = T.clone().addScaledVector(off.normalize(), Rt - d).sub(E);
      _hq.setFromUnitVectors(from.normalize(), to.normalize()); sd.fa.getWorldQuaternion(_hq2); const pq = sd.fa.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
      sd.fa.quaternion.copy(pq.multiply(_hq.multiply(_hq2))); sd.fa.updateMatrixWorld(true); } } }
export function animate(m, name, mixerIn, baseAct) { if (name && NOT_IDLE.has(name)) name = 'Idle'; const clip = (name && clipFor(name)) || clipFor('Idle') || peopleClip; if (!clip && !baseAct) return;
  const mx = mixerIn || new THREE.AnimationMixer(m), base = baseAct || mx.clipAction(clip); if (!baseAct) { base.play(); base.time = Math.random() * clip.duration; base.timeScale = 0.92 + Math.random() * 0.16; }   /* each body at its own pace: two people on one clip never move in step */ if (!mixerIn) mixers.push(mx);
  const acts = {}, ctl = { mx, base, cur: base, timer: 0,
    get(n) { if (!acts[n]) { const c = clipFor(n); if (!c) return null; acts[n] = mx.clipAction(c); } return acts[n]; },
    cue(n, once, hold) { this.cued = n; try { this.play(n, once, hold); } finally { this.cued = null; } },   /* a clip from NOT_IDLE, played because the story asks for it */
    play(n, once, hold) { if (n && NOT_IDLE.has(n) && this.cued !== n) return;   /* never as filler (see NOT_IDLE) */
      if (n && HAND_TALK.test(n) && holdsInHand(m) && clipFor('Idle')) n = 'Idle';   /* a hand that holds a case or a basket does not wave it about */
      const a = n ? this.get(n) : this.base; if (!a || a === this.cur) return; a.reset(); if (!n) { a.time = Math.random() * a.getClip().duration; a.timeScale = 0.9 + Math.random() * 0.2; } else if (!once) a.time = Math.random() * a.getClip().duration;   /* a looping clip (a walk, a talk) starts from its own moment: two people set walking together did so in step */   /* back to the resting clip at a random moment and pace, never from its start (two people put back together moved in step) */ a.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat); a.clampWhenFinished = !!once; a.fadeIn(0.35).play(); this.cur.fadeOut(0.35); this.cur = a; this.timer = once ? Math.max(0.5, a.getClip().duration - 0.35) : (hold || 0); },
    rest() { this.play(null); },
    pace(v, lo = 0.55, hi = 1.9) { const a = this.cur, c = a.getClip(); if (!WALKS.test(c.name)) return 1; const s = strideOf(m, c); if (s > 0.05) a.timeScale = Math.max(lo, Math.min(hi, v * c.duration / s)); return a.timeScale; },   /* play the walk at the pace that fits ground speed v (metres a second) on this body, so the feet do not slide */
    tick(dt) { anchorSeat(m); if (this.timer > 0) { this.timer -= dt; if (this.timer <= 0 && this.cur !== this.base) { const h = this.home; this.home = null;
        if (h) this.play(h); else this.rest(); if (this.fid) { this.fid = false; const a = this.cur, d = a.getClip().duration; a.time = Math.random() * d; a.timeScale = 0.9 + Math.random() * 0.2; } } }   /* back from a moment of variety: to the clip they were on, at a random moment, so two people never fall into step */
      else fidget(this, m, dt); } };
  lapSetup(m); if (LAP.get(m)) { (mx._laps || (mx._laps = [])).push(m); if (!mx._lapHook) { const up2 = mx.update.bind(mx); mx.update = (dt) => { const r = up2(dt); for (const s of mx._laps) { const a = s.userData.anim; let best = null, bw = 0; if (a) for (const x of mx._actions) { const w = x.isRunning() ? x.getEffectiveWeight() : 0; if (w > bw) { bw = w; best = x; } } if (best) lapHands(s, best.getClip().name); } return r; }; mx._lapHook = true; } }
  if (seatSkirt(m)) { (mx._skirts || (mx._skirts = [])).push(m); if (!mx._skirtHook) { const up = mx.update.bind(mx); mx.update = (dt) => { const r = up(dt); for (const s of mx._skirts) skirtTick(s); return r; }; mx._skirtHook = true; } }
  if (!m.userData.noJoin) { (mx._joins || (mx._joins = [])).push(m); if (!mx._joinHook) { const up3 = mx.update.bind(mx); mx.update = (dt) => { const r = up3(dt); for (const s of mx._joins) joinTick(s); return r; }; mx._joinHook = true; } }   /* fewer draw calls, same look (engine/joinbody.js) */
  curlFingers(m); m.userData.anim = ctl; return ctl; }
/* Fingers at rest (owner, 17 November 2026: spiky, claw-like fingers). The clips keep only each finger's knuckle (tools/anims/clean_clips.mjs drops joints 2 to 4 to
   save space), so the knuckle bent with the clip while the rest of the finger stayed dead straight. No clip moves those joints, so each body gets a gentle curl in
   them once, here, for every game. FINGER_AXIS and FINGER_CURL are the bend (checked by eye on a hand close up). */
export const FINGER_CURL = { 2: 0.32, 3: 0.24 }, FINGER_AXIS = new THREE.Vector3(+(globalThis.__fingerAxis || 'z') === 'x' ? 1 : 0, 0, 0);
const CURLED = new WeakSet();
function curlFingers(m) { if (CURLED.has(m)) return; CURLED.add(m); const ax = (globalThis.__fingerAxisV || null), q = new THREE.Quaternion();
  m.traverse((b) => { if (!b.isBone) return; const k = /Hand(Index|Middle|Ring|Pinky)([23])$/.exec(b.name); if (!k || b.userData.curled) return; b.userData.curled = true;   /* the mark is on the bone, which a clone copies: a clone of an animated body was curled a second time */
    const a = FINGER_CURL[k[2]] * (globalThis.__fingerSign || 1);
    q.setFromAxisAngle(ax || new THREE.Vector3(0, 0, 1), /Left/.test(b.name) ? -a : a); b.quaternion.multiply(q); }); }
/* A hand that holds something does not gesture (17 November 2026). A man in Eventide's crowd stood on Talk2 with a suitcase in his hand, and the gesture swung the case into
   his thigh. Eventide already kept people with a thing in the hand off the talking clips when you spoke to them; the rule now lives here for every game (rule 10):
   - play() gives the plain Idle when it is asked for a clip that waves the hands (HAND_TALK) and the body holds something by engine/grip.js;
   - calmHands(m), which grip() calls, moves a body whose standing clip is one of those onto the Idle.
   Only for a thing that hangs below the hand (grip() works that out from the handle's height, or takes hangs: true or false). A flag or a palm frond held up by its stick is
   waved on purpose (The Emperor's Arrival). Walking, carrying, sitting and weapon clips are not touched. */
const HAND_TALK = /^(Talk|SitTalk|Wave|Clap|Cheer|Point|Yell|Laugh|Greet|Angry|Thankful|Argue)/;
export const holdsInHand = (m) => !!(m.userData.grips && m.userData.grips.some((g) => g.wrap && g.hangs));   /* a thing that hangs from the hand (a case, a basket, a bucket, a lamp, a bag); a flag, a palm frond or a cup held upright may be waved */
export function calmHands(m) { const c = m.userData.anim; if (!c || !c.base || !HAND_TALK.test(c.base.getClip().name)) return; const a = c.get('Idle'); if (!a || a === c.base) return;
  a.reset().play(); a.time = Math.random() * a.getClip().duration; c.base.stop(); if (c.cur === c.base) c.cur = a; c.base = a; c.mx.update(0); }
/* Anyone standing on a plain idle now and then looks round or turns the head, once, and goes back to the idle (owner, 17 November 2026: "ensure variety in idle animation,
   across all games ... they have this zombie look ... including old people"). Every game gets it from here (rule 10). Not for people the crowd code runs (it has its own
   idles, engine/ambient.js), people holding something (the item must stay in the hand), or a body marked userData.still. An old person (userData.elder, set by the crowd
   code from the body's name) uses the old idle too. The clips must be in the game's anim-clips.json; a missing one is skipped. */
const FIDGET_BASE = /^(Idle|IdleM|OldIdle|Sad1|Sad2|Cry|HappyIdle|SitIdle\d?|SitDisbelief)$/;
/* a sad person stays sad and a seated person stays seated (Port Royal's ?test=life, 17 November 2026: the camp after the earthquake and Abba in the boat stood
   with nothing changing): their variety is another sad clip, or another way of sitting, never a look round on a standing clip */
const SAD = ['Sad1', 'Sad2', 'Cry'], SITS = ['SitIdle', 'SitIdle2', 'SitIdle3', 'SitIdle5'];
function fidget(c, m, dt) {
  if (m.userData.ambOwned || m.userData.still || m.userData.grips) return;
  const own = Array.isArray(m.userData.idles) ? m.userData.idles : null;   /* a game may give a body its own list (a gesture that fits who they are: Port Royal's sailor points and laughs) */
  const on = c.cur !== c.base ? c.cur : null; if (on && (on.loop === THREE.LoopOnce || (!own && !FIDGET_BASE.test(on.getClip().name)))) return;   /* a looping rest clip the game put them on (Abba sitting in the boat) counts as their base */
  if (c.idleT === undefined) c.idleT = 3 + Math.random() * 8; c.idleT -= dt; if (c.idleT > 0) return; c.idleT = 4 + Math.random() * 5;   /* never more than about 9 s on one clip: the life checks call 12 s with nothing changing frozen */
  const bn = (on || c.base).getClip().name; if (!own && !FIDGET_BASE.test(bn)) return;
  const sit = /^Sit(Idle|Disbelief)/.test(bn); if (m.userData.seatAnchor && !sit) return;   /* a seated person only ever gets another sitting clip, even from a game's own list (Abba in the boat was given a standing wave as the place changed) */   /* LookOverShoulder is left out: it turns the head about 85 degrees, past what the head check allows */   /* a seated person on another clip (a talk) is left alone */
  const ownSit = own && (sit || m.userData.seatAnchor) ? own.filter((k) => /^Sit/.test(k)) : null;
  const list = (own ? (ownSit ? (ownSit.length ? ownSit : SITS) : own) : sit ? SITS : SAD.includes(bn) ? SAD : m.userData.elder ? ['OldIdle', 'HeadTurn'] : ['HeadTurn', 'Idle']).filter((k) => k !== bn && CL[k] && idleOK(k));
  if (!list.length) return; const k = list[(Math.random() * list.length) | 0];
  c.fid = true; const loop = !own && (sit || SAD.includes(bn)); if (loop) c.play(k, false, 5 + Math.random() * 5); else c.play(k, true); if (on) c.home = bn;
  if (loop || (c.cur && c.cur.getClip().duration > 12)) c.timer = Math.min(c.timer || 99, 4 + Math.random() * 4);   /* a moment, not the whole clip: Mixamo's SitTalk runs 42 s. A short look round plays to its end: cut short, the head swung back faster than a person's can (Selassie's head check) */
  const a = c.cur; if (a && a.getClip().name === k) { a.timeScale = loop ? 0.8 + Math.random() * 0.4 : 0.9 + Math.random() * 0.15; if (loop) a.time = Math.random() * a.getClip().duration; } }   /* a look round plays from its start and no faster than 1.05: sped up, a head turned faster than a person can (Selassie's head check) */   /* each at its own speed, and a looping one from its own moment: two people side by side never move in step (Port Royal's camp) */   /* a sad or seated variant is held a few seconds (it loops), then back to the base clip */
/* tickVisible(dt): one call a frame for a game that lets the engine run its people. It updates every mixer whose body is shown and ticks that body's controller
   (idle variety, seats, one-shot clips ending), so nobody is left out because the game's own list missed them (Port Royal's 1670 buccaneers were never ticked). */
export function tickVisible(dt) { for (const mx of mixers) { const r = mx.getRoot(); let v = r.visible, o = r.parent; while (v && o) { v = o.visible; o = o.parent; } if (!v) continue; mx.update(dt); const c = r.userData && r.userData.anim; if (c && c.mx === mx && c.tick) c.tick(dt); } }
/* Hands at rest (owner, 17 November 2026: hands like claws on a talking woman). Mixamo's talking and gesture clips curl and spread the fingers hard; the plain Idle's hand
   hangs relaxed. Each finger of a standing clip is eased 60 per cent of the way to the Idle's hand, so a gesture still moves the hand but never makes a claw.
   Clips that hold something (GRIPS) keep their own fingers. One place for every game. */
const GRIPS = /Carry|Briefcase|Torch|Rifle|Pistol|Shoot|Drink|Write|Guitar|Piano|Sword|Box|Pray|Clap/;
const HAND_REST = 0.6;
function relaxHands(c) { const idle = CL.Idle; if (!idle) return; const q = new THREE.Quaternion(), r = new THREE.Quaternion();
  for (const t of c.tracks) { const m = t.name.match(/mixamorig:?((Left|Right)Hand(Thumb|Index|Middle|Ring|Pinky)\d)\.quaternion$/); if (!m) continue;
    const it = idle.tracks.find((k) => k.name === t.name); if (!it) continue; r.fromArray(it.values, 0); const v = t.values;
    for (let i = 0; i < v.length; i += 4) { q.fromArray(v, i).slerp(r, HAND_REST).toArray(v, i); } } }
/* Fingers together and gently bent at the knuckle (owner, 17 November 2026: the hands still looked ragged: the fingers hung straight, stiff and spread like a rake).
   A relaxed hand's fingers are held together and bend a little at every joint, a little more toward the little finger. The clips drive only the knuckle (joint 1), so the
   bend and the closing-up are put into those tracks once, when a clip is made; curlFingers bends joints 2 and 3. KNUCKLE: radians of bend; CLOSE: radians each finger
   turns toward the middle finger (index one way, ring and pinky the other). */
export const KNUCKLE = { Index: 0.18, Middle: 0.24, Ring: 0.3, Pinky: 0.36 }, CLOSE = { Index: -0.2, Middle: 0.0, Ring: 0.16, Pinky: 0.3 };   /* (about local x; minus brings the index toward the middle finger: checked by eye, 17 November 2026) */
function restFingers(c) { const g = globalThis, k1 = g.__k1 ?? 1, sp = g.__sp ?? 1, cax = new THREE.Vector3(0, 0, 1), sax = (g.__spax || 'x') === 'y' ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0), q = new THREE.Quaternion(), a = new THREE.Quaternion(), b = new THREE.Quaternion();
  for (const t of c.tracks) { const m = t.name.match(/mixamorig:?(Left|Right)Hand(Index|Middle|Ring|Pinky)1\.quaternion$/); if (!m) continue; const side = m[1] === 'Left' ? -1 : 1;
    a.setFromAxisAngle(cax, side * KNUCKLE[m[2]] * k1 * (g.__fingerSign || 1)); b.setFromAxisAngle(sax, side * CLOSE[m[2]] * sp); const v = t.values;
    for (let i = 0; i < v.length; i += 4) q.fromArray(v, i).multiply(a).multiply(b).toArray(v, i); } }
export const grounded = [];
const TOES = new WeakMap(), SOLES = new WeakMap();   /* not in userData: clones copy userData as plain JSON, which would break the bone references */
/* Where a foot touches the ground: the real lowest points of the shoe (or the bare foot), found once per body shape from its own vertices: the back of the heel, the ball of the foot and the tip of the toe.
   Pinning only the toe joint let the heel sink 3 to 5 cm into the ground at every heel strike. Each point is kept in its bone's own space, so it follows the foot through any animation and any body size. */
function solePoints(m) {
  const out = [], meshes = []; m.traverse((o) => { if (o.isSkinnedMesh && o.geometry.attributes.skinIndex) meshes.push(o); });
  let use = meshes.filter((o) => /Shoes|Sole|Boot/.test(o.material.name || '')); if (!use.length) use = meshes.filter((o) => /Skin|Body/.test(o.material.name || ''));
  const v = new THREE.Vector3(), best = {};   /* bone name -> { lowest y, the candidates near it } */
  for (const o of use) { let pts = SOLES.get(o.geometry);
    if (!pts) { pts = []; const g = o.geometry, P = g.attributes.position, SI = g.attributes.skinIndex, SW = g.attributes.skinWeight, bones = o.skeleton.bones;
      for (let i = 0; i < P.count; i++) { let k = 0, w = SW.getX(i); for (let c = 1; c < 4; c++) if (SW.getComponent(i, c) > w) { w = SW.getComponent(i, c); k = c; } const bi = SI.getComponent(i, k), nm = bones[bi] && bones[bi].name; if (!/mixamorig(Left|Right)(Foot|ToeBase|Toe_End)$/.test(nm || '')) continue;
        v.fromBufferAttribute(P, i).applyMatrix4(o.bindMatrix); pts.push([nm, bi, v.x, v.y, v.z]); }
      SOLES.set(g, pts); }
    for (const [nm, bi, x, y, z] of pts) { const b = best[nm] || (best[nm] = { low: 1e9, list: [] }); b.list.push([bi, x, y, z, o]); } }
  /* a foot tips forwards and backwards as it lands and pushes off, so keep the point that would touch first at each tilt: heel edge, flat sole, ball, toe tip */
  for (const nm in best) { const b = best[nm], seen = new Set(); for (let a = -70; a <= 70; a += 14) { const ca = Math.cos(a * Math.PI / 180), sa = Math.sin(a * Math.PI / 180); let top = null, d = -1e9; for (const c of b.list) { const k = -c[2] * ca + c[3] * sa; if (k > d) { d = k; top = c; } }
      if (top && !seen.has(top)) { seen.add(top); out.push({ bone: top[4].skeleton.bones[top[0]], p: new THREE.Vector3(top[1], top[2], top[3]).applyMatrix4(top[4].skeleton.boneInverses[top[0]]) }); } } }
  return out; }
/* legIK(model, 'Left' | 'Right', d): raise that foot by d metres by bending the knee and turning the thigh (two-bone IK), keeping the knee in the plane it already bends in. */
const _ik = [0, 1, 2, 3, 4, 5].map(() => new THREE.Vector3()), _iq = new THREE.Quaternion(), _iq2 = new THREE.Quaternion();
function worldRotate(b, q) { b.getWorldQuaternion(_iq2); const pq = b.parent.getWorldQuaternion(new THREE.Quaternion()).invert(); b.quaternion.copy(pq.multiply(q.clone().multiply(_iq2))); b.updateMatrixWorld(true); }
function legIK(m, k, d) { const up = m.getObjectByName('mixamorig' + k + 'UpLeg'), kn = m.getObjectByName('mixamorig' + k + 'Leg'), ft = m.getObjectByName('mixamorig' + k + 'Foot'); if (!up || !kn || !ft) return;
  const H = up.getWorldPosition(_ik[0]), K = kn.getWorldPosition(_ik[1]), A = ft.getWorldPosition(_ik[2]), T = _ik[3].copy(A).add(_ik[4].set(0, d, 0)), a = H.distanceTo(K), b = K.distanceTo(A), c0 = H.distanceTo(A), c1 = Math.min(a + b - 1e-4, H.distanceTo(T));
  const ang = (c) => Math.acos(Math.min(1, Math.max(-1, (a * a + b * b - c * c) / (2 * a * b)))), bend = ang(c1) - ang(c0);
  const axis = _ik[5].copy(K).sub(H).cross(_ik[4].copy(A).sub(K)); if (axis.lengthSq() < 1e-10) axis.set(1, 0, 0).applyQuaternion(up.getWorldQuaternion(_iq)); axis.normalize();
  worldRotate(kn, _iq.setFromAxisAngle(axis, -bend));   /* a straighter or more bent knee, so hip to ankle is as long as hip to target */
  const A2 = ft.getWorldPosition(_ik[2]); worldRotate(up, _iq.setFromUnitVectors(A2.sub(H).normalize(), _ik[4].copy(T).sub(H).normalize()));   /* then the thigh swings the ankle onto the target */
  ft.getWorldQuaternion(_iq2); }
export function groundFeet(m) { if (m.userData.seatAnchor) { anchorSeat(m); return; }   /* a seated person stays on the seat (engine/placement.js) */
  let t = TOES.get(m); if (!t) { t = { soles: solePoints(m), toes: ['Left', 'Right'].map((s) => m.getObjectByName('mixamorig' + s + 'ToeBase')).filter(Boolean) }; TOES.set(m, t); }
  if (t.soles.length) { m.updateMatrixWorld(true); const gAt = m.userData.groundAt; let low = 1e9; const fy = { Left: 1e9, Right: 1e9 };
    for (const s of t.soles) { _gp.copy(s.p).applyMatrix4(s.bone.matrixWorld); low = Math.min(low, _gp.y); if (gAt) { const k = /Left/.test(s.bone.name) ? 'Left' : 'Right'; if (_gp.y < fy[k]) fy[k] = _gp.y; } }
    if (gAt) {   /* userData.groundAt(x, z): standing and walking on a slope (Nanny Town, 17 November 2026: soldiers, then Quamin and Mama, sank into the path).
      The clip was made on a flat floor. Here the floor is the lower of the two grounds under the feet while that foot is down, and it rises to the higher ground as
      that foot lifts, so the body climbs and settles smoothly through each step. The foot over higher ground bends its knee (legIK) to stand on it. Each foot on the
      ground also tips to the slope along its own length, so toe and heel both meet the hill. */
      if (!t.ft) t.ft = { Left: m.getObjectByName('mixamorigLeftFoot'), Right: m.getObjectByName('mixamorigRightFoot'), LeftT: m.getObjectByName('mixamorigLeftToeBase'), RightT: m.getObjectByName('mixamorigRightToeBase') };
      const g = {}, w = {}; for (const k of ['Left', 'Right']) { const a = t.ft[k] ? t.ft[k].getWorldPosition(_ik[0]) : m.position; w[k] = 1 - Math.min(1, Math.max(0, (fy[k] - low - 0.02) / 0.12)); g[k] = gAt(a.x, a.z); if (w[k] < 1 && t.ft[k + 'T']) { const b = t.ft[k + 'T'].getWorldPosition(_ik[1]); g[k] += Math.max(0, gAt(b.x, b.z) - g[k]) * (1 - w[k]); } }   /* g: the ground under each foot; w: 1 for a foot on the floor in the clip, 0 for one lifted 14 cm or more. A lifted foot also clears the ground under its toe, so it does not swing through a rising path. */
      const L = g.Left <= g.Right ? 'Left' : 'Right', H = L === 'Left' ? 'Right' : 'Left', G = g[L] + (g[H] - g[L]) * (1 - w[L]);   /* the floor the clip stands on: the lower ground while the foot over it is down, rising to the higher ground as that foot lifts. On flat ground both are the same, so nothing changes there. */
      const e = G - 0.008 - low, st = t.set ? Math.max(-0.08, Math.min(0.06, e * 0.7)) : e; m.position.y += st; t.set = true; m.updateMatrixWorld(true);   /* the body rises at most 6 cm and settles at most 8 cm a frame, so it climbs and settles instead of jumping */
      for (const k of ['Left', 'Right']) { const lift = Math.min(0.32, g[k] - G + (e - st)); if (lift > 0.004) legIK(m, k, lift); }   /* a foot over higher ground than the floor bends its knee to stand on it (a flat walk's foot cannot reach down, so the foot over lower ground stays in the air until the body comes down); what the body has not yet done, the knees do */
      for (const k of ['Left', 'Right']) { if (w[k] <= 0.05) continue;
        const F = t.ft[k], T = t.ft[k + 'T']; if (F && T) { const a = F.getWorldPosition(_ik[0]), b = T.getWorldPosition(_ik[1]), dx = b.x - a.x, dz = b.z - a.z, L = Math.hypot(dx, dz);
          if (L > 0.03) { const s = (gAt(b.x, b.z) - gAt(a.x, a.z)) / L, th = Math.max(-0.6, Math.min(0.6, Math.atan(s))) * w[k]; if (Math.abs(th) > 0.01) worldRotate(F, _iq.setFromAxisAngle(_ik[2].set(-dz / L, 0, dx / L), th)); } } }   /* axis = the foot's direction x up: a turn about it lifts the toe */
      return; }
    const e = (m.userData.ground || 0) - 0.008 - low;
    m.position.y += (t.set && Math.abs(e) < 0.06) ? e * (e > 0 ? 0.7 : 0.4) : e; t.set = true; return; }   /* small corrections are eased in over a few frames, so the body never jerks when the other heel lands; a big one (a new place to stand) is made at once */
  if (!t.toes.length) return; m.updateMatrixWorld(true); let low = 1e9; for (const b of t.toes) low = Math.min(low, b.getWorldPosition(_gp).y); m.position.y += ((m.userData.ground || 0) + 0.035 - low); }

/* ---------- a look added on top of a clip (shared by every game: owner, 17 November 2026, "always defer to the master engine") ----------
   A head that turns toward you is a turn added to the clip's pose after the mixer has run. The mixer only writes a bone again when its clip value changes, so on a
   still track (an Idle head) the pose is not set again, each frame's turn adds to the last, and the head goes right round (Selassie, Tivoli, then Port Royal).
   Every game that turns a bone on top of a clip does it between these two calls:
     lookBegin(bones)   before the turns: a bone found exactly as we left it is first put back to the clip's own pose
     lookEnd(bones)     after the turns: remember what we left
   bones is an array (null entries are skipped). One guard, in one place: do not copy it into a game. */
const LOOKED = new WeakMap();
export function lookBegin(bones) { for (const b of bones) { if (!b || !b.isObject3D) continue;   /* a real bone only: something stored in userData and copied with a body is a dead copy */ let t = LOOKED.get(b); if (!t) LOOKED.set(b, t = { base: new THREE.Quaternion(), after: new THREE.Quaternion(), on: false }); if (t.on && b.quaternion.equals(t.after)) b.quaternion.copy(t.base); t.base.copy(b.quaternion); } }
export function lookEnd(bones) { for (const b of bones) { if (!b || !b.isObject3D) continue; const t = LOOKED.get(b); if (t) { t.after.copy(b.quaternion); t.on = true; } } }
