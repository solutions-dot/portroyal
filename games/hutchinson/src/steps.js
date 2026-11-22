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
  MORNING = ["callendar", "carter"],
  HALL = ["officer", "juba", "cudjoe", "hector"],
  HOLE = ["officer", "cudjoe", "hector"],
  COURT = ["clerk", "cubba"],
  VERDICT = ["clerk", "cubba", "hutton"];
export const STEPS = {
  /* 1. The dry road */
  10: t("road", "Talk to Cubba by the dry trough.", ["cubba"], 11, { show: ROAD, journal: "you" }),
  11: l("road", "Test the mud of the dry pond.", ["pond"], 12, { show: ROAD }),
  12: d("road", "Carry cut grass to the cattle at the rail.", ["fodder"], 13, { show: ROAD }),
  13: t("road", "Talk to Sampson, the carter on the road.", ["carter"], 14, { show: ROAD, journal: "road" }),
  14: l("road", "Look at the pack mule tied to the wall.", ["packmule"], 15, { show: ROAD }),
  15: t("road", "Tell Dr Hutton what you found.", ["hutton"], 20, { show: ROAD, journal: "hutton" }),
  /* 2. The doctor's quarrel */
  20: g("road", "Walk to the boundary pole.", "boundary", 21, { show: ROAD }),
  21: t("road", "Hear Dr Hutton's quarrel.", ["hutton"], 22, { show: ROAD, journal: "quarrel" }),
  22: d("road", "Set the pulled-up peg back on the line.", ["peg"], 23, { show: ROAD }),
  23: t("road", "Talk to Sampson at his cart.", ["carter"], 24, { show: ROAD }),
  24: d("road", "Carry the empty cask from the gate to the cart.", ["cask"], 25, { show: ROAD }),
  25: w("road", "The pen needs water.", "note", 30, { note: "water", show: ROAD }),
  /* 3. Under the towers */
  30: t("castle", "Talk to Sampson behind the long wall.", ["carter"], 31, { show: DUSK, journal: "castle" }),
  31: g("castle", "Reach the big cotton tree unseen.", "cotton", 32, { show: DUSK, danger: "tower" }),
  32: l("castle", "Look at what lies between the roots.", ["hat"], 33, { show: DUSK, danger: "tower" }),
  33: g("castle", "Creep to the tumbled wall while the shutter is shut.", "tumbled", 34, { show: DUSK, danger: "tower" }),
  34: g("castle", "Reach the well, keeping out of sight.", "well", 35, { show: DUSK, danger: "tower" }),
  35: t("castle", "Talk to Juba at the well.", ["juba"], 36, { show: DUSK, danger: "tower", journal: "juba" }),
  36: l("castle", "Draw the water with Juba.", ["draw"], 37, { show: DUSK, danger: "tower" }),
  37: d("castle", "Carry the water back to the cart, cover to cover.", ["water"], 38, { show: DUSK, danger: "late" }),
  38: t("castle", "Talk to Sampson.", ["carter"], 40, { show: DUSK, journal: "watching" }),
  /* 4. The neighbour */
  40: t("castle", "Talk to Sampson at the long wall.", ["carter"], 41, { show: MORNING, journal: "callendar" }),
  41: l("castle", "Look over the wall of the cattle yard.", ["jackass"], 42, { show: MORNING }),
  42: g("castle", "Get down behind the long wall with Sampson.", "wall", 43, { show: MORNING }),
  43: w("castle", "John Callendar walks up to the house.", "film", 50, { film: "warrant", show: MORNING }),
  44: w("castle", "Watch from behind the wall.", "playing", 50, { film: "warrant", show: MORNING }),
  /* 5. What the house held */
  50: t("hall", "Talk to Captain Reid.", ["officer"], 51, { show: HALL, journal: "capture" }),
  51: l("hall", "Look in the strongbox and behind the cloth.", ["watches", "coats"], 52, { show: HALL }),
  52: l("hall", "Look at the cot where a sick man lay.", ["cot"], 53, { show: HALL }),
  53: l("hall", "Take the board from the loophole over the road.", ["loophole"], 54, { show: HALL }),
  54: t("hall", "Hear Juba and Cudjoe.", ["juba", "cudjoe"], 55, { show: HALL, journal: "silenced" }),
  55: g("hole", "Walk down to the edge, where Hector points.", "edge", 56, { show: HOLE, journal: "hector" }),
  56: l("hole", "Watch the searchers lower a lantern.", ["rope"], 57, { show: HOLE }),
  57: d("hole", "Drop a stone into the hole.", ["stone"], 58, { show: HOLE }),
  58: t("hole", "Talk to Cudjoe.", ["cudjoe"], 60, { show: HOLE, journal: "hole" }),
  /* 6. Spanish Town */
  60: g("town", "Cross the square to the railed green.", "green", 61, { show: COURT, journal: "town" }),
  61: t("town", "Talk to the clerk of the court.", ["clerk"], 63, { show: COURT, journal: "trial" }),
  63: l("town", "Listen under the long gallery.", ["gallery"], 64, { show: COURT }),
  64: t("town", "Talk to Dr Hutton and Cubba.", ["hutton", "cubba"], 65, { show: VERDICT, journal: "epitaph" }),
  65: w("town", "The sixteenth morning of March.", "film", 67, { film: "morning", show: VERDICT }),
  66: w("town", "Watch from the square.", "playing", 67, { film: "morning", show: VERDICT }),
  67: w("town", "What do we really know?", "quiz", 68, { journal: "legend", show: VERDICT }),
  68: w("town", "The story is told.", "end", null, { end: true, show: VERDICT }),
};
/* Things the player carries. start: where the thing lies at first [x, y, z]; from: where you stand to pick it up; to: where you stand to
   put it down; at: where it is left [x, y, z]. */
export const TASKS = {
  fodder: { place: "road", item: "fodder", start: [10.6, 0.02, -2.5], from: [10.2, -1.6], to: [5, -10.4], at: [5, 0.62, -11.5], label: "Take a bundle of cut grass", put: "Put the grass in the rack" },
  peg: { place: "road", item: "peg", start: [-13.8, 0, 9.3], from: [-13.2, 8.4], to: [-16, 4.4], at: [-16, 0, 3.3], label: "Pick up the peg", put: "Set the peg in its hole" },
  cask: { place: "road", item: "cask", start: [2.6, 0, 1.3], from: [2.6, 0.2], to: [5.4, 8.0], at: [7.0, 0.76, 9.1], label: "Take the empty cask", put: "Hand the cask up to Sampson" },
  water: { place: "castle", item: "pail", start: [-13.5, 0.86, 1.26], from: [-13.5, 2.3], to: [11.6, 12.1], at: [11.9, 0.8, 13.2], label: "Take the pail of water", put: "Set the water on the cart" },
  stone: { place: "hole", item: "stone", start: [5.2, 0.02, 7.7], from: [5.2, 6.9], to: [0, -3.0], at: [0, 0.1, -5.4], label: "Pick up a stone", put: "Drop the stone", hideAfter: true },
};
/* Things the player looks at (owner rule 13: a close-up action). at: where you stand. view: the close framing the camera eases to
   (engine/lookshot.js); the place moves the thing while you watch (Q.reveal[id](k), k from 0 to 1, over act seconds) and plays sound; say: a
   short story line or two in the lower bar; then the card says what you found. Town spots are in the turned square's frame. */
const V = (p, look, fov = 42) => ({ p, look, fov });
export const LOOKS = {
  pond: { place: "road", at: [-8.2, -5.4], label: "Test the mud with a stick", title: "The dry pond", view: V([-7.6, 1.05, -5.5], [-8.35, 0.25, -6.8], 42), sound: "stick", say: ["You push the stick into the mud."], lines: ["Cracked mud. Hoof marks baked as hard as brick.", "A hand deep, and still no wet."], page: "pen" },
  packmule: { place: "road", at: [-6.6, 5.0], label: "Look in the pack", title: "A mule with no master", view: V([-6.9, 2.2, 4.9], [-7.1, 1.4, 3.3], 40), sound: "flap", say: ["You lift the flap of the pack."], lines: ["A bedroll. A tin cup. A shirt, folded small.", "Somebody packed this for a long ride. The mule came back alone."], page: "road" },
  hat: { place: "castle", at: [-0.8, 6.5], label: "Pick it up", title: "A hat in the roots", view: V([0.9, 1.45, 7.3], [-0.2, 1.0, 5.2], 46), sound: "hat", say: ["Something lies between the roots. A hat."], lines: ["A riding hat, bleached by sun and rain.", "You hang it on a broken branch. Nobody came back for it."], page: "castle" },
  draw: { place: "castle", at: [-13.5, 2.3], label: "Draw the water", title: "Water", view: V([-13.2, 2.3, 2.4], [-13.3, 0.6, 0.4], 46), act: 3, sound: "windlass", say: ["The windlass creaks. The bucket comes up heavy and cold."], lines: ["Juba fills your pail.", "Her eyes never leave the upper window."], page: "juba" },
  jackass: { place: "castle", at: [16.5, 8.4], label: "Look over the wall", title: "The strayed jackass", view: V([16.6, 2.25, 7.3], [16.9, 0.7, 3.6], 42), act: 3, sound: "jackass", say: ["A grey jackass comes to the wall."], lines: ["It stands among cattle in the castle yard.", "A letter of 1773 says Hutchinson kept his neighbours’ strayed cattle."], page: "callendar" },
  watches: { place: "hall", at: [-1.2, -0.4], label: "Open the strongbox", title: "Forty-three watches", view: V([-1.1, 1.75, -0.45], [-1.2, 0.95, -1.5], 40), act: 3, sound: "lid", say: ["The lid comes up. Watches, packed tight."], lines: ["The captain's man counts them twice. Forty-three.", "One man does not need forty-three watches.", "Later accounts give this number. One says forty-seven."], page: "watches" },
  coats: { place: "hall", at: [-4.2, 1.0], label: "Draw back the cloth", title: "Coats on the pegs", view: V([-2.9, 1.5, 1.3], [-5.1, 1.15, 1.0], 50), act: 2.6, sound: "cloth", say: ["You draw back the cloth."], lines: ["Coats. Riding coats, a merchant's coat, a boy's jacket.", "Later accounts say a great deal of clothing was found here.", "Nobody can say whose each coat was."], page: "watches" },
  loophole: { place: "hall", at: [-1.2, 2.6], label: "Take down the board", title: "The loophole", view: V([-1.2, 1.55, 1.75], [-1.2, 1.15, 3.4], 46), act: 2.6, sound: "board", say: ["The board comes away. Daylight falls in."], lines: ["A small square hole in a thick wall, plastered smooth.", "Through it the whole road lies open. There is nowhere to hide.", "People said he shot from holes like this. That was first printed in 1828."], page: "castle" },
  cot: { place: "hall", at: [3.0, -1.9], label: "Look at the cot", title: "The cot", view: V([3.6, 1.45, -1.2], [3.8, 0.35, -2.75], 46), sound: "cup", say: ["You set the cup back by the cot."], lines: ["A plain cot, the blanket thrown back.", "A letter of 1773 says a sick man lay in this house.", "He slipped out and told what he had seen."], page: "callendar" },
  rope: { place: "hole", at: [1.2, -2.8], label: "Watch the lantern go down", title: "How deep", view: V([0.9, 2.2, -4.8], [1.4, -20, -5.1], 44), act: 5, sound: "rope", say: ["The captain's men let a lantern down on a rope.", "The light grows small. Then the rope runs out."], lines: ["Nobody here can see the bottom.", "Long after, cavers measured the hole: about 98 metres deep."], page: "hole" },
  gallery: { place: "town", at: [6.4, -4.67], label: "Listen", title: "Under the court", view: V([-6, 1.7, -2.0], [7.9, 5.6, -0.3], 36), act: 3.2, sound: "shutter", say: ["A shutter opens on the long gallery. Voices come down."], lines: ["One name is read out, again and again: John Callendar.", "He says he is not guilty.", "You are not allowed up the stair."], page: "trial" },
};
for (const r of Object.values(STEPS)) for (const n of r.needs?.do || []) if (n.carry) n.carry = TASKS[n.id].item;
export const ITEMS = [...new Set(Object.values(TASKS).map((t) => t.item))];
export const TASK_IDS = Object.keys(TASKS);
