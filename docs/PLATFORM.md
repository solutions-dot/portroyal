# The platform: PastPort, the time-traveller idea, and the intro

This page is for the menu and the opening, the part of the site that sits above every game.
Read it before changing the menu header, the intro, the logo, or what the library is called.

## The name

**PastPort - Jamaica.** The owner chose it on 15 November 2026.

- **PastPort** is the platform. **Jamaica** is the first island edition. The owner may build editions for other Caribbean islands, so the island is always its own, second word, in a different type from the name (a gold brush script in the owner's logo).
- It is past plus passport, and kids understand it in a second. Each game is a stamp in your PastPort. "Port" also nods to the harbour in Port Royal.
- The capital P in the middle shows the two words. Write it **PastPort**, not Pastport, in names and titles.
- The page title and the About page say "PastPort - Jamaica".

Name check (November 2026): a web search found no brand called Pastport. The idea of a passport with stamps for history is common, though (Project Passport from Home School in the Woods, Passport to the Past from Gloucestershire Archives, Little Passports). This is **not** a trademark or domain check. Do that before the name goes on anything permanent.

Earlier names that were dropped or not chosen: Longtime (the first working name, which the owner did not like), Walk Good, Memba, Elsewhen, Doctor Bird, Wi Story, Rewind, Timeyard, Step Back.

## The logo

The owner's own artwork: the words PAST and PORT stacked in chunky cream block letters with a gold edge and a dark green outline; a compass star over an arc of tick marks, inside a dark ring behind the letters; a postage stamp with the outline of Jamaica at the bottom left; and "Jamaica" in a gold brush script at the bottom right.

- The original is `pastport logo.png` in the repo root (1536 by 1024, kept as the source and not published). Do not edit it. Make changes by re-running the script.
- The web copies in `menu/` are made by `python3 -I tools/menu/make_logo_assets.py "pastport logo.png" menu` (needs Pillow and numpy):
  - `pastport-logo.webp` (1200 px, the intro), `pastport-logo-sm.webp` (420 px, the header and the About page), `pastport-icon.png` (the tab icon)
  - `pastport-jamaica.webp`, a mask that is solid only where the gold "Jamaica" script is. The intro shows the logo a second time through this mask with its hue turning, which is how "Jamaica" cycles through colours without touching the artwork.
- The logo is used whole. It is **not** split into layers. If a new logo file arrives, re-run the script, then check the mask by eye (paint the script another colour and zoom in on the swoosh ends and the top of the J). The positions of the sparkles in `intro.css` (`.lg-spark`) and the ring (`.lg-ring`) are fractions of the logo, so they need a look too.
- The island is part of the logo ("Jamaica"). For another island there will be another logo file and mask.

## The traveller idea

The player is a **Traveller**. The platform is how they travel. Each game is a **destination**: a place and a year.

| Today's word | In the traveller idea |
|---|---|
| Games | Destinations (a place and a year) |
| Play | Go there (done on the menu cards) |
| Chapters | Stops |
| Journal | Traveller's journal (it already is one) |
| Menu | Where do you want to go? |

**The Traveller's Rule: you can look, listen and learn. You cannot change what happened.**
This is already how every game works. The About page says "Your choices do not rewrite history", and the Garvey game buys the ship whatever you advise. The About page says the rule in its first paragraph.

Tone for hard history:
- A traveller is a witness, not a tourist. Never use words like "adventure", "mission" or "unlock" for a disaster.
- The intro is calm and a little awed. It is never loud or jokey.
- Tivoli keeps its own rules (`docs/games/tivoli.md`), including its opt-in card before the 2010 chapters.

## The credit

The three pills (About, Get updates, Created by Kellz 5.0, in that order) sit **below all the game cards**, centred, with a little space above them (owner, 22 November 2026); they were in the header before. "Created by Kellz 5.0" is the last of them. It opens the contact form. The About page keeps its creator credit. No creator credit appears on the intro screen.

## Game opening screens

All game opening screens have a Main Menu button linking to `../../../menu/`. It is a normal link styled like Chapters and is available while models load, without a network probe or a check for the platform's name. Journal and reset links use the same destination.

The standard order is Start (or Continue when a saved game is available), Chapters, Main Menu, then the loading bar while the game loads. The bar hides automatically as soon as Start or Continue is enabled. Tivoli uses the same three opening actions; its journal opens in game. Games without chapter support omit Chapters. The saved-progress note appears only when saving is supported. Creator credits are removed from the opening screens; existing Credits panels remain available through Chapters.

`shared/title.css` owns the shared control styles and is copied to each game's `site/title.css` by `tools/build.mjs`. The template uses it too. Keep every opening screen usable on narrow phones and short landscape screens.

## The New badge

The first ten games (Port Royal, Nanny Town, Bog Walk, Marcus Garvey, Kendal, Eventide, Tivoli, The Emperor's Arrival, Windrush and Hurricane Melissa) carry no badge: no "New" and no "Early version" (owner, 16 Nov 2026). Only a game added after them gets `<p class="tag">New</p>` on its menu card, and only for its first season. The test "menu: the first ten games carry no New or Early version badge" in `tests/regressions.mjs` keeps it that way.

## The library: profiles, kinds of story, stars and "For you"

The owner asked for streaming-library features on the menu on 22 November 2026: two profiles, a genre for each game, recommendations, star ratings from both profiles, and a "Mature 13+" tier with a warning. Never write "PG-13": it is a film-industry mark. The words are "Mature 13+" and "For ages 13 and up".

Files: `menu/library.js`, `menu/library.css`, and in `menu/index.html` the `data-` attributes on the cards, `#library`, `#kidsnote` and the three dialogs. `tests/menu-library.mjs` checks it. It touches no game. The site is static, so everything is kept in the browser (`localStorage`), every read and write is in a try/catch, and without JavaScript none of it shows and the cards are plain links.

**What a card says about itself** (add these to every new card):

| Attribute | What it is |
|---|---|
| `data-genres` | Kinds of story, with spaces between. The first is the main one, shown above the title. The ids are `mystery` Mystery, `disasters` Disasters, `freedom` Freedom and rights, `leaders` Leaders, `family` Family stories, `battles` Battles (the list is `GENRES` in `library.js`). |
| `data-tags` | Plain words used only to match games for "For you" and "More like this". |
| `data-age` | `6`, or `13` for a Mature 13+ game. |
| `data-warn` | For a 13 card only, and it must have one: the content note in plain words, shown on the warning card and on the sheet. |

**How it works**

- **The bar** sits between the header and the cards, inside `<main>` so the intro covers it. Kinds of story are chips: "All" and one for each kind that a card you can see has. One is pressed at a time (`aria-pressed`), the others' cards hide, and the timeline order stays. The choice is not saved. On phones the chips are one row that slides sideways and the profile button sits at the top right beside the logo. The header keeps its three pills.
- **Profiles.** "Kids" (ages 6 and up) is the start, with no extra step. "Teens and adults" (13 and up) adds Mature 13+ games. Going from Kids to Teens and adults asks for the year you were born. The age is this year minus that year, and under 13 stays in Kids with the line "This part is for ages 13 and up." Going back to Kids asks nothing. Only the choice is saved (`pastport-profile`: `kids` or `teen`). The year is used once and never stored. **This is a soft gate, not real age verification.** A determined child can type another year, and a child who turns 13 later in the year passes. It is there to make a young child stop and ask, and no more is claimed for it anywhere.
- **Mature 13+ games.** In Kids they are gone from view everywhere: the cards, the chips (no Mystery chip while its only games are hidden), "For you" (as a pick and as a reason), "More like this", and the links `?rate=` and `#id`. `library.css` hides a `data-age="13"` card unless the page has the class `lib-teen`, so this holds before the script runs and with JavaScript off. When any card is hidden, a quiet line under the cards says "Some stories are for ages 13 and up. A grown-up can change who is travelling." In Teens and adults the card wears a "Mature 13+" badge, and anything that would open the game (the card, a "For you" tile, Go there on the sheet) first shows a card headed "Mature 13+" with "For ages 13 and up", the `data-warn` note, and "Go there" and "Not now". The intro's stamps are left as they are.
- **The sheet.** `library.js` wraps each card in a `.slot` and puts a round "i" button beside the link (a button may not sit inside a link). The slot takes the card's place in the grid, so card sizes do not change. The button opens a `<dialog>`: picture, main kind, title, age line, the card's sentence, Go there, the stars, and "More like this" (up to three other games you can see, most shared kinds first, then most shared tags). `?rate=<game id>` on the menu opens that sheet with focus on the stars, for the games to link to from their last card. `#<game id>` opens it too. With the intro playing, it waits until the intro has gone.
- **Stars.** Five big stars, a radio group, in both profiles (the owner: children can rate too). Your rating is saved on the device (`pastport-ratings`, game id to 1 to 5) and shown on the sheet and as a small line on the card. The same star again, or Clear, takes it back.
- **"For you" is switched off for now** (owner, 22 November 2026). `FOR_YOU = false` in `menu/library.js` hides the strip; the scoring, its tests and the visit record stay, so `true` brings it back. What follows describes it when on. A slim strip of up to three tiles between the bar and the cards. Pressing Go there records a visit (`pastport-visits`, game id to a count and the last time). A game you know (visited or rated) is never a pick. Every other game you can see is scored against each game you know: +3 for each shared kind with a game you gave 4 or 5 stars, +2 for each shared kind with a game you visited and did not rate 1 or 2, +1 for each shared tag with either, and -3 for each shared kind with a game you rated 1 or 2. A New badge adds 1. Only a score above 0 is shown, with the reason "Because you liked ...", "Because you went to ..." or "New". With no visits and no ratings that leaves the New games, or no strip at all. A pick is never made up. The strip steps aside while one kind of story is chosen.

The scoring, the profile filter and the average are pure functions at the top of `library.js` (`PastPortLibrary`), which Node can load, so `tests/menu-library.mjs` tests them without a browser.

### Ratings backend (not switched on)

Sharing ratings "for other viewers" needs a small backend the owner has not chosen. `const RATINGS_URL = '';` at the top of `menu/library.js` is the switch, like `SUBSCRIBE_URL` in `site.js`. While it is empty nothing is sent anywhere, no average is shown, and the sheet says "Your stars are saved on this device only." Never show a made-up average or count. `npm test` fails if the committed file has it set by mistake, so change the test in the same commit as the switch.

When it is set:

- On load: `GET RATINGS_URL` answers `{ "<game id>": { "sum": 123, "n": 30 }, ... }`. The card and the sheet show "4.1 of 5, from 30 ratings", and nothing under 3 ratings.
- On a rating: `POST RATINGS_URL` with JSON `{ "game": "<game id>", "stars": 4, "was": 3 }`. `was` is this device's last rating, or 0, so the server can change the sum and the count without storing who voted. Clearing a rating sends `"stars": 0`.
- Nothing else is sent: no name, no device id, no cookie, no referrer. Children use this. The server must allow the site's origin (CORS, with the preflight that a JSON post needs).
- A failed request is silent and never blocks the page.

It trusts the browser, so it can be gamed: anyone can post any number, as often as they like. That is the price of collecting nothing about children. A backend can soften it (limit the rate by address without keeping the address, refuse stars outside 0 to 5), and the average should be read as a friendly guide, not a measure.

**Checking it** (done for this version, repeat after changes): screenshots at 1280 by 720, 800 by 500, 414 by 706, 360 by 640 and 320 by 568 of the menu, a kind chosen, both steps of the profile dialog, a sheet with a rating, the strip after a visit and a rating, and (with two 13 cards added to the served page for the test only) the badge and the warning card. Also the keyboard alone, `?intro=1`, storage that throws, JavaScript off, and a fake ratings server.

## The intro

Files: `menu/intro.js`, `menu/intro.css`, the `#intro` markup and a few lines in the head of `menu/index.html`.
It touches no game.

It **starts by itself** when the page loads and takes about seven seconds. There are **no buttons** on it (the owner asked for no Begin, no Sound and no Skip, and no "Step back in time" line):
1. A dial and the current year. The dial runs backwards, one tick for every ten years. It stops at each game on the menu and a **passport stamp** lands, in that game's own colour, with a small wooden note that climbs a scale. A whoosh rises and the clicks slow down.
2. Two low plucked notes (D, then A). On the first, the PastPort - Jamaica logo **slams in** (and a ring of light spreads). On the second, a second ring, a **glint of light** crosses the logo (kept to the logo's shape), and **sparkles** hit the top, left and right points of the compass star, each with a small high note. A bell rings (D, A, E: open and calm, neither happy nor sad).
3. **"Jamaica" cycles through colours** (the whole colour wheel in 3 seconds) while the logo is held and breathes a little. The header logo on the menu cycles too, more slowly (6 seconds a turn, never with reduced motion), with the same mask. One line about what it is fades in under it: "Games that take you into Jamaica's past."
4. The menu fades up with the cards one after another.

**Sound and the browser rule.** Chrome, Safari and Firefox do not let a page start sound by itself. Sound needs a tap or key press first. So the intro asks for sound when it starts. If the browser allows it, the sound plays with the picture. If it does not (the usual case on a first visit that opens straight onto the page), the picture plays **without sound**. The intro never waits for a tap and never shows a button for it. If the owner wants sound every time, the only way is one tap before it starts (a Begin button or a tap anywhere), which the owner has chosen not to have. A saved `platform-sound` = `off` in `localStorage` (from an older Sound button) is still respected.

Other rules it follows:
- Plays **once for each browser tab** (`sessionStorage` key `intro-seen`). `?intro=1` plays it again, `?intro=0` skips it. The About page has a "Watch the opening again" link.
- A tap or click anywhere, or Escape, Enter or Space, ends it early. This is not a visible button. It is there so a keyboard user or an impatient visitor is never stuck.
- Reduced motion: no spinning dial, no slam, glint, sparkles or colour cycling. The logo just appears, about 3 seconds.
- No flashing. The only light effects are two soft rings, one glint and three sparkles, each fading out.
- If the script cannot load, the overlay hides itself after 8 seconds. With JavaScript off it never shows.
- The big logo and mask are downloaded only when the intro will play. A visit with `?intro=0`, or later in the same tab, downloads only the small logo.
- The menu underneath is `inert` while the intro plays, and focus moves to the title when it ends.
- A tab opened in the background waits until you look at it before it starts.

The sound is made with Web Audio in `intro.js`, like the games' sound (no audio files). The timeline is `plan()` at the top of that file, and the light effects in `intro.css` are timed to match the notes. The low notes are meant to feel like the box bass of old mento music. They are an approximation, not a recording.

**Adding a game:** put `data-year="1999"` on its card in `menu/index.html` (the year the card's title names). It gets a stamp in the colour of its Play button, and the intro makes room. The menu lists the games in Jamaica's timeline, oldest first: `menu/site.js` sorts the cards by `data-year` when the page loads, so a new card falls into place wherever it is written, and `npm test` fails if a card has no year or `index.html` lists them out of order (keep the file in order too, so the page is right before the script runs).

**Another island:** it needs its own logo and mask, the one-line description (`#intro .in-desc`), the cards, and a decision on whether islands share this site or each get their own. That is not decided.

Checking it (done for this version, repeat after changes):
- Look at it at desktop, phone, and phone-sideways sizes. Check that the stamps are all on screen, the logo and the description never overlap, and the description stays on one line.
- Run it once with sound allowed and once with sound blocked (Chromium flags `--autoplay-policy=no-user-gesture-required` and `--autoplay-policy=document-user-activation-required`). It must finish cleanly both ways, with no errors.
- Check the sound **by ear** on a phone speaker and on headphones. The code can only measure it: `IntroSting.build(offlineCtx, IntroSting.chain(offlineCtx), 0, IntroSting.plan(false))` renders it without a speaker. This version peaks at about -8 dBFS with a clean silent tail. Nobody has listened to it yet.

## Next steps (not built yet)

- **Previews, like a streaming library.** When a card is hovered or focused, play a 6 to 10 second silent clip of that game, recorded from the game's own camera by the test tooling. On phones, show the clip when the card scrolls into view. Until then the poster stays still.
- **An arrival card** at the start of each game ("You are arriving in Port Royal, Jamaica. 1692.") and "Back in 2026" when you leave, so the traveller idea runs through the games and not just the menu.
- **Continue your trip.** Each game already saves progress. The menu can show "Continue: chapter 3" on that game's card.
- **More traveller wording.** The cards say "Go there" (the owner chose it). Chapters could become "stops" inside the games if the owner wants.
- **Rows.** The kinds of story are built (see "The library"): chips that filter the cards. With about twelve games or more, the menu could also show a row for each kind, or for each era.
- **Switch on shared ratings.** Choose a small backend and set `RATINGS_URL` (see "Ratings backend").
- **Rate from inside a game.** Each game's last card can link to the menu with `?rate=<game id>`. The menu side is built.
- **Content notes for Mature 13+ games.** Each 13 card needs its own `data-warn` note, written with the game.

## Shared Chapters book (16 November 2026)

All ten games use the same cream book with dark borders, a Close button, a scrolling chapter list, and a fixed footer. The footer order and exact labels are **Unlock All | Restart | Credits**, from left to right. Teaching access is indicated with `aria-pressed` and the note above the list, while the button stays labelled Unlock All. Restart asks before deleting saved progress and keeps its label. This applies when Chapters opens from the title or the in-game journal.

`shared/chapters.css` owns this appearance and `tools/build.mjs` copies it into each game's site. Chapter dates, names, completion, access rules and save keys remain game-specific. Tivoli keeps its existing all-chapters access and journal unlock behavior.

Windrush uses `menu/windrush-kingston-quay.jpg`, captured from its actual Kingston quay scene. Its opening camera frames the cargo, passengers, gangway and ship, with gentle movement. Tivoli's opening uses its quiet-street artwork with background-only movement. Both respect reduced motion. `menu/selassie-arrival.jpg` shows the current corrected aircraft without importing the separate people work.
