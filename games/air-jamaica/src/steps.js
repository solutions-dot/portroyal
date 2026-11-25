/* The story table (engine/story.js). t: talk. d: carry something and put it down (TASKS). l: look at or do something that changes where
   you can see it (LOOKS). w: a card or the quiz. show: the story people who are there in that step.
   Chapter 1: A flag in the sky (the apron at Palisadoes, 1 April 1969). */
import { CABIN } from "./cabin.js";   /* Mr Clarke's tray follows the seats */
const row = (place, goal, needs, next, extra = {}) => ({ place, goal, needs, next, ...extra });
const t = (place, goal, ids, next, extra) => row(place, goal, { talk: ids }, next, extra);
const d = (place, goal, ids, next, extra) => row(place, goal, { do: ids.map((id) => ({ id, carry: id })) }, next, extra);
const l = (place, goal, ids, next, extra) => row(place, goal, { do: ids }, next, extra);
const w = (place, goal, card, next, extra = {}) => ({ place, goal, wait: true, card, next, ...extra });
const ALL = ["marcia", "hines", "ross"];
const CABIN_ALL = ["dee2", "chef", "clarke"];
const NEW_ALL = ["marcia94", "hines94"], HOME_ALL = ["marcia10", "dee10"], LAST_ALL = ["dee10s", "grant"];
export const STEPS = {
  /* 1. A flag in the sky */
  10: t("apron", "Talk to Aunt Marcia in the line of crew.", ["marcia"], 11, { show: ALL, journal: "you" }),
  11: l("apron", "Look at the bird on the plane's tail.", ["tail"], 12, { show: ALL, journal: "lovebird" }),
  12: t("apron", "Talk to Mr Hines at the foot of the steps.", ["hines"], 13, { show: ALL, journal: "plane" }),
  13: l("apron", "Look along the line of crew.", ["crew"], 14, { show: ALL, journal: "uniforms" }),
  14: t("apron", "Talk to Captain Ross by the nose.", ["ross"], 15, { show: ALL, journal: "captain" }),
  15: t("gallery", "Join Mum in the waving gallery.", ["mum"], 16, { show: ["mum"], journal: "gallery" }),
  16: w("gallery", "The first flight leaves.", "film", 17, { film: "takeoff", show: ["mum"] }),
  17: w("gallery", "The first flight leaves.", "playing", 18, { film: "takeoff", show: ["mum"] }),
  18: w("gallery", "What did you learn?", "quiz", 30, { journal: "today" }),
  /* 2. The view from the front: the flight deck of the DC-8, coming in to land */
  30: l("cockpit", "Look at the dials in front of the captain.", ["panel"], 31, { journal: "cockpit" }),
  31: l("cockpit", "Look at the four levers between the seats.", ["levers"], 32, { journal: "levers" }),
  32: w("cockpit", "The plane comes in to land.", "film", 33, { film: "landing" }),
  33: w("cockpit", "The plane comes in to land.", "playing", 34, { film: "landing" }),
  34: w("cockpit", "What did you learn?", "quiz", 38, { quiz: "cockpit" }),
  /* 3. New colours: first the new look shown off (FILMS.reveal) */
  38: w("newlook", "The new colours.", "film", 39, { film: "reveal", show: NEW_ALL }),
  39: w("newlook", "The new colours.", "playing", 40, { film: "reveal", show: NEW_ALL }),
  /* 4. New colours: the apron at Norman Manley Airport, December 1994 */
  40: t("newlook", "Talk to Aunt Marcia by the new plane.", ["marcia94"], 41, { show: NEW_ALL, journal: "dee94" }),
  41: l("newlook", "Look up at the new tail.", ["tail94"], 42, { show: NEW_ALL, journal: "newlook" }),
  42: t("newlook", "Talk to Mr Hines by the nose.", ["hines94"], 43, { show: NEW_ALL, journal: "owners" }),
  43: l("newlook", "Look at the name and the flag.", ["nose"], 44, { show: NEW_ALL, journal: "airbus" }),
  44: w("newlook", "The new look takes off.", "film", 45, { film: "newflight", show: NEW_ALL }),
  45: w("newlook", "The new look takes off.", "playing", 46, { film: "newflight", show: NEW_ALL }),
  46: w("newlook", "What did you learn?", "quiz", 50, { quiz: "newlook", show: NEW_ALL }),
  /* 3. The flying chef: the cabin of a jet in the 2000s, flying to Toronto */
  50: t("cabin", "Talk to Mum in her seat near the back.", ["dee2"], 51, { show: CABIN_ALL, journal: "tia" }),
  51: l("cabin", "Look at the magazine in your seat pocket.", ["magazine"], 52, { show: CABIN_ALL, journal: "skywritings" }),
  52: t("cabin", "Meet the chef at the front of the cabin.", ["chef"], 53, { show: CABIN_ALL, journal: "chef" }),
  53: l("cabin", "Look at the chef's trolley.", ["trolley"], 54, { show: CABIN_ALL, journal: "menu" }),
  54: d("cabin", "Carry the ackee and saltfish to Mr Clarke.", ["plate"], 55, { show: CABIN_ALL }),
  55: t("cabin", "Talk to Mr Clarke.", ["clarke"], 56, { show: CABIN_ALL, journal: "taste" }),
  56: w("cabin", "What did you learn?", "quiz", 70, { quiz: "chef", show: CABIN_ALL }),
  /* 5. The sale: Aunt Marcia's front room in Kingston, April 2010 */
  70: t("home", "Talk to Aunt Marcia.", ["marcia10"], 71, { show: HOME_ALL, journal: "sale" }),
  71: l("home", "Open Aunt Marcia's old box.", ["box"], 72, { show: HOME_ALL, journal: "keepsakes" }),
  72: t("home", "Talk to Mum by the door.", ["dee10"], 73, { show: HOME_ALL, journal: "tia14" }),
  73: w("home", "What did you learn?", "quiz", 90, { quiz: "sale", show: HOME_ALL }),
  /* 6. The last flight home: on board from Fort Lauderdale, 30 April 2010, and the landing at Kingston */
  90: t("lastflight", "Talk to Mum in the seat beside yours.", ["dee10s"], 91, { show: LAST_ALL, journal: "lastflight" }),
  91: t("lastflight", "Talk to Mr Grant across the aisle.", ["grant"], 92, { show: LAST_ALL, journal: "grant" }),
  92: l("lastflight", "Look out of the window.", ["window"], 93, { show: LAST_ALL }),
  93: w("lastflight", "The last flight comes home.", "film", 94, { film: "lastlanding", show: LAST_ALL }),
  94: w("arrival", "The last flight comes home.", "playing", 95, { film: "lastlanding" }),
  95: w("arrival", "What did you learn?", "quiz", 96, { quiz: "last" }),
  96: w("arrival", "The last flight home.", "end", null, { end: true, journal: "kept" }),
};
export const TASKS = {
  plate: { place: "cabin", item: "plate", from: [-0.25, -3.4], to: [0.2, -1.6], at: [CABIN.seatX[0], 0.85, CABIN.rows[0] + 0.42], label: "Pick up the ackee and saltfish", put: "Set it on Mr Clarke's tray" },
};
/* Things the player looks at (owner rule 13: a close-up action, engine/lookshot.js). at: where you stand. view: the close framing the camera
   eases to (or the place's own Q.lookViews[id]). sound: LOOK_SFX in main.js. say: the short story line while it happens. lines: the card after. */
export const LOOKS = {
  tail: {
    place: "apron", at: [23.5, 6.0], label: "Look at the tail", title: "The Love Bird",
    sound: "engine",
    say: ["You walk back along the plane.", "Up on the tail there is a bird."],
    lines: ["The bird is the Doctor Bird, Jamaica's national bird.", "The airline calls it the Love Bird.", "Its colours are orange and white, like the stripe along the plane."],
  },
  crew: {
    place: "apron", at: [-16.0, 1.6], label: "Look along the line", title: "The crew",
    sound: "cheer",
    say: ["The crew stand in a long bright line.", "Yellow, pink and green, side by side."],
    lines: ["Yellow, hot pink and lime green dresses, one after another.", "They wear white gloves. A white flight bag stands at each one's feet.", "Marguerite Kirkpatrick, a former Miss Jamaica, designed the uniforms."],
  },
};
LOOKS.panel = {
  place: "cockpit", at: [-0.3, 0.8], label: "Look at the dials", title: "The instrument panel",
  sound: "click",
  say: ["You lean in between the seats.", "Dials, dials, and more dials."],
  lines: ["The round dials tell the pilots how high they are, how fast they fly and which way they point.", "The one with blue above and brown below is the horizon.", "The row in the middle is for the four engines."],
};
LOOKS.levers = {
  place: "cockpit", at: [0.1, 0.8], label: "Look at the levers", title: "The throttles",
  sound: "click",
  say: ["Between the two seats there are four levers."],
  lines: ["Each lever with a black knob is for one engine.", "Push them forward and the engines push harder.", "The red knob is for the speed brake."],
};
export const ITEMS = ["plate"];
export const TASK_IDS = ["plate"];
LOOKS.trolley = {
  place: "cabin", at: [0.05, -3.3], label: "Look at the trolley", title: "The flying chef's menu",
  sound: "lid",
  say: ["The silver lids come off, one by one.", "It smells like home."],
  lines: ["Ackee and saltfish, Jamaica's national dish.", "Calaloo and saltfish, and run dung: fish in coconut sauce.", "Festival, a sweet fried dumpling, and jerk chicken.", "The chef asks you to take the ackee and saltfish to Mr Clarke."],
};
LOOKS.magazine = {
  place: "cabin", at: [-0.22, 1.25], label: "Look at the magazine", title: "SkyWritings",
  sound: "page",
  say: ["You pull the magazine from the seat pocket.", "It opens on a story about the airline."],
  lines: ["SkyWritings is Air Jamaica's own magazine.", "Air Jamaica first flew on 1 April 1969.", "The Doctor Bird on the tail is called the Love Bird.", "In 1994 new owners gave the planes new colours.", "The page says a chef flies on the planes now.", "Go and meet him at the front."],
};
LOOKS.tail94 = {
  place: "newlook", at: [24.5, 6.5], label: "Look at the tail", title: "The new tail",
  sound: "engine",
  say: ["You walk back along the new plane.", "The tail is dark blue now."],
  lines: ["The bird is still on the tail, yellow on dark blue.", "Pink and purple bars run across the top.", "Yellow, orange and pink bands sweep up from the body."],
};
LOOKS.nose = {
  place: "newlook", at: [-8.6, 2.4], label: "Look at the name", title: "The name and the flag",
  sound: "cheer",
  say: ["You walk round to the front of the plane.", "Big round letters, pink and blue."],
  lines: ["The name reads air in pink and Jamaica in dark blue.", "The Jamaican flag sits under the cockpit windows.", "People called these some of the prettiest planes in the sky."],
};
LOOKS.box = {
  place: "home", at: [0.9, 0.2], label: "Open the box", title: "Aunt Marcia's box",
  sound: "page",
  say: ["The lid lifts.", "Inside, folded neatly, is a bright yellow dress."],
  lines: ["Aunt Marcia wore this dress on her first day, 1 April 1969.", "Her white gloves are with it.", "And a photo of the first crew in a long, bright line."],
};
LOOKS.window = {
  place: "lastflight", at: [-0.3, 0.75], label: "Look out of the window", title: "Nearly home",
  sound: "engine",
  say: ["You lift the window blind.", "The sky is pink and gold over the sea."],
  lines: ["The sun is going down.", "Lights shine along the coast of Jamaica.", "The plane starts to come down toward Kingston."],
};
