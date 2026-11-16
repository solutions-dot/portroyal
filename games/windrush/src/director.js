/* Game-only camera scenes: the departure from Kingston and the arrival at Tilbury. The timing and compression are a reconstruction.
   The camera follows a smooth curve through each film's shots (a Catmull-Rom spline in time, eased at the start and end), looks at a second
   curve, and can change its lens. The ship can move along keyframes (she leaves her berth, or comes alongside), with her wake strengthening
   with her speed, and people can be given a clip at a time (a wave, a hug). Pause, sound and read instead stay available throughout. */
import * as THREE from "three";
import { AU, chan, setG, tone, cue, gullCry } from "../../../engine/audio.js";
import { $ } from "./ui.js";
import { FILMS } from "./content.js";
const ease = (k) => k * k * (3 - 2 * k);
function sampleKeys(keys, t) {
  // keys: [[t, ...values]]: smooth interpolation between neighbours, held at the ends
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i],
      b = keys[i + 1];
    if (t <= b[0]) {
      const k = ease((t - a[0]) / (b[0] - a[0]));
      return a.slice(1).map((v, j) => v + (b[j + 1] - v) * k);
    }
  }
  return keys[keys.length - 1].slice(1);
}
export function createDirector({ camera, world, finish, read, fast = false, reduced = false }) {
  const D = { on: false, paused: false, time: 0, key: null, fast };
  let rumble = null,
    curve = null,
    lookCurve = null,
    fired = new Set();
  const build = (F) => {
    const P = F.shots.map((s) => new THREE.Vector3(...s.p)),
      L = F.shots.map((s) => new THREE.Vector3(...s.look));
    curve = new THREE.CatmullRomCurve3(P, false, "centripetal");
    lookCurve = new THREE.CatmullRomCurve3(L, false, "centripetal");
  };
  /* where along the curves at time t: the shot times map to equal steps along the spline, eased at both ends */
  const along = (F, t) => {
    const S = F.shots,
      n = S.length - 1;
    if (t <= S[0].t) return 0;
    if (t >= S[n].t) return 1;
    let i = 0;
    while (i < n - 1 && t >= S[i + 1].t) i++;
    let k = (t - S[i].t) / (S[i + 1].t - S[i].t);
    if (i === 0) k = k * k * (2 - k) * 0.5 + k * 0.5; // ease in
    if (i === n - 1) k = 1 - (1 - k) * (1 - k) * 0.5 - (1 - k) * 0.5; // ease out
    return (i + k) / n;
  };
  D.moves = (Q) => D.on && !!FILMS[D.key]?.ship && FILMS[D.key].place === Q.id;
  D.start = (key) => {
    D.key = key;
    D.time = 0;
    D.paused = false;
    D.on = true;
    fired = new Set();
    build(FILMS[key]);
    $("cineControls").hidden = false;
    $("pauseCine").textContent = "Pause";
    document.body.classList.add("cine");
    D.apply(0);
  };
  D.stop = () => {
    const Q = world && world();
    if (D.on && Q) {
      // put the place back as play expects it: the ship at her berth, the gangway down, the lens back
      if (Q.props.shipHome) {
        const h = Q.props.shipHome;
        Q.props.ship.position.x = h.x;
        Q.props.ship.position.z = h.z;
        Q.props.ship.rotation.y = h.ry;
      }
      if (Q.props.gangway) Q.props.gangway.visible = true;
      if (Q.props.wake && Q.id !== "deck48") Q.props.wake.visible = false;
    }
    D.on = false;
    D.paused = false;
    $("cineControls").hidden = true;
    document.body.classList.remove("cine");
    $("sub").textContent = "";
    camera.fov = innerWidth / innerHeight < 0.8 ? 76 : 66;
    camera.updateProjectionMatrix();
    if (rumble) setG(rumble, 0, 0.2);
  };
  $("pauseCine").onclick = () => {
    D.paused = !D.paused;
    $("pauseCine").textContent = D.paused ? "Continue" : "Pause";
    $("pauseCine").setAttribute("aria-pressed", D.paused);
    if (D.paused && rumble) setG(rumble, 0, 0.1);
  };
  $("readCine").onclick = () => {
    const key = D.key;
    D.stop();
    read(key);
  };
  /* pose the scene at time t: camera, lens, ship, people's moments, captions */
  D.apply = (t) => {
    const F = FILMS[D.key],
      Q = world && world();
    const k = reduced ? 0 : along(F, t);
    camera.position.copy(curve.getPoint(k));
    camera.lookAt(lookCurve.getPoint(k));
    const tall = innerWidth / innerHeight < 0.8,
      fov = (F.fov ? sampleKeys(F.fov, t)[0] : 50) * (tall ? 1.35 : 1);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    if (Q && F.ship && Q.props.ship) {
      const [x, z, ry] = sampleKeys(F.ship, t),
        [x2, z2] = sampleKeys(F.ship, t + 0.5),
        speed = Math.hypot(x2 - x, z2 - z) / 0.5;
      const s = Q.props.ship;
      s.position.x = x;
      s.position.z = z;
      s.rotation.y = ry;
      s.position.y = (Q.sea ? Q.sea.level : -2.1) + Math.sin(t * 0.8) * 0.05;
      s.rotation.z = Math.sin(t * 0.45) * 0.004;
      if (Q.props.wake) Q.props.wake.userData.tick(t, Math.min(1, speed / 3));
      if (Q.props.gangway) Q.props.gangway.visible = speed < 0.05 && Math.hypot(x - Q.props.shipHome.x, z - Q.props.shipHome.z) < 0.5;
    }
    if (Q && F.acts)
      for (const [at, id, clip] of F.acts) {
        const key = at + id + clip;
        if (t >= at && !fired.has(key)) {
          fired.add(key);
          const n = [...Q.people, ...Q.extras].find((p) => p.id === id);
          if (n) n.ctl.play(clip, true);
        }
      }
    $("sub").textContent = [...F.captions].reverse().find((c) => t >= c[0])?.[1] || "";
  };
  D.tick = (dt) => {
    if (!D.on || D.paused) return;
    const F = FILMS[D.key],
      before = D.time;
    D.time += dt * (D.fast ? 30 : 1);
    const t = D.time;
    D.apply(Math.min(t, F.duration));
    if (AU.ctx && AU.on && AU.ctx.state === "running") {
      if (!rumble) rumble = chan("brown", "lowpass", 150, 1);
      setG(rumble, 0.014, 0.4);
      for (const [at, what] of F.sounds || [])
        if (before < at && t >= at) {
          if (what === "horn") {
            tone(110, 108, 2.6, "sawtooth", 0.035, 0);
            tone(138.6, 137, 2.6, "sawtooth", 0.02, 0);
          } else if (what === "gull") gullCry();
          else cue(what);
        }
    } else if (rumble) setG(rumble, 0, 0.1);
    if (t >= F.duration) {
      const key = D.key;
      D.stop();
      finish(key);
    }
  };
  return D;
}
