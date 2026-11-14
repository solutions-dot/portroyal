/* games/tivoli/src/weapons.js: rifles and pistols for Tivoli's security forces, May 2010 (the M16-type rifles with a carry handle seen in
   the Gleaner photographs). Tivoli only: engine/grip.js holds a thing in one hand and must not be changed here (owner's rule), so this file
   does the two-handed hold itself. No weapon is ever given to the player (CLAUDE.md rule 4, the Tivoli exception).

   arm(body, 'rifle' | 'pistol') gives a person a weapon; weaponTick(body) must run every frame AFTER the mixer and groundFeet.
   - rifle, during a rifle clip (RIFLE_CLIPS): the pistol grip is in the right hand and the handguard points at the left hand, so both hands
     are on it whatever the clip does; any other time it hangs slung across the back, muzzle up over the right shoulder.
   - pistol, during a pistol clip (PISTOL_CLIPS): in the right hand, pointing along the forearm; any other time it is in the holster (hidden).
   heldReport(body) measures how well the hands meet the weapon (?test=held). */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const RIFLE_CLIPS = /^(ShootRifle|ProneFire|ProneTurnR)$/, PISTOL_CLIPS = /^(ShootPistol|Gunplay|PeekAim)$/;   /* PeekAim holds a pistol: the hands are 13 to 22 cm apart and the arms stretched out (?test=measure) */
const MAT = new THREE.MeshStandardMaterial({ color: 0x1d1e1f, roughness: 0.55, metalness: 0.35 });
const SUPPORT = new THREE.Vector3(0, 0.062, 0.3);   /* the handguard's middle, in the rifle's own frame (origin: the right hand on the grip) */
const BUTT = new THREE.Vector3(0, 0.02, -0.33);      /* the middle of the butt plate, which sits in the shoulder pocket */
const EYE = new THREE.Vector3(0, 0.145, -0.135);    /* where the aiming eye sits: just above the line of the sights, a hand's width behind the rear sight */

function part(geo, x, y, z, rx = 0) { geo.rotateX(rx); geo.translate(x, y, z); return geo; }
const box = (w, h, l, x, y, z, rx) => part(new THREE.BoxGeometry(w, h, l), x, y, z, rx);
const tube = (r, l, x, y, z, seg = 10) => part(new THREE.CylinderGeometry(r, r, l, seg).rotateX(Math.PI / 2), x, y, z);
let RIFLE_GEO = null, PISTOL_GEO = null;
function rifleGeo() {   /* an M16A2, about 1 m: a side profile (stock, receiver, carry handle, pistol grip, trigger guard, curved magazine) extruded to 2.8 cm,
  with a round handguard, a triangular front sight, barrel and flash hider. +z is the muzzle, +y up; the origin is the middle of the pistol grip, where the right palm holds it.
  Butt plate 33 cm behind the grip, handguard from 12 to 42 cm ahead of it (measured clips: palm to shoulder 36 to 40 cm, palm to palm 31 to 34 cm). */
  if (RIFLE_GEO) return RIFLE_GEO;
  const P = [[-0.33, -0.045], [-0.12, 0.03], [-0.035, 0.03], [-0.055, -0.07], [-0.03, -0.078], [-0.005, 0.0], [0.0, -0.012], [0.055, -0.012], [0.062, 0.022],
    [0.072, 0.022], [0.125, 0.022], [0.135, 0.042], [0.135, 0.095], [0.105, 0.095], [0.1, 0.132], [-0.062, 0.132], [-0.072, 0.095],
    [-0.12, 0.092], [-0.33, 0.082]];   /* [z, y] round the outline */
  const sh = new THREE.Shape(); P.forEach(([z, y], k) => (k ? sh.lineTo(z, y) : sh.moveTo(z, y))); sh.closePath();
  const body = new THREE.ExtrudeGeometry(sh, { depth: 0.022, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 1, curveSegments: 1 });
  body.translate(0, 0, -0.011); body.rotateY(-Math.PI / 2);   /* the shape was drawn in x (here z) and y; turn it so the outline's x runs along +z */
  const sight = new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(0.43, 0.062), new THREE.Vector2(0.475, 0.062), new THREE.Vector2(0.462, 0.122), new THREE.Vector2(0.452, 0.122)]), { depth: 0.012, bevelEnabled: false });
  sight.translate(0, 0, -0.006); sight.rotateY(-Math.PI / 2);
  /* the magazine: a thin curved 30-round box (3.2 cm front to back, 1.9 cm wide, 14 cm long), swept forward at the bottom */
  const MP = [[0.074, 0.022], [0.108, 0.022], [0.113, -0.04], [0.121, -0.1], [0.131, -0.132], [0.099, -0.128], [0.09, -0.1], [0.082, -0.04]];
  const msh = new THREE.Shape(); MP.forEach(([z, y], k) => (k ? msh.lineTo(z, y) : msh.moveTo(z, y))); msh.closePath();
  const mag = new THREE.ExtrudeGeometry(msh, { depth: 0.016, bevelEnabled: true, bevelThickness: 0.0015, bevelSize: 0.0015, bevelSegments: 1 }); mag.translate(0, 0, -0.008); mag.rotateY(-Math.PI / 2);
  const g = mergeGeometries([body.toNonIndexed(), mag.toNonIndexed(), sight.toNonIndexed(), tube(0.024, 0.3, 0, 0.062, 0.27, 16).toNonIndexed(), tube(0.0085, 0.22, 0, 0.062, 0.53).toNonIndexed(), tube(0.011, 0.05, 0, 0.062, 0.655).toNonIndexed(), box(0.03, 0.006, 0.05, 0, 0.096, 0.02).toNonIndexed()]);
  g.computeVertexNormals(); return (RIFLE_GEO = g);
}
function pistolGeo() {   /* a black semi-automatic pistol: slide and frame, grip, trigger guard. Origin: the hand on the grip. */
  return PISTOL_GEO || (PISTOL_GEO = mergeGeometries([box(0.03, 0.034, 0.19, 0, 0.045, 0.06), box(0.028, 0.105, 0.05, 0, -0.01, -0.005, -0.25), box(0.008, 0.01, 0.04, 0, 0.012, 0.05)]));
}

/* ---------- closing the fingers round the weapon (the same method as engine/grip.js, which is not changed here) ----------
   Each finger joint turns about the axis across the palm; the thumb turns towards the index finger. The turned rotations are worked out once,
   when the weapon is given, and put back every frame while the weapon is in the hands (the shared clips do not move finger joints 2 and 3).
   Right hand: a fist round the pistol grip, the index finger curled less, on the trigger. Left hand: wrapped round the handguard (rifle) or round the shooting hand (pistol). */
const HOLD = { Right: { Index: [0.55, 0.75, 0.5], Middle: [1.0, 1.35, 0.9], Ring: [1.0, 1.35, 0.9], Pinky: [1.0, 1.35, 0.9], thumb: 0.7 },
  Left: { Index: [0.85, 1.1, 0.8], Middle: [0.9, 1.2, 0.85], Ring: [0.95, 1.25, 0.85], Pinky: [1.0, 1.3, 0.9], thumb: 0.6 } };
const wpos = (b) => b.getWorldPosition(new THREE.Vector3()), wquat = (o) => o.getWorldQuaternion(new THREE.Quaternion());
function turnWorld(b, axis, angle) { const pq = wquat(b.parent), r = new THREE.Quaternion().setFromAxisAngle(axis, angle); b.quaternion.premultiply(pq.clone().invert().multiply(r).multiply(pq)); b.updateMatrixWorld(true); }
function closeHand(body, side) {
  const B = (n) => bone(body, side + n), hand = B('Hand'), idx = B('HandIndex1'), mid = B('HandMiddle1'), pky = B('HandPinky1'), th = B('HandThumb2') || B('HandThumb1'); if (!hand || !idx || !mid || !pky) return [];
  const joints = []; for (const fn of ['Index', 'Middle', 'Ring', 'Pinky']) for (let j = 1; j <= 3; j++) { const b = B('Hand' + fn + j); if (b) joints.push(b); } for (let j = 1; j <= 3; j++) { const b = B('HandThumb' + j); if (b) joints.push(b); }
  const open = joints.map((b) => b.quaternion.clone()); body.updateMatrixWorld(true);
  const M = wpos(mid), f = M.clone().sub(wpos(hand)).normalize(), w = wpos(idx).sub(wpos(pky)).normalize(), n = new THREE.Vector3().crossVectors(w, f).normalize();
  if (th && n.dot(wpos(th).sub(M)) < 0) n.negate();   /* n points out of the palm */
  const axis = new THREE.Vector3().crossVectors(f, n).normalize(), H = HOLD[side];
  for (const fn of ['Index', 'Middle', 'Ring', 'Pinky']) H[fn].forEach((a, j) => { const b = B('Hand' + fn + (j + 1)); if (b) turnWorld(b, axis, a); });
  const t1 = B('HandThumb1'), t3 = B('HandThumb3'), i2 = B('HandIndex2');
  if (t1 && t3 && i2) { const td = wpos(t3).sub(wpos(t1)).normalize(), want = wpos(i2).sub(wpos(t1)).normalize(), ax = new THREE.Vector3().crossVectors(td, want); if (ax.lengthSq() > 1e-6) turnWorld(t1, ax.normalize(), Math.min(H.thumb, td.angleTo(want) * 0.8)); }
  const closed = joints.map((b) => b.quaternion.clone()); joints.forEach((b, i) => b.quaternion.copy(open[i])); body.updateMatrixWorld(true);
  return joints.map((b, i) => ({ b, open: open[i], closed: closed[i] }));
}
function setHands(body, w, shut) {
  if (w.shut === shut) { if (!shut) return; } w.shut = shut;
  for (const j of w.fingers) j.b.quaternion.copy(shut ? j.closed : j.open);
}

/* two-bone IK: turn the upper arm and forearm so the wrist reaches T, keeping the elbow on the side the clip had it (the same plane) */
function reach(body, side, T) {
  const A = bone(body, side + 'Arm'), B = bone(body, side + 'ForeArm'), C = bone(body, side + 'Hand'); if (!A || !B || !C) return;
  body.updateMatrixWorld(true); const a = wpos(A), b = wpos(B), c = wpos(C), lab = a.distanceTo(b), lcb = b.distanceTo(c), lat = Math.min(Math.max(a.distanceTo(T), 0.02), lab + lcb - 0.005);
  const ang = (u, v) => Math.acos(Math.max(-1, Math.min(1, u.clone().normalize().dot(v.clone().normalize()))));
  const acab = ang(c.clone().sub(a), b.clone().sub(a)), babc = ang(a.clone().sub(b), c.clone().sub(b));
  const acab1 = Math.acos(Math.max(-1, Math.min(1, (lcb * lcb - lab * lab - lat * lat) / (-2 * lab * lat)))), babc1 = Math.acos(Math.max(-1, Math.min(1, (lat * lat - lab * lab - lcb * lcb) / (-2 * lab * lcb))));
  let ax0 = new THREE.Vector3().crossVectors(c.clone().sub(a), b.clone().sub(a)); if (ax0.lengthSq() < 1e-10) return; ax0.normalize();
  turnWorld(A, ax0, acab1 - acab); turnWorld(B, ax0, babc1 - babc);
  const c2 = wpos(C), ax1 = new THREE.Vector3().crossVectors(c2.clone().sub(a), T.clone().sub(a)); if (ax1.lengthSq() > 1e-10) turnWorld(A, ax1.normalize(), ang(c2.clone().sub(a), T.clone().sub(a)));
}
/* turn a hand about its wrist so its palm faces dir (the palm's normal, as closeHand works it out) */
function palmTo(body, side, dir) {
  const B = (n) => bone(body, side + n), hand = B('Hand'), idx = B('HandIndex1'), mid = B('HandMiddle1'), pky = B('HandPinky1'), th = B('HandThumb2') || B('HandThumb1'); if (!hand || !idx || !mid || !pky) return;
  body.updateMatrixWorld(true); const M = wpos(mid), f = M.clone().sub(wpos(hand)).normalize(), w = wpos(idx).sub(wpos(pky)).normalize(), n = new THREE.Vector3().crossVectors(w, f).normalize();
  if (th && n.dot(wpos(th).sub(M)) < 0) n.negate();
  const ax = new THREE.Vector3().crossVectors(n, dir); if (ax.lengthSq() > 1e-8) turnWorld(hand, ax.normalize(), n.angleTo(dir));
}

/* Bones this file turns (arms, hands, neck, head) start each frame from the clip's pose. A clip that does not move a bone leaves our last turn
   in place, and turning it again would pile up frame after frame, so such a bone is first put back to how it was before we touched it. */
const ADJUST = ['RightHand', 'LeftHand', 'LeftArm', 'LeftForeArm', 'Neck', 'Head'];
function freshen(body, w) {
  w.base = w.base || new Map(); w.last = w.last || new Map();
  for (const n of ADJUST) { const b = bone(body, n); if (!b) continue; const l = w.last.get(b);
    if (l && b.quaternion.equals(l)) b.quaternion.copy(w.base.get(b)); else w.base.set(b, b.quaternion.clone()); }
}
function remember(body, w) { for (const n of ADJUST) { const b = bone(body, n); if (b) w.last.set(b, b.quaternion.clone()); } }

/* the rifle's direction from the shoulder pocket to the grip, but never pointing more than about 11 degrees above level (some clips lift the
   hands, and a rifle aimed at the sky reads badly) nor more than about 30 degrees below it: the grip stays in the palm and the butt gives a little at the shoulder */
const MAX_UP = 0.19, MAX_DOWN = 0.52;
function aimOf(R, pocket) {
  const d = R.clone().sub(pocket), flat = Math.hypot(d.x, d.z), e = Math.atan2(d.y, flat), e2 = Math.max(-MAX_DOWN, Math.min(MAX_UP, e));
  if (e2 !== e && flat > 1e-6) { const len = d.length(); d.set(d.x / flat * Math.cos(e2) * len, Math.sin(e2) * len, d.z / flat * Math.cos(e2) * len); }
  return d;
}

export const ARMED = [];
export function arm(body, kind = 'rifle', scene = body.parent) {
  const mesh = new THREE.Mesh(kind === 'pistol' ? pistolGeo() : rifleGeo(), MAT); mesh.castShadow = true; mesh.frustumCulled = false; mesh.matrixAutoUpdate = false;
  (scene || body).add(mesh); body.userData.anim && body.userData.anim.mx.update(0);
  const fingers = [...closeHand(body, 'Right'), ...closeHand(body, 'Left')];   /* the left hand wraps the handguard, or the shooting hand in the two-handed pistol clips */
  body.userData.weapon = { kind, mesh, fingers, shut: false }; ARMED.push(body); return mesh;
}
export function disarm(body) { const w = body.userData.weapon; if (!w) return; w.mesh.removeFromParent(); delete body.userData.weapon; const i = ARMED.indexOf(body); if (i >= 0) ARMED.splice(i, 1); }

const V = () => new THREE.Vector3(), _a = V(), _b = V(), _c = V(), _d = V(), _u = V(), _m = new THREE.Matrix4(), _l = new THREE.Matrix4(), _q = new THREE.Quaternion();
const bone = (body, n) => body.getObjectByName('mixamorig' + n);
function palm(body, side, out) {   /* the middle of the palm: between the wrist and the knuckle of the middle finger */
  const h = bone(body, side + 'Hand'), k = bone(body, side + 'HandMiddle1'); h.getWorldPosition(out); if (k) out.lerp(k.getWorldPosition(_c), 0.55); return out;
}
/* turn and place obj so that its own direction fl (with its own up near ul) lies along world f (up near u), with its origin at p */
function place(obj, p, f, u, fl, ul) {
  const z = f.clone().normalize(), y = u.clone().addScaledVector(z, -u.dot(z)).normalize(), x = new THREE.Vector3().crossVectors(y, z);
  const zl = fl.clone().normalize(), yl = ul.clone().addScaledVector(zl, -ul.dot(zl)).normalize(), xl = new THREE.Vector3().crossVectors(yl, zl);
  _m.makeBasis(x, y, z); _l.makeBasis(xl, yl, zl).invert(); _m.multiply(_l); _q.setFromRotationMatrix(_m);
  obj.matrix.compose(p, _q, obj.scale); obj.matrixWorldNeedsUpdate = true;
}
export function modeOf(body) {
  const w = body.userData.weapon, clip = body.userData.anim && body.userData.anim.cur.getClip().name; if (!w) return 'none';
  if (w.kind === 'rifle') return RIFLE_CLIPS.test(clip) ? 'hands' : 'slung';
  return PISTOL_CLIPS.test(clip) ? 'hands' : 'holster';
}
export function weaponTick(body) {
  const w = body.userData.weapon; if (!w) return; const mode = modeOf(body), m = w.mesh;
  freshen(body, w); setHands(body, w, mode === 'hands'); body.updateMatrixWorld(true);   /* fingers closed round the weapon while it is in the hands, relaxed otherwise */
  try { tickWeapon(body, w, mode, m); } finally { remember(body, w); }
}
function tickWeapon(body, w, mode, m) {
  m.visible = mode !== 'holster'; if (!m.visible) return;
  const up = _u.set(0, 1, 0);
  if (w.kind === 'rifle' && mode === 'hands') {
    /* grip in the right palm, butt in the right shoulder pocket (a little in front of, inside and below the shoulder joint) */
    let R = palm(body, 'Right', _a); const sR = wpos(bone(body, 'RightArm')), sL = wpos(bone(body, 'LeftArm')), inward = sL.clone().sub(sR).normalize();
    const bodyUp = wpos(bone(body, 'Neck')).sub(wpos(bone(body, 'Spine'))).normalize(), bodyFwd = new THREE.Vector3().crossVectors(inward, bodyUp).normalize();
    const pocket = sR.clone().addScaledVector(bodyFwd, 0.045).addScaledVector(inward, 0.035).addScaledVector(bodyUp, -0.025);
    place(m, R, aimOf(R, pocket), up, new THREE.Vector3(0, -BUTT.y, -BUTT.z), new THREE.Vector3(0, 1, 0)); m.updateMatrixWorld(true);
    /* right hand: palm against the side of the pistol grip, so the fist wraps it (the rifle's +x points from its right side to its left) */
    palmTo(body, 'Right', new THREE.Vector3(1, 0, 0).transformDirection(m.matrixWorld)); R = palm(body, 'Right', _a);
    place(m, R, aimOf(R, pocket), up, new THREE.Vector3(0, -BUTT.y, -BUTT.z), new THREE.Vector3(0, 1, 0)); m.updateMatrixWorld(true);
    /* left hand: under the handguard, where along it the clip put the hand (17 to 40 cm ahead of the grip), palm turned up to cradle it */
    const inv = new THREE.Matrix4().copy(m.matrixWorld).invert(), Lw = palm(body, 'Left', _b), Ll = Lw.clone().applyMatrix4(inv), z = Math.max(0.17, Math.min(0.4, Ll.z));
    const want = new THREE.Vector3(0, SUPPORT.y - 0.024 - 0.004, z).applyMatrix4(m.matrixWorld), rifleUp = new THREE.Vector3(0, 1, 0).transformDirection(m.matrixWorld);
    for (let k = 0; k < 2; k++) { palmTo(body, 'Left', rifleUp); const off = palm(body, 'Left', V()).sub(wpos(bone(body, 'LeftHand'))); reach(body, 'Left', want.clone().sub(off)); }
    palmTo(body, 'Left', rifleUp);
    /* cheek to the stock: tip the neck and head (at most about 25 degrees each) so the eye comes down behind the rear sight */
    const eyeWant = EYE.clone().applyMatrix4(m.matrixWorld);
    for (const [n, lim] of [['Neck', 0.3], ['Head', 0.45]]) { const hb = bone(body, n), hd = bone(body, 'Head'); if (!hb || !hd) continue; body.updateMatrixWorld(true);
      const piv = wpos(hb), eye = wpos(hd).addScaledVector(bodyUp, 0.075).addScaledVector(bodyFwd, 0.085).addScaledVector(inward, -0.032);   /* the right eye */
      const u = eye.clone().sub(piv), v = eyeWant.clone().sub(piv), ax = new THREE.Vector3().crossVectors(u, v); if (ax.lengthSq() > 1e-10) turnWorld(hb, ax.normalize(), Math.min(lim, u.angleTo(v)) * 0.5); }
    return;
  }
  if (w.kind === 'pistol') {
    const R = palm(body, 'Right', _a), f = _d.subVectors(bone(body, 'RightHand').getWorldPosition(_b), bone(body, 'RightForeArm').getWorldPosition(_c));
    place(m, R, f, up, new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0)); return;
  }
  /* slung across the back: muzzle up over the right shoulder, butt by the left hip, carry handle facing away from the back */
  const fwd = _c.set(0, 0, 1).applyQuaternion(body.getWorldQuaternion(_q)), back = fwd.clone().negate();
  const A = bone(body, 'RightShoulder').getWorldPosition(V()).addScaledVector(back, 0.2).addScaledVector(up, 0.1), B = bone(body, 'LeftUpLeg').getWorldPosition(V()).addScaledVector(back, 0.2);
  const f = A.clone().sub(B), mid = A.clone().add(B).multiplyScalar(0.5).addScaledVector(f.clone().normalize(), -0.15);
  place(m, mid, f, back, new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0));
}
/* how well the hands meet the weapon: the right palm on the grip (cm) and, for a rifle in the hands, the left palm on the handguard (cm) */
export function heldReport(body) {
  const w = body.userData.weapon, mode = modeOf(body), out = { mode, right: 0, left: 0, rightTip: 0, leftTip: 0 }; if (!w || mode !== 'hands') return out;
  weaponTick(body); w.mesh.updateMatrixWorld(true); const R = palm(body, 'Right', V()), L = palm(body, 'Left', V());
  out.right = R.distanceTo(V().setFromMatrixPosition(w.mesh.matrixWorld)) * 100;
  const inv = new THREE.Matrix4().copy(w.mesh.matrixWorld).invert(), tip = (side) => { const b = bone(body, side + 'HandMiddle3') || bone(body, side + 'HandMiddle2'); return b ? wpos(b).applyMatrix4(inv) : null; };
  const rt = tip('Right'); if (rt) out.rightTip = Math.max(0, Math.hypot(rt.x, rt.y + 0.018, rt.z + 0.012) - 0.045) * 100;   /* right fingertips to the pistol grip (a 4.5 cm ball round its middle) */
  if (w.kind === 'rifle') { const lt = tip('Left'); if (lt) { const z = Math.max(0.15, Math.min(0.45, lt.z)); out.leftTip = Math.max(0, Math.hypot(lt.x, lt.y - 0.062, lt.z - z) - 0.045) * 100; } }   /* left fingertips to the handguard */
  if (w.kind === 'rifle') {   /* the left palm to the handguard: a tube of radius 2.6 cm along the barrel line from 15 to 45 cm ahead of the grip */
    const p = L.clone().applyMatrix4(new THREE.Matrix4().copy(w.mesh.matrixWorld).invert()), z = Math.max(0.15, Math.min(0.45, p.z));
    out.left = Math.max(0, Math.hypot(p.x, p.y - 0.062, p.z - z) - 0.026) * 100; }
  return out;
}
