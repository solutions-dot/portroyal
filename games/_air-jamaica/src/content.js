/* Every word the player reads. The airline, its planes, its uniforms and its first day were real. Dee, Aunt Marcia, Mr Hines and Captain Ross
   are fictional, and their journal pages say so. Facts and sources: docs/games/air-jamaica.md. Six chapters, from 1969 to the last flight home in 2010. Chef Louis Bailey is real; his words in the game are imagined. Dee, Tia, Mum, Aunt Marcia, Mr Hines, Mr Clarke and Mr Grant are fictional. */
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
    { icon: "🛬", label: "The last flight home", page: "lastflight" },
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
    id: "newlook", name: "New colours", year: "December 1994", first: 40, last: 46, place: "newlook",
    caption: "Norman Manley Airport, Kingston · December 1994",
    intro: "Dee is grown up now. Air Jamaica has new owners, and a new look.",
  },
  {
    id: "chef", name: "The flying chef", year: "The 2000s", first: 50, last: 56, place: "cabin",
    caption: "On board an Air Jamaica jet · flying to Toronto",
    intro: "Many years later, Dee is a mum. You are her daughter Tia, flying to Toronto.",
  },
  {
    id: "sale", name: "The sale", year: "April 2010", first: 70, last: 73, place: "home",
    caption: "Aunt Marcia's home, Kingston · April 2010",
    intro: "Tia is fourteen now. Aunt Marcia has news about the airline.",
  },
  {
    id: "last", name: "The last flight home", year: "30 April 2010", first: 90, last: 96, place: "lastflight",
    caption: "Flying home from Fort Lauderdale · 30 April 2010",
    intro: "You and Mum fly home on the last Air Jamaica flight from Fort Lauderdale.",
  },
];
export const chapterOf = (stage) => Math.max(0, CHAPTERS.findIndex((c) => stage >= c.first && stage <= c.last));
export const PEOPLE = { marcia: "Aunt Marcia", hines: "Mr Hines", ross: "Captain Ross", mum: "Mum", dee2: "Mum", chef: "Chef Bailey", clarke: "Mr Clarke", marcia94: "Aunt Marcia", hines94: "Mr Hines", marcia10: "Aunt Marcia", dee10: "Mum", dee10s: "Mum", grant: "Mr Grant" };
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
      L("Captain Ross", "Air Canada lends the new airline some captains."),
      L("Captain Ross", "Jamaican pilots fly with us too."),
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
    L("Mum", "Yes! Read about it in the magazine."),
    L("Mum", "It is in the pocket in front of your seat."),
  ],
};
TALK[52] = {
  chef: [
    L("Chef Bailey", "Welcome, young lady. I am the flying chef."),
    L("You", "Do you really cook up here?"),
    L("Chef Bailey", "I do. Jamaican food, high above the clouds."),
    L("Chef Bailey", "I ask the passengers how they like it."),
    L("Chef Bailey", "Come and see what is on my trolley."),
  ],
};
TALK[55] = {
  clarke: [
    L("Mr Clarke", "Ackee and saltfish? Thank you, little miss."),
    L("You", "Chef Bailey is on the plane with us."),
    L("Mr Clarke", "Mmm. It tastes like my mother's kitchen."),
    L("Mr Clarke", "I am going to Toronto to see my daughter."),
    L("Mr Clarke", "Now I take a little Jamaica with me."),
  ],
};
TALK[40] = {
  marcia94: [
    L("Aunt Marcia", "Dee! Look at her. Isn't she lovely?"),
    L("You", "Aunt Marcia, the colours are all new!"),
    L("Aunt Marcia", "New owners took over the airline this year."),
    L("Aunt Marcia", "They gave the planes a whole new look."),
    L("You", "Is the bird still on the tail?"),
    L("Aunt Marcia", "Go and look up at the tail."),
  ],
};
TALK[42] = {
  hines94: [
    L("Mr Hines", "Dee! You were nine when the first jet flew."),
    L("You", "Mr Hines! You still work here?"),
    L("Mr Hines", "Twenty-five years. I look after the engines now."),
    L("Mr Hines", "This is an Airbus. It has two engines."),
    L("Mr Hines", "The new owners want every flight on time."),
    L("Mr Hines", "Go round the front and read her name."),
  ],
};
TALK[70] = {
  marcia10: [
    L("Aunt Marcia", "Tia, come and sit with me. I have news."),
    L("You", "Is it about Air Jamaica?"),
    L("Aunt Marcia", "Yes. The airline owed a lot of money."),
    L("Aunt Marcia", "Jamaica could not keep paying for it."),
    L("Aunt Marcia", "So another airline will take over the planes."),
    L("You", "Which airline?"),
    L("Aunt Marcia", "Caribbean Airlines, from Trinidad and Tobago."),
    L("Aunt Marcia", "Open my old box on the table. I kept something."),
  ],
};
TALK[72] = {
  dee10: [
    L("Mum", "Tia, I have a surprise for you."),
    L("Mum", "We are going to Florida to see Auntie Joy."),
    L("Mum", "We fly home on the thirtieth of April."),
    L("Mum", "It is the last Air Jamaica flight home."),
    L("You", "The very last one?"),
    L("Mum", "Yes. Aunt Marcia flew on the first day."),
    L("Mum", "We fly on the last."),
  ],
};
TALK[90] = {
  dee10s: [
    L("Mum", "Tia, this is it. The last Air Jamaica flight home."),
    L("You", "It feels so quiet."),
    L("Mum", "I wanted to fly on the Love Bird one more time."),
    L("Mum", "Say hello to Mr Grant across the aisle."),
  ],
};
TALK[91] = {
  grant: [
    L("Mr Grant", "Good evening, young lady."),
    L("Mr Grant", "In 1969 I watched the first jet leave."),
    L("Mr Grant", "I waved from the waving gallery."),
    L("You", "My Aunt Marcia was on that plane!"),
    L("Mr Grant", "Then your family saw the first and the last."),
    L("Mr Grant", "Look out of the window. We are nearly home."),
  ],
};
export const FLAVOUR = {
  dee2: ["Mind the aisle, Tia.", "Toronto is cold. Bring your sweater."],
  marcia94: ["Isn't she pretty?", "Blue, pink and yellow. Lovely."],
  hines94: ["Two engines, and both of them good.", "Mind the wing, Dee."],
  marcia10: ["I kept that dress for forty years.", "The name stays in our hearts."],
  dee10: ["Pack your bag, Tia.", "Florida, then home."],
  dee10s: ["Nearly home, Tia.", "Look how pretty the sky is."],
  grant: ["The first and the last. Imagine that.", "Home soon."],
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
  sflcn2009: { name: "South Florida Caribbean News, 29 June 2009: Skywritings Sees Double, Wins Two Awards", url: "https://sflcn.com/?p=6571" },
  observer2022: { name: "Jamaica Observer, 23 December 2022: 'Butch' Stewart's 10-year love affair with Air Jamaica", url: "https://jamaicaobserver.com/news/butch-stewarts-10-year-love-affair-with-air-jamaica" },
  jamaicans: { name: "Jamaicans.com, On this day: Air Jamaica A.K.A. The Love Bird is Born", url: "https://jamaicans.com/on-this-day-in-jamaican-history-air-jamaica/" },
  observer2011: { name: "Jamaica Observer, July 2011: Air Jamaica, end of an era (photographs of the new-look plane and its launch, December 1994; read in a copy, no web address found)", url: null },
  worldbank: { name: "World Bank and IFC, Public-Private Partnership Stories: Jamaica, Air Jamaica (February 2011)", url: "https://documents1.worldbank.org/curated/en/683071468001189501/pdf/96901-BRI-PUBLIC-PPPStories-Jamaica-AirJamaica.pdf" },
  jis2010: { name: "Jamaica Information Service, 2010: Cabinet approves Air Jamaica's divestment", url: "https://jis.gov.jm/cabinet-approves-air-jamaicas-divestment-friday/" },
  gleaner2010: { name: "Jamaica Gleaner, 5 March 2010: Air Jamaica staff, the takeover and the Air Jamaica name and colours", url: "https://past.jamaica-gleaner.com/gleaner/20100305/business/business5.html" },
  wan2010: { name: "World Airline News, 3 May 2010, citing the Jamaica Observer: the last Air Jamaica flight, JM 036, Fort Lauderdale to Kingston", url: "https://worldairlinenews.com/2010/05/03/air-jamaica-operates-its-last-flight/" },
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
    simple: ["There were 58 stewardesses on the first day.", "Their short dresses were yellow, hot pink and lime green.", "Each one had a white flight bag.", "A former Miss Jamaica, Marguerite Kirkpatrick, designed them and trained the crew."],
    deeper: ["On long flights the crew modelled clothes and swimwear by Jamaican designers, with island music.", "The way the airline showed these women, as \"rare tropical birds\", was copied from American airlines, and many people today think it was unfair to them.", "The people in the game wear stand-in clothes, not the real uniforms, until bodies are made for them."],
    source: "wilson",
  },
  {
    id: "captain", title: "The captain",
    simple: ["A captain is the pilot in charge of the plane.", "At the start, Air Canada lent the airline some of its captains.", "Jamaican pilots flew too, and more and more took over."],
    deeper: ["Captain Ross in this game is fictional.", "A 1969 Air Jamaica advertisement said Air Canada was \"putting men in the left-hand seat\", where the captain sits.", "The Daily Gleaner wrote that the new jets would be flown by Jamaican pilots, partly at first, before full Jamaican crews came."],
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
    deeper: ["The airline began in 1966 on planes leased from BOAC and BWIA, and became Air Jamaica Ltd, with Air Canada, in 1969.", "In 2010 it was sold to Caribbean Airlines. The last chapters tell that part of the story."],
    source: "gleaner",
  },
  {
    id: "tia", title: "Tia and Mum",
    simple: ["You are Tia, eight years old.", "Your Mum is Dee, all grown up.", "You are flying to Toronto in Canada to see family."],
    deeper: ["Tia, her Mum and Mr Clarke in this game are fictional.", "Many Jamaicans live in Toronto. In April 2004 Air Jamaica began flying there again, after 14 years away."],
    source: "jis2004",
  },
  {
    id: "skywritings", title: "SkyWritings",
    simple: ["SkyWritings was Air Jamaica's own magazine.", "Passengers read it on the plane.", "It told stories about the places the airline flew to."],
    deeper: ["It came out every two months. In 2009 it was named Magazine of the Year in Jamaica, and its publisher said about 500,000 people read each issue.", "A copy from September 1972 shows it was already in print in the airline's early years.", "The cover in the game is laid out like a real issue of 2008: the airline's logo, the big shaded title and a picture to every edge. Its picture and the story pages were made for the game."],
    source: "sflcn2009",
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
JOURNAL.push(
  {
    id: "dee94", title: "Dee, grown up",
    simple: ["You are Dee again, now grown up.", "Aunt Marcia brought you to see the airline's new look."],
    deeper: ["Dee, Aunt Marcia and Mr Hines in this game are fictional. Their words are imagined.", "In December 1994 a photograph showed the new-look Air Jamaica plane at Norman Manley Airport before its first flight in the new colours."],
    source: "observer2011",
  },
  {
    id: "newlook", title: "The new look",
    simple: ["The tail turned dark blue.", "The bird stayed: yellow, inside a yellow ring.", "Bands of yellow, orange, pink and blue ran along the planes."],
    deeper: ["Photographs of the airline's Airbus planes in later years show these colours.", "When exactly they first flew is still being checked: the new look flew in December 1994, and the game shows it as it looks in those later photographs."],
    source: "observer2011",
  },
  {
    id: "owners", title: "New owners",
    simple: ["In 1994 a group of new owners took over most of the airline.", "The government kept a smaller part.", "The new owners promised flights that left on time."],
    deeper: ["The group was led by the hotel owner Gordon \"Butch\" Stewart, who became chairman. The Jamaica Observer, a paper he owned, later wrote of its \"on-time, no-line\" flights and champagne flights.", "The airline grew to about 20 Airbus planes. It was loved and won awards, but it lost a lot of money.", "At the end of 2004 the group handed the airline back to the government."],
    source: "observer2022",
  },
  {
    id: "airbus", title: "The Airbus",
    simple: ["An Airbus A320 is a jet with two engines under its wings.", "It is about 38 metres long.", "The flag of Jamaica sat under the cockpit windows."],
    deeper: ["The plane in this chapter is built from the A320's published sizes and from photographs of Air Jamaica's A320s.", "Which plane was the first to wear the new look is not known. An Air Jamaica Airbus A300 wore it by February 1996.", "The hangar in the game is a general picture, not the airline's own hangar."],
    source: "observer2011",
  },
  {
    id: "sale", title: "The sale",
    simple: ["Air Jamaica owed a lot of money.", "Jamaica could not keep paying for it.", "Caribbean Airlines, from Trinidad and Tobago, took over its planes and flights."],
    deeper: ["Air Jamaica lost money in 40 of its 42 years. The sale was signed on 30 April 2010 and began on 1 May 2010.", "Jamaica got a part of Caribbean Airlines, and kept Air Jamaica's buildings and land. Caribbean Airlines did not take on the old debts: the Jamaican government paid them.", "Air Jamaica's workers lost their jobs. About 1,000 were taken on again."],
    source: "worldbank",
  },
  {
    id: "keepsakes", title: "Aunt Marcia's box",
    simple: ["Aunt Marcia kept her yellow dress from her first day.", "She kept her white gloves and a photo of the crew."],
    deeper: ["Aunt Marcia and her box are fictional. The dress is like the yellow, pink and lime green dresses of the first crew of 1969."],
    source: "wilson",
  },
  {
    id: "tia14", title: "Tia",
    simple: ["You are Tia again, now fourteen.", "You and Mum are going to Florida, and home again."],
    deeper: ["Tia, Mum and Auntie Joy in this game are fictional."],
    source: "jis2010",
  },
  {
    id: "lastflight", title: "The last flight home",
    simple: ["On 30 April 2010 the last Air Jamaica flight flew home.", "It flew from Fort Lauderdale in Florida to Kingston.", "The next day Caribbean Airlines took over."],
    deeper: ["The flight was JM 036, flown by an Airbus A320.", "For a while the planes kept the Air Jamaica name and colours, while Caribbean Airlines flew them.", "The time of day of the landing is not given in the sources found: the evening light in the game is a choice."],
    source: "wan2010",
  },
  {
    id: "grant", title: "Mr Grant",
    simple: ["Mr Grant saw the first jet leave in 1969.", "Now he flies home on the last flight."],
    deeper: ["Mr Grant in this game is fictional. His words are imagined."],
    source: "gleaner",
  },
  {
    id: "kept", title: "What Jamaica kept",
    simple: ["The planes went to another airline.", "Jamaica kept the memories: the Love Bird, the food, the music, the welcome.", "What would you keep?"],
    deeper: ["Jamaica kept a part of Caribbean Airlines and Air Jamaica's buildings and land.", "Air Jamaica stickers stayed on some planes until 2015."],
    source: "worldbank",
  },
);
export const CARDS = {
  takeoff: { title: "The first flight leaves", lines: ["The ground crew pull the steps away.", "The plane rolls out to the runway and takes off."], scary: false },
  landing: { title: "Coming in to land", lines: ["The DC-8 comes down over the sea to the runway at Kingston.", "You watch from the flight deck."], scary: false },
  newflight: { title: "The new look takes off", lines: ["The plane in its new colours rolls out to the runway.", "Then it takes off over the sea."], scary: false },
  lastlanding: { title: "The last flight comes home", lines: ["The plane comes down over the sea to Kingston.", "It lands and rolls to a stop."], scary: false },
  end: { title: "The last flight home", lines: ["Air Jamaica flew its own jets from 1969 to 2010.", "A bird on the tail, food that tasted like home, and a warm welcome.", "The planes went to another airline. The memories stayed.", "What would you keep?"] },
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
FILMS.newflight = {
  place: "newlook", next: 46, journal: "newlook", title: "The new look takes off",
  read: ["In December 1994 the first Air Jamaica plane in the new colours flew from Kingston.", "Guests and staff watched it roll out to the runway and take off."],
  captions: [
    [0, "Norman Manley Airport, Kingston. December 1994."],
    [3.5, "Everyone steps back from the plane."],
    [8, "The new look starts to roll."],
    [17, "It turns out onto the runway."],
    [26, "The engines roar. Faster and faster!"],
    [36, "It lifts off over the sea."],
  ],
  shots: [
    { t: 0, p: [-6, 1.7, 12], look: [6, 3.6, -8] },
    { t: 8, p: [-8, 1.7, 12], look: [-14, 3.2, -8] },
    { t: 15, p: [-10, 1.8, 12], look: [-40, 3.0, -16] },
    { t: 22, p: [-12, 1.9, 12], look: [-46, 3.0, -60] },
    { t: 30, p: [-12, 1.9, 12], look: [-30, 3.0, -83] },
    { t: 36, p: [-12, 1.9, 12], look: [100, 6, -83] },
    { t: 41, p: [-12, 1.9, 12], look: [190, 14, -83] },
    { t: 46, p: [-12, 1.9, 12], look: [320, 36, -83] },
  ],
  fov: [[0, 50], [15, 40], [26, 30], [36, 22], [46, 16]],
  acts: [],
  sounds: [[0.3, "begin"], [8, "drum"], [26, "jet"], [33, "jet"]],
  duration: 46,
};
FILMS.lastlanding = {
  place: "arrival", next: 95, journal: "lastflight", title: "The last flight comes home",
  read: ["On the evening of 30 April 2010 the last Air Jamaica flight from Fort Lauderdale came down over the sea to Kingston.", "It landed, rolled to the apron and stopped. The next day, Caribbean Airlines took over the flights."],
  captions: [
    [0, "Kingston, 30 April 2010."],
    [4, "The last Air Jamaica flight comes in over the sea."],
    [16, "The wheels touch the runway."],
    [24, "The plane slows down."],
    [36, "It rolls back to the apron."],
    [50, "It stops. The engines go quiet."],
    [56, "The Love Bird on the tail, one last time."],
  ],
  shots: [
    { t: 0, p: [-14, 2.2, 14], look: [700, 44, -83] },
    { t: 8, p: [-14, 2.2, 14], look: [420, 18, -83] },
    { t: 15, p: [-14, 2.2, 14], look: [230, 3, -83] },
    { t: 20, p: [-14, 2.2, 14], look: [130, 2.5, -83] },
    { t: 27, p: [-14, 2.2, 14], look: [-30, 3, -83] },
    { t: 34, p: [-14, 2.2, 14], look: [-46, 3, -55] },
    { t: 42, p: [-14, 2.2, 14], look: [-42, 3, -16] },
    { t: 50, p: [-10, 2.0, 12], look: [4, 3.5, -8] },
    { t: 56, p: [20, 4.5, 8], look: [24.6, 8.8, -8] },
    { t: 63, p: [22, 7.5, 4], look: [24.4, 9.4, -8] },
  ],
  fov: [[0, 18], [15, 24], [27, 36], [42, 44], [50, 48], [56, 40], [63, 34]],
  acts: [],
  sounds: [[0.3, "begin"], [10, "jet"], [16, "drum"], [17, "jet"], [56, "end"]],
  duration: 63,
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
      { q: "What was SkyWritings?", opts: [{ t: "Air Jamaica's magazine", ok: true }, { t: "A kind of plane" }, { t: "A song" }], why: "Passengers read it on the plane. It told stories about the places the airline flew to." },
      { q: "What is festival?", opts: [{ t: "A sweet fried dumpling", ok: true }, { t: "A kind of fish" }, { t: "A drink" }], why: "Festival is long, golden and a little sweet." },
    ],
  },
  newlook: {
    title: "What did you learn?",
    items: [
      { q: "What happened to Air Jamaica in 1994?", opts: [{ t: "New owners took over", ok: true }, { t: "It stopped flying" }, { t: "It moved to Canada" }], why: "A group of new owners took over most of the airline. The government kept a smaller part." },
      { q: "What colour was the new tail?", opts: [{ t: "Orange" }, { t: "Dark blue", ok: true }, { t: "Green" }], why: "Dark blue, with pink and purple bars and the yellow bird." },
      { q: "How many engines does the Airbus A320 have?", opts: [{ t: "Two", ok: true }, { t: "Four" }, { t: "Six" }], why: "One under each wing." },
    ],
  },
  sale: {
    title: "What did you learn?",
    items: [
      { q: "Why was Air Jamaica sold?", opts: [{ t: "Its planes were too slow" }, { t: "It owed a lot of money", ok: true }, { t: "Nobody flew on it" }], why: "It lost money for many years, and Jamaica could not keep paying for it." },
      { q: "Which airline took over its planes and flights?", opts: [{ t: "Air Canada" }, { t: "Caribbean Airlines", ok: true }, { t: "BOAC" }], why: "Caribbean Airlines, from Trinidad and Tobago, took over on 1 May 2010." },
      { q: "What did Aunt Marcia keep in her box?", opts: [{ t: "Her yellow dress from 1969", ok: true }, { t: "A plane ticket" }, { t: "A chef's hat" }], why: "Her dress from the first day, her white gloves and a photo of the crew." },
    ],
  },
  last: {
    title: "What did you learn?",
    items: [
      { q: "When was the last Air Jamaica flight home?", opts: [{ t: "1 April 1969" }, { t: "30 April 2010", ok: true }, { t: "December 1994" }], why: "The next day, 1 May 2010, Caribbean Airlines took over." },
      { q: "Where did the last flight come from?", opts: [{ t: "Fort Lauderdale, in Florida", ok: true }, { t: "London" }, { t: "Toronto" }], why: "It flew from Fort Lauderdale to Kingston." },
      { q: "Which bird flew on every Air Jamaica tail?", opts: [{ t: "The Doctor Bird", ok: true }, { t: "A pelican" }, { t: "A parrot" }], why: "Jamaica's national bird. The airline called it the Love Bird." },
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
