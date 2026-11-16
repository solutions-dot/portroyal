/* Shared-runner hooks expose the actual game handlers and save state. */
import { STEPS, TASKS } from "./steps.js";
import { CAST } from "./cast.js";
import { CHAPTERS, JOURNAL, TALK } from "./content.js";
import { PLACE_IDS } from "./places.js";
import { needList } from "../../../engine/story.js";
import { slideWalls } from "../../../engine/placement.js";
import { AU, setSound } from "../../../engine/audio.js";
import { $, closeAll } from "./ui.js";
import * as THREE from "three";
export const CHECK_TABLES = {
  real: [],
  settle: 0,
  /* software drawing in the headless browser is several times slower than a phone: the frame time is not judged here (a real phone run with
     ?stats is), but the draw calls and triangles are the phone budget */
  budget: { frameMs: 5000, calls: 220, triangles: 450000, bytes: 30e6 },
  ages: {
    iris: [
      [1948, 9],
      [1962, 23],
      [2018, 79],
    ],
    may: [
      [1948, 32],
      [1962, 46],
    ],
    sam: [
      [1948, 36],
      [1962, 50],
    ],
    pearl: [
      [1948, 34],
      [1962, 48],
    ],
    maya: { born: 2006, seen: [[2018, 12]] },
    naomi: { born: 1950, seen: [[1962, 12]] },
  },
  changes: [10, 20, 30, 40, 50, 60, 64, 70, 80].flatMap((step) =>
    ["may", "sam", "pearl", "iris"].map((id) => ({ step, id, field: "body" })),
  ),
};
export function makeAdapter(A) {
  const { S, world, story } = A;
  const probes = [],
    CAST_BASE = (n) => CAST[n.cast]?.base || n.base,
    clearProbes = () => {
      for (const m of probes.splice(0)) m.parent?.remove(m);
    };
  return {
    chapters: () => CHAPTERS,
    openChapter: async (i) => {
      A.begin();
      A.chapterState(CHAPTERS[i].first);
      await A.go(CHAPTERS[i].first);
      closeAll();
      A.DIR.stop();
    },
    steps: () => Object.keys(STEPS).map(Number),
    step: () => S.stage,
    goStep: async (n) => {
      A.begin();
      A.chapterState(n);
      await A.go(n);
      closeAll();
      A.DIR.stop();
    },
    people: () =>
      world().people.map((n) => ({
        id: n.id,
        name: n.who,
        body: n.base,
        hat: null,
        colours: {},
      })),
    places: () => PLACE_IDS,
    goPlace: async (id) => {
      clearProbes();
      A.begin();
      const n = +Object.keys(STEPS).find((n) => STEPS[n].place === id);
      A.chapterState(n);
      await A.go(n);
      closeAll();
      A.DIR.stop();
    },
    place: () => {
      const Q = world();
      return {
        id: Q.id,
        start: [Q.start.x, Q.start.z],
        bounds: Q.bounds,
        walls: Q.walls,
        blocked: (x, z, r) => A.blocked(Q, x, z, r),
      };
    },
    targets: () =>
      needList(STEPS[S.stage])
        .filter((n) => story.needs(n.id))
        .map((n) => {
          const p = A.where(n.id, n.kind);
          return { id: n.id, label: n.id, x: p?.[0], z: p?.[1], r: 2.3 };
        }),
    held: () => (S.hand ? [S.hand] : []),
    snapshot: () => ({
      stage: S.stage,
      goal: story.goal(),
      place: world().id,
      held: S.hand ? [S.hand] : [],
      people: world()
        .people.filter((n) => n.m.visible)
        .map((n) => n.id),
      pos: [S.x, S.z],
      journal: [...S.journal],
      memory: S.memory,
      placed: { ...S.placed },
      story: story.save(),
    }),
    save: () => {
      A.save();
      return JSON.parse(localStorage.getItem("windrush-save-v1"));
    },
    restore: async (d) => {
      A.resetSceneTasks();
      Object.assign(S, d);
      await A.go(d.stage, { restore: d });
      closeAll();
      A.DIR.stop();
    },
    move: (from, to) => {
      const Q = world(),
        p = slideWalls(from, to, Q.walls, 0.23);
      return [
        Math.max(Q.bounds.x0 + 0.25, Math.min(Q.bounds.x1 - 0.25, p[0])),
        Math.max(Q.bounds.z0 + 0.25, Math.min(Q.bounds.z1 - 0.25, p[1])),
      ];
    },
    journal: () => ({
      pages: JOURNAL.map((p) => ({
        id: p.id,
        text: [...p.simple, ...p.deeper].join(" "),
      })),
      unlocks: JOURNAL.map((p) => p.id),
      refs: JOURNAL.map((p) => p.id),
      speakers: [
        ...new Set(
          Object.values(TALK).flatMap((t) =>
            Object.values(t)
              .flat()
              .map((l) => l.who),
          ),
        ),
      ],
    }),
    /* faces: everyone in the place (story people and the people around them), each measured in the place's own light */
    /* the game draws joined bodies (one painted material, skin lightened 1.55 when built), where the probe cannot find the Skin material,
       so each person is measured on their raw body (Skin lightened 1.55 in the game), stood in the same place's light at the start */
    faces: async () => {
      clearProbes();
      const Q = world(),
        out = [];
      for (const n of [...Q.people, ...Q.extras].filter((n) => n.m.visible)) {
        const raw = n.look || CAST_BASE(n);
        await A.loadBase(raw);
        const { m } = A.body({ base: raw, sex: n.sex, scale: n.scale, x: Q.start.x + out.length * 3, z: Q.start.z, ground: 80 });
        Q.group.add(m);
        probes.push(m);
        out.push({ id: n.id, body: m });
      }
      return out;
    },
    frame: async (dt) => {
      A.tick(dt);
    },
    camera: () => {
      const c = A.camera.position, Q = A.camera.userData.checkPlace;
      if (!Q) return null;
      return { x: c.x, y: c.y, z: c.z, at: { id: Q.id, walls: Q.walls, bounds: Q.bounds } };
    },
    talks: () => needList(STEPS[S.stage]).filter((n) => n.kind === "talk" && story.needs(n.id)).map((n) => n.id),
    talkTo: async (id) => {
      const n = world().people.find((p) => p.id === id);
      if (!n) return;
      A.standNear(n);
      A.talk(n);
      A.tick(0.05);
      await new Promise((r) => setTimeout(r, 200));
      closeAll();
    },
    light: () => ({ tod: "day" }),
    /* what each person in the place is playing, how far, in view or not, and how low their hips are (rule 4: nobody looks fallen) */
    clips: () => {
      const cam = A.camera,
        fr = new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse)),
        out = [];
      for (const n of [...world().people, ...world().extras, ...(world().shipExtras || [])]) {
        if (!n.m.visible) continue;
        // the clip with the most weight now: while Samuel stands up from kneeling, Kneel still holds his hips low as IdleM fades in
        let a = n.ctl.cur,
          bw = 0;
        for (const x of n.ctl.mx._actions) {
          const w = x.isRunning() ? x.getEffectiveWeight() : 0;
          if (w > bw) {
            bw = w;
            a = x;
          }
        }
        const
          c = a ? a.getClip() : null,
          p = n.m.getWorldPosition(new THREE.Vector3()),
          hips = n.m.getObjectByName("mixamorigHips"),
          hy = hips ? hips.getWorldPosition(new THREE.Vector3()).y - p.y : 1;
        out.push({
          id: n.id,
          clip: c ? c.name : "none",
          t: c && c.duration ? (a.time % c.duration) / c.duration : 0,
          dist: Math.hypot(p.x - cam.position.x, p.z - cam.position.z),
          inView: fr.containsPoint(p.clone().setY(p.y + 1)),
          hips: n.m.userData.hip0 ? hy / n.m.userData.hip0 : 1,
        });
      }
      return out;
    },
    audio: () => AU,
    setSound,
    renderer: () => A.renderer,
    scene: () => A.scene,
    screens: () => ({
      title: () => {
        closeAll();
        $("title").hidden = false;
        $("hud").hidden = true;
      },
      play: () => {
        closeAll();
        A.begin();
      },
      dialogue: () => {
        closeAll();
        A.begin();
        A.talk(world().people[0]);
      },
      journal: () => {
        closeAll();
        $("jbtn").click();
      },
      chapters: () => {
        closeAll();
        $("tchap").click();
      },
      credits: () => {
        closeAll();
        $("tchap").click();
        $("chcred").click();
      },
    }),
  };
}
