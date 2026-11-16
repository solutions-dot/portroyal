/* engine/boats.js and engine/roadcars.js: every shape is whole (no NaN), each vehicle stays within its draw-call budget, and nothing drifts in size.
   (16 Nov 2026: a rounding slip at the bow once gave the rowing boat NaN points, which drew as a black patch.) */
import test from 'node:test';
import assert from 'node:assert/strict';
import { MeshStandardMaterial, Box3 } from 'three';
import { rowBoat, rowStroke } from '../engine/boats.js';
import { saloonCar, bus, van, lorry, PAINT, GLASS } from '../engine/roadcars.js';

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
    ['bus', bus()], ['van', van({ stripe: 0x2f6a3f })], ['tank lorry', lorry({ body: 'tank' })], ['fire engine', lorry({ body: 'fire', L: 5.4, axles: 1 })], ['flat lorry', lorry({ body: 'flat' })]];
  for (const [name, g] of list) { whole(g, name); const ms = meshes(g); assert.equal(ms.length, 2, name + ' is two draw calls'); assert.deepEqual(ms.map((m) => m.material), [PAINT, GLASS], name);
    const box = new Box3().setFromObject(g), [L, , W] = g.userData.size; assert.ok(Math.abs(box.min.y) < 0.01, name + ' stands on the ground');
    assert.ok(box.max.x - box.min.x < L + 0.5 && box.max.z - box.min.z < W + 0.9, name + ' keeps to its footprint (mirrors apart)'); }
});
