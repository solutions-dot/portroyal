/* The story table (engine/story.js). t: talk. l: look at something, which changes where you can see it (LOOKS). w: a card, a camera
   scene or the quiz. Six chapters in four places: the night tour and the shadow show in the great house, the church, the archives, and two
   chapters on the estate by day. */
const row = (place, goal, needs, next, extra = {}) => ({ place, goal, needs, next, ...extra });
const t = (place, goal, ids, next, extra) => row(place, goal, { talk: ids }, next, extra);
const l = (place, goal, ids, next, extra) => row(place, goal, { do: ids }, next, extra);
const w = (place, goal, card, next, extra = {}) => ({ place, goal, wait: true, card, next, ...extra });
export const STEPS = {
  /* 1. The night tour: first the walk up to the house at night (a camera scene on the estate, relit for the night) */
  8: w("estate", "Rose Hall at night.", "film", 10, { film: "arrive", show: [] }),
  9: w("estate", "Walk up to the house.", "playing", 10, { film: "arrive", show: [] }),
  10: t("house", "Talk to Miss Bryan, the guide.", ["guide"], 11, { journal: "you" }),
  11: l("house", "Look at the great stair and the sea window.", ["stair", "window"], 12),
  12: l("house", "Read the card that points upstairs.", ["bedroom"], 13),
  13: t("house", "Follow Miss Bryan into the eating-room.", ["guide"], 14),
  14: l("house", "Look at the cup at the head of the table.", ["coffee"], 15),
  15: t("house", "Follow Miss Bryan into the drawing-room.", ["guide"], 16),
  16: l("house", "Look at the paintings by candlelight.", ["portraits"], 17),
  17: t("house", "Talk to Tia.", ["cousin"], 20, { journal: "legend" }),
  /* 2. The shadow show */
  20: t("house", "Talk to Miss Bryan by the bare wall.", ["guide"], 21),
  21: l("house", "Help put out the candles.", ["snuff"], 22),
  22: t("house", "Talk to Tia.", ["cousin"], 23),
  23: w("house", "The story they tell at night.", "film", 25, { film: "legend" }),
  24: w("house", "Watch the shadows.", "playing", 25, { film: "legend" }),
  25: t("house", "Ask Miss Bryan what really happened.", ["guide"], 26, { journal: "telling" }),
  26: l("house", "Look at the mirror the tours talk about.", ["mirror"], 27),
  27: t("house", "Talk to Tia.", ["cousin"], 28),
  28: w("house", "Now check the story.", "note", 30, { note: "told" }),
  /* 3. The white monument: first the walk up the church to it (a camera scene) */
  30: w("church", "The white monument.", "film", 32, { film: "aisle" }),
  31: w("church", "Walk up to the altar.", "playing", 32, { film: "aisle" }),
  32: t("church", "Talk to Sister Reid in the church.", ["warden"], 33, { journal: "rosa" }),
  33: l("church", "Read the white monument.", ["monument"], 34),
  34: l("church", "Read the note on the desk by the monument.", ["husbands"], 35),
  35: t("church", "Talk to Tia.", ["cousin"], 36),
  36: t("church", "Talk to Sister Reid again.", ["warden"], 37),
  37: w("church", "Two women, one story.", "note", 40, { note: "mixed" }),
  /* 4. The papers */
  40: t("archive", "Talk to Mrs Lindo at the counter.", ["archivist"], 41, { journal: "annie" }),
  41: l("archive", "Read the marriage book and the obituary.", ["marriage", "obituary"], 42, { journal: "john" }),
  42: l("archive", "Read the deed, the burial book and the register.", ["deed", "burial", "register"], 43),
  43: t("archive", "Talk to Tia.", ["cousin"], 44),
  44: l("archive", "Read the pamphlet and the novel.", ["pamphlet", "novel"], 45),
  45: t("archive", "Ask Mrs Lindo who is missing.", ["archivist"], 46, { journal: "how" }),
  46: w("archive", "Open the estate's own book.", "film", 48, { film: "pages" }),
  47: w("archive", "Turn the pages of the book.", "playing", 48, { film: "pages" }),
  48: t("archive", "Talk to Mrs Lindo.", ["archivist"], 49),
  49: w("archive", "The book with the names.", "note", 50, { note: "book" }),
  /* 5. The names */
  50: t("estate", "Talk to Miss Bryan by the board.", ["guide"], 51, { journal: "journal" }),
  51: l("estate", "Read the board of names and the clothing card.", ["names", "clothes"], 52),
  52: l("estate", "Read the stones for Celia and Dorinda.", ["celia", "dorinda"], 53),
  53: l("estate", "Read the stones for the people with work titles.", ["cecelia", "heads"], 54),
  54: l("estate", "Read the stones for Hercules, Doshy and Archey.", ["runaways", "archey"], 55),
  55: t("estate", "Talk to Miss Bryan.", ["guide"], 56, { journal: "lives" }),
  56: t("estate", "Talk to Tia.", ["cousin"], 57, { journal: "slavery" }),
  57: w("estate", "Two hundred and eight.", "note", 60, { note: "names" }),
  /* 6. Legend or record */
  60: t("estate", "Meet Miss Bryan at the last stop of the tour.", ["guide"], 61),
  61: l("estate", "Read the card by the tomb.", ["tomb"], 62),
  62: l("estate", "Read the cards about the house and about freedom.", ["built", "freedom"], 63),
  63: t("estate", "Talk to Miss Bryan.", ["guide"], 64, { journal: "why" }),
  64: t("estate", "Talk to Tia.", ["cousin"], 65),
  65: w("estate", "Legend or record?", "quiz", 66),
  66: w("estate", "The story is told.", "end", null, { end: true }),
};
export const TASKS = {};
const Q = (s) => "“" + s + "”";
export const LOOKS = {
  stair: { place: "house", at: [0, -0.5], label: "Look at the stair", title: "The great stair", lines: ["A visitor about 1820 wrote of a mahogany staircase here.", "This stair is new. The house was a ruin until it was restored."], focus: [0, 1.4, 1.8], dist: 2.3, sound: "candle", say: ["Miss Bryan lifts her candle up the stair."], page: "house" },
  bedroom: { place: "house", at: [3.0, -0.3], label: "Read the card", title: "“Annie's Bedroom”", lines: ["The tour shows a room upstairs as Annie's bedroom.", "No paper from her time says which room was hers.", "Like the “dungeon”, it belongs to the tour, not the record."], focus: [3.0, 1.0, 0.7], dist: 1.4, sound: "card", say: ["The card points up the dark stair."], page: "house" },
  coffee: { place: "house", at: [6.6, 0.4], label: "Look at the cup", title: "The coffee cup", lines: ["The card says a husband was poisoned with this cup.", "Poison, arsenic and boiling oil are told only on modern tours.", "No record says any husband was poisoned."], focus: [7.55, 0.8, 0.4], dist: 1.0, lift: 0.45, sound: "cup", say: ["You lift the cup and set it back down."], page: "telling" },
  portraits: { place: "house", at: [-13.2, 0], label: "Hold the candle up", title: "The husbands", lines: ["Three tall paintings of men. The guide says: her three husbands.", "A visitor in 1830 did see paintings here, in the empty house.", "He wrote that they were the husbands of the last lady of the house. Keep that in mind."], view: { p: [-10.6, 1.9, 0], look: [-14.7, 2.1, 0], fov: 50 }, sound: "candle", act: 2.6, say: ["You hold the candle up. Three men look down."], page: "legend" },
  window: { place: "house", at: [-2.7, -3.7], label: "Look out of the window", title: "The sea view", lines: ["A visitor about 1820 wrote of " + Q("a very extensive sea view") + ".", "The house looks north, over the sea.", "In 1830 a preacher found it empty, " + Q("save by rats, bats, and owls") + "."], focus: [-2.7, 2.0, -4.8], dist: 1.5, lift: 0.2, sound: "lamp", say: ["Moonlight on the sea, far below."], page: "house" },
  mirror: { place: "house", at: [-5.3, -2.9], label: "Look in the mirror", title: "The face in the mirror", lines: ["Some guides say her face shows in a mirror at night.", "That is told only on modern tours.", "No old paper speaks of a face in a mirror."], focus: [-4.25, 2.2, -2.9], dist: 1.4, lift: 0.1, sound: "candle", say: ["Your candle in the glass. Only your own face."], page: "telling" },
  snuff: { place: "house", at: [-9.5, -1.4], label: "Put out the candles", title: "One small flame", lines: ["You pinch out the candles one by one.", "Only the candle by the bare wall still burns.", "Now the guide can make shadows."], view: { p: [-7.2, 1.7, -3.2], look: [-10.4, 1.6, 1.6], fov: 52 }, sound: "snuff", act: 2.8, say: ["One by one, the candles go out."], page: "telling" },
  monument: { place: "church", at: [-4.0, -9.5], label: "Read the monument", title: "Mrs Rosa Palmer, 1790", lines: [Q("Near this place are deposited the Remains of Mrs Rosa Palmer, who died on the first day of May 1790."), Q("Her manners were open, cheerful and agreeable."), "Rosa Palmer was the first lady of Rose Hall. Her stone praises her.", "On the vase is a small carved head. A historian thought it was probably her face."], view: { p: [-3.3, 1.7, -7.5], look: [-4.0, 1.5, -10.7], fov: 50 }, sound: "lamp", say: ["The lamp over the marble is turned up."], page: "rosa" },
  husbands: { place: "church", at: [-4.9, -8.6], label: "Read the note", title: "Four husbands", lines: ["Rosa Palmer married four times.", "Henry Fanning, George Ash, Norwood Witter, John Palmer.", "The monument was made by John Bacon in 1794."], focus: [-5.69, 1.2, -8.6], dist: 0.95, lift: 0.4, sound: "paper", say: ["You lift the church's note to read it."], page: "rosa" },
  marriage: { place: "archive", at: [-4.1, 0.5], label: "Read the marriage book", title: "Married 28 March 1820", lines: ["Annie Mary Paterson married John Rose Palmer.", "At Mount Pleasant, St James, on 28 March 1820.", "She never married again. They had no children."], view: { p: [-4.1, 1.4, -1.32], look: [-4.1, 0.78, -0.58], fov: 40 }, sound: "tissue", say: ["You draw back the tissue. A marriage book."], page: "annie" },
  obituary: { place: "archive", at: [-2.8, 0.5], label: "Read the obituary", title: "Died, November 1827", lines: ["John Rose Palmer died at Rose Hall, aged 42, deep in debt.", "The cause of his death is not known.", Q("His intrinsic worth, kind heart, and generous disposition obtained him the esteem of all his acquaintance.")], view: { p: [-2.8, 1.4, -1.32], look: [-2.8, 0.78, -0.58], fov: 40 }, sound: "tissue", say: ["Under the tissue, a newspaper of 1827."], page: "john" },
  deed: { place: "archive", at: [-1.5, 0.5], label: "Read the deed", title: "Sold, 1830", lines: ["In 1830 Annie sold " + Q("whatever rights she may have had") + " in Rose Hall.", "She was paid 200 pounds.", "She sold a year before the great rebellion began."], view: { p: [-1.5, 1.4, -1.32], look: [-1.5, 0.78, -0.58], fov: 40 }, sound: "tissue", say: ["A deed, signed in 1830."], page: "annie" },
  burial: { place: "archive", at: [-0.2, 0.5], label: "Read the burial book", title: "Buried 9 July 1846", lines: ["Annie Palmer was buried in Montego Bay churchyard on 9 July 1846.", "The legend says she was killed in 1831. She lived fifteen years more.", "No tombstone of hers has survived."], view: { p: [-0.2, 1.4, -1.32], look: [-0.2, 0.78, -0.58], fov: 40 }, sound: "tissue", say: ["The burial book of Montego Bay."], page: "annie" },
  register: { place: "archive", at: [6.5, 1.6], label: "Look in the glass case", title: "A slave register", lines: ["The registers list the people each owner held in slavery.", "Annie Palmer held four people in 1829, and eight in 1833.", "She was no witch. But she did own people."], focus: [7.3, 0.92, 1.6], dist: 1.0, lift: 0.55, sound: "lamp", say: ["The case light shows a page of names."], page: "annie" },
  pamphlet: { place: "archive", at: [4.4, 0.5], label: "Read the pamphlet", title: "A pamphlet of 1868", lines: ["Here the tale is first printed: a Mrs Palmer, three husbands, murder.", "It was printed twenty-two years after Annie died.", "It has no Haiti, no voodoo, no Takoo and no White Witch."], view: { p: [4.4, 1.4, -1.32], look: [4.4, 0.78, -0.58], fov: 40 }, sound: "tissue", say: ["A thin pamphlet. Here the tale begins."], page: "how" },
  novel: { place: "archive", at: [5.6, 0.5], label: "Open the novel", title: "A novel of 1929", lines: ["“The White Witch of Rosehall”, by Herbert de Lisser.", "The Haiti childhood, the voodoo nurse, Takoo and Millicent begin here.", "It is a made-up story. The tour tells it as history."], view: { p: [5.6, 1.4, -1.32], look: [5.6, 0.78, -0.58], fov: 40 }, sound: "tissue", say: ["A novel. Its cover says White Witch."], page: "how" },
  names: { place: "estate", at: [-5.1, -3.6], label: "Read the names", title: "Two hundred and eight people", lines: ["Celia, Dorinda, Cecelia, Mary James, George Stennet.", "Aaron, Adonis, Hercules, Doshy, Archey. And 198 more.", "The estate book names 208 people held here from 1817 to 1832."], view: { p: [-4.4, 1.8, -1.2], look: [-5.6, 1.9, -5.6], fov: 50 }, sound: "point", say: ["Miss Bryan points to the names."], page: "journal" },
  clothes: { place: "estate", at: [-8.0, -3.3], label: "Read the card", title: "The clothing lists", lines: ["The estate book lists the clothes given out.", "Osnaburg and peniston: rough, cheap cloth.", "No shoes are listed."], focus: [-8.2, 1.2, -4.5], dist: 1.4, sound: "point", say: ["Miss Bryan points to the card."], page: "journal" },
  celia: { place: "estate", at: [-12.85, -5.22], label: "Read the stone", title: "Celia", lines: ["Celia, also written as Catherine Lewis. Born about 1772.", "Her work in the book: " + Q("Grasscutter") + ". The book says " + Q("weakly") + ".", "She was a great-grandmother."], focus: [-13.5, 0.25, -6.4], dist: 2.0, lift: 0.95, sound: "flower", say: ["You lay a flower by her name."], page: "lives" },
  dorinda: { place: "estate", at: [-15.36, 1.93], label: "Read the stone", title: "Dorinda", lines: ["Dorinda, also Rosy Mowatt: " + Q("Hospital Attendant and Midwife") + ".", "Nine children. Four died before they were five.", "21 April 1830: " + Q("Dorrinda the midwife being orderd to the field for general neglect in the performance of her duty thot proper to abscond.") + " She ran."], focus: [-16.5, 0.25, 1.2], dist: 2.0, lift: 0.95, sound: "flower", say: ["You lay a flower by her name."], page: "lives" },
  cecelia: { place: "estate", at: [-11.51, 6.61], label: "Read the stone", title: "Cecelia and Mary James", lines: ["Cecelia, born in Africa about 1769: " + Q("Attending Young Children") + ".", "Mary James: " + Q("G.H. Attendant") + ". That means she worked in the great house.", "The book gives each of them only a few words."], focus: [-12.6, 0.25, 7.4], dist: 2.0, lift: 0.95, sound: "flower", say: ["You lay a flower by their names."], page: "lives" },
  heads: { place: "estate", at: [8.39, 7.3], label: "Read the stone", title: "Three work titles", lines: ["George Stennet: " + Q("Head Driver") + ".", "Aaron, born in Africa: " + Q("Head Penkeeper") + ", over the animal pens.", "Adonis: " + Q("Head Cooper") + ", over the making of barrels."], focus: [9.4, 0.25, 8.2], dist: 2.0, lift: 0.95, sound: "flower", say: ["You lay a flower by their names."], page: "lives" },
  runaways: { place: "estate", at: [14.5, 3.36], label: "Read the stone", title: "Hercules and Doshy", lines: ["Hercules ran away at least 26 times.", "Doshy ran away 16 times.", "The book records each time they tried to get free."], focus: [15.8, 0.25, 3.0], dist: 2.0, lift: 0.95, sound: "flower", say: ["You lay a flower by their names."], page: "lives" },
  archey: { place: "estate", at: [8.95, 0.28], label: "Read the stone", title: "Archey", lines: ["In 1823 Archey was " + Q("sent to Falmouth Workhouse for punishment") + ".", "In 1826 he was " + Q("transported") + ": sent away from the island.", "He was 20 years old."], focus: [9.6, 0.25, -0.9], dist: 2.0, lift: 0.95, sound: "flower", say: ["You lay a flower by his name."], page: "lives" },
  tomb: { place: "estate", at: [-15.8, 10.1], label: "Read the card", title: "“The tomb of Annie Palmer”", lines: ["The tour calls this Annie Palmer's tomb.", "She was buried in Montego Bay churchyard on 9 July 1846.", "No tombstone of hers has survived. Nobody knows when this tomb was built."], focus: [-18.2, 0.8, 8.8], dist: 3.0, lift: 0.7, fov: 46, sound: "point", say: ["Miss Bryan points to the tomb."], page: "why" },
  built: { place: "estate", at: [3.5, -7.2], label: "Read the card", title: "Who built Rose Hall?", lines: ["The sources disagree.", "Hakewill, 1825: John Palmer built it " + Q("about fifty years since") + ", for 30,000 pounds.", "Others say George Ash, in the 1750s. Both cannot be right."], focus: [3.2, 1.2, -8.6], dist: 1.4, sound: "point", say: ["Miss Bryan points from the card to the house."], page: "house" },
  freedom: { place: "estate", at: [5.8, -7.1], label: "Read the card", title: "Rebellion and freedom", lines: ["The great rebellion began on 27 December 1831, in St James.", "Its leader, Samuel Sharpe, was hanged on 23 May 1832.", "Full freedom came on 1 August 1838.", "The Rose Hall book says nothing of the rebellion here."], focus: [5.9, 1.2, -8.4], dist: 1.4, sound: "point", say: ["Miss Bryan points to the card."], page: "slavery" },
};
export const ITEMS = [];
export const TASK_IDS = [];
