# Asset pipeline

Everything runs from the repo root. Scratch output goes to `build/` (git-ignored).

## Setup (once per machine)

- **Node 20+**: run `npm install` (three, esbuild, @gltf-transform/*).
- **Blender as a Python module**: `pip install bpy==5.3.0` (needs Python 3.13).
- **MPFB** (MakeHuman for Blender): install the extension into Blender 5.3. Scripts enable it as `bl_ext.user_default.mpfb`.
- **MakeHuman data**, for eyes and helper meshes: `git clone https://github.com/makehumancommunity/makehuman /tmp/mh`. Then set `MAKEHUMAN=/tmp/mh/makehuman`, or keep that default path.
- **Headless Chrome**, for tests (see TESTING.md).

## 1. Port Royal's people (1690): recipes in `tools/people/`, built by `tools/garvey/era.py`

Each man is one JSON file in `tools/people/` (`galdy.json`, `kofi.json` and so on, one file each). They are built by the same builder as the later games, `tools/garvey/era.py` (section 5). A recipe with top-level `"era": 1690` gets the 1690 cut. The old builder `tools/people/npc.py` is retired and kept only for reference.

```bash
MAKEHUMAN=~/mh/makehuman NPC_OUT=build/people/ ~/venv/bin/python3 tools/garvey/era.py "$(cat tools/people/mendes.json)"   # writes build/people/mendes.glb
node tools/people/pack.mjs --src build/people --out games/port-royal/site/models mendes                                  # writes models/mendes.js
node tools/build.mjs port-royal --dev                                                                                     # then look: ?shot=sheet&who=mendes and ?test=cloth (docs/TESTING.md)
```

JSON fields:
- `name`, `era` (1690)
- `body`: MakeHuman macros 0 to 1: `gender` (1 is male), `age`, `muscle`, `weight`, `height`, `proportions`, `african`, `caucasian`, `asian`.
- `garments`:

  | Key | Values |
  |---|---|
  | `sleeve` | 0 to 1, how far down the arm the shirt sleeve comes. Sleeves hang as loose tubes. Without a coat the shirt ends in a narrow neckband, open at the throat |
  | `coat` | `true`. A row of cloth buttons runs down the front (`coatbuttons: false` leaves them off) |
  | `coatsleeve` | 0 to 1; the sleeve ends in a wide cuff and the shirt cuff shows below it |
  | `coatsleeves` | `false` gives a coat with no sleeves, worn over the whole shirt (Benning) |
  | `coathem` | skirt length above the knee, for example 0.02 to 0.12 (longer skirts clip the knees when walking) |
  | `coatopen` | `true` by default: the skirt is open at the front below the waist, as 1690 coats were, so the legs pass through when walking. Set `false` for a closed skirt. There is also a vent up the back. The front panels follow their own thigh and the back follows the hips, so walking does not push the legs through the cloth |
  | `breeches` | `true`: cut full and gathered into a band below the knee. Under a coat's skirt the fullness is kept to the front, so the breeches cannot push out through the skirt |
  | `breechkind` | `"slops"` for wide open sailor breeches |
  | `shoes`, `stockings`, `apron` | `true`. Shoes are one smooth shape with a thin joined sole. The apron rides on the thighs, so a knee lifts it |
  | `buckles` | `true`: a small metal buckle and a tongue on each shoe |
  | `hat` | `"felt"` (a low round crown and a broad brim, turned round the head's own outline) or `"cap"` (hair shows below it) |
  | `bands` | `true` gives a cravat: a band round the neck, a knot and two ends that lie on the coat |
  | `hairvol` | 0 to 1 |

- `colors`: sRGB 0 to 255 for each material: Skin, Hair, Shirt, Coat, Breeches, Stockings, Shoes, Hat, Apron, Bands and so on. Every garment you use needs its colour, or the script stops with a KeyError, except these, which `era.py` fills in when they are left out:
  - `Sole` (dark brown), `Belt`, `Buttons`, `Buckle`, `Band` (a hat band), `Ribbon` and `Sock` (off-white) have fixed defaults;
  - `Collar` is the `Shirt` colour, and `Pocket` is the shirt a little darker (`Shirt` x 0.86);
  - each hat's material (for example `Hat2` in `[["felt", "Hat2"]]`) is the `Hat` colour, and its band is `Band`;
  - `CoatButtons` is the coat a little darker (1690 coats), and `ShoeBuckle` a dull metal (1690 shoes).
  - **Skin (owner rule 9).** Use a `Skin` colour inside the Marcus Garvey range, about `[134, 90, 64]` to `[156, 108, 80]`, never darker; vary it a little between people. The builders now write linear RGB to a FLOAT_COLOR layer and mark the exported scene with `vertexColorSpace: linear`. Keep that marker when packing. `engine/colours.js` repairs the extra sRGB transfer in older, unmarked character exports once at load time; scenery and textures are untouched. Do not run that repair twice or change the skin recipes to compensate for an export error. Each game can still use its face-lighting material multiplier. Judge faces in game screenshots in daylight, indoors and at night.

Built in, so nothing shows through when the body moves (all of it only for `era` before 1800, so later games build as before):
- **Lining.** The body under the clothes is not thrown away. It is kept, thinned, as a `Lining` piece painted in the colour of the cloth over it. Loose cloth creases when an arm drops; whatever shows in a crease is then the same cloth, never skin or a dark hole.
- **Neck.** The cravat (or the shirt's neckband) has a yoke under it that lies on the skin, and the coat has a narrow facing of its own cloth round the sides and back of the neck. No skin shows there when the shoulders lift.
- **Weights.** Shirt and coat bone weights are averaged across the cloth, so a sleeve and the chest bend as one piece. Each leg of the breeches follows its own leg only.
- **Hair** grows from the body's own scalp line and fades into the skin at its edge.

**Abba and Grace.** Abba was built by `tools/blender/abba.py` and then given her Idle clip by hand, so she cannot be rebuilt by `era.py`. Her source is `games/port-royal/assets/characters/abba_animated.glb`. `node tools/people/abba_fix.mjs` applies small fixes to that file (her apron stands a little further out from her skirt, so the skirt does not come through it when she walks) and writes `build/people/abba.glb`; pack it like the men. Grace is Abba recoloured in code, with a different shape and a basket on her head. A new 1690 woman should be built with `era.py` (`woman`, `skirt`, `hat: "wrap"`).

## 2. Animations: `tools/anims/`

All clips are retargeted onto one rig (`shared/rig/char.blend`), so they play on every character.

1. Download from mixamo.com:
   - upload any of our characters (for example `games/port-royal/assets/characters/galdy.glb` exported as FBX), or use the default;
   - pick the clip, tick **In Place** for anything that walks;
   - download **FBX, Without Skin**.
2. Put it in `shared/anim-sources/` and add `"ClipName": "File.fbx"` to `tools/anims/clips.json`.
3. Retarget and bake all clips:
   ```bash
   timeout 3000 python3 tools/anims/retarget_clips.py tools/anims/clips.json   # writes build/anims.glb (long: about 30 to 50 minutes)
   ```
   This copies world rotations bone by bone, plus the hips position, so clips made on other bodies keep good poses on ours.
4. Optimise: `node tools/anims/optimize_clips.mjs`.
   - It drops scale tracks, moving-root tracks and fingers 2 to 4, resamples, and compresses with meshopt.
   - Its `UNUSED` set removes clips no game uses; keep it in step with what games call.
   - Check the input and output paths at the top of the file.
5. Pack it as `shared/models/anims.js` (step 4) and rebuild the games.

## 3. Buildings, ships, textures: `tools/blender/`

- `street.py`, `variant.py` with `variants.json`: the six 1690 town houses (`h1` to `h6`), with brick, plaster, timber and clay-tile materials.
- `ships.py`: the merchant ship and the sloop, with flags.
- `tex.py`, `tex2.py`: the town texture atlas (`tex_town`) and the harbour textures (`tex_harbour`).

In the game, `TEXMAP` maps material names (Brick, Stone, ClayTile, Wood, Plaster, LeadedGlass, Hull, Deck, Sail, Flag...) to these textures. New buildings made in code can borrow them: see `houseMat()` and `worldUV()` in Port Royal's second street.

## 4. Compress and pack models

**Characters** are always packed with `tools/people/pack.mjs` (section 5). Do not use the commands below for people.

**Buildings, ships and other models** (`tools/blender/` output) are compressed and packed like this:

```bash
node tools/optimize_models.mjs --dir games/port-royal/site/models h1 h2    # writes h1.m.glb and h2.m.glb next to h1.glb and h2.glb
python3 tools/pack_models.py ...                                           # or the one-liner below
for n in h1 h2; do printf '(window.__models=window.__models||{})["%s"]="%s";' $n "$(base64 -w0 games/port-royal/site/models/$n.m.glb)" > games/port-royal/site/models/$n.js; done
```

Only the `.js` files are loaded by the game. Check the arguments at the top of `tools/optimize_models.mjs` before you run it (it also has an older `--chars` mode for characters, which `pack.mjs` replaced).

## 5. The clothes builder: `tools/garvey/era.py` (every game's people)

`era.py` builds every body that is built from a recipe: Port Royal (`tools/people/*.json`), Marcus Garvey (`tools/garvey/people/`), Kendal 1957 (`tools/kendal/people/`, including the real child bodies `boy`, `girl` and `girl_small`), Tivoli (`tools/tivoli/people/`), and the recipes waiting to be built for Nanny Town (`tools/nanny/people/`) and Hurricane Melissa (`tools/melissa/people/`). Eventide's three 1980 bodies were built by its own copy, `tools/eventide/people.py`. The rules for every game are in `docs/PEOPLE.md`. Set up Blender, MPFB and MakeHuman as in `tools/garvey/README.md`.

`tools/people/kids/` holds older copies of `boy.json` and `girl.json`. Kendal's copies in `tools/kendal/people/` are the current ones (camp and round collars, a pocket, wider legs); build children from those.

```bash
MAKEHUMAN=~/mh/makehuman NPC_OUT=build/people/ ~/venv/bin/python3 tools/garvey/era.py "$(cat tools/kendal/people/woman57.json)"   # writes build/people/woman57.glb
node tools/people/pack.mjs --out games/kendal/site/models --lo woman57     # trims, compresses, writes woman57.js and woman57_lo.js
```

`era.py` settings (environment variables):

| Variable | What it does |
|---|---|
| `NPC_OUT` | The folder the `.glb` is written to, ending in `/`. Default `games/port-royal/site/models/`, so always set it to `build/people/`. It also saves `build/people/<name>.blend`. |
| `MAKEHUMAN` | MakeHuman's inner `makehuman` folder (for the eyes). Default `/tmp/mh/makehuman`. |
| `FOLDS=1` | Prints how many faces of each piece face the wrong way. |
| `PROBE` | Debug output used while working on the builder. |

`tools/people/pack.mjs` options:

| Option | What it does |
|---|---|
| `--out <folder>` | Where `<name>.js` goes. **Always pass it**: the default is `games/kendal/site/models`, so leaving it out writes into Kendal. |
| `--src <folder>` | Where the built `.glb` files are read from. Default `build/people`. |
| `--max <n>` | The most triangles a full body keeps. Default 32,000. |
| `--lo` | Also writes `<name>_lo.js`, a light copy for crowds and far-off people. |
| `--lomax <n>` | The triangle target for a light copy. Default 5,900. Pieces that are never simplified (collar, tie, belt, hat, sole and so on) come on top, so real light copies are about 5,900 to 6,300 triangles. |
| `--cloth <share>` | In a light copy, the share of their triangles the clothes keep (default 0.36, at most about 1,900 cloth triangles in all). |

It prints each body's triangles and size, for example `woman57: 61000 -> 25554 tris, 380 KB; lo 6156 tris, 182 KB`.

`tools/people/fix_colours.mjs` mends a packed body that was built between the two colour fixes (Skin written right, every other colour made linear twice, so far too dark). It undoes the extra step on every piece except Skin, marks the body `vertexColorSpace: linear`, and skips a body that is already marked. With `--skin old=r,g,b new=r,g,b` it also rescales Skin to a new recipe colour, without a rebuild:

```bash
node tools/people/fix_colours.mjs games/kendal/site/models/boy.js --skin old=150,102,74 new=146,98,72
```

What it makes (keys in `garments` unless noted):

| Key | What it does |
|---|---|
| `trousers`, `shorts`, `legwidth` | Trouser legs hang as tubes from the thigh, with a crease. `shorts` stops above the knee. |
| `sleeve`, `jacket`, `waistcoat`, `vwaist` | Sleeves hang loose with a cuff. A jacket gets lapels, buttons and a skirt past the hips. |
| `collar`: `"turn"`, `"stand"`, `"open"` | A collar built round the neck with a yoke under it, so no skin shows between collar and shirt when the body moves. `true` picks by `era` (top-level year). |
| `collar`: `"camp"`, `"round"`, `leaf`, `vdepth`, `vslope` | The flat collars of 1950s shirts and blouses (not for 1900 to 1930 people): `camp` is a broad open pointed collar over a narrow V, `round` a flat round collar. `leaf` is how wide the collar lies on the shirt. |
| `puff`, `sash`, `pocket`, `hang` | Puffed short sleeves, a deep smooth sash (material `Belt`), a chest pocket (material `Pocket`, a clean rectangle), and how far loose cloth hangs from the chest. |
| `tie`, `buttons`, `belt` | A tie with a knot, a button band, a belt with a buckle (`belt: "always"` keeps it under a waistcoat). |
| `skirt`, `hem`, `flare`, `pleats` | `hem` 0 is the ankle, 1 the knee. Soft folds deepen toward the hem. |
| `shoes`, `lowshoes`, `socks` | Shoes with a thin sole joined to the upper. With a skirt the shoe is low cut. `socks` is how far up the shin. |
| `hat` | One kind, or a list `[[kind, materialName], ...]` so a game can show one and hide the rest. Kinds: `felt`, `flat`, `trilby`, `straw`, `bowler`, `top`, `church`, `pillbox`, `peaked`, `wrap`. |
| `hair`: `"puffs"`, `"plaits"`, `"afro"`; `bun`, `hairvol`, `recede`, `temples`, `bays`, `fade` | Hair grows from the body's own scalp line and fades into the skin at the edge, so hairlines are smooth. `bays` are receding temples, `fade` cuts the sides short. |
| `moustache`, `moustachewidth`, `moustachedroop`, `brows`, `browwide` | A soft moustache that feathers out at its edges; heavier eyebrows. |
| top-level `targets` | MakeHuman face and body targets by name (for a likeness), `lr-` for both sides. |
| top-level `upscale` | For a child: the body is built at a child's shape, then enlarged so animations fit. The game shrinks it back with `scale`. |

Marcus Garvey's face (`garvey1914.json`, `garvey1916.json`) was shaped against a photograph the owner supplied. Check any change to it against that photograph.

`tools/people/pack.mjs` never simplifies small pieces (collar, tie, belt, hat, sole) and never moves the edge of a cloth, so hems and necklines stay clean. Aim for under 32,000 triangles and about 350 to 480 KB per full body.

**Cloth rules for every era after 1800** (they are skipped for the 1690 recipes, which build as before):

- Cloth has ease. A shirt, waistcoat or jacket is moved out to an eased outline of the torso (the hollows between shoulder blades and under the bust are bridged, and the cloth hangs from the fullest part of the chest until the waistband gathers it in), then given a set clearance: shirt 9 mm, waistcoat 19 mm, jacket 21 to 29 mm. A last clearance pass pushes any point that is still inside or under the layer beneath it.
- Whatever is covered is deleted: skin under a shirt, trousers, skirt or jacket is removed wherever it is well inside the garment's edges, so it cannot show through in any pose. A jacket also removes the shirt's back and sides, and the waistcoat's back and sides.
- Layers move as one: a waistcoat or jacket takes the bone weights of the shirt under it, the tucked-in shirt tail takes the trousers' waist weights, and collar, placket, pocket, buttons, tie and lapels take the weights of the garment they lie on.
- Felt hats are one closed shell that clears the hair. A bun under a hat sits low on the nape. Aprons lie on the trousers.
- Check with `?test=cloth` (see `docs/TESTING.md`) after every change, for both games.
- A man's shirt, waistcoat and jacket fall almost straight from the chest to the waist (7 cm in a metre at the front, against 22 cm for a blouse), and the eased outline bridges across from the chest to the shoulders, so a man's chest never reads as two mounds.
- Waistcoat and jacket take their bone weights from the shirt under them (read from the nearest face and blended), the shirt's torso has its arm weights faded out and evened, and the base of the neck (skin and shirt neckline alike) follows the chest. These keep V necks, necklines and hems clean while walking instead of breaking into saw teeth.
- Clearance pushes are spread over neighbouring points and cut edges are relaxed afterwards, so no face folds over (`FOLDS=1` prints how many faces of each piece face the wrong way).
- Socks are their own `Sock` material cut along one line, so their top edge stays clean on light copies. The build is repeatable: the same recipe gives the same file.

## Skin

**Rule (owner rule 9).** Build every Black character's `Skin` inside Marcus Garvey's range, about `[134, 90, 64]` to `[156, 108, 80]`, never darker, with a little variety between people. West African people (Kofi) sit at the darker end of that range, mixed-heritage people (buc1, the sailor) a little lighter. Light-skinned Port Royal characters keep their own recipe colours. Faces must read clearly in every light: never near-black, never pale.

**How colours reach the screen.** `tools/garvey/era.py` writes the recipe colours, made linear, into a float colour layer and marks the exported scene `vertexColorSpace: linear`, so every recipe colour (skin and cloth alike) is drawn as written. `engine/colours.js` repairs older, unmarked character files, which were made linear twice and drew far too dark. Bodies built between the two fixes were brought up to date with `tools/people/fix_colours.mjs` (it also rescales Skin when a recipe's skin changes, without a rebuild).

**Per game.** Each game multiplies the `Skin` material by one documented factor for its own light: Kendal `SKIN_LIGHT = 1.55` (rule 9), Garvey `SKIN_K = 1.2`, Port Royal `SKIN_K = 1.0` (its sun, sky and tone mapping are already bright). New games start from Kendal's 1.55 and check with `?test=skin`. Kendal crowds vary skin by 0.9 to 1.15 only.

**How to measure.** `?test=skin` in each game's dev build (`engine/skinprobe.js`) renders each face in that game's own light from four headings and prints the mean, darkest and lightest colour (Garvey prints indoor and outdoor light). Check new people against the target before calling them done.

**Not yet covered.** Abba and Grace in Port Royal still come from `tools/blender/abba.py` and draw much darker and redder (about 63,18,9); they need rebuilding with `era.py`.

