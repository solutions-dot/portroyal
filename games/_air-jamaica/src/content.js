/* Every word the player reads. The airline, its planes, its uniforms and its first day were real. Dee, Aunt Marcia, Mr Hines and Captain Ross
   are fictional, and their journal pages say so. Facts and sources: docs/games/air-jamaica.md. Chapter 1 only so far. */
export const TITLE = "Air Jamaica: Our Own Wings";
export const GAME = {
  id: "air-jamaica",
  eye: 1.15,
  title: { place: "apron", pos: [-3, 1.6, 20], look: [-6, 3.2, -8] },
  fiction: "You are Dee, aged nine. You are fictional. The airline, its planes and its first day were real.",
  recap: [
    { icon: "🐦", label: "The Love Bird", page: "lovebird" },
    { icon: "👗", label: "The first crew", page: "uniforms" },
    { icon: "✈️", label: "The first jets", page: "plane" },
  ],
};
export const CHAPTERS = [
  {
    id: "apron", name: "A flag in the sky", year: "1 April 1969", first: 10, last: 18, place: "apron",
    caption: "Palisadoes Airport, Kingston · 1 April 1969",
    intro: "Your Aunt Marcia starts work today. Jamaica's own airline begins to fly.",
  },
];
export const chapterOf = (stage) => Math.max(0, CHAPTERS.findIndex((c) => stage >= c.first && stage <= c.last));
export const PEOPLE = { marcia: "Aunt Marcia", hines: "Mr Hines", ross: "Captain Ross" };
const L = (who, text) => ({ who, text });
export const TALK = {
  10: {
    marcia: [
      L("Aunt Marcia", "Dee! You came. Do I look all right?"),
      L("You", "Aunt Marcia, your dress is so bright!"),
      L("Aunt Marcia", "Yellow, pink and lime green. All the crew wear them."),
      L("Aunt Marcia", "Fifty-eight of us start work today."),
      L("You", "Is that the new plane?"),
      L("Aunt Marcia", "Yes. It is a Douglas DC-8. A big jet."),
      L("Aunt Marcia", "Air Jamaica is a Jamaican airline for Jamaican people."),
      L("Aunt Marcia", "Go and look at the bird on its tail."),
    ],
  },
  12: {
    hines: [
      L("Mr Hines", "Mind the steps, young lady. They are new."),
      L("You", "Why are they blue and white?"),
      L("Mr Hines", "Blue and white, with the airline's name on them."),
      L("Mr Hines", "Today planes fly from here to Miami and New York."),
      L("You", "What do you do, Mr Hines?"),
      L("Mr Hines", "I work on the ground. I put out the steps."),
      L("Mr Hines", "Now look along the line of crew. What a sight!"),
    ],
  },
  14: {
    ross: [
      L("Captain Ross", "Good morning, young lady. Come to see us off?"),
      L("You", "Are you the pilot, sir?"),
      L("Captain Ross", "I am the captain. I fly this jet."),
      L("Captain Ross", "Some pilots here are Jamaican."),
      L("Captain Ross", "Some come from Air Canada to help at first."),
      L("You", "Where is the plane going?"),
      L("Captain Ross", "Up over the sea, and then north."),
      L("Captain Ross", "Stand back and watch. It is something to see."),
    ],
  },
};
export const FLAVOUR = {
  marcia: ["Wave to me when we go!", "I am so proud today."],
  hines: ["Clear of the steps, please.", "Heavy bags, light hearts."],
  ross: ["Engines are warm.", "A fine morning for flying."],
};
export const SOURCES = {
  airlinegeeks: { name: "AirlineGeeks, TBT in Aviation History: Air Jamaica", url: "https://airlinegeeks.com/2016/06/29/tbt-throwback-thursday-in-aviation-history-air-jamaica/" },
  wilson: { name: "Phil Tiemeyer, Stewardess as Aerial Ambassador (Wilson Center, with the Daily Gleaner of 9 February and 1 April 1969)", url: "https://www.wilsoncenter.org/blog-post/stewardess-aerial-ambassador-what-gender-can-reveal-about-us-jamaican-foreign-relations" },
  gleaner: { name: "Jamaica Gleaner, 1 May 2010: Air Jamaica celebrates for the last time", url: "https://jamaica-gleaner.com/gleaner/20100501/lead/lead1.html" },
  gleaner2: { name: "Jamaica Gleaner, Pieces of the Past: History of Aviation in Jamaica, Part II", url: "https://old.jamaica-gleaner.com/pages/history/story0071.html" },
  jamaicans: { name: "Jamaicans.com, On this day: Air Jamaica A.K.A. The Love Bird is Born", url: "https://jamaicans.com/on-this-day-in-jamaican-history-air-jamaica/" },
};
export const JOURNAL = [
  {
    id: "you", title: "Dee and Aunt Marcia",
    simple: ["You are Dee, nine years old, from Kingston.", "Your Aunt Marcia is a stewardess on the first day of Air Jamaica.", "A stewardess looks after the passengers on a plane."],
    deeper: ["Dee in this game is fictional. Aunt Marcia, Mr Hines and Captain Ross in this game are fictional too.", "The words they say are imagined, to tell the true story of the day."],
  },
  {
    id: "lovebird", title: "The Love Bird",
    simple: ["The bird on the tail is the Doctor Bird, Jamaica's national bird.", "The airline called it the Love Bird.", "It was orange and white, on a white tail."],
    deeper: ["The name Love Bird was used for the airline and for its stewardesses.", "The bird is drawn as a ring with a curling tail, as on the aircraft in the photographs and on the 25th anniversary stamps."],
    source: "wilson",
  },
  {
    id: "plane", title: "The first jets",
    simple: ["Air Jamaica began flying on 1 April 1969.", "It started with one DC-8 and three DC-9s.", "The flights went from Kingston and Montego Bay to New York and Miami."],
    deeper: ["The DC-8 is a big jet with four engines under swept wings. The DC-9 is smaller, with its two engines at the back.", "Air Canada owned part of the airline and helped with planes, pilots and training until 1980.", "The planes in the game are general pictures built from the real sizes and from photographs of the real planes."],
    source: "airlinegeeks",
  },
  {
    id: "uniforms", title: "The first crew",
    simple: ["There were 58 stewardesses on the first day.", "Their short dresses were yellow, hot pink and lime green.", "A former Miss Jamaica, Marguerite Kirkpatrick, designed them and trained the crew."],
    deeper: ["On long flights the crew modelled clothes and swimwear by Jamaican designers, with island music.", "The way the airline showed these women, as \"rare tropical birds\", was copied from American airlines, and many people today think it was unfair to them.", "The people in the game wear stand-in clothes, not the real uniforms, until bodies are made for them."],
    source: "wilson",
  },
  {
    id: "captain", title: "The captain",
    simple: ["A captain is the pilot in charge of the plane.", "At the start, some pilots came from Air Canada to help.", "More and more Jamaican pilots took over."],
    deeper: ["Captain Ross in this game is fictional.", "The Daily Gleaner wrote that the new jets would be flown by Jamaican pilots, partly at first, before full Jamaican crews came."],
    source: "wilson",
  },
  {
    id: "today", title: "A Jamaican airline",
    simple: ["A book of 1969 said Air Jamaica was \"a Jamaican airline for the Jamaican people\".", "People were proud of it.", "It flew for many years."],
    deeper: ["The airline began in 1966 on planes leased from BOAC and BWIA, and became Air Jamaica Ltd, with Air Canada, in 1969.", "In 2010 it was sold to Caribbean Airlines. That is part of the story to come."],
    source: "gleaner",
  },
];
export const CARDS = {
  takeoff: { title: "The first flight leaves", lines: ["The ground crew pull the steps away.", "The plane rolls out to the runway and takes off."], scary: false },
  end: { title: "A flag in the sky", lines: ["Jamaica had its own jets in the sky.", "A bird on the tail, a bright line of crew, a new morning."] },
};
export const FILMS = {
  takeoff: {
    place: "apron", next: 17, journal: "plane", title: "The first flight leaves",
    read: ["On 1 April 1969 Air Jamaica began flying its own jets from Kingston and Montego Bay to New York and Miami.", "The ground crew pulled away the steps, the DC-8 taxied to the runway, and then it took off."],
    captions: [
      [0, "Palisadoes Airport, Kingston. 1 April 1969."],
      [3.5, "The crew wave. The steps are pulled away."],
      [8, "The first Air Jamaica jet starts to roll."],
      [17, "It turns out onto the runway."],
      [26, "The engines roar. Faster and faster!"],
      [36, "The nose lifts. It is flying!"],
      [41, "Jamaica falls away below."],
    ],
    shots: [
      { t: 0, p: [-3, 1.5, 14], look: [-6, 2.6, -7] },
      { t: 5, p: [11, 2.2, 16], look: [-6, 2.8, -8] },
      { t: 11, p: [-14, 2.4, 6], look: [-22, 2.8, -8] },
      { t: 18, p: [-34, 2.6, 2], look: [-46, 2.6, -28] },
      { t: 25, p: [-28, 2.4, -62], look: [-34, 2.4, -83] },
      { t: 31, p: [28, 1.7, -74], look: [62, 2.4, -83] },
      { t: 37, p: [96, 3.0, -72], look: [116, 7, -83] },
      { t: 42, p: [140, 9, -64], look: [232, 28, -83] },
      { t: 46, p: [150, 11, -62], look: [330, 50, -83] },
    ],
    fov: [[0, 50], [11, 44], [25, 42], [31, 36], [37, 44], [46, 50]],
    acts: [],
    sounds: [[0.3, "begin"], [8, "drum"], [26, "jet"], [33, "jet"]],
    duration: 46,
  },
};
export const QUIZ = {
  title: "What did you learn?",
  items: [
    { q: "Which bird was on the tail?", opts: [{ t: "A parrot" }, { t: "The Doctor Bird", ok: true }, { t: "A pelican" }], why: "The Doctor Bird is Jamaica's national bird. The airline called it the Love Bird." },
    { q: "What colours were the first crew dresses?", opts: [{ t: "Yellow, hot pink and lime green", ok: true }, { t: "Black and white" }, { t: "Red and blue" }], why: "The bright dresses were designed by Marguerite Kirkpatrick." },
    { q: "How many jets did the airline start with?", opts: [{ t: "One" }, { t: "Four", ok: true }, { t: "Twenty" }], why: "It started with one DC-8 and three DC-9s." },
    { q: "Where did the first flights go?", opts: [{ t: "London and Paris" }, { t: "New York and Miami", ok: true }, { t: "Toronto and Montreal" }], why: "They flew from Kingston and Montego Bay to New York and Miami." },
  ],
};
