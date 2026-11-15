# Character system standardization plan (from the read-only survey)

Start only after the clothing worker finishes (it edits era.py, pack.mjs, audit.js, models).

## Findings
- Build: one builder (tools/garvey/era.py) and packer (tools/people/pack.mjs). Recipes in 4 places: tools/people (PR, era 1690), tools/people/kids (stale duplicates of Kendal boy/girl, delete), tools/kendal/people, tools/garvey/people (20 files lack era, silent 1915 default). guide2020/student2020 shipped in Kendal and Garvey from different builds.
- hat is a string (PR, Garvey) or [kind, mat] list (Kendal). collar: true means stand before 1925, turn after.
- NPC_OUT defaults to games/port-royal/site/models; pack --out defaults to games/kendal/site/models (this is how Garvey copies landed in Kendal).
- No per-game people build script or manifest.
- Runtime: Kendal has makeBody (BASES cache, skClone, tint by material, SKIN_LIGHT 1.55, HATS, KID, hide rules, carry/grip, spreadArms regex). Garvey: no cache (refetches reused bodies), no tint, shop people path duplicated (no scale, no h), groundFeet on seated, npcTick resets y. Port Royal: whole-body setRGB tints, 5 copies of the userData clone workaround, no grip.js, custom held items.
- Speech marks: 3 different implementations. faceTo, npcTick, per-frame tick duplicated.
- Dev checks: Garvey lacks audit, held, layout (breaks rule 8). Port Royal lacks audit, layout. Template wires none. CL_ORDER lacks 1690 pieces (hence CLOTH_SKIP).
- Docs stale: PIPELINE (KeyError claim, optimize_models, kids folder, no --lo/--lomax/--cloth, missing keys softcollar/jackethem/scarf/fbx, no Skin section though skinprobe.js points to it), ENGINE (no skinprobe, grip claim about Garvey), NEW_GAME (npc.py), TESTING (no ?test=skin), tools/garvey/README, docs/games/garvey.md, kendal.md light copy numbers.

## Plan
1. engine/people.js: loadBody(id,{lo}) cache + safe skClone + culling; makePerson(spec,cfg) with one colour default table (Collar=Shirt, Pocket=Shirt*one factor, band colours), skin = cfg.skinLight*spec.skin, hair untouched, optional wash mode; placement (ground, seat with SIT_HIPS, one seated flag, walkSpeed(scale), pace); headTop + shared marks/badge; tickPeople(list,dt).
2. era.py writes glTF extras: era, upscale, hats [kind,mat], hide map, woman/skirt/jacket flags. Runtime reads kid scale (1/upscale), hats, spreadArms amount from the body. Removes HATS, KID, regexes.
3. engine/grip.js gains carry() plus Kendal's hold()/attach().
4. engine/peopletests.js: cloth, held, walkers, skin tests and people viewer, same ?test= names everywhere; template wires them; Garvey and PR get audit/held/layout. Add 1690 pieces to CL_ORDER.
5. Recipe schema: era required, hat always a list, collar always explicit, hide map, all keys documented, one tree tools/people/<game>/ plus shared/, per-game manifest (bodies, --lo, budgets, out), one build script era.py+pack, --out required. Delete tools/people/kids.
6. Games still configure: lights and skinLight, palettes and crowd generators, prop grip tuning, which bodies use _lo, cloth poses/skip, mark offsets, Abba special case.
7. Docs: new docs/PEOPLE.md (or PIPELINE section) covering recipe schema, build, runtime API, skin target, budgets, checks; update ENGINE, NEW_GAME, TESTING, CONTENT, game docs, template.
8. Proof: all three games look and play the same or better (screenshots before/after, all checks 0, autoplayer, public builds).
