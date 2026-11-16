import test from 'node:test';
import assert from 'node:assert/strict';
import { Scene, SkinnedMesh, Mesh, MeshBasicMaterial, BoxGeometry, BufferGeometry, Float32BufferAttribute, Color, Vector3 } from 'three';
import { repairLegacyVertexColours } from '../engine/colours.js';
import { releaseOnBlur } from '../engine/input.js';
import { snapMeshes, insideBoxFootprint } from '../engine/audit.js';

test('legacy character swatches recover their linear colour exactly once, preserving alpha', () => {
  const desired = new Color().setRGB(0.27, 0.12, 0.06);
  const encodedTwice = desired.clone().convertSRGBToLinear();
  const g = new BufferGeometry(); g.setAttribute('color', new Float32BufferAttribute([...encodedTwice.toArray(), 0.4], 4));
  const scene = new Scene(); scene.add(new SkinnedMesh(g, new MeshBasicMaterial()));
  const gltf = { scene }; repairLegacyVertexColours(gltf); repairLegacyVertexColours(gltf);
  const c = g.getAttribute('color');
  for (const [i, n] of desired.toArray().entries()) assert.ok(Math.abs(c.array[i] - n) < 0.000001);
  assert.ok(Math.abs(c.getW(0) - 0.4) < 0.000001);
});

test('linear exports and unskinned scenery are not brightened', () => {
  for (const linear of [true, false]) {
    const scene = new Scene(), g = new BufferGeometry(); g.setAttribute('color', new Float32BufferAttribute([0.2, 0.3, 0.4], 3));
    if (linear) scene.userData.vertexColorSpace = 'linear';
    scene.add(linear ? new SkinnedMesh(g, new MeshBasicMaterial()) : new Mesh(g, new MeshBasicMaterial()));
    const before = g.getAttribute('color'); repairLegacyVertexColours({ scene }); assert.equal(g.getAttribute('color'), before);
  }
});

test('blur and hidden documents release keyboard, joystick, look and held actions', () => {
  const events = new EventTarget(), doc = new EventTarget(); doc.hidden = false;
  const previous = { addEventListener: globalThis.addEventListener, document: globalThis.document };
  globalThis.addEventListener = events.addEventListener.bind(events); globalThis.document = doc;
  try {
    const keys = new Set(['arrowright']), stick = { id: 4, dx: 1, dy: 0.5 }, look = { id: 5, moved: 10 }; let held = true;
    releaseOnBlur(keys, [stick, look], () => { held = false; });
    events.dispatchEvent(new Event('blur'));
    assert.equal(keys.size, 0); assert.equal(stick.id, null); assert.equal(stick.dx, 0); assert.equal(stick.dy, 0); assert.equal(look.id, null); assert.equal(held, false);
    keys.add('w'); doc.dispatchEvent(new Event('visibilitychange')); assert.equal(keys.size, 1);
    doc.hidden = true; doc.dispatchEvent(new Event('visibilitychange')); assert.equal(keys.size, 0);
  } finally { globalThis.addEventListener = previous.addEventListener; globalThis.document = previous.document; }
});

test('rotated bench checks reject empty AABB corners but retain real intersections', () => {
  const group = new Scene(), box = new Mesh(new BoxGeometry(2, 1, 0.2), new MeshBasicMaterial()); box.rotation.y = Math.PI / 4; box.position.y = 0.5; group.add(box);
  const snap = snapMeshes(group)[0];
  assert.ok(snap.b.containsPoint(new Vector3(0.65, 0.5, 0.65)));
  assert.equal(insideBoxFootprint(snap, 0.65, 0.5, 0.65), false);
  assert.equal(insideBoxFootprint(snap, 0, 0.5, 0), true);
});

import { Bone, Group, Skeleton, Quaternion } from 'three';
import { grip, gripTick } from '../engine/grip.js';
test('a heavy case straightens a bent elbow without accumulating pose changes', () => {
  const model = new Group(), hips = new Bone(), arm = new Bone(), elbow = new Bone(), hand = new Bone();
  for (const [b, name] of [[hips,'Hips'],[arm,'RightArm'],[elbow,'RightForeArm'],[hand,'RightHand']]) b.name = 'mixamorig' + name;
  model.add(hips); hips.add(arm); arm.add(elbow); elbow.add(hand); elbow.position.y = -0.3; hand.position.y = -0.3;
  const mesh = new SkinnedMesh(new BoxGeometry(), new MeshBasicMaterial()); model.add(mesh); model.updateMatrixWorld(true);
  mesh.bind(new Skeleton([hips,arm,elbow,hand])); elbow.rotation.z = Math.PI / 2;
  grip(model,'Right',new Mesh(new BoxGeometry(0.3,0.4,0.1),new MeshBasicMaterial()),{lift:0,straighten:0.8});
  const posed = elbow.quaternion.clone(), straight = new Quaternion();
  assert.ok(posed.angleTo(straight) < Math.PI / 4);
  gripTick(model); assert.ok(elbow.quaternion.angleTo(posed) < 0.000001);
  elbow.rotation.z = Math.PI / 2; gripTick(model); assert.ok(elbow.quaternion.angleTo(posed) < 0.000001);
});

import { updateWalk } from '../engine/locomotion.js';
test('visible walking stays active across footsteps, faces travel, and stops at zero displacement', () => {
  const model = new Group(), idle = {}, walking = {}, ac = { base: idle, cur: idle, get: () => walking, play() { this.cur = walking; }, rest() { this.cur = idle; } };
  model.userData.anim = ac;
  for (let i=0;i<150;i++) { updateWalk(model,-1.75/30,0,1/30); assert.equal(ac.cur,walking); }
  assert.ok(Math.abs(Math.sin(model.rotation.y)+1)<0.00001);
  const pace=walking.timeScale; updateWalk(model,-2.5/30,0,1/30); assert.ok(walking.timeScale>pace);
  for(let i=0;i<60;i++)updateWalk(model,1.75/30,0,1/30);
  assert.ok(Math.abs(Math.sin(model.rotation.y)-1)<0.00001);
  updateWalk(model,0,0,1/30); assert.equal(ac.cur,idle);
});

import { AnimationClip, QuaternionKeyframeTrack } from 'three';
import { seamLoop } from '../engine/anim.js';
test('loop seams normalize quantized rotations and meet the starting pose', () => {
  const track = new QuaternionKeyframeTrack('mixamorigHips.quaternion',[0,0.5,1],[0,0,0,0.9999,0,0.2,0,0.9796,0,0.3,0,0.9538]);
  const clip = seamLoop(new AnimationClip('Walk',1,[track]));
  const v=clip.tracks[0].values;
  for(let i=0;i<v.length;i+=4)assert.ok(Math.abs(Math.hypot(...v.slice(i,i+4))-1)<0.000001);
  const first=new Quaternion().fromArray(v).normalize(),last=new Quaternion().fromArray(v,v.length-4).normalize();
  assert.ok(first.angleTo(last)<0.000001);
});

import { VectorKeyframeTrack } from 'three';
import { CL, clipFor, HIPS_Y, WALKS, isSeated } from '../engine/anim.js';
test('kneeling, crouching and seated clips keep their low hips; every walk is paced and seam-looped', () => {
  const pos = (name, y, x = 0) => new AnimationClip(name, 1, [new VectorKeyframeTrack('mixamorigHips.position', [0, 1], [x, y, 0, x, y, 0]), new QuaternionKeyframeTrack('mixamorigHips.quaternion', [0, 1], [0, 0, 0, 1, 0, 0, 0, 1])]);
  const saved = { ...CL }; CL.Idle = pos('Idle', 0.86, 0.02);
  for (const [n, y] of [['Kneel', 0.313], ['Kneel2', 0.313], ['KneelDown', 0.308], ['Crawl', 0.36], ['Scared', 0.467], ['Duck2', 0.518], ['HurtHoldIdle', 0.72], ['TalkM3', 0.529], ['AskQuestion', 0.54], ['PlayPiano', 0.527], ['SitScared', 0.48]]) {
    CL[n] = pos(n, y, 0.3); const c = clipFor(n), t = c.tracks.find((k) => k.name === 'mixamorigHips.position');
    assert.ok(t, n + ' keeps its hips track'); assert.ok(Math.abs(t.values[1] - y) < 1e-6, n + ' keeps its hips height');
    if (isSeated(n)) assert.ok(Math.abs(t.values[0] - 0.02) < 1e-6, n + ' is seated: hips over the spot the game set'); }
  CL.Talk1 = pos('Talk1', 0.86); assert.equal(clipFor('Talk1').tracks.find((k) => k.name === 'mixamorigHips.position'), undefined, 'a standing clip leaves the height to groundFeet');
  for (const n of ['TalkM3', 'AskQuestion', 'PlayPiano', 'Pray4', 'SitIdle']) assert.ok(isSeated(n), n + ' is seated'); for (const n of ['Kneel', 'Talk1', 'TalkM1']) assert.ok(!isSeated(n));
  for (const n of ['CarryBagWalk', 'CarryHeadWalk', 'CarryHeadWalk2', 'HoldWalk', 'WalkM2', 'RunM2', 'SadWalk', 'HurtWalk', 'InjuredWalk', 'RifleWalk', 'RifleWalk2', 'RifleCrouchWalk']) assert.ok(WALKS.test(n), n + ' is a walk');
  assert.ok(HIPS_Y.test('Kneel') && !HIPS_Y.test('Idle'));
  for (const k of Object.keys(CL)) delete CL[k]; Object.assign(CL, saved);
});

import { useInteractionKey } from '../engine/input.js';
test('Space, Enter and E interact once and leave focused UI and text entry alone', () => {
  let count=0;
  for(const key of [' ','Enter','e']){let prevented=false;assert.equal(useInteractionKey({key,target:{closest:()=>null},preventDefault(){prevented=true;}},()=>{count++;}),true);assert.equal(prevented,true);}
  assert.equal(count,3);
  for(const target of ['button','input','textarea','a'])assert.equal(useInteractionKey({key:'Enter',target:{closest:()=>target},preventDefault(){throw Error('native control intercepted');}},()=>{count++;}),false);
  assert.equal(useInteractionKey({key:' ',repeat:true},()=>{count++;}),false);
  assert.equal(useInteractionKey({key:'Enter',target:{closest:()=>null},preventDefault(){throw Error('unused key intercepted');}},()=>false),false);
  assert.equal(count,3);
});

import { loftSkin } from '../engine/loft.js';
test('animal loft has outward end caps, finite normals and a modest mesh budget', () => {
  const g=loftSkin([[0,0,0,.3,.3,0x6a5644],[1,0,0,.3,.3,0x6a5644],[2,.1,0,.2,.2,0x6a5644]],16);
  const p=g.getAttribute('position'),normal=g.getAttribute('normal'),index=g.getIndex();
  assert.ok(index.count/3<1000);for(const n of [...p.array,...normal.array])assert.ok(Number.isFinite(n));
  const tri=(i)=>{const a=new Vector3().fromBufferAttribute(p,index.getX(i)),b=new Vector3().fromBufferAttribute(p,index.getX(i+1)),c=new Vector3().fromBufferAttribute(p,index.getX(i+2));return b.sub(a).cross(c.sub(a)).normalize();};
  const capStart=index.count-16*6;assert.ok(tri(capStart).x<-.9);assert.ok(tri(index.count-3).x>.9);
});

import { anchorSeat, segmentHitsWall, slideWalls, walkRoute, routeIssues, furnitureRouteIssues } from '../engine/placement.js';
test('swept collision catches thin furniture between safe endpoints and keeps sliding along it',()=>{
  const wall=[.9,-1,1,1];assert.ok(segmentHitsWall([0,0],[2,0],wall,.2));assert.ok(!segmentHitsWall([0,2],[2,2],wall,.2));
  const p=slideWalls([0,0],[2,.7],[wall],.2);assert.ok(p[0]<=.7);assert.ok(p[1]>.6);assert.equal(routeIssues('person',[[0,0],[2,0]],[wall]).length,2);
});
test('a follower detours around furniture while preserving radius clearance',()=>{
  const walls=[[0,0,1,1]],a=[-1,.5],b=[2,.5],route=walkRoute(a,b,walls,.22,{x0:-3,x1:3,z0:-3,z1:3});
  assert.ok(route.length>=3);assert.deepEqual(route.at(-1),b);assert.deepEqual(routeIssues('follower',[a,...route],walls,.22,false),[]);
});
test('furniture route checks find a missing walking wall and respect rotated empty corners',()=>{
  const scene=new Scene(),box=new Mesh(new BoxGeometry(2,1,.2),new MeshBasicMaterial());box.rotation.y=Math.PI/4;box.position.y=.5;scene.add(box);const snap=snapMeshes(scene);
  assert.ok(furnitureRouteIssues('walk',[[-1,0],[1,0]],snap,0,.1,false).length);
  assert.deepEqual(furnitureRouteIssues('walk',[[.65,.65],[.8,.65]],snap,0,.01,false),[]);
});
test('seat anchoring holds pelvis position through animation and movement of its parent',()=>{
  const train=new Group(),model=new Group(),hips=new Bone();hips.name='mixamorigHips';model.add(hips);train.add(model);model.userData.seatAnchor={x:1,z:2,top:.5,ry:Math.PI};
  for(const y of [.7,.5,.63]){hips.position.set(.1,y,.2);anchorSeat(model);const p=hips.getWorldPosition(new Vector3());train.worldToLocal(p);assert.ok(Math.abs(p.x-1)<1e-6);assert.ok(Math.abs(p.z-2)<1e-6);assert.ok(Math.abs(p.y-.62)<1e-6);train.position.x+=3;train.rotation.y+=.2;}
});

/* Nanny Town 1734: land with heights (games/nanny/src/land.js). You may stand on trails and clearings only. */
import { makeGround } from '../games/nanny/src/land.js';
const nannyGround = () => makeGround({ base: () => 5, trails: [{ w: 1, pts: [[0, 0, 0], [20, 0, 0]] }, { w: 1, nowalk: true, pts: [[0, 10, 2], [20, 10, 2]] }], flats: [{ x: 30, z: 0, r: 3, y: 0 }] });
test('a trail is walkable and levels the land; a trail marked nowalk levels the land but cannot be walked', () => {
  const G = nannyGround();
  assert.equal(G.walkable(10, 0.5), true); assert.equal(G.walkable(10, 3), false); assert.equal(G.walkable(31, 1), true); assert.equal(G.walkable(10, 10), false);
  assert.ok(Math.abs(G.h(10, 0)) < 0.01); assert.ok(Math.abs(G.h(10, 10) - 2) < 0.01); assert.equal(G.h(10, 40), 5);
  assert.ok(G.bounds.z1 < 9, 'the walking bounds leave out the trail that cannot be walked');
  const [x, z] = G.clamp(10, 3); assert.ok(Math.abs(x - 10) < 0.01 && Math.abs(z - 1) < 0.01, 'stepping off a trail puts you back on its edge');
  assert.deepEqual(G.clamp(10, 0.5), [10, 0.5]);
  const along = G.clamp(12, 1.4); assert.ok(Math.abs(along[0] - 12) < 0.01, 'you slide along the edge, not back toward where you were');
});
test('the wall rectangles made for the audits cover the ground you may not walk on, and none of the ground you may', () => {
  const G = nannyGround(), W = G.walls(0.5), hit = (x, z) => W.some((w) => x > w[0] && x < w[2] && z > w[1] && z < w[3]);
  assert.equal(hit(10, 0), false); assert.equal(hit(31, 0.2), false); assert.equal(hit(10, 2.3), true); assert.equal(hit(25.5, 2.6), true);
  for (const w of W) assert.ok(w[2] > w[0] && w[3] > w[1]);
});

/* engine/story.js: who moves the story, the hint arrow, carried items */
import './story.mjs';
import './ambient.mjs';
import './checks.mjs';
import './kendal.mjs';
import './final-two-ui.mjs';
import './chapter-footer.mjs';
import './guidance-delay.mjs';
import './guidance-target-priority.mjs';
import './garvey-goal-progress.mjs';

test('a follower keeps out of your personal space, steps aside when you walk back into them, and never stands in a wall', async () => {
  const { follow, tick, watch, drive } = await import('../engine/follow.js');
  const ctl = { play() {}, pace() { return 1; }, get() { return null; } }, n = { x: 0, z: -2, m: { visible: true, rotation: { y: 0 }, scale: { y: 1 }, position: {} }, ctl };
  const walls = [[-3, 3, 3, 3.6]], W = { px: 0, pz: 0, blocked: (x, z, r = 0.22) => walls.some((w) => x > w[0] - r && x < w[2] + r && z > w[1] - r && z < w[3] + r), walls, others: [] };
  follow(n, { gap: 1.5, space: 0.9 }); const w = watch({ space: 0.9, behind: 6 }), blocked = (x, z) => W.blocked(x, z, 0);
  const move = (x, z) => { W.px = x; W.pz = z; return [x, z]; }, step = (dt) => tick(n, dt, W);
  let p = drive({ from: [0, 0], route: [[0, 2.5], [6, 2.5]], stops: [1], move, step, people: [n], w, blocked });   /* away, then along the wall */
  p = drive({ from: p, route: [[0, 2.5]], move, step, people: [n], w, blocked });   /* straight back at them */
  assert.deepEqual(w.lines(n, 'follower'), []);
});

test('menu lists every game in Jamaica\'s timeline, oldest first', async () => {
  const { readFileSync, existsSync, readdirSync } = await import('node:fs');
  const page = readFileSync('menu/index.html', 'utf8'), html = page.slice(page.indexOf('<section class="games"'), page.indexOf('</section>', page.indexOf('<section class="games"'))), cards = [...html.matchAll(/<a class="game[^"]*"([^>]*)>/g)].map((m) => m[1]);
  assert.ok(cards.length > 0);
  const years = cards.map((a) => { const y = a.match(/data-year="(\d{3,4})"/), g = a.match(/data-game="([a-z0-9-]+)"/); assert.ok(y, 'a game card has no data-year: ' + a); assert.ok(g && existsSync('games/' + g[1]), 'a game card names no game folder: ' + a); return +y[1]; });
  assert.deepEqual(years, [...years].sort((a, b) => a - b), 'menu cards out of order: ' + years.join(', '));
  const menuGames = cards.map((a) => a.match(/data-game="([a-z0-9-]+)"/)[1]);
  const playableGames = readdirSync('games').filter((g) => !g.startsWith('_') && existsSync('games/' + g + '/site/index.html')).sort();
  assert.equal(playableGames.length, 10, 'expected all ten history games to be present');
  assert.deepEqual([...menuGames].sort(), playableGames, 'every playable game must have exactly one main menu card');
});

import './chapter-guidance.mjs';
