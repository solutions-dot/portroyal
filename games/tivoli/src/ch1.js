/* games/tivoli/src/ch1.js: the walking chapters (1, Back-o-Wall; 2, the new Tivoli; 3, politics; 4, the day before; 6, after; 7, the report; 8, today). Each has a place, three people to talk to in any order, and a spot to walk to at the end.
   The WALKS table says which place and which words each chapter uses. Chapter 1, Back-o-Wall. You walk through the memory of Ivy, a girl in Back-o-Wall about 1963 (in 2010 she is the grandmother). You talk to Ivy in her yard,
   to her gran, and to a neighbour in the lane, then walk to the end of the lane. Everyone is fictional and the place is imagined (backowall.js); the journal says so.
   Nothing frightening is shown: the chapter ends with a card, not with the clearing itself. Facts: docs/games/tivoli.md "Back-o-Wall and the clearance". */
import * as THREE from 'three';
import { buildBackOWall } from './backowall.js';
import { buildNewTivoli } from './newtivoli.js';
import { streetPlace } from './street.js';
import { addNpc, clearNpcs, Talk } from './talk.js';
import { CH1, CH2, CH3, CH4, CH6, CH7, CH8 } from './content.js';
import { unlock, finishChapter } from './story.js';
import { FX } from './fx.js';
import { addLife } from './life.js';

export const CH = { on: false, talked: {}, ended: false, id: 1 };
export const WALKS = {
  1: { build: buildBackOWall, text: CH1, order: ['ivy', 'pearl', 'roy'], loading: 'Loading Back-o-Wall.', sky: [0xdbe6ea, 0xcfdde4] },
  4: { build: streetPlace, text: CH4, order: ['gran', 'dawn', 'brown'], mood: 'calm', loading: 'Loading Tivoli Gardens, 2010.', sky: [0xd8e4ec, 0xcfdbe2], camY: 1.25 },
  6: { build: (o) => buildNewTivoli({ ...o, year: 2010, cast: [
    { id: 'gran', name: 'Gran Ivy', look: 'ivyGran', x: -4.5, z: -2.6, ry: 0.4, anim: 'Idle' },
    { id: 'brown', name: 'Mr Brown', look: 'brown', x: -24, z: -7.2, ry: 0, anim: 'Idle' },
    { id: 'pastor', name: 'Pastor Grant', look: 'pastor', x: 29.2, z: 3.8, ry: -Math.PI / 2, anim: 'Idle' }] }), text: CH6, order: ['gran', 'brown', 'pastor'], mood: 'sad', loading: 'Loading Tivoli Gardens, 2010.', sky: [0xd8e2ea, 0xcdd8e0], camY: 1.25 },
  3: { build: (o) => buildNewTivoli({ ...o, year: 1980, cast: [
    { id: 'ivy', name: 'Ivy', look: 'ivyMum', x: -9, z: -2.7, ry: 0.4, anim: 'Idle' },
    { id: 'roy', name: 'Mass Roy', look: 'roy', x: -24, z: -7.2, ry: 0, anim: 'Idle' },
    { id: 'coach', name: 'Coach Davis', look: 'coach', x: 29.2, z: 3.8, ry: -Math.PI / 2, anim: 'Idle' }] }), text: CH3, order: ['ivy', 'roy', 'coach'], loading: 'Loading Tivoli Gardens, about 1980.', sky: [0xd6e4ee, 0xcbdbe6] },
  7: { build: (o) => buildNewTivoli({ ...o, year: 2016, cast: [
    { id: 'gran', name: 'Gran Ivy', look: 'ivyGran', x: -4.5, z: -2.6, ry: 0.4, anim: 'Idle' },
    { id: 'brown', name: 'Mr Brown', look: 'brown', x: 12, z: 7.6, ry: Math.PI, anim: 'Idle' },
    { id: 'pastor', name: 'Pastor Grant', look: 'pastor', x: 29.2, z: 3.8, ry: -Math.PI / 2, anim: 'Idle' }] }), text: CH7, order: ['gran', 'brown', 'pastor'], mood: 'calm', loading: 'Loading Tivoli Gardens, 2016.', sky: [0xd8e2ea, 0xcdd8e0] },
  8: { build: (o) => buildNewTivoli({ ...o, year: 2025, cast: [
    { id: 'gran', name: 'Gran Ivy', look: 'ivyGran', x: -4.5, z: -2.6, ry: 0.4, anim: 'Idle' },
    { id: 'andre', name: 'Andre', look: 'andre', x: 2.5, z: -7.6, ry: Math.PI, anim: 'Idle' },
    { id: 'kemesha', name: 'Kemesha', look: 'kemesha', x: 29.2, z: 3.8, ry: -Math.PI / 2, anim: 'Idle' }] }), text: CH8, order: ['gran', 'andre', 'kemesha'], loading: 'Loading Tivoli Gardens today.', sky: [0xd4e4f0, 0xc8dbe8] },
  2: { build: buildNewTivoli, text: CH2, order: ['ivy', 'pearl', 'clarke'], loading: 'Loading Tivoli Gardens.', sky: [0xd6e4ee, 0xcbdbe6] },
};
const $ = (id) => document.getElementById(id);
let ORDER = WALKS[1].order, TXT = CH1;
let E = null, saved = null;

export function setupCh1(env) { E = env; $('chdone').onclick = leaveChapter; }
const goalNow = () => { const i = ORDER.findIndex((id) => !CH.talked[id]); return TXT.goals[i < 0 ? 3 : i]; };

export async function begin(id = 1) {
  const W = WALKS[id]; CH.id = id; ORDER = W.order; TXT = W.text;
  const { scene, state, WALLS, renderer } = E; E.audioInit(); $('title').hidden = true; $('fightload').firstElementChild.textContent = W.loading; $('fightload').hidden = false;
  const shadows = !matchMedia('(pointer: coarse)').matches, pl = W.build({ shadows });
  saved = { hidden: scene.children.filter((c) => c.visible && !c.isLight), fog: scene.fog, bg: scene.background, lights: scene.children.filter((c) => c.isLight).map((l) => [l, l.intensity]), shadow: renderer.shadowMap.enabled, wasWalls: WALLS.slice() };
  saved.hidden.forEach((c) => (c.visible = false)); saved.lights.forEach(([l]) => (l.intensity = l.isDirectionalLight ? 0 : 1.9));
  scene.background = new THREE.Color(W.sky[0]); scene.fog = new THREE.Fog(W.sky[1], 30, 190); if (shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
  scene.add(pl.group); CH.place = pl; WALLS.length = 0; WALLS.push(...pl.walls);
  CH.talked = {}; CH.ended = false;
  for (const n of pl.npcs) await addNpc({ ...n, ground: pl.groundAt ? pl.groundAt(n.x, n.z) : 0, lines: TXT.talk[n.id], later: TXT.later[n.id], mood: W.mood });
  CH.life = await addLife(id, pl, scene, { phone: matchMedia('(pointer: coarse)').matches });   /* the neighbours who are not in the story (life.js) */
  CH.story = Talk.npcs.map((n) => ({ x: n.x, z: n.z, m: n.body }));
  $('fightload').hidden = true;
  state.x = pl.start.x; state.z = pl.start.z; state.yaw = pl.start.yaw; state.pitch = 0; state.camY = W.camY || 1.3; state.started = true; E.setBusy(false);
  $('hud').hidden = false; E.setGoal(goalNow());
  const t = $('scenetitle'); t.replaceChildren(); const b = document.createElement('b'); b.textContent = TXT.start[0]; t.append(b); for (const l of TXT.start.slice(1)) { const p = document.createElement('p'); p.textContent = l; t.append(p); }
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
  CH.ended = true; E.setBusy(true); finishChapter(CH.id); E.uiSound('goal');
  const c = $('chcard'); $('chcardt').textContent = TXT.end.title; $('chcardl').replaceChildren(...TXT.end.lines.map((t) => { const p = document.createElement('p'); p.textContent = t; return p; })); c.hidden = false;
}
function leaveChapter() {
  const { scene, state, WALLS, renderer } = E; $('chcard').hidden = true; clearNpcs(); if (CH.life) CH.life.clear(); CH.life = null; scene.remove(CH.place.group); CH.on = false; CH.place = null;
  saved.hidden.forEach((c) => (c.visible = true)); saved.lights.forEach(([l, v]) => (l.intensity = v)); scene.fog = saved.fog; scene.background = saved.bg; renderer.shadowMap.enabled = saved.shadow; WALLS.length = 0; WALLS.push(...saved.wasWalls);
  state.started = false; state.camY = 0; E.setBusy(false); $('hud').hidden = true; $('title').hidden = false;
}
/* the background people, once a frame AFTER the game's mixers (the engine turns their heads on top of the clip): they keep clear of you and the story people */
export function lifeTick(dt) {
  if (!CH.on || !CH.life) return; const { state } = E;
  CH.life.life.tick(dt, { px: state.x, pz: state.z, story: CH.story, talking: null, view: { x: state.x, z: state.z, yaw: state.yaw } });
}
/* dev only (?chapter=1 or 2, &at=talked): start the chapter; &at=end jumps to the end card */
export function devSkip(what) { if (what === 'talked') for (const id of ORDER) CH.talked[id] = true; if (what === 'end') { for (const id of ORDER) CH.talked[id] = true; endChapter(); } }
