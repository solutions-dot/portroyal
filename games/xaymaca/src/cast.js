/* The people of 1503 and 2026. Each body has its own recipe (tools/xaymaca/people). Real: Diego Mendez (imagined everyday words, flagged on
   his journal page), the cacique of Maima and the interpreter (real, unnamed, imagined words). Fictional: Grandmother, Cousin, the runner, and
   Miss Sharon the park guide. Columbus and his brother are not shown: Columbus is heard only through the interpreter. */
export const CAST = {
  gran: { base: "xa_gran", sex: "f", who: "Grandmother", idle: "Idle" },
  cousin: { base: "xa_cousin", sex: "m", who: "Cousin", idle: "IdleM" },
  cacique: { base: "xa_cacique", sex: "m", who: "The cacique", idle: "IdleM" },
  runner: { base: "xa_runner", sex: "m", who: "A runner", idle: "IdleM" },
  interp: { base: "xa_interp", sex: "m", who: "The interpreter", idle: "IdleM" },
  mendez: { base: "xa_mendez", sex: "m", who: "Diego Mendez", idle: "IdleM" },
  guide: { base: "xa_guide", sex: "f", who: "Miss Sharon", idle: "Idle" },
};
export const CROWD = {
  xa_man: { sex: "m", idle: "IdleM" }, xa_man2: { sex: "m", idle: "IdleM" }, xa_woman: { sex: "f", idle: "Idle" }, xa_woman2: { sex: "f", idle: "Idle" },
  xa_girl: { sex: "f", idle: "Idle", scale: 0.8 }, xa_boy: { sex: "m", idle: "Idle", scale: 0.8 },
  xa_sailor: { sex: "m", idle: "IdleM" }, xa_sailor2: { sex: "m", idle: "IdleM" },
  xa_visitor: { sex: "m", idle: "IdleM" },
};
export const BASES = [...new Set([...Object.values(CAST).map((x) => x.base), ...Object.keys(CROWD)])];
