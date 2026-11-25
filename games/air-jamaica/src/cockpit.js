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
  wall: solid(0xa9b3b8, 0.8), /* the pale grey-blue of a DC-8's flight deck lining (MK Airlines DC-8 photograph, Wikimedia Commons) */
  ceiling: solid(0xbcc5c9, 0.8),
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
    x.fillStyle = "#3b4044"; x.fillRect(0, 0, W, H); /* mid grey, as in the photographs (it was nearly black) */
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
    /* the engine instruments in the middle: four columns (one per engine) of five dials, as on the Douglas photograph of a DC-8-63's panel
       (EPR, N1, EGT, N2, fuel flow), in a panel of their own with a lighter rim */
    x.fillStyle = "#24282a"; x.fillRect(452, 14, 246, 332); x.strokeStyle = "#5a6062"; x.lineWidth = 3; x.strokeRect(452, 14, 246, 332);
    for (let c = 0; c < 4; c++)
      for (let r = 0; r < 5; r++) dial(483 + c * 61, 46 + r * 63, 25, ["EPR", "N1", "EGT", "N2", "FF"][r], 0.3 + c * 0.03 + r * 0.09);
    /* the landing gear panel to the right of it: the lever slot with UP and DOWN, three green lights and the gear warning flags */
    x.fillStyle = "#2a2e30"; x.fillRect(706, 14, 92, 230); x.strokeStyle = "#5a6062"; x.strokeRect(706, 14, 92, 230);
    x.fillStyle = "#e8e6dc"; x.font = "bold 13px sans-serif"; x.textAlign = "center"; x.fillText("LANDING GEAR", 752, 32);
    x.fillStyle = "#0a0b0c"; x.fillRect(744, 44, 16, 150); x.fillStyle = "#e8e6dc"; x.fillText("UP", 730, 58); x.fillText("DN", 730, 190);
    for (let i = 0; i < 3; i++) { x.fillStyle = "#1f4a2a"; x.fillRect(776, 60 + i * 30, 14, 18); }
  });
}
/* The flight engineer's panel, laid out as on the Douglas photograph of a DC-8-63's (reference only, docs/games/air-jamaica.md, "Flight deck"): it fills
   the side wall from the desk to the ceiling in framed groups. Top left the electrical system (a block of dials, a row of white switch caps, the generator
   switches); beside it the oxygen regulator; top right the fire test, then two rows of four fuel dials; across the middle the pressurisation and air
   conditioning dials; across the bottom the four engines' columns with their levers (drawn as slots: the levers are 3D) and small dials. */
function engineerTexture() {
  return cv(940, 640, (x, W, H) => {
    x.fillStyle = "#3a3f42"; x.fillRect(0, 0, W, H);
    const frame = (x0, y0, w, h) => { x.fillStyle = "#26292b"; x.fillRect(x0, y0, w, h); x.strokeStyle = "#8a9092"; x.lineWidth = 3; x.strokeRect(x0, y0, w, h); };
    const dial = (cx, cy, r, n) => {
      x.fillStyle = "#0b0c0d"; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
      x.strokeStyle = "#c9ccc4"; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke();
      for (let k = 0; k < 10; k++) { const a = -2.4 + k * 0.53; x.beginPath(); x.moveTo(cx + Math.cos(a) * r * 0.72, cy + Math.sin(a) * r * 0.72); x.lineTo(cx + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r * 0.9); x.stroke(); }
      const a = -2.2 + ((n * 37) % 100) / 100 * 4.2; x.strokeStyle = "#f4f2e8"; x.lineWidth = 3; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * r * 0.7, cy + Math.sin(a) * r * 0.7); x.stroke();
    };
    const sw = (cx, cy, n) => { x.fillStyle = "#101213"; x.beginPath(); x.arc(cx, cy, 6, 0, 7); x.fill(); x.fillStyle = "#dcdcd2"; x.fillRect(cx - 2, n % 2 ? cy - 12 : cy, 4, 12); };
    const cap = (cx, cy, c = "#e9e7dc") => { x.fillStyle = c; x.fillRect(cx - 9, cy - 6, 18, 12); x.strokeStyle = "#111"; x.lineWidth = 1; x.strokeRect(cx - 9, cy - 6, 18, 12); };
    let n = 0;
    /* electrical, top left */
    frame(8, 30, 196, 300);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) dial(34 + c * 46, 62 + r * 50, 19, n++);
    for (let c = 0; c < 7; c++) cap(26 + c * 26, 222); for (let c = 0; c < 7; c++) sw(26 + c * 26, 252, c);
    for (let c = 0; c < 4; c++) { cap(36 + c * 46, 286, "#c9c6b8"); sw(36 + c * 46, 312, c + 1); }
    x.fillStyle = "#e8e6dc"; x.font = "bold 10px sans-serif"; x.textAlign = "center"; x.fillText("GENERATOR CONTROL", 106, 270);
    /* oxygen regulator and the cabin compressors, top middle */
    frame(212, 30, 130, 110); x.fillStyle = "#e8e6dc"; x.fillText("OXYGEN REGULATOR", 277, 46);
    for (let c = 0; c < 3; c++) sw(240 + c * 36, 80, c); dial(305, 112, 18, n++);
    frame(212, 148, 130, 120); dial(246, 196, 28, n++); dial(308, 196, 28, n++); for (let c = 0; c < 4; c++) sw(234 + c * 26, 250, c);
    /* fire test, then fuel quantity, top right */
    frame(350, 30, 282, 60); for (let c = 0; c < 6; c++) cap(372 + c * 44, 60, c % 3 ? "#e9e7dc" : "#d9b23a");
    frame(350, 96, 282, 234);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) dial(386 + c * 68, 136 + r * 74, 25, n++);
    for (let c = 0; c < 8; c++) sw(372 + c * 34, 300, c);
    x.fillStyle = "#e8e6dc"; x.fillText("FUEL QUANTITY", 491, 112);
    /* air conditioning and pressurisation across the middle */
    frame(8, 338, 624, 120);
    for (let c = 0; c < 9; c++) dial(44 + c * 68, 380, 24, n++);
    for (let c = 0; c < 18; c++) sw(26 + c * 34, 436, c);
    /* the engine columns along the bottom: for each engine a lever slot and two small dials, and the start valve lights */
    frame(8, 466, 624, 166);
    for (let e = 0; e < 4; e++) {
      const x0 = 28 + e * 152;
      x.fillStyle = "#0a0b0c"; x.fillRect(x0 + 18, 482, 12, 96); x.fillRect(x0 + 62, 482, 12, 96);
      dial(x0 + 112, 506, 17, n++); dial(x0 + 112, 552, 17, n++);
      cap(x0 + 24, 600, "#d9b23a"); cap(x0 + 68, 600); x.fillStyle = "#e8e6dc"; x.fillText(String(e + 1), x0 + 46, 622);
    }
    /* the aft part of the panel, behind him: hydraulics and the cabin air, more dials and rows of switches (the panel ran this far back on the DC-8; its
       exact contents here are a general picture) */
    frame(640, 30, 292, 200); x.fillStyle = "#e8e6dc"; x.fillText("HYDRAULIC", 786, 48);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) dial(676 + c * 70, 90 + r * 64, 24, n++);
    for (let c = 0; c < 8; c++) sw(662 + c * 34, 210, c);
    frame(640, 238, 292, 220); x.fillStyle = "#e8e6dc"; x.fillText("CABIN AIR", 786, 256);
    for (let c = 0; c < 3; c++) dial(690 + c * 96, 310, 34, n++);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 8; c++) sw(662 + c * 34, 380 + r * 40, c + r);
    frame(640, 466, 292, 166);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) cap(664 + c * 34, 500 + r * 40, (r + c) % 5 === 0 ? "#d9b23a" : "#e9e7dc");
  });
}
/* The overhead panel. Its shape and place are from photographs of real DC-8 flight decks (Wikimedia Commons: an MK Airlines DC-8, CC BY-SA; an SAS
   DC-8-33 of the 1960s; a DC-8 flight deck shown at the Firato exhibition, Dutch National Archive): a narrow panel, about as wide as the middle windscreen
   pane, that drops steeply to the top of that pane and runs back over the pilots, packed with switches in dark plates, with the red fire handles at its
   forward end. What is on it follows the DC-8 overhead in Just Flight's "DC-8 Pilot's Notes" (a simulator manual drawn from the aircraft, a secondary
   source): lighting knobs, the transponders, the anti-ice lights, the engine start buttons. The picture runs from the forward end (top) to the aft end. */
function overheadTexture() {
  return cv(600, 1200, (x, W, H) => {
    x.fillStyle = "#4a5054"; x.fillRect(0, 0, W, H);
    const plate = (x0, y0, w, h) => { x.fillStyle = "#24292c"; x.fillRect(x0, y0, w, h); x.strokeStyle = "#7d8588"; x.lineWidth = 2; x.strokeRect(x0, y0, w, h); for (const [a, b] of [[x0 + 6, y0 + 6], [x0 + w - 6, y0 + 6], [x0 + 6, y0 + h - 6], [x0 + w - 6, y0 + h - 6]]) { x.fillStyle = "#9aa0a2"; x.beginPath(); x.arc(a, b, 2.5, 0, 7); x.fill(); } };
    const label = (t, cx, cy, sz = 12) => { x.fillStyle = "#f2f0e6"; x.font = "bold " + sz + "px sans-serif"; x.textAlign = "center"; x.fillText(t, cx, cy); };
    const tog = (cx, cy, up) => { x.fillStyle = "#0d0f10"; x.beginPath(); x.arc(cx, cy, 7, 0, 7); x.fill(); x.fillStyle = "#d8d8d0"; x.fillRect(cx - 2.5, up ? cy - 14 : cy, 5, 14); };
    const knob = (cx, cy) => { x.fillStyle = "#101214"; x.beginPath(); x.arc(cx, cy, 15, 0, 7); x.fill(); x.fillStyle = "#e8e6dc"; x.fillRect(cx - 1.5, cy - 14, 3, 9); };
    const lamp = (cx, cy, c) => { x.fillStyle = c; x.fillRect(cx - 14, cy - 9, 28, 18); };
    /* forward: the fire handles' slots (the handles are 3D) with their placards */
    plate(20, 16, 560, 150);
    for (let i = 0; i < 4; i++) { const cx = 90 + i * 140; x.fillStyle = "#0a0b0c"; x.fillRect(cx - 26, 36, 52, 70); label("ENG " + (i + 1), cx, 126); label("SELECT AGENT", cx, 146, 10); }
    /* the switch plates, row after row, as crowded as in the photographs */
    const rows = [[180, 120, "WARN LTS   AUX HYD PUMP   OVERRIDE   COCKPIT DOME"], [312, 150, "OVERHEAD LTS   PEDESTAL LTS   INST LIGHTS"], [474, 150, "CAPT'S INST   ENGINE INST   1ST OFF. INST"], [636, 130, "ATC TRANSP 1            ATC TRANSP 2"], [778, 120, "NO. 1    NO. 2    NO. 3    NO. 4   ANTI-ICE VALVES"], [910, 130, "TAXI   LANDING LIGHTS   FLOOD"], [1052, 132, "START  1  2  3  4      IGNITION"]];
    rows.forEach(([y, h, t], r) => {
      plate(20, y, 560, h); label(t, 300, y + 18, 11);
      if (r === 0) for (let c = 0; c < 10; c++) tog(56 + c * 54, y + 72, c % 3 !== 1);
      if (r === 1 || r === 2) for (let c = 0; c < 5; c++) knob(70 + c * 115, y + 84);
      if (r === 3) for (const x0 of [40, 320]) { x.fillStyle = "#08090a"; x.fillRect(x0 + 60, y + 40, 120, 28); x.fillStyle = "#e8b04a"; x.font = "bold 20px monospace"; x.textAlign = "center"; x.fillText("1200", x0 + 120, y + 61); knob(x0 + 30, y + 96); knob(x0 + 210, y + 96); }
      if (r === 4) for (let c = 0; c < 4; c++) lamp(70 + c * 80, y + 66, "#e39b2a");
      if (r === 4) for (let c = 0; c < 3; c++) tog(410 + c * 50, y + 66, c !== 1);
      if (r === 5) for (let c = 0; c < 9; c++) tog(56 + c * 60, y + 76, c % 2 === 0);
      if (r === 6) { for (let c = 0; c < 4; c++) { x.fillStyle = "#16191b"; x.beginPath(); x.arc(110 + c * 64, y + 76, 20, 0, 7); x.fill(); label("S", 110 + c * 64, y + 83, 16); } knob(430, y + 76); tog(500, y + 76, true); }
    });
  });
}
const PILOT_Z = -0.5;   /* the pilots' seats along the room (it was -0.15) */
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
    box(0.06, SILL, 3.55, M.wall, wx, SILL / 2, 0.525, g);   /* the room reaches back to z 2.3 (0.9 m deeper: owner, 25 November 2026, "so we can step back") */
    box(0.06, 2.05 - HEAD, 3.55, M.wall, wx, (HEAD + 2.05) / 2, 0.525, g);
    box(0.06, HEAD - SILL, 2.75, M.wall, wx, (SILL + HEAD) / 2, 0.925, g);
    for (const z of [-1.25, -0.45]) box(0.1, HEAD - SILL + 0.04, 0.06, M.frame, wx - s * 0.02, (SILL + HEAD) / 2, z, g);
    for (const y of [SILL, HEAD]) box(0.1, 0.06, 0.86, M.frame, wx - s * 0.02, y, -0.85, g);
    box(0.08, 0.04, 0.5, M.metal, wx - s * 0.03, SILL + 0.04, -0.85, g); /* the sliding window's catch */
  }
  box(2.9, 0.05, 4.8, M.floor, 0, -0.025, -0.05, g);
  box(2.9, 0.06, 3.35, M.ceiling, 0, 2.05, 0.65, g);
  box(2.9, 2.05, 0.06, M.wall, 0, 1.025, 2.3, g);
  box(0.8, 1.7, 0.04, M.panelLight, 0, 0.9, 2.26, g); /* the door to the cabin */
  box(0.08, 0.3, 0.05, M.metal, 0.28, 0.95, 2.23, g);
  /* the glareshield: a narrow black hood over the panel, with the autopilot's strip of knobs and small windows along its top (as in the photograph) */
  /* the glareshield (photographs: MK Airlines DC-8, Douglas photograph of a DC-8-63): a dark coaming over the panel, edged by a pale padded rail that
     curves round from side window to side window; the flight director's panel of knobs in the middle; a red and an amber warning light at each end */
  box(2.3, 0.07, 0.36, solid(0x2c3134, 0.8), 0, 0.98, -1.98, g);
  { const pts = [[-1.32, -1.45], [-1.1, -1.72], [-0.6, -1.86], [0, -1.9], [0.6, -1.86], [1.1, -1.72], [1.32, -1.45]].map(([px, pz]) => new THREE.Vector3(px, 1.02, pz));
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.032, 8), solid(0xb3bcc0, 0.6))); }
  box(0.62, 0.1, 0.1, M.panelLight, 0, 1.08, -1.9, g);
  for (let i = 0; i < 6; i++) cyl(0.018, 0.02, 0.03, M.knob, -0.25 + i * 0.1, 1.08, -1.84, g, 10).rotation.x = Math.PI / 2;
  for (const s of [-1, 1]) for (const [dx, c] of [[0, 0xff3a2a], [0.07, 0xffb020]]) { const l = box(0.05, 0.035, 0.02, new THREE.MeshBasicMaterial({ color: c }), s * (0.82 + dx), 1.05, -1.86, g); l.userData.glow = true; }
  /* the main panel: flat across the front, tilted back, the pilots' dials either side and the engine dials in a block of four columns in the middle */
  const dialTex = dialsTexture();
  const pan = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 0.82), new THREE.MeshStandardMaterial({ map: dialTex, roughness: 0.6, emissive: 0xffffff, emissiveMap: dialTex, emissiveIntensity: 0.16 }));
  pan.position.set(0, 0.56, -1.8);
  pan.rotation.x = -0.22;
  g.add(pan);
  box(2.34, 0.92, 0.3, M.panel, 0, 0.5, -2.12, g); /* behind the tilted dial face, so its top row is not buried */
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
    const sx = x, sz = PILOT_Z;   /* slid forward, as a pilot sets his seat to fly, so the wheel is close to his chest (owner, 25 November 2026: the reach to it bent the arm unnaturally) */
    box(0.5, 0.12, 0.5, M.seat, sx, 0.5, sz, g);
    box(0.5, 0.72, 0.1, M.seat, sx, 0.9, sz + 0.27, g);
    box(0.3, 0.2, 0.08, M.seatDark, sx, 1.34, sz + 0.28, g);
    for (const dx of [-0.27, 0.27]) box(0.05, 0.05, 0.4, M.metal, sx + dx, 0.7, sz, g);
    cyl(0.06, 0.08, 0.44, M.metal, sx, 0.22, sz, g, 8);
  }
  /* the flight engineer: a seat behind the first officer turned to face the side panel, and the panel on the right-hand wall */
  box(0.46, 0.12, 0.46, M.seat, 0.68, 0.5, 0.55, g);
  box(0.1, 0.7, 0.46, M.seat, 0.46, 0.9, 0.55, g); /* the back behind him, on the side away from his panel (it stood on the panel side, so he faced his own seat back) */
  cyl(0.06, 0.08, 0.44, M.metal, 0.68, 0.22, 0.55, g, 8);
  /* his panel fills the wall from the desk to the ceiling (Douglas photograph of a DC-8-63's flight engineer's station), clear of the sliding window */
  const EP = { z0: -0.4, z1: 1.45, y0: 0.74, y1: 2.0 },   /* long, as on the DC-8: it runs back past him, so his reach finds switches */ ew = EP.z1 - EP.z0, eh = EP.y1 - EP.y0, ez = (EP.z0 + EP.z1) / 2, ey = (EP.y0 + EP.y1) / 2;
  box(0.12, eh, ew + 0.04, M.panel, 1.37, ey, ez, g);
  const engTex = engineerTexture();
  const ep = new THREE.Mesh(new THREE.PlaneGeometry(ew, eh), new THREE.MeshStandardMaterial({ map: engTex, roughness: 0.6, emissive: 0xffffff, emissiveMap: engTex, emissiveIntensity: 0.12 }));
  ep.position.set(1.305, ey, ez);
  ep.rotation.y = -Math.PI / 2;
  g.add(ep);
  /* the four engine levers standing out of their slots along the bottom row, white-knobbed; the fold-down desk under the panel with his log and papers */
  for (let e = 0; e < 4; e++) {
    const u = (28 + e * 152 + 24) / 940, z = EP.z0 + u * ew, y = EP.y0 + (1 - 520 / 640) * eh;
    const lv = box(0.09, 0.018, 0.018, M.metal, 1.26, y, z, g); lv.rotation.z = -0.35;
    mesh(new THREE.SphereGeometry(0.02, 8, 6), solid(0xeeeee6, 0.5), 1.215, y + 0.016, z, g);
  }
  box(0.2, 0.035, ew, solid(0x55595b, 0.7), 1.25, EP.y0 - 0.02, ez, g);   /* a narrow desk, clear of his knees (the audit found it over his lap) */
  const log = box(0.16, 0.012, 0.32, solid(0xeeebdf, 0.85), 1.25, EP.y0 + 0.004, ez + 0.1, g); log.rotation.y = 0.05;
  box(0.15, 0.008, 0.28, solid(0xe6e2d2, 0.85), 1.26, EP.y0 + 0.012, ez - 0.32, g);
  /* the roof over the nose: a brow from the windscreen's head rail up to the roof, and the roof itself, so no sky shows above the panes */
  for (let i = 0; i < FOOT.length - 1; i++) seg(FOOT[i], FOOT[i + 1], HEAD + 0.05, 2.05, M.ceiling, 0.05, 0, -LEAN);
  {
    const sh = new THREE.Shape();
    FOOT.forEach(([x, z], i) => (i ? sh.lineTo(x, -z) : sh.moveTo(x, -z)));
    sh.lineTo(1.45, 0.95); sh.lineTo(-1.45, 0.95);
    const roof = new THREE.Mesh(new THREE.ShapeGeometry(sh), M.ceiling);
    roof.rotation.x = -Math.PI / 2; roof.position.y = 2.03; roof.material.side = THREE.DoubleSide;
    g.add(roof);
  }
  /* the overhead panel, crowded with small switches, sloping from the top of the windscreen back over the pilots' heads (as in the photograph) */
  /* the overhead panel: narrow (0.6 m, the middle pane's width), steep at its forward end where it drops to the top of the middle pane, then running back
     over the pilots almost flat, in a grey frame 9 cm deep (photographs: MK Airlines DC-8, SAS DC-8-33, the Firato exhibit) */
  const OH = { z0: -2.2, y0: 1.74, z1: -1.92, y1: 1.98, z2: -0.9, y2: 2.02 }, OW = 0.6;
  const ohTex = overheadTexture(), ohMat = new THREE.MeshStandardMaterial({ map: ohTex, roughness: 0.6, emissive: 0xffffff, emissiveMap: ohTex, emissiveIntensity: 0.07 });
  const face = (za, ya, zb, yb, v0, v1) => {   /* one part of the panel's face, showing the rows v0 to v1 of its picture (1 is the forward end) */
    const len = Math.hypot(zb - za, yb - ya), tilt = Math.atan2(yb - ya, zb - za), geo = new THREE.PlaneGeometry(OW - 0.04, len);
    const uv = geo.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setY(k, v1 + (v0 - v1) * uv.getY(k));
    const m = new THREE.Mesh(geo, ohMat); m.position.set(0, (ya + yb) / 2 - 0.004, (za + zb) / 2); m.rotation.x = Math.PI / 2 + tilt; g.add(m);
    const back = box(OW, 0.09, len, M.trim, 0, (ya + yb) / 2 + 0.045, (za + zb) / 2, g); back.rotation.x = tilt;   /* the frame */
  };
  const f1 = Math.hypot(OH.z1 - OH.z0, OH.y1 - OH.y0), f2 = Math.hypot(OH.z2 - OH.z1, OH.y2 - OH.y1), cut = f1 / (f1 + f2);
  face(OH.z0, OH.y0, OH.z1, OH.y1, 1 - cut, 1);
  face(OH.z1, OH.y1, OH.z2, OH.y2, 0, 1 - cut);
  /* the four red fire handles in their slots at the forward end: a T-handle on a short shaft, each over its engine's placard */
  { const k0 = 0.03 / (1 - 0), along = (t) => [OH.z0 + (OH.z1 - OH.z0) * t, OH.y0 + (OH.y1 - OH.y0) * t];
    void k0;
    for (let i = 0; i < 4; i++) {
      const [z, y] = along(0.32), xx = -OW / 2 + 0.02 + (OW - 0.04) * ((90 + i * 140) / 600);
      const sh = cyl(0.008, 0.008, 0.06, M.metal, xx, y - 0.03, z + 0.012, g, 6); sh.rotation.x = 0.4;
      const hb = box(0.075, 0.022, 0.026, M.red, xx, y - 0.062, z + 0.03, g); hb.rotation.x = 0.4;
    } }
  /* small switches and knobs standing out of the face, so it is not a flat picture from below: toggles on the aft rows, knobs on the light rows */
  { const at = (v) => { const t = 1 - v; if (t < cut) { const q = t / cut; return [OH.z0 + (OH.z1 - OH.z0) * q, OH.y0 + (OH.y1 - OH.y0) * q]; } const q = (t - cut) / (1 - cut); return [OH.z1 + (OH.z2 - OH.z1) * q, OH.y1 + (OH.y2 - OH.y1) * q]; };
    const X = (px) => -OW / 2 + 0.02 + (OW - 0.04) * (px / 600), V = (py) => 1 - py / 1200;
    for (const [py, cols, step, x0] of [[252, 10, 54, 56], [986, 9, 60, 56]]) for (let c = 0; c < cols; c++) { const [z, y] = at(V(py)); const t = cyl(0.004, 0.003, 0.03, M.metal, X(x0 + c * step), y - 0.017, z, g, 5); t.rotation.x = c % 2 ? 0.35 : -0.35; }
    for (const py of [396, 558]) for (let c = 0; c < 5; c++) { const [z, y] = at(V(py)); cyl(0.016, 0.018, 0.018, M.knob, X(70 + c * 115), y - 0.01, z, g, 10); }
    for (let c = 0; c < 4; c++) { const [z, y] = at(V(1128)); cyl(0.014, 0.014, 0.012, M.knob, X(110 + c * 64), y - 0.007, z, g, 10); } }
  /* either side of it the ceiling has its fittings: round air outlets (eyeballs) and a dome light each side (MK Airlines photograph) */
  for (const s of [-1, 1]) {
    for (const z of [-1.7, -1.25]) { const r = cyl(0.045, 0.05, 0.03, M.trim, s * 0.62, 2.0, z, g, 12); void r; mesh(new THREE.SphereGeometry(0.028, 10, 8), M.metal, s * 0.62, 1.985, z, g); }
    const d = cyl(0.07, 0.07, 0.025, new THREE.MeshBasicMaterial({ color: 0xfff1cc }), s * 0.75, 2.005, -0.95, g, 14); d.userData.glow = true;
  }
  /* ---- lighting and small things that make it a working room ---- */
  const lamp = (x, y, z, hex, r = 0.016) => {
    const m = mesh(new THREE.SphereGeometry(r, 8, 6), new THREE.MeshBasicMaterial({ color: hex }), x, y, z, g);
    m.userData.glow = true; /* a warning light: the engine's glow (engine/lightkind.js) lifts it */
    return m;
  };
  /* the master caution lights and the three green wheel lights on the panel */
  lamp(-0.12, 0.96, -1.82, 0xffb020); lamp(0.12, 0.96, -1.82, 0xffb020); lamp(0.0, 0.96, -1.82, 0xff3020);
  for (let i = 0; i < 3; i++) lamp(-0.1 + i * 0.1, 0.62, -1.78, 0x30e060);
  /* the dome light in the ceiling, warm, with a soft light under it for the people's faces */
  const dome = cyl(0.11, 0.11, 0.04, new THREE.MeshBasicMaterial({ color: 0xfff1cc }), 0, 2.0, 0.2, g, 14);
  dome.userData.glow = true;
  const dl = new THREE.PointLight(0xffe8c0, 0.9, 4.2, 1.6);
  dl.position.set(0, 1.85, 0.1);
  g.add(dl);
  /* two clocks high on the panel, a radio stack on the pedestal, a row of red fire handles under the front of the overhead panel */
  for (const s of [-1, 1]) {
    const clock = cyl(0.07, 0.07, 0.02, solid(0xf3f1e6, 0.5), s * 0.45, 1.03, -1.95, g, 16);
    clock.rotation.x = Math.PI / 2 - 0.3;
  }
  box(0.44, 0.1, 0.28, M.panelLight, 0, 0.58, -0.42, g);
  for (let i = 0; i < 4; i++) cyl(0.018, 0.018, 0.02, M.knob, -0.15 + i * 0.1, 0.64, -0.42, g, 8);
  /* (the fire handles are now at the overhead panel's forward end, as in the photographs; the row of red handles under it is gone) */
  /* a pair of sun visors above the windscreen, two wipers on its sill, a checklist on the pedestal */
  for (const x of [-0.95, 0.95]) {
    /* the sun visors: dark grey fabric flaps hinged at the head of each angled side pane (MK Airlines photograph), folded up flat against the panel above
       the window so they never cover it (owner, 25 November 2026: "move them up to be against the panel above") */
    /* the head of the angled pane runs from (1.45, -1.25) to (1.15, -1.9); the lining above it is set 12 cm out (the lean), so the visor lies 10 cm out from the foot line */
    const v = box(0.58, 0.26, 0.015, solid(0x3a3f43, 1.0), Math.sign(x) * 1.39, 1.89, -1.62, g);
    v.rotation.order = "YXZ"; v.rotation.y = Math.sign(x) * -1.138; v.rotation.x = 0.0;
    const w = box(0.03, 0.03, 0.5, M.black, x * 0.7, 0.99, -2.34, g);
    w.rotation.y = x < 0 ? 0.5 : -0.5;
  }
  const list = box(0.2, 0.01, 0.28, solid(0xece8d8, 0.8), 0.0, 0.535, -0.7, g);
  list.rotation.x = -0.15;
  /* a headset hung over each pilot's headrest, lap and shoulder straps on each seat */
  for (const s of [-1, 1]) {
    const x = s * 0.7;
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.012, 6, 16, Math.PI), M.black); /* hung over the top of the seat's headrest (it floated in the air where a hook was never drawn) */
    band.position.set(x, 1.43, PILOT_Z + 0.28);
    g.add(band);
    for (const dx of [-0.175, 0.175]) cyl(0.04, 0.04, 0.03, M.black, x + dx, 1.4, PILOT_Z + 0.28, g, 10).rotation.z = Math.PI / 2;
    box(0.04, 0.5, 0.01, solid(0x1b1d1c, 0.9), x - 0.18, 0.95, PILOT_Z + 0.19, g);
    box(0.04, 0.5, 0.01, solid(0x1b1d1c, 0.9), x + 0.18, 0.95, PILOT_Z + 0.19, g);
  }
  /* the circuit-breaker panel on the back wall, rows of tiny round breakers */
  const cb = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.7), new THREE.MeshStandardMaterial({ map: cv(256, 224, (x, W, H) => { x.fillStyle = "#1d2021"; x.fillRect(0, 0, W, H); for (let r = 0; r < 9; r++) for (let c = 0; c < 12; c++) { x.fillStyle = (r * 12 + c) % 11 === 0 ? "#d6a52a" : "#c9c9c0"; x.beginPath(); x.arc(14 + c * 20, 14 + r * 24, 6, 0, 7); x.fill(); } }), roughness: 0.7 }));
  cb.position.set(-0.85, 1.3, 2.26);   /* on the back wall, the other side of the door from the engineer's panel */
  cb.rotation.y = Math.PI;
  g.add(cb);
  /* the captain's cap on the folded jump seat: a small cap, a dark crown and a gold band */
  const cap = grp(g, -0.9, 0.62, 2.1);
  mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.08, 14), solid(0x1c2230, 0.9), 0, 0.04, 0, cap);
  mesh(new THREE.CylinderGeometry(0.121, 0.121, 0.016, 14), solid(0xc2a032, 0.4, 0.5), 0, 0.02, 0, cap);
  box(0.18, 0.012, 0.1, solid(0x141824, 0.9), 0, 0.0, 0.1, cap);
  /* a map light and a little jump seat folded against the back wall for the visitor */
  box(0.4, 0.06, 0.34, M.seat, -0.9, 0.55, 2.1, g);
  g.userData.parts = { pedestal: [0, 0.5, -1.0] };
  g.userData.noSurface = true; /* painted and trimmed metal, not a wall: the engine's plaster picture made the ceiling speckled (engine/surfaces.js) */
  return g;
}
export const SEATS = { captain: { x: -0.7, z: PILOT_Z, top: 0.56 }, first: { x: 0.7, z: PILOT_Z, top: 0.56 }, engineer: { x: 0.68, z: 0.55, top: 0.56 } };
