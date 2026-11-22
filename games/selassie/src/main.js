import { touchFirst } from '../../../engine/device.js';
import { addRecap } from "../../../engine/recap.js";   /* three things you learned, on the last card */
import "../../../engine/textfit.js";   // first: every sign's words fit their board (engine/textfit.js)
/* A self-contained game on the established shared engine APIs. */
import { renderFramed } from "../../../engine/cine.js";
import { sceneWarning, readWhatHappened } from "../../../engine/scene-warning.js";
import { placeActionButton } from "../../../engine/action-button.js";
placeActionButton();   /* the button for a thing to do sits mid-screen (engine/action-button.js) */
import { offerNextChapter } from "../../../engine/chapter-end.js";   /* camera scenes framed for a phone held upright (engine/cine.js) */
import * as THREE from "three";
import { clone as cloneBody } from "three/addons/utils/SkeletonUtils.js";
import { loadClips, animate, groundFeet, CL, idleOK, lookEnd } from "../../../engine/anim.js";
import { hudTidy } from "../../../engine/hud.js";
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
  chirp,
  gullCry,
  mixBeds,
  bedTest,
  carFar,
  hornFar,
  dogFar,
  radioFar,
  planeFar,
  frog,
} from "../../../engine/audio.js";
import { snapMeshes } from "../../../engine/audit.js";
import { makeSky, G, batchStatic, cv } from "./gfx.js";
import { buildPlace, mergePlace } from "./places.js";
import { CAST, crowdLook } from "./cast.js";
import { spreadBodies } from "../../../engine/faces.js";
const FACE_VARIANTS = { sel_crowdman66: 3, sel_crowdwoman66: 3, sel_rastaman66: 2, sel_rastatam66: 2, sel_rastaelder66: 2, sel_rastawoman66: 3, sel_boy66: 2, sel_girl66: 2, sel_vendor30: 2 }; // how many more faces each crowd body has
const CROWD_MEN = ["sel_crowdman66", "sel_rastaman66", "sel_rastatam66", "sel_rastaelder66"],
  CROWD_WOMEN = ["sel_crowdwoman66", "sel_rastawoman66"];
import { actions } from "./life.js";
import * as P from "./props.js";
import { STEPS, ITEMS, TASK_IDS } from "./steps.js";
import {
  CHAPTERS,
  chapterOf,
  PEOPLE,
  TALK,
  FLAVOUR,
  CARDS,
  PLACE_NAMES,
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
import { tunePixels } from '../../../engine/perf.js';
import { setQuiet, stepPlaces } from '../../../engine/preload.js';
import { addExit } from '../../../engine/exit.js';
const KEY = "selassie-save-v1",
  q = new URLSearchParams(location.search),
  QUICK = __DEV__ && (q.has("auto") || q.has("test"));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches,
  phone = touchFirst() /* engine/device.js: an iPad in desktop mode and touch tablets too */;
soundPref("selassie-sound");
const renderer = new THREE.WebGLRenderer({
  canvas: $("stage"),
  antialias: true,
});
tunePixels(renderer, { phone, phoneMax: 1.4 });   /* pixel cap and slow-frame drop (engine/perf.js) */
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
const carry = createCarry({ camera, fit: true });
addEventListener("resize", carry.fitView);
const world = () => worlds[current];
const blocked = (Q, x, z, r = 0.24) =>
  x < Q.bounds.x0 + r ||
  x > Q.bounds.x1 - r ||
  z < Q.bounds.z0 + r ||
  z > Q.bounds.z1 - r ||
  Q.walls.some(
    (w) => x > w[0] - r && x < w[2] + r && z > w[1] - r && z < w[3] + r,
  );
/* Haile Selassie's tunic sleeves flared wide at the wrist, which shows in the salute (owner, 18 Nov 2026). Until the body is rebuilt,
   the sleeve's last part is drawn in toward the line from elbow to wrist, more toward the cuff. His bodies are joined (one painted mesh),
   so the sleeve is told from the skin by colour: the palm gives his skin colour, and only points of another colour move. CUFF is how much
   narrower the cuff ends. */
const CUFF = 0.5;
function narrowCuffs(root) {
  const v = new THREE.Vector3(), E = new THREE.Vector3(), W = new THREE.Vector3(), m = new THREE.Matrix4(), axis = new THREE.Vector3(), foot = new THREE.Vector3(), c = new THREE.Color();
  root.traverse((o) => {
    if (!o.isSkinnedMesh || /Measure/.test(o.name)) return;
    const g = o.geometry, P = g.attributes.position, SI = g.attributes.skinIndex, SW = g.attributes.skinWeight, C = g.attributes.color, bones = o.skeleton.bones;
    if (!SI || !SW) return;
    const named = /^(Jacket|Sleeve)/.test(o.material?.name || "");
    if (!named && !C) return;
    for (const side of ["Right", "Left"]) {
      const fi = bones.findIndex((b) => b.name.endsWith(side + "ForeArm")), hi = bones.findIndex((b) => b.name.endsWith(side + "Hand"));
      if (fi < 0 || hi < 0) continue;
      const at = (i, out) => out.setFromMatrixPosition(m.copy(o.skeleton.boneInverses[i]).invert()).applyMatrix4(o.bindMatrixInverse);
      at(fi, E); at(hi, W); axis.subVectors(W, E); const L2 = axis.lengthSq();
      const armW = (i) => { let w = 0; for (let k = 0; k < 4; k++) { const b = SI.getComponent(i, k); if (b === fi || b === hi) w += SW.getComponent(i, k); } return w; };
      const tOf = (i) => v.fromBufferAttribute(P, i).sub(E).dot(axis) / L2;
      let skin = null;
      if (C) {   /* the palm's colour: points well past the wrist */
        let r = 0, gg = 0, bb = 0, n = 0;
        for (let i = 0; i < P.count; i++) if (armW(i) > 0.5 && tOf(i) > 1.25) { c.fromBufferAttribute(C, i); r += c.r; gg += c.g; bb += c.b; n++; }
        if (n) skin = new THREE.Color(r / n, gg / n, bb / n);
      }
      for (let i = 0; i < P.count; i++) {
        if (armW(i) < 0.5) continue;
        const t = tOf(i);
        if (t < 0.45 || t > 1.12) continue;
        if (!named && skin) { c.fromBufferAttribute(C, i); if (Math.abs(c.r - skin.r) + Math.abs(c.g - skin.g) + Math.abs(c.b - skin.b) < 0.12) continue; }
        const k = Math.min(1, (t - 0.45) / 0.5), f = 1 - CUFF * k * k * (3 - 2 * k);
        v.fromBufferAttribute(P, i); foot.copy(axis).multiplyScalar(t).add(E); v.sub(foot).multiplyScalar(f).add(foot); P.setXYZ(i, v.x, v.y, v.z);
      }
    }
    P.needsUpdate = true; g.computeBoundingSphere();
  });
}
function loadBase(id) {
  return bases[id]
    ? Promise.resolve(bases[id])
    : pending[id] ||
        (pending[id] = model(id)
          .then((g) => (/^sel_emperor66/.test(id) && narrowCuffs(g.scene || g), (bases[id] = g)))
          .catch((error) => {
            delete pending[id];
            throw error;
          }));
}
// The builder records each garment before joining the crowd mesh. Use that
// boundary instead of guessing from the position or the original colour.
const VARIANTS = new Map();
function recolour(o, colors) {
  const mask = o.geometry.getAttribute("_tint");
  const painted = o.geometry.getAttribute("color");
  if (!mask || !painted) return;

  const key = o.geometry.uuid + "|" + colors.shirt + "|" + colors.legs;
  let geometry = VARIANTS.get(key);
  if (!geometry) {
    geometry = o.geometry.clone();
    const shades = geometry.getAttribute("color");
    const shirt = colors.shirt === undefined ? null : new THREE.Color(colors.shirt);
    const legs = colors.legs === undefined ? null : new THREE.Color(colors.legs);
    for (let i = 0; i < mask.count; i++) {
      const region = mask.getX(i);
      const color = region > 0.75 ? shirt : region > 0.25 ? legs : null;
      if (color) shades.setXYZ(i, color.r, color.g, color.b);
    }
    VARIANTS.set(key, geometry);
  }
  o.geometry = geometry;
}
function body(spec) {
  const m = cloneBody(bases[spec.bodyId || spec.base].scene);
  m.traverse((o) => {
    if (!o.isMesh) return;
    if (o.userData.measureOnly || /^SkirtSeat/.test(o.name)) o.visible = false;
    o.frustumCulled = true;
    if (spec.colors && o.material.name === "Crowd") recolour(o, spec.colors);
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
/* engine/preload.js: the next place is built, and its shaders and textures sent, while the player reads (a conversation, a card, the title),
   so arriving there no longer waits on a build. go() awaits the same cached ensure() promise, so nothing is built twice and a fast player
   only waits as before. ahead() is not used: a place's people are known only once buildPlace has run, and the job downloads them itself. */
const PLACES = stepPlaces({ steps: STEPS, chapters: CHAPTERS, chapterOf: (s) => chapterOf(s), worlds, ensure: (id) => ensure(id), current: () => current, renderer, camera, scene });
const { nextPlace, prepare, releaseFar } = PLACES;   /* engine/preload.js: the next place built and warmed in quiet moments, far places let go */
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
        !(Q.id === "airport" ? i % (phone ? 14 : 2) !== 0 : phone && Q.thin && i % Q.thin !== 0) &&
        !blocked(Q, s.x, s.z, 0.3) &&
        !onKeepOff(Q.keepOff, s.x, s.z, 0.3) &&
        !specs.some((n) => Math.hypot(s.x - n.x, s.z - n.z) < 1.3),
    )
    .map((s) => ({
      ...crowdLook(s.look || 0, Q.id === "airport" || Q.mixed),
      ...s,
      base: (s.base || crowdLook(s.look || 0, Q.id === "airport" || Q.mixed).base) + tier,
    }));
  // A lone end of a filtered chat group becomes a watcher, never a conversation with nobody.
  for (const n of extras)
    if (
      n.behaviour.kind === "chat" &&
      extras.filter((e) => e.behaviour.group === n.behaviour.group).length < 2
    )
      n.behaviour = { kind: "watch", at: [19, -28], react: ["Point", "Wave"] };
  /* engine/faces.js (17 November 2026): no two copies of one body with the same face come within 3 m of each other, measured over where each one walks.
     The crowd bodies have three faces (<base>_b, <base>_c: tools/selassie/build-people.mjs, "variants"). At the airport and in mixed crowds a person with
     no face left takes another body of the same sex; the clothes' colours stay. The police line is one squad in uniform and is left as it is. */
  {
    const crowd = [...extras, ...rooftops].filter((s) => !s.police && !/police/.test(s.base)),
      strip = (b) => b.slice(0, -tier.length),
      pool = Q.id === "airport" || Q.mixed;
    const SP = crowd.map((s) => ({ base: strip(s.base), x: s.x, z: s.z, life: s.behaviour }));
    Q.facesLeft = spreadBodies(SP, (b) => FACE_VARIANTS[b] || 0, {
      near: 3,
      fixed: specs.map((s) => ({ base: s.base, x: s.x, z: s.z })),
      alts: (s) => (!pool ? null : CROWD_MEN.includes(s.base) ? CROWD_MEN : CROWD_WOMEN.includes(s.base) ? CROWD_WOMEN : null),
      // a stroller with no face left stays where they are and watches the road instead
      settle: (p) => {
        if (!p.life || p.life.kind !== "wander") return false;
        p.life = crowd[SP.indexOf(p)].behaviour = { kind: "watch", at: [p.x + 1, p.z + 3], react: ["Point", "Wave"] };
        return true;
      },
    });
    SP.forEach((p, i) => {
      const s = crowd[i];
      if (p.base !== strip(s.base)) {
        s.rastafari = /rasta/.test(p.base);
        if (p.base !== "sel_crowdman66") s.hat = undefined;
      }
      s.base = p.base + (p.variant || "") + tier;
    });
    if (__DEV__ && /[?&]faces/.test(location.search))
      console.log("FACES " + Q.id + " left " + Q.facesLeft + " of " + SP.length + ": " + SP.map((p, i) => (p.faceLeft ? crowd[i].id + "=" + p.base + p.variant + " " + (p.life?.kind || "") : "")).filter(Boolean).join(" | ") + " ; bodies " + JSON.stringify(SP.reduce((o, p) => ((o[p.base] = (o[p.base] || 0) + 1), o), {})));
  }
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
    ...(Q.id === "airport" ? CROWD_DETAIL : {}),
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
    Q.life.add(n, actions(n, s.behaviour, { welcome: Q.id === "airport" }));
  }
  for (const n of Q.people.filter((n) => !n.historical))
    Q.familyLife.add(
      n,
      actions(n, {
        kind: "watch",
        at: [n.x + 1, n.z + 3],
        react: ["Point", "Wave"],
        stay: true,
      }),
    );
  Q.roofLife = createAmbient({
    walls: [],
    bounds: { x0: -31, z0: 35, x1: 31, z1: 43 },
    phone,
    seed: 2121,
    ...CROWD_DETAIL,
  });
  Q.arrivalLife = createAmbient({
    walls: [
      [3.5, -30.4, 5.1, -25.6], // the boarding steps
      [-11, -50, 0.6, -13.5], // the wing and the propellers
    ],
    bounds: { x0: -35, z0: -27, x1: 40, z1: -12 },
    phone,
    seed: 6604,
    ...CROWD_DETAIL,
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
    (s.zone === "roof" ? Q.roofLife : Q.arrivalLife).add(n, actions(n, s.behaviour, { welcome: true }));
  }
  // children who play chase one another: the friend is named in the place, and found here
  for (const n of Q.extras) if (n.amb?.spec.chaseId) n.amb.spec.chase = Q.extras.find((o) => o.id === n.amb.spec.chaseId);
  // everyone who watches the aircraft keeps the spot they were given, so the cinematic can turn them to it and back
  for (const n of Q.extras) if (n.amb?.spec.at) n.at0 = n.amb.spec.at;
  // Everyone starts on one of their own idles at once, at its own moment: a cross-fade out of the plain Idle in the first second
  // swung heads round faster than a person turns (the head check), and a watcher could stand in the plain Idle until its first change.
  for (const n of [...Q.extras, ...Q.people.filter((p) => !p.historical)]) {
    const L = n.amb?.spec.idles?.filter((c) => idleOK(c) && n.ctl.get(c));
    if (!L?.length || n.amb.kind === "work" || n.amb.kind === "sit") continue;
    let h = (n.id || "").split("").reduce((s, c) => Math.imul(s ^ c.charCodeAt(0), 2654435761) >>> 0, 2166136261);
    const r = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) % 10007) / 10007,
      act = n.ctl.get(L[Math.floor(r() * L.length)]);
    n.ctl.cur.stop();
    act.reset().play();
    act.time = r() * act.getClip().duration;
    act.timeScale = 0.88 + r() * 0.24; // as the ambient system does: never in step
    n.ctl.cur = act;
    n.ctl.mx.update(0);
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
  const own = Q.where?.(id, S); // a place's own carried tasks (kingston.js)
  if (own) return own;
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
/* what a place's own tasks may do (kingston.js: Q.act, Q.show) */
const taskApi = (Q) => ({
  S,
  Q,
  hold: (id) => setHeld(id, getItem(id)),
  place: (at) => putHeld(at),
  give: (id) => giveCup(Q.people.find((n) => n.id === id)),
  notice,
  sound: uiSound,
});
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
    const t = Q.items.tin;
    if (S.hand !== "tin" && S.stage >= 12) {
      if (t.parent !== Q.group) Q.group.add(t);
      t.position.set(-5, 0.83, -2);
      t.visible = true;
    }
    t.userData.lid.rotation.x = S.stage >= 13 ? -1.9 : 0;
  }
  Q.show?.(taskApi(Q));
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
    $("fadeT").textContent =
      PLACE_NAMES[STEPS[stage].place] || CHAPTERS[chapterOf(stage)].caption;
    $("fadeS").textContent =
      STEPS[stage].place === "memory"
        ? "A memory, 1930"
        : CHAPTERS[chapterOf(stage)].year;
    $("fade").hidden = false;
  }
  let Q;
  const t0 = performance.now();
  try {
    Q = await ensure(STEPS[stage].place);
    if (__DEV__ && change) (window.__arrive ||= []).push([STEPS[stage].place, Math.round(performance.now() - t0)]); /* dev: how long arriving waited on the place being built */
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
  const newChapter = change || chapterOf(stage) !== chapterOf(S.stage);
  current = Q.id;
  PLACES.shown(Q.id); /* drawn now, so sent again */
  if (newChapter && $("title").hidden) releaseFar(stage);
  prepare(nextPlace(stage));
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
  if (Q.lead && stage === Q.lead.stage) {
    const n = Q.people.find((n) => n.id === "mum");
    [n.x, n.z] = Q.lead.path[0];
    n.m.position.set(n.x, 0, n.z);
    Q.familyLife.hold(n, true);
    lead(n, Q.lead.path, { walk: 1.2, run: false, wait: 6, resume: 4 });
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
  const evening = !!Q.evening;
  sky.setSky(evening ? 0x667f8b : 0x6ca9bb, evening ? 0xe0aa78 : 0xe1d4ac);
  sun.intensity = evening ? 1.45 : 2.2;
  $("place").textContent = PLACE_NAMES[Q.id] || CHAPTERS[chapterOf(stage)].caption;
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
/* a finished chapter: offer the next one on screen, as every game does, after a short pause on a clear screen and with no "Stay here" (engine/chapter-end.js) */
let nextPending = null;
function finishChapter(next) {
  S.best = Math.max(S.best, chapterOf(next));
  save();
  nextPending = next;
  offerNextChapter({ still: () => nextPending === next, clear: () => !openPanel() && $("cineControls").hidden, show: nextCard, pause: QUICK ? 0 : undefined });
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
  if (st === 26) cardData(CARDS.ready, [["Continue", () => finishChapter(30)]]);
  if (st === 46) {
    card(
      "A sound across the sky",
      ["Your family turns toward the runway."],
      [["Continue", () => finishChapter(50)]],
    );
  }
  if (st === 50) {
    arrivalCard(() => go(51));
  }
  if (st === 51) {
    if (restoreArrival) {
      restoreArrival = false;
      arrivalCard(() => DIR.start());
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
/* the arrival is loud and big, not scary: the standard card as a plain choice, Watch scene or Read what happened instead (engine/scene-warning.js) */
function arrivalCard(watch) {
  sceneWarning(card, { title: CARDS.arrival.title, what: CARDS.arrival.lines, scary: false, watch, read: readArrival, pairs: true });
}
function readArrival() {
  DIR.stop();
  S.x = -3;
  S.z = 19;
  S.yaw = 0.45;
  readWhatHappened(card, { what: CARDS.arrivalRead.lines, go: () => { unlock("planno"); go(55, { keep: true }); }, pairs: true });   /* the standard What happened card (engine/scene-warning.js) */
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
  else if (Q.act?.[id]) {
    if (Q.act[id](taskApi(Q)) === false) return;
  } else if (id === "paper") {
    setHeld(id, getItem(id));
  } else if (id === "map") {
    putHeld([3.65, 0.89, -8]);
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
    delete Q.props.cupGiven;
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
  S.packed = c.first > 25 ? ["water", "lunch", "fruit"] : [];
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
          ? MARKS.tap(e.clientX, e.clientY, world().people.filter((p) => !p.historical), S.x, S.z, TALK_R)
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
      stepSound(Q.surface || (Q.id === "yard" || Q.id === "memory" ? "sand" : "stone"));
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
const TALK_R = 2.5; /* how near you must be to talk: the talk button and a tap on a person (engine/tap.js) use the same reach */
function findNear() {
  near = null;
  if (!S.started || busy || openPanel() || DIR.on) return;
  let best = TALK_R;
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
          (need.id === "tin" || world().carryTo?.includes(need.id))
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
/* the welcome on the apron is lively at full detail: more people get moving heads and an update every frame (phones keep fewer) */
const CROWD_DETAIL = phone ? { full: 14, maxFull: 12, mid: 34 } : { full: 40, maxFull: 40, mid: 60 };
/* during the arrival everyone who watches looks at the aircraft as it lands and taxis in, then at the steps once it stands there */
const _pw = new THREE.Vector3();
function aimCrowd(Q) {
  const p = Q.props.plane,
    moving = DIR.on && DIR.time < 32 && p?.visible;
  if (moving) p.getWorldPosition(_pw);
  for (const n of Q.extras) {
    if (!n.amb || !n.at0 || n.amb.kind !== "watch" || n.zone === "roof") continue; // the roof faces the apron: the plane is behind some
    n.amb.spec.at = moving ? [_pw.x, _pw.z] : n.at0;
  }
}
/* A person turns the head at most so fast: the background crowd's own looks (engine/ambient.js) are eased, but a cross-fade between two
   standing clips, or a look starting as a clip turns the head, could add up to a flick past 320 degrees a second (the head check).
   After everything has moved, the neck and the head each turn at most HEAD_RATE from where they were last frame. The ambient system's
   own record of the head is kept in step, so its guard against a look piling up frame on frame still works. */
const HEAD_RATE = (140 * Math.PI) / 180,
  _hq = new THREE.Quaternion();
function steadyHeads(Q, dt) {
  if (!(dt > 0)) return;
  const step = HEAD_RATE * dt;
  for (const n of [...Q.people, ...Q.extras]) {
    if (!n.m.visible || !n.amb) continue;
    const b = n.m.userData.steady || (n.m.userData.steady = ["mixamorigNeck", "mixamorigHead"].map((k) => ({ bone: n.m.getObjectByName(k), last: null })));
    b.forEach((s, i) => {
      if (!s.bone) return;
      if (s.last) {
        _hq.copy(s.last).rotateTowards(s.bone.quaternion, step);
        s.bone.quaternion.copy(_hq);
      }
      (s.last || (s.last = new THREE.Quaternion())).copy(s.bone.quaternion);
    });
    lookEnd(b.map((s) => s.bone));   /* tell the engine's guard what the head was left as (engine/anim.js), so a look still cannot pile up */
  }
}
/* ---------- sound: each place has its own mix of the engine's beds, and now and then one small sound (22 November 2026: it had none) ----------
   Kingston 1966 by day: far traffic, people, birds and a radio down the road; the Palisadoes road: the harbour, gulls and the walking crowd;
   the airport: the waiting crowd, the wind off the sea and an aeroplane far off; the lane at dusk: crickets, frogs, a dog and the shop's radio. */
const pick = (...f) => () => f[(Math.random() * f.length) | 0]();
const SOUNDSCAPE = {
  yard: { wind: 0.05, crowd: 0.05, traffic: 0.07, once: pick(chirp, chirp, dogFar, radioFar, carFar) },
  memory: { wind: 0.07, crowd: 0.05, once: pick(chirp, chirp, dogFar) },
  downtown: { crowd: 0.2, traffic: 0.13, wind: 0.03, once: pick(carFar, hornFar, radioFar, chirp) },
  parade: { crowd: 0.22, traffic: 0.15, wind: 0.03, once: pick(carFar, hornFar, chirp) },
  road: { sea: 0.16, surf: 0.06, wind: 0.1, crowd: 0.14, traffic: 0.05, once: pick(gullCry, gullCry, carFar) },
  airport: { crowd: 0.24, wind: 0.1, sea: 0.04, once: pick(planeFar, gullCry, chirp) },
  lane: { cricket: 0.08, crowd: 0.05, traffic: 0.03, wind: 0.03, once: pick(radioFar, frog, frog, dogFar) },
};
if (__DEV__ && q.get("test") === "beds") bedTest(SOUNDSCAPE); /* ?test=beds : each place's bed levels against the shared range (engine/audio.js) */
let auNext = 0,
  onceAt = 5;
function audioTick(t) {
  if (!AU.ctx || t < auNext) return;
  auNext = t + 0.1;
  const L = (S.started && SOUNDSCAPE[current]) || {},
    hold = DIR.paused; /* the cinematic's Pause stops every sound */
  mixBeds(hold ? {} : L, { duck: !!talking || DIR.on, tc: hold ? 0.15 : 0.6 });
  if (t > onceAt) {
    onceAt = t + 6 + Math.random() * 6;
    if (L.once && AU.on && !hold && !DIR.on) L.once();
  }
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
  // Behind the title the crowd is seen from the slowly drifting camera, not from Ruth, so detail (moving heads, every frame animated)
  // goes to the people near the camera. Not in the cinematic: its cuts would hand detail from one group to another in a frame, and
  // their heads would snap (the head check found it). There the welcome turns to follow the aircraft until it stands at the steps.
  const show = Q.id === "airport" && !S.started && !DIR.on,
    cx = show ? camera.position.x : S.x,
    cz = show ? camera.position.z : S.z;
  if (Q.id === "airport") aimCrowd(Q);
  Q.life.tick(frozen ? 0 : dt, {
    px: show ? cx : S.x,
    pz: show ? cz : S.z,
    talking,
    story: Q.people.filter((n) => story.marked(n.id)),
    view: { x: camera.position.x, z: camera.position.z, yaw: S.yaw },
  });
  Q.arrivalLife?.tick(frozen ? 0 : dt, {
    px: cx,
    pz: cz,
    watchTarget: DIR.on,
    story: [],
    view: { x: camera.position.x, z: camera.position.z, yaw: S.yaw },
  });
  Q.roofLife?.tick(frozen ? 0 : dt, {
    px: cx,
    pz: cz,
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
  audioTick(now / 1000);
  steadyHeads(Q, dt);
  renderFramed(renderer, scene, camera, DIR.on);
  if (S.started && (saveT += dt) > 3) {
    saveT = 0;
    save();
  }
}
async function start() {
  if (!ready || busy) return;
  audioInit();
  S.started = true;
  if (!saved) cue("begin");
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
/* The owner's salute clip, on his body, brings the hand to the cheek, not to the cap (owner, 18 Nov 2026). The upper arm and forearm
   get an extra turn that grows with how far into the salute each moment is (0 at rest, 1 at the full salute), so the rest pose is not
   changed and the hand meets the brim. SALUTE_FIX is [arm x, y, z, forearm x, y, z] in radians; ?sfix=... tries other values (dev). */
const SALUTE_FIX = [0, 0, -0.8, -0.5, 0.75, 0];
function raiseSalute(clip, rig) {
  if (!clip) return;
  /* a salute is given with the fingers straight and together (the reference photographs): the four fingers take the rig's rest pose, which is straight; the thumb is left as the clip has it */
  /* the clip moves only the first joint of each finger; the other two keep whatever the last clip left (a curl), so all three are set here */
  const prefix = (clip.tracks.find((t) => /RightHandIndex1\.quaternion$/.test(t.name)) || { name: "mixamorigRightHandIndex1.quaternion" }).name.replace(/RightHandIndex1\.quaternion$/, "");
  for (const f of ["Index", "Middle", "Ring", "Pinky"])
    for (const j of [1, 2, 3]) {
      const bone = prefix + "RightHand" + f + j, b = rig && rig.getObjectByName(bone), q = b ? b.quaternion : new THREE.Quaternion();
      const t = clip.tracks.find((t) => t.name === bone + ".quaternion");
      if (t) for (let i = 0; i < t.values.length; i += 4) q.toArray(t.values, i);
      else clip.tracks.push(new THREE.QuaternionKeyframeTrack(bone + ".quaternion", [0, clip.duration], [...q.toArray(), ...q.toArray()]));
    }
  let fix = SALUTE_FIX;
  if (__DEV__) { const v = new URLSearchParams(location.search).get("sfix"); if (v) fix = v.split(",").map(Number); }
  const parts = [["RightArm", fix.slice(0, 3)], ["RightForeArm", fix.slice(3, 6)]];
  const tr = clip.tracks.find((t) => /RightArm\.quaternion$/.test(t.name));
  if (!tr) return;
  const q0 = new THREE.Quaternion().fromArray(tr.values, 0), qi = new THREE.Quaternion(), n = tr.values.length / 4;
  const ang = []; let max = 1e-6;
  for (let i = 0; i < n; i++) { qi.fromArray(tr.values, i * 4); const a = q0.angleTo(qi); ang.push(a); max = Math.max(max, a); }
  const w = ang.map((a) => Math.min(1, a / (max * 0.85)));   /* how far into the salute each key of the upper arm is */
  for (const [bone, e] of parts) {
    const t = clip.tracks.find((t) => new RegExp(bone + "\\.quaternion$").test(t.name));
    if (!t) continue;
    const d = new THREE.Quaternion().setFromEuler(new THREE.Euler(e[0], e[1], e[2])), id = new THREE.Quaternion(), dq = new THREE.Quaternion();
    const wAt = (time) => { let k = 0; while (k < n - 1 && tr.times[k + 1] <= time) k++; if (k >= n - 1) return w[n - 1]; const f = (time - tr.times[k]) / (tr.times[k + 1] - tr.times[k] || 1); return w[k] + (w[k + 1] - w[k]) * Math.max(0, Math.min(1, f)); };   /* the bones' keys need not line up */
    for (let i = 0; i < t.times.length; i++) { qi.fromArray(t.values, i * 4); dq.slerpQuaternions(id, d, wAt(t.times[i])); qi.multiply(dq).toArray(t.values, i * 4); }
  }
}
$("start").onclick = start;
onLoadFail((name) => {
  $("loadnote").textContent =
    "Some parts of the world could not load. Please reload.";
});
(async () => {
  try {
    const animsGltf = await model("anims");
    loadClips(animsGltf);
    // This game's own clips (the owner's salute and descending-stairs clips), packed apart from the shared library.
    loadClips(await model("anims_selassie"));
    // The salute's right hand stays as flat as it starts: as the arm came down, a curl of the fingers pinched the palm (cloth check).
    for (const t of CL.SaluteHS?.tracks || [])
      if (/RightHand(Index|Middle|Ring|Pinky|Thumb)\d\.quaternion$/.test(t.name))
        for (let i = 4; i < t.values.length; i++) t.values[i] = t.values[i % 4];
    raiseSalute(CL.SaluteHS, animsGltf.scene);
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
    /* engine/preload.js: the player is reading, not moving, while a panel (a conversation, a card, the journal), the place fade or the title is on screen */
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
hudTidy();   /* the toast keeps clear of the action button and wraps its words (engine/hud.js) */
addRecap({ items: [{ icon: '\uD83D\uDC51', label: 'A king in Ethiopia', page: 'coronation', img: 'recap/coronation.jpg' }, { icon: '\u2708\uFE0F', label: 'Palisadoes Airport', page: 'airport', img: 'recap/airport.jpg' }, { icon: '\uD83D\uDCC5', label: 'Remembering the day', page: 'grounation', img: 'recap/grounation.jpg' }], open: () => { closeAll(); showJournal(); }, title: 'A new memory in the tin', unlocked: null });   /* three tappable journal pages on the last card (engine/recap.js) */
addExit({ url: '../../../menu/', save: () => save() });   /* Exit, right of the Journal button, with an "are you sure" (engine/exit.js) */
