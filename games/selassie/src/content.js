/* Every family member is fictional. Real public figures have no invented dialogue. */
export const TITLE = "The Emporer’s Arrival";
export const CHAPTERS = [
  {
    id: "picture",
    name: "The picture in the tin",
    year: "1930 and 1966",
    first: 10,
    last: 16,
    place: "yard",
    caption: "Kingston, Jamaica",
    intro: "An old picture opens a family memory.",
  },
  {
    id: "reasons",
    name: "Everyone has a reason",
    year: "April 1966",
    first: 20,
    last: 26,
    place: "yard",
    caption: "Kingston, before the visit",
    intro: "Help at home. Hear why the visit matters.",
  },
  {
    id: "road",
    name: "The road to Palisadoes",
    year: "21 April 1966",
    first: 30,
    last: 35,
    place: "road",
    caption: "The road toward Palisadoes",
    intro: "Travel with your family toward the airport.",
  },
  {
    id: "waiting",
    name: "Before the plane",
    year: "21 April 1966",
    first: 40,
    last: 46,
    place: "airport",
    caption: "Palisadoes Airport, Kingston",
    intro: "Find your place among the people waiting.",
  },
  {
    id: "arrival",
    name: "The arrival",
    year: "21 April 1966",
    first: 50,
    last: 57,
    place: "airport",
    caption: "The day the Emperor came",
    intro: "See the arrival through your family’s eyes.",
  },
  {
    id: "home",
    name: "What we carry home",
    year: "That evening",
    first: 60,
    last: 64,
    place: "yard",
    caption: "Back in the family yard",
    intro: "Share what you saw, and what you will remember.",
  },
];
export const chapterOf = (stage) =>
  Math.max(
    0,
    CHAPTERS.findIndex((c) => stage >= c.first && stage <= c.last),
  );
export const PEOPLE = {
  adina: "Grandma Adina",
  mum: "Mum",
  levi: "Uncle Levi",
  vendor: "Mr. Brown",
  boy: "Teddy",
  visitor: "Miss Pearl",
};
const L = (who, text) => ({ who, text });
export const TALK = {
  10: {
    adina: [
      L("Grandma Adina", "There is something I want to show you."),
      L("Ruth", "What is in the tin?"),
      L("Grandma Adina", "A picture I have kept for many years."),
      L("Grandma Adina", "Bring it here. We can look together."),
    ],
  },
  15: {
    vendor: [
      L("Mr. Brown", "An emperor has been crowned in Ethiopia."),
      L("Young Adina", "Where is Ethiopia?"),
      L("Mr. Brown", "In Africa. The map shows you where."),
      L("Young Adina", "He looks like people I know."),
      L("Mr. Brown", "Keep asking questions, child. There is much to learn."),
    ],
  },
  20: {
    mum: [
      L("Mum", "This visit means different things to different people."),
      L("Ruth", "Are we all going?"),
      L("Mum", "Yes. We will travel together."),
    ],
    levi: [
      L("Uncle Levi", "I have waited a long time for this day."),
      L("Ruth", "Why does he matter to you?"),
      L("Uncle Levi", "To me, he is holy."),
      L("Uncle Levi", "Africa is part of who I am."),
    ],
  },
  24: {
    adina: [
      L("Ruth", "Did you always keep that picture?"),
      L("Grandma Adina", "Through moves, hard years, and good years."),
      L(
        "Grandma Adina",
        "It helped me imagine a different place in the world.",
      ),
      L("Ruth", "Now you will see him here."),
      L("Grandma Adina", "Yes. Now he is coming here."),
    ],
  },
  35: {
    mum: [
      L("Mum", "Remember this meeting place, by the striped post."),
      L("Ruth", "We can find each other here."),
      L("Mum", "Stay beside us. We have plenty of time."),
    ],
  },
  40: {
    mum: [
      L("Mum", "We can wait here, away from the aircraft."),
      L("Ruth", "Look how many people have come."),
      L("Mum", "Each person has a story of their own."),
    ],
    adina: [
      L("Grandma Adina", "Some people have travelled a long way."),
      L("Ruth", "Were you tired on the road?"),
      L("Grandma Adina", "A little. I am glad we came together."),
    ],
  },
  44: {
    levi: [
      L("Uncle Levi", "People have not always treated Rastafari fairly."),
      L("Ruth", "Did that happen to you?"),
      L("Uncle Levi", "Yes. I still know who I am."),
      L("Uncle Levi", "Today I stand here with hope."),
    ],
  },
  55: {
    adina: [
      L("Ruth", "Can you see him?"),
      L("Grandma Adina", "Yes."),
      L("Ruth", "You are still holding the picture."),
      L("Grandma Adina", "I have carried it a long way."),
    ],
  },
  60: {
    mum: [
      L("Mum", "What a day we have had."),
      L("Ruth", "You do not believe everything Uncle Levi believes."),
      L("Mum", "No. But I can listen."),
      L("Mum", "Today I understood why this mattered to him."),
    ],
  },
  62: {
    adina: [
      L("Grandma Adina", "The picture has another memory beside it now."),
      L("Ruth", "The bus ticket is from our journey."),
      L("Grandma Adina", "And you have your own story to tell."),
    ],
    levi: [
      L("Uncle Levi", "I will remember the welcome."),
      L("Ruth", "Will everything be different now?"),
      L("Uncle Levi", "There is still work to do."),
      L("Uncle Levi", "We can carry this hope into tomorrow."),
    ],
  },
};
export const FLAVOUR = {
  adina: ["This shade is lovely.", "I remember so many journeys."],
  mum: ["The cloth feels soft.", "This is a busy day."],
  levi: ["Wood has its own grain.", "I like the quiet before a busy day."],
  vendor: ["The morning is bright.", "There is plenty to read."],
  boy: ["That cloud looks like a boat.", "I can hear the sea."],
  visitor: ["The breeze feels good.", "I brought some water."],
};
export const CARDS = {
  memory: {
    title: "Kingston, 1930",
    lines: [
      "Before Ruth was born, Adina was a child too.",
      "For this short memory, you see through young Adina’s eyes.",
      "The family and this memory are fictional. The coronation was real.",
    ],
  },
  return: {
    title: "Back in 1966",
    lines: [
      "The street fades into the family yard.",
      "Grandma still holds the picture. Ruth has more questions.",
    ],
  },
  road: {
    title: "On the road",
    lines: [
      "You travel beside your family.",
      "The city gives way to the road toward Palisadoes.",
      "The bus and this family journey are a general reconstruction.",
    ],
  },
  waiting: {
    title: "Many reasons to be here",
    lines: [
      "People had begun gathering before the arrival day.",
      "Some came for faith. Others came from pride or curiosity.",
      "You are here with your family.",
    ],
  },
  arrival: {
    title: "The aircraft is coming",
    lines: [
      "The airport scene has loud engines and a large crowd.",
      "You stay beside your family, away from the moving aircraft.",
      "You can watch, or read what happened instead.",
    ],
  },
  arrivalRead: {
    title: "The arrival, 21 April 1966",
    lines: [
      "Haile Selassie I arrived at Palisadoes Airport in Kingston.",
      "A great crowd gathered around the aircraft.",
      "Rastafari elder Mortimo Planno helped the arrival proceed.",
      "For many Rastafari, the welcome held deep spiritual meaning.",
    ],
  },
  end: {
    title: "A new memory in the tin",
    lines: [
      "Grandma puts the picture away. Ruth adds the bus ticket.",
      "The family has a new memory to carry forward.",
      "The visit is remembered each year on Grounation Day.",
      "Ruth, her family, and their conversations are fictional.",
    ],
  },
};
export const JOURNAL = [
  {
    id: "family",
    title: "Our family",
    simple: [
      "You are Ruth, a fictional child from Kingston.",
      "Grandma Adina, Mum, Uncle Levi, Mr. Brown, Teddy and Miss Pearl are fictional too.",
      "Their conversations were written for this game.",
    ],
    deeper: [
      "This family gives one possible view of the visit. It does not speak for every Jamaican or every Rastafari.",
      "The 1930 memory is an imagined family memory, not a recorded eyewitness account.",
    ],
  },
  {
    id: "coronation",
    title: "A king in Ethiopia",
    simple: [
      "Haile Selassie I was crowned emperor of Ethiopia in 1930.",
      "Ethiopia is in eastern Africa.",
      "News of the coronation mattered to many people in Jamaica.",
    ],
    deeper: [
      "The coronation took place on 2 November 1930. Rastafari emerged in Jamaica during the 1930s.",
      "Its early history connects faith, African identity, and resistance to colonial inequality.",
    ],
    source: "origins",
  },
  {
    id: "picture",
    title: "The picture in the tin",
    simple: [
      "Grandma’s tin and its picture belong to our fictional family.",
      "The small picture is a reconstruction made for the game.",
    ],
    deeper: [
      "People did keep and display images of Haile Selassie. Our keepsake is not a reproduction of a specific historical photograph.",
    ],
    source: "nlj",
  },
  {
    id: "faith",
    title: "Different reasons",
    simple: [
      "Many Rastafari regard Haile Selassie I as divine.",
      "Other Jamaicans welcomed an African emperor without sharing that belief.",
      "You can listen without having the same beliefs.",
    ],
    deeper: [
      "Rastafari has diverse communities and no single central authority. Uncle Levi explains his own fictional perspective.",
      "This game does not ask you to prove a belief or take part in worship.",
    ],
    source: "origins",
  },
  {
    id: "fairness",
    title: "Unfair treatment",
    simple: [
      "Rastafari faced discrimination and violence in Jamaica.",
      "The visit did not make all unfair treatment disappear.",
    ],
    deeper: [
      "In 2017 Jamaica’s Government apologised for state-inflicted violence around Coral Gardens in 1963.",
      "This older history helps explain why public recognition could carry such weight. No violence is reenacted in this game.",
    ],
    source: "fairness",
  },
  {
    id: "road",
    title: "The journey",
    simple: [
      "Palisadoes is the long strip of land leading toward the airport.",
      "Our bus journey and its passengers are fictional.",
    ],
    deeper: [
      "People travelled from across Jamaica to welcome the Emperor. The Gleaner records people gathering from 20 April.",
      "Our street, yard and road are general pictures, not exact street plans.",
    ],
    source: "gleaner",
  },
  {
    id: "airport",
    title: "Palisadoes Airport",
    simple: [
      "The airport was called Palisadoes Airport in 1966.",
      "It is now Norman Manley International Airport.",
      "The terminal and crowd in this game are a reconstruction.",
    ],
    deeper: [
      "Archival photographs show people on the ground and on a terminal roof.",
      "The game compresses distance and crowd size so you can move safely and see the event on a phone.",
    ],
    source: "airport",
  },
  {
    id: "planno",
    title: "Mortimo Planno",
    simple: [
      "Mortimo Planno was a real Rastafari elder.",
      "He helped the welcome proceed around the aircraft.",
      "We do not give him invented words.",
    ],
    deeper: [
      "Photographs and accounts document his role at the aircraft steps. His name is also written Mortimer Planno in some sources.",
    ],
    source: "gleaner",
  },
  {
    id: "arrival",
    title: "21 April 1966",
    simple: [
      "Haile Selassie I visited Jamaica on 21 April 1966.",
      "His visit lasted three days.",
      "The welcome at the airport became a lasting public memory.",
    ],
    deeper: [
      "We say many thousands rather than give one exact crowd count. Estimates differ.",
      "The cinematic sequence compresses waiting time and follows the public events. It does not claim to reproduce every movement.",
    ],
    source: "uwi",
  },
  {
    id: "memory",
    title: "What I remember",
    simple: ["Your choice at the airport will appear here."],
    deeper: [
      "Different people remember different parts of the same event. A personal memory and a historical record are different kinds of evidence.",
    ],
  },
  {
    id: "grounation",
    title: "Remembering the day",
    simple: [
      "The anniversary is known as Grounation Day.",
      "Rastafari communities continue to remember the visit.",
    ],
    deeper: [
      "The visit helped strengthen the public visibility of Rastafari and the bond with Ethiopia.",
      "The story of Rastafari continues beyond the Emperor’s visit.",
    ],
    source: "jis",
  },
];
export const SOURCES = {
  nlj: {
    name: "National Library of Jamaica: the arrival",
    url: "https://nljdigital.nlj.gov.jm/items/show/7914",
  },
  airport: {
    name: "National Library of Jamaica: people waiting at Palisadoes",
    url: "https://nljdigital.nlj.gov.jm/items/show/824",
  },
  uwi: {
    name: "UWI Museum: eyewitness recollections",
    url: "https://uwimuseum.wordpress.com/2016/05/04/video-selassie-recollections/",
  },
  gleaner: {
    name: "The Gleaner: looking back at the visit",
    url: "https://past.jamaica-gleaner.com/article/lead-stories/20160421/online-special-when-selassie-came-looking-back-visit-emperor-50-years",
  },
  origins: {
    name: "Oxford University Press: the emergence of Rastafari",
    url: "https://academic.oup.com/book/7074/chapter-abstract/151570898",
  },
  fairness: {
    name: "Jamaica Information Service: Coral Gardens apology",
    url: "https://jis.gov.jm/government-apologises-victims-coral-gardens/",
  },
  jis: {
    name: "Jamaica Information Service: Grounation Day",
    url: "https://jis.gov.jm/minister-grange-celebrates-rastafari-groundation-day/",
  },
};
export const ARRIVAL_CAPTIONS = [
  ["A sound reaches you before the aircraft appears.", 0],
  ["People turn toward the same patch of sky.", 12],
  ["The aircraft reaches Palisadoes.", 25],
  ["A great welcome gathers around it.", 40],
  ["Mortimo Planno helps the arrival proceed.", 55],
  ["The Emperor appears at the aircraft steps.", 70],
  ["Grandma tightens her hand around yours.", 88],
];
