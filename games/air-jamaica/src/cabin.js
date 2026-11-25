/* The cabin of a single-aisle Air Jamaica jet in the 2000s, for chapter 3, "The flying chef" (docs/games/air-jamaica.md, "Scene B").
   WHAT IS A GENERAL PICTURE: the sources say the flying chef flew on the airline's flights and cooked Jamaican food on board (JIS, 21 March 2004), but
   no photograph of the cabin of those years has been looked at. The cabin follows the common layout of a single-aisle jet of the time (an Airbus A320
   is 3.7 m wide inside, with three seats each side of one aisle); the seat cloth, the panels and the galley are general, and the aisle is a little
   wider than a real one so the player can pass. Do not call it a copy of Air Jamaica's own cabin.
   Local axes: the nose is toward -z, the floor is y = 0, the aisle runs along x = 0. */
import * as THREE from "three";
import { grp, mesh, box, cyl, solid, cv } from "./gfx.js";

export const CABIN = {
  half: 1.95, // the side walls: 3.9 m across, a little wider than a real A320's 3.7 m, so the aisle can be wider (owner, 25 November 2026: "the cabin needs a bit more space to move")
  aisle: 0.56, // half the aisle's width (1.12 m; a real one is about half that: a game's allowance, so you can walk past people)
  rows: [-2.8, -1.7, -0.6, 0.5, 1.6], // 1.1 m apart (owner, 25 November 2026: more space between one row and the next); // each row's seat cushion centre, along z: 95 cm apart, so a passenger has room for knees, hands and a tray (at 80 cm, with these thick seats, the seat ahead was against his chest: owner, 24 November 2026)
  seatX: [0.8, 1.25, 1.7], // the three seats of a side, from the aisle out
  seatTop: 0.48,
  front: -4.7, // the front wall of the galley
  back: 3.75, // the curtain at the back: 0.8 m more room behind the last row
  trolley: { x: 0, z: -4.05 },
  counter: { z0: -4.7, z1: -4.28, top: 1.0 },
};
const M = {
  seat: solid(0x2b4a8c, 0.9),
  seatDark: solid(0x1e3566, 0.9),
  head: solid(0xe9e6dc, 0.9),
  wall: solid(0xdedcd4, 0.8),
  ceiling: solid(0xeceae2, 0.8),
  bin: solid(0xd6d4cc, 0.75),
  floor: solid(0x56607a, 0.95),
  metal: solid(0xb8bcbc, 0.35, 0.7),
  steel: solid(0xc9cdcf, 0.25, 0.85),
  dark: solid(0x2a2d30, 0.7),
  tray: solid(0x9a9c98, 0.7),
  cloth: solid(0xf4f2ec, 0.9),
  plate: solid(0xf7f7f2, 0.4),
  curtain: solid(0x2f4f8f, 0.95),
};
/* the sky outside each window: bright blue going pale at the bottom, with a few clouds below */
function skyTexture(dusk) {
  if (dusk) /* evening over the sea near Kingston: a deep blue sky going gold and pink at the horizon, the sea dark below, a line of lights along the coast */
    return cv(128, 192, (x, W, H) => {
      const g = x.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#28386a"); g.addColorStop(0.45, "#c77a74"); g.addColorStop(0.58, "#f3b25e"); g.addColorStop(0.6, "#2c3150"); g.addColorStop(1, "#151a2c");
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.fillStyle = "#ffd89a"; for (let i = 0; i < 26; i++) x.fillRect(((i * 37) % W), 120 + ((i * 13) % 9), 2, 2);
    });
  return cv(128, 192, (x, W, H) => {
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#5f9fdc");
    g.addColorStop(0.55, "#a9cdee");
    g.addColorStop(0.75, "#f4f6f8");
    g.addColorStop(1, "#dfe8ef");
    x.fillStyle = g;
    x.fillRect(0, 0, W, H);
    x.fillStyle = "rgba(255,255,255,0.85)";
    for (let i = 0; i < 6; i++) { x.beginPath(); x.ellipse(10 + i * 24, 150 + (i % 2) * 10, 22, 8, 0, 0, 7); x.fill(); }
  });
}
/* one seat: a cushion, a back with a pale head cover, arms between, and a fold-down tray on the back */
function seat(g, x, z, trayDown = false) {
  const s = grp(g, x, 0, z);
  box(0.44, 0.12, 0.46, M.seat, 0, CABIN.seatTop - 0.06, 0, s);
  const back = box(0.44, 0.74, 0.07, M.seat, 0, 0.84, 0.25, s);
  back.rotation.x = -0.12;
  const hc = box(0.4, 0.2, 0.012, M.head, 0, 1.08, 0.18, s);
  hc.rotation.x = -0.12;
  box(0.36, 0.42, 0.11, M.seatDark, 0, 0.21, 0.02, s);
  box(0.36, 0.24, 0.012, M.seatDark, 0, 0.5, 0.345, s); /* the seat pocket on the back, where the magazine is kept */
  if (trayDown) box(0.38, 0.02, 0.26, M.tray, 0, 0.84, 0.42, s); /* 84 cm up: over the thighs and the hands resting on them, with room (at 70 cm it lay in the passenger's lap) */ /* the tray, down, for the passenger behind */
  else { const t = box(0.34, 0.26, 0.02, M.tray, 0, 0.9, 0.31, s); t.rotation.x = -0.12; }
  return s;
}
/* a plate of food: a white plate and the dish on it, made of small soft pieces in the dish's colours */
function dish(kind) {
  const d = grp();
  mesh(new THREE.CylinderGeometry(0.068, 0.058, 0.012, 24), M.plate, 0, 0.006, 0, d);
  const piece = (c, r, x, z, sy = 0.5, y = 0.016) => { const m = mesh(new THREE.SphereGeometry(r, 10, 7), solid(c, 0.75), x, y, z, d); m.scale.y = sy; return m; };
  const R = (i) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
  if (kind === "ackee") { /* ackee and saltfish: soft yellow ackee, pale flakes of fish, a few red and green peppers */
    for (let i = 0; i < 9; i++) piece(0xf0c63a, 0.016, (R(i) - 0.5) * 0.07, (R(i + 9) - 0.5) * 0.07, 0.6);
    for (let i = 0; i < 6; i++) piece(0xece2c8, 0.012, (R(i + 20) - 0.5) * 0.08, (R(i + 30) - 0.5) * 0.08, 0.5);
    for (let i = 0; i < 3; i++) piece(i ? 0x3f8a2e : 0xc8322a, 0.007, (R(i + 40) - 0.5) * 0.06, (R(i + 50) - 0.5) * 0.06, 0.6, 0.024);
  } else if (kind === "calaloo") { /* calaloo and saltfish: dark green leaves with flakes of fish */
    for (let i = 0; i < 10; i++) piece(0x2f6a2a, 0.017, (R(i + 3) - 0.5) * 0.08, (R(i + 13) - 0.5) * 0.08, 0.4);
    for (let i = 0; i < 4; i++) piece(0xe8dcc0, 0.011, (R(i + 23) - 0.5) * 0.06, (R(i + 33) - 0.5) * 0.06, 0.5, 0.022);
  } else if (kind === "rundung") { /* run dung: fish cooked down in a creamy coconut sauce */
    const s = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.008, 20), solid(0xe8d6a8, 0.6), 0, 0.016, 0, d); void s;
    for (let i = 0; i < 3; i++) piece(0xd9b98a, 0.02, (i - 1) * 0.03, 0.005, 0.45, 0.022);
    for (let i = 0; i < 4; i++) piece(0xd8452e, 0.006, (R(i + 60) - 0.5) * 0.06, (R(i + 70) - 0.5) * 0.06, 0.6, 0.026);
  } else if (kind === "festival") { /* festival: sweet fried dumplings, long and golden */
    for (let i = 0; i < 3; i++) { const f = piece(0xd49a3c, 0.016, (i - 1) * 0.032, 0, 0.7, 0.02); f.scale.z = 2.4; f.scale.x = 0.9; f.rotation.y = 0.2 * (i - 1); }
  } else if (kind === "jerk") { /* jerk chicken: dark, spiced pieces */
    for (let i = 0; i < 5; i++) { const p = piece(0x5a2e18, 0.019, (R(i + 80) - 0.5) * 0.07, (R(i + 90) - 0.5) * 0.07, 0.6, 0.02); p.scale.x = 1.3; }
    for (let i = 0; i < 4; i++) piece(0x8a3a1c, 0.008, (R(i + 100) - 0.5) * 0.08, (R(i + 110) - 0.5) * 0.08, 0.6, 0.03);
  }
  return d;
}
/* a silver dome that covers a plate */
function cloche() {
  const c = grp();
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.074, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.steel);
  dome.material.side = THREE.DoubleSide;
  c.add(dome);
  mesh(new THREE.SphereGeometry(0.012, 8, 6), M.steel, 0, 0.078, 0, c);
  return c;
}
export const DISHES = ["ackee", "calaloo", "rundung", "festival", "jerk"];
export function buildCabin(opts = {}) {
  const g = grp();
  const H = CABIN.half, L = CABIN.front, B = CABIN.back + 0.05, len = B - L, mid = (B + L) / 2;
  box(H * 2, 0.04, len, M.floor, 0, -0.02, mid, g);
  /* the side walls: a lower panel, the window belt, and the curve up to the bins */
  const sky = new THREE.MeshBasicMaterial({ map: skyTexture(opts.dusk) }), blinds = {};
  sky.userData.noGlow = true;
  for (const s of [-1, 1]) {
    box(0.06, 2.18, len, M.wall, s * H, 1.09, mid, g);
    for (const [r, z] of CABIN.rows.entries()) {
      /* each window beside the seated passenger's head, forward of his seat back and above the one in front: they sat behind the seat backs, at their
         height, so the seats hid every window (owner, 25 November 2026: "no windows") */
      const WY = 1.18, WZ = z - 0.08;
      const w = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.34), sky);
      w.position.set(s * (H - 0.032), WY, WZ);
      w.rotation.y = -s * Math.PI / 2;
      g.add(w);
      const fr = new THREE.Mesh(new THREE.RingGeometry(0.13, 0.16, 24), M.bin);
      fr.scale.y = 1.35;
      fr.position.set(s * (H - 0.034), WY, WZ);
      fr.rotation.y = -s * Math.PI / 2;
      g.add(fr);
      blinds[s + ":" + r] = (b => (b.userData.fixed = true, b))(box(0.012, 0.1, 0.26, M.bin, s * (H - 0.04), WY + 0.2, WZ, g)); /* the blind, pushed up; fixed in its track in the wall (audit-reveal) */
    }
    /* the overhead bins: a deep box over the seats with a curved door; a reading-light strip under them */
    box(0.82, 0.42, len - 1.6, M.bin, s * (H - 0.41), 1.83, mid + 0.4, g);
    box(0.5, 0.05, len - 1.6, M.dark, s * (H - 0.62), 1.6, mid + 0.4, g);
    for (const z of CABIN.rows) { box(0.04, 0.02, 0.02, solid(0xfff3c8, 0.5), s * 1.0, 1.575, z, g); }
  }
  box(H * 2, 0.06, len, M.ceiling, 0, 2.18, mid, g);
  /* the seats: five rows, three each side; the tray is down in front of Mr Clarke (row 2, aisle seat on the right), for his plate, and in front of Tia's seat (row 5, aisle seat on the left), for the magazine */
  for (const [r, z] of CABIN.rows.entries())
    for (const s of [-1, 1]) for (const x of CABIN.seatX) seat(g, s * x, z, x === CABIN.seatX[0] && ((r === 0 && s === 1) || (r === 3 && s === -1))); /* trays down: Mr Clarke's, and Tia's (the magazine is read on it) */
  /* the front: a bulkhead wall with the galley, a counter and lockers, ovens; the trolley stands in front of it */
  box(H * 2, 2.2, 0.06, M.wall, 0, 1.1, L, g);
  const C = CABIN.counter;
  box(3.2, C.top, C.z1 - C.z0, M.bin, 0, C.top / 2, (C.z0 + C.z1) / 2, g);
  box(3.2, 0.03, C.z1 - C.z0 + 0.02, M.steel, 0, C.top + 0.015, (C.z0 + C.z1) / 2, g);
  box(3.2, 0.6, 0.34, M.bin, 0, 1.75, C.z0 + 0.17, g);
  for (let i = 0; i < 6; i++) { box(0.48, 0.5, 0.01, solid(0xc9c7bf, 0.7), -1.25 + i * 0.5, 1.75, C.z0 + 0.345, g); box(0.1, 0.02, 0.02, M.metal, -1.25 + i * 0.5, 1.6, C.z0 + 0.36, g); }
  for (let i = 0; i < 6; i++) box(0.48, 0.84, 0.01, solid(0xcfcdc5, 0.7), -1.25 + i * 0.5, 0.45, C.z1 + 0.006, g);
  /* a seat row's screen wall behind the galley: a low partition each side, so the galley is its own little room at the front */
  for (const s of [-1, 1]) box(1.3, 1.6, 0.06, M.wall, s * (CABIN.aisle + 0.75), 0.8, CABIN.rows[0] - 0.62, g);   /* the galley's side screens, clear of the front row's knees */
  /* the back: a curtain across the cabin */
  const ct = box(H * 2, 2.12, 0.03, M.curtain, 0, 1.06, CABIN.back, g);
  void ct;
  const plates = {}, lids = {};
  g.userData.parts = { plates, lids, blinds };
  if (opts.trolley !== false) {
  /* the chef's trolley: a steel cart with a white cloth on top, the five dishes of the menu, each under a silver dome */
  const T = CABIN.trolley, cart = grp(g, T.x, 0, T.z);
  box(0.82, 0.96, 0.32, M.steel, 0, 0.5, 0, cart);
  box(0.84, 0.02, 0.34, M.cloth, 0, 0.99, 0, cart);
  box(0.84, 0.12, 0.012, M.cloth, 0, 0.93, 0.172, cart); /* the cloth hangs a little over the front */
  for (const x of [-0.36, 0.36]) for (const z of [-0.12, 0.12]) cyl(0.025, 0.025, 0.02, M.dark, x, 0.012, z, cart, 10);
  box(0.06, 0.03, 0.03, M.metal, 0.44, 0.92, 0, cart); /* the handle */
  DISHES.forEach((k, i) => {
    const x = -0.32 + i * 0.16;
    const p = dish(k);
    p.position.set(T.x + x, 1.0, T.z);
    g.add(p);
    plates[k] = p;
    const c = cloche();
    c.position.set(T.x + x, 1.012, T.z);
    g.add(c);
    lids[k] = c;
  });
  }
  /* soft light from the reading lights and the ceiling */
  const lamp = new THREE.PointLight(0xfff0d8, opts.dusk ? 1.1 : 0.8, 7, 1.6);
  lamp.position.set(0, 2.0, -3.6);
  g.add(lamp);
  g.userData.noSurface = true;   /* a plastic lining, not plastered walls (the engine's plaster picture speckled them: engine/surfaces.js) */
  return g;
}
/* where each lid goes when it is lifted: off the plate, up, and set down in a row on the galley counter behind */
export function lidPlace(i, k) {
  const T = CABIN.trolley, C = CABIN.counter;
  const x0 = T.x - 0.32 + i * 0.16, y0 = 1.012, z0 = T.z;
  const x1 = -0.62 + i * 0.31, y1 = C.top + 0.03, z1 = (C.z0 + C.z1) / 2;
  const t = Math.max(0, Math.min(1, k * 1.25 - i * 0.06));
  const e = t * t * (3 - 2 * t);
  return [x0 + (x1 - x0) * e, y0 + (y1 - y0) * e + Math.sin(e * Math.PI) * 0.22, z0 + (z1 - z0) * e];
}

/* SkyWritings, Air Jamaica's in-flight magazine (docs/games/air-jamaica.md, "SkyWritings"). The name and the cover's layout are real (a 2008
   cover the owner sent); the cover painting and the two story pages are made for this game, and the journal page says so. The facts on the page are the sourced ones of the earlier chapters. */
/* the magazine's places follow the seats: the pocket and the tray on the back of the aisle seat of row 4 on the left (it was fixed to the old seat positions) */
const _X0 = CABIN.seatX[0], _RZ = CABIN.rows[3];
export const MAG = { page: [0.19, 0.25], tray: [-_X0, 0.852, _RZ + 0.42], pocket: [-(_X0 + 0.095), 0.56, _RZ + 0.333] };
function magTexture(kind) {
  return cv(608, 800, (x, W, H) => {
    const text = (t, px, py, size, color = "#1d2a44", weight = "bold", align = "left", font = "Georgia, serif") => { x.fillStyle = color; x.font = weight + " " + size + "px " + font; x.textAlign = align; x.fillText(t, px, py); };
    const bird = (cx, cy, r) => { /* the Love Bird in its ring: a ring, and a small bird with a long curling tail inside it */
      x.strokeStyle = "#e0662b"; x.lineWidth = r * 0.16; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke();
      x.fillStyle = "#e0662b"; x.beginPath(); x.ellipse(cx - r * 0.1, cy - r * 0.15, r * 0.32, r * 0.2, -0.4, 0, 7); x.fill();
      x.lineWidth = r * 0.08; x.beginPath(); x.moveTo(cx + r * 0.1, cy - r * 0.05); x.quadraticCurveTo(cx + r * 0.6, cy + r * 0.2, cx + r * 0.1, cy + r * 0.6); x.stroke();
    };
    if (kind === "cover") {
      /* laid out as on a real cover of July/August 2008, "Our Music Issue", that the owner sent (24 November 2026), the nearest in time to this chapter
         (the airline's look of 2004 may have differed a little): a picture to every edge, the airJamaica logo with its roundel at the top left, the
         issue line at the top right, "SkyWritings" in big letters shading from yellow-orange to pink and purple, and the cover lines at the foot in
         yellow and pink. That cover's picture is a real musician; this one is a Jamaican river and waterfall in the forest, like the scene behind
         him. An older cover the owner sent (white, with periwinkle letters and a painting of a hillside village; year not known) is noted in the doc. */
      const R = (n) => ((Math.sin(n * 12.9898) * 43758.5453) % 1 + 1) % 1;
      const sky = x.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#5d8f4a"); sky.addColorStop(0.5, "#3f6f36"); sky.addColorStop(1, "#2c4f2a");
      x.fillStyle = sky; x.fillRect(0, 0, W, H);
      for (let k = 0; k < 500; k++) { x.fillStyle = ["#4f8a3c", "#6aa04a", "#356b2e", "#88b85a", "#2d5a28"][k % 5]; x.beginPath(); x.ellipse(R(k) * W, R(k + 600) * H * 0.75, 10 + R(k + 50) * 22, 5 + R(k + 70) * 9, R(k + 90) * 3, 0, 7); x.fill(); }
      x.fillStyle = "#8d8676"; for (let k = 0; k < 26; k++) { x.beginPath(); x.ellipse(R(k + 200) * W, H * (0.62 + R(k + 300) * 0.3), 30 + R(k + 400) * 40, 14 + R(k + 450) * 14, 0, 0, 7); x.fill(); }
      const fall = (fx, fw, top, bot) => { /* water spilling over a ledge: widening as it falls, in streaks, with mist at its foot */
        x.fillStyle = "rgba(230,245,245,0.5)"; x.beginPath(); x.moveTo(fx, top); x.lineTo(fx + fw, top); x.lineTo(fx + fw * 1.4, bot); x.lineTo(fx - fw * 0.4, bot); x.fill();
        x.strokeStyle = "rgba(255,255,255,0.9)"; x.lineWidth = 3;
        for (let k = 0; k < 14; k++) { const t = k / 13, x0 = fx + fw * t, x1 = fx - fw * 0.4 + fw * 1.8 * t; x.beginPath(); x.moveTo(x0, top + R(k + 1000) * 20); x.lineTo(x1, bot - R(k + 1100) * 30); x.stroke(); }
        x.fillStyle = "rgba(255,255,255,0.55)"; for (let k = 0; k < 8; k++) { x.beginPath(); x.arc(fx + fw / 2 + (R(k + 1200) - 0.5) * fw * 2.2, bot - 6, 14 + R(k + 1250) * 18, 0, 7); x.fill(); }
      };
      fall(W * 0.68, 70, H * 0.18, H * 0.6); fall(W * 0.2, 40, H * 0.42, H * 0.7);
      const pool = x.createLinearGradient(0, H * 0.66, 0, H); pool.addColorStop(0, "#7fc4c0"); pool.addColorStop(1, "#3f8f8c");
      x.fillStyle = pool; x.beginPath(); x.moveTo(0, H * 0.72); x.quadraticCurveTo(W * 0.5, H * 0.62, W, H * 0.7); x.lineTo(W, H); x.lineTo(0, H); x.fill();
      x.strokeStyle = "rgba(255,255,255,0.6)"; x.lineWidth = 3; for (let k = 0; k < 14; k++) { const yy = H * (0.74 + R(k + 800) * 0.22), xx = R(k + 850) * W; x.beginPath(); x.moveTo(xx, yy); x.lineTo(xx + 50, yy); x.stroke(); }
      /* the logo: a purple roundel with a small bird, and "airJamaica" in white */
      x.fillStyle = "#5a2d82"; x.beginPath(); x.arc(46, 46, 22, 0, 7); x.fill();
      x.strokeStyle = "#ffd23f"; x.lineWidth = 4; x.beginPath(); x.arc(46, 46, 14, 0, 7); x.stroke();
      text("airJamaica", 76, 56, 30, "#ffffff", "bold italic", "left", "Arial, sans-serif");
      text("A story of the airline", W - 24, 54, 24, "#ffffff", "bold", "right", "Arial, sans-serif");
      /* the title, shading from yellow-orange to pink to purple, with a dark edge */
      x.font = "bold italic 116px Georgia, serif"; x.textAlign = "center"; x.lineJoin = "round";
      x.lineWidth = 12; x.strokeStyle = "#3a1f4a"; x.strokeText("SkyWritings", W / 2, 190);
      const tg = x.createLinearGradient(0, 110, 0, 200); tg.addColorStop(0, "#ffc531"); tg.addColorStop(0.5, "#f0548f"); tg.addColorStop(1, "#8a3fc0");
      x.fillStyle = tg; x.fillText("SkyWritings", W / 2, 190);
      /* the cover lines */
      x.lineWidth = 6; x.strokeStyle = "#3a1f4a"; x.textAlign = "left";
      x.font = "bold 50px Arial, sans-serif"; x.strokeText("Our Own Wings", 36, H - 110); x.fillStyle = "#ffd23f"; x.fillText("Our Own Wings", 36, H - 110);
      x.font = "bold 36px Arial, sans-serif"; x.strokeText("From 1969 to the flying chef", 36, H - 58); x.fillStyle = "#ff7fbf"; x.fillText("From 1969 to the flying chef", 36, H - 58);
    } else if (kind === "left") {
      x.fillStyle = "#fbf8ef"; x.fillRect(0, 0, W, H);
      text("SKYWRITINGS", 40, 50, 20, "#e0662b", "bold", "left", "Arial, sans-serif");
      text("Our Own", 40, 170, 96);
      text("Wings", 40, 270, 96);
      text("The story of Air Jamaica", 44, 320, 30, "#5a6478", "italic");
      bird(W / 2, 520, 130);
      text("The Love Bird", W / 2, 720, 30, "#5a6478", "italic", "center");
    } else {
      x.fillStyle = "#fbf8ef"; x.fillRect(0, 0, W, H);
      text("SKYWRITINGS", W - 40, 50, 20, "#e0662b", "bold", "right", "Arial, sans-serif");
      const rows = [
        ["1969", "Air Jamaica first flies,", "on 1 April."],
        ["Jets", "One DC-8 and", "three DC-9s."],
        ["Bird", "The Doctor Bird on the", "tail is our Love Bird."],
        ["1994", "New owners, and new", "colours on the planes."],
        ["Now", "Jamaican food, cooked", "by our flying chef."],
      ];
      rows.forEach(([h, a, b], i) => {
        const y = 140 + i * 128;
        x.fillStyle = "#e0662b"; x.fillRect(40, y - 40, 8, 96);
        text(h, 66, y, 40, "#e0662b");
        text(a, 66, y + 40, 32, "#1d2a44", "normal");
        text(b, 66, y + 78, 32, "#1d2a44", "normal");
      });
    }
  });
}
/* the magazine: the right-hand page as its base, and the cover as a leaf on a hinge at the spine (x = 0). Closed, the cover shows; opened (the leaf
   turned over to the left), the two pages of the story show. Its origin is the spine, at the middle of the page's height. */
export function buildMagazine() {
  const [w, h] = MAG.page, mag = grp(), paper = solid(0xfbf8ef, 0.8);
  const right = new THREE.MeshStandardMaterial({ map: magTexture("right"), roughness: 0.8 });
  box(w, 0.004, h, [paper, paper, right, paper, paper, paper], w / 2, 0.002, 0, mag);
  const pivot = grp(mag, 0, 0.004, 0);
  const lt = magTexture("left"); lt.center.set(0.5, 0.5); lt.rotation = Math.PI; /* the leaf's underside is read after the leaf is turned over */
  const cover = new THREE.MeshStandardMaterial({ map: magTexture("cover"), roughness: 0.6 }), left = new THREE.MeshStandardMaterial({ map: lt, roughness: 0.8 });
  box(w, 0.004, h, [paper, paper, cover, left, paper, paper], w / 2, 0.002, 0, pivot);
  mag.userData.pivot = pivot;
  mag.userData.fixed = true; /* in the seat pocket it is held from the side, between the seat back and the pocket */
  return mag;
}
/* k from 0 (in the pocket, closed, upright) to 1 (open on the tray). It slides back out of the pocket under the tray (to 0.25), rises past the tray's
   edge and turns flat (to 0.45), settles onto the tray (to 0.6), then the cover turns over (to 1). It never passes through the tray. */
export function magazineAt(mag, k) {
  const P = MAG.pocket, T = MAG.tray, sm = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
  const out = [P[0], 0.62, CABIN.rows[3] + 0.62], up = [P[0] + 0.05, 1.0, CABIN.rows[3] + 0.62];
  const lerp = (A, B, t) => A.map((v, i) => v + (B[i] - v) * t);
  let pos, flat = 0;
  if (k < 0.25) pos = lerp(P, out, sm(k / 0.25));
  else if (k < 0.45) { const t = sm((k - 0.25) / 0.2); pos = lerp(out, up, t); flat = t; }
  else { pos = lerp(up, T, sm((k - 0.45) / 0.15)); flat = 1; }
  mag.position.set(...pos);
  mag.rotation.set((Math.PI / 2) * (1 - flat), 0, 0);
  mag.userData.pivot.rotation.z = Math.PI * sm((k - 0.6) / 0.4);
}
