# Morant Bay, 1865 (working title) (`games/morant-bay/`, first playable build)

The next game (owner, 23 November 2026). It tells the Morant Bay rebellion and what followed, from Stony Gut in St Thomas-in-the-East, through a fictional girl. It is a **Mature 13+** game. Build it in a folder that starts with `_` so `tools/dist.mjs` does not publish it, and drop the `_` only when the owner says.

**Status (23 November 2026):** a first playable build of all six chapters is in `games/morant-bay/` (on the menu since 23 November 2026, at the owner's request, under Mature 13+). It plays from start to end in the autoplayer (`?auto=1`, AUTO END 71), and the audit, faces, layout and held checks report 0 in all three places (`node tools/review/run-test.mjs morant-bay audit,layout,held`). Everything marked "to check" is unconfirmed. See "What is built" below.

## What is built (23 November 2026)

- **The kit:** the Mad Master's story kit (story table, places, director, journal, quiz) in `games/morant-bay/src/`: `steps.js` (the story table), `content.js` (every word), `places.js` (Stony Gut, Morant Bay, Spanish Town), `mbscenery.js` (the 1865 buildings), `cast.js`.
- **People:** 19 bodies in `tools/morant-bay/people/`, built by `tools/garvey/era.py` (`BPY_PYTHON=~/venv/bin/python3 node tools/morant-bay/build-people.mjs`). Country clothes after the 1865 album photographs: head ties, white cotton, rolled trousers, bare feet, low straw hats (the new recipe keys `crown` and `wrapoff`, docs/PIPELINE.md). Hannah's family, Miss Ada and Deacon Clarke are fictional.
- **Bogle** (`mb_bogle`): first pass at the 1959 photograph: a long face with high cheekbones, a broad nose, full lips, close-cropped hair, a dark three-piece suit (the fitted suit) with an open white collar; the photograph's light neckcloth is not made yet. The owner should judge the face against the photograph. He never speaks; tapping him gives Hannah's own thought.
- **Gordon** (`mb_gordon`): built, but not yet shown in a scene. The recipe asks for spectacles and side-whiskers that `era.py` does not make yet: **work to do** before he appears.
- **Places:** Stony Gut (a general picture: no 1865 picture of it is known), Morant Bay after the Illustrated London News engravings (the arcaded court-house, a two-storey house with a louvred upper floor, wooded hills, a beach with canoes, the open shed where courts-martial sat), and the square at Spanish Town with King's House and the Rodney Memorial (built 1783 to 1789, so there in 1865).
- **The Mature 13+ line** is kept: crowds with sticks and cutlasses, stones, a volley with people ducking and running, far off and in smoke; fire; a flogging begun and cut away (sound only, the camera on Mama's face); a gallows as a far frame at dawn with nobody on it. No blood anywhere. Every such scene has the opt-in card with "Read what happened instead".

### Looks and their sources (23 November 2026)

- **The soldiers:** the 1st West India Regiment in the Zouave dress it wore from 1858: a white turban, a long-sleeved white waistcoat with a short scarlet sleeveless jacket over it, loose dark blue trousers, white gaiters (Royal Collection Trust, "New uniforms of the 1st West India Regiment"; National Army Museum). The fez under the turban and the jacket's braid are not modelled.
- **The lantern:** a tin lantern of the 1860s with a glass chimney round a candle.
- **The 2026 scene shows no statue.** Edna Manley's statue of Paul Bogle (1965, ciment fondu: Bogle with his feet wide and his hands on the hilt of a machete, facing the court-house) was taken off its base for repair after the 2007 fire (Jamaica Information Service, 2009); no report was found of it going back. The journal says so.
- **Still general pictures (no source found):** the rural constables of 1865, now in the dress of the British and Irish constabularies of the day (a fitted dark-blue tunic buttoned to a stand collar, a pale belt, a peaked cap; owner, 23 November 2026: they looked like citizens in lounge suits; no picture of a Jamaican constable of 1865 was found, so this stays a general picture to check against Heuman or the Jamaica Constabulary Museum) and the Volunteers (shown as men of the town in dark coats with rifles: the Commission records "Volunteers' rifles" and "police muskets", not their dress). The chapel at Stony Gut, the school-house and the police station are general pictures too. To check: Heuman, *The Killing Time*; the Princeton and Yale albums.

### People falling at a distance (owner, 23 November 2026; built the same day)

The owner supplied `shared/anim-sources/Dying_Backwards.fbx` (a fall backwards) for the volley at the court-house. It is used only as this game's line allows, and in no other game (Tivoli: no one is hit; the Mad Master: the moment of a killing is never shown):
- **The clip:** `FallBack`, this game's own clip, kept out of the shared library as Tivoli's are (docs/PIPELINE.md, "Clips for one game only"): `tools/morant-bay/clips.json`, retargeted to `build/anims_mb.glb`, packed by `node tools/morant-bay/pack_clips.mjs` into `games/morant-bay/site/models/anims_mb.js`, loaded after the shared library. It is not in `anim-clips.json` (that list trims the shared library, and refuses a name it does not hold). The engine never plays it as filler (`NOT_IDLE` in `engine/anim.js`) and keeps its hips height (`HIPS_Y`).
- **The scene:** the riot film, behind its opt-in card. At the volley (27.5 s) two people at the front of the crowd, nearest the steps and about 12 m from Hannah with nobody between, stagger and go down backwards while the rest duck. The camera looks along to them at 28.4 s ("People fall.") and **cuts** at 29.9 s, 2.1 s into the fall, before they reach the ground (down at about 2.2 s, still from about 2.6 s), to the dark under the stall ("You hide your eyes. People run."). After the cut they are not on the Parade: nobody is ever seen lying there. No blood.
- **Looked at** (23 November 2026): the film played in game time at 27.7 to 29.95 s, full frame and cropped close; the fall reads small and far, the cut comes before the ground.

### Decided (owner, 23 November 2026)

- The girl is **Hannah** (a common name among Jamaica's Baptist families of the time; the owner left the name to Claude). Her family is as recommended in `notes/the-girl-and-her-family.md`.
- **Papa's fate is unknown**, and the game never says what became of him.

### Not yet confirmed

The three name lists follow the recommendation in `notes/the-girl-and-her-family.md`. The exact wording of the Queen's Advice was not checked at source, so the game shows only its heading (journal page "The Queen's Advice"). Each "Voices" quotation in the journal still needs checking on the page image.

## Start here (for whoever builds it)

1. Read `CLAUDE.md` (the rules), then this page, then the notes in `docs/games/morant-bay/` (`README.md` there lists them): `notes/the-girl-and-her-family.md`, `notes/record-and-conflicts.md`, `notes/likeness-decisions.md`, `notes/princeton-and-yale-findings.md`.
2. The primary source is the Royal Commission's report of 1866, as text in `docs/games/morant-bay/sources/`. Cite it by printed page (Part I) or PDF page and question number (Part II). Check a quotation on the page image before it goes in the game; the text is OCR.
3. Follow `docs/NEW_GAME.md` and `docs/STANDARD.md` section 5 (people, places, cinematics, checks at 0, menu card, Mature 13+ gate). Copy Selassie's `director.js` for the shot-list cinematics and Tivoli's opt-in card for the violent scenes.
4. The owner decides what is marked "not confirmed" below. Ask, do not guess.

## Decisions (owner, 23 November 2026)

- **Morant Bay, 1865 is the next game, rated Mature 13+.** "It must have a mature rating and we need a bit of violence etc, but no blood. It must feel real and express the feelings and fear that people experienced then."
- **The Mature 13+ line below is confirmed** for this game. It is stronger than the line proposed in `docs/games/hutchinson.md`. CLAUDE.md rule 4 says it (see rule 4).
- **Likenesses accepted:** Paul Bogle is modelled on the 1959 photograph; George William Gordon on the portrait on the Jamaican $10 note (`docs/games/morant-bay/notes/likeness-decisions.md`).
- **Moore Town review is not required**, for this game or for Nanny Town.
- **Not yet confirmed by the owner:** the girl's name and family, her father's fate, and the three name lists (the recommendation is in `notes/the-girl-and-her-family.md` and summarised below). The owner asked Claude's view and has not yet answered. Treat as proposed.

### The Mature 13+ line for this game (confirmed)

**Shown**, seen from a child's height, mostly at a distance, in smoke, in shadow or in the dark:
- crowds with cutlasses and sticks, stones thrown, a scuffle where a policeman is struck;
- a volley fired (flash and smoke), people ducking, running and falling to the ground;
- people chased, grabbed and dragged; a door broken in; soldiers in a yard;
- a courthouse, a chapel and houses burning;
- a man tied at a post with the whip raised, **cut away before the stroke**, with the sound;
- a gallows as a far shape at dawn, never a hanged body;
- fear on faces, close and in plain light: hands shaking, a mother's hand over a child's mouth, people who cannot look.

**Never shown:** blood, wounds, injuries, a dead body close up, a hanged body, a blow landing on a woman or a child, the marks of flogging, sexual violence. The Commission records cruelty to a woman at Stony Gut and the game neither shows nor describes it. No mutilation is shown. Underhill (p.53, p.133) says the Commission found Eyre's despatches' stories of outrages on the dead "had no existence"; that is not in Part I of the report, so it stays out until it is checked in Part II.

**The player** never holds a weapon, never hits anyone and never chooses violence. The player hides, carries, listens, keeps quiet, walks and reads.

**Cards:** every violent scene sits behind the standard `sceneWarning` card with "Read what happened instead" (`engine/scene-warning.js`), and the title sits behind the one Mature 13+ gate (`engine/mature.js`). The menu card needs `data-age="13"` and a `data-warn` note: fear, a riot with weapons, fire, gunshots, people hurt without blood, hangings told but not shown, a flogging begun and cut away. Never write "PG-13".

## How the game makes people feel the fear

Gore is not how this works, and the owner has ruled it out. Fear comes from these.

1. **One person who cannot change anything.** The Traveller's Rule is the dread: she can only watch, hide, carry and keep quiet.
2. **Sound first.** A shell and drum far off, then silence when they stop. A crowd's low murmur. A dog. Fire. The cries the Commission records: "Peace, peace" and "War" (Report p.11), and a witness's "No peace! Hell to-day!" (Part II, pdf p.247, Q 9077).
3. **Waiting.** The hour between hearing they are coming and the crowd arriving. A night in the cane. Three days in a cave.
4. **Low and close cameras.** Through cane stalks, a doorway, a fence, a gap under a market stall. Cut away before the worst moment.
5. **Faces and hands, not wounds.** Eyes that will not look, hands that shake, someone made to do something terrible.
6. **Fear on every side.** Villagers hiding from soldiers. Vestrymen's families hiding from the crowd. Men forced to swear on pain of death. A man afraid he will be flogged if he refuses to flog. The game does not make anyone a villain by colour or side (see "The record").
7. **Real voices.** The Commission printed about 1,100 pages of ordinary people's testimony. The game draws its feelings from those words (see "Voices").
8. **A quiet after.** Smoke, an empty yard, a list of names. The scene shows what a child could see and the journal says the rest.

## Story and play

The player is a fictional girl of 15 from Stony Gut who can read and sells provisions at Morant Bay market. **Recommended, not yet confirmed:** her name is **Hannah** (a surname to choose); she was born free in 1850, so her mother and grandmother were enslaved. Her family is four people: **Mother** (a higgler), **Gran** (remembers slavery and fears freedom can be taken back, as rumours of 1865 did), **Father** (a small settler and chapel member, pressed to go with the men on 10 and 11 October) and **a little brother of 6** (the reason she must keep quiet when hiding). Her father is taken by soldiers on the night of 19 October and **the game never says what became of him**; the last chapter says the family is made up and quotes the Commission that many who died "were neither directly nor indirectly parties to the disturbances" (Report p.39). Reasons and guardrails: `notes/the-girl-and-her-family.md`. Her journal page says she is fictional. Nobody she meets who is a real person has invented words (see "Real people").

**The names thread (recommended):** she writes names three times. Chapter 1: the registration list (the Stony Gut people asked Gordon in 1862 for £150 to pay the tax that would register them as voters, Report p.29). Chapter 3: the night list (the Commission found oaths, names taken down and a pledge of secrecy, "the terms of the oath were not shown", Report p.12; the scene stops before any oath is spoken). Chapter 6: the Commission's lists of the dead. She is pressed, never does harm, and the game never says the soldiers found the list (nobody knows).

Story-first rules apply (`docs/STANDARD.md`): something happens every minute, a chapter is 5 to 8 minutes, every task shows on screen, "Back in 2026" ends it.

| Ch | Title (working) | The real anchor | The fear and the scene |
|---|---|---|---|
| 1 | A dry year | A two-year drought; the Underhill letter and meetings; the "Queen's Advice" placard (10,000 copies posted, to be read in pulpits); the Morant Bay meeting of 12 August 1865 chaired by Gordon (Underhill); the 1862 voter-tax letter | Hunger and unfairness. She writes the registration list and reads the placard aloud to a crowd and sees their faces. No violence. |
| 2 | The long walk | The deputation to Spanish Town in August 1865 (45 to 55 miles by different sources), refused by Eyre | Cinematic: the closed door, the road home. Humiliation and silence. |
| 3 | The warrant | 7 October market day: men marched from the Parade "with drum and fife" and the Geoghegan scuffle; the Tuesday 10 October morning warrant read in Bogle's yard, 300 to 500 men from the chapel and a cane field, the police made to swear; the drilling "with drum and shells"; the night meeting where names were written down | A scuffle and a crowd closing in; a father pressed to go; the pen put in her hand. |
| 4 | The eleventh of October | Vestry at noon; a crowd between 3 and 4 pm; the Parade; "Peace, peace" and "War"; the Riot Act; stones (a woman first, on one witness's word); Captain Hitchins struck; the order to fire; the courthouse burning in the dark | **Big cinematic**, seen from under the market stalls and the lanes: shells and drums, volley, rush, fire, dusk. People fall. No blood. Never the killings in the dark. |
| 5 | Martial law | Martial law from 13 October; 90 men at Stony Gut on 18 October; the chapel and about eight cottages burned on the 19th; Torrington attacked on the 21st | **Cinematic:** hiding in the cane and a cave; the soldiers in the yard; the fire-stick (Voices); the father taken; a flogging begun and cut away. Stealth, never combat. |
| 6 | After | The temporary courthouse where courts-martial sat (ILN 1865); Gordon and Bogle hanged; the Royal Commission; the Jamaica Committee; Crown Colony 1866; National Heroes 1969 | The quiet after. A far gallows at dawn. The Commission's words and the list of names. "Back in 2026": the burnt courthouse walls at Morant Bay. |

## The record (what the game may say, and what it cannot)

The Royal Commission's report (9 April 1866, signed Storks, Gurney, Maule) is the main source. A scan is on [Google Books](https://books.google.com/books?id=iDUe5-p_8IAC) (University of Wisconsin copy); its text is in `docs/games/morant-bay/sources/`. **Printed page = PDF page minus 7.** Part I is printed pages 1 to 41; Part II is the evidence (numbered questions). Underhill's *The Tragedy of Morant Bay* (1895, [archive.org](https://archive.org/details/tragedyofmorantb00undeuoft)) quotes the report but is partisan. The Gleaner (11 October 2023) is a newspaper summary.

| What the game says | Source |
|---|---|
| Saturday 7 October 1865 was market day. A man named Geoghegan told a boy to pay his 4s fine and not the 12s 6d costs. He was rescued twice and the police were beaten. Lewis Miller's land case from Stony Gut was heard the same day; the people said the land was "the Queen's". Men marched from the Parade "with drum and fife", armed with sticks. | Report p.10-11; Part II pdf p.247-248, Qs 9097-9100 |
| Tuesday 10 October, early: six police and two constables came to Stony Gut (about five or six miles from Morant Bay). Bogle had the warrant read, refused to go and cried "Help, here". Captain Grant called "Turn out, men". 300 to 500 men came from the chapel and a cane field. Three police were held for hours and let go only after swearing to "cleave to the black". | Report p.11 |
| About 300 men were drilled in three companies by "Colonel" Bowie, Moses Bogle and James Dacres, marching "with drum and shells". Men were threatened and sworn: "if you won't go, we will take off your heads", "Kiss the Bible". | Report p.13; Part II pdf p.156, Qs 4189-4198 |
| A letter signed by Bogle and 19 others, written 10 October after noon, asked the Governor for protection and said they would "put our shoulders to the wheel". It went about 50 miles to Spanish Town and arrived on the 11th. | Report p.14 |
| Wednesday 11 October: the vestry met about noon. Between three and four a crowd arrived in parties, about 100 from Torrington joining at the entrance. They took the police station's arms (the muskets had no flints). They came into the Parade "with guns and bayonets fixed, sticks, swords, machettes, and lances ... blowing shells and playing drums". | Report p.11, 13; Part II pdf p.247, Qs 9072-9073 |
| The Custos called "Peace, peace" and was answered "War"; others called "Peace in Her Majesty's name!" and the people said "No peace! Hell to-day!" He began the Riot Act. Stones were thrown (the Commission found before the firing, apparently by women and others at the side). One witness says a woman, Geoghagan, "first fired a stone", "was the guide, and led them" and "a sort of leader". Captain Hitchins was struck and, with the Custos's authority, ordered fire. | Report p.11-12; Part II pdf p.247, Qs 9074-9080 |
| The school-house was set on fire and the fire spread to the courthouse. It was dark. 18 were killed and 31 wounded; seven of the crowd died; 51 prisoners were freed; the magazine, with about 300 arms, held. | Report p.12; Heuman p.xiii as quoted by Princeton |
| A Black vestryman, Mr Price, was beaten to death. Not shown. | Report p.14 |
| Martial law was proclaimed on 13 October for the county of Surrey except Kingston. The Commission thought the Council's advice and Eyre's act justified at the start, and martial law too long. | Report p.18-19, 39 |
| 90 men took Stony Gut on 18 October. The next day they burned the chapel and about eight cottages. | Report p.20 |
| 50 Maroons from Moortown (Moore Town) under Colonel Fyfe marched on 19 October, attacked the barricaded Torrington on the 21st (7 shot), and shot at most 25 in all; about 141 cottages were burned. Nelson's orders were never to molest a woman or child and never to shoot a man who surrenders. | Report p.25 |
| Bogle was apprehended on Monday 23 October with his few remaining followers and brought to Morant Bay on the 24th. The report does not say by whom. | Report p.39 |
| Gordon: arrested in Kingston on 17 October (Underhill says he went to the troops' office himself), taken on the steamer Wolverine to Morant Bay, tried (five witnesses for the prosecution, one for the defence, six hours), sentence confirmed by Nelson on 21 October, Eyre agreed on the 22nd, hanged at 7.10 am on 23 October. The Commission found the evidence "wholly insufficient", thought it "exceedingly probable" his words moved Bogle's followers, and found no sufficient proof of a plot. | Report p.37-38; Underhill p.91-93 |
| 354 were executed by courts-martial and 85 killed without trial: 439. 1,000 dwellings were burned. At least 600 were flogged, those at Bath with wires twisted into the cords. | Report p.25-26 |
| The Commission found a planned resistance, with land free of rent as the main aim; it praised Eyre's early vigour and the troops' promptness; and it condemned the length of martial law, the number of death sentences, the floggings and the burning as excessive, "wanton and cruel". | Report p.40-41 |

**Background facts in the journal** (checked 23 November 2026):
- Slavery ended in Jamaica on 1 August 1834 (the Slavery Abolition Act of 1833), with full freedom on 1 August 1838, when apprenticeship ended (journal "Hannah").
- The Queen's Advice was the Colonial Office's reply to the St Ann petition, dated 14 June 1865; Underhill writes that "the reply reached them from the Colonial Office on the 14th June" (Underhill 1895, in `sources/`; journal "The Queen's Advice").
- King's House at Spanish Town burned in 1925; its front still stands on the square (Jamaica National Heritage Trust; journal "Governor Eyre").

**Conflicts and gaps** (the game says "the sources differ" or leaves it out; full table in `notes/record-and-conflicts.md`):
- Bogle hanged 24 or 25 October; **where** (the courthouse arch, or "the yardarm of H.M.S. Wolverine" per an NLJ leaflet) is not settled. The Commission only says he reached Morant Bay on the 24th. Do not say.
- Who captured Bogle. Wikipedia says Moore Town Maroons, citing Heuman. The Commission does not say. Do not dramatise a capture.
- An NLJ leaflet says Bogle "denied that Gordon had instigated 'rebellion', taking full responsibility on himself". Not found in the report. Do not use: it would be invented words.
- The Yale album caption dates the rebels' assembly by the tree to 12 October; the Commission puts the courthouse attack on 11 October.
- Bogle's birth (about 1820 in slavery, or about 1822 free); a Gleaner line gives him three children. Leave out.
- Not found: the 1865 courthouse's exact look, Stony Gut's layout.

## Voices (from the evidence, Part II)

Ordinary witnesses answering the Commission, on both sides. Quote only short fragments. The scan's wording needs checking on the page image before any line goes in the game (two-column OCR mixes lines). PDF page, question number:

- A woman made to bring the fire-stick to soldiers who then burned her house: "I was so frightened, I can't say" (pdf 215, Qs 7049 to 7069). **Chapter 5.**
- "If you sat in the house, they would take you as well. They didn't make any distinction": she ran into the bush, was later held 18 days (pdf 314, Qs 12,536 to 12,549).
- A man frightened by what he heard, who hid in a cave with his tobacco for three days (pdf 340, Q 14,058).
- "I was afraid to go out anywhere": he hid in the bushes from Monday to Thursday (pdf 254, Qs 9394 to 9407).
- A boy afraid of a soldier who "shot ten men" on the road at Long Bay (pdf 281-282, Qs 10,688 to 10,743).
- A witness at the courthouse: "more afraid of looking at the people than to look at the measure of their sticks" (pdf 207, Q 6648).
- Women and children hiding as the crowd cried "Colour for colour!" (pdf 106).
- A soldier in the band afraid he would be flogged if he refused to flog (pdf 140, Q 3539).
- A villager who ran because "he would flog me" if he stayed about (pdf 322, Q 13,082).

## Real people

- **Paul Bogle, George William Gordon, Governor Eyre, Baron von Ketelhodt, Captain Hitchins, Brigadier-General Nelson, Mrs Letitia Geoghegan:** no invented words (as Selassie, Hutchinson). The Commission records witness-reported words ("Peace, peace", "Turn out, men", Gordon's "I have just gone as far as I can go, but no further") and they are only the witness's report. Use the **real documents on screen as cards**, in their real words: Bogle's letter of 10 October 1865, the 1862 Stony Gut letters to Gordon, Eyre's reply, the Commission's conclusions, and Eyre's January 1866 despatch on Gordon with the protest against it (the 1866 broadside, `notes/princeton-and-yale-findings.md`; check the wording against the Blue Book). The player reads them; nobody speaks them.
- **Faces (accepted):** Bogle is the 1959 photograph (NLJ item 6195); Gordon is the portrait on the $10 note. The journal says what each picture is: for Bogle, no picture made in his life is certain, this is the photograph Jamaica has used since 1959, some doubt it shows him; for Gordon, the portrait on the ten-dollar note (its own source is unknown). Skin follows rule 9 (the note is blue ink). Build with MakeHuman targets against the image, as Garvey's was. See `notes/likeness-decisions.md`.
- **Mrs Letitia Geoghegan** (a real mother, executed with a son, on one witness's account the leader of the crowd and the first to throw a stone): whether and how she is named is for the owner. She is shown from far off if at all, and the first stone never hits anyone.
- **The Moore Town Maroons** appear in the Commission as protecting Bath, marching through Moortown on 19 October, attacking Torrington and shooting at most 25. Bogle's men had hoped for them ("the Maroon is our back", Report p.14). Keep these scenes short and sourced, and never dramatise a capture. The owner decided a Moore Town review is not required.
- Fictional people: the girl, her family, neighbours, a market woman. The journal says so.

## Places and looks (rule 3)

All reference images are in `docs/games/morant-bay/images/` (see `INDEX.md` there for source and rights). Reference only, never textures.

- **Contemporary, 1865, public domain:** four *Illustrated London News* engravings (9 December 1865, pp.552-3) made from sketches by naval officers who were there: Morant Bay from the sea with the courthouse burning (a long low building with a row of round arches, a two-storey house with a louvred upper floor, steep wooded hills); the temporary courthouse where courts-martial sat (an open-sided shed on posts under a shingle roof, two gabled shingle houses, a flagpole, a boardwalk, felled stumps, a sentry); a distant view from the sea; the officers' and sailors' headquarters. [Victorian Web](https://victorianweb.org/history/empire/westindies/68.html), educational use with credit to the Internet Archive and the University of Michigan Library.
- **1865 photographs (rights unclear, in `images/restricted/`):** Yale Beinecke album page 72 ([item 15817490](https://collections.library.yale.edu/catalog/15817490)): the upper photograph shows Morant Bay over fenced open ground, a long masonry building with a tiled hip roof, balustraded parapet, six square columns and arched end windows, beside wooden two-storey houses with galleries; the lower shows a roofless masonry shell behind trees. **Neither is confirmed as the courthouse.** The verso is a huge silk-cotton tree at a crossroads, the same photograph as in Princeton's album. Princeton's album ([post](https://www.princeton.edu/~graphicarts/2009/10/photography_album_documenting.html)): Colonel Fyfe with two Maroons in leaf camouflage, four Maroons in leaves, "Mr Price, Murdered" (frock coat with velvet collar, bow tie, watch chain, top hat), Eyre and Nelson, villagers (head wrap, basket on the head, white cotton, straw hats). Next step: the Yale neighbours (pages 71 and 73) and the Princeton album's full-size images may caption the buildings.
- **The rebuilt courthouse (not the 1865 building):** rebuilt after 1865 in limestone and red brick, burned 19 February 2007, a museum project now. National Library of Jamaica photographs (permission needed, link only): [a 19th-century view](https://nljdigital.nlj.gov.jm/items/show/2213), [two storeys, double stairs, cupola, annex, fountain](https://nljdigital.nlj.gov.jm/items/show/417), [with a monument](https://nljdigital.nlj.gov.jm/items/show/434), [with Bogle's statue and a heritage leaflet](https://nljdigital.nlj.gov.jm/items/show/2021), [after the 2007 fire](https://nljdigital.nlj.gov.jm/items/show/3243), [under repair in 1981](https://nljdigital.nlj.gov.jm/items/show/10845). The journal must say which building the game shows. Until a photograph of the 1865 one is found, it is a general picture built from the report, the engravings and the photographs.
- **A later print** of the ruin and hangings, NLJ [item 2338](https://nljdigital.nlj.gov.jm/items/show/2338) (printed by Mills, Dick and Co., Dunedin; date unknown): a roofless two-storey shell with a central arch and double stairs. Look only: the game never shows a hanging.
- **Stony Gut today** (NLJ, link only): [the monument on the site of Bogle's house and chapel](https://nljdigital.nlj.gov.jm/items/show/3278), [a structure at Stony Gut](https://nljdigital.nlj.gov.jm/items/show/3289), [the chapel's location](https://nljdigital.nlj.gov.jm/items/show/8747).
- **Not used as a source:** an engraving "The attack on the court house" by W. H. Overend on Wikimedia Commons (date unconfirmed; likely a later picture).
- **Not yet researched:** 1865 police, militia volunteers, the West India Regiments, marines and sailors; a Native Baptist chapel; a Stony Gut house; Morant Bay market.

## Work list

**The owner:** confirm the girl and her family, the father's fate and the name lists; say whether Mrs Geoghegan is named; decide on aging Bogle's face (the sitter looks younger than the 43 he was); browse Yale pages 71 and 73 and the Princeton album for captions (the buildings, the Gordon portrait); ask the NLJ about its permission and about the 1965 centenary booklet that published many of these photographs.

**Research still open:** Heuman, *The Killing Time* (a lending copy on [archive.org](https://archive.org/details/killingtimemoran0000heum), not read: who captured Bogle, the oath); Part II of the report for Bogle's and Gordon's courts-martial, Mrs Geoghegan's trial, the courthouse and Stony Gut; check each Voice on the page image; Eyre's January 1866 despatch against the Blue Book; 1865 uniforms and clothes.

**Build order** (`docs/STANDARD.md` section 5):
1. Start `games/morant-bay/` from `games/_template/` and wire the checks (`?test=audit`, `held`, `layout`, `cloth`, `walkers`, `skin`, `flow`, `resume`) before the first pull request.
2. A vertical slice first: the Parade and courthouse at 3 to 4 pm on 11 October, Hannah, the crowd, and the chapter 4 cinematic behind its card. Show it to the owner.
3. Recipes in `tools/morant-bay/people/`: Hannah, Mother, Gran, Father, the little brother, Bogle (the photograph), Gordon (the note), market women, villagers, constables, Volunteers, soldiers and marines, Maroons. Stand-ins are listed in the game's doc and marked as work to do (rule 3).
4. The other chapters, the journal ("Dig deeper" carries the Commission's findings), the menu card (`data-year` 1865, `data-age="13"`, `data-warn`), the autoplayer, and the facts check against the sources here.
