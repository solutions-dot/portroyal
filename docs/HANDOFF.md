# Handoff: where the work stands (15 November 2026)

Read this first if you are picking up the big people, animation and gameplay standardisation work. Then read `CLAUDE.md`, `docs/STANDARD.md` and the plans in `docs/plans/`.

## How the work is organised

- Everything is on branch `claude/affectionate-pasteur-xvhvlq`. It is **unchecked work in progress**: commits named "Work in progress ... (unchecked, do not merge)" are checkpoints, not reviewed work. Do not open or merge a PR from this branch until the to-do list below is reviewed; one combined PR goes to the owner at the end.
- Vercel previews are switched off for this branch (`vercel.json`, `git.deploymentEnabled`). Remove that entry when the combined PR is ready for one preview.
- The owner runs other game chats. They must push only to their own branches; the coordinating chat sweeps their branches into one combined PR ("sweep the branches"). Tivoli lives in `games/tivoli` (not `_tivoli`).
- Commit as `Johnathon Kelly <msquared.mail@gmail.com>` (CLAUDE.md rule 7) with the session's attribution trailer.
- Warning: PRs #72, #74 and #75 merged unchecked checkpoints from this branch into main, so main has half-finished character rebuilds. The combined PR fixes that.

## Shared engine pieces built in this work (all documented in `docs/ENGINE.md`)

- `engine/story.js`: steps as data, only story people marked, automatic counts, hint arrow after 2.5 s pointing only at needs, carry and place, `?test=flow`. No game uses it yet except as being wired in the Kendal pass.
- `engine/ambient.js`: background people wander, chat, work, sit, watch, run errands, children play; no sync, head turns, personal space, story paths kept clear, mood, phone budget, `?test=ambient`.
- `engine/follow.js`: followers and guides for every game, `?test=follow`. Wired in Nanny, Kendal, Melissa, Eventide, Garvey.
- `engine/vehicles.js`: shared trains and vehicles (Kendal and Bog Walk use it).
- `engine/checks.js`: one `?test=all` runner (journal, links, accessibility, reach and resume at every step, map, camera, faces, budget, rule 4, sound, continuity, errors); `tools/lint_content.mjs` runs in `npm test` with a baseline; `tools/checks_browser.mjs`; `.github/workflows/checks.yml`.
- `engine/audit.js`: new checks for people against real merged and instanced shapes along routes, object overlaps, things resting or floating, vehicles near people, hidden-garment pieces, hanging leaves.
- `engine/skinprobe.js`, `engine/colours.js` (skin and colour pipeline, owner rule 9).

## Character and animation tooling

- Builder `tools/garvey/era.py`: collar rings and weights fixed, flatter men's fronts, slimmer jackets, straight waistcoat V with `WaistcoatButtons` (games hide them with the waistcoat), 1690 shirt ease and lining colour bug fixed, seated skirt. Round 2 was in progress (see to-do 1).
- Animation library `shared/models/anims.js`: 126 clips, rebuilt with the frame range fix; Tivoli `anims_tivoli.js` 22 clips. Each game ships only the clips in its `games/<game>/anim-clips.json` (Port Royal now has one). Tools: `tools/anims/retarget_clips.py`, `clean_clips.mjs`, `check_clips.mjs`, `merge_clips.mjs` (quick update of a few clips), `handmade.py` (hand-made clips), `pair_check.py` (two-person collision check), `comfort_fit.py`. The clip table with sources and licences is in `docs/PIPELINE.md` section 2.
- `engine/anim.js` still needs low-body clips (Kneel, Crawl, Scared, Hurt*) in `HIPS_Y` and the new walks in `WALKS` (the Kendal pass was doing this).

## To-do list (in order)

1. **Builder round 2** (`tools/garvey/era.py`). Done on 15 November 2026 (second chat): woman57's sash is narrow and snug, and the shirt's button band stops at a belt or sash; the apron hangs as one smooth sheet (it no longer catches on hands or dips between the legs) and has no waistcoat buttons under it (printer1907 cloth 0); the 1690 and 1734 breeches waistband is flat and closes onto the tucked shirt (no open lip; Quamin 28 to 12 cloth points, Kofi and buc2 107 to 93). Those bodies are rebuilt and repacked in every game. `tools/garvey/preview.py` has `GV_SIDE=1` for side and waist views. Still to do:
   - **Seated and kneeling skirts.** Reweighting alone does not work (tried: front on the thighs, back on the hips, wider left and right blend; seated got worse, the girl's kneel still lifts one flat panel). It needs skirt helper bones that follow the average of both thighs (a rig and `engine/anim.js` change, so its own PR). Kendal `?shot=model&m=people&ids=mother,nurse,woman_elder,girl&anim=SitIdle` (and `&anim=Kneel`) shows it.
   - **Trousers through the jacket hem when sitting** (delegate1920, garvey1914, garvey1916, hl_critic, man_suit). The points are at the outer back of the thigh; giving the jacket skirt's front or back more leg weight changed nothing, so the fault is likely in the jacket body's lower edge, not the jacket skirt.
   - **Jacket shoulders and sleeves**: round shoulders, full upper sleeves and a ledge where the jacket skirt (offset 0.024) overlaps the jacket body (0.017). Matching the offsets softened the ledge but made the hem wavy over the trousers; reverted.
   - Port Royal seated lining through Benning's coat (13 points) and shirts through breeches when sitting; Quamin and buc2 shirt through breeches standing (about 2 cm, at the sides).
   - Kofi's shirt still falls straight from the chest to the band (a full 1690 cut); owner to judge whether it still reads as a barrel.
   - Men's fronts: the Kendal suit jacket now looks flat from the side; Quamin's shirt is fine.
   - Side-view proof shots of every group, in the game.
2. **Comfort clips** (`tools/anims/handmade.py`): the owner chose the simpler target: palm resting flat on top of her shoulder from the side (no forearm across her back), for ComfortGive, ComfortHand, SitComfortGive, ComfortChild. Pass `pair_check.py`, then merge just those clips into the library.
3. **Per-game full pass, one game at a time** (Kendal was in progress: its code changes are in the final checkpoint 922da67 but unverified; the worker had reached the screenshot step, so start by running Kendal's checks and taking the band, crash site, nurse, station crowd, bucket and Gran with Lloyd screenshots; then Melissa, Eventide, Nanny, Bog Walk, Garvey, Tivoli, Port Royal): wire `engine/story.js`, `engine/ambient.js`, `?test=all`; fix the game's lists in `docs/plans/flow_audit.md`, `anim_audit.md`, `ambient_plan.md`, `story_migration.md`, `checks_plan.md`; journal button glows with a badge and chime and no notice covers a dialogue box; all checks to 0; autoplayer every chapter.
4. **Object overlaps** still reported: Kendal 33 (a worker inside the station locomotive), Melissa 17, Bog Walk (turbine house, gate posts, rocks), Nanny walkers (Mama 3.6 cm, Quamin 3.4 cm), Nanny cloth 22. Add Eventide's vehicle, garment and hanging checks to the shared audit for every game.
5. **Port Royal**: cloth to 0, rebuild Abba and Grace with the builder (keep Abba's mixer behaviour), wire audit and layout, remove Abba's ground glow ring (the arrow replaces it), fix the content lint findings (43 long lines, fictional notes for Will, Jack, Tom and Dick).
6. **Shared menu and journal UI** for all games (audit was started then stopped): same options everywhere, "All games" link (Port Royal and Tivoli lack it), journal unlock glow, a check.
7. **Wardrobe builder with face variety**: design in `docs/plans/wardrobe_design.md`, about 20 small PRs, every game on its own bodies, no stand-ins.
8. **Graphics pass**: Garvey shrine bust needs a real likeness from photos and the shrine checked against a photograph; Bog Walk train dark at dawn; then all places.
9. **Last**: richer, lusher visuals within budget with quality tiers (people, plants, buildings), realistic period vehicles researched (Eventide 1980 buses, the owner's "jolly bus"; Tivoli 2010 cars and military and police vehicles), measured with the budget check.

Animation clips still wanted (owner downloads from Mixamo or ActionForge; ActionForge exports with the Mixamo skeleton, CC0): a standing prayer, arms crossed, hands behind back, sweeping, hammering, hoeing, carrying a bucket, child hops and skips, washing, a seller calling out. Several owner downloads were exact duplicates (see `docs/PIPELINE.md`).
