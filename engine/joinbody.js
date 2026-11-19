/* engine/joinbody.js: fewer draw calls for people, with no change to how they look (18 November 2026).
   A body is a dozen or more skinned pieces (skin, shirt, trousers, hat, buttons...), each its own draw call, so a crowd of thirty cost over
   four hundred. joinBody(m) draws the pieces that can share one material as one skinned mesh on the same skeleton:
   - pieces are grouped by everything about their material except its colour (roughness, metalness, emissive, side, transparency...),
     so skin keeps its own material (and its night fill), and each piece's colour is baked into the joined mesh's vertex colours: the same picture.
   - pieces with a texture, morph targets, a custom shader, or their own bind pose stay apart, as they were.
   - the pieces stay in the body, visible to every check (seats, feet, hands, cloth, faces): they are only kept off the camera (layers mask 0).
     The joined mesh is the only thing drawn, and every engine scanner skips it (isJoined).
   - each body is watched every mixer update (engine/anim.js): if the game shows or hides a piece (a hat taken off, the seated skirt), swaps its
     material or changes its colour, the body is joined again. Joined geometry is cached, so a skirt swapped back and forth costs nothing the second time,
     and people of one body and one set of colours share one geometry on the graphics chip.
   Off with ?nojoin (dev), per body with m.userData.noJoin = true, or for the whole game with setJoin(false). ?test=join checks the joined mesh
   lands on the pieces (auditJoin). See docs/ENGINE.md, "engine/joinbody.js". */
import * as THREE from 'three';

let ON = !(typeof location !== 'undefined' && /[?&]nojoin\b/.test(location.search));
export function setJoin(on) { ON = !!on; }
export const joinOn = () => ON;
export const isJoined = (o) => !!(o && o.userData && o.userData.joinedMesh);
export const JOIN_STATS = { bodies: 0, before: 0, after: 0, rejoins: 0, fails: 0 };
const TEST = typeof location !== 'undefined' && /[?&]test=join\b/.test(location.search), ALL = TEST ? new Set() : null;   /* ?test=join keeps every joined body to check */

const SHAPE = new Map();    /* pieces' geometry ids -> { pos, nor, si, sw, idx, ranges, bones (recipe), inv } shared by every body made from them */
const GEO = new Map();      /* shape key + colours -> BufferGeometry (shared attributes, its own colours) */
const WATCH = new WeakMap(); /* body -> { pieces, snap, meshes } */
const GROUP = new WeakMap(); /* joined mesh -> the pieces it draws, in order */
const FROM = new WeakMap();  /* baked material -> the piece material it follows */

const TEX = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap', 'alphaMap', 'bumpMap', 'displacementMap', 'lightMap', 'envMap', 'clearcoatMap', 'clearcoatNormalMap', 'sheenColorMap', 'transmissionMap', 'specularIntensityMap', 'specularColorMap', 'iridescenceMap', 'anisotropyMap', 'gradientMap', 'matcap', 'specularMap'];
const NUM = ['roughness', 'metalness', 'emissiveIntensity', 'opacity', 'alphaTest', 'side', 'shadowSide', 'blending', 'envMapIntensity', 'clearcoat', 'clearcoatRoughness', 'sheen', 'sheenRoughness', 'transmission', 'thickness', 'ior', 'iridescence', 'specularIntensity', 'reflectivity', 'shininess', 'anisotropy', 'dispersion', 'polygonOffsetFactor', 'polygonOffsetUnits'];
const BOOL = ['transparent', 'flatShading', 'fog', 'toneMapped', 'depthTest', 'depthWrite', 'colorWrite', 'polygonOffset', 'wireframe', 'visible', 'premultipliedAlpha', 'alphaToCoverage', 'dithering'];

/* can this piece be drawn as part of a joined mesh at all? */
function joinable(o) {
  if (!o.isSkinnedMesh || isJoined(o) || Array.isArray(o.material)) return false;
  const g = o.geometry, a = g.attributes, mt = o.material;
  if (!a.position || !a.normal || !a.skinIndex || !a.skinWeight) return false;
  if (g.morphAttributes && Object.keys(g.morphAttributes).length) return false;
  if (g.groups && g.groups.length > 1) return false;
  if (!mt || !mt.isMaterial || Object.prototype.hasOwnProperty.call(mt, 'onBeforeCompile')) return false;
  for (const k of TEX) if (mt[k]) return false;
  return true;
}
/* everything about a material that must match for two pieces to be drawn as one (colour is baked into the points, so it is left out) */
function sig(o) {
  const mt = o.material; let s = mt.type + '|' + o.parent.id + '|' + o.castShadow + o.receiveShadow + '|' + o.renderOrder + '|' + o.frustumCulled;
  for (const k of NUM) if (mt[k] !== undefined) s += '|' + mt[k];
  for (const k of BOOL) if (mt[k] !== undefined) s += mt[k] ? 1 : 0;
  if (mt.emissive) s += '|e' + mt.emissive.getHexString();
  if (mt.specular) s += '|s' + mt.specular.getHexString();
  if (mt.sheenColor) s += '|h' + mt.sheenColor.getHexString();
  if (mt.attenuationColor) s += '|a' + mt.attenuationColor.getHexString();
  return s;
}

/* a cheap picture of what the grouping depends on, compared every update: which pieces show, their materials and colours.
   Values that fade smoothly (the night fill, roughness) are not in it: a joined mesh shares or follows its pieces' material for those (syncMat). */
const SNAP_N = 6;
const flags = (m) => (m.vertexColors ? 1 : 0) + (m.transparent ? 2 : 0) + (m.visible ? 4 : 0);
function snapInto(pieces, out) {
  let i = 0;
  for (const o of pieces) { const m = o.material, c = m && m.color;
    out[i++] = o.visible ? 1 : 0; out[i++] = m ? m.id : -1; out[i++] = c ? c.r : 0; out[i++] = c ? c.g : 0; out[i++] = c ? c.b : 0; out[i++] = m ? flags(m) : 0; }
  return out;
}
function changed(w) { const s = w.snap; let i = 0;
  for (const o of w.pieces) { const m = o.material, c = m && m.color;
    if (s[i++] !== (o.visible ? 1 : 0) || s[i++] !== (m ? m.id : -1) || s[i++] !== (c ? c.r : 0) || s[i++] !== (c ? c.g : 0) || s[i++] !== (c ? c.b : 0) || s[i++] !== (m ? flags(m) : 0)) return true; }
  return false;
}

const _m = new THREE.Matrix4(), _n = new THREE.Matrix3(), _v = new THREE.Vector3(), _c = new THREE.Color();
/* the matrix that brings a piece's points onto the first piece's bind pose: one D = ref^-1 * own for every shared bone, or null */
function bindOffset(ref, o) {
  const rs = ref.skeleton, os = o.skeleton; let D = null;
  for (let j = 0; j < os.bones.length; j++) { const r = rs.bones.indexOf(os.bones[j]); if (r < 0) continue;
    const Dj = new THREE.Matrix4().copy(rs.boneInverses[r]).invert().multiply(os.boneInverses[j]);
    if (!D) { D = Dj; continue; } const a = D.elements, b = Dj.elements; for (let k = 0; k < 16; k++) if (Math.abs(a[k] - b[k]) > 1e-4 * (1 + Math.abs(a[k]))) return null; }
  return D || new THREE.Matrix4();
}
/* build (once per set of piece geometries) the joined points, normals, skin and triangles */
function shapeOf(group) {
  const key = group.map((o) => o.geometry.uuid).join(','); const hit = SHAPE.get(key); if (hit) return hit;
  const ref = group[0], bones = ref.skeleton.bones.map((b, j) => [0, j]), inv = ref.skeleton.boneInverses.map((m) => m.clone());
  const offs = group.map((o) => (o === ref ? new THREE.Matrix4() : bindOffset(ref, o))); if (offs.some((d) => !d)) return null;
  let nv = 0, ni = 0; for (const o of group) { nv += o.geometry.attributes.position.count; ni += o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count; }
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), si = new Uint16Array(nv * 4), sw = new Float32Array(nv * 4), idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni), ranges = [];
  let v0 = 0, i0 = 0;
  group.forEach((o, p) => {
    const g = o.geometry, A = g.attributes, n = A.position.count, D = offs[p]; _n.getNormalMatrix(D);
    const map = o.skeleton.bones.map((b) => { let r = ref.skeleton.bones.indexOf(b); if (r < 0) { r = bones.length; bones.push([p, o.skeleton.bones.indexOf(b)]); inv.push(new THREE.Matrix4().copy(o.skeleton.boneInverses[o.skeleton.bones.indexOf(b)]).multiply(_m.copy(D).invert())); } return r; });
    for (let i = 0; i < n; i++) { const k = v0 + i;
      _v.fromBufferAttribute(A.position, i).applyMatrix4(D); pos[k * 3] = _v.x; pos[k * 3 + 1] = _v.y; pos[k * 3 + 2] = _v.z;
      _v.fromBufferAttribute(A.normal, i).applyMatrix3(_n).normalize(); nor[k * 3] = _v.x; nor[k * 3 + 1] = _v.y; nor[k * 3 + 2] = _v.z;
      for (let c = 0; c < 4; c++) { si[k * 4 + c] = map[A.skinIndex.getComponent(i, c)] || 0; sw[k * 4 + c] = A.skinWeight.getComponent(i, c); } }
    const ix = g.index; const m = ix ? ix.count : n; for (let i = 0; i < m; i++) idx[i0 + i] = v0 + (ix ? ix.getX(i) : i);
    ranges.push([v0, n]); v0 += n; i0 += m;
  });
  const S = { key, pos: new THREE.BufferAttribute(pos, 3), nor: new THREE.BufferAttribute(nor, 3), si: new THREE.BufferAttribute(si, 4), sw: new THREE.BufferAttribute(sw, 4), idx: new THREE.BufferAttribute(idx, 1), ranges, bones, inv, nv };
  SHAPE.set(key, S); return S;
}
/* the joined geometry for these pieces in their present colours (shared with every body that has the same) */
function geoOf(S, group, bake) {
  let ck = S.key; if (bake) for (const o of group) { const m = o.material; ck += '|' + m.color.r.toFixed(5) + ',' + m.color.g.toFixed(5) + ',' + m.color.b.toFixed(5) + (m.vertexColors && o.geometry.attributes.color ? 'v' : '');   /* the real channels: a colour lightened past 1 (hair at 1.55) must not share a key with plain white */ }
  const hit = GEO.get(ck); if (hit) return hit;
  const g = new THREE.BufferGeometry(); g.setAttribute('position', S.pos); g.setAttribute('normal', S.nor); g.setAttribute('skinIndex', S.si); g.setAttribute('skinWeight', S.sw); g.setIndex(S.idx);
  if (bake) { const col = new Float32Array(S.nv * 3);   /* full range: a colour lightened past 1 stays as bright as it was */
    group.forEach((o, p) => { const [v0, n] = S.ranges[p], m = o.material, vc = m.vertexColors && o.geometry.attributes.color;
      for (let i = 0; i < n; i++) { if (vc) _c.fromBufferAttribute(vc, i); else _c.setRGB(1, 1, 1); const k = (v0 + i) * 3;
        col[k] = _c.r * m.color.r; col[k + 1] = _c.g * m.color.g; col[k + 2] = _c.b * m.color.b; } });
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); }
  else if (group[0].material.vertexColors && group.every((o) => o.geometry.attributes.color)) {   /* one colour for all: keep the pieces' own vertex colours */
    const col = new Float32Array(S.nv * 3); group.forEach((o, p) => { const [v0, n] = S.ranges[p], a = o.geometry.attributes.color; for (let i = 0; i < n; i++) { _c.fromBufferAttribute(a, i); col.set([_c.r, _c.g, _c.b], (v0 + i) * 3); } });
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); }
  GEO.set(ck, g); return g;
}
/* a baked material follows the piece it was made from: the game's night fill, a fade, a change of roughness */
function syncMat(mat) { const s = FROM.get(mat); if (!s) return;
  if (mat.emissive && s.emissive) mat.emissive.copy(s.emissive); for (const k of ['emissiveIntensity', 'roughness', 'metalness', 'opacity', 'envMapIntensity']) if (s[k] !== undefined) mat[k] = s[k];
  if (mat.visible !== s.visible) mat.visible = s.visible; }

function unjoin(m, w) { if (!w) return; for (const j of w.meshes) { if (j.parent) j.parent.remove(j); j.skeleton.dispose(); if (FROM.has(j.material)) j.material.dispose(); }   /* free what this joined mesh owns (its bone texture, a baked material); the cached geometry and the pieces' own materials stay */ for (const o of w.pieces) if (o.userData._jmask !== undefined) { o.layers.mask = o.userData._jmask; delete o.userData._jmask; } w.meshes = []; }

/* draw this body's pieces as few meshes as the materials allow. Returns how many draw calls it saved. */
export function joinBody(m) {
  if (!ON || !m || m.userData.noJoin) return 0;
  const old = WATCH.get(m); unjoin(m, old);
  m.traverse((o) => { if (isJoined(o) && o.parent) o.userData._drop = true; }); m.traverse((o) => { if (o.userData._drop) { o.parent.remove(o); } });   /* a body copied from a joined one: drop the copy's joined meshes */
  m.traverse((o) => { if (o.userData._jmask !== undefined) { o.layers.mask = o.userData._jmask; delete o.userData._jmask; } });
  const pieces = []; m.traverse((o) => { if (o.isSkinnedMesh && !isJoined(o)) pieces.push(o); });
  const w = { pieces, snap: snapInto(pieces, new Float64Array(pieces.length * SNAP_N)), meshes: [] }; WATCH.set(m, w);
  const groups = new Map(); for (const o of pieces) { if (!o.visible || !o.material || !o.material.visible || !joinable(o)) continue; const k = sig(o); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(o); }
  let saved = 0;
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const ref = group[0]; if (group.some((o) => !o.bindMatrix.equals(ref.bindMatrix) || o.bindMode !== ref.bindMode)) { JOIN_STATS.fails++; continue; }
    const S = shapeOf(group); if (!S) { JOIN_STATS.fails++; continue; }
    const mats = group.map((o) => o.material);
    let one = mats.every((mt) => mt === mats[0]) || mats.every((mt) => mt.color && mt.color.equals(mats[0].color) && mt.vertexColors === mats[0].vertexColors);
    if (one && mats[0].vertexColors && !group.every((o) => o.geometry.attributes.color)) one = false;   /* a piece without colours of its own would draw black: bake */
    if (!one && !mats.every((mt) => mt.color)) continue;
    const g = geoOf(S, group, !one);
    let mat = mats[0]; if (!one) { mat = mats[0].clone(); FROM.set(mat, mats[0]); mat.color.setRGB(1, 1, 1); mat.vertexColors = true; mat.name = 'Joined'; }
    const bones = S.bones.map(([p, j]) => group[p].skeleton.bones[j]), skel = new THREE.Skeleton(bones, S.inv);
    const sm = new THREE.SkinnedMesh(g, mat); sm.name = (ref.name || 'body') + '_joined'; sm.userData.joinedMesh = true; sm.bindMode = ref.bindMode; sm.bind(skel, ref.bindMatrix);
    sm.castShadow = ref.castShadow; sm.receiveShadow = ref.receiveShadow; sm.renderOrder = ref.renderOrder; sm.frustumCulled = ref.frustumCulled;
    if (sm.frustumCulled) sm.computeBoundingSphere();
    ref.parent.add(sm); w.meshes.push(sm); GROUP.set(sm, group);
    for (const o of group) { o.userData._jmask = o.layers.mask; o.layers.mask = 0; }   /* kept for every check, off the camera */
    saved += group.length - 1;
  }
  if (ALL && saved) ALL.add(m);
  if (!old) { JOIN_STATS.bodies++; JOIN_STATS.before += pieces.filter((o) => o.visible).length; JOIN_STATS.after += pieces.filter((o) => o.visible).length - saved; }
  m.userData.joinedSaved = saved; return saved;
}
/* called after each mixer update (engine/anim.js): join a new body once it has been dressed, and again whenever a piece changes */
export function joinTick(m) {
  if (!ON || m.userData.noJoin) { const w = WATCH.get(m); if (w && w.meshes.length) { unjoin(m, w); WATCH.delete(m); } return; }
  const w = WATCH.get(m); if (!w) { joinBody(m); return; }
  if (changed(w)) { JOIN_STATS.rejoins++; const t = performance.now(); w.hits = (w.hits || []).filter((x) => t - x < 3000); w.hits.push(t);
    if (w.hits.length > 6) { m.userData.noJoin = true; unjoin(m, w); WATCH.delete(m); JOIN_STATS.fails++; return; }   /* a body the game changes all the time (a colour that fades): draw its pieces */
    const hits = w.hits; joinBody(m); WATCH.get(m).hits = hits; return; }
  for (const j of w.meshes) syncMat(j.material);
}
/* put a body back as its pieces (a game that is about to change it a great deal, or a test) */
export function splitBody(m) { const w = WATCH.get(m); unjoin(m, w); WATCH.delete(m); }

/* dev check (?test=join): every joined mesh's points, posed, land on its pieces' points (in metres). Returns issue strings. */
export function auditJoin(id, m, tol = 0.002) {
  const out = [], w = WATCH.get(m); if (!w || !w.meshes.length) return out; m.updateMatrixWorld(true);
  const a = new THREE.Vector3(), b = new THREE.Vector3();
  for (const j of w.meshes) { j.skeleton.update(); const S = [...SHAPE.values()].find((s) => s.pos === j.geometry.attributes.position); if (!S) continue;
    const group = GROUP.get(j) || []; let worst = 0;
    group.forEach((o, p) => { const [v0, n] = S.ranges[p]; o.skeleton.update();
      for (let i = 0; i < n; i += Math.max(1, n >> 6)) { o.getVertexPosition(i, a).applyMatrix4(o.matrixWorld); j.getVertexPosition(v0 + i, b).applyMatrix4(j.matrixWorld); worst = Math.max(worst, a.distanceTo(b)); } });
    if (worst > tol) out.push(id + ': joined ' + j.name + ' is ' + (worst * 100).toFixed(1) + ' cm off its pieces'); }
  return out;
}

/* ?test=join: twelve seconds in (every place with people has been dressed and posed), check each joined body, and again after its clip has moved on.
   Prints "JOIN <n> issues in <m> bodies" to the title and the console, then the issues. */
if (TEST) setTimeout(() => { const out = []; let n = 0; for (const m of ALL) { n++; out.push(...auditJoin(m.name || m.userData.id || 'body ' + n, m)); }
  const t = 'JOIN ' + out.length + ' issues in ' + n + ' bodies'; document.title = t; console.log(t + (out.length ? '\n' + out.join('\n') : '')); }, 12000);
