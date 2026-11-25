/* The places of the story: Maima on its hill above St Ann's Bay (by day, and at night for the eclipse), the shore of the bay with the two
   caravels aground, the open sea of the crossing (a camera scene only) and Seville Heritage Park in 2026. What follows a source and what is
   still a general picture is in docs/games/xaymaca.md ("Places"). Things of 1503 are drawn in xaymaca.js.
   North is -z (the sea), east is +x (where the moon rises). Story people: person(). Background people: crowd(). */
import * as THREE from "three";
import { T, cv, std, solid, mesh, box, cyl, plane, grp, batchStatic, rng } from "./gfx.js";
import { palm, tree, bush } from "./period-props.js";
import * as P from "./props.js";
import * as X from "./xaymaca.js";
import { TASKS } from "./steps.js";
import { createSea, gulls } from "../../../engine/sea.js";
import { rowBoat, rowStroke } from "../../../engine/boats.js";
import { AU, tone, noiseHit, gullCry } from "../../../engine/audio.js";
import { makeRidges } from "../../../engine/ridges.js";


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
function person(Q, id, cast, x, z, ry = 0, life = null, opts = {}) {
  Q.specs.push({ id, cast, x, z, ry, life, ...opts });
}
function crowd(Q, look, x, z, ry, life, opts = {}) {
  Q.ambient.push({ id: Q.id + "-" + Q.ambient.length, look, x, z, ry, behaviour: life, ...opts });
}
function ground(Q, mat, size = 500, x = 0, z = 0, y = -0.025) {
  const p = plane(size, size, mat, x, y, z, Q.group);
  p.rotation.x = -Math.PI / 2;
  p.name = "terrain";
  return p;
}
const face = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
const dyn = (o) => (o.traverse((n) => (n.userData.noBatch = true)), o);
const far = (o) => (o.traverse((n) => (n.userData.far = true)), o);
const sounds = () => AU.ctx && AU.on && AU.ctx.state === "running";
const sm = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k));
/* a camera scene's hold on some people: while it runs they leave their everyday life; when it stops (t = -1) each goes back */
function filmHold(Q, ids, stage = () => {}) {
  let homes = null;
  return (t) => {
    const ns = ids.map((id) => Q.people.find((p) => p.id === id)).filter(Boolean);
    if (t < 0) {
      if (homes)
        ns.forEach((n, i) => {
          n.m.position.set(homes[i][0], 0, homes[i][1]);
          n.m.rotation.set(0, homes[i][2], 0);
          Q.storyLife.hold(n, false);
          n.ctl.rest?.();
        });
      homes = null;
      return;
    }
    if (!homes) {
      homes = ns.map((n) => [n.m.position.x, n.m.position.z, n.m.rotation.y]);
      ns.forEach((n) => Q.storyLife.hold(n, true));
    }
    stage(t, ns);
  };
}
/* put a story person somewhere else for a step (Q.enter) */
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
function ranges(Q, { centre, spread, layers, y, green, haze, seed }) {
  const R = makeRidges({ layers, seed, arc: [centre - spread / 2, centre + spread / 2] });
  R.tone(green, haze, 1);
  R.group.position.y = y;
  R.group.traverse((o) => (o.userData.far = true));
  Q.group.add(R.group);
  return R;
}
/* a far figure in a canoe: a seated body and a paddle, plain shapes, seen only from afar in the camera scenes */
const FIG = { skin: solid(0x8a5a3c, 0.9), cloth: solid(0xd8ccae, 1), paddle: solid(0x7a5c3c, 0.9), shirt: solid(0xd0c8b4, 1) };
function paddler(spaniard = false) {
  const g = grp();
  cyl(0.15, 0.17, 0.5, spaniard ? FIG.shirt : FIG.skin, 0, 0.35, 0, g, 8);
  mesh(new THREE.SphereGeometry(0.11, 8, 6), FIG.skin, 0, 0.72, 0, g);
  const pd = grp(g, 0.24, 0.5, 0);
  cyl(0.02, 0.02, 1.3, FIG.paddle, 0, 0, 0, pd, 5);
  box(0.12, 0.3, 0.02, FIG.paddle, 0, -0.75, 0, pd);
  g.userData.paddle = pd;
  return dyn(g);
}
/* a big canoe for the crossing: a dugout with its crew of paddlers and Spaniards (Ferdinand: six Spaniards and ten paddlers) */
function crewedCanoe(L = 9, nPad = 10, nSp = 6, seed = 1) {
  const g = grp(),
    c = X.canoe(L, { beam: 1.1, depth: 0.5, gear: false });
  g.add(c);
  const crew = [],
    n = nPad + nSp;
  for (let i = 0; i < n; i++) {
    const sp = i % 3 === 1 && crew.filter((f) => f.userData.sp).length < nSp,
      f = paddler(sp);
    f.userData.sp = sp;
    const x = -L * 0.38 + (L * 0.76 * i) / (n - 1);
    f.position.set(x, 0.05, (i % 2 ? 0.22 : -0.22) * 0.9);
    f.rotation.y = -Math.PI / 2;
    f.scale.setScalar(0.92 + (((i * 7 + seed) % 5) * 0.02));
    g.add(f);
    crew.push(f);
  }
  g.userData.crew = crew;
  g.userData.stroke = (t) => crew.forEach((f, i) => {
    if (f.userData.sp && i % 2) return;
    f.userData.paddle.rotation.z = Math.sin(t * 3 + i * 0.4) * 0.6;
  });
  return dyn(g);
}
/* trees and palms round a place, kept out of the walking area */
function woods(Q, pts, seed = 1) {
  const r = rng(seed);
  for (const [x, z, kind, s] of pts) {
    const o = kind === "palm" ? palm(5.5 + r() * 3, (seed * 7 + x) | 0) : kind === "bush" ? bush((seed + z) | 0, s || 1) : tree(4.5 + r() * 3, (seed * 3 + z) | 0, r() * 0.4);
    if (s && kind !== "bush") o.scale.setScalar(s);
    add(Q, o, x, z, 0, r() * 6);
  }
}
const SEA_GREEN = 0x3f6a3a;

/* ---------- 1. Maima, on its hill above the bay (by day; night: the eclipse) ---------- */
/* The walking area is the top terrace of the village. Below it the terraces step down the hill (Burley 2022), then the green hillside falls
   to the beach of the bay, about 180 m off (in truth about 1.4 km: drawn nearer, said so in the journal). The two caravels lie aground there. */
export const BAY = { y: -38, shipZ: -178, ships: [[-9.5, -178], [-2.9, -178]] };
function maima({ night = false } = {}) {
  const id = night ? "night" : "maima";
  const Q = base(id, [-13, -10.2, 13, 12], night ? [3.5, 2.5, -0.5] : [4.5, 7.5, 0.45]);
  Q.floor = "dirt";
  Q.beds = night ? { wind: 0.04, fire: 0.06, owl: 9 } : { wind: 0.06, bird: 4, crowd: 0.03 };
  Q.mood = "calm";
  Q.light = night
    ? { top: 0x0d1626, hor: 0x2c3244, stars: 1, moon: 0, fog: [0x141a26, 60, 700], sun: [0xaab8d8, 0.5, 60, 40, -30], hemi: [0x6c7ca0, 0x2a2420, 1.1], fill: 1.3 }
    : { top: 0x5ea2d0, hor: 0xe8e2c8, fog: [0xd2e0e0, 160, 1100], sun: [0xfff0d0, 2.4, 40, 60, -10], hemi: [0xfff4e0, 0x7a8a5c, 2.6] };
  Q.view = { pos: [6.5, 3.2, 9.5], look: [-14, -6, -60] };
  /* the terrace: packed marl and earth, worn paths */
  const dirt = std(X.earthTex([10, 9]), 1);
  const top = plane(27, 23.5, dirt, 0, 0, 0.9, Q.group);
  top.rotation.x = -Math.PI / 2;
  top.name = "terrain";
  const grass = std(T.grass([40, 40], [86, 118, 58]), 1);
  {   /* the grass round the terrace, to the south and the sides only: to the north the hill drops away */
    const g = plane(160, 150, grass, 0, -0.03, 64.2, Q.group);
    g.rotation.x = -Math.PI / 2;
    g.name = "terrain";
    for (const sx of [-1, 1]) { const s = plane(60, 20, grass, sx * 43.5, -0.03, -0.8, Q.group); s.rotation.x = -Math.PI / 2; s.name = "terrain"; }
  }
  /* the lip of the terrace: a low edge of stones along the north side, where the hill drops away */
  const stoneM = X.M.stone();
  for (let x = -13; x <= 13; x += 0.9) {
    const s = mesh(new THREE.DodecahedronGeometry(0.28, 0), stoneM, x + Math.sin(x * 3) * 0.15, 0.08, -10.75 + Math.sin(x * 1.7) * 0.12, Q.group);
    s.scale.set(1.3, 0.6, 1);
  }
  wall(Q, 0, -10.9, 30, 0.6);
  /* the lower terraces, stepping down; and the hillside below them to the beach */
  const terr = solid(0x7a8a54, 1);
  for (const [z0, z1, y] of [[-11, -19, -2.4], [-19, -28, -5.0]]) {
    const t = plane(40, z0 - z1, terr, 0, y, (z0 + z1) / 2, Q.group);
    t.rotation.x = -Math.PI / 2;
    t.name = "terrain";
    box(40, Math.abs(y) - (z0 === -11 ? 0 : 2.4), 0.6, solid(0x9a8c6a, 1), 0, y / 2 - (z0 === -11 ? 0 : 1.2), z0, Q.group);
  }
  /* the hillside: one sloping sheet from the lowest terrace down to the sand */
  {
    const W = 600, Ls = 150, seg = 40, geo = new THREE.PlaneGeometry(W, Ls, seg, seg);
    geo.rotateX(-Math.PI / 2);
    const p = geo.attributes.position, r = rng(4);
    for (let i = 0; i < p.count; i++) {
      const z = p.getZ(i), k = (z + Ls / 2) / Ls;   /* 0 at the beach, 1 at the terrace */
      p.setY(i, BAY.y + 1.2 + (-5 - BAY.y - 1.2) * Math.pow(k, 0.8) + (r() - 0.5) * 1.6 * k * (1 - k) * 4);
    }
    geo.computeVertexNormals();
    const hill = mesh(geo, std(T.grass([60, 18], [74, 108, 50]), 1), 0, 0, -28 - Ls / 2, Q.group);
    hill.name = "terrain";
    far(hill);
  }
  /* the beach and the bay */
  const sand = plane(600, 14, std(T.sand([60, 3]), 1), 0, BAY.y + 0.3, -171, Q.group);
  sand.rotation.x = -Math.PI / 2;
  far(sand);
  const sea = createSea(Q.group, { kind: "caribbean", y: BAY.y, at: [0, -260], size: 220, swell: 0.4 });
  Q.tickers.push((t) => sea.tick && sea.tick(t));
  /* trees down the hill, small with distance */
  {
    const r = rng(9);
    for (let i = 0; i < 70; i++) {
      const z = -32 - r() * 130, x = (r() - 0.5) * 260, k = (-z - 28) / 150;
      if (Math.abs(x + 6) < 14 && z < -150) continue;   /* keep the view to the ships open */
      const o = r() < 0.3 ? palm(6 + r() * 3, i) : tree(5 + r() * 3, i, r() * 0.4);
      add(Q, far(o), x, z, BAY.y + 1.2 + (-5 - BAY.y - 1.2) * Math.pow(1 - k, 0.8), r() * 6);
    }
  }
  /* the headlands either side of the bay, and the hills behind the village */
  ranges(Q, { centre: -Math.PI / 2 - 0.9, spread: 0.7, y: BAY.y, seed: 3, green: SEA_GREEN, haze: 0xcfd8d0, layers: [{ r: 330, base: 4, amp: 26, k: 0.3 }] });
  ranges(Q, { centre: -Math.PI / 2 + 0.95, spread: 0.7, y: BAY.y, seed: 5, green: SEA_GREEN, haze: 0xcfd8d0, layers: [{ r: 360, base: 6, amp: 30, k: 0.35 }] });
  ranges(Q, { centre: Math.PI / 2, spread: 2.6, y: -6, seed: 7, green: 0x4f7a40, haze: 0xc8d4cc, layers: [{ r: 80, base: 8, amp: 18, k: 0.2 }, { r: 160, base: 30, amp: 50, k: 0.5 }, { r: 300, base: 70, amp: 110, k: 0.8 }] });
  /* the two caravels aground, side by side, bows to the beach */
  const ships = BAY.ships.map(([x, z], i) => add(Q, far(X.caravel({ aground: true, shores: [i ? -1 : 1] })), x, z, BAY.y + 0.5, Math.PI));   /* turned bow to the beach, local +x is west: each ship is propped on its outer side only, the two lean on each other */
  /* the rescue ship of June 1504, anchored off the wrecks (shown in chapter 6) */
  const rescue = add(Q, dyn(far(X.caravel({ aground: false, sails: true }))), 14, -230, BAY.y + 1.3, Math.PI * 0.55);
  rescue.visible = false;
  /* the ten canoes of the mutiny, far off on the bay (chapter 4's camera scene) */
  const flotilla = [];
  for (let i = 0; i < 10; i++) {
    const c = add(Q, far(crewedCanoe(6, 4, 4, i)), 8 + (i % 5) * 3, -186 - Math.floor(i / 5) * 3, BAY.y + 0.05, Math.PI / 2);
    c.visible = false;
    flotilla.push(c);
  }
  /* ---- the village ---- */
  const houses = [
    [-6.0, -3.0, 2.0, 1],
    [7.2, 4.2, 2.0, 2],
    [-6.6, 7.6, 1.8, 3],
    [9.6, -5.2, 2.0, 4],
  ];
  for (const [x, z, r, sd] of houses) {
    add(Q, X.roundHouse(r, { seed: sd }), x, z, 0, 0);   /* the door on the west side (-x), away from the wind (Burley 2022) */
    wall(Q, x, z, r * 1.6, r * 1.6);
    Q.keepOff.push({ at: [x, z], r: r + 0.6 });
  }
  /* the cooking place, apart from the houses: the buren on its stones, a stone to rest bread on, pots, a mortar, a basket of roots */
  const bur = add(Q, dyn(X.buren()), 2.0, -1.0, 0, 0.3);
  wall(Q, 2.0, -1.0, 0.8, 0.8);
  const rest = box(0.7, 0.55, 0.5, stoneM, 1.0, 0.275, -0.4, Q.group);
  rest.userData.surface = true;
  wall(Q, 1.0, -0.4, 0.75, 0.55);
  for (const [x, z, r] of [[3.0, -2.0, 0.2], [2.6, -2.4, 0.14], [0.9, -1.6, 0.17]]) add(Q, X.pot(r), x, z);
  add(Q, X.boatBowl(0.36), 3.3, -1.6, 0, 0.4);
  add(Q, X.basket(0), 0.2, -1.9, 0, 0);
  /* Cousin's basket at the edge of the hill, ready for the bread */
  add(Q, X.basket(0, 0.3), -3.6, -7.9, 0, 0);
  wall(Q, -3.6, -7.9, 0.5, 0.5);
  /* the lookout rock at the edge */
  const look = mesh(new THREE.DodecahedronGeometry(0.7, 0), stoneM, 1.2, 0.25, -10.0, Q.group);
  look.scale.set(1.4, 0.6, 1);
  wall(Q, 1.2, -10.0, 1.6, 1.0);
  /* the cassava garden: mounds in rows on the east side */
  for (let i = 0; i < 12; i++) add(Q, X.cassavaMound(i + 2), 6.5 + (i % 4) * 1.6, 7.6 + Math.floor(i / 4) * 1.5, 0, i);
  wall(Q, 8.9, 9.1, 6.8, 4.6);
  /* a canoe being made: a log, half hollowed, on the west side (Taino canoes were "hollowed out of one single trunk", Ferdinand) */
  add(Q, X.canoe(4.2, { gear: false }), -10.4, 2.0, 0, 0.1);
  wall(Q, -10.4, 2.0, 4.4, 0.9);
  /* fish drying on a rack, a net hung to dry */
  add(Q, X.fishRack(), -10.6, -6.6, 0, 0.3);
  wall(Q, -10.6, -6.6, 2.0, 0.8);
  add(Q, X.hungNet(), 11.6, 4.2, 0, Math.PI / 2);
  wall(Q, 11.6, 4.2, 0.4, 2.4);
  /* trees round the terrace */
  woods(Q, [[-12.5, -7, "palm"], [-12.2, 10.5, "tree"], [12.4, 1.5, "tree"], [-9.5, 11.6, "palm"], [3.0, 11.8, "tree"], [12.6, -9.5, "palm"], [-12.8, 5.5, "bush"], [12.6, 11.4, "bush"], [-2.4, 11.9, "bush"]], 3);
  for (const [x, z] of [[-12.5, -7], [-12.2, 10.5], [12.4, 1.5], [-9.5, 11.6], [3.0, 11.8], [12.6, -9.5]]) wall(Q, x, z, 0.7, 0.7);
  /* the fire at night glows warmer; by day a thin smoke */
  const fire = bur.userData.fire;
  fire.light.intensity = night ? 2.2 : 0.4;
  fire.light.distance = night ? 9 : 3;
  Q.tickers.push((t) => {
    const f = 0.85 + Math.sin(t * 13) * 0.08 + Math.sin(t * 5.3) * 0.07;
    fire.light.intensity = (night ? 2.2 : 0.4) * f;
  });
  if (night) {
    /* a second fire by the houses, where people sit */
    const f2 = X.buren();
    f2.userData.cake.visible = false;
    add(Q, dyn(f2), -2.5, 3.5, 0, 0);
    wall(Q, -2.5, 3.5, 0.8, 0.8);
  }
  /* ---- the moon (night): rises out of the sea to the north-east; the eclipse is staged by the camera scene ---- */
  const moon = X.eclipseMoon(9);
  const MOON_FROM = [260, BAY.y + 6, -420], MOON_TO = [230, 160, -400];
  moon.position.set(...MOON_FROM);
  moon.visible = night;
  Q.group.add(moon);
  const moonLight = new THREE.DirectionalLight(0xc8d4ff, night ? 0.35 : 0);
  moonLight.position.set(230, 160, -400);
  Q.group.add(moonLight);
  if (night) moon.material.uniforms.k.value = 0;
  /* the cake on the buren turns over (look-shot) */
  Q.reveal.buren = (k) => {
    k = Math.min(1, +k);
    const c = bur.userData.cake, e = sm(k);
    c.position.y = 0.33 + Math.sin(e * Math.PI) * 0.18;
    c.rotation.x = e * Math.PI;
  };
  Q.lookViews = {
    lookout: { p: [0.2, 1.55, -9.5], look: [BAY.ships[0][0] + 3.3, BAY.y + 2.5, BAY.shipZ], fov: 8 },
    newship: { p: [0.2, 1.55, -9.5], look: [14, BAY.y + 6, -230], fov: 7 },
  };
  Q.enter = (stage) => {
    rescue.visible = stage >= 61 && stage < 63;
    flotilla.forEach((c) => (c.visible = false));
    if (night) {
      moon.material.uniforms.k.value = 0;
      moon.position.set(...(stage >= 55 ? MOON_TO : MOON_FROM));
      stand(Q, "gran", stage === 52 || stage >= 53 ? 1.6 : -1.6, stage === 52 || stage >= 53 ? -9.0 : 3.2, 30, -60);
      return;
    }
    if (stage < 20) {
      stand(Q, "gran", 3.1, -0.2, 2.0, -1.0);
      stand(Q, "cousin", -2.6, -8.6, -4, -60);
    } else if (stage < 50) {
      stand(Q, "gran", 3.1, -0.2, 2.0, -1.0);
      stand(Q, "cacique", -1.6, 2.4, 2, -1);
      stand(Q, "runner", 5.4, -7.6, 3, -3);
    } else {
      stand(Q, "gran", -1.2, -9.0, -6, -60);
      stand(Q, "cacique", 2.6, -8.6, 6, -60);
    }
  };
  /* ---- camera scenes ---- */
  /* the arrival: the two ships sail slowly in round the point and are run aground side by side */
  Q.films.arrival = (t) => {
    if (t < 0) {
      ships.forEach((s, i) => s.position.set(BAY.ships[i][0], BAY.y + 0.5, BAY.ships[i][1]));
      return;
    }
    ships.forEach((s, i) => {
      const k = sm((t - 4) / 22), from = [-150 + i * 8, -260 + i * 6];
      s.position.set(from[0] + (BAY.ships[i][0] - from[0]) * k, BAY.y + 1.6 - 1.1 * sm((t - 22) / 6), from[1] + (BAY.ships[i][1] - from[1]) * k);
      s.rotation.y = Math.PI + (1 - k) * 0.9;
    });
  };
  /* the mutiny: the ten canoes move off east across the bay */
  Q.films.mutiny = (t) => {
    flotilla.forEach((c, i) => {
      c.visible = t >= 0 && t > 5;
      const k = sm((t - 6 - i * 0.3) / 16);
      c.position.x = 8 + (i % 5) * 3 + k * 170;
      c.position.z = -186 - Math.floor(i / 5) * 3 - k * 25;
      c.userData.stroke(t);
    });
  };
  /* the red moon: it rises already bitten, the shadow covers it, turns it red, and slides away */
  Q.films.moon = night
    ? (t) => {
        if (t < 0) {
          moon.material.uniforms.k.value = 0;
          moon.position.set(...MOON_TO);
          moonLight.intensity = 0.35;
          return;
        }
        const rise = sm(t / 20);
        moon.position.set(MOON_FROM[0] + (MOON_TO[0] - MOON_FROM[0]) * rise, MOON_FROM[1] + (MOON_TO[1] - MOON_FROM[1]) * rise, MOON_FROM[2] + (MOON_TO[2] - MOON_FROM[2]) * rise);
        const k = t < 22 ? 0.35 + 0.65 * sm((t - 3) / 19) : 1 - sm((t - 34) / 9);
        moon.material.uniforms.k.value = k;
        moonLight.intensity = 0.35 * (1 - 0.8 * k);
      }
    : null;
  /* the ships leave: the new ship sails out of the bay */
  Q.films.leave = (t) => {
    rescue.visible = t >= 0;
    if (t < 0) return;
    const k = sm((t - 3) / 24);
    rescue.position.set(14 + 120 * k, BAY.y + 1.3, -230 - 140 * k);
    rescue.rotation.y = Math.PI * 0.55 - 0.3 * k;
  };
  /* ---- people ---- */
  person(Q, "gran", "gran", 3.1, -0.2, face(3.1, -0.2, 2, -1), { kind: "work", clips: ["Idle", "Talk1"], work: [5, 9], face: [2, -1] });
  person(Q, "cousin", "cousin", -2.6, -8.6, face(-2.6, -8.6, -4, -60), { kind: "watch", at: [-6, -178], idles: ["IdleM"], react: ["Point", "HeadTurn"], every: [5, 9] });
  person(Q, "cacique", "cacique", -1.6, 2.4, face(-1.6, 2.4, 2, -1), { kind: "watch", at: [2, -1], idles: ["IdleM"], react: ["Nod", "HeadTurn"], every: [6, 10] });
  person(Q, "runner", "runner", 5.4, -7.6, face(5.4, -7.6, 3, -3), { kind: "watch", at: [3, -3], idles: ["IdleM"], react: ["WipeSweat"], every: [5, 8] });
  if (night) person(Q, "interp", "interp", 0.6, 1.0, face(0.6, 1.0, 2, -1), { kind: "watch", at: [2, -1], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  /* the village: people at work and children at play */
  if (!night) {
    crowd(Q, "xa_woman", 6.0, 1.4, face(6.0, 1.4, 7.2, 4.2), { kind: "work", clips: ["PickUp", "Idle"], work: [5, 9], face: [6.4, 2.0] });
    crowd(Q, "xa_man", -9.0, 3.3, face(-9.0, 3.3, -10.4, 2.0), { kind: "work", clips: ["PickUp", "WipeSweat", "IdleM"], work: [5, 9], face: [-10.4, 2.0] });
    crowd(Q, "xa_woman2", -4.0, 5.0, 0, { kind: "chat", group: "w", at: [-3.6, 5.2], ring: 0.6 });
    crowd(Q, "xa_man2", -3.0, 5.6, 0, { kind: "chat", group: "w" });
    crowd(Q, "xa_girl", 3.0, 6.0, 0, { kind: "play", area: [0, 4, 6, 9], chase: 1 });
    crowd(Q, "xa_boy", 4.0, 7.0, 0, { kind: "play", area: [0, 4, 6, 9] });
  } else {
    crowd(Q, "xa_woman", -3.4, 4.4, face(-3.4, 4.4, -2.5, 3.5), { kind: "watch", at: [-2.5, 3.5], react: ["HeadTurn"], every: [6, 10] });
    crowd(Q, "xa_man", -1.6, 4.6, face(-1.6, 4.6, -2.5, 3.5), { kind: "watch", at: [-2.5, 3.5], react: ["HeadTurn"], every: [6, 10] });
    crowd(Q, "xa_woman2", 4.0, -8.8, face(4.0, -8.8, 30, -60), { kind: "watch", at: [260, -400], react: ["Point", "HeadTurn"], every: [5, 9] });
    crowd(Q, "xa_man2", -4.2, -8.9, face(-4.2, -8.9, 30, -60), { kind: "watch", at: [260, -400], react: ["Point"], every: [5, 9] });
  }
  Q.keepOff.push({ at: [2.0, -1.0], r: 1.2 }, { at: [1.0, -0.4], r: 0.9 }, { at: [-3.6, -7.9], r: 0.8 }, { at: [1.2, -10.0], r: 1.2 }, { at: [0, -9.4], r: 0.9 }, { at: [-8.6, -3.0], r: 0.9 });
  return Q;
}

/* ---------- 2. The shore of St Ann's Bay (Santa Gloria), July 1503 ---------- */
/* A pale beach inside the reef, the two caravels aground side by side (drawn nearer than Ferdinand's "bow-shot", said so in the journal),
   canoes at the water's edge, a stream coming down to the sea at the east end, the hill of Maima behind. */
export const SHIPS = [[-7.6, -34], [-1.0, -34]];
function shore() {
  const Q = base("shore", [-14, -3.4, 15, 9], [6.5, 6.5, 0.35]);
  Q.floor = "sand";
  Q.beds = { sea: 0.08, surf: 0.05, wind: 0.04, bird: 6 };
  Q.light = { top: 0x56a0d4, hor: 0xeae6d0, fog: [0xd8e6e6, 200, 1100], sun: [0xfff2d0, 2.6, 30, 60, -40], hemi: [0xffffff, 0x9aa48a, 2.6] };
  Q.view = { pos: [9, 2.4, 7], look: [-4, 1, -30] };
  const SEA = -0.32;
  const sand = std(T.sand([40, 40]), 1);
  ground(Q, sand, 300, 0, 145.5, -0.02);   /* the sand ends at the water's edge */
  /* the wet sand at the water's edge */
  const wet = plane(300, 2.2, solid(0xc8b894, 1), 0, -0.012, -3.9, Q.group);
  wet.rotation.x = -Math.PI / 2;
  wet.name = "terrain";
  const sea = createSea(Q.group, { kind: "caribbean", y: SEA, at: [0, -80], size: 200, swell: 0.3 });
  Q.tickers.push((t) => sea.tick && sea.tick(t));
  Q.walls.push([-40, -40, 40, -3.6]);
  /* the reef, far out: a line of breaking white */
  const reef = plane(500, 2.5, new THREE.MeshBasicMaterial({ color: 0xf4f4ee, transparent: true, opacity: 0.7, depthWrite: false }), 0, SEA + 0.05, -150, Q.group);
  reef.rotation.x = -Math.PI / 2;
  far(reef);
  /* the stream at the east end, shallow over the sand */
  const stream = plane(1.3, 16, new THREE.MeshStandardMaterial({ color: 0x7aa6a2, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.55, depthWrite: false }), 12.6, 0.012, 2.0, Q.group);
  stream.rotation.x = -Math.PI / 2;
  stream.userData.water = true;
  for (let i = 0; i < 6; i++) add(Q, X.M.stone() && mesh(new THREE.DodecahedronGeometry(0.2 + (i % 3) * 0.05, 0), X.M.stone(), 0, 0.06, 0), 11.6 + (i % 2) * 2.0, -1 + i * 1.6);
  /* the hill of Maima behind, the woods along the back of the beach */
  ranges(Q, { centre: Math.PI / 2, spread: 2.8, y: 0, seed: 4, green: 0x4f7a40, haze: 0xcfd8d0, layers: [{ r: 40, base: 6, amp: 10, k: 0.2 }, { r: 90, base: 24, amp: 30, k: 0.45 }, { r: 200, base: 60, amp: 80, k: 0.75 }] });
  ranges(Q, { centre: -Math.PI / 2 - 1.0, spread: 0.6, y: SEA, seed: 3, green: SEA_GREEN, haze: 0xcfd8d0, layers: [{ r: 260, base: 4, amp: 20, k: 0.3 }] });
  ranges(Q, { centre: -Math.PI / 2 + 1.05, spread: 0.6, y: SEA, seed: 5, green: SEA_GREEN, haze: 0xcfd8d0, layers: [{ r: 280, base: 4, amp: 24, k: 0.35 }] });
  woods(Q, [[-13, 11, "palm"], [-8, 12.5, "palm"], [-3, 11.5, "tree"], [2, 12.6, "palm"], [7, 11.4, "palm"], [11, 12.2, "tree"], [15, 10.5, "palm"], [-15.5, 6, "palm"], [16.5, 4, "tree"], [-11, 10.2, "bush"], [5, 10.4, "bush"], [14, 8.6, "bush"]], 6);
  Q.walls.push([-40, 9.6, 40, 40]);
  /* the two caravels aground, bows to the beach, side by side; the water nearly to their decks */
  const ships = SHIPS.map(([x, z], i) => add(Q, far(X.caravel({ aground: true, shores: [i ? -1 : 1] })), x, z, SEA + 0.45, Math.PI));
  /* the trading canoe at the water's edge (chapter 2), and the two big canoes (chapter 3) */
  const tradeCanoe = add(Q, dyn(X.canoe(5.2)), 3.2, -3.3, -0.1, Math.PI / 2 + 0.05);
  const bigA = add(Q, crewedCanoe(9, 10, 6, 1), -1.0, -4.6, -0.12, Math.PI / 2 - 0.04),
    bigB = add(Q, crewedCanoe(9, 10, 6, 2), 3.6, -5.0, -0.12, Math.PI / 2 + 0.03);
  for (const c of [bigA, bigB]) c.userData.crew.forEach((f) => (f.visible = false));
  Q.walls.push([0.5, -3.9, 5.9, -2.75]);
  /* the ship's boat that brought Mendez and the interpreter ashore */
  const boat = rowBoat({ L: 4.6, beam: 1.5, depth: 0.6, wood: std(T.plank([118, 96, 72], 6, [1, 1])), timber: std(T.plank([92, 72, 52], 1, [1, 1])), oars: "shipped", rudder: false });
  add(Q, dyn(boat), -6.4, -3.6, -0.1, Math.PI / 2 + 0.2);
  Q.walls.push([-8.8, -4.3, -4.0, -2.9]);
  /* the hawk's bell and beads, laid on a cotton cloth on the sand (chapter 2, after the trade) */
  const gift = grp();
  box(0.6, 0.006, 0.45, X.M.cotton(), 0, 0.003, 0, gift);
  const bell = mesh(new THREE.SphereGeometry(0.03, 12, 8), solid(0xc8a24a, 0.3, 0.9), 0, 0.03, 0, gift);
  box(0.05, 0.002, 0.004, solid(0x2a2010, 0.6), 0, 0.03, -0.029, gift);
  for (let i = 0; i < 9; i++) mesh(new THREE.SphereGeometry(0.008, 6, 4), solid(i % 2 ? 0xd8322a : 0xe8c02a, 0.2), 0.08 + (i % 5) * 0.022, 0.008, -0.05 + Math.floor(i / 5) * 0.03, gift);
  add(Q, dyn(gift), 3.2, -0.9, 0, 0.2);
  gift.visible = false;
  Q.reveal.bell = (k) => {
    k = Math.min(1, +k);
    gift.visible = true;
    const e = sm(k);
    bell.position.y = 0.03 + Math.sin(e * Math.PI * 3) * 0.06 * (1 - e) + e * 0.14;
    bell.position.x = Math.sin(e * 20) * 0.01;
  };
  Q.lookViews = {};
  Q.enter = (stage) => {
    gift.visible = stage >= 24 && stage < 30;
    tradeCanoe.visible = stage < 30;
    bigA.visible = bigB.visible = stage >= 30;
    tradeCanoe.position.set(3.2, -0.1, -3.3);
    for (const c of [bigA, bigB]) c.userData.crew.forEach((f) => (f.visible = false));
    if (stage < 30) {
      stand(Q, "cousin", stage >= 24 ? 1.8 : 1.4, stage >= 24 ? -1.2 : -2.0, 3.2, -3.2);
      stand(Q, "interp", -4.2, 0.4, 2, -1);
      stand(Q, "mendez", -5.3, 0.6, 2, -1);
    } else {
      stand(Q, "cousin", -0.6, -2.4, -1, -4.6);
      stand(Q, "gran", 1.4, 0.8, -0.6, -2.4);
    }
  };
  /* the trade: Cousin paddles the canoe out to the ships' side and back */
  const tradeHold = filmHold(Q, ["cousin"], (t, [cousin]) => {
    const out = sm((t - 3) / 9), back = sm((t - 19) / 7), k = out - back;
    tradeCanoe.position.set(3.2 + (SHIPS[1][0] + 4.2 - 3.2) * k, -0.1, -3.3 + (SHIPS[1][1] + 1.5 + 3.3) * k);
    tradeCanoe.rotation.y = Math.PI / 2 + 0.05 + (t > 3 && t < 26 ? (t < 15 ? 1.1 : -1.1) * Math.min(1, Math.min(t - 3, 26 - t) / 2) : 0);
    if (cousin) cousin.m.visible = t < 3 || t > 26;
  });
  /* the sailor from the beach stands at the ship's rail for the trade (only while the scene runs: nobody stands inside a ship in play) */
  let sailorHome = null;
  Q.films.trade = (t) => {
    tradeHold(t);
    const s = Q.extras?.[0];
    if (!s) return;
    if (t < 0) {
      if (sailorHome) { s.m.position.set(...sailorHome[0]); s.m.rotation.y = sailorHome[1]; Q.life.hold(s, false); s.ctl.rest?.(); }
      sailorHome = null;
      return;
    }
    if (!sailorHome) { sailorHome = [s.m.position.toArray(), s.m.rotation.y]; Q.life.hold(s, true); s.ctl.play("IdleM", true); }
    s.m.position.set(SHIPS[1][0] + 2.2, SEA + 0.5, SHIPS[1][1] + 2.0);
    s.m.rotation.y = Math.PI / 2;
    if (t > 15 && t < 16) s.ctl.play("Point", true);
  };
  /* the canoes set off: crews aboard, along the coast to the east */
  const departHold = filmHold(Q, ["cousin"]);
  Q.films.depart = (t) => {
    departHold(t);
    const cousin = Q.people.find((n) => n.id === "cousin");
    if (t < 0) {
      bigA.position.set(-1.0, -0.12, -4.6);
      bigB.position.set(3.6, -0.12, -5.0);
      for (const c of [bigA, bigB]) c.userData.crew.forEach((f) => (f.visible = false));
      return;
    }
    if (cousin) cousin.m.visible = t < 4;
    for (const [i, c] of [bigA, bigB].entries()) {
      c.userData.crew.forEach((f) => (f.visible = t >= 4));
      const k = sm((t - 8 - i * 1.2) / 20);
      c.position.set((i ? 3.6 : -1.0) + k * 150, -0.12, (i ? -5.0 : -4.6) - sm((t - 8) / 6) * 6 - k * 10);
      c.userData.stroke(t);
    }
  };
  /* ---- people ---- */
  person(Q, "cousin", "cousin", 1.4, -2.0, face(1.4, -2.0, 3.2, -3.2), { kind: "watch", at: [3.2, -3.2], idles: ["IdleM"], react: ["HeadTurn", "Point"], every: [5, 9] });
  person(Q, "interp", "interp", -4.2, 0.4, face(-4.2, 0.4, 2, -1), { kind: "watch", at: [2, -1], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  person(Q, "mendez", "mendez", -5.3, 0.6, face(-5.3, 0.6, 2, -1), { kind: "watch", at: [2, -1], idles: ["IdleM"], react: ["HeadTurn", "LookAround"], every: [6, 10] });
  person(Q, "gran", "gran", 1.4, 0.8, face(1.4, 0.8, -0.6, -2.4), { kind: "watch", at: [-0.6, -2.4], idles: ["Idle"], react: ["HeadTurn"], every: [6, 10] });
  crowd(Q, "xa_sailor", -7.6, -1.6, face(-7.6, -1.6, -6.4, -3.6), { kind: "watch", at: [-6.4, -3.6], react: ["HeadTurn", "Shrug"], every: [6, 9] });
  crowd(Q, "xa_man", 8.4, 1.0, face(8.4, 1.0, 3, -3), { kind: "chat", group: "b", at: [8.8, 1.2], ring: 0.6 });
  crowd(Q, "xa_woman", 9.2, 1.4, 0, { kind: "chat", group: "b" });
  crowd(Q, "xa_boy", 6.0, 3.0, 0, { kind: "play", area: [4, 2, 10, 7] });
  Q.keepOff.push({ at: [3.2, -1.6], r: 0.9 }, { at: [7.2, 3.0], r: 0.8 }, { at: [11.6, 2.6], r: 0.8 }, { at: [-0.4, -1.4], r: 0.8 }, { at: [3.4, -0.4], r: 0.8 });
  return Q;
}

/* ---------- 3. The open sea, the second night of the crossing (a camera scene only) ---------- */
function crossing() {
  const Q = base("crossing", [-3, -3, 3, 3], [0, 2, Math.PI]);
  Q.floor = "wood";
  Q.beds = { sea: 0.1, wind: 0.05 };
  Q.light = { top: 0x0b1424, hor: 0x283048, stars: 1, moon: 0, fog: [0x101826, 80, 1600], sun: [0xb8c8ff, 0.6, 40, 50, -200], hemi: [0x5a6a90, 0x1a1a22, 0.9], fill: 1.0 };
  Q.view = { pos: [6, 2, 8], look: [0, 0, -40] };
  const sea = createSea(Q.group, { kind: "caribbean", y: -0.3, at: [0, -60], size: 260, swell: 0.6 });
  Q.tickers.push((t) => sea.tick && sea.tick(t));
  const c = add(Q, crewedCanoe(9, 10, 6, 3), 0, 4, -0.2, Math.PI / 2 + 0.1);
  Q.tickers.push((t) => {
    c.userData.stroke(t * 0.6);
    c.position.y = -0.2 + Math.sin(t * 0.9) * 0.05;
    c.rotation.z = Math.sin(t * 0.7) * 0.03;
  });
  const isle = add(Q, far(X.navassa()), 0, -600, -0.4, 0);
  const moon = X.eclipseMoon(16);
  moon.material.uniforms.k.value = 0;
  moon.position.set(0, -6, -900);
  Q.group.add(moon);
  Q.films.crossing = (t) => {
    if (t < 0) {
      moon.position.set(0, -6, -900);
      return;
    }
    /* the moon comes up from behind the island ("a little island covered her in the nature of an eclipse") */
    const k = sm((t - 20) / 14);
    moon.position.set(0, -6 + k * 40, -900);
  };
  void isle;
  return Q;
}

/* ---------- 4. Seville Heritage Park, 2026 ---------- */
/* A general picture (to check against the park's real layout): mown grass and old trees on the hill, a model Taino house, a heritage sign,
   the low stone footings of the Spanish town, and the bay below. */
function today() {
  const Q = base("today", [-12, -9, 12, 10], [3.5, 7.5, 0.5]);
  Q.floor = "grass";
  Q.beds = { wind: 0.05, bird: 5, crowd: 0.02 };
  Q.light = { top: 0x5aa2d6, hor: 0xe6eadc, fog: [0xd6e2e2, 180, 1100], sun: [0xfff4dc, 2.5, -30, 60, -10], hemi: [0xffffff, 0x8a9a70, 2.6] };
  Q.view = { pos: [6, 2.4, 8], look: [-6, 0, -20] };
  ground(Q, std(T.grass([50, 50], [92, 134, 62]), 1), 300, 0, 0, -0.02);
  /* a gravel path */
  const path = plane(2.2, 20, std(X.earthTex([2, 12], [196, 184, 158]), 1), 1.5, 0.006, 0, Q.group);
  path.rotation.x = -Math.PI / 2;
  path.name = "terrain";
  /* the model house, the sign, the stone footings */
  add(Q, X.roundHouse(2.2, { seed: 9 }), -6.0, -4.0, 0, 0);
  wall(Q, -6.0, -4.0, 3.6, 3.6);
  const sign = grp();
  box(1.5, 0.95, 0.06, solid(0x5a3a22, 0.8), 0, 1.25, 0, sign);
  const head = P.label("THE TAINO OF MAIMA", 1.36, 0.16, "#f0e8d0", "#3a2a1a");
  head.position.set(0, 1.58, 0.035);
  sign.add(head);
  const words = P.label("canoe · hammock · hurricane · barbecue", 1.36, 0.12, "#f0e8d0", "#3a2a1a", "normal");
  words.position.set(0, 1.25, 0.035);
  sign.add(words);
  const xay = P.label("Xaymaca: land of wood and water", 1.36, 0.12, "#f0e8d0", "#3a2a1a", "italic");
  xay.position.set(0, 1.0, 0.035);
  sign.add(xay);
  for (const x of [-0.6, 0.6]) box(0.08, 0.8, 0.08, solid(0x4a3020, 0.9), x, 0.4, 0, sign);
  add(Q, sign, 4.0, -6.2, 0, 0);
  wall(Q, 4.0, -6.2, 1.6, 0.4);
  for (const [x, z, w, d] of [[7, 3, 5, 0.5], [9.25, 5, 0.5, 4], [7, 7, 5, 0.5]]) {
    box(w, 0.45, d, X.M.stone(), x, 0.225, z, Q.group);
    wall(Q, x, z, w, d);
  }
  /* the bay below, the trees round the lawn */
  const sea = createSea(Q.group, { kind: "caribbean", y: -40, at: [0, -260], size: 200, swell: 0.3 });
  Q.tickers.push((t) => sea.tick && sea.tick(t));
  const drop = plane(400, 200, std(T.grass([60, 30], [74, 108, 50]), 1), 0, -20, -110, Q.group);
  drop.rotation.x = -Math.PI / 2 - 0.2;
  far(drop);
  ranges(Q, { centre: Math.PI / 2, spread: 2.6, y: 0, seed: 8, green: 0x4f7a40, haze: 0xc8d4cc, layers: [{ r: 120, base: 10, amp: 30, k: 0.35 }, { r: 260, base: 50, amp: 80, k: 0.7 }] });
  woods(Q, [[-11, -8, "tree", 1.3], [-11.5, 3, "tree", 1.4], [11.5, -6, "palm"], [11, 9.5, "tree", 1.3], [-6, 9.6, "palm"], [0, -9.6, "palm"], [-11.6, 8.5, "bush"]], 8);
  for (const [x, z] of [[-11, -8], [-11.5, 3], [11.5, -6], [11, 9.5], [-6, 9.6], [0, -9.6]]) wall(Q, x, z, 0.9, 0.9);
  Q.lookViews = {};
  Q.enter = () => {};
  person(Q, "guide", "guide", 0.6, 1.6, face(0.6, 1.6, 3.5, 6), { kind: "watch", at: [3.5, 6], idles: ["Idle"], react: ["Point", "Talk1"], every: [6, 10] });
  crowd(Q, "xa_visitor", -2.6, -1.6, face(-2.6, -1.6, -6, -4), { kind: "watch", at: [-6, -4], react: ["Point", "HeadTurn"], every: [5, 9] });
  crowd(Q, "xa_girl", -1.4, -2.6, 0, { kind: "play", area: [-3, -3, 2, 3] });
  Q.keepOff.push({ at: [-3.6, -2.4], r: 0.9 }, { at: [3.6, -4.2], r: 0.9 });
  return Q;
}

const builders = { maima: () => maima(), night: () => maima({ night: true }), shore, crossing, today };
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
void tone; void noiseHit; void gullCry; void gulls; void rowStroke; void sounds; void cv;
