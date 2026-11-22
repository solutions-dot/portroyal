# The Mad Master of Edinburgh Castle, 1773 (`games/hutchinson/`)

A Mature 13+ story (owner, 22 November 2026). It plays like every other game, for an older audience. First built 22 November 2026; not yet reviewed by anyone outside.

## The Mature 13+ line (set by the owner, 22 November 2026)

The owner chose "Bodies, no wounds" for The Mad Master of Edinburgh Castle and The White Witch of Rose Hall ("the 13 plus can be a little more graphic"). Tivoli keeps its own rules (`docs/games/tivoli.md`).

- **May be shown:** dread, threat, a gun at a window, a gunshot heard, a violent act up to the moment it happens and then a cut away, aftermath, and plain words about slavery. A dead or wounded person may be seen still, covered or at a distance (a shape under a sheet, a body carried off). Some blood may show: a stain, a cloth.
- **Never shown:** open wounds, gore, a close look at a body, the moment of a killing itself, the hanged man. The player never harms anyone.
- Every camera scene sits behind the standard scene card with "Read what happened instead". The menu hides the game in the Kids profile, and a device set to Kids is stopped (`engine/mature.js`).

## Record and story

The game keeps the two apart, on the journal pages and in the quiz. Source: a research pass on 22 November 2026.

| In the game | Standing | Source |
|---|---|---|
| Hanged at Spanish Town, Tuesday 16 March 1773, for the murder of John Callendar; pleaded not guilty | Record | Letter from Kingston, 1 April 1773 (Annual Register, Essex Gazette); Grand Court record cited by Clinton Black |
| Callendar was a neighbour who came about a strayed jackass; a sick man in the house slipped out and complained | 1773 letter | as above |
| The couplet "Their sentence, pride, and malice I defy, / Despise their power and like a Roman die"; 100 pounds left for a stone, never carved | Record | 1773 letter; Bridges 1828; Black |
| Taken by George Turnbull, a Navy officer sent by Admiral Rodney; Assembly thanks, 2 December 1773 | Record | Cundall, Historic Jamaica (1915), pp. 296 to 301 |
| Shot travellers from the loopholes | Tradition, first printed 1828 | Bridges, Annals of Jamaica |
| 43 watches (47 in Bridges) and much clothing | Later accounts, not in the 1773 letter | Bridges 1828; Cundall |
| Quarrel with Dr Hutton, the sword, the blow to the head | Family tradition written 1897 | Cundall |
| Enslaved people could not give evidence against a white person | Law of the time | Bryan Edwards (1794), vol. 2, p. 144; Acts of Assembly |
| Hector, enslaved at the castle, led searchers to remains; 24 people enslaved there in 1773 | Record | Black; Cundall |
| The sinkhole: 98 m deep; the Governor lowered in 1895 saw no bones | Record | Jamaican Caves Organisation; Cundall |
| The sinkhole's mouth is about 3 m by 5 m, at the foot of a small valley ringed by rock walls about 10 m high | Record | Jamaican Caves Organisation register, http://www.jamaicancaves.org/Register_E_J.htm |
| He bought the land in 1768; on the St Ann jury list 1768 or 1769 | Record | JNHT 2010 proposal; Cundall; Black |
| House: two storeys, a round loopholed tower at two opposite corners | Description and photographs | Cundall; JNHT 2010 proposal |

Invented for the story, and said so in the journal: Quaco (the player), Cubba, Sampson, Juba, Cudjoe, Captain Reid, the clerk, the dry season, the well, the pack mule, and the watched walk to the well. "The only water for miles" could not be found in any early source, so the game does not claim it.

Real people: Dr Hutton says imagined words (his page says so). John Callendar never speaks. Lewis Hutchinson is never seen close and has no words but his couplet.

## Places (rule 3: what is modelled on a source)

Scenery builders are in `src/scenery.js`; the places are put together in `src/places.js`.

- **The road by Dr Hutton's pen (chapters 1 and 2):** a general picture of a St Ann cattle pen about 1772, since no drawing of Hutton Bonvil or Lebanon was found: Guinea grass pasture gone gold in the dry season, a rail fence and a feed rack, eleven cattle (stand, graze, lie), a dry pond of cracked mud, a dry stone trough, the pen-keeper's thatched hut with its cook fire, a grass stack, the pen house with its kitchen across the pasture, karst hills near and far, and the castle's towers far off on their rise. The boundary pole and pegs, the pack mule and Sampson's cart are the story's own.
- **Edinburgh Castle, dusk and morning (chapters 3 and 4):** from Cundall's description and the JNHT photographs of the ruin: rubble limestone, two storeys, round loopholed towers at diagonally opposite corners, a door beside the front tower and one on the east side, small square plastered loopholes, the house on rising ground over the road, and the quarters of the enslaved people as ruins to the west. Stand-ins: the roofs and chimney (the ruin has none), the shuttered upper window, the well, the cotton tree, the cattle yard and every piece of cover between the road and the well. No measured plan was found.
- **The hall (chapter 5):** a general picture inside those walls: plastered loopholes in deep splays, the foot of the spiral steps in the back tower (Cundall), a corner hearth, the two doors, and what later accounts say the searchers found (the watches, the coats). The cot is the sick man of the 1773 letter. The furniture is a general picture.
- **The sinkhole (chapter 5):** after the Jamaican Caves Organisation register: a small valley ringed by rock walls about 10 m high, the mouth about 3 m by 5 m at its foot, and a shaft that goes dark out of sight. The rope, stake and lantern are the game's picture.
- **Spanish Town, March 1773 (chapter 6):** the square after the 1774 plate in Edward Long's history (`nljdigital.nlj.gov.jm/items/show/5208`): King's House with its portico, the public building opposite with brick arches below and the long gallery where the court sat upstairs, and the railed green between them: on the plate one long straight side of about ten square white piers with a rail between, so the game makes it a long rectangle running between the two buildings (no source found says it was an octagon). In the real square King's House is on the west side and the public building on the east; the game turns the square so the court faces north. There is no Rodney Memorial and no 1819 court house. The houses on the other two sides and the market goods are a general picture. The gallows at dawn is a far shape at the end of a street.

## People

17 own recipes in `tools/hutchinson/people/` (`hx_`), among them Hector (real, silent), the sick man (seen only far off in the camera scene) and two pen workers for the background, built by `tools/hutchinson/build-people.mjs` with the shared builder. Skin 1.55, Hair 1. Known gaps: men's hats are the builder's round felt, not the cocked hat of the 1770s; women's dress is the shift, petticoat and head wrap the builder can make. Clothes follow Long (1774) and the 1769 Acts (osnaburg frocks, jackets, drawers and petticoats).

## How it is made

Copied from Windrush's frame. `content.js` (words), `steps.js` (story table, `TASKS` to carry, `LOOKS` to look at), `places.js` (five places), `world.js` (stonework), `cast.js`, `director.js` (five camera scenes). New in this frame: `LOOKS` (a thing changes where you can see it, then a card), and a watched stretch (`danger` on a step, `Q.danger` in the place; `main.js` "a watched stretch").

## Checks (22 November 2026)

`?auto=1` plays all six chapters to step 66. `FLOW 0`. `?test=audit`: 0 in all five places. Layout and ambient setup 0 in all five.

Later the same day: `?test=held` 0. `?test=ambient` 0 in all five places. `?test=layout` 0 at 390x800. `?test=walkers`: every body 0 lines but `hx_cudjoe`, who slides 9.4 cm a loop when the test walks him at an old man's pace (0.85 m/s); he never walks in the game, so it is not seen, but the pace needs fixing before he is given a walk.

Not yet run: `?test=all`, cloth, skin, layout at 667x375, 800x500 and 1280x720, a phone play-through by hand, and a listen to the sound. Not yet timed against the 5 to 8 minutes a chapter.

## Checks, 22 November 2026 (second pass)

`?test=layout`: 0 at 390x800, 667x375, 800x500 and 1280x720. `?test=held`: 0. `?test=ambient`: 0 in every place. `?test=cloth` is **not at 0**: 36 lines on 22 November 2026, after the cloth pass; see "Checks" below for each body and why. `?test=skin` and `?test=walkers` for this game are still to run and record.

## Checks, 22 November 2026 (enrichment pass)

The story now has 44 steps: new moments are the dry pond, the cut grass, the boundary peg, the cask, the cotton tree and the hat, the tumbled wall, drawing the water, the strayed jackass, getting down behind the long wall, the cot, the loophole, the lantern on the rope and listening under the gallery. Both camera scenes were reshot.

- `?auto=1`: plays to `AUTO END 68`, `FLOW 0`, no errors, no long dialogue lines.
- `?test=audit`: `AUDIT 0` and `FACES 0` in all five places; layout and ambient setup 0.
- `?test=ambient`: `AMBIENT 0` in all five places.
- `?test=held`: `CARRY 0`.
- `?test=layout`: `LAYOUT UI 0` at 390x800, 667x375, 800x500 and 1280x720.
- `node tools/lint_content.mjs --ci`: 0 new for hutchinson.

Still to do: `hx_cudjoe` slides in the walk check, so he is never given a walk; `?test=cloth` show-through points from the shared builder (above); a phone play-through by hand; timing each chapter against 5 to 8 minutes; outside review.

### Clothes pass, 22 November 2026 (cocked hats, cloth, skin, walkers)

- **Cocked hats.** The shared builder now makes a tricorne (`["cocked", "Hat"]`, `docs/PIPELINE.md` section 5): a low round crown and a black felt brim turned up on three sides, one point to the front. Hutton, Hutchinson, Callendar, Captain Reid (`hx_officer`) and the townsman (`hx_townman`) wear it instead of the round felt hat; seamen, the enslaved and free working men, and the bareheaded clerk do not. Looked at front, three-quarter, side and back, standing and walking: it sits on the hair with no gap, and the brim stays above the brows. No change in `src/` was needed: the hat is part of each body (material `Hat`), so the earlier gap "men wear the builder's round felt hat" is closed.
- **`?test=cloth`** (raw bodies; a plain run no longer counts the joined mesh, so `&nojoin` is not needed). 22 November 2026, after the cloth pass: **36 lines** (77 before it on the same day): hx_hutton 3, hx_hutchinson 0, hx_callendar 1, hx_officer 1, hx_clerk 2, hx_cudjoe 4, hx_carter 1, hx_juba 5, hx_cubba 0, hx_hector 1, hx_sick 1, hx_man 2, hx_woman 0, hx_townman 7, hx_townwoman 6, hx_penman 2, hx_penwoman 0. What the pass did: every coated man sets `necktuck` (skin under the coat's neck facing and the cravat is bound to them: the 4 to 8 mm of skin at the side of the neck and pink patches through the back of the cravat are gone), `hx_hutchinson` sets `shoetuck`, and `hx_woman`, `hx_penwoman`, `hx_juba` and `hx_townwoman` set `beltfit` (the skirt no longer rises over the sash when they bend). The fingertips' "4 open edge points" were the check reading the packer's cut between the hand and the rest of the skin (fixed in `engine/audit.js`). What is left: the cravat's yoke 0.7 to 1.5 mm past the facing's front end, one point (`hx_hutton`, `hx_officer`, `hx_clerk`, `hx_townman`); breeches 12 to 18 mm at the top of the coat's back vent, under the coat's back, one to three points (`hx_townman`, `hx_clerk`; in a pale close shot it looks like the vent opening); `hx_townman`'s breeches through the coat's front when he bends to pick up (39 points, 12 mm); one shirt point at Callendar's cuff in TalkM1; skin at a plain neckline or under the arm (`hx_penman` 29 mm where the chin drops to the neckline, `hx_sick`, `hx_hector`, `hx_carter`, `hx_man`, `hx_juba`); the apron and the waistcoat over the skirt when `hx_juba` and `hx_townwoman` bend; `hx_cudjoe`'s fingers in his drawers (his arm pose in the game's code, and it comes and goes between runs).
- **`?test=skin`** (mean face colour as drawn): hx_hutton 226,178,132; hx_hutchinson 214,162,119; hx_callendar 215,165,122; hx_officer 214,162,116; hx_clerk 231,187,141; hx_cudjoe 148,97,62; hx_carter 148,97,61; hx_juba 152,99,64; hx_cubba 136,87,55; hx_hector 111,74,48; hx_sick 223,175,129; hx_man 155,100,64; hx_woman 151,99,64; hx_townman 228,176,130; hx_townwoman 167,112,73; hx_penman 157,104,66; hx_penwoman 164,109,70. Hector's recipe skin (146,100,72) is inside the rule 9 range like the others; his lower reading comes from his dark hairline in the probe's frame, and his face reads as warm brown in close shots, so his recipe is unchanged.
- **`?test=walkers`**: every body slides under 2 cm a loop except `hx_cudjoe`, 9.4 cm at the 0.85 m/s the check gives an OldIdle body. He never walks in the game (a `watch` behaviour in the hall and at the hole), so nothing slides on screen; if he is ever given a walk, give him `ctl.pace` to fit his 169 cm stride.
- After the rebuild: `?auto=1` AUTO END 68, FLOW 0; `?test=audit` 0 in all five places; `?test=ambient` 0; `?test=held` CARRY 0.

## Second pass, 22 November 2026

Finished from the paused job: Spanish Town rebuilt as a square (a long arcaded brick public building with its gallery, a railed octagonal enclosure in the middle, houses round the other sides), meant to follow Edward Long's 1774 plate; the lead checked the result in a screenshot but did not compare it side by side with the plate, so that comparison is still open. The near hills are steep, rounded cockpit hills with pale limestone showing. The hills are marked as ground for the overlap check (`userData.soft`), since trees and rocks on their slopes stand into them as on a real hillside. Checks: `?auto=1` to step 68, `FLOW 0`, audit 0 in all five places, ambient 0, held 0, layout 0 at 390x800; content lint 0 new.

### Spanish Town against the 1774 plate, 22 November 2026

The game's square was put beside the plate (NLJ item 5208, "A view of the King's House and Public Offices at St. Jago de la Vega", "T. Bonnor & Sculp", 1 July 1774, from Long's History of Jamaica, vol. II), looking from the north side across the square, as the plate does.

- **The two buildings match.** On the plate's left is a long two-storey front with arches below, a gallery above and a pediment over the middle; on its right a front with a portico of tall columns under a pediment. The game has the public building (arcade, gallery) on the left and King's House (columned portico) on the right from that view. King's House is on the west side of the square (Victorian Web, after Cundall; Hakewill 1825), as in the game.
- **The NLJ caption disagrees.** It says "The House of Assembly (right) and King's House". The plate's own title names King's House first, and the porticoed front on the right fits King's House, so the caption looks mistaken; the game follows the plate.
- **Changed: the green in the middle.** It was a small railed octagon. The plate shows one long straight rail on about ten square white piers, running most of the way between the buildings, and no source found says it was an octagon. It is now a railed rectangle 9.2 by 13.6 m (`railedGreen()` in `src/scenery.js`), inside the octagon's old outline, so no walk or story spot moved. Checks after the change: `?test=audit` 0 in all five places, `?test=ambient` 0, `?test=held` `CARRY 0`, `?auto=1` `AUTO END 68` with `FLOW 0`, `?test=layout` `LAYOUT UI 0` at 390x800.
- **Still a general picture:** the houses on the north and south sides, the chapel and guard-house, and how the green's rail was made (iron or timber): the only copy found is 470 pixels wide.


## Looking is a close-up action, 22 November 2026 (owner rules 13 and 14)

The owner: "there is nothing to actually see... no action of actually looking besides a button press and confirmation", and "It must feel like a cinematic story / story book". Every look now uses `engine/lookshot.js`: the bars come in, the camera eases to a close shot (`view` on each entry of `LOOKS` in `src/steps.js`), the thing moves over two to five seconds with a sound made in code (`LOOK_SFX` in `src/main.js`) and a short line in the lower bar, then the card, then the camera eases back. Each place's `Q.reveal[id](k)` now moves the thing with `k` from 0 to 1:

| Look | What you see happen |
|---|---|
| The dry pond | the stick goes into the cracked mud a hand deep; a puff of dust |
| The pack mule | the flap lifts; a tin cup and a folded shirt come into view by the bedroll |
| The hat in the roots | the hat is lifted from the roots and hung by its crown on a broken branch stub on the trunk (the stub is new; the hat floated before) |
| Drawing the water | the windlass crank and roller turn and the bucket comes up out of the well; then Juba's pail is full |
| The strayed jackass | it turns and walks over to the yard wall, nodding as it comes |
| The strongbox | the lid swings up; the watches glint one after another in the candle light |
| The coats | the cloth is drawn along its rail and the coats come into view |
| The loophole | the board comes off and is leaned below; daylight falls in |
| The cot | the tin cup is picked up from the floor and set on the cot |
| The lantern | the lantern goes down the shaft until it is a small point of light |
| Under the court | the gallery's jalousies fold back one by one; voices you cannot make out |

**Cut (rule 14):** "Read the notice by the court door" (was step 62). The clerk had just said the same thing (tried for one killing, John Callendar, a free man saw it), so it was a second button for the same fact, and its red seal was the game's own invention. The one new fact on it, that he pleaded not guilty, is now on the "Under the court" card. A save made in step 62 carries on from step 63. The notice board stays on the pier as part of the square.

**The hat** is now a real felt riding hat (`feltHat()` in `src/props.js`): a wide brim turned up at the edge, a hollow crown open underneath (one lathe, both faces drawn) and a band; the fallen hat in the camera scene uses it too. Checked close up from the front, the side and below, found and before.

**noAudit marks** (rule 8): 23 before, 12 after (places.js 5, scenery.js 6, world.js 1), each with a comment saying why: smoke and dust puffs, lamp and ember glows, a shaft of light, flame sprites and glints, the grass tufts, birds in flight and the black far down the hole. Taken off and now checked: the well bucket, both hats, the stick, the loophole's daylight square, the cup, the hall lantern, the trees and vines round the hole, the searchers' rope and lantern, the gallows, the watcher at the window, the far crowd and the walls of the shaft. The loophole board and the jalousies are marked `fixed`: one is nailed across the hole, the others hang on the gallery front.

Checks: `?auto=1` AUTO END 68, FLOW 0; `?test=audit` AUDIT 0 in all five places, with `engine/audit-reveal.js` running every reveal both ways; `?test=held` CARRY 0; `?test=ambient` 0 in all five; `?test=layout` LAYOUT UI 0 at 390x800 and 667x375; `npm test` 279 pass, LINT 0 new. The look moments were screenshot mid-action at 1280x720 and 390x800 (the touch stick and the action button are held and hidden, the line sits in the lower bar). `#sub` lost its leftover `dim` class, which had kept every camera scene's captions invisible.

## Five camera scenes, 22 November 2026

The owner noticed the game had two staged moments where older games have five or six. Three were added in the same system (`FILMS` and `CARDS` in `src/content.js`, `Q.films` in `src/places.js`, played by `src/director.js`), each behind the standard scene card with "Read what happened instead", each with short captions and sounds made in code (new in the director: `hoof`, `steps`, `wind`, `creak`).

| Scene | Chapter, steps | What it shows | Length |
|---|---|---|---|
| The dry road (`opening`) | 1, steps 8 and 9, before Cubba | The pen yard and cattle at the rail, the dry pond, the road west over the hills, a slow zoom to the castle two miles off on its rise, and the pack mule coming down that road alone to stop by the wall | 38 s |
| Under the towers (`towers`) | 3, steps 28 and 29, before the walk to the well | From Sampson's cart coming up the road at dusk: the house on its rise, the round tower, the loopholes, the shuttered upper window (shut), Juba at the well, and the cart stopping behind the long wall | 41 s |
| Afterwards (`search`) | 4, steps 45 and 46, after "The neighbour" | Sampson's cart takes John Callendar home, a covered shape under a sheet with one small stain, seen from the road and then far off; days later Captain Reid comes up the road, Hector goes down to meet him, the east door stands open, the house is empty | 45 s |

Why these: the suggested "dry road at dusk" became an afternoon, because chapter 1 is a dry afternoon in this place and dusk belongs to chapter 3. The suggested "men coming to take Hutchinson" was changed: no source puts his capture at the house (the 1773 letter says only that he was taken; later books tell of a boat chase from Old Harbour), so the scene shows what follows from the record instead, Callendar carried away and searchers at an empty house, with Hector, who the record says led searchers.

**Record and story.** Record: Callendar was shot at the house; a sick man slipped out and told; Hutchinson was taken by George Turnbull, a Navy officer; Hector, enslaved at the castle, led searchers; the house of two storeys with loopholed round towers on rising ground over the road (Cundall; JNHT). Story, and the journal says so: the dry season, the riderless mule, Sampson's cart and the sheet, Captain Reid, and the open east door. The `callendar` and `capture` journal pages now each have a line saying their scene is the game's picture.

**The Mature 13+ line.** Nothing is shown of a killing. Callendar is seen only as a still, covered shape on a cart, never close, with one small stain on the cloth; then the cart is far off. No wound, no face, no body handled. Hutchinson is never seen. The two calm scenes have `scary: false` on their cards.

**Flow.** Chapter 1 now opens at step 8, chapter 3 at step 28 (the water card leads there), and "The neighbour" goes on to step 45, so chapter 4 ends at 46. The first chapter's card now comes from `go()` like every other chapter's, with the "You are Quaco" line, and then the scene card. The autoplayer keeps a chapter's opening scene card instead of closing it. Old saves at any step still load.

**Checks.** `?auto=1`: AUTO END 68, FLOW 0, through steps 8, 9, 28, 29, 45 and 46. `?test=audit` AUDIT 0 and FACES 0 in all five places; `?test=ambient` 0; `?test=held` CARRY 0; `?test=layout` LAYOUT UI 0 at 390x800 and 667x375; `npm test` 279 pass, LINT 0 new. Each scene was screenshot with `?shot=film&key=<film>&at=<s>&ui` at six to eight moments at 1280x720 and at two or three at 390x800 and looked at: no shot passes through a wall (the search scene's move from the track to the east door goes up over the rock as a crane), nobody stands in a wall, captions sit in the lower bar, the skip button is the only control on a phone.

## Hills and far ridges, 22 November 2026

The owner: "the mountains in these games dont look as good as the other games". The near hills were flat-shaded with hard white patches and speckled colour, and the far ones a ring of grey-green domes.

- **Far ridges** are now the engine's (`engine/ridges.js`, made in `src/main.js` as `RIDGES`), as in Nanny Town: rings of jagged ridges that follow the camera and go blue into the haze. St Ann has a full ring, lower than Nanny's mountains (limestone hill country all round). Spanish Town has them only to the north (`shape`; north is -z), the hills of St Catherine above the plain. `light()` tones them for each hour: a place light may give `haze` and `glow` (dusk 0.62, late dusk 0.4, dawn in Spanish Town 0.55, day 1); the hall, indoors, draws none. The old `hillRing` backdrops are gone from `hills()` and the town.
- **Near hills** (`cockpitHill`, `karstHill` in `src/scenery.js`) are smooth-shaded and coloured by soft noise through one `forest()` helper: a canopy of darker and lighter greens, shaded by height, with a few small warm grey limestone patches on the steep sides among the trees. No white, no speckle.
- **The sinkhole's rock walls** are warm grey limestone with moss and ferns gathering toward the wooded top.

**Search scene on a phone.** The crane and the last shot are reframed so the captain and Hector stay in frame at 390x800: the crane looks down at the two men on the track, the east door is seen square on from the east (it was hidden behind the tower in a tall frame), and the last shot looks up the track from behind them to the house.

Checks: `?auto=1` AUTO END 68, FLOW 0; `?test=audit` AUDIT 0 and FACES 0 in all five places; `?test=ambient` 0; `?test=held` CARRY 0; `?test=layout` LAYOUT UI 0 at 390x800 and 667x375; `npm test` 279 pass, LINT 0 new. Before and after screenshots from the road, the castle at dusk and late dusk, the hole, the town and the dawn scene were compared by eye.
