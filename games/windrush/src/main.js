import { touchFirst } from '../../../engine/device.js';
import "../../../engine/textfit.js";   // first: every sign's words fit their board (engine/textfit.js)
/* A family story built on the existing engine, with no shared-module changes. */
import { renderFramed } from "../../../engine/cine.js";   /* camera scenes framed for a phone held upright (engine/cine.js) */
import * as THREE from "three";
import { clone as skClone } from "three/addons/utils/SkeletonUtils.js";
import { model, onLoadFail } from "../../../engine/loader.js";
import { hudTidy } from "../../../engine/hud.js";
import { animate, loadClips, groundFeet } from "../../../engine/anim.js";
import { steadyLoad, spreadArms, gripTick, grip } from "../../../engine/grip.js";
import { createAmbient } from "../../../engine/ambient.js";
import {
  lead,
  stop as stopFollow,
  tick as followTick,
} from "../../../engine/follow.js";
import {
  createStory,
  createCarry,
  needList,
} from "../../../engine/story.js";
import { createGuide } from "../../../engine/guide.js"; /* the gold arrow on the ground that shows the way (every game) */
import { slideWalls, walkRoute } from "../../../engine/placement.js";
import { releaseOnBlur, useInteractionKey } from "../../../engine/input.js";
import {
  AU,
  soundPref,
  setSound,
  audioInit,
  stepSound,
  uiSound,
  cue,
  setG,
  gullCry,
  chirp,
  shipCreak,
} from "../../../engine/audio.js";
import { snapMeshes } from "../../../engine/audit.js";
import { makeSky, G, cv } from "./gfx.js";
import { buildPlace, mergePlace, PLACE_IDS } from "./places.js";
import { CAST, CROWD } from "./cast.js";
import { hold, suitcase, marketBasket } from "./period-props.js";
import { rideShip } from "./sea.js";
import { SHIP } from "./ship.js";
import { shoppingBag, headBasket } from "./scenery.js";
import { STEPS, TASKS, ITEMS, TASK_IDS } from "./steps.js";
import {
  CHAPTERS,
  chapterOf,
  PEOPLE,
  TALK,
  FLAVOUR,
  CARDS,
  FILMS,
} from "./content.js";
import {
  $,
  openPanel,
  dialogue,
  card,
  journal,
  chapters,
  closeAll,
  toast,
  showCount,
  newPage,
  goalSetup,
  setGoal,
  nudgeGoal,
  startHint,
  hintTick,
  createMarks,
} from "./ui.js";
import { createDirector } from "./director.js";
import * as P from "./props.js";
import { tunePixels } from '../../../engine/perf.js';
import { setQuiet, stepPlaces } from '../../../engine/preload.js';
import { addExit } from '../../../engine/exit.js';
const KEY = "windrush-save-v1",
  q = new URLSearchParams(location.search),
  QUICK = __DEV__ && (q.has("auto") || q.has("test"));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches,
  phone = touchFirst() /* engine/device.js: an iPad in desktop mode and touch tablets too */;
soundPref("windrush-sound");
const renderer = new THREE.WebGLRenderer({
  canvas: $("stage"),
  antialias: true,
});
tunePixels(renderer, { phone, phoneMax: 1.4 });   /* pixel cap and slow-frame drop (engine/perf.js) */
renderer.outputColorSpace = THREE.SRGBColorSpace;
G.aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
const scene = new THREE.Scene(),
  camera = new THREE.PerspectiveCamera(66, 1, 0.07, 900);
scene.add(camera);
camera.rotation.order = "YXZ";
const sky = makeSky();
// On mobile Safari, the layered translucent cloud sprites can render as
// multicoloured stipple/noise against the sky. Keep the smooth sky dome but
// disable only those cloud sprites on affected iOS WebGL devices.
const iosWebGL = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
if (iosWebGL) sky.clouds.visible = false;
sky.objects.forEach((o) => scene.add(o));
const hemi = new THREE.HemisphereLight(0xfff1d4, 0x819183, 2.5),
  sun = new THREE.DirectionalLight(0xffe2b6, 2.1);
sun.position.set(-20, 42, 20);
scene.add(hemi, sun);
/* the gold talk marks over the step's story people, and the talk button with a name over the nearest person (ui.js) */
const MARKS = createMarks({
  scene,
  camera,
  canvas: $("stage"),
  onTap: (n) => talk(n),
});
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
function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.fov = innerWidth / innerHeight < 0.8 ? 76 : 66;
  camera.updateProjectionMatrix();
}
addEventListener("resize", resize);
resize();
let saved = null;
try {
  saved = JSON.parse(localStorage.getItem(KEY));
  if (saved?.version !== 1 || !STEPS[saved.stage]) saved = null;
} catch {}
const S = {
  stage: 10,
  best: 0,
  x: 0,
  z: 13,
  yaw: 0,
  pitch: 0,
  started: false,
  journal: [],
  newPages: 0,
  memory: "",
  firstMemory: "",
  completed: {},
  placed: {},
  hand: null,
  teacher: false,
};
if (saved) S.best = saved.best || 0;
try {
  S.teacher = localStorage.getItem("windrush-teacher") === "on";
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
  x < Q.bounds.x0 + r ||
  x > Q.bounds.x1 - r ||
  z < Q.bounds.z0 + r ||
  z > Q.bounds.z1 - r ||
  Q.walls.some(
    (w) => x > w[0] - r && x < w[2] + r && z > w[1] - r && z < w[3] + r,
  );
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
    if (o.material.name === "Skin") o.material.color.setScalar(1.55);
    if (o.material.name === "Hair") o.material.color.setScalar(1);
  });
  m.scale.setScalar(spec.scale || 1);
  m.position.set(spec.x, spec.ground || 0, spec.z);
  m.rotation.y = spec.ry || 0;
  m.userData.ground = spec.ground || 0;
  const ctl = animate(m, spec.life?.seat ? spec.life.clips?.[0] || "SitIdle" : spec.idle || "Idle");
  ctl.mx.update(0);
  spreadArms(m, spec.sex === "f" ? 0.16 : 0.08);
  groundFeet(m);
  if (spec.held) holdThing(m, spec.held);
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
/* something a person holds: a suitcase or a shopping bag in the right hand (engine/grip.js), a basket on the head */
function holdThing(m, kind) {
  m.updateMatrixWorld(true);
  let obj, label;
  if (kind === "headload") {
    obj = headBasket();
    hold(m, "Head", obj, { dy: 0.13 });
    steadyLoad(m, obj); // a hand steadies the load on the head (engine/grip.js)
    label = "basket on the head";
    m.userData.held = [{ obj, bone: "Head", label, head: true }];
    return;
  }
  if (kind === "case") {
    obj = suitcase([0x6b4a30, 0x3e4a56, 0x7a5a3a][(m.id || 0) % 3]);
    grip(m, "Right", obj, { handleY: 0.5, scale: 0.8, lift: 0.38, straighten: 0.85 });
    label = "suitcase";
  } else {
    obj = shoppingBag();
    grip(m, "Right", obj, { handleY: obj.userData.handleY, scale: 1, lift: 0.3, straighten: 0.8 });
    label = "shopping bag";
  }
  m.userData.held = [{ obj, bone: "RightHand", label }];
}
function ensure(id) {
  return worlds[id]
    ? Promise.resolve(worlds[id])
    : worldLoads[id] ||
        (worldLoads[id] = buildWorld(id).catch((e) => {
          delete worldLoads[id];
          for (const o of scene.children.filter((o) => o.name === id))
            scene.remove(o);
          throw e;
        }));
}
/* engine/preload.js: the next place is built, and its shaders and textures sent, while the player reads (a conversation, a card, the title),
   so arriving there no longer waits on a build. go() awaits the same cached ensure() promise, so nothing is built twice and a fast player
   only waits as before. ahead() is not used: a place's people are known only once buildPlace has run, and the job downloads them itself. */
const PLACES = stepPlaces({ steps: STEPS, chapters: CHAPTERS, chapterOf: (s) => chapterOf(s), worlds, ensure: (id) => ensure(id), current: () => current, renderer, camera, scene });
const { nextPlace, prepare, releaseFar } = PLACES;   /* engine/preload.js: the next place built and warmed in quiet moments, far places let go */
async function buildWorld(id) {
  const Q = buildPlace(id, { phone, reduced });
  Q.group.name = id;
  Q.group.visible = false;
  scene.add(Q.group);
  if (__DEV__) Q.snap = snapMeshes(Q.group);
  mergePlace(Q);
  Q.people = [];
  Q.extras = [];
  const specs = Q.specs.map((s) => ({
    ...CAST[s.cast],
    ...s,
    bodyId: CAST[s.cast].base + (s.raw ? "" : "_focus"),
  }));
  const extras = Q.ambient.map((s) => ({
    ...CROWD[s.look],
    ...s,
    base: s.look + (s.raw ? "" : phone ? "_phone" : "_crowd"),
  }));
  await Promise.all(
    [...new Set([...specs, ...extras].map((n) => n.bodyId || n.base))].map(
      loadBase,
    ),
  );
  const keepOff = Q.keepOff;
  Q.life = createAmbient({
    walls: Q.walls,
    bounds: Q.bounds,
    blocked: (x, z, r) => blocked(Q, x, z, r),
    keepOff,
    phone,
    seed: id.length * 91,
    mood: "lively",
  });
  Q.familyLife = createAmbient({
    walls: Q.walls,
    bounds: Q.bounds,
    phone,
    seed: id.length * 137,
    mood: "calm",
  });
  if (Q.props.ship && Q.ambient.some((s) => s.zone === "ship"))
    Q.shipLife = createAmbient({
      walls: [],
      bounds: { x0: -45, z0: -9.4, x1: 45, z1: 9.4 },
      phone,
      seed: 1948,
      mood: "lively",
    });
  for (const s of specs) {
    const n = { ...s, ...body(s) };
    Q.group.add(n.m);
    Q.people.push(n);
    MARKS.add(n);
    n.home = { x: s.x, z: s.z, ry: s.ry || 0 };
    Q.familyLife.add(
      n,
      s.life || {
        kind: "watch",
        idles: [s.idle || "Idle"],
        at: [n.x + Math.sin(s.ry || 0) * 4, n.z + Math.cos(s.ry || 0) * 4],
        react: ["Nod", "HeadTurn"],
        every: [4, 8],
      },
    );
  }
  for (const s of extras) {
    const n = { ...s, ...body(s) };
    if (s.zone === "ship") {
      Q.props.ship.add(n.m);
      n.m.position.set(n.x, 0, n.z);
      Q.shipExtras = Q.shipExtras || [];
      Q.shipExtras.push(n);
      Q.shipLife.add(n, { walk: "Walk", idles: [n.idle || "Idle"], ...s.behaviour });
      continue;
    }
    Q.group.add(n.m);
    Q.extras.push(n);
    Q.life.add(n, { walk: n.sex === "m" ? "WalkM" : "Walk", idles: [n.idle || "Idle"], ...s.behaviour });
  }
  for (const n of [...Q.extras, ...(Q.shipExtras || [])])
    if (typeof n.amb?.spec?.chase === "string")
      n.amb.spec.chase = Q.extras.find((o) => o.id === n.amb.spec.chase);
  if (Q.shipLife) Q.shipLife.ready();
  Q.life.ready();
  Q.familyLife.ready();
  worlds[id] = Q;
  addShadows(Q);
  return Q;
}
function addShadows(Q) {
  const people = [...Q.people, ...Q.extras],
    m = new THREE.MeshBasicMaterial({
      map: P.shadowTexture(),
      transparent: true,
      depthWrite: false,
      opacity: 0.45,
    }),
    mesh = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(0.9, 0.9),
      m,
      people.length,
    );
  mesh.rotation.x = -Math.PI / 2;
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
function where(id, kind) {
  const Q = world();
  if (!Q) return null;
  const n = Q.people.find((n) => n.id === id);
  if (kind === "talk" && n) return [n.x, n.z];
  const task = TASKS[id];
  if (task) {
    if (S.hand) return S.hand === task.item ? task.to : null;
    const item = Q.items[task.item],
      st = Q.itemStarts[task.item];
    if (!item || (st && item.parent === Q.group && item.position.distanceTo(new THREE.Vector3(...st.at)) < 0.05)) return task.from;
    return [item.position.x, item.position.z + 1.5];
  }
  if (id === "frontGate" && S.stage === 75) {
    const elder = Q.people.find((n) => n.id === "iris");
    if (elder && Math.hypot(S.x - elder.x, S.z - elder.z) > 4)
      return [elder.x, elder.z];
  }
  const p = Q.points[id];
  return p ? [p.x, p.z] : null;
}
const story = createStory({
  steps: STEPS,
  where,
  player: () => [S.x, S.z],
  route: (to, from) =>
    walkRoute(from, to, world().walls, 0.24, world().bounds)[0] || to,
  advance: (next) => advance(next),
  onGoal: (t) => setGoal(t),
  onArrow: () => nudgeGoal(), /* when the arrow first shows in a step, the goal pops open */
  flavour: FLAVOUR,
  names: PEOPLE,
  items: Object.fromEntries(ITEMS.map((id) => [id, true])),
});
for (const id of TASK_IDS) story.shows(id, () => visuals());
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
    localStorage.setItem(
      KEY,
      JSON.stringify({
        version: 1,
        ...S,
        story: story.save(),
        followers:
          world()
            ?.people.filter((n) => n.fol)
            .map((n) => ({ id: n.id, x: n.x, z: n.z, s: n.fol.s })) || [],
      }),
    );
  } catch {
    notice("Progress could not be saved on this device.");
  }
}
function notice(text) {
  toast(text, 3200);
}
function bundle(Q) {
  const envelope = Q.items.envelope;
  if (!envelope) return;
  for (const [i, id] of ["letter", "order"].entries()) {
    const o = Q.items[id];
    if (o) {
      envelope.add(o);
      o.position.set((i - 0.5) * 0.06, 0.023 + i * 0.012, 0);
    }
  }
}
function applyPlaced(Q, id) {
  const t = TASKS[id],
    o = Q.items[t.item];
  if (!o || S.hand === t.item) return;
  Q.group.add(o);
  o.position.fromArray(t.at);
  o.scale.set(1, 1, 1);
  if (id === "cleanCloth") o.scale.set(3, 12, 0.12);
  o.visible = !t.hideAfter;
}
function visuals() {
  const Q = world();
  if (!Q) return;
  for (const id of Object.keys(S.placed))
    if (TASKS[id]?.place === Q.id) applyPlaced(Q, id);
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
      n.m.position.set(n.x, 0, n.z);
      n.m.rotation.y = n.home.ry;
      if (n.life?.seat) n.m.userData.seatAnchor = { ...n.life.seat };
      Q.familyLife.hold(n, false);
    }
  }
}
function chapterState(first) {
  resetSceneTasks();
  S.completed = {};
  S.placed = {};
  for (const [s, row] of Object.entries(STEPS))
    if (+s < first)
      for (const n of needList(row)) if (n.kind === "do") S.placed[n.id] = true;
}
function light(Q) {
  const english = Q.weather === "england",
    sea = Q.weather === "sea",
    late = Q.tod === "afternoon";
  sky.setSky(english ? 0x8dabb9 : late ? 0x7a9fb8 : 0x71a7bf, english ? 0xd8d9cd : late ? 0xf0c890 : 0xe4d1a7);
  scene.fog = new THREE.Fog(english ? 0xc7cfc9 : late ? 0xe0d2b4 : 0xc7d7d1, 100, english ? 360 : 550);
  sun.intensity = english ? 1.5 : late ? 1.9 : 2.1;
  sun.color.set(late ? 0xffc890 : 0xffe2b6);
  sun.position.set(late ? -40 : -20, late ? 18 : 42, late ? 8 : 20);
  hemi.intensity = english ? 2.95 : late ? 2.3 : 2.5;
  hemi.color.set(late ? 0xffe2c0 : 0xfff1d4);
}
async function go(stage, { restore = null, keep = false } = {}) {
  const generation = ++epoch;
  busy = true;
  DIR.stop();
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
    if (__DEV__ && change) (window.__arrive ||= []).push([row.place, Math.round(performance.now() - t0)]); /* dev: how long arriving waited on the place being built */
  } catch (e) {
    if (generation !== epoch) return;
    busy = false;
    $("fade").hidden = true;
    card(
      "This chapter could not load",
      ["Check your connection and try again."],
      [
        ["Try again", () => go(stage, { restore, keep })],
        ["Chapters", showChapters],
      ],
    );
    return;
  }
  if (generation !== epoch) return;
  $("fade").hidden = true;
  for (const p of Object.values(worlds)) {
    p.group.visible = p === Q;
    for (const n of p.people)
      if (n.fol) {
        stopFollow(n);
        p.familyLife.hold(n, false);
      }
  }
  const newChapter = change || chapterOf(stage) !== chapterOf(S.stage);
  current = Q.id;
  PLACES.shown(Q.id); /* drawn now, so sent again */
  S.stage = stage;
  if (newChapter && $("title").hidden) releaseFar(stage);
  prepare(nextPlace(stage));
  S.best = Math.max(S.best, chapterOf(stage));
  if (!keep || change)
    Object.assign(S, {
      x: Q.start.x,
      z: Q.start.z,
      yaw: Q.start.yaw,
      pitch: 0,
    });
  if (restore) {
    story.restore(restore.story);
    Object.assign(S, {
      x: restore.x,
      z: restore.z,
      yaw: restore.yaw,
      pitch: restore.pitch || 0,
    });
  } else story.sync(stage);
  if (S.hand && !carry.holding()) {
    const o = Q.items[S.hand];
    if (o) carry.carry(o);
    else S.hand = null;
  }
  visuals();
  if (Q.id === "brixton62" && (S.hand === "envelope" || S.placed.post))
    bundle(Q);
  light(Q);
  $("place").textContent =
    stage >= 64 && stage <= 68
      ? "You are Naomi, aged 12 · Jamaica, 1962"
      : CHAPTERS[chapterOf(stage)].caption;
  $("stage").setAttribute(
    "aria-label",
    $("place").textContent + ". Use movement controls to explore.",
  );
  showCount(S.newPages);
  if (stage === 75) {
    const n = Q.people.find((n) => n.id === "iris");
    Q.familyLife.hold(n, true);
    delete n.m.userData.seatAnchor;
    n.m.position.y = 0;
    n.ctl.play("OldIdle");
    lead(n, Q.leadPath, {
      walk: 0.85,
      side: 0,
      run: false,
      wait: 5,
      resume: 3.5,
      wave: false,
    });
    if (restore?.followers?.length) {
      const p = restore.followers.find((p) => p.id === "iris");
      if (p) {
        n.x = p.x;
        n.z = p.z;
        n.fol.s = p.s;
        n.m.position.set(n.x, 0, n.z);
      }
    }
  }
  busy = false;
  save();
  const c = CHAPTERS[chapterOf(stage)];
  if (stage === c.first && stage !== 10 && !restore && !skipIntro) {
    card(c.name, [c.intro], [["Begin", () => waits(stage)]]);
  } else await waits(stage);
}
async function advance(next) {
  unlock(STEPS[S.stage].journal);
  if (!next) return;
  if (chapterOf(next) !== chapterOf(S.stage)) {
    S.best = Math.max(S.best, chapterOf(next));
    save();
    nextPending = next;
    nextCard();
  } else await go(next, { keep: true });
}
/* a finished chapter: offer the next one on screen, as every game does. "Stay here" lets you look round; tapping the goal brings the card back */
let nextPending = null;
function nextCard() {
  const next = nextPending,
    i = chapterOf(S.stage),
    nx = CHAPTERS[chapterOf(next)];
  uiSound("goal");
  card(
    "Chapter " + (i + 1) + " is finished!",
    ["Well done. Next is " + nx.name + " (" + nx.year + ")."],
    [
      [
        "Next chapter",
        () => {
          nextPending = null;
          go(next);
        },
      ],
      ["Stay here", () => setGoal("Well done! Tap here for the next chapter.")],
    ],
  );
}
function filmRead(key) {
  DIR.stop();
  const F = FILMS[key];
  card(F.title, F.read, [
    [
      "Continue",
      () => {
        unlock("passage");
        go(F.next);
      },
    ],
  ]);
}
const DIR = createDirector({
  camera,
  world: () => world(),
  fast: QUICK,
  reduced,
  finish: (key) => {
    unlock("passage");
    go(FILMS[key].next);
  },
  read: filmRead,
});
async function waits(st) {
  const row = STEPS[st],
    kind = row.card;
  if (!kind) return;
  if (kind === "film") {
    const data = CARDS[row.film];
    card(
      data.title,
      data.lines,
      reduced
        ? [
            ["Read instead", () => filmRead(row.film)],
            ["Watch the scene", () => go(st + 1, { keep: true })],
          ]
        : [
            ["Watch the scene", () => go(st + 1, { keep: true })],
            ["Read instead", () => filmRead(row.film)],
          ],
    );
  } else if (kind === "playing")
    card(
      "A short scene",
      ["You can pause, change sound, or read instead."],
      [
        ["Watch", () => DIR.start(row.film)],
        ["Read instead", () => filmRead(row.film)],
      ],
    );
  else if (kind === "firstMemory")
    card(
      "A small memory of home",
      ["What would you want to remember?"],
      [
        "The washing in the breeze",
        "The sound of our family",
        "The work we did together",
      ].map((text) => [
        text,
        () => {
          S.firstMemory = text;
          unlock("memory");
          save();
          advance(row.next);
        },
      ]),
      { col: true },
    );
  else if (kind === "train")
    card(
      "From Tilbury to London",
      [
        "The family travels inland to meet Celia in Brixton.",
        "The train journey is compressed in this story.",
      ],
      [["Continue", () => advance(row.next)]],
    );
  else if (kind === "firstNight")
    card(
      "Room at the table",
      [
        "The room is crowded. The welcome matters.",
        "The family’s life will include work, joy, friendship and unfairness.",
      ],
      [["Continue", () => advance(row.next)]],
    );
  else if (kind === "jamaicaCut")
    card(
      "Across the sea, in Jamaica",
      [
        "You are Naomi, Iris’s cousin, aged twelve.",
        "You and Pearl will open the letter together.",
      ],
      [["Read the letter", () => go(64)]],
    );
  else if (kind === "years")
    card(
      "The years keep moving",
      [
        "Iris grows older. Her children have children.",
        "Now it is 2018. You are Maya, Iris’s granddaughter.",
        "This next part talks about unfair treatment and worry.",
      ],
      [
        ["Continue with the family", () => advance(70)],
        [
          "Read what happens",
          () => {
            unlock("scandal");
            unlock("support");
            chapterState(80);
            go(80);
          },
        ],
      ],
    );
  else if (kind === "centre")
    card(
      "Go together",
      [
        "Iris has asked her family to come with her.",
        "The adviser will listen and help challenge what happened.",
      ],
      [["Continue", () => advance(80)]],
    );
  else if (kind === "lastMemory")
    card(
      "What should the journal keep?",
      ["Choose a memory, not a judgement about belonging."],
      [
        "The people behind every paper",
        "Two places we call home",
        "Listening when someone needs help",
      ].map((text) => [
        text,
        () => {
          S.memory = text;
          unlock("memory");
          save();
          go(85);
        },
      ]),
      { col: true },
    );
  else if (kind === "end") {
    card(CARDS.end.title, CARDS.end.lines, [
      ["Read the journal", showJournal],
      ["Chapters", showChapters],
    ]);
    cue("end");
  }
}
function talk(n) {
  if (busy || openPanel() || DIR.on) return;
  const response = story.talk(n.id),
    L =
      response?.kind === "story"
        ? TALK[S.stage]?.[n.id]
        : [response?.line || "It is good to have company."];
  if (!L?.length) return;
  talking = n;
  S.yaw = Math.atan2(S.x - n.x, S.z - n.z);
  S.pitch = Math.atan2(0.15, Math.hypot(S.x - n.x, S.z - n.z));
  world().familyLife.hold(n, true);
  n.ctl.play(
    n.m.userData.seatAnchor
      ? "SitTalk"
      : n.id === "iris" && current.endsWith("18")
        ? "Talk2"
        : n.sex === "m"
          ? ["TalkM2", "TalkM1"][S.stage % 2]
          : ["Talk1", "Talk3"][S.stage % 2],
  );
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
      world().familyLife.hold(n, !!n.fol);
      if (n.m.userData.seatAnchor) n.ctl.play("SitIdle");
      else n.ctl.rest();
      talking = null;
    },
  );
}
function action(id) {
  if (busy || openPanel() || DIR.on || !story.needs(id)) return;
  const t = TASKS[id],
    Q = world();
  if (!t) return;
  if (S.hand !== t.item) {
    if (S.hand) {
      notice("Place the item you are already carrying first.");
      return;
    }
    const o = Q.items[t.item];
    if (!o) throw Error("Missing item " + t.item + " in " + Q.id);
    S.hand = t.item;
    o.name = t.item;
    if (t.item === "envelope") bundle(Q);
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
  journal(S.journal, S.memory || S.firstMemory, () => {
    S.newPages = 0;
    showCount(0);
    save();
  });
}
function begin() {
  if (!S.started) startHint(phone); /* the controls tip, for a few seconds at the start of play */
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
function showChapters() {
  chapters({
    best: S.best,
    done: (i) => i < S.best || (i === CHAPTERS.length - 1 && S.stage === 85),
    teacher: S.teacher,
    choose: playChapter,
    toggle: () => {
      S.teacher = !S.teacher;
      try {
        localStorage.setItem("windrush-teacher", S.teacher ? "on" : "off");
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
  S.started = false; /* nothing more is saved before the page reloads */
  location.reload();
}
/* the reset button: start this chapter again, or the whole story (as in every game) */
function resetPrompt() {
  if (DIR.on) return;
  const c = CHAPTERS[chapterOf(S.stage)];
  card(
    "Reset",
    ["Start this chapter again, or start the whole story again."],
    [
      ["Restart \u201c" + c.name + "\u201d", () => playChapter(c)],
      [
        "Start the whole story again",
        () =>
          card(
            "Start again?",
            ["This wipes everything, even your journal."],
            [
              ["Yes, start again", eraseAll],
              ["No, keep playing", () => {}],
            ],
          ),
      ],
      ["Cancel", () => {}],
    ],
  );
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
  $("snd").setAttribute(
    "aria-label",
    AU.on ? "Sound on. Tap to turn off." : "Sound off. Tap to turn on.",
  );
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
  if (
    S.started &&
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) &&
    !openPanel()
  )
    e.preventDefault();
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
  } else
    Object.assign(look, {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      moved: 0,
    });
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
      const n =
        S.started && !busy && !openPanel() && !DIR.on
          ? MARKS.tap(e.clientX, e.clientY, world().people, S.x, S.z, TALK_R)
          : null;
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
  let fw =
      (keys.has("w") || keys.has("arrowup") ? 1 : 0) -
      (keys.has("s") || keys.has("arrowdown") ? 1 : 0) -
      stick.dy,
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
      p = slideWalls(
        [S.x, S.z],
        [
          S.x + (-Math.sin(S.yaw) * fw + Math.cos(S.yaw) * rt) * speed * dt,
          S.z + (-Math.cos(S.yaw) * fw - Math.sin(S.yaw) * rt) * speed * dt,
        ],
        Q.walls,
        0.23,
      );
    if (
      ![...Q.people, ...Q.extras].some(
        (n) => n.m.visible && Math.hypot(n.x - p[0], n.z - p[1]) < 0.45,
      )
    ) {
      S.x = Math.max(Q.bounds.x0 + 0.25, Math.min(Q.bounds.x1 - 0.25, p[0]));
      S.z = Math.max(Q.bounds.z0 + 0.25, Math.min(Q.bounds.z1 - 0.25, p[1]));
    }
    if ((stepT += dt) > 0.48) {
      stepT = 0;
      stepSound(
        Q.weather === "jamaica"
          ? "sand"
          : Q.weather === "sea"
            ? "wood"
            : "stone",
      );
    }
  }
  for (const need of needList(STEPS[S.stage]).filter(
    (n) => n.kind === "go" && story.needs(n.id),
  )) {
    const fixed = need.id === "frontGate" ? Q.points.frontGate : null,
      p = fixed ? [fixed.x, fixed.z] : where(need.id, need.kind);
    if (
      p &&
      Math.hypot(S.x - p[0], S.z - p[1]) < 1.5 &&
      (need.id !== "frontGate" ||
        Math.hypot(
          Q.people.find((n) => n.id === "iris").x - p[0],
          Q.people.find((n) => n.id === "iris").z - p[1],
        ) < 3.5)
    )
      story.done(need.id);
  }
}
const TALK_R = 2.35; /* how near you must be to talk: the talk button and a tap on a person (engine/tap.js) use the same reach */
function findNear() {
  near = null;
  if (!S.started || busy || openPanel() || DIR.on) return;
  const candidates = [];
  for (const n of world().people)
    if (n.m.visible)
      candidates.push({
        kind: "talk",
        n,
        id: n.id,
        label: "Talk to " + n.who,
        x: n.x,
        z: n.z,
        priority: story.marked(n.id) ? 0 : 2,
      });
  for (const n of needList(STEPS[S.stage]))
    if (n.kind === "do" && story.needs(n.id)) {
      const p = where(n.id, n.kind),
        t = TASKS[n.id];
      if (p)
        candidates.push({
          kind: "do",
          id: n.id,
          label: S.hand === t.item ? t.put : t.label,
          x: p[0],
          z: p[1],
          priority: 0,
        });
    }
  for (const c of candidates) c.dist = Math.hypot(S.x - c.x, S.z - c.z);
  near =
    candidates
      .filter((c) => c.dist < TALK_R)
      .sort((a, b) => a.priority - b.priority || a.dist - b.dist)[0] || null;
}
let GUIDE = null;
function hint(now) {
  const quiet = S.started && !busy && !openPanel() && !DIR.on,
    h = story.tick(now, quiet);
  $("nudge").hidden = true;
  if (!GUIDE) GUIDE = createGuide({ scene, camera, ground: () => 0 });
  /* a gold arrow on the ground points the way, a gold ring marks the place */
  if (h.show && quiet)
    GUIDE.point(now, { x: h.x, z: h.z, tx: h.target[0], tz: h.target[1], final: h.final });
  else GUIDE.hide(now);
  /* the Talk button is for things to do; a person you can talk to gets the gold talk button over their head */
  hintTick(quiet);
  const act = quiet && near?.kind === "do";
  $("talk").hidden = !act;
  if (act) $("talk").textContent = near.label;
  MARKS.tick(now / 1000, {
    people: world().people,
    show: quiet,
    marked: (n) => !!story.marked(n.id),
    near: quiet && near?.kind === "talk" ? near.n : null,
    px: S.x,
    pz: S.z,
  });
  /* the joystick: faint at rest, under the left thumb when it moves */
  const el = $("stick");
  el.hidden = !phone || !quiet;
  if (phone && quiet) {
    const rest = stick.id === null;
    el.classList.toggle("rest", rest);
    el.style.left = (rest ? 84 : stick.x) + "px";
    el.style.top = (rest ? innerHeight - 150 : stick.y) + "px";
    $("nub").style.transform =
      `translate(calc(-50% + ${stick.dx * 30}px), calc(-50% + ${stick.dy * 30}px))`;
  }
}
function tick(dt, now = performance.now()) {
  const Q = world();
  if (!Q) return;
  move(dt);
  const frozen = busy || (openPanel() && !talking) || DIR.paused;
  const W = {
    px: S.x,
    pz: S.z,
    talking,
    story: Q.people.filter((n) => story.marked(n.id)),
    view: { x: camera.position.x, z: camera.position.z, yaw: S.yaw },
  };
  const t = now / 1000;
  if (!frozen) {
    for (const f of Q.tickers) f(t, dt);
    if (Q.sea) Q.sea.tick(t);
    const ship = Q.props.ship;
    if (ship && !Q.deckShip && !(DIR.on && DIR.moves(Q))) rideShip(ship, Q.sea ? Q.sea.level : -2.1, reduced ? 0 : t);
    if (Q.props.wake && Q.id === "deck48") Q.props.wake.userData.tick(t, 1);
  }
  if (Q.shipLife) {
    for (const n of Q.shipExtras) n.m.userData.ground = Q.props.ship.position.y + n.deckY;
    Q.shipLife.tick(frozen ? 0 : dt, { px: 1e4, pz: 1e4, story: [], view: W.view });
  }
  Q.life.tick(frozen ? 0 : dt, W);
  Q.familyLife.tick(frozen ? 0 : dt, { ...W, story: [] });
  for (const n of Q.people) {
    if (n.fol)
      followTick(n, frozen ? 0 : dt, {
        px: S.x,
        pz: S.z,
        walls: Q.walls,
        bounds: Q.bounds,
        blocked: (x, z, r) => blocked(Q, x, z, r),
        others: Q.people,
        talking,
      });
  }
  shadows(Q);
  if (DIR.on) DIR.tick(dt);
  else if (__DEV__ && S.view) {
    camera.position.set(...S.view.pos);
    camera.lookAt(...S.view.look);
  } else if (!S.started) {
    const k = reduced ? 0 : now * 0.00004;
    // The agreed Kingston quay view: cargo, passengers, the gangway and the ship.
    camera.position.set(-12 + Math.sin(k) * .6, 1.6 + Math.sin(k * 1.7) * .06, 18 + Math.sin(k * .8) * .35);
    camera.lookAt(6, 3, -6);
  } else {
    const adult =
      CHAPTERS[chapterOf(S.stage)].age > 16 &&
      !(S.stage >= 64 && S.stage <= 68);
    const sea = Q.id === "deck48" && !reduced,
      tt = now / 1000;
    camera.position.set(S.x, (adult ? 1.55 : 1.28) + (sea ? Math.sin(tt * 0.7) * 0.05 : 0), S.z);
    camera.rotation.set(S.pitch + (sea ? Math.sin(tt * 0.52) * 0.006 : 0), S.yaw, sea ? Math.sin(tt * 0.41) * 0.018 : 0, "YXZ");
  }
  findNear();
  hint(now);
  if (S.started) audioTick(Q, dt);
  if (__DEV__) camera.userData.checkPlace = Q; // Match camera probes to the scene actually drawn, including chapter transitions.
  renderFramed(renderer, scene, camera, DIR.on);
  if (S.started && (saveT += dt) > 3) {
    saveT = 0;
    save();
  }
}
/* the sound of each place: the sea and gulls at the docks, wind and the ship's timbers on deck, birds in the yard, a street's hum, a quiet room */
const BEDS = {
  harbour48: { sea: 0.1, surf: 0.05, crowd: 0.09, wind: 0.03, gull: 0.25 },
  tilbury48: { sea: 0.08, surf: 0.04, crowd: 0.08, wind: 0.05, gull: 0.15 },
  deck48: { sea: 0.16, wind: 0.1, creak: 0.12 },
  yard48: { wind: 0.025, crowd: 0.03, bird: 0.2 },
  yard62: { wind: 0.025, crowd: 0.03, bird: 0.2 },
  brixton48: { crowd: 0.06, wind: 0.04 },
  brixton62: { crowd: 0.08, wind: 0.03 },
  home18: { room: 0.05, crowd: 0.015 },
  centre18: { room: 0.06, crowd: 0.04 },
};
let bedT = 0;
function audioTick(Q, dt) {
  if (!AU.ctx || !AU.on || AU.ctx.state !== "running" || (bedT += dt) < 0.1) return;
  const B = BEDS[Q.id] || {},
    k = talking ? 0.6 : 1,
    t = bedT;
  bedT = 0;
  for (const ch of ["sea", "surf", "wind", "crowd", "room"]) if (AU.ch[ch]) setG(AU.ch[ch], (B[ch] || 0) * k, 0.8);
  if (B.gull && Math.random() < B.gull * t * 0.5) gullCry();
  if (B.bird && Math.random() < B.bird * t * 0.6) chirp();
  if (B.creak && Math.random() < B.creak * t * 0.4) shipCreak();
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
  await go(10);
  unlock("family");
  if (!skipIntro)
    card(
      CHAPTERS[0].name,
      [
        CHAPTERS[0].intro,
        "This family is fictional. Their setting is part of real history.",
      ],
      [["Begin", () => {}]],
    );
}
$("start").onclick = start;
onLoadFail(() => {
  $("loadnote").textContent =
    "Some parts of the world could not load. Please reload.";
});
(async () => {
  try {
    loadClips(await model("anims"));
    $("bar").style.width = "25%";
    const Q = await ensure("harbour48");
    current = "harbour48";
    Q.group.visible = true;
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
    prepare(STEPS[saved?.stage]?.place || STEPS[10].place); /* the place Start opens, built behind the title */
    if (__DEV__) {
      const { dev } = await import("./dev.js");
      await dev({
        q,
        S,
        story,
        worlds,
        ensure,
        world,
        go,
        start,
        action,
        talk,
        carry,
        where,
        blocked,
        save,
        DIR,
        skip: () => (skipIntro = true),
        begin,
        renderer,
        camera,
        scene,
        body,
        loadBase,
        tick,
        frame,
        chapterState,
        resetSceneTasks,
      });
    }
  } catch (e) {
    console.error(e);
    $("loadnote").textContent = "The game could not load. Please reload.";
  }
})();
hudTidy();   /* the toast keeps clear of the action button and wraps its words (engine/hud.js) */
addExit({ url: '../../../menu/', save: () => save() });   /* Exit, right of the Journal button, with an "are you sure" (engine/exit.js) */
