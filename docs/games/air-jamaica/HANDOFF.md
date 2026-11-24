# Air Jamaica: handoff for the next session (24 November 2026)

Read first: `CLAUDE.md` (owner rules), `docs/games/air-jamaica.md` (all research, sources, what is general), this file.

## Where things are
- Game: `games/_air-jamaica/` (underscore = not live, skipped by `tools/dist.mjs` and tests). Rename to `games/air-jamaica/` only when finished and checked.
- Chapter 1 "A flag in the sky" (apron + waving gallery, 1 April 1969) and chapter 2 "The view from the front" (DC-8 flight deck, landing) play end to end.
- Code: `src/planes.js` (jet kit: DC-8, DC-9, livery painted as a texture, open door with reveal), `src/airport.js` (Palisadoes terminal from NLJ photos, waving gallery, runway 12/30 laid flat, taxiway), `src/places.js` (apron, gallery, cockpit), `src/cockpit.js` (flight deck rebuilt from the 1969 Finnair DC-8 photo), `src/props.js` (boarding steps), `src/content.js` / `src/steps.js` (words, steps, films, quiz), `src/cast.js`.
- People: recipes in `tools/air-jamaica/people/`, built by `tools/air-jamaica/build-people.mjs` (shared builder `tools/garvey/era.py`). Builder options added this session: `hair:"straight"` (+`hairlen`), colours `Lipstick`, `Eyeshadow`, `Gloves`; armpit fix; short skirts follow each thigh (see `docs/PIPELINE.md`).

## Setting up the builder in a fresh container
1. `python3 -m venv /tmp/venv && /tmp/venv/bin/pip install bpy==5.3.0 numpy`
2. MPFB: download `add-on-mpfb-v2.0.18.zip` from extensions.blender.org (index at `/api/v1/extensions/?format=json`), then in bpy: `bpy.ops.extensions.package_install_files(filepath=..., repo="user_default", enable_on_install=True)`.
3. Eyes only from `files2.makehumancommunity.org/asset_packs/makehuman_system_assets/makehuman_system_assets_cc0.zip` (281 MB; ranged requests for `eyes/low-poly/*` and `eyes/materials/brown*`) into `/tmp/mh/makehuman/data/eyes/`.
4. Build: `BPY_PYTHON=/tmp/venv/bin/python3 MAKEHUMAN=/tmp/mh/makehuman node tools/air-jamaica/build-people.mjs [names]`

## Checks (all must pass before done)
- `python3 -m http.server 8765` at repo root, `node tools/build.mjs _air-jamaica --dev`
- Audit: open `games/_air-jamaica/site/?test=audit` (title `AUDIT n`); last result 0 issues in apron, gallery, cockpit.
- Autoplayer: `?auto=1&one` and `?auto=2&one` reach `AUTO END 30` / `AUTO END 34`.
- People: `node tools/review/full-check.mjs _air-jamaica <ids> anims=Idle:0.4,Walk:0.3,Wave:0.5` and LOOK at every sheet (rule 15).
- Screenshots: `node tools/review/look-shot.mjs _air-jamaica out.png "shot=10"`; phone size `414x706`.
- Wikimedia: only standard thumbnail sizes work, e.g. `upload.wikimedia.org/wikipedia/commons/thumb/a/ab/<file>/1280px-<file>`.

## New primary source (owner, 24 November 2026): `docs/games/air-jamaica/ref-1969-ad-dc9-crew.jpg`
A 1969 Air Jamaica advertisement, "They put a little bit of Jamaica in a whole lot of plane." (source and rights unknown; reference only, never shipped). Its text says: operations started **April 1, 1969**; "the Jamaican government and Air Canada are running things"; "brand-new... sleek DC-9's"; **"Front-end crews? Air Canada is taking care of that. They're putting men in the left-hand seat"** (Air Canada captains at first); **"60 of the most beautiful girls in all of Jamaica... our Rare Tropical Birds"** (the Gleaner says 58: say "about sixty"); Jamaican music, fashion shows; seafood, beef and poultry "prepared by chefs who understand the subtle use of island spices", fine wines from Europe; First Class has "the only standup bar flying between New York and Jamaica". The picture: the long crew line stands beside a **DC-9** (not a DC-8) with boarding steps at the forward door, men in dark suits at the front, each stewardess with a **white flight bag** at her feet and a **printed scarf over the arm**, dresses in yellow, red and green with **longer sleeves and collars** than our short-sleeved minis. To do: put a white flight bag at each crew member's feet, give some a collar and long sleeves, consider swapping the apron plane to the DC-9, and change Captain Ross's line "Some pilots here are Jamaican" to match (Air Canada captains in the left seat at first). Novelties for the cabin chapters: the standup bar, the chefs, the fashion show.

## Open work, in order
1. Cockpit (`cockpit.js`) was just rebuilt from the Finnair photo and NOT yet looked at or audited: render `shot=30` and `shot=film&key=landing&at=20`, fix what is wrong, run the audit.
2. Pilots' uniform from the owner's early-days photo (doc, "Early pilot uniforms"): double-breasted navy jacket, gold rings, white cap top with roundel badge. Maria Ziadie (real, 1979) could appear in chapter 2 as the engineer/second officer only with her journal page saying her words are imagined.
3. Flying chef scene (chapter 3, Stewart years; menu: ackee and saltfish, calaloo and saltfish, run dung, festival, jerk chicken; JIS 2004; no start year).
4. Later chapters: 1994 blue-tail look (A320/A321), later uniforms (purple suit, floral print), Gilbert 1988, the sale (simple overview for kids), the last flight 30 April 2010 (JM 036 FLL to Kingston, A320), 2011 swoosh look. The waving gallery appears in chapter 1 only.
5. Known open faults: seated, women's blouse shows through the seated skirt (~1.5 cm; crew never sit); suited men's trousers through the jacket seated (~2 cm, shared with Windrush); printed scarf not made.
6. Before going live: menu card (`docs/NEW_GAME.md`), rename folder, `npm test`, PR to main when the owner asks.
