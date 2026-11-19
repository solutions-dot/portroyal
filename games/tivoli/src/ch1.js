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
import { unlock, finishChapter, saveProgress, savedTalked } from './story.js';
import { FX } from './fx.js';
import { addLife } from './life.js';
import { release } from '../../../engine/preload.js';

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
let E = null, saved = null, titleTimer = null;

export function setupCh1(env) {
  E = env;
  $('titleskip').onclick = () => { hideIntro(); E.focusGame(); };
}
const goalNow = () => { const i = ORDER.findIndex((id) => !CH.talked[id]); return TXT.goals[i < 0 ? 3 : i]; };

export async function begin(id = 1, opts = {}) {
  leaveChapter();   // Chapter selection can interrupt a walk; remove its people and scenery first.
  const W = WALKS[id]; CH.id = id; ORDER = W.order; TXT = W.text;
  const { scene, state, WALLS, renderer } = E; E.audioInit(); $('title').hidden = true; $('fightload').firstElementChild.textContent = W.loading; $('fightload').hidden = false;
  const shadows = !matchMedia('(pointer: coarse)').matches && !/[?&]noshadow/.test(location.search), pl = W.build({ shadows });   /* phones draw no shadows; &noshadow measures a computer as a phone draws (?test=all budget) */
  saved = { hidden: scene.children.filter((c) => c.visible && !c.isLight), fog: scene.fog, bg: scene.background, lights: scene.children.filter((c) => c.isLight).map((l) => [l, l.intensity]), shadow: renderer.shadowMap.enabled, wasWalls: WALLS.slice() };
  saved.hidden.forEach((c) => (c.visible = false)); saved.lights.forEach(([l]) => (l.intensity = l.isDirectionalLight ? 0 : 1.9));
  scene.background = new THREE.Color(W.sky[0]); scene.fog = new THREE.Fog(W.sky[1], 30, 190); if (shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
  scene.add(pl.group); CH.place = pl; WALLS.length = 0; WALLS.push(...pl.walls);
  CH.talked = {}; CH.ended = false; for (const k of (opts.talked || savedTalked(id))) if (ORDER.includes(k)) CH.talked[k] = true;   /* a saved game: the people you had talked to stay talked to */
  for (const n of pl.npcs) { const npc = await addNpc({ ...n, ground: pl.groundAt ? pl.groundAt(n.x, n.z) : 0, lines: TXT.talk[n.id], later: TXT.later[n.id], mood: W.mood }); if (CH.talked[n.id]) npc.talked = 1; }
  saveProgress(id, Object.keys(CH.talked));
  CH.life = await addLife(id, pl, scene, { phone: matchMedia('(pointer: coarse)').matches || /[?&]noshadow/.test(location.search) });   /* &noshadow: measure as a phone (?test=all budget) */   /* the neighbours who are not in the story (life.js) */
  CH.story = Talk.npcs.map((n) => ({ x: n.x, z: n.z, m: n.body }));
  $('fightload').hidden = true;
  state.x = pl.start.x; state.z = pl.start.z; state.yaw = pl.start.yaw; state.pitch = 0; state.camY = W.camY || 1.3; state.started = true; E.setBusy(false);
  $('hud').hidden = false; E.setGoal(goalNow());
  const t = $('scenetitle'); t.replaceChildren(); const b = document.createElement('b'); b.textContent = TXT.start[0]; t.append(b); for (const l of TXT.start.slice(1)) { const p = document.createElement('p'); p.textContent = l; t.append(p); }
  t.hidden = false; $('titleskip').hidden = false; titleTimer = setTimeout(hideIntro, 5200);
  CH.on = true; if (E.onStart) E.onStart(id);
}
export function guideTarget() {   /* where the helper arrow points: the next person to talk to, then the place where the walk ends */
  if (!CH.on || CH.ended) return null; const id = ORDER.find((k) => !CH.talked[k]);
  if (!id) { const e = CH.place.endSpot; return [e.x, e.z]; } const n = Talk.npcs.find((x) => x.id === id); return n ? [n.x, n.z] : null;
}
export function onTalked(npc) {   /* each finished talk moves the goal on */
  CH.talked[npc.id] = true; saveProgress(CH.id, Object.keys(CH.talked)); E.setGoal(goalNow());
}
export function tick(dt) {
  if (!CH.on || CH.ended || Talk.open) return; const { state } = E, e = CH.place.endSpot;
  if (ORDER.every((id) => CH.talked[id]) && Math.hypot(state.x - e.x, state.z - e.z) < e.r) endChapter();
}
function endChapter() {
  CH.ended = true; finishChapter(CH.id); E.uiSound('goal'); E.setGoal('');
  E.chapterEnd(CH.id, TXT.end);   /* the end card with Next chapter (main.js), as in every game */
}
function hideIntro() {
  clearTimeout(titleTimer); titleTimer = null;
  $('scenetitle').hidden = true; $('titleskip').hidden = true;
}

export function leaveChapter() {
  if (!CH.on) return;
  hideIntro();
  const { scene, state, WALLS, renderer } = E, gone = [CH.place.group, ...Talk.npcs.map((n) => n.body), ...(CH.life ? CH.life.people.map((n) => n.m) : [])];
  $('chcard').hidden = true; clearNpcs(); if (CH.life) CH.life.clear(); CH.life = null; scene.remove(CH.place.group); CH.on = false; CH.place = null;
  for (const o of gone) release(o, scene);   /* engine/preload.js: the place and its people are built afresh next time, so their graphics memory is let go now (phones reload the page when it runs out) */
  saved.hidden.forEach((c) => (c.visible = true)); saved.lights.forEach(([l, v]) => (l.intensity = v)); scene.fog = saved.fog; scene.background = saved.bg; renderer.shadowMap.enabled = saved.shadow; WALLS.length = 0; WALLS.push(...saved.wasWalls);
  state.started = false; state.camY = 0; E.setBusy(false); $('hud').hidden = true; $('title').hidden = false;
}
/* the background people, once a frame AFTER the game's mixers (the engine turns their heads on top of the clip): they keep clear of you and the story people */
export function lifeTick(dt) {
  if (!CH.on || !CH.life) return; const { state } = E;
  CH.life.life.tick(dt, { px: state.x, pz: state.z, story: CH.story, talking: null, view: { x: state.x, z: state.z, yaw: state.yaw } });
  turnLimit(CH.life.people, dt);
}
/* nobody spins: a body turns at most 200 degrees a second standing and 315 walking, whatever turned it (Kendal's turnLimit, games/kendal/src/main.js); a seated person keeps the seat's facing */
const WALKING = /^(Walk|WalkM|WalkM2|Run|RunM2|SadWalk|Carry)/;
function turnLimit(people, dt) {
  for (const n of people) { const m = n.m; if (!m.visible || m.userData.seatAnchor || !(dt > 0)) { n._ry = undefined; continue; } if (n._ry === undefined) { n._ry = m.rotation.y; continue; }
    const c = n.ctl || m.userData.anim, walk = c && c.cur && WALKING.test(c.cur.getClip().name), lim = (walk ? 5.5 : 3.5) * dt; let e = m.rotation.y - n._ry; e = Math.atan2(Math.sin(e), Math.cos(e));
    if (Math.abs(e) > lim) m.rotation.y = n._ry + Math.sign(e) * lim; n._ry = m.rotation.y; }
}
/* who you have talked to in this chapter, and the order of the people (for the test hooks and the save) */
export const talkedNow = () => ORDER.filter((k) => CH.talked[k]), orderNow = () => ORDER.slice();
/* dev only (?chapter=1 or 2, &at=talked): start the chapter; &at=end jumps to the end card */
export function devSkip(what) { if (what === 'talked') for (const id of ORDER) CH.talked[id] = true; if (what === 'end') { for (const id of ORDER) CH.talked[id] = true; endChapter(); } }
