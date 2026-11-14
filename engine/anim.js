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
  for (const t of c.tracks) { const v = t.values, tm = t.times, n = tm.length; if (n < 3) continue; const T0 = tm[0], T = tm[n - 1] - T0 || 1;
    if (/quaternion$/.test(t.name)) { qa.fromArray(v, 0); qb.fromArray(v, (n - 1) * 4); err.copy(qb).invert().premultiply(qa);   /* err * last = first */
      for (let i = 1; i < n; i++) { part.copy(id).slerp(err, (tm[i] - T0) / T); qb.fromArray(v, i * 4).premultiply(part); qb.toArray(v, i * 4); } }
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
export const WALKS = /^(Walk|WalkM|Run|Carry|SadWalk)$/;
export function animate(m, name, mixerIn, baseAct) { const clip = (name && clipFor(name)) || clipFor('Idle') || peopleClip; if (!clip && !baseAct) return;
  const mx = mixerIn || new THREE.AnimationMixer(m), base = baseAct || mx.clipAction(clip); if (!baseAct) { base.play(); base.time = Math.random() * clip.duration; } if (!mixerIn) mixers.push(mx);
  const acts = {}, ctl = { mx, base, cur: base, timer: 0,
    get(n) { if (!acts[n]) { const c = clipFor(n); if (!c) return null; acts[n] = mx.clipAction(c); } return acts[n]; },
    play(n, once, hold) { const a = n ? this.get(n) : this.base; if (!a || a === this.cur) return; a.reset(); a.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat); a.clampWhenFinished = !!once; a.fadeIn(0.35).play(); this.cur.fadeOut(0.35); this.cur = a; this.timer = once ? Math.max(0.5, a.getClip().duration - 0.35) : (hold || 0); },
    rest() { this.play(null); },
    pace(v, lo = 0.55, hi = 1.9) { const a = this.cur, c = a.getClip(); if (!WALKS.test(c.name)) return 1; const s = strideOf(m, c); if (s > 0.05) a.timeScale = Math.max(lo, Math.min(hi, v * c.duration / s)); return a.timeScale; },   /* play the walk at the pace that fits ground speed v (metres a second) on this body, so the feet do not slide */
    tick(dt) { if (this.timer > 0) { this.timer -= dt; if (this.timer <= 0 && this.cur !== this.base) this.rest(); } } };
  m.userData.anim = ctl; return ctl; }
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
export function groundFeet(m) { let t = TOES.get(m); if (!t) { t = { soles: solePoints(m), toes: ['Left', 'Right'].map((s) => m.getObjectByName('mixamorig' + s + 'ToeBase')).filter(Boolean) }; TOES.set(m, t); }
  if (t.soles.length) { m.updateMatrixWorld(true); let low = 1e9; for (const s of t.soles) low = Math.min(low, _gp.copy(s.p).applyMatrix4(s.bone.matrixWorld).y); const e = (m.userData.ground || 0) - 0.008 - low;   /* the sole rests a hair into the ground, so no gap ever shows under a shoe */
    m.position.y += (t.set && Math.abs(e) < 0.06) ? e * (e > 0 ? 0.6 : 0.4) : e; t.set = true; return; }   /* small corrections are eased in over a few frames, so the body never jerks when the other heel lands; a big one (a new place to stand) is made at once */
  if (!t.toes.length) return; m.updateMatrixWorld(true); let low = 1e9; for (const b of t.toes) low = Math.min(low, b.getWorldPosition(_gp).y); m.position.y += ((m.userData.ground || 0) + 0.035 - low); }
