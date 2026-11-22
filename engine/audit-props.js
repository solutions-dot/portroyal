/* engine/audit-props.js: small props that do not read as the real thing close up (22 November 2026). The owner asked for the graphics to
   be polished "like the hat has no opening": a cup or pot made as a solid cylinder, a cover made as a sheet of card. Two gentle reports:

   - solid pot: a small closed cylinder (radius 2.5 to 10 cm, 4 to 30 cm tall) with something thin standing in its top (pencils, a quill,
     a brush, stems; a candle as wide as its socket is held, so it is not reported), so the thing seems stuck into a solid lid. Give the pot an opening (engine/vessel.js).
   - card cover: a flat box under 1.2 cm thick and over 60 cm both ways (not glass), lying level more than 30 cm off the ground with nothing as big under it: a cover, cloth or
     tarpaulin drawn as a thin slab. Drape it, give it thickness or folds.

   propSnap(group) notes the small meshes of a place before its scenery is merged (call it where the game takes its audit snapshot);
   auditProps(list) returns lines that start "prop ". Wired into ?test=audit in Rose Hall and The Shark Papers (docs/TESTING.md). */
import * as THREE from 'three';

export function propSnap(group) {
  group.updateMatrixWorld(true);
  const out = [], s = new THREE.Vector3();
  group.traverse((o) => {
    if (!o.isMesh || o.isSkinnedMesh || o.isInstancedMesh) return;
    for (let a = o; a; a = a.parent) if (a.userData && a.userData.guide) return;
    const b = new THREE.Box3().setFromObject(o);
    if (!isFinite(b.min.x)) return;
    const size = b.getSize(new THREE.Vector3());
    const p = o.geometry.parameters || {};
    o.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), s);
    out.push({ type: o.geometry.type, p, b, size, scale: s.clone(), clear: [].concat(o.material).some((m) => m && m.transparent && m.opacity < 0.9), up: Math.abs(new THREE.Vector3(0, 1, 0).applyQuaternion(o.getWorldQuaternion(new THREE.Quaternion())).y) > 0.97 });
  });
  return out;
}

const f = (v) => v.toFixed(2);
export function auditProps(list) {
  const out = [];
  const pots = list.filter((m) => m.type === 'CylinderGeometry' && !m.p.openEnded && m.up && m.size.y <= 0.3 && m.size.y >= 0.04 &&   /* a flat foot under a stem is not a pot */ Math.max(m.size.x, m.size.z) / 2 >= 0.025 && Math.max(m.size.x, m.size.z) / 2 <= 0.1);   /* a lamp housing or a fan's motor is bigger */
  const thin = list.filter((m) => m.size.y > 0.04 && (Math.max(m.size.x, m.size.z) < 0.03 || (!m.up && Math.max(m.size.x, m.size.z) < m.size.y * 0.6)));   /* upright sticks, and leaning ones (a quill); not an animal's leg in its hoof */
  for (const pot of pots) {
    const top = pot.b.max.y, c = pot.b.getCenter(new THREE.Vector3()), r = Math.min(pot.size.x, pot.size.z) / 2;
    const stuck = thin.find((t) => t !== pot && (Math.max(t.size.x, t.size.z) >= 0.03 || Math.max(t.size.x, t.size.z) < 0.5 * r) &&   /* a straight candle that fills its socket is held, not stuck */
      t.b.min.y >= top - 0.06 && t.b.min.y <= top + 0.005 && t.b.max.y > top + 0.03 && Math.hypot((t.b.min.x + t.b.max.x) / 2 - c.x, (t.b.min.z + t.b.max.z) / 2 - c.z) < r * 0.6);   /* standing in the middle of the top, not a tube at the rim */
    if (stuck) out.push(`prop solid pot at (${f(c.x)}, ${f(top)}, ${f(c.z)}): something stands in a closed cylinder ${Math.round(r * 200)} cm across; give it an opening (engine/vessel.js)`);
  }
  for (const m of list) {
    if (m.type !== 'BoxGeometry' || !m.up || m.clear) continue;   /* a glass top is meant to be thin */
    const t = m.size.y, w = Math.min(m.size.x, m.size.z);
    const c = m.b.getCenter(new THREE.Vector3()), onTop = list.some((o) => o !== m && o.b.max.y <= m.b.min.y + 0.004 && o.b.max.y >= m.b.min.y - 0.02 && o.b.min.x <= c.x && o.b.max.x >= c.x && o.b.min.z <= c.z && o.b.max.z >= c.z && Math.min(o.size.x, o.size.z) >= w * 0.8);   /* a lining laid flat on a solid top is fine */
    if (t < 0.012 && w > 0.6 && m.b.min.y > 0.3 && !onTop) out.push(`prop card cover at (${f((m.b.min.x + m.b.max.x) / 2)}, ${f(m.b.max.y)}, ${f((m.b.min.z + m.b.max.z) / 2)}): a flat slab ${Math.round(m.size.x * 100)} by ${Math.round(m.size.z * 100)} cm and ${(t * 1000).toFixed(0)} mm thick; drape it or give it thickness`);
  }
  return out;
}
