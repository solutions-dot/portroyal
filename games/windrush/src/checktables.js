/* Shared-runner hooks expose the actual game handlers and save state. */
import { STEPS, TASKS } from "./steps.js";
import { CHAPTERS, JOURNAL, TALK } from "./content.js";
import { PLACE_IDS } from "./places.js";
import { needList } from "../../../engine/story.js";
import { slideWalls } from "../../../engine/placement.js";
import { AU, setSound } from "../../../engine/audio.js";
import { $, closeAll } from "./ui.js";
export const CHECK_TABLES = {
  real: [],
  settle: 0,
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
