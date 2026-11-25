/* The people of the apron and the flight deck. All of them are fictional, and their journal pages say so. Marcia is the player's aunt, a stewardess on
   her first day; Mr Hines works on the apron; Captain Ross flies the DC-8; Mum waits in the waving gallery. The player is Dee, a child.
   Bodies made for this game (tools/air-jamaica/people, built by tools/garvey/era.py from the Windrush 1962 recipes): the 1969 crew in short, fitted
   dresses of yellow, hot pink or lime green, with a mix of straight hair, buns and afros (owner, 24 November 2026) and lipstick; the captain and his
   crew in the early pilot uniform from the owner's photograph (docs/games/air-jamaica.md, "Early pilot uniforms"): a navy double-breasted jacket with
   gold buttons, gold sleeve rings (four for the captain, three for the first officer, two for the flight engineer), gold wings, and a white-topped cap
   with a gold band and a round orange-red badge. The families on the apron are the Windrush 1962
   townspeople, the right period for them. */
export const CAST = {
  marcia: { base: "aj_marcia", sex: "f", who: "Aunt Marcia" },
  hines: { base: "aj_hines", sex: "m", who: "Mr Hines", idle: "IdleM" },
  ross: { base: "aj_ross", sex: "m", who: "Captain Ross", idle: "IdleM" },
  mum: { base: "aj_mum", sex: "f", who: "Mum" },
  /* chapter 3: Dee grown up (a Windrush 2018 body, the right kind of clothes for a passenger of the 2000s), the flying chef Louis Bailey (real; built from
     the owner's photograph, docs/games/air-jamaica.md), and Mr Clarke, a passenger (a Windrush 2018 body) */
  dee2: { base: "aj_dee04", sex: "f", who: "Mum" },
  chef: { base: "aj_chef", sex: "m", who: "Chef Bailey", idle: "IdleM" },
  clarke: { base: "aj_clarke04", sex: "m", who: "Mr Clarke", idle: "IdleM" },
  /* the later chapters, each in the clothes of their year (tools/air-jamaica/people): 1994, tucked-in blouses and polo shirts, belts, high-waisted
     trousers and jeans, white sneakers; 2004 and 2010, loose tops and polos worn out, straight jeans, sneakers and sandals, caps and fine chains */
  marcia94: { base: "aj_marcia94", sex: "f", who: "Aunt Marcia" },
  hines94: { base: "aj_hines94", sex: "m", who: "Mr Hines", idle: "IdleM" },
  marcia10: { base: "aj_marcia10", sex: "f", who: "Aunt Marcia" },
  dee10: { base: "aj_dee10", sex: "f", who: "Mum" },
  grant: { base: "aj_grant10", sex: "m", who: "Mr Grant", idle: "IdleM" },
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
  aj_guest94a: { sex: "m", idle: "IdleM" },
  aj_guest94b: { sex: "f" },
  aj_guest94c: { sex: "m", idle: "IdleM" },
  aj_pass04: { sex: "m", idle: "IdleM" },
  aj_pass10: { sex: "m", idle: "IdleM" },
  aj_pass10w: { sex: "f" },
};
export const BASES = [...new Set([...Object.values(CAST).map((x) => x.base), ...Object.keys(CROWD)])];
