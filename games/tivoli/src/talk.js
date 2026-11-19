/* games/tivoli/src/talk.js: talking to people, for every walking chapter. One line at a time in the dialogue box (the HTML is in index.html); "You" lines get their own colour;
   the x, Escape or a tap outside ends the talk. The first talk tells the story; after that each person says one short line from their "later" list, in turn (docs/CONTENT.md).
   A line may carry unlock: 'page-id', which opens a journal page with a chime and a toast. Nobody here is real: every person you can talk to is fictional. */
import * as THREE from 'three';
import { animate, lookBegin, lookEnd } from '../../../engine/anim.js';
import { loadBase, makeBody, bodyOf, LOOKS } from './cast.js';
import { pickPerson } from '../../../engine/tap.js';   /* tap a person to talk to them */

export const Talk = { npcs: [], near: null, open: null };
/* What the story people do while you are not talking to them, and how they talk (owner, 16 November 2026: no "zombies standing around").
   Each has a few idles that fit them, changed every few seconds at their own pace (the clips start at random times, so nobody moves in step); in a sad or calm
   chapter the idles are quieter. While talking they gesture with a talk clip that changes with each line (men and women have their own), and nod while you speak.
   Their head turns toward you when you come near (after the mixer, eased, at most 70 degrees from the chest and about 150 degrees a second).
   Their body turns to face you the short way round, at most 200 degrees a second (Kendal's turn limit). */
const SEX = { ivyGirl: 'f', pearl: 'f', ivyGran: 'f', dawn: 'f', ivyMum: 'f', kemesha: 'f', roy: 'm', clarke: 'm', brown: 'm', pastor: 'm', coach: 'm', andre: 'm' };
const IDLES = {
  ivyGirl: ['HappyIdle', 'Idle', 'LookAround'], kemesha: ['HappyIdle', 'Idle', 'LookAround'], pearl: ['OldIdle', 'Idle', 'WipeSweat'], roy: ['OldIdle', 'IdleM', 'LookAround'],
  clarke: ['IdleM', 'Idle', 'LookAround'], ivyGran: ['Idle', 'OldIdle', 'LookAround'], ivyMum: ['HappyIdle', 'Idle', 'LookAround'], dawn: ['Idle', 'LookAround', 'WipeSweat'],
  brown: ['IdleM', 'Idle', 'LookAround'], pastor: ['IdleM', 'Idle'], coach: ['IdleM', 'HappyIdle', 'LookAround'], andre: ['IdleM', 'LookAround', 'WipeSweat'],
};
const MOOD_IDLES = { sad: ['Sad1', 'Sad2', 'Idle'], calm: ['Idle', 'LookAround', 'HeadTurn'] };
const TALKS = { f: ['Talk1', 'Talk2', 'Talk3'], m: ['TalkM1', 'TalkM2', 'Talk2'] }, SAD_TALKS = ['Talk3', 'Talk2'];
const has = (n, c) => !!(n.body.userData.anim && n.body.userData.anim.get(c));
function idleNext(n) { const l = n.idles.filter((c) => has(n, c)); if (!l.length) return; n.iv = (n.iv === undefined ? (Math.random() * l.length) | 0 : n.iv + 1) % l.length; n.body.userData.anim.play(l[n.iv]); n.idleT = 5 + Math.random() * 6; }
let E = null, step = 0, lines = [];
const $ = (id) => document.getElementById(id);

/* env: { scene, camera, uiSound, setBusy(bool), onUnlock(id), onTalked(npc) } */
export function setupTalk(env) { E = env; $('next').onclick = next; $('dclose').onclick = leave; }

export async function addNpc(def) {   /* def: { id, name, look, x, z, ry, anim, lines, later } */
  await loadBase(bodyOf(LOOKS[def.look])); const body = makeBody({ ...LOOKS[def.look], x: def.x, z: def.z, ry: def.ry, anim: def.anim || 'Idle' });
  body.userData.ground = def.ground || 0;   /* the height of the surface they stand on (a pavement, a path), so groundFeet keeps their shoes on it */
  body.traverse((o) => { if (o.isMesh) o.castShadow = true; }); E.scene.add(body); const npc = { ...def, body, home: def.ry, talked: 0, sex: SEX[def.look] || 'f', headYaw: 0 };
  npc.idles = (def.mood && MOOD_IDLES[def.mood] && def.look !== 'ivyGirl') ? MOOD_IDLES[def.mood] : (IDLES[def.look] || ['Idle']); npc.idleT = Math.random() * 3; Talk.npcs.push(npc); return npc;
}
export function clearNpcs() { for (const n of Talk.npcs) { E.scene.remove(n.body); if (n.mark) E.scene.remove(n.mark); } Talk.npcs.length = 0; Talk.near = null; Talk.open = null; $('dialogue').hidden = true; document.body.classList.remove('talking'); $('talk').hidden = true; E.setBusy(false); }

export const TALK_R = 2.8;   /* how near you must be to talk: the talk button and a tap on a person use the same reach */
export function tapNpc(cx, cy, player, headY) {   /* a tap (not a drag) on someone close enough (engine/tap.js: by the feet-to-head band on the screen, no ray through the body) */
  return pickPerson(E.camera, Talk.npcs.map((n) => ({ obj: n.body, data: n, h: headY ? Math.max(1, headY(n) - n.body.position.y) : undefined })), cx, cy, { near: [player.x, player.z], maxDist: TALK_R });
}
export function updateTalk(dt, player, active) {   /* who is near; turn people to face you */
  let best = null, bd = TALK_R; for (const n of Talk.npcs) { const d = Math.hypot(player.x - n.x, player.z - n.z); if (d < bd) { bd = d; best = n; } }
  Talk.near = active && !Talk.open ? best : (Talk.open || null);
  for (const n of Talk.npcs) { const face = n === Talk.near || n === Talk.open; let want = face ? Math.atan2(player.x - n.x, player.z - n.z) : n.home, e = want - n.body.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e));
    const lim = TURN_RATE * dt; n.body.rotation.y = wrap(n.body.rotation.y + Math.max(-lim, Math.min(lim, e * Math.min(1, dt * 5)))); }   /* the short way round, never faster than a person turns, and the angle kept in -PI..PI */
  for (const n of Talk.npcs) if (n !== Talk.open && (n.idleT -= dt) <= 0) idleNext(n);   /* a new idle every few seconds */
}
/* after the mixer: heads turn toward you when you are near and in front of them.
   The head spun round (owner, 17 November 2026): the mixer writes a bone only when its clip value changes, and a clip whose neck and head tracks
   stay still (Idle, OldIdle) writes them once, so each frame's turn was added to the last and the head went round and round. Now each frame starts
   from the clip's own pose again (the same fix as engine/ambient.js and Kendal's storylife.js), the turn is at most HEAD_MAX from the chest and moves
   at most HEAD_RATE a second. ?test=heads (and the "heads" part of ?test=all) samples every person over time and reports a head past the limit or a fast turn. */
export const HEAD_MAX = 70 * Math.PI / 180, HEAD_RATE = 2.6, TURN_RATE = 3.5;
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const UP = new THREE.Vector3(0, 1, 0), _q = new THREE.Quaternion(), _p = new THREE.Quaternion(), _ax = new THREE.Vector3();
function turnBone(b, axis, a) { if (!b || !b.parent || Math.abs(a) < 1e-4) return; b.parent.updateWorldMatrix(true, false); b.parent.getWorldQuaternion(_p); _q.setFromAxisAngle(axis, a); b.quaternion.premultiply(_p.clone().invert().multiply(_q).multiply(_p)); }
/* how far the clip itself turns the head from the chest (radians, + to the body's left as a turn about UP): the head's forward against the chest's,
   from each bone's own axes in the bind pose (the way engine/audit.js headAngles measures it) */
const AXES = new WeakMap(), _f = new THREE.Vector3(), _u = new THREE.Vector3(), _r = new THREE.Vector3(), _h = new THREE.Vector3(), _w = new THREE.Quaternion();
function clipYaw(m) {
  let a = AXES.get(m); if (a === undefined) { let s = null; m.traverse((o) => { if (!s && o.isSkinnedMesh) s = o.skeleton; });
    const get = (name) => { if (!s) return null; const i = s.bones.findIndex((x) => x.name === 'mixamorig' + name); if (i < 0) return null; const q = new THREE.Quaternion(); new THREE.Matrix4().copy(s.boneInverses[i]).invert().decompose(new THREE.Vector3(), q, new THREE.Vector3()); q.invert(); return { bone: s.bones[i], f: new THREE.Vector3(0, 0, 1).applyQuaternion(q), u: new THREE.Vector3(0, 1, 0).applyQuaternion(q) }; };
    a = { chest: get('Spine2'), head: get('Head') }; if (!a.chest || !a.head) a = null; AXES.set(m, a); }
  if (!a) return null; m.updateMatrixWorld(true);
  a.chest.bone.getWorldQuaternion(_w); _f.copy(a.chest.f).applyQuaternion(_w); _u.copy(a.chest.u).applyQuaternion(_w); _r.crossVectors(_u, _f);
  a.head.bone.getWorldQuaternion(_w); _h.copy(a.head.f).applyQuaternion(_w); return Math.atan2(_h.dot(_r), _h.dot(_f));
}
export function after(dt, player) {
  for (const n of Talk.npcs) {
    const m = n.body, d = Math.hypot(player.x - n.x, player.z - n.z); let want = 0;
    if (n === Talk.open || (d < 6 && n !== Talk.open)) { const e = wrap(Math.atan2(player.x - n.x, player.z - n.z) - m.rotation.y); if (Math.abs(e) < 1.9) want = Math.max(-HEAD_MAX, Math.min(HEAD_MAX, e)); }
    if (!Number.isFinite(n.headYaw)) n.headYaw = 0; const lim = HEAD_RATE * dt; n.headYaw += Math.max(-lim, Math.min(lim, (want - n.headYaw) * Math.min(1, dt * 3)));
    const b = n.bones || (n.bones = { neck: m.getObjectByName('mixamorigNeck'), head: m.getObjectByName('mixamorigHead') });
    const hq = n.hq || (n.hq = [b.neck, b.head].map(() => ({ base: new THREE.Quaternion(), after: new THREE.Quaternion(10, 0, 0, 0) })));
    lookBegin([b.neck, b.head]);   /* start from the clip's own pose (engine/anim.js) */   /* start from the clip's pose */
    /* the clip may already turn the head (LookAround): add only what keeps the whole turn inside HEAD_MAX */
    let add = n.headYaw; if (Math.abs(add) > 1e-3) { const c = clipYaw(m); if (c !== null) add = add > 0 ? Math.min(add, Math.max(0, HEAD_MAX - c)) : Math.max(add, Math.min(0, -HEAD_MAX - c)); }
    turnBone(b.neck, UP, add * 0.4); turnBone(b.head, UP, add * 0.6);
    lookEnd([b.neck, b.head]);
  }
}
export function start(npc) {
  Talk.open = npc; E.setBusy(true); E.uiSound('tap'); step = 0; $('talk').hidden = true; $('dialogue').hidden = false; document.body.classList.add('talking');
  lines = npc.talked === 0 ? npc.lines : [{ who: npc.name, text: npc.later[(npc.talked - 1) % npc.later.length] }];
  show();
}
function gesture(npc, me) {   /* a talk clip that changes with each line; while you speak, they listen (an idle, now and then a nod) */
  const c = npc.body.userData.anim; if (!c) return; const l = (me ? ['Nod', 'Agree', npc.idles[0]] : npc.mood === 'sad' ? SAD_TALKS : TALKS[npc.sex]).filter((x) => has(npc, x));
  if (l.length) c.play(me && Math.random() < 0.5 ? npc.idles.find((x) => has(npc, x)) || l[0] : l[(Math.random() * l.length) | 0]);
}
function show() { const s = lines[step], me = s.who === 'You'; gesture(Talk.open, me); $('who').textContent = s.who; $('line').textContent = s.text; $('dialogue').classList.toggle('me', me); $('next').focus(); if (s.unlock && E.onUnlock) E.onUnlock(s.unlock); }
export function next() { if (!Talk.open) return; E.uiSound('tap'); step++; if (step >= lines.length) { end(true); return; } show(); }
function end(finished) { const n = Talk.open; $('dialogue').hidden = true; document.body.classList.remove('talking'); Talk.open = null; E.setBusy(false); n.idleT = 0; if (finished) { n.talked++; if (E.onTalked) E.onTalked(n); } if (E.onClose) E.onClose(); }
export function leave() { if (Talk.open) end(false); }
export const talking = () => !!Talk.open;
