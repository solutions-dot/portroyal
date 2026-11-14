import { releaseOnBlur, useInteractionKey } from '../../../engine/input.js';
/* games/_tivoli/src/main.js: Tivoli (West Kingston, from the 1960s to today, with May 2010 at the centre). Read docs/games/tivoli.md first.
   Started from games/_template/. The folder name starts with an underscore so tools/dist.mjs does not publish it yet:
   rename it to games/tivoli/ (and fix the paths in docs/games/tivoli.md and .gitignore) when the owner decides to publish.
   There is no story code yet: what follows is still the template's starting point. It shows: a scene, first-person movement (keys, touch joystick, drag to look, gamepad-free),
   simple collisions, one person who plays shared animations, talking with a dialogue box,
   a goal line, footsteps and UI sounds, and a link back to the game menu.
   RULE for every game (CLAUDE.md rule 8): before the first PR, wire the automatic audits from engine/audit.js (floating objects, people in solids,
   unreachable spots, held items, overlapping people) and a layout test into the dev build, and fix everything they report.
   See docs/TESTING.md section 5 and games/kendal/src/main.js ("the place audit"). */
import * as THREE from 'three';
import { CL, mixers, loadClips, animate, groundFeet } from '../../../engine/anim.js';
import { soundPref, setSound, audioInit, stepSound, uiSound, AU } from '../../../engine/audio.js';
import { model, onLoadFail } from '../../../engine/loader.js';
import { pose, standIns, POSES } from './clips.js';
import { LOOKS, BODIES, loadBase, makeBody } from './cast.js';
import { arm, weaponTick, heldReport, ARMED, modeOf } from './weapons.js';
import { snapMeshes, auditPlace } from '../../../engine/audit.js';   // dev only: the place audit (CLAUDE.md rule 8)
import { contentRects, contentsOverlap } from '../../../engine/ui-audit.js';   // dev only: the layout test
import { buildStreet } from './street.js';
import { FIGHT, positions as fightPositions, wire as wireFight, tick as fightTick, after as fightAfter, skip as fightSkip, begin as fightBegin } from './fight.js';   // the May 2010 street scene
import { auditCloth, auditWalk, skinProbe } from './checks.js';   // dev only: local copies until the engine has them (see checks.js)   // gunfight poses: real clips when the library has them, stand-ins until then

const $ = (id) => document.getElementById(id);
soundPref('tivoli-sound');   // each game remembers its own sound setting
onLoadFail((name) => { $('loadnote').textContent = 'Could not load ' + name + '. Please reload the page.'; });

/* ---------- renderer, camera, light ---------- */
const canvas = $('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0xbcd6e0); scene.fog = new THREE.Fog(0xbcd6e0, 30, 90);
const camera = new THREE.PerspectiveCamera(68, 1, 0.1, 500);
scene.add(new THREE.HemisphereLight(0xeaf4ff, 0x8a7a5a, 1.6));
const sun = new THREE.DirectionalLight(0xfff2dc, 2.2); sun.position.set(20, 30, 10); scene.add(sun);
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

/* ---------- the world: ground and a few buildings (each building is also a wall you cannot walk through) ---------- */
const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0xd8c8a0, roughness: 1 }));
ground.rotation.x = -Math.PI / 2; scene.add(ground);
const WALLS = [];   // [x0, z0, x1, z1] boxes the player cannot enter
function building(x, z, w, d, h, color) {
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: 0.9 })); b.position.set(x, h / 2, z); scene.add(b);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.75, 1.6, 4), new THREE.MeshStandardMaterial({ color: 0x8a4a32 })); roof.position.set(x, h + 0.8, z); roof.rotation.y = Math.PI / 4; roof.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d)); scene.add(roof);
  WALLS.push([x - w / 2 - 0.3, z - d / 2 - 0.3, x + w / 2 + 0.3, z + d / 2 + 0.3]);
}
building(-6, -8, 5, 4, 4, 0xb86a4a); building(1, -8, 5, 4, 5, 0xe0d4b8); building(8, -8, 5, 4, 4, 0x9a6a4a); building(-6, 8, 5, 4, 4, 0xe0d4b8); building(6, 8, 6, 4, 4.5, 0xb86a4a);

/* ---------- player state and movement ---------- */
const state = { x: 0, z: 4, yaw: 0, pitch: 0, started: false };   // yaw 0 looks toward -z
const keys = new Set(); let busy = false;   // busy: a talk is open, so do not move
addEventListener('keydown', (e) => { const k = e.key.toLowerCase(); keys.add(k); if (k === 'escape') leaveTalk(); useInteractionKey(e, () => { if (!$('dialogue').hidden) { $('next').click(); return; } if (state.started && !busy && near) { startTalk(); return; } return false; }); });
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
function clampPos(x, z) {   // keep inside the map and out of buildings (slide along walls)
  x = Math.max(-35, Math.min(35, x)); z = Math.max(-35, Math.min(35, z));
  for (const [x0, z0, x1, z1] of WALLS) if (x > x0 && x < x1 && z > z0 && z < z1) { const dl = x - x0, dr = x1 - x, dt = z - z0, db = z1 - z, m = Math.min(dl, dr, dt, db); if (m === dl) x = x0; else if (m === dr) x = x1; else if (m === dt) z = z0; else z = z1; }
  return [x, z];
}
/* touch: left half of the screen is a joystick, right half drags to look; mouse drags to look */
const stick = { id: null, x0: 0, y0: 0, dx: 0, dy: 0 }, look = { id: null, x: 0, y: 0 };
releaseOnBlur(keys, [stick, look]);
canvas.addEventListener('pointerdown', (e) => {
  if (busy) { leaveTalk(); return; }   // tapping the world while talking ends the talk
  if (e.pointerType === 'touch' && e.clientX < innerWidth / 2 && stick.id === null) { stick.id = e.pointerId; stick.x0 = e.clientX; stick.y0 = e.clientY; stick.dx = stick.dy = 0; }
  else { look.id = e.pointerId; look.x = e.clientX; look.y = e.clientY; look.moved = 0; }
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerId === stick.id) { stick.dx = Math.max(-1, Math.min(1, (e.clientX - stick.x0) / 50)); stick.dy = Math.max(-1, Math.min(1, (e.clientY - stick.y0) / 50)); }
  else if (e.pointerId === look.id) { const dx = e.clientX - look.x, dy = e.clientY - look.y; look.x = e.clientX; look.y = e.clientY; look.moved += Math.abs(dx) + Math.abs(dy); state.yaw -= dx * 0.005; state.pitch = Math.max(-1.2, Math.min(1.2, state.pitch - dy * 0.004)); }
});
const endPointer = (e) => {
  if (e.pointerId === stick.id) { stick.id = null; stick.dx = stick.dy = 0; }
  if (e.pointerId === look.id) { if (look.moved < 8 && tapPerson(e.clientX, e.clientY)) startTalk(); look.id = null; }   // a tap (not a drag) on a person starts a talk
};
canvas.addEventListener('pointerup', endPointer); canvas.addEventListener('pointercancel', endPointer);

/* ---------- a person to talk to ---------- */
let person = null, near = false;
const PERSON = { x: 3, z: -2, who: 'Sam the sailor' };
const TALK = [
  { who: 'Sam the sailor', text: 'Hello! Welcome to town.' },
  { who: 'You', text: 'Thank you. What is this place?' },
  { who: 'Sam the sailor', text: 'This is your new game. Make it your own!' }];
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function tapPerson(cx, cy) { if (!person) return false; ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera); return ray.intersectObject(person, true).length > 0 && Math.hypot(state.x - PERSON.x, state.z - PERSON.z) < 6; }

/* ---------- talking: one line at a time; "You" lines get their own colour; the x, Escape or a tap outside ends it ---------- */
let step = 0, goalDone = false;
function startTalk() { busy = true; keys.clear(); step = 0; uiSound('tap'); $('dialogue').hidden = false; $('talk').hidden = true; if (person && CL.Talk1) person.userData.anim.play('Talk1'); showLine(); }
function showLine() { const s = TALK[step], me = s.who === 'You'; $('who').textContent = s.who; $('line').textContent = s.text; $('dialogue').classList.toggle('me', me); $('next').focus(); }
function nextLine() { uiSound('tap'); step++; if (step >= TALK.length) { endTalk(true); return; } showLine(); }
function endTalk(finished) { busy = false; $('dialogue').hidden = true; if (person) person.userData.anim.rest(); if (finished && !goalDone) { goalDone = true; setGoal('Well done! Now build your own story.'); uiSound('goal'); } }
function leaveTalk() { if (!$('dialogue').hidden) endTalk(false); }
$('next').onclick = nextLine; $('dclose').onclick = leaveTalk; $('talk').onclick = startTalk;
function setGoal(t) { $('goal').textContent = t; }

/* ---------- loading ---------- */
Promise.all([model('anims'), model('anims_tivoli'), model('sailor')]).then(([anims, own, sailor]) => {
  loadClips(anims); loadClips(own);   // the shared library, then Tivoli's own shooting and peeking clips (tools/tivoli/pack_clips.mjs)
  person = sailor.scene; person.position.set(PERSON.x, 0, PERSON.z); scene.add(person); animate(person, 'Idle');
  $('start').disabled = false; $('start').textContent = 'Start'; $('loadnote').textContent = '';
  if (__DEV__) devViews(sailor);
});

$('start').onclick = () => { audioInit(); $('title').hidden = true; $('hud').hidden = false; state.started = true; setGoal('Walk to the sailor and talk to him.'); canvas.focus(); };
wireFight({ scene, camera, renderer, audioInit });
$('sound').onclick = () => { setSound(!AU.on); $('sound').textContent = AU.on ? 'Sound on' : 'Sound off'; };

/* ---------- dev only: test views. This whole block is left out of the public build. ---------- */
const DEVG = [];   // models whose feet are pinned to the ground each frame
const waitTick = () => new Promise((r) => setTimeout(r, 0));
function devLog(lines, title) { let el = $('autolog'); if (!el) { el = document.createElement('pre'); el.id = 'autolog'; el.style.cssText = 'position:fixed;left:0;bottom:0;max-height:45%;overflow:auto;margin:0;padding:6px;background:#000c;color:#cfc;font:11px monospace;z-index:9'; document.body.appendChild(el); } el.textContent = lines.join('\n'); document.title = title; }
async function devViews(sailor) {
  const q = new URLSearchParams(location.search), shot = q.get('shot'), test = q.get('test'), lo = q.has('lo') ? '_lo' : '';
  if (test === 'clips') { document.title = 'stand-ins: ' + (standIns().join(',') || 'none'); console.log('tivoli stand-in poses still in use:', standIns()); }
  if (q.get('scene') === 'fight') { await fightBegin(); const at = +(q.get('at') || 0); if (at) fightSkip(at); if (q.has('hold')) FIGHT.freeze = true; return; }
  if (!shot && !test) return;
  scene.remove(sailor.scene); await Promise.all(BODIES.flatMap((b) => [loadBase(b), loadBase(b + '_lo')]));
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
    const b = place(q.get('look') || 'soldier', 0, 0, +(q.get('yaw') || 0.6), q.get('clip') || 'ShootRifle'); arm(b, q.get('kind') || 'rifle', scene);
    const c = b.userData.anim.cur; c.time = c.getClip().duration * +(q.get('t') || 0.3); c.timeScale = 0;
    const cd = +(q.get('dist') || 1.15), ch = +(q.get('h') || 1.6); state.x = 0.15; state.z = cd; state.yaw = 0; state.pitch = -0.12; state.started = true; $('title').hidden = true; $('hud').hidden = true; state.camY = ch; document.title = 'hands';
  }
  if (shot === 'slung') {   /* ?shot=slung: the rifle slung across the back, from behind and from the front */
    const a = place('soldier', -0.5, 0, Math.PI, 'Idle'); arm(a, 'rifle', scene); const b = place('policeCamo', 0.5, 0, 0, 'Walk'); arm(b, 'rifle', scene);
    cam(0, 2.6, 0, -0.15); document.title = 'slung';
  }
  if (test === 'audit') {   /* ?test=audit: the street (built unmerged): floating signs, lamps, tanks, roofs, and anyone standing or running through a solid. Expect 0 issues. */
    const st = buildStreet({}), snap = snapMeshes(st.raw), r = auditPlace({ id: 'street', snap, npcs: fightPositions(), walls: [], bounds: { x0: -45, x1: 40, z0: -4.4, z1: 4.4 }, start: { x: -10, z: 0 }, actions: [], people: [] });
    const lines = ['street: ' + (r.floating.length + r.inside.length + r.stuck.length) + ' issues (' + r.floating.length + ' floating, ' + r.inside.length + ' inside solids, ' + r.stuck.length + ' unreachable)', ...r.floating.map((l) => '  floating: ' + l), ...r.inside.map((l) => '  inside: ' + l), ...r.stuck.map((l) => '  stuck: ' + l)];
    devLog(lines, 'AUDIT ' + (r.floating.length + r.inside.length + r.stuck.length));
  }
  if (test === 'layout') {   /* ?test=layout: show each card and title state and check that no two bits of text overlap, nothing is off the sides of the screen, and every button is big enough to touch (44 px). Run at 390x800, 320x568, 667x375, 800x500, 1280x720. */
    const out = [], W = innerWidth, Hh = innerHeight, st2 = document.createElement('style'); st2.textContent = '*{transition:none!important;animation:none!important}'; document.head.appendChild(st2);
    const ALL = ['title', 'fightcard', 'readcard', 'aftercard', 'fightload', 'scenetitle', 'windowframe', 'hud'], frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    for (const [name, show] of [['title', ['title']], ['opt-in card', ['fightcard']], ['read card', ['readcard']], ['after card', ['aftercard']], ['loading', ['fightload']], ['scene title over the window', ['scenetitle', 'windowframe']]]) {
      for (const id of ALL) $(id).hidden = !show.includes(id); await frames();
      const els = show.flatMap((id) => [...$(id).querySelectorAll('h1,h2,p,label,button,a,b')]).filter((e) => contentRects(e).length);
      for (const e of els) { for (const r of contentRects(e)) if (r.left < -1 || r.right > W + 1) out.push(`${W}x${Hh} ${name}: "${(e.textContent || '').slice(0, 30)}" is off the side of the screen`); if (e.matches('button,a.btn') && e.getBoundingClientRect().height < 44) out.push(`${W}x${Hh} ${name}: button "${e.textContent.slice(0, 24)}" is under 44 px tall`); }
      for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) if (!els[i].contains(els[j]) && !els[j].contains(els[i]) && contentsOverlap(els[i], els[j])) out.push(`${W}x${Hh} ${name}: "${els[i].textContent.slice(0, 24)}" overlaps "${els[j].textContent.slice(0, 24)}"`);
    }
    devLog(out.length ? out : [W + 'x' + Hh + ': no layout problems'], 'LAYOUT ' + out.length);
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
    for (const [look, clip, kind] of [['soldier', 'ShootRifle', 'rifle'], ['police', 'PeekAim', 'pistol'], ['soldier', 'ProneFire', 'rifle'], ['soldier', 'ProneTurnR', 'rifle'], ['police', 'ShootRifle', 'rifle'], ['police', 'ShootPistol', 'pistol'], ['police', 'Gunplay', 'pistol']]) {
      const b = makeBody({ ...LOOKS[look], anim: clip }); scene.add(b); arm(b, kind, scene); const ctl = b.userData.anim, D = ctl.cur.getClip().duration; let worstR = 0, worstL = 0, tipR = 0, tipL = 0;
      for (let k = 0; k < 12; k++) { ctl.cur.time = D * k / 12; ctl.mx.update(0); groundFeet(b); const r = heldReport(b); worstR = Math.max(worstR, r.right); worstL = Math.max(worstL, r.left); tipR = Math.max(tipR, r.rightTip); tipL = Math.max(tipL, r.leftTip); }
      const f = worstR > 4 || worstL > 4 || tipR > 3 || tipL > 3; if (f) bad++; out.push(`${f ? 'FAULT ' : ''}${look} ${clip} (${kind}): right hand ${worstR.toFixed(1)} cm from the grip, left hand ${worstL.toFixed(1)} cm from the handguard; fingertips ${tipR.toFixed(1)} cm (right) and ${tipL.toFixed(1)} cm (left) beyond them (worst of 12 moments)`);
      b.userData.weapon.mesh.removeFromParent(); ARMED.splice(ARMED.indexOf(b), 1); scene.remove(b); await waitTick(); }
    out.unshift('held: ' + bad + ' issues'); devLog(out, 'HELD ' + bad);
  }
  if (shot === 'uniforms') {   /* ?shot=uniforms (&lo for the light copies): soldier and police, front and back, close up */
    place('soldier', -1.5, 0, 0); place('soldier', -0.5, 0, Math.PI); place('police', 0.5, 0, 0); place('police', 1.5, 0, Math.PI);
    cam(0, 3.6, 0, -0.1); document.title = 'uniforms' + lo;
  }
  if (test === 'cloth') {   /* ?test=cloth (&b=soldier2010 &full or &lo &idle &where): does an under layer show through its cover (skin through a sleeve, shirt through the vest, hair through the helmet)? Both bodies, full and light copy, in the poses the game uses. */
    const out = []; let bad = 0, pts = 0; const POSE_LIST = [['Idle', 0.3], ['Walk', 0.25], ['Walk', 0.75], ['Run', 0.3], ['Talk1', 0.4], ['Point', 0.5], ['Block', 0.5]];
    for (const base of (q.get('b') ? q.get('b').split(',') : BODIES)) for (const l of ['', '_lo']) { if ((l && q.has('full')) || (!l && q.has('lo'))) continue; const b = makeBody({ base, bodyId: base + l, anim: 'Idle' }); scene.add(b);
      const r = auditCloth(base + l, b, { poses: q.has('idle') ? [['Idle', 0.3]] : POSE_LIST, where: q.has('where') }); out.push(base + l + ': ' + r.lines.length + ' faults, ' + r.points + ' points, worst ' + r.worst.toFixed(1) + ' mm'); for (const x of r.lines) out.push('  ' + x); bad += r.lines.length; pts += r.points; scene.remove(b); await waitTick(); }
    out.unshift('cloth: ' + bad + ' issues (' + pts + ' points)'); devLog(out, 'CLOTH ' + bad);
  }
  if (test === 'skin') {   /* ?test=skin: how dark each face really looks in this game's light (the copied engine skin probe) */
    const out = []; for (const [k, look] of Object.entries(LOOKS)) for (const l of ['', '_lo']) { const b = makeBody({ ...look, bodyId: look.base + l, x: 400, z: 400, anim: 'Idle' }); scene.add(b); b.userData.anim.mx.update(0.3);
      const r = skinProbe(renderer, scene, b); scene.remove(b); out.push(k + l + ': mean ' + r.rgb.join(',') + '  darkest ' + r.lo.join(',') + '  lightest ' + r.hi.join(',')); }
    devLog(out, 'SKIN ' + out.length);
  }
  if (test === 'walkers') {   /* ?test=walkers: each body walks and runs at game speed: feet must not slide, sink or float */
    const out = []; let bad = 0;
    for (const base of BODIES) for (const [clip, v] of [['Walk', 1.3], ['Run', 3.2]]) for (const l of ['', '_lo']) { const b = makeBody({ base, bodyId: base + l, ry: Math.PI / 2, anim: clip }); scene.add(b);
      const r = auditWalk(base + l + ' ' + clip, b, v); out.push(`${base}${l} ${clip} at ${v} m/s: stride ${(r.stride * 100).toFixed(0)} cm, clip speed ${r.pace.toFixed(2)}, slide ${r.slide.toFixed(1)} cm a loop, shoes ${r.sink.toFixed(1)} to ${r.float.toFixed(1)} cm`); for (const x of r.lines) { out.push('  ' + x); bad++; } scene.remove(b); await waitTick(); }
    out.unshift('walkers: ' + bad + ' issues'); devLog(out, 'WALKERS ' + bad);
  }
}

/* ---------- the frame loop ---------- */
let last = performance.now(), stepT = 0;
function frame(t) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (t - last) / 1000); last = t;
  if (FIGHT.on) fightTick(dt);   // the street scene moves its own people and takes over the camera
  if (state.started && !busy && !FIGHT.on) {
    if (keys.has('arrowleft')) state.yaw += 1.8 * dt; if (keys.has('arrowright')) state.yaw -= 1.8 * dt;
    let f = stick.id !== null ? -stick.dy : 0, r = stick.id !== null ? stick.dx : 0;
    if (keys.has('w') || keys.has('arrowup')) f += 1; if (keys.has('s') || keys.has('arrowdown')) f -= 1; if (keys.has('d')) r += 1; if (keys.has('a')) r -= 1;
    const len = Math.hypot(f, r);
    if (len > 0.05) { const sp = (keys.has('shift') ? 4.2 : 2.6) * Math.min(1, len), fx = -Math.sin(state.yaw), fz = -Math.cos(state.yaw);
      [state.x, state.z] = clampPos(state.x + (fx * f - fz * r) / Math.max(1, len) * sp * dt, state.z + (fz * f + fx * r) / Math.max(1, len) * sp * dt);
      stepT -= dt * sp; if (stepT <= 0) { stepT = 1.4; stepSound('sand'); } }
  }
  near = state.started && !busy && !FIGHT.on && Math.hypot(state.x - PERSON.x, state.z - PERSON.z) < 2.6; $('talk').hidden = !near;
  if (person) { const want = Math.atan2(state.x - PERSON.x, state.z - PERSON.z); let e = want - person.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); if (near || busy) person.rotation.y += e * Math.min(1, dt * 5); }   // turn to face you
  for (const mx of mixers) mx.update(dt); if (person && person.userData.anim) person.userData.anim.tick(dt);
  if (__DEV__) for (const m of DEVG) groundFeet(m);
  for (const m of ARMED) weaponTick(m);   // after the mixer and the feet: weapons follow the hands
  if (FIGHT.on) fightAfter(t / 1000); else { camera.position.set(state.x, state.camY || 1.6, state.z); camera.rotation.set(state.pitch, state.yaw, 0, 'YXZ'); }
  renderer.render(scene, camera);
}
requestAnimationFrame(frame);
