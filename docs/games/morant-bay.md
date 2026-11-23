# Morant Bay, 1865 (working title) (`games/_morant-bay/`, not started)

The next game (owner, 23 November 2026). It tells the Morant Bay rebellion and what followed, from Stony Gut in St Thomas-in-the-East, through a fictional girl. It is a **Mature 13+** game. Build it in a folder that starts with `_` so `tools/dist.mjs` does not publish it, and drop the `_` only when the owner says.

Status: facts and design only. Nothing is built. Everything below that is marked "to check" has not been confirmed.

## The owner's direction (23 November 2026)

"It must have a mature rating and we need a bit of violence etc, but no blood. It must feel real and express the feelings and fear that people experienced then."

That is stronger than the Mature 13+ line proposed in `docs/games/hutchinson.md` (dread, a shot heard, aftermath, nobody hit). CLAUDE.md rule 4 still says that line "waits for the owner". The owner has now answered for this game. Claude's reading is below, for the owner to confirm or move. If it is confirmed, rule 4 and the Hutchinson doc should say so.

### The Mature 13+ line for this game (proposed reading)

**Shown**, seen from a child's height, mostly at a distance, in smoke, in shadow or in the dark:
- crowds with cutlasses and sticks, stones thrown, a scuffle where a policeman is struck;
- a volley fired (flash and smoke), people ducking, running and falling to the ground;
- people chased, grabbed and dragged; a door broken in; soldiers in a yard;
- a courthouse, a chapel and houses burning;
- a man tied at a post with the whip raised, **cut away before the stroke**, with the sound;
- a gallows as a far shape at dawn, never a hanged body;
- fear on faces, close and in plain light: hands shaking, a mother's hand over a child's mouth, people who cannot look.

**Never shown:** blood, wounds, injuries, a dead body close up, a hanged body, a blow landing on a woman or a child, the marks of flogging, sexual violence. The Commission records cruelty to a woman at Stony Gut and the game neither shows nor describes it. No mutilation is shown. Underhill (p.53, p.133) says the Commission found Eyre's despatches' stories of outrages on the dead "had no existence"; that is not in Part I of the report as read, so it stays out of the game until it is checked in Part II.

**The player** never holds a weapon, never hits anyone and never chooses violence. The player hides, carries, listens, keeps quiet, walks and reads.

**Cards:** every violent scene sits behind the standard `sceneWarning` card with "Read what happened instead" (`engine/scene-warning.js`), and the title sits behind the one Mature 13+ gate (`engine/mature.js`). The menu card needs `data-age="13"` and a `data-warn` note. The note says what the story has: fear, a riot with weapons, fire, gunshots, people hurt without blood, hangings told but not shown, a flogging begun and cut away. Never write "PG-13".

## How the game makes people feel the fear

Gore is not how this works, and the owner has ruled it out. Fear comes from these.

1. **One person who cannot change anything.** The Traveller's Rule is the dread: she can only watch, hide, carry and keep quiet.
2. **Sound first.** A shell and drum far off, then silence when they stop. A crowd's low murmur. A dog. Fire. The two real cries the Commission records, "Peace, peace" and "War" (Report p.11).
3. **Waiting.** The hour between hearing they are coming and the crowd arriving. A night in the cane. Three days in a cave.
4. **Low and close cameras.** Through cane stalks, a doorway, a fence, a gap under a market stall. Cut away before the worst moment.
5. **Faces and hands, not wounds.** Eyes that will not look, hands that shake, someone made to do something terrible.
6. **Fear on every side.** Villagers hiding from soldiers. Vestrymen's families hiding from the crowd. A man afraid he will be flogged if he refuses to flog. The game does not make anyone a villain by colour or side (see "The record").
7. **Real voices.** The Commission printed about 1,100 pages of ordinary people's testimony. The game draws its feelings from those words (see "Voices").
8. **A quiet after.** Smoke, an empty yard, a list of names. The scene shows what a child could see and the journal says the rest.

## Story and play

The player is a fictional girl of about 15 from Stony Gut who can read and sells provisions at Morant Bay market. Her name and her family are to choose, and her journal page says she is fictional. Nobody she meets who is a real person has invented words (see "Real people").

Story-first rules apply (`docs/STANDARD.md`): something happens every minute, a chapter is 5 to 8 minutes, every task shows on screen, "Back in 2026" ends it.

| Ch | Title (working) | The real anchor | The fear and the scene |
|---|---|---|---|
| 1 | A dry year | A two-year drought, the Underhill letter and meetings, the "Queen's Advice" placard (10,000 copies posted, to be read in pulpits), the Morant Bay meeting of 12 August 1865 chaired by Gordon (Underhill) | Hunger and unfairness. She reads the placard aloud to a crowd and sees their faces. No violence. |
| 2 | The long walk | The deputation to Spanish Town in August 1865 (45 to 55 miles by different sources), refused by Eyre | Cinematic: the closed door, the road home. Humiliation and silence. |
| 3 | The warrant | 7 October market day and the Geoghegan scuffle; the 10 October morning warrant read in Bogle's yard, 300 to 500 men from the chapel, the police made to swear; the drilling with drum and shell; the meetings where names were written down | A scuffle and a crowd closing in. Option for the owner: she is asked to write down names, because she can write. The Commission says names were taken down and registered (Report p.12). |
| 4 | The eleventh of October | Vestry at noon; a crowd between 3 and 4 pm; "Peace, peace" and "War"; the Riot Act; stones; Captain Hitchins struck; the order to fire; the courthouse burning in the dark | **Big cinematic**, seen from under the market stalls and the lanes: volley, rush, fire, dusk. People fall. No blood. Never the killings in the dark. |
| 5 | Martial law | Martial law from 13 October; 90 men at Stony Gut on 18 October, the chapel and about eight cottages burned on the 19th; Torrington attacked on the 21st | **Cinematic:** hiding in the cane and a cave; the soldiers in the yard; the fire-stick (Voices); a flogging begun and cut away. Stealth, never combat. |
| 6 | After | The temporary courthouse where courts-martial sat (an open shingle shed on posts, ILN 1865); Gordon and Bogle hanged; the Royal Commission; the Jamaica Committee; Crown Colony 1866; National Heroes 1969 | The quiet after. A far gallows at dawn. The Commission's words. "Back in 2026": the burnt courthouse walls at Morant Bay. |

**Owner decisions still open:** the girl's name and family; what happens to her father or brother (the Commission says many who were executed "were neither directly nor indirectly parties to the disturbances", Report p.39; the record names no individual here); whether she is asked to write the names in chapter 3.

## The record (what the game may say, and what it cannot)

The Royal Commission's report (9 April 1866, signed Storks, Gurney, Maule) is the main source. It is out of copyright. A scan is on [Google Books](https://books.google.com/books?id=iDUe5-p_8IAC) (University of Wisconsin copy, 1,255 PDF pages). **Printed page = PDF page minus 7.** Part I is printed pages 1 to 41. Part II is the evidence (numbered questions). Underhill's *The Tragedy of Morant Bay* (1895, [archive.org](https://archive.org/details/tragedyofmorantb00undeuoft)) quotes the report but is partisan. The Gleaner (11 October 2023) is a newspaper summary.

| What the game says | Source |
|---|---|
| Saturday 7 October 1865 was market day. A man named Geoghegan told a boy to pay his 4s fine and not the 12s 6d costs. He was rescued twice and the police were beaten. Lewis Miller's land case from Stony Gut was heard the same day; the people said the land was "the Queen's". | Report p.10-11 |
| Tuesday 10 October, early: six police and two constables came to Stony Gut (about five miles from Morant Bay). Bogle had the warrant read, refused to go and cried "Help, here". Captain Grant called "Turn out, men". 300 to 500 men came from the chapel and a cane field. Three police were held for hours and let go only after swearing to "cleave to the black". | Report p.11 |
| About 300 men were drilled in three companies by "Colonel" Bowie, Moses Bogle and James Dacres, marching "with drum and shells". | Report p.13 |
| A letter signed by Bogle and 19 others, written 10 October after noon, asked the Governor for protection and said they would "put our shoulders to the wheel". It went about 50 miles to Spanish Town and arrived on the 11th. | Report p.14 |
| Wednesday 11 October: the vestry met about noon. Between three and four a crowd arrived in parties, about 100 from Torrington joining at the town entrance. They took the police station's arms (the muskets had no flints). | Report p.11, 13 |
| The Custos called "Peace, peace" and was answered "War". He began the Riot Act. Stones were thrown (the Commission found before the firing, apparently by women and others at the side). Captain Hitchins was struck and, with the Custos's authority, ordered fire. | Report p.11-12 |
| The school-house was set on fire and the fire spread to the courthouse. It was dark. 18 were killed and 31 wounded; 51 prisoners were freed; the magazine, with about 300 arms, held. | Report p.12 |
| A Black vestryman, Mr Price, was beaten to death. Not shown. | Report p.14 |
| Martial law was proclaimed on 13 October for the county of Surrey except Kingston. The Commission thought the Council's advice and Eyre's act justified at the start, and martial law too long. | Report p.18-19, 39 |
| 90 men took Stony Gut on 18 October. The next day they burned the chapel and about eight cottages. | Report p.20 |
| 50 Maroons from Moortown (Moore Town) under Colonel Fyfe marched on 19 October, attacked the barricaded Torrington on the 21st (7 shot), and shot at most 25 in all; about 141 cottages were burned. Nelson's orders were never to molest a woman or child and never to shoot a man who surrenders. | Report p.25 |
| Bogle was apprehended on Monday 23 October with his few remaining followers and brought to Morant Bay on the 24th. The report does not say by whom. | Report p.39 |
| Gordon: arrested in Kingston on 17 October (Underhill says he went to the troops' office himself), taken on the steamer Wolverine to Morant Bay, tried (five witnesses for the prosecution, one for the defence, six hours), sentence confirmed by Nelson on 21 October, Eyre agreed on the 22nd, hanged at 7.10 am on 23 October. The Commission found the evidence "wholly insufficient". It also thought it "exceedingly probable" his words moved Bogle's followers, and found no sufficient proof of a plot. | Report p.37-38; Underhill p.91-93 |
| 354 were executed by courts-martial and 85 killed without trial: 439. 1,000 dwellings were burned. At least 600 were flogged, those at Bath with wires twisted into the cords. | Report p.25-26 |
| The Commission found a planned resistance, with land free of rent as the main aim; it praised Eyre's early vigour and the troops' promptness; and it condemned the length of martial law, the number of death sentences, the floggings and the burning as excessive, "wanton and cruel". | Report p.40-41 |

**Conflicts and gaps** (the game says "the sources differ" or leaves it out):
- Bogle hanged 24 or 25 October (the Gleaner, JIS and Wikipedia say 24, one Wikipedia page says 25). The Commission only says he reached Morant Bay on the 24th.
- Who captured Bogle. Wikipedia says Moore Town Maroons, citing Heuman. The Commission and the Gleaner do not say. Do not dramatise a capture until Heuman is read.
- Bogle was born about 1820 in slavery (Gleaner) or free about 1822 (JIS). A Gleaner line gives him three children; no other source does. Do not use.
- The Gleaner says police went to Stony Gut on Monday 9th; the Commission says Tuesday 10th. Use the Commission.
- Drums: the Commission has them for the drilling and for Bath. For the 11 October arrival, only the Gleaner (a quoted account, source not found). Heuman and the evidence volume could settle it.
- Stony Gut distance: five miles (p.11) or six (p.29).
- Not found: the 1865 courthouse's exact look, Stony Gut's layout, any 1865 portrait or photograph of Bogle.

## Voices (from the evidence, Part II)

These are ordinary witnesses answering the Commission, on both sides. Quote only short fragments. The scan's wording needs checking on the page image before any line goes in the game (the text is two-column and the OCR mixes lines). PDF page, question number:

- A woman made to bring the fire-stick to soldiers who then burned her house: "I was so frightened, I can't say" (pdf 215, Qs 7049 to 7069). **Chapter 5.**
- "If you sat in the house, they would take you as well. They didn't make any distinction": she ran into the bush, was later held 18 days (pdf 314, Qs 12,536 to 12,549).
- A man frightened by what he heard, who hid in a cave with his tobacco for three days (pdf 340, Q 14,058).
- "I was afraid to go out anywhere": he hid in the bushes from Monday to Thursday (pdf 254, Qs 9394 to 9407).
- A boy afraid of a soldier who "shot ten men" on the road at Long Bay (pdf 281-282, Qs 10,688 to 10,743).
- A witness at the courthouse: "more afraid of looking at the people than to look at the measure of their sticks" (pdf 207, Q 6648).
- Women and children hiding as the crowd cried "Colour for colour!" (pdf 106).
- A soldier in the band who was afraid he would be flogged if he refused to flog (pdf 140, Q 3539).
- A villager who ran because "he would flog me" if he stayed about (pdf 322, Q 13,082).

## Real people

- **Paul Bogle, George William Gordon, Governor Eyre, Baron von Ketelhodt, Captain Hitchins, Brigadier-General Nelson:** no invented words (as Selassie, Hutchinson). The Commission records witness-reported words ("Peace, peace", "Turn out, men", Gordon's "I have just gone as far as I can go, but no further") and they are only the witness's report. Use the **real documents on screen as cards**, in their real words: Bogle's letter of 10 October 1865, the 1862 Stony Gut letters to Gordon, Eyre's reply, the Commission's conclusions. The player reads them, nobody speaks them.
- **Their faces (owner, 23 November 2026): "we need to model our national heroes to the images we accept as them."** Bogle and Gordon are modelled on the image the owner accepts for each, as Marcus Garvey is. The images in use, what is known about them and what the owner still has to accept are in `docs/plans/national_heroes_likenesses.md`. The short version for Bogle: the photograph Jamaica has used since 1959 (on the old $2 note and the 10-cent coin) is the accepted image, but whether it shows him is doubted and the original is missing; the Edna Manley statue's face is not used. The journal says plainly which kind of picture each face comes from.
- **The Moore Town Maroons** appear in the Commission as the men who protected Bath, marched through Moortown on 19 October, attacked Torrington and shot at most 25. Bogle's men had hoped for them ("the Maroon is our back", Report p.14). This touches Nanny Town's community, whose review of `games/nanny/` is still pending. Both games should go to Moore Town for review, and the Maroon scenes stay short, sourced and never dramatise a capture.
- Fictional people: the girl, her family, neighbours, a market woman. The journal says so.

## Places and looks (rule 3)

Reference images (look only, never textures). Rights differ:

- **Contemporary, 1865, usable:** *The Illustrated London News*, 9 December 1865, pp.552-3, hosted by [Victorian Web](https://victorianweb.org/history/empire/westindies/68.html) (educational use, credit the Internet Archive and the University of Michigan Library):
  - `docs/games/morant-bay-iln1865-town.jpg`: Morant Bay from the sea, "from a sketch by Mr. Cyprian Bridge, R.N.": a long low building with a row of round arches with smoke rising (the ruined courthouse), a two-storey house with a louvred upper floor, steep wooded hills behind, a few boats.
  - `docs/games/morant-bay-iln1865-temporary-courthouse.jpg`: the temporary courthouse, engraved from a sketch by T. J. Mills, Quartermaster: an open-sided shed on posts under a shingle roof, a file of men in white, two gabled shingle houses behind, a flagpole, a boardwalk, felled stumps, a sentry. This is where courts-martial sat.
  - Also on Victorian Web: [the town](https://victorianweb.org/history/empire/westindies/62.html), [a distant view from the sea](https://victorianweb.org/history/empire/westindies/59.html), [the headquarters of officers and sailors](https://victorianweb.org/history/empire/westindies/67.html), the Hordley estate and Muirton House.
- **The 1865 courthouse itself:** no photograph confirmed. The report says a courthouse, a Vestry Hall and an adjoining school-house, a police station, a gaol and a magazine. A Princeton album of 1865 albumen photographs includes about 59 of the rebellion ([page](https://www.princeton.edu/~graphicarts/2009/10/photography_album_documenting.html), refused automated access) and Yale's Beinecke has an album page (digital.library.yale.edu item 15817490). **Next step: the owner opens these in a browser.**
- **The rebuilt courthouse** (not the 1865 building): rebuilt after 1865 in limestone and red brick, burned 19 February 2007, now a museum project with brick walls standing (a new courthouse opened in 2014). National Library of Jamaica photographs, permission needed to reproduce, **link only, never copied**: [a 19th-century view](https://nljdigital.nlj.gov.jm/items/show/2213) and [a second view](https://nljdigital.nlj.gov.jm/items/show/417) (two storeys, a stone and brick porch with two arches, staircases up both sides, a bell turret with a louvred cupola, a small annex, a fountain in front), [with a monument](https://nljdigital.nlj.gov.jm/items/show/434), [with Bogle's statue](https://nljdigital.nlj.gov.jm/items/show/2021), [after the 2007 fire](https://nljdigital.nlj.gov.jm/items/show/3243), [under repair in 1981](https://nljdigital.nlj.gov.jm/items/show/10845). The journal must say which building the game shows. Until a photograph of the 1865 one is found, it is a general picture built from the report and the engravings.
- **Stony Gut today** (National Library of Jamaica, permission needed, link only): [the monument on the site of Bogle's house and chapel](https://nljdigital.nlj.gov.jm/items/show/3278), [a structure at Stony Gut](https://nljdigital.nlj.gov.jm/items/show/3289), [the chapel's location](https://nljdigital.nlj.gov.jm/items/show/8747).
- **A period print of the ruined courthouse:** NLJ [item 2338](https://nljdigital.nlj.gov.jm/items/show/2338), "Execution of the Morant Bay Rebels. Court House (Morant Bay) destroyed by them", printed by Mills, Dick and Co., Dunedin (date and original source unknown). It shows a roofless two-storey masonry shell with a central arch and a double staircase up to it, houses on both sides of the square, soldiers drawn up, and hangings. Look only: it is a later print of unknown reliability, and the game never shows a hanging.
- An engraving "The attack on the court house, St Thomas in the East, 1865" by W. H. Overend is on Wikimedia Commons. Its date is not confirmed and it may be a later picture, so it is not used as an eyewitness source.
- **Not yet researched:** 1865 clothing for villagers, market women, police, militia volunteers, the West India Regiments, marines and sailors; Maroon dress; a Native Baptist chapel; a Stony Gut house; Morant Bay market.

## Work list

1. Owner: confirm the Mature 13+ reading above, the girl's family and the names question, and accept the images for Bogle and Gordon (`docs/plans/national_heroes_likenesses.md`).
2. Owner: open the Princeton and Yale albums and send a picture of the 1865 courthouse if one exists.
3. Read Heuman, *The Killing Time* (a lending copy is on [archive.org](https://archive.org/details/killingtimemoran0000heum)) for the capture, the drums and the arrival.
4. Check each "Voices" line against the page image.
5. Moore Town reviewer for this game and Nanny Town.
6. Start `games/_morant-bay/` from `games/_template/`, then the order in `docs/STANDARD.md` section 5: recipes, bodies, places, the chapter step tables, the cinematics (copy Selassie's `director.js` pattern and Tivoli's opt-in card), the checks at 0, the menu card, the Mature gate.
