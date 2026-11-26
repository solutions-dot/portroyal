import { offerNextChapter } from '../../../engine/chapter-end.js';
import { addRecap } from '../../../engine/recap.js';   /* three things you learned, on the last card */
import '../../../engine/textfit.js';   // first: every sign's words fit their board (engine/textfit.js)
import { renderFramed } from '../../../engine/cine.js';   /* camera scenes framed for a phone held upright (engine/cine.js) */
import { releaseOnBlur, useInteractionKey } from '../../../engine/input.js';
import { hudTidy } from '../../../engine/hud.js';
import { createTalkCam, speakerHead } from '../../../engine/talk-cam.js';   /* the view turns to the person talking */
const TC = createTalkCam();
/* games/tivoli/src/main.js: Tivoli (West Kingston, from the 1960s to today, with May 2010 at the centre). Read docs/games/tivoli.md first.
   Started from games/_template/. It is on the menu (the owner's choice, 14 November 2026) while it is still being made.
   Story: seven walking chapters and chapter 5 (the May 2010 street scene) are playable; see content.js, story.js, ch1.js, fight.js. The controls, the HUD, the talk marks
   and the helper arrow are the same as the other games' (17 November 2026, docs/games/tivoli.md). Test views are dev only.
   RULE for every game (CLAUDE.md rule 8): before the first PR, wire the automatic audits from engine/audit.js (floating objects, people in solids,
   unreachable spots, held items, overlapping people) and a layout test into the dev build, and fix everything they report.
   See docs/TESTING.md section 5 and games/kendal/src/main.js ("the place audit"). */
import * as THREE from 'three';
import { CL, mixers, loadClips, animate, groundFeet } from '../../../engine/anim.js';
import { soundPref, setSound, audioInit, stepSound, uiSound, AU, cue, chirp, mixBeds, bedTest, carFar, dogFar, radioFar } from '../../../engine/audio.js';
import { model, onLoadFail } from '../../../engine/loader.js';
import { pose, standIns, POSES, deriveClips } from './clips.js';
import { LOOKS, BODIES, loadBase, makeBody, bodyOf } from './cast.js';
import { faceCheck } from '../../../engine/faces.js';   // dev only: look-alikes (two people with one face side by side)
import { arm, weaponTick, heldReport, ARMED, modeOf } from './weapons.js';
import { snapMeshes, auditPlace, auditGarments } from '../../../engine/audit.js';   // dev only: the place audit (CLAUDE.md rule 8)
import { contentRects, contentsOverlap } from '../../../engine/ui-audit.js';   // dev only: the layout test
import { buildBackOWall } from './backowall.js';
import { buildNewTivoli } from './newtivoli.js';
import { buildStreet, streetPlace } from './street.js';
import { Talk, setupTalk, tapNpc, updateTalk, after as talkAfter, start as talkStart, next as talkNext, leave as talkLeave } from './talk.js';
import { initStory, nextChapter, unlock as unlockPage, hasSave, saveProgress, openChapters, closeChapters, openJournal, closeJournal, closeCredits, panelOpen, eraseAll, flushToasts, saveData, loadData, isUnlocked } from './story.js';
import { CHAPTERS, JOURNAL } from './content.js';
import { headTop, markAt, NEAR_GAP, showTalkMark, showTalkBubble } from '../../../engine/marks.js';
import { walkRoute } from '../../../engine/placement.js';
import { hideIntro, WALKS, CH, setupCh1, begin as ch1Begin, leaveChapter as ch1Leave, tick as ch1Tick, onTalked as ch1Talked, devSkip as ch1Skip, lifeTick, guideTarget, talkedNow, orderNow, storyNeeds } from './ch1.js';
import { createGuide } from '../../../engine/guide.js';   /* the gold arrow on the ground that shows the way (every game) */
import { lifeTest, lifeBodies, LIFE } from './life.js';   // dev only: ?test=ambient (LIFE: whose bodies the next chapter needs)
import { FIGHT, CONTACT, positions as fightPositions, routes as fightRoutes, wire as wireFight, openCard as fightOpen, tick as fightTick, after as fightAfter, skip as fightSkip, begin as fightBegin } from './fight.js';   // the May 2010 street scene
import { clipInfo, sceneCheck } from './scenecheck.js';
import { strideOf, pace as gamePace, WALKS as WALK_CLIPS } from './walk.js';   // dev only: the street scene checks (?test=scene, ?test=clipinfo)
import { auditCloth, auditWalk, skinProbe, overlapSolids, sinkCheck, CLOTH_SKIP } from './checks.js';
import { checkAll, CHECKS } from '../../../engine/checks.js';   // dev only: ?test=all
import { CHECK_TABLES, makeAdapter } from './checktables.js';   // dev only: Tivoli's hooks for ?test=all
import { headCheck } from './headcheck.js';   // dev only: ?test=heads   // dev only: the shared cloth, walk and skin checks (re-exported) and Tivoli's place checks
import { tunePixels } from '../../../engine/perf.js';
import { setQuiet, ahead, work } from '../../../engine/preload.js';
import { touchFirst, liveHint } from '../../../engine/device.js';
import { addExit } from '../../../engine/exit.js';

const $ = (id) => document.getElementById(id);
soundPref('tivoli-sound');   // each game remembers its own sound setting
onLoadFail((name) => { $('loadnote').textContent = 'Could not load ' + name + '. Please reload the page.'; });

/* ---------- renderer, camera, light ---------- */
const canvas = $('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
tunePixels(renderer);   /* pixel cap and slow-frame drop (engine/perf.js) */ renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0xbcd6e0); scene.fog = new THREE.Fog(0xbcd6e0, 30, 90);
const camera = new THREE.PerspectiveCamera(68, 1, 0.1, 500);
scene.add(new THREE.HemisphereLight(0xeaf4ff, 0x8a7a5a, 1.6));
const sun = new THREE.DirectionalLight(0xfff2dc, 2.2); sun.position.set(20, 30, 10); scene.add(sun);
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

/* ---------- the dev backdrop: ground and a few boxes, so test views have a world (public builds start on the title screen over a plain colour) ---------- */
scene.background = new THREE.Color(0x10222b); scene.fog = null;
const WALLS = [];   // [x0, z0, x1, z1] boxes the player cannot enter; each chapter fills it with its own place's walls
/* ---------- the world: ground and a few buildings (each building is also a wall you cannot walk through) ---------- */
let ground; if (__DEV__) { ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0xd8c8a0, roughness: 1 }));
ground.rotation.x = -Math.PI / 2; scene.add(ground); scene.background = new THREE.Color(0xbcd6e0); scene.fog = new THREE.Fog(0xbcd6e0, 30, 90); }
function building(x, z, w, d, h, color) {
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: 0.9 })); b.position.set(x, h / 2, z); scene.add(b);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.75, 1.6, 4), new THREE.MeshStandardMaterial({ color: 0x8a4a32 })); roof.position.set(x, h + 0.8, z); roof.rotation.y = Math.PI / 4; roof.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d)); scene.add(roof);
  WALLS.push([x - w / 2 - 0.3, z - d / 2 - 0.3, x + w / 2 + 0.3, z + d / 2 + 0.3]);
}
if (__DEV__) { building(-6, -8, 5, 4, 4, 0xb86a4a); building(1, -8, 5, 4, 5, 0xe0d4b8); building(8, -8, 5, 4, 4, 0x9a6a4a); building(-6, 8, 5, 4, 4, 0xe0d4b8); building(6, 8, 6, 4, 4.5, 0xb86a4a); }

/* ---------- player state and movement: the same controls as every game (Kendal, Nanny Town, Windrush...) ----------
   Keyboard: W A S D or the arrow keys walk (left and right arrows turn), Shift hurries, Space, Enter or E talks, Escape closes.
   Touch: the left half of the screen is a joystick (a faint ring shows where it is), the right half drags to look, a tap on a person talks.
   Mouse: drag to look, click a person to talk. (Until 17 November 2026 Tivoli had its own four-arrow pad instead of the joystick.) */
const state = { x: 0, z: 4, yaw: 0, pitch: 0, started: false };   // yaw 0 looks toward -z
const isTouch = touchFirst();   /* engine/device.js: also an iPad in desktop mode and touch tablets */
const keys = new Set(); let busy = false;   // busy: a talk, a card or a panel is open, so do not move
addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase(); if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k) && state.started) e.preventDefault();
  keys.add(k);
  if (k === 'escape') { if (!$('dialogue').hidden) { talkLeave(); return; } closeJournal(); closeChapters(); closeCredits(); if (!$('chcard').hidden && CARD.dismiss) CARD.dismiss(); return; }
  if (!state.started) return;
  useInteractionKey(e, () => { if (!$('dialogue').hidden) { talkNext(); return; } if (CH.on && !busy && Talk.near) { talkStart(Talk.near); return; } return false; });
});
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
function clampPos(x, z) {   // keep inside the place's bounds (as Kendal) and out of buildings (slide along walls); ?test=all's map check found gaps out of chapters 1 and 4
  const b = CH.on && CH.place && CH.place.bounds; if (b) { x = Math.max(b.x0 + 0.3, Math.min(b.x1 - 0.3, x)); z = Math.max(b.z0 + 0.3, Math.min(b.z1 - 0.3, z)); } else { x = Math.max(-35, Math.min(35, x)); z = Math.max(-35, Math.min(35, z)); }
  for (const [x0, z0, x1, z1] of WALLS) if (x > x0 && x < x1 && z > z0 && z < z1) { const dl = x - x0, dr = x1 - x, dt = z - z0, db = z1 - z, m = Math.min(dl, dr, dt, db); if (m === dl) x = x0; else if (m === dr) x = x1; else if (m === dt) z = z0; else z = z1; }
  return [x, z];
}
const stick = { id: null, x0: 0, y0: 0, dx: 0, dy: 0 }, look = { id: null, x: 0, y: 0, moved: 0 };
releaseOnBlur(keys, [stick, look]);
canvas.addEventListener('pointerdown', (e) => {
  if (busy || FIGHT.on) return;
  if (e.pointerType === 'touch' && e.clientX < innerWidth / 2 && stick.id === null) { stick.id = e.pointerId; stick.x0 = e.clientX; stick.y0 = e.clientY; stick.dx = stick.dy = 0; }
  else { look.id = e.pointerId; look.x = e.clientX; look.y = e.clientY; look.moved = 0; }
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerId === stick.id) { stick.dx = Math.max(-1, Math.min(1, (e.clientX - stick.x0) / 50)); stick.dy = Math.max(-1, Math.min(1, (e.clientY - stick.y0) / 50)); }
  else if (e.pointerId === look.id) { const dx = e.clientX - look.x, dy = e.clientY - look.y; look.x = e.clientX; look.y = e.clientY; look.moved += Math.abs(dx) + Math.abs(dy); if (look.moved > 8) TC.cancel(); state.yaw -= dx * 0.005; state.pitch = Math.max(-1.2, Math.min(1.2, state.pitch - dy * 0.004)); }
});
const endPointer = (e) => {
  if (e.pointerId === stick.id) { stick.id = null; stick.dx = stick.dy = 0; }
  if (e.pointerId === look.id) { if (look.moved < 8 && CH.on && !busy) { const n = state.started && !Talk.open ? tapNpc(e.clientX, e.clientY, state, topOf) : null; if (n) talkStart(n); } look.id = null; }   // a tap (not a drag) on a person starts a talk
};
canvas.addEventListener('pointerup', endPointer); canvas.addEventListener('pointercancel', endPointer);
function stickUI() {   /* the joystick ring: faint where your thumb rests, under your thumb while you walk */
  const el = $('stick'); if (!isTouch || !state.started || busy || FIGHT.on || !CH.on) { el.hidden = true; return; }
  el.hidden = false; const rest = stick.id === null; el.classList.toggle('rest', rest); el.style.left = (rest ? 84 : stick.x0) + 'px'; el.style.top = (rest ? innerHeight - 150 : stick.y0) + 'px'; $('nub').style.transform = `translate(calc(-50% + ${stick.dx * 30}px), calc(-50% + ${stick.dy * 30}px))`;
}

/* ---------- goal, controls tip, sound, cards ---------- */
function setGoal(t) { const el = $('goal'); if (t && t !== el.textContent && state.started) uiSound('goal'); el.textContent = t || ''; }
let hintTimer = 0;
function showHint() { $('hint').hidden = false; clearTimeout(hintTimer); hintTimer = setTimeout(() => { $('hint').hidden = true; }, 6000); }
$('goal').onclick = () => showHint();
function showSound() { const b = $('snd'); b.setAttribute('aria-pressed', AU.on ? 'true' : 'false'); b.setAttribute('aria-label', AU.on ? 'Sound on. Tap to turn off.' : 'Sound off. Tap to turn on.'); $('sndon').style.display = AU.on ? '' : 'none'; $('sndoff').style.display = AU.on ? 'none' : ''; }
$('snd').onclick = () => { setSound(!AU.on); showSound(); }; showSound();
const setBusy = (b) => { busy = !!b || panelOpen() || !$('chcard').hidden || !$('dialogue').hidden; if (busy) keys.clear(); };
/* a card over the whole screen (the end of a chapter, the reset choices), with a row of buttons; the first is the main one */
const CARD = { dismiss: null }, MENU_URL = '../../../menu/';
function card(title, paras, btns, { dismiss } = {}) {
  $('chcardt').textContent = title; $('chcardl').replaceChildren(...paras.map((t) => { const p = document.createElement('p'); p.textContent = t; return p; }));
  $('chcardb').replaceChildren(...btns.map((x, i) => { const el = document.createElement(x.href ? 'a' : 'button'); el.className = 'btn' + (i ? ' ghost' : ''); el.textContent = x.t; if (x.href) { el.href = x.href; el.style.textDecoration = 'none'; el.style.display = 'inline-flex'; el.style.alignItems = 'center'; } else el.onclick = x.go; return el; }));
  CARD.dismiss = dismiss || null; $('chcard').hidden = false; setBusy(true); const f = $('chcardb').querySelector('button,a'); if (f) f.focus();
}
function hideCard() { $('chcard').hidden = true; CARD.dismiss = null; setBusy(false); }
function chapterEnd(id, end) {   /* the end of a walking chapter: what happened, then Next chapter (as in every game), after a short pause on a clear screen and with no "Stay here" (engine/chapter-end.js) */
  const nx = CHAPTERS.find((c) => c.id === id + 1 && c.playable); if (!nx) cue('end');   /* the last chapter: the closing phrase */
  offerNextChapter({ clear: () => !panelOpen() && $('chcard').hidden && $('dialogue').hidden, show: () => card(end.title, end.lines, nx ? [{ t: 'Next chapter', go: () => { hideCard(); startChapter(nx.id); } }, { t: 'Chapters', go: () => { hideCard(); openChapters(); } }]
    : [{ t: 'Chapters', go: () => { hideCard(); openChapters(); } }, { t: 'Exit', href: MENU_URL }]) });
}
$('reset').onclick = () => {
  if (FIGHT.on || !CH.on) return; closeJournal(); const C = CHAPTERS.find((c) => c.id === CH.id);
  card('Reset', ['Start this chapter again, or start the whole story again.'], [{ t: 'Restart “' + C.name + '”', go: () => { hideCard(); startChapter(CH.id, { talked: [] }); } },
    { t: 'Start the whole story again', go: () => card('Start again?', ['This wipes everything, even your journal.'], [{ t: 'Yes, start again', go: eraseAll }, { t: 'No, keep playing', go: hideCard }], { dismiss: hideCard }) },
    { t: 'Cancel', go: hideCard }], { dismiss: hideCard });
};

/* ---------- a glowing speech mark over each person you can talk to, and a talk bubble over the nearest (as in Kendal) ---------- */
const BUBBLE = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 8, 64, 64, 62); g.addColorStop(0, 'rgba(255,190,70,0.9)'); g.addColorStop(0.35, 'rgba(255,180,60,0.45)'); g.addColorStop(1, 'rgba(255,170,50,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); x.fillStyle = '#f6c45c'; x.strokeStyle = 'rgba(70,45,10,0.85)'; x.lineWidth = 3; x.beginPath(); x.arc(64, 64, 15, 0, Math.PI * 2); x.fill(); x.stroke(); x.fillStyle = '#fff3d0'; x.beginPath(); x.arc(59, 59, 5, 0, Math.PI * 2); x.fill(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
const TALK_SVG = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12c0 4-4 7-9 7-1.2 0-2.4-.2-3.4-.5L3 20l1.5-4.2C3.6 14.7 3 13.4 3 12c0-4 4-7 9-7s9 3 9 7z"/><circle cx="8" cy="12" r=".6" fill="currentColor"/><circle cx="12" cy="12" r=".6" fill="currentColor"/><circle cx="16" cy="12" r=".6" fill="currentColor"/></svg>';
const TB = { el: null, v: new THREE.Vector3() };
const POSTER = __DEV__ && /[?&]shot=poster/.test(location.search);   /* the menu picture is taken with no marks */
/* the top of the head: engine/marks.js headTop when it finds the head bone; it looks for a name ending ":Head" or "_Head", and three.js loads these
   bodies' bone as "mixamorigHead", so it finds none and the old fallback (1.75 m) floated the mark a metre over Ivy as a girl. Then the Head bone's
   own height plus 24 cm (scaled with the body), measured on these bodies with their hair. */
const HEADS = new WeakMap();
const topOf = (n) => { const y = headTop(n.body); if (y !== null) return y; let h = HEADS.get(n.body); if (h === undefined) { h = n.body.getObjectByName('mixamorigHead') || null; HEADS.set(n.body, h); } if (!h) return (n.body.userData.ground || 0) + 1.75 * n.body.scale.y; h.getWorldPosition(TB.v); return TB.v.y + 0.24 * n.body.scale.y; };
function bubbleTick(now) {
  const show = CH.on && state.started && !busy && !FIGHT.on && $('chcard').hidden && !POSTER;
  for (const n of Talk.npcs) {
    if (!n.mark) { n.mark = new THREE.Sprite(new THREE.SpriteMaterial({ map: BUBBLE, transparent: true, depthWrite: false, depthTest: true, fog: false })); n.mark.renderOrder = 5; n.mark.visible = false; scene.add(n.mark); }
    const m = n.mark; if (!show || !n.body.visible) { m.visible = false; continue; }
    const d = Math.hypot(state.x - n.x, state.z - n.z), k = (0.4 + d * 0.035) * (1 + Math.sin(now * 2 + n.x) * 0.1);
    m.position.set(n.x, markAt(topOf(n), k) + Math.sin(now * 2.4 + n.x) * 0.03, n.z); m.scale.set(k, k, k); m.material.opacity = Math.max(0.6, 1 - d / 20); m.visible = showTalkMark(storyNeeds(n.id), Talk.near === n) && d < 40;
  }
  if (!TB.el) { TB.el = document.createElement('button'); TB.el.className = 'tbub'; TB.el.hidden = true; document.body.appendChild(TB.el); TB.el.addEventListener('click', (e) => { e.stopPropagation(); if (Talk.near && !busy) talkStart(Talk.near); }); }
  const on = show && Talk.near && !Talk.open && showTalkBubble(storyNeeds(Talk.near.id)); TB.el.hidden = !on; if (!on) return;
  TB.v.set(Talk.near.x, topOf(Talk.near) + NEAR_GAP, Talk.near.z).project(camera); if (TB.v.z > 1) { TB.el.hidden = true; return; }
  const r = canvas.getBoundingClientRect(); TB.el.style.left = (r.left + (TB.v.x + 1) / 2 * r.width) + 'px'; TB.el.style.top = (r.top + (1 - TB.v.y) / 2 * r.height) + 'px';
  if (TB.el.dataset.label !== Talk.near.name) { TB.el.dataset.label = Talk.near.name; TB.el.innerHTML = TALK_SVG + '<span class="who">' + Talk.near.name + '</span>'; TB.el.setAttribute('aria-label', 'Talk to ' + Talk.near.name); }
}

/* ---------- loading ---------- */
let modelsReady = false;
Promise.all(['anims', 'anims_tivoli'].map((name) => model(name).then((asset) => { const bar = $('bar'); bar.dataset.done = +(bar.dataset.done || 0) + 1; bar.style.width = (+bar.dataset.done / 2 * 100) + '%'; return asset; }))).then(([anims, own]) => {
  loadClips(anims); loadClips(own); deriveClips();   // the shared library, then Tivoli's own clips (tools/tivoli/pack_clips.mjs)
  modelsReady = true; $('start').disabled = false; $('chbtn').disabled = false; $('start').textContent = hasSave() ? 'Continue' : 'Start'; $('savenote').hidden = !hasSave(); $('loadnote').textContent = '';
  if (__DEV__) devViews();
});

const uiS = (k) => uiSound(k);
function startChapter(id, opts) { closeChapters(); closeJournal(); if ($('chcard').hidden === false) hideCard(); if (!FIGHT.on) for (const c of ['fightcard', 'readcard', 'aftercard']) $(c).hidden = true;   /* a walking chapter never opens under a card of the street scene */
  prepare(id + 1);
  if ([1, 2, 3, 4, 6, 7, 8].includes(id)) return ch1Begin(id, opts); if (id === 5) { ch1Leave(); saveProgress(5, []); fightOpen(); } return Promise.resolve(); }
/* engine/preload.js: as a chapter starts, the next chapter's bodies are downloaded (ahead) and unpacked while the player reads (work, with the cached loadBase),
   so its loading card is shorter. What is known before its place is built: the background people's bodies (life.js LIFE; engine/faces.js may give some
   a second face, loaded then as now), the story people whose id names their look (all but Ivy and Gran Ivy), and chapter 5's street cast (fight.js load). */
function prepare(id) {
  if (!CHAPTERS.some((c) => c.id === id && c.playable)) return;
  const names = id === 5 ? [...BODIES, 'civilian2010'].flatMap((b) => [b, b + '_lo'])
    : [...(LIFE[id] ? LIFE[id].people.map((d) => d.look.base) : []), ...(WALKS[id] ? WALKS[id].order.filter((k) => LOOKS[k]).map((k) => bodyOf(LOOKS[k])) : [])];
  const todo = [...new Set(names)]; ahead(todo); for (const n of todo) work(() => loadBase(n).catch(() => {}));
}
/* the player is reading, not moving, while a panel, a card, a conversation, the title or a loading card is on screen */
setQuiet(() => panelOpen() || ['chcard', 'dialogue', 'title', 'fightcard', 'readcard', 'aftercard', 'fightload'].some((id) => !$(id).hidden));
$('start').onclick = () => { audioInit(); cue('begin'); startChapter(nextChapter()); };
/* ---------- sound in the walking chapters (22 November 2026: they were silent; only the street scene had beds, fight.js and sfx.js).
   Each chapter's street life: people about, the wind, birds, a dog far off, a radio or a car down the road. Kept low and plain; quieter on
   Sunday 23 May 2010 (chapter 4, waiting) and in the days after (chapter 6: no radio, no traffic, only birds and the wind). The street scene
   keeps its own sound (fight.js turns these beds over to SFX.ambience while FIGHT.on). */
const pick = (...f) => () => f[(Math.random() * f.length) | 0]();
const SOUNDSCAPE = {
  1: { crowd: 0.1, wind: 0.06, once: pick(chirp, chirp, dogFar) },   /* Back-o-Wall, before the 1960s */
  2: { crowd: 0.12, wind: 0.05, traffic: 0.04, once: pick(chirp, chirp, dogFar, radioFar) },   /* the new Tivoli, 1960s */
  3: { crowd: 0.13, wind: 0.04, traffic: 0.07, once: pick(chirp, radioFar, carFar, dogFar) },   /* 1970s to 2009 */
  4: { wind: 0.07, crowd: 0.04, traffic: 0.02, once: pick(chirp, dogFar) },   /* Sunday 23 May 2010: barricades at the entrances, the street waits; a few cars still pass (street.js addTraffic) */
  6: { wind: 0.06, crowd: 0.03, once: chirp },   /* after: quiet */
  7: { crowd: 0.08, wind: 0.04, traffic: 0.06, once: pick(chirp, carFar) },   /* 2016 to 2017 */
  8: { crowd: 0.14, wind: 0.04, traffic: 0.08, once: pick(chirp, radioFar, carFar, dogFar) },   /* today */
};
if (__DEV__ && new URLSearchParams(location.search).get('test') === 'beds') bedTest(SOUNDSCAPE);   /* ?test=beds : each chapter's bed levels against the shared range (engine/audio.js) */
let auNext = 0, onceAt = 6;
function audioTick(t) {
  if (!AU.ctx || FIGHT.on || t < auNext) return; auNext = t + 0.1; const S = (CH.on && state.started && SOUNDSCAPE[CH.id]) || {};
  mixBeds(S, { duck: !!Talk.open });
  if (t > onceAt) { onceAt = t + 7 + Math.random() * 7; if (S.once && AU.on && !Talk.open) S.once(); }
}
const FOOT = { 1: 'sand' };   /* Back-o-Wall's lanes are earth; everywhere else is paving */
const talkEnv = { scene, camera, uiSound: uiS, setBusy, onUnlock: (id) => unlockPage(id), onTalked: (n) => ch1Talked(n), onClose: () => flushToasts() };
setupTalk(talkEnv);
setupCh1({ scene, state, WALLS, renderer, audioInit, focusGame: () => canvas.focus(), setBusy, setGoal, uiSound: uiS, chapterEnd, onStart: () => { liveHint($('hint'), 'Left thumb walks. Drag to look. Tap a person to talk.', 'W A S D to walk, Shift to hurry. Drag to look. Space or Enter to talk.');   /* touch or key words, following what the player uses (engine/device.js) */ showHint(); canvas.focus(); } });
initStory({ startChapter, uiSound: uiS, setBusy });
prepare(nextChapter());   /* the chapter Start opens: its bodies unpack behind the title */
wireFight({ scene, camera, renderer, audioInit, next: () => startChapter(6) });
const SEEN = { fightcard: false };   /* dev only: the autoplayer and ?test=all ask whether the opt-in card was answered before the street scene */
$('fbegin').addEventListener('click', () => { SEEN.fightcard = true; });

/* ---------- dev only: the scripted playthrough, the stepped clock and the hooks for ?test=all, ?test=heads and ?test=resume ---------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const waitFor = async (fn, ms = 60000) => { const t0 = performance.now(); while (!fn()) { if (performance.now() - t0 > ms) return false; await sleep(50); } return true; };
let stepNow = 0;
function stepClock(dt) { STEPPED.on = true; stepNow += dt * 1000; update(dt, stepNow); place(stepNow); }
/* the step you are on: N*10 + how many of chapter N's people you have talked to; 50 for the street scene and its cards */
function stepNow_() { if (FIGHT.on || !$('fightcard').hidden || !$('readcard').hidden || !$('aftercard').hidden || !$('fightload').hidden) return 50; if (CH.on) return CH.id * 10 + Math.min(3, talkedNow().length); return null; }
const WALK_IDS = [1, 2, 3, 4, 6, 7, 8];
async function beginStep(s) {   /* start the chapter of step s with the first k people already talked to */
  const ch = Math.floor(s / 10), k = s % 10; if (FIGHT.on) fightFinish();
  if (ch === 5) { await startChapter(5); return; }
  await startChapter(ch, { talked: WALKS[ch].order.slice(0, k) });
}
function fightFinish() { if (!$('aftercard').hidden || FIGHT.on) { const b = $('fdone'); if (FIGHT.on) { FIGHT.ended = true; } b.click(); } for (const id of ['fightcard', 'readcard', 'aftercard', 'fightload']) $(id).hidden = true; }
/* ?auto=N (&one): play from chapter N to the end, as a player would: talk to each person through every line, walk to the end spot, press Next chapter;
   in chapter 5 answer the opt-in card with Begin and watch the street scene to its after card. Logs each change; says STALL if nothing changes for 30 s. */
async function autoPlay(N = 1, one = false, L = () => {}) {
  await waitFor(() => modelsReady); audioInit(); let lastKey = '', lastT = performance.now(); const finished = [];
  await startChapter(N); L('start ch' + N);
  for (;;) {
    await sleep(120); const now = performance.now(), st = stepNow_();
    const key = st + '|' + ($('chcard').hidden ? '' : $('chcardt').textContent) + '|' + ($('dialogue').hidden ? '' : $('line').textContent) + '|' + (FIGHT.on ? Math.floor(FIGHT.T / 5) : '') + ['fightcard', 'readcard', 'aftercard'].map((i) => +!$(i).hidden).join('');
    if (key !== lastKey) { lastKey = key; lastT = now; L('step ' + st + ($('chcard').hidden ? '' : ' card="' + $('chcardt').textContent + '"') + ' goal="' + $('goal').textContent + '"' + (FIGHT.on ? ' scene ' + FIGHT.T.toFixed(0) + ' s' : '')); }
    if (now - lastT > 30000) { L('STALL at step ' + st); return { ok: false, why: 'stalled at step ' + st }; }
    if (!$('aftercard').hidden) { finished.push(5); L('chapter 5 DONE'); if (one) { L('ALLDONE'); return { ok: true }; } $('fnext').click(); await waitFor(() => CH.on && CH.id === 6); continue; }
    if (!$('fightcard').hidden) { $('fbegin').click(); continue; }
    if (FIGHT.on) { if (!FIGHT.ended) fightSkip(FIGHT.T + 4); continue; }
    if (!$('chcard').hidden && CH.ended) { const id = CH.id; finished.push(id); L('chapter ' + id + ' DONE'); if (one || id === 8) { L('ALLDONE'); return { ok: true }; } const b = [...$('chcardb').children].find((x) => x.textContent === 'Next chapter'); if (!b) return { ok: false, why: 'no Next chapter button after chapter ' + id }; b.click(); await waitFor(() => (CH.on && CH.id === id + 1) || !$('fightcard').hidden); continue; }
    if (!$('dialogue').hidden) { talkNext(); continue; }
    if (!CH.on || busy || CH.ended) continue;
    const id = orderNow().find((k) => !CH.talked[k]);
    if (id) { const n = Talk.npcs.find((x) => x.id === id); state.x = n.x + 1.1; state.z = n.z + 0.4; [state.x, state.z] = clampPos(state.x, state.z); update(0.016); talkStart(n); continue; }
    const e = CH.place.endSpot; state.x = e.x; state.z = e.z; update(0.016);
  }
}
/* the hooks checktables.js reads the game through (?test=all) */
function checkHooks() {
  const closeAll = () => { hideCard(); talkLeave(); closeJournal(); closeChapters(); closeCredits(); setBusy(false); };
  const settle = async () => { await waitFor(() => $('fightload').hidden); for (let i = 0; i < 20 && (!$('chcard').hidden || !$('dialogue').hidden); i++) { hideCard(); talkLeave(); await sleep(40); } setBusy(false); for (let i = 0; i < 4; i++) stepClock(1 / 30); };
  const npcs = () => Talk.npcs.map((n) => ({ id: n.id, name: n.name, base: LOOKS[n.look].base, tint: LOOKS[n.look].tint, n }));
  return {
    ready: async () => { await waitFor(() => modelsReady); audioInit(); },
    settle, closeAll, renderer, scene, camera,
    begin: beginStep,
    open: (id) => startChapter(id),
    chapter: () => (FIGHT.on || stepNow_() === 50 ? 5 : CH.on ? CH.id : null),
    step: stepNow_,
    steps: () => WALK_IDS.flatMap((c) => [0, 1, 2, 3].map((k) => c * 10 + k)),
    npcs,
    place: () => CH.place, bounds: { x0: -23, x1: 17.5, z0: -13.6, z1: 14.2 },
    target: () => { const t = guideTarget(); if (!t) return null; const id = orderNow().find((k) => !CH.talked[k]); return { id: id || 'end spot', x: t[0], z: t[1], r: id ? 2.3 : CH.place.endSpot.r }; },
    unlocks: () => JOURNAL.filter((p) => isUnlocked(p.id)).map((p) => p.id),
    save: () => saveData(),
    resume: async (d) => { loadData(d); await startChapter(nextChapter()); },   /* what the Continue button does with a saved game */
    places: () => WALK_IDS.map(String),
    move: (a, b) => { let p = a.slice(); const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.05) || 1; for (let i = 1; i <= n; i++) p = clampPos(p[0] + (b[0] - a[0]) / n, p[1] + (b[1] - a[1]) / n); return p; },
    faceBody: (n) => { const look = LOOKS[Talk.npcs.find((x) => x.id === n.id).look], src = n.n.body; const b = makeBody({ ...look, x: src.position.x, z: src.position.z, ground: src.userData.ground || 0, ry: src.rotation.y, anim: 'Idle' }); scene.add(b); b.userData.anim.mx.update(0.3); for (let i = 0; i < 10; i++) groundFeet(b); src.visible = false; setTimeout(() => { src.visible = true; }, 0); return b; },
    frame: (dt) => { stepClock(dt); renderer.render(scene, camera); },
    autoplay: async () => { const r = await autoPlay(1, false); STEPPED.on = false; return r; },
    talkTo: (id) => { const n = Talk.npcs.find((x) => x.id === id); if (!n) return; state.x = n.x + 1.1; state.z = n.z + 0.4; talkStart(n); }, leaveTalk: () => talkLeave(),
    clips: () => { const L = [...Talk.npcs.map((n) => [n.id, n.body]), ...(CH.life ? CH.life.people.map((n) => [n.id, n.m]) : []), ...(FIGHT.on ? FIGHT.actors.map((a, i) => [a.side + i, a.b]) : [])];
      return L.filter(([, m]) => m.visible && m.userData.anim && m.userData.anim.cur).map(([id, m]) => { const c = m.userData.anim.cur, d = c.getClip().duration || 1; return { id, clip: c.getClip().name, t: (c.time % d) / d, dist: Math.hypot(m.position.x - state.x, m.position.z - state.z) }; }); },
    line: () => (!$('dialogue').hidden ? $('line').textContent : ''),
    talking: () => !$('dialogue').hidden,
    audio: () => AU, setSound: (on) => { if (AU.on !== on) $('snd').click(); },
    keyMove: async () => { await beginStep(20); await settle(); const x0 = state.x, z0 = state.z; keys.add('w'); for (let i = 0; i < 20; i++) stepClock(1 / 30); keys.delete('w'); const moved = Math.hypot(state.x - x0, state.z - z0) > 0.3;
      const n = Talk.npcs[0]; let talk; if (n) { state.x = n.x + 1.0; state.z = n.z + 0.4; stepClock(1 / 30); dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' })); await sleep(100); talk = !$('dialogue').hidden; talkLeave(); } return { moved, talk }; },
    cardSeen: (id) => (id === 'fightcard' ? SEEN.fightcard : true),
    openJournal, openChapters,
  };
}
/* ?test=heads: the hooks for headcheck.js (every walking chapter walked and talked through, then the street scene) */
function headHooks(only) {
  const lookOf = (n) => LOOKS[n.look], made = [];
  const people = () => {
    const L = [];
    for (const n of Talk.npcs) L.push({ id: n.name, m: n.body, key: lookOf(n).base, make: (clip) => { const b = makeBody({ ...lookOf(n), x: 900, z: 900, anim: clip }); made.push(b); return b; } });
    if (CH.life) for (const n of CH.life.people) L.push({ id: 'neighbour ' + n.id, m: n.m, footBody: n.lo?.visible ? n.lo : n.m, key: n.look.base + (n.look.scale || ''), make: (clip) => { const b = makeBody({ ...n.look, x: 900, z: 900, anim: clip }); made.push(b); return b; } });
    if (FIGHT.on) FIGHT.actors.forEach((a, i) => L.push({ id: a.side + ' ' + i, m: a.b, key: a.bodyId, make: null }));
    for (const p of L) { const c = p.m.userData.anim && p.m.userData.anim.cur; p.clip = c ? c.getClip().name : ''; p.blend = !!(c && c.getEffectiveWeight() < 0.98); }
    return L.filter((p) => (p.footBody || p.m).visible);
  };
  return {
    cases: () => [...WALK_IDS.filter((id) => !only || only.includes(String(id))).map((id) => ({ label: 'chapter ' + id, stops: {}, async enter() {
      await startChapter(id, { talked: [] }); STEPPED.on = true; this.stops = {}; const pl = CH.place, route = [[pl.start.x, pl.start.z]];
      for (const k of orderNow()) { const n = Talk.npcs.find((x) => x.id === k), to = clampPos(n.x + 1.1, n.z + 0.4), w = walkRoute(route[route.length - 1], to, WALLS, 0.3, pl.bounds); route.push(...(w.length ? w : [to])); this.stops[route.length - 1] = k; }
      const e = pl.endSpot, w = walkRoute(route[route.length - 1], [e.x, e.z], WALLS, 0.3, pl.bounds); route.push(...(w.length ? w : [[e.x, e.z]])); return route; } })),
      ...(!only || only.includes('5') ? [{ label: 'chapter 5 (the street scene)', stops: {}, async enter() { await startChapter(5); $('fbegin').click(); await waitFor(() => FIGHT.on); STEPPED.on = true; return []; } }] : [])],
    step: (dt) => stepClock(dt),
    people,
    move: (x, z, yaw) => { [state.x, state.z] = clampPos(x, z); if (yaw !== undefined) state.yaw = yaw; },
    player: () => ({ x: state.x, z: state.z }),
    talk: (id) => { const n = Talk.npcs.find((x) => x.id === id); if (!n) return false; talkStart(n); return !$('dialogue').hidden; },
    next: () => { talkNext(); return !$('dialogue').hidden; },
    done: () => (CH.on && CH.ended) || (FIGHT.on && FIGHT.ended) || (!CH.on && !FIGHT.on && stepNow_() === 50 && !$('aftercard').hidden),
  };
}

/* ---------- dev only: test views. This whole block is left out of the public build. ---------- */
const DEVG = [];   // models whose feet are pinned to the ground each frame
const waitTick = () => new Promise((r) => setTimeout(r, 0));
function devLog(lines, title) { let el = $('autolog'); if (!el) { el = document.createElement('pre'); el.id = 'autolog'; el.style.cssText = 'position:fixed;left:0;bottom:0;max-height:45%;overflow:auto;margin:0;padding:6px;background:#000c;color:#cfc;font:11px monospace;z-index:9'; document.body.appendChild(el); } el.textContent = lines.join('\n'); document.title = title; }
async function devViews() {
  const q = new URLSearchParams(location.search), shot = q.get('shot'), test = q.get('test'), lo = q.has('lo') ? '_lo' : '';
  addEventListener('error', (e) => { document.title = 'ERROR ' + e.message; });
  if (test === 'all') {   /* ?test=all: the shared runner (engine/checks.js, docs/TESTING.md section 7) with Tivoli's hooks (checktables.js), plus the head check. &checks=journal,heads runs some. Expect ALL 0. */
    if (!CHECKS.some((c) => c.id === 'heads')) CHECKS.push({ id: 'heads', needs: [], async run() { const r = await headCheck(headHooks(null)); STEPPED.on = false; return { lines: r.lines, note: r.stats.length + ' scenes watched' }; } });
    checkAll(makeAdapter(checkHooks()), CHECK_TABLES); return;
  }
  if (test === 'feet') {
    const r = await headCheck(headHooks(q.get('ch') ? q.get('ch').split(',') : null), { feetOnly: true });
    STEPPED.on = false;
    devLog([...r.lines, ...r.stats], 'FEET ' + r.lines.length);
    return;
  }
  if (test === 'heads') {   /* ?test=heads (&ch=1,5): every person's head and body through every chapter (headcheck.js): no head past 80 degrees, none going round, no snap or spin. Expect HEADS 0. */
    const r = await headCheck(headHooks(q.get('ch') ? q.get('ch').split(',') : null)); STEPPED.on = false; devLog(['heads: ' + r.lines.length + ' issues', ...r.lines, '', ...r.stats], 'HEADS ' + r.lines.length); return;
  }
  if (test === 'resume') {   /* ?test=resume: a saved game reloads in the right chapter with the right people talked to, and Continue on the title says so. Expect RESUME 0. */
    const out = [], hk = checkHooks();
    for (const s of [12, 23, 41, 63, 50, 80]) { await beginStep(s); await hk.settle(); const before = { step: stepNow_(), pages: hk.unlocks().join() }, d = saveData();
      ch1Leave(); fightFinish(); loadData({ unlocked: [], done: [], cur: null }); loadData(d); await startChapter(nextChapter()); await hk.settle(); const after = { step: stepNow_(), pages: hk.unlocks().join() };
      if (before.step !== after.step) out.push(`step ${s}: saved at step ${before.step}, came back at step ${after.step}`); if (before.pages !== after.pages) out.push(`step ${s}: journal pages changed`); if (!hasSave()) out.push(`step ${s}: no saved game, so the title would say Start`); }
    devLog(['resume: ' + out.length + ' issues', ...out], 'RESUME ' + out.length); return;
  }
  if (q.has('auto')) {   /* ?auto=N plays chapter N (1 to 8) and the ones after it; &one stops after N. Every change goes to the page title and #autolog. */
    const log = [], L = (m) => { log.push(m); document.title = log.slice(-3).join(' | '); devLog(log, document.title); }; const r = await autoPlay(+q.get('auto') || 1, q.has('one'), L); if (!r.ok) L('FAILED: ' + r.why); return;
  }
  if (test === 'clips') { document.title = 'stand-ins: ' + (standIns().join(',') || 'none'); console.log('tivoli stand-in poses still in use:', standIns()); }
  if (['1', '2', '3', '4', '6', '7', '8'].includes(q.get('chapter'))) {   /* ?chapter=N (&at=talked|end) (&cam=x,z,yaw,pitch,height: stand there for a picture) */
    await ch1Begin(+q.get('chapter')); if (q.get('at')) ch1Skip(q.get('at'));
    if (q.get('cam')) { const [x, z, yaw, pitch, h] = q.get('cam').split(',').map(Number); Object.assign(state, { x, z, yaw, pitch: pitch || 0 }); if (h) state.camY = h; hideIntro(); setTimeout(() => { document.title = 'CAM'; }, +(q.get('wait') || 6000)); }
    return;
  }
  if (shot === 'poster') {   /* ?shot=poster&cx=&cy=&cz=&tx=&ty=&tz=: the quiet street with nobody in it, for the menu picture (menu/tivoli.jpg) */
    await fightBegin(); FIGHT.freeze = true; $('hud').hidden = true; for (const id of ['fightcard', 'readcard', 'fighttitle', 'windowframe']) { const e = $(id); if (e) e.hidden = true; }
    scene.traverse((o) => { if (o.isSkinnedMesh) { let p = o; while (p.parent && p.parent !== scene) p = p.parent; p.visible = false; } });
    const f = (k, d) => (q.has(k) ? +q.get(k) : d); FIGHT.on = false; for (const b of FIGHT.bodies) b.visible = false; const cx = f('cx', -9.5), cz = f('cz', 2.0); state.x = cx; state.z = cz; state.camY = f('cy', 1.7); state.yaw = Math.atan2(-(f('tx', 16) - cx), -(f('tz', -0.5) - cz)); state.pitch = f('pitch', 0.04); state.started = true; $('title').hidden = true; return;
  }
  if (q.get('scene') === 'fight') { await fightBegin(); const at = +(q.get('at') || 0); if (at) fightSkip(at); if (q.has('hold')) FIGHT.freeze = true; return; }
  if (!shot && !test) return;
  await Promise.all(BODIES.flatMap((b) => [loadBase(b), loadBase(b + '_lo')]));
  const place = (look, x, z, ry, anim) => { const b = makeBody({ ...LOOKS[look], bodyId: LOOKS[look].base + lo, x, z, ry, anim }); scene.add(b); DEVG.push(b); return b; };
  const cam = (x, z, yaw, pitch) => { state.x = x; state.z = z; state.yaw = yaw; state.pitch = pitch; state.started = true; $('title').hidden = true; $('hud').hidden = true; };
  if (shot === 'fight') {   /* ?shot=fight: every gunfight pose, soldiers and police in turn, in front of a low wall (the poses are stand-ins until the real clips arrive) */
    const wall = new THREE.Mesh(new THREE.BoxGeometry(14, 1.1, 0.4), new THREE.MeshStandardMaterial({ color: 0xc9b99a, roughness: 1 })); wall.position.set(0, 0.55, -1.2); scene.add(wall);
    const names = Object.keys(POSES); names.forEach((n, i) => { const pistol = n === 'PistolFire' || n === 'AimCorner', look = pistol ? 'police' : ['soldier', 'police', 'policeCamo'][i % 3], b = place(look, (i - (names.length - 1) / 2) * 1.5, 0, 0, pose(n)); arm(b, pistol ? 'pistol' : 'rifle', scene); });
    cam(0, 8.5, 0, -0.04); document.title = 'fight: ' + names.map((n) => n + '=' + pose(n)).join(' ');
  }
  if (shot === 'rifles') {   /* ?shot=rifles: the rifle and pistol clips close up, each with its weapon, plus one person with the rifle slung */
    [['soldier', 'ShootRifle', 'rifle'], ['police', 'PeekAim', 'pistol'], ['police', 'ShootPistol', 'pistol'], ['soldier', 'Idle', 'rifle'], ['police', 'ProneFire', 'rifle']].forEach(([look, clip, kind], i) => { const b = place(look, (i - 2) * 1.3, 0, i === 3 ? Math.PI : 0, clip); arm(b, kind, scene); });
    cam(0, 4.6, 0, -0.12); document.title = 'rifles';
  }
  if (shot === 'hands') {   /* ?shot=hands&clip=ShootRifle (&t=0.3, &look=police, &kind=pistol, &yaw=0.6): one person close up, to look at the hands on the weapon */
    const b = place(q.get('look') || 'soldier', 0, 0, +(q.get('yaw') || 0.6), q.get('clip') || 'ShootRifle'); arm(b, q.get('kind') || 'rifle', scene); if (q.get('carry')) b.userData.weapon.carry = q.get('carry');
    const c = b.userData.anim.cur; c.time = c.getClip().duration * +(q.get('t') || 0.3); c.timeScale = 0;
    const cd = +(q.get('dist') || 1.15), ch = +(q.get('h') || 1.6); state.x = 0.15; state.z = cd; state.yaw = 0; state.pitch = -0.12; state.started = true; $('title').hidden = true; $('hud').hidden = true; state.camY = ch; document.title = 'hands';
  }
  if (shot === 'slung') {   /* ?shot=slung: the rifle slung across the back, from behind and from the front */
    const a = place('soldier', -0.5, 0, Math.PI, 'Idle'); arm(a, 'rifle', scene); const b = place('policeCamo', 0.5, 0, 0, 'Walk'); arm(b, 'rifle', scene);
    cam(0, 2.6, 0, -0.15); document.title = 'slung';
  }
  if (test === 'audit') {   /* ?test=audit: the street (built unmerged): floating signs, lamps, tanks, roofs, and anyone standing or running through a solid. Expect 0 issues. */
    const st = buildStreet({}), snap = snapMeshes(st.raw), r = auditPlace({ id: 'street', snap, npcs: fightPositions(), routes: fightRoutes(), walls: [], bounds: { x0: -45, x1: 40, z0: -4.4, z1: 4.4 }, start: { x: -10, z: 0 }, actions: [], people: [] });
    const lines = ['street: ' + (r.floating.length + r.inside.length + r.stuck.length) + ' issues (' + r.floating.length + ' floating, ' + r.inside.length + ' inside solids, ' + r.stuck.length + ' unreachable)', ...r.floating.map((l) => '  floating: ' + l), ...r.inside.map((l) => '  inside: ' + l), ...r.stuck.map((l) => '  stuck: ' + l)];
    const ov = overlapSolids(st.solids).concat(sinkCheck(snap, fightPositions())); lines.push('overlaps: ' + ov.length); for (const l of ov) lines.push('  ' + l);
    let extra = 0;
    for (const [id, pl] of [...Object.entries(WALKS).map(([n, w]) => ['chapter ' + n, w.build({})])]) {   /* every walking chapter, with its own place and people */   /* the walking places: the engine's place audit, and the solid-box overlap check */
      const ov2 = overlapSolids(pl.solids), npc = pl.npcs.map((n) => ({ id: n.id, x: n.x, z: n.z, anim: 'Idle', ground: pl.groundAt ? pl.groundAt(n.x, n.z) : 0 })), bd = pl.bounds || { x0: -23, x1: 17.5, z0: -13.6, z1: 14.2 };
      const r2 = auditPlace({ id, snap: snapMeshes(pl.raw), npcs: npc, walls: pl.walls, bounds: bd, start: pl.start, actions: [{ label: 'end spot', ...pl.endSpot }], people: npc });
      ov2.push(...sinkCheck(snapMeshes(pl.raw), npc));
      /* look-alikes (engine/faces.js faceCheck): the story people and the background people of the chapter, each with the body and face they are given */
      const cols = (l) => Object.values(l.tint || {}).sort(), nn = +id.split(' ')[1];
      ov2.push(...faceCheck([...pl.npcs.map((n) => ({ id: n.id, face: bodyOf(LOOKS[n.look]), x: n.x, z: n.z, scale: LOOKS[n.look].scale, cols: cols(LOOKS[n.look]), story: true })), ...lifeBodies(nn, pl).map((d) => ({ id: d.id, face: d.bodyId, x: d.at[0], z: d.at[1], life: d.spec, scale: d.look.scale, cols: cols(d.look) }))]));
      const n2 = r2.floating.length + r2.inside.length + r2.stuck.length + ov2.length; extra += n2;
      lines.push(id + ': ' + n2 + ' issues (' + r2.floating.length + ' floating, ' + r2.inside.length + ' inside solids, ' + r2.stuck.length + ' unreachable, ' + ov2.length + ' overlaps)', ...r2.floating.map((l) => '  floating: ' + l), ...r2.inside.map((l) => '  inside: ' + l), ...r2.stuck.map((l) => '  unreachable: ' + l), ...ov2.map((l) => '  ' + l));
    }
    (async () => { const gl = []; for (const [k, look] of Object.entries(LOOKS)) { try { await loadBase(bodyOf(look)); const m = makeBody({ ...look, x: 0, z: 0, ry: 0 }); gl.push(...auditGarments(k, m)); } catch (e) { gl.push(k + ': could not be made (' + (e.message || e) + ')'); } }   /* every look as it is drawn: no band, buttons or knot left showing when its garment is hidden (engine/audit.js) */
      extra += gl.length; lines.push('garments: ' + gl.length); for (const l of gl) lines.push('  ' + l);
      devLog(lines, 'AUDIT ' + (r.floating.length + r.inside.length + r.stuck.length + ov.length + extra)); })();
  }
  if (test === 'layout') {   /* ?test=layout: show each card and title state and check that no two bits of text overlap, nothing is off the sides of the screen, and every button is big enough to touch (44 px). Run at 390x800, 320x568, 667x375, 800x500, 1280x720. */
    const out = [], W = innerWidth, Hh = innerHeight, st2 = document.createElement('style'); st2.textContent = '*{transition:none!important;animation:none!important}'; document.head.appendChild(st2);
    const ALL = ['title', 'fightcard', 'readcard', 'aftercard', 'fightload', 'scenetitle', 'fighttitle', 'windowframe', 'hud', 'chcard', 'journal', 'chapters', 'toast'], frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    for (const [name, show] of [['title', ['title']], ['opt-in card', ['fightcard']], ['read card', ['readcard']], ['after card', ['aftercard']], ['loading', ['fightload']], ['scene title over the window', ['fighttitle', 'windowframe']], ['chapter title over the goal and buttons', ['scenetitle', 'hud']], ['chapter end card', ['chcard']], ['reset card', ['chcard']], ['play: goal, buttons, tip, toast', ['hud', 'toast']], ['play: talking', ['hud', 'dialogue']], ['journal', ['journal']], ['chapters', ['chapters']]]) {
      if (name === 'reset card') { $('chcardt').textContent = 'Reset'; $('chcardl').replaceChildren(Object.assign(document.createElement('p'), { textContent: 'Start this chapter again, or start the whole story again.' })); $('chcardb').replaceChildren(...['Restart “May 2010: before”', 'Start the whole story again', 'Cancel'].map((t, i) => Object.assign(document.createElement('button'), { className: 'btn' + (i ? ' ghost' : ''), textContent: t }))); }
      if (name.startsWith('play')) { $('scenetitle').hidden = true; $('goal').textContent = 'Talk to Pastor Grant by the clinic.'; $('hint').hidden = false; liveHint($('hint'), 'Left thumb walks. Drag to look. Tap a person to talk.', 'W A S D to walk, Shift to hurry. Drag to look. Space or Enter to talk.'); $('jcount').hidden = false; $('jcount').textContent = '2'; $('jbtn').classList.add('glow'); $('toast').textContent = 'New journal page: What people disagree about'; $('dialogue').hidden = true;
        if (show.includes('dialogue')) { document.body.classList.add('talking'); $('dialogue').hidden = false; $('who').textContent = 'Pastor Grant'; $('line').textContent = 'Finding the truth can take a long time.'; } else document.body.classList.remove('talking'); }
      if (show.includes('hud')) { const t = $('scenetitle'); t.replaceChildren(); const b = document.createElement('b'); b.textContent = 'Sunday 23 May 2010.'; t.append(b); for (const l of ['You live in Tivoli Gardens with Gran Ivy.', 'The girl from Back-o-Wall is a grandmother now.']) { const p = document.createElement('p'); p.textContent = l; t.append(p); } $('goal').textContent = 'Talk to Mr Clarke by the community centre.'; }
      if (name === 'chapter end card') { $('chcardb').replaceChildren(...['Next chapter', 'Chapters'].map((t, i) => Object.assign(document.createElement('button'), { className: 'btn' + (i ? ' ghost' : ''), textContent: t }))); }
      if (name === 'chapter end card') { $('chcardt').textContent = 'May 2010: before'; $('chcardl').replaceChildren(...['On 23 May 2010 the Government declared a state of emergency.', 'Barricades blocked the roads into Tivoli Gardens.', 'The next day, soldiers and police went in.', 'Gran Ivy, Miss Dawn and Mr Brown are made up.'].map((x) => { const p = document.createElement('p'); p.textContent = x; return p; })); }
      for (const id of ALL) $(id).hidden = !show.includes(id); await frames();
      const els = show.flatMap((id) => [$(id), ...$(id).querySelectorAll('h1,h2,p,label,button,a,b')]).filter((e) => e.matches('h1,h2,p,label,button,a,b') && !e.closest('[hidden]') && getComputedStyle(e).visibility !== 'hidden' && contentRects(e).length);
      for (const e of els) { for (const r of contentRects(e)) if (r.left < -1 || r.right > W + 1) out.push(`${W}x${Hh} ${name}: "${(e.textContent || '').slice(0, 30)}" is off the side of the screen`); if (e.matches('button,a.btn') && e.getBoundingClientRect().height < 44) out.push(`${W}x${Hh} ${name}: button "${e.textContent.slice(0, 24)}" is under 44 px tall`); }
      for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) if (!els[i].contains(els[j]) && !els[j].contains(els[i]) && contentsOverlap(els[i], els[j])) out.push(`${W}x${Hh} ${name}: "${els[i].textContent.slice(0, 24)}" overlaps "${els[j].textContent.slice(0, 24)}"`);
    }
    devLog(out.length ? out : [W + 'x' + Hh + ': no layout problems'], 'LAYOUT ' + out.length);
  }
  if (test === 'ambient') {   /* ?test=ambient: every walking chapter's background people run for a minute while a player walks the story route (engine/ambient.js ambientTest). Expect 0. */
    const r = await lifeTest(WALKS); devLog(['ambient: ' + r.total + ' issues', ...r.lines], 'AMBIENT ' + r.total);
  }
  if (test === 'scene') {   /* ?test=scene (&seeds=1,2,3): the street scene run start to end; everyone's aim, facing and feet (scenecheck.js). Expect 0. */
    const r = await sceneCheck({ FIGHT, begin: fightBegin, tick: fightTick, strideOf, WALKS: WALK_CLIPS, CONTACT, seeds: q.get('seeds') ? q.get('seeds').split(',').map(Number) : undefined });
    devLog(['scene: ' + r.lines.length + ' issues (' + r.stats.samples + ' person-frames, ' + r.stats.aims + ' aims checked)', ...r.lines], 'SCENE ' + r.lines.length); for (const id of ['windowframe', 'fighttitle', 'fade']) $(id).hidden = true;
  }
  if (test === 'clipinfo') {   /* ?test=clipinfo (&clips=A,B &b=police2010 &kind=pistol): each clip's length, built-in aim turn, swing, foot travel and hip height */
    const names = q.get('clips') ? q.get('clips').split(',') : Object.keys(CL).filter((n) => !n.startsWith('_'));
    devLog(clipInfo(names, { bodyId: q.get('b') || 'soldier2010', kind: q.has('kind') ? (q.get('kind') || null) : 'rifle' }), 'CLIPINFO');
  }
  if (test === 'measure') {   /* ?test=measure: in each rifle clip, the distance from the right palm to the right shoulder joint and to the left palm (cm), to size the rifle to the clips */
    const out = []; const P = (b, n) => b.getObjectByName('mixamorig' + n).getWorldPosition(new THREE.Vector3());
    for (const clip of ['ShootRifle', 'PeekAim', 'ProneFire', 'ProneTurnR']) { const b = makeBody({ ...LOOKS.soldier, anim: clip }); scene.add(b); const c = b.userData.anim.cur, D = c.getClip().duration, rows = [];
      for (let k = 0; k < 6; k++) { c.time = D * k / 6; b.userData.anim.mx.update(0); groundFeet(b); b.updateMatrixWorld(true);
        const R = P(b, 'RightHand').lerp(P(b, 'RightHandMiddle1'), 0.55), L = P(b, 'LeftHand').lerp(P(b, 'LeftHandMiddle1'), 0.55), S = P(b, 'RightArm'), H = P(b, 'Head');
        rows.push(`R-S ${(R.distanceTo(S) * 100).toFixed(0)} R-L ${(R.distanceTo(L) * 100).toFixed(0)} S-head ${(S.distanceTo(H) * 100).toFixed(0)}`); }
      out.push(clip + ': ' + rows.join(' | ')); scene.remove(b); }
    devLog(out, 'MEASURE');
  }
  if (test === 'held') {   /* ?test=held: in every weapon clip, through the whole clip, the right palm is on the grip and (rifle) the left palm on the handguard, with the fingers closed round them. Faults: a palm more than 4 cm off, or fingertips more than 3 cm beyond the weapon. */
    const out = []; let bad = 0;
    for (const [look, clip, kind, carry] of [['soldier', 'Walk', 'rifle', 'ready'], ['soldier', 'Run', 'rifle', 'ready'], ['soldier', 'RunForward', 'rifle', 'ready'], ['soldier', 'RunLeft', 'rifle', 'ready'], ['soldier', 'RunRight', 'rifle', 'ready'], ['soldier', 'RunBackward', 'rifle', 'ready'], ['soldier', 'RunLow', 'rifle', 'ready'], ['soldier', 'RunLow2', 'rifle', 'ready'], ['soldier', 'WalkCrouchR', 'rifle', 'ready'], ['soldier', 'CrouchIdle', 'rifle', 'ready'], ['soldier', 'Ducking', 'rifle', 'ready'], ['police', 'Idle', 'rifle', 'ready'], ['soldier', 'ShootRifle', 'rifle'], ['police', 'PeekAim', 'pistol'], ['soldier', 'ProneFire', 'rifle'], ['soldier', 'ProneTurnR', 'rifle'], ['police', 'ShootRifle', 'rifle'], ['police', 'ShootPistol', 'pistol'], ['police', 'Gunplay', 'pistol'], ['soldier', 'FireStand', 'rifle'], ['soldier', 'FireKneel', 'rifle'], ['police', 'FireStand', 'rifle'], ['police', 'PistolKneelIdle', 'pistol'], ['police', 'PistolStand', 'pistol'], ['soldier', 'RifleWalk', 'rifle', 'ready'], ['soldier', 'RifleIdle', 'rifle', 'ready'], ['soldier', 'PistolKneelIdle', 'rifle', 'ready']]) {
      const b = makeBody({ ...LOOKS[look], anim: clip }); scene.add(b); arm(b, kind, scene); if (carry) b.userData.weapon.carry = carry; const ctl = b.userData.anim, D = ctl.cur.getClip().duration; let worstR = 0, worstL = 0, tipR = 0, tipL = 0, atL = 0;
      for (let k = 0; k < 12; k++) { ctl.cur.time = D * k / 12; ctl.mx.update(0); groundFeet(b); const r = heldReport(b); if (b.userData.weapon.dbg && k === (clip === 'Run' ? 6 : 4)) out.push('   dbg ' + look + ' ' + clip + ' k' + k + ': ' + Object.entries(b.userData.weapon.dbg).map(([n, v]) => n + ' ' + (v * 100).toFixed(1)).join(', ')); worstR = Math.max(worstR, r.right); if (r.left > worstL) atL = k; worstL = Math.max(worstL, r.left); tipR = Math.max(tipR, r.rightTip); tipL = Math.max(tipL, r.leftTip); }
      const f = worstR > 4 || worstL > 4 || tipR > 3 || tipL > 3; if (f) bad++; out.push(`${f ? 'FAULT ' : ''}${look} ${clip} (${kind}): right hand ${worstR.toFixed(1)} cm from the grip, left hand ${worstL.toFixed(1)} cm from the handguard; fingertips ${tipR.toFixed(1)} cm (right) and ${tipL.toFixed(1)} cm (left) beyond them (worst of 12 moments, left worst at moment ${atL})`);
      b.userData.weapon.mesh.removeFromParent(); ARMED.splice(ARMED.indexOf(b), 1); scene.remove(b); await waitTick(); }
    out.unshift('held: ' + bad + ' issues'); devLog(out, 'HELD ' + bad);
  }
  if (shot === 'uniforms') {   /* ?shot=uniforms (&lo for the light copies): soldier and police, front and back, close up */
    place('soldier', -1.5, 0, 0); place('soldier', -0.5, 0, Math.PI); place('police', 0.5, 0, 0); place('police', 1.5, 0, Math.PI);
    cam(0, 3.6, 0, -0.1); document.title = 'uniforms' + lo;
  }
  if (test === 'cloth') {   /* ?test=cloth (&b=soldier2010 &full or &lo &idle &where): does an under layer show through its cover (skin through a sleeve, shirt through the vest, hair through the helmet)? Both bodies, full and light copy, in the poses the game uses. */
    const out = []; let bad = 0, pts = 0; const POSE_LIST = [['Idle', 0.3], ['Walk', 0.25], ['Walk', 0.75], ['Run', 0.3], ['Talk1', 0.4], ['Point', 0.5], ['Block', 0.5], ['RifleWalk', 0.3], ['RunLow', 0.3], ['CrouchIdle', 0.5], ['FireStand', 0.5], ['FireKneel', 0.5], ['PistolKneelIdle', 0.5]];   /* the last six: the poses the street scene uses */
    for (const base of (q.get('b') ? q.get('b').split(',') : BODIES)) for (const l of ['', '_lo']) { if ((l && q.has('full')) || (!l && q.has('lo'))) continue; const b = makeBody({ base, bodyId: base + l, anim: 'Idle' }); scene.add(b);
      const r = auditCloth(base + l, b, { poses: q.has('idle') ? [['Idle', 0.3]] : POSE_LIST, where: q.has('where'), skip: CLOTH_SKIP }); out.push(base + l + ': ' + r.lines.length + ' faults, ' + r.points + ' points, worst ' + r.worst.toFixed(1) + ' mm'); for (const x of r.lines) out.push('  ' + x); bad += r.lines.length; pts += r.points; scene.remove(b); await waitTick(); }
    out.unshift('cloth: ' + bad + ' issues (' + pts + ' points)'); devLog(out, 'CLOTH ' + bad);
  }
  if (test === 'skin') {   /* ?test=skin: how dark each face really looks in this game's light (the copied engine skin probe) */
    const out = []; for (const [k, look] of Object.entries(LOOKS)) for (const l of ['', '_lo']) { const b = makeBody({ ...look, bodyId: look.base + l, x: 400, z: 400, anim: 'Idle' }); scene.add(b); b.userData.anim.mx.update(0.3);
      const r = skinProbe(renderer, scene, b); scene.remove(b); out.push(k + l + ': mean ' + r.rgb.join(',') + '  darkest ' + r.lo.join(',') + '  lightest ' + r.hi.join(',')); }
    devLog(out, 'SKIN ' + out.length);
  }
  if (test === 'walkers') {   /* ?test=walkers: each uniform body in the walks and runs the street scene gives it (RifleWalk walking in, RunLow to cover, and Walk), at game speed: feet must not slide, sink or float. RunLow is not in the engine's paced list, so it is tested at the speed its own stride gives at clip speed 1, which is how fight.js moves a runner (any pace slides the same per loop). */
    const out = []; let bad = 0;
    for (const base of BODIES) for (const [clip, v] of (q.get('walk') ? q.get('walk').split(',').map((s) => [s.split(':')[0], -s.split(':')[1]]) : [['Walk', 1.3], ['RifleWalk', 1.3], ['RunLow', 0]])) for (const l of ['', '_lo']) { const b = makeBody({ base, bodyId: base + l, ry: Math.PI / 2, anim: clip }); scene.add(b);
      const own = v <= 0, sp = v < 0 ? -v : !v ? strideOf(b, b.userData.anim.cur.getClip()) / b.userData.anim.cur.getClip().duration : v; const r = auditWalk(base + l + ' ' + clip, b, sp, { paced: !own, pace: gamePace, stride: strideOf });   /* paced as the street scene paces them (walk.js, used by fight.js), not by the engine's own estimate */ out.push(`${base}${l} ${clip} at ${sp.toFixed(2)} m/s: stride ${(r.stride * 100).toFixed(0)} cm, clip speed ${r.pace.toFixed(2)}, slide ${r.slide.toFixed(1)} cm a loop, shoes ${r.sink.toFixed(1)} to ${r.float.toFixed(1)} cm`); for (const x of r.lines) { out.push('  ' + x); bad++; } scene.remove(b); await waitTick(); }
    out.unshift('walkers: ' + bad + ' issues'); devLog(out, 'WALKERS ' + bad);
  }
}

/* ---------- the frame loop: update(dt, now) moves everything; frame() also places the camera and draws. The tests step update() with their own clock. ---------- */
let last = performance.now(), stepT = 0;
function update(dt, now) {
  if (Talk.open) { if (!TC.on) TC.begin(); TC.step(state, camera.position, speakerHead(Talk.open), dt); } else if (TC.on) TC.end();   /* engine/talk-cam.js */
  if (FIGHT.on) fightTick(dt);   // the street scene moves its own people and takes over the camera
  if (state.started && !busy && !FIGHT.on) {
    if (keys.has('arrowleft')) state.yaw += 1.8 * dt; if (keys.has('arrowright')) state.yaw -= 1.8 * dt;
    let f = stick.id !== null ? -stick.dy : 0, r = stick.id !== null ? stick.dx : 0;
    if (keys.has('w') || keys.has('arrowup')) f += 1; if (keys.has('s') || keys.has('arrowdown')) f -= 1; if (keys.has('d')) r += 1; if (keys.has('a')) r -= 1;
    const len = Math.hypot(f, r);
    if (len > 0.05) { const sp = (keys.has('shift') ? 3.6 : 2.3) * Math.min(1, len), fx = -Math.sin(state.yaw), fz = -Math.cos(state.yaw);   /* Kendal's walking speeds */
      [state.x, state.z] = clampPos(state.x + (fx * f - fz * r) / Math.max(1, len) * sp * dt, state.z + (fz * f + fx * r) / Math.max(1, len) * sp * dt);
      stepT -= dt * sp; if (stepT <= 0) { stepT = 1.35; stepSound(FOOT[CH.id] || 'stone'); } }
  }
  if (CH.on) { updateTalk(dt, state, state.started && !busy); ch1Tick(dt); }
  for (const mx of mixers) mx.update(dt); for (const n of Talk.npcs) { if (n.body.userData.anim) n.body.userData.anim.tick(dt); groundFeet(n.body); }   /* the story people: shoes pinned to the ground every frame, so feet never sink */
  if (CH.on) { lifeTick(dt); talkAfter(dt, state); }   /* after the mixers: the background people (engine/ambient.js) and the story people's heads turn on top of their clips */
  if (__DEV__) for (const m of DEVG) groundFeet(m);
  for (const m of ARMED) weaponTick(m);   // after the mixer and the feet: weapons follow the hands
  if (now !== undefined) { bubbleTick(now / 1000); stickUI(); guideTick(now); audioTick(now / 1000); }
}
function frame(t) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (t - last) / 1000); last = t; if (STEPPED.on) return;   /* a test is stepping the clock itself */
  update(dt, t); place(t);
  renderFramed(renderer, scene, camera, FIGHT.on);
}
const STEPPED = { on: false };
function place(t) { if (FIGHT.on) fightAfter(t / 1000); else { camera.position.set(state.x, state.camY || 1.6, state.z); camera.rotation.set(state.pitch, state.yaw, 0, 'YXZ'); } }
/* The next-task helper: after 2.5 seconds of play, a gold arrow on the ground points the way (round the buildings, by engine/placement.js walkRoute),
   with a gold ring round the person or the place. Near them the talk bubble takes over. */
const NUDGE = { goal: '', since: 0, still: 0, lx: 0, lz: 0, on: false }; let GUIDE = null;
function guideTick(now) {
  if (!GUIDE) GUIDE = createGuide({ scene, camera, eye: () => state.camY || 1.6 });
  const goal = $('goal').textContent, quiet = CH.on && state.started && !busy && !FIGHT.on && !Talk.open && $('chcard').hidden;
  if (goal !== NUDGE.goal) { NUDGE.goal = goal; NUDGE.since = now; NUDGE.on = false; }
  if (Math.hypot(state.x - NUDGE.lx, state.z - NUDGE.lz) > 0.6) { NUDGE.lx = state.x; NUDGE.lz = state.z; NUDGE.still = now; }
  if (!quiet) { NUDGE.since = now; NUDGE.on = false; }
  const tgt = quiet ? guideTarget() : null;
  if (!NUDGE.on && quiet && tgt && Math.hypot(state.x - tgt[0], state.z - tgt[1]) >= 2.2 && now - NUDGE.since >= 2500) NUDGE.on = true;
  if (NUDGE.on && tgt && Math.hypot(state.x - tgt[0], state.z - tgt[1]) < 2.2) NUDGE.on = false; /* Hide while the player is close enough to interact. */
  if (!NUDGE.on || !tgt) { GUIDE.hide(now); return; }
  if (!NUDGE.way || NUDGE.way.key !== tgt.join() || Math.hypot(state.x - NUDGE.way.x, state.z - NUDGE.way.z) > 0.5) {   /* the next corner on the way, worked out again when you move */
    const pl = CH.place, r = walkRoute([state.x, state.z], tgt, WALLS, 0.3, pl && pl.bounds); NUDGE.way = { key: tgt.join(), x: state.x, z: state.z, next: r.length ? r[0] : tgt }; }
  GUIDE.point(now, { x: NUDGE.way.next[0], z: NUDGE.way.next[1], tx: tgt[0], tz: tgt[1], final: NUDGE.way.next === tgt || Math.hypot(NUDGE.way.next[0] - tgt[0], NUDGE.way.next[1] - tgt[1]) < 0.1 });
}
requestAnimationFrame(frame);

if (__DEV__) window.__T = { state, Talk, CH, talkStart, talkNext, camera, startChapter, settle: async () => { await checkHooks().settle(); STEPPED.on = false; } };   // dev only: the test scripts drive the chapter through this
hudTidy();   /* the toast keeps clear of the action button and wraps its words (engine/hud.js) */
addRecap({ items: [{ icon: '\uD83C\uDFDA\uFE0F', label: 'Back-o-Wall', page: 'backowall', img: 'recap/backowall.jpg' }, { icon: '\uD83C\uDFD8\uFE0F', label: 'Tivoli Gardens is built', page: 'newtivoli', img: 'recap/newtivoli.jpg' }, { icon: '\uD83C\uDFA8', label: 'Tivoli Gardens today', page: 'today', img: 'recap/today.jpg' }], open: () => { hideCard(); openJournal(); }, title: 'Today', unlocked: null, card: 'chcard', titleEl: 'chcardt', body: 'chcardl' });   /* three tappable journal pages on the last card (engine/recap.js) */
addExit({ url: '../../../menu/' });

if (!__DEV__) window.PastPortProgress = () => ({ chapter: stepNow_() === 50 ? 5 : CH.on ? CH.id : null, step: stepNow_() });
