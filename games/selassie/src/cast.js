/* Bodies are built only from this game's recipes; prefixes avoid shared-name collisions. */
export const BASES = [
  "sel_mum66",
  "sel_adina66",
  "sel_levi66",
  "sel_vendor30",
  "sel_girl66",
  "sel_boy66",
  "sel_crowdman66",
  "sel_crowdwoman66",
  "sel_emperor66",
  "sel_planno66",
  "sel_rastaelder66",
  "sel_rastaman66",
  "sel_rastawoman66",
  "sel_rastatam66",
  "sel_police66",
];
export const KIDS = { sel_girl66: 0.8, sel_boy66: 0.8 };
export const HATS = {
  sel_vendor30: ["Hat"],
  sel_crowdman66: ["Hat"],
  sel_emperor66: ["Cap"],
};
export const CAST = {
  adina: { base: "sel_adina66", who: "Grandma Adina", sex: "f" },
  mum: { base: "sel_mum66", who: "Mum", sex: "f" },
  levi: { base: "sel_levi66", who: "Uncle Levi", sex: "m" },
  vendor: { base: "sel_vendor30", who: "Mr. Brown", sex: "m" },
  boy: { base: "sel_boy66", who: "Teddy", sex: "m", scale: 0.8 },
  visitor: { base: "sel_crowdwoman66", who: "Miss Pearl", sex: "f" },
  emperor: {
    base: "sel_emperor66",
    who: "Haile Selassie I",
    sex: "m",
    historical: true,
  },
  planno: {
    base: "sel_planno66",
    who: "Mortimo Planno",
    sex: "m",
    historical: true,
  },
};
export function crowdLook(i, airport = false) {
  if (airport && i % 3 !== 2) {
    const base =
      i % 5 === 0
        ? "sel_rastawoman66"
        : i % 4 === 0
          ? "sel_rastaelder66"
          : i % 2 === 0
            ? "sel_rastatam66"
            : "sel_rastaman66";
    return {
      base,
      sex: base.includes("woman") ? "f" : "m",
      scale: 0.93 + (i % 5) * 0.025,
      rastafari: true,
    };
  }
  const woman = i % 3 === 0,
    kid = i % 13 === 0,
    base = kid
      ? i % 2
        ? "sel_girl66"
        : "sel_boy66"
      : woman
        ? "sel_crowdwoman66"
        : "sel_crowdman66";
  const shirts = [0xd9d0a9, 0x97b5af, 0xc38c70, 0x829f7b, 0xd5bb85, 0xdad3bd];
  return {
    base,
    sex: woman || base === "sel_girl66" ? "f" : "m",
    scale: KIDS[base] || 0.94 + (i % 7) * 0.018,
    hat: i % 4 === 0 ? "Hat" : false,
    tint: {
      Shirt: shirts[i % shirts.length],
      Collar: shirts[i % shirts.length],
      ...(woman
        ? { Skirt: shirts[i % shirts.length] }
        : { Breeches: [0x5a5f56, 0x755e45, 0x4a565a][i % 3] }),
    },
  };
}
