# Engine (shared code)

The engine is plain ES modules in `engine/`, bundled into each game by `tools/build.mjs`. A game imports what it needs:

```js
import { CL, mixers, grounded, loadClips, setFallbackClip, clipFor, animate, groundFeet, seamLoop } from '../../../engine/anim.js';
import { AU, soundPref, setSound, audioInit, stepSound, uiSound, cue, tone, noiseHit, gullCry, crackle, chirp, shipCreak, hammer, clink, setG, out } from '../../../engine/audio.js';
import { loader, onLoadFail, script, model, stage } from '../../../engine/loader.js';
```

The other modules, each covered below: `perf.js`, `joinbody.js`, `batch.js` and `preload.js` (performance on phones), `audit.js` and `skinprobe.js` (dev checks), `grip.js` (held things), `placement.js` (seats and routes), `follow.js` (people who follow you, lead you or are sent somewhere), `ambient.js` (background people who walk about, chat, work, sit, watch and play), `story.js` (who moves the story, the hint arrow, things the player carries), `colours.js` (used by the loader), `input.js` (keys and focus), `locomotion.js` (the player's walk), `loft.js` (animal bodies), `ui-audit.js` (text overlap) and `vehicles.js` (railway vehicles). There is no shared people module yet (`engine/people.js` does not exist): see `docs/PEOPLE.md`.

## Performance on phones (18 November 2026)

Four engine modules keep frames smooth on phones without changing the picture. Every game uses them. Measure with `?perf`, which works in public builds too, so it can be checked on a real phone on the live site: a small box shows frames a second, frame time, pixel ratio, draw calls, triangles, geometries and textures on the graphics chip, how many people were joined and how many meshes that saved, and the JavaScript heap where the browser reports it. Scripts can read `window.__perf`, `window.__join`, `window.__batch` and `window.__preload`.

### engine/perf.js: pixels and frame rate

`tunePixels(renderer, { phone, phoneMax = 1.5, max = 2, floor, slow = 28, quick = 19 })` replaces a game's own `renderer.setPixelRatio(...)`. Call it once, right after making the renderer.

- **Cap.** A phone draws at most `phoneMax` pixels per screen point and a computer at most `max`. Most phones are 3, and on a phone screen 1.5 looks the same at a quarter of the work. Port Royal keeps its own caps (1.25 and 1.75); Windrush and Selassie use 1.4 on phones.
- **Slow frames.** It measures frames with its own `requestAnimationFrame`, so no game loop changes. If the average frame stays over `slow` ms for a few seconds, it lowers the ratio by 0.15, down to `floor` (0.9 on phones, 1 on computers). After ten seconds of frames under `quick` ms it climbs back by 0.1. Single frames over 120 ms (loading) and the first five seconds are left out.
- `isPhone()` is a coarse pointer or a screen under 600 points on its short side.
- Port Royal's own slow-frame drop moved here.

### engine/joinbody.js: one mesh per look, not per piece of clothing

A body is a dozen or more skinned pieces (skin, shirt, trousers, hat, buttons), and each piece cost a draw call: a crowd of thirty cost over four hundred. `animate()` in `engine/anim.js` now registers every body, and after each mixer update `joinTick(m)` joins it once it has been dressed. Pieces are grouped by everything about their material except colour (roughness, metalness, emissive, side, transparency and so on), and each piece's colour is baked into the joined mesh's vertex colours. The picture is the same and a body costs two or three draw calls: skin (its own material, so the night fill still reaches it), clothes, and the eyes.

- The pieces stay in the body, `visible`, with `layers.mask = 0`, so the camera skips them but every check (seats, feet, hands, cloth, faces, audits) still measures them as before. `isJoined(o)` is true for a joined mesh; a check that walks a body's meshes should skip it.
- Left apart: a piece with a texture, morph targets, its own `onBeforeCompile`, or a different bind pose. A piece whose bones line up with the first piece's through a constant offset (packed files keep their quantisation in the inverse bind matrices) is moved onto it.
- Watched. If the game shows or hides a piece (a hat taken off, the seated skirt swapped in by `skirtTick`), swaps a material, or changes a colour, the body is joined again in the same update. Values that fade every frame (the night fill, roughness, opacity) are followed, not re-joined. A body that changes more than six times in three seconds is left as pieces for good.
- Cached. Joined points, normals and skin weights are built once per set of piece geometries and shared by every body made from them; colours are shared by bodies with the same colours.
- `?nojoin` (any build) turns it off. `m.userData.noJoin = true` before `animate()` leaves one body alone; `setJoin(false)` turns it off for a game; `splitBody(m)` puts a body back as pieces.
- `?test=join` checks every joined body twelve seconds in: posed, each joined point must land within 2 mm of its piece's point. The title reads `JOIN 0 issues in N bodies`.
- Windrush and Selassie bodies are already packed as one or two meshes, so there is little left to join there. Kendal's own `joinBody` (phone crowds only, one material for skin and clothes) is retired.

### engine/batch.js: still scenery

`batchStatic(root, { bake = true })` moved here from seven games' own `gfx.js` (Bog Walk, Eventide, Kendal, Melissa, Nanny, Selassie, Windrush). Each game's `gfx.js` re-exports it, so imports did not change.

- As before, every still mesh under `root` is merged into one mesh per material. Anything that moves, is switched on and off on its own, or is animated goes under a group marked `userData.noBatch = true`.
- New: meshes whose materials differ only in colour are merged into one mesh too, with each colour baked into the points. Games make a new material for each wall, post and plank, so this is where most scenery draw calls went (Eventide's title: 190 batched meshes became 119).
- Such a group is watched every frame. If the game changes one of its materials later (a window lit at night, a fade, a material made see-through), the group splits back on the spot into one mesh per material, each with the game's own material, so it follows every later change as before.
- `?nobake` turns the colour step off.

### engine/preload.js: the next chapter is ready, the last one lets go

| Call | What it does |
|---|---|
| `setQuiet(fn)` | How the engine knows the player is reading, not moving: `fn()` is true while a conversation, a card, the chapter title or a panel is open. |
| `ahead(names)` | Background download of the next chapter's model files (`prefetch` in `engine/loader.js`; skipped on slow or data-saving connections). Downloading costs no frame time. |
| `work(fn, { wait = 6000 })` | Queue heavy work (unpacking a model through the game's cached loader, building a place). Jobs run one at a time while `fn()` from `setQuiet` is true, or after `wait` ms at an idle moment. |
| `warm(renderer, object, camera, scene)` | Compile the shaders and upload the textures of a place that is built but hidden, so its first frame does not hitch. Run it from `work()`. |
| `release(object, scene)` | Free the graphics memory (geometries, materials, textures) of a place the player has left, keeping anything still used elsewhere in `scene`. Nothing is lost: three.js sends a freed thing again if it is shown again. Phones, iPhones above all, reload the page when graphics memory runs out. |

So yes, a conversation is the moment for the heavy part: the camera is still and the player is reading, so a short stutter there is not seen. The download starts earlier, as soon as the chapter starts. Each game's own doc says what it wires.

`engine/loader.js` now unpacks base64 with the browser's own `Uint8Array.fromBase64` where it exists, which is several times quicker than the old loop on a phone.

## Posture: `POSTURE` in `engine/anim.js` (16 November 2026)

Every clip passes through `clipFor`, which now also turns three spine bones (`Spine1` -18, `Spine2` +38, `Neck` -20 degrees about the side-to-side axis). The clips were fitted bone by bone to a source skeleton whose spine is a straight line; our bodies' spine is curved at rest, so every clip tipped the ribcage back about 20 degrees (belly out, chest sunk, a lean back). The correction puts the ribcage back as the body was built and leaves the head where the clip put it. If a body is ever built on a different skeleton, measure its rest spine and change these numbers. After changing them, run every game's `?test=held` and `?test=cloth`: hands and cloth move with the chest.

## engine/loader.js: loading packed models

Models ship as `site/models/<name>.js`, each defining `window.__models[name] = "<base64 glb>"`. This keeps everything as text, so any static host serves it, including claude.ai artifacts.

**Versioned URLs.** `tools/build.mjs` fingerprints every model file (a short hash of its contents) and bakes the list into `app.js` as `__MODELV__`, so the game asks for `models/ned.js?v=1a2b3c4d5e`. A changed model gets a new URL and is fetched again, an unchanged one stays in the browser's cache, which is why `vercel.json` can cache models for a year (`immutable`). Nothing to do by hand: just rebuild after changing a model.

| Function | Use |
|---|---|
| `onLoadFail(fn)` | `fn(name)` is called if a file fails, for example to show "reload the page". |
| `script(name)` | Loads `models/<name>.js?v=<fingerprint>`. Texture packs (`tex_*`) only need this. If a host refuses the `?v=` part, it tries the plain file once. |
| `model(name)` | Loads and parses a packed glTF and resolves to the gltf (`.scene`, `.animations`). Meshopt-compressed files are supported. |
| `prefetch([names])` | Asks the browser to fetch these models quietly in the background, so they are already there when needed. Skipped on a slow or data-saving connection. Garvey uses it for the next chapter's people. |
| `modelUrl(name)` | The versioned URL of a model. |
| `stage([names], onEach)` | Loads several in parallel and puts results in `window.__got[name]`. `onEach(fraction)` drives a progress bar. |

## engine/anim.js: animation for every character

Every character uses the same Mixamo skeleton (`mixamorig*` bones, from `shared/rig/char.blend`), so one clip library animates everyone.

| Name | Use |
|---|---|
| `CL` | Clip library, name to `AnimationClip`. Fill it with `loadClips(gltfOf('anims'))`. |
| `clipFor(name)` | Returns a ready-to-play copy of a clip (details below). |
| `animate(model, name)` | Gives a character a controller, also kept as `model.userData.anim`. |
| `mixers` | Every mixer `animate()` makes. The game loop calls `mx.update(dt)` on visible ones. |
| `grounded`, `groundFeet(m)` | Push a model into `grounded` and call `groundFeet` each frame: it pins the lowest point of the shoes (heel edge, ball, toe tip, found from the body's own vertices) to `m.userData.ground` (default 0), so feet never float or sink. Small corrections are eased in over a few frames. Never set the model's height yourself after that. |
| `strideOf(model, clip)`, `ctl.pace(v)` | How many metres one loop of a walk covers on this body (leg length and scale included). `ctl.pace(v)` sets the clip speed to fit ground speed `v`, so feet do not slide. Call it whenever a walker moves. |
| `seamLoop(clip)` | Makes a loop end exactly where it starts. Already applied to every walk in `WALKS` (Walk, WalkM, WalkM2, Run, RunM2, Carry, SadWalk, CarryBagWalk, CarryHeadWalk, CarryHeadWalk2, HoldWalk, HurtWalk, InjuredWalk, RifleWalk, RifleWalk2, RifleCrouchWalk) and to Tread. |
| `WALKS`, `SEATED`, `isSeated(name)` | Which clips walk (`ctl.pace` paces only these) and which are seated: every `Sit*` clip plus TalkM3, AskQuestion, PlayPiano and Pray4, which sit but are not named Sit. Use `isSeated` wherever a game asks "is this person sitting?" (`engine/audit.js` does). |
| `setFallbackClip(c)` | The clip used if a named one is missing. |

What `clipFor` does to each copy:
- It drops scale tracks and moving-root tracks.
- It keeps the hips' height only for clips matching `HIPS_Y` (sitting, stumbling, praying, sword work, and since November 2026 kneeling, crawling, crouching, ducking, the Hurt clips, the guitar and piano clips and the seated talk clips), so a kneeling body kneels at the right height instead of standing tall on bent legs (`tests/regressions.mjs` checks it; Kendal's Nurse Gray kneels with `Kneel`).
- It locks seated clips (`isSeated`) over their seat, facing the way the character is placed.
- `WalkM` is a steadier man's walk made from `Walk`, with less hip and spine twist.

The controller from `animate()` (`ctl`):
- `ctl.play('Wave', once)` plays a clip, cross-faded. With `once` it returns to the base clip afterwards.
- `ctl.play('Walk')` loops a clip.
- `ctl.rest()` goes back to the base clip.
- `ctl.tick(dt)` is called each frame for the once-timers.

Clips in the library: the full list is `tools/anims/clips.json` (126 clips on 15 November 2026), and `docs/PIPELINE.md` section 2 says what each new one shows. To add one, see PIPELINE.md.

## engine/audio.js: sound made in code

There are no audio files. Everything is Web Audio noise and oscillators.

| Name | Use |
|---|---|
| `soundPref('mygame-sound')` | Call once at startup; it remembers on/off per game. |
| `audioInit()` | Call on the first user tap (browsers block sound before one). It creates the looping beds `AU.ch.sea`, `surf`, `wind`, `crowd`, `room`. |
| `setG(AU.ch.sea, level)` | Fades a bed. A game's own `audioTick()` decides the levels per place every 0.1 s. |
| `setSound(on)` | The mute button. |
| `stepSound(kind)` | A footstep: `'sand'`, `'grass'`, `'wood'`, `'stone'` or `'water'` (a splash stroke). |
| `uiSound(kind)` | Interface sounds: `'page'` (new journal page), `'goal'` (goal changed), `'tap'` (conversation starts). |
| `cue(kind)` | Short music phrases: `'begin'`, `'sad'`, `'end'`. |
| `gullCry()`, `chirp()`, `crackle()`, `shipCreak()`, `hammer()`, `clink()` | One-shot ambience. |
| `tone(f0, f1, dur, type, vol, pan, delay)`, `noiseHit(freq, q, dur, vol, pan, delay)`, `out(pan)` | Building blocks for new sounds. |

## engine/audit.js: automatic checks of a built place

Required for every game (CLAUDE.md rule 8, TESTING.md section 5). Nothing here runs in a public build unless a game imports it into code that is only reached when `__DEV__` is true.

| Name | Use |
|---|---|
| `snapMeshes(group)` | A list of the world-space box of every visible mesh. Take it when a place is built, **before** `batchStatic` merges the meshes. `snapMeshes(group, { shown: true })` leaves out anything inside a hidden part of the group: use it when the group is a whole scene that holds every place and hides all but one (the crowd seat check in `engine/ambient.js` does). Each copy of an instanced box (a hall's rows of chairs) also carries its exact box, so `auditSeated` counts it as a seat. |
| `auditPlace({ id, snap, npcs, walls, bounds, start, actions, people })` | Returns `{ id, floating, inside, stuck }`: objects hanging in the air, people inside a solid (or overlapping another person), and spots the player cannot walk to. |
| `auditHeld(id, model, held)` | For one person who carries things: each held item must be at the posed hand, upright, and clear of the body. Pose the mixer first (`mx.update(0.1)`). |
| `auditHeldClip(id, model, held, { poses, after })` | The same check through the whole clip the person is playing, at 48 evenly spaced moments from its start, so every run gives the same answer. `after` is what the game does after each animation step (`gripTick`). Each line names the clip. Kendal, Garvey, Melissa, Nanny Town and Eventide use it in `?test=held`; they used to copy a loop of 12 moments that started wherever the clip happened to be, and missed a brief touch on some runs (17 November 2026). |
| `auditSeated(id, body, snap, ground, stats)` | For one seated person (pose the mixer first): the seat must not pass through the thighs (the hip joint rides about 12 cm above the seat top), the person must not hang or sit on nothing, and must not cut into a seat back or wall. Uses the real skinned vertices. Rows of chairs drawn as instanced boxes count as seats (17 November 2026: the delegates in Garvey's Liberty Hall were reported as sitting on nothing, and before that against the furniture of hidden places). |
| `auditWalk(id, body, v, opts)` | Steps a walking body through whole loops at ground speed `v` and measures foot slide, sinking, floating and jumps. |
| `auditCloth(id, body, { poses })` | Finds an under layer that shows through its cover in each pose (skin, shirt, waistcoat, hair under a hat). The layer order is `CL_ORDER` in the file. |
| `auditBodies(snap, people, { skip })` | People inside any solid shape, tested against the real triangles: merged shapes (a whole tree, a hut drawn as one shape), each copy of an instanced shape (a forest, rocks, far huts), spheres, lathes and rocks, not only plain boxes and cylinders. Each person is an upright cylinder (their height `h`, radius `r`, 18 cm for a grown-up, less for a child) cut by slices every 12 cm: a fault is a surface passing through the body, being enclosed by a shape, or standing inside a shape's outline at shin height (between a big tree's buttress roots, among a stool's legs). Leaf cards, see-through and unlit things, planes, thin small plants and the ground are left out; `skip(entry)` leaves out more (bushes someone hides in on purpose). `auditPlace` calls it for every standing person, along every walker's loop, and along `place.routes` (`[{ id, pts, loop, what, h, r }]`: followers, guides, people sent somewhere). `routeSpots` samples a route the same way. |
| `auditPeople(...)` | People standing in the same spot, or on a walker's path. `auditPlace` calls it. |
| `auditThrough(snap)` | Bushes, tree crowns and other leafy shapes that poke through a wall and show on both sides. Call it and report its lines with the rest. |
| `insideBoxFootprint(mesh, x, y, z)` | Whether a point is inside a mesh's own (rotated) box. A helper for the checks above. |

Show the results in a dev-only `?test=audit` view and expect 0 issues. Kendal's `main.js` ("the place audit") is the example.

## engine/placement.js: seats and walking routes

| Name | Use |
|---|---|
| `anchorSeat(model)` | Puts a seated person on their seat by the pelvis, not the toes. Set `model.userData.seatAnchor = { top, x, z, ry, lift }` (only `top`, the seat's height, is needed); `groundFeet` and the animation controller then call it every frame. The hip joint rides about 12 cm above the seat (scaled with the body). Works in the model's parent's space, so a seat can ride in a train. |
| `segmentHitsWall(a, b, wall, r)` | Whether a disc of radius `r` moving from `a` to `b` touches a wall rectangle `[x0, z0, x1, z1]`. |
| `slideWalls(from, to, walls, r)` | Moves from `from` toward `to`, sliding along walls instead of stopping. |
| `routeIssues(id, path, walls, r, loop)` | Lines for every leg of a walker's route that crosses a wall rectangle. |
| `furnitureRouteIssues(id, path, snap, ground, r, loop)` | The same against the real furniture boxes from `snapMeshes`, so a missing wall rectangle is still caught. |
| `walkRoute(a, b, walls, r, bounds)` | A short route round nearby walls, for people who follow the player. |

## engine/follow.js: people who follow you, lead you, or are sent somewhere

One system for every game (owner's request, November 2026). Each game used to have its own copy; Kendal (Dawn), Melissa (Mum), Eventide (Gran), Nanny Town (Quamin, Mama, Phibba, the neighbours) and Garvey (people walking to their seats in the hall) now all use this module. Set a person up with one call and run `tick` once a frame for each person whose `n.fol` is set. All tuning is in `opts`.

| Name | Use |
|---|---|
| `follow(n, opts)` | Someone who comes with you. They walk in your footsteps `gap` metres behind (about 1.5; 1.3 for a small child) and `side` metres to one side when there is room, never closer than `space` (about 0.9; 0.8 for a small child). If you walk back into them they step aside, across your way. They stop a step after you and turn to face you, run only to catch up and only if the body has a Run clip, route round anything in the way, and if stuck or left far behind (`far`, 16 m) reappear at a free spot behind you, out of the camera's view when possible. `opts.path` keeps them on a path instead. |
| `lead(n, path, opts)` | A guide who walks `ahead` metres in front of you along a path (a list of `[x, z]`), within `min` and `max`. If you are more than `wait` metres away they stop, turn and wait (with a wave if the body has one) until you are within `resume`. |
| `goTo(n, x, z, opts)` | Someone sent to a spot: round `world.walls` (or along `opts.route`, waypoints the audit has checked), then they stop, turn to `opts.face` and call `opts.done(n)`. |
| `stop(n)` | They stand where they are. Call it when the story says so, and when a chapter is left (`resetTransient`). |
| `tick(n, dt, world)` | `world = { px, pz, blocked(x, z, r), walls, bounds, others, talking, view, place(n) }`: where you are, where a person may not stand (walls, footprints of trees, huts, rocks, luggage), routes round furniture, other people (kept 0.5 m apart), the person you are talking to (they wait), the camera (for reappearing out of view), and `place(n)` to set the body's height on hilly land. Without `place` the tick sets x and z and leaves y to `groundFeet`. |
| `isFollowing(n)`, `isLeading(n)` | For the game's own code: a follower must not block you, so leave them out of the player's collision with people. A hint arrow can point at a leader. |
| `pathPoint`, `pathS`, `pathLen`, `pathSpots` | Path helpers; `pathSpots(path, s0, s1, side)` gives every spot on a path, for `place.routes`. |
| `watch({ space, behind })`, `drive({...})` | The `?test=follow` check: `drive` walks the player along a real route through the game's own clamp and update; `watch.sample` each frame records a follower inside the personal space, inside something, more than `behind` metres away for over 2 seconds, or a guide that stands still while you wait near them. `watch.spots(n)` gives every place they stood, for `auditBodies`. |

## engine/ambient.js: background life (people who are not in the story)

The owner, November 2026: "too much standing around looking like zombies in most games, we need some moving around and such". Every background person (anyone who does not move the story in the current step) gets a behaviour from this module instead of standing on `Idle`. A behaviour is plain data, so it can sit in a place file next to the person:

```js
import { createAmbient, ambientTest } from '../../../engine/ambient.js';
const life = createAmbient({ walls: P.walls, bounds: P.bounds, blocked, keepOff: () => storyPaths(stage), seed: 7, phone: isPhone });
life.add(n, { kind: 'wander', area: [x0, z0, x1, z1] });            // n = { id, x, z, m, ctl }, the same person engine/follow.js uses
life.add(a, { kind: 'chat', group: 'well', at: [12, 4] }); life.add(b, { kind: 'chat', group: 'well' });
life.add(c, { kind: 'work', between: [[3, 2], [8, 2]], show: (n, on) => { crate.visible = on; } });
// every frame, after the player moves:
life.tick(dt, { px: state.x, pz: state.z, story: storyPeople, talking: talkWith, view: { x, z, yaw } });
```

**Behaviours** (`spec.kind`):

| Kind | What they do | Spec |
|---|---|---|
| `wander` | Short walks between a few points, or to random free spots in an area, round walls (`walkRoute`) and solids (`blocked`), paced so the feet do not slide; pauses of a few seconds to idle, glance about or look at you. | `pts: [[x, z], ...]` or `area: [x0, z0, x1, z1]` (or `reach` metres round where they stand), `pause: [2, 6]`, `speed`, `idles`, `min`, `max` (leg length) |
| `chat` | Two to four people (same `group`) in a small ring facing the middle, taking turns to talk (mostly the one who has been quiet longest) while the others listen and look at the speaker; an odd laugh or nod after a turn; a look at you now and then when you come near. | `group`, `at: [x, z]` (lays the ring out; without it they face the middle of where they stand), `ring` (radius), `talks` The ring's first turn is a greeting (17 November 2026): one of them raises a hand (`Greet`, once) and the others nod, the first time you are within 16 m, where the game ships `Greet` and the scene is not a sad one. `Angry` is for arguments only and is in no mix. |
| `work` | A loop at a spot: a work clip, a short rest, a glance, again. With `between` they carry between two points instead: `PickUp` at each end, `Carry` there and `Walk` back, and `show(n, holding)` to show or hide the load. | `clip` or `clips`, `once`, `work: [5, 10]`, `rest: [1.5, 3.5]`, `face`, or `between: [[x, z], [x, z]]`, `walk`, `pick`, `idle`, `back`, `show`, `prop` |
| `sit` | On a seat: `SitIdle` and its variants in turn (a held pose such as `SitPoseM` only for a few seconds), `SitTalk` in turn with a neighbour in the same `group`, looking at the neighbour or about. | `seat: { top, x, z, ry }` (sets `seatAnchor`) or a seat the game set, `group`, `clips`, `sadClips`, `every` |
| `watch` | Stands looking toward a point of interest with small shifts of stance, another idle or a look round every few seconds, and now and then a reaction. | `at: [x, z]`, `react: ['Clap', 'Point']`, `every: [4, 8]` |
| `errand` | Walks from `from` to `to` carrying something (`walk: 'CarryBagWalk'`), waits, walks back. With `drop` they put the load down at `to` and pick it up again at `from`. | `from`, `to`, `walk`, `idle`, `back`, `wait: [3, 8]`, `drop`, `pick`, `show`, `prop` |
| `play` | A child runs between spots in an area, stops for a cheer, a clap or a laugh, and chases another child (`chase`). Within 6 m of you they walk instead of run, within 4 m more slowly still, and they never come into your personal space. | `area`, `chase` (another person), `run`, `joy` |

**What every behaviour gets:**

- **Variety.** Each person has a seeded random stream: a random start time and speed (0.88 to 1.12) on every looping clip, so nobody moves in step; idle variants in turn; their own walking speed (90 to 110 %, and the square root of their size for a child). Men get `WalkM` and `TalkM1`, `TalkM2`, `Talk2` when `n.sex === 'm'`; women `Talk1` to `Talk3` when `n.sex === 'f'`.
- **Heads.** After the mixer, the neck and head turn toward you when you are within `look` metres (5) and in front of them, toward the speaker in a chat, toward a neighbour, a point of interest or a random glance; never more than `lookYaw` (1.05 rad) and never round to look behind them; eased in and out. A small nod is a head pitch.
- **Personal space.** Nobody steps closer than their two radii plus 10 cm to another ambient person, closer than `space` (0.8 m) to you, or closer than `storySpace` (1 m) to a story person, unless the step takes them further away. Walkers bear right to pass each other, wait a moment, then one steps back out of a narrow way; someone you walk into steps aside; nobody steps into a wall rectangle, the bounds or anything `blocked(x, z, r)` says is solid.
- **No slide.** Any walking clip (Walk, WalkM, Run, Carry, CarryBagWalk, CarryHeadWalk...) is paced from the body's own stride (`strideOf`), and speeds are kept inside the range a clip can be paced to. They turn round on the spot before setting off backwards, and slow down on sharp bends.
- **The story first.** `keepOff` (an array, or a function of the stage) lists story paths `{ pts: [[x, z], ...], w }` and spots `{ at: [x, z], r }`: nobody picks a goal or pauses on them, and someone held up on one steps off at once. Pass the story people of the step as `story` in the tick (or `opts.story()`): goals keep clear of them. `life.hold(n)` hands a person to the game (a talk, a cut scene): they stop and their clips are the game's until `life.hold(n, false)`. The person you are talking to (`talking`) stops and turns to you.
- **Mood.** `life.mood('lively' | 'calm' | 'sad')`. Calm is a little slower with longer pauses. Sad is slower still, with no laughing, cheering or children's games (children walk about quietly), `Sad1` and `Sad2` as idles, `SitDisbelief` among seated clips, quieter talk, and `MOODS.sad.hide` (40 %) of the lively people (wanderers, children, chat groups) go away, but only while the camera (`view`) cannot see them go. Give `spec.stay: true` to keep someone. Nobody is ever frozen.
- **Phones.** One shared tick. Every 0.25 s each person gets a level by distance from you: full detail within `full` (14 m; 10 with `phone: true`) for at most `maxFull` people (14; 8), mixer, grips and feet every `midEvery` frames (3; 4) out to `mid` (30 m; 22 m), every `farEvery` frames (8; 10) beyond, a light copy beyond `far` (55 m) when the person has `n.lo` (its own `animate()`d body: it gets the same position, turn and clip), and hidden beyond `cull` (off by default). Heads turn only at full detail. Walking and choosing go on for everyone, so nobody is caught frozen when you turn round.

**The system owns its people's bodies:** the tick sets `n.x`, `n.z`, `m.position.x` and `z` (or calls `opts.place(n)` on hilly land), the turn, and updates the mixer (`ctl.mx.update`, `ctl.tick`), `gripTick` and `groundFeet` for each of them. Leave ambient people out of the game's own mixer, `groundFeet` and walker loops, or set `mixers: false` / `ground: false` and do those yourself.

| Call | Use |
|---|---|
| `createAmbient(opts)` | `walls`, `bounds`, `blocked(x, z, r)`, `keepOff`, `story()`, `seed`, `mood`, `phone`, `place(n)`, and any setting above (`full`, `mid`, `far`, `cull`, `maxFull`, `midEvery`, `farEvery`, `r`, `kidR`, `space`, `storySpace`, `walk`, `run`, `look`, `lookYaw`, `still`, `mixers`, `ground`). `stride(n, clip)` replaces `strideOf` (tests). |
| `life.add(n, spec)` | Gives a person a behaviour (`spec.kind`, or a string such as `'wander'`). A body smaller than 0.88 counts as a child (`spec.kid` to say so). |
| `life.tick(dt, world)` | Once a frame. `world = { px, pz, story, talking, view }`. |
| `life.mood(name)`, `life.hold(n, on)`, `life.remove(n)`, `life.clear()` | Scene mood; hand a person to the game; take a person out; empty it when a place is left. |
| `life.issues()` | Setup faults before anyone moves: a spot inside a solid or on a story path, no way between the two ends of an errand, a clip the game does not ship, a clip that shows a held thing (Carry, CarryIdle, CarryBagWalk, CarryHead..., Drink, Write, PlayGuitar, PlayPiano, Rifle...) with nothing in the hand (grip one, `show`, or `prop`), a seated behaviour with no seat or a standing one with a seat, a chat group of one or of more than four. |
| `ambientCheck(life, opts)`, `ambientTest(life, opts)` | The engine side of `?test=ambient`, below. |
| `onKeepOff(list, x, z, r)` | Whether a spot is on a story path or spot. |

**The check, `?test=ambient`.** `ambientCheck(life, { seconds: 60, dt: 1 / 30, route, stops, start, story, view, still: 12 })` runs every ambient person for a minute without drawing, with the player walking `route` (stopping at `stops`, and at people, as the game's collision does) or standing at `start`, and returns `{ lines, stats }`. A line is: **inside** (standing in a wall, the bounds or a blocked spot), **overlap** (two people closer than their two radii, or someone walking into the player), **slide** (walking more than 25 % off the clip's paced speed for over 0.3 s, moving on a standing clip, or walking sideways), **still** (in a lively scene, an idle clip with no step, turn, clip change or head turn for longer than `still` seconds), **story** (standing on a story path or within 1 m of a story person for over a second), plus every `life.issues()` line. `ambientTest` returns the report as text starting `AMBIENT <count>`; expect `AMBIENT 0` in every place. A game wires it like `?test=audit`: build each place, add its people, call `ambientTest(life, { route: <the way a child walks through the place>, story })`, and print it in `#autolog` and `document.title`. `tests/ambient.mjs` runs it on a small fake yard with every behaviour (`npm test`).

## engine/story.js: who moves the story, the hint arrow, and what the player carries

One system for goals, talk targets, speech marks, the hint arrow and the player's hand (owner's rules, November 2026; `docs/STANDARD.md`, "Story flow"). Before it, every game had its own copy of `GOALS`, `TALK_TARGETS`, `NEXT_AFTER_TALK`, `wantsTalk`, `onTalked`, `NUDGE` and `nudgeTarget`. A game moves to it **one step table at a time**: the story only owns the stages in its table and goes idle for the rest, so the old code keeps running there.

**A step** is plain data:

```js
const STEPS = {
  60: { goal: 'Talk to Gran and Mr. Clive.', needs: { talk: ['gran6', 'clive'] }, next: 61 },            // goal shows "0 of 2" by itself
  61: { goal: 'Take water to the nurse.', needs: { do: [{ id: 'water', n: 2, carry: 'bucket' }] }, next: 62 },
  71: { goal: 'Look around the memorial.', needs: { do: ['board', 'monument'] }, explore: true, next: 72 },
  51: { goal: 'Look at the house.', needs: { go: ['house'] }, optional: ['tree', 'wire'], next: 52 },
  65: { goal: 'The night is long.', wait: true },                                                        // a timed scene: no arrow
};
```

| Field | Meaning |
|---|---|
| `goal` | One short sentence, or a function of `{ n, of, got, stage }`. When the step has more than one thing to do, `: n of m.` is added (or put `{n}` and `{of}` in the text where you want them). |
| `needs.talk` | People whose whole first talk moves the step on. |
| `needs.do` | Things to do: an id (once) or `{ id, n, carry }`. Each needs a visible change (`shows`). `carry` names the item drawn in the hand (`options.items`). |
| `needs.go` | Places to walk to. Arriving is the visible change. |
| `story` | Who moves this step (default: `needs.talk`). Everyone else is flavour in this step, including people needed later. |
| `any` | Any order (the default). `false`: one need at a time, in the listed order. |
| `explore` | A look-around step: the arrow waits 5 s instead of 2.5 s. |
| `optional` | Things you may do that never count and never get the arrow (Melissa's tree and wire). |
| `at` | Where a need is when the game's `where()` does not know it: `{ id: [x, z] }` or a function. |
| `shows` | `{ id: (n, of, restoring) => ... }`: the visible change for a `do` need. Or `story.shows(id, fn)`. |
| `flavour`, `after` | Lines for this step only: flavour people, and story people whose part is done. |
| `next`, `end`, `wait` | The stage that follows (or a function), the last step, a timed scene or card with nothing to point at. |

**`createStory(options)`** returns the story. Options: `steps`, `where(id, kind)` (a person's or thing's `[x, z]` in the current place, or null), `player()`, `route(target, player, stage)` (the next point on the way: Port Royal's `nudgeStep`, Eventide's gate and veranda steps), `advance(next)` (the game's own `setStage`), `onStep`, `onGoal(text)`, `onArrow(id)` (once a step, when the arrow first shows: pop the goal open), `flavour: { id: [lines] }` (short lines, cycled; a value may be a function that returns them, so a game's `LATER` can be wrapped as `() => LATER[id](story)`), `meet: { id: [lines] }` (a full flavour talk played once, so Kendal's unreachable `TALK` entries can play), `names: { id: 'Mass Dudley' }` (for the check), `items`, `delay` (2500), `exploreDelay` (5000), `near` (2.2 m).

| Call | Use |
|---|---|
| `sync(stage)` | From the game's `setStage`. Enters the step if the table has it, else the story goes idle. |
| `owns()`, `has(stage)` | Is the current stage the story's; is this stage in the table. While idle every question below returns null or false, so the game's old code decides. |
| `talk(id)` | What a talk should do now: `{ kind: 'story' }` (play their step talk, then `done(id)`), `{ kind: 'meet' }` (their one-off flavour talk), `{ kind: 'flavour', line }` or `{ kind: 'after', line }` (one short line that changes nothing; `line` is null when the table has none, so use the game's `LATER`). |
| `done(id, k)` | The player did a need (a whole first talk, a task, arrived). Counts only for a current, unfinished need, calls its `shows`, sends `onGoal` with the new count, and after the last need calls `advance(next)`. |
| `marked(id)` | Gold talk mark: only unfinished talk needs of this step (in an ordered step, only the next one). Use it in `bubbleTick` in place of "every person". |
| `isStory(id)`, `needs(id)` | Is this person a story person now; is this id an unfinished need now (use it for `wantsTalk` and an action's `on()`). |
| `goal()`, `count()` | The goal text with its count; `{ n, of }`. |
| `tick(now, quiet)` | Once a frame. `quiet` is the game's old test (no talk, card, cut scene or fade). Returns `{ show, id, kind, x, z, final, target }`: the arrow shows once 2.5 s of quiet time have passed since the step began (5 s explore), whether or not the child is moving; it points at the nearest unfinished need, moves to the next one at once when one is done, and hides within `near` metres (`near: true`) so the talk button takes over. A count going up does not restart the wait. |
| `pick()` | The need the arrow would point at, without the timer. |
| `save()`, `restore(s)` | `{ stage, got, met }` in the game's save; `restore` calls each `shows` again with `restoring = true`. |
| `arrowPose({ dx, dz, yaw, ndc, W, H, final })` | Where the `#nudge` element goes on screen and its label ('Here!', 'This way', 'Turn around', 'Look up', 'Look down'), the same rule every game copied. Bog Walk's `placeNudge` can still move it off words and buttons. |

**The helper guide on the ground: `engine/guide.js`.** Every game shows the way with `createGuide({ scene, camera, ground, eye })`, not with words on the screen. Once a frame call `guide.point(now, { x, z, tx, tz, final })` (the next step on the way, and the goal) or `guide.hide(now)`. A gold arrow lies on the ground a few steps ahead, low in the view whatever the pitch and field of view, leaning toward the way to go but never off the side of a narrow phone screen, and it points along the way to go (back toward the player when the goal is behind). It never lies past the goal or inside a wall or counter ahead (a ray a few times a second). A gold ring pulses on the ground round the goal. Near the goal and in view the arrow goes and the ring stays, until the talk or action button takes over. The `#nudge` element stays hidden; `arrowPose` is kept only for old tests. In dev builds `window.__guide.state()` says what is shown (`build/guidetest.cjs` style tests read it). Owner request, 16 Nov 2026: no "Here!" word, an arrow on the ground that points the way.

**`createCarry({ camera, body, side, slot, grip, gripOpts, view })`** is the player's hand. `carry(item)` takes the item from where it was (a pile goes down by one) and shows it on the camera at `slot` in first person, or in the grip of the player's body in third person (`engine/grip.js`). `place(item, spot)` leaves it where it goes (`spot` is an Object3D or `{ parent, at, ry, scale }`). `view('first' | 'third')` moves a held item to the other hand slot, `drop()` lets go, `holding()` says what is held, and `issues()` gives lines for a held item that is hidden, not in the hand or shrunk to nothing (add them to `?test=held`).

**`checkFlow(story, opts)`** and **`flowTest(story, opts)`** are the engine side of `?test=flow`. For every step, in a dry copy that changes nothing in the scene, it fails: more than one thing to do and no count in the goal; an arrow with no target, or one that points at something not needed now (an optional action, a done one); an arrow that does not move to another unfinished need when one is done; a `do` need with no `shows`, or a `carry` item not in `options.items`; an arrow later than 3 s (5 s explore) while the child keeps walking; a story person not in the place; a step with needs and no `next`, or with no needs and not `wait` or `end`; and a flavour or meet line that uses "first", "come back", "go and", "go to", "talk to", "then" or "go back", names another person (`options.names`), or has an em dash. `opts.place(stage)` brings the step's place in so `where()` knows it, `opts.start(stage)` is where the player stands when the step begins, `opts.only` limits the stages. `flowTest` writes the lines and `FLOW <n>` into `#autolog`. Wire it inside `if (__DEV__)`; the public build leaves it out. Unit tests: `tests/story.mjs` (run by `npm test`).

**Switching one table.** In the game's `setStage`, call `STORY.sync(stage)`. Where the game asks "does this person move the story?" (`wantsTalk`), "should this person have a mark?" (`bubbleTick`) and "where does the arrow point?" (`nudgeTarget`), ask the story first when `STORY.owns()` and fall back to the old code otherwise. When a talk ends with the whole first talk heard, call `STORY.done(id)`; in an action's `go()`, call `STORY.done(actionId)`. Then move one stage at a time from `GOALS` and `TALK_TARGETS` into the table and delete the old rows.

## engine/skinprobe.js: how dark a face really looks (dev only)

`skinProbe(renderer, scene, body)` turns a posed person in the scene to four headings, renders each face in the game's own light from 70 cm, and reads the forehead and cheeks. It returns `{ rgb, lo, hi, each }` (0 to 255 as drawn). Wire it as `?test=skin` and compare with the target in `docs/PIPELINE.md`, "Skin". Used by Kendal, Marcus Garvey and Port Royal (Tivoli has a local copy in `games/tivoli/src/checks.js`).

## engine/colours.js: old character colours

`model()` in `engine/loader.js` calls `repairLegacyVertexColours(gltf)` on every load. A character whose scene is not marked `vertexColorSpace: linear` (an older export, made linear twice) has its vertex colours mended once; marked files, scenery and textures are left alone. Nothing to call by hand. To fix a packed body for good, use `tools/people/fix_colours.mjs` (`docs/PIPELINE.md`, section 5).

## engine/input.js: keys and focus

| Name | Use |
|---|---|
| `useInteractionKey(e, action)` | On keydown: E, Enter or Space runs `action()` (talk, use), unless a button, link or text field has focus. Returns true if it acted. |
| `releaseOnBlur(keys, pointers, onRelease)` | Clears held keys and touch pointers when the window loses focus or the page is hidden, so the player does not keep walking. |

Every game and the template import it.

## engine/locomotion.js: the player's visible walk

`updateWalk(model, dx, dz, dt)` drives a visible walking body from the distance it really moved this frame: it turns the body to face the way it went, plays `WalkM` at a speed that fits, and rests when it stops. Port Royal uses it for Lewis Galdy (`?test=walk`).

## engine/loft.js: smooth animal bodies

`loftSkin(rings, sides, ref)` makes one smooth mesh along a curved centreline from rings `[x, y, z, width, height, topColour, bottomColour]`, so a neck and a chest never show end caps where they meet. Kendal and Hurricane Melissa use it for animals (`props.js`).

## engine/ui-audit.js: text overlap

`contentsOverlap(a, b)` says whether the painted text of two elements overlaps (`contentRects(el)` gives the rectangles, clipped to scrolling parents and closed `<details>`). Bog Walk's layout test uses it, and `tests/ui-audit.html` checks it (`docs/TESTING.md`). Other games have their own layout checks in `main.js`.

## engine/checks.js: every automatic check at once (dev only)

`checkAll(adapter, tables)` runs the shared gameplay, continuity and quality checks (journal, links, a11y, keys, chapters, steps, map, faces, budget, autoplay, camera, rule4, sound, continuity, errors) and prints `ALL <n>` into `#autolog`. The adapter's hooks and each check are in `docs/TESTING.md`, section 7. The rules are also exported as plain functions (`continuityIssues`, `itemIssues`, `lightIssues`, `ageIssues`, `gridReach`, `reachIssues`, `boundsIssues`, `stuckIssues`, `cameraIssues`, `resumeDiff`, `journalIssues`, `levelIssues`, `soundRefIssues`, `budgetIssues`, `clipIssues`, `intenseIssues`, `faceIssues`, `watchErrors`, `watchAudio`) and the shared tables `BANNED` (rule 4 clips), `BUDGET` and `SOUNDS`; `tools/lint_content.mjs` and `tests/checks.mjs` use the same functions.

`engine/ui-audit.js` also has `tapTargetIssues(root, 44)`, `contrastIssues(root)` (WCAG AA), `focusOrderIssues(root)` and the colour helpers `parseColor`, `contrastRatio`, `contrastNeed`, `blend`.

## engine/vehicles.js: railway vehicles

Track, steam engines, coaches, carriages, wagons, a platform and smoke, built from boxes, cylinders and turned shapes with sides painted in code. It was Kendal's `trains.js`; Kendal 1957 and Bog Walk 1904 now both use it, and a new game with a railway should too, instead of copying the file. A game calls `makeVehicles` once with its own texture and material helpers, so each game keeps its own textures and caches. The game's own `src/trains.js` is then one line:

```js
import * as gfx from './gfx.js';   /* T, cv, grain, std, solid, mesh, box, cyl, plane, grp, rng, batchStatic (Kendal's gfx.js has them all) */
import { makeVehicles } from '../../../engine/vehicles.js';
export const { RAIL_TOP, TM, rails, railsCurve, wheel, spin, woodCoach, dieselLoco, steamLoco, carriage1845, wagon, platform, makeSmoke } = makeVehicles(gfx);
```

Trains run along x and face -x; every vehicle has its floor at y = 0 (platform height), so the rail tops are at `RAIL_TOP` (-1.1). `spin(train, dx)` turns the wheels as a train moves; `makeSmoke(scene)` is a pool of steam puffs (`emit`, `tick`, `clear`); an engine's `userData.chimney` is where the smoke comes out.

| Builder | What it is | Fits |
|---|---|---|
| `steamLoco('early')` | a 2-2-2 with one big pair of driving wheels and a tall chimney, after the 1845 *Projector* | the 1840s and 1850s |
| `steamLoco('late')` | a 4-4-0 with outside cylinders, a roofed cab and a coal tender | the 1890s to the 1910s (Kendal's 1890s chapter, Bog Walk's 1904 special train) |
| `carriage1845('first' or 'third')` | four-wheel carriages | the 1840s to about the 1880s |
| `wagon()` | a four-wheel goods wagon with slatted sides (for bananas) | the 1880s on |
| `woodCoach(n)` | a wooden bogie coach, numbered n, maroon with cream lining, "J. G. R." | Kendal's 1957 train |
| `dieselLoco()` | a 1950s diesel | the 1950s |
| `rails(len)`, `railsCurve(R, a0, a1)`, `platform(...)` | track on ballast, a curve, a platform with a canopy | any time |

The shapes and colours are general pictures, not copies of a photographed engine (see `docs/games/kendal.md`). Kendal's dev model viewer (`?shot=model&m=late`, and `diesel`, `coach`, `early`, `first`, `third`, `wagon`) shows each one on a piece of track.

## engine/boats.js: boats and ships (17 November 2026)

`rowBoat(o)` builds an open clinker-built boat in code: overlapping planks with a real step at each lap, a keel, stem and stern posts, a transom, ribs, a gunwale with a rubbing strake under it, risers, thwarts with knees, bottom boards, thole pins (wooden pegs: metal rowlocks came later), two oars, a rudder with a tiller, a coil of rope and a bailer. It fits a harbour boat from the 1600s to the 1900s and carries no name or number.

- The bow is at +x and the bottom of the keel is at y = 0. Give it `L`, `beam`, `depth`, a `wood` material for the planking (its texture runs keel to gunwale on u, so a plank texture with one plank per strake fits) and a `timber` material.
- Cost: three meshes (planking, timber, small things), about 6,500 triangles. `oars: 'rowing'` adds one mesh for each oar so they can swing: call `rowStroke(boat, phase, pulling)` each frame. `oars: 'shipped'` lays them in the boat at no extra cost.
- `mask: true` adds an unseen lid at the gunwale that writes depth only. Set `renderOrder = 2` on the sea mesh and the sea is never drawn inside the boat, however low the boat sits or the waves rise. The boat can then have a real, deep inside instead of a false floor.
- `userData` gives `seatTop`, `thwarts`, `boards` (the height of the bottom boards, for putting loads in) and `halfAt(x, y)` (half the inside width there).
- Port Royal uses it three times: the boat that rescues Galdy, the boat on the beach and the ship's boat in Ned's story.

**More boats (17 November 2026).** Four more builders share one vertex-colour material, so each is one or two draw calls and a row of them merges in `batchStatic`:

| Builder | What it is | Cost |
|---|---|---|
| `dugOut({ L, beam, depth, wood, seats, gear })` | a canoe cut from one log: pointed ends that curve up, solid end decks, adze marks inside, a seat board, two paddles, a calabash bailer and a painter (rope) at the bow. Jamaican fishermen used these from Taino times into the twentieth century | 2 meshes (the log on `wood`, the gear), about 3,800 triangles |
| `shipLifeboat({ L, beam, depth, side, deck, davitX, cover, davits })` | a ship's double-ended lifeboat of the 1920s to 1950s in radial davits: white hull with seam lines, varnished gunwale and rubbing band, grab lines in loops, a laced canvas cover (or thwarts when open), falls and blocks | 1 mesh, about 3,500 triangles |
| `steamer({ L, beam, style })` | with `style: 'packet'`, a coastal passenger steamer of the 1880s modelled on photographs of the *Yarmouth* (black hull, plumb stem, a high forecastle for about a third of her length with a small white wheelhouse and the foremast on it, one tall thin funnel amidships with dark cowl ventilators, a long white deckhouse to the stern with a railed boat deck, two low houses and three boats a side); otherwise a three-island cargo steamer of about 1900 to 1925: forecastle, bridge deck and poop, hatches in the well decks, white house and wheelhouse, a plain black funnel with a steam pipe, cowl vents, two masts with derricks and rigging, lifeboats, portholes, anchors | 1 mesh, about 4,400 triangles |
| `schooner({ L })` | a wooden two-masted trading schooner with her sails furled, bowsprit, deckhouse, hatch, a boat on deck and rigging | 1 mesh, about 1,500 triangles |
| `sideWheeler({ L })` | the *Shady Side*, a white side-wheel passenger steamboat of New York Harbor (1873), after James Bard's painting of her: guards, two decks of cabins, awning, pilot house, tall black funnel, paddle boxes, walking beam (51.2 m) | 1 mesh, about 5,500 triangles |
| `steamYacht({ L })` | the *Kanawha*, a white three-masted steam yacht (1899), after a photograph of her: clipper bow and bowsprit, counter stern, low dark deckhouse, one funnel, bridge awning, boats on davits (63.5 m) | 1 mesh, about 3,700 triangles |

- All face +x. The canoe lies on y = 0; the lifeboat's keel is at y = 0 with its davits standing at `deck` on the inboard side (`side` 1 means the ship's side is toward +z); the two ships float with the waterline at y = 0.
- **Rule 3:** none of them carries a name, number, flag or company colours. The funnel is plain black. The two named ships are each shaped from a picture of that ship (sources in `docs/games/garvey.md`); the yacht's buff funnel is an assumption and is marked as one in the code.
- `paintKit()` is the small helper they use (boxes, cylinders, rods, tubes, merged into one mesh with vertex colours). It is exported for other small code-built things: Windrush's porter's barrow uses it.
- Used by Port Royal (the fishing canoe on the spit), Hurricane Melissa and Bog Walk (`dugOut` in `detail.js`), Windrush (the ten lifeboats on the ship, and `lifeboat` in `scenery.js`) and Marcus Garvey (the ships out in the harbour in chapter 5). To look at them alone: `node build/vehicles/viewer2/shoot.mjs <outdir> 'B.dugOut|front34,top'` (any `B.` builder from `engine/boats.js` or `R.` builder from `engine/roadcars.js`, with options as JSON after a second `|`).

## engine/roadcars.js: cars, a bus, a van and lorries (17 November 2026)

Road vehicles with a detailed look at a low cost. Each is drawn from its side outline (the wheel arches cut out of it), pushed out to its width with rounded edges, and leaned in above the waist. Then come wheels with a tyre, a rim and a hub cap, glass, bumpers, a grille, lamps, door lines, handles, mirrors and wipers.

| Builder | What it is |
|---|---|
| `saloonCar({ colour, era })` | a four-door car. `era`: `'1960s'` (small and round, chrome), `'1970s'` (three boxes, chrome bumpers), `'1980s'` (the same with dark bumpers), `'modern'`. `L` and `W` may be given |
| `bus({ colour, band, L })` | a single-deck town bus of the 1960s to 1980s with a front door on the left. `userData.sign` says where a game may put its own route sign |
| `van({ colour, stripe, L })` | a small forward-control panel van |
| `lorry({ colour, body, bodyColour, L, axles })` | a forward-control lorry. `body`: `'tank'` (bands, a hatch, a ladder, an outlet, a hose), `'fire'` (lockers with shutters, a pump panel, a ladder, a hose reel, a red lamp) or `'flat'` |
| `deckerBus({ colour, band, L })` | (17 November 2026) a half-cab double-deck bus of the late 1940s and 1950s: the driver's cab on the right beside the bonnet and upright radiator, a wing over the left front wheel, the upper deck over the cab to a rounded dome, an open platform at the back on the left with the stairs and a pole, a band between the decks, twin rear wheels. `userData.sign` says where a game may put its destination blind. About 3,100 triangles |
| `bonnetLorry({ colour, L })` | (17 November 2026) a bonneted lorry of the 1940s and early 1950s: a long louvred bonnet, an upright grille, rounded front wings with lamps beside the grille, running boards, a cab with a split windscreen, a wooden stake body with headboard and tailboard, twin rear wheels. About 3,600 triangles |

- **Cost: two draw calls a vehicle**, however much detail it has: everything painted is one mesh with vertex colours (`PAINT`), all the glass is a second mesh (`GLASS`). Both materials are shared by every vehicle, so a game's `batchStatic` merges all the parked vehicles in a place into the same two meshes. A car is about 2,900 triangles, the bus 3,100, a lorry 4,600.
- **Rule 3:** nothing carries a maker's badge, a name, a number or a livery. Number plates are blank. The caller gives the colours and adds any sign it has a source for.
- Vehicles face +x and stand on y = 0. Jamaica and Britain drive on the left, so the driver sits on the right (+z) and the bus door is on the left (-z).
- Used by Eventide (cars, the No. 43 bus, the fire engine, the meal van), Hurricane Melissa (the car, the water truck) and Windrush (the cars, and from 17 November 2026 the double-decker in Brixton and the lorry in Kingston). To look at them alone: `node build/vehicles/viewer/shoot.mjs` (a small viewer page kept in the git-ignored `build/` folder) writes pictures to `build/vehicles/kit/`.

## Still inside Port Royal, ready to move next

These systems are general but still live in `games/port-royal/src/main.js`, because they read Port Royal's UI and state directly. When a second game needs one, move it into `engine/` and pass the game's details in as options:

- **Conversation system**: `startConvo`, `showStep`, choices with `ok: true`, `unlock` on a line, speaker animation (`speakerModel`), the talk badge (`TB`, `BUBBLE`, `setActionButton`) and turning to face the player (two `TICKS` hooks).
- **Actions**: the `ACTIONS` list and the nearest-action picker.
- **Journal and goals**: `JOURNAL`, `unlock`, `renderJournal`, `showGoal`, the goal box that folds away.
- **Chapters and saving**: `CHAPTERS` (each with `go`, `done`), `chapterFade`, `saveGame`, the Reset button.
- **Movement and controls**:
  - the keyboard, touch joystick (resting outline) and drag-to-look code;
  - `padRead` for game controllers;
  - the `MV` easing (walking speeds up and slows down smoothly);
  - wall sliding;
  - mouse-only tap-to-walk;
  - the `clampPos` pattern (bounds per place, then collision circles and boxes).
- **People who stroll**: `STROLL` routes, stopping when the player is near, and later-visit lines (`MORE`, `NS_MORE`, `npcTalk`, `nsTalk`).
- **Test harness**: the `?shot=` views and the `?auto=` autoplayer.

`games/_template/src/main.js` has small, self-contained versions of movement, talking and the frame loop, so a new game can start without pulling these out first.

## engine/grip.js: hands that hold things, arms that clear the body

| Name | Use |
|---|---|
| `grip(model, 'Right', item, { handleY, scale, yaw, lift })` | Closes that hand into a fist, hangs the item from the fist by its handle (upright whatever the hand does) and lifts the arm `lift` radians away from the body so the item clears the hip, thigh or skirt. Pose the mixer once first. |
| `spreadArms(model, angle)` | Holds both empty arms a little further out, so hands do not sink into a wide skirt or a jacket. |
| `gripTick(model)` | Call every frame after the mixer update for any model with `userData.grips`. |
| `steadyLoad(model, item)` | A hand that steadies a load on the head (18 November 2026: Miss Cleo's hand waved beside her basket). On a CarryHead clip, a raised hand is bent and turned each frame (two bones, `reachTo`) so the palm rests on the load's rim on that side. Kendal, Melissa and Windrush call it where they put a load on a head. `auditHeld` reports a raised hand more than 5 cm from the load. |

**A hand that holds a hanging thing does not gesture** (17 November 2026, rule 10). `grip()` works out whether the item hangs below the hand (more of it below the handle than above: a case, a basket, a bucket, a lamp, a bag) or is held up (a flag, a palm frond, a cup); pass `hangs: true` or `false` to say so yourself. For a hanging item, `engine/anim.js` keeps the body off clips that wave the hands (`HAND_TALK`: Talk, Wave, Clap, Cheer, Point, Yell, Laugh, Greet, Angry, Thankful): `play()` gives the plain Idle instead, and `calmHands(m)`, which `grip()` calls, moves a body that stood on such a clip onto the Idle. Walking, carrying, sitting and weapon clips are not touched. It came from Eventide, where a crowd man on Talk2 swung his suitcase into his thigh; Eventide's own rule (no talking clip for someone who holds a thing) moved here.

Imported by Kendal, Marcus Garvey (`spreadArms` and `gripTick` only), Bog Walk (`grip` and `gripTick`), Eventide, Hurricane Melissa and Nanny Town. Port Royal still uses the older way (items placed on or parented to the hand bone in `main.js`), which new code must not copy, and Tivoli's two-handed weapon hold is its own code in `games/tivoli/src/weapons.js` (same method, `engine/grip.js` left unchanged). Check the result with `?test=held`.

## Standing upright (17 November 2026)

`engine/anim.js`, `STANCE`: the standing clips (idles, talking, gestures; the list is `STANDING`) were made with the hips back and the knees bent about 30 degrees, so everyone stood in a slump. For those clips `clipFor` turns the thigh back 14 degrees, straightens the knee 28 degrees and sets the foot flat again. Walking, running, carrying, kneeling and seated clips are not changed. A new standing clip must be added to `STANDING`, then looked at from the side with `tools/review/people-sheet.mjs <game> <id> out.png views=side anim=<Clip>`.

## One place for shared guards (17 November 2026)

The owner's rule 10 (CLAUDE.md): a fault that can happen in more than one game is fixed here, once.

- **A look on top of a clip**: `lookBegin(bones)` and `lookEnd(bones)` in `engine/anim.js`. Any code that turns a bone after the mixer has run (a head that looks at you) makes its turns between these two calls. Without them the turns pile up on a still track and the head goes right round. Used by `engine/ambient.js`, Kendal (`storylife.js`), Tivoli (`talk.js`), Port Royal (`main.js`) and Selassie (`main.js`); each used to carry its own copy, and Port Royal had none.
- **A way out waits**: `exitReady(id, distance, radius, nowSeconds)` and `exitsReset()` in `engine/story.js`. You arrive standing on the spot where the way out is, so its button came up at once and read as the next thing to do. An action marked `exit: true` is offered once you have walked off its spot, or after 7 seconds. Call `exitsReset()` when the place changes. Used by Port Royal (into and out of the tavern, out of the warehouse) and Garvey (the gangway and the stair on the Yarmouth). The other eight games were checked on 17 November 2026: they move between places by the story, not by a door you arrive standing on, so none needs it yet. A new door, gate or stair that takes you to another place is marked `exit: true`.
- **Words on the screen**: `hudTidy()` in `engine/hud.js`, called once at the end of every game's `main.js` (and the template's). The toast (`#toast`) sits just above the action button (`#talk`) however tall the button is, and wraps its words. Port Royal had its own copy for a day; it is gone. The toast is placed at once when it or the button comes up or changes its words (a `MutationObserver`), as well as on every drawn frame: on a slow phone, and in the layout test where frames are rare, it lay across the button until a frame was drawn (Kendal at 390x800).
- **A page that keeps itself up to date**: `engine/freshen.js`, put into the menu and every game's page by `tools/dist.mjs` (see `docs/PUBLISHING.md`, "Caches"). Nothing to do in a game.
- **A head never turns past a person's reach** (owner, 18 November 2026: a neighbour in Selassie's lane looked back at you over a shoulder the clip had already turned, the head right round): `engine/ambient.js` measures how far the clip alone has turned the head from the hips (`clipYaw`, from each bone's bind-pose forward) and cuts the look so the two together stay within `headMax` (1.35 rad, about 77 degrees). Every game whose background people run on `engine/ambient.js` has it.
- **Selassie's head smoothing** (`steadyHeads`) now tells the engine's guard what it left (`lookEnd`), so there is one guard for every game.
- **Audit flags**: `userData.soft` (left out of the overlap check: loose stuff lying over things, or a thing that replaces another and is never seen with it) and `userData.hollow` (a room or vehicle people stand in) are read by `engine/audit.js` for every game.
- **The sea**: `createSea(parent, { kind, y, at, size, swell, far, farAt, farDrop, edges, material })` in `engine/sea.js`, with `WATERS` (caribbean, harbour, thames, atlantic), `makeWake`, `rideShip` and `gulls`. It began as Port Royal's sea, was made shareable in Windrush, and every game with sea water uses it now: Port Royal (its earthquake moves the level with `sea.setLevel`), Garvey, Kendal, Melissa, Selassie and Windrush (`games/windrush/src/sea.js` only passes it on). It moves itself while it is drawn, so a game needs no frame hook. Where water lies only a few centimetres under land or above ground that runs on under it, use a low `swell` so a crest or a trough never crosses the land (Selassie 0.5, Melissa 0.3). Rivers and streams (Nanny Town, Bog Walk) keep their own flowing-water code.
- **The helper arrows are brighter** (owner, 17 November 2026): the ground arrow in `engine/guide.js` (thicker chevrons, a warmer gold, up to 0.9 opaque) and the "This way" screen arrow (`#nudge`), whose look is set by `hudTidy()` in `engine/hud.js` for every game.
- **Idle variety** (owner, 17 November 2026: "ensure variety in idle animation, across all games ... including old people"): `engine/anim.js` `fidget` gives anyone standing on a plain idle an occasional look round or head turn (an old person, `userData.elder`, the old idle too), then back to the idle. It leaves alone people the crowd code runs, people holding something, seated people and `userData.still`. The crowd code (`engine/ambient.js`) now defaults to a mix of idles instead of one Idle when a game names none, with the old idle for old people (their body name says elder, old or gran). Every game's `anim-clips.json` carries LookAround, HeadTurn and OldIdle. Since 18 November 2026: a sad person varies between Sad1, Sad2 and Cry, and a seated person between the SitIdle clips (held 5 to 10 s, then back), never a standing look round; a looping rest clip the game put someone on (Abba sitting in the boat) counts as their base; a moment of variety comes every 5 to 11 s, and the return is at a random moment so two people never fall into step. LookOverShoulder is no longer in the mix (it turns the head about 85 degrees). `tickVisible(dt)` updates every shown mixer and ticks its body's controller, for a game that lets the engine run its people (Port Royal: its own loop missed the 1670 cast). Since 18 November 2026 (later): a game may give a body its own list in `userData.idles` (Port Royal's sailor points and laughs; its own copy of this loop moved here), and `userData.still` holds anyone still; each moment lasts 4 to 8 s at most (Mixamo's SitTalk runs 42 s), comes every 4 to 9 s, and plays at its own speed from its own moment; every body's resting clip runs at its own pace (0.92 to 1.08), and a body put back on it starts at a random moment, so nobody moves in step with a neighbour. Port Royal `?test=life`: 0 in three runs in a row.
- **A hidden garment goes with its pieces**: `garmentOf(name)` and `hiddenWith(name, garments)` in `engine/audit.js`. Every game hides a hat not worn (or a waistcoat left off) through `hiddenWith`, so its band, knot or buttons go too (Tivoli, 17 November 2026: a hidden hat's white band floated round an elder woman's head wrap). Tivoli's audit now runs `auditGarments` on every look.

## Doors (engine/door.js, 17 November 2026)

`makeDoor(opts)` draws a door from parts: a frame, a leaf of panels, boards, glass, a flush face or louvres, a handle, hinges and a sill or step. It is a kit, not one door for every building: the owner asked that "the doors should fit their purpose, not one shared one". Choose each building's door from what that building was and when, from sources where they exist, and list stand-ins in the game's doc.

## engine/cine.js: camera scenes on a phone held upright

`renderFramed(renderer, scene, camera, cine)` takes the place of `renderer.render(scene, camera)`. While a camera scene plays (`cine` true) on a screen taller than it is wide, it draws that frame with a taller field of view, so the picture keeps about 85 per cent of the width a square screen would show (at most 96 degrees). The game's own field of view is put back straight after, so walking, aiming and the first-person hand are unchanged; on a wide screen nothing changes. `cineFov(fov, aspect)` gives the number. Used by Kendal, Eventide, Melissa, Nanny Town and Bog Walk (the black bars, `body.cine`), Tivoli (the May 2010 scene, `FIGHT.on`), The Emperor's Arrival and Windrush (their directors, `DIR.on`). Port Royal and Marcus Garvey have no camera scenes (their cut scenes are cards).


## engine/collapse.js: a building that falls down (18 November 2026)

`collapse(group, opts)` makes a building fall in pieces instead of squashing flat. First used for the Myers Ward in Eventide's night chapter (the owner: make it look as good as the Port Royal buildings).

- `fall.start()`, then `fall.tick(dt)` every frame (true once everything is at rest), `fall.done`, and `fall.reset()` to put the building back exactly as it was, for a replayed chapter.
- What happens: the building trembles; the roof (`opts.roof`, or the highest piece) sags, then drops in and crumples; long box walls and floors are cut into panels about `opts.seg` (4.2) m wide, keeping their texture in place, and each panel tips over on its bottom edge, mostly inward, in a wave from the middle out (`opts.from`: `'centre'`, `'+x'`, `'-x'`). Windows, doors and rails fixed to a panel go with it. Timbers and zinc sheets tumble off and settle, smoke rises where pieces land, and the wood chars with a faint glow of embers (`opts.char`).
- Anything lower than `opts.keepBelow` (1.6 m) stays: foundations, steps, low rails, beds of plants. `opts.floorAt(x, z)` gives the height things land on, in the group's own space. `opts.onImpact(k)` fires as each piece lands (a shake, a thud).
- It changes only copies of the building's materials, so no other building chars.
- Port Royal's 1692 houses still use their own sinking and brick code (`sinkTown`, `breakHouse` in `games/port-royal/src/main.js`). Move them onto this when that game is next worked on.
