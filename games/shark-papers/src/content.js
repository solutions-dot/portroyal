/* Every word the player reads. Michael Fitton, Hugh Wylie and Thomas Briggs were real. Everyone else is fictional and their journal
   page says so. Facts and sources: docs/games/shark-papers.md. */
export const TITLE = "The Shark Papers";
export const GAME = {
  id: "shark-papers",
  eye: 1.3,
  title: { place: "deck", pos: [3.4, 2.2, 8.4], look: [-1, 1.6, -3] },
  fiction: "You are Jem, the ship's boy, aged twelve. You are fictional. The shark, the papers and the two officers were real.",
  recap: [
    { icon: "🦈", label: "The shark", page: "shark" },
    { icon: "📜", label: "The papers", page: "papers" },
    { icon: "⚖️", label: "The court", page: "court" },
  ],
};
export const CHAPTERS = [
  { id: "jacmel", name: "Off Jacmel", year: "30 August 1799", first: 10, last: 14, place: "deck", caption: "The schooner Ferret · off Jacmel, 30 August 1799", intro: "You are Jem, ship's boy on the Ferret. Breakfast is late. The sea is full of sharks." },
  { id: "bundle", name: "What the shark held", year: "30 August 1799", first: 20, last: 22, place: "deck", caption: "The schooner Ferret · off Jacmel", intro: "The cook has opened the shark. Come and see." },
  { id: "portroyal", name: "Port Royal", year: "September 1799", first: 30, last: 32, place: "quay", caption: "Port Royal, Jamaica · September 1799", intro: "The Ferret is home. The brig Nancy is here too, waiting for the court." },
  { id: "court", name: "The court in Kingston", year: "November 1799", first: 40, last: 44, place: "court", caption: "The Court of Vice-Admiralty · Kingston, November 1799", intro: "Mr Fitton has carried the papers across the harbour to Kingston." },
];
export const chapterOf = (stage) => Math.max(0, CHAPTERS.findIndex((c) => stage >= c.first && stage <= c.last));
export const PEOPLE = { fitton: "Mr Fitton", wylie: "Mr Wylie", cato: "Mr Cato", ben: "Ben", clerk: "The clerk" };
const L = (who, text) => ({ who, text });
export const TALK = {
  10: { cato: [L("Mr Cato", "Morning, Jem. Mind the side."), L("You", "Why are there so many sharks?"), L("Mr Cato", "A dead bullock is floating out there."), L("Mr Cato", "Sharks can smell a meal from far away."), L("You", "Can we catch one?"), L("Mr Cato", "Ask Mr Fitton. He is waiting on his breakfast.")] },
  11: { fitton: [L("Mr Fitton", "Mr Wylie of the Sparrow is coming to breakfast."), L("Mr Fitton", "He is late. So we shall go fishing."), L("You", "For a shark, sir?"), L("Mr Fitton", "For the biggest one. It will not take beef."), L("Mr Fitton", "Fetch the salt pork, Jem. Sharks like pork.")] },
  22: {
    wylie: [L("Mr Wylie", "Good morning, Fitton. I took a prize two days ago."), L("Mr Wylie", "An American brig, the Nancy. I sent her to Port Royal."), L("You", "Sir, we found papers. Inside a shark."), L("Mr Wylie", "“There’s a lie somewhere, Fitton, not far off, for I sealed all her papers up.”")],
    fitton: [L("Mr Fitton", "“The shark you see lying there has brought me full information of your brig.”"), L("Mr Fitton", "You sealed up her false papers, Wylie."), L("Mr Fitton", "Somebody threw the real ones into the sea."), L("You", "And the shark swallowed them!"), L("Mr Fitton", "So it did. We sail for Jamaica.")],
  },
  30: { ben: [L("Ben", "Mind the rope, young one. You off the Ferret?"), L("You", "Yes. I am Jem. Do you work on the ships?"), L("Ben", "I load them. A man says he owns me."), L("Ben", "He hires me out and keeps the pay."), L("Ben", "Most hands on this quay are Black. Free or not."), L("You", "Which ship is the Nancy?"), L("Ben", "The brig, there. Go and look.")] },
  32: { ben: [L("You", "Ben, what is a prize?"), L("Ben", "A ship taken in war. Britain is at war with France."), L("Ben", "With Spain and the Dutch too. Americans are not in it."), L("Ben", "So an American ship may pass. Unless she carries enemy goods."), L("You", "And who decides?"), L("Ben", "A court. In Kingston, across the harbour.")] },
  40: { clerk: [L("The clerk", "Quiet, boy. This is the Court of Vice-Admiralty."), L("You", "Is the captain on trial?"), L("The clerk", "No. The ship is. Is she a lawful prize, or not?"), L("The clerk", "Her master swears she is American and neutral."), L("The clerk", "Two sets of papers are on the table. Look at both.")] },
  42: { fitton: [L("Mr Fitton", "The court has decided. She is a lawful prize."), L("You", "Because of our shark."), L("Mr Fitton", "Because someone lied, and the sea gave it back."), L("Mr Fitton", "I have sent the jaws ashore, with a note."), L("You", "What does the note say, sir?"), L("Mr Fitton", "That they would make a fine collar for liars.")] },
};
export const FLAVOUR = {
  cato: ["Keep one hand for the ship, Jem.", "A dry deck is a safe deck."],
  fitton: ["A sharp lookout, there.", "Steady as she goes."],
  wylie: ["A fine morning for it."],
  ben: ["Heavy work, in this sun.", "Ships come, ships go."],
  clerk: ["Hush, now.", "Stand by the wall."],
};
export const SOURCES = {
  gleaner: { name: "Jamaica Gleaner, Pieces of the Past: The Shark Papers", url: "https://old.jamaica-gleaner.com/pages/history/story0042.htm" },
  nlj: { name: "National Library of Jamaica: the Shark Papers", url: "https://nlj.gov.jm/exhibition/shark/" },
  dnb: { name: "Dictionary of National Biography: Michael Fitton", url: "https://en.wikisource.org/wiki/Dictionary_of_National_Biography,_1885-1900/Fitton,_Michael" },
  sparrow: { name: "HMS Sparrow (1796)", url: "https://en.wikipedia.org/wiki/HMS_Sparrow_(1796)" },
  burnard: { name: "Trevor Burnard, Slaves and Slavery in Kingston, 1770 to 1815", url: "https://www.cambridge.org/core/journals/international-review-of-social-history/article/slaves-and-slavery-in-kingston-17701815/A7E958558A63A7DC296C3892960B09ED" },
};
export const JOURNAL = [
  { id: "you", title: "Jem and the Ferret", simple: ["You are Jem, twelve, ship's boy on the schooner Ferret.", "The Ferret is a small Navy ship with six guns.", "She sails from Port Royal, Jamaica."], deeper: ["Jem in this game is fictional. Mr Cato in this game is fictional.", "The Ferret was a tender: a small ship that worked for a big one, HMS Abergavenny.", "A record of the time gives her 6 three-pounder guns and 45 men."], source: "dnb" },
  { id: "fitton", title: "Michael Fitton", simple: ["Michael Fitton was real. He commanded the Ferret.", "He was about 33, from Cheshire in England."], deeper: ["The words Mr Fitton says in this game are imagined, except the line about the shark, which he wrote down himself years later.", "In 1799 he was an acting lieutenant. He was made a full lieutenant in 1804."], source: "dnb" },
  { id: "shark", title: "The shark", simple: ["On 30 August 1799, off Jacmel, sharks were feeding on a dead bullock.", "Fitton caught the biggest on a hook and line.", "It would not take beef. It took pork."], deeper: ["Jacmel is in Haiti, which was then the French colony of Saint-Domingue.", "Nobody wrote down what kind of shark it was."], source: "gleaner" },
  { id: "papers", title: "The papers", simple: ["Inside the shark was a bundle of papers tied with string.", "The crew dried them on the deck.", "They were letters, bills and receipts from the brig Nancy."], deeper: ["The letters were in French and German. They showed who really owned the cargo.", "The papers are kept today in the National Library of Jamaica, in Kingston."], source: "nlj" },
  { id: "breakfast", title: "Breakfast with Mr Wylie", simple: ["Hugh Wylie was real. He commanded the cutter Sparrow.", "He had taken the Nancy two days before.", "He had sealed up her papers. They were the false ones."], deeper: ["The words Mr Wylie says in this game are imagined, except his line about a lie, which Fitton wrote down years later.", "The Sparrow had 10 short guns called carronades, 2 six-pounders and 40 men."], source: "sparrow" },
  { id: "portroyal", title: "Port Royal", simple: ["Port Royal was the Navy's base in Jamaica.", "Much of the work on the ships and quays was done by Black people.", "Many were enslaved: forced to work, unpaid, not free to leave."], deeper: ["Ben in this game is fictional.", "Enslaved men were often hired out by the people who claimed to own them, as sailors and dock workers.", "In 1788 Kingston had 16,659 enslaved people among 26,478."], source: "burnard" },
  { id: "nancy", title: "The brig Nancy", simple: ["The Nancy was an American brig of 125 tons.", "She left Baltimore on 3 July 1799. Her master was Thomas Briggs.", "The Sparrow took her on 28 August, near Haiti."], deeper: ["Thomas Briggs does not speak in this game.", "No picture of the Nancy is known. The brig in the game is a general picture of a brig of her time.", "A brig has two masts with square sails."], source: "gleaner" },
  { id: "prize", title: "What is a prize?", simple: ["In war, a navy ship could take a ship carrying an enemy's goods.", "A court then decided if that was lawful.", "If it was, the ship was sold and the crew shared the money."], deeper: ["In 1799 Britain was at war with France, Spain and the Netherlands.", "America was neutral. Its ships could trade, but not hide an enemy's goods."], source: "gleaner" },
  { id: "court", title: "The court", simple: ["The Court of Vice-Admiralty sat in Kingston.", "The Nancy's master swore she was American and neutral.", "Then Fitton brought the papers from the shark."], deeper: ["The clerk in this game is fictional. The room is a general picture.", "The court stood at the corner of Harbour Street and Hanover Street.", "On 25 November 1799 the Nancy and her cargo were judged a lawful prize. One source says 28 November."], source: "gleaner" },
  { id: "jaws", title: "The jaws", simple: ["Fitton sent the shark's jaws ashore.", "His note said they would make “a collar for neutrals to swear through”."], deeper: ["He meant: a warning to ship masters who swear to lies.", "Nobody is sure where the jaws are today."], source: "dnb" },
  { id: "today", title: "The Shark Papers today", simple: ["You can still see the papers in Kingston.", "They were stolen in the 1907 earthquake, and given back."], deeper: ["They are in the National Library of Jamaica, numbered MS 165.", "Some retellings put the court in Spanish Town or Port Royal. It was in Kingston."], source: "nlj" },
];
export const CARDS = {
  caught: { title: "The biggest shark", lines: ["The shark lies on the deck. The cook goes to work.", "Then he shouts for Mr Fitton."], button: "Go and see" },
  end: { title: "The Shark Papers", lines: ["A ship's master threw his papers into the sea.", "A shark swallowed them. A sailor caught the shark.", "The papers reached the court, and the truth came out.", "You can still see them in Kingston today."] },
};
export const FILMS = {};
export const QUIZ = {
  title: "What did the papers prove?",
  items: [
    { q: "Where were the Nancy's real papers found?", opts: [{ t: "Inside a shark", ok: true }, { t: "In the captain's cabin" }, { t: "On the quay" }], why: "They had been thrown into the sea, and a shark swallowed them." },
    { q: "What did the papers show?", opts: [{ t: "The cargo belonged to Britain's enemies", ok: true }, { t: "The ship was sinking" }, { t: "The crew were pirates" }], why: "So the Nancy was not a neutral ship after all." },
    { q: "Where did the court sit?", opts: [{ t: "Spanish Town" }, { t: "Kingston", ok: true }, { t: "Port Royal" }], why: "The Court of Vice-Admiralty sat in Kingston." },
    { q: "Where are the papers today?", opts: [{ t: "At the bottom of the sea" }, { t: "In the National Library of Jamaica", ok: true }, { t: "Nobody knows" }], why: "They are kept in Kingston." },
  ],
};
