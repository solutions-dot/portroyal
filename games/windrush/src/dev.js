/* Development checks are stripped from public builds. */
import { createStory, checkFlow, needList } from "../../../engine/story.js";
import { checkAll, reachIssues } from "../../../engine/checks.js";
import {
  auditPlace,
  auditCloth,
  auditWalk,
  auditHeld,
} from "../../../engine/audit.js";
import { ambientCheck } from "../../../engine/ambient.js";
import { gripTick } from "../../../engine/grip.js";
import { skinProbe } from "../../../engine/skinprobe.js";
import { walkRoute, routeIssues } from "../../../engine/placement.js";
import { CAST, BASES } from "./cast.js";
import { STEPS, TASKS, ITEMS } from "./steps.js";
import { CHAPTERS, TALK } from "./content.js";
import { PLACE_IDS } from "./places.js";
import { makeAdapter, CHECK_TABLES } from "./checktables.js";
import { $, closeAll } from "./ui.js";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
export async function dev(A) {
  const { q, S, world, worlds, ensure, go, story } = A;
  window.__WIND = A;
  A.checkAdapter = makeAdapter(A);
  A.checkTables = CHECK_TABLES;
  window.__adapter = A.checkAdapter;
  window.__tables = CHECK_TABLES;
  const emit = (lines) => {
    $("autolog").hidden = false;
    $("autolog").textContent = lines.join("\n");
    window.__RESULT = lines;
  };
  if (q.get("test") === "all") {
    await checkAll(A.checkAdapter, CHECK_TABLES);
    return;
  }
  if (q.has("shot")) {
    A.begin();
    const id = q.get("shot"),
      st =
        {
          yard: 10,
          poster: 24,
          ship: 24,
          deck: 30,
          london: 50,
          work: 60,
          jamaica: 64,
          elder: 72,
          advice: 80,
          people: 10,
        }[id] || 10;
    await go(st);
    closeAll();
    const views = {
      yard: { pos: [7, 3.2, 15], look: [-3, 1, 0] },
      poster: { pos: [-62, 9, 45], look: [-5, 9, -25] },
      ship: { pos: [-35, 8, 22], look: [0, 11, -25] },
      deck: { pos: [0, 2.4, 16], look: [0, 4, -20] },
      london: { pos: [4, 2.6, 16], look: [-5, 2, -6] },
      work: { pos: [-4, 2.7, 15], look: [3, 2, 20] },
      jamaica: { pos: [4, 2.8, 14], look: [1, 1, -1] },
      elder: { pos: [-2.4, 1.65, 4], look: [-4, 1.35, 2] },
      advice: { pos: [-5, 2, 10], look: [1, 1.1, -1] },
    };
    S.view = views[id] || views.yard;
    if (id === "people") {
      world().group.visible = false;
      for (let i = 0; i < BASES.length; i++) {
        const base = BASES[i];
        await A.loadBase(base);
        const spec = Object.values(CAST).find((x) => x.base === base),
          { m } = A.body({
            ...spec,
            base,
            x: ((i % 5) - 2) * 2.2,
            z: -Math.floor(i / 5) * 3,
          });
        A.scene.add(m);
      }
      S.view = { pos: [0, 7.5, 14], look: [0, 1, -3] };
    }
    $("hud").hidden = true;
    window.__SHOT = true;
    return;
  }
  if (!q.has("test") && !q.has("auto")) return;
  A.begin();
  for (const id of PLACE_IDS) await ensure(id);
  await go(10);
  closeAll();
  const results = [];
  let stage = 10;
  const dry = createStory({
    ...story.options,
    where: (id, kind) => {
      const Q = worlds[STEPS[stage].place],
        n = Q.people.find((n) => n.id === id);
      if (kind === "talk" && n) return [n.x, n.z];
      if (TASKS[id]) return TASKS[id].from;
      const p = Q.points[id];
      return p ? [p.x, p.z] : null;
    },
    route: (t) => t,
  });
  for (const id of Object.keys(TASKS)) dry.shows(id, () => {});
  const f = checkFlow(dry, {
    place: (s) => (stage = s),
    start: (s) => {
      const p = worlds[STEPS[s].place].start;
      return [p.x, p.z];
    },
  });
  results.push(f.text);
  for (const [st, who] of Object.entries(TALK))
    for (const L of Object.values(who))
      for (const l of L)
        if (l.text.split(/\s+/).length > 12)
          results.push("DIALOGUE " + st + ": " + l.text);
  for (const Q of Object.values(worlds)) {
    const bad = [];
    for (const n of Q.people)
      if (A.blocked(Q, n.x, n.z, 0.23)) bad.push(n.id + " inside a solid");
    const targets = Object.entries(TASKS)
      .filter(([, t]) => t.place === Q.id)
      .flatMap(([id, t]) =>
        [t.from, t.to].map((p, i) => ({
          id: id + (i ? " place" : " pick"),
          x: p[0],
          z: p[1],
          r: 2.3,
        })),
      )
      .concat(
        Object.entries(Q.points).map(([id, p]) => ({ id, ...p, r: 2.3 })),
      );
    bad.push(
      ...reachIssues({
        start: [Q.start.x, Q.start.z],
        targets,
        bounds: Q.bounds,
        walls: Q.walls,
        r: 0.23,
        label: Q.id + ": ",
      }),
    );
    for (const r of Q.routes)
      bad.push(...routeIssues(r.id, r.pts, Q.walls, r.r || 0.23, false));
    results.push("LAYOUT " + Q.id + " " + bad.length, ...bad);
    const issues = [...Q.life.issues(), ...Q.familyLife.issues()];
    results.push("AMBIENT SETUP " + Q.id + " " + issues.length, ...issues);
  }
  const test = q.get("test");
  if (["audit", "collision", "seating"].includes(test))
    for (const Q of Object.values(worlds)) {
      const r = auditPlace({
        id: Q.id,
        snap: Q.snap,
        npcs: Q.people,
        walls: Q.walls,
        bounds: Q.bounds,
        start: Q.start,
        actions: Object.values(Q.points).map((p) => ({ ...p, r: 2.3 })),
        people: Q.people,
        routes: Q.routes,
      });
      const errors = [...r.floating, ...r.inside, ...r.stuck];
      results.push("AUDIT " + Q.id + " " + errors.length, ...errors);
    }
  if (test === "ambient")
    for (const Q of Object.values(worlds)) {
      const a = ambientCheck(Q.life, {
        seconds: 60,
        dt: 1 / 30,
        start: [Q.start.x, Q.start.z],
        story: () => Q.people,
        blocked: (x, z, r) => A.blocked(Q, x, z, r),
      });
      results.push("AMBIENT " + Q.id + " " + a.lines.length, ...a.lines);
    }
  if (["cloth", "walkers", "skin", "held"].includes(test)) {
    const ids = q.has("b") ? q.get("b").split(",") : BASES;
    for (const base of ids) {
      await A.loadBase(base);
      const spec = Object.values(CAST).find((s) => s.base === base) || {
          sex: "f",
        },
        { m, ctl } = A.body({ ...spec, base, x: 0, z: 0 });
      A.scene.add(m);
      ctl.mx.update(0.3);
      m.updateMatrixWorld(true);
      if (test === "cloth") {
        const poses = [
          ["Idle", 0.3],
          ["Walk", 0.5],
          ["Talk1", 0.4],
          ["TalkM2", 0.4],
          ["Wave", 0.5],
          ...(base === "wr_iris79" ? [["OldIdle", 0.4]] : []),
        ];
        const r = auditCloth(base, m, { poses, after: gripTick, where: true });
        results.push("CLOTH " + base + " " + r.lines.length, ...r.lines);
      }
      if (test === "walkers") {
        ctl.play("Walk");
        ctl.mx.update(0.8);
        results.push(
          "WALK " + base,
          JSON.stringify(
            auditWalk(base, m, spec.idle === "OldIdle" ? 0.85 : 1.05, {
              loops: 2,
              after: gripTick,
            }),
          ),
        );
      }
      if (test === "skin")
        results.push(
          "SKIN " + base,
          JSON.stringify(skinProbe(A.renderer, A.scene, m)),
        );
      if (test === "held")
        results.push(...auditHeld(base, m, m.userData.held || []));
      A.scene.remove(m);
      await wait(0);
    }
    results.push("CARRY " + A.carry.issues().length, ...A.carry.issues());
  }
  if (test === "resume") {
    for (const st of Object.keys(STEPS).map(Number)) {
      await A.checkAdapter.goStep(st);
      const before = A.checkAdapter.snapshot(),
        d = A.checkAdapter.save();
      await A.checkAdapter.restore(d);
      if (JSON.stringify(before) !== JSON.stringify(A.checkAdapter.snapshot()))
        results.push("RESUME mismatch " + st);
    }
    results.push("RESUME END");
  }
  if (test === "budget")
    for (const st of [10, 24, 30, 40, 50, 60, 64, 72, 80]) {
      await go(st);
      closeAll();
      S.view = {
        pos: [world().start.x, 2.2, world().start.z],
        look: [
          0,
          3,
          world().id.includes("harbour") || world().id === "tilbury48"
            ? -28
            : -5,
        ],
      };
      A.tick(0);
      results.push(
        "BUDGET " + world().id + " " + JSON.stringify(A.renderer.info.render),
      );
    }
  if (test === "layout") {
    const bad = [],
      scan = (label) => {
        for (const e of document.querySelectorAll(
          "button,a,h1,h2,#line,#goal,#hint",
        )) {
          if (
            !e.checkVisibility() ||
            getComputedStyle(e).visibility === "hidden"
          )
            continue;
          let sc = e.parentElement,
            scroll = false;
          while (sc && sc !== document.body) {
            if (
              ["auto", "scroll"].includes(getComputedStyle(sc).overflowY) &&
              sc.scrollHeight > sc.clientHeight
            ) {
              scroll = true;
              break;
            }
            sc = sc.parentElement;
          }
          if (scroll) continue;
          const r = e.getBoundingClientRect();
          if (
            r.left < -0.5 ||
            r.top < -0.5 ||
            r.right > innerWidth + 0.5 ||
            r.bottom > innerHeight + 0.5
          )
            bad.push(
              label + ": offscreen " + (e.id || e.textContent.slice(0, 24)),
            );
        }
      };
    closeAll();
    scan("play");
    A.talk(world().people[0]);
    scan("dialogue");
    closeAll();
    $("jbtn").click();
    scan("journal");
    closeAll();
    $("tchap").click();
    scan("chapters");
    $("chcred").click();
    scan("credits");
    closeAll();
    results.push("LAYOUT UI " + bad.length, ...bad);
  }
  if (q.has("auto")) {
    const first = Math.max(1, Number(q.get("auto")) || 1),
      last = q.has("one") ? CHAPTERS[first - 1].last : 85;
    A.chapterState(CHAPTERS[first - 1].first);
    await go(CHAPTERS[first - 1].first);
    closeAll();
    for (let guard = 0; guard < 360 && S.stage <= last; guard++) {
      const st = S.stage,
        row = STEPS[st];
      results.push("STEP " + st + " " + story.goal());
      if (st === 85) {
        closeAll();
        break;
      }
      if (A.DIR.on) {
        for (let i = 0; i < 80 && A.DIR.on; i++) A.DIR.tick(0.2);
        await wait(25);
        continue;
      }
      if (!$("card").hidden) {
        $("cbtns").querySelector("button")?.click();
        await wait(30);
        continue;
      }
      const n = needList(row).find((n) => story.needs(n.id));
      if (!n) {
        results.push("FAIL no task " + st);
        break;
      }
      const p = A.where(n.id, n.kind);
      if (!p) {
        results.push("FAIL no location " + st);
        break;
      }
      S.x = p[0];
      S.z = p[1];
      if (n.kind === "talk") {
        A.talk(world().people.find((x) => x.id === n.id));
        for (let i = 0; i < 30 && !$("dialogue").hidden; i++) $("next").click();
      } else if (n.kind === "do") A.action(n.id);
      else {
        if (st === 75) {
          const draw = A.renderer.render;
          A.renderer.render = () => {};
          const Q = world();
          for (const point of Q.leadPath) {
            S.x = point[0];
            S.z = point[1];
            for (let i = 0; i < 180; i++) A.tick(1 / 30);
          }
          S.x = 0;
          S.z = -6;
          A.renderer.render = draw;
        }
        story.done(n.id);
      }
      results.push(...A.carry.issues());
      await wait(30);
    }
    results.push("AUTO END " + S.stage);
    if (S.stage !== 85 && !q.has("one")) results.push("FAIL incomplete story");
  }
  emit(results);
}
