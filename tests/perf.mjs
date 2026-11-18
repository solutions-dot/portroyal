/* engine/joinbody.js and engine/batch.js (18 November 2026): fewer draw calls, the same picture. */
import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

let rafQ = []; globalThis.requestAnimationFrame = (f) => { rafQ.push(f); return rafQ.length; };   /* batch.js watches with requestAnimationFrame: run it by hand */
const { joinBody, joinTick, isJoined } = await import('../engine/joinbody.js');
const { batchStatic, BATCH_STATS } = await import('../engine/batch.js');

function piece(bones, name, colour, roughness = 0.9) {
  const g = new THREE.BoxGeometry(0.2, 0.2, 0.2), n = g.attributes.position.count; g.clearGroups();   /* a packed body piece has no face groups */
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(new Array(n * 4).fill(0), 4));
  g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(Array.from({ length: n }, () => [1, 0, 0, 0]).flat(), 4));
  const m = new THREE.SkinnedMesh(g, new THREE.MeshStandardMaterial({ color: colour, roughness })); m.name = name; m.material.name = name;
  m.bind(new THREE.Skeleton(bones)); return m;
}
function body(hair = 0x332211) {
  const root = new THREE.Group(), hips = new THREE.Bone(); hips.name = 'mixamorigHips'; const head = new THREE.Bone(); hips.add(head); root.add(hips); root.updateMatrixWorld(true);
  const bones = [hips, head]; const P = { shirt: piece(bones, 'Shirt', 0xaa0000), trousers: piece(bones, 'Trousers', 0x0000aa), hat: piece(bones, 'Hat', 0x00aa00), skin: piece(bones, 'Skin', 0x8a5a40, 0.68), hair: piece(bones, 'Hair', hair) };
  for (const p of Object.values(P)) root.add(p); return { root, P };
}
const drawn = (root) => { const out = []; root.traverse((o) => { if (o.isMesh && o.visible && o.layers.mask) out.push(o); }); return out; };

test('joinBody draws clothes as one mesh and keeps skin apart, with every piece kept for checks', () => {
  const { root, P } = body(); const saved = joinBody(root);
  assert.equal(saved, 3);   /* shirt, trousers, hat, hair: one mesh; skin keeps its own material */
  const d = drawn(root); assert.equal(d.length, 2); assert.ok(d.some((o) => o === P.skin)); const j = d.find(isJoined); assert.ok(j);
  for (const k of ['shirt', 'trousers', 'hat', 'hair']) { assert.equal(P[k].visible, true); assert.equal(P[k].layers.mask, 0); }
  const c = j.geometry.attributes.color, red = new THREE.Color(0xaa0000); assert.ok(Math.abs(c.getX(0) - red.r) < 1e-6 && Math.abs(c.getY(0) - red.g) < 1e-6);   /* the shirt's colour baked into its points */
});

test('hiding a piece joins the body again and frees the old skeleton', () => {
  const { root, P } = body(); joinBody(root); const old = drawn(root).find(isJoined); let freed = false; const d0 = old.skeleton.dispose.bind(old.skeleton); old.skeleton.dispose = () => { freed = true; d0(); };
  P.hat.visible = false; joinTick(root);
  assert.equal(freed, true); assert.equal(old.parent, null);
  const j = drawn(root).find(isJoined); assert.ok(j && j !== old); assert.equal(j.geometry.attributes.position.count, 3 * P.hat.geometry.attributes.position.count);   /* shirt, trousers, hair */
  P.hat.visible = true; joinTick(root); assert.equal(drawn(root).find(isJoined).geometry.attributes.position.count, 4 * P.hat.geometry.attributes.position.count);
});

test('a colour lightened past 1 keeps its own brightness and its own cache entry', () => {
  const a = body(), b = body(); a.P.hair.material.color.setScalar(1.55); b.P.hair.material.color.setScalar(1.3); joinBody(a.root); joinBody(b.root);
  const ja = drawn(a.root).find(isJoined), jb = drawn(b.root).find(isJoined); assert.notEqual(ja.geometry, jb.geometry);
  const n = a.P.shirt.geometry.attributes.position.count, at = 3 * n;   /* hair is the fourth piece */
  assert.ok(Math.abs(ja.geometry.attributes.color.getX(at) - 1.55) < 1e-5, 'not clamped to 1');
});

test('batchStatic merges materials alike but for colour, and splits back when the game changes one', () => {
  const root = new THREE.Group(), mk = (c, x) => { const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 })); m.position.x = x; root.add(m); return m; };
  const a = mk(0xff0000, 0), b = mk(0x00ff00, 2); mk(0x0000ff, 4);
  const r = batchStatic(root); assert.equal(r.removed, 3); assert.equal(root.children.length, 1);
  b.material.emissive.setHex(0xffffff);   /* a window lit at night */
  const q = rafQ; rafQ = []; for (const f of q) f(0);
  assert.equal(root.children.length, 3); assert.ok(root.children.some((m) => m.material === b.material)); assert.ok(BATCH_STATS.splits >= 1); void a;
});

test('batchStatic keeps a packed (quantized) model where it was', () => {
  const root = new THREE.Group(), box = new THREE.BoxGeometry(2, 2, 2), p = box.attributes.position, q = new Int16Array(p.count * 3);
  for (let i = 0; i < p.count * 3; i++) q[i] = Math.round(p.array[i] / 1 * 32767);   /* points stored as whole numbers, as a packed file keeps them */
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(q, 3, true)); g.setAttribute('normal', box.attributes.normal.clone()); g.setIndex(box.index.clone());
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial()); m.position.set(5, 0, 0); root.add(m); root.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), m.material));
  batchStatic(root); const out = root.children[0].geometry; out.computeBoundingBox();
  assert.ok(Math.abs(out.boundingBox.max.x - 6) < 0.01, 'the packed box still reaches x = 6, got ' + out.boundingBox.max.x);
});
