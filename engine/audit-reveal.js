/* engine/audit-reveal.js: the things a "look" moves are checked in both of their states (22 November 2026).
   A place's Q.reveal[id](seen) moves or shows something when the player looks at it (a lid lifts, a cloth slides back, a hat is hung up).
   The place audit only saw the place as first built, and a moved thing could end up in mid-air: in The Mad Master of Edinburgh Castle
   the hat "hung on a root" floated beside the tree with no root there (owner, 22 November 2026: "It just floats in air.. more carefully
   checks for this"). It had also been marked noAudit, so nothing looked at it.

   auditReveals(Q, { groundAt, settle }) runs every reveal of a place: for each one it notes every mesh before, shows the found state, and
   finds the meshes that moved or appeared. Each of those must rest on something: its lowest point on the ground, or a real surface of a mesh
   that did not move within 2 cm under it or over it (short rays; to the side as well only for a piece marked userData.fixed), or another moved piece that rests (a hat on a peg that came with it, a lantern on its rope). A cluster that
   rests on nothing is reported, with where it is and how high. Then the place is put back. noAudit does NOT hide a moved thing here:
   that flag is for guides and glows, never for story objects. Flames, see-through glows and points are left out, as in auditRest.

   Wire it into the game's ?test=audit: results.push(...auditReveals(Q, { groundAt })) for every place. Each line starts "reveal <id>". */
import * as THREE from 'three';
import { auditResting } from './audit-placed.js';

const glow = (o) => { const m = [].concat(o.material)[0]; return !m || (m.isMeshBasicMaterial && m.transparent) || o.userData.flame || o.userData.guide; };
function meshes(group) {
  group.updateMatrixWorld(true); const out = new Map();
  group.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || glow(o)) return;
    for (let a = o; a && a !== group; a = a.parent) if (!a.visible) return;   /* the place itself may be hidden while another is played: only parts hidden inside it are left out */
    const b = new THREE.Box3().setFromObject(o); if (isFinite(b.min.x)) out.set(o, b);
  });
  return out;
}
/* a piece fixed to a wall or a frame (a shutter on its hinge, a notice pinned up, a board on its nails) is held from the side: mark it
   userData.fixed = true on it or a parent. Anything else needs a surface under it or a hook, beam or rope over it: a hat touching a
   tree trunk from the side is still in the air. */
const fixedTo = (o) => { for (let a = o; a; a = a.parent) if (a.userData && a.userData.fixed) return true; return false; };
/* worn by a rigged animal (a pack saddle, a halter, a load in engine/mule.js's userData.back): its group rides on a bone of a skinned body
   that stands on its own hooves, and skinned bodies are not rays' targets here, so a worn piece is held by the animal (27 November 2026) */
const wornBy = (o) => { for (let a = o; a; a = a.parent) if (a.userData && a.userData.worn) return true; return false; };
const moved = (a, b) => !a || a.min.distanceTo(b.min) > 0.01 || a.max.distanceTo(b.max) > 0.01;

export function auditReveals(Q, { groundAt = null, settle = null, tol = 0.02, tasks = null, resting = false } = {}) {   /* resting: also run the things-rest-on-something check (engine/audit-placed.js); on in Xaymaca, off elsewhere until each game's findings are sorted (docs/reviews/floating-20261126.md) */
  const out = [], R = Q.reveal || {}, g = groundAt || (() => 0), V = new THREE.Vector3();
  for (const id of Object.keys(R)) {
    const fn = R[id]; if (typeof fn !== 'function') continue;
    for (const seen of [false, true]) {
      fn(!seen); settle?.(); const before = meshes(Q.group);
      fn(seen); settle?.(); const after = meshes(Q.group);
      const still = [], move = [];
      for (const [o, b] of after) (moved(before.get(o), b) ? move : still).push([o, b]);
      if (globalThis.__REVEAL_DEBUG) out.push('debug ' + id + ' seen=' + seen + ' meshes=' + after.size + ' moved=' + move.length);
      if (!move.length) continue;
      /* a moved piece that is not marked noBatch (on it or a parent) is merged into the place's still meshes when the place is built (engine/batch.js),
         so in the game it never moves: Air Jamaica's box lid "never lift" (owner, 25 November 2026) though it moved here, before the merge */
      if (seen) {
        const frozen = move.filter(([o]) => { for (let a = o; a; a = a.parent) if (a.userData && a.userData.noBatch) return false; return true; });
        if (frozen.length) out.push(`reveal ${id}: ${frozen.length} moving piece${frozen.length > 1 ? 's are' : ' is'} not marked noBatch, so the merge freezes ${frozen.length > 1 ? 'them' : 'it'} and nothing moves in the game (mark the moving part dynamic)`);
      }
      /* what can hold a thing up: a real surface, found with short rays against every mesh that did not move (merged scenery too: a ray
         meets its triangles, not its box). A box test let the hat pass: the cotton tree's box reaches far past its trunk. A piece rests
         when its lowest point is on the ground, or a ray from under it (down) or over it (up, a hook or a beam) meets a surface within tol
         of its own face; a piece marked fixed may also be held from the side. */
      const solid = still.map(([o]) => o), ray = new THREE.Raycaster(), D = [[0, -1, 0], [0, 1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]].map((d) => new THREE.Vector3(...d));
      const touches = (b, side) => {
        const c = b.getCenter(new THREE.Vector3()), h = b.getSize(new THREE.Vector3()).multiplyScalar(0.5);
        for (const d of side ? D : D.slice(0, 2)) {
          const reach = Math.abs(d.x) * h.x + Math.abs(d.y) * h.y + Math.abs(d.z) * h.z;   /* from the middle to its own face along d */
          const starts = d.y ? [[0, 0], [0.6, 0.6], [-0.6, 0.6], [0.6, -0.6], [-0.6, -0.6]].map(([u, w]) => new THREE.Vector3(c.x + u * h.x, c.y, c.z + w * h.z)) : [c.clone()];
          for (const o of starts) { ray.set(o, d); ray.far = reach + tol + 0.03; if (ray.intersectObjects(solid, false).length) return true; }
        }
        return false;
      };
      const rests = new Set();
      for (const [o, b] of move) {
        const c = b.getCenter(new THREE.Vector3());
        if (b.min.y <= g(c.x, c.z) + 0.03 || wornBy(o) || touches(b, fixedTo(o))) rests.add(o);
      }
      for (let grew = true; grew; ) { grew = false;   /* a moved piece resting on a moved piece that rests */
        for (const [o, b] of move) if (!rests.has(o)) { const near = b.clone().expandByScalar(tol); if (move.some(([p, s]) => rests.has(p) && s.intersectsBox(near))) { rests.add(o); grew = true; } } }
      const loose = move.filter(([o]) => !rests.has(o));
      if (!loose.length) continue;
      const box = new THREE.Box3(); for (const [, b] of loose) box.union(b);
      const c = box.getCenter(new THREE.Vector3());
      out.push(`reveal ${id} (${seen ? 'found' : 'before'}): ${loose.length} moved piece${loose.length > 1 ? 's' : ''} at (${c.x.toFixed(2)}, ${box.min.y.toFixed(2)}, ${c.z.toFixed(2)}) rest on nothing, ${(box.min.y - g(c.x, c.z)).toFixed(2)} m above the ground`);
    }
    fn(false); settle?.();
  }
  if (resting) out.push(...auditResting(Q, { tasks, groundAt }));   /* things that should rest on something, in every game's audit (engine/audit-placed.js, 26 November 2026) */
  return out;
}
