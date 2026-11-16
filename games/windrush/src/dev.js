/* Development checks are stripped from public builds. */
import { createStory, checkFlow, needList } from "../../../engine/story.js";
import { checkAll, reachIssues, CHECKS } from "../../../engine/checks.js";
import { animCheck } from "./animcheck.js";
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
import { CAST, BASES, CROWD } from "./cast.js";
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
  /* a free spot in front of (or else beside) a person, clear of walls, furniture and other people, for the autoplayer and the camera check */
  A.standNear = (n) => {
    const Q = world(),
      ry = n.m.rotation.y,
      others = [...Q.people, ...Q.extras].filter((o) => o !== n);
    for (const r of [1.3, 1.6, 1.0, 2.0])
      for (let k = 0; k < 12; k++) {
        const a = ry + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * (Math.PI / 6),
          x = n.x + Math.sin(a) * r,
          z = n.z + Math.cos(a) * r;
        if (!A.blocked(Q, x, z, 0.4) && !others.some((o) => Math.hypot(o.x - x, o.z - z) < 0.7)) {
          S.x = x;
          S.z = z;
          return;
        }
      }
  };
  /* the scripted playthrough: cards and dialogue clicked through, each need done where it is, Iris walked to the gate. Used by ?auto and the shared runner. */
  A.autoplay = async ({ first = 1, last = 85, log = [] } = {}) => {
    A.begin();
    A.chapterState(CHAPTERS[first - 1].first);
    await go(CHAPTERS[first - 1].first);
    closeAll();
    let lastStage = -1,
      same = 0;
    for (let guard = 0; guard < 400 && S.stage <= last; guard++) {
      const st = S.stage,
        row = STEPS[st];
      if (st !== lastStage) {
        log.push("STEP " + st + " " + story.goal());
        lastStage = st;
        same = 0;
      } else if (++same > 40) return { ok: false, why: "stalled at step " + st, stalls: ["step " + st] };
      if (st === 85 || (q.has("one") && st > last)) {
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
        await wait(60);
        continue;
      }
      const n = needList(row).find((n) => story.needs(n.id));
      if (!n) {
        await wait(60);
        continue;
      }
      const p = A.where(n.id, n.kind);
      if (!p) return { ok: false, why: "no location at step " + st };
      S.x = p[0];
      S.z = p[1];
      if (n.kind === "talk") {
        const who = world().people.find((x) => x.id === n.id);
        A.standNear(who);
        A.talk(who);
        for (let i = 0; i < 30 && !$("dialogue").hidden; i++) {
          await wait(40);
          $("next").click();
        }
      } else if (n.kind === "do") A.action(n.id);
      else {
        if (st === 75) {
          const Q = world();
          for (const point of Q.leadPath) {
            S.x = point[0];
            S.z = point[1] + 0.8;
            for (let i = 0; i < 90; i++) A.tick(1 / 30);
            await wait(5);
          }
          S.x = 2.5;
          S.z = 6.6;
          for (let i = 0; i < 120 && story.needs(n.id); i++) A.tick(1 / 30);
        }
        if (story.needs(n.id)) story.done(n.id);
      }
      log.push(...A.carry.issues());
      await wait(60);
    }
    return { ok: S.stage === 85 || S.stage > last, why: "ended at step " + S.stage };
  };
  A.checkAdapter.autoplay = async () => {
    const r = await A.autoplay({});
    closeAll();
    return r;
  };
  if (q.get("test") === "all") {
    // this game's own check, run after the shared ones: everyone in view alive, in step only by chance, heads within a person's reach, feet on the ground
    if (!CHECKS.some((c) => c.id === "anim"))
      CHECKS.push({
        id: "anim",
        needs: [],
        run: async () => {
          closeAll();
          const r = await animCheck(A, { seconds: 16 });
          return { lines: r.lines, note: r.stats.join("; ") };
        },
      });
    await checkAll(A.checkAdapter, CHECK_TABLES);
    return;
  }
  if (q.has("shot")) {
    /* ?shot=<view>: a repeatable picture of a place. &t=<seconds> runs the place's life that long first (stepped, nothing drawn).
       ?shot=film&key=departure&at=15 poses a camera scene at that moment. ?shot=title shows the title screen as a visitor sees it. */
    const id = q.get("shot");
    if (id === "title") {
      window.__SHOT = true;
      return;
    }
    A.begin();
    const st =
        {
          yard: 10,
          yard2: 20,
          quay: 24,
          poster: 24,
          thumbnail: 24,
          ship: 24,
          deck: 30,
          deck2: 30,
          tilbury: 40,
          tilbury2: 40,
          london: 50,
          room: 55,
          work: 60,
          jamaica: 64,
          elder: 72,
          home: 75,
          advice: 80,
          people: 10,
          film: q.get("key") === "arrival" ? 35 : 25,
        }[id] || 10;
    await go(st);
    closeAll();
    const views = {
      yard: { pos: [7, 2.2, 14.5], look: [-2, 1, 0] },
      yard2: { pos: [-1, 1.3, 10], look: [4, 1.0, 2] },
      quay: { pos: [-12, 1.6, 18], look: [6, 3, -6] },
      thumbnail: { pos: [-112, 14, -92], look: [14, 6, -16] },
      poster: { pos: [-62, 9, 45], look: [-5, 9, -25] },
      ship: { pos: [-35, 5, 24], look: [0, 9, -16] },
      deck: { pos: [0, 1.4, 18.6], look: [0, 1.2, 0] },
      deck2: { pos: [-5.4, 1.4, -4], look: [5, 0.8, 8] },
      tilbury: { pos: [9, 1.55, 14], look: [-4, 2, 6] },
      tilbury2: { pos: [-14, 3, 26], look: [6, 4, -8] },
      london: { pos: [15.5, 1.55, 3.5], look: [0, 1.6, -2] },
      room: { pos: [-12.9, 1.28, -6.6], look: [-15, 1.0, -9.5] },
      work: { pos: [12, 1.55, 3], look: [-4, 1.6, -4] },
      jamaica: { pos: [4, 1.3, 12], look: [1, 1, 0] },
      elder: { pos: [-1.6, 1.28, -0.4], look: [-4.6, 0.9, -1.6] },
      home: { pos: [2.5, 1.28, 9], look: [2.5, 1.4, 0] },
      advice: { pos: [0, 1.28, 6], look: [1.5, 0.9, -2] },
    };
    S.view = views[id] || views.yard;
    if (q.has("t")) {
      const draw = A.renderer.render;
      A.renderer.render = () => {};
      for (let i = 0, n = Number(q.get("t")) * 30; i < n; i++) A.tick(1 / 30, performance.now() + i * 33);
      A.renderer.render = draw;
    }
    if (id === "thumbnail") {
      A.camera.fov = 30;
      A.camera.updateProjectionMatrix();
    }
    if (id === "film") {
      S.view = null;
      A.DIR.start(q.get("key") || "departure");
      A.DIR.paused = true;
      A.DIR.time = Number(q.get("at") || 0);
      for (let t = 0; t <= A.DIR.time; t += 0.25) A.DIR.apply(t);
      $("cineControls").hidden = !q.has("ui");
      if (!q.has("ui")) document.body.classList.remove("cine");
    }
    if (id === "people") {
      world().group.visible = false;
      const list = q.has("b") ? q.get("b").split(",") : BASES;
      for (let i = 0; i < list.length; i++) {
        const base = list[i];
        await A.loadBase(base);
        const spec = Object.values(CAST).find((x) => x.base === base) || CROWD[base] || {},
          { m } = A.body({
            ...spec,
            base,
            x: ((i % 6) - 2.5) * 1.3,
            z: -Math.floor(i / 6) * 2.2,
          });
        A.scene.add(m);
      }
      S.view = { pos: [0, 2.2, 6.5], look: [0, 1, -2] };
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
      if (!n.m.userData.seatAnchor && A.blocked(Q, n.x, n.z, 0.23)) bad.push(n.id + " inside a solid");
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
      const pp = (n) => ({ id: n.id, x: n.x, z: n.z, m: n.m, anim: n.m.userData.seatAnchor ? "SitIdle" : "Idle", h: 1.75 * (n.scale || 1), r: (n.scale || 1) < 0.9 ? 0.2 : 0.25, path: n.amb?.spec?.pts || (n.amb?.spec?.from ? [n.amb.spec.from, n.amb.spec.to] : null) });
      const r = auditPlace({
        id: Q.id,
        snap: Q.snap,
        npcs: [...Q.people, ...Q.extras].map(pp),
        walls: Q.walls,
        bounds: Q.bounds,
        start: Q.start,
        actions: [
          ...Object.values(Q.points).map((p) => ({ ...p, r: 2.3 })),
          ...Object.entries(TASKS).filter(([, t]) => t.place === Q.id).flatMap(([id, t]) => [{ label: id + " pick", x: t.from[0], z: t.from[1], r: 1 }, { label: id + " place", x: t.to[0], z: t.to[1], r: 1 }]),
        ],
        people: Q.people.map(pp),
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
  if (test === "anim") {
    const r = await animCheck(A, { seconds: Number(q.get("s") || 20), only: q.has("p") ? q.get("p").split(",") : null, films: !q.has("nofilms") });
    results.push("ANIM " + r.lines.length, ...r.lines, ...r.stats);
  }
  if (q.has("auto")) {
    const first = Math.max(1, Number(q.get("auto")) || 1),
      last = q.has("one") ? CHAPTERS[first - 1].last : 85;
    const r = await A.autoplay({ first, last, log: results });
    results.push("AUTO END " + S.stage);
    if (!r.ok) results.push("FAIL " + r.why);
  }
  emit(results);
}
