# The Mad Master of Edinburgh Castle, 1773 (`games/hutchinson/`)

A Mature 13+ story (owner, 22 November 2026). It plays like every other game, for an older audience. First built 22 November 2026; not yet reviewed by anyone outside.

## The Mature 13+ line (proposed by Claude, for the owner to confirm or move)

Shown: dread, threat, a gun at a window, a gunshot heard, a hanging as the far shape of a gallows at dawn, aftermath, and plain words about slavery. Not shown: wounds, bodies, anyone being hit, the hanged man. The player never harms anyone. Both camera scenes sit behind the standard scene card with "Read what happened instead". The title screen shows the Mature 13+ card (`engine/mature.js`), and the menu hides the game in the Kids profile.

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
| He bought the land in 1768; on the St Ann jury list 1768 or 1769 | Record | JNHT 2010 proposal; Cundall; Black |
| House: two storeys, a round loopholed tower at two opposite corners | Description and photographs | Cundall; JNHT 2010 proposal |

Invented for the story, and said so in the journal: Quaco (the player), Cubba, Sampson, Juba, Cudjoe, Captain Reid, the clerk, the dry season, the well, the pack mule, and the watched walk to the well. "The only water for miles" could not be found in any early source, so the game does not claim it.

Real people: Dr Hutton says imagined words (his page says so). John Callendar never speaks. Lewis Hutchinson is never seen close and has no words but his couplet.

## Places (rule 3: what is modelled on a source)

- **Castle:** from Cundall's description and the JNHT photographs of the ruin. Stand-ins: the roofs (the ruin has none), the window, the well, the ground between road and house. No measured plan was found.
- **Spanish Town:** a general picture of the public building facing King's House, where the court sat upstairs (Long, 1774). To do: model it on Long's 1774 plate (`nljdigital.nlj.gov.jm/items/show/5208`).
- **Road, hall, sinkhole:** general pictures. The sinkhole's real mouth is about 3 by 5 m; the game's is wider.

## People

13 own recipes in `tools/hutchinson/people/` (`hx_`), built by `tools/hutchinson/build-people.mjs` with the shared builder. Skin 1.55, Hair 1. Known gaps: men's hats are the builder's round felt, not the cocked hat of the 1770s; women's dress is the shift, petticoat and head wrap the builder can make. Clothes follow Long (1774) and the 1769 Acts (osnaburg frocks, jackets, drawers and petticoats).

## How it is made

Copied from Windrush's frame. `content.js` (words), `steps.js` (story table, `TASKS` to carry, `LOOKS` to look at), `places.js` (five places), `world.js` (stonework), `cast.js`, `director.js` (two camera scenes). New in this frame: `LOOKS` (a thing changes where you can see it, then a card), and a watched stretch (`danger` on a step, `Q.danger` in the place; `main.js` "a watched stretch").

## Checks (22 November 2026)

`?auto=1` plays all six chapters to step 66. `FLOW 0`. `?test=audit`: 0 in all five places. Layout and ambient setup 0 in all five.

Later the same day: `?test=held` 0. `?test=ambient` 0 in all five places. `?test=layout` 0 at 390x800. `?test=walkers`: every body 0 lines but `hx_cudjoe`, who slides 9.4 cm a loop when the test walks him at an old man's pace (0.85 m/s); he never walks in the game, so it is not seen, but the pace needs fixing before he is given a walk.

Not yet run: `?test=all`, cloth, skin, layout at 667x375, 800x500 and 1280x720, a phone play-through by hand, and a listen to the sound. Not yet timed against the 5 to 8 minutes a chapter.

## Checks, 22 November 2026 (second pass)

`?test=layout`: 0 at 390x800, 667x375, 800x500 and 1280x720. `?test=held`: 0. `?test=ambient`: 0 in every place. `?test=cloth` is **not at 0**: it lists small show-through points on the new bodies (a few millimetres at the coat neck, the hat band and the belt line; for example 31 lines on `hx_hutton`, worst 28.5 mm at the hat band). They come from the shared clothes builder, which is not changed in a game's own pull request (`docs/STANDARD.md`); they need a look in close screenshots and, if seen, a builder fix in its own PR. `?test=skin` and `?test=walkers` for this game are still to run and record.
