/* Every word the player reads. Everyone you meet is fictional. The real people are met only through their papers, which are quoted.
   Sources and the full table of legend against record: docs/games/rose-hall.md. */
export const TITLE = "The White Witch of Rose Hall";
export const GAME = {
  id: "rose-hall",
  eye: 1.5,
  title: { place: "house", pos: [4.6, 1.7, 3.2], look: [-3, 1.6, -3] },
  fiction: "You are Kayla, aged fifteen. You, your cousin and everyone you talk to are fictional. The papers you read are real.",
  mature: ["This is a ghost story about murder, and then the truth behind it.", "It talks about killing and about slavery. Nothing is shown close up."],
  recap: [
    { icon: "🕯️", label: "The legend", page: "legend" },
    { icon: "📜", label: "The real Annie Palmer", page: "annie" },
    { icon: "📖", label: "The names in the book", page: "journal" },
  ],
};
export const CHAPTERS = [
  { id: "tour", name: "The night tour", year: "Rose Hall, today", first: 10, last: 14, place: "house", caption: "Rose Hall Great House · a night tour, today", intro: "You are Kayla. Your cousin Tia has dragged you on the ghost tour." },
  { id: "church", name: "The white monument", year: "Montego Bay, today", first: 20, last: 22, place: "church", caption: "St James Parish Church · Montego Bay", intro: "The old pamphlet points to a white monument in this church." },
  { id: "papers", name: "The papers", year: "Spanish Town, today", first: 30, last: 32, place: "archive", caption: "The archives · Spanish Town", intro: "If Annie Palmer was real, she left papers. So did the story." },
  { id: "names", name: "The names", year: "Rose Hall, today", first: 40, last: 44, place: "estate", caption: "The old estate · by day", intro: "Back at Rose Hall, in daylight. There is one more book to hear about." },
];
export const chapterOf = (stage) => Math.max(0, CHAPTERS.findIndex((c) => stage >= c.first && stage <= c.last));
export const PEOPLE = { guide: "Miss Bryan", archivist: "Mrs Lindo", warden: "Sister Reid", cousin: "Tia" };
const L = (who, text) => ({ who, text });
export const TALK = {
  10: { guide: [L("Miss Bryan", "Welcome to Rose Hall. Mind the candle."), L("Miss Bryan", "They say Annie Palmer ruled this house."), L("Miss Bryan", "They say she killed three husbands here."), L("You", "They say. Who says?"), L("Miss Bryan", "Good question. Most visitors never ask it.")] },
  12: { cousin: [L("Tia", "Three husbands! Poison, a knife, and then..."), L("You", "Tia. How do they know?"), L("Tia", "Everybody knows. It is on the tour."), L("You", "That is not the same as knowing."), L("Tia", "Fine. Watch the story first. Then go and spoil it.")] },
  20: { warden: [L("Sister Reid", "You came for the Palmer monument."), L("You", "The pamphlet says it marks the wicked Mrs Palmer."), L("Sister Reid", "It marks Rosa Palmer. She died in 1790."), L("Sister Reid", "Annie Palmer was not even born then."), L("You", "So the story has the wrong woman."), L("Sister Reid", "Read the stone and judge for yourself.")] },
  30: { archivist: [L("Mrs Lindo", "Annie Palmer? Yes. She was a real person."), L("Mrs Lindo", "Born 1802. Married John Rose Palmer in 1820."), L("You", "And the other two husbands?"), L("Mrs Lindo", "There were none. One husband. He died in debt."), L("Mrs Lindo", "Three papers are out for you. Read them in order.")] },
  32: { archivist: [L("You", "So a real woman was called a murderer. By a story."), L("Mrs Lindo", "Yes. A man checked it all in the 1960s."), L("Mrs Lindo", "He wrote: no murder, no motive and no evidence."), L("You", "Then why is the story still told?"), L("Mrs Lindo", "Ask who the story leaves out. Go back to Rose Hall.")] },
  40: { guide: [L("Miss Bryan", "You came back. In daylight, too."), L("You", "I read the papers. She did not do it."), L("Miss Bryan", "No. But real cruelty did happen on this land."), L("Miss Bryan", "The overseers kept a book. It names everyone held here."), L("Miss Bryan", "I wrote some of the names on that board.")] },
  42: { cousin: [L("Tia", "So there is no witch."), L("You", "There was slavery. That was the horror."), L("Tia", "The tour never said their names."), L("You", "Dorinda. Celia. Hercules. Archey."), L("Tia", "Say them again. I want to remember.")] },
};
export const FLAVOUR = {
  guide: ["Mind your step on the stairs.", "A good story is hard to put down."],
  cousin: ["Did you hear that? Never mind.", "I am not scared. You are scared."],
  warden: ["Take your time. The stone is not going anywhere."],
  archivist: ["Clean hands, please. Turn the pages slowly.", "Papers are patient."],
};
export const SOURCES = {
  yates: { name: "Geoffrey Yates, Rose Hall: Death of a Legend", url: "http://www.jamaicanfamilysearch.com/Samples2/mpalmer.htm" },
  waddell: { name: "Hope Waddell, Twenty-Nine Years in the West Indies (1863)", url: "https://archive.org/details/twentynineyears00waddgoog" },
  castello: { name: "The 1868 pamphlet, Legend of Rose Hall Estate", url: "https://jamaicagreathouses.com/rosehall/legend.html" },
  naylor: { name: "Celia Naylor, Unsilencing Slavery: the people of Rose Hall", url: "https://unsilencing-slavery.org/" },
  lbs: { name: "Legacies of British Slavery: Rose Hall estate", url: "https://lbs.ucl.ac.uk/lbs/estate/view/3308" },
};
export const JOURNAL = [
  { id: "you", title: "Kayla and Tia", simple: ["You are Kayla, fifteen. Tia is your cousin.", "You are on the night tour of Rose Hall, near Montego Bay."], deeper: ["Kayla in this game is fictional. Tia in this game is fictional. Miss Bryan in this game is fictional. Sister Reid in this game is fictional. Mrs Lindo in this game is fictional.", "The house, the church monument and the papers are real."] },
  { id: "legend", title: "The legend", simple: ["The story: Annie Palmer killed three husbands at Rose Hall.", "It says she was cruel to the people she enslaved, and was killed in 1831.", "It says her ghost still walks. People call her the White Witch."], deeper: ["This page is the legend, not the record.", "A visitor in 1830, Hope Waddell, saw “three or four full-size pictures of the husbands of the last proprietress” in the empty house.", "The paintings you see in the game are a general picture, not copies."], source: "waddell" },
  { id: "rosa", title: "Rosa Palmer", simple: ["Rosa Palmer was the first lady of Rose Hall.", "She died on 1 May 1790. She had four husbands.", "Her white monument is in St James Parish Church."], deeper: ["The stone says: “Her manners were open, cheerful and agreeable”.", "Her husbands were Henry Fanning, George Ash, Norwood Witter and John Palmer.", "The 1868 pamphlet points to this monument, as if it were the wicked wife’s. The legend seems to have mixed two women."], source: "castello" },
  { id: "annie", title: "The real Annie Palmer", simple: ["Annie Mary Paterson was born in 1802, in Hanover.", "She married John Rose Palmer in 1820. He died in 1827.", "She never married again. She died in 1846."], deeper: ["She sold her rights in Rose Hall in 1830, a year before the rebellion.", "She was buried in Montego Bay churchyard on 9 July 1846. No tombstone has survived.", "She did hold people in slavery: four in 1829 and eight in 1833. That is in the record."], source: "yates" },
  { id: "how", title: "How the story grew", simple: ["1868: a pamphlet prints the tale of three murdered husbands.", "1929: a novel adds Haiti, magic, Takoo and Millicent.", "The tour tells the novel as if it were history."], deeper: ["Geoffrey Yates checked the records in the 1960s: “there was no murder, no motive and no evidence”.", "He also wrote: “The legend throve, the facts disappeared.”", "The legend calls the magic voodoo. Vodou belongs to Haiti. It was put into this story by the novel."], source: "yates" },
  { id: "journal", title: "The names in the book", simple: ["The overseers kept a book from 1817 to 1832.", "It names 208 people held in slavery at Rose Hall.", "Celia cut grass. Dorinda was the midwife. Hercules ran away at least 26 times."], deeper: ["Over 90 of the 208 died in those fourteen years.", "In 1830 the book says Dorinda, sent to the fields, “thot proper to abscond”: she ran.", "Archey was sent to the workhouse in 1823 and shipped away in 1826, aged twenty.", "The historian Celia Naylor brought these names back to light."], source: "naylor" },
  { id: "slavery", title: "The real horror", simple: ["Enslaved means forced to work, unpaid, not free to leave.", "That happened here, to real people, for many years.", "No ghost is needed to make it terrible."], deeper: ["The great Christmas rebellion began in St James on 27 December 1831. Samuel Sharpe led it.", "Full freedom came on 1 August 1838.", "The estate book says nothing of what happened at Rose Hall in the rebellion."], source: "lbs" },
  { id: "why", title: "Legend and record", simple: ["A legend is a story people enjoy telling.", "A record is what the papers of the time say.", "Ask of any story: who says so, and who is left out?"], deeper: ["Scholars say the legend puts all the blame on one woman, and forgets 208 named people.", "The “tomb” and “Annie’s bedroom” shown to visitors have no source from her time."], source: "naylor" },
];
export const CARDS = {
  legend: { title: "The legend", lines: ["The guide tells the ghost story: three husbands, and how each one died. You see only shadows on the wall.", "It is a legend. The next chapters check it against the papers."] },
  mixed: { title: "Two women, one story", lines: ["Rosa Palmer: four husbands, died 1790, praised on her stone.", "Annie Palmer: born 1802. What do her own papers say?"], button: "To the archives" },
  end: { title: "Legend and record", lines: ["The White Witch is a story. It began in print in 1868 and grew in a novel.", "Annie Palmer was real. She had one husband and died in 1846.", "The people held here were real too. 208 of them have names.", "You can still enjoy a ghost story. Just know which is which."] },
};
export const FILMS = {
  legend: {
    place: "house", next: 20, journal: "legend", title: "The legend",
    read: ["The legend says Annie Palmer killed three husbands at Rose Hall, was cruel to the people she enslaved, and was killed in her bed in 1831.", "None of that is in the records. The next chapters show what is."],
    captions: [[0, "LEGEND. They say she came to this house a young bride."], [7, "LEGEND. They say the first husband drank his coffee, and died."], [14, "LEGEND. They say the second never woke."], [21, "LEGEND. They say the third was the last."], [28, "LEGEND. They say she walks here still. Who says?"]],
    shots: [{ t: 0, p: [4.2, 1.6, 2.6], look: [-5.6, 1.8, -1] }, { t: 10, p: [2, 1.6, 1.8], look: [-5.6, 1.9, -0.5] }, { t: 22, p: [0.5, 1.6, 1.2], look: [-5.6, 2, 0] }, { t: 34, p: [3.6, 1.7, 2.8], look: [-5.6, 1.6, -1] }],
    fov: [[0, 46], [22, 36], [34, 46]],
    acts: [],
    sounds: [[1, "begin"], [7, "bell"], [14, "bell"], [21, "bell"], [28, "sad"]],
    duration: 34,
  },
};
export const QUIZ = {
  title: "Legend or record?",
  items: [
    { q: "Annie Palmer had three husbands.", opts: [{ t: "Legend", ok: true }, { t: "Record" }], why: "The records show one husband, John Rose Palmer." },
    { q: "Annie Palmer was buried in Montego Bay in July 1846.", opts: [{ t: "Legend" }, { t: "Record", ok: true }], why: "The burial is in the church records." },
    { q: "A man named Takoo killed her in 1831.", opts: [{ t: "Legend", ok: true }, { t: "Record" }], why: "Takoo comes from a novel of 1929." },
    { q: "The estate book names 208 people held in slavery at Rose Hall.", opts: [{ t: "Legend" }, { t: "Record", ok: true }], why: "The book survives in the Jamaica Archives." },
  ],
};
