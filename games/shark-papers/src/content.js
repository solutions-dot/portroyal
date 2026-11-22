/* Every word the player reads. Michael Fitton, Hugh Wylie and Thomas Briggs were real. Everyone else is fictional and their journal
   page says so. Facts and sources: docs/games/shark-papers.md. */
export const TITLE = "The Shark Papers";
export const GAME = {
  id: "shark-papers",
  eye: 1.3,
  title: { place: "deck", pos: [2.5, 2.6, 10.2], look: [-0.6, 2.4, -3] },
  fiction: "You are Jem, the ship's boy, aged twelve. You are fictional. The shark, the papers and the two officers were real.",
  recap: [
    { icon: "🦈", label: "The shark", page: "shark", img: "recap/shark.jpg" },
    { icon: "📜", label: "The papers", page: "papers", img: "recap/papers.jpg" },
    { icon: "⚖️", label: "The court", page: "court", img: "recap/court.jpg" },
  ],
};
export const CHAPTERS = [
  { id: "jacmel", name: "Off Jacmel", year: "August 1799", first: 8, last: 18, place: "deck", caption: "The schooner Ferret · off Jacmel, August 1799", intro: "It is dawn on the schooner Ferret. There is no wind, and the sea is full of sharks." },
  { id: "bundle", name: "What the shark held", year: "August 1799", first: 20, last: 27, place: "deck", caption: "The schooner Ferret · off Jacmel", intro: "The shark lies on the deck. Two of the men open it, to get the pork back." },
  { id: "portroyal", name: "Port Royal", year: "September 1799", first: 30, last: 36, place: "quay", caption: "The dockyard, Port Royal, Jamaica · September 1799", intro: "The Ferret is home. The brig Nancy is here too, waiting for the court." },
  { id: "court", name: "The court in Kingston", year: "Autumn 1799", first: 40, last: 48, place: "court", caption: "The Court of Vice-Admiralty · Kingston, 1799", intro: "Mr Fitton has carried the papers across the harbour to Kingston." },
];
export const chapterOf = (stage) => Math.max(0, CHAPTERS.findIndex((c) => stage >= c.first && stage <= c.last));
export const PEOPLE = { fitton: "Mr Fitton", wylie: "Mr Wylie", cato: "Mr Cato", ben: "Ben", clerk: "The clerk" };
const L = (who, text) => ({ who, text });
export const TALK = {
  10: { cato: [L("Mr Cato", "Morning, Jem. Not a breath of wind today."), L("You", "Why are there so many sharks?"), L("Mr Cato", "A dead bullock is floating out there."), L("Mr Cato", "Sharks can smell a meal from far away."), L("Mr Cato", "Now, to work. Go and ring the ship's bell.")] },
  13: { fitton: [L("Mr Fitton", "Mr Wylie of the Sparrow is coming to breakfast."), L("Mr Fitton", "His boat has a long pull. So we shall fish."), L("You", "For a shark, sir?"), L("Mr Fitton", "For the biggest one. I tried beef. It would not bite."), L("Mr Fitton", "Take my glass first. Look at the Sparrow."), L("Mr Fitton", "Then fetch the salt pork, Jem. Sharks like pork.")] },
  20: { cato: [L("Mr Cato", "There he lies. The biggest shark I ever saw."), L("You", "Why did the men open him?"), L("Mr Cato", "To get the pork back. Good pork, that."), L("Mr Cato", "But they found something else in there."), L("Mr Cato", "Go and look, Jem.")] },
  22: { fitton: [L("Mr Fitton", "A bundle of papers, tied round with string."), L("Mr Fitton", "Here is a letter from Curacao. It names a brig."), L("Mr Fitton", "The American brig Nancy."), L("You", "Who throws papers into the sea, sir?"), L("Mr Fitton", "Someone with something to hide."), L("Mr Fitton", "The men are laying them out to dry."), L("Mr Fitton", "Take the letter to the hatch, Jem.")] },
  26: { wylie: [L("Mr Wylie", "A long pull, Fitton! Is breakfast ready?"), L("Mr Fitton", "What luck have you had, Wylie?"), L("Mr Wylie", "I have stopped an American brig."), L("Mr Fitton", "Was she named Nancy?"), L("Mr Wylie", "She was! How do you know that?")] },
  27: { fitton: [L("Mr Fitton", "“The shark you see lying there has brought me full information of your brig.”"), L("You", "Her papers are drying on the hatch, sir."), L("Mr Wylie", "“There’s a lie somewhere, Fitton, not far off, for I sealed all her papers up.”"), L("Mr Fitton", "You sealed up her false papers, Wylie."), L("Mr Fitton", "These are her true ones. The shark brought them."), L("Mr Wylie", "“Breakfast, ho!”"), L("You", "He does not believe us!"), L("Mr Fitton", "He will, Jem. The court will read them.")] },
  30: { ben: [L("Ben", "Mind the rope, young one. You off the Ferret?"), L("You", "Yes. I am Jem. Do you work on the ships?"), L("Ben", "I load them. A man says he owns me."), L("Ben", "He hires me out and keeps the pay."), L("Ben", "Most hands on this quay are Black. Free or not."), L("You", "What is that great ship out there?"), L("Ben", "The guard ship. Go to the edge and look.")] },
  34: { ben: [L("You", "Ben, what is a prize?"), L("Ben", "A ship taken in war. Britain is at war with France."), L("Ben", "With Spain and the Dutch too. Americans are not in it."), L("Ben", "So an American ship may pass. Unless she carries enemy goods."), L("You", "And who decides?"), L("Ben", "A court. In Kingston, across the harbour.")] },
  35: { fitton: [L("Mr Fitton", "There you are, Jem. You have seen the Nancy?"), L("You", "Yes, sir. Her hatch is sealed."), L("Mr Fitton", "Her master swears she is American. We know better."), L("Mr Fitton", "The shark's papers must go to the court."), L("Mr Fitton", "A boat waits at the steps. Carry my box down.")] },
  40: { clerk: [L("The clerk", "Quiet, boy. This is the Court of Vice-Admiralty."), L("You", "Is the captain on trial?"), L("The clerk", "No. The ship is. Is she a lawful prize, or not?"), L("The clerk", "Her master swore she is American and neutral."), L("The clerk", "Bring the shark's papers to the table."), L("The clerk", "Then read both sets.")] },
  46: { fitton: [L("Mr Fitton", "The court has decided. She is a lawful prize."), L("You", "Because of our shark."), L("Mr Fitton", "Because someone lied, and the sea gave it back."), L("You", "What happens to the Nancy now, sir?"), L("Mr Fitton", "She and her cargo will be sold."), L("Mr Fitton", "Mr Wylie and the Sparrow's men share the money."), L("Mr Fitton", "Well done, Jem. You dried those papers well.")] },
};
export const FLAVOUR = {
  cato: ["Keep one hand for the ship, Jem.", "A tidy deck is a safe deck."],
  fitton: ["A sharp lookout, there.", "Not a breath of wind."],
  wylie: ["A fine morning for it."],
  ben: ["Heavy work, in this sun.", "Ships come, ships go."],
  clerk: ["Hush, now.", "Stand by the wall."],
};
export const SOURCES = {
  usj: { name: "Michael Fitton's own account, United Service Journal, February 1835, pages 276 to 278", url: "https://archive.org/details/in.ernet.dli.2015.21617" },
  gleaner: { name: "Jamaica Gleaner, Pieces of the Past: The Shark Papers", url: "https://old.jamaica-gleaner.com/pages/history/story0042.htm" },
  nlj: { name: "National Library of Jamaica: the Shark Papers", url: "https://nlj.gov.jm/exhibition/shark/" },
  stark: { name: "Stark's Jamaica Guide, 1898, pages 60 to 63: the Shark Papers, from the documents then at the Institute of Jamaica", url: "https://archive.org/details/starksjamaicagui00star" },
  dnb: { name: "Dictionary of National Biography: Michael Fitton", url: "https://en.wikisource.org/wiki/Dictionary_of_National_Biography,_1885-1900/Fitton,_Michael" },
  sparrow: { name: "HMS Sparrow (1796)", url: "https://en.wikipedia.org/wiki/HMS_Sparrow_(1796)" },
  burnard: { name: "Trevor Burnard, Slaves and Slavery in Kingston, 1770 to 1815", url: "https://www.cambridge.org/core/journals/international-review-of-social-history/article/slaves-and-slavery-in-kingston-17701815/A7E958558A63A7DC296C3892960B09ED" },
};
export const JOURNAL = [
  { id: "you", title: "Jem and the Ferret", simple: ["You are Jem, twelve, ship's boy on the schooner Ferret.", "The Ferret is a small Navy ship with two masts and six guns.", "She sails from Port Royal, Jamaica."], deeper: ["Jem in this game is fictional. Mr Cato in this game is fictional.", "A record of the time gives her 6 three-pounder guns and 45 men.", "No drawing of the Ferret is known. The ship in the game is a general picture of a small Navy schooner.", "In Fitton's own account, Mr Wylie grumbles that there was “not a breath of air” that morning."], source: "dnb" },
  { id: "fitton", title: "Michael Fitton", simple: ["Michael Fitton was real. He commanded the Ferret.", "He was about 33, from Cheshire in England."], deeper: ["The words Mr Fitton says in this game are imagined, except the line about the shark, which he wrote down himself years later.", "His own account was printed in the United Service Journal in February 1835.", "In 1799 he was an acting lieutenant. He was made a full lieutenant in 1804."], source: "usj" },
  { id: "sparrow", title: "The cutter Sparrow", simple: ["The Sparrow was a Navy cutter. A cutter has one mast.", "She was 123 tons and about 66 feet long.", "Hugh Wylie commanded her."], deeper: ["She had 40 men. One record gives her 10 short guns called carronades and 2 six-pounders. Fitton remembered ten six-pounders.", "Fitton wrote that at dawn she was about six miles in shore. The game draws her nearer, so you can see her.", "He asked Mr Wylie to breakfast by signal."], source: "sparrow" },
  { id: "shark", title: "The shark", simple: ["In August 1799, off Jacmel, sharks were feeding on a dead bullock.", "Fitton caught the biggest on a hook and line.", "It would not take beef. It took pork."], deeper: ["Jacmel is in Haiti, which was then the French colony of Saint-Domingue.", "Fitton wrote that he let the shark run on about 60 fathoms of line, then had it hoisted in. A fathom is six feet.", "Nobody wrote down what kind of shark it was. The shark in the game is a plain large shark.", "Fitton's sworn paper of 24 September 1799 gives the day as 13 August. Later accounts say 30 August. Nobody is sure which is right."], source: "usj" },
  { id: "papers", title: "The papers", simple: ["Inside the shark was a bundle of papers tied round with a string.", "The crew spread them out on the deck to dry.", "They were letters, bills and receipts from the brig Nancy."], deeper: ["Fitton wrote that the papers were whole, except the outside wrapper.", "The sailor who handed them over joked that he hoped there was a letter from his sweetheart.", "One letter was dated at the island of Curacao.", "The letters were in French and German. They showed who really owned the cargo.", "The papers are kept today in the National Library of Jamaica, in Kingston."], source: "nlj" },
  { id: "breakfast", title: "Breakfast with Mr Wylie", simple: ["Hugh Wylie was real. He came across by boat for breakfast.", "He told Fitton he had stopped an American brig.", "He had sealed up her papers. They were the false ones."], deeper: ["The words Mr Wylie says in this game are imagined, except his line about a lie and “Breakfast, ho!”, which Fitton wrote down years later.", "Fitton spelt his name Whylie.", "Fitton wrote that Wylie stared at him, at the shark and at the papers, then went down to breakfast."], source: "usj" },
  { id: "portroyal", title: "Port Royal", simple: ["Port Royal was the Navy's base in Jamaica.", "Much of the work on the ships and quays was done by Black people.", "Many were enslaved: forced to work, unpaid, not free to leave."], deeper: ["Ben in this game is fictional.", "Enslaved men were often hired out by the people who claimed to own them, as sailors and dock workers.", "In 1788 Kingston had 16,659 enslaved people among 26,478.", "The dockyard in the game is a general picture of a Navy yard of the time."], source: "burnard" },
  { id: "abergavenny", title: "HMS Abergavenny", simple: ["HMS Abergavenny was the guard ship at Port Royal.", "She was the flagship there from 1796 to 1807.", "The Ferret was her tender: a small ship that worked for a big one."], deeper: ["Michael Fitton was acting lieutenant of the Abergavenny from 11 January 1799.", "The ship in the game is a general picture of a ship with two decks of guns."], source: "dnb" },
  { id: "nancy", title: "The brig Nancy", simple: ["The Nancy was an American brig of 125 tons.", "She left Baltimore on 3 July 1799. Her master was Thomas Briggs.", "The Sparrow took her on 28 August, near Haiti."], deeper: ["Thomas Briggs does not speak in this game.", "Her owners were Germans who had become American citizens. Her crew were Swedes and Danes.", "On the way she called at the island of Aruba. Briggs went to Curacao and came back with Mr Schultz, the owners' agent.", "No picture of the Nancy is known. The brig in the game is a general picture of a brig of her time.", "A brig has two masts with square sails.", "A ship held for the court was kept shut and sealed until the court decided."], source: "stark" },
  { id: "prize", title: "What is a prize?", simple: ["In war, a navy ship could take a ship carrying an enemy's goods.", "A court then decided if that was lawful.", "If it was, the ship was sold and the crew shared the money."], deeper: ["In 1799 Britain was at war with France, Spain and the Netherlands.", "America was neutral. Its ships could trade, but not hide an enemy's goods."], source: "gleaner" },
  { id: "court", title: "The court", simple: ["The Court of Vice-Admiralty sat in Kingston.", "The Nancy's master swore she was American and neutral.", "Then Fitton brought the papers from the shark."], deeper: ["The clerk in this game is fictional. The room is a general picture of a court room of the time.", "No source names the judge, so the judge's chair in the game is empty.", "The court stood at the corner of Harbour Street and Hanover Street.", "Fitton swore to the shark's papers on 24 September 1799.", "More papers were found hidden on the Nancy: in the captain's cabin, and in a cask of salt pork.", "On 25 November 1799 the Nancy and her cargo were judged a lawful prize. One source says 28 November."], source: "gleaner" },
  { id: "jaws", title: "The jaws", simple: ["Fitton sent the shark's jaws to the court.", "His note said: “Lieut. Fitton recommends these jaws for a collar for neutrals to swear through.”"], deeper: ["He meant: a warning to ship masters who swear to lies.", "In 1835 a magazine wrote that the jaws were still kept in the court in Jamaica.", "In 1898 a guide book said the shark's head was in a museum in London.", "Nobody is sure where the jaws are today."], source: "usj" },
  { id: "today", title: "The Shark Papers today", simple: ["You can still see the papers in Kingston.", "They were stolen in the 1907 earthquake, and given back."], deeper: ["They are in the National Library of Jamaica, numbered MS 165.", "Some retellings put the court in Spanish Town or Port Royal. It was in Kingston."], source: "nlj" },
];
export const CARDS = {
  dawn: { title: "Dawn off Jacmel", lines: ["The Ferret lies still on a flat sea, with no wind at all.", "Far off, sharks are feeding on a dead bullock."], scary: false },
  catch: { title: "The catch", lines: ["Mr Fitton hooks the biggest shark, and all hands haul it on board.", "Nobody is hurt."], scary: false },
  alongside: { title: "A boat in the calm", lines: ["The papers dry on the hatch.", "Mr Wylie's boat rows across the flat sea to breakfast."], scary: false },
  verdict: { title: "The court decides", lines: ["The court in Kingston decides about the brig Nancy.", "Mr Fitton's shark jaws stand by the wall."], scary: false },
  end: { title: "The Shark Papers", lines: ["A ship's master threw his papers into the sea.", "A shark swallowed them. A sailor caught the shark.", "The papers reached the court, and the truth came out.", "You can still see them in Kingston today."] },
};
export const FILMS = {
  /* Fitton's own account (1835): off Jacmel at dawn, the Sparrow "about six miles in shore", asked to breakfast by signal; a dead bullock
     "floating at some distance, which the sharks were tearing". */
  dawn: {
    place: "deck", next: 10, journal: "you", title: "Dawn off Jacmel",
    read: ["At dawn the Ferret lay still off Jacmel, on the south side of Saint-Domingue. There was no wind at all.", "Far off, sharks were feeding on a dead bullock. The cutter Sparrow lay about six miles in shore, and Mr Fitton asked Mr Wylie to breakfast by signal."],
    captions: [[0, "Dawn, off Jacmel, August 1799."], [6, "The schooner Ferret lies still. Her sails hang empty."], [12.5, "Far off, something floats on the sea."], [17, "A dead bullock. Sharks are feeding on it."], [23, "About six miles in shore lies the cutter Sparrow."], [29, "Mr Fitton signals to her: come to breakfast!"]],
    shots: [{ t: 0, p: [-30, 2.0, -24], look: [0, 3.2, 0] }, { t: 7, p: [-24, 3.0, 13], look: [0, 4, 0] }, { t: 13, p: [-14, 2.6, 22], look: [-46, -1.0, 44] }, { t: 18, p: [-33, 1.0, 32.5], look: [-46, -1.4, 44] }, { t: 21.5, p: [-35, 0.9, 34], look: [-46, -1.4, 44] }, { t: 25, p: [7.5, 3.6, 12.5], look: [205, 1.5, -46] }, { t: 28.5, p: [7.0, 3.5, 12.0], look: [205, 1.5, -46] }, { t: 31, p: [2.0, 2.1, 6.0], look: [0.9, 1.45, 8.35] }, { t: 34, p: [1.8, 2.0, 6.3], look: [0.9, 1.45, 8.35] }],
    fov: [[0, 44], [7, 46], [13, 36], [18, 40], [21.5, 38], [24, 22], [25, 16], [28.5, 16], [31, 50], [34, 48]],
    acts: [[28.5, "fitton", "Point"], [31.5, "fitton", "IdleM"]],
    sounds: [[0.3, "begin"], [3, "creak"], [9, "gull"], [16, "splash"], [21, "gull"], [27, "creak"]],
    duration: 34,
  },
  catch: {
    place: "deck", next: 20, journal: "shark", title: "The catch",
    read: ["The biggest shark took the pork. Mr Fitton let it run on sixty fathoms of line until it was tired.", "Then all hands hauled together, and the shark was hoisted over the side and on to the deck."],
    captions: [[0, "Mr Fitton waits at the stern. The pork is on the hook."], [5, "The line goes tight!"], [7.5, "He lets the shark run. Sixty fathoms of line!"], [11, "“All hands!” Everybody hauls together."], [14.5, "Up it comes, over the side."], [20.5, "There it lies: the biggest shark of all."]],
    shots: [{ t: 0, p: [3.6, 3.2, 12.6], look: [-1.6, 0.6, 9.2] }, { t: 5, p: [1.9, 2.3, 7.2], look: [-3.4, -0.8, 11.5] }, { t: 10.5, p: [1.6, 1.9, 2.4], look: [-1.5, 1.0, 7.0] }, { t: 14.5, p: [-6.4, 1.2, 3.6], look: [-2.9, 0.2, 8.3] }, { t: 19.5, p: [1.9, 2.7, 4.3], look: [-1.3, 0.3, 6.8] }, { t: 26, p: [1.5, 2.3, 3.6], look: [-1.2, 0.4, 6.6] }],
    fov: [[0, 50], [5, 44], [10.5, 52], [14.5, 48], [26, 44]],
    acts: [],
    sounds: [[0.5, "begin"], [5, "drum"], [13.6, "drum"], [20.3, "drum"]],
    duration: 26,
  },
  /* Fitton (1835): the papers dried on deck; the masthead's call "There's nothing in sight, Sir, but the Sparrow cutter in shore, and her
     boat pulling on board"; Wylie's "devil of a long pull" with "not a breath of air out of the heavens". */
  alongside: {
    place: "deck", next: 26, journal: "breakfast", title: "A boat in the calm",
    read: ["The papers from the shark lay drying on the hatch. The man at the masthead saw the Sparrow's boat pulling across.", "There was no wind, so Mr Wylie's men rowed all the way, and at last the boat came alongside for breakfast."],
    captions: [[0, "The papers lie drying on the hatch, one by one."], [5, "Not a breath of wind. The sea is flat."], [9.5, "The lookout at the masthead calls down."], [12.5, "“...the Sparrow cutter in shore, and her boat pulling on board.”"], [18, "Mr Wylie's men row on and on."], [24, "Breakfast waits below. The papers dry in the sun."], [29, "The boat is alongside. What a long pull!"]],
    shots: [{ t: 0, p: [1.5, 1.85, 2.5], look: [0, 0.45, 1.1] }, { t: 4.5, p: [1.6, 1.9, 2.4], look: [0.1, 0.45, 1.1] }, { t: 9, p: [2.0, 2.3, 1.4], look: [12, 0.2, -1.4] }, { t: 14, p: [2.1, 2.5, 0.9], look: [33.5, -1.2, -3.1] }, { t: 20, p: [2.1, 2.6, 0.9], look: [19.1, -1.2, 0.15] }, { t: 25, p: [1.5, 1.9, 2.5], look: [0, 0.45, 1.1] }, { t: 29.5, p: [8, 2.8, 7.5], look: [3.0, -0.2, 2.0] }, { t: 34, p: [8.6, 2.6, 8.2], look: [3.2, -0.3, 2.2] }],
    fov: [[0, 46], [4.5, 46], [9, 40], [14, 22], [20, 34], [25, 46], [29.5, 46], [34, 44]],
    acts: [],
    sounds: [[0.4, "begin"], [4, "creak"], [10, "gull"], [14, "oars"], [17, "oars"], [20, "oars"], [23, "oars"], [27, "creak"]],
    duration: 34,
  },
  /* condemned on 25 November 1799 (Stark; one source says 28 November). No source names the judge: his chair stays empty. The note on the
     jaws is Fitton's own words (1835). */
  verdict: {
    place: "court", next: 46, journal: "jaws", title: "The court decides",
    read: ["The court read both sets of papers. The papers from the shark showed that the cargo belonged to Britain's enemies.", "In November 1799 the Nancy and her cargo were judged a lawful prize. Mr Fitton's shark jaws were kept in the court, with his note."],
    captions: [[0, "The Court of Vice-Admiralty, Kingston. November 1799."], [5.5, "Both sets of papers lie on the green table."], [10.5, "The papers from the shark tell the truth."], [16, "The clerk reads out what the court has decided."], [21, "The Nancy and her cargo are a lawful prize."], [26, "Nobody wrote down the judge's name."], [30, "Mr Fitton's shark jaws stand by the wall."], [34, "“Lieut. Fitton recommends these jaws for a collar for neutrals to swear through.”"]],
    shots: [{ t: 0, p: [0, 2.7, 4.0], look: [0, 1.9, -3.3] }, { t: 6, p: [0.3, 2.0, 2.3], look: [0, 0.9, 0] }, { t: 11, p: [1.0, 1.35, 1.25], look: [0.3, 0.83, 0.1] }, { t: 15.5, p: [-1.4, 1.7, 1.2], look: [-3.6, 1.45, -0.5] }, { t: 21, p: [-1.8, 1.65, 0.9], look: [-3.6, 1.45, -0.5] }, { t: 25, p: [0.25, 2.5, -0.4], look: [0, 2.2, -4.4] }, { t: 30.5, p: [-3.4, 1.65, 1.35], look: [-5.85, 1.3, 1.0] }, { t: 38, p: [-4.4, 1.5, 1.15], look: [-5.85, 1.25, 1.0] }],
    fov: [[0, 46], [6, 44], [11, 38], [15.5, 42], [21, 40], [25, 46], [30.5, 40], [38, 36]],
    acts: [[16.5, "clerk", "TalkM1"], [21.5, "fitton", "Nod"], [24, "clerk", "IdleM"]],
    sounds: [[0.4, "bell"], [11, "page"], [21.5, "begin"], [30, "page"]],
    duration: 40,
  },
};
export const QUIZ = {
  title: "What did the papers prove?",
  items: [
    { q: "What did the biggest shark take from the hook?", opts: [{ t: "Beef" }, { t: "Salt pork", ok: true }, { t: "Bread" }], why: "Fitton tried beef first. The shark would not take it." },
    { q: "Where were the Nancy's real papers found?", opts: [{ t: "Inside a shark", ok: true }, { t: "In the captain's cabin" }, { t: "On the quay" }], why: "They had been thrown into the sea, and a shark swallowed them." },
    { q: "What did the papers show?", opts: [{ t: "The cargo belonged to Britain's enemies", ok: true }, { t: "The ship was sinking" }, { t: "The crew were pirates" }], why: "So the Nancy was not a neutral ship after all." },
    { q: "Where did the court sit?", opts: [{ t: "Spanish Town" }, { t: "Kingston", ok: true }, { t: "Port Royal" }], why: "The Court of Vice-Admiralty sat in Kingston." },
    { q: "Where are the papers today?", opts: [{ t: "At the bottom of the sea" }, { t: "In the National Library of Jamaica", ok: true }, { t: "Nobody knows" }], why: "They are kept in Kingston." },
  ],
};
