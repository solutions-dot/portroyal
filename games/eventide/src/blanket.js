/* Eventide's woven blankets, folded in the pile and worn over both shoulders. */
import * as THREE from 'three';
import { isJoined } from '../../../engine/joinbody.js';

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

// Keep the arms lowered underneath the wrap, including during the three talking clips.
// Start from the model's own arm twist, so the palms hang beside the thighs.
function loweredArms(body, model) {
  const root = body.getWorldQuaternion(new THREE.Quaternion());
  const arms = [];
  for (const [side, sign] of [['Left', 1], ['Right', -1]]) {
    const name = part => 'mixamorig' + side + part;
    const shoulder = body.getObjectByName(name('Shoulder'));
    let parent = shoulder.getWorldQuaternion(new THREE.Quaternion());
    for (const [part, child, x, z] of [['Arm', 'ForeArm', .085, -.045], ['ForeArm', 'Hand', .015, .16], ['Hand', 'HandMiddle1', 0, .08]]) {
      const bone = body.getObjectByName(name(part));
      const world = parent.clone().multiply(model.getObjectByName(name(part)).quaternion);
      const from = body.getObjectByName(name(child)).position.clone().normalize().applyQuaternion(world);
      const down = new THREE.Vector3(sign * x, -1, z).normalize().applyQuaternion(root);
      const aimed = new THREE.Quaternion().setFromUnitVectors(from, down).multiply(world);
      arms.push({ bone, upper: part === 'Arm', rotation: (part === 'Arm' ? root : parent).clone().invert().multiply(aimed) });
      parent = aimed;
    }
  }
  const q = new THREE.Quaternion();
  return () => {
    body.getWorldQuaternion(root);
    for (const { bone, upper, rotation } of arms) {
      if (upper) bone.quaternion.copy(bone.parent.getWorldQuaternion(q).invert()).multiply(root).multiply(rotation);
      else bone.quaternion.copy(rotation);
    }
  };
}

const sections = 40, gap = 1, lowerRows = 7, upperRows = 14;
const bearings = Array.from({ length: sections + 1 }, (_, i) => {
  const a = gap / 2 + (2 * Math.PI - gap) * i / sections;
  return {
    x: Math.sin(a), z: Math.cos(a),
    fold: .07 * Math.sin(9 * a + .7) + .025 * Math.sin(17 * a),
    hem: -.06 * Math.sin(6 * a) - .10 * (1 - Math.min(1, Math.abs(a - Math.PI) / 2.2))
  };
});

// Retain the outside of each moving part at each height. Hands, cuffs and skirt
// hems can move independently even when they start in the same place.
function blanketSupports(body, hips, neck, width) {
  const surfaces = [], inv = body.matrixWorld.clone().invert(), v = new THREE.Vector3();
  body.traverseVisible(o => {
    if (!o.isSkinnedMesh || isJoined(o) || /Hair|Hat|Wrap|Brow|Lash|Eye|Teeth|Tongue|low-poly/i.test(o.material.name)) return;
    const { position, skinIndex, skinWeight } = o.geometry.attributes, cells = new Map();
    const skin = o.material.name === 'Skin', transform = inv.clone().multiply(o.matrixWorld);
    const heights = skin ? new Float32Array(position.count) : null;
    for (let i = 0; i < position.count; i++) {
      o.getVertexPosition(i, v).applyMatrix4(transform);
      if (skin) heights[i] = v.y;
      if (v.y < hips.y - .9 * (neck.y - hips.y) || v.y > neck.y + .5 * width) continue;
      let w = 0;
      for (let k = 1; k < 4; k++) if (skinWeight.getComponent(i, k) > skinWeight.getComponent(i, w)) w = k;
      const bone = skinIndex.getComponent(i, w);
      const x = v.x - neck.x, z = v.z - neck.z;
      const key = v.y > neck.y - .25 * width ? i : bone + '/' + Math.floor(v.y / (.09 * width)) + '/' + Math.floor(Math.atan2(x, z) * 12 / Math.PI);
      const radius = x*x + z*z, cell = cells.get(key);
      if (!cell || cell.radius < radius) cells.set(key, { i, radius, hand: o.skeleton.bones[bone].name.includes('Hand') });
    }
    if (!cells.size) return;
    const samples = new Map([...cells.values()].map(({ i, hand }) => [i, { i, hand, p: new THREE.Vector3() }]));
    const edges = [];
    if (skin) {
      const seen = new Set(), idx = o.geometry.index;
      const at = k => idx ? idx.getX(k) : k;
      for (let i = 0; i < (idx?.count ?? position.count); i += 3) for (let k = 0; k < 3; k++) {
        const a = at(i+k), b = at(i+(k+1)%3);
        if (Math.max(heights[a], heights[b]) < neck.y - .15 * width || Math.min(heights[a], heights[b]) > neck.y + .45 * width) continue;
        const key = Math.min(a,b) * position.count + Math.max(a,b);
        if (seen.has(key)) continue;
        seen.add(key);
        for (const j of [a,b]) if (!samples.has(j)) samples.set(j, { i: j, p: new THREE.Vector3() });
        edges.push([samples.get(a).p, samples.get(b).p]);
      }
    }
    surfaces.push({ mesh: o, skin, samples: [...samples.values()], edges });
  });
  return surfaces;
}

const slopes = [0, .25, .55, .9, 1.4, 2.1, 3.3, 5.5, 10, 24, 80];
const planeCount = 24;
const planes = Array.from({ length: planeCount }, (_, i) => {
  const a = 2 * Math.PI * i / planeCount;
  return { x: Math.sin(a), z: Math.cos(a) };
});

// The lower rows are the original flared, open-front blanket. Over the shoulders
// a set of tangent planes rests on the posed clothes and meets at the neckline.
export function drapeBlanket(body, color, model) {
  const pose = loweredArms(body, model);
  pose();
  body.parent?.updateWorldMatrix(true, false);
  body.updateMatrixWorld(true);
  const joint = name => body.getObjectByName('mixamorig' + name);
  const hips = joint('Hips'), neck = joint('Neck'), left = joint('LeftArm'), right = joint('RightArm');
  const inv = new THREE.Matrix4(), transform = new THREE.Matrix4();
  const H = new THREE.Vector3(), N = new THREE.Vector3(), L = new THREE.Vector3(), R = new THREE.Vector3();
  function landmarks() {
    inv.copy(body.matrixWorld).invert();
    for (const [p, bone] of [[H, hips], [N, neck], [L, left], [R, right]]) p.setFromMatrixPosition(bone.matrixWorld).applyMatrix4(inv);
  }
  landmarks();
  const width = L.distanceTo(R), surfaces = blanketSupports(body, H, N, width);
  const rows = lowerRows + upperRows, count = rows * bearings.length;
  const geometry = new THREE.BufferGeometry(), pos = new THREE.Float32BufferAttribute(new Float32Array(count * 3), 3);
  pos.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', pos);
  const uv = [], indices = [];
  for (let i = 0; i < rows; i++) for (let j = 0; j <= sections; j++) {
    const v = i < lowerRows ? .84 * i / (lowerRows - 1) : .84 + .16 * (i - lowerRows + 1) / upperRows;
    uv.push(j / sections * 3, v);
    if (i && j) {
      const b = i * (sections + 1) + j, a = b - sections - 1;
      indices.push(a - 1, b - 1, a, b - 1, b, a);
    }
  }
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  const lower = Array.from({ length: lowerRows }, () => ({ c: new THREE.Vector3() }));
  const support = planes.map(() => new Float64Array(slopes.length)), bounds = new Float64Array(planes.length);
  const slices = Array.from({ length: 64 }, () => new Float64Array(planes.length));
  const c = new THREE.Vector3();
  function centre(y, out) {
    out.copy(H).lerp(N, THREE.MathUtils.clamp((y - H.y) / (N.y - H.y), 0, 1));
    out.y = y;
  }
  function fit() {
    pose();
    body.updateMatrixWorld(true);
    landmarks();
    const seamY = (L.y + R.y) * .5 - .13 * width;
    let cut = N.y + .05 * width;
    let hem = H.y - .24 * (N.y - H.y) / .45;
    for (const { mesh, samples, skin } of surfaces) {
      transform.multiplyMatrices(inv, mesh.matrixWorld);
      for (const { i, p, hand } of samples) {
        mesh.getVertexPosition(i, p).applyMatrix4(transform);
        if (hand) hem = Math.min(hem, p.y - .12 * width);
        // The children's puffed sleeves can rise above the neck joint.
        if (!skin) cut = Math.max(cut, p.y + .025 * width);
      }
    }
    const band = (seamY - hem) / (lowerRows - 1);
    for (const [i, r] of lower.entries()) {
      centre(hem + band * i, r.c);
      r.rx = .20 * width; r.rz = .15 * width; r.scale = 1;
    }
    const skinCut = cut + .025 * width;
    const shoulderBase = seamY - .1 * width;
    const sliceHeight = (cut - shoulderBase) / slices.length;
    for (const slice of slices) slice.fill(-Infinity);
    for (const { samples, skin } of surfaces) for (const s of samples) {
      const p = s.p, k = Math.round((p.y - hem) / band);
      s.first = Math.max(0, k - 1); s.last = Math.min(lowerRows - 1, k + 1);
      for (let i = s.first; i <= s.last; i++) {
        const r = lower[i];
        r.rx = Math.max(r.rx, Math.abs(p.x - r.c.x));
        r.rz = Math.max(r.rz, Math.abs(p.z - r.c.z));
      }
      if (p.y < shoulderBase || (skin && p.y > skinCut)) continue;
      const slice = slices[Math.min(slices.length - 1, Math.floor((p.y - shoulderBase) / sliceHeight))];
      for (let d = 0; d < planes.length; d++) {
        const dir = planes[d];
        slice[d] = Math.max(slice[d], (p.x - N.x) * dir.x + (p.z - N.z) * dir.z);
      }
    }
    // Intersect the actual neck triangles at the lip. This catches a triangle
    // spanning the rim even when neither of its vertices is at that height.
    const rim = slices[slices.length - 1];
    for (const { edges } of surfaces) for (const [a,b] of edges) {
      if ((a.y > skinCut) === (b.y > skinCut)) continue;
      const t = (skinCut - a.y) / (b.y - a.y);
      const x = a.x + t * (b.x - a.x) - N.x, z = a.z + t * (b.z - a.z) - N.z;
      for (let d = 0; d < planes.length; d++) rim[d] = Math.max(rim[d], planes[d].x * x + planes[d].z * z);
    }
    // Fit each ellipse around the whole cross section, including both hands.
    for (const { samples } of surfaces) for (const { p, first, last } of samples) {
      for (let i = first; i <= last; i++) {
        const r = lower[i], x = (p.x - r.c.x) / r.rx, z = (p.z - r.c.z) / r.rz;
        r.scale = Math.max(r.scale, x*x + z*z);
      }
    }
    for (let i = lowerRows - 1; i >= 0; i--) {
      const r = lower[i], scale = Math.sqrt(r.scale);
      r.rx = Math.max(r.rx * scale + .06 * width, i+1 < lowerRows ? lower[i+1].rx * .98 : 0);
      r.rz = Math.max(r.rz * scale + .06 * width, i+1 < lowerRows ? lower[i+1].rz * .98 : 0);
    }
    const seam = lower[lowerRows - 1];
    for (let d = 0; d < planes.length; d++) {
      const dir = planes[d];
      const edge = (seam.c.x - N.x) * dir.x + (seam.c.z - N.z) * dir.z + Math.hypot(seam.rx * dir.x, seam.rz * dir.z);
      for (let k = 0; k < slopes.length; k++) {
        const slope = slopes[k];
        let limit = edge + slope * (seamY - cut);
        // Use the upper edge of each thin slice so the cloth clears its highest point.
        for (let j = 0; j < slices.length; j++) limit = Math.max(limit, slices[j][d] + slope * sliceHeight * (j + 1 - slices.length));
        support[d][k] = limit;
      }
    }
    for (let i = 0; i < rows; i++) {
      const r = lower[i], t = r ? 0 : 1 - ((rows - 1 - i) / upperRows) ** 2;
      const y = r ? r.c.y : seamY + (cut - seamY) * t;
      centre(y, c);
      const fall = Math.max(0, (seamY - y) / (seamY - hem));
      if (!r) for (let d = 0; d < planes.length; d++) {
        let bound = Infinity;
        for (let k = 0; k < slopes.length; k++) bound = Math.min(bound, support[d][k] + slopes[k] * (cut - y));
        bounds[d] = bound - (c.x - N.x) * planes[d].x - (c.z - N.z) * planes[d].z;
      }
      for (let j = 0; j <= sections; j++) {
        const b = bearings[j];
        let x, z;
        if (r) {
          const wave = 1 + fall * b.fold;
          const flare = .17 * width * fall * fall;
          x = (r.rx + flare) * wave * b.x; z = (r.rz + flare) * wave * b.z;
        } else {
          const dx = seam.rx * b.x, dz = seam.rz * b.z;
          let limit = Infinity;
          for (let d = 0; d < planes.length; d++) {
            const dot = dx * planes[d].x + dz * planes[d].z;
            if (dot > 0) limit = Math.min(limit, bounds[d] / dot);
          }
          limit = Math.max(.05, limit) + (.020 + .034 * t ** 6) * width / Math.hypot(dx, dz);
          x = dx * limit; z = dz * limit;
        }
        const edge = i === 0 ? width * b.hem : 0;
        pos.setXYZ(i * (sections + 1) + j, c.x + x, y + edge + (r ? 0 : (.012 * Math.min(1, t * 4) + .007 * t ** 4) * width), c.z + z);
      }
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  }
  fit();
  const wrap = new THREE.Mesh(geometry, woolMaterial(color, THREE.DoubleSide));
  wrap.name = 'Blanket';
  wrap.castShadow = true;
  wrap.frustumCulled = false;
  wrap.userData.fit = fit;
  body.add(wrap);
  return wrap;
}
