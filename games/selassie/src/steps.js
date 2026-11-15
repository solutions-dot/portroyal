/* Step data uses the shared story API. Every required task has a visible change. */
const talk = (place, goal, ids, next, journal) => ({
  place,
  goal,
  needs: { talk: ids },
  next,
  journal,
});
const task = (place, goal, id, next, carry) => ({
  place,
  goal,
  needs: { do: [{ id, ...(carry ? { carry } : {}) }] },
  next,
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
  20: talk("yard", "Hear why the visit matters.", ["mum", "levi"], 21, "faith"),
  21: task(
    "yard",
    "Carry the thread to the sewing table.",
    "thread",
    22,
    "thread",
  ),
  22: task("yard", "Set the thread beside the machine.", "sewing", 23),
  23: task("yard", "Help finish the chair.", "chair", 24),
  24: talk("yard", "Talk to Grandma Adina.", ["adina"], 25, "picture"),
  25: {
    place: "yard",
    goal: "Pack water, lunch and the picture.",
    needs: {
      do: [
        { id: "water", carry: "bottle" },
        { id: "lunch", carry: "lunch" },
        { id: "photo", carry: "photo" },
      ],
    },
    next: 26,
  },
  26: wait("yard", "The family is ready to leave."),
  30: go("road", "Follow Mum to the bus stop.", "busStop", 31),
  31: task("road", "Bring Grandma some water.", "roadWater", 32, "bottle"),
  32: go("road", "Look out over the harbour.", "lookout", 33),
  33: task("road", "Join your family on the bus.", "bus", 34),
  34: go("airport", "Find the family meeting place.", "meeting", 35),
  35: talk("airport", "Talk to Mum.", ["mum"], 40, "road"),
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
  45: go("airport", "Look toward the runway.", "horizon", 46),
  46: wait("airport", "A sound changes the waiting."),
  50: wait("airport", "The arrival is about to begin."),
  51: wait("airport", "Watch the aircraft approach."),
  55: talk("airport", "Speak to Grandma beside you.", ["adina"], 56, "arrival"),
  56: wait("airport", "Choose what you will remember."),
  57: wait("airport", "Take this memory home."),
  60: talk("yard", "Talk to Mum about the day.", ["mum"], 61),
  61: task(
    "yard",
    "Put the bus ticket beside the picture.",
    "ticket",
    62,
    "ticket",
  ),
  62: talk("yard", "Share your memories together.", ["adina", "levi"], 63),
  63: wait("yard", "Write one memory in your journal."),
  64: {
    place: "yard",
    goal: "Your journey is in the journal.",
    wait: true,
    end: true,
  },
};
export const ITEMS = [
  "tin",
  "paper",
  "thread",
  "bottle",
  "lunch",
  "photo",
  "ticket",
];
export const TASK_IDS = [
  ...new Set(
    Object.values(STEPS).flatMap((s) =>
      (s.needs?.do || []).map((x) => (typeof x === "string" ? x : x.id)),
    ),
  ),
];
