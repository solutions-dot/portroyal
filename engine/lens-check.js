/* engine/lens-check.js: is the camera looking through something? (owner, 23 November 2026, Morant Bay: "The camera cuts through buildings as
   well", and a camera scene framed through a wall of banana leaves). For any game's camera scenes and look moments (rule 10).
     lensBlocked(camera, scene, { near: 1.2 })   -> { share, what }: the share of nine rays across the middle of the view that hit something
                                                    solid within `near` metres of the lens, and the name of the nearest thing hit
     targetHidden(from, to, scene)              -> the name of the first solid thing between two points (a camera and what it looks at), or null
   People (skinned meshes), glows, skies, water and anything marked userData.noAudit are not counted: a person in the foreground is framing,
   a leaf or a roof filling the lens is a fault. */
import * as THREE from 'three';

const ray = new THREE.Raycaster(), _d = new THREE.Vector3(), _q = new THREE.Quaternion(), _e = new THREE.Euler();
const solid = (o) => {
  if (!o.isMesh || o.isSkinnedMesh || !o.visible) return false;
  for (let p = o; p; p = p.parent) { if (!p.visible || p.userData.noAudit) return false; }
  const m = Array.isArray(o.material) ? o.material[0] : o.material;
  return !(!m || m.isMeshBasicMaterial || m.isSpriteMaterial || m.blending === THREE.AdditiveBlending || (m.transparent && m.opacity < 0.6) || o.userData.water);
};
const nameOf = (o) => { for (let p = o; p; p = p.parent) if (p.name && !/^(Scene|Group|Object3D)$/.test(p.name)) return p.name; return o.geometry?.type || 'a mesh'; };
function firstHit(from, dir, far, scene) {
  ray.set(from, dir); ray.far = far; ray.near = 0.02;
  for (const h of ray.intersectObject(scene, true)) if (solid(h.object)) return h;
  return null;
}
export function lensBlocked(camera, scene, { near = 1.2, spread = 0.16 } = {}) {
  camera.updateMatrixWorld(true); camera.getWorldQuaternion(_q);
  let hits = 0, best = null;
  for (const yx of [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]]) {
    _e.set(yx[1] * spread, yx[0] * spread, 0, 'YXZ');
    _d.set(0, 0, -1).applyEuler(_e).applyQuaternion(_q).normalize();
    const h = firstHit(camera.getWorldPosition(new THREE.Vector3()), _d.clone(), near, scene);
    if (h) { hits++; if (!best || h.distance < best.distance) best = h; }
  }
  return { share: hits / 9, what: best ? nameOf(best.object) : null, at: best ? best.distance : null };
}
export function targetHidden(from, to, scene) {
  const f = new THREE.Vector3(...from), t = new THREE.Vector3(...to), d = t.clone().sub(f), L = d.length();
  const h = firstHit(f, d.normalize(), L * 0.9, scene);
  return h ? nameOf(h.object) + ' at ' + h.distance.toFixed(1) + ' m' : null;
}
