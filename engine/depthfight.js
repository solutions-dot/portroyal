/* engine/depthfight.js: two surfaces in one plane fight to be drawn, and flicker in a jagged, blocky pattern as the camera moves (owner,
   23 November 2026, Rose Hall: the door frames and the rugs flickered on the title screen and while walking; worst on phones and tablets,
   which keep less depth precision than a computer). For every game (rule 10): engine/batch.js settles each place as it is batched, and the
   place audit reports what is left (rule 8).
     findFights(root, { gap })   -> [{ a, b, gap, area, at }]: pairs of meshes with flat faces that face the same way, lie in one plane or
                                    within `gap` metres of it (default 12 mm: a rug laid 8 mm over a floor), and overlap by at least 30 cm²
     settleFights(root)          gives the smaller face of each pair (the rug, the frame, the patch of light) a polygon offset, so it is always
                                    drawn over the other; its material is copied first, so nothing else that shares it changes
   Only faces square to the world's axes are compared (floors, rugs, walls, door frames, boards), which is where this happens. Skinned people,
   glows (additive), sprites and anything marked userData.noAudit are left out; a face already given a polygon offset counts as settled. */
import * as THREE from 'three';

const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _n = new THREE.Vector3(), _e1 = new THREE.Vector3(), _e2 = new THREE.Vector3();
const AX = ['x', 'y', 'z'];
const skip = (o) => {
  if (!o.isMesh || o.isSkinnedMesh || o.isInstancedMesh || !o.visible) return true;
  for (let p = o; p; p = p.parent) if (p.userData.noAudit) return true;   /* a place is built while its group is hidden: only the mesh's own visibility counts */
  const m = Array.isArray(o.material) ? o.material[0] : o.material;
  return !m || m.isSpriteMaterial || m.blending === THREE.AdditiveBlending || m.colorWrite === false;
};
const offset = (o) => { const m = Array.isArray(o.material) ? o.material[0] : o.material; return !!(m && m.polygonOffset); };
/* the flat, axis-square faces of one mesh, as rectangles in their plane: [{ k (axis), s (+1/-1), c (plane), u0, u1, v0, v1, area }] */
function facesOf(o) {
  const g = o.geometry, pos = g && g.attributes.position;
  if (!pos) return [];
  const idx = g.index, n = idx ? idx.count : pos.count;
  if (n / 3 > 6000) return [];
  const map = new Map(), mw = o.matrixWorld;
  for (let t = 0; t < n; t += 3) {
    const i0 = idx ? idx.getX(t) : t, i1 = idx ? idx.getX(t + 1) : t + 1, i2 = idx ? idx.getX(t + 2) : t + 2;
    _a.fromBufferAttribute(pos, i0).applyMatrix4(mw); _b.fromBufferAttribute(pos, i1).applyMatrix4(mw); _c.fromBufferAttribute(pos, i2).applyMatrix4(mw);
    _n.crossVectors(_e1.subVectors(_b, _a), _e2.subVectors(_c, _a));
    const L = _n.length(); if (L < 1e-7) continue; _n.divideScalar(L);
    let k = -1; for (let j = 0; j < 3; j++) if (Math.abs(_n.getComponent(j)) > 0.999) k = j;
    if (k < 0) continue;
    const s = Math.sign(_n.getComponent(k)), c = (_a.getComponent(k) + _b.getComponent(k) + _c.getComponent(k)) / 3, u = (k + 1) % 3, v = (k + 2) % 3;
    const key = k + ':' + s + ':' + Math.round(c * 2000);
    let r = map.get(key);
    if (!r) map.set(key, (r = { k, s, c, u0: Infinity, u1: -Infinity, v0: Infinity, v1: -Infinity, area: 0 }));
    for (const p of [_a, _b, _c]) { const pu = p.getComponent(u), pv = p.getComponent(v); r.u0 = Math.min(r.u0, pu); r.u1 = Math.max(r.u1, pu); r.v0 = Math.min(r.v0, pv); r.v1 = Math.max(r.v1, pv); }
    r.area += L / 2;
  }
  return [...map.values()];
}
const nameOf = (o) => { for (let p = o; p; p = p.parent) if (p.name && !/^(Scene|Group|Object3D)$/.test(p.name)) return p.name; return o.geometry.type; };
export function findFights(root, { gap = 0.012, minArea = 0.003 } = {}) {
  root.updateMatrixWorld(true);
  const all = [];
  root.traverse((o) => { if (skip(o)) return; for (const f of facesOf(o)) all.push({ ...f, o }); });
  const groups = new Map();
  for (const f of all) { const key = f.k + ':' + f.s; (groups.get(key) || groups.set(key, []).get(key)).push(f); }
  const out = [], seen = new Set();
  for (const list of groups.values()) {
    list.sort((p, q) => p.c - q.c);
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length && list[j].c - list[i].c <= gap; j++) {
      const A = list[i], B = list[j];
      if (A.o === B.o || (offset(A.o) !== offset(B.o))) continue;   /* one already drawn over the other */
      const du = Math.min(A.u1, B.u1) - Math.max(A.u0, B.u0), dv = Math.min(A.v1, B.v1) - Math.max(A.v0, B.v0);
      if (du <= 0.01 || dv <= 0.01 || du * dv < minArea) continue;
      const key = A.o.uuid < B.o.uuid ? A.o.uuid + B.o.uuid : B.o.uuid + A.o.uuid;
      if (seen.has(key)) continue; seen.add(key);
      const at = [0, 0, 0]; at[A.k] = A.c; at[(A.k + 1) % 3] = (Math.max(A.u0, B.u0) + Math.min(A.u1, B.u1)) / 2; at[(A.k + 2) % 3] = (Math.max(A.v0, B.v0) + Math.min(A.v1, B.v1)) / 2;
      out.push({ a: A, b: B, gap: B.c - A.c, area: du * dv, axis: AX[A.k], at });
    }
  }
  return out;
}
export function settleFights(root, opts) {
  let n = 0;
  for (const f of findFights(root, opts)) {
    /* the one to lift: the face lying further out along its side (a rug over the floor), or, in one plane, the smaller face (a frame against a wall) */
    const out = f.gap > 0.0005 ? (f.a.s > 0 ? f.b : f.a) : f.a.area <= f.b.area ? f.a : f.b, o = out.o;
    if (offset(o)) continue;
    const m = (Array.isArray(o.material) ? o.material[0] : o.material).clone();
    m.polygonOffset = true; m.polygonOffsetFactor = -1; m.polygonOffsetUnits = -4; m.userData = { ...m.userData, settled: true };
    if (Array.isArray(o.material)) o.material = o.material.map((x, i) => (i === 0 ? m : x)); else o.material = m;
    n++;
  }
  return n;
}
/* for the place audit: one line per pair still fighting */
export function fightLines(root, opts) {
  return findFights(root, opts).map((f) => `depth fight: ${nameOf(f.a.o)} and ${nameOf(f.b.o)} lie ${(f.gap * 1000).toFixed(1)} mm apart in one plane (${f.axis} = ${f.a.c.toFixed(3)}), overlapping ${(f.area * 10000).toFixed(0)} cm² at (${f.at.map((v) => v.toFixed(2)).join(', ')}): they flicker as the camera moves`);
}
