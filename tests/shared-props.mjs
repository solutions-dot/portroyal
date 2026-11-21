/* props that live in the engine are not copied back into games (rule 10, owner, 21 November 2026) */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

test('every water tower comes from engine/water-tower.js', () => {
  for (const g of readdirSync('games').filter((d) => !d.startsWith('_'))) {
    for (const f of readdirSync(`games/${g}/src`).filter((x) => x.endsWith('.js'))) {
      const src = readFileSync(`games/${g}/src/${f}`, 'utf8');
      const m = src.match(/export function waterTower\(\)\s*\{([^\n]*)/);
      if (m) assert.match(m[1], /buildWaterTower\(/, `${g}/${f}: waterTower() must call buildWaterTower (engine/water-tower.js)`);
    }
  }
});
