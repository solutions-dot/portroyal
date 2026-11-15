/* The event stays historical; the camera and time compression are our reconstruction. */
import * as THREE from "three";
import { ARRIVAL_CAPTIONS } from "./content.js";
import { AU, chan, setG } from "../../../engine/audio.js";
import { $ } from "./ui.js";
const mix = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
export function createDirector({ camera, place, finish, read, fast = false }) {
  const D = { on: false, paused: false, time: 0 };
  let engine = null,
    crowd = null;
  function sound() {
    if (!AU.ctx || !AU.on || AU.ctx.state !== "running") return;
    if (!engine) {
      engine = chan("brown", "lowpass", 180, 1);
      crowd = chan("white", "bandpass", 700, 0.6);
    }
    setG(engine, 0.045 * (D.time < 45 ? 1 : 0.25), 0.5);
    setG(crowd, D.time > 30 ? 0.035 : 0.006, 0.7);
  }
  D.start = () => {
    D.on = true;
    D.time = 0;
    D.paused = false;
    $("cineControls").hidden = false;
    $("pauseCine").textContent = "Pause";
    document.body.classList.add("cine");
    $("sub").classList.remove("dim");
    $("sub").textContent = ARRIVAL_CAPTIONS[0][0];
  };
  D.stop = () => {
    D.on = false;
    for (const n of place()?.people || [])
      if (n.historical) {
        n.ctl.cur.paused = false;
        n.ctl.rest();
      }
    $("cineControls").hidden = true;
    document.body.classList.remove("cine");
    $("sub").textContent = "";
    if (engine) {
      setG(engine, 0, 0.1);
      setG(crowd, 0, 0.1);
    }
  };
  $("pauseCine").onclick = () => {
    D.paused = !D.paused;
    $("pauseCine").textContent = D.paused ? "Continue" : "Pause";
    $("pauseCine").setAttribute("aria-pressed", D.paused);
    if (D.paused && engine) {
      setG(engine, 0, 0.1);
      setG(crowd, 0, 0.1);
    }
  };
  $("readCine").onclick = () => {
    D.stop();
    read();
  };
  D.tick = (dt) => {
    if (!D.on || D.paused) return;
    D.time += dt * (fast ? 25 : 1);
    const t = D.time,
      Q = place(),
      p = Q.props.plane;
    p.position.set(mix(-180, 12, t / 42), t < 25 ? mix(17, 0, t / 25) : 0, -32);
    p.rotation.z = t < 25 ? -0.025 : 0;
    for (const prop of p.userData.props)
      prop.rotation.x += dt * Math.max(1, 35 - t * 0.4);
    Q.props.stairs.visible = t > 51;
    for (const n of Q.people.filter((n) => n.historical)) {
      n.m.visible = t > (n.id === "planno" ? 55 : 70);
      if (n.m.visible) {
        n.ctl.play(n.id === "emperor" ? "Salute" : "Point");
        if (n.id === "emperor") {
          n.ctl.cur.time = n.ctl.cur.getClip().duration * 0.5;
          n.ctl.cur.paused = true;
          n.ctl.timer = 0;
        }
      }
    }
    let pos, look;
    if (t < 25) {
      pos = [-12, 2.1, 6];
      look = [p.position.x + 5, 4, -32];
    } else if (t < 55) {
      pos = [-3, 2.4, -7];
      look = [12, 3, -32];
    } else if (t < 70) {
      pos = [11, 4.2, -19];
      look = [4.3, 3.8, -28];
    } else if (t < 77) {
      pos = [5.6, 1.75, -23.5];
      look = [4.3, 3.8, -28.8];
    } else if (t < 83) {
      pos = [5.2, 4.12, -27.0];
      look = [4.3, 4.04, -28.8];
    } else if (t < 88) {
      pos = [17, 4.8, -14];
      look = [4.3, 3.7, -28];
    } else {
      pos = [-2.1, 1.3, 19];
      look = [-4, 1.35, 17];
    }
    camera.position.set(...pos);
    camera.lookAt(new THREE.Vector3(...look));
    $("sub").textContent =
      [...ARRIVAL_CAPTIONS].reverse().find(([, at]) => t >= at)?.[0] || "";
    sound();
    if (t >= 98) {
      D.stop();
      finish();
    }
  };
  return D;
}
