/* games/bog-walk/src/main.js: Bog Walk 1904: The Tube. First build: the inside of the Tube and the night the water came (see docs/games/bog-walk.md).
   You play someone who is fictional. The first slice is one place and one night: scrape rust off the pipe wall with the gang, then the water comes and you
   follow the voices to the manhole. No one can fail and no one is shown in the water. All the spoken lines here are placeholders written for this game. */
import * as THREE from 'three';
import { soundPref, setSound, audioInit, stepSound, uiSound, cue, crackle, AU } from '../../../engine/audio.js';
import { snapMeshes, auditPlace } from '../../../engine/audit.js';   /* dev checks only: it is dropped from the public build */
import { setAniso } from './gfx.js';
import { buildTube, R, SAND, ZMIN, ZMAX, ZM, halfChord } from './tube.js';
import { makeHand } from './hand.js';
import { initTubeSound, setBeds, hushTube, drip, scrapeSound, voice, hiss, clank, waterStep, heartbeat, boom, airSwell } from './sfx.js';

const $ = (id) => document.getElementById(id);
const q = new URLSearchParams(location.search);
const QUICK = __DEV__ && q.has('quick'), TS = QUICK ? 0.15 : 1;   /* in a quick test every timed part runs at 15% of its length */
const D = (s) => s * TS;
const TOUCH = matchMedia('(pointer: coarse)').matches, MOBILE = /Android|iPhone|iPad|Mobi/i.test(navigator.userAgent);
const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
soundPref('bogwalk-sound');

/* ---------- renderer, camera ---------- */
const canvas = $('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, MOBILE ? 1.5 : 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.3;
setAniso(renderer.capabilities.getMaxAnisotropy());
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0a0806); scene.fog = new THREE.Fog(0x0a0806, 3, 36);
const camera = new THREE.PerspectiveCamera(68, 1, 0.08, 120); scene.add(camera);

/* ---------- the Tube, and the torch in your hand ---------- */
const T = buildTube(scene);
const hand = makeHand(camera);
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); hand.place(camera.aspect, camera.fov, h, w); }
addEventListener('resize', resize); resize();

/* ---------- where you are, and the night ---------- */
const S = { started: false, x: 0.12, z: ZM - 1.5, yaw: 0, pitch: 0, eye: SAND + 1.45 };   /* yaw 0 looks down the pipe, toward -z */
const N = { phase: 'title', t: 0, q: [], wl: 0, torch: 1, vig: 0, sky: 0, scraped: 0, allDone: false, doneT: 0, dripT: 2, clankT: 7, voiceT: 5, crackT: 3, mixT: 0, hintT: 0, skipped: false, fast: false, out: null, intro: false, glance: 0, glanceT: 0, glanceOn: false, duck: 0, hbT: 0, lift: 0, cine: false, liftNeed: 0, order: null, handHissed: false, turn: null, deadT: 0 };
const LANE = 0.62;   /* how far from the middle of the pipe you can stand: the wall curves in, and your torch needs room */
const keys = new Set();
function locked() { return !$('card').hidden || !S.started || ['title', 'intro', 'out', 'end'].includes(N.phase); }

/* ---------- words on the screen ---------- */
let goalText = '', subTimer = 0;
function setGoal(t, quiet) { goalText = t; $('goal').textContent = t; if (!quiet) uiSound('goal'); }
function setClock(t) { $('clock').hidden = !t; $('clock').textContent = t || ''; }
function say(who, text, ms = 4200) {   /* in the water phases the voices come from the direction of the light */   /* a line spoken in the pipe, shown as a subtitle; the speaker is heard, not seen */
  const el = $('sub'); el.textContent = who ? who + ': ' + text : text; el.classList.remove('dim'); clearTimeout(subTimer); subTimer = setTimeout(() => el.classList.add('dim'), ms * (QUICK ? 0.4 : 1)); voice(['rise', 'dark'].includes(N.phase) ? Math.max(-0.9, Math.min(0.9, -Math.sin(bearingToLight()) * 0.9)) : Math.random() * 1.2 - 0.6, who !== 'Mr Douparrouzel');
}
function fadeTo(color, op, ms) { const f = $('fade'); f.style.background = color; f.style.transition = 'opacity ' + (QUICK ? 0 : ms) + 'ms ease'; f.style.opacity = op; }
/* ---------- the cinematic layer: black bars (the words and buttons move inside them), captions on black, a held breath ---------- */
function bars(on) { N.cine = on; document.body.classList.toggle('cine', on); if (on) calcLift(); }
function calcLift() {   /* how far the hand must rise to keep the fist out from under the bottom bar (7% of the screen), at this screen size */
  const prev = N.lift; hand.setLift(0); const low = hand.lowestFistPx(camera, innerHeight); hand.setLift(prev);
  N.liftNeed = Math.max(0, low + 8 - (innerHeight - innerHeight * 0.07)) / innerHeight * 0.742;   /* 0.742 camera units is the height of the screen at the fist's distance */
}
addEventListener('resize', () => { if (N.cine) calcLift(); });
function hideHud(on) { document.body.classList.toggle('cine-hide', on); }
function caption(a, b) { const c = $('cap'); c.querySelector('.a').textContent = a || ''; c.querySelector('.b').textContent = b || ''; c.classList.add('on'); }
function captionOff() { $('cap').classList.remove('on'); }
function showCard(title, text, ok, onOk, no, onNo) {
  $('ccredit').hidden = true; $('ctitle').textContent = title; $('ctext').textContent = text; $('cok').textContent = ok; $('cno').hidden = !no; if (no) $('cno').textContent = no;
  $('cok').onclick = () => { $('card').hidden = true; onOk && onOk(); }; $('cno').onclick = () => { $('card').hidden = true; onNo && onNo(); }; $('card').hidden = false; $('cok').focus();
}
$('sound').onclick = () => { setSound(!AU.on); $('sound').textContent = AU.on ? 'Sound on' : 'Sound off'; };

/* ---------- things to do: scrape the rust ---------- */
const fwd = new THREE.Vector3(), tmp = new THREE.Vector3();
function nearPatch() {   /* the closest unscraped patch that is within reach and in front of you */
  if (N.phase !== 'work' || T.patches.some((p) => p.clean > 0 && p.clean < 1)) return null;
  const e = new THREE.Vector3(S.x, S.eye, S.z); fwd.set(-Math.sin(S.yaw) * Math.cos(S.pitch), Math.sin(S.pitch), -Math.cos(S.yaw) * Math.cos(S.pitch));
  let best = null, bd = 1e9; for (const p of T.patches) { if (p.clean > 0) continue; tmp.copy(p.pos).sub(e); const d = tmp.length(); if (d < 2.3 && d < bd && tmp.normalize().dot(fwd) > 0.45) { best = p; bd = d; } } return best;
}
function scrape(p) { if (!p) return; T.startClean(p); scrapeSound(); }
function act() { if (!locked()) scrape(nearPatch()); }
$('act').onclick = act;
addEventListener('keydown', (e) => { if (N.intro) { skipIntro(); return; } const k = e.key.toLowerCase(); keys.add(k); if ((k === 'e' || k === 'enter') && !e.repeat) act(); });
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));

/* ---------- the night, one phase at a time ---------- */
function setPhase(p) { N.phase = p; N.t = 0; N.q = []; }
function at(list) { N.q = list.map(([t, f]) => [D(t), f]).sort((a, b) => a[0] - b[0]); }
const scrapeGoal = () => 'Scrape the rust off the pipe: ' + N.scraped + ' of ' + T.patches.length + '.';

function resetNight() {
  N.wl = 0; N.torch = 1; N.vig = 0; N.sky = 0; N.scraped = 0; N.allDone = false; N.doneT = 0; N.skipped = false; N.fast = false; N.out = null; N.hintT = 0;
  for (const p of T.patches) T.setPatchClean(p, 0);
  T.water.set(0); T.manhole.setSky(0); $('vig').style.opacity = 0; fadeTo('#000', 0, 0); $('skip').hidden = true; $('act').hidden = true; $('sub').classList.add('dim');
  S.x = 0.12; S.z = ZM - 1.5; S.yaw = 0; S.pitch = 0; S.eye = SAND + 1.45; keys.clear();
  bars(false); hideHud(false); captionOff(); $('skiphint').hidden = true; N.intro = false; N.glance = 0; N.glanceOn = false; N.duck = 0; N.lift = 0; N.order = null; N.handHissed = false; hand.setLift(0);
  for (const t of T.torches) { t.on = 1; t.hissed = false; } if (camera.fov !== 68) { camera.fov = 68; camera.updateProjectionMatrix(); }
}
/* The opening: black, two title cards, then the fade up into the Tube. Any key or tap skips it. */
function startIntro() {
  resetNight(); setPhase('intro'); N.intro = true; bars(true); hideHud(true); fadeTo('#000', 1, 0); setClock(''); setGoal('', true); $('skiphint').hidden = false;
  at([[0.8, () => caption('Bog Walk, Jamaica', 'June 1904')], [3.8, captionOff], [4.8, () => caption('The last tram has gone.', 'The water in the pipe is shut off.')], [7.8, captionOff], [8.8, endIntro]]);
}
function endIntro() { if (!N.intro) return; N.intro = false; captionOff(); $('skiphint').hidden = true; fadeTo('#000', 0, 2200); bars(false); hideHud(false); startWork(true); }
function skipIntro() { if (N.intro) endIntro(); }
function startWork(keep) {
  if (!keep) resetNight(); N.hintT = 0; setPhase('work'); setClock('1 a.m.'); setGoal(scrapeGoal(), true);
  say('Mr Douparrouzel', 'Scrape the plates clean. Take your time.', 5200);   /* placeholder wording */
  at([[7, () => setGoal('Walk down the pipe. Look for the rust patches.', true)]]);
}
function startTrickle() {
  setPhase('trickle'); $('skip').hidden = false; setGoal('Look at the floor. Something is not right.'); N.glanceOn = true; N.glanceT = 0; N.duck = D(2.6);   /* a held breath: the sound drops away and your eyes drop to the water at your feet */
  at([[1, () => say('Rudy', 'My boots are wet.')],
      [6, () => say('Mr Douparrouzel', 'A little water is coming. It is not from the dam.', 5200)],   /* the line he told the Gleaner he said (to check in the 1904 report) */
      [11.5, () => say('Old Zeke', 'It will pass. It always passes.')]]);
}
function startRise() {
  setPhase('rise'); setClock('4 a.m.'); setGoal('Turn around. Go to the manhole. Follow the voices.'); boom(); turnToLight();
  say('Mr Douparrouzel', 'Out, all of you! Go to the manhole!');
  at([[6, () => say('Rudy', 'This way! Hurry!')], [15, () => say('Old Zeke', 'Keep to the wall. Go on.')]]);
}
function startDark() {
  setPhase('dark'); bars(true); N.handHissed = false; N.hbT = D(1.0); N.order = T.torches.slice().sort((a, b) => Math.abs(b.pos.z - S.z) - Math.abs(a.pos.z - S.z));   /* the far torches go first */
  setGoal('Go on. Head for the pale light behind you.', true); say('Old Zeke', 'Go on, lad. Keep going.'); turnToLight();
  at([[7, () => say('Rudy', 'I can see the light! This way!')], [14, () => say('', 'Keep your hand on the wall.', 3800)]]);
}
function startOut(skipped) {
  N.skipped = !!skipped; N.fast = !!skipped; setPhase('out'); $('skip').hidden = true; $('act').hidden = true; setGoal(skipped ? 'You are out.' : 'A hand reaches down. You are out.', true);
  N.out = { x0: S.x, z0: S.z, e0: S.eye, p0: S.pitch, y0: S.yaw }; hideHud(true); if (!skipped) { bars(true); cue('end'); airSwell(2.6); }
  at(skipped ? [[0.2, () => fadeTo('#000', 1, 700)], [1.2, showEnd]] : [[2.3, () => fadeTo('#fff', 1, 1200)], [3.8, showEnd]]);
}
function showEnd() {
  setPhase('end'); setClock(''); bars(false); hideHud(true); captionOff();   /* the words stay hidden behind the card; "Play the night again" brings them back */
  showCard('You are out', N.skipped ? 'You skipped the dark part of the night. In the story, you get out of the Tube and the sky is going grey.' : 'The air is cool. The sky is going grey. Many men are still in the pipe.',
    'Play the night again', () => startWork(), null);
  $('ctext').textContent += ' The rest of the story is still being made.';
  $('ccredit').hidden = false;   /* the credit shows on the end card, like the end of a film */
}
/* ---------- the way to the light: you start the night facing away from the manhole, so when the water comes the game turns you toward it, a cue tells you which way to turn, and the voices come from its direction ---------- */
const wrapA = (a) => Math.atan2(Math.sin(a), Math.cos(a));
function bearingToLight() { const dx = 0 - S.x, dz = ZM - S.z; return wrapA(Math.atan2(-dx, -dz) - S.yaw); }   /* + means the light is to your left, - to your right, 3.14 is straight behind */
function turnToLight(force) { const rel = bearingToLight(); if (!force && Math.abs(rel) < 0.9) return; N.turn = { t: 0, dur: 1.4, from: S.yaw, d: rel }; }   /* a slow, gentle turn of the head toward the shout */
function skipNight() { if (['trickle', 'rise', 'dark'].includes(N.phase)) startOut(true); }
$('skip').onclick = skipNight;

function nightTick(dt) {
  N.t += dt; while (N.q.length && N.t >= N.q[0][0]) N.q.shift()[1]();
  const ph = N.phase;
  if (ph === 'work') {
    for (const p of T.patches) if (p.clean >= 1 && !p.counted) {
      p.counted = true; N.scraped++; setGoal(scrapeGoal(), true); uiSound('tap');
      if (N.scraped === 3) { setClock('2 a.m.'); say('Old Zeke', 'Sand and rust. The same every Sunday night.'); }
      if (N.scraped === T.patches.length) { setClock('3 a.m.'); setGoal('Good work. Rest a moment.', true); N.allDone = true; N.doneT = 0; }
    }
    if (N.allDone) { N.doneT += dt; if (N.doneT > D(4)) startTrickle(); }
    N.wl += ((N.scraped >= 3 ? 0.014 : 0) - N.wl) * Math.min(1, dt * 0.7);
  } else if (ph === 'trickle') { N.wl = 0.014 + 0.126 * ease(N.t / D(15)); if (N.t > D(15)) startRise(); }
  else if (ph === 'rise') { N.wl = 0.14 + 0.62 * ease(N.t / D(38)); if (N.t > D(26) || (N.t > D(12) && S.z > ZM - 9)) startDark(); }
  else if (ph === 'dark') {
    N.wl = 0.76 + 0.3 * ease(N.t / D(26)); N.vig = Math.min(0.8, Math.max(0, N.t - D(1.5)) / D(5) * 0.8);
    (N.order || []).forEach((t, i) => { const st = D(0.3 + i * 0.5); t.on = 1 - ease((N.t - st) / D(0.45)); if (N.t >= st && !t.hissed) { t.hissed = true; if (i < 3) hiss(); } });   /* one by one, with a hiss for the first few */
    N.torch = 1 - ease((N.t - D(3.6)) / D(1.0)); if (N.t >= D(3.6) && !N.handHissed) { N.handHissed = true; hiss(); }   /* yours goes last */
    N.hbT -= dt; if (N.hbT <= 0) { heartbeat(0.15); N.hbT = Math.max(0.6, 0.95 - N.t * 0.012); }   /* a soft heartbeat, a little quicker as it goes on */
    if (Math.abs(S.z - ZM) < 1.5 || N.t > D(40)) startOut(false);   /* if you are still far away after 40 s, a hand takes you the rest of the way */
  } else if (ph === 'out') {
    const o = N.out, T1 = N.fast ? 1.0 : 2.6, k = ease(N.t / D(T1)), g = ease(N.t / D(T1 * 0.4));
    S.x = o.x0 + (0 - o.x0) * g; S.z = o.z0 + (ZM - o.z0) * g; S.eye = o.e0 + (2 * R + 0.1 - o.e0) * k; S.pitch = o.p0 + (1.0 - o.p0) * k;   /* rise into the neck of the manhole and look up at the sky; stop under the sky so the world outside is never seen */ N.sky = k; N.vig = Math.max(0, N.vig * (1 - k)); N.torch = 0; for (const t of T.torches) t.on = Math.max(0, t.on - dt * 2);
    N.wl = Math.min(1.1, N.wl + dt * 0.02);
  }
  if ((ph === 'rise' || ph === 'dark') && S.z < ZMIN + 8) { N.deadT -= dt; if (N.deadT <= 0) { N.deadT = D(9); say('Rudy', 'Not that way! The light is behind you!'); turnToLight(true); } }   /* the dead end of the pipe is the wrong way: say so, and turn the head toward the light */
  T.water.set(N.wl); T.manhole.setSky(N.sky); $('vig').style.opacity = N.vig;
  /* small sounds, so the pipe is never silent */
  if (['work', 'trickle', 'rise'].includes(ph)) { N.dripT -= dt; if (N.dripT <= 0) { drip(); N.dripT = ph === 'work' ? 1.4 + Math.random() * 3 : 0.5 + Math.random() * 1.1; } }
  if (ph === 'work') { N.clankT -= dt; if (N.clankT <= 0) { clank(); N.clankT = 9 + Math.random() * 11; } N.voiceT -= dt; if (N.voiceT <= 0) { voice(Math.random() * 1.6 - 0.8, true); N.voiceT = 5 + Math.random() * 6; } }
  if (N.torch > 0.2) { N.crackT -= dt; if (N.crackT <= 0) { crackle(); N.crackT = 3 + Math.random() * 5; } }
  if (N.duck > 0) N.duck -= dt;
  N.hintT += dt; if (N.hintT > 16 && $('hint').textContent) $('hint').textContent = '';
  N.mixT -= dt; if (N.mixT <= 0) { N.mixT = 0.1; mix(); }
}
function mix() {   /* the beds, by phase: a rumble and moving air always; a trickle, then a roar that grows with the water */
  const wl = N.wl, ph = N.phase; let rumble = 0.1, air = 0.035, stream = 0, roar = 0, rush = 0;
  if (ph === 'work') stream = wl > 0.01 ? 0.03 : 0;
  else if (ph === 'trickle') stream = 0.03 + 0.06 * Math.min(1, wl / 0.14);
  else if (ph === 'rise' || ph === 'dark') { const k = Math.min(1, Math.max(0, (wl - 0.1) / 0.9)); stream = 0.1; roar = 0.06 + 0.5 * k; rush = 0.03 + 0.22 * k; rumble = 0.14; }
  else if (ph === 'out') { const f = 1 - ease(N.t / D(N.fast ? 1 : 3)); stream = 0.1 * f; roar = 0.5 * f; rush = 0.2 * f; rumble = 0.14 * f; air = 0.035 * f; }
  else if (ph === 'end' || ph === 'title') { rumble = air = 0; }
  let drone = 0; if (ph === 'trickle') drone = 0.015 + 0.04 * Math.min(1, wl / 0.14); else if (ph === 'rise') drone = 0.055 + 0.1 * Math.min(1, (wl - 0.14) / 0.6); else if (ph === 'dark') drone = 0.16; else if (ph === 'out') drone = 0.16 * (1 - ease(N.t / D(N.fast ? 1 : 3)));
  const f = N.duck > 0 ? 0.1 : 1; if (N.duck > 0) drone = 0;   /* the held breath: for a moment almost everything drops away */
  setBeds({ rumble: rumble * f, air: air * f, stream: stream * f, roar: roar * f, rush: rush * f, drone }, N.duck > 0 ? 0.12 : 0.5);
}

/* ---------- movement: keys, touch (left half is a stick, right half looks) and mouse drag to look ---------- */
const solids = T.solids;
function clampPos(x, z) {   /* stay in the lane and out of the buckets and shovels (circles in T.solids), sliding round them */
  for (let pass = 0; pass < 2; pass++) {
    x = Math.max(-LANE, Math.min(LANE, x)); z = Math.max(ZMIN + 3, Math.min(ZMAX - 1.6, z));
    for (const s of solids) { if (!(s.r > 0)) continue; const dx = x - s.x, dz = z - s.z, d = Math.hypot(dx, dz), m = s.r + 0.3; if (d < m) { if (d < 1e-4) x = s.x + m; else { x = s.x + dx / d * m; z = s.z + dz / d * m; } } }
  }
  return [x, z];
}
const stick = { id: null, x0: 0, y0: 0, dx: 0, dy: 0 }, look = { id: null, x: 0, y: 0, moved: 0 }, ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function tapPatch(cx, cy) {   /* a tap (not a drag) on a rust patch scrapes it, if it is near enough */
  if (N.phase !== 'work') return;
  ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(T.patches.filter((p) => p.clean === 0).map((p) => p.rust), false)[0]; if (!hit) return;
  const p = T.patches.find((pp) => pp.rust === hit.object); if (p && p.pos.distanceTo(new THREE.Vector3(S.x, S.eye, S.z)) < 2.6) scrape(p);
}
canvas.addEventListener('pointerdown', (e) => {
  if (N.intro) { skipIntro(); return; }
  if (locked()) return;
  if (e.pointerType === 'touch' && e.clientX < innerWidth / 2 && stick.id === null) { stick.id = e.pointerId; stick.x0 = e.clientX; stick.y0 = e.clientY; stick.dx = stick.dy = 0; const s = $('stick'); s.hidden = false; s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px'; s.firstElementChild.style.transform = ''; }
  else { look.id = e.pointerId; look.x = e.clientX; look.y = e.clientY; look.moved = 0; }
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerId === stick.id) { stick.dx = Math.max(-1, Math.min(1, (e.clientX - stick.x0) / 50)); stick.dy = Math.max(-1, Math.min(1, (e.clientY - stick.y0) / 50)); $('stick').firstElementChild.style.transform = `translate(${stick.dx * 26}px,${stick.dy * 26}px)`; }
  else if (e.pointerId === look.id) { const dx = e.clientX - look.x, dy = e.clientY - look.y; look.x = e.clientX; look.y = e.clientY; look.moved += Math.abs(dx) + Math.abs(dy); S.yaw -= dx * 0.005; S.pitch = Math.max(-1.2, Math.min(1.3, S.pitch - dy * 0.004)); }
});
const endPointer = (e) => { if (e.pointerId === stick.id) { stick.id = null; stick.dx = stick.dy = 0; $('stick').hidden = true; } if (e.pointerId === look.id) { if (look.moved < 8) tapPatch(e.clientX, e.clientY); look.id = null; } };
canvas.addEventListener('pointerup', endPointer); canvas.addEventListener('pointercancel', endPointer);

let stepT = 0, walkPh = 0, time = 0;
function moveTick(dt) {
  if (locked()) return 0;
  if (keys.has('arrowleft')) S.yaw += 1.8 * dt; if (keys.has('arrowright')) S.yaw -= 1.8 * dt;
  let f = stick.id !== null ? -stick.dy : 0, r = stick.id !== null ? stick.dx : 0;
  if (keys.has('w') || keys.has('arrowup')) f += 1; if (keys.has('s') || keys.has('arrowdown')) f -= 1; if (keys.has('d')) r += 1; if (keys.has('a')) r -= 1;
  const len = Math.hypot(f, r); if (len < 0.05) return 0;
  const busyScraping = T.patches.some((p) => p.clean > 0 && p.clean < 1); if (busyScraping) return 0;   /* you stand still while you scrape */
  const deep = Math.min(1, N.wl / 1.1), sp = (keys.has('shift') ? 3.2 : 2.1) * Math.min(1, len) * (1 - 0.35 * deep), fx = -Math.sin(S.yaw), fz = -Math.cos(S.yaw), n = Math.max(1, len);
  [S.x, S.z] = clampPos(S.x + (fx * f - fz * r) / n * sp * dt, S.z + (fz * f + fx * r) / n * sp * dt);
  stepT -= dt * sp; if (stepT <= 0) { stepT = 1.25; if (N.wl > 0.05) waterStep(N.wl); else stepSound('sand'); }
  return sp;
}

/* ---------- starting ---------- */
function begin(skipIntroCards) {
  audioInit(); initTubeSound(); $('title').hidden = true; $('hud').hidden = false; S.started = true; $('hint').textContent = TOUCH ? 'Left thumb to walk. Drag to look. Tap the rust.' : 'WASD to walk. Drag to look. E to scrape.'; if (skipIntroCards) startWork(); else startIntro(); canvas.focus();
}
$('start').disabled = false; $('start').textContent = 'Start'; $('start').onclick = () => begin(false);
const MENU = { ok: false, url: '../../../menu/' };   /* the Main Menu button shows only where the real game menu exists (the website, not a single-file copy), as in the other games */
{ const a = $('allgames'); fetch(MENU.url, { cache: 'no-store' }).then((r) => (r.ok ? r.text() : '')).then((t) => { if (/History Games/.test(t)) { MENU.ok = true; a.hidden = false; } }).catch(() => {}); }

/* ---------- the frame loop ---------- */
let last = performance.now(), manual = false, frames = 0;
function tick(dt) {
  time += dt; const ft = (__DEV__ && N.phase === 'shot') ? 3.3 : time;
  if (S.started && N.phase !== 'shot') { const sp = moveTick(dt); walkPh += sp * dt * 3; nightTick(dt); }
  if (N.phase === 'shot') { T.water.set(N.wl); }
  const bob = Math.sin(walkPh * 2.4) * 0.012;
  T.update(dt, ft, S.z, 1); hand.update(ft, N.torch); T.hemi.intensity = 0.85 + 0.55 * (1 - N.torch);   /* once the torches are out your eyes get used to the dark a little */
  /* the camera's own acting: a low rumble as the water comes (stronger as it rises), a slow glance at the floor at the first sign of water, a view that narrows as the dark closes in
     and widens as you reach the sky, and the hand rising a little when the black bars are in. None of it changes where you look: your own turning is added to it. */
  if (N.turn) { N.turn.t += dt; const k = ease(N.turn.t / N.turn.dur); S.yaw = N.turn.from + N.turn.d * k; if (N.turn.t >= N.turn.dur) N.turn = null; }   /* the guided turn toward the light */
  { const w = $('way'), on = S.started && ['rise', 'dark'].includes(N.phase), rel = on ? bearingToLight() : 0, behind = Math.abs(rel) > 2.2, show = on && Math.abs(rel) > 0.6 && !N.turn;
    if (w.hidden === show) w.hidden = !show; if (show) { $('waytext').textContent = behind ? 'Turn around' : 'This way'; $('wayarrow').style.transform = behind ? 'rotate(-90deg) scaleX(-1)' : 'rotate(' + (rel > 0 ? 180 : 0) + 'deg)'; } }   /* the cue: a gold arrow and "This way", or "Turn around" when the light is behind you */
  const ph = N.phase; let shake = 0; if (S.started && ph !== 'shot') shake = (ph === 'rise' ? 0.4 + 0.6 * ease(N.wl) : ph === 'dark' ? 1 : ph === 'out' ? Math.max(0, 1 - N.t / D(1.6)) : 0) * 0.0045;
  if (N.glanceOn) { N.glanceT += dt; N.glance = -0.34 * Math.sin(Math.min(1, N.glanceT / D(3.2)) * Math.PI); if (N.glanceT > D(3.2)) { N.glanceOn = false; N.glance = 0; } }
  const fovT = ph === 'dark' ? 61 : ph === 'out' ? 72 : 68; if (Math.abs(camera.fov - fovT) > 0.01) { camera.fov += (fovT - camera.fov) * Math.min(1, dt * 1.1); camera.updateProjectionMatrix(); }
  const liftT = N.cine ? N.liftNeed : 0; if (Math.abs(N.lift - liftT) > 0.002) { N.lift += (liftT - N.lift) * Math.min(1, dt * 3); hand.setLift(N.lift); }
  { const csT = N.cine ? 1 : 0; if (Math.abs(hand.cs - csT) > 0.002) hand.setCine(hand.cs + (csT - hand.cs) * Math.min(1, dt * 3)); }   /* the torch shrinks a little while the bars are in */
  camera.position.set(S.x + Math.sin(ft * 43) * shake, S.eye + bob + Math.sin(ft * 57 + 1) * shake * 0.7, S.z); camera.rotation.set(S.pitch + N.glance, S.yaw, Math.sin(ft * 31) * shake * 1.6, 'YXZ');
  const near = !locked() && !!nearPatch(); $('act').hidden = !near;
}
function render() { renderer.render(scene, camera); }
function frame(t) { if (!manual) requestAnimationFrame(frame); const dt = Math.max(0, Math.min(0.05, (t - last) / 1000)); last = t; tick(dt);   /* never negative: the first frame can be stamped a little before `last` */ render(); document.body.dataset.frames = ++frames; }
requestAnimationFrame(frame);

/* ---------- test views and a scripted playthrough: dev builds only (node tools/build.mjs bog-walk --dev) ---------- */
if (__DEV__) {
  const errs = []; addEventListener('error', (e) => { errs.push(e.message + ' @' + e.lineno); document.body.dataset.err = errs.join(' | '); });
  const lookAt = (x, y, z) => { const dx = x - S.x, dz = z - S.z, dy = y - S.eye; S.yaw = Math.atan2(-dx, -dz); S.pitch = Math.atan2(dy, Math.hypot(dx, dz)); };
  function handRects() {   /* the screen box of each part of the hand. The hand rides on the camera, so each part is boxed from its own shape in the camera's frame: where you look makes no difference. */
    camera.updateMatrixWorld(true); const v = new THREE.Vector3(), c = new THREE.Vector3(), out = [], th = Math.tan(camera.fov * Math.PI / 360);
    hand.root.traverse((o) => { if (!(o.isMesh || o.isSprite) || !o.visible) return; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      if (o.isSprite) {   /* a flame always faces you: a rectangle of its own size round its middle, without the empty margin of its picture */
        const sx = v.setFromMatrixColumn(o.matrixWorld, 0).length(), sy = v.setFromMatrixColumn(o.matrixWorld, 1).length(); c.setFromMatrixPosition(o.matrixWorld).applyMatrix4(camera.matrixWorldInverse); const d = -c.z; if (d <= 0) return;
        const cx = (c.x / (d * th * camera.aspect) * 0.5 + 0.5) * innerWidth, cy = (-c.y / (d * th) * 0.5 + 0.5) * innerHeight, hw = sx / 2 / (d * th * camera.aspect) * innerWidth / 2, hh = sy / 2 / (d * th) * innerHeight / 2;
        x0 = cx - hw * 0.76; x1 = cx + hw * 0.76; y0 = cy - hh * 0.68; y1 = cy + hh; }
      else { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); const bb = o.geometry.boundingBox;
        for (const x of [bb.min.x, bb.max.x]) for (const y of [bb.min.y, bb.max.y]) for (const z of [bb.min.z, bb.max.z]) { v.set(x, y, z).applyMatrix4(o.matrixWorld).project(camera); const sx = (v.x * 0.5 + 0.5) * innerWidth, sy = (-v.y * 0.5 + 0.5) * innerHeight; x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); } }
      out.push({ name: o.name || o.type, left: x0, right: x1, top: y0, bottom: y1 }); });
    return out;
  }
  function hudOverlaps() {   /* every pair of visible words and buttons that overlap, and any that run off the screen */
    const ids = ['goal', 'clock', 'sound', 'skip', 'hint', 'act', 'sub', 'dialogue', 'barT', 'barB', 'way'], out = [], vis = [];
    for (const id of ids) { const e = $(id); if (!e) continue; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || e.closest('[hidden]') || (id === 'sub' && e.classList.contains('dim')) || (!e.textContent.trim() && e.tagName === 'P')) continue; const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue; vis.push([id, r]); }
    for (const [id, r] of vis) if (r.left < -0.5 || r.top < -0.5 || r.right > innerWidth + 0.5 || r.bottom > innerHeight + 0.5) out.push(id + ' off screen');
    /* the torch, fist and sleeve in your hand, tested by the picture they really draw: rays are shot through the screen and must not hit the hand inside any word or
       button, along the sides or top of the screen (the sleeve leaves through the bottom on purpose), or round the middle of the view. The flame is a rectangle of its own. */
    { const parts = []; hand.root.traverse((o) => { if (o.isMesh && o.visible) parts.push(o); }); const flame = handRects().find((r) => r.name === 'flame'), ray = new THREE.Raycaster(), nd = new THREE.Vector2();
      const hit = (sx, sy) => { if (flame && sx >= flame.left && sx <= flame.right && sy >= flame.top && sy <= flame.bottom) return 'flame'; nd.set(sx / innerWidth * 2 - 1, -(sy / innerHeight) * 2 + 1); ray.setFromCamera(nd, camera); const h = ray.intersectObjects(parts, false)[0]; return h ? (h.object.name || 'part') : null; };
      for (const [id, r] of vis) { let found = null; for (let i = 0; i <= 8 && !found; i++) for (let j = 0; j <= 5 && !found; j++) { const f = hit(r.left + (r.right - r.left) * i / 8, r.top + (r.bottom - r.top) * j / 5); if (f && !(id === 'barB' && ['wrist', 'sleeve', 'cuff', 'stick'].includes(f))) found = f; }   /* the forearm and the foot of the stick leave through the bottom, under the bar, on purpose; the fist and flame must stay clear */
        if (found) out.push('hand overlaps ' + id + ' (' + found + ')'); }
      const arm = (h) => h && !['wrist', 'sleeve', 'cuff'].includes(h);   /* the forearm comes in from the lower right, as a real held torch does, so it may leave the side low down; nothing else may */
      let off = false; for (let k = 0; k <= 40 && !off; k++) { const f = k / 40, y = f * innerHeight * 0.92, low = y > innerHeight * 0.8; if ((low ? arm(hit(2, y)) : hit(2, y)) || (low ? arm(hit(innerWidth - 3, y)) : hit(innerWidth - 3, y)) || hit(f * innerWidth, 2)) off = true; }
      if (off) out.push('hand runs off the side or top');
      const c = Math.min(innerWidth, innerHeight) * 0.07; let mid = false; for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) if (hit(innerWidth / 2 + i * c, innerHeight / 2 + j * c)) mid = true;
      if (mid) out.push('hand covers the middle of the view'); }
    for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) { const a = vis[i][1], b = vis[j][1]; if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) out.push(vis[i][0] + ' overlaps ' + vis[j][0]); }
    return out;
  }
  function propOverlaps() {   /* tools that overlap each other, or sit on the manhole */
    const out = [], s = T.solids.filter((x) => x.r > 0); for (let i = 0; i < s.length; i++) for (let j = i + 1; j < s.length; j++) if (Math.hypot(s[i].x - s[j].x, s[i].z - s[j].z) < s[i].r + s[j].r) out.push(s[i].what + ' overlaps ' + s[j].what);
    for (const p of s) if (Math.hypot(p.x, p.z - ZM) < p.r + 0.6) out.push(p.what + ' is under the manhole');
    for (const d of T.drifts) { for (const p of s) if (Math.abs(p.z - d.z) < d.l / 2 + p.r && Math.abs(p.x - d.x) < d.w / 2 + p.r) out.push(p.what + ' sits in a sand drift'); if (Math.abs(d.z - ZM) < d.l / 2 + 0.6) out.push('a sand drift is under the manhole'); }
    return out;
  }
  function runAudit() {   /* the engine's place audit (engine/audit.js): nothing floats in the air, nobody is inside a solid, everything the player needs can be reached on foot */
    const walls = T.solids.filter((s) => s.r > 0).map((s) => [s.x - s.r - 0.3, s.z - s.r - 0.3, s.x + s.r + 0.3, s.z + s.r + 0.3]);
    return auditPlace({ id: 'tube', snap: snapMeshes(T.group), npcs: [], walls, bounds: { x0: -LANE, x1: LANE, z0: ZMIN + 3, z1: ZMAX - 1.6 }, start: { x: 0.12, z: ZM - 1.5 },
      actions: T.patches.map((p) => ({ label: 'scrape patch ' + p.i, x: p.pos.x, z: p.pos.z, r: 2.3 })), people: [] });
  }
  window.__bw = { S, N, T, hand, keys, runAudit, audit: runAudit, tubeAudit, tubeHeld, stepSound, startRise, startDark, startWork, tick, render, startIntro, skipIntro, bars, hideHud, caption, audioState: () => (AU.ctx ? AU.ctx.state : 'none'), hudOverlaps, handRects, propOverlaps, begin, skipNight, setGoal, say };
  const num = (k, d) => (q.has(k) ? parseFloat(q.get(k)) : d);
  const shot = q.get('shot');
  if (shot) {
    begin(true); setPhase('shot'); T.torches.forEach((t) => { t.on = num('torch', 1); }); $('hint').textContent = q.has('nohint') ? '' : $('hint').textContent;
    const wl = num('wl', 0), cl = (q.get('clean') || '').split(',').filter(Boolean).map(Number);
    S.x = num('x', 0.12); S.z = num('z', ZM - 1.5); S.yaw = num('yaw', 0); S.pitch = num('pitch', 0); N.wl = wl; N.torch = num('torch', 1); N.vig = num('vig', 0); N.sky = num('sky', 0); $('vig').style.opacity = N.vig; T.manhole.setSky(N.sky);
    cl.forEach((i) => T.setPatchClean(T.patches[i], 1)); if (q.has('half')) T.setPatchClean(T.patches[+q.get('half')], 0.5);
    if (shot === 'patch') { const p = T.patches[+(q.get('p') || 0)]; S.z = p.z + 1.6; S.x = -Math.sign(p.pos.x) * 0.1; lookAt(p.pos.x, p.pos.y, p.pos.z); }
    if (shot === 'fist') { hand.root.position.set(0.02, 0.36 + num('fy', 0), -0.3 + num('fz', 0)); hand.root.rotation.set(0, num('fry', -0.1), 0); S.pitch = 0; S.yaw = 0; }   /* the hand brought close, to inspect the grip */
    if (q.has('cine')) { document.body.classList.add('notrans'); bars(true); N.lift = N.liftNeed; hand.setLift(N.lift); hand.setCine(1); }   /* the black bars in, as in the dark and the climb */
    if (shot === 'cap') { document.body.classList.add('notrans'); hideHud(true); bars(true); N.lift = N.liftNeed; hand.setLift(N.lift); hand.setCine(1); fadeTo('#000', 1, 0); $('fade').style.transition = 'none'; $('cap').style.transition = 'none'; q.get('line') === '2' ? caption('The last tram has gone.', 'The water in the pipe is shut off.') : caption('Bog Walk, Jamaica', 'June 1904'); }   /* an opening title card */
    if (shot === 'poster') {   /* a clean picture for the menu card: no words, the manhole's beam at the end of the pipe, a sheen of water, your torch lit. Render at 1280x720. */
      hideHud(true); document.body.classList.add('notrans'); if (!q.has('z')) S.z = -2; if (!q.has('yaw')) S.yaw = Math.PI; if (!q.has('pitch')) S.pitch = 0.03; if (!q.has('wl')) N.wl = 0.2; if (!q.has('vig')) { N.vig = 0.22; $('vig').style.opacity = N.vig; } }
    if (shot === 'end') { N.skipped = q.has('skipped'); showEnd(); }   /* the end card, with the credit */
    if (shot === 'up') { S.x = 0; S.z = ZM - 0.12; S.pitch = 1.5; }
    if (shot === 'manhole') { S.x = 0; S.z = ZM - 3.4; lookAt(0, 2 * R, ZM); }
    if (shot === 'torch') { const tt = T.torches[+(q.get('t') || 0)]; S.x = 0; S.z = tt.pos.z + 2.8; lookAt(tt.pos.x, tt.pos.y, tt.pos.z); }
    if (shot === 'back') { S.z = num('z', -20); S.yaw = Math.PI; S.pitch = 0.05; }
    if (shot === 'hud') {   /* the busiest screen: a long goal, the clock, two lines of speech, and one button (add &act=1 for Scrape; Scrape and Skip never show together) */
      setGoal('Scrape the rust off the pipe: 3 of 6. This is a long goal to test wrapping on a small screen.', true); setClock('4 a.m.'); $('skip').hidden = q.has('act'); $('act').hidden = !q.has('act'); say('Mr Douparrouzel', 'Out, all of you! Go to the manhole! This is a long line to test two rows.', 60000); }
    setTimeout(() => { document.body.dataset.shot = shot; document.body.dataset.overlaps = hudOverlaps().join('; ') || 'none'; }, 400);
  }
  /* ---------- the automatic checks (owner rule, docs/TESTING.md section 5): ?test=audit, ?test=held, ?test=layout ----------
     Each writes its lines to #autolog and its count of problems to the page title (AUDIT n, HELD n, LAYOUT n); every one must report 0.
     ?test=resume does not apply: this game does not save yet. */
  const report = (title, lines, count) => {
    let pre = document.getElementById('autolog'); if (!pre) { pre = document.body.appendChild(document.createElement('pre')); pre.id = 'autolog'; pre.style.cssText = 'position:fixed;left:0;top:0;z-index:99;background:#000;color:#9f9;font-size:11px;max-width:100%;max-height:100%;overflow:auto;margin:0;padding:4px'; }
    pre.textContent = lines.join('\n'); document.title = title + ' ' + count;
  };
  function tubeAudit() {   /* floating things, people inside solids, spots that cannot be reached (engine/audit.js), tools that overlap, and anything hung inside the pipe that is really outside its wall */
    const r = runAudit(), issues = [...r.floating, ...r.inside, ...r.stuck, ...propOverlaps()], v = new THREE.Vector3(), sz = new THREE.Vector3();
    for (const s of snapMeshes(T.group)) {   /* a mesh whose far corner is well outside the pipe would be hidden behind the wall (the first torches were hung above the roof) */
      s.b.getSize(sz); if (sz.z > 40 || Math.abs((s.b.min.z + s.b.max.z) / 2 - ZM) < 0.9) continue;   /* the wall, floor and water; the manhole's neck, flange and beam */
      if (s.geo === 'CircleGeometry' && Math.max(sz.x, sz.y) <= 2 * R + 0.06) continue;   /* a round disc as wide as the pipe (its ends): the corners of its square box are not part of it */
      let far = 0; for (const x of [s.b.min.x, s.b.max.x]) for (const y of [s.b.min.y, s.b.max.y]) far = Math.max(far, Math.hypot(x, y - R)); if (far > R + 0.25) issues.push('a ' + s.geo + ' near z ' + ((s.b.min.z + s.b.max.z) / 2).toFixed(1) + ' reaches ' + far.toFixed(2) + ' m from the pipe axis, outside the wall (hidden)');
    }
    T.group.traverse((o) => { if (!o.isSprite) return; v.copy(o.position); if (Math.abs(v.z - ZM) < 0.9) return; const d = Math.hypot(v.x, v.y - R); if (d > R - 0.05) issues.push('a flame at z ' + v.z.toFixed(1) + ' is ' + d.toFixed(2) + ' m from the pipe axis, outside the wall (hidden)'); });
    return issues;
  }
  function tubeHeld() {   /* the torch in your hand (first person, so there is no skeleton for the engine's auditHeld): four fingers and one thumb, every digit on the stick, the stick upright, and the on-screen checks */
    const lines = [], A = hand.stickA, B = hand.stickB, ab = B.clone().sub(A), len2 = ab.lengthSq(), by = (n) => { const out = []; hand.root.traverse((o) => { if (o.isMesh && o.name === n) out.push(o); }); return out; };
    const ctr = (o) => { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); return o.geometry.boundingBox.getCenter(new THREE.Vector3()).applyMatrix4(o.matrix); };   /* the middle of a part, whether its shape is baked in or placed by position */
    const onStick = (p) => { const t = Math.max(0, Math.min(1, p.clone().sub(A).dot(ab) / len2)); return { t, d: p.distanceTo(A.clone().addScaledVector(ab, t)) }; };
    const fingers = by('finger'), tips = by('fingernail'), palm = by('palm')[0], thumbs = by('thumb'), nails = by('thumbnail');
    if (fingers.length !== 4) lines.push('the fist has ' + fingers.length + ' fingers, not 4'); if (tips.length !== 4) lines.push('the fist has ' + tips.length + ' fingernails, not 4'); if (nails.length !== 1 || !thumbs.length) lines.push('the fist needs exactly one thumb with a nail (' + thumbs.length + ' thumb parts, ' + nails.length + ' nails)');
    fingers.forEach((f, i) => { const s = onStick(ctr(f)); if (s.d > 0.05) lines.push('finger ' + (i + 1) + ' is ' + (s.d * 100).toFixed(1) + ' cm from the stick'); if (s.t < 0.15 || s.t > 0.85) lines.push('finger ' + (i + 1) + ' is not on the middle of the stick (at ' + (s.t * 100).toFixed(0) + '%)'); });
    if (palm) { const s = onStick(ctr(palm)); if (s.d > 0.07) lines.push('the palm is ' + (s.d * 100).toFixed(1) + ' cm from the stick'); }
    for (const th of thumbs) { const s = onStick(ctr(th)); if (s.d > 0.07) lines.push('a thumb part is ' + (s.d * 100).toFixed(1) + ' cm from the stick'); }
    { const top = (o) => { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); return new THREE.Box3().copy(o.geometry.boundingBox).applyMatrix4(o.matrix).max.y; };   /* the highest point of a part: the thumb's tip must rise above the top finger */
      const topFinger = fingers.reduce((hi, f) => (!hi || top(f) > top(hi) ? f : hi), null), thumbTip = thumbs.reduce((hi, f) => (!hi || top(f) > top(hi) ? f : hi), null);
      if (topFinger && thumbTip && top(thumbTip) < top(topFinger) + 0.005) lines.push('the thumb does not rise above the index finger'); }
    const up = ab.clone().normalize().applyQuaternion(hand.inner.quaternion).applyQuaternion(hand.root.quaternion).y; if (up < 0.6) lines.push('the torch is tipped over (its up is ' + up.toFixed(2) + ')');
    document.body.classList.add('notrans'); for (const cine of [false, true]) { bars(cine); if (cine) calcLift(); N.lift = cine ? N.liftNeed : 0; hand.setLift(N.lift); hand.setCine(cine ? 1 : 0); for (const l of hudOverlaps()) if (/^hand/.test(l)) lines.push((cine ? 'with the black bars in: ' : '') + l); } bars(false); N.lift = 0; hand.setLift(0); hand.setCine(0);
    return lines;
  }
  if (q.get('test') === 'audit') { begin(true); setPhase('shot'); setTimeout(() => { const l = tubeAudit(); report('AUDIT', ['tube: ' + l.length + ' issues', ...l.map((x) => '  ' + x)], l.length); }, 600); }
  if (q.get('test') === 'held') { begin(true); setPhase('shot'); setTimeout(() => { const l = tubeHeld(); report('HELD', ['held items: ' + l.length + ' issues', ...l.map((x) => '  ' + x)], l.length); }, 600); }
  if (q.get('test') === 'layout') {   /* each interface state in turn: nothing overlaps, runs off the screen or is clipped (run at 390x800, 667x375, 800x500 and 1280x720) */
    (async () => {
      const out = [], W = innerWidth, Hh = innerHeight, settle = () => new Promise((r) => setTimeout(r, 500)); document.body.classList.add('notrans');
      const box = (e) => { const r = e.getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom }; }, hits = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
      const inside = (name, id, e) => { const r = box(e); if (r.left < -1 || r.top < -1 || r.right > W + 1 || r.bottom > Hh + 1) out.push(`${W}x${Hh} ${name}: ${id} is off the screen (${r.left | 0},${r.top | 0},${r.right | 0},${r.bottom | 0})`); };
      const check = (name) => {
        for (const l of hudOverlaps()) out.push(`${W}x${Hh} ${name}: ${l}`);
        for (const id of ['goal', 'clock', 'sound', 'skip', 'hint', 'act', 'sub']) { const e = $(id), cs = getComputedStyle(e); if (!e.closest('[hidden]') && cs.display !== 'none' && cs.visibility !== 'hidden' && e.getBoundingClientRect().width > 0 && e.textContent.trim() && e.scrollWidth > e.clientWidth + 2) out.push(`${W}x${Hh} ${name}: ${id} is clipped`); }
      };
      const reset = () => { for (const id of ['skip', 'act']) $(id).hidden = true; $('hint').textContent = ''; $('sub').classList.add('dim'); bars(false); hideHud(false); captionOff(); $('card').hidden = true; $('skiphint').hidden = true; setClock(''); N.lift = 0; hand.setLift(0); hand.setCine(0); };
      const busy = () => { setGoal('Scrape the rust off the pipe: 3 of 6. This is a long goal to test the wrapping on a small screen.', true); setClock('4 a.m.'); say('Mr Douparrouzel', 'Out, all of you! Go to the manhole! This is a long line to test two rows.', 6e7); $('sub').classList.remove('dim'); };
      /* the title screen: the Start button, the link and the words must be in view without scrolling */
      { const t = $('title'); t.hidden = false; $('hud').hidden = true; await settle(); for (const [id, e] of [['title Start', $('start')], ['title credit link', t.querySelector('.credit a')], ['title heading', t.querySelector('h1')]]) inside('title screen', id, e);
        const sb = box($('start')), cb = box(t.querySelector('.credit a')); if (hits(sb, cb)) out.push(`${W}x${Hh} title screen: Start overlaps the credit link`); t.hidden = true; }
      begin(true); setPhase('shot'); await settle();
      reset(); busy(); $('hint').textContent = TOUCH ? 'Left thumb to walk. Drag to look. Tap the rust.' : 'WASD to walk. Drag to look. E to scrape.'; $('act').hidden = false; await settle(); check('work: goal, clock, speech, hint and the Scrape button');
      reset(); busy(); $('skip').hidden = false; await settle(); check('the water: goal, clock, speech and the Skip button');
      reset(); busy(); $('skip').hidden = false; bars(true); calcLift(); N.lift = N.liftNeed; hand.setLift(N.lift); hand.setCine(1); await settle(); check('the dark: black bars in, with the Skip button');
      reset(); busy(); $('act').hidden = false; bars(true); calcLift(); N.lift = N.liftNeed; hand.setLift(N.lift); hand.setCine(1); await settle(); check('black bars in, with the Scrape button');
      reset(); hideHud(true); bars(true); fadeTo('#000', 1, 0); $('fade').style.transition = 'none'; $('cap').style.transition = 'none'; caption('The last tram has gone.', 'The water in the pipe is shut off.'); $('skiphint').hidden = false; await settle();
      { const parts = [...document.querySelectorAll('#cap p')].filter((e) => e.textContent), sh = $('skiphint'); parts.forEach((e, i) => inside('opening card', 'caption line ' + (i + 1), e)); inside('opening card', 'skip hint', sh); for (const e of parts) if (hits(box(e), box(sh))) out.push(`${W}x${Hh} opening card: the caption overlaps the skip hint`); const bb = box($('barB')); if (hits(box(sh), box($('barT')))) out.push(`${W}x${Hh} opening card: the skip hint is in the top bar`); if (box(sh).top < bb.top - 1 || box(sh).bottom > bb.bottom + 1) out.push(`${W}x${Hh} opening card: the skip hint is not inside the bottom bar`); }
      reset(); fadeTo('#000', 0, 0); N.skipped = false; showEnd(); await settle();
      { const c = document.querySelector('#card .box'); inside('end card', 'card', c); for (const id of ['cok']) { const e = $(id), r = box(e), top = document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2); if (!top || !(top === e || e.contains(top))) out.push(`${W}x${Hh} end card: the ${id} button is covered by ${top ? (top.id || top.tagName) : 'nothing'}`); }
        const a = $('ccredit').querySelector('a'), r = box(a), top = document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2); inside('end card', 'credit link', a); if (!top || !(top === a || a.contains(top))) out.push(`${W}x${Hh} end card: the credit link is covered`); if (!c.contains(a)) out.push(`${W}x${Hh} end card: the credit link is outside the card`); if (hits(box($('cok')), r)) out.push(`${W}x${Hh} end card: the button overlaps the credit link`); }
      report('LAYOUT', out.length ? out : [`${W}x${Hh}: no layout problems`], out.length);
    })();
  }
  if (q.get('auto')) {   /* ?auto=1 plays the whole night; ?auto=2 skips the dark part. The result is written to the page title and to #autolog. */
    manual = true; const mode = q.get('auto'), pre = document.body.appendChild(document.createElement('pre')); pre.id = 'autolog'; pre.style.cssText = 'position:fixed;left:0;top:0;z-index:99;background:#000;color:#9f9;font-size:11px;max-height:100%;overflow:auto;margin:0';
    const log = (m) => { pre.textContent += m + '\n'; };
    setTimeout(() => {
      begin(mode !== '3'); const dt = 1 / 30;   /* ?auto=3 plays the opening cards by their own timers, the others skip them */ let simT = 0, lastPh = '', ok = true; const seen = [];
      const step = (n) => { for (let i = 0; i < n; i++) { tick(dt); simT += dt; if (N.phase !== lastPh) { lastPh = N.phase; seen.push(lastPh); log(simT.toFixed(1) + 's phase=' + lastPh + ' goal="' + goalText + '" z=' + S.z.toFixed(1) + ' wl=' + N.wl.toFixed(2)); } } };
      step(2); if (mode === '3') { let g = 0; while (N.phase === 'intro' && g++ < 30 * 15) step(1); log('intro finished after ' + simT.toFixed(1) + 's'); if (N.phase === 'intro') ok = false; }
      for (const p of T.patches) { S.z = p.z + 1.5; S.x = -Math.sign(p.pos.x) * 0.1; lookAt(p.pos.x, p.pos.y, p.pos.z); tick(dt); const np = nearPatch(); if (np !== p) { ok = false; log('FAIL: no scrape action at patch ' + p.i); } act(); step(60); }
      log('scraped ' + N.scraped + ' of ' + T.patches.length); if (N.scraped !== T.patches.length) ok = false;
      let guard = 0; while (N.phase === 'work' && guard++ < 400) step(1); if (N.phase === 'work') { ok = false; log('FAIL: never left work'); }
      let skipped = false; guard = 0;
      while (N.phase !== 'end' && guard++ < 30 * 400) {
        if (mode === '2' && N.phase === 'trickle' && !skipped) { skipped = true; log('pressing Skip'); skipNight(); }
        if (['rise', 'dark'].includes(N.phase)) { S.yaw = Math.PI; S.pitch = 0; keys.add('w'); } else keys.delete('w');
        step(1); if (!isFinite(camera.position.x + camera.position.y + camera.position.z)) { ok = false; log('FAIL: camera is NaN'); break; }
      }
      keys.delete('w'); if (N.phase !== 'end') { ok = false; log('FAIL: did not reach the end (phase ' + N.phase + ')'); }
      if ($('card').hidden) { ok = false; log('FAIL: no end card'); }
      const au = runAudit(), an = au.floating.length + au.inside.length + au.stuck.length; log('place audit: ' + an + ' problems'); if (an) { ok = false; log('FAIL audit: ' + JSON.stringify(au)); }
      const po = propOverlaps(); if (po.length) { ok = false; log('FAIL props: ' + po.join('; ')); } const ho = hudOverlaps(); if (ho.length) { ok = false; log('FAIL hud: ' + ho.join('; ')); }
      if (errs.length) { ok = false; log('FAIL errors: ' + errs.join(' | ')); }
      log('phases: ' + seen.join(' > ')); document.title = (ok ? 'AUTO OK ' : 'AUTO FAIL ') + seen.join('>'); render();
    }, 300);
  }
}
