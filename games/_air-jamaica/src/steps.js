/* The story table (engine/story.js). t: talk. d: carry something and put it down (TASKS). l: look at or do something that changes where
   you can see it (LOOKS). w: a card or the quiz. show: the story people who are there in that step.
   Chapter 1: A flag in the sky (the apron at Palisadoes, 1 April 1969). */
const row = (place, goal, needs, next, extra = {}) => ({ place, goal, needs, next, ...extra });
const t = (place, goal, ids, next, extra) => row(place, goal, { talk: ids }, next, extra);
const d = (place, goal, ids, next, extra) => row(place, goal, { do: ids.map((id) => ({ id, carry: id })) }, next, extra);
const l = (place, goal, ids, next, extra) => row(place, goal, { do: ids }, next, extra);
const w = (place, goal, card, next, extra = {}) => ({ place, goal, wait: true, card, next, ...extra });
const ALL = ["marcia", "hines", "ross"];
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
  18: w("gallery", "What did you learn?", "quiz", 19, { journal: "today" }),
  19: w("gallery", "The first morning is over.", "end", null, { end: true }),
};
export const TASKS = {};
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
export const ITEMS = [];
export const TASK_IDS = [];
