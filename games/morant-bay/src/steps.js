/* The story table (engine/story.js). Each row: where, the goal, what it needs, what follows.
   t: talk to people. d: carry something and put it down (TASKS). l: look at something, which changes where you can see it (LOOKS).
   g: walk to a spot. w: a card, a camera scene or the quiz. show: the story people who are there in that step. danger: a watched stretch. */
const row = (place, goal, needs, next, extra = {}) => ({ place, goal, needs, next, ...extra });
const t = (place, goal, ids, next, extra) => row(place, goal, { talk: ids }, next, extra);
const d = (place, goal, ids, next, extra) => row(place, goal, { do: ids.map((id) => ({ id, carry: id })) }, next, extra);
const l = (place, goal, ids, next, extra) => row(place, goal, { do: ids }, next, extra);
const g = (place, goal, id, next, extra) => row(place, goal, { go: [id] }, next, extra);
const w = (place, goal, card, next, extra = {}) => ({ place, goal, wait: true, card, next, ...extra });
const HOME = ["gran", "mother", "father", "brother", "deacon", "bogle"],
  WALK = ["father", "secretary"],
  WARRANT = ["mother", "gran", "brother", "father", "bogle", "constable"],
  NIGHT = ["father", "deacon"],
  MARKET = ["mother", "ada"],
  HIDE = ["gran", "brother"],
  AFTER = ["mother", "gran", "deacon"];
export const STEPS = {
  /* 1. A dry year (Stony Gut, August 1865) */
  8: w("gut", "Stony Gut, 1865.", "film", 10, { film: "dry", show: HOME }),
  9: w("gut", "Watch the village.", "playing", 10, { film: "dry", show: HOME }),
  10: t("gut", "Talk to Gran by the cook fire.", ["gran"], 11, { show: HOME, journal: "you" }),
  11: l("gut", "Dig a yam hill in the dry ground.", ["yams"], 12, { show: HOME, journal: "drought" }),
  12: d("gut", "Fetch water from the spring for Gran.", ["jar"], 13, { show: HOME }),
  13: t("gut", "Talk to Papa in the provision ground.", ["father"], 14, { show: HOME, journal: "land" }),
  14: l("gut", "Read Papa's old list from the tin box.", ["list"], 15, { show: HOME, journal: "vote" }),
  15: t("gut", "Talk to Deacon Clarke by the chapel path.", ["deacon"], 16, { show: HOME }),
  16: l("gut", "Read the Queen's Advice to the people.", ["placard"], 17, { show: HOME, journal: "advice" }),
  17: t("gut", "Tell Mama what it said.", ["mother"], 20, { show: HOME }),
  /* 2. The long walk (Spanish Town, August 1865) */
  20: w("town", "The long walk.", "film", 22, { film: "walk", show: WALK }),
  21: w("town", "Watch the road.", "playing", 22, { film: "walk", show: WALK }),
  22: t("town", "Talk to Papa in the square.", ["father"], 23, { show: WALK, journal: "deputation" }),
  23: g("town", "Walk with Papa to the door of King's House.", "gate", 24, { show: WALK }),
  24: t("town", "Hear what the clerk says.", ["secretary"], 25, { show: WALK }),
  25: l("town", "Watch the great door.", ["door"], 26, { show: WALK }),
  26: t("town", "Talk to Papa.", ["father"], 27, { show: WALK, journal: "eyre" }),
  27: w("town", "The road home.", "film", 30, { film: "home", show: WALK }),
  28: w("town", "Watch the road home.", "playing", 30, { film: "home", show: WALK }),
  /* 3. The warrant (Stony Gut: a night in late September, then Tuesday 10 October 1865) */
  30: w("gut", "A night in late September.", "film", 32, { film: "meeting", show: NIGHT }),
  31: w("gut", "Watch the chapel.", "playing", 32, { film: "meeting", show: NIGHT }),
  32: t("gut", "Go to Deacon Clarke in the chapel.", ["deacon"], 33, { show: NIGHT, journal: "bogle" }),
  33: l("gut", "Write the names by the lantern.", ["names"], 34, { show: NIGHT, journal: "names" }),
  34: t("gut", "Talk to Papa on the bench.", ["father"], 35, { show: NIGHT, journal: "oath" }),
  35: w("gut", "Tuesday, the tenth of October.", "film", 37, { film: "warrant", show: WARRANT }),
  36: w("gut", "Watch from the house.", "playing", 37, { film: "warrant", show: WARRANT }),
  37: t("gut", "Talk to Mama and Gran at the door.", ["mother", "gran"], 38, { show: WARRANT, journal: "warrant" }),
  38: g("gut", "Creep to the gap in Bogle's fence.", "yard", 39, { show: WARRANT, journal: "pressed" }),
  39: l("gut", "Watch the men in the yard.", ["drill"], 40, { show: WARRANT, journal: "letter" }),
  /* 4. The eleventh of October (Morant Bay) */
  40: w("bay", "Morant Bay.", "film", 42, { film: "bay", show: MARKET }),
  41: w("bay", "Watch the bay.", "playing", 42, { film: "bay", show: MARKET }),
  42: t("bay", "Talk to Miss Ada at her stall.", ["ada"], 43, { show: MARKET, journal: "bay" }),
  43: d("bay", "Carry Mama's basket to Miss Ada's stall.", ["basket"], 44, { show: MARKET }),
  44: l("bay", "Listen to the east road.", ["shells"], 45, { show: MARKET, journal: "vestry" }),
  45: g("bay", "Hide behind Miss Ada's stall.", "stall", 46, { show: MARKET }),
  46: w("bay", "The Parade, between three and four.", "film", 48, { film: "riot", show: [] }),
  47: w("bay", "Watch from under the stall.", "playing", 48, { film: "riot", show: [] }),
  48: t("bay", "Talk to Miss Ada in the dark.", ["ada"], 49, { show: ["ada"], journal: "eleventh", start: { x: -11.9, z: 7.2, yaw: 0 } }),   /* still behind her stall after the scene, where you hid: not set down across the Parade for her to walk over to you */
  49: t("bay", "Talk to Mama.", ["mother"], 50, { show: MARKET, journal: "courthouse" }),
  /* 5. Martial law (Stony Gut, 18 and 19 October) */
  50: w("gut", "The eighteenth of October.", "film", 52, { film: "soldiers", show: HIDE }),
  51: w("gut", "Watch from the house.", "playing", 52, { film: "soldiers", show: HIDE }),
  52: t("gut", "Talk to Gran behind the house.", ["gran"], 53, { show: HIDE, journal: "martial" }),
  53: g("gut", "Reach the cane without the soldier seeing you.", "cane", 54, { show: HIDE, danger: "yard" }),
  54: g("gut", "Reach the cave, cover to cover.", "cave", 55, { show: HIDE, danger: "yard" }),
  55: t("gut", "Keep Sammy quiet.", ["brother"], 56, { show: HIDE, journal: "hiding" }),
  56: w("gut", "From the cave mouth.", "film", 58, { film: "burning", show: HIDE }),
  57: w("gut", "Watch from the cave.", "playing", 58, { film: "burning", show: HIDE }),
  58: t("gut", "Talk to Gran.", ["gran"], 59, { show: HIDE, journal: "firestick", start: { x: -17.6, z: -11.4, yaw: 0 } }),   /* back in the cave after the scene, not at the village gate: from there Gran and Sammy walked over to you across the whole village (owner, 23 November 2026) */
  59: t("gut", "Talk to Sammy in the dark.", ["brother"], 60, { show: HIDE, journal: "taken" }),
  /* 6. After (Morant Bay, late October 1865, and 2026) */
  60: w("bay", "Morant Bay, under martial law.", "film", 62, { film: "courts", show: AFTER }),
  61: w("bay", "Watch from the shore.", "playing", 62, { film: "courts", show: AFTER }),
  62: t("bay", "Talk to Mama by the shed.", ["mother"], 63, { show: AFTER, journal: "courtsmartial" }),
  63: l("bay", "Read the notice on the flagpole.", ["notice"], 64, { show: AFTER, journal: "martial" }),
  64: t("bay", "Talk to Deacon Clarke.", ["deacon"], 65, { show: AFTER, journal: "gordon" }),
  65: w("bay", "Dawn.", "film", 67, { film: "dawn", show: AFTER }),
  66: w("bay", "Watch the dawn.", "playing", 67, { film: "dawn", show: AFTER }),
  67: t("bay", "Talk to Gran.", ["gran"], 68, { show: AFTER, journal: "commission" }),
  68: w("bay", "Back in 2026.", "film", 70, { film: "today", show: [] }),
  69: w("bay", "Look at Morant Bay today.", "playing", 70, { film: "today", show: [] }),
  70: w("bay", "What do we really know?", "quiz", 71, { journal: "heroes", show: [] }),
  71: w("bay", "The story is told.", "end", null, { end: true, show: [] }),
};
/* Things the player carries. start: where the thing lies at first [x, y, z]; from: where you stand to pick it up; to: where you stand to
   put it down; at: where it is left [x, y, z]. */
export const TASKS = {
  jar: { place: "gut", item: "jar", start: [-15.6, 0.02, 11.6], from: [-15.4, 11.0], to: [-4.6, 7.6], at: [-3.4, 0, 7.4], label: "Fill the water jar", put: "Set the jar by Gran" },
  basket: { place: "bay", item: "basket", start: [-14.4, 0, 7.4], from: [-14.4, 8.1], to: [-11.6, 5.4], at: [-11.3, 0.94, 3.0], label: "Lift Mama's basket", put: "Set it on Miss Ada's stall" },
};
/* Things the player looks at (owner rule 13: a close-up action). at: where you stand. view: the close framing the camera eases to
   (engine/lookshot.js); the place moves the thing while you watch (Q.reveal[id](k), k from 0 to 1, over act seconds) and plays sound; say: a
   short story line or two in the lower bar; then the card says what you found. Spanish Town spots are in the turned square's frame. */
const V = (p, look, fov = 42) => ({ p, look, fov });
export const LOOKS = {
  yams: { place: "gut", at: [-12.4, -1.4], label: "Dig the yam hill", title: "A dry year", view: V([-12.0, 1.2, -1.2], [-12.5, 0.15, -2.4], 44), act: 3, sound: "dig", say: ["The fork goes in. The earth is dust."], lines: ["The yam is no bigger than your fist.", "No rain for months. The yams are small and the streams are low."], page: "drought" },
  list: { place: "gut", shut: true, at: [-4.4, 9.4], label: "Open the tin box", title: "Papa's old list", view: V([-4.3, 1.25, 9.25], [-4.4, 0.5, 8.4], 40), act: 3, sound: "lid", say: ["The lid comes up. A paper, folded small."], lines: ["Names, in a careful hand. Papa's is near the top.", "In 1862 Stony Gut asked Mr Gordon for help with a tax. Paid, it would let them vote."], page: "vote" },
  placard: { place: "gut", at: [2.4, -1.4], label: "Read it aloud", title: "The Queen's Advice", view: V([2.45, 1.62, -1.25], [2.4, 1.52, -2.5], 40), act: 2.8, sound: "paper", say: ["You smooth the paper flat and read it out."], lines: ["It says the Queen wants people to work steadily, for wages.", "Nobody nods. They wanted land, and fair courts.", "Deacon Clarke says nothing. He only looks at the ground."], page: "advice" },
  door: { place: "town", at: [-24.4, 1.2], label: "Watch the great door", title: "The door", view: V([-24.4, 1.75, 1.4], [-32.9, 2.2, 0], 44), act: 3.4, sound: "door", say: ["The great door swings slowly shut."], lines: ["The Governor will not see them.", "Papa takes off his hat, and puts it on again."], page: "eyre" },
  drill: { place: "gut", at: [7.5, -1.8], label: "Look through the fence", title: "The yard", view: V([8.2, 1.25, -1.8], [12, 1.2, -4.4], 46), act: 3.4, sound: "drum", say: ["A drum. Then a shell, blown like a horn."], lines: ["Men in lines, sticks on their shoulders, marching.", "The record says they drilled \"with drum and shells\"."], page: "drill" },
  names: { place: "gut", at: [CH(0.2), CH(-2.8, true)], label: "Write", title: "The names", view: V([CH(0.5), 1.45, CH(-3.2, true)], [CH(-0.2), 0.96, CH(-4.0, true)], 38), act: 4, sound: "pen", say: ["The deacon reads out names. You write them down."], lines: ["Your hand shakes. The lantern smokes.", "You stop before the oath. You do not hear it."], page: "names" },
  shells: { place: "bay", at: [19, 4.6], label: "Listen", title: "The east road", view: V([20.8, 1.6, 9.2], [60, 1.8, 8.4], 30), act: 4, sound: "shell", say: ["Far off, up the road: a shell, a drum, many feet."], lines: ["Dust over the road from the east.", "Miss Ada pulls you back by the arm."], page: "vestry" },
  notice: { place: "bay", at: [16.6, 0.4], label: "Read the notice", title: "Martial law", view: V([16.95, 1.66, 0.35], [16.95, 1.62, -0.9], 40), act: 2.6, sound: "paper", say: ["A printed paper, nailed to the flagpole."], lines: ["Martial law. The army rules here now, not the courts.", "It began on the thirteenth of October. It lasted a month."], page: "martial" },
};
function CH(v, z = false) {
  return (z ? -9 : 6) + v;   /* a spot in the chapel at Stony Gut (places.js CHAPEL: x 6, z -9) */
}
for (const r of Object.values(STEPS)) for (const n of r.needs?.do || []) if (n.carry) n.carry = TASKS[n.id].item;
export const ITEMS = [...new Set(Object.values(TASKS).map((t) => t.item))];
export const TASK_IDS = Object.keys(TASKS);
