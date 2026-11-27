/* engine/beasts.js: rigged farm animals for every game (rule 10; owner, 27 November 2026: "we need a rigged model for the mule for all the
   games that use it", then "looks like we need a cow to match.. and horse where appropriate").
   The bodies are the Quaternius "Ultimate Animated Animal Pack" (quaternius.com, CC0): the donkey (our mule, dressed in engine/mule.js),
   the cow, the bull and the horse, packed by tools/animals/pack_animals.mjs as shared/models/<name>.js. Here they are smoothed (the pack
   is faceted; our people are smooth), coloured, scaled and set moving.
     await loadBeasts(['cow', 'horse']);         // once, before the places are built
     const c = cow(COATS[3], 'graze');           // facing +x, hooves on y = 0
     const h = horse(0x6a3c24);                  // a bay horse
   Every animal moves by itself. Each frame it is drawn it measures how far it has gone (and turned): moving, it plays its walk, one cycle per
   stride of ground so the hooves do not slide; standing, it plays its idle. A film or a reveal only sets its position and rotation; a pause
   stops the legs with the body, and a jump of more than 3 m in one frame (a film putting it back) is not walking.
   userData: idle (the standing clip: 'Idle', which turns now and then into 'Idle_2'; 'Idle_Headlow'; 'Eating'), stride (metres per walk
   cycle at scale 1), step(ms) and mixer (for tests), tick (does nothing; for older callers).
   If a model failed to load (the loader's "please reload" note shows), the animal is an empty group so the place still builds. */
import * as THREE from 'three';
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';
import { mergeVertices, mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { model } from './loader.js';

/* HEIGHT: how tall each one is built, to the ear tips or horn tips, in metres; the tack (engine/mule.js, the horse's saddle) is fitted at this
   size. SIZE then scales the animal and all it wears together, to its real height at the shoulder (the withers), measured on the body
   (owner, 27 November 2026: "is the horse sized correctly in relation to environment, people and houses"): a mule about 1.37 m (13.2 hands,
   a pack mule), a riding horse about 1.5 m (14.3 hands), a cow of the small island breed about 1.3 m (as the drawn cow it replaced), a bull
   about 1.4 m. A grown man in these games is 1.7 to 1.8 m. */
const HEIGHT = { mule: 2.01, cow: 1.62, bull: 1.7, horse: 2.2 };
const SIZE = { mule: 0.93, cow: 0.83, bull: 0.85, horse: 0.9 };
const TELEPORT = 3;
const tpl = {}, loading = {};
export function loadBeasts(names = ['mule']) {
  return Promise.all(names.map((n) => loading[n] || (loading[n] = model(n).then((g) => (tpl[n] = prepare(g, n))).catch(() => null))));
}
export const beastReady = (n) => !!tpl[n];

/* one material for every animal: colours are in the vertices, so a whole animal is one draw call (performance on phones) */
const COAT = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 });

/* once per kind: smooth the faceted body (weld the corners, share the normals), join its pieces (one per colour in the pack) into one
   skinned mesh that keeps which colour each vertex had, measure it, remember the clips */
function prepare(g, n) {
  const parts = [], names = [];
  let first = null;
  g.scene.traverse((o) => { if (o.isSkinnedMesh) { first = first || o; parts.push(o); } });
  const geos = parts.map((o) => {
    const geo = o.geometry.clone(); geo.deleteAttribute('normal'); for (const k of Object.keys(geo.attributes)) if (!['position', 'skinIndex', 'skinWeight'].includes(k)) geo.deleteAttribute(k);
    const m = mergeVertices(geo, 1e-4); m.computeVertexNormals();
    const mat = [].concat(o.material)[0], i = names.push(mat.name) - 1, col = mat.color.clone();
    const count = m.attributes.position.count, part = new Float32Array(count).fill(i), rgb = new Float32Array(count * 3);
    for (let v = 0; v < count; v++) col.toArray(rgb, v * 3);
    m.setAttribute('part', new THREE.BufferAttribute(part, 1)); m.setAttribute('color', new THREE.BufferAttribute(rgb, 3));
    /* the pack is quantised (small whole numbers): unpack to plain floats so the pieces join, and the joint numbers to one type */
    for (const k of ['position', 'normal', 'skinWeight']) m.setAttribute(k, toFloat(m.attributes[k]));
    m.setAttribute('skinIndex', new THREE.BufferAttribute(Uint16Array.from(m.attributes.skinIndex.array), 4));
    return m;
  });
  const geo = mergeGeometries(geos);
  const one = new THREE.SkinnedMesh(geo, COAT);
  one.name = n; one.position.copy(first.position); one.quaternion.copy(first.quaternion); one.scale.copy(first.scale);
  first.parent.add(one); one.bind(first.skeleton, first.bindMatrix);
  for (const o of parts) o.removeFromParent();
  g.scene.updateMatrixWorld(true);
  const h = new THREE.Box3().setFromObject(g.scene).getSize(new THREE.Vector3()).y || 1;
  const clips = {}; for (const a of g.animations) clips[a.name] = a;
  const scale = HEIGHT[n] / h;
  /* the mule's walk was measured: 1.5 m of ground per cycle at 2.01 m tall. The others share the rig and the clip, so their stride goes with size. */
  return { scene: g.scene, clips, scale, stride: 1.5 * HEIGHT[n] / HEIGHT.mule, names, base: names.map((nm) => { const c = new THREE.Color(); parts.forEach((o) => { const m = [].concat(o.material)[0]; if (m.name === nm) c.copy(m.color); }); return c; }) };
}
function toFloat(a) {
  const n = a.itemSize, out = new Float32Array(a.count * n), get = ['getX', 'getY', 'getZ', 'getW'];
  for (let i = 0; i < a.count; i++) for (let j = 0; j < n; j++) out[i * n + j] = a[get[j]](i);
  return new THREE.BufferAttribute(out, n);
}
/* an animal's own colours: the shared shape with its own colour attribute */
function coloured(T, geo, tint) {
  const cols = T.names.map((nm, i) => (tint[nm] != null ? new THREE.Color(tint[nm]) : T.base[i]));
  const part = geo.attributes.part.array, rgb = new Float32Array(part.length * 3);
  for (let v = 0; v < part.length; v++) cols[part[v]].toArray(rgb, v * 3);
  const g2 = new THREE.BufferGeometry();
  for (const k of Object.keys(geo.attributes)) if (k !== 'color') g2.setAttribute(k, geo.attributes[k]);
  g2.setAttribute('color', new THREE.BufferAttribute(rgb, 3)); g2.setIndex(geo.index);
  return g2;
}

/* a body of kind n, coloured by material name (tint: { Main: 0x..., ... }). Returns { g, ride, onStep }: g is the animal (faces +x);
   ride(bone) is a group that rides on that bone and lines up with the animal's own space when it stands, for a pack, a harness or a load;
   onStep(fn) runs fn(worldQuaternion) after each frame's pose (the mule's lead rope keeps plumb with it). */
export function beast(n, tint = {}, opts = {}) {
  const g = new THREE.Group(), T = tpl[n], hooks = [];
  g.userData.noBatch = true; g.userData.tick = () => {};
  if (!T) return { g, ride: () => g, onStep: () => {} };
  g.userData.stride = T.stride;
  const inner = new THREE.Group(); inner.scale.setScalar(SIZE[n] || 1); g.add(inner);   /* its real size: body and tack together */
  const body = skClone(T.scene); body.scale.setScalar(T.scale); body.rotation.y = Math.PI / 2;   /* the pack's animals face +z; ours face +x */
  inner.add(body);
  let skinned = null;
  body.traverse((o) => {
    o.userData.noBatch = true;
    if (!o.isSkinnedMesh) return;
    o.castShadow = o.receiveShadow = true; skinned = o;
    o.geometry = coloured(T, o.geometry, tint);
  });
  g.updateMatrixWorld(true);
  const ride = (b) => { const r = new THREE.Group(); inner.add(r); g.updateMatrixWorld(true); (body.getObjectByName(b) || g).attach(r); r.userData.noBatch = true; r.userData.worn = true; return r; };   /* worn: engine/audit-reveal.js counts it held by the animal */
  /* the clips: a walk and the idles, mixed by hand from how far the animal has moved */
  const mixer = new THREE.AnimationMixer(body), act = {};
  for (const c of ['Walk', 'Idle', 'Idle_2', 'Idle_Headlow', 'Eating']) if (T.clips[c]) { const a = mixer.clipAction(T.clips[c]); a.play(); a.paused = true; a.setEffectiveWeight(0); act[c] = a; }
  g.userData.idle = opts.idle || 'Idle';
  const rnd = opts.seed != null ? ((Math.sin(opts.seed * 12.9898) * 43758.5453) % 1 + 1) % 1 : Math.random();
  let last = 0, phase = rnd, sm = 0, idleNow = g.userData.idle, idleT = rnd * 3, spare = Math.floor(rnd * 3), prevYaw = null;
  const pos = new THREE.Vector3(), prev = new THREE.Vector3(), q = new THREE.Quaternion(), e = new THREE.Euler(), ws = new THREE.Vector3();
  const step = (now) => {
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
    g.getWorldPosition(pos); g.getWorldQuaternion(q); g.getWorldScale(ws); e.setFromQuaternion(q, 'YXZ');
    let d = prevYaw === null ? 0 : pos.distanceTo(prev), turn = prevYaw === null ? 0 : Math.abs(Math.atan2(Math.sin(e.y - prevYaw), Math.cos(e.y - prevYaw)));
    if (d > TELEPORT || turn > 1.5) { d = 0; turn = 0; }
    prev.copy(pos); prevYaw = e.y;
    const scale = (ws.x || 1) * (SIZE[n] || 1), move = d + turn * 0.35 * scale;   /* turning on the spot steps too */
    if (dt > 0) sm += (move / dt - sm) * (1 - Math.exp(-dt * 8));
    const w = Math.min(1, Math.max(0, sm / (0.3 * T.stride * scale)));
    phase = (phase + move / (T.stride * scale)) % 1;
    /* idles: the chosen one; the plain idle turns now and then into the second idle and back, at the end of a loop */
    const want = g.userData.idle, ia = act[idleNow] || act.Idle, dur = ia ? ia.getClip().duration : 1;
    idleT += dt;
    if (idleT >= dur) { idleT %= dur; spare++; idleNow = want === 'Idle' ? (spare % 3 === 2 && act.Idle_2 ? 'Idle_2' : 'Idle') : want; }
    if (want !== 'Idle' && idleNow !== want) { idleNow = want; idleT = 0; }
    for (const c in act) act[c].setEffectiveWeight(0);
    if (act.Walk) { act.Walk.time = phase * act.Walk.getClip().duration; act.Walk.setEffectiveWeight(w); }
    const ib = act[idleNow] || act.Idle; if (ib) { ib.time = idleT % ib.getClip().duration; ib.setEffectiveWeight(1 - w); }
    mixer.update(0);
    for (const f of hooks) f(q);
  };
  /* once a frame however many passes draw it, and only while it is on screen (it is culled off screen); far off, fewer times a second */
  const cp = new THREE.Vector3();
  if (skinned) skinned.onBeforeRender = (r, sc, cam) => {
    const now = performance.now(), far = cam ? cam.getWorldPosition(cp).distanceTo(pos) : 0;
    if (now - last > (far > 70 ? 200 : far > 35 ? 66 : 4)) step(now);
  };
  g.userData.step = step; g.userData.mixer = mixer;
  step(performance.now()); prevYaw = null; last = 0;   /* posed now; where it is placed next does not count as walking */
  if (skinned) { skinned.computeBoundingSphere(); skinned.boundingSphere.radius *= 1.4; }   /* room for the walk and the head going down: culled only when truly off screen */
  return { g, ride, onStep: (f) => hooks.push(f) };
}

/* ---------- cattle: the small mixed island breed. coat: [top colour, belly colour, a second colour for a pied one or null], as the drawn
   cow kept them. pose: 'graze' (head down, eating), 'stand', or 'lie' (the pack has no lying clip, so a resting cow stands with its head
   low). About 1.25 m at the shoulder. ---------- */
export const COATS = [
  [0x7a4a30, 0x9a7050, null],
  [0x2e2622, 0x3a322c, null],
  [0xa8845a, 0xc8ac84, null],
  [0x6a3c28, 0xd8ccb4, 0xd8ccb4],
  [0x8a6a4a, 0xb89a74, null],
  [0x3a2c26, 0xcfc4ae, 0xcfc4ae],
];
const POSE = { graze: 'Eating', stand: 'Idle', lie: 'Idle_Headlow' };
export function cow(coat = COATS[0], pose = 'graze', seed = 1) {
  const [top, belly, pied] = coat;
  return beast('cow', { Main: top, Main_Light: pied || belly }, { idle: POSE[pose] || 'Idle', seed }).g;
}
export function bull(c = 0x2a2420, pose = 'stand', seed = 1) {
  return beast('bull', { Main: c, Main_Light: new THREE.Color(c).multiplyScalar(1.5).getHex() }, { idle: POSE[pose] || 'Idle', seed }).g;
}
/* ---------- a horse. c: the coat (bay by default); dark legs, mane and tail. opts.saddle: a riding saddle on a saddle cloth, with flaps,
   a girth, stirrup leathers and iron stirrups. opts.bridle: a headstall, cheek straps, a noseband, a bit and the reins hanging in a loop
   under the jaw (nobody holds them). opts.idle as any animal ('Idle_Headlow': resting, head low). Tack is made on the standing body, measured:
   back about 1.6 m up under the saddle, barrel about 0.26 m to a side and centred about 1.3 m up, the muzzle about 1.45 m forward and 1.7 m up. ---------- */
export function horse(c = 0x6a3c24, opts = {}) {
  const C = new THREE.Color(c), k = (f) => C.clone().multiplyScalar(f).getHex();
  const { g, ride } = beast('horse', { Main: c, Main_Light: k(1.35), Main_Dark: k(0.5), Hair: 0x1e1814, Muzzle: 0x241c18 }, { ...opts, idle: 'Idle' });   /* dressed standing */
  if (opts.saddle || opts.bridle) {
    const back = ride('Torso2'), head = ride('Head');
    g.userData.back = back; g.userData.head = head;
    if (back !== g) {
      if (opts.saddle) ridingSaddle(back);
      if (opts.bridle) bridle(head);
      bake(back); bake(head);
    }
  }
  g.userData.idle = opts.idle || 'Idle';
  return g;
}
function ridingSaddle(p) {
  const { mat, add, box, rod } = tack, Y = 1.3, X = 0.08;
  const leather = mat(0x5a3a22, 0.75), cloth = mat(0x2c3a52, 1, { side: THREE.DoubleSide }), seatM = mat(0x5a3a22, 0.75, { side: THREE.DoubleSide }), iron = mat(0x5a5c60, 0.5);
  const shell = (r, len, arc, m, x, sy) => { const ge = new THREE.CylinderGeometry(r, r, len, 18, 1, true, Math.PI / 2 - arc, arc * 2); ge.rotateZ(Math.PI / 2); const o = add(ge, m, x, Y, 0, p); o.scale.set(1, sy, 1); return o; };
  shell(0.275, 0.8, 1.2, cloth, X, 1.24);   /* the saddle cloth */
  shell(0.29, 0.54, 0.78, seatM, X, 1.24);   /* the seat */
  box(0.1, 0.1, 0.2, leather, X + 0.28, Y + 0.36, 0, p).rotation.z = -0.35;   /* the pommel */
  box(0.07, 0.13, 0.27, leather, X - 0.28, Y + 0.36, 0, p).rotation.z = 0.4;   /* the cantle */
  const girth = add(new THREE.TorusGeometry(0.27, 0.016, 5, 24), leather, X + 0.12, Y - 0.04, 0, p); girth.rotation.y = Math.PI / 2; girth.scale.set(1.04, 1.18, 1);
  for (const s of [-1, 1]) {
    box(0.36, 0.38, 0.02, leather, X + 0.02, Y + 0.06, s * 0.285, p);   /* a flap */
    rod([X + 0.05, Y + 0.25, s * 0.295], [X + 0.07, 0.96, s * 0.31], 0.012, leather, p);   /* the stirrup leather */
    add(new THREE.TorusGeometry(0.06, 0.009, 5, 12), iron, X + 0.07, 0.9, s * 0.31, p).rotation.y = Math.PI / 2;   /* the stirrup */
    box(0.12, 0.012, 0.05, iron, X + 0.07, 0.845, s * 0.31, p);   /* its tread */
  }
}
function bridle(head) {
  const { mat, add, rod, strap } = tack, leather = mat(0x3a2418, 0.8), steel = mat(0x8c8f93, 0.4);
  const ring = (r, at, tilt, arc = Math.PI * 2) => { const o = add(new THREE.TorusGeometry(r, 0.011, 5, 18, arc), leather, ...at, head); o.rotation.order = 'ZYX'; o.rotation.set(0, Math.PI / 2, tilt); return o; };
  const N = { r: 0.14, at: [1.45, 1.7, 0] }, P = { r: 0.155, at: [1.12, 1.85, 0] };
  ring(N.r, N.at, -0.62);   /* the noseband */
  ring(P.r, P.at, 0.5, Math.PI);   /* the headstall behind the ears */
  for (const s of [-1, 1]) {
    rod([P.at[0], P.at[1], s * P.r], [1.5, 1.64, s * 0.125], 0.009, leather, head);   /* a cheek strap down to the bit */
    add(new THREE.TorusGeometry(0.025, 0.006, 4, 10), steel, 1.5, 1.64, s * 0.128, head);   /* a bit ring */
  }
  strap([[1.5, 1.64, -0.13], [1.42, 1.38, -0.12], [1.32, 1.22, 0], [1.42, 1.38, 0.12], [1.5, 1.64, 0.13]], 0.009, leather, head);   /* the reins, hanging */
}

/* ---------- join the small pieces hung on an animal (a pack saddle, a halter, a harness) into one mesh per material, so a dressed animal
   costs a few draw calls, not dozens. Only the group's own meshes are joined; child groups (a lead rope that turns) are left alone. ---------- */
export function bake(group) {
  const by = new Map();
  for (const o of [...group.children]) {
    if (!o.isMesh || o.isSkinnedMesh) continue;
    o.updateMatrix();
    const g2 = o.geometry.clone().applyMatrix4(o.matrix);
    for (const k of Object.keys(g2.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g2.deleteAttribute(k);
    if (!g2.attributes.uv) g2.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g2.attributes.position.count * 2), 2));
    if (!by.has(o.material)) by.set(o.material, []);
    by.get(o.material).push(g2.index ? g2 : g2.toNonIndexed());
    o.removeFromParent();
  }
  for (const [m, list] of by) {
    const indexed = list.every((x) => x.index), geo = mergeGeometries(indexed ? list : list.map((x) => (x.index ? x.toNonIndexed() : x)));
    if (!geo) continue;
    const mesh = new THREE.Mesh(geo, m); mesh.castShadow = true; mesh.userData.noBatch = true; group.add(mesh);
  }
  return group;
}

/* ---------- small builders for the things animals wear (engine/mule.js, the horse's saddle and bridle below): materials shared by colour ---------- */
const TMATS = new Map();
const mat = (c, rough = 1, opts = {}) => { const key = c + ':' + rough + ':' + (opts.side || 0); return TMATS.get(key) || TMATS.set(key, new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: 0, ...opts })).get(key); };
const add = (geo, m, x, y, z, parent) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; parent.add(o); return o; };
const box = (w, h, d, m, x, y, z, p) => add(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
const rod = (a, b, r, m, p) => {   /* a round rod from point a to point b */
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = new THREE.Vector3().subVectors(B, A);
  const o = add(new THREE.CylinderGeometry(r, r, d.length(), 5), m, (A.x + B.x) / 2, (A.y + B.y) / 2, (A.z + B.z) / 2, p);
  o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); return o;
};
const strap = (pts, r, m, p) => add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q))), 28, r, 6, false), m, 0, 0, 0, p);
export const tack = { mat, add, box, rod, strap };
