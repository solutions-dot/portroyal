# To do: the story-first pass for all ten games (21 November 2026)

Written for whoever carries this out (another LLM or a person). It is self-contained: the owner's rules, what was found, the sources checked, the decisions, and the work in order with how to check each item. Tick an item off (`[x]`) when it is done and add a line saying what you ran and what it reported.

Nothing in this file has been built yet. Every game is **live**, so each change reaches real players: work on a branch, check on the phone layout, and open a PR for the owner. Do not merge to `main` unless the owner asks.

## 1. The idea (owner, 21 November 2026)

Each game is a story the child takes part in. It must not feel tedious. Tasks are also how the games teach customs and skills that two lines of dialogue cannot, so **a task that teaches stays**. What goes is dead weight: walking with no reason, trips back to someone you just left, a fact said twice, long end chains, and hand-offs that teach nothing.

Rules to hold every change to (add them to `docs/STANDARD.md` in Phase 0):

1. **Something happens about every minute**: a scene, a choice, a surprise or a hands-on moment.
2. **Does it teach something dialogue cannot?** If a child could learn it from two lines, make it a line. If it teaches a custom, a skill or a feeling, keep the task.
3. **The result is visible.** A toast alone is not enough (this is already rule 3 of "Story flow" in `docs/STANDARD.md`).
4. **Someone reacts.** A short word or gesture from the person it matters to.
5. **The first go does the teaching.** Repeat a task only when each go adds something.
6. **No trips just to come back.** Nobody sends you away and back again. The goal on screen does the sending, never a line of dialogue (already rule 1 of "Story flow").
7. **Each fact is said once**, by the best person for it. More detail goes in the journal.
8. **Talk is short**: about 6 lines for a first conversation, three people at most per step, with the count on screen.
9. **Long walks have a reason** (someone walks with you, or something happens) or are shortened.
10. **A chapter takes about 5 to 8 minutes.** Time each chapter before and after. Trim non-teaching parts first.
11. **Nothing may lengthen the game.** The end-of-game recap (Phase 1) appears once, on the final card only.

Owner decisions already made:

- Wrong quiz answer: show the right one, pause, move on. Quizzes are cut to 3 or 4 questions in every game.
- The end-of-game recap is three icons, each tappable to open its journal page, **at the end of the game only**.
- **No teacher view** for now.
- Phibba hides by the cotton tree (not the watchman's lantern scene).
- The planting clips are used as described in Phase 2.
- Another LLM is changing bodies and clothes. **Do not touch bodies, clothes or the people builders** (`tools/*/people`, `tools/people`, `games/*/site/models`). Anything that needs them waits (see Section 6).

## 2. House rules that always apply (from `CLAUDE.md`)

No em dashes anywhere (code comments, dialogue, docs, commits, PR text). Plain words for ages 6+, dialogue lines about 12 words or fewer. Historically accurate, with fictional people marked "X in this game is fictional" on their journal page. Difficult history is told gently. Everything works on phones. Fix shared faults in `engine/`, not game by game (rule 10). Every place must report 0 on the audits (`?test=audit`, `held`, `layout`; `docs/TESTING.md` section 5). Commits are `Claude <noreply@anthropic.com>` with the trailer the session gives.

Game-specific rules to respect:

- **Nanny Town** (`docs/games/nanny.md`): Nanny never speaks and is only seen from far away. Nothing sacred is shown. The word "obeah" is not used. Not yet reviewed by the Moore Town Maroons.
- **The Emperor's Arrival**: Haile Selassie I and Mortimo Planno have no invented words.
- **Marcus Garvey**: says only his real, sourced words.
- **Tivoli**: its May 2010 chapters (4 to 6) are the hardest subject. Add **no** new tasks there.

## 3. What was found (research, 21 November 2026)

Read from code, content and the games' own autoplayers and screenshots. Not every game was played through by hand, so treat each item as a place to look closely.

**Across all ten games**

- The goal sits small in the top-left corner and is easy to miss.
- Only Windrush says at the start of each chapter who you are ("You are Iris, aged nine"). Port Royal shows Lewis Galdy in third person (V key). The other eight games mention who you are only in a quiet journal page, yet people call you "child", "girl", "boy", "young man", "little one" or "youngster".
- Talking does not turn the camera to the person (checked in `startTalk` of every game). On a phone the speaker can sit cut off at the edge.
- Most carry and place tasks show nothing in the hand. Kendal's lamp, Bog Walk's torch and Eventide's blankets do.
- "Talk to several people" goals have no count in Nanny Town (5 goals), Hurricane Melissa (6), Eventide and Bog Walk. Kendal, Garvey, Selassie and Windrush use `engine/story.js` and do.
- Every quiz marks a wrong answer grey and says "try again". None shows the right answer.
- Quiz lengths: Nanny 6 plus a reflection card; Bog Walk 6 + 6 + 5 steps; Eventide 6 + 6; Garvey several puzzles; Melissa 3 + 3 (it explains a wrong answer but does not show the right one); Port Royal sums in dialogue.

**Nanny Town**

- Plant a yam: a sound, a toast and a vine appear. No yam piece, no planting movement.
- Nanny is not on the high rock when Cubbenah says "Look up there" (`extra('nanny', ...)` with `when: [24, 29]` in `places.js` line 123, shown by `nannyScene` at stage 24). A screenshot of that scene shows nobody on the rock. Find out why.
- The valley view shows the soldiers as small red blocks (`redline` in `places.js`).
- Forked sticks: a pile exists but is never picked up or carried (`P.spots.sticks`).
- Phibba stands about 7 m away in the open in the same shot while Beneba says she cannot find her. She does not look scared (calm face, ordinary pose on the climb). `Scared` exists in the shared library but Nanny Town does not ship it (`games/nanny/anim-clips.json`).
- On the back trail Phibba follows 1.4 m behind you (`FOLLOW.phibba` in `main.js`), so you never see her. The climb feels jerky (camera height `camY` easing on stepped ground, and sliding along trail edges).
- The horn game has no "hear it again" and restarts the call on one wrong tap. Cubbenah plays a Drink pose as a stand-in for the horn. On a phone the horn panel covers the lower half of the screen.
- Knocking on doors plays a knock and a toast. No door opens.
- The path seen from the watch rock is broad, but the history is that two people could not walk it side by side.
- The goal "Climb the back trail. Do not stop." is stern, and nothing punishes stopping.
- Nanny appears only twice, far off (chapter 2, chapter 6). She is not in the fight or the night of 1734.
- Dialogue gaps: Mimba says "Now go and find Cubbenah" (sends you elsewhere); Mama says nothing in chapter 2; Phibba has three lines and nothing on the climb; you never answer Quamin in chapter 1; nobody explains the paper in chapter 6; the time jumps (about one year, then three years, then six) are only on title cards; the work you choose in chapter 2 changes one word and a journal line.
- Slow parts: chapter 2 walks you from Mimba (west) to Cubbenah (east) and back to Mimba; chapter 6 ends with 6 questions plus three cards.

**Kendal 1957**: the lamp is in your hand from stage 40 (the morning platform) to stage 65 (`updateLamp`). The crash was at night (about half past eleven). The crash chapter has 9 steps in a row and ends with "The next chapter is in Chapters."

**Other games** (judged from goal text and step tables)

- **Port Royal**: Ned's 1670 story is chapter 2 in the menu but is played inside chapter 1; "Maybe another time" leaves chapter 1 unfinishable. Chapter 1 is marked done as soon as you eat, though goals continue. "Privateer, not pirate" is told 4 times and "22 guns for Morgan" 3 times (a second gunner script sits at `main.js` line 2069). Lines that send you elsewhere: Ned ("Go and see Fort Charles"), Morgan, Grace, and Abba in the camp ("Look around. Then come back to me"). In the camp you can skip all four survivors. The plates thread (Symon hopes someone will find them) has no ending.
- **Hurricane Melissa**: chapters 1 and 2 have the same shape; "The night goes by." is a step where nothing happens; the 18-word end line is over the 12-word limit.
- **Eventide**: chapter 3 is three talks and "Say goodnight to all four ladies", with no task.
- **Bog Walk**: the end is a chain (Miss Grant, the board, Kemar, Miss Grant again, Kemar again) plus 17 quiz steps.
- **Garvey**: chapter 3 is all talk. Chapter 4's sailor leaves and returns for a second talk.
- **Tivoli**: chapters 1, 2, 4, 6 and 8 are each "talk to three people, then walk".
- **The Emperor's Arrival**: about ten fetch-and-give steps before the airport; the arrival is mostly "wait" steps.
- **Windrush**: chapter 1 has six chores before the family's reasons are heard.

## 4. What each task teaches (keep, strengthen, merge, add)

A task with nothing to teach is cut or merged. Everything else stays.

| Game | Verdicts |
|---|---|
| **Nanny Town** | Keep: back trail, take your place, the paper. Strengthen: plant yams (3), learn the horn, look out over the valley, set forked sticks (3), knock on three doors. Keep the "how do we know" game, cut to 4, show the right answer. |
| **Port Royal** | Keep all: stew change, market sum, cargo check, serve a customer, clipped coin, the 4 tavern finds (show all four at once with a count), sword drill, load crates, the letter, the tombstone. |
| **Garvey** | Keep: set type, print the poster, lay out the front page, fact or rumour cards, the Declaration and colours, timeline, shrine question. The ship wheel, bell and whistle stay optional, with a one-line fact each. |
| **Kendal** | Keep: load the mule, pass the bucket, bananas to the wagon, check the brakes, fill a bucket, take Dawn, hold the lamp. Strengthen: the beach (stop the count at 2 of 3). |
| **Bog Walk** | Keep all: notice board, valve wheel, scrape the rust, tram, who came to help, Kemar's cards and the order game (right answer shown). |
| **Eventide** | Keep all: put things back (4), read the letter, radio, hold the gate, blankets, sort cards, flowers. Strengthen: blankets (after the first child the others go faster). |
| **Melissa** | Keep all: buckets, boards and nails, go-bag, family kit, keep away from the wire, hand out blankets and food, logs, canoe, tarp rope, Ready Plan. Merge: "The night goes by." into the night in the hall. |
| **Tivoli** | Add one hands-on moment in a lighter chapter (idea: help paint a mural in chapter 8; join the football or dance club in chapter 3). None in chapters 4 to 6. |
| **Selassie** | Keep: carry the tin, flags to the cart, buy a newspaper, buy tickets, water for Grandma, the waiting cloth, share water. Merge: "Put the newspaper beside the map" into the paper pick-up; "Give Grandma the newspaper" into the buying; "Give the tickets to Mum" into the buying. |
| **Windrush** | Keep: wash water, peg the cloth, crate slat, pack book photo cloth, address, letter and postal order, route card, school bag, advice-table folder. Merge: the cup of water into the route card; the second suitcase carry (Celia's table) into the first; the 1962 repair board (repeats the slat). |

## 5. Sources checked (21 November 2026)

Web summaries plus the repo's own fact docs (`docs/games/*.md`). Full pages were not read, so the journal wording must follow the primary sources listed in each game's doc.

| Fact | Result | How to use it |
|---|---|---|
| Pewter with Symon Benning's mark found underwater at Port Royal | Confirmed. Largest late 17th-century pewter collection ([TAMU thesis 1990](https://oaktrust.library.tamu.edu/bitstream/handle/1969.1/ETD-TAMU-1990-THESIS-G683/1990%20Thesis%20G683.pdf?sequence=1), [Gleaner](https://jamaica-gleaner.com/article/art-leisure/20170917/celebrating-jamaican-heritage), [JNHT](https://jnht.com/site_port_royal_underwater_archaeology.php)). Hamilton spells the name "Simon". | A closing line in the tombstone chapter. Check the Symon/Simon spelling against the thesis first. |
| The stopped watch, 11:43 | In `docs/games/port-royal.md`. Web sources disagree on the year (1959, 1960, 1969). | Say "found by divers", no year. |
| "Pompeii of the New World" | Not verified. | Do not use. |
| Yams planted in hills with a piece of the head | Traditional Jamaican method ([MDPI](https://www.mdpi.com/2071-1050/1/1/81), [Observer](https://www.jamaicaobserver.com/2026/09/30/new-yam-planting-method-expected-boost-yield/)). Yams came from West Africa and were first grown on provision grounds. | Show planting as the Jamaican way. The journal says it is general, not recorded for Nanny Town. |
| Watering yams | No source. | **Do not use the Watering clip** for the Maroons. |
| Yams and plantains at a Windward town | In the repo (Thicknesse 1788, Dallas 1803, about Quao's town in 1739). Nothing specific to Nanny Town. | Unchanged. |
| The abeng and horn signallers | Confirmed: sentries used it and each village had a horn signaller ([JIS](https://jis.gov.jm/information/get-the-facts/the-maroons-and-the-abeng/)). No source for women signallers. | Cubbenah, a man, stays the horn keeper. |
| Nanny's role | Military, spiritual and cultural leader of the Windward Maroons ([Britannica](https://www.britannica.com/topic/maroon-community/The-Jamaican-rebellions)). The leaf cloak and horn signal are tradition. | "Nanny wants" lines about leading and deciding only (see Phase 2). |
| The treaty and the paper | Contested. [One account](https://www.jamaicaobserver.com/news/nanny-opposed-maroon-treaty) says Nanny opposed the treaty and did not sign. The paper is dated 5 August 1740 in the repo; other sources say 1741 or a 20 April 1740 treaty. | In dialogue say only that her people accepted land. Put the disputed parts in the journal's "Dig deeper". |
| Kendal: crash at night on the way home | Confirmed ([National Library of Jamaica](https://nlj.gov.jm/lives-derailed-60th-anniversary-kendal-train-crash/)). Death tolls differ (179 to 187). | The lamp belongs to the night. |
| Windrush families sent money home | Confirmed in general ([Reading Museum](https://readingmuseum.org.uk/node/10906), [Observer](https://jamaicaobserver.com/2022/06/12/jamaica-owes-much-to-its-people-abroad)). Nothing on 1948 postal orders in particular. | Keep the journal line that the letter and postal order are fictional. |

Still open (cannot be checked from here): how Maroons planted at Nanny Town in particular, any recorded Maroon food customs beyond Thicknesse and Dallas, and the exact mechanics of 1948 postal orders. Say "general" or "fictional" in the journal wherever a scene rests on these.

## 6. The work, in order

Work one phase per commit series, build and check before moving on. Phases 1 and 2 matter most.

### Phase 0: Rules and wording

- [ ] Add the 11 story-first rules (Section 1) and a short sourcing rule ("a fact added to a game must be in the game's facts doc with a source, or be marked fictional or general in the journal") to `docs/STANDARD.md`, and a line to the checklist in its section 5.
- [ ] Update `CLAUDE.md` and the game guides where they still call a live game "new" or "early". Do not change anything else in `CLAUDE.md`.
- [ ] Record in `docs/games/nanny.md` that "Nanny wants..." lines are allowed (reported decisions, never a quoted command, journal says "imagined"), and the planting facts from Section 5.

### Phase 1: Shared engine (fix once in `engine/`, then wire each game)

- [ ] **Goal banner.** When the goal changes, show it large in the centre for about 3 seconds, then fold it into the top-left box. Tapping the box shows it again. Put it in `engine/hud.js` (or a new `engine/goal-banner.js`). Respect `prefers-reduced-motion`. Check the layout at 390x800, 667x375, 800x500 and 1280x720.
- [ ] **Shared quiz** (new `engine/quiz.js`). A wrong pick turns red, the right answer lights green with one short line saying why, a short pause, then the next question. Progress line ("2 of 4"). Cut each end quiz to 3 or 4 questions (move the rest to the journal). Move these over: Nanny `sort`, Bog Walk `openSort` and `openOrder`, Eventide `sortCards` and `timeline`, Garvey `answerCard`, Melissa `quiz`, Port Royal's sums. Never a fail screen.
- [ ] **Talk counts.** Move the talk steps of Nanny Town, Hurricane Melissa, Eventide, Bog Walk and Tivoli onto `engine/story.js` so "1 of 3" is added. Keep `?test=flow` at 0.
- [ ] **"Who you are" card** at the start of each game (first chapter only, short, skippable), in the manner of Windrush's chapter intro. Use only words the game's doc already supports, and say the player is fictional where they are. Make the way people address you ("child") match what the card says.
- [ ] **Camera turns to the speaker.** On opening a conversation, ease the view so the person is centred above the dialogue box, and release control when it closes. One function in the engine, called from each game's `startTalk` or `openConvo`. Check the phone layout (the speaker must not be cut off).
- [ ] **Carried items show in the hand** with `createCarry` (`engine/story.js`) for every pick up, carry or place task. Games without it: Nanny (yams, sticks, horn), Melissa (buckets, boards, nails, plates), Eventide (photo, Bible, comb, radio). `?test=held` must stay at 0.
- [ ] **End-of-game recap.** On the final card of each game, show three icons for the three things learned, each tappable to open its journal page. Choose the three per game and write them in the game's `content.js`. It must add no step before the final card.
- [ ] **New audit checks** (rule 8 in `CLAUDE.md`): a lit lamp or lantern held in daylight; a carry task with nothing drawn in the hand; a "talk to several people" goal with no count; a goal or line that sends you back to a person you just left; the same fact told twice in one game; a hidden person visible from the person looking for them.

### Phase 2: Nanny Town (`games/nanny/`)

Read `docs/games/nanny.md` first.

- [ ] **Planting clips.** Four clips came from the owner as Mixamo FBX with no skin (**Plant A Plant**, **Pull Plant**, **Watering**, **Dig And Plant Seeds**; the owner holds the files). Add the ones used to `tools/anims` and ship them for Nanny Town only (as Tivoli does: its own source folder and list, `ANIMS_OUT=build/anims_nanny.glb`; see `docs/PIPELINE.md`). Retargeting needs Blender, which the cloud container lacked. Try `pip install bpy`; if that fails, ask the owner to run that one step and hand back the packed clips. Use:
  - **Dig And Plant Seeds**: Mimba shows you how to plant.
  - **Plant A Plant**: women in the gardens.
  - **Pull Plant**: people lifting yams in chapter 6.
  - **Watering**: **not used** (no source).
  Add the names to `games/nanny/anim-clips.json`.
- [ ] **Yams.** Mimba gives you a basket with yam pieces. A piece shows in your hand (`createCarry`). At each hill the camera dips as if you kneel, the piece goes into the mound and the soil closes over it. The shoot grows later, not at once. Each of the three goes can differ (dig, set, cover) so the repeat adds something. Journal "Dig deeper": yams are planted in hills from pieces of the head, a general Jamaican method.
- [ ] **Forked sticks.** The goal says where they are. You pick one from the pile, carry it (shown in the hand), and set it at a trench. Three times.
- [ ] **Horn.** Show a horn in your hand. Add a "Hear it again" button. A wrong tap plays what the call would have meant. Keep the panel from covering Cubbenah on a phone. Replace the Drink stand-in with a clip that reads as blowing, if one exists, or a still hold.
- [ ] **Doors.** The door opens and a person looks out or answers when you knock.
- [ ] **Nanny on the high rock.** Find why she is missing at stage 24 (`when: [24, 29]`, `far: true`, `refreshCast`, `shown`) and fix it. Hold the camera on her a little longer. Everyone below stops and looks (already scripted).
- [ ] **The valley.** Replace the red blocks with small distant figures in single file.
- [ ] **The narrow path.** Make the soldiers' path from the watch rock look thin (the journal says two people could not walk it abreast).
- [ ] **Phibba hides.** Move her behind the cotton tree's roots, out of sight from where Beneba stands. Add a soft crying sound that gets louder as you near. Keep `?test=audit` at 0.
- [ ] **Phibba scared.** Ship the shared `Scared` clip. Use it while she hides. On the climb she flinches at each cannon shot and stays close. Add a few short lines ("I am scared." "Is it far?" "Hold tight."). Her face is body work and is **not touched**.
- [ ] **The climb.** Phibba walks a short way ahead of you, with Mama ahead of her, so you can always see her (`FOLLOW.phibba`, `engine/follow.js`). Record a stepped walk to measure the jerk, then smooth `camY` and the trail edges. Change the goal to "Climb the back trail with Phibba."
- [ ] **Nanny in the community** (reported decisions, never a quoted command, journal says "imagined"; no sacred acts):
  - Chapter 2: Mimba gives out the garden work and says it is what Nanny has asked.
  - Chapter 3: Cubbenah passes on that Nanny wants the watchers at the rock and the trenches ready.
  - Chapter 4: Nanny seen far off on a ridge during the fight.
  - Chapter 5: Nanny seen far off leading the line up the back trail; Mama starts the climb because Nanny asked everyone to go.
  - Chapter 6: people gather round her under the tree.
- [ ] **Dialogue gaps.** Remove "Now go and find Cubbenah". Give Mama a line or two in chapter 2. Add one line for each time jump (Mama or Quamin). Let the child answer Quamin at the top. Add Mama (or Cubbenah) explaining the paper in chapter 6: land for Nanny and her people, for ever; nothing about whether she signed. Explain why the child may stay at the rock (one "Nanny wants the watchers to stay" line). All lines about 12 words or fewer.
- [ ] **Your work choice matters.** The chapter 2 choice (watch, garden, carry messages) changes the chapter 3 task (watch: the look-out; garden: the sticks; carry: the call).
- [ ] **Chapter 2 walk.** Bring Mimba to the clearing, or move the work choice to Cubbenah, so you do not walk back to her.
- [ ] **Quiz.** "How do we know?" cut to 4, right answer shown, then the "Today" card, the "Why" card and the end card with the recap.
- [ ] **Assist.** A calm assist option for the watchman's road and the horn game (longer to cross, call replayed). Round 2 if time is short.
- [ ] **Review pack** for the Moore Town Maroons (journal pages, the two set pieces, the new "Nanny wants" lines). Rule 7 in `docs/games/nanny.md`. Prepare it; do not send it.

### Phase 3: Small fixes

- [ ] **Kendal lamp.** Keep the lamp in Gran's basket (or the bag) from stage 40 until dusk or the crash. Show it in the hand only from then. `updateLamp` and `story.lamp` in `games/kendal/src/main.js`; the gift scene on the platform stays. Check the day ride shows no lit lamp.
- [ ] **Old Man Idle.** The clip already ships as `OldIdle` (the owner's file is the same motion). Use it for: Old Zeke and Mr Bertie (Bog Walk `cast.js` `zeke`, `bertie`; add `OldIdle` to the idles list; the clip is already in its `anim-clips.json` but never played), Grandpa Winston and Mass Cyril (Melissa `cast.js`), Garvey's "older man" in chapter 3 (`id: 'elder'`, `main.js` around line 710), and Pastor Grant (Tivoli `talk.js` line 19, `pastor`). Keep their usual idle too.

### Phase 4: Per-game trims (merges from Section 4)

- [ ] **Selassie**: fold the three hand-offs into the pick-up or buying step.
- [ ] **Windrush**: merge the cup of water, the second suitcase and the repair board.
- [ ] **Melissa**: merge "The night goes by." into the hall night; give chapter 2 a different task from chapter 1; shorten the 18-word end line.
- [ ] **Kendal**: cap the beach at 2 of 3; shorten the crash chapter's 9-step chain; let it move on by itself instead of "The next chapter is in Chapters."
- [ ] **Bog Walk**: fold the end chain (Miss Grant, board, Kemar, Miss Grant, Kemar) into fewer steps.
- [ ] **Eventide**: give chapter 3 one task.
- [ ] **Garvey**: give chapter 3 one task; let the sailor's second talk happen in one scene.
- [ ] **Quizzes** in Bog Walk, Eventide, Garvey, Melissa and Port Royal move to the shared quiz (Phase 1).

### Phase 5: Port Royal (`games/port-royal/`)

Read `docs/games/port-royal.md` first. It is a long file (`main.js` over 2,000 lines).

- [ ] Put the chapters in the order they are played, and let "Maybe another time" with Ned still end chapter 1.
- [ ] Mark chapter 1 done only when its last goal is done.
- [ ] Tell "privateer, not pirate" once and "22 guns" once. Delete the second gunner script (`main.js` around line 2069).
- [ ] Remove the lines that send you to someone else (Ned, Morgan, Grace, Abba in the camp). The goals do that job. Drop the "come back to me" in the camp.
- [ ] Add a count "Talk to the survivors: 0 of 4" in the camp.
- [ ] Tavern finds: show all four at once with a count, with a short walk between them.
- [ ] Add a closing line to the tombstone chapter about the underwater town and the pewter with Benning's mark (Section 5). Add the source to the game's facts doc.
- [ ] One line on a title card saying why Galdy is at the harbour on 7 June 1692, if a source supports it.
- [ ] Do not commit a dev build of `games/port-royal/site/app.js` (see `docs/TODO.md`).

### Phase 6: Hands-on additions

- [ ] Tivoli: one hands-on moment in chapter 3 and one in chapter 8. Read `docs/games/tivoli.md` first. Nothing in chapters 4 to 6.
- [ ] Hurricane Melissa chapter 2: a different hands-on task from chapter 1.

### Round 2 (after round 1 is live)

- [ ] Hidden finds: 3 to 5 small things per game with a one-line fact and a count in the journal. Optional, never required.
- [ ] Read-aloud: a "listen" button on dialogue using the device's own voice. Check it on a phone first.
- [ ] A journal reward screen ("You found 18 of 23 pages") on the final card. It must not add a step.
- [ ] Nanny Town assist settings (if not done in Phase 2).

### Blocked or waiting

- **Seeing your own character** (a shared third-person view like Port Royal's) waits for the bodies and clothes work in the other branch.
- **Blender** for the planting clips (Phase 2).
- **Moore Town review** before the Nanny Town changes are called final.

## 7. Checking (every phase)

Follow `docs/TESTING.md`. For each game you touch:

1. `node tools/build.mjs <game> --dev`, serve the repo root, and take phone-size screenshots (390x800, and 667x375) of everything that changed.
2. `?test=audit`, `?test=held`, `?test=layout` all report 0. Also `?test=flow`, `?test=ambient`, `?test=walkers` and `?test=follow` where the game has them.
3. Run the autoplayer through every chapter (`?auto=1`, add `&one` for a single chapter) at 390x800. It must reach `ALLDONE` with no page errors.
4. `node tools/lint_content.mjs` (and `--ci`) must report no new findings. `npm test` must pass.
5. Time each chapter by playing it, before and after. Write the numbers here.
6. Build the public version (`node tools/build.mjs <game>`, no `--dev`) to confirm no test code ships.
7. Update the game's guide and `docs/STANDARD.md`'s status table. No em dashes.

Note from earlier runs: the Nanny Town full check suite (`?test=all`) did not finish in 14 minutes inside the cloud container (software rendering). Run the single checks, or run the full suite on a real machine.

## Progress and next steps (22 November 2026, PR #147)

Done in PR #147: Phase 0; from Phase 1 the goal flag and banner, the smaller Journal button, the shared quiz and `showRight`, the talk camera, talk counts (Nanny, Melissa, Eventide), the "Who you are" card (all but The Emperor's Arrival and Tivoli; Windrush already had one), "The End" and the three-picture recap on every game's last card, and Port Royal's view switch turned off.

Next, in this order:

- [ ] **Windrush stairs (owner, 22 November 2026).** In the 2018 house (`home18`, the "scandal" recap picture) the stairs run into the ceiling. Cut an opening in the ceiling above them so they lead up, and add a handrail and banister. Then retake `games/windrush/site/recap/scandal.jpg`.
- [ ] **Recap pictures to improve.** Tivoli `today.jpg` should show the murals (three angles from the chapter start missed them); The Emperor's Arrival `airport.jpg` is an almost empty apron. The capture script started each chapter from the Chapters book (Unlock All), hid the HUD and took a 640x400 JPEG at quality 72.
- [ ] **Autoplayers still to confirm** after the quiz changes: Melissa (`?auto=1`; its runner clicked Exit on the last card), Bog Walk (`?auto=all`), Port Royal (needs a dev build; restore the public `app.js` afterwards). Confirmed `ALLDONE`: Nanny Town, Eventide, Garvey, Kendal, Tivoli.
- [ ] **"Who you are"** for The Emperor's Arrival and Tivoli (Tivoli has no "you" page yet; read `docs/games/tivoli.md` first).
- [ ] Phase 1 left: carried items in the hand (Nanny yams, sticks, horn; Melissa; Eventide) and the new audit checks. Then Phase 2 (Nanny Town) onwards.
