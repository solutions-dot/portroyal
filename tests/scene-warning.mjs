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

/* owner, 27 November 2026: no warning card before a scene, in any game, and it must never flash */
test('with the card off, a scene starts at once and the card is never built', async () => {
  const { sceneWarning, SHOW_CARD } = await import('../engine/scene-warning.js');
  assert.equal(SHOW_CARD, false);
  let built = 0, watched = 0, read = 0;
  sceneWarning(() => { built++; }, { title: 'A', what: ['x'], scary: true, hurt: true, watch: () => { watched++; }, read: () => { read++; } });
  sceneWarning(() => { built++; }, { title: 'B', what: ['x'], scary: false, watch: () => { watched++; }, read: () => { read++; } });
  assert.deepEqual([built, watched, read], [0, 2, 0], 'the card is not built, the scene runs, and nobody is sent to the read card');
});
test('no game opens its own scene card without asking SHOW_CARD (Tivoli keeps its card HTML but must not show it)', () => {
  const src = readFileSync(new URL('../games/tivoli/src/fight.js', import.meta.url), 'utf8');
  const open = src.slice(src.indexOf('export function openCard()'), src.indexOf('function show('));
  assert.match(open, /if \(!SHOW_CARD\) \{ begin\(\); return; \}/, 'Tivoli openCard starts the scene at once while the card is off');
  assert.ok(open.indexOf('!SHOW_CARD') < open.indexOf("$('fightcard').hidden = false"), 'the check comes before the card is shown');
});
