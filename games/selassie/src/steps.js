/* Step data uses the shared story API. Every required task has a visible change.
   Places, chapter by chapter: yard and memory (1), downtown (2), parade and road (3), airport (4, 5), lane (6). */
const talk = (place, goal, ids, next, journal) => ({
  place,
  goal,
  needs: { talk: ids },
  next,
  journal,
});
const task = (place, goal, id, next, carry, journal) => ({
  place,
  goal,
  needs: { do: [{ id, ...(carry ? { carry } : {}) }] },
  next,
  ...(journal ? { journal } : {}),
});
const go = (place, goal, id, next) => ({
  place,
  goal,
  needs: { go: [id] },
  next,
});
const wait = (place, goal) => ({ place, goal, wait: true });
export const STEPS = {
  10: talk("yard", "Talk to Grandma Adina.", ["adina"], 11, "family"),
  11: task("yard", "Carry the tin to the table.", "tin", 12, "tin"),
  12: task("yard", "Open the tin on the table.", "openTin", 13),
  13: task("memory", "Pick up the newspaper.", "paper", 14, "paper"),
  14: task("memory", "Put the newspaper beside the map.", "map", 15),
  15: talk("memory", "Talk to Mr. Brown.", ["vendor"], 16, "coronation"),
  16: wait("yard", "Remember the picture together."),
  // chapter 2: downtown Kingston, the day before the visit
  20: talk("downtown", "Hear why the visit matters.", ["mum", "levi"], 21, "faith"),
  21: task("downtown", "Carry the flags to Uncle Levi's cart.", "flags", 22, "flags", "ready"),
  22: task("downtown", "Buy a newspaper from the newsboy.", "gleaner", 23, "gleaner"),
  23: task("downtown", "Give Grandma the newspaper.", "paperGran", 24, "gleaner", "gleaner"),
  24: talk("downtown", "Talk to Grandma Adina.", ["adina"], 25, "picture"),
  25: {
    place: "downtown",
    goal: "Get water, bread and oranges for tomorrow.",
    needs: {
      do: [
        { id: "water", carry: "bottle" },
        { id: "lunch", carry: "lunch" },
        { id: "fruit", carry: "fruit" },
      ],
    },
    next: 26,
  },
  26: wait("downtown", "The family is ready for tomorrow."),
  // chapter 3: the Parade bus park, then the Palisadoes road
  30: go("parade", "Follow Mum to the bus.", "busStop", 31),
  31: task("parade", "Buy the tickets from the conductor.", "buyTicket", 33, "ticket"),   /* "Give the tickets to Mum" was cut (owner rule 14): Mum takes them as you buy them */
  33: task("parade", "Climb on the bus with your family.", "bus", 34, null, "buses"),
  34: task("road", "Bring Grandma some water.", "roadWater", 35, "bottle"),
  35: task("road", "Look out over the harbour.", "lookout", 36),
  36: go("road", "Walk on toward the airport.", "roadEnd", 37),
  37: go("airport", "Find the family meeting place.", "meeting", 38),
  38: talk("airport", "Talk to Mum.", ["mum"], 40, "road"),
  40: talk(
    "airport",
    "Find out how everyone is feeling.",
    ["mum", "adina"],
    41,
    "airport",
  ),
  41: task("airport", "Spread the waiting cloth.", "mat", 42),
  42: task(
    "airport",
    "Pick up the water bottle.",
    "airportWater",
    43,
    "bottle",
  ),
  43: {
    place: "airport",
    goal: "Share water with two neighbours.",
    needs: { do: [{ id: "share", n: 2, carry: "bottle" }] },
    next: 44,
  },
  44: talk("airport", "Listen to Uncle Levi.", ["levi"], 45, "fairness"),
  45: task("airport", "Look toward the runway.", "horizon", 46),
  46: wait("airport", "A sound changes the waiting."),
  50: wait("airport", "The arrival is about to begin."),
  51: wait("airport", "Watch the aircraft approach."),
  55: talk("airport", "Speak to Grandma beside you.", ["adina"], 56, "arrival"),
  56: wait("airport", "Choose what you will remember."),
  57: wait("airport", "Take this memory home."),
  // chapter 6: that evening, in the family's lane
  60: talk("lane", "Talk to Mum about the day.", ["mum"], 61),
  61: task(
    "lane",
    "Put the bus ticket beside the picture.",
    "ticket",
    62,
    "ticket",
    "evening",
  ),
  62: talk("lane", "Share your memories together.", ["adina", "levi"], 63),
  63: wait("lane", "Write one memory in your journal."),
  64: {
    place: "lane",
    goal: "Your journey is in the journal.",
    wait: true,
    end: true,
  },
};
export const ITEMS = [
  "tin",
  "paper",
  "flags",
  "gleaner",
  "bottle",
  "lunch",
  "fruit",
  "ticket",
];
/* the stage that shows each place (dev checks and the heads check walk through these) */
export const PLACE_STAGES = { yard: 10, memory: 15, downtown: 20, parade: 30, road: 34, airport: 50, lane: 60 };
export const TASK_IDS = [
  ...new Set(
    Object.values(STEPS).flatMap((s) =>
      (s.needs?.do || []).map((x) => (typeof x === "string" ? x : x.id)),
    ),
  ),
];
