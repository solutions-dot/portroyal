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
  10: t("deck", "Talk to Mr Cato, the boatswain.", ["cato"], 11, { show: CREW, journal: "you" }),
  11: l("deck", "Coil down the loose rope by the fore mast.", ["coil"], 12, { show: CREW }),
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
  23: d("deck", "Carry each sheet to the hatch to dry.", ["sheet1", "sheet2", "sheet3"], 24, { show: CREW }),
  24: l("deck", "Look over the side. A boat is coming.", ["boat"], 25, { show: CREW }),
  25: t("deck", "Mr Wylie has come for breakfast. Talk to him.", ["wylie"], 26, { show: ALL, journal: "breakfast" }),
  26: t("deck", "Hear what Mr Fitton tells him.", ["fitton"], 30, { show: ALL }),
  /* 3. Port Royal */
  30: t("quay", "Talk to Ben on the quay.", ["ben"], 31, { show: ["ben"], journal: "portroyal" }),
  31: l("quay", "Look at the great ship in the harbour.", ["abergavenny"], 32, { show: ["ben"], journal: "abergavenny" }),
  32: l("quay", "Look at the brig Nancy.", ["nancy"], 33, { show: ["ben"], journal: "nancy" }),
  33: l("quay", "Look at the Nancy's main hatch.", ["hatch"], 34, { show: ["ben"] }),
  34: t("quay", "Ask Ben what a prize is.", ["ben"], 35, { show: ["ben", "fitton"], journal: "prize" }),
  35: t("quay", "Talk to Mr Fitton.", ["fitton"], 36, { show: ["ben", "fitton"] }),
  36: d("quay", "Carry Mr Fitton's box to the boat at the steps.", ["box"], 40, { show: ["ben", "fitton"] }),
  /* 4. The court in Kingston */
  40: t("court", "Talk to the clerk of the court.", ["clerk"], 41, { journal: "court" }),
  41: d("court", "Lay the shark's papers on the table.", ["stack"], 42),
  42: l("court", "Read the two sets of papers.", ["false", "real"], 43),
  43: l("court", "Look at the shark's jaws.", ["jaws"], 44, { journal: "jaws" }),
  44: t("court", "Talk to Mr Fitton.", ["fitton"], 45),
  45: w("court", "What did the papers prove?", "quiz", 46, { journal: "today" }),
  46: w("court", "The story is told.", "end", null, { end: true }),
};
const SHEET = { place: "deck", from: [0.4, 6.2], to: [1.25, 1.1], label: "Pick up a sheet", put: "Lay the sheet out to dry" };
export const TASKS = {
  bait: { place: "deck", item: "pork", start: [1.75, 0.89, -4.5], from: [1.3, -3.85], to: [-1.2, 8.2], at: [-1.25, 0.86, 9.1], label: "Take the salt pork", put: "Bait the hook", hideAfter: true },
  sheet1: { ...SHEET, item: "sheet1", start: [0.12, 0.02, 5.85, 0.2], at: [-0.36, 0.445, 1.1], ry: 0.12 },
  sheet2: { ...SHEET, item: "sheet2", start: [0.2, 0.02, 6.2, -0.3], at: [0.02, 0.445, 1.14], ry: -0.1 },
  sheet3: { ...SHEET, item: "sheet3", start: [0.12, 0.02, 6.55, 0.5], at: [0.38, 0.445, 1.06], ry: 0.2 },
  box: { place: "quay", item: "box", start: [6.5, 0, 4.7, 0.3], from: [6.0, 4.1], to: [-9.0, -1.0], at: [-10.0, -0.98, -3.7], label: "Pick up the box", put: "Put the box in the boat" },
  stack: { place: "court", item: "stack", start: [4.3, 0.53, 0.9, 0.2], from: [3.8, 1.25], to: [1.2, 0.95], at: [1.25, 0.83, 0.1], ry: 0.1, label: "Take the shark's papers", put: "Lay them on the table" },
};
export const LOOKS = {
  coil: { place: "deck", at: [-1.0, -4.9], label: "Coil the rope", title: "A tidy deck", lines: ["You coil the rope down flat, turn upon turn.", "A loose rope can trip a man. Now it is ready to run."], page: "you" },
  bell: { place: "deck", at: [0.95, -6.0], label: "Ring the bell", title: "The ship's bell", lines: ["Ding-ding! The bell tells all hands the time.", "It is early morning. Breakfast is not far off."], page: "you" },
  sparrow: { place: "deck", at: [2.35, 2.2], label: "Look through the glass", title: "The cutter Sparrow", lines: ["There she lies, in shore: a cutter, with one tall mast.", "The Sparrow is 123 tons and about 66 feet long.", "Her boat is pulling this way, with Mr Wylie in it."], page: "sparrow" },
  haul: { place: "deck", at: [-1.2, 8.2], label: "Take hold of the line", title: "A bite!", lines: ["The biggest shark takes the pork.", "The line runs out through your hands, fathom after fathom.", "“Let it run,” says Mr Fitton. “Let the fish tire.”"], page: "shark" },
  bundle: { place: "deck", at: [0.4, 6.2], label: "Look", title: "A bundle of papers", lines: ["Inside the shark is a bundle of papers, tied round with a string.", "The outside is spoiled. The papers inside are whole.", "Who throws papers into the sea?"], page: "papers" },
  boat: { place: "deck", at: [2.35, 2.2], label: "Look over the side", title: "A boat alongside", lines: ["Mr Wylie's boat is here at last.", "There is no wind, so his men rowed all the way.", "He climbs up the side, hungry for breakfast."], page: "sparrow" },
  abergavenny: { place: "quay", at: [-11.6, -0.9], label: "Look across the harbour", title: "HMS Abergavenny", lines: ["The great ship is HMS Abergavenny, the guard ship.", "She is the flagship here. The Ferret is her tender.", "A tender is a small ship that works for a big one."], page: "abergavenny" },
  nancy: { place: "quay", at: [-1.6, -1.2], label: "Look at the brig", title: "The brig Nancy", lines: ["An American brig of 125 tons, from Baltimore.", "Mr Wylie's cutter, the Sparrow, took her on 28 August.", "Her master says her cargo is American. Her own papers say so too."], page: "nancy" },
  hatch: { place: "quay", at: [0.9, -1.2], label: "Look at her hatch", title: "A sealed hatch", lines: ["Her main hatch is shut, roped and sealed with red wax.", "Nobody may touch her cargo until the court decides."], page: "nancy" },
  false: { place: "court", at: [-1.2, 0.95], label: "Read the first papers", title: "The papers she showed", lines: ["These are the papers Mr Wylie sealed up on the Nancy.", "They make her look like a neutral ship with nothing to hide.", "They are false."], page: "court" },
  real: { place: "court", at: [1.2, 0.95], label: "Read the shark's papers", title: "The papers from the shark", lines: ["Letters in French and German, bills and receipts.", "Fitton remembered how one began: “The bearer hereof, my good friend Mr. Christopher Schultz, supercargo of the American brig Nancy, will hand you this.”", "They show the cargo belonged to Britain's enemies."], page: "papers" },
  jaws: { place: "court", at: [-5.0, 1.0], label: "Look at the jaws", title: "The shark's jaws", lines: ["Mr Fitton sent the shark's jaws to the court, with a note.", "“Lieut. Fitton recommends these jaws for a collar for neutrals to swear through.”", "He means: a warning to masters who swear to lies."], page: "jaws" },
};
for (const r of Object.values(STEPS)) for (const n of r.needs?.do || []) if (n.carry) n.carry = TASKS[n.id].item;
export const ITEMS = [...new Set(Object.values(TASKS).map((t) => t.item))];
export const TASK_IDS = Object.keys(TASKS);
