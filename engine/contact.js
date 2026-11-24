/* engine/contact.js: a soft shadow under every person where there is no sun shadow (owner, 24 November 2026, graphics step 5). On a phone, and indoors
   where a game turns the sun's shadow off, people stood on the floor with nothing under them and seemed to float. engine/look.js calls it each frame.
     contactShadows(scene, on)   on: no sun shadow is being drawn now
   Each person is found by their skeleton: the soft dark patch lies under the middle of the hips and feet, just above the floor under the lower foot, sized
   by the body (a child's is smaller). Hidden people have none. A game that already lays its own patches (an object with
   userData.contactShadow) is left alone. The patch is a flat decal: drawn over the floor with a polygon offset, never in the audits (userData.noAudit). */
import * as THREE from 'three';

const MAX = 160, ST = new WeakMap();
let TEX = null;
function tex() {
  if (TEX) return TEX;
  const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(0,0,0,0.42)'); g.addColorStop(0.45, 'rgba(0,0,0,0.24)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  TEX = new THREE.CanvasTexture(c); TEX.colorSpace = THREE.SRGBColorSpace; return TEX;
}
const BONE = (sk, re) => sk.bones.find((b) => re.test(b.name));
const _h = new THREE.Vector3(), _a = new THREE.Vector3(), _b = new THREE.Vector3(), _hd = new THREE.Vector3(), _o = new THREE.Object3D();
export function contactShadows(scene, on) {
  let st = ST.get(scene);
  if (!st) {
    const m = new THREE.MeshBasicMaterial({ map: tex(), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -8, fog: true, toneMapped: false });
    const g = new THREE.PlaneGeometry(1, 1); g.rotateX(-Math.PI / 2);
    const mesh = new THREE.InstancedMesh(g, m, MAX); mesh.frustumCulled = false; mesh.count = 0; mesh.renderOrder = 1;
    mesh.raycast = () => {};   /* never hit by a tap or a ground test */
    mesh.userData.noAudit = true; mesh.userData.noAO = true; mesh.userData.noShadow = true; mesh.name = 'contactShadows';
    st = { mesh, people: [], age: 0, own: false }; ST.set(scene, st); scene.add(mesh);
  }
  if (st.age-- <= 0) {   /* who is there, every second or so */
    st.age = 60; st.people = []; st.own = false; const seen = new Set();
    scene.traverse((o) => { if (o.userData && o.userData.contactShadow) st.own = true; });
    scene.traverseVisible((o) => {
      if (!o.isSkinnedMesh || !o.skeleton || seen.has(o.skeleton)) return; seen.add(o.skeleton);
      const sk = o.skeleton, hips = BONE(sk, /Hips$/), l = BONE(sk, /LeftToe_?Base$|LeftFoot$/), r = BONE(sk, /RightToe_?Base$|RightFoot$/), hd = BONE(sk, /Head$/);
      if (hips && l && r && hd) st.people.push({ o, hips, l, r, hd, toe: /Toe/.test(l.name) ? 0.012 : 0.07 });   /* the toe bone lies about 2 cm above the floor, the ankle about 8 */
    });
  }
  const mesh = st.mesh;
  mesh.visible = on && !st.own;
  if (typeof window !== 'undefined' && window.__LOOK) window.__LOOK.contact = { people: st.people.length, laid: 0, own: st.own, on };
  if (!mesh.visible) return;
  let n = 0;
  for (const p of st.people) {
    if (n >= MAX) break;
    let vis = true; for (let q = p.o; q; q = q.parent) if (!q.visible) { vis = false; break; }
    if (!vis) continue;
    p.hips.getWorldPosition(_h); p.l.getWorldPosition(_a); p.r.getWorldPosition(_b); p.hd.getWorldPosition(_hd);
    const foot = Math.min(_a.y, _b.y), tall = Math.max(0.4, _hd.y - foot);   /* head above the feet: about 1.5 m for a grown-up */
    const s = 0.62 * tall / 1.5 + 0.25 * Math.hypot(_a.x - _b.x, _a.z - _b.z);
    if (s < 0.05) continue;
    _o.position.set((_h.x + (_a.x + _b.x) / 2) / 2, foot - p.toe, (_h.z + (_a.z + _b.z) / 2) / 2); _o.scale.set(s, 1, s); _o.updateMatrix();
    mesh.setMatrixAt(n++, _o.matrix);
  }
  mesh.count = n; mesh.instanceMatrix.needsUpdate = true;
  if (typeof window !== 'undefined' && window.__LOOK) window.__LOOK.contact = { people: st.people.length, laid: n, own: st.own, on };
}
