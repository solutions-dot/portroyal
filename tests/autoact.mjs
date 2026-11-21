/* story actions happen when you reach them (owner, 21 November 2026; engine/autoact.js) */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createAutoAct, AUTO_DELAY } from '../engine/autoact.js';

test('fires after the pause, once, and not for exits', () => {
  const a = createAutoAct(); let n = 0; const act = { id: 'board' };
  a.tick(AUTO_DELAY / 2, act, 0, 0, () => n++); assert.equal(n, 0, 'not at once');
  a.tick(AUTO_DELAY, act, 0, 0, () => n++); assert.equal(n, 1, 'after the pause');
  a.tick(1, act, 0, 0, () => n++); assert.equal(n, 1, 'once, until you walk on');
  a.tick(1, { id: 'next' }, 0.2, 0, () => n++); assert.equal(n, 1, 'a spot right beside it waits');
  a.tick(1, { id: 'next' }, 1, 0, () => n++); a.tick(1, { id: 'next' }, 1, 0, () => n++); assert.equal(n, 2, 'after walking a little');
  const b = createAutoAct(); let m = 0; b.tick(5, { id: 'door', exit: true }, 0, 0, () => m++); assert.equal(m, 0, 'a way out keeps its button');
});

test('every game with things to do uses it', () => {
  for (const g of readdirSync('games').filter((d) => !d.startsWith('_') && d !== 'tivoli')) {
    const src = readdirSync(`games/${g}/src`).filter((f) => f.endsWith('.js')).map((f) => readFileSync(`games/${g}/src/${f}`, 'utf8')).join('\n');
    assert.match(src, /createAutoAct\(\)/, `${g}: story actions on arrival (engine/autoact.js)`);
  }
});
