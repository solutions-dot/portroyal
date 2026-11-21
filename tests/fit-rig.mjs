/* engine/anim.js fitRig(): every body keeps the shape it was built in (21 November 2026). Run with npm test (tests/regressions.mjs imports this file).
   What is tested: fitting a body changes nothing that is drawn at the moment it runs, in the rest pose and in a pose; afterwards a clip's rotations turn the
   body's bones from its own rest shape by what they turn the reference skeleton's; finger joints no clip drives keep their own axes; it runs once; a clone made
   before the fit is not harmed and can be fitted on its own; a skeleton that is not ours is left alone; engine/rig-rest.js matches the clip library. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import * as THREE from 'three';
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';
import { fitRig } from '../engine/anim.js';
import { RIG_REST } from '../engine/rig-rest.js';

const rq = (n) => new THREE.Quaternion().fromArray(RIG_REST[n]);
const tilt = (q, deg, ax = new THREE.Vector3(1, 0, 0)) => new THREE.Quaternion().setFromAxisAngle(ax, deg * Math.PI / 180).multiply(q);
/* a small body: hips, spine, neck, an arm and two finger joints, each resting some degrees off the reference skeleton, and one box of skin tied to all of them.
   squeeze: the skin is stored squeezed into a box, with its true size folded into the bind matrices, as packed bodies are. */
function body(off = { Hips: 12, Spine: -8, Neck: -23, LeftArm: 6, LeftHandIndex1: 4, LeftHandIndex2: 9 }, squeeze = false) {
  const names = ['Hips', 'Spine', 'Neck', 'LeftArm', 'LeftHandIndex1', 'LeftHandIndex2'], parent = { Spine: 'Hips', Neck: 'Spine', LeftArm: 'Spine', LeftHandIndex1: 'LeftArm', LeftHandIndex2: 'LeftHandIndex1' };
  const pos = { Hips: [0, 1, 0], Spine: [0, 1.2, 0.01], Neck: [0, 1.5, 0.02], LeftArm: [0.2, 1.45, 0], LeftHandIndex1: [0.6, 1.0, 0.1], LeftHandIndex2: [0.62, 0.97, 0.11] };
  const root = new THREE.Group(), arm = new THREE.Group(); root.add(arm); const B = {}, W = {};
  for (const n of names) { const b = new THREE.Bone(); b.name = 'mixamorig' + n; B[n] = b; W[n] = tilt(rq(n), off[n] || 0); (parent[n] ? B[parent[n]] : arm).add(b); }
  for (const n of names) { const p = parent[n], pq = p ? W[p].clone().invert() : new THREE.Quaternion(), pp = p ? new THREE.Vector3(...pos[p]) : new THREE.Vector3();
    B[n].quaternion.copy(pq.clone().multiply(W[n])); B[n].position.copy(new THREE.Vector3(...pos[n]).sub(pp).applyQuaternion(pq)); }
  /* the rest of a body's bones, so fitRig knows it for one of ours (it leaves a rig of a few bones alone): children of the hips, resting as the reference does */
  const more = Object.keys(RIG_REST).filter((n) => !names.includes(n) && !/Hand(Thumb|Index|Middle|Ring|Pinky)[234]$/.test(n)).slice(0, 18), extra = more.map((n) => { const b = new THREE.Bone(); b.name = 'mixamorig' + n; b.quaternion.copy(W.Hips.clone().invert().multiply(rq(n))); B.Hips.add(b); return b; });
  root.updateMatrixWorld(true);
  const g = new THREE.BoxGeometry(0.4, 0.8, 0.3, 2, 4, 2); g.translate(0, 1.3, 0); const n = g.attributes.position.count, si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) { si[i * 4] = i % names.length; si[i * 4 + 1] = (i + 1) % names.length; sw[i * 4] = 0.7; sw[i * 4 + 1] = 0.3; }
  g.setAttribute('skinIndex', new THREE.BufferAttribute(si, 4)); g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
  const Q = new THREE.Matrix4(); if (squeeze) { Q.makeScale(2, 0.5, 3).setPosition(0.1, -0.2, 0.3); g.applyMatrix4(Q.clone().invert()); }
  const bones = [...names.map((x) => B[x]), ...extra], mesh = new THREE.SkinnedMesh(g, new THREE.MeshBasicMaterial());
  mesh.bind(new THREE.Skeleton(bones, bones.map((b) => b.matrixWorld.clone().invert().multiply(Q))), new THREE.Matrix4()); mesh.name = 'Skin'; root.add(mesh);
  return { root, B, mesh, names };
}
const drawn = (m) => { m.root.updateMatrixWorld(true); m.mesh.skeleton.update(); const v = new THREE.Vector3(), out = []; for (let i = 0; i < m.mesh.geometry.attributes.position.count; i++) { m.mesh.getVertexPosition(i, v); out.push(v.x, v.y, v.z); } return out; };
const near = (a, b, eps = 1e-5) => a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) < eps);
const wq = (b) => b.getWorldQuaternion(new THREE.Quaternion()), ang = (a, b) => { const d = a.clone().invert().multiply(b); return 2 * Math.atan2(Math.hypot(d.x, d.y, d.z), Math.abs(d.w)) * 180 / Math.PI; };   /* (acos near 1 loses the small angles) */

test('fitRig: nothing that is drawn moves when a body is fitted, at rest or in a pose, plain or packed', () => {
  for (const squeeze of [false, true]) {
    const a = body(undefined, squeeze), before = drawn(a); assert.equal(fitRig(a.root), true); assert.ok(near(drawn(a), before), 'rest pose moved');
    const b = body(undefined, squeeze); b.B.Spine.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4, 0.2, -0.3))); b.B.LeftArm.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.5, 0.1, 0.6)));
    const posed = drawn(b); fitRig(b.root); assert.ok(near(drawn(b), posed), 'pose moved');
  }
});
test('fitRig: after it, the bones a clip drives rest at the reference skeleton\'s angles; finger joints no clip drives keep their own', () => {
  const a = body(), own = wq(a.B.LeftHandIndex2); fitRig(a.root); a.root.updateMatrixWorld(true);
  for (const n of ['Hips', 'Spine', 'Neck', 'LeftArm', 'LeftHandIndex1']) assert.ok(ang(wq(a.B[n]), rq(n)) < 0.01, n + ' rests ' + ang(wq(a.B[n]), rq(n)).toFixed(2) + ' degrees off');
  assert.ok(ang(wq(a.B.LeftHandIndex2), own) < 0.01, 'a finger joint no clip drives changed its axes');
});
test('fitRig: a clip that holds the reference rest pose leaves two different bodies exactly as they were built', () => {
  for (const off of [undefined, { Hips: -3, Spine: 14, Neck: 6, LeftArm: -9 }]) {
    const a = body(off), built = drawn(a); fitRig(a.root);
    for (const n of a.names) { if (n === 'LeftHandIndex2') continue; const p = a.B[n].parent; a.B[n].quaternion.copy((p.isBone ? rq(p.name.slice(9)).invert() : new THREE.Quaternion()).multiply(rq(n))); }   /* what a clip at the reference rest pose sets */
    assert.ok(near(drawn(a), built, 1e-4), 'the body bent although the clip is at rest');
  }
});
test('fitRig: runs once, and a clone made before it is not harmed and can be fitted on its own', () => {
  const a = body(), c = skClone(a.root), cm = { root: c, mesh: c.getObjectByName('Skin') }, cBefore = drawn(cm), aBefore = drawn(a);
  assert.equal(fitRig(a.root), true); assert.equal(fitRig(a.root), false); assert.ok(near(drawn(a), aBefore));
  assert.ok(near(drawn(cm), cBefore), 'fitting one body moved its clone'); assert.equal(fitRig(c), true); assert.ok(near(drawn(cm), cBefore), 'the clone moved when it was fitted');
  const d = skClone(a.root), dm = { root: d, mesh: d.getObjectByName('Skin') }, dBefore = drawn(dm); fitRig(d); assert.ok(near(drawn(dm), dBefore), 'a clone of a fitted body moved');
});
test('fitRig: a skeleton that rests far from ours is left alone and listed', () => {
  const a = body({ Hips: 80 }), before = a.B.Hips.quaternion.clone(); fitRig.unknown = []; assert.equal(fitRig(a.root), false); assert.ok(a.B.Hips.quaternion.equals(before)); assert.equal(fitRig.unknown.length, 1);
});
test('fitRig: engine/rig-rest.js matches the skeleton in the clip library', () => {
  const r = spawnSync(process.execPath, ['tools/anims/rig_rest.mjs', '--check'], { encoding: 'utf8' }); assert.equal(r.status, 0, r.stderr || r.stdout);
});
