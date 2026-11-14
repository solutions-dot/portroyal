# People: the rules every game follows

Read this before you add a single character to any game, new or old. It is the one standard for how people are built, coloured, placed and checked, so that every game looks the same and every new game starts right.

Status, November 2026: the rules below hold now. A shared engine module (`engine/people.js`) and a shared test module are being built to replace the per-game code; until they land, copy the Kendal code named below. When they land, this page will be updated and every game will move to them.

## 1. Bodies come from recipes, never by hand

- Every person is a JSON recipe built by `tools/garvey/era.py` (MakeHuman body, Mixamo bones, clothes made to fit) and packed by `tools/people/pack.mjs`. Do not model, scale or retint a body by hand in Blender.
- Put a new game's recipes in `tools/<game>/people/`. Name each file after the body (`dockworker.json` makes `dockworker.js`).
- Every recipe must set:
  - `"era"`: the year it is dressed for (for example `1904`). Never leave it out: a missing era quietly builds as 1915. Any era before 1800 uses the 1690 tailoring.
  - `"hat"` as a list of `[kind, material]` pairs, even for one hat: `[["felt", "Hat"]]`. Several hats on one body are fine; the game shows one and hides the rest.
  - `"collar"` as a kind (`"camp"`, `"round"`, `"turn"`, `"stand"`), not `true`.
  - `"colors"` for every garment it wears, in sRGB 0 to 255, keyed by material name.
- Children are real child bodies, never shrunken adults. Build them at a child's shape with `"upscale"` (so the adult animations fit), then shrink them in the game by about 1 / upscale (upscale 1.26 means scale 0.8). Start from `tools/kendal/people/boy.json` and `girl.json`.
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
- Black characters read as a warm, rich brown in daylight: never near-black and never light. West African people sit at the darker end, mixed-heritage people a little lighter, with natural variety between people.
- Check what a face really looks like in your game's lighting with `engine/skinprobe.js` (dev only), never by eye on one screen. The measured target range and method are being set now and will be written in `docs/PIPELINE.md` ("Skin"). Until then, match Kendal.
- Hair keeps its own painted colour (dark, or grey for an elder). Collar matches the shirt; a pocket is a shade darker than the shirt.

## 4. In the game (copy Kendal until `engine/people.js` lands)

Kendal's `games/kendal/src/main.js` and `cast.js` are the model to copy:

- Load each body once and clone it per person (`loadBase`, `skClone`). Turn off frustum culling on skinned meshes.
- Recolour by material name in one place (`makeBody`), with one palette table per period (`LOOKS` in `cast.js`).
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

Copy the Kendal blocks for each (search its `main.js` for `q.get('test')`). Then look yourself: close screenshots of every body, front and three-quarter, standing and mid-stride, full and light copy. Look for jagged necklines and hems, collars that float, hands in bodies, and wrong skin tone. See `docs/TESTING.md`.

## 6. History

Clothes must fit the year and place: check them against period photographs or sources. Fictional people are fine, but their journal page says so.
