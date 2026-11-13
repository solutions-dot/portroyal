/* engine/anim.js: one Mixamo clip library shared by every character (same skeleton).
   loadClips(gltf) fills CL; animate(model, clipName) gives each person a controller. See docs/ENGINE.md. */
import * as THREE from 'three';
export const CL = {};          /* clip name -> AnimationClip, from shared/anims */
export const mixers = [];      /* every mixer made by animate(); the game updates the visible ones each frame */
let peopleClip = null; export function setFallbackClip(c) { peopleClip = c; }   /* used when a named clip is missing */
export function loadClips(gltf) { for (const a of gltf.animations) CL[a.name] = a; }
const _gp = new THREE.Vector3();
export const HIPS_Y = /^(Sit|Injured|StumbleBack|JogStumble|Terrified|Pray|Sad|Sword|Slash|Block|Punch|Laugh|Sheathe|Draw|Write)/;
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
export function clipFor(name, keepHips) { let src = name === 'WalkM' ? walkM() : CL[name]; if (!src) return null; if (name === 'SitDrink' && !CL._sd) { CL._sd = THREE.AnimationUtils.subclip(src, 'SitDrink', 140, 455, 30); } if (name === 'SitDrink') src = CL._sd; const c = src.clone(); keepHips = keepHips || HIPS_Y.test(name);
  c.tracks = c.tracks.filter((t) => { if (t.name.endsWith('.scale')) return false; if (!t.name.endsWith('.position')) return true; if (!keepHips || !/Hips/.test(t.name)) return false;
    const v = t.values; let x0 = v[0], z0 = v[2]; if (/^Sit/.test(name) && CL.Idle) { const it = CL.Idle.tracks.find((k) => k.name === t.name); if (it) { x0 = it.values[0]; z0 = it.values[2]; } }   /* seated clips: keep the hips over the spot we put him, not where the clip wandered to */
 for (let i = 0; i < v.length; i += 3) { v[i] = x0; v[i + 2] = z0; } return true; });   /* running stays in place; the game moves her */
  if (/^(Walk|WalkM|Run|Carry|Tread|SadWalk)$/.test(name)) seamLoop(c);
  if (/^Sit/.test(name)) { const t = c.tracks.find((k) => /Hips\.quaternion$/.test(k.name)); if (t) { const v = t.values, q0 = new THREE.Quaternion(v[0], v[1], v[2], v[3]), f = new THREE.Vector3(0, 0, 1).applyQuaternion(q0), fix = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.atan2(f.x, f.z)), q = new THREE.Quaternion();
    for (let i = 0; i < v.length; i += 4) { q.set(v[i], v[i + 1], v[i + 2], v[i + 3]).premultiply(fix); v[i] = q.x; v[i + 1] = q.y; v[i + 2] = q.z; v[i + 3] = q.w; } } }   /* seated clips face the way we set the person, not the way the clip turned */
  return c; }
export function animate(m, name, mixerIn, baseAct) { const clip = (name && clipFor(name)) || clipFor('Idle') || peopleClip; if (!clip && !baseAct) return;
  const mx = mixerIn || new THREE.AnimationMixer(m), base = baseAct || mx.clipAction(clip); if (!baseAct) { base.play(); base.time = Math.random() * clip.duration; } if (!mixerIn) mixers.push(mx);
  const acts = {}, ctl = { mx, base, cur: base, timer: 0,
    get(n) { if (!acts[n]) { const c = clipFor(n); if (!c) return null; acts[n] = mx.clipAction(c); } return acts[n]; },
    play(n, once, hold) { const a = n ? this.get(n) : this.base; if (!a || a === this.cur) return; a.reset(); a.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat); a.clampWhenFinished = !!once; a.fadeIn(0.35).play(); this.cur.fadeOut(0.35); this.cur = a; this.timer = once ? Math.max(0.5, a.getClip().duration - 0.35) : (hold || 0); },
    rest() { this.play(null); },
    tick(dt) { if (this.timer > 0) { this.timer -= dt; if (this.timer <= 0 && this.cur !== this.base) this.rest(); } } };
  m.userData.anim = ctl; return ctl; }
export const grounded = [];
const TOES = new WeakMap();   /* not in userData: clones copy userData as plain JSON, which would break the bone references */
export function groundFeet(m) { let t = TOES.get(m); if (!t) { t = ['Left', 'Right'].map((s) => m.getObjectByName('mixamorig' + s + 'ToeBase')).filter(Boolean); TOES.set(m, t); } if (!t.length) return; m.updateMatrixWorld(true); let low = 1e9; for (const b of t) low = Math.min(low, b.getWorldPosition(_gp).y); m.position.y += ((m.userData.ground || 0) + 0.035 - low); }
