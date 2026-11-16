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
/* Background people. A number gives each one a body, a height and everyday 1960s clothes in its own colours, from a hash, so neighbours in a
   crowd differ (no repeating pattern along a row). Children and elders are mixed in everywhere. At the airport about half are Rastafari
   visitors (four different recipes: an elder, a younger man, a woman and a man in a knitted tam); their clothes vary too.
   `colors` recolours the shirt (or dress) and the trousers (or skirt) of a joined crowd body (main.js, recolour); full bodies use `tint`. */
const hash = (i, k) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const pick = (L, i, k) => L[Math.floor(hash(i, k) * L.length) % L.length];
// no browns, tans or pinks near skin, so a shirt never reads as a bare chest
export const SHIRTS = [0xe8e4d8, 0xdcd6c0, 0x9fb5c6, 0x9dbb97, 0xc8a24a, 0x9b9d97, 0x56805a, 0xb0362e, 0x46557a, 0xe0d48e, 0x7f6a8e, 0x6f9fa8, 0xf2efe6];
export const LEGS = [0x3f4241, 0x6a5139, 0x9a8a62, 0x39425c, 0x76776f, 0x5e6449, 0x2f3433];
export const SKIRTS = [0x3f5f7a, 0x7c3f3a, 0x5d7552, 0xb38a4a, 0x46454d, 0x8b6f9b, 0xc9b98f, 0x2f5a57];
export function crowdLook(i, airport = false) {
  const r = hash(i, 1),
    kid = hash(i, 5) < (airport ? 0.09 : 0.08);
  let base;
  if (kid) base = hash(i, 6) < 0.5 ? "sel_girl66" : "sel_boy66";
  else if (airport && r < 0.56) {
    const k = hash(i, 2);
    base = k < 0.22 ? "sel_rastawoman66" : k < 0.42 ? "sel_rastaelder66" : k < 0.68 ? "sel_rastatam66" : "sel_rastaman66";
  } else base = hash(i, 3) < 0.45 ? "sel_crowdwoman66" : "sel_crowdman66";
  const woman = /woman|girl/.test(base),
    elder = base === "sel_rastaelder66";
  const scale = kid
    ? KIDS[base] * (0.9 + hash(i, 7) * 0.16)
    : (woman ? 0.9 : 0.93) + hash(i, 7) * (elder ? 0.07 : 0.13);
  const keep = /rasta/.test(base) && hash(i, 8) < 0.3; // some keep their recipe's own clothes
  const shirt = pick(SHIRTS, i, 9),
    legs = woman ? pick(SKIRTS, i, 10) : pick(LEGS, i, 10);
  return {
    base,
    sex: woman ? "f" : "m",
    scale,
    rastafari: /rasta/.test(base),
    hat: base === "sel_crowdman66" ? hash(i, 4) < 0.4 && "Hat" : undefined,
    colors: keep ? null : { shirt, legs },
    tint: keep
      ? undefined
      : {
          Shirt: shirt,
          Collar: shirt,
          ...(woman ? { Skirt: legs } : { Breeches: legs }),
        },
  };
}
