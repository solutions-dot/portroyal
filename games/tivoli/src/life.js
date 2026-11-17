/* games/tivoli/src/life.js: background life in the walking chapters (1, 2, 3, 4, 6, 7, 8), on the shared engine/ambient.js.
   Owner, 16 November 2026: "ensure the game chooses the best animation for the scene and it doesn't just look like zombies standing around doing nothing".
   Before this, each chapter had only its three story people, standing in Idle. Now each place also has neighbours who are not in the story: children playing,
   people talking in small groups, elders on the benches, someone walking by, someone watching. The engine gives every one of them their own timing (random
   start and speed on every clip), idle variants in turn, heads that turn toward the player or the person speaking, personal space, and no foot sliding.
   Everyone here is fictional and general (docs/games/tivoli.md: everyday life is the game's own imagining, and the journal says so).

   The mood follows the chapter: lively in the 1960s, 1980 and today; calm and few on Sunday 23 May 2010, the day before the operation (people talk quietly,
   some look down the street toward the barricade); sad a few days after it (chapter 6: no games, people comfort each other, sit and talk low); calm in 2016.
   Bodies are the ones the game already ships (the borrowed Kendal and Garvey bodies and civilian2010), recoloured, so no new downloads.

   The engine owns these people's bodies: their mixers are taken out of the game's shared list (engine/anim.js `mixers`) so they are not updated twice. */
import { mixers } from '../../../engine/anim.js';
import { createAmbient, ambientTest } from '../../../engine/ambient.js';
import { loadBase, makeBody } from './cast.js';

/* a look for a background person: a body, a sex (for the engine's walk and talk clips), colours, and a size (children use the girl body, small) */
const P = {
  man60: (Shirt, Breeches, Cap = 0x5a4a3a) => ({ base: 'man_elder', sex: 'm', hat: 'Cap', tint: { Cap, Shirt, Waistcoat: Breeches, Breeches, Shoes: 0x1c1816 } }),
  woman60: (Shirt, Skirt, Wrap = 0xc84a3a) => ({ base: 'woman_elder', sex: 'f', hat: 'Wrap', tint: { Wrap, Shirt, Skirt, Shoes: 0x2a211b } }),
  child: (Shirt, Skirt, scale = 0.76) => ({ base: 'girl', sex: 'f', scale, tint: { Shirt, Skirt, Shoes: 0x2a211b } }),
  man: (Shirt, Breeches) => ({ base: 'civilian2010', sex: 'm', tint: { Shirt, Breeches } }),
  woman: (Shirt, Skirt) => ({ base: 'guide2020', sex: 'f', tint: { Shirt, Skirt } }),
};
const BENCH = (x, z, side, ry) => ({ top: 0.5, x: x + side * 0.45, z, ry });   /* newtivoli.js benches: 1.8 m long, seat top 50 cm; two people sit 90 cm apart */
const IDL_M = ['IdleM', 'Idle', 'LookAround'], IDL_F = ['Idle', 'HappyIdle', 'LookAround'], IDL_OLD = ['OldIdle', 'Idle', 'LookAround'], IDL_KID = ['HappyIdle', 'Idle'];

/* who is in each chapter, and what they do. at: [x, z]; spec: the engine behaviour (docs/ENGINE.md, engine/ambient.js) */
export const LIFE = {
  1: { mood: 'lively', people: [   /* Back-o-Wall, about 1963: the lane runs along x (z -2 to 2.6), Ivy's yard to the south */
    { id: 'kid1', look: P.child(0xe8c04a, 0x6a4a8a, 0.74), at: [-13, 0.6], spec: { kind: 'play', area: [-16, -1.2, -10, 2.2], chase: 'kid2' } },
    { id: 'kid2', look: P.child(0xd05a3a, 0x3a5a8a, 0.7), at: [-11, 1.4], spec: { kind: 'play', area: [-16, -1.2, -10, 2.2], chase: 'kid1' } },
    { id: 'lane1', look: P.woman60(0xe9e2d2, 0x3a6a5a, 0x3a6ac0), at: [-4.6, -1.2], spec: { kind: 'chat', group: 'door', at: [-5.3, -1.2], idles: IDL_F } },
    { id: 'lane2', look: P.woman60(0xd8c8a8, 0x7a3a3a, 0xe0c030), at: [-6.0, -1.2], spec: { kind: 'chat', group: 'door', idles: IDL_OLD } },
    { id: 'cart', look: P.man60(0xd9d2bc, 0x4a4a42), at: [11.9, 0.4], spec: { kind: 'work', clips: ['WipeSweat', 'LookAround', 'IdleM'], face: [10.5, 1.6], idles: IDL_M } },
    { id: 'walker', look: P.man60(0xc8c0a8, 0x3a3a34, 0x2e2e2e), at: [-18, 2.0], spec: { kind: 'wander', pts: [[-18, 2.0], [-12.5, -1.0], [-8.6, -1.0], [-6.8, -0.2], [12, -0.6], [15.5, 1.8]], pause: [3, 7], idles: IDL_M } },   /* round Mass Roy (-8.6, 0.9), not past his elbow: ?test=ambient once found the walker waiting by him */
    { id: 'gran2', look: P.woman60(0xf0ece2, 0x4a3a5a, 0x7a3a8a), at: [-16.4, -1.3], spec: { kind: 'watch', at: [-13, 0.6], react: ['Clap', 'Laugh'], idles: IDL_OLD } },
  ] },
  2: { mood: 'lively', people: [   /* the new Tivoli Gardens, about 1965: the courtyard (main path along x at z 0), grass both sides, benches */
    { id: 'kid1', look: P.child(0xf0d050, 0x3a6ac0, 0.74), at: [-12, 4.6], spec: { kind: 'play', area: [-15, 3, -5, 7.6], chase: 'kid2' } },
    { id: 'kid2', look: P.child(0xd04a3a, 0x2a2a3a, 0.7), at: [-8, 5.6], spec: { kind: 'play', area: [-15, 3, -5, 7.6], chase: 'kid3' } },
    { id: 'kid3', look: P.child(0x6ab0e0, 0x7a3a3a, 0.78), at: [-10, 6.6], spec: { kind: 'play', area: [-15, 3, -5, 7.6], chase: 'kid1' } },
    { id: 'mum1', look: P.woman60(0xf0e6c8, 0x5a7a4a, 0xd8b04a), at: [-16, 2.6], spec: { kind: 'watch', at: [-10, 5.5], react: ['Clap', 'Laugh'], idles: IDL_F } },
    { id: 'bench1', look: P.man60(0xe0dccc, 0x3a3a3e), at: [19.55, -3.4], spec: { kind: 'sit', group: 'b1', seat: BENCH(20, -3.4, -1, 0), clips: ['SitIdle', 'SitIdle2'] } },
    { id: 'bench2', look: P.woman60(0xe6d8b8, 0x6a3a5a, 0x2f6a8a), at: [20.45, -3.4], spec: { kind: 'sit', group: 'b1', seat: BENCH(20, -3.4, 1, 0), clips: ['SitIdle', 'SitIdle2'] } },
    { id: 'chat1', look: P.woman60(0xd8e0e8, 0x3a4a6a, 0xc84a3a), at: [9.6, -4.6], spec: { kind: 'chat', group: 'c1', at: [10.2, -4.8], idles: IDL_F } },
    { id: 'chat2', look: P.man60(0xf0ece2, 0x4a3a2a, 0x3a3a3a), at: [10.8, -4.6], spec: { kind: 'chat', group: 'c1', idles: IDL_M } },
    { id: 'walker', look: P.man60(0xc8d0c0, 0x2e2e34), at: [-30, -0.8], spec: { kind: 'wander', pts: [[-30, -0.8], [-14, -0.9], [8, -0.9], [24, -0.8]], pause: [3, 7], idles: IDL_M } },
  ] },
  3: { mood: 'lively', people: [   /* the same courtyard about 1980: older paint, the football club and the dance troupe are new; children kick about on the grass */
    { id: 'kid1', look: P.child(0x1f7a3a, 0xf0ece2, 0.78), at: [-14, 4.8], spec: { kind: 'play', area: [-15, 3, -4, 7.6], chase: 'kid2' } },
    { id: 'kid2', look: P.child(0xf0ece2, 0x1f7a3a, 0.74), at: [-7, 5.8], spec: { kind: 'play', area: [-15, 3, -4, 7.6], chase: 'kid3' } },
    { id: 'kid3', look: P.child(0xe0c030, 0x2a2a3a, 0.72), at: [-10, 3.6], spec: { kind: 'play', area: [-15, 3, -4, 7.6], chase: 'kid1' } },
    { id: 'fan1', look: P.man(0x8a3a2a, 0x3a3e48), at: [-3.6, 4.6], spec: { kind: 'watch', at: [-10, 5.5], react: ['Clap', 'Cheer'], idles: IDL_M } },
    { id: 'bench1', look: P.woman(0xe0a03a, 0x3a3a5a), at: [19.55, -3.4], spec: { kind: 'sit', group: 'b1', seat: BENCH(20, -3.4, -1, 0), clips: ['SitIdle', 'SitIdle2'] } },
    { id: 'bench2', look: P.man(0xd8d0c0, 0x2e2e34), at: [20.45, -3.4], spec: { kind: 'sit', group: 'b1', seat: BENCH(20, -3.4, 1, 0), clips: ['SitIdle', 'SitIdle2'] } },
    { id: 'chat1', look: P.woman(0x3a8a8a, 0x2e2e3a), at: [9.6, -4.6], spec: { kind: 'chat', group: 'c1', at: [10.2, -4.8], idles: IDL_F } },
    { id: 'chat2', look: P.man(0xe8e4d8, 0x4a3a2a), at: [10.8, -4.6], spec: { kind: 'chat', group: 'c1', idles: IDL_M } },
    { id: 'walker', look: P.woman(0xc84a6a, 0x3a3a3a), at: [24, -0.8], spec: { kind: 'wander', pts: [[24, -0.8], [8, -0.9], [-14, -0.9], [-30, -0.8]], pause: [3, 7], idles: IDL_F } },
  ] },
  4: { mood: 'calm', people: [   /* the street, Sunday 23 May 2010, the day before: few people out, talking low, looking down the street toward the barricade (west) */
    { id: 'look1', look: P.man(0x4a5a7a, 0x2e2e34), at: [-4, -6.2], spec: { kind: 'watch', at: [-27, 0], every: [5, 9], idles: ['IdleM', 'LookAround', 'Idle'] } },
    { id: 'look2', look: P.woman(0x8a6a4a, 0x3a3a4a), at: [-2.6, -6.6], spec: { kind: 'watch', at: [-27, 0], every: [5, 9], idles: ['Idle', 'LookAround', 'HeadTurn'] } },
    { id: 'chat1', look: P.woman(0xd8c8a8, 0x5a3a3a), at: [6.4, 6.9], spec: { kind: 'chat', group: 'c1', at: [5.8, 6.9], idles: ['Idle', 'LookAround'], talks: ['Talk3', 'Talk2'] } },
    { id: 'chat2', look: P.man(0x6a7a8a, 0x3a3e48), at: [5.2, 6.9], spec: { kind: 'chat', group: 'c1', idles: ['IdleM', 'Idle'], talks: ['TalkM2', 'Talk2'] } },
    { id: 'walker', look: P.man(0x3a3a40, 0x4a4a52), at: [26, -6.4], spec: { kind: 'wander', pts: [[26, -6.4], [10, -6.4], [-8, -6.4]], pause: [4, 8], idles: ['IdleM', 'LookAround'] } },
  ] },
  6: { mood: 'sad', people: [   /* the courtyard a few days after: no games; people comfort each other, sit and talk low (nobody is shown hurt) */
    { id: 'comfort1', look: P.woman(0x3a3a4a, 0x2a2a30), at: [10.0, -4.7], ry: Math.PI / 2, spec: { kind: 'work', clips: ['ComfortHand'], face: Math.PI / 2, work: [8, 14], rest: [2, 4], stay: true, sadIdles: ['Sad1', 'Idle'] } },
    { id: 'comfort2', look: P.woman(0x5a4a6a, 0x2e2e34), at: [10.58, -4.7], ry: -Math.PI / 2, spec: { kind: 'work', clips: ['ComfortTake'], face: -Math.PI / 2, work: [8, 14], rest: [2, 4], stay: true, sadIdles: ['Sad2', 'Sad1'] } },
    { id: 'bench1', look: P.man(0x2e2e34, 0x3a3a40), at: [19.55, -3.4], spec: { kind: 'sit', group: 'b1', seat: BENCH(20, -3.4, -1, 0), clips: ['SitIdle', 'SitIdle2'], stay: true } },
    { id: 'bench2', look: P.woman60(0x3a3a3a, 0x2a2a2a, 0x2a2a2a), at: [20.45, -3.4], spec: { kind: 'sit', group: 'b1', seat: BENCH(20, -3.4, 1, 0), clips: ['SitIdle', 'SitIdle2'], stay: true } },
    { id: 'chat1', look: P.man(0x4a4a52, 0x2e2e34), at: [-13.6, 4.4], spec: { kind: 'chat', group: 'c1', at: [-13, 4.6], stay: true } },
    { id: 'chat2', look: P.woman(0x2e3a4a, 0x2a2a30), at: [-12.4, 4.4], spec: { kind: 'chat', group: 'c1', stay: true } },
    { id: 'child', look: P.child(0x6a7a8a, 0x2a2a3a, 0.74), at: [-14.2, 5.4], spec: { kind: 'watch', at: [-13, 4.6], every: [5, 9], stay: true, sadIdles: ['Sad1', 'Idle'] } },
  ] },
  7: { mood: 'calm', people: [   /* June 2016, the report: people sit and talk it over */
    { id: 'bench1', look: P.man(0x6a5a48, 0x2e2e34), at: [19.55, -3.4], spec: { kind: 'sit', group: 'b1', seat: BENCH(20, -3.4, -1, 0), clips: ['SitIdle', 'SitIdle2'] } },
    { id: 'bench2', look: P.man(0xd8d0c0, 0x3a3e48), at: [20.45, -3.4], spec: { kind: 'sit', group: 'b1', seat: BENCH(20, -3.4, 1, 0), clips: ['SitIdle', 'SitIdle2'] } },
    { id: 'chat1', look: P.woman(0x8a4a3a, 0x2e2e3a), at: [-13.6, 4.4], spec: { kind: 'chat', group: 'c1', at: [-13, 4.6], idles: IDL_F } },
    { id: 'chat2', look: P.woman60(0xe6d8b8, 0x3a4a6a, 0x2f6a8a), at: [-12.4, 4.4], spec: { kind: 'chat', group: 'c1', idles: IDL_OLD } },
    { id: 'chat3', look: P.man(0x3a5a3a, 0x3a3a40), at: [-13, 3.7], spec: { kind: 'chat', group: 'c1', idles: IDL_M } },
    { id: 'kid1', look: P.child(0xf0ece2, 0x3a4a6a, 0.78), at: [-26, -1.0], spec: { kind: 'wander', pts: [[-26, -1.0], [-6, -1.0], [8, -0.9]], pause: [2, 5], idles: IDL_KID } },
  ] },
  8: { mood: 'lively', people: [   /* today: murals on the walls, children play, people stop to look at the murals */
    { id: 'kid1', look: P.child(0xd0402a, 0x111111, 0.76), at: [-12, 4.6], spec: { kind: 'play', area: [-15, 3, -5, 7.6], chase: 'kid2' } },
    { id: 'kid2', look: P.child(0x2a6ad0, 0xf0ece2, 0.72), at: [-8, 5.6], spec: { kind: 'play', area: [-15, 3, -5, 7.6], chase: 'kid3' } },
    { id: 'kid3', look: P.child(0xf0c040, 0x3a3a3a, 0.7), at: [-10, 6.6], spec: { kind: 'play', area: [-15, 3, -5, 7.6], chase: 'kid1' } },
    { id: 'mural1', look: P.woman(0x3aa07a, 0x2e2e3a), at: [5.6, -6.2], spec: { kind: 'watch', at: [2.5, -9], react: ['Point', 'Nod'], idles: IDL_F } },
    { id: 'mural2', look: P.man(0xe8e4d8, 0x3a3e48), at: [6.6, -5.6], spec: { kind: 'watch', at: [2.5, -9], react: ['Point', 'Agree'], idles: IDL_M } },
    { id: 'bench1', look: P.woman60(0xe9e2d2, 0x5a4a6a, 0xd8b04a), at: [19.55, -3.4], spec: { kind: 'sit', group: 'b1', seat: BENCH(20, -3.4, -1, 0), clips: ['SitIdle', 'SitIdle2'] } },
    { id: 'bench2', look: P.man(0x8a3a2a, 0x2e2e34), at: [20.45, -3.4], spec: { kind: 'sit', group: 'b1', seat: BENCH(20, -3.4, 1, 0), clips: ['SitIdle', 'SitIdle2'] } },
    { id: 'walker', look: P.man(0x2a2a2a, 0x4a5a7c), at: [-30, -0.8], spec: { kind: 'wander', pts: [[-30, -0.8], [-14, -0.9], [8, -0.9], [24, -0.8]], pause: [3, 7], idles: IDL_M } },
  ] },
};

/* the solid boxes a person cannot stand in (buildings, trees' trunks, benches, props, vehicles, fences), for the engine's blocked(x, z, r) */
function blockerOf(place) {
  const boxes = (place.solids || []).filter((s) => s.kind !== 'person' && s.y0 < 1.2 && !(s.kind === 'tree' && !/^(trunk|palm)/.test(s.name)));
  return (x, z, r) => boxes.some((s) => x > s.x0 - r && x < s.x1 + r && z > s.z0 - r && z < s.z1 + r);
}
/* the story: where the story people stand and the player's way between them, so nobody stands on it */
function keepOffOf(place) {
  const k = place.npcs.map((n) => ({ at: [n.x, n.z], r: 1.4 })); k.push({ at: [place.start.x, place.start.z], r: 1.0 }, { at: [place.endSpot.x, place.endSpot.z], r: place.endSpot.r + 0.6 });
  return k;
}
export function routeOf(place) { return [[place.start.x, place.start.z], ...place.npcs.map((n) => [n.x - Math.sign(n.x - place.start.x) * 1.2 || n.x, n.z]), [place.endSpot.x, place.endSpot.z]]; }

/* build the background people for a chapter's place; returns { life, people, tick, clear } or null when the chapter has none */
export async function addLife(id, place, scene, opts = {}) {
  const L = LIFE[id]; if (!L) return null;
  await Promise.all([...new Set(L.people.map((p) => p.look.base))].map((b) => loadBase(b)));
  const life = createAmbient({ walls: place.walls, bounds: place.bounds || { x0: -23, x1: 17.5, z0: -13.6, z1: 14.2 }, blocked: blockerOf(place), keepOff: keepOffOf(place), seed: 2010 + id, mood: L.mood, phone: !!opts.phone,
    place: (n) => { n.m.position.x = n.x; n.m.position.z = n.z; n.m.userData.ground = place.groundAt ? place.groundAt(n.x, n.z) : 0; } });
  const people = [];
  for (const d of L.people) {
    const g = place.groundAt ? place.groundAt(d.at[0], d.at[1]) : 0, m = makeBody({ ...d.look, x: d.at[0], z: d.at[1], ry: d.ry !== undefined ? d.ry : d.spec.seat ? d.spec.seat.ry : Math.random() * 6.28, ground: g, anim: 'Idle' });   /* a sitter starts facing the way the seat faces, or the seat swung them round in one frame */
    const k = mixers.indexOf(m.userData.anim.mx); if (k >= 0) mixers.splice(k, 1);   /* the engine updates this mixer, not the game's loop */
    m.traverse((o) => { if (o.isMesh) o.castShadow = true; }); if (scene) scene.add(m);
    const n = { id: d.id, x: d.at[0], z: d.at[1], m, ctl: m.userData.anim, sex: d.look.sex, look: d.look }; life.add(n, d.spec); people.push(n);
  }
  return { life, people, mood: L.mood, clear() { for (const n of people) if (n.m.parent) n.m.parent.remove(n.m); life.clear(); } };
}
/* dev only (?test=ambient): every walking chapter's background people, run for a minute with a player walking the story route */
export async function lifeTest(WALKS) {
  const out = []; let total = 0;
  for (const id of Object.keys(LIFE).map(Number)) {
    const place = WALKS[id].build({}), r = await addLife(id, place, null); if (!r) continue;
    const story = place.npcs.map((n) => ({ x: n.x, z: n.z })); const txt = ambientTest(r.life, { route: routeOf(place), story, seconds: 60 }); const n = +txt.split('\n')[0].split(' ')[1];
    total += n; out.push('chapter ' + id + ' (' + r.mood + ', ' + r.people.length + ' people): ' + txt.split('\n').filter(Boolean).join('\n  ')); r.clear();
  }
  return { total, lines: out };
}
