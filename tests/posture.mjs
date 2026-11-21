/* Standing level (engine/anim.js levelStance, 21 November 2026). Run with npm test (tests/regressions.mjs imports this file).
   What is tested, on the real clip library: after clipFor(), every standing clip holds the hips and the spine level and facing the way the hips face
   (the average sideways tip and the average turn of each are under 1.5 degrees; before, Speech held the hips 10 degrees over and Talk1 the trunk 5 to 7),
   it does not lean forward or back on average either, and a walking clip is not touched. A new standing clip that leans is caught here. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { CL, clipFor } from '../engine/anim.js';
import { RIG_REST } from '../engine/rig-rest.js';

const TR = ['Hips', 'Spine', 'Spine1', 'Spine2'], DEG = 180 / Math.PI;
async function library() {
  const src = readFileSync('shared/models/anims.js', 'utf8'), buf = Buffer.from(src.match(/\]="([^"]+)"/)[1], 'base64'); await MeshoptDecoder.ready;
  const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder }).readBinary(new Uint8Array(buf));
  for (const a of doc.getRoot().listAnimations()) { const tracks = []; for (const c of a.listChannels()) { const s = c.getSampler(), nm = c.getTargetNode().getName().replace(':', ''), p = c.getTargetPath(), t = Array.from(s.getInput().getArray()), v = Array.from(s.getOutput().getArray());
      if (p === 'rotation') tracks.push(new THREE.QuaternionKeyframeTrack(nm + '.quaternion', t, v)); else if (p === 'translation') tracks.push(new THREE.VectorKeyframeTrack(nm + '.position', t, v)); }
    CL[a.getName()] = new THREE.AnimationClip(a.getName(), -1, tracks); }
}
const at = (track, t) => { const tm = track.times, v = track.values; let i = 1; while (i < tm.length - 1 && tm[i] < t) i++; const k = Math.max(0, Math.min(1, (t - tm[i - 1]) / ((tm[i] - tm[i - 1]) || 1))); return new THREE.Quaternion().fromArray(v, (i - 1) * 4).slerp(new THREE.Quaternion().fromArray(v, i * 4), k); };
function lean(c) {   /* each trunk bone against its rest, averaged over the clip: [pitch, turn against the hips, tip] in degrees */
  const T = {}; for (const t of c.tracks) { const m = t.name.match(/^mixamorig(\w+)\.quaternion$/); if (m) T[m[1]] = t; }
  const mean = TR.map(() => [0, 0, 0]), e = new THREE.Euler(0, 0, 0, 'YXZ'), N = 48;
  for (let i = 0; i < N; i++) { const t = c.duration * (i + 0.5) / N, w = new THREE.Quaternion(); let y0 = 0; TR.forEach((b, k) => { w.multiply(at(T[b], t)); e.setFromQuaternion(w.clone().multiply(new THREE.Quaternion().fromArray(RIG_REST[b]).invert())); if (!k) y0 = e.y; mean[k][0] += e.x * DEG / N; mean[k][1] += Math.atan2(Math.sin(e.y - y0), Math.cos(e.y - y0)) * DEG / N; mean[k][2] += e.z * DEG / N; }); }
  return mean;
}
const STAND = ['Idle', 'IdleM', 'Talk1', 'Talk2', 'Talk3', 'TalkM1', 'TalkM2', 'Speech', 'Nod', 'Wave', 'WaveSlow', 'Point', 'Clap', 'Cheer', 'Laugh', 'Greet', 'Thankful', 'OldIdle', 'HappyIdle', 'Argue', 'Yell', 'Shrug', 'Agree', 'Salute', 'Cry'];

test('posture: every standing clip holds the hips and the spine level and facing forward', async () => {
  await library(); let seen = 0;
  for (const n of STAND) { if (!CL[n]) continue; seen++; const m = lean(clipFor(n));
    m.forEach(([, turn, tip], k) => { assert.ok(Math.abs(tip) < 1.5, `${n}: ${TR[k]} tips ${tip.toFixed(1)} degrees to one side on average`); assert.ok(Math.abs(turn) < 1.5, `${n}: ${TR[k]} is turned ${turn.toFixed(1)} degrees on average`); }); }
  assert.ok(seen >= 15, 'the clip library has lost its standing clips');
});
test('posture: a standing clip does not lean forward or back on average, and a walk is not touched', async () => {
  await library(); const raw = lean(CL.Talk1), out = lean(clipFor('Talk1')); out.forEach(([p], k) => assert.ok(Math.abs(p) < 1.5, `Talk1 ${TR[k]} leans ${p.toFixed(1)} degrees forward or back on average`));
  assert.ok(Math.abs(raw[0][2]) > 2 || Math.abs(raw[2][2]) > 2, 'Talk1 no longer leans in the library: update this test');
  const w0 = lean(CL.Walk), w1 = lean(clipFor('Walk')); w0.forEach(([, t, z], k) => { assert.ok(Math.abs(z - w1[k][2]) < 0.05); assert.ok(Math.abs(t - w1[k][1]) < 0.05); });
});
test('posture: in every standing clip each leg rests, on average, as the legs of the body do (no bent knees, no legs bowed back)', async () => {
  await library(); const e = new THREE.Euler(0, 0, 0, 'YXZ'), Y = new THREE.Vector3(0, 1, 0);
  const pitch = (W, yaw) => { const d = Y.clone().applyQuaternion(W).applyAxisAngle(Y, -yaw); return Math.atan2(d.z, -d.y) * DEG; };
  for (const n of ['Idle', 'Talk1', 'WaveSlow', 'Speech', 'Nod', 'Clap', 'Point']) { if (!CL[n]) continue; const c = clipFor(n), T = {}; for (const t of c.tracks) { const m = t.name.match(/^mixamorig(\w+)\.quaternion$/); if (m) T[m[1]] = t; }
    for (const S of ['Left', 'Right']) { const names = [S + 'UpLeg', S + 'Leg', S + 'Foot'], mean = [0, 0, 0], N = 40;
      for (let i = 0; i < N; i++) { const t = c.duration * (i + 0.5) / N, w = at(T.Hips, t); e.setFromQuaternion(w.clone().multiply(new THREE.Quaternion().fromArray(RIG_REST.Hips).invert())); const yaw = e.y; names.forEach((b, k) => { w.multiply(at(T[b], t)); mean[k] += pitch(w, yaw) / N; }); }
      names.forEach((b, k) => { const r = pitch(new THREE.Quaternion().fromArray(RIG_REST[b]), 0); assert.ok(Math.abs(mean[k] - r) < 2, `${n}: ${b} points ${(mean[k] - r).toFixed(1)} degrees off its rest on average`); }); } }
});

