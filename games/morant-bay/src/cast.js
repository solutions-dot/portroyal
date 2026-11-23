/* The people of 1865. Each body has its own recipe (tools/morant-bay/people), built for the year and the person.
   Real people: Paul Bogle and George William Gordon (neither speaks; Gordon is seen only in a card). Everyone else is fictional and says so in the journal. */
export const CAST = {
  mother: { base: "mb_mother", sex: "f", who: "Mama" },
  gran: { base: "mb_gran", sex: "f", who: "Gran", idle: "OldIdle" },
  father: { base: "mb_father", sex: "m", who: "Papa", idle: "IdleM" },
  brother: { base: "mb_brother", sex: "m", who: "Sammy", idle: "Idle", scale: 1 / 1.45 },   /* a boy of six: his body is built big so every clip fits (the recipe's upscale), and shrunk back here */
  deacon: { base: "mb_deacon", sex: "m", who: "Deacon Clarke", idle: "OldIdle" },
  ada: { base: "mb_ada", sex: "f", who: "Miss Ada" },
  bogle: { base: "mb_bogle", sex: "m", who: "Paul Bogle", idle: "IdleM" },   /* real; he does not speak */
  constable: { base: "mb_constable", sex: "m", who: "A constable", idle: "IdleM" },
  secretary: { base: "mb_vestryman", sex: "m", who: "A clerk at King's House", idle: "IdleM" },
};
/* background people: one body per kind of person, made for the year and the place */
export const CROWD = {
  mb_man: { sex: "m", idle: "IdleM" },
  mb_woman: { sex: "f" },
  mb_man2: { sex: "m", idle: "IdleM" },
  mb_woman2: { sex: "f" },
  mb_oldman: { sex: "m", idle: "OldIdle" },
  mb_townman: { sex: "m", idle: "IdleM" },
  mb_soldier: { sex: "m", idle: "IdleM", held: "musket" },
  mb_constable: { sex: "m", idle: "IdleM" },
  mb_vestryman: { sex: "m", idle: "IdleM" },
};
export const BASES = [...new Set([...Object.values(CAST).map((x) => x.base), ...Object.keys(CROWD)])];
