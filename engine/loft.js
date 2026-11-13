import * as THREE from 'three';

// Smooth cross sections for an animal's body and limbs. A continuous centreline
// avoids the exposed end caps where separate neck and chest pieces used to meet.
export function loftSkin(rings, sides = 16, ref = [0, 1, 0]) {
  const curve = new THREE.CatmullRomCurve3(rings.map((r) => new THREE.Vector3(...r.slice(0, 3))), false, 'centripetal');
  const upRef = new THREE.Vector3(...ref), steps = (rings.length - 1) * 4, pos = [], colours = [], indices = [], centres = [];
  sides = Math.max(12, sides);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, at = t * (rings.length - 1), a = Math.min(rings.length - 2, Math.floor(at)), f = at - a, r0 = rings[a], r1 = rings[a + 1];
    const centre = curve.getPoint(t), tangent = curve.getTangent(t).normalize(); centres.push(centre);
    const reference = Math.abs(tangent.dot(upRef)) > 0.98 ? new THREE.Vector3(0, 0, 1) : upRef;
    const side = new THREE.Vector3().crossVectors(tangent, reference).normalize(), up = new THREE.Vector3().crossVectors(side, tangent).normalize();
    const width = THREE.MathUtils.lerp(r0[3], r1[3], f), height = THREE.MathUtils.lerp(r0[4], r1[4], f);
    const top = new THREE.Color(r0[5]).lerp(new THREE.Color(r1[5]), f), bottom = new THREE.Color(r0[6] ?? r0[5]).lerp(new THREE.Color(r1[6] ?? r1[5]), f);
    for (let j = 0; j < sides; j++) {
      const angle = j / sides * Math.PI * 2, sn = Math.sin(angle), p = centre.clone().addScaledVector(side, Math.cos(angle) * width).addScaledVector(up, sn * height);
      pos.push(...p.toArray()); const colour = top.clone().lerp(bottom, THREE.MathUtils.clamp((-sn - 0.15) / 0.6, 0, 1)); colours.push(...colour.toArray());
    }
  }
  for (let i = 0; i < steps; i++) for (let j = 0; j < sides; j++) {
    const a = i * sides + j, b = i * sides + (j + 1) % sides, d = a + sides, e = b + sides;
    indices.push(a, d, b, b, d, e);
  }
  for (const [ring, end] of [[0, false], [steps, true]]) {
    const ci = pos.length / 3; pos.push(...centres[ring].toArray()); colours.push(...new THREE.Color(rings[end ? rings.length - 1 : 0][5]).toArray());
    for (let j = 0; j < sides; j++) {
      const a = ring * sides + j, b = ring * sides + (j + 1) % sides;
      // The old caps faced inward, leaving holes at the head and shoulder joins.
      indices.push(...(end ? [ci, b, a] : [ci, a, b]));
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(colours, 3));
  g.setIndex(indices); g.computeVertexNormals(); return g;
}
