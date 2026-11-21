/* tools/review/posture-probe.src.js: how far a clip bends each body away from the shape it was built in.
   For every body and clip asked for, the trunk bones (hips to head) are compared with the body's own rest pose: how many degrees each has pitched
   forward (+) or back (-), turned and tipped, averaged over the clip, and how far the head has moved forward of the hips. A standing clip should
   leave the trunk within a few degrees of rest: the body was modelled standing upright, so a clip that holds the chest 20 degrees forward and the
   head 8 cm ahead of where it was built is a stoop, whatever the clip meant. Driven by posture-probe.mjs. See docs/TESTING.md. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { loadClips, clipFor, animate, fitRig } from '../../engine/anim.js';

for (const [k, v] of new URLSearchParams(location.search)) if (k.startsWith('g_')) globalThis['__' + k.slice(2)] = isNaN(+v) ? v : +v;   /* dev switches, as in people-sheet */
const q = new URLSearchParams(location.search), game = q.get('game'), ids = q.get('ids').split(','), anims = (q.get('anims') || 'Idle').split(',');
const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
const script = (src) => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('missing ' + src)); document.head.appendChild(s); });
async function model(dir, n) {
  await script(dir + n + '.js'); const b = atob(window.__models[n]), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
  return new Promise((res, rej) => loader.parse(u.buffer, '', res, rej));
}
const dir = (id) => id.includes('/') ? id.slice(0, id.lastIndexOf('/') + 1) : `../../games/${game}/site/models/`, nameOf = (id) => id.slice(id.lastIndexOf('/') + 1);
const BONES = ['Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'Head', 'LeftShoulder', 'RightShoulder', 'LeftArm', 'RightArm', 'LeftUpLeg', 'RightUpLeg', 'LeftLeg', 'RightLeg'];
const deg = (r) => +(r * 180 / Math.PI).toFixed(1);
(async () => {
  const clips = (await model(`../../games/${game}/site/models/`, 'anims')).animations; loadClips({ animations: clips });
  const out = {};
  for (const id of ids) {
    const g = await model(dir(id), nameOf(id)), m = g.scene; m.updateMatrixWorld(true); fitRig(m);   /* the bones' axes as the engine sets them, before the rest pose is read */
    const bone = (n) => { let b = null; m.traverse((o) => { if (o.isBone && o.name.replace(/[:_]/g, '').toLowerCase() === 'mixamorig' + n.toLowerCase()) b = o; }); return b; };
    const B = Object.fromEntries(BONES.map((n) => [n, bone(n)])), wq = (b) => b.getWorldQuaternion(new THREE.Quaternion()), wp = (b) => b.getWorldPosition(new THREE.Vector3());
    const rest = Object.fromEntries(BONES.map((n) => [n, wq(B[n])])), restP = Object.fromEntries(BONES.map((n) => [n, wp(B[n])]));
    const top = bone('HeadTop_End') || B.Head, restTop = wp(top);
    /* the body's own shape at rest: how each trunk bone leans (the direction to its child, as degrees forward of straight up) */
    const lean = (a, b) => deg(Math.atan2(b.z - a.z, b.y - a.y));
    const shape = (P, T) => ({ Spine: lean(P.Hips, P.Spine1), Spine1: lean(P.Spine1, P.Spine2), Spine2: lean(P.Spine2, P.Neck), Neck: lean(P.Neck, P.Head), Head: lean(P.Head, T), headFwd: +((P.Head.z - P.Hips.z) * 100).toFixed(1), neckFwd: +((P.Neck.z - P.Hips.z) * 100).toFixed(1) });
    const res = { rest: shape(restP, restTop), clips: {} };
    for (const an of anims) {
      const clip = clipFor(an); if (!clip) { res.clips[an] = 'missing'; continue; }
      const ctl = animate(m, an), N = 12, acc = Object.fromEntries(BONES.map((n) => [n, [0, 0, 0]])), sh = {};
      for (let k = 0; k < N; k++) {
        ctl.base.time = 0; ctl.mx.setTime(clip.duration * (k + 0.5) / N); m.updateMatrixWorld(true);
        /* the whole body may be turned by the clip: measure everything in the hips' own heading */
        const hq = wq(B.Hips), f = new THREE.Vector3(0, 0, 1).applyQuaternion(hq.clone().multiply(rest.Hips.clone().invert())).setY(0).normalize(), yaw = Math.atan2(f.x, f.z), unyaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -yaw);
        for (const n of BONES) { const d = unyaw.clone().multiply(wq(B[n])).multiply(rest[n].clone().invert()), e = new THREE.Euler().setFromQuaternion(d, 'YXZ'); acc[n][0] += e.x / N; acc[n][1] += e.y / N; acc[n][2] += e.z / N; }
        const P = Object.fromEntries(BONES.map((n) => [n, wp(B[n]).sub(wp(B.Hips)).applyQuaternion(unyaw)])), T = wp(top).sub(wp(B.Hips)).applyQuaternion(unyaw), s1 = shape(P, T);
        for (const key in s1) sh[key] = (sh[key] || 0) + s1[key] / N;
      }
      res.clips[an] = { pitch: Object.fromEntries(BONES.map((n) => [n, deg(acc[n][0])])), turn: Object.fromEntries(BONES.slice(0, 6).map((n) => [n, deg(acc[n][1])])), tip: Object.fromEntries(BONES.slice(0, 6).map((n) => [n, deg(acc[n][2])])), shape: Object.fromEntries(Object.entries(sh).map(([k2, v]) => [k2, +v.toFixed(1)])) };
      ctl.mx.stopAllAction(); ctl.mx.uncacheRoot(m);
    }
    out[nameOf(id)] = res;
  }
  window.__POSTURE = out; document.title = 'POSTURE done';
})().catch((e) => { document.title = 'POSTURE error ' + e.message; });
