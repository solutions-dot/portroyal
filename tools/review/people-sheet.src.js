/* tools/review/people-sheet.src.js: a character sheet for any packed body of any game, drawn the same way for all of them.
   Six views of each body in the game's own standing clip: whole body from the front, the side and behind, and the face from the
   front, three-quarter and side. Skin is lightened by 1.55 as the games do (owner rule 9). Bundled and driven by people-sheet.mjs. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { repairLegacyVertexColours } from '../../engine/colours.js';
import { loadClips, clipFor, animate } from '../../engine/anim.js';   /* the game's own way of playing a clip (no bone positions, the posture correction), so the sheet shows the stance the game shows */

const q = new URLSearchParams(location.search), game = q.get('game'), ids = q.get('ids').split(','), anim = q.get('anim') || 'Idle';
const hide = (q.get('hide') || '').split(',').filter(Boolean), skinK = +(q.get('skin') || 1.55), views = (q.get('views') || 'front,side,back,face,face34,faceside').split(',');
const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
const script = (src) => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('missing ' + src)); document.head.appendChild(s); });
async function model(dir, n) {
  await script(dir + n + '.js'); const b = atob(window.__models[n]), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
  return new Promise((res, rej) => loader.parse(u.buffer, '', (g) => res(repairLegacyVertexColours(g)), rej));
}
const W = +(q.get('w') || 300), H = +(q.get('h') || 420), cv = document.createElement('canvas'); document.body.style.margin = 0; document.body.appendChild(cv);
const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true }); renderer.setPixelRatio(1); renderer.setSize(W * views.length, H * ids.length);
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0xb9c2c4);
scene.add(new THREE.HemisphereLight(0xdfe8f2, 0x8a8068, 1.25)); const sun = new THREE.DirectionalLight(0xfff2dc, 1.9); scene.add(sun, sun.target);
const cam = new THREE.PerspectiveCamera(20, W / H, 0.05, 50);
const dir = (id) => id.includes('/') ? id.slice(0, id.lastIndexOf('/') + 1) : `../../games/${game}/site/models/`, nameOf = (id) => id.slice(id.lastIndexOf('/') + 1);
(async () => {
  const clips = (await model(`../../games/${game}/site/models/`, 'anims')).animations; let extra = [];
  if (q.get('clips')) extra = (await model(`../../games/${game}/site/models/`, q.get('clips'))).animations;
  loadClips({ animations: [...clips, ...extra] }); const clip = clipFor(anim);
  for (let r = 0; r < ids.length; r++) {
    const g = await model(dir(ids[r]), nameOf(ids[r])), m = g.scene; scene.add(m);
    m.traverse((o) => { if (!o.isMesh) return; o.frustumCulled = false; const nm = o.material.name || ''; if (hide.includes(nm) || hide.includes(o.name)) o.visible = false; if (nm === 'Skin') { o.material = o.material.clone(); o.material.color.multiplyScalar(skinK); } if (q.has('pieces')) { let hsh = 0; for (const ch of o.name) hsh = (hsh * 31 + ch.charCodeAt(0)) >>> 0; o.material = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL((hsh % 360) / 360, 0.7, 0.55), side: q.get('pieces') === 'front' ? THREE.FrontSide : THREE.DoubleSide }); } });   /* &pieces=front shows only front faces;: each piece in its own flat colour, to see which piece is which */
    if (clip) { const ctl = animate(m, anim); ctl.base.time = 0; ctl.mx.update(+(q.get('at') || 0.4)); }   /* the engine's own player, so a seated skirt and hands kept clear of the lap show as they do in the game */
    m.updateMatrixWorld(true);
    const bone = (n) => { let b = null; m.traverse((o) => { if (o.isBone && o.name.replace(/[:_]/g, '').toLowerCase() === 'mixamorig' + n) b = o; }); return b; };
    const head = bone('head').getWorldPosition(new THREE.Vector3()), hips = bone('hips').getWorldPosition(new THREE.Vector3()), top = bone('headtopend') ? bone('headtopend').getWorldPosition(new THREE.Vector3()) : head.clone().setY(head.y + 0.2);
    const foot = Math.min(bone('lefttoebase').getWorldPosition(new THREE.Vector3()).y, bone('righttoebase').getWorldPosition(new THREE.Vector3()).y) - 0.06;
    const fq = bone('head').getWorldQuaternion(new THREE.Quaternion()), fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(fq).setY(0).normalize(), yaw = Math.atan2(fwd.x, fwd.z);
    const fc = head.clone().lerp(top, 0.52), bc = new THREE.Vector3(hips.x, (foot + top.y) / 2, hips.z), bh = top.y - foot + 0.12;
    views.forEach((v, c) => {
      const nk = v.startsWith('neck'), face = v.startsWith('face') || nk, torso = v.startsWith('torso'), a = (face ? yaw : 0) + ({ front: 0, side: Math.PI / 2, back: Math.PI, face: 0, face34: 0.62, faceside: Math.PI / 2, torso: 0, torso34: 0.7, torsoside: Math.PI / 2, torsoback: Math.PI, neck: 0, neck34: 0.7, neckside: Math.PI / 2, neckback: Math.PI })[v];
      const ctr = nk ? bone('neck').getWorldPosition(new THREE.Vector3()) : face ? fc : torso ? new THREE.Vector3(hips.x, (hips.y + head.y) / 2 + 0.02, hips.z) : bc, span = nk ? 0.2 : face ? +(q.get('fs') || 0.36) : torso ? head.y - hips.y + 0.34 : bh, d = span / 2 / Math.tan((cam.fov / 2) * Math.PI / 180);
      cam.position.set(ctr.x + Math.sin(a) * d, ctr.y, ctr.z + Math.cos(a) * d); cam.lookAt(ctr); sun.position.set(ctr.x + Math.sin(a + 0.7) * 5, ctr.y + 4, ctr.z + Math.cos(a + 0.7) * 5); sun.target.position.copy(ctr); sun.target.updateMatrixWorld();
      renderer.setScissorTest(true); renderer.setViewport(c * W, (ids.length - 1 - r) * H, W, H); renderer.setScissor(c * W, (ids.length - 1 - r) * H, W, H); renderer.render(scene, cam);
    });
    scene.remove(m);
  }
  document.title = 'SHEET done';
})().catch((e) => { document.title = 'SHEET error ' + e.message; });
