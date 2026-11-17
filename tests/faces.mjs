/* engine/faces.js: no two people with one face side by side (17 November 2026). Run with npm test (tests/regressions.mjs imports this file).
   What is tested: spreadBodies gives close copies of one body different faces, counts where movers go, falls back to another body, and
   faceCheck reports what is left (twins, look-alikes), leaves out one person shown twice and a grown-up beside a child. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { spreadBodies, faceCheck, placeFaces, reachOf, faceOf } from '../engine/faces.js';

test('faces: close copies of one body get different faces, far ones may share', () => {
  const s = [{ base: 'man', x: 0, z: 0 }, { base: 'man', x: 1, z: 0 }, { base: 'man', x: 2, z: 0 }, { base: 'man', x: 30, z: 0 }, { base: 'woman', x: 0.5, z: 0 }];
  assert.equal(spreadBodies(s, () => 2), 0);
  assert.equal(new Set(s.slice(0, 3).map((e) => e.variant)).size, 3); assert.equal(s[3].variant, ''); assert.equal(s[4].variant, '');
  assert.deepEqual(faceCheck(s.map((e, i) => ({ id: 'p' + i, face: e.base + e.variant + '_lo', x: e.x, z: e.z }))), []);
});
test('faces: a story person keeps the body\'s own face, or the variant it names', () => {
  const s = [{ base: 'man', x: 1, z: 0 }, { base: 'man', x: 0, z: 1 }];
  spreadBodies(s, () => 2, { fixed: [{ base: 'man', x: 0, z: 0 }, { base: 'man', x: 1, z: 1, variant: '_b' }] });
  assert.equal(s[0].variant, '_c'); assert.equal(s[1].variant, '_c');   /* each is beside both story people; the two extras are 1.4 m apart, so one is left over */
});
test('faces: a mover is measured over its whole walk', () => {
  const walker = { base: 'man', x: -20, z: 0, life: { kind: 'wander', pts: [[-20, 0], [20, 0]] } }, stander = { base: 'man', x: 15, z: 1 };
  assert.deepEqual(reachOf(walker), [-20, 0, 20, 0]);
  spreadBodies([stander, walker], () => 2); assert.notEqual(stander.variant, walker.variant);
  const chased = { base: 'girl', x: 0, z: 0, life: { kind: 'play', area: [-2, -2, 2, 2] } }, chaser = { base: 'girl', x: 12, z: 0, life: { kind: 'play', area: [10, -2, 14, 2], chase: chased } };
  assert.deepEqual(reachOf(chaser), [-2, -2, 14, 2]);   /* a chaser runs right up to the other child */
  /* the check sees a walker pass a stander with the same face, and not when they are told apart */
  const twins = faceCheck([{ id: 'walker', face: 'man_lo', x: -20, z: 0, life: walker.life }, { id: 'stander', face: 'man', x: 15, z: 1 }]);
  assert.equal(twins.length, 1); assert.match(twins[0], /^twins: walker and stander have the same face/);
  assert.deepEqual(faceCheck([{ id: 'walker', face: 'man_b_lo', x: -20, z: 0, life: walker.life }, { id: 'stander', face: 'man', x: 15, z: 1 }]), []);
});
test('faces: with no face left, another body of the same kind is taken and the game is told', () => {
  const s = [0, 1, 2, 3].map((i) => ({ base: 'girl', x: i * 0.8, z: 0 })), told = [];
  const left = spreadBodies(s, () => 2, { alts: () => ['girl', 'girl_small'], rebase: (e, b, was) => told.push([b, was]) });
  assert.equal(left, 0); assert.deepEqual(told, [['girl_small', 'girl']]); assert.equal(s.filter((e) => e.base === 'girl_small').length, 1);
  const none = [0, 1, 2, 3].map((i) => ({ base: 'boy', x: i * 0.8, z: 0 })); assert.equal(spreadBodies(none, () => 2), 1);   /* four boys, three faces: one is left */
});
test('faces: the check tells look-alikes from twins, and leaves out one person twice and a child by a grown-up', () => {
  const P = (id, face, x, o = {}) => ({ id, face, x, z: 0, cols: [0x203040, 0x808080], ...o });
  const l = faceCheck([P('a', 'man_suit', 0), P('b', 'man_suit_lo', 1), P('c', 'man_suit_crowd', 2, { cols: [0xff0000, 0x808080] }), P('d', 'man_suit', 9)]);
  assert.equal(l.length, 3); assert.match(l[0], /^lookalike: a and b look like the same person, 1\.0 m apart/); assert.match(l[1], /^twins: a and c/); assert.match(l[2], /^twins: b and c/);
  assert.deepEqual(faceCheck([P('garvey3', 'garvey1916', 0, { who: 'garvey' }), P('garvey4', 'garvey1916', 1, { who: 'garvey' })]), []);
  assert.deepEqual(faceCheck([P('mother', 'girl', 0, { scale: 1 }), P('child', 'girl', 1, { scale: 0.8 })]), []);
  assert.match(faceCheck([P('roy', 'man_elder', 0, { story: true }), P('clarke', 'man_elder', 1, { story: true })])[0], /two story people on one body/);
  assert.equal(faceOf('wr_kman48_b_phone'), 'wr_kman48_b');
  /* the form the Kendal family of games uses: home spots, bodyId, extras */
  const m = (v) => ({ visible: v, scale: { y: 1 }, traverse() {} });
  assert.equal(placeFaces([{ id: 'x', bodyId: 'boy', hx: 0, hz: 0, x: 50, z: 0, m: m(false) }, { base: 'boy', bodyId: 'boy_lo', hx: 1, hz: 0, x: 1, z: 0, m: m(false), extra: true }]).length, 1);
});
