/* games/eventide/src/blanket.js: blankets that read as blankets (chapter 4, the night, and the ward's beds).
   - foldedBlanket(color): a blanket folded into a soft square, its folded edges showing, for a pile on the pavement and the one you carry.
   - drapeBlanket(body, color): a blanket put round a person's shoulders. It is sized from the body itself (the shoulders, the arms and the hips in the pose they
     stand in), so it sits just outside the clothes and never cuts through them, hangs to the hips in soft folds and is open at the front, held closed by the arms.
     It rides on the upper back bone, so it moves with the body.
   The owner found the old ones "make no sense visually" (a grey tube round the chest, 15 November 2026). */
import * as THREE from 'three';

const TEX = new Map();
function woolTex(color) {   /* a wool blanket: a soft weave, with a darker band near each end, as old hospital and army blankets had */
  const key = color; if (TEX.has(key)) return TEX.get(key);
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), base = new THREE.Color(color), dark = base.clone().multiplyScalar(0.62);
  x.fillStyle = '#' + base.getHexString(); x.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 900; i++) { const v = Math.random() < 0.5 ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'; x.fillStyle = v; x.fillRect(Math.random() * 128, Math.random() * 128, 3, 1); }
  x.fillStyle = '#' + dark.getHexString(); x.fillRect(0, 12, 128, 7); x.fillRect(0, 109, 128, 7);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; TEX.set(key, t); return t;
}
export function woolMaterial(color, side = THREE.FrontSide) { return new THREE.MeshStandardMaterial({ color: 0xffffff, map: woolTex(color), roughness: 1, side }); }

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
export function drapeBlanket(body, color = 0xb8a890, { gap = 0.75 } = {}) {
  body.updateMatrixWorld(true); const bone = (n) => body.getObjectByName('mixamorig' + n), local = (o) => body.worldToLocal(o.getWorldPosition(new THREE.Vector3()));
  const hips = bone('Hips'), neck = bone('Neck'), la = bone('LeftArm'), ra = bone('RightArm'), back = bone('Spine2') || bone('Spine1') || hips; if (!hips || !neck || !la || !ra) return null;
  const H = local(hips), N = local(neck), sh = (local(la).y + local(ra).y) / 2, top = Math.max(sh, N.y - 0.02), hem = H.y - 0.08 * (top - H.y) / 0.45;   /* hips to shoulders, in the body's own size */
  /* every point of the body's visible clothes and skin between the hem and the neck, in the body's own frame */
  const pts = [], v = new THREE.Vector3(), inv = new THREE.Matrix4().copy(body.matrixWorld).invert();
  body.traverse((o) => { if (!o.isSkinnedMesh || !o.visible || /low-poly|Eye|Teeth|Tongue|Lash|Brow/i.test(o.name + ' ' + (o.material.name || ''))) return; let vis = true; for (let q = o; q && q !== body; q = q.parent) if (!q.visible) vis = false; if (!vis) return;
    o.skeleton.update(); const n = o.geometry.attributes.position.count, step = Math.max(1, Math.floor(n / 2500)); for (let i = 0; i < n; i += step) { o.getVertexPosition(i, v).applyMatrix4(o.matrixWorld).applyMatrix4(inv); if (v.y > hem - 0.04 && v.y < top + 0.2) pts.push(v.clone()); } });
  const cx = H.x, cz = (N.z + H.z) / 2;
  /* the size of an ellipse that holds every point at each height: wide across the shoulders and arms, shallower front to back */
  const rows = 7, need = []; for (let k = 0; k < rows; k++) need.push({ y: hem + (top - hem) * k / (rows - 1), x: 0.08, z: 0.06 });
  const band = (top - hem) / (rows - 1);
  for (const p of pts) { if (p.y > top + 0.02) continue; const k = Math.max(0, Math.min(rows - 1, Math.round((p.y - hem) / band))); for (const j of [k - 1, k, k + 1]) { if (j < 0 || j >= rows) continue; need[j].x = Math.max(need[j].x, Math.abs(p.x - cx)); need[j].z = Math.max(need[j].z, Math.abs(p.z - cz)); } }
  for (const r of need) { r.x += 0.035; r.z += 0.035; }
  for (let pass = 0; pass < 2; pass++) for (const p of pts) { if (p.y > top + 0.02) continue; const k = Math.max(0, Math.min(rows - 1, Math.round((p.y - hem) / band))), r = need[k], e = Math.hypot((p.x - cx) / r.x, (p.z - cz) / r.z); if (e > 0.97) { r.x *= e / 0.97; r.z *= e / 0.97; } }   /* the corners between the axes too */
  for (let k = rows - 2; k >= 0; k--) { need[k].x = Math.max(need[k].x, need[k + 1].x * 0.98); need[k].z = Math.max(need[k].z, need[k + 1].z * 0.98); }   /* cloth falls: it never draws in below the shoulders */
  /* over the top of the shoulders, toward the neck: what lies above the shoulder line sets how high the cloth must rise */
  let neckR = 0.07; for (const p of pts) if (p.y > top - 0.02 && p.y < top + 0.12 && Math.abs(p.x - cx) < 0.12) neckR = Math.max(neckR, Math.min(0.11, Math.hypot(p.x - cx, (p.z - cz) * 1.2)));
  const prof = need.map((r) => [r.x, r.z, r.y]); const S = need[rows - 1];
  prof.push([S.x * 0.86, S.z * 0.95, top + 0.05], [S.x * 0.6, S.z * 0.85, top + 0.09], [neckR + 0.05, neckR + 0.04, top + 0.12]);
  /* a ring for each height, open at the front by `gap` radians; small waves in the lower part are the folds */
  const seg = 40, pos = [], uvs = [], idx = [], phi0 = gap / 2, span = Math.PI * 2 - gap;
  prof.forEach(([rx, rz, y], i) => { const fall = Math.max(0, 1 - (y - hem) / (top - hem)); for (let s = 0; s <= seg; s++) { const a = phi0 + span * s / seg, wave = 1 + 0.045 * fall * Math.sin(a * 9 + 0.7) + 0.02 * fall * Math.sin(a * 17), fr = Math.min(1, Math.abs(a - Math.PI) / 2.2);
      const ry = y + (i === 0 ? -0.025 * Math.sin(a * 6) - 0.04 * (1 - fr) : 0);   /* the hem is uneven and hangs a little lower at the back */
      pos.push(cx + rx * wave * Math.sin(a), ry, cz + rz * wave * Math.cos(a)); uvs.push(s / seg * 3, i / (prof.length - 1)); } });
  for (let i = 0; i < prof.length - 1; i++) for (let s = 0; s < seg; s++) { const a = i * (seg + 1) + s, b = a + seg + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); geo.setIndex(idx); geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, woolMaterial(color, THREE.DoubleSide)); m.name = 'Blanket'; m.castShadow = true; m.frustumCulled = false;
  body.add(m); body.updateMatrixWorld(true); back.attach(m);   /* built in the body's frame, then carried by the upper back so it moves with the body */
  return m;
}
