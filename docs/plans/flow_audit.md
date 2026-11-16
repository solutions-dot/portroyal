# Story flow audit: who moves the story, the hint arrow, and visible tasks

Read-only audit of `games/port-royal`, `garvey`, `kendal`, `bog-walk`, `nanny`, `eventide`, `melissa` and `tivoli`, against the owner's three new rules. Done on 15 November 2026 from the code on the working tree (branch as checked out, commit `7a62fdf`). No repo file was edited. Line numbers are `file:line` in each game's `src/`.

**Unified delay follow-up (16 November):** all ten games now target **2.5 seconds** for both ordinary and exploration guidance. The shared `engine/story.js` default and exploration delay are both 2500 ms; Tivoli and the six legacy controllers use the same value, while Kendal, Windrush and Selassie use the shared story engine. `tests/guidance-delay.mjs` checks the ten integrations and the engine's timing. This is a source-level change; gameplay and visual verification remain pending.

**Required-target selection follow-up (16 November):** Nanny, Melissa and Eventide now choose the nearest currently unfinished, stage-marked story conversation before considering available actions; Bog Walk was updated earlier. Existing special route overrides (Nanny climb, Melissa stage 51, Eventide gate/veranda) remain in place. This is not a full need-by-need migration: action-first story steps and all stage transitions require replay to check that the target remains correct. Other games still require the same audit.

**Required-person targeting checkpoint (16 November):** Garvey now selects the nearest unfinished person from its stage-specific `TALK_TARGETS` before considering other available actions. With the earlier Bog Walk, Nanny, Melissa and Eventide changes, five legacy controllers now use required-conversation-first targeting. `tests/guidance-target-priority.mjs` guards their source ordering. This is not a substitute for testing each stage's true action/conversation dependencies.

**Garvey objective progress follow-up (16 November):** multi-person story goals now display live `(n of total)` completion counts, refreshed after each finished required conversation and reconstructed when loading a saved stage. The target continues to select only unfinished required people. Source regression `tests/garvey-goal-progress.mjs` added; real chapter playback remains unverified.

**Guidance logic test checkpoint:** added behavioral tests for the shared story engine: nearest unfinished required need, exclusion of optional actions, immediate retargeting after completion without another 2.5-second wait, and ordered needs overriding proximity. These tests exercise the engine in isolation, not the per-game stage tables or rendered arrows. Full browser walkthroughs remain necessary.

**Near-target stability fix:** seven legacy guidance controllers (Port Royal, Garvey, Bog Walk, Nanny, Melissa, Eventide and Tivoli) now check that the player is outside the interaction radius *before* activating an arrow. Previously they could reopen the goal and restart the arrow animation on every frame while standing at the target. Added a source regression to `tests/guidance-delay.mjs`. Browser verification still pending.

**Timing unit audit (16 November):** Bog Walk's `nudgeTick` receives elapsed seconds and correctly uses `2.5`; the other six legacy controllers receive milliseconds and use `2500`. The earlier guidance-delay regression incorrectly expected milliseconds for Bog Walk and has been corrected. Shared `ARROW_LIMIT` and `ARROW_LIMIT_EXPLORE` are both 2500 ms. Browser timing verification remains pending.

**Chapter-by-chapter data checks (16 November):** `tests/chapter-guidance.mjs` now checks every declared stage in Kendal, Selassie and Windrush: visible goal, required IDs and counts, stage transition references, and simulated completion of all required tasks. It also checks the chapter goal tables, required-talk lists and declared talk-stage transitions in Nanny, Melissa, Eventide and Bog Walk. These checks cover seven games' data tables; they do not yet validate the dynamic stages of Port Royal, Garvey or Tivoli, or demonstrate browser/mobile playthroughs. Tests are committed but runner results are not confirmed.

**Ten-game structural chapter coverage:** expanded `tests/chapter-guidance.mjs` to include Garvey's goal/required-talk/next-stage mappings, Tivoli's seven walking-chapter conversation orders, and Port Royal's goal-driven guidance controllers. All ten games now have at least structural coverage, but Port Royal and Tivoli are only lightly covered and no browser/mobile chapter walkthrough has been verified. Do not treat this as completion of the full playthrough request.

### Follow-up: always-visible next task (16 November 2026)

The owner selected **Bog Walk's guidance pattern as the target for all ten games**: a plainly written next task that stays readable, a gold world arrow to the current required destination, and a nearby talk/action control that takes over when the player arrives. The task should change immediately when a requirement is completed, and optional activities must not override a required step.

**Implemented on draft PR #101:** Port Royal, Garvey, Kendal, Bog Walk, Nanny, Eventide and Melissa no longer auto-collapse the current goal into the word "Goal" after 6.5 seconds. Tivoli now uses the same 2.5-second movement-independent world-arrow delay as the other legacy games; the previous pass did this for Port Royal, Garvey, Bog Walk, Nanny, Eventide and Melissa. Bog Walk now prioritizes marked required story people over optional actions.

**Not yet equivalent:** Kendal uses the shared story engine's target timing; Windrush and Selassie have their own hint implementations and still require comparison to Bog Walk's positioning and task selection. Across the series, the target selector must be validated against **unfinished required needs**, not merely the first available action or any NPC. Bog Walk's `placeNudge` avoids text/button collisions, but that exact placement algorithm has **not** been ported into all games. Tivoli's stage-specific target coverage and all chapter transitions need a browser walkthrough.

**Acceptance checks before closing this request:** (1) the current task remains visible during play; (2) 2.5 seconds after a new ordinary task, a correctly routed arrow appears without requiring the child to stop moving; (3) completing a task immediately selects the next required task; (4) optional people/actions cannot steal guidance; (5) the arrow hides for dialogue and panels and does not cover on-screen controls; (6) arrival exposes a usable talk/action control; (7) all chapters of all ten games are replayed on desktop and mobile. These checks are not yet verified.

## Implementation checkpoint: 16 November 2026 (draft PR #101)

This is a follow-up to the read-only audit below, not a replacement for its findings.

- **Guidance timing changed in six legacy game controllers:** Port Royal, Garvey, Bog Walk, Nanny, Eventide and Melissa now start the hint after 2.5 seconds of eligible gameplay rather than waiting 15 seconds motionless or 50 seconds since the goal changed. Movement no longer restarts that timer. The hint remains suppressed during blocked UI states such as dialogue and cards. Existing route/placement callbacks were left intact.
- **Bog Walk objective priority:** required marked conversations are selected before currently available actions. This specifically addresses the ruins information board stealing the arrow from Kemar/Miss Grant at stages 62-65. It needs an in-browser replay to confirm the stage progression and that action-first stages still behave correctly.
- **Kendal:** already migrated to the shared story guidance machinery; its existing implementation was not changed in this pass. **Tivoli:** no targetable hint arrow was added. **Windrush and Selassie:** their guidance implementations were not changed in this pass.
- **Remaining work:** source-based stage need mapping (not simply "any marked person"), immediate retargeting after each completed need, exploration-specific 5-second timing, stage count text, Tivoli's arrow and speech marks, and the wrong-direction dialogue lines in the audit. Avoid describing these as resolved.
- **Verification:** source edits committed; full game builds, visual checks, per-chapter autoplay and mobile arrow placement remain pending. Re-run the documented Bog Walk ruins reproduction before closing its mis-target issue. The legacy audit below records its original 15/50-second behaviour and is historical.

## How I checked

- Read every game's goal table, stage machine, talk code (first talk and later lines), actions, speech marks and helper arrow.
- Built three dev builds (`melissa`, `nanny`, `bog-walk`). The build writes only `site/app.js` and the copied `site/models/anims.js`, which are both git-ignored. (The modified model files that `git status` shows under `games/bog-walk/site/models` and `games/kendal/site/models` were changed before my builds, by the other agent.)
- Ran in headless Chrome with Playwright, one browser at a time:
  1. Melissa, standing still after Start: the arrow first showed **20.6 s** after the goal appeared.
  2. Melissa, walking back and forth in 4 s bursts: the arrow first showed **34.1 s** after the goal.
  3. Melissa `?auto=5&one`: confirms the chapter 5 order (50, 51, 52, 53, 54, 55).
  4. Nanny `?auto=2&one`: confirms Mimba, then Cubbenah, then Mimba again (stages 22, 23, 24).
  5. Bog Walk `?auto=ch5&one` with a probe of which actions are "on": at stages 62 and 65 the only action "on" is "Read the information board", and the autoplayer (which picks targets the same way as the arrow) opened the board card again at stages 62, 63 and 64 before talking to Kemar or Miss Grant.
- Everything else below is from the code. Where I say "not run" I could not confirm it in a browser.

## What every game shares today (read this first)

**The hint arrow is the same copied block in seven games** (Tivoli has none):

| Game | Code | Delay | Target |
|---|---|---|---|
| Port Royal | `main.js:794-845`, timer `main.js:834` | 15 s standing still, or 50 s since the goal changed | `NUDGE_MAP` (goal regex to action label or point), `main.js:795-800` |
| Garvey | `main.js:545-570`, timer `main.js:557` | 15 s / 50 s | first action that is on, else nearest untalked `TALK_TARGETS` person (`main.js:546-549`) |
| Kendal | `main.js:557-575`, timer `main.js:569` | 15 s / 50 s | `NUDGE_EXTRA`, else first action on, else nearest untalked target (`main.js:559-562`) |
| Bog Walk | `main.js:476-500`, timer `main.js:497` (in seconds) | 15 s / 50 s | first action on, else nearest marked person (`main.js:478-481`) |
| Nanny | `main.js:623-640`, timer `main.js:636` | 15 s / 50 s | `NUDGE_EXTRA`, else first action on, else nearest target |
| Eventide | `main.js:464-490`, timer `main.js:478` | 15 s / 50 s | first action on, else nearest target, routed through the gate and up the steps (`main.js:465-471`) |
| Melissa | `main.js:604-625`, timer `main.js:616` | 15 s / 50 s | `NUDGE_EXTRA`, else first action on, else nearest target (`main.js:606-608`) |
| Tivoli | none | never | none |

How it behaves, in every one of those seven:
- It only counts while "quiet" (no talk, card, cut-scene or fade). After a talk, `NUDGE.since` is pulled to at most 30 s ago and `NUDGE.still` to now, so after every conversation the 15 s wait starts again.
- Moving more than 0.6 m resets the 15 s timer. A child who wanders (the child who most needs help) gets no arrow until 50 s after the goal appeared.
- Any change of goal text resets it, including a count going up ("Loaded: 1 of 3" to "2 of 3"), so each step of a counted task waits again.
- It switches off within 2.2 m of the target (2.4 m Bog Walk, 1.6 m Eventide) and the timers restart, so in a stage with three people the arrow waits 15 s again before it points at the second.
- Measured in Melissa: 20.6 s standing still, 34.1 s while walking. **No game meets rule 2 (2 to 3 s, up to 5 s for explore steps).** The only place that does is the Bog Walk Tube's "This way / Turn around" cue in the rise and dark phases (`bog-walk main.js:755`), which shows at once.
- Picking "the first action that is on" before any person means an optional or left-over action can steal the arrow from the story person (Bog Walk ruins and Melissa chapter 5, below). The autoplayers pick targets the same way, so they cannot catch this.

**Speech marks.** Every game except Bog Walk and Tivoli puts the same glowing gold mark over every person (and, in Port Royal, over every "Talk to" action within 16 m): Port Royal `main.js:1897-1918`, Garvey `main.js:533-536`, Kendal `main.js:206-216`, Nanny `main.js:212-215`, Eventide `main.js:234-237`, Melissa `main.js:209-212`. Story people and flavour people look the same. Bog Walk marks only the people the current stage needs (`markWanted`, `bog-walk main.js:356-360`); it is the only game that already does this. Tivoli has no marks at all, only a "Talk to <name>" button within 2.8 m (`talk.js:25-30`).

**Who moves the story.** Garvey, Kendal, Bog Walk, Nanny, Eventide and Melissa use `TALK_TARGETS[stage]`: the stage moves on when every listed person has had their first talk (`onTalked`), in any order. Anyone not listed gets one short `LATER` line and cannot advance the story. So flavour people cannot advance the story in those six games. But:
- No multi-person talk stage shows a count, except Bog Walk stage 20 ("Talk to Mr Bertie, the woman and the conductor: 1 of 3").
- `LATER` lines are mostly not stage-aware, so a person needed later, met early, says something that assumes you have met, or sends you ahead ("first" lines below).
- In Kendal and Garvey, flavour people's full first talks are never shown, because `startTalk` only plays `TALK` for a current target (Kendal `main.js:299-301`): for example Kendal's `lady`, `guard`, `pearl`, `guardNight` have `TALK` entries that cannot be reached.

Port Royal has no `TALK_TARGETS`: each chapter's goal is a chain of `if`s (`setGoal`, `main.js:605-614`; `wareGoal` `main.js:1025`; `afterGoal` `main.js:965`; `fbGoal` `main.js:1707`). Tivoli's chapter 1 advances on any talk and names the next person from a fixed `ORDER` (`ch1.js:16`).

**Held items.** NPC carried things use `engine/grip.js` in Kendal, Bog Walk, Eventide, Melissa and Nanny; Garvey imports only `spreadArms` and `gripTick` (no one holds anything); Port Royal still places items from hand bones by hand (Kofi's crate between his hands, `kofiBox`, `main.js:512`, and the flashback carrier, `main.js:1635`); Tivoli has its own weapon code. Things the **player** carries are a separate matter: there is no shared "held item" slot, and only Port Royal's crate (`main.js:1727`), Kendal's lamp (`main.js:324`), Melissa's torch (`main.js:321`) and Bog Walk's torch hand (`hand.js:70`) are drawn in the player's hand. Everything else the player "carries" is only a toast.

---

## 1. Port Royal 1690

**Marks and arrow.** Gold mark over every "Talk to" action (`main.js:1911-1918`); Abba also has a gold ground ring until you first talk to her (`main.js:471`, `537`). Arrow: `NUDGE_MAP` rows (`main.js:795-800`), 15 s / 50 s (`main.js:834`), routed out of the side street by `nudgeStep` (`main.js:811`).

| Chapter | Steps (goal text) | Redirects and loops | Required tasks and how they show | Other |
|---|---|---|---|---|
| 0 Arrival (1690) | pier, find Abba, tavern, ask for stew, find 4 things (count), talk to Ned, walk to Fort Charles (`main.js:605-614`) | Will (flavour, tavern): "Ask old Ned. He was really there." (`main.js:1522`). Grace (flavour): "Go and see the turtles by the water. Peter will show you." (`main.js:1244`) | Stew appears on the table (`main.js:662`, `stew.visible`). The 4 finds vanish when found, count in goal. Good. | Ned can be talked to at any time, so his story can come before the finds; harmless. |
| 1 Ned's story (1670) | "Find Admiral Morgan on the pier" (`main.js:1623`), then quartermaster and sword drill, then 3 crates | Goal "Talk to the quartermaster. Then watch the sword drill." (`main.js:1707`) implies an order that is not enforced. (The older Morgan talk, "Now go and watch the sword drill. Then help load the ships." and "Still here? Go and watch the sword drill!", `main.js:1617` and `1630`, is dead code: those actions are removed at `main.js:1706` and replaced by the question card.) | **Hidden count:** Morgan's hub needs 3 of 5 questions before the story moves (`main.js:1675-1677`); "Goodbye for now" leaves the goal unchanged, with no count. Crates: held crate on the camera (`main.js:1727`), crates appear in the boat (`main.js:1733`), gold rings at pile and boat, count in goal. This is the best carry task in all eight games. | Quartermaster plus drill (2 things) has no count. |
| 2 Warehouse (1691) | check 3 cargoes, sit at desk, talk to Abba, read the letter (`main.js:1025`) | none | Cargo markers vanish when looked at (`main.js:644`), but the goal has **no count** ("Check today's cargo: the casks, the sacks and the red wood."). Abba appears at the door (`main.js:645`). | |
| 3 Earthquake (1692) | walk to harbour, run, sand, swim to the boat with the gold marker | none | Gold marker on the boat. | "Run! Get away from the houses!" and "The sand is pulling you down!" have no `NUDGE_MAP` row (timed phases, so no arrow is needed). |
| 4 The days after | "Find Abba in the camp." then "Look around: the big tent, and the edge of the water." then "Go back to Abba." (`main.js:965`) | **Loop.** Abba: "Look around. Then come back to me." (`main.js:186`), then the goal "Go back to Abba." Worse: the tent and the water can be looked at before you meet Abba (`main.js:650-651`); then Abba still says "Look around. Then come back to me." and you must talk to her a second time at once (`main.js:649`). | Tent and water: journal page only, **no count**. | |
| 5 The tombstone | "Find the tomb beside the church." | none | Gold ring at the tomb (`main.js:1012`). | |

**Fixes.** Chapter 4: make the tent and the water the step, with a count ("Look around: 1 of 2"), and play `AFTER2` and the stay-or-go card from the second look (Abba walks over), or let Abba's first talk be `AFTER2` when both are already seen. Chapter 1: show "Ask Morgan: 1 of 3" on the hub card and in the goal; goal "Talk to the quartermaster and watch the drill: 0 of 2". Chapter 2: add "Checked: 1 of 3". Make Will and Grace say flavour only (no names of other people).

## 2. Marcus Garvey

**Marks and arrow.** Same gold mark over every person (`main.js:533-536`). Arrow `main.js:557`, target `main.js:546-549`. Goals `main.js:378-385`, `TALK_TARGETS` `main.js:386`.

| Chapter (stages) | Steps | Redirects and loops | Tasks and visuals |
|---|---|---|---|
| 1 Print shop (0 to 3) | printer and customer, set the type, printer has news | Printer's later line at stage 1: "I have work to do. Come back soon." (`main.js:255`); then stage 2 sends you back to him. Mild A, task, A. | Type setting is a panel; nothing in the room changes afterwards (weak). |
| 2 Meeting hall (10 to 14) | Amy and Garvey, print the poster, welcome 3 neighbours, listen to Garvey | Amy: "Please talk to Marcus Garvey too." (`main.js:626`); Garvey: "Please talk to Amy Ashwood too." (`main.js:631`). Both are current targets, so this is a reminder; a count would do it better. | Poster appears on the wall (`showPoster`, `main.js:617`). Good. "Welcome the three neighbours" has no count. |
| 3 Street corner (20 to 23) | worker, woman, older man; Garvey; the older man again | **Loop:** the older man (`critic`) is a stage 20 target, Garvey is stage 21, then "The older man has a question. Talk to him." (stage 22). | Talks only. No count at 20. |
| 4 Press room, Harlem (30 to 34) | pressman and Garvey, lay out the page, sailor, weeks later sailor and pressman | At stage 32 the pressman (not a target) says "The sailor is by the door. Talk to him." (`main.js:803`) and Garvey says "Our paper must travel. Talk to the sailor." (`main.js:806`): non-story people sending you on. | Page on the wall and bundles by the door change with the choice (`arrangePress`, `main.js:768-770`). Good. |
| 5 Dock (40 to 44) | Garvey, clerk, engineer (any order); look the ship over; Garvey; friend | **Error-like line:** Garvey's first talk ends "Talk to the clerk and the engineer first." (`main.js:874`) even when you have already talked to both. Stage 43, Garvey (not a target): "A friend of yours is waiting to talk to you." (`main.js:875`). | Ship inspection is a panel; nothing changes on the dock (weak). No count at 40. |
| 6 Liberty Hall (50 to 54) | welcome 3 visitors, steward (choose who to help), read the Declaration, Garvey | **Error-like lines:** the steward at stage 50 (needed at 51): "Please talk to the three visitors first." (`main.js:962`). Garvey at stages 50, 51 and 52 (needed at 53): "Please read the Declaration first." (`main.js:965`), even before the Declaration is the task. The steward's welcome lines (with `unlock: 'convention'`, `main.js:961`) can never play. | **Choice not shown:** after you pick who the steward helps, nobody moves: the traveller does not sit, the nurse does not leave, the sheets do not appear. The nurse talks about her heavy basket (`main.js:951`) but no basket is drawn. Banner colours do show (`showBanner`, `main.js:931`). |
| 7 Amy's desk (60 to 64) | Amy, sort the news cards, Amy, read the letter | Amy, cards, Amy: mild A, task, A (the cards are at her desk). | Panels only; no change on the desk (weak). |
| 8 The park today (70 to 74) | guide and student, timeline board, student, answer | Student: "I have a big question for you soon." (`main.js:1132`), fine. Guide, board, student: mild. | Panels only (weak). No count at 70. |

**Fixes.** Replace the three "first" lines with flavour lines until the person's step ("Welcome! Have you met our visitors?" is still a redirect; better "The convention lasts all month."). Garvey at 40: drop "first" or say it only when `!byId('clerk').talked || !byId('engineer').talked`. Make pressman and Garvey flavour at 32 and Garvey at 43. Add counts to stages 0, 10, 12, 20, 30, 33, 40, 50, 70. Show the steward walking to the person you chose, and give the nurse a basket with `grip`. Chapter 3: let the older man ask his question at the end of the Garvey talk (`convo` forced), so you do not walk back.

## 3. Kendal 1957

**Marks and arrow.** Same gold mark over every person (`main.js:206-216`). Arrow `main.js:569`, target `main.js:559-562`, `NUDGE_EXTRA` only for stage 12. Goals `content.js:17-57`, targets `content.js:59`, later lines `content.js:326-360`.

| Chapter (stages) | Steps | Redirects and loops | Tasks and visuals |
|---|---|---|---|
| 1 Road (10 to 14) | Dudley, Cleo, traveller; load the mule (3); walk to the poles; surveyor | Dudley ends the mule talk with "Walk to the end of the road. Ask the men with poles." (`content.js:101`): he is the story person, fine. | Load the mule: goods arc onto the mule, the mule dips, count in goal (`main.js:445-449`). Good. No count at 10. |
| 2 First train (20 to 25) | Dudley, boy, clerk; look at the engine; climb aboard; ride; pass the water bucket (3); ride back | none | **Water bucket (stage 23): no bucket is drawn**, only a toast "Passed 1 of 3" and a sound (`main.js:417`). **Stale goal:** `GOALS[23]` is overwritten during the stop and restored only if the stop finishes (`main.js:458-459`); leave or restart during the stop and the next play of stage 23 shows "Help the water boy. Pass the bucket: 0 of 3." before the train has moved. No count at 20. |
| 3 Hill station (30 to 35) | Gordon, Abel, Ezra, Ruby; carry 4 banana bunches; train arrives; Abel again; check 3 brakes | Abel is a stage 30 target and again at 33 ("Talk to Mr. Abel about the brakes."): mild "go back to Abel". | **Banana bunches are not carried**: tapping at the pile hides one there and shows one in the wagon at once (`main.js:419`), so "Carry" never happens. **Brakes: no visible change**, toast only (`main.js:420`). Counts shown for both. No count at 30. |
| 4 1957 day (40 to 45) | Gran, Lloyd, Ezra (gives lamp); walk to the last coach; ride; beach 2 of 3; Gran | Gran again at 44, after the beach: a new scene, mild. | Lamp given as a toast only; it is drawn in your hand only at the crash site (`updateLamp`, `main.js:323`). Sandcastle grows (good). **Splash: toast and sound only.** Count shown. No count at 40. |
| 5 Night train (50 to 53) | Gran, Lloyd, mother; look out of 2 windows; sit with Gran; the crash | none | Windows turn your view (good). No count at 50. |
| 6 Crash site (60 to 67) | Gran and Clive; water to the nurse (2); Dawn; take her to the calling place; hold the lamp up; morning; Gran and Clive | Goal 60 "Stay close to Gran. Then talk to Mr. Clive." (`content.js:45`) but Gran is a required talk too, and "Then" suggests an order that is not needed. Clive (not a target at 61): "The pipe is by the road." (`content.js:352`), a hint, fine. | **Bucket: no bucket in your hand** between "Fill the bucket" and "Give the water to the nurse", toast only (`main.js:433-434`). Dawn follows you (good). Lamp raised in your hand (good). |
| 7 Memorial today (70 to 74) | Joy and Andre; storyboard and monument (2); flower; Andre | Andre again at 73: mild. | Flower is laid visibly (`main.js:551`). Good. No count at 70. |

**Child would read as an error.**
- Dawn stands crying, with a talk mark, from stage 60 (`places2.js:133`), but only says "I want my mama." until stage 62. Hide her or leave her unmarked until her step.
- The nurse thanks you before you have brought anything: "Thank you, child. Keep it steady." (`content.js:353`).
- Goal 67 "You have finished the chapter. Read the next card." stays after you choose "Stay here" on that card (`main.js:543-545`), and the card cannot be opened again except from Chapters.

**Fixes.** Draw a bucket on the camera (like the lamp) for stages 23 and 61; carry a bunch in your hands from pile to wagon with an action at the wagon; turn each brake handle when checked; add a splash. Add counts to every multi-person talk stage. Reword goal 60 to "Talk to Gran and Mr. Clive: 0 of 2." Save the stage 23 goal in a variable, not in `GOALS`.

## 4. Bog Walk 1904

**Marks and arrow.** Marks only on people the current stage needs, plus an eye on the four "see" people at stage 51 (`main.js:356-360`). Unmarked people still answer with a later line. World arrow `main.js:497` (15 s / 50 s). Tube: no arrow in the work phase; the "This way" cue shows at once in the rise and dark phases (`main.js:755`).

| Chapter (stages) | Steps | Redirects and loops | Tasks and visuals |
|---|---|---|---|
| 1 Station (10 to 16) | Rudy, Bass Henry, Old Zeke, notice board, Zeke at the valve, hold to turn | **A chain of four redirects.** Rudy: "Go and see Bass Henry. He leads the gang." (`content.js:56`). Henry: "Old Zeke is in the turbine house. Go and see." (`content.js:63`). Zeke: "Go and look at the notice board by the door." (`content.js:70`). Then back to Zeke at the valve (stage 14). **Out of turn:** Henry and Zeke are standing there from the start (`places.js:447-448`), and their later lines send you ahead: Henry at stage 10 "Zeke is in the turbine house." (`content.js:140`), Zeke at 10 or 11 "The board by the door shows the water's journey." (`content.js:141`), and the board does nothing until stage 13. | Notice board puzzle changes the board picture (`main.js:573`). Valve wheel turns and the hum fades (good). |
| 2 Kingston 1899 (20 to 24) | Mr Bertie, the woman, the conductor (count shown); doors; climb on; ride | none | The only multi-talk stage in any game with a count. Good. |
| 3 Inside the Tube (30, 31) | scrape the rust patches (count) | none | Patches visibly clean. **But** 7 s after the start the goal changes to "Walk down the pipe. Look for the rust patches." (`main.js:150`) and the count is gone until the first patch is done. No arrow to the patches. |
| 4 The water (40, 41) | look at the floor, go to the manhole, head for the light | none | Immediate "This way / Turn around" cue (good, meets rule 2). |
| 5 Morning yard (50 to 55) | Rudy, look at 4 helpers (count), reporter, Ivy at the gate, train | Reporter (needed at 52), met at 50 or 51: "Only what you saw. That is what I will print." (`content.js:146`) before you have talked. | Count and eye marks for helpers (good). Reporter sort is a panel. |
| 6 Ruins today (60 to 65) | Miss Grant, information board, Kemar, Miss Grant, Kemar | **Ping-pong loop:** Grant "Go and read the information board." (`content.js:118`), then Kemar (62), then Grant again (63), then Kemar again (64). **Confirmed by run:** "Read the information board" stays on from 61 to the end (`main.js:577`: `on: () => stage === 61 \|\| stage >= 62`), and the arrow and the autoplayer pick actions before people, so at stages 62, 63, 64 and 65 the arrow points at the board, not at Kemar or Miss Grant. | Board, sort and order are panels. |

**Fixes.** Ruins: make the board `stage === 61` only (or exclude done or optional actions from the arrow), and run Kemar's question, the "what came after" order and Kemar's last question as one sitting with the class standing together. Station: make Rudy, Henry and Zeke one stage "Meet the gang: 0 of 3" in any order, and give Henry and Zeke later lines that do not send you on. Keep the count in the Tube goal.

## 5. Nanny Town 1734

**Marks and arrow.** Same gold mark on every person (`main.js:212-215`). Arrow `main.js:636`; `NUDGE_EXTRA` leads you along trails (`main.js:625`). Goals `content.js:17-50`, targets `content.js:54`.

| Chapter (stages) | Steps | Redirects and loops | Tasks and visuals |
|---|---|---|---|
| 1 Night road (10 to 15) | Mama and Quamin; follow Quamin; cross the road; stream and hill; Quamin at the top | **Invisible wall with a "first" toast:** walk up the trail before both talks and you are pushed back with "Talk to Mama and Quamin first." (`content.js:258`, used at `main.js:460`). | Follow and lantern-crossing are shown well. No count at 10. |
| 2 Hill town (20 to 25) | climb; Mimba, Cubbenah, Beneba; plant 3 yams; learn the horn; Mimba | **Loop, confirmed by run:** Mimba after the yams: "Now go and find Cubbenah. He has the horn." (`content.js:112`), goal "Go to Cubbenah and learn the horn." (`content.js:27`), then "Talk to Auntie Mimba." (`content.js:28`). Mimba also says at 21 "Come and help me plant, later." (`content.js:93`). | Yam vines appear (good). Horn is a mini game. No count at 21. |
| 3 Watch rock (30 to 35) | Quamin and Cubbenah; look out; pass the horn call; 3 forked sticks; Mama | none | Sticks appear in the trenches (good). No count at 30. |
| 4 Narrow path (40 to 44) | Cubbenah; take your place; blow the call; Cubbenah and Mama | Cubbenah again at 43, after the fight: mild. | Set piece. No count at 43. |
| 5 Guns in the night (50 to 56) | Mama; wake 3 houses; Beneba; find Phibba; take her to the back trail; Mama on the ridge | Back trail blocked before stage 54 with "Not yet. People here still need you." (`main.js:487`). | **Doors: nothing visible**, only a knock and a toast that says "Feet on the floor. A door opens." (`content.js:296`, `main.js:438`). Phibba follows you (good). |
| 6 The paper (60 to 64) | Mama, Cubbenah, Beneba; the paper; Beneba's game; last question | Beneba: "Do you want to play again? Ask me." (later line), fine. | Paper card. No count at 60. |

**Fixes.** Chapter 2: plant yams after the horn, or let Mimba walk to the horn spot and ask "What work would you like?" there (or have Cubbenah ask it), so there is no walk back. Chapter 1: let Quamin call "Wait for us!" and stop you gently, or start the walk after the first talk. Doors: open a door and show a person in each doorway. Add counts to 10, 21, 30, 43, 60.

## 6. Eventide 1980

**Marks and arrow.** Same gold mark on every person (`main.js:234-237`). Arrow `main.js:478`, routed through the gate and up the veranda steps (`main.js:465-471`). Goals `content.js:18-56`, targets `content.js:57`, later lines `content.js:231-252`.

| Chapter (stages) | Steps | Redirects and loops | Tasks and visuals |
|---|---|---|---|
| 1 Slipe Pen Road (10 to 14) | Gran; gateman; Miss Iris; read the letter | Miss Iris met early: "I know that step. Hello again." (`content.js:234`) before you have met her. | Letter card. Fine. |
| 2 Inside the ward (20 to 23) | Hyacinth, Maude, Dora; put 4 things back (count); nurse | none | **Carrying not shown:** "Pick up the next thing" hides the item on the table and shows only a toast; nothing is in your hand until it reappears by the bed (`main.js:409-410`). Placed items do appear (good). No count at 20. |
| 3 Goodnight (30 to 33) | radio; nurse; say goodnight to all four | Nurse later: "Say goodnight to all four, now." (`content.js:239`), fine. | **"Say goodnight to all four ladies." has no count** (`content.js:30`). |
| 4 The night (40 to 46) | Gran; firefighter; hold the gate; 3 blankets (count); nurse and two ladies; Gran in the morning | **Hidden requirement:** goal "Look for the ladies. Talk to the nurse." (`content.js:36`) but the stage needs the nurse, Hyacinth and Maude (`content.js:57`); the nurse says "Miss Hyacinth and Miss Maude are just there. Go to them." (`content.js:160`). No count. Gran again at 45 (new morning, mild). | **Gate:** "Hold the gate open" plays a camera move; the gates do not move and you are not shown holding them (`main.js:439-446`). Blankets appear on the children (good). |
| 5 Day of mourning (50 to 54) | Gran; listen to 3 people; nurse; the rail | Gran: "Listen to the people. Then find Nurse Bell." (`content.js:172`), a story person, fine. | Choice at the rail; the flower spray appears (good). No count at 51. |
| 6 After (60 to 63) | Hyacinth and Maude; sort cards; Maude | Maude, cards, Maude: mild. | Cards are a panel. No count at 60. |
| 7 Monument today (70 to 75) | Kayla; story board; 2 flowers (count); read the words; Kayla | Kayla at the start and the end: mild. | Flowers appear (good). |

**Fixes.** Stage 44 goal: "Find Nurse Bell and the ladies: 0 of 3." Stage 32: "Say goodnight: 0 of 4." Draw the photograph, Bible, comb and radio in your hand while carrying. Swing the gate open and hold it. Give Miss Iris a stage-aware later line before stage 12.

## 7. Hurricane Melissa

**Marks and arrow.** Same gold mark on every person (`main.js:209-212`). Arrow `main.js:616` (measured 20.6 s still, 34.1 s walking), target `main.js:606-608`. Goals `content.js:18-62`, targets `content.js:64`, later lines `content.js:283-293`.

| Chapter (stages) | Steps | Redirects and loops | Tasks and visuals |
|---|---|---|---|
| 1 Charlie 1951 (10 to 16) | Papa, Mama, Mass Cyril; 3 jobs (count); Miss Ivy; go inside; sit; Papa | **Wrong "come back":** Papa's later line "Help Mass Cyril, then come back." (`content.js:284`), but after the jobs the goal is Miss Ivy, not Papa. Cyril: "Help me, child. Then go to Miss Ivy." (`content.js:126`), a story person, fine. | Boards appear, canoe moves up the beach (good). **Water drum: toast only**, nothing fills (`main.js:433`). No count at 10. |
| 2 Gilbert 1988 (20 to 26) | Dad, Mama, Delroy; 3 jobs; Mass Clifford; inside; sit; Dad | Dad's later line "Go and help your mother." (`content.js:285`) points at Mama, who has no job. | Washing disappears, boards appear (good). Drum: toast only. No count at 20. |
| 3 Melissa is coming (30 to 36) | Mum and Grandpa; 4 jobs; Mr. Raymond; hand up 3 nails; radio; walk to the hall | none | **Toast only:** buy water and tins, fill the buckets, pack the go-bag, hand up the nails (`main.js:403-407`). Boards appear (good). No count at 30. |
| 4 The storm (40 to 45) | Mum, Pastor, Nurse; 2 jobs; night; sit; Mum and Pastor | Mum and Pastor again at 44 (after the night, mild). | **Toast only:** blankets and cups of water (`main.js:411-412`). No count at 40 or 44. |
| 5 After the storm (50 to 55) | Mum and Grandpa; walk home; look at the house; Mum; Miss Hyacinth | none | **Arrow points at the wrong thing (code, not run with a skip):** "Look at the fallen tree" is on at 51 and 53, "Keep away from the wire" at 51, 53 and 54 (`main.js:415-416`), and they are optional. `NUDGE_EXTRA` covers only 51. If a child walked past them at 51, then at 53 ("Talk to Mum.") and 54 ("Check on Miss Hyacinth") the arrow points at the tree or the wire, because actions come before people. (The autoplayer happens to do them at 51, so its run did not show this.) No count at 50. |
| 6 Days after (60 to 65) | Raymond; 4 jobs; Jordan; listen; switch on the light | none | Logs clear and the tarp goes on (good). **Toast only:** bucket at the truck, and the plate of food: "Take a plate of food" puts nothing in your hand and "Give food to Miss Hyacinth" leaves no plate with her (`main.js:419-422`). Light comes on (good). |
| 7 Ready for next time (70 to 74) | Miss Campbell; Ready Plan board; pack the kit; Andre | none | Board card and kit quiz (panels). |

**Fixes.** Exclude optional actions from the arrow (an `optional: true` flag, or `NUDGE_EXTRA` for 53 and 54). Draw the plate, buckets, water bottles and blanket in your hand, and leave them where they go (a cup on the table, a bucket by the door, a plate by Miss Hyacinth's chair). Make Papa's and Dad's later lines flavour. Add counts to 10, 20, 30, 40, 44, 50.

## 8. Tivoli

Only chapter 1 (Back-o-Wall) has tasks; chapter 5 is a directed scene with no player tasks.

- **Story people:** Ivy, Miss Pearl and Mass Roy. Any talk counts (`onTalked`, `ch1.js:34`), so any order works, but the goal names one at a time from a fixed `ORDER` (`ch1.js:16`) and has no count.
- **No marks, no arrow** at all. The talk button appears only within 2.8 m (`talk.js:25-30`). The last step, "Walk to the end of the lane.", has no marker of any kind (`backowall.js:81`, checked in `ch1.js:37-39`).
- **Error-like line:** Miss Pearl's later line "Go on, child. See what Roy says." (`content.js:46`) even after you have talked to Roy. Her first talk ends "Go and see Roy in the lane. He has news." (`content.js:34`), which is wrong if you met Roy first.
- **Fixes:** goal "Talk to Ivy, her gran and Mass Roy: 0 of 3"; a marker and the shared arrow at the end of the lane; Pearl's lines conditional on Roy.

---

## Cross-game summary

### Which games follow each rule today

| Rule | Port Royal | Garvey | Kendal | Bog Walk | Nanny | Eventide | Melissa | Tivoli |
|---|---|---|---|---|---|---|---|---|
| 1a Only story people advance (flavour cannot) | mostly (chains of `if`s) | yes | yes | yes | yes | yes | yes | yes (all three are story people) |
| 1b Story people marked apart from flavour | no | no | no | **yes** | no | no | no | no marks at all |
| 1c No "go back to X" loops | no (camp) | mild (ch 3, 5, 7) | mild (ch 3) | no (station chain, ruins) | no (ch 2) | mild (ch 6, 7) | mild (ch 4) | yes |
| 1d No "talk to X first" from people needed later | no | no (3 lines) | yes | no (later lines) | no (wall toast) | mostly (Iris "Hello again") | no (Papa) | no (Pearl) |
| 1e Any order with a progress count | no counts on talk steps | no | no | **yes at stage 20 only** | no | no | no | no |
| 2 Arrow within 2 to 3 s | no (15 / 50 s) | no | no | no in the world; **yes** in the Tube's escape | no | no | no (measured 20.6 s) | no arrow |
| 3 Every required task visible | mostly (crate loading is the model) | panels leave no trace; steward choice not shown | bucket, bunches, brakes, ride bucket, splash | yes except the Tube count | doors | carried things, gate | many toast-only jobs | n/a |

### Shared code that exists

`engine/` has `anim.js`, `audio.js`, `audit.js`, `colours.js`, `grip.js`, `input.js`, `loader.js`, `locomotion.js`, `loft.js`, `placement.js`, `skinprobe.js`, `ui-audit.js`. **Nothing for goals, stages, talking, speech marks, the arrow or the player's held items.** Each game carries its own copy of: `showGoal` / `refreshGoal`, `setStage` / `onTalked` / `wantsTalk` / `TALK_TARGETS` / `NEXT_AFTER_TALK`, `startTalk` with `TALK` and `LATER`, `addMark` / `bubbleTick` / `TB`, and `NUDGE` / `nudgeTarget` / `nudgeTick`. `engine/grip.js` handles NPC hands only. `docs/ENGINE.md` (lines 135-149) already lists these as candidates to move.

### What a shared engine module should own (proposal: `engine/story.js`)

1. **Steps, not just stages.** Each stage declares `{ goal, story: ['gran', 'clive'], needs: { talk: [...], do: ['bucket1', 'bucket2'] }, any: true, explore: false, next }`. The module writes the count into the goal itself ("Talk to Gran and Mr. Clive: 1 of 2"), so no game can forget it.
2. **Story people.** `story` is computed from the current step. Only story people get the gold mark; flavour people get none (or a small grey one). A flavour person's first `TALK` plays once (so flavour talks are reachable), never counts toward progress, and never unlocks a step. A person needed later is flavour until their step.
3. **Later-line lint.** A dev check (`?test=flow`) that fails any `LATER` line from a non-story person that names another person or uses "first", "come back", "go and", "go to", "talk to", "then", and any goal whose `needs` has more than one item but no count.
4. **The arrow.** Targets only the step's unfinished needs (people and required actions, never optional actions), nearest first; shows **2.5 s** after a new goal (5 s when `explore: true`) whether or not the child is moving; re-points at once to the next unfinished need when one is done (no new wait); keeps each game's route hooks (Port Royal's `nudgeStep`, Eventide's gate and steps) as a `route(target)` callback; keeps Bog Walk's placement that avoids words and buttons (`placeNudge`).
5. **Carried items.** `carry(item)` shows the item in the player's hand (a camera slot for first person, `grip()` on the player body for third person), `place(item, spot)` leaves it visibly where it goes, `hold()` and `drop()` keep state, and `?test=held` checks the player's slot as well as NPCs.
6. **Dev check `?test=flow`.** For every stage: the arrow has a target, the target is a current need, a stage with more than one need shows a count, every `do` need has a visual hook, and the time from goal to arrow is at most 3 s (5 s for explore). Because the autoplayers use the same "first action on" choice as the arrow, they cannot catch a wrong target; this check can.

### Worst problems per game, ranked

**Port Royal**
1. Camp loop: "Look around. Then come back to me." and "Go back to Abba." (`main.js:186`, `965`); look first and you must talk to Abba twice.
2. Arrow after 15 s still or 50 s (`main.js:834`).
3. Morgan's hidden "3 of 5 questions" with no count (`main.js:1675-1677`).
4. No counts: cargo (3), camp looks (2), quartermaster and drill (2).
5. Same marks for flavour and story people; Will and Grace redirect.

**Marcus Garvey**
1. "First" lines from people needed later: steward (`main.js:962`), Garvey at Liberty Hall (`main.js:965`), Garvey at the dock even after you have done it (`main.js:874`).
2. Arrow 15 s / 50 s (`main.js:557`).
3. No counts on nine multi-person stages.
4. The steward's choice changes nothing on screen; the nurse's basket is not drawn.
5. Non-story people send you to the sailor and the friend (`main.js:803`, `806`, `875`); the older man loop in chapter 3.

**Kendal 1957**
1. Arrow 15 s / 50 s (`main.js:569`).
2. Carrying not shown: water bucket at the crash and on the 1845 ride; banana bunches teleport; brakes do not change.
3. No counts on eight multi-person stages; goal 60 hides that Gran is a required talk.
4. Dawn marked and crying from stage 60 but no help until 62; the nurse thanks you early.
5. Stale `GOALS[23]` after a restart; goal 67 "Read the next card" after "Stay here".

**Bog Walk 1904**
1. Ruins: the arrow points at the information board at stages 62 to 65 (confirmed by run; `main.js:577`).
2. Ruins ping-pong Grant, board, Kemar, Grant, Kemar.
3. Station chain of four redirects, and Henry and Zeke send you ahead out of turn (`content.js:140-141`).
4. Arrow 15 s / 50 s in the world, none for the rust patches; the Tube goal drops its count at 7 s.
5. The reporter's later line before you have met him.

**Nanny Town 1734**
1. Mimba, Cubbenah, Mimba loop (confirmed by run).
2. Arrow 15 s / 50 s (`main.js:636`).
3. No counts on five multi-person stages.
4. Knocking on doors shows nothing.
5. "Talk to Mama and Quamin first." on an invisible wall.

**Eventide 1980**
1. Stage 44 goal names only the nurse but needs three people, no count.
2. Carried things vanish from the table and are not in your hand.
3. Arrow 15 s / 50 s (`main.js:478`).
4. No count for "Say goodnight to all four ladies" and four other stages.
5. The gate does not open; Miss Iris says "Hello again" before you meet.

**Hurricane Melissa**
1. Optional tree and wire actions can steal the arrow at stages 53 and 54.
2. About ten required jobs are toast only (drum, water and tins, buckets, go-bag, nails, blankets, cups, truck bucket, the plate of food).
3. Arrow 15 s / 50 s (measured 20.6 s still, 34.1 s walking).
4. Papa's "Help Mass Cyril, then come back." and Dad's "Go and help your mother." point the wrong way.
5. No counts on six multi-person stages.

**Tivoli**
1. No arrow and no speech marks at all; the end of the lane has no marker.
2. Miss Pearl sends you to Roy even after you have met him.
3. The goal names one person at a time in a fixed order and has no count.

### Not confirmed by running

Only the five runs listed at the top were done. The arrow delay was measured in Melissa only; the other six games use the same code and constants, so I expect the same result, but I did not measure them. The Melissa stage 53 and 54 mis-target needs a run where the tree and wire are skipped at 51; I did not script that. Garvey, Port Royal, Kendal, Eventide and Tivoli were not run at all for this audit. Whether Garvey's Marcus Garvey on the platform (stage 53) and other targets are reachable could not be checked, because Garvey has no `?test=audit` wired.
