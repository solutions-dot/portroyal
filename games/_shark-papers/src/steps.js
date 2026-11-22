/* The story table (engine/story.js). t: talk. l: look at something, which changes where you can see it (LOOKS). w: a card, a camera
   scene or the quiz. */
const row = (place, goal, needs, next, extra = {}) => ({ place, goal, needs, next, ...extra });
const t = (place, goal, ids, next, extra) => row(place, goal, { talk: ids }, next, extra);
const l = (place, goal, ids, next, extra) => row(place, goal, { do: ids }, next, extra);
const w = (place, goal, card, next, extra = {}) => ({ place, goal, wait: true, card, next, ...extra });
export const STEPS = {
  /* 1. The night tour */
  10: t("house", "Talk to Miss Bryan, the guide.", ["guide"], 11, { journal: "you" }),
  11: l("house", "Look at the portraits by candlelight.", ["portraits"], 12),
  12: t("house", "Talk to Tia.", ["cousin"], 13, { journal: "legend" }),
  13: w("house", "The story they tell at night.", "film", 20, { film: "legend" }),
  14: w("house", "Watch the shadows.", "playing", 20, { film: "legend" }),
  /* 2. The white monument */
  20: t("church", "Talk to Sister Reid in the church.", ["warden"], 21, { journal: "rosa" }),
  21: l("church", "Read the white monument.", ["monument"], 22),
  22: w("church", "Two women, one story.", "note", 30, { note: "mixed" }),
  /* 3. The papers */
  30: t("archive", "Talk to Mrs Lindo at the archives.", ["archivist"], 31, { journal: "annie" }),
  31: l("archive", "Read the three papers on the desk.", ["register", "pamphlet", "novel"], 32),
  32: t("archive", "Ask Mrs Lindo who is missing.", ["archivist"], 40, { journal: "how" }),
  /* 4. The names */
  40: t("estate", "Talk to Miss Bryan by the old wall.", ["guide"], 41, { journal: "journal" }),
  41: l("estate", "Read the names on the board.", ["names"], 42),
  42: t("estate", "Talk to Tia.", ["cousin"], 43, { journal: "slavery" }),
  43: w("estate", "Legend or record?", "quiz", 44, { journal: "why" }),
  44: w("estate", "The story is told.", "end", null, { end: true }),
};
export const TASKS = {};
export const LOOKS = {
  portraits: { place: "house", at: [-3.2, -2.2], label: "Hold the candle up", title: "The husbands", lines: ["Three tall paintings of men. The guide says: her three husbands.", "A visitor in 1830 did see paintings here, in the empty house.", "He wrote that they were the husbands of the last lady of the house. Keep that in mind."], page: "legend" },
  monument: { place: "church", at: [0, -2.6], label: "Read the monument", title: "Mrs Rosa Palmer, 1790", lines: ["“Her manners were open, cheerful and agreeable.”", "Rosa Palmer was the first lady of Rose Hall. She died in 1790.", "She had four husbands. Nobody ever said a word against her."], page: "rosa" },
  register: { place: "archive", at: [-1.6, 0.4], label: "Read the burial book", title: "Buried 9 July 1846", lines: ["Annie Palmer was buried in Montego Bay churchyard on 9 July 1846.", "The legend says she was killed in 1831. She lived fifteen years more.", "She had one husband, John Rose Palmer. He died in 1827."], page: "annie" },
  pamphlet: { place: "archive", at: [0, 0.4], label: "Read the pamphlet", title: "A pamphlet of 1868", lines: ["Here the tale is first printed: a Mrs Palmer, three husbands, murder.", "It was printed twenty-two years after Annie died.", "It has no Haiti, no magic and no name for a killer."], page: "how" },
  novel: { place: "archive", at: [1.6, 0.4], label: "Open the novel", title: "A novel of 1929", lines: ["“The White Witch of Rosehall”, by Herbert de Lisser.", "The Haiti childhood, Takoo and Millicent begin here.", "It is a made-up story. The tour tells it as history."], page: "how" },
  names: { place: "estate", at: [0, 0.6], label: "Read the names", title: "Two hundred and eight people", lines: ["Celia, a grass cutter. Dorinda, the midwife. Hercules, who ran away twenty-six times.", "The estate book names 208 people held here from 1817 to 1832.", "There is no Takoo in it, and no Millicent."], page: "journal" },
};
export const ITEMS = [];
export const TASK_IDS = [];
