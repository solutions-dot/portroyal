# Likenesses: DECIDED (owner, 23 November 2026)

Owner's direction: "we need to model our national heroes to the images we accept as them."

## Accepted

| Person | The accepted image | File in this pack |
|---|---|---|
| **Paul Bogle** | The photograph Jamaica has used since 1959 (National Library of Jamaica item 6195, D0006926): a young man seated in a dark three-piece suit, a high frilled collar or cravat, a watch chain across the waistcoat, short hair, no beard. The owner accepts it as him. | `images/restricted/bogle-nlj6195-the-1959-photograph.jpg` |
| **George William Gordon** | The portrait on the Bank of Jamaica $10 note: swept-back wavy hair, side-whiskers, small round wire spectacles, a high white collar with a cravat, a dark coat. The owner accepts it as him. | `images/restricted/gordon-10-dollar-note-portrait-crop.jpg`, `images/restricted/gordon-10-dollar-note-1994-front.jpg` |

## How it is built (docs/STANDARD.md, "A real person's likeness"; docs/games/garvey.md)

- Shape the face with MakeHuman targets against the accepted image, record the image and its source in the game's doc, and check every later change against it. Keep the working build in `tools/morant-bay/people/`.
- **Rule 9 (skin):** `Skin` stays inside `[134, 90, 64]` to `[156, 108, 80]` and is lightened in game. The Gordon note is blue engraving ink, so it tells us nothing about his colouring: use the rule 9 range, with a little variety, and judge in a game screenshot.
- The images are references, never textures.

## What the journal says (rule 3: tell the truth about each picture)

- **Bogle:** "No picture made in his lifetime is certain. This is the photograph Jamaica has used for him since 1959. Some people doubt it shows him." (The doubts: David Boxer questioned it and suggested a younger relative; the American claim that it is Thomas L. Jennings is improbable because he died in 1859 and the sitter is young; the original tintype is missing; Veerle Poupeye, "Bogle versus Jennings", 2022.)
- **Gordon:** "This is the portrait on the Jamaican ten-dollar note." (The note's own source, photograph or engraving, is not known.)
- Neither of them speaks: their words come only from real documents shown on screen.

## Still to decide

1. **Age.** Bogle was about 43 in 1865 and the sitter looks younger. Keep the sitter's face as it is, or age it a little? (My suggestion: keep it, and say so in the journal.)
2. **Dress.** For Bogle, the photograph's three-piece suit is a studio portrait. The Commission does not say what he wore on the march. Gordon's note portrait shows a dark coat and cravat.
3. **A second look for Gordon.** The Princeton post says its 1865 album holds a portrait of Gordon. If the owner finds it, compare it with the note (it may be where the note's portrait comes from).

## Other real people with contemporary photographs (found in the Princeton album, not yet accepted)

- **Edward John Eyre** and **Brigadier-General Alexander Nelson:** one photograph each (see `images/restricted/`). Eyre has no invented words.
- **"Mr Price, Murdered":** a standing portrait of the Black vestryman. The game never shows his death. Whether to model him on his portrait is for the owner, with care.
- **Colonel Fyfe and Maroons:** a studio photograph of Fyfe with two Maroons in leaf camouflage, and another of Maroons in leaves. A real source for Maroon dress. Moore Town reviews anything that shows Maroons.

## The others (from before)

Garvey: done from photographs (`docs/games/garvey.md`). Nanny and Samuel Sharpe: no image made in their lifetimes; only artists' pictures; Nanny's face on the $500 note (1994) is imagined; Moore Town's review decides. Manley and Bustamante: photographs exist; no game uses them yet. Ask the NLJ before any NLJ image goes beyond review.
