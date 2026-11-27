/* A person sent to talk (engine/follow.js goTo) stops at a talking distance and never walks through the player (owner, 27 November 2026). */
import { goTo, tick } from '../engine/follow.js';
import assert from 'node:assert/strict';
const person = (x, z) => ({ x, z, m: { rotation: { y: 0 }, visible: true, position: { set() {} } }, ctl: { play() {}, rest() {}, pace() {}, cur: null } });
const world = (px, pz) => ({ px, pz, walls: [], bounds: null, blocked: () => false, others: [], talking: null });
function run(label, start, target, player) {
  const n = person(...start); let arrived = false, closest = 1e9;
  goTo(n, target[0], target[1], { speed: 1.4, done: () => { arrived = true; } });
  for (let i = 0; i < 900 && !arrived; i++) { tick(n, 1 / 30, world(...player)); closest = Math.min(closest, Math.hypot(player[0] - n.x, player[1] - n.z)); }
  assert.ok(arrived, label + ': never arrived');
  assert.ok(closest >= 0.95, `${label}: came within ${closest.toFixed(2)} m of the player`);
  return closest;
}
const a = run('sent to the player\'s own spot', [10, 0], [0, 0], [0, 0]);
const b = run('sent a metre past the player', [10, 0], [-1, 0], [0, 0]);
const c = run('sent to a spot far from the player', [10, 0], [10, 8], [0, 0]);
console.log(`goto-space ok: closest ${a.toFixed(2)}, ${b.toFixed(2)}, ${c.toFixed(2)} m`);
