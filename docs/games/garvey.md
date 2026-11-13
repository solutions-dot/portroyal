# Marcus Garvey: the game plan

Agreed design for the second game. Read `CLAUDE.md` and `docs/NEW_GAME.md` first. This file is the story, the systems and the research rules. Port Royal's guide is `docs/games/port-royal.md`.

Status: all eight chapters are playable from the game menu (the "New" card). Code is in `games/garvey/`. Each chapter is a first slice: one place, one or two hands-on activities and one or two remembered choices.

## Where things are now

- **Demo scene** (`games/garvey/src/main.js`): a Kingston print shop, about 1907. A made-up printer stands at his type stand and a made-up customer walks through the shop. Both talk (placeholder lines). After you talk to both, you set the type for a notice at the type stand (letters are mirror images, as on real type), press it, and three journal pages open. It is the first slice of chapter 1.
- **Characters** (`tools/garvey/`): `era.py` makes 1900s clothes (see its README for setup). Two test characters exist: `printer1907` and `woman1914`.
- **Menu**: the Garvey block links to the game.
- **One pull request**: all Garvey work goes into one PR that stays open, so there is a single merge to `main` when the owner is ready.

Test it:

```bash
node tools/build.mjs garvey --dev          # dev build: test views and the scripted playthrough
python3 -m http.server 8765                # then open http://localhost:8765/games/garvey/site/
# ?shot=shop1 ... shop7, talk, strike, type, typedone, journal, chapters, reset, credits, bubble, nudge, hall1 ... hall4, hallchat, street1, street2, streetchat and the press views are views;
# ?test=walk steps the customer's route; ?auto=1 plays chapter 1 and opens every menu; ?auto=2 plays chapter 2; ?auto=3 checks old saves and replayed choices; ?auto=4 plays chapter 3; ?auto=5 plays chapter 4 (press1 to press3, pagebuild, pagedone, pressback and presschat are its views); ?auto=6 plays chapter 5 (dock1 to dock3, inspect and dockchat are its views); ?auto=7 plays chapter 6 (lib1 to lib3, decl, decldone and libchat are its views); ?auto=8 plays chapter 7 (off1, off2, sort, sortdone, letter and offchat are its views); ?auto=9 plays chapter 8 (park1, park2, time, timedone, answer, journey and parkchat are its views).
# The result of ?test=walk and ?auto=1 is written to the page title.
```

### Navigation and menus: the same as Port Royal

Players who know Port Royal should find everything where they expect it. The page (`games/garvey/site/index.html`) is built from Port Royal's, so the styles match.

- **Title screen**: Start (or Continue), Chapters, All games, Created by Kellz 5.0, and "Your progress is saved on this device".
- **In the game**: reset, sound and Journal (with a count) at the top right; a Goal tab that folds after a few seconds; a controls hint; a glowing speech mark over each person and a bubble on the nearest; a resting joystick on phones.
- **Journal**: a paper book with tabs and "Dig deeper". Its footer has **All games** and **Chapters**.
- **Chapters**: all eight chapters are listed and playable. Each opens when the one before it is done. The panel also has Credits and "Start again".
- **Reset**: a card with "Restart this chapter", "Start the whole story again" (asks twice) and **All games**.
- **All games** is therefore reachable from the title, the Journal and the Reset card. It only shows where the real menu exists (the website), as in Port Royal.
- **Saving**: the Journal, the goal and who you have talked to are kept in the browser (`garvey-save-v1`).
- **Keys**: Escape closes any panel; E or Enter uses the nearest thing.

### The story is a number

`stage` (saved) says where you are; `best` is the furthest you have ever got, so chapters stay open when you replay one. Chapter 1: 0 talk to the printer and the customer, 1 set the type, 2 the strike, 3 done. Chapter 2: 10 meet Amy and Garvey, 11 print the poster, 12 welcome the neighbours, 13 listen to Garvey, 14 done. Chapter 3: 20 listen to the worker, the woman and the older man, 21 talk to Garvey (choose his words), 22 answer the older man's question, 23 done. Chapter 4: 30 talk to the pressman and Garvey (choose the headline), 31 lay out the front page, 32 talk to the sailor (choose how the bundles travel), 33 weeks later: talk to the sailor and the pressman, 34 done. Chapter 5: 40 meet Garvey, the share clerk and the engineer, 41 look the old ship over, 42 talk to Garvey (advise: buy now or save), 43 talk to your friend (advise her), 44 done. Chapter 6: 50 welcome the nurse, the traveller and the messenger, 51 talk to the steward (choose who he helps first), 52 read the Declaration and colour the banner, 53 talk to Garvey, 54 done. Chapter 7: 60 talk to Amy Jacques Garvey, 61 sort the news cards (fact or rumour), 62 talk to Amy (choose the fair question), 63 read your friend's letter and write back, 64 done. Chapter 8: 70 talk to the park guide and the student, 71 put the later events in order at the timeline board, 72 talk to the student (the big question), 73 answer at the shrine in your own words, 74 done (the end card and the "Your journey" journal page, which lists every choice you made). A person gives their full conversation only when `TALK_TARGETS[stage]` names them; otherwise they say a short later line. `story` records choices (`strike`, `poster`) and is saved too. Each place (`PLACES`: the print shop, the hall) has its own walls, bounds, people and things to do. Chapter 2's characters load only when it starts.

To add a chapter: add its row to `CHAPTERS` in `games/garvey/src/main.js` (set `ready`, `go` and `done`), add its goals to `GOALS`, `TALK_TARGETS` and `NEXT_AFTER_TALK`, its journal pages to `JOURNAL`, a place to `PLACES`, and a test to `devViews()`. Port Royal's `NUDGE` helper arrow is copied; its third-person view is not.

### What is left (polish list)

All eight chapters are built, so what remains is quality work, roughly in this order:

1. **Read every line aloud** for the 6+ reading level (a script already flags lines over 12 words; the journal's "Dig deeper" text can be longer). All dialogue is placeholder wording written for this game.
2. **Check facts against primary sources.** Every date and claim comes from secondary sources (see the research tables). Check the Marcus Garvey and UNIA Papers, then remove the "we still need to check" notes from the journal pages.
3. **Check places against photographs.** The Kingston shops and hall are built from US printing-office photographs and general knowledge. Harlem, Liberty Hall, the dock and the shrine are also general pictures, not copies of real places.
4. **Characters.** The waistcoat has no V opening, an apron does not fit over a skirt, shirt and apron edges are ragged at close range, there are no women's hats, and there is no UNIA uniform or Black Cross Nurses' dress. All faces are built from the same body, so they look alike.
5. **Sound.** Each place now has its own mix of the engine's beds and one small sound (press thump in the shop and press room, gulls and ship creaks at the dock, birds in the park), set in `SOUNDSCAPE`. Still to do: footsteps that change by floor, and a short music cue at the end of each chapter.
6. **Third-person view** (V key) and a teen body for the hero.
7. **Window views.** Most rooms show the same leafy yard through the windows.
8. **Menu and phone checks** after any change: run all the autoplayers and look at one phone screenshot per chapter.

## Decisions (agreed with the owner)

| Question | Decision |
|---|---|
| Who do you play? | A made-up Jamaican apprentice printer who grows up with the movement. Real people (Garvey, the two Amys) are met, never played. |
| Age | Same as every game here: 6 and up, plus adults. Plain words on the main path. Prison, the trial and other contested points go in "Dig deeper". |
| Voice | Text only. The engine has no audio files. Voice may be added later for a few key lines. |
| Meters | No numbers on screen. Choices show up as what you see (who is in the hall, who stands with you) and what people say on later visits. |
| Episode 7 | Played from Amy Jacques Garvey's desk, not from the courtroom. |

Still open: the hero's name and look, and the game's title (the concept PDF says "Garvey: The Rise of a Movement"; the menu card says "Marcus Garvey").

## The story in one paragraph

A made-up apprentice in a Kingston print shop sees what words can do. The apprentice follows Marcus Garvey and the UNIA from Kingston to Harlem, helps print the *Negro World*, sees the Black Star Line dream meet hard reality, and keeps the work going when Garvey is in prison. The last chapter jumps to Jamaica today, where a child asks: the world has changed, but has the dream been fulfilled?

Dramatic question: how much are you willing to risk to change the world?

## The hero

- Made up. The journal page says so (owner rule 3).
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

Rule of truth: big events stay as they happened. Your choices change who you protected, what you learned and what friends say later. The Black Star Line fails whichever plan you pick. Every chapter ends with a "History / Story" journal page saying what really happened and what was made up.

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
- Real people only say things they could have said. Quote only words traced to the Marcus Garvey and UNIA Papers or to his published writings. Many quotes online credited to him cannot be traced, so do not use them.
- The two Amys appear as people with their own work.
- Sources to start from: the Marcus Garvey and UNIA Papers (UCLA), the US National Archives, the New York Public Library's UNIA collection, PBS American Experience, the Library of Congress picture collection, the National Library of Jamaica. Public-domain photographs are reference only, never textures.
- The red, black and green flag must not appear before August 1920.

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
| Black Star Line: incorporated June 1919; $5 shares; 96,285 sold by August 1920; *Yarmouth*, *Shady Side* and *Kanawha* were old and overpriced | Secondary sources. This replaces the second-pass note that the $5 price was unconfirmed, but still say "about" for counts. |

In chapter 4 the three headlines (Be Proud of Who You Are, Read, Learn and Grow, Stand Together) and the sailor and his voyage are made up, and the journal says so. The consequences of the sailor's choice (one bundle taken, the rest read) are story, not record. The real facts used are the paper's name, weekly, five cents, the first issue on 17 August 1918, the bans, and that seamen carried copies.

In chapter 8 the guide and the student are made up and labelled in the journal. The real facts used: Garvey reached Kingston in December 1927; he formed the People's Political Party in 1929 and moved to London in 1935 (each from one source, so the journal says so); he died in London on 10 June 1940; his remains came home in 1964 (the day is 10 or 15 November in different sources) and were placed in the shrine in National Heroes Park; he was named a National Hero in 1969 (Jamaica Information Service); the monument was designed in 1964 with a bronze bust by T. Alvin Marriott placed in the park in 1956 (Jamaica National Heritage Trust); US President Joe Biden gave him a posthumous pardon in January 2025, and his family and supporters continue to seek exoneration from Congress (several news reports). The shrine in the game is an outline from descriptions (a black star on the ground, an angled stone wall, a bronze bust on a plinth). Its plaque shows only his name and dates, because the real inscription was not found. Left out: the London plaques' quotations (they belong to the London memorials, not the Kingston shrine), and any bill number or status for the exoneration effort.

In chapter 7 Amy's words, the reader and the friend's letters are made up and labelled in the journal. The real facts used: Amy Jacques Garvey was born in Kingston and became Marcus Garvey's wife in the 1920s; she edited the page "Our Women and What They Think" in the *Negro World* (1924 to 1927, one source gives February 1924 to November 1927) and gathered his writings in *Philosophy and Opinions* (1923, 1925); Garvey was convicted in June 1923, went to the Atlanta penitentiary in 1925, and had his sentence shortened in November 1927 before being deported. Left out: the date of the marriage, whether Amy led the UNIA while he was jailed (one source says so), and any view on whether the trial was fair beyond saying that people still disagree. The four news cards are made up, and the two "facts" (the paper came out every week; Garvey went to prison in Atlanta in 1925) are from the sources above.

In chapter 6 the nurse, the traveller, the messenger and the steward are made up, and so are Garvey's words. The real facts used are the dates (the convention ran 1 to 31 August 1920; the Declaration is dated 13 August), that most sources place it at Liberty Hall, that delegates came from more than twenty countries (sources vary, so no number is shown), that the Black Cross Nurses were a UNIA women's group, and the exact wording of item 39, checked against the Bill of Rights Institute's copy of the Declaration: "That the colors, Red, Black and Green, be the colors of the Negro race." The banner is an illustration; the game does not say when a flag was first raised. Left out: crowd sizes (sources give 12,000 to 50,000), the parade route and date (1, 2 or 3 August in different sources), and the claim that a mass meeting was held at Madison Square Garden (one source says the convention opened there).

In chapter 5 the clerk, the engineer, the friend and the ship inspection are made up and labelled in the journal. The real facts used are the company's start in June 1919 (Delaware; the day differs between sources), the five dollar shares, and that the first ship, the *Yarmouth*, was old and in poor condition (some called her the *Frederick Douglass*). The *Shady Side* (an excursion boat) and the *Kanawha* (a steam yacht) are only named in the journal. Not used because they are unconfirmed or one-source claims: Cockburn's pay or the whisky cruise, the exact price of the *Yarmouth*, and the first voyage date. There is no coin purse: the "spend coins" idea was dropped so the game keeps no on-screen meters.

In chapter 3 the words Garvey and the others speak are made up and credited as such in the journal. The street itself (brownstones, lamps) is a general picture of Harlem, not a copy of one real corner.

### To research before use

- Checked from secondary sources only (see each chapter's note above): the People's Political Party (1929, one source), the move to London (1935, one source), the 1964 return and the 1969 National Hero title, and the January 2025 pardon (several news reports). Check them in the Papers.
- Not found: the inscription on the shrine in National Heroes Park. The game's plaque shows only his name and dates.
- Contested points still to tell in "Dig deeper", fairly and simply, never graphic: the "Garvey Must Go" campaign (PBS has a page), any meeting with a Klan leader, and the Liberia plan. The trial and the Black Star Line's failures are covered briefly in chapters 5 and 7.

## Cast

| Who | Real or made up |
|---|---|
| Marcus Garvey | Real. Short traced quotes only. |
| Amy Ashwood | Real |
| Amy Jacques Garvey | Real |
| Joshua Cockburn, first captain of the Black Star Line | Real |
| The hero | Made up |
| Printers, the foreman, neighbours, Harlem listeners, the older man, a pressman, a sailor, a share clerk, an engineer, a friend who invested, a nurse, a traveller, a messenger, a steward, a park guide, a student | Made up. Each journal page says so. |
| You | Made up. The hero stays a first-person "you"; the plan for a visible teen body is still open. |

## Assets the game needs

- Women's characters: `tools/people/npc.py` makes men only. Add dress, blouse, skirt and hat pieces (see PIPELINE.md). Needed in chapters 2, 4, 6, 7.
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

## Checks before shipping

Follow `docs/TESTING.md`: screenshots of every new place next to a reference photograph, the autoplayer for every chapter, the phone layout, a reading-level pass, and a facts check against this file.
