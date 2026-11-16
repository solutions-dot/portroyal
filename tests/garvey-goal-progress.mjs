import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Garvey multi-person goals show remaining progress and refresh after each talk', () => {
  const s = readFileSync('games/garvey/src/main.js', 'utf8');
  assert.match(s, /required\.filter\(\(id\) => byId\(id\)\?\.talked\)\.length/);
  assert.match(s, /required\.length > 1 \? ' \(' \+ done \+ ' of ' \+ required\.length/);
  assert.match(s, /if \(t\.every\(\(id\) => byId\(id\)\.talked\)\) setStage\(NEXT_AFTER_TALK\[stage\]\); else setGoal\(\);/);
});
