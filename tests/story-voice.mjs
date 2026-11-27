/* one voice path for every game (owner, 27 November 2026): a game reads its words only through engine/storyvoice.js; no game carries its own copy */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const games = readdirSync('games').filter((d) => !d.startsWith('_'));
const src = (g) => readdirSync(`games/${g}/src`).filter((f) => f.endsWith('.js')).map((f) => [f, readFileSync(`games/${g}/src/${f}`, 'utf8')]);

test('every game makes its voice with createStoryVoice and nobody builds a narrator by hand', () => {
  for (const g of games) {
    const all = src(g).map(([, s]) => s).join('\n');
    assert.doesNotMatch(all, /createNarrator\(/, `${g}: use createStoryVoice (engine/storyvoice.js), not createNarrator`);
    assert.match(all, /createStoryVoice\(/, `${g}: make the game's voice with createStoryVoice()`);
  }
});

test('film directors share the page voice channel', () => {
  for (const g of games) {
    const d = `games/${g}/src/director.js`;
    if (!existsSync(d)) continue;
    assert.doesNotMatch(readFileSync(d, 'utf8'), /createFilmVoice\(/, `${g}: the director uses sharedVoice() so narration and characters never overlap`);
  }
});

test('a look scene uses the shared look voice and has no pop-up card', () => {
  for (const g of games) for (const [f, s] of src(g)) {
    if (/createLookShot\(\{/.test(s)) assert.match(s, /\.\.\.SV\.look/, `${g}/${f}: pass ...SV.look to createLookShot`);
    assert.doesNotMatch(s, /card\(lk\.title/, `${g}/${f}: a look scene reads its lines over the close-up (SV.lookLines), no pop-up card`);
  }
});

test('a game with its own dialogue box speaks the lines through SV.line', () => {
  for (const g of games) for (const [f, s] of src(g)) {
    assert.doesNotMatch(s, /NARR\.speak\(\s*\w+\.who\s*\+/, `${g}/${f}: use SV.line(who, text, isMe)`);
  }
});
