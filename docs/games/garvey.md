# Marcus Garvey: the game plan

Agreed design for the second game. Read `CLAUDE.md` and `docs/NEW_GAME.md` first. This file is the story, the systems and the research rules. Port Royal's guide is `docs/games/port-royal.md`.

Status: all eight chapters are playable from the game menu (the "New" card). Code is in `games/garvey/`. Each chapter is a first slice: one place, one or two hands-on activities and one or two remembered choices.

## Where things are now

- **Demo scene** (`games/garvey/src/main.js`): a Kingston print shop, about 1907. A fictional printer stands at his type stand and a fictional customer walks through the shop. Both talk (placeholder lines). After you talk to both, you set the type for a notice at the type stand (letters are mirror images, as on real type), press it, and three journal pages open. It is the first slice of chapter 1.
- **Characters**: 21 bodies, recipes in `tools/garvey/people/`, built by `tools/garvey/era.py` (setup in `tools/garvey/README.md`) and packed into `games/garvey/site/models/`. Every recipe sets `era`, a `collar` kind and `hat` as a list (16 November 2026; the values build the same bodies as before, so nothing was rebuilt). People in the game follow `docs/PEOPLE.md`; this game's gaps against that standard are in `docs/STANDARD.md` ("Where each game stands"). In the game only the Skin material is multiplied, by `SKIN_K` (owner rule 9; it was 1.2). It is now 1.9, above Kendal's 1.55, because these rooms are softly lit, and Garvey's two bodies 1.65 times and the nurse 1.18 and hl_worker 1.08 times lighter again; the rooms' sky light is 1.6 (it was 1.25).
- **Real people never speak** (owner rule 3). Marcus Garvey, Amy Ashwood and Amy Jacques Garvey are in their scenes, but every line in their talks is told by the story (`NAR`, shown with no name, in italics) or said by a fictional person, so no words are made up for them. Their journal pages say so. The only real words in the game are printed ones: item 39 of the Declaration.
- **Life** (`games/garvey/src/life.js`, on `engine/ambient.js`): every person in every place does something fitting the stage: printers pick type and work the press, listeners watch the speaker and nod or clap, Garvey speaks (the `Speech` clip) when the story says he does, neighbours and delegates sit and talk in turn, a customer browses, passers-by stroll; heads turn toward you or the speaker. Each place also has a few background people (`EXTRAS`: an apprentice, early members, passers-by, a compositor, dock workers, seated delegates, a typist, a park visitor), other chapters' bodies of the same years, recoloured. The game takes a person back while you talk to them. The Black Cross nurse wears the white cap with the black cross on red (`nurseCap`).
- **Hung things**: hats on the wall racks hang with the peg inside the crown, tipped a little, the brim close to the board; the office hat stand's hat sits on its pole (owner, 16 November 2026: hats floated beside the rack). `?test=audit` reports any hat or coat (`userData.hung`) that touches no peg (`userData.peg`).
- **Camera**: in a talk the view turns gently to the person; each chapter opens with a short establishing move; behind the title the place is alive and the view drifts slowly.
- **Menu**: the Garvey block links to the game.
- **One pull request**: all Garvey work goes into one PR that stays open, so there is a single merge to `main` when the owner is ready.

Test it:

```bash
node tools/build.mjs garvey --dev          # dev build: test views and the scripted playthrough
python3 -m http.server 8765                # then open http://localhost:8765/games/garvey/site/
# ?shot=shop1 ... shop7, talk, strike, type, typedone, journal, chapters, reset, credits, bubble, nudge, hall1 ... hall4, hallchat, hallseat, hallseat2, hallseat3, hallamy, hallwalk (add &t=seconds), street1, street2, streetchat and the press views are views;
# ?test=walk steps the customer's route; ?auto=1 plays chapter 1 and opens every menu; ?auto=2 plays chapter 2; ?auto=3 checks old saves and replayed choices; ?auto=4 plays chapter 3; ?auto=5 plays chapter 4 (press1 to press3, pagebuild, pagedone, pressback and presschat are its views); ?auto=6 plays chapter 5 (dock1 to dock3, inspect and dockchat are its views); ?auto=7 plays chapter 6 (lib1 to lib3, decl, decldone and libchat are its views); ?auto=8 plays chapter 7 (off1, off2, sort, sortdone, letter and offchat are its views); ?auto=9 plays chapter 8 (park1, park2, time, timedone, answer, journey and parkchat are its views).
# The result of ?test=walk and ?auto=1 is written to the page title.
# Checks (games/garvey/src/dev.js): ?test=all (the shared runner, with this game's anim check), audit (also seating), held, layout, walkers, ambient, anim,
# plus cloth (&b=garvey1914 picks bodies), skin and overlap (also collision: people against furniture) in main.js. &p=hall,street picks places.
```

### Navigation and menus: the same as Port Royal

Players who know Port Royal should find everything where they expect it. The page (`games/garvey/site/index.html`) is built from Port Royal's, so the styles match.

- **Title screen**: Start (or Continue), Chapters, Main Menu, the loading bar, and "Your progress is saved on this device" when there is a saved game. The title controls use `shared/title.css`.
- **In the game**: reset, sound and Journal (with a count) at the top right; a Goal tab that folds after a few seconds; a controls hint; a glowing speech mark over each person and a bubble on the nearest; a resting joystick on phones.
- **Journal**: a paper book with tabs and "Dig deeper". Its footer has **Main Menu** and **Chapters**.
- **Chapters**: all eight chapters are listed and playable. Each opens when the one before it is done. The panel also has Credits and "Start again".
- **Next chapter**: when a chapter's last goal is reached, a card appears with "Next chapter" and "Stay here" (`CHAPTER_END` and `nextCard` in `main.js`), so players do not have to open Chapters. The last chapter shows its own end card.
- **Seating in the meeting hall.** The three neighbours walk down the aisle and the gap between the rows, then sit on the benches facing the platform (the bench backs are on the door side). Seated people stay seated while you talk to them (`sitDown`, `SitIdle`, `SitTalk`).
- **The helper arrow** points straight at the goal. That is safe here because every place is one open room or street with no dividing walls. If a place gets an inner wall, route the arrow around it as Port Royal's `nudgeStep` does.
- **Sharp textures.** Every texture is drawn on a canvas `TEXQ` times bigger than its drawing coordinates (2 on a computer, 1.5 on a phone, 1 on a device with little memory), shared where it repeats (`memo`), and boxes scale their texture coordinates to their size so wood grain keeps one size on every face. Dev check: `?test=overlap` also logs how long textures took to draw.
- **Details.** `details` in `main.js` adds small things to each place when it is built (plants, clocks, coat pegs, lamps, a stove, barrels, a crane, trees, a flag of today's Jamaica in the park). Anything solid in a walkway needs a rectangle in that place's walls list. `?test=overlap` checks every person's spot and route against those rectangles (seated people and people on platforms are expected to show).
- **Loading.** The animation file is cut down to the 7 clips the game plays (`games/garvey/anim-clips.json`; add a name there before using a new clip, or the clip will be missing). Each place's people load the first time you enter it. A few seconds after you arrive somewhere, `prefetchNext` quietly fetches the next chapter's people (`PLACE_ORDER`), so the next place opens quickly. The two shop people are loaded the same way (`ensureShop`): a saved game past chapter 1 (stage 10 or more) starts straight in its own place and never downloads them, unless the player replays chapter 1 from the Journal, which loads them first (with a "Loading the print shop" note). A new player still loads them at start, in parallel with the animations.
- **Speech marks and bubbles** sit just above each person's head or hat. The height is measured from the loaded model (`headTop`), so tall hats and short people both look right.
- **Menu card**: a poster like Port Royal's, from `menu/garvey.jpg`. To remake it, build with `--dev`, serve the repo and render `games/garvey/site/index.html?shot=poster` at 1280 by 720 with the HUD hidden (the view hides marks and freezes the pose).
- **Reset**: a card with "Restart this chapter", "Start the whole story again" (asks twice) and **Main Menu**.
- **Main Menu** (a button, like Chapters; it used to be an "All games" link) is therefore reachable from the title, the Journal and the Reset card. It is always available on the website, without a fetch or a check for the platform name.
- **Saving**: the Journal, the goal and who you have talked to are kept in the browser (`garvey-save-v1`).
- **Keys**: Escape closes any panel; Space, Enter or E uses the nearest thing.

### The story is a number

`stage` (saved) says where you are; `best` is the furthest you have ever got, so chapters stay open when you replay one. Chapter 1: 0 talk to the printer and the customer, 1 set the type, 2 the strike, 3 done. Chapter 2: 10 meet Amy and Garvey, 11 print the poster, 12 welcome the neighbours, 13 listen to Garvey, 14 done. Chapter 3: 20 listen to the worker, the woman and the older man, 21 talk to Garvey (choose his words), 22 answer the older man's question, 23 done. Chapter 4: 30 talk to the pressman and Garvey (choose the headline), 31 lay out the front page, 32 talk to the sailor (choose how the bundles travel), 33 weeks later: talk to the sailor and the pressman, 34 done. Chapter 5: 40 meet Garvey, the share clerk and the engineer, 41 look the old ship over, 42 talk to Garvey (advise: buy now or save), 43 talk to your friend (advise her), 44 done. Chapter 6: 50 welcome the nurse, the traveller and the messenger, 51 talk to the steward (choose who he helps first), 52 read the Declaration and colour the banner, 53 talk to Garvey, 54 done. Chapter 7: 60 talk to Amy Jacques Garvey, 61 sort the news cards (fact or rumour), 62 talk to Amy (choose the fair question), 63 read your friend's letter and write back, 64 done. Chapter 8: 70 talk to the park guide and the student, 71 put the later events in order at the timeline board, 72 talk to the student (the big question), 73 answer at the shrine in your own words, 74 done (the end card and the "Your journey" journal page, which lists every choice you made). A person gives their full conversation only when `TALK_TARGETS[stage]` names them; otherwise they say a short later line. `story` records choices (`strike`, `poster`) and is saved too. Each place (`PLACES`: the print shop, the hall) has its own walls, bounds, people and things to do. Chapter 2's characters load only when it starts.

To add a chapter: add its row to `CHAPTERS` in `games/garvey/src/main.js` (set `ready`, `go` and `done`), add its goals to `GOALS`, `TALK_TARGETS` and `NEXT_AFTER_TALK`, its journal pages to `JOURNAL`, a place to `PLACES`, and a test to `devViews()`. Port Royal's `NUDGE` helper arrow is copied; its third-person view is not.

### What is left (polish list)

All eight chapters are built, so what remains is quality work, roughly in this order:

1. **Read every line aloud** for the 6+ reading level. `node tools/lint_content.mjs --game garvey` reports 0 (16 November 2026): no line over 12 words, every goal one sentence, and no real person speaks.
2. **Check facts against primary sources.** Every date and claim comes from secondary sources (see the research tables). Check the Marcus Garvey and UNIA Papers, then remove the "we still need to check" notes from the journal pages.
3. **Check places against photographs.** The shrine was checked against a photograph on 16 November 2026 (see "The shrine against a photograph"). The Kingston shops and hall are still built from US printing-office photographs and general knowledge; Harlem, Liberty Hall and the dock are general pictures, not copies of real places.
4. **Characters.** Rebuilt in November 2026 with the clothes builder (`docs/PIPELINE.md`, section 5; rules in `docs/PEOPLE.md`). Marcus Garvey's face, hair and moustache follow a photograph the owner supplied; checked in game light on 16 November 2026 beside the Library of Congress photograph of 1924 (`?shot=face&id=garvey`): he reads clearly in every light now that Skin is drawn lighter. His face was then matched to the 1920 and 1924 photographs (see "Marcus Garvey's face against public-domain photographs"). The Black Cross nurse has the white cap with its badge. Still to do: the UNIA Legion uniform (the steward wears a waistcoat and tie), women's hats, and more varied faces (the background people reuse other chapters' bodies, recoloured). `?test=cloth`: 2 lines (14 November: 7; see `docs/STANDARD.md`).
5. **Sound.** Each place now has its own mix of the engine's beds and one small sound (press thump in the shop and press room, gulls and ship creaks at the dock, birds in the park), set in `SOUNDSCAPE`. Still to do: footsteps that change by floor, and a short music cue at the end of each chapter.
6. **Third-person view** (V key) and a teen body for the hero.
7. **Window views.** Most rooms show the same leafy yard through the windows.
8. **Menu and phone checks** after any change: `?test=all`, the autoplayers and one phone screenshot per chapter.

## Checks (16 November 2026)

All in the dev build (`node tools/build.mjs garvey --dev`), run headless at the sizes shown. `games/garvey/src/dev.js` holds the new ones.

| Check | Result | Notes |
|---|---|---|
| `node tools/lint_content.mjs --game garvey` | 0 | was 26 (long lines, two-sentence goals, two facts, three real people speaking) |
| `?test=audit` (every place, at its busiest stage) | 0 in all eight places | floating lamps and a drying line given cords and hooks; a paper stack, a clock, a news stand and a handcart that cut into other things moved; the customer's loop and the messenger kept off the player's start |
| `?test=ambient` (a minute per place, walking through) | 0 in all eight places | |
| `?test=anim` (this game's own: frozen poses in view, people in step, heads past a neck's turn or snapping, walk clips while still, sliding) | 0 (all eight places, plus the hall arrivals at stage 12) | |
| `?test=walkers` | 0. The older man (nb_elder) slid 13.6 cm a loop on Walk at any speed: the engine's stride estimate (strideOf) is about 9 % short for his bent, short-legged walk, so his clip is now played 9 % faster for the same ground speed (`PACE_K` in main.js), 1.1 cm a loop. The other walkers 0 to 3.5 cm. Ambient men walk Walk, not WalkM, which slid about 30 cm a loop at their pace (reported for the engine) | |
| `?test=held` | 0 | nobody carries anything yet |
| `?test=layout` at 390x800, 667x375, 800x500, 1280x720 | 0 at all four sizes | journal notes wait until a dialogue closes; the goal, hint and toast hide during a talk or a card; on short screens the place name sits lower and the top buttons hide during a talk |
| `?test=cloth` | 2 lines | clerk1919's fingers 4.6 mm into the trousers in Idle, nb_youth 0.6 mm of skin at the shirt when talking: both too small to see in close shots |
| `?test=skin` | every face reads: indoor means 101 to 125 red, outdoor 127 to 157 | Skin is drawn at 1.9 (Garvey's two bodies 1.65 times that again, the nurse 1.18, the street worker 1.08: his heavy brow and moustache shade his face); the rooms' sky light is 1.6 |
| `?test=all` (390x800) | 0 to 1 | every check 0 on the last runs except, in one run, a camera spot by the dock clerk that lay inside a park wall: engine/checks.js judges every camera sample against the walls of the place it ends in (reported for the engine) |

## Decisions (agreed with the owner)

| Question | Decision |
|---|---|
| Who do you play? | A fictional Jamaican apprentice printer who grows up with the movement. Real people (Garvey, the two Amys) are met, never played. |
| Age | Same as every game here: 6 and up, plus adults. Plain words on the main path. Prison, the trial and other contested points go in "Dig deeper". |
| Voice | Text only. The engine has no audio files. Voice may be added later for a few key lines. |
| Meters | No numbers on screen. Choices show up as what you see (who is in the hall, who stands with you) and what people say on later visits. |
| Episode 7 | Played from Amy Jacques Garvey's desk, not from the courtroom. |

Still open: the hero's name and look, and the game's title (the concept PDF says "Garvey: The Rise of a Movement"; the menu card says "Marcus Garvey").

## The story in one paragraph

A fictional apprentice in a Kingston print shop sees what words can do. The apprentice follows Marcus Garvey and the UNIA from Kingston to Harlem, helps print the *Negro World*, sees the Black Star Line dream meet hard reality, and keeps the work going when Garvey is in prison. The last chapter jumps to Jamaica today, where a child asks: the world has changed, but has the dream been fulfilled?

Dramatic question: how much are you willing to risk to change the world?

## The hero

- Fictional. The journal page says so (owner rule 3).
- Grows with the story: about 14 in 1907, 21 in 1914, 27 in 1920, 34 in 1927. In chapter 8 the "you" is a present-day Jamaican child.
- Always first person. A third-person view (V key) needs two body sizes, a teen and a young adult.
- The hero's work is the print shop: apprentice, printer, pressman at the *Negro World*, helper at Amy Jacques Garvey's desk.

## Chapters

Branches rejoin at the end of each chapter, so every chapter has one `done()` test and the autoplayer can follow it.

| # | Where and when | Walk and do | Remembered choice |
|---|---|---|---|
| 1 | Kingston print shop, about 1908 | Meet the printer and a customer, set type (the letters are mirror images), then hear about the printers' strike and choose what you would do | Speak up now, wait and listen, or ask the others (built) |
| 2 | A meeting hall in Kingston, July 1914 | Meet Amy Ashwood and Marcus Garvey, choose the poster word (Learn, Work or Unity), print it, welcome three neighbours who arrive, hear Garvey's speech (built) | The poster word: the neighbours' lines change |
| 3 | Harlem street, 1916 | Listen to a worker, a woman from Jamaica and an older man, help Garvey choose what to speak about (Fair work, Good schools, or Pride), then answer the older man's question about trust (built) | The theme of the speech, and how you answer the older man |
| 4 | Harlem press room, 1918 | Choose the big headline with Garvey, lay out the front page at the stone table (tap each piece into its box), then choose how a sailor carries the bundles, and hear weeks later what happened and about the ban (built) | The headline, and the bundles: take every one, share them out, or take only a few |
| 5 | A dock in New York, 1919 | Meet Garvey, a share clerk and an engineer, look the old ship over (hull, engine, deck), advise Garvey to buy now or save for a better ship (he buys the old one anyway, as happened), then advise a friend who wants to buy shares (built) | Your advice to Garvey and to your friend. Neither changes what really happened. |
| 6 | Liberty Hall, Harlem, August 1920 ("The great convention") | Welcome three visitors (a Black Cross nurse, a traveller, a messenger), choose who the steward helps first, read item 39 of the Declaration in its real words and colour a banner red, black and green in the order the line gives (built) | Who the steward helps first: the people's later lines and Garvey's closing line change |
| 7 | Amy Jacques Garvey's desk, Harlem, 1925 ("The price of a dream") | Talk to Amy, sort four news cards into fact or rumour, choose the fair question to ask before printing a rumour, then read the letter from your friend in chapter 5 (it changes with your advice there) and write back (built) | The question you ask, and how you write back to your friend |
| 8 | National Heroes Park, Kingston, today ("The question that remains") | A guide tells his later life (1927 home, 1929 party, 1935 London, 1940 death, 1964 remains home, 1969 National Hero), put six events in order on the timeline board, then answer a student's question "has the dream come true?" by choosing how to start and why. The Journal then gets a "Your journey" page listing all your choices (built) | The final answer. Dropped: the world map idea, and the 1927 to 1940 scenes (the guide tells them instead). |

Rule of truth: big events stay as they happened. Your choices change who you protected, what you learned and what friends say later. The Black Star Line fails whichever plan you pick. Every chapter ends with a "History / Story" journal page saying what really happened and what was fictional.

## New systems

Port Royal's conversation, journal, chapter and save systems are copied into `games/garvey/src/` first (see "Working alongside the Port Royal chat"). New:

1. **Remembered choices.** `state.ch.choice` flags. People read them in their later-visit lines (the `npcTalk` pattern). People you helped appear in the next scene.
2. **Listen, then speak** (chapters 2 and 3). Talk to 3 people, learn what each needs, then pick words. Who agrees with you shows in the crowd.
3. **Page builder** (chapters 1, 2, 4, 6). Tap or drag headlines, pictures and notices into the right places. One activity, reused with new content.
4. **Fact or rumour cards** (chapter 7). Sort short cards, then choose a fair question to ask.
5. **Coins** (chapter 5 only). A small purse for the ship plans.
6. **World map** (chapter 8). Connect ideas to places.

## Research rules

- Check every fact against a source before writing it. Note the source in the journal page or the commit.
- **Real people never speak in the game** (owner rule 3, 16 November 2026). Their scenes are told by the story or by fictional people. If a real quotation is ever used, it must be traced to the Marcus Garvey and UNIA Papers or to his published writings, shown as printed or quoted words with the source in the journal, and never put in a speech line. Many quotes online credited to him cannot be traced, so do not use them.
- The two Amys appear as people with their own work.
- Sources to start from: the Marcus Garvey and UNIA Papers (UCLA), the US National Archives, the New York Public Library's UNIA collection, PBS American Experience, the Library of Congress picture collection, the National Library of Jamaica. Public-domain photographs are reference only, never textures.
- The red, black and green flag must not appear before August 1920.

### Marcus Garvey's face against public-domain photographs (16 November 2026)

The owner asked for his face to match photographs as closely as the builder allows. References (both public domain, Library of Congress): the Keystone View Company portrait, about 1920 (digital ID ds.17264, nearly front on), and the desk photograph of 5 August 1924 (George Grantham Bain Collection, LC-USZ61-1854, three-quarter). `garvey1914.json` and `garvey1916.json` were changed in five rounds, each rebuilt, packed and rendered in the game's own light beside the photograph at the same angle (`?shot=face&id=garvey&st=10&d=0.42&a=0.12`, and `&d=0.45&a=-0.45`):

- moustache much thinner and narrower (0.022 to 0.007 thick, width 1.45 to 1.05, less droop), as in both photographs;
- hairline rounded, with only slight bays at the temples, fuller dark hair over the crown, a taller forehead (it was low and pointed);
- a rounder, wider upper head and cheekbones, less heavy jowls and double chin;
- a wider, flatter and shorter nose with wider nostrils; fuller, wider lips; heavier lower lids.

What still differs, honestly: the builder's face is smoother and younger than a photograph, the nose bridge still shows more than his, his eyes read smaller and less hooded, and the skin is drawn lighter than the black-and-white photographs suggest (owner rule 9 keeps it inside the range and lightened). It reads as the same broad, round-faced man with a neat moustache, not as a portrait. The bust at the shrine is cast from `garvey1914`, so it changed with him. Neither body is shipped by any other game.

### Marcus Garvey's real words in the game (owner, 16 November 2026)

Marcus Garvey says only these words, exactly, in quotation marks (lines marked `sourced: true`; `tools/lint_content.mjs` checks that each is written here word for word). Nothing is paraphrased or added. Amy Ashwood and Amy Jacques Garvey still have no words: no sourced lines that fit their scenes were found.

| Words in the game | Where and when | Source |
|---|---|---|
| If anything praiseworthy is to be done, | New York, July 1921: his gramophone record "Explanation of the Objects of the Universal Negro Improvement Association" (the full sentence: "If anything praiseworthy is to be done, it must be done through unity, and it is for that reason that the Universal Negro Improvement Association calls upon every Negro in the United States to rally to this standard.") | Transcript by the Marcus Garvey and UNIA Papers Project, UCLA, via History Matters (historymatters.gmu.edu/d/5124) and The American Yawp Reader; the recording is listed in the UCLA project's Sound Library |
| it must be done through unity | the same sentence, shown in a second box | the same |
| what other men have done, Negroes can do. | the same record ("... then you must acknowledge that what other men have done, Negroes can do.") | the same |
| none but ourselves can free the mind. | Menelik Hall, Sydney, Nova Scotia, October 1937 (quoted by the fictional guide in chapter 8). Reports give the whole sentence slightly differently ("whilst others might free the body, none but ourselves can free the mind"); only the part every report shares is used | The Canadian Encyclopedia, "Black Pride: from Garvey to Marley"; Jamaica Gleaner, "The Marcus Garvey Story, part IV", 7 October 2023 |

In chapter 7 the record plays on a gramophone at Amy Jacques Garvey's desk in 1925, four years after it was made, so no words come before the date he said them. Checked and not used: "Up, you mighty race, you can accomplish what you will" (often linked to the 1921 record, but no transcript with that wording was found), "A people without the knowledge of their past history, origin and culture is like a tree without roots" (not reliably sourced), "One God! One Aim! One Destiny!" (the UNIA motto, but the year it was adopted was not found).

### Checked in a first research pass (13 Nov 2026)

| Fact | Status |
|---|---|
| Born 17 August 1887, died 10 June 1940 | Matches the US National Archives page title |
| The *Negro World* was banned in several territories and carried by Black seamen | Confirmed by several sources |
| Peak circulation | Sources vary; about 200,000 is the common figure. Say "many thousands" unless the Papers say more. |
| The Declaration of the Rights of the Negro Peoples of the World, dated 13 August 1920, has 54 articles. Article 39 *named* red, black and green as the colours of the Black race (it does not describe a flag being raised). | Corrected in the third pass. The convention ran 1 to 31 August 1920. Its sessions were at Liberty Hall; one mass meeting at Madison Square Garden is given as about 25,000 people (sources vary, so avoid a number). |
| Convicted of mail fraud in June 1923, five years | Confirmed. The exact day differs (18 or 21 June), so say "June 1923". |
| Sentence commuted 18 November 1927, then deported | Confirmed. The deportation day is still to check. |
| Mail fraud case was about advertising stock in a ship the line did not yet own (the *Orion*) | One source. Check before use. |
| Black Star Line ships *Yarmouth*, *Shadyside*, *Kanawha* were old and in poor condition; Garvey and three others were indicted in 1922 | Confirmed. The $5 share price is in the third pass below. |
| Joshua Cockburn was the line's first captain | Confirmed |
| Amy Ashwood worked with Garvey in the first UNIA years; some historians doubt "co-founder" | Say "helped build" on the main path, the debate in "Dig deeper" |
| Amy Jacques Garvey: associate editor of the *Negro World* 1924 to 1927, the page "Our Women and What They Think", *Philosophy and Opinions* (1923, 1925) | Confirmed |
| Printers' strike, Kingston | 1907 or 1908, sources differ. Garvey was a master printer and foreman at P.A. Benjamin, was fired after the strike, blacklisted, then worked at the Government Printing Office. |
| Costa Rica (timekeeper for the United Fruit Company, wrote in *La Nación*), then Panama (*La Prensa*) | Dates between 1909 and 1911, sources differ |
| London 1912 to 1914, Birkbeck College, the *African Times and Orient Review* (Duse Mohamed Ali) | Confirmed. Some sources say 1911. |

### Second research pass (13 Nov 2026): secondary sources only

The Marcus Garvey and UNIA Papers (UCLA) and Robert Hill's volumes could not be reached, so none of this is checked against the primary chronology. Treat dates as "most sources say".

| Fact | Status |
|---|---|
| Apprenticed in St Ann's Bay to his godfather Alfred Burrowes, a printer, about 1900; left school at 14 | Confirmed (JIS, PBS, Gleaner) |
| Moved to Kingston in 1905 or 1906 | Sources differ |
| Worked at the printing division of P.A. Benjamin Manufacturing Co.: compositor, then foreman | Confirmed. "First Afro-Jamaican foreman" is one source only: not used. |
| Printers' Union (founded 1906 or 1907); Garvey was vice-president of its compositors' section | Confirmed |
| The strike: late 1908 (Robert Hill's chronology, via Wikipedia) or 1907 (the Gleaner, older encyclopedias) | Disputed, leaning late 1908. The game says "about 1908". |
| Why they struck: "better working conditions" (Gleaner). Wages or hours were not found. | One source. The game says only "better working conditions". |
| How it ended: broken after some weeks, the union ended, Garvey was sacked and private firms would not hire him | Confirmed. He worked "briefly" at the government printery (the name "Government Printing Office" is Gleaner only; the timing is disputed). |
| Sailed from Southampton on 17 June 1914; reached Jamaica in July (7, 14 or 15 July, sources differ) | The game says "July 1914" |
| The UNIA was founded on 20 July 1914 in Kingston | Confirmed (PBS, JIS, Hill). Where it met, and the "1 August, Emancipation Day" launch, are disputed: the game names no hall. |
| Amy Ashwood: "one of the first members and an early secretary"; the co-founder claim is doubted by some (Tony Martin) | Used as written |
| Early aims: a fraternal, charitable, non-political club for race pride and uplift, plus a trade school like Tuskegee. The exact 1914 wording was not found. | The game says "help people in need, build pride, open a trade school" |
| Motto "One God! One Aim! One Destiny!" | Confirmed. Not used yet. |
| Wrote to Booker T. Washington in Sept 1914; Washington died in Nov 1915; Garvey sailed for the US on 6 March 1916 | Confirmed (PBS timeline) |
| Electric trams in Kingston from 31 March 1899 (to 1948); gas street lamps from 1877 | Confirmed. Not shown yet. |
| The Kingston earthquake of 14 January 1907 (about 3:30 pm): 800 to 1,000 dead, fires, most buildings south of the Parade destroyed | Confirmed. Wikipedia's "85% destroyed" misreads the eyewitness account: not used. |
| Equipment of a Jamaican print shop, and of P.A. Benjamin's printing department | Not found. The shop is built from general knowledge of 1900s job printing and from US printing-office photographs. |

Photographs to use as a guide (public domain): Library of Congress, Kingston street scenes with trolleys about 1900 (`loc.gov/pictures/item/2003678373/`, `2003678372/`); Wikimedia Commons, "Kingston, Jamaica in the 20th century" and "1907 Kingston earthquake". The National Library of Jamaica has more (permission needed).

### Third research pass (13 Nov 2026): secondary sources only

Same caveat as the second pass: the Papers could not be reached.

| Fact | Status |
|---|---|
| Garvey left Jamaica on 6 March 1916 on the SS *Tallac* and reached New York on 23 or 24 March | Sources differ on the day |
| He worked as a printer in New York | Confirmed (several) |
| First street speech at 135th Street and Lenox Avenue | One source. The game says "is said to have". |
| Some middle-class Black New Yorkers disliked street speakers | Used as the older man's view; one source |
| Black Harlem grew from about 28,690 (1910) to about 83,597 (1920) | One source. The game rounds to about 29,000 and about 84,000 and says it is still to check. |
| The New York UNIA branch began in 1917 (first members 13 or 17); Liberty Hall opened in 1919 | Sources differ on the first members |
| *Negro World*: first issue 17 August 1918, weekly, five cents, English at first; banned in places such as Trinidad, British Guiana and St Vincent; carried by seamen and others | Secondary sources. How copies were hidden (stewards, clothing) was not found: do not invent it. |
| Black Star Line: incorporated June 1919 (sources give the day as 23, 26 or 27 June; a Black Star Line handbill printed by the Hunt Printing Co. says "Incorporated under the State Laws of Delaware, June 26, 1919", owner's copy, 17 November 2026); $5 shares; 96,285 sold by August 1920 (the journal says nearly 100,000); *Yarmouth*, *Shady Side* and *Kanawha* were old and overpriced | Secondary sources. This replaces the second-pass note that the $5 price was unconfirmed, but still say "about" for counts. |

In chapter 4 the three headlines (Be Proud of Who You Are, Read, Learn and Grow, Stand Together) and the sailor and his voyage are fictional, and the journal says so. The consequences of the sailor's choice (one bundle taken, the rest read) are story, not record. The real facts used are the paper's name, weekly, five cents, the first issue on 17 August 1918, the bans, and that seamen carried copies.

In chapter 8 the guide and the student are fictional and labelled in the journal. The real facts used: Garvey reached Kingston in December 1927; he formed the People's Political Party in 1929 and moved to London in 1935 (each from one source, so the journal says so); he died in London on 10 June 1940; his remains came home in 1964 (the day is 10 or 15 November in different sources) and were placed in the shrine in National Heroes Park; he was named a National Hero in 1969 (Jamaica Information Service); the monument was designed in 1964 with a bronze bust by T. Alvin Marriott placed in the park in 1956 (Jamaica National Heritage Trust); US President Joe Biden gave him a posthumous pardon in January 2025, and his family and supporters continue to seek exoneration from Congress (several news reports). The shrine is built in `src/shrine.js` from the written sources and, since 16 November 2026, from a photograph (see "The shrine against a photograph" below). What the sources say: the monument was designed in 1964 by G. C. Hodges, the Government Town Planner; the tomb is at the centre of a raised platform in the shape of a black star, the symbol of the Black Star Line; the burial vault is terrazzo inset with marble; behind it a "peaked and angled wall" holds the bronze bust by T. Alvin Marriott, which the Kingston and St. Andrew Corporation put up elsewhere in the park in 1956 and which was moved into the design (Jamaica National Heritage Trust, "Monument to the Rt. Excellent Marcus Garvey"; Wikipedia, "National Heroes Park"; Gleaner, "The ground where our heroes rest", 9 August 2026; Atlanta Black Star, "The Monument to the Rt. Excellent Marcus Garvey, Jamaica", 2015). Wreaths are laid at the shrine every 17 August, his birthday (Jamaica Information Service, "Jamaica Pays Tribute to Marcus Garvey", 2017; Gleaner, 18 August 2017), so a wreath on a stand is at the foot of the star. Left out: the London plaques' quotations (they belong to the London memorials, not the Kingston shrine), and any bill number or status for the exoneration effort.

### The shrine against a photograph (16 November 2026)

Wikimedia Commons has no photograph of the Kingston shrine (searched: the categories "Marcus Garvey" and "National Heroes Park", and file searches for the shrine, tomb and grave; the Commons busts of Garvey are in Emancipation Park and at the UWI Mona campus, not this one). The reference used is the photograph in the Atlanta Black Star article above (`atlantablackstar.com/wp-content/uploads/2015/01/100_4058.jpg`, taken from the front path; its licence is not stated, so it is a reference only, never a texture). For the face the public-domain Library of Congress photograph of Garvey at his desk, 5 August 1924 (George Grantham Bain Collection, LC-USZ61-1854; Wikimedia Commons, "Marcus Garvey 1924-08-05.jpg") was used alongside the owner's photograph.

What the photograph shows, and the game now builds:

| Part | The photograph | The game |
|---|---|---|
| Star | a raised bed about knee high; sides faced with pale cut limestone in an irregular pattern; a dark grey coping band round the edge; filled with dark grey river pebbles; two points toward the path, one under the wall | the same: 7.2 m point to point, 0.6 m high, coping, pebble fill, one point toward the wall |
| Tomb | a dark grey base with a white marble top and a small dark cross lying on it | the same |
| Words | a dark stone frame round a white plate at the head of the tomb: MARCUS MOSIAH GARVEY / JAMAICAS FIRST NATIONAL HERO / 1887 - 1940 (no apostrophe can be seen at the photograph's size) | the same words, as read. The old plate (name and years only) is gone |
| Wall | a gable, not two angled wings: straight sides and a peak, faced with the same limestone, white edges | a 5 m gable, 1.3 m at the sides, 2.4 m at the peak (judged from the photograph, with the tomb top taken as about 1.1 m wide) |
| Bust | dark bronze, head, shoulders and upper arms, jacket with lapels, shirt and tie, close-cut hair, moustache; on a dark ledge on the wall's face, a small plate below | cast from the game's own Garvey body (garvey1914, shaped against the photographs), posed standing, cut under the chest and turned to bronze at runtime (`castBust`), about 1.1 times life size, on a dark ledge, a small blank plate below (its words cannot be read) |
| Around it | low stone walls off to either side with the same coping; sago palms by the wall; red ixora in red earth along the star's front; two paving slabs in the notch between the front points; flagpoles behind | the same |

Still not known: the real measurements, the words on the small plate under the bust, and the colour of the bronze in other light. The bust's likeness comes from the game's Garvey, so a later change to `garvey1914` changes the bust too; check both against the photographs. Dev views: `?shot=shrine&free&x=&z=&yaw=&pitch=` and `?shot=face&id=garvey&st=10&d=0.8&a=0.3` (one person's face, close, in the game's light).

In chapter 7 Amy's words, the reader and the friend's letters are fictional and labelled in the journal. The real facts used: Amy Jacques Garvey was born in Kingston and became Marcus Garvey's wife in the 1920s; she edited the page "Our Women and What They Think" in the *Negro World* (1924 to 1927, one source gives February 1924 to November 1927) and gathered his writings in *Philosophy and Opinions* (1923, 1925); Garvey was convicted in June 1923, went to the Atlanta penitentiary in 1925, and had his sentence shortened in November 1927 before being deported. Left out: the date of the marriage, whether Amy led the UNIA while he was jailed (one source says so), and any view on whether the trial was fair beyond saying that people still disagree. The four news cards are fictional, and the two "facts" (the paper came out every week; Garvey went to prison in Atlanta in 1925) are from the sources above.

In chapter 6 the nurse, the traveller, the messenger and the steward are fictional, and so are Garvey's words. The real facts used are the dates (the convention ran 1 to 31 August 1920; the Declaration is dated 13 August), that most sources place it at Liberty Hall, that delegates came from more than twenty countries (sources vary, so no number is shown), that the Black Cross Nurses were a UNIA women's group, and the exact wording of item 39, checked against the Bill of Rights Institute's copy of the Declaration: "That the colors, Red, Black and Green, be the colors of the Negro race." The banner is an illustration; the game does not say when a flag was first raised. Left out: crowd sizes (sources give 12,000 to 50,000), the parade route and date (1, 2 or 3 August in different sources), and the claim that a mass meeting was held at Madison Square Garden (one source says the convention opened there).

In chapter 5 the clerk, the engineer, the friend and the ship inspection are fictional and labelled in the journal. The real facts used are the company's start in June 1919 (Delaware; the day differs between sources), the five dollar shares, and that the first ship, the *Yarmouth*, was old and in poor condition (some called her the *Frederick Douglass*). The *Shady Side* (an excursion boat) and the *Kanawha* (a steam yacht) are only named in the journal. Not used because they are unconfirmed or one-source claims: Cockburn's pay or the whisky cruise, the exact price of the *Yarmouth*, and the first voyage date. There is no coin purse: the "spend coins" idea was dropped so the game keeps no on-screen meters.

In chapter 3 the words Garvey and the others speak are fictional and credited as such in the journal. The street itself (brownstones, lamps) is a general picture of Harlem, not a copy of one real corner.

### To research before use

- Checked from secondary sources only (see each chapter's note above): the People's Political Party (1929, one source), the move to London (1935, one source), the 1964 return and the 1969 National Hero title, and the January 2025 pardon (several news reports). Check them in the Papers.
- Not found: the inscription on the shrine in National Heroes Park. The game's plaque shows only his name and dates.
- Contested points still to tell in "Dig deeper", fairly and simply, never graphic: the "Garvey Must Go" campaign (PBS has a page), any meeting with a Klan leader, and the Liberia plan. The trial and the Black Star Line's failures are covered briefly in chapters 5 and 7.

## Cast

| Who | Real or fictional |
|---|---|
| Marcus Garvey | Real. Never speaks: his scenes are told by the story. |
| Amy Ashwood | Real |
| Amy Jacques Garvey | Real |
| Joshua Cockburn, first captain of the Black Star Line | Real |
| The hero | Fictional |
| Printers, the foreman, neighbours, Harlem listeners, the older man, a pressman, a sailor, a share clerk, an engineer, a friend who invested, a nurse, a traveller, a messenger, a steward, a park guide, a student | Fictional. Each journal page says so. |
| You | Fictional. The hero stays a first-person "you"; the plan for a visible teen body is still open. |

## Assets the game needs

- Women's characters: done with `era.py` (`woman`, `highneck`, `skirt`, `bun`): Amy Ashwood, Amy Jacques Garvey, the neighbours, the nurse. Women's hats for this game are still to make.
- Clothes 1900 to 1930: trousers, waistcoat, jacket, collar and tie, caps and hats. Later the UNIA uniform and the nurses' dress.
- Places: Kingston timber and brick shops with verandas and zinc roofs; Harlem brownstones and a streetcar; an early-1900s steamer; a printing press; a meeting hall; a Madison Square Garden hall; a courtroom and an office.
- Props: type cases, newspapers, bundles, ledgers, flags (from 1920).
- Animations: the existing library covers most. A speech gesture clip would suit chapter 3 and 6.
- Crowds: instanced figures, not many full characters.

## Build order

1. Spike: install `bpy`, MPFB and MakeHuman and make test characters. Done (see `tools/garvey/README.md`).
2. Chapters 1 and 2 (Kingston). Done.
3. Chapters 3 to 8. Done.
4. Polish (the list above), then consider moving shared systems into `engine/` (the panels, the stage machine and the save code are repeated per game).

## Working alongside the Port Royal chat

The Garvey and Port Royal work used to run in two chats. Port Royal's chat is closed, so the rules below are now mostly habit, but they still keep the history tidy:

- Garvey work stays in `games/garvey/**`, `docs/games/garvey.md` and new tool files. Do not edit `games/port-royal/**`.
- Do not run `node tools/build.mjs port-royal` in a Garvey checkout. It rewrites Port Royal's tracked `app.js`.
- Add files by path. Never `git add -A`.
- Do not refactor Port Royal's `main.js` into `engine/` until the Port Royal chat has merged.
- Edits to shared files (`menu/index.html`, `README.md`, `CLAUDE.md`) go in one small commit at the end of a milestone, on top of the latest `main`.
- Fetch and rebase on `origin/main` before every push.

## Ships in the harbour (17 November 2026)

The three ships out in the water in chapter 5 (`dShip` in `main.js`) were boxes with a stick: 14 meshes, about 280 triangles. Two are now cargo steamers of the time (`steamer` in `engine/boats.js`: forecastle, bridge deck and poop, hatches, a white house and wheelhouse, a plain black funnel, cowl vents, two masts with derricks and rigging, lifeboats, portholes, anchors) and the small one without a funnel is a two-masted schooner with her sails furled (`schooner`). One mesh each, about 10,000 triangles for the three. Same places, lengths and turns, floating on the water at y = -0.7. No names, flags or company colours. The old ship by the dock (the *Yarmouth*) was not changed: its gangway, nameboard and rust patches are fitted to its box hull, so rebuilding it is a job of its own. To view: `?shot=dock1`.

## Checks before shipping

Follow `docs/TESTING.md`: screenshots of every new place next to a reference photograph, the autoplayer for every chapter, the phone layout, a reading-level pass, and a facts check against this file.

## Look-alikes (17 November 2026)

`?test=audit` now runs the look-alike check (`faceCheck`, `engine/faces.js`) on the story people and the background people of every place: two people with one body and face within 2.5 m. Marcus Garvey in his two suits counts as one man. It found one pair, the park guide and the visitor who strolls past her (both `guide2020`): 1 before, 0 now. The visitor uses `guide2020_b`, the guide's body with another face (the full copy built by `tools/people/rebuild.mjs`, `FULL_VARIANTS.garvey`; about 410 KB, fetched only in the park). `fitPace` reads a variant's pace from its body. The other background people already use other chapters' bodies, placed apart.

## The Yarmouth at the dock (17 November 2026)

The ship moored in chapter 5 was a box hull with a box house. It is now `steamer({ L: 60, beam: 8.4, style: 'packet' })` from `engine/boats.js`, shaped after two photographs of the *Yarmouth* herself that the owner supplied (a bow view at anchor and a side view under way, the second marked "Yarmouth" on the print): a coastal passenger steamer built in 1887, with a black hull and a plumb stem, a high forecastle that runs about a third of her length, a small white wheelhouse on it with the foremast just behind, one tall thin black funnel amidships with big dark cowl ventilators fore and aft of it, a long white deckhouse from the forecastle to the stern with a railed boat deck over it, two low houses on the boat deck, three boats a side, a mainmast aft and a derrick on each mast. The real ship was about 67 m long; ours is 60 m so she fits the dock. Her name is in pale letters on the bow, where a ship carries it. A notice board on the dock by the gangway ("S.S. YARMOUTH") lets you read the name from where you stand; that board is a game aid, not from a source. Things still not from a source: the number and spacing of windows, and the deck fittings. You cannot go on board yet: the inspection is three cards read from the dock. A deck you can walk on, built from the same photographs, is a good next step for this chapter. No company colours or flag are shown, because we have no source for them. Audit 0.

The owner's rule (17 November 2026): things in the game are modelled on the real thing, not on a stand-in. The other two ships out in the water are still the generic cargo steamer and a schooner. *Shadyside* was a river excursion boat and *Kanawha* a steam yacht, so they are stand-ins and need their own shapes from photographs. This is work to do.

The handbill the owner shared also shows the "S.S. Phyllis Wheatley". The game does not show or name that ship.

## The dock is busy (17 November 2026)

Nobody on the dock moved from their spot. Now one docker goes between the sacks and the crates, another works at the barrels, two women who have come to see the ship talk together, and a man strolls along the dock (`life.js`, `EXTRAS.dock`). All are background people with no words. Ambient 0, audit 0.
