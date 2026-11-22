/* Every word the player reads. Lewis Hutchinson, Dr Jonathan Hutton and John Callendar were real. Everyone else is fictional and their
   journal page says so. Hutchinson says nothing in this game but the lines he left for his own tombstone. Sources: docs/games/hutchinson.md. */
export const TITLE = "The Mad Master of Edinburgh Castle";
export const GAME = {
  id: "hutchinson",
  eye: 1.45,
  title: { place: "castle", pos: [13, 1.9, 13.5], look: [0, 3.6, -9] },
  fiction: "You are Quaco, aged fourteen. You are fictional. The killer, the doctor and the young man who came for him were real.",
  mature: ["This story is about a man who killed travellers on a lonely road.", "It has fear, a gunshot and a hanging. Nothing is shown close up."],
  recap: [
    { icon: "⌚", label: "Forty-three watches", page: "watches" },
    { icon: "⚖️", label: "Who could speak in court", page: "silenced" },
    { icon: "📜", label: "Record and story", page: "legend" },
  ],
};
export const CHAPTERS = [
  { id: "road", name: "The dry road", year: "St Ann, 1772", first: 10, last: 13, place: "road", caption: "The road by Dr Hutton’s pen \u00b7 St Ann, 1772", intro: "You are Quaco, enslaved on Dr Hutton’s cattle pen. The ponds are dry." },
  { id: "quarrel", name: "The doctor’s quarrel", year: "St Ann, 1772", first: 20, last: 22, place: "road", caption: "The boundary \u00b7 St Ann, 1772", intro: "Two men claim the same strip of land. One of them owns the castle." },
  { id: "towers", name: "Under the towers", year: "Edinburgh Castle, 1772", first: 30, last: 33, place: "castle", caption: "Edinburgh Castle · dusk", intro: "In this story the castle well still gives water. Someone watches from the upper window. When the shutter opens, be behind something." },
  { id: "warrant", name: "The neighbour", year: "Edinburgh Castle, 1772", first: 40, last: 42, place: "castle", caption: "Edinburgh Castle · morning", intro: "A neighbour has come up the road about a lost animal." },
  { id: "house", name: "What the house held", year: "Edinburgh Castle, 1773", first: 50, last: 55, place: "hall", caption: "Inside the castle · 1773", intro: "He has run. For the first time, people walk into his house and look." },
  { id: "town", name: "Spanish Town", year: "March 1773", first: 60, last: 66, place: "town", caption: "Spanish Town, the capital · March 1773", intro: "The trial is in the capital. Dr Hutton has brought you and Cubba with him." },
];
export const chapterOf = (stage) => Math.max(0, CHAPTERS.findIndex((c) => stage >= c.first && stage <= c.last));
export const PEOPLE = { hutton: "Dr Hutton", callendar: "John Callendar", officer: "Captain Reid", clerk: "The clerk", cudjoe: "Cudjoe", carter: "Sampson", juba: "Juba", cubba: "Cubba" };
const L = (who, text) => ({ who, text });
export const TALK = {
  10: { cubba: [L("Cubba", "Quaco. Look at this trough. Dust."), L("You", "The pond is dry too, Cubba."), L("Cubba", "Every pond for miles. The castle well still gives."), L("You", "The doctor will send me there."), L("Cubba", "He will. And people who stop there do not always come back.")] },
  11: { carter: [L("Sampson", "You belong to the doctor's pen, boy?"), L("You", "Yes. He says a man owns me. I am Quaco."), L("Sampson", "I am Sampson. Free, with my own mule and cart."), L("Sampson", "I passed the castle at first light. I did not stop."), L("Sampson", "A pack mule followed me down. No rider. See it there.")] },
  13: { hutton: [L("You", "Doctor. A mule came down alone. Its pack is full."), L("Dr Hutton", "From the castle road?"), L("You", "Sampson says so."), L("Dr Hutton", "Not the first. I have written to the magistrates."), L("Dr Hutton", "They want a witness. A dead man is no witness.")] },
  21: { hutton: [L("Dr Hutton", "This pole marks my land. He says it is his."), L("Dr Hutton", "My cattle stray over. They do not stray back."), L("Dr Hutton", "He took my sword from my own servant's hands."), L("You", "People say he struck you with it."), L("Dr Hutton", "He did. He will answer for it. Go with Sampson now.")] },
  31: { juba: [L("Juba", "Hush. Keep the well between you and the house."), L("You", "I came for water. Who are you?"), L("Juba", "Juba. He says he owns me. I draw his water."), L("Juba", "When the shutter opens, he has the long gun."), L("You", "Have you seen what he does?"), L("Juba", "I have seen. And carried. Take your pail and go.")] },
  33: { carter: [L("Sampson", "You are shaking. Sit by the wheel."), L("You", "She said she has carried. Carried what?"), L("Sampson", "You know what. Everyone on this road knows."), L("Sampson", "Knowing is not proof. Not in their court.")] },
  40: { carter: [L("Sampson", "Stay behind this wall, Quaco."), L("Sampson", "That is Mr Callendar. His land joins the castle's."), L("Sampson", "His jackass strayed. He means to ask for it back."), L("You", "Alone? There is a gun at that window."), L("Sampson", "I told him so. He would not wait.")] },
  50: { officer: [L("Captain Reid", "A sick man in this house slipped out and told."), L("Captain Reid", "A Navy officer, Mr Turnbull, took him. He is in gaol."), L("Captain Reid", "Now we search his house. Touch nothing. Look at everything."), L("You", "What are you looking for?"), L("Captain Reid", "What he kept. Start with that box.")] },
  52: {
    juba: [L("Juba", "Those coats came off the road. So did the watches."), L("You", "Will you tell the judge?"), L("Juba", "I may not. We cannot swear against a white man."), L("Juba", "The law will not hear us. So I am telling you.")],
    cudjoe: [L("Cudjoe", "He made us carry them. At night. To the hole."), L("You", "How many, Cudjoe?"), L("Cudjoe", "I stopped counting. Counting did not help them."), L("Cudjoe", "Come. You should see it once.")],
  },
  55: { cudjoe: [L("You", "I did not hear it land."), L("Cudjoe", "No. Nobody has seen the bottom."), L("Cudjoe", "Some had people waiting for them. They never knew."), L("You", "Somebody should say their names."), L("Cudjoe", "We never learned their names. Remember that they had them.")] },
  60: { clerk: [L("The clerk", "Stand back from the door. The court is sitting."), L("You", "Is he tried for the people on the road?"), L("The clerk", "For one man. John Callendar. A free man saw that."), L("You", "Juba and Cudjoe saw the rest."), L("The clerk", "Slaves cannot give evidence against a white man. That is the law.")] },
  62: {
    hutton: [L("Dr Hutton", "Guilty. He hangs on the sixteenth of March."), L("Dr Hutton", "He is not sorry. He has written his own epitaph."), L("Dr Hutton", "He left a hundred pounds to carve it in stone."), L("You", "Will they carve it?"), L("Dr Hutton", "I think not.")],
    cubba: [L("Cubba", "So. They will hang him for the neighbour."), L("You", "And for nobody else."), L("Cubba", "The paper will say one. We will say many."), L("Cubba", "Keep both in your head, Quaco. That is how to remember.")],
  },
};
export const FLAVOUR = {
  cubba: ["Rain will come. It always has.", "Mind the sun, child."],
  carter: ["A mule knows a bad place before a man does.", "I keep to the middle of the road."],
  hutton: ["I have letters to write.", "Keep to your work."],
  juba: ["Quietly, now.", "Do not look up at the window."],
  cudjoe: ["I am tired. But I am here.", "Some things you only say once."],
  officer: ["Keep clear of my men.", "Stay where I can see you."],
  clerk: ["The court will rise soon.", "Mind the step."],
};
export const SOURCES = {
  jnht: { name: "Jamaica National Heritage Trust: Edinburgh Castle", url: "https://jnht.com/site_edinburgh_castle.php" },
  letter: { name: "Letter from Kingston, 1 April 1773 (Annual Register; Essex Gazette)", url: "https://www.executedtoday.com/2015/03/16/1773-lewis-hutchinson-jamaica-serial-killer/" },
  cundall: { name: "Frank Cundall, Historic Jamaica (1915), pages 296 to 301", url: "https://www.gutenberg.org/ebooks/70109" },
  edwards: { name: "Bryan Edwards, History of the British Colonies in the West Indies (1794)", url: "https://archive.org/details/historycivilcomm02edwa" },
  gleaner: { name: "Jamaica Gleaner, Pieces of the Past: The Mad Master", url: "https://old.jamaica-gleaner.com/pages/history/story0036.htm" },
};
export const JOURNAL = [
  { id: "you", title: "Quaco", simple: ["You are Quaco, fourteen, on Dr Hutton's cattle pen in St Ann.", "You are enslaved: forced to work, unpaid, not free to leave.", "Cubba looks out for you."], deeper: ["Quaco in this game is fictional. Cubba in this game is fictional.", "Quaco and Cubba are Akan day names, common in Jamaica then. Quaco is a boy born on a Wednesday.", "A pen was a cattle farm. St Ann had many."] },
  { id: "road", title: "The road", simple: ["The road crosses dry limestone hills, good for cattle.", "Travellers went missing near Edinburgh Castle.", "Sampson saw a mule come down with no rider."], deeper: ["Sampson in this game is fictional. So are the mule, the dry season and the well.", "A letter from Kingston in April 1773 says he kept his neighbours’ strayed cattle.", "That he shot travellers from his towers was first printed in 1828, by George Bridges."], source: "cundall" },
  { id: "hutton", title: "Dr Jonathan Hutton", simple: ["Dr Hutton was a doctor and a planter. He was real.", "His land lay next to Hutchinson’s."], deeper: ["The words Dr Hutton says in this game are imagined.", "He held people in slavery. This game does not make him a hero.", "A list of 1769 calls him a practitioner in physic and surgery."], source: "cundall" },
  { id: "quarrel", title: "The quarrel", simple: ["The two men quarrelled over a boundary.", "The story goes that Hutchinson took Hutton’s sword and later struck him with it."], deeper: ["This comes from Hutton’s family, written down in 1897. It says he was mended in England with a silver plate in his head.", "It is tradition, not a court record."], source: "cundall" },
  { id: "castle", title: "Edinburgh Castle", simple: ["A small stone house with two round towers.", "The towers have loopholes to shoot through.", "Lewis Hutchinson, from Scotland, bought the land in 1768."], deeper: ["An old description: two storeys, with a round loopholed tower at two opposite corners. The game is built from that and from photographs of the ruin.", "The roofs, the well, the window and the cover you used are this game’s picture, not a survey.", "The ruin belongs to the Jamaica National Heritage Trust."], source: "jnht" },
  { id: "juba", title: "Juba", simple: ["Juba is enslaved at the castle. She draws the water.", "She warned you. That was brave."], deeper: ["Juba in this game is fictional. Cudjoe in this game is fictional.", "The accounts say Hutchinson forced the people he enslaved to carry the dead. Their names were not written down."] },
  { id: "watching", title: "Knowing and proving", simple: ["Everyone on the road knew.", "Knowing was not enough for the court."], deeper: ["A court needs evidence it will accept. Who it will listen to is decided by people in power."] },
  { id: "callendar", title: "John Callendar", simple: ["John Callendar was real. His land joined Hutchinson’s.", "He came about a strayed jackass and was shot dead.", "This is the killing the court tried."], deeper: ["John Callendar does not speak in this game.", "A letter of April 1773 calls him a neighbour. Later books made him an estate manager, then a soldier sent to arrest Hutchinson.", "The letter says a sick man lying in the house slipped out and complained."], source: "letter" },
  { id: "capture", title: "How he was taken", simple: ["A Navy officer, George Turnbull, took Hutchinson.", "Admiral Rodney had sent him to help."], deeper: ["Captain Reid in this game is fictional.", "In December 1773 the Assembly thanked Rodney and voted Turnbull a sword worth fifty pounds.", "A boat chase from Old Harbour is told in later books. The 1773 letter says only that he was caught."], source: "cundall" },
  { id: "watches", title: "Forty-three watches", simple: ["Later accounts say many watches were found in the house.", "One says forty-three. An older one says forty-seven."], deeper: ["The watches and the clothing are not in the letter of 1773. They first appear in 1828.", "The 1773 letter says searchers found about twenty skulls. That too was hearsay.", "Nobody knows how many people he killed."], source: "cundall" },
  { id: "silenced", title: "Who could speak", simple: ["Enslaved people could not give evidence against a white person.", "So the people who knew most were not heard in court."], deeper: ["A writer of the time, Bryan Edwards, put it plainly: “the evidence of the slave cannot be admitted against a White person”.", "The records name one man enslaved at the castle: Hector. He led the searchers to remains. He could show them. He could not swear to it in court.", "Twenty-four people were enslaved there in 1773. What became of them was not written down."], source: "edwards" },
  { id: "hole", title: "The sinkhole", simple: ["A deep hole in the limestone, south of the castle.", "It is still called Hutchinson’s Hole."], deeper: ["Cavers have measured it: about 98 metres deep.", "In 1895 the Governor was lowered into it and saw no bones. Some doubt it was the hole used.", "This game shows only the edge."], source: "jnht" },
  { id: "trial", title: "The trial", simple: ["He was tried in Spanish Town, then the capital.", "He said he was not guilty. He was found guilty of killing John Callendar."], deeper: ["The clerk in this game is fictional.", "The court sat upstairs in the public building facing King’s House. The building here is a general picture of it.", "The record is in the Jamaica Archives: The King against Lewis Hutchison."], source: "cundall" },
  { id: "epitaph", title: "His own words", simple: ["Hutchinson was hanged on Tuesday 16 March 1773.", "He wrote two lines for his own tombstone.", "“Their sentence, pride, and malice I defy, Despise their power and like a Roman die.”"], deeper: ["These are the only words of his in this game. They were printed in 1773.", "He left a hundred pounds for the stone. It was never carved."], source: "letter" },
  { id: "legend", title: "Record and story", simple: ["Record: the trial, the hanging, the watches, the ruin.", "Story: how many died, and much of what is said he did.", "Both matter. They are not the same."], deeper: ["Most of what is told about him was first printed long after 1773.", "The people he killed, and the people he enslaved, left no words of their own in the record."] },
];
export const CARDS = {
  water: { title: "The pen needs water", lines: ["Dr Hutton sends you with Sampson's cart, to the one well that still gives.", "It stands under the towers of Edinburgh Castle."], button: "Go" },
  warrant: { title: "The neighbour", lines: ["John Callendar walks up to the house to ask for his animal. A window opens. There is one gunshot.", "The camera turns away at the shot. You do not see him fall."] },
  morning: { title: "The sixteenth of March", lines: ["Lewis Hutchinson is hanged in Spanish Town. You see the crowd and the shape of the gallows, far off, at dawn.", "You do not see him."] },
  end: { title: "What we really know", lines: ["The record: one killing, one trial, one hanging.", "The story: many more deaths, never counted, first printed years later.", "The people who knew most were not allowed to speak.", "Now you know. That is a kind of record too."] },
};
export const FILMS = {
  warrant: {
    place: "castle", next: 50, journal: "callendar", title: "The neighbour",
    read: ["John Callendar came to the house about a strayed jackass. Hutchinson shot him, and he died.", "A sick man lying in the house slipped out and told. Hutchinson was taken."],
    captions: [[0, "Morning. John Callendar walks up the track."], [10, "He calls out. Nobody answers."], [19, "The upper shutter swings open."], [22.4, "One shot."], [25, "He does not get up. Somebody in the house has seen."]],
    shots: [{ t: 0, p: [14, 1.8, 13.4], look: [0, 2.5, 4] }, { t: 9, p: [2, 1.6, 12.6], look: [-6.5, 1.2, 5] }, { t: 18, p: [-1, 1.5, 9.5], look: [3, 4.4, -5.5] }, { t: 22, p: [-1, 1.5, 9.5], look: [3, 4.6, -5.5] }, { t: 23.2, p: [-1, 1.7, 9.5], look: [60, 30, -60] }, { t: 29, p: [-1, 2, 9.5], look: [80, 40, -60] }],
    fov: [[0, 46], [18, 34], [22, 30], [24, 50]],
    acts: [],
    sounds: [[1, "begin"], [22.3, "shot"], [25, "sad"]],
    duration: 29,
  },
  morning: {
    place: "town", next: 65, journal: "epitaph", title: "The sixteenth of March, 1773",
    read: ["Lewis Hutchinson was hanged in Spanish Town on the morning of 16 March 1773.", "He was not sorry. He left two lines for his tombstone. The stone was never made."],
    captions: [[0, "Spanish Town. The sixteenth morning of March, 1773."], [7, "The square is full before the sun is up."], [14, "Across the square, a frame of timber."], [20, "“Their sentence, pride, and malice I defy.” His words. His stone was never made."]],
    shots: [{ t: 0, p: [12, 2.2, 10], look: [-4, 3, -5] }, { t: 8, p: [2, 1.7, 8], look: [-6, 1.4, 3.6] }, { t: 15, p: [4, 1.8, 6], look: [26, 4, 22] }, { t: 26, p: [8, 2.2, 9], look: [26, 6, 22] }],
    fov: [[0, 46], [15, 30], [26, 26]],
    acts: [],
    sounds: [[1, "drum"], [3, "drum"], [5, "drum"], [14, "bell"], [20, "sad"]],
    duration: 26,
  },
};
export const QUIZ = {
  title: "What do we really know?",
  items: [
    { q: "What was Lewis Hutchinson tried for?", opts: [{ t: "Killing John Callendar", ok: true }, { t: "Every death on the road" }, { t: "Stealing cattle" }], why: "The court tried him for the one killing its witnesses had seen." },
    { q: "Why were Juba and Cudjoe not heard in court?", opts: [{ t: "They saw nothing" }, { t: "The law would not let enslaved people give evidence against a white person", ok: true }, { t: "They were too far away" }], why: "The law shut out the people who knew most." },
    { q: "Which of these was printed in 1773, the year he died?", opts: [{ t: "The two lines he wrote for his tombstone", ok: true }, { t: "The forty-three watches" }, { t: "The name of every traveller" }], why: "The watches first appear in a book of 1828. The travellers were never named." },
    { q: "How many people did he kill?", opts: [{ t: "Exactly forty-three" }, { t: "Nobody knows", ok: true }, { t: "One" }], why: "Every number you may hear is a guess." },
  ],
};
