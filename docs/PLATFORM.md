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

"A world created by Kellz 5.0" is on the **menu** (the header) and the About page footer. It is **not** on the intro screen. That was the owner's choice.

## Game opening screens

All game opening screens have a Main Menu button linking to `../../../menu/`. It is a normal link styled like Chapters and is available while models load, without a network probe or a check for the platform's name. Journal and reset links use the same destination.

The standard order is Start (or Continue when a saved game is available), Chapters, Main Menu, then the loading bar while the game loads. The bar hides automatically as soon as Start or Continue is enabled. Tivoli keeps its extra Journal button after Main Menu. Games without chapter support omit Chapters. The saved-progress note appears only when saving is supported. Creator credits are removed from the opening screens; existing Credits panels remain available through Chapters.

`shared/title.css` owns the shared control styles and is copied to each game's `site/title.css` by `tools/build.mjs`. The template uses it too. Keep every opening screen usable on narrow phones and short landscape screens.

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
- **Rows.** With about twelve games or more, group the menu into rows ("Storms and floods", "Freedom and leaders", "Everyday life"), or by era.
