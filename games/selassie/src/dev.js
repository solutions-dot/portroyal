/* Development-only checks use the real scene and gameplay handlers. */
import { checkAll, CHECKS } from "../../../engine/checks.js";
import { headCheck } from "./headcheck.js";
import { actionCheck } from "./actioncheck.js";
import { checkFlow, needList } from "../../../engine/story.js";
import { routeIssues, walkRoute } from "../../../engine/placement.js";
import { ambientCheck } from "../../../engine/ambient.js";
import { exteriorTrim, outsideTrimRelation } from "./trim-audit.js";
import { makeAdapter, CHECK_TABLES } from "./checktables.js";
import { CHAPTERS, TALK, FLAVOUR } from "./content.js";
import { STEPS, PLACE_STAGES } from "./steps.js";
import { BUILDERS } from "./places.js";
import {
  auditPlace,
  auditHeld,
  auditWalk,
  auditCloth,
  auditGarments,
} from "../../../engine/audit.js";
import { skinProbe } from "../../../engine/skinprobe.js";
import { gripTick } from "../../../engine/grip.js";
import { CL } from "../../../engine/anim.js";
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
  window.__CL = CL;
  A.checkAdapter = makeAdapter(A);
  A.checkTables = CHECK_TABLES;
  window.__adapter = A.checkAdapter;
  window.__tables = CHECK_TABLES;
  if (q.get("test") === "all") {
    // this game's own check, run after the shared ones: heads and necks, the cinematic's camera and the walk down the steps
    if (!CHECKS.some((c) => c.id === "heads"))
      CHECKS.push({
        id: "heads",
        needs: [],
        run: async () => {
          closeAll();
          const r = await headCheck(A, { seconds: 10 });
          return { lines: r.lines, note: r.stats.join("; ") };
        },
      });
    // and no standing zombies: varied actions, nobody in step with their neighbours, nobody frozen in the plain Idle
    if (!CHECKS.some((c) => c.id === "actions"))
      CHECKS.push({
        id: "actions",
        needs: [],
        run: async () => {
          closeAll();
          const r = await actionCheck(A, { seconds: 8 });
          return { lines: r.lines, note: r.stats.join("; ") };
        },
      });
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
      q.has("st")
        ? Number(q.get("st"))
        : ["poster", "emperor", "terminal", "face", "salute", "plane"].includes(shot)
          ? 55
          : shot === "memory"
            ? 15
            : 20,
    );
    closeAll();
    if (shot === "at") {
      // a place as the player sees it: ?shot=at&st=20&x=0&z=10&yaw=0&pitch=0 (&hud keeps the interface; &t= seconds of life first)
      const n = (k, d) => (q.has(k) ? Number(q.get(k)) : d);
      Object.assign(S, { x: n("x", S.x), z: n("z", S.z), yaw: n("yaw", S.yaw), pitch: n("pitch", 0) });
      if (q.has("eye")) S.view = { pos: [S.x, n("eye", 1.28), S.z], look: [S.x - Math.sin(S.yaw) * 10, n("eye", 1.28) - 10 * Math.tan(-S.pitch), S.z - Math.cos(S.yaw) * 10] };
      const Q = world(),
        T = n("t", 3);
      for (let i = 0; i < T * 30; i++)
        for (const L of [Q.life, Q.familyLife]) L.tick(1 / 30, { px: S.x, pz: S.z, story: [], view: { x: S.x, z: S.z, yaw: S.yaw } });
      if (!q.has("hud")) $("hud").hidden = true;
      window.__SHOT = true;
      return;
    }
    if (shot === "locs") {
      // locs and tams close up: the five recipes facing us, then from behind (&back) or the side (&side), standing or mid-stride (&walk)
      world().group.visible = false;
      const L = ["sel_rastaman66", "sel_rastaelder66", "sel_rastatam66", "sel_planno66", "sel_levi66"].map((b) => b + (q.get("tier") || ""));
      for (let i = 0; i < L.length; i++) {
        await A.loadBase(L[i]);
        const { m, ctl } = A.body({ base: L[i], x: (i - 2) * 0.75, z: 0, sex: "m", ry: q.has("back") ? Math.PI : q.has("side") ? Math.PI / 2 : 0 });
        if (q.has("walk")) {
          ctl.play("Walk");
          ctl.mx.update(0.6);
        }
        A.scene.add(m);
      }
      S.view = { pos: [0, 1.62, 2.5], look: [0, 1.45, 0] };
    } else if (shot === "people") {
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
    } else if (shot === "likeness") {
      // Haile Selassie's head alone under even light, to set beside a photograph at the same angle and scale:
      // &ang=0 front, 35 three-quarter, 90 profile (degrees, turned to his left); &cap=0 hides the cap; &tier=_focus or "" (full)
      for (const o of A.scene.children) if (o !== A.camera && !o.isLight) o.visible = false;
      A.scene.background = A.bg || (A.bg = new (A.scene.fog?.color.constructor)(0x9a9890));
      A.scene.fog = null;
      const base = "sel_emperor66" + (q.get("tier") ?? "_focus");
      await A.loadBase(base);
      const { m, ctl } = A.body({ base, x: 0, z: 0, sex: "m", ry: 0, hat: q.get("cap") !== "0" });
      ctl.mx.update(0);
      if (q.get("cap") === "0") m.traverse((o) => o.isMesh && /Cap|Hat|Brim|Peak|Insignia|Regalia/.test(o.material.name) && (o.visible = false));
      A.scene.add(m);
      m.updateMatrixWorld(true);
      const head = m.getObjectByName("mixamorigHead").getWorldPosition(m.position.clone());
      const a = (Number(q.get("ang") || 0) * Math.PI) / 180,
        d = Number(q.get("dist") || 2.6),
        cy = head.y + Number(q.get("dy") || 0.06);
      A.camera.fov = Number(q.get("fov") || 9);
      A.camera.updateProjectionMatrix();
      A.camera.fov0 = A.camera.fov;
      S.view = { pos: [head.x + Math.sin(a) * d, cy, head.z + Math.cos(a) * d], look: [head.x, cy, head.z] };
      for (const o of A.scene.children) if (o.isDirectionalLight) o.position.set(Math.sin(a) * 20 + 6, 22, Math.cos(a) * 20);
      A.likeness = { m, ctl, head };
    } else if (shot === "terminal")
      S.view = { pos: [25, 6, 12], look: [-4, 4, 34] };
    else if (shot === "adina")
      S.view = { pos: [-3, 1.45, 2.6], look: [-3, 1.35, 0] };
    if (["emperor", "poster", "face", "salute", "plane"].includes(shot)) {
      // the arrival as the cinematic shows it at the salute: aircraft at the stand, steps at the door, the welcome around them
      A.DIR.start();
      A.DIR.fast = false;
      for (let t = 0; t <= 64; t += 0.25) A.DIR.pose(t, 0.25);
      A.DIR.on = false; // keep the scene as posed; the test view's camera takes over
      $("cineControls").hidden = true;
      document.body.classList.remove("cine");
      $("sub").textContent = "";
      const n = world().people.find((n) => n.id === "emperor");
      n.m.visible = true;
      n.ctl.play("SaluteHS", true);
      n.ctl.mx.update(0.4);
      n.ctl.cur.time = n.ctl.cur.getClip().duration * Number(q.get("at") || 0.42);
      n.ctl.cur.paused = true;
      n.ctl.timer = 0;
      n.ctl.mx.update(0);
      n.m.updateMatrixWorld(true);
      const head = n.m.getObjectByName("mixamorigHead").getWorldPosition(n.m.position.clone());
      // framed on his real head, so a change of body height cannot leave the face out of the picture
      if (shot === "face")
        S.view = { pos: [head.x + 0.18, head.y + 0.03, head.z + 0.78], look: [head.x, head.y + 0.05, head.z] };
      else if (shot === "salute")
        S.view = { pos: [head.x + 0.9, head.y - 0.35, head.z + 2.3], look: [head.x, head.y - 0.45, head.z] };
      else if (shot === "emperor")
        S.view = { pos: [head.x + 2.2, head.y - 0.9, head.z + 4.4], look: [head.x - 0.4, head.y - 0.7, head.z] };
      else if (shot === "plane") {
        // the DC-6 at the stand, from its own frame: &view=side (port, from the crowd), rear (behind the tail), tail (close on the
        // fin and tailplane, port side), rear3q (rear three-quarter from the port side, high), top (the tailplane from above)
        const p = world().props.plane,
          L = (x, y, z) => p.localToWorld(head.clone().set(x, y, z)).toArray();
        const V = {
          side: [[-1, 4.2, -44], [-1, 4.4, 0]],
          rear: [[-46, 5.2, 0], [-10, 4.8, 0]],
          tail: [[-13.4, 6.2, -15], [-13.8, 6.0, 0]],
          rear3q: [[-36, 11, -20], [-11, 4.5, 0]],
          top: [[-22, 22, -8], [-13, 4, 0]],
        }[q.get("view") || "side"];
        S.view = { pos: L(...V[0]), look: L(...V[1]) };
      } else S.view = { pos: [9.9, 2.45, -19.4], look: [1.9, 3.75, -29.4] };
    }
    // &cam=x,y,z,lx,ly,lz moves the camera of any view above (a closer look at one face in the line-up)
    if (q.has("cam")) {
      const c = q.get("cam").split(",").map(Number);
      S.view = { pos: c.slice(0, 3), look: c.slice(3, 6) };
    }
    $("hud").hidden = true;
    window.__SHOT = true;
    return;
  }
  if (!q.has("test") && !q.has("auto")) return;
  A.begin();
  for (const id of Object.keys(BUILDERS)) await ensure(id);
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
    for (const stage of Object.values({ ...PLACE_STAGES, airport: 55 })) {
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
  if (q.get("test") === "actions" || q.get("test") === "audit") {
    closeAll();
    const r = await actionCheck(A, { seconds: q.get("test") === "actions" ? 14 : 8 });
    results.push(`ACTIONS ${r.lines.length}`, ...r.lines, ...r.stats);
    await go(10);
    closeAll();
  }
  if (q.get("test") === "heads" || q.get("test") === "audit") {
    closeAll();
    const r = await headCheck(A, { seconds: q.get("test") === "heads" ? 16 : 8 });
    results.push(`HEADS ${r.lines.length}`, ...r.lines, ...r.stats);
    await go(10);
    closeAll();
  }
  if (q.get("test") === "audit") {
    const { vehicleTrimCheck } = await import("./kingston-vehicles.js");
    const v = vehicleTrimCheck();
    results.push(`VEHICLES ${v.length}`, ...v);
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
        // every body in the poses it can be seen in; the ceremonial police only stand and walk (no reactions: airport-detail.js)
        const poses = base === "sel_police66" ? [["Idle", 0.3], ["Walk", 0.5]] : [
          ["Idle", 0.3],
          ["Walk", 0.5],
          ["Talk1", 0.4],
          ["Wave", 0.5],
          // what Haile Selassie does in the cinematic: the owner's salute and the walk down the steps
          ...(base === "sel_emperor66"
            ? [
                ["SaluteHS", 0.3],
                ["SaluteHS", 0.5],
                ["SaluteHS", 0.75],
                ["StairsDown", 0.25],
                ["StairsDown", 0.5],
                ["StairsDown", 0.75],
              ]
            : []),
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
    /* an open panel must be on top of everything: every button, link, heading and footer line in it, and a grid of points over the
       whole panel, must be the panel itself when touched there (the owner saw the empty narration bar lying across the journal footer) */
    const covered = (label, panelId) => {
      const panel = $(panelId),
        book = panel.querySelector(".book, .cardin") || panel,
        targets = [...book.querySelectorAll("button,a,h2,footer span,footer")].filter(visible);
      const r = book.getBoundingClientRect(),
        pts = targets.map((e) => {
          const q = e.getBoundingClientRect();
          return [q.left + q.width / 2, q.top + q.height / 2, e.id || e.tagName.toLowerCase() + ":" + e.textContent.trim().slice(0, 18)];
        });
      for (let i = 1; i < 6; i++) for (let j = 1; j < 6; j++) pts.push([r.left + (r.width * i) / 6, r.top + (r.height * j) / 6, "panel point"]);
      for (const [x, y, what] of pts) {
        if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
        const t = document.elementFromPoint(x, y);
        if (t && !panel.contains(t))
          bad.push(`${label}: ${what} is covered by ${t.id || t.className || t.tagName}`);
      }
    };
    const st = document.createElement("style");
    st.textContent = "*{transition:none!important;animation:none!important}";
    document.head.appendChild(st);
    closeAll();
    scan("play");
    A.talk(world().people.find((n) => n.id === "adina"));
    scan("dialogue");
    closeAll();
    $("jbtn").click();
    scan("journal");
    covered("journal", "journal");
    closeAll();
    // after the arrival cinematic the narration bar used to stay drawn, empty, above the journal
    A.DIR.start();
    A.DIR.stop();
    $("hud").hidden = false;
    $("jbtn").click();
    covered("journal after the cinematic", "journal");
    closeAll();
    $("sub").classList.remove("dim");
    $("sub").textContent = "A line of narration.";
    $("jbtn").click();
    covered("journal over narration", "journal");
    closeAll();
    $("sub").textContent = "";
    $("tchap").click();
    scan("chapters");
    covered("chapters", "chapters");
    $("chcred").click();
    scan("credits");
    covered("credits", "credits");
    closeAll();
    st.remove();
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
