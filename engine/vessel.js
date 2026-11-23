/* engine/vessel.js: small open things that read right close up (22 November 2026; the owner: "polish the graphics like the hat has no
   opening"). A cup, an inkwell, a pencil pot, a pail or a basket made as a solid cylinder is a puck: from above it has no hollow. vessel()
   turns one outside profile into a whole shell, outside up to the rim, over the lip and back down the inside to a floor, so the opening
   shows from every side and nothing needs both faces drawn. Used by Rose Hall and The Shark Papers; The Mad Master's felt hat
   (games/hutchinson/src/props.js) is the same idea done by hand.

   vessel(outer, { wall, mat, inner, fill, segments })
     outer     [[r, y], ...] the outside, from the middle of the foot (r near 0) up to the rim, in metres
     wall      the thickness of the side (default 4 mm); the floor is as thick
     mat       the material (outside and inside, unless inner is given)
     inner     a material for the inside only (a dark tin, a glazed cup)
     fill      { y, mat } something standing inside to height y: coffee, ink, water (a disc at that level)
   Returns a group; userData.rim is the height of the rim. */
import * as THREE from 'three';

export function vessel(outer, { wall = 0.004, mat, inner = null, fill = null, segments = 16 } = {}) {
  const g = new THREE.Group(), V = (r, y) => new THREE.Vector2(Math.max(0.0005, r), y);
  const rim = outer[outer.length - 1], top = rim[1];
  const out = outer.map(([r, y]) => V(r, y));
  /* the inside: the same profile offset inward by the wall, from the rim down to a floor one wall thick */
  const ins = outer.slice(1).reverse().map(([r, y]) => V(r - wall, Math.max(wall, y))).filter((p, i, a) => i === 0 || p.y <= a[i - 1].y + 1e-6);
  const lip = [V(rim[0] - wall * 0.5, top + wall * 0.4)];
  const floor = [V(0.0005, wall)];
  if (inner) {
    g.add(new THREE.Mesh(new THREE.LatheGeometry([...out, ...lip], segments), mat));
    g.add(new THREE.Mesh(new THREE.LatheGeometry([lip[0], ...ins, ...floor], segments), inner));
  } else g.add(new THREE.Mesh(new THREE.LatheGeometry([...out, ...lip, ...ins, ...floor], segments), mat));
  if (fill) {
    /* the radius of the inside at height y, read off the profile */
    let r = rim[0] - wall;
    for (let i = 1; i < outer.length; i++) if (fill.y <= outer[i][1]) { const a = outer[i - 1], b = outer[i], k = (fill.y - a[1]) / Math.max(1e-6, b[1] - a[1]); r = a[0] + (b[0] - a[0]) * k - wall; break; }
    const d = new THREE.Mesh(new THREE.CircleGeometry(Math.max(0.001, r - 0.0005), segments), fill.mat);
    d.rotation.x = -Math.PI / 2;
    d.position.y = fill.y;
    g.add(d);
  }
  g.userData.rim = top;
  return g;
}
