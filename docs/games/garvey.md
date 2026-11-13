# Marcus Garvey: the game plan

Agreed design for the second game. Read `CLAUDE.md` and `docs/NEW_GAME.md` first. This file is the story, the systems and the research rules. Port Royal's guide is `docs/games/port-royal.md`.

Status: early demo, in progress. It is playable from the game menu ("Early demo" card). Code is in `games/garvey/`.

## Where things are now

- **Demo scene** (`games/garvey/src/main.js`): a Kingston print shop, about 1907. A made-up printer stands at his type stand and a made-up customer walks through the shop. Both talk (placeholder lines). It is the first slice of chapter 1.
- **Characters** (`tools/garvey/`): `era.py` makes 1900s clothes (see its README for setup). Two test characters exist: `printer1907` and `woman1914`.
- **Menu**: the Garvey block links to the game.
- **One pull request**: all Garvey work goes into one PR that stays open, so there is a single merge to `main` when the owner is ready.

Test it:

```bash
node tools/build.mjs garvey --dev          # dev build: test views and the scripted playthrough
python3 -m http.server 8765                # then open http://localhost:8765/games/garvey/site/
# ?shot=shop1 ... shop7 and ?shot=talk are camera views; ?test=walk steps the customer's route; ?auto=1 plays the scene through.
# The result of ?test=walk and ?auto=1 is written to the page title.
```

Next: the type-setting activity and the strike choice (chapter 1), a journal, the Port Royal systems copied in, then chapter 2 (Kingston, 1914). Known gaps: the waistcoat has no V opening; the street seen through the door is only a flat picture; dialogue is placeholder; no journal, saving or helper arrow yet; the Kingston details need checking against photographs of Kingston (the reference photos used so far are of US printing offices).


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
| 1 | Kingston print shop, about 1907 | Set type (find the letters), meet the printers, the printers' strike | Speak up now, wait, or ask the others first |
| 2 | Kingston, 1914 | Invite 3 neighbours by talking to them, print the poster, meet Amy Ashwood | Who you invite first stands in the hall |
| 3 | Harlem street, 1916 | Listen to 3 people, then choose real words to share, answer a heckler | Which listener you answer |
| 4 | Harlem press room, 1918 to 1919 | Build the front page, plan the sailors' delivery route, the ban | Send every copy, split the shipment, or hold it |
| 5 | Harlem docks, 1919 | Compare two ship plans, spend coins, fix a supply problem | What you tell a friend who put in their savings |
| 6 | Harlem, August 1920 | Parade preparation, welcome visitors, read the flag article of the Declaration | Who you help first |
| 7 | Amy Jacques Garvey's desk, 1922 to 1927 | Sort fact from rumour, write fair questions, letters to friends | Which friends you reassure |
| 8 | Kingston 1927 to 1940, then today | Garvey home in Jamaica, then a child at his shrine, connect ideas on a world map | Answer the final question in your own words |

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
| Flag adopted 13 August 1920 (Article 39 of the Declaration), at the Madison Square Garden convention | Confirmed. Attendance given as 20,000 to 25,000, so avoid a number. |
| Convicted of mail fraud in June 1923, five years | Confirmed. The exact day differs (18 or 21 June), so say "June 1923". |
| Sentence commuted 18 November 1927, then deported | Confirmed. The deportation day is still to check. |
| Mail fraud case was about advertising stock in a ship the line did not yet own (the *Orion*) | One source. Check before use. |
| Black Star Line ships *Yarmouth*, *Shadyside*, *Kanawha* were old and in poor condition; Garvey and three others were indicted in 1922 | Confirmed. The share price ($5) is not confirmed: do not use it. |
| Joshua Cockburn was the line's first captain | Confirmed |
| Amy Ashwood worked with Garvey in the first UNIA years; some historians doubt "co-founder" | Say "helped build" on the main path, the debate in "Dig deeper" |
| Amy Jacques Garvey: associate editor of the *Negro World* 1924 to 1927, the page "Our Women and What They Think", *Philosophy and Opinions* (1923, 1925) | Confirmed |
| Printers' strike, Kingston | 1907 or 1908, sources differ. Garvey was a master printer and foreman at P.A. Benjamin, was fired after the strike, blacklisted, then worked at the Government Printing Office. |
| Costa Rica (timekeeper for the United Fruit Company, wrote in *La Nación*), then Panama (*La Prensa*) | Dates between 1909 and 1911, sources differ |
| London 1912 to 1914, Birkbeck College, the *African Times and Orient Review* (Duse Mohamed Ali) | Confirmed. Some sources say 1911. |

### To research before use

- UNIA founding date (August 1914; some sources say July).
- Garvey's arrival in the US (1916) and the start of the *Negro World* (1918).
- The People's Political Party (1929), the move to London (1935), National Hero (1964), the inscription at his shrine in National Heroes Park.
- Contested points for "Dig deeper": the "Garvey Must Go" campaign (PBS American Experience has a page), the Black Star Line's failures, the fairness of the trial and the modern calls for exoneration, any meeting with a Klan leader, the Liberia plan. Tell each fairly and simply. Never graphic.
- A reported posthumous pardon in January 2025. Confirm from an official source or leave it out.

## Cast

| Who | Real or made up |
|---|---|
| Marcus Garvey | Real. Short traced quotes only. |
| Amy Ashwood | Real |
| Amy Jacques Garvey | Real |
| Joshua Cockburn, first captain of the Black Star Line | Real |
| The hero | Made up |
| Printers, the foreman, neighbours, Harlem listeners, the heckler, sailors and stewards, a friend who invested, nurses, a clerk | Made up. Each journal page says so. |
| The modern child in chapter 8 | Made up |

## Assets the game needs

- Women's characters: `tools/people/npc.py` makes men only. Add dress, blouse, skirt and hat pieces (see PIPELINE.md). Needed in chapters 2, 4, 6, 7.
- Clothes 1900 to 1930: trousers, waistcoat, jacket, collar and tie, caps and hats. Later the UNIA uniform and the nurses' dress.
- Places: Kingston timber and brick shops with verandas and zinc roofs; Harlem brownstones and a streetcar; an early-1900s steamer; a printing press; a meeting hall; a Madison Square Garden hall; a courtroom and an office.
- Props: type cases, newspapers, bundles, ledgers, flags (from 1920).
- Animations: the existing library covers most. A speech gesture clip would suit chapter 3 and 6.
- Crowds: instanced figures, not many full characters.

## Build order

1. Spike: install `bpy`, MPFB and MakeHuman here and make two test characters (a 1907 printer, a woman in a 1914 dress). If it fails, ask the owner to run the character step on their own machine.
2. Chapters 1 and 2 (Kingston) as the first slice: women, the press, a hall, period clothes.
3. Chapters 3 and 4 (Harlem), then 5, 6, 7, 8.
4. Move shared systems into `engine/` only after the Port Royal work has merged (below).

## Working alongside the Port Royal chat

Two chats work on this repo. To keep merges clean:

- Garvey work stays in `games/garvey/**`, `docs/games/garvey.md` and new tool files. Do not edit `games/port-royal/**`.
- Do not run `node tools/build.mjs port-royal` in a Garvey checkout. It rewrites Port Royal's tracked `app.js`.
- Add files by path. Never `git add -A`.
- Do not refactor Port Royal's `main.js` into `engine/` until the Port Royal chat has merged.
- Edits to shared files (`menu/index.html`, `README.md`, `CLAUDE.md`) go in one small commit at the end of a milestone, on top of the latest `main`.
- Fetch and rebase on `origin/main` before every push.

## Checks before shipping

Follow `docs/TESTING.md`: screenshots of every new place next to a reference photograph, the autoplayer for every chapter, the phone layout, a reading-level pass, and a facts check against this file.
