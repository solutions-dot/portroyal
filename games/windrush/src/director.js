/* Game-only camera scenes; the timing and compression are a reconstruction. */
import * as THREE from "three";
import { AU, chan, setG } from "../../../engine/audio.js";
import { $ } from "./ui.js";
import { FILMS } from "./content.js";
export function createDirector({
  camera,
  finish,
  read,
  fast = false,
  reduced = false,
}) {
  const D = { on: false, paused: false, time: 0, key: null };
  let rumble = null;
  D.start = (key) => {
    D.key = key;
    D.time = 0;
    D.paused = false;
    D.on = true;
    $("cineControls").hidden = false;
    $("pauseCine").textContent = "Pause";
    document.body.classList.add("cine");
  };
  D.stop = () => {
    D.on = false;
    D.paused = false;
    $("cineControls").hidden = true;
    document.body.classList.remove("cine");
    $("sub").textContent = "";
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
  D.tick = (dt) => {
    if (!D.on || D.paused) return;
    D.time += dt * (fast ? 30 : 1);
    const F = FILMS[D.key],
      t = D.time;
    let i = 0;
    while (i < F.shots.length - 1 && t >= F.shots[i + 1].t) i++;
    const a = F.shots[reduced ? 0 : i],
      b = F.shots[reduced ? 0 : Math.min(i + 1, F.shots.length - 1)],
      k = a === b ? 0 : THREE.MathUtils.smoothstep(t, a.t, b.t);
    camera.position.fromArray(a.p).lerp(new THREE.Vector3(...b.p), k);
    camera.lookAt(
      new THREE.Vector3(...a.look).lerp(new THREE.Vector3(...b.look), k),
    );
    $("sub").textContent =
      [...F.captions].reverse().find((c) => t >= c[0])?.[1] || "";
    if (AU.ctx && AU.on && AU.ctx.state === "running") {
      if (!rumble) rumble = chan("brown", "lowpass", 150, 1);
      setG(rumble, 0.018, 0.4);
    } else if (rumble) setG(rumble, 0, 0.1);
    if (t >= F.duration) {
      const key = D.key;
      D.stop();
      finish(key);
    }
  };
  return D;
}
