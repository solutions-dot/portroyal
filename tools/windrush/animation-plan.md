# Windrush motion plan

Use the shared clips by their real names. Keep additions game-only until the shared-animation coordinator approves them. Do not rebuild or replace `shared/models/anims.js` in this PR.

| Requested motion | Current implementation / next asset |
|---|---|
| Male idle | Shared `IdleM`, used for Samuel and Lionel |
| Elder idle | Shared `OldIdle`, used for Iris in 2018 |
| Looking around | Shared `LookAround` / `HeadTurn`, staggered ambient reactions |
| Listening | Shared `Nod` in quiet reactions; a dedicated listening loop remains useful |
| Older person's walk | Shared ordinary `Walk` paced to 0.85 m/s for the guide; a dedicated gentle elder walk remains useful |
| Carrying a bag or bucket | Shared carry/grip system and visible first-person carry slot. `CarryBagWalk` exists for future NPC errands |
| Arms crossed; hands behind back | Dedicated natural idle loops still needed; do not substitute boxing or rifle idles |
| Sweeping; hammering; hoeing | Dedicated work loops with a real tool grip and aligned work surface still needed |
| Washing | Dedicated two-hand basin motion still needed. Current player task carries water and hangs a visibly changed cloth |
| Child hops and skips | Dedicated child-safe loops still needed; ordinary walking remains the traversal baseline |
| Seller calling out | Dedicated open-handed selling gesture still needed; aggressive `Yell` is not used as a substitute |

A new clip needs its own documented source/licence, shared rig retargeting, clean loop seam when looping, tool/hand contact checks, full and light body review, and actual in-game screenshots. Include only used clips in `games/windrush/anim-clips.json`.
