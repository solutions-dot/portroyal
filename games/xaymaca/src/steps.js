/* The story table (engine/story.js). t: talk. d: carry something and put it down (TASKS). l: look at or do something that changes where
   you can see it (LOOKS). w: a card, a camera scene or the quiz. show: the story people who are there in that step. */
const row = (place, goal, needs, next, extra = {}) => ({ place, goal, needs, next, ...extra });
const t = (place, goal, ids, next, extra) => row(place, goal, { talk: ids }, next, extra);
const d = (place, goal, ids, next, extra) => row(place, goal, { do: ids.map((id) => ({ id, carry: id })) }, next, extra);
const l = (place, goal, ids, next, extra) => row(place, goal, { do: ids }, next, extra);
const w = (place, goal, card, next, extra = {}) => ({ place, goal, wait: true, card, next, ...extra });
const FAM = ["gran", "cousin"];
export const STEPS = {
  /* 1. Ships on the bay (June 1503) */
  8: w("maima", "Something is coming into the bay.", "film", 9, { film: "arrival", show: FAM }),
  9: w("maima", "Something is coming into the bay.", "playing", 10, { film: "arrival", show: FAM }),
  10: t("maima", "Talk to Grandmother at the fire.", ["gran"], 11, { show: FAM, journal: "you" }),
  11: l("maima", "Turn the cassava bread on the griddle.", ["buren"], 12, { show: FAM, journal: "casabe" }),
  12: t("maima", "Find Cousin at the edge of the hill.", ["cousin"], 13, { show: FAM, journal: "cousin" }),
  13: l("maima", "Look down at the ships from the rock.", ["lookout"], 14, { show: FAM, journal: "ships" }),
  14: d("maima", "Carry the cassava bread to Cousin's basket.", ["bread"], 15, { show: FAM }),
  15: t("maima", "Talk to Cousin.", ["cousin"], 16, { show: FAM }),
  16: l("maima", "Look at Grandmother's zemi in her house.", ["zemi"], 20, { show: FAM, journal: "zemi" }),
  /* 2. Bread for bells (July 1503) */
  20: t("shore", "Talk to Cousin by the canoe.", ["cousin"], 21, { show: ["cousin"] }),
  21: d("shore", "Carry the basket of bread to the canoe.", ["basket"], 22, { show: ["cousin"] }),
  22: w("shore", "Out to the ships.", "film", 23, { film: "trade", show: ["cousin"] }),
  23: w("shore", "Out to the ships.", "playing", 24, { film: "trade", show: ["cousin"] }),
  24: l("shore", "Look at what the sailors gave you.", ["bell"], 25, { show: ["cousin", "interp", "mendez"], journal: "bell" }),
  25: t("shore", "Talk to the man from the ships.", ["interp"], 26, { show: ["cousin", "interp", "mendez"], journal: "interpreter" }),
  26: t("shore", "Talk to Diego Mendez.", ["mendez"], 27, { show: ["cousin", "interp", "mendez"], journal: "mendez" }),
  27: t("shore", "Talk to Cousin.", ["cousin"], 30, { show: ["cousin", "interp", "mendez"] }),
  /* 3. The paddlers (July 1503) */
  30: t("shore", "Talk to Grandmother.", ["gran"], 31, { show: FAM }),
  31: d("shore", "Fill Cousin's calabash at the stream, and bring it to him.", ["calabash"], 33, { show: FAM }),
  33: t("shore", "Say goodbye to Cousin.", ["cousin"], 34, { show: FAM }),
  34: w("shore", "The canoes set off.", "film", 35, { film: "depart", show: FAM }),
  35: w("shore", "The canoes set off.", "playing", 36, { film: "depart", show: FAM }),
  36: w("crossing", "Out on the open sea.", "film", 37, { film: "crossing" }),
  37: w("crossing", "Out on the open sea.", "playing", 40, { film: "crossing" }),
  /* 4. The ten canoes (January 1504) */
  40: w("maima", "Shouting down on the ships.", "film", 41, { film: "mutiny", show: ["gran", "cacique"] }),
  41: w("maima", "Shouting down on the ships.", "playing", 42, { film: "mutiny", show: ["gran", "cacique"] }),
  42: t("maima", "Talk to Grandmother.", ["gran"], 43, { show: ["gran", "cacique"], journal: "mutiny" }),
  43: d("maima", "Carry the cassava bread into the house.", ["store"], 44, { show: ["gran", "cacique"] }),
  44: t("maima", "Talk to the cacique.", ["cacique"], 45, { show: ["gran", "cacique", "runner"], journal: "cacique" }),
  45: t("maima", "A runner has come from the east. Talk to him.", ["runner"], 50, { show: ["gran", "cacique", "runner"] }),
  /* 5. The red moon (29 February 1504) */
  50: t("night", "Talk to the interpreter by the fire.", ["interp"], 51, { show: ["gran", "cacique", "interp"] }),
  51: t("night", "Talk to the cacique.", ["cacique"], 52, { show: ["gran", "cacique", "interp"] }),
  52: t("night", "Talk to Grandmother at the edge of the hill.", ["gran"], 53, { show: ["gran", "cacique", "interp"] }),
  53: w("night", "The moon is rising.", "film", 54, { film: "moon", show: ["gran", "cacique", "interp"] }),
  54: w("night", "The moon is rising.", "playing", 55, { film: "moon", show: ["gran", "cacique", "interp"] }),
  55: t("night", "Talk to Grandmother.", ["gran"], 60, { show: ["gran", "cacique", "interp"] }),
  /* 6. When the ships left (May to June 1504) */
  60: t("maima", "Talk to Grandmother.", ["gran"], 61, { show: ["gran", "cacique"], journal: "fight" }),
  61: l("maima", "Look at the new ship from the rock.", ["newship"], 62, { show: ["gran", "cacique"], journal: "rescue" }),
  62: w("maima", "The strangers are leaving.", "film", 63, { film: "leave", show: ["gran", "cacique"] }),
  63: w("maima", "The strangers are leaving.", "playing", 64, { film: "leave", show: ["gran", "cacique"] }),
  64: t("maima", "Talk to Grandmother.", ["gran"], 70, { show: ["gran", "cacique"] }),
  /* 7. Back in 2026 */
  70: t("today", "Talk to Miss Sharon, the guide.", ["guide"], 71, { show: ["guide"], journal: "today" }),
  71: l("today", "Look at the round house.", ["house"], 72, { show: ["guide"], journal: "house" }),
  72: l("today", "Read the sign about the Taino.", ["sign"], 73, { show: ["guide"], journal: "words" }),
  73: t("today", "Talk to Miss Sharon.", ["guide"], 74, { show: ["guide"] }),
  74: w("today", "What do you remember?", "quiz", 75, { journal: "clothes" }),
  75: w("today", "The story is told.", "end", null, { end: true }),
};
export const TASKS = {
  bread: { place: "maima", item: "casabe", start: [1.0, 0.552, -0.4, 0.2], from: [1.3, 0.4], to: [-3.0, -7.4], at: [-3.6, 0.012, -7.9], label: "Take the cassava bread", put: "Put it in Cousin's basket" },
  basket: { place: "shore", item: "basket", start: [7.6, 0, 3.6, 0.3], from: [7.2, 3.0], to: [2.4, -1.6], at: [2.9, 0.32, -2.6], label: "Pick up the basket", put: "Put it in the canoe" },
  calabash: { place: "shore", item: "calabash", start: [12.2, 0.02, 2.4, 0.2], from: [11.6, 2.6], to: [-0.4, -1.4], at: [-0.9, 0.3, -2.7], label: "Fill the calabash at the stream", put: "Give it to Cousin" },
  store: { place: "maima", item: "casabe2", start: [1.0, 0.552, -0.4, 0.2], from: [1.3, 0.4], to: [-6.3, 0.3], at: [-7.0, 0.0, -1.6], label: "Take the cassava bread", put: "Put it inside the house" },
};
/* Things the player looks at (owner rule 13: a close-up action, engine/lookshot.js). at: where you stand. view: the close framing the camera
   eases to (or the place's own Q.lookViews[id]). sound: LOOK_SFX in main.js. say: the short story line while the thing moves. lines: the card after. */
const V = (p, look, fov) => ({ p, look, fov });
export const LOOKS = {
  zemi: { place: "maima", at: [6.8, -5.2], label: "Look inside", title: "Grandmother's zemi", view: V([7.3, 1.05, -5.6], [10.3, 0.42, -4.2], 30), sound: "wind", say: ["Grandmother lifts the cloth. The zemi looks back at you."], lines: ["It is carved from very hard, dark wood.", "Its eyes and teeth are made of shell.", "The Taino believed a zemi held a spirit.", "Grandmother keeps it safe while the strangers are here."] },
  buren: { place: "maima", at: [2.6, 0.9], label: "Turn the bread", title: "Cassava bread", view: V([3.0, 1.35, 0.6], [2.0, 0.42, -1.0], 40), sound: "sizzle", say: ["You flip the flat cake with a stick. It smells good."], lines: ["Grandmother grated the cassava root and squeezed out its juice.", "Now the cake bakes on the hot clay griddle.", "One side is golden. Now the other."] },
  lookout: { place: "maima", at: [0.0, -9.4], label: "Look down at the bay", title: "The two ships", sound: "wind", say: ["Far below, men are busy on the ships."], lines: ["They are tying straw roofs onto the decks.", "The ships sit in the water, side by side.", "They will never sail again."] },
  bell: { place: "shore", at: [4.3, 1.3], label: "Look at it", title: "A hawk's bell", view: V([4.9, 0.95, 1.5], [4.5, 0.12, 0.5], 28), sound: "bell", say: ["A little round thing. You shake it. Ting-ting-ting!"], lines: ["The sailors gave it for the big basket of bread.", "Nobody here has heard a sound like it.", "Cousin also got red and yellow glass beads."] },
  newship: { place: "maima", at: [0.0, -9.4], label: "Look at the new ship", title: "A ship from Hispaniola", sound: "wind", say: ["A new ship is anchored by the old wrecks."], lines: ["Diego Mendez sent it from Hispaniola.", "So at least one canoe got across the sea.", "But where are the paddlers?"] },
  house: { place: "today", at: [-3.6, -2.4], label: "Look at the house", title: "A round house", view: V([-2.2, 1.7, -1.0], [-6.0, 1.4, -4.0], 44), sound: "wind", say: ["A model of a Taino house, round and tall."], lines: ["The house dug up at Maima was about 4 metres across.", "One pole held up the middle of the roof.", "Its door faced west, away from the wind."] },
  sign: { place: "today", at: [3.6, -4.2], label: "Read the sign", title: "The Legacy of the Taino", view: V([3.9, 1.5, -4.4], [4.0, 1.3, -6.0], 36), sound: "page", say: ["The Legacy of the Taino. You read the big panel."], lines: ["It says the Taino left their mark on Jamaica today.", "Bammy, barbecue and yam hills all come from the Taino.", "Fishermen still make dugout canoes from the silk cotton tree.", "Canoe, hammock and hurricane come from Taino words too."] },
};
for (const r of Object.values(STEPS)) for (const n of r.needs?.do || []) if (n.carry) n.carry = TASKS[n.id].item;
export const ITEMS = [...new Set(Object.values(TASKS).map((t) => t.item))];
export const TASK_IDS = Object.keys(TASKS);
