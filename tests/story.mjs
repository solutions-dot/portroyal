/* engine/story.js: a small fake game proves each of the owner's three story-flow rules (docs/STANDARD.md, "Story flow").
   Run with npm test (tests/regressions.mjs imports this file). */
import test from 'node:test';
import assert from 'node:assert/strict';
import { Group, Bone, Mesh, SkinnedMesh, Skeleton, BoxGeometry, MeshBasicMaterial, PerspectiveCamera } from 'three';
import { createStory, createCarry, checkFlow, goalWithCount, arrowPose, REDIRECT } from '../engine/story.js';

/* the fake game: a yard with five people, a pile of bunches, a wagon, a tree (optional) and a gate */
const PEOPLE = { gran: [0, 10], clive: [8, 0], abel: [-6, 0], boy: [3, 3], nurse: [20, 0] };
const THINGS = { bunch: [0, -5], wagon: [5, -5], tree: [1, 1], gate: [0, 30] };
function fakeGame(over = {}) {
  const G = { stage: null, pos: [0, 0], log: [], shown: {}, quiet: true };
  const steps = {
    10: { goal: 'Talk to Gran, Mr. Clive and Mr. Abel.', needs: { talk: ['gran', 'clive', 'abel'] }, next: 11 },
    11: { goal: 'Carry banana bunches to the wagon.', needs: { do: [{ id: 'bunch', n: 3, carry: 'bunch' }] }, optional: ['tree'], next: 12 },
    12: { goal: 'Walk to the gate.', needs: { go: ['gate'] }, next: 13 },
    13: { goal: 'Look around the yard.', needs: { do: ['wagon', 'tree'] }, explore: true, shows: { wagon: () => {}, tree: () => {} }, next: 14 },
    14: { goal: 'Talk to the nurse.', needs: { talk: ['nurse'] }, end: true },
    ...(over.steps || {}),
  };
  const S = createStory({
    steps,
    where: (id) => (PEOPLE[id] || THINGS[id] || null),
    player: () => G.pos,
    advance: (n) => { G.stage = n; G.log.push('stage ' + n); S.sync(n); },   /* the game's own setStage, which calls sync */
    onGoal: (t) => G.log.push('goal ' + t),
    onArrow: (id) => G.log.push('arrow ' + id),
    flavour: { boy: ['I like the trains.', 'The engine is loud.'], abel: ['The brakes are good today.'], nurse: ['It is a busy day.'], clive: ['Hot one today.'] },
    meet: { boy: [{ who: 'Boy', text: 'Hello! I am Desmond.' }, { who: 'You', text: 'Hello.' }] },
    names: { gran: 'Gran', clive: 'Mr. Clive', abel: 'Mr. Abel', nurse: 'nurse', boy: 'Desmond' },
    items: { bunch: {} },
    ...(over.opts || {}),
  });
  S.shows('bunch', (n, of) => { G.shown.bunch = [n, of]; });
  G.S = S; G.go = (n) => { G.stage = n; S.sync(n); };
  return G;
}

test('rule 1: only the current story people are marked; flavour never moves the story; a person needed later is flavour until their step', () => {
  const G = fakeGame(); G.go(10); const S = G.S;
  assert.equal(S.marked('gran'), true); assert.equal(S.marked('clive'), true); assert.equal(S.marked('abel'), true);
  assert.equal(S.marked('boy'), false); assert.equal(S.marked('nurse'), false, 'the nurse is needed at step 14, so she is flavour now');
  assert.deepEqual(S.talk('gran'), { kind: 'story' });
  assert.equal(S.talk('nurse').kind, 'flavour'); assert.equal(S.talk('nurse').line, 'It is a busy day.');
  assert.equal(S.done('nurse'), false, 'a flavour talk does not count'); assert.equal(S.done('boy'), false); assert.equal(G.stage, 10);
  /* a flavour person with a full first talk plays it once, then short lines that cycle */
  assert.equal(S.talk('boy').kind, 'meet'); assert.equal(S.talk('boy').line, 'I like the trains.'); assert.equal(S.talk('boy').line, 'The engine is loud.'); assert.equal(S.talk('boy').line, 'I like the trains.');
  /* once a story person has done their part they lose the mark and say an "after" line */
  S.done('gran'); assert.equal(S.marked('gran'), false); assert.equal(S.talk('gran').kind, 'after');
  G.go(14); assert.equal(S.marked('nurse'), true); assert.deepEqual(S.talk('nurse'), { kind: 'story' }); assert.equal(S.marked('gran'), false);
});

test('rule 1: any order works and the goal counts; an ordered step marks only the next person', () => {
  const G = fakeGame(); G.go(10); const S = G.S;
  assert.equal(S.goal(), 'Talk to Gran, Mr. Clive and Mr. Abel: 0 of 3.');
  S.done('abel'); assert.equal(S.goal(), 'Talk to Gran, Mr. Clive and Mr. Abel: 1 of 3.');
  S.done('abel'); assert.deepEqual(S.count(), { n: 1, of: 3 }, 'the same person twice counts once');
  S.done('gran'); S.done('clive'); assert.equal(G.stage, 11, 'the last of the three moves the story on, whatever the order');
  assert.equal(S.goal(), 'Carry banana bunches to the wagon: 0 of 3.');
  assert.ok(G.log.includes('goal Talk to Gran, Mr. Clive and Mr. Abel: 2 of 3.'), 'every count change reaches the goal box');
  const O = fakeGame({ steps: { 20: { goal: 'Talk to Gran, then Mr. Clive.', needs: { talk: ['gran', 'clive'] }, any: false, next: 14 } } }); O.go(20);
  assert.equal(O.S.marked('gran'), true); assert.equal(O.S.marked('clive'), false);
  assert.equal(O.S.done('clive'), false, 'out of turn does not count'); assert.equal(O.S.talk('clive').kind, 'after');
  O.S.done('gran'); assert.equal(O.S.marked('clive'), true);
  assert.equal(goalWithCount('Pass the bucket: {n} of {of}.', 1, 3), 'Pass the bucket: 1 of 3.');
  assert.equal(goalWithCount('Talk to Gran.', 0, 1), 'Talk to Gran.', 'one thing to do needs no count');
});

test('rule 2: the arrow shows 2.5 s after a new goal even while walking, 5 s for explore, and only quiet time counts', () => {
  const G = fakeGame(); G.go(10); const S = G.S; let t = 0, a;
  for (; t <= 2400; t += 100) { G.pos = [Math.cos(t / 300), Math.sin(t / 300)]; a = S.tick(t, true); assert.equal(a.show, false); }
  for (; t <= 2600; t += 100) { G.pos = [Math.cos(t / 300), Math.sin(t / 300)]; a = S.tick(t, true); }
  assert.equal(a.show, true, 'shown by 2.6 s while the child keeps moving');
  assert.equal(G.log.filter((l) => l.startsWith('arrow')).length, 1, 'onArrow once a step (pop the goal open)');
  G.pos = [10, -20]; G.go(13); t = 10000; S.tick(t, true); for (let k = 0; k < 45; k++) { t += 100; a = S.tick(t, true); } assert.equal(a.show, false, 'explore: not yet at 4.5 s');
  for (let k = 0; k < 6; k++) { t += 100; a = S.tick(t, true); } assert.equal(a.show, true, 'explore: shown by 5.1 s');
  G.go(14); t = 20000; S.tick(t, true); for (let k = 0; k < 40; k++) { t += 100; a = S.tick(t, false); } assert.equal(a.show, false, 'a talk or card does not count');
  for (let k = 0; k < 26; k++) { t += 100; a = S.tick(t, true); } assert.equal(a.show, true);
});

test('rule 2: the arrow points only at unfinished needs, nearest first, moves on at once, never at optional actions', () => {
  const G = fakeGame(); G.go(10); const S = G.S; let t = 0;
  G.pos = [6, 0]; for (; t <= 3000; t += 100) S.tick(t, true);
  assert.equal(S.tick(t += 100).id, 'clive', 'nearest first');
  S.done('clive'); assert.equal(S.tick(t += 16).id, 'abel', 'next need at once, no new wait');
  assert.equal(S.tick(t += 16).show, true);
  S.done('abel'); assert.equal(S.tick(t += 16).id, 'gran');
  G.pos = [0, 9]; const n = S.tick(t += 16); assert.equal(n.show, false); assert.equal(n.near, true, 'hides at the person: the talk button takes over');
  G.pos = [0, 0]; assert.equal(S.tick(t += 16).show, true, 'walk away and it is back at once');
  /* step 11 has an optional tree right next to the player: the arrow still points at the bunches */
  S.done('gran'); G.pos = [1, 1.5]; for (let k = 0; k < 30; k++) S.tick(t += 100, true);
  assert.equal(S.tick(t += 100).id, 'bunch'); assert.equal(S.needs('tree'), false);
  assert.equal(S.done('tree'), false, 'an optional action never counts');
  /* a target in another place gives nothing to point at, not someone else */
  const H = fakeGame({ opts: { where: (id) => (id === 'gran' ? null : PEOPLE[id] || THINGS[id]) } }); H.go(14); assert.equal(H.S.pick().id, 'nurse');
});

test('rule 2: the game route callback leads the arrow round walls (Port Royal nudgeStep, Eventide gate)', () => {
  let asked = null;
  const G = fakeGame({ opts: { route: (tgt, p, stage) => { asked = [tgt, p, stage]; return tgt[1] > 20 ? [0, 8, false] : tgt; } } }); G.go(12); let t = 0;
  for (; t <= 3000; t += 100) G.S.tick(t, true);
  const a = G.S.tick(t); assert.deepEqual([a.x, a.z, a.final], [0, 8, false]); assert.deepEqual(a.target, [0, 30]); assert.equal(asked[2], 12);
  const p = arrowPose({ dx: 0, dz: -5, yaw: 0, ndc: [0, 0, 0.5], W: 400, H: 800, final: false }); assert.equal(p.cls, 'down'); assert.equal(p.label, 'This way');
  assert.equal(arrowPose({ dx: 0, dz: 5, yaw: 0, ndc: [0, 0, 2], W: 400, H: 800 }).label, 'Turn around');
});

test('rule 3: a "do" need calls its visible change; save and restore put it back', () => {
  const G = fakeGame(); G.go(11); const S = G.S;
  S.done('bunch'); assert.deepEqual(G.shown.bunch, [1, 3]); assert.equal(S.goal(), 'Carry banana bunches to the wagon: 1 of 3.');
  const saved = S.save(); G.shown = {};
  const R = fakeGame(); R.stage = 11; R.S.restore(saved); assert.deepEqual(R.shown.bunch, [1, 3]); assert.equal(R.S.goal(), 'Carry banana bunches to the wagon: 1 of 3.');
});

test('one table at a time: stages outside the table leave the game in charge', () => {
  const G = fakeGame(); G.go(99); const S = G.S;
  assert.equal(S.owns(), false); assert.equal(S.marked('gran'), null); assert.equal(S.talk('gran'), null); assert.equal(S.goal(), null); assert.equal(S.tick(0).show, false); assert.equal(S.done('gran'), false);
  G.go(10); assert.equal(S.owns(), true);
  const L = fakeGame({ steps: { 14: { goal: 'Talk to the nurse.', needs: { talk: ['nurse'] }, next: 30 } } }); L.go(14); L.S.done('nurse'); assert.equal(L.stage, 30, 'next may be a stage the game still runs itself'); assert.equal(L.S.owns(), false);
});

function rig() {   /* a body with a right arm and hand, as tests/regressions.mjs builds for grip */
  const model = new Group(), hips = new Bone(), arm = new Bone(), elbow = new Bone(), hand = new Bone();
  for (const [b, name] of [[hips, 'Hips'], [arm, 'RightArm'], [elbow, 'RightForeArm'], [hand, 'RightHand']]) b.name = 'mixamorig' + name;
  model.add(hips); hips.add(arm); arm.add(elbow); elbow.add(hand); elbow.position.y = -0.3; hand.position.y = -0.3;
  const mesh = new SkinnedMesh(new BoxGeometry(), new MeshBasicMaterial()); model.add(mesh); model.updateMatrixWorld(true); mesh.bind(new Skeleton([hips, arm, elbow, hand]));
  return { model, hand };
}
test('rule 3: carry shows the item in the hand (camera slot or grip), place leaves it where it goes', () => {
  const camera = new PerspectiveCamera(), pile = new Group(), wagon = new Group(), bunch = new Mesh(new BoxGeometry(0.3, 0.3, 0.3), new MeshBasicMaterial()); bunch.name = 'bunch'; pile.add(bunch);
  const { model, hand } = rig(); const C = createCarry({ camera, body: model, view: 'first' });
  C.carry(bunch); assert.equal(bunch.parent, camera); assert.equal(pile.children.length, 0, 'the pile goes down by one'); assert.deepEqual(C.issues(), []);
  assert.deepEqual(bunch.position.toArray(), [0.32, -0.4, -0.6]);
  C.view('third'); assert.equal(bunch.parent.parent, hand, 'third person: in the grip of the player body'); assert.equal(model.userData.grips.length, 1); assert.deepEqual(C.issues(), []);
  C.place(bunch, { parent: wagon, at: [0.2, 1, 0], ry: 0.5 }); assert.equal(bunch.parent, wagon); assert.equal(bunch.visible, true); assert.equal(C.holding(), null);
  assert.equal(model.userData.grips.length, 0, 'the hand lets go'); assert.equal(hand.children.length, 0);
  const lamp = new Mesh(new BoxGeometry(), new MeshBasicMaterial()); lamp.name = 'lamp'; C.view('first'); C.carry(lamp); lamp.visible = false;
  assert.match(C.issues()[0], /hidden/); assert.equal(C.drop(), lamp); assert.equal(lamp.parent, null);
});

test('?test=flow passes a good table and catches each kind of mistake', () => {
  const G = fakeGame(); const r = checkFlow(G.S, { start: () => [0, 0] });
  assert.deepEqual(r.issues, []); assert.match(r.text, /FLOW 0$/);
  const B = fakeGame({
    steps: {
      30: { goal: 'Pass the bucket: {n}.', needs: { do: [{ id: 'bucket', n: 3 }] }, next: 31 },
      31: { goal: 'Look at the tree.', needs: { do: ['tree'] }, optional: ['tree'], shows: { tree: () => {} }, next: 32 },
      32: { goal: 'Talk to Ivy.', needs: { talk: ['ivy'] }, story: ['ivy'], next: 33 },
      33: { goal: 'Carry the plate.', needs: { do: [{ id: 'plate', carry: 'plate' }] }, shows: { plate: () => {} } },
    },
    opts: { flavour: { boy: ['Talk to Gran first.', 'Mr. Clive is nice.', 'So hot — phew.'], clive: ['Come back later.'] }, delay: 4000 },
  });
  const t = checkFlow(B.S, { start: () => [0, 0] }).text;
  for (const want of [/flow 30: goal "Pass the bucket: 0\." has 3 things to do but no count/, /flow 30: do "bucket" has no visible change/,
    /flow 31: the arrow points at "tree", which is not needed now/, /flow 32: story person "ivy" is not in the place/, /flow 32: the arrow has no target/,
    /flow 33: has needs but no next step/, /flow 33: do "plate" carries "plate" but no such item/, /the arrow shows after 4\.\d s \(at most 3 s\)/,
    /boy says "Talk to Gran first\.": a flavour line must not send you on/, /boy says "Mr\. Clive is nice\.": a flavour line names Mr\. Clive/,
    /clive says "Come back later\."/, /no em dashes/]) assert.match(t, want);
  assert.ok(REDIRECT.test('Then go and see Bass Henry.')); assert.ok(!REDIRECT.test('The engine is loud.'));
});
