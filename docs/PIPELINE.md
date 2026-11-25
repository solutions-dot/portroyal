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
  | `breeches` | `true`: easy over the thigh and narrowing steadily to a band below the knee (until 21 November 2026 they were cut full all the way down and gathered by a third, and flared like a jockey's breeches). Under a coat's skirt the fullness is kept to the front, so the breeches cannot push out through the skirt |
  | `breechkind` | `"slops"` for wide open sailor breeches; `"drawers"` for loose drawers to the knee, one straight taper, open at the hem (Nanny Town's Maroon men). Left out: knee breeches, easy over the thigh and narrowing steadily to the band below the knee |
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

**Abba and Grace.** Abba is a builder body now: `tools/people/abba.json` (15 November 2026). Her recipe sets `era: 1900`, as Nanny Town's 1734 women do: a woman's shift, bodice (`waistcoat`), skirt, apron and head wrap are the same pieces in either cut, and only the later cut has the seated skirt and the cloth ease. `wrapbrow: 1` brings the head wrap down to the hairline, as 1690 wraps were worn, and removes the hair under it. She has no clip of her own: the game gives her own mixer the shared Idle and Run (`games/port-royal/src/main.js`). Grace is Abba's body in her own colours. `tools/blender/abba.py`, `tools/people/abba_fix.mjs` and `assets/characters/abba_animated.glb` are kept only for reference.

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
| `ComfortGive` | an arm round someone standing 0.415 m to the right and 0.205 m in front (same facing): his whole body turns about 30 degrees to them and leans in, the upper arm angles down and back, the elbow bends about 90 degrees behind their back and the forearm lies across their shoulder blades to the hand resting palm down on top of their far shoulder, wrist straight, fingers forward over it; head turned and bowed, slow pats; free arm relaxed | Idle | hand-made, CC0 (this project) |
| `ComfortHand` | the simplest option: facing the other person 0.58 m in front, the left hand resting on their right shoulder, two slow pats | Idle | hand-made, CC0 (this project) |
| `ComfortChild` | an adult's hand resting palm down on the near shoulder of a child (about 0.6 of adult height) standing 0.25 m to the right and 0.25 m in front, clear of a skirt; her upper arm hangs, the forearm reaches forward, head bowed to them (pair it with `ComfortTake` on the child) | Idle | hand-made, CC0 (this project) |
| `SitComfortGive`, `SitComfortTake` | the comfort pair seated on one bench, the one comforted 0.465 m to the right and 0.27 m further forward (on the front of the seat), his elbow bent behind her back, his free hand on his knee, knees kept together | SitIdle | hand-made, CC0 (this project) |
| `ComfortTake` | the one being comforted: upright, head bowed and tipped towards the giver on the left, hands loose in front, once a loop a hand to the eyes, slow breaths | Idle | hand-made, CC0 (this project) |
| `SitScared` | seated, tense: hunched, gripping the seat beside the thighs, looking up and round, two small flinches | SitIdle | hand-made, CC0 (this project) |

The head-load clips are planned for a load about 0.2 m in radius and 0.25 m tall sitting on the crown (the game holds it on the Head bone with `hold()`); a wider load needs `LOAD_R` in the script changed so the hand stays outside it. `ComfortGive` and `ComfortTake` are a pair: start them together and place them exactly as the table says, facing the same way (ComfortHand: facing each other). `python3 tools/anims/pair_check.py` poses both real bodies at 32 moments and reports any overlap by body part, the resting hand's height above the other person, and hands through one's own body; every comfort pair must report none. `--search Pair` slides the other person round the planned spot and lists the places with no overlap and the hand nearest the middle of its band.


**Clips added on 15 November 2026.** Downloaded by the owner from mixamo.com (FBX files in `shared/anim-sources/`, the injured pack in `injured_pack/`). Source and licence for all: Mixamo (Adobe), free to use in games (Mixamo terms; the clips are not sold or shared on their own). "Plays once" means the last pose differs from the first, so do not loop it. Ten older clips that `optimize_clips.mjs` used to leave out (StartWalk, StopWalk, Injured, CarryTurn, BoxTurn, BoxIdle, Defeated, SlashIn, SlashOut, Draw) are now in the library too; `BoxIdle` is a standing guard with loose fists (a boxing stance), not someone holding a box. Tivoli's own four new clips are listed in `docs/games/tivoli.md`.

| Clip | Source file | What it shows |
|---|---|---|
| `SadWalk` | `Sad_Walk.fbx` | walking slowly, head and shoulders down |
| `InjuredWalk` | `Injured_Walking.fbx` | a limping walk, right arm held across the stomach (source loop has a 3 degree seam) |
| `StopWalkM` | `Stop_Walking.fbx` | the same movement as `StopWalk` (a duplicate download) |
| `CarryBagWalk` | `Walking_With_Shopping_Bag.fbx` | walking with a bag held low in the right hand (the game adds the bag) |
| `WalkTurn180` | `Walking_Turn_180.fbx` | walking, then turning round to walk back |
| `WalkTurn180b` | `Walking_Turn_180_1.fbx` | the same movement as `WalkTurn180` (a duplicate download) |
| `ReachOut` | `Reaching_Out.fbx` | standing, then reaching one arm forward (plays once) |
| `Yell` | `Yelling.fbx` | shouting with both arms spread wide |
| `Argue` | `Standing_Arguing.fbx` | arguing: open hands, shrugs, pointing (20 s) |
| `TalkM1` | `Talking_M1.fbx` | the same movement as `Talk2` (a duplicate download) |
| `TalkM2` | `Talking_M2.fbx` | talking, one hand gesturing |
| `TalkM3` | `Talking_M3.fbx` | talking while seated (needs a seat; name does not start with Sit) |
| `AskQuestion` | `Asking_Question.fbx` | seated, raising a hand to ask (needs a seat; name does not start with Sit) |
| `Agree` | `Agreeing.fbx` | standing, nodding agreement |
| `Nod` | `Acknowledging.fbx` | a small nod of acknowledgement |
| `Shrug` | `Shrugging.fbx` | a shrug |
| `HeadTurn` | `Head_Turn.fbx` | standing, turning the head to look aside |
| `LookAround` | `Looking_Around.fbx` | standing, looking round |
| `WipeSweat` | `Wiping_Sweat.fbx` | wiping the brow with one hand |
| `ListenMusic` | `Listening_To_Music.fbx` | swaying gently, as if to music |
| `Kneel` | `Kneeling.fbx` | kneeling on one knee, idle |
| `Kneel2` | `Kneeling_2.fbx` | the same movement as `Kneel` (a duplicate download) |
| `KneelDown` | `Kneeling_Down.fbx` | going down from standing to one knee (plays once) |
| `SitPoseM` | `Male_Sitting_Pose.fbx` | one still pose: sitting low, knees up, forearms on the knees |
| `SitPoseF` | `Female_Sitting_Pose.fbx` | one still pose: sitting on a seat, hands on the knees |
| `SitIdle2` | `Seated_Idle.fbx` | seated idle, hands by the seat |
| `SitIdle3` | `Sitting_2.fbx` | seated, leaning forward, head bowed over the hands |
| `SitIdle4` | `Sitting_3.fbx` | standing, then sitting down (plays once, not a loop) |
| `Crawl` | `Crawling.fbx` | crawling on hands and knees |
| `Pray2` | `Praying_2.fbx` | the same movement as `Pray` (kneel, pray, stand up; a duplicate download) |
| `Pray3` | `Praying_3.fbx` | kneeling, hands together, looping |
| `Pray4` | `Praying_4.fbx` | hands together, knees bent as if seated, looping (fits a seated hymn on a seat) |
| `RifleWalk` | `Walk_With_Rifle.fbx` | walking, hands placed for a rifle held low |
| `RifleWalk2` | `Walk_With_Rifle_1.fbx` | a quicker walk, rifle held up |
| `RifleCrouchWalk` | `Rifle_Crouch_Walk.fbx` | a crouched walk with a rifle |
| `RifleWalkStop` | `Rifle_Walk_To_Stop.fbx` | walking with a rifle, then stopping (plays once) |
| `RifleIdle` | `Rifle_Idle.fbx` | standing idle, hands placed for a rifle |
| `PlayPiano` | `Piano_Playing.fbx` | seated, playing a piano (needs a seat; name does not start with Sit) |
| `PlayGuitar` | `Guitar_Playing.fbx` | standing, strumming a guitar |
| `PlayGuitar2` | `Guitar_Playing_1.fbx` | standing, playing a guitar, calmer |
| `Stagger` | `Jogging_Stumble_1.fbx` | the same movement as `JogStumble` (a duplicate download) |
| `InjuredStumble1` | `Injured_Stumble_Idle_1.fbx` | the same movement as `Injured` (a duplicate download) |
| `InjuredStumble2` | `Injured_Stumble_Idle_2.fbx` | the same movement as `Injured` (a duplicate download) |
| `HurtIdle` | `injured_pack/injured_idle.fbx` | standing hurt, knees bent, swaying (3.5 degree source seam) |
| `HurtHoldIdle` | `injured_pack/injured_hurting_idle.fbx` | doubled over, holding the stomach |
| `HurtWaveIdle` | `injured_pack/injured_wave_idle.fbx` | hurt, waving one arm for help (5.4 degree source seam) |
| `HurtWalk` | `injured_pack/injured_walk.fbx` | a hunched, hurt walk |
| `HurtTurnL` | `injured_pack/injured_turn_left.fbx` | hurt, turning left on the spot |
| `HurtTurnR` | `injured_pack/injured_turn_right.fbx` | hurt, turning right on the spot |
| `Scared` | `Scared.fbx` | crouching low in fear, standing, crouching again (with skin; worked) |
| `Terrified2` | `Terrified_2.fbx` | the same movement as `Terrified` (with skin; a duplicate download) |
| `Duck2` | `Ducking_1.fbx` | ducking down, then up (the same as Tivoli `Ducking`) |
| `IdleSturdy` | `Dwarf_Idle.fbx` | a wide, sturdy standing idle |
| `OldIdle` | `Old_Man_Idle.fbx` | an old person standing, stooped, hands together |
| `HappyIdle` | `Happy_Idle.fbx` | a light, cheerful standing idle |
| `IdleM` | `Idle_M.fbx` | a man's standing idle, weight shifting |
| `IdleTwist` | `Catwalk_Idle_Twist_R.fbx` | a poised standing idle with a small twist |
| `IdleGuard` | `Warrior_Idle.fbx` | standing ready, arms loose, sometimes stretching out |
| `BriefcaseIdle` | `Standing_W_Briefcase_Idle.fbx` | standing, one hand low as if holding a briefcase |
| `TorchIdle` | `Standing_Torch_Idle_02.fbx` | standing, holding up a torch, turning to look; big reaching moves |
| `StartSprint` | `Idle_To_Sprint.fbx` | from standing into a sprint (plays once) |
| `HoldWalk` | `Holding_Walk.fbx` | walking with both hands holding something in front (6 degree source seam) |
| `WalkM2` | `Walking_M.fbx` | a man's walk, arms held fairly high and bent (not In Place) |
| `RunM2` | `Running_M.fbx` | a man's run (not In Place) |
| `StopWalkM2` | `Walk_To_Stop_M.fbx` | a man walking, then stopping (plays once) |
| `BoxIdle2` | `Box_Idle_1.fbx` | the same movement as `BoxIdle` (a duplicate download) |

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

`tools/people/kids/` holds older copies of `boy.json` and `girl.json`. Kendal's copies in `tools/kendal/people/` are the current ones (camp and round collars, a pocket, and straight shorts); build children from those.

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
| `trousers`, `shorts`, `legwidth` | Full-length trouser legs hang from the thigh and break over the shoe. `shorts` uses a straighter leg with a level hem. `shortslen` adjusts the hem height. |
| `sleeve`, `jacket`, `jacketsleeve`, `jackethem`, `waistcoat`, `vwaist` | Sleeves hang loose with a cuff (`sleeve` 0 to 1, default 0.86). A jacket gets lapels, buttons and a skirt past the hips; `jacketsleeve` is how far down the arm its sleeve comes (default 0.9) and `jackethem` moves its hem down (bigger) or up (smaller; default -0.05 after 1800). `vwaist` gives a waistcoat a V opening at the front. |
| `woman`, `highneck` | `woman` cuts the shirt as a blouse that follows the figure (and leaves off the button band). `highneck` brings the neckline up to the throat. |
| `scarf` | A neck scarf with a knot at the throat (material `Scarf`). |
| `collar`: `false` or left out (the usual choice); `neckdrop` | A clean round opening, cut on one smooth seam and finished with a narrow turned-in facing. This is the default for every shirt, blouse and frock (owner, 21 November 2026: "most just need a round opening for the garment"). `neckdrop` is how far below the base of the neck its front sits, in metres at a normal height (0.032 for a man, 0.042 for a woman, 0.012 with `highneck`). |
| `collar`: `"turn"`, `"stand"`, `"open"`; `softcollar` | A collar sewn to the shirt (`tools/garvey/neckwear.py`, see "Collars and ties, rebuilt" below). `stand`: a tall stiff band, closed at the throat, its front corners rounded. `turn`: a band with a leaf folded down over it, ending in two points on the shirt front. `open`: a turn collar worn unbuttoned, its points spread on the chest. `true` picks by `era`: `stand` before 1925, `turn` from 1925 (and before 1925 when `softcollar` is set). Write the kind, not `true` (`docs/PEOPLE.md`). |
| `collar`: `"camp"`, `"round"`, `leaf`, `vdepth`, `vslope` | The flat collars of 1950s shirts and blouses (not for 1900 to 1930 people): `camp` is a collar round the neck ending in two points, with the shirt's front turned back as a facing down each side of a V; `round` a flat round collar whose ends nearly meet at the throat. `leaf` is how wide the collar lies on the shirt, measured along the cloth. |
| `collar` on a 1690 or 1730s shirt | Left out: a shirt worn without a sleeved coat gets a narrow neckband over a short slit, worn open (as shirts of the time were made). `false`: a plain rounded opening with no band (Nanny Town's Maroon men). |
| `puff`, `sash`, `pocket`, `hang` | Puffed short sleeves, a narrow sash about 5 cm tall that lies snug on the waist (material `Belt`), a chest pocket (material `Pocket`, a clean rectangle), and how far loose cloth hangs from the chest. |
| `tie`, `buttons`, `belt` | A tie in one piece: a flat, tapered four-in-hand knot in the collar's opening and a blade that runs on from inside it, stiff over the shirt, about 7 cm at its widest (needs a `stand` or `turn` collar). A button band. A belt with a buckle (`belt: "always"` keeps it under a waistcoat). |
| `skirt`, `hem`, `flare`, `pleats` | `hem` 0 is the ankle, 1 the knee. Soft folds deepen toward the hem. |
| `hair: "straight"`, `hairlen`, `hairopen` (24 November 2026, Air Jamaica) | Straight hair that hangs: a smooth two-sided curtain falling straight down from the widest part of the head, open in front of the face (`hairopen`, radians each side of straight ahead, default 1.2), tied to the head bone. `hairlen` 0 ends at the chin, 1 at the shoulders (default 0.35). The close cap over the scalp stays under it. Only recipes that ask for it change. |
| colour `Gloves` (24 November 2026, Air Jamaica) | White (or any) gloves painted on the hands, from just above the wrist to the fingertips, only when a recipe gives the colour. |
| colours `Lipstick`, `Eyeshadow` (24 November 2026, Air Jamaica) | Makeup, only when a recipe gives the colour: lipstick laid over the lips, a soft eyeshadow on each upper lid between the eye and the brow. Recipes without them are painted as before. |
| `shoes`, `lowshoes`, `socks`, `stockings` | Shoes with a thin sole joined to the upper. With a skirt the shoe is low cut. `socks` is how far up the shin. `stockings` (1690) colours the leg from knee to ankle. |
| `hat` | One kind, or a list `[[kind, materialName], ...]` so a game can show one and hide the rest. Kinds: `felt`, `flat`, `trilby`, `straw`, `bowler`, `top`, `church`, `pillbox`, `peaked`, `wrap`, `cocked`. `brim` sets the brim width (1 is the wide 1690 brim, about 0.4 a short one). `cocked` (22 November 2026, for men of about 1730 to 1800: Hutchinson's 1773 gentlemen and officer, The Shark Papers' officers and master) is a tricorne: a low round crown and a felt brim 3 mm thick turned up on three sides into a triangle, one point to the front; the sides stand almost upright and the corners stay low, so the brows show. It has no band and ignores `brim`; `hatdrop` moves it as it moves any hat. |
| `hair`: `"puffs"`, `"plaits"`, `"afro"`, `"none"`; `bun`, `hairvol`, `recede`, `temples`, `bays`, `fade` | Hair grows from the body's own scalp line and fades into the skin at the edge, so hairlines are smooth. `bays` are receding temples, `fade` cuts the sides short. |
| `moustache`, `moustachewidth`, `moustachedroop`, `brows`, `browwide` | A soft moustache that feathers out at its edges; heavier eyebrows. |
| top-level `targets` | MakeHuman face and body targets by name (for a likeness), `lr-` for both sides. |
| `facings` | `true` (22 November 2026, 1690-cut coats only, `era` before 1800): the coat's lapels and cuffs in a second cloth, material `Facings` (default off-white), as on a Royal Navy officer's blue coat of the 1790s with white facings (The Shark Papers' `sp_fitton`, `sp_wylie`). The 1690 coat has no lapel of its own, so each lapel (`FacingLapels`) is a band laid 3 mm over the coat down each side of the front, about 9 cm wide under the collar narrowing to under 5 cm at the waist, with the coat's buttons on top; each cuff (`FacingCuffs`) is a band round the last 10 cm of the coat sleeve, 4.5 mm proud. Both take the coat's own bone weights. Bodies that do not set it build exactly as before. |
| `necktuck` | `true` (22 November 2026, coats of 1773 and 1799, `era` before 1800): the skin under the coat's neck facing (`CoatNeck`) and, with `bands`, under the cravat is set up to 8 mm deeper and takes the bone weights of the piece over it, as skin under a flat collar does. The facing and the cravat follow the collarbones and the skin the chest, so talking, turning the head or laughing brought 3 to 8 mm of skin through the facing and pink patches through the back of the cravat. Hutchinson's and The Shark Papers' coated men set it. Bodies that do not set it build as before. |
| `shoetuck` | `true` (22 November 2026, `era` before 1800, with `shoes`): the skin of the ankle under the top of the shoe, the same way (the ankle bone came 1 mm through it). `hx_hutchinson` and `sp_briggs` set it. |
| `beltfit` | `true` (22 November 2026, with `skirt`): the top of the skirt, where the belt lies on it, takes the belt's bone weights (the blouse's), fading back to its own over 6 cm below, so the skirt no longer rises over the belt and hides it when the body bends (picking up, wiping the brow, walking; up to 2 cm before). Hutchinson's women and `rh_woman` set it. Bodies that do not set it build as before. |
| `apron` | A waist apron, made again from scratch on 21 November 2026: cloth that wraps the front of the body from hip to hip, 1 to 2 cm clear of what is beneath, hanging straight past the fork, with a waistband right round the waist tied at the back in a knot with two ends (all material `Apron`). Over trousers it stays on the hips down to the hip joint and then follows each thigh and shin, so it turns over the lap when seated. Over a skirt it is cut from the skirt's own front with the skirt's own bone weights (`Apron`, and `ApronSeat` from the seated skirt, which `engine/anim.js` `seatSkirt` swaps with the skirt), so the skirt can never show through it; the band is `ApronBand`. Over a skirt with a belt (23 November 2026, owner: "the band for the apron is higher than the apron itself") the band is tied over the belt and covers it, with the belt's own bone weights, and the apron's top takes the belt's weights too (`beltfit`), so all three bend as one. The skirt under the apron is cut away where the apron always covers it (a few centimetres in from its sides, top and hem): the packer thins the skirt for the phone, crowd and light copies, and the thinned folds came through the apron in tears (owner, 23 November 2026). A belt under the band is removed (never seen, and its edge rose over the band when she bent); the skirt's top is cut at the band. Under a bodice the bodice's hem is cut straight just inside the band, and the bodice takes the blouse's bone weights and covers the bust in a low scoop. Give the apron its own cloth colour, never the blouse's (owner, same day): unbleached osnaburg (about `[170, 150, 118]`), a faded blue check (about `[130, 145, 162]`) or, for a town woman, bleached white over a darker blouse. The packer never simplifies it. |
| top-level `era` | The year the person is dressed for. Before 1800 uses the 1690 tailoring (section 1). Left out, it builds as 1915. |
| top-level `face` | A named face shape from `tools/people/faces.json` (`broad`, `long`, `round`, `lean`, `strong`, `soft`, `elder`, `heart`, `wide`, `narrow`), so the people of one game do not share one face. The recipe's own `targets` are added on top. |
| top-level `smile` | How far the corners of the mouth lift and the cheeks rise (default 0.45, a child 0.8, 0 for a grave face). |
| top-level `eyes` | How far the upper lids are lowered (default 0.3; children 0). Fully open, everyone stared. |
| `chest` (in `garments`) | Men only: how far the chest and the sides of the ribs are eased toward a plain shirt front (default 0.5, 0 leaves the body's own shape). |
| `hatdrop` (in `garments`) | Metres a hat sits lower on the head (the Emperor's and the police caps use 0.026). |
| top-level `beard` | The Emperor's Arrival only (`tools/selassie/imperial_face.py`): `len`, `thick`, `under`, in metres. |
| top-level `fbx` | `true` also writes `build/people/<name>_for_mixamo.fbx` in the rest pose, to upload to mixamo.com (section 2). |
| top-level `body` | MakeHuman macros 0 to 1 (`gender`, `age`, `muscle`, `weight`, `height`, `proportions`, `african`, `caucasian`, `asian`; women may also set `cupsize`, `firmness`). |
| top-level `upscale` | For a child: the body is built at a child's shape, then enlarged so animations fit. The game shrinks it back with `scale`. |

That is every key `era.py` reads. `smooth`, still set in some Garvey and Eventide recipes, is no longer read and does nothing.

Marcus Garvey's face (`garvey1914.json`, `garvey1916.json`) was shaped against a photograph the owner supplied. Check any change to it against that photograph.

`tools/people/pack.mjs` never simplifies small pieces (collar, tie, belt, hat, sole) and never moves the edge of a cloth, so hems and necklines stay clean. Aim for under 32,000 triangles and about 350 to 480 KB per full body.

**Cloth rules for every era after 1800** (the 1690 recipes keep their own tailoring, with one exception: a 1690 man's shirt worn without a coat gets the ease, the shirt's weight rules and the clean neckband below, so it falls straight from the chest instead of showing two mounds):

- A shirt's shoulder is tailored, not the body's own: its top is raised to a straight line from the base of the neck to the sleeve (at most 12 mm, nothing at the two ends) and the head of the sleeve is rounded over toward the arm, never closer to it than 5 mm. Raised at the ends, or left flat to the tip, the shoulder stands up in a peak. A generated waistcoat's front is one straight line from chest to hem, so it does not follow the belly. Look at both from the front and the back on a woman, a child and a stout man.
- Cloth has ease. A shirt, waistcoat or jacket is moved out to an eased outline of the torso (the hollows between shoulder blades and under the bust are bridged, and the cloth hangs from the fullest part of the chest until the waistband gathers it in), then given a set clearance: shirt 9 mm, waistcoat 19 mm, jacket 19 to 26 mm. A last clearance pass pushes any point that is still inside or under the layer beneath it.
- Whatever is covered is deleted: skin under a shirt, trousers, skirt or jacket is removed wherever it is well inside the garment's edges, so it cannot show through in any pose. A jacket also removes the shirt's back and sides, and the waistcoat's back and sides.
- Layers move as one: a waistcoat or jacket takes the bone weights of the shirt under it, the tucked-in shirt tail takes the trousers' waist weights, and collar, placket, pocket, buttons, tie and lapels take the weights of the garment they lie on.
- Felt hats are one closed shell that clears the hair. A bun under a hat sits low on the nape. Aprons lie on the trousers.
- Check with `?test=cloth` (see `docs/TESTING.md`) after every change, for both games.
- A man's shirt, waistcoat and jacket fall almost straight from the chest to the waist (3.5 cm in a metre at the front, against 22 cm for a blouse), run on nearly flat from the chest up to the collarbone, and the eased outline bridges across the chest, so a man's chest never reads as two mounds. A jacket sleeve is slimmer and tapers to the wrist.
- Collars are sewn to the shirt and shaped from a smooth model of the neck: see "Collars and ties, rebuilt (21 November 2026)" below.
- A V waistcoat (`vwaist`) is cut again after the ease, so its front is two straight edges meeting at the top button, and gets a row of five small buttons (piece and material `WaistcoatButtons`). A game that hides a body's `Waistcoat` must hide `WaistcoatButtons` with it (every game's `makeBody` does).
- A head tie (`wrap`) ends in one smooth, flattened knot on the front of the head.
- Below the knee a skirt follows the shins in part (all round), so when a woman sits or kneels the skirt falls over her knees instead of standing out from her lap. `?test=cloth` also checks every skirt body in SitTalk, Kneel, PlayPiano, TalkM3 and AskQuestion when the game has those clips.
- A man's cloth, seen from the side, runs straight from the fullest part of the chest down to the waistband (each line down the body is spanned like a sheet), so it neither shelves out from the chest nor follows a belly.
- Waistcoat and jacket take their bone weights from the shirt under them (read from the nearest face and blended), the shirt's torso has its arm weights faded out and evened, and the base of the neck (skin and shirt neckline alike) follows the chest. These keep V necks, necklines and hems clean while walking instead of breaking into saw teeth.
- Clearance pushes are spread over neighbouring points and cut edges are relaxed afterwards, so no face folds over (`FOLDS=1` prints how many faces of each piece face the wrong way).
- Socks are their own `Sock` material cut along one line, so their top edge stays clean on light copies. The build is repeatable: the same recipe gives the same file.

## Skin

**Rule (owner rule 9).** Build every Black character's `Skin` inside Marcus Garvey's range, about `[134, 90, 64]` to `[156, 108, 80]`, never darker, with a little variety between people. West African people (Kofi) sit at the darker end of that range, mixed-heritage people (buc1, the sailor) a little lighter. Light-skinned Port Royal characters keep their own recipe colours. Faces must read clearly in every light: never near-black, never pale.

**How colours reach the screen.** `tools/garvey/era.py` writes the recipe colours, made linear, into a float colour layer and marks the exported scene `vertexColorSpace: linear`, so every recipe colour (skin and cloth alike) is drawn as written. `engine/colours.js` repairs older, unmarked character files, which were made linear twice and drew far too dark. Bodies built between the two fixes were brought up to date with `tools/people/fix_colours.mjs` (it also rescales Skin when a recipe's skin changes, without a rebuild).

**Per game.** Each game multiplies the `Skin` material by one documented factor for its own light: Kendal `SKIN_LIGHT = 1.55` (rule 9), Garvey `SKIN_K = 1.2`, Port Royal `SKIN_K = 1.0` (its sun, sky and tone mapping are already bright). New games start from Kendal's 1.55 and check with `?test=skin`. Kendal crowds vary skin by 0.9 to 1.15 only.

**How to measure.** `?test=skin` in each game's dev build (`engine/skinprobe.js`) renders each face in that game's own light from four headings and prints the mean, darkest and lightest colour (Garvey prints indoor and outdoor light). Check new people against the target before calling them done.

Abba and Grace in Port Royal are builder bodies now (skin `[138, 93, 66]`, at the owner's request a little darker than most, still inside the range).


## Collars and untucked shirts (17 November 2026)

(The collar parts of this section, of "Flat collars sit clean at the throat" and of "Collars flush, no skin at the waist" were replaced on 21 November 2026: see "Collars and ties, rebuilt".)

- **Band collars** (`stand`, `turn`): the band's top edge and the fold are fitted to the neck itself (`ring_fix` against the skin, 5 mm and 8 mm clear; `collarfit`, on by default). Measured from an ellipse, the neck came through the band in a ragged line and two teeth stood up at the back.
- **Untucked shirts** (`untucked`): after the shirt is cleared over the shorts it is drawn into one straight line from the waist to the widest thing under it, then the hem is set level. It still flares a little over baggy shorts.

## Flat collars sit clean at the throat (17 November 2026)

The owner saw jagged collars. On a round collar the saw-tooth was the line where the neck skin dips under the blouse: `tuck_under_collar` pushed skin under the collar 8 mm point by point and left out the points right at its edge, so the skin's edge went in and out. The push is now feathered (1.5 mm at the collar's top edge, the full 8 mm 1.8 cm below it), and a round collar's two ends nearly meet at the throat (`a0` 0.05), so the blouse's neckline no longer shows between them as a notch. Applies to every round and camp collar (45 recipes, rebuilt the same day).

## Collars and ties, rebuilt (21 November 2026)

The owner found most collars jagged, crumpled or not lying flat, in every game, and asked to start again (the audit with pictures: `docs/reviews/collars-20261121.md`). The old collar code had grown into a stack of patches, each fixing what the one before broke. It is gone. Collars and ties for every shirt with a collar kind are now built by `tools/garvey/neckwear.py`, which `era.py` runs at the same point as before.

- **The collar is sewn to the shirt.** The shirt's neckline is cut back below one smooth seam line and its edge points are moved onto that line. The collar's first row is built on those very points, with the same bone weights, so collar and shirt meet in one line and cannot part in any pose. The collar stays its own part (`Collar`), so games can still colour or hide it.
- **Shapes come from a smooth neck.** The neck's outline at each height is a low-pass curve (a few Fourier terms) that lies just outside every point of the skin. The neck's middle is measured below its base and follows the neck bone's lean above it (measured higher, the ray from the front met the chin and the collar's back was built in front of the throat).
- **The seam** sits at the base of the neck at the back and about 3 cm lower at the throat, at the top of the breastbone, as a shirt's neckband does. A camp collar's seam runs down both edges of the shirt's V; seen from above it still goes once round the neck, so every kind is one height and radius for each angle.
- **Leaves are laid along the cloth.** A turn collar's leaf, a round collar and a camp collar are measured as a distance along the cloth from the seam (a line traced over the shoulder, down the chest or down the back), not as a drop in height (on a sloping shoulder a fixed drop put the leaf's edge far out). The line rests on the outer hull of what is beneath, so a leaf spans straight over a waistcoat's top edge. Points on the chest are laid on the shirt, and a waistcoat beneath only lifts them.
- **Every seen surface has a back:** the inside of a band, the underside of a leaf's edge. Lifts that keep a piece clear of the cloth are spread along the collar, so an edge never ripples.
- **Weights:** the band and the knot follow the chest, as the shirt does; only the back of a band's top edge takes a third of the neck. (Following the neck bone, which pivots behind and above the throat, the front of the band and the knot swung down into the chest when the head nodded.) Leaves take the weights of the shirt they lie on.
- **Kinds:** `stand`, `turn`, `open`, `round`, `camp` (a collar ending in points, and the shirt's front turned back as a facing down each side of the V, tucked under the points with a notch), `band` (the narrow neckband of a 1690s or 1730s shirt, open at the slit) and `plain` (`"collar": false` on an old shirt: a clean rounded opening).
- **The tie** is one piece: a flat, tapered four-in-hand knot whose top reaches the band's top edge between the collar points, and a blade that starts inside the knot, bridges dips in the shirt and widens to about 7 cm before its point. It ends behind a waistcoat's V or at the belt.
- **Skin** is removed up to 1 cm under the seam, wherever the seam runs. The old tucks that pushed neck skin in point by point (and left a saw-tooth edge above every collar) no longer run for these collars.
- **Jacket shoulders** (the same day): the jacket is fitted over what stays under it (the skin, the shirt's front and collar foot, the waistcoat's V), not over the whole shirt and waistcoat that are trimmed away afterwards; the shirt kept under a jacket is only a ring round the neck (across the whole width it ran out over the sleeve tops and stood out like padding); across the top of the shoulders a waistcoat and a jacket lie about 1 cm off the layer beneath (`shoulder_off`); a jacket sleeve has about 1.5 cm of ease. A jacket still has no collar of its own: see `docs/TODO.md`.

Known faults, still to do (`docs/TODO.md`): a child's narrow chest creases a camp collar's facings a little (Kendal's `boy`); a turn collar pressed between a waistcoat and a jacket creases a little beside the knot (`garvey1916`); a round collar on a soft, rounded blouse follows the blouse's lumps.

## Clothes, second pass (21 November 2026, later the same day)

The owner looked at the rebuilt collars and at Marcus Garvey and was not satisfied: collars still crooked, the suit like padding, trouser legs too wide, flared knee breeches, and "I don't want to keep patching something that is bad ... be honest". The honest audit is `docs/reviews/people-20261121.md`. What it found and what changed:

- **The stoop and the lean were not clothes at all.** They were the engine (`docs/ENGINE.md`, "Every body keeps its own shape"). Look at a body's stance before judging its clothes.
- **Most garments get a plain round opening.** Camp, round and open collars are gone from every recipe, and so are turn and stand collars worn without a tie by men: the default is the clean opening that `neckwear.py` cuts (`CK == 'plain'`, now for later eras too). A collar is kept only where the period and the person need one: a man in a tie (`stand` before about 1925, `turn` after), a woman's high-necked blouse of 1908 to 1925 (`stand`), and uniforms. Write `"collar": false` in a new recipe unless one of those applies.
- **Sleeves are tubes sized from the arm.** `_arm_profile` measures the arm on the skin alone at 29 stations (its middle, which is not the bone's line, and its greatest radius). A sleeve is one straight taper from the shoulder to the wrist, centred on the arm's middle, widened at the shoulder end just enough to clear the arm by the garment's ease (shirt 5 mm, jacket 14, coat 16). The old rule took the larger of a fixed tube and "the arm plus 4 mm" at every point, so on a strong arm the cloth followed the shoulder muscle and the biceps and read as padding.
- **The 1690 coat keeps its own sleeve rule** (`sleeve_tube_old`): a full sleeve into a wide cuff. The measured taper was tried on it and came out in rings, because the coat's cuff is narrower than its sleeve. This was caught only by rendering a coated man beside the same man on main: after any change to shared cloth code, compare one body of every garment kind with main (`git show main:games/<game>/site/models/<id>.js`, saved under another name, then `people-sheet.mjs`).
- **A waistcoat's V is two straight edges to a clean point.** It was torn at the point (a face lying across the middle was cut by one side only), notched where the first, early cut had bitten wider than the second, and the shirt's button band came through beside the point. Now: a seam down the middle first, the final cut 13 mm wider than the early one and made again at the very end of the build (`RECUT_V`), and the button band stops above the point.
- **Shirt sleeves are smooth from the shoulder seam** (owner: "very lumpy"): the sleeve tube now starts just below the seam and reaches every point of a thick arm (it started a fifth of the way down and reached 7.5 cm, leaving the shoulder muscle and a strong upper arm in lumps), and the sleeve is evened out as cloth afterwards.
- **Sleeves are sized to thin arms too** (owner: "shoulders for boy are way too puffy"): the tube is never more than about a centimetre wider than the arm, and never inside the arm at any station (an elbow came through a woman's sleeve hem).
- **Puffed sleeves** (`puff`) are a soft puff of about 1.5 cm over a sleeve that fits the arm. They were 3.4 cm over a fixed tube, a ball on each shoulder (owner: "dress a little too puffy"). Kendal's `woman57` skirt flare went from 1.8 to 1.35.
- **A skirt's belt sits on the waist** (owner: "the belt is not sitting flush"): the band is sized on the blouse at the waist and the skirt is held in under it, so it flares from just below the band. It used to take the skirt's width at its lowest row and stood off like a hoop.
- **The packer never cuts a full body's skin and clothes by more than about half** (`tools/people/pack.mjs`). On a body with many whole pieces (two hats, a wrap, a bun, a second skirt) the floor of a twentieth crushed the blouse and neck into flat facets and bent the neck (`woman_elder`, `woman_long`: owner, "this model doesn't look right", "badly built"). If a packed body looks faceted or bent, compare it with its unpacked `.glb` (`tools/wardrobe/view.mjs`) before touching the builder.
- **The shoulder cap of a shirt is evened out as one piece of cloth** from the base of the neck to the top of the sleeve (owner: "these shoulders don't look natural").
- **A fedora sits just above the eyebrows** (default `hatdrop` 0.007 for felt hats and trilbies; the brim dips only a little at the front): lower, it hid the eyebrows; higher, it perched.
- **A waistcoat holds the shirt in** (owner: "the side of the coat looks torn"): shirt points outside the waistcoat, or less than 5 mm inside it, are set 6 mm inside it, and the armhole cut stops under the armpit. The shirt used to blouse out through the waistcoat's side as a white flap.
- **Trousers are fitted:** about 8 cm at the top of the thigh narrowing to under 6 at the hem (they were 9 to 7 and flared). `legwidth` still scales them.
- **Knee breeches** narrow steadily to the band; **drawers** (`"breechkind": "drawers"`) are a straight open leg to the knee.
- **Shorts** fall in one straight line from the top of the thigh to a level hem (`_SHORT_R`: the thigh's own radius just below the fork, plus ease). They used to follow the thigh, so they swelled at mid-thigh and came in again at the hem.
- **A plain opening keeps to the neck's own size.** On a woman, a child or an old person the neck's joint is level with the slope of the shoulders, so the skin's outline at the seam's height is already the shoulders and the ring came out 9 to 12 cm in radius: a boat neck that tore at the shoulder points and let skin through. The ring is now the neck's own radius (measured 3 cm up the neck) plus 2 cm at the sides and back, and where that brings it in onto the slope the seam rises to lie on the shoulder (`neckwear.py`, `CK == 'plain'`; it prints the ring's radius). The shoulder's skin outside the seam is hidden out to the shoulder joint (`hidden()` in `era.py`): a strip there was covered by neither the neck's rule nor the arm's. `NECKDBG=1` prints any skin face left outside the seam.
- **Felt hats after 1800** are built as the fedora shape (the `trilby` code: tapered crown pinched at the front, brim snapped down). A straight-sided crown, even rounded, read as a pot on the head (owner, 21 November 2026). The crown used to end in a flat dish with a rim, with stepped sides and a band 5 mm proud, and read as three stacked rings. Every hat on every body was looked at from four sides on 21 November 2026 (one hat at a time: hide the others with `hide=<Mat>,<Mat>Band`); the rest sit right. Kendal's top hat is tall on purpose: it is an 1845 hat.
- **A plain opening dips only at the front.** Its seam stays at the base of the neck round the sides and back; lower at the sides, the ring ran out onto a narrow shoulder (a girl, a slim woman) and left a wedge of skin there. `_nw_zone` in `neckwear.py` is now "within 4 cm of the seam", not "not the arm's".
- **A suit is a modelled garment, fitted** (next section). The generated jacket is no longer used by any recipe.

## Country clothes of 1865: `crown` and `wrapoff` (23 November 2026)

Two recipe keys for the Morant Bay people, after the 1865 album photographs of villagers: `"crown"` (a share of the usual crown height of a `straw` hat; 0.62 gives the low country hat) with `"brim"` 1.3, and `"wrapoff"` (a share of the head tie's usual 16 to 22 mm of cloth; 0.5 lies closer). Recipes without them build as before.

## Coats of 1773 and 1799 (23 November 2026)

Owner, on The Shark Papers: "collars and sleeves look awful on these". `era.py` built every coat before 1800 with the 1690 rule: a wide sleeve ending mid-forearm in a big cuff, 3 cm of cloth over the arm, and a broad cravat with long falling ends. A recipe with `"era"` 1770 or later (`LATE` in `era.py`) now gets the later cut: a close sleeve that follows the arm's own smoothed size (`sleeve_tube(..., fit=True)`) and reaches the wrist (`coatsleeve` at least 0.92), cloth only 4 mm thick down the sleeve (blended in from just below the shoulder), a lower neck facing, and a lower neckcloth with a small knot and two short ends. The 1690 and 1734 coats build as before. Rebuilt: every coat in The Shark Papers and The Mad Master of Edinburgh Castle. After rebuilding a Shark Papers body, run `node tools/people/sleeve-blend.mjs shark-papers <ids>` again.

## Fitted garments: `tools/people/outfit.py` and `shared/garments/`

A garment modelled once as a clean mesh on MakeHuman's standard body, fitted to each character by MPFB (each of its points follows three points of the body), then split into the parts the games colour. A recipe asks for one with

```json
"outfit": {"garment": "toigo_male_suit_tie_and_jacket", "waistcoat": true, "tie": false}
```

and keeps its usual garment keys, because `era.py` still builds its own pieces first (its skin trimming and checks are built round them) and this step then replaces them. Every man in a jacket, in every game, wears this suit now: both Marcus Garveys, `delegate1920`, `hl_critic`, Kendal's `man_suit`, and eight Windrush men.

- **The garment:** a man's suit by Margaret Toigo from the MakeHuman community pack `suits01`, licence CC0: jacket with collar and lapels, shirt collar and front, four-in-hand tie, slim trousers, buttons. Parts: `Jacket`, `Lapels` (the lapels and jacket collar, in the jacket's cloth), `Shirt`, `Tie`, `Breeches`, `JButtons` (material `Buttons`), and with `"waistcoat": true` a `Waistcoat` and `WaistcoatButtons`.
- **`"waistcoat": true`** makes a waistcoat from the garment's own shirt front, cut with planes so its V and its top are straight lines, with five small buttons. `"tie": false` leaves the tie off (an open collar).
- **The jacket hangs.** Fitted point by point, a garment follows every roll of a stout body. Its torso is moved out to the eased outline the generated clothes use (hollows bridged, falling straight from the fullest part). Every layer at one place moves by the same amount, worked out from the innermost layer there, so lapels, pocket flaps and collar keep their relief. `"drape": false` turns it off; `"ease"` is the clearance in metres (0.004).
- **Lapels stay sharp.** They are their own piece, which the packer never simplifies (`WHOLE` in `tools/people/pack.mjs`), and both pieces keep the whole jacket's shading across the cut.
- **Trying a garment on:** `python3 tools/wardrobe/tryon.py '{"out": "build/wardrobe/x.glb", "body": {...}, "garments": ["path/to/a.mhclo"], "hide": true}'` fits garments to a bare body, and `node tools/wardrobe/view.mjs out.png build/wardrobe/x.glb zoom=top` draws it from four sides. Use them to judge a garment before adding it to `shared/garments/`.
- **A second suit, 22 November 2026:** `toigo_male_suit_3`, a three-button jacket with a short, high lapel, from the same CC0 pack. The men of about 1908 to 1925 wear it (both Marcus Garveys, the critic and the delegate); the men of 1948 and later keep the two-button suit. Its parts are told apart by their own regions in `tools/people/outfit.py` (`_REGIONS`), its pocket handkerchief is left off (`Drop`), the jacket is kept 4 mm clear of the shirt collar, and the skirt of a longer jacket hangs straight from the hips. The fitter also makes a jacket's two sides alike away from the lapped fronts (`"even": false` turns it off): this suit came with one shoulder squarer and higher than the other, which read as a lopsided man on a level stance. Measure the stance first (`posture-probe.mjs`); if it is level and the man still looks lopsided, the garment is. Changing a modelled garment's cut by code was tried the same day (moving buttons up, drawing a collar taller) and came out crumpled or ragged: bring in a garment with the right cut instead.
- **Adding a garment:** take it from a CC0 MakeHuman pack (`static.makehumancommunity.org/assets/assetpacks/`; the download mirrors are `files.makehumancommunity.org` and `files2`), keep only the `.mhclo`, the `.obj`, the material and the colour texture, write a `README.md` with author, pack and licence, and tell `outfit.py` how to split it (`_REGIONS`: which part of the texture is which piece).
- **What the free library has, honestly** (looked at on 21 November 2026): the CC0 packs cover men's and women's suits well, and a few modern tops and trousers. They have no period shirts, blouses, frocks, coats or breeches in CC0. (Looked at again on 22 November 2026: the CC-BY packs `shirts02`, `dress02`, `dress03`, `skirts02` and `pants02` hold men's shirts, plain dresses, a ladies' apron and trousers that could serve. CC-BY needs a credit line in each game that uses them, so it is the owner's call; none has been brought in.) So everyday clothes are still made by `era.py`. Where a period piece is needed often, model it once on the standard body and add it here, do not add another special case to `era.py`.

## Airline uniforms and a chef (24 November 2026, Air Jamaica)

- **`"outfit": {..., "uniform": {"double": true, "rings": 4, "wings": true}}`** (`tools/people/outfit.py`): on the fitted suit, the jacket's own buttons give way to two columns of three gold buttons (double-breasted), gold rings go round each sleeve above the cuff (the number given), and gold wings sit on the left breast, 12.8 cm out so they clear the lapel. Each piece takes the jacket's own weights. Colour: `Buttons`, and `Rings` for the rings and wings (gold by default).
- **`"captop": true`** on a `peaked` cap (`tools/garvey/era.py`): a white top (`Cap`), a gold band (`CapBand`), a black peak (`CapPeak`) and a round badge (`CapBadge`, orange-red by default) on a gold ring.
- **`"chefbuttons": 6`** on an untucked shirt with `"collar": "stand"` and `"buttons": false`: a chef's double-breasted jacket, two columns of small buttons (`Buttons`). Give it `"belt": false`, or the belt shows through the untucked hem.
- **Hat `"toque"`**: a chef's tall pleated white hat (`Hat`), with three thin stripes round the band (`HatStripeR`, `HatStripeO`, `HatStripeY`, red, orange and yellow by default).

## Modern clothes: 1988 to today (25 November 2026, Air Jamaica and Hurricane Melissa)

The owner asked for a wardrobe of the late 20th and 21st centuries, true to each year: jeans, polo shirts (some striped), sneakers, sandals, baseball caps, fine gold chains, and women in trousers and modern tops, not long skirts. All of it is in `tools/garvey/era.py`, so every game gets it.

| Key | What it makes |
|---|---|
| `"polo": n` | A polo shirt: with `"collar": "turn"`, the front band is short, at the throat, with n buttons. |
| `"stripes": w` | Level stripes `w` metres deep (at a grown man's size) on the shirt's body, in `Stripe` on `Shirt`; the sleeves stay plain. The shirt is cut along every stripe's edge, so the edges are clean lines. A game that recolours `Shirt` loses the stripes: leave `Shirt` alone on a striped body. |
| `"denim": 1` | Jeans: the `Breeches` colour paler where denim wears (the front of the thighs, the knees) and a little uneven. |
| `"sneakers": true` | A deep rubber sole (about 2 cm) under the shoe; give `Shoes` and `Sole` white for white sneakers. |
| `"sandals": 1` or `2` | Only the straps of the shoe are kept (one broad strap over the front of the foot; 2 adds a strap round the back of the ankle), the sole gets a top, and the bare foot shows. |
| `"hat": [["baseball", "Cap"]]` | A baseball cap: a soft six-panel crown, a button, a stiff curved peak (`CapPeak`, the cap's colour unless given). The hair under the crown is removed. `hatdrop` lowers it (default 1.4 cm). |
| `"chain": d` | A fine gold chain (`Chain`, a little metallic) lying on whatever is outermost at the base of the neck, hanging `d` metres lower at the front. |
| `"woman": true` with `"trousers": true` | Women in trousers or jeans: works as for men. Tuck the top in (`"untucked": false`, `"belt": true`) for 1988 to the 1990s; wear it out for the 2000s on. |

**Fixed in the builder on the way (25 November 2026):** an untucked shirt over long trousers had the trousers pushed out through its hem (the trousers were cleared over the shirt as for a tucked one). Now, with `untucked` and long trousers: the trousers are kept off the skin only, their top is cut away 3 cm inside the shirt's hem (never seen), the hem ends at the top of the hips (`HIP - 0.035`; with shorts it stays at `HIP - 0.075`), each point of the hem clears the trousers at its own height, and no belt is made (it would show over the shirt). And from `era` 1990 on, a point well inside the arm's line is the waist, not the arm, so a fuller figure's top no longer has a hole cut at the waist by the sleeve's reach.

**Still to look at:** mid-stride, the front of a loose shirt's hem is pushed a little by the lifted thigh; the cap's crown reads a little tall from the front three-quarter.

## Hands keep their fingers when packed (17 November 2026)

The owner saw spiky, claw-like fingers again. The cause was the packer: when the face was given its own share of triangles (`splitFaces`), the rest of the skin was cut harder and every finger collapsed into a long thin spike. `splitHands` in `tools/people/pack.mjs` now keeps the hands out of the general simplification too (80 per cent of their triangles on a full body, 35 per cent on a light copy), so fingers keep their shape. To bring a packer change to every game without Blender: `node tools/people/rebuild.mjs --repack` packs again from the bodies already built in `build/people-all/`. The sheet tool has a close-up hand view (`views=hand,handfront,handback`). `--repack` reaches every game: it is passed on to `tools/selassie/build-people.mjs` and `tools/windrush/build-people.mjs`, which then pack from the bodies in `build/selassie-people` and `build/windrush-people` and run no Blender. It stops with a clear message if a body was never built on this machine (`build/` is not in git), and it does not change how a body is built: see `docs/HANDOFF.md`, "Read this before any body is rebuilt".

In `engine/anim.js` the fingers of talking and gesture clips are also eased toward the Idle's relaxed hand (`relaxHands`), and the finger joints no clip moves get a slight curl (`curlFingers`).

## Collars flush, no skin at the waist (17 November 2026, later)

The owner sent a picture of a proper shirt collar and pointed out gaps with skin showing under the collar and below the belt.
- The flat round collar's inner edge read as torn at the throat. Every round-collar recipe now wears the turn-down shirt collar (a band round the neck and a folded leaf with points, like the owner's picture), with shorter points on a blouse or a child (`small` in the turn collar).
- `tuck_under_collar` now runs for every collar, not only flat ones: neck skin under the leaf is sunk and bound to the collar, so no wedge of skin shows when the head turns.
- `tuck_under_skirt` (new): loose patches of the body's own skin left at the waist under the blouse or skirt are removed. They came out between the belt and the skirt when the body bent.
Bodies are rebuilt in a later commit.

### Sleeves at the elbow (23 November 2026)

The owner saw "choppy" sleeves in The Shark Papers: with the elbow bent, thin slivers of an elbow-length sleeve's hem stuck out under the arm. The builder ties the lower ring of such a sleeve wholly to the forearm and the part above wholly to the upper arm, with one narrow shared band, and ties the sleeve's underside partly to the chest. `node tools/people/sleeve-blend.mjs <game> [ids]` fixes it on the packed bodies (every copy: `_lo`, `_crowd`, `_focus`, `_phone`): it blends the two arm bones smoothly over about 16 cm round the elbow, from the skeleton's rest pose and each garment's own skin, and gives a point plainly on the arm to the arm bones alone. Run on all of The Shark Papers' bodies; the side view is clean and the slivers are much smaller from the front and back, but not gone: the hem's own shape needs the builder (`tools/garvey/era.py`, the sleeve hem's weights) and a rebuild, which needs MakeHuman on the machine. `pack.mjs` does not run it yet; run it again after a rebuild. Other games' elbow-length sleeves have not been looked at yet.

- `beltover: true` (23 November 2026): a belt laid over a coat or tunic instead of under it, taking the coat's weights (moved from the Selassie game's finish script). Note the builder's later-era `coat` still has full shoulders and bell sleeves; for a fitted tunic build it as the shirt with `collar: "stand"` and `belt`, as Morant Bay's constable is.

**Untucked shirts and chains, fixed 25 November 2026** (rule 15 sheets of the Air Jamaica bodies; `tools/garvey/era.py`): the hem straightening now includes the hem's own sides below the waist (the limit that keeps sleeves out cut them off, and a tear opened where the straightened front met them); the hem is levelled within 12 cm of its line and every point kept at or above it; the weights of the lower shirt are averaged with their neighbours' (alternate points followed the hips and the spine, so the hem came out jagged) and three quarters of any thigh weight below the hips goes to the hips. A gold chain is laid over the collar as well as the shirt, and lifted off the cloth more where it hangs low. Rebuild any body with `"untucked": true` or `"chain"` to pick these up. Tivoli's `man2010` and `youth2010` (untucked) have **not** been rebuilt: its doc asks that builder changes reach it only by the owner's choice.
