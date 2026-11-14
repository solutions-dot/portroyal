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

export const ARMED = [];
export function arm(body, kind = 'rifle', scene = body.parent) {
  const mesh = new THREE.Mesh(kind === 'pistol' ? pistolGeo() : rifleGeo(), MAT); mesh.castShadow = true; mesh.frustumCulled = false; mesh.matrixAutoUpdate = false;
  (scene || body).add(mesh); body.userData.weapon = { kind, mesh }; ARMED.push(body); return mesh;
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
  const w = body.userData.weapon; if (!w) return; body.updateMatrixWorld(true); const mode = modeOf(body), m = w.mesh;
  m.visible = mode !== 'holster'; if (!m.visible) return;
  const up = _u.set(0, 1, 0);
  if (w.kind === 'rifle' && mode === 'hands') {
    const R = palm(body, 'Right', _a), L = palm(body, 'Left', _b), d = _d.subVectors(L, R);
    if (d.length() > 0.12) { place(m, R, d, up, SUPPORT, new THREE.Vector3(0, 1, 0)); return; }   /* hands too close together to hold a rifle: sling it instead */
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
  const w = body.userData.weapon, mode = modeOf(body), out = { mode, right: 0, left: 0 }; if (!w || mode !== 'hands') return out;
  weaponTick(body); w.mesh.updateMatrixWorld(true); const R = palm(body, 'Right', V()), L = palm(body, 'Left', V());
  out.right = R.distanceTo(V().setFromMatrixPosition(w.mesh.matrixWorld)) * 100;
  if (w.kind === 'rifle') {   /* the left palm to the handguard: a tube of radius 2.6 cm along the barrel line from 15 to 45 cm ahead of the grip */
    const p = L.clone().applyMatrix4(new THREE.Matrix4().copy(w.mesh.matrixWorld).invert()), z = Math.max(0.15, Math.min(0.45, p.z));
    out.left = Math.max(0, Math.hypot(p.x, p.y - 0.062, p.z - z) - 0.026) * 100; }
  return out;
}
