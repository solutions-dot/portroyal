/* games/bog-walk/src/content.js: everything people read, outside the Tube's own subtitles (those are in main.js, with the night).
   The script is docs/games/bog-walk.md, "The build script (agreed with the owner, 13 Nov 2026)". Rules (docs/CONTENT.md and that doc):
   lines of about 12 words or fewer, one idea each; no em dashes; fictional people have first names or nicknames only and are named as fictional
   in the journal; real people say only words from the record (Mr Douparrouzel's one line, in the Tube) and are otherwise seen, not heard;
   the men who died are never named; nobody is shown hurt; the cause of the water is never stated. */

/* ---------- the six chapters: their name in the Chapters list, and the title card that opens each ---------- */
export const CHAPTERS = [
  { year: '26 June 1904', name: 'The station', title: 'The station', sub: 'Bog Walk, Sunday evening, 26 June 1904' },
  { year: '31 March 1899', name: 'The first electric tram', title: 'Zeke\'s story', sub: 'Kingston, Friday 31 March 1899' },
  { year: '27 June 1904', name: 'Inside the Tube', title: 'Inside the Tube', sub: 'Monday, about 1 a.m.' },
  { year: '27 June 1904', name: 'The water', title: 'The water', sub: 'About 4 a.m.' },
  { year: '27 June 1904', name: 'The morning after', title: 'The morning after', sub: 'Monday 27 June 1904' },
  { year: 'Today', name: 'The ruins today', title: 'The ruins today', sub: 'Bog Walk, today' },
];

/* ---------- goals: one short sentence each. c holds the live counters of the stage. ---------- */
export const GOALS = {
  10: () => 'Rudy is waving by the yard. Go and talk to him.',
  11: () => 'Find Bass Henry. He is by the big pipe.',
  12: () => 'Go into the turbine house. Find Old Zeke.',
  13: () => 'Read the notice board by the turbine house door.',
  14: () => 'It is midnight. Go to the valve wheel. Zeke is there.',
  15: () => 'Hold the button to turn the valve wheel.',
  16: () => 'Well done. The Tube is empty now.',
  20: (c) => `Talk to Mr Bertie, the woman and the conductor: ${c.talked || 0} of 3.`,
  21: () => 'Watch the depot doors!',
  22: () => 'Climb on to the back of the electric car.',
  23: () => 'Ride down the street. Look around!',
  24: () => 'Well done. Back to Bog Walk.',
  30: () => 'Scrape the rust off the pipe.',
  31: () => 'Keep going.',
  40: () => 'Look at the floor. Something is not right.',
  41: () => 'You are out.',
  50: () => 'Find Rudy. He is sitting by the house.',
  51: (c) => `Look at who came to help: ${c.seen || 0} of 4.`,
  52: () => 'The man from the Gleaner wants to talk to you.',
  53: () => 'Someone is waiting at the gate.',
  54: () => 'Listen. A train is coming.',
  55: () => 'Well done. Next, the ruins today.',
  60: () => 'Talk to Miss Grant, the teacher.',
  61: () => 'Read the information board.',
  62: () => 'Kemar has a question. Talk to him.',
  63: () => 'Talk to Miss Grant about what came after.',
  64: () => 'Kemar has one more question.',
  65: () => 'The end. Your journey is in the journal.',
};
export const TALK_TARGETS = { 10: ['rudy'], 11: ['henry'], 12: ['zeke'], 14: ['zekeV'], 20: ['bertie', 'woman', 'conductor'], 50: ['rudy4'], 52: ['reporter'], 53: ['ivy'], 60: ['grant'], 62: ['kemar'], 63: ['grant'], 64: ['kemar'] };

/* ---------- conversations ---------- */
export const TALK = {
  rudy: () => [
    { who: 'Rudy', anim: 'Wave', text: 'There you are! First night on the gang?' },
    { who: 'You', text: 'Yes. My first Sunday night.' },
    { who: 'Rudy', text: 'Stay close to me. You will be fine.' },
    { who: 'Rudy', text: 'Go and see Bass Henry. He leads the gang.' },
  ],
  henry: () => [
    { who: 'Bass Henry', text: 'So you are the new one. Good.' },
    { who: 'Bass Henry', text: 'We go in when the last tram is done.' },
    { who: 'Bass Henry', text: 'Then the water is shut off. The Tube goes empty.', unlock: 'sunday' },
    { who: 'Bass Henry', text: 'We clean out the sand and the rust.' },
    { who: 'Bass Henry', text: 'Old Zeke is in the turbine house. Go and see.' },
  ],
  zeke: () => [
    { who: 'Old Zeke', text: 'Come in, come in. Look at that wheel go!' },
    { who: 'Old Zeke', text: 'This water makes the light for all of Kingston.' },
    { who: 'Old Zeke', text: 'It turns the wheel. The wheel makes the power.', unlock: 'station' },
    { who: 'Old Zeke', text: 'The power runs down the wires to the trams.' },
    { who: 'Old Zeke', text: 'Go and look at the notice board by the door.' },
  ],
  zekeValve: () => [
    { who: 'Old Zeke', text: 'Midnight. The last tram is done.' },
    { who: 'Old Zeke', text: 'Help me turn the wheel. Slow and steady.' },
  ],
  bertie: () => [
    { who: 'Mr Bertie', text: 'Morning, young man. This is my mule car.' },
    { who: 'Mr Bertie', text: 'My mules pulled this car for years.' },
    { who: 'Mr Bertie', text: 'Now the wires will do it.', unlock: 'trams' },
    { who: 'You', text: 'Are you sad?' },
    { who: 'Mr Bertie', text: 'A little. But I want to see it go!' },
  ],
  woman: () => [
    { who: 'The woman', anim: 'Point', text: 'They say it runs with no mule at all!' },
    { who: 'You', text: 'Then what makes it go?' },
    { who: 'The woman', text: 'Look up. See the wire over the road?' },
    { who: 'The woman', text: 'A pole on the car touches the wire.' },
  ],
  conductor: () => [
    { who: 'The conductor', text: 'Mind the track. The car is coming out.' },
    { who: 'The conductor', text: 'Stand by the side of the road, please.' },
  ],
  rudy4: () => [
    { who: 'Rudy', text: 'I am here. I made it.' },
    { who: 'You', text: 'So did I.' },
    { who: 'Rudy', text: 'Many men are still in the pipe.' },
    { who: 'Rudy', text: 'People have come to help. Look.' },
  ],
  reporter: () => [
    { who: 'The man from the Gleaner', text: 'Good morning. I write for the Gleaner.' },
    { who: 'The man from the Gleaner', text: 'What did you see in there?' },
    { who: 'The man from the Gleaner', text: 'People say many things this morning.' },
    { who: 'The man from the Gleaner', text: 'Help me sort what you saw from what you heard.' },
  ],
  reporterDone: () => [{ who: 'The man from the Gleaner', text: 'Thank you. I will only print what you saw.', unlock: 'paper' }],
  ivy: () => [
    { who: 'Miss Ivy', text: 'Have you seen my father? Zeke?' },
    { who: '', text: 'Zeke did not come out.' },
    { who: 'You', text: 'What will you tell her?', choices: [
      { t: 'Tell her what you saw', set: { ivy: 'saw' }, then: [{ who: 'You', text: 'He helped me find the wall.' }, { who: 'Miss Ivy', text: 'Thank you for telling me.' }] },
      { t: 'Tell her he was brave', set: { ivy: 'brave' }, then: [{ who: 'You', text: 'He was calm. He helped the young ones.' }, { who: 'Miss Ivy', text: 'Thank you. I will remember that.' }] },
    ] },
  ],
  grant: () => [
    { who: 'Miss Grant', text: 'Here we are, class. Bog Walk.' },
    { who: 'Miss Grant', text: 'This is where the Tube came down to the power station.' },
    { who: 'Miss Grant', text: 'Those broken walls were the turbine house.' },
    { who: 'Miss Grant', text: 'Go and read the information board.' },
  ],
  kemar: () => [
    { who: 'Kemar', text: 'Miss, why did the water come?' },
    { who: 'Miss Grant', text: 'Good question. Let us sort what we know.' },
  ],
  grant2: () => [
    { who: 'Miss Grant', text: 'Now, what happened after that night?' },
    { who: 'Miss Grant', text: 'Put the events in order.' },
  ],
  kemar2: () => [
    { who: 'Kemar', text: 'Who was to blame?' },
    { who: 'You', text: 'What do you say?', choices: [
      { t: 'Nobody can say for sure.', set: { blame: 'unsure' }, then: [{ who: 'Miss Grant', text: 'That is true. The record does not tell us.' }] },
      { t: 'We should keep asking questions.', set: { blame: 'ask' }, then: [{ who: 'Miss Grant', text: 'Yes. Good history keeps asking.' }] },
    ] },
    { who: 'Miss Grant', text: 'Either way, we remember the men.' },
  ],
};
/* what people say on a later visit, one line at a time */
export const LATER = {
  rudy: () => ['Bass Henry is by the pipe.', 'It gets cold in the Tube at night.'],
  henry: () => ['Zeke is in the turbine house.', 'When the last tram is done, we go in.'],
  zeke: () => ['The board by the door shows the water\'s journey.', 'Listen to that hum. That is the power.'],
  bertie: () => ['Good mules, mine. Good mules.'],
  woman: () => ['I cannot wait to ride it!'],
  conductor: () => ['Stand back now, please.'],
  rudy4: () => ['Sit a while. You are safe now.'],
  reporter: () => ['Only what you saw. That is what I will print.'],
  ivy: () => ['Thank you.'],
  grant: () => ['Take your time. Read everything.'],
  kemar: () => ['I want to know more about this place.'],
  henry4: () => ['...'],
};

/* ---------- people who are real: seen, not heard. What the words on screen say when you look at them. ---------- */
export const SEEN = {
  hammond: 'Dr Hammond looks after the men. He was woken at 4:15 a.m. to come.',
  minister1: 'Two ministers from Linstead talk with the families.',
  minister2: 'Two ministers from Linstead talk with the families.',
  haggart: 'Mr Haggart, the company\'s lawyer, writes names in a book.',
  osborne: 'Mr Osborne-Smith speaks calmly to the crowd at the gate.',
};
export const SEEN_GROUP = { hammond: 'hammond', minister1: 'ministers', minister2: 'ministers', haggart: 'haggart', osborne: 'osborne' };   /* the two ministers count as one */

/* ---------- the puzzles ---------- */
/* the notice board, chapter 0: the journey of the water, in order */
export const JOURNEY = [['The river', 'The Rio Cobre runs down from the hills.'], ['The dam', 'A dam holds the river water back.'], ['The Tube', 'The water runs down the huge pipe.'], ['The wheel', 'The water turns the wheel. The wheel makes the power.'], ['The wires', 'The power runs along wires to Kingston.'], ['The tram', 'The power makes the trams go.']];
/* the reporter, chapter 4: I saw it, or I heard it */
export const REPORT = { title: 'What did you see?', prompt: 'Did you see this yourself, or did you hear it?', bins: [['saw', 'I saw it'], ['heard', 'I heard it']], cards: [
  ['Water at my boots', 'saw', 'Yes. You saw this yourself.'],
  ['"80 men are dead"', 'heard', 'You heard this. The first reports were wrong.'],
  ['The torches going out', 'saw', 'Yes. You saw this yourself.'],
  ['"A board was taken off at the dam"', 'heard', 'You heard this. It is a guess, not a fact.'],
  ['The light at the manhole', 'saw', 'Yes. You saw this yourself.'],
  ['"The water came from the dam"', 'heard', 'You heard this. Nobody knows that yet.'],
] };
/* Kemar's question, chapter 5: what we know, what people guessed, what nobody knows */
export const WHY = { title: 'Why did the water come?', prompt: 'Do we know this, did people guess it, or does nobody know?', bins: [['know', 'We know'], ['guess', 'People guessed'], ['none', 'Nobody knows']], cards: [
  ['33 men died.', 'know', 'We know this. The newspaper counted them.'],
  ['It was a Sunday night shift.', 'know', 'We know this. The water was shut off on Sunday nights.'],
  ['A board at the dam was opened.', 'guess', 'People guessed this. Nobody proved it.'],
  ['The pipe was 8 feet across.', 'know', 'We know this. Many sources say so.'],
  ['Sand made a dam that burst.', 'guess', 'People guessed this too. Nobody proved it.'],
  ['Which guess is true.', 'none', 'Nobody knows. Even the 1904 newspaper said so.'],
] };
/* Miss Grant, chapter 5: what came after, in order */
export const AFTER = [['The first electric trams run in Kingston', '1899'], ['Water comes into the Tube', '1904'], ['The trams run again, within days', '1904'], ['The trams stop for good', '1948'], ['The power station closes', '1966']];

/* ---------- your choices, for the "Your journey" page ---------- */
export const CHOICE_NAMES = {
  story: { heard: 'At midnight you heard Zeke\'s story of the first electric tram.', skip: 'At midnight you went straight into the Tube.' },
  boots: { tell: 'When the water reached your boots, you told Bass Henry.', work: 'When the water reached your boots, you kept working.' },
  ivy: { saw: 'You told Miss Ivy what you saw: Zeke helped you find the wall.', brave: 'You told Miss Ivy that Zeke was calm and brave.' },
  blame: { unsure: 'When Kemar asked who was to blame, you said nobody can say for sure.', ask: 'When Kemar asked who was to blame, you said we should keep asking questions.' },
};

/* ---------- the journal: simple lines for everyone, "Dig deeper" for older readers ---------- */
export const JOURNAL = [
  { id: 'who', title: 'Who is real?', simple: ['Some people in this game are real. Some are made up for the story.', 'You are made up. You stand for the young men who worked in the Tube.', 'Real people never say made-up words here. Most of them are only seen.'],
    deeper: ['Fictional (made up): you, Rudy, Old Zeke, Miss Ivy, Bass Henry, the other men of the gang, Mr Bertie, the woman and the conductor in 1899, the man from the Gleaner, Miss Grant and Kemar.', 'Real: Mr Douparrouzel, the chief electrician. His one line in the Tube comes from his own report: he told the men "there was a little water coming but it was not from the dam".', 'Also real: Dr Hammond, the two ministers from Linstead (the Rev. J.T. Dillon and the Rev. C.R.G. Thomas), Mr Haggart and the Hon. E.G. Osborne-Smith. They are seen doing what the 1904 report says they did. They do not speak.', 'Colin McDonald was one of the real men who got out. He told a reporter the water began to rise within about an hour, and he did not think it was anything to worry about. That is a summary of his words, not a quote.', 'The 33 men who died were real. This game does not name them.'] },
  { id: 'sunday', title: 'Sunday nights', simple: ['Kingston\'s trams ran on power made at Bog Walk.', 'On Sunday nights, after the last tram, the water was shut off.', 'Then a gang of men went into the empty pipe to clean it.'],
    deeper: ['A report from 1904 says the water was normally shut off "at twelve o\'clock on Sunday nights after all traffic has ceased".', 'The gangs cleared out sand and rust, so the water would run freely.', 'Most of the men were labourers, many of them unmarried, from about 20 to 50 years old.', 'We do not know their tools, their pay or their hours, so the game shows a general picture.'] },
  { id: 'station', title: 'The power station', simple: ['Near Bog Walk, water from the Rio Cobre turned a wheel.', 'The wheel made electric power.', 'The power ran along wires to Kingston, to drive the trams.'],
    deeper: ['The station was started in 1898 and finished in 1899. It is called a hydroelectric station: it makes electricity from moving water.', 'Sources give the company two names: the West India Electric Company, and the Electric Tramway Company.', 'The turbine house, the wheel, the switchboard and the valve wheel in this game are a general picture. We have not found plans of the real ones, or where the valve was.', 'The station closed in August 1966.'] },
  { id: 'tube', title: 'The Tube', simple: ['The Tube was a huge iron pipe. People called it the Tube.', 'It carried water from the river down to the power station.', 'It was 8 feet across. A grown-up could stand up inside.'],
    deeper: ['8 feet is about 2.4 metres. Every source agrees on that size.', 'An old photograph caption says the Tube was 6,200 feet long, weighed 1,700,000 pounds and had 260,000 rivets. It even calls it "the largest pipe in the world". That is one caption, so we say "said to be".', 'The manhole, the way in and out, was two feet eight inches across: about 81 centimetres.', 'About 15 yards from the station, the pipe rose a little, then curved sharply down into the station.'] },
  { id: 'trams', title: 'The first electric trams', simple: ['Before 1899, Kingston\'s trams were pulled by mules.', 'In 1899 electric trams came. A pole on the roof touched a wire over the road.', 'The power for the wire came from Bog Walk.'],
    deeper: ['Most sources say the electric trams began on 31 March 1899, a Friday. They ran until 1948.', 'The mule cars were pulled by pairs of mules.', 'Mr Bertie, the woman and the conductor in this game are fictional. So are the colours of the car. We have not found a photograph of the first car to copy.', 'Some sources say the first line ran from the depot on Orange Street to the foot of King Street. This still needs checking against old records.'] },
  { id: 'water', title: 'The water', simple: ['On Monday 27 June 1904, very early, water came into the Tube.', 'About 61 men were inside. 28 got out. 33 did not.', 'Nobody could say for sure why the water came.'],
    deeper: ['The men went in at about 1 a.m. At first the water rose slowly. At about 4 a.m. it came fast, and the pipe filled in about twenty minutes.', 'Some web pages give the date as 24 June. But 24 June 1904 was a Friday. 27 June was a Monday, which fits a Sunday night shift. The original newspaper still needs checking.', 'One retelling says 17 escaped, and another says nobody did. Both are wrong: 61 went in, 28 came out, 33 died.', 'The game never shows anyone in the water. You only hear voices. That is how the men who got out described it: the dark, the noise, the voices, the light.'] },
  { id: 'morning', title: 'The morning after', simple: ['In the morning, people came to help.', 'A doctor looked after the men who got out.', 'A special train brought coffins. The company paid for the burials.'],
    deeper: ['Dr Hammond was woken at 4:15 a.m. Two ministers from Linstead came: the Rev. J.T. Dillon (Baptist) and the Rev. C.R.G. Thomas (Anglican), who arranged graves.', 'Mr Haggart, the company\'s attorney, arranged for the men to be named, and for burials and help. The Hon. E.G. Osborne-Smith spoke calmly to the crowd.', 'The coffins came by special train at 11:50. The company paid for coffins, clothing and burial, and gave money to families who lost their income.', 'The men were buried at their family homes, or in the churchyard at Linstead. Police guarded the site that night.', 'Kingston heard the news between 7 and 8 a.m. By 9, crowds filled the stations and the newspaper offices.', 'Miss Ivy and Old Zeke are fictional. They stand for the families who waited at the gate.'] },
  { id: 'paper', title: 'What the newspaper said', simple: ['The Gleaner wrote about it the next day.', 'The first reports were wrong. They said 80 men had died.', 'A good reporter prints what people saw, not what they heard.'],
    deeper: ['The headline in the Gleaner on 28 June 1904 said: "Fearful Catastrophe At Bog Walk. Drowning Men Fight For Life. Sudden Rush of Water Causes Panic. 33 Able-Bodied Men Drowned In Water-Pipe. No Accurate Information as To Cause Of The Disaster."', 'The paper called it "without precedent in the annals of Jamaica": nothing like it had happened before.', 'The first reports said 80 dead and 300 saved. Those numbers were wrong.', 'The man from the Gleaner in this game is fictional. He stands for the reporters who were there.'] },
  { id: 'why', title: 'Why did it happen?', simple: ['Nobody could say for sure why the water came.', 'People had guesses. Nobody proved them.', 'It is all right to say: we do not know.'],
    deeper: ['Guess one: someone asked for more water to wash out sand, and a board at the intake was taken off for ten or twenty minutes.', 'Guess two: sand built up into a small dam inside the pipe, and the water behind it burst through.', 'One account says the main valve was never fully closed.', 'An inquest (an official enquiry) was planned. We have not found its result. Later pages say it was called an accident, and that many people felt "someone had blundered somewhere".', 'This game does not say which guess is true, and does not blame anyone.'] },
  { id: 'ruins', title: 'The ruins today', simple: ['You can still see what is left at Bog Walk.', 'There are broken walls, concrete supports and a piece of the pipe.', 'The dam on the river is still there.'],
    deeper: ['The trams ran again within days of the disaster. Buses began to take over in the 1930s, and the trams stopped in 1948. The power station closed in 1966.', 'A 2016 article describes the dam, the ruins of the turbine house, some concrete supports and "a shell of the pipe".', 'We found no memorial to the men. If you know of one, tell your teacher.', 'Miss Grant and Kemar are fictional. The information board in this game is ours, but its headline is the real 1904 one.'] },
  { id: 'journey', title: 'Your journey', simple: ['You finished the story.'], deeper: ['Every choice in this game is a fair one. None of them is wrong.', 'Sources: the Gleaner\'s retellings of the 1904 report (2021 and 2022), Rebecca Tortello\'s "Bog Walk Tube" in Pieces of the Past, Wikipedia\'s pages on Bog Walk and the Rio Cobre Dam, and a 2016 jamaicans.com article on the ruins. The original 1904 newspaper has not been read yet.'] },
];
