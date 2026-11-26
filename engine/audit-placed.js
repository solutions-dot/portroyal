/* engine/audit-placed.js: things that should rest on something and do not (owner, 26 November 2026: "things are floating like the cassava on the table,
   the cassava in the basket"). The rest check in audit.js only knows pots and bowls, and a carried item is not part of a place's scenery when the place
   is scanned, so a stack of bread hovering over a stone, or bread sitting on top of a basket instead of in it, passed every check.

   auditPlaced(root, items, opts) -> lines.
     root   the place's group (everything that could hold the item up)
     items  [{ label, obj }]: each thing that should rest on something, where it is now (a carried item at its start spot or where it is put down)
   For each item, rays drop from the top of its box through five points of its footprint (its middle and four points a third of the way out) and stop
   at the first surface that is not the item itself, a person or something hidden. The highest of those is what holds it up. The item floats when its
   lowest point is more than `gap` (1.5 cm) above that, and sinks into it when it is more than `sink` (4 cm) below. A ray that meets nothing at all
   (over the edge of the world) is ignored.

   loose(root, opts) -> [{ label, obj }]: the place's small loose things that stand raised off the ground (on a stone, a table, a shelf, in a basket):
   direct children of root no bigger than opts.max (1.2 m) across and tall, whose lowest point is above the ground by more than 3 cm, and that are not
   marked userData.hung (a thing that really hangs: a net, a lamp on a hook) or userData.noRest; and, at any depth, everything marked userData.rests
   (a part of something bigger that must lie on a surface of its own: each cassava cake in a basket or a stack). Pass them to auditPlaced as well.
   A mesh marked userData.cover (a cloth draped over a thing) is never taken for what holds something up. */
import * as THREE from 'three';

const DOWN = new THREE.Vector3(0, -1, 0);
const shown = (o, root) => { for (let q = o; q && q !== root.parent; q = q.parent) if (!q.visible) return false; return true; };

export function auditPlaced(root, items, { gap = 0.015, sink = 0.04 } = {}) {
  const out = [], ray = new THREE.Raycaster(), from = new THREE.Vector3(), box = new THREE.Box3();
  root.updateMatrixWorld(true);
  const meshes = [];
  const covered = (o) => { for (let q = o; q && q !== root; q = q.parent) if (q.userData.cover) return true; return false; };
  root.traverse((o) => { if (o.isMesh && !o.isSkinnedMesh && !o.isInstancedMesh && !o.userData.far && shown(o, root) && !covered(o)) meshes.push(o); });
  for (const { label, obj } of items) {
    if (!obj || !shown(obj, root)) continue;
    const own = new Set();
    obj.traverse((o) => own.add(o));
    box.setFromObject(obj);
    if (box.isEmpty()) continue;
    const others = meshes.filter((m) => !own.has(m));
    const cx = (box.min.x + box.max.x) / 2, cz = (box.min.z + box.max.z) / 2, hx = (box.max.x - box.min.x) / 3, hz = (box.max.z - box.min.z) / 3;
    let top = -Infinity;
    for (const [dx, dz] of [[0, 0], [hx, 0], [-hx, 0], [0, hz], [0, -hz]]) {
      from.set(cx + dx, box.max.y + 0.01, cz + dz);
      ray.set(from, DOWN);
      ray.far = box.max.y - box.min.y + 3;
      const hit = ray.intersectObjects(others, false)[0];
      if (hit) top = Math.max(top, hit.point.y);
    }
    if (top === -Infinity) continue;
    const d = box.min.y - top;
    if (d > gap) out.push(`floats: ${label} at (${cx.toFixed(2)}, ${box.min.y.toFixed(2)}, ${cz.toFixed(2)}) hangs ${(d * 100).toFixed(0)} cm above what is under it`);
    else if (-d > sink) out.push(`sinks: ${label} at (${cx.toFixed(2)}, ${box.min.y.toFixed(2)}, ${cz.toFixed(2)}) is ${(-d * 100).toFixed(0)} cm down inside what is under it`);
  }
  return out;
}

export function loose(root, { max = 1.2, groundAt = null } = {}) {
  const out = [], box = new THREE.Box3(), size = new THREE.Vector3();
  root.updateMatrixWorld(true);
  for (const o of root.children) {
    if (!o.visible || o.userData.hung || o.userData.noRest || o.userData.cover || o.userData.far || o.isLight || o.isSkinnedMesh) continue;
    let skinned = false;
    o.traverse((c) => { if (c.isSkinnedMesh) skinned = true; });
    if (skinned) continue;
    box.setFromObject(o);
    if (box.isEmpty()) continue;
    box.getSize(size);
    if (Math.max(size.x, size.z) > max || size.y > max || size.y < 0.02) continue;
    const g = groundAt ? groundAt((box.min.x + box.max.x) / 2, (box.min.z + box.max.z) / 2) : 0;
    if (box.min.y <= g + 0.03 || box.min.y > g + 3) continue;   /* on the ground, or far up (a roof part, a bird) */
    out.push({ label: (o.name || 'a loose thing') + ` (${size.x.toFixed(2)} x ${size.z.toFixed(2)} m)`, obj: o });
  }
  root.traverse((o) => { if (o.userData.rests && o !== root && !out.some((e) => e.obj === o)) out.push({ label: (o.userData.rests === true ? o.name || 'a part that rests' : o.userData.rests), obj: o }); });
  return out;
}

/* auditResting(Q, { tasks, groundAt }) -> lines: both passes for one place, as every game's ?test=audit runs it (through auditReveals in audit-reveal.js):
   the place's loose things, and, when the game has a task table (tasks: { id: { place, item, at, ry, hideAfter } }) and Q.items / Q.itemStarts, every
   carried item at its start spot and where it is put down, each on its own (the other items hidden, so two piles on one spot do not hold each other up). */
export function auditResting(Q, { tasks = null, groundAt = null } = {}) {
  if (!Q || !Q.group) return [];
  const items = Q.items || {}, carried = new Set(Object.values(items));
  const out = auditPlaced(Q.group, loose(Q.group, { groundAt }).filter((e) => !carried.has(e.obj)));
  if (!tasks) return out;
  for (const [id, t] of Object.entries(tasks)) {
    if (t.place !== Q.id || !items[t.item] || !t.at) continue;
    const o = items[t.item], keep = [o.parent, o.position.clone(), o.rotation.y, o.scale.clone(), o.visible], st = Q.itemStarts && Q.itemStarts[t.item];
    const others = Object.values(items).filter((x) => x !== o && x.visible);
    for (const x of others) x.visible = false;
    if (st) {
      Q.group.add(o); o.position.fromArray(st.at); o.rotation.set(0, st.ry || 0, 0); if (st.scale) o.scale.fromArray(st.scale); o.visible = true;
      out.push(...auditPlaced(Q.group, [{ label: `${t.item} at its start (${id})`, obj: o }]));
    }
    if (!t.hideAfter) {
      Q.group.add(o); o.position.fromArray(t.at); o.rotation.set(0, t.ry || 0, 0); o.scale.set(1, 1, 1); o.visible = true;
      out.push(...auditPlaced(Q.group, [{ label: `${t.item} put down (${id})`, obj: o }]));
    }
    if (keep[0]) keep[0].add(o); else Q.group.remove(o);
    o.position.copy(keep[1]); o.rotation.set(0, keep[2], 0); o.scale.copy(keep[3]); o.visible = keep[4];
    for (const x of others) x.visible = true;
  }
  return out;
}
