/* The flight deck of a Douglas DC-8 of the 1970s. The DC-8 flew with a crew of three in the cockpit (Wikipedia, Douglas DC-8, "Cockpit crew: three"): the
   captain in the left seat, the first officer in the right, and the flight engineer facing a side panel behind the first officer. Round dials ("steam
   gauges") on the panel, a pair of control columns with wheels, a pedestal between the seats with the four throttle levers, an overhead panel.
   WHAT IS A GENERAL PICTURE: there is no photograph of Air Jamaica's own cockpit in the sources, and none of a DC-8 cockpit has yet been looked at; the layout
   follows the common arrangement of a three-crew jet of that time (docs/games/air-jamaica.md, "Cockpit"). Do not call it a copy of a particular aircraft.
   Local axes: the nose is toward -z, the left seat is -x, the floor is y = 0, the windscreen stands at z = -2.4. */
import * as THREE from "three";
import { grp, mesh, box, cyl, solid, cv, plane } from "./gfx.js";

const M = {
  panel: solid(0x1c1f20, 0.8),
  panelLight: solid(0x34393a, 0.7),
  trim: solid(0x8c9494, 0.7),
  wall: solid(0xb7b8b0, 0.85),
  ceiling: solid(0xcfd0c7, 0.85),
  floor: solid(0x4d5a63, 0.95),
  seat: solid(0x274a78, 0.9),
  seatDark: solid(0x1c3558, 0.9),
  metal: solid(0x9aa0a0, 0.4, 0.6),
  black: solid(0x101213, 0.6),
  knob: solid(0x0e0e0e, 0.5),
  red: solid(0xc3281f, 0.5),
  frame: solid(0x20262a, 0.7),
};
/* the instrument panel's picture: left pilot's six main dials, the engine strip in the middle (four columns for four engines), the right pilot's six */
function dialsTexture(kind = "pilot") {
  return cv(1024, 360, (x, W, H) => {
    x.fillStyle = "#1a1c1d"; x.fillRect(0, 0, W, H);
    const dial = (cx, cy, r, label, needle = 0.3, style = "plain") => {
      x.fillStyle = "#0b0c0d"; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
      x.strokeStyle = "#8f9494"; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke();
      if (style === "horizon") {
        x.save(); x.beginPath(); x.arc(cx, cy, r - 4, 0, 7); x.clip();
        x.fillStyle = "#4b86c9"; x.fillRect(cx - r, cy - r, r * 2, r);
        x.fillStyle = "#7a5a3a"; x.fillRect(cx - r, cy, r * 2, r);
        x.strokeStyle = "#f4f4f0"; x.lineWidth = 3; x.beginPath(); x.moveTo(cx - r, cy); x.lineTo(cx + r, cy); x.stroke();
        x.restore();
        x.strokeStyle = "#f1c232"; x.lineWidth = 4; x.beginPath(); x.moveTo(cx - r * 0.5, cy); x.lineTo(cx - r * 0.15, cy); x.lineTo(cx, cy + r * 0.12); x.lineTo(cx + r * 0.15, cy); x.lineTo(cx + r * 0.5, cy); x.stroke();
        return;
      }
      x.strokeStyle = "#e8e6dc"; x.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        x.beginPath(); x.moveTo(cx + Math.cos(a) * r * 0.78, cy + Math.sin(a) * r * 0.78); x.lineTo(cx + Math.cos(a) * r * 0.92, cy + Math.sin(a) * r * 0.92); x.stroke();
      }
      x.strokeStyle = "#f4f2e8"; x.lineWidth = 4;
      const a = needle * Math.PI * 2 - Math.PI / 2;
      x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * r * 0.7, cy + Math.sin(a) * r * 0.7); x.stroke();
      x.fillStyle = "#e8e6dc"; x.font = "bold " + Math.round(r * 0.26) + "px sans-serif"; x.textAlign = "center"; x.fillText(label, cx, cy + r * 0.52);
    };
    const R = 56, top = 100, bot = 250;
    const labels = [["ALT", 0.42], ["SPEED", 0.58], ["", 0.2], ["VERT", 0.52], ["HDG", 0.1], ["TURN", 0.5]];
    /* a pilot's group: horizon in the middle top, four others round it */
    const group = (x0) => {
      dial(x0 + 90, top, R, "", 0, "horizon");
      dial(x0 + 215, top, R, "SPEED", 0.58);
      dial(x0 + 340, top, R, "ALT", 0.42);
      dial(x0 + 90, bot, R, "HDG", 0.1);
      dial(x0 + 215, bot, R, "VERT", 0.52);
      dial(x0 + 340, bot, R, "TURN", 0.5);
    };
    group(10);
    group(W - 440);
    /* the engine strip: four columns of three small dials (RPM, temperature, fuel flow) */
    for (let c = 0; c < 4; c++)
      for (let r = 0; r < 3; r++) dial(470 + c * 62, 60 + r * 90, 24, ["RPM", "TEMP", "FUEL"][r], 0.3 + c * 0.03 + r * 0.1);
    x.fillStyle = "#e8e6dc"; x.font = "bold 18px sans-serif"; x.textAlign = "center"; x.fillText("1   2   3   4", 575, 345);
  });
}
/* the flight engineer's panel: rows of small dials and switches */
function engineerTexture() {
  return cv(512, 640, (x, W, H) => {
    x.fillStyle = "#1a1c1d"; x.fillRect(0, 0, W, H);
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++) {
        const cx = 70 + c * 125, cy = 70 + r * 92;
        x.fillStyle = "#0b0c0d"; x.beginPath(); x.arc(cx, cy, 36, 0, 7); x.fill();
        x.strokeStyle = "#8f9494"; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, 36, 0, 7); x.stroke();
        x.strokeStyle = "#f4f2e8"; x.lineWidth = 4; const a = (0.2 + ((r * 4 + c) % 7) * 0.1) * Math.PI * 2 - Math.PI / 2;
        x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * 26, cy + Math.sin(a) * 26); x.stroke();
      }
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 10; c++) {
        x.fillStyle = (r + c) % 4 === 0 ? "#c3281f" : "#6a7070"; x.fillRect(22 + c * 47, 450 + r * 56, 28, 36);
        x.fillStyle = "#e8e6dc"; x.fillRect(32 + c * 47, 444 + r * 56, 8, 14);
      }
  });
}
function overheadTexture() {
  return cv(512, 160, (x, W, H) => {
    x.fillStyle = "#26292a"; x.fillRect(0, 0, W, H);
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 14; c++) { x.fillStyle = (r * 14 + c) % 5 === 0 ? "#d6a52a" : "#7b8181"; x.fillRect(14 + c * 35, 12 + r * 36, 22, 22); }
  });
}
export function buildCockpit() {
  const g = grp();
  /* the shell: floor, side walls, ceiling, back wall with the door, and the front wall as a frame with three open windows */
  box(2.9, 0.05, 3.8, M.floor, 0, -0.025, -0.5, g);
  /* the side walls, each with a window opening beside its pilot (a sliding window: sill 0.95 m, head 1.75 m, from z -1.9 to z -0.5), framed in dark trim */
  for (const s of [-1, 1]) {
    const wx = s * 1.45;
    box(0.06, 0.95, 3.8, M.wall, wx, 0.475, -0.5, g);
    box(0.06, 0.3, 3.8, M.wall, wx, 1.9, -0.5, g);
    box(0.06, 0.8, 0.5, M.wall, wx, 1.35, -2.15, g);
    box(0.06, 0.8, 1.9, M.wall, wx, 1.35, 0.45, g);
    for (const z of [-1.9, -0.5]) box(0.1, 0.84, 0.06, M.frame, wx - s * 0.02, 1.35, z, g);
    for (const y of [0.95, 1.75]) box(0.1, 0.06, 1.46, M.frame, wx - s * 0.02, y, -1.2, g);
    box(0.08, 0.04, 0.5, M.metal, wx - s * 0.03, 1.0, -0.75, g); /* the window's sliding catch on the sill */
  }
  box(2.9, 0.06, 3.8, M.ceiling, 0, 2.05, -0.5, g);
  box(2.9, 2.05, 0.06, M.wall, 0, 1.025, 1.4, g);
  box(0.8, 1.7, 0.04, M.panelLight, 0, 0.9, 1.36, g); /* the door to the cabin */
  box(0.08, 0.3, 0.05, M.metal, 0.28, 0.95, 1.33, g);
  /* the front wall: a sill under the windows, a beam over them, and three posts */
  box(2.9, 0.95, 0.08, M.frame, 0, 0.475, -2.4, g);
  box(2.9, 0.2, 0.08, M.frame, 0, 1.95, -2.4, g);
  for (const x of [-1.45, -0.5, 0.5, 1.45]) box(0.1, 1.0, 0.08, M.frame, x, 1.45, -2.4, g);
  /* the glareshield, black, over the panel, and the panel itself in front of each pilot, tilted back */
  box(2.8, 0.08, 0.5, M.black, 0, 0.98, -2.15, g);
  const pan = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 0.95), new THREE.MeshStandardMaterial({ map: dialsTexture(), roughness: 0.6 }));
  pan.position.set(0, 0.55, -1.86);
  pan.rotation.x = -0.3;
  g.add(pan);
  box(2.8, 0.75, 0.3, M.panel, 0, 0.45, -2.05, g);
  /* the centre pedestal: the four throttle levers with black knobs, the flap lever and the red speed-brake lever, the trim wheel */
  box(0.52, 0.5, 1.2, M.panelLight, 0, 0.25, -1.0, g);
  box(0.46, 0.04, 1.1, M.panel, 0, 0.52, -1.0, g);
  for (let i = 0; i < 4; i++) {
    const x = -0.15 + i * 0.1;
    const l = box(0.025, 0.025, 0.34, M.metal, x, 0.64, -1.18, g);
    l.rotation.x = -0.5;
    mesh(new THREE.SphereGeometry(0.035, 10, 8), M.knob, x, 0.74, -1.04, g);
  }
  const fl = box(0.025, 0.025, 0.3, M.metal, 0.22, 0.62, -1.0, g); fl.rotation.x = -0.35;
  mesh(new THREE.SphereGeometry(0.03, 8, 6), M.knob, 0.22, 0.7, -0.88, g);
  const sb = box(0.025, 0.025, 0.28, M.metal, -0.22, 0.62, -0.9, g); sb.rotation.x = -0.3;
  mesh(new THREE.SphereGeometry(0.032, 8, 6), M.red, -0.22, 0.69, -0.78, g);
  const tw = cyl(0.07, 0.07, 0.03, M.trim, 0.0, 0.56, -0.5, g, 14); tw.rotation.z = Math.PI / 2;
  /* control columns, a wheel on each; rudder pedals under the panel; seats; the overhead panel */
  for (const s of [-1, 1]) {
    const x = s * 0.7;
    cyl(0.03, 0.03, 0.85, M.metal, x, 0.425, -1.2, g, 8);
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.016, 8, 24), M.black);
    wheel.position.set(x, 0.86, -1.08);
    g.add(wheel);
    box(0.34, 0.025, 0.025, M.black, x, 0.86, -1.08, g);
    for (const dx of [-0.17, 0.17]) cyl(0.022, 0.022, 0.1, M.black, x + dx, 0.86, -1.08, g, 6).rotation.x = Math.PI / 2;
    for (const dx of [-0.08, 0.08]) box(0.1, 0.18, 0.02, M.metal, x + dx, 0.12, -1.55, g).rotation.x = -0.4;
    /* the seat: a cushion, a back with a headrest, two arms, a post to the floor */
    const sx = x, sz = -0.15;
    box(0.5, 0.12, 0.5, M.seat, sx, 0.5, sz, g);
    box(0.5, 0.72, 0.1, M.seat, sx, 0.9, sz + 0.27, g);
    box(0.3, 0.2, 0.08, M.seatDark, sx, 1.34, sz + 0.28, g);
    for (const dx of [-0.27, 0.27]) box(0.05, 0.05, 0.4, M.metal, sx + dx, 0.7, sz, g);
    cyl(0.06, 0.08, 0.44, M.metal, sx, 0.22, sz, g, 8);
  }
  /* the flight engineer: a seat behind the first officer turned to face the side panel, and the panel on the right-hand wall */
  box(0.46, 0.12, 0.46, M.seat, 1.0, 0.5, 0.55, g);
  box(0.1, 0.7, 0.46, M.seat, 1.22, 0.9, 0.55, g);
  cyl(0.06, 0.08, 0.44, M.metal, 1.0, 0.22, 0.55, g, 8);
  box(0.12, 1.15, 1.35, M.panel, 1.37, 1.0, 0.1, g);
  const ep = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.1), new THREE.MeshStandardMaterial({ map: engineerTexture(), roughness: 0.6 }));
  ep.position.set(1.305, 1.0, 0.1);
  ep.rotation.y = -Math.PI / 2;
  g.add(ep);
  /* the overhead panel */
  box(1.5, 0.12, 0.9, M.panel, 0, 1.96, -1.35, g);
  const oh = new THREE.Mesh(new THREE.PlaneGeometry(1.46, 0.86), new THREE.MeshStandardMaterial({ map: overheadTexture(), roughness: 0.6 }));
  oh.position.set(0, 1.895, -1.35);
  oh.rotation.x = Math.PI / 2;
  g.add(oh);
  /* a map light and a little jump seat folded against the back wall for the visitor */
  box(0.4, 0.06, 0.34, M.seat, -0.9, 0.55, 1.2, g);
  g.userData.parts = { pedestal: [0, 0.5, -1.0] };
  return g;
}
export const SEATS = { captain: { x: -0.7, z: -0.15, top: 0.56 }, first: { x: 0.7, z: -0.15, top: 0.56 }, engineer: { x: 1.0, z: 0.55, top: 0.56 } };
