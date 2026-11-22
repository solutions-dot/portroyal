/* The people of 1772 and 1773. Each body has its own recipe (tools/hutchinson/people), built for the year and the person.
   Real people: Dr Jonathan Hutton, John Callendar and Hector (Lewis Hutchinson is never seen close: a dark shape at a window). Everyone else is fictional and says so in the journal. */
export const CAST = {
  hutton: { base: "hx_hutton", sex: "m", who: "Dr Hutton", idle: "IdleM" },
  hutchinson: { base: "hx_hutchinson", sex: "m", who: "Lewis Hutchinson", idle: "IdleM" },
  callendar: { base: "hx_callendar", sex: "m", who: "John Callendar", idle: "IdleM" },
  officer: { base: "hx_officer", sex: "m", who: "Captain Reid", idle: "IdleM" },
  clerk: { base: "hx_clerk", sex: "m", who: "The clerk", idle: "IdleM" },
  cudjoe: { base: "hx_cudjoe", sex: "m", who: "Cudjoe", idle: "OldIdle" },
  carter: { base: "hx_carter", sex: "m", who: "Sampson", idle: "IdleM" },
  juba: { base: "hx_juba", sex: "f", who: "Juba" },
  cubba: { base: "hx_cubba", sex: "f", who: "Cubba", idle: "OldIdle" },
  hector: { base: "hx_hector", sex: "m", who: "Hector", idle: "IdleM" },   /* real; he does not speak */
  sick: { base: "hx_sick", sex: "m", who: "A sick man", idle: "IdleM" },   /* the man the 1773 letter says slipped out of the house; seen only far off in the camera scene */
};
/* background people: one body per kind of person, made for the year and the place */
export const CROWD = {
  hx_man: { sex: "m", idle: "IdleM" },
  hx_woman: { sex: "f" },
  hx_townman: { sex: "m", idle: "IdleM" },
  hx_townwoman: { sex: "f" },
  hx_penman: { sex: "m", idle: "IdleM" },
  hx_penwoman: { sex: "f" },
};
export const BASES = [...new Set([...Object.values(CAST).map((x) => x.base), ...Object.keys(CROWD)])];
