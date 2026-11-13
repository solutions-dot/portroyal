/* games/kendal/src/places2.js: the 1957 places: Kingston Railway Station, the inside of a wooden coach, a beach at Montego Bay,
   the crash site at night and at dawn, and the memorial at Kendal today. */
import * as THREE from 'three';
import { T, std, solid, flat, glow, mesh, box, cyl, plane, grp, rng, cv, grain } from './gfx.js';
import { rails, railsCurve, woodCoach, dieselLoco, platform, TM } from './trains.js';
import { palm, tree, banana, bush, flowers, boardHouse, hillRing, scatter, crate, hamper, suitcase, sack, bucket, bench, seatRock, pole, lampPost, torch, lantern, signBoard, standpipe, truck, PM } from './props.js';
import { ENV, stationBase, groundPlane, makeRig, TRACK_Y } from './common.js';
import { person, extra, crowd57, villagers, walkers, LOOKS } from './cast.js';
import { roadStrip } from './places1.js';

const PI = Math.PI;
const free = (walls) => (e) => !walls.some((w) => e.x > w[0] - 0.4 && e.x < w[2] + 0.4 && e.z > w[1] - 0.4 && e.z < w[3] + 0.4);

/* ============ chapter 4: Kingston Railway Station, Sunday morning ============ */
export function buildKingston57() {
  const g = grp(), walls = [], people = [], extras = [];
  stationBase(g, { x0: -80, x1: 50, zc: -3, zBack: 14, ground: [78, 108, 56] });
  /* the long platform roof, on iron posts */
  const zt = T.zinc([140, 146, 142]).clone(); zt.needsUpdate = true; zt.repeat.set(30, 3);
  const roof = box(96, 0.12, 12, std(zt, 0.8), 0, 4.1, 4.2, g); roof.rotation.x = -0.05;
  for (let x = -44; x <= 46; x += 8) { box(0.22, 4.1, 0.22, solid(0x34403a, 0.8), x, 2.05, 9.3, g); box(0.18, 0.18, 12, solid(0x34403a, 0.8), x, 3.95, 4.2, g); }
  walls.push(...[-44, -36, -28, -20, -12, -4, 4, 12, 20, 28, 36, 44].map((x) => [x - 0.3, 9.0, x + 0.3, 9.6]));
  /* the station building: cream walls, a row of arched doorways, a sign and a clock */
  const wall = std(T.plaster([228, 216, 186], [1, 1], 'rgb(120,110,86)').clone(), 1); wall.map.repeat.set(10, 1); wall.map.needsUpdate = true;
  const hall = box(100, 7.5, 9, wall, 0, 3.75, 18.5, g); walls.push([-50, 14, 50, 23]);
  const door = new THREE.MeshBasicMaterial({ color: 0x2a2018 }), arch = new THREE.MeshBasicMaterial({ color: 0x5a4a3a });
  for (let x = -42; x <= 42; x += 7) { box(2.2, 3.1, 0.2, door, x, 1.55, 14.0, g); const a = cyl(1.1, 1.1, 0.2, door, x, 3.1, 14.0, g, 14); a.rotation.x = PI / 2; a.scale.set(1, 1, 1); box(2.4, 0.18, 0.3, arch, x, 3.1, 13.95, g); box(1.6, 1.1, 0.12, new THREE.MeshBasicMaterial({ color: 0x24323a }), x + 3.5, 5.3, 14.0, g); }
  const sg = signBoard('KINGSTON', 9, 1.3, { bg: '#244a3a', fg: '#f4ecd0', font: '700 112px Georgia, serif' }); sg.position.set(0, 6.4, 13.9); g.add(sg);
  const ck = mesh(new THREE.CircleGeometry(0.7, 24), new THREE.MeshBasicMaterial({ map: T.clock(), polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), 14, 5.8, 13.8, g);
  for (let x = -30; x <= 40; x += 14) { const lp = lampPost(3.4, false); lp.position.set(x, 0, 10.4); g.add(lp); }
  for (const [x, z] of [[-14, 10.5], [26, 10.5]]) { const b = bench(2.4); b.position.set(x, 0, z); b.rotation.y = PI; g.add(b); }
  /* the train: twelve wooden coaches and two diesel engines, facing west (toward the front, far away in the haze) */
  const train = grp(g, 0, 0, -3), coaches = [];
  for (let i = 0; i < 12; i++) { const c = woodCoach(12 - i); c.position.x = 33 - i * 11.8; train.add(c); coaches.push(c); }
  const dA = dieselLoco(); dA.position.x = 33 - 11 * 11.8 - 5.5 - 0.8 - 6.7 - 0.4; train.add(dA); const dB = dieselLoco(); dB.position.x = dA.position.x - 14.2; train.add(dB);
  train.userData.wheels = [...coaches, dA, dB].flatMap((v) => v.userData.wheels);
  walls.push([-140, -4.8, 41, -1.1]);
  /* vendors and baggage */
  const stall = grp(g, 16, 0, 9); box(2.6, 0.9, 0.9, TM.wood, 0, 0.45, 0, stall); const roofS = box(3.0, 0.08, 1.4, solid(0xd8a030, 0.9), 0, 2.2, 0, stall); roofS.rotation.x = 0.1; for (const x of [-1.4, 1.4]) box(0.08, 2.2, 0.08, TM.woodDark, x, 1.1, 0.5, stall); for (let i = 0; i < 4; i++) { const h = hamper(); h.position.set(-0.9 + i * 0.6, 0.9, 0); stall.add(h); } walls.push([14.6, 8.4, 17.4, 9.6]);
  for (const [x, z, k] of [[-10, 3.2, 0], [-8.8, 3.6, 1], [6, 8, 2], [22, 2, 0], [27, 3, 1], [36, 2.4, 2]]) { const o = k === 0 ? hamper() : k === 1 ? suitcase() : sack(); o.position.set(x, 0, z); o.rotation.y = x; g.add(o); }
  scatter(g, (i) => (i % 3 ? palm(7 + (i % 4), i) : tree(6, i)), 60, [-150, -70, 150, -8], [[-150, -9, 150, -1]], 22);   /* the town and fields beyond the track */
  g.add(hillRing(200, 14, 80, { seed: 31 }));
  people.push(person('gran', 'gran', 'Gran', -4, 5.6, 0.5, { h: 1.7, props: [['RightHand', 'hamper']] }));
  people.push(person('lloyd', 'lloyd', 'Lloyd', -1.8, 4.6, -0.6, { h: 1.3, anim: 'Wave' }));
  people.push(person('ezra', 'ezra57', 'Mass Ezra', 9, 9.6, PI * 1.1, { h: 1.8 }));
  people.push(person('guard', 'guard57', 'Mr. Ellis', 3, 1.2, 0, { h: 1.8, path: [[3, 1.2], [22, 1.2]] }));
  people.push(person('pearl', 'vendor', 'Miss Pearl', 16, 7.6, PI, { h: 1.7 }));
  extras.push(...walkers(crowd57(34, 57, [-26, 1.4, 44, 8.6], { faceZ: PI * 0.8 }).filter(free(walls)), 8, [-30, 1.4, 44, 8.6], 0.35, 9));
  extras.push(...crowd57(8, 71, [-50, 1.6, -28, 8], { faceZ: -PI / 2 }).filter(free(walls)));
  return { id: 'kingston57', group: g, walls, bounds: { x0: -52, x1: 44, z0: 0.2, z1: 8.6 }, start: { x: -22, z: 5, yaw: -PI / 2 + 0.4 }, people, extras, env: ENV.morning, train, coaches, diesels: [dA, dB],
    titleView: { x: 46, y: 0.5, z: -10, yaw: PI / 2 + 0.52, pitch: 0.02 }, spots: { board: [35.4, 0.5], coachEnd: [39.5, -3] }, tick: () => {} };
}

/* ============ the inside of a wooden coach: seven rows of benches, an aisle, windows both sides, a rig of scenery passing outside ============ */
export function buildCoach() {
  const g = grp(), walls = [], people = [], extras = []; const L = 10.4, W = 2.5;
  const rig = makeRig('coast'); rig.group.position.y = TRACK_Y - 0.1; g.add(rig.group);
  const wallM = std(T.plank([110, 60, 46], 18, [L / 1.2, 1], true), 0.9), wood = std(T.plank([118, 82, 54], 6, [L / 1.5, 1]), 0.9), ceil = std(T.plank([196, 176, 140], 24, [L / 1.5, 1], true), 0.95, { side: THREE.DoubleSide }), seatM = solid(0x7a5632, 0.85), dark = solid(0x2f2218, 0.9);
  box(L, 0.1, W, wood, 0, -0.05, 0, g);
  for (const s of [-1, 1]) { box(L, 0.95, 0.1, wallM, 0, 0.475, s * W / 2, g); box(L, 0.5, 0.1, wallM, 0, 2.2, s * W / 2, g); for (let i = 0; i < 9; i++) box(0.26, 1.1, 0.12, wallM, -L / 2 + 0.3 + i * 1.28, 1.45, s * W / 2, g); box(L, 0.05, 0.18, dark, 0, 0.97, s * (W / 2 - 0.04), g); box(L, 0.05, 0.18, dark, 0, 1.97, s * (W / 2 - 0.04), g); }
  for (const s of [-1, 1]) { box(0.1, 2.5, W, wallM, s * L / 2, 1.25, 0, g); box(0.06, 2.0, 0.9, solid(0x3a2418, 0.9), s * (L / 2 - 0.06), 1.0, 0, g); }
  const arc = new THREE.CylinderGeometry(W / 2 + 0.05, W / 2 + 0.05, L, 20, 1, true, 0, PI); arc.rotateZ(PI / 2); const ceiling = new THREE.Mesh(arc, ceil); ceiling.scale.set(1, 0.32, 1); ceiling.position.y = 2.45; g.add(ceiling);
  const rows = [], seatSlots = [];
  const SEAT = 0.4;   /* the top of a bench seat; people sit on it with the hip joint 12 cm above (see SIT_HIPS in main.js) */
  for (let i = 0; i < 7; i++) { const x = -4.2 + i * 1.42; rows.push(x); for (const s of [-1, 1]) { box(0.5, 0.07, 0.95, seatM, x, SEAT - 0.035, s * 0.78, g); box(0.06, 0.72, 0.95, seatM, x + 0.27, SEAT + 0.35, s * 0.78, g); box(0.08, SEAT - 0.07, 0.9, dark, x, (SEAT - 0.07) / 2, s * 0.78, g); seatSlots.push([x, s * 0.78, s]); } }
  walls.push([-5.2, -1.3, 5.2, -0.3], [-5.2, 0.3, 5.2, 1.3]);   /* the benches; you walk in the aisle between them */
  for (const x of [-3.2, 0, 3.2]) { cyl(0.16, 0.16, 0.06, new THREE.MeshBasicMaterial({ color: 0xffe3a6 }), x, 2.62, 0, g, 12); }
  const lamp = new THREE.PointLight(0xffd9a0, 9, 14, 1.3); lamp.position.set(0, 2.3, 0); g.add(lamp);
  for (const [x, z, k] of [[-4.6, 0.0, 0], [4.7, -0.1, 1], [-4.4, -0.1, 2], [4.5, 0.15, 0], [-1.5, 0.1, 1]]) { const o = k === 0 ? hamper() : k === 1 ? suitcase() : sack(); o.position.set(x, 0, z); o.rotation.y = x; g.add(o); }
  /* the passengers: Gran, Lloyd and the mother have their seats; the rest are made up from the crowd generator, sitting */
  people.push(person('gran5', 'gran', 'Gran', rows[4], -0.96, -PI / 2, { anim: 'SitIdle', h: 1.35, seat: SEAT }));
  people.push(person('lloyd5', 'lloyd', 'Lloyd', rows[4], -0.42, -PI / 2, { anim: 'SitTalk', h: 1.05, seat: SEAT }));
  people.push(person('mother', 'mother', 'The mother', rows[2], 0.5, -PI / 2, { anim: 'SitIdle', h: 1.35, seat: SEAT }));
  const taken = (x, s, k) => (x === rows[4] && s < 0) || (x === rows[2] && s > 0 && k === 0) || ((x === rows[3] || x === rows[5]) && s > 0 && k === 1);
  const crowd = crowd57(30, 33, [0, 0, 1, 1], { anims: ['SitIdle'], kids: 0.18 }); let ci = 0;
  for (const x of rows) for (const s of [-1, 1]) for (const k of [0, 1]) { if (taken(x, s, k) || (Math.round(x * 10) + k + (s > 0 ? 1 : 0)) % 4 === 0) continue; const e = crowd[ci++]; Object.assign(e, { x, z: s * (k ? 0.93 : 0.5), ry: -PI / 2, anim: ['SitIdle', 'SitTalk'][(ci * 7) % 2], seated: true, seat: SEAT, props: undefined }); extras.push(e); }
  return { id: 'coach', group: g, walls, bounds: { x0: -4.8, x1: 4.8, z0: -0.28, z1: 0.28 }, start: { x: 4.3, z: 0, yaw: PI / 2 }, people, extras, env: ENV.day, rig, lamp, ride: true, wheels: [],
    spots: { seat: [rows[4], -0.25], windows: [[-2.5, 0.2, 1], [2.9, -0.2, -1]] }, tick: () => {} };
}

/* ============ a beach at Montego Bay ============ */
export function buildBeach() {
  const g = grp(), walls = [], people = [], extras = [];
  const sandM = mesh(new THREE.PlaneGeometry(900, 460), std(T.sand([90, 46]), 1), 0, 0, 210, g); sandM.rotation.x = -PI / 2;
  const sea = mesh(new THREE.PlaneGeometry(800, 500), std(T.water([60, 40]).clone(), 0.35, { metalness: 0.1, transparent: true, opacity: 0.92 }), 0, -0.08, -270, g); sea.rotation.x = -PI / 2; sea.material.map.needsUpdate = true; sea.userData.noBatch = true;
  const foam = mesh(new THREE.PlaneGeometry(400, 3), new THREE.MeshBasicMaterial({ map: cv(256, 64, (x, w, h) => { const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.85)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, w, h); }, [60, 1], true), transparent: true, depthWrite: false }), 0, -0.04, -20.5, g); foam.rotation.x = -PI / 2; foam.userData.noBatch = true;
  const wet = mesh(new THREE.PlaneGeometry(400, 3.5), new THREE.MeshBasicMaterial({ color: 0x9a8a68, transparent: true, opacity: 0.45, depthWrite: false }), 0, 0.01, -18.2, g); wet.rotation.x = -PI / 2;
  scatter(g, (i, r) => palm(6 + r() * 3, i), 22, [-60, 14, 60, 30], [], 6); scatter(g, (i) => bush(i, 1.2), 14, [-60, 12, 60, 24], [], 9); { const hr = hillRing(260, 18, 70, { seed: 5 }); hr.children.forEach((c) => { if (c.position.z < 90) c.visible = false; }); g.add(hr); }
  const cabin = boardHouse(6, 4, 2.6, { wall: [220, 210, 190], roof: [190, 80, 70], seed: 4 }); cabin.position.set(-32, 0, 17); cabin.rotation.y = PI; g.add(cabin); walls.push([-35.4, 14.8, -28.6, 19.2]);
  const um = (x, z, c) => { const u = grp(g, x, 0, z); cyl(0.04, 0.04, 2.6, TM.woodDark, 0, 1.3, 0, u, 6); const top = mesh(new THREE.ConeGeometry(1.6, 0.6, 12), solid(c, 0.9), 0, 2.7, 0, u); const tw = plane(1.0, 1.7, solid(c === 0xd94a3a ? 0xf0e6c8 : 0xe9a04a, 1), 1.3, 0.02, 0.3, u); tw.rotation.x = -PI / 2; return u; };
  for (const [x, z, c] of [[-8, 9, 0xd94a3a], [10, 7, 0xf0c040], [-20, 4, 0x3a8ad9], [24, 11, 0xd94a3a], [-2, 11.4, 0x3ab07a]]) um(x, z, c);
  walls.push([-9.5, 7.8, -6.5, 10.2], [8.5, 5.8, 11.5, 8.2]);
  const castle = grp(g, -12, 0, -4); castle.userData.noBatch = true; const mound = mesh(new THREE.ConeGeometry(1.2, 1.0, 10), solid(0xd6c394, 1), 0, 0.5, 0, castle); mound.scale.set(0.01, 0.01, 0.01); castle.userData.mound = mound;
  const band = grp(g, 14, 0, 4); const box1 = box(0.5, 0.5, 0.5, TM.wood, 1.4, 0.25, 0.2, band); box(0.1, 0.5, 0.14, TM.woodDark, 1.4, 0.55, 0.2, band);
  people.push(person('gran4', 'gran', 'Gran', 0, 7.8, PI, { h: 1.7 }));   /* PI: she faces the sea (north, -z) */
  const beachers = walkers(crowd57(14, 91, [-26, -14.5, 26, -9], { anims: ['Idle', 'Wave', 'Laugh', 'Cheer', 'Idle'], faceZ: PI, kids: 0.4 }), 4, [-34, -15.5, 34, 11], 0.7, 9); extras.push(...beachers);
  extras.push(...walkers(crowd57(10, 17, [-30, 2, 30, 12], { anims: ['Idle', 'Talk1', 'Laugh'], faceZ: PI * 0.5 }).filter(free(walls)), 6, [-34, -15.5, 34, 11], 0.7, 10));
  extras.push(extra('clive', 13.3, 4.9, -0.8, 'Clap', { skin: 1 }), extra('worker45', 14.6, 3.2, -PI / 2 + 0.2, 'Clap'), extra('muleteer', 14.4, 5.4, -PI * 0.7, 'Talk2'));
  return { id: 'beach', group: g, walls, bounds: { x0: -38, x1: 38, z0: -17, z1: 13 }, start: { x: 0, z: 9.5, yaw: PI * 0.04 }, people, extras, env: ENV.day, sea, castle, bandPos: [14, 4.2], seaTex: sea.material.map,
    spots: { sea: [0, -16], castle: [-12, -2.6], band: [12.2, 4.4] }, tick: (dt, t) => { sea.material.map.offset.set(t * 0.004, t * 0.01); sea.position.y = -0.08 + Math.sin(t * 0.9) * 0.03; foam.position.z = -20.5 + Math.sin(t * 0.7) * 0.6; foam.material.opacity = 0.6 + Math.sin(t * 0.7) * 0.3; } };
}

/* ============ the crash site: the embankment, two coaches that stayed on the rails, and the wreck in the gully ============ */
export function buildCrash() {
  const g = grp(), walls = [], people = [], extras = [];
  groundPlane(g, 0, 900, T.grass([200, 200], [48, 74, 40]));
  const bed = box(90, 0.28, 6.2, solid(0x5a4638, 1), 25, 0.14, 0, g);
  const tr = rails(80); tr.position.set(30, 0, 0); g.add(tr); const curve = railsCurve(60, 0, 0.55, 14); curve.position.set(-10, 0, 0); curve.scale.x = -1; g.add(curve);
  const coaches = [], trainG = grp(g, 0, 1.69, 0);
  const c0 = woodCoach(12); c0.position.set(24, 0, 0); trainG.add(c0); const c1 = woodCoach(11); c1.position.set(12.2, 0, 0); trainG.add(c1);
  walls.push([6.2, -2.2, 30.6, 1.5]);
  /* the wreck: the rest of the coaches, flung into the gully on the north side of the line, piled, tilted and broken */
  const r = rng(99), pile = grp(g, 0, 0, 0); const wreck = [];
  for (let i = 0; i < 8; i++) { const c = woodCoach(10 - i); c.userData.wheels = []; const a = i / 8; c.position.set(2 - a * 36 + (r() - 0.5) * 3, 0.9 + r() * 1.6 + (i % 3) * 0.7, -7 - a * 3 - r() * 4 - (i % 2) * 1.5); c.rotation.set((r() - 0.5) * 0.9, (r() - 0.5) * 1.3, (r() - 0.5) * 0.8 + (i % 2 ? 0.5 : -0.4)); pile.add(c); wreck.push(c); }
  for (let i = 0; i < 70; i++) { const b = box(0.1 + r() * 0.2, 0.06, 0.8 + r() * 1.6, solid(0x5a2a22, 0.95), 4 - r() * 44, 0.1 + r() * 0.4, -4 - r() * 16, pile); b.rotation.set(r() * 3, r() * 3, r() * 3); }
  walls.push([-46, -24, 6, -4.4]);
  /* the road above the line, with trucks and their headlights */
  roadStrip(g, -90, 90, 30, 6.4); const t1 = truck(); t1.position.set(6, 0, 30); t1.rotation.y = 0.0; g.add(t1); const t2 = truck(0x7a3a2a); t2.position.set(-10, 0, 30.6); t2.rotation.y = PI; g.add(t2); walls.push([4, 28.4, 8.6, 31.6], [-12.6, 28.8, -7.4, 32.4]);
  scatter(g, (i, rr) => (rr() < 0.3 ? palm(6 + rr() * 3, i) : tree(5 + rr() * 3, i)), 80, [-80, -60, 90, 70], [[-60, -30, 70, 36]], 41);
  g.add(hillRing(150, 14, 60, { seed: 8, base: [0.09, 0.16, 0.12] }));
  /* the calling place, a pipe, a fire and torches */
  const lp = lampPost(3.4, true); lp.position.set(-6, 0, 15); g.add(lp); const tb = box(1.6, 0.8, 0.7, TM.wood, -6, 0.4, 16.2, g); walls.push([-6.9, 15.7, -5.1, 16.7]);
  const sp = standpipe(); sp.position.set(26, 0, 8); g.add(sp); walls.push([25.4, 7.4, 26.6, 8.6]); const bk = bucket(); bk.position.set(25.3, 0, 8.7); g.add(bk);
  const fire = grp(g, -3, 0, 6); fire.userData.noBatch = true; for (let i = 0; i < 5; i++) { const lg = cyl(0.06, 0.06, 0.8, TM.woodDark, Math.cos(i * 1.26) * 0.25, 0.18, Math.sin(i * 1.26) * 0.25, fire, 5); lg.rotation.z = Math.cos(i * 1.26) * 0.8; lg.rotation.x = Math.sin(i * 1.26) * 0.8; }
  const flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); flame.scale.set(1.5, 2.0, 1); flame.position.y = 0.9; fire.add(flame);
  const torches = []; for (const [x, z] of [[-10, 3], [0, 3.6], [16, 6], [-2, 12], [-14, 10], [8, 16]]) { const t = torch(); t.position.set(x, 0, z); t.userData.noBatch = true; g.add(t); torches.push(t); }
  const l1 = new THREE.PointLight(0xffb060, 9, 24, 1.8); l1.position.set(-3, 2.2, 6); l1.userData.k = 1; g.add(l1); const l2 = new THREE.PointLight(0xffc880, 7, 22, 1.8); l2.position.set(-6, 3.4, 14); l2.userData.k = 1; g.add(l2);
  /* people */
  people.push(person('gran6', 'gran', 'Gran', 14, 4.4, PI + 0.4, { h: 1.7, anim: 'Idle' }));
  extras.push(extra('lloyd', 15.4, 4.1, PI + 0.9, 'Sad1'));
  people.push(person('clive', 'clive', 'Mr. Clive', 5, 7.4, PI + 0.2, { h: 1.8, props: [['RightHand', 'lantern']] }));
  people.push(person('nurse', 'nurse', 'Nurse Gray', -4, 8.6, PI * 1.1, { h: 1.7 }));
  people.push(person('dawn', 'dawn', 'Dawn', 9.5, 10, PI, { h: 1.05, anim: 'Sad1' }));
  people.push(person('louise', 'louise', 'Sister Louise', -6.6, 13.6, PI, { h: 1.7, props: [['RightHand', 'lantern']] }));
  const sit = [[-2.6, 8.8], [-4.8, 9.8], [-1.2, 10.2], [-6.0, 7.6]];
  for (const [i, [x, z]] of sit.entries()) {   /* survivors rest on flat-topped rocks by the fire (the sitting poses are chair-high, so a rock is about 0.46 m) */
    const ry = PI * 0.4 + i, top = 0.34 + (i % 3) * 0.04, rk = seatRock(top, 0.36, i + 1); rk.position.set(x, 0, z); g.add(rk); walls.push([x - 0.45, z - 0.45, x + 0.45, z + 0.45]);
    extras.push({ ...crowd57(1, 50 + i, [0, 0, 1, 1], { anims: ['SitDisbelief'] })[0], x, z, ry, anim: ['SitDisbelief', 'Sad2'][i % 2], blanket: true, seat: top });
  }
  extras.push(...villagers(16, 61, [-14, 1, 22, 13], { faceZ: PI }).filter(free(walls)));
  extras.push(...villagers(6, 73, [-12, 14, 4, 20], { faceZ: PI }).map((e) => ({ ...e, anim: 'Talk1' })));
  extras.push(...villagers(4, 83, [-30, -3.5, -12, -1.5], { faceZ: 0, lamp: 1 }));
  return { id: 'crash', group: g, walls, bounds: { x0: -36, x1: 34, z0: 2.6, z1: 24 }, start: { x: 17, z: 5.8, yaw: PI * 0.5 + 0.2 }, people, extras, env: ENV.night, lights: [l1, l2], torches, flame, fire, coaches: [c0, c1], wreck, trucks: [t1, t2],
    spots: { pipe: [25.2, 9.4], nurse: [-4, 9.2], calling: [-6, 14.2], lamp: [-1, 13] }, tick: (dt, t) => { const f = 0.85 + Math.sin(t * 13) * 0.1 + Math.sin(t * 7.3) * 0.08; l1.intensity = 9 * f * l1.userData.k; l2.intensity = 7 * (0.9 + Math.sin(t * 9) * 0.1) * l2.userData.k; flame.scale.set(1.5 * f, 2.0 * f, 1); for (const t2 of torches) { const fl = t2.userData.flame; if (fl) { const s = 0.9 + Math.sin(t * 11 + t2.position.x) * 0.15; fl.scale.set(0.9 * s, 1.1 * s, 1); } } } };
}

/* ============ the memorial at Kendal, today ============ */
export function buildMemorial() {
  const g = grp(), walls = [], people = [], extras = [];
  groundPlane(g, 0, 900, T.grass([200, 200], [82, 124, 58]));
  const tr = rails(120); tr.position.set(10, 0, 8); g.add(tr); const gr = [0x6a9a3a, 0x7aa844, 0x5a8a34];
  const rr = rng(3); for (let i = 0; i < 160; i++) { const c = mesh(new THREE.ConeGeometry(0.07, 0.5 + rr() * 0.7, 4), solid(gr[i % 3], 1), -45 + rr() * 110, 0.35, 8 + (rr() - 0.5) * 3.2, g); c.rotation.z = (rr() - 0.5) * 0.5; }   /* grass growing over the old track */
  const pave = box(18, 0.06, 10, std(T.concrete([6, 3], [190, 186, 176]).clone(), 0.95), 4, 0.03, -6, g);
  /* the monument: a long low wall of stone with a plaque, and a slab at its foot */
  const stone = std(T.stone([140, 138, 130], [4, 1]).clone(), 0.9); const wallM = box(9, 2.0, 0.7, stone, 4, 1.0, -9.5, g); wallM.rotation.y = 0.06; box(9.6, 0.25, 1.3, solid(0x8a8880, 0.9), 4, 0.12, -9.4, g).rotation.y = 0.06;
  const plaque = cv(512, 192, (x, w, h) => { x.fillStyle = '#2a2d30'; x.fillRect(0, 0, w, h); x.fillStyle = '#e6e0cc'; x.textAlign = 'center'; x.font = '700 36px Georgia, serif'; x.fillText('KENDAL', w / 2, 44); x.font = '24px Georgia, serif'; x.fillText('1 September 1957', w / 2, 80); x.font = 'italic 24px Georgia, serif'; x.fillText('We remember them', w / 2, 118);
    x.fillStyle = 'rgba(230,224,204,0.45)'; for (let r = 0; r < 2; r++) for (let i = 0; i < 18; i++) x.fillRect(40 + i * 24, 140 + r * 18, 18, 3); });
  plane(4.4, 1.65, std(plaque, 0.7), 4.0, 1.05, -9.12, g).rotation.y = 0.06; walls.push([-0.6, -10.2, 8.8, -8.7]);
  const sb = grp(g, -8, 0, -4); for (const x of [-1.3, 1.3]) box(0.12, 2.4, 0.12, TM.woodDark, x, 1.2, 0, sb); const bt = cv(512, 256, (x, w, h) => { x.fillStyle = '#f1ead8'; x.fillRect(0, 0, w, h); x.strokeStyle = '#25211b'; x.lineWidth = 6; x.strokeRect(6, 6, w - 12, h - 12); x.fillStyle = '#25211b'; x.textAlign = 'center'; x.font = '700 38px Georgia, serif'; x.fillText('The Kendal Train Crash', w / 2, 56); x.font = '24px Georgia, serif'; x.fillText('1 September 1957', w / 2, 96); x.textAlign = 'left'; x.font = '20px Georgia, serif'; for (const [i, t] of ['A church excursion train came home from the sea.', 'It ran downhill and left the rails here.', 'Hundreds of people from Kendal came to help.'].entries()) x.fillText(t, 36, 142 + i * 32); });
  plane(2.8, 1.4, std(bt, 0.8), 0, 1.7, 0.08, sb); walls.push([-9.6, -4.4, -6.4, -3.6]);
  scatter(g, (i, r) => (r() < 0.4 ? palm(6 + r() * 3, i) : tree(5 + r() * 3, i)), 60, [-70, -50, 70, 50], [[-30, -14, 30, 14]], 17); scatter(g, (i) => banana(i), 8, [14, -20, 30, -12], [], 7);
  g.add(hillRing(140, 14, 55, { seed: 10 })); roadStrip(g, -90, 90, 20, 6);
  const b1 = bench(2.2); b1.position.set(14, 0, -3); b1.rotation.y = PI * 0.9; g.add(b1); walls.push([12.8, -3.9, 15.2, -2.1]);
  people.push(person('joy', 'joy', 'Miss Joy', 0, -4.2, 0.1, { h: 1.7 }));
  people.push(person('andre', 'andre', 'Andre', 7.5, -4.6, -0.3, { h: 1.55 }));
  const kidc = [0xe4883a, 0x2f8a6a, 0xd9506a, 0x4a7ad9, 0xe8c040, 0x9a5ad9]; for (let i = 0; i < 6; i++) extras.push({ base: 'nb_youth', tint: { Shirt: kidc[i], Breeches: [0x2a3a5a, 0x3a3a3a][i % 2], Shoes: 0xf0ece0, Hair: 0x1c1816 }, hide: ['Hat'], scale: 0.7 + (i % 3) * 0.06, x: 2 + i * 1.1, z: -2.4 + (i % 2) * 0.8, ry: PI * 0.1, anim: ['Idle', 'Talk1', 'Idle', 'Laugh'][i % 4], skin: 0.9 + (i % 4) * 0.1 });
  return { id: 'memorial', group: g, walls, bounds: { x0: -26, x1: 26, z0: -8, z1: 6 }, start: { x: 0, z: 4.6, yaw: 0 }, people, extras, env: ENV.day, flowerSpot: [4, -8.0],
    spots: { board: [-8, -2.8], wall: [4, -8.2], flower: [9.5, -7.6] }, tick: () => {} };
}
