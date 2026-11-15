# Engine (shared code)

The engine is plain ES modules in `engine/`, bundled into each game by `tools/build.mjs`. A game imports what it needs:

```js
import { CL, mixers, grounded, loadClips, setFallbackClip, clipFor, animate, groundFeet, seamLoop } from '../../../engine/anim.js';
import { AU, soundPref, setSound, audioInit, stepSound, uiSound, cue, tone, noiseHit, gullCry, crackle, chirp, shipCreak, hammer, clink, setG, out } from '../../../engine/audio.js';
import { loader, onLoadFail, script, model, stage } from '../../../engine/loader.js';
```

The other modules, each covered below: `audit.js` and `skinprobe.js` (dev checks), `grip.js` (held things), `placement.js` (seats and routes), `follow.js` (people who follow you, lead you or are sent somewhere), `colours.js` (used by the loader), `input.js` (keys and focus), `locomotion.js` (the player's walk), `loft.js` (animal bodies) and `ui-audit.js` (text overlap). There is no shared people module yet (`engine/people.js` does not exist): see `docs/PEOPLE.md`.

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
| `seamLoop(clip)` | Makes a loop end exactly where it starts. Already applied to Walk, Run, Carry, Tread, SadWalk. |
| `setFallbackClip(c)` | The clip used if a named one is missing. |

What `clipFor` does to each copy:
- It drops scale tracks and moving-root tracks.
- It keeps the hips' height only for clips matching `HIPS_Y` (sitting, stumbling, praying, sword work...).
- It locks seated clips over their seat, facing the way the character is placed.
- `WalkM` is a steadier man's walk made from `Walk`, with less hip and spine twist.

The controller from `animate()` (`ctl`):
- `ctl.play('Wave', once)` plays a clip, cross-faded. With `once` it returns to the base clip afterwards.
- `ctl.play('Walk')` loops a clip.
- `ctl.rest()` goes back to the base clip.
- `ctl.tick(dt)` is called each frame for the once-timers.

Clips in the library: Idle, Run, Walk, StartWalk, StopWalk, Carry, CarryIdle, TurnR, TurnL, TurnRW, TurnLW, JogStumble, StumbleBack, Tread, Talk1, Talk2, Talk3, Point, Wave, WaveSlow, Laugh, Salute, Clap, Cheer, SitDisbelief, SitTalk, SitIdle, SitDrink, Write, Terrified, Sad1, Sad2, Cry, Block, Punch, Sword1, Sword2, Sheathe, PickUp, Pray, Drink. To add one, see PIPELINE.md.

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
| `snapMeshes(group)` | A list of the world-space box of every visible mesh. Take it when a place is built, **before** `batchStatic` merges the meshes. |
| `auditPlace({ id, snap, npcs, walls, bounds, start, actions, people })` | Returns `{ id, floating, inside, stuck }`: objects hanging in the air, people inside a solid (or overlapping another person), and spots the player cannot walk to. |
| `auditHeld(id, model, held)` | For one person who carries things: each held item must be at the posed hand, upright, and clear of the body. Pose the mixer first (`mx.update(0.1)`). |
| `auditSeated(id, body, snap, ground, stats)` | For one seated person (pose the mixer first): the seat must not pass through the thighs (the hip joint rides about 12 cm above the seat top), the person must not hang or sit on nothing, and must not cut into a seat back or wall. Uses the real skinned vertices. |
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

Imported by Kendal, Marcus Garvey (`spreadArms` and `gripTick` only), Bog Walk (`grip` and `gripTick`), Eventide, Hurricane Melissa and Nanny Town. Port Royal still uses the older way (items placed on or parented to the hand bone in `main.js`), which new code must not copy, and Tivoli's two-handed weapon hold is its own code in `games/tivoli/src/weapons.js` (same method, `engine/grip.js` left unchanged). Check the result with `?test=held`.
