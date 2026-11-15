# One character builder with period wardrobes: design

I read everything in the brief (read-only). I also decoded packed bodies to stdout, listed the MPFB face targets, and checked gltf-transform 4.5.1 and three 0.187. `tools/garvey/era.py` is still changing: it had new commits and an uncommitted 26/22-line diff while I worked. So the "same output" baseline (step 0) has to be taken after the collar and chest work lands.

## 0. What I found that affects the plan

1. **Waistcoat buttons float when the waistcoat is hidden.** The in-progress builder adds `WButtons` (material `WaistcoatButtons`) to V waistcoats worn without a jacket. Kendal's `man_shirt` and `man_elder` (full and light) already carry them. No game hides that material, and `makeBody` hides by exact material name. So every look with `hide: ['Waistcoat']` on those bodies shows buttons floating on the shirt. Kendal's `crowd57` hides the waistcoat on half its `man_shirt` men. Fix now: hide `WaistcoatButtons` together with `Waistcoat`. Later the metadata in section 6 fixes it for good.
2. **The shared copies have already drifted.** Kendal's `man_shirt` and `man_elder` have `WButtons`. The copies in Melissa, Eventide and Tivoli do not. "Build once and copy" is not enforced today. The manifest's copy step (section 8) fixes this.
3. **`smooth` is still read, though PIPELINE.md says it does nothing.** On a shirt with no coat it smooths every cut edge instead of only the neckline (era.py line 171 in today's working tree). It is set in `clerk1919`, `engineer1919`, `hl_pressman`, `seaman1919`, `steward1920`, `student2020` and `boy1980`. Converting those recipes must keep it.
4. **`era` means two things.** It is both the year a person is dressed for and a switch for the tailoring code. The thresholds in era.py are:
   - before 1800: the 1690 cut;
   - `collar: true` before 1925: a stand collar;
   - shirt tuck height before 1940.

   Nanny's women are built at 1900 to get the later cut. Twenty Garvey recipes leave `era` out, so they build as 1915. Kendal's `man_work` (era 1900) dresses people of 1845, the 1890s and 1957. The design separates `year` (history) from `cut_era` (tailoring).
5. **Everyone does look alike.** Only 2 of 69 recipes have face targets (both are Marcus Garvey). 70 pairs of recipes have body macros within 0.12 of each other in total. Several pairs are identical:
   - `maroon_boy` and Kendal's `boy`;
   - `maroon_girl` and `girl`;
   - `girl_small` and `maroon_child`;
   - `hl_woman` and `woman1914`;
   - `nb_youth` and `printer1907`.

   Only 33 different `Skin` values appear in 69 recipes.
6. **Kendal's models folder holds 20 Garvey bodies the game never loads.** They are copies left by using Kendal's people viewer to look at other games' bodies. The proof page (section 8) replaces that habit.
7. **Abba's file has her Idle clip built in.** Port Royal runs her on her own mixer and also uses that clip as the fallback for everyone (`setFallbackClip`). The shared library's `Idle` is already Abba's clip (`tools/anims/clips.json`: `"Idle": "abba_Idle_withoutskin.fbx"`). So a rebuilt Abba keeps her idle, but Port Royal's `main.js` must switch her to `animate()`.

## 1. Folder layout and file names

```
tools/people/                    everything about building people lives here
  README.md                      how to add a person, a garment, a period, a kit
  build.py                       Blender entry point: resolve a recipe, build, run kits, write metadata, export
  resolve.py                     plain Python (no bpy): recipe + wardrobe -> flat build recipe; --check, --same, --keys, --who
  builder/                       the builder, run inside Blender (made from era.py in steps 7 and 8)
    run.py                       runs the phases in order on one context
    body.py                      MakeHuman body, macros, targets, face, upscale, rig, eyes, landmarks (HIP, KNEE, NECK...)
    tailoring.py                 the shared rules: layer table, ease, clearances, shared weights, clear_layer, recut,
                                 removal of covered skin, the 1690 lining
    kinds/shirt.py collar.py neckwear.py legwear.py belt.py skirt.py waistcoat.py coat.py apron.py
          footwear.py hats.py hair.py accessories.py
    paint.py                     the 'Col' float colour layer (linear), lips, brows, hairline ramp
    meta.py                      the metadata written into the glb
    face.py                      seeded faces, face prints, later face morphs
    kitlib.py                    helpers for add-on kits (colmat, paint, new_obj, solidify, hide_under, box, on/hit; from tools/tivoli/kit.py)
    face_points.json             fixed MPFB base-mesh vertex list for face prints
  wardrobe/
    README.md                    the schema (section 2)
    1690s.json 1730s.json 1840s.json 1890s.json 1900s.json 1910s.json 1920s.json
    1950s.json 1960s.json 1980s.json 2010s.json 2020s.json
    faces.json                   face variation tables (versioned) and background macro mixes
  shared/                        recipes for a body used by more than one game (built once, copied); expected to stay nearly empty
  make.mjs                       the one command per game (section 8)
  pack.mjs                       (exists) now also writes the body metadata object
  stamp.mjs                      migration aid: writes metadata into already-packed bodies, no rebuild (like fix_colours.mjs)
  compare.mjs                    same-output check of two bodies (section 9)
  same.mjs                       face sameness across a game (used by make.mjs)
  proof/index.html, proof.js     the proof sheet page (bodies, faces, cloth, compare), bundled with esbuild
  baseline.json                  committed fingerprints of every body taken before the refactor
  fix_colours.mjs                (exists, unchanged)
  npc.py, preview_*.py, abba_fix.mjs   retired, kept for reference
tools/<game>/people/*.json       recipes (owned by the game); Port Royal's move to tools/port-royal/people/ at the end
tools/<game>/kit.py              add-on kits (owned by the game), for example tools/tivoli/kit.py
games/<game>/people.json         the manifest (owned by the game), next to anim-clips.json
engine/body.js                   runtime helper (section 6)
```

**Keeping old commands working:**
- **After step 2**, `tools/garvey/era.py` gets two guarded additions and nothing else changes in it. Near the top:

  ```python
  if 'wear' in P:      # a recipe that picks its clothes from a wardrobe (tools/people/wardrobe/): turn it into the keys below
      sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'people')); from resolve import resolve; P = resolve(P)
  ```

  Just before `bpy.ops.wm.save_as_mainfile`:

  ```python
  if 'BODY_HOOK' in globals(): BODY_HOOK(globals())      # tools/people/build.py: metadata and kits, before the .blend is saved and the .glb exported
  ```

  `build.py` runs era.py with `runpy.run_path(..., init_globals={'BODY_HOOK': hook}, run_name='__main__')`.
- **After step 7**, the direction flips: the builder lives in `tools/people/builder/` and `tools/garvey/era.py` becomes a shim that runs `tools/people/build.py`. `build.py` accepts the JSON text (the old `"$(cat recipe)"` form) or a path.
- `tools/eventide/people.py` becomes the same shim once its garments are folded in (step 9).
- `tools/tivoli/kit.py "<json>"` keeps working on its own.
- `pack.mjs` options do not change.

## 2. The wardrobe file

There is one file per period: `tools/people/wardrobe/<period>.json`. The fields:

- `period`, `place`, `years`
- `extends`: another period to inherit garments from; this file adds or overrides.
- `cut_era`: the tailoring a body falls back to when none of its garments asks for one.
- `status`: honest wording for the proof sheet, for example "general picture".
- `sources`: `{ id: {ref, note, checked} }`. `checked` stays false until someone has read it (rule 3).
- `garments`: `{ id: garment }`, where a garment has:
  - `kind`: one of the shared kinds in section 4;
  - `label`, `who` (man, woman, boy, girl), `layer` (only for new kinds);
  - `cut`: build parameters (during the migration these are the existing G keys, so the mapping is exact);
  - `vary`: ranges a seed may pick from;
  - `mats`: material name to `{palette}` in sRGB;
  - `cut_era`: only when the garment needs a different tailoring;
  - `hideable`, `covers`, `sources` (ids), `notes`.
- `outfits`: optional named lists of garments.
- `missing`: garments the period needs that the builder cannot make yet.

Rules the resolver enforces:
- A garment needs `sources`, or the period `status` must say "general picture". The proof sheet prints unsourced garments in red.
- Garments with no `cut_era` do not vote.
- Two worn garments that ask for different tailoring classes are an error. The classes are: before 1800, 1800 to 1924, 1925 to 1939, and 1940 on.
- Two garments that set the same key to different values are an error unless the recipe overrides it.
- An override of `null` removes a key.
- `brim` is one value for all of a body's hats (an era.py limit), so two hats asking for different brims are an error.

**Example: `1950s.json` (Jamaica).** Every garment maps to keys era.py already reads. The values are copied from Kendal's recipes. The sources are places to look, not checked facts.

```json
{
  "period": "1950s", "place": "Jamaica", "years": [1950, 1959], "cut_era": 1950,
  "status": "general picture: not yet matched to photographs (docs/games/kendal.md)",
  "sources": {
    "nlj-photos": {"ref": "National Library of Jamaica, photograph collection: street, church and railway pictures of the 1950s", "note": "search before marking any garment checked", "checked": false},
    "gleaner-1957": {"ref": "The Daily Gleaner, August and September 1957, photographs of excursion crowds", "checked": false}
  },
  "garments": {
    "dress_shirt":   {"kind": "shirt", "who": ["man"], "label": "white long-sleeved shirt, turn-down collar, button band",
                      "cut": {"sleeve": 0.95, "collar": "turn"}, "vary": {"sleeve": [0.92, 0.97]},
                      "mats": {"Shirt": {"palette": [[240,236,226],[244,240,230],[232,228,214]]}}, "sources": ["nlj-photos"]},
    "camp_shirt":    {"kind": "shirt", "who": ["man","boy"], "label": "open-necked shirt with a broad pointed camp collar",
                      "cut": {"sleeve": 0.42, "collar": "camp"}, "vary": {"sleeve": [0.36, 0.95]},
                      "mats": {"Shirt": {"palette": [[240,236,226],[200,214,226],[226,214,180]]}}, "sources": ["nlj-photos"]},
    "camp_blouse":   {"kind": "shirt", "who": ["woman"], "cut": {"woman": true, "sleeve": 0.3, "collar": "camp", "puff": 1.0, "buttons": true}, "sources": ["nlj-photos"]},
    "round_collar_blouse": {"kind": "shirt", "who": ["woman"], "cut": {"woman": true, "sleeve": 0.92, "collar": "round"}, "sources": ["nlj-photos"]},
    "girls_frock_top": {"kind": "shirt", "who": ["girl"], "cut": {"woman": true, "sleeve": 0.3, "collar": "round", "puff": 0.8}, "sources": ["nlj-photos"]},
    "tie":           {"kind": "neckwear", "cut": {"tie": true}, "hideable": true, "mats": {"Tie": {"palette": [[40,50,90],[154,42,42],[42,42,42]]}}},
    "waistcoat_v":   {"kind": "waistcoat", "cut": {"waistcoat": true, "vwaist": true}, "hideable": true, "covers": ["Belt", "Buckle"]},
    "suit_jacket":   {"kind": "jacket", "cut": {"jacket": true, "jacketsleeve": 0.92}},
    "pleated_trousers": {"kind": "legwear", "cut": {"trousers": true}, "notes": "front pleats are not modelled yet: a straight leg with a crease"},
    "leather_belt":  {"kind": "belt", "cut": {"belt": "always"}, "notes": "kept under a waistcoat; hidden while the waistcoat shows"},
    "boys_shorts":   {"kind": "legwear", "who": ["boy"], "cut": {"trousers": true, "shorts": true, "legwidth": 1.3}},
    "circle_skirt":  {"kind": "skirt", "who": ["woman"], "cut": {"skirt": true, "hem": 0.66, "flare": 1.8, "pleats": 11}, "vary": {"hem": [0.6, 0.72]}},
    "plain_skirt":   {"kind": "skirt", "cut": {"skirt": true, "hem": 0.5, "flare": 1.2}},
    "girls_full_skirt": {"kind": "skirt", "who": ["girl"], "cut": {"skirt": true, "hem": 0.95, "flare": 2.3, "pleats": 11}},
    "sash":          {"kind": "belt", "cut": {"belt": true, "sash": true}},
    "narrow_belt":   {"kind": "belt", "cut": {"belt": true}},
    "oxford_shoes":  {"kind": "shoes", "cut": {"shoes": true}},
    "court_shoes":   {"kind": "shoes", "who": ["woman","girl"], "cut": {"shoes": true}, "notes": "low cut with a skirt (automatic)"},
    "ankle_socks":   {"kind": "socks", "cut": {"socks": 0.3}},
    "trilby":        {"kind": "hat", "cut": {"hat": "trilby"}},
    "peaked_cap":    {"kind": "hat", "cut": {"hat": "peaked"}, "notes": "railway, police and nurse caps"},
    "top_hat":       {"kind": "hat", "cut": {"hat": "top"}},
    "flat_cap":      {"kind": "hat", "cut": {"hat": "flat"}},
    "church_hat":    {"kind": "hat", "who": ["woman"], "cut": {"hat": "church"}},
    "pillbox":       {"kind": "hat", "who": ["woman"], "cut": {"hat": "pillbox"}},
    "head_wrap":     {"kind": "hat", "who": ["woman"], "cut": {"hat": "wrap"}, "covers": ["Bun"]},
    "short_hair":    {"kind": "hair", "cut": {"hairvol": 0.3}, "vary": {"hairvol": [0.2, 0.35]}},
    "bun":           {"kind": "hair", "who": ["woman"], "cut": {"bun": true, "hairvol": 0.3}},
    "puffs":         {"kind": "hair", "who": ["girl"], "cut": {"hair": "puffs", "hairvol": 0.3}},
    "plaits":        {"kind": "hair", "who": ["girl"], "cut": {"hair": "plaits", "hairvol": 0.3}}
  },
  "outfits": {"sunday_man": ["dress_shirt","tie","waistcoat_v","leather_belt","pleated_trousers","oxford_shoes","short_hair"],
              "sunday_woman": ["camp_blouse","circle_skirt","sash","court_shoes","bun"]},
  "missing": [{"what": "front pleats and turn-ups on trousers"}, {"what": "a shirt worn outside the trousers"}]
}
```

**Example: `1690s.json` and `1730s.json`.** These are taken from Port Royal's and Nanny's recipes.

```json
{
  "period": "1690s", "place": "Port Royal, Jamaica", "years": [1685, 1699], "cut_era": 1690,
  "status": "general picture of English and Caribbean dress of the 1690s",
  "sources": {
    "sloane-1707": {"ref": "Hans Sloane, A Voyage to the Islands Madera, Barbados, Nieves, S. Christophers and Jamaica, vol. 1 (1707)", "note": "read for dress in Jamaica, 1687 to 1689", "checked": false},
    "holme-1688": {"ref": "Randle Holme, The Academy of Armory (1688), book 3", "note": "read for the names and cut of coats, breeches and caps", "checked": false}
  },
  "garments": {
    "linen_shirt":   {"kind": "shirt", "cut": {"sleeve": 0.86}, "notes": "without a coat it ends in a narrow band at the neck (automatic)",
                      "mats": {"Shirt": {"palette": [[232,226,212],[216,204,174],[178,166,140]]}}, "sources": ["holme-1688"]},
    "work_shirt":    {"kind": "shirt", "cut": {"sleeve": 0.42}, "vary": {"sleeve": [0.36, 0.6]}, "sources": ["sloane-1707"]},
    "coat_1690":     {"kind": "coat", "cut": {"coat": true, "coatsleeve": 0.82, "coathem": 0.04}, "vary": {"coathem": [0.02, 0.12]}, "sources": ["holme-1688"]},
    "breeches":      {"kind": "legwear", "cut": {"breeches": true}, "sources": ["holme-1688"]},
    "plain_breeches":{"kind": "legwear", "cut": {"breeches": true, "breechkind": "plain"}},
    "slops":         {"kind": "legwear", "cut": {"breeches": true, "breechkind": "slops"}, "notes": "a seaman's wide open breeches"},
    "stockings":     {"kind": "socks", "cut": {"stockings": true}},
    "buckled_shoes": {"kind": "shoes", "cut": {"shoes": true, "buckles": true}},
    "plain_shoes":   {"kind": "shoes", "cut": {"shoes": true}},
    "cravat":        {"kind": "neckwear", "cut": {"bands": true}},
    "work_apron":    {"kind": "apron", "cut": {"apron": true}, "hideable": true},
    "felt_hat":      {"kind": "hat", "cut": {"hat": "felt", "brim": 1.0}},
    "knit_cap":      {"kind": "hat", "cut": {"hat": "cap"}},
    "long_hair":     {"kind": "hair", "cut": {"hairvol": 0.9}, "vary": {"hairvol": [0.6, 0.95]}},
    "short_hair":    {"kind": "hair", "cut": {"hairvol": 0.3}}
  },
  "missing": [{"what": "women's shift, bodice and petticoat in the 1690 cut (Abba and Grace)"}]
}
```

```json
{
  "period": "1730s", "extends": "1690s", "place": "Jamaica: the Windward Maroons of the Blue Mountains, and the colony", "years": [1728, 1740], "cut_era": 1734,
  "status": "very little is known: no description of Windward Maroon dress survives (tools/nanny/README.md)",
  "sources": {"dallas-1803": {"ref": "R. C. Dallas, The History of the Maroons (1803)", "note": "a Leeward captain in 1738: loose drawers to the knee, a small round hat, no shirt (as summarised in tools/nanny/README.md; read the page before marking it checked)", "checked": false}},
  "garments": {
    "plain_blouse":  {"kind": "shirt", "who": ["woman","girl"], "cut": {"woman": true, "sleeve": 0.5}, "cut_era": 1900,
                      "notes": "built with the later cut: the 1690 cut left skin showing at the waist (docs/games/nanny.md)"},
    "long_skirt":    {"kind": "skirt", "who": ["woman"], "cut": {"skirt": true, "hem": 0.05, "flare": 1.2}, "cut_era": 1900},
    "child_skirt":   {"kind": "skirt", "who": ["girl"], "cut": {"skirt": true, "hem": 0.9, "flare": 1.4}, "cut_era": 1900},
    "head_wrap":     {"kind": "hat", "who": ["woman"], "cut": {"hat": "wrap"}},
    "redcoat_coat":  {"kind": "coat", "cut": {"coat": true, "coatsleeve": 0.84, "coathem": 0.02}}
  },
  "missing": [{"what": "cocked (three-cornered) hat for the British soldiers; felt_hat stands in"},
              {"what": "bare chest with knee drawers (Dallas); needs a body with no shirt (tools/nanny/README.md)"},
              {"what": "a small round hat (Dallas)"}]
}
```

## 3. The recipe after the change

The fields:
- `name` (unique across the repo), `who` (one line; says "fictional" or names the real person), `period`, `year`.
- `body`: MakeHuman macros, as today.
- `seed`, `face`, `likeness`, `build` (section 5).
- `skin`: `[r,g,b]` or `"vary"`.
- `wear`: a list of garment ids, or `{use, ...overrides}`.
- `hats`: a list of `{use, as}`. `as` is the material name; the first hat defaults to `"Hat"`.
- `colors`: overrides the palettes; `Hair` goes here.
- `upscale`, `draw_scale` (a child's size in the game; defaults to 1/upscale).
- `cut_era`: a rare override.
- `kit`: `{script, ...params}`.
- `garments`: an escape hatch for raw keys. It warns.
- `fbx`, `notes`.

The resolver turns this into today's flat recipe (`era` = `cut_era`, `garments` = G, `colors`, `targets`, `body`, `upscale`). It also adds `year` and `period` for the metadata.

**`tools/kendal/people/man_shirt.json`, converted:**

```json
{
  "name": "man_shirt", "who": "a Kingston man in his Sunday shirt and waistcoat, 1957 (fictional)",
  "period": "1950s", "year": 1957,
  "body": {"gender": 1.0, "age": 0.45, "muscle": 0.45, "weight": 0.45, "height": 0.5, "proportions": 0.55, "african": 1.0, "caucasian": 0.0, "asian": 0.0},
  "skin": [150, 102, 74],
  "wear": [{"use": "dress_shirt", "sleeve": 0.95}, "tie", "waistcoat_v", "leather_belt", "pleated_trousers", "oxford_shoes", {"use": "short_hair", "hairvol": 0.3}],
  "hats": [{"use": "trilby", "as": "Hat"}, {"use": "peaked_cap", "as": "Cap"}],
  "colors": {"Shirt": [240,236,226], "Collar": [240,236,226], "Breeches": [70,70,76], "Waistcoat": [70,60,56], "Tie": [40,50,90], "Shoes": [30,22,18], "Hat": [150,126,90], "Cap": [35,44,62], "Hair": [22,18,16]}
}
```

This resolves to `era 1950` and `{sleeve 0.95, collar "turn", tie, waistcoat, vwaist, belt "always", trousers, shoes, hairvol 0.3, hat [["trilby","Hat"],["peaked","Cap"]]}`, which is the original exactly.

**`tools/nanny/people/maroon_man.json`, converted:**

```json
{
  "name": "maroon_man", "who": "a man of Nanny Town: Cubbenah, village men, fighters (fictional)",
  "period": "1730s", "year": 1734,
  "body": {"gender": 1.0, "age": 0.42, "muscle": 0.6, "weight": 0.45, "height": 0.52, "proportions": 0.55, "african": 1.0, "caucasian": 0.0, "asian": 0.0},
  "skin": [148, 100, 72],
  "wear": [{"use": "work_shirt", "sleeve": 0.42}, "plain_breeches", {"use": "short_hair", "hairvol": 0.3}],
  "hats": [{"use": "knit_cap", "as": "Hat"}],
  "colors": {"Shirt": [216,204,174], "Breeches": [106,74,52], "Hat": [74,58,42], "Hair": [22,18,16]}
}
```

This resolves to `era 1734` and `{sleeve 0.42, breeches, breechkind "plain", hat [["cap","Hat"]], hairvol 0.3}`, again the original. Adding `"seed": 1734001, "face": {"vary": true}` later is a deliberate change that gets reviewed on the faces sheet.

## 4. Every current G key and the kind module it becomes

| G key (or top-level key) | Kind | Module |
|---|---|---|
| `body`, `targets`, `upscale` | body | `builder/body.py` (the face block adds targets) |
| `sleeve`, `woman`, `highneck`, `puff`, `hang`, `smooth`, `vdepth`, `vslope` | shirt / blouse | `kinds/shirt.py` (`smooth` becomes `edge: "all"`) |
| `buttons`, `pocket` | shirt trims (Placket, Buttons, Pocket) | `kinds/shirt.py` |
| `collar` (`turn`, `stand`, `open`, `camp`, `round`, `true`), `softcollar`, `leaf`, the automatic 1690 `band` | collar | `kinds/collar.py` |
| `tie`, `scarf`, `bands` (cravat: Collar, CollarYoke, ScarfEnds) | neckwear | `kinds/neckwear.py` |
| `trousers`, `breeches`, `breechkind` (`plain`, `slops`, `trousers`), `shorts`, `legwidth`, the 1690 Waistband | legwear | `kinds/legwear.py` |
| `belt` (`true`, `"always"`, `false`) with trousers; `sash` and `belt` with a skirt | belt / sash (Belt, Buckle) | `kinds/belt.py` |
| `skirt`, `hem`, `flare`, `pleats` | skirt | `kinds/skirt.py` |
| `waistcoat`, `vwaist` (and WButtons) | waistcoat | `kinds/waistcoat.py` |
| `jacket`, `jacketsleeve`, `jackethem` (JacketSkirt, Lapels, JButtons) | jacket | `kinds/coat.py` |
| `coat`, `coatsleeve`, `coatsleeves`, `coathem`, `coatopen`, `coatbuttons` (CoatSkirt, CoatNeck, CoatButtons) | 1690 coat | `kinds/coat.py` |
| `apron` | apron | `kinds/apron.py` |
| `shoes`, `lowshoes`, `buckles` (Sole, ShoesBuckle, ShoesTongue) | shoes | `kinds/footwear.py` |
| `socks`, `stockings` | socks / stockings | `kinds/footwear.py` plus the sock split in `tailoring.py` |
| `hat` (`felt` 1690, `felt` later, `flat`, `trilby`, `straw`, `bowler`, `top`, `church`, `pillbox`, `peaked`, `cap`, `wrap`), `brim` | hat / head wrap | `kinds/hats.py` |
| `hair` (`none`, `afro`, `puffs`, `plaits`), `hairvol`, `recede`, `temples`, `bays`, `fade`, `bun` | hair | `kinds/hair.py` |
| `moustache`, `moustachewidth`, `moustachedroop` | facial hair | `kinds/hair.py` |
| `brows`, `browwide` | face paint | `builder/paint.py` |
| top-level `era` | tailoring generation | `builder/tailoring.py` |
| `name`, `colors`, `fbx`; env `NPC_OUT`, `MAKEHUMAN`, `FOLDS`, `PROBE` | export, paint | `builder/export.py`, `builder/paint.py` |
| Eventide fold-in: `cardigan`, `cardigansleeve`; `glasses`; `headtie`; boolean `socks`; `breechkind: "shorts"` | jacket kind (layer 3); accessory; head wrap with `style: "tie"`; socks become a fraction (about 0.35) and the material becomes `Sock` (Eventide used `Socks`); shorts become `trousers` + `shorts` | `kinds/coat.py`, `kinds/accessories.py`, `kinds/hats.py`, `kinds/footwear.py`, `kinds/legwear.py` |

**The layer table** is the shared tailoring contract in `tailoring.py`, for every era after 1800:

| Layer | Kinds | Ease | Clearance pass | What it deletes underneath | Hideable |
|---|---|---|---|---|---|
| 0 | skin | none | none | none | no |
| 1 | shirt / blouse | 9 mm, tucked 3 mm | 6 mm over skin | covered skin | no |
| 2 | trousers / breeches / shorts | hip to hip, 12 mm | 7 mm over skin and shirt | covered skin | no |
| 2 | skirt | 10 mm | 4 mm | covered skin | no |
| 3 | waistcoat, cardigan (new), bodice (new) | 19 mm | 8 mm over everything beneath | nothing | yes |
| 4 | jacket, coat | 19 mm, or 26 mm over a waistcoat | 5 mm | shirt back and sides, waistcoat back and sides | no |

- **Trims** (collar, placket, buttons, pocket, tie, lapels, belt, sash, WButtons, sole, buckles) take their bone weights from their host (`ON()`), are smoothed with `ring_fix`, and record `on: <host>`.
- **The 1690 cut** keeps its own rules (`drape_front`, the lining, `smooth_weights`) behind cut_era before 1800, inside each kind.

A new kind declares `layer`, `hideable`, `covers`, `trims` and its cuts. The loop then gives it ease, the shared weights, the clearance pass, the clean edges (`smooth_edge`, `recut`) and covered-skin removal. So it inherits clean collars and correct layers without new code for those rules. Generic pieces that games now make in kits (boots, from Tivoli) move into kinds (`footwear.py`: `boots`). Game-only pieces (POLICE letters, camouflage) stay in kits.

## 5. Faces and variety

**(a) Recipe face block and seeded variety.**

```json
"seed": 1957003,
"face":  {"vary": true, "strength": 1.0, "table": "v1", "keep": {"nose-flaring-incr": 0.4}},
"build": {"vary": true, "range": {"weight": [0.4, 0.6]}},
"skin": "vary"
```

- Each part draws from its own stream, `random.Random(f"{seed}:face")`. String seeds go through sha512, so the result does not depend on the Python run.
- **`face.vary`:** `faces.json` (versioned: retuning makes a `v2` table, so approved faces never move) defines about 30 axes. Each axis is a decr/incr pair of real MPFB targets; I checked every name in `data/targets`:
  - nose: `nose-scale-horiz`, `-vert`, `-depth`, `nose-flaring`, `nose-hump`, `nose-point-width`, `nose-nostrils-width`;
  - mouth: `mouth-scale-horiz`, `mouth-upperlip-volume`, `mouth-lowerlip-volume`, `mouth-cupidsbow`;
  - chin and jaw: `chin-width`, `chin-height`, `chin-prominent`, `chin-jaw-drop`;
  - cheeks: `lr-cheek-bones`, `lr-cheek-volume`;
  - eyes: `lr-eye-scale`, `lr-eye-trans-up`/`down`, `lr-eye-trans-in`/`out`, `lr-eye-eyefold-up`/`down`;
  - brows: `eyebrows-trans-up`/`down`, `eyebrows-angle-up`/`down`;
  - forehead: `forehead-scale-vert`, `forehead-nubian`;
  - ears: `lr-ear-scale`, `lr-ear-wing`, `lr-ear-lobe`;
  - head: `head-scale-horiz`, `head-scale-depth`, plus one of `head-oval`, `head-round`, `head-square`, `head-rectangular`, `head-diamond` at 0 to 0.5.
  - The `lr-` form already expands in era.py.
- **How values are picked:** each axis value is normal around 0 with a set spread, times `strength`, and clamped (about 0.7 at most).
  - The variation is symmetric around the MakeHuman average for the body's macros. Background only changes the macro mix, never pushes features one way. That keeps faces natural and avoids caricature.
  - Children use half the spread and skip jaw, chin and brow-ridge axes.
  - Elders add `lr-eye-bag-incr`, `neck-double-incr`, `head-age-incr` and `lr-cheek-volume-decr`.
  - Women use a smaller jaw and brow-ridge spread.
- **`build.vary`:** nudges height (about 0.06 either way), weight and muscle (about 0.08) and proportions (about 0.04) inside the recipe's `range`. A child's age moves by 0.02 at most.
- **`background`:** macro mixes are `west_african`, `mixed` (african 0.5 to 0.85, the rest caucasian), `european`, `chinese` (asian 0.85 to 1). MakeHuman has no South Asian macro, so `south_asian` needs the owner's review before use.
- **`skin: "vary"`:** picks a point inside rule 9's box, `[134,90,64]` to `[156,108,80]`. It leans darker for `west_african` and lighter for `mixed`, as PIPELINE.md says. Light-skinned people keep explicit colours.
- **Hair:** hair garments carry `vary` ranges by period (`hairvol`, `recede` with age, `fade` in the 2010s). Beards are listed as `missing`.
- **Freezing faces:** the resolved targets are written to `build/people/<name>.resolved.json` and to the metadata. `make.mjs --freeze <name>` writes them back into the recipe once the owner approves a face.
- **Real people:**

  ```json
  "likeness": {"person": "Marcus Garvey", "from": "photograph supplied by the owner (docs/games/garvey.md, Characters)", "checked": "2026-11-14", "targets": { ...today's 23 targets... }}
  ```

  - `face.vary` is not allowed when `likeness.targets` exist.
  - Amy Ashwood Garvey (`amy1914`) and Amy Jacques Garvey (`amyj1925`) get `"from": null, "status": "to shape"` until public-domain photographs are found and recorded in `docs/games/garvey.md`. The proof sheet labels them "likeness to do".
  - Nanny gets `"from": "none drawn from life; seen far off only (docs/games/nanny.md, rule 2)"`, no targets, and her own seeded face. That face is not a likeness and is never presented as one.

**(b) Enough different people without big downloads.** From PIPELINE.md, a full body is about 380 KB and a light copy about 180 KB.
- **Tier 1:** everyone the player talks to has their own full body and face.
- **Tier 2:** for each role (a wardrobe outfit, sex and age band), build 2 to 4 bodies with different seeds and builds, as full and light copies.
- **Tier 3 (crowds):** light copies of the role bodies, varied at runtime with:
  - colours drawn from the wardrobe palettes in the metadata (instead of the hand-typed `DRESS`, `TROUS` and `SUIT` lists in each `cast.js`);
  - one hat from the body's hat list;
  - hideable garments;
  - uniform scale 0.97 to 1.03;
  - the skin factor jitter `?test=skin` already allows (Kendal: 0.9 to 1.15);
  - different clips and clip offsets.
- **Phase 2, face morphs:** each crowd body also carries up to 6 face variants as glTF morph targets on the Body mesh.
  - Only face axes are used (nose, lips, mouth, cheeks, chin, jaw, a little ear). Eyes, the brow line and the skull are left out, because the eyes mesh, the hairline and hats are fitted at build time.
  - The builder records each Body vertex's original MPFB index in an int attribute, so the deltas can be computed against a second human built with each variant's targets.
  - Rough cost: 600 to 900 head vertices x 12 bytes x 6 faces, before `sparse()` and meshopt, so about 20 to 40 KB a body, against 180 KB for each extra light copy.
  - gltf-transform 4.5.1's `simplify` compacts morph targets with the vertices, but `pack.mjs`'s `only()` restores indices and attributes and not targets. It must save and restore targets too.
  - three.js copies `morphTargetInfluences` per clone, so `makeBody` sets one face, or a 50/50 blend of two.

**(c) Sameness checks.**
1. **At build time** (`same.mjs`, run by `make.mjs`, using only metadata):
   - **Face print:** the positions of about 96 fixed MPFB base-mesh vertices (`face_points.json`, spread over nose, lips, eye rims, cheeks, chin, jaw and ears). They are taken after targets and before clothes, relative to the Head joint and divided by the head scale `s`, so a child and an adult compare by shape.
   - **Difference:** RMS distance in mm after removing the mean offset. Pairs below `same_face_mm` are flagged.
   - **Threshold:** set by calibrating on today's bodies with the owner looking at the faces sheet. `maroon_boy`/`boy` and `hl_woman`/`woman1914` must fail; `garvey1914` against a default man must pass.
   - Pairs with the same `likeness.person` are exempt, but must stay under the threshold, or the check reports "likeness drift".
   - Bodies without a print yet (stamped, not rebuilt) are compared by macros and target dictionaries.
   - Within a game a flag is an error; across games it is a warning that names where else the face appears.
2. **At runtime** (`auditTwins` in `engine/audit.js`, wired into `?test=audit` as kind `twin`): two people within 8 m in one place with the same body, the same face variant, the same hat and colours within a small distance on every visible material. Also `sameface`: two people the player talks to in one chapter who share a body and face. `makeBody` stores `m.userData.look = {body, face, hat, tint}` for it.

**(d) In the proof sheet.** The faces page is a grid of head tiles, front and three-quarter, for every body and face variant in the game, grouped by role. It is lit with the game's skin factor. Each tile shows name, year, seed or likeness, and the nearest other face with its distance. Flagged pairs get a red frame and are listed under the grid.

## 6. Metadata baked into each glb and the runtime helper

The builder hook writes `scene['bodyJson']` as a JSON string (safe through Blender's ID properties and the glTF exporter's `export_extras`) before the .blend save, so kits see it too. `pack.mjs` turns it into a real object `extras.body` and adds `lo` and `tris`. GLTFLoader puts scene extras in `gltf.scene.userData`; `engine/colours.js` already reads `vertexColorSpace` there.

```json
"body": {
  "v": 1, "name": "man_shirt", "who": "...", "period": "1950s", "year": 1957, "cut_era": 1950,
  "recipe": "tools/kendal/people/man_shirt.json", "built": {"recipe_sha": "...", "builder_sha": "..."},
  "upscale": 1.0, "scale": 1.0,
  "hats": [{"mat": "Hat", "kind": "trilby", "meshes": ["Hat","HatBand"], "covers": []},
           {"mat": "Cap", "kind": "peaked", "meshes": ["Cap","CapBand"], "covers": []}],
  "pieces": {
    "Shirt": {"mat": "Shirt", "garment": "dress_shirt", "kind": "shirt", "layer": 1},
    "Collar": {"mat": "Collar", "on": "Shirt"}, "Placket": {"mat": "Shirt", "on": "Shirt"}, "Buttons": {"mat": "Buttons", "on": "Shirt"},
    "Tie": {"mat": "Tie", "on": "Shirt", "hideable": true},
    "Waistcoat": {"mat": "Waistcoat", "layer": 3, "hideable": true, "covers": ["Belt","Buckle"]},
    "WButtons": {"mat": "WaistcoatButtons", "on": "Waistcoat"},
    "Breeches": {"mat": "Breeches", "layer": 2}, "Belt": {"mat": "Belt", "on": "Breeches"}
  },
  "materials": {"Shirt": {"color": [240,236,226], "palette": [[240,236,226],[244,240,230]]}, "Skin": {"color": [150,102,74]}},
  "face": {"seed": null, "likeness": null, "targets": {}, "print": "<base64 int16, 96 x 3>", "morphs": []},
  "lo": false, "tris": 25554
}
```

`stamp.mjs` writes the same object, without `face.print`, into already-packed files from their resolved recipes. Hat meshes follow era.py's naming (`HM`, `HM+'Band'`, `HM+'Wrap'`, `HM+'Knot'`, `Cap`), so games can switch before every body is rebuilt.

**`engine/body.js`** (about 40 lines; a shared engine PR):

```js
/* engine/body.js: what a packed body says about itself (tools/people/build.py and pack.mjs write it). */
export function bodyInfo(gltf) { const u = gltf.scene.userData; const b = u.body || (u.bodyJson ? JSON.parse(u.bodyJson) : null); if (b && b.face) delete b.face.print; return b; }   /* the print is for the build check only: keep clones light */
export const drawScale = (info) => (info && info.scale) || 1;            /* a child: 1 / upscale, or the recipe's draw_scale */
export const hatsOf = (info) => (info ? info.hats.map((h) => h.mat) : []);
/* which meshes to hide for one person: hats not worn, garments the look hides (by material name, as games do now) and all that lies on them, and what visible pieces cover */
export function hiddenMeshes(info, { hat = null, hide = [] } = {}) {
  const P = info.pieces, out = new Set();
  for (const h of info.hats) if (h.mat !== hat) h.meshes.forEach((n) => out.add(n));
  for (const k in P) if (hide.includes(P[k].mat) || hide.includes(k)) { if (!P[k].hideable && !P[k].on && !/^(Hair|Bun)$/.test(k)) console.warn('body: ' + k + ' cannot be hidden: the layer under it was removed'); out.add(k); }
  for (let grew = true; grew;) { grew = false; for (const k in P) if (!out.has(k) && P[k].on && out.has(P[k].on)) { out.add(k); grew = true; } }
  for (const k in P) if (!out.has(k) && P[k].covers) P[k].covers.forEach((c) => out.add(c));
  const worn = info.hats.find((h) => h.mat === hat); if (worn) worn.covers.forEach((c) => out.add(c));
  return out;
}
/* every combination ?test=cloth should pose: each hat, the bare head, and each hideable garment hidden */
export function clothVariants(info) { const v = [...hatsOf(info), false].map((hat, i) => ({ hat, hide: [], full: i === 0 }));
  for (const k in info.pieces) if (info.pieces[k].hideable) v.push({ hat: false, hide: [info.pieces[k].mat] }); return v; }
```

In each game's `makeBody`:
- the `HATS` and `KID` tables go;
- the belt-under-waistcoat regex goes;
- the `Wrap`/`Bun` special case goes;
- `?test=cloth`'s hand-written variant list becomes `clothVariants(info)`.

LOOKS keep the right to set their own `scale` (Kendal's Lloyd is 0.84).

## 7. Add-on kits (the documented hook)

A kit is `tools/<game>/kit.py`. The recipe names it with `"kit": {"script": "tools/tivoli/kit.py", ...params}`; today's `kit` block is the params.

The contract, written in `tools/people/README.md`:
- **Input:** `build/people/<name>.blend` (saved by the builder after the hook, carrying `scene['bodyJson']`) and the resolved recipe JSON as the last argument.
- **Output:** the same `build/people/<name>.glb`, exported with the builder's settings and `vertexColorSpace: linear`.
- **Rules:**
  - bone weights come from the nearest cloth, limited to named bones (`kitlib.new_obj(..., only=TORSO)`);
  - `Col` is painted by vertex, never by face;
  - fully covered under-layers are deleted with `kitlib.hide_under`;
  - each new piece is recorded with `kitlib.meta(piece, mat, on=..., hideable=..., covers=...)` (Tivoli: `ArmBandText` hideable on `ArmBand`; `Helmet` covers `Hair`);
  - a `KIT` line with triangles is printed.
- `make.mjs` runs kits after the build and before packing.
- Later, kits can run in the same Blender process through `BODY_HOOK`, which saves one Blender start per body.

## 8. The per-game manifest and the one command

`games/<game>/people.json`:

```json
{
  "game": "kendal", "models": "games/kendal/site/models", "skin_factor": 1.55,
  "budget": {"full_tris": 32000, "full_kb": 480, "lo_tris": 6500},
  "bodies": {
    "man_shirt": {"recipe": "tools/kendal/people/man_shirt.json", "lo": true, "roles": ["1957 men in Sunday shirts"]},
    "boy":       {"recipe": "tools/kendal/people/boy.json", "lo": true},
    "guide2020": {"recipe": "tools/garvey/people/guide2020.json", "lo": true, "standin": "Garvey's chapter 8 guide; Kendal needs its own"}
  },
  "proof": {"env": "day", "views": ["side","front","back","three_quarter"], "poses": [["Idle",0.3],["Walk",0.25],["SitIdle",0.3]]},
  "checks": {"same_face_mm": null, "twins_near_m": 8}
}
```

The command is `node tools/people/make.mjs <game> [--only a,b] [--force] [--no-build] [--no-proof] [--jobs N] [--prune] [--freeze name] [--baseline] [--all]`. It does this, in order:

1. **Validate:** schema, unique body names across every manifest, recipe and wardrobe ids, sources present, skin inside rule 9 (unless light-skinned and explicit). It also lists `standin` entries as debt.
2. **Resolve** each recipe with `python3 tools/people/resolve.py` (system Python, no bpy).
3. **Build** the bodies that are out of date: the cache key is the sha of the resolved recipe plus a hash of `tools/people/builder/**` and the kit file. It runs `~/venv/bin/python3 tools/people/build.py`, then the kit.
4. **Pack** full and light copies into `build/packed/` with `pack.mjs`, then copy them to every game whose manifest lists the body. The body is built once; the copies cannot drift.
5. **Report** any body file in the models folder that has a skinned mesh and is not in the manifest. `--prune` deletes it; non-body files are never touched.
6. **Check:**
   - budgets per body;
   - the cloth check, run on the proof page with `engine/audit.js` `auditCloth` over `clothVariants` (the same code the game's `?test=cloth` runs, so the numbers match);
   - the sameness check.
7. **Proof sheet:**
   - bundle `tools/people/proof/proof.js` with esbuild;
   - copy the game's models and trimmed `anims.js` into `build/proof/<game>/`;
   - serve the repo root from a small Node static server;
   - screenshot with headless Chrome (`--use-gl=swiftshader`, as `docs/TESTING.md` does): `build/proof/<game>-bodies.png`, `-faces.png`, `-cloth.png`.
   - **Bodies page:** one row per body, full then light copy. Columns are side standing, side mid-stride, side seated, front, back, three-quarter, and a small head tile per hat. The label gives name, period and year, garments, triangles and KB, cloth faults, with a red frame on any failure. A strip at the bottom shows each garment's sources and whether they are checked; "general picture" shows in red.
   - **Cloth page:** the same views with `auditCloth`'s `marks` drawn as red dots.
8. **Summary:** one line per body. It exits non-zero if any check is above 0.

**Why Node:**
- Every other build, pack and check step is already Node: `tools/build.mjs`, `pack.mjs`, gltf-transform, esbuild, and the cloth audit, which is JavaScript that runs in Chrome.
- Only the Blender step needs Python, and Node calls it as a child process.
- A Python driver would have to call Node for everything else.

## 9. The "same output" check

There are three levels:
1. **Recipe level** (no Blender): `python3 tools/people/resolve.py --same old.json new.json` compares the normalised flat recipes. Normalising applies era.py's own defaults:
   - a missing `era` is 1915, and eras compare by tailoring class;
   - a string `hat` becomes a list;
   - `collar: true` becomes its kind by era and `softcollar`;
   - `trousers` implies `breeches` + `breechkind`;
   - constant defaults (`breechkind "plain"`, `sleeve 0.86`, `flare 1.0`, `pleats 9`, `belt true`, `coatsleeves true`, `coatopen true`, `brim 1.0`, `jacketsleeve 0.9`, `coatsleeve 0.82`, `legwidth 1.0`, `hang 1.0`, `vslope 2.1`) are dropped;
   - defaults that depend on other keys (`vdepth`, `jackethem`, `lowshoes`, `buttons`, `leaf`, `coatbuttons`) are computed with the same expressions.

   Equal resolved recipes plus a repeatable builder give the same body.
2. **Geometry** (`node tools/people/compare.mjs a b`, glb or packed `.js`): per mesh it compares name, materials, vertex and triangle counts, bounding box to 0.1 mm, and hashes of positions (rounded to 0.05 mm), colours and skin weights. Extras are reported separately and do not fail the check.
3. **Image:** the proof page's `?compare=a,b` renders both bodies in four views at 512 px in the same light, reads the pixels and prints the share that differ by more than 2/255. It should be 0 (allow 0.1% for noise).

In step 0, `make.mjs --baseline` builds every recipe with the current builder and commits fingerprints to `tools/people/baseline.json`, so any agent can compare without the old files.

## 10. Migration order (PR-sized steps, all 8 games working after each)

| # | Step | What it touches | Checks after |
|---|---|---|---|
| 0 | After the collar and chest work merges: fix `WaistcoatButtons` hiding in Kendal's `makeBody` and refresh the drifted copies. Build every recipe and record the baseline. Time one build. | games' `makeBody` (one line each); `tools/people/baseline.json` | each game's `?test=cloth`, `?test=audit`; screenshots of looks with `hide: ['Waistcoat']` |
| 1 | Wardrobe files for today's periods, `resolve.py` (v1 recipes pass straight through), wardrobe README. New files only. | `tools/people/` | `resolve.py --check-all` (every recipe resolves; normalised equals itself) |
| 2 | `build.py` front door plus the two guarded era.py lines (wardrobe recipes and `BODY_HOOK`). Shared-file PR. | era.py (4 lines), `tools/people/build.py` | build `galdy`, `man_shirt`, `woman57`, `boy`, `soldier2010` both ways: `compare.mjs` SAME, `FOLDS` the same |
| 3 | Metadata: hook to `bodyJson`; `pack.mjs` to `body`; `stamp.mjs` stamps every shipped body in 8 games. Shared-file PR. | `pack.mjs`, `tools/people/builder/meta.py`, models in all games (extras only) | `compare.mjs`: geometry SAME in all 8 games; each game builds; cloth numbers unchanged |
| 4 | `engine/body.js` (shared engine PR) | `engine/` | none (nothing uses it yet) |
| 5 | Kendal switches to the metadata (HATS, KID, covers, cloth variants) | `games/kendal/src` | Kendal audit, held, layout at 4 sizes, cloth, walkers, skin, resume |
| 6 | The same switch, one PR each: Eventide, Melissa, Nanny, Tivoli, Bog Walk. Stop multiplying Hair in each (STANDARD.md table). | each `games/<game>/src` | that game's wired checks at 0; screenshots |
| 7 | `make.mjs`, proof page, compare page, `same.mjs` (report only), and a `games/*/people.json` for all 8 describing today, stand-ins marked | new files | `make.mjs <game> --no-build` for all 8: proof PNGs written, cloth numbers equal each game's `?test=cloth` |
| 8 | Split era.py into `tools/people/builder/` mechanically: files run in order in one namespace, no edits; era.py becomes the shim. Agree a freeze with anyone editing era.py first. | builder | full rebuild of every recipe: SAME against the baseline; `FOLDS` equal; every game's cloth unchanged |
| 8a to 8k | Turn kinds into functions on the layer table, one or two per PR: footwear, hats, hair, neckwear, collar, apron, skirt, belt, legwear, waistcoat, coat and jacket, shirt last | builder | full rebuild SAME each time (`--jobs`, cache) |
| 9 | Fold in Eventide's pieces (cardigan, glasses, head tie style, sock fraction, shorts via trousers) as new guarded keys. Rebuild Eventide's bodies from 1980s recipes. `people.py` becomes the shim. | builder, `tools/eventide` | full rebuild SAME for all other recipes; Eventide cloth, skin, audit 0; owner reviews the new look |
| 10 to 15 | Convert recipes to the wardrobe form, one PR per game: Kendal, Port Royal, Nanny, Tivoli (kit through the hook), Garvey (keep `smooth`; `collar: true` to `"stand"`; add `year`), Melissa | `tools/<game>/people` | `resolve.py --same` 0 differences for every recipe; two spot rebuilds SAME |
| 16 | Faces: face block, `vary`, face prints, sameness check and `auditTwins` (report only). Calibrate `same_face_mm` with the owner on the faces sheets. Then make them errors. | builder, `engine/audit.js` (shared PR), `make.mjs` | faces sheets for all 8; thresholds recorded in each manifest |
| 17 | 1690s women's garments (shift sleeve, bodice as a layer 3 kind with a square neck, petticoat, apron lying on a skirt), guarded | builder | full rebuild SAME |
| 18 onward | Each game gets its own bodies and loses its stand-ins (section 11), one game per PR | `tools/<game>/people`, manifest, `cast.js` | that game's checks at 0, including sameness and twins; `make.mjs --prune` |
| last | Docs: STANDARD.md, PEOPLE.md, PIPELINE.md (the key table comes from `resolve.py --keys`); the shared-files table names `tools/people/builder/`, `make.mjs`, the wardrobes and `engine/body.js`. Port Royal's recipes move to `tools/port-royal/people/`; `tools/people/kids/` is deleted (old copies, unused). | docs | none |
| phase 2 | Crowd face morphs: builder, `pack.mjs` (`only()` saves targets; `sparse`), `engine/body.js` `setFace` | shared | light copies `?test=cloth&lo` 0; phone frame rate with `&stats` |

## 11. Each game: what it needs to reach the standard with no stand-ins

Checks marked "wire" are missing today, per the STANDARD.md table.

- **Port Royal:**
  - Convert 14 men (`benning`, `buc1`, `buc2`, `constable`, `galdy`, `gunner`, `heath`, `kofi`, `mendes`, `morgan`, `ned`, `sailor`, `soldier`, `turtler`) with the 1690s wardrobe.
  - New `abba.json` and `grace.json` (needs step 17; built with the later cut, as Nanny's women are). Grace stops being Abba scaled by 1.08/0.95/1.08.
  - `main.js`: Abba moves from her own mixer and embedded clip to `animate()` (the shared Idle is her clip); Grace's basket uses `hold`/`grip`.
  - Retire `tools/blender/abba.py`, `abba_fix.mjs` and `abba_animated.glb`.
  - Seeds for the 11 Black and mixed-heritage men.
  - Checks: cloth (34 lines, 390 points) to 0; held; skin (Abba and Grace now in range); wire audit, layout, walkers.
- **Marcus Garvey:**
  - Convert 21 (periods 1900s, 1910s, 1920s, 2020s).
  - Likeness blocks for `garvey1914` and `garvey1916`; shape Amy Ashwood and Amy Jacques Garvey from public-domain photographs and record the sources.
  - Seeds for the rest: `hl_woman` and `woman1914` are identical; `nb_youth` and `printer1907` are identical.
  - Checks: cloth (7 issues) to 0; wire audit, held, layout, walkers, resume.
- **Kendal 1957:**
  - Convert 11.
  - Split the people who cross periods: new 1840s bodies (worker, gentleman with top hat, woman, boy) and 1890s bodies (fireman, stationmaster, Ezra as a boy).
  - Its own "today" guide and student (stop using Garvey's).
  - 3 or 4 face variants per 1957 crowd role.
  - Prune the 20 unused Garvey files.
  - Checks: cloth (9 lines) to 0; all others stay at 0; sameness and twins 0.
- **Bog Walk 1904:**
  - No recipes today; new ones in `tools/bog-walk/people/` (1900s wardrobe).
  - The gang: 3 or 4 faces (`rudy`, `labourer`, `henry` with a hideable apron, `zeke` as an elder).
  - Ivy and an 1899 Kingston woman.
  - Hammond and Osborne in suits.
  - The minister, Haggart and the reporter as clerks.
  - A tram conductor in uniform (sources needed).
  - Crowd women (3) and men (4).
  - Today's Grant and Kemar.
  - Prune all 12 Garvey stand-ins.
  - Checks: wire cloth, walkers, skin; keep audit, held, layout, resume at 0.
- **Nanny Town 1734:**
  - Convert 11 (women's garments keep cut_era 1900).
  - Its own `nanny` body (seen far off, no likeness).
  - More village faces (men 3, women 3, children).
  - Owner decisions on the `missing` list (cocked hat, bare chest).
  - Stop multiplying Hair.
  - Checks: cloth and skin to 0; audit, held, layout, walkers, resume at 0.
- **Eventide 1980:**
  - After step 9, rebuild `iris1980` and `girl1980`; drop `boy1980` if it stays unused.
  - New 1980s recipes: elder women in head ties, each with their own face (Gran, Hyacinth, Maude, Dora, the mourning nurse; today all `woman_elder`); the nurse; the gateman; a 1980 fireman and policeman ("in khaki" is already sourced to the Gleaner); a neighbour; the nephew and the official in 1980 suits; children (Kayla, kidA, kidB).
  - The 2026 Fire Brigade guard of honour (2020s wardrobe).
  - Prune Kendal's 8 bodies.
  - Stop multiplying Hair.
  - Checks: wire cloth, walkers, skin; keep audit, held, layout, resume at 0.
- **Hurricane Melissa:**
  - Convert and build the 6 recipes (1988 and 2025).
  - New 1951 bodies (Papa, Mama, Cyril, Ivy) from the 1950s wardrobe with Melissa's own faces.
  - Children for 1988 (Delroy) and 2025 (Keisha, Marlon).
  - 2025 health aide and teacher, youth and student, pastor.
  - Uniforms: Jamaica Defence Force soldier, line crew, sawman (sources needed).
  - Prune the Kendal and Garvey stand-ins.
  - Stop multiplying Hair.
  - Checks: wire cloth, walkers, skin.
- **Tivoli:**
  - Convert `soldier2010`, `police2010`, `civilian2010`; their kit goes through the hook.
  - A 1960s wardrobe (extends 1950s) for Ivy as a girl, Pearl and Mass Roy.
  - Ivy in 2010.
  - Civilians, children and elders with several faces.
  - Replace the template's talking `sailor`.
  - Stop multiplying Hair; move `checks.js` to the engine.
  - Checks: cloth (19 issues) to 0; walkers; skin; audit and layout once places exist.

## 12. The new STANDARD.md section, "Adding clothing for a new period"

1. **Research.** Find period photographs or written sources for the year and place. Add each one to the wardrobe file's `sources`. Mark it `checked` only after you have read it. Fictional people still wear real clothes of their time (rule 3).
2. **Add to the wardrobe.** Use `tools/people/wardrobe/<period>.json`, and start from the nearest period with `extends`. Give each garment a name, a kind, its cut, lengths, collar, hem, colours and its sources. If the builder cannot make it, put it under `missing`. Then add it to a garment kind in `tools/people/builder/kinds/` in its own pull request, behind a new key; `make.mjs --all` must print SAME for every existing body.
3. **Use it.** In a recipe, list garments by name in `wear` and give only what is different. Give each person a `seed`.
4. **Build.** Run `node tools/people/make.mjs <game>`.
5. **Check the proof sheet** in `build/proof/<game>-*.png`: side, front, back, stride, seated, every hat, light copies, faces side by side, and the sources strip. Cloth and sameness must print 0. Then run the game's own checks (rule 8).

## 13. Risks and what to verify

- **era.py is changing now.** Take the baseline only after the collar and chest work merges. Agree a freeze before the mechanical split (step 8).
- **Hidden semantics.** `smooth` is read; a missing `era` means 1915; `collar: true` depends on era. `resolve.py --same` must model these, and spot rebuilds confirm it.
- **Determinism.** PIPELINE.md says the same recipe gives the same file. Confirm in step 0 by building one body twice. If bytes differ, `compare.mjs` relies on its rounding tolerances.
- **Blender ID properties.** Nested lists and dicts may not export as extras; that is why metadata travels as a JSON string and `pack.mjs` turns it into an object.
- **Eventide's fork cannot be reproduced.** Its 3 bodies will change look on purpose. Review them on the proof sheet.
- **Port Royal's earthquake sequence** depends on Abba's mixer and clips (`idle`, `runA`, `abbaIdle`). Test with the autoplayer after the switch.
- **Faces and clothes interact:**
  - neck targets move collars;
  - head targets move hats (hats are fitted per body, so this is fine);
  - ear axes can cut a brim.

  Keep those spreads small. Look on the proof sheet, and add an ears-through-hat pair to `auditCloth` if it shows.
- **Faces must look natural and respectful.** Variation is symmetric around MakeHuman's averages, there is a strength cap, children have half the spread, skin stays inside rule 9, and the owner reviews the faces sheet before thresholds become errors. A South Asian mix needs the owner's review.
- **Morphs (phase 2):**
  - `pack.mjs` `only()` does not restore morph targets;
  - three.js morphs on skinned meshes cost GPU time on phones; measure with `&stats` on the phone layout;
  - keep eyes and skull out of the morphs.
- **Download size per game grows** with more bodies. Keep per-chapter loading (`loadBase` on demand), the budgets in the manifest, light copies for anyone far off, and phase 2 morphs for crowds.
- **Names, brims and copies of the metadata:**
  - body names must be unique across the repo (`build/people` is shared); `make.mjs` checks this;
  - all hats on a body share one brim;
  - three.js deep-copies `userData` on every clone, so the helper drops the face print at load.
- **Build time.** About 70 recipes now, growing past 150, rebuilt in each refactor PR. Measure in step 0; use `--jobs` and the recipe-hash cache.
- **Sources.** Most periods have none checked yet. Keep "general picture" visible on the proof sheet and in each game's doc until they are checked.

### Critical Files for Implementation
- /home/user/portroyal/tools/garvey/era.py
- /home/user/portroyal/tools/people/pack.mjs
- /home/user/portroyal/tools/tivoli/kit.py
- /home/user/portroyal/games/kendal/src/main.js (makeBody, `?test=cloth`) and /home/user/portroyal/games/kendal/src/cast.js (HATS, KID, LOOKS, crowds)
- /home/user/portroyal/engine/audit.js (`auditCloth`; where `auditTwins` goes)
- /home/user/portroyal/tools/eventide/people.py (pieces to fold in)
- /home/user/portroyal/docs/STANDARD.md and /home/user/portroyal/docs/PIPELINE.md (section 5 key table)
