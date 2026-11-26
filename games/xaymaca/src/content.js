/* Every word the player reads. The record of 1503 to 1504 is Spanish only (Ferdinand Columbus, Diego Mendez, Columbus). You, Grandmother,
   Cousin, the runner and the park guide are fictional; the cacique of Maima and the interpreter were real but no source names them, and
   their words are imagined; Diego Mendez was real and his words here are imagined. Columbus has no invented words: what he said at the
   eclipse comes only through the interpreter, close to Ferdinand's report. Facts, sources and the game's own rules: docs/games/xaymaca.md.
   The readable script (docs/games/xaymaca/script.md) is made from this file by node tools/xaymaca/script.mjs. */
export const TITLE = "Xaymaca";
export const GAME = {
  id: "xaymaca",
  eye: 1.25,
  title: { place: "maima", pos: [6.5, 3.2, 9.5], look: [-14, -6, -60] },
  fiction: "You are a child of Maima, a Taino village above St Ann's Bay. You and your family are fictional. The ships, the canoes and the red moon were real.",
  recap: [
    { icon: "🛶", label: "The canoes", page: "paddlers", img: "recap/canoes.jpg" },
    { icon: "🫓", label: "Cassava bread", page: "casabe", img: "recap/casabe.jpg" },
    { icon: "🌕", label: "The red moon", page: "eclipse", img: "recap/moon.jpg" },
  ],
};
export const CHAPTERS = [
  { id: "ships", name: "Ships on the bay", year: "June 1503", first: 8, last: 16, place: "maima", caption: "Maima, above St Ann's Bay · June 1503", intro: "Morning in Maima. Down on the bay, something strange is coming." },
  { id: "bread", name: "Bread for bells", year: "July 1503", first: 20, last: 27, place: "shore", caption: "The shore at St Ann's Bay · July 1503", intro: "The strangers stay on their ships. They are hungry, and they want to trade." },
  { id: "paddlers", name: "The paddlers", year: "July 1503", first: 30, last: 37, place: "shore", caption: "The shore at St Ann's Bay · dawn, July 1503", intro: "Two big canoes are ready. Cousin is going with them." },
  { id: "canoes", name: "The ten canoes", year: "January 1504", first: 40, last: 45, place: "maima", caption: "Maima · January 1504", intro: "Half a year has gone by. Nobody has come back across the sea." },
  { id: "moon", name: "The red moon", year: "February 1504", first: 50, last: 55, place: "night", caption: "Maima · the night of 29 February 1504", intro: "The strangers' leader has sent for the leaders of the villages." },
  { id: "leave", name: "When the ships left", year: "June 1504", first: 60, last: 65, place: "maima", caption: "Maima · June 1504", intro: "A year has passed since the ships came. Now a new ship is in the bay." },
  { id: "today", name: "Back in 2026", year: "2026", first: 70, last: 75, place: "today", caption: "Seville Heritage Park, St Ann's Bay · 2026", intro: "The same hill, more than five hundred years later." },
];
export const chapterOf = (stage) => Math.max(0, CHAPTERS.findIndex((c) => stage >= c.first && stage <= c.last));
export const PEOPLE = { gran: "Grandmother", cousin: "Cousin", cacique: "The cacique", interp: "The interpreter", mendez: "Diego Mendez", runner: "A runner", guide: "Miss Sharon" };
const L = (who, text, voice) => voice ? { who, text, voice } : { who, text };
const G = "Grandmother",
  C = "Cousin",
  K = "The cacique",
  I = "The interpreter",
  M = "Diego Mendez",
  Y = "You";
export const TALK = {
  /* 1. Ships on the bay */
  10: { gran: [L(G, "Did you see them? Two great canoes, with cloth wings.", "grandmother-01.mp3"), L(Y, "Are they canoes, Grandmother?"), L(G, "Bigger than any canoe. And full of water, I think.", "grandmother-02.mp3"), L(G, "They will need food. Everyone needs food.", "grandmother-03.mp3"), L(G, "Come. Turn the bread for me first.", "grandmother-04.mp3")] },
  12: { cousin: [L(C, "There you are! Have you seen the strangers?"), L(Y, "From up here. They look tired, like their ships."), L(C, "They ran the ships onto the sand. On purpose."), L(C, "Go and look from the rock. You can see them working.")] },
  15: { cousin: [L(C, "They are building roofs on their ships. Like houses!"), L(Y, "So they are staying."), L(C, "For a while. And they have nothing to eat."), L(C, "Tomorrow we take bread down to them. You can help.")] },
  /* 2. Bread for bells */
  20: { cousin: [L(C, "The strangers stay on their ships. They do not come ashore."), L(C, "So we go out to them, in the canoe."), L(Y, "What will they give us for bread?"), L(C, "Beads. Bells. Strange shining things."), L(C, "Bring the basket of bread to the canoe.")] },
  25: { interp: [L(I, "Do not be afraid. I speak your words."), L(Y, "You look like us. But you came on their ship."), L(I, "I come from the big island to the east."), L(I, "The Spanish call it Hispaniola. I sail with them."), L(I, "Their leader is the Admiral. He is old, and sick."), L(I, "Come. Diego Mendez wants to speak with your cousin.")] },
  26: { mendez: [L(I, "This is Diego Mendez. He is brave, they say."), L(M, "I must cross the sea to Hispaniola. In a canoe."), L(I, "He needs strong paddlers. Ten for each canoe."), L(Y, "That sea is wide. People die out there."), L(M, "I know. That is why I need the best."), L(I, "He says he will pay the paddlers well.")] },
  27: { cousin: [L(C, "I am the best paddler in Maima. Everyone knows it."), L(Y, "You are going with them?"), L(C, "Someone must. Or the strangers stay here for ever."), L(Y, "Grandmother will be angry."), L(C, "Grandmother will be proud. In the end.")] },
  /* 3. The paddlers */
  30: { gran: [L(G, "Look at him. So sure of himself."), L(G, "His grandfather was the same."), L(Y, "Will he come back, Grandmother?"), L(G, "The sea decides that. Not us."), L(G, "Take him his calabash of water. Fill it at the stream.")] },
  33: { cousin: [L(C, "Water and cassava. Now I have all I need."), L(Y, "Come back soon."), L(C, "Watch the sea for me. I will watch the moon."), L(C, "When the moon is round, think of me paddling.")] },
  /* 4. The ten canoes */
  42: { gran: [L(G, "Did you hear the shouting? Half of them have gone."), L(G, "They took ten canoes. Canoes our people made."), L(Y, "Where are they going?"), L(G, "East, where Cousin went. To cross the sea."), L(G, "Pull our canoe up under the trees. Hide it well.")] },
  44: { cacique: [L(K, "The strangers eat and eat. Their bellies have no bottom.", "cacique-01.mp3"), L(K, "One of them eats as much as twenty of us.", "cacique-02.mp3"), L(Y, "Our gardens are getting empty."), L(K, "Yes. So we will bring them less from now on.", "cacique-03.mp3"), L(K, "We have children to feed too.", "cacique-04.mp3")] },
  45: { runner: [L("A runner", "I ran from the east. Two days without stopping."), L("A runner", "The men who left are taking food by force."), L(Y, "Did they cross the sea?"), L("A runner", "No. The waves sent them back."), L("A runner", "They were cruel to the paddlers out there."), L(Y, "And Cousin? Was he with them?"), L("A runner", "No. Your cousin went long before. With the first canoes.")] },
  /* 5. The red moon */
  50: { interp: [L(I, "The Admiral called your leaders today. I spoke his words."), L(I, "He said his God is angry with you."), L(I, "Because you bring less food."), L(I, "He said tonight the moon will show that anger."), L(Y, "How can he know what the moon will do?"), L(I, "He reads it in his books. That is all I know.")] },
  51: { cacique: [L(K, "Some of the leaders are afraid. Some are laughing."), L(K, "Who can make the moon angry? Not a man."), L(K, "We will watch. And we will see.")] },
  52: { gran: [L(G, "I have seen the moon go dark before. Twice."), L(G, "It comes back. It always comes back."), L(Y, "But he said it would happen tonight."), L(G, "That is the strange part. How did he know?"), L(G, "Come. It is rising.")] },
  55: { gran: [L(G, "You see? It came back, as I said."), L(Y, "Everyone ran down with food."), L(G, "Yes. They were frightened. I was too, a little."), L(G, "Not of the moon. Of a man who knows it so well."), L(G, "Now. Bed.")] },
  /* 6. When the ships left */
  60: { gran: [L(G, "The strangers fought each other on the hill. Here, by Maima."), L(Y, "Did our people fight too?"), L(G, "No. We stood with our spears and watched."), L(G, "We did not take a side. It was their quarrel."), L(G, "Now look. Another ship has come into the bay.")] },
  64: { gran: [L(G, "They are gone. All of them."), L(Y, "Cousin did not come back."), L(G, "No. Not yet."), L(G, "Maybe he stayed on the big island."), L(G, "Maybe he is paddling home right now."), L(G, "We will keep watching the sea. Both of us.")] },
  /* 7. Back in 2026 */
  70: { guide: [L("Miss Sharon", "Welcome to Seville Heritage Park, St Ann's Bay."), L("Miss Sharon", "Before the Spanish town, there was a Taino village here."), L("Miss Sharon", "Archaeologists think it was Maima."), L(Y, "The village that fed Columbus's men?"), L("Miss Sharon", "For a whole year. Go and see the round house.")] },
  73: { guide: [L("Miss Sharon", "The Spanish came back in 1509 and built Sevilla la Nueva."), L("Miss Sharon", "It was hard for the Taino. Sickness, forced work and fighting."), L("Miss Sharon", "Within a few lifetimes, most of them had died."), L(Y, "So nobody remembers them?"), L("Miss Sharon", "We remember them. Some Jamaicans are proud of Taino roots."), L("Miss Sharon", "And every time you eat bammy, you eat their bread.")] },
};
export const FLAVOUR = {
  gran: ["Mind the fire, child.", "Bread does not make itself."],
  cousin: ["Strong arms, strong canoe!", "The sea is calm today."],
  cacique: ["A good day to fish.", "Mind the little ones."],
  interp: ["I miss my own island.", "Their words are hard to learn."],
  mendez: ["Paddlers. I need paddlers."],
  runner: ["My legs are tired."],
  guide: ["Take your time.", "Mind the step."],
};
export const SOURCES = {
  ferdinand: { name: "Ferdinand Columbus's history of his father, in Kerr, A General History and Collection of Voyages, vol. 3 (1824)", url: "https://archive.org/details/ageneralhistorya12325gut" },
  mendez: { name: "Diego Mendez's account in his will, in R. H. Major, Select Letters of Christopher Columbus (1870), pages 223 to 235", url: "https://archive.org/details/selectlettersofc00colurich" },
  nasa: { name: "NASA, Five Millennium Catalog of Lunar Eclipses, 1501 to 1600", url: "https://eclipse.gsfc.nasa.gov/LEcat5/LE1501-1600.html" },
  burley: { name: "David V. Burley, A Jamaican Taino Residence at First Spanish Contact, Journal of Caribbean Archaeology 22 (2022)", url: "https://www.floridamuseum.ufl.edu/wp-content/uploads/sites/44/2022/03/JCA-Burley-2022.pdf" },
  seville: { name: "Seville Heritage Park, St Ann's Bay (Archaeology magazine, 2018)", url: "https://archaeology.org/issues/january-february-2018/off-the-grid/trenches-jamaica-seville-heritage-park/" },
};
export const JOURNAL = [
  { id: "you", title: "You and Maima", simple: ["You live in Maima, a Taino village on a hill.", "Below it is the bay the Spanish called Santa Gloria.", "Today it is St Ann's Bay, Jamaica."], deeper: ["You, Grandmother and Cousin are fictional. Your thoughts and your family's talk are imagined.", "Every fact about 1503 and 1504 comes from Spanish writers: Ferdinand Columbus, Diego Mendez and Columbus himself. No Taino account was written down.", "Archaeologists found Maima on the hill above the bay, about a quarter of a league (1.4 km) from where the ships were beached."] },
  { id: "casabe", title: "Cassava bread", simple: ["Cassava bread was the main food of the Taino.", "It was baked in flat cakes on a clay griddle.", "Jamaicans still make it. Today it is called bammy."], deeper: ["The griddle is called a buren. At Maima, pieces of burens were found by the houses.", "The juice of bitter cassava is poisonous. It was squeezed out in a long sack woven of palm leaves, twisted hard.", "Ferdinand Columbus calls the bread 'zabi'. The village of Maima fed the Spanish with it for a year."] },
  { id: "cousin", title: "Cousin", simple: ["Cousin is seventeen, and the best paddler in the village.", "Taino people made canoes from one tree trunk."], deeper: ["Cousin in this game is fictional.", "The words canoe and hammock came into English from Taino languages."] },
  { id: "zemi", title: "Zemis", simple: ["A zemi was a carving that held a spirit.", "The Taino made zemis of wood, stone and shell.", "Grandmother's zemi in this game is imagined."], deeper: ["Three wooden zemis were found in a cave in the Carpenter's Mountains, Jamaica, in June 1792.", "They are carved from guayacan, a very hard wood, polished black. One has a bird-like head with teeth of inlaid shell.", "They are called Bird Man, Boinayel and the Man with the Canopy. They are now in the British Museum in London.", "Jamaica has asked for them back. Plaster copies were given to Jamaica in 1939.", "Taino people used zemis in ceremonies. This game shows the zemi, not the ceremonies."] },
  { id: "ships", title: "The two ships", simple: ["Columbus came to Jamaica in June 1503 with two ships.", "Shipworms had eaten holes in them. They were sinking.", "He ran them onto the sand, side by side."], deeper: ["The ships were La Capitana and the Santiago, called the Bermuda.", "The sailors put straw roofs on the decks and lived there.", "Columbus kept his men on the ships, so they would not take food or quarrel with the villages.", "The ships stood about a bowshot from the shore. The game draws them nearer, so you can see them."] },
  { id: "trade", title: "Trading", simple: ["The Taino paddled out to the ships to trade.", "Two hutias for a piece of tin.", "Cassava bread for two or three glass beads."], deeper: ["A big load of food earned a hawk's bell.", "A cacique might get a red cap, a small mirror or scissors.", "Ferdinand Columbus, the Admiral's son, wrote these prices down. He was about fifteen."] },
  { id: "bell", title: "The hawk's bell", simple: ["A small round bell, made for a hunting bird's leg.", "The Taino had never heard a sound like it."], deeper: ["The Spanish traded hawk's bells all over the Caribbean.", "Some have been found in Taino sites by archaeologists."] },
  { id: "interpreter", title: "The interpreter", simple: ["A Taino man from Hispaniola sailed with the ships.", "He spoke for the Spanish."], deeper: ["He was real, but no record gives his name.", "His words in this game are imagined, except where he passes on what the Admiral said. That part follows Ferdinand Columbus's account.", "His shirt is imagined too."] },
  { id: "mendez", title: "Diego Mendez", simple: ["Diego Mendez was real. He was Columbus's secretary.", "He offered to cross the sea in a canoe to get help."], deeper: ["His words in this game are imagined. In real life he spoke Spanish, and the interpreter passed his words on.", "Mendez wrote about the journey years later, in his will.", "He traded a brass helmet, a coat and a shirt for a good canoe.", "He and a cacique called Ameyro swapped names, as a sign of friendship."] },
  { id: "paddlers", title: "The paddlers", simple: ["In July 1503 two canoes set off for Hispaniola.", "Each had six Spaniards and ten Taino paddlers.", "No paddler's name was written down."], deeper: ["Bartholomew Fieschi led the second canoe. Columbus's brother saw them off from the east end of Jamaica.", "Mendez's own account is different. He says he tried twice, the first time with six Taino.", "The record does not say that any paddler came home. We do not know what happened to them."] },
  { id: "navassa", title: "The crossing", simple: ["It was very hot, and the water ran out.", "One paddler died of thirst.", "Then the moon rose behind a little island, Navassa."], deeper: ["On Navassa they found rainwater in holes in the rock.", "Some paddlers drank too much and died. Others were sick.", "The next day they reached Hispaniola. Nobody would paddle back to Jamaica.", "This is what Mendez told Ferdinand Columbus, who wrote it down."] },
  { id: "mutiny", title: "The ten canoes", simple: ["On 2 January 1504, 48 Spaniards turned against Columbus.", "They took ten canoes and went east.", "They tried to cross the sea, but the waves turned them back."], deeper: ["Their leaders were two brothers named Porras.", "At sea they were cruel to their Taino paddlers. Eighteen paddlers died.", "Then they walked from village to village, taking food by force."] },
  { id: "cacique", title: "The cacique", simple: ["A cacique was a leader of a village or of many villages.", "The word cacique comes from the Taino."], deeper: ["Maima had a cacique, but no record gives his name. His words here are imagined.", "Ferdinand Columbus wrote that one Spaniard ate as much in a day as a Taino ate in twenty."] },
  { id: "eclipse", title: "The red moon", simple: ["On 29 February 1504 the moon went dark and red.", "Columbus knew it would happen. He read it in a book of tables.", "He said it was his God's anger."], deeper: ["The book was an almanac: it showed when eclipses would happen.", "The moon rose already darkened. People came running with food.", "Ferdinand Columbus wrote that the Taino had seen eclipses before. What frightened them was a man who knew it beforehand.", "NASA's tables say this eclipse was total, and that the moon was dark for about 48 minutes."] },
  { id: "fight", title: "The fight on the hill", simple: ["In May 1504 the Spaniards who had left came back.", "They fought Columbus's brother's men near Maima."], deeper: ["Ferdinand Columbus wrote that the Taino stood armed and watched, and took neither side.", "Some Spaniards were killed. The rest asked to be forgiven."] },
  { id: "rescue", title: "The ship from Hispaniola", simple: ["Diego Mendez bought a ship on Hispaniola and sent it.", "On 28 June 1504 everyone sailed away."], deeper: ["They had been in Jamaica for a little more than a year.", "The old ships were left on the sand of St Ann's Bay."] },
  { id: "today", title: "Seville Heritage Park", simple: ["Today the hill is Seville Heritage Park, in St Ann.", "It has the remains of Maima, a Spanish town and a later estate."], deeper: ["Miss Sharon, the guide, is fictional.", "The Jamaica National Heritage Trust looks after the park.", "Today it has model Taino houses, a museum in the old Great House, and the ruins of the Spanish town.", "A UNESCO plaque there says Columbus and his son Fernando found refuge here from June 1503 to June 1504.", "The museum says New Seville \"has seen continuous habitation for over one thousand years\".", "Archaeologists dug at Maima in 2014 and 2015."] },
  { id: "house", title: "A Taino house", simple: ["The house that was dug up was round, about 4 metres across.", "One pole held up the middle of the roof.", "A family lived in it."], deeper: ["The houses stood on flat steps cut into the hill.", "The door faced west, away from the wind.", "The cooking was done outside, away from the house."] },
  { id: "words", title: "Words from the Taino", simple: ["Canoe, hammock, hurricane and barbecue come from Taino words.", "So does cacique.", "Xaymaca was the Taino name for Jamaica."], deeper: ["Xaymaca is often said to mean land of wood and water.", "The Taino had important beliefs and ceremonies. This game does not show them, out of respect."] },
  { id: "clothes", title: "What people wore", simple: ["The weather was warm, and people wore very little.", "Married women wore a short cotton skirt."], deeper: ["In this game every Taino person wears a little more cotton than the old records describe. This was chosen for a children's game.", "People also painted their skin, red and black, on special days."] },
];
export const CARDS = {
  arrival: { title: "Two ships", lines: ["Two broken ships sail slowly into the bay.", "Their crews run them onto the sand."], scary: false },
  trade: { title: "Out to the ships", lines: ["Cousin paddles the bread out to the ships.", "Sailors lean over the side to trade."], scary: false },
  depart: { title: "The canoes set off", lines: ["At dawn the two canoes set off along the coast.", "Cousin is in one of them."], scary: false },
  crossing: { title: "What Mendez wrote", lines: ["The canoes cross the open sea toward Hispaniola.", "Mendez wrote that it was very hot, and the water ran out.", "One paddler died of thirst. Nothing is shown."] },
  mutiny: { title: "Shouting on the ships", lines: ["Far below, men shout on the ships.", "They take ten canoes and paddle away east.", "Nobody is hurt in this scene."], scary: false },
  moon: { title: "The red moon", lines: ["The full moon rises dark, and turns deep red.", "People are frightened. Nobody is hurt."], scary: false },
  leave: { title: "The ships sail", lines: ["The new ship sails away with all the strangers.", "The old wrecks stay on the sand."], scary: false },
  end: { title: "Xaymaca", lines: ["For a year, the people of Maima fed the strangers on those ships.","The written accounts we have come from the Spanish.","Here in Jamaica, part of the story is still with us.","Every time we eat bammy, we taste something the Taíno passed down."] },
};
export const FILMS = {
  /* Ferdinand: 25 or 26 June 1503, from Puerto Bueno to Santa Gloria; the ships run ashore "board and board", shored up on both sides,
     water almost to the decks. Seen from the hill at Maima. */
  arrival: {
    place: "maima", next: 10, journal: "ships", title: "Two ships",
    read: ["In June 1503 two worm-eaten ships came slowly into the bay below Maima. They were sinking.", "Their crews ran them onto the sand, side by side, and propped them up so they could not fall over."],
    captions: [[0,"Maima, on the hill above the bay. June 1503."],[6,"Something is coming around the point.","arrival-01"],[11,"Two ships. Their sails are torn, and they’re riding low in the water.","arrival-02"],[17,"They sit low in the water. They are sinking."],[23,"Watch. The sailors are steering them straight onto the sand.","arrival-03"],[29,"Side by side, and propped up with poles."]],
    shots: [{ t: 0, p: [3, 2.2, -8], look: [-60, -30, -250] }, { t: 10, p: [1, 1.8, -9.3], look: [-50, -36, -232] }, { t: 20, p: [0.5, 1.7, -9.6], look: [-14, -37, -198] }, { t: 28, p: [0.3, 1.6, -9.6], look: [-6, -36, -192] }, { t: 35, p: [-1.5, 2.2, -6], look: [-6, -34, -192] }],
    fov: [[0, 40], [10, 22], [20, 12], [28, 9], [33, 30]],
    acts: [],
    sounds: [[0.3, "begin"], [8, "gull"], [24, "creak"]],
    duration: 35,
  },
  /* Ferdinand: the Taino "came in their canoes to sell provisions"; two men appointed to buy; prices in tin, beads and hawk's bells. */
  trade: {
    place: "shore", next: 24, journal: "trade", title: "Out to the ships",
    read: ["The Taino paddled out to the ships with food. Two men on the ships did all the buying.", "Two hutias bought a piece of tin. Cassava bread bought two or three glass beads. A big load earned a hawk's bell."],
    captions: [[0, "Cousin pushes the canoe out."], [5, "Out to the ships, with the bread."], [11, "Sailors lean over the side."], [16, "Bread for beads. Red and yellow glass."], [22, "And for a big basket, a little bell."]],
    shots: [{ t: 0, p: [6, 1.8, 1], look: [3, 0, -4] }, { t: 5, p: [5, 1.6, -4], look: [3, 0, -14] }, { t: 11, p: [9, 2.4, -16], look: [4, 1, -30] }, { t: 16, p: [10, 2.0, -21], look: [5, 1.0, -30] }, { t: 22, p: [10.5, 1.6, -22], look: [5.5, 0.3, -29.5] }, { t: 28, p: [7, 2, -12], look: [2, 0.5, -20] }],
    fov: [[0, 50], [11, 44], [16, 36], [22, 40], [28, 48]],
    acts: [],
    sounds: [[0.3, "begin"], [5, "oars"], [7, "oars"], [9, "oars"], [11, "oars"], [14, "gull"], [17, "creak"], [21, "oars"], [23, "oars"]],
    duration: 28,
  },
  /* Ferdinand: July 1503, two canoes, along the coast to the east point; the lieutenant guarded them and watched them go. */
  depart: {
    place: "shore", next: 36, journal: "paddlers", title: "The canoes set off",
    read: ["In July 1503 two canoes left St Ann's Bay. Each had six Spaniards and ten Taino paddlers.", "They went east along the coast to the end of the island, to wait for a calm sea."],
    captions: [[0, "Dawn. The two canoes are ready."], [5, "Six Spaniards and ten paddlers in each."], [11, "They push off from the sand."], [17, "East along the coast, to the end of the island."], [23, "Cousin does not look back."]],
    shots: [{ t: 0, p: [2, 1.6, 3], look: [1, 0.3, -4.5] }, { t: 6, p: [-3, 1.8, 1], look: [2, 0, -5] }, { t: 12, p: [8, 2, -1], look: [12, 0, -12] }, { t: 18, p: [12, 2.5, 0], look: [60, 0, -16] }, { t: 24, p: [13, 2.4, 1], look: [110, 1, -20] }, { t: 29, p: [13, 2.4, 1], look: [140, 1, -21] }],
    fov: [[0, 46], [6, 46], [12, 40], [18, 30], [24, 24]],
    acts: [],
    sounds: [[0.3, "begin"], [9, "oars"], [11, "oars"], [13, "oars"], [15, "gull"], [17, "oars"]],
    duration: 29,
  },
  /* Ferdinand, from Mendez's letter: heat, thirst, the second night, the moon rising behind Navassa "in the nature of an eclipse". */
  crossing: {
    place: "crossing", next: 40, journal: "navassa", title: "What Mendez wrote",
    read: ["Out on the open sea it was very hot. The paddlers jumped in the water to cool off. Soon the drinking water was gone.", "On the second night the moon rose behind a tiny island. It was Navassa. There they found rainwater in the rocks."],
    captions: [[0,"This is what Diego Mendez later wrote."],[5,"Diego Méndez later wrote that their drinking water ran out.","crossing-01"],[10,"So hot. The water is gone too soon."],[16,"The second night. Everyone is weak."],[22,"On the second night, the moon rose behind a little island.","crossing-02"],[28,"Navassa.","crossing-03"],[34,"Did Cousin reach it? Nobody wrote it down.","crossing-04"]],
    shots: [{ t: 0, p: [5, 1.4, 9], look: [0, 0.2, 4] }, { t: 8, p: [-4, 1, 8], look: [0, 0.2, 4] }, { t: 15, p: [3.4, 1.0, 10.2], look: [0, 0.3, 3] }, { t: 20, p: [1, 1.2, 10], look: [0, 4, -600] }, { t: 30, p: [1, 1.2, 10], look: [0, 12, -800] }, { t: 36, p: [3, 1.6, 9], look: [0, 10, -800] }, { t: 40, p: [6, 2, 12], look: [0, 3, -300] }],
    fov: [[0, 46], [8, 46], [15, 40], [20, 22], [30, 16], [36, 26], [40, 40]],
    acts: [],
    sounds: [[0.3, "begin"], [3, "oars"], [6, "oars"], [9, "splash"], [13, "oars"], [26, "oars"]],
    duration: 40,
  },
  /* Ferdinand: 2 January 1504, 48 men under the Porras brothers seize ten canoes and go east. Seen far off, from the hill. */
  mutiny: {
    place: "maima", next: 42, journal: "mutiny", title: "Shouting on the ships",
    read: ["On 2 January 1504 a crowd of Spaniards shouted against their leader. Forty-eight of them took ten canoes and paddled away east.", "Nobody was hurt that day."],
    captions: [[0, "January 1504. Shouting down on the ships."], [6, "Men climb down into the canoes."], [12, "Ten canoes. Our people made them."], [18, "They paddle away east."]],
    shots: [{ t: 0, p: [0.5, 1.7, -9.4], look: [-6, -36, -192] }, { t: 6, p: [0.5, 1.7, -9.4], look: [14, -37, -190] }, { t: 12, p: [0.6, 1.7, -9.3], look: [68, -37, -198] }, { t: 18, p: [1, 1.8, -9], look: [150, -37, -210] }, { t: 24, p: [2, 2.2, -7], look: [180, -36, -214] }],
    fov: [[0, 10], [6, 9], [12, 14], [18, 18], [24, 28]],
    acts: [[2, "gran", "HeadTurn"]],
    sounds: [[0.3, "begin"], [3, "drum"], [8, "oars"], [12, "oars"]],
    duration: 24,
  },
  /* Ferdinand: the moon rose "in part obscured, and the obscurity increasing as she rose higher"; people came "from all parts loaded
     with provisions"; the Admiral shut himself in his cabin until it was about to end. NASA: total, about 48 minutes. */
  moon: {
    place: "night", next: 55, journal: "eclipse", title: "The red moon",
    read: ["That evening the full moon rose already darkened. As it climbed, the shadow grew, until the moon was a dull red.", "People hurried down to the ships with food. Later the shadow slid away, and the moon was white again."],
    captions: [[0,"The night of 29 February 1504."],[5,"The moon is rising. Something is wrong with it."],[11,"Look at the edge of the moon. The shadow is growing.","red-moon-01"],[17,"The shadow grows."],[23,"Now it’s red. Red as a coal.","red-moon-02"],[29,"People run down the path with food."],[36,"And slowly, slowly, the shadow slides away."]],
    shots: [{ t: 0, p: [1.6, 1.5, -7.5], look: [260, -25, -420] }, { t: 8, p: [1.6, 1.5, -7.6], look: [255, 0, -418] }, { t: 16, p: [1.6, 1.5, -7.8], look: [248, 40, -412] }, { t: 23, p: [1.6, 1.5, -7.8], look: [238, 120, -404] }, { t: 29, p: [0, 1.6, -4], look: [-5, 0.8, -9] }, { t: 36, p: [1.6, 1.5, -8], look: [232, 155, -400] }, { t: 44, p: [2, 1.7, -6], look: [230, 160, -400] }],
    fov: [[0, 30], [8, 16], [16, 10], [23, 9], [29, 50], [36, 10], [44, 18]],
    acts: [[12, "gran", "Point"], [16, "gran", "Idle"]],
    sounds: [[0.3, "begin"], [6, "fire"], [18, "drum"], [30, "fire"]],
    duration: 44,
  },
  /* Ferdinand: the ship sent by Mendez; all sailed on 28 June 1504; the beached ships stayed. */
  leave: {
    place: "maima", next: 64, journal: "rescue", title: "The ships sail",
    read: ["On 28 June 1504 the new ship sailed away, with every one of the strangers on board.", "The two old ships stayed on the sand, where they had been for a year."],
    captions: [[0, "28 June 1504."], [5, "The new ship lifts its sails."], [11, "Every stranger is on board."], [17, "The old ships stay on the sand."], [23, "The bay is quiet again."]],
    shots: [{ t: 0, p: [0.5, 1.7, -9.4], look: [14, -33, -230] }, { t: 10, p: [0.5, 1.7, -9.4], look: [40, -33, -262] }, { t: 18, p: [0.6, 1.7, -9.3], look: [90, -33, -320] }, { t: 23, p: [0.5, 1.7, -9.4], look: [-6, -36, -192] }, { t: 29, p: [0, 2.5, -5], look: [0, -36, -192] }],
    fov: [[0, 9], [10, 10], [18, 12], [23, 9], [29, 30]],
    acts: [],
    sounds: [[0.3, "begin"], [6, "creak"], [14, "gull"]],
    duration: 29,
  },
};
export const QUIZ = {
  title: "What do you remember?",
  items: [
    { q: "Why did Columbus run his ships onto the sand?", opts: [{ t: "They were sinking", ok: true }, { t: "He wanted to build a town" }, { t: "A storm threw them there" }], why: "Shipworms had eaten holes in them." },
    { q: "What did the Taino trade for glass beads?", opts: [{ t: "Gold" }, { t: "Cassava bread", ok: true }, { t: "Horses" }], why: "Two or three beads bought a cake of cassava bread." },
    { q: "How many Taino paddlers went in each canoe?", opts: [{ t: "Two" }, { t: "Ten", ok: true }, { t: "Fifty" }], why: "Ten paddlers and six Spaniards in each canoe." },
    { q: "Why did the moon turn red?", opts: [{ t: "It was an eclipse", ok: true }, { t: "Columbus made it" }, { t: "A fire on the hill" }], why: "Columbus only knew it was coming from a book of tables." },
    { q: "What Jamaican food comes from Taino cassava bread?", opts: [{ t: "Ackee" }, { t: "Bammy", ok: true }, { t: "Patty" }], why: "Bammy is cassava bread, as the Taino made it." },
  ],
};
