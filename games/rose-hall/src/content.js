/* Every word the player reads. Everyone you meet is fictional. The real people are met only through their papers, which are quoted.
   Sources and the full table of legend against record: docs/games/rose-hall.md. */
export const TITLE = "The White Witch of Rose Hall";
export const GAME = {
  id: "rose-hall",
  eye: 1.5,
  title: { place: "house", pos: [2.9, 1.7, -4.2], look: [-1.2, 1.5, 2.5] },
  fiction: "You are Kayla, aged fifteen. You, your cousin and everyone you talk to are fictional. The papers you read are real.",
  mature: ["This is a ghost story about murder, and then the truth behind it.", "It talks about killing and about slavery. Nothing is shown close up."],
  recap: [
    { icon: "🕯️", label: "The legend", page: "legend" },
    { icon: "📜", label: "The real Annie Palmer", page: "annie" },
    { icon: "📖", label: "The names in the book", page: "journal" },
  ],
};
export const CHAPTERS = [
  { id: "tour", name: "The night tour", year: "Rose Hall, today", first: 10, last: 19, place: "house", caption: "Rose Hall Great House · a night tour, today", intro: "You are Kayla. Your cousin Tia has dragged you on the ghost tour." },
  { id: "legend", name: "The shadow show", year: "Rose Hall, tonight", first: 20, last: 29, place: "house", caption: "The drawing-room · the legend, in shadows", intro: "Now the guide tells the legend the old way: with shadows." },
  { id: "church", name: "The white monument", year: "Montego Bay, today", first: 30, last: 39, place: "church", caption: "St James Parish Church · Montego Bay", intro: "The old pamphlet points to a white monument in this church." },
  { id: "papers", name: "The papers", year: "Spanish Town, today", first: 40, last: 49, place: "archive", caption: "The Jamaica Archives · Spanish Town", intro: "If Annie Palmer was real, she left papers. So did the story." },
  { id: "names", name: "The names", year: "Rose Hall, today", first: 50, last: 59, place: "estate", caption: "The old estate · by day", intro: "Back at Rose Hall, in daylight. The book had names in it." },
  { id: "record", name: "Legend or record", year: "Rose Hall, today", first: 60, last: 69, place: "estate", caption: "The old estate · the last stop", intro: "One last stop on the tour. Then you decide." },
];
export const chapterOf = (stage) => Math.max(0, CHAPTERS.findIndex((c) => stage >= c.first && stage <= c.last));
export const PEOPLE = { guide: "Miss Bryan", archivist: "Mrs Lindo", warden: "Sister Reid", cousin: "Tia" };
const L = (who, text) => ({ who, text });
export const TALK = {
  /* 1. The night tour */
  10: { guide: [L("Miss Bryan", "Welcome to Rose Hall. Mind the candle."), L("Miss Bryan", "Tonight you hear the story they tell here."), L("Miss Bryan", "They say Annie Palmer ruled this house."), L("You", "They say. Who says?"), L("Miss Bryan", "Good question. Most visitors never ask it."), L("Miss Bryan", "Look at the great stair first. Then follow me.")] },
  13: { guide: [L("Miss Bryan", "This is the eating-room, left of the hall."), L("Miss Bryan", "The tour says a husband died at this table."), L("You", "Is that written down anywhere?"), L("Miss Bryan", "Look at the cup, and read the card.")] },
  15: { guide: [L("Miss Bryan", "The drawing-room, on the right of the hall."), L("Miss Bryan", "The tour calls these paintings her husbands."), L("Miss Bryan", "Hold the candle up. Look closely.")] },
  17: { cousin: [L("Tia", "Three husbands! Poison, and then worse..."), L("You", "Tia. How do they know?"), L("Tia", "Everybody knows. It is on the tour."), L("You", "That is not the same as knowing."), L("Tia", "Fine. Watch the shadow show first. Then spoil it.")] },
  /* 2. The shadow show */
  20: { guide: [L("Miss Bryan", "Now the old way to tell it. With shadows."), L("Miss Bryan", "Every shape you see is only a shadow."), L("Miss Bryan", "Help me put out the candles first."), L("You", "All of them?"), L("Miss Bryan", "All but one. Shadows need one small flame.")] },
  22: { cousin: [L("Tia", "I am holding your arm. Do not laugh."), L("You", "They are only shapes on a wall."), L("Tia", "Shapes can still be scary."), L("You", "Scary, yes. True? We will see.")] },
  25: { guide: [L("Miss Bryan", "That is the legend, as the tour tells it."), L("You", "Did any of it really happen?"), L("Miss Bryan", "Every guide adds a bit. Some add poison."), L("Miss Bryan", "Some add a face in the mirror."), L("Miss Bryan", "None of that is in the old papers.")] },
  27: { cousin: [L("Tia", "I saw her shadow. I did."), L("You", "You saw a candle and a cut-out, Tia."), L("Tia", "Then where does the real story start?"), L("You", "The old pamphlet names a monument in Montego Bay."), L("Tia", "A church in daylight. Good. I am coming.")] },
  /* 3. The white monument */
  30: { warden: [L("Sister Reid", "You came for the Palmer monument."), L("You", "The pamphlet says it marks the wicked Mrs Palmer."), L("Sister Reid", "It marks Rosa Palmer. She died in 1790."), L("Sister Reid", "Annie Palmer was not even born then."), L("You", "So the story has the wrong woman."), L("Sister Reid", "Read the stone and judge for yourself.")] },
  33: { cousin: [L("Tia", "Four husbands, and her stone praises her!"), L("You", "And Annie was born twelve years after she died."), L("Tia", "So the story mixed up two Mrs Palmers?"), L("You", "It seems so. Maybe the paintings helped."), L("Tia", "Then we need Annie's own papers.")] },
  34: { warden: [L("Sister Reid", "Did the stone answer you?"), L("You", "It belongs to a different woman."), L("Sister Reid", "Annie was buried in Montego Bay, in July 1846."), L("Sister Reid", "No tombstone of hers has survived."), L("Sister Reid", "Her papers are in the archives in Spanish Town.")] },
  /* 4. The papers */
  40: { archivist: [L("Mrs Lindo", "Annie Palmer? Yes. She was a real person."), L("Mrs Lindo", "Born 1802. Married John Rose Palmer in 1820."), L("You", "And the other two husbands?"), L("Mrs Lindo", "There were none. One husband."), L("Mrs Lindo", "Four papers are on the long table. Read them in order.")] },
  43: { cousin: [L("Tia", "One husband. He died in 1827. Then she sold up."), L("You", "And she lived until 1846."), L("Tia", "So who wrote down the murders?"), L("You", "Two books on the other table. Let us see.")] },
  45: { archivist: [L("You", "So a real woman was called a murderer. By a story."), L("Mrs Lindo", "Yes. A man checked it all in the 1960s."), L("Mrs Lindo", "He wrote: no murder, no motive and no evidence."), L("You", "Then why is the story still told?"), L("Mrs Lindo", "Ask who the story leaves out."), L("Mrs Lindo", "I brought one more book up from the stacks.")] },
  47: { archivist: [L("Mrs Lindo", "That book is why Rose Hall matters."), L("Mrs Lindo", "Not a witch. The people written in it."), L("Mrs Lindo", "The historian Celia Naylor read it all."), L("Mrs Lindo", "Go back to Rose Hall by day. Read their names.")] },
  /* 5. The names */
  50: { guide: [L("Miss Bryan", "You came back. In daylight, too."), L("You", "I read the papers. She did not do it."), L("Miss Bryan", "No. But real cruelty did happen on this land."), L("Miss Bryan", "The estate book names everyone held here."), L("Miss Bryan", "Some names are on that board, and on the stones.")] },
  55: { guide: [L("Miss Bryan", "Now you have met some of them."), L("You", "The book gives each one only a few words."), L("Miss Bryan", "Yes. Written by the men who held them."), L("Miss Bryan", "So read it carefully. It is one side only."), L("You", "Running away twenty-six times says a lot, though."), L("Miss Bryan", "It does. Hercules never stopped trying.")] },
  56: { cousin: [L("Tia", "So there is no witch."), L("You", "There was slavery. That was the horror."), L("Tia", "The night tour never said their names."), L("You", "Dorinda. Celia. Hercules. Archey."), L("Tia", "Say them again. I want to remember.")] },
  /* 6. Legend or record */
  60: { guide: [L("Miss Bryan", "One last stop. The tour always ends here."), L("Miss Bryan", "They call this Annie Palmer's tomb."), L("You", "But she was buried in Montego Bay."), L("Miss Bryan", "Read the card, then decide for yourself.")] },
  63: { guide: [L("Miss Bryan", "So. Legend or record?"), L("You", "Mostly legend. But the house and the people are real."), L("Miss Bryan", "You can still enjoy a ghost story."), L("Miss Bryan", "Just know which part is which.")] },
  64: { cousin: [L("Tia", "My turn. I will test you."), L("Tia", "Legend or record? Answer fast."), L("You", "Ready. Go.")] },
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
  hakewill: { name: "James Hakewill, A Picturesque Tour of the Island of Jamaica (1825)", url: "https://archive.org/details/picturesquetouro00hake" },
  castello: { name: "The 1868 pamphlet, Legend of Rose Hall Estate", url: "https://jamaicagreathouses.com/rosehall/legend.html" },
  naylor: { name: "Celia Naylor, Unsilencing Slavery: the people of Rose Hall", url: "https://unsilencing-slavery.org/" },
  lbs: { name: "Legacies of British Slavery: Rose Hall estate", url: "https://lbs.ucl.ac.uk/lbs/estate/view/3308" },
};
export const JOURNAL = [
  { id: "you", title: "Kayla and Tia", simple: ["You are Kayla, fifteen. Tia is your cousin.", "You go on the night tour of Rose Hall, near Montego Bay."], deeper: ["Kayla in this game is fictional. Tia in this game is fictional. Miss Bryan in this game is fictional. Sister Reid in this game is fictional. Mrs Lindo in this game is fictional. The visitors you see are fictional too.", "The house, the church monument and the papers are real."] },
  { id: "house", title: "Rose Hall Great House", simple: ["A big stone house on a hill near the sea, in St James.", "It was empty by 1830 and in ruins by 1915.", "It was restored, and finished in 1971."], deeper: ["James Hakewill, about 1820: “A double flight of stone steps leads to an open portico”. The eating-room was on the left, the drawing-room on the right.", "He wrote of a mahogany staircase and “a very extensive sea view”.", "Who built it? Hakewill (1825) says John Palmer, “about fifty years since”, for 30,000 pounds. Others say George Ash, in the 1750s. The sources disagree.", "In August 1830 Hope Waddell preached in the house, “unoccupied, save by rats, bats, and owls”.", "“Annie's bedroom” and the “dungeon” shown on tours have no source from her time."], source: "hakewill" },
  { id: "legend", title: "The legend", simple: ["The story: Annie Palmer killed three husbands at Rose Hall.", "It says she was cruel to the people she enslaved, and was killed in 1831.", "It says her ghost still walks. People call her the White Witch."], deeper: ["This page is the legend, not the record.", "A visitor in 1830, Hope Waddell, saw “three or four full-size pictures of the husbands of the last proprietress” in the empty house.", "The paintings you see in the game are a general picture, not copies."], source: "waddell" },
  { id: "telling", title: "How a ghost story is told", simple: ["Each teller adds a little to a ghost story.", "Poison, boiling oil and a face in the mirror come from modern tours.", "Nobody wrote them down in Annie's own time."], deeper: ["Arsenic, boiling oil, the tomb's crosses and the face in the mirror are told only on modern tours. There is no record of them.", "The shadow show in this game is our way of showing a legend as a legend. Every scene is marked LEGEND."], source: "yates" },
  { id: "rosa", title: "Rosa Palmer", simple: ["Rosa Palmer was the first lady of Rose Hall.", "She died on 1 May 1790. She had four husbands.", "Her white monument is in St James Parish Church."], deeper: ["The stone begins: “Near this place are deposited the Remains of Mrs Rosa Palmer, who died on the first day of May 1790. Her manners were open, cheerful and agreeable”.", "Her husbands were Henry Fanning, George Ash, Norwood Witter and John Palmer. The monument is by John Bacon, 1794.", "The 1868 pamphlet points to this monument, as if it were the wicked wife's. The legend seems to have mixed two women."], source: "castello" },
  { id: "annie", title: "The real Annie Palmer", simple: ["Annie Mary Paterson was born in 1802, in Hanover.", "She married John Rose Palmer in 1820. He died in 1827.", "She never married again. She died in 1846."], deeper: ["She was the only child of John Paterson of The Baulk, near Lucea, and Juliana Brown.", "They married at Mount Pleasant, St James, on 28 March 1820. They had no children.", "She sold “whatever rights she may have had” in Rose Hall and Palmyra in 1830, for 200 pounds.", "She died at Bonavista, near Anchovy, and was buried in Montego Bay churchyard on 9 July 1846. No tombstone has survived.", "She did hold people in slavery: four in 1829 and eight in 1833. That is in the record."], source: "yates" },
  { id: "john", title: "John Rose Palmer", simple: ["Annie's husband. Her only husband.", "He died at Rose Hall in November 1827, aged 42.", "He left big debts. The cause of death is not known."], deeper: ["He was baptised in Carew, Pembrokeshire, in 1785, and inherited the mortgaged estates in 1818.", "His debts came to about 6,000 pounds.", "His obituary: “His intrinsic worth, kind heart, and generous disposition obtained him the esteem of all his acquaintance.”"], source: "yates" },
  { id: "how", title: "How the story grew", simple: ["1868: a pamphlet prints the tale of three murdered husbands.", "1929: a novel adds Haiti, magic, Takoo and Millicent.", "The tour tells the novel as if it were history."], deeper: ["The first printed story, by Hope Waddell in 1863, is about Palmyra, the next estate, and names nobody.", "Geoffrey Yates checked the records in the 1960s: “there was no murder, no motive and no evidence”.", "He also wrote: “The legend throve, the facts disappeared.”", "Obeah enters the legend in 1895, and voodoo in 1929. Vodou belongs to Haiti, not Jamaica. The novel put it into this story."], source: "yates" },
  { id: "journal", title: "The names in the book", simple: ["The estate kept a book from 1817 to 1832.", "It names 208 people held in slavery at Rose Hall.", "Celia cut grass. Dorinda was the midwife. Hercules ran away at least 26 times."], deeper: ["Over 90 of the 208 died in those fourteen years.", "The clothing lists give osnaburg and peniston, rough cloth, and no shoes.", "The book is in the Jamaica Archives (1B/26). The historian Celia Naylor brought these names back to light.", "There is no Takoo and no Millicent in it."], source: "naylor" },
  { id: "lives", title: "What the book says of them", simple: ["Celia, Dorinda, Cecelia, Mary James, George Stennet.", "Aaron, Adonis, Hercules, Doshy, Archey.", "The book gives each only a few words, written by the men who held them."], deeper: ["Celia (Catherine Lewis), born about 1772: “Grasscutter”, “weakly”, a great-grandmother.", "Dorinda (Rosy Mowatt): “Hospital Attendant and Midwife”. Nine children, four dead before age five. On 21 April 1830 the book says she “thot proper to abscond”: she ran.", "Cecelia, born in Africa about 1769: “Attending Young Children”. Mary James: “G.H. Attendant”, which means Great House Attendant: she worked in the house.", "George Stennet: “Head Driver”. Aaron, born in Africa: “Head Penkeeper”. Adonis: “Head Cooper”.", "Hercules ran away at least 26 times, Doshy 16. Archey was “sent to Falmouth Workhouse for punishment” in 1823 and “transported” in 1826, aged 20."], source: "naylor" },
  { id: "slavery", title: "The real horror", simple: ["Enslaved means forced to work, unpaid, not free to leave.", "That happened here, to real people, for many years.", "No ghost is needed to make it terrible."], deeper: ["The great Christmas rebellion began at Kensington, St James, on 27 December 1831. Samuel Sharpe was hanged on 23 May 1832.", "Full freedom came on 1 August 1838.", "The estate book says nothing of what happened at Rose Hall in the rebellion."], source: "lbs" },
  { id: "why", title: "Legend and record", simple: ["A legend is a story people enjoy telling.", "A record is what the papers of the time say.", "Ask of any story: who says so, and who is left out?"], deeper: ["Scholars say the legend puts all the blame on one woman, and forgets 208 named people.", "Celia Naylor on the legend's events: “All of them are fabricated”.", "The “tomb” shown to visitors has no source from her time. Nobody knows when it was built."], source: "naylor" },
];
export const CARDS = {
  legend: { title: "The legend", lines: ["The guide tells the ghost story with a candle and cut-out shapes. You see only shadows on the wall.", "It is a legend. The next chapters check it against the papers."] },
  told: { title: "The story is told", lines: ["That is the legend: three husbands, a cruel mistress, a ghost.", "Now check it. The pamphlet of 1868 points to a church in Montego Bay."], button: "To the church" },
  mixed: { title: "Two women, one story", lines: ["Rosa Palmer: four husbands, died 1790, praised on her stone.", "Annie Palmer: born 1802. What do her own papers say?"], button: "To the archives" },
  book: { title: "The book with the names", lines: ["The papers say Annie Palmer was no murderer.", "But the estate's own book names 208 people held in slavery.", "Go back to Rose Hall by day, and meet them on the page."], button: "To Rose Hall" },
  names: { title: "Two hundred and eight", lines: ["You have read ten names. There are 198 more.", "One last stop on the tour. Then you decide: legend or record?"], button: "The last stop" },
  end: { title: "Legend and record", lines: ["The White Witch is a story. It began in print in 1868 and grew in a novel.", "Annie Palmer was real. She had one husband and died in 1846.", "The people held here were real too. 208 of them have names.", "You can still enjoy a ghost story. Just know which is which."] },
};
export const FILMS = {
  legend: {
    place: "house", next: 25, journal: "legend", title: "The legend",
    read: ["The legend says Annie Palmer killed three husbands at Rose Hall, was cruel to the people she enslaved, and was killed in her bed in 1831.", "None of that is in the records. The next chapters show what is."],
    captions: [[0, "LEGEND. They say a young bride came to this house."], [8, "LEGEND. They say the first husband drank his coffee, and died."], [16, "LEGEND. They say the second husband never woke."], [24, "LEGEND. They say the third was the last."], [32.5, "LEGEND. They say she walks these rooms at night."], [41, "LEGEND. Who says? Nobody wrote it down at the time."]],
    shots: [{ t: 0, p: [-9.5, 1.6, -2.6], look: [-9.5, 1.9, 4.8] }, { t: 12, p: [-8.4, 1.55, -1.2], look: [-9.4, 1.8, 4.8] }, { t: 24, p: [-10.4, 1.5, -0.4], look: [-9.2, 1.9, 4.8] }, { t: 36, p: [-9.6, 1.6, -1.6], look: [-9.4, 2.4, 4.8] }, { t: 48, p: [-9.5, 1.7, -3.0], look: [-9.5, 1.9, 4.8] }],
    fov: [[0, 50], [24, 42], [36, 48], [48, 52]],
    acts: [],
    sounds: [[1, "begin"], [8, "bell"], [16, "bell"], [24, "bell"], [33, "sad"]],
    duration: 48,
  },
};
export const QUIZ = {
  title: "Legend or record?",
  items: [
    { q: "Annie Palmer had three husbands.", opts: [{ t: "Legend", ok: true }, { t: "Record" }], why: "The records show one husband, John Rose Palmer." },
    { q: "Annie Palmer was buried in Montego Bay in July 1846.", opts: [{ t: "Legend" }, { t: "Record", ok: true }], why: "The burial is in the church records." },
    { q: "A man named Takoo killed her in 1831.", opts: [{ t: "Legend", ok: true }, { t: "Record" }], why: "Takoo comes from a novel of 1929." },
    { q: "The white monument in the church is to Rosa Palmer.", opts: [{ t: "Legend" }, { t: "Record", ok: true }], why: "Its words name Mrs Rosa Palmer, who died in 1790." },
    { q: "Annie Palmer's tomb stands at Rose Hall.", opts: [{ t: "Legend", ok: true }, { t: "Record" }], why: "She was buried in Montego Bay. No tombstone of hers survives." },
    { q: "The estate book names 208 people held in slavery at Rose Hall.", opts: [{ t: "Legend" }, { t: "Record", ok: true }], why: "The book survives in the Jamaica Archives." },
    { q: "Dorinda the midwife ran away in 1830.", opts: [{ t: "Legend" }, { t: "Record", ok: true }], why: "The estate book says she “thot proper to abscond”." },
    { q: "Papers from Annie's time show which room was her bedroom.", opts: [{ t: "Legend", ok: true }, { t: "Record" }], why: "“Annie's bedroom” has no source from her time." },
  ],
};
