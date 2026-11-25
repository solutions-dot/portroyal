/* Air Jamaica's jets, built from one kit (makeJet) and a spec for each type. Sources and what is still a general picture:
   docs/games/air-jamaica.md ("Planes and colours"). Types so far: the Douglas DC-8 (the first jet, 1969) and the Douglas DC-9 (one of the
   first four jets), both in the airline's first look: a white body, a yellow band over the top, an orange and red stripe along the windows
   with a thin pink line under it, the title "airJamaica" in lowercase orange near the nose, a Jamaican flag by the registration, and a
   white fin with a yellow and orange sweep and an orange roundel with a white bird (owner's reference photographs: ref-1969-crew-and-dc8,
   ref-gallery2, ref-dc9-6Y-JGB, ref-727-6Y-JMO). Sizes are the published ones for each type. No registration is drawn, so no number is claimed.
   Local axes: the nose points along +x, the left (port) side is -z, the wheels stand on y = 0. The passenger door is forward on the port side. */
import * as THREE from "three";
import { grp, mesh, box, cyl, solid, cv } from "./gfx.js";

export const ORANGE = 0xe86a1c, RED = 0xc8321e, YELLOW = 0xf3b61f, PINK = 0xd8467a, WHITE = 0xf1efe8;
/* painted metal is smooth: every material here is the plane's own and marked noGrain, and makeJet marks the whole plane noSurface, so the engine's
   plaster and grain (engine/look.js, engine/surfaces.js) never land on it (owner, 25 November 2026: the fin and tailplane came out speckled like a wall) */
const own = (c, r, m) => { const x = solid(c, r, m, {}); x.userData.noGrain = true; return x; };
const M = {
  white: own(WHITE, 0.5, 0.05),
  grey: own(0xc9ccc8, 0.45, 0.1),
  metal: own(0xb9bdbb, 0.32, 0.65),
  steel: own(0x7d8280, 0.4, 0.6),
  dark: own(0x1c2120, 0.6),
  seam: own(0x55595a, 0.7),
  tyre: own(0x1b1d1c, 0.92),
  glass: own(0x0f1a20, 0.12, 0.5),
  frame: own(0x2a2f31, 0.5, 0.2),
  rim: own(0xd2d4cf, 0.45, 0.3), /* pale rims round the cabin windows (photograph of 6Y-JGB) */
  reveal: (() => { const m = own(0xb8bcb9, 0.6, 0.2); m.side = THREE.DoubleSide; return m; })(),
  cabin: own(0x5a5650, 0.9),
  cabinLight: new THREE.MeshBasicMaterial({ color: 0xfff1d6 }),
  floor: own(0x3c4a5a, 0.95),
  doorSkin: own(0xf1efe8, 0.4, 0.1),
  doorInner: own(0xb3b6b2, 0.7, 0.2),
  doorEdge: (() => { const m = own(0x9ea2a0, 0.5, 0.4); m.side = THREE.DoubleSide; return m; })(),
  red: (() => { const m = new THREE.MeshBasicMaterial({ color: 0xff3a2a }); m.userData.glow = true; return m; })(),
  green: (() => { const m = new THREE.MeshBasicMaterial({ color: 0x3aff6a }); m.userData.glow = true; return m; })(),
};
const lerp = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));

/* ---- the types ---- */
export const DC8 = {
  name: "DC-8-50",
  /* fuselage outline [x, radius] from the tail to the nose, and the lift of the tail cone */
  /* the nose measured from manilov.ap's DC-8 model (Sketchfab, CC BY 4.0; a real-scale DC-8, 3.83 m across): at each distance behind the tip, the radius
     and how far the nose's centre lies below the body's. The flight deck and nose are the same on every DC-8 series. It was 2.8 m too long, with its
     tip too high (owner, 25 November 2026, who sent the model) */
  /* 25 November 2026, later: the whole body now follows the model (tools/air-jamaica/dc8_from_model.py writes its outline), its plugs taken out so it
     is a DC-8-50 of 45.9 m: the tail cone sweeps up, so the fin and tailplane taken from the model sit on it. The DC-8's body is a little taller (4.03 m)
     than wide (3.73 m); the tube is round, 1.94 m in radius, between the two. */
  profile: [[-23.12, 0.15], [-22.6, 0.66], [-21.6, 0.81], [-20.35, 0.94], [-18.1, 1.22], [-15.35, 1.49], [-13.6, 1.61], [-12.35, 1.72], [-11.35, 1.79], [-10.35, 1.83], [-9.35, 1.89], [-8.6, 1.94], [16.45, 1.94], [17.0, 1.89], [18.0, 1.84], [19.0, 1.68], [20.0, 1.48], [21.0, 1.13], [21.75, 0.87], [22.25, 0.68], [22.75, 0.36], [22.95, 0.05]], /* the nose too as measured on the model (its glass sat buried under a fuller nose) */
  centreTable: [[-23.12, 1.32], [-22.6, 1.22], [-21.6, 1.14], [-20.35, 1.1], [-18.1, 0.87], [-15.35, 0.54], [-13.6, 0.37], [-12.35, 0.25], [-11.35, 0.17], [-10.35, 0.11], [-9.35, 0.06], [-8.6, 0], [16.45, 0], [17.0, -0.17], [18.0, -0.19], [19.0, -0.21], [20.0, -0.36], [21.0, -0.69], [21.75, -0.8], [22.25, -0.86], [22.75, -0.94], [22.95, -0.93]],
  parts: "dc8_parts", /* the glass, frames, wings, engines, gear, fin and tailplane from the model (setPlaneParts) */
  Y0: 4.12, lift: { from: -99, over: 1, up: 0 },
  windows: { from: -17.0, to: 16.0, step: 0.78, dy: 0.7 }, /* the first cabin window is behind the forward door (photograph): ahead of it they showed as black squares under the windscreen */
  doors: [{ x: 17.0, side: -1, w: 0.86, h: 1.8, sill: 3.32, main: true }, { x: 17.0, side: 1, w: 0.8, h: 1.65, sill: 3.37 }, /* 6 m behind the tip (the model); sills 0.8 m under the centre line, which is 4.12 m up on the model's gear */ { x: -13.4, side: -1, w: 0.8, h: 1.65, sill: 3.55 }, { x: -13.4, side: 1, w: 0.8, h: 1.65, sill: 3.55 }], /* sill 0.8 m below the centre line: the door spans from under the stripe to over the windows (photograph 6Y-JIJ) */
  overwing: [{ x: -3.2, side: -1 }, { x: -3.2, side: 1 }, { x: -5.4, side: -1 }, { x: -5.4, side: 1 }],
  cargo: [{ x: 9.0, side: 1 }, { x: -9.4, side: -1 }],
  wing: { root: [3.0, -7.5], tip: [-9.0, -11.8], span: 21.2, y: 2.3, tilt: 0.05, thick: 0.34 },
  engines: { kind: "wing", z: [7.4, 13.2], y: 1.1, len: 4.0, r: 0.62 },
  tail: { fin: [[-13.0, 1.85], [-13.0, 8.55], [-23.3, 8.55], [-23.3, 1.85]], finTop: 8.55, stab: { y: 1.8, pts: [[-18.5, 0], [-22.0, 7.4], [-24.0, 7.4], [-24.0, 0]] }, tee: false }, /* the model's fin and tailplane (their extent: the painted picture is laid over the fin by it) */
  gear: { noseX: 17.0, mainX: -3.0, mainZ: 3.6, bogie: 4, wheel: 0.62, noseWheel: 0.46 },
  band: { roundel: [-19.8, 6.0], r: 1.05, phi: 40, R: 3.0 }, /* on the model's fin: near the top of its front, the stripes climbing the leading edge to it */
  finBox: [-23.3, 1.85, -13.0, 8.55], /* the model fin's extent in side view (x0, H0, x1, H1 above Y0), for its painted picture */ /* where the stripes climb the fin and end in the roundel, near the top of the fin's front (ref-1969-crew-and-dc8) */
  stripeEnd: 17.6, roofEnd: 18.3, /* both begin just behind the forward door, the cockpit area all white (photograph of 6Y-JGB, 25 November 2026; they ran on round the windscreen). Earlier: where the orange stripe and the yellow roof band stop; the nose beyond is white (photograph 6Y-JIJ, Airliners Gallery image 102905) */
  title: { x: 8.4, w: 6.2 },
  flag: { x: -5.0 },
  cockpit: { x: 19.45, front: 20.95, n: 0, painted: false }, /* the glass and its frames are the model's own (parts) */ /* the glass 2.0 to 3.5 m behind the tip, 0.57 to 1.14 m above the body's centre line, its front edge leaning back (the model) */ /* as on the DC-9: just ahead of the door, high on the nose */ /* side panes and the windscreen block: high on the nose, above the window line (photograph 6Y-JIJ) */
};
export const DC9 = {
  name: "DC-9-30",
  profile: [[-18.2, 0.07], [-17.5, 0.3], [-15.0, 0.8], [-12.0, 1.3], [-9.0, 1.62], [-6.0, 1.67], [10.5, 1.67], [13.0, 1.6], [15.0, 1.38], [16.6, 1.02], [17.6, 0.62], [18.1, 0.26], [18.25, 0.05]],
  droop: { from: 12.5, down: 0.42 }, /* a blunter nose that droops a little (photograph of 6Y-JGB): it was a sharp bullet */
  Y0: 2.9, lift: { from: -8, over: 10, up: 0.6 },
  windows: { from: -12.0, to: 10.6, step: 0.7, dy: 0.62 },
  doors: [{ x: 11.2, side: -1, w: 0.82, h: 1.7, sill: 2.15, main: true }, { x: 11.2, side: 1, w: 0.75, h: 1.55, sill: 2.2 }, { x: -10.6, side: -1, w: 0.7, h: 1.5, sill: 2.25 }],
  overwing: [{ x: -2.4, side: -1 }, { x: -2.4, side: 1 }],
  cargo: [{ x: 6.2, side: 1 }, { x: -7.0, side: 1 }],
  wing: { root: [2.2, -5.0], tip: [-5.6, -7.6], span: 14.2, y: 2.0, tilt: 0.04, thick: 0.28 },
  engines: { kind: "rear", z: 2.55, y: 0.55, x: -11.6, len: 4.0, r: 0.6 },
  tail: { fin: [[-9.0, 1.0], [-12.0, 6.0], [-16.2, 6.0], [-17.0, 1.0]], finTop: 6.0, stab: { y: 6.0, pts: [[-11.6, 0], [-15.6, 4.4], [-17.8, 4.4], [-16.4, 0]] }, tee: true },
  gear: { noseX: 13.4, mainX: -1.2, mainZ: 2.9, bogie: 2, wheel: 0.55, noseWheel: 0.4 },
  band: { roundel: [-12.3, 4.1], r: 0.95, phi: 50, R: 3.0 }, /* the roundel half way up, close behind the leading edge (ref-dc9-6Y-JGB) */
  stripeEnd: 11.8, roofEnd: 12.4, /* just behind the forward door (photograph of 6Y-JGB) */
  title: { x: 4.9, w: 5.6 },
  flag: { x: -3.0, onEngine: true }, /* the flag is on the engine pod (photograph 6Y-JIJ) */
  cockpit: { x: 12.85, front: 14.45, glassEnd: 14.45, painted: true, noStrip: true, lo: [0.3, 0.22], hi: [0.78, 0.3], posts: [13.45, 13.95], frame: 0.06 }, /* just ahead of the door and high on the nose, dark panes in white frames (photograph of 6Y-JGB; it sat 2 m too far forward) */
};

/* The Airbus A320, in the airline's later look (the blue tail: ref-a320-blue-tail.jpg, ref-a340-blue-tail.jpg, ref-727-and-a321.jpg). Published
   sizes: 37.57 m long, 34.1 m span, 11.76 m to the top of the fin, a body 3.95 m across; two engines under the wings; two main wheels a side.
   Everything else (where the doors and the gear sit along the body, the fin's outline) is read from the photographs, not from a drawing. */
export const A320 = {
  name: "A320-200", livery: "blue",
  profile: [[-18.8, 0.1], [-18.2, 0.42], [-15.5, 0.98], [-12.0, 1.55], [-8.5, 1.95], [-7.0, 1.98], [13.4, 1.98], [15.2, 1.9], [16.6, 1.7], [17.6, 1.38], [18.3, 0.98], [18.75, 0.55], [18.95, 0.06]],
  droop: { from: 13.6, down: 0.5 }, /* the tip comes down to about the middle of the body, in the pink and blue (photograph) */ /* the A320's nose: blunt, its tip low, the top sloping down to it and the belly nearly straight, so the stripes curve down to the tip (ref-a320-blue-tail.jpg) */
  Y0: 3.75, lift: { from: -7.0, over: 11.8, up: 0.62 },
  windows: { from: -12.6, to: 12.8, step: 0.53, dy: 0.5 },
  doors: [{ x: 14.0, side: -1, w: 0.81, h: 1.85, sill: 3.3, main: true }, { x: 14.0, side: 1, w: 0.81, h: 1.85, sill: 3.3 }, { x: -11.7, side: -1, w: 0.81, h: 1.85, sill: 3.3 }, { x: -11.7, side: 1, w: 0.81, h: 1.85, sill: 3.3 }],
  overwing: [{ x: -0.2, side: -1 }, { x: -0.2, side: 1 }, { x: -1.1, side: -1 }, { x: -1.1, side: 1 }],
  cargo: [{ x: 8.4, side: 1 }, { x: -6.2, side: 1 }],
  wing: { root: [3.8, -3.4], tip: [-5.2, -6.8], span: 17.05, y: 2.25, tilt: 0.085, thick: 0.38 },
  engines: { kind: "wing", z: [5.75], y: 1.12, len: 4.4, r: 0.92, fwd: 1.6 },
  tail: { fin: [[-9.6, 1.4], [-15.0, 8.0], [-17.6, 8.0], [-18.5, 1.2]], finTop: 8.0, stab: { y: 0.85, pts: [[-13.2, 0], [-16.8, 6.2], [-18.2, 6.2], [-17.6, 0]] }, tee: false },
  gear: { noseX: 12.6, mainX: -0.4, mainZ: 3.8, bogie: 2, wheel: 0.58, noseWheel: 0.38 },
  stripeEnd: 99, roofEnd: 14.6,
  title: { x: 6.0, w: 9.6, dy: 1.36 },
  flag: { x: 15.9, dy: -1.45 }, /* on the white under the blue (photograph) */
  cockpit: { x: 14.95, dx: 0.5, n: 3, dy: 0.95, front: 17.15, glassEnd: 18.15, painted: true, a320: true }, /* panes a little shorter than first drawn (the owner's photograph) */ /* the flight deck's glass, from the last side window's back edge to the windscreen's front (photograph) */ /* windows painted into the skin (noseWindows) */
  tipFence: true, /* the A320's wingtip fences: a small arrowhead plate standing above and below each wing tip */
  tailBlue: -8.6, /* where the bands start to sweep up toward the fin; behind it the rear body is dark blue */
};
export const NAVY = 0x1f2f8a, PURPLE = 0x6b3a96, BPINK = 0xe0457f, BORANGE = 0xf07a22, BYELLOW = 0xf6c12a;
/* ---- the kit ---- */
function radiusAt(S, x) {
  const P = S.profile;
  for (let j = 1; j < P.length; j++) if (x <= P[j][0]) return lerp(P[j - 1][1], P[j][1], (x - P[j - 1][0]) / (P[j][0] - P[j - 1][0]));
  return 0;
}
function centreY(S, x) {
  const { from, over, up } = S.lift;
  const t = Math.max(0, Math.min(1, (from - x) / over));
  let y = S.Y0 + up * t * t;
  if (S.centreTable) { const T = S.centreTable; if (x <= T[T.length - 1][0]) for (let j = 1; j < T.length; j++) if (x <= T[j][0]) { y += lerp(T[j - 1][1], T[j][1], (x - T[j - 1][0]) / (T[j][0] - T[j - 1][0])); break; } }
  if (S.noseDrop) { const P = S.profile, d = P[P.length - 1][0] - x, T = S.noseDrop; for (let j = 1; j < T.length; j++) if (d <= T[j][0]) { y += lerp(T[j - 1][1], T[j][1], (d - T[j - 1][0]) / (T[j][0] - T[j - 1][0])); break; } }
  else if (S.droop && x > S.droop.from) { const P = S.profile, k = Math.min(1, (x - S.droop.from) / (P[P.length - 1][0] - S.droop.from)); y -= S.droop.down * Math.pow(k, 1.7); }
  return y;
}
/* a point on the body's side at height dy above the centre line: its y and z on side s, and the tilt of the surface there */
function onSide(S, x, dy, s) {
  const r = radiusAt(S, x), cy = centreY(S, x), d = Math.min(dy, r * 0.95);
  const dz = Math.sqrt(Math.max(0.0001, r * r - d * d));
  return { y: cy + d, z: s * dz, tilt: Math.asin(d / r) };
}
/* The first look's stripes, as one ribbon seen from the side (x along the body, H the height above S.Y0): level along the body, then from S.band
   they bend up through an arc and climb the fin in a straight run that ends under the roundel. Its order across the ribbon is the body's from the
   bottom up: pink line, white, red, orange, yellow; so on the fin the yellow is the band nearest the leading edge and the pink the one nearest the
   trailing edge, and behind the bend the tail cone is white (photographs ref-dc9-6Y-JGB, ref-727-6Y-JMO, ref-1969-crew-and-dc8; owner, 25 November 2026:
   "the tail and emblem and stripe not proper": the stripes ran straight on to the tail cone and the fin had a separate, unrelated sweep). */
const H0 = 0.3, YELLOW_TOP = 1.7;
function ribbon(S) {
  if (S._ribbon) return S._ribbon;
  const B = S.band, phi = (B.phi * Math.PI) / 180, R = B.R, sn = Math.sin(phi), cs = Math.cos(phi), mid = 0.85;
  const pd = [B.roundel[0] - mid * sn, B.roundel[1] - mid * cs], eh = H0 + R * (1 - cs), lline = (pd[1] - eh) / sn;
  const bx = pd[0] + lline * cs + R * sn, E = [bx - R * sn, eh];
  return (S._ribbon = { bx, R, phi, sn, cs, E, sEnd: R * phi + lline });
}
/* across (offset from the pink line's lower edge, toward the yellow) and along (distance along the ribbon from the start of the bend) */
function ribbonAt(S, x, H) {
  const r = ribbon(S);
  if (x >= r.bx) return { o: H - H0, s: r.bx - x };
  const qx = x - r.bx, qh = H - (H0 + r.R), t = Math.atan2(-qx, -qh);
  if (t >= 0 && t <= r.phi) return { o: r.R - Math.hypot(qx, qh), s: r.R * t };
  const dx = x - r.E[0], dh = H - r.E[1];
  return { o: dx * r.sn + dh * r.cs, s: r.R * r.phi + (-dx * r.cs + dh * r.sn) };
}
function ribbonColour(S, x, H) {
  const { o, s } = ribbonAt(S, x, H);
  if (s > ribbon(S).sEnd) return WHITE;
  return o < 0 ? WHITE : o < 0.1 ? PINK : o < 0.2 ? WHITE : o < 0.54 ? RED : o < 0.7 ? ORANGE : o < YELLOW_TOP ? YELLOW : WHITE;
}
/* the skin's panel work, laid over the paint: frames every 0.53 m round the body, lap joints along it, rows of rivets, and a little grime under the belly.
   u runs along the body (0 at the tail), v round it (0 at the top). Light grey on white, so the paint's colours stay as they are. */
const _skins = {};
function skinTexture(len) {
  const key = Math.round(len);
  if (_skins[key]) return _skins[key];
  const W = 2048, H = 512, frames = Math.round(len / 0.53);
  return (_skins[key] = cv(W, H, (x) => {
    x.fillStyle = "#ffffff"; x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(90,96,100,0.12)"; x.lineWidth = 1.0;
    for (let i = 0; i <= frames; i++) { const u = (i / frames) * W; x.beginPath(); x.moveTo(u, 0); x.lineTo(u, H); x.stroke(); }
    for (const v of [0.16, 0.34, 0.5, 0.66, 0.84]) { x.beginPath(); x.moveTo(0, v * H); x.lineTo(W, v * H); x.stroke(); }
    x.fillStyle = "rgba(80,86,90,0.10)";
    for (let i = 0; i <= frames; i++) for (let k = 0; k < H; k += 9) x.fillRect((i / frames) * W - 3.5, k, 1.6, 1.6);
    const g = x.createLinearGradient(0, H * 0.38, 0, H * 0.62);
    g.addColorStop(0, "rgba(120,110,95,0)"); g.addColorStop(0.5, "rgba(120,110,95,0.10)"); g.addColorStop(1, "rgba(120,110,95,0)");
    x.fillStyle = g; x.fillRect(0, H * 0.38, W, H * 0.24); /* the belly (v about 0.5) picks up a little grime */
  }));
}
/* The A320's flight deck windows, painted into the skin (ref-a320-blue-tail.jpg; owner, 25 November 2026: the nose was "all wrong", a dark slab on
   top and black squares at the sides). A black band wraps round the nose; the windows sit in it as dark glass with thin pale frames: the two side
   windows and the windscreen, whose panes run round the front. Toward the front the band and the glass slope down with the nose, and the black
   dips below the windscreen to the orange. Painted by height, so the band goes right round the front with no seam. Returns a colour or null. */
function noseWindows(S, x, dy) {
  const C = S.cockpit;
  if (!C.painted) return null;
  if (C.side) {      /* drawn in side view at fixed heights (h above the body's level centre line), as measured on the DC-8 model */
    const W = C.side, h = dy + centreY(S, x) - S.Y0, fr = 0.06;
    if (h < W.lo || h > W.hi) return null;
    const front = W.xf - (h - W.lo) / (W.hi - W.lo) * W.lean;
    if (x < W.xb || x > front) return null;
    if (h < W.lo + fr || h > W.hi - fr || x < W.xb + fr || x > front - fr) return 0xe8e8e2;
    for (const px of W.posts) if (Math.abs(x - px + (h - W.lo) * 0.35) < fr / 2) return 0xe8e8e2;
    return 0x16222a;
  }
  /* Measured from the enlarged photograph (ref-a320-blue-tail.jpg, the nose): no band round the windows. Each pane is dark glass in a broad white
     frame, low on the nose (a fifth to a half of the radius up at the side windows); the white cap comes down to their tops. The windscreen's front
     panes climb over the top of the nose to its centre post. The only black is a strip under the windscreen that runs forward and down to the nose
     tip, over the pink. Heights are shares of the radius round the drooping nose's own centre. */
  const r = radiusAt(S, x), back = C.x, xf = C.front, tip = S.profile[S.profile.length - 1][0], L = C.lo || [0.17, 0.32], U = C.hi || [0.5, 0.55];
  const f = Math.max(0, Math.min(1, (x - back) / (xf - back))), ff = f * f;
  const g0 = r * (L[0] + L[1] * ff), g1 = r * (U[0] + U[1] * ff), fr = C.frame || 0.045;
  const glassBack = back + Math.max(0, dy - g0) * 0.3, xg = C.glassEnd;
  /* the windscreen's front panes run on over the top of the nose to xg, their foot at half the radius: from the front they read as glass across
     the top of the nose with the black strip under it, as in the photograph */
  if (x >= glassBack && x <= xg && dy >= g0 && dy <= g1) {
    if (dy > g1 - fr || dy < g0 + fr || x < glassBack + fr || x > xg - fr || Math.abs(x - xf) < fr / 2) return 0xeeeeea;
    for (const px of C.posts || [back + 0.55, back + 1.32]) if (Math.abs(x - px - (dy - g0) * 0.3) < fr / 2) return 0xeeeeea;
    return 0x16222a;
  }
  if (C.noStrip) return null;   /* the first look has no black under its windscreen: the nose is white (photograph of 6Y-JGB) */
  /* the black strip: from under the sliding window's front, deepening forward under the windscreen, then down round the nose to the tip */
  const bs = back + 1.32;
  if (x > bs) {
    const k = Math.min(1, (x - bs) / (xf - bs)), rf = radiusAt(S, xf);
    if (x <= xf) { if (dy < g0 && dy > g0 - 0.38 * k * k) return 0x101214; }
    else {
      /* ahead of the windscreen only a narrow strip, sloping down toward the tip and ending short of it; above it the nose is white (the photograph,
         seen from the front: the black covered the whole tip) */
      const u = Math.sqrt((x - xf) / (tip - xf)), sb = lerp(rf * 0.49 - 0.38, -0.05, u), st = sb + lerp(0.3, 0.12, u);
      if (u < 0.88 && dy > sb && dy < st && (dy < g0 || x > xg)) return 0x101214;
      if (x > xg && dy >= st) return WHITE;
    }
  }
  return null;
}
/* The A320's flight deck, drawn as the photograph shows it from the side (ref-a320-blue-tail.jpg; owner, 25 November 2026: "very wrong, try a different
   approach"): x along the body, h the height above the body's level centre line (not the drooping nose's). A row of four panes with level bottoms in the
   top of the orange band, their tops level, then curving down over the nose; each pane dark, in a broad white frame, the posts leaning back. Above them
   the white cap, which reaches back over the forward door; ahead of them the nose is white down to a short black strip under the front panes, then
   orange, pink and blue round the tip. Returns a colour, or null where the bands below decide. */
function a320Nose(S, x, h) {
  if (!S.cockpit.a320) return null;
  /* panes about as tall as the orange band is deep, the front pane's foot sloping down toward the nose (the photograph) */
  const XB = 14.95, XF = 17.95, bot = (q) => 0.27 - Math.max(0, q - 16.5) * 0.2, top = (q) => (q < 16.45 ? 1.08 : 1.08 - (q - 16.45) * 0.55), fr = 0.06, G0 = bot(x);
  const back = XB + Math.max(0, h - G0) * 0.25;
  if (x >= back && x <= XF && h >= G0 && h <= top(x)) {
    if (h < G0 + fr || h > top(x) - fr || x < back + fr || x > XF - fr) return 0xf2f2ee;
    for (const px of [15.62, 16.32, 17.0]) if (Math.abs(x - px - (h - G0) * 0.3) < fr / 2) return 0xf2f2ee;
    return 0x16222a;
  }
  const capBack = h > 1.08 ? 14.75 - (h - 1.08) * 1.1 : back;
  if (h > G0 && x > capBack && (x > back || h > 0.77) && (h > top(Math.min(x, XF)) - 0.02 || x < back)) return 0xf1efe8;   /* white only over the panes and behind them: ahead of the front pane the black strip and the bands run on to the tip */   /* the white cap over and ahead of the windows */
  if (x > 16.6 && x < 18.7 && h < top(Math.min(x, XF)) && h > bot(Math.min(x, XF)) - 0.08 - (x - 16.6) * 0.08) return 0x111315;   /* the black under and ahead of the front panes, up to the white cap, sweeping down toward the tip (the photograph) */   /* the black strip under the front panes, tapering forward */
  return null;
}
function liveryPaint(S) {
  const C = (h) => new THREE.Color(h);
  /* paint by height above the centre line, so the stripes stay level along the body and run straight through the windows; every face takes one flat
     colour, so the edges of the stripes are crisp. The stripes end before the nose: the orange stripe stops behind the forward door, in a slant, and
     the yellow roof band at the windscreen. */
  const paint = S.livery === "blue" ? (dy0, x) => {
    /* toward the nose the bands are painted at fixed heights, level, and the drooping nose passes down through them, so its tip is pink and blue
       (owner, 25 November 2026, the photograph: measured from the nose's own centre line, every band bent down with it) */
    const dy = x > 0 ? dy0 + centreY(S, x) - S.Y0 : dy0;
    const n = a320Nose(S, x, dy);
    if (n !== null) return C(n);
    /* the blue-tail look: a yellow roof, then orange (the windows), pink, a thin purple line, a blue stripe and a white belly; toward the tail the bands
       sweep up into the fin and the body behind and below them is dark blue. The nose has no yellow: its top is white. */
    const lift = x < S.tailBlue ? (S.tailBlue - x) * 0.42 : 0, d = dy - lift;
    /* band heights measured on the photograph at the forward door (the door's own sill and head as the scale): the yellow down to 0.77 m above the
       centre line, the orange (the windows) to 0.12 m below it, a deep pink to 0.62 m below, a thin purple line, the blue to 1.08 m below, then white */
    if (d > 0.77) {
      if (x < S.tailBlue - 0.5) return C(NAVY);
      /* the white cap over the flight deck: down to the windows' tops, its rear edge a curve from over the door to behind the last window */
      const r = radiusAt(S, x), h = (dy - r * 0.5) / (r * 0.5);
      return h > 0 && x > S.cockpit.x - 0.05 - 0.75 * Math.sqrt(Math.min(1, h)) ? C(WHITE) : C(BYELLOW);
    }
    if (d > -0.12) return C(BORANGE);
    if (d > -0.62) return C(BPINK);
    if (d > -0.68) return C(PURPLE);
    if (d > -1.08) return C(NAVY);
    return x < S.tailBlue - 1.6 - (dy + 2) * 0.3 ? C(NAVY) : C(WHITE);
  } : (dy, x) => {
    const w = noseWindows(S, x, dy);
    if (w) return C(w);
    if (x > S.roofEnd) return C(WHITE);
    if (dy <= 1.0 && x > S.stripeEnd - (dy - 0.3) * 1.2) return C(WHITE); /* the orange stripe ends behind the forward door in a slant; the yellow runs on */
    return C(ribbonColour(S, x, dy + centreY(S, x) - S.Y0));
  };
  return paint;
}
function fuselage(S, holes = []) {
  const paint = liveryPaint(S);
  const x0 = S.profile[0][0], x1 = S.profile[S.profile.length - 1][0], TAU = Math.PI * 2;
  /* the rings along the body and the lines round it, with the edges of every hole added exactly, so a cut-out has straight, clean edges */
  const xs = [], as = [];
  for (let i = 0; i <= 150; i++) xs.push(lerp(x0, x1, i / 150));
  for (let x = x0; x < S.lift.from + 0.5; x += 0.06) xs.push(x); /* where the tail cone rises, the stripes cross the rings on a slant: fine rings keep their edges smooth */
  for (let j = 0; j < 160; j++) as.push((j / 160) * TAU);
  const wrap = (a) => ((a % TAU) + TAU) % TAU;
  for (const h of holes) { xs.push(h.x0, h.x1); as.push(wrap(h.a0), wrap(h.a1)); }
  xs.sort((p, q) => p - q); as.sort((p, q) => p - q);
  const inHole = (x, a) => holes.some((h) => { const lo = wrap(Math.min(h.a0, h.a1)), hi = wrap(Math.max(h.a0, h.a1)); return x > h.x0 && x < h.x1 && (lo <= hi ? a > lo && a < hi : a > lo || a < hi); });
  const pos = [], uvs = [], Mn = as.length, DY = 2.2; /* the paint is a picture: u along the body, v the height above the centre line (from -DY to +DY), so every stripe's edge is sharp per pixel */
  const UV = (q) => [(q[0] - x0) / (x1 - x0), (q[1] - centreY(S, q[0]) + DY) / (2 * DY)];
  const P = (x, a) => { const r = radiusAt(S, x), cy = centreY(S, x); return [x, cy + Math.cos(a) * r, Math.sin(a) * r]; };
  for (let i = 0; i < xs.length - 1; i++) {
    if (xs[i + 1] - xs[i] < 1e-5) continue;
    for (let j = 0; j < Mn; j++) {
      const a0 = as[j], a1 = j + 1 < Mn ? as[j + 1] : as[0] + TAU;
      if (a1 - a0 < 1e-5) continue;
      const xm = (xs[i] + xs[i + 1]) / 2, am = (a0 + a1) / 2;
      if (inHole(xm, wrap(am))) continue;
      const p00 = P(xs[i], a0), p01 = P(xs[i], a1), p10 = P(xs[i + 1], a0), p11 = P(xs[i + 1], a1);
      pos.push(...p00, ...p01, ...p10, ...p01, ...p11, ...p10); /* wound so the faces point outward */
      for (const q of [p00, p01, p10, p01, p11, p10]) uvs.push(...UV(q));
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  /* smooth shading across the faces: normals from the round body itself, not from each flat face */
  const n = geo.attributes.normal, p = geo.attributes.position;
  const capX = S.profile[S.profile.length - 3][0], tailX = S.profile[2][0];   /* the rounded nose and tail cone face forward and back: there the face normals are kept (radial ones lit the blunt nose tip as a blue disc) */
  for (let k = 0; k < p.count; k++) {
    const x = p.getX(k);
    if (x > capX || x < tailX) continue;
    const dy = p.getY(k) - centreY(S, x), dz = p.getZ(k), l = Math.hypot(dy, dz) || 1;
    n.setXYZ(k, 0, dy / l, dz / l);
  }
  const tex = cv(2048, 1024, (x, W, H) => {
    const img = x.createImageData(W, H), d = img.data;
    for (let j = 0; j < H; j++) {
      const dy = DY - (j / (H - 1)) * 2 * DY; /* canvas rows run top down; v = 1 is the top */
      for (let i = 0; i < W; i++) {
        const c = paint(dy, x0 + (i / (W - 1)) * (x1 - x0)), k = (j * W + i) * 4;
        d[k] = Math.round(Math.pow(c.r, 1 / 2.2) * 255); d[k + 1] = Math.round(Math.pow(c.g, 1 / 2.2) * 255); d[k + 2] = Math.round(Math.pow(c.b, 1 / 2.2) * 255); d[k + 3] = 255;
      }
    }
    x.putImageData(img, 0, 0);
  });
  tex.anisotropy = 8; tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  const o = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.36, metalness: 0.1, side: THREE.DoubleSide }));
  o.name = "fuselage";
  return o;
}
function slab(points, depth, mat) {
  const s = new THREE.Shape();
  points.forEach(([a, b], i) => (i ? s.lineTo(a, b) : s.moveTo(a, b)));
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false });
  geo.translate(0, 0, -depth / 2);
  return new THREE.Mesh(geo, mat);
}
/* a thin dark line between two points on a plane at height y (x, z), width w: a panel line on a wing or a control surface edge */
function seamLine(parent, a, b, y, w = 0.045) {
  const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz);
  const l = box(len, 0.012, w, M.seam, (a[0] + b[0]) / 2, y, (a[1] + b[1]) / 2, parent);
  l.rotation.y = -Math.atan2(dz, dx);
  return l;
}
function roundRect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return new THREE.ShapeGeometry(s, 4);
}
/* The Love Bird: the airline's Doctor Bird, a hummingbird seen from the side, drawn as in the photographs of the real tails (the Boeing 727 and
   DC-9 in ref-727-and-a321.jpg and ref-dc9-6Y-JGB.jpg, the A321 in the blue tail): a fine upright body with a long thin beak and a leaf-shaped
   wing swept back, and two tail ribbons that loop round below it, one inside the other. It faces right in its picture, so on a tail it faces the nose.
   Coordinates are those of the enlarged photograph (the bird fits x 140 to 580, y 130 to 600), scaled into the square the caller gives. */
export function drawBird(x, size, colour, eyeColour = "#1b1b1b") {
  x.save();
  const k = size / 470;
  x.translate(size * 0.5, size * 0.5);
  x.scale(k, k);
  x.translate(-360, -365);
  x.lineCap = "round";
  x.lineJoin = "round";
  x.strokeStyle = colour;
  x.fillStyle = colour;
  x.lineWidth = 11;
  /* the two tail ribbons, looping round and under the body */
  x.beginPath(); x.moveTo(350, 185); x.bezierCurveTo(300, 150, 165, 175, 158, 290); x.bezierCurveTo(150, 400, 260, 470, 330, 468); x.bezierCurveTo(400, 466, 440, 420, 458, 385); x.stroke();
  x.beginPath(); x.moveTo(352, 350); x.bezierCurveTo(300, 325, 210, 340, 195, 395); x.bezierCurveTo(170, 480, 230, 580, 320, 582); x.bezierCurveTo(420, 580, 470, 480, 470, 395); x.stroke();
  /* the body: a slim curved shape from the head down to where the tail begins */
  x.beginPath();
  x.moveTo(462, 196); x.bezierCurveTo(440, 160, 480, 140, 506, 160); x.bezierCurveTo(520, 175, 522, 195, 516, 215);
  x.bezierCurveTo(526, 270, 516, 330, 478, 392); x.lineTo(454, 396); x.bezierCurveTo(446, 340, 452, 280, 462, 196);
  x.closePath(); x.fill();
  /* the beak: long and thin, pointing forward */
  x.beginPath(); x.moveTo(508, 164); x.lineTo(562, 156); x.lineTo(512, 178); x.closePath(); x.fill();
  /* the wing: a leaf that sweeps back from the shoulder */
  x.beginPath(); x.moveTo(458, 240); x.bezierCurveTo(420, 228, 350, 232, 306, 250); x.bezierCurveTo(340, 268, 410, 276, 460, 272); x.closePath(); x.fill();
  x.fillStyle = eyeColour;
  x.beginPath(); x.arc(492, 172, 4.5, 0, 7); x.fill();
  x.restore();
}
/* the roundel on the first look's tail: a white ring, a red-orange disc, the bird in amber (the colours of the 727 and DC-9 photographs) */
export function roundelTexture() {
  return cv(256, 256, (x, W) => {
    x.clearRect(0, 0, W, W);
    const c = W / 2;
    x.fillStyle = "#f6f1e6"; x.beginPath(); x.arc(c, c, 126, 0, 7); x.fill();
    x.fillStyle = "#d8361c"; x.beginPath(); x.arc(c, c, 108, 0, 7); x.fill();
    x.save(); x.beginPath(); x.arc(c, c, 108, 0, 7); x.clip();
    x.translate(c - 82 - 6, c - 82 + 4);
    drawBird(x, 164, "#f2992e", "#8a2410");
    x.restore();
  });
}
function titleTexture(livery) {
  if (livery === "blue") /* the later title: a pink "air" and a dark blue "Jamaica", round and heavy, each letter outlined in white (ref-a320-blue-tail.jpg) */
    return cv(1024, 200, (x, W, H) => {
      x.clearRect(0, 0, W, H);
      x.font = "900 136px 'Arial Rounded MT Bold', 'Trebuchet MS', Verdana, sans-serif"; x.textBaseline = "middle"; x.lineJoin = "round";
      const wa = x.measureText("air").width, y = H / 2 + 8;
      x.lineWidth = 16; x.strokeStyle = "#ffffff"; x.strokeText("air", 24, y); x.strokeText("Jamaica", 24 + wa + 4, y);
      x.fillStyle = "#d63a86"; x.fillText("air", 24, y); x.fillStyle = "#1f2f8a"; x.fillText("Jamaica", 24 + wa + 4, y);
    });
  return cv(1024, 180, (x, W, H) => {
    x.clearRect(0, 0, W, H);
    x.fillStyle = "#d9531b"; x.font = "700 128px 'Trebuchet MS', Verdana, sans-serif"; x.textBaseline = "middle";
    x.fillText("airJamaica", 18, H / 2 + 6);
  });
}
export function flagTexture() {
  return cv(96, 64, (x, W, H) => {
    x.fillStyle = "#1a8a3a"; x.fillRect(0, 0, W, H);
    x.fillStyle = "#111";
    x.beginPath(); x.moveTo(0, 0); x.lineTo(W / 2, H / 2); x.lineTo(0, H); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(W, 0); x.lineTo(W / 2, H / 2); x.lineTo(W, H); x.closePath(); x.fill();
    x.strokeStyle = "#f2c62c"; x.lineWidth = 10;
    x.beginPath(); x.moveTo(0, 0); x.lineTo(W, H); x.moveTo(W, 0); x.lineTo(0, H); x.stroke();
  });
}
/* the fin panel (orange look): the yellow band that climbs from the roof stripe, the orange band under it, the roundel; clipped to the fin */
function finPaint(S) {
  const F = S.tail.fin, xs = F.map((p) => p[0]), ys = F.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), w = x1 - x0, h = y1 - y0;
  if (S.livery === "blue") {
    /* the blue fin: dark blue, with pink and purple bars across the top and the bands of the body sweeping up into its foot at the front; the yellow
       Doctor Bird inside an open yellow ring (ref-a320-blue-tail.jpg, ref-a340-blue-tail.jpg) */
    const tex = cv(512, Math.round(512 * (h / w)), (x, W, H) => {
      x.fillStyle = "#f1efe8"; x.fillRect(0, 0, W, H);
      const X = (m) => ((m - x0) / w) * W, Y = (m) => ((y1 - m) / h) * H;
      x.save(); x.beginPath(); F.forEach(([a, b], i) => (i ? x.lineTo(X(a), Y(b)) : x.moveTo(X(a), Y(b)))); x.closePath(); x.clip();
      x.fillStyle = "#1f2f8a"; x.fillRect(0, 0, W, H);
      [["#e0457f", 0.0, 0.035], ["#6b3a96", 0.035, 0.07], ["#e0457f", 0.09, 0.115], ["#6b3a96", 0.115, 0.14], ["#e0457f", 0.16, 0.175]].forEach(([c, a, b]) => { x.fillStyle = c; x.fillRect(0, a * H, W, (b - a) * H); });
      [["#f07a22", 0.0], ["#e0457f", 0.06], ["#6b3a96", 0.1]].forEach(([c, k]) => { x.fillStyle = c; x.beginPath(); x.moveTo(W * (1.05 - k), H); x.lineTo(W * (0.98 - k), H * (0.86 + k * 0.4)); x.lineTo(W * (0.9 - k * 0.6), H); x.closePath(); x.fill(); });
      x.restore();
      /* the emblem: the bird alone, its two tail ribbons making the loops (there is no separate ring: ref-a320-blue-tail.jpg, enlarged), a little
         above half height and aft of the middle of the fin, about a third of the fin's height, well clear of the leading edge (owner, 25 November 2026:
         "hummingbird is off there": an extra ring was drawn and the emblem sat over the leading edge) */
      const size = (2.6 / w) * W, ex = X(lerp(x0, x1, 0.35)), ey = Y(lerp(y0, y1, 0.54));
      x.save(); x.translate(ex - size / 2, ey - size / 2); drawBird(x, size, "#e2b43a", "#1f2f8a"); x.restore();
    });
    return { tex, w, h, x0, y0 };
  }
  /* the first look: the stripes' ribbon, painted pixel by pixel from the same rule as the body (ribbonColour), so the bands run on from the body
     without a seam, and the roundel where the ribbon ends */
  const tex = cv(512, Math.round(512 * (h / w)), (x, W, H) => {
    const img = x.createImageData(W, H), d = img.data;
    for (let j = 0; j < H; j++)
      for (let i = 0; i < W; i++) {
        const c = new THREE.Color(ribbonColour(S, x0 + (i / (W - 1)) * w, y1 - (j / (H - 1)) * h)), k = (j * W + i) * 4;
        d[k] = Math.round(Math.pow(c.r, 1 / 2.2) * 255); d[k + 1] = Math.round(Math.pow(c.g, 1 / 2.2) * 255); d[k + 2] = Math.round(Math.pow(c.b, 1 / 2.2) * 255); d[k + 3] = 255;
      }
    x.putImageData(img, 0, 0);
    const B = S.band, R = (B.r / w) * W, cx = ((B.roundel[0] - x0) / w) * W, cy = ((y1 - B.roundel[1]) / h) * H;
    x.drawImage(roundelTexture().image, cx - R, cy - R, R * 2, R * 2);
  });
  return { tex, w, h, x0, y0 };
}
function decal(w, h, tex) {
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
}
function wheel(r, w, parent, x, y, z) {
  const t = cyl(r, r, w, M.tyre, x, y, z, parent, 18); t.rotation.x = Math.PI / 2;
  const rim = cyl(r * 0.62, r * 0.62, w + 0.015, M.metal, x, y, z, parent, 14); rim.rotation.x = Math.PI / 2;
  const hub = cyl(r * 0.22, r * 0.22, w + 0.04, M.steel, x, y, z, parent, 8); hub.rotation.x = Math.PI / 2;
  return t;
}
/* a turbofan pod: nacelle, a bright intake lip, the dark intake with the fan face and its spinner, a tail pipe and a cone */
function pod(parent, x, y, z, len, r) {
  const e = grp(parent, x, y, z);
  const body = cyl(r, r * 0.9, len, M.white, 0, 0, 0, e, 20); body.rotation.z = Math.PI / 2;
  const lip = cyl(r * 1.05, r * 1.05, 0.2, M.metal, len / 2, 0, 0, e, 20); lip.rotation.z = Math.PI / 2;
  const mouth = cyl(r * 0.9, r * 0.9, 0.06, M.dark, len / 2 + 0.07, 0, 0, e, 20); mouth.rotation.z = Math.PI / 2;
  const fan = cyl(r * 0.78, r * 0.78, 0.04, M.steel, len / 2 - 0.35, 0, 0, e, 20); fan.rotation.z = Math.PI / 2;
  const spin = mesh(new THREE.ConeGeometry(r * 0.2, 0.5, 12), M.metal, len / 2 - 0.12, 0, 0, e); spin.rotation.z = -Math.PI / 2;
  for (let i = 0; i < 12; i++) { const b = box(r * 1.4, 0.02, 0.045, M.steel, len / 2 - 0.34, 0, 0, e); b.rotation.x = (i / 12) * Math.PI; }
  const pipe = cyl(r * 0.62, r * 0.5, 0.8, M.steel, -len / 2 - 0.3, 0, 0, e, 16); pipe.rotation.z = Math.PI / 2;
  const cone = mesh(new THREE.ConeGeometry(r * 0.28, 0.8, 10), M.metal, -len / 2 - 0.55, 0, 0, e); cone.rotation.z = Math.PI / 2;
  for (const dx of [-0.8, 0.9]) { const s = cyl(r * 1.005, r * 1.005, 0.025, M.seam, dx, 0, 0, e, 20); s.rotation.z = Math.PI / 2; }
  const soot = cyl(r * 0.92, r * 0.9, 0.5, solid(0x3a3c3c, 0.9, 0.2), -len / 2 + 0.25, 0, 0, e, 20); soot.rotation.z = Math.PI / 2; /* the tail of the cowl, darkened by the exhaust */
  return e;
}
/* a wing-mounted pylon, in the plane of the pod (constant z): its foot runs along the pod's top from near the intake to past the cowl's tail, its head
   runs into the wing's underside from just ahead of the leading edge to well under the wing, and its front edge slants up from the pod to the wing.
   The head is sunk 12 cm into the wing so no daylight shows between them (owner, 25 November 2026: the engines were "not attached to anything"). */
function pylon(parent, z, podTop, podFront, podBack, wingUnder, leadX) {
  const foot = podTop - 0.12, head = wingUnder + 0.03;   /* 3 cm into the wing: enough to close the gap, under the audit's 4 cm overlap */
  const p = slab([[podBack - 0.4, foot], [podFront - 0.5, foot], [leadX + 0.05, head], [leadX - 2.8, head], [podBack - 0.4, foot + 0.15]], 0.24, M.white);
  p.position.set(0, 0, z);
  p.name = "pylon";
  parent.add(p);
  return p;
}
/* parts of a plane taken from a model (the DC-8's, tools/air-jamaica/dc8_from_model.py): the game loads them once (main.js) and each plane clones them */
const PARTS = {};
export function setPlaneParts(name, scene) { PARTS[name] = scene; }
/* A plane built from a model's parts (the DC-8: tools/air-jamaica/dc8_from_model.py, from manilov.ap's model, CC BY 4.0): the model's own body, glass,
   frames, wings, engines, gear and tail, so everything sits as it does on the real aircraft, and the livery painted onto its body and fin. The body takes
   one picture laid on from the side (x along the body, height above the level centre line): the stripes from the same rule as the drawn planes
   (liveryPaint, ribbonColour), the cabin windows, the door and hatch outlines, the title and the flag, so nothing stands off the skin. The two sides
   use the two halves of the picture (the port side's title drawn mirrored, so it reads from that side). An open door is painted as a dark opening with
   the door leaf swung out beside it on two arms. */
function jetFromModel(S, opts, MODEL) {
  const g = grp(), P = MODEL.clone(true);
  g.userData.noBatch = true; g.userData.spec = S.name;
  P.updateMatrixWorld(true);
  const body = []; P.traverse((o) => { if (o.isMesh && (o.name.startsWith("body") || (o.parent && o.parent.name.startsWith("body")))) body.push(o); });
  /* the extent of the picture */
  const bb = new THREE.Box3(); body.forEach((o) => bb.expandByObject(o));
  const X0 = bb.min.x - 0.05, X1 = bb.max.x + 0.05, DY = 2.4, TW = 4096, TH = 1024, half = TH / 2;
  const U = (x) => ((x - X0) / (X1 - X0)) * TW, R = (h, port) => (port ? half : 0) + ((DY - h) / (2 * DY)) * half;   /* canvas x and row for a place on the body */
  const paint = liveryPaint(S), dc = {};
  const tex = cv(TW, TH, (x) => {
    const img = x.createImageData(TW, half), d = img.data;
    for (let i = 0; i < TW; i++) {
      const xx = X0 + (i / (TW - 1)) * (X1 - X0), cy = centreY(S, xx) - S.Y0;
      for (let j = 0; j < half; j++) {
        const h = DY - (j / (half - 1)) * 2 * DY, c = paint(h - cy, xx), k = (j * TW + i) * 4, key = c.getHex();
        let rgb = dc[key]; if (!rgb) rgb = dc[key] = [Math.round(Math.pow(c.r, 1 / 2.2) * 255), Math.round(Math.pow(c.g, 1 / 2.2) * 255), Math.round(Math.pow(c.b, 1 / 2.2) * 255)];
        d[k] = rgb[0]; d[k + 1] = rgb[1]; d[k + 2] = rgb[2]; d[k + 3] = 255;
      }
    }
    x.putImageData(img, 0, 0); x.putImageData(img, 0, half);
    for (const port of [false, true]) {
      const side = port ? -1 : 1, sx = (TW / (X1 - X0)), sy = half / (2 * DY);
      const rr = (x0, h0, w, hh, r) => { const a = U(x0 - w / 2), b = R(h0 + hh / 2, port), W = w * sx, H = hh * sy, q = Math.min(r * sx, W / 2, H / 2); x.beginPath(); x.moveTo(a + q, b); x.lineTo(a + W - q, b); x.quadraticCurveTo(a + W, b, a + W, b + q); x.lineTo(a + W, b + H - q); x.quadraticCurveTo(a + W, b + H, a + W - q, b + H); x.lineTo(a + q, b + H); x.quadraticCurveTo(a, b + H, a, b + H - q); x.lineTo(a, b + q); x.quadraticCurveTo(a, b, a + q, b); x.closePath(); };
      /* cabin windows, pale rims and dark glass, skipping the doors and exits */
      const Wn = S.windows, skip = [...S.doors.map((q) => q.x), ...S.overwing.map((q) => q.x)];
      for (let xx = Wn.from; xx <= Wn.to; xx += Wn.step) {
        if (skip.some((k) => Math.abs(k - xx) < 0.9)) continue;
        const h = Wn.dy + centreY(S, xx) - S.Y0;
        rr(xx, h, 0.3, 0.39, 0.11); x.fillStyle = "#d2d4cf"; x.fill();
        rr(xx, h, 0.24, 0.33, 0.09); x.fillStyle = "#16202a"; x.fill();
      }
      /* door, exit and hatch outlines; the open door a dark opening */
      x.strokeStyle = "rgba(60,64,66,0.85)"; x.lineWidth = 2.2;
      for (const q of S.doors.filter((q) => q.side === side)) {
        const h0 = q.sill - S.Y0;
        rr(q.x, h0 + q.h / 2, q.w, q.h, 0.12);
        if (q.main && opts.doorOpen) { x.fillStyle = "#151617"; x.fill(); } else x.stroke();
      }
      for (const q of S.overwing.filter((q) => q.side === side)) { rr(q.x, 0.62 + centreY(S, q.x) - S.Y0, 0.5, 0.72, 0.1); x.stroke(); }
      for (const q of S.cargo.filter((q) => q.side === side)) { rr(q.x, -0.95 + centreY(S, q.x) - S.Y0, 1.2, 0.9, 0.06); x.stroke(); }
      /* the title and the flag */
      const tImg = titleTexture(S.livery).image, tw = S.title.w * sx, th = S.title.w * 0.1774 * sy, tc = [U(S.title.x), R(0.05 + centreY(S, S.title.x) - S.Y0, port)];
      x.save(); x.translate(tc[0], tc[1]); if (port) x.scale(-1, 1); x.drawImage(tImg, -tw / 2, -th / 2, tw, th); x.restore();
      const fImg = flagTexture().image, fw = 0.7 * sx, fh = 0.46 * sy, fc = [U(S.flag.x), R((S.flag.dy ?? 0.15) + centreY(S, S.flag.x) - S.Y0, port)];
      x.drawImage(fImg, fc[0] - fw / 2, fc[1] - fh / 2, fw, fh);
    }
  });
  tex.anisotropy = 8;
  const skin = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.36, metalness: 0.1 }); skin.userData.noGrain = true;
  for (const o of body) {
    let geo = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    const pos = geo.attributes.position, uv = new Float32Array(pos.count * 2), v = new THREE.Vector3(), mw = o.matrixWorld;
    for (let t = 0; t < pos.count; t += 3) {
      let zc = 0; const pts = [];
      for (let k = 0; k < 3; k++) { v.fromBufferAttribute(pos, t + k).applyMatrix4(mw); pts.push(v.clone()); zc += v.z; }
      const port = zc < 0;
      pts.forEach((p, k) => { uv[(t + k) * 2] = U(p.x) / TW; uv[(t + k) * 2 + 1] = 1 - R(p.y - S.Y0, port) / TH; });
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    if (!geo.attributes.normal) geo.computeVertexNormals();
    o.geometry = geo; o.material = skin;
  }
  /* the other parts' materials; the fin carries the livery's climbing stripes and roundel (finPaint), laid on by side-view position */
  const fp = finPaint(S); fp.tex.anisotropy = 8;
  const finMat = new THREE.MeshStandardMaterial({ map: fp.tex, roughness: 0.4, metalness: 0.05 }); finMat.userData.noGrain = true;
  const mats = { glass: M.glass, frame: own(0xd6d8d4, 0.45, 0.2), tyre: M.tyre, wingskin: own(0xdfe1df, 0.42, 0.25), tailskin: own(0xe6e6e2, 0.45, 0.15), metal: own(0xc4c8c8, 0.38, 0.45), fin: finMat };
  P.traverse((o) => {
    if (!o.isMesh || body.includes(o)) return;
    const k = Object.keys(mats).find((n) => o.name.startsWith(n) || (o.parent && o.parent.name.startsWith(n))) || "metal";
    o.material = mats[k];
    if (k === "fin") {
      const pos = o.geometry.attributes.position, uv = new Float32Array(pos.count * 2), v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld); uv[i * 2] = (v.x - fp.x0) / fp.w; uv[i * 2 + 1] = (v.y - S.Y0 - fp.y0) / fp.h; }
      o.geometry = o.geometry.clone(); o.geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    }
    if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
  });
  g.add(P);
  /* where the skin is on each side at a height: a ray in from outside onto the model's body */
  const ray = new THREE.Raycaster(), hitMat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  const probe = body.map((o) => { const m = new THREE.Mesh(o.geometry, hitMat); m.matrix.copy(o.matrixWorld); m.matrixWorld.copy(o.matrixWorld); m.matrixAutoUpdate = false; return m; });
  const skinZ = (x, y, side) => { ray.set(new THREE.Vector3(x, y, side * 6), new THREE.Vector3(0, 0, -side)); const h = ray.intersectObjects(probe, false)[0]; return h ? h.point.z : side * radiusAt(S, x); };
  const md = S.doors.find((q) => q.main), dz = skinZ(md.x, md.sill + md.h / 2, md.side);
  g.userData.door = { x: md.x, y: md.sill, z: dz + md.side * 0.04, sill: md.sill, w: md.w, h: md.h, side: md.side };
  if (opts.doorOpen) {
    /* the door leaf swung out and forward to lie 25 cm off the body beside the opening, on two hinge arms */
    const fx = md.x + md.w + 0.15, leaf = box(md.w, md.h, 0.09, M.doorSkin, fx, md.sill + md.h / 2, dz + md.side * 0.3, g);
    box(md.w - 0.04, md.h - 0.04, 0.01, M.doorInner, fx, md.sill + md.h / 2, dz + md.side * 0.25, g);
    void leaf;
    for (const f of [0.28, 0.72]) {
      const y = md.sill + md.h * f, p0 = new THREE.Vector3(md.x + md.w / 2, y, dz), p1 = new THREE.Vector3(fx - md.w / 2 + 0.05, y, dz + md.side * 0.27);
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, p0.distanceTo(p1), 8), M.metal);
      arm.position.copy(p0).add(p1).multiplyScalar(0.5); arm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p1.clone().sub(p0).normalize()); g.add(arm);
    }
    g.userData.hole = { x0: md.x - md.w / 2, x1: md.x + md.w / 2, side: md.side };
  }
  g.userData.noSurface = true;
  g.traverse((o) => { o.userData.noBatch = true; });
  return g;
}
export function makeJet(S, opts = {}) {
  if (S.parts && PARTS[S.parts]) return jetFromModel(S, opts, PARTS[S.parts]);
  const g = grp();
  g.userData.noBatch = true;
  g.userData.spec = S.name;
  /* the open boarding door's hole in the skin, in angles round the body (see the doors, below) */
  const ang = (x, y, side) => { const r = radiusAt(S, x), dy = Math.max(-0.98 * r, Math.min(0.98 * r, y - centreY(S, x))); return side * Math.acos(dy / r); };
  const holes = [];
  if (opts.doorOpen) {
    const d = S.doors.find((q) => q.main), a0 = ang(d.x, d.sill + d.h, d.side), a1 = ang(d.x, d.sill, d.side);
    g.userData.hole = { x0: d.x - d.w / 2, x1: d.x + d.w / 2, a0: Math.min(a0, a1), a1: Math.max(a0, a1), side: d.side };
    holes.push(g.userData.hole);
  }
  g.add(fuselage(S, holes));
  const wg = S.wing, TILT = wg.tilt, lead = (z) => lerp(wg.root[0], wg.tip[0], z / wg.span), trail = (z) => lerp(wg.root[1], wg.tip[1], z / wg.span);
  /* cabin windows: small dark rounded panes set into the stripe, as in the photographs (no light frame round them; a thin darker rim only) */
  const W = S.windows, skip = [...S.doors.map((d) => d.x), ...S.overwing.map((d) => d.x)];
  const xs = [];
  for (let x = W.from; x <= W.to; x += W.step) if (!skip.some((k) => Math.abs(k - x) < 0.9)) xs.push(x);
  const glassG = roundRect(0.24, 0.33, 0.09), rimG = roundRect(0.28, 0.37, 0.1);
  const gi = new THREE.InstancedMesh(glassG, M.glass, xs.length * 2), fi = new THREE.InstancedMesh(rimG, M.rim, xs.length * 2);
  const q = new THREE.Quaternion(), p = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1), m4 = new THREE.Matrix4(), euler = new THREE.Euler();
  xs.forEach((x, i) =>
    [-1, 1].forEach((s, k) => {
      const o = onSide(S, x, W.dy, s);
      euler.set(s > 0 ? -o.tilt : o.tilt, s > 0 ? 0 : Math.PI, 0, "XYZ");
      q.setFromEuler(euler);
      p.set(x, o.y, o.z + s * 0.004);
      fi.setMatrixAt(i * 2 + k, m4.compose(p, q, one));
      p.set(x, o.y, o.z + s * 0.008);
      gi.setMatrixAt(i * 2 + k, m4.compose(p, q, one));
    }),
  );
  gi.name = "windows"; fi.name = "windowRims";
  g.add(fi, gi);
  /* the flight deck's windows, high on the nose above the cabin window line: on each side a short row of panes with pale frames, and across the top of
     the nose the windscreen itself, a dark glazed block that slopes down to the front (as in the photograph of 6Y-JIJ) */
  const C = S.cockpit;
  if (!C.painted) for (const s of [-1, 1])
    for (let i = 0; i < C.n; i++) {
      const x = C.x + i * C.dx, r = radiusAt(S, x), o = onSide(S, x, Math.min(C.dy, r * 0.8), s);
      const w = i === C.n - 1 ? 0.3 : 0.4;
      const fr = box(w + 0.07, 0.4, 0.03, M.frame, x, o.y, o.z + s * 0.004, g);
      const pn = box(w, 0.34, 0.04, M.glass, x, o.y, o.z + s * 0.012, g);
      pn.rotation.x = fr.rotation.x = s > 0 ? -o.tilt : o.tilt;
      pn.rotation.y = fr.rotation.y = s * Math.max(0, i - 1) * 0.35; /* the last pane turns in toward the front */
    }
  /* the windscreen: dark glass laid over the curve of the nose, in two panes either side of a centre post, with a pale frame round it */
  const patch = (x0, x1, a0, a1, mat, lift, nx = 6, na = 6) => {
    const pos = [], idx = [];
    for (let i = 0; i <= nx; i++) {
      const x = lerp(x0, x1, i / nx), r = radiusAt(S, x) + lift, cy = centreY(S, x);
      for (let j = 0; j <= na; j++) {
        const a = lerp(a0, a1, j / na);
        pos.push(x, cy + Math.cos(a) * r, Math.sin(a) * r);
      }
    }
    for (let i = 0; i < nx; i++)
      for (let j = 0; j < na; j++) {
        const p = i * (na + 1) + j, q = p + 1, u = p + na + 1, v = u + 1;
        idx.push(p, u, q, q, u, v);
      }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    if (!mat.userData.twoSided) { mat.side = THREE.DoubleSide; mat.userData.twoSided = true; } /* the patch's winding depends on its side of the body: draw both faces */
    const m = new THREE.Mesh(geo, mat);
    g.add(m);
    return m;
  };
  if (C.painted) {
    /* the windscreen's centre post, along the top of the nose where the painted glass crosses it */
    let xa = null, xb = null;
    for (let x = C.x; x < S.profile[S.profile.length - 1][0]; x += 0.01) { const r = radiusAt(S, x); if ((C.a320 ? a320Nose(S, x, r * 0.999 + centreY(S, x) - S.Y0) : noseWindows(S, x, r * 0.999)) === 0x16222a) { if (xa === null) xa = x; xb = x; } }
    if (xa !== null) patch(xa - 0.02, xb + 0.02, -0.022, 0.022, own(0xd9dcd8, 0.5, 0.1), 0.004, 8, 1);
  } else {
    const xa = C.front - 0.7, xb = C.front + 0.35, A = 0.6; /* two panes each side of a centre post, about 35 degrees round the nose each way (photograph 6Y-JIJ) */
    patch(xa - 0.05, xb + 0.05, -A - 0.05, A + 0.05, M.frame, 0.006);
    patch(xa, xb, -A, -0.04, M.glass, 0.014);
    patch(xa, xb, 0.04, A, M.glass, 0.014);
  }
  /* Doors. A closed door is painted with the plane, so only its outline shows: a thin dark seam on the curve of the skin. The open boarding door (opts.doorOpen)
     is a real opening: the skin is cut away (holes, above), a reveal 14 cm deep lines its four sides, the cabin shows inside (a dim wall, a lit ceiling
     strip, the floor at the sill), and the door itself, a thick curved slab, has swung out and forward to lie along the body beside it, on two hinge arms. */
  const outline = (x, w, y0, h, side, lift = 0.006, t = 0.022) => {
    const a0 = ang(x, y0 + h, side), a1 = ang(x, y0, side), lo = Math.min(a0, a1), hi = Math.max(a0, a1), da = t / radiusAt(S, x);
    patch(x - w / 2 - t, x + w / 2 + t, lo - da, lo, M.seam, lift, 3, 1);
    patch(x - w / 2 - t, x + w / 2 + t, hi, hi + da, M.seam, lift, 3, 1);
    patch(x - w / 2 - t, x - w / 2, lo, hi, M.seam, lift, 1, 8);
    patch(x + w / 2, x + w / 2 + t, lo, hi, M.seam, lift, 1, 8);
  };
  S.doors.forEach((d) => { if (!(d.main && opts.doorOpen)) outline(d.x, d.w, d.sill, d.h, d.side); });
  S.overwing.forEach((d) => { const o = onSide(S, d.x, 0.62, d.side); outline(d.x, 0.5, o.y - 0.36, 0.72, d.side); });
  S.cargo.forEach((d) => { const o = onSide(S, d.x, -0.95, d.side); outline(d.x, 1.2, o.y - 0.45, 0.9, d.side); });
  if (opts.doorOpen && g.userData.hole) {
    const H = g.userData.hole, side = H.side, T = 0.14;
    const ring = (x, a, dr) => { const r = radiusAt(S, x) + dr, cy = centreY(S, x); return new THREE.Vector3(x, cy + Math.cos(a) * r, Math.sin(a) * r); };
    const quads = [], add = (a, b, c, d) => quads.push(a, b, c, a, c, d);
    const NA = 10;
    for (let k = 0; k < NA; k++) { /* the reveal's two sides, fore and aft, following the curve */
      const u0 = lerp(H.a0, H.a1, k / NA), u1 = lerp(H.a0, H.a1, (k + 1) / NA);
      for (const x of [H.x0, H.x1]) add(ring(x, u0, 0), ring(x, u1, 0), ring(x, u1, -T), ring(x, u0, -T));
    }
    for (const a of [H.a0, H.a1]) add(ring(H.x0, a, 0), ring(H.x1, a, 0), ring(H.x1, a, -T), ring(H.x0, a, -T)); /* head and sill */
    const rg = new THREE.BufferGeometry().setFromPoints(quads); rg.computeVertexNormals();
    const reveal = new THREE.Mesh(rg, M.reveal); g.add(reveal);
    /* the cabin inside: a dim back wall a metre in, a lit strip high on it, and the floor level with the sill */
    const cx = (H.x0 + H.x1) / 2, inner = radiusAt(S, cx) - 1.0, cy = centreY(S, cx);
    const ya = cy + Math.cos(H.a0) * radiusAt(S, cx), yb = cy + Math.cos(H.a1) * radiusAt(S, cx), yLo = Math.min(ya, yb), yHi = Math.max(ya, yb);
    const zIn = side * Math.sqrt(Math.max(0.01, inner * inner - 0.0));
    box(H.x1 - H.x0 + 0.8, yHi - yLo + 0.3, 0.04, M.cabin, cx, (yLo + yHi) / 2, side * (radiusAt(S, cx) - 1.0), g);
    const lit = box(H.x1 - H.x0 + 0.8, 0.08, 0.05, M.cabinLight, cx, yHi - 0.12, side * (radiusAt(S, cx) - 1.0) + side * 0.03, g); lit.userData.noGlow = true; /* bright, but no halo: the halo was drawn through the skin as a dot by the door */
    { const r0 = radiusAt(S, cx), zs = Math.sqrt(Math.max(0.01, r0 * r0 - (yLo - cy) ** 2)) - 0.16; box(H.x1 - H.x0 + 0.6, 0.04, zs - (r0 - 1.0), M.floor, cx, yLo + 0.02, side * ((zs + r0 - 1.0) / 2), g); } /* the floor stops inside the skin */
    void zIn;
    /* the door: a curved slab 9 cm thick, its outer face painted like the skin round it, swung forward to lie 25 cm off the body */
    const fx0 = H.x1 + 0.12, fx1 = fx0 + (H.x1 - H.x0), lift = 0.25;
    patch(fx0, fx1, H.a0, H.a1, M.doorSkin, lift + 0.09, 4, 10);
    patch(fx0, fx1, H.a0, H.a1, M.doorInner, lift, 4, 10);
    const slab = [], sadd = (a, b, c, d) => slab.push(a, b, c, a, c, d);
    for (let k = 0; k < NA; k++) {
      const u0 = lerp(H.a0, H.a1, k / NA), u1 = lerp(H.a0, H.a1, (k + 1) / NA);
      for (const x of [fx0, fx1]) sadd(ring(x, u0, lift), ring(x, u1, lift), ring(x, u1, lift + 0.09), ring(x, u0, lift + 0.09));
    }
    for (const a of [H.a0, H.a1]) sadd(ring(fx0, a, lift), ring(fx1, a, lift), ring(fx1, a, lift + 0.09), ring(fx0, a, lift + 0.09));
    const sg = new THREE.BufferGeometry().setFromPoints(slab); sg.computeVertexNormals();
    g.add(new THREE.Mesh(sg, M.doorEdge));
    /* the window in the door, and its handle */
    const am = (H.a0 + H.a1) / 2, aw = 0.16 / radiusAt(S, fx0);
    const up = -side; /* round the body, the angle grows toward the roof on this side by -side */
    const wa = am + up * aw * 0.8, wb = am + up * aw * 2.6;
    patch((fx0 + fx1) / 2 - 0.11, (fx0 + fx1) / 2 + 0.11, Math.min(wa, wb), Math.max(wa, wb), M.glass, lift + 0.095, 2, 3);
    const hp = ring((fx0 + fx1) / 2 - 0.2, am - up * aw * 0.6, lift + 0.11);
    box(0.22, 0.05, 0.05, M.metal, hp.x, hp.y, hp.z, g);
    /* two hinge arms from the forward edge of the opening out to the door */
    for (const f of [0.28, 0.72]) {
      const a = lerp(H.a0, H.a1, f), p0 = ring(H.x1 - 0.02, a, 0.02), p1 = ring(fx0 + 0.05, a, lift + 0.04);
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, p0.distanceTo(p1), 8), M.metal);
      arm.position.copy(p0).add(p1).multiplyScalar(0.5);
      arm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p1.clone().sub(p0).normalize());
      g.add(arm);
    }
  }
  const md = S.doors.find((d) => d.main), mo = onSide(S, md.x, md.sill + md.h / 2 - centreY(S, md.x), md.side);
  g.userData.door = { x: md.x, y: md.sill, z: mo.z + md.side * 0.04, sill: md.sill, w: md.w, h: md.h, side: md.side };
  /* the title near the nose and the flag by the registration, on both sides */
  const title = titleTexture(S.livery), flag = flagTexture();
  for (const s of [-1, 1]) {
    if (S.title.dy) {
      /* high on the body the side curves away too much for a flat sheet: the title is laid on the curve itself, a grid that follows the skin */
      const tw = S.title.w, th = tw * (200 / 1024), x0 = S.title.x - tw / 2, pos = [], uv = [], idx = [], NX = 16, NY = 6;
      for (let i = 0; i <= NX; i++) for (let j = 0; j <= NY; j++) {
        const x = x0 + (tw * i) / NX, dy = S.title.dy - th / 2 + (th * j) / NY, r = radiusAt(S, x), cy = centreY(S, x), d = Math.min(dy, r * 0.97), z = s * Math.sqrt(Math.max(0, r * r - d * d)), k = 1 + 0.02 / r;
        pos.push(x, cy + d * k, z * k); uv.push(s > 0 ? i / NX : 1 - i / NX, j / NY);
      }
      for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) { const a = i * (NY + 1) + j, b = a + NY + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
      const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx);
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: title, transparent: true, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 }));
      m.name = "title"; g.add(m);
    } else {
    const x = S.title.x, o = onSide(S, x, 0.05, s), t = decal(S.title.w, S.title.w * 0.1774, title);
    t.position.set(x, o.y, o.z + s * 0.025); t.rotation.set(s > 0 ? -o.tilt : o.tilt, s > 0 ? 0 : Math.PI, 0);
    g.add(t);
    }
    if (S.flag.onEngine) {
      const E = S.engines, f = decal(0.6, 0.4, flag);
      f.position.set(E.x + 0.6, S.Y0 + E.y + 0.12, s * (E.z + E.r + 0.012));
      if (s < 0) f.rotation.y = Math.PI;
      g.add(f);
    } else {
      const fx = S.flag.x, fo = onSide(S, fx, S.flag.dy ?? 0.15, s), f = decal(0.7, 0.46, flag);
      f.position.set(fx, fo.y, fo.z + s * 0.025); f.rotation.set(s > 0 ? -fo.tilt : fo.tilt, s > 0 ? 0 : Math.PI, 0);
      g.add(f);
    }
  }
  /* wings: swept slabs, tilted up toward the tip; a leading edge with its slat line, flaps and an aileron on the trailing edge, spoiler lines,
     a navigation light and a fuel vent at the tip */
  const wingPts = [[wg.root[0], 0], [wg.tip[0], wg.span], [wg.tip[1], wg.span], [wg.root[1], 0]];
  const wingTop = wg.y + wg.thick / 2 + 0.012;
  for (const s of [-1, 1]) {
    const holder = grp(g, 0, 0, 0);
    holder.rotation.x = -s * TILT;
    const w = slab(wingPts, wg.thick, M.white);
    w.rotation.x = Math.PI / 2; w.scale.y = s; w.position.set(0, wg.y, 0); w.name = "wing";
    holder.add(w);
    const sz = (z) => z * s;
    seamLine(holder, [lead(0.4) - 0.55, sz(0.4)], [lead(wg.span * 0.97) - 0.55, sz(wg.span * 0.97)], wingTop);
    const f1 = 0.1 * wg.span, f2 = 0.45 * wg.span, a1 = 0.6 * wg.span, a2 = 0.94 * wg.span;
    for (const z of [f1, f2, a1, a2]) seamLine(holder, [trail(z) + 1.6, sz(z)], [trail(z), sz(z)], wingTop);
    seamLine(holder, [trail(f1) + 1.6, sz(f1)], [trail(f2) + 1.6, sz(f2)], wingTop);
    seamLine(holder, [trail(a1) + 1.0, sz(a1)], [trail(a2) + 1.0, sz(a2)], wingTop);
    seamLine(holder, [trail(f2) + 2.4, sz(f2)], [trail(a1) + 2.4, sz(a1)], wingTop, 0.035);
    const tipZ = wg.span * 0.995;
    mesh(new THREE.SphereGeometry(0.12, 8, 6), s < 0 ? M.red : M.green, trail(tipZ) + 0.4, wg.y, sz(tipZ), holder);
    box(0.5, 0.04, 0.04, M.steel, lead(tipZ) - 0.6, wg.y + 0.35, sz(tipZ) * 0.985, holder);
    if (S.tipFence) {
      /* drawn in the x-y plane at the tip's span: the leading point forward of the tip, the plate rising 0.85 m above and 0.6 m below the wing */
      const lx = lead(wg.span), tx = trail(wg.span);
      const fence = slab([[lx + 0.25, wg.y], [tx + 0.35, wg.y + 0.85], [tx - 0.05, wg.y + 0.85], [tx - 0.05, wg.y - 0.6], [tx + 0.35, wg.y - 0.6]], 0.06, M.white);
      fence.position.z = sz(wg.span + 0.02); fence.name = "fence";
      holder.add(fence);
    }
  }
  /* engines */
  const E = S.engines;
  if (E.kind === "wing")
    for (const s of [-1, 1])
      for (const z of E.z) {
        const ex = lead(z) + 0.5 + (E.fwd || 0), ey = E.y + TILT * z;
        pod(g, ex, ey, z * s, E.len, E.r);
        /* the wing at this span: tilted up by TILT about the body's axis, so its underside here is TILT * z higher than at the root */
        pylon(g, z * s, ey + E.r, ex + E.len / 2, ex - E.len / 2, wg.y - wg.thick / 2 + Math.sin(TILT) * z, lead(z));
      }
  else
    for (const s of [-1, 1]) {
      const ey = S.Y0 + E.y, rr = radiusAt(S, E.x);
      pod(g, E.x, ey, s * E.z, E.len, E.r);
      box(1.9, 0.22, E.z - rr + 0.15, M.white, E.x + 0.1, ey - 0.02, s * (rr + (E.z - rr) / 2 - 0.05), g);
    }
  /* tail: a swept fin standing on the rear fuselage with its own paint, a rudder line, a cap and a beacon; the horizontal tail with elevator lines */
  /* the paint is the fin's own picture, lit like the rest of the plane: the two faces of the extruded fin take their texture coordinates from the
     outline itself (x, y), so the picture is placed by its repeat and offset; the thin edges stay plain white */
  const T = S.tail, fp = finPaint(S);
  fp.tex.repeat.set(1 / fp.w, 1 / fp.h); fp.tex.offset.set(-fp.x0 / fp.w, -fp.y0 / fp.h); fp.tex.anisotropy = 8;
  const finMat = new THREE.MeshStandardMaterial({ map: fp.tex, roughness: 0.4, metalness: 0.05 }); finMat.userData.noGrain = true;
  const fin = slab(T.fin, 0.22, [finMat, M.white]);
  fin.position.set(0, S.Y0, 0); fin.name = "fin"; g.add(fin);
  const rudderX = (y) => lerp(T.fin[2][0], T.fin[3][0], 1 - (y - 1.0) / (T.finTop - 1.0)) + 0.7;
  const l0 = [rudderX(T.finTop), T.finTop], l1 = [rudderX(1.0), 1.0];
  for (const s of [-1, 1]) {
    const r = box(0.03, Math.hypot(l0[1] - l1[1], l0[0] - l1[0]), 0.03, M.seam, (l0[0] + l1[0]) / 2, S.Y0 + (l0[1] + l1[1]) / 2, s * 0.125, g);
    r.rotation.z = -Math.atan2(l0[0] - l1[0], l0[1] - l1[1]);
  }
  box(Math.abs(T.fin[1][0] - T.fin[2][0]) + 0.2, 0.1, 0.3, M.grey, (T.fin[1][0] + T.fin[2][0]) / 2, S.Y0 + T.finTop + 0.04, 0, g);
  mesh(new THREE.SphereGeometry(0.13, 8, 6), M.red, (T.fin[1][0] + T.fin[2][0]) / 2 - 0.4, S.Y0 + T.finTop + 0.18, 0, g);
  for (const s of [-1, 1]) {
    const hs = slab(T.stab.pts, 0.2, M.white);
    hs.rotation.x = Math.PI / 2; hs.scale.y = s;
    hs.position.set(0, S.Y0 + T.stab.y, 0); hs.name = "stab";
    g.add(hs);
    const top = S.Y0 + T.stab.y + 0.11, sp = T.stab.pts[2][1];
    seamLine(g, [T.stab.pts[3][0] + 1.2, s * 0.4], [T.stab.pts[2][0] + 1.2, s * sp], top);
    mesh(new THREE.SphereGeometry(0.08, 6, 5), s < 0 ? M.red : M.green, T.stab.pts[2][0], S.Y0 + T.stab.y, s * sp, g);
  }
  /* red beacon under the belly and one on the top of the fuselage, a blade antenna on the roof, a pitot probe on the nose */
  const midX = (S.profile[0][0] + S.profile[S.profile.length - 1][0]) / 2 + 3;
  mesh(new THREE.SphereGeometry(0.1, 8, 6), M.red, midX, S.Y0 - radiusAt(S, midX) - 0.02, 0, g);
  mesh(new THREE.SphereGeometry(0.1, 8, 6), M.red, midX - 1, centreY(S, midX - 1) + radiusAt(S, midX - 1) + 0.03, 0, g);
  const blade = slab([[0, 0], [0.5, 0], [0.34, 0.38], [0.1, 0.38]], 0.025, M.metal);
  blade.position.set(midX + 4, centreY(S, midX + 4) + radiusAt(S, midX + 4) - 0.02, 0); g.add(blade);
  const noseX = S.profile[S.profile.length - 1][0];
  const pitot = cyl(0.02, 0.025, 0.5, M.steel, noseX - 1.6, S.Y0 + 0.05, 0, g, 6); pitot.rotation.z = Math.PI / 2;
  /* landing gear: the nose gear with a two-part leg and torque links and two wheels; the main bogies with a leg, a beam, a brace and the wheels */
  const G = S.gear, ngY = S.Y0 - radiusAt(S, G.noseX) + 0.1;
  const ng = grp(g, G.noseX, 0, 0);
  cyl(0.1, 0.1, ngY - 0.5, M.steel, 0, 0.5 + (ngY - 0.5) / 2, 0, ng, 10);
  cyl(0.07, 0.07, 0.62, M.metal, 0, 0.62, 0, ng, 8);
  box(0.06, 0.34, 0.05, M.steel, -0.12, ngY * 0.62, 0, ng).rotation.z = 0.4;
  box(0.06, 0.34, 0.05, M.steel, 0.12, ngY * 0.62, 0, ng).rotation.z = -0.4;
  box(0.08, 0.16, 0.12, M.white, 0.12, ngY - 0.2, 0, ng);
  for (const dz of [-0.28, 0.28]) wheel(G.noseWheel, 0.22, ng, 0, G.noseWheel, dz);
  box(0.5, 0.05, 0.14, M.steel, 0, G.noseWheel, 0, ng);
  for (const dz of [-1, 1]) box(1.1, 0.04, 0.5, M.grey, 0.1, ngY + 0.05, dz * 0.6, ng);
  for (const s of [-1, 1]) {
    const mg = grp(g, G.mainX, 0, s * G.mainZ), legTop = wg.y - 0.1;
    cyl(0.14, 0.14, legTop - 1.2, M.steel, 0, 1.2 + (legTop - 1.2) / 2, 0, mg, 10);
    cyl(0.1, 0.1, 0.8, M.metal, 0, 1.0, 0, mg, 8);
    box(0.07, 1.1, 0.07, M.steel, 0.5, 1.7, 0, mg).rotation.z = -0.5;
    box(G.bogie === 4 ? 1.7 : 0.3, 0.14, 0.3, M.steel, 0, G.wheel, 0, mg);
    const ws = G.bogie === 4 ? [[-0.65, -0.32], [-0.65, 0.32], [0.65, -0.32], [0.65, 0.32]] : [[0, -0.32], [0, 0.32]];
    for (const [dx, dz] of ws) wheel(G.wheel, 0.3, mg, dx, G.wheel, dz);
    box(2.0, 0.04, 0.9, M.grey, -0.2, wg.y - 0.18, s * -0.1, mg);
  }
  g.userData.noSurface = true;
  g.traverse((o) => { o.userData.noBatch = true; });
  return g;
}
export const dc8 = (opts) => makeJet(DC8, opts);
export const dc9 = (opts) => makeJet(DC9, opts);
export const a320 = (opts) => makeJet(A320, opts);
export const radius = radiusAt, centre = centreY;
