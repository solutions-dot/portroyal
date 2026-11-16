# Menu and Chapters reconciliation, 16 November 2026

The owner found missing artwork and opening-screen changes, then chose one Chapters layout for every game. This follow-up starts from main `a65e2a464d7f85fc8b2944a791c864682c6871bf`, after the non-people consolidation in PR #107. The unfinished people remain in draft PR #108.

## Result

- Every game uses `shared/chapters.css`: a cream book, dark borders, Close, separate date/title/status columns, a scrolling list and a fixed footer. The title-screen route and in-game journal route open the same panel.
- Footer labels and native keyboard order are exactly **Unlock All | Restart | Credits**. Teaching mode does not rename Unlock All. Restart retains its label and asks before erasing progress. Cancelling preserves the save.
- Tivoli now uses that book. Its eight chapter dates, names, descriptions and access rules are retained. The journal, notifications and four touch arrows from the owner's earlier corrections remain.
- Windrush's card and opening use the agreed Kingston quay composition: the ship, passengers, gangway, cranes and foreground cargo. The card artwork and opening camera move gently, respecting reduced motion.
- Tivoli's opening has a proper story description and a quiet street background with gentle background-only movement. Its May 2010 opt-in and reading path are unchanged.
- The Melissa menu card is titled **Hurricane Melissa**. Its secondary description is unchanged. Existing games have no New badge.
- The Selassie card is recaptured with the corrected rounded aircraft tail. The plane reads **ETHIOPIAN AIRLINES** on both sides. The White Nile is omitted at the owner's latest instruction. Research and the distinction between reference aircraft are recorded in `docs/games/selassie.md`.

## Preservation checks

- All 54 branch heads in the original branch inventory remain ancestors of current main. No branch history was rewritten or deleted.
- All 369 existing packed model files, including the people and excluding generated animation bundles, are byte-for-byte unchanged in this follow-up.
- The five owner-uploaded reference photographs are byte-for-byte unchanged.
- The airframe geometry and tail code match the baseline exactly. Its diff is confined to comments and the lettering texture/placement.
- Every chapter content module, the shared engine, animation library, rig and shared character builder are unchanged.
- Save keys and saved story data formats are unchanged. The separate original working tree and its uncommitted work are untouched.
- Main and this branch retain disabled automatic Vercel deployments. No deployment is performed.

## Verification

The public collection build covers all ten games. `npm test` passes 222 regressions. Content lint reports 45 existing baseline findings and no new findings.

`tools/review/chapter-books.mjs` exercises both chapter entry points, labels and DOM order, teaching access, Restart cancellation/save preservation, Credits navigation, paper colours, row overlap and viewport fit. It captures desktop and phone screenshots. A Credits stacking regression found in Port Royal was fixed while retaining its existing panel handlers. All 30 runs pass: ten games at 1280, 390 and 320 pixels, with both title and in-game chapter routes. Tivoli's final centered desktop book was recaptured and checked again. Its eight-chapter replay also passes, including the chapter 5 reading route and returning to chapter 1 without retaining old scene people.

The public opening scenes pass at 1280x800, 390x800 and 667x375, including artwork URLs, no New badges, the Melissa heading, reduced-motion CSS, hidden completed loading bars and no script or local asset errors. Desktop and phone menu/contact checks also pass. The complete build and 222 regressions pass, with 45 existing content lint findings and no new ones.

Evidence: [chapter results](menu-chapters-20261116/chapter-results.json), [Tivoli replay](menu-chapters-20261116/tivoli-replay.json), [opening results](menu-chapters-20261116/opening-results.json), [preservation inventory](menu-chapters-20261116/preservation.json).

Screens: [Tivoli Chapters](menu-chapters-20261116/tivoli-chapters.png), [phone in-game Chapters](menu-chapters-20261116/nanny-phone-chapters.png), [Windrush opening](menu-chapters-20261116/windrush-opening.png), [Tivoli opening](menu-chapters-20261116/tivoli-opening.png), [aircraft lettering](menu-chapters-20261116/aircraft-lettering.png).
