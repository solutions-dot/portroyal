/* engine/boats.js and engine/roadcars.js: every shape is whole (no NaN), each vehicle stays within its draw-call budget, and nothing drifts in size.
   (17 Nov 2026: a rounding slip at the bow once gave the rowing boat NaN points, which drew as a black patch.) */
import test from 'node:test';
import assert from 'node:assert/strict';
import { MeshStandardMaterial, Box3 } from 'three';
import { rowBoat, rowStroke, dugOut, shipLifeboat, steamer, schooner, paintKit } from '../engine/boats.js';
import { saloonCar, bus, van, lorry, deckerBus, bonnetLorry, PAINT, GLASS } from '../engine/roadcars.js';

const meshes = (g) => { const out = []; g.traverse((o) => { if (o.isMesh) out.push(o); }); return out; };
const whole = (g, name) => { for (const m of meshes(g)) for (const k of ['position', 'normal']) { const a = m.geometry.attributes[k]; if (a) for (let i = 0; i < a.array.length; i++) assert.ok(Number.isFinite(a.array[i]), `${name}: ${m.name} has a bad ${k} value`); } };

test('rowBoat: whole shapes, three meshes plus two oars and the water mask, and its stated size', () => {
  for (const o of [{ L: 5.2, beam: 1.7, depth: 0.7, oars: 'rowing', mask: true }, { L: 4.6, beam: 1.5, depth: 0.62, oars: 'shipped', rudder: false }, { L: 3.6, beam: 1.4, depth: 0.62, thwarts: [-1.1, 1.05], mask: true }]) {
    const b = rowBoat({ ...o, wood: new MeshStandardMaterial(), timber: new MeshStandardMaterial() }); whole(b, 'rowBoat');
    assert.equal(meshes(b).length, 3 + (o.oars === 'rowing' ? 2 : 0) + (o.mask ? 1 : 0));
    const hull = b.getObjectByName('boatHull'); const box = new Box3().setFromBufferAttribute(hull.geometry.attributes.position);
    assert.ok(Math.abs(box.max.x - box.min.x - o.L) < 0.02 && Math.abs(box.max.z - box.min.z - o.beam) < 0.05, 'the planking is as long and as wide as asked');
    if (o.oars === 'rowing') { rowStroke(b, 1.3, true); assert.ok(b.userData.oars.every((m) => Number.isFinite(m.rotation.x) && Number.isFinite(m.rotation.y))); }
    assert.ok(b.userData.halfAt(0, b.userData.boards) > 0.3, 'there is room on the bottom boards');
  }
});

test('road vehicles: two meshes each on the two shared materials, whole shapes, wheels on the ground', () => {
  const list = [['1960s car', saloonCar({ era: '1960s' })], ['1970s car', saloonCar({ era: '1970s' })], ['1980s car', saloonCar({ era: '1980s' })], ['modern car', saloonCar({ era: 'modern' })],
    ['bus', bus()], ['van', van({ stripe: 0x2f6a3f })], ['tank lorry', lorry({ body: 'tank' })], ['fire engine', lorry({ body: 'fire', L: 5.4, axles: 1 })], ['flat lorry', lorry({ body: 'flat' })],
    ['double-deck bus', deckerBus()], ['bonneted lorry', bonnetLorry()]];
  for (const [name, g] of list) { whole(g, name); const ms = meshes(g); assert.equal(ms.length, 2, name + ' is two draw calls'); assert.deepEqual(ms.map((m) => m.material), [PAINT, GLASS], name);
    const box = new Box3().setFromObject(g), [L, , W] = g.userData.size; assert.ok(Math.abs(box.min.y) < 0.01, name + ' stands on the ground');
    assert.ok(box.max.x - box.min.x < L + 0.5 && box.max.z - box.min.z < W + 0.9, name + ' keeps to its footprint (mirrors apart)'); }
});

test('dugOut: whole, two meshes, as long and wide as asked, its floor inside the log', () => {
  for (const o of [{}, { L: 4.8, beam: 1.1, depth: 0.42 }, { L: 3.2, beam: 0.6, depth: 0.36, gear: false }]) {
    const c = dugOut(o); whole(c, 'dugOut'); assert.equal(meshes(c).length, 2, 'the log and its gear');
    const box = new Box3().setFromObject(c), L = o.L || 4.4, W = o.beam || 0.8; assert.ok(Math.abs(box.max.x - box.min.x - L) < 0.35 && Math.abs(box.max.z - box.min.z - W) < 0.08, 'size as asked');
    assert.ok(Math.abs(box.min.y) < 0.01, 'it lies on y = 0'); assert.ok(c.userData.halfIn(0, c.userData.floor + 0.1) > 0.1, 'there is room inside');
  }
});

test('ships: a lifeboat, a steamer and a schooner are each ONE mesh on the shared material, whole, near their stated size', () => {
  const list = [['lifeboat', shipLifeboat(), 7.2], ['open lifeboat', shipLifeboat({ cover: false, davits: false, L: 6 }), 6], ['steamer', steamer({ L: 18 }), 18], ['schooner', schooner({ L: 9 }), 9 * 1.2]];
  let mat = null;
  for (const [name, g, L] of list) { whole(g, name); const ms = meshes(g); assert.equal(ms.length, 1, name + ' is one draw call'); mat = mat || ms[0].material; assert.equal(ms[0].material, mat, name + ' shares the material');
    const box = new Box3().setFromObject(g); assert.ok(Math.abs(box.max.x - box.min.x - L) < 0.25 * L, name + ' keeps its length'); }
  const K = paintKit(); K.box(1, 1, 1, 0, 0, 0, 0xffffff); assert.equal(K.mesh('t').material, mat, 'paintKit uses the same material');
});
