/* engine/mule.js: one rigged, walking mule for every game (rule 10; owner, 27 November 2026: "we need a rigged model for the mule for all
   the games that use it"). It replaces the drawn, unrigged mule each game kept in its own props file, which slid along the road with its
   legs still.
     await loadMule();                       // once, before the places are built (the model is shared/models/mule.js)
     const m = mule(0x6a5644);               // a bay mule with a pack saddle, panniers and a halter, facing +x, hooves on y = 0
     const j = mule(0x8f8a80, { coat: 'grey', pack: false, halter: false });   // a grey jackass with nothing on
     mule(c, { pack: 'pad' })                // a blanket, pad and girth only, for a load of the game's own (in userData.back; the pad's top is 1.48 m up)
   The body is the Quaternius donkey ("Ultimate Animated Animal Pack", quaternius.com, CC0), smoothed and coloured here, scaled to a mule:
   about 2.0 m to the ear tips and 1.35 m at the withers, 2.3 m nose to rump (tools/animals/pack_animals.mjs packs it).
   It moves by itself. Each frame it is drawn, it measures how far it has gone (and turned) since the last frame: when it moves it plays its
   walk, one cycle per 1.5 m of ground (its stride, so the hooves do not slide), and when it stands it plays its idles. A film or a reveal
   only has to set its position and rotation, as before; a pause or a skip stops the legs with the body. A jump of more than 3 m in one frame
   (a film putting it back) does not count as walking.
   userData:
     back, head   groups that ride on the spine and the head. They line up with the mule's own space when it stands, so a load or a harness
                  made in mule coordinates goes in back (or head) and moves with the walk.
     slots        where three loads go, in back: in each pannier, and on top between the cross pieces.
     idle         the clip it plays standing: 'Idle' (the default; it changes now and then to 'Idle_2'), 'Idle_Headlow' or 'Eating'.
     stride, step, mixer, dip, tick: see engine/beasts.js, which loads, smooths and walks every animal; this file dresses the mule.
   If the model failed to load (the loader's "please reload" note shows), mule() returns an empty group so the place still builds. */
import * as THREE from 'three';
import { loadBeasts, beast, bake } from './beasts.js';
import { weaveTexture } from './produce.js';

export const loadMule = () => loadBeasts(['mule']);

/* coat colours by the model's material names. bay: a brown mule with a pale belly and muzzle, dark legs, mane and tail. grey: a grey donkey. */
function coat(c, kind) {
  const C = new THREE.Color(c), k = (f) => C.clone().multiplyScalar(f).getHex();
  return kind === 'grey'
    ? { Main: c, Main_Light: 0xd6d0c4, Main_Dark: k(0.55), Hair: 0x2a2622, Muzzle: 0x2a2420, Hooves: 0x24201c }
    : { Main: c, Main_Light: 0xa8947a, Main_Dark: k(0.55), Hair: 0x241c16, Muzzle: 0x2a221c, Hooves: 0x1c1714 };
}

const MATS = new Map();
const mat = (c, rough = 1, opts = {}) => { const key = c + ':' + rough + ':' + (opts.side || 0); return MATS.get(key) || MATS.set(key, new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: 0, ...opts })).get(key); };
const add = (geo, m, x, y, z, parent) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; parent.add(o); return o; };
const box = (w, h, d, m, x, y, z, p) => add(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
const rod = (a, b, r, m, p) => {   /* a round rod from point a to point b */
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = new THREE.Vector3().subVectors(B, A);
  const o = add(new THREE.CylinderGeometry(r, r, d.length(), 5), m, (A.x + B.x) / 2, (A.y + B.y) / 2, (A.z + B.z) / 2, p);
  o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); return o;
};
const strap = (pts, r, m, p) => add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q))), 28, r, 6, false), m, 0, 0, 0, p);

/* the pack saddle, in mule space: a blanket and a pad over the back, two crossed wooden frames joined by side bars, a girth, a breast strap and
   a strap behind, and two woven panniers hung from the frames by rope. Measured on the standing body: its back is about 1.45 m up, its
   barrel about 0.28 m to each side and centred about 1.11 m up. */
const BY = 1.11;
function packSaddle(p, pad = false) {   /* pad: only the blanket, pad, girth and straps, for a load of the game's own */
  const leather = mat(0x4a3020, 0.9), wood = mat(0x7a5a3c, 0.95), rope = mat(0xb8a070, 1);
  const shell = (r, len, arc, m, x, sy) => {
    const ge = new THREE.CylinderGeometry(r, r, len, 18, 1, true, Math.PI / 2 - arc, arc * 2);
    ge.rotateZ(Math.PI / 2); const o = add(ge, m, x, BY, 0, p); o.scale.set(1, sy, 1); return o;   /* the arc is centred on the spine */
  };
  shell(0.305, 0.84, 1.5, mat(0x9a3a2a, 1, { side: THREE.DoubleSide }), -0.1, 1.16);   /* the blanket */
  shell(0.318, 0.62, 1.15, mat(0xb8a070, 1, { side: THREE.DoubleSide }), -0.1, 1.15);   /* the pad */
  if (!pad) for (const x of [-0.35, 0.15]) for (const s of [-1, 1]) box(0.05, 0.44, 0.045, wood, x, BY + 0.47, s * 0.06, p).rotation.x = -s * 0.62;   /* the crossed frames */
  if (!pad) for (const s of [-1, 1]) box(0.6, 0.035, 0.09, wood, -0.1, BY + 0.32, s * 0.2, p).rotation.x = -s * 0.62;   /* side bars */
  const girth = add(new THREE.TorusGeometry(0.3, 0.013, 5, 24), leather, 0.04, BY, 0, p); girth.rotation.y = Math.PI / 2; girth.scale.set(1.04, 1.16, 1);
  const y = BY + 0.06;
  const side = (pts) => strap([...pts.map(([x, yy, z]) => [x, yy, -z]), ...pts.slice(0, -1).reverse()], 0.014, leather, p);   /* one strap round the body, the same both sides */
  side([[0.08, y, 0.3], [0.42, y, 0.3], [0.64, y - 0.02, 0.26], [0.78, y - 0.05, 0.16], [0.83, y - 0.06, 0]]);   /* the breast strap, round the chest */
  side([[0.08, y, 0.3], [-0.5, y, 0.3], [-0.72, y - 0.08, 0.22], [-0.81, y - 0.12, 0.1], [-0.83, y - 0.12, 0]]);   /* the strap behind, round the rump */
  if (pad) return;
  const wv = new THREE.MeshStandardMaterial({ map: weaveTexture(), roughness: 0.95 }), rim = mat(0x8a6428, 1), dark = mat(0x3a2a16, 1);
  for (const s of [-1, 1]) {
    const z = s * 0.55;
    add(new THREE.CylinderGeometry(0.23, 0.18, 0.44, 16), wv, -0.1, BY - 0.02, z, p);
    add(new THREE.TorusGeometry(0.23, 0.02, 5, 18), rim, -0.1, BY + 0.2, z, p).rotation.x = Math.PI / 2;
    add(new THREE.CircleGeometry(0.22, 16), dark, -0.1, BY + 0.185, z, p).rotation.x = -Math.PI / 2;
    for (const x of [-0.35, 0.15]) rod([x, BY + 0.6, -s * 0.1], [x < 0 ? -0.28 : 0.08, BY + 0.2, s * 0.4], 0.009, rope, p);
  }
}

/* the halter, in mule space with the head as it stands: a noseband round the muzzle, a strap behind the ears, a cheek strap each side, and a
   lead rope from under the chin that hangs straight down however the head moves */
function halter(head, B) {
  const leather = mat(0x4a3020, 0.9), rope = mat(0xb8a070, 1), steel = mat(0x8c8f93, 0.4);
  const ring = (r, at, tilt, arc = Math.PI * 2) => { const o = add(new THREE.TorusGeometry(r, 0.011, 5, 18, arc), leather, ...at, head); o.rotation.order = 'ZYX'; o.rotation.set(0, Math.PI / 2, tilt); return o; };
  ring(B.nose.r, B.nose.at, B.nose.tilt);
  ring(B.poll.r, B.poll.at, B.poll.tilt, Math.PI);
  for (const s of [-1, 1]) rod([B.poll.at[0], B.poll.at[1], s * B.poll.r], [B.nose.at[0], B.nose.at[1], s * B.nose.r], 0.009, leather, head);   /* the cheek straps */
  const lead = new THREE.Group(); lead.position.set(B.chin[0], B.chin[1], 0); head.add(lead);
  add(new THREE.TorusGeometry(0.02, 0.006, 4, 8), steel, 0, 0, 0, lead);
  add(new THREE.CylinderGeometry(0.011, 0.011, 0.55, 5), rope, 0, -0.28, 0, lead);
  return lead;
}
/* where the halter sits on this body (mule space, measured from the model's head) */
const HEAD = { nose: { r: 0.118, at: [1.38, 1.36, 0], tilt: -0.81 }, poll: { r: 0.145, at: [1.07, 1.62, 0], tilt: 0.35 }, chin: [1.3, 1.27] };

export function mule(c = 0x6a5644, opts = {}) {
  if (typeof opts === 'boolean') opts = { pack: opts };   /* the old mule(c, pack) */
  const { pack = true, halter: withHalter = true, coat: kind = 'bay' } = opts;
  const { g, ride, onStep } = beast('mule', coat(c, kind), opts);
  g.userData.slots = [[-0.1, 1.1, -0.55], [-0.1, 1.1, 0.55], [-0.1, 1.6, 0]];
  g.userData.dip = 0;
  const back = ride('Torso2'), head = ride('Head');
  g.userData.back = back; g.userData.head = head;
  if (back === g) return g;   /* the model did not load */
  if (pack) packSaddle(back, pack === 'pad');
  if (withHalter) {
    const lead = halter(head, HEAD), q2 = new THREE.Quaternion();
    onStep((q) => { lead.parent.getWorldQuaternion(q2); lead.quaternion.copy(q2.invert().multiply(q)); });   /* the rope hangs plumb */
  }
  bake(back); bake(head);   /* a few draw calls for the whole pack and halter */
  back.traverse((o) => (o.userData.noBatch = true)); head.traverse((o) => (o.userData.noBatch = true));
  return g;
}
export const loadedMule = () => mule();
