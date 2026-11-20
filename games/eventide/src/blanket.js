/* games/eventide/src/blanket.js: blankets that read as blankets (chapter 4, the night, and the ward's beds).
   - foldedBlanket(color): a blanket folded into a soft square, its folded edges showing, for a pile on the pavement and the one you carry.
   - drapeBlanket(body, color): a blanket put round a person's shoulders. One band rises to the nape, turns over both shoulders and hangs down the chest. It follows the same bones as the skin and clothes beneath it.
   The owner found the old ones "make no sense visually" (a grey tube round the chest, 15 November 2026). */
import * as THREE from 'three';

const TEX = new Map();
function woolTex(color) {   /* a wool blanket: a soft weave, with a darker band near each end, as old hospital and army blankets had */
  const key = color; if (TEX.has(key)) return TEX.get(key);
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), base = new THREE.Color(color), dark = base.clone().multiplyScalar(0.62);
  x.fillStyle = '#' + base.getHexString(); x.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 900; i++) { const v = Math.random() < 0.5 ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'; x.fillStyle = v; x.fillRect(Math.random() * 128, Math.random() * 128, 3, 1); }
  x.fillStyle = '#' + dark.getHexString(); x.fillRect(0, 8, 128, 12); x.fillRect(0, 24, 128, 4); x.fillRect(0, 100, 128, 4); x.fillRect(0, 108, 128, 12);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; TEX.set(key, t); return t;
}
const MATS = new Map();
export function woolMaterial(color, side = THREE.FrontSide) { const k = color + '/' + side; if (!MATS.has(k)) MATS.set(k, new THREE.MeshStandardMaterial({ color: 0xffffff, map: woolTex(color), roughness: 1, side, name: 'Blanket' })); return MATS.get(k); }   /* one per colour, shared */

/* the side of a folded blanket: layers stacked, each fold a rounded edge. Drawn in x (width) and y (height), then pushed out in z (depth). */
function foldShape(w, h, n) {
  const s = new THREE.Shape(), t = h / n, r = t / 2; s.moveTo(-w / 2 + r, 0); s.lineTo(w / 2 - r, 0);
  for (let i = 0; i < n; i++) { const y = i * t; if (i % 2 === 0) s.absarc(w / 2 - r, y + r, r * 0.98, -Math.PI / 2, Math.PI / 2, false); else s.lineTo(w / 2 - r - 0.012, y + r), s.lineTo(w / 2 - r, y + t); }   /* the folds show on one side; the other side shows the cut layers */
  s.lineTo(-w / 2 + r, h);
  for (let i = n - 1; i >= 0; i--) { const y = i * t; if (i % 2 === 1) s.absarc(-w / 2 + r, y + r, r * 0.98, Math.PI / 2, Math.PI * 1.5, false); else s.lineTo(-w / 2 + r + 0.012, y + r), s.lineTo(-w / 2 + r, y); }
  return s;
}
const FOLD_GEO = new Map();
export function foldedBlanket(color = 0xb8a890, { w = 0.4, h = 0.1, d = 0.3, layers = 4 } = {}) {
  const key = [w, h, d, layers].join(); let geo = FOLD_GEO.get(key);
  if (!geo) { geo = new THREE.ExtrudeGeometry(foldShape(w, h, layers), { depth: d - 0.02, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.006, bevelSegments: 2, curveSegments: 6 }); geo.translate(0, 0, -(d - 0.02) / 2); geo.computeVertexNormals();
    const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 2.5, uv.getY(i) * 2.5); FOLD_GEO.set(key, geo); }
  const m = new THREE.Mesh(geo, woolMaterial(color)); m.castShadow = m.receiveShadow = true; m.name = 'folded blanket'; return m;   /* the origin is the middle of its underside */
}

// Fit in the model's neutral frame so receiving a towel mid-gesture cannot change its cut.
const drapes = new WeakMap();
function fitDrape(model) {
  model.updateMatrixWorld(true);
  const bone = name => model.getObjectByName('mixamorig' + name);
  const joint = name => bone(name).getWorldPosition(new THREE.Vector3());
  const neck = joint('Neck'), width = joint('LeftArm').distanceTo(joint('RightArm'));
  const relative = point => point.sub(neck).divideScalar(width);
  const nape = relative(joint('Head')).y * .83;
  const hem = relative(joint('Hips')).y - .18;
  const bones = [], triangles = [];
  model.traverse(o => { if (o.isBone) bones.push(o); });
  const inverses = bones.map(b => b.matrixWorld.clone().invert());

  // Ray-fit to actual triangles, including shirt collars. Each hit also supplies the skin weights.
  model.traverse(o => {
    if (!o.isSkinnedMesh || !['Skin', 'Shirt', 'Collar', 'Belt', 'Skirt', 'Breeches', 'Pocket'].includes(o.material.name)) return;
    const g = o.geometry, attrs = g.attributes;
    const verts = Array.from({ length: attrs.position.count }, (_, i) =>
      relative(o.getVertexPosition(i, new THREE.Vector3()).applyMatrix4(o.matrixWorld)));
    const joints = o.skeleton.bones.map(b => bones.indexOf(b));
    const hangingSleeve = verts.map((p, i) => {
      if (p.y > -.27) return false;
      let arm = 0;
      for (let k = 0; k < 4; k++) {
        const b = o.skeleton.bones[attrs.skinIndex.getComponent(i, k)];
        if (/Arm|Hand/.test(b.name)) arm += attrs.skinWeight.getComponent(i, k);
      }
      return arm > .35;
    });
    for (let i = 0; i < (g.index?.count ?? verts.length); i += 3) {
      const ids = [i, i + 1, i + 2].map(k => g.index ? g.index.getX(k) : k);
      if (ids.some(k => hangingSleeve[k])) continue;
      const [a, b, c] = ids.map(k => verts[k]);
      const minY = Math.min(a.y, b.y, c.y), maxY = Math.max(a.y, b.y, c.y);
      if (minY > nape + .08 || maxY < hem - .12 || [a,b,c].every(v => v.x > .62) || [a,b,c].every(v => v.x < -.62)) continue;
      triangles.push({a, b, c, minY, maxY, ids, attrs, joints});
    }
  });

  // Each station gives the inside edge, outside edge and outward direction, from the nape to one hem.
  // Dimensions are fractions of shoulder width. The two sides only join at the back.
  const stations = [
    [[0,nape,-.13], [0,-.15,-.23], [0,0,-1]],
    [[.13,nape*.92,-.10], [.27,-.075,-.20], [.55,.28,-.80]],
    [[.195,nape*.72,.025], [.45,-.045,.015], [.72,.72,0]],
    [[.21,nape*.28,.14], [.415,-.075,.18], [.40,.75,.52]],
    [[.20,-.12,.23], [.415,-.18,.28], [.12,.36,.93]],
    [[.175,-.42,.34], [.415,-.42,.34], [0,.05,1]],
    [[.165,-.78,.38], [.41,-.78,.38], [0,0,1]],
    [[.125,hem,.42], [.395,hem+.025,.42], [0,0,1]]
  ];
  const [inside, outside, normals] = [0,1,2].map(k =>
    new THREE.CatmullRomCurve3(stations.map(s => new THREE.Vector3(...s[k]))));
  const positions = [], weights = [], joints = [], uvs = [], indices = [];
  const steps = 40, cols = 8, ring = 2 * cols;
  const ray = new THREE.Ray(), hit = new THREE.Vector3(), bary = new THREE.Vector3();
  for (let i = -steps; i <= steps; i++) {
    const t = Math.abs(i) / steps, sign = i < 0 ? -1 : 1;
    const inner = inside.getPoint(t), outer = outside.getPoint(t);
    const normal = normals.getPoint(t).normalize(); normal.x *= sign;
    for (let j = 0; j < ring; j++) {
      // An oval cross-section gives the folded towel a soft edge even in profile.
      const angle = j * 2 * Math.PI / ring;
      const across = (1 - Math.cos(angle)) * .5, p = inner.clone().lerp(outer, across);
      p.x *= sign;
      if (i < 0) p.y += .15 * t ** 3;
      ray.direction.copy(normal).negate();
      ray.origin.copy(p).addScaledVector(normal, .65);
      let nearest = Infinity, face = null;
      for (const tri of triangles) {
        if (tri.minY > ray.origin.y + .001 || tri.maxY < p.y - .22) continue;
        if (!ray.intersectTriangle(tri.a, tri.b, tri.c, false, hit)) continue;
        const distance = ray.origin.distanceTo(hit);
        if (distance >= nearest || hit.y > nape + .045 || Math.abs(hit.x) > .62) continue;
        nearest = distance; face = tri;
      }
      const influences = new Map();
      if (face) {
        ray.at(nearest, hit);
        THREE.Triangle.getBarycoord(hit, face.a, face.b, face.c, bary);
        for (let k = 0; k < 3; k++) for (let w = 0; w < 4; w++) {
          const vertex = face.ids[k], index = face.joints[face.attrs.skinIndex.getComponent(vertex, w)];
          const weight = bary.getComponent(k) * face.attrs.skinWeight.getComponent(vertex, w);
          if (weight > 0) influences.set(index, (influences.get(index) || 0) + weight);
        }
        // The cloth skims hollows and seams between garments.
        p.addScaledVector(normal, Math.max(-.02, .65 - nearest));
      } else {
        influences.set(bones.indexOf(bone(t < .32 ? 'Neck' : 'Spine2')), 1);
      }
      const fold = .018 * Math.sin(Math.PI * across * 3) ** 2;
      const loft = .042 + .048 * Math.min(1, t * 1.6);
      p.addScaledVector(normal, loft + .034 * Math.sin(angle) + fold).multiplyScalar(width).add(neck);
      positions.push(p.x, p.y, p.z);
      const strongest = [...influences].sort((a,b) => b[1] - a[1]).slice(0,4);
      const sum = strongest.reduce((s, pair) => s + pair[1], 0);
      for (let k = 0; k < 4; k++) {
        joints.push(strongest[k]?.[0] ?? 0);
        weights.push((strongest[k]?.[1] ?? 0) / sum);
      }
      uvs.push(across, (i + steps) / (2 * steps));
      if (i > -steps) {
        const b = (i + steps) * ring + j, next = (i + steps) * ring + (j + 1) % ring;
        indices.push(b - ring, next - ring, b, b, next - ring, next);
      }
    }
  }
  // Sew each hem shut along the fold.
  for (let j = 1; j < ring - 1; j++) {
    const end = 2 * steps * ring;
    indices.push(0, j + 1, j, end, end + j, end + j + 1);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(joints, 4));
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weights, 4));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return { geometry, names: bones.map(b => b.name), inverses };
}

export function drapeBlanket(body, color, model) {
  let fit = drapes.get(model);
  if (!fit) { fit = fitDrape(model); drapes.set(model, fit); }
  const towel = new THREE.SkinnedMesh(fit.geometry, woolMaterial(color, THREE.DoubleSide));
  towel.name = 'Blanket';
  towel.castShadow = true;
  towel.frustumCulled = false;
  body.add(towel);
  towel.bind(new THREE.Skeleton(fit.names.map(name => body.getObjectByName(name)), fit.inverses), new THREE.Matrix4());
  return towel;
}
