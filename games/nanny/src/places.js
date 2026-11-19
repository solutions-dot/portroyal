/* games/nanny/src/places.js: the four places.
     estate   a sugar estate at night, a cart road, a stream, and the trail up into the hills (chapter 1)
     town     Nanny Town on its shoulder of the mountain: the narrow path in, the clearing, gardens, the back trail to a high ridge (chapters 2 and 5)
     watch    the watch rock above the narrow path, where the soldiers climb (chapters 3 and 4, and the title picture)
     newtown  New Nanny Town by a river, 1740 (chapter 6)
   Each builder returns { id, group, G (the ground: heights and where you may walk), start, env, people, extras, spots, solids, ... }.
   Coordinates are metres; y is up; yaw 0 looks toward -z (north). +z is south and downhill in the mountain places.
   What is real: the town's height, its 140 houses, the one narrow path, the trenches and forked sticks (seen at a Windward town in 1739), yams and plantains, the horn.
   What is our own picture: the layout of every place, the huts, the plants. See docs/games/nanny.md. */
import * as THREE from 'three';
import { T, std, solid, flat, mesh, box, cyl, grp, rng } from './gfx.js';
import { makeGround, landMesh, ribbon, trailMat, streamMesh, fbm, smooth, pathLength, pathAt, PALETTE, ENV, smoothPath } from './land.js';
import { forest, spotsOn, plant, treeGeo, plantPlantains, plantPalms, plantCane, plantGrass, plantGroundFerns, plantTreeFerns, cottonTree, rockGeo, offTrail, taken } from './flora.js';
import { hut, hutGeo, cookFire, jerkFrame, yamHill, trench, forkStick, basket, basketOf, gourd, mortar, woodPile, stool, wattleFence, boulder, paperStone, swivelGun, steppingStones, PM } from './props.js';
import { person, extra, villagers, fighter, LOOKS } from './cast.js';

const PI = Math.PI;
const treeM = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 });
const face = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
/* put a thing on the ground at (x, z), turned by ry, sunk a little; returns it. solids: the place's list of round things you cannot walk through. */
/* a house stands level: its floor is at the highest ground under its four corners (its earth platform, props.js hut, goes down into the hill on the low side) */
const seat = (G, x, z, ry, w, d, cut = 0) => { let y = G.h(x, z), lo = y; const c = Math.cos(ry), s = Math.sin(ry); for (const [dx, dz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const h = G.h(x + (dx * w / 2) * c + (dz * d / 2) * s, z - (dx * w / 2) * s + (dz * d / 2) * c); y = Math.max(y, h); lo = Math.min(lo, h); } return y - (y - lo) * cut; };   /* cut: how much of the slope across the house is dug out of the hill behind it instead of built up in front (0 none, 0.5 half and half) */
function putHut(g, G, w, d, hh, seed, x, z, ry, o = {}) { const hu = put(g, G, hut(w, d, hh, seed), x, z, ry, { ...o, sink: 0 }); hu.position.y = seat(G, x, z, ry, w, d) - 0.04;
  /* stone steps from the door down to the ground in front of it: as many as the drop needs, each 17 cm high and 30 cm deep, the lowest sunk a little into the land */
  const c = Math.cos(ry), s = Math.sin(ry), at = (dz) => [x + dz * s, z + dz * c], [fx, fz] = at(d / 2 + 0.6), drop = hu.position.y - G.h(fx, fz), n = Math.max(0, Math.min(9, Math.ceil((drop - 0.05) / 0.17)));
  taken.add(x, z, Math.max(w, d) * 0.62 + 0.7); if (n) { const [sx, sz] = at(d / 2 + 0.2 + 0.15 * (n + 1)); taken.add(sx, sz, 0.3 * n / 2 + 0.7); if (o.solids) o.solids.push([sx, sz, Math.max(0.7, 0.3 * n / 2 + 0.35)]); }   /* plants keep off the platform and the steps; nobody stands in the steps */
  for (let i = 1; i <= n; i++) { const st = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.17 * (n - i + 1) + 0.3, 0.32), STEP_MAT); st.position.set(0, -0.17 * i - (0.17 * (n - i + 1) + 0.3) / 2 + 0.17, d / 2 + 0.2 + 0.3 * i); st.castShadow = st.receiveShadow = true; hu.add(st); }
  return hu; }
const STEP_MAT = new THREE.MeshStandardMaterial({ color: 0x8a7f70, roughness: 1, flatShading: true });
function put(g, G, o, x, z, ry = 0, { sink = 0, solids, r } = {}) { o.position.set(x, G.h(x, z) - sink, z); o.rotation.y = ry; g.add(o); if (solids) solids.push([x, z, r || o.userData.foot || 0.6]); taken.add(x, z, r || o.userData.foot || 0.6); return o; }   /* every placed thing also takes its ground, so rocks and plants scattered later keep out of it (flora.js, taken) */
/* a fence is solid along its whole length: small round footprints every 45 cm */
function fenceSolid(solids, x0, z0, x1, z1) { const L = Math.hypot(x1 - x0, z1 - z0), n = Math.ceil(L / 0.45); for (let i = 0; i <= n; i++) solids.push([x0 + (x1 - x0) * i / n, z0 + (z1 - z0) * i / n, 0.22]); }
const trails = (g, G) => { for (const t of G.trails) if (!t.plain) g.add(ribbon(t.dense, t.w + 0.4, G.h, trailMat(), { dy: 0.015, vrep: 2.6 })   /* 1.5 cm over the land (its material is drawn in front of the land anyway): at 7 cm, feet on a path stood 7 cm deep in it */); };
const sAt = (dense, test) => { let s = 0; for (let i = 1; i < dense.length; i++) { if (test(dense[i])) return s; s += Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]); } return s; };
/* many plain huts across a hillside, as one drawn shape: each sits a little into the slope and faces downhill-ish */
function farHuts(g, G, n, area, seed, ok) { const sp = spotsOn(G, n, area, seed, (x, z, y, r) => ok(x, z, y, r) && !G.walkable(x, z, -3.1), { smin: 0.85, smax: 1.15, tries: 40, room: 2.5 }); for (const p of sp) p.y = seat(G, p.x, p.z, p.ry, 4 * p.s, 3.2 * p.s, 0.45) - 0.04;   /* level: cut a little into the hill behind and built up a little in front, so no house stands on a tall block of earth (owner, 17 November 2026) */ const im = plant(g, hutGeo(), new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 }), sp, { vary: 0.1, sink: 0, name: 'hut' }); return { im, spots: sp }; }   /* a hut is 4 m by 3.2 m (up to 15% bigger): it stands at least 3.1 m from any ground you can walk on, so nobody on a path walks through a wall */
/* a flame you can see from far away, and a warm light that flickers */
function glowSprite(size = 3, color = 0xff8a30) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })); s.scale.set(size, size * 1.2, 1); return s; }

/* ============ chapter 1: a sugar estate at night, about 1730 ============ */
export function buildEstate() {
  taken.reset();
  const g = grp(), solids = [];
  const trail = { w: 1.25, pts: [[2, 40, 0], [0, 30, 0], [-3, 20, 0], [-2, 12.5, 0], [-2, 3.5, 0], [2, -4, -0.3], [4, -10.5, -1.0], [4.5, -13.5, -1.3], [5, -16.5, -1.0], [2, -26, 2.5], [-6, -36, 7.5], [-4, -48, 14], [4, -58, 18.6], [6, -63, 19.6]] };
  const streamZ = (x) => -13.5 + Math.sin(x * 0.05) * 3;
  /* low cane land, a stream, then a hill that rises to a crest at the top of the trail and falls away beyond it, so the mountains stand clear ahead */
  const G = makeGround({ base: (x, z) => 20 * smooth(-17, -62, z) * (1 - 1.6 * smooth(-72, -120, z)) + (fbm(x * 0.03, z * 0.03, 4, 21) - 0.35) * 8 * smooth(-22, -50, z) - 1.6 * Math.exp(-Math.pow((z - streamZ(x)) / 3.4, 2)) + (fbm(x * 0.06, z * 0.06, 3, 5) - 0.5) * 0.6 * smooth(-28, -8, z),
    trails: [trail], flats: [{ x: 2, z: 41, r: 5.5, y: 0, earth: 0.55 }, { x: 6, z: -65.5, r: 4.6, y: 19.8, earth: 0.5 }] });
  g.add(landMesh(G, { size: 340, seg: 150, palette: PALETTE.cane, seed: 6 })); trails(g, G);
  /* the cart road: two ruts through the cane, east to west */
  const road = []; for (let x = -95; x <= 95; x += 5) road.push([x, 8 + Math.sin(x * 0.04) * 0.8, 0]); const rt = T.dirt([1, 1], [128, 86, 56]); g.add(ribbon(road, 2.7, G.h, new THREE.MeshStandardMaterial({ map: rt, roughness: 1, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }), { dy: 0.045, vrep: 6 }));
  /* the stream, and stones to step on */
  const sd = []; for (let x = -100; x <= 100; x += 6) sd.push([x, streamZ(x), 0]); const water = streamMesh(smoothPath(sd, 2), 3.1, -1.02, { speed: 0.9 }); g.add(water);
  const ti = trail.dense.findIndex((p) => p[1] < -10.8), tj = trail.dense.findIndex((p) => p[1] < -16.2); const stones = steppingStones(trail.dense, -0.9, ti / trail.dense.length, tj / trail.dense.length); g.add(stones);
  /* you, and the people who walk with you, cross on the stepping stones, not through them: on the crossing the ground you stand on is the top of the nearest stone.
     The land and the water keep their own heights; only where a person stands changes (G.h is read for people and the camera from here on). */
  stones.updateMatrixWorld(true); const tops = stones.children.map((m) => { const b = new THREE.Box3().setFromObject(m); return [(b.min.x + b.max.x) / 2, (b.min.z + b.max.z) / 2, b.max.y - 0.03]; }), h0 = G.h;
  G.h = (x, z) => { const y = h0(x, z); if (z > -10 || z < -18) return y; let sw = 0, sy = 0; for (const t of tops) { const d = Math.hypot(t[0] - x, t[1] - z); if (d < 0.9) { const w = 0.9 - d; sw += w; sy += w * t[2]; } } return sw > 0 ? Math.max(y, y + (sy / sw - y) * Math.min(1, sw / 0.6)) : y; };   /* a smooth mean of the stone tops near you, so feet do not float over a lower stone, eased in at the first and last stone */
  /* sugar cane on both sides of the first stretch, and the huts where you start */
  const nearTrail = (x, z) => G.trailness(x, z) > 0.01, cane = spotsOn(G, 1500, [-64, 10.8, 64, 66], 3, (x, z) => !nearTrail(x, z) && Math.hypot(x - 2, z - 41) > 10.5 && Math.abs(x - 54) > 13, { smin: 0.8, smax: 1.3 }); plantCane(g, cane);
  const HUTS = [[9.8, 44.5, -2.2], [-5.6, 46, 2.4], [10.2, 36, -1.4]]; HUTS.forEach(([x, z, ry], i) => putHut(g, G, 3.6, 3, 2, i + 2, x, z, ry, { solids }));
  put(g, G, woodPile(6), 5.6, 45.2, 0.4, { solids }); put(g, G, basketOf('yam'), -0.6, 44.6, 0, { solids, r: 0.4 }); put(g, G, cookFire(false), 3.2, 43.6, 0, { solids });
  /* the great house, far off on its rise, with lamps in the windows */
  const gh = grp(g, 56, G.h(56, 30), 30); box(15, 6, 9, solid(0x2a2a30, 1), 0, 3, 0, gh); const rf = mesh(new THREE.ConeGeometry(1, 3.2, 4), solid(0x1c1c22, 1), 0, 7.6, 0, gh); rf.rotation.y = PI / 4; rf.scale.set(8.4 * Math.SQRT2, 1, 5.3 * Math.SQRT2);
  for (let i = 0; i < 5; i++) mesh(new THREE.PlaneGeometry(0.9, 1.5), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xffc870 : 0xe8a850 }), -7.51, 3.6, -3 + i * 1.5, gh).rotation.y = -PI / 2; gh.rotation.y = 0.25;
  /* palms and a few big trees on the low land; thick forest on the hill beyond the stream */
  plantPalms(g, spotsOn(G, 16, [-60, -6, 60, 9.5], 12, (x, z) => !nearTrail(x, z) && Math.abs(z - 8) > 4.2, { smin: 0.8, smax: 1.2, room: 0.3 }));
  const shade = [{ x: -6.6, z: 14.6, s: 1.25, ry: 1, k: 0.4 }, { x: 3.4, z: 1.4, s: 1.3, ry: 2.2, k: 0.6 }, { x: -8.5, z: -3, s: 1.1, ry: 4, k: 0.5 }].map((p) => ({ ...p, y: G.h(p.x, p.z) })); plant(g, treeGeo('broad', 4), treeM, shade);
  forest(g, G, [-75, -110, 75, -19], { seed: 21, trees: 130, tall: 46, bushes: 110, ferns: 46, ground: 200, grass: 500, rocks: 50, near: [-34, -72, 40, -19], keepTrees: (x, z) => !(z < -63.5 && z > -116 && Math.abs(x - 6) < 34) });
  plantGrass(g, spotsOn(G, 700, [-40, -8, 40, 10], 8, (x, z) => G.trailness(x, z) < 0.4 && Math.abs(z - 8) > 3 && Math.abs(z - streamZ(x)) > 3.2), { tint: 0x6c8a52 });
  plant(g, rockGeo(5), treeM, spotsOn(G, 34, [-50, -19, 50, -9], 14, (x, z) => Math.abs(z - streamZ(x)) < 4.2 && !nearTrail(x, z), { smin: 0.3, smax: 1.0, room: 1.15 }), { sink: 0.2 });
  const top = pathLength(trail.dense), sRoadS = sAt(trail.dense, (p) => p[1] < 12.6), sRoadN = sAt(trail.dense, (p) => p[1] < 3.4);
  const people = [person('mama', 'mama', 'Mama', 4.2, 42.6, face(4.2, 42.6, 2, 40)), person('quamin', 'quamin', 'Quamin', 0.2, 38.4, face(0.2, 38.4, 2, 41))];
  const extras = [extra('watchman', -24, 8, PI / 2, 'Idle', { id: 'watchman', path: [[-27, 8.2], [25, 8.2]], props: [['RightHand', 'lantern']], lampLight: true, speed: 1.15 })];
  return { id: 'estate', group: g, G, solids, start: { x: 2, z: 40.6, yaw: 0.25 }, env: ENV.night, backdrop: { lift: 30, mist: -200 }, people, extras, waters: [water], night: true,
    spots: { trail, top, sRoadS, sRoadN, roadZ: [3.4, 12.6], crossX: -2 } };
}

/* ============ chapters 2 and 5: Nanny Town ============ */
export function buildTown() {
  taken.reset();
  const g = grp(), solids = [], r = rng(41);
  const pathIn = { w: 0.8, pts: [[36, 60, -24.5], [40, 50, -19.2], [47, 41, -17], [48, 31, -12.6], [40, 24, -7.4], [30, 20, -4.4], [20, 17, -3], [11, 14, -2], [6.5, 11, -0.6], [4.6, 9.6, 0]] };
  const back = { w: 1.05, pts: [[-9, -9.5, 0], [-16, -15, 2.4], [-24, -22, 4], [-34, -30, 7.5], [-46, -41, 16.5], [-56, -52, 28], [-61, -57.5, 34.5]] };
  const link = { w: 1.5, pts: [[-12.5, 2.6, 0], [-17.5, 4.4, 0.4]] };
  const main = { x: 0, z: 0, r: 14.5, y: 0, bench: 9, earth: 0.62 }, garden = { x: -23, z: 5, r: 7.5, y: 0.4, bench: 6, earth: 0.35 }, ridge = { x: -64, z: -61, r: 4.6, y: 36.5, earth: 0.4 }, foot = { x: 36, z: 61.5, r: 2.3, y: -24.5 };
  const G = makeGround({ base: (x, z) => { const d = Math.hypot(x, z); return (-0.24 * x - 0.42 * z) * (0.25 + 0.75 * smooth(28, 100, d)) + (fbm(x * 0.035, z * 0.035, 4, 31) - 0.5) * 13 * smooth(22, 70, d); }, trails: [pathIn, back, link], flats: [main, garden, ridge, foot] });
  g.add(landMesh(G, { size: 360, seg: 160, seed: 12 })); trails(g, G);
  /* the houses near you, round the clearing, with their doors toward the middle. The first three are "your row". */
  const ANG = [100, 122, 144, 20, 345, 198, 250, 304], doors = [];
  ANG.forEach((a, i) => { const t = a * PI / 180, x = Math.cos(t) * 18, z = Math.sin(t) * 18, h = putHut(g, G, 3.8 + (i % 3) * 0.3, 3.1, 2.05, i + 5, x, z, face(x, z, 0, 0), { solids }); h.userData.noBatch = false; doors.push([Math.cos(t) * 15.2, Math.sin(t) * 15.2]); });
  /* more than a hundred and thirty houses on the hillsides: with the eight above, over 140 (Jamaica National Heritage Trust) */
  const far = farHuts(g, G, 134, [-78, -84, 70, 44], 17, (x, z, y) => { const d = Math.hypot(x, z); return d > 25 && d < 92 && y > -17 && G.trailness(x, z) < 0.01 && Math.abs(G.h(x + 2, z) - y) < 1.4 && Math.abs(G.h(x, z + 2) - y) < 1.4 && Math.hypot(x + 64, z + 61) > 9; });
  /* the great cotton tree, and the things of a working town */
  const ct = cottonTree(24, 3); put(g, G, ct, 7.5, -6, 0.6, { solids, r: ct.userData.reach });   /* the footprint is the whole spread of the buttress roots, so nobody stands between them */
  const fire = put(g, G, cookFire(true), -3, 3, 0, { solids }); put(g, G, jerkFrame(), -5.6, 5.2, 0.5, { solids }); put(g, G, mortar(), 2.6, 6.2, 0, { solids, r: 0.5 }); put(g, G, woodPile(8), -9.6, 9.8, 0.7, { solids }); put(g, G, stool(), -1.2, 4.6, 0, { solids, r: 0.35 }); put(g, G, stool(), -4.4, 1.4, 0, { solids, r: 0.35 });
  put(g, G, basketOf('yam'), 3.6, 5.2, 0, { solids, r: 0.4 }); put(g, G, basketOf('plantain'), 1.4, 7.2, 1, { solids, r: 0.4 }); put(g, G, gourd(), -2.2, 5.6, 0, { solids, r: 0.3 }); put(g, G, gourd(), 4.6, 6.6, 0, { solids, r: 0.3 });
  for (const [x, z, s, sd] of [[3.2, 11.6, 1.2, 2], [6.9, 8.7, 0.95, 5]]) { const b = boulder(s, sd); put(g, G, b, x, z, sd, { sink: 0.2, solids, r: s * 1.1 }); }   /* two rocks where the path comes in: solid, so you (and anyone with you) walk round them */
  /* the high rock above the clearing, with a flat stone on top */
  const rx = 3, rz = -24.5, ry0 = G.h(rx, rz), hr = grp(g), big = boulder(4.3, 9); big.position.set(rx, ry0 + 2.2, rz); hr.add(big); const b2 = boulder(2.6, 3); b2.position.set(rx + 3.6, ry0 + 1.0, rz + 1.2); hr.add(b2); const b3 = boulder(2.2, 6); b3.position.set(rx - 3.4, ry0 + 0.8, rz + 0.6); hr.add(b3);   /* the high rock is one thing made of three boulders and a flat slab that run into each other on purpose, so they share a group (the audit's overlap check compares separate things only) */ taken.add(rx, rz, 5.2); taken.add(rx + 3.6, rz + 1.2, 3.0); taken.add(rx - 3.4, rz + 0.6, 2.6);   /* the high rock keeps the forest off it */
  const slabY = ry0 + 5.35; cyl(1.25, 1.5, 0.5, PM.stone, rx, slabY - 0.25, rz, hr, 9);
  /* the provision ground: yam hills (three bare ones for you to plant), plantains, a low fence on the downhill side */
  const yams = [[-21, 3], [-23.6, 5.6], [-21.4, 7.9]].map(([x, z], i) => put(g, G, yamHill(0, i + 1), x, z, i, { solids, r: 0.55 }));
  for (const [x, z] of [[-26, 2.2], [-27.6, 5], [-26.4, 8], [-24.2, 9.8], [-24, 1.2], [-28.6, 7.4], [-21.6, 0.4], [-19.2, 9.6]]) put(g, G, yamHill(1, x * 3 | 0), x, z, x, { solids, r: 0.55 });   /* the mounds are solid: people walk between them, not through them */
  plantPlantains(g, spotsOn(G, 26, [-34, -4, -14, 15], 9, (x, z) => { const d = Math.hypot(x + 23, z - 5); return d > 8 && d < 12.5 && G.trailness(x, z) < 0.1; }, { smin: 0.8, smax: 1.25, room: 0.16 }));
  wattleFence(g, -30.4, 8.6, -25.2, 12.4, G.h(-28, 10.6) - 0.1); wattleFence(g, -25.2, 12.4, -18.6, 12.6, G.h(-22, 12.5) - 0.1); fenceSolid(solids, -30.4, 8.6, -25.2, 12.4); fenceSolid(solids, -25.2, 12.4, -18.6, 12.6);
  /* the forest all round, kept off the houses */
  const clearHuts = (x, z) => Math.hypot(x, z) > 24 && far.spots.every((p) => Math.hypot(p.x - x, p.z - z) > 4.2);
  forest(g, G, [-110, -115, 95, 90], { seed: 44, trees: 170, tall: 60, bushes: 150, ferns: 60, ground: 260, grass: 900, rocks: 60, keep: clearHuts, near: [-50, -50, 56, 68] });
  plantGrass(g, spotsOn(G, 380, [-19, -19, 19, 19], 5, (x, z) => { const d = Math.hypot(x, z); return d > 12.5 && d < 19 && G.trailness(x, z) < 0.75; }));
  /* 1734: the knoll by the path where the soldiers set their small cannon, the houses that burn, the soldiers in the empty town */
  const knoll = [22, 22], guns = [-1, 1].map((s) => { const sw = put(g, G, swivelGun(), knoll[0] + s * 1.2, knoll[1] + s * 0.6, face(knoll[0], knoll[1], 0, 0)); sw.visible = false; return sw; });
  const burn = far.spots.filter((p) => Math.hypot(p.x, p.z) < 46 && p.z > -34).slice(0, 9).concat(ANG.slice(3, 6).map((a) => ({ x: Math.cos(a * PI / 180) * 18, z: Math.sin(a * PI / 180) * 18 }))).map((p) => { const s = glowSprite(4.6); s.position.set(p.x, G.h(p.x, p.z) + 2.6, p.z); s.visible = false; s.userData.noBatch = true; g.add(s); return s; });
  const fireLight = new THREE.PointLight(0xff7a30, 0, 90, 1.2); fireLight.position.set(6, 9, 6); g.add(fireLight);
  const hearth = new THREE.PointLight(0xffa050, 0, 16, 1.6); hearth.position.set(-3, 1.0, 3); g.add(hearth);
  const sIn = pathLength(pathIn.dense), sBack = pathLength(back.dense);
  const people = [
    person('mimba', 'mimba', 'Auntie Mimba', -18.4, 4.2, face(-18.4, 4.2, -12, 3), { when: [20, 29] }), person('cubbenah', 'cubbenah', 'Cubbenah', 9.2, 1.6, face(9.2, 1.6, 0, 3), { when: [20, 29], props: [['RightHand', 'horn']] }), person('beneba', 'beneba', 'Beneba', -2.2, 8.2, face(-2.2, 8.2, 4, 9), { when: [20, 29] }),
    person('mama5', 'mama', 'Mama', -6.2, 10.4, face(-6.2, 10.4, 0, 6), { when: [50, 54] }), person('beneba5', 'beneba', 'Beneba', 1.6, -1.4, face(1.6, -1.4, 0, 6), { when: [50, 54], scale: 0.86, h: 1.46 }), person('phibba', 'phibba', 'Phibba', 2.9, -8.2, face(2.9, -8.2, 0, 0), { when: [50, 54], anim: 'Sad1' }),   /* by the cotton tree, on open ground in front of it: not between its roots */
    person('mama5b', 'mama', 'Mama', -65.4, -62.2, face(-65.4, -62.2, -62, -58), { when: [55, 59] }),
  ];
  const extras = [
    extra('nanny', rx, rz, face(rx, rz, 30, 60), 'Idle', { id: 'nanny', ground: slabY, when: [24, 29], far: true }),
    extra('mama', -7.4, -3.6, face(-7.4, -3.6, 0, 0), 'Idle', { id: 'mamaT', when: [20, 29] }), extra('quamin', 4.2, -10.2, face(4.2, -10.2, 0, 0), 'Idle', { id: 'quaminT', when: [20, 29] }),
    ...villagers(11, 5, [-11, -11.5, 11.5, 11], { face: [-3, 3] }).map((e) => ({ ...e, when: [20, 29] })), ...villagers(3, 9, [-27.5, 1, -19.5, 9.5]).map((e) => ({ ...e, when: [20, 29], anim: 'Idle' })),
    ...villagers(7, 13, [-10, -10, 9, 9], { anims: ['Idle', 'LookAround', 'Idle', 'IdleM'] }).map((e) => ({ ...e, when: [50, 54], flee: true })),
    extra('beneba', -62.2, -63.4, face(-62.2, -63.4, 0, 0), 'Idle', { when: [55, 59], scale: 0.86 }), extra('phibba', -61.4, -62.2, face(-61.4, -62.2, 0, 0), 'Idle', { when: [55, 59] }), ...villagers(4, 23, [-67.6, -64.2, -60.6, -58.2], { face: [0, 0] }).map((e) => ({ ...e, when: [55, 59] })),
    ...[[-2, 2], [2.5, -1], [-4, -4], [5, 4], [0, 7], [-7, 1], [3, -6.5], [-1.5, -8]].map(([x, z], i) => extra(i === 0 ? 'officer' : 'soldier', x, z, i * 1.3, 'Idle', { when: [55, 59], props: [['RightHand', 'musket']], far: true })),
  ];
  return { id: 'town', group: g, G, solids, start: { x: 36, z: 61.2, yaw: 0.35 }, env: ENV.morning, backdrop: { lift: -14, mist: -30 }, people, extras, fire, smokers: [{ x: -3, y: 0.9, z: 3, rate: 1.2 }, { x: -5.6, y: 0.8, z: 5.2, rate: 0.8 }],
    spots: { farHuts: far.spots.length, pathIn, back, sIn, sBack, yams, doors: doors.slice(0, 3), horn: [9.2, 1.6], rock: [rx, slabY, rz], backGate: [-9, -9.5], ridge: [ridge.x, ridge.y, ridge.z], knoll, guns, burn, fireLight, hearth, tree: [7.5, -6] } };
}

/* ============ chapters 3 and 4: the watch rock and the narrow path ============ */
/* The rock stands at the top of a steep drop. The path winds up the slope below it in plain view, then climbs the west flank to the rock.
   South (+z) is downhill. The top of the path (the spur) is where you can walk, and where the trenches are. */
export function buildWatch() {
  taken.reset();
  const g = grp(), solids = [], r = rng(61), pick = (a) => a[(r() * a.length) | 0];
  const spur = { w: 1.0, pts: [[-3.4, 1.4, 0], [-12, 2, -0.4], [-22, 5, -0.8], [-30, 11, -1.2], [-34, 19, -5.5], [-31, 27, -11]] };
  const climb = { w: 0.85, nowalk: true, pts: [[-31, 27, -11], [-23, 32, -17], [-12, 31, -19.5], [0, 28, -20.5], [12, 27, -21.5], [22, 31, -23.5], [24, 40, -27], [14, 47, -29.5], [2, 52, -31.5], [-2, 62, -35], [8, 70, -38.5], [20, 76, -41.5], [32, 86, -46.5], [40, 100, -52.5]] };
  const rock = { x: 0, z: 0, r: 4.6, y: 0, earth: 0.3, bench: 1.3 }, nook = { x: -12.6, z: -0.5, r: 1.7, y: -0.35, bench: 2 };
  const G = makeGround({ base: (x, z) => { const d = Math.hypot(x, z), end = 14 + 22 * smooth(-12, -30, x); return -15 * smooth(4.5, end, z) - 0.4 * Math.max(0, z - 14) - 0.06 * x + 0.46 * Math.max(0, -z - 5) + (fbm(x * 0.04, z * 0.04, 4, 71) - 0.5) * 9 * smooth(14, 55, d) * (z > 0 && z < 90 && Math.abs(x - 6) < 40 ? 0.35 : 1); }, trails: [spur, climb], flats: [rock, nook] });
  g.add(landMesh(G, { size: 380, seg: 170, seed: 14 })); trails(g, G);
  /* the rock: two boulders to hide between at the edge, one more beside, and the bare cliff under it */
  for (const [x, z, s, sd] of [[1.9, 4.5, 1.0, 2], [-1.7, 4.6, 0.9, 7], [3.7, 2.2, 0.9, 4]]) put(g, G, boulder(s, sd), x, z, sd * 1.3, { sink: 0.2, solids, r: s * 1.05 });
  const cliff = grp(g);   /* the face of the cliff below the rock: one thing made of boulders that run into each other on purpose */
  for (const [x, z, s, sd] of [[5.6, 7.2, 3.0, 8], [-5.2, 7.4, 2.6, 5], [0.4, 8.6, 3.4, 3], [10, 8.5, 2.6, 6], [-10, 9.5, 2.4, 9], [3, 12, 3.0, 11], [-4, 12.5, 2.6, 12]]) { const b = boulder(s, sd); b.position.set(x, G.h(x, z) - s * 0.25, z); cliff.add(b); taken.add(x, z, s * 1.1); }
  /* trenches beside the top of the path, each with a forked stick to rest a gun on (Thicknesse and Dallas, on a Windward town in 1739) */
  const sp = pathLength(spur.dense), TR = [0.5, 0.68, 0.88].map((k) => { const [x, z, a] = pathAt(spur.dense, sp * k), nx = Math.cos(a), nz = -Math.sin(a), tx = x + nx * 1.75, tz = z + nz * 1.75, t = put(g, G, trench(false), tx, tz, a + PI / 2); return { x: tx, z: tz, ax: x + nx * 0.4, az: z + nz * 0.4, t, fx: tx + Math.sin(a) * 1.5, fz: tz + Math.cos(a) * 1.5 }; });
  const sticks = put(g, G, grp(), 2.7, -2.5, 0); for (let i = 0; i < 4; i++) { const f = forkStick(1.05); f.rotation.z = PI / 2 - 0.1; f.position.set(0, 0.06 + i * 0.05, i * 0.09 - 0.14); f.rotation.y = 0.2 * i; sticks.add(f); } sticks.userData.noBatch = true;
  /* forest. No tall trees between the rock and the valley, and no bushes on the path itself, so the soldiers can be seen. */
  const offRock = (x, z) => Math.hypot(x, z) > 6.2 && distToPath(climb.dense, x, z) > 2.6, openView = (x, z) => Math.hypot(x, z) > 15 && !(z > -2 && z < 112 && Math.abs(x - 6 - z * 0.1) < 20 + z * 0.7) && distToPath(spur.dense, x, z) > 5 && distToPath(climb.dense, x, z) > 6;
  forest(g, G, [-125, -125, 125, 130], { seed: 66, trees: 200, tall: 70, bushes: 170, ferns: 70, ground: 260, grass: 800, rocks: 80, keep: offRock, keepTrees: openView, near: [-45, -30, 50, 80] });
  /* bushes on the slope beside the path that hide the Maroons; at the signal they are cut away. Each is its own small mesh so it can fall. */
  const posts = [[2, 23.5], [9, 22.5], [16, 22.6], [24.5, 26.5], [28.5, 34.5], [28, 43], [18, 51], [7.5, 43], [15, 36], [19, 40.5], [4, 47.5], [-7, 35.5], [-1, 34.5], [-8, 57], [12, 31.5], [10, 39], [22, 47.5], [-2, 45], [11, 55.5], [-10, 44], [-4, 23], [3, 39.5]];
  const cover = posts.map(([x, z], i) => { const c = grp(g, x, G.h(x, z), z); c.userData.noBatch = true; for (let k = 0; k < 3; k++) { const m = mesh(treeGeo('bush', i * 3 + k + 1), treeM, (k - 1) * 0.7, 0, (k % 2) * 0.5 - 0.25, c); m.scale.setScalar(1.25 + (k % 2) * 0.25); } return c; });
  const fighters = posts.map(([x, z], i) => { const [px, pz] = nearestOn(climb.dense, x, z); return { ...fighter(r, pick), x, z, ry: face(x, z, px, pz), anim: 'Idle', when: [40, 49], fighter: i, hiddenNow: true, far: true }; });
  /* the far spur where the soldiers are first seen: a low green ridge standing out of the mist, with a line of red coats on its back */
  const FS = { x: 50, z: 158, y: -56, a: 0.3, L: 62, H: 17 }, farSpur = mesh(new THREE.SphereGeometry(1, 22, 10, 0, PI * 2, 0, PI / 2), new THREE.MeshBasicMaterial({ color: 0x7c9c96, fog: false }), FS.x, FS.y, FS.z, g); farSpur.scale.set(FS.L, FS.H, 20); farSpur.rotation.y = FS.a; farSpur.userData.noBatch = true;
  const redline = new THREE.InstancedMesh(new THREE.BoxGeometry(0.42, 1.5, 0.42), new THREE.MeshBasicMaterial({ color: 0xb8362a, fog: false }), 16); redline.userData.noBatch = true; redline.frustumCulled = false; redline.visible = false; g.add(redline);
  const M = new THREE.Matrix4(), lineTick = (t) => { for (let i = 0; i < 16; i++) { const u = (((t * 0.012 + i * 0.026 + (i % 3) * 0.004) % 0.7) - 0.35) * 2 * 44; M.makeTranslation(FS.x + Math.cos(FS.a) * u, FS.y + FS.H * Math.sqrt(Math.max(0, 1 - (u / FS.L) * (u / FS.L))) + 0.6, FS.z - Math.sin(FS.a) * u); redline.setMatrixAt(i, M); } redline.instanceMatrix.needsUpdate = true; };
  /* the soldiers: a column that climbs the path. They are placed by the fight (main.js). */
  const column = []; for (let i = 0; i < 13; i++) column.push({ ...LOOKS[i === 0 ? 'officer' : i % 5 === 4 ? 'militia' : 'soldier'], x: 34 + i * 0.9, z: 96 + i, ry: 0, anim: 'Idle', when: [40, 49], column: i, props: i === 1 ? undefined : [['RightHand', 'musket']], hiddenNow: true, far: true });
  const people = [
    person('quamin3', 'quamin', 'Quamin', -2.5, 0.4, face(-2.5, 0.4, 0, 3), { when: [30, 39] }), person('cubbenah3', 'cubbenah', 'Cubbenah', 2.3, 0.2, face(2.3, 0.2, 0, 3), { when: [30, 49], props: [['RightHand', 'horn']] }),
    person('mama3', 'mama', 'Mama', -12.9, -0.9, face(-12.9, -0.9, -11, 1.8), { when: [33, 39] }), person('mama4', 'mama', 'Mama', -2.7, -1.9, face(-2.7, -1.9, 0, 1), { when: [43, 49] }),
  ];
  const extras = [...fighters, ...column, ...TR.map((t) => ({ ...fighter(r, pick), x: t.fx, z: t.fz, ry: face(t.fx, t.fz, 10, 40), anim: 'Idle', when: [34, 49], far: true, fixed: true }))];
  return { id: 'watch', group: g, G, solids, start: { x: -1.2, z: -2.6, yaw: PI }, env: ENV.haze, backdrop: { lift: -18, mist: -46 }, people, extras, tick: (dt, t) => { if (redline.visible) lineTick(t); },
    titleView: { x: -1, y: 2.5, z: -6.5, yaw: PI + 0.12, pitch: -0.1, env: ENV.dawn }, toned: [{ mat: farSpur.material, k: 0.5 }],
    spots: { spur, climb, sClimb: pathLength(climb.dense), look: [0, 3.5], place: [0.2, 4.0], trenches: TR, sticks, cover, redline, farSpur, far: [FS.x, FS.y + FS.H, FS.z], posts } };
}
function distToPath(d, x, z) { let b = 1e9; for (let i = 1; i < d.length; i++) { const ax = d[i - 1][0], az = d[i - 1][1], dx = d[i][0] - ax, dz = d[i][1] - az, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1))); b = Math.min(b, Math.hypot(x - ax - dx * t, z - az - dz * t)); } return b; }
function nearestOn(d, x, z) { let b = 1e9, o = [x, z]; for (let i = 1; i < d.length; i++) { const ax = d[i - 1][0], az = d[i - 1][1], dx = d[i][0] - ax, dz = d[i][1] - az, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1))), k = Math.hypot(x - ax - dx * t, z - az - dz * t); if (k < b) { b = k; o = [ax + dx * t, az + dz * t]; } } return o; }

/* ============ chapter 6: New Nanny Town, 5 August 1740 ============ */
export function buildNewTown() {
  taken.reset();
  const g = grp(), solids = [];
  const riverX = (z) => 27 + Math.sin(z * 0.06) * 4;
  const toRiver = { w: 1.3, pts: [[11, 3, 0], [16, 4.6, -0.3], [21, 6, -0.9]] };
  const main = { x: 0, z: 0, r: 13, y: 0, bench: 9, earth: 0.6 }, knoll = { x: -9, z: -37, r: 6, y: 2.4, bench: 8, nowalk: true, earth: 0.3 };
  const G = makeGround({ base: (x, z) => { const d = Math.hypot(x, z); return (fbm(x * 0.04, z * 0.04, 3, 81) - 0.5) * 2.4 + smooth(34, 120, d) * (16 + fbm(x * 0.02, z * 0.02, 4, 83) * 46) * (x > 16 ? 0.55 : 1) - 1.9 * Math.exp(-Math.pow((x - riverX(z)) / 4.2, 2)); }, trails: [toRiver], flats: [main, knoll] });
  g.add(landMesh(G, { size: 360, seg: 150, seed: 18 })); trails(g, G);
  const rd = []; for (let z = -120; z <= 120; z += 6) rd.push([riverX(z), z, 0]); const water = streamMesh(smoothPath(rd, 2), 4.4, -1.15, { speed: 1.1 }); g.add(water);
  plant(g, rockGeo(4), treeM, spotsOn(G, 46, [16, -60, 38, 60], 15, (x, z) => Math.abs(x - riverX(z)) < 5.5 && G.trailness(x, z) < 0.05, { smin: 0.3, smax: 1.2, room: 1.15 }), { sink: 0.2 });
  /* new houses round the clearing and across the valley floor */
  [35, 70, 105, 150, 205, 240, 300, 330].forEach((a, i) => { const t = a * PI / 180, x = Math.cos(t) * 16.6, z = Math.sin(t) * 16.6; putHut(g, G, 3.8 + (i % 2) * 0.4, 3.1, 2.05, i + 20, x, z, face(x, z, 0, 0), { solids }); });
  const far = farHuts(g, G, 46, [-70, -70, 20, 70], 27, (x, z, y) => { const d = Math.hypot(x, z); return d > 23 && d < 78 && G.trailness(x, z) < 0.01 && Math.abs(G.h(x + 2, z) - y) < 1.1 && Math.abs(G.h(x, z + 2) - y) < 1.1 && Math.hypot(x + 9, z + 37) > 11; });
  /* the meeting tree on its knoll, the paper on its stone, cook fire, gardens */
  const mt = cottonTree(21, 8); put(g, G, mt, -11.5, -39.5, 1.2, { solids, r: mt.userData.reach });   /* the meeting tree: its footprint is its whole root spread, so the people round Nanny stand clear of the roots */
  const stone = put(g, G, paperStone(), 3.6, -4.6, 0.3, { solids, r: 0.95 });
  put(g, G, cookFire(true), -5, 5.4, 0, { solids }); put(g, G, stool(), -3.4, 6.6, 0, { solids, r: 0.35 }); put(g, G, mortar(), -7.2, 3.4, 0, { solids, r: 0.5 }); put(g, G, basketOf('plantain'), -6.4, 7.6, 0, { solids, r: 0.4 }); put(g, G, woodPile(7), 7.6, 8.6, 1.1, { solids });
  for (const [x, z] of [[-20, 12], [-22.4, 14.6], [-19.6, 16.4], [-24, 11], [-17.4, 13.6], [-21.8, 18]]) put(g, G, yamHill(1, x | 0), x, z, x);
  plantPlantains(g, spotsOn(G, 30, [-34, 4, 18, 30], 9, (x, z) => { const d = Math.hypot(x, z); return d > 17 && d < 30 && G.trailness(x, z) < 0.05 && far.spots.every((p) => Math.hypot(p.x - x, p.z - z) > 4); }, { smin: 0.8, smax: 1.25, room: 0.16 }));
  forest(g, G, [-115, -115, 110, 115], { seed: 88, trees: 170, tall: 50, bushes: 130, ferns: 50, ground: 220, grass: 900, rocks: 40, keep: (x, z) => Math.hypot(x, z) > 21 && far.spots.every((p) => Math.hypot(p.x - x, p.z - z) > 4.2) && Math.abs(x - riverX(z)) > 5 && Math.hypot(x + 9, z + 37) > 8, near: [-45, -50, 40, 45] });
  plantGrass(g, spotsOn(G, 420, [-18, -18, 18, 18], 5, (x, z) => { const d = Math.hypot(x, z); return d > 11.5 && d < 18 && G.trailness(x, z) < 0.75; }));
  const hearth = new THREE.PointLight(0xffa050, 0, 14, 1.6); hearth.position.set(-5, 1.0, 5.4); g.add(hearth);
  const people = [person('mama6', 'mamaOld', 'Mama', -3.4, 3.2, face(-3.4, 3.2, 1, 0)), person('cub6', 'cubbenah', 'Cubbenah', 6.2, 4.4, face(6.2, 4.4, 1, 0), { props: [['RightHand', 'horn']] }), person('beneba6', 'benebaGrown', 'Beneba', 1.4, -3.2, face(1.4, -3.2, 2, 1))];
  const kx = -9, kz = -37, ky = 2.4;
  const nx = kx + 2.1, nz = kz + 1.5;   /* Nanny stands under the meeting tree's crown, in front of its roots, where you can see her from the clearing */
  const extras = [extra('nanny', nx, nz, face(nx, nz, nx - 6, nz - 30), 'Idle', { id: 'nanny6', ground: G.h(nx, nz), far: true }), ...villagers(8, 31, [kx - 2.6, kz + 3.2, kx + 5.4, kz + 6.4], { face: [nx, nz], anims: ['Idle'] }).map((e) => ({ ...e, wild: true, far: true })),
    extra('phibbaGrown', 3.2, -1.6, face(3.2, -1.6, 3.6, -4.6), 'Idle'), ...villagers(12, 35, [-11, -11, 11, 11], { face: [3.6, -4.6] })];
  return { id: 'newtown', group: g, G, solids, start: { x: 0.5, z: 9.5, yaw: 0.1 }, env: ENV.morning, backdrop: { lift: -4, mist: -200 }, people, extras, waters: [water], smokers: [{ x: -5, y: 0.9, z: 5.4, rate: 1.1 }],
    spots: { paper: [3.6, -4.6], stone, hearth, river: [21, 6] } };
}
