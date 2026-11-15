/* engine/ambient.js: background life in a small fake place, checked by the same ambientCheck the games run as ?test=ambient.
   Run with npm test (tests/regressions.mjs imports this file). The bodies are bare bone chains with a fake animation controller,
   so the tests need no models: what is tested is where people go, which clips they play, and the check itself. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { Group, Bone } from 'three';
import { createAmbient, ambientCheck, ambientTest, onKeepOff } from '../engine/ambient.js';

/* clip lengths, as in the shared library */
const DUR = { Idle: 16.6, Walk: 1.03, WalkM: 1.03, Run: 1.1, Talk1: 3.9, Talk2: 5.2, Talk3: 10.3, TalkM1: 5.2, TalkM2: 3.8, Laugh: 9.8, Carry: 2.9, CarryIdle: 10, CarryBagWalk: 1.27, PickUp: 9.6, SitIdle: 4.3, SitTalk: 44, SitPoseM: 0.03, Sad1: 2.7, Sad2: 4, Clap: 1.2, Cheer: 2.9, Point: 2.8 };
const ALL = Object.keys(DUR), STRIDE = 1.3;   /* metres one walk loop covers on these fake bodies */
/* a body: a group with the bones the head turn uses, and a controller that behaves like engine/anim.js animate() */
function body(scale = 1) {
  const m = new Group(), hips = new Bone(), spine = new Bone(), neck = new Bone(), head = new Bone();
  hips.name = 'mixamorigHips'; spine.name = 'mixamorigSpine'; neck.name = 'mixamorigNeck'; head.name = 'mixamorigHead';
  hips.position.y = 0.9; spine.position.y = 0.3; neck.position.y = 0.4; head.position.y = 0.1; m.add(hips); hips.add(spine); spine.add(neck); neck.add(head); m.scale.setScalar(scale);
  const acts = {}, mk = (name) => ({ name, time: 0, timeScale: 1, getClip: () => ({ name, duration: DUR[name] || 4 }) });
  const ctl = { timer: 0, updates: 0, played: [], mx: { update() { ctl.updates++; } }, tick() {},
    get(n) { if (!ALL.includes(n)) return null; return acts[n] || (acts[n] = mk(n)); },
    play(n, once) { const a = n ? this.get(n) : this.base; if (!a || a === this.cur) return; a.time = 0; a.timeScale = 1; this.cur = a; this.played.push(n); this.timer = once ? 1 : 0; },
    pace(v) { this.cur.timeScale = v * this.cur.getClip().duration / STRIDE; } };
  ctl.base = ctl.get('Idle'); ctl.cur = ctl.base; m.userData.anim = ctl; return m;
}
let N = 0;
const person = (x, z, o = {}) => { const m = body(o.scale || 1); m.position.set(x, 0, z); return { id: o.id || 'p' + (N++), x, z, m, ctl: m.userData.anim, sex: o.sex, kid: o.kid }; };

/* the fake place: a yard 24 x 16 m with a table, a hut, a tree and a story path across the middle, and a story person by the gate */
const PLACE = { bounds: { x0: 0, z0: 0, x1: 24, z1: 16 }, walls: [[8, 4, 10, 6], [16, 1, 20, 4.5]], tree: [5, 11, 0.6] };
const blocked = (x, z, r) => Math.hypot(x - PLACE.tree[0], z - PLACE.tree[1]) < PLACE.tree[2] + r;
const KEEP = [{ pts: [[0, 8], [24, 8]], w: 0.6 }, { at: [2, 2], r: 1.2 }];
const STORY = [{ id: 'gran', x: 2, z: 2 }];
function yard(o = {}) {
  N = 0; const life = createAmbient({ bounds: PLACE.bounds, walls: PLACE.walls, blocked, keepOff: KEEP, seed: o.seed || 7, stride: () => STRIDE, ...o.opts });
  const P = {};
  P.w = [person(3, 5), person(12, 3, { sex: 'm' }), person(21, 12), person(14, 13, { sex: 'm' })];
  P.w.forEach((n) => life.add(n, { kind: 'wander', area: [1, 1, 23, 15] }));
  P.chat = [person(12, 11, { sex: 'm' }), person(13, 11), person(12, 12, { sex: 'f' })]; P.chat.forEach((n) => life.add(n, { kind: 'chat', group: 'well', at: [12.5, 11.5] }));
  P.sit = [person(6, 14.2), person(6.7, 14.2)]; P.sit.forEach((n, i) => life.add(n, { kind: 'sit', group: 'bench', seat: { top: 0.45, x: 6 + i * 0.7, z: 14.2, ry: Math.PI }, clips: ['SitIdle', 'SitPoseM'] }));
  P.carry = person(19, 6); life.add(P.carry, { kind: 'work', between: [[19, 6], [22, 10]], show: () => {} });
  P.errand = person(1.5, 13); life.add(P.errand, { kind: 'errand', from: [1.5, 13], to: [10, 14.5], walk: 'CarryBagWalk', prop: 'bag' });
  P.watch = person(22, 14.5); life.add(P.watch, { kind: 'watch', at: [12.5, 11.5], react: ['Clap', 'Point'] });
  P.kids = [person(4, 3.5, { scale: 0.8 }), person(6, 2.5, { scale: 0.8 })];
  life.add(P.kids[0], { kind: 'play', area: [3, 1, 11, 3.5] }); life.add(P.kids[1], { kind: 'play', area: [3, 1, 11, 3.5], chase: P.kids[0] });
  return { life, P };
}
const ROUTE = [[2, 7], [11, 7], [11, 2.5], [7, 2.5], [7, 9.5], [20, 9.5], [20, 7], [3, 7]];   /* the player walks through every group and past every walker */

test('a lively yard runs for a minute with nobody in a solid or a person, no slide, no statue and nobody on the story path', () => {
  const { life } = yard();
  const r = ambientCheck(life, { seconds: 60, route: ROUTE, stops: [2, 5], story: STORY });
  assert.deepEqual(r.lines, [], r.lines.join('\n') + '\n' + r.stats.join('\n'));
  const walked = r.stats.filter((l) => /walked ([1-9]\d*\.\d) m/.test(l) && !/walked 0\.\d m/.test(l)).length;
  assert.ok(walked >= 7, 'the wanderers, the carrier, the errand and both children all walk: ' + r.stats.join('\n'));
});

test('the same yard holds at 0 with other seeds, a player who stands still, and on the phone budget', () => {
  for (const seed of [1, 2, 3, 11]) { const { life } = yard({ seed }); const r = ambientCheck(life, { seconds: 40, route: ROUTE, story: STORY }); assert.deepEqual(r.lines, [], `seed ${seed}:\n` + r.lines.join('\n')); }
  const { life } = yard({ opts: { phone: true } }); const r = ambientCheck(life, { seconds: 40, start: [11, 7.5], story: STORY }); assert.deepEqual(r.lines, [], r.lines.join('\n'));
});

test('ambientTest prints AMBIENT 0 for a good yard', () => { const { life } = yard(); assert.match(ambientTest(life, { seconds: 10, start: [11, 7.4], story: STORY }), /^AMBIENT 0\n/); });

test('walkers keep time with the ground: every walk clip is paced to the speed they really move', () => {
  const { life, P } = yard(); let checked = 0;
  for (let f = 0; f < 600; f++) { const before = P.w.map((n) => [n.x, n.z]); life.tick(1 / 30, { px: 11, pz: 7.5 });
    P.w.forEach((n, i) => { const v = Math.hypot(n.x - before[i][0], n.z - before[i][1]) * 30, a = n.ctl.cur; if (!n.amb.walking || v < 0.3) return; const want = STRIDE * a.timeScale / a.getClip().duration; assert.ok(Math.abs(v - want) < 0.08 + want * 0.25, `${n.id} at ${v.toFixed(2)} m/s, clip paced for ${want.toFixed(2)}`); checked++; }); }
  assert.ok(checked > 200, 'enough walking frames were measured: ' + checked);
  assert.ok(P.w.some((n) => n.ctl.played.includes('WalkM')), 'men walk on the steadier man\'s walk');
});

test('no two people start a clip in step: start times and speeds differ', () => {
  const { life, P } = yard(); for (let f = 0; f < 90; f++) life.tick(1 / 30, { px: 1e3, pz: 1e3 });
  const idle = [...P.w, P.watch].map((n) => n.ctl.cur).filter((a) => a.name === 'Idle');
  const times = new Set(idle.map((a) => a.time.toFixed(3))), speeds = new Set(idle.map((a) => a.timeScale.toFixed(3)));
  assert.equal(times.size, idle.length, 'every idle starts at its own time'); assert.equal(speeds.size, idle.length, 'and plays at its own speed');
  const talkers = P.chat.filter((n) => /^Talk/.test(n.ctl.cur.name)); assert.ok(talkers.length <= 1, 'one at a time talks in a chat group');
});

test('a chat group stands in a ring facing the middle and takes turns; listeners look at the speaker', () => {
  const { life, P } = yard(); const seen = new Set(); let laughs = 0;
  for (let f = 0; f < 30 * 40; f++) { life.tick(1 / 30, { px: 1e3, pz: 1e3 }); const g = life.groups.get('well'); if (g.speaker) seen.add(g.speaker.id); laughs += P.chat.filter((n) => n.ctl.cur.name === 'Laugh').length ? 1 : 0; }
  assert.equal(seen.size, 3, 'everyone in the group gets a turn to talk');
  for (const n of P.chat) { const d = Math.hypot(n.x - 12.5, n.z - 11.5); assert.ok(Math.abs(d - 0.68) < 0.01, 'in the ring'); const face = Math.atan2(12.5 - n.x, 11.5 - n.z), e = Math.atan2(Math.sin(face - n.m.rotation.y), Math.cos(face - n.m.rotation.y)); assert.ok(Math.abs(e) < 0.4, `${n.id} faces the middle (${e.toFixed(2)})`); }
  assert.ok(laughs > 0, 'someone laughs now and then in a lively scene');
});

test('heads turn toward a player who comes near, never past the limit, and ease back', () => {
  const { life, P } = yard({ opts: { lookYaw: 1.0 } }); const n = P.watch; for (let f = 0; f < 60; f++) life.tick(1 / 30, { px: 1e3, pz: 1e3 });
  const ry = n.m.rotation.y, px = n.x + Math.sin(ry + 1.5) * 2, pz = n.z + Math.cos(ry + 1.5) * 2;   /* the player stands to one side, 86 degrees round */
  let max = 0; for (let f = 0; f < 90; f++) { life.tick(1 / 30, { px, pz }); max = Math.max(max, Math.abs(n.amb.look)); }
  assert.ok(max > 0.85 && max <= 1.0 + 1e-6, 'turned toward you, up to the limit: ' + max.toFixed(2));
  assert.ok(Math.abs(n.m.getObjectByName('mixamorigHead').quaternion.y) > 0.05, 'the head bone itself turned');
  const behind = [n.x - Math.sin(n.m.rotation.y) * 2, n.z - Math.cos(n.m.rotation.y) * 2]; for (let f = 0; f < 120; f++) life.tick(1 / 30, { px: behind[0], pz: behind[1] });
  assert.ok(Math.abs(n.amb.look) < 0.7, 'nobody turns their head right round to look behind them');
});

test('only near people animate fully: far ones update their mixer less often (phones)', () => {
  N = 0; const life = createAmbient({ bounds: { x0: -100, z0: -100, x1: 100, z1: 100 }, stride: () => STRIDE, full: 10, mid: 25, maxFull: 3, midEvery: 3, farEvery: 8 });
  const near = [0, 1, 2, 3, 4].map((i) => life.add(person(2 + i, 2), { kind: 'watch', at: [0, 0] })), mid = life.add(person(18, 0), { kind: 'watch', at: [0, 0] }), far = life.add(person(60, 0), { kind: 'watch', at: [0, 0] });
  for (let f = 0; f < 240; f++) life.tick(1 / 30, { px: 0, pz: 0 });
  const u = (n) => n.ctl.updates; assert.ok(u(near[0]) >= 235, 'nearest: every frame'); assert.ok(near.filter((n) => u(n) >= 235).length === 3, 'at most maxFull people get every frame');
  assert.ok(u(mid) > 70 && u(mid) < 90, 'mid distance: every third frame, ' + u(mid)); assert.ok(u(far) > 25 && u(far) < 35, 'far: every eighth frame, ' + u(far));
});

test('a light copy takes over far away and plays the same clip', () => {
  N = 0; const life = createAmbient({ stride: () => STRIDE, far: 30, mid: 20 }); const n = person(50, 0); n.lo = body(); life.add(n, { kind: 'watch', at: [0, 0], react: ['Clap'] });
  for (let f = 0; f < 30; f++) life.tick(1 / 30, { px: 0, pz: 0 }); assert.equal(n.lo.visible, true); assert.equal(n.m.visible, false); assert.equal(n.lo.position.x, 50);
  for (let f = 0; f < 30; f++) life.tick(1 / 30, { px: 49, pz: 0 }); assert.equal(n.lo.visible, false); assert.equal(n.m.visible, true);
});

test('personal space: two walkers sent head-on through a gap pass each other, and stop short of the player', () => {
  N = 0; const life = createAmbient({ bounds: { x0: 0, z0: 0, x1: 20, z1: 4 }, walls: [[0, 0, 20, 1], [0, 3, 20, 4]], stride: () => STRIDE, seed: 3 });
  const a = life.add(person(1, 2), { kind: 'errand', from: [1, 2], to: [19, 2], wait: [1, 2] }), b = life.add(person(19, 2), { kind: 'errand', from: [19, 2], to: [1, 2], wait: [1, 2] });
  const r = ambientCheck(life, { seconds: 50, start: [10, 1.5] }); assert.deepEqual(r.lines, [], r.lines.join('\n'));
  assert.ok(a.amb.leg !== undefined && b.amb.leg !== undefined);
});

test('someone the player walks into steps aside', () => {
  N = 0; const life = createAmbient({ bounds: { x0: 0, z0: 0, x1: 20, z1: 20 }, stride: () => STRIDE });
  const n = life.add(person(10, 10), { kind: 'wander', pts: [[10, 10], [10, 17]], pause: [30, 30] }); n.amb.t = 30;
  let px = 10, pz = 6; for (let f = 0; f < 90; f++) { pz = Math.min(9.3, pz + 2 / 30); life.tick(1 / 30, { px, pz }); }
  assert.ok(Math.hypot(n.x - px, n.z - pz) > 0.8, 'moved out of your way: ' + n.x.toFixed(2) + ',' + n.z.toFixed(2));
});

test('a sad scene is quieter and fewer, and people only go while nobody sees; nobody freezes', () => {
  const { life, P } = yard(); for (let f = 0; f < 60; f++) life.tick(1 / 30, { px: 1e3, pz: 1e3 });
  life.mood('sad'); const view = { x: 12, z: 0.5, yaw: 0 };   /* the camera looks away (yaw 0 looks toward -z), so lively people may go */
  for (let f = 0; f < 60; f++) life.tick(1 / 30, { px: 12, pz: 0.5, view });
  const gone = life.people.filter((n) => n.amb.gone); assert.ok(gone.length >= 2 && gone.length < life.people.length / 2, 'some go, most stay: ' + gone.length);
  assert.ok(gone.every((n) => /^(wander|play|chat)$/.test(n.amb.kind)), 'only lively people go');
  let laughs = 0; for (let f = 0; f < 30 * 30; f++) { life.tick(1 / 30, { px: 12, pz: 0.5, view }); laughs += life.people.filter((n) => n.ctl.cur.name === 'Laugh' || n.ctl.cur.name === 'Cheer').length; }
  assert.equal(laughs, 0, 'no laughing or cheering in a sad scene');
  const r = ambientCheck(life, { seconds: 30, start: [12, 0.5], view: () => view, story: STORY }); assert.deepEqual(r.lines.filter((l) => !/^still/.test(l)), [], r.lines.join('\n'));
  const moving = life.people.filter((n) => !n.amb.gone && /walked [1-9]/.test(r.stats.find((s) => s.startsWith(n.id + ':')) || '')); assert.ok(moving.length >= 2, 'people still walk, more slowly');
  const life2 = yard().life; life2.mood('sad'); const seeAll = { x: 12, z: -6, yaw: Math.PI };   /* now the camera looks at the whole yard: nobody vanishes in view */
  for (let f = 0; f < 90; f++) life2.tick(1 / 30, { px: 12, pz: -6, view: seeAll }); assert.equal(life2.people.filter((n) => n.amb.gone).length, 0);
});

test('nobody stands on a story path: wander goals avoid it and a pause on it walks on', () => {
  const { life, P } = yard(); for (let f = 0; f < 30 * 60; f++) { life.tick(1 / 30, { px: 1e3, pz: 1e3, story: STORY }); for (const n of P.w) if (n.amb.st === 'pause' && n.amb.t > 0.2) assert.equal(onKeepOff(KEEP, n.x, n.z, 0), null, `${n.id} paused on the story path at ${n.x.toFixed(1)},${n.z.toFixed(1)}`); }
});

test('the check finds what is wrong: inside a solid, on a story path, sliding, a statue, a missing clip, a prop clip with an empty hand', () => {
  N = 0; const life = createAmbient({ bounds: PLACE.bounds, walls: PLACE.walls, blocked, keepOff: KEEP, stride: () => STRIDE });
  life.add(person(9, 5, { id: 'intable' }), { kind: 'watch', at: [0, 0] });
  life.add(person(12, 8, { id: 'onpath' }), { kind: 'watch', at: [12, 0] });
  life.add(person(20, 13, { id: 'statue' }), { kind: 'watch', at: [20, 0], every: [40, 40] });
  life.add(person(3, 13, { id: 'nosuch' }), { kind: 'work', clip: 'Sweep' });
  life.add(person(22, 2, { id: 'emptyhand' }), { kind: 'work', clip: 'CarryIdle' });
  life.add(person(14, 14, { id: 'alone' }), { kind: 'chat', group: 'solo' });
  life.add(person(4, 6, { id: 'noseat' }), { kind: 'sit' });
  const slider = life.add(person(1.5, 12, { id: 'slider' }), { kind: 'watch', at: [1.5, 0] }); const tick = life.tick; life.tick = (dt, w) => { tick(dt, w); slider.x += 0.5 * dt; };   /* pushed along on a standing clip */
  const r = ambientCheck(life, { seconds: 30, start: [22, 7.5] }), text = r.lines.join('\n');
  for (const want of [/intable: their spot .* is inside something solid/, /inside: intable/, /onpath: their spot .* is on a story path/, /story: onpath/, /still: statue/, /nosuch asks for the clip Sweep/, /emptyhand plays CarryIdle with nothing in the hand/, /alone chats alone/, /noseat sits with no seat/, /slide: slider moves 0\.50 m\/s on a standing clip/])
    assert.match(text, want);
});

test('a walker who would slide is caught: a walk clip played at the wrong pace', () => {
  N = 0; const life = createAmbient({ bounds: { x0: 0, z0: 0, x1: 20, z1: 20 }, stride: () => STRIDE });
  const n = life.add(person(2, 10, { id: 'skater' }), { kind: 'errand', from: [2, 10], to: [18, 10] }); const tick = life.tick; life.tick = (dt, w) => { tick(dt, w); if (n.amb.walking) n.ctl.cur.timeScale = 0.4; };
  const r = ambientCheck(life, { seconds: 20 }); assert.ok(r.lines.some((l) => /^slide: skater walks at .* paced for/.test(l)), r.lines.join('\n'));
});
