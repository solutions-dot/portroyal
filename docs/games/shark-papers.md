# The Shark Papers, 1799 (`games/shark-papers/`)

An all-ages mystery (owner, 22 November 2026: it takes Tivoli's place in the Kids lineup). Facts from a research pass on 22 November 2026.

**Checked at source, 22 November 2026.** Fitton's own account was read at source: "Editor's Portfolio", The United Service Journal and Naval and Military Magazine, 1835, Part 1, February number, pages 276 to 278 (scan and OCR text at https://archive.org/details/in.ernet.dli.2015.21617 ; the passage begins "In the Admiralty Court at Jamaica"). What it says is under "Fitton's own account" below. Edgar K. Thompson, "Tale of the Nancy Brig", The Mariner's Mirror 56:1 (1970), pages 97 to 104 (https://doi.org/10.1080/00253359.1970.10658518) exists, but it is behind a paywall and could **not** be read; nothing in the game rests on it alone. The other facts below were first found in the podcast transcript https://poisonroom.com/transcripts/episode-6-the-shark-papers/ and the sources listed at the end. Frank Cundall's "Historic Jamaica" does not mention the story.

**Status, 22 November 2026 (enrichment pass): built, richer, on the menu.** Four chapters in three places (the deck of the Ferret at sea, the quay at Port Royal, the court room in Kingston), eight bodies of its own (`tools/shark-papers/people`, `sp_`), four camera scenes behind the standard scene card (`scary: false`: dawn off Jacmel, the catch, the boat in the calm, the court decides; see "Camera scenes" below), and hands-on moments on deck (ring the bell, look at the Sparrow through the glass, bait the hook, take the line, lay the Curacao letter out to dry) and on the quay (HMS Abergavenny makes a hoist of flags, the Nancy's sealed hatch, Mr Fitton's box to the boat). No Mature card: `main.js` has no `matureGate` call. Still to do: a hand play on a phone, timing each chapter with a stopwatch (by step count they are about 4 to 6 minutes), and the cloth, skin and walkers checks.

## Timeline

- 3 July 1799: the American brig Nancy, 125 tons, master Thomas Briggs, sails from Baltimore for Curacao.
- She puts in at Aruba. Briggs fetches the supercargo, Christopher Schultze, from Curacao. She sails for Port-au-Prince for coffee, and is damaged in a storm.
- 28 August 1799: HM cutter Sparrow, Lieutenant Hugh Wylie, takes her near Ile-a-Vache without a fight and sends her to Port Royal. (Navy records say 28 July; one source says "going into Jacmel".)
- 30 August 1799, off Jacmel: Michael Fitton, acting lieutenant, commanding the schooner Ferret (tender to HMS Abergavenny), is waiting for Wylie to come to breakfast. Sharks are at a dead bullock. He catches the biggest on a hook and line, with pork as bait. Inside is "a bundle of papers tied round with string". The leaves are dried on deck.
- Breakfast, as Fitton wrote it in 1835 (checked at source, p. 278): Fitton: "The shark you see lying there has brought me full information of your brig, and those papers you see spread out to dry are the papers of your brig Nancy." Wylie: "There's a lie somewhere, Fitton, not far off, for I sealed all her papers up, and gave them in charge of the prize-master, when I sent the brig away." The game uses the first part of each line, word for word, and Wylie's "Breakfast, ho!"
- 9 September: the Advocate-General, George Crawford Ricketts, files the suit for Wylie and his crew.
- 14 September: Briggs and Schultze claim the ship back, on sworn papers. Fitton reaches port the same day.
- 24 September: Fitton swears his affidavit.
- 25 November 1799 (one source says 28 November): the Nancy and her cargo are condemned as a lawful prize.

## People

- **Michael Fitton**, born 1766 in Gawsworth, Cheshire, so about 33; acting lieutenant of the Abergavenny from 11 January 1799; made lieutenant in 1804; died 1852.
- **Hugh Wylie** (also spelt Whylie), lieutenant commanding the Sparrow.
- **Thomas Briggs**, the Nancy's American master. **Christopher Schultze**, her supercargo.
- The judge is not named in any source found.

## Ships

- **Nancy**: American brig, 125 tons. Appearance and crew size not found: the game's brig is a general picture.
- **Sparrow**: cutter, 123 tons, about 66 feet long, 10 carronades and 2 six-pounders, 40 men.
- **Ferret**: schooner, tender to the Abergavenny, "6 3-pounders and 45 men".
- **HMS Abergavenny**: guard ship and flagship at Port Royal, 1796 to 1807.

## The papers

Letters in French and German, receipts, bills and notary papers. One letter, dated at Curacao, began: "The bearer hereof, my good friend Mr. Christopher Schultz, supercargo of the American brig Nancy, will hand you this." (Fitton 1835, p. 277, checked at source.) They showed the cargo belonged to Britain's enemies, not to neutral Americans. The papers Wylie had sealed were the false ones. They are now in the National Library of Jamaica, Kingston (MS 165, "Shark Papers"): https://nlj.gov.jm/exhibition/shark/ . They were in the court archives until 1890, were taken by a looter in the 1907 earthquake, and were returned (Gleaner).

The jaws were sent in with the note "Lieut. Fitton recommends these jaws for a collar for neutrals to swear through". Where they are now could not be confirmed.

## Places (what each is modelled on, and what is still a general picture)

All drawn in code (`src/ships.js` for ships, gear and the shark; `src/places.js` for the places). No plan or picture of the Ferret, the Nancy or the court room is known, so each is built from the numbers in the record and the common practice of the 1790s.

- **The deck of the Ferret.** Hull lines sized for "six 3-pounders and 45 men" (about 61 feet on deck). Two masts with gaff sails set and hanging in the calm, a jib and staysail, a fore topsail yard, shrouds with ratlines and deadeyes, stays and backstays, pin rails and fife rails with coils. The six 3-pounders, three a side, run out at their ports with breechings and tackles, shot racks and rammers. A windlass, belfry and bell, anchors at the cat heads, the boat on chocks with her gripes, the main hatch, pumps, scuttle butt, harness cask, companion, binnacle and tiller lashed amidships. The coast of Saint-Domingue to starboard, the cutter Sparrow in shore (drawn nearer than the six miles Fitton gives, and said so in the journal), fins round a dead bullock far off. General picture: her exact rig and layout.
- **The shark.** A smooth lofted body (`engine/loft.js`) about 3.4 m long with fins and gills. No kind is recorded, so it is a plain large shark; the journal says so. It is caught and opened off screen.
- **The camera scenes** (`FILMS` in `src/content.js`): dawn, the catch, the boat in the calm and the court decides; see "Camera scenes" below.
- **The catch** (camera scene, `FILMS.catch`): the line goes tight, the shark runs on its line ("about 60 fathoms" in Fitton's account), all hands haul, it is hoisted over the side and laid on deck, and the hands stand round it.
- **The quay at Port Royal.** A cut-stone quay with coping, bollards and mooring lines, rope fenders, a gang plank, landing steps with a boat; a capstan, a wooden crane, anchors, spare spars, guns on skids, shot, casks, crates, sacks, a cart and a cable; brick storehouses and the yard wall, in Port Royal's own brick, cut stone, plank and clay tile surfaces (see "Port Royal's surfaces" below). The brig Nancy alongside (two square-rigged masts, a general picture of a merchant brig of about 125 tons) with her sealed main hatch; HMS Abergavenny out in the harbour as a two-decker (general picture); a sheer hulk; Kingston across the water with the Blue Mountains behind; the Palisadoes. General picture: the dockyard's buildings.
- **The Court of Vice-Admiralty, Kingston.** A Georgian room: panelled dado, sash windows with shutters, a raised bench with a canopy and a board of the royal arms, the judge's chair empty (no source names the judge), the clerk's table, a green-baize table for the papers, a bar with a gate, public benches, law books, a clock. The jaws on a stand with Fitton's note in his own words. General picture: the room itself.
- **Officers** (Fitton, Wylie) wear dark blue coats with white facings (lapels and cuffs, from the shared builder's `"facings": true`, see "Clothes pass" below) over white breeches and stockings, and cocked hats of the 1790s. Checked 22 November 2026: Royal Museums Greenwich, research guide U1 (uniforms in the National Maritime Museum collection), says "Lieutenants wore the uniform with white lapels introduced in 1787 until 1812", and that the 1795 undress coat was like the dress coat but without lace on the lapels, pockets and buttonholes (https://www.rmg.co.uk/collections/research-guides/research-guide-u1-uniforms-national-maritime-museum-collection). So plain white lapels with no lace fit an officer at sea in 1799. Still to do: the white edging (piping) and the buttons in their proper rows.

## Fitton's own account (United Service Journal, February 1835, pp. 276 to 278, read at source)

The magazine prints it as a letter from Fitton to the King's proctor, given to the editor by Sir William Burnett, who had it from Fitton. It gives no date. In order:

- The Commander-in-Chief at Jamaica, in 1799, sent Whylie (Fitton's spelling) in the Sparrow cutter to cruise in the Mona Passage with Fitton in the Abergavenny's tender. Fitton remembered "ten 6-pounders in the Sparrow" and "six 3-pounders in the tender".
- Off Jacmel, "the south side of St. Domingo", at dawn, "the Sparrow was about six miles in shore". Fitton asked Wylie to breakfast by signal.
- While Wylie's boat pulled across, Fitton sat on the taffrail. He saw a dead bullock "floating at some distance, which the sharks were tearing", and had it towed alongside; the sharks followed. He chose the biggest.
- He baited the hook with "a 4 lb. piece of beef"; the shark was shy of it. He changed it for pork, "which at length he bolted". "I played with him about 60 fathoms of line": when it was tired he had it hoisted in, and told some of the men to open it and take out the pork. Inside was "a bundle of papers tied round with a string".
- The sailor who handed them over joked that he hoped there was "a letter for me" from "my old sweetheart".
- "The papers were in a perfect state, except the envelope." A letter dated at Curacao began "The bearer hereof, my good friend Mr. Christopher Schultz, supercargo of the American brig Nancy, will hand you this."
- The man at the masthead called: "There's nothing in sight, Sir, but the Sparrow cutter in shore, and her boat pulling on board."
- Wylie came aboard complaining of "a devil of a long pull" with "not a breath of air out of the heavens", and asked if breakfast was ready. He said he had taken a French schooner, a Dutch schooner, and "detained on suspicion an American brig". Then the two lines above. Wylie "stared at me, at the shark, at the papers", went down the cabin ladder calling "Breakfast, ho!", and told Fitton "none of your tricks upon travellers".
- After breakfast the sea breeze came, two strange sail came in sight, and both ships went off in chase. Back at Port Royal Fitton put the papers in the Admiralty Court and sent the jaws with the note "Lieut. Fitton recommends these jaws for a collar for neutrals to swear through." On his return Wylie found the Nancy condemned to him as a prize.
- The magazine's own note (1835): "In the Admiralty Court at Jamaica are still preserved the jaws of a shark" from this case.

Not checked at source: an account printed in 1833 that the master and supercargo left Kingston before the end. The earlier version of the game had it; it is taken out of the journal and Mr Fitton's lines until a source is read.

## The court

The Court of Vice-Admiralty sat in Kingston, at the corner of Harbour and Hanover Streets. Not in Spanish Town, and not in Port Royal. It was a prize case against the ship, not a criminal trial: nobody was "convicted".

Prize law in plain words: in wartime a navy ship could take a ship carrying an enemy's goods, but only a court could say she was a lawful prize. If it did, ship and cargo were sold and the captors shared the money.

## Context

In 1799 Britain was at war with France, the Netherlands and Spain. Curacao was Dutch; Saint-Domingue (now Haiti) was French. Americans were neutral and could trade, but not as cover for an enemy's goods. Port Royal was the navy's base; the court and the merchants were in Kingston. Enslaved people "were also employed as sailors", and shipping work in Kingston and Port Royal was largely done by enslaved and free Black people (Trevor Burnard, "Slaves and Slavery in Kingston, 1770-1815", 2020). In 1788 Kingston had 16,659 enslaved people among 26,478.

## Sources

- Jamaica Gleaner, Pieces of the Past: https://old.jamaica-gleaner.com/pages/history/story0042.htm
- National Library of Jamaica: https://nlj.gov.jm/exhibition/shark/
- Dictionary of National Biography, Fitton: https://en.wikisource.org/wiki/Dictionary_of_National_Biography,_1885-1900/Fitton,_Michael
- O'Byrne, A Naval Biographical Dictionary: https://en.wikisource.org/wiki/A_Naval_Biographical_Dictionary/Fitton,_Michael
- HMS Sparrow (1796): https://en.wikipedia.org/wiki/HMS_Sparrow_(1796)
- Burnard 2020: https://www.cambridge.org/core/journals/international-review-of-social-history/article/slaves-and-slavery-in-kingston-17701815/A7E958558A63A7DC296C3892960B09ED

Could not confirm: the judge's name, the kind of shark, the Nancy's look and crew, the wording of Fitton's affidavit, where the jaws are now.

## In the game

The player is Jem, a fictional ship's boy of twelve on the Ferret. Fictional: Jem, Mr Cato the boatswain, Ben on the quay, the clerk. Real: Michael Fitton and Hugh Wylie, who say their reported words of that morning plus a few imagined everyday lines (their pages say so); Thomas Briggs, who does not speak.

## Checks, 22 November 2026 (enrichment pass)

`?auto=1`: AUTO END 46, FLOW 0, no errors; the only DIALOGUE lines are Fitton's and Wylie's real words. `?test=audit`: 0 in deck, quay and court (faces 0). `?test=ambient`: 0 in every place. `?test=held`: CARRY 0. `?test=layout`: LAYOUT UI 0 at 390x800, 667x375, 800x500 and 1280x720; every place layout 0. `node tools/lint_content.mjs --ci`: shark-papers 0 new. `?test=cloth` was not at 0 in the second pass (small show-through on the new bodies from the shared clothes builder, for example 27 lines on `sp_fitton`, worst 12.8 mm where breeches meet coat); it needs a builder fix in its own PR. `?test=skin` and `?test=walkers` are still to run and record.

Fixed in this pass: the walking walls along the deck (the guns' walls were 1.5 m long and the boat's 1.6 m wide, which closed both gangways; the guns are now run out with a 1.2 m wall and the boat is 1.36 m in the beam), the court's start (it was between two benches), people standing under the rigging or in benches, and small overlaps (bollard ropes, the windlass cable, the bowsprit shrouds, the guns on skids, two casks, a book shelf against the window frames).

### Clothes pass, 22 November 2026 (facings, hats, cloth, skin, walkers)

- **Facings.** The shared builder now gives a 1690-cut coat white lapels and cuffs (`"facings": true`, material `Facings`; `docs/PIPELINE.md` section 5). Fitton and Wylie wear dark blue coats with white facings: a lapel down each side of the front, about 9 cm wide under the collar and narrowing to the waist, with the buttons on top, and a white band round each cuff. Looked at front, three-quarter, side and back, standing and walking. To check against a source: the brief followed the 1787 pattern's white lapels and cuffs; some accounts give lieutenants' undress coats blue lapels edged in white, which would need only the colour or a narrower band.
- **Hats.** Fitton and Wylie keep the game's own cocked hat worn athwart (`cockedHat()` in `ships.js`, set by `{ hat: "cocked" }` in `places.js`), so their bodies are built bareheaded: a hat built into the body cannot be hidden on the joined focus copy, and the two would sit on top of each other. A naval officer's hat of 1799 was worn this way, not as a three-cornered hat. Briggs keeps the round felt hat: in 1799 that was the usual hat for a civilian. The builder's tricorne (`["cocked", "Hat"]`) is there if a man of the 1770s or 1780s is added.
- **`?test=cloth`** (raw bodies). A plain run counts the joined meshes as cloth (226 lines, many false). With `&nojoin`: sp_fitton 5, sp_wylie 6, sp_cato 0, sp_ben 0, sp_clerk 6, sp_briggs 18, sp_seaman 0, sp_seaman2 0 (35 lines). The facings report nothing. What is left and why it stays (not visible in close shots standing or walking): skin 4 to 8 mm into the coat's neck facing at the side of the neck on every 1690-cut coat (under the cravat; the fix would change every older coat, so it waits for its own builder change); breeches 15 to 18 mm through the coat at the back vent on one to three points in a shrug, a laugh or a step (`sp_wylie`, `sp_clerk`, `sp_briggs`); 1 mm of foot inside Briggs's shoes. The "12.8 mm where breeches meet coat" line of the second pass was a joined-mesh line.
- **`?test=skin`**: sp_fitton 210,171,138; sp_wylie 223,187,152; sp_cato 141,98,70; sp_ben 163,113,80; sp_clerk 216,181,149; sp_briggs 214,172,135; sp_seaman 208,166,131; sp_seaman2 153,105,74. Cato and the second seaman read as warm brown.
- **`?test=walkers`**: every body slides under 1 cm a loop (worst sp_seaman 0.9 cm); no lines.
- After the rebuild: `?auto=1` AUTO END 46, FLOW 0; `?test=audit` 0 in deck, quay and court; `?test=ambient` 0; `?test=held` CARRY 0.

## Stark's Jamaica Guide, 1898 (read at source, 22 November 2026)

James H. Stark, *Stark's Jamaica Guide* (1898), pages 60 to 63, "The Shark Papers", "gathered from official documents still preserved in the Institute of Jamaica": https://archive.org/details/starksjamaicagui00star . It prints Fitton's sworn affidavit in full. What it confirms or adds:

- Fitton's affidavit, sworn on 24 September 1799 before J. Fraser, Surrogate, says the tender was "on a cruise off Jacmel in the island of San Domingo, on the thirteenth day of August last" when it found "a dead bullock surrounded by sharks". That date, 13 August, comes before the Sparrow took the Nancy on 28 August, and later accounts give 30 August; the game says only "August 1799" and the journal explains the difference.
- The affidavit: the seamen were ordered "to separate its jaws and clean them, as the said shark was larger than common", and in its maw found "a parcel of papers tied up with a string", with "a letter of a recent date from Curricoa"; Fitton "had them dried on deck".
- The Nancy "was manned by Swedes and Danes, and owned by Germans, naturalized citizens of the United States". On the way to Curacao she "put into Aruba"; Briggs went to Curacao "in a droger, and returned with a German named Schultze, an agent of the owners".
- Taken on "the 28th of August, 1799" by the cutter Sparrow, Hugh Wylie, "near the island of L. Vache, off the south coast of Hayti"; suit brought in the Court of Vice-Admiralty at Kingston on 9 September 1799; condemned on 25 November 1799.
- More papers were found on the Nancy later, hidden in the captain's cabin and in a cask of salt pork.
- In 1898, "In the United Service Museum, London, is the head of the shark which swallowed the papers".

## Camera scenes, 22 November 2026 (from one to four)

The older games have five or six staged moments; this one had only the catch. Three more were added in the same system (`FILMS` in `src/content.js`, played by `src/director.js`, staged by `Q.films` in `src/places.js`), each behind the standard scene card with "Read what happened instead" (`CARDS`, `scary: false`), each a step pair (`film`, then `playing`) in `src/steps.js`, so the autoplayer passes through it. Captions are short; quoted words are Fitton's own (1835), word for word. The shark is still caught and opened off screen.

| Scene | Where in the story | What it shows | Length | Sources |
|---|---|---|---|---|
| `dawn`, "Dawn off Jacmel" | Opens chapter 1 (steps 8 and 9, after the chapter card) | The Ferret becalmed, sails hanging; far off, fins round the dead bullock; a long lens on the cutter Sparrow in shore; Mr Fitton at the taffrail points to her ("Mr Fitton signals to her: come to breakfast!") | 34 s | Fitton 1835: off Jacmel at dawn, the Sparrow "about six miles in shore", breakfast asked by signal, the bullock "which the sharks were tearing" |
| `alongside`, "A boat in the calm" | Chapter 2, after the letter is laid out (steps 24 and 25) | The papers drying on the hatch; the lookout's call, quoted: "...the Sparrow cutter in shore, and her boat pulling on board."; a long lens on the gig rowing across the flat sea; back to the papers ("Breakfast waits below"); the boat lying alongside | 34 s | Fitton 1835: the masthead's call, the papers dried on deck, Wylie's "devil of a long pull" with "not a breath of air", breakfast down the cabin ladder |
| `verdict`, "The court decides" | Chapter 4, after both sets of papers are read (steps 44 and 45) | The court room from the door; both sets of papers on the green table; the clerk (fictional) reads out the decision: "The Nancy and her cargo are a lawful prize."; the empty judge's chair ("Nobody wrote down the judge's name."); the jaws on their stand with Fitton's note, quoted | 40 s | Stark 1898 (condemned 25 November 1799; one source says 28 November, so the caption says only November 1799); Fitton 1835 for the note; no source names the judge, so no judge is shown |

Why the brief changed a little: the boat scene ends with the boat alongside, not with Mr Wylie on deck, because his words on coming aboard are in the talk that follows (they are not said twice). The court scene does not show Thomas Briggs: a later account that he left Kingston before the end has not been read at source.

Also in this pass:
- `src/director.js` has the game's own sounds for scenes: `creak` (`shipCreak`), `gull` (`gullCry`), `oars` (a stroke and its drip), `splash`, `page` (`uiSound("page")`).
- `Q.films.dawn` and `Q.films.verdict` use `filmHold` (`src/places.js`): the people a scene moves leave their everyday life while it runs and go back where they stood after. `Q.films.alongside` moves the Sparrow's gig itself (`GIG.film`), with its plain far-off rowers hidden before the camera comes near.
- The first step of the game is now a scene card, so the title's Begin opens it (`main.js`), and the autoplayer keeps a chapter's opening scene card (`dev.js`). `?shot=film` sets what the player has done before the scene (`chapterState`), so the letter is on the hatch and the papers are open on the table in its pictures.

Pictures looked at (1280x720 and 390x800, with captions shown): dawn at 3, 10, 16, 20, 27 and 32 s; alongside at 2, 11, 16, 21, 26, 31 and 32 s; verdict at 3, 9, 13, 18, 19, 23, 25 and 35 s. Nothing passes through a hull or a wall; on a phone held upright the lens widens (the director's 1.35 times) and the captions sit in the lower black bar with only the faded X on screen (`engine/cine.js`).

## Busy work cut (owner's rule 14, 22 November 2026)

- **Coil the rope** (was step 11): a chore with nothing to learn. Mr Cato now sends Jem straight to the bell. The heap of rope stays by the fore mast.
- **Lay out three sheets one at a time** (step 23): three walks for one idea. The men lay out two; Jem carries the Curacao letter, the one that names the Nancy ("Carry the letter to the hatch to dry."). Fitton's affidavit says only that he "had them dried on deck".
- **Look over the side at the boat** (was step 24): the new camera scene shows the boat coming alongside, so the look said it twice.
- **Look at the brig Nancy** (was step 32): it changed nothing on screen. Its journal page now comes with the look at her sealed hatch, which does show something (the cover drawn back, the rope and the red seal).
- **Look at the shark's jaws** (was step 43): it changed nothing on screen, and the court scene now ends on the jaws and their note. Its journal page comes with the scene.
- The `LOOKS` entries and `Q.reveal` functions for these are left in place (the shared look close-up, `engine/lookshot.js`, is being fitted to every game separately).

## `noAudit` marks and the look audit (22 November 2026)

- Before: 13 marks (places.js 7, world.js 4, ships.js 1, ui.js 1). After: 0. Removed and checked with `?test=audit` (0 in every place): the fishing and hauling lines, the Sparrow's gig and its far rowers, the bullock, the fins, the Nancy's hatch cover, the Abergavenny's flags, the wherry and the candle flame. Three were in code the game never builds (`castle`, `farCastle` and `sinkhole` in `world.js`, left over from another game, with a watcher holding a gun): that code is deleted. The talk marker's mark was not needed: it is added to the scene, not to a place, so the audit never sees it.
- `auditReveals` (`engine/audit-reveal.js`) is wired into `?test=audit` (`src/dev.js`). It found two things, both fixed: the Nancy's hatch cover sat 6 cm over the battens (it now lies on them), and the Abergavenny's flags hung in the air beside her (they now hang on a halyard from the arm of her main topgallant yard).

## Port Royal's surfaces (22 November 2026)

The owner: the buildings' textures did not match Port Royal's. The quay storehouses, the yard wall, the houses behind it and the court room now use Port Royal's own building surfaces (its brick, cut stone, plank, plaster, clay tile and shingle with their normal maps), through `engine/building-tex.js` and `shared/textures/tex_1700.js` (see `docs/ENGINE.md`). The 1799 quay keeps its own buildings, not Port Royal's 1690 town: brick storehouses on a stone plinth with stone quoins, a cornice, round-arched plank doors on strap hinges, stone sills and lintels, tiled hip roofs; a brick yard wall with piers, footing and coping; limewashed houses with tile or shingle roofs. The court room has limewashed plaster walls and a board floor. Still a general picture: no plan or view of the dockyard's buildings of 1799 has been found. Before and after pictures were compared side by side.
