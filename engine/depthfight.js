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
const offset = (o) => { const m = Array.isArray(o.material) ? o.material[0] : o.material; return m && m.polygonOffset ? m.polygonOffsetUnits : 0; };   /* the step a face is drawn at: two faces at different steps are settled */
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
function collect(root) {   /* every flat, axis-square face of the place, measured once */
  root.updateMatrixWorld(true);
  const all = [];
  root.traverse((o) => { if (skip(o)) return; for (const f of facesOf(o)) all.push({ ...f, o }); });
  return all;
}
export function findFights(root, { gap = 0.012, minArea = 0.003 } = {}, all = collect(root)) {
  const groups = new Map();
  for (const f of all) { const key = f.k + ':' + f.s; (groups.get(key) || groups.set(key, []).get(key)).push(f); }
  const out = [], seen = new Set();
  for (const list of groups.values()) {
    list.sort((p, q) => p.c - q.c);
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length && list[j].c - list[i].c <= gap; j++) {
      const A = list[i], B = list[j];
      if (A.o === B.o || offset(A.o) !== offset(B.o)) continue;   /* drawn at different steps: one is already drawn over the other */
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
  /* each face that fights is lifted only above the faces it really overlaps: for every pair, the outer one (along the way they face; in one plane
     the smaller) must sit one step over the inner one, and a face's level is one more than the highest level beneath it (a road over a yard over the
     ground: levels 0, 1, 2). Each step is 4 units of offset, with a fixed slope factor of -1, at most 48 steps (a run of ground patches can be deep; with the slope factor fixed, many small steps are harmless).
     (Until 24 November 2026 every face in a whole chain of touching faces took a step, and the slope factor grew with it: a house's body, through its
     roof edge, reached factor -30, and seen at an angle its front wall leapt in front of the windows 5 cm before it, so they came and went as you
     walked: owner, Spanish Town in The Mad Master.) Up to sixteen rounds catch faces that only fight once others are settled. */
  const MAXL = 48, level = (o) => Math.round(-offset(o) / 4);
  let n = 0;
  const all = collect(root);   /* the faces do not move while they are settled, only their materials change: measured once (each round measured every triangle again, and the whole-place audit timed out) */
  for (let round = 0; round < 16; round++) {
    const fights = findFights(root, opts, all);
    if (!fights.length) break;
    const under = new Map();   /* outer mesh -> the inner meshes it must sit over */
    for (const f of fights) {
      const A = f.a, B = f.b, outerB = B.c * B.s > A.c * A.s + 1e-6 || (Math.abs(B.c * B.s - A.c * A.s) <= 1e-6 && B.area < A.area);
      const [inner, outer] = outerB ? [A.o, B.o] : [B.o, A.o];
      (under.get(outer) || under.set(outer, new Set()).get(outer)).add(inner);
    }
    const lv = new Map();
    const get = (o) => (lv.has(o) ? lv.get(o) : level(o));
    for (let pass = 0; pass < MAXL + 2; pass++) {   /* longest path from the bottom, relaxed; a loop stops at the cap */
      let moved = false;
      for (const [o, ins] of under) { let want = get(o); for (const u of ins) want = Math.max(want, get(u) + 1); want = Math.min(MAXL, want); if (want !== get(o)) { lv.set(o, want); moved = true; } }
      if (!moved) break;
    }
    /* a loop (box A over B on their tops, B over C on their sides, C over A on their fronts) has no order: any pair still on one step is split by
       lifting its outer face one more, so no two faces that fight share a step */
    for (let pass = 0; pass < 6; pass++) {
      let split = false;
      for (const [o, ins] of under) for (const u of ins) if (get(o) === get(u)) { lv.set(o, get(u) + 1); split = true; }
      if (!split) break;
    }
    for (const [o, L] of lv) {
      if (L <= level(o)) continue;
      const m = (Array.isArray(o.material) ? o.material[0] : o.material).clone();
      m.polygonOffset = true; m.polygonOffsetFactor = -1; m.polygonOffsetUnits = -4 * L; m.userData = { ...m.userData, settled: true };
      if (Array.isArray(o.material)) o.material = o.material.map((x, i) => (i === 0 ? m : x)); else o.material = m;
      n++;
    }
  }
  return n;
}
/* for the place audit: one line per pair still fighting */
export function fightLines(root, opts) {
  return findFights(root, opts).map((f) => `depth fight: ${nameOf(f.a.o)} and ${nameOf(f.b.o)} lie ${(f.gap * 1000).toFixed(1)} mm apart in one plane (${f.axis} = ${f.a.c.toFixed(3)}), overlapping ${(f.area * 10000).toFixed(0)} cm² at (${f.at.map((v) => v.toFixed(2)).join(', ')}): they flicker as the camera moves`);
}
