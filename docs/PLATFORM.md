# The platform: name, time-traveller idea, and the intro

This page is for the menu and the opening, the part of the site that sits above every game.
Read it before changing the menu header, the intro, or what the library is called.

## The name

**Working name: Longtime.** Not final. The owner chooses.

Why it fits:
- In Jamaican speech "long time" is what you say when you have not seen someone for ages ("a lang time mi nuh si yuh"), and "from long time" means "since long ago". It sounds like a friendly greeting from the past.
- It is one short word, easy to say and to remember, and easy to set as a wordmark.
- It is neutral in tone. The library holds a hurricane, a train crash and a fire as well as a hero and a town, so the name must not sound like a party.
- A quick web search (November 2026) found no history-game brand called Longtime. This is not a trademark or domain check. Do that before the name goes on anything permanent.

Other names that were considered:
- **Rewind**: dancehall DJs "rewind" a tune to play it again. Catchy, but the name is crowded and it sounds too much like a party for Kendal, Tivoli and Eventide.
- **Timeyard**: "yard" means home or place. Fine, but it says less about time travel.
- **Step Back**: plain and clear, but it could be anything.

**To change the name:** edit the text in `#intro` in `menu/index.html` (`.in-name` and `.in-tag`). The letters animate on their own. The menu header, the page title and `about.html` still say "Jamaican History Games" and are separate on purpose. Change them when the owner picks.

## The time-traveller idea

The player is a **Traveller**. The platform is how they travel. Each game is a **destination**: a place and a year.

| Today's word | In the traveller idea |
|---|---|
| Games | Destinations (a place and a year) |
| Play | Go there |
| Chapters | Stops |
| Journal | Traveller's journal (it already is one) |
| Menu | Where do you want to go? |

**The Traveller's Rule: you can look, listen and learn. You cannot change what happened.**
This is already how every game works. The About page says "Your choices do not rewrite history", and the Garvey game buys the ship whatever you advise. The rule makes it a feature of the platform instead of a footnote.

Tone for hard history:
- A traveller is a witness, not a tourist. Never use words like "adventure", "mission" or "unlock" for a disaster.
- The intro is calm and a little awed. It is never loud or jokey.
- Tivoli keeps its own rules (`docs/games/tivoli.md`), including its opt-in card before the 2010 chapters.

## The intro

Files: `menu/intro.js`, `menu/intro.css`, the `#intro` markup and a few lines in the head of `menu/index.html`.
It touches no game.

What happens, about five seconds:
1. A dial and the current year. A **Begin** button. (Browsers only allow sound after a tap, so the tap is the doorway.)
2. The dial runs backwards, one tick for every ten years, with a rising whoosh and clicks that slow down. The year counts back to 1690, the earliest game.
3. Two low plucked notes (D, then A) land and a bell rings (D, A, E: open and calm, neither happy nor sad).
4. The name rises letter by letter, then the menu fades up with the cards one after another.

Rules it follows:
- Plays **once for each browser tab** (`sessionStorage` key `intro-seen`). `?intro=1` plays it again, `?intro=0` skips it. The About page has a "Watch the opening again" link.
- Any tap, Escape, or the Skip button ends it. Skipping before Begin makes no sound at all.
- A Sound on/off button on the first screen is remembered (`localStorage` key `platform-sound`).
- Reduced motion: no spinning dial, the name just appears, about 3 seconds.
- No flashing. The only pulse is one soft ring at arrival.
- If the script cannot load, the overlay hides itself after 8 seconds. With JavaScript off it never shows.
- The menu underneath is `inert` while the intro plays, and focus moves to the title when it ends.

The sound is made with Web Audio in `intro.js`, like the games' sound (no audio files). The timing is `plan()` at the top of that file. The low notes are meant to feel like the box bass of old mento music. They are an approximation, not a recording.

Checking it (all done for the first version, repeat after changes):
- Look at it at desktop, phone, and phone-sideways sizes. Check that the dial, Begin, Sound, Skip and the name never overlap.
- Check the sound **by ear** on a phone speaker and on headphones. The code can only measure it: `IntroSting.build(offlineCtx, IntroSting.chain(offlineCtx), 0, IntroSting.plan(false))` renders it without a speaker. The first version peaks at about -8 dBFS with a clean silent tail.
- Run it once with real sound allowed (`--autoplay-policy=no-user-gesture-required`) and check the page logged no errors (see `docs/TESTING.md`).

## Next steps (not built yet)

- **Previews, like a streaming library.** When a card is hovered or focused, play a 6 to 10 second silent clip of that game, recorded from the game's own camera by the test tooling. On phones, show the clip when the card scrolls into view. Until then the poster stays still.
- **An arrival card** at the start of each game ("You are arriving in Port Royal, Jamaica. 1690.") and "Back in 2026" when you leave, so the traveller idea runs through the games and not just the menu.
- **Continue your trip.** Each game already saves progress. The menu can show "Continue: chapter 3" on that game's card.
- **Rows.** With about twelve games or more, group the menu into rows ("Storms and floods", "Freedom and leaders", "Everyday life"), or by era.
- **A small mark** (the dial) for the tab icon and the loading screen.
