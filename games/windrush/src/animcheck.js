/* Development check (?test=anim, and part of ?test=all): does everyone in view look alive and move like a person? Written for the owner's
   rule that nobody stands about like a zombie (November 2026), after Selassie's head check (games/selassie/src/headcheck.js) and Tivoli's
   scene check (games/tivoli/src/scenecheck.js). It runs the game's real frame loop with a stepped clock (nothing is drawn), so the ambient
   life, the story people, the guide and the camera scenes move exactly as in play, and for every person in the camera's view it reports:
   - frozen: no step, turn, clip change or head turn for more than FROZEN seconds;
   - in step: three or more people in view on the same clip at the same moment of it (a crowd moving as one);
   - head: a head turned more than LIMIT.yaw from the chest, tipped more than LIMIT.pitch, or turning faster than LIMIT.speed;
   - running in place: a walking or running clip while standing still;
   - sliding: moving over the ground on a standing clip.
   In each camera scene it also checks the camera: never under the water or the quay, never inside the ship or a person, never on an empty
   view (no person and no ship in the picture) for more than 2 seconds. */
import * as THREE from "three";
import { WALKS, SEATED } from "../../../engine/anim.js";
import { SHIP } from "./ship.js";
import { closeAll } from "./ui.js";
export const LIMIT = { yaw: 80, pitch: 60, speed: 320 },
  FROZEN = 12;
const D2R = Math.PI / 180,
  AXES = new WeakMap();
function axesOf(m) {
  let a = AXES.get(m);
  if (a !== undefined) return a;
  const sk = [];
  m.traverse((o) => o.isSkinnedMesh && sk.push(o));
  const s = sk[0]?.skeleton;
  a = null;
  if (s) {
    const get = (name) => {
      const i = s.bones.findIndex((b) => b.name === "mixamorig" + name);
      if (i < 0) return null;
      const q = new THREE.Quaternion();
      new THREE.Matrix4().copy(s.boneInverses[i]).invert().decompose(new THREE.Vector3(), q, new THREE.Vector3());
      q.invert();
      return { bone: s.bones[i], f: new THREE.Vector3(0, 0, 1).applyQuaternion(q), u: new THREE.Vector3(0, 1, 0).applyQuaternion(q) };
    };
    a = { chest: get("Spine2"), head: get("Head") };
    if (!a.chest || !a.head) a = null;
  }
  AXES.set(m, a);
  return a;
}
const _q = new THREE.Quaternion(),
  _f = new THREE.Vector3(),
  _u = new THREE.Vector3(),
  _r = new THREE.Vector3(),
  _h = new THREE.Vector3(),
  _p = new THREE.Vector3();
export function headAngles(m) {
  const a = axesOf(m);
  if (!a) return null;
  a.chest.bone.getWorldQuaternion(_q);
  _f.copy(a.chest.f).applyQuaternion(_q);
  _u.copy(a.chest.u).applyQuaternion(_q);
  _r.crossVectors(_u, _f);
  a.head.bone.getWorldQuaternion(_q);
  _h.copy(a.head.f).applyQuaternion(_q);
  return { yaw: Math.atan2(_h.dot(_r), _h.dot(_f)) / D2R, pitch: Math.asin(Math.max(-1, Math.min(1, _h.dot(_u)))) / D2R };
}
function dominant(ctl) {
  let best = null,
    bw = 0;
  for (const x of ctl.mx._actions) {
    const w = x.isRunning() ? x.getEffectiveWeight() : 0;
    if (w > bw) {
      bw = w;
      best = x;
    }
  }
  return best || ctl.cur;
}
const _fr = new THREE.Frustum(),
  _pm = new THREE.Matrix4();
function frustum(camera) {
  camera.updateMatrixWorld();
  _pm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  _fr.setFromProjectionMatrix(_pm);
  return _fr;
}
function everyone(Q) {
  return [...Q.people, ...Q.extras, ...(Q.shipExtras || [])].filter((n) => n.m.visible);
}
function cameraIssue(Q, camera) {
  const c = camera.position;
  if (Q.sea && c.y < Q.sea.level + 0.4) return "at or under the water";
  if (!Q.sea && c.y < 0.3) return "under the ground";
  const s = Q.props.ship;
  if (s && !Q.deckOnShip) {
    const l = s.worldToLocal(c.clone());
    if (Math.abs(l.x) < SHIP.L / 2 && Math.abs(l.z) < SHIP.B / 2 + 0.3 && l.y > SHIP.keel && l.y < SHIP.deck + 1.2) return "inside the ship's hull";
    if (Math.abs(l.x) < SHIP.L * 0.25 && Math.abs(l.z) < 9 && l.y > SHIP.deck + 1.2 && l.y < SHIP.deck + 9) return "inside the ship's superstructure";
  }
  for (const n of everyone(Q)) {
    n.m.getWorldPosition(_p);
    const h = 1.75 * (n.m.scale.y || 1);
    if (Math.hypot(c.x - _p.x, c.z - _p.z) < 0.4 && c.y > _p.y && c.y < _p.y + h + 0.1) return "inside " + (n.id || n.base);
  }
  return null;
}
function somethingInView(Q, camera) {
  const fr = frustum(camera);
  const s = Q.props.ship;
  if (s && fr.intersectsSphere(new THREE.Sphere(s.getWorldPosition(new THREE.Vector3()).setY(8), 30)) && s.position.distanceTo(camera.position) < 260) return true;
  return everyone(Q).some((n) => fr.containsPoint(n.m.getWorldPosition(_p).setY(_p.y + 1.1)) && _p.distanceTo(camera.position) < 40);
}
/* A: the dev object (window.__WIND). places: [[label, stage, { x, z } the person to circle]]. Returns { lines, stats }. */
export async function animCheck(A, { seconds = 20, films = true, only = null } = {}) {
  const lines = [],
    stats = [],
    dt = 1 / 30,
    render = A.renderer.render,
    raf = window.requestAnimationFrame;
  A.renderer.render = () => {};
  window.requestAnimationFrame = () => 0;
  await new Promise((r) => setTimeout(r, 60));
  let clock = performance.now() + 1000;
  const seen = new Map();
  const state = (label, n) => {
    const id = label + " " + (n.id || n.base);
    let s = seen.get(id);
    if (!s) seen.set(id, (s = { id, last: null, still: 0, inplace: 0, slide: 0, since: 0, hist: [], told: new Set() }));
    return s;
  };
  const tell = (s, kind, text) => {
    if (s.told.has(kind)) return;
    s.told.add(kind);
    lines.push(`${s.id}: ${text}`);
  };
  const sample = (label, t, Q) => {
    const fr = frustum(A.camera),
      groups = new Map();
    for (const n of everyone(Q)) {
      const s = state(label, n),
        ctl = n.ctl || n.m.userData.anim;
      if (!ctl) continue;
      const act = dominant(ctl),
        clip = act.getClip().name,
        world = n.m.getWorldPosition(new THREE.Vector3()),
        wp = n.zone === "ship" ? n.m.position.clone() : world, // people standing on the ship are judged in the ship's frame: she moves, they do not slide
        ry = n.m.rotation.y,
        g = headAngles(n.m),
        inView = fr.containsPoint(world.clone().setY(world.y + 1.1)) && world.distanceTo(A.camera.position) < 30;
      const L = s.last;
      if (L) {
        const v = Math.hypot(wp.x - L.x, wp.z - L.z) / dt,
          turn = Math.abs(Math.atan2(Math.sin(ry - L.ry), Math.cos(ry - L.ry))) / dt,
          moved = v > 0.05 || turn > 0.05 || clip !== L.clip || (g && L.g && (Math.abs(g.yaw - L.g.yaw) > 0.4 || Math.abs(g.pitch - L.g.pitch) > 0.4));
        s.since = moved ? 0 : s.since + dt;
        if (s.since > FROZEN && inView) tell(s, "frozen", `stands frozen for over ${FROZEN} s (${clip} at ${t.toFixed(1)} s)`);
        const walking = WALKS.test(clip),
          seated = SEATED.test(clip) || !!n.m.userData.seatAnchor;
        s.inplace = walking && v < 0.08 && turn < 1.2 ? s.inplace + dt : 0;
        if (s.inplace > 0.5) tell(s, "inplace", `plays the walking clip ${clip} while standing still (at ${t.toFixed(1)} s)`);
        s.slide = !walking && !seated && v > 0.3 && !(n.fol && v < 0.6) ? s.slide + dt : 0;
        if (s.slide > 0.25) tell(s, "slide", `moves at ${v.toFixed(2)} m/s on the standing clip ${clip} (feet slide; at ${t.toFixed(1)} s)`);
      }
      if (g) {
        if (Math.abs(g.yaw) > LIMIT.yaw) tell(s, "yaw", `head turned ${g.yaw.toFixed(0)} degrees from the chest (${clip} at ${t.toFixed(1)} s)`);
        if (Math.abs(g.pitch) > LIMIT.pitch) tell(s, "pitch", `head tipped ${g.pitch.toFixed(0)} degrees (${clip} at ${t.toFixed(1)} s)`);
        s.hist.push([t, g.yaw]);
        if (s.hist.length > 4) s.hist.shift();
        if (s.hist.length === 4) {
          const [t0, y0] = s.hist[0],
            rate = Math.abs(g.yaw - y0) / Math.max(1e-3, t - t0);
          if (rate > LIMIT.speed) tell(s, "speed", `head turning ${rate.toFixed(0)} degrees a second (${clip} at ${t.toFixed(1)} s)`);
        }
      }
      s.last = { x: wp.x, z: wp.z, ry, clip, g };
      if (inView && !WALKS.test(clip)) {
        const k = clip + "|" + label;
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k).push([n, (act.time % act.getClip().duration) / act.getClip().duration, act.timeScale]);
      }
    }
    // three or more in view at the same moment of one clip
    for (const [k, list] of groups) {
      if (list.length < 3) continue;
      list.sort((a, b) => a[1] - b[1]);
      for (let i = 0; i + 2 < list.length; i++)
        if (list[i + 2][1] - list[i][1] < 0.03 && Math.abs(list[i + 2][2] - list[i][2]) < 0.02) {
          const key = "sync " + k;
          if (!seen.has(key)) {
            seen.set(key, { told: new Set() });
            lines.push(`${label}: ${list.length} people in view move as one on ${k.split("|")[0]} (at ${t.toFixed(1)} s)`);
          }
        }
    }
  };
  const step = () => {
    clock += dt * 1000;
    A.tick(dt, clock);
  };
  const PLACES = [
    ["yard", 10, "may"],
    ["leaving", 20, "pearl"],
    ["deck", 30, "lionel"],
    ["tilbury", 40, "porter"],
    ["brixton 1948", 50, "may"],
    ["Celia's room", 55, "celia"],
    ["brixton 1962", 60, "sam"],
    ["jamaica 1962", 64, "pearl"],
    ["home 2018", 72, "iris"],
    ["walk to the gate", 75, "iris"],
    ["advice centre", 80, "asha"],
  ].filter((p) => !only || only.includes(p[0]));
  for (const [label, stage, who] of PLACES) {
    A.chapterState(stage);
    await A.go(stage);
    closeAll();
    A.DIR.stop();
    A.S.started = true;
    A.S.view = null;
    const Q = A.world(),
      p = Q.people.find((n) => n.id === who) || { x: Q.start.x, z: Q.start.z };
    const N = Math.round(seconds / dt);
    for (let i = 0; i < N; i++) {
      // walk a slow loop near the story person, looking at them, so heads turn to follow and the whole place passes through view
      const a = (i / N) * Math.PI * 2,
        r = 2.6 + Math.sin(a * 2) * 0.8;
      let x = p.x + Math.sin(a) * r,
        z = p.z + Math.cos(a) * r;
      if (stage === 75) {
        const g = Q.leadPath[Math.min(Q.leadPath.length - 1, Math.floor((i / N) * Q.leadPath.length * 1.3))];
        x = g[0];
        z = g[1] - 1.2;
      }
      if (!A.blocked(Q, x, z, 0.25) && !(Q.walls.some((w) => x > w[0] - 0.4 && x < w[2] + 0.4 && z > w[1] - 0.4 && z < w[3] + 0.4))) {
        A.S.x = x;
        A.S.z = z;
      }
      A.S.yaw = Math.atan2(A.S.x - p.x, A.S.z - p.z) + Math.sin(i * 0.01) * 0.9;
      step();
      sample(label, i * dt, Q);
    }
  }
  if (films && (!only || only.includes("films")))
    for (const [key, stage] of [["departure", 25], ["arrival", 35]]) {
      await A.go(stage);
      closeAll();
      A.S.view = null;
      A.DIR.start(key);
      const quick = A.DIR.fast;
      A.DIR.fast = false; // real time: the test build plays scenes 30 times faster
      const Q = A.world();
      let empty = 0,
        t = 0;
      const cams = new Map();
      while (A.DIR.on && t < 60) {
        step();
        t = A.DIR.time;
        sample("scene " + key, t, Q);
        const c = A.DIR.on && cameraIssue(Q, A.camera);
        if (c && !cams.has(c)) cams.set(c, t);
        if (A.DIR.on && !somethingInView(Q, A.camera)) empty += dt;
        else {
          if (empty > 2) lines.push(`scene ${key}: an empty view for ${empty.toFixed(1)} s, ending at ${t.toFixed(1)} s`);
          empty = 0;
        }
      }
      for (const [c, at] of cams) lines.push(`scene ${key}: camera ${c} at ${at.toFixed(1)} s`);
      if (A.DIR.on) A.DIR.stop();
      A.DIR.fast = quick;
    }
  stats.push(`ANIM sampled ${[...seen.values()].filter((s) => s.id).length} people`);
  A.renderer.render = render;
  window.requestAnimationFrame = raf;
  raf(A.frame);
  return { lines, stats };
}
