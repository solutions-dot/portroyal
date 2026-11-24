/* engine/building-tex.js: Port Royal's building surfaces (brick, plaster, cut stone, timber, clay tile, shingle, each with its normal map),
   for any game that builds houses in code (22 November 2026: the owner asked that The Shark Papers' buildings match Port Royal's detail,
   using its assets, not its town).
   The pictures are a subset of Port Royal's town atlas (games/port-royal/site/models/tex_town.js), copied by tools/subset_tex.py into
   shared/textures/tex_1700.js. A game lists "tex_1700" in games/<game>/shared-tex.json and tools/build.mjs copies it into its models.

   loadBuildingTex()            fetch the file (models/tex_1700.js); call it early, it is safe to call more than once
   buildingMat(kind, opts)      a MeshStandardMaterial with that surface: kind is brick | plaster | stone | wood | clay | shingle.
                                opts: { tint (a colour multiplied in), rough, side, repeat: [x, y] for a surface with its own 0..1
                                coordinates (a room's floor) }. It can be made before the file has loaded:
                                its pictures appear when they arrive.
   worldUV(geo, tile)           texture coordinates in metres: one repeat of the picture per `tile` metres on every face, so a long
                                wall and a short one show bricks of one size (as Port Royal's second street does). Returns a new geometry. */
import * as THREE from 'three';
import { script } from './loader.js';

const FILE = 'tex_1700';
const pics = {};   /* key -> { tex: [every texture made for it], image } */
let loading = null;
export function loadBuildingTex() {
  return (loading ||= script(FILE).then(() => { for (const k of Object.keys(pics)) decode(k); }).catch(() => {}));
}
function decode(key) {
  const p = pics[key], src = window.__tex?.[key];
  if (!p || p.image || !src) return;
  p.image = 'loading';
  const im = new Image();
  im.onload = () => { p.image = im; for (const t of p.tex) { t.image = im; t.needsUpdate = true; } };
  im.src = src;
}
/* until the pictures arrive, each shows as its own mean colour (a normal map as flat), so a surface is never drawn black while the file loads */
const MEANC = { brick: [172, 99, 67], plaster: [209, 198, 173], stone: [171, 165, 149], wood: [105, 89, 73], clay: [115, 54, 33], shingle: [83, 77, 68] };
const holders = {};
function holder(key) {
  if (holders[key] || typeof document === 'undefined') return holders[key] || null;
  const c = document.createElement('canvas'); c.width = c.height = 2; const x = c.getContext('2d'), m = key.endsWith('_n') ? [128, 128, 255] : MEANC[key] || [128, 128, 128];
  x.fillStyle = `rgb(${m[0]},${m[1]},${m[2]})`; x.fillRect(0, 0, 2, 2); return (holders[key] = c);
}
function tex(key, color) {
  const p = (pics[key] ||= { tex: [], image: null });
  const t = new THREE.Texture(holder(key) || undefined);
  if (t.image) t.needsUpdate = true;
  t.flipY = false;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 4;
  if (p.image && p.image !== 'loading') { t.image = p.image; t.needsUpdate = true; }
  p.tex.push(t);
  if (!p.image) decode(key);
  return t;
}
const ROUGH = { brick: 0.95, plaster: 1, stone: 0.92, wood: 0.9, clay: 0.9, shingle: 0.95 };
export function buildingMat(kind, { tint = 0xffffff, rough = ROUGH[kind] ?? 0.95, side = THREE.FrontSide, repeat = null } = {}) {
  const map = tex(kind, true), normalMap = tex(kind + '_n', false);
  if (repeat) for (const t of [map, normalMap]) t.repeat.set(repeat[0], repeat[1]);
  return new THREE.MeshStandardMaterial({ map, normalMap, color: tint, roughness: rough, side });
}
/* a roof made in code (a hip or a gable) dressed in tiles or shingles: rows of tiles run level (a line of one height on any slope is
   parallel to its eave), across along the eave, each triangle by its own slope */
export function roofUV(geo, tile = 1.4, slope = 1.6) {
  const g = geo.index ? geo.toNonIndexed() : geo, p = g.attributes.position, uv = new Float32Array(p.count * 2);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < p.count; i += 3) {
    a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, i + 1); c.fromBufferAttribute(p, i + 2);
    const n = b.clone().sub(a).cross(c.clone().sub(a));
    for (let k = 0; k < 3; k++) { const x = p.getX(i + k), y = p.getY(i + k), z = p.getZ(i + k); uv[(i + k) * 2] = (Math.abs(n.x) > Math.abs(n.z) ? z : x) / tile; uv[(i + k) * 2 + 1] = (y * slope) / tile; }
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}
export function worldUV(geo, tile = 2) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone(), p = g.attributes.position, n = g.attributes.normal, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i));
    const [a, b] = ax > 0.5 ? [p.getZ(i), p.getY(i)] : ay > 0.5 ? [p.getX(i), p.getZ(i)] : [p.getX(i), p.getY(i)];
    uv[i * 2] = a / tile; uv[i * 2 + 1] = b / tile;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}
