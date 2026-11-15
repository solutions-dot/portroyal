/* Development-only checks use the real scene and gameplay handlers. */
import { checkAll } from "../../../engine/checks.js";
import { checkFlow, needList } from "../../../engine/story.js";
import { routeIssues, walkRoute } from "../../../engine/placement.js";
import { ambientCheck } from "../../../engine/ambient.js";
import { exteriorTrim, outsideTrimRelation } from "./trim-audit.js";
import { makeAdapter, CHECK_TABLES } from "./checktables.js";
import { CHAPTERS, TALK, FLAVOUR } from "./content.js";
import { STEPS } from "./steps.js";
import {
  auditPlace,
  auditHeld,
  auditWalk,
  auditCloth,
  auditGarments,
} from "../../../engine/audit.js";
import { skinProbe } from "../../../engine/skinprobe.js";
import { gripTick } from "../../../engine/grip.js";
import { BASES } from "./cast.js";
import {
  lead,
  tick as followTick,
  stop as stopFollow,
  watch,
  drive,
} from "../../../engine/follow.js";
import { closeAll, $ } from "./ui.js";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
export async function dev(A) {
  const { q, S, ensure, world, worlds, go, story, where, blocked } = A;
  window.__SEL = A;
  A.checkAdapter = makeAdapter(A);
  A.checkTables = CHECK_TABLES;
  window.__adapter = A.checkAdapter;
  window.__tables = CHECK_TABLES;
  if (q.get("test") === "all") {
    await checkAll(A.checkAdapter, CHECK_TABLES);
    return;
  }
  const emit = (lines) => {
    $("autolog").hidden = false;
    $("autolog").textContent = lines.join("\n");
    window.__RESULT = lines;
  };
  if (q.has("shot")) {
    A.begin();
    const shot = q.get("shot");
    await go(
      ["poster", "emperor", "terminal", "face"].includes(shot)
        ? 55
        : shot === "memory"
          ? 15
          : 20,
    );
    closeAll();
    if (shot === "people") {
      world().group.visible = false;
      for (let i = 0; i < BASES.length; i++) {
        const base = BASES[i];
        await A.loadBase(base);
        const { m } = A.body({
          base,
          x: (i - 4.5) * 1.55,
          z: 0,
          sex: base.includes("woman") ? "f" : "m",
          scale: /girl|boy/.test(base)
            ? 0.8
            : base === "sel_emperor66"
              ? 0.9
              : 1,
        });
        A.scene.add(m);
      }
      S.view = { pos: [0, 2, 11.8], look: [0, 0.9, 0] };
    } else if (shot === "face")
      S.view = { pos: [4.5, 4.06, -28.02], look: [4.3, 4.02, -28.8] };
    else if (shot === "emperor")
      S.view = { pos: [5.1, 4.1, -26.3], look: [4.3, 4.04, -28.8] };
    else if (shot === "terminal")
      S.view = { pos: [25, 6, 12], look: [-4, 4, 34] };
    else if (shot === "poster")
      S.view = { pos: [0.5, 2.6, -16.7], look: [0.5, 3.55, -28.8] };
    else if (shot === "adina")
      S.view = { pos: [-3, 1.45, 2.6], look: [-3, 1.35, 0] };
    if (shot === "emperor" || shot === "poster") {
      const n = world().people.find((n) => n.id === "emperor");
      n.ctl.play("Salute", true);
      n.ctl.mx.update(0.4);
      n.ctl.cur.time = n.ctl.cur.getClip().duration * 0.5;
      n.ctl.cur.paused = true;
      n.ctl.timer = 0;
      n.ctl.mx.update(0);
    }
    $("hud").hidden = true;
    window.__SHOT = true;
    return;
  }
  if (!q.has("test") && !q.has("auto")) return;
  A.begin();
  for (const id of ["yard", "memory", "road", "airport"]) await ensure(id);
  await go(10);
  closeAll();
  const results = [];
  // A separate dry story has a location resolver for every stage, including moving needs.
  const { createStory } = await import("../../../engine/story.js");
  let stage = 10;
  const dry = createStory({
    ...story.options,
    where: (id, kind) => {
      const Q = worlds[STEPS[stage].place];
      const n = Q.people.find((n) => n.id === id);
      if (kind === "talk" && n) return [n.x, n.z];
      const p = Q.points[id];
      return p ? [p.x, p.z] : null;
    },
    route: (t) => t,
  });
  for (const id of Object.keys(STEPS).flatMap((k) =>
    (STEPS[k].needs?.do || []).map((x) => (typeof x === "string" ? x : x.id)),
  ))
    dry.shows(id, () => {});
  const f = checkFlow(dry, {
    place: (s) => (stage = s),
    start: (s) => [
      worlds[STEPS[s].place].start.x,
      worlds[STEPS[s].place].start.z,
    ],
  });
  results.push(f.text);
  for (const [st, who] of Object.entries(TALK))
    for (const [id, L] of Object.entries(who))
      for (const l of L) {
        if (l.text.split(/\s+/).length > 12)
          results.push(`DIALOGUE ${st}/${id}: ${l.text}`);
      }
  for (const Q of Object.values(worlds)) {
    const bad = Q.people
      .filter((n) => !n.historical && blocked(Q, n.x, n.z, 0.22))
      .map((n) => n.id + " inside a solid");
    for (const [id, p] of Object.entries(Q.points)) {
      if (blocked(Q, p.x, p.z, 0.2)) bad.push(id + " action inside a solid");
      const path = walkRoute(
        [Q.start.x, Q.start.z],
        [p.x, p.z],
        Q.walls,
        0.23,
        Q.bounds,
      );
      if (!path.length) bad.push(id + " unreachable");
    }
    for (const r of Q.routes)
      bad.push(...routeIssues(r.id, r.pts, Q.walls, r.r || 0.23, false));
    results.push(`LAYOUT ${Q.id} ${bad.length}`, ...bad);
    const issues = [
      ...Q.life.issues(),
      ...(Q.roofLife?.issues() || []),
      ...(Q.arrivalLife?.issues() || []),
    ];
    results.push(`AMBIENT SETUP ${Q.id} ${issues.length}`, ...issues);
  }
  if (q.get("test") === "ambient") {
    for (const Q of Object.values(worlds)) {
      const r = ambientCheck(Q.life, {
        seconds: 60,
        dt: 1 / 30,
        start: [Q.start.x, Q.start.z],
        story: () => Q.people,
        blocked: (x, z, r) => blocked(Q, x, z, r),
      });
      results.push(`AMBIENT ${Q.id} ${r.lines.length}`, ...r.lines, ...r.stats);
    }
  }
  if (q.get("test") === "budget") {
    for (const stage of [20, 15, 30, 55]) {
      await go(stage);
      closeAll();
      const Q = world();
      S.view =
        Q.id === "airport"
          ? { pos: [0, 3, 25], look: [0, 2, -25] }
          : { pos: [Q.start.x, 2, Q.start.z], look: [0, 1, -5] };
      A.camera.position.set(...S.view.pos);
      A.camera.lookAt(...S.view.look);
      A.renderer.render(A.scene, A.camera);
      results.push(
        "BUDGET " + Q.id + " " + JSON.stringify(A.renderer.info.render),
      );
    }
  }
  if (q.get("test") === "audit")
    for (const Q of Object.values(worlds)) {
      const npcs = [...Q.people, ...Q.extras].map((n) => ({
        id: n.id,
        x: n.x,
        z: n.z,
        ground: n.ground || 0,
      }));
      const r = auditPlace({
        id: Q.id,
        snap: Q.snap,
        npcs,
        walls: Q.walls,
        bounds: Q.bounds,
        start: Q.start,
        actions: Object.values(Q.points).map((p) => ({ ...p, r: 2.2 })),
        people: Q.people.filter((n) => !n.historical),
        routes: Q.routes,
      });
      const errors = [...r.floating, ...r.inside, ...r.stuck];
      results.push(`AUDIT ${Q.id} ${errors.length}`, ...errors);
    }
  if (["held", "cloth", "walkers", "skin"].includes(q.get("test"))) {
    const test = q.get("test"),
      ids = q.has("b") ? q.get("b").split(",") : BASES;
    for (const base of ids) {
      await A.loadBase(base);
      const { m, ctl } = A.body({
        base,
        x: 0,
        z: 0,
        sex: /woman|mum|adina|girl/.test(base) ? "f" : "m",
        scale: /girl|boy/.test(base) ? 0.8 : 1,
      });
      A.scene.add(m);
      ctl.mx.update(0.3);
      m.updateMatrixWorld(true);
      if (test === "cloth") {
        const poses = [
          ["Idle", 0.3],
          ["Walk", 0.5],
          ["Talk1", 0.4],
          ["Wave", 0.5],
          ...(base === "sel_emperor66" ? [["Salute", 0.5]] : []),
        ];
        const trim = base === "sel_emperor66" ? exteriorTrim(m, poses) : null;
        if (trim)
          results.push(
            "EXTERIOR TRIM " +
              trim.lines.length +
              " (" +
              trim.checked +
              " samples)",
            ...trim.lines,
          );
        const r = auditCloth(base, m, {
          poses,
          after: gripTick,
          where: true,
          skip:
            trim && trim.checked > 0 && !trim.lines.length
              ? outsideTrimRelation
              : null,
        });
        results.push(`CLOTH ${base} ${r.lines.length}`, ...r.lines);
      }
      if (test === "walkers") {
        ctl.play("Walk");
        ctl.mx.update(0.8);
        const r = auditWalk(base, m, 1.05, { loops: 1, after: gripTick });
        results.push(`WALK ${base}`, JSON.stringify(r));
      }
      if (test === "skin") {
        const r = skinProbe(A.renderer, A.scene, m);
        results.push(`SKIN ${base}`, JSON.stringify(r));
      }
      if (test === "held") {
        results.push(
          ...auditHeld(base, m, m.userData.held || []),
          ...auditGarments(base, m),
        );
      }
      A.scene.remove(m);
      await wait(0);
    }
    results.push("CARRY " + A.carry.issues().length, ...A.carry.issues());
  }
  if (q.get("test") === "follow") {
    await go(30);
    closeAll();
    const Q = world(),
      mum = Q.people.find((n) => n.id === "mum");
    const monitor = watch();
    const r = drive({
      from: [0, 23],
      route: Q.leadPath,
      speed: 2,
      stops: [1, 2],
      w: monitor,
      move: (x, z) => {
        S.x = x;
        S.z = z;
        return [x, z];
      },
      people: [mum],
      step: (dt) => {
        followTick(mum, dt, {
          px: S.x,
          pz: S.z,
          walls: Q.walls,
          bounds: Q.bounds,
          blocked: (x, z, r) => blocked(Q, x, z, r),
          others: Q.people,
        });
      },
      blocked: (x, z, r) => blocked(Q, x, z, r),
    });
    results.push(
      "FOLLOW " + monitor.lines(mum, "Mum").length,
      ...monitor.lines(mum, "Mum"),
      monitor.stats(mum),
    );
    stopFollow(mum);
  }
  if (q.get("test") === "layout") {
    const bad = [],
      visible = (e) => {
        const r = e.getBoundingClientRect();
        return (
          !e.hidden &&
          r.width &&
          r.height &&
          getComputedStyle(e).visibility !== "hidden"
        );
      };
    const scan = (label) => {
      const els = [
        ...document.querySelectorAll("button,a,h1,h2,#line,#goal,#hint"),
      ].filter(visible);
      for (const e of els) {
        const r = e.getBoundingClientRect();
        let scroll = e.parentElement,
          clipped = false;
        while (scroll && scroll !== document.body) {
          if (
            ["auto", "scroll"].includes(getComputedStyle(scroll).overflowY) &&
            scroll.scrollHeight > scroll.clientHeight
          ) {
            clipped = true;
            break;
          }
          scroll = scroll.parentElement;
        }
        if (clipped) continue;
        if (
          r.left < -0.5 ||
          r.right > innerWidth + 0.5 ||
          r.top < -0.5 ||
          r.bottom > innerHeight + 0.5
        )
          bad.push(
            label + ": offscreen " + (e.id || e.textContent.slice(0, 24)),
          );
      }
    };
    closeAll();
    scan("play");
    A.talk(world().people.find((n) => n.id === "adina"));
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
    const first = Number(q.get("auto")) || 1,
      last = q.has("one") ? CHAPTERS[first - 1].last : 64;
    S.hand = null;
    A.carry.drop();
    S.share = 0;
    S.packed = [];
    await go(CHAPTERS[first - 1].first);
    closeAll();
    for (let guard = 0; guard < 240 && S.stage <= last; guard++) {
      const st = S.stage,
        step = STEPS[st];
      results.push("STEP " + st + " " + story.goal());
      if (st === 64) {
        closeAll();
        break;
      }
      if (step.wait || !$("card").hidden) {
        if (A.DIR.on) {
          for (let i = 0; i < 120 && A.DIR.on; i++) A.DIR.tick(0.2);
          await wait(20);
          continue;
        }
        const buttons = [...$("cbtns").querySelectorAll("button")];
        if (buttons.length) {
          buttons[0].click();
          await wait(40);
          continue;
        }
        results.push("FAIL wait without a card " + st);
        break;
      }
      const n = needList(step).find((n) => story.needs(n.id));
      if (!n) {
        results.push("FAIL no unfinished need " + st);
        break;
      }
      const p = where(n.id, n.kind);
      if (!p) {
        results.push("FAIL no target " + st + "/" + n.id);
        break;
      }
      const path = walkRoute(
        [S.x, S.z],
        p,
        world().walls,
        0.23,
        world().bounds,
      );
      if (!path.length) results.push("FAIL no route " + st + "/" + n.id);
      S.x = p[0];
      S.z = p[1];
      if (n.kind === "talk") {
        A.talk(world().people.find((x) => x.id === n.id));
        for (let i = 0; i < 20 && !$("dialogue").hidden; i++) $("next").click();
      } else if (n.kind === "do") A.action(n.id);
      else story.done(n.id);
      results.push(...A.carry.issues());
      for (const npc of world().people)
        if (npc.m.userData.held?.length) {
          gripTick(npc.m);
          results.push(...auditHeld(npc.id, npc.m, npc.m.userData.held));
        }
      await wait(35);
    }
    results.push("AUTO END " + S.stage);
    if (S.stage !== 64 && !q.has("one")) results.push("FAIL incomplete story");
  }
  emit(results);
}
