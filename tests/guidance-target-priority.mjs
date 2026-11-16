import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// These games use explicit per-stage required-person selectors.
// Guard against optional actions taking precedence over an unfinished conversation.
for (const game of ['garvey','bog-walk','nanny','melissa','eventide']) {
  test(game + ': required story people precede optional actions in guidance', () => {
    const source = readFileSync('games/' + game + '/src/main.js', 'utf8');
    const start = source.indexOf('function nudgeTarget()');
    assert.ok(start >= 0, 'missing nudgeTarget');
    const end = source.indexOf('\nfunction ', start + 10);
    const block = source.slice(start, end < 0 ? undefined : end);
    const person = block.search(/wantsTalk\(n\)|markWanted\(n\)/);
    const action = block.indexOf('.actions.find(') >= 0 ? block.indexOf('.actions.find(') : block.indexOf('ACTIONS.find(');
    assert.ok(person >= 0 && action > person, 'required-person targeting must come before action fallback');
  });
}
