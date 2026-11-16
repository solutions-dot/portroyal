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

## Characters, animation and performance

Game-specific `wr_` recipes are in `tools/windrush/people/`, each with an era and colours. Iris has child, young-adult and elder shapes. Children use build upscale 1.26 and runtime scale 0.8. Black skin swatches follow the established range; runtime Skin factor is 1.55. Hair retains its own colour. The fictional white landlord has his own appropriate skin recipe rather than a recolour of a Black figure.

The shared builder and packer are used without modification. Blender 4.3 uses an exporter-option bridge only. Game-only finishing combines standing render surfaces and preserves hidden garment measurements for shared hand clearance. Raw material-separated inspection bodies remain available. Focus copies target 32k total triangles; actual crowd copies target 6,200 and phone copies 3,200. Shared ambient animation updates distant people less often. Scenery and the ship are batched by material, with lazy scene/model loading and a capped phone pixel ratio.

The shared library already supplies IdleM, OldIdle, LookAround, HeadTurn, Nod, Agree and carrying clips. A slow ordinary walk is used for Iris, without treating age as injury. Missing clips from the owner's wishlist are listed in `tools/windrush/animation-plan.md`; no unrelated action is relabelled as sweeping, hammering, hoeing, washing or selling.

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
