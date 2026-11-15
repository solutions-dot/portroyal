import test from "node:test";
import assert from "node:assert/strict";
import { createStory, needList } from "../../../engine/story.js";
import { STEPS } from "../src/steps.js";
import { CHAPTERS, TALK } from "../src/content.js";
function setup() {
  const advanced = [],
    visual = [];
  const story = createStory({ steps: STEPS, advance: (n) => advanced.push(n) });
  story.shows("share", (n) => visual.push(n));
  return { story, advanced, visual };
}
test("family conversations accept either order and count each person once", () => {
  for (const order of [
    ["mum", "levi"],
    ["levi", "mum"],
  ]) {
    const { story, advanced } = setup();
    story.enter(20);
    assert.equal(story.done(order[0]), true);
    assert.equal(story.done(order[0]), false);
    assert.match(story.goal(), /1 of 2/);
    assert.deepEqual(advanced, []);
    story.done(order[1]);
    assert.deepEqual(advanced, [21]);
  }
});
test("resuming a partly heard family step preserves the unfinished person", () => {
  const { story } = setup();
  story.enter(20);
  story.done("levi");
  const saved = story.save(),
    fresh = setup();
  fresh.story.restore(saved);
  assert.equal(fresh.story.marked("levi"), false);
  assert.equal(fresh.story.marked("mum"), true);
  assert.equal(fresh.story.done("levi"), false);
  fresh.story.done("mum");
  assert.deepEqual(fresh.advanced, [21]);
});
test("sharing water requires two recipients and restores its visible count", () => {
  const a = setup();
  a.story.enter(43);
  a.story.done("share");
  assert.deepEqual(a.advanced, []);
  const b = setup();
  b.story.restore(a.story.save());
  assert.deepEqual(b.visual, [1]);
  b.story.done("share");
  assert.deepEqual(b.visual, [1, 2]);
  assert.deepEqual(b.advanced, [44]);
  assert.equal(b.story.done("share"), false);
});
test("every chapter has a start, an ending, and finite task counts", () => {
  assert.equal(CHAPTERS.length, 6);
  for (const c of CHAPTERS) {
    assert.ok(STEPS[c.first]);
    assert.ok(
      STEPS[c.last].wait ||
        STEPS[c.last].next === CHAPTERS[CHAPTERS.indexOf(c) + 1]?.first,
    );
    for (const [id, s] of Object.entries(STEPS).filter(
      ([id]) => +id >= c.first && +id <= c.last,
    ))
      for (const n of needList(s))
        assert.ok(n.n > 0 && Number.isFinite(n.n), id);
  }
});
test("real public figures are shown without invented dialogue", () => {
  for (const who of Object.values(TALK)) {
    assert.equal(who.emperor, undefined);
    assert.equal(who.planno, undefined);
  }
});
