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
   timeout 3600 ~/venv/bin/python3 tools/anims/retarget_clips.py tools/anims/clips.json   # writes build/anims.glb (about 11 minutes for 96 clips on 15 November 2026)
   ```
   This copies world rotations bone by bone, plus the hips position, so clips made on other bodies keep good poses on ours.
   It exports every frame, each clip starting at time 0 on its own first frame and ending on its own last frame. Mixamo loops end on their first pose, so a looping clip closes exactly. (Until 15 November 2026 it exported every other frame from frame 1 on a timeline that starts at 0, so every clip held its first pose for a frame, a small pause at each loop, and dropped its last frame, which left a 7.3 degree seam in the Walk.)
4. Pack: `node tools/anims/optimize_clips.mjs` (reads `build/anims.glb`, writes `shared/models/anims.js`, about 5 seconds).
   - The clean-up is `tools/anims/clean_clips.mjs`, shared with Tivoli's packer: it drops scale tracks, moving-root tracks and fingers 2 to 4, keeps every other frame plus the last one, resamples, and compresses with meshopt.
   - Every clip in `tools/anims/clips.json` goes in the library, and it warns about any that are missing. A game only downloads the clips in its `anim-clips.json` (below), so a clip no game plays costs nothing, except in a game with no `anim-clips.json` (Port Royal, which gets the whole library).
5. Check: `node tools/anims/check_clips.mjs` prints each clip's length and loop seam (the largest bone turn between its last pose and its first; a looping clip should be under about 2 degrees), and lists clips that are the same movement as another (the same Mixamo clip downloaded twice). `--vs old.js` compares each clip with an older library, pose by pose.
6. Rebuild the games (`node tools/build.mjs <game>`).

**Changing a few clips** (a hand-made clip redone, say) does not need the whole library retargeted again: retarget just those (`ANIMS_OUT=build/anims_few.glb ~/venv/bin/python3 tools/anims/retarget_clips.py few.json`, seconds), then `node tools/anims/merge_clips.mjs build/anims.glb build/anims_few.glb` puts them into the full retarget, and step 4 packs it.

**Which clips a game ships.** `games/<game>/anim-clips.json` lists the clips that game plays; `tools/build.mjs` trims the game's copy of the library to them. If a game starts playing a new clip, add its name there, or it will be missing in that game.

**Clips for one game only.** A clip that only one game needs stays out of the shared library, so other games do not change. Tivoli does this: its sources are in `tools/tivoli/anim-sources/`, its list is `tools/tivoli/clips.json`, `ANIMS_OUT=build/anims_tivoli.glb ~/venv/bin/python3 tools/anims/retarget_clips.py tools/tivoli/clips.json` retargets them (about 30 seconds; without `ANIMS_OUT` it writes `build/anims.glb` and replaces the shared retarget, so move that aside first), and `node tools/tivoli/pack_clips.mjs build/anims_tivoli.glb` writes `games/tivoli/site/models/anims_tivoli.js`, which the game loads after the shared library. Copy that pattern.

**Hand-made clips: `tools/anims/handmade.py`.** For a movement no clip library has (a load on the head, a speech to a crowd, comforting someone), the clip is built by hand in Blender and saved as an FBX like a Mixamo download, so steps 3 to 5 above take it unchanged.
- How a clip is built: it starts from a library source where that helps (the Walk or the calm part of the Idle in `shared/anim-sources/`, read onto our rig the same way `retarget_clips.py` reads it), then poses are layered on as smooth curves of time: `turn` a bone, `steady_head` (head level in the world), `level` (shoulders level), `stand` (slow weight shifts with the feet planted), `breathe`, and `arm` (a two-bone IK: the wrist goes to a spot, the elbow points a given way, the hand faces a given way). Every curve loops (`Waves`, `Spline`, `bump`), the last frame is set equal to the first, the hips stay in place, and it runs at 30 frames a second.
- To add one: write a function that returns a list of poses, put `@clip('Name', 'what it is built on')` above it, run `python3 tools/anims/handmade.py Name` (it writes `shared/anim-sources/handmade/Name.fbx` and prints the loop seam and how close the hands come to the head), add `"Name": "handmade/Name.fbx"` to `tools/anims/clips.json`, then retarget and pack as usual (or retarget just it and merge, as above). Seated clips must be named `Sit...` so the engine keeps them on the seat.
- To try new clips without rebuilding the library: `ANIMS_OUT=/tmp/new.glb python3 tools/anims/retarget_clips.py my_list.json` retargets only the clips in `my_list.json`, in seconds.
- Keep it natural: let the limbs start a little apart in time, ease in and out, add a slow weight shift and breathing, and look at renders on a real game body, front and side, before calling it done. Only the first joint of each finger survives packing (`clean_clips.mjs` drops joints 2 to 4), so curl fingers at that joint.

| Clip | What it is | Built on | Source |
|---|---|---|---|
| `CarryHeadWalk` | walking with a load on the head, right hand steadying it at the top rim; shorter, flatter steps, head and shoulders level | Walk | hand-made, CC0 (this project) |
| `CarryHeadWalk2` | the same with both hands on the load (a heavy load) | Walk | hand-made, CC0 (this project) |
| `CarryHeadIdle` | standing with a load on the head, right hand on it; slow weight shifts, she turns her head and resettles her hold | Idle | hand-made, CC0 (this project) |
| `Speech` | speaking to a crowd, 12 s: weight shifts, open arms, a raised arm, a hand to the heart, looking round the crowd | Idle | hand-made, CC0 (this project) |
| `ComfortGive` | an arm round someone standing 0.43 m to the right and 0.145 m in front (same facing): his whole body turns about 30 degrees to them and leans in, the upper arm angles down and back, the elbow bends about 90 degrees behind their back and the forearm lies across their shoulder blades to the hand at their far shoulder; head turned and bowed, slow pats; free arm relaxed | Idle | hand-made, CC0 (this project) |
| `ComfortHand` | the simplest option: facing the other person 0.58 m in front, the left hand resting on their right shoulder, two slow pats | Idle | hand-made, CC0 (this project) |
| `ComfortChild` | an adult's hand on the near shoulder of a child (about 0.6 of adult height) standing 0.34 m to the right and 0.24 m in front, clear of a skirt; the adult leans to them (pair it with `ComfortTake` on the child) | Idle | hand-made, CC0 (this project) |
| `SitComfortGive`, `SitComfortTake` | the comfort pair seated on one bench, the one comforted 0.465 m to the right and 0.285 m further forward (on the front of the seat), his elbow bent behind her back, his free hand on his knee, knees kept together | SitIdle | hand-made, CC0 (this project) |
| `ComfortTake` | the one being comforted: upright, head bowed and tipped towards the giver on the left, hands loose in front, once a loop a hand to the eyes, slow breaths | Idle | hand-made, CC0 (this project) |
| `SitScared` | seated, tense: hunched, gripping the seat beside the thighs, looking up and round, two small flinches | SitIdle | hand-made, CC0 (this project) |

The head-load clips are planned for a load about 0.2 m in radius and 0.25 m tall sitting on the crown (the game holds it on the Head bone with `hold()`); a wider load needs `LOAD_R` in the script changed so the hand stays outside it. `ComfortGive` and `ComfortTake` are a pair: start them together and place them exactly as the table says, facing the same way (ComfortHand: facing each other). `python3 tools/anims/pair_check.py` poses both real bodies at 32 moments and reports any overlap by body part, the resting hand's height above the other person, and hands through one's own body; every comfort pair must report none. `--search Pair` slides the other person round the planned spot and lists the places with no overlap and the hand nearest the middle of its band.

**A new body for Mixamo.** Set top-level `"fbx": true` in a recipe and `era.py` also writes `build/people/<name>_for_mixamo.fbx`, a rest-pose copy with skin to upload to mixamo.com.

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
| `sleeve`, `jacket`, `jacketsleeve`, `jackethem`, `waistcoat`, `vwaist` | Sleeves hang loose with a cuff (`sleeve` 0 to 1, default 0.86). A jacket gets lapels, buttons and a skirt past the hips; `jacketsleeve` is how far down the arm its sleeve comes (default 0.9) and `jackethem` moves its hem down (bigger) or up (smaller; default -0.05 after 1800). `vwaist` gives a waistcoat a V opening at the front. |
| `woman`, `highneck` | `woman` cuts the shirt as a blouse that follows the figure (and leaves off the button band). `highneck` brings the neckline up to the throat. |
| `scarf` | A neck scarf with a knot at the throat (material `Scarf`). |
| `collar`: `"turn"`, `"stand"`, `"open"`; `softcollar` | A collar built round the neck with a yoke under it, so no skin shows between collar and shirt when the body moves. `true` picks by `era`: a stiff `stand` collar before 1925, a `turn` collar from 1925 (and also before 1925 when `softcollar` is set). Write the kind, not `true` (`docs/PEOPLE.md`). |
| `collar`: `"camp"`, `"round"`, `leaf`, `vdepth`, `vslope` | The flat collars of 1950s shirts and blouses (not for 1900 to 1930 people): `camp` is a broad open pointed collar over a narrow V, `round` a flat round collar. `leaf` is how wide the collar lies on the shirt. |
| `puff`, `sash`, `pocket`, `hang` | Puffed short sleeves, a deep smooth sash (material `Belt`), a chest pocket (material `Pocket`, a clean rectangle), and how far loose cloth hangs from the chest. |
| `tie`, `buttons`, `belt` | A tie with a knot, a button band, a belt with a buckle (`belt: "always"` keeps it under a waistcoat). |
| `skirt`, `hem`, `flare`, `pleats` | `hem` 0 is the ankle, 1 the knee. Soft folds deepen toward the hem. |
| `shoes`, `lowshoes`, `socks`, `stockings` | Shoes with a thin sole joined to the upper. With a skirt the shoe is low cut. `socks` is how far up the shin. `stockings` (1690) colours the leg from knee to ankle. |
| `hat` | One kind, or a list `[[kind, materialName], ...]` so a game can show one and hide the rest. Kinds: `felt`, `flat`, `trilby`, `straw`, `bowler`, `top`, `church`, `pillbox`, `peaked`, `wrap`. `brim` sets the brim width (1 is the wide 1690 brim, about 0.4 a short one). |
| `hair`: `"puffs"`, `"plaits"`, `"afro"`, `"none"`; `bun`, `hairvol`, `recede`, `temples`, `bays`, `fade` | Hair grows from the body's own scalp line and fades into the skin at the edge, so hairlines are smooth. `bays` are receding temples, `fade` cuts the sides short. |
| `moustache`, `moustachewidth`, `moustachedroop`, `brows`, `browwide` | A soft moustache that feathers out at its edges; heavier eyebrows. |
| top-level `targets` | MakeHuman face and body targets by name (for a likeness), `lr-` for both sides. |
| `apron` | An apron that lies on the trousers, a hand's breadth clear of them, and rides on the thighs. |
| top-level `era` | The year the person is dressed for. Before 1800 uses the 1690 tailoring (section 1). Left out, it builds as 1915. |
| top-level `fbx` | `true` also writes `build/people/<name>_for_mixamo.fbx` in the rest pose, to upload to mixamo.com (section 2). |
| top-level `body` | MakeHuman macros 0 to 1 (`gender`, `age`, `muscle`, `weight`, `height`, `proportions`, `african`, `caucasian`, `asian`; women may also set `cupsize`, `firmness`). |
| top-level `upscale` | For a child: the body is built at a child's shape, then enlarged so animations fit. The game shrinks it back with `scale`. |

That is every key `era.py` reads. `smooth`, still set in some Garvey and Eventide recipes, is no longer read and does nothing.

Marcus Garvey's face (`garvey1914.json`, `garvey1916.json`) was shaped against a photograph the owner supplied. Check any change to it against that photograph.

`tools/people/pack.mjs` never simplifies small pieces (collar, tie, belt, hat, sole) and never moves the edge of a cloth, so hems and necklines stay clean. Aim for under 32,000 triangles and about 350 to 480 KB per full body.

**Cloth rules for every era after 1800** (the 1690 recipes keep their own tailoring, with one exception: a 1690 man's shirt worn without a coat gets the ease, the shirt's weight rules and the clean neckband below, so it falls straight from the chest instead of showing two mounds):

- Cloth has ease. A shirt, waistcoat or jacket is moved out to an eased outline of the torso (the hollows between shoulder blades and under the bust are bridged, and the cloth hangs from the fullest part of the chest until the waistband gathers it in), then given a set clearance: shirt 9 mm, waistcoat 19 mm, jacket 19 to 26 mm. A last clearance pass pushes any point that is still inside or under the layer beneath it.
- Whatever is covered is deleted: skin under a shirt, trousers, skirt or jacket is removed wherever it is well inside the garment's edges, so it cannot show through in any pose. A jacket also removes the shirt's back and sides, and the waistcoat's back and sides.
- Layers move as one: a waistcoat or jacket takes the bone weights of the shirt under it, the tucked-in shirt tail takes the trousers' waist weights, and collar, placket, pocket, buttons, tie and lapels take the weights of the garment they lie on.
- Felt hats are one closed shell that clears the hair. A bun under a hat sits low on the nape. Aprons lie on the trousers.
- Check with `?test=cloth` (see `docs/TESTING.md`) after every change, for both games.
- A man's shirt, waistcoat and jacket fall almost straight from the chest to the waist (3.5 cm in a metre at the front, against 22 cm for a blouse), run on nearly flat from the chest up to the collarbone, and the eased outline bridges across the chest, so a man's chest never reads as two mounds. A jacket sleeve is slimmer and tapers to the wrist.
- Collars are evened out along the ring: each line of a collar goes through a running median and a smoothing, any lift clear of the shirt is spread along the ring, and the collar's bone weights (arms folded into the shoulders, the head into the neck) are evened along it, so a collar never tears into saw teeth in a pose. The shirt's neckline is relaxed after it is cut, so its edge has no steps.
- A V waistcoat (`vwaist`) is cut again after the ease, so its front is two straight edges meeting at the top button, and gets a row of five small buttons (piece and material `WaistcoatButtons`). A game that hides a body's `Waistcoat` must hide `WaistcoatButtons` with it (every game's `makeBody` does).
- A head tie (`wrap`) ends in one smooth, flattened knot on the front of the head.
- Below the knee the front of a skirt follows the shins in part, so when a woman sits the skirt falls over her knees instead of standing out from her lap.
- Waistcoat and jacket take their bone weights from the shirt under them (read from the nearest face and blended), the shirt's torso has its arm weights faded out and evened, and the base of the neck (skin and shirt neckline alike) follows the chest. These keep V necks, necklines and hems clean while walking instead of breaking into saw teeth.
- Clearance pushes are spread over neighbouring points and cut edges are relaxed afterwards, so no face folds over (`FOLDS=1` prints how many faces of each piece face the wrong way).
- Socks are their own `Sock` material cut along one line, so their top edge stays clean on light copies. The build is repeatable: the same recipe gives the same file.

## Skin

**Rule (owner rule 9).** Build every Black character's `Skin` inside Marcus Garvey's range, about `[134, 90, 64]` to `[156, 108, 80]`, never darker, with a little variety between people. West African people (Kofi) sit at the darker end of that range, mixed-heritage people (buc1, the sailor) a little lighter. Light-skinned Port Royal characters keep their own recipe colours. Faces must read clearly in every light: never near-black, never pale.

**How colours reach the screen.** `tools/garvey/era.py` writes the recipe colours, made linear, into a float colour layer and marks the exported scene `vertexColorSpace: linear`, so every recipe colour (skin and cloth alike) is drawn as written. `engine/colours.js` repairs older, unmarked character files, which were made linear twice and drew far too dark. Bodies built between the two fixes were brought up to date with `tools/people/fix_colours.mjs` (it also rescales Skin when a recipe's skin changes, without a rebuild).

**Per game.** Each game multiplies the `Skin` material by one documented factor for its own light: Kendal `SKIN_LIGHT = 1.55` (rule 9), Garvey `SKIN_K = 1.2`, Port Royal `SKIN_K = 1.0` (its sun, sky and tone mapping are already bright). New games start from Kendal's 1.55 and check with `?test=skin`. Kendal crowds vary skin by 0.9 to 1.15 only.

**How to measure.** `?test=skin` in each game's dev build (`engine/skinprobe.js`) renders each face in that game's own light from four headings and prints the mean, darkest and lightest colour (Garvey prints indoor and outdoor light). Check new people against the target before calling them done.

**Not yet covered.** Abba and Grace in Port Royal still come from `tools/blender/abba.py` and draw much darker and redder (about 63,18,9); they need rebuilding with `era.py`.

