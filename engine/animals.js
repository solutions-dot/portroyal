/* engine/animals.js: small animals any game can put in a yard (rule 10). The hen began in Windrush (games/windrush/src/scenery.js) and is
   shared with Morant Bay, 1865.
     const h = hen(seed);  group.add(h);  each frame: h.userData.tick(t)   (a game's own ticker list, as Windrush's Q.tickers)
   A hen is about 0.35 m to the top of its comb: a round body, a head with a red comb and a beak, a tail, legs. It pecks now and then. */
import * as THREE from 'three';

const MATS = new Map();
const flat = (c) => MATS.get(c) || MATS.set(c, new THREE.MeshLambertMaterial({ color: c })).get(c);
function rng(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
const mesh = (geo, m, x, y, z, parent) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; parent.add(o); return o; };
const box = (w, h, d, m, x, y, z, parent) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, parent);
export function hen(seed = 1) {
  const g = new THREE.Group(),
    r = rng(seed),
    c = [0x8a5a34, 0xe8e0cc, 0x2e2a26][(r() * 3) | 0];
  const b = mesh(new THREE.SphereGeometry(0.11, 8, 6), flat(c), 0, 0.17, 0, g);
  b.scale.set(0.85, 0.85, 1.2);
  const head = new THREE.Group(); head.position.set(0, 0.3, 0.12); g.add(head);
  mesh(new THREE.SphereGeometry(0.055, 6, 5), flat(c), 0, 0, 0, head);
  box(0.018, 0.04, 0.05, flat(0xc0302a), 0, 0.05, 0, head);
  mesh(new THREE.ConeGeometry(0.02, 0.05, 4), flat(0xd9a030), 0, -0.005, 0.06, head).rotation.x = Math.PI / 2;
  const tail = mesh(new THREE.ConeGeometry(0.07, 0.16, 5), flat(c), 0, 0.27, -0.14, g);
  tail.rotation.x = -0.9;
  for (const s of [-1, 1]) box(0.012, 0.11, 0.012, flat(0xd9a030), s * 0.04, 0.055, 0, g);
  g.scale.setScalar(0.88);
  g.userData.noBatch = true;
  g.traverse((o) => (o.userData.noBatch = true));
  g.userData.tick = (t) => {
    const k = Math.max(0, Math.sin(t * 1.3 + seed * 2.1)) ** 6;
    head.position.set(0, 0.3 - k * 0.2, 0.12 + k * 0.08);
    g.rotation.y += Math.sin(t * 0.21 + seed) * 0.002;
  };
  return g;
}
