import { showCinematicSkip } from "../../../engine/cine.js";
/* Camera scenes. Each is a reconstruction, and says so on its card.
   The camera follows a smooth curve through each film's shots (a Catmull-Rom spline in time, eased at the start and end), looks at a second
   curve, and can change its lens. The place stages its own part: Q.films[key](t, Q) is called every frame with the film's time (a rider on
   the road, a shutter that opens, a lamp that goes out) and once with t = -1 when the film stops, to put the place back as play expects it.
   People can be given a clip at a time. Pause, sound and read instead stay available throughout. */
import * as THREE from "three";
import { AU, chan, setG, tone, cue, noiseHit, crackle } from "../../../engine/audio.js";
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
export function createDirector({ camera, world, finish, read, fast = false, reduced = false, fov: playFov = () => 66 }) {
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
  D.start = (key) => {
    D.key = key;
    D.time = 0;
    D.paused = false;
    D.on = true;
    fired = new Set();
    build(FILMS[key]);
    $("cineControls").hidden = false;
    hideSkip = showCinematicSkip(() => $("readCine").click());
    $("pauseCine").textContent = "Pause";
    document.body.classList.add("cine");
    D.apply(0);
  };
  let hideSkip;
  D.hideSkip = () => hideSkip?.();
  D.stop = () => {
    D.hideSkip();
    const Q = world && world();
    if (D.on && Q) Q.films?.[D.key]?.(-1, Q);   // put the place back as play expects it
    D.on = false;
    D.paused = false;
    $("cineControls").hidden = true;
    document.body.classList.remove("cine");
    $("sub").textContent = "";
    camera.fov = playFov();
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
    if (Q) Q.films?.[D.key]?.(t, Q);
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
          if (what === "shot") {
            /* a flintlock, far off: a crack, then the boom rolling round the hills */
            noiseHit(2400, 0.7, 0.07, 0.45, 0, 0);
            noiseHit(420, 0.5, 0.5, 0.4, 0, 0.02);
            noiseHit(160, 0.6, 1.3, 0.28, 0, 0.12);
          } else if (what === "bell") {
            tone(523, 520, 2.2, "sine", 0.05, 0);
            tone(784, 780, 1.6, "sine", 0.02, 0);
          } else if (what === "drum") {
            noiseHit(90, 0.9, 0.5, 0.35, 0, 0);
          } else if (what === "hoof") {
            /* a mule's hooves on a dry road, four slow beats */
            for (let i = 0; i < 4; i++) noiseHit(300 + (i % 2) * 60, 3, 0.07, 0.09, 0, i * 0.42);
          } else if (what === "steps") {
            for (let i = 0; i < 5; i++) noiseHit(220, 2, 0.08, 0.07, 0.2, i * 0.55);   /* boots on the track */
          } else if (what === "wind") {
            noiseHit(500, 0.4, 2.6, 0.08, -0.3, 0);   /* a dry gust over the grass */
          } else if (what === "creak") {
            tone(140, 110, 0.9, "sawtooth", 0.012, 0.3, 0);   /* timber on its hinge, or a windlass */
            tone(180, 150, 0.6, "sawtooth", 0.008, 0.3, 0.5);
          } else if (what === "fire") crackle();
          else if (what === "shell") {
            tone(174, 168, 1.6, "sawtooth", 0.016, 0.5, 0);   /* a conch shell blown far off, the call of the crowd */
          } else if (what === "volley") {
            /* a ragged volley of muskets, close: cracks one after another, then the boom off the hills */
            for (let i = 0; i < 6; i++) noiseHit(2200, 0.7, 0.06, 0.32, -0.2 + i * 0.08, i * 0.07);
            noiseHit(380, 0.5, 0.6, 0.4, 0, 0.05);
            noiseHit(140, 0.6, 1.6, 0.3, 0, 0.2);
          } else if (what === "crowd") {
            noiseHit(520, 1.4, 2.4, 0.12, 0.3, 0);   /* many voices, rising */
            for (let i = 0; i < 4; i++) tone(200 + i * 40, 240 + i * 30, 0.5, "triangle", 0.012, 0.2 - i * 0.1, i * 0.35);
          } else if (what === "wave") noiseHit(380, 0.5, 2.8, 0.08, -0.2, 0);   /* a wave on the beach */
          else if (what === "lash") {
            noiseHit(3000, 1.4, 0.06, 0.2, 0.4, 0);   /* heard, not seen: the camera has turned away */
          }
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
