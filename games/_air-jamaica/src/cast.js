/* The people of the apron and the flight deck. All of them are fictional, and their journal pages say so. Marcia is the player's aunt, a stewardess on
   her first day; Mr Hines works on the apron; Captain Ross flies the DC-8; Mum waits in the waving gallery. The player is Dee, a child.
   Bodies made for this game (tools/air-jamaica/people, built by tools/garvey/era.py from the Windrush 1962 recipes): the 1969 crew in short, fitted
   dresses of yellow, hot pink or lime green, with a mix of straight hair, buns and afros (owner, 24 November 2026) and lipstick; the captain and his
   crew in navy jackets and caps (a general picture: the 1969 captain's uniform is not yet sourced). The families on the apron are the Windrush 1962
   townspeople, the right period for them. Still to add: the crew's white gloves (the builder has no gloves yet). */
export const CAST = {
  marcia: { base: "aj_marcia", sex: "f", who: "Aunt Marcia" },
  hines: { base: "aj_hines", sex: "m", who: "Mr Hines", idle: "IdleM" },
  ross: { base: "aj_ross", sex: "m", who: "Captain Ross", idle: "IdleM" },
  mum: { base: "aj_mum", sex: "f", who: "Mum" },
};
export const CROWD = {
  aj_crew1: { sex: "f" },
  aj_crew2: { sex: "f" },
  aj_crew3: { sex: "f" },
  aj_crew4: { sex: "f" },
  aj_crew5: { sex: "f" },
  aj_first: { sex: "m", idle: "IdleM" },
  aj_engineer: { sex: "m", idle: "IdleM" },
  aj_ross: { sex: "m", idle: "IdleM" },
  wr_lwoman62: { sex: "f" },
  wr_bwoman62: { sex: "f" },
  wr_may62: { sex: "f" },
  wr_bman62: { sex: "m", idle: "IdleM" },
  wr_sam62: { sex: "m", idle: "IdleM" },
  wr_bboy62: { sex: "m", scale: 0.8 },
};
export const BASES = [...new Set([...Object.values(CAST).map((x) => x.base), ...Object.keys(CROWD)])];
