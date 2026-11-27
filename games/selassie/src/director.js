import { showCinematicSkip } from "../../../engine/cine.js";
/* The event stays historical; the camera and time compression are our reconstruction.
   The arrival, shot by shot (seconds of the cinematic; the aircraft's speeds are slowed so a child can follow it):
     0  the crowd by the terminal hears the aircraft and turns to the sky        (the DC-6 far off, coming down to the runway)
    10  touchdown and roll-out on the runway                                      (low beside the runway)
    15  it taxis in to the crowd                                                  (from among the crowd, over their shoulders)
    30  the welcome: the crowd, the flags and the whole aircraft                   (a wide view, propellers slowing)
    40  the boarding steps are rolled to the rear door and the door opens
    48  Mortimo Planno at the foot of the steps, calming the crowd (no words are given to him)
    60  Haile Selassie I at the top of the steps; he salutes (the owner's clip)
    73  the crowd's faces as he comes down (seen from the foot of the steps, looking out at the welcome)
    80  at the foot of the steps beside Mortimo Planno, he waves (the Gleaner: he waved)
    88  back with Grandma and the family
   The owner's descending-stairs clip was tried for the walk down and does not fit (docs/games/selassie.md), so his walk down is not
   shown step by step: the camera turns to the crowd instead of showing feet that slide or sink into the steps.
   Nobody is given invented words. Every camera stays outside the aircraft, the steps and the people (the dev check tests it). */
import * as THREE from "three";
import { ARRIVAL_CAPTIONS } from "./content.js";
import { sharedVoice } from "../../../engine/filmvoice.js";
import { AU, chan, setG } from "../../../engine/audio.js";
import { $ } from "./ui.js";
const clamp01 = (t) => Math.max(0, Math.min(1, t));
const mix = (a, b, t) => a + (b - a) * clamp01(t);
const smooth = (t) => {
  t = clamp01(t);
  return t * t * (3 - 2 * t);
};
export const END = 98;
/* the aircraft's way in: a straight approach and roll-out on the runway (heading west), a left turn up the taxiway towards the apron,
   a right turn west onto the apron line, and a stop with the rear door at the steps. [x, z] in metres. Its wing and propellers sweep
   the apron east of the steps, so the welcome there comes forward only once it has stopped (shown from 30 s, at a cut). */
const R = 8,
  RUNWAY = -83,
  LINE = -32,
  STOP = -4.7,
  TURN1 = 40;
function taxiPath() {
  const pts = [];
  const add = (x, z, h) => pts.push({ x, z, h });
  for (let x = 120; x >= TURN1; x -= 2) add(x, RUNWAY, Math.PI);
  for (let i = 1; i <= 12; i++) {
    // heading west, turning left towards the apron (+z)
    const a = (i / 12) * (Math.PI / 2);
    add(TURN1 - Math.sin(a) * R, RUNWAY + R - Math.cos(a) * R, Math.PI + a);
  }
  for (let z = RUNWAY + R + 2; z <= LINE - R; z += 2) add(TURN1 - R, z, 1.5 * Math.PI);
  for (let i = 1; i <= 12; i++) {
    // heading for the apron, turning right to face west
    const a = (i / 12) * (Math.PI / 2);
    add(TURN1 - R - R + Math.cos(a) * R, LINE - R + Math.sin(a) * R, 1.5 * Math.PI - a);
  }
  for (let x = TURN1 - 2 * R - 2; x >= STOP; x -= 2) add(x, LINE, Math.PI);
  add(STOP, LINE, Math.PI);
  let s = 0;
  pts[0].s = 0;
  for (let i = 1; i < pts.length; i++) {
    s += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z);
    pts[i].s = s;
  }
  return pts;
}
const PATH = taxiPath(),
  LEN = PATH[PATH.length - 1].s;
function along(s) {
  s = Math.max(0, Math.min(LEN, s));
  let i = 1;
  while (i < PATH.length - 1 && PATH[i].s < s) i++;
  const a = PATH[i - 1],
    b = PATH[i],
    k = (s - a.s) / (b.s - a.s || 1);
  let dh = b.h - a.h;
  return { x: a.x + (b.x - a.x) * k, z: a.z + (b.z - a.z) * k, h: a.h + dh * k };
}
/* distance along the path at time t: 30 m/s down to 6 m/s on the roll-out (10 to 15 s), then a steady taxi that slows to a stop at 30 s */
const ROLL = 120 - TURN1;
function sAt(t) {
  if (t < 10) return 0;
  if (t < 15) {
    const u = (t - 10) / 5;
    return ROLL * (u * (2 - u) * 0.9 + u * 0.1);
  }
  const u = clamp01((t - 15) / 15);
  return ROLL + (LEN - ROLL) * (u * (2 - u));
}
/* camera shots: [from, to, position(t), look-at(t)]; positions are clear of the aircraft, the steps and the crowd */
export function shots(P) {
  const plane = P.plane;
  return [
    [0, 10, () => [-7.5, 1.72, 4.5], () => [plane.position.x * 0.92 - 7, Math.max(2, plane.position.y * 0.85 + 2), plane.position.z * 0.9]],
    [10, 15, (t) => [mix(96, 70, (t - 10) / 5), 1.5, RUNWAY + 22], () => [plane.position.x, 3.0, RUNWAY]],
    [15, 30, (t) => [mix(-13.5, -12.5, (t - 15) / 15), 1.7, -16.8], () => [mix(plane.position.x, -2, 0.3), 2.8, mix(plane.position.z, -30, 0.4)]],
    [30, 40, (t) => [mix(14.5, 13.2, (t - 30) / 10), 2.9, -13.6], () => [-0.5, 2.7, -29.5]],
    [40, 48, () => [11.5, 2.3, -21.8], () => [4.6, 2.6, -29.2]],
    [48, 60, (t) => [mix(0.9, 1.2, (t - 48) / 12), 2.35, -22.6], () => [3.2, 1.5, -26.4]],
    [60, 66, () => [8.0, 2.1, -24.5], () => [4.3, 3.7, -29.4]],
    [66, 73, (t) => [mix(6.0, 5.7, (t - 66) / 7), 3.35, -26.9], () => [4.3, 3.95, -29.6]],
    [73, 80, (t) => [4.3, 2.45, mix(-26.3, -26.1, (t - 73) / 7)], () => [6.2, 1.2, -19.5]],
    [80, 88, (t) => [mix(5.4, 5.25, (t - 80) / 8), 3.5, -21.9], () => [3.9, 1.2, -25.9]],
    [88, END + 1, () => [-2.7, 1.38, 19.8], () => [-4.0, 1.5, 17.0]],
  ];
}
export function createDirector({ camera, place, finish, read, fast = false }) {
  const D = { on: false, paused: false, time: 0, fast };
  const FV = sharedVoice();   /* the narrator: engine/filmvoice.js; captions here are [text, at] */
  const NARR = ARRIVAL_CAPTIONS.map(([text, at]) => [at, text]);
  let engine = null,
    crowd = null,
    saluted = false,
    waved = false;
  const _look = new THREE.Vector3();
  function sound() {
    if (!AU.ctx || !AU.on || AU.ctx.state !== "running") return;
    if (!engine) {
      engine = chan("brown", "lowpass", 180, 1);
      crowd = chan("white", "bandpass", 700, 0.6);
    }
    setG(engine, 0.045 * (D.time < 34 ? 1 : 0.15 * clamp01((42 - D.time) / 8)), 0.5);
    setG(crowd, D.time > 15 ? 0.035 : 0.006, 0.7);
  }
  D.start = () => {
    D.on = true;
    D.time = 0;
    D.paused = false;
    saluted = waved = false;
    $("cineControls").hidden = false;
    hideSkip = showCinematicSkip(() => $("readCine").click());
    $("pauseCine").textContent = "Pause";
    document.body.classList.add("cine");
    $("sub").classList.remove("dim");
    $("sub").textContent = ARRIVAL_CAPTIONS[0][0];
    if (!D.fast) FV.preload(NARR, "arrival");
  };
  /* the people at the steps, back as the story finds them after the arrival */
  function settle(Q) {
    for (const n of Q?.extras || []) if (n.zone === "arrival") n.m.visible = true;
    for (const n of Q?.people || [])
      if (n.historical) {
        n.ctl.cur.paused = false;
        n.ctl.rest();
      }
  }
  let hideSkip;
  D.stop = () => {
    FV.stop();
    hideSkip?.();
    D.on = false;
    settle(place());
    $("cineControls").hidden = true;
    document.body.classList.remove("cine");
    $("sub").textContent = "";
    $("sub").classList.add("dim");
    if (engine) {
      setG(engine, 0, 0.1);
      setG(crowd, 0, 0.1);
    }
  };
  $("pauseCine").onclick = () => {
    D.paused = !D.paused;
    if (D.paused) FV.stop();
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
  /* everything at time t: the aircraft, the steps, the door, the two historical people and the camera */
  D.pose = (t, dt = 0) => {
    const Q = place(),
      p = Q.props.plane;
    if (t < 10) {
      // the approach: down a shallow slope to the runway, nose a little up at the end
      const u = t / 10;
      p.position.set(mix(420, 120, u), 16 * (1 - u) ** 1.4, RUNWAY);
      p.rotation.set(0, Math.PI, mix(0.02, 0.06, u));
    } else {
      const a = along(sAt(t));
      p.position.set(a.x, 0, a.z);
      p.rotation.set(0, a.h, t < 11 ? mix(0.06, 0, t - 10) : 0);
    }
    const spin = t < 34 ? 32 : Math.max(0, 32 * (1 - (t - 34) / 8));
    for (const prop of p.userData.props) prop.rotation.x += dt * spin;
    // the steps roll in from the east and stop at the door; then the door swings open
    const st = Q.props.stairs;
    st.visible = t > 40;
    st.position.x = 4.3 + 7 * (1 - smooth((t - 40) / 4.5));
    p.userData.door.userData.open(smooth((t - 45) / 2.5));
    for (const n of Q.extras) if (n.zone === "arrival" && n.x > 0.6) n.m.visible = t >= 30;
    const em = Q.people.find((n) => n.id === "emperor"),
      pl = Q.people.find((n) => n.id === "planno");
    pl.m.visible = t > 48;
    if (pl.m.visible) pl.ctl.play(t < 62 ? "TalkM1" : t < 76 ? "Clap" : null);
    em.m.visible = t > 60;
    if (em.m.visible) {
      // at the top of the steps (the salute at 62 s); from 80 s, after the shot of the crowd, at the foot of the steps
      const top = t < 80;
      em.m.position.set(4.3, top ? 2.56 : 0, top ? -29.72 : -25.9);
      em.m.rotation.y = top ? 0 : 0.2;
      em.m.userData.ground = top ? 2.56 : 0; // the main loop sets his feet on this height
      if (t > 62 && !saluted) {
        em.ctl.play("SaluteHS", true);
        saluted = true;
      }
      if (t > 81 && !waved) {
        em.ctl.play("Wave", true);
        waved = true;
      }
    }
    for (const [a, b, pos, look] of shots(Q.props))
      if (t >= a && t < b) {
        camera.position.set(...pos(t, Q));
        camera.lookAt(_look.set(...look(t, Q)));
        break;
      }
    const caption = [...NARR].reverse().find(([at]) => t >= at);
    $("sub").textContent = caption?.[1] || "";
    if (!D.fast) {
      FV.syncScore("arrival", () => D.time);
      FV.sync(caption, () => Math.max(0, D.time - caption[0]), "arrival");
    }
  };
  D.tick = (dt) => {
    if (!D.on || D.paused) return;
    const step = dt * (D.fast ? 25 : 1), before = D.time;
    D.time += step;
    if (!D.fast) D.time = FV.hold(before, D.time, NARR, END);
    D.pose(D.time, step);
    sound();
    if (D.time >= END) {
      D.stop();
      finish();
    }
  };
  return D;
}
