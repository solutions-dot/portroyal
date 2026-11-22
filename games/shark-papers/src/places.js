/* The three places of the story: the deck of the schooner Ferret off Jacmel, the dockyard quay at Port Royal and the Court of Vice-Admiralty
   in Kingston. What follows a source, and what is still a general picture, is in docs/games/shark-papers.md ("Places").
   Every place lists its people with something to do (engine/ambient.js behaviours), its walking walls, what the story changes in it
   (Q.reveal, Q.enter) and its part in a camera scene (Q.films). The ships, their gear and the shark are built in ships.js.
   Story people: person(). Background people: crowd(), each a body made for the year and the place (tools/shark-papers/people). */
import * as THREE from "three";
import { T, cv, std, solid, mesh, box, cyl, plane, grp, batchStatic } from "./gfx.js";
import { palm, cart, crate, sack, bucket } from "./period-props.js";
import * as P from "./props.js";
import * as W from "./world.js";
import * as S from "./ships.js";
import { TASKS } from "./steps.js";
import { createSea, gulls } from "../../../engine/sea.js";
import { rowBoat, rowStroke } from "../../../engine/boats.js";
import { AU, tone, noiseHit, shipCreak, gullCry } from "../../../engine/audio.js";

const base = (id, bounds, start) => ({
  id,
  group: grp(),
  bounds: { x0: bounds[0], z0: bounds[1], x1: bounds[2], z1: bounds[3] },
  start: { x: start[0], z: start[1], yaw: start[2] || 0 },
  walls: [],
  specs: [],
  ambient: [],
  points: {},
  items: {},
  props: {},
  routes: [],
  tickers: [],
  keepOff: [],
  reveal: {},
  films: {},
  danger: {},
  ground: () => 0,
});
function add(Q, o, x = 0, z = 0, y = 0, ry = 0) {
  o.position.set(x, y, z);
  o.rotation.y = ry;
  Q.group.add(o);
  return o;
}
function wall(Q, x, z, w, d) {
  Q.walls.push([x - w / 2, z - d / 2, x + w / 2, z + d / 2]);
}
/* a solid thing: add it and its walking wall (w along x, d along z before turning; quarter turns swap them) */
function solid1(Q, o, x, z, w, d, ry = 0, y = 0) {
  add(Q, o, x, z, y, ry);
  const q = Math.abs(Math.round(ry / (Math.PI / 2))) % 2 === 1;
  wall(Q, x, z, q ? d : w, q ? w : d);
  return o;
}
/* a story person. life: what they do when not talking (an ambient behaviour). opts: held, hat */
function person(Q, id, cast, x, z, ry = 0, life = null, opts = {}) {
  Q.specs.push({ id, cast, x, z, ry, life, ...opts });
}
/* a background person: look is a body (tools/shark-papers/people); life an ambient behaviour */
function crowd(Q, look, x, z, ry, life, opts = {}) {
  Q.ambient.push({ id: Q.id + "-" + Q.ambient.length, look, x, z, ry, behaviour: life, ...opts });
}
function ground(Q, mat, size = 500, x = 0, z = 0, y = -0.025) {
  const p = plane(size, size, mat, x, y, z, Q.group);
  p.rotation.x = -Math.PI / 2;
  p.name = "terrain";
  return p;
}
/* a strip of ground laid just over the terrain: a road, a yard */
function strip(Q, w, d, mat, x, z, y = 0.012) {
  const p = plane(w, d, mat, x, y, z, Q.group);
  p.rotation.x = -Math.PI / 2;
  p.name = "terrain";
  return p;
}
const face = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
const dyn = (o) => {
  o.traverse((n) => (n.userData.noBatch = true));
  return o;
};
const far = (o) => {
  o.traverse((n) => (n.userData.far = true));
  return o;
};
const sounds = () => AU.ctx && AU.on && AU.ctx.state === "running";
/* put a story person somewhere else for a step (Q.enter): where they stand, and what they look toward */
function stand(Q, id, x, z, tx, tz) {
  const n = Q.people?.find((p) => p.id === id);
  if (!n) return;
  const ry = face(x, z, tx, tz);
  n.x = x;
  n.z = z;
  n.m.position.set(x, 0, z);
  n.m.rotation.y = ry;
  n.home = { x, z, ry };
}
/* stretch a unit rope (a cylinder one metre long) from a to b */
const _a = new THREE.Vector3(),
  _b = new THREE.Vector3(),
  _up = new THREE.Vector3(0, 1, 0);
function stretch(o, a, b) {
  _a.set(a[0], a[1], a[2]);
  _b.set(b[0], b[1], b[2]).sub(_a);
  const L = _b.length();
  o.position.copy(_a).addScaledVector(_b, 0.5);
  o.scale.set(1, L, 1);
  o.quaternion.setFromUnitVectors(_up, _b.multiplyScalar(1 / (L || 1)));
}
const unitRope = (r = 0.014, m = S.SM.hemp) => {
  const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 5, 1, true), m);
  o.userData.noBatch = true;
  o.userData.noAudit = true;
  return o;
};
const PLANK = () => std(T.plank([156, 126, 90], 10, [1, 1]), 0.9);
const BOATW = () => std(T.plank([150, 138, 112], 6, [1, 1]), 0.9),
  BOATT = () => solid(0x6a5038, 0.9);
/* a cask: staves with a belly and iron hoops (a water cask, a harness cask for salt meat, a cask of stores) */
function cask(h = 0.9, r = 0.3, hoops = S.SM.iron, wood = 0x7a5a3c) {
  const g = grp(),
    pr = [[r * 0.8, 0], [r * 0.93, h * 0.2], [r, h * 0.5], [r * 0.93, h * 0.8], [r * 0.8, h]];
  mesh(new THREE.LatheGeometry(pr.map((p) => new THREE.Vector2(p[0], p[1])), 12), solid(wood, 0.9), 0, 0, 0, g);
  cyl(r * 0.78, r * 0.78, 0.02, solid(0x5e442e, 0.9), 0, h - 0.02, 0, g, 12);
  for (const [k, rr] of [[0.06, 0.845], [0.22, 0.945], [0.78, 0.945], [0.94, 0.845]]) cyl(r * rr + 0.006, r * rr + 0.006, h * 0.045, hoops, 0, h * k, 0, g, 12);
  return g;
}
/* far hills in soft layers: each row paler and bluer than the one in front of it. rows: [[distance, height, radius, count, [r, g, b]]] toward `dir` (radians) */
function ranges(Q, rows, dir, spread = 1.0, seed = 3) {
  let k = seed;
  for (const [dist, h, r, n, col] of rows)
    for (let i = 0; i < n; i++) {
      const a = dir + ((i + 0.5) / n - 0.5) * spread + Math.sin(k * 12.9898) * 0.04,
        hh = h * (0.7 + 0.5 * Math.abs(Math.sin(k++ * 78.233))),
        m = W.cockpitHill(r * (0.8 + 0.4 * Math.abs(Math.sin(k * 3.1))), hh, k, col);
      m.position.set(Math.sin(a) * dist, -3, Math.cos(a) * dist);
      m.userData.far = true;
      Q.group.add(m);
    }
}

/* ---------- 1. The deck of the schooner Ferret, off Jacmel, at dawn, August 1799 ---------- */
function deck() {
  /* her lines: about 61 feet on deck and 18 feet 8 inches in the beam, a size that fits "six 3-pounders and 45 men". No plan of her is known. */
  const F = S.lines({ L: 18.6, B: 5.7, fb: 1.5, bul: 0.85, stern: 0.72, bowAt: 0.56, bluff: 2.3 }),
    half = (z) => F.half(F.s(z)),
    SEA = -F.fb;
  const Q = base("deck", [-2.8, -8.7, 2.8, 9.0], [1.6, 3.6, 0.15]);
  Q.floor = "wood";
  Q.beds = { sea: 0.12, wind: 0.015 };   /* "not a breath of air out of the heavens" (Wylie, in Fitton's account) */
  Q.light = { top: 0x5a9ccc, hor: 0xf4dfc4, fog: [0xe9dfd0, 160, 880], sun: [0xffe8c4, 2.4, 70, 30, -20], hemi: [0xfff6ea, 0x6f9aa8, 2.5] };
  Q.view = { pos: [2.2, 2.6, 8.6], look: [-0.6, 1.2, -3] };
  const ship = S.hull(F, { deck: PLANK(), stripe: 0.32, inner: 0x7a3a2c });
  Q.group.add(ship);
  ship.userData.hollow = true;   /* people stand on her deck, inside her outline, on purpose */
  for (let z = -9.3; z < 9.3; z += 0.5) {
    const h = Math.min(half(z), half(z + 0.5)) - 0.17;
    Q.walls.push([h, z, 3.6, z + 0.5], [-3.6, z, -h, z + 0.5]);
  }
  Q.walls.push([-3.6, 9.05, 3.6, 9.9]);
  const sea = createSea(Q.group, { kind: "caribbean", y: SEA, at: [0, 0], swell: 0.5 });
  Q.tickers.push((t) => sea.tick && sea.tick(t));
  /* the south coast of Saint-Domingue to starboard: a low green shore, hills behind, and the high blue ridges inland */
  ranges(Q, [[420, 34, 70, 9, [0.3, 0.46, 0.3]], [560, 70, 110, 8, [0.36, 0.5, 0.42]], [720, 130, 150, 7, [0.5, 0.62, 0.66]]], Math.PI / 2, 2.2, 5);
  const shore = box(18, 2.2, 900, solid(0xe6dcc0, 1), 372, SEA + 0.2, 0, Q.group);
  shore.userData.far = true;
  const flyGulls = gulls(Q.group, 5, [-34, 38], 9, 14, 2);
  Q.tickers.push((t) => flyGulls(t));
  let creakT = 6;
  Q.tickers.push((t, dt) => {
    if ((creakT -= dt) > 0 || !sounds()) return;
    creakT = 5 + Math.random() * 9;
    Math.random() < 0.6 ? shipCreak() : gullCry();
  });

  /* ---- masts, sails and rigging: a two-masted schooner, her sails set and hanging in the calm ---- */
  const FORE = -5.2,
    MAIN = 2.6;
  S.schoonerRig(Q.group, F, { foreZ: FORE, mainZ: MAIN, set: "set" });
  wall(Q, 0, FORE, 0.5, 0.5);
  wall(Q, 0, MAIN + 0.1, 0.5, 0.5);
  /* pin rails inside the bulwarks by the shrouds, with their coils; a fife rail round the foot of each mast */
  for (const z of [FORE + 0.5, MAIN + 0.6])
    for (const s of [-1, 1]) {
      const pr = S.pinRail(5, s > 0 ? [0, 2, 4] : [1, 2, 4]);
      pr.position.set(s * (half(z) - 0.2), 0.72, z);
      Q.group.add(pr);
      box(0.06, 0.72, 0.06, S.SM.woodDark, s * (half(z) - 0.2), 0.36, z - 0.4, Q.group);
      box(0.06, 0.72, 0.06, S.SM.woodDark, s * (half(z) - 0.2), 0.36, z + 0.4, Q.group);
    }
  for (const z of [FORE, MAIN]) {
    for (const x of [-0.42, 0.42]) box(0.08, 0.7, 0.08, S.SM.woodDark, x, 0.35, z - 0.5, Q.group);
    const fr = S.pinRail(4, [0, 3]);
    fr.rotation.y = Math.PI / 2;
    fr.position.set(0, 0.7, z - 0.5);
    Q.group.add(fr);
    wall(Q, 0, z - 0.5, 1.0, 0.2);
  }
  /* ---- forward: the windlass, the bell, the anchors at the cat heads ---- */
  solid1(Q, S.windlass(1.9), 0, -7.6, 2.2, 0.6);
  const belfry = S.belfry();
  solid1(Q, belfry, 0, -6.45, 0.7, 0.3);
  for (const s of [-1, 1]) {
    const a = S.anchor(1.9);
    a.position.set(s * (half(-8.0) + 0.2), 0.45, -7.2);
    a.rotation.set(0, Math.PI, s * 1.4);
    Q.group.add(a);
    const cat = box(0.16, 0.16, 1.1, S.SM.woodDark, s * (half(-8.3) + 0.25), 0.95, -8.3, Q.group);
    cat.rotation.y = s * 0.9;
    S.rope([s * 0.5, 0.62, -7.8], [s * (half(-8.4) - 0.05), 0.5, -8.6], 0.035, S.SM.hemp, Q.group, 6);   /* the cable leading to the hawse hole */
  }
  /* ---- the six 3-pounders, three a side, run out at their ports ---- */
  for (const z of [-3.2, -0.9, 4.25])
    for (const s of [-1, 1]) {
      const x = s * (half(z) - 0.98);
      add(Q, S.gunAtPort(s), x, z);
      wall(Q, s * (half(z) - 0.8), z, 1.2, 0.66);   /* the carriage and the breech: the muzzle stands out through the port */
      box(0.05, 0.4, 0.52, new THREE.MeshBasicMaterial({ color: 0x0c0a09 }), s * (half(z) - 0.125), 0.48, z, Q.group);   /* the port */
      const rack = S.shotRack(5, 0.036);
      rack.position.set(s * (half(z + 0.7) - 0.28), 0, z + 0.72);
      rack.rotation.y = Math.PI / 2;
      Q.group.add(rack);
      S.spar([s * (half(z - 0.6) - 0.2), 0.05, z - 1.25], [s * (half(z - 0.6) - 0.22), 0.07, z - 0.45], 0.02, 0.02, S.SM.wood, Q.group);   /* the rammer, laid by */
      cyl(0.045, 0.045, 0.12, S.SM.white, s * (half(z - 0.6) - 0.2), 0.05, z - 1.3, Q.group, 8).rotation.x = Math.PI / 2;
    }
  /* ---- amidships: the boat on her chocks, the harness cask, the main hatch, the pumps, the scuttle butt ---- */
  const boat = rowBoat({ L: 4.3, beam: 1.36, depth: 0.6, wood: BOATW(), timber: BOATT(), oars: "shipped", rudder: false, gear: false });
  boat.rotation.y = Math.PI / 2;
  boat.position.set(0, 0.2, -2.35);
  Q.group.add(boat);
  for (const z of [-3.5, -1.2]) {
    box(1.2, 0.22, 0.14, S.SM.woodDark, 0, 0.11, z, Q.group);
    for (const s of [-1, 1]) S.rope([s * 0.66, 0.03, z + 0.1], [s * 0.55, 0.78, z + 0.1], 0.014, S.SM.hemp, Q.group, 4);   /* her gripes */
    S.rope([-0.55, 0.78, z + 0.1], [0.55, 0.78, z + 0.1], 0.014, S.SM.hemp, Q.group, 4);
  }
  wall(Q, 0, -2.35, 1.4, 4.4);
  const harness = cask(0.86, 0.3, S.SM.brass, 0x86643f);   /* the harness cask: the salt meat for the day, with brass hoops and a lid */
  solid1(Q, harness, 1.75, -4.5, 0.7, 0.7);
  cyl(0.25, 0.25, 0.03, S.SM.woodDark, 1.75, 0.875, -4.5, Q.group, 12);
  const mainHatch = S.hatch(1.3, 1.3, 0.42);
  solid1(Q, mainHatch, 0, 1.1, 1.4, 1.4);
  for (const s of [-1, 1]) {
    /* the pumps: an elm tube with an iron brake */
    cyl(0.09, 0.1, 0.8, S.SM.wood, s * 0.5, 0.4, MAIN + 0.75, Q.group, 8);
    S.spar([s * 0.5, 0.8, MAIN + 0.75], [s * 0.5, 1.0, MAIN + 1.35], 0.02, 0.02, S.SM.iron, Q.group);
  }
  wall(Q, 0, MAIN + 0.8, 1.3, 0.4);
  const butt = cask(0.95, 0.34);   /* the scuttle butt: the day's drinking water, lashed by the main shrouds */
  solid1(Q, butt, -2.05, 3.3, 0.72, 0.72);
  S.rope([-2.05, 0.6, 2.96], [-2.5, 0.6, 3.3], 0.014, S.SM.hemp, Q.group, 4);
  const dipper = bucket(0x8a6a48);
  dipper.scale.setScalar(0.7);
  add(Q, dipper, -1.55, 2.9);
  wall(Q, -1.55, 2.9, 0.3, 0.3);
  /* buckets and a swab by the starboard rail, coils flaked down along the deck */
  for (const [x, z] of [[2.25, -1.9], [2.3, -2.3]]) {
    const b = bucket(0x8a6a48);
    b.scale.setScalar(0.8);
    add(Q, b, x, z);
  }
  const swab = S.swab();
  swab.position.set(2.42, 0, 2.0);
  swab.rotation.x = -1.05;
  swab.rotation.y = 0.2;
  swab.position.y = 0.02;
  Q.group.add(swab);
  for (const [x, z, r] of [[2.2, 5.6, 0.26], [-2.1, -1.9, 0.24], [1.9, -6.2, 0.26], [-1.6, 7.9, 0.22], [2.1, 0.3, 0.22]]) add(Q, S.coil(r, 4), x, z);
  /* ---- aft: the companion to the cabin, the binnacle, the tiller, the taffrail ---- */
  solid1(Q, S.companion(1.0, 1.3, 0.95), 0.95, 5.15, 1.1, 1.4);
  wall(Q, 0.95, 6.1, 1.0, 0.5);   /* its doors stand open */
  solid1(Q, S.binnacle(), 0.3, 7.55, 1.0, 0.5);
  const tiller = grp();
  S.spar([0, 0.5, 9.05], [0, 0.98, 9.0], 0.1, 0.09, S.SM.woodDark, tiller);   /* the rudder head */
  S.spar([0, 0.95, 9.0], [0.12, 0.9, 8.05], 0.05, 0.03, S.SM.wood, tiller);
  for (const s of [-1, 1]) S.rope([0.12, 0.9, 8.2], [s * 1.6, 0.6, 8.35], 0.012, S.SM.hemp, tiller, 4);   /* lashed amidships: there is no wind to steer by */
  Q.group.add(tiller);
  wall(Q, 0.06, 8.6, 0.4, 1.0);
  /* a spyglass on the companion top */
  const glass = S.spyglass();
  add(Q, glass, 1.1, 5.0, 1.0, 0.5);

  /* ---- what the story changes ---- */
  /* a rope left in a heap by the fore mast, for Jem to coil down */
  const heap = dyn(S.tangle()),
    neat = dyn(S.coil(0.3, 4));
  add(Q, heap, -1.55, -5.5, 0, 0.4);
  add(Q, neat, -1.55, -5.5);
  wall(Q, -1.55, -5.5, 0.5, 0.5);
  Q.reveal.coil = (seen) => {
    heap.visible = !seen;
    neat.visible = seen;
  };
  /* the bell: it swings and sounds when you ring it */
  let bellT = 0,
    bellWas;
  Q.reveal.bell = (seen) => {
    if (seen && bellWas === false) {
      bellT = 2.4;
      if (sounds()) for (const d of [0, 0.42]) {
        tone(1320, 1310, 1.6, "sine", 0.05, 0, d);
        tone(2630, 2620, 0.8, "sine", 0.018, 0, d);
      }
    }
    bellWas = seen;
  };
  Q.tickers.push((t, dt) => {
    if (bellT <= 0) return;
    bellT -= dt;
    belfry.userData.bell.rotation.x = bellT > 0 ? Math.sin(bellT * 9) * 0.5 * (bellT / 2.4) : 0;
  });
  /* HM cutter Sparrow, in shore, and her boat pulling across. Fitton puts her about six miles off at dawn; she is drawn nearer so that she can be seen. */
  const sparrow = far(S.cutter("set"));
  sparrow.position.set(205, SEA + 1.5, -46);
  sparrow.rotation.y = -1.9;
  Q.group.add(sparrow);
  const gig = rowBoat({ L: 5.4, beam: 1.6, depth: 0.62, wood: BOATW(), timber: BOATT(), oars: "rowing", rudder: true, gear: false });
  dyn(gig);
  gig.traverse((o) => (o.userData.noAudit = true));
  /* her crew, seen far off: four at the oars and Mr Wylie in the stern. Plain shapes; they are hidden when the boat is near. */
  const crew = grp(gig);
  for (const [x, c] of [[-1.5, 0x26345a], [-0.5, 0xb8a888], [0.3, 0x9a4a3c], [1.1, 0xb8a888], [1.7, 0x5a6a80]]) {
    box(0.4, 0.5, 0.28, solid(c, 1), x, 0.82, 0, crew);
    mesh(new THREE.SphereGeometry(0.11, 8, 6), solid(x < -1 ? 0x18181a : 0xa87856, 1), x, 1.2, 0, crew);
  }
  crew.traverse((o) => {
    o.userData.noBatch = true;
    o.userData.noAudit = true;
  });
  Q.group.add(gig);
  const GIG = { p: 0.12, max: 0.3, from: [196, -40], to: [half(2.2) + 1.25, 2.2] };
  const placeGig = (t) => {
    const k = GIG.p,
      along = k >= 1,
      x = along ? GIG.to[0] : GIG.from[0] + (GIG.to[0] + 6 - GIG.from[0]) * k,
      z = along ? GIG.to[1] : GIG.from[1] + (GIG.to[1] - GIG.from[1]) * k;
    gig.position.set(x, SEA - 0.16 + Math.sin(t * 1.1) * 0.03, z);
    gig.rotation.y = along ? Math.PI / 2 : Math.atan2(-(GIG.to[1] - GIG.from[1]), GIG.to[0] - GIG.from[0]) + Math.PI;
    crew.visible = !along;
    if (!along) rowStroke(gig, t * 2.4, true);
    else rowStroke(gig, 0, false);
  };
  Q.tickers.push((t, dt) => {
    if (GIG.p < GIG.max) GIG.p = Math.min(GIG.max, GIG.p + dt * 0.004);
    placeGig(t);
  });
  placeGig(0);
  Q.reveal.sparrow = (seen) => (glass.visible = !seen);   /* you take the glass from the companion top */
  Q.reveal.boat = (seen) => {
    if (seen) GIG.p = 1;
  };
  /* the sharks: fins cutting the water round a dead bullock far off the port quarter, and two or three under the stern */
  const bull = S.bullock();
  bull.position.set(-46, SEA + 0.05, 44);
  bull.rotation.y = 0.6;
  bull.traverse((o) => {
    o.userData.noBatch = true;
    o.userData.noAudit = true;
  });
  Q.group.add(bull);
  const fins = [];
  for (let i = 0; i < 9; i++) {
    const near = i < 3,
      f = S.fin(near ? 1.1 : 0.8 + (i % 3) * 0.15);
    f.userData.c = near ? [-5.5, 12.5] : [-46, 44];
    f.userData.r = near ? 3.2 + i * 1.5 : 3.5 + (i % 4) * 2.4;
    f.userData.w = (near ? 0.22 : 0.3) * (i % 2 ? 1 : -1) * (1 + (i % 3) * 0.2);
    f.userData.ph = i * 1.9;
    Q.group.add(f);
    fins.push(f);
  }
  let bigOut = false;   /* the biggest shark leaves the water when it is caught */
  Q.tickers.push((t) => {
    bull.position.y = SEA + 0.02 + Math.sin(t * 0.9) * 0.05;
    for (const [i, f] of fins.entries()) {
      const u = f.userData,
        a = t * u.w + u.ph,
        dip = Math.sin(t * 0.23 + u.ph * 2.1);
      f.position.set(u.c[0] + Math.cos(a) * u.r, SEA - 0.06 + (dip > 0.55 ? -(dip - 0.55) * 1.6 : 0) + Math.sin(t * 1.3 + i) * 0.03, u.c[1] + Math.sin(a) * u.r * 0.8);
      f.rotation.y = -a + (u.w > 0 ? Math.PI : 0);
      f.visible = !(i === 0 && bigOut);
    }
  });
  /* the fishing line, made fast at the taffrail on the port quarter: slack until the shark has the hook, then bar tight */
  const CLEAT = [-1.25, 0.9, 9.12],
    line = unitRope(0.012);
  Q.group.add(line);
  box(0.26, 0.07, 0.09, S.SM.iron, CLEAT[0], 0.9, 9.1, Q.group);
  const hook = dyn(grp());
  mesh(new THREE.TorusGeometry(0.05, 0.009, 5, 10, Math.PI * 1.3), S.SM.iron, 0, 0, 0, hook);
  add(Q, hook, CLEAT[0], 9.1, 0.84);
  let taut = false,
    lineOn = false;
  Q.reveal.haul = (seen) => (taut = seen);
  Q.tickers.push((t) => {
    line.visible = lineOn && !film.on;
    if (!line.visible) return;
    const f = fins[0].position;
    if (taut) stretch(line, CLEAT, [f.x, SEA - 0.1, f.z]);
    else stretch(line, CLEAT, [CLEAT[0] - 0.9, SEA, CLEAT[2] + 2.6 + Math.sin(t * 0.8) * 0.15]);
  });
  /* the shark on the deck, on the port quarter, and the wall round it while it lies there */
  const shark = S.shark(3.4),
    REST = [-1.2, 0, 6.5, 0.1];
  shark.visible = false;
  add(Q, shark, REST[0], REST[2], 0, REST[3]);
  shark.rotation.z = 0.12;
  const sharkWall = [99, 99, 99, 99];
  Q.walls.push(sharkWall);
  const showShark = (on) => {
    shark.visible = on;
    shark.position.set(REST[0], 0, REST[2]);
    shark.rotation.set(0, REST[3], 0.12);
    sharkWall.splice(0, 4, ...(on ? [-1.85, 4.75, -0.6, 8.3] : [99, 99, 99, 99]));
    bigOut = on;
  };
  /* the bundle of papers that was inside: tied round with string, its outer wrapper spoiled, the papers within whole */
  const bundle = dyn(P.item("bundle"));
  bundle.visible = false;
  add(Q, bundle, -0.2, 6.2, 0.02, 0.3);
  Q.reveal.bundle = (seen) => (bundle.visible = seen && shark.visible);
  Q.enter = (stage) => {
    showShark(stage >= 20);
    lineOn = stage >= 13 && stage < 20;
    hook.visible = stage < 20;
    for (const id of ["sheet1", "sheet2", "sheet3"]) {
      const o = Q.items[id];
      if (o && o.parent === Q.group) o.visible = stage >= 23;
    }
    const pork = Q.items.pork;
    if (pork && pork.parent === Q.group && stage > 15) pork.visible = false;
    GIG.max = stage < 14 ? 0.3 : stage < 20 ? 0.5 : 0.86;
    GIG.p = stage < 14 ? 0.14 : stage < 20 ? Math.max(0.3, Math.min(GIG.p, 0.5)) : stage < 25 ? Math.max(0.6, Math.min(GIG.p, 0.86)) : 1;
    /* where the people are in each part of the morning */
    if (stage < 20) {
      stand(Q, "fitton", 0.9, 8.35, 0.4, 4);
      stand(Q, "cato", -1.5, 1.6, 1.6, 3.6);
    } else {
      stand(Q, "fitton", 0.6, 4.2, -0.2, 6.2);
      stand(Q, "cato", -0.35, 4.15, -1.2, 6);
    }
  };

  /* ---- the catch, as a camera scene: the line goes tight, all hands haul, the shark comes over the side ---- */
  const film = { on: false, homes: null, rope: unitRope(0.016), rope2: unitRope(0.016) };
  film.rope.visible = film.rope2.visible = false;
  Q.group.add(film.rope, film.rope2);
  const ROW = [[-1.25, 8.2], [-1.3, 7.1], [-1.35, 6.0], [-1.4, 4.9], [-1.45, 3.8]],
    ROUND = [[-0.7, 4.1], [-0.1, 5.0], [-0.15, 6.6], [-0.55, 8.65], [-1.3, 3.62]],   /* where the hands stand round the shark once it is on deck */
    _nose = new THREE.Vector3();
  const sm = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k));
  Q.films.catch = (t) => {
    const hands = [Q.people.find((n) => n.id === "fitton"), Q.people.find((n) => n.id === "cato"), ...Q.extras.slice(0, 3)].filter(Boolean);
    if (t < 0) {
      if (film.homes)
        hands.forEach((n, i) => {
          const h = film.homes[i];
          n.x = h[0];
          n.z = h[1];
          n.m.position.set(h[0], 0, h[1]);
          n.m.rotation.set(0, h[2], 0);
          (i < 2 ? Q.storyLife : Q.life).hold(n, false);
          n.ctl.rest?.();
        });
      film.homes = null;
      film.on = false;
      film.rope.visible = film.rope2.visible = false;
      showShark(false);
      return;
    }
    if (!film.homes) {
      film.homes = hands.map((n) => [n.x, n.z, n.m.rotation.y]);
      film.on = true;
      hands.forEach((n, i) => (i < 2 ? Q.storyLife : Q.life).hold(n, true));
      film.clip = "";
    }
    /* the hands: Mr Fitton at the taffrail from the start; the others come to the line when it goes tight */
    const hauling = t >= 5.5 && t < 20.5,
      clip = t < 5.5 ? "IdleM" : t < 20.5 ? "CarryIdle" : "Cheer";
    hands.forEach((n, i) => {
      const at = t >= 20.5 ? ROUND[i] : i === 0 || t >= 5.5 ? ROW[i] : film.homes[i];
      n.x = at[0];
      n.z = at[1];
      const heave = hauling ? Math.max(0, Math.sin(t * 2.6 - i * 0.25)) : 0;
      n.m.position.set(at[0], 0, at[1] - heave * 0.16);
      if (i === 0 || t >= 5.5) n.m.rotation.set(t < 20.5 ? -(heave * 0.2 + (hauling ? 0.06 : 0)) : 0, t < 20.5 ? 0 : face(at[0], at[1], REST[0], REST[2]), 0);
    });
    if (film.clip !== clip) {
      film.clip = clip;
      hands.forEach((n, i) => (i === 0 || t >= 5.5) && n.ctl.play(i === 0 && t < 5.5 ? "CarryIdle" : clip, true));
    }
    /* the shark: under the stern on the line, then up the side and over the rail, then down on the deck */
    const up = sm((t - 13.5) / 4.5),
      over = sm((t - 18) / 2.6),
      out = t >= 13.5;
    bigOut = out;
    shark.visible = out;
    const f = fins[0].position,
      rail = [-3.0, 1.0, 7.3];
    if (out) {
      const x = -3.25 + (REST[0] + 3.25) * over,
        y = SEA - 0.5 + (1.05 - SEA + 0.5) * up - 1.05 * over + Math.sin(over * Math.PI) * 0.35,
        z = 8.6 + (REST[2] - 8.6) * over;
      shark.position.set(x, y, z);
      shark.rotation.set((1 - up) * -0.9 + Math.sin(over * Math.PI) * 0.1, REST[3] + (1 - over) * 0.5, 0.12 + (1 - over) * 0.7 * Math.sin(up * Math.PI * 0.5));
    }
    /* the line: from the hands over the taffrail to the fish; a second part from the main boom end lifts it in */
    if (out) {
      shark.updateMatrixWorld();
      shark.localToWorld(_nose.set(0, 0.2, -1.6));   /* the hook is in its mouth */
    }
    const nose = out ? [_nose.x, _nose.y, _nose.z] : [f.x, SEA - 0.1, f.z];
    film.rope.visible = t < 19.5;
    film.rope2.visible = t >= 5.5 && t < 20.5;
    if (film.rope.visible) stretch(film.rope, t < 13.5 ? CLEAT : rail, nose);
    if (film.rope2.visible) stretch(film.rope2, [-1.3, 1.02, 3.6], t < 13.5 ? CLEAT : rail);
  };

  /* ---- people: each with something to do ---- */
  person(Q, "cato", "cato", -1.5, 1.6, face(-1.5, 1.6, 1.6, 3.6), { kind: "watch", at: [-40, 40], idles: ["IdleM"], react: ["HeadTurn", "Point", "LookAround"], every: [5, 9] });
  person(Q, "fitton", "fitton", 0.9, 8.35, face(0.9, 8.35, 0.4, 4), { kind: "watch", at: [-20, 30], idles: ["IdleM"], react: ["HeadTurn", "LookAround"], every: [6, 10] }, { hat: "cocked" });
  person(Q, "wylie", "wylie", 1.6, 6.9, face(1.6, 6.9, -1.0, 6.4), { kind: "watch", at: [-1.2, 6.5], idles: ["IdleM"], react: ["HeadTurn", "Shrug"], every: [6, 10] }, { hat: "cocked" });
  crowd(Q, "sp_seaman", 1.3, -7.0, face(1.3, -7.0, 8, -30), { kind: "watch", at: [10, -60], react: ["HeadTurn", "LookAround", "WipeSweat"], every: [5, 9] });
  crowd(Q, "sp_seaman2", -1.75, -1.65, face(-1.75, -1.65, -2.6, -1.9), { kind: "work", clips: ["PickUp", "IdleM", "WipeSweat"], work: [5, 9], face: [-2.6, -1.9] });
  crowd(Q, "sp_seaman3", -1.05, 0.5, Math.PI, { kind: "work", between: [[-1.05, 0.5], [-1.05, -2.35]], walk: "Walk", idle: "IdleM" });
  crowd(Q, "sp_seaman4", -1.0, -6.9, face(-1.0, -6.9, 0.6, -6.9), { kind: "chat", group: "fo", at: [-0.95, -6.85], ring: 0.4, turn: Math.PI / 2 });
  crowd(Q, "sp_docker", 0.75, -6.95, face(0.75, -6.95, -1, -6.9), { kind: "chat", group: "fo" });
  Q.keepOff = [{ at: [-1.2, 8.2], r: 0.9 }, { at: [0.35, 6.2], r: 0.8 }, { at: [1.25, 1.1], r: 0.8 }, { at: [1.3, -3.9], r: 0.8 }, { at: [-1.0, -4.9], r: 0.8 }, { at: [0.95, -6.0], r: 0.7 }, { at: [2.35, 2.2], r: 0.8 }, { pts: [[1.6, 3.6], [1.0, 2.4], [1.0, -3.6]], w: 0.5 }];
  return Q;
}

/* ---------- 2. The dockyard quay at Port Royal, September 1799 ---------- */
function quay() {
  const SEA = -1.1;
  const Q = base("quay", [-17, -1.55, 17, 10.6], [10, 6.4, Math.PI / 3]);
  Q.floor = "stone";
  Q.beds = { sea: 0.09, surf: 0.03, crowd: 0.05, wind: 0.05 };
  Q.light = { top: 0x4f9ed6, hor: 0xe6eee4, fog: [0xd8e6e6, 220, 1100], sun: [0xfff2d0, 2.6, -30, 60, 30], hemi: [0xffffff, 0x8aa0a0, 2.6] };
  Q.view = { pos: [12, 2.6, 8.4], look: [-2, 3, -8] };
  /* the ground: a quay of cut stone, the trodden sand of the yard behind it */
  ground(Q, std(T.sand([60, 60])), 700, 0, 352.5);
  /* dressed limestone flags in courses with mortar joints, flags about 0.6 to 1.1 m long and 0.6 m wide (a tile is 2.4 m square) */
  const paved = (rgb, rep, kind, seed) =>
    new THREE.MeshStandardMaterial({ map: T.setts(rgb, rep, kind, false, seed), bumpMap: T.setts(rgb, rep, kind, true, seed), bumpScale: 2.2, roughness: 0.92 });
  strip(Q, 70, 9.5, paved([178, 170, 152], [70 / 2.4, 9.5 / 2.4], "flags", 7), 0, 2.4, 0.012);
  /* the coping: long blocks, 1 m across, with a rounded arris at the water side, a lip standing proud of the wall face and a nosing */
  strip(Q, 70, 1.0, paved([160, 154, 140], [70 / 4.8, 1], "coping", 11), 0, -1.9, 0.02);
  const wallFace = paved([120, 116, 104], [70 / 2.6, 2.4 / 2.6], "ashlar", 5);
  box(70, 2.4, 0.7, wallFace, 0, -1.2, -2.35, Q.group);   /* the quay wall of coursed ashlar, down into the water */
  const copeFace = paved([150, 144, 130], [70 / 4.8, 1], "coping", 11);
  for (const [x0, x1] of [[-35, -11.5], [-8.9, 35]]) {   /* broken at the landing steps */
    const L = x1 - x0,
      cx = (x0 + x1) / 2;
    box(L, 0.3, 0.08, copeFace, cx, -0.16, -2.74, Q.group);
    const nose = cyl(0.05, 0.05, L, copeFace, cx, -0.02, -2.73, Q.group, 8);
    nose.rotation.z = Math.PI / 2;
  }
  /* iron mooring rings let into the wall under the coping, every few metres, each hanging from its staple */
  for (const x of [-30, -22, -16, -4, 3.4 - 6, 9.5, 17, 24, 31]) {
    box(0.1, 0.07, 0.08, S.SM.iron, x, -0.38, -2.82, Q.group);
    const ring = mesh(new THREE.TorusGeometry(0.12, 0.022, 6, 18), S.SM.iron, x, -0.53, -2.84, Q.group);
    ring.rotation.y = 0.25;
  }
  const sea = createSea(Q.group, { kind: "caribbean", y: SEA, at: [0, -150], swell: 0.5 });
  Q.tickers.push((t) => sea.tick && sea.tick(t));
  Q.walls.push([-40, -4, 40, -1.85]);
  /* far across the harbour: the low shore of Kingston, its roofs along the water, and the Blue Mountains behind */
  ranges(Q, [[700, 60, 150, 9, [0.34, 0.46, 0.36]], [800, 150, 190, 8, [0.42, 0.54, 0.56]], [860, 250, 230, 6, [0.56, 0.66, 0.74]]], Math.PI, 1.9, 9);
  const town = far(grp());
  box(520, 1.6, 30, solid(0xd8cfae, 1), 0, 0.2, 0, town);
  let k = 3;
  for (let x = -230; x < 230; x += 6 + (Math.abs(Math.sin(k * 7.7)) * 9)) {
    const w = 5 + Math.abs(Math.sin(k++ * 3.3)) * 8,
      h = 3 + Math.abs(Math.sin(k * 5.1)) * 4;
    box(w, h, 7, solid([0xe8e0c8, 0xd6c8a4, 0xc8b08a, 0xe4d8b8][k % 4], 1), x, 1 + h / 2, (k % 3) * 5 - 4, town);
    box(w + 0.6, 1.3, 7.6, solid([0x8a5a44, 0x6a5a4a, 0x94684c][k % 3], 1), x, 1 + h + 0.6, (k % 3) * 5 - 4, town);
  }
  for (let i = 0; i < 16; i++) {
    const p = palm(8 + (i % 4), i + 2);
    p.position.set(-220 + i * 29 + (i % 3) * 6, 1, 12);
    town.add(p);
  }
  town.position.set(40, SEA, -560);
  Q.group.add(town);
  /* the long spit of the Palisadoes running off to the east, low and green */
  const spit = box(700, 2.4, 40, solid(0xcdbf94, 1), 420, SEA + 0.2, 36, Q.group);
  spit.userData.far = true;
  for (let i = 0; i < 14; i++) {
    const p = far(palm(7 + (i % 3) * 1.5, i + 30));
    p.position.set(80 + i * 34 + (i % 4) * 7, SEA + 1.2, 34 + (i % 3) * 5);
    Q.group.add(p);
  }
  /* ---- the ships ---- */
  /* the brig Nancy alongside, deep in the water with her cargo still in her (a general picture of a merchant brig of about 125 tons) */
  const nancy = S.brig(PLANK(), { fb: 1.4, bul: 0.75 });
  nancy.rotation.y = Math.PI / 2;
  nancy.position.set(0, SEA + 1.4, -6.35);
  Q.group.add(nancy);
  /* her mooring lines to the bollards, the fenders, and the gang plank with a rope across it */
  for (const x of [-13, -6.5, 6.5, 13]) {
    const b = grp();
    cyl(0.17, 0.21, 0.72, S.SM.iron, 0, 0.36, 0, b, 10);
    cyl(0.24, 0.24, 0.08, S.SM.iron, 0, 0.72, 0, b, 10);
    solid1(Q, b, x, -1.45, 0.5, 0.5);
  }
  for (const [bx, sx] of [[-13, -11.2], [13, 11]]) S.rope([bx, 0.6, -1.665], [sx, 1.0, -4.3], 0.04, S.SM.hemp, Q.group, 6);
  for (const [bx, sx] of [[-6.5, -8.6], [6.5, 8.4]]) S.rope([bx, 0.6, -1.665], [sx, 0.95, -3.1], 0.04, S.SM.hemp, Q.group, 6);
  for (const x of [-5, 1, 6]) cyl(0.2, 0.2, 0.7, S.SM.hemp, x, -0.2, -2.78, Q.group, 8);   /* rope fenders on the quay wall */
  const plank = grp();
  box(0.9, 0.07, 2.6, S.SM.wood, 0, 0, 0, plank);
  for (let i = -3; i <= 3; i++) box(0.9, 0.03, 0.05, S.SM.woodDark, 0, 0.05, i * 0.36, plank);
  plank.position.set(3.4, 0.56, -2.75);
  plank.rotation.x = -0.42;
  Q.group.add(plank);
  for (const s of [-1, 1]) cyl(0.04, 0.05, 1.0, S.SM.woodDark, 3.4 + s * 0.55, 0.5, -1.62, Q.group, 6);
  S.rope([2.85, 0.92, -1.62], [3.95, 0.92, -1.62], 0.02, S.SM.hemp, Q.group, 5);
  wall(Q, 3.4, -1.6, 1.3, 0.3);
  /* the seal on her main hatch: a canvas cover drawn back, a rope across the battens and the red wax of the prize master's seal */
  const hz = -6.35,
    hy = SEA + 1.4 + 0.5;
  const sealG = dyn(grp());
  S.rope([-1.25, hy + 0.09, hz - 0.9], [1.25, hy + 0.09, hz + 0.9], 0.02, S.SM.hemp, sealG, 5);
  S.rope([-1.25, hy + 0.09, hz + 0.9], [1.25, hy + 0.09, hz - 0.9], 0.02, S.SM.hemp, sealG, 5);
  cyl(0.11, 0.11, 0.03, solid(0x9a1f1a, 0.5), 0, hy + 0.1, hz, sealG, 12);
  box(0.34, 0.012, 0.24, solid(0xe8ddc4, 1), 0, hy + 0.075, hz + 0.3, sealG);
  Q.group.add(sealG);
  const cover = dyn(box(2.5, 0.05, 2.3, solid(0x8f8468, 1), 0, hy + 0.13, hz, Q.group));
  cover.userData.noAudit = true;
  Q.reveal.hatch = (seen) => {
    cover.visible = !seen;
    sealG.visible = seen;
  };
  Q.reveal.nancy = () => {};
  /* HMS Abergavenny, the guard ship and flagship, at her moorings out in the harbour */
  const ab = far(S.twoDecker());
  ab.position.set(-92, SEA + 6.2, -150);
  ab.rotation.y = 1.15;
  Q.group.add(ab);
  /* she makes a signal when you look at her: a hoist of flags runs up (plain colours; no real signal is copied) */
  const hoist = dyn(grp());
  for (const [i, c] of [0xc8342c, 0xf0ead8, 0x2a4a8a, 0xe8c040].entries()) box(2.2, 1.5, 0.06, solid(c, 1, 0, { side: THREE.DoubleSide }), 0, -i * 1.7, 0, hoist);
  hoist.traverse((o) => {
    o.userData.noAudit = true;
    o.userData.far = true;
  });
  hoist.position.set(-92, SEA + 6.2 + 33, -150);
  hoist.rotation.y = 1.15;
  hoist.visible = false;
  Q.group.add(hoist);
  Q.reveal.abergavenny = (seen) => (hoist.visible = seen);
  /* a sheer hulk further up the harbour, and small craft: a wherry under way and a boat at the steps */
  const hulk = far(S.sheerHulk());
  hulk.position.set(120, SEA + 4.2, -130);
  hulk.rotation.y = -0.7;
  Q.group.add(hulk);
  const wherry = rowBoat({ L: 5.6, beam: 1.6, depth: 0.6, wood: BOATW(), timber: BOATT(), oars: "rowing", gear: false });
  dyn(wherry);
  wherry.traverse((o) => (o.userData.noAudit = true));
  Q.group.add(wherry);
  Q.tickers.push((t) => {
    const a = t * 0.02;
    wherry.position.set(-30 + Math.cos(a) * 46, SEA - 0.16, -62 + Math.sin(a) * 18);
    wherry.rotation.y = -a - Math.PI / 2 + Math.PI;
    rowStroke(wherry, t * 2.2, true);
  });
  const stepsBoat = rowBoat({ L: 5.2, beam: 1.6, depth: 0.62, wood: BOATW(), timber: BOATT(), oars: "shipped", gear: true });
  stepsBoat.position.set(-10.2, SEA - 0.16, -3.7);
  Q.group.add(dyn(stepsBoat));
  Q.tickers.push((t) => (stepsBoat.position.y = SEA - 0.16 + Math.sin(t * 0.9 + 1) * 0.03));
  S.rope([-10.2, 0.2, -1.9], [-8.6, SEA + 0.5, -3.3], 0.02, S.SM.hemp, Q.group, 5);
  for (let i = 0; i < 5; i++) box(2.4, 0.24, 0.36 + i * 0.3, std(T.stone([150, 144, 130], [2, 1]), 1), -10.2, -0.12 - i * 0.24, -2.88 - i * 0.15, Q.group);   /* the landing steps, down to the water */
  const flyGulls = gulls(Q.group, 6, [-20, -30], 12, 20, 4);
  Q.tickers.push((t) => flyGulls(t));
  let cryT = 5;
  Q.tickers.push((t, dt) => {
    if ((cryT -= dt) > 0 || !sounds()) return;
    cryT = 6 + Math.random() * 10;
    Math.random() < 0.55 ? gullCry() : noiseHit(700 + Math.random() * 300, 5, 0.1, 0.05, Math.random() - 0.5);
  });
  /* ---- the dockyard behind the quay ---- */
  const BRICK = std(T.stone([162, 96, 70], [9, 3]), 1),
    BRICK2 = std(T.stone([172, 150, 118], [7, 3]), 1);
  const store = (w, d, h, mat, doors) => {
    const g = grp();
    box(w, h, d, mat, 0, h / 2, 0, g);
    box(w + 0.3, 0.3, d + 0.3, solid(0xcfc6ac, 1), 0, 0.15, 0, g);
    const rf = W.hipRoof(w, d, 2.3, 0.5);
    rf.position.y = h;
    g.add(rf);
    for (const x of doors) {
      box(2.0, 2.7, 0.08, S.SM.woodDark, x, 1.35, -d / 2 - 0.03, g);
      mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.08, 14, 1, false, 0, Math.PI), S.SM.woodDark, x, 2.7, -d / 2 - 0.03, g).rotation.set(Math.PI / 2, 0, Math.PI / 2);
      box(0.06, 2.7, 0.1, S.SM.iron, x, 1.35, -d / 2 - 0.05, g);
    }
    for (let x = -w / 2 + 2; x < w / 2 - 1; x += 4) {
      if (doors.some((dx) => Math.abs(dx - x) < 1.6)) continue;
      const sw = W.shutterWindow(0.9, 1.2, 0.5);
      sw.position.set(x, h - 1.5, -d / 2 - 0.02);
      sw.rotation.y = Math.PI;
      g.add(sw);
    }
    return g;
  };
  add(Q, store(22, 8, 6.2, BRICK, [-6, 0, 6]), -3, 16.2);
  add(Q, store(12, 7, 4.6, BRICK2, [-2.5, 2.5]), 17.5, 15.6);
  add(Q, store(10, 7, 5.2, BRICK2, [0]), -22.5, 15.4);
  Q.walls.push([-40, 11.2, 40, 22]);
  /* the yard wall beyond, a gate, palms and the roofs of the town behind it */
  W.stoneBox(90, 2.6, 0.5, W.LIME, 0, 1.3, 23, Q.group);
  for (const [x, z, h, s] of [[-30, 20, 8, 3], [-13, 24.5, 9, 4], [9, 24.6, 7.5, 5], [27, 21, 8.5, 6], [36, 25, 9.5, 7], [-38, 26, 8.6, 8]]) add(Q, palm(h, s), x, z);
  for (const [x, w, h, c] of [[-26, 9, 4, 0xe0d6ba], [-8, 12, 5, 0xd6c6a0], [14, 10, 4.4, 0xe6dcc4], [32, 12, 5.4, 0xcdb894]]) {
    box(w, h, 7, solid(c, 1), x, h / 2, 30, Q.group);
    const rf = W.hipRoof(w, 7, 1.8, 0.4);
    rf.position.set(x, h, 30);
    Q.group.add(rf);
  }
  /* the capstan, with two of its bars shipped */
  solid1(Q, S.capstan(3), 9.2, 2.2, 1.3, 1.3);
  wall(Q, 9.2, 2.2, 3.4, 0.5);
  /* anchors laid in a row, spare spars on bearers, guns and shot waiting for a ship */
  for (const [i, z] of [5.6, 7.4, 9.2].entries()) {
    const a = S.anchor(2.6 - i * 0.2);
    a.position.set(-15.6, 0.02, z);
    a.rotation.y = Math.PI / 2 + 0.08 * i;
    Q.group.add(a);
  }
  wall(Q, -14.3, 7.4, 3.4, 5.2);
  solid1(Q, S.sparStack(10, 6), -5.5, 9.6, 10.2, 1.7);
  for (const [i, x] of [12.4, 13.3, 14.2].entries()) {
    const gb = S.gun(1.9, 1.35);
    gb.children.slice(2).forEach((c) => (c.visible = false));   /* the barrel only, on wooden skids */
    gb.position.set(x, -0.3, 8.8 + i * 0.05);
    Q.group.add(gb);
  }
  for (const z of [8.1, 9.6]) box(2.9, 0.14, 0.16, S.SM.woodDark, 13.3, 0.07, z, Q.group);
  wall(Q, 13.3, 8.8, 3.0, 2.9);
  const pile = grp();
  for (let l = 0; l < 3; l++) for (let i = 0; i < 3 - l; i++) for (let j = 0; j < 3 - l; j++) mesh(new THREE.SphereGeometry(0.075, 8, 6), S.SM.gun, (i - (2 - l) / 2) * 0.15, 0.075 + l * 0.115, (j - (2 - l) / 2) * 0.15, pile);
  solid1(Q, pile, 15.4, 7.2, 0.6, 0.6);
  /* a wooden crane at the quay edge: a post, a jib braced from below and a windlass with its fall */
  const crane = grp();
  box(0.4, 5.2, 0.4, S.SM.woodDark, 0, 2.6, 0, crane);
  box(1.6, 0.3, 1.6, S.SM.woodDark, 0, 0.15, 0, crane);
  S.spar([0, 4.9, 0], [0, 5.9, -3.6], 0.16, 0.12, S.SM.woodDark, crane);
  S.spar([0, 2.4, 0], [0, 5.5, -2.2], 0.11, 0.1, S.SM.woodDark, crane);
  for (const s of [-1, 1]) S.spar([s * 0.7, 0.3, 0.5], [0, 2.6, 0], 0.09, 0.08, S.SM.woodDark, crane);
  const drum = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.7, 8), S.SM.wood, 0, 1.2, 0.36, crane);
  drum.rotation.z = Math.PI / 2;
  S.rope([0, 1.3, 0.36], [0, 5.85, -3.5], 0.02, S.SM.hemp, crane, 5);
  S.rope([0, 5.85, -3.5], [0, 2.5, -3.5], 0.02, S.SM.hemp, crane, 5);
  cyl(0.04, 0.02, 0.3, S.SM.iron, 0, 2.36, -3.5, crane, 6);
  solid1(Q, crane, -16.2, 0.2, 1.7, 1.7);
  /* cargo and stores: casks on their ends and on their sides, crates, sacks, a cart, the coils of a cable */
  for (const [x, z] of [[5.2, 8.8], [6.0, 9.3], [5.5, 9.8], [6.5, 8.6], [-11.0, 2.6], [-10.2, 3.1]]) solid1(Q, cask(0.95, 0.34), x, z, 0.75, 0.75);
  for (const [x, z] of [[7.5, 9.4], [8.6, 9.4]]) {
    const c = cask(1.0, 0.36);
    c.rotation.z = Math.PI / 2;
    c.position.set(x + 0.5, 0.36, z);
    Q.group.add(c);
    for (const s of [-1, 1]) box(0.12, 0.1, 0.16, S.SM.woodDark, x + s * 0.25, 0.05, z - 0.3, Q.group);
  }
  wall(Q, 8.55, 9.4, 2.3, 0.8);
  for (const [x, z, s, ry] of [[1.6, 9.5, 0.7, 0.2], [2.4, 9.7, 0.6, -0.1], [1.9, 9.55, 0.5, 0.5]]) {
    const c = crate(s);
    add(Q, c, x, z, x === 1.9 ? 0.56 : 0, ry);
  }
  wall(Q, 2.0, 9.6, 1.7, 0.9);
  for (const [x, z, ry] of [[-1.0, 0.2, 0.3], [-0.5, 0.5, 1.2], [-1.3, 0.75, 2.2]]) add(Q, sack(), x, z, 0, ry);
  wall(Q, -0.9, 0.5, 1.2, 0.9);
  solid1(Q, cart(2.6, 1.4), 13.2, 4.4, 3.0, 1.9, 0.2);
  const cable = S.coil(0.6, 4);
  cable.scale.setScalar(1.6);
  solid1(Q, cable, -7.2, 5.2, 2.0, 2.0);
  /* people */
  person(Q, "ben", "ben", 3.2, 2.4, face(3.2, 2.4, 9, 6), { kind: "watch", at: [0, -6], idles: ["IdleM"], react: ["HeadTurn", "WipeSweat"], every: [5, 9] });
  person(Q, "fitton", "fitton", 5.6, 5.3, face(5.6, 5.3, 2, 2), { kind: "watch", at: [-60, -120], idles: ["IdleM"], react: ["HeadTurn", "LookAround"], every: [6, 10] }, { hat: "cocked" });
  crowd(Q, "sp_docker", -9.4, 6.9, Math.PI / 2, { kind: "work", between: [[-9.4, 6.9], [-3.2, 7.6]], walk: "Walk", idle: "IdleM" });
  crowd(Q, "sp_docker2", 10.9, 3.0, face(10.9, 3.0, 9.2, 2.2), { kind: "work", clips: ["PickUp", "WipeSweat", "IdleM"], work: [5, 9], face: [9.2, 2.2] });
  crowd(Q, "sp_seaman2", 7.9, 3.4, face(7.9, 3.4, 9.2, 2.2), { kind: "work", clips: ["IdleM", "PickUp", "LookAround"], work: [6, 10], face: [9.2, 2.2] });
  crowd(Q, "sp_briggs", -3.6, 2.9, face(-3.6, 2.9, -2, -6), { kind: "chat", group: "claim", at: [-3.1, 2.4] });
  crowd(Q, "sp_merchant", -2.6, 2.1, face(-2.6, 2.1, -3.6, 2.9), { kind: "chat", group: "claim" });
  crowd(Q, "sp_seaman3", 12.6, 6.6, 0, { kind: "wander", area: [9.5, 5.6, 16, 7.4] });
  crowd(Q, "sp_seaman", -12.2, 1.2, face(-12.2, 1.2, -60, -120), { kind: "watch", at: [-60, -120], react: ["HeadTurn", "Point", "LookAround"], every: [5, 9] });
  Q.keepOff = [{ at: [-1.5, -1.2], r: 1 }, { at: [0.8, -1.2], r: 1 }, { at: [-11.6, -0.9], r: 1 }, { at: [-9.0, -1.0], r: 1 }, { pts: [[10, 6.4], [3.2, 3.4]], w: 1.2 }, { at: [6.2, 5.0], r: 0.9 }];
  return Q;
}

/* ---------- 3. The Court of Vice-Admiralty, Kingston, autumn 1799 ---------- */
let _arms, _sash, _panel, _baize;
/* a carved and painted board in the shape of the royal arms: a crowned shield between a lion and a unicorn. A plain picture of the kind of board
   every court of the time hung over the bench; its quarters are not drawn in detail. */
function royalArms() {
  _arms =
    _arms ||
    cv(256, 256, (x, W, H) => {
      x.clearRect(0, 0, W, H);
      x.fillStyle = "#2a2018";
      x.beginPath();
      x.ellipse(128, 132, 122, 116, 0, 0, 7);
      x.fill();
      x.strokeStyle = "#c9a43c";
      x.lineWidth = 6;
      x.stroke();
      /* the shield, in four quarters */
      const q = ["#a8281f", "#c9a43c", "#27408a", "#a8281f"];
      for (let i = 0; i < 4; i++) {
        x.fillStyle = q[i];
        x.fillRect(96 + (i % 2) * 32, 92 + ((i / 2) | 0) * 38, 32, 38);
      }
      x.fillStyle = "#2a2018";
      x.beginPath();
      x.moveTo(96, 150);
      x.lineTo(96, 170);
      x.lineTo(110, 170);
      x.quadraticCurveTo(100, 168, 96, 150);
      x.moveTo(160, 150);
      x.lineTo(160, 170);
      x.lineTo(146, 170);
      x.quadraticCurveTo(156, 168, 160, 150);
      x.fill();
      x.strokeStyle = "#e6c860";
      x.lineWidth = 3;
      x.strokeRect(96, 92, 64, 76);
      /* the crown */
      x.fillStyle = "#c9a43c";
      x.fillRect(104, 66, 48, 16);
      for (let i = 0; i < 5; i++) {
        x.beginPath();
        x.arc(108 + i * 10, 62, 5, 0, 7);
        x.fill();
      }
      x.fillStyle = "#a8281f";
      x.fillRect(108, 70, 40, 7);
      /* the lion (gold) and the unicorn (white), standing to the shield */
      const beast = (cx, col, dir) => {
        x.fillStyle = col;
        x.beginPath();
        x.ellipse(cx, 138, 15, 34, dir * 0.25, 0, 7);
        x.fill();
        x.beginPath();
        x.arc(cx + dir * 6, 96, 13, 0, 7);
        x.fill();
        x.fillRect(cx - 12, 164, 9, 26);
        x.fillRect(cx + 4, 164, 9, 26);
        x.fillRect(cx + dir * 8, 118, dir * 22, 7);
      };
      beast(62, "#c9a43c", 1);
      beast(194, "#e8e2d0", -1);
      x.strokeStyle = "#e8e2d0";
      x.lineWidth = 3;
      x.beginPath();
      x.moveTo(190, 86);
      x.lineTo(180, 62);
      x.stroke();
      /* the ribbon under them */
      x.fillStyle = "#d8cfae";
      x.fillRect(52, 196, 152, 16);
    });
  const g = grp(),
    m = new THREE.MeshStandardMaterial({ map: _arms, transparent: true, alphaTest: 0.5, roughness: 0.7 });
  box(1.5, 1.5, 0.05, S.SM.woodDark, 0, 0, -0.03, g);
  plane(1.46, 1.46, m, 0, 0, 0.002, g);
  return g;
}
/* a tall sash window seen from inside: glazing bars against the bright street, a deep reveal, a sill, and louvred shutters folded back */
function sash(w = 1.3, h = 2.4) {
  _sash =
    _sash ||
    cv(128, 256, (x, W, H) => {
      const g = x.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#cfe6f2");
      g.addColorStop(0.62, "#f4f0dc");
      g.addColorStop(0.63, "#c9c2a0");
      g.addColorStop(1, "#b7ab86");
      x.fillStyle = g;
      x.fillRect(0, 0, W, H);
      x.fillStyle = "rgba(120,150,110,.55)";
      x.beginPath();
      x.arc(30, 150, 40, 0, 7);
      x.arc(100, 160, 34, 0, 7);
      x.fill();
      x.fillStyle = "#efe8d4";
      for (let i = 0; i <= 3; i++) x.fillRect(i * 41.5, 0, 4, H);
      for (let j = 0; j <= 6; j++) x.fillRect(0, j * 42, W, j === 3 ? 7 : 4);
    });
  const g = grp();
  plane(w, h, new THREE.MeshBasicMaterial({ map: _sash }), 0, 0, 0.0, g);
  for (const s of [-1, 1]) {
    box(0.09, h + 0.2, 0.2, S.SM.white, s * (w / 2 + 0.045), 0, 0.08, g);
    /* jalousie shutters, folded back against the wall */
    const sh = box(w / 2, h, 0.04, solid(0x3f5a4a, 0.9), s * (w / 2 + 0.1 + w / 4), 0, 0.06, g);
    void sh;
    for (let y = -h / 2 + 0.12; y < h / 2; y += 0.14) box(w / 2 - 0.08, 0.02, 0.06, solid(0x2f463a, 0.9), s * (w / 2 + 0.1 + w / 4), y, 0.07, g);
  }
  box(w + 0.2, 0.1, 0.2, S.SM.white, 0, h / 2 + 0.05, 0.08, g);
  box(w + 0.3, 0.08, 0.3, S.SM.white, 0, -h / 2 - 0.04, 0.12, g);
  return g;
}
const panelMat = () =>
  _panel ||
  (_panel = std(
    cv(256, 128, (x, W, H) => {
      x.fillStyle = "#5a4030";
      x.fillRect(0, 0, W, H);
      for (let i = 0; i < 2; i++) {
        x.fillStyle = "#4a3326";
        x.fillRect(i * 128 + 12, 14, 104, 100);
        x.fillStyle = "#6a4c38";
        x.fillRect(i * 128 + 18, 20, 92, 88);
        x.strokeStyle = "rgba(20,12,8,.5)";
        x.lineWidth = 2;
        x.strokeRect(i * 128 + 18, 20, 92, 88);
      }
      x.fillStyle = "rgba(255,230,190,.08)";
      x.fillRect(0, 0, W, 6);
    }),
    0.75,
  ));
const panel = (w, h, rep) => {
  const m = panelMat().clone();
  m.map = m.map.clone();
  m.map.repeat.set(rep || Math.max(1, Math.round(w / 1.6)), 1);
  m.map.needsUpdate = true;
  void h;
  return m;
};
function court() {
  const X = 6.5,
    Z = 4.5,
    H = 4.2;
  const Q = base("court", [-X + 0.4, -Z + 0.4, X - 0.4, Z - 0.4], [0.6, 3.7, 0.15]);   /* in the aisle between the public benches */
  Q.floor = "wood";
  Q.indoor = true;
  Q.beds = { room: 0.07, crowd: 0.04 };
  Q.light = { top: 0x8fb4c6, hor: 0xe6dcc0, fog: [0xd6d2c0, 40, 200], sun: [0xfff0d0, 1.3, 10, 30, 10], hemi: [0xfff8ea, 0x9a8f7a, 2.5], fill: 1.5 };
  Q.view = { pos: [4.6, 2.2, 3.6], look: [-1.2, 1.4, -3] };
  const wallM = std(T.plaster([226, 218, 196], [3, 1]), 1);
  Q.group.add(W.room({ x0: -X, z0: -Z, x1: X, z1: Z, h: H, floor: std(T.plank([128, 98, 68], 9, [4, 3]), 0.85), ceiling: solid(0xe8e2d0, 1), beams: false }));
  for (const [a, b, c, d] of [[-X, -Z, X, -Z], [X, Z, -X, Z], [-X, Z, -X, -Z], [X, -Z, X, Z]]) W.wallRun(Q.group, [a, b, c, d], H, wallM, [], 0.4);
  Q.walls.push([-X - 0.2, -Z - 0.2, X + 0.2, -Z + 0.2], [-X - 0.2, Z - 0.2, X + 0.2, Z + 0.2], [-X - 0.2, -Z - 0.2, -X + 0.2, Z + 0.2], [X - 0.2, -Z - 0.2, X + 0.2, Z + 0.2]);
  /* a panelled dado round the room, a moulded rail above it, a cornice under the ceiling, and beams across */
  for (const [x, z, w, ry] of [[0, -Z + 0.22, 2 * X - 0.4, 0], [0, Z - 0.22, 2 * X - 0.4, Math.PI], [-X + 0.22, 0, 2 * Z - 0.4, Math.PI / 2], [X - 0.22, 0, 2 * Z - 0.4, -Math.PI / 2]]) {
    const d = box(w, 1.15, 0.05, panel(w, 1.15), 0, 0.575, 0, grp());
    const g = d.parent;
    box(w, 0.07, 0.09, S.SM.woodDark, 0, 1.18, 0.01, g);
    box(w, 0.14, 0.07, S.SM.woodDark, 0, 0.07, 0.01, g);
    box(w, 0.16, 0.12, solid(0xf0ead8, 1), 0, H - 0.08, 0.03, g);
    add(Q, g, x, z, 0, ry);
  }
  for (const x of [-4.4, -2.2, 0, 2.2, 4.4]) box(0.18, 0.2, 2 * Z - 0.4, solid(0xd8d0b8, 1), x, H - 0.1, 0, Q.group);
  /* tall sash windows down both sides and either side of the bench; the double door at the back */
  for (const z of [-2.2, 0.6, 3.0]) {
    add(Q, sash(), -X + 0.205, z, 2.55, Math.PI / 2);
    add(Q, sash(), X - 0.205, z, 2.55, -Math.PI / 2);
  }
  for (const x of [-4.6, 4.6]) add(Q, sash(1.2, 2.2), x, -Z + 0.205, 2.6, 0);
  add(Q, W.makeDoor({ w: 1.5, h: 2.5, kind: "six", leaves: 2, color: 0x2f3b33, frame: 0xe2d9c2, handle: "knob" }), 0, Z - 0.21, 0, Math.PI);
  /* ---- the bench: a raised floor across the end of the room, a panelled front, the judge's chair under a canopy, the royal arms above.
     The judge is not named in any source found, so the chair is empty. ---- */
  const dais = grp();
  box(7.4, 0.42, 1.9, S.SM.woodDark, 0, 0.21, 0, dais);
  box(7.5, 0.05, 2.0, S.SM.wood, 0, 0.43, 0, dais);
  box(1.6, 0.21, 0.5, S.SM.woodDark, -3.0, 0.105, 1.2, dais);   /* the step up */
  box(4.6, 1.2, 0.09, panel(4.6, 1.2, 3), 0, 1.05, 0.62, dais);
  box(4.8, 0.07, 0.6, S.SM.woodDark, 0, 1.68, 0.4, dais);   /* the desk top */
  for (const s of [-1, 1]) box(0.09, 1.2, 0.6, panel(0.6, 1.2, 1), s * 2.3, 1.05, 0.36, dais);
  /* the chair: a tall back with a carved top, red leather seat */
  box(0.7, 0.5, 0.62, S.SM.woodDark, 0, 0.7, -0.35, dais);
  box(0.62, 0.08, 0.56, solid(0x7a2a24, 0.7), 0, 0.98, -0.34, dais);
  box(0.7, 1.4, 0.1, S.SM.woodDark, 0, 1.68, -0.64, dais);
  box(0.5, 0.9, 0.03, solid(0x7a2a24, 0.7), 0, 1.6, -0.585, dais);
  mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.1, 12, 1, false, 0, Math.PI), S.SM.woodDark, 0, 2.38, -0.64, dais).rotation.set(Math.PI / 2, 0, Math.PI / 2);
  for (const s of [-1, 1]) box(0.08, 0.3, 0.5, S.SM.woodDark, s * 0.36, 1.12, -0.36, dais);
  /* the canopy and its back board */
  box(2.2, 2.3, 0.06, panel(2.2, 2.3, 2), 0, 2.4, -0.86, dais);
  box(2.5, 0.14, 1.0, S.SM.woodDark, 0, 3.6, -0.44, dais);
  box(2.6, 0.1, 1.1, solid(0xc9a43c, 0.5, 0.4), 0, 3.7, -0.44, dais);
  for (const s of [-1, 1]) cyl(0.06, 0.07, 3.1, S.SM.woodDark, s * 1.15, 2.0, 0.0, dais, 8);
  const arms = royalArms();
  arms.position.set(0, 3.0, -0.82);
  arms.scale.setScalar(0.72);
  dais.add(arms);
  /* on the desk: an inkstand, a quill, a sand box, a bell, two books */
  cyl(0.05, 0.06, 0.07, S.SM.lead, -0.6, 1.75, 0.4, dais, 8);
  S.spar([-0.6, 1.78, 0.4], [-0.5, 2.02, 0.3], 0.006, 0.02, S.SM.white, dais);
  cyl(0.04, 0.04, 0.06, S.SM.brass, -0.4, 1.745, 0.45, dais, 8);
  for (const [x, c] of [[0.7, 0x4a2f24], [0.74, 0x2f3b4a]]) box(0.26, 0.05, 0.34, solid(c, 0.8), x, 1.74 + (c === 0x2f3b4a ? 0.05 : 0), 0.4, dais).rotation.y = 0.2;
  solid1(Q, dais, 0, -Z + 1.2, 7.6, 2.1);
  wall(Q, -3.0, -Z + 2.4, 1.6, 0.5);
  /* ---- the clerk's table under the bench: ledgers, an inkstand, a candle; and the registrar's stool ---- */
  const ct = P.table(2.0, 0.8, 0.78);
  solid1(Q, ct, -2.6, -1.45, 2.1, 0.9);
  for (const [x, z, ry] of [[-3.2, -1.5, 0.1], [-2.9, -1.35, -0.3]]) {
    const l = P.ledger();
    l.traverse((o) => (o.userData.noBatch = false));
    add(Q, l, x, z, 0.81, ry);
  }
  cyl(0.05, 0.06, 0.07, S.SM.lead, -2.1, 0.845, -1.5, Q.group, 8);
  S.spar([-2.1, 0.86, -1.5], [-2.0, 1.1, -1.6], 0.006, 0.02, S.SM.white, Q.group);
  add(Q, W.candle(true), -1.85, -1.2, 0.81);
  add(Q, W.chair(), -2.6, -2.15, 0, 0);
  wall(Q, -2.6, -2.15, 0.5, 0.5);
  /* ---- the table for the papers, covered in green cloth: the sealed papers on one side, the shark's papers on the other ---- */
  _baize = _baize || solid(0x2f5a40, 1);
  const tb = P.table(3.4, 1.0, 0.76);
  box(3.5, 0.03, 1.1, _baize, 0, 0.8, 0, tb);
  for (const s of [-1, 1]) box(3.5, 0.2, 0.012, _baize, 0, 0.7, s * 0.55, tb);
  solid1(Q, tb, 0, 0.1, 3.6, 1.15);
  const sealed = grp();
  box(0.32, 0.05, 0.23, solid(0xe8ddc4, 1), 0, 0.025, 0, sealed);
  box(0.33, 0.006, 0.03, solid(0x7a2a24, 1), 0, 0.053, 0, sealed);
  box(0.03, 0.006, 0.24, solid(0x7a2a24, 1), 0, 0.053, 0, sealed);
  cyl(0.03, 0.03, 0.012, solid(0x9a1f1a, 0.5), 0, 0.058, 0, sealed, 10);
  add(Q, sealed, -1.25, 0.1, 0.83, 0.1);
  const open1 = P.sheet("AMERICAN BRIG NANCY", 0.34, 0.24);
  open1.position.set(-0.75, 0.83, 0.12);
  open1.rotation.y = -0.1;
  open1.visible = false;
  Q.group.add(open1);
  Q.reveal.false = (seen) => (open1.visible = seen);
  const open2 = P.sheet("Mr. Christopher Schultz", 0.34, 0.24);
  open2.position.set(0.75, 0.83, 0.12);
  open2.rotation.y = 0.12;
  open2.visible = false;
  Q.group.add(open2);
  Q.reveal.real = (seen) => (open2.visible = seen);
  /* an inkstand and a candle on the table, a chair at each end */
  add(Q, W.candle(true), 0, -0.2, 0.83);
  for (const s of [-1, 1]) {
    add(Q, W.chair(), s * 2.25, 0.1, 0, (-s * Math.PI) / 2);
    wall(Q, s * 2.25, 0.1, 0.5, 0.5);
  }
  /* ---- the jaws: sent in by Mr Fitton, with his note. The words on the label are his own. ---- */
  const jaws = grp();
  box(0.7, 0.95, 0.5, panel(0.7, 0.95, 1), 0, 0.475, 0, jaws);
  box(0.8, 0.05, 0.6, S.SM.woodDark, 0, 0.975, 0, jaws);
  const arc = (r, y, tilt) => {
    const t = mesh(new THREE.TorusGeometry(r, 0.03, 6, 18, Math.PI * 1.25), S.SM.bone, 0, y, 0, jaws);
    t.rotation.set(tilt, 0, -Math.PI * 0.125 - Math.PI / 2 + Math.PI);
    t.scale.set(1, 1.15, 1);
    return t;
  };
  arc(0.3, 1.36, 0.0);
  arc(0.27, 1.34, 0.0).rotation.z += Math.PI;
  for (let i = 0; i < 13; i++) {
    const a = Math.PI * 0.19 + (i / 12) * Math.PI * 0.62;
    for (const [s, r] of [[1, 0.3], [-1, 0.27]]) {
      const tth = mesh(new THREE.ConeGeometry(0.018, 0.055, 4), S.SM.white, Math.cos(a) * r * 0.93, 1.35 + s * Math.sin(a) * r * 1.15 * 0.9, 0.012, jaws);
      tth.rotation.z = s > 0 ? Math.PI : 0;
      tth.rotation.z += (Math.cos(a) * s * -0.6);
    }
  }
  const lab = P.label("for a collar for neutrals to swear through", 0.66, 0.11, "#e8ddc4", "#2b2620", "italic");
  lab.position.set(0, 0.72, 0.252);
  jaws.add(lab);
  const lab2 = P.label("Lieut. Fitton recommends these jaws", 0.66, 0.11, "#e8ddc4", "#2b2620", "italic");
  lab2.position.set(0, 0.84, 0.252);
  jaws.add(lab2);
  solid1(Q, jaws, -X + 0.62, 1.0, 0.6, 0.8, Math.PI / 2);
  Q.reveal.jaws = () => {};
  /* ---- the bar: a rail of turned balusters across the room with a gate in the middle; benches for the public behind it ---- */
  for (const s of [-1, 1]) {
    const len = X - 0.4 - 0.7,
      cx = s * (0.7 + len / 2);
    box(len, 0.07, 0.12, S.SM.woodDark, cx, 0.98, 1.75, Q.group);
    box(len, 0.06, 0.1, S.SM.woodDark, cx, 0.08, 1.75, Q.group);
    for (let x = 0.75; x < X - 0.45; x += 0.24) cyl(0.022, 0.03, 0.86, S.SM.wood, s * x, 0.53, 1.75, Q.group, 6);
    box(0.12, 1.08, 0.12, S.SM.woodDark, s * 0.7, 0.54, 1.75, Q.group);
    wall(Q, cx, 1.75, len, 0.2);
  }
  const gate = box(0.62, 0.8, 0.05, panel(0.62, 0.8, 1), 0.97, 0.52, 2.08, Q.group);   /* the gate, standing open */
  gate.rotation.y = Math.PI / 2;
  const BEN = [[-3.2, 2.75], [3.2, 2.75], [-3.2, 3.7], [3.2, 3.7]];
  for (const [x, z] of BEN) {
    solid1(Q, W.bench(3.6), x, z, 3.7, 0.42);
    box(3.6, 0.5, 0.04, S.SM.woodDark, x, 0.72, z + 0.2, Q.group);   /* a back rail */
  }
  /* shelves of law books, a clock, hats and a coat on pegs, candles in sconces */
  const shelf = grp();
  box(1.7, 2.3, 0.34, S.SM.woodDark, 0, 1.15, 0, shelf);
  for (let r = 0; r < 4; r++) {
    box(1.56, 0.44, 0.02, new THREE.MeshBasicMaterial({ color: 0x1a1410 }), 0, 0.45 + r * 0.52, 0.165, shelf);
    for (let i = 0; i < 12; i++) box(0.1, 0.34 + ((i * 7 + r) % 3) * 0.03, 0.2, solid([0x5a3324, 0x3a2a22, 0x6a4a2e, 0x2f3b33, 0x4a2f24][(i + r * 2) % 5], 0.8), -0.68 + i * 0.124, 0.42 + r * 0.52, 0.09, shelf);
  }
  shelf.scale.x = 0.66;   /* it fits between the two window frames */
  solid1(Q, shelf, X - 0.6, -0.8, 0.5, 1.2, -Math.PI / 2);
  const clock = grp();
  box(0.5, 0.5, 0.12, S.SM.woodDark, 0, 0, 0, clock);
  plane(0.4, 0.4, new THREE.MeshBasicMaterial({ map: T.clock() }), 0, 0, 0.065, clock);
  box(0.24, 0.7, 0.1, S.SM.woodDark, 0, -0.58, 0, clock);
  add(Q, clock, X - 0.26, 1.8, 2.6, -Math.PI / 2);
  add(Q, W.hungCoat(0x2a3050), -X + 0.24, 3.5, 0, Math.PI / 2);
  for (const [x, z, ry] of [[-X + 0.3, -0.8, Math.PI / 2], [X - 0.3, 3.9, -Math.PI / 2], [-2.2, -Z + 0.3, 0], [2.2, -Z + 0.3, 0]]) {
    const sc = grp();
    box(0.14, 0.2, 0.03, S.SM.brass, 0, 0, 0, sc);
    box(0.03, 0.03, 0.2, S.SM.brass, 0, -0.06, 0.1, sc);
    const cd = W.candle(true);
    cd.position.set(0, -0.07, 0.2);
    sc.add(cd);
    add(Q, sc, x, z, 2.1, ry);
  }
  /* Mr Fitton's box, open on a stool inside the bar: the shark's papers are carried from it to the table */
  const stool = grp();
  box(0.5, 0.05, 0.4, S.SM.woodDark, 0, 0.5, 0, stool);
  for (const x of [-0.2, 0.2]) for (const z of [-0.15, 0.15]) box(0.04, 0.5, 0.04, S.SM.woodDark, x, 0.25, z, stool);
  solid1(Q, stool, 4.3, 0.9, 0.55, 0.45);
  /* people */
  person(Q, "clerk", "clerk", -3.6, -0.5, face(-3.6, -0.5, 2, 2), { kind: "watch", at: [0, 0.1], idles: ["IdleM"], react: ["HeadTurn", "Nod"], every: [5, 9] }, { held: "ledger" });
  person(Q, "fitton", "fitton", 3.5, -0.6, face(3.5, -0.6, 0, 1), { kind: "watch", at: [0, 0.1], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  const sit = (look, bi, dx) => crowd(Q, look, BEN[bi][0] + dx, BEN[bi][1], Math.PI, { kind: "sit", seat: { top: 0.475, x: BEN[bi][0] + dx, z: BEN[bi][1], ry: Math.PI }, clips: ["SitIdle", "SitIdle2"], group: "pub" + bi });
  sit("sp_merchant", 0, 0.9);
  sit("sp_merchant2", 0, -0.2);
  sit("sp_seaman4", 3, -0.6);
  crowd(Q, "sp_seaman", 5.2, -1.9, face(5.2, -1.9, 0, 0.1), { kind: "watch", at: [0, 0.1], react: ["HeadTurn", "LookAround"], every: [6, 10] });
  crowd(Q, "sp_seaman3", -5.65, 2.25, face(-5.65, 2.25, -5.9, 1.0), { kind: "watch", at: [-5.9, 1.0], react: ["HeadTurn", "Point", "Shrug"], every: [6, 10] });
  Q.keepOff = [{ at: [-1.2, 0.95], r: 0.8 }, { at: [1.2, 0.95], r: 0.8 }, { at: [-5.0, 1.0], r: 0.8 }, { at: [3.8, 1.2], r: 0.7 }, { pts: [[0.6, 3.7], [0, 1.75], [-3.0, 0.4]], w: 0.8 }];
  return Q;
}

const builders = { deck, quay, court };
export const PLACE_IDS = Object.keys(builders);
export function buildPlace(id, opts = {}) {
  const Q = builders[id](opts);
  for (const [, t] of Object.entries(TASKS).filter(([, t]) => t.place === id)) {
    if (Q.items[t.item]) continue;
    const o = P.item(t.item),
      at = t.start;
    add(Q, o, at[0], at[2], at[1], at[3] || 0);
    Q.items[t.item] = o;
  }
  Q.itemStarts = Object.fromEntries(Object.entries(Q.items).map(([id, o]) => [id, { at: o.position.toArray(), scale: o.scale.toArray(), ry: o.rotation.y }]));
  return Q;
}
export function mergePlace(Q) {
  batchStatic(Q.group);
}
