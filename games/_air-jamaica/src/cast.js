/* The people of 1799. Each body has its own recipe (tools/shark-papers/people). Real: Michael Fitton and Hugh Wylie (their reported words
   of that morning, and a few imagined everyday lines, flagged on their journal pages) and Thomas Briggs, who does not speak.
   Fictional: Mr Cato the boatswain, Ben on the quay, the clerk, and Jem, the ship's boy you play. The judge was real, but no source found names him:
   he sits on the bench and has no words. */
export const CAST = {
  fitton: { base: "sp_fitton", sex: "m", who: "Mr Fitton", idle: "IdleM" },
  wylie: { base: "sp_wylie", sex: "m", who: "Mr Wylie", idle: "IdleM" },
  cato: { base: "sp_cato", sex: "m", who: "Mr Cato", idle: "IdleM" },
  ben: { base: "sp_ben", sex: "m", who: "Ben", idle: "IdleM" },
  clerk: { base: "sp_clerk", sex: "m", who: "The clerk", idle: "IdleM" },
};
export const CROWD = { sp_judge: { sex: "m", idle: "IdleM" }, sp_briggs: { sex: "m", idle: "IdleM" }, sp_seaman: { sex: "m", idle: "IdleM" }, sp_seaman2: { sex: "m", idle: "IdleM" } };
export const BASES = [...new Set([...Object.values(CAST).map((x) => x.base), ...Object.keys(CROWD)])];
