/* Each era has its own recipe. Family identities stay explicit across time. */
export const CAST = {
  may48: { base: "wr_may48", sex: "f", who: "May" },
  sam48: { base: "wr_sam48", sex: "m", who: "Samuel", idle: "IdleM" },
  pearl48: { base: "wr_pearl48", sex: "f", who: "Pearl" },
  iris9: { base: "wr_iris9", sex: "f", who: "Iris", scale: 0.8 },
  lionel48: { base: "wr_lionel48", sex: "m", who: "Lionel", idle: "IdleM" },
  celia48: { base: "wr_celia48", sex: "f", who: "Celia" },
  gray48: { base: "wr_gray48", sex: "m", who: "Mr Gray", idle: "IdleM" },
  iris23: { base: "wr_iris23", sex: "f", who: "Iris" },
  may62: { base: "wr_may62", sex: "f", who: "May" },
  sam62: { base: "wr_sam62", sex: "m", who: "Samuel", idle: "IdleM" },
  pearl62: { base: "wr_pearl62", sex: "f", who: "Pearl" },
  iris79: { base: "wr_iris79", sex: "f", who: "Iris", idle: "OldIdle" },
  anita18: { base: "wr_anita18", sex: "f", who: "Anita" },
  maya12: { base: "wr_maya12", sex: "f", who: "Maya", scale: 0.8 },
  asha18: { base: "wr_asha18", sex: "f", who: "Asha" },
};
export const BASES = [...new Set(Object.values(CAST).map((x) => x.base))];
export function extraLook(i, era = "1948") {
  const ids =
    era === "2018"
      ? ["anita18", "asha18", "iris79", "maya12"]
      : era === "1962"
        ? ["may62", "sam62", "iris23", "pearl62"]
        : ["may48", "sam48", "celia48", "lionel48", "iris9"];
  return { ...CAST[ids[i % ids.length]], cast: ids[i % ids.length] };
}
