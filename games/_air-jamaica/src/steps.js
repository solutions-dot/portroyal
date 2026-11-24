/* The story table (engine/story.js). t: talk. d: carry something and put it down (TASKS). l: look at or do something that changes where
   you can see it (LOOKS). w: a card or the quiz. show: the story people who are there in that step.
   Chapter 1: A flag in the sky (the apron at Palisadoes, 1 April 1969). */
const row = (place, goal, needs, next, extra = {}) => ({ place, goal, needs, next, ...extra });
const t = (place, goal, ids, next, extra) => row(place, goal, { talk: ids }, next, extra);
const d = (place, goal, ids, next, extra) => row(place, goal, { do: ids.map((id) => ({ id, carry: id })) }, next, extra);
const l = (place, goal, ids, next, extra) => row(place, goal, { do: ids }, next, extra);
const w = (place, goal, card, next, extra = {}) => ({ place, goal, wait: true, card, next, ...extra });
const ALL = ["marcia", "hines", "ross"];
const CABIN_ALL = ["dee2", "chef", "clarke"];
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
  34: w("cockpit", "What did you learn?", "quiz", 50, { quiz: "cockpit" }),
  /* 3. The flying chef: the cabin of a jet in the 2000s, flying to Toronto */
  50: t("cabin", "Talk to Mum at the back of the plane.", ["dee2"], 51, { show: CABIN_ALL, journal: "tia" }),
  51: l("cabin", "Look at the magazine in your seat pocket.", ["magazine"], 52, { show: CABIN_ALL, journal: "skywritings" }),
  52: t("cabin", "Meet the chef at the front of the cabin.", ["chef"], 53, { show: CABIN_ALL, journal: "chef" }),
  53: l("cabin", "Look at the chef's trolley.", ["trolley"], 54, { show: CABIN_ALL, journal: "menu" }),
  54: d("cabin", "Carry the ackee and saltfish to Mr Clarke.", ["plate"], 55, { show: CABIN_ALL }),
  55: t("cabin", "Talk to Mr Clarke.", ["clarke"], 56, { show: CABIN_ALL, journal: "taste" }),
  56: w("cabin", "What did you learn?", "quiz", 57, { quiz: "chef", show: CABIN_ALL }),
  57: w("cabin", "The flying chef.", "end", null, { end: true, show: CABIN_ALL }),
};
export const TASKS = {
  plate: { place: "cabin", item: "plate", from: [-0.25, -3.4], to: [0.2, -1.6], at: [0.69, 0.85, -1.98], label: "Pick up the ackee and saltfish", put: "Set it on Mr Clarke's tray" },
};
/* Things the player looks at (owner rule 13: a close-up action, engine/lookshot.js). at: where you stand. view: the close framing the camera
   eases to (or the place's own Q.lookViews[id]). sound: LOOK_SFX in main.js. say: the short story line while it happens. lines: the card after. */
export const LOOKS = {
  tail: {
    place: "apron", at: [23.5, -4.5], label: "Look at the tail", title: "The Love Bird",
    sound: "engine",
    say: ["You walk back along the plane.", "Up on the tail there is a bird."],
    lines: ["The bird is the Doctor Bird, Jamaica's national bird.", "The airline calls it the Love Bird.", "Its colours are orange and white, like the stripe along the plane."],
  },
  crew: {
    place: "apron", at: [-16.0, 1.6], label: "Look along the line", title: "The crew",
    sound: "cheer",
    say: ["The crew stand in a long bright line.", "Yellow, pink and green, side by side."],
    lines: ["Yellow, hot pink and lime green dresses, one after another.", "They wear white gloves.", "Marguerite Kirkpatrick, a former Miss Jamaica, designed the uniforms."],
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
