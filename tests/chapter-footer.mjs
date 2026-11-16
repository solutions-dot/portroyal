/* Shared chapter menu regression. This is a source contract, not a substitute for mobile screenshots. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

test('all ten games expose the same three chapter footer actions in order', () => {
  const games = readdirSync('games').filter(g => !g.startsWith('_') && existsSync('games/' + g + '/site/index.html')).sort();
  assert.equal(games.length, 10, 'expected ten playable games');
  const expected = [['chteacher', 'Unlock All'], ['chcred', 'Credits'], ['chreset', 'Restart']];
  for (const game of games) {
    const html = readFileSync('games/' + game + '/site/index.html', 'utf8');
    const actions = [...html.matchAll(/<button\s+id="(chteacher|chcred|chreset)"[^>]*>([^<]*)<\/button\s*>/g)]
      .map(m => [m[1], m[2].trim()]);
    assert.deepEqual(actions, expected, game + ': chapter action IDs, names and order differ');
    assert.match(html, /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/,
      game + ': missing three-column grid for mobile controls');
    assert.ok(html.includes('id="chapters"'), game + ': chapter panel missing');
  }
});
