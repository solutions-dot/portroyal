/* engine/chapter-end.js: the "Chapter N is finished" card waits for a clear screen and a pause (owner, 21 November 2026) */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { offerNextChapter, PAUSE_MS } from '../engine/chapter-end.js';

test('the card waits for the pause, not the moment the last action ends', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] }); const tick = (ms) => { for (let k = 0; k < ms; k += 100) t.mock.timers.tick(100); };
  let shown = 0; offerNextChapter({ show: () => shown++ });
  tick(PAUSE_MS - 400); assert.equal(shown, 0, 'not yet');
  tick(600); assert.equal(shown, 1, 'shown after the pause');
  tick(5000); assert.equal(shown, 1, 'shown once');
});

test('a panel open restarts the pause; the card never covers it', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] }); const tick = (ms) => { for (let k = 0; k < ms; k += 100) t.mock.timers.tick(100); };
  let open = true, shown = 0; offerNextChapter({ clear: () => !open, show: () => shown++ });
  tick(10000); assert.equal(shown, 0, 'waits while a panel is open, however long');
  open = false; tick(PAUSE_MS - 400); assert.equal(shown, 0, 'a full pause after it closes');
  tick(600); assert.equal(shown, 1);
});

test('nothing shows once the player has moved on', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] }); const tick = (ms) => { for (let k = 0; k < ms; k += 100) t.mock.timers.tick(100); };
  let here = true, shown = 0; offerNextChapter({ still: () => here, show: () => shown++ });
  tick(1000); here = false; tick(10000); assert.equal(shown, 0);
});

test('no game offers "Stay here" on a finished chapter', async () => {
  const { readFileSync, readdirSync } = await import('node:fs');
  for (const g of readdirSync('games').filter((d) => !d.startsWith('_'))) {
    for (const f of readdirSync(`games/${g}/src`).filter((x) => x.endsWith('.js'))) {
      const src = readFileSync(`games/${g}/src/${f}`, 'utf8');
      assert.doesNotMatch(src, /t: 'Stay here'|\["Stay here"/, `${g}/${f} still offers Stay here`);
    }
  }
});
