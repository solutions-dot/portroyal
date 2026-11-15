# The platform: PastPort, the time-traveller idea, and the intro

This page is for the menu and the opening, the part of the site that sits above every game.
Read it before changing the menu header, the intro, the logo, or what the library is called.

## The name

**PastPort - Jamaica.** The owner chose it on 15 November 2026.

- **PastPort** is the platform. **Jamaica** is the first island edition. The owner may build editions for other Caribbean islands, so the island is always its own, second line, in a different type from the name (an italic serif, in the code; a brush script in the owner's logo).
- It is past plus passport, and kids understand it in a second. Each game is a stamp in your PastPort. "Port" also nods to the harbour in Port Royal.
- The capital P in the middle shows the two words. Write it **PastPort**, not Pastport, in names and titles.
- The page title and the About page say "PastPort - Jamaica".

Name check (November 2026): a web search found no brand called Pastport. The idea of a passport with stamps for history is common, though (Project Passport from Home School in the Woods, Passport to the Past from Gloucestershire Archives, Little Passports). This is **not** a trademark or domain check. Do that before the name goes on anything permanent.

Earlier names that were dropped or not chosen: Longtime (the first working name, which the owner did not like), Walk Good, Memba, Elsewhen, Doctor Bird, Wi Story, Rewind, Timeyard, Step Back.

## The logo

The owner's logo (shared in chat on 15 November 2026; **the file is not in the repo yet**): the words PAST and PORT stacked in chunky cream block letters with a gold edge and a dark green outline; a compass star over an arc of tick marks, inside a dark ring behind the letters; a postage stamp with the outline of Jamaica at the bottom left; and "Jamaica" in a gold brush script at the bottom right, overlapping the stamp and the T.

What the owner asked for: animate the logo in the opening, and make "Jamaica" cycle through colours.

What is in the code now is a **stand-in** drawn in code: a round stamp mark with a P in it, the name in mixed case in a sunset-to-sea colour sweep, and "Jamaica" in an italic serif. When the real file is added, it replaces these. The best files to add are a transparent PNG or an SVG, ideally with the parts as separate layers (the compass and ring, the PAST and PORT letters, the stamp, the "Jamaica" script), so each part can move on its own and the script can change colour.

## The traveller idea

The player is a **Traveller**. The platform is how they travel. Each game is a **destination**: a place and a year.

| Today's word | In the traveller idea |
|---|---|
| Games | Destinations (a place and a year) |
| Play | Go there |
| Chapters | Stops |
| Journal | Traveller's journal (it already is one) |
| Menu | Where do you want to go? |

**The Traveller's Rule: you can look, listen and learn. You cannot change what happened.**
This is already how every game works. The About page says "Your choices do not rewrite history", and the Garvey game buys the ship whatever you advise. The About page now says the rule in its first paragraph.

Tone for hard history:
- A traveller is a witness, not a tourist. Never use words like "adventure", "mission" or "unlock" for a disaster.
- The intro is calm and a little awed. It is never loud or jokey.
- Tivoli keeps its own rules (`docs/games/tivoli.md`), including its opt-in card before the 2010 chapters.

## The credit

"A world created by Kellz 5.0" is on the **menu** (the header) and the About page footer. It is **not** on the intro screen. That was the owner's choice.

## The intro

Files: `menu/intro.js`, `menu/intro.css`, the `#intro` markup and a few lines in the head of `menu/index.html`.
It touches no game.

What happens, about six seconds:
1. A dial and the current year, the line "Your passport to the past.", and a **Begin** button. (Browsers only allow sound after a tap, so the tap is the doorway.)
2. The dial runs backwards, one tick for every ten years. It stops at each game on the menu and a **passport stamp** lands, in that game's own colour, with a small wooden note that climbs a scale. A whoosh rises and the clicks slow down.
3. Two low plucked notes (D, then A) land. The centre of the mark slams down on the first, the name drops in on the second, and a bell rings (D, A, E: open and calm, neither happy nor sad).
4. The name (PastPort), the island ("Jamaica", cycling through colours), and one line about what it is ("Games that take you into Jamaica's past.") appear. Then the menu fades up with the cards one after another.

Rules it follows:
- Plays **once for each browser tab** (`sessionStorage` key `intro-seen`). `?intro=1` plays it again, `?intro=0` skips it. The About page has a "Watch the opening again" link.
- Any tap, Escape, or the Skip button ends it. Skipping before Begin makes no sound at all.
- A Sound on/off button on the first screen is remembered (`localStorage` key `platform-sound`).
- Reduced motion: no spinning dial, the stamps and name just appear, "Jamaica" does not cycle, about 3 seconds.
- No flashing. The only pulse is one soft ring at arrival.
- If the script cannot load, the overlay hides itself after 8 seconds. With JavaScript off it never shows.
- The menu underneath is `inert` while the intro plays, and focus moves to the title when it ends.

The sound is made with Web Audio in `intro.js`, like the games' sound (no audio files). The timeline is `plan()` at the top of that file. The low notes are meant to feel like the box bass of old mento music. They are an approximation, not a recording.

**Adding a game:** put `data-year="1999"` on its card in `menu/index.html`. It gets a stamp in the colour of its Play button, and the intro makes room.

**Another island:** change the island's name (`.brand-sub` and `#intro .in-island`), its flag (the `#flag-jm` symbol), the one-line description (`#intro .in-desc`), and the cards. Whether other islands share this site or each get their own is not decided yet.

Words, in `menu/index.html`: the name is `#intro .in-name`, the island is `.in-island`, the description is `.in-desc`.

Checking it (all done for this version, repeat after changes):
- Look at it at desktop, phone, and phone-sideways sizes. Check that the dial, stamps, Begin, Sound, Skip, the name, the island and the description never overlap, and that the description stays on one line.
- Check the sound **by ear** on a phone speaker and on headphones. The code can only measure it: `IntroSting.build(offlineCtx, IntroSting.chain(offlineCtx), 0, IntroSting.plan(false))` renders it without a speaker. This version peaks at about -8 dBFS with a clean silent tail. Nobody has listened to it yet.
- Run it once with real sound allowed (`--autoplay-policy=no-user-gesture-required`) and check the page logged no errors (see `docs/TESTING.md`).

## Next steps (not built yet)

- **Use and animate the owner's logo** in the intro (see "The logo" above): the compass and ticks turn in, PAST and PORT drop in, the stamp slams down on the first low note, "Jamaica" writes on and cycles colours.
- **Previews, like a streaming library.** When a card is hovered or focused, play a 6 to 10 second silent clip of that game, recorded from the game's own camera by the test tooling. On phones, show the clip when the card scrolls into view. Until then the poster stays still.
- **An arrival card** at the start of each game ("You are arriving in Port Royal, Jamaica. 1692.") and "Back in 2026" when you leave, so the traveller idea runs through the games and not just the menu.
- **Continue your trip.** Each game already saves progress. The menu can show "Continue: chapter 3" on that game's card.
- **Wording.** Change "Play" on the cards to "Go there", and chapters to "stops", if the owner wants the traveller idea in the menu.
- **Rows.** With about twelve games or more, group the menu into rows ("Storms and floods", "Freedom and leaders", "Everyday life"), or by era.
