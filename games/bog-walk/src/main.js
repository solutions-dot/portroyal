import { grip, gripTick } from '../../../engine/grip.js';
import { releaseOnBlur, useInteractionKey } from '../../../engine/input.js';
/* games/bog-walk/src/main.js: Bog Walk 1904: The Tube. The script is docs/games/bog-walk.md, "The build script (agreed with the owner, 13 Nov 2026)".
   Six chapters: the station on Sunday evening (0), Zeke's story of the first electric tram in 1899 (1), inside the Tube (2), the water (3),
   the morning after (4) and the ruins today (5). You play someone fictional, always in first person. No one can fail and no one is shown in the water.
   Real people say only words from the record (Mr Douparrouzel's one line, in the Tube); in the morning they are seen, not heard.
   Layout of this file: setup; the Tube and its night (phases work, boots, intro, trickle, rise, dark, out, end); the world outside (places, people, talking);
   the interface (goal, journal, cards, puzzles, chapters, credits, reset); saving; the chapters and their scenes; the frame loop; dev test views and checks. */
import * as THREE from 'three';
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';
import { CL, loadClips, animate, groundFeet } from '../../../engine/anim.js';
import { soundPref, setSound, audioInit, stepSound, uiSound, cue, crackle, chirp, setG, AU } from '../../../engine/audio.js';
import { model, onLoadFail } from '../../../engine/loader.js';
import { snapMeshes, auditPlace, auditHeld, auditSeated } from '../../../engine/audit.js';   /* dev checks only: reached only from __DEV__ code, so dropped from the public build */
import { setAniso } from './gfx.js';
import { G as WG, makeSky, batchStatic } from './wgfx.js';
import { buildTube, R, SAND, ZMIN, ZMAX, ZM } from './tube.js';
import { makeHand } from './hand.js';
import { initTubeSound, setBeds, drip, scrapeSound, voice, hiss, clank, waterStep, heartbeat, boom, airSwell, initWorldSound, setWorld, setMotor, bell, whistle, valveTurn, cheer } from './sfx.js';
import { ENV, mixEnv, buildStation, buildYard, buildRuins, buildKingston, noticeTex, journeyIcon } from './places.js';
import { lantern, hold, bucket } from './props.js';
import { makeSmoke } from './trains.js';
import { CHAPTERS, GOALS, TALK_TARGETS, TALK, LATER, SEEN, SEEN_GROUP, JOURNEY, REPORT, WHY, AFTER, CHOICE_NAMES, JOURNAL } from './content.js';

const $ = (id) => document.getElementById(id);
const q = new URLSearchParams(location.search);
const QUICK = __DEV__ && (q.has('quick') || /[?&](auto|test)=/.test(location.search)), TS = QUICK ? 0.15 : 1;   /* in a test every timed part runs at 15% of its length */
const D = (s) => s * TS;
const TOUCH = matchMedia('(pointer: coarse)').matches, MOBILE = /Android|iPhone|iPad|Mobi/i.test(navigator.userAgent);
const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const PI = Math.PI;
soundPref('bogwalk-sound');
onLoadFail((name) => { $('loadnote').textContent = 'Could not load ' + name + '. Please reload the page.'; });

/* ---------- renderer, camera ---------- */
const canvas = $('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, MOBILE ? 1.5 : 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.3;
setAniso(renderer.capabilities.getMaxAnisotropy()); WG.aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0a0806); scene.fog = new THREE.Fog(0x0a0806, 3, 36);
const tubeFog = scene.fog, tubeBG = scene.background, worldFog = new THREE.Fog(0xcfe2e6, 60, 240);
const camera = new THREE.PerspectiveCamera(68, 1, 0.08, 800); scene.add(camera);

/* ---------- the Tube, and the torch in your hand ---------- */
const T = buildTube(scene);
const hand = makeHand(camera);
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); hand.place(camera.aspect, camera.fov, h, w); }
addEventListener('resize', resize); resize();

/* ---------- the world outside: sky, sun, light ---------- */
const hemi = new THREE.HemisphereLight(0xffffff, 0x887766, 2), sun = new THREE.DirectionalLight(0xfff0d0, 2); scene.add(hemi, sun, sun.target);
const SHADOWS = !TOUCH && !(__DEV__ && q.has('noshadow'));
renderer.shadowMap.enabled = SHADOWS; renderer.shadowMap.type = THREE.PCFShadowMap; sun.shadow.mapSize.set(2048, 2048); { const sc = sun.shadow.camera; sc.left = -40; sc.right = 40; sc.top = 40; sc.bottom = -40; sc.near = 1; sc.far = 260; sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.06; }
const sunDir = new THREE.Vector3(0.4, 0.8, 0.4), sky = makeSky(); for (const o of sky.objects) scene.add(o);
let envNow = ENV.day, MODE = 'tube';
function setEnv(e) {
  envNow = e; sky.setSky(e.top, e.hor, e.stars, e.moon, Math.min(1, e.hemi[2] / 1.8)); worldFog.color.setHex(e.fog); worldFog.near = e.fogN; worldFog.far = e.fogF;
  hemi.color.setHex(e.hemi[0]); hemi.groundColor.setHex(e.hemi[1]); hemi.intensity = e.hemi[2]; sun.color.setHex(e.sun[0]); sun.intensity = e.sun[1]; sunDir.set(...e.sun[2]).normalize(); sun.castShadow = SHADOWS && e.sun[1] > 0.9;
  if (MODE === 'world') scene.background = worldFog.color;
}
function setMode(m) {   /* the Tube (torch light, the hand) or the world outside (sky, sun, people) */
  MODE = m; const tube = m === 'tube';
  T.group.visible = tube; T.hemi.visible = tube; hand.root.visible = tube; hemi.visible = sun.visible = !tube; for (const o of sky.objects) o.visible = !tube;
  renderer.toneMapping = tube ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping; renderer.toneMappingExposure = tube ? 1.3 : 1;
  scene.fog = tube ? tubeFog : worldFog; scene.background = tube ? tubeBG : worldFog.color; if (!tube) setEnv(envNow);
}

/* ---------- where you are, and the night ---------- */
const S = { started: false, x: 0.12, z: ZM - 1.5, yaw: 0, pitch: 0, eye: SAND + 1.45 };   /* yaw 0 looks toward -z (down the pipe, or north outside) */
const N = { phase: 'title', t: 0, q: [], wl: 0, torch: 1, vig: 0, sky: 0, scraped: 0, allDone: false, doneT: 0, dripT: 2, clankT: 7, voiceT: 5, crackT: 3, mixT: 0, hintT: 0, skipped: false, fast: false, out: null, intro: false, introNext: null, glance: 0, glanceT: 0, glanceOn: false, duck: 0, hbT: 0, lift: 0, cine: false, liftNeed: 0, order: null, handHissed: false, turn: null, deadT: 0, wlT: 0 };
const LANE = 0.62;   /* how far from the middle of the pipe you can stand: the wall curves in, and your torch needs room */
const keys = new Set();
const PANELS = ['dialogue', 'journal', 'chapters', 'credits', 'card', 'puzzle'];
const panelsOpen = () => PANELS.some((id) => !$(id).hidden);
let frozen = false, fading = false, talkWith = null, near = null;
function locked() { return panelsOpen() || frozen || fading || !S.started || ['title', 'intro', 'out', 'end'].includes(N.phase); }

/* ---------- words on the screen ---------- */
let goalText = '', subTimer = 0, goalTimer = 0;
function setGoal(t, quiet) { goalText = t; const el = $('goal'); el.hidden = !t; if (el.textContent !== t && t && !quiet) uiSound('goal'); el.textContent = t; el.classList.remove('folded'); el.setAttribute('aria-expanded', 'true'); clearTimeout(goalTimer); if (t) goalTimer = setTimeout(() => { if (goalText) { el.textContent = 'Goal'; el.classList.add('folded'); el.setAttribute('aria-expanded', 'false'); } }, 6500); }
$('goal').onclick = () => setGoal(goalText, true);
function setClock(t) { $('clock').hidden = !t; $('clock').textContent = t || ''; }
function say(who, text, ms = 4200) {   /* a line shown as a subtitle; in the Tube the speaker is heard, not seen, and in the water the voices come from the direction of the light */
  const el = $('sub'); el.textContent = who ? who + ': ' + text : text; el.classList.toggle('dim', !text); clearTimeout(subTimer); subTimer = setTimeout(() => el.classList.add('dim'), ms * (QUICK ? 0.4 : 1));
  if (MODE === 'tube' && who) voice(['rise', 'dark'].includes(N.phase) ? Math.max(-0.9, Math.min(0.9, -Math.sin(bearingToLight()) * 0.9)) : Math.random() * 1.2 - 0.6, who !== 'Rudy');
}
let toastTimer = 0;
function toast(msg, ms = 2800) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, ms); }
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
function showSound() { const b = $('snd'); b.setAttribute('aria-pressed', AU.on ? 'true' : 'false'); b.setAttribute('aria-label', AU.on ? 'Sound on. Tap to turn off.' : 'Sound off. Tap to turn on.'); $('sndon').style.display = AU.on ? '' : 'none'; $('sndoff').style.display = AU.on ? 'none' : ''; }
$('snd').onclick = () => { setSound(!AU.on); showSound(); }; showSound();

/* ---------- timed steps that follow the game's own clock (so a test can run them fast), and an "epoch" that stops a scene when the chapter changes ---------- */
let EP = 0; const TICKS = [];
function tween(sec, fn) { const ep = EP; return new Promise((res) => { let t = 0; const d = Math.max(0.02, sec * TS); TICKS.push((dt) => { if (ep !== EP) { res(false); return true; } t += dt; const k = Math.min(1, t / d); if (fn) fn(k, dt); if (k >= 1) { res(true); return true; } return false; }); }); }
const wait = (sec) => tween(sec, null);
async function run(steps) { const ep = EP; for (const [s, fn] of steps) { await wait(s); if (ep !== EP) return false; fn(); } return true; }   /* [wait in seconds, then do this] */

/* ---------- things to do in the Tube: scrape the rust ---------- */
const fwd = new THREE.Vector3(), tmp = new THREE.Vector3();
function nearPatch() {   /* the closest unscraped patch that is within reach and in front of you */
  if (MODE !== 'tube' || N.phase !== 'work' || T.patches.some((p) => p.clean > 0 && p.clean < 1)) return null;
  const e = new THREE.Vector3(S.x, S.eye, S.z); fwd.set(-Math.sin(S.yaw) * Math.cos(S.pitch), Math.sin(S.pitch), -Math.cos(S.yaw) * Math.cos(S.pitch));
  let best = null, bd = 1e9; for (const p of T.patches) { if (p.clean > 0) continue; tmp.copy(p.pos).sub(e); const d = tmp.length(); if (d < 2.3 && d < bd && tmp.normalize().dot(fwd) > 0.45) { best = p; bd = d; } } return best;
}
function scrape(p) { if (!p) return; T.startClean(p); scrapeSound(); }
function act() { if (locked()) return; if (MODE === 'tube') scrape(nearPatch()); else if (near) activate(near); }
$('act').onclick = act;
addEventListener('keydown', (e) => {
  if (N.intro) { skipIntro(); return; } const k = e.key.toLowerCase(); if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k) && S.started) e.preventDefault(); keys.add(k);
  if (k === 'escape') { if (!$('dialogue').hidden) { leaveTalk(); return; } closeJournal(); closeChapters(); closeCredits(); closePuzzle(false); }
  useInteractionKey(e, () => { if (!$('dialogue').hidden && !$('next').hidden) { $('next').click(); return; } if (!locked() && $('holdbox').hidden && (MODE === 'tube' ? nearPatch() : near)) { act(); return; } return false; });
});
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));

/* ---------- the night, one phase at a time ---------- */
function setPhase(p) { N.phase = p; N.t = 0; N.q = []; }
function at(list) { N.q = list.map(([t, f]) => [D(t), f]).sort((a, b) => a[0] - b[0]); }
const scrapeGoal = () => 'Scrape the rust off the pipe: ' + N.scraped + ' of ' + T.patches.length + '.';

function resetNight() {
  N.wl = 0; N.torch = 1; N.vig = 0; N.sky = 0; N.scraped = 0; N.allDone = false; N.doneT = 0; N.skipped = false; N.fast = false; N.out = null; N.hintT = 0; N.wlT = 0;
  for (const p of T.patches) T.setPatchClean(p, 0);
  T.water.set(0); T.manhole.setSky(0); $('vig').style.opacity = 0; fadeTo('#000', 0, 0); $('skip').hidden = true; $('act').hidden = true; $('pick').hidden = true; $('sub').classList.add('dim');
  S.x = 0.12; S.z = ZM - 1.5; S.yaw = 0; S.pitch = 0; S.eye = SAND + 1.45; keys.clear();
  bars(false); hideHud(false); captionOff(); $('skiphint').hidden = true; N.intro = false; N.glance = 0; N.glanceOn = false; N.duck = 0; N.lift = 0; N.order = null; N.handHissed = false; hand.setLift(0); hand.setCine(0);
  for (const t of T.torches) { t.on = 1; t.hissed = false; } if (camera.fov !== 68) { camera.fov = 68; camera.updateProjectionMatrix(); }
}
/* An opening on black: two title cards, then a slow fade up into the Tube. Any key or tap skips it. */
function startIntro(cards, next) {
  setPhase('intro'); N.intro = true; N.introNext = next; bars(true); hideHud(true); fadeTo('#000', 1, 0); setClock(''); setGoal('', true); $('skiphint').hidden = false;
  const list = [[0.8, () => caption(...cards[0])], [3.8, captionOff]]; if (cards[1]) list.push([4.8, () => caption(...cards[1])], [7.8, captionOff], [8.8, endIntro]); else list.push([4.6, endIntro]); at(list);
}
function endIntro() { if (!N.intro) return; N.intro = false; captionOff(); $('skiphint').hidden = true; fadeTo('#000', 0, 2200); bars(false); hideHud(false); const f = N.introNext; N.introNext = null; if (f) f(); }
function skipIntro() { if (N.intro) endIntro(); }
function startWork(keep) {
  if (!keep) resetNight(); N.hintT = 0; setPhase('work'); setClock('1 a.m.'); setGoal(scrapeGoal(), true);
  say('Bass Henry', 'Scrape the plates clean. Take your time.', 5200);
  at([[7, () => setGoal('Walk down the pipe. Look for the rust patches.', true)]]);
}
/* chapter 2's last moment: water reaches your boots, and you choose what to do. Either way Mr Douparrouzel's own line follows (from his report). */
function startBoots() {
  setPhase('boots'); N.wlT = 0.03; setGoal('Look down. There is water at your boots.'); N.glanceOn = true; N.glanceT = 0;
  at([[1.2, () => say('Rudy', 'My boots are wet.')], [4.2, () => showPick('Water is round your boots. What do you do?', [['Tell Bass Henry', 'tell'], ['Keep working', 'work']], afterBoots)]]);
}
function afterBoots(v) {
  story.boots = v; saveGame(); setGoal('Keep going.', true);
  if (v === 'tell') at([[0.3, () => say('You', 'Bass Henry, there is water by my boots.', 3200)], [3.6, () => say('', 'Bass Henry nods. "Keep your eyes open."', 3800)], [8, () => say('Mr Douparrouzel', 'A little water is coming. It is not from the dam.', 5200)], [14, finishCh2]]);
  else at([[0.6, () => say('', 'You keep scraping. Somebody coughs far off.', 3200)], [3.8, () => say('Rudy', 'Did you see the water?', 3400)], [8, () => say('Mr Douparrouzel', 'A little water is coming. It is not from the dam.', 5200)], [14, finishCh2]]);
}
function finishCh2() { setStage(31); startCh3(true); }
function startCh3(fromCh2) {   /* about 4 a.m.: a title on black, then the water */
  if (!fromCh2) { resetNight(); for (const p of T.patches) T.setPatchClean(p, 1); N.scraped = T.patches.length; S.z = ZM - 6; S.yaw = 0; }
  setStage(40); N.wlT = 0.03; startIntro([['The water', 'About 4 a.m.']], startTrickle);
}
function startTrickle() {
  setPhase('trickle'); setClock('4 a.m.'); $('skip').hidden = false; setGoal('Look at the floor. Something is not right.'); N.glanceOn = true; N.glanceT = 0; N.duck = D(2.6);   /* a held breath: the sound drops away and your eyes drop to the water at your feet */
  at([[1, () => say('Rudy', 'The water is getting deeper.')], [6.5, () => say('Old Zeke', 'It will pass. It always passes.')], [11.5, () => say('', 'Far off, a low roar.', 3600)]]);
}
function startRise() {
  setPhase('rise'); setClock('4 a.m.'); setGoal('Turn around. Go to the manhole. Follow the voices.'); boom(); turnToLight();
  say('Bass Henry', 'Out, all of you! Go to the manhole!');
  at([[6, () => say('Rudy', 'This way! Hurry!')], [15, () => say('Old Zeke', 'Keep to the wall. Go on.')]]);
}
function startDark() {
  setPhase('dark'); bars(true); N.handHissed = false; N.hbT = D(1.0); N.order = T.torches.slice().sort((a, b) => Math.abs(b.pos.z - S.z) - Math.abs(a.pos.z - S.z));   /* the far torches go first */
  setGoal('Go on. Head for the pale light.', true); say('Old Zeke', 'Go on, lad. Keep going.'); turnToLight();
  at([[7, () => say('Rudy', 'I can see the light! This way!')], [14, () => say('', 'Keep your hand on the wall.', 3800)]]);
}
function startOut(skipped) {
  N.skipped = !!skipped; N.fast = !!skipped; setPhase('out'); $('skip').hidden = true; $('act').hidden = true; setGoal(skipped ? 'You are out.' : 'A hand reaches down. You are out.', true);
  N.out = { x0: S.x, z0: S.z, e0: S.eye, p0: S.pitch, y0: S.yaw }; hideHud(true); if (!skipped) { bars(true); cue('end'); airSwell(2.6); }
  at(skipped ? [[0.2, () => fadeTo('#000', 1, 700)], [1.2, showEnd]] : [[2.3, () => fadeTo('#fff', 1, 1200)], [3.8, showEnd]]);
}
function showEnd() {
  setPhase('end'); setClock(''); bars(false); hideHud(true); captionOff(); unlock('water', true); setStage(41);
  card('You are out', [N.skipped ? 'You skipped the dark part. In the story, you get out of the Tube as the sky goes grey.' : 'The air is cool. The sky is going grey.', 'Many men are still in the pipe.'],
    [{ t: 'Next chapter', go: () => { hideCard(); beginChapter(4); } }, { t: 'Play the water again', go: () => { hideCard(); beginChapter(3); } }]);
}
/* ---------- the way to the light: you start the night facing away from the manhole, so when the water comes the game turns you toward it, a cue tells you which way to turn, and the voices come from its direction ---------- */
const wrapA = (a) => Math.atan2(Math.sin(a), Math.cos(a));
function bearingTo(x, z) { const dx = x - S.x, dz = z - S.z; return wrapA(Math.atan2(-dx, -dz) - S.yaw); }   /* + means it is to your left, - to your right, 3.14 is straight behind */
function bearingToLight() { return bearingTo(0, ZM); }
function turnToLight(force) { const rel = bearingToLight(); if (!force && Math.abs(rel) < 0.9) return; N.turn = { t: 0, dur: 1.4, from: S.yaw, d: rel }; }   /* a slow, gentle turn of the head toward the shout */
function turnTo(x, z, dur = 1.4) { N.turn = { t: 0, dur, from: S.yaw, d: bearingTo(x, z) }; }
function skipNight() { if (['trickle', 'rise', 'dark'].includes(N.phase)) startOut(true); }
$('skip').onclick = skipNight;
/* a choice in the Tube: the question as a subtitle and two buttons in the column of buttons, so the hand and the words never overlap */
function showPick(text, opts, done) {
  const box = $('pick'); box.replaceChildren(); say('', text, 6e7);
  for (const [t, v] of opts) { const b = document.createElement('button'); b.className = 'btn ghost'; b.textContent = t; b.onclick = () => { uiSound('tap'); box.hidden = true; $('sub').classList.add('dim'); done(v); }; box.appendChild(b); }
  box.hidden = false; box.firstChild.focus({ preventScroll: true });
}

function nightTick(dt) {
  N.t += dt; while (N.q.length && N.t >= N.q[0][0]) N.q.shift()[1]();
  const ph = N.phase;
  if (ph === 'work') {
    for (const p of T.patches) if (p.clean >= 1 && !p.counted) {
      p.counted = true; N.scraped++; setGoal(scrapeGoal(), true); uiSound('tap');
      if (N.scraped === 3) { setClock('2 a.m.'); say('Old Zeke', 'Sand and rust. The same every Sunday night.'); }
      if (N.scraped === T.patches.length) { setClock('3 a.m.'); setGoal('Good work. Rest a moment.', true); N.allDone = true; N.doneT = 0; }
    }
    if (N.allDone) { N.doneT += dt; if (N.doneT > D(4)) startBoots(); }
    N.wl += ((N.scraped >= 3 ? 0.014 : 0) - N.wl) * Math.min(1, dt * 0.7);
  } else if (ph === 'boots' || ph === 'intro') { N.wl += (N.wlT - N.wl) * Math.min(1, dt * 0.5); }
  else if (ph === 'trickle') { N.wl = 0.03 + 0.11 * ease(N.t / D(15)); if (N.t > D(15)) startRise(); }
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
  if (['work', 'boots', 'trickle', 'rise'].includes(ph)) { N.dripT -= dt; if (N.dripT <= 0) { drip(); N.dripT = ph === 'work' ? 1.4 + Math.random() * 3 : 0.5 + Math.random() * 1.1; } }
  if (ph === 'work' || ph === 'boots') { N.clankT -= dt; if (N.clankT <= 0) { clank(); N.clankT = 9 + Math.random() * 11; } N.voiceT -= dt; if (N.voiceT <= 0) { voice(Math.random() * 1.6 - 0.8, true); N.voiceT = 5 + Math.random() * 6; } }
  if (N.torch > 0.2) { N.crackT -= dt; if (N.crackT <= 0) { crackle(); N.crackT = 3 + Math.random() * 5; } }
  if (N.duck > 0) N.duck -= dt;
  N.hintT += dt; if (N.hintT > 16 && $('hint').textContent) $('hint').textContent = '';
  N.mixT -= dt; if (N.mixT <= 0) { N.mixT = 0.1; mix(); }
}
function mix() {   /* the beds, by phase: a rumble and moving air always; a trickle, then a roar that grows with the water */
  const wl = N.wl, ph = N.phase; let rumble = 0.1, air = 0.035, stream = 0, roar = 0, rush = 0;
  if (ph === 'work' || ph === 'boots') stream = wl > 0.01 ? 0.03 : 0;
  else if (ph === 'trickle') stream = 0.03 + 0.06 * Math.min(1, wl / 0.14);
  else if (ph === 'rise' || ph === 'dark') { const k = Math.min(1, Math.max(0, (wl - 0.1) / 0.9)); stream = 0.1; roar = 0.06 + 0.5 * k; rush = 0.03 + 0.22 * k; rumble = 0.14; }
  else if (ph === 'out') { const f = 1 - ease(N.t / D(N.fast ? 1 : 3)); stream = 0.1 * f; roar = 0.5 * f; rush = 0.2 * f; rumble = 0.14 * f; air = 0.035 * f; }
  else if (ph === 'end' || ph === 'title' || ph === 'intro') { rumble = air = 0; }
  let drone = 0; if (ph === 'trickle') drone = 0.015 + 0.04 * Math.min(1, wl / 0.14); else if (ph === 'rise') drone = 0.055 + 0.1 * Math.min(1, (wl - 0.14) / 0.6); else if (ph === 'dark') drone = 0.16; else if (ph === 'out') drone = 0.16 * (1 - ease(N.t / D(N.fast ? 1 : 3)));
  const f = N.duck > 0 ? 0.1 : 1; if (N.duck > 0) drone = 0;   /* the held breath: for a moment almost everything drops away */
  setBeds({ rumble: rumble * f, air: air * f, stream: stream * f, roar: roar * f, rush: rush * f, drone }, N.duck > 0 ? 0.12 : 0.5);
}

/* ---------- the world outside: places and people (the system of Kendal 1957) ---------- */
const BASES = {}, basePromises = {};
function loadBase(id) { return BASES[id] ? Promise.resolve(BASES[id]) : (basePromises[id] = basePromises[id] || model(id).then((g) => { g.scene.traverse((o) => { if (o.isSkinnedMesh) o.frustumCulled = false; }); BASES[id] = g; return g; })); }
const SIT_HIPS = 0.12, SKIN_LIGHT = 1.55, GRIP = { lantern: { handleY: 0.31, scale: 0.85, out: 0.14 } };
const BLOB_GEO = new THREE.PlaneGeometry(1.0, 1.0), BLOB_MAT = new THREE.MeshBasicMaterial({ map: (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 2, 32, 32, 31); g.addColorStop(0, 'rgba(0,0,0,0.5)'); g.addColorStop(0.6, 'rgba(0,0,0,0.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })(), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
function makeBody(s) {
  const m = skClone(BASES[s.bodyId || s.base].scene);
  m.traverse((o) => { if (!o.isMesh) return; o.frustumCulled = false; const mat = o.material, nm = mat.name || '';
    if ((s.hide && s.hide.includes(nm)) || (s.hat === false && nm === 'Hat')) { o.visible = false; return; }
    o.material = mat.clone(); const t = s.tint && s.tint[nm]; if (t !== undefined) { o.material.vertexColors = false; o.material.color.setHex(t); o.material.needsUpdate = true; } else if (nm === 'Skin') o.material.color.setScalar((s.skin || 1) * SKIN_LIGHT);
    o.castShadow = o.receiveShadow = true; });
  m.scale.setScalar(s.scale || 1); m.position.set(s.x, s.ground || 0, s.z); m.rotation.y = s.ry || 0; m.userData.ground = s.ground || 0;
  if (!/^Sit/.test(s.anim || '')) { const b = new THREE.Mesh(BLOB_GEO, BLOB_MAT); b.rotation.x = -PI / 2; b.position.y = 0.05; b.renderOrder = 1; m.add(b); }
  const ctl = animate(m, s.anim || 'Idle'); m.userData.anim = ctl; m.userData.held = []; ctl.mx.update(0);
  if (/^Sit/.test(s.anim || '')) m.userData.noGround = true;
  if (s.seat !== undefined && /^Sit/.test(s.anim || '')) { m.userData.seatAnchor={top:s.seat}; m.updateMatrixWorld(true); const hb = m.getObjectByName('mixamorigHips'); if (hb) { m.position.y += s.seat + SIT_HIPS * (s.scale || 1) - hb.getWorldPosition(new THREE.Vector3()).y;
    m.updateMatrixWorld(true); const soles = ['LeftToeBase', 'RightToeBase'].map((n) => m.getObjectByName('mixamorig' + n)).filter(Boolean).map((b) => b.getWorldPosition(new THREE.Vector3()).y - 0.04 * (s.scale || 1)), under = (s.ground || 0) - Math.min(...soles);
    if (soles.length && under > 0.005) m.position.y += Math.min(0.1, under); } }   /* sit on the seat: the hip joint rides 12 cm above it, whatever the body's size */
  if (s.carry) { const o = CARRY[s.carry](); grip(m, 'Right', o, { handleY: o.userData.handleY, scale: 1, lift: s.carry === 'bucket' ? 0.4 : 0.25, straighten: s.carry === 'bucket' ? 0.8 : 0.3 }); m.userData.held.push({ obj: o, bone: 'RightHand', label: s.carry }); }
  if (s.lamp) { const o = lantern(); grip(m,'Right',o,{handleY:o.userData.handleY||.31,scale:.85,lift:.4,straighten:.8}); m.userData.held.push({ obj: o, bone: 'RightHand', label: 'lamp' }); s._flame = o.userData.flame; }
  return m;
}
/* things people carry in one hand (engine/grip.js holds each by its handle, upright, clear of the body): their origin is the bottom middle, handleY the grip */
const CARRY = {
  bucket() { const o = bucket(0x8a9090); o.userData.handleY = 0.47; return o; },   /* a galvanised bucket held by its bail */
  book() { const g = new THREE.Group(), c = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.24, 0.04), new THREE.MeshStandardMaterial({ color: 0x1c1a18, roughness: 0.7 })); c.position.y = 0.12; g.add(c);
    const pg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.228, 0.032), new THREE.MeshStandardMaterial({ color: 0xe8e0c8, roughness: 0.9 })); pg.position.set(0.006, 0.12, 0); g.add(pg); g.userData.handleY = 0.21; return g; },   /* a Bible, held at its top edge */
  notebook() { const g = new THREE.Group(), c = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.17, 0.02), new THREE.MeshStandardMaterial({ color: 0x5a3a22, roughness: 0.8 })); c.position.y = 0.085; g.add(c);
    const pg = new THREE.Mesh(new THREE.BoxGeometry(0.104, 0.16, 0.016), new THREE.MeshStandardMaterial({ color: 0xf0ead8, roughness: 0.9 })); pg.position.set(0.004, 0.085, 0); g.add(pg); g.userData.handleY = 0.15; return g; },   /* the reporter's notebook */
};
const PL = {}; let cur = 'tube';
const BUILD = { station: buildStation, kingston: buildKingston, yard: buildYard, ruins: buildRuins };
const placeLoading = {};
function buildPlace(id) {   /* the geometry only: quick. People come later (ensurePlace). */
  if (PL[id]) return PL[id]; const P = BUILD[id](); P.group.visible = false; scene.add(P.group); P.bodies = []; P.npcs = []; P.specs = { people: P.people, extras: P.extras }; P.people = []; P.extras = []; P.populated = false; P.keepOut = P.keepOut || []; PL[id] = P;
  if (__DEV__) P.snap = snapMeshes(P.group); P.batch = batchStatic(P.group);
  P.group.traverse((o) => { if (o.isMesh && !o.isInstancedMesh && !(o.material.transparent) && !(o.material.alphaTest > 0)) { o.castShadow = o.receiveShadow = true; } });
  P.actions = (ACTIONS_FOR[id] || (() => []))(P); return P;
}
/* spreadOut: nobody stands inside anybody (as in Kendal). Background figures too close to someone are moved to a free spot nearby, or dropped. The audit then checks the result. */
function spreadOut(P) {
  let s0 = 77; const r = () => ((s0 = (Math.imul(s0, 1664525) + 1013904223) >>> 0) / 4294967296), seated = (e) => /^Sit/.test(e.anim || '');
  const fixed = []; for (const p of P.specs.people) fixed.push([p.x, p.z, seated(p) ? 0.4 : 0.7]); for (const k of P.keepOut) fixed.push(k);
  const b = P.bounds, inWall = (x, z) => P.walls.some((w) => x > w[0] - 0.3 && x < w[2] + 0.3 && z > w[1] - 0.3 && z < w[3] + 0.3), keep = [];
  const free = (x, z) => !inWall(x, z) && fixed.every((f) => Math.hypot(f[0] - x, f[1] - z) >= Math.max(0.72, f[2])) && Math.hypot(x - P.start.x, z - P.start.z) > 1.4;
  for (const e of P.specs.extras) {
    if (seated(e) || e.fixed) { keep.push(e); fixed.push([e.x, e.z, 0.5]); continue; }
    let ok = free(e.x, e.z), tries = 0; const x0 = e.x, z0 = e.z;
    while (!ok && tries++ < 40) { e.x = Math.max(b.x0, Math.min(b.x1, x0 + (r() - 0.5) * 2 * (1 + tries * 0.12))); e.z = Math.max(b.z0, Math.min(b.z1, z0 + (r() - 0.5) * 2 * (1 + tries * 0.12))); ok = free(e.x, e.z); }
    if (ok) { keep.push(e); fixed.push([e.x, e.z, 0.72]); }
  }
  P.specs.extras = keep;
}
function ensurePlace(id) {   /* the place with its people: loads the bodies it needs */
  const P = buildPlace(id); if (P.populated) return Promise.resolve(P); if (placeLoading[id]) return placeLoading[id];
  return (placeLoading[id] = (async () => {
    spreadOut(P);
    for (const e of P.specs.extras) e.bodyId = e.base + '_lo'; for (const e of P.specs.people) e.bodyId = e.base;   /* people you talk to get the full body; background figures get a light copy */
    await Promise.all([...new Set([...P.specs.people, ...P.specs.extras].map((s) => s.bodyId))].map(loadBase));
    const mk = (s, talk) => { const n = Object.assign(s, { talked: false, heard: 0, hx: s.x, hz: s.z, ry0: s.ry || 0, extra: !talk }); n.m = makeBody(s); n.m.visible = false; P.group.add(n.m); n.ctl = n.m.userData.anim; P.bodies.push(n.m); P.npcs.push(n); return n; };
    P.people = P.specs.people.map((s) => mk(s, true)); P.extras = P.specs.extras.map((s) => mk(s, false)); P.people.forEach(addMark);
    if (P.group.visible) for (const n of P.npcs) n.m.visible = !n.hidden;
    P.populated = true; delete placeLoading[id]; return P;
  })());
}
const P_ = () => (cur === 'tube' ? null : PL[cur]);
const byId = (id) => { for (const k of Object.keys(PL)) { const n = PL[k].people.find((p) => p.id === id); if (n) return n; } return null; };
function showPerson(n, on) { if (!n) return; n.hidden = !on; if (n.m) n.m.visible = on && PL[cur] && PL[cur].people.includes(n); }
function enterPlace(id, { keepPos = false, env } = {}) {
  cur = id; const P = PL[id]; setMode('world');
  for (const k of Object.keys(PL)) { const Q = PL[k]; Q.group.visible = k === id; for (const n of Q.npcs) { if (n.mark) n.mark.visible = false; n.m.visible = k === id && !n.hidden; } }
  setEnv(env || P.env); near = null; smoke.clear();
  if (!keepPos) { S.x = P.start.x; S.z = P.start.z; S.yaw = P.start.yaw; S.pitch = 0; }
  S.eye = P.eye || 1.6; stick.id = null; stick.dx = stick.dy = 0; $('stick').hidden = true;
  const fov = camera.aspect < 0.8 ? 76 : 66; if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
}
function enterTube() {
  cur = 'tube'; for (const k of Object.keys(PL)) { PL[k].group.visible = false; for (const n of PL[k].npcs) if (n.mark) n.mark.visible = false; } setMode('tube'); near = null; TB.el && (TB.el.hidden = true);
  if (camera.fov !== 68) { camera.fov = 68; camera.updateProjectionMatrix(); } hand.place(camera.aspect, camera.fov, innerHeight, innerWidth);
}
const smoke = makeSmoke(scene, 30);
function clampWorld(x, z) {
  const P = P_(), b = P.bounds; x = Math.max(b.x0, Math.min(b.x1, x)); z = Math.max(b.z0, Math.min(b.z1, z));
  for (let pass = 0; pass < 2; pass++) for (const [x0, z0, x1, z1] of P.walls) if (x > x0 - 0.25 && x < x1 + 0.25 && z > z0 - 0.25 && z < z1 + 0.25) { const dl = x - (x0 - 0.25), dr = x1 + 0.25 - x, dt = z - (z0 - 0.25), db = z1 + 0.25 - z, m = Math.min(dl, dr, dt, db); if (m === dl) x = x0 - 0.25; else if (m === dr) x = x1 + 0.25; else if (m === dt) z = z0 - 0.25; else z = z1 + 0.25; }
  for (const n of P.npcs) { if (!n.m || !n.m.visible) continue; const rr = /^Sit/.test(n.anim || '') ? 0.45 : 0.5, d = Math.hypot(x - n.x, z - n.z); if (d < rr) { x = n.x + (x - n.x) / (d || 1) * rr; z = n.z + (z - n.z) / (d || 1) * rr; } }
  return [x, z];
}
const faceTo = (m, want, dt, k = 5) => { let e = want - m.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); m.rotation.y += e * Math.min(1, dt * k); };
function npcTick(n, dt) {
  const m = n.m; if (!m || !m.visible || n.extra || /^Sit/.test(n.anim || '')) return; const d = Math.hypot(S.x - n.x, S.z - n.z);
  if ((d < 3.2 && !n.see) || talkWith === n) faceTo(m, Math.atan2(S.x - n.x, S.z - n.z), dt); else faceTo(m, n.ry0, dt, 2);
}

/* ---------- a glowing mark over each person you can talk to, and a tap bubble with the name over the nearest ---------- */
/* the far marker over someone you can talk to: a flat gold badge with a speech balloon, the same as the tap bubble, so it never looks like a lamp floating in the air */
const BUBBLE = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.fillStyle = 'rgba(40,26,8,0.55)'; x.beginPath(); x.arc(64, 68, 50, 0, PI * 2); x.fill(); x.fillStyle = '#f0b93e'; x.strokeStyle = '#3a2608'; x.lineWidth = 6; x.beginPath(); x.arc(64, 62, 48, 0, PI * 2); x.fill(); x.stroke();
  x.fillStyle = '#fff6dc'; x.strokeStyle = '#3a2608'; x.lineWidth = 4; x.beginPath(); x.ellipse(64, 58, 28, 21, 0, 0, PI * 2); x.fill(); x.stroke(); x.beginPath(); x.moveTo(50, 74); x.lineTo(44, 90); x.lineTo(62, 78); x.fill(); x.fillStyle = '#3a2608'; for (const dx of [-12, 0, 12]) { x.beginPath(); x.arc(64 + dx, 58, 4.5, 0, PI * 2); x.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
const TALK_SVG = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12c0 4-4 7-9 7-1.2 0-2.4-.2-3.4-.5L3 20l1.5-4.2C3.6 14.7 3 13.4 3 12c0-4 4-7 9-7s9 3 9 7z"/><circle cx="8" cy="12" r=".6" fill="currentColor"/><circle cx="12" cy="12" r=".6" fill="currentColor"/><circle cx="16" cy="12" r=".6" fill="currentColor"/></svg>';
const EYE_SVG = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const TB = { el: null, v: new THREE.Vector3(), rects: [], rectT: 0 };
function addMark(n) { n.mark = new THREE.Sprite(new THREE.SpriteMaterial({ map: BUBBLE, transparent: true, depthWrite: false, depthTest: true, fog: false })); n.mark.renderOrder = 5; n.mark.visible = false; scene.add(n.mark); }
const headTop = (n) => (n.m.userData.ground || 0) + (/^Sit/.test(n.anim || '') ? (n.h || 1.3) : (n.h || 1.8)) - 0.03;
const markWanted = (n) => wantsTalk(n) || (n.see && stage === 51 && !ctr['seen_' + SEEN_GROUP[n.id]]);
function bubbleTick(now) {
  const P = P_(), show = MODE === 'world' && S.started && !locked() && !POSTER;
  for (const Q of Object.values(PL)) for (const n of Q.people) { const m = n.mark; if (!m) continue; if (!show || Q !== P || !n.m.visible || !markWanted(n)) { m.visible = false; continue; } const d = Math.hypot(S.x - n.x, S.z - n.z), k = (0.4 + d * 0.035) * (1 + Math.sin(now * 2 + n.x) * 0.1);
    m.position.set(n.x, headTop(n) + 0.17 + Math.sin(now * 2.4 + n.x) * 0.03, n.z); m.scale.set(k, k, k); m.material.opacity = Math.max(0.6, 1 - d / 20); m.visible = near !== n && d < 40; }
  if (!TB.el) { TB.el = document.createElement('button'); TB.el.id = 'tbub'; TB.el.className = 'tbub'; TB.el.hidden = true; document.body.appendChild(TB.el); TB.el.addEventListener('click', (e) => { e.stopPropagation(); if (near && !near.go && !locked()) activate(near); }); }
  const on = show && near && !near.go; if (!on) { TB.el.hidden = true; return; }
  TB.v.set(near.x, headTop(near) + 0.08, near.z).project(camera); if (TB.v.z > 1) { TB.el.hidden = true; return; }
  const x = (TB.v.x + 1) / 2 * innerWidth, y = (1 - TB.v.y) / 2 * innerHeight;
  if (now - TB.rectT > 0.25) { TB.rectT = now; TB.rects = ['goal', 'icons', 'clock', 'act', 'skip', 'exit', 'holdbox', 'toast', 'way', 'sub', 'pick', 'hint'].map($).filter((e) => e && !e.closest('[hidden]') && !(e.id === 'sub' && e.classList.contains('dim')) && e.textContent.trim() !== '' && getComputedStyle(e).visibility !== 'hidden').map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0); }
  const bw = 120, bh = 86, r = { left: x - bw / 2, right: x + bw / 2, top: y - bh, bottom: y };   /* the bubble and the name over it: hidden where it would cover a word or button, or leave the screen */
  const clash = r.left < 4 || r.right > innerWidth - 4 || r.top < 4 || r.bottom > innerHeight - 4 || TB.rects.some((b) => r.left < b.right && b.left < r.right && r.top < b.bottom && b.top < r.bottom);
  if (clash) { TB.el.hidden = true; return; } TB.el.hidden = false; TB.el.style.left = x + 'px'; TB.el.style.top = y + 'px';
  if (TB.el.dataset.label !== near.who) { TB.el.dataset.label = near.who; TB.el.innerHTML = (near.see ? EYE_SVG : TALK_SVG) + '<span class="who">' + near.who + '</span>'; TB.el.setAttribute('aria-label', (near.see ? 'Look at ' : 'Talk to ') + near.who); }
}

/* ---------- the journal ---------- */
const unlocked = [], story = {}, ctr = {}, doneCh = [false, false, false, false, false, false];
function showCount() { $('jcount').textContent = unlocked.length; $('jcount').hidden = !unlocked.length; }
function unlock(id, quiet) { if (unlocked.includes(id) || !JOURNAL.some((p) => p.id === id)) return; unlocked.push(id); showCount(); saveGame(); if (!quiet) { uiSound('page'); toast('Journal: ' + JOURNAL.find((p) => p.id === id).title); } }
function refreshJourney() { const p = JOURNAL.find((x) => x.id === 'journey'), lines = Object.keys(CHOICE_NAMES).map((k) => (story[k] ? CHOICE_NAMES[k][story[k]] : null)).filter(Boolean); p.simple = ['You finished the story.', ...(lines.length ? lines : ['You made no choices yet.'])]; }
function renderJournal(sel) {
  refreshJourney(); const tabs = $('jtabs'); tabs.replaceChildren(); const open = sel || unlocked[unlocked.length - 1];
  JOURNAL.filter((p) => unlocked.includes(p.id)).forEach((p) => { const b = document.createElement('button'); b.className = 'tab' + (p.id === open ? ' on' : ''); b.textContent = p.title; b.onclick = () => renderJournal(p.id); tabs.appendChild(b); });
  const left = JOURNAL.length - unlocked.length; if (left > 0) { const m = document.createElement('button'); m.className = 'tab'; m.disabled = true; m.textContent = left + ' more to find'; tabs.appendChild(m); }
  const page = $('jpage'); page.replaceChildren(); const p = JOURNAL.find((x) => x.id === open);
  if (!p) { const e = document.createElement('p'); e.textContent = 'Your journal is empty. Talk to people to fill it.'; page.appendChild(e); return; }
  const h = document.createElement('h3'); h.textContent = p.title; page.appendChild(h); for (const t of p.simple) { const e = document.createElement('p'); e.textContent = t; page.appendChild(e); }
  const d = document.createElement('details'), s = document.createElement('summary'); s.textContent = 'Dig deeper'; d.appendChild(s); for (const t of p.deeper) { const e = document.createElement('p'); e.textContent = t; d.appendChild(e); } page.appendChild(d);
}
function openJournal(sel) { if (!$('journal').hidden) return; closeChapters(); closeCredits(); keys.clear(); renderJournal(typeof sel === 'string' ? sel : undefined); $('journal').hidden = false; $('jclose').focus(); }
function closeJournal() { if ($('journal').hidden) return; $('journal').hidden = true; }
$('jbtn').onclick = () => openJournal(); $('jclose').onclick = closeJournal;
const MENU = { ok: false, url: '../../../menu/' };   /* the Main Menu buttons show only where the real game menu exists (the website, not a single-file copy) */
{ const links = ['allgames', 'jhome'].map($); for (const a of links) a.hidden = true; fetch(MENU.url, { cache: 'no-store' }).then((r) => (r.ok ? r.text() : '')).then((t) => { if (/History Games/.test(t)) { MENU.ok = true; for (const a of links) a.hidden = false; } }).catch(() => {}); }
function toMenu() { saveGame(); location.href = MENU.url; }

/* ---------- cards ---------- */
const CARD = { dismiss: null };
function card(title, paras, btns, { col = false, credit = false } = {}) {
  $('ctitle').textContent = title; const b = $('cbody'); b.replaceChildren(); for (const t of paras) { const p = document.createElement('p'); p.textContent = t; b.appendChild(p); }
  const bb = $('cbtns'); bb.replaceChildren(); bb.classList.toggle('col', col); btns.forEach((x, i) => { const el = document.createElement('button'); el.className = 'btn' + (i ? ' ghost' : ''); el.textContent = x.t; el.onclick = x.go; bb.appendChild(el); });
  $('ccredit').hidden = !credit; $('card').hidden = false; keys.clear(); const f = bb.querySelector('button'); if (f) f.focus({ preventScroll: true });
}
function hideCard() { $('card').hidden = true; }
/* a fade to black with a chapter title, the scene changed while it is dark, then a fade back */
async function chapterFade(title, sub, fn) {
  fading = true; hideHud(true); fadeTo('#000', 1, 800); await wait(0.9); fn(); caption(title, sub); await wait(2.6); captionOff(); await wait(0.9); fadeTo('#000', 0, 1200); hideHud(false); fading = false;
}

/* ---------- talking: one line at a time; "You" lines get their own colour; the x, Escape or a tap outside ends it ---------- */
let step = 0, lines = [], talkN = 0, talkFull = false, convoEnd = null, convoForced = false; const TALKS = ['Talk1', 'Talk2', 'Talk3'];
const ALIAS = () => ({ zekeV: 'zekeValve', grant: stage >= 63 ? 'grant2' : 'grant', kemar: stage >= 64 ? 'kemar2' : 'kemar' });
const wantsTalk = (n) => !n.extra && !n.see && !n.talked && (TALK_TARGETS[stage] || []).includes(n.id);
function activate(t) { if (t.go) t.go(); else if (t.see) look(t); else startTalk(t); }
function startTalk(n) {
  if (locked()) return; talkFull = wantsTalk(n); const id = ALIAS()[n.id] || n.id;
  if (talkFull) lines = [...TALK[id](story)]; else { const later = (LATER[n.id] || (() => ['...']))(story); lines = [{ who: n.who, text: later[n.heard++ % later.length] }]; }
  convoForced = false; openConvo(lines, null, n);
}
function convo(ls, onEnd, who) { talkFull = false; convoForced = true; openConvo([...ls], onEnd, who || null); }
function openConvo(ls, onEnd, n) { document.body.classList.add('talk'); talkWith = n || null; lines = ls; convoEnd = onEnd; keys.clear(); step = 0; uiSound('tap'); $('dialogue').hidden = false; showLine(); }
function showLine() {
  const s = lines[step], me = s.who === 'You' || !!s.choices; if (s.unlock) unlock(s.unlock);
  $('who').textContent = s.who; $('who').hidden = !s.who; $('line').textContent = s.text; $('dialogue').classList.toggle('me', me); $('dialogue').classList.toggle('narr', !s.who);
  const box = $('choices'); box.replaceChildren(); $('next').hidden = !!s.choices;
  if (s.choices) { s.choices.forEach((c) => { const b = document.createElement('button'); b.className = 'btn ghost'; b.textContent = c.t; b.onclick = () => choose(s, c); box.appendChild(b); }); box.firstChild.focus({ preventScroll: true }); } else $('next').focus({ preventScroll: true });
  const ac = talkWith && talkWith.ctl; if (ac && !/^Sit/.test(talkWith.anim || '')) { if (me || !s.who) ac.play(null); else if (s.anim && CL[s.anim]) ac.play(s.anim, true); else if (CL.Talk1) ac.play(TALKS[talkN++ % 3]); }
}
function choose(s, c) { uiSound('tap'); if (c.set) Object.assign(story, c.set); saveGame(); lines.splice(step + 1, 0, ...(c.then || [])); step++; if (step >= lines.length) endTalk(true); else showLine(); }
function nextLine() { uiSound('tap'); step++; if (step >= lines.length) { endTalk(true); return; } showLine(); }
function endTalk(finished) {
  document.body.classList.remove('talk'); const n = talkWith, cb = convoEnd; talkWith = null; convoEnd = null; $('dialogue').hidden = true; if (n && n.ctl && !/^Sit/.test(n.anim || '')) n.ctl.play(null);
  const forced = convoForced; convoForced = false;
  if (finished && n && talkFull) { n.talked = true; saveGame(); onTalked(n); } if (cb && (finished || forced)) cb();
}
function leaveTalk() { if (!$('dialogue').hidden) endTalk(false); }
$('next').onclick = nextLine; $('dclose').onclick = leaveTalk;
/* the real people of the morning are seen, not heard: looking at one shows what the record says they did */
function look(n) {
  say('', SEEN[n.id], 5600); uiSound('tap'); const g = SEEN_GROUP[n.id];
  if (stage === 51 && !ctr['seen_' + g]) { ctr['seen_' + g] = 1; ctr.seen = (ctr.seen || 0) + 1; refreshGoal(true); if (ctr.seen >= 4) run([[3.4, () => setStage(52)]]); }
}

/* ---------- puzzles: put things in order (the notice board, what came after) or sort cards into groups (the reporter, Kemar's question) ---------- */
const PZ = { done: null, kind: '', i: 0, items: null };
function openOrder(title, items, prompt, done, { years = false } = {}) {   /* items: [[name, note or year]] in the right order. A wrong pick just says "Not yet. Try again." */
  keys.clear(); Object.assign(PZ, { done, kind: 'order', i: 0, items, years }); $('pztitle').textContent = title; $('pzprog').textContent = prompt; $('pzcard').hidden = true; $('pzlist').replaceChildren(); $('pzlist').hidden = false; $('pzmsg').textContent = 'Which comes first?';
  const reference=$('pzreference');reference.hidden=years;reference.open=false;$('pzguide').hidden=years;$('pzguide').textContent=years?'':'Board guide: '+items.map(e=>e[0].replace(/^The /,'')).join(' → ');
  if(!years){const texture=noticeTex(false);$('pzboard').src=texture.image.toDataURL();texture.dispose();$('pzfacts').textContent=items.map(e=>e[1]).join(' ');}
  const tray = $('pztray'); tray.replaceChildren(); const order = items.map((e, i) => i), r = (k) => ((k * 7 + 3) % items.length); order.sort((a, b) => r(a) - r(b));   /* a fixed shuffle, so the board looks the same every time */
  for (const i of order) { const b = document.createElement('button'); b.className = 'pc'; b.dataset.i = i; b.textContent = items[i][0]; if(!years){const img=document.createElement('img');img.src=journeyIcon(i);img.alt='';img.width=96;img.height=77;b.prepend(img);} b.onclick = () => pickOrder(b); tray.appendChild(b); }
  $('pzdone').hidden = true; $('pznext').hidden = true; $('puzzle').hidden = false; tray.firstChild.focus({ preventScroll: true });
}
function pickOrder(b) {
  if (+b.dataset.i !== PZ.i) { b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 400); $('pzmsg').textContent = 'Not yet. Try again.'; return; }
  uiSound('tap'); const it = PZ.items[PZ.i], li = document.createElement('li'); li.textContent = PZ.years ? it[1] + ': ' + it[0] : it[0]; $('pzlist').appendChild(li); b.remove(); PZ.i++;
  if (PZ.i >= PZ.items.length) { $('pzmsg').textContent = PZ.years ? 'Yes! That is the order it happened.' : 'Yes! That is the journey of the water.'; $('pzdone').hidden = false; $('pzdone').focus({ preventScroll: true }); } else $('pzmsg').textContent = PZ.years ? 'Good. What came next?' : 'Good. ' + it[1] + ' What comes next?';
}
function openSort(set, done) {   /* set: { title, prompt, bins: [[key, label]], cards: [[text, key, reply]] } */
  $('pzreference').hidden=true;$('pzguide').hidden=true;keys.clear(); Object.assign(PZ, { done, kind: 'sort', i: 0, items: set }); $('pztitle').textContent = set.title; $('pzlist').hidden = true; $('pzcard').hidden = false;
  const tray = $('pztray'); tray.replaceChildren(); for (const [k, label] of set.bins) { const b = document.createElement('button'); b.className = 'pc'; b.dataset.a = k; b.textContent = label; b.onclick = () => answerSort(b); tray.appendChild(b); }
  $('pzdone').hidden = true; $('puzzle').hidden = false; showSortCard();
}
function showSortCard() { const set = PZ.items, c = set.cards[PZ.i]; $('pzprog').textContent = 'Card ' + (PZ.i + 1) + ' of ' + set.cards.length; $('pzcard').textContent = c[0]; $('pzmsg').textContent = set.prompt; $('pznext').hidden = true; $('pztray').hidden = false; $('pztray').firstChild.focus({ preventScroll: true }); }
function answerSort(b) {
  const set = PZ.items, c = set.cards[PZ.i]; if (b.dataset.a !== c[1]) { b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 400); $('pzmsg').textContent = 'Not yet. Try again.'; return; }
  uiSound('tap'); $('pzmsg').textContent = c[2]; $('pztray').hidden = true; if (PZ.i + 1 >= set.cards.length) { $('pzdone').hidden = false; $('pzdone').focus({ preventScroll: true }); } else { $('pznext').hidden = false; $('pznext').focus({ preventScroll: true }); }
}
$('pznext').onclick = () => { PZ.i++; showSortCard(); };
function closePuzzle(done) { if ($('puzzle').hidden) return; $('puzzle').hidden = true; $('pztray').hidden = false; if (done && PZ.done) { const f = PZ.done; PZ.done = null; f(); } }
$('pzx').onclick = () => closePuzzle(false); $('pzdone').onclick = () => closePuzzle(true);

/* ---------- goals and the helper ---------- */
let stage = 0, best = 0;
function refreshGoal(quiet) { if (cur === 'tube') return; const g = GOALS[stage]; setGoal(g ? g(ctr) : '', quiet); }
function showHint() { $('hint').textContent = TOUCH ? (MODE === 'tube' ? 'Left thumb to walk. Drag to look. Tap the rust.' : 'Left thumb to walk. Drag to look. Tap a person to talk.') : (MODE === 'tube' ? 'WASD to walk. Drag to look. E to scrape.' : 'WASD to walk. Drag to look. Space or Enter to talk or use.'); N.hintT = 0; }
/* the helper (the same rules as the other games): stand still for 15 s, or take 50 s over one goal, and the goal opens again and a gold arrow marks the next
   thing to do: a down arrow with "Here!" floating over the person or the place, or a side arrow ("This way", "Turn around") when it is off the screen.
   The arrow is moved up or down out of the way of every word and button (and the tap bubble); if there is no free spot it waits. In the Tube the night keeps its own cue (#way). */
const NUDGE = { goal: '', since: 0, still: 0, lx: 0, lz: 0, on: false, rectT: -1, rects: [] }, _nv = new THREE.Vector3();
const NUDGE_AVOID = ['goal', 'icons', 'clock', 'sub', 'toast', 'way', 'pick', 'act', 'holdbox', 'skip', 'exit', 'hint', 'barT', 'barB', 'dialogue', 'tbub'];
function nudgeTarget() {
  const P = P_(); if (!P) return null; const a = P.actions.find((x) => x.on()); if (a) return [a.x, a.z, 1.7];
  let bt = null, bd = 1e9; for (const n of P.people) if (n.m && n.m.visible && markWanted(n)) { const d = Math.hypot(S.x - n.x, S.z - n.z); if (d < bd) { bd = d; bt = [n.x, n.z, headTop(n) + 0.75]; } } return bt;
}
function placeNudge(x, y, cls, label, fresh) {   /* show the arrow near (x, y) on the screen, moved to the nearest spot that covers no word or button */
  const el = $('nudge'), W = innerWidth, H = innerHeight, lab = el.querySelector('span'); if (el.className !== cls) el.className = cls; if (lab.textContent !== label) lab.textContent = label; el.hidden = false;
  const now = performance.now(); if (fresh || now - NUDGE.rectT > 250) { NUDGE.rectT = now; NUDGE.rects = NUDGE_AVOID.map($).filter((e) => e && !e.closest('[hidden]') && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).display !== 'none' && (e.tagName !== 'P' || e.textContent.trim()) && !(e.id === 'sub' && e.classList.contains('dim'))).map((e) => e.getBoundingClientRect()).filter((r) => r.width > 1 && r.height > 1); }
  const hw = (el.offsetWidth || 90) / 2 + 4, hh = (el.offsetHeight || 80) / 2 + 4; x = Math.max(hw + 6, Math.min(W - hw - 6, x));
  const free = (xx, yy) => yy - hh >= 4 && yy + hh <= H - 4 && !NUDGE.rects.some((q) => xx - hw < q.right && q.left < xx + hw && yy - hh < q.bottom && q.top < yy + hh);
  for (let k = 0; k < 60; k++) for (const sy of [1, -1]) { const yy = y + sy * k * 10; if (free(x, yy)) { el.style.left = x + 'px'; el.style.top = yy + 'px'; return true; } }
  el.hidden = true; return false;
}
function nudgeTick(now) {
  const el = $('nudge'); if (MODE !== 'world') { el.hidden = true; return; } if (!$('way').hidden) $('way').hidden = true;
  const quiet = S.started && !locked() && !RIDE.on && goalText && $('holdbox').hidden && $('dialogue').hidden && !fading;
  if (goalText !== NUDGE.goal) { NUDGE.goal = goalText; NUDGE.since = now; NUDGE.on = false; }
  if (Math.hypot(S.x - NUDGE.lx, S.z - NUDGE.lz) > 0.6) { NUDGE.lx = S.x; NUDGE.lz = S.z; NUDGE.still = now; }
  if (!quiet) { NUDGE.since = Math.max(NUDGE.since, now - 30); NUDGE.still = now; }
  const tgt = quiet ? nudgeTarget() : null;
  if (!NUDGE.on && quiet && tgt && (now - NUDGE.still > 15 || now - NUDGE.since > 50)) { NUDGE.on = true; setGoal(goalText, true); }
  if (NUDGE.on && tgt && Math.hypot(S.x - tgt[0], S.z - tgt[1]) < 2.4) { NUDGE.on = false; NUDGE.since = NUDGE.still = now; }
  if (!NUDGE.on || !tgt) { if (!el.hidden) el.hidden = true; return; }
  showNudgeAt(tgt);
}
function showNudgeAt(tgt, fresh) {   /* the arrow for a target [x, z, height]: over it when it is in view, at the side of the screen when it is not */
  const W = innerWidth, H = innerHeight, rel = bearingTo(tgt[0], tgt[1]); _nv.set(tgt[0], tgt[2] || 1.8, tgt[1]).project(camera);
  if (Math.abs(rel) < 0.55 && _nv.z < 1 && Math.abs(_nv.x) < 0.95) { const sy = (1 - _nv.y) / 2 * H; return placeNudge((_nv.x + 1) / 2 * W, Math.max(70, Math.min(H * 0.7, sy)), 'down', sy > H * 0.8 ? 'Look down' : 'Here!', fresh); }
  const left = rel > 0, behind = Math.abs(rel) > 2.2; return placeNudge(left ? 60 : W - 60, H * 0.45, left ? 'left' : 'right', behind ? 'Turn around' : 'This way', fresh);
}

/* ---------- saving: kept in this browser only ---------- */
const SAVE_KEY = 'bogwalk-save'; let hasSave = false, erasing = false;
function saveGame() { if (erasing || (__DEV__ && q.has('nosave'))) return; try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 1, unlocked, stage, best, story, done: doneCh })); } catch (e) { /* storage may be blocked; the game still plays */ } }
function loadGame() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; } }
function applySave(d) {
  if (!d || !Array.isArray(d.unlocked)) return; for (const id of d.unlocked) if (JOURNAL.some((p) => p.id === id) && !unlocked.includes(id)) unlocked.push(id);
  if (d.story && typeof d.story === 'object') for (const k of Object.keys(CHOICE_NAMES)) if (d.story[k] in CHOICE_NAMES[k]) story[k] = d.story[k];
  if (Array.isArray(d.done)) d.done.forEach((v, i) => { if (i < 6) doneCh[i] = !!v; });
  stage = Number.isInteger(d.stage) && (d.stage in GOALS) ? d.stage : 0; best = Number.isInteger(d.best) ? Math.max(d.best, stage) : stage; hasSave = stage > 0 || doneCh.some(Boolean);
}
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && S.started) saveGame(); });

/* ---------- chapters, stages and the story machine ---------- */
const CH_PLACE = ['station', 'kingston', 'tube', 'tube', 'yard', 'ruins'], CH_FIRST = [10, 20, 30, 40, 50, 60], DONE = [16, 24, 31, 41, 55, 65];
const SAFE = { 15: 14, 16: 14, 21: 21, 22: 22, 23: 22, 24: 22, 31: 40, 41: 40, 54: 53, 55: 53, 65: 64 };   /* a saved game resumes at a stage where the place can be set up again */
const chapterOf = (s) => Math.max(0, Math.min(5, Math.floor(s / 10) - 1));
const ON = {};
function setStage(s) {
  stage = s; best = Math.max(best, s); for (const k of Object.keys(ctr)) delete ctr[k]; for (const P of Object.values(PL)) for (const n of P.people) n.talked = false;
  const di = DONE.indexOf(s); if (di >= 0) doneCh[di] = true; saveGame(); refreshGoal(); if (ON[s]) ON[s]();
}
let teacherMode=false;try{teacherMode=localStorage.getItem('bogwalk-teacher')==='1';}catch{}
function chapterOpen(i) { return teacherMode || i === 0 || ((i === 1 || i === 2) ? doneCh[0] : doneCh[i - 1]); }   /* Zeke's story (1) is a side path: both it and the Tube (2) open after the station (0) */
function renderChapters() {
  $('chteacher').setAttribute('aria-pressed',String(teacherMode));$('chteacher').textContent=teacherMode?'Teacher unlock: on':'Teacher unlock';$('chteachernote').hidden=!teacherMode;
  const ul = $('chlist'); ul.replaceChildren();
  CHAPTERS.forEach((c, i) => { const open = chapterOpen(i), dn = doneCh[i], li = document.createElement('li'), b = document.createElement('button'); b.className = 'chbtn' + (dn ? ' done' : ''); b.disabled = !open || !modelsReady;
    for (const [cls, txt] of [['yr', c.year], ['nm', (i + 1) + '. ' + c.name], ['st', !modelsReady ? 'Loading' : dn ? 'Done' : open ? 'Play' : 'Locked']]) { const sp = document.createElement('span'); sp.className = cls; sp.textContent = txt; b.appendChild(sp); }
    b.onclick = () => { closeChapters(); if (!S.started) startGame(); beginChapter(i); }; li.appendChild(b); ul.appendChild(li); });
  $('chreset').textContent = 'Start again'; $('chreset').dataset.armed = '';
}
function openChapters() { closeJournal(); closeCredits(); keys.clear(); renderChapters(); $('chapters').hidden = false; const f = $('chlist').querySelector('button:not(:disabled)'); (f || $('chclose')).focus(); }
function closeChapters() { if ($('chapters').hidden) return; $('chapters').hidden = true; if (S.started) canvas.focus(); }
$('chteacher').onclick=()=>{teacherMode=!teacherMode;try{localStorage.setItem('bogwalk-teacher',teacherMode?'1':'0');}catch{}renderChapters();$('chteacher').focus();};
$('chclose').onclick = closeChapters; $('tchap').onclick = openChapters; $('jchap').onclick = openChapters;
function eraseAll() { erasing = true; try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ } location.reload(); }
$('chreset').onclick = () => { const b = $('chreset'); if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'Tap again to erase all progress'; return; } eraseAll(); };
function openCredits() { closeJournal(); closeChapters(); keys.clear(); $('credits').hidden = false; $('crclose').focus(); }
function closeCredits() { if ($('credits').hidden) return; $('credits').hidden = true; }
$('dev').onclick = openCredits; $('chcred').onclick = openCredits; $('crclose').onclick = closeCredits;
$('reset').onclick = () => { if (fading || !S.started) return; closeJournal(); leaveTalk(); closePuzzle(false); const i = chapterOf(stage);
  card('Reset', ['Start this chapter again, or start the whole story again.'], [{ t: 'Restart "' + CHAPTERS[i].name + '"', go: () => { hideCard(); beginChapter(i); } }, { t: 'Start the whole story again', go: () => card('Start again?', ['This wipes everything, even your journal.'], [{ t: 'Yes, start again', go: eraseAll }, { t: 'No, keep playing', go: hideCard }]) }, ...(MENU.ok ? [{ t: 'Main Menu', go: toMenu }] : []), { t: 'Cancel', go: hideCard }]); };
$('exit').onclick = () => { if (locked()) return; card('Leave Zeke\'s story?', ['You can come back to it from the Chapters list.'], [{ t: 'Yes, go into the Tube', go: () => { hideCard(); beginChapter(2); } }, { t: 'No, stay here', go: hideCard }]); };

function resetTransient() {   /* leave anything running: scripted scenes, a ride, the night's timers, the cinematic layer */
  EP++; TICKS.length = 0; frozen = false; RIDE.on = false; bars(false); hideHud(false); captionOff(); fadeTo('#000', 0, 0); $('sub').classList.add('dim'); $('holdbox').hidden = true; $('pick').hidden = true; $('nudge').hidden = true; NUDGE.on = false; $('exit').hidden = true; $('skip').hidden = true; $('way').hidden = true; $('act').hidden = true; $('vig').style.opacity = 0;
  N.q = []; N.intro = false; N.turn = null; $('skiphint').hidden = true; setClock(''); HOLD.v = 0; HOLD.on = false; setWorld({}, 0.1); setBeds({}, 0.1); smoke.clear(); leaveTalk(); closePuzzle(false); closeJournal(); closeChapters(); closeCredits(); hideCard();
}
async function beginChapter(i, st) {
  if (fading) return; resetTransient(); st = st || CH_FIRST[i]; const C = CHAPTERS[i];
  if (CH_PLACE[i] !== 'tube') { if (!PL[CH_PLACE[i]] || !PL[CH_PLACE[i]].populated) toast('Loading', 4000); await ensurePlace(CH_PLACE[i]); }
  if (i === 2) { resetNight(); enterTube(); setStage(30); N.phase = 'intro'; startIntro([['Inside the Tube', 'Monday 27 June 1904, about 1 a.m.'], ['The last tram has gone.', 'The water in the pipe is shut off.']], () => { startWork(true); showHint(); }); return; }
  if (i === 3) { enterTube(); startCh3(false); return; }
  await chapterFade(C.title, C.sub, () => startScene(i, st));
}
function startScene(i, st) {
  const id = CH_PLACE[i], P = PL[id]; S.started = true; N.phase = 'world';
  if (i === 0) { P.setPower(1); P.notice.material.map = noticeTex(st >= 14); P.notice.material.needsUpdate = true; P.valve.rotation.z = 0; showPerson(byId('zeke'), st < 14); showPerson(byId('zekeV'), st >= 14); enterPlace(id, { env: st >= 14 ? ENV.night : ENV.dusk }); setClock(st >= 14 ? 'Midnight' : 'Evening'); }
  if (i === 1) { P.car.position.x = st >= 22 ? -20 : -46; enterPlace(id); $('exit').hidden = false; for (const n of P.extras) n.ctl.play(null); }
  if (i === 4) { P.train.position.z = P.spots.trainStart; showPerson(byId('ivy'), st >= 53); enterPlace(id, { env: st >= 52 ? ENV.morning : ENV.dawn }); }
  if (i === 5) enterPlace(id);
  showHint(); setStage(st);
}
const ACTIONS_FOR = {
  station: (P) => [
    { label: 'Read the notice board', x: P.spots.notice[0], z: P.spots.notice[1], r: 2.2, on: () => stage === 13, go: () => openOrder('The journey of the water', JOURNEY, 'Tap the pictures in order, from the river to the tram.', () => { P.notice.material.map = noticeTex(true); P.notice.material.needsUpdate = true; unlock('tube'); setStage(14); }) },
  ],
  kingston: (P) => [{ label: 'Climb on to the car', get x() { return P.car.position.x - 4.4; }, z: 1.3, r: 2.2, on: () => stage === 22, go: () => setStage(23) }],   /* at the back platform, wherever the car is */
  yard: () => [],
  ruins: (P) => [{ label: 'Read the information board', x: P.spots.board[0], z: P.spots.board[1], r: 2.2, on: () => stage === 61 || stage >= 62, go: readBoard }],
};
function onTalked(n) {
  const t = TALK_TARGETS[stage] || []; if (stage === 20) { ctr.talked = t.filter((id) => byId(id) && byId(id).talked).length; refreshGoal(true); }
  if (!t.every((id) => { const p = byId(id); return p && p.talked; })) return;
  const next = { 10: 11, 11: 12, 12: 13, 14: 15, 20: 21, 50: 51, 60: 61, 64: 65 }[stage];
  if (next) { setStage(next); return; }
  if (stage === 52) openSort(REPORT, () => convo(TALK.reporterDone(), () => setStage(53), byId('reporter')));
  if (stage === 53) run([[1.2, () => setStage(54)]]);
  if (stage === 62) openSort(WHY, () => { unlock('why'); setStage(63); });
  if (stage === 63) openOrder('What came after?', AFTER, 'Tap the events in the order they happened.', () => setStage(64), { years: true });
}

/* ---------- chapter 0: the station on Sunday evening ---------- */
ON[10] = () => { unlock('who', true); };
ON[12] = () => { say('', 'The turbine house hums. Its windows glow.', 3600); };
ON[14] = async () => {   /* midnight: the sky goes dark, the last tram is done in Kingston, and Zeke goes to the valve */
  const P = PL.station; if (cur !== 'station') return; frozen = true; bars(true); setClock('Midnight'); const a = envNow;
  say('', 'Midnight. In Kingston, the last tram is done for the night.', 4600);
  const ok = await tween(5, (k) => setEnv(mixEnv(a, ENV.night, ease(k)))); if (!ok) return;
  showPerson(byId('zeke'), false); showPerson(byId('zekeV'), true); await wait(0.6); bars(false); frozen = false; refreshGoal();
};
ON[15] = () => { HOLD.v = 0; };
ON[16] = () => { setClock('Midnight'); run([[1.0, () => card('Chapter 1 is finished', ['The water is shut off. The Tube is empty.', 'Before the gang goes in, Zeke has a story to tell.'], [{ t: 'Go into the Tube', go: () => { story.story = 'skip'; saveGame(); hideCard(); beginChapter(2); } }, { t: 'Hear Zeke\'s story', go: () => { story.story = 'heard'; saveGame(); hideCard(); beginChapter(1); } }])]]); };
const HOLD = { on: false, v: 0, creakT: 0 };
for (const ev of ['pointerdown', 'pointerup', 'pointerleave', 'pointercancel']) $('hold').addEventListener(ev, (e) => { HOLD.on = ev === 'pointerdown'; $('hold').classList.toggle('on', HOLD.on); e.preventDefault(); });
addEventListener('keydown', (e) => { if (!$('holdbox').hidden && (e.key === ' ' || e.key === 'Enter' || e.key.toLowerCase() === 'e')) HOLD.on = true; }); addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter' || e.key.toLowerCase() === 'e') HOLD.on = false; });
function holdTick(dt) {   /* the valve wheel: hold the button and it turns; the hum fades, the lamps dim, the yard goes quiet */
  const P = PL.station, show = cur === 'station' && stage === 15 && !locked() && Math.hypot(S.x - P.spots.valve[0], S.z - P.spots.valve[1]) < 2.0;
  if ($('holdbox').hidden === show) $('holdbox').hidden = !show; if (!show) { HOLD.on = false; return; }
  if (HOLD.on) { HOLD.v = Math.min(1, HOLD.v + dt / D(5)); P.valve.rotation.z -= dt * 1.4; HOLD.creakT -= dt; if (HOLD.creakT <= 0) { HOLD.creakT = 0.7; valveTurn(); } }
  $('holdbar').firstElementChild.style.width = (HOLD.v * 100) + '%'; P.setPower(1 - HOLD.v);
  if (HOLD.v >= 1) { HOLD.on = false; $('holdbox').hidden = true; frozen = true; say('', 'The hum fades. The lamps go dim. The yard is quiet.', 4200); run([[3.6, () => { frozen = false; convo([{ who: 'Old Zeke', text: 'Now the Tube is empty. Our work can start.' }], () => setStage(16), byId('zekeV')); }]]); }
}

/* ---------- chapter 1: Kingston, 31 March 1899 ---------- */
ON[20] = () => { setClock(''); say('Old Zeke', 'Let me tell you about the day the trams changed.', 4600); };
const RIDE = { on: false, v: 0 };
ON[21] = async () => {   /* the first electric car glides out of the depot, with a hum and a bell, and the crowd cheers */
  const P = PL.kingston; if (cur !== 'kingston') return; frozen = true; bars(true); const car = P.car;
  if (Math.abs(S.z) < 1.8) S.z = S.z < 0 ? -2.6 : 2.6; turnTo(-30, 0, 1.6);
  say('', 'A hum. A bell. The doors open wide.', 3400); bell(2); setWorld({ motor: 0.05 });
  await wait(1.4); let x0 = car.position.x; const ok = await tween(9, (k) => { car.position.x = -46 + 26 * (1 - Math.pow(1 - k, 2)); const v = (car.position.x - x0) / Math.max(1e-3, 1 / 30); x0 = car.position.x; for (const w of car.userData.wheels) w.rotation.z -= 0.08 * Math.sign(v + 1e-6); setMotor(Math.min(6, Math.abs(v))); if (k > 0.25 && !ON[21].c) { ON[21].c = 1; cheer(16); for (const n of P.extras) if (n.ctl && CL.Cheer) n.ctl.play(['Cheer', 'Clap', 'Wave'][(n.x * 10 | 0) % 3]); say('', 'The car rolls out by itself. No mules! The crowd cheers.', 4200); } if (!N.turn) S.yaw += (wrapA(Math.atan2(-(car.position.x - S.x), -(0 - S.z)) - S.yaw)) * 0.04; });
  ON[21].c = 0; if (!ok) return; bell(1); setWorld({ motor: 0.0 }); await wait(1.2); bars(false); frozen = false; setStage(22);
};
ON[23] = async () => {   /* the ride: on the front platform, down the street toward the foot of King Street */
  const P = PL.kingston, car = P.car; if (cur !== 'kingston') return; RIDE.on = true; $('exit').hidden = true; bars(true); const fl = car.userData.floor;
  const put = () => { S.x = car.position.x + 3.0; S.z = 0.05; S.eye = fl + 1.5; };   /* on the front platform, beside the motorman's controller, looking down the street */ put(); S.yaw = -PI / 2; S.pitch = 0; bell(2); setWorld({ motor: 0.06 });
  say('', 'Ding, ding! Off we go.', 3000); let lastX = car.position.x;
  const ok = await tween(20, (k, dt) => { car.position.x = -20 + 100 * ease(k); const v = (car.position.x - lastX) / Math.max(1e-3, dt); lastX = car.position.x; for (const w of car.userData.wheels) w.rotation.z -= v * dt / 0.38; setMotor(Math.min(8, v)); put();
    if (k > 0.2 && !ON[23].a) { ON[23].a = 1; say('', 'The car glides down the street. People wave.', 3800); cheer(10); } if (k > 0.55 && !ON[23].b) { ON[23].b = 1; say('', 'On toward the foot of King Street.', 3800); } });
  ON[23].a = ON[23].b = 0; if (!ok) return; bell(1); setWorld({}); RIDE.on = false; unlock('trams');
  fadeTo('#000', 1, 900); await wait(1.0); hideHud(true); caption('The power for these trams came from Bog Walk.', 'Kingston, 1899'); await wait(3.6); captionOff(); await wait(0.8); hideHud(false); fadeTo('#000', 0, 600); bars(false); S.eye = P.eye; S.x = car.position.x - 5.5; S.z = 3.0; setStage(24);
};
ON[24] = () => { card('Chapter 2 is finished', ['That was the first electric tram. Its power came from the Tube at Bog Walk.', 'Now, back to Sunday night, 1904.'], [{ t: 'Into the Tube', go: () => { hideCard(); beginChapter(2); } }, { t: 'Stay here', go: hideCard }]); };

/* ---------- chapter 4: the morning after ---------- */
ON[50] = () => { unlock('morning', true); card('The morning after', ['Of about 61 men in the Tube, 28 came out. 33 did not.', 'The words in this chapter are gentle. Nobody is shown hurt.'], [{ t: 'Go on', go: () => { hideCard(); refreshGoal(); } }]); };
ON[52] = () => { const a = envNow; tween(8, (k) => setEnv(mixEnv(a, ENV.morning, ease(k)))); };
ON[53] = () => { showPerson(byId('ivy'), true); };
ON[54] = async () => {   /* a whistle: the special train comes in at ten to twelve with coffins for the men; the scene fades */
  const P = PL.yard; if (cur !== 'yard') return; frozen = true; bars(true); whistle(1.4); turnTo(28, -6, 1.8); const tr = P.train, a = envNow;
  await wait(1.0); say('', 'A train whistle.', 2600);
  const ok = await tween(10, (k, dt) => { tr.position.z = P.spots.trainStart + (P.spots.trainStop - P.spots.trainStart) * (1 - Math.pow(1 - k, 2)); setEnv(mixEnv(a, ENV.day, k)); if (Math.random() < dt * 4) { const c = new THREE.Vector3(); (tr.children[0].userData.chimney || tr).getWorldPosition(c); smoke.emit(c, new THREE.Vector3(0.3, 1.4, 0.2), { size: 0.8, grow: 3, life: 3, opacity: 0.45 }); } });
  if (!ok) return; whistle(0.6); say('', 'A special train came at ten to twelve. It brought coffins for the men.', 6000); await wait(6.2);
  fadeTo('#000', 1, 1600); await wait(1.8); frozen = false; bars(false); fadeTo('#000', 0, 0); unlock('paper', true); cue('sad');
  card('The morning after', ['The company paid for the burials and helped families.', 'Many people still felt someone had made a mistake.'], [{ t: 'Go on', go: () => { hideCard(); setStage(55); } }]);
};
ON[55] = () => { card('Chapter 5 is finished', ['Next, the same place today.'], [{ t: 'Next chapter', go: () => { hideCard(); beginChapter(5); } }, { t: 'Stay here', go: hideCard }]); };

/* ---------- chapter 5: the ruins today ---------- */
function readBoard() {
  unlock('ruins'); card('The information board', ['The Gleaner, 28 June 1904:', '"Fearful Catastrophe At Bog Walk. Drowning Men Fight For Life. Sudden Rush of Water Causes Panic. 33 Able-Bodied Men Drowned In Water-Pipe. No Accurate Information as To Cause Of The Disaster."', 'In 1904, 33 men died here when water came into the pipe.'], [{ t: 'Close', go: () => { hideCard(); if (stage === 61) setStage(62); } }]);
}
ON[65] = () => { unlock('journey', true); unlock('why', true); cue('end'); run([[1.4, () => card('The end', ['In 1904, 33 men died in the Tube at Bog Walk. 28 got out.', 'Nobody could say for sure why the water came. We remember the men.', 'Thank you for playing. Your journey is in the Journal.'], [{ t: 'Read your journey', go: () => { hideCard(); openJournal('journey'); } }, { t: 'Chapters', go: () => { hideCard(); openChapters(); } }, ...(MENU.ok ? [{ t: 'Main Menu', go: toMenu }] : []), { t: 'Stay here', go: hideCard }], { col: true, credit: true })]]); };

/* ---------- movement: keys, touch (left half is a stick, right half looks) and mouse drag to look ---------- */
const solids = T.solids;
function clampTube(x, z) {   /* stay in the lane and out of the buckets and shovels (circles in T.solids), sliding round them */
  for (let pass = 0; pass < 2; pass++) {
    x = Math.max(-LANE, Math.min(LANE, x)); z = Math.max(ZMIN + 3, Math.min(ZMAX - 1.6, z));
    for (const s of solids) { if (!(s.r > 0)) continue; const dx = x - s.x, dz = z - s.z, d = Math.hypot(dx, dz), m = s.r + 0.3; if (d < m) { if (d < 1e-4) x = s.x + m; else { x = s.x + dx / d * m; z = s.z + dz / d * m; } } }
  }
  return [x, z];
}
const stick = { id: null, x0: 0, y0: 0, dx: 0, dy: 0 }, look2 = { id: null, x: 0, y: 0, moved: 0 }, ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
releaseOnBlur(keys, [stick, look2], () => { HOLD.on = false; });
function tapPatch(cx, cy) {   /* a tap (not a drag) on a rust patch scrapes it, if it is near enough */
  if (N.phase !== 'work') return;
  ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(T.patches.filter((p) => p.clean === 0).map((p) => p.rust), false)[0]; if (!hit) return;
  const p = T.patches.find((pp) => pp.rust === hit.object); if (p && p.pos.distanceTo(new THREE.Vector3(S.x, S.eye, S.z)) < 2.6) scrape(p);
}
function tapPerson(cx, cy) {   /* a tap on a person near you talks to them (or looks at them) */
  const P = P_(); if (!P || locked()) return null; ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  for (const n of P.people) if (n.m && n.m.visible && Math.hypot(S.x - n.x, S.z - n.z) < 6 && ray.intersectObject(n.m, true).length > 0) return n; return null;
}
canvas.addEventListener('pointerdown', (e) => {
  if (N.intro) { skipIntro(); return; }
  if (locked() && !RIDE.on) return;
  if (e.pointerType === 'touch' && e.clientX < innerWidth / 2 && stick.id === null && !RIDE.on) { stick.id = e.pointerId; stick.x0 = e.clientX; stick.y0 = e.clientY; stick.dx = stick.dy = 0; const s = $('stick'); s.hidden = false; s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px'; s.firstElementChild.style.transform = ''; }
  else { look2.id = e.pointerId; look2.x = e.clientX; look2.y = e.clientY; look2.moved = 0; }
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerId === stick.id) { stick.dx = Math.max(-1, Math.min(1, (e.clientX - stick.x0) / 50)); stick.dy = Math.max(-1, Math.min(1, (e.clientY - stick.y0) / 50)); $('stick').firstElementChild.style.transform = `translate(${stick.dx * 26}px,${stick.dy * 26}px)`; }
  else if (e.pointerId === look2.id) { const dx = e.clientX - look2.x, dy = e.clientY - look2.y; look2.x = e.clientX; look2.y = e.clientY; look2.moved += Math.abs(dx) + Math.abs(dy); S.yaw -= dx * 0.005; S.pitch = Math.max(-1.2, Math.min(1.3, S.pitch - dy * 0.004)); }
});
const endPointer = (e) => { if (e.pointerId === stick.id) { stick.id = null; stick.dx = stick.dy = 0; $('stick').hidden = true; } if (e.pointerId === look2.id) { if (look2.moved < 8) { if (MODE === 'tube') tapPatch(e.clientX, e.clientY); else { const p = tapPerson(e.clientX, e.clientY); if (p) activate(p); } } look2.id = null; } };
canvas.addEventListener('pointerup', endPointer); canvas.addEventListener('pointercancel', endPointer);

let stepT = 0, walkPh = 0, time = 0;
const FOOT = { station: 'grass', kingston: 'sand', yard: 'grass', ruins: 'grass' };
function moveTick(dt) {
  if (locked() && !RIDE.on) return 0;
  if (keys.has('arrowleft')) S.yaw += 1.8 * dt; if (keys.has('arrowright')) S.yaw -= 1.8 * dt;
  if (RIDE.on) return 0;   /* on the moving car you can look round, but not walk */
  let f = stick.id !== null ? -stick.dy : 0, r = stick.id !== null ? stick.dx : 0;
  if (keys.has('w') || keys.has('arrowup')) f += 1; if (keys.has('s') || keys.has('arrowdown')) f -= 1; if (keys.has('d')) r += 1; if (keys.has('a')) r -= 1;
  const len = Math.hypot(f, r); if (len < 0.05) return 0;
  if (MODE === 'tube' && T.patches.some((p) => p.clean > 0 && p.clean < 1)) return 0;   /* you stand still while you scrape */
  const deep = MODE === 'tube' ? Math.min(1, N.wl / 1.1) : 0, sp = (keys.has('shift') ? 3.4 : 2.2) * Math.min(1, len) * (1 - 0.35 * deep), fx = -Math.sin(S.yaw), fz = -Math.cos(S.yaw), n = Math.max(1, len);
  const nx = S.x + (fx * f - fz * r) / n * sp * dt, nz = S.z + (fz * f + fx * r) / n * sp * dt;
  [S.x, S.z] = MODE === 'tube' ? clampTube(nx, nz) : clampWorld(nx, nz);
  stepT -= dt * sp; if (stepT <= 0) { stepT = 1.25; if (MODE === 'tube') { if (N.wl > 0.05) waterStep(N.wl); else stepSound('sand'); } else stepSound(FOOT[cur] || 'grass'); }
  return sp;
}

/* ---------- sound outside: each place has its own mix ---------- */
let auNext = 0, onceAt = 6;
function audioTick(t) {
  if (!AU.ctx || MODE !== 'world' || t < auNext) return; auNext = t + 0.1; const P = P_(); if (!P) return;
  const night = envNow.stars > 0.5, inHouse = cur === 'station' && S.x > -7 && S.x < 7 && S.z > -15.5 && S.z < -5.5, dHouse = Math.hypot(S.x, S.z + 10.5);
  const power = cur === 'station' ? (P.wheelSpeed ?? 2.6) / 2.6 : 0, hum = power * (inHouse ? 0.12 : Math.max(0, 0.07 - dHouse * 0.002));
  setWorld({ hum, cricket: (cur === 'station' && night ? 0.05 : cur === 'yard' && stage < 52 ? 0.02 : 0), river: cur === 'kingston' ? 0 : Math.max(0.01, 0.06 - Math.abs(S.z + 30) * 0.0015), motor: RIDE.on ? 0.06 : (cur === 'kingston' && frozen ? 0.05 : 0) });
  const L = { station: { wind: 0.05, crowd: 0.0 }, kingston: { crowd: 0.16, wind: 0.03 }, yard: { wind: 0.05, crowd: 0.05 }, ruins: { wind: 0.06 } }[cur] || {};
  for (const k of ['room', 'crowd', 'wind', 'sea', 'surf']) if (AU.ch[k]) setG(AU.ch[k], (L[k] || 0) * 0.5);
  if (t > onceAt) { onceAt = t + 7 + Math.random() * 6; if (AU.on && !night && (cur === 'ruins' || cur === 'yard' || cur === 'kingston')) chirp(); }
}

/* ---------- starting ---------- */
function startGame() {
  if (S.started) return; audioInit(); initTubeSound(); initWorldSound(); $('title').hidden = true; $('hud').hidden = false; S.started = true; unlock('who', true); showCount(); canvas.focus();
}
function begin(skipIntroCards) {   /* the night only (dev views and the night's own checks): start the game straight into the Tube */
  startGame(); enterTube(); resetNight(); stage = 30; showHint(); if (skipIntroCards) startWork(); else startIntro([['Inside the Tube', 'Monday 27 June 1904, about 1 a.m.'], ['The last tram has gone.', 'The water in the pipe is shut off.']], () => startWork(true));
}
let modelsReady = false;
applySave(loadGame());
$('start').onclick = () => { startGame(); cue('begin'); const ch = hasSave ? chapterOf(stage) : 0, st = hasSave && stage >= 10 ? (SAFE[stage] || stage) : undefined; beginChapter(ch, ch === 2 || ch === 3 ? undefined : st); setTimeout(backgroundLoad, 5000); };
model('anims').then((an) => { loadClips(an); return ensurePlace(hasSave ? (CH_PLACE[chapterOf(stage)] === 'tube' ? 'station' : CH_PLACE[chapterOf(stage)]) : 'station'); }).then(() => {
  modelsReady = true; $('start').disabled = false; $('start').textContent = hasSave ? 'Continue' : 'Start'; $('tchap').hidden = false; $('loadnote').textContent = ''; $('savenote').hidden = !hasSave; if (__DEV__) devViews(); });
async function backgroundLoad() { for (const id of ['station', 'kingston', 'yard', 'ruins']) { await ensurePlace(id); await new Promise((r) => setTimeout(r, 400)); } }

/* ---------- the frame loop ---------- */
let last = performance.now(), manual = false, frames = 0, POSTER = false;
function worldTick(dt, ft) {
  const P = P_(); if (!P) return;
  for (const n of P.npcs) npcTick(n, dt);
  near = null; if (S.started && !locked() && !RIDE.on) { let b = 2.6; for (const n of P.people) { const d = Math.hypot(S.x - n.x, S.z - n.z); if (n.m && n.m.visible && d < b) { b = d; near = n; } } for (const a of P.actions) if (a.on() && Math.hypot(S.x - a.x, S.z - a.z) < a.r) near = a; }
  const showAct = !!(near && near.go); if ($('act').hidden === showAct) $('act').hidden = !showAct; if (showAct && $('act').textContent !== near.label) $('act').textContent = near.label;
  for (const n of P.npcs) if (n.m.visible && n.ctl) { n.ctl.mx.update(dt); n.ctl.tick(dt); gripTick(n.m); }
  if ((frames & 1) === 0) for (const m of P.bodies) if (m.visible && !m.userData.noGround) groundFeet(m);
  if (P.tick) P.tick(dt, ft); smoke.tick(dt); holdTick(dt);
}
function tick(dt, clockDt = dt) {
  time += dt; const ft = (__DEV__ && N.phase === 'shot') ? 3.3 : time;
  for (let i = TICKS.length - 1; i >= 0; i--) if (TICKS[i](clockDt)) TICKS.splice(i, 1);
  const sp = (S.started && N.phase !== 'shot') ? moveTick(dt) : 0; walkPh += sp * dt * 3;
  if (MODE === 'tube') {
    if (S.started && N.phase !== 'shot' && N.phase !== 'world') nightTick(dt);
    if (N.phase === 'shot') T.water.set(N.wl);
    T.update(dt, ft, S.z, 1); hand.update(ft, N.torch); T.hemi.intensity = 0.85 + 0.55 * (1 - N.torch);   /* once the torches are out your eyes get used to the dark a little */
  } else { worldTick(dt, ft); audioTick(time); }
  const bob = Math.sin(walkPh * 2.4) * (MODE === 'tube' ? 0.012 : 0.02);
  /* the camera's own acting: a low rumble as the water comes, a slow glance at the floor at the first sign of water, a view that narrows as the dark closes in
     and widens as you reach the sky, and the hand rising a little when the black bars are in. None of it changes where you look: your own turning is added to it. */
  if (N.turn) { N.turn.t += dt; const k = ease(N.turn.t / N.turn.dur); S.yaw = N.turn.from + N.turn.d * k; if (N.turn.t >= N.turn.dur) N.turn = null; }
  if (MODE === 'tube') { if (!$('nudge').hidden) $('nudge').hidden = true; const w = $('way'), on = S.started && ['rise', 'dark'].includes(N.phase), rel = on ? bearingToLight() : 0, behind = Math.abs(rel) > 2.2, show = on && Math.abs(rel) > 0.6 && !N.turn;
    if (w.hidden === show) w.hidden = !show; if (show) { $('waytext').textContent = behind ? 'Turn around' : 'This way'; $('wayarrow').style.transform = behind ? 'rotate(-90deg) scaleX(-1)' : 'rotate(' + (rel > 0 ? 180 : 0) + 'deg)'; } }   /* the cue: a gold arrow and "This way", or "Turn around" when the light is behind you */
  else nudgeTick(time);
  const ph = N.phase; let shake = 0; if (MODE === 'tube' && S.started && ph !== 'shot') shake = (ph === 'rise' ? 0.4 + 0.6 * ease(N.wl) : ph === 'dark' ? 1 : ph === 'out' ? Math.max(0, 1 - N.t / D(1.6)) : 0) * 0.0045;
  if (N.glanceOn) { N.glanceT += dt; N.glance = -0.34 * Math.sin(Math.min(1, N.glanceT / D(3.2)) * PI); if (N.glanceT > D(3.2)) { N.glanceOn = false; N.glance = 0; } }
  if (MODE === 'tube') { const fovT = ph === 'dark' ? 61 : ph === 'out' ? 72 : 68; if (Math.abs(camera.fov - fovT) > 0.01) { camera.fov += (fovT - camera.fov) * Math.min(1, dt * 1.1); camera.updateProjectionMatrix(); }
    const liftT = N.cine ? N.liftNeed : 0; if (Math.abs(N.lift - liftT) > 0.002) { N.lift += (liftT - N.lift) * Math.min(1, dt * 3); hand.setLift(N.lift); }
    { const csT = N.cine ? 1 : 0; if (Math.abs(hand.cs - csT) > 0.002) hand.setCine(hand.cs + (csT - hand.cs) * Math.min(1, dt * 3)); } }   /* the torch shrinks a little while the bars are in */
  else { const fov = camera.aspect < 0.8 ? 76 : 66; if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); } }
  if (!S.started && !RIDE.on && P_() && P_().titleView) { const tv = P_().titleView; camera.position.set(tv.x - Math.sin(ft * 0.08) * 2, tv.y, tv.z); camera.rotation.set(tv.pitch, tv.yaw + Math.sin(ft * 0.05) * 0.04, 0, 'YXZ'); }
  else { camera.position.set(S.x + Math.sin(ft * 43) * shake, S.eye + bob + Math.sin(ft * 57 + 1) * shake * 0.7, S.z); camera.rotation.set(S.pitch + N.glance, S.yaw, Math.sin(ft * 31) * shake * 1.6, 'YXZ'); }
  if (MODE === 'tube') { const nearP = !locked() && !!nearPatch(); if (N.phase !== 'shot') { if ($('act').hidden === nearP) $('act').hidden = !nearP; if (nearP && $('act').textContent !== 'Scrape') $('act').textContent = 'Scrape'; } }   /* test views and checks set the Scrape button themselves */
  else { sun.target.position.set(camera.position.x, 0, camera.position.z); sun.position.copy(sun.target.position).addScaledVector(sunDir, 110); for (const o of [sky.dome, sky.stars, sky.clouds]) o.position.copy(camera.position); sky.moon.position.set(camera.position.x - 190, camera.position.y + 230, camera.position.z - 380); bubbleTick(time); }
}
/* people outside the view are not drawn: their meshes are hidden (not the group, which the game logic reads) until they are back in the frustum. A body is about 10k triangles and
   several draw calls, so with 30 people in a place this is the biggest saving on a phone. Off in the automatic checks, which read the real visibility. */
const _fr = new THREE.Frustum(), _pm = new THREE.Matrix4(), _sp = new THREE.Sphere(), _sv = new THREE.Vector3(), NOCULL = __DEV__ && !!q.get('test');
function cullBodies() {
  const P = P_(); if (!P || NOCULL || SHADOWS) return;   /* with shadows (desktop) a hidden body would lose its shadow too, so only phones, which draw none, cull */
  camera.updateMatrixWorld(); _pm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); _fr.setFromProjectionMatrix(_pm);
  for (const n of P.npcs) { const m = n.m; if (!m.visible) continue; if (!m.userData.cullList) { const l = []; m.traverse((o) => { if (o.isMesh && o.visible) l.push(o); }); m.userData.cullList = l; m.userData.inView = true; }
    const on = _fr.intersectsSphere(_sp.set(_sv.set(m.position.x, m.position.y + 0.9, m.position.z), 1.7)); if (m.userData.inView !== on) { m.userData.inView = on; for (const o of m.userData.cullList) o.visible = on; } }
}
function render() { hand.setPanelOpen(!$('pick').hidden); cullBodies(); renderer.render(scene, camera); }
function frame(t) { if (!manual) requestAnimationFrame(frame); const elapsed = Math.max(0, (t - last) / 1000), dt = Math.min(0.05, elapsed); last = t;
  // Keep walking and water simulation bounded, but do not stretch chapter fades
  // on slower phones. Bound long pauses too, so returning to a tab stays gentle.
  tick(dt, Math.min(0.25, elapsed)); render(); document.body.dataset.frames = ++frames; }
requestAnimationFrame(frame);
if (__DEV__) window.__dbg = { S, N, PL, get cur() { return cur; }, get stage() { return stage; } };

/* ---------- test views, the automatic checks and the scripted playthrough: dev builds only (node tools/build.mjs bog-walk --dev) ---------- */
function devViews() { if (__DEV__) import('./dev.js').then((m) => m.dev(DEV)); }
const DEV = __DEV__ ? { THREE, q, $, S, N, T, PL, hand, keys, camera, scene, renderer, CL, story, ctr, unlocked, doneCh, JOURNAL, CHAPTERS, REPORT, WHY, AFTER, JOURNEY, TALK_TARGETS, BUILD, DONE, SAFE, CH_PLACE,
  get cur() { return cur; }, get stage() { return stage; }, set stage(v) { stage = v; }, get MODE() { return MODE; }, get near() { return near; }, get frozen() { return frozen; }, get fading() { return fading; }, get envNow() { return envNow; }, set manual(v) { manual = v; }, set poster(v) { POSTER = v; }, RIDE, HOLD, TB,
  tick, render, begin, startGame, startWork, startIntro, skipIntro, startRise, startDark, startTrickle, startBoots, skipNight, setPhase, resetNight, setGoal, setClock, say, toast, bars, hideHud, caption, captionOff, fadeTo, calcLift, nearPatch, act, showEnd, showPick,
  ensurePlace, enterPlace, enterTube, showNudgeAt, placeNudge, NUDGE, beginChapter, setStage, setEnv, showPerson, byId, startTalk, convo, leaveTalk, activate, look, openOrder, openSort, closePuzzle, card, hideCard, openJournal, closeJournal, openChapters, closeChapters, openCredits, closeChapters2: closeChapters, closeCredits, unlock, saveGame, loadGame, applySave, panelsOpen, locked,
  auditPlace, auditHeld, auditSeated, snapMeshes, groundFeet, LANE, ZM, ZMIN, ZMAX, R, SAND, ENV, audioState: () => (AU.ctx ? AU.ctx.state : 'none'), wantsTalk, get modelsReady() { return modelsReady; }, ON, noticeTex } : null;
