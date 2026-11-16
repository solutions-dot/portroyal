/* Run against a dev build served from the repository root.
   PW_MODULE=/absolute/path/to/playwright-core/index.mjs node tools/windrush/browser-smoke.mjs
   Optional WINDRUSH_URL and CHROMIUM_BIN select the local server and browser. */
import assert from "node:assert/strict";
const { chromium } = await import(process.env.PW_MODULE || "playwright-core");
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_BIN || "/usr/bin/chromium",
  headless: true,
  args: [
    "--no-sandbox",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--disable-dev-shm-usage",
  ],
});
const url =
  process.env.WINDRUSH_URL || "http://localhost:8891/games/windrush/site/";
const errors = [],
  passed = [];
const mark = (text) => {
  passed.push(text);
  console.log(text);
};
const ready = (p) =>
  p.waitForFunction(() => window.__WIND, null, { timeout: 120000 });
const step = (p, n) =>
  p.evaluate((n) => window.__WIND.checkAdapter.goStep(n), n);
const state = (p) => p.evaluate(() => window.__WIND.checkAdapter.snapshot());
async function closeCard(p) {
  if (await p.locator("#card").isVisible())
    await p.locator("#cbtns button").first().click();
}
async function load(p) {
  await p.goto(url);
  await ready(p);
  await p.locator("#start").click();
  await p.waitForFunction(() => document.querySelector("#title").hidden);
  await closeCard(p);
}
async function reload(p) {
  const expected = await state(p);
  await p.reload();
  await ready(p);
  await p.locator("#start").click();
  await p.waitForFunction(
    (e) =>
      document.querySelector("#title").hidden &&
      window.__WIND.world().id === e.place &&
      window.__WIND.S.stage === e.stage,
    expected,
    { timeout: 120000 },
  );
}
async function task(p, id) {
  await p.evaluate((id) => {
    const A = window.__WIND,
      [x, z] = A.where(id, "do");
    Object.assign(A.S, { x, z });
    A.tick(0);
  }, id);
  await p.locator("#talk").click();
}
try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 0.5,
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await load(page);
  await page.evaluate(() =>
    localStorage.setItem("portroyal-review-sentinel", "unchanged"),
  );
  // A real key opens dialogue, closing it early does not complete its story task.
  await step(page, 10);
  await page.evaluate(() => {
    Object.assign(window.__WIND.S, { x: 4, z: 6.5 });
    window.__WIND.tick(0);
  });
  await page.locator("#stage").focus();
  await page.keyboard.press("e");
  assert(await page.locator("#dialogue").isVisible());
  const talkTime = await page.evaluate(
    () => window.__WIND.world().people.find((n) => n.id === "may").ctl.mx.time,
  );
  await page.waitForFunction(
    (t) =>
      window.__WIND.world().people.find((n) => n.id === "may").ctl.mx.time > t,
    talkTime,
  );
  await page.locator("#dclose").click();
  assert.equal((await state(page)).stage, 10);
  await page.locator("#stage").focus();
  await page.keyboard.press("Space");
  assert(await page.locator("#dialogue").isVisible());
  while (await page.locator("#dialogue").isVisible())
    await page.locator("#next").click();
  await page.waitForFunction(() => window.__WIND.S.stage === 11);
  mark("E/Space, dialogue completion and cancellation");
  // The arbitrary-order suitcase task must survive a full document reload mid-carry.
  await step(page, 21);
  await task(page, "packPhoto");
  assert.deepEqual((await state(page)).held, ["photo"]);
  assert.equal(
    await page.evaluate(() => window.__WIND.story.pick().id),
    "packPhoto",
  );
  await reload(page);
  assert.deepEqual((await state(page)).held, ["photo"]);
  await task(page, "packPhoto");
  await task(page, "packBook");
  await task(page, "packBook");
  await task(page, "packCloth");
  await task(page, "packCloth");
  await page.waitForFunction(() => window.__WIND.S.stage === 22);
  await reload(page);
  assert.equal((await state(page)).stage, 22);
  assert.equal(
    Object.keys((await state(page)).placed).filter((k) => k.startsWith("pack"))
      .length,
    3,
  );
  await step(page, 20);
  assert.equal((await state(page)).placed.packPhoto, undefined);
  assert.deepEqual((await state(page)).held, []);
  mark(
    "Unordered packing, held-item reload, completed-item reload and replay cleanup",
  );
  // Posting carries the actual prepared sheets with the envelope.
  await step(page, 61);
  for (const id of ["postalOrder", "homeLetter"]) {
    await task(page, id);
    await task(page, id);
  }
  await page.waitForFunction(() => window.__WIND.S.stage === 62);
  await task(page, "post");
  await reload(page);
  assert(
    await page.evaluate(() => {
      const Q = window.__WIND.world();
      return ["letter", "order"].every(
        (id) => Q.items[id].parent === Q.items.envelope,
      );
    }),
  );
  await task(page, "post");
  await page.waitForFunction(() => window.__WIND.S.stage === 63);
  mark("Letter bundle survives reload and leaves the table when posted");
  // The elder owns her route; reload keeps her place, rather than teleporting her to the gate.
  await step(page, 75);
  await page.evaluate(() => {
    const A = window.__WIND;
    Object.assign(A.S, { x: -2, z: 3 });
    for (let i = 0; i < 60; i++) A.tick(1 / 30);
    A.save();
  });
  const elder = await page.evaluate(() => {
    const n = window.__WIND.world().people.find((n) => n.id === "iris");
    return [n.x, n.z];
  });
  await reload(page);
  const restored = await page.evaluate(() => {
    const n = window.__WIND.world().people.find((n) => n.id === "iris");
    return [n.x, n.z];
  });
  assert(Math.hypot(elder[0] - restored[0], elder[1] - restored[1]) < 0.4);
  await page.evaluate(() => {
    const A = window.__WIND;
    const draw = A.renderer.render;
    A.renderer.render = () => {};
    for (const [x, z] of [
      [-1, 2],
      [0, -2],
      [0, -6],
    ]) {
      Object.assign(A.S, { x, z });
      for (let i = 0; i < 240; i++) A.tick(1 / 30);
    }
    A.renderer.render = draw;
    A.tick(0);
  });
  await page.waitForFunction(() => window.__WIND.S.stage === 76);
  mark("Iris walks, waits, resumes after reload and reaches the gate");
  // A real user gesture has started audio. Test the camera scene controls and reading route.
  await page.evaluate(() => window.__WIND.go(25));
  await closeCard(page);
  await page.waitForFunction(() => window.__WIND.DIR.on);
  await page.locator("#pauseCine").click();
  const time = await page.evaluate(() => window.__WIND.DIR.time);
  await page.waitForTimeout(200);
  assert.equal(await page.evaluate(() => window.__WIND.DIR.time), time);
  await page.locator("#cineSound").click();
  const audio = await page.evaluate(() => {
    const a = window.__WIND.checkAdapter.audio();
    return { state: a.ctx?.state, on: a.on };
  });
  assert.equal(audio.state, "running");
  await page.locator("#readCine").click();
  assert.equal(await page.evaluate(() => window.__WIND.DIR.on), false);
  await closeCard(page);
  await page.waitForFunction(() => window.__WIND.S.stage === 30);
  await closeCard(page);
  mark("Cinematic pause, sound, read alternative and next chapter");
  await page.evaluate(() => window.__WIND.go(68));
  await page
    .getByRole("button", { name: "Read what happens", exact: true })
    .click();
  await page.waitForFunction(() => window.__WIND.S.stage === 80);
  await closeCard(page);
  const s = await state(page);
  assert(s.journal.includes("scandal") && s.journal.includes("support"));
  mark("Calm reading path preserves the later family story");
  // Teacher access and game-only reset must persist independently of other games.
  await page.locator("#jbtn").click();
  await page.locator("#jchap").click();
  await page.locator("#chteacher").click();
  assert.equal(
    await page.evaluate(() => localStorage.getItem("windrush-teacher")),
    "on",
  );
  await reload(page);
  assert.equal(await page.evaluate(() => window.__WIND.S.teacher), true);
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("portroyal-review-sentinel"),
    ),
    "unchanged",
  );
  mark("Teacher access and save namespace isolation");
  await context.close();
  const phone = await browser.newContext({
    viewport: { width: 390, height: 800 },
    deviceScaleFactor: 0.5,
    isMobile: true,
    hasTouch: true,
  });
  const touch = await phone.newPage();
  touch.on("pageerror", (e) => errors.push(e.message));
  await load(touch);
  const before = await state(touch),
    cdp = await phone.newCDPSession(touch);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 70, y: 560, id: 1 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: 70, y: 505, id: 1 }],
  });
  await touch.waitForTimeout(500);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  const after = await state(touch);
  assert(
    Math.hypot(before.pos[0] - after.pos[0], before.pos[1] - after.pos[1]) >
      0.15,
  );
  const yaw = await touch.evaluate(() => window.__WIND.S.yaw);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 300, y: 460, id: 2 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: 350, y: 460, id: 2 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  assert(
    Math.abs((await touch.evaluate(() => window.__WIND.S.yaw)) - yaw) > 0.1,
  );
  mark("Phone touch movement and drag to look");
  if (process.env.WINDRUSH_SHOTS) {
    const { mkdirSync } = await import("node:fs");
    mkdirSync(process.env.WINDRUSH_SHOTS, { recursive: true });
    await step(touch, 10);
    await touch.evaluate(() => {
      Object.assign(window.__WIND.S, { x: 4, z: 6.5 });
      window.__WIND.tick(0);
    });
    await touch.locator("#talk").click();
    await touch.screenshot({
      path: process.env.WINDRUSH_SHOTS + "/windrush-phone-dialogue.png",
    });
    await touch.locator("#dclose").click();
    await touch.locator("#jbtn").click();
    await touch.screenshot({
      path: process.env.WINDRUSH_SHOTS + "/windrush-phone-journal.png",
    });
    await touch.locator("#jclose").click();
    await touch.evaluate(() => window.__WIND.go(70));
    await touch.screenshot({
      path: process.env.WINDRUSH_SHOTS + "/windrush-phone-card.png",
    });
  }
  await phone.close();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ passed, errors }, null, 2));
} finally {
  await browser.close();
}
