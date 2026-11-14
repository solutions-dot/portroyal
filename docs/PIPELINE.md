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

- `colors`: RGB for Skin, Shirt, Coat, Breeches, Stockings, Shoes, Hat, Hair, Apron, Bands. Every garment you use needs its colour, or the script stops with a KeyError. Optional: `CoatButtons`, `ShoeBuckle`.

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

```bash
node tools/optimize_models.mjs --dir games/port-royal/site/models --chars mendes turtler   # writes mendes.m.glb and turtler.m.glb (uses shared/rig/eye_small.jpg for the eyes; without it a character packs to over 1 MB)
python3 tools/pack_models.py ...                                                           # or the one-liner below
for n in mendes turtler; do printf '(window.__models=window.__models||{})["%s"]="%s";' $n "$(base64 -w0 games/port-royal/site/models/$n.m.glb)" > games/port-royal/site/models/$n.js; done
```

Only the `.js` files are loaded by the game. Keep each character at roughly 300 to 480 KB packed. Port Royal's people are packed with `tools/people/pack.mjs` (section 1), not with the commands above.

## 5. The clothes builder: `tools/garvey/era.py` (Garvey, Kendal, children, and Port Royal)

`era.py` builds every body for Marcus Garvey and Kendal 1957 (recipes in `tools/garvey/people/`, `tools/kendal/people/`, `tools/people/kids/`). Set up Blender, MPFB and MakeHuman as in `tools/garvey/README.md`.

```bash
MAKEHUMAN=~/mh/makehuman NPC_OUT=build/people/ ~/venv/bin/python3 tools/garvey/era.py "$(cat tools/kendal/people/woman57.json)"
node tools/people/pack.mjs --out games/kendal/site/models --lo woman57     # trims, compresses, writes woman57.js and woman57_lo.js
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

**Target.** In daylight, a Black character's face, measured as the mean of the forehead and cheeks with the person turned to four headings, is a warm brown of about R 85 to 120 (for example 101,67,47 in Kendal). West African people (Kofi, the turtler) sit at the darker end (about R 70 to 80 as a mean, R 90 to 100 on the lit side) and are never near-black; mixed-heritage people (buc1, the sailor) are a little lighter. Light-skinned Port Royal characters keep the look they always had.

**Why the games used to differ.** The builder wrote colours that were already linear into a colour layer that Blender treats as sRGB, so every colour was made linear twice: a recipe skin of 150,102,74 drew as about 67,32,16 (very dark and red). Kendal then lightened skin by 1.55, Port Royal used ACES tone mapping and bright light with no factor, and Garvey's rooms are lit more softly, so the same recipe looked different in each game.

**What is done now.**
- `tools/garvey/era.py` writes skin as its recipe says (`SKS`), so a recipe skin is the same brown in every game. Garments keep the old behaviour. The light-skinned 1690 recipes were changed to the value they used to produce, divided by Port Royal's factor, so they look as before.
- Each game has one documented factor on the `Skin` material for its own light: Kendal `SKIN_LIGHT = 1.0` (none), Garvey `SKIN_K = 1.2`, Port Royal `SKIN_K = 0.85`. Kendal crowds vary skin by 0.9 to 1.15 only.
- Typical recipe values: 150,102,74 for most Kendal and Garvey people, 116,76,55 for Kofi and 110,72,52 for the turtler, about 168,118,86 for mixed heritage.

**How to measure.** `?test=skin` in each game's dev build (`engine/skinprobe.js`) renders each face in that game's own light from four headings and prints the mean, darkest and lightest colour (Garvey prints indoor and outdoor light). Check new people against the target before calling them done.

**Not yet covered.** Abba and Grace in Port Royal still come from `tools/blender/abba.py` and draw much darker and redder (about 63,18,9); they need rebuilding with `era.py`.

