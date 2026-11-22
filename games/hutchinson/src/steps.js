/* The story table (engine/story.js). Each row: where, the goal, what it needs, what follows.
   t: talk to people. d: carry something and put it down (TASKS). l: look at something, which changes where you can see it (LOOKS).
   g: walk to a spot. w: a card, a camera scene or the quiz. show: the story people who are there in that step. danger: a watched stretch. */
const row = (place, goal, needs, next, extra = {}) => ({ place, goal, needs, next, ...extra });
const t = (place, goal, ids, next, extra) => row(place, goal, { talk: ids }, next, extra);
const d = (place, goal, ids, next, extra) => row(place, goal, { do: ids.map((id) => ({ id, carry: id })) }, next, extra);
const l = (place, goal, ids, next, extra) => row(place, goal, { do: ids }, next, extra);
const g = (place, goal, id, next, extra) => row(place, goal, { go: [id] }, next, extra);
const w = (place, goal, card, next, extra = {}) => ({ place, goal, wait: true, card, next, ...extra });
const ROAD = ["cubba", "carter", "hutton"],
  DUSK = ["juba", "carter"],
  MORNING = ["callendar", "carter"];
export const STEPS = {
  /* 1. The dry road */
  10: t("road", "Talk to Cubba by the dry trough.", ["cubba"], 11, { show: ROAD, journal: "you" }),
  11: t("road", "Talk to Sampson, the carter on the road.", ["carter"], 12, { show: ROAD, journal: "road" }),
  12: l("road", "Look at the pack mule tied to the wall.", ["packmule"], 13, { show: ROAD }),
  13: t("road", "Tell Dr Hutton what you found.", ["hutton"], 20, { show: ROAD, journal: "hutton" }),
  /* 2. The doctor's quarrel */
  20: g("road", "Walk to the boundary pole.", "boundary", 21, { show: ROAD }),
  21: t("road", "Hear Dr Hutton's quarrel.", ["hutton"], 22, { show: ROAD, journal: "quarrel" }),
  22: w("road", "The pen needs water.", "note", 30, { note: "water", show: ROAD }),
  /* 3. Under the towers */
  30: g("castle", "Reach the well. Keep out of sight of the window.", "well", 31, { show: DUSK, danger: "tower", journal: "castle" }),
  31: t("castle", "Talk to Juba at the well.", ["juba"], 32, { show: DUSK, danger: "tower", journal: "juba" }),
  32: d("castle", "Carry the water back to the cart. Stay in cover.", ["water"], 33, { show: DUSK, danger: "tower" }),
  33: t("castle", "Talk to Sampson.", ["carter"], 40, { show: DUSK, journal: "watching" }),
  /* 4. The neighbour */
  40: t("castle", "Talk to Sampson at the long wall.", ["carter"], 41, { show: MORNING, journal: "callendar" }),
  41: w("castle", "John Callendar walks up to the house.", "film", 50, { film: "warrant", show: MORNING }),
  42: w("castle", "Watch from behind the wall.", "playing", 50, { film: "warrant", show: MORNING }),
  /* 5. What the house held */
  50: t("hall", "Talk to Captain Reid.", ["officer"], 51, { journal: "capture" }),
  51: l("hall", "Look in the strongbox and behind the cloth.", ["watches", "coats"], 52),
  52: t("hall", "Hear Juba and Cudjoe.", ["juba", "cudjoe"], 53, { journal: "silenced" }),
  53: g("hole", "Walk to the edge with Cudjoe.", "edge", 54),
  54: d("hole", "Drop a stone into the hole.", ["stone"], 55),
  55: t("hole", "Talk to Cudjoe.", ["cudjoe"], 60, { journal: "hole" }),
  /* 6. Spanish Town */
  60: t("town", "Talk to the clerk of the court.", ["clerk"], 61, { journal: "trial" }),
  61: l("town", "Read the notice by the court door.", ["notice"], 62),
  62: t("town", "Talk to Dr Hutton and Cubba.", ["hutton", "cubba"], 63, { journal: "epitaph" }),
  63: w("town", "The sixteenth morning of March.", "film", 65, { film: "morning" }),
  64: w("town", "Watch from the square.", "playing", 65, { film: "morning" }),
  65: w("town", "What do we really know?", "quiz", 66, { journal: "legend" }),
  66: w("town", "The story is told.", "end", null, { end: true }),
};
/* Things the player carries. start: where the thing lies at first [x, y, z]; from: where you stand to pick it up; to: where you stand to
   put it down; at: where it is left [x, y, z]. */
export const TASKS = {
  water: { place: "castle", item: "pail", start: [-6.5, 0.86, 1.06], from: [-6.5, 2.0], to: [11.6, 12.1], at: [11.9, 0.8, 13.2], label: "Take the pail of water", put: "Set the water on the cart" },
  stone: { place: "hole", item: "stone", start: [5.2, 0.02, 7.7], from: [5.2, 6.9], to: [0, -1.2], at: [0, 0.1, -4.6], label: "Pick up a stone", put: "Drop the stone", hideAfter: true },
};
/* Things the player looks at. at: where you stand; the place changes what you see (Q.reveal), then the card says what you found. */
export const LOOKS = {
  packmule: { place: "road", at: [-6.6, 5.0], label: "Look in the pack", title: "A mule with no master", lines: ["A bedroll. A tin cup. A shirt, folded small.", "Somebody packed this for a long ride. The mule came back alone."], page: "road" },
  watches: { place: "hall", at: [-1.7, -0.2], label: "Open the strongbox", title: "Forty-three watches", lines: ["The box is full of pocket watches. The captain's man counts them twice.", "Forty-three. One man does not need forty-three watches.", "Later accounts give this number. One says forty-seven."], page: "watches" },
  coats: { place: "hall", at: [-4.2, 0], label: "Draw back the cloth", title: "Coats on the pegs", lines: ["Coats. Riding coats, a merchant's coat, a boy's jacket.", "Later accounts say a great deal of clothing was found here.", "Nobody can say whose each coat was."], page: "watches" },
  notice: { place: "town", at: [2.25, -3.4], label: "Read the notice", title: "The King against Lewis Hutchinson", lines: ["He is tried for one killing: John Callendar.", "He pleads not guilty. A free man saw that killing.", "The travellers on the road have no names in this paper."], page: "trial" },
};
for (const r of Object.values(STEPS)) for (const n of r.needs?.do || []) if (n.carry) n.carry = TASKS[n.id].item;
export const ITEMS = [...new Set(Object.values(TASKS).map((t) => t.item))];
export const TASK_IDS = Object.keys(TASKS);
