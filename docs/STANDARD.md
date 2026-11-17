# How we make things: the standard for every game

This is the one place to start when you make or fix anything in a game, old or new: people, clothes, places, or animations. Each section is short and points to the detailed doc. At the end there is a checklist for bringing one game up to the standard, and a table of where each game stands today.

Every game wires `?test=all` (`engine/checks.js`, `docs/TESTING.md` section 7) and passes `npm test` (with the content lint) before a pull request.

Follow `CLAUDE.md`'s rules every time. The ones that matter most here: plain words (rule 2), facts checked against sources first (rule 3), phones (rule 5), checks at 0 (rule 8), and skin (rule 9).

## Files that every game shares: do not edit them without the owner

| File | Why |
|---|---|
| `engine/` (all of it) | Every game imports it. A change can break any game. |
| `tools/garvey/era.py` | The clothes builder for every game's people. A change can change bodies in other games. |
| `tools/people/pack.mjs` | Packs every game's bodies. |
| `tools/build.mjs`, `tools/dist.mjs` | Build and publish every game. |
| `shared/` (animation library, rig) | Copied into every game at build. |

If one of these needs to change, make that change in its own pull request, explain why and which games it touches, and leave it for the owner to merge. Work for one game stays in `games/<game>/`, `tools/<game>/` and `docs/games/<game>.md`.

## 1. People

The full rules are in `docs/PEOPLE.md`; every recipe key is in `docs/PIPELINE.md`, section 5.

- **New recipe or reuse a body?** Make a new recipe for anyone the player talks to and for anyone whose clothes must fit the game's year and place. A body may be shared only if it was made for the same period and the same kind of person: then build it once and copy the packed file (`docs/PEOPLE.md`, section 2). Do not borrow another game's bodies as stand-ins: they bring that game's faces (so the same face turns up in two stories) and that game's era (a 1950s collar in 1734 is wrong history, rule 3). Where a game still uses stand-ins, the table at the end says so.
- **Where recipes go:** `tools/<game>/people/<name>.json`, one file per body. Port Royal's are in `tools/people/`.
- **Every recipe sets** `era`, `hat` as a list of `[kind, material]` pairs, `collar` as a kind (`"turn"`, `"stand"`, `"camp"`, `"round"`, `"open"`), and `colors` for every garment.
- **Children** are real child bodies: built at a child's shape with `upscale` and shrunk in the game by about 1 / upscale. Start from `tools/kendal/people/boy.json` and `girl.json`.
- **Skin (rule 9):** `Skin` inside `[134, 90, 64]` to `[156, 108, 80]`, never darker, a little different for each person. In the game, multiply only the `Skin` material (Kendal: `SKIN_LIGHT = 1.55`). Never multiply `Hair`: it keeps its own painted colour. Measure with `?test=skin`, not by eye in Blender.
- **Hair:** `hair`, `hairvol`, `bun`, `recede`, `temples`, `bays`, `fade`, and for girls `"puffs"` or `"plaits"` (with `Ribbon`). Grey hair for elders comes from the `Hair` colour.
- **A real person's likeness:** shape the face with MakeHuman `targets` against a photograph (Marcus Garvey's `garvey1914.json` and `garvey1916.json` were shaped against one the owner supplied). Record the photograph and its source in the game's doc, and check every later change against it. Real people never get invented words (rule 3).
- **Build and pack:**

  ```bash
  MAKEHUMAN=~/mh/makehuman NPC_OUT=build/people/ ~/venv/bin/python3 tools/garvey/era.py "$(cat tools/<game>/people/<name>.json)"
  node tools/people/pack.mjs --src build/people --out games/<game>/site/models --lo <name>
  ```

  Always pass `--out` (the default writes into Kendal). `--lo` makes the light copy for crowds. Budgets: full body under 32,000 triangles and about 350 to 480 KB; light copy about 5,900 to 6,300 triangles.
- **In the game:** copy Kendal (`games/kendal/src/main.js` and `cast.js`). There is no shared `engine/people.js` yet. See "The runtime pattern" in the checklist below.
- **Checks:** `?test=cloth`, `?test=walkers`, `?test=skin`, `?test=held`, and the place audit for overlaps and seats.

## 2. Clothes and new periods

- **Research first (rule 3).** Find period photographs or written sources for the year and place, and note them in `docs/games/<game>.md` before you build. Fictional people still wear real clothes of their time.
- **Use what exists.** `docs/PIPELINE.md`, section 5 lists every garment `era.py` can make (shirts, collars, ties, waistcoats, jackets, trousers, shorts, skirts, aprons, scarves, hats, hair). Section 1 covers the 1690 cut. Most new people need only a recipe.
- **A garment `era.py` cannot make yet** (a uniform, a head tie, a new hat): there are two ways, and both keep `era.py` safe for other games.
  1. A game-only tool that adds pieces on top of an `era.py` body, as Tivoli's `tools/tivoli/kit.py` adds 2010 police and army kit (vests, pouches, helmets, boots). Its pieces need bone weights and `Col` vertex colours like `era.py`'s, and colour by vertex, never by face.
  2. A change to `era.py` itself, in its own pull request, guarded by a new key or by `era` (for example `if P.get('era', 1915) < 1800:`) so no existing recipe builds differently. Eventide's `tools/eventide/people.py` is a copy of `era.py` with head ties, cardigans and glasses; that was a stopgap, and those pieces should move into `era.py` this way.
- **Who else uses a path in `era.py`.** Before you change how a key builds, find every recipe that sets it and every game that ships those bodies:

  ```bash
  grep -l '"jacket"' tools/people/*.json tools/*/people/*.json      # recipes that use the key
  ls games/*/site/models/ | grep -n '^garvey1914'                    # or: ls games/*/site/models/<body>.js
  ```

  Then rebuild each of those bodies, copy them to every game that ships them, and run `?test=cloth` and close screenshots in each of those games. A change after 1800 also touches every later game; a change to the 1690 cut touches Port Royal (and Nanny Town's 1734 recipes).
- **Collars, hems and layers.** A collar has a yoke under it so no skin shows. Hems and necklines are never moved by `pack.mjs`. Layers have set clearances (shirt 9 mm, waistcoat 19 mm, jacket 21 to 29 mm) and cloth that is always covered is deleted. The cloth rules are in `docs/PIPELINE.md`, section 5.
- **Light copies:** check `?test=cloth` with `&lo` too; small pieces (buttons, buckles) are dropped from light copies.
- **Check:** `?test=cloth` (0 is the goal), then close screenshots front and three-quarter, standing and mid-stride, full and light copy.

## 3. Places: buildings, ground, plants and props

- **Where each game builds them today.** Port Royal uses Blender-made houses and ships (`tools/blender/street.py`, `variant.py`, `ships.py`, textures from `tex.py` and `tex2.py`; `docs/PIPELINE.md`, section 3) plus code in `games/port-royal/src/main.js`. Every later game builds its world in code: Kendal splits it into `places1.js`, `places2.js`, `props.js`, `trains.js`, `decor.js`, `detail.js`, `common.js` and `gfx.js`; Garvey keeps most of it in `main.js` (its monument is in `shrine.js`); Nanny Town adds `land.js` (terrain from noise) and `flora.js` (instanced forest); Melissa adds `houses.js` and `storm.js`; Eventide and Bog Walk copy Kendal's `gfx.js`, `props.js` and `detail.js`. For a new game, copy Kendal's `gfx.js`, `props.js` and `detail.js` into `games/<game>/src/` and change the copies, not Kendal's. Railway vehicles are not copied: they are shared in `engine/vehicles.js`, which Kendal and Bog Walk both use (`docs/ENGINE.md`, "engine/vehicles.js").
- **Shared engine pieces to reuse:** `engine/placement.js` (seats with `anchorSeat`, walls with `slideWalls`, routes with `walkRoute` and `routeIssues`), `engine/loft.js` (smooth animal bodies), `engine/audit.js` (`snapMeshes` before merging, then `auditPlace`). See `docs/ENGINE.md`.
- **Textures** are drawn in code on canvases (no image files), cached and shared (`gfx.js`: `cv`, `std`, `solid`, `flat`). Photographs are references only, never textures.
- **Speed and phones.** Merge each place's still scenery with `batchStatic` (in each game's `gfx.js`) after taking the audit snapshot; draw grass, flowers and trees instanced; share materials; hide far crowd figures (Kendal hides light copies beyond 75 m); real shadows on computers only (`SHADOWS` in Kendal's `main.js`), soft blob shadows under people on phones. Measure with `&stats` on a view (draw calls and triangles in the page title).
- **Grounded and clear.** Everything stands on something: a sign or lamp needs a post, bracket or wall (`float` in the audit). Nothing solid stands in a walkway without a wall rectangle. People never stand in walls, in furniture, in trees (trunks, low crowns, between buttress roots) or in each other, and bushes never poke through walls (`auditThrough`). `auditBodies` checks people against the real shapes, including merged and instanced ones, where they stand and along their routes.
- **History.** Build from photographs, plans or descriptions of the real place where they exist, and say in the journal when a place is "a general picture" instead (rule 3).
- **Check:** `?test=audit` with 0 issues in every place, then screenshots of each place close up and from far away, on a phone layout too.

## People who follow or lead

Every game uses `engine/follow.js` for anyone who walks with the player (`docs/ENGINE.md`). Do not write a game's own follow code.

- **A follower** (`follow`): comes a comfortable way behind you and to one side (about 1.5 m; 1.3 m for a small child), never inside your personal space (about 0.9 m; 0.8 m for a small child), never blocks you (leave followers out of the player's collision with people), steps aside when you walk back into them, stops and faces you when you stop, and walks at a pace that fits (a run only to catch up, and only if the body has a Run clip).
- **A guide** (`lead`): walks ahead along a path and waits, facing you, when you fall behind.
- **Someone sent somewhere** (`goTo`): walks round furniture and solid things, or along a route the audit has checked.
- **Nothing solid.** The game's `world.blocked` must know every solid thing a person could walk into: walls, furniture, trees, huts, rocks, fences, luggage. A footprint list that misses one lets a follower walk through it.
- **Stop them** when the story says so and when a chapter is left.
- **Check:** `?test=follow` walks the player along each follower's and guide's real route, with stops and a turn back into the follower, and must report 0 (nobody too close, inside anything, far behind for long, or stuck). The place audit checks guides' and followers' routes against the real shapes (`place.routes`).

## Ambient life: background people

Owner, November 2026: "too much standing around looking like zombies in most games, we need some moving around and such". Every game's background people (anyone who is not a story person in the current step) use `engine/ambient.js` (`docs/ENGINE.md`). Do not write a game's own stroll, crowd-idle or chat code for new work.

- **Give everyone something to do,** as data in the place file: `wander` (short walks and pauses), `chat` (two to four facing each other, taking turns), `work` (a loop at a spot, or carrying between two points with the load shown), `sit` (seated idles, talking in turn with a neighbour), `watch` (looking at something, shifting weight, reacting), `errand` (A to B carrying something, and back), `play` (children running, chasing, cheering, slower near you).
- **What counts as too static:** anyone on an idle clip (`Idle`, `SitIdle`, `CarryIdle`, `Sad1`...) with no step, turn, clip change or head turn for more than 12 seconds in a lively scene; a talk clip on someone with nobody to talk to; a crowd that starts the same clip in the same frame; a work or carry clip with nothing in the hand; a walker whose feet slide. A real crowd mixes kinds: in a market or a platform, about a third walking or on errands, a third chatting in small groups, the rest working, sitting or watching.
- **The story first.** Pass the story paths and spots as `keepOff` and the step's story people as `story`: ambient people never stand on them and never crowd a story person. In a sad scene call `life.mood('sad')`: fewer people (some leave while out of view), slower, no laughing, cheering or games, but nobody freezes. Rule 4 holds: no fights, falls or fear clips in ambient life.
- **Phones.** One `life.tick(dt, world)` a frame; only the nearest people (at most 14, 8 with `phone: true`) animate every frame, the rest less often, and a light copy (`n.lo`) far off.
- **Clips** come from the game's `anim-clips.json`; `life.issues()` names any a behaviour asks for that the game does not ship.
- **Check:** `?test=ambient` (`ambientTest`, run for a minute with the player walking through) must print `AMBIENT 0` in every place: nobody inside a solid or a person, no slide, no statue, nobody on a story path.

## Story flow: who moves the story, the arrow, visible tasks

The owner's three rules (November 2026). Every game follows them, through `engine/story.js` (`docs/ENGINE.md`). Do not write a game's own goal, mark or arrow code for new steps.

1. **Only story people are the point of focus.** In each step only that step's story people get the gold talk mark and the arrow. Anyone else can be talked to for a short flavour line, but never moves the story on and never sends you to someone else (no "first", "come back", "go and", "go to", "talk to", "then", no other person's name). A person needed later is flavour until their step. No "go back to X" loops. Where order does not matter, any order works and the goal shows a count ("Talk to Gran and Mr. Clive: 1 of 2.").
2. **The arrow comes quickly and points at what is needed.** It shows 2.5 s after a new goal (5 s for an explore step), even while the child walks. It points only at the step's unfinished needs, never at optional actions, nearest first, and moves to the next need at once when one is done. A count going up does not restart the wait. Route it round walls with the game's `route` callback.
3. **Every required task shows on screen.** Something carried is drawn in the player's hand (`createCarry`: the camera slot in first person, the grip in third person); placing it leaves it where it goes; every `do` task changes something you can see (`shows`); counts show in the goal. A toast alone is not enough.

How to use it:

- Write the chapter as a step table: `{ goal, needs: { talk, do, go }, story, any, explore, optional, shows, next }`. The count is added to the goal for you.
- In the game's `setStage` call `STORY.sync(stage)`. Ask `STORY.talk(id)` when a person is tapped, `STORY.marked(id)` for the gold mark, `STORY.tick(now, quiet)` for the arrow, and call `STORY.done(id)` when a whole first talk ends or a task is done.
- Move one chapter's table at a time. Stages not in the table stay with the old code.
- **Check:** `?test=flow` (`flowTest` in the dev build) must print `FLOW 0`, and `npm test` runs the module's own tests.

## 4. Animations

- **The shared library** is `shared/models/anims.js`: 126 clips on one skeleton (Mixamo and hand-made) (`docs/ENGINE.md` lists them). Every body has the same bones, so every clip plays on everyone.
- **Adding a clip** (`docs/PIPELINE.md`, section 2): download from mixamo.com as **FBX, Without Skin**, with **In Place** ticked for anything that walks; put it in `shared/anim-sources/`; add it to `tools/anims/clips.json`; run `tools/anims/retarget_clips.py` (about 11 minutes), then `tools/anims/optimize_clips.mjs`, which packs it, then `tools/anims/check_clips.mjs`. Changing the shared library is a shared-file change: its own pull request.
- **A clip only one game needs** stays out of the shared library: Tivoli keeps its own in `tools/tivoli/anim-sources/` and `tools/tivoli/clips.json`, packs them with `tools/tivoli/pack_clips.mjs` into `games/tivoli/site/models/anims_tivoli.js`, and loads that after the shared library. Copy that.
- **Each game's clip list:** `games/<game>/anim-clips.json`. The build trims the library to it, so add any clip the game starts to play.
- **Walking and feet.** Call `groundFeet(m)` every frame for standing and walking people (it pins the lowest point of the shoes to the ground) and `ctl.pace(v)` whenever a walker moves, so feet do not slide. Seated people get a seat (`seatAnchor`, `docs/ENGINE.md`) and are not grounded.
- **Held things** use `engine/grip.js`: `grip(model, 'Right', item, { handleY, scale, lift })`, `spreadArms` for empty hands near skirts, and `gripTick` every frame after the mixer. Never parent an item straight to a hand bone.
- **Check:** `?test=walkers` (slide under 3 cm a loop, no sinking or floating) and `?test=held` (at the hand, upright, clear of the body).

## 5. Bringing one game up to the standard (a checklist)

Work on one game at a time, start to finish. Read `CLAUDE.md`, this file, `docs/PEOPLE.md` and `docs/games/<game>.md` first, and look up the game in the table at the end.

1. **Branch.** Make a branch for this game only. Do not edit the shared files listed at the top.
2. **Recipes.** For every body the game uses, have its own recipe in `tools/<game>/people/` (Port Royal: `tools/people/`). Each sets `era`, `hat` as `[[kind, material], ...]`, an explicit `collar` kind, `colors` for every garment, and `Skin` inside the rule 9 range with a little variety. Children are real child bodies with `upscale`. Check the clothes against period sources and note the sources in the game's doc.
3. **Build and pack** each body with the two commands in section 1, always with `--out games/<game>/site/models`, and `--lo` for anyone who appears in crowds or far off. Check the printed triangles and sizes against the budgets.
4. **Swap out stand-ins.** Point the game's looks (`cast.js` or its `LOOKS` table) at the new bodies, then delete the borrowed files from `games/<game>/site/models/`.
5. **The runtime pattern** (copy from `games/kendal/src/main.js` and `cast.js`):
   - load each body once (`loadBase`) and clone it per person (`skClone` from three's `SkeletonUtils`); turn off frustum culling on skinned meshes;
   - recolour by material name in one place (`makeBody`), one palette table per period (`LOOKS`);
   - multiply only `Skin` by `SKIN_LIGHT` (start at 1.55; a brighter game may use less, as Port Royal uses 1.0, if `?test=skin` says so); set `Hair` to 1, never to the skin factor;
   - show one hat and hide the others (`HATS`, `offHats`);
   - children shrink by `KID` (`cast.js`: 0.8 for `boy` and `girl`, 0.66 for `girl_small`);
   - `animate()` each person, call `groundFeet` every frame for standing and walking people, and `ctl.pace(v)` for walkers;
   - seated people: `m.userData.seatAnchor = { top: seatHeight }` (the hip rides 12 cm above, `SIT_HIPS`), and they are not foot-grounded;
   - held things with `grip`, `spreadArms` and `gripTick` (`GRIP` table for each item's size and lift);
   - speech marks just above the head or hat, measured from the posed model.
6. **Wire the checks** into the dev build (search Kendal's `main.js` for `q.get('test')` and copy each block, changing only the game's place and people names):
   - `?test=audit` (also answering `collision` and `seating`): floating things, people in solids, unreachable spots, people inside each other, seats, leafy shapes through walls. Every place 0. (The object overlap check is being added to `engine/audit.js`; wire it when it lands.)
   - `?test=held`: every carried thing, 0.
   - `?test=layout`: run at **390x800, 667x375, 800x500 and 1280x720**, each 0.
   - `?test=cloth`: every body, full and light copies, 0.
   - `?test=walkers`: every walking body, 0.
   - `?test=skin`: faces inside the target in `docs/PIPELINE.md`, "Skin".
   - `?test=resume`: every saved stage reloads in the right place (when the game saves).
   How to run them headless is in `docs/TESTING.md`, section 5.
7. **Fix until each check reports 0.** Where a check cannot reach 0 yet, write down why in the game's doc. When you find a new kind of mistake by eye, propose a new check for `engine/audit.js` in its own PR (rule 8).
8. **Look yourself.** Take and look at: a close screenshot of every body, front and three-quarter, standing and mid-stride, full and light copy; every place close up and far off; a conversation, the journal and a card on the phone layout (390x800) and on a computer (1280x720); faces in daylight, indoors and at night. Look for jagged necklines and hems, floating collars, hands in bodies, hair through hats, and skin that is too dark or too pale.
9. **Play it.** Run the autoplayer for every chapter (`?auto=N&one`) and read the log (`docs/TESTING.md`, section 3).
10. **Write it down in `docs/games/<game>.md`:** which bodies the game uses and where their recipes are, the skin factor, which checks are wired and the numbers each printed with the date, the sources for clothes and places, and what is left. Then update this file's table.
11. **Pull request.** Commit as `CLAUDE.md` rule 7 says, push the branch, open a PR, and merge only when the owner asks.

## Where each game stands (November 2026)

Read from the code on `main` (`games/*/src`, `games/*/site/models`, `tools/*/people`). Check numbers are the last ones recorded, with where they come from. Update this table when you change a game.

| Game | Bodies | Recipes | Skin factor | Checks wired | Last check numbers | Top gaps |
|---|---|---|---|---|---|---|
| Port Royal | Own: 14 men built by `era.py` from `tools/people/*.json`. Abba is from `tools/blender/abba.py` (not rebuildable by `era.py`); Grace is Abba recoloured. | All set `era: 1690` | `SKIN_K = 1.0` (Skin only) | held, cloth, skin, walk, collision, seating | cloth 34 lines, 390 points (14 Nov, `docs/TESTING.md`) | No full `?test=audit` or `?test=layout`; no `?test=walkers`; Abba and Grace need `era.py` bodies (they draw much darker and redder); held items still parented to the hand bone, not `engine/grip.js` |
| Marcus Garvey | Own: 21 bodies from `tools/garvey/people/`; background people reuse other chapters' bodies of the same years, recoloured | All 21 set `era`, a `collar` kind and `hat` as `[[kind, "Hat"]]` (16 Nov; same bodies, nothing rebuilt) | `SKIN_K = 1.9` (Skin only; Garvey 1.65 and the nurse 1.18 and hl_worker 1.08 times that), Hair 1 | all (with its own anim check), audit (with a hung-on-a-peg line), held, layout, cloth, walkers, skin, ambient, anim, overlap, collision, seating | 16 Nov, `docs/games/garvey.md` "Checks": all 0 or 1 (see doc), audit 0, ambient 0, anim 0, layout 0 at four sizes, held 0, cloth 2 lines (not visible), walkers 0, lint 0 | UNIA Legion uniform, women's hats, varied faces; Kingston shop and hall not yet matched to photographs; Garvey's face matched to 1920 and 1924 photographs as far as the builder allows (see the doc) |
| Kendal 1957 | Own: 13 bodies from `tools/kendal/people/`, with light copies | All set `era` | `SKIN_LIGHT = 1.55`, Hair set to 1 | all, audit, held, layout, cloth, walkers, skin, resume, flow, ambient, follow, motion | 16 Nov: audit, held, walkers, flow, ambient, follow, layout (4 sizes), lint 0; `?test=all&noshadow` 0 except budget (7: draw calls 224 to 547 against 220 at the station, Kingston and the crash site) and motion (about 10 background heads turning fast in `engine/ambient.js`); cloth 51 lines (seated and kneeling skirts) | Cloth to 0 (kneeling skirt, builder); draw calls at Kingston and the crash site; faces repeat (13 bodies); 1957 clothes not yet matched to photographs |
| Bog Walk 1904 | Stand-ins: 12 Garvey bodies (`clerk1919`, `hl_worker`, `nb_elder` and others), some with light copies | None of its own | `SKIN_LIGHT = 1.55` (Skin only) | audit, held, layout, resume | not recorded in its doc | Own 1904 recipes in `tools/bog-walk/people/`; wire cloth, walkers, skin |
| Nanny Town 1734 | Own: 10 bodies from `tools/nanny/people/` with light copies, rebuilt 16 November 2026 with the fixed builder (own faces, brows, eyes, plain shirt fronts) | 11 recipes with `era` and `face` (`blackshot` is not in the game) | `SKIN_LIGHT = 1.55`, and Hair is multiplied too | audit, held, layout, walkers, resume | see `docs/games/nanny.md` | Build the recipes and swap stand-ins; stop multiplying Hair; wire cloth and skin (being worked on in another branch) |
| Eventide 1980 | Own: `iris1980`, `girl1980` (and unused `boy1980`), built by its copy `tools/eventide/people.py`. Stand-ins: Kendal `man_elder`, `man_shirt`, `man_suit`, `man_work`, `woman57`, `woman_elder`, `boy`, `girl` | 3 recipes in `tools/eventide/people/`, none set `era` | `SKIN_LIGHT = 1.55`, and Hair is multiplied too | audit, held, layout, resume | audit 0 in both places (13 Nov, `docs/games/eventide.md`) | Move `people.py`'s extra garments into `era.py` (own PR); 1980 recipes for everyone; stop multiplying Hair; wire cloth, walkers, skin |
| Hurricane Melissa | Stand-ins: Kendal (`man_work`, `man_shirt`, `man_elder`, `woman57`, `woman_elder`, `boy`, `girl`, `girl_small`) and Garvey (`guide2020`, `student2020`), with light copies | 6 recipes in `tools/melissa/people/` (1988 and 2025, all set `era`), not built | `SKIN_LIGHT = 1.55`, and Hair is multiplied too | audit, held, layout, resume | audit 0 in all six places (14 Nov, `docs/games/melissa.md`) | Build the 6 recipes and swap stand-ins; stop multiplying Hair; wire cloth, walkers, skin |
| Tivoli | Own: `soldier2010`, `police2010`, `civilian2010` (with light copies, kit from `tools/tivoli/kit.py`). Stand-ins: Kendal `girl`, `woman_elder`, `man_elder` and Garvey `guide2020` for the story people and neighbours | `era: 2010` recipes in `tools/tivoli/people/` | `SKIN_LIGHT = 1.55` (Skin only), Hair 1 | all (with its own `heads` check), heads, resume, audit, held, layout, scene, ambient, cloth, walkers, skin, clips, measure; autoplayer `?auto=N` | 17 Nov (`docs/games/tivoli.md`, "Playing like the other games"): heads 0, audit 0, layout 0 at five sizes, scene 0, held 0, ambient 0, resume 0, `?auto=1` all eight chapters | Own bodies for the story people and neighbours; cloth (kit layering in the bodies); the West Kingston reviewer. Controls, HUD, talk marks, cards and save now match Kendal (17 Nov) |
| The Emperor's Arrival, 1966 | Own: 15 `sel_` recipes, full inspection and joined focus/crowd/phone bodies | `tools/selassie/people/`, shared builder plus game-only face/uniform finishing | 1.55, baked into joined skin colours | all, audit, held, layout, cloth, walkers, skin, follow, ambient, autoplay; browser reload/touch suite | Shared gameplay ALL 0; placement/layout 0; cloth 6 diagnostic lines; see `docs/games/selassie.md` | Independent likeness/uniform review, beard/collar diagnostics and residual child walk drift; draft PR only |
| Windrush | Own: 15 era recipes in `tools/windrush/people/`, full, focus, light, crowd and phone copies | 1948, 1962, 2018 | Skin 1.55, Hair 1 | all, audit, held, layout, cloth, walkers, skin, resume, ambient, budget | See `docs/games/windrush.md` | New game, independent story and visual review pending |

The Kendal layout test reported 0 problems at all four sizes (390x800, 667x375, 800x500, 1280x720) on 14 November 2026, after the people work was merged into main. An earlier run that day showed 1 problem at 390x800 that did not come back.
