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
