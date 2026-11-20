/* games/eventide/src/blanket.js: blankets that read as blankets (chapter 4, the night, and the ward's beds).
   - foldedBlanket(color): a blanket folded into a soft square, its folded edges showing, for a pile on the pavement and the one you carry.
   - drapeBlanket(body, color): a blanket put round a person's shoulders. It is sized from the body itself (the shoulders, the arms and the hips in the pose they
     stand in). One cloth band sits behind the neck, with both ends hanging down in front. It moves with the upper back.
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

/* round the shoulders of a person who has already been posed once (its mixer updated). Returns the blanket mesh (already on the body). */
export function drapeBlanket(body, color = 0xb8a890) {
  body.updateMatrixWorld(true); const bone = (n) => body.getObjectByName('mixamorig' + n), local = (o) => body.worldToLocal(o.getWorldPosition(new THREE.Vector3()));
  const hips = bone('Hips'), neck = bone('Neck'), la = bone('LeftArm'), ra = bone('RightArm'), back = bone('Spine2') || bone('Spine1') || hips; if (!hips || !neck || !la || !ra) return null;
  const H = local(hips), N = local(neck), L = local(la), R = local(ra);
  const shoulders = L.clone().lerp(R, .5), width = Math.abs(L.x - R.x), hem = H.y + width * .12;

  // Fit the cloth to the visible body in its posed frame.
  const pts = [], v = new THREE.Vector3(), inv = body.matrixWorld.clone().invert();
  body.traverse(o => {
    if (!o.isSkinnedMesh || /Eye|Teeth|Tongue|Lash|Brow/i.test(o.material.name || '')) return;
    for (let child = o; child !== body; child = child.parent) if (!child.visible) return;
    o.skeleton.update();
    const count = o.geometry.attributes.position.count, step = Math.max(1, Math.floor(count / 2400));
    for (let i = 0; i < count; i += step) {
      o.getVertexPosition(i, v).applyMatrix4(o.matrixWorld).applyMatrix4(inv);
      if (v.y > hem - width * .17 && v.y < N.y + width * .35) pts.push(v.clone());
    }
  });
  const neckline = pts.filter(p => Math.abs(p.y - N.y - width * .18) < width * .15 && Math.abs(p.x - N.x) < width * .32);
  const rx = Math.max(width * .165, ...neckline.map(p => Math.abs(p.x - N.x))) + width * .025;
  const rz = Math.max(width * .13, ...neckline.map(p => N.z - p.z)) + width * .026;
  const section = a => {
    const x = Math.sin(a), z = Math.cos(a);
    const y = N.y + width * (.13 - .08 * z);
    return [
      [N.x + rx * x, y, N.z + rz * z],
      [N.x + (rx + width * .23) * x, y - width * .27, N.z + (rz + width * .06) * z],
    ];
  };
  const collarAngle = .94, collar = Array.from({ length: 21 }, (_, i) => section(collarAngle + (Math.PI * 2 - 2 * collarAngle) * i / 20));

  function surfaceDepth(x, y, z, direction, margin) {
    let depth = z * direction;
    for (const p of pts) {
      if (Math.abs(p.x - x) < width * .16 && Math.abs(p.y - y) < width * .17) {
        depth = Math.max(depth, p.z * direction + width * margin);
      }
    }
    return depth * direction;
  }
  const panel = sign => [
    [shoulders.y - width * .15, .20, .46],
    [shoulders.y - width * .39, .19, .52],
    [shoulders.y - width * .65, .18, .57],
    [hem + width * .26, .17, .58],
    [hem + width * (sign > 0 ? 0 : .105), .18, .60],
  ].map(([y, inside, outside]) => {
    const t = (y - hem) / (shoulders.y - hem), cx = H.x + (shoulders.x - H.x) * t;
    const v0 = y, v1 = y + width * .046, x0 = cx + sign * width * inside, x1 = cx + sign * width * outside;
    return [[x0, v0, shoulders.z + width * .35], [x1, v1, shoulders.z + width * .35]];
  });

  const left = panel(1), right = panel(-1);
  const ribbon = [...left.reverse(), ...collar, ...right];
  const cols = 8, pos = [], uv = [], indices = [];
  for (const [i, [[x0, y0, z0], [x1, y1, z1]]] of ribbon.entries()) {
    const panelRow = i < left.length || i >= left.length + collar.length;
    for (let k = 0; k <= cols; k++) {
      const t = k / cols;
      const fold = width * .024 * Math.sin(t * Math.PI * 3) * Math.sin(t * Math.PI);
      const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
      let z = z0 + (z1 - z0) * t + fold;
      if (panelRow) z = surfaceDepth(x, y, z, 1, .18);
      else if (z < N.z - width * .02) z = surfaceDepth(x, y, z, -1, .055);
      else if (Math.abs(x - N.x) > rx * .66 && z > N.z + width * .08) z = surfaceDepth(x, y, z, 1, .09);
      pos.push(x, y, z);
      uv.push(t, i / (ribbon.length - 1));
      if (i && k) {
        const b = i * (cols + 1) + k, a = b - cols - 1;
        indices.push(a - 1, a, b - 1, b - 1, a, b);
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const towel = new THREE.Mesh(geo, woolMaterial(color, THREE.DoubleSide));
  towel.name = 'Blanket';
  towel.castShadow = true;
  towel.frustumCulled = false;
  body.add(towel);
  body.updateMatrixWorld(true);
  back.attach(towel);
  return towel;
}
