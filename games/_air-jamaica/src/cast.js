/* The people of the apron, 1 April 1969. All of them are fictional, and their journal pages say so. Marcia is the player's aunt, a stewardess
   on her first day; Mr Hines works on the apron; Captain Ross flies the DC-8. The player is Dee, a child.
   STAND-INS (docs/games/air-jamaica.md, "People"): until bodies are built for the 1969 crew (a mini dress in yellow, pink or lime green,
   white gloves; a captain's jacket with gold rings), these use the 1962 bodies built for Windrush (wr_*62). They are the right period and
   the right kind of people, but their clothes are not the airline's. Do not call a stand-in done (owner rule 15). */
export const CAST = {
  marcia: { base: "wr_pearl62", sex: "f", who: "Aunt Marcia" },
  hines: { base: "wr_bman62", sex: "m", who: "Mr Hines", idle: "IdleM", raw: true },
  ross: { base: "wr_conductor62", sex: "m", who: "Captain Ross", idle: "IdleM", raw: true },
};
export const CROWD = {
  wr_lwoman62: { sex: "f" },
  wr_bwoman62: { sex: "f" },
  wr_may62: { sex: "f" },
  wr_pearl62: { sex: "f" },
  wr_bman62: { sex: "m", idle: "IdleM" },
  wr_sam62: { sex: "m", idle: "IdleM" },
  wr_bboy62: { sex: "m", scale: 0.8 },
};
export const BASES = [...new Set([...Object.values(CAST).map((x) => x.base), ...Object.keys(CROWD)])];
