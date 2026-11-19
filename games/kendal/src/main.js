import { sceneWarning, sceneIsCalm, endSceneWarning } from '../../../engine/scene-warning.js';
import '../../../engine/textfit.js';   // first: every sign's words fit their board (engine/textfit.js)
import { renderFramed, playChapterFade, showCinematicSkip } from '../../../engine/cine.js';   /* camera scenes framed for a phone held upright (engine/cine.js) */
import { spreadBodies, reachOf, placeFaces } from '../../../engine/faces.js';
import { hudTidy } from '../../../engine/hud.js';
const FACE_VARIANTS = { man_suit: 2, man_work: 2, man_shirt: 2, man_elder: 2, woman57: 2, woman_long: 2, woman_elder: 2, girl: 2, boy: 2, girl_small: 2 };   /* how many more faces each crowd body has (<base>_b_lo, <base>_c_lo; tools/people/rebuild.mjs) */
import { slideWalls, routeIssues, walkRoute } from '../../../engine/placement.js';
import { follow, stop as stopFollow, tick as followTick, isFollowing, watch as followWatch, drive } from '../../../engine/follow.js';   /* people who walk with you: one system for every game */
import { releaseOnBlur, useInteractionKey } from '../../../engine/input.js';
/* games/kendal/src/main.js: Kendal 1957, The Excursion Train.
   The story of the Jamaica Railway, from the slow road before it to the Kendal train crash of 1 September 1957 and how it is remembered.
   Built on the shared engine (engine/anim.js, engine/audio.js, engine/loader.js). Controls, journal, chapters and saving follow Port Royal and Marcus Garvey.
   Layout of this file: setup, state and controls, people and places, interface, saving, chapters and goals, trains and rides, the crash, the other chapters' actions, the loop, test views. */
import * as THREE from 'three';
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { CL, loadClips, animate, groundFeet, isSeated, strideOf, WALKS } from '../../../engine/anim.js';
import { createStory, createCarry, flowTest } from '../../../engine/story.js';   /* who moves the story, the hint arrow, the things you carry (docs/STANDARD.md, "Story flow") */
import { headTop as realHeadTop, markAt, NEAR_GAP } from '../../../engine/marks.js';   /* the talk mark sits the same gap over the real head or hat in every game */
import { createGuide } from '../../../engine/guide.js';   /* the gold arrow on the ground that shows the way (every game) */
import { createAmbient, ambientTest, onKeepOff } from '../../../engine/ambient.js';   /* background people who walk, chat, work and play (docs/STANDARD.md, "Ambient life") */
import { AU, soundPref, setSound, audioInit, stepSound, uiSound, cue, setG, gullCry, chirp } from '../../../engine/audio.js';
import { model, onLoadFail } from '../../../engine/loader.js';
import { grip, gripTick, steadyLoad, spreadArms } from '../../../engine/grip.js';
import { G, T, makeSky, ease, clamp01, lerp, rng, batchStatic } from './gfx.js';
import { ENV, mixEnv, makeRig, TRACK_Y } from './common.js';
import { makeSmoke, spin } from './trains.js';
import { lantern, hamper, bucket, bananaBunch, flowers, attach, hold, suitcase, crate, guitar, banjo, PM } from './props.js';
import { buildRoad, buildStation45, buildRide45, buildHill } from './places1.js';
import { buildKingston57, buildCoach, buildBeach, buildCrash, buildMemorial } from './places2.js';
import { CHAPTERS, CHAPTER_END, TALK, LATER, JOURNAL } from './content.js';
import { STEPS, placeOfStage } from './steps.js';
import { lifeFor, KEEP, settle } from './life.js';
import * as SFX from './sfx.js';
import { HATS, LOOKS, KID } from './cast.js';
import { DECOR } from './decor.js';
import * as TRN from './trains.js'; import * as PRP from './props.js';   /* whole modules, for the dev model viewer only */
import { snapMeshes, auditPlace as auditPlaceE, auditHeld, auditHeldClip, auditSeated, auditWalk, auditCloth, auditBodies, hiddenWith } from '../../../engine/audit.js';
import { skinProbe } from '../../../engine/skinprobe.js';
import { motionCheck } from './motioncheck.js';
import { storyLifeTick } from './storylife.js';
import { checkAll, CHECKS } from '../../../engine/checks.js';   /* ?test=all (dev only) */
import { makeAdapter, CHECK_TABLES } from './checktables.js';   /* ?test=motion: nobody frozen, in step, snapping their head, running in place or sliding (dev only) */
import { makeBirds } from './detail.js';
import { tunePixels } from '../../../engine/perf.js';
import { JOIN_STATS } from '../../../engine/joinbody.js';
import { setQuiet, placeKeeper } from '../../../engine/preload.js';   /* the next place is built in quiet moments, a place left behind gives back its memory */
import { touchFirst, liveHint } from '../../../engine/device.js';
import { addExit } from '../../../engine/exit.js';

const $ = (id) => document.getElementById(id);
const PI = Math.PI;
soundPref('kendal-sound');
onLoadFail((name) => { $('loadnote').textContent = 'Could not load ' + name + '. Please reload the page.'; });
const QUICK = __DEV__ && /[?&](shot|auto|test)=/.test(location.search);   /* test views skip fades and speed up timed scenes */
const TS = QUICK ? 0.06 : 1;   /* time scale for scripted scenes in tests */

/* ---------- renderer, camera, light, sky ---------- */
const canvas = $('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
tunePixels(renderer);   /* pixel cap and slow-frame drop (engine/perf.js) */ renderer.outputColorSpace = THREE.SRGBColorSpace; G.aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(66, 1, 0.1, 800); scene.add(camera);
const hemi = new THREE.HemisphereLight(0xffffff, 0x887766, 2); scene.add(hemi); const sun = new THREE.DirectionalLight(0xfff0d0, 2); sun.position.set(10, 20, 10); scene.add(sun); scene.add(sun.target);
const SHADOWS = !matchMedia('(pointer: coarse)').matches && !(__DEV__ && /[?&]noshadow/.test(location.search));   /* real shadows on computers; phones get soft blob shadows under people instead */
renderer.shadowMap.enabled = SHADOWS; renderer.shadowMap.type = THREE.PCFShadowMap; sun.shadow.mapSize.set(2048, 2048); { const sc = sun.shadow.camera; sc.left = -46; sc.right = 46; sc.top = 46; sc.bottom = -46; sc.near = 1; sc.far = 260; sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.06; }
const sunDir = new THREE.Vector3(0.4, 0.8, 0.4);
const handLamp = new THREE.PointLight(0xffc878, 0, 16, 1.7); handLamp.position.set(0.25, -0.25, -0.5); camera.add(handLamp);   /* Mass Ezra's lamp, in your hand */
const sky = makeSky(); for (const o of sky.objects) scene.add(o);
scene.fog = new THREE.Fog(0xcfe2e6, 60, 240);
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w / h < 0.8 ? 76 : 66; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
/* owner rule 9, at night: a face turned away from the lamps went near black (?test=all faces: brightness 10 to 25 from one side at the crash site and in the coach at night).
   Skin glows a little with its own colour, more the darker the scene: a soft fill light on faces only, as a film lights faces. Day 0.1 (a face shaded by a hat brim read too dark at noon), dusk about 0.3, night about 0.55. */
const SKIN_TONE = 0x96664a, SKIN_FILL = { k: 0.1, mats: new Set() };
const skinFill = (e) => 0.1 + 0.45 * Math.max(0, Math.min(1, (3.0 - (e.hemi[2] + e.sun[1] * 0.5)) / 2.1));
let envNow = ENV.morning;
function setEnv(e) {   /* the time of day: sky, haze, sun and ambient light */
  envNow = e; sky.setSky(e.top, e.hor, e.stars, e.moon); scene.fog.color.setHex(e.fog); scene.fog.near = e.fogN; scene.fog.far = e.fogF; scene.background = scene.fog.color;
  hemi.color.setHex(e.hemi[0]); hemi.groundColor.setHex(e.hemi[1]); hemi.intensity = e.hemi[2]; sun.color.setHex(e.sun[0]); sun.intensity = e.sun[1]; sunDir.set(...e.sun[2]).normalize(); sun.castShadow = SHADOWS && e.sun[1] > 0.9 && !(PL[cur] && PL[cur].ride);
  sky.setSky(e.top, e.hor, e.stars, e.moon, Math.min(1, e.hemi[2] / 1.8));
  SKIN_FILL.k = skinFill(e); for (const m of SKIN_FILL.mats) m.emissiveIntensity = SKIN_FILL.k;
}

/* ---------- state and controls ---------- */
const state = { x: 0, z: 0, yaw: 0, pitch: 0, started: false };
let EYE = 1.32; const FX = { shake: 0, roll: 0, bob: 0, tilt: 0 };   /* EYE: a child's eye height; FX: camera shake and sway */
const isTouch = touchFirst();   /* engine/device.js: also an iPad in desktop mode and touch tablets */
const keys = new Set(); let busy = false, fading = false, frozen = false, talkWith = null, near = null;
const PANELS = ['dialogue', 'journal', 'chapters', 'credits', 'card'];
const panelsOpen = () => PANELS.some((id) => !$(id).hidden);
addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase(); if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k) && state.started) e.preventDefault();
  keys.add(k); if (!state.started) return;
  if (k === 'escape') { if (!$('dialogue').hidden) { leaveTalk(); return; } closeJournal(); closeChapters(); closeCredits(); if (!$('card').hidden && CARD.dismiss) CARD.dismiss(); }
  useInteractionKey(e, () => { if (!$('dialogue').hidden && !$('next').hidden) { $('next').click(); return; } if (!busy && !frozen && near) { activate(near); return; } return false; });
});
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
const stick = { id: null, x0: 0, y0: 0, dx: 0, dy: 0 }, look = { id: null, x: 0, y: 0, moved: 0 };
releaseOnBlur(keys, [stick, look]);
canvas.addEventListener('pointerdown', (e) => {
  if (busy || frozen) return;
  if (e.pointerType === 'touch' && e.clientX < innerWidth / 2 && stick.id === null) { stick.id = e.pointerId; stick.x0 = e.clientX; stick.y0 = e.clientY; stick.dx = stick.dy = 0; }
  else { look.id = e.pointerId; look.x = e.clientX; look.y = e.clientY; look.moved = 0; }
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerId === stick.id) { stick.dx = Math.max(-1, Math.min(1, (e.clientX - stick.x0) / 50)); stick.dy = Math.max(-1, Math.min(1, (e.clientY - stick.y0) / 50)); }
  else if (e.pointerId === look.id) { const dx = e.clientX - look.x, dy = e.clientY - look.y; look.x = e.clientX; look.y = e.clientY; look.moved += Math.abs(dx) + Math.abs(dy); state.yaw -= dx * 0.005; state.pitch = Math.max(-1.2, Math.min(1.2, state.pitch - dy * 0.004)); }
});
const endPointer = (e) => { if (e.pointerId === stick.id) { stick.id = null; stick.dx = stick.dy = 0; } if (e.pointerId === look.id) { if (look.moved < 8) { const p = tapPerson(e.clientX, e.clientY); if (p) startTalk(p); } look.id = null; } };
canvas.addEventListener('pointerup', endPointer); canvas.addEventListener('pointercancel', endPointer);
function stickUI() {
  const el = $('stick'); if (!isTouch || !state.started || busy || frozen || DIR.on) { el.hidden = true; return; }
  el.hidden = false; const rest = stick.id === null; el.classList.toggle('rest', rest); el.style.left = (rest ? 84 : stick.x0) + 'px'; el.style.top = (rest ? innerHeight - 150 : stick.y0) + 'px'; $('nub').style.transform = `translate(calc(-50% + ${stick.dx * 30}px), calc(-50% + ${stick.dy * 30}px))`;
}

/* ---------- people: a dozen bodies, recoloured per person; places are built when a chapter needs them ---------- */
const BASES = {}, basePromises = {};
function loadBase(id) { return BASES[id] ? Promise.resolve(BASES[id]) : (basePromises[id] = basePromises[id] || model(id).then((g) => { g.scene.traverse((o) => { if (o.isSkinnedMesh) o.frustumCulled = false; }); BASES[id] = g; return g; })); }
const PROPS = { suitcase: () => suitcase(), basket: () => { const h = hamper(0xb08a48); return h; }, hamper: () => hamper(), lantern: () => lantern(), bucket: () => bucket(), guitar: () => guitar(), banjo: () => banjo() };
/* how each thing is carried (see hold() in props.js): handleY is the height of its handle, out is how far the hand's item sits from the body. After changing these run ?test=held. */
const SIT_HIPS = 0.12;   /* metres from the seat to the hip joint of a seated person at full size (the audit checks it) */
/* scale: the item's size. lift: how far (radians) the arm is held out from the body, so the item clears the hip, thigh and skirt. The handle height comes from each prop (userData.handleY). */
let GRIP = { hamper: { handleY: 0.52, scale: 0.5, lift: 0.56 }, suitcase: { handleY: 0.5, scale: 0.8, lift: 0.4, straighten: 0.8, yaw: Math.PI / 2 }, lantern: { handleY: 0.32, scale: 0.85, lift: 0.26 }, bucket: { handleY: 0.49, scale: 0.9, lift: 0.34 }, basket: { dy: 0.12, scale: 0.62 } };   /* a smaller basket, so the hand that steadies it (CarryHeadIdle) rests at its rim, not in it */
/* Walk pace. The engine measures a clip's stride from its joints (engine/anim.js strideOf) and plays the walk at the speed that fits; for some clips and bodies that
   measure is off by a few per cent, which ?test=walkers shows as feet sliding (WalkM2 and CarryBagWalk by 8 to 13 per cent after the November 2026 clip rebuild).
   STRIDE_K corrects it per body and clip ('base|clip', or 'base|clip|scale' for a child), measured with ?test=walkers&tune (the clip speed at which the feet slide least).
   Every walker uses it: story people (ctl.pace), background life (createAmbient's stride) and the checks. */
const STRIDE_K = { 'man_work|Walk': 0.976, 'man_suit|Walk': 0.976, 'man_shirt|Walk': 0.976, 'man_apron|Walk': 0.976, 'man_elder|Walk': 0.952, 'student2020|Walk': 0.952, 'boy|Walk': 0.952,
  '*|WalkM2': 0.909, '*|CarryBagWalk': 0.816, '*|Run': 0.889, 'man_work|CarryHeadWalk': 0.976 };   /* measured 16 November 2026 */
const strideK = (base, scale, clip) => STRIDE_K[base + '|' + clip + '|' + (scale || 1).toFixed(2)] || STRIDE_K[base + '|' + clip] || STRIDE_K['*|' + clip] || 1;
const kStride = (m, base, clip) => strideOf(m, clip) * strideK(base, m.scale.y, clip.name);
let PACE_FORCE = 0;   /* dev: ?test=walkers&tune plays a walk at this clip speed */
function kPace(m, s, ctl) { const base = s.base; const play0 = ctl.play.bind(ctl); ctl.play = (name, once, hold) => { const was = ctl.cur; play0(name, once, hold); const a = ctl.cur; if (!once && a !== was) { a.time = Math.random() * a.getClip().duration; } };   /* a loop never starts in step with anyone else's (?test=motion: sync) */ ctl.pace = (v, lo = 0.4, hi = 2.2) => { const a = ctl.cur, c = a.getClip(); if (!WALKS.test(c.name)) return 1; if (PACE_FORCE) return (a.timeScale = PACE_FORCE); const st = kStride(m, base, c); if (st > 0.05) a.timeScale = Math.max(lo, Math.min(hi, v * c.duration / st)); return a.timeScale; }; }
const SKIN_LIGHT = 1.55;   /* owner rule 9: build Skin inside Marcus Garvey's range, then lighten it here so faces read in every light (docs/PIPELINE.md, "Skin"). Check with ?test=skin */
/* Phones and computers: each body's pieces are drawn as a few joined meshes by the engine (engine/joinbody.js, through animate()), so this game no longer joins its own. */
function makeBody(s) {
  const m = skClone(BASES[s.bodyId || s.base].scene);
  const offHats = (HATS[s.base] || []).filter((h) => h !== s.hat); if (/^man_(work|shirt|elder|suit)$/.test(s.base) && !(s.hide || []).includes('Waistcoat')) offHats.push('Belt', 'Buckle');   /* a waistcoat covers the belt */   /* a body carries several hats; show the one this person wears (s.hat), or none */
  m.traverse((o) => { if (!o.isMesh) return; o.frustumCulled = false; const mat = o.material, nm = mat.name || '';
    if ((s.hat === 'Wrap' && o.name === 'Bun') || (s.hide && (s.hide.includes(nm) || (nm === 'WaistcoatButtons' && s.hide.includes('Waistcoat')))) || hiddenWith(nm, offHats)) { o.visible = false; return; }
    o.material = mat.clone(); const T = s.tint || {}, t = nm === 'Hair' ? undefined : T[nm] !== undefined ? T[nm] : nm === 'Collar' ? T.Shirt : nm === 'Pocket' && T.Shirt !== undefined ? new THREE.Color(T.Shirt).multiplyScalar(0.9).getHex() : (nm === 'Sash' ? T.Belt : undefined);   /* a collar is the shirt's own cloth unless it is given a colour; a patch pocket is a shade darker than its shirt */   /* hair keeps its own painted colours: they fade into the skin at the hairline */
    if (t !== undefined) { o.material.vertexColors = false; o.material.color.setHex(t); o.material.needsUpdate = true; }
    else if (nm === 'Skin') { o.material.color.setScalar((s.skin || 1) * SKIN_LIGHT); o.material.emissive = new THREE.Color(SKIN_TONE).multiplyScalar(Math.min(1.1, s.skin || 1)); o.material.emissiveIntensity = SKIN_FILL.k; SKIN_FILL.mats.add(o.material); } else if (nm === 'Hair') o.material.color.setScalar(1); });   /* hair keeps its own painted colour (dark, or grey for an elder); only skin is lightened. The hairline fade is a few millimetres wide, so its skin end being slightly darker than the face is not seen */
  m.traverse((o) => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
  m.scale.setScalar(s.scale || 1); m.position.set(s.x, s.ground || 0, s.z); m.rotation.y = s.ry || 0; m.userData.ground = s.ground || 0;
  const seated = isSeated(s.anim);
  if (!seated) { const b = new THREE.Mesh(BLOB_GEO, BLOB_MAT); b.rotation.x = -PI / 2; b.position.y = 0.05; b.renderOrder = 1; m.add(b); }
  const ctl = animate(m, s.anim || 'Idle'); m.userData.anim = ctl; kPace(m, s, ctl);
  m.userData.held = []; ctl.mx.update(0);   /* pose the body once, so the grips below are measured on the real hand */
  if (seated) m.userData.noGround = true;   /* a seated body is placed on its seat, so the per-frame foot grounding must leave it alone */
  if (s.seat !== undefined && seated) { m.userData.seatAnchor={top:s.seat}; m.updateMatrixWorld(true); const hb = m.getObjectByName('mixamorigHips'); if (hb) { m.position.y += s.seat + SIT_HIPS * (s.scale || 1) - hb.getWorldPosition(new THREE.Vector3()).y;
      m.updateMatrixWorld(true); const soles = ['LeftToeBase', 'RightToeBase'].map((n) => m.getObjectByName('mixamorig' + n)).filter(Boolean).map((b) => b.getWorldPosition(new THREE.Vector3()).y - 0.04 * (s.scale || 1)), under = (s.ground || 0) - Math.min(...soles);
      if (soles.length && under > 0.005) m.position.y += Math.min(0.1, under); } }   /* sit on the seat (its top is s.seat): the hip joint rides 12 cm above it, whatever the body's size */
  const carry = (bone, o, G) => { if (/Hand$/.test(bone)) grip(m, bone.replace('Hand', ''), o, { handleY: o.userData.handleY || G.handleY, scale: G.scale, yaw: G.yaw || 0, lift: Math.max(0.4, G.lift || 0), straighten: G.straighten ?? 0.8 }); else { hold(m, bone, o, G); if (bone === 'Head') steadyLoad(m, o); } };   /* a hand steadies a load on the head (engine/grip.js) */   /* in a hand: a real grip (engine/grip.js); on the head: balanced there */
  for (const [bone, prop] of s.props || []) { const o = PROPS[prop](); if (o.userData.instrument) { strap(m, o); continue; } carry(bone, o, GRIP[prop]); m.userData.held.push({ obj: o, bone, label: prop }); if (o.userData.flame) s._flame = o.userData.flame; }
  if (s.lamp) { const o = lantern(); carry('RightHand', o, GRIP.lantern); m.userData.held.push({ obj: o, bone: 'RightHand', label: 'lamp' }); s._flame = o.userData.flame; }
  if (!seated && !s.noSpread) spreadArms(m, /^(woman|girl|guide)/.test(s.base) ? 0.15 : s.base === 'man_suit' ? 0.11 : 0.05);   /* arms hang clear of skirts and jackets (engine/grip.js) */
  const load = s.life && s.life.load; if (load) { const o = load === 'crate' ? crate(0.42, 0x8a6a42) : load === 'basket' ? hamper(0x9a7a48) : bananaBunch(0.9); o.userData.noBatch = true;   /* a load carried by a background worker (engine/ambient.js shows and hides it with spec.show) */
    if (load === 'crate') between(m, o, 'CarryIdle', 0.17); else if (load === 'basket') { hold(m, 'Head', o, GRIP.basket); steadyLoad(m, o); } else { const w = new THREE.Group(); o.rotation.z = PI / 2; o.position.y = 0.06; w.add(o); hold(m, 'Head', w, { dy: 0.1, scale: 1 }); }
    s.load = o; o.visible = false; s.life.show = (n, on) => { if (n.load) n.load.visible = on; }; }
  return m;
}
/* an instrument held across the body: its body at the strumming (right) hand, the neck toward the left hand, the face to the front. Measured on the posed body. */
function strap(m, item) {
  m.updateMatrixWorld(true); const L = m.getObjectByName('mixamorigLeftHand'), R = m.getObjectByName('mixamorigRightHand'), sp = m.getObjectByName('mixamorigSpine1') || m; if (!L || !R) return;
  const l = L.getWorldPosition(new THREE.Vector3()), r = R.getWorldPosition(new THREE.Vector3()), fw = new THREE.Vector3(0, 0, 1).applyQuaternion(m.getWorldQuaternion(new THREE.Quaternion())); fw.y = 0; fw.normalize();
  const x = l.clone().sub(r); x.addScaledVector(fw, -x.dot(fw)).normalize(); const y = fw.clone().cross(x).normalize(), z = x.clone().cross(y).normalize();
  item.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z)); item.position.copy(r).addScaledVector(x, 0.06).addScaledVector(fw, -0.05); item.scale.setScalar(m.scale.x); item.updateMatrixWorld(true); sp.attach(item);
}
/* a box held in front in both hands (the Carry clips): put it between the hands of that clip's pose, a little below them */
function between(m, item, clip, drop = 0.1) {
  const c = m.userData.anim, a = c && c.get(clip); if (!a) return; c.base.setEffectiveWeight(0); a.reset().play(); c.mx.update(0); m.updateMatrixWorld(true);
  const l = m.getObjectByName('mixamorigLeftHand').getWorldPosition(new THREE.Vector3()), r = m.getObjectByName('mixamorigRightHand').getWorldPosition(new THREE.Vector3()), sp = m.getObjectByName('mixamorigSpine') || m;
  item.position.copy(l).add(r).multiplyScalar(0.5); item.position.y -= drop; item.rotation.set(0, m.rotation.y, 0); item.scale.setScalar(m.scale.x); item.updateMatrixWorld(true); sp.attach(item);
  a.stop(); c.base.setEffectiveWeight(1); c.mx.update(0);
}
const BLOB_GEO = new THREE.PlaneGeometry(1.0, 1.0), BLOB_MAT = new THREE.MeshBasicMaterial({ map: (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 2, 32, 32, 31); g.addColorStop(0, 'rgba(0,0,0,0.5)'); g.addColorStop(0.6, 'rgba(0,0,0,0.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); return t; })(), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
const PL = {}; let cur = null;
setEnv(ENV.morning);
const BUILD = { road: buildRoad, station45: buildStation45, ride45: buildRide45, hill: buildHill, kingston57: buildKingston57, coach: buildCoach, beach: buildBeach, crash: buildCrash, memorial: buildMemorial };
let modelsReady = false; const placeLoading = {};
function buildPlace(id) {   /* the geometry only: quick, and enough for a title backdrop. People come later (populate). */
  if (PL[id]) return PL[id]; const P = BUILD[id](); P.group.visible = false; scene.add(P.group); P.actions = []; P.bodies = []; P.npcs = []; P.specs = { people: P.people, extras: P.extras }; P.people = []; P.extras = []; P.populated = false; PL[id] = P; P.keepOut = []; if (DECOR[id]) DECOR[id](P.group, P); declutter(P); if (__DEV__) P.snap = snapMeshes(P.group); if (!P.group.userData.noBatch) P.batch = batchStatic(P.group);
  P.group.traverse((o) => { if (o.isMesh && !o.isInstancedMesh && !Array.isArray(o.material) && !o.material.transparent && !(o.material.alphaTest > 0)) { o.castShadow = o.receiveShadow = true; } else if (o.isMesh && Array.isArray(o.material)) { o.castShadow = o.receiveShadow = true; } });
  if (ACTIONS_FOR[id]) P.actions = ACTIONS_FOR[id](P); return P;
}
/* declutter: a stone, a tree, a hut or a piece of luggage scattered for detail (userData.decor, or a stone in a rock field) that cuts into something else is taken out,
   so no two solid things stand inside each other (the audit's overlap check, engine/audit.js). The later of two scattered things goes; built things always stay. */
const SOLIDG = new Set(['BoxGeometry', 'CylinderGeometry', 'SphereGeometry', 'LatheGeometry', 'DodecahedronGeometry', 'CapsuleGeometry', 'ExtrudeGeometry']);
function declutter(P) {
  const g = P.group, L = [], v = new THREE.Vector3(), m4 = new THREE.Matrix4(); let order = 0; g.updateMatrixWorld(true);
  const unitOf = (o) => { for (let a = o; a && a !== g; a = a.parent) if (a.userData.decor) return a; return null; }, topOf = (o) => { let t = o; while (t.parent && t.parent !== g) t = t.parent; return t; };
  g.traverse((o) => { if (!o.isMesh || o.isSkinnedMesh || !SOLIDG.has(o.geometry.type) || [].concat(o.material)[0].isMeshBasicMaterial) return; for (let a = o; a && a !== g; a = a.parent) if (a.visible === false) return;
    if (o.isInstancedMesh) { const rem = !!o.userData.decorInst; if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); for (let k = 0; k < o.count; k++) { o.getMatrixAt(k, m4); L.push({ b: o.geometry.boundingBox.clone().applyMatrix4(m4.premultiply(o.matrixWorld)), im: rem ? o : null, k, top: o.uuid + '#' + k, rem, order: order++ }); } return; }   /* a stone in a rock field can go; a drawn copy of anything else (sleepers, trunks) stays */
    const b = new THREE.Box3().setFromObject(o), sz = b.getSize(v); if (sz.x > 40 || sz.z > 40 || Math.min(sz.x, sz.y, sz.z) < 0.05) return; const u = unitOf(o); L.push({ b, unit: u, top: topOf(o).uuid, loose: o.parent === g, rem: !!u, order: order++ }); });
  const cell = new Map(), key = (x, z) => ((x | 0) + 5000) * 20000 + ((z | 0) + 5000);
  L.forEach((e, i) => { for (let x = Math.floor(e.b.min.x / 2); x <= Math.floor(e.b.max.x / 2); x++) for (let z = Math.floor(e.b.min.z / 2); z <= Math.floor(e.b.max.z / 2); z++) { const k = key(x, z); (cell.get(k) || cell.set(k, []).get(k)).push(i); } });
  const gone = new Set(), dead = (e) => gone.has(e.unit || e.top), seen = new Set();
  for (const [, l] of cell) for (let a = 0; a < l.length; a++) for (let c = a + 1; c < l.length; c++) { const A = L[l[a]], B = L[l[c]]; if (A.top === B.top || (A.loose && B.loose) || (!A.rem && !B.rem) || (A.unit && A.unit === B.unit) || dead(A) || dead(B)) continue;
    const pk = Math.min(l[a], l[c]) + ':' + Math.max(l[a], l[c]); if (seen.has(pk)) continue; seen.add(pk); const ib = A.b.clone().intersect(B.b); if (ib.isEmpty()) continue; ib.getSize(v); if (v.x < 0.03 || v.y < 0.03 || v.z < 0.03) continue;
    const X = !A.rem ? B : !B.rem ? A : (A.order > B.order ? A : B); gone.add(X.unit || X.top); }
  for (const e of L) if (e.unit && gone.has(e.unit) && e.unit.parent) e.unit.parent.remove(e.unit);
  const ims = new Set(L.filter((e) => e.im && gone.has(e.top)).map((e) => e.im));
  for (const im of ims) { let w = 0; const col = im.instanceColor; for (let k = 0; k < im.count; k++) { if (gone.has(im.uuid + '#' + k)) continue; if (w !== k) { im.getMatrixAt(k, m4); im.setMatrixAt(w, m4); if (col) { const c = new THREE.Color(); im.getColorAt(k, c); im.setColorAt(w, c); } } w++; } im.count = w; im.instanceMatrix.needsUpdate = true; if (col) col.needsUpdate = true; }
  return gone.size;
}
/* spreadOut: nobody stands inside anybody. Background figures that are too close to someone are moved to a free spot nearby (a walker's whole loop moves with them);
   a figure that cannot be placed, or a walk that would pass through someone standing still, is dropped. The audit (?test=audit) then checks the result. */
function spreadOut(P) {
  const r = rng(77), seated = (e) => isSeated(e.anim), loop = (e) => { if (!e.path) return [[e.x, e.z]]; const pts = []; for (let i = 0; i < e.path.length; i++) { const a = e.path[i], b = e.path[(i + 1) % e.path.length], k = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.5)); for (let j = 0; j < k; j++) pts.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]); } return pts; };
  const fixed = [], paths = []; for (const p of P.specs.people) { if (p.path) loop(p).forEach((q) => paths.push([q[0], q[1], 0.7])); else fixed.push([p.x, p.z, seated(p) ? 0.4 : 0.7]); } for (const k of P.keepOut || []) fixed.push(k);
  const b = P.bounds, inWall = (x, z) => P.walls.some((w) => x > w[0] - 0.3 && x < w[2] + 0.3 && z > w[1] - 0.3 && z < w[3] + 0.3), keep = [];
  const free = (pts, walker) => (!walker||!routeIssues('crowd',pts,P.walls,.22).length)&&pts.every(([x, z]) => !inWall(x, z) && fixed.every((f) => Math.hypot(f[0] - x, f[1] - z) >= (f[2] < 0.6 ? Math.min(f[2] + 0.2, 0.72) : 0.72)) && (walker || paths.every((f) => Math.hypot(f[0] - x, f[1] - z) >= 0.72)) && Math.hypot(x - P.start.x, z - P.start.z) > 1.4);
  for (const e of P.specs.extras) {
    if (e.ground > 0 || seated(e) || e.noSpread) { keep.push(e); fixed.push([e.x, e.z, 0.5]); continue; }
    let ok = free(loop(e), !!e.path), tries = 0; const x0 = e.x, z0 = e.z, path0 = e.path ? e.path.map((p) => [p[0], p[1]]) : null;
    while (!ok && tries++ < 40) { const dx = (r() - 0.5) * 2 * (1 + tries * 0.12), dz = (r() - 0.5) * 2 * (1 + tries * 0.12); e.x = Math.max(b.x0, Math.min(b.x1, x0 + dx)); e.z = Math.max(b.z0, Math.min(b.z1, z0 + dz)); if (path0) e.path = path0.map((p) => [p[0] + (e.x - x0), p[1] + (e.z - z0)]); ok = free(loop(e), !!e.path); }
    if (!ok && e.path) { e.path = null; e.walker = false; e.x = x0; e.z = z0; ok = free([[e.x, e.z]], false); }   /* a walk that cannot be made safe becomes a person standing still */
    if (ok) { keep.push(e); if (e.path) loop(e).forEach((q) => paths.push([q[0], q[1], 0.7])); else fixed.push([e.x, e.z, 0.7]); }
  }
  P.specs.extras = keep;
}
function ensurePlace(id) {   /* the place with its people: loads the bodies it needs */
  const P = buildPlace(id); if (P.populated) return Promise.resolve(P); if (placeLoading[id]) return placeLoading[id];
  return (placeLoading[id] = (async () => {
    P.specs.extras = P.specs.extras.filter((e) => Math.hypot(e.x - P.start.x, e.z - P.start.z) > 2.6 || e.seated);
    spreadOut(P); lifeFor(P);   /* life.js: what each background person does (engine/ambient.js) */
    /* engine/faces.js: no two copies of one body with the same face come within 4 m of each other, measured over everywhere each one walks. A girl with too many
       girls about becomes a smaller girl (the same clothes, the smaller body); a wanderer with no face left stays and watches (life.js settle) */
    spreadBodies(P.specs.extras, (b) => FACE_VARIANTS[b] || 0, { near: 4, fixed: P.specs.people, alts: (e) => (/^girl/.test(e.base) && !e.props ? ['girl', 'girl_small'] : null), rebase: (e, b, was) => { e.scale = (e.scale || KID[was]) * KID[b] / KID[was]; }, settle: (e) => settle(P, e) });
    if (__DEV__ && /[?&]faces/.test(location.search)) console.log('FACES ' + P.id + ' ' + [...P.specs.people, ...P.specs.extras].filter((e) => new RegExp(new URLSearchParams(location.search).get('faces') || '.').test(e.base)).map((e) => `${e.id || e.name || ''}:${e.base}${e.variant || ''}${e.props ? '+props' : ''} ${e.life ? e.life.kind : ''}[${reachOf(e).map((v) => v.toFixed(0))}]`).join(' | '));   /* ?faces=woman57 : who got which face, and the box each one stays in */
    for (const e of P.specs.extras) e.bodyId = e.base + (e.variant || '') + '_lo'; for (const e of P.specs.people) e.bodyId = e.base;   /* people you talk to get the full body; background figures get a light copy */
    const bases = new Set([...P.specs.people, ...P.specs.extras].map((s) => s.bodyId)); await Promise.all([...bases].map(loadBase));
    const mk = (s, talk) => { const n = Object.assign(s, { talked: false, heard: 0, hx: s.x, hz: s.z, ry0: s.ry || 0, walking: false, wait: 1 + Math.random() * 2, i: 0, extra: !talk }); n.m = makeBody(s); n.m.visible = false; P.group.add(n.m); n.ctl = n.m.userData.anim; P.bodies.push(n.m); P.npcs.push(n); return n; };
    P.specs.extras.forEach((e, i) => { e.id = e.id || e.base + '#' + i; });   /* every background person has a name of their own in the checks' reports */
    P.people = P.specs.people.map((s) => mk(s, true)); P.extras = P.specs.extras.map((s) => mk(s, false)); P.people.forEach(addMark);
    makeLife(P); meetPeople(P);
    if (P.group.visible) for (const n of P.npcs) n.m.visible = !n.hidden;
    P.populated = true; delete placeLoading[id]; return P;
  })());
}
/* background life (engine/ambient.js): one system per place. It moves, turns, animates and grounds the people it owns; npcTick and the loops in update() leave them alone. */
const MOOD = (st) => (st >= 60 && st < 66 ? 'sad' : st >= 66 && st < 70 ? 'sad' : st >= 70 ? 'calm' : st >= 50 && st < 60 ? 'calm' : 'lively');
const blockedIn = (P) => (x, z, r = 0.22) => (P.keepOut || []).some((k) => Math.hypot(k[0] - x, k[1] - z) < k[2] + r * 0.3);
function makeLife(P) {
  P.keep = placeKeep(P);
  P.life = createAmbient({ stride: (n, name) => { const c = n.ctl || n.m.userData.anim, a = c && c.get(name); return a ? kStride(n.m, n.base, a.getClip()) : 0; }, walls: P.walls, bounds: P.lifeBounds || P.bounds, blocked: blockedIn(P), keepOff: () => P.keep, seed: P.id.length * 7 + 3, phone: isTouch, cull: 75, mood: MOOD(stage) });
  offPaths(P);
  for (const n of P.npcs) if (n.life) { P.life.add(n, n.life); n.m.userData.amb = true; }
  P.life.ready();
}
/* the story's ways through a place, which background people keep clear: from the start to everything any step in this place needs (round walls), and a space round each of those things.
   One list for the whole place, so nobody is standing in a way that a later step opens. A story person who is also background life (Lloyd) is not a destination here. */
function placeKeep(P) {
  if (P.ride) return []; const out = [], pts = [];
  for (const [k, st] of Object.entries(STEPS)) { if (placeOfStage(+k) !== P.id || !st.needs) continue;
    for (const kind of ['talk', 'do', 'go']) for (const e of st.needs[kind] || []) { const id = typeof e === 'string' ? e : e.id, at = st.at && st.at[id]; if (P.people.some((n) => n.id === id && n.life)) continue;
      const acts = (P.actions || []).filter((x) => x.need === id), pp = P.people.find((n) => n.id === id), list = at ? [at] : acts.length ? acts.map((x) => [x.x, x.z]) : pp ? [[pp.x, pp.z]] : []; for (const p of list) if (p && !pts.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.4)) pts.push(p); } }
  for (const n of P.people) if (n.path && n.path.length > 1) out.push({ pts: [...n.path, n.path[0]], w: 0.45 });   /* someone who walks up and down (the guard) */
  for (const p of pts) { out.push({ at: p, r: 1.0 }); const r = walkRoute([P.start.x, P.start.z], p, P.walls, 0.3, P.bounds); out.push({ pts: [[P.start.x, P.start.z], ...(r.length ? r : [p])], w: 0.5 }); }
  return out;
}
/* move anyone whose spot is on one of those ways to a free spot close by (a chat group moves together) */
function offPaths(P) {
  const B = P.lifeBounds || P.bounds, K = P.keep, all = P.npcs, blocked = blockedIn(P);
  const okAt = (x, z, self) => x > B.x0 + 0.3 && x < B.x1 - 0.3 && z > B.z0 + 0.3 && z < B.z1 - 0.3 && !inWallR(P.walls, x, z, 0.32) && !blocked(x, z, 0.3) && !onKeepOff(K, x, z, 0.3) && all.every((o) => self.includes(o) || Math.hypot(o.x - x, o.z - z) > 0.78);
  const groups = new Map(); for (const n of all) if (n.life && !isSeated(n.anim) && n.life.kind !== 'sit') { const g = n.life.kind === 'chat' ? 'c:' + n.life.group : n.id; (groups.get(g) || groups.set(g, []).get(g)).push(n); }
  for (const ms of groups.values()) {
    const ends = (n) => (n.life.kind === 'errand' ? [n.life.from, n.life.to] : n.life.between ? n.life.between : []).filter(Boolean);
    const bad = (dx, dz) => ms.some((n) => !okAt(n.x + dx, n.z + dz, ms) || ends(n).some((e) => !okAt(e[0] + dx, e[1] + dz, ms)));
    if (!bad(0, 0)) continue; let done = false;
    for (let r = 0.4; r <= 5 && !done; r += 0.35) for (let k = 0; k < 16 && !done; k++) { const a = k / 16 * PI * 2 + r, dx = Math.cos(a) * r, dz = Math.sin(a) * r; if (bad(dx, dz)) continue; done = true;
      for (const n of ms) { n.x += dx; n.z += dz; n.hx = n.x; n.hz = n.z; n.m.position.x = n.x; n.m.position.z = n.z; for (const e of ends(n)) { e[0] += dx; e[1] += dz; } } }
  }
}
const KEEPC = {};
const P_ = () => PL[cur];   /* the place you are in */
const byId = (id) => { for (const k of Object.keys(PL)) { const n = PL[k].people.find((p) => p.id === id); if (n) return n; } return null; };
const allPeople = () => Object.values(PL).flatMap((P) => P.people);
function enterPlace(id, { keepPos = false, env } = {}) {
  cur = id; const P = PL[id];
  for (const k of Object.keys(PL)) { const Q = PL[k]; Q.group.visible = k === id; for (const n of Q.npcs) { if (n.mark) n.mark.visible = false; n.m.visible = k === id && !n.hidden; } }
  setEnv(env || P.env); near = null; smoke.clear(); P.group.rotation.set(0, 0, 0);
  if (!keepPos) { state.x = P.start.x; state.z = P.start.z; state.yaw = P.start.yaw; state.pitch = 0; }
  EYE = P.eye || 1.32; FX.roll = 0; FX.tilt = 0; stick.id = null; stick.dx = stick.dy = 0; sitting = false;
}
const smoke = makeSmoke(scene); const birds = makeBirds(scene, 7);
function clampPos(x, z) {
  const P = P_(), b = P.bounds; x = Math.max(b.x0, Math.min(b.x1, x)); z = Math.max(b.z0, Math.min(b.z1, z));
  const inB = (px, pz) => px >= b.x0 && px <= b.x1 && pz >= b.z0 && pz <= b.z1;
  for (const [x0, z0, x1, z1] of P.walls) if (x > x0 && x < x1 && z > z0 && z < z1) { const c = [[x0, z, x - x0], [x1, z, x1 - x], [x, z0, z - z0], [x, z1, z1 - z]].filter((q) => inB(q[0], q[1])).sort((p, q) => p[2] - q[2])[0]; if (c) { x = c[0]; z = c[1]; } }   /* out of a wall by its nearest side that is still inside the place (a wall at the edge never pushes you off the map: ?test=all map) */
  for (const n of P.people) { if (!n.m || !n.m.visible || n.m.userData.sits || isFollowing(n)) continue; const d = Math.hypot(x - n.x, z - n.z); if (d < 0.5) {   /* someone who comes with you never blocks you: they step aside (engine/follow.js) */ x = n.x + (x - n.x) / (d || 1) * 0.5; z = n.z + (z - n.z) / (d || 1) * 0.5; } }
  x = Math.max(b.x0, Math.min(b.x1, x)); z = Math.max(b.z0, Math.min(b.z1, z));
  return [x, z];
}
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function tapPerson(cx, cy) {
  if (!cur || busy || frozen) return null; ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  for (const n of P_().people) if (n.m && n.m.visible && Math.hypot(state.x - n.x, state.z - n.z) < 6 && ray.intersectObject(n.m, true).length > 0) return n; return null;
}
const faceTo = (m, want, dt, k = 5) => { let e = want - m.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); const lim = dt * 3.0; m.rotation.y += Math.max(-lim, Math.min(lim, e * Math.min(1, dt * k))); };   /* eased, and never faster than about 170 degrees a second (a person turns, not spins: ?test=motion) */
const walkSpeed = (m, v = 1.1) => v * Math.sqrt(m.scale.y);   /* a small child has shorter legs: it walks slower than a grown-up, with quicker steps */
/* what engine/follow.js needs each frame: where you are, what is solid (the place's walls and furniture, and the luggage and other things in P.keepOut), who else is about, and the camera (a follower who is left far behind reappears out of view) */
const inWallR = (W, x, z, r) => W.some((w) => x > w[0] - r && x < w[2] + r && z > w[1] - r && z < w[3] + r);
function followWorld() { const P = P_(), b = P.bounds; return { px: state.x, pz: state.z, blocked: (x, z, r = 0.22) => x < b.x0 + r || x > b.x1 - r || z < b.z0 + r || z > b.z1 - r || inWallR(P.walls, x, z, r * 0.8) || (P.keepOut || []).some((k) => Math.hypot(k[0] - x, k[1] - z) < k[2] + r * 0.3), walls: P.walls, bounds: b, others: P.npcs.filter((o) => o.m && o.m.visible), talking: talkWith, view: { x: state.x, z: state.z, yaw: state.yaw } }; }
function npcTick(n, dt) {
  const m = n.m; if (!m || !m.visible) return; if (POSTER) { m.rotation.y = n.ry0; return; }
  if (n.amb) return;   /* engine/ambient.js moves this person */
  if ((n.react || n.call) && talkWith !== n) { n.reactT = (n.reactT ?? 4 + Math.random() * 6) - dt; if (n.reactT <= 0 && n.ctl.cur === n.ctl.base) { n.ctl.play(n.call ? 'Yell' : n.react[(Math.random() * n.react.length) | 0], true); n.reactT = (n.call ? 9 : 7) + Math.random() * 7; } }   /* a fixed person's odd gesture: the fireman's wave, Sister Louise calling out names */
  const ac = n.ctl, d = Math.hypot(state.x - n.x, state.z - n.z), seated = isSeated(n.anim) || /^(Kneel|Comfort)/.test(n.anim || ''), isNear = !n.extra && !seated && ((d < 3.2 && !DEV_NOSTOP) || talkWith === n);
  if (n.fol) { followTick(n, dt, followWorld()); return; }   /* someone who comes with you (engine/follow.js): behind you and to one side, never in your way; the height belongs to groundFeet */
  if (!n.path) { if (isNear) faceTo(m, Math.atan2(state.x - n.x, state.z - n.z), dt); else if (!n.extra) faceTo(m, n.ry0, dt, 2); return; }
  if (isNear || n.wait > 0) { if (n.walking) { n.walking = false; ac.play(null); } if (isNear) faceTo(m, Math.atan2(state.x - n.x, state.z - n.z), dt); else { n.wait -= dt; if (n.wait <= 0) { n.walking = true; ac.play(n.sex === 'm' && !/^boy/.test(n.base) ? 'WalkM2' : 'Walk'); } } return; }
  if (!n.walking) { n.walking = true; ac.play(n.sex === 'm' && !/^boy/.test(n.base) ? 'WalkM2' : 'Walk'); }
  const to = n.path[(n.i + 1) % n.path.length], dx = to[0] - n.x, dz = to[1] - n.z, dist = Math.hypot(dx, dz), v = walkSpeed(m), sp = v * dt; faceTo(m, Math.atan2(dx, dz), dt); ac.pace(v);   /* the steps keep time with the ground, whatever the size of the body */
  if (dist <= sp) { n.x = to[0]; n.z = to[1]; n.i = (n.i + 1) % n.path.length; n.wait = 2 + Math.random() * 3; n.walking = false; ac.play(null); } else { [n.x, n.z] = slideWalls([n.x, n.z], [n.x + dx / dist * sp, n.z + dz / dist * sp], PL[cur].walls, .22); }
  m.position.x = n.x; m.position.z = n.z;   /* the height belongs to groundFeet: setting it here made walkers jump up and down every other frame */
}

/* ---------- a glowing speech mark over each person, and a bubble on the nearest ---------- */
const BUBBLE = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 8, 64, 64, 62); g.addColorStop(0, 'rgba(255,190,70,0.9)'); g.addColorStop(0.35, 'rgba(255,180,60,0.45)'); g.addColorStop(1, 'rgba(255,170,50,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); x.fillStyle = '#f6c45c'; x.strokeStyle = 'rgba(70,45,10,0.85)'; x.lineWidth = 3; x.beginPath(); x.arc(64, 64, 15, 0, PI * 2); x.fill(); x.stroke(); x.fillStyle = '#fff3d0'; x.beginPath(); x.arc(59, 59, 5, 0, PI * 2); x.fill(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
const TALK_SVG = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12c0 4-4 7-9 7-1.2 0-2.4-.2-3.4-.5L3 20l1.5-4.2C3.6 14.7 3 13.4 3 12c0-4 4-7 9-7s9 3 9 7z"/><circle cx="8" cy="12" r=".6" fill="currentColor"/><circle cx="12" cy="12" r=".6" fill="currentColor"/><circle cx="16" cy="12" r=".6" fill="currentColor"/></svg>';
const TB = { el: null, v: new THREE.Vector3() };
function addMark(n) { n.mark = new THREE.Sprite(new THREE.SpriteMaterial({ map: BUBBLE, transparent: true, depthWrite: false, depthTest: true, fog: false })); n.mark.renderOrder = 5; n.mark.visible = false; scene.add(n.mark); }
const headTop = (n) => { const y = n.m ? realHeadTop(n.m) : null; return y !== null ? y : (n.m.userData.ground || 0) + (n.h || 1.8) - 0.03; };   /* the real top of the head or hat (engine/marks.js), or the old guess */
const POSTER = __DEV__ && /[?&]shot=poster/.test(location.search); let DEV_NOSTOP = false;   /* the menu poster is rendered from this view with no marks or bubbles */
function bubbleTick(now) {
  const show = state.started && !busy && !frozen && $('card').hidden && !POSTER && !DIR.on && !sitting;
  for (const n of P_() ? P_().people : []) { const m = n.mark; if (!m) continue; if (!show || !n.m || !n.m.visible) { m.visible = false; continue; } const d = Math.hypot(state.x - n.x, state.z - n.z), k = (0.4 + d * 0.035) * (1 + Math.sin(now * 2 + n.x) * 0.1);
    m.position.set(n.x, markAt(headTop(n), k) + Math.sin(now * 2.4 + n.x) * 0.03, n.z); m.scale.set(k, k, k); m.material.opacity = Math.max(0.6, 1 - d / 20); m.visible = near !== n && d < 40; }
  if (!TB.el) { TB.el = document.createElement('button'); TB.el.className = 'tbub'; TB.el.hidden = true; document.body.appendChild(TB.el); TB.el.addEventListener('click', (e) => { e.stopPropagation(); if (near && !near.go && !busy) activate(near); }); }
  const on = show && near && !near.go; TB.el.hidden = !on; if (!on) return;
  TB.v.set(near.x, headTop(near) + NEAR_GAP, near.z).project(camera); if (TB.v.z > 1) { TB.el.hidden = true; return; }
  const r = canvas.getBoundingClientRect(); TB.el.style.left = (r.left + (TB.v.x + 1) / 2 * r.width) + 'px'; TB.el.style.top = (r.top + (1 - TB.v.y) / 2 * r.height) + 'px';
  if (TB.el.dataset.label !== near.who) { TB.el.dataset.label = near.who; TB.el.innerHTML = TALK_SVG + '<span class="who">' + near.who + '</span>'; TB.el.setAttribute('aria-label', near.label); }
}

/* ---------- interface: toast, the journal, cards, the cinematic layer ---------- */
let toastTimer = 0, EP = 0;   /* EP: the "epoch": starting a chapter bumps it, so timed scenes from an earlier chapter stop themselves */
const TOASTQ = [];   /* toasts that came while someone was talking: they wait until the dialogue box closes */
function toast(msg, ms = 2600) { if (!$('dialogue').hidden) { if (!TOASTQ.some((q) => q[0] === msg)) TOASTQ.push([msg, ms]); return; } const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; if (TOASTQ.length && $('dialogue').hidden) toast(...TOASTQ.shift()); }, ms); }
function flushToasts() { if (TOASTQ.length && $('dialogue').hidden && $('toast').hidden) toast(...TOASTQ.shift()); }
const unlocked = [], story = {}, ctr = {};   /* story: what you chose. ctr: counters for the stage you are in (bunches carried, brakes checked...) */
let fresh = 0;   /* journal pages found since the journal was last opened: the button glows and shows how many */
function showCount() { const b = $('jbtn'), c = $('jcount'); c.textContent = fresh; c.hidden = !fresh; b.classList.toggle('glow', fresh > 0); b.setAttribute('aria-label', fresh ? 'Journal, ' + fresh + ' new page' + (fresh > 1 ? 's' : '') : 'Journal'); }
function unlock(id, quiet) { if (unlocked.includes(id)) return; unlocked.push(id); if (!quiet) fresh++; showCount(); saveGame(); if (!quiet) { SFX.chime(); toast('New journal page: ' + JOURNAL.find((p) => p.id === id).title, 3200); } }
const CHOICE_NAMES = { road: { help: 'You thought the railway would help people.', worry: 'You worried it might take Mass Dudley\'s work.', ask: 'You were not sure yet.' }, beach: { splash: 'At the beach you splashed in the sea.', castle: 'At the beach you built a sandcastle.', band: 'At the beach you listened to the mento band.' }, why: { safe: 'You said we remember Kendal so people stay safe.', honour: 'You said we remember Kendal to honour those who died.', thank: 'You said we remember Kendal to thank the helpers.' } };
function refreshJourney() { const p = JOURNAL.find((q) => q.id === 'journey'); const lines = [story.road, story.beach, story.why].map((v, i) => (v ? CHOICE_NAMES[['road', 'beach', 'why'][i]][v] : null)).filter(Boolean); p.simple = lines.length ? ['You finished the story.', ...lines] : ['You finished the story.']; }
function renderJournal(sel) {
  refreshJourney(); const tabs = $('jtabs'); tabs.replaceChildren(); const open = sel || unlocked[unlocked.length - 1];
  JOURNAL.filter((p) => unlocked.includes(p.id)).forEach((p) => { const b = document.createElement('button'); b.className = 'tab' + (p.id === open ? ' on' : ''); b.textContent = p.title; b.onclick = () => renderJournal(p.id); tabs.appendChild(b); });
  const left = JOURNAL.length - unlocked.length; if (left > 0) { const m = document.createElement('button'); m.className = 'tab'; m.disabled = true; m.textContent = left + ' more to find'; tabs.appendChild(m); }
  const page = $('jpage'); page.replaceChildren(); const p = JOURNAL.find((q) => q.id === open);
  if (!p) { const e = document.createElement('p'); e.textContent = 'Your journal is empty. Talk to people to fill it.'; page.appendChild(e); return; }
  const h = document.createElement('h3'); h.textContent = p.title; page.appendChild(h); for (const t of p.simple) { const e = document.createElement('p'); e.textContent = t; page.appendChild(e); }
  const d = document.createElement('details'); const s = document.createElement('summary'); s.textContent = 'Dig deeper'; d.appendChild(s); for (const t of p.deeper) { const e = document.createElement('p'); e.textContent = t; d.appendChild(e); } page.appendChild(d);
}
function openJournal(sel) { if (busy && $('journal').hidden && !$('title').hidden) return; if (!$('journal').hidden) return; fresh = 0; showCount(); busy = true; keys.clear(); renderJournal(typeof sel === 'string' ? sel : undefined); $('journal').hidden = false; $('jclose').focus(); }
function closeJournal() { if ($('journal').hidden) return; $('journal').hidden = true; busy = panelsOpen(); }
$('jbtn').onclick = () => openJournal(); $('jclose').onclick = closeJournal;
const MENU = { ok: true, url: '../../../menu/' };   /* Always available on the game collection, even if a menu fetch would fail. */
function toMenu() { saveGame(); location.href = MENU.url; }

const CARD = { dismiss: null };
function card(title, paras, btns, { col = false, dismiss } = {}) {
  $('ctitle').textContent = title; const b = $('cbody'); b.replaceChildren(); for (const t of paras) { const p = document.createElement('p'); p.textContent = t; b.appendChild(p); }
  const bb = $('cbtns'); bb.replaceChildren(); bb.classList.toggle('col', col); btns.forEach((x, i) => { const el = document.createElement('button'); el.className = 'btn' + (i ? ' ghost' : ''); el.textContent = x.t; el.onclick = x.go; bb.appendChild(el); });
  CARD.dismiss = dismiss === undefined ? null : dismiss; $('card').hidden = false; busy = true; keys.clear(); $('talk').hidden = true; const f = bb.querySelector('button'); if (f) f.focus();
}
function hideCard() { $('card').hidden = true; CARD.dismiss = null; busy = panelsOpen(); }
function chapterFade(title, sub, fn) {   /* fade to a black title card, change the scene while it is dark, fade back */
  if (QUICK) { fn(); return; } if (fading) return; fading = true; const f = $('fade'); $('fadeT').textContent = title; $('fadeS').textContent = sub; $('card').hidden = true; $('dialogue').hidden = true;
  playChapterFade(f, fn, () => { fading = false; }, [800, 3200, 3700, 4600]);
}
function fadeBlack(on, ms = 900) { const f = $('fade'); f.style.transition = 'opacity ' + (QUICK ? 0 : ms) + 'ms ease'; if (on) { f.hidden = false; $('fadeT').textContent = ''; $('fadeS').textContent = ''; f.classList.remove('txt'); requestAnimationFrame(() => f.classList.add('on')); } else { f.classList.remove('on'); setTimeout(() => { f.hidden = true; f.style.transition = ''; }, QUICK ? 0 : ms + 50); } }
const bars = (on) => document.body.classList.toggle('cine', on);
let subTimer = 0;
function say(text, ms = 3800) { const el = $('sub'); el.textContent = text; el.classList.toggle('dim', !text); document.body.classList.toggle('subbing', !!text); clearTimeout(subTimer); subTimer = setTimeout(() => { el.classList.add('dim'); document.body.classList.remove('subbing'); }, Math.max(500, ms * TS)); }
function flash(op, ms = 0, color = '#fff') { const f = $('flash'); f.style.background = color; f.style.transition = 'opacity ' + (QUICK ? 0 : ms) + 'ms ease-out'; f.style.opacity = sceneIsCalm() && color !== '#000' ? 0 : op; }
const wait = (ms) => new Promise((r) => setTimeout(r, ms * TS));
async function run(steps) { const ep = EP; for (const [ms, fn] of steps) { await wait(ms); if (ep !== EP) return false; fn(); } return true; }   /* timed steps: [wait in ms, then do this]. Stops if the chapter changes. */

/* ---------- the camera director: a move from one view to another, for cutscenes ---------- */
const DIR = { on: false, t: 0, dur: 1, a: null, b: null, la: null, lb: null, resolve: null }, _v = new THREE.Vector3();
function cut(a, b, la, lb, dur, onEnd) { return new Promise((res) => { Object.assign(DIR, { on: true, t: 0, dur: Math.max(0.05, dur * TS), a: new THREE.Vector3(...a), b: new THREE.Vector3(...b), la: new THREE.Vector3(...la), lb: new THREE.Vector3(...lb), resolve: res }); }); }
function endCut() { DIR.on = false; const resolve = DIR.resolve; DIR.resolve = null; resolve?.(false); }
let sitting = false;

/* ---------- goal, hint, sound ---------- */
let stage = 0, best = 0, goalText = '', goalTimer = 0, hintTimer = 0;
function showGoal(withControls) { const el = $('goal'); if (el.textContent !== goalText && state.started) uiSound('goal'); el.textContent = goalText; el.classList.remove('folded'); el.setAttribute('aria-expanded', 'true'); clearTimeout(goalTimer); /* Keep the next task visible until the player completes it. */ if (withControls) showHint(); }
function showHint() { $('hint').hidden = false; clearTimeout(hintTimer); hintTimer = setTimeout(() => { $('hint').hidden = true; }, 6000); }
function refreshGoal(quiet) { goalText = STORY.goal() || ''; if (quiet) { $('goal').textContent = goalText; return; } showGoal(true); }
$('goal').onclick = () => showGoal(true);
function showSound() { const b = $('snd'); b.setAttribute('aria-pressed', AU.on ? 'true' : 'false'); b.setAttribute('aria-label', AU.on ? 'Sound on. Tap to turn off.' : 'Sound off. Tap to turn on.'); $('sndon').style.display = AU.on ? '' : 'none'; $('sndoff').style.display = AU.on ? 'none' : ''; }
$('snd').onclick = () => { setSound(!AU.on); showSound(); }; showSound();

/* ---------- saving: kept in this browser only ---------- */
const SAVE_KEY = 'kendal-save-v1'; let hasSave = false, erasing = false, savedFlow = null;   /* savedFlow: how far into the saved step you were (engine/story.js save) */
function saveGame() { if (erasing) return; try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 1, unlocked, stage, best, story, fresh, flow: STORY.save(), talked: allPeople().filter((p) => p.talked).map((p) => p.id) })); } catch (e) { /* storage may be blocked; the game still plays */ } }
function loadGame() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; } }
function applySave(d) {
  if (!d || !Array.isArray(d.unlocked)) return; for (const id of d.unlocked) if (JOURNAL.some((p) => p.id === id) && !unlocked.includes(id)) unlocked.push(id);
  if (d.story && typeof d.story === 'object') Object.assign(story, d.story); stage = Number.isFinite(d.stage) && d.stage in STEPS ? d.stage : 0; best = Number.isFinite(d.best) ? Math.max(d.best, stage) : stage; fresh = Number.isInteger(d.fresh) ? d.fresh : 0; savedFlow = d.flow && d.flow.stage === stage ? d.flow : null; hasSave = unlocked.length > 1 || stage > 0 || best > 0;
}
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && state.started) saveGame(); });

/* ---------- talking: one line at a time; "You" lines get their own colour; the x, Escape or a tap outside ends it ---------- */
let step = 0, lines = [], talkN = 0, talkFull = false, convoEnd = null, convoForced = false;   /* convoForced: a conversation that finishes something you already did (carrying the last bucket), so closing it early must not undo that */
const ALIAS = () => ({ abel: stage === 33 ? 'abel2' : 'abel', gran5: stage === 42 ? 'granCoach' : 'gran5', lloyd5: stage === 42 ? 'lloydCoach' : 'lloyd5', gran6: stage === 66 ? 'gran66' : 'gran6', clive: stage === 66 ? 'clive2' : 'clive' });   /* the same person, a different conversation in a later step */
const wantsTalk = (n) => !n.extra && !!STORY.marked(n.id);   /* only the step's story people move the story (engine/story.js) */
function activate(t) { if (t.go) t.go(); else startTalk(t); }
function startTalk(n) {
  if (busy || frozen) return; const id = ALIAS()[n.id] || n.id, r = STORY.talk(n.id) || { kind: 'flavour', line: null };
  talkFull = r.kind === 'story';
  if (talkFull || (r.kind === 'meet' && TALK[id])) lines = [...TALK[id](story)];   /* a story talk, or a flavour person's one full talk (meet) */
  else { const later = r.line ? [r.line] : (LATER[id] || LATER[n.id] || (() => ['...']))(flavourArg()); const l = r.line || later[n.heard++ % later.length]; lines = [{ who: n.who, text: typeof l === 'string' ? l : l.text }]; }
  convoForced = false; if (n.amb) P_().life.hold(n, true); openConvo(lines, null, n);
}
function convo(ls, onEnd, who) { if (busy && !$('card').hidden) hideCard(); talkFull = false; convoForced = true; openConvo([...ls], onEnd, who || null); }
function openConvo(ls, onEnd, n) { document.body.classList.add('talking'); busy = true; talkWith = n || null; lines = ls; convoEnd = onEnd; keys.clear(); step = 0; uiSound('tap'); $('dialogue').hidden = false; $('talk').hidden = true; $('hint').hidden = true; $('toast').hidden = true; showLine(); }
/* the speaker's gestures: men and women their own talk clips, seated men TalkM3 and others SitTalk; anyone holding something, kneeling, sitting on the ground or held in a pair keeps their pose */
const KEEP_POSE = /^(Kneel|Comfort|PlayPiano|PlayGuitar|Sad|Cry|Hurt|CarryHead)/;
function gestureFor(n) { const a = n.anim || 'Idle', held = (n.m.userData.held || []).length;
  if (isSeated(a)) return n.sex === 'm' && !/^(boy|girl)/.test(n.base) && CL.TalkM3 ? 'TalkM3' : 'SitTalk'; if (KEEP_POSE.test(a) || held) return null;
  const L = n.sex === 'm' && !/^(boy|girl)/.test(n.base) ? ['TalkM1', 'TalkM2', 'Talk2'] : ['Talk1', 'Talk2', 'Talk3']; return L[talkN++ % L.length]; }
function showLine() {
  const s = lines[step], me = s.who === 'You' || !!s.choices; if (s.unlock) unlock(s.unlock); if (s.give === 'lamp') { story.lamp = true; saveGame(); toast('Mass Ezra gives you his lamp.'); updateLamp(); }
  $('who').textContent = s.who; $('line').textContent = s.text; $('dialogue').classList.toggle('me', me);
  const box = $('choices'); box.replaceChildren(); $('next').hidden = !!s.choices;
  if (s.choices) { s.choices.forEach((c) => { const b = document.createElement('button'); b.className = 'btn ghost'; b.textContent = c.t; b.onclick = () => choose(s, c); box.appendChild(b); }); box.firstChild.focus(); } else $('next').focus();
  const ac = talkWith && talkWith.ctl; if (ac) { const g = me ? null : gestureFor(talkWith); if (me || !g) { if (ac.cur !== ac.base && !isSeated(talkWith.anim)) ac.play(null); } else if (CL[g] || g === 'SitTalk') ac.play(g); }
}
function choose(s, c) { uiSound('tap'); if (c.set) Object.assign(story, c.set); saveGame(); lines.splice(step + 1, 0, ...(c.then || [])); step++; if (step >= lines.length) endTalk(true); else showLine(); }
function nextLine() { uiSound('tap'); step++; if (step >= lines.length) { endTalk(true); return; } showLine(); }
function endTalk(finished) {
  document.body.classList.remove('talking'); const n = talkWith, cb = convoEnd; talkWith = null; convoEnd = null; $('dialogue').hidden = true; busy = panelsOpen(); if (n && n.ctl) n.ctl.play(null);
  if (n && n.amb && P_() && P_().life) P_().life.hold(n, false);
  const forced = convoForced; convoForced = false;
  if (finished && n && talkFull) { n.talked = true; saveGame(); STORY.done(n.id); } if (cb && (finished || forced)) cb();
  setTimeout(flushToasts, 250);   /* a page found while talking is shown now, not on top of the dialogue box */
}
function leaveTalk() { if (!$('dialogue').hidden) endTalk(false); }
$('next').onclick = nextLine; $('dclose').onclick = leaveTalk; $('talk').onclick = () => { if (near && !busy) activate(near); };

/* ---------- the story (engine/story.js): steps.js says what each step needs; here is where each thing is, what changes when it is done, and the arrow ---------- */
const flavourArg = () => ({ ...story, stage, got: STORY.got });
const OUTRO = {   /* a step whose last task ends in a short conversation or a scene before the next step begins */
  11: (s) => { SFX.snort(); convo(TALK.muleDone(story), () => setStage(s), byId('dudley')); },
  34: (s) => convo(TALK.abel3(story), () => setStage(s), byId('abel')),
  52: () => (CR.choice === 'skip' ? crashSkip() : crashRun()),
  61: (s) => convo(TALK.nurse(story), () => setStage(s), byId('nurse')),
  63: (s) => convo(TALK.louise(story), () => setStage(s), byId('louise')),
};
function storyWhere(id, P = P_()) {   /* where a story person or a thing to do is in this place, or null (not here, or hidden) */
  if (!P) return null; const n = P.people.find((p) => p.id === id); if (n) return n.m && (n.m.visible || !P.group.visible) && !n.hidden ? [n.x, n.z] : null;
  const a = (P.actions || []).filter((x) => x.need === id || x.id === id); if (!a.length) return null; const on = a.filter((x) => x.on()); const L = on.length ? on : a;
  let best = null, bd = Infinity; for (const x of L) { const d = Math.hypot(x.x - state.x, x.z - state.z); if (d < bd) { bd = d; best = [x.x, x.z]; } } return best;
}
const HAND = createCarry({ camera, slot: [-0.34, -0.56, -0.78] });   /* your left hand (the lamp, when you have it, is in your right) */
const rideBucket = bucket(); rideBucket.name = 'the water bucket'; rideBucket.scale.setScalar(0.8);
const STORY = createStory({
  steps: STEPS, where: (id) => storyWhere(id), player: () => [state.x, state.z],
  route: (t, p) => { const P = P_(); if (!P) return t; const r = walkRoute(p, t, P.walls, 0.3, P.bounds); return r.length > 1 ? [r[0][0], r[0][1], false] : t; },   /* round walls, not through them */
  advance: (s) => (OUTRO[stage] ? OUTRO[stage](s) : setStage(s)),
  onGoal: (t) => { goalText = t || ''; if (!syncing && state.started) showGoal(); },
  onArrow: () => { showGoal(); const g = $('goal'); g.classList.remove('nudge'); void g.offsetWidth; g.classList.add('nudge'); },
  flavour: {}, meet: {}, names: {}, items: { bucket: rideBucket, bunch: bananaBunch(1.1) }, near: 2.7,   /* the arrow gives way to the talk button, which shows within 2.6 m */
});
let syncing = false;
function meetPeople(P) {   /* this place's people into the story's tables: their short lines (LATER), the full talk of a flavour person (played once), their names */
  const o = STORY.options; for (const n of P.people) { const id = n.id; o.names[id] = n.who;
    if (!o.flavour[id]) o.flavour[id] = () => (LATER[ALIAS()[id] || id] || LATER[id] || (() => []))(flavourArg());
    if (['lady', 'guard', 'pearl', 'boyRide'].includes(id) && TALK[id] && !o.meet[id]) o.meet[id] = () => TALK[id](story); }
}
function updateLamp() { const on = !!story.lamp && stage >= 40 && stage < 66 && cur !== 'memorial'; handLamp.intensity = on && cur === 'crash' ? 3.6 : 0; lampMesh.visible = on; }   /* Mass Ezra's lamp is in your right hand from the moment he gives it; it is lit at Kendal */
const lampMesh = lantern(); lampMesh.scale.setScalar(1.0); lampMesh.position.set(0.36, -0.42, -0.62); lampMesh.visible = false; camera.add(lampMesh);

/* ---------- chapters, stages and the story machine ---------- */
const CH_PLACE = ['road', 'station45', 'hill', 'kingston57', 'coach', 'crash', 'memorial'], CH_FIRST = [10, 20, 30, 40, 50, 60, 70], DONE = [14, 25, 35, 45, 53, 67, 74];
const PRELOAD = { 1: ['ride45'], 3: ['coach', 'beach'], 4: ['crash'], 5: [] };
/* engine/preload.js: the player is not moving while a panel, a card or the chapter title is up, or on the title screen; heavy loading waits for those moments */
setQuiet(() => !state.started || panelsOpen() || fading);
const usedIn = (i) => (i in CH_PLACE ? [CH_PLACE[i], ...Object.keys(STEPS).map(Number).filter((s) => chapterOf(s) === i).map(placeOfStage)] : []);   /* every place a chapter goes to, the ride and the beach as well */
const PLACES_KEEP = placeKeeper({ places: PL, ensure: ensurePlace, renderer, camera, scene, current: () => cur });   /* engine/preload.js: places readied in quiet moments, places left behind give back their graphics memory, the background load */
function readyNext(i) { PLACES_KEEP.ready([...(PRELOAD[i] || []), ...usedIn(i), ...usedIn(i + 1)]); }   /* the places this chapter and the next go to, built, peopled and compiled before they are needed */
function tidyPlaces(i) { PLACES_KEEP.tidy([...usedIn(i), ...usedIn(i + 1), ...(PRELOAD[i] || [])]); }   /* every other place frees its graphics memory; it stays built and comes back by itself if shown again */
const SAFE = { 23: 22, 23.5: 22, 23.6: 22, 24: 22, 32: 31, 42: 41, 51: 50, 52: 50, 53: 50, 63: 62, 64: 62, 65: 62, 67: 66 };   /* a saved game never resumes in the middle of a scripted scene */
const chapterOf = (s) => Math.max(0, Math.min(6, Math.floor(s / 10) - 1));
const ON = {}, TICKS = [];   /* ON[stage]: what happens when a stage begins. TICKS: per-frame jobs from tween(). */
let hasLoaded = false;
function setStage(s) {
  stage = s; best = Math.max(best, s); for (const k of Object.keys(ctr)) delete ctr[k]; for (const n of allPeople()) n.talked = false; syncing = true; STORY.enter(s); syncing = false; saveGame(); refreshGoal(); if (ON[s]) ON[s]();
  for (const P of Object.values(PL)) if (P.life) P.life.mood(MOOD(s));
  if (!QUICK && s in CHAPTER_END) setTimeout(() => nextCard(CHAPTER_END[s], s), 900);
}
function nextCard(i, s, tries = 0) {
  if (stage !== s) return; if ((panelsOpen() || fading) && tries < 10) { setTimeout(() => nextCard(i, s, tries + 1), 800); return; }
  const nx = CHAPTERS[i + 1]; if (!nx) return; uiSound('goal'); card('Chapter ' + (i + 1) + ' is finished!', ['Well done. Next is ' + nx.name + ' (' + nx.year + ').'], [{ t: 'Next chapter', go: () => { hideCard(); beginChapter(i + 1); } }, { t: 'Stay here', go: hideCard }]);
}
function showPlace(text) { const el = $('place'); el.textContent = text || CHAPTERS[chapterOf(stage)].caption; el.hidden = false; el.style.opacity = 1; clearTimeout(showPlace.t); showPlace.t = setTimeout(() => { el.style.opacity = 0; }, 4500); }
function resetTransient() { endSceneWarning(); hideCrashSkip?.(); hideStorySkip?.(); CR.on = false; HOLD.on = false;   /* leave anything running: scripted scenes, a ride, the crash, the camera director */
  for (const k of Object.keys(PL)) for (const n of PL[k].npcs || []) if (n.fol) stopFollow(n);   /* nobody keeps following you into another chapter */
  EP++; RIDE.on = false; RIDE.v = RIDE.target = 0; endCut(); frozen = false; moveLock = false; bars(false); $('sub').classList.add('dim'); document.body.classList.remove('subbing'); $('holdwrap').hidden = true; flash(0, 0); $('vig').style.opacity = 0; FX.shake = 0; FX.roll = 0; FX.tilt = 0; RING = 0; HUSH = false; CRBEDS = {};
  SFX.mento(false); SFX.setBeds({}, 0.1); TICKS.length = 0; smoke.clear(); if (cur && PL[cur]) PL[cur].group.rotation.set(0, 0, 0); sitting = false; document.body.classList.remove('flashing');
}
let moveLock = false, RING = 0, HUSH = false, CRBEDS = {};
async function beginChapter(i, st) {
  if (fading) return; resetTransient(); st = st || CH_FIRST[i]; const C = CHAPTERS[i]; hideCard(); closeJournal(); closeChapters(); $('dialogue').hidden = true; busy = false; talkWith = null;
  if (!PL[CH_PLACE[i]] || !PL[CH_PLACE[i]].populated) toast('Loading', 4000); await ensurePlace(CH_PLACE[i]); if (i === 3 && st >= 43) await ensurePlace('beach'); for (const id of PRELOAD[i] || []) ensurePlace(id);
  chapterFade(C.title, C.sub, () => startScene(i, st));
}
function startScene(i, st) {
  const ep = EP; const id = CH_PLACE[i]; const P = PL[id];
  if (i === 4) { enterPlace('coach', { env: ENV.dusk }); setRigTheme(P, 'night'); RIDE.on = true; RIDE.v = RIDE.target = 0; RIDE.kind = 'diesel'; P.lamp.intensity = 9; }
  else if (i === 5) { enterPlace('crash'); story.lamp = true; }
  else if (i === 3 && st >= 43) enterPlace('beach', { env: st >= 44 ? ENV.gold : ENV.day });   /* a saved game from the beach resumes on the beach */
  else enterPlace(id);
  state.started = true; setStage(st); updateLamp(); showPlace();
  tidyPlaces(i); readyNext(i);
  if (i === 1) setTimeout(() => { if (ep === EP) { SFX.fanfare(); SFX.stationGong(); } }, 900 * TS);
  if (i === 2) { const late = st >= 33; P.train.visible = late; P.train.position.x = late ? 0 : 90; resetBunches(P); if (st >= 32) { P.bunches.slice(0, 4).forEach((b) => { b.visible = false; }); P.inWagon.forEach((b) => { b.visible = true; }); } }   /* resuming after the train came in */
  if (savedFlow && savedFlow.stage === st) STORY.restore(savedFlow); savedFlow = null;   /* a saved game: the step's progress and what it changed in the scene */
  if (i === 5 && st >= 66) { setEnv(ENV.morning); for (const L of P.lights) L.userData.k = 0.1; P.torches.forEach((t) => { t.visible = false; }); P.flame.visible = false; }   /* resuming after the night */
  if (i === 3) { SFX.mento(false); }
}
function chaptersOpen(i) { return i === 0 || best >= DONE[i - 1]; }
let teacherMode=false;try{teacherMode=localStorage.getItem('kendal-teacher')==='1';}catch{}
function renderChapters() {
  $('chteacher').setAttribute('aria-pressed',String(teacherMode));$('chteacher').textContent='Unlock All';$('chteachernote').hidden=!teacherMode;
  const ul = $('chlist'); ul.replaceChildren();
  CHAPTERS.forEach((c, i) => { const open = teacherMode || chaptersOpen(i), dn = best >= DONE[i], li = document.createElement('li'), b = document.createElement('button'); b.className = 'chbtn' + (dn ? ' done' : ''); b.disabled = !open || !modelsReady;
    for (const [cls, txt] of [['yr', c.year], ['nm', c.name], ['st', !modelsReady ? 'Loading' : dn ? 'Done' : 'Play']]) { const sp = document.createElement('span'); sp.className = cls; sp.textContent = txt; b.appendChild(sp); }
    b.onclick = () => { $('chapters').hidden = true; busy = false; if (!state.started) startGame(true); beginChapter(i); }; li.appendChild(b); ul.appendChild(li); });
  $('chreset').textContent = 'Restart'; $('chreset').dataset.armed = '';
}
function openChapters() { closeJournal(); busy = true; keys.clear(); renderChapters(); $('chapters').hidden = false; const f = $('chlist').querySelector('button:not(:disabled)'); (f || $('chclose')).focus(); }
function closeChapters() { if ($('chapters').hidden) return; $('chapters').hidden = true; busy = panelsOpen(); if (state.started) canvas.focus(); }
$('chteacher').onclick=()=>{teacherMode=!teacherMode;try{localStorage.setItem('kendal-teacher',teacherMode?'1':'0');}catch{}renderChapters();$('chteacher').focus();};
$('chclose').onclick = closeChapters; $('tchap').onclick = openChapters; $('jchap').onclick = openChapters;
function eraseAll() { erasing = true; try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ } location.reload(); }
$('chreset').onclick = () => { if (!confirm('Restart and erase all saved progress?')) return; eraseAll(); };
function openCredits() { if (state.started) { closeJournal(); busy = true; keys.clear(); } $('credits').hidden = false; $('crclose').focus(); }
function closeCredits() { if ($('credits').hidden) return; $('credits').hidden = true; busy = panelsOpen(); }
$('chcred').onclick = () => { closeChapters(); openCredits(); }; $('crclose').onclick = closeCredits;
$('reset').onclick = () => { if (fading || RIDE.on && stage === 53) return; closeJournal(); const i = chapterOf(stage);
  card('Reset', ['Start this chapter again, or start the whole story again.'], [{ t: 'Restart “' + CHAPTERS[i].name + '”', go: () => { hideCard(); beginChapter(i); } }, { t: 'Start the whole story again', go: () => card('Start again?', ['This wipes everything, even your journal.'], [{ t: 'Yes, start again', go: eraseAll }, { t: 'No, keep playing', go: hideCard }]) }, { t: 'Cancel', go: hideCard }]); };

/* ---------- waiting for things, and moving things over time ---------- */
const waitFor = (fn) => new Promise((res) => { const ep = EP, iv = setInterval(() => { if (EP !== ep) { clearInterval(iv); res(false); } else if (fn()) { clearInterval(iv); res(true); } }, 100); });
function tween(sec, fn) { const ep = EP; return new Promise((res) => { let t = 0; const d = Math.max(0.05, sec * TS); TICKS.push((dt) => { if (ep !== EP) { res(false); return true; } t += dt; const k = Math.min(1, t / d); fn(k, dt / d); if (k >= 1) { res(true); return true; } return false; }); }); }
async function transition(id, opts = {}) {   /* fade to black, change place, fade back in */
  const ep = EP; fadeBlack(true, 700); await wait(900); if (ep !== EP) return false; enterPlace(id, opts); if (opts.after) opts.after(); updateLamp(); fadeBlack(false, 900); await wait(500); return ep === EP;
}

/* ---------- trains: rides (scenery scrolls past the windows), smoke, sound ---------- */
const RIDE = { on: false, v: 0, target: 0, accel: 0.6, kind: 'diesel', dist: 0, clackT: 0, chuffT: 0 };
function setRigTheme(P, theme) { if (!P.rig || P.rig.theme === theme) return; const old = P.rig.group; const r = makeRig(theme); r.group.position.copy(old.position); P.group.remove(old); P.group.add(r.group); P.rig = r; }
function rideTick(dt, t) {
  if (!RIDE.on) return; const P = P_(); if (!P || !P.rig) return; const v = (RIDE.v += (RIDE.target - RIDE.v) * Math.min(1, dt * RIDE.accel)); if (Math.abs(RIDE.target - v) < 0.03) RIDE.v = RIDE.target;
  RIDE.dist += v * dt; P.rig.update(dt, v); if (P.wheels) for (const o of P.wheels) o.w.rotation.z -= v * dt / o.r;
  const k = Math.min(1, v / 12); if (!CR.on || CR.phase < 3) { FX.bob = Math.sin(t * 9.3) * 0.004 * k; FX.roll = Math.sin(t * 1.7) * 0.004 * k + Math.sin(t * 5.1) * 0.0025 * k; }
  if (v > 1.5) { RIDE.clackT -= dt; if (RIDE.clackT <= 0) { RIDE.clackT = Math.max(0.3, 11 / v); SFX.clack(v); } }
  if (RIDE.kind === 'steam' && v > 0.5) { RIDE.chuffT -= dt; if (RIDE.chuffT <= 0) { RIDE.chuffT = Math.max(0.17, 0.95 / (v + 1)); SFX.chuff(0.16); } }
}
function smokeTick(dt) {
  const P = P_(); if (P && P.smokers) for (const s of P.smokers) { if (s.needsTrain && !P.train.visible) continue; s.acc = (s.acc || 0) + dt; if (s.acc >= 1 / s.rate) { s.acc = 0; s.obj.getWorldPosition(_v); smoke.emit(_v, new THREE.Vector3(P.ride ? RIDE.v * 0.8 + 0.8 : 0.5, 1.2 + Math.random() * 0.6, (Math.random() - 0.5) * 0.3), { size: 0.7, grow: 3.4, life: 3.4, opacity: 0.5 }); } }
  smoke.tick(dt);
}

/* ---------- things to do: ACTIONS_FOR[place](P) makes the list of that place. A thing shows as a button when you stand at it. ---------- */
const ACTIONS_FOR = {   /* each thing has an id; `need` is the step need it counts toward (engine/story.js), and on() asks the story whether it is needed now */
  road: (P) => [
    { id: 'mule', need: 'mule', label: 'Load the mule', x: P.spots.mule[0], z: P.spots.mule[1], r: 3.0, on: () => STORY.needs('mule') && !P.loading, go: () => {
      const n = STORY.got.mule || 0; const item = P.goods[n]; P.loading = true; toast(P.goodsText[n], 3400); const d = byId('dudley'); if (d && d.ctl && CL.PickUp) d.ctl.play('PickUp', true);   /* Mass Dudley lifts with you */
      loadItem(P, item, n).then((ok) => { P.loading = false; if (ok !== false) STORY.done('mule'); }); } } ],
  station45: (P) => [
    { id: 'engine', need: 'engine', label: 'Look at the engine', x: P.spots.engine[0], z: P.spots.engine[1], r: 3.4, on: () => STORY.needs('engine'), go: () => { unlock('projector'); card('The Projector', ['This steam engine was built in Manchester, England, in 1844.', 'Boiling water makes steam. The steam pushes pistons, and the pistons turn the big wheels.', 'She can pull a whole train at up to 30 miles an hour. That is very fast for 1845!'], [{ t: 'Good!', go: () => { hideCard(); STORY.done('engine'); } }]); } },
    { id: 'board', need: 'board', label: 'Climb aboard', x: P.spots.board[0], z: P.spots.board[1], r: 3.2, on: () => STORY.needs('board'), go: () => STORY.done('board') } ],
  ride45: (P) => [{ id: 'water', need: 'water', label: 'Pass the water bucket', x: P.spots.water[0], z: P.spots.water[1], r: 2.6, on: () => STORY.needs('water') && !RIDE45.busy, go: () => passBucket(P) }],
  hill: (P) => [
    { id: 'pile', need: 'bunch', label: 'Pick up a bunch of bananas', x: P.spots.pile[0], z: P.spots.pile[1], r: 2.8, on: () => STORY.needs('bunch') && !HAND.holding(), go: () => { const b = P.bunches.find((q) => q.parent === P.pile); if (!b) return; HAND.carry(b, { slot: [0.05, -0.62, -0.7], yaw: 0.4 }); b.rotation.z = 0.25; stepSound('grass'); toast('You lift a heavy bunch. Now to the wagon.'); } },
    { id: 'wagon', need: 'bunch', label: 'Put the bunch in the wagon', x: P.spots.wagon[0], z: P.spots.wagon[1], r: 2.8, on: () => STORY.needs('bunch') && !!HAND.holding(), go: () => { const n = STORY.got.bunch || 0, w = P.inWagon[n], b = HAND.holding(); HAND.place(b, { parent: P.group, at: [w.position.x, w.position.y, w.position.z], ry: w.rotation.y }); b.rotation.set(0, w.rotation.y, PI / 2); uiSound('goal'); STORY.done('bunch'); } },
    ...P.spots.brakes.map((b, i) => ({ id: 'b' + i, need: 'b' + i, label: 'Check the brake', x: b[0], z: b[1], r: 2.3, on: () => STORY.needs('b' + i), go: () => { uiSound('goal'); toast(['The tender brake is tight. Good.', 'The carriage brake handle holds. Good.', 'The wagon brake block is firm. Good.'][i]); STORY.done('b' + i); } })) ],
  kingston57: (P) => [{ id: 'board57', need: 'board57', label: 'Climb aboard the last coach', x: P.spots.board[0], z: P.spots.board[1], r: 3.2, on: () => STORY.needs('board57'), go: () => STORY.done('board57') }],
  coach: (P) => [
    ...P.spots.windows.map((w, i) => ({ id: 'w' + i, need: 'w' + i, label: 'Look out of the window', x: w[0], z: w[1], r: 1.6, on: () => STORY.needs('w' + i), go: () => { state.yaw = w[2] > 0 ? PI : 0; state.pitch = 0; say(i === 0 ? 'A little station slips by. A lamp, a bell, a dog barking.' : 'Stars over the dark hills. Somewhere, a lamp in a window.', 4200); STORY.done('w' + i); } })),
    { id: 'seat', need: 'seat', label: 'Sit down with Gran', x: P.spots.seat[0], z: P.spots.seat[1], r: 1.5, on: () => STORY.needs('seat') && !CR.on, go: () => { sitting = true; crashIntro(); } } ],
  beach: (P) => {
    const done = () => { P.done = P.done || {}; return P.done; }, fun = (k) => { done()[k] = true; story.beachDone = Object.keys(done()).filter((id) => done()[id] === true); uiSound('goal'); story.beach = story.beach || k; STORY.done('fun'); saveGame(); };
    return [
      { id: 'sea', need: 'fun', label: 'Splash in the sea', x: P.spots.sea[0], z: P.spots.sea[1], r: 2.6, on: () => STORY.needs('fun') && !done().splash, go: () => { stepSound('water'); setTimeout(() => stepSound('water'), 300); splash(P); toast('Splash! The water is warm.'); fun('splash'); } },
      { id: 'castle', need: 'fun', label: 'Build a sandcastle', x: P.spots.castle[0], z: P.spots.castle[1], r: 2.6, on: () => STORY.needs('fun') && !done().castle, go: () => { ctr.cp = (ctr.cp || 0) + 1; const m = P.castle.userData.mound; m.scale.setScalar(0.01 + ctr.cp / 3); uiSound('tap'); toast(ctr.cp < 3 ? 'Pat the sand... ' + ctr.cp + ' of 3' : 'A sandcastle!'); if (ctr.cp >= 3) { done().castle = true; fun('castle'); } } },
      { id: 'band', need: 'fun', label: 'Listen to the band', x: P.spots.band[0], z: P.spots.band[1], r: 3.4, on: () => STORY.needs('fun') && !done().band, go: () => { unlock('mento'); sitting = true; state.yaw = Math.atan2(-(14.2 - state.x), -(3.6 - state.z)); state.pitch = -0.05; toast('A mento band! Banjo, guitar and a rumba box.'); fun('band'); } } ];   /* you sit down on the sand to listen */
  },
  crash: (P) => [
    { id: 'fill', need: 'water', label: 'Fill a bucket at the pipe', x: P.spots.pipe[0], z: P.spots.pipe[1], r: 2.4, on: () => STORY.needs('water') && !HAND.holding(), go: () => { const b = P.buckets.find((q) => !q.userData.given); if (!b) return; HAND.carry(b, { yaw: 0.3 }); stepSound('water'); toast('The bucket is full. Take it to the nurse.'); } },
    { id: 'give', need: 'water', label: 'Give the water to the nurse', x: P.spots.nurse[0], z: P.spots.nurse[1], r: 2.6, on: () => STORY.needs('water') && !!HAND.holding(), go: () => { const b = HAND.holding(), k = STORY.got.water || 0; b.userData.given = true; HAND.place(b, { parent: P.group, at: [-3.75 + k * 0.42, 0, 9.55 + k * 0.1], ry: k }); uiSound('goal'); if (!k) toast('She gives the man a drink, and thanks you. One more trip.', 3400); STORY.done('water'); } },
    { id: 'calling', need: 'calling', label: 'Take Dawn to the calling place', x: P.spots.calling[0], z: P.spots.calling[1], r: 3.2, on: () => STORY.needs('calling'), go: () => { const d = byId('dawn'); stopFollow(d); d.x = P.spots.calling[0] + 1.2; d.z = P.spots.calling[1] + 0.6; d.m.position.set(d.x, 0, d.z); d.ry0 = Math.atan2(-6.6 - d.x, 13.6 - d.z); STORY.done('calling'); } },
    { id: 'lamp', need: 'lamp', label: 'Hold your lamp up', x: P.spots.lamp[0], z: P.spots.lamp[1], r: 3.4, on: () => STORY.needs('lamp'), go: () => holdLamp() } ],
  memorial: (P) => [
    { id: 'sb', need: 'sb', label: 'Read the storyboard', x: P.spots.board[0], z: P.spots.board[1], r: 2.8, on: () => STORY.needs('sb'), go: () => { card('The storyboard', ['A church excursion train came home from the sea.', 'It ran downhill and left the rails here, near Kendal.', 'Hundreds of people from Kendal came to help.', 'Close to 200 people died.'], [{ t: 'Close', go: () => { hideCard(); STORY.done('sb'); } }]); } },
    { id: 'mn', need: 'mn', label: 'Read the monument', x: P.spots.wall[0], z: P.spots.wall[1], r: 3.0, on: () => STORY.needs('mn'), go: () => { card('The monument', ['Our plaque says: Kendal, 1 September 1957. We remember them.', 'The real monument has the names of 177 people. It also thanks the helpers and remembers the survivors.', 'We do not know the real words, so these are our own.'], [{ t: 'Close', go: () => { hideCard(); STORY.done('mn'); } }]); } },
    { id: 'flower', need: 'flower', label: 'Leave a flower', x: P.spots.flower[0], z: P.spots.flower[1], r: 2.8, on: () => STORY.needs('flower'), go: () => leaveFlower() } ],
};
const RIDE45 = { busy: false };
/* the 1845 water stop: the water boy hands you the bucket, you pass it on to the next passenger along the carriage */
function passBucket(P) {
  const k = STORY.got.water || 0, spot = [[0.5, 0.5], [-1.2, -0.5], [0.5, -0.5]][k % 3]; RIDE45.busy = true; HAND.carry(rideBucket, { yaw: 0.2 }); stepSound('water');
  setTimeout(() => { HAND.place(rideBucket, { parent: P.group, at: [spot[0], 0.17, spot[1]], ry: k }); uiSound('goal'); RIDE45.busy = false; STORY.done('water'); }, 900 * TS);
}
/* a splash in the sea: spray thrown up in front of you */
function splash(P) { const f = new THREE.Vector3(-Math.sin(state.yaw), 0, -Math.cos(state.yaw)); for (let i = 0; i < 14; i++) { const w = new THREE.Vector3(state.x + f.x * 1.4 + (Math.random() - 0.5) * 0.8, 0.05, state.z + f.z * 1.4 + (Math.random() - 0.5) * 0.8); smoke.emit(w, new THREE.Vector3((Math.random() - 0.5) * 1.2, 1.6 + Math.random() * 1.6, (Math.random() - 0.5) * 1.2), { size: 0.25, grow: 0.9, life: 1.1, color: 0xf4fbff, opacity: 0.85 }); } }
/* the visible change for each task (engine/story.js shows). restoring: a saved game puts the scene back as it was. */
function registerShows() {
  STORY.shows('mule', (n, of, restoring) => { if (!restoring) return; const P = PL.road; if (!P) return; for (let i = 0; i < n; i++) { const it = P.goods[i], mu = P.mule; mu.attach(it); it.position.set(...mu.userData.slots[i]); it.rotation.set(0, i * 1.4, 0); it.scale.setScalar(i === 2 ? 0.9 : 0.8); mu.userData.dip = (i + 1) / 3; } });   /* the goods fly onto the mule in loadItem */
  for (const id of ['engine', 'board', 'board57', 'w0', 'w1', 'sb', 'mn', 'calling', 'lamp', 'flower', 'seat']) STORY.shows(id, () => {});   /* each of these changes the scene itself: a card, a ride, the view turning, Dawn going to Sister Louise, the lamp held high, the flower */
  STORY.shows('water', (n, of, restoring) => { if (!restoring || cur !== 'crash') return; const P = PL.crash; for (let i = 0; i < n; i++) { const b = P.buckets[i]; b.userData.given = true; P.group.add(b); b.position.set(-3.75 + i * 0.42, 0, 9.55 + i * 0.1); } });
  STORY.shows('bunch', (n, of, restoring) => { if (!restoring) return; const P = PL.hill; resetBunches(P); for (let i = 0; i < n; i++) { const b = P.bunches[i], w = P.inWagon[i]; P.group.add(b); b.position.copy(w.position); b.rotation.set(0, w.rotation.y, PI / 2); } });
  for (let i = 0; i < 3; i++) STORY.shows('b' + i, (n, of, restoring) => { const L = PL.hill && PL.hill.levers && PL.hill.levers[i]; if (L) { L.userData.handle.rotation.z = n ? -0.9 : 0.5; L.userData.tag.visible = !!n; } });   /* the brake handle is pulled down and a white tag hung on it */
  STORY.shows('fun', () => {});   /* each beach thing shows itself: the splash, the sandcastle, you sitting by the band */
}
function resetBunches(P) { if (!P) return; for (const b of P.bunches) { const h = b.userData.home; if (b === HAND.holding()) HAND.drop(); P.pile.add(b); b.position.copy(h.p); b.rotation.copy(h.r); b.visible = true; } P.inWagon.forEach((b) => { b.visible = false; }); }

/* ---------- chapter 1: carrying a load to the mule. The item flies in an arc to the mule's pack, the mule sinks a little under the weight. ---------- */
function loadItem(P, item, n) {
  const mu = P.mule, slot = mu.userData.slots[n], from = item.position.clone(), to = new THREE.Vector3(...slot); mu.localToWorld(to); P.group.worldToLocal(to); const ep = EP;
  uiSound('tap'); const done = tween(0.9, (k) => { const e = ease(k); item.position.lerpVectors(from, to, e); item.position.y += Math.sin(k * PI) * 1.1; item.rotation.y += 0.04; });
  return done.then((ok) => { if (!ok || ep !== EP) return; mu.attach(item); item.position.set(...slot); item.rotation.set(0, n * 1.4, 0); item.scale.setScalar(n === 2 ? 0.9 : 0.8); mu.userData.dip = (n + 1) / 3; SFX.settle(); setTimeout(() => SFX.snort(), 350 * TS);
    for (let i = 0; i < 5; i++) { const w = new THREE.Vector3(mu.position.x + (Math.random() - 0.5) * 1.4, 0.15, mu.position.z + (Math.random() - 0.5) * 1.0); smoke.emit(w, new THREE.Vector3((Math.random() - 0.5) * 0.4, 0.3, (Math.random() - 0.5) * 0.4), { size: 0.5, grow: 1.4, life: 1.4, color: 0xc9a878, opacity: 0.35 }); } });
}
function resetMule(P) { const mu = P.mule; for (const it of P.goods) { if (it.parent !== P.group) P.group.attach(it); it.position.copy(it.userData.home); it.scale.setScalar(1); } mu.userData.dip = 0; P.loading = false; }

let hideStorySkip;
function storyScene(finish) {
  const done = () => { hideStorySkip?.(); endCut(); bars(false); finish(); };
  hideStorySkip = showCinematicSkip(() => { EP++; say('', 0); done(); });
  return done;
}

/* ---------- chapter 2: the first train ---------- */
ON[23] = async () => {
  await ensurePlace('ride45'); if (!(await transition('ride45', { after: () => { RIDE.on = true; RIDE.v = RIDE.target = 0; RIDE.kind = 'steam'; bars(true); frozen = false; } }))) return;
  const P = P_(); RIDE45.busy = false; if (HAND.holding()) HAND.drop(); rideBucket.visible = false;
  const finish = storyScene(() => {
    RIDE.v = RIDE.target = 0; RIDE45.busy = false; setStage(23.5); resumeFirstTrain();
  });
  if (await run([[200, () => { say('The Governor takes his seat. The whistle blows!', 3200); SFX.whistleSteam(1.0); SFX.hiss(1.4); }], [3200, () => { RIDE.target = 4; say('The train jerks forward. The crowd cheers!', 3400); }], [3600, () => { RIDE.target = 8; say('Slowly at first, past the houses.', 3200); }], [4200, () => { RIDE.target = 10; say('Out across wet, marshy land, on a raised bank.', 3600); }], [5500, () => { RIDE.target = 0; say('At the new bridge over the Rio Cobre, the engine stops for water.', 4200); SFX.hiss(2.0); }]])) finish();
};
async function resumeFirstTrain() {
  if (!(await waitFor(() => stage === 23.6))) return;
  bars(true);
  const finish = storyScene(async () => {
    unlock('first-train');
    if (!(await transition('station45', { after: () => { RIDE.on = false; bars(false); state.x = 8; state.z = 5; state.yaw = 0.3; } }))) return;
    setStage(25);
  });
  if (await run([[300, () => { say('Off again! Spanish Town is not far.', 3200); SFX.whistleSteam(0.7); RIDE.target = 9; }], [4200, () => { RIDE.target = 12; say('Cheers all along the line.', 3000); SFX.fanfare(); }], [5000, () => { RIDE.target = 0; say('Spanish Town, about an hour after leaving Kingston.', 4200); unlock('first-train'); }], [4600, () => { setStage(24); RIDE.target = 18; SFX.whistleSteam(0.6); say('The ride back is fast. About 30 miles an hour!', 4000); }], [4800, () => { RIDE.target = 20; say('Faster than any mule. Faster than any horse.', 3800); }], [4500, () => { RIDE.target = 0; say('Back in Kingston in about forty minutes.', 3600); }]])) finish();
}
ON[21] = () => { /* nothing: the engine card is an action */ };

/* ---------- chapter 3: a train comes up the hill, and the brake check ---------- */
ON[31] = () => resetBunches(PL.hill);
ON[34] = () => { const P = PL.hill; if (P) for (const L of P.levers) { L.userData.handle.rotation.z = 0.5; L.userData.tag.visible = false; } };
ON[32] = async () => {
  const P = P_(); if (cur !== 'hill') return; frozen = true; busy = false; bars(true); say('Listen! A train is coming up the hill.', 3600); const tr = P.train; tr.visible = true; tr.position.x = 100;
  const ep = EP;
  const finish = storyScene(() => { tween.said = tween.s2 = false; tr.position.x = 0; frozen = false; setStage(33); });
  const cam = [3, 1.6, 6.5]; await cut(cam, cam, [60, 2.4, -3], [20, 2.4, -3], 3);
  if (ep !== EP) return; let px = tr.position.x; SFX.whistleSteam(1.2); const ok = await tween(18, (k, dk) => { const e = 1 - Math.pow(1 - k, 2.1); const nx = 100 * (1 - e) - 0.0; const dx = px - nx; px = nx; tr.position.x = Math.max(0, nx); spin(tr, dx); DIR.lb.set(lerp(20, -4, k), 2.4, -3); if (RIDE.on === false && k > 0.3 && !tween.said) { tween.said = true; say('The engine works hard on the steep slope.', 3600); } if (k > 0.8 && !tween.s2) { tween.s2 = true; SFX.hiss(2.6, 0.14); } });
  tween.said = tween.s2 = false; if (!ok) return; tr.position.x = 0; await wait(900); if (ep !== EP) return; say('The fireman waves. The train has arrived.', 3200); SFX.whistleSteam(0.7); await wait(2600); if (ep === EP) finish();
};

/* ---------- chapter 4: the excursion day ---------- */
ON[41] = () => { const P = PL.kingston57; SFX.stationGong(); };
ON[42] = async () => {
  const ep = EP; await ensurePlace('coach'); if (!(await transition('coach', { env: ENV.day, after: () => { const P = P_(); setRigTheme(P, 'plains'); RIDE.on = true; RIDE.v = RIDE.target = 0; RIDE.kind = 'diesel'; P.lamp.intensity = 0.8; } }))) return;
  const P = P_(); bars(true);
  const finish = storyScene(async () => {
    unlock('greenvale');
    const transitionEpoch = EP; await ensurePlace('beach'); if (transitionEpoch !== EP || !(await transition('beach', { env: ENV.day, after: () => { RIDE.on = false; bars(false); } }))) return; story.beach = null; showPlace('Montego Bay, afternoon'); setStage(43);
  });
  const ok = await run([[300, () => { say('The doors close. A whistle blows. Gran squeezes your hand.', 3600); SFX.hornDiesel(1.2); }], [3600, () => { RIDE.target = 8; say('Off we go! The platform slides away.', 3400); }], [3800, () => { RIDE.target = 15; say('Spanish Town, Old Harbour, May Pen. The towns roll by.', 3800); bars(false); }]]);
  if (!ok) return; goalText = 'Enjoy the ride with Gran and Lloyd.'; showGoal();
  if (!(await run([[7000, () => { setRigTheme(P, 'hills'); say('Now the hills. The engines work hard.', 3600); RIDE.target = 9; }], [7000, () => { say('Greenvale, the highest station on the line.', 3600); unlock('greenvale'); }], [6500, () => { setRigTheme(P, 'coast'); RIDE.target = 14; say('Down toward the sea, in the bright afternoon.', 3600); }], [6500, () => { RIDE.target = 4; say('Montego Bay! The sea!', 3200); SFX.hornDiesel(1.0); }]]))) return;
  bars(true); await wait(1600); if (ep === EP) finish();
};
ON[43] = () => { const P = PL.beach; const resuming = savedFlow && savedFlow.stage === 43; if (P) { P.done = {}; P.castle.userData.mound.scale.setScalar(0.01); if (resuming) for (const id of story.beachDone || (story.beach ? [story.beach] : [])) if (['splash', 'castle', 'band'].includes(id)) P.done[id] = true; } if (!resuming) story.beachDone = []; };
ON[44] = () => { if (cur !== 'beach') return; const a = envNow; tween(6, (k) => setEnv(mixEnv(a, ENV.gold, k))); say('The sun is going down over the sea.', 3600); };
ON[45] = () => { /* the chapter's end card comes from setStage */ };

/* ---------- chapter 5: the night train and the crash ---------- */
const CR = { on: false, phase: 0 };
ON[50] = () => { const C = PL.coach; if (C) for (const n of C.npcs) { if (n.amb) C.life.hold(n, false); if (n.ctl && n.ctl.cur !== n.ctl.base) n.ctl.play(null); }   /* calm again after a restart */
  if (cur === 'coach') { const P = P_(); setRigTheme(P, 'night'); RIDE.on = true; RIDE.v = RIDE.target = 0; P.lamp.intensity = 9; setEnv(ENV.dusk); tween(10, (k) => setEnv(mixEnv(ENV.dusk, ENV.night, k))); say('Montego Bay railway station. Evening, and the sky is going dark.', 4200); } };
ON[51] = async () => { SFX.hornDiesel(1.2); say('The train pulls out of Montego Bay. Stars fill the windows.', 4200); RIDE.target = 12; };
ON[52] = () => { if (cur !== 'coach') return; say('The train climbs into the hills, slowly and steadily.', 4200); RIDE.target = 9; };
function crashIntro() {
  if (CR.on) return; sceneWarning(card, { title: 'About half past eleven', lines: ['The next part is loud, and it may be scary.', 'It shows the crash gently. Nobody is hurt on the screen.'], watch: () => { hideCard(); CR.choice = 'run'; STORY.done('seat'); }, read: () => { hideCard(); CR.choice = 'skip'; STORY.done('seat'); } });
}
function crashSkip() { endSceneWarning();
  unlock('crash'); unlock('greenvale'); card('What happened', ['The train climbed to Greenvale, the highest station on the line. Then it ran downhill toward Kendal.', 'Three whistle blasts sounded. The train went faster, and left the rails on a curve.', 'Eight of the twelve coaches were wrecked. The last two coaches stayed on the track.'], [{ t: 'Go on', go: () => { hideCard(); setStage(53); arriveKendal(); } }], { col: true });
}
const HOLD = { on: false, v: 0 };
for (const ev of ['pointerdown', 'pointerup', 'pointerleave', 'pointercancel']) $('hold').addEventListener(ev, (e) => { HOLD.on = ev === 'pointerdown'; $('hold').classList.toggle('on', HOLD.on); e.preventDefault(); });
addEventListener('keydown', (e) => { if ($('holdwrap').hidden) return; if (e.key === ' ' || e.key === 'Enter') HOLD.on = true; }); addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') HOLD.on = false; });
function brace(P) {   /* the coach goes quiet and tense: nobody chats now; Lloyd and some passengers hold on to their seats (SitScared, a gentle seated clip) */
  if (P.life) P.life.mood('sad'); let k = 0; for (const n of P.npcs) { if (!isSeated(n.anim)) continue; const scared = n.id === 'lloyd5' || (n.extra && (k++ % 3 === 0)); if (n.amb) P.life.hold(n, true); if (scared && CL.SitScared) n.ctl.play('SitScared'); else if (n.ctl.cur !== n.ctl.base) n.ctl.play(null); } }
let hideCrashSkip;
async function crashRun() {
  const ep = EP, P = P_(); CR.on = true; CR.phase = 0; unlock('greenvale'); setStage(53); frozen = false; moveLock = false; busy = false; talkWith = null; state.x = 2.6; state.z = 0; state.yaw = PI / 2; state.pitch = 0; bars(true); goalText = ''; $('goal').textContent = ''; $('hint').hidden = true;
  hideCrashSkip = showCinematicSkip(() => {
    resetTransient(); talkWith = null;
    $('fade').classList.remove('on', 'txt'); $('fade').hidden = true;
    crashSkip();
  });
  const live = () => ep === EP && CR.on, lamp = P.lamp;
  const step = async (ms, fn) => { await wait(ms); if (!live()) return false; fn(); return true; };
  SFX.mento(false); say('Greenvale. The highest station on the line.', 3600); RIDE.target = 8; await wait(3600);
  if (!(await step(300, () => { say('The train starts the long way down.', 3400); RIDE.target = 16; CR.phase = 1; })) ) return;
  if (!(await step(3500, () => { say('Lloyd: “We are going so fast!”', 3200); RIDE.target = 22; FX.shake = 0.08; }))) return;
  if (!(await step(3500, () => { say('Gran takes your hand. “Hold on, my dear.”', 3400); RIDE.target = 27; FX.shake = 0.16; CR.phase = 2; moveLock = true; HUSH = true; CRBEDS = { rumble: 0.7, rush: 0.3 }; brace(P); }))) return;
  if (!(await step(3500, () => { say('Three long whistle blasts.', 3600); SFX.threeBlasts(); FX.shake = 0.2; }))) return;
  if (!(await step(3100, () => { say('The brakes scream.', 3000); SFX.screech(3.4); FX.shake = 0.5; CR.phase = 3; flash(0.35, 60, '#ff9a40'); setTimeout(() => flash(0, 220, '#ff9a40'), 90); $('holdwrap').hidden = false; HOLD.v = 0; goalText = 'Hold on!'; showGoal(); }))) return;
  const t0 = performance.now(); let tilt = 0;
  const lurch = tween(4.2, (k, dk) => { const held = HOLD.on ? 1 : 0; HOLD.v = clamp01(HOLD.v + (held ? 0.9 : -0.5) * dk * 4); $('holdbar').firstElementChild.style.width = (HOLD.v * 100) + '%'; FX.shake = 0.5 + k * 0.5 - HOLD.v * 0.25; tilt = ease(k) * 0.16; P.group.rotation.x = sceneIsCalm() ? 0 : tilt; FX.roll = Math.sin(k * 44) * 0.01; lamp.intensity = !sceneIsCalm() && Math.random() < k * 0.7 ? 0.5 : 9; if (Math.random() < 0.12) { flash(0.28, 40, '#ff8a30'); setTimeout(() => flash(0, 160, '#ff8a30'), 60); } RIDE.target = Math.max(0, 27 - k * 14); });
  if (!(await lurch)) return; if (!live()) return;
  $('holdwrap').hidden = true; CR.phase = 4; SFX.crashBang(); flash(1, 0, '#fff'); lamp.intensity = 0; P.group.rotation.x = sceneIsCalm() ? 0 : 0.3; FX.shake = 1.6; RIDE.target = 0; RIDE.v = 6; say('', 100);
  await wait(450); if (!live()) return; flash(1, 0, '#000'); fadeBlack(true, 0); $('flash').style.opacity = 0; FX.shake = 0; RIDE.on = false; CRBEDS = {}; RING = 0.05;
  await wait(2600); if (!live()) return; $('fadeT').textContent = 'Kendal, Manchester'; $('fadeS').textContent = 'Sunday night, 1 September 1957. About half past eleven.'; $('fade').classList.add('txt'); unlock('crash'); unlock('greenvale');
  await wait(5200); if (!live()) return; $('fade').classList.remove('txt'); await wait(900); if (!live()) return; CR.on = false; hideCrashSkip?.(); bars(false); arriveKendal(true);
}
async function arriveKendal(fromCrash) {
  const ep = EP; resetTransient(); EP = ep + 1; const ep2 = EP; await ensurePlace('crash'); story.lamp = true; enterPlace('crash'); state.started = true; updateLamp(); setStage(60); showPlace('Kendal, Manchester. About half past eleven.');
  HUSH = false; RING = 0.05; tween(6, (k) => { RING = 0.05 * (1 - k); });
  fadeBlack(false, fromCrash ? 3500 : 900); bars(!QUICK); say('Slowly, the ringing fades. You hear voices in the dark.', 4200);
  const finish = () => { bars(false); showGoal(true); };
  const hideSkip = !QUICK ? showCinematicSkip(() => {
    EP++; RING = 0; $('fade').hidden = true; say('', 0); finish();
  }) : null;
  await wait(4600); hideSkip?.(); if (ep2 === EP) finish();
}

/* ---------- chapter 6: the long night ---------- */
ON[61] = () => { const P = PL.crash; if (P) for (const b of P.buckets) { if (b === HAND.holding()) HAND.drop(); b.userData.given = false; P.group.add(b); b.position.set(b.userData.home[0], 0, b.userData.home[1]); b.rotation.set(0, b.userData.home[2], 0); b.visible = true; } };
const FOLLOW = { dawn: { gap: 1.3, side: 0.5, space: 0.8 } };   /* Dawn is small: she keeps close, a step behind you and to one side (engine/follow.js) */
ON[63] = () => { const d = byId('dawn'); if (d) { d.ctl.play(null); follow(d, FOLLOW.dawn); } };
async function holdLamp() {
  frozen = true; busy = false; const P = P_(), ep = EP; say('You hold the lamp high.', 2600); const l = handLamp, base = l.intensity; l.intensity = 7; lampMesh.position.y = -0.18; await wait(2800); if (ep !== EP) return;
  say('Helpers carry people up the path, safe in your light.', 3800); await wait(3800); if (ep !== EP) return; l.intensity = base; lampMesh.position.y = -0.42; frozen = false; STORY.done('lamp');
}
ON[65] = async () => {
  const P = P_(), ep = EP; if (cur !== 'crash') return; frozen = true; busy = false; bars(true); goalText = '';
  const finish = storyScene(() => {
    setEnv(ENV.morning); for (const L of P.lights) L.userData.k = 0.3;
    P.torches.forEach((t) => { t.visible = false; }); P.flame.visible = false;
    frozen = false; handLamp.intensity = 0; lampMesh.visible = false; setStage(66);
  }); say('The night is long. The helpers work and work.', 4200);
  await wait(4200); if (ep !== EP) return; say('Slowly, the sky turns from black to blue.', 3800); const a = envNow;
  const t1 = tween(14, (k) => { setEnv(mixEnv(a, ENV.dawn, ease(k))); const f = 1 - 0.7 * k; for (const L of P.lights) L.userData.k = f; handLamp.intensity = 3.6 * (1 - k * 0.8); });
  await wait(4500); if (ep !== EP) return; say('Birds start to sing. It is nearly morning.', 3600); chirp();
  if (!(await t1)) return; say('In the morning light, you see all of it.', 3800);
  const t2 = tween(12, (k) => { setEnv(mixEnv(ENV.dawn, ENV.morning, ease(k))); for (const L of P.lights) L.userData.k = 0.3 * (1 - k); const x0 = state.x, z0 = state.z; }); P.torches.forEach((t) => { t.visible = false; }); P.flame.visible = false;
  const camA = [state.x, EYE, state.z]; await cut(camA, [state.x - 6, 3.2, state.z - 2], [state.x - 8, 1.4, state.z - 10], [-12, 1.2, -9], 8); if (ep !== EP) return;
  await t2; await wait(1200); if (ep === EP) finish();
};
function finishCh6() {
  unlock('cause'); unlock('helpers'); unlock('toll'); unlock('mourning');
  card('The morning after', ['By morning, close to 200 people had died, and about 700 were hurt.', 'Hundreds of people from Kendal and nearby helped through the night.', 'Friday 8 September was a National Day of Mourning. The railway later replaced all its wooden coaches with metal ones.', 'Four new pages are in your journal.'], [{ t: 'Next chapter', go: () => { hideCard(); beginChapter(6); } }, { t: 'Stay here', go: hideCard }], { col: true });
}
ON[67] = finishCh6;

/* ---------- chapter 7: Kendal today ---------- */
ON[70] = () => { setTimeout(() => SFX.churchBell(2), 1200 * TS); };
async function leaveFlower() {
  const P = P_(), ep = EP; frozen = true; const f = flowers(7); f.position.set(P.spots.wall[0] + 1.0, 0, P.spots.wall[1] + 1.0); P.group.add(f); say('You leave a flower. For a moment, everything is quiet.', 4200); SFX.churchBell(2); await wait(4800); if (ep !== EP) return; frozen = false; STORY.done('flower');
}
ON[74] = () => { unlock('remember'); unlock('railend'); unlock('journey'); setTimeout(() => card('The end', ['The Kendal train crash was a very sad day for Jamaica.', 'It was also a day when many people helped.', 'Thank you for remembering. You can read your journey in the Journal.'], [{ t: 'Read your journey', go: () => { hideCard(); openJournal('journey'); } }, { t: 'Chapters', go: () => { hideCard(); openChapters(); } }, ...(MENU.ok ? [{ t: 'Exit', go: toMenu }] : []), { t: 'Stay here', go: hideCard }], { col: true }), 1200 * TS); };

/* ---------- the helper arrow (engine/story.js): 2.5 s after a new goal (5 s when you are looking about), even while you walk, it points at what the step still needs ---------- */
const _nv = new THREE.Vector3();
function nudgeTick(now) {
  const el = $('nudge'); if (!el) return; const quiet = state.started && !busy && !frozen && !DIR.on && !CR.on && $('holdwrap').hidden && $('dialogue').hidden && $('card').hidden && !fading && !POSTER;
  el.hidden = true; if (!GUIDE) GUIDE = createGuide({ scene, camera, eye: () => 1.32 - (sitting ? 0.35 : 0) });
  const a = STORY.tick(now, quiet); if (!a.show) { GUIDE.hide(now); return; }
  GUIDE.point(now, { x: a.x, z: a.z, tx: a.target[0], tz: a.target[1], final: a.final });   /* a gold arrow on the ground points the way, a gold ring marks the place */
}
let GUIDE = null;

/* ---------- sound: each place has its own mix, and now and then one small sound ---------- */
let auNext = 0, onceAt = 6; const AMB = 0.4;   /* the ambient beds are kept low so voices, whistles and the story stay clear */
const SOUNDSCAPE = { road: { wind: 0.07, crowd: 0.01, once: chirp }, station45: { crowd: 0.16, wind: 0.04, once: () => SFX.hiss(1.4, 0.06) }, ride45: { wind: 0.05 }, hill: { wind: 0.12, crowd: 0.02, once: chirp }, kingston57: { crowd: 0.2, wind: 0.03, idle: 0.1, once: () => SFX.stationGong() }, coach: { room: 0.1, crowd: 0.05 }, beach: { sea: 0.24, surf: 0.1, wind: 0.05, crowd: 0.05, once: gullCry }, crash: { cricket: 0.14, crowd: 0.05, wind: 0.03 }, memorial: { wind: 0.06, once: chirp } };
const FOOT = { road: 'grass', station45: 'wood', ride45: 'wood', hill: 'wood', kingston57: 'stone', coach: 'wood', beach: 'sand', crash: 'grass', memorial: 'grass' };
function audioTick(t, now) {
  if (!AU.ctx) return; SFX.mentoTick(t); if (t < auNext) return; auNext = t + 0.1; const S = SOUNDSCAPE[cur] || {};
  SFX.mento(cur === 'beach' && Math.hypot(state.x - 14, state.z - 4) < 24 && stage >= 43 && stage <= 44);
  if (HUSH) { for (const k of ['room', 'crowd', 'wind', 'sea', 'surf']) if (AU.ch[k]) setG(AU.ch[k], 0, 0.2); SFX.setBeds({ ...CRBEDS, ring: RING }, 0.3); return; }
  for (const k of ['room', 'crowd', 'wind', 'sea', 'surf']) if (AU.ch[k]) setG(AU.ch[k], (S[k] || 0) * AMB);
  const v = RIDE.on ? RIDE.v : 0; SFX.setBeds({ rumble: Math.min(0.5, v / 28) * 0.6, rush: Math.min(0.2, v / 70) * 0.5, idle: ((S.idle || 0) + (RIDE.on && RIDE.kind === 'diesel' ? 0.06 : 0)) * 0.6, cricket: (S.cricket || 0) * 0.5, ring: RING });
  if (t > onceAt) { onceAt = t + 6 + Math.random() * 6; if (S.once && AU.on && state.started) S.once(); }
}

/* ---------- loading and starting ---------- */
registerShows(); applySave(loadGame());
{ let done = 0; const total = 3; const tick = () => { done++; $('bar').style.width = (done / total * 100) + '%'; };
  buildPlace('kingston57'); enterPlace('kingston57');   /* the long platform and the train, as a backdrop for the title card */
  const first = CH_PLACE[hasSave && stage >= 10 ? chapterOf(stage) : 0];
  model('anims').then((an) => { loadClips(an); tick(); return ensurePlace(first); }).then(() => { tick(); modelsReady = true; $('start').disabled = false; $('start').textContent = hasSave ? 'Continue' : 'Start'; $('tchap').hidden = false; $('loadnote').textContent = ''; $('savenote').hidden = !hasSave; tick();
    if (__DEV__) devViews(); else setTimeout(backgroundLoad, 2500); }); }
/* every place in the background, one at a time through engine/preload.js work(): the next chapter's places first, then the rest in story order, each in a quiet moment */
function backgroundLoad() { PLACES_KEEP.background(() => { const i = state.started ? chapterOf(stage) : -1; return [...usedIn(i + 1), 'station45', 'hill', 'kingston57', 'ride45', 'coach', 'beach', 'crash', 'memorial']; }, 400); }   /* one place at a time in quiet moments, the next chapter's first (engine/preload.js) */
function startGame(quiet) {
  if (state.started) return; audioInit(); SFX.initBeds(); state.started = true; $('title').hidden = true; $('hud').hidden = false; unlock('you', true); showCount();
  liveHint($('hint'), 'Left thumb walks. Drag to look. Tap a person to talk.', 'W A S D to walk, Shift to hurry. Drag to look. Space or Enter to talk or use.');   /* touch or key words, following what the player uses (engine/device.js) */ showHint(); canvas.focus(); if (!quiet) cue('begin');
}
$('start').onclick = () => { startGame(); const st = stage >= 10 ? (SAFE[stage] || stage) : 10; beginChapter(hasSave && stage >= 10 ? chapterOf(stage) : 0, hasSave && stage >= 10 ? st : 10); setTimeout(backgroundLoad, 4000); };

/* ---------- the frame loop ---------- */
let stepT = 0, frameN = 0;
/* nobody spins: a body turns at most 200 degrees a second standing and 315 walking, whatever moved it (the ambient walk eases a corner at five times the error, which swung a walker round at 600 degrees a second; followers too). ?test=motion checks it. */
function turnLimit(P, dt) {
  for (const n of P.npcs) { const m = n.m; if (!m.visible || m.userData.sits) { n._ry = undefined; continue; } if (n._ry === undefined || !(dt > 0)) { n._ry = m.rotation.y; continue; }
    const c = n.ctl || m.userData.anim, walk = c && c.cur && WALKS.test(c.cur.getClip().name), lim = (walk ? 5.5 : 3.5) * dt; let e = m.rotation.y - n._ry; e = Math.atan2(Math.sin(e), Math.cos(e));
    if (Math.abs(e) > lim) { m.rotation.y = n._ry + Math.sign(e) * lim; if (n.lo) n.lo.rotation.y = m.rotation.y; } n._ry = m.rotation.y; }
}
function update(dt, now) {
  const P = P_(); if (!P) return;
  if (DIR.on) { DIR.t += dt; if (DIR.t >= DIR.dur && DIR.resolve) { const r = DIR.resolve; DIR.resolve = null; r(true); } }
  if (state.started && !busy && !frozen && !DIR.on) {
    if (keys.has('arrowleft')) state.yaw += 1.8 * dt; if (keys.has('arrowright')) state.yaw -= 1.8 * dt;
    if (!moveLock) { let f = stick.id !== null ? -stick.dy : 0, r = stick.id !== null ? stick.dx : 0;
      if (keys.has('w') || keys.has('arrowup')) f += 1; if (keys.has('s') || keys.has('arrowdown')) f -= 1; if (keys.has('d')) r += 1; if (keys.has('a')) r -= 1; const len = Math.hypot(f, r);
      if (len > 0.05) { const sp = (keys.has('shift') ? 3.6 : 2.3) * Math.min(1, len), fx = -Math.sin(state.yaw), fz = -Math.cos(state.yaw); sitting = false;
        [state.x, state.z] = clampPos(state.x + (fx * f - fz * r) / Math.max(1, len) * sp * dt, state.z + (fz * f + fx * r) / Math.max(1, len) * sp * dt); stepT -= dt * sp; if (stepT <= 0) { stepT = 1.35; if (!RIDE.on || RIDE.v < 12) stepSound(FOOT[cur]); } } }
  }
  if ((frameN & 7) === 0) for (const n of P.extras) { if (n.amb) continue; const d = Math.hypot(state.x - n.x, state.z - n.z); n.m.visible = d < 75 && !n.hidden; }
  for (const n of P.npcs) npcTick(n, dt);
  if (P.life && !POSTER) { for (const n of P.people) if (n.amb) P.life.hold(n, !!STORY.isStory(n.id) || talkWith === n);   /* a story person is never background life in their own step */
    P.life.tick(dt, { px: state.x, pz: state.z, story: P.people.filter((n) => STORY.isStory(n.id) && n.m.visible && !n.amb), talking: talkWith, view: { x: state.x, z: state.z, yaw: state.yaw } });
    for (const n of P.people) if (n.amb && n.amb.held && n.m.visible && talkWith !== n) storyLifeTick(n, dt, { px: state.x, pz: state.z, talking: talkWith }, { head: false }); }   /* a background person held still for their own step (Lloyd on the platform) changes stance now and then; the ambient system turns the head */
  near = null; if (state.started && !busy && !frozen && !DIR.on) { let b = 2.6; for (const n of P.people) { const d = Math.hypot(state.x - n.x, state.z - n.z); if (n.m && n.m.visible && d < b) { b = d; near = n; } } for (const a of P.actions) if (a.on() && Math.hypot(state.x - a.x, state.z - a.z) < a.r) near = a; }
  const tb = $('talk'); tb.hidden = !(near && near.go); if (near && near.go) tb.textContent = near.label;
  const SW = { px: state.x, pz: state.z, talking: talkWith };
  for (const n of P.npcs) if (n.m.visible && n.ctl && !n.amb) { n.ctl.mx.update(dt); n.ctl.tick(dt); if (n.m.userData.grips) gripTick(n.m); if (!POSTER) storyLifeTick(n, dt, SW); }   /* storylife.js: a change of stance now and then, and a head that looks about */
  if ((frameN++ & 1) === 0) for (const m of P.bodies) if (m.visible && !m.userData.noGround && !m.userData.amb) groundFeet(m);
  turnLimit(P, dt);
  if (P.tick) P.tick(dt, (now || 0) / 1000); rideTick(dt, (now || 0) / 1000); smokeTick(dt);
  for (let i = TICKS.length - 1; i >= 0; i--) if (TICKS[i](dt)) TICKS.splice(i, 1);
  if (cur === 'road' && STORY.needs('poles') && state.x > 24) STORY.done('poles');   /* you reached the men with the poles */
  if (cur === 'hill' && P.train.visible) { for (const o of P.train.userData.wheels || []) o.w.rotation.z += 0; }
  if (now !== undefined) { audioTick(now / 1000, now); bubbleTick(now / 1000); stickUI(); nudgeTick(now); }
}
let last = performance.now();
function frame(t) {
  requestAnimationFrame(frame); const dt = Math.min(0.05, (t - last) / 1000); last = t; update(dt, t);
  if (DIR.on) { const k = ease(Math.min(1, DIR.t / DIR.dur)); camera.position.lerpVectors(DIR.a, DIR.b, k); _v.lerpVectors(DIR.la, DIR.lb, k); camera.lookAt(_v); }
  else if (!state.started && P_() && P_().titleView) { const tv = P_().titleView, s = t / 1000; camera.position.set(tv.x - Math.sin(s * 0.08) * 3, tv.y, tv.z); camera.rotation.set(tv.pitch, tv.yaw + Math.sin(s * 0.05) * 0.04, 0, 'YXZ'); }
  else { camera.position.set(state.x, EYE - (sitting ? 0.35 : 0) + (sceneIsCalm() ? 0 : FX.bob), state.z); camera.rotation.set(state.pitch, state.yaw, sceneIsCalm() ? 0 : FX.roll + FX.tilt, 'YXZ'); }
  if (!sceneIsCalm() && FX.shake > 0) { const k = FX.shake; camera.position.x += (Math.random() - 0.5) * k * 0.07; camera.position.y += (Math.random() - 0.5) * k * 0.07; camera.position.z += (Math.random() - 0.5) * k * 0.07; camera.rotation.z += (Math.random() - 0.5) * k * 0.035; }
  sun.target.position.set(camera.position.x, 0, camera.position.z); sun.position.copy(sun.target.position).addScaledVector(sunDir, 110); birds.tick(t / 1000, !!(P_() && envNow.stars < 0.3 && !P_().ride && P_().id !== 'crash'), camera.position.x, camera.position.z);
  sky.dome.position.copy(camera.position); sky.stars.position.copy(camera.position); sky.moon.position.set(camera.position.x - 190, camera.position.y + 230, camera.position.z - 380);
  if (__DEV__ && MV) { MV(); return; }
  if (!NORENDER) renderFramed(renderer, scene, camera, document.body.classList.contains('cine'));
}
let MV = null;   /* dev only: the model viewer (?shot=model) draws the picture itself */
const NORENDER = __DEV__ && /[?&]auto=/.test(location.search);   /* the scripted playthrough does not need pictures, and software drawing is slow */
requestAnimationFrame(frame);

/* ---------- the place audit (dev builds): the checks live in engine/audit.js. Run ?test=audit and expect 0 issues in every place. ---------- */
const auditPlace = (P) => { const r = auditPlaceBase(P); for (const n of P.npcs) if (isSeated(n.anim) && n.m.userData.anim) { n.m.userData.anim.mx.update(0.1); if (!n.m.userData.noGround) groundFeet(n.m);   /* the same step the game runs every other frame */
       for (const l of auditSeated(n.id || n.base, n.m, P.snap, n.m.userData.ground || 0, SEATLOG)) r.inside.push(l); }
  r.inside.push(...placeFaces(P.npcs));   /* look-alikes: two people with one body and face within 2.5 m, story people and extras (engine/faces.js) */
  return r; };
const SEATLOG = [];   /* ?test=audit&seats=1 also prints how high each seated person's hips are above the seat */
const auditPlaceBase = (P) => auditPlaceE({ id: P.id, snap: P.snap, npcs: P.npcs.map((n) => ({ id: n.id || n.base, x: n.hx, z: n.hz, anim: n.anim, ground: n.m.userData.ground || 0, path: n.path, with: n.with })), walls: P.walls, bounds: P.bounds, start: P.start,
  actions: P.actions, people: P.people.map((n) => ({ id: n.id, x: n.x, z: n.z, anim: n.anim })) });

/* ?test=all (engine/checks.js): the hooks checktables.js reads the game through */
function checkHooks() {
  const settle = async () => { await waitFor(() => !fading); for (let i = 0; i < 40 && (!$('card').hidden || !$('dialogue').hidden || DIR.on); i++) { hideCard(); leaveTalk(); if (DIR.on) endCut(); await new Promise((r) => setTimeout(r, 60)); } busy = false; for (let i = 0; i < 4; i++) update(1 / 30); };
  const envName = () => Object.keys(ENV).find((k) => ENV[k] === envNow) || null;
  const closeAll = () => { hideCard(); leaveTalk(); closeJournal(); closeChapters(); closeCredits(); busy = false; };
  return {
    ready: async () => { await waitFor(() => modelsReady); startGame(true); for (const id of Object.keys(BUILD)) await ensurePlace(id); },
    settle, closeAll,
    place: () => P_(), cur: () => cur, stage: () => stage, story: () => STORY, where: (id) => storyWhere(id),
    chFirst: (i) => CH_FIRST[i], chPlace: (i) => CH_PLACE[i],
    begin: async (s) => { await beginChapter(chapterOf(s), s); const want = placeOfStage(s); if (cur !== want) { await ensurePlace(want); resetTransient(); enterPlace(want); if (PL[want].ride) { RIDE.on = true; RIDE.kind = want === 'ride45' ? 'steam' : 'diesel'; } setStage(s); } },   /* a step on a ride (the water stop) starts in its own place */
    unlocks: () => unlocked.slice(),
    light: () => { const n = envName(); return n ? { tod: n === 'gold' ? 'dusk' : n } : null; },
    held: () => [HAND.holding() && HAND.holding().name, story.lamp && stage >= 40 && stage < 66 ? 'lamp' : null].filter(Boolean),
    safe: (s) => SAFE[s] || s, restored: () => { const r = RESTORED.on; RESTORED.on = false; return r; },
    save: () => saveGame(), load: () => loadGame(),
    resume: (d) => { resetTransient(); applySave(d); const st = SAFE[stage] || stage; RESTORED.on = true; beginChapter(chapterOf(st), st); },   /* what the start button does with a saved game */
    places: () => Object.keys(BUILD),
    stageOfPlace: (id) => ({ road: 10, station45: 20, ride45: 23.5, hill: 30, kingston57: 40, coach: 50, beach: 43, crash: 60, memorial: 70 })[id],
    move: (a, b) => { let p = a.slice(); const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.05) || 1; for (let i = 1; i <= n; i++) p = clampPos(p[0] + (b[0] - a[0]) / n, p[1] + (b[1] - a[1]) / n); return p; },
    player: () => ({ x: state.x, z: state.z }),
    renderer, scene, camera,
    /* a person standing (Idle) where a story person is, in their clothes and hat, for the face probe: a seated, kneeling or comforting pose bows the head away from the probe's camera */
    faceBody: (n) => { const b = makeBody({ base: n.base, bodyId: n.bodyId, tint: n.tint || {}, skin: n.skin, hat: n.hat, hide: n.hide, scale: n.scale, x: n.x, z: P_().ride ? 0 : n.z, ground: n.m.userData.ground || 0, ry: n.m.rotation.y, anim: 'Idle' }); scene.add(b); b.userData.anim.mx.update(0.3); for (let i = 0; i < 20; i++) groundFeet(b); return b; },
    frame: (dt) => { motionNow += dt * 1000; update(dt, motionNow); renderer.render(scene, camera); },
    autoplay: async () => autoPlay(1, false),
    talkTo: (n) => { state.x = n.x + 1.1; state.z = n.z + 0.4; startTalk(n); }, leaveTalk,
    line: () => (!$('dialogue').hidden ? $('line').textContent : $('sub').classList.contains('dim') ? '' : $('sub').textContent),
    talking: () => !$('dialogue').hidden,
    audio: () => AU, setSound: (on) => { if (AU.on !== on) $('snd').click(); },
    keyMove: async () => { await beginChapter(0, 10); await settle(); const x0 = state.x, z0 = state.z; keys.add('w'); for (let i = 0; i < 20; i++) update(1 / 30); keys.delete('w'); const moved = Math.hypot(state.x - x0, state.z - z0) > 0.3;
      const n = P_().people.find((p) => p.m.visible); let talk; if (n) { state.x = n.x + 1.0; state.z = n.z + 0.4; update(1 / 30); dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' })); await new Promise((r) => setTimeout(r, 100)); talk = !$('dialogue').hidden; leaveTalk(); } return { moved, talk }; },
    openJournal, openChapters, openCredits,
    card: () => card('About half past eleven', ['The next part is loud, and it may be scary.'], [{ t: 'Begin', go: hideCard }, { t: 'Read what happened instead', go: hideCard }], { col: true }),
  };
}
/* ?test=motion (motioncheck.js): every step with something to do, its place brought by the real chapter start, then the frame loop stepped while you walk to each thing the step needs */
let motionNow = 0; const RESTORED = { on: false };   /* set while ?test=all reloads a saved game, so the snapshot after it reads where the game really is */
function motionAdapter(only) {
  const settle = async () => { await waitFor(() => !fading); for (let i = 0; i < 20 && (!$('card').hidden || !$('dialogue').hidden); i++) { hideCard(); leaveTalk(); await wait(50); } busy = false; };
  return {
    cases: () => Object.keys(STEPS).map(Number).sort((a, b) => a - b).filter((k) => STEPS[k].needs && (!only || only.includes(String(k)))).map((k) => ({ label: 'step ' + k + ' (' + placeOfStage(k) + ')', enter: async () => {
      await beginChapter(chapterOf(k), k); await settle(); const P = P_(), sp = STEPS[k], route = [[state.x, state.z]];
      for (const kind of ['talk', 'do', 'go']) for (const e of sp.needs[kind] || []) { const id = typeof e === 'string' ? e : e.id, p = (sp.at && sp.at[id]) || storyWhere(id, P); if (!p || Array.isArray(p[0])) continue;
        const to = [p[0] + 1.1, p[1] + 0.6], w = walkRoute(route[route.length - 1], to, P.walls, 0.3, P.bounds); route.push(...(w.length ? w : [to])); }
      return route; } })),
    step: (dt) => { motionNow += dt * 1000; update(dt, motionNow); },
    people: () => (P_() ? P_().npcs : []),
    player: () => ({ x: state.x, z: state.z, yaw: state.yaw }),
    move: (x, z, yaw) => { [state.x, state.z] = clampPos(x, z); if (yaw !== undefined) state.yaw = yaw; },
    mood: () => MOOD(stage),
    body: (n, clip) => makeBody({ base: n.base, bodyId: n.bodyId, scale: n.scale, tint: {}, x: 0, z: 0, ry: 0, anim: clip, hat: false }),
  };
}
/* ---------- test views and scripted playthroughs: dev builds only (node tools/build.mjs kendal --dev) ---------- */
/* the scripted playthrough (?auto=N, and the autoplay part of ?test=all): from chapter N to the end (or only N with one). L logs each change. Returns { ok, why }. */
async function autoPlay(N, one, L = () => {}) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  await waitFor(() => modelsReady); startGame(true); let ch = N - 1; L('start ch' + (ch + 1)); await beginChapter(ch); const finished = () => (ch === 4 ? stage >= 60 : stage >= DONE[ch]);
  let lastKey = '', lastT = performance.now(), ticks = 0; const nap = () => { for (let i = 0; i < 8; i++) update(0.05); };
  for (;;) {
    await sleep(120); nap(); ticks++; const now = performance.now();
    const key = stage + '|' + cur + '|' + unlocked.length + '|' + ($('card').hidden ? '' : $('ctitle').textContent) + '|' + (DIR.on ? 'cut' : '') + (RIDE.on ? 'ride' : '');
    if (key !== lastKey) { lastKey = key; lastT = now; L('s' + stage + ' ' + cur + ' pages=' + unlocked.length + (RIDE.on ? ' ride' : '') + ($('card').hidden ? '' : ' card="' + $('ctitle').textContent + '"') + ' goal="' + $('goal').textContent + '"'); }
    if (now - lastT > 30000) { L('STALL at stage ' + stage + ' in ' + cur + ' busy=' + busy + ' frozen=' + frozen + ' fading=' + fading); return { ok: false, why: 'stalled at stage ' + stage + ' in ' + cur }; }
    if (!$('card').hidden) { if (finished() && /Chapter|morning|The end/.test($('ctitle').textContent)) { /* a chapter-end card */ } const b = $('cbtns').querySelector('button'); if (b) b.click(); continue; }
    if (!$('dialogue').hidden) { const c = $('choices').firstChild; if (c) c.click(); else $('next').click(); continue; }
    if (!$('holdwrap').hidden) { HOLD.on = true; continue; }
    if (finished()) { L('chapter ' + (ch + 1) + ' DONE at stage ' + stage); if (one || ch >= 6) { L('ALLDONE'); return { ok: true }; } ch++; L('next ch' + (ch + 1)); await beginChapter(ch); lastT = performance.now(); continue; }
    if (busy || frozen || DIR.on || fading || CR.on) continue;
    const P = P_(); if (!P) continue; const a = P.actions.find((x) => x.on());
    if (a) { state.x = a.x; state.z = a.z; update(0.016); a.go(); continue; }
    const n = P.people.find((p) => wantsTalk(p)); if (n) { state.x = n.x + 1.1; state.z = n.z + 0.4; update(0.016); startTalk(n); continue; }
    if (cur === 'road' && stage === 12) { state.x = 26; state.z = 0; update(0.016); }
  }
}
function devViews() {
  const q = new URLSearchParams(location.search), shot = q.get('shot'), errs = [];
  addEventListener('error', (e) => { errs.push(e.message); document.title = 'ERROR ' + errs.join(' | '); });
  addEventListener('unhandledrejection', (e) => { errs.push(String((e.reason && e.reason.stack) || e.reason).slice(0, 300)); document.title = 'ERROR ' + errs.join(' | '); });
  const go = async (id, st, x, z, yaw, pitch, env) => { const P = await ensurePlace(id); $('title').hidden = true; $('hud').hidden = false; state.started = true; enterPlace(id, { env }); stage = st; best = Math.max(best, st); STORY.enter(st); state.x = x; state.z = z; state.yaw = yaw; state.pitch = pitch || 0; unlock('you', true); refreshGoal(); return P; };
  const V = {
    mule1: ['road', 11, -29.5, 6.4, -0.35, -0.05], mule2: ['road', 11, -25.4, 6.6, 0.15, -0.02], road1: ['road', 10, -33, 0.6, -1.35, 0], road2: ['road', 12, 22, 0.8, -1.5, 0.02], road3: ['road', 10, -22, 2.2, -0.1, 0],
    st1: ['station45', 20, -2, 6.5, 0.15, 0], st2: ['station45', 20, -7, 4.2, 0.9, 0.02], st3: ['station45', 20, 14, 5, 0.25, 0.05],
    hill1: ['hill', 30, -24, 5.5, -1.5, 0], hill2: ['hill', 30, -10, 4, -0.3, 0.05], loco1: ['hill', 30, -9, 2.2, -1.0, 0.02], seat1: ['coach', 52, 2.45, 0.1, 0.92, -0.3], seat2: ['coach', 52, 1.9, 0.25, 0.25, -0.38], seat3: ['coach', 52, 1.0, 0.25, -0.35, -0.38], sit1: ['crash', 61, 1.0, 7.2, 1.99, -0.15], bunch1: ['hill', 30, -11.2, 8.2, 0.75, -0.32], bunch2: ['hill', 30, -12.6, 6.6, 0.6, -0.75], loco2: ['hill', 30, 0.5, 2.6, 0, 0.0], loco3: ['hill', 30, 6.5, 2.2, 1.0, 0.0], loco4: ['hill', 30, -12, 1.0, -1.35, 0.0], eloco1: ['station45', 20, -16.5, 3.2, -1.05, 0.0], eloco2: ['station45', 20, -10.5, 3.0, 0, 0.0],
    k1: ['kingston57', 40, -22, 5, PI / 2 - 0.2, 0], k2: ['kingston57', 40, -22, 5, -PI / 2 + 0.4, 0], k3: ['kingston57', 40, -9, 6.2, 0.35, 0], k4: ['kingston57', 41, 28, 4, -PI / 2, 0],
    ride1: ['ride45', 23, 0.2, 0, PI / 2 + 0.25, 0], ride2: ['ride45', 23, 0.2, 0, 0.3, 0.05], poster: ['kingston57', 40, 47, -9.0, PI / 2 + 0.5, 0.03, ENV.gold], lurch: ['coach', 53, 1.5, 0, PI / 2 + 0.5, 0], coach1: ['coach', 51, 4.3, 0, PI / 2, 0], coach2: ['coach', 51, 0, 0, 1.2, 0], coach3: ['coach', 51, 3.2, 0.2, PI / 2 - 0.5, 0],
    beach1: ['beach', 43, 0, 9, 0.1, 0], beach2: ['beach', 43, 8, 3, -1.2, 0], band1: ['beach', 43, 10.4, 6.6, -0.9, 0.02], nurse1: ['crash', 61, -1.6, 9.9, 1.35, -0.12], bucket1: ['crash', 61, 22.5, 9.2, -1.5, -0.1], gran1: ['crash', 60, 13.1, 2.9, -2.62, -0.12], bunch3: ['hill', 31, -14.2, 3.0, 0.1, -0.15], k5: ['kingston57', 41, -14, 6.5, -1.9, 0.02], road4: ['road', 12, 27, 1.2, -2.0, 0.0], jglow: ['road', 10, -27, 4.2, 0, 0],
    crash4: ['crash', 61, 8, 4.4, 0.9, 0.04], crash1: ['crash', 60, 17, 5.8, 1.7, 0], crash2: ['crash', 60, 8, 6, 2.2, 0.05], crash3: ['crash', 61, -4, 9, 3.14, 0.02], crash5: ['crash', 66, 9, 5, 0.75, 0.0],
    mem1: ['memorial', 70, 0, 4.6, 0, 0.02], mem2: ['memorial', 71, 4, -4, 0.0, 0.1],
  };
  /* ?shot=model&m=diesel : one code-built model on plain ground, drawn from four sides at once. &a= turns it, &d= is the camera distance, &h= the camera height, &t= the height it looks at.
     Vehicles stand on a piece of track. m can be: diesel, coach, early, late, first, third, sides, wagon, mule, mule3 (loaded), cart, truck, bench, props (the small things in a row), loads. */
  if (shot === 'model') go('beach', 43, 0, 0, 0, 0).then(async (P) => {
    const pids = (q.get('ids') || '').split(',').filter(Boolean), plo = q.has('lo'); if (q.has('pick')) setTimeout(() => { const out = []; for (const xy of q.get('pick').split(';')) { const [px, py] = xy.split(',').map(Number), rc = new THREE.Raycaster(); rc.setFromCamera(new THREE.Vector2(px * 2 - 1, -(py * 2 - 1)), camera); const hits = []; scene.traverse((o) => { if (o.isSkinnedMesh) { o.computeBoundingSphere && o.computeBoundingSphere(); } }); const hs = rc.intersectObjects(scene.children, true).filter((h) => h.object.isMesh); out.push(xy + '=' + hs.slice(0, 3).map((h) => h.object.name + '/' + (h.object.material.name || '') + '@' + h.distance.toFixed(2)).join('>')); } document.title = 'PICK ' + out.join(' | '); }, 14000);   /* &pick=x,y;x,y (0..1 of the screen): which pieces lie under those points, nearest first */ if (q.has('ds')) setTimeout(() => scene.traverse((o) => { if (o.isMesh && o.material) { for (const m of [].concat(o.material)) { m.side = THREE.DoubleSide; m.needsUpdate = true; } } }), 6000);   /* &ds: draw every face from both sides (does a hole come from cloth folding over?) */ if (pids.length) await Promise.all(pids.map((id) => loadBase((LOOKS[id] || { base: id }).base + (plo ? '_lo' : ''))));   /* ?shot=model&m=people&ids=gran,lloyd[&lo][&hold=suitcase][&anim=Walk] lines people up for a close look */
    P.group.visible = false; $('hud').hidden = true; const m = q.get('m') || 'diesel', num = (k, d) => (q.has(k) ? +q.get(k) : d), root = new THREE.Group(); scene.add(root);
    const MODELS = { diesel: [() => TRN.dieselLoco(), 1, 17, 3.2, 1.2], coach: [() => TRN.woodCoach(7), 1, 15, 3, 1.2], early: [() => TRN.steamLoco('early'), 1, 11, 2.4, 0.6], late: [() => TRN.steamLoco('late'), 1, 12, 2.6, 0.8], first: [() => TRN.carriage1845('first'), 1, 8, 2.4, 0.6], third: [() => TRN.carriage1845('third'), 1, 8, 2.4, 0.6], sides: [() => TRN.carriage1845('third', 6.4, 2.4, 'sides'), 1, 9, 2.4, 0.6], wagon: [() => TRN.wagon(), 1, 9, 2.4, 0.4],
      mule: [() => PRP.mule(), 0, 3.6, 1.5, 0.95], mule3: [() => { const mu = PRP.mule(), L = [PRP.yamBasket(), PRP.provisionSack(), PRP.bananaLoad()]; L.forEach((o, i) => { mu.add(o); o.position.set(...mu.userData.slots[i]); o.rotation.set(0, i * 1.4, 0); o.scale.setScalar(i === 2 ? 0.9 : 0.8); }); mu.userData.dip = 1; return mu; }, 0, 3.6, 1.5, 0.95],
      cart: [() => PRP.cart(), 0, 5.5, 1.8, 0.7], truck: [() => PRP.truck(), 0, 7.5, 2.2, 1.0], bench: [() => PRP.bench(2.2), 0, 3.4, 1.3, 0.45],
      people: [() => { const g = new THREE.Group(); pids.forEach((id, i) => { const b = makeBody({ ...(LOOKS[id] || { base: id, tint: {} }), ...(q.get('hide') ? { hide: q.get('hide').split('-') } : {}), bodyId: (LOOKS[id] || { base: id }).base + (plo ? '_lo' : ''), x: (i - (pids.length - 1) / 2) * num('sp', 0.75), z: 0, ry: num('ry', 0), anim: q.get('anim') || 'Idle', props: q.get('hold') ? [['RightHand', q.get('hold')]] : undefined }); const c = b.userData.anim; if (q.has('at')) { c.base.time = num('at', 0) * c.base.getClip().duration; c.mx.update(0); } else c.mx.update(0.4); gripTick(b); g.add(b); if (q.has('at')) for (let k = 0; k < 30; k++) groundFeet(b);
        if (q.has('ds')) b.traverse((o) => { if (o.isMesh) o.material.side = THREE.DoubleSide; });   /* &ds draws the back of every face too (dev only): a hole that vanishes with it is a face folded over */
        if (q.has('cloth')) { g.updateMatrixWorld(true); const marks = [], tm = c.base.time, r = auditCloth(id, b, { poses: [[q.get('anim') || 'Idle', tm / c.base.getClip().duration]], after: gripTick, where: true, marks }); c.base.time = tm; c.mx.update(0); gripTick(b); console.log('CLOTH ' + id + '\n' + r.lines.join('\n'));   /* &cloth marks every show-through point with a red dot (dev only) */
          const dot = new THREE.SphereGeometry(0.006, 6, 4), dm = new THREE.MeshBasicMaterial({ color: 0xff0020, depthTest: false }); for (const mk of marks) { const d = new THREE.Mesh(dot, dm); d.position.set(mk[0], mk[1], mk[2]); d.renderOrder = 9; d.userData.dot = true; g.add(d); } } }); return g; }, 0, 3.2, 1.3, 1.0],   /* &anim=Walk&at=0.25 poses everyone a quarter of the way through the loop, feet on the ground; &ry=1.57 turns them side-on; &sp= is the gap between them */
      props: [() => { const g = new THREE.Group(); [PRP.suitcase(), PRP.hamper(), PRP.bucket(), PRP.lantern(), PRP.sack(), PRP.crate(), PRP.barrel()].forEach((o, i) => { o.position.x = (i - 3) * 0.85; g.add(o); }); return g; }, 0, 3.6, 1.0, 0.3],
      loads: [() => { const g = new THREE.Group(); [PRP.yamBasket(), PRP.provisionSack(), PRP.bananaLoad(), PRP.torch(), PRP.standpipe(), PRP.board()].forEach((o, i) => { o.position.x = (i - 2.5) * 1.0; g.add(o); }); return g; }, 0, 4.2, 1.1, 0.4] };
    const [make, rail, d0, h0, t0] = MODELS[m] || MODELS.diesel, obj = make(); root.add(obj); const gy = rail ? -1.69 : 0;
    if (rail) { const tr = TRN.rails(30); tr.position.y = gy; root.add(tr); }
    const gr = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x9a9c8c, roughness: 1 })); gr.rotation.x = -PI / 2; gr.position.y = gy - 0.005; gr.receiveShadow = true; root.add(gr);
    root.traverse((o) => { if (o.isMesh && o !== gr && !o.userData.dot) o.castShadow = o.receiveShadow = true; });
    const a0 = num('a', 0.5), d = num('d', d0), h = num('h', h0), ty = num('t', t0), one = q.has('one'), tick = obj.userData.tick; let n = 0;
    MV = () => { if (tick) tick(performance.now() / 1000); const W = renderer.domElement.width, Hh = renderer.domElement.height, angs = one ? [a0] : [a0, a0 + 1.35, a0 + PI, a0 + PI + 1.1]; renderer.setScissorTest(true);
      angs.forEach((a, i) => { const w = one ? W : W / 2, hh = one ? Hh : Hh / 2, x = one ? 0 : (i % 2) * w, y = one ? 0 : (1 - (i >> 1)) * hh; renderer.setViewport(x / renderer.getPixelRatio(), y / renderer.getPixelRatio(), w / renderer.getPixelRatio(), hh / renderer.getPixelRatio()); renderer.setScissor(x / renderer.getPixelRatio(), y / renderer.getPixelRatio(), w / renderer.getPixelRatio(), hh / renderer.getPixelRatio());
        camera.aspect = w / hh; camera.fov = 40; camera.updateProjectionMatrix(); camera.position.set(num('tx', 0) - Math.cos(a) * d, gy + h, num('tz', 0) + Math.sin(a) * d); camera.lookAt(num('tx', 0), gy + ty + (rail ? 1.69 : 0) * 0.6, num('tz', 0));   /* &tx= &tz= move the point looked at (a hand, a foot) */ sun.target.position.set(0, 0, 0); sun.position.copy(sunDir).multiplyScalar(110); sun.target.updateMatrixWorld(); renderer.render(scene, camera); });
      if (++n === 3) { let tris = 0, calls = 0; obj.traverse((o) => { if (o.isMesh) { calls += Array.isArray(o.material) ? o.material.length : 1; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3 * (o.isInstancedMesh ? o.count : 1); } }); document.title = 'MODEL ' + m + ' meshes=' + calls + ' tris=' + Math.round(tris); } };
  });
  if (shot === 'talk1') go('road', 10, -27, 4.2, -0.7, 0).then((P) => { startTalk(byId('dudley')); });
  /* ?shot=follow : Dawn comes with you. You walk a few metres, stop, and turn round to look at her (engine/follow.js). &wait= frames after you stop */
  if (shot === 'follow') go('crash', 63, 10.6, 10.9, PI / 2, 0).then((P) => { ON[63](); const route = [[7, 12.2], [3, 13.2]], n = byId('dawn'); for (const [tx, tz] of route) for (let i = 0; i < 900 && Math.hypot(tx - state.x, tz - state.z) > 0.05; i++) { const d = Math.hypot(tx - state.x, tz - state.z), k = Math.min(1, 2.3 / 30 / d); [state.x, state.z] = clampPos(state.x + (tx - state.x) * k, state.z + (tz - state.z) * k); update(1 / 30); } for (let i = 0; i < +(q.get('wait') || 60); i++) update(1 / 30); state.yaw = Math.atan2(-(n.x - state.x), -(n.z - state.z)) + (+(q.get('turn') || 0)); state.pitch = -0.12; document.title = 'FOLLOW ' + n.id + ' ' + Math.hypot(n.x - state.x, n.z - state.z).toFixed(2) + ' m'; });
  if (shot === 'talk2') go('crash', 62, 9, 8, PI, 0).then((P) => { story.lamp = true; updateLamp(); startTalk(byId('dawn')); });
  if (shot === 'card1') go('coach', 52, 2, 0, -PI / 2, 0, q.has('night') ? ENV.night : undefined).then((P) => { if (q.has('night')) { setRigTheme(P, 'night'); P.lamp.intensity = 9; RIDE.kind = 'diesel'; } crashIntro(); });   /* &night: the coach lit as at half past eleven (the trailer) */
  if (shot === 'journal1') go('road', 10, -27, 4.2, 0, 0).then(() => { for (const id of ['slowroad', 'higglers', 'free', 'cause']) unlock(id, true); openJournal('cause'); });
  if (shot === 'chap1') go('road', 10, -27, 4.2, 0, 0).then(() => { best = 35; modelsReady = true; openChapters(); });
  if (shot === 'at') { const n = (k, d) => +(q.get(k) ?? d); go(q.get('p') || 'road', n('st', 10), n('x', 0), n('z', 0), n('yaw', 0), n('pitch', 0)); }   /* any spot in any place: ?shot=at&p=<place>&st=&x=&z=&yaw=&pitch= (used to look at the doors) */
  if (V[shot]) go(...V[shot]).then((P) => {
    if (shot === 'st3') { /* the governor's end */ }
    if (shot === 'hill2' || /^loco/.test(shot)) { P.train.visible = true; P.train.position.x = 0; }
    if (shot === 'mule2') { (async () => { for (let i = 0; i < 3; i++) { loadItem(P, P.goods[i], i); for (let k = 0; k < 30; k++) update(0.05); } for (let k = 0; k < 10; k++) update(0.05); })(); }
    if (/^ride/.test(shot)) { RIDE.on = true; RIDE.kind = 'steam'; RIDE.v = RIDE.target = 9; for (let i = 0; i < 40; i++) update(0.05); }
    if (shot === 'poster') { $('hud').hidden = true; for (let i = 0; i < 4; i++) update(0.05); }
    if (shot === 'lurch') { setRigTheme(P, 'night'); setEnv(ENV.night); RIDE.on = true; RIDE.kind = 'diesel'; RIDE.v = RIDE.target = 24; P.lamp.intensity = 3; for (let i = 0; i < 30; i++) update(0.05); P.group.rotation.x = 0.17; FX.shake = 0.5; bars(true); say('The brakes scream.', 99999); }
    if (/^coach|^seat/.test(shot)) { RIDE.on = true; RIDE.kind = 'diesel'; RIDE.v = RIDE.target = 12; for (let i = 0; i < 30; i++) update(0.05); }
    if (shot === 'coach3') { setRigTheme(P, 'night'); setEnv(ENV.night); }
    if (shot === 'seat1') { setRigTheme(P, 'night'); setEnv(ENV.night); }
    if (/^crash/.test(shot)) { story.lamp = true; updateLamp(); if (shot === 'crash2') { setEnv(ENV.morning); for (const L of P.lights) L.userData.k = 0.1; handLamp.intensity = 0; P.torches.forEach((t) => { t.visible = false; }); } }
    if (shot === 'crash3') { setEnv(ENV.dawn); }
    if (shot === 'bucket1') { STORY.enter(61); const b = P.buckets[0]; HAND.carry(b, { yaw: 0.3 }); }
    if (shot === 'bunch3') { const b = P.bunches[0]; HAND.carry(b, { slot: [0.05, -0.62, -0.7], yaw: 0.4 }); b.rotation.z = 0.25; }
    if (shot === 'jglow') { unlock('slowroad'); unlock('higglers'); }
    if (q.has('t')) for (let i = 0; i < +q.get('t') * 20; i++) update(0.05);   /* &t=seconds lets background life move before the picture */
    if (shot === 'crash5') { setEnv(ENV.morning); for (const L of P.lights) L.userData.k = 0.1; handLamp.intensity = 0; lampMesh.visible = false; P.torches.forEach((t) => { t.visible = false; }); }
    if (/^k\d/.test(shot)) SFX.initBeds;
    for (let i = 0; i < 6; i++) update(0.05);
    if (q.has('stats')) setTimeout(() => { renderer.info.reset(); renderer.render(scene, camera); const i = renderer.info; let t = 'STATS calls=' + i.render.calls + ' tris=' + i.render.triangles + ' geo=' + i.memory.geometries + ' tex=' + i.memory.textures; if (q.has('calls')) { const by = {}; const walk = (o, tag) => { if (!o.visible) return; if (o.userData.anim) tag = 'people'; else if (P.rig && o === P.rig.group) tag = 'rig'; if (o.isMesh || o.isSprite || o.isPoints || o.isLine) by[tag] = (by[tag] || 0) + (Array.isArray(o.material) ? o.material.length : 1); for (const c of o.children) walk(c, tag === 'scene' && o === P.group ? 'place' : tag); }; for (const c of scene.children) walk(c, c === P.group ? 'place' : 'scene'); t += ' ' + JSON.stringify(by) + ' joinfail=' + JOIN_STATS.fails; }   /* &calls: meshes drawn, by kind */ document.title = t; console.log(t); }, 1500);
  });
  if (q.get('test') === 'layout') {   /* ?test=layout : open each UI state and check that no two visible things overlap, nothing is cut off, and nothing is off the screen. Run at several window sizes. */
    (async () => { const out = [], W = innerWidth, Hh = innerHeight; const st = document.createElement('style'); st.textContent = '*{transition:none!important;animation:none!important}'; document.head.appendChild(st);   /* headless Chrome draws few frames, so fades would be caught half way */
      await ensurePlace('road'); startGame(true); enterPlace('road'); $('hud').hidden = false; $('title').hidden = true; stage = 11; refreshGoal();
      const IDS = ['goal', 'topr', 'talk', 'hint', 'toast', 'sub', 'dialogue', 'cinner', 'place', 'hold', 'nudge'], rect = (id) => { const e = id === 'cinner' ? document.querySelector('#card .cardin') : $(id); if (!e || e.hidden) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || +cs.opacity < 0.05 || cs.visibility === 'hidden') return null; const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 ? { id, r, e } : null; };
      const check = (name) => { const L = IDS.map(rect).filter(Boolean); for (const a of L) { if (a.r.left < -1 || a.r.top < -1 || a.r.right > W + 1 || a.r.bottom > Hh + 1) out.push(`${W}x${Hh} ${name}: ${a.id} is off the screen (${a.r.left | 0},${a.r.top | 0},${a.r.right | 0},${a.r.bottom | 0})`); if (a.e.scrollWidth > a.e.clientWidth + 2 && getComputedStyle(a.e).overflow !== 'visible' && a.id !== 'dialogue') out.push(`${W}x${Hh} ${name}: ${a.id} text is cut off`); }
        for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const a = L[i].r, b = L[j].r, ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (ox > 4 && oy > 4) out.push(`${W}x${Hh} ${name}: ${L[i].id} overlaps ${L[j].id} by ${ox | 0}x${oy | 0} [${L[i].id} op ${getComputedStyle(L[i].e).opacity} ${L[i].r.top | 0}-${L[i].r.bottom | 0}, ${L[j].id} op ${getComputedStyle(L[j].e).opacity} ${L[j].r.top | 0}-${L[j].r.bottom | 0}]`); } };
      const reset = () => { for (const id of ['talk', 'toast', 'dialogue', 'card', 'holdwrap', 'nudge']) $(id).hidden = true; $('hint').hidden = true; bars(false); document.body.classList.remove('subbing', 'talking'); $('sub').classList.add('dim'); $('place').hidden = true; $('place').style.opacity = 0; };
      const settle = () => new Promise((r) => setTimeout(r, 700));
      reset(); showGoal(true); $('talk').hidden = false; $('talk').textContent = 'Sit down with Gran'; showHint(); toast('Loaded 2 of 3'); showPlace('The Spanish Town road, about 1844'); await settle(); check('play: goal, talk, hint, toast, place');
      reset(); showGoal(true); say('The train climbs into the hills, slowly and steadily, and the engines work very hard indeed.', 1e6); $('talk').hidden = false; $('talk').textContent = 'Sit down with Gran'; showHint(); toast('Loaded 2 of 3'); await settle(); check('narration without bars');
      reset(); bars(true); say('The train climbs into the hills, slowly and steadily, and the engines work very hard indeed.', 1e6); $('talk').hidden = false; $('talk').textContent = 'Sit down with Gran'; showHint(); await settle(); await new Promise((r) => setTimeout(r, 1100)); check('narration inside the bars');
      reset(); showGoal(true); document.body.classList.add('talking'); $('dialogue').hidden = false; $('who').textContent = 'Mass Dudley'; $('line').textContent = 'Some say a railway will help us. Some say it will take our work. What do you think about that, child?'; $('choices').innerHTML = '<button class="btn ghost">It will help people.</button><button class="btn ghost">It might take your work.</button><button class="btn ghost">I do not know yet.</button>'; $('next').hidden = true; await settle(); check('dialogue with three choices');
      reset(); bars(true); say('Hold on!', 1e6); $('holdwrap').hidden = false; $('talk').hidden = true; await settle(); await new Promise((r) => setTimeout(r, 1100)); check('hold on button in the bars');
      reset(); sceneWarning(card, { title: 'About half past eleven', lines: ['The next part is loud, and it may be scary.', 'It shows the crash gently. Nobody is hurt on the screen.'], watch: () => {}, read: () => {} }); await settle(); check('card');
      reset(); $('nudge').hidden = false; $('nudge').style.left = (W * 0.75 | 0) + 'px'; $('nudge').style.top = (Hh * 0.45 | 0) + 'px'; showGoal(true); $('talk').hidden = false; $('talk').textContent = 'Give the water to the nurse'; await settle(); check('helper arrow with talk button');
      reset(); showGoal(true); showPlace('Kendal, Manchester. About half past eleven.'); $('nudge').hidden = false; $('nudge').className = 'down'; $('nudge').style.left = (W / 2 | 0) + 'px'; $('nudge').style.top = Math.max(110, Hh * 0.3 | 0) + 'px'; await settle(); check('helper arrow with the place name');
      /* a journal page found while someone is talking: the Journal button glows with a count at once, but the toast waits until the dialogue box closes (it never covers it) */
      reset(); fresh = 0; showCount(); convo([{ who: 'Mass Ezra', text: 'Here. Take my lamp. It has seen many nights on the line.' }, { who: 'You', text: 'Thank you, Mass Ezra.' }]); unlock('ezra'); await settle(); check('journal page found in a dialogue');
      { const b = $('jbtn').getBoundingClientRect(), c = $('jcount').getBoundingClientRect(); if (!$('toast').hidden) out.push(`${W}x${Hh} journal page found in a dialogue: the toast shows while the dialogue box is open`); if (!$('jbtn').classList.contains('glow') || $('jcount').hidden) out.push(`${W}x${Hh} journal page found in a dialogue: the Journal button does not glow or show its count`);
        if (c.left < b.left - 1 || c.right > b.right + 1 || c.top < b.top - 1 || c.bottom > b.bottom + 1 || b.right > W + 1 || b.top < -1) out.push(`${W}x${Hh} journal page found in a dialogue: the count badge is outside the Journal button or off the screen`); }
      leaveTalk(); await settle(); check('journal page toast after the dialogue'); if ($('toast').hidden || !/journal page/i.test($('toast').textContent)) out.push(`${W}x${Hh} journal page toast after the dialogue: the waiting toast did not show`);
      openJournal(); await settle(); if ($('jbtn').classList.contains('glow')) out.push(`${W}x${Hh} journal opened: the button still glows`); closeJournal(); unlocked.splice(unlocked.indexOf('ezra'), 1);
      /* panels opened in the middle of play (the journal, the chapters list, the credits) must be on top: their title and Close button must be what you touch there */
      const covered = (name, panel, ids) => { for (const id of ids) { const e = $(id), r = e.getBoundingClientRect(), t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!t || !$(panel).contains(t)) out.push(`${W}x${Hh} ${name}: ${id} is covered by ${t ? (t.id || t.className || t.tagName) : 'nothing'}`); } };
      reset(); showGoal(true); $('talk').hidden = false; $('talk').textContent = 'Sit down with Gran'; await settle();
      openChapters(); await settle(); covered('chapters panel in play', 'chapters', ['chtitle', 'chclose']); closeChapters();
      openJournal(); await settle(); covered('journal panel in play', 'journal', ['jtitle', 'jclose']); closeJournal();
      openCredits(); await settle(); covered('credits panel in play', 'credits', ['crtitle', 'crclose']); closeCredits();
      document.title = 'LAYOUT ' + out.length; const el = $('autolog'); if (el) el.textContent = (out.length ? out : [W + 'x' + Hh + ': no layout problems']).join('\n'); })();
  }
  if (q.get('test') === 'cloth') {   /* ?test=cloth : does an under layer show through its cover (skin through a shirt, shirt through a waistcoat, hair through a hat)? Every body, full and light copy, each hat, with and without the waistcoat, in the poses the game uses. &b=man_suit,boy picks bodies, &full or &lo picks one kind. */
    (async () => { const out = []; let bad = 0, pts = 0; startGame(true); await waitFor(() => modelsReady);
      const POSES = [['Idle', 0.3], ['Walk', 0.25], ['Walk', 0.75], ['Talk1', 0.4], ['Wave', 0.5], ['SitIdle', 0.3]], bases = (q.get('b') || 'man_work,man_suit,man_shirt,man_elder,man_apron,woman_long,woman57,woman_elder,boy,girl,girl_small,guide2020,student2020').split(',');
      for (const base of bases) for (const lo of [false, true]) { if ((lo && q.has('full')) || (!lo && q.has('lo'))) continue; const bodyId = base + (lo ? '_lo' : ''); await loadBase(bodyId);
        const hats = [...(HATS[base] || []), false], vars = hats.map((hat, i) => ({ hat, hide: [], poses: i ? [['Idle', 0.3], ['Walk', 0.25]] : POSES }));   /* the first hat in every pose; the other hats and the bare head standing and in one stride */ if (/^man_(work|shirt|elder)$/.test(base)) vars.push({ hat: false, hide: ['Waistcoat'] }); if (base === 'man_shirt') vars.push({ hat: false, hide: ['Tie'] });
        for (const va of vars) { const b = makeBody({ base, bodyId, tint: {}, scale: KID[base] || 1, x: 0, z: 0, ry: 0, anim: 'Idle', hat: va.hat, hide: va.hide }), name = bodyId + (va.hat ? ' +' + va.hat : '') + (va.hide.length ? ' -' + va.hide.join('-') : ''); scene.add(b);
          const r = auditCloth(name, b, { poses: va.poses || POSES, after: gripTick, where: q.has('where') }); out.push(name + ': ' + r.lines.length + ' faults, ' + r.points + ' points, worst ' + r.worst.toFixed(1) + ' mm'); for (const l of r.lines) out.push('  ' + l); bad += r.lines.length; pts += r.points; scene.remove(b); await new Promise((res) => setTimeout(res, 0)); } }
      out.unshift('cloth: ' + bad + ' issues (' + pts + ' points)'); const el = $('autolog'); if (el) el.textContent = out.join('\n'); document.title = 'CLOTH ' + bad; })();
  }
  if (q.get('test') === 'skin') {   /* ?test=skin : how dark each face really looks in daylight (engine/skinprobe.js). Every look, plus a sample of crowd people at the ends of their skin range. &env=day picks the light. */
    (async () => { const out = []; startGame(true); await waitFor(() => modelsReady); setEnv(ENV[q.get('env') || 'day']);
      const list = Object.keys(LOOKS).map((k) => [k, LOOKS[k]]); for (const sk of [0.9, 1.0, 1.15]) list.push(['crowd woman57 skin ' + sk, { base: 'woman57', tint: {}, skin: sk }], ['crowd man_suit skin ' + sk, { base: 'man_suit', tint: {}, skin: sk }]);
      for (const [name, look] of list) { await loadBase(look.base); const b = makeBody({ ...look, x: 4000, z: 4000, ry: 0, anim: 'Idle', hat: false }); scene.add(b); b.userData.anim.mx.update(0.3); const r = skinProbe(renderer, scene, b); scene.remove(b);
        out.push(name + ' (' + look.base + ', skin ' + (look.skin || 1) + '): mean ' + r.rgb.join(',') + '  darkest ' + r.lo.join(',') + '  lightest ' + r.hi.join(',')); }
      let el = $('autolog'); el.textContent = out.join('\n'); document.title = 'SKIN ' + out.length; })();
  }
  if (q.get('test') === 'walkers') {   /* ?test=walkers : every body walks whole loops at the speed the game moves it. Feet must not slide, sink or float, the loop must join, and a carried thing must stay clear of the body. */
    (async () => { const out = []; let bad = 0; startGame(true); await waitFor(() => modelsReady);
      const kidOf = (base, scale) => ({ base, scale, tint: {} });   /* Gran (woman_elder, full body) never walks in this game, so she is not here: her full body sinks 3.1 cm at one heel strike (16 November 2026); the light copy every walking elder uses is below */
      const LIST = [['muleteer'], ['gent45'], ['surveyor'], ['ezra57'], ['foreman'], ['higgler'], ['mother'], ['joy'], ['andre'], ['lloyd'], ['dawn'], ['girl 0.80', kidOf('girl', 0.8)], ['girl 0.68', kidOf('girl', 0.68)], ['boy 0.68', kidOf('boy', 0.68)],
        ['man with a suitcase (light copy)', { ...LOOKS.gent45, bodyId: 'man_suit_lo', props: [['RightHand', 'suitcase']] }], ['woman with a hamper (light copy)', { ...LOOKS.mother, bodyId: 'woman57_lo', props: [['RightHand', 'hamper']] }], ['elder woman with a hamper (light copy)', { ...LOOKS.gran, bodyId: 'woman_elder_lo', props: [['RightHand', 'hamper']] }], ['dawn hurrying after you', LOOKS.dawn, 1.4], ['dawn running after you', LOOKS.dawn, 2.2, 'Run'],
        ['a man on the platform (WalkM2)', LOOKS.gent45, undefined, 'WalkM2'], ['the guard (WalkM2)', LOOKS.guard57, undefined, 'WalkM2'], ['a man with a case (CarryBagWalk, light copy)', { ...LOOKS.gent45, bodyId: 'man_suit_lo', props: [['RightHand', 'suitcase']] }, undefined, 'CarryBagWalk'], ['a navvy with earth on his head (CarryHeadWalk, light copy)', { ...LOOKS.worker45, bodyId: 'man_work_lo' }, undefined, 'CarryHeadWalk'],
        ['a banana carrier (CarryHeadWalk)', { ...LOOKS.woman45, bodyId: 'woman_long_lo' }, undefined, 'CarryHeadWalk'], ['a survivor who walks slowly (light copy)', { ...LOOKS.worker45, bodyId: 'man_work_lo' }, 0.65, 'Walk']];
      for (const [name, look, vIn, clip] of LIST) { const spec = { ...(look || LOOKS[name]), x: 0, z: 0, ry: PI / 2, anim: clip || 'Walk' }; await loadBase(spec.bodyId || spec.base); const b = makeBody(spec); scene.add(b);
        const v = vIn || walkSpeed(b), old = auditWalk(name, b, 1.1, { after: gripTick, paced: false, loops: 1 }), r = auditWalk(name, b, v, { after: gripTick, heldItems: b.userData.held });
        out.push(`${name} (${spec.bodyId || spec.base} x${(spec.scale || 1).toFixed(2)}): stride ${(r.stride * 100).toFixed(0)} cm, ${v.toFixed(2)} m/s, clip speed ${r.pace.toFixed(2)}, slide ${r.slide.toFixed(1)} cm a loop (was ${old.slide.toFixed(1)} at 1.10 m/s and clip speed 1), shoes ${r.sink.toFixed(1)} to ${r.float.toFixed(1)} cm, biggest jump ${r.pop.toFixed(1)}x, body rises and falls ${r.rise.toFixed(1)} cm (at most ${r.bob.toFixed(1)} cm in a step)`);
        if (q.has('tune')) { const c = b.userData.anim.cur.getClip(), raw = v * c.duration / strideOf(b, c); let best = [1e9, raw]; for (let k = 0.7; k <= 1.451; k += 0.025) { PACE_FORCE = raw * k; const t = auditWalk(name, b, v, { after: gripTick, loops: 1 }); if (t.slide < best[0]) best = [t.slide, PACE_FORCE]; } PACE_FORCE = 0; out.push(`  TUNE '${spec.base}|${c.name}|${(spec.scale || 1).toFixed(2)}': ${(raw / best[1]).toFixed(3)} (slide ${best[0].toFixed(1)} cm)`); }   /* &tune: the clip speed with the least slide, as a STRIDE_K factor */
        for (const l of r.lines) { out.push('  ' + l); bad++; } scene.remove(b); }
      out.unshift('walkers: ' + bad + ' issues'); const el = $('autolog'); if (el) el.textContent = out.join('\n'); document.title = 'WALKERS ' + bad; })();
  }
  if (q.get('test') === 'held') {
    if (q.get('hs')) for (const k of ['hamper', 'suitcase', 'bucket']) { GRIP[k] = { ...GRIP[k], scale: +q.get('hs') * (k === 'suitcase' ? 1.4 : 1), out: +q.get('ho') }; } if (q.get('ls')) GRIP.lantern = { ...GRIP.lantern, scale: +q.get('ls'), out: +q.get('lo') };   /* ?test=held : every carried thing, in every place: at the hand, upright, clear of the body */
    (async () => { const out = []; startGame(true); for (const id of Object.keys(BUILD)) { const P = await ensurePlace(id); for (const n of P.npcs) if (n.m.userData.held && n.m.userData.held.length) { const found = auditHeldClip(n.id || n.base, n.m, n.m.userData.held, { after: gripTick }); for (const l of found) out.push(id + ': ' + l); } }
      const count = out.length; out.unshift('held items: ' + count + ' issues'); const el = $('autolog'); if (el) el.textContent = out.join('\n'); document.title = 'HELD ' + count; })();
  }
  if (['audit','collision','seating'].includes(q.get('test'))) {   /* ?test=audit&p=road,hill : floating objects, people inside solids, unreachable spots */
    (async () => { const ids = (q.get('p') || Object.keys(BUILD).join(',')).split(','), out = []; let count = 0; startGame(true); for (const id of ids) { const P = await ensurePlace(id); const r = auditPlace(P); count += r.floating.length + r.inside.length + r.stuck.length; out.push(id + ': ' + (r.floating.length + r.inside.length + r.stuck.length) + ' issues'); for (const l of [...r.floating, ...r.inside, ...r.stuck]) out.push('  ' + l); }
      if (q.get('seats')) out.push(...SEATLOG); const el = $('autolog'); if (el) el.textContent = out.join('\n'); document.title = 'AUDIT ' + count; })();
  }
  if (q.get('test') === 'flow') {   /* ?test=flow : every step of the story (engine/story.js checkFlow): counts in goals, the arrow within 2.5 s pointing only at what is needed, a visible change for every task, flavour lines that send nobody anywhere. Expect FLOW 0. */
    (async () => { startGame(true); for (const id of Object.keys(BUILD)) await ensurePlace(id);
      const r = flowTest(STORY, { place: (st) => { enterPlace(placeOfStage(st)); }, start: (st) => { const P = PL[placeOfStage(st)]; return [P.start.x, P.start.z]; } }); document.title = r.text.split('\n').pop(); })();
  }
  if (q.get('test') === 'ambient') {   /* ?test=ambient : every place's background life runs for a minute while you walk the story's way through it (engine/ambient.js ambientCheck). Expect AMBIENT 0 in every place. */
    (async () => { const out = []; let total = 0; startGame(true); const ST = { road: 10, station45: 20, ride45: 23, hill: 31, kingston57: 40, coach: 50, beach: 43, crash: 61, memorial: 70 };
      for (const id of (q.get('p') || Object.keys(BUILD).join(',')).split(',')) { const P = await ensurePlace(id); enterPlace(id); stage = ST[id]; STORY.enter(ST[id]); P.life.mood(MOOD(stage)); for (const k of Object.keys(KEEPC)) delete KEEPC[k];
        const route = [[P.start.x, P.start.z]]; for (const [k, sp] of Object.entries(STEPS)) { if (placeOfStage(+k) !== id || !sp.needs) continue; for (const kind of ['talk', 'do', 'go']) for (const e of sp.needs[kind] || []) { const p = (sp.at && sp.at[typeof e === 'string' ? e : e.id]) || storyWhere(typeof e === 'string' ? e : e.id, P); if (p && !Array.isArray(p[0]) && typeof p !== 'function') { const w = walkRoute(route[route.length - 1], [p[0] + 0.9, p[1] + 0.5], P.walls, 0.3, P.bounds); route.push(...(w.length ? w : [[p[0] + 0.9, p[1] + 0.5]])); } } }
        const story = () => P.people.filter((n) => STORY.isStory(n.id) && !n.amb), txt = ambientTest(P.life, { route, stops: route.map((_, i) => i), story, seconds: +(q.get('s') || 60), place: P.group, snap: P.snap, view: (pp) => ({ x: pp[0], z: pp[1], yaw: state.yaw }) }), n = +txt.split('\n')[0].split(' ')[1];
        total += n; out.push(id + ': ' + txt.split('\n').filter((l, i) => i === 0 || (l && !/^\S+: (wander|chat|work|sit|watch|errand|play),/.test(l)) || q.has('stats')).join('\n  ')); await new Promise((r) => setTimeout(r, 0)); }
      out.unshift('AMBIENT ' + total); const el = $('autolog'); if (el) el.textContent = out.join('\n'); document.title = 'AMBIENT ' + total; })();
  }
  if (q.get('test') === 'all') {   /* ?test=all : the shared runner (engine/checks.js, docs/TESTING.md section 7) with this game's hooks (checktables.js), plus this game's motion check. &checks=journal,map runs some. Expect ALL 0. */
    if (!CHECKS.some((c) => c.id === 'motion')) CHECKS.push({ id: 'motion', needs: [], async run() { const r = await motionCheck(motionAdapter(null)); return { lines: r.lines, note: r.stats.length + ' steps watched' }; } });
    checkAll(makeAdapter(checkHooks()), CHECK_TABLES);
  }
  if (q.get('test') === 'motion') {   /* ?test=motion (&st=40,61): everyone in view moves like a person in every step of the story (motioncheck.js): nobody frozen, nobody in step with the crowd, heads within a person's reach, no running in place or sliding. Expect MOTION 0. */
    (async () => { startGame(true); await waitFor(() => modelsReady); const r = await motionCheck(motionAdapter(q.get('st') ? q.get('st').split(',') : null));
      const el = $('autolog'); if (el) el.textContent = ['MOTION ' + r.lines.length, ...r.lines, '', ...r.stats].join('\n'); document.title = 'MOTION ' + r.lines.length; })();
  }
  if (q.get('test') === 'follow') {   /* ?test=follow : you walk the real route with Dawn, with stops and a turn back into her, and her is watched (engine/follow.js, watch): too close (inside the
       personal space), inside a wall or a solid shape (engine/audit.js auditBodies), or left far behind. Expect 0. */
    (async () => { const out = []; let bad = 0; const dt = 1 / 30; startGame(true); await beginChapter(5, 62); 
      const P = PL.crash, n = byId('dawn'), w = followWatch({ space: FOLLOW.dawn.space, behind: 6 }), Wl = () => P.walls, blocked = (x, z) => inWallR(Wl(), x, z, 0), move = (x, z) => { const r = clampPos(x, z); state.x = r[0]; state.z = r[1]; return r; }, step = (t) => update(t);
      state.x = n.x + 1.0; state.z = n.z + 0.6; update(dt); setStage(63);
      const leg = (to, stops = []) => { const r = walkRoute([state.x, state.z], to, Wl(), 0.3, P.bounds); drive({ from: [state.x, state.z], route: r.length ? r : [to], stops, move, step, people: [n], w, blocked }); };
      leg([2.5, 13], [0]); leg([5, 12.4]); leg([-3.6, 14.4], [0]);
      const lines = w.lines(n, 'Dawn comes with you to the calling place').concat(auditBodies(P.snap.concat(P.snap.inst || []), w.spots(n).map(([x, z]) => ({ id: 'Dawn comes with you to the calling place', x, z, ground: n.m.userData.ground || 0, h: 1.05, r: 0.12, what: 'walks' }))));
      out.push('Dawn comes with you to the calling place: ' + w.stats(n) + (lines.length ? '' : ', ok')); for (const l of lines) out.push('  ' + l); bad += lines.length;
      out.unshift('follow: ' + bad + ' problems'); document.title = 'FOLLOW ' + bad; const el = $('autolog'); if (el) el.textContent = out.join('\n'); })();
  }
  if (q.get('test') === 'resume') {   /* saved games resume in the right place, and closing a finishing conversation still moves the story on */
    (async () => { const out = []; startGame(true);
      await beginChapter(3, 44); out.push('ch4@44 place=' + cur + ' stage=' + stage); await beginChapter(3, 43); out.push('ch4@43 place=' + cur);
      await beginChapter(2, 34); const H = PL.hill; out.push('ch3@34 place=' + cur + ' train=' + H.train.visible + '@' + H.train.position.x);
      await beginChapter(5, 66); out.push('ch6@66 place=' + cur + ' lamp=' + (handLamp.intensity > 0) + ' sun=' + envNow.sun[1].toFixed(1));
      await beginChapter(5, 61); out.push('ch6@61 lamp=' + (handLamp.intensity > 0));
      let ran = 0; convo([{ who: 'x', text: 'y' }, { who: 'x', text: 'z' }], () => { ran++; }); leaveTalk(); out.push('convo closed early, callback ran=' + ran);
      let ran2 = 0; startTalk(P_().people[0]); leaveTalk(); out.push('ordinary talk closed early: talked=' + !!P_().people[0].talked);
      document.title = 'RESUME ' + out.join(' | '); })();
  }
  if (q.has('clickstart')) setTimeout(() => $('start').click(), 300);   /* the real start, with real fades (the other test views skip them) */
  if (q.has('auto')) {   /* ?auto=N plays chapter N (1 to 7) and the ones after it; add &one to stop after N. It logs every change to the page title and #autolog, and says STALL if nothing changes for a while. */
    const log = [], L = (m) => { log.push(m); document.title = log.join(' | '); const el = $('autolog'); if (el) el.textContent = log.join('\n'); };
    autoPlay(+q.get('auto'), q.has('one'), L);
  }
}
hudTidy();   /* the toast keeps clear of the action button and wraps its words (engine/hud.js) */
addExit({ url: '../../../menu/', save: () => saveGame() });   /* Exit, right of the Journal button, with an "are you sure" (engine/exit.js) */
