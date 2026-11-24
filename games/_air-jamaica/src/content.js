/* Every word the player reads. The airline, its planes, its uniforms and its first day were real. Dee, Aunt Marcia, Mr Hines and Captain Ross
   are fictional, and their journal pages say so. Facts and sources: docs/games/air-jamaica.md. Three chapters so far. Chef Louis Bailey is real; his words in the game are imagined. */
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
  {
    id: "cockpit", name: "The view from the front", year: "The 1970s", first: 30, last: 34, place: "cockpit",
    caption: "The flight deck of a DC-8 · coming in to Kingston",
    intro: "Years later, you fly home. Aunt Marcia takes you up to the flight deck.",
  },
  {
    id: "chef", name: "The flying chef", year: "The 2000s", first: 50, last: 56, place: "cabin",
    caption: "On board an Air Jamaica jet · flying to Toronto",
    intro: "Many years later, Dee is a mum. You are her daughter Tia, flying to Toronto.",
  },
];
export const chapterOf = (stage) => Math.max(0, CHAPTERS.findIndex((c) => stage >= c.first && stage <= c.last));
export const PEOPLE = { marcia: "Aunt Marcia", hines: "Mr Hines", ross: "Captain Ross", mum: "Mum", dee2: "Mum", chef: "Chef Bailey", clarke: "Mr Clarke" };
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
      L("Captain Ross", "Your Mum is up in the waving gallery."),
      L("Captain Ross", "Go and wave. We leave very soon."),
    ],
  },
};
TALK[15] = {
  mum: [
    L("Mum", "Dee, up here! Come to the rail."),
    L("You", "Mum, what is this place?"),
    L("Mum", "The waving gallery. Families come to wave."),
    L("Mum", "We stand up high and watch the planes leave."),
    L("You", "Can Aunt Marcia see us?"),
    L("Mum", "Maybe. Wave anyway. Here she goes!"),
  ],
};
TALK[50] = {
  dee2: [
    L("Mum", "Tia, this is your first big flight!"),
    L("You", "Mum, something smells so good."),
    L("Mum", "Air Jamaica has a chef on board."),
    L("Mum", "He cooks Jamaican food, up in the sky."),
    L("You", "A real chef, on a plane?"),
    L("Mum", "Yes. Go and meet him at the front."),
  ],
};
TALK[51] = {
  chef: [
    L("Chef Bailey", "Welcome, young lady. I am the flying chef."),
    L("You", "Do you really cook up here?"),
    L("Chef Bailey", "I do. Jamaican food, high above the clouds."),
    L("Chef Bailey", "I ask the passengers how they like it."),
    L("Chef Bailey", "Come and see what is on my trolley."),
  ],
};
TALK[54] = {
  clarke: [
    L("Mr Clarke", "Ackee and saltfish? Thank you, little miss."),
    L("You", "Chef Bailey is on the plane with us."),
    L("Mr Clarke", "Mmm. It tastes like my mother's kitchen."),
    L("Mr Clarke", "I am going to Toronto to see my daughter."),
    L("Mr Clarke", "Now I take a little Jamaica with me."),
  ],
};
export const FLAVOUR = {
  dee2: ["Mind the aisle, Tia.", "Toronto is cold. Bring your sweater."],
  chef: ["Fresh and hot, just like home.", "Tell me how you like it."],
  clarke: ["Best meal I ever had on a plane."],
  mum: ["Wave, Dee, wave!", "What a day for Jamaica."],
  marcia: ["Wave to me when we go!", "I am so proud today."],
  hines: ["Clear of the steps, please.", "Heavy bags, light hearts."],
  ross: ["Engines are warm.", "A fine morning for flying."],
};
export const SOURCES = {
  airlinegeeks: { name: "AirlineGeeks, TBT in Aviation History: Air Jamaica", url: "https://airlinegeeks.com/2016/06/29/tbt-throwback-thursday-in-aviation-history-air-jamaica/" },
  wilson: { name: "Phil Tiemeyer, Stewardess as Aerial Ambassador (Wilson Center, with the Daily Gleaner of 9 February and 1 April 1969)", url: "https://www.wilsoncenter.org/blog-post/stewardess-aerial-ambassador-what-gender-can-reveal-about-us-jamaican-foreign-relations" },
  gleaner: { name: "Jamaica Gleaner, 1 May 2010: Air Jamaica celebrates for the last time", url: "https://jamaica-gleaner.com/gleaner/20100501/lead/lead1.html" },
  gleaner2: { name: "Jamaica Gleaner, Pieces of the Past: History of Aviation in Jamaica, Part II", url: "https://old.jamaica-gleaner.com/pages/history/story0071.html" },
  dc8: { name: "Douglas DC-8 (Wikipedia): cockpit crew of three; length 45.9 m, wingspan 43.4 m", url: "https://en.wikipedia.org/wiki/Douglas_DC-8" },
  nlj: { name: "National Library of Jamaica, photographs of Palisadoes Airport and its waving gallery (D0002830, D0002829)", url: "https://nljdigital.nlj.gov.jm/items/show/1296" },
  jis2004: { name: "Jamaica Information Service, 21 March 2004: Air Jamaica Unveils Tasty Dishes to Canadians", url: "https://jis.gov.jm/air-jamaica-unveils-tasty-dishes-to-canadians/" },
  observer2022: { name: "Jamaica Observer, 23 December 2022: 'Butch' Stewart's 10-year love affair with Air Jamaica", url: "https://jamaicaobserver.com/news/butch-stewarts-10-year-love-affair-with-air-jamaica" },
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
    id: "gallery", title: "The waving gallery",
    simple: ["The waving gallery was a high open deck at Palisadoes Airport.", "You climbed steps on the outside of the building to reach it.", "Families stood at the rail to wave and to watch the planes leave."],
    deeper: ["The National Library of Jamaica keeps photographs of the gallery, with people standing along its rail.", "Many people remember that, once the public could no longer walk out to the planes, the gallery was where most of them watched. The year of that change is still to be found.", "Mum in this game is fictional."],
    source: "nlj",
  },
  {
    id: "cockpit", title: "The flight deck",
    simple: ["The cockpit is also called the flight deck.", "A DC-8 had three people up front: the captain, the first officer and the flight engineer.", "The captain sat on the left. The first officer sat on the right."],
    deeper: ["The flight engineer sat behind the first officer, facing a panel of dials and switches for the engines, the fuel and the air.", "The flight deck in this game is a general picture of a jet of that time, not a copy of one Air Jamaica plane. The crew in this game are fictional."],
    source: "dc8",
  },
  {
    id: "levers", title: "The throttles",
    simple: ["Four levers sat between the pilots, one for each engine.", "Pushing a lever forward makes that engine push harder."],
    deeper: ["Other levers worked the flaps, which are panels on the wings that let a plane fly slowly, and the speed brake."],
    source: "dc8",
  },
  {
    id: "today", title: "A Jamaican airline",
    simple: ["A book of 1969 said Air Jamaica was \"a Jamaican airline for the Jamaican people\".", "People were proud of it.", "It flew for many years."],
    deeper: ["The airline began in 1966 on planes leased from BOAC and BWIA, and became Air Jamaica Ltd, with Air Canada, in 1969.", "In 2010 it was sold to Caribbean Airlines. That is part of the story to come."],
    source: "gleaner",
  },
  {
    id: "tia", title: "Tia and Mum",
    simple: ["You are Tia, eight years old.", "Your Mum is Dee, all grown up.", "You are flying to Toronto in Canada to see family."],
    deeper: ["Tia, her Mum and Mr Clarke in this game are fictional.", "Many Jamaicans live in Toronto. In April 2004 Air Jamaica began flying there again, after 14 years away."],
    source: "jis2004",
  },
  {
    id: "chef", title: "The flying chef",
    simple: ["A chef is a cook.", "Air Jamaica had a chef who flew on its planes.", "He talked with the passengers about the food."],
    deeper: ["The flying chef was Louis Bailey. In 2004 the government news service called him \"the only flying Chef in the industry\".", "He flew on several flights each week and asked passengers what they thought of the dishes.", "Chef Bailey is a real person. His words in this game are imagined."],
    source: "jis2004",
  },
  {
    id: "menu", title: "The menu",
    simple: ["Ackee and saltfish is Jamaica's national dish.", "Run dung is fish cooked down in coconut milk.", "Festival is a sweet fried dumpling."],
    deeper: ["These dishes were served when Air Jamaica's flights to Toronto began again in 2004: ackee and saltfish, calaloo and saltfish, run dung, festival and jerk chicken.", "The plates, the trolley and the cabin in the game are a general picture, not a copy of the real ones."],
    source: "jis2004",
  },
  {
    id: "taste", title: "A little piece of Jamaica",
    simple: ["People said flying Air Jamaica felt like being in Jamaica.", "The food, the music and the welcome were Jamaican."],
    deeper: ["The Jamaica Observer called the airline \"the little piece of Jamaica that flies\".", "It lists the flying chef among the changes the airline's new owners made after 1994."],
    source: "observer2022",
  },
];
export const CARDS = {
  takeoff: { title: "The first flight leaves", lines: ["The ground crew pull the steps away.", "The plane rolls out to the runway and takes off."], scary: false },
  landing: { title: "Coming in to land", lines: ["The DC-8 comes down over the sea to the runway at Kingston.", "You watch from the flight deck."], scary: false },
  end: { title: "The flying chef", lines: ["Jamaica had its own jets in the sky.", "A bird on the tail, a view from the front, and food that tasted like home.", "More of the story is still to come."] },
};
export const FILMS = {
  takeoff: {
    place: "gallery", next: 18, journal: "plane", title: "The first flight leaves",
    read: ["On 1 April 1969 Air Jamaica began flying its own jets from Kingston and Montego Bay to New York and Miami.", "The ground crew pulled away the steps, the DC-8 taxied to the runway, and then it took off."],
    captions: [
      [0, "The waving gallery, Palisadoes Airport. 1 April 1969."],
      [3.5, "The crew wave. The steps are pulled away."],
      [8, "The first Air Jamaica jet starts to roll."],
      [17, "It turns out onto the runway."],
      [26, "The engines roar. Faster and faster!"],
      [36, "The nose lifts. It is flying!"],
      [41, "Jamaica falls away below."],
    ],
    shots: [
      { t: 0, p: [38.6, 5.9, 31.0], look: [4, 3.2, -8] },
      { t: 6, p: [38.2, 5.9, 31.0], look: [0, 3.0, -8] },
      { t: 12, p: [37.6, 5.9, 31.0], look: [-18, 2.8, -8] },
      { t: 19, p: [37.0, 5.9, 31.0], look: [-44, 2.8, -20] },
      { t: 26, p: [36.6, 5.9, 31.0], look: [-46, 2.6, -60] },
      { t: 31, p: [36.2, 5.9, 31.0], look: [-36, 2.6, -81] },
      { t: 37, p: [36.0, 5.9, 31.0], look: [60, 3.0, -83] },
      { t: 41, p: [36.0, 5.9, 31.0], look: [150, 8, -83] },
      { t: 46, p: [36.0, 5.9, 31.0], look: [300, 36, -83] },
    ],
    fov: [[0, 36], [12, 30], [26, 24], [31, 20], [37, 16], [46, 14]],
    acts: [],
    sounds: [[0.3, "begin"], [8, "drum"], [26, "jet"], [33, "jet"]],
    duration: 46,
  },
};
FILMS.landing = {
  place: "cockpit", next: 34, journal: "cockpit", title: "Coming in to land",
  read: ["The DC-8 came down toward Palisadoes over the sea. The captain and the first officer flew it, and the flight engineer watched the engines.", "The wheels touched the runway, and the pilots slowed the plane."],
  captions: [
    [0, "On the flight deck, high over the sea."],
    [4, "Captain Ross: “There it is. Palisadoes. Home.”"],
    [9, "The first officer: “Wheels down.”"],
    [14, "The thin strip of land grows bigger."],
    [20, "The first officer: “Nice and steady.”"],
    [25, "The runway comes up to meet the plane."],
    [28.5, "Bump! The wheels touch the runway."],
    [34, "The pilots slow the plane."],
    [41, "Captain Ross: “Welcome home to Jamaica.”"],
  ],
  shots: [
    { t: 0, p: [0.0, 1.4, 0.55], look: [0.0, 1.25, -4] },
    { t: 7, p: [0.15, 1.35, 0.3], look: [0.0, 1.25, -5] },
    { t: 22, p: [0.0, 1.35, 0.3], look: [0.0, 1.2, -6] },
    { t: 30, p: [0.0, 1.38, 0.3], look: [0.0, 1.15, -6] },
    { t: 38, p: [-0.15, 1.4, 0.35], look: [-0.5, 1.2, -4] },
    { t: 46, p: [-0.15, 1.4, 0.35], look: [-0.3, 1.2, -4] },
  ],
  fov: [[0, 62], [22, 64], [46, 62]],
  acts: [],
  sounds: [[0.3, "begin"], [9, "drum"], [28.3, "drum"], [29, "jet"], [34, "jet"]],
  duration: 46,
};
export const QUIZZES = {
  cockpit: {
    title: "What did you learn?",
    items: [
      { q: "How many people flew a DC-8 up front?", opts: [{ t: "One" }, { t: "Three", ok: true }, { t: "Six" }], why: "The captain, the first officer and the flight engineer." },
      { q: "Where does the captain sit?", opts: [{ t: "On the left", ok: true }, { t: "On the right" }, { t: "At the back" }], why: "The captain sits on the left. The first officer sits on the right." },
      { q: "What do the four levers do?", opts: [{ t: "Open the doors" }, { t: "Make the engines push harder", ok: true }, { t: "Turn on the lights" }], why: "Each lever is for one engine." },
    ],
  },
  chef: {
    title: "What did you learn?",
    items: [
      { q: "What did the flying chef do?", opts: [{ t: "Flew the plane" }, { t: "Cooked and served Jamaican food on board", ok: true }, { t: "Fixed the engines" }], why: "Chef Louis Bailey flew on the planes and asked passengers how they liked the food." },
      { q: "Which dish is Jamaica's national dish?", opts: [{ t: "Ackee and saltfish", ok: true }, { t: "Pizza" }, { t: "Fish and chips" }], why: "Ackee and saltfish was on the menu for the Toronto flights." },
      { q: "What is festival?", opts: [{ t: "A sweet fried dumpling", ok: true }, { t: "A kind of fish" }, { t: "A drink" }], why: "Festival is long, golden and a little sweet." },
    ],
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
