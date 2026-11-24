/* engine/surfaces.js: real surface pictures on the big plain surfaces of every game (owner, 24 November 2026: "Real surface pictures. Wood, brick and stone").
   engine/batch.js calls dressSurfaces(place) as each place is batched, before anything is merged, so no game sets anything up.
     dressSurfaces(root)   large plain walls, building blocks, floors and ceilings get Port Royal's pictures (engine/building-tex.js: brick, plaster, cut
                           stone, wooden boards), each with its normal map, laid in metres so every wall shows bricks of one size
   What is a big surface: a slab at least 1.4 m across (a floor or ceiling 3 to 35 cm thick, a wall at least 1.6 m high and under 70 cm thick) or a block at
   least 1.8 m every way (a house). What it is made of comes from its colour, as the game chose it: red brown is brick, grey is stone, pale is plaster
   (limewash), brown is wooden boards, any other strong colour on a wall is a painted render. A floor is only boards or stone. The picture is tinted so the
   surface keeps the game's own colour on average; the picture adds the courses, joints, grain and wear.
   Left alone: doors, windows, shutters, gates and signs (by name), anything small, see-through, glowing, metal, already pictured or vertex-coloured (terrain, merged scenery), people, a flat sheet with no
   thickness (the ground, a road, a painted sign), and anything marked userData.noSurface (or a material marked userData.noSurface or noGrain).
   ?nosurf to compare. */
import * as THREE from 'three';
import { buildingMat, loadBuildingTex } from './building-tex.js';
import { lookHaze, lookKey } from './look.js';

const Q = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();
/* each picture's mean colour (sRGB, measured from shared/textures/tex_1700.js) and how many metres one repeat covers */
const MEAN = { brick: [172, 99, 67], plaster: [209, 198, 173], stone: [171, 165, 149], wood: [105, 89, 73] };
const TILE = { brick: 1.6, plaster: 2.4, stone: 1.4, wood: 1.0 };
/* how strongly each picture shows: the plaster picture is a weathered, stained limewash, too blotchy at full strength for a kept room (Rose Hall's great hall) */
const SHOW = { brick: 0.7, plaster: 0.25, stone: 0.45, wood: 0.6 };      /* softer again (owner, 24 November 2026: "the walls can soften a bit more") */
/* a roof face (facing up, on a wall, house block or ceiling slab) shows its picture only faintly, almost the plain colour it had, so walls and roof never
   match (owner: "soften the roofs to almost look solid like the original"). It is marked by lifting its texture coordinates by ROOF, which survives merging. */
const ROOF = 4096, ROOF_SHOW = 0.08;   /* far above any place's own coordinates (a few hundred metres at most) */
const toLin = (c) => Math.pow(c / 255, 2.2);
export const SURF = { calls: 0, dressed: 0, skip: {}, kinds: {}, sample: [] };
if (typeof window !== 'undefined') window.__SURF = SURF;   /* for a check: how many surfaces were dressed, and why others were not */
const MATS = new Map(), _hsl = {}, _b = new THREE.Box3(), _s = new THREE.Vector3();

function plain(m) {
  return m && (m.isMeshStandardMaterial || m.isMeshLambertMaterial || m.isMeshPhongMaterial) && !m.map && !m.vertexColors && !m.transparent && m.opacity >= 1 &&
    !(m.userData && (m.userData.noSurface || m.userData.noGrain)) && !(m.emissive && m.emissive.r + m.emissive.g + m.emissive.b > 0.05) && !((m.metalness || 0) > 0.5) && m.side !== THREE.BackSide;
}
function kindOf(m, shape, thick = 1) {
  m.color.getHSL(_hsl, THREE.SRGBColorSpace); const { h, s, l } = _hsl;
  let k = null;
  if (l >= 0.66 && s < 0.45) k = 'plaster';
  else if (s < 0.16 && l > 0.2) k = 'stone';
  else if ((h < 0.055 || h > 0.96) && s > 0.28 && l > 0.15 && l < 0.6) k = 'brick';
  else if (h >= 0.04 && h < 0.15 && s > 0.18 && l > 0.08 && l < 0.58) k = 'wood';
  else if (s > 0.22 && l >= 0.28 && shape !== 'floor' && !(h > 0.18 && h < 0.5)) k = 'plaster';   /* a painted wall: a painted render (boards were wrong on Selassie's 1966 airport); never a green, hedges and crowns */
  if (shape === 'floor') k = k === 'stone' || (k === 'wood' && thick <= 0.13) ? k : null;   /* a floor is boards (thin: a thicker brown slab is a packed-earth yard, as at Stony Gut) or stone */
  if (shape === 'ceiling') k = k === 'plaster' || k === 'wood' ? k : null;   /* a ceiling: plaster or boards; a grey slab high up is a roof, left alone */
  return k;
}
function matFor(kind, m) {
  const key = kind + ':' + m.color.getHexString() + ':' + m.side + ':' + (m.polygonOffset ? m.polygonOffsetUnits : '');
  let out = MATS.get(key);
  if (!out) {
    const mean = MEAN[kind], c = new THREE.Color(), lin = [m.color.r, m.color.g, m.color.b];   /* the game's colour, in linear */
    c.setRGB(...lin.map((v, i) => Math.min(3, v / toLin(mean[i]))), THREE.LinearSRGBColorSpace);
    out = buildingMat(kind, { tint: c, side: m.side });
    out.name = (m.name || kind) + '_surface';
    if (m.polygonOffset) Object.assign(out, { polygonOffset: true, polygonOffsetFactor: m.polygonOffsetFactor, polygonOffsetUnits: m.polygonOffsetUnits });
    out.userData = { ...m.userData, surface: kind };
    const meanL = new THREE.Vector3(...MEAN[kind].map(toLin)), show = SHOW[kind];
    out.onBeforeCompile = (sh, r) => {      /* the picture blended toward its own mean colour by SHOW; then the engine's haze and extra-pass handling, as for every material */
      sh.uniforms.surfMean = { value: meanL }; sh.uniforms.surfShow = { value: show }; sh.uniforms.surfRoof = { value: ROOF_SHOW };
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 surfMean; uniform float surfShow; uniform float surfRoof;')
        .replace('#include <map_fragment>', `#ifdef USE_MAP\n\tvec4 sampledDiffuseColor = texture2D( map, vMapUv );\n\tsampledDiffuseColor.rgb = mix( surfMean, sampledDiffuseColor.rgb, vMapUv.y > ${ROOF / 2}.0 ? surfRoof : surfShow );\n\tdiffuseColor *= sampledDiffuseColor;\n#endif`);
      lookHaze(sh, r, out);
    };
    out.customProgramCacheKey = () => 'surface' + kind + show + lookKey();
    MATS.set(key, out);
  }
  return out;
}
/* texture coordinates in metres from the world position, each face by the axis it faces (as building-tex's worldUV, but for any scale and turn) */
/* the share of a mesh's surface that faces square along an axis: a wall, a floor or a house is nearly all (over 0.8), a tree crown, a rock or a hull is not */
function squareShare(geo, mw) {
  const p = geo.attributes.position, idx = geo.index, n = idx ? idx.count : p.count, step = Math.max(3, Math.floor(n / 3 / 1500) * 3);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(); let sq = 0, all = 0;
  for (let t = 0; t + 2 < n; t += step) {
    a.fromBufferAttribute(p, idx ? idx.getX(t) : t).applyMatrix4(mw); b.fromBufferAttribute(p, idx ? idx.getX(t + 1) : t + 1).applyMatrix4(mw); c.fromBufferAttribute(p, idx ? idx.getX(t + 2) : t + 2).applyMatrix4(mw);
    const nn = b.sub(a).cross(c.sub(a)), ar = nn.length(); if (ar < 1e-9) continue; nn.divideScalar(ar);
    all += ar; if (Math.max(Math.abs(nn.x), Math.abs(nn.y), Math.abs(nn.z)) > 0.97) sq += ar;
  }
  return all ? sq / all : 0;
}
function worldUVm(geo, mw, tile, roof = false) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone(), p = g.attributes.position, n = g.attributes.normal, uv = new Float32Array(p.count * 2);
  const nm = new THREE.Matrix3().getNormalMatrix(mw), v = new THREE.Vector3(), w = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).applyMatrix4(mw); w.fromBufferAttribute(n, i).applyMatrix3(nm);
    const ax = Math.abs(w.x), ay = Math.abs(w.y), az = Math.abs(w.z);
    const [a, b] = ay >= ax && ay >= az ? [v.x, v.z] : ax >= az ? [v.z, v.y] : [v.x, v.y];
    uv[i * 2] = a / tile; uv[i * 2 + 1] = b / tile + (roof && w.y > 0.7 * w.length() ? ROOF : 0);   /* a face looking up on a wall, block or ceiling slab is its roof */
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}
export function dressSurfaces(root) {
  if (Q.has('nosurf') || !root) return 0;
  SURF.calls++; const why = (r) => { SURF.skip[r] = (SURF.skip[r] || 0) + 1; };
  loadBuildingTex();
  root.updateMatrixWorld(true);
  const base = new THREE.Box3().setFromObject(root).min.y;   /* the place's lowest point: a slab more than 1.8 m above it is a ceiling */
  let n = 0;
  root.traverse((o) => {
    if (!o.isMesh || o.isSkinnedMesh || o.isInstancedMesh || Array.isArray(o.material) || !o.geometry || !o.geometry.attributes.normal || o.userData.noSurface || o.userData.surfaced) return;
    for (let q = o; q; q = q.parent) if (q.userData && (q.userData.noSurface || q.userData.water)) return;
    if (/door|window|shutter|gate|sign|board|panel|glass|curtain|blind/i.test((o.name || '') + ' ' + (o.parent && o.parent.name || '') + ' ' + (o.material.name || ''))) return why('named part');   /* a door or a sign keeps its own look (Windrush's doors came out as stone) */
    const m = o.material; if (!plain(m)) return why(m && m.map ? 'has picture' : m && m.vertexColors ? 'vertex colours' : 'not plain');
    _b.setFromObject(o); _b.getSize(_s);
    const big = Math.max(_s.x, _s.z), small = Math.min(_s.x, _s.z);
    const shape = _s.y >= 0.03 && _s.y <= 0.35 && _s.x >= 1.4 && _s.z >= 1.4 && big <= 40 ? 'floor'
      : _s.y >= 1.6 && big >= 1.4 && big <= 40 && small <= 0.7 ? 'wall'
      : _s.y >= 1.8 && small >= 1.8 && big <= 40 ? 'block' : null;
    if (!shape) return why('small');
    if (squareShare(o.geometry, o.matrixWorld) < 0.8) return why('not flat-faced');
    const sh = shape === 'floor' && _b.min.y - base > 1.8 ? 'ceiling' : shape;   /* a slab high up is a ceiling */
    const pale = shape === 'floor' && sh === 'floor' && (m.color.getHSL(_hsl, THREE.SRGBColorSpace), _hsl.l >= 0.66);
    const kind = pale ? 'stone' : kindOf(m, sh, _s.y); if (!kind) return why('colour ' + sh + ' #' + m.color.getHexString());   /* a pale floor is stone flags */
    o.geometry = worldUVm(o.geometry, o.matrixWorld, TILE[kind], sh !== 'floor');
    o.material = matFor(kind, m);
    o.userData.surfaced = kind; n++; SURF.dressed++; const kk = kind + ' ' + sh; SURF.kinds[kk] = (SURF.kinds[kk] || 0) + 1;
    if (SURF.sample.length < 40) SURF.sample.push(kk + ' ' + (o.name || o.parent?.name || '?') + ' ' + [_s.x, _s.y, _s.z].map((v) => v.toFixed(1)).join('x') + ' #' + m.color.getHexString() + ' at ' + [_b.min.x, _b.min.y, _b.min.z].map((v) => v.toFixed(0)).join(','));
  });
  return n;
}
