/* The story table (engine/story.js). t: talk. d: carry something and put it down (TASKS). l: look at or do something that changes where
   you can see it (LOOKS). w: a card or the quiz. show: the story people who are there in that step. */
const row = (place, goal, needs, next, extra = {}) => ({ place, goal, needs, next, ...extra });
const t = (place, goal, ids, next, extra) => row(place, goal, { talk: ids }, next, extra);
const d = (place, goal, ids, next, extra) => row(place, goal, { do: ids.map((id) => ({ id, carry: id })) }, next, extra);
const l = (place, goal, ids, next, extra) => row(place, goal, { do: ids }, next, extra);
const w = (place, goal, card, next, extra = {}) => ({ place, goal, wait: true, card, next, ...extra });
const CREW = ["cato", "fitton"],
  ALL = ["cato", "fitton", "wylie"];
export const STEPS = {
  /* 1. Off Jacmel */
  8: w("deck", "Dawn at sea.", "film", 9, { film: "dawn", show: CREW }),
  9: w("deck", "Dawn at sea.", "playing", 10, { film: "dawn", show: CREW }),
  10: t("deck", "Talk to Mr Cato, the boatswain.", ["cato"], 12, { show: CREW, journal: "you" }),
  12: l("deck", "Ring the ship's bell.", ["bell"], 13, { show: CREW }),
  13: t("deck", "Talk to Mr Fitton at the stern.", ["fitton"], 14, { show: CREW, journal: "fitton" }),
  14: l("deck", "Look at the Sparrow through the glass.", ["sparrow"], 15, { show: CREW, journal: "sparrow" }),
  15: d("deck", "Carry the salt pork to the hook at the stern.", ["bait"], 16, { show: CREW }),
  16: l("deck", "Take hold of the fishing line.", ["haul"], 17, { show: CREW }),
  17: w("deck", "The line goes tight.", "film", 18, { film: "catch", show: CREW }),
  18: w("deck", "The line goes tight.", "playing", 20, { film: "catch", show: CREW }),
  /* 2. What the shark held */
  20: t("deck", "Talk to Mr Cato by the shark.", ["cato"], 21, { show: CREW }),
  21: l("deck", "Look at what was inside the shark.", ["bundle"], 22, { show: CREW, journal: "papers" }),
  22: t("deck", "Talk to Mr Fitton.", ["fitton"], 23, { show: CREW }),
  23: d("deck", "Carry the letter to the hatch to dry.", ["sheet1"], 24, { show: CREW }),
  24: w("deck", "A boat is coming.", "film", 25, { film: "alongside", show: CREW }),
  25: w("deck", "A boat is coming.", "playing", 26, { film: "alongside", show: CREW }),
  26: t("deck", "Mr Wylie has come for breakfast. Talk to him.", ["wylie"], 27, { show: ALL, journal: "breakfast" }),
  27: t("deck", "Hear what Mr Fitton tells him.", ["fitton"], 30, { show: ALL }),
  /* 3. Port Royal */
  30: t("quay", "Talk to Ben on the quay.", ["ben"], 31, { show: ["ben"], journal: "portroyal" }),
  31: l("quay", "Look at the great ship in the harbour.", ["abergavenny"], 33, { show: ["ben"], journal: "abergavenny" }),
  33: l("quay", "Look at the sealed hatch of the brig Nancy.", ["hatch"], 34, { show: ["ben"], journal: "nancy" }),
  34: t("quay", "Ask Ben what a prize is.", ["ben"], 35, { show: ["ben", "fitton"], journal: "prize" }),
  35: t("quay", "Talk to Mr Fitton.", ["fitton"], 36, { show: ["ben", "fitton"] }),
  36: d("quay", "Carry Mr Fitton's box to the boat at the steps.", ["box"], 40, { show: ["ben", "fitton"] }),
  /* 4. The court in Kingston */
  40: t("court", "Talk to the clerk of the court.", ["clerk"], 41, { journal: "court" }),
  41: d("court", "Lay the shark's papers on the table.", ["stack"], 42),
  42: l("court", "Read the two sets of papers.", ["false", "real"], 44),
  44: w("court", "The court decides.", "film", 45, { film: "verdict" }),
  45: w("court", "The court decides.", "playing", 46, { film: "verdict" }),
  46: t("court", "Talk to Mr Fitton.", ["fitton"], 47),
  47: w("court", "What did the papers prove?", "quiz", 48, { journal: "today" }),
  48: w("court", "The story is told.", "end", null, { end: true }),
};
const SHEET = { place: "deck", from: [0.4, 6.2], to: [1.25, 1.1], label: "Pick up a sheet", put: "Lay the sheet out to dry" };
export const TASKS = {
  bait: { place: "deck", item: "pork", start: [1.75, 0.89, -4.5], from: [1.3, -3.85], to: [-1.2, 8.2], at: [-1.25, 0.86, 9.1], label: "Take the salt pork", put: "Bait the hook", hideAfter: true },
  sheet1: { ...SHEET, label: "Pick up the letter", put: "Lay the letter out to dry", item: "sheet1", start: [0.12, 0.02, 5.85, 0.2], at: [-0.36, 0.445, 1.1], ry: 0.12 },
  /* the men lay the other two sheets out on the hatch themselves; Jem brings the letter */
  sheet2: { ...SHEET, item: "sheet2", start: [0.02, 0.445, 1.14, -0.1], at: [0.02, 0.445, 1.14], ry: -0.1 },
  sheet3: { ...SHEET, item: "sheet3", start: [0.38, 0.445, 1.06, 0.2], at: [0.38, 0.445, 1.06], ry: 0.2 },
  box: { place: "quay", item: "box", start: [6.5, 0, 4.7, 0.3], from: [6.0, 4.1], to: [-9.0, -1.0], at: [-10.0, -0.98, -3.7], label: "Pick up the box", put: "Put the box in the boat" },
  stack: { place: "court", item: "stack", start: [4.3, 0.53, 0.9, 0.2], from: [3.8, 1.25], to: [1.2, 0.95], at: [1.25, 0.83, 0.1], ry: 0.1, label: "Take the shark's papers", put: "Lay them on the table" },
};
/* Things the player looks at (owner rule 13: a close-up action, engine/lookshot.js). at: where you stand. view: the close framing the camera
   eases to (or the place's own Q.lookViews[id], for a framing that depends on how the place was built). sound: LOOK_SFX in main.js.
   say: the short story line while the thing moves. lines: the card after, what it means. */
const V = (p, look, fov) => ({ p, look, fov });
export const LOOKS = {
  bell: { place: "deck", at: [0.95, -6.0], label: "Ring the bell", title: "The ship's bell", view: V([0.8, 1.6, -5.35], [0, 1.0, -6.45], 36), sound: "bell", say: ["You pull the rope. Ding-ding! Ding-ding!"], lines: ["The bell tells all hands the time.", "It is early morning. Breakfast is not far off."], page: "you" },
  sparrow: { place: "deck", at: [1.5, 5.55], scope: true, label: "Look through the glass", title: "The cutter Sparrow", sound: "glass", say: ["You pull the glass open and find her."], lines: ["A cutter, with one tall mast.", "She is 123 tons and about 66 feet long.", "Her boat is pulling this way, with Mr Wylie in it."], page: "sparrow" },
  haul: { place: "deck", at: [-1.2, 8.2], label: "Take hold of the line", title: "A bite!", view: V([-3.6, 2.5, 12.8], [-1.5, 0.2, 9.4], 50), sound: "line", say: ["The line jerks tight in your hands!"], lines: ["The biggest shark has taken the pork.", "“Let it run,” says Mr Fitton. “Let the fish tire.”"], page: "shark" },
  bundle: { place: "deck", at: [0.4, 6.2], label: "Look", title: "A bundle of papers", view: V([-0.05, 1.55, 4.65], [-0.3, 0.12, 6.25], 44), sound: "paper", say: ["A bundle of papers, tied round with a string."], lines: ["The outside is spoiled. The papers inside are whole.", "Who throws papers into the sea?"], page: "papers" },
  abergavenny: { place: "quay", at: [-11.6, -0.9], label: "Look across the harbour", title: "HMS Abergavenny", sound: "flags", say: ["Up her halyard runs a hoist of flags."], lines: ["The great ship is HMS Abergavenny, the guard ship.", "She is the flagship here. The Ferret is her tender.", "A tender is a small ship that works for a big one."], page: "abergavenny" },
  hatch: { place: "quay", at: [0.9, -1.2], label: "Look at her hatch", title: "A sealed hatch", sound: "canvas", say: ["The cover comes back. Rope, and red wax."], lines: ["This is the brig Nancy, from Baltimore.", "The Sparrow took her on 28 August.", "Her hatch is sealed until the court decides."], page: "nancy" },
  false: { place: "court", at: [-1.2, 0.95], label: "Read the first papers", title: "The papers she showed", sound: "paper", say: ["You open the papers Mr Wylie sealed up."], lines: ["They make the Nancy look like a neutral ship with nothing to hide.", "They are false."], page: "court" },
  real: { place: "court", at: [1.2, 0.95], label: "Read the shark's papers", title: "The papers from the shark", sound: "paper", say: ["You lay out a letter from the shark."], lines: ["Letters in French and German, bills and receipts.", "Fitton remembered how one began: “The bearer hereof, my good friend Mr. Christopher Schultz, supercargo of the American brig Nancy, will hand you this.”", "They show the cargo belonged to Britain's enemies."], page: "papers" },
};
for (const r of Object.values(STEPS)) for (const n of r.needs?.do || []) if (n.carry) n.carry = TASKS[n.id].item;
export const ITEMS = [...new Set(Object.values(TASKS).map((t) => t.item))];
export const TASK_IDS = Object.keys(TASKS);
