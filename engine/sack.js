/* engine/sack.js: one cloth sack for every game (owner, 23 November 2026: in Port Royal's tavern "what is that in the corner ... needs to be
   something realistic"; they were squashed balls, and other games drew a sack as a cylinder with a cap). A filled sack slumps: wide and
   rounded at the foot, a little flattened front to back, its cloth in loose uneven folds, gathered at the top and tied with a cord, with
   the cut end of the cloth standing up above the tie.
     const s = makeSack({ material, h: 0.66, r: 0.25, seed: 3 });   // a group standing on y = 0, about h tall
   material: the cloth (a MeshStandardMaterial); cord: the tie's material (a darker string by default); seed: each sack's own folds. */
import * as THREE from 'three';

const cordM = new THREE.MeshStandardMaterial({ color: 0x4a3622, roughness: 1 });
export function makeSack({ material, h = 0.66, r = 0.25, seed = 1, cord = cordM } = {}) {
  const m = material || new THREE.MeshStandardMaterial({ color: 0xb09a6a, roughness: 1 });
  const P = [[0.001, 0], [r * 0.86, 0.004], [r * 1.02, h * 0.06], [r * 1.09, h * 0.22], [r * 1.06, h * 0.42], [r * 0.94, h * 0.6], [r * 0.68, h * 0.74], [r * 0.34, h * 0.84],
    [r * 0.16, h * 0.88], [r * 0.13, h * 0.9], [r * 0.2, h * 0.95], [r * 0.24, h * 1.0], [r * 0.1, h * 0.99], [0.001, h * 0.97]];
  const geo = new THREE.LatheGeometry(P.map(([x, y]) => new THREE.Vector2(x, y)), 18), pos = geo.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {   /* loose folds: the cloth bulges and creases unevenly round the sack, and less near the tie */
    v.fromBufferAttribute(pos, i); const a = Math.atan2(v.z, v.x), y = v.y / h, fold = 1 + (0.05 * Math.sin(3 * a + seed) + 0.035 * Math.sin(7 * a + y * 9 + seed * 2) + 0.02 * Math.sin(11 * a - y * 5)) * (y < 0.86 ? 1 : 0.5);
    v.x *= fold; v.z *= fold * 0.84;   /* a filled sack is flatter front to back */
    v.y += Math.sin(a * 2 + seed) * 0.012 * Math.min(1, y * 3) * (y < 0.86 ? 1 : 0);   /* the shoulders slump unevenly */
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  const g = new THREE.Group(), body = new THREE.Mesh(geo, m); body.castShadow = true; body.receiveShadow = true; g.add(body);
  const tie = new THREE.Mesh(new THREE.TorusGeometry(r * 0.15, 0.011, 5, 12), cord); tie.rotation.x = Math.PI / 2; tie.position.y = h * 0.895; tie.scale.z = 0.84; g.add(tie);
  g.rotation.y = seed * 1.7; g.userData.sack = true; return g;
}
