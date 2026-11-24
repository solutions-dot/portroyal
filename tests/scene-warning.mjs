/* the one card before a cinematic, the same in every game (owner, 21 November 2026): engine/scene-warning.js writes the words and the buttons */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { warningLines, warningText, SCARY_LINES, WATCH, READ, sceneIsCalm } from '../engine/scene-warning.js';

test('a scary scene gets the two standard lines; a plain one does not', () => {
  assert.deepEqual(warningLines(['The next part is loud.']), ['The next part is loud.', ...SCARY_LINES]);
  assert.deepEqual(warningLines('Tilbury comes into view.', false), ['Tilbury comes into view.']);
  assert.deepEqual(SCARY_LINES, ['It may be scary.', 'Nobody is hurt on the screen.']);
  assert.equal(WATCH, 'Watch scene'); assert.equal(READ, 'Read what happened instead');
  assert.equal(sceneIsCalm(), false, 'no calm mode');
  assert.equal(warningText(['The next part is loud.']), 'The next part is loud. It may be scary. Nobody is hurt on the screen.', 'one paragraph');
});

test('every game uses the standard card and writes no scary wording of its own', () => {
  const games = readdirSync('games').filter((d) => !d.startsWith('_'));
  const users = [];
  for (const g of games) {
    const src = readdirSync(`games/${g}/src`).filter((f) => f.endsWith('.js')).map((f) => readFileSync(`games/${g}/src/${f}`, 'utf8')).join('\n');
    assert.doesNotMatch(src, /sceneWarning\(card, \{[^}]*\blines:/, `${g}: pass what:, the engine adds the standard lines`);
    assert.doesNotMatch(src, /may (be|feel) scary|No one is shown hurt/, `${g}: the scary lines come from engine/scene-warning.js`);
    assert.doesNotMatch(src, /"Read instead"|'Read instead'|"A short scene"/, `${g}: the buttons come from engine/scene-warning.js`);
    assert.doesNotMatch(src, /card\(\s*['"]What happened['"]/, `${g}: the What happened card comes from readWhatHappened (engine/scene-warning.js)`);
    if (/sceneWarning\(|addSceneWarningOptions\(/.test(src)) users.push(g);
  }
  assert.deepEqual(users.sort(), games.filter((g) => g !== 'garvey').sort(), 'every game with a cinematic uses the card (Garvey has none)');
});

test('a warning card never says nobody is hurt twice, and leaves it out where people are hurt on screen', () => {
  assert.deepEqual(warningLines(['Nobody is hurt in front of you.']), ['Nobody is hurt in front of you.', 'It may be scary.']);
  assert.deepEqual(warningLines(['People fall, far off.'], true, { hurt: true }), ['People fall, far off.', 'It may be scary.']);
});
