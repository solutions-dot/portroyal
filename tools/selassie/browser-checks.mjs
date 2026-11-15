/* Optional Playwright integration checks; no browser dependency in the game. */
import fs from "node:fs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const base = (
  process.env.GAME_URL || "http://localhost:8879/games/selassie/site/"
).replace(/\/?$/, "/");
const output = "build/selassie-qa";
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN || "/usr/bin/chromium",
  headless: true,
  args: [
    "--no-sandbox",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--disable-dev-shm-usage",
    "--autoplay-policy=no-user-gesture-required",
  ],
});
const reports = [];
const assert = (x, message) => {
  if (!x) throw Error(message);
};
async function context(mobile = false) {
  const c = await browser.newContext({
    viewport: mobile
      ? { width: 390, height: 800 }
      : { width: 1280, height: 720 },
    hasTouch: mobile,
    isMobile: mobile,
    deviceScaleFactor: 0.5,
  });
  if (process.env.FONTS_MODULE)
    await (await import(process.env.FONTS_MODULE)).installFonts(c);
  return c;
}
async function ready(p) {
  await p.waitForFunction(
    () => window.__SEL && !document.getElementById("start").disabled,
    null,
    { timeout: 180000 },
  );
}
async function start(p) {
  await p.locator("#start").click();
  await p.waitForFunction(
    () =>
      window.__SEL.S.started &&
      !document.getElementById("fade").checkVisibility(),
    null,
    { timeout: 180000 },
  );
  if (await p.locator("#card").isVisible())
    await p.locator("#cbtns button").first().click();
}
async function run(name, fn, mobile = false) {
  const c = await context(mobile),
    p = await c.newPage(),
    errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  try {
    await p.goto(base);
    await ready(p);
    await fn(p, c);
    assert(!errors.length, errors.join("; "));
    reports.push({ name, ok: true });
    console.log("PASS", name);
  } catch (e) {
    reports.push({ name, ok: false, error: e.message, errors });
    console.log("FAIL", name, e.message);
    await p.screenshot({ path: `${output}/${name}.png` }).catch(() => {});
  } finally {
    await c.close();
  }
}
await run("keyboard-and-held-resume", async (p) => {
  await start(p);
  await p.evaluate(() => {
    const A = __SEL;
    A.S.x = -3;
    A.S.z = 2;
    A.S.yaw = 0;
  });
  await p.waitForFunction(() => !document.getElementById("talk").hidden);
  await p.locator("#stage").focus();
  await p.keyboard.press("Enter");
  await p.waitForFunction(() => !document.getElementById("dialogue").hidden);
  await p.keyboard.press("Escape");
  assert(
    await p.evaluate(() => __SEL.S.stage === 10),
    "Early close advanced the story",
  );
  await p.keyboard.press("Space");
  await p.waitForFunction(() => !document.getElementById("dialogue").hidden);
  for (let i = 0; i < 10 && (await p.locator("#dialogue").isVisible()); i++)
    await p.locator("#next").click();
  await p.waitForFunction(() => __SEL.S.stage === 11);
  await p.evaluate(() => __SEL.action("tin"));
  assert(
    await p.evaluate(() => __SEL.carry.holding()?.parent === __SEL.camera),
    "Tin is not visible in camera carry slot",
  );
  await p.reload();
  await ready(p);
  await start(p);
  assert(
    await p.evaluate(
      () =>
        __SEL.S.stage === 11 &&
        __SEL.S.hand === "tin" &&
        __SEL.carry.holding()?.visible,
    ),
    "Held tin did not resume",
  );
  await p.evaluate(() => __SEL.action("tin"));
  await p.waitForFunction(() => __SEL.S.stage === 12);
});
await run("partial-pack-and-water-resume", async (p) => {
  await start(p);
  await p.evaluate(async () => {
    await __SEL.go(25);
    __SEL.action("water");
    __SEL.action("water");
    await new Promise((r) => setTimeout(r, 0));
    __SEL.action("lunch");
    __SEL.save();
  });
  await p.reload();
  await ready(p);
  await start(p);
  assert(
    await p.evaluate(
      () =>
        __SEL.S.hand === "lunch" &&
        __SEL.story.count().n === 1 &&
        __SEL.S.packed.includes("water"),
    ),
    "Part-packed bag did not resume",
  );
  await p.evaluate(async () => {
    __SEL.carry.drop();
    __SEL.S.hand = null;
    await __SEL.go(42);
    __SEL.action("airportWater");
    await new Promise((r) => setTimeout(r, 20));
    __SEL.action("share");
    __SEL.save();
  });
  await p.reload();
  await ready(p);
  await start(p);
  assert(
    await p.evaluate(
      () =>
        __SEL.S.stage === 43 &&
        __SEL.S.share === 1 &&
        __SEL.S.hand === "bottle" &&
        __SEL
          .world()
          .people.find((n) => n.id === "visitor")
          .m.userData.held.some((i) => i.label === "cup"),
    ),
    "Shared cup and remaining water did not resume",
  );
});
await run("every-step-resume", async (p) => {
  await start(p);
  const result = await p.evaluate(async () => {
    const A = __SEL,
      g = A.checkAdapter,
      out = [];
    for (const s of g.steps()) {
      await g.goStep(s);
      const before = g.snapshot(),
        data = g.save();
      await g.restore(data);
      const after = g.snapshot();
      if (JSON.stringify(before) !== JSON.stringify(after))
        out.push({ stage: s, before, after });
    }
    return out;
  });
  assert(!result.length, JSON.stringify(result));
});
await run("teacher-access-and-native-menu", async (p) => {
  await p.locator("#tchap").click();
  assert(
    (await p.locator("#chlist button:disabled").count()) === 5,
    "Fresh chapter locks are wrong",
  );
  await p.locator("#chteacher").click();
  assert(
    (await p.locator("#chlist button:disabled").count()) === 0,
    "Teacher unlock did not unlock chapters",
  );
  await p.reload();
  await ready(p);
  await p.locator("#tchap").click();
  assert(
    (await p.locator("#chteacher").getAttribute("aria-pressed")) === "true",
    "Teacher preference was lost",
  );
  await p.locator("#chteacher").click();
  assert(
    (await p.locator("#chlist button:disabled").count()) === 5,
    "Normal chapter locks did not return",
  );
  await p.locator("#chclose").click();
  await p.locator("#allgames").click();
  await p.waitForURL("**/menu/");
  assert(
    (await p.locator('a[data-game="selassie"]').count()) === 1,
    "New game card is missing on Main Menu",
  );
});
await run("arrival-salute-sound-and-read-route", async (p) => {
  await start(p);
  await p.evaluate(async () => {
    await __SEL.go(51);
    __SEL.DIR.tick(71);
    const n = __SEL.world().people.find((n) => n.id === "emperor");
    n.ctl.mx.update(0.4);
  });
  const info = await p.evaluate(() => {
    const A = __SEL,
      n = A.world().people.find((n) => n.id === "emperor");
    n.m.updateMatrixWorld(true);
    const h = n.m
        .getObjectByName("mixamorigRightHand")
        .getWorldPosition(n.m.position.clone()),
      head = n.m
        .getObjectByName("mixamorigHead")
        .getWorldPosition(n.m.position.clone());
    return {
      clip: n.ctl.cur.getClip().name,
      visible: n.m.visible,
      distance: h.distanceTo(head),
      audio: A.checkAdapter.audio().ctx?.state,
    };
  });
  assert(
    info.visible && info.clip === "Salute" && info.distance < 0.4,
    JSON.stringify(info),
  );
  assert(info.audio === "running", "Audio was never exercised");
  await p.locator("#cineSound").click();
  await p.waitForTimeout(500);
  assert(
    await p.evaluate(
      () =>
        !__SEL.checkAdapter.audio().on &&
        __SEL.checkAdapter.audio().master.gain.value < 0.05,
    ),
    "Sound toggle left the cinematic audible",
  );
  await p.locator("#pauseCine").click();
  assert(
    await p.evaluate(() => __SEL.DIR.paused),
    "Pause did not stop the cinematic",
  );
  await p.locator("#readCine").click();
  await p.locator("#cbtns button").first().click();
  await p.waitForFunction(() => __SEL.S.stage === 55);
  assert(
    await p.evaluate(() => __SEL.S.journal.includes("planno")),
    "Read alternative missed the historical journal page",
  );
});
await run("chapter-replay-clears-task-props", async (p) => {
  await start(p);
  await p.evaluate(async () => {
    await __SEL.go(42);
    __SEL.action("airportWater");
    await new Promise((r) => setTimeout(r, 20));
    __SEL.action("share");
  });
  await p.locator("#jbtn").click();
  await p.locator("#jchap").click();
  await p.locator("#chteacher").click();
  await p.locator("#chlist button").nth(3).click();
  await p.waitForFunction(() => __SEL.S.stage === 40);
  assert(
    await p.evaluate(
      () =>
        __SEL.S.share === 0 &&
        !__SEL
          .world()
          .people.some((n) =>
            (n.m.userData.held || []).some((i) => i.label === "cup"),
          ),
    ),
    "Replay kept cups from a previous visit",
  );
});
await run(
  "phone-touch-controls",
  async (p, c) => {
    await start(p);
    const before = await p.evaluate(() => ({ x: __SEL.S.x, z: __SEL.S.z }));
    const session = await c.newCDPSession(p);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 70, y: 600 }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 70, y: 540 }],
    });
    await p.waitForTimeout(600);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    const after = await p.evaluate(() => ({ x: __SEL.S.x, z: __SEL.S.z }));
    assert(
      Math.hypot(after.x - before.x, after.z - before.z) > 0.03,
      "Touch joystick did not move the player",
    );
  },
  true,
);
fs.writeFileSync(`${output}/browser.json`, JSON.stringify(reports, null, 2));
await browser.close();
if (reports.some((r) => !r.ok)) process.exit(1);
