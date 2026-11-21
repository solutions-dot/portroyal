/* nobody sends you back to someone you already talked to: they call you or walk to you (owner, 21 November 2026; engine/return-talk.js) */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { returningTalker, comeOver } from '../engine/return-talk.js';

test('a single talk with someone met earlier in the chapter is a return; a new person or a group is not', () => {
  const T = { 60: ['grant'], 62: ['kemar'], 63: ['grant'], 64: ['kemar'], 70: ['grant'] };
  const name = (i) => i;
  assert.equal(returningTalker(T, 60, name), null, 'first meeting');
  assert.equal(returningTalker(T, 63, name), 'grant');
  assert.equal(returningTalker(T, 64, name), 'kemar');
  assert.equal(returningTalker(T, 70, name), null, 'a new chapter starts fresh');
  assert.equal(returningTalker({ 10: ['a', 'b'], 12: ['a', 'b'] }, 12, name), null, 'a group is still walked to');
  assert.equal(returningTalker({ 10: ['papa51'], 15: ['papaR51'] }, 15, (i) => ({ papa51: 'Papa', papaR51: 'Papa' })[i]), 'papaR51', 'the same person in a new spot');
});

test('they walk up to you, or talk at once when close or when the game cannot walk them', () => {
  let said = 0, sent = null;
  comeOver({ x: 1, z: 0 }, { px: 0, pz: 0, goTo: () => { sent = 1; }, talk: () => said++ }); assert.equal(said, 1, 'close: talks at once');
  comeOver({ x: 10, z: 0 }, { px: 0, pz: 0, goTo: (n, x, z, o) => { sent = [x, z]; o.done(); }, talk: () => said++ });
  assert.deepEqual(sent, [1.5, 0], 'stops a step away'); assert.equal(said, 2, 'talks when they arrive');
  comeOver({ x: 10, z: 0 }, { px: 0, pz: 0, talk: () => said++ }); assert.equal(said, 3, 'no goTo: talks from there');
});

test('every game with talk steps calls returning people over', () => {
  for (const g of ['garvey', 'kendal', 'nanny', 'melissa', 'eventide', 'bog-walk', 'windrush']) {
    const src = readFileSync(`games/${g}/src/main.js`, 'utf8');
    assert.match(src, /returningTalker\(/, `${g}: engine/return-talk.js`);
  }
  assert.match(readFileSync('games/port-royal/src/main.js', 'utf8'), /callBack\(\{/, 'port-royal: Abba calls you in the camp');
});
