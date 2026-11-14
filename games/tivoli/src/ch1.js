/* games/tivoli/src/ch1.js: chapter 1, Back-o-Wall. You walk through the memory of Ivy, a girl in Back-o-Wall about 1963 (in 2010 she is the grandmother). You talk to Ivy in her yard,
   to her gran, and to a neighbour in the lane, then walk to the end of the lane. Everyone is fictional and the place is imagined (backowall.js); the journal says so.
   Nothing frightening is shown: the chapter ends with a card, not with the clearing itself. Facts: docs/games/tivoli.md "Back-o-Wall and the clearance". */
import * as THREE from 'three';
import { buildBackOWall } from './backowall.js';
import { addNpc, clearNpcs, Talk } from './talk.js';
import { CH1 } from './content.js';
import { unlock, finishChapter } from './story.js';
import { FX } from './fx.js';

export const CH = { on: false, talked: {}, ended: false };
const $ = (id) => document.getElementById(id), ORDER = ['ivy', 'pearl', 'roy'];
let E = null, saved = null;

export function setupCh1(env) { E = env; $('chdone').onclick = leaveChapter; }
const goalNow = () => { const i = ORDER.findIndex((id) => !CH.talked[id]); return CH1.goals[i < 0 ? 3 : i]; };

export async function begin() {
  const { scene, state, WALLS, renderer } = E; E.audioInit(); $('title').hidden = true; $('fightload').firstElementChild.textContent = 'Loading Back-o-Wall.'; $('fightload').hidden = false;
  const shadows = !matchMedia('(pointer: coarse)').matches, pl = buildBackOWall({ shadows });
  saved = { hidden: scene.children.filter((c) => c.visible && !c.isLight), fog: scene.fog, bg: scene.background, lights: scene.children.filter((c) => c.isLight).map((l) => [l, l.intensity]), shadow: renderer.shadowMap.enabled, wasWalls: WALLS.slice() };
  saved.hidden.forEach((c) => (c.visible = false)); saved.lights.forEach(([l]) => (l.intensity = l.isDirectionalLight ? 0 : 1.9));
  scene.background = new THREE.Color(0xdbe6ea); scene.fog = new THREE.Fog(0xcfdde4, 30, 190); if (shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
  scene.add(pl.group); CH.place = pl; WALLS.length = 0; WALLS.push(...pl.walls);
  CH.talked = {}; CH.ended = false;
  for (const n of pl.npcs) await addNpc({ ...n, lines: CH1.talk[n.id], later: CH1.later[n.id] });
  $('fightload').hidden = true;
  state.x = pl.start.x; state.z = pl.start.z; state.yaw = pl.start.yaw; state.pitch = 0; state.camY = 1.3; state.started = true; E.setBusy(false);
  $('hud').hidden = false; E.setGoal(goalNow());
  const t = $('scenetitle'); t.replaceChildren(); const b = document.createElement('b'); b.textContent = CH1.start[0]; t.append(b); for (const l of CH1.start.slice(1)) { const p = document.createElement('p'); p.textContent = l; t.append(p); }
  t.hidden = false; setTimeout(() => { t.hidden = true; }, 5200);
  CH.on = true;
}
export function onTalked(npc) {   /* each finished talk moves the goal on */
  CH.talked[npc.id] = true; E.setGoal(goalNow()); E.uiSound('goal');
}
export function tick(dt) {
  if (!CH.on || CH.ended || Talk.open) return; const { state } = E, e = CH.place.endSpot;
  if (ORDER.every((id) => CH.talked[id]) && Math.hypot(state.x - e.x, state.z - e.z) < e.r) endChapter();
}
function endChapter() {
  CH.ended = true; E.setBusy(true); finishChapter(1); E.uiSound('goal');
  const c = $('chcard'); $('chcardt').textContent = CH1.end.title; $('chcardl').replaceChildren(...CH1.end.lines.map((t) => { const p = document.createElement('p'); p.textContent = t; return p; })); c.hidden = false;
}
function leaveChapter() {
  const { scene, state, WALLS, renderer } = E; $('chcard').hidden = true; clearNpcs(); scene.remove(CH.place.group); CH.on = false; CH.place = null;
  saved.hidden.forEach((c) => (c.visible = true)); saved.lights.forEach(([l, v]) => (l.intensity = v)); scene.fog = saved.fog; scene.background = saved.bg; renderer.shadowMap.enabled = saved.shadow; WALLS.length = 0; WALLS.push(...saved.wasWalls);
  state.started = false; state.camY = 0; E.setBusy(false); $('hud').hidden = true; $('title').hidden = false;
}
/* dev only (?chapter=1&at=talk): start the chapter; &at=end jumps to the end card */
export function devSkip(what) { if (what === 'talked') for (const id of ORDER) CH.talked[id] = true; if (what === 'end') { for (const id of ORDER) CH.talked[id] = true; endChapter(); } }
