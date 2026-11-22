/* The people of today. Each body has its own recipe (tools/rose-hall/people). Everyone you meet is fictional. The real people of this
   story (Annie Palmer, John Rose Palmer, Rosa Palmer, and the people named in the Rose Hall Journal) are never shown: only their papers. */
export const CAST = {
  guide: { base: "rh_guide", sex: "f", who: "Miss Bryan" },
  archivist: { base: "rh_archivist", sex: "f", who: "Mrs Lindo" },
  warden: { base: "rh_warden", sex: "f", who: "Sister Reid" },
  cousin: { base: "rh_cousin", sex: "f", who: "Tia", scale: 0.8 },
};
export const CROWD = { rh_man: { sex: "m", idle: "IdleM" }, rh_elder: { sex: "m", idle: "OldIdle" } };
export const BASES = [...new Set([...Object.values(CAST).map((x) => x.base), ...Object.keys(CROWD)])];
