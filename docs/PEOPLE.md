# People: the rules every game follows

Read this before you add a single character to any game, new or old. It is the one standard for how people are built, coloured, placed and checked, so that every game looks the same and every new game starts right.

Status, November 2026: the rules below hold now. There is no shared people module yet: `engine/people.js` was planned but does not exist, so every game copies Kendal's code named below. The checks themselves are shared (`engine/audit.js`, `engine/skinprobe.js`). The step-by-step guide for bringing a game up to this standard, and where each game stands today, is `docs/STANDARD.md`.

## 1. Bodies come from recipes, never by hand

- Every person is a JSON recipe built by `tools/garvey/era.py` (MakeHuman body, Mixamo bones, clothes made to fit) and packed by `tools/people/pack.mjs`. Do not model, scale or retint a body by hand in Blender.
- Put a new game's recipes in `tools/<game>/people/`. Name each file after the body (`dockworker.json` makes `dockworker.js`).
- Every recipe must set:
  - `"era"`: the year it is dressed for (for example `1904`). Never leave it out: a missing era quietly builds as 1915. Any era before 1800 uses the 1690 tailoring.
  - `"hat"` as a list of `[kind, material]` pairs, even for one hat: `[["felt", "Hat"]]`. Several hats on one body are fine; the game shows one and hides the rest.
  - `"collar"` as a kind (`"camp"`, `"round"`, `"turn"`, `"stand"`, `"open"`), not `true`. Every collar is sewn to its shirt by `tools/garvey/neckwear.py` (`docs/PIPELINE.md`, "Collars and ties, rebuilt"). On a 1690 or 1730s shirt leave it out for the period's narrow neckband, or write `false` for a plain rounded opening.
  - `"colors"` for every garment it wears, in sRGB 0 to 255, keyed by material name.
- Children are real child bodies, never shrunken adults. Build them at a child's shape with `"upscale"` (so the adult animations fit), then shrink them in the game by about 1 / upscale (upscale 1.26 means scale 0.8). Start from `tools/kendal/people/boy.json` and `girl.json` (not the older copies in `tools/people/kids/`).
- Full list of recipe keys and what they do: `docs/PIPELINE.md`, section 5.

## 2. Building and packing

```bash
MAKEHUMAN=~/mh/makehuman NPC_OUT=build/people/ ~/venv/bin/python3 tools/garvey/era.py "$(cat tools/<game>/people/<name>.json)"
```

```bash
node tools/people/pack.mjs --src build/people --out games/<game>/site/models --lo <name>
```

- Always pass `--out`. Without it the pack lands in Kendal's folder.
- `--lo` also writes `<name>_lo.js`, a light copy for background and crowd figures. Use the full body for anyone the player talks to.
- Budgets: a full body under 32,000 triangles and about 350 to 480 KB; a light copy at or under 6,500 triangles.
- A body used by two games is built once and copied, so the two never drift apart.

## 3. Skin and colour

- Skin colour comes from the recipe's `Skin` value. Do not multiply whole bodies by a colour: that changes skin, hair and clothes together.
- Owner rule 9: build a Black character's `Skin` inside Marcus Garvey's range, about `[134, 90, 64]` to `[156, 108, 80]`, never darker, then lighten the Skin material in the game (Kendal's `SKIN_LIGHT = 1.55` is the starting point). Faces read as a warm brown in every light: never near-black and never pale. West African people sit at the darker end of the range, mixed-heritage people a little lighter, with natural variety between people.
- Check what a face really looks like in your game's lighting with `engine/skinprobe.js` (dev only), never by eye on one screen. The target range, the one factor each game may use, and how to measure are in `docs/PIPELINE.md` ("Skin").
- Hair keeps its own painted colour (dark, or grey for an elder). Collar matches the shirt; a pocket is a shade darker than the shirt.

## 4. In the game (copy Kendal)

Kendal's `games/kendal/src/main.js` and `cast.js` are the model to copy:

- Load each body once and clone it per person (`loadBase`, `skClone`). Turn off frustum culling on skinned meshes.
- Recolour by material name in one place (`makeBody`), with one palette table per period (`LOOKS` in `cast.js`). Multiply only the `Skin` material by the game's skin factor; set `Hair` to 1 (Kendal: `o.material.color.setScalar(1)`), never to the skin factor.
- Show one hat, hide the others (`HATS`, `offHats`).
- Animate with `engine/anim.js` (`animate`, `groundFeet` every frame for standing and walking people, `ctl.pace` for walkers so feet don't slide). Seated people are not grounded; give them a seat height.
- Held items use `engine/grip.js` (`grip`, `spreadArms`, `gripTick` after the mixer). Never parent an item straight to a hand bone by hand.
- Speech marks sit just above the head or hat, measured from the posed model, so children and seated people get them in the right place.

## 5. Checks every game must pass (owner rule 8)

Wire these into the dev build before the first pull request; each must report 0 issues in every place:

| Check | Finds |
|---|---|
| `?test=audit` | floating signs and lamps, people in walls, people inside each other, bad seats |
| `?test=held` | held items cutting into bodies |
| `?test=layout` | overlapping text (also check the phone layout) |
| `?test=cloth` | skin or under-layers showing through clothes, standing, walking, talking, waving and sitting, full and light copies |
| `?test=walkers` | walkers sliding, floating or sinking |
| `?test=skin` | face colour as drawn in the game's own light |
| `?test=resume` | every saved stage reloads in the right place (once the game saves) |

Copy the Kendal blocks for each (search its `main.js` for `q.get('test')`). Then look yourself: close screenshots of every body, front and three-quarter, standing and mid-stride, full and light copy. Look for jagged necklines and hems, collars that float, hands in bodies, and wrong skin tone. See `docs/TESTING.md`.

## 5a. Before a body is done: the people gate (16 November 2026)

The owner asked for the character engine to be settled, so new people do not go round the same faults again. These are the rules. They apply to every new or rebuilt body in every game.

1. **Build it from a recipe with the shared builder** (`tools/garvey/era.py`), with a `face` from `tools/people/faces.json`. No hand edits to a packed body.
2. **Look at it in the game's own stance**, not in Blender: `node tools/review/people-sheet.mjs <game> <id>,<id>_lo`. Check the face from three sides, the chest from the side (a man's fullest point is his chest, never below it), and the light copy's eyes, brows and lips. Look again in the hard clips the game uses: `anim=CarryHeadIdle`, `anim=Kneel`, `anim=Cheer`, a seated clip.
3. **Run the gate**: `node tools/review/people-check.mjs <game>`. It poses every body in every clip the game ships, at three moments each, and runs the shared cloth check (`auditCloth`) and a torn-cloth check (an edge of cloth stretched to more than 2.6 times its length). The game's own `?test=cloth` only tries four or five poses; the gate tries them all, which is where cloth breaks (arms up to carry on the head, kneeling, bending to pick up).
4. **No body may be worse than its line in `tools/checks/people-baseline.json`.** The gate fails if one is. Lower numbers are the aim; after a real improvement, look at the body, then record the new numbers with `--update`. Never use `--update` to hide a fault.
5. **Then the game's own checks** (section 5): `?test=cloth`, `?test=held`, `?test=audit`, `?test=walkers`, and `?test=all` where wired.

Things that are true of every body and must stay true:

- **Stance** comes from `engine/anim.js` `POSTURE`. Do not fix a leaning or bulging body in its recipe.
- **A man's chest** is eased by the builder (`garments.chest`). If it bulges, look from the side in the game's stance first.
- **Faces**: brows are placed from the eyes; lids are relaxed (`eyes`); mouths have a slight smile (`smile`, more on a child). A grave person sets `smile: 0`.
- **Light, crowd and phone copies** keep their faces because the builder marks the face and the packer protects it. Do not simplify a body any other way.
- **Hats** that ride high use `hatdrop`. Hair that must hang over clothes (locs, plaits) is its own piece and stays clear of the shirt.

## 5b. No two people with one face side by side (17 November 2026)

The owner's rule, for every game: nobody stands or walks beside a person who looks the same. A game has a few bodies and many people, so this needs care.

1. **Every recipe has a `face`**, and a body that fills a crowd also lists `"variants": ["<face>", "<face>"]` (names from `tools/people/faces.json`, different from its own `face`). `tools/people/rebuild.mjs <recipe>` then builds `<name>_b` and `<name>_c` with those faces and a slightly different build and hair. Light copies (`<name>_b_lo.js`) go to every game that has `<name>_lo.js`; full copies only to games named in `FULL_VARIANTS` in `rebuild.mjs`. The Emperor's Arrival builds its variants in `tools/selassie/build-people.mjs` (joined `_crowd` and `_phone` copies only; `VARIANTS_ONLY=1` builds just those). Add variants only for bodies that really repeat side by side: each is a download.
2. **The game spreads the faces**: `spreadBodies(extras, count, opts)` in `engine/faces.js`, called once per place before the bodies are loaded. It gives each background person `variant` ('' , '_b' or '_c') so that no two copies of one body with one face come within `near` metres (4; the check uses 2.5). A person who moves is measured over the whole box they walk in. Story people are passed as `fixed`: they keep the body's own face, or the `variant` their look names.
3. **When three faces are not enough** the game gives fallbacks: `alts(spec)` names other bodies of the same sex and age that wear the same pieces (Kendal: `girl` and `girl_small`; Tivoli: the three young men's bodies; Eventide: the crowd's men in shirtsleeves; The Emperor's Arrival at the airport: the four men's and the two women's crowd bodies), with `rebase` to fix size or clothes; and `settle(spec)` makes a walker stay where they are and watch (Kendal). Check the game's `LOOKS` and `HATS` tables before naming a body as an alternative: the tint keys and hats must exist on it.
4. **Story people who borrow one body get their own faces.** In Tivoli a look may name `variant: '_b'` (Mr Clarke, Pastor Grant, Miss Dawn, Coach Davis, Kemesha), so Mass Roy, Mr Clarke and Pastor Grant are three men. One person at two ages keeps one face (Ivy).
5. **The check** is `faceCheck` (`docs/TESTING.md`, section 5, "Look-alikes"): part of every game's `?test=audit`, and of `?test=ambient`. It must report 0.

Left out on purpose: a squad in one uniform and helmet (Tivoli's soldiers and police in the May 2010 street scene, The Emperor's Arrival's police line). They are meant to look alike and their faces are not read at that distance.

## 6. History

Clothes must fit the year and place: check them against period photographs or sources. Fictional people are fine, but their journal page says so.
