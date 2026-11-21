/* The family and every speaker are fictional; historical facts have source pages. */
export const TITLE = "Windrush: Two Places Called Home";
export const CHAPTERS = [
  {
    id: "yard",
    name: "Before the suitcase",
    year: "Kingston, April 1948",
    first: 10,
    last: 15,
    place: "yard48",
    caption: "Kingston, Jamaica · 1948",
    player: "Iris",
    age: 9,
    intro: "You are Iris, aged nine. Help your family in the yard.",
  },
  {
    id: "leaving",
    name: "What we carry",
    year: "Jamaica, May 1948",
    first: 20,
    last: 25,
    place: "yard48",
    caption: "A family prepares to leave",
    player: "Iris",
    age: 9,
    intro: "The family has chosen to travel. There is much to pack.",
  },
  {
    id: "voyage",
    name: "Across the Atlantic",
    year: "May to June 1948",
    first: 30,
    last: 35,
    place: "deck48",
    caption: "Aboard Empire Windrush",
    player: "Iris",
    age: 9,
    intro: "There is a whole sea between your two shores.",
  },
  {
    id: "tilbury",
    name: "The other shore",
    year: "22 June 1948",
    first: 40,
    last: 43,
    place: "tilbury48",
    caption: "Tilbury, Essex · 22 June 1948",
    player: "Iris",
    age: 9,
    intro: "You have come ashore. Stay beside your family.",
  },
  {
    id: "room",
    name: "A room and a start",
    year: "London, 1948",
    first: 50,
    last: 56,
    place: "brixton48",
    caption: "Brixton, London · 1948",
    player: "Iris",
    age: 9,
    intro: "Finding a room is harder than the family hoped.",
  },
  {
    id: "homes",
    name: "Two places called home",
    year: "London and Jamaica, 1962",
    first: 60,
    last: 68,
    place: "brixton62",
    caption: "London and Kingston · 1962",
    player: "Iris",
    age: 23,
    intro: "Fourteen years have passed. You are Iris, now twenty-three.",
  },
  {
    id: "letter",
    name: "The letter on the mat",
    year: "London, 2018",
    first: 70,
    last: 76,
    place: "home18",
    caption: "Iris’s home, London · 2018",
    player: "Maya",
    age: 12,
    intro: "You are Maya, Iris’s granddaughter. Iris is now seventy-nine.",
  },
  {
    id: "keep",
    name: "A life is more than papers",
    year: "London, 2018",
    first: 80,
    last: 85,
    place: "centre18",
    caption: "A community advice centre · 2018",
    player: "Maya",
    age: 12,
    intro: "Iris will tell her own story. You can stand beside her.",
  },
];
export const chapterOf = (stage) =>
  Math.max(
    0,
    CHAPTERS.findIndex((c) => stage >= c.first && stage <= c.last),
  );
export const PEOPLE = {
  may: "May",
  sam: "Samuel",
  pearl: "Pearl",
  lionel: "Lionel",
  celia: "Celia",
  gray: "Mr Gray",
  porter: "Mr Hart",
  iris: "Iris",
  anita: "Anita",
  asha: "Asha",
};
const L = (who, text) => ({ who, text });
export const TALK = {
  10: {
    may: [
      L("May", "Please bring some water for the washing, Iris."),
      L("You", "I like the smell of clean sheets."),
      L("May", "So do I. This yard holds our whole day."),
    ],
  },
  13: {
    sam: [
      L(
        "Samuel",
        "I mend chairs, doors, and anything that needs another chance.",
      ),
      L("You", "Will you teach me?"),
      L("Samuel", "Yes. Start with a straight board and a patient eye."),
    ],
    pearl: [
      L("Pearl", "The last big hurricane damaged many homes here."),
      L("Pearl", "We kept helping each other after the storm."),
      L("You", "You always help us, Aunt Pearl."),
      L("Pearl", "That is what family is for."),
    ],
  },
  20: {
    may: [
      L("May", "Britain needs workers. Your father hopes for steady work."),
      L("May", "I want chances for you, and work for myself."),
      L("You", "Will Jamaica still be home?"),
      L("May", "Always. We can carry more than one home."),
    ],
    sam: [
      L("Samuel", "This is a choice, not an easy promise."),
      L("Samuel", "We have saved for the journey."),
      L("You", "What will England be like?"),
      L("Samuel", "We will learn together. We will miss people here."),
    ],
  },
  23: {
    pearl: [
      L("Pearl", "Write when you can. Tell me the little things."),
      L("You", "Even what we eat?"),
      L("Pearl", "Especially that. A letter can bring someone close."),
      L("May", "We will keep a place for each other."),
    ],
  },
  30: {
    lionel: [
      L("Lionel", "I served with the RAF during the war."),
      L("You", "Have you been to Britain before?"),
      L("Lionel", "Yes. Now I am going back to find work."),
      L("Lionel", "People on this ship have many different stories."),
    ],
    may: [
      L("May", "Some people feel excited. Some feel lonely."),
      L("You", "I feel both."),
      L("May", "You can feel both. Come and sit beside us."),
    ],
  },
  33: {
    sam: [
      L("Samuel", "A ship can take us somewhere new."),
      L("Samuel", "It cannot tell us how people will treat us."),
      L("You", "We have each other."),
      L("Samuel", "Yes. And we can make new friends."),
    ],
  },
  41: {
    porter: [
      L("Mr Hart", "The train is this way. Keep your bags beside you."),
      L("You", "Is this London?"),
      L("Mr Hart", "This is Tilbury, in Essex. London is farther inland."),
      L("May", "We will find Celia when we reach Brixton."),
    ],
  },
  50: {
    may: [
      L("May", "We need somewhere to live, not just somewhere to sleep."),
      L("You", "There is a room notice by that door."),
      L("May", "Let us ask together."),
    ],
  },
  51: {
    gray: [
      L("Mr Gray", "The room is not available to your family."),
      L("May", "The card in your window says there is a room."),
      L("Mr Gray", "I will not let it to you."),
      L("May", "We will leave now. Stay beside me, Iris."),
    ],
  },
  52: {
    sam: [
      L("You", "Why would he not let us stay?"),
      L("Samuel", "He turned us away because we are Black."),
      L("Samuel", "That is racism. It is unfair, and it hurts."),
      L("Samuel", "There is nothing wrong with you or our family."),
      L("You", "Can we find someone kind?"),
      L("Samuel", "Yes. Celia is waiting for us."),
    ],
  },
  55: {
    celia: [
      L("Celia", "Come in. There is room at our table."),
      L("Celia", "It is small, but you will not be alone."),
      L("May", "Thank you. Tomorrow we will look for work."),
      L("Celia", "I can show you where to ask."),
    ],
  },
  60: {
    may: [
      L("May", "I help on a hospital ward now."),
      L("May", "People from many places care for patients together."),
      L("You", "You have worked so hard, Mum."),
      L("May", "We have made a life here. It is ours too."),
    ],
    sam: [
      L("Samuel", "This garage is where I work now."),
      L("Samuel", "My hands still mend things. Now they mend cars."),
      L("You", "Do you still miss the yard?"),
      L("Samuel", "Yes. I can love this street and miss that yard."),
    ],
  },
  64: {
    pearl: [
      L("Pearl", "Naomi, a letter has come from your cousin Iris."),
      L("You", "Will you read it with me?"),
      L("Pearl", "She says London is home now, and she misses us."),
      L("Pearl", "They have sent some money to help here."),
    ],
  },
  67: {
    pearl: [
      L("Pearl", "Letters and money help us care across the sea."),
      L("You", "I will write about my new school book."),
      L("Pearl", "Tell Iris the little things. They are part of life."),
    ],
  },
  70: {
    iris: [
      L("Iris", "Maya, may I show you something?"),
      L("You", "Of course, Grandma."),
      L("Iris", "A letter came today. It has made me worried."),
      L("Iris", "I want us to read it together."),
    ],
  },
  72: {
    iris: [
      L("Iris", "They want papers to show my right to be here."),
      L("You", "But you came here when you were nine."),
      L("Iris", "I came on my mother’s passport. This is my home."),
      L("Iris", "I worked here. I raised my family here."),
      L("Iris", "They turned me away when I asked for care."),
      L("You", "That is not fair."),
      L("You", "You should not have to face this alone."),
      L("Iris", "No. And I have done nothing wrong."),
    ],
  },
  74: {
    anita: [
      L("Anita", "An adviser can help us challenge what has happened."),
      L("Anita", "Missing papers do not make Grandma at fault."),
      L("You", "Can I come with you?"),
      L("Anita", "Yes, if Grandma would like that."),
    ],
  },
  80: {
    asha: [
      L("Asha", "Iris, how would you like us to help?"),
      L("Iris", "I want someone to listen, and help challenge this."),
      L("Asha", "We will work through it with you."),
      L("Asha", "You do not have to do this alone."),
    ],
    iris: [
      L("Iris", "I will tell my own story, in my own words."),
      L("You", "I will listen, Grandma."),
      L("Iris", "Thank you. That matters too."),
    ],
  },
  82: {
    iris: [
      L("Iris", "These papers show parts of my life."),
      L("Iris", "They are not all of me."),
      L("You", "The letters tell us about people, not just dates."),
      L("Iris", "And we will keep telling our stories."),
    ],
  },
};
export const FLAVOUR = {
  may: [
    "There is always another small thing to do.",
    "I am glad you are here.",
  ],
  sam: [
    "A good repair takes patience.",
    "These hands have learned many things.",
  ],
  pearl: [
    "Someone has put the kettle on.",
    "A familiar voice can brighten a day.",
  ],
  lionel: ["There are many stories on this deck."],
  celia: ["A shared table makes the room feel bigger."],
  gray: ["I have nothing more to say."],
  porter: ["The river is busy today."],
  iris: [
    "There is more to my life than one letter.",
    "I can remember the sea very clearly.",
  ],
  anita: ["We can take this a little at a time."],
  asha: ["We can make time to listen."],
};
export const SOURCES = {
  voyage: {
    name: "The National Archives: postwar Caribbean migration",
    url: "https://www.nationalarchives.gov.uk/explore-the-collection/explore-by-time-period/postwar/postwar-caribbean-migration/",
  },
  ship: {
    name: "Royal Museums Greenwich: history of Empire Windrush",
    url: "https://www.rmg.co.uk/stories/ocean/history-empire-windrush",
  },
  list: {
    name: "Goldsmiths: Windrush passenger list and arrival cards",
    url: "https://www.gold.ac.uk/windrush/passenger-list/",
  },
  community: {
    name: "The National Archives: Commonwealth migration since 1945",
    url: "https://www.nationalarchives.gov.uk/education/resources/commonwealth-migration-since-1945/",
  },
  work: {
    name: "TfL Corporate Archives: Black, Asian and minority ethnic staff",
    url: "https://content.tfl.gov.uk/research-guide-21-black-asian-and-minority-ethnic-staff.pdf",
  },
  scandal: {
    name: "Windrush Lessons Learned Review, Wendy Williams, 2020",
    url: "https://www.gov.uk/government/publications/windrush-lessons-learned-review",
  },
  nao: {
    name: "National Audit Office: handling of the Windrush situation",
    url: "https://www.nao.org.uk/reports/handling-of-the-windrush-situation/",
  },
  rights: {
    name: "GOV.UK: Windrush Scheme and current support",
    url: "https://www.gov.uk/windrush-prove-your-right-to-be-in-the-uk",
  },
  compensation: {
    name: "GOV.UK: Windrush Compensation Scheme",
    url: "https://www.gov.uk/apply-windrush-compensation-scheme",
  },
};
export const JOURNAL = [
  {
    id: "family",
    title: "Our family",
    simple: [
      "Iris is nine in 1948, twenty-three in 1962, and seventy-nine in 2018.",
      "May and Samuel are her parents. Pearl is her aunt.",
      "In 2018, Anita is Iris’s daughter. Maya is her granddaughter.",
    ],
    deeper: [
      "Iris in this game is fictional. May in this game is fictional. Samuel in this game is fictional. Pearl in this game is fictional. Anita in this game is fictional. Maya in this game is fictional. Naomi in this game is fictional.",
      "Their family story is one possible experience, not a passenger biography. Naomi, Pearl’s daughter and Iris’s cousin, is twelve in the Jamaica scene in 1962.",
    ],
  },
  {
    id: "jamaica",
    title: "Before the journey",
    simple: [
      "People had lives, skills, friends and hopes before they travelled.",
      "Leaving could mean opportunity and a painful goodbye.",
    ],
    deeper: [
      "Postwar migration had many causes, including work and family ties. Jamaica faced unemployment and hardship. The 1944 hurricane is part of the family’s remembered setting, not the sole reason all people migrated.",
    ],
    source: "voyage",
  },
  {
    id: "passage",
    title: "The voyage",
    simple: [
      "Empire Windrush carried people with many different stories.",
      "Passengers came ashore at Tilbury on 22 June 1948.",
    ],
    deeper: [
      "The surviving passenger list records 1,027 passengers. Of these, 539 gave Jamaica as their last country of residence. That is a residence field, not a count of nationality or birthplace.",
      "The ship arrived on 21 June; disembarkation on 22 June is commemorated as Windrush Day. It did not mark the first presence of Black people or Caribbean migrants in Britain.",
      "A troop-deck fare is often recorded as £28 and 10 shillings. The family’s fare arrangements and journey are fictional. Lionel in this game is fictional. Mr Hart in this game is fictional.",
    ],
    source: "list",
  },
  {
    id: "rights",
    title: "The right to belong",
    simple: [
      "The family came lawfully as British subjects.",
      "Missing papers did not make their lives or rights disappear.",
    ],
    deeper: [
      "The British Nationality Act 1948 took effect on 1 January 1949, after the June voyage. The game does not treat it as an invitation already in force that June.",
      "The Immigration Act 1971 came into force on 1 January 1973. Many settled residents had indefinite leave to remain but had not been required to hold the documents later demanded. Nationality and immigration status were not identical for everyone.",
    ],
    source: "scandal",
  },
  {
    id: "welcome",
    title: "A hard welcome",
    simple: [
      "Racism made finding work and homes much harder.",
      "Friends and neighbours also offered welcome and support.",
    ],
    deeper: [
      "Housing discrimination was widespread. Some landlords’ cards and notices openly refused Black tenants. Refusing a home because of race was not against the law until the Race Relations Act 1968.",
      "The fictional landlord scene names racism without reproducing slurs or asking the player to win acceptance. Mr Gray in this game is fictional. Celia in this game is fictional.",
      "This family stays with a friend. Some other arrivals were temporarily housed in the Clapham South deep shelter; the game does not put all passengers or all families there.",
    ],
    source: "community",
  },
  {
    id: "work",
    title: "Building a life",
    simple: [
      "Caribbean people helped keep transport and public services running.",
      "The family also built friendships and a life of their own.",
    ],
    deeper: [
      "May’s hospital-ward work and Samuel’s garage work are fictional. They represent kinds of public-service work without impersonating a particular worker.",
      "London Transport began formal recruitment in Barbados in 1956; offices in Jamaica and Trinidad opened in 1966. Our family’s 1948 move is not portrayed as part of that later recruitment scheme.",
    ],
    source: "work",
  },
  {
    id: "twohomes",
    title: "Across two homes",
    simple: [
      "Letters can carry news, care and memories.",
      "Money sent home can help relatives with daily needs.",
    ],
    deeper: [
      "Money sent across borders by relatives is called remittances. The game’s letter and postal order are reconstructed props, not archival copies.",
      "Caribbean communities also used shared savings arrangements, often called pardner or sou-sou, and built churches, clubs, music and neighbourhood networks. No single family stands for every community.",
    ],
    source: "community",
  },
  {
    id: "scandal",
    title: "The Windrush scandal",
    simple: [
      "People who had lived lawfully in Britain were wrongly harmed.",
      "Some lost work, homes, treatment or the right to travel.",
      "Some people were wrongly detained or removed from the country.",
    ],
    deeper: [
      "The scandal became a national issue in 2017 and 2018, after reporting by journalists and the work of families and campaigners. Policies requiring documentary checks for work, housing and services harmed people with lawful status.",
      "Many people had come as children on a parent’s passport and had never needed papers of their own.",
      "In April 2018 the Prime Minister apologised to Caribbean leaders, and the Home Secretary resigned later that month.",
      "The destruction of landing cards in 2010 was one part of a wider history. Those cards alone did not prove a complete lifetime of residence; the failure cannot be reduced to one lost record.",
      "The independent review by Wendy Williams, published in 2020, found the harm was foreseeable and avoidable. It described an institutional ignorance and thoughtlessness about race and the history of Windrush.",
      "The story does not make a child responsible for correcting those failures, and does not use deportation as a losing screen.",
    ],
    source: "scandal",
  },
  {
    id: "support",
    title: "Help and an unfinished story",
    simple: [
      "People can seek help with status and compensation.",
      "Getting help does not make the harm acceptable.",
      "This family’s case is still being worked on at the end.",
    ],
    deeper: [
      "Asha in this game is fictional. The advice scene is a story, not immigration or benefits advice. It does not promise a result or a timescale.",
      "The Windrush Scheme and Windrush Compensation Scheme are separate schemes. Their rules and support can change. Use the official linked pages for current information, checked for this game in November 2026.",
      "The National Audit Office has reported serious problems and delays. Recognition and compensation are not automatic outcomes for everyone.",
    ],
    source: "rights",
  },
  {
    id: "memory",
    title: "What we keep",
    simple: ["Your choice will be written here."],
    deeper: [
      "A personal memory changes this journal, not the historical facts. Belonging is not something to earn by making the right choices.",
    ],
  },
];
export const CARDS = {
  departure: {
    title: "A goodbye at the harbour",
    lines: [
      "A family is leaving people they love.",
      "This short scene shows their goodbye and the ship.",
    ],
  },
  arrival: {
    title: "The other shore",
    lines: [
      "The sea journey is ending. A new part of life is beginning.",
      "Tilbury comes into view.",
    ],
  },
  end: {
    title: "A life is more than papers",
    lines: [
      "Iris has told her story. Her family and adviser stand beside her.",
      "Her case is still being worked on. The game does not promise a result.",
      "This family is fictional. The history and harm are real.",
      "People have kept working for recognition, repair and justice.",
    ],
  },
};
export const FILMS = {
  departure: {
    place: "harbour48",
    next: 30,
    title: "A goodbye across the water",
    read: [
      "Iris’s family boards Empire Windrush. Pearl stays in Jamaica. There are hopes in the suitcase, and people they will miss.",
      "The journey shown here is a reconstruction, not archive footage.",
    ],
    captions: [
      [0, "Kingston, Jamaica. A family says goodbye."],
      [9, "Pearl waves from the quay."],
      [19, "There are people, hopes and stories on this ship."],
      [29, "The Atlantic lies ahead."],
    ],
    shots: [
      { t: 0, p: [-62, 2.2, -1], look: [0, 8, -16] },
      { t: 8, p: [-22, 3, 17], look: [2, 4.5, 2] },
      { t: 15, p: [6.4, 2.7, 3.4], look: [8.4, 1.4, 8.2] },
      { t: 22, p: [16, 2.4, 11], look: [2, 9.5, -14] },
      { t: 30, p: [4, 9, 24], look: [-30, 7, -30] },
      { t: 40, p: [12, 3.2, 7], look: [-80, 8, -60] },
    ],
    fov: [[0, 42], [15, 36], [22, 46], [40, 40]],
    ship: [[0, 0, -16, Math.PI], [17, 0, -16, Math.PI], [25, -10, -22, Math.PI + 0.06], [40, -88, -62, Math.PI + 0.28]],
    acts: [[10, "pearl", "Wave"], [21, "pearl", "WaveSlow"], [31, "pearl", "Wave"]],
    sounds: [[1, "begin"], [5, "gull"], [18, "horn"], [27, "gull"]],
    duration: 40,
  },
  arrival: {
    place: "tilbury48",
    next: 40,
    title: "Tilbury, 22 June 1948",
    read: [
      "After arrival on 21 June, passengers come ashore on 22 June. Tilbury is in Essex. The family will travel on to London.",
      "Their new life will hold work, welcome, friendship and unfairness.",
    ],
    captions: [
      [0, "Tilbury, Essex. 22 June 1948."],
      [10, "Passengers come ashore from Empire Windrush."],
      [20, "A new place, with unfamiliar sounds and streets."],
      [30, "The family’s journey does not end at the dock."],
    ],
    shots: [
      { t: 0, p: [-42, 3, -58], look: [50, 8, -36] },
      { t: 9, p: [-6, 12, 25], look: [22, 6, -18] },
      { t: 18, p: [20, 2.2, 6.5], look: [-4, 7, -16] },
      { t: 26, p: [16.5, 1.8, 12.5], look: [10.8, 4.2, 0] },
      { t: 38, p: [-15, 4.2, 23], look: [3, 2.6, 8] },
    ],
    fov: [[0, 40], [9, 46], [26, 40], [38, 46]],
    ship: [[0, 70, -42, Math.PI - 0.22], [20, 10, -19, Math.PI - 0.02], [27, 0, -16, Math.PI]],
    acts: [],
    sounds: [[1, "begin"], [12, "horn"], [21, "gull"]],
    duration: 38,
  },
};
