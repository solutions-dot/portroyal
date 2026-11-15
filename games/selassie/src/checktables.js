/* Hooks for the shared gameplay and quality runner. */
import { STEPS } from "./steps.js";
import { CHAPTERS, JOURNAL, TALK } from "./content.js";
import { needList } from "../../../engine/story.js";
import { slideWalls } from "../../../engine/placement.js";
import { AU, setSound } from "../../../engine/audio.js";
import { closeAll, $ } from "./ui.js";
export const CHECK_TABLES = {
  real: [],
  settle: 0,
  ages: { ruth: { born: 1956, seen: [[1966, 10]] } },
  cast: { adina: ["adina"], mum: ["mum"], levi: ["levi"] },
  lights: { yard: ["day", "dusk"] },
};
export function makeAdapter(A) {
  const { S, world, story } = A;
  const snapshot = () => ({
    stage: S.stage,
    goal: story.goal(),
    place: world().id,
    held: S.hand ? [S.hand] : [],
    people: world()
      .people.filter((n) => n.m.visible)
      .map((n) => n.id),
    pos: [S.x, S.z],
    packed: [...S.packed],
    share: S.share,
    journal: [...S.journal],
    memory: S.memory,
    x: S.x,
    z: S.z,
  });
  return {
    chapters: () => CHAPTERS,
    openChapter: async (i) => {
      A.begin();
      S.hand = null;
      A.carry.drop();
      await A.go(CHAPTERS[i].first);
      closeAll();
      A.DIR.stop();
    },
    step: () => S.stage,
    steps: () => Object.keys(STEPS).map(Number),
    goStep: async (n) => {
      A.begin();
      await A.go(n);
      closeAll();
      A.DIR.stop();
    },
    people: () =>
      world().people.map((n) => ({
        id: n.id,
        name: n.who,
        body: n.base,
        hat: n.hat || null,
        colours: n.tint || {},
      })),
    places: () => ["yard", "memory", "road", "airport"],
    goPlace: async (id) => {
      A.begin();
      await A.go({ yard: 20, memory: 15, road: 30, airport: 55 }[id]);
      closeAll();
      A.DIR.stop();
    },
    place: () => {
      const Q = world();
      return {
        id: Q.id,
        bounds: Q.bounds,
        start: [Q.start.x, Q.start.z],
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
    snapshot,
    save: () => {
      A.save();
      return JSON.parse(localStorage.getItem("selassie-save-v1"));
    },
    restore: async (d) => {
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
          Object.values(TALK).flatMap((w) =>
            Object.values(w)
              .flat()
              .map((l) => l.who),
          ),
        ),
      ],
    }),
    renderer: () => A.renderer,
    scene: () => A.scene,
    audio: () => AU,
    setSound,
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
        A.begin();
        A.talk(world().people.find((n) => !n.historical));
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
