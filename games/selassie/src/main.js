/* A self-contained game on the established shared engine APIs. */
import * as THREE from "three";
import { clone as cloneBody } from "three/addons/utils/SkeletonUtils.js";
import { loadClips, animate, groundFeet, CL } from "../../../engine/anim.js";
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
  toast,
  showCount,
  newPage,
  goalSetup,
  setGoal,
  nudgeGoal,
  startHint,
  createMarks,
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
/* the gold talk marks over the step's story people, and the talk button with a name over the nearest person (ui.js) */
const MARKS = createMarks({
  scene,
  camera,
  canvas: $("stage"),
  onTap: (n) => talk(n),
});
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
/* A joined crowd body has one painted material, so its clothes cannot be tinted by material. Recolour its vertex colours instead.
   The commonest colours of the chest (the shirt or dress), the thighs (trousers or skirt) and the face (skin) are found on the body
   itself; every vertex below the neck whose colour is nearest the shirt's (or, below the hips, the trousers') takes the new colour,
   keeping its own light and dark grain. Skin, hair, hats and shoes keep theirs. One copy of the geometry per body and colours. */
const VARIANTS = new Map(),
  _c = new THREE.Color();
function recolour(o, colors) {
  const key = o.geometry.uuid + "|" + colors.shirt + "|" + colors.legs;
  let g = VARIANTS.get(key);
  if (!g) {
    g = o.geometry.clone();
    const C = g.attributes.color,
      P = g.attributes.position;
    if (!C) return;
    g.computeBoundingBox();
    const bb = g.boundingBox,
      H = bb.max.y - bb.min.y,
      cx = (bb.max.x + bb.min.x) / 2,
      cz = (bb.max.z + bb.min.z) / 2,
      half = (bb.max.x - bb.min.x) / 2;
    // the commonest colour in a band of height, near the middle and on the front (locs hang down the back)
    const mode = (y0, y1, wx, front = true, wx0 = 0) => {
      const n = new Map();
      for (let i = 0; i < P.count; i++) {
        const y = (P.getY(i) - bb.min.y) / H,
          ax = Math.abs(P.getX(i) - cx);
        if (y < y0 || y > y1 || ax > half * wx || ax < half * wx0 || (front && P.getZ(i) < cz)) continue;
        const k = [C.getX(i), C.getY(i), C.getZ(i)].map((v) => Math.round(v * 16)).join(",");
        n.set(k, (n.get(k) || 0) + 1);
      }
      let best = null,
        bn = 0;
      for (const [k, c] of n) if (c > bn) ((bn = c), (best = k));
      return best && best.split(",").map((v) => v / 16);
    };
    // the other colours that must stay: skin (the hands, as a beard can cover the face), hair or hat (the top of the head, the
    // colour of any locs down the back) and shoes
    const shirt = mode(0.6, 0.74, 0.16),
      legs = mode(0.3, 0.42, 0.12),
      keep = [mode(0.4, 0.5, 1, false, 0.72), mode(0.935, 0.955, 0.04), mode(0.96, 1, 0.3, false), mode(0, 0.035, 0.4, false)].filter(Boolean);
    // warm brown with red above green above blue is skin (the joined body's skin is baked lighter): never cloth, whatever it is nearest
    const skinish = (c) => c[0] > c[1] * 1.2 && c[1] > c[2] * 1.12;
    const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
    for (const [from, to, y0, y1] of [
      [shirt, colors.shirt, 0.4, 0.8],
      [legs, colors.legs, 0.02, 0.56],
    ]) {
      if (!from || to === undefined) continue;
      const reps = [shirt, legs, ...keep].filter((r) => r && (r === from || d2(r, from) > 0.03)); // a shade of the same cloth is not a colour that stays
      _c.setHex(to);
      const tc = [_c.r, _c.g, _c.b],
        lum = (c) => 0.3 * c[0] + 0.6 * c[1] + 0.1 * c[2] + 1e-3;
      for (let i = 0; i < P.count; i++) {
        const y = (P.getY(i) - bb.min.y) / H;
        if (y < y0 || y > y1) continue;
        const v = [C.getX(i), C.getY(i), C.getZ(i)];
        // a print's other colours go with the cloth too, unless they are nearer a colour that stays
        if (d2(v, from) > 0.12 || (skinish(v) && !skinish(from))) continue;
        if (reps.some((r) => r !== from && d2(v, r) < d2(v, from))) continue;
        const k = lum(v) / lum(from); // keep the grain as light and shade
        C.setXYZ(i, ...tc.map((x) => Math.min(1, x * k)));
      }
    }
    C.needsUpdate = true;
    VARIANTS.set(key, g);
  }
  o.geometry = g;
}
function body(spec) {
  const m = cloneBody(bases[spec.bodyId || spec.base].scene);
  m.traverse((o) => {
    if (!o.isMesh) return;
    if (o.userData.measureOnly || /^SkirtSeat/.test(o.name)) o.visible = false;
    o.frustumCulled = true;
    if (spec.colors && o.material.name === "Crowd" && o.geometry.attributes.color)
      recolour(o, spec.colors);
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
    if (!n.historical) MARKS.add(n);
    else n.m.visible = false;
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
      [3.5, -30.4, 5.1, -25.6], // the boarding steps
      [-11, -50, 0.6, -13.5], // the wing and the propellers
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
  toast(text, 3200);
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
  showCount(S.newPages);
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
/* a finished chapter: offer the next one on screen, as every game does. "Stay here" lets you look round; tapping the goal brings the card back */
let nextPending = null;
function finishChapter(next) {
  S.best = Math.max(S.best, chapterOf(next));
  save();
  nextPending = next;
  nextCard();
}
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
      { col: true },
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
    showCount(0);
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
function playChapter(c) {
  if (!S.started) startHint(phone);
  S.started = true;
  $("title").hidden = true;
  $("hud").hidden = false;
  nextPending = null;
  S.hand = null;
  carry.drop();
  resetSceneTasks();
  S.completed = {};
  S.share = c.first >= 44 ? 2 : 0;
  S.packed = c.first > 25 ? ["water", "lunch", "photo"] : [];
  go(c.first);
}
function showChapters() {
  chapters({
    best: S.best,
    done: (i) => i < S.best || (i === CHAPTERS.length - 1 && S.stage === 64),
    teacher: S.teacher,
    choose: playChapter,
    toggle: () => {
      S.teacher = !S.teacher;
      try {
        localStorage.setItem("selassie-teacher", S.teacher ? "on" : "off");
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
      [
        "Main Menu",
        () => {
          save();
          location.href = "../../../menu/";
        },
      ],
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
          ? MARKS.tap(e.clientX, e.clientY, world().people.filter((p) => !p.historical), S.x, S.z)
          : null;
      if (n) talk(n);
    }
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
    const speed = keys.has("shift") ? 3.6 : 2.6,
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
/* the title's scene: the arrival as the cinematic shows it at the salute, then left to live (the crowd keeps moving, he salutes again now and then) */
let titleT = 0;
function titleScene(Q) {
  for (let t = 0; t <= 64; t += 0.25) DIR.pose(t, 0.25);
  $("sub").textContent = "";
  for (const n of Q.people) if (n.historical) n.m.visible = true;
  Q.props.plane.visible = Q.props.stairs.visible = true;
}
function titleCamera(now, dt) {
  const em = world()?.people.find((n) => n.id === "emperor");
  if ((titleT += dt) > 13 && em) {
    titleT = 0;
    em.ctl.play("SaluteHS", true);
  }
  const t = reduced ? 0 : now * 0.00011,
    tall = innerWidth / innerHeight < 0.8; // a phone held upright: keep the steps and the Emperor in the middle
  camera.position.set(9.9 + Math.sin(t * 1.3) * 1.5, 2.45 + Math.sin(t * 0.9) * 0.18, -19.4 + Math.cos(t * 1.3) * 0.9);
  camera.lookAt(tall ? 3.6 : 1.9, tall ? 3.2 : 3.75, -29.4);
}
let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); // never backwards (a dev check steps its own clock)
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
  }
  if (DIR.on) DIR.tick(dt);
  else if (__DEV__ && S.view) {
    camera.position.set(...S.view.pos);
    camera.lookAt(...S.view.look);
  } else if (!S.started) {
    if (current === "airport") titleCamera(now, dt);
    else {
      const t = reduced ? 0 : now * 0.00012;
      camera.position.set(3 + Math.sin(t) * 1.3, 2.2, 12);
      camera.lookAt(-2, 1, -2);
    }
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
  startHint(phone); /* the controls tip, for a few seconds at the start of play */
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
    // This game's own clips (the owner's salute and descending-stairs clips), packed apart from the shared library.
    loadClips(await model("anims_selassie"));
    // The salute's right hand stays as flat as it starts: as the arm came down, a curl of the fingers pinched the palm (cloth check).
    for (const t of CL.SaluteHS?.tracks || [])
      if (/RightHand(Index|Middle|Ring|Pinky|Thumb)\d\.quaternion$/.test(t.name))
        for (let i = 4; i < t.values.length; i++) t.values[i] = t.values[i % 4];
    $("bar").style.width = "25%";
    // Behind the title: the arrival at Palisadoes, the DC-6 at the steps, Haile Selassie I at the top and the welcome around them
    // (owner's request, November 2026). The story itself begins in the yard when Start is pressed.
    const Q = await ensure("airport");
    current = "airport";
    Q.group.visible = true;
    titleScene(Q);
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
        frame,
      });
    }
  } catch (e) {
    console.error(e);
    $("loadnote").textContent = "The game could not load. Please reload.";
  }
})();
