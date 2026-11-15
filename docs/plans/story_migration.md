# Story flow: per-game migration plan to engine/story.js

Phase 2 plan, written 15 November 2026 after Phase 1 (`engine/story.js`, `tests/story.mjs`, docs). Built from the audit (`flow_audit.md` in this scratchpad) and the current code. Line numbers are from the working tree today. Other agents were editing these files, so check each line before you change it.

**Order.** Wait until the follow and lead work (Kendal, Nanny, Eventide, Melissa, Garvey, Port Royal) and the Eventide fixes have landed. Then do one game per branch, one chapter table at a time. Suggested order: Melissa (the measured arrow delay and the optional tree and wire), Kendal (it is the model the other five copied), then Eventide, Nanny, Bog Walk, Garvey, Tivoli, and Port Royal last (it has no `TALK_TARGETS`).

**Not a shared-file change.** Phase 2 edits only `games/<game>/src/` and `docs/games/<game>.md`. If a game needs something the module does not have, change `engine/story.js` in its own PR, with a test in `tests/story.mjs`.

---

## The same shim in every game (about 30 lines, once per game)

Six games (Garvey, Kendal, Bog Walk, Nanny, Eventide, Melissa) share the same shape: `GOALS`, `TALK_TARGETS`, `NEXT_AFTER_TALK`, `TALK`, `LATER`, `wantsTalk`, `onTalked`, `setStage`, `bubbleTick`, `nudgeTarget`, `nudgeTick`. In each, add near the top of `main.js`:

```js
import { createStory, createCarry, arrowPose, flowTest } from '../../../engine/story.js';
import { STEPS } from './steps.js';   // new file: the step tables, one export per chapter, merged
const STORY = createStory({
  steps: STEPS,
  where: (id) => { const n = byId(id); if (n) return n.m && n.m.visible ? [n.x, n.z] : null;
                   const a = P_() && P_().actions.find((x) => x.id === id); return a ? [a.x, a.z] : null; },
  player: () => [state.x, state.z],
  advance: (s) => setStage(s),
  onGoal: (t) => { goalText = t; showGoal(true); },
  onArrow: () => { showGoal(); const g = $('goal'); g.classList.remove('nudge'); void g.offsetWidth; g.classList.add('nudge'); },
  flavour: Object.fromEntries(Object.entries(LATER).map(([k, f]) => [k, () => f(story)])),
  names: Object.fromEntries(allPeople().map((n) => [n.id, n.who])),   // after the people are made
  items: { /* carried things, see each game */ },
});
const HAND = createCarry({ camera, view: 'first' });   // all these games are first person
```

Then five small edits, each guarded so stages not yet in `STEPS` behave as today:

| Where | Change |
|---|---|
| `setStage(s)` | add `STORY.sync(s);` after `stage = s` (before `refreshGoal`). |
| `refreshGoal` | `goalText = STORY.owns() ? STORY.goal() : (old)`. |
| `wantsTalk(n)` | `STORY.owns() ? STORY.marked(n.id) && !n.extra : (old)`. |
| `startTalk(n)` | when `STORY.owns()`: `const r = STORY.talk(n.id)`; `story` plays `TALK[id]` (full talk, `talkFull = true`); `meet` plays `TALK[id]` once with `talkFull = false`; `flavour` or `after` plays `r.line` (or the old `LATER` line when `r.line` is null). |
| `endTalk` | when `STORY.owns()`: `if (finished && talkFull) STORY.done(n.id)` in place of `n.talked = true; onTalked()`. |
| each action's `go()` that is a step need | add an `id` to the action and call `STORY.done(id)`; its `on()` becomes `() => STORY.needs(id)` where it was a stage test. |
| `bubbleTick` | `m.visible = near !== n && d < 40 && (STORY.owns() ? STORY.marked(n.id) : true)`. |
| `nudgeTick` | when `STORY.owns()`: `const a = STORY.tick(now, quiet)`; if `a.show`, project `[a.x, 2, a.z]` and use `arrowPose(...)` for `el.className`, `left`, `top`, label; else hide. Delete the 15 s / 50 s timer for those stages. |
| `saveGame` / `applySave` | add `flow: STORY.save()`; on load `STORY.restore(d.flow)` after the place is built. |
| dev | `if (__DEV__ && q.get('test') === 'flow') flowTest(STORY, { place: (s) => enterPlace(placeOfStage(s)), start: (s) => startOf(s) })`. Must print `FLOW 0`. |

Each table row is written from `GOALS[s]`, `TALK_TARGETS[s]` and `NEXT_AFTER_TALK[s]`; a task stage takes `needs.do` with the counter it uses today (`ctr.mule` becomes `{ id: 'mule', n: 3 }`) and a `shows` function that does what the action's `go()` already does to the scene. Delete the old rows from `GOALS`, `TALK_TARGETS` and `NEXT_AFTER_TALK` as each stage moves. The goal text loses its hand-written `${P.x || 0} of 3`: the module writes the count.

A probe run on 15 November (the five `content.js` tables loaded into `checkFlow`, no game files changed) found these `LATER` lines that the check will fail: Melissa `papa51` "Help Mass Cyril, then come back.", `dad` "Go and help your mother.", `hyacinth` "I will go to the church when the time comes."; Eventide `maude6` "Facts first. Then opinions. Never rumours."; Nanny `mama5b` "We walk at first light.". The last three are not redirects but use the listed words: reword them ("I will go to church when it is time" becomes "Church will wait for me."; "We walk at dawn."; "Facts. Never rumours."). Lines that name another person are only caught once `names` is passed, so expect more (Bog Walk Henry "Zeke is in the turbine house.", Zeke "The board by the door...", Tivoli Pearl "See what Roy says.").

---

## 1. Melissa (`games/melissa/src/`)

- **Files:** `content.js` (`GOALS` 18-62, `TALK_TARGETS` 64, `NEXT_AFTER_TALK` 65, `LATER` 283-293), `main.js` (`bubbleTick` 206, `wantsTalk` 292, `startTalk` 294, `onTalked` 317, `setStage` 331, actions about 403-422, `NUDGE_EXTRA` 604, `nudgeTarget` 605, `nudgeTick` 609). New `steps.js`.
- **Tables, chapter by chapter:** 10-16, 20-26, 30-36, 40-45, 50-55, 60-65, 70-74.
- **Rule 1:** stages 10, 20, 30, 40, 44, 50 become counted talk steps. Make `papa51` and `dad` later lines flavour (no "then come back", no "go and help your mother"); reword `hyacinth`.
- **Rule 2:** stage 51 `optional: ['tree', 'wire']` and stages 53 and 54 the same, so the arrow never points at the fallen tree or the wire (the audit's top item). `NUDGE_EXTRA[51]` becomes `at: { house: [-26, -3.4] }` with `needs.go: ['house']`.
- **Rule 3 (biggest job):** about ten toast-only tasks need `shows` and the hand: water drum fills (11, 21), water and tins in hand and on the shelf, buckets filled and stood by the door, go-bag packed and set down (31), nails handed up (33: nail in hand, then on the board), blankets and cups (41: in hand, then with the person), bucket at the truck (61), plate of food (62: in hand, then by Miss Hyacinth's chair). Register `items: { drum, bucket, tins, bag, nail, blanket, cup, plate }` and use `HAND.carry` and `HAND.place`. The torch on the camera (`main.js` about 321) stays as it is.
- **Checks:** `?test=flow` 0, `?test=layout` with the arrow up early, the autoplayer for every chapter (`?auto=N&one`).

## 2. Kendal (`games/kendal/src/`)

- **Files:** `content.js` (`GOALS` 17-57, `TALK_TARGETS` 59, `NEXT_AFTER_TALK` 60, `TALK` 65, `LATER` 326-360), `main.js` (`bubbleTick` 207, `refreshGoal` 273, `wantsTalk` 291, `startTalk` 293, `onTalked` 316, `setStage` 327, actions about 417-449, `NUDGE_EXTRA` 554, `nudgeTarget` 555, `nudgeTick` 559). `ALIAS()` (main.js about 290) stays: it maps a step's person to the right `TALK` entry.
- **Tables:** 10-14, 20-25, 30-35, 40-45, 50-53, 60-67, 70-74.
- **Rule 1:** counts at 10, 20, 30, 40, 50, 66, 70 come for free. Goal 60 becomes "Talk to Gran and Mr. Clive." (count added). Flavour people with unreachable `TALK` entries (`lady`, `guard`, `pearl`, `guardNight`) go in `meet`, so they play once. Dawn (`places2.js` 133): hide her until 62, or leave her out of every `story` before 62 so she has no mark; give her a flavour line. Nurse's early "Thank you, child" becomes an `after` line only after the first bucket, or a plain flavour line.
- **Rule 2:** `NUDGE_EXTRA[12]` becomes `needs.go: ['poles']` with `at: { poles: [30, 0] }`. Stage 33 Abel: fold into 31's end (Abel walks over), or keep it as a one-person step.
- **Rule 3:** bucket on the camera for 23 and 61 (`HAND.carry(bucket)` at the tap, `HAND.place` at the nurse; on the 1845 ride the bucket goes hand to hand). Banana bunches (31): carry from the pile, then an action at the wagon places it (`needs.do: [{ id: 'bunch', n: 4, carry: 'bunch' }]`, the pile and the wagon both show the change). Brakes (34): turn each brake handle in `shows`. Splash (43): a splash effect in `shows`. The lamp stays as `lampMesh` on the camera but should be drawn from the moment Ezra gives it, through `HAND`.
- **Also:** save the stage 23 goal in the step (the module rebuilds it), so the stale `GOALS[23]` bug goes away; goal 67 becomes `wait: true` with a goal that does not say "Read the next card" after "Stay here".

## 3. Eventide (`games/eventide/src/`)

- **Files:** `content.js` (`GOALS` 18-56, `TALK_TARGETS` 57, `NEXT_AFTER_TALK` 59, `LATER` 231-252), `main.js` (`bubbleTick` 235, `refreshGoal` 298, `wantsTalk` 315, `startTalk` 317, `onTalked` 340, `setStage` 347, actions about 409-446, `nudgeTarget` 466, `nudgeTick` 473).
- **Route callback:** move the gate and veranda rule out of `nudgeTarget` (main.js 466-471) into `route: (t) => { ... }` (from the road the way in is the gate `[0, -7.4]`; onto the veranda by the steps `[4.2, -38]`; return `[x, z, false]` for those).
- **Tables:** 10-14, 20-23, 30-33, 40-46, 50-54, 60-63, 70-75.
- **Rule 1:** stage 44 becomes "Find Nurse Bell and the ladies." with `needs.talk: ['nurse4', 'hyacinth4', 'maude4']` (count added); the nurse's "Go to them." is her own story line, fine. Stage 32 "Say goodnight." gets its count of 4. Miss Iris needs a flavour line before stage 12 (not "Hello again"). Reword `maude6`.
- **Rule 3:** stage 21: the photograph, Bible, comb and radio in the hand from the table to the bed (`items`, `HAND.carry` then `HAND.place` at each bed). Stage 42: the gate swings open in `shows` and the player stands holding it.

## 4. Nanny Town (`games/nanny/src/`)

- **Files:** `content.js` (`GOALS` 17-50, `TALK_TARGETS` 54, `NEXT_AFTER_TALK` 55, `LATER` 235 onwards, the wall toast 258), `main.js` (`bubbleTick` 206, `refreshGoal` 272, `wantsTalk` 291, `startTalk` 293, `onTalked` 319, `setStage` 327, the trail wall about 460, the back trail block about 487, `NUDGE_EXTRA` 616, `nudgeTarget` 617, `nudgeTick` 621). `refreshGoal` also reads `ctr.goal`: keep that for stages not yet moved.
- **Route callback:** `NUDGE_EXTRA` for 11 and 12 (`ahead(PL.estate.spots.trail.dense)`) becomes `route` for those stages (point ahead along the trail), or `at` on a `go` need.
- **Tables:** 10-15, 20-25, 30-35, 40-44, 50-56, 60-64.
- **Rule 1:** chapter 2 loop (Mimba, Cubbenah, Mimba): either plant the yams after the horn, or put Mimba's question in Cubbenah's talk, so stages 22 to 24 are one way with no walk back. Mimba's "Come and help me plant, later." and "Now go and find Cubbenah." go. Chapter 1's wall toast "Talk to Mama and Quamin first." becomes Quamin calling "Wait for us!" (a story line, from the story person), or the walk starts after the first talk. Counts at 10, 21, 30, 43, 60 for free. Reword `mama5b`.
- **Rule 3:** stage 51 doors: open a door and show a person in each doorway in `shows` (`needs.do: [{ id: 'door', n: 3 }]`).
- **Rules of its own:** Nanny never speaks and nothing sacred is shown (`docs/games/nanny.md`): no step may name Nanny as a talk need.

## 5. Bog Walk (`games/bog-walk/src/`)

- **Files:** `content.js` (`GOALS` 18 onwards, `TALK_TARGETS` 48, `TALK` 51, `LATER` 138 onwards), `main.js` (`setGoal` 81, `bubbleTick` 357 with `markWanted`, `wantsTalk` 409, `startTalk` 411, `refreshGoal` 471, `nudgeTarget` 478, `placeNudge` 482, `nudgeTick` 490, `setStage` 525, actions about 573-577, `onTalked` 579), `dev.js` (its own checks; wire `flowTest` there). Bog Walk has no `NEXT_AFTER_TALK`: its `onTalked(n)` decides; write `next` in each step.
- **Arrow:** keep `placeNudge` (it moves the arrow off words and buttons) and feed it from `STORY.tick` and `arrowPose`. The Tube's "This way / Turn around" cue (main.js about 755) stays as it is: it already meets rule 2.
- **Tables:** 10-16, 20-24, 30-31, 40-41, 50-55, 60-65.
- **Rule 1:** the station chain (Rudy, Henry, Zeke, board, Zeke) becomes one step "Meet the gang." with `needs.talk: ['rudy', 'henry', 'zeke']` (count added), then the board, then Zeke at the valve. Henry's and Zeke's later lines ("Zeke is in the turbine house.", "The board by the door...") become flavour with no names. The reporter's early line becomes flavour. Ruins (60-65): one sitting with the class (Kemar's question, the order, Kemar's last question) instead of Grant, board, Kemar, Grant, Kemar.
- **Rule 2:** the information board's `on: () => stage === 61 || stage >= 62` (main.js 577) is the arrow bug the audit confirmed: with the module the board is only a need at 61 and `optional` after, so it never takes the arrow again. Add an arrow for the rust patches (30, 31: `needs.do: [{ id: 'rust', n: N }]`, `where` gives the nearest dirty patch).
- **Rule 3:** the Tube goal keeps its count from the start (drop the 7 s goal change at main.js about 150, or give that goal `{n} of {of}`). `markWanted` and the eye marks at stage 51 (the four "see" people) map to `needs.do` with `shows` (the eye goes off once seen).

## 6. Marcus Garvey (`games/garvey/src/main.js`)

- **Files:** everything is in `main.js`: `GOALS` 379, `TALK_TARGETS` 387, `NEXT_AFTER_TALK` 388, `wantsTalk` 389, `setStage` 390, `onTalked` 391, `setGoal` 399, `startTalk` 481, `bubbleTick` 534, `nudgeTarget` 547, `nudgeTick` 551. Later lines are inline in each chapter's people (626, 631, 803, 806, 874, 875, 962, 965). Move the tables out into `games/garvey/src/steps.js`.
- **Tables:** 0-3, 10-14, 20-23, 30-34, 40-44, 50-54, 60-64, 70-74.
- **Rule 1:** remove the "first" lines: the steward at 50 ("Please talk to the three visitors first.", 962), Garvey at 50-52 ("Please read the Declaration first.", 965), Garvey at 40 ("Talk to the clerk and the engineer first.", 874, which also plays after you have met them). Pressman and Garvey at 32 (803, 806) and Garvey at 43 (875) become flavour with no names. Amy's and Garvey's "Please talk to ... too." (626, 631) are no longer needed: the count shows it. Chapter 3 loop: the older man asks his question at the end of Garvey's talk (`convo` forced). Counts at 0, 10, 12, 20, 30, 33, 40, 50, 70 for free. The steward's welcome lines with `unlock: 'convention'` (961) go in `meet` so they can play.
- **Rule 3:** the type stand (1), ship inspection (41), news cards (61) and timeline board (71) are panels that leave no trace: each needs a `shows` (the printed notice on the wall, a chalk mark on the hull, the sorted cards on Amy's desk, the board lit). The steward's choice (51): the steward walks to the person you chose (`engine/follow.js` `goTo`), the traveller sits, the nurse gets her basket (`grip`).
- **Also:** Garvey has no `?test=audit` wired; wire `?test=flow` and the audit in the same PR.

## 7. Tivoli (`games/tivoli/src/`)

- **Files:** `ch1.js` (`ORDER` 16, `goalNow` 22, `onTalked` 34, `tick` 37-39), `content.js` (`CH1.goals`, `CH1.talk`, `CH1.later`, Pearl's lines about 34 and 46), `talk.js` (the talk button within 2.8 m, 25-30), `main.js` (`setGoal` 82). Tivoli has its own `src/story.js` (chapters and the journal): import the engine one as `import { createStory } from '../../../engine/story.js'` under a different name (`FLOW`) to avoid confusion.
- **Table:** chapter 1 only (chapter 5 is a directed scene; mark its stages `wait: true` if they go in a table at all).
  ```js
  { 1: { goal: 'Talk to Ivy, her gran and Mass Roy.', needs: { talk: ['ivy', 'pearl', 'roy'] }, next: 2 },
    2: { goal: 'Walk to the end of the lane.', needs: { go: ['end'] }, at: { end: [endSpot.x, endSpot.z] }, end: true } }
  ```
- **Rule 1:** Pearl's lines must not depend on the order: "Go and see Roy in the lane. He has news." and "Go on, child. See what Roy says." become flavour with no names, or conditional on `talked.roy`.
- **Rule 2:** Tivoli has no arrow and no speech marks. Add the `#nudge` element and its CSS from Kendal (`index.html`), the gold mark from Kendal's `addMark`, and an end-of-lane marker. Check `?test=layout` (Tivoli has no layout test yet).
- **Its rules:** read `docs/games/tivoli.md` first. Nothing in chapter 5 gets an arrow; the opt-in card is untouched.

## 8. Port Royal (`games/port-royal/src/main.js`)

Port Royal has no `TALK_TARGETS`: goals are chains of `if`s and the arrow reads the goal text (`NUDGE_MAP`). Do it last, chapter by chapter.

- **Files:** `main.js`: `setGoal` 605-614 (chapter 0), `afterGoal` about 965 (chapter 4), `wareGoal` about 1025 (chapter 2), `fbGoal` about 1707 (chapter 1), `NUDGE_MAP` 795-800, `nudgeTarget` 802, `nudgeStep` 811 onwards, the arrow tick about 834-845, marks about 1897-1918, Abba's ring 471 and 537, Morgan's hub 1675-1677, the crate carry 1727-1733.
- **Route callback:** `route: (t) => nudgeStep(t)` as it is (it returns `[x, z, isFinal]`, which the module already understands).
- **Tables:** one per chapter. Step ids can be strings (`'c0-pier'`, `'c0-finds'`): Port Royal has no stage numbers, so add a small `stage` variable that each `setGoal` branch sets, and call `STORY.sync(stage)`. `where(id)` looks up `ACTIONS` by an `id` added to each action (today they are found by label regex).
- **Rule 1:** chapter 4 camp loop (Abba: "Look around. Then come back to me.", then "Go back to Abba.") becomes one step "Look around." with `needs.do: ['tent', 'water']` (count added) and Abba walks over at the second look (`goTo`), or Abba's first talk is `AFTER2` when both are seen. Will ("Ask old Ned. He was really there.") and Grace ("Go and see the turtles by the water. Peter will show you.") become flavour with no names.
- **Rule 3 and counts:** Morgan's hub needs 3 of 5 questions: a `needs.do: [{ id: 'ask', n: 3 }]` with the count on the hub card and the goal. Chapter 1 "Talk to the quartermaster and watch the drill." (count of 2). Chapter 2 cargo "Check today's cargo." (count of 3). The crate task (1727-1733) already draws the crate on the camera and in the boat: move it onto `HAND.carry` and `HAND.place` without changing what you see.
- **Marks:** today every "Talk to" action within 16 m is marked; only `STORY.marked(id)` should be.

---

## Done means (every game)

- `?test=flow` prints `FLOW 0` (run headless as in `docs/TESTING.md`, section 5).
- `npm test` passes.
- The arrow shows by 3 s (5 s explore) in a screenshot series after each new goal, also while walking; on the phone layout (390x800) it covers no words.
- Only story people show a gold mark, in a screenshot of each multi-person step.
- Each carried thing shows in the hand and where it is put, in screenshots.
- The autoplayer runs each chapter (`?auto=N&one`), and `?test=audit`, `?test=held` and `?test=layout` still report 0.
- `docs/games/<game>.md` says which chapters use `engine/story.js`, and the table at the end of `docs/STANDARD.md` is updated.
