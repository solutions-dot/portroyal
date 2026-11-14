/* games/tivoli/src/talk.js: talking to people, for every walking chapter. One line at a time in the dialogue box (the HTML is in index.html); "You" lines get their own colour;
   the x, Escape or a tap outside ends the talk. The first talk tells the story; after that each person says one short line from their "later" list, in turn (docs/CONTENT.md).
   A line may carry unlock: 'page-id', which opens a journal page with a chime and a toast. Nobody here is real: every person you can talk to is fictional. */
import * as THREE from 'three';
import { animate } from '../../../engine/anim.js';
import { loadBase, makeBody, LOOKS } from './cast.js';

export const Talk = { npcs: [], near: null, open: null };
let E = null, step = 0, lines = [];
const $ = (id) => document.getElementById(id), ray = new THREE.Raycaster(), ndc = new THREE.Vector2();

/* env: { scene, camera, uiSound, setBusy(bool), onUnlock(id), onTalked(npc) } */
export function setupTalk(env) { E = env; $('next').onclick = next; $('dclose').onclick = leave; $('talk').onclick = () => { if (Talk.near && !Talk.open) start(Talk.near); }; }

export async function addNpc(def) {   /* def: { id, name, look, x, z, ry, anim, lines, later } */
  await loadBase(LOOKS[def.look].base); const body = makeBody({ ...LOOKS[def.look], x: def.x, z: def.z, ry: def.ry, anim: def.anim || 'Idle' });
  body.traverse((o) => { if (o.isMesh) o.castShadow = true; }); E.scene.add(body); const npc = { ...def, body, home: def.ry, talked: 0 }; Talk.npcs.push(npc); return npc;
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
}
export function start(npc) {
  Talk.open = npc; E.setBusy(true); E.uiSound('tap'); step = 0; $('talk').hidden = true; $('dialogue').hidden = false;
  lines = npc.talked === 0 ? npc.lines : [{ who: npc.name, text: npc.later[(npc.talked - 1) % npc.later.length] }];
  if (npc.body.userData.anim) npc.body.userData.anim.play('Talk1'); show();
}
function show() { const s = lines[step], me = s.who === 'You'; $('who').textContent = s.who; $('line').textContent = s.text; $('dialogue').classList.toggle('me', me); $('next').focus(); if (s.unlock && E.onUnlock) E.onUnlock(s.unlock); }
export function next() { if (!Talk.open) return; E.uiSound('tap'); step++; if (step >= lines.length) { end(true); return; } show(); }
function end(finished) { const n = Talk.open; $('dialogue').hidden = true; Talk.open = null; E.setBusy(false); if (n.body.userData.anim) n.body.userData.anim.rest(); if (finished) { n.talked++; if (E.onTalked) E.onTalked(n); } }
export function leave() { if (Talk.open) end(false); }
export const talking = () => !!Talk.open;
