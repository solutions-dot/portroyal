# Windrush: Two Places Called Home

A playable fictional family story between Jamaica and England, 1948 to 2018. Branch: `feat/windrush-family`. This is a PR for independent review, not a request to deploy or merge. Vercel builds must remain disabled for this branch.

## Integration and structure

Based on main `1f962c2`, including the merged Selassie work in PRs #88 and #89. The collection rules and recent PRs were reviewed before integration. Windrush owns its game, recipes and assets and does not import another game's file or character. It uses the established journal, chapter, input and game-world patterns, importing the current shared engine directly. No shared engine, builder, packer or other game's source was changed. All character assets were rebuilt using the current shared builder, including its neckline fix.

All eight chapters are implemented as shared story data, with visible carry/place tasks, unordered counts, only relevant story people marked, and the shared delayed helper arrow. The opening and chapter replay clean up owned items and scenes. Saves, teacher access and audio use `windrush-` keys. Every game page has native Main Menu navigation. The loading bar disappears when ready.

## Family and chapters

Every speaker is fictional. No real passenger or public figure has invented dialogue. The people, choices, addresses and documents do not reproduce a real immigration case.

- Iris, born 1939: nine in 1948, twenty-three in 1962, seventy-nine in 2018. May and Samuel are her parents; Pearl is her aunt.
- In 1962 the viewpoint briefly switches to Naomi, Pearl's twelve-year-old daughter in Jamaica. The change is explicitly introduced.
- In 2018 the player is Maya, born 2006, Iris's granddaughter. Anita is Maya's mother and Iris's daughter. Iris chooses what to share and leads the advice conversation.

1. **Before the suitcase.** Ordinary life in a Kingston yard: washing, a small repair and family stories before any historic spectacle.
2. **What we carry.** Hear both parents' reasons, pack three belongings in either order, leave an address and say goodbye. A short harbour film has pause, sound and read-instead controls.
3. **Across the Atlantic.** Walk the deck, hear a fictional former RAF serviceman, bring water and look at the crossing map. A second film approaches Tilbury.
4. **The other shore.** Carry a case, ask about the train and move toward the station. Tilbury is clearly in Essex, not London.
5. **A room and a start.** A fictional housing refusal is named as racism without reproducing slurs. Celia offers a shared room and practical welcome.
6. **Two places called home.** London, 1962: hospital and garage work, a letter and postal order. Then play a short Jamaica scene helping Pearl and Naomi with a repair and a school book. Migration includes care, skill, contribution, pleasure and attachment to both places.
7. **The letter on the mat.** London, 2018: Iris asks Maya to read a worrying letter and describes being turned away from care. The family gathers records together and seeks support. A calm reading route is available. No detention or removal is enacted and no official demands documents from the player.
8. **A life is more than papers.** Iris speaks for herself with Asha, a fictional adviser. Place the family folder, preserve a photo and choose a journal memory. The family has support but its case remains ongoing. No result or compensation timescale is promised.

There is no immigration quiz, border-scoring system, deportation failure screen or suggestion that missing papers makes someone at fault. Finding records is a requested act of family care, not a way to earn belonging. The later scenes are not personal legal advice.

## Historical checks and sources

The owner's outline informed the subject, with these distinctions preserved in the game:

- The ship's list records arrival on **21 June 1948**; passengers came ashore on **22 June**, commemorated as Windrush Day. The list contains 1,027 names. **539 gave Jamaica as their last country of residence**, a field that is not identical to nationality or birthplace. Sources: [The National Archives](https://www.nationalarchives.gov.uk/explore-the-collection/explore-by-time-period/postwar/postwar-caribbean-migration/) and [Goldsmiths passenger-list project](https://www.gold.ac.uk/windrush/passenger-list/).
- The June voyage preceded the **British Nationality Act's commencement on 1 January 1949**. It is not portrayed as an invitation under a law already in force that June. Jamaican British subjects travelled lawfully; individual later nationality and immigration circumstances varied. The 1971 Act commenced on **1 January 1973**. Source: [Windrush Lessons Learned Review](https://www.gov.uk/government/publications/windrush-lessons-learned-review), read alongside the Archives account.
- The ship's 1948 visit was not the beginning of Black life or all Caribbean migration to Britain. The game makes no claim that everyone on the ship had the same reason, fare or destination. [Archives: Ormonde, Almanzora and Windrush](https://www.nationalarchives.gov.uk/explore-the-collection/stories/ormonde-almanzora-windrush/).
- The vessel is reconstructed as a long white liner with two buff/yellow funnels, dark funnel tops, lifeboats, deck rails, portholes and rigging. Source and visual reference: [Royal Museums Greenwich](https://www.rmg.co.uk/stories/ocean/history-empire-windrush). No archive photograph is embedded in a model or distributed as a texture.
- Housing discrimination and community support are both represented. This family stays with a friend; the Clapham South shelter is contextual journal material, not a universal arrival experience. Pardner/sou-sou and remittances are explained as forms of community and family care. Source: [National Archives teaching resources](https://www.nationalarchives.gov.uk/education/resources/commonwealth-migration-since-1945/).
- London Transport's formal recruitment began in **Barbados in 1956** and expanded to **Jamaica and Trinidad in 1966**. The family's 1948 move is not part of that later campaign. Source: [TfL Corporate Archives research guide](https://content.tfl.gov.uk/research-guide-21-black-asian-and-minority-ethnic-staff.pdf) and [Jamaica Information Service retrospective](https://jis.gov.jm/london-transport-celebrating-caribbean-recruitment-anniversary/).
- The scandal involved people with lawful status being denied work, housing, services or travel, and in some cases detained or removed. The game does not add deportation and detention counts together or make destroyed landing cards the sole cause. The wider institutional failures matter. Sources: [Williams review](https://www.gov.uk/government/publications/windrush-lessons-learned-review) and [National Audit Office investigation](https://www.nao.org.uk/reports/handling-of-the-windrush-situation/).
- Status assistance and compensation are different schemes. Journal links go to [the current Windrush Scheme](https://www.gov.uk/windrush-prove-your-right-to-be-in-the-uk) and [compensation guidance](https://www.gov.uk/apply-windrush-compensation-scheme). These were checked in November 2026. The narrative ends in 2018 and does not pretend that all later cases have been resolved.

Ship, harbour, homes, street, bus, clothing and document props are compressed reconstructions, not surveyed copies. No modern independent Jamaican flag is placed in the 1948 scenes. The letter and postal order are fictional, with no real identifying information.

## Review, 16 November 2026 (branch `claude/windrush-review`)

An independent review of the merged game, with the fixes made on this branch. Read this section first; the older notes below are kept for their sources.

### What the review found

- **People.** Every background person was a copy of a family member (`extraLook`), so May, Samuel and Iris's faces appeared several times in one scene, and the Tilbury porter wore Lionel's face. All seven women's recipes shared one face and one skin colour; Samuel, Lionel and Mr Gray shared another face. Nobody wore a jacket or a hat in 1948, although period photographs of the arrival show suits, ties and felt hats.
- **Animation.** Story people stood on one idle and looked at an arbitrary point; background people stood in a 2 by 2 grid on `watch`. The game shipped 11 clips. There was no check for frozen people, crowds in step, head turns or feet sliding.
- **Places.** The places were open tableaus: Iris's 2018 home, the advice centre and Celia's room were tables outdoors in a street; the Brixton street was an open square; the deck floated lifeboats outside the rail; the quay was a flat slab on still water with no edge. The Jamaica yard was a near copy of the Emperor's Arrival yard (three board houses, picket fence, palms, tables), which the owner rules out (no place is shared between games).
- **Ship and water.** The ship was a low box hull with no waterline, sitting on a flat plane. The water did not move.
- **Camera scenes.** Shots were joined by eased pairs (the camera stopped at every key), the ship never left or arrived, and people did nothing for the camera.
- **Words.** Mr Gray's scene had May reply to a line he never said. "Leon" was a Black porter at Tilbury in 1948, unlikely and also using Lionel's body. The scandal pages lacked the 2018 apology and the Williams review's own finding. The rest of the dialogue met the rules (12 words or fewer, plain words, fictional people labelled).
- **Checks.** `?test=all` skipped faces, budget, autoplay, camera and rule4 (hooks missing).

### What changed

- **Bodies** (`tools/windrush/people/`, built with `BPY_PYTHON=~/venv/bin/python3 MAKEHUMAN=~/mh/makehuman node tools/windrush/build-people.mjs`): 21 background recipes, one per kind of person and place, marked `"crowd": true` (raw body, crowd and phone copies only): Kingston 1948 (`wr_kman48`, `wr_kwoman48` with a head tie, `wr_kelder48`, child bodies `wr_kboy48` and `wr_kgirl48`), travellers 1948 in suits, ties and trilby or felt hats (`wr_tman48a`, `b`, `c`, `wr_twoman48` with a Sunday hat), England 1948 (`wr_porter48`, a railway porter in waistcoat and peaked cap who replaces Leon as Mr Hart, `wr_lman48` in a flat cap and scarf, `wr_lwoman48`), Brixton 1962 (`wr_bman62`, `wr_bwoman62` with a pillbox hat, `wr_conductor62`, `wr_lwoman62`, child `wr_bboy62`), London 2018 (`wr_man18`, `wr_woman18`, `wr_elder18`, `wr_wman18`, child `wr_girl18`), and travel versions of May and Samuel (`wr_may48t`, `wr_sam48t`, same faces). Each family member now has her or his own face targets; Iris keeps one set at 23 and 79, and Anita shares some of them. Skin stays inside rule 9's range, lightened 1.55 in game; Hair stays 1. The unused `wr_iris9` and `wr_maya12` (both players, never seen) and every unused light copy were removed.
- **Clothing sources.** Checked: arrival suits and hats, from the Daily Mirror's 1948 report of "expensive suits" quoted by [Royal Museums Greenwich](https://www.rmg.co.uk/stories/ocean/history-empire-windrush) and the well-known arrival photographs of men in suits, ties and felt hats. **Not yet checked against specific photographs** (general period knowledge, for a specialist to confirm): head ties, working cotton and straw hats in a 1948 Jamaican district, Sunday hats for women travelling, the 1948 railway porter's waistcoat and peaked cap, the London Transport conductor's 1962 uniform colours, and 1960s Brixton dress. The builder cannot yet make coats for women or jackets cut for women, so travelling women wear dresses and hats.
- **Animation.** 38 clips now ship (`games/windrush/anim-clips.json`): working (PickUp at the wash bench, Kneel at the crate, WipeSweat), carrying (BriefcaseIdle and CarryBagWalk with a gripped suitcase or bag, CarryHeadWalk and CarryHeadIdle with a basket on the head), waving at the quay and the rail (Wave, WaveSlow, Clap), chats (Talk1 to Talk3, TalkM1, TalkM2, Nod, Agree, Laugh), sitting (SitIdle, SitIdle2, SitTalk, SitPoseM; women who sit use their raw body so the seated skirt shows), children at play (Run, Cheer), and ListenMusic by the radio. Every story person has a behaviour fitting the moment; talk is seated for people who sit. A new check, `?test=anim` (`games/windrush/src/animcheck.js`, also part of `?test=all`), walks the real frame loop through every place and both camera scenes and fails on a frozen person in view (12 s), three in view in step on one clip, a head turned past 80 degrees, tipped past 60 or turning faster than 320 degrees a second, a walking clip while standing, and moving on a standing clip; in the camera scenes it also fails a camera under the water, inside the ship or a person, or an empty view over 2 s.
- **The ship** (`games/windrush/src/ship.js`): see "The ship" below.
- **Water** (`games/windrush/src/sea.js`): Port Royal's approach copied into this game: a scrolling normal map from summed sines, a 300 m plane of moving vertices (every other frame on phones, normals every 4th or 8th frame), a large flat plane beyond, foam lapping at the quay edge, ships that bob and roll, a wake and bow wave when the ship moves (and on the crossing), gulls at the docks. Colours: Caribbean blue at Kingston, grey-green Thames at Tilbury, Atlantic blue on the crossing. Reduced motion keeps the water still.
- **Places** (`games/windrush/src/places.js`, `scenery.js`): Windrush's own Jamaica home, a country district (a board house raised on posts and stones, a hipped zinc roof, a veranda, breadfruit and ackee trees, a coconut palm and bananas, a dry-stone bank under the hillside, a croton hedge on the road, a standpipe, the district shop and its piazza where two men play dominoes, a country lorry). In 1962 time has passed: the house is painted, electricity poles and wires have come, a radio plays, the trees are taller and it is late afternoon. Kingston and Tilbury have stone quay walls into the water with coping, fenders, ladders, bollards, rails, portal cranes, crates, cases and barrows, a transit shed, the Riverside landing stage with its canopy and the station with its name board and clock, period vehicles, the land and the far shore (the Blue Mountains, Kingston's waterfront, Gravesend's spire), and people waiting, queueing and waving. The deck is the ship's own boat deck, planked, between the funnels and the lifeboats. Brixton is a street of Victorian terraces with bay windows, a bomb site with a hoarding (1948), a K6 telephone box, pillar boxes, lamp posts and plane trees, shops in 1962 (barber, records, cafe, grocer with yams, mangoes and plantains, baker, hardware), Samuel's garage as his workplace, parked cars and a bus with its conductor. Celia's front room, Iris's 2018 house (front room, hall, stairs, kitchen, front garden and gate) and the advice centre are furnished interiors.
- **Housing discrimination** is told as the doc already decided: the card in Mr Gray's window says "ROOM TO LET"; he refuses the family; Samuel names it as racism. No slur or "no Black people" sign is shown. The journal adds that such notices were common and that refusing a home because of race only became unlawful under the Race Relations Act 1968.
- **Camera scenes** (`director.js`, `FILMS` in `content.js`): the camera follows a Catmull-Rom curve through each film's shots, eased at both ends, with a changing lens; the ship leaves her berth and turns out into the harbour (departure) or comes up the Thames and alongside (arrival), with the gangway hidden while she moves and the wake strengthening with speed; May and Samuel wave from the rail while Pearl waves from the quay; a ship's horn, gulls and the opening phrase sound with the scene. Pause, sound and read instead work throughout.
- **Sound**: each place now has its own beds (sea and gulls at the docks, wind and the ship's timbers on deck, birds in the yard, street hum, a quiet room), lowered during talk.
- **Title**: the title scene is the Kingston quay with the ship, drifting slowly. `?shot=title` and `?shot=thumbnail` render the title and the menu card (`menu/windrush-ship.jpg`, from PR #92's approach).
- **Words**: Mr Gray's scene fixed; Mr Hart replaces Leon; Samuel speaks about his garage; Iris says she came on her mother's passport (a situation in many reported cases of people who came as children; to be checked against the Williams review's case studies); the scandal page adds the reporting that brought it to light, children on a parent's passport, the April 2018 apology and resignation, and the review's finding.
- **Checks wired**: faces, budget, autoplay, camera and rule4 hooks in `checktables.js`; `anim` added to `?test=all`; the place audit now includes every background person and every pick-up and put-down spot.

### The ship

HMT Empire Windrush was built in 1930 by Blohm and Voss, Hamburg, as the motor ship Monte Rosa, 152.5 m long, 20.0 m in beam, 8.0 m draught, 14,414 tons after her 1947 refit, with four decks (the [Wikipedia](https://en.wikipedia.org/wiki/HMT_Empire_Windrush) infobox; [Royal Museums Greenwich](https://www.rmg.co.uk/stories/ocean/history-empire-windrush) for her German origin and the 1948 voyage). The model uses those dimensions, a raked stem, a cruiser stern, sheer rising fore and aft, a raised forecastle and poop with well decks, three tiers of superstructure with the bridge forward, two raked funnels close together amidships, a foremast and mainmast with derricks over the hatches, ten lifeboats on davits, two rows of portholes, anchors at the hawse pipes and the name on both bows and the stern (with LONDON as her port).

Livery: the Ministry of Transport troopship scheme, a white hull with a broad blue band at the sheer, buff funnels and red boot-topping, as described for requisitioned and government troopships of the period (Queen's Royal Surreys "Troopships and the Regiment"; Shipping Wonders of the World, "Troopships"). **Not confirmed from a 1948 colour photograph:** whether her funnels had black tops, the exact shade of buff and of the band, and the exact number of lifeboats; the two-funnel profile follows photographs of the Monte-class liners. Treat these as a reconstruction until a specialist checks them.

### Sources added

- Race Relations Act 1968: [The National Archives education resource](https://www.nationalarchives.gov.uk/education/resources/commonwealth-migration-since-1945/race-relations-act-board-1968/).
- Windrush Lessons Learned Review (published 19 March 2020): its findings that the harm was "foreseeable and avoidable" and showed "institutional ignorance and thoughtlessness towards the issue of race and the history of the Windrush generation"; summary reporting checked at [Electronic Immigration Network](https://www.ein.org.uk/news/lessons-learned-review-windrush-scandal-profound-institutional-failure-immigration-hostile).
- The April 2018 apology by the Prime Minister to Caribbean leaders (17 April) and the Home Secretary's resignation (29 April): widely reported at the time (BBC News, The Guardian).
- Ship dimensions and history: [HMT Empire Windrush](https://en.wikipedia.org/wiki/HMT_Empire_Windrush), [Royal Museums Greenwich](https://www.rmg.co.uk/stories/ocean/history-empire-windrush). Troopship livery: [Queen's Royal Surreys, Troopships](https://queensroyalsurreys.org.uk/troopships/ts005.html), [Shipping Wonders of the World, Troopships](https://shippingwondersoftheworld.com/troopships.html).

## Characters, animation and performance (first version)

The notes below describe the first version and are kept for history; the review above replaces them where they differ.

The shared builder and packer are used without modification. Game-only finishing (`finish_person.py`) joins the standing render surfaces into one painted mesh plus the eyes, and preserves hidden garment measurements for shared hand clearance. Raw material-separated inspection bodies remain available. Focus copies target 32k total triangles; crowd copies 6,200 and phone copies 3,200. Missing clips from the owner's wishlist are listed in `tools/windrush/animation-plan.md`; no unrelated action is relabelled as sweeping, hammering, hoeing, washing or selling.

## Review and reproduction

```bash
node tools/build.mjs windrush --dev
python3 -m http.server 8891
# /games/windrush/site/?auto=1
# /games/windrush/site/?test=all
# /games/windrush/site/?test=audit
```

Use Chapters and Teacher unlock to inspect any chapter. Shot views: `yard`, `ship`, `deck`, `poster`, `london`, `work`, `jamaica`, `elder`, `advice`, `people`. Every test uses the actual scene, story, carry, dialogue and save handlers. Results and review limits are recorded below.

Additional fact anchors: the family ages use birth years 1912 (Samuel), 1914 (Pearl), 1916 (May), 1939 (Iris), 1950 (Naomi), 1965 (Anita) and 2006 (Maya), all fictional. The scandal became a national issue in 2017 and 2018; the landing-card destruction was in 2010, and the independent review was published in 2020. The remembered Jamaican hurricane was in 1944. These dates are context, not a claim that one document or one family explains every case.

The quoted fare notation is £28 and 10 shillings, not a decimal £28.10. It is contextual, not the family’s itemised ticket price. Source: [Windrush Monument education resources](https://www.gov.uk/guidance/windrush-monument-education-resources). Hurricane context: [JIS history of hurricanes](https://www.jis.gov.jm/media/2021/05/History-of-Hurricanes-and-Floods-in-Jamaica.pdf).

Iris’s refused care and demand for documents are fictional events illustrating documented harms, not a portrait of a named survivor. Source: the Williams review and the National Audit Office investigation listed above. The player helps her seek support; the game does not present obtaining papers as a cure for the injustice.

## Verification, 16 November 2026

The results are in [windrush-qa.json](windrush-qa.json). The public collection build succeeds for all ten games. A browser checks all ten menu destinations, loads Windrush with development hooks removed, follows its native Main Menu link back, and checks the phone menu for horizontal overflow.

- Shared gameplay, journal, links, accessibility, keyboard, chapters, steps, map, sound wiring, continuity and error runner: **ALL 0**.
- All nine places: **0 placement and reachability findings**. Each ambient scene also completes its one-minute simulation with 0 findings.
- All 15 raw character bodies: **0 clothing findings** across the shared pose and walk-stride checks; all 15 walks have 0 findings. The slow guide uses 0.85 m/s. The raw-body maximum shoe penetration measured 2.83 cm, within the shared check's tolerance. Full and joined render versions remain available for visual review.
- Full autoplayer reaches stage **85**, the ending, with no failures.
- Browser interaction suite passes real E/Space, dialogue completion/cancellation and animation, arbitrary-order packing, held-item and completed-item reloads, posted sheets, replay cleanup, Iris's walking route and reload, cinema pause/sound/read controls, the calm reading path, teacher access and touch movement/look. A separate check confirms that carrying an item directs the helper to its destination.
- UI layout: 0 findings at **320x568, 360x640, 390x800, 414x706, 667x375, 800x500 and 1280x720**, with reachable title controls and no horizontal overflow.
- Representative desktop views stay at or below **69 draws / 117,415 triangles**; phone views at or below **52 draws / 89,258 triangles**. These are renderer counts in Chromium with SwiftShader, not a claim about physical phone frame rates.
- Windrush content lint: **0**. Repository regression tests: **54 pass**. The full repository command still exits nonzero for **four existing Tivoli content findings**: one long line and three missing fictional-speaker declarations. This PR does not change Tivoli or its lint baseline.

## Visual review and remaining work

[Opening](windrush-title.jpg), [harbour](windrush-harbour.jpg), [deck](windrush-deck.jpg), [London](windrush-london.jpg), [elder Iris](windrush-iris.jpg), [phone dialogue](windrush-phone-dialogue.png), [phone journal](windrush-phone-journal.png), [phone chapter card](windrush-phone-card.png).

This is a first playable version for independent review. The places are compressed outdoor tableaus; furnished interiors, denser lived-in scenery, and a specialist/community review of the family treatment remain useful next work. The ship and clothes are stylised reconstructions, not exact archival models. Dedicated sweeping, hammering, hoeing, washing, selling, child skipping and additional natural idle clips remain asset work, as listed in the animation plan. No unrelated clip is presented as one of those actions.

The menu thumbnail uses `menu/windrush-ship.jpg`, captured from the game with `?shot=thumbnail` at 1600x900. Its separate image area keeps the ship above the words, including 320px-wide phones; the Windrush card has extra height on phones to preserve room for both. The new filename also avoids reusing an older cached poster.
