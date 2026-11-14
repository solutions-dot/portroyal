/* games/bog-walk/src/hand.js: what you hold. A torch in your right hand, low down in front of you (a child of the camera).
   The hand is modelled from a photograph of a torch held up in a right hand (the owner's reference), seen as you see your own: from behind, above and a little
   to the left. It is a real modelled hand: the shared character "hl_worker" with its joints turned in Blender so the fingers close round the handle
   (tools/bog-walk/hand_blender.py writes ./handmesh.js; docs/games/bog-walk.md says how to remake it). What it shows:
     - the handle passes right through the closed fist, across the palm at a slant;
     - four fingers, stacked tight, each one wrapped round the handle, their tips curled back toward the palm;
     - one thumb, lying UP along the handle and pressed against it, its tip above the index finger, with a thumbnail;
     - the back of the hand facing right, the wrist, and the forearm going off to the lower right, toward you, into a rolled shirt sleeve.
   The mesh comes as one smooth skin. It is smoothed once more here, its normals are worked out on the whole of it, and then it is split into named parts
   (palm, four fingers, thumb, thenar, wrist, sleeve, the nails), which the dev check ?test=held counts and tests one by one.
   Owner rules: a held thing is held properly, never floats, never passes through the body and never covers the middle of the view. Skin follows owner
   rule 9: a colour inside Marcus Garvey's range, lightened as Kendal does (SKIN_LIGHT), so the hand reads in the dark of the pipe. */
import * as THREE from 'three';
import { flameTex, woodTex, ragTex } from './gfx.js';
import { HANDMESH } from './handmesh.js';

const SKIN_LIGHT = 1.55, SKIN = [148, 100, 72];   /* owner rule 9: inside [134, 90, 64] to [156, 108, 80], then lightened */
const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

/* One step of Loop subdivision: every triangle becomes four and the surface is smoothed (the mesh ships coarse and is made smooth here, so it stays small).
   pos: xyz per vertex, att: one more number per vertex carried along (the baked light), tri: three vertex numbers per triangle. Edges with only one
   triangle (the cut ends of the forearm and sleeve) are kept as curves. */
function loopSubdivide(pos, att, tri) {
  const nv = pos.length / 3, nt = tri.length / 3, edges = new Map(), key = (a, b) => (a < b ? a * nv + b : b * nv + a);
  for (let t = 0; t < nt; t++) for (let e = 0; e < 3; e++) {
    const a = tri[t * 3 + e], b = tri[t * 3 + (e + 1) % 3], c = tri[t * 3 + (e + 2) % 3], k = key(a, b); let E = edges.get(k);
    if (!E) { E = { a, b, opp: [], id: 0 }; edges.set(k, E); } E.opp.push(c); }
  const P = new Float32Array((nv + edges.size) * 3), A = new Float32Array(nv + edges.size);
  const sum = new Float32Array(nv * 3), cnt = new Uint16Array(nv), bsum = new Float32Array(nv * 3), bcnt = new Uint8Array(nv);
  for (const E of edges.values()) for (const [u, w] of [[E.a, E.b], [E.b, E.a]]) {
    for (let i = 0; i < 3; i++) sum[u * 3 + i] += pos[w * 3 + i]; cnt[u]++;
    if (E.opp.length !== 2) { for (let i = 0; i < 3; i++) bsum[u * 3 + i] += pos[w * 3 + i]; bcnt[u]++; } }
  for (let v = 0; v < nv; v++) {   /* the old vertices move toward the average of their neighbours (on a cut edge: toward their two neighbours along it) */
    A[v] = att[v];
    if (bcnt[v]) { for (let i = 0; i < 3; i++) P[v * 3 + i] = bcnt[v] === 2 ? 0.75 * pos[v * 3 + i] + 0.125 * bsum[v * 3 + i] : pos[v * 3 + i]; continue; }
    const n = cnt[v], beta = n > 3 ? 3 / (8 * n) : 3 / 16;
    for (let i = 0; i < 3; i++) P[v * 3 + i] = (1 - n * beta) * pos[v * 3 + i] + beta * sum[v * 3 + i];
  }
  let id = nv;   /* a new vertex on every edge */
  for (const E of edges.values()) { E.id = id; const inner = E.opp.length === 2;
    for (let i = 0; i < 3; i++) P[id * 3 + i] = inner ? 0.375 * (pos[E.a * 3 + i] + pos[E.b * 3 + i]) + 0.125 * (pos[E.opp[0] * 3 + i] + pos[E.opp[1] * 3 + i]) : 0.5 * (pos[E.a * 3 + i] + pos[E.b * 3 + i]);
    A[id] = 0.5 * (att[E.a] + att[E.b]); id++; }
  const T = new Uint32Array(nt * 12);
  for (let t = 0; t < nt; t++) {
    const a = tri[t * 3], b = tri[t * 3 + 1], c = tri[t * 3 + 2], ab = edges.get(key(a, b)).id, bc = edges.get(key(b, c)).id, ca = edges.get(key(c, a)).id;
    T.set([a, ab, ca, ab, b, bc, ca, bc, c, ab, bc, ca], t * 12); }
  return { pos: P, att: A, tri: T };
}

/* The hand from handmesh.js, in this file's hand space (the handle is the y axis, +z toward you, +x to your right, which is how grip space already lies),
   moved up the handle so the middle of the fist is at height y. Returns [name, geometry] for each part. */
function handParts(y) {
  const H = HANDMESH, pb = b64(H.pos), q = new Int16Array(pb.buffer, pb.byteOffset, pb.byteLength >> 1), ib = b64(H.idx);
  let pos = new Float32Array(q.length); for (let i = 0; i < q.length; i += 3) { pos[i] = q[i] * H.scale; pos[i + 1] = q[i + 1] * H.scale + y; pos[i + 2] = q[i + 2] * H.scale; }
  let att = Float32Array.from(b64(H.ao), (x) => x / 255), idx = new Uint16Array(ib.buffer, ib.byteOffset, ib.byteLength >> 1), per = 1;
  for (let k = 0; k < (H.smooth ?? 1); k++) { const r = loopSubdivide(pos, att, idx); pos = r.pos; att = r.att; idx = r.tri; per *= 4; }
  const all = new THREE.BufferGeometry(); all.setAttribute('position', new THREE.BufferAttribute(pos, 3)); all.setIndex(new THREE.BufferAttribute(idx, 1)); all.computeVertexNormals();
  const nor = all.attributes.normal.array, out = [];
  for (const [name, t0, nt] of H.parts) {   /* a triangle's four children follow it, so each part is still one run of triangles */
    const map = new Map(), P = [], N = [], C = [], I = [];
    for (let k = t0 * 3 * per; k < (t0 + nt) * 3 * per; k++) { const v = idx[k]; let w = map.get(v);
      if (w === undefined) { w = map.size; map.set(v, w); P.push(pos[v * 3], pos[v * 3 + 1], pos[v * 3 + 2]); N.push(nor[v * 3], nor[v * 3 + 1], nor[v * 3 + 2]); const a = 0.3 + 0.7 * att[v]; C.push(a, a, a); }
      I.push(w); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3)); g.setIndex(I); g.computeBoundingBox();
    out.push([name, g]); }
  return out;
}

export function makeHand(camera) {
  const root = new THREE.Group(), inner = new THREE.Group(); camera.add(root); root.add(inner);
  /* Everything is in the hand's own space: the handle runs straight up the y axis through (0, y, 0); +z is toward you, +x is to your right. */
  const RH = HANDMESH.info.handleRadius, FISTY = -0.457;   /* the handle's radius where the hand holds it (the hand was closed round exactly this), and the height of the middle of the fist */
  const skinCol = new THREE.Color().setRGB(SKIN[0] / 255, SKIN[1] / 255, SKIN[2] / 255, THREE.SRGBColorSpace).multiplyScalar(SKIN_LIGHT);
  const skin = new THREE.MeshStandardMaterial({ color: skinCol, roughness: 0.58, metalness: 0, vertexColors: true, emissive: 0x2c150a });   /* a warm glow of its own, so the hand never goes black in the dark of the pipe */
  const nailMat = new THREE.MeshStandardMaterial({ color: new THREE.Color().setRGB(160 / 255, 108 / 255, 86 / 255, THREE.SRGBColorSpace).multiplyScalar(SKIN_LIGHT), roughness: 0.5, vertexColors: true, emissive: 0x1a100b });
  const add = (geo, mat, name) => { const m = new THREE.Mesh(geo, mat); m.name = name; inner.add(m); return m; };

  /* ----- the torch: a turned wooden handle with a rounded butt, a head of oil-soaked rags bound on with wire, and a flame ----- */
  const stickA = new THREE.Vector3(0, -0.575, 0), stickB = new THREE.Vector3(0, -0.25, 0);
  const wTex = woodTex(), rTex = ragTex(); rTex.repeat.set(2, 1);
  const wood = new THREE.MeshStandardMaterial({ map: wTex, bumpMap: wTex, bumpScale: 0.6, roughness: 0.78, emissive: 0x100904 });
  const profile = [[0.0001, -0.575], [0.009, -0.5735], [0.0128, -0.566], [0.0138, -0.555], [0.0132, -0.545], [0.0146, -0.535], [RH, -0.5], [RH, -0.4], [0.0142, -0.33], [0.0134, -0.25]].map(([r, y]) => new THREE.Vector2(r, y));
  add(new THREE.LatheGeometry(profile, 18), wood, 'stick');
  const rag = new THREE.MeshStandardMaterial({ map: rTex, bumpMap: rTex, bumpScale: 2.4, roughness: 1, emissive: 0x5a2208, emissiveIntensity: 1 });
  const headProfile = [[0.0134, -0.262], [0.021, -0.258], [0.0285, -0.246], [0.033, -0.226], [0.0345, -0.2], [0.033, -0.178], [0.0275, -0.162], [0.018, -0.152], [0.007, -0.148], [0.0001, -0.1475]].map(([r, y]) => new THREE.Vector2(r, y));
  const head = add(new THREE.LatheGeometry(headProfile, 20), rag, 'head');
  { const hp = head.geometry.attributes.position, v = new THREE.Vector3(); for (let i = 0; i < hp.count; i++) { v.fromBufferAttribute(hp, i); const a = Math.atan2(v.z, v.x), k = 1 + 0.06 * Math.sin(a * 3 + v.y * 60) + 0.04 * Math.sin(a * 7 - v.y * 95); hp.setXYZ(i, v.x * k, v.y, v.z * k); } head.geometry.computeVertexNormals(); }   /* lumpy, as a bundle of rags is */
  const wire = new THREE.MeshStandardMaterial({ color: 0x2c2a28, roughness: 0.5, metalness: 0.7 });
  for (const [y, r] of [[-0.251, 0.0262], [-0.2445, 0.0293], [-0.184, 0.0343]]) { const w = add(new THREE.TorusGeometry(r, 0.0017, 5, 28), wire, 'binding'); w.rotation.x = Math.PI / 2; w.position.y = y; }
  const fTex = flameTex(), flameMat = () => new THREE.SpriteMaterial({ map: fTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false });
  const flame = new THREE.Sprite(flameMat()); flame.name = 'flame'; flame.position.set(0, -0.062, 0); inner.add(flame);
  const core = new THREE.Sprite(flameMat()); core.name = 'flamecore'; core.position.set(0, -0.088, 0.001); inner.add(core);   /* a smaller, brighter flame inside the first */
  const light = new THREE.PointLight(0xffa860, 4, 18, 1.2); light.position.set(-0.02, -0.07, 0.1); inner.add(light);

  /* ----- the hand, the forearm and the shirt sleeve: one modelled mesh split into named parts ----- */
  const cloth = new THREE.MeshStandardMaterial({ color: 0x776f60, roughness: 0.95, emissive: 0x14110b, vertexColors: true });
  for (const [name, g] of handParts(FISTY)) add(g, name === 'sleeve' || name === 'cuff' ? cloth : /nail$/.test(name) ? nailMat : skin, name);
  inner.traverse((o) => { if (o.isMesh) { o.frustumCulled = false; o.renderOrder = 10; } });

  const FIST = new THREE.Vector3(0, FISTY, 0.004);   /* the middle of the fist: the hand is turned and scaled about this point */
  const H = { root, inner, stickA, stickB, flame, light, lift: 0, panelOpen: false, baseX: 0, halfW: 1, baseY: -0.25, tune: null, s: 1, cs: 0,
    setPanelOpen(on) { H.panelOpen = on; root.position.x = H.baseX - (on ? Math.min(0.22, Math.max(0, H.halfW - 0.2) * 0.8) : 0); },   /* a narrow screen moves it less, so it does not leave the side */
    setLift(u) { H.lift = u; root.position.y = H.baseY + u; },
    setCine(c) { H.cs = c; const s = H.s * (1 - 0.14 * c); inner.scale.setScalar(s); inner.position.copy(FIST).multiplyScalar(-s).applyEuler(inner.rotation); },   /* the black bars push the words down, so the torch shrinks a little about the fist to keep its flame clear of them */   /* lift (in camera units): the black bars are in, so the whole hand rises just enough to keep the fist clear of the bottom bar */
    lowestFistPx(cam, screenH) {   /* the lowest point of the fingers, thumb and palm on the screen, in pixels from the top */
      cam.updateMatrixWorld(true); const v = new THREE.Vector3(); let low = 0;
      inner.traverse((o) => { if (!o.isMesh || !['finger', 'palm', 'thumb', 'thenar'].includes(o.name)) return; if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); const bb = o.geometry.boundingBox;
        for (const x of [bb.min.x, bb.max.x]) for (const y2 of [bb.min.y, bb.max.y]) for (const z of [bb.min.z, bb.max.z]) { v.set(x, y2, z).applyMatrix4(o.matrixWorld).project(cam); low = Math.max(low, (-v.y * 0.5 + 0.5) * screenH); } });
      return low; },
    place(aspect, fov, ph, pw) {   /* the fist sits at a fixed low spot, fully in view; the torch is turned and scaled about it, so a small or narrow screen shrinks the torch, not the grip */
      const depth = 0.55, halfW = Math.tan(fov * Math.PI / 360) * aspect * depth, wide = aspect >= 1.2, s = 0.94 * Math.min(1, Math.max(0.35, Math.min(ph / 640, pw / 560)));   /* words keep their pixel size, so a short or narrow screen gets a smaller torch to leave them room */
      const tn = H.tune || {};
      root.position.set(wide ? Math.min(0.34, halfW * 0.7) : halfW * (tn.x ?? 0.31), H.baseY + H.lift, -depth); H.baseX = root.position.x; H.halfW = halfW; H.setPanelOpen(H.panelOpen); root.rotation.set(0, tn.ry ?? (wide ? 0.34 : 0.0), 0);   /* on a tall phone the hand turns a little less, so the forearm leaves through the bottom edge, not the side */
      inner.rotation.set(tn.rx ?? -0.2, 0, tn.rz ?? (wide ? -0.15 : -0.07)); H.s = s * (tn.sm ?? 1); H.setCine(H.cs); },
    update(time, k) {
      rag.emissiveIntensity = 0.1 + 0.9 * Math.min(1, k); skin.emissiveIntensity = 0.8 + 0.5 * Math.min(1, k); const f = k * (0.86 + 0.1 * Math.sin(time * 9.1) + 0.06 * Math.sin(time * 21)), f2 = k * (0.9 + 0.1 * Math.sin(time * 13.3 + 1));
      flame.material.opacity = Math.max(0, Math.min(1, f)); flame.visible = f > 0.02; flame.scale.set(0.17 * (0.92 + 0.14 * Math.sin(time * 11)), 0.26 * (0.9 + 0.18 * Math.sin(time * 14)), 1);
      core.material.opacity = Math.max(0, Math.min(1, f2)); core.visible = f2 > 0.02; core.scale.set(0.085 * (0.9 + 0.2 * Math.sin(time * 17 + 2)), 0.15 * (0.88 + 0.22 * Math.sin(time * 19 + 0.5)), 1); core.position.x = 0.004 * Math.sin(time * 7.3);
      light.intensity = 4 * Math.max(0, f); } };
  return H;
}
