/* games/tivoli/src/talk.js: talking to people, for every walking chapter. One line at a time in the dialogue box (the HTML is in index.html); "You" lines get their own colour;
   the x, Escape or a tap outside ends the talk. The first talk tells the story; after that each person says one short line from their "later" list, in turn (docs/CONTENT.md).
   A line may carry unlock: 'page-id', which opens a journal page with a chime and a toast. Nobody here is real: every person you can talk to is fictional. */
import * as THREE from 'three';
import { animate } from '../../../engine/anim.js';
import { loadBase, makeBody, LOOKS } from './cast.js';

export const Talk = { npcs: [], near: null, open: null };
/* What the story people do while you are not talking to them, and how they talk (owner, 16 November 2026: no "zombies standing around").
   Each has a few idles that fit them, changed every few seconds at their own pace (the clips start at random times, so nobody moves in step); in a sad or calm
   chapter the idles are quieter. While talking they gesture with a talk clip that changes with each line (men and women have their own), and nod while you speak.
   Their head turns toward you when you come near (after the mixer, eased, at most about 60 degrees). */
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
const $ = (id) => document.getElementById(id), ray = new THREE.Raycaster(), ndc = new THREE.Vector2();

/* env: { scene, camera, uiSound, setBusy(bool), onUnlock(id), onTalked(npc) } */
export function setupTalk(env) { E = env; $('next').onclick = next; $('dclose').onclick = leave; $('talk').onclick = () => { if (Talk.near && !Talk.open) start(Talk.near); }; }

export async function addNpc(def) {   /* def: { id, name, look, x, z, ry, anim, lines, later } */
  await loadBase(LOOKS[def.look].base); const body = makeBody({ ...LOOKS[def.look], x: def.x, z: def.z, ry: def.ry, anim: def.anim || 'Idle' });
  body.userData.ground = def.ground || 0;   /* the height of the surface they stand on (a pavement, a path), so groundFeet keeps their shoes on it */
  body.traverse((o) => { if (o.isMesh) o.castShadow = true; }); E.scene.add(body); const npc = { ...def, body, home: def.ry, talked: 0, sex: SEX[def.look] || 'f', headYaw: 0 };
  npc.idles = (def.mood && MOOD_IDLES[def.mood] && def.look !== 'ivyGirl') ? MOOD_IDLES[def.mood] : (IDLES[def.look] || ['Idle']); npc.idleT = Math.random() * 3; Talk.npcs.push(npc); return npc;
}
export function clearNpcs() { for (const n of Talk.npcs) E.scene.remove(n.body); Talk.npcs.length = 0; Talk.near = null; Talk.open = null; $('dialogue').hidden = true; $('talk').hidden = true; E.setBusy(false); }

export function tapNpc(cx, cy, player) {   /* a tap (not a drag) on someone close enough */
  ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, E.camera);
  for (const n of Talk.npcs) if (Math.hypot(player.x - n.x, player.z - n.z) < 5 && ray.intersectObject(n.body, true).length) return n; return null;
}
export function updateTalk(dt, player, active) {   /* who is near; turn people to face you */
  let best = null, bd = 2.8; for (const n of Talk.npcs) { const d = Math.hypot(player.x - n.x, player.z - n.z); if (d < bd) { bd = d; best = n; } }
  Talk.near = active && !Talk.open ? best : (Talk.open || null);
  for (const n of Talk.npcs) { const face = n === Talk.near || n === Talk.open; let want = face ? Math.atan2(player.x - n.x, player.z - n.z) : n.home, e = want - n.body.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); n.body.rotation.y += e * Math.min(1, dt * 5); }
  const b = $('talk'); if (active && Talk.near && !Talk.open) { b.hidden = false; b.textContent = 'Talk to ' + Talk.near.name; } else if (!Talk.open) b.hidden = true;
  for (const n of Talk.npcs) if (n !== Talk.open && (n.idleT -= dt) <= 0) idleNext(n);   /* a new idle every few seconds */
}
/* after the mixer: heads turn toward you when you are near and in front of them */
const UP = new THREE.Vector3(0, 1, 0), _q = new THREE.Quaternion(), _p = new THREE.Quaternion();
function turnBone(b, a) { if (!b || !a) return; b.parent.getWorldQuaternion(_p); _q.setFromAxisAngle(UP, a); b.quaternion.premultiply(_p.clone().invert().multiply(_q).multiply(_p)); }
export function after(dt, player) {
  for (const n of Talk.npcs) {
    const d = Math.hypot(player.x - n.x, player.z - n.z); let want = 0;
    if (d < 6 && n !== Talk.open) { const e = Math.atan2(Math.sin(Math.atan2(player.x - n.x, player.z - n.z) - n.body.rotation.y), Math.cos(Math.atan2(player.x - n.x, player.z - n.z) - n.body.rotation.y)); if (Math.abs(e) < 1.9) want = Math.max(-1.05, Math.min(1.05, e)); }
    n.headYaw += (want - n.headYaw) * Math.min(1, dt * 3); if (Math.abs(n.headYaw) < 0.01) continue;
    n.body.updateMatrixWorld(true); turnBone(n.body.getObjectByName('mixamorigNeck'), n.headYaw * 0.4); n.body.updateMatrixWorld(true); turnBone(n.body.getObjectByName('mixamorigHead'), n.headYaw * 0.6);
  }
}
export function start(npc) {
  Talk.open = npc; E.setBusy(true); E.uiSound('tap'); step = 0; $('talk').hidden = true; $('dialogue').hidden = false;
  lines = npc.talked === 0 ? npc.lines : [{ who: npc.name, text: npc.later[(npc.talked - 1) % npc.later.length] }];
  show();
}
function gesture(npc, me) {   /* a talk clip that changes with each line; while you speak, they listen (an idle, now and then a nod) */
  const c = npc.body.userData.anim; if (!c) return; const l = (me ? ['Nod', 'Agree', npc.idles[0]] : npc.mood === 'sad' ? SAD_TALKS : TALKS[npc.sex]).filter((x) => has(npc, x));
  if (l.length) c.play(me && Math.random() < 0.5 ? npc.idles.find((x) => has(npc, x)) || l[0] : l[(Math.random() * l.length) | 0]);
}
function show() { const s = lines[step], me = s.who === 'You'; gesture(Talk.open, me); $('who').textContent = s.who; $('line').textContent = s.text; $('dialogue').classList.toggle('me', me); $('next').focus(); if (s.unlock && E.onUnlock) E.onUnlock(s.unlock); }
export function next() { if (!Talk.open) return; E.uiSound('tap'); step++; if (step >= lines.length) { end(true); return; } show(); }
function end(finished) { const n = Talk.open; $('dialogue').hidden = true; Talk.open = null; E.setBusy(false); n.idleT = 0; if (finished) { n.talked++; if (E.onTalked) E.onTalked(n); } }
export function leave() { if (Talk.open) end(false); }
export const talking = () => !!Talk.open;
