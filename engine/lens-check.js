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
/* the nearest name, and where the thing is, so a hit inside a whole place's group still says which mesh it is */
const nameOf = (o) => {
  let n = null; for (let p = o; p && !n; p = p.parent) if (p.name && !/^(Scene|Group|Object3D)$/.test(p.name)) n = p.name;
  if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
  const c = _s2.copy(o.geometry.boundingSphere).applyMatrix4(o.matrixWorld).center;
  const m = Array.isArray(o.material) ? o.material[0] : o.material, col = m?.color ? '#' + m.color.getHexString() : '';
  return (o.name || n || o.geometry?.type || 'a mesh') + (o.name && n && o.name !== n ? ' in ' + n : '') + ' (' + o.geometry.type + ' ' + col + ', centre ' + c.toArray().map((v) => v.toFixed(1)).join(',') + ')';
};
/* the solid meshes of a scene, gathered once and kept until the scene's mesh count changes (a full-scene raycast walks every skinned body
   on the CPU, which made ?test=lens time out); only meshes whose bounding sphere reaches the ray are tested */
const _cache = new WeakMap(), _s = new THREE.Sphere(), _s2 = new THREE.Sphere();
function solids(scene) {
  let n = 0; scene.traverse((o) => { if (o.isMesh) n++; });
  const c = _cache.get(scene);
  if (c && c.n === n) return c.list;
  const list = []; scene.traverse((o) => { if (o.isMesh && !o.isSkinnedMesh) list.push(o); });
  _cache.set(scene, { n, list }); return list;
}
function firstHit(from, dir, far, scene) {
  ray.set(from, dir); ray.far = far; ray.near = 0.02;
  const near = [];
  for (const o of solids(scene)) {
    if (!solid(o)) continue;
    if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
    _s.copy(o.geometry.boundingSphere).applyMatrix4(o.matrixWorld);
    if (_s.distanceToPoint(from) > far) continue;
    if (ray.ray.distanceSqToPoint(_s.center) > _s.radius * _s.radius) continue;
    near.push(o);
  }
  let best = null;
  for (const h of ray.intersectObjects(near, false)) if (!best || h.distance < best.distance) best = h;
  return best;
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
/* a mesh whose box (grown by 1.5 m) holds the target is the thing looked at (a building filmed from outside), not something in front of it */
const _b = new THREE.Box3();
export function targetHidden(from, to, scene) {
  const f = new THREE.Vector3(...from), t = new THREE.Vector3(...to), d = t.clone().sub(f), L = d.length();
  ray.set(f, d.normalize()); ray.near = 0.02; ray.far = Math.min(L * 0.9, L - 0.3);   /* the last 30 cm is the thing itself (a box looked at from a metre away) */
  const cand = solids(scene).filter((o) => solid(o) && !_b.setFromObject(o).expandByScalar(1.5).containsPoint(t));
  const h = ray.intersectObjects(cand, false)[0];
  return h ? nameOf(h.object) + ' at ' + h.distance.toFixed(1) + ' m' : null;
}
