import { touchFirst } from '../../../engine/device.js';
import { addRecap } from "../../../engine/recap.js";   /* three things you learned, on the last card */
import "../../../engine/textfit.js";   // first: every sign's words fit their board (engine/textfit.js)
/* An all-ages mystery on the shared engine. It plays like every other game (walk, talk, do, watch a scene). Everything that differs from one mature game
   to the next is data: content.js (words), steps.js (the story table), places.js (the world) and cast.js (the people). */
import { renderFramed } from "../../../engine/cine.js";
import { createLookShot } from "../../../engine/lookshot.js";   /* looking at a thing is a close-up action (owner rule 13) */
import { sceneWarning, readWhatHappened } from "../../../engine/scene-warning.js";
import { placeActionButton } from "../../../engine/action-button.js";
import { returningTalker, callBack, comeOver } from "../../../engine/return-talk.js";
placeActionButton();   /* the button for a thing to do sits mid-screen (engine/action-button.js) */
import { offerNextChapter } from "../../../engine/chapter-end.js";
import { runQuiz } from "../../../engine/quiz.js";
import * as THREE from "three";
import { clone as skClone } from "three/addons/utils/SkeletonUtils.js";
import { model, onLoadFail } from "../../../engine/loader.js";
import { hudTidy } from "../../../engine/hud.js";
import { animate, loadClips, groundFeet } from "../../../engine/anim.js";
import { spreadArms, grip } from "../../../engine/grip.js";
import { createAmbient } from "../../../engine/ambient.js";
import { stop as stopFollow, tick as followTick, goTo } from "../../../engine/follow.js";
import { createStory, createCarry, needList } from "../../../engine/story.js";
import { createGuide } from "../../../engine/guide.js";   /* the gold arrow on the ground that shows the way (every game) */
import { slideWalls, walkRoute } from "../../../engine/placement.js";
import { releaseOnBlur, useInteractionKey } from "../../../engine/input.js";
import { AU, soundPref, setSound, audioInit, stepSound, uiSound, cue, setG, chirp, crackle, tone, noiseHit, shipCreak } from "../../../engine/audio.js";
import { snapMeshes } from "../../../engine/audit.js";
import { makeSky, G, cv } from "./gfx.js";
import { buildPlace, mergePlace } from "./places.js";
import { CAST, CROWD } from "./cast.js";
import { STEPS, TASKS, LOOKS, ITEMS, TASK_IDS } from "./steps.js";
import { GAME, CHAPTERS, chapterOf, PEOPLE, TALK, FLAVOUR, CARDS, FILMS, QUIZ } from "./content.js";
import { $, openPanel, dialogue, card, journal, chapters, closeAll, toast, showCount, newPage, goalSetup, setGoal, nudgeGoal, startHint, hintTick, createMarks } from "./ui.js";
import { createDirector } from "./director.js";
import * as P from "./props.js";
import { cockedHat } from "./ships.js";
import { tunePixels } from '../../../engine/perf.js';
import { setQuiet, stepPlaces } from '../../../engine/preload.js';
import { addExit } from '../../../engine/exit.js';

const KEY = GAME.id + "-save-v1",
  q = new URLSearchParams(location.search),
  QUICK = __DEV__ && (q.has("auto") || q.has("test") || q.has("shot"));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches,
  phone = touchFirst();   /* engine/device.js: an iPad in desktop mode and touch tablets too */
soundPref(GAME.id + "-sound");
const renderer = new THREE.WebGLRenderer({ canvas: $("stage"), antialias: true });
tunePixels(renderer, { phone, phoneMax: 1.4 });   /* pixel cap and slow-frame drop (engine/perf.js) */
renderer.outputColorSpace = THREE.SRGBColorSpace;
G.aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
const scene = new THREE.Scene(),
  camera = new THREE.PerspectiveCamera(66, 1, 0.07, 900);
scene.add(camera);
camera.rotation.order = "YXZ";
const sky = makeSky();
const iosWebGL = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
if (iosWebGL) sky.clouds.visible = false;   /* layered cloud sprites draw as coloured noise on some iPhones */
sky.objects.forEach((o) => scene.add(o));
const hemi = new THREE.HemisphereLight(0xfff1d4, 0x819183, 2.5),
  sun = new THREE.DirectionalLight(0xffe2b6, 2.1);
sun.position.set(-20, 42, 20);
scene.add(hemi, sun);
/* at night and indoors a soft light goes with you, as if your eyes had got used to the dark: faces near you can be read (owner rule 9) */
const nightFill = new THREE.PointLight(0xffe2b8, 0, 16, 1.3);
camera.add(nightFill);
/* the gold talk mark over the step's story person, and the talk button with a name over the nearest person (ui.js) */
const MARKS = createMarks({ scene, camera, canvas: $("stage"), onTap: (n) => talk(n) });
const env = cv(256, 128, (x, W, H) => {
  const g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#83a9bd");
  g.addColorStop(0.5, "#d9ddd2");
  g.addColorStop(1, "#747b70");
  x.fillStyle = g;
  x.fillRect(0, 0, W, H);
});
env.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = env;
scene.environmentIntensity = 0.25;
const playFov = () => (innerWidth / innerHeight < 0.8 ? 76 : 66);
function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.fov = playFov();
  camera.updateProjectionMatrix();
}
addEventListener("resize", resize);
resize();
const FIRST = CHAPTERS[0].first;
let saved = null;
try {
  saved = JSON.parse(localStorage.getItem(KEY));
  if (saved?.version !== 1 || !STEPS[saved.stage]) saved = null;
} catch {}
const S = { stage: FIRST, best: 0, x: 0, z: 0, yaw: 0, pitch: 0, started: false, journal: [], newPages: 0, completed: {}, placed: {}, found: {}, hand: null, teacher: false };
if (saved) S.best = saved.best || 0;
try {
  S.teacher = localStorage.getItem(GAME.id + "-teacher") === "on";
} catch {}
let current = null,
  busy = false,
  talking = null,
  near = null,
  epoch = 0,
  ready = false,
  skipIntro = false,
  last = performance.now(),
  saveT = 0,
  stepT = 0;
const worlds = {},
  bases = {},
  pending = {},
  worldLoads = {},
  keys = new Set(),
  stick = { id: null, dx: 0, dy: 0 },
  look = { id: null };
const world = () => worlds[current],
  carry = createCarry({ camera, fit: true });
addEventListener("resize", carry.fitView);
export const blocked = (Q, x, z, r = 0.24) =>
  x < Q.bounds.x0 + r || x > Q.bounds.x1 - r || z < Q.bounds.z0 + r || z > Q.bounds.z1 - r ||
  Q.walls.some((w) => x > w[0] - r && x < w[2] + r && z > w[1] - r && z < w[3] + r);
function loadBase(id) {
  return bases[id]
    ? Promise.resolve(bases[id])
    : pending[id] ||
        (pending[id] = model(id)
          .then((g) => (bases[id] = g))
          .catch((e) => {
            delete pending[id];
            throw e;
          }));
}
function body(spec) {
  const m = skClone(bases[spec.bodyId || spec.base].scene);
  m.traverse((o) => {
    if (!o.isMesh) return;
    if (o.userData.measureOnly || /^SkirtSeat/.test(o.name)) o.visible = false;
    o.frustumCulled = true;
    o.material = o.material.clone();
    o.material.forceSinglePass = true;
    if (o.material.name === "Skin") o.material.color.setScalar(1.55);   /* owner rule 9: skin reads in every light (Hair stays at 1) */
    if (o.material.name === "Hair") o.material.color.setScalar(1);
  });
  m.scale.setScalar(spec.scale || 1);
  m.position.set(spec.x, spec.ground || 0, spec.z);
  m.rotation.y = spec.ry || 0;
  m.userData.ground = spec.ground || 0;
  const behaviour = spec.life || spec.behaviour;
  const ctl = animate(m, behaviour?.seat ? behaviour.clips?.[0] || "SitIdle" : spec.idle || "Idle");
  ctl.mx.update(0);
  spreadArms(m, spec.sex === "f" ? 0.1 : 0.08);
  groundFeet(m);
  if (spec.held) holdThing(m, spec.held);
  if (spec.hat) wearHat(m, spec.hat);
  const hips = m.getObjectByName("mixamorigHips");
  if (hips) {
    m.updateMatrixWorld(true);
    m.userData.hip0 = hips.getWorldPosition(new THREE.Vector3()).y - m.position.y;
  }
  m.traverse((o) => {
    if (o.isSkinnedMesh) {
      o.computeBoundingSphere();
      o.boundingSphere.radius += 0.8;
    }
  });
  return { m, ctl };
}
/* something a person holds in the right hand (engine/grip.js): props.js held(kind) makes it and says how it is gripped */
function holdThing(m, kind) {
  m.updateMatrixWorld(true);
  const h = P.held(kind);
  if (!h) return;
  grip(m, "Right", h.obj, { handleY: h.handleY, scale: h.scale || 1, lift: h.lift || 0.3, straighten: h.straighten || 0.8 });
  m.userData.held = [{ obj: h.obj, bone: "RightHand", label: h.label }];
}
/* a hat modelled in the game's own code (an officer's cocked hat, ships.js), set on the head bone so that it turns with the head */
function wearHat(m, kind) {
  const head = m.getObjectByName("mixamorigHead"),
    top = m.getObjectByName("mixamorigHeadTop_End");
  if (!head || kind !== "cocked") return;
  m.updateMatrixWorld(true);
  const hat = cockedHat(),
    s = head.getWorldScale(new THREE.Vector3()).x || 1;
  hat.scale.setScalar(1 / s);
  hat.position.set(0, (top ? top.position.y : 0.18 / s) * 0.8, (0.012 / s));
  head.add(hat);
}
function ensure(id) {
  return worlds[id]
    ? Promise.resolve(worlds[id])
    : worldLoads[id] ||
        (worldLoads[id] = buildWorld(id).catch((e) => {
          delete worldLoads[id];
          for (const o of scene.children.filter((o) => o.name === id)) scene.remove(o);
          throw e;
        }));
}
/* engine/preload.js: the next place is built, and its shaders and textures sent, while the player reads (a conversation, a card, the title),
   so arriving there does not wait on a build. go() awaits the same cached ensure() promise, so nothing is built twice. */
const PLACES = stepPlaces({ steps: STEPS, chapters: CHAPTERS, chapterOf: (s) => chapterOf(s), worlds, ensure: (id) => ensure(id), current: () => current, renderer, camera, scene });
const { nextPlace, prepare, releaseFar } = PLACES;
async function buildWorld(id) {
  const Q = buildPlace(id, { phone, reduced });
  Q.group.name = id;
  Q.group.visible = false;
  scene.add(Q.group);
  if (__DEV__) Q.snap = snapMeshes(Q.group);
  mergePlace(Q);
  Q.people = [];
  Q.extras = [];
  const specs = Q.specs.map((s) => ({ ...CAST[s.cast], ...s, bodyId: CAST[s.cast].base + (s.raw ? "" : "_focus") }));
  const extras = Q.ambient.map((s) => ({ ...CROWD[s.look], ...s, base: s.look + (s.raw ? "" : phone ? "_phone" : "_crowd") }));
  await Promise.all([...new Set([...specs, ...extras].map((n) => n.bodyId || n.base))].map(loadBase));
  Q.life = createAmbient({ walls: Q.walls, bounds: Q.bounds, blocked: (x, z, r) => blocked(Q, x, z, r), keepOff: Q.keepOff, phone, seed: id.length * 91, mood: Q.mood || "calm" });
  Q.storyLife = createAmbient({ walls: Q.walls, bounds: Q.bounds, phone, seed: id.length * 137, mood: "calm" });
  for (const s of specs) {
    const n = { ...s, ...body(s) };
    Q.group.add(n.m);
    Q.people.push(n);
    MARKS.add(n);
    n.home = { x: s.x, z: s.z, ry: s.ry || 0 };
    Q.storyLife.add(
      n,
      s.life || { kind: "watch", idles: [s.idle || "Idle"], at: [n.x + Math.sin(s.ry || 0) * 4, n.z + Math.cos(s.ry || 0) * 4], react: ["Nod", "HeadTurn"], every: [4, 8] },
    );
  }
  for (const s of extras) {
    const n = { ...s, ...body(s) };
    Q.group.add(n.m);
    Q.extras.push(n);
    Q.life.add(n, { walk: n.sex === "m" ? "WalkM" : "Walk", idles: [n.idle || "Idle"], ...s.behaviour });
  }
  for (const n of Q.extras) if (typeof n.amb?.spec?.chase === "string") n.amb.spec.chase = Q.extras.find((o) => o.id === n.amb.spec.chase);
  Q.life.ready();
  Q.storyLife.ready();
  Q.relight = () => light(Q);   /* a camera scene may change the hour */
  worlds[id] = Q;
  addShadows(Q);
  return Q;
}
function addShadows(Q) {
  const people = [...Q.people, ...Q.extras],
    m = new THREE.MeshBasicMaterial({ map: P.shadowTexture(), transparent: true, depthWrite: false, opacity: 0.45 }),
    mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.9, 0.9), m, Math.max(1, people.length));
  mesh.rotation.x = -Math.PI / 2;
  mesh.count = people.length;
  Q.group.add(mesh);
  Q.shadows = { people, mesh };
}
function shadows(Q) {
  const { people, mesh } = Q.shadows,
    o = new THREE.Object3D();
  people.forEach((n, i) => {
    o.position.set(n.x, -n.z, 0.025);
    o.scale.setScalar(n.m.visible ? 0.8 * (n.scale || 1) : 0);
    o.updateMatrix();
    mesh.setMatrixAt(i, o.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
}
/* where a person, a thing to carry, a thing to look at or a spot to walk to is, in the place you are in (null when it is somewhere else) */
function where(id, kind) {
  const Q = world();
  if (!Q) return null;
  const n = Q.people.find((n) => n.id === id);
  if (kind === "talk" && n) return n.m.visible ? [n.x, n.z] : null;
  const task = TASKS[id];
  if (task) {
    if (task.place !== Q.id) return null;
    if (S.hand) return S.hand === task.item ? task.to : null;
    const item = Q.items[task.item],
      st = Q.itemStarts[task.item];
    if (!item || (st && item.parent === Q.group && item.position.distanceTo(new THREE.Vector3(...st.at)) < 0.05)) return task.from;
    return [item.position.x, item.position.z + 1.5];
  }
  const lk = LOOKS[id];
  if (lk) return lk.place === Q.id ? lk.at : null;
  const p = Q.points[id];
  return p ? [p.x, p.z] : null;
}
const story = createStory({
  steps: STEPS,
  where,
  player: () => [S.x, S.z],
  route: (to, from) => walkRoute(from, to, world().walls, 0.24, world().bounds)[0] || to,
  advance: (next) => advance(next),
  onGoal: (t) => setGoal(t),
  onArrow: () => nudgeGoal(),   /* when the arrow first shows in a step, the goal pops open */
  flavour: FLAVOUR,
  names: PEOPLE,
  items: Object.fromEntries(ITEMS.map((id) => [id, true])),
});
for (const id of [...TASK_IDS, ...Object.keys(LOOKS)]) story.shows(id, () => visuals());
function unlock(id) {
  if (!id || S.journal.includes(id)) return;
  S.journal.push(id);
  S.newPages++;
  showCount(S.newPages);
  uiSound("page");
  newPage(id);
  save();
}
function save() {
  if (!S.started) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: 1, ...S, story: story.save() }));
  } catch {
    notice("Progress could not be saved on this device.");
  }
}
function notice(text) {
  toast(text, 3200);
}
function applyPlaced(Q, id) {
  const t = TASKS[id],
    o = Q.items[t.item];
  if (!o || S.hand === t.item) return;
  Q.group.add(o);
  o.position.fromArray(t.at);
  o.rotation.set(0, t.ry || 0, 0);
  o.scale.set(1, 1, 1);
  o.visible = !t.hideAfter;
}
/* everything the story has changed in this place: what was carried lies where it was put, and what was looked at shows its changed state
   (a lid open, a cloth pulled back). Q.reveal[id](seen) is the place's own visible change for each thing to look at. */
function visuals() {
  const Q = world();
  if (!Q) return;
  for (const id of Object.keys(S.placed)) if (TASKS[id]?.place === Q.id) applyPlaced(Q, id);
  for (const [id, lk] of Object.entries(LOOKS)) if (lk.place === Q.id) Q.reveal[id]?.(!!S.found[id]);
  if (S.hand && carry.holding()) carry.holding().visible = true;
}
function resetSceneTasks() {
  carry.drop();
  S.hand = null;
  for (const Q of Object.values(worlds)) {
    for (const [id, a] of Object.entries(Q.itemStarts)) {
      const o = Q.items[id];
      Q.group.add(o);
      o.position.fromArray(a.at);
      o.scale.fromArray(a.scale);
      o.rotation.set(0, a.ry, 0);
      o.visible = true;
    }
    for (const n of Q.people) {
      stopFollow(n);
      n.x = n.home.x;
      n.z = n.home.z;
      n.m.position.set(n.x, n.ground || 0, n.z);
      n.m.rotation.y = n.home.ry;
      if (n.life?.seat) n.m.userData.seatAnchor = { ...n.life.seat };
      Q.storyLife.hold(n, false);
    }
  }
}
function chapterState(first) {
  resetSceneTasks();
  S.completed = {};
  S.placed = {};
  S.found = {};
  for (const [s, row] of Object.entries(STEPS))
    if (+s < first) for (const n of needList(row)) if (n.kind === "do") (LOOKS[n.id] ? S.found : S.placed)[n.id] = true;
}
/* the light of a place: Q.light = { top, hor, stars, moon, fog: [colour, near, far], sun: [colour, strength, x, y, z],
   hemi: [sky, ground, strength], fill } (fill: the soft light that goes with you at night and indoors) */
const DAY = { top: 0x71a7bf, hor: 0xe4d1a7, stars: 0, moon: 0, fog: [0xc7d7d1, 100, 550], sun: [0xffe2b6, 2.1, -20, 42, 20], hemi: [0xfff1d4, 0x819183, 2.5], fill: 0 };
function light(Q) {
  const L = { ...DAY, ...(Q.light || {}) };
  sky.setSky(L.top, L.hor, L.stars, L.moon, L.stars ? 0.35 : 1);
  sky.clouds.visible = !iosWebGL && !L.stars && !Q.indoor;
  scene.fog = new THREE.Fog(L.fog[0], L.fog[1], L.fog[2]);
  sun.color.set(L.sun[0]);
  sun.intensity = L.sun[1];
  sun.position.set(L.sun[2], L.sun[3], L.sun[4]);
  hemi.color.set(L.hemi[0]);
  hemi.groundColor.set(L.hemi[1]);
  hemi.intensity = L.hemi[2];
  nightFill.intensity = L.fill || 0;
  scene.environmentIntensity = L.stars || Q.indoor ? 0.08 : 0.25;
}
/* which people a step shows: a row's `show` lists the story people who are there (everyone else in the place's story cast is hidden);
   without it everyone is shown */
function cast(Q, row) {
  for (const n of Q.people) {
    const on = !row.show || row.show.includes(n.id);
    n.m.visible = on;
    if (!on && n.mark) n.mark.visible = false;
  }
}
async function go(stage, { restore = null, keep = false } = {}) {
  const generation = ++epoch;
  LS.cancel();
  busy = true;
  DIR.stop();
  dangerOff();
  closeAll();
  const old = current,
    row = STEPS[stage];
  if (!row) throw Error("Unknown stage " + stage);
  const change = old !== row.place;
  if (change && S.started && !QUICK) {
    $("fadeT").textContent = CHAPTERS[chapterOf(stage)].name;
    $("fadeS").textContent = CHAPTERS[chapterOf(stage)].year;
    $("fade").hidden = false;
  }
  let Q;
  const t0 = performance.now();
  try {
    Q = await ensure(row.place);
    if (__DEV__ && change) (window.__arrive ||= []).push([row.place, Math.round(performance.now() - t0)]);   /* dev: how long arriving waited on the place being built */
  } catch (e) {
    if (generation !== epoch) return;
    busy = false;
    $("fade").hidden = true;
    console.error(e);
    card("This chapter could not load", ["Check your connection and try again."], [["Try again", () => go(stage, { restore, keep })], ["Chapters", showChapters]]);
    return;
  }
  if (generation !== epoch) return;
  $("fade").hidden = true;
  for (const p of Object.values(worlds)) {
    p.group.visible = p === Q;
    for (const n of p.people)
      if (n.fol) {
        stopFollow(n);
        p.storyLife.hold(n, false);
      }
  }
  const newChapter = change || chapterOf(stage) !== chapterOf(S.stage);
  current = Q.id;
  PLACES.shown(Q.id);   /* drawn now, so sent again */
  S.stage = stage;
  if (newChapter && $("title").hidden) releaseFar(stage);
  prepare(nextPlace(stage));
  S.best = Math.max(S.best, chapterOf(stage));
  const at = row.start || Q.start;
  if (!keep || change || row.start) Object.assign(S, { x: at.x, z: at.z, yaw: at.yaw || 0, pitch: 0 });
  if (restore) {
    story.restore(restore.story);
    Object.assign(S, { x: restore.x, z: restore.z, yaw: restore.yaw, pitch: restore.pitch || 0 });
  } else story.sync(stage);
  if (S.hand && !carry.holding()) {
    const o = Q.items[S.hand];
    if (o) carry.carry(o);
    else S.hand = null;
  }
  cast(Q, row);
  Q.enter?.(stage, S);   /* the place's own change for this step (a door open, a fire lit, a rider gone) */
  visuals();
  light(Q);
  $("place").textContent = CHAPTERS[chapterOf(stage)].caption;
  $("stage").setAttribute("aria-label", $("place").textContent + ". Use movement controls to explore.");
  showCount(S.newPages);
  if (row.danger) dangerOn(Q, row.danger, !!restore);
  busy = false;
  save();
  const c = CHAPTERS[chapterOf(stage)];
  if (stage === c.first && stage !== FIRST && !restore && !skipIntro) {
    card(c.name, [c.intro], [["Begin", () => waits(stage)]]);
  } else await waits(stage);
  /* a save made after a chapter's last step was done, before Next chapter was pressed: offer the next chapter again */
  if (restore && needList(row).length && needList(row).every((n) => !story.needs(n.id))) advance(row.next);
  callBackReturn(stage);
}
/* the story's next talk is with someone you already talked to in this chapter: they come to you, no walking back (engine/return-talk.js) */
const TALK_STEPS = Object.fromEntries(Object.entries(STEPS).filter(([, st]) => st.needs && st.needs.talk).map(([k, st]) => [k, st.needs.talk]));
const personOf = (id) => world()?.people?.find((p) => p.id === id);
const NAME_OF = (id) => personOf(id)?.who || id.replace(/\d+$/, "");
function callBackReturn(st) {
  if (QUICK) return;
  const id = returningTalker(TALK_STEPS, st, NAME_OF);
  if (!id) return;
  callBack({
    still: () => S.stage === st,
    clear: () => !busy && !openPanel() && !DIR.on,
    talk: () => {
      const n = personOf(id);
      if (!n || !n.m || !n.m.visible || !story.needs(id) || n.m.userData.seatAnchor) return;
      comeOver(n, { px: S.x, pz: S.z, goTo, talk: () => { if (S.stage !== st || busy || openPanel() || DIR.on) return; stopFollow(n); S.yaw = Math.atan2(-(n.x - S.x), -(n.z - S.z)); talk(n); } });   /* they walk up to you, then talk */
    },
  });
}
async function advance(next) {
  unlock(STEPS[S.stage].journal);
  if (!next) return;
  if (chapterOf(next) !== chapterOf(S.stage)) {
    S.best = Math.max(S.best, chapterOf(next));
    save();
    nextPending = next;
    offerNextChapter({ still: () => nextPending === next, clear: () => !openPanel() && $("cineControls").hidden, show: nextCard, pause: QUICK ? 0 : undefined });
  } else await go(next, { keep: true });
}
/* a finished chapter: offer the next one on screen, as every game does, after a short pause on a clear screen and with no "Stay here" (engine/chapter-end.js) */
let nextPending = null;
function nextCard() {
  const next = nextPending,
    i = chapterOf(S.stage),
    nx = CHAPTERS[chapterOf(next)];
  uiSound("goal");
  card("Chapter " + (i + 1) + " is finished!", ["Next is " + nx.name + " (" + nx.year + ")."], [["Next chapter", () => { nextPending = null; chapterState(next); go(next); }]]);
}
function filmEnd(key) {
  const F = FILMS[key];
  unlock(F.journal);
  if (chapterOf(F.next) !== chapterOf(S.stage)) advance(F.next);
  else go(F.next);
}
function filmRead(key) {
  DIR.stop();
  readWhatHappened(card, { what: FILMS[key].read, go: () => filmEnd(key), pairs: true });   /* the standard What happened card (engine/scene-warning.js) */
}
const DIR = createDirector({ camera, world: () => world(), fast: QUICK, reduced, finish: filmEnd, read: filmRead, fov: playFov });
/* a step that is a card, a scene or the quiz, not something to walk to */
async function waits(st) {
  const row = STEPS[st],
    kind = row.card;
  if (!kind) return;
  if (kind === "film") {
    /* one card before a scene (engine/scene-warning.js): what happens, the standard lines if it may be frightening, Watch scene or Read instead */
    const data = CARDS[row.film];
    sceneWarning(card, { title: data.title, what: data.lines, scary: data.scary !== false, watch: () => go(st + 1, { keep: true }), read: () => filmRead(row.film), pairs: true });
  } else if (kind === "playing") DIR.start(row.film);
  else if (kind === "note") {
    const data = CARDS[row.note];
    card(data.title, data.lines, [[data.button || "Go on", () => advance(row.next)]]);
  } else if (kind === "quiz") {
    runQuiz({ title: QUIZ.title, items: QUIZ.items, sound: uiSound, fast: QUICK, done: () => advance(row.next) });
  } else if (kind === "end") {
    card(CARDS.end.title, CARDS.end.lines, [["Read the journal", showJournal], ["Chapters", showChapters]]);
    cue("end");
  }
}
function talk(n) {
  if (busy || openPanel() || DIR.on) return;
  const response = story.talk(n.id),
    L = response?.kind === "story" ? TALK[S.stage]?.[n.id] : [response?.line || "I have no more to say."];
  if (!L?.length) return;
  talking = n;
  S.yaw = Math.atan2(S.x - n.x, S.z - n.z);
  S.pitch = Math.atan2(0.15, Math.hypot(S.x - n.x, S.z - n.z));
  world().storyLife.hold(n, true);
  n.ctl.play(n.m.userData.seatAnchor ? "SitTalk" : n.sex === "m" ? ["TalkM2", "TalkM1"][S.stage % 2] : ["Talk1", "Talk3"][S.stage % 2]);
  dialogue(
    n.who,
    L,
    () => {
      if (response.kind === "story") {
        unlock(STEPS[S.stage].journal);
        story.done(n.id);
      }
      save();
    },
    () => {
      world().storyLife.hold(n, !!n.fol);
      if (n.m.userData.seatAnchor) n.ctl.play("SitIdle");
      else n.ctl.rest();
      talking = null;
    },
  );
}
/* a thing to look at: it changes where you can see it (a cloth pulled back, a lid lifted), then a card says what you found */
/* the sound of each look (engine/lookshot.js plays it as the thing moves): gentle, made in code like the rest of the game's sound */
const LOOK_SFX = {
  bell: () => [0, 0.45, 1.3, 1.75].forEach((d) => { tone(1320, 1310, 1.6, "sine", 0.045, 0, d); tone(2630, 2620, 0.8, "sine", 0.016, 0, d); }),   /* two pairs: ding-ding, ding-ding */
  glass: () => { noiseHit(3000, 2, 0.25, 0.06, 0.2, 0); noiseHit(2400, 2, 0.2, 0.05, 0.2, 0.35); },   /* the brass tubes drawn out */
  line: () => { noiseHit(1200, 0.6, 1.2, 0.12, -0.3, 0.2); noiseHit(600, 1.2, 0.5, 0.1, -0.3, 0.9); },   /* the line runs out, then jerks tight */
  paper: () => [0.2, 0.6, 1.0].forEach((d) => noiseHit(3400, 0.5, 0.3, 0.1, 0, d)),   /* old paper unfolded */
  flags: () => { [0, 0.4, 0.8, 1.2].forEach((d) => tone(900, 1100, 0.12, "sine", 0.02, -0.4, d)); noiseHit(1800, 0.6, 0.6, 0.06, -0.4, 1.7); },   /* a halyard block squeaks, the flags shake out */
  canvas: () => { noiseHit(2200, 0.5, 1.2, 0.1, 0.2, 0.1); shipCreak(); },   /* canvas drawn back over the hatch */
};
const _lq = new THREE.Quaternion(),
  _le = new THREE.Euler();
const LS = createLookShot({
  camera,
  fov: playFov,
  setFov: (f) => {
    if (Math.abs(camera.fov - f) < 0.01) return;
    camera.fov = f;
    camera.updateProjectionMatrix();
  },
  bars: (on) => document.body.classList.toggle("cine", on),
  say: (text) => {
    $("sub").textContent = text;
    $("sub").classList.toggle("dim", !text);
  },
  freeze: (on) => (busy = on),
  sound: (name) => AU.ctx && AU.on && AU.ctx.state === "running" && LOOK_SFX[name]?.(),
  quick: () => QUICK && !S.lookShot,
  reduced,
  home: () => ({ pos: new THREE.Vector3(S.x, GAME.eye, S.z), quat: _lq.setFromEuler(_le.set(S.pitch, S.yaw, 0, "YXZ")) }),
});
async function lookAt(id) {
  const lk = LOOKS[id],
    Q = world();
  S.found[id] = true;
  uiSound("tap");
  const st = S.stage,
    done = () => {
      if (S.stage !== st) return;
      unlock(lk.page);
      S.completed[id] = true;
      story.done(id);
      uiSound("goal");
      save();
    };
  /* a framing from the look itself, or from the place when it depends on how the place was built (a ship out in the harbour) */
  await LS.play({ view: lk.view || Q.lookViews?.[id], act: lk.act, sound: lk.sound, lines: lk.say, reveal: (k) => Q.reveal[id]?.(k) });
  if (S.stage !== st) return;
  if (openPanel()) {
    LS.cancel();
    return done();
  }
  card(lk.title, lk.lines, [[lk.button || "Go on", async () => { await LS.back(); done(); }]]);
}
function action(id) {
  if (busy || openPanel() || DIR.on || !story.needs(id)) return;
  if (LOOKS[id]) return lookAt(id);
  const t = TASKS[id],
    Q = world();
  if (!t) return;
  if (S.hand !== t.item) {
    if (S.hand) {
      notice("Put down what you are carrying first.");
      return;
    }
    const o = Q.items[t.item];
    if (!o) throw Error("Missing item " + t.item + " in " + Q.id);
    S.hand = t.item;
    o.name = t.item;
    carry.carry(o);
    notice(t.put);
    save();
    return;
  }
  const o = carry.holding();
  carry.place(o, { parent: Q.group, at: t.at });
  S.hand = null;
  S.placed[id] = true;
  applyPlaced(Q, id);
  S.completed[id] = true;
  story.done(id);
  uiSound("goal");
  save();
}
function interact(n) {
  if (!n) {
    findNear();
    n = near;
  }
  if (n) n.kind === "talk" ? talk(n.n) : action(n.id);
}
function showJournal() {
  journal(S.journal, "", () => {
    S.newPages = 0;
    showCount(0);
    save();
  });
}
function begin() {
  if (!S.started) startHint(phone);   /* the controls tip, for a few seconds at the start of play */
  S.started = true;
  $("title").hidden = true;
  $("hud").hidden = false;
}
function playChapter(c) {
  begin();
  nextPending = null;
  chapterState(c.first);
  go(c.first);
}
const LAST = Math.max(...Object.keys(STEPS).map(Number));
function showChapters() {
  chapters({
    best: S.best,
    done: (i) => i < S.best || (i === CHAPTERS.length - 1 && S.stage === LAST),
    teacher: S.teacher,
    choose: playChapter,
    toggle: () => {
      S.teacher = !S.teacher;
      try {
        localStorage.setItem(GAME.id + "-teacher", S.teacher ? "on" : "off");
      } catch {}
      save();
      showChapters();
    },
    erase: eraseAll,
  });
}
function eraseAll() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  S.started = false;   /* nothing more is saved before the page reloads */
  location.reload();
}
/* the reset button: start this chapter again, or the whole story (as in every game) */
function resetPrompt() {
  if (DIR.on) return;
  const c = CHAPTERS[chapterOf(S.stage)];
  card("Reset", ["Start this chapter again, or start the whole story again."], [
    ["Restart “" + c.name + "”", () => playChapter(c)],
    ["Start the whole story again", () => card("Start again?", ["This wipes everything, even your journal."], [["Yes, start again", eraseAll], ["No, keep playing", () => {}]])],
    ["Cancel", () => {}],
  ]);
}
$("jbtn").onclick = showJournal;
$("jchap").onclick = showChapters;
$("tchap").onclick = showChapters;
$("reset").onclick = resetPrompt;
goalSetup({
  started: () => S.started,
  tap: () => {
    if (nextPending === null || openPanel()) return false;
    nextCard();
    return true;
  },
});
function soundButton() {
  $("snd").setAttribute("aria-pressed", AU.on);
  $("snd").setAttribute("aria-label", AU.on ? "Sound on. Tap to turn off." : "Sound off. Tap to turn on.");
  $("sndon").hidden = !AU.on;
  $("sndoff").hidden = AU.on;
  $("cineSound").textContent = AU.on ? "Sound on" : "Sound off";
  $("cineSound").setAttribute("aria-pressed", AU.on);
}
$("snd").onclick = () => {
  setSound(!AU.on);
  soundButton();
};
$("cineSound").onclick = () => $("snd").click();
soundButton();
$("talk").onclick = () => interact();
addEventListener("keydown", (e) => {
  keys.add(e.key.toLowerCase());
  if (S.started && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) && !openPanel()) e.preventDefault();
  useInteractionKey(e, () => {
    if (!$("dialogue").hidden) {
      $("next").click();
      return;
    }
    if (!openPanel() && !DIR.on) interact();
  });
});
addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));
releaseOnBlur(keys, [stick, look]);
const canvas = $("stage");
canvas.addEventListener("pointerdown", (e) => {
  if (!S.started || openPanel() || DIR.on) return;
  if (e.pointerType === "touch" && e.clientX < innerWidth / 2 && stick.id === null) {
    stick.id = e.pointerId;
    stick.x = e.clientX;
    stick.y = e.clientY;
    stick.dx = stick.dy = 0;
  } else Object.assign(look, { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0 });
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove", (e) => {
  if (e.pointerId === stick.id) {
    stick.dx = Math.max(-1, Math.min(1, (e.clientX - stick.x) / 50));
    stick.dy = Math.max(-1, Math.min(1, (e.clientY - stick.y) / 50));
  } else if (e.pointerId === look.id) {
    const dx = e.clientX - look.x,
      dy = e.clientY - look.y;
    look.moved += Math.abs(dx) + Math.abs(dy);
    S.yaw -= dx * 0.005;
    S.pitch = Math.max(-1.15, Math.min(1.15, S.pitch - dy * 0.004));
    look.x = e.clientX;
    look.y = e.clientY;
  }
});
function endPointer(e) {
  if (e.pointerId === stick.id) {
    stick.id = null;
    stick.dx = stick.dy = 0;
  }
  if (e.pointerId === look.id) {
    if (look.moved < 8) {
      /* a tap on a person talks to them */
      const n = S.started && !busy && !openPanel() && !DIR.on ? MARKS.tap(e.clientX, e.clientY, world().people, S.x, S.z, TALK_R) : null;
      if (n) talk(n);
    }
    look.id = null;
  }
}
canvas.addEventListener("pointerup", endPointer);
canvas.addEventListener("pointercancel", endPointer);
function move(dt) {
  if (!S.started || busy || openPanel() || DIR.on) return;
  const Q = world();
  let fw = (keys.has("w") || keys.has("arrowup") ? 1 : 0) - (keys.has("s") || keys.has("arrowdown") ? 1 : 0) - stick.dy,
    rt = (keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0) + stick.dx;
  if (keys.has("arrowleft")) S.yaw += dt * 1.6;
  if (keys.has("arrowright")) S.yaw -= dt * 1.6;
  const length = Math.hypot(fw, rt);
  if (length > 1) {
    fw /= length;
    rt /= length;
  }
  if (length > 0.04) {
    const speed = keys.has("shift") ? 3.6 : 2.6,
      p = slideWalls([S.x, S.z], [S.x + (-Math.sin(S.yaw) * fw + Math.cos(S.yaw) * rt) * speed * dt, S.z + (-Math.cos(S.yaw) * fw - Math.sin(S.yaw) * rt) * speed * dt], Q.walls, 0.23);
    if (![...Q.people, ...Q.extras].some((n) => n.m.visible && Math.hypot(n.x - p[0], n.z - p[1]) < 0.45)) {
      S.x = Math.max(Q.bounds.x0 + 0.25, Math.min(Q.bounds.x1 - 0.25, p[0]));
      S.z = Math.max(Q.bounds.z0 + 0.25, Math.min(Q.bounds.z1 - 0.25, p[1]));
    }
    if ((stepT += dt) > 0.48) {
      stepT = 0;
      stepSound(Q.floor || "sand");
    }
  }
  for (const need of needList(STEPS[S.stage]).filter((n) => n.kind === "go" && story.needs(n.id))) {
    const p = where(need.id, need.kind);
    if (p && Math.hypot(S.x - p[0], S.z - p[1]) < 1.5) story.done(need.id);
  }
}
/* ---------- a watched stretch (a step with `danger`): the mature games' one new way to play ----------
   Someone is looking out over part of the place. While they look, you must be in cover (Q.danger[name].cover, a list of rectangles): behind
   a wall, a rock, a tree. In the open a ring closes in on the screen for a moment or two, time enough to reach cover. If it closes there is a
   gunshot, the dust jumps beside you, and you are back at the last cover you reached. Nobody is hit, here or anywhere in these games.
   The place says when the watcher looks (look(t) -> 0..1) and shows it (show(k): a shutter opens, a figure stands at the loophole). */
const DANGER = { on: null, t: 0, seen: 0, safe: null, cool: 0 };
function dangerOn(Q, name, restoring) {
  const D = Q.danger?.[name];
  if (!D) return;
  DANGER.on = D;
  DANGER.t = 0;
  DANGER.seen = 0;
  DANGER.cool = 2.5;
  DANGER.safe = restoring ? [S.x, S.z, S.yaw] : [D.start[0], D.start[1], D.start[2] || 0];
}
function dangerOff() {
  if (DANGER.on) DANGER.on.show?.(0);
  DANGER.on = null;
  $("vig").style.opacity = 0;
}
const inRect = (r, x, z) => x >= r[0] && x <= r[2] && z >= r[1] && z <= r[3];
function dangerTick(dt, quiet) {
  const D = DANGER.on;
  if (!D) return;
  if (!quiet) {
    $("vig").style.opacity = 0;
    return;
  }
  DANGER.t += dt;
  DANGER.cool = Math.max(0, DANGER.cool - dt);
  const k = D.look(DANGER.t);   /* 0: not looking; rising toward 1 as the shutter opens; 1: looking */
  D.show?.(k);
  const covered = D.cover.some((r) => inRect(r, S.x, S.z)),
    exposed = inRect(D.zone, S.x, S.z) && !covered;
  if (covered) DANGER.safe = [S.x, S.z, S.yaw];
  if (exposed && k >= 1 && !DANGER.cool) DANGER.seen += dt / (D.grace || 1.6);
  else DANGER.seen = Math.max(0, DANGER.seen - dt * 1.5);
  $("vig").style.opacity = Math.min(1, DANGER.seen * 1.1).toFixed(2);
  if (DANGER.seen >= 1) {
    DANGER.seen = 0;
    DANGER.cool = 3;
    gunshot();
    flash();
    [S.x, S.z, S.yaw] = DANGER.safe;
    S.pitch = 0;
    notice(D.line || "A shot! The dust jumps beside you. You run back to cover.");
  }
}
/* a flintlock, far off: a sharp crack, then the boom rolling round the hills */
function gunshot(vol = 1) {
  if (!AU.ctx || !AU.on) return;
  noiseHit(2400, 0.7, 0.07, 0.5 * vol, 0, 0);
  noiseHit(420, 0.5, 0.5, 0.42 * vol, 0, 0.02);
  noiseHit(160, 0.6, 1.3, 0.3 * vol, 0, 0.12);
}
function flash() {
  if (reduced) return;
  const f = $("flash");
  f.style.transition = "none";
  f.style.opacity = 0.5;
  requestAnimationFrame(() => {
    f.style.transition = "opacity .5s";
    f.style.opacity = 0;
  });
}
const TALK_R = 2.35;   /* how near you must be to talk: the talk button and a tap on a person (engine/tap.js) use the same reach */
function findNear() {
  near = null;
  if (!S.started || busy || openPanel() || DIR.on) return;
  const candidates = [];
  for (const n of world().people)
    if (n.m.visible) candidates.push({ kind: "talk", n, id: n.id, label: "Talk to " + n.who, x: n.x, z: n.z, priority: story.marked(n.id) ? 0 : 2 });
  for (const n of needList(STEPS[S.stage]))
    if (n.kind === "do" && story.needs(n.id)) {
      const p = where(n.id, n.kind),
        t = TASKS[n.id],
        lk = LOOKS[n.id];
      if (p) candidates.push({ kind: "do", id: n.id, label: lk ? lk.label : S.hand === t.item ? t.put : t.label, x: p[0], z: p[1], priority: 0 });
    }
  for (const c of candidates) c.dist = Math.hypot(S.x - c.x, S.z - c.z);
  near = candidates.filter((c) => c.dist < TALK_R).sort((a, b) => a.priority - b.priority || a.dist - b.dist)[0] || null;
}
let GUIDE = null;
function hint(now) {
  const quiet = S.started && !busy && !openPanel() && !DIR.on,
    h = story.tick(now, quiet);
  $("nudge").hidden = true;
  if (!GUIDE) GUIDE = createGuide({ scene, camera, ground: () => 0, eye: () => GAME.eye });   /* the arrow is laid out for this game's eye height */
  /* a gold arrow on the ground points the way, a gold ring marks the place */
  if (h.show && quiet) GUIDE.point(now, { x: h.x, z: h.z, tx: h.target[0], tz: h.target[1], final: h.final });
  else GUIDE.hide(now);
  /* the Talk button is for things to do; a person you can talk to gets the gold talk button over their head */
  hintTick(quiet);
  const act = quiet && near?.kind === "do";
  $("talk").hidden = !act;
  if (act) $("talk").textContent = near.label;
  MARKS.tick(now / 1000, { people: world().people, show: quiet, marked: (n) => !!story.marked(n.id), near: quiet && near?.kind === "talk" ? near.n : null, px: S.x, pz: S.z });
  /* the joystick: faint at rest, under the left thumb when it moves */
  const el = $("stick");
  el.hidden = !phone || !quiet;
  if (phone && quiet) {
    const rest = stick.id === null;
    el.classList.toggle("rest", rest);
    el.style.left = (rest ? 84 : stick.x) + "px";
    el.style.top = (rest ? innerHeight - 150 : stick.y) + "px";
    $("nub").style.transform = `translate(calc(-50% + ${stick.dx * 30}px), calc(-50% + ${stick.dy * 30}px))`;
  }
  return quiet;
}
function tick(dt, now = performance.now()) {
  const Q = world();
  if (!Q) return;
  move(dt);
  const frozen = busy || (openPanel() && !talking) || DIR.paused;
  const W = { px: S.x, pz: S.z, talking, story: Q.people.filter((n) => n.m.visible && story.marked(n.id)), view: { x: camera.position.x, z: camera.position.z, yaw: S.yaw } };
  const t = now / 1000;
  if (!frozen) for (const f of Q.tickers) f(t, dt);
  Q.life.tick(frozen ? 0 : dt, W);
  Q.storyLife.tick(frozen ? 0 : dt, { ...W, story: [] });
  for (const n of Q.people)
    if (n.fol) followTick(n, frozen ? 0 : dt, { px: S.x, pz: S.z, walls: Q.walls, bounds: Q.bounds, blocked: (x, z, r) => blocked(Q, x, z, r), others: Q.people, talking });
  shadows(Q);
  if (DIR.on) DIR.tick(dt);
  else if (LS.tick(dt)) {
    /* a look moment holds the camera */
  } else if (__DEV__ && S.view) {
    camera.position.set(...S.view.pos);
    camera.lookAt(...S.view.look);
  } else if (!S.started) {
    const k = reduced ? 0 : now * 0.00004,
      T = GAME.title;
    camera.position.set(T.pos[0] + Math.sin(k) * 0.6, T.pos[1] + Math.sin(k * 1.7) * 0.06, T.pos[2] + Math.sin(k * 0.8) * 0.35);
    camera.lookAt(...T.look);
  } else {
    camera.position.set(S.x, GAME.eye, S.z);
    camera.rotation.set(S.pitch, S.yaw, 0, "YXZ");
  }
  findNear();
  const quiet = hint(now);
  dangerTick(dt, quiet);
  if (S.started) audioTick(Q, dt);
  if (__DEV__) camera.userData.checkPlace = Q;   // Match camera probes to the scene actually drawn, including chapter transitions.
  renderFramed(renderer, scene, camera, DIR.on || LS.on);
  if (S.started && (saveT += dt) > 3) {
    saveT = 0;
    save();
  }
}
/* the sound of each place: Q.beds = { wind, crowd, room, sea, surf, bird, fire, owl } (levels, or how often for the one-shot sounds) */
let bedT = 0;
function audioTick(Q, dt) {
  if (!AU.ctx || !AU.on || AU.ctx.state !== "running" || (bedT += dt) < 0.1) return;
  const B = Q.beds || {},
    k = talking ? 0.6 : 1,
    t = bedT;
  bedT = 0;
  for (const ch of ["sea", "surf", "wind", "crowd", "room"]) if (AU.ch[ch]) setG(AU.ch[ch], (B[ch] || 0) * k, 0.8);
  if (B.bird && Math.random() < B.bird * t * 0.6) chirp();
  if (B.fire && Math.random() < B.fire * t * 2) crackle();
  if (B.owl && Math.random() < B.owl * t * 0.12) {
    tone(392, 380, 0.5, "sine", 0.03, -0.4);   /* a night bird, two soft notes */
    tone(330, 322, 0.7, "sine", 0.03, -0.4, 0.6);
  }
}
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  tick(dt, now);
}
async function start() {
  if (!ready) return;
  audioInit();
  begin();
  if (saved) {
    const d = saved;
    saved = null;
    Object.assign(S, d, { started: true });
    await go(d.stage, { restore: d });
    return;
  }
  await go(FIRST);
  if (!skipIntro) card(CHAPTERS[0].name, [CHAPTERS[0].intro, GAME.fiction], [["Begin", () => waits(FIRST)]]);   /* the first step is a scene card: it comes after the intro */
}
$("start").onclick = start;
onLoadFail(() => {
  $("loadnote").textContent = "Some parts of the world could not load. Please reload.";
});
(async () => {
  try {
    loadClips(await model("anims"));
    $("bar").style.width = "25%";
    const Q = await ensure(GAME.title.place);
    current = GAME.title.place;
    Q.group.visible = true;
    cast(Q, STEPS[FIRST].place === Q.id ? STEPS[FIRST] : {});
    light(Q);
    $("bar").style.width = "100%";
    ready = true;
    $("start").disabled = false;
    $("start").textContent = saved ? "Continue" : "Start";
    $("tchap").hidden = false;
    $("savenote").hidden = !saved;
    $("loadnote").hidden = true;
    requestAnimationFrame(frame);
    /* engine/preload.js: the player is reading, not moving, while a panel (a conversation, a card, the journal), the chapter fade or the title is on screen */
    setQuiet(() => openPanel() || !$("fade").hidden || !$("title").hidden);
    prepare(STEPS[saved?.stage]?.place || STEPS[FIRST].place);   /* the place Start opens, built behind the title */
    if (__DEV__) {
      const { dev } = await import("./dev.js");
      await dev({ q, S, story, worlds, ensure, world, go, start, action, talk, carry, where, blocked, save, DIR, DANGER, skip: () => (skipIntro = true), begin, renderer, camera, scene, body, loadBase, tick, frame, chapterState, resetSceneTasks, light, LS, lookAt });
    }
  } catch (e) {
    console.error(e);
    $("loadnote").textContent = "The game could not load. Please reload.";
  }
})();
hudTidy();   /* the toast keeps clear of the action button and wraps its words (engine/hud.js) */
addRecap({ items: GAME.recap, open: () => { closeAll(); showJournal(); }, title: CARDS.end.title, unlocked: null });   /* three tappable journal pages on the last card (engine/recap.js) */
addExit({ url: '../../../menu/', save: () => save() });   /* Exit, right of the Journal button, with an "are you sure" (engine/exit.js) */
