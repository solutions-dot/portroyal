/* Development check (?test=heads, and part of ?test=all and ?test=audit): heads and necks that turn further or faster than a person can,
   in every place and through the whole arrival cinematic. Written after the owner saw heads "spinning around like a gig" (November 2026):
   the shared ambient head turn added to itself every frame on a clip whose head track never changes (fixed in engine/ambient.js).
   It runs the game's real frame loop with a stepped clock (the browser's own frames are paused and nothing is drawn), so the
   ambient life, the followers, the director and the mixers all move exactly as in play. For every person in view it measures the
   head against the chest: a turn more than LIMIT.yaw to either side, a nod more than LIMIT.pitch, or a turn faster than LIMIT.speed
   (over 0.1 s). In the cinematic it also tests the camera: never inside the aircraft, the steps or a person, never under the ground,
   and never on an empty view (nothing of the event in the frame) for more than 2 seconds. */
import * as THREE from "three";
import { DC6, radiusAt } from "./aircraft.js";
import { closeAll } from "./ui.js";
export const LIMIT = { yaw: 80, pitch: 60, speed: 320 };
const D2R = Math.PI / 180;
const AXES = new WeakMap();
/* each bone's own forward and up, from the bind pose (where every body faces +z and stands up +y) */
function axesOf(m) {
  let a = AXES.get(m);
  if (a) return a;
  const sk = [];
  m.traverse((o) => o.isSkinnedMesh && sk.push(o));
  const s = sk[0]?.skeleton;
  if (!s) return null;
  const get = (name) => {
    const i = s.bones.findIndex((b) => b.name === "mixamorig" + name);
    if (i < 0) return null;
    const q = new THREE.Quaternion();
    new THREE.Matrix4().copy(s.boneInverses[i]).invert().decompose(new THREE.Vector3(), q, new THREE.Vector3());
    q.invert();
    return {
      bone: s.bones[i],
      f: new THREE.Vector3(0, 0, 1).applyQuaternion(q),
      u: new THREE.Vector3(0, 1, 0).applyQuaternion(q),
    };
  };
  a = { chest: get("Spine2"), head: get("Head") };
  if (!a.chest || !a.head) a = null;
  AXES.set(m, a);
  return a;
}
const _q = new THREE.Quaternion(),
  _f = new THREE.Vector3(),
  _u = new THREE.Vector3(),
  _r = new THREE.Vector3(),
  _h = new THREE.Vector3();
export function headAngles(m) {
  const a = axesOf(m);
  if (!a) return null;
  a.chest.bone.getWorldQuaternion(_q);
  _f.copy(a.chest.f).applyQuaternion(_q);
  _u.copy(a.chest.u).applyQuaternion(_q);
  _r.crossVectors(_u, _f);
  a.head.bone.getWorldQuaternion(_q);
  _h.copy(a.head.f).applyQuaternion(_q);
  return {
    yaw: Math.atan2(_h.dot(_r), _h.dot(_f)) / D2R,
    pitch: Math.asin(Math.max(-1, Math.min(1, _h.dot(_u)))) / D2R,
  };
}
function cameraIssue(Q, camera) {
  const c = camera.position;
  if (c.y < 0.3) return "under the ground";
  const p = Q.props.plane;
  if (p) {
    const l = p.worldToLocal(c.clone());
    const r = radiusAt(l.x);
    if (r > 0 && Math.hypot(l.y - DC6.Y0, l.z) < r + 0.3) return "inside the aircraft's body";
    const s = Math.abs(l.z),
      le = 2.0 + (-0.9 - 2.0) * Math.min(1, Math.max(0, (s - 1) / 16.9)),
      te = -4.0 + (-2.5 + 4.0) * Math.min(1, Math.max(0, (s - 1) / 16.9)),
      wy = 2.05 + s * 0.065;
    if (s < 18.2 && l.x > te - 0.4 && l.x < le + 0.4 && Math.abs(l.y - wy - 0.15) < 0.55) return "inside a wing";
    for (const pr of p.userData.props) {
      const q = pr.position;
      if (Math.abs(l.x - q.x) < 0.6 && Math.hypot(l.y - q.y, l.z - q.z) < 2.2) return "inside a propeller";
    }
  }
  const st = Q.props.stairs;
  if (st?.visible) {
    const l = st.worldToLocal(c.clone()),
      plan = st.userData.plan;
    if (plan && Math.abs(l.x) < 0.75 && l.z > -0.7 && l.z < plan.end + 0.2) {
      const below = plan.sill * (1 - Math.max(0, l.z - 0.3) / (plan.end - 0.3));
      if (l.y < below + 1.0) return "inside the boarding steps";
    }
  }
  for (const n of [...Q.people, ...Q.extras]) {
    if (!n.m.visible) continue;
    const m = n.m.position,
      h = 1.75 * (n.m.scale.y || 1);
    if (Math.hypot(c.x - m.x, c.z - m.z) < 0.38 && c.y > m.y && c.y < m.y + h + 0.1) return "inside " + (n.id || n.base);
  }
  return null;
}
const _fr = new THREE.Frustum(),
  _pm = new THREE.Matrix4();
function somethingInView(Q, camera) {
  camera.updateMatrixWorld();
  _pm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  _fr.setFromProjectionMatrix(_pm);
  const p = Q.props.plane;
  if (p && _fr.containsPoint(p.position.clone().setY(3))) return true;
  let n = 0;
  for (const x of [...Q.people, ...Q.extras]) if (x.m.visible && _fr.containsPoint(x.m.position.clone().setY(x.m.position.y + 1.2)) && x.m.position.distanceTo(camera.position) < 40) n++;
  return n >= 3 || Q.people.some((x) => x.historical && x.m.visible && _fr.containsPoint(x.m.position));
}
/* A: the dev object (window.__SEL). Returns { lines, stats }. */
export async function headCheck(A, { seconds = 16, cine = true } = {}) {
  const lines = [],
    stats = [],
    dt = 1 / 30;
  const render = A.renderer.render,
    raf = window.requestAnimationFrame;
  window.requestAnimationFrame = () => 0;
  A.renderer.render = () => {};
  await new Promise((r) => setTimeout(r, 60));
  let clock = performance.now() + 1000;
  const step = () => {
    clock += dt * 1000;
    A.frame(clock);
  };
  const seen = new Map();
  const sample = (label, t) => {
    const Q = A.world();
    for (const n of [...Q.people, ...Q.extras]) {
      if (!n.m.visible) continue;
      const g = headAngles(n.m);
      if (!g) continue;
      const id = label + " " + (n.id || n.base),
        s = seen.get(id) || { hist: [], worst: null };
      s.hist.push([t, g.yaw, g.pitch]);
      if (s.hist.length > 4) s.hist.shift();
      const clip = (n.ctl || n.m.userData.anim)?.cur?.getClip().name || "?";
      const bad = (what) => {
        if (!s.worst) s.worst = `${id}: ${what} (${clip} at ${t.toFixed(1)} s)`;
      };
      if (Math.abs(g.yaw) > LIMIT.yaw) bad(`head turned ${g.yaw.toFixed(0)} degrees from the chest`);
      if (Math.abs(g.pitch) > LIMIT.pitch) bad(`head tipped ${g.pitch.toFixed(0)} degrees`);
      if (s.hist.length === 4) {
        const [t0, y0] = s.hist[0],
          rate = Math.abs(((g.yaw - y0 + 540) % 360) - 180) / Math.max(1e-3, t - t0);
        if (rate > LIMIT.speed && t - t0 < 0.2) bad(`head turning ${rate.toFixed(0)} degrees a second`);
      }
      seen.set(id, s);
    }
  };
  /* the four places, with the player walking a circle round the first story person so heads turn to follow */
  for (const [label, stage] of [
    ["yard", 20],
    ["memory", 15],
    ["road", 30],
    ["airport", 50],
  ]) {
    await A.go(stage);
    closeAll();
    A.S.started = true;
    const Q = A.world(),
      who = Q.people.find((n) => !n.historical) || { x: Q.start.x, z: Q.start.z };
    for (let i = 0, N = Math.round(seconds / dt); i < N; i++) {
      const a = (i / N) * Math.PI * 4;
      A.S.x = who.x + Math.sin(a) * 2.2;
      A.S.z = who.z + Math.cos(a) * 2.2;
      if (A.blocked(Q, A.S.x, A.S.z, 0.25)) {
        A.S.x = Q.start.x;
        A.S.z = Q.start.z;
      }
      step();
      sample(label, i * dt);
    }
  }
  if (cine) {
    await A.go(51);
    closeAll();
    const Q = A.world(),
      D = A.DIR;
    if (!D.on) D.start();
    D.fast = false;
    let empty = 0,
      cams = new Map();
    for (let i = 0; D.on && i < 110 / dt; i++) {
      step();
      const t = D.time;
      sample("cinematic", t);
      const c = D.on && cameraIssue(Q, A.camera);
      if (c && !cams.has(c)) cams.set(c, t);
      if (D.on && !somethingInView(Q, A.camera)) empty += dt;
      else {
        if (empty > 2) lines.push(`cinematic: an empty view for ${empty.toFixed(1)} s, ending at ${t.toFixed(1)} s`);
        empty = 0;
      }
    }
    for (const [c, t] of cams) lines.push(`cinematic camera ${c} at ${t.toFixed(1)} s`);
    if (D.on) D.stop();
  }
  for (const s of seen.values()) if (s.worst) lines.push(s.worst);
  stats.push(`HEADS sampled ${seen.size} people`);
  A.renderer.render = render;
  window.requestAnimationFrame = raf;
  requestAnimationFrame(A.frame);
  return { lines, stats };
}
