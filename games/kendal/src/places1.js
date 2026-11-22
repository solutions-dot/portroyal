/* games/kendal/src/places1.js: the first three chapters' places: the Spanish Town road (1844), the Kingston terminus (1845),
   the open carriage of the first train, and a hill station (1890s). Each builder returns the group, walking bounds, walls,
   people, background figures and the spots the game's actions use. Coordinates are metres; yaw 0 looks toward -z. */
import * as THREE from 'three';
import { T, std, solid, flat, mesh, box, cyl, plane, grp, rng } from './gfx.js';
import { rails, steamLoco, carriage1845, wagon, TM } from './trains.js';
import { palm, tree, banana, bananaBunch, bush, boardHouse, shed, hillRing, scatter, mule, yamBasket, provisionSack, bananaLoad, cart, crate, sack, hamper, barrel, bucket, pole, lampPost, milestone, signBoard, surveyPole, waterTower, bench, suitcase, PM } from './props.js';
import { ENV, stationBase, groundPlane, makeRig, TRACK_Y } from './common.js';
import { person, extra, crowd45 } from './cast.js';

const PI = Math.PI;
export function roadStrip(parent, x0, x1, z, w, y = 0.02) {   /* a dirt road along x, with the ruts running its length */
  const t = T.dirt([1, Math.abs(x1 - x0) / 5]); const m = mesh(new THREE.PlaneGeometry(w, Math.abs(x1 - x0)), std(t, 1), 0, 0, 0); m.rotation.x = -PI / 2; const h = grp(parent, (x0 + x1) / 2, y, z); h.rotation.y = PI / 2; h.add(m); return h;
}
const flagMat = () => std(T.unionJack(), 0.9, { side: THREE.DoubleSide });

/* ============ chapter 1: the Spanish Town road, about 1844 ============ */
export function buildRoad() {
  const g = grp(), walls = [], people = [], extras = [];
  groundPlane(g, 0, 900, T.grass([200, 200], [92, 124, 58]));
  roadStrip(g, -60, 60, 0, 6.2);
  const house1 = boardHouse(6, 4, 2.8, { wall: [180, 150, 100], seed: 2 }); house1.position.set(-22, 0, -10); g.add(house1); walls.push([-25.6, -12.5, -18.4, -7.4]);
  const house2 = boardHouse(5, 4, 2.6, { wall: [196, 176, 130], roof: [150, 100, 76], seed: 3 }); house2.position.set(12, 0, 11); house2.rotation.y = PI; g.add(house2); walls.push([9.2, 8.6, 14.8, 13.2]);
  const keepClear = [[-40, -8, 50, 8]]; scatter(g, (i, r) => (r() < 0.4 ? palm(6 + r() * 3, i) : tree(5 + r() * 3, i)), 70, [-70, -50, 70, 50], keepClear, 4);
  scatter(g, (i) => banana(i), 10, [-30, 6, -14, 14], [[-30, 6, -16, 8]], 7);
  scatter(g, (i) => bush(i, 1.1), 40, [-60, -14, 60, 14], [[-60, -3.6, 60, 3.6]], 9);
  g.add(hillRing(170, 16, 55, { seed: 4 }));
  const ms = milestone('S. TOWN'); ms.position.set(-8, 0, 3.8); ms.rotation.y = PI; g.add(ms);
  /* the railway works, off the north side of the road: a raised bank of red earth, a stack of iron rails and a stack of sleepers */
  const bankM = solid(0x9a5a38, 1); box(44, 1.1, 4.2, bankM, 34, 0.55, -9.2, g); box(44, 0.6, 7, bankM, 34, 0.3, -9.2, g); walls.push([12, -12.5, 56, -6.4]);
  for (let i = 0; i < 6; i++) box(5.6, 0.1, 0.12, TM.steel, 24, 0.1 + i * 0.12, -4.7 + (i % 2) * 0.2, g); for (let i = 0; i < 7; i++) box(2.6, 0.14, 0.22, solid(0x6b4a30, 0.95), 29, 0.1 + i * 0.15, -4.8, g);
  walls.push([21, -5.4, 27, -4]); walls.push([27.6, -5.6, 30.4, -4]);
  for (const x of [26, 32, 38]) { const p = surveyPole(); p.position.set(x, 0, -3.5); g.add(p); walls.push([x - 0.18, -3.68, x + 0.18, -3.32]); }   /* nobody walks through a pole */
  const wb = grp(g, 36, 0, -6.6); box(0.9, 0.1, 0.5, TM.woodDark, 0, 0.45, 0, wb); cyl(0.2, 0.2, 0.06, TM.wood, 0.3, 0.2, 0.3, wb, 10).rotation.x = PI / 2;
  /* the mule, her load and a heap of baskets by Mass Dudley */
  const bess = mule(); bess.userData.noBatch = true; bess.position.set(-26, 0, 2.8); bess.rotation.y = -0.15; g.add(bess); walls.push([-27, 1.9, -24.4, 3.7]);
  const goods = [yamBasket(), provisionSack(), bananaLoad()]; goods.forEach((o, i) => { o.userData.noBatch = true; o.position.set(-28.2 + i * 1.15, 0, 5.2 + (i % 2) * 0.25); o.rotation.y = i * 0.9; g.add(o); o.userData.home = o.position.clone(); });   /* the three loads, waiting on the ground */
  const mat = mesh(new THREE.PlaneGeometry(4.4, 1.5), solid(0x8a7a50, 1), -26.4, 0.02, 5.3, g); mat.rotation.x = -PI / 2;
  const tc = cart(); tc.position.set(2, 0, -2.5); tc.rotation.y = 0.15; g.add(tc); walls.push([-0.6, -3.5, 5.2, -1.4]);
  people.push(person('dudley', 'muleteer', 'Mass Dudley', -28.4, 2.0, 0.4, { h: 1.78 }));
  people.push(person('cleo', 'higgler', 'Miss Cleo', -15, -2.6, PI * 0.8, { h: 2.18, props: [['Head', 'basket']] }));
  people.push(person('traveller', 'gent45', 'The traveller', -3.5, 2.3, -0.4, { h: 1.8, path: [[-3.5, 2.3], [3.5, 1.8], [-1, 1.4]] }));
  people.push(person('surveyor', 'surveyor', 'The surveyor', 31, -2.2, PI * 0.9, { h: 1.78 }));
  extras.push(extra('worker45', 33.4, -4.7, 0.3, 'Carry'), extra('worker45', 17.5, -4.5, -0.8, 'CarryIdle'), extra('worker45', 41, -4.3, PI, 'Idle'), extra('worker45', 38, -6.5, PI * 0.5, 'Talk2', { ground: 0.6 }));
  return { id: 'road', group: g, walls, bounds: { x0: -40, x1: 46, z0: -7, z1: 7 }, start: { x: -36, z: 0.6, yaw: -PI / 2 }, people, extras, env: ENV.hazy, mule: bess, goods, goodsText: ['A basket of yams goes into the left pannier.', 'A sack of provisions goes into the right one.', 'A bunch of bananas is tied on top.'],
    spots: { mule: [-26, 4.4], end: [24, 0] }, tick: (dt, t) => { if (bess.userData.tick) bess.userData.tick(t); } };
}

/* ============ chapter 2: the Kingston terminus, 21 November 1845 ============ */
export function buildStation45() {
  const g = grp(), walls = [], people = [], extras = [];
  stationBase(g, { x0: -50, x1: 60, zc: -3, zBack: 17, wood: true });
  const train = grp(g, 0, 0, -3); const loco = steamLoco('early'); loco.position.x = -10.4; train.add(loco); loco.userData.hollow = true;   /* the fireman stands in its cab (engine/audit.js, outline test) */
  const kinds = ['first', 'third', 'third', 'first']; const cars = kinds.map((k, i) => { const c = carriage1845(k); c.position.x = i * 6; train.add(c); return c; });
  train.userData.wheels = [loco, ...cars].flatMap((v) => v.userData.wheels);
  walls.push([-13.5, -4.6, 21, -1.2]);   /* the train is a wall: you stand on the platform side */
  /* The terminus as the Illustrated London News engraving shows it on opening day ("Opening of the Jamaica Railway, Kingston Terminus", 31 January 1846; NLJ Print
     Collection, https://nljdigital.nlj.gov.jm/items/show/436; a larger scan on the Historic Jamaica blog): a long single-storey shed of plastered masonry, its front an
     arcade of round-headed arches between square pilasters under a plain band, a low roof with deep eaves, and the carriages and flags seen through the arches.
     It was drawn as a board house with one arch (18 November 2026). The number of arches (nine) and the depth of the shed are read from the engraving, not measured. */
  const shedH = grp(); shedH.position.set(10, 0, 15.2); shedH.rotation.y = PI; g.add(shedH); walls.push([-7.5, 12, 27.5, 18.4]);
  { const L = 34, D = 6, H = 4.6, n = 9, bay = L / n, aw = 2.5, r0 = aw / 2, sp = 2.7, plaster = solid(0xe6dfca, 0.92), trim = solid(0xf1ebdb, 0.85), dark = solid(0x17130f, 1), roofM = solid(0x7c6a5a, 0.9);
    const bayShape = () => { const sh = new THREE.Shape(); sh.moveTo(-bay / 2, 0); sh.lineTo(bay / 2, 0); sh.lineTo(bay / 2, H); sh.lineTo(-bay / 2, H); sh.lineTo(-bay / 2, 0);
      const hole = new THREE.Path(); hole.moveTo(-r0, 0); hole.lineTo(-r0, sp); hole.absarc(0, sp, r0, PI, 0, true); hole.lineTo(r0, 0); hole.lineTo(-r0, 0); sh.holes.push(hole); return sh; };
    const bayGeo = new THREE.ExtrudeGeometry(bayShape(), { depth: 0.45, bevelEnabled: false, curveSegments: 14 });
    for (let i = 0; i < n; i++) { const x = -L / 2 + bay * (i + 0.5); mesh(bayGeo, plaster, x, 0, D / 2 - 0.45, shedH);   /* one bay of the arcade: wall with its round-headed arch */
      const ring = mesh(new THREE.TorusGeometry(r0 + 0.08, 0.09, 5, 18, PI), trim, x, sp, D / 2 + 0.01, shedH); ring.scale.z = 0.5;   /* the moulded arch */
      for (const sx of [-1, 1]) box(0.16, 0.12, 0.08, trim, x + sx * (r0 + 0.04), sp, D / 2 + 0.03, shedH);   /* imposts at the spring */ }
    for (let i = 0; i <= n; i++) { const x = -L / 2 + bay * i; box(0.62, H - 0.1, 0.16, plaster, x, (H - 0.1) / 2, D / 2 + 0.07, shedH); box(0.78, 0.18, 0.24, trim, x, H - 0.55, D / 2 + 0.1, shedH); box(0.8, 0.22, 0.26, trim, x, 0.11, D / 2 + 0.1, shedH); }   /* square pilasters with a cap and a base */
    box(L + 0.4, 0.34, 0.3, trim, 0, H - 0.08, D / 2 + 0.06, shedH);   /* the plain band along the top of the arcade */
    box(L, H, 0.4, plaster, 0, H / 2, -D / 2 + 0.2, shedH); for (const sx of [-1, 1]) box(0.4, H, D, plaster, sx * (L / 2 - 0.2), H / 2, 0, shedH);   /* back and end walls */
    box(L - 0.8, H - 0.2, 0.05, dark, 0, (H - 0.2) / 2, -D / 2 + 0.43, shedH); box(L - 0.8, 0.05, D - 1, dark, 0, 0.03, 0, shedH);   /* the dark shed inside, seen through the arches */
    const pitch = 0.32, half = D / 2 + 0.8, sl = half / Math.cos(pitch); for (const sz of [-1, 1]) { const r = box(L + 1.4, 0.14, sl, roofM, 0, H + Math.tan(pitch) * half / 2 + 0.05, sz * half / 2, shedH); r.rotation.x = sz * pitch; }   /* a low roof with deep eaves */
    for (const sx of [-1, 1]) { const tri = new THREE.Shape(); tri.moveTo(-D / 2, 0); tri.lineTo(D / 2, 0); tri.lineTo(0, Math.tan(pitch) * D / 2); tri.lineTo(-D / 2, 0); const t = mesh(new THREE.ShapeGeometry(tri), plaster, sx * (L / 2 - 0.02), H, 0, shedH); t.rotation.y = sx * PI / 2; t.material.side = THREE.DoubleSide; } }   /* the gable at each end */
  const sg = signBoard('JAMAICA RAILWAY', 6, 0.8, { bg: '#2a3a52', fg: '#f3e6b8', font: '700 62px Georgia, serif' }); sg.position.set(10, 4.32, 11.6); g.add(sg);   /* on the band over the middle arch */
  /* bunting between poles along the platform edge, and flags */
  const bt = T.bunting().clone(); bt.needsUpdate = true; bt.repeat.set(3, 1);
  for (const x of [-14, -2, 10, 22, 34]) { const p = pole(5.4); p.position.set(x, 0, -0.8); g.add(p); }
  for (let i = 0; i < 4; i++) { const b = mesh(new THREE.PlaneGeometry(12, 0.7), new THREE.MeshBasicMaterial({ map: bt, transparent: true, side: THREE.DoubleSide, alphaTest: 0.3 }), -8 + i * 12, 4.5, -0.8, g); b.rotation.x = 0.06; }
  for (const x of [-14, 10, 34]) { const f = mesh(new THREE.PlaneGeometry(1.7, 0.9), flagMat(), x + 0.95, 5.2, -0.8, g); f.userData.flag = true; f.userData.noBatch = true; }
  const tab = grp(g, -3, 0, 8); box(2.2, 0.9, 0.8, TM.wood, 0, 0.45, 0, tab); const ts = signBoard('TICKETS', 1.6, 0.4); ts.position.set(0, 0.5, -0.44); ts.rotation.y = PI; tab.add(ts); walls.push([-4.3, 7.4, -1.7, 8.6]);
  for (let i = 0; i < 4; i++) { const c = crate(0.7); c.position.set(30 + (i % 2) * 0.9, 0, 6 + Math.floor(i / 2) * 0.8); c.rotation.y = i; g.add(c); } walls.push([29.4, 5.4, 31.8, 7.4]);
  people.push(person('dudley2', 'muleteer', 'Mass Dudley', -8, 8, PI * 0.9, { h: 1.78 }));
  people.push(person('boy', 'boy45', 'The boy', 3, 3.6, PI, { h: 1.2 }));
  people.push(person('clerk', 'clerk45', 'The clerk', -3, 9.4, PI, { h: 1.78 }));
  people.push(person('lady', 'lady45', 'The lady', 13, 5.2, PI, { h: 1.7 }));
  extras.push(extra('governor', 19, 1.8, PI, 'Idle', { name: 'governor' }), extra('gent45', 17.4, 2.2, PI, 'Idle'), extra('gent45', 20.6, 2.5, PI, 'Talk1'));
  extras.push(extra('fireman', -8.0, -3.4, 0, 'Idle', { ground: 0.14, react: ['WaveSlow'] }));   /* he waves now and then from the cab: on the middle of its floor (x -8.7 to -7.4), not in the gap before the tender (owner, 21 Nov 2026) */
  extras.push(...crowd45(26, 21, [-20, 2.6, 30, 11], { faceZ: PI }).filter((e) => !walls.some((w) => e.x > w[0] && e.x < w[2] && e.z > w[1] && e.z < w[3])));
  return { id: 'station45', group: g, walls, bounds: { x0: -26, x1: 34, z0: 0.2, z1: 14 }, start: { x: -2, z: 6.5, yaw: 0.2 }, people, extras, env: ENV.day, train, loco, cars,
    smokers: [{ obj: loco.userData.chimney, rate: 5, v: 0.8 }], spots: { engine: [-6.5, 0.4], board: [9, 0.6] }, tick: (dt, t) => { for (const o of g.children) if (o.userData.flag) o.rotation.y = Math.sin(t * 3 + o.position.x) * 0.25; } };
}

/* ============ the open carriage of the first train (chapter 2's ride) ============ */
export function buildRide45() {
  const g = grp(), walls = [], people = [], extras = [];
  const rig = makeRig('morass'); rig.group.position.y = TRACK_Y; g.add(rig.group); g.userData.noBatch = true;
  const car = carriage1845('third', 6.4, 2.4, 'sides'); g.add(car);
  const loco = steamLoco('early'); loco.position.set(-10.8, 0, 0); g.add(loco); loco.userData.hollow = true;
  const t2 = carriage1845('third', 6.4, 2.4, 'sides'); t2.position.set(7.2, 0, 0); g.add(t2);
  const wheels = [...loco.userData.wheels, ...car.userData.wheels, ...t2.userData.wheels];
  people.push(person('boyRide', 'boy45', 'The boy', 1.6, 0.92, PI, { h: 1.2, anim: 'SitTalk', ground: 0.17, seat: 0.49 }));   /* a child's hips are slimmer than the adult 12 cm, so he sits a little higher: on the bench, not in it (owner, 21 Nov 2026; 0.53 until the same day's stance fix set his hips level, which left him 4 cm above the seat) */
  extras.push(extra('lady45', 0.5, 0.9, PI, 'SitIdle', { ground: 0.17, seat: 0.48 }), extra('worker45', -1.2, -0.9, 0, 'SitTalk', { ground: 0.17, seat: 0.48 }), extra('woman45', 0.5, -0.9, 0, 'SitIdle', { ground: 0.17, seat: 0.48 }));
  return { id: 'ride45', group: g, walls, bounds: { x0: -2.5, x1: 2.5, z0: -0.5, z1: 0.5 }, start: { x: 0.2, z: 0, yaw: PI / 2 }, people, extras, env: ENV.day, rig, wheels, loco, ride: true,
    smokers: [{ obj: loco.userData.chimney, rate: 8, v: 0.5 }], spots: { water: [-1.8, 0] }, tick: () => {} };
}

/* the ends of a station: a wooden fence closes each end of the platform, bushes and trees stand beside the line, and a little way out
   the track runs into a cutting between grassy, tree-topped banks, so it goes somewhere instead of stopping. x0, x1: the platform ends; zc: the track; zBack: the back of the platform. */
function hillStationEnds(g, walls, x0, x1, zc, zBack) {
  const r = rng(77), wood = solid(0x5a4030, 1), stone = solid(0x8c867a, 1), dark = solid(0x0c0b0a, 1), earth = solid(0x3f6a36, 1);
  for (const [xe, dir] of [[x0, -1], [x1, 1]]) {
    /* the fence: posts and two rails across the platform end */
    const fx = xe - dir * 0.25, za = zc + 2.0, zb = zBack - 0.2;
    for (let z = za; z <= zb + 0.01; z += (zb - za) / 6) cyl(0.06, 0.07, 1.1, wood, fx, 0.55, z, g, 6);
    for (const y of [0.45, 0.9]) box(0.06, 0.08, zb - za, wood, fx, y, (za + zb) / 2, g);
    walls.push(dir > 0 ? [fx - 0.2, za, fx + 0.6, zb] : [fx - 0.6, za, fx + 0.2, zb]);
    /* a cutting: the line runs on between two grassy banks with trees along their tops and goes out of sight, instead of stopping.
       No tunnel: this hill station is made up, and nothing shows a tunnel beside it (rule 3). */
    const cx = xe + dir * 30;
    for (const side of [-1, 1]) {
      const bank = mesh(new THREE.SphereGeometry(1, 20, 10, 0, PI * 2, 0, PI / 2), earth, cx + dir * 8, TRACK_Y - 0.4, zc + side * 13.5, g); bank.scale.set(34, 9, 9);
      for (let k = 0; k < 4; k++) { const t = tree(6 + (k % 3), 40 + k + side); t.position.set(xe + dir * (18 + k * 7 + r() * 3), TRACK_Y + 5.5 + r(), zc + side * (12.5 + r() * 2)); t.rotation.y = r() * 6.28; g.add(t); }
    }
    /* trees and bushes beside the line between the platform and the tunnel, on the low ground and on the bank behind */
    for (let i = 0; i < 9; i++) { const x = xe + dir * (3 + r() * 14), z = r() < 0.5 ? zc - 3.5 - r() * 9 : zc + 3.2 + r() * 9, low = z < zBack; if (Math.hypot(x - 49, z + 6) < 3.6) continue; const t = i % 3 ? bush(i, 1.6 + r()) : tree(5 + (i % 3), i);   /* clear of the water tower */ t.position.set(x, low ? TRACK_Y : 0, z); t.rotation.y = r() * 6.28; g.add(t); }
  }
}

/* ============ chapter 3: a hill station, the 1890s ============ */
export function buildHill() {
  const g = grp(), walls = [], people = [], extras = [];
  stationBase(g, { x0: -34, x1: 44, zc: -3, zBack: 15, wood: true, ground: [66, 104, 48] });
  g.add(hillRing(160, 14, 85, { seed: 12, base: [0.18, 0.4, 0.2] }));
  const hut = shed(9, 4.5, 2.9, [176, 140, 96]); hut.position.set(2, 0, 11.5); hut.rotation.y = PI; g.add(hut); walls.push([-2.6, 8.05, 6.6, 14], [1.23, 7.13, 2.77, 8.05]);
  const sg = signBoard('HILL STATION', 3.2, 0.55, { bg: '#2a3a52', fg: '#f3e6b8', font: '700 46px Georgia, serif' }); sg.position.set(2, 2.85, 7.6); g.add(sg);   /* on the front edge of the veranda roof: behind it, the roof hid the words */
  const wt = waterTower({ feed: 'rail' }); wt.position.set(49, TRACK_Y, -6.0); g.add(wt);   /* beside the line past the platform's east end, its spout and hose reaching over a tender's edge (owner, 21 Nov 2026: it stood on the passenger platform, far from the track) */
  hillStationEnds(g, walls, -34, 44, -3, 15);   /* the ends of the world: a fence across each platform end, trees, and the line running on into a cutting (owner, 21 Nov 2026) */
  scatter(g, (i) => banana(i, i % 4 === 0), 40, [-34, 18, 44, 60], [[-6, 16, 10, 22]], 5); scatter(g, (i) => tree(5 + (i % 3), i), 16, [-30, 24, 40, 70], [], 8); scatter(g, (i) => bush(i, 1.4), 24, [-34, 15, 44, 40], [[-6, 15, 10, 22]], 3);
  /* two goods wagons waiting on the track, and the pile of banana bunches the farmer has cut */
  const w1 = wagon(), w2 = wagon(); w1.position.set(-20, 0, -3); w2.position.set(-12.8, 0, -3); g.add(w1, w2); walls.push([-24, -4.6, -9, -1.2]);
  const pile = grp(g, -14, 0, 5.6); pile.userData.noBatch = true; const mat = box(4.4, 0.06, 3.0, solid(0x8a7a3a, 1), 0, 0.03, 0, pile); const bunches = [];   /* a bigger mat, and the bunches laid neatly on it in two rows (owner, 21 Nov 2026) */
  for (let i = 0; i < 8; i++) { const b = bananaBunch(1.1); b.rotation.set(0, PI / 2 + (i % 2) * PI, PI / 2); b.position.set(0, 0, 0); b.updateMatrixWorld(true); { const bb = new THREE.Box3().setFromObject(b), c = bb.getCenter(new THREE.Vector3()); b.position.set(-1.55 + (i % 4) * 1.03 - c.x, 0.06 - bb.min.y, -0.72 + Math.floor(i / 4) * 1.44 - c.z); }   /* stalks all one way, each bunch centred on its place on the mat */ b.name = 'a banana bunch'; b.userData.home = { p: b.position.clone(), r: b.rotation.clone() }; pile.add(b); bunches.push(b); }   /* you carry these one by one to the wagon (engine/story.js createCarry) */
  const inWagon = []; for (let i = 0; i < 4; i++) { const b = bananaBunch(1.1); b.position.set(-14.6 + (i % 2) * 0.8, 0.44, -3.3 + Math.floor(i / 2) * 0.7); b.rotation.set(0, i, PI / 2); b.visible = false; b.userData.noBatch = true; g.add(b); inWagon.push(b); }
  for (const [x, z] of [[-3, 6.8], [8, 9], [20, 7]]) { const c = crate(0.8); c.position.set(x, 0, z); g.add(c); } for (let i = 0; i < 3; i++) { const b = barrel(); b.position.set(14 + i * 0.7, 0, 8.4); g.add(b); }
  const bp = bench(2.2); bp.position.set(-1, 0, 8.7); bp.rotation.y = PI; g.add(bp);
  /* the train that climbs in: a steam engine, its tender, a carriage and a wagon. It starts far to the east and runs west to the platform. */
  const train = grp(g, 0, 0, -3); const loco = steamLoco('late'); loco.position.x = -1.2; train.add(loco);
  const car = carriage1845('first', 6.2); car.position.x = 10; train.add(car); const w3 = wagon(); w3.position.x = 17.4; train.add(w3);
  train.userData.wheels = [loco, car, w3].flatMap((v) => v.userData.wheels); train.position.x = 90; train.visible = false; train.userData.noBatch = true;
  /* a brake handle on the platform side of the tender, the carriage and the far wagon: checking a brake pulls its handle down and hangs a white tag on it */
  const levers = [[loco, 4.7], [car, 0], [w1, 2.6]].map(([v, lx]) => { v.updateWorldMatrix(true, true);   /* parents too: the train is already out at x = 90, and a stale parent put the tender's and the carriage's handles 84 m down the line (found by the brake look, 22 November 2026) */ const bb = new THREE.Box3().setFromObject(v), o = v.getWorldPosition(new THREE.Vector3()), x = Math.max(bb.min.x - o.x + 0.3, Math.min(bb.max.x - o.x - 0.3, lx));
    /* the hand brake as goods wagons and carriages carried it: a long iron lever along the side, pivoted at one end, pulled down over a curved iron guard
       with pin holes and pinned there (the brake lever and lever guard of a 19th-century wagon; a general type, not a drawing of the Jamaica Railway's own).
       It points along the vehicle toward its middle. Checking it pulls the lever down a notch, drops the pin in and hangs a white tag on it. */
    const L = grp(v, x, 0.42, bb.max.z - o.z + 0.04); L.userData.noBatch = true; if (x > 0) L.scale.x = -1;
    const iron = solid(0x4a4e54, 0.55, 0.5), bar = solid(0x7a7f86, 0.4, 0.6), paint = solid(0xf2efe6, 0.6), dark = solid(0x1c1d20, 0.8);
    box(0.08, 0.22, 0.08, iron, 0, 0, 0, L); cyl(0.035, 0.035, 0.06, bar, 0, 0, 0.07, L, 12).rotation.x = PI / 2;   /* the pivot bracket and its bolt */
    const guard = mesh(new THREE.RingGeometry(0.74, 0.88, 18, 1, -0.32, 0.86), solid(0x3e4248, 0.7, 0.3, { side: THREE.DoubleSide }), 0, 0, 0.05, L);   /* the curved iron guard the lever moves over: a narrow bar, not a plate */
    const rim = mesh(new THREE.TorusGeometry(0.84, 0.02, 4, 18, 0.86), iron, 0, 0, 0.06, L); rim.rotation.z = -0.32; for (let a = -0.26; a <= 0.5; a += 0.095) cyl(0.012, 0.012, 0.02, dark, Math.cos(a) * 0.84, Math.sin(a) * 0.84, 0.075, L, 6).rotation.x = PI / 2;   /* its outer bar and the pin holes */
    for (const a of [-0.3, 0.5]) box(0.04, 0.04, 0.06, iron, Math.cos(a) * 0.84, Math.sin(a) * 0.84, 0.02, L);   /* stays to the side */
    const h = grp(L, 0, 0, 0.1); box(0.92, 0.05, 0.03, bar, 0.46, 0, 0, h); box(0.16, 0.06, 0.04, paint, 0.86, 0, 0, h); h.rotation.z = 0.36;   /* the lever, its end painted white */
    const pin = cyl(0.014, 0.014, 0.1, bar, Math.cos(-0.17) * 0.84, Math.sin(-0.17) * 0.84 + 0.05, 0.1, L, 8); pin.rotation.x = PI / 2; pin.visible = false;   /* the pin through the guard, over the lever */
    const tag = box(0.07, 0.1, 0.01, solid(0xf4f0e4, 0.9), 0.62, -0.08, 0.025, h); tag.visible = false;
    L.userData.handle = h; L.userData.tag = tag; L.userData.pin = pin; L.userData.up = 0.36; L.userData.down = -0.17; return L; });
  people.push(person('gordon', 'stationmaster', 'Mr. Gordon', -0.5, 7.4, PI, { h: 1.78 }));
  people.push(person('abel', 'foreman', 'Mr. Abel', -18, 2.2, PI * 1.1, { h: 1.8 }));
  people.push(person('ezraboy', 'ezraBoy', 'Ezra', 6, 4.4, PI * 1.2, { h: 1.15 }));
  people.push(person('ruby', 'farmer', 'Miss Ruby', -10.4, 6.2, PI * 0.8, { h: 1.7 }));
  return { id: 'hill', group: g, walls, bounds: { x0: -28, x1: 42, z0: 0.2, z1: 13.5 }, start: { x: -22, z: 5.5, yaw: -PI / 2 }, people, extras, env: ENV.morning, train, loco, bunches, inWagon, w1, w2, pile, levers,
    smokers: [{ obj: loco.userData.chimney, rate: 6, v: 1.0, needsTrain: true }], spots: { pile: [-12.6, 4.0], wagon: [-14.4, 0.6], brakes: [[3.5, 0.5], [10, 0.5], [-17.4, 0.5]] }, tick: () => {} };
}
