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
  post: solid(0xb9bcbc, 0.35, 0.7),
  glassIn: (() => { const m = new THREE.MeshStandardMaterial({ color: 0x9fb8c4, transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0.2, depthWrite: false }); m.userData.noGlow = true; return m; })(),
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
  /* the shell: floor, ceiling, back wall with the door; the nose and its windscreen, the side walls with their windows */
  /* The nose, as in the 1969 photograph of a DC-8 flight deck (Finnair OH-LFV; docs/games/air-jamaica.md, "Cockpit"): the room narrows toward the front,
     and the windscreen is six panes round it on slanting posts: two facing ahead, two angled each side, and the pilot's sliding window behind those.
     Points of the windscreen's foot, from the left side round to the right: x, z. Sill at 1.02 m, head at 1.72 m; the posts lean back 0.12 m at the top. */
  const SILL = 1.02, HEAD = 1.72, LEAN = 0.12;
  const FOOT = [[-1.45, -1.25], [-1.15, -1.9], [-0.55, -2.32], [0.0, -2.38], [0.55, -2.32], [1.15, -1.9], [1.45, -1.25]];
  const seg = (a, b, y0, y1, mat, t = 0.05, lean = 0, inset = 0) => { /* a slab between two foot points, from y0 to y1, leaning back at the top */
    const [ax, az] = a, [bx, bz] = b, len = Math.hypot(bx - ax, bz - az), ang = Math.atan2(bz - az, bx - ax);
    const nx = Math.sin(ang), nz = -Math.cos(ang); /* the outward normal of this side (the room is inside) */
    const m = box(len, y1 - y0, t, mat, (ax + bx) / 2 - nx * inset, (y0 + y1) / 2, (az + bz) / 2 - nz * inset, g);
    m.rotation.order = "YXZ"; m.rotation.y = -ang; m.rotation.x = lean ? -Math.atan2(lean, y1 - y0) : 0;
    if (lean) { m.position.x += nx * (-lean / 2); m.position.z += nz * (-lean / 2); }
    return m;
  };
  for (let i = 0; i < FOOT.length - 1; i++) {
    seg(FOOT[i], FOOT[i + 1], 0, SILL, M.wall, 0.06); /* the nose's lining under the windscreen */
    seg(FOOT[i], FOOT[i + 1], SILL, HEAD, M.glassIn, 0.02, LEAN, 0.0); /* the pane */
    seg(FOOT[i], FOOT[i + 1], SILL - 0.03, SILL + 0.03, M.post, 0.07); /* the sill rail */
    seg(FOOT[i], FOOT[i + 1], HEAD - 0.03, HEAD + 0.05, M.post, 0.07, 0, -LEAN); /* the head rail, set back by the lean */
  }
  for (const [x, z] of FOOT.slice(1, -1)) { /* the posts between the panes: polished metal, leaning back as in the photograph */
    const p = box(0.06, HEAD - SILL + 0.06, 0.06, M.post, x, (SILL + HEAD) / 2, z, g);
    const r = Math.hypot(x, z + 0.4) || 1; p.rotation.order = "YXZ"; p.rotation.y = Math.atan2(x, -(z + 0.4)); p.rotation.x = -Math.atan2(LEAN, HEAD - SILL);
    void r;
  }
  /* the side walls behind the windscreen, each with the pilot's sliding window (sill 1.02 m, head 1.72 m, from z -1.25 to z -0.45) */
  for (const s of [-1, 1]) {
    const wx = s * 1.45;
    box(0.06, SILL, 2.65, M.wall, wx, SILL / 2, 0.075, g);
    box(0.06, 2.05 - HEAD, 2.65, M.wall, wx, (HEAD + 2.05) / 2, 0.075, g);
    box(0.06, HEAD - SILL, 1.85, M.wall, wx, (SILL + HEAD) / 2, 0.475, g);
    for (const z of [-1.25, -0.45]) box(0.1, HEAD - SILL + 0.04, 0.06, M.frame, wx - s * 0.02, (SILL + HEAD) / 2, z, g);
    for (const y of [SILL, HEAD]) box(0.1, 0.06, 0.86, M.frame, wx - s * 0.02, y, -0.85, g);
    box(0.08, 0.04, 0.5, M.metal, wx - s * 0.03, SILL + 0.04, -0.85, g); /* the sliding window's catch */
  }
  box(2.9, 0.05, 3.9, M.floor, 0, -0.025, -0.5, g);
  box(2.9, 0.06, 2.45, M.ceiling, 0, 2.05, 0.2, g);
  box(2.9, 2.05, 0.06, M.wall, 0, 1.025, 1.4, g);
  box(0.8, 1.7, 0.04, M.panelLight, 0, 0.9, 1.36, g); /* the door to the cabin */
  box(0.08, 0.3, 0.05, M.metal, 0.28, 0.95, 1.33, g);
  /* the glareshield: a narrow black hood over the panel, with the autopilot's strip of knobs and small windows along its top (as in the photograph) */
  box(2.3, 0.07, 0.36, M.black, 0, 0.98, -1.98, g);
  box(0.95, 0.12, 0.12, M.panelLight, 0, 1.06, -1.9, g);
  for (let i = 0; i < 8; i++) cyl(0.016, 0.016, 0.03, M.knob, -0.38 + i * 0.11, 1.08, -1.83, g, 8).rotation.x = Math.PI / 2;
  /* the main panel: flat across the front, tilted back, the pilots' dials either side and the engine dials in a block of four columns in the middle */
  const dialTex = dialsTexture();
  const pan = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 0.82), new THREE.MeshStandardMaterial({ map: dialTex, roughness: 0.6, emissive: 0xffffff, emissiveMap: dialTex, emissiveIntensity: 0.16 }));
  pan.position.set(0, 0.56, -1.83);
  pan.rotation.x = -0.22;
  g.add(pan);
  box(2.34, 0.92, 0.3, M.panel, 0, 0.5, -1.99, g);
  /* the centre pedestal, wide and long, running back between the seats: the four throttle levers with black knobs at its front, the flap lever, the red
     speed-brake lever, then the radio panels with rows of knobs further back (as in the photograph) */
  box(0.62, 0.62, 1.5, M.panelLight, 0, 0.31, -0.98, g);
  const top = box(0.58, 0.04, 1.46, M.panel, 0, 0.63, -0.98, g); top.rotation.x = 0.06;
  for (let i = 0; i < 4; i++) {
    const x = -0.15 + i * 0.1;
    const l = box(0.025, 0.025, 0.34, M.metal, x, 0.76, -1.42, g);
    l.rotation.x = -0.5;
    mesh(new THREE.SphereGeometry(0.035, 10, 8), M.knob, x, 0.86, -1.28, g);
  }
  const fl = box(0.025, 0.025, 0.3, M.metal, 0.25, 0.74, -1.22, g); fl.rotation.x = -0.35;
  mesh(new THREE.SphereGeometry(0.03, 8, 6), M.knob, 0.25, 0.82, -1.1, g);
  const sb = box(0.025, 0.025, 0.28, M.metal, -0.25, 0.74, -1.12, g); sb.rotation.x = -0.3;
  mesh(new THREE.SphereGeometry(0.032, 8, 6), M.red, -0.25, 0.81, -1.0, g);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) cyl(0.017, 0.017, 0.02, M.knob, -0.2 + c * 0.1, 0.66 + r * 0.008, -0.86 + r * 0.14, g, 8);
  const tw = cyl(0.07, 0.07, 0.03, M.trim, 0.31, 0.62, -0.7, g, 14); tw.rotation.z = Math.PI / 2;
  /* control columns, a wheel on each; rudder pedals under the panel; seats; the overhead panel */
  for (const s of [-1, 1]) {
    const x = s * 0.7;
    cyl(0.03, 0.03, 0.85, M.metal, x, 0.425, -1.2, g, 8);
    /* the control wheel, open at the top in a ram's horn (as in the photograph): the lower half of a ring and two upright grips, on a hub */
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.018, 8, 24, Math.PI), M.black);
    wheel.rotation.z = Math.PI;
    wheel.position.set(x, 0.88, -1.08);
    g.add(wheel);
    for (const dx of [-0.17, 0.17]) cyl(0.022, 0.022, 0.14, M.black, x + dx, 0.95, -1.08, g, 8);
    box(0.12, 0.08, 0.06, M.black, x, 0.88, -1.1, g);
    box(0.16, 0.09, 0.01, solid(0xcfd0c7, 0.7), x, 0.87, -1.07, g); /* the clip for the checklist card */
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
  const engTex = engineerTexture();
  const ep = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.1), new THREE.MeshStandardMaterial({ map: engTex, roughness: 0.6, emissive: 0xffffff, emissiveMap: engTex, emissiveIntensity: 0.14 }));
  ep.position.set(1.305, 1.0, 0.1);
  ep.rotation.y = -Math.PI / 2;
  g.add(ep);
  /* the overhead panel */
  /* the overhead panel, large and crowded with switches, sloping down to the top of the windscreen (as in the photograph) */
  const ohSlab = box(1.6, 0.12, 1.25, M.panel, 0, 1.9, -1.45, g); ohSlab.rotation.x = -0.18;
  const oh = new THREE.Mesh(new THREE.PlaneGeometry(1.56, 1.2), new THREE.MeshStandardMaterial({ map: overheadTexture(), roughness: 0.6 }));
  oh.position.set(0, 1.835, -1.45);
  oh.rotation.x = Math.PI / 2 - 0.18;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 11; c++) { const k = box(0.03, 0.05, 0.03, (r + c) % 5 ? M.metal : M.knob, -0.6 + c * 0.12, 1.79 + r * 0.04, -1.95 + r * 0.22, g); k.rotation.x = -0.18; }
  g.add(oh);
  /* ---- lighting and small things that make it a working room ---- */
  const lamp = (x, y, z, hex, r = 0.016) => {
    const m = mesh(new THREE.SphereGeometry(r, 8, 6), new THREE.MeshBasicMaterial({ color: hex }), x, y, z, g);
    m.userData.glow = true; /* a warning light: the engine's glow (engine/lightkind.js) lifts it */
    return m;
  };
  /* the master caution lights and the three green wheel lights on the panel */
  lamp(-0.12, 0.96, -1.82, 0xffb020); lamp(0.12, 0.96, -1.82, 0xffb020); lamp(0.0, 0.96, -1.82, 0xff3020);
  for (let i = 0; i < 3; i++) lamp(-0.1 + i * 0.1, 0.66, -1.97, 0x30e060);
  /* the dome light in the ceiling, warm, with a soft light under it for the people's faces */
  const dome = cyl(0.11, 0.11, 0.04, new THREE.MeshBasicMaterial({ color: 0xfff1cc }), 0, 2.0, 0.2, g, 14);
  dome.userData.glow = true;
  const dl = new THREE.PointLight(0xffe8c0, 0.9, 4.2, 1.6);
  dl.position.set(0, 1.85, 0.1);
  g.add(dl);
  /* two clocks high on the panel, a radio stack on the pedestal, a row of red fire handles over the windscreen */
  for (const s of [-1, 1]) {
    const clock = cyl(0.07, 0.07, 0.02, solid(0xf3f1e6, 0.5), s * 0.45, 1.03, -1.95, g, 16);
    clock.rotation.x = Math.PI / 2 - 0.3;
  }
  box(0.44, 0.1, 0.28, M.panelLight, 0, 0.58, -0.42, g);
  for (let i = 0; i < 4; i++) cyl(0.018, 0.018, 0.02, M.knob, -0.15 + i * 0.1, 0.64, -0.42, g, 8);
  for (let i = 0; i < 4; i++) {
    const h = box(0.04, 0.04, 0.14, M.red, -0.36 + i * 0.24, 1.9, -1.8, g);
    box(0.12, 0.02, 0.02, M.red, -0.36 + i * 0.24, 1.9, -1.88, g);
    void h;
  }
  /* a pair of sun visors above the windscreen, two wipers on its sill, a checklist on the pedestal */
  for (const x of [-0.95, 0.95]) {
    const v = box(0.8, 0.04, 0.36, solid(0x2a2d2e, 0.9), x, 1.93, -2.15, g);
    v.rotation.x = 0.35;
    const w = box(0.03, 0.03, 0.5, M.black, x * 0.7, 0.99, -2.34, g);
    w.rotation.y = x < 0 ? 0.5 : -0.5;
  }
  const list = box(0.2, 0.01, 0.28, solid(0xece8d8, 0.8), 0.0, 0.535, -0.7, g);
  list.rotation.x = -0.15;
  /* a headset hung on a hook behind each pilot, lap and shoulder straps on each seat */
  for (const s of [-1, 1]) {
    const x = s * 0.7;
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 6, 16, Math.PI), M.black);
    band.position.set(x, 1.55, 0.2);
    g.add(band);
    for (const dx of [-0.1, 0.1]) cyl(0.04, 0.04, 0.03, M.black, x + dx, 1.52, 0.2, g, 10).rotation.z = Math.PI / 2;
    box(0.04, 0.5, 0.01, solid(0x1b1d1c, 0.9), x - 0.18, 0.95, 0.04, g);
    box(0.04, 0.5, 0.01, solid(0x1b1d1c, 0.9), x + 0.18, 0.95, 0.04, g);
  }
  /* the circuit-breaker panel on the back wall, rows of tiny round breakers */
  const cb = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.7), new THREE.MeshStandardMaterial({ map: cv(256, 224, (x, W, H) => { x.fillStyle = "#1d2021"; x.fillRect(0, 0, W, H); for (let r = 0; r < 9; r++) for (let c = 0; c < 12; c++) { x.fillStyle = (r * 12 + c) % 11 === 0 ? "#d6a52a" : "#c9c9c0"; x.beginPath(); x.arc(14 + c * 20, 14 + r * 24, 6, 0, 7); x.fill(); } }), roughness: 0.7 }));
  cb.position.set(0.95, 1.3, 1.36);
  cb.rotation.y = Math.PI;
  g.add(cb);
  /* the captain's cap on the folded jump seat: a small cap, a dark crown and a gold band */
  const cap = grp(g, -0.9, 0.62, 1.2);
  mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.08, 14), solid(0x1c2230, 0.9), 0, 0.04, 0, cap);
  mesh(new THREE.CylinderGeometry(0.121, 0.121, 0.016, 14), solid(0xc2a032, 0.4, 0.5), 0, 0.02, 0, cap);
  box(0.18, 0.012, 0.1, solid(0x141824, 0.9), 0, 0.0, 0.1, cap);
  /* a map light and a little jump seat folded against the back wall for the visitor */
  box(0.4, 0.06, 0.34, M.seat, -0.9, 0.55, 1.2, g);
  g.userData.parts = { pedestal: [0, 0.5, -1.0] };
  return g;
}
export const SEATS = { captain: { x: -0.7, z: -0.15, top: 0.56 }, first: { x: 0.7, z: -0.15, top: 0.56 }, engineer: { x: 1.0, z: 0.55, top: 0.56 } };
