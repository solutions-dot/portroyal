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
  11: t("deck", "Talk to Mr Fitton.", ["fitton"], 12, { show: CREW, journal: "fitton" }),
  12: d("deck", "Carry the salt pork to the fishing line.", ["bait"], 13, { show: CREW }),
  13: l("deck", "Help haul in the line.", ["haul"], 14, { show: CREW, journal: "shark" }),
  /* 2. What the shark held */
  20: l("deck", "Look at what was inside the shark.", ["bundle"], 21, { show: CREW }),
  21: d("deck", "Lay the wet papers on the hatch to dry.", ["papers"], 22, { show: CREW, journal: "papers" }),
  22: t("deck", "Mr Wylie has come for breakfast. Listen.", ["wylie", "fitton"], 30, { show: ALL, journal: "breakfast" }),
  /* 3. Port Royal */
  30: t("quay", "Talk to Ben on the quay.", ["ben"], 31, { journal: "portroyal" }),
  31: l("quay", "Look at the brig Nancy.", ["nancy"], 32, { journal: "nancy" }),
  32: t("quay", "Ask Ben what a prize is.", ["ben"], 40, { journal: "prize" }),
  /* 4. The court in Kingston */
  40: t("court", "Talk to the clerk of the court.", ["clerk"], 41, { journal: "court" }),
  41: l("court", "Compare the two sets of papers.", ["false", "real"], 42),
  42: t("court", "Talk to Mr Fitton.", ["fitton"], 43, { journal: "jaws" }),
  43: w("court", "What did the papers prove?", "quiz", 44, { journal: "today" }),
  44: w("court", "The story is told.", "end", null, { end: true }),
};
STEPS[14] = w("deck", "The biggest shark is on the deck.", "note", 20, { note: "caught", show: CREW });
export const TASKS = {
  bait: { place: "deck", item: "pork", start: [1.2, 0.86, 5.2], from: [1.2, 4.2], to: [-1.4, -4.6], at: [-2.0, 0.95, -4.9], label: "Take the salt pork", put: "Bait the hook", hideAfter: true },
  papers: { place: "deck", item: "bundle", start: [0.9, 0.06, -2.6], from: [1.3, -1.6], to: [0, 2.4], at: [0, 0.47, 1.4], label: "Pick up the papers", put: "Lay the papers out to dry" },
};
export const LOOKS = {
  haul: { place: "deck", at: [-1.4, -4.6], label: "Haul on the line", title: "Heave!", lines: ["The line goes tight. All hands pull together.", "Up it comes: the biggest shark, over the side and on to the deck."], page: "shark" },
  bundle: { place: "deck", at: [1.3, -1.6], label: "Look", title: "A bundle of papers", lines: ["Inside the shark is a bundle of papers, tied round with string.", "The ink has run, but you can still read it.", "Who throws papers into the sea?"], page: "papers" },
  nancy: { place: "quay", at: [0, -1.4], label: "Look at the brig", title: "The brig Nancy", lines: ["An American brig of 125 tons, from Baltimore.", "Mr Wylie's cutter, the Sparrow, took her on 28 August.", "Her master says her cargo is American. Her own papers say so too."], page: "nancy" },
  false: { place: "court", at: [-1.4, 0.3], label: "Read the first papers", title: "The papers she showed", lines: ["These are the papers Mr Wylie sealed up on the Nancy.", "They make her look like a neutral ship with nothing to hide.", "They are false."], page: "court" },
  real: { place: "court", at: [1.4, 0.3], label: "Read the shark's papers", title: "The papers from the shark", lines: ["Letters in French and German, bills and receipts.", "One begins: “My good friend Mr. Christopher Shultz, supercargo of the American brig Nancy, will hand you this”.", "They show the cargo belonged to Britain's enemies."], page: "papers" },
};
for (const r of Object.values(STEPS)) for (const n of r.needs?.do || []) if (n.carry) n.carry = TASKS[n.id].item;
export const ITEMS = [...new Set(Object.values(TASKS).map((t) => t.item))];
export const TASK_IDS = Object.keys(TASKS);
