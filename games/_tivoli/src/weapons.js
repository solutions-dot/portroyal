/* games/_tivoli/src/weapons.js: rifles and pistols for Tivoli's security forces, May 2010 (the M16-type rifles with a carry handle seen in
   the Gleaner photographs). Tivoli only: engine/grip.js holds a thing in one hand and must not be changed here (owner's rule), so this file
   does the two-handed hold itself. No weapon is ever given to the player (CLAUDE.md rule 4, the Tivoli exception).

   arm(body, 'rifle' | 'pistol') gives a person a weapon; weaponTick(body) must run every frame AFTER the mixer and groundFeet.
   - rifle, during a rifle clip (RIFLE_CLIPS): the pistol grip is in the right hand and the handguard points at the left hand, so both hands
     are on it whatever the clip does; any other time it hangs slung across the back, muzzle up over the right shoulder.
   - pistol, during a pistol clip (PISTOL_CLIPS): in the right hand, pointing along the forearm; any other time it is in the holster (hidden).
   heldReport(body) measures how well the hands meet the weapon (?test=held). */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const RIFLE_CLIPS = /^(ShootRifle|PeekAim|ProneFire|ProneTurnR)$/, PISTOL_CLIPS = /^(ShootPistol|Gunplay)$/;
const MAT = new THREE.MeshStandardMaterial({ color: 0x1d1e1f, roughness: 0.55, metalness: 0.35 });
const SUPPORT = new THREE.Vector3(0, 0.062, 0.3);   /* where the left hand holds the handguard, in the rifle's own frame (origin: the right hand on the grip) */

function part(geo, x, y, z, rx = 0) { geo.rotateX(rx); geo.translate(x, y, z); return geo; }
const box = (w, h, l, x, y, z, rx) => part(new THREE.BoxGeometry(w, h, l), x, y, z, rx);
const tube = (r, l, x, y, z, seg = 10) => part(new THREE.CylinderGeometry(r, r, l, seg).rotateX(Math.PI / 2), x, y, z);
let RIFLE_GEO = null, PISTOL_GEO = null;
function rifleGeo() {   /* about 1 m long: stock, receiver with carry handle, curved 30-round magazine, round handguard, triangular front sight, barrel, flash hider. +z is the muzzle, +y up. */
  return RIFLE_GEO || (RIFLE_GEO = mergeGeometries([
    box(0.034, 0.072, 0.24, 0, 0.055, -0.22), box(0.04, 0.11, 0.02, 0, 0.04, -0.345),            // stock and butt plate
    box(0.03, 0.068, 0.25, 0, 0.068, 0.02),                                                        // receiver
    box(0.018, 0.03, 0.15, 0, 0.12, 0.03), box(0.02, 0.03, 0.025, 0, 0.13, -0.04),                 // carry handle and rear sight
    box(0.026, 0.085, 0.036, 0, -0.018, -0.012, -0.32),                                             // pistol grip
    box(0.022, 0.16, 0.052, 0, -0.035, 0.1, 0.2),                                                   // magazine, raked forward
    box(0.008, 0.012, 0.05, 0, 0.026, 0.0),                                                         // trigger guard
    tube(0.026, 0.3, 0, 0.062, 0.3, 12),                                                            // handguard
    tube(0.008, 0.2, 0, 0.062, 0.54), box(0.012, 0.055, 0.016, 0, 0.095, 0.5), box(0.02, 0.012, 0.03, 0, 0.07, 0.5),   // barrel, front sight post and base
    tube(0.011, 0.05, 0, 0.062, 0.66),                                                              // flash hider
  ]));
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
  setHands(body, w, mode === 'hands'); body.updateMatrixWorld(true);   /* fingers closed round the weapon while it is in the hands, relaxed otherwise */
  m.visible = mode !== 'holster'; if (!m.visible) return;
  const up = _u.set(0, 1, 0);
  if (w.kind === 'rifle' && mode === 'hands') {
    const R = palm(body, 'Right', _a), L = palm(body, 'Left', _b), d = _d.subVectors(L, R);
    if (d.length() > 0.12) {   /* the left palm goes on the handguard line at whatever distance the clip puts it (15 to 45 cm ahead of the grip); hands closer than 12 cm: sling it instead */
      const D = d.length(), z = Math.max(0.15, Math.min(0.45, Math.sqrt(Math.max(0, D * D - SUPPORT.y * SUPPORT.y))));
      place(m, R, d, up, new THREE.Vector3(0, SUPPORT.y, z), new THREE.Vector3(0, 1, 0)); return; }
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
