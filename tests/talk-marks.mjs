/* one talk sign, on the person the story needs now, in every game (owner, 21 November 2026; engine/marks.js) */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { showTalkMark, showTalkBubble } from '../engine/marks.js';

test('the mark is only over a needed person, and gives way to the bubble when near', () => {
  assert.equal(showTalkMark(true, false), true);
  assert.equal(showTalkMark(true, true), false, 'near: the bubble takes over');
  assert.equal(showTalkMark(false, false), false, 'nobody else gets a mark');
  assert.equal(showTalkBubble(false), false, 'nobody else gets a bubble');
  assert.equal(showTalkBubble(true), true);
});

test('every game asks the engine who gets a talk sign', () => {
  for (const g of readdirSync('games').filter((d) => !d.startsWith('_'))) {
    const src = readdirSync(`games/${g}/src`).filter((f) => f.endsWith('.js')).map((f) => readFileSync(`games/${g}/src/${f}`, 'utf8')).join('\n');
    if (!/markAt\(/.test(src)) continue;   /* a game with no talk marks */
    assert.match(src, /showTalkMark\(/, `${g}: the mark uses showTalkMark (engine/marks.js)`);
    assert.match(src, /showTalkBubble\(/, `${g}: the near bubble uses showTalkBubble (engine/marks.js)`);
  }
});
