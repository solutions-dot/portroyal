# toigo_male_suit_tie_and_jacket

A man's suit (jacket with collar and lapels, shirt collar and front, tie, trousers, buttons) by Margaret Toigo, from the MakeHuman community
asset pack `suits01`, licence CC0 (https://static.makehumancommunity.org/assets/assetpacks/suits01.html). Only the files the builder needs are
kept: the fitting file (`.mhclo`), the mesh (`.obj`), its material and the colour texture, which is read only to tell the parts apart (the game
colours every part from the recipe). Fitted to a body by `tools/people/outfit.py` (see `docs/PIPELINE.md`, "Fitted garments").

Worn by every man in a jacket in every game since 21 November 2026. The builder makes the jacket hang from the chest, gives its sleeves ease, keeps the lapels as their
own piece (`Lapels`) so they are never simplified, and can add a waistcoat (`"waistcoat": true`) or leave the tie off (`"tie": false`).
