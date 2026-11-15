/* A self-contained game on the established shared engine APIs. */
import * as THREE from "three";
import { clone as cloneBody } from "three/addons/utils/SkeletonUtils.js";
import { loadClips, animate, groundFeet } from "../../../engine/anim.js";
import { model, onLoadFail } from "../../../engine/loader.js";
import { grip, gripTick, spreadArms } from "../../../engine/grip.js";
import { createAmbient, onKeepOff } from "../../../engine/ambient.js";
import {
  lead,
  stop as stopFollow,
  tick as followTick,
} from "../../../engine/follow.js";
import {
  createStory,
  createCarry,
  arrowPose,
  needList,
} from "../../../engine/story.js";
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
} from "../../../engine/audio.js";
import { snapMeshes } from "../../../engine/audit.js";
import { makeSky, G, batchStatic, cv } from "./gfx.js";
import { buildPlace, mergePlace } from "./places.js";
import { CAST, crowdLook } from "./cast.js";
import * as P from "./props.js";
import { STEPS, ITEMS, TASK_IDS } from "./steps.js";
import {
  CHAPTERS,
  chapterOf,
  PEOPLE,
  TALK,
  FLAVOUR,
  CARDS,
} from "./content.js";
import {
  $,
  openPanel,
  dialogue,
  card,
  journal,
  chapters,
  closeAll,
} from "./ui.js";
import { createDirector } from "./director.js";
const KEY = "selassie-save-v1",
  q = new URLSearchParams(location.search),
  QUICK = __DEV__ && (q.has("auto") || q.has("test"));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches,
  phone = matchMedia("(pointer: coarse)").matches;
soundPref("selassie-sound");
const renderer = new THREE.WebGLRenderer({
  canvas: $("stage"),
  antialias: true,
});
renderer.setPixelRatio(Math.min(devicePixelRatio, phone ? 1.4 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
G.aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
const scene = new THREE.Scene(),
  camera = new THREE.PerspectiveCamera(66, 1, 0.07, 650);
scene.add(camera);
camera.rotation.order = "YXZ";
const sky = makeSky();
sky.objects.forEach((o) => scene.add(o));
sky.setSky(0x6ca9bb, 0xe1d4ac);
scene.fog = new THREE.Fog(0xd6d1b8, 90, 280);
const env = cv(512, 256, (x, W, H) => {
  const g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#79aec4");
  g.addColorStop(0.46, "#d8dfd5");
  g.addColorStop(0.56, "#c5c6b1");
  g.addColorStop(1, "#6d7364");
  x.fillStyle = g;
  x.fillRect(0, 0, W, H);
});
env.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = env;
scene.environmentIntensity = 0.28;
const hemi = new THREE.HemisphereLight(0xfff3d3, 0x827356, 2.3),
  sun = new THREE.DirectionalLight(0xffe1ac, 2.2);
sun.position.set(-22, 45, 18);
scene.add(hemi, sun);
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
  completed: {},
  packed: [],
  share: 0,
  hand: null,
  teacher: false,
};
if (saved) S.best = saved.best || 0;
try {
  S.teacher = localStorage.getItem("selassie-teacher") === "on";
} catch {}
let current = null,
  busy = false,
  near = null,
  talking = null,
  epoch = 0,
  ready = false,
  toastTimer = null,
  skipIntro = false;
const worlds = {},
  bases = {},
  pending = {},
  keys = new Set(),
  stick = { id: null, dx: 0, dy: 0 },
  look = { id: null };
const carry = createCarry({ camera, slot: [0.22, -0.29, -0.48] });
const world = () => worlds[current];
const blocked = (Q, x, z, r = 0.24) =>
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
          .catch((error) => {
            delete pending[id];
            throw error;
          }));
}
function body(spec) {
  const m = cloneBody(bases[spec.bodyId || spec.base].scene);
  m.traverse((o) => {
    if (!o.isMesh) return;
    if (o.userData.measureOnly || /^SkirtSeat/.test(o.name)) o.visible = false;
    o.frustumCulled = true;
    o.material = o.material.clone();
    o.material.forceSinglePass = true;
    const nm = o.material.name;
    if (nm === "Skin") o.material.color.setScalar(1.55);
    if (nm === "Hair") o.material.color.setScalar(1);
    if (spec.tint?.[nm] !== undefined) {
      o.material.vertexColors = false;
      o.material.color.setHex(spec.tint[nm]);
    }
    if (nm === "Hat" && spec.hat === false) o.visible = false;
  });
  m.scale.setScalar(spec.scale || 1);
  m.position.set(spec.x, spec.ground || 0, spec.z);
  m.rotation.y = spec.ry || 0;
  m.userData.ground = spec.ground || 0;
  const ctl = animate(m, "Idle");
  ctl.mx.update(0);
  spreadArms(m, spec.sex === "f" ? 0.16 : 0.08);
  groundFeet(m);
  m.traverse((o) => {
    if (o.isSkinnedMesh) {
      o.computeBoundingSphere();
      o.boundingSphere.radius += 0.65;
    }
  });
  return { m, ctl };
}
const worldLoads = {};
function ensure(id) {
  if (worlds[id]) return Promise.resolve(worlds[id]);
  if (!worldLoads[id])
    worldLoads[id] = buildWorld(id).catch((error) => {
      delete worldLoads[id];
      for (const child of scene.children.filter((o) => o.name === id))
        scene.remove(child);
      throw error;
    });
  return worldLoads[id];
}
async function buildWorld(id) {
  if (worlds[id]) return worlds[id];
  const Q = buildPlace(id);
  Q.bounds = {
    x0: Q.bounds[0],
    z0: Q.bounds[1],
    x1: Q.bounds[2],
    z1: Q.bounds[3],
  };
  Q.itemStarts = Object.fromEntries(
    Object.entries(Q.items).map(([id, o]) => [
      id,
      { at: o.position.toArray(), ry: o.rotation.y },
    ]),
  );
  Q.group.visible = false;
  Q.group.traverse((o) => {
    if (o.material && !Array.isArray(o.material))
      o.material.forceSinglePass = true;
  });
  scene.add(Q.group);
  if (__DEV__) Q.snap = snapMeshes(Q.group);
  if (Q.props.plane) {
    Q.props.plane.userData.noBatch = false;
    batchStatic(Q.props.plane);
    Q.props.plane.userData.noBatch = true;
  }
  Q.batch = mergePlace(Q);
  Q.people = [];
  Q.extras = [];
  const specs = Q.specs.map((s) => ({
    ...CAST[s.id],
    ...s,
    bodyId: CAST[s.id].base + "_focus",
  }));
  const tier = phone ? "_phone" : "_crowd";
  const rooftops = [
    ...(Q.roofAmbient || [])
      .filter((s, i) => !phone || i % 4 === 0)
      .map((s) => ({
        ...crowdLook(s.look, true),
        ...s,
        base: crowdLook(s.look, true).base + tier,
        zone: "roof",
      })),
    ...(Q.arrivalAmbient || [])
      .filter((s, i) => !phone || i % 4 === 0)
      .map((s) => ({
        ...crowdLook(s.look, true),
        ...s,
        base: crowdLook(s.look, true).base + tier,
        zone: "arrival",
      })),
    ...(Q.policeAmbient || [])
      .filter((s, i) => !phone || i % 2 === 0)
      .map((s) => ({ ...s, sex: "m", base: s.base + tier, zone: "arrival" })),
  ];
  const extras = Q.ambient
    .filter(
      (s, i) =>
        !(Q.id === "airport" && i % (phone ? 14 : 2) !== 0) &&
        !blocked(Q, s.x, s.z, 0.3) &&
        !onKeepOff(Q.keepOff, s.x, s.z, 0.3) &&
        !specs.some((n) => Math.hypot(s.x - n.x, s.z - n.z) < 1.3),
    )
    .map((s) => ({
      ...crowdLook(s.look || 0, Q.id === "airport"),
      ...s,
      base: (s.base || crowdLook(s.look || 0, Q.id === "airport").base) + tier,
    }));
  // A lone end of a filtered chat group becomes a watcher, never a conversation with nobody.
  for (const n of extras)
    if (
      n.behaviour.kind === "chat" &&
      extras.filter((e) => e.behaviour.group === n.behaviour.group).length < 2
    )
      n.behaviour = { kind: "watch", at: [19, -28], react: ["Point", "Wave"] };
  await Promise.all(
    [
      ...new Set(
        [...specs, ...extras, ...rooftops].map((s) => s.bodyId || s.base),
      ),
    ].map(loadBase),
  );
  for (const s of specs) {
    const n = { ...s, ...body(s) };
    Q.group.add(n.m);
    Q.people.push(n);
    if (!n.historical) {
      const mark = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: markTexture(), depthTest: false }),
      );
      mark.scale.set(0.28, 0.28, 1);
      mark.position.set(0, 2.05 / (s.scale || 1), 0);
      n.m.add(mark);
      n.mark = mark;
    } else n.m.visible = false;
  }
  Q.familyLife = createAmbient({
    walls: Q.walls,
    bounds: Q.bounds,
    phone,
    seed: 66,
  });
  Q.life = createAmbient({
    walls: Q.walls,
    bounds: Q.bounds,
    keepOff: Q.keepOff,
    phone,
    seed: 1966,
  });
  for (const s of extras) {
    if (s.behaviour.kind === "watch" && s.behaviour.at)
      s.ry = Math.atan2(s.behaviour.at[0] - s.x, s.behaviour.at[1] - s.z);
    const n = { ...s, ...body(s) };
    Q.group.add(n.m);
    Q.extras.push(n);
    if (
      n.rastafari &&
      (Q.extras.length % 9 === 0 || Q.extras.length % 9 === 3)
    ) {
      const obj = Q.extras.length % 9 === 0 ? P.flag() : P.frond();
      grip(n.m, "Right", obj, {
        handleY: 0.65,
        lift: 0.65,
        straighten: 0.8,
        scale: 0.65,
      });
      n.m.userData.held = [{ obj, bone: "RightHand", label: "welcome" }];
    }
    Q.life.add(n, { walk: "Walk", ...s.behaviour });
  }
  for (const n of Q.people.filter((n) => !n.historical))
    Q.familyLife.add(n, {
      kind: "watch",
      at: [n.x + 1, n.z + 3],
      react: ["Point", "Wave"],
      stay: true,
    });
  Q.roofLife = createAmbient({
    walls: [],
    bounds: { x0: -31, z0: 35, x1: 31, z1: 43 },
    phone,
    seed: 2121,
  });
  Q.arrivalLife = createAmbient({
    walls: [
      [3.5, -31.5, 5.1, -25],
      [4.7, -50, 16, -16.5],
    ],
    bounds: { x0: -35, z0: -27, x1: 40, z1: -12 },
    phone,
    seed: 6604,
  });
  for (const s of rooftops) {
    if (s.behaviour.at)
      s.ry = Math.atan2(s.behaviour.at[0] - s.x, s.behaviour.at[1] - s.z);
    const n = { ...s, ...body(s) };
    Q.group.add(n.m);
    Q.extras.push(n);
    if (s.police) {
      const obj = P.ceremonialRifle();
      grip(n.m, "Right", obj, {
        handleY: 0.92,
        lift: 0.35,
        straighten: 0.85,
        scale: 0.85,
      });
      n.m.userData.held = [
        { obj, bone: "RightHand", label: "ceremonial rifle" },
      ];
    } else if (
      s.zone === "arrival" &&
      Number(s.id.replace("welcome", "")) % 7 === 0
    ) {
      const obj =
        Number(s.id.replace("welcome", "")) % 2 ? P.frond() : P.flag();
      grip(n.m, "Right", obj, {
        handleY: 0.65,
        lift: 0.65,
        straighten: 0.8,
        scale: 0.8,
      });
      n.m.userData.held = [{ obj, bone: "RightHand", label: "welcome" }];
    }
    (s.zone === "roof" ? Q.roofLife : Q.arrivalLife).add(n, {
      walk: "Walk",
      ...s.behaviour,
    });
  }
  Q.roofLife.ready();
  Q.arrivalLife.ready();
  Q.life.ready();
  Q.familyLife.ready();
  worlds[id] = Q;
  Q.ready = true;
  addShadows(Q);
  return Q;
}
let MARK = null;
function markTexture() {
  if (MARK) return MARK;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d");
  x.fillStyle = "#f0b23a";
  x.beginPath();
  x.arc(32, 29, 24, 0, 7);
  x.fill();
  x.beginPath();
  x.moveTo(20, 44);
  x.lineTo(15, 60);
  x.lineTo(36, 48);
  x.fill();
  x.fillStyle = "#183b32";
  x.font = "bold 34px sans-serif";
  x.textAlign = "center";
  x.fillText("!", 32, 41);
  return (MARK = new THREE.CanvasTexture(c));
}
function addShadows(Q) {
  const people = [...Q.people, ...Q.extras],
    tex = P.shadowTexture(),
    m = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      opacity: 0.4,
    }),
    sh = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(0.9, 0.9),
      m,
      people.length,
    );
  sh.rotation.x = -Math.PI / 2;
  Q.group.add(sh);
  Q.shadows = { mesh: sh, people };
}
function shadows(Q) {
  if (!Q.shadows) return;
  const { mesh, people } = Q.shadows,
    o = new THREE.Object3D();
  people.forEach((n, i) => {
    o.position.set(n.x, -n.z, (n.ground || 0) + 0.025);
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
  if (S.hand === "tin" && id === "tin") return [-5, 0];
  if (S.hand && ["water", "lunch", "photo"].includes(id)) return [0, -3.6];
  if (S.hand === "bottle" && id === "roadWater") {
    const a = Q.people.find((n) => n.id === "adina");
    return [a.x, a.z + 1];
  }
  if (S.hand === "ticket" && id === "ticket") return [-5, 0];
  if (id === "share") return S.share === 0 ? [2, 17.5] : [-10, 22.3];
  const p = Q.points[id];
  return p ? [p.x, p.z] : null;
}
const story = createStory({
  steps: STEPS,
  where,
  player: () => [S.x, S.z],
  route: (target, from) =>
    walkRoute(from, target, world().walls, 0.24, world().bounds)[0] || target,
  advance: (next) => advance(next),
  onGoal: (t) => ($("goal").textContent = t),
  flavour: FLAVOUR,
  names: PEOPLE,
  items: Object.fromEntries(ITEMS.map((id) => [id, true])),
});
for (const id of TASK_IDS) story.shows(id, () => visuals());
function unlock(id) {
  if (!id || S.journal.includes(id)) return;
  S.journal.push(id);
  S.newPages++;
  $("jcount").hidden = false;
  $("jcount").textContent = S.newPages;
  $("jbtn").classList.add("new");
  uiSound("page");
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
        hand: S.hand,
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
  if (openPanel()) return;
  clearTimeout(toastTimer);
  $("toast").textContent = text;
  $("toast").hidden = false;
  toastTimer = setTimeout(() => ($("toast").hidden = true), 3500);
}
function setHeld(id, obj) {
  S.hand = id;
  obj.name = id;
  carry.carry(obj);
  save();
}
function putHeld(at) {
  const o = carry.holding();
  if (o) carry.place(o, { parent: world().group, at });
  S.hand = null;
  save();
}
function giveCup(n) {
  const cup = P.cup();
  grip(n.m, "Right", cup, {
    handleY: 0.04,
    lift: 0.55,
    straighten: 0.85,
    scale: 0.9,
  });
  n.m.userData.held = (n.m.userData.held || []).concat({
    obj: cup,
    bone: "RightHand",
    label: "cup",
  });
  gripTick(n.m);
  return cup;
}
function getItem(id) {
  const o = world().items[id];
  if (o) return o;
  return id === "paper" || id === "photo" || id === "ticket"
    ? P.card(id)
    : P[id]();
}
function complete(id) {
  S.completed[S.stage + ":" + id] = (S.completed[S.stage + ":" + id] || 0) + 1;
  story.done(id);
  save();
}
function visuals() {
  const Q = world();
  if (!Q) return;
  if (Q.id === "yard") {
    Q.items.ticket.visible = S.stage >= 60;
    for (const id of ["photo", "bottle", "lunch"]) {
      const o = Q.items[id],
        key = id === "bottle" ? "water" : id;
      if (S.packed.includes(key) && S.hand !== id) {
        if (o.parent !== Q.group) Q.group.add(o);
        o.position.set(0.2 + S.packed.indexOf(key) * 0.08, 1.11, -5);
        o.visible = true;
      }
    }
    Q.props.chair.userData.slat.rotation.z = S.stage > 23 ? 0 : 0.13;
    const t = Q.items.tin;
    if (S.hand !== "tin" && S.stage >= 12) {
      if (t.parent !== Q.group) Q.group.add(t);
      t.position.set(-5, 0.83, -2);
      t.visible = true;
    }
    t.userData.lid.rotation.x = S.stage >= 13 ? -1.9 : 0;
    if (S.stage > 22 && S.hand !== "thread") {
      const o = Q.items.thread;
      if (o.parent !== Q.group) Q.group.add(o);
      o.position.set(5.5, 0.83, -3);
      o.visible = true;
    }
    if (S.stage >= 60 && S.hand !== "photo") {
      const photo = Q.items.photo;
      if (photo.parent !== Q.group) Q.group.add(photo);
      photo.position.set(-5.08, 1, -2);
      photo.visible = true;
    }
    if (S.stage >= 62 && S.hand !== "ticket") {
      Q.items.ticket.position.set(-4.9, 1, -2);
      Q.items.ticket.visible = true;
    }
  }
  if (Q.id === "airport") {
    const count = S.stage >= 44 ? 2 : S.share;
    for (let i = 0; i < count; i++)
      if (!Q.props["shared" + i])
        Q.props["shared" + i] = giveCup(
          Q.people.find((n) => n.id === (i === 0 ? "visitor" : "boy")),
        );
    Q.props.mat.visible = S.stage >= 42;
    Q.props.plane.visible = S.stage >= 50;
    Q.props.stairs.visible = S.stage >= 55;
    for (const n of Q.people.filter((n) => n.historical))
      n.m.visible = S.stage >= 55;
  }
  if (S.hand && carry.holding()) carry.holding().visible = true;
}
async function go(stage, { restore = null, keep = false } = {}) {
  const generation = ++epoch;
  busy = true;
  DIR.stop();
  closeAll();
  const old = current,
    change = old !== STEPS[stage].place;
  if (change && S.started && !QUICK) {
    $("fadeT").textContent = CHAPTERS[chapterOf(stage)].caption;
    $("fadeS").textContent =
      STEPS[stage].place === "memory"
        ? "A memory, 1930"
        : CHAPTERS[chapterOf(stage)].year;
    $("fade").hidden = false;
  }
  let Q;
  try {
    Q = await ensure(STEPS[stage].place);
  } catch (error) {
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
  for (const p of Object.values(worlds)) p.group.visible = p === Q;
  current = Q.id;
  for (const p of Object.values(worlds))
    for (const n of p.people)
      if (n.fol) {
        stopFollow(n);
        p.familyLife.hold(n, false);
      }
  S.stage = stage;
  S.best = Math.max(S.best, chapterOf(stage));
  if (!keep || old !== current) {
    Object.assign(S, {
      x: Q.start.x,
      z: Q.start.z,
      yaw: Q.start.yaw,
      pitch: 0,
    });
  }
  if (restore) {
    story.restore(restore.story);
    Object.assign(S, {
      x: restore.x,
      z: restore.z,
      yaw: restore.yaw,
      pitch: restore.pitch || 0,
    });
  } else story.sync(stage);
  if (S.hand && !carry.holding()) setHeld(S.hand, getItem(S.hand));
  visuals();
  $("jcount").hidden = !S.newPages;
  $("jcount").textContent = S.newPages;
  $("jbtn").classList.toggle("new", !!S.newPages);
  if (stage === 30) {
    const n = Q.people.find((n) => n.id === "mum");
    n.x = 0;
    n.z = 18;
    n.m.position.set(n.x, 0, n.z);
    Q.familyLife.hold(n, true);
    lead(n, Q.leadPath, { walk: 1.2, run: false, wait: 6, resume: 4 });
  }
  if (restore?.followers)
    for (const p of restore.followers) {
      const n = Q.people.find((n) => n.id === p.id);
      if (n?.fol) {
        n.x = p.x;
        n.z = p.z;
        n.fol.s = p.s;
        n.m.position.x = p.x;
        n.m.position.z = p.z;
      }
    }
  const evening = stage >= 60;
  sky.setSky(evening ? 0x667f8b : 0x6ca9bb, evening ? 0xe0aa78 : 0xe1d4ac);
  sun.intensity = evening ? 1.45 : 2.2;
  $("place").textContent = CHAPTERS[chapterOf(stage)].caption;
  busy = false;
  save();
  await waits(stage, generation);
}
async function advance(next) {
  unlock(STEPS[S.stage].journal);
  const prev = S.stage;
  if (prev === 12) {
    card(CARDS.memory.title, CARDS.memory.lines, [
      ["Remember", () => go(next)],
    ]);
    return;
  }
  if (prev === 33) {
    card(CARDS.road.title, CARDS.road.lines, [
      ["Ride to Palisadoes", () => go(next)],
    ]);
    return;
  }
  if (chapterOf(next) !== chapterOf(prev)) {
    finishChapter(next);
    return;
  }
  await go(next, { keep: true });
}
function finishChapter(next) {
  S.best = Math.max(S.best, chapterOf(next));
  save();
  const c = CHAPTERS[chapterOf(S.stage)];
  card(
    c.name,
    ["This chapter is in your journal."],
    [
      ["Continue", () => go(next)],
      ["Chapters", showChapters],
    ],
  );
}
function cardData(data, buttons) {
  card(data.title, data.lines, buttons);
}
async function waits(st, generation) {
  if (generation !== epoch) return;
  if (st === 16) {
    cardData(CARDS.return, [["Continue", () => finishChapter(20)]]);
  }
  if (st === 26) {
    card(
      "Ready to travel",
      ["The water, lunch and picture are packed."],
      [["Continue", () => finishChapter(30)]],
    );
  }
  if (st === 46) {
    card(
      "A sound across the sky",
      ["Your family turns toward the runway."],
      [["Continue", () => finishChapter(50)]],
    );
  }
  if (st === 50) {
    cardData(CARDS.arrival, [
      ["Watch the arrival", () => go(51)],
      ["Read instead", readArrival],
    ]);
  }
  if (st === 51) {
    if (restoreArrival) {
      restoreArrival = false;
      cardData(CARDS.arrival, [
        ["Watch the arrival", () => DIR.start()],
        ["Read instead", readArrival],
      ]);
      return;
    }
    DIR.start();
  }
  if (st === 56) {
    card(
      "What will you remember?",
      ["Choose a memory for Ruth’s journal."],
      [
        [
          "Grandma and the picture",
          () => memory("Grandma holding the picture she kept for years."),
        ],
        [
          "The great welcome",
          () => memory("Many people sharing a powerful welcome."),
        ],
        [
          "My family listening",
          () => memory("Our family listening, even with different beliefs."),
        ],
      ],
    );
  }
  if (st === 57) {
    card(
      "A memory to carry",
      ["The day is becoming part of your family’s story."],
      [["Go home", () => finishChapter(60)]],
    );
  }
  if (st === 63) {
    card(
      "One line in the journal",
      [S.memory || "We travelled together and listened to each other."],
      [
        [
          "Keep this memory",
          () => {
            unlock("grounation");
            go(64);
          },
        ],
      ],
    );
  }
  if (st === 64) {
    cardData(CARDS.end, [
      ["Read the journal", showJournal],
      ["Chapters", showChapters],
    ]);
    cue("end");
  }
}
let restoreArrival = false;
function memory(text) {
  S.memory = text;
  unlock("memory");
  save();
  go(57);
}
function readArrival() {
  DIR.stop();
  S.x = -3;
  S.z = 19;
  S.yaw = 0.45;
  cardData(CARDS.arrivalRead, [
    [
      "Continue",
      () => {
        unlock("planno");
        go(55, { keep: true });
      },
    ],
  ]);
}
const DIR = createDirector({
  camera,
  place: world,
  finish: () => {
    S.x = -3;
    S.z = 19;
    S.yaw = 0.45;
    unlock("planno");
    go(55, { keep: true });
  },
  read: readArrival,
  fast: QUICK,
});
function talk(n) {
  if (busy || openPanel() || n.historical) return;
  const response = story.talk(n.id),
    L =
      response?.kind === "story"
        ? TALK[S.stage]?.[n.id]
        : [response?.line || "What a day."];
  if (!L?.length) return;
  talking = n;
  S.yaw = Math.atan2(S.x - n.x, S.z - n.z);
  S.pitch = Math.atan2(0.2, Math.hypot(S.x - n.x, S.z - n.z));
  world().familyLife.hold(n, true);
  n.ctl.play(n.sex === "m" ? "TalkM1" : "Talk1");
  dialogue(
    n.who || PEOPLE[n.id],
    L,
    () => {
      if (response.kind === "story") {
        unlock(STEPS[S.stage].journal);
        story.done(n.id);
      }
      save();
    },
    () => {
      world().familyLife.hold(n, false);
      n.ctl.rest();
      talking = null;
    },
  );
}
function action(id) {
  if (busy || openPanel() || !story.needs(id)) return;
  const Q = world(),
    stage = S.stage;
  if (id === "tin") {
    if (S.hand !== "tin") {
      setHeld("tin", getItem("tin"));
      notice("Carry the tin to the middle of the table.");
      return;
    }
    putHeld([-5, 0.83, -2]);
  } else if (id === "openTin") Q.items.tin.userData.lid.rotation.x = -1.9;
  else if (id === "paper" || id === "thread") {
    setHeld(id, getItem(id));
  } else if (id === "map") {
    putHeld([3.65, 0.89, -8]);
  } else if (id === "sewing") {
    putHeld([5.5, 0.83, -3]);
  } else if (id === "chair") {
    Q.props.chair.userData.slat.rotation.z = 0;
    uiSound("goal");
  } else if (["water", "lunch", "photo"].includes(id)) {
    const item = id === "water" ? "bottle" : id;
    if (S.hand !== item) {
      setHeld(item, getItem(item));
      notice("Place it in the bag.");
      return;
    }
    putHeld([-0.2 + S.packed.length * 0.18, 0.91, -5]);
    S.packed.push(id);
  } else if (id === "roadWater") {
    if (S.hand !== "bottle") {
      setHeld("bottle", getItem("bottle"));
      notice("Bring the water to Grandma.");
      return;
    }
    putHeld([-2, 0, -14.8]);
    giveCup(Q.people.find((n) => n.id === "adina"));
    notice("Grandma has some water.");
  } else if (id === "mat") Q.props.mat.visible = true;
  else if (id === "airportWater") setHeld("bottle", getItem("bottle"));
  else if (id === "share") {
    const n = Q.people.find(
      (n) => n.id === (S.share === 0 ? "visitor" : "boy"),
    );
    Q.props["shared" + S.share] = giveCup(n);
    S.share++;
    if (S.share === 2) putHeld([-2, 0.83, 19]);
    notice("A neighbour has some water.");
  } else if (id === "bus") {
    uiSound("goal");
  } else if (id === "ticket") {
    if (S.hand !== "ticket") {
      setHeld("ticket", getItem("ticket"));
      notice("Place it beside the picture in the tin.");
      return;
    }
    putHeld([-4.9, 1, -2]);
  }
  complete(id);
  if (stage === S.stage) visuals();
}
function interact(n = near) {
  if (!n) return;
  n.kind === "talk" ? talk(n.n) : action(n.id);
}
function showJournal() {
  journal(S.journal, S.memory, () => {
    S.newPages = 0;
    $("jcount").hidden = true;
    $("jbtn").classList.remove("new");
    save();
  });
}
function resetSceneTasks() {
  for (const Q of Object.values(worlds)) {
    for (const [id, start] of Object.entries(Q.itemStarts)) {
      const o = Q.items[id];
      Q.group.add(o);
      o.position.fromArray(start.at);
      o.rotation.set(0, start.ry, 0);
      o.visible = true;
    }
    for (const n of Q.people) {
      const held = n.m.userData.held || [],
        cups = held.filter((it) => it.label === "cup"),
        wraps = cups.map((it) => it.obj.parent);
      for (const w of wraps) w?.parent?.remove(w);
      n.m.userData.grips = (n.m.userData.grips || []).filter(
        (g) => !wraps.includes(g.wrap),
      );
      n.m.userData.held = held.filter((it) => it.label !== "cup");
    }
    delete Q.props.shared0;
    delete Q.props.shared1;
  }
}
function showChapters() {
  chapters(
    S.best,
    S.teacher,
    (c) => {
      S.started = true;
      $("title").hidden = true;
      $("hud").hidden = false;
      S.hand = null;
      carry.drop();
      resetSceneTasks();
      S.completed = {};
      S.share = c.first >= 44 ? 2 : 0;
      S.packed = c.first > 25 ? ["water", "lunch", "photo"] : [];
      go(c.first);
    },
    () => {
      S.teacher = !S.teacher;
      try {
        localStorage.setItem("selassie-teacher", S.teacher ? "on" : "off");
      } catch {}
      save();
      showChapters();
    },
    resetPrompt,
  );
}
function resetPrompt() {
  card(
    "Start again?",
    ["This clears only this game’s saved journey."],
    [
      [
        "Start again",
        () => {
          localStorage.removeItem(KEY);
          location.reload();
        },
      ],
      ["Keep playing", () => {}],
    ],
  );
}
$("jbtn").onclick = showJournal;
$("jchap").onclick = showChapters;
$("tchap").onclick = showChapters;
$("reset").onclick = resetPrompt;
$("goal").onclick = () => {
  $("goal").classList.toggle("folded");
  $("goal").setAttribute(
    "aria-expanded",
    !$("goal").classList.contains("folded"),
  );
};
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
soundButton();
$("cineSound").onclick = () => {
  $("snd").click();
};
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
  if (e.pointerType === "touch" && e.clientX < innerWidth * 0.45) {
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
    stick.dx = Math.max(-1, Math.min(1, (e.clientX - stick.x) / 45));
    stick.dy = Math.max(-1, Math.min(1, (e.clientY - stick.y) / 45));
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
    if (look.moved < 8 && near) interact();
    look.id = null;
  }
}
canvas.addEventListener("pointerup", endPointer);
canvas.addEventListener("pointercancel", endPointer);
let stepT = 0,
  saveT = 0;
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
  const l = Math.hypot(fw, rt);
  if (l > 1) {
    fw /= l;
    rt /= l;
  }
  if (l > 0.04) {
    const speed = 2.6,
      dx = (-Math.sin(S.yaw) * fw + Math.cos(S.yaw) * rt) * speed * dt,
      dz = (-Math.cos(S.yaw) * fw - Math.sin(S.yaw) * rt) * speed * dt,
      p = slideWalls([S.x, S.z], [S.x + dx, S.z + dz], Q.walls, 0.23);
    if (
      !Q.people.some(
        (n) =>
          n.m.visible &&
          !n.historical &&
          Math.hypot(n.x - p[0], n.z - p[1]) < 0.48,
      ) &&
      !Q.extras.some((n) => Math.hypot(n.x - p[0], n.z - p[1]) < 0.43)
    ) {
      S.x = Math.max(Q.bounds.x0 + 0.25, Math.min(Q.bounds.x1 - 0.25, p[0]));
      S.z = Math.max(Q.bounds.z0 + 0.25, Math.min(Q.bounds.z1 - 0.25, p[1]));
    }
    stepT += dt;
    if (stepT > 0.48) {
      stepT = 0;
      stepSound(Q.id === "yard" || Q.id === "memory" ? "sand" : "stone");
    }
  }
  for (const e of needList(STEPS[S.stage]).filter(
    (n) => n.kind === "go" && story.needs(n.id),
  )) {
    const p = where(e.id, "go");
    if (p && Math.hypot(S.x - p[0], S.z - p[1]) < 1.5) {
      story.done(e.id);
      break;
    }
  }
}
function findNear() {
  near = null;
  if (!S.started || busy || openPanel() || DIR.on) return;
  let best = 2.5;
  for (const n of world().people) {
    if (n.historical || !n.m.visible) continue;
    const d = Math.hypot(S.x - n.x, S.z - n.z);
    if (d < best) {
      best = d;
      near = { kind: "talk", n, id: n.id, label: "Talk to " + n.who };
    }
  }
  for (const need of needList(STEPS[S.stage]).filter(
    (n) => n.kind === "do" && story.needs(n.id),
  )) {
    const p = where(need.id, "do"),
      d = p ? Math.hypot(S.x - p[0], S.z - p[1]) : Infinity;
    if (d < 2.4 && (d < best || story.marked(near?.id) !== true)) {
      best = d;
      near = {
        kind: "do",
        id: need.id,
        label:
          S.hand &&
          ["tin", "ticket", "water", "lunch", "photo", "roadWater"].includes(
            need.id,
          )
            ? "Place " + S.hand
            : world().points[need.id]?.label || "Continue",
      };
    }
  }
}
function hint(now) {
  const quiet = S.started && !busy && !openPanel() && !DIR.on,
    h = story.tick(now, quiet);
  $("nudge").hidden = !h.show || !quiet;
  if (h.show && quiet) {
    const v = new THREE.Vector3(h.x, 1, h.z).project(camera),
      p = arrowPose({
        dx: h.x - S.x,
        dz: h.z - S.z,
        yaw: S.yaw,
        ndc: [v.x, v.y, v.z],
        W: innerWidth,
        H: innerHeight,
        final: h.final,
      });
    $("nudge").className = p.cls;
    $("nudge").style.left = p.x + "px";
    $("nudge").style.top = p.y + "px";
    $("nudge").querySelector("span").textContent = p.label;
  }
  $("talk").hidden = !near || !quiet;
  if (near) $("talk").textContent = near.label;
  $("hint").textContent = quiet
    ? phone
      ? "Drag left to walk. Drag right to look."
      : "WASD to walk · Drag to look · E to interact"
    : "";
  $("stick").hidden = !phone || !quiet;
  if (phone && quiet) {
    $("stick").style.left = (stick.id === null ? 72 : stick.x) + "px";
    $("stick").style.top =
      (stick.id === null ? innerHeight - 150 : stick.y) + "px";
    $("nub").style.transform =
      `translate(calc(-50% + ${stick.dx * 26}px),calc(-50% + ${stick.dy * 26}px))`;
  }
}
let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const Q = world();
  if (!Q) return;
  move(dt);
  const frozen = busy || (openPanel() && $("dialogue").hidden) || DIR.paused;
  Q.life.tick(frozen ? 0 : dt, {
    px: S.x,
    pz: S.z,
    talking,
    story: Q.people.filter((n) => story.marked(n.id)),
    view: { x: camera.position.x, z: camera.position.z, yaw: S.yaw },
  });
  Q.arrivalLife?.tick(frozen ? 0 : dt, {
    px: S.x,
    pz: S.z,
    story: [],
    view: { x: camera.position.x, z: camera.position.z, yaw: S.yaw },
  });
  Q.roofLife?.tick(frozen ? 0 : dt, {
    px: S.x,
    pz: S.z,
    story: [],
    view: { x: camera.position.x, z: camera.position.z, yaw: S.yaw },
  });
  shadows(Q);
  Q.familyLife.tick(frozen ? 0 : dt, {
    px: S.x,
    pz: S.z,
    talking,
    story: [],
    view: { x: S.x, z: S.z, yaw: S.yaw },
  });
  for (const n of Q.people) {
    if (n.fol) {
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
    if (n.historical && n.m.visible) {
      n.ctl.mx.update(dt);
      n.ctl.tick(dt);
      gripTick(n.m);
      groundFeet(n.m);
    }
    if (n.mark) n.mark.visible = !!story.marked(n.id) && S.started && !DIR.on;
  }
  if (DIR.on) DIR.tick(dt);
  else if (__DEV__ && S.view) {
    camera.position.set(...S.view.pos);
    camera.lookAt(...S.view.look);
  } else if (!S.started) {
    const t = reduced ? 0 : now * 0.00012;
    camera.position.set(3 + Math.sin(t) * 1.3, 2.2, 12);
    camera.lookAt(-2, 1, -2);
  } else {
    camera.position.set(
      S.x,
      1.28 + (reduced ? 0 : Math.sin(now * 0.002) * 0.006),
      S.z,
    );
    camera.rotation.set(S.pitch, S.yaw, 0, "YXZ");
  }
  findNear();
  hint(now);
  renderer.render(scene, camera);
  if (S.started && (saveT += dt) > 3) {
    saveT = 0;
    save();
  }
}
async function start() {
  if (!ready || busy) return;
  audioInit();
  S.started = true;
  $("title").hidden = true;
  $("hud").hidden = false;
  if (saved) {
    Object.assign(S, saved, { started: true, teacher: S.teacher });
    restoreArrival = S.stage === 51;
    const v = saved;
    saved = null;
    await go(S.stage, { restore: v });
  } else {
    await go(10);
    if (!skipIntro)
      card(
        "Meet Ruth",
        [
          "Kingston, April 1966. You are Ruth, aged ten.",
          "Ruth’s family and their conversations are fictional.",
          "Walk with the arrow. Talk to people with gold speech marks.",
          "Carry things in your hand and set them where they belong.",
        ],
        [["Begin", () => {}]],
      );
  }
  canvas.focus();
}
$("start").onclick = start;
onLoadFail((name) => {
  $("loadnote").textContent =
    "Some parts of the world could not load. Please reload.";
});
(async () => {
  try {
    loadClips(await model("anims"));
    $("bar").style.width = "25%";
    const Q = await ensure("yard");
    current = "yard";
    Q.group.visible = true;
    $("bar").style.width = "100%";
    ready = true;
    $("start").disabled = false;
    $("start").textContent = saved ? "Continue" : "Start";
    $("tchap").hidden = false;
    $("savenote").hidden = !saved;
    $("loadnote").hidden = true;
    requestAnimationFrame(frame);
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
        begin: () => {
          S.started = true;
          $("title").hidden = true;
          $("hud").hidden = false;
        },
        renderer,
        camera,
        scene,
        body,
        loadBase,
      });
    }
  } catch (e) {
    console.error(e);
    $("loadnote").textContent = "The game could not load. Please reload.";
  }
})();
