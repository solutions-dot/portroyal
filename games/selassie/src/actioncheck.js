/* Development check (?test=actions, and part of ?test=audit and ?test=all): no standing zombies (owner's note, November 2026: "ensure
   persons have varied actions and no standing zombies"). It runs the game's real frame loop with a stepped clock, as the head check
   does, through every place (with the player walking about) and the whole arrival cinematic, and looks at everyone in the camera's view:
   - in step: more than SYNC.share of the people in view (and at least SYNC.min of them) playing the same clip at the same moment of it
     (within SYNC.phase of its length) and the same speed, so they move together like copies;
   - zombie: anyone in view who stays in the plain Idle clip with the head not turning (under STILL.deg degrees) for more than
     STILL.seconds. Story people the player is talking to and Haile Selassie I and Mortimo Planno (posed by the cinematic) are left out. */
import * as THREE from "three";
import { headAngles } from "./headcheck.js";
import { closeAll } from "./ui.js";
export const SYNC = { share: 0.12, min: 4, phase: 0.04 },
  STILL = { seconds: 6, deg: 4 };
const _fr = new THREE.Frustum(),
  _pm = new THREE.Matrix4(),
  _v = new THREE.Vector3();
function inView(camera, n) {
  if (!n.m.visible) return false;
  n.m.getWorldPosition(_v);
  _v.y += 1.2 * (n.m.scale.y || 1);
  return _fr.containsPoint(_v) && _v.distanceTo(camera.position) < 35;
}
export async function actionCheck(A, { seconds = 14 } = {}) {
  const lines = [],
    stats = [],
    dt = 1 / 30;
  const render = A.renderer.render,
    raf = window.requestAnimationFrame;
  window.requestAnimationFrame = () => 0;
  A.renderer.render = () => {};
  await new Promise((r) => setTimeout(r, 60));
  let clock = performance.now() + 1000,
    looked = 0,
    idleShare = [];
  const step = (h = dt) => {
    clock += h * 1000;
    A.frame(clock);
  };
  const still = new Map(),
    reported = new Set();
  const sample = (label, t) => {
    const Q = A.world(),
      cam = A.camera;
    cam.updateMatrixWorld();
    _pm.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse);
    _fr.setFromProjectionMatrix(_pm);
    const seen = [...Q.people, ...Q.extras].filter((n) => !n.historical && inView(cam, n));
    looked += seen.length;
    const groups = new Map();
    let idle = 0;
    for (const n of seen) {
      const ctl = n.ctl || n.m.userData.anim,
        act = ctl?.cur;
      if (!act) continue;
      const clip = act.getClip(),
        name = clip.name,
        ph = (act.time % clip.duration) / clip.duration;
      if (name === "Idle") idle++;
      // in step: the same clip, moment and speed
      const key = name + "|" + Math.round((act.timeScale || 1) * 20);
      (groups.get(key) || groups.set(key, []).get(key)).push([ph, n]);
      // a zombie: plain Idle, the head not turning
      const id = label + " " + (n.id || n.base),
        g = headAngles(n.m),
        s = still.get(id);
      if (name !== "Idle" || !g) {
        still.delete(id);
        continue;
      }
      if (!s) still.set(id, { t0: t, yaw0: g.yaw, pitch0: g.pitch });
      else if (Math.abs(g.yaw - s.yaw0) > STILL.deg || Math.abs(g.pitch - s.pitch0) > STILL.deg) still.set(id, { t0: t, yaw0: g.yaw, pitch0: g.pitch });
      else if (t - s.t0 > STILL.seconds && !reported.has(id)) {
        reported.add(id);
        lines.push(`${id}: stands in the plain Idle with a still head for over ${STILL.seconds} s (at ${t.toFixed(1)} s)`);
      }
    }
    if (seen.length) idleShare.push(idle / seen.length);
    if (seen.length < SYNC.min) return;
    for (const [key, list] of groups) {
      if (list.length < SYNC.min) continue;
      list.sort((a, b) => a[0] - b[0]);
      // the most people whose moments lie within SYNC.phase of each other (round the loop)
      let best = 0;
      for (let i = 0; i < list.length; i++) {
        let k = 0;
        for (const [p] of list) {
          const d = Math.abs(p - list[i][0]);
          if (Math.min(d, 1 - d) <= SYNC.phase) k++;
        }
        best = Math.max(best, k);
      }
      if (best >= SYNC.min && best > seen.length * SYNC.share) {
        const tag = label + " " + key.split("|")[0];
        if (!reported.has(tag)) {
          reported.add(tag);
          lines.push(`${label}: ${best} of ${seen.length} people in view play ${key.split("|")[0]} in step (at ${t.toFixed(1)} s)`);
        }
      }
    }
  };
  for (const [label, stage] of [
    ["yard", 20],
    ["memory", 15],
    ["road", 30],
    ["airport", 50],
  ]) {
    await A.go(stage);
    closeAll();
    A.S.started = true;
    const Q = A.world();
    still.clear();
    for (let i = 0, N = Math.round(seconds / dt); i < N; i++) {
      // the player turns slowly on the spot where the place starts, then walks a little, so everyone gets looked at
      const a = (i / N) * Math.PI * 2;
      A.S.yaw = a;
      A.S.x = Q.start.x + Math.sin(a * 2) * 1.5;
      A.S.z = Q.start.z + Math.cos(a * 2) * 1.5;
      if (A.blocked(Q, A.S.x, A.S.z, 0.25)) {
        A.S.x = Q.start.x;
        A.S.z = Q.start.z;
      }
      step();
      if (i % 15 === 0) sample(label, i * dt);
    }
  }
  await A.go(51);
  closeAll();
  const D = A.DIR;
  if (!D.on) D.start();
  D.fast = false;
  still.clear();
  // the cinematic in steps of 1/20 s (the longest step the frame loop takes), sampled every half second
  for (let i = 0; D.on && i < 110 * 20; i++) {
    step(0.05);
    if (i % 10 === 0) sample("cinematic", D.time);
  }
  if (D.on) D.stop();
  const mean = idleShare.reduce((s, x) => s + x, 0) / Math.max(1, idleShare.length);
  stats.push(`ACTIONS looked at ${looked} people in view; ${(mean * 100).toFixed(0)}% of them in the plain Idle on average`);
  A.renderer.render = render;
  window.requestAnimationFrame = raf;
  requestAnimationFrame(A.frame);
  return { lines, stats };
}
