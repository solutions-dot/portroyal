/* Development checks are stripped from public builds. */
import { auditReveals } from "../../../engine/audit-reveal.js";
import { auditProps } from "../../../engine/audit-props.js";
import { auditPassage, passageSpots } from "../../../engine/audit-passage.js";
import { createStory, checkFlow, needList } from "../../../engine/story.js";
import { checkAll, reachIssues, CHECKS } from "../../../engine/checks.js";
import ANIM_CLIPS from "../anim-clips.json";
import {
  auditPlace,
  auditCloth,
  auditWalk,
  auditHeld,
} from "../../../engine/audit.js";
import { ambientCheck } from "../../../engine/ambient.js";
import { faceCheck } from "../../../engine/faces.js";
import { gripTick } from "../../../engine/grip.js";
import { skinProbe } from "../../../engine/skinprobe.js";
import { walkRoute, routeIssues } from "../../../engine/placement.js";
import { CAST, BASES, CROWD } from "./cast.js";
import { STEPS, TASKS, LOOKS } from "./steps.js";
import { CHAPTERS, TALK } from "./content.js";
import { PLACE_IDS } from "./places.js";
import { makeAdapter, CHECK_TABLES } from "./checktables.js";
import { $, closeAll } from "./ui.js";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const FIRST = CHAPTERS[0].first,
  LAST = Math.max(...Object.keys(STEPS).map(Number));
export async function dev(A) {
  const { q, S, world, worlds, ensure, go, story } = A;
  window.__GAME = A;
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
  /* the scripted playthrough: cards, the quiz and dialogue clicked through, each need done where it is. Used by ?auto and the shared runner. */
  A.autoplay = async ({ first = 1, last = LAST, log = [] } = {}) => {
    A.begin();
    A.chapterState(CHAPTERS[first - 1].first);
    await go(CHAPTERS[first - 1].first);
    if (!STEPS[CHAPTERS[first - 1].first].card) closeAll();   /* a chapter that opens with a camera scene keeps its scene card, which is clicked below */
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
      if (st === LAST || (q.has("one") && st > last)) {
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
      const quiz = document.getElementById("quizpanel");
      if (quiz && !quiz.hidden) {
        (quiz.querySelector("#quizopts button:not(:disabled)") || quiz.querySelector("#quiznext"))?.click();
        await wait(80);
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
        if (story.needs(n.id)) story.done(n.id);
      }
      log.push(...A.carry.issues());
      await wait(60);
    }
    return { ok: S.stage === LAST || S.stage > last, why: "ended at step " + S.stage };
  };
  A.checkAdapter.autoplay = async () => {
    const r = await A.autoplay({});
    closeAll();
    return r;
  };
  if (q.get("test") === "all") {
    await checkAll(A.checkAdapter, CHECK_TABLES);
    return;
  }
  if (q.has("shot")) {
    /* ?shot=<step number>: a repeatable picture of the place at that step, from the place's own view (Q.view) or &c=x,y,z&l=x,y,z.
       &t=<seconds> runs the place's life that long first (stepped, nothing drawn). ?shot=film&key=<film>&at=15 poses a camera scene at
       that moment. ?shot=title shows the title screen as a visitor sees it. ?shot=people stands every body in a row. */
    const id = q.get("shot");
    if (id === "title") {
      window.__SHOT = true;
      return;
    }
    A.begin();
    const filmStep = +Object.keys(STEPS).find((k) => STEPS[k].card === "playing" && STEPS[k].film === q.get("key")),
      lookStep = +Object.keys(STEPS).find((k) => (STEPS[k].needs?.do || []).some((n) => (n.id || n) === q.get("key")));
    if (id === "look") A.chapterState(lookStep);
    else if (STEPS[id]) A.chapterState(+id);   /* what was carried and looked at before that step is shown done */
    await go(id === "film" ? filmStep : id === "look" ? lookStep : STEPS[id] ? +id : FIRST);
    closeAll();
    S.view = world().view || { pos: [world().start.x, 2.2, world().start.z], look: [0, 1.2, 0] };
    if (q.has("look")) A.action(q.get("look"));
    if (q.has("c")) S.view = { pos: q.get("c").split(",").map(Number), look: (q.get("l") || "0,1,0").split(",").map(Number) }; /* &c=x,y,z&l=x,y,z: look from anywhere */
    if (q.has("t")) {
      const draw = A.renderer.render;
      A.renderer.render = () => {};
      for (let i = 0, n = Number(q.get("t")) * 30; i < n; i++) A.tick(1 / 30, performance.now() + i * 33);
      A.renderer.render = draw;
    }
    if (id === "film") {
      S.view = null;
      A.DIR.start(q.get("key"));
      A.DIR.paused = true;
      A.DIR.time = Number(q.get("at") || 0);
      for (let t = 0; t <= A.DIR.time; t += 0.25) A.DIR.apply(t);
      $("cineControls").hidden = !q.has("ui");
      if (!q.has("ui")) { A.DIR.hideSkip(); document.body.classList.remove("cine"); }
    }
    if (id === "look") {
      /* ?shot=look&key=<look>&at=<seconds>: the look moment (engine/lookshot.js) held at that moment, from the player's spot for it */
      const lk = LOOKS[q.get("key")];
      S.view = null;
      Object.assign(S, { x: lk.at[0], z: lk.at[1], yaw: Math.atan2(lk.at[0] - lk.view.look[0], lk.at[1] - lk.view.look[2]), pitch: -0.2 });
      S.lookShot = true;
      A.lookAt(q.get("key"));
      const draw = A.renderer.render;
      A.renderer.render = () => {};
      for (let t = 0, n = Number(q.get("at") || 2) * 30; t < n; t++) A.tick(1 / 30, performance.now() + t * 33);
      A.renderer.render = draw;
      A.LS.paused = true;
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
    $("hud").hidden = !(id === "look" && q.has("ui"));   /* a look with &ui keeps its story line in the bar */
    window.__SHOT = true;
    return;
  }
  if (!q.has("test") && !q.has("auto")) return;
  A.begin();
  for (const id of PLACE_IDS) await ensure(id);
  await go(FIRST);
  closeAll();
  const results = [];
  let stage = FIRST;
  const dry = createStory({
    ...story.options,
    where: (id, kind) => {
      const Q = worlds[STEPS[stage].place],
        n = Q.people.find((n) => n.id === id);
      if (kind === "talk" && n) return [n.x, n.z];
      if (TASKS[id]) return TASKS[id].from;
      if (LOOKS[id]) return LOOKS[id].at;
      const p = Q.points[id];
      return p ? [p.x, p.z] : null;
    },
    route: (t) => t,
  });
  for (const id of [...Object.keys(TASKS), ...Object.keys(LOOKS)]) dry.shows(id, () => {});
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
      .concat(Object.entries(LOOKS).filter(([, l]) => l.place === Q.id).map(([id, l]) => ({ id, x: l.at[0], z: l.at[1], r: 2.3 })))
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
    const issues = [...Q.life.issues(), ...Q.storyLife.issues()];
    results.push("AMBIENT SETUP " + Q.id + " " + issues.length, ...issues);
  }
  const test = q.get("test");
  /* every clip a body plays anywhere in the game: idles, work, reactions, walks, chats, seats, and the talk clips the story uses */
  const SHIPPED = new Set(ANIM_CLIPS);
  function playedClips(base) {
    const out = new Set();
    for (const Q of Object.values(worlds))
      for (const n of [...Q.people, ...Q.extras]) {
        const raw = n.look || CAST[n.cast]?.base;
        if (raw !== base) continue;
        const s = n.amb?.spec || {},
          male = n.sex === "m";
        for (const k of ["clips", "idles", "react", "sadClips"]) for (const c of s[k] || []) out.add(c);
        for (const k of ["walk", "idle", "run", "clip"]) if (s[k]) out.add(s[k]);
        if (n.idle) out.add(n.idle);
        out.add(s.kind === "sit" ? "SitIdle" : male ? "IdleM" : "Idle");
        if (["wander", "errand", "chat", "play"].includes(s.kind) || s.between) out.add("Walk");
        if (s.kind === "chat" || s.group) for (const c of s.kind === "sit" ? ["SitTalk"] : male ? ["TalkM1", "TalkM2", "Talk2", "Nod", "Laugh"] : ["Talk1", "Talk2", "Talk3", "Nod", "Laugh"]) out.add(c);
        if (s.kind === "play") for (const c of s.joy || ["Run", "Cheer", "Clap", "Laugh"]) out.add(c);
        if (Q.people.includes(n)) for (const c of n.life?.seat ? ["SitTalk"] : male ? ["TalkM1", "TalkM2"] : ["Talk1", "Talk3"]) out.add(c);
      }
    return new Set([...out].filter((c) => SHIPPED.has(c) && c !== "WalkM"));
  }
  globalThis.__REVEAL_DEBUG = q.has("rdebug");
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
          ...Object.entries(LOOKS).filter(([, l]) => l.place === Q.id).map(([id, l]) => ({ label: id + " look", x: l.at[0], z: l.at[1], r: 1 })),
        ],
        people: Q.people.map(pp),
        routes: Q.routes,
      });
      // look-alikes: two people with one body and face within 2.5 m, the family and the crowd (engine/faces.js)
      const twins = faceCheck(
        [...Q.people, ...Q.extras].filter((n) => n.m).map((n) => ({ id: n.id, face: n.bodyId || n.base, m: n.m, hidden: true, x: n.x, z: n.z, life: n.amb && n.amb.spec, who: n.who, story: Q.people.includes(n) })),
      );
      const errors = [...r.floating, ...r.inside, ...r.stuck, ...auditReveals(Q, { groundAt: Q.groundAt }), ...auditProps(Q.propList || []), ...auditPassage({ walls: Q.walls, bounds: Q.bounds, start: Q.start, r: 0.23, spots: passageSpots(Q, { LOOKS, TASKS }) })];   /* what a look moves, in both states (engine/audit-reveal.js) */
      results.push("AUDIT " + Q.id + " " + errors.length, ...errors, "FACES " + Q.id + " " + twins.length, ...twins.slice(0, 40));
    }
  if (test === "ambient")
    for (const Q of Object.values(worlds)) {
      const a = ambientCheck(Q.life, {
        seconds: 60,
        dt: 1 / 30,
        snap: Q.snap, // the place before its scenery was merged: a merged mesh of many seats is no seat to measure
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
        /* the clips the game really plays on this body, read from every place's people (their behaviours, their talk clips) */
        const played = playedClips(base),
          poses = [...played].filter((c) => !/^Sit|^Kneel/.test(c) || played.has(c)).map((c) => [c, /Walk|Run/.test(c) ? 0.5 : 0.4]);
        if (!poses.length) poses.push(["Idle", 0.3]);
        const r = auditCloth(base, m, { poses, after: gripTick, where: true, played: [...played] });
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
    for (const id of PLACE_IDS) {
      await go(+Object.keys(STEPS).find((k) => STEPS[k].place === id));
      closeAll();
      S.view = world().view || { pos: [world().start.x, 2.2, world().start.z], look: [0, 1.5, 0] };
      A.tick(0);
      results.push("BUDGET " + world().id + " " + JSON.stringify(A.renderer.info.render));
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
      last = q.has("one") ? CHAPTERS[first - 1].last : LAST;
    const r = await A.autoplay({ first, last, log: results });
    results.push("AUTO END " + S.stage);
    if (!r.ok) results.push("FAIL " + r.why);
  }
  emit(results);
}
