/* Every word the player reads. Michael Fitton, Hugh Wylie and Thomas Briggs were real. Everyone else is fictional and their journal
   page says so. Facts and sources: docs/games/shark-papers.md. */
export const TITLE = "The Shark Papers";
export const GAME = {
  id: "shark-papers",
  eye: 1.3,
  title: { place: "deck", pos: [2.5, 2.6, 10.2], look: [-0.6, 2.4, -3] },
  fiction: "You are Jem, the ship's boy, aged twelve. You are fictional. The shark, the papers and the two officers were real.",
  recap: [
    { icon: "🦈", label: "The shark", page: "shark" },
    { icon: "📜", label: "The papers", page: "papers" },
    { icon: "⚖️", label: "The court", page: "court" },
  ],
};
export const CHAPTERS = [
  { id: "jacmel", name: "Off Jacmel", year: "30 August 1799", first: 10, last: 18, place: "deck", caption: "The schooner Ferret · off Jacmel, 30 August 1799", intro: "You are Jem, ship's boy on the Ferret. It is dawn. There is no wind, and the sea is full of sharks." },
  { id: "bundle", name: "What the shark held", year: "30 August 1799", first: 20, last: 26, place: "deck", caption: "The schooner Ferret · off Jacmel", intro: "The shark lies on the deck. Two of the men open it, to get the pork back." },
  { id: "portroyal", name: "Port Royal", year: "September 1799", first: 30, last: 36, place: "quay", caption: "The dockyard, Port Royal, Jamaica · September 1799", intro: "The Ferret is home. The brig Nancy is here too, waiting for the court." },
  { id: "court", name: "The court in Kingston", year: "Autumn 1799", first: 40, last: 46, place: "court", caption: "The Court of Vice-Admiralty · Kingston, 1799", intro: "Mr Fitton has carried the papers across the harbour to Kingston." },
];
export const chapterOf = (stage) => Math.max(0, CHAPTERS.findIndex((c) => stage >= c.first && stage <= c.last));
export const PEOPLE = { fitton: "Mr Fitton", wylie: "Mr Wylie", cato: "Mr Cato", ben: "Ben", clerk: "The clerk" };
const L = (who, text) => ({ who, text });
export const TALK = {
  10: { cato: [L("Mr Cato", "Morning, Jem. Not a breath of wind today."), L("You", "Why are there so many sharks?"), L("Mr Cato", "A dead bullock is floating out there."), L("Mr Cato", "Sharks can smell a meal from far away."), L("Mr Cato", "Now, to work. A rope lies loose by the fore mast."), L("Mr Cato", "Coil it down. Then ring the bell.")] },
  13: { fitton: [L("Mr Fitton", "Mr Wylie of the Sparrow is coming to breakfast."), L("Mr Fitton", "His boat has a long pull. So we shall fish."), L("You", "For a shark, sir?"), L("Mr Fitton", "For the biggest one. I tried beef. It would not bite."), L("Mr Fitton", "Take my glass first. Look at the Sparrow."), L("Mr Fitton", "Then fetch the salt pork, Jem. Sharks like pork.")] },
  20: { cato: [L("Mr Cato", "There he lies. The biggest shark I ever saw."), L("You", "Why did the men open him?"), L("Mr Cato", "To get the pork back. Good pork, that."), L("Mr Cato", "But they found something else in there."), L("Mr Cato", "Go and look, Jem.")] },
  22: { fitton: [L("Mr Fitton", "A bundle of papers, tied round with string."), L("Mr Fitton", "Here is a letter from Curacao. It names a brig."), L("Mr Fitton", "The American brig Nancy."), L("You", "Who throws papers into the sea, sir?"), L("Mr Fitton", "Someone with something to hide."), L("Mr Fitton", "Lay them out to dry, Jem. One sheet at a time.")] },
  25: { wylie: [L("Mr Wylie", "A long pull, Fitton! Is breakfast ready?"), L("Mr Fitton", "What luck have you had, Wylie?"), L("Mr Wylie", "I have stopped an American brig."), L("Mr Fitton", "Was she named Nancy?"), L("Mr Wylie", "She was! How do you know that?")] },
  26: { fitton: [L("Mr Fitton", "“The shark you see lying there has brought me full information of your brig.”"), L("You", "Her papers are drying on the hatch, sir."), L("Mr Wylie", "“There’s a lie somewhere, Fitton, not far off, for I sealed all her papers up.”"), L("Mr Fitton", "You sealed up her false papers, Wylie."), L("Mr Fitton", "These are her true ones. The shark brought them."), L("Mr Wylie", "“Breakfast, ho!”"), L("You", "He does not believe us!"), L("Mr Fitton", "He will, Jem. The court will read them.")] },
  30: { ben: [L("Ben", "Mind the rope, young one. You off the Ferret?"), L("You", "Yes. I am Jem. Do you work on the ships?"), L("Ben", "I load them. A man says he owns me."), L("Ben", "He hires me out and keeps the pay."), L("Ben", "Most hands on this quay are Black. Free or not."), L("You", "What is that great ship out there?"), L("Ben", "The guard ship. Go to the edge and look.")] },
  34: { ben: [L("You", "Ben, what is a prize?"), L("Ben", "A ship taken in war. Britain is at war with France."), L("Ben", "With Spain and the Dutch too. Americans are not in it."), L("Ben", "So an American ship may pass. Unless she carries enemy goods."), L("You", "And who decides?"), L("Ben", "A court. In Kingston, across the harbour.")] },
  35: { fitton: [L("Mr Fitton", "There you are, Jem. You have seen the Nancy?"), L("You", "Yes, sir. Her hatch is sealed."), L("Mr Fitton", "Her master swears she is American. We know better."), L("Mr Fitton", "The shark's papers must go to the court."), L("Mr Fitton", "A boat waits at the steps. Carry my box down.")] },
  40: { clerk: [L("The clerk", "Quiet, boy. This is the Court of Vice-Admiralty."), L("You", "Is the captain on trial?"), L("The clerk", "No. The ship is. Is she a lawful prize, or not?"), L("The clerk", "Her master swore she is American and neutral."), L("The clerk", "Bring the shark's papers to the table."), L("The clerk", "Then read both sets.")] },
  44: { fitton: [L("Mr Fitton", "The court has decided. She is a lawful prize."), L("You", "Because of our shark."), L("Mr Fitton", "Because someone lied, and the sea gave it back."), L("You", "Where is her master now, sir?"), L("Mr Fitton", "Gone. He did not wait to hear it."), L("Mr Fitton", "Well done, Jem. You dried those papers well.")] },
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
  dnb: { name: "Dictionary of National Biography: Michael Fitton", url: "https://en.wikisource.org/wiki/Dictionary_of_National_Biography,_1885-1900/Fitton,_Michael" },
  sparrow: { name: "HMS Sparrow (1796)", url: "https://en.wikipedia.org/wiki/HMS_Sparrow_(1796)" },
  burnard: { name: "Trevor Burnard, Slaves and Slavery in Kingston, 1770 to 1815", url: "https://www.cambridge.org/core/journals/international-review-of-social-history/article/slaves-and-slavery-in-kingston-17701815/A7E958558A63A7DC296C3892960B09ED" },
};
export const JOURNAL = [
  { id: "you", title: "Jem and the Ferret", simple: ["You are Jem, twelve, ship's boy on the schooner Ferret.", "The Ferret is a small Navy ship with two masts and six guns.", "She sails from Port Royal, Jamaica."], deeper: ["Jem in this game is fictional. Mr Cato in this game is fictional.", "A record of the time gives her 6 three-pounder guns and 45 men.", "No drawing of the Ferret is known. The ship in the game is a general picture of a small Navy schooner.", "Fitton wrote that there was not a breath of air that morning."], source: "dnb" },
  { id: "fitton", title: "Michael Fitton", simple: ["Michael Fitton was real. He commanded the Ferret.", "He was about 33, from Cheshire in England."], deeper: ["The words Mr Fitton says in this game are imagined, except the line about the shark, which he wrote down himself years later.", "His own account was printed in the United Service Journal in February 1835.", "In 1799 he was an acting lieutenant. He was made a full lieutenant in 1804."], source: "usj" },
  { id: "sparrow", title: "The cutter Sparrow", simple: ["The Sparrow was a Navy cutter. A cutter has one mast.", "She was 123 tons and about 66 feet long.", "Hugh Wylie commanded her."], deeper: ["She had 40 men. One record gives her 10 short guns called carronades and 2 six-pounders. Fitton remembered ten six-pounders.", "Fitton wrote that at dawn she was about six miles in shore. The game draws her nearer, so you can see her.", "He asked Mr Wylie to breakfast by signal."], source: "sparrow" },
  { id: "shark", title: "The shark", simple: ["On 30 August 1799, off Jacmel, sharks were feeding on a dead bullock.", "Fitton caught the biggest on a hook and line.", "It would not take beef. It took pork."], deeper: ["Jacmel is in Haiti, which was then the French colony of Saint-Domingue.", "Fitton wrote that he let the shark run on about 60 fathoms of line, then had it hoisted in. A fathom is six feet.", "Nobody wrote down what kind of shark it was. The shark in the game is a plain large shark."], source: "usj" },
  { id: "papers", title: "The papers", simple: ["Inside the shark was a bundle of papers tied round with a string.", "The crew spread them out on the deck to dry.", "They were letters, bills and receipts from the brig Nancy."], deeper: ["Fitton wrote that the papers were whole, except the outside wrapper.", "One letter was dated at the island of Curacao.", "The letters were in French and German. They showed who really owned the cargo.", "The papers are kept today in the National Library of Jamaica, in Kingston."], source: "nlj" },
  { id: "breakfast", title: "Breakfast with Mr Wylie", simple: ["Hugh Wylie was real. He came across by boat for breakfast.", "He had stopped the Nancy two days before.", "He had sealed up her papers. They were the false ones."], deeper: ["The words Mr Wylie says in this game are imagined, except his line about a lie and “Breakfast, ho!”, which Fitton wrote down years later.", "Fitton spelt his name Whylie.", "Fitton wrote that Wylie stared at him, at the shark and at the papers, then went down to breakfast."], source: "usj" },
  { id: "portroyal", title: "Port Royal", simple: ["Port Royal was the Navy's base in Jamaica.", "Much of the work on the ships and quays was done by Black people.", "Many were enslaved: forced to work, unpaid, not free to leave."], deeper: ["Ben in this game is fictional.", "Enslaved men were often hired out by the people who claimed to own them, as sailors and dock workers.", "In 1788 Kingston had 16,659 enslaved people among 26,478.", "The dockyard in the game is a general picture of a Navy yard of the time."], source: "burnard" },
  { id: "abergavenny", title: "HMS Abergavenny", simple: ["HMS Abergavenny was the guard ship at Port Royal.", "She was the flagship there from 1796 to 1807.", "The Ferret was her tender: a small ship that worked for a big one."], deeper: ["Michael Fitton was acting lieutenant of the Abergavenny from 11 January 1799.", "The ship in the game is a general picture of a ship with two decks of guns."], source: "dnb" },
  { id: "nancy", title: "The brig Nancy", simple: ["The Nancy was an American brig of 125 tons.", "She left Baltimore on 3 July 1799. Her master was Thomas Briggs.", "The Sparrow took her on 28 August, near Haiti."], deeper: ["Thomas Briggs does not speak in this game.", "No picture of the Nancy is known. The brig in the game is a general picture of a brig of her time.", "A brig has two masts with square sails.", "A ship held for the court was kept shut and sealed until the court decided."], source: "gleaner" },
  { id: "prize", title: "What is a prize?", simple: ["In war, a navy ship could take a ship carrying an enemy's goods.", "A court then decided if that was lawful.", "If it was, the ship was sold and the crew shared the money."], deeper: ["In 1799 Britain was at war with France, Spain and the Netherlands.", "America was neutral. Its ships could trade, but not hide an enemy's goods."], source: "gleaner" },
  { id: "court", title: "The court", simple: ["The Court of Vice-Admiralty sat in Kingston.", "The Nancy's master swore she was American and neutral.", "Then Fitton brought the papers from the shark."], deeper: ["The clerk in this game is fictional. The room is a general picture of a court room of the time.", "No source names the judge, so the judge's chair in the game is empty.", "The court stood at the corner of Harbour Street and Hanover Street.", "On 25 November 1799 the Nancy and her cargo were judged a lawful prize. One source says 28 November.", "An account printed in 1833 says her master and supercargo left Kingston before the end."], source: "gleaner" },
  { id: "jaws", title: "The jaws", simple: ["Fitton sent the shark's jaws to the court.", "His note said: “Lieut. Fitton recommends these jaws for a collar for neutrals to swear through.”"], deeper: ["He meant: a warning to ship masters who swear to lies.", "Nobody is sure where the jaws are today."], source: "usj" },
  { id: "today", title: "The Shark Papers today", simple: ["You can still see the papers in Kingston.", "They were stolen in the 1907 earthquake, and given back."], deeper: ["They are in the National Library of Jamaica, numbered MS 165.", "Some retellings put the court in Spanish Town or Port Royal. It was in Kingston."], source: "nlj" },
];
export const CARDS = {
  catch: { title: "The catch", lines: ["Mr Fitton hooks the biggest shark, and all hands haul it on board.", "Nobody is hurt."], scary: false },
  end: { title: "The Shark Papers", lines: ["A ship's master threw his papers into the sea.", "A shark swallowed them. A sailor caught the shark.", "The papers reached the court, and the truth came out.", "You can still see them in Kingston today."] },
};
export const FILMS = {
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
