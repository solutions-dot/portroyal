/* games/eventide/src/content.js: everything people read in Eventide 1980. Plain words for ages 6 and up; harder detail goes in "Dig deeper".
   Rules (docs/CONTENT.md and docs/games/eventide.md): lines of about 12 words or fewer, one idea each; no em dashes; fictional people are named
   as fictional in the journal; real people only appear in "Dig deeper" with words traced to a source; the fire is told gently and honestly;
   nobody is blamed, because nobody has proved what started it. */

/* ---------- chapters: the title card and the place caption of each ---------- */
export const CHAPTERS = [
  { year: 'May 1980', name: 'Slipe Pen Road', title: 'A Saturday in May 1980', sub: 'Gran takes you to visit the Eventide Home.', caption: 'Slipe Pen Road, Kingston, May 1980' },
  { year: 'May 1980', name: 'Inside the ward', title: 'The Myers Ward', sub: 'The old wooden ward, that same afternoon.', caption: 'Inside the Myers Ward' },
  { year: 'Monday 19 May 1980', name: 'Goodnight', title: 'Monday 19 May 1980', sub: 'Evening at the Home.', caption: 'The Eventide Home, Monday evening' },
  { year: 'Tuesday 20 May 1980', name: 'The night', title: 'Tuesday 20 May 1980', sub: 'About one in the morning.', caption: 'Slipe Pen Road, about 1 a.m.' },
  { year: 'Monday 26 May 1980', name: 'A day of mourning', title: 'Monday 26 May 1980', sub: 'A day of national mourning.', caption: 'National Heroes Park, 26 May 1980' },
  { year: 'About 1985', name: 'After', title: 'About five years later', sub: 'A new home for the women who got out.', caption: 'The Golden Age Home, about 1985' },
  { year: 'Today', name: 'The monument', title: '20 May, today', sub: 'The National Day of Remembrance.', caption: 'National Heroes Park, today' },
];

/* ---------- goals: one short sentence each. A function gets the live counters. ---------- */
export const GOALS = {
  10: () => 'Talk to Gran at the bus stop.',
  11: () => 'Cross the road. Talk to the gateman at the big gate.',
  12: () => 'Walk up the avenue. Find Miss Iris on the veranda.',
  13: () => 'Read the letter to Miss Iris.',
  14: () => 'Well done! Next, inside the ward.',
  20: () => 'Meet Miss Hyacinth, Miss Maude and Miss Dora.',
  21: (c) => `Put their things back where they like them: ${c.tidy || 0} of 4.`,
  22: () => 'Talk to the nurse.',
  23: () => 'Well done! Next, a quiet Monday evening.',
  30: () => 'Listen to the radio on the veranda.',
  31: () => 'Talk to the nurse by the steps.',
  32: () => 'Say goodnight to all four ladies.',
  33: () => 'Well done. Sleep well.',
  40: () => 'Stay with Gran. Talk to her.',
  41: () => 'Talk to the firefighter at the gate.',
  42: () => 'Hold the gate open for the children.',
  43: (c) => `Wrap the children in blankets: ${c.blanket || 0} of 3.`,
  44: () => 'Look for the ladies. Talk to the nurse.',
  45: () => 'It is morning. Talk to Gran.',
  46: () => 'The night is over. Next, a day of mourning.',
  50: () => 'Walk with Gran. Talk to her.',
  51: () => 'Listen to the three people near the rail.',
  52: () => 'Talk to the nurse from the Home.',
  53: () => 'Go to the rail by the grave.',
  54: () => 'Well done. Next, five years later.',
  60: () => 'Visit Miss Hyacinth and Miss Maude.',
  61: () => 'Sort the news cards at the table.',
  62: () => 'Talk to Miss Maude. Choose a fair question.',
  63: () => 'Well done! Next, the monument today.',
  70: () => 'Talk to Kayla, the girl by the path.',
  71: () => 'Put the story in order at the board.',
  72: (c) => `Lay a flower for each friend: ${c.flower || 0} of 2.`,
  73: () => 'Read the words on the monument.',
  74: () => 'Talk to Kayla. Answer her question.',
  75: () => 'The end. Thank you for remembering.',
};

/* who you must talk to at each stage, and the stage that follows when you have talked to all of them */
export const TALK_TARGETS = { 10: ['gran1'], 11: ['gateman'], 12: ['iris1'], 20: ['hyacinth2', 'maude2', 'dora2'], 22: ['nurse2'], 31: ['nurse3'], 32: ['iris3', 'hyacinth3', 'maude3', 'dora3'],
  40: ['gran4'], 41: ['fireman'], 44: ['nurse4', 'hyacinth4', 'maude4'], 45: ['gran4'], 50: ['gran5'], 51: ['mourner1', 'mourner2', 'mourner3'], 52: ['nurse5'], 60: ['hyacinth6', 'maude6'], 62: ['maude6'], 70: ['kayla'], 74: ['kayla'] };
export const NEXT_AFTER_TALK = { 10: 11, 11: 12, 12: 13, 20: 21, 22: 23, 31: 32, 32: 33, 40: 41, 41: 42, 44: 45, 45: 46, 50: 51, 51: 52, 52: 53, 60: 61, 62: 63, 70: 71, 74: 75 };
export const CHAPTER_END = { 14: 0, 23: 1, 33: 2, 46: 3, 54: 4, 63: 5 };   /* the stage that ends each chapter */

const GIFT = { mango: 'mangoes', battery: 'radio batteries', song: 'a song' };
const you = (text) => ({ who: 'You', text });

/* ---------- conversations: the first, full talk with each person. story holds what you chose earlier. ---------- */
export const TALK = {
  /* chapter 1 */
  gran1: () => [
    { who: 'Gran', text: 'Here we are, child. Slipe Pen Road.' },
    { who: 'Gran', text: 'My friend Miss Iris lives in the Home across the road.', unlock: 'home' },
    { who: 'Gran', text: 'She has no family to mind her now.' },
    { who: 'Gran', text: 'What shall we bring her today?', choices: [
      { t: 'Sweet mangoes', set: { gift: 'mango' }, then: [{ who: 'Gran', text: 'Hold them in both hands. Mind the juice!' }] },
      { t: 'Batteries for her radio', set: { gift: 'battery' }, then: [{ who: 'Gran', text: 'Good thinking. She loves her radio.' }] },
      { t: 'A song I learned at school', set: { gift: 'song' }, then: [{ who: 'Gran', text: 'A song costs nothing and means a lot.' }] }] },
    { who: 'Gran', text: 'Come. The gate is just there, under the arch.' }],
  gateman: () => [
    { who: 'The gateman', text: 'Good afternoon! Visitors for the Home?' },
    you('Yes, sir. We came to see Miss Iris.'),
    { who: 'The gateman', text: 'Myers Ward. The old wooden one, on the right.' },
    { who: 'The gateman', text: 'About seven hundred people live here.', unlock: 'who' },
    { who: 'The gateman', text: 'Old ladies, old men, and children too. Go right up.' }],
  iris1: (s) => [
    { who: 'Miss Iris', text: 'I cannot see you, child. But I know your footsteps.', unlock: 'iris' },
    you('Good afternoon, Miss Iris. We brought you ' + GIFT[s.gift || 'mango'] + '.'),
    { who: 'Miss Iris', text: s.gift === 'song' ? 'A song! Sing it for me before you go.' : s.gift === 'battery' ? 'Batteries! Now I can hear the news again.' : 'Mangoes! I can smell them from here.' },
    { who: 'Miss Iris', text: 'I was a dressmaker, you know. Forty years.' },
    { who: 'Miss Iris', text: 'My eyes got tired. My hands still remember.' },
    { who: 'Miss Iris', text: 'A letter came for me. Will you read it?' }],
  /* chapter 2 */
  hyacinth2: () => [
    { who: 'Miss Hyacinth', text: 'Come in, come in! Mind the beds, they are close.', unlock: 'crowded' },
    { who: 'Miss Hyacinth', text: 'Thirty years I sold yam in the market.', unlock: 'hyacinth' },
    { who: 'Miss Hyacinth', text: 'My feet remember every single morning.' },
    { who: 'Miss Hyacinth', text: 'Somebody moved my photograph again. Can you find it?' }],
  maude2: () => [
    { who: 'Miss Maude', text: 'Stand up straight, child. I was a teacher.', unlock: 'maude' },
    { who: 'Miss Maude', text: 'I taught half this street to read.' },
    { who: 'Miss Maude', text: 'Ask me a sum some day. Any sum!' },
    { who: 'Miss Maude', text: 'I cannot find my Bible. It has my name inside.' }],
  dora2: () => [
    { who: 'Miss Dora', text: 'Hello, little one. Do you like songs?', unlock: 'dora' },
    { who: 'Miss Dora', text: 'I sang in the church choir when I was young.' },
    { who: 'Miss Dora', text: 'Now I sing for the ladies at night.' },
    { who: 'Miss Dora', text: 'My comb is gone. And Iris wants her little radio.' }],
  nurse2: () => [
    { who: 'Nurse Bell', text: 'Thank you for helping. They like their things just so.' },
    { who: 'Nurse Bell', text: 'We have more ladies than beds.', unlock: 'staff' },
    { who: 'Nurse Bell', text: 'We do our best with what we have.' },
    { who: 'Nurse Bell', text: 'Whose story will you sit and hear before you go?', choices: [
      { t: 'Miss Iris, the dressmaker', set: { sit: 'iris' }, then: [{ who: 'Nurse Bell', text: 'She will tell you about every dress she made.' }] },
      { t: 'Miss Hyacinth, from the market', set: { sit: 'hyacinth' }, then: [{ who: 'Nurse Bell', text: 'She will tell you the price of everything!' }] },
      { t: 'Miss Maude, the teacher', set: { sit: 'maude' }, then: [{ who: 'Nurse Bell', text: 'Sit up straight, then. She will test you.' }] },
      { t: 'Miss Dora, who sings', set: { sit: 'dora' }, then: [{ who: 'Nurse Bell', text: 'She will teach you a hymn, I am sure.' }] }] }],
  /* chapter 3 */
  nurse3: () => [
    { who: 'Nurse Bell', text: 'Good evening. You came after school today?' },
    you('Yes, Nurse. Gran said we could say goodnight.'),
    { who: 'Nurse Bell', text: 'The city is troubled this year. People are worried.', unlock: 'year' },
    { who: 'Nurse Bell', text: 'But here it is quiet. Go and say goodnight.' }],
  iris3: (s) => [
    { who: 'Miss Iris', text: 'Is that my reader? Come close.' },
    { who: 'Miss Iris', text: s.sit === 'iris' ? 'You sat with me so long on Saturday. Thank you.' : 'Did you hear the news on the radio?' },
    { who: 'Miss Iris', text: 'Will you come again soon?', choices: [
      { t: 'I will come on Saturday.', set: { promise: 'saturday' }, then: [{ who: 'Miss Iris', text: 'Saturday. I will listen for your footsteps.' }] },
      { t: 'I will bring you another song.', set: { promise: 'song' }, then: [{ who: 'Miss Iris', text: 'A new song! I will wait for it.' }] },
      { t: 'I will read you another letter.', set: { promise: 'letter' }, then: [{ who: 'Miss Iris', text: 'Then I hope the postman is kind.' }] }] },
    { who: 'Miss Iris', text: 'Goodnight, child. Walk good.' }],
  hyacinth3: (s) => [
    { who: 'Miss Hyacinth', text: s.sit === 'hyacinth' ? 'My market friend! Goodnight, goodnight.' : 'Goodnight, child. Thank you for finding my photograph.' },
    { who: 'Miss Hyacinth', text: 'Tell your Gran I said to rest her feet.' }],
  maude3: (s) => [
    { who: 'Miss Maude', text: s.sit === 'maude' ? 'You listened well on Saturday. Top marks.' : 'Quick: what is seven and eight?' },
    you(s.sit === 'maude' ? 'Thank you, Miss Maude. Goodnight.' : 'Fifteen, Miss Maude!'),
    { who: 'Miss Maude', text: 'Goodnight. Read something before you sleep.' }],
  dora3: (s) => [
    { who: 'Miss Dora', text: s.sit === 'dora' ? 'Do you remember our hymn? Hum it going home.' : 'Listen. The ladies are singing the evening hymn.' },
    { who: 'Miss Dora', text: 'Goodnight, little one. God bless.' }],
  /* chapter 4 */
  gran4: (s, stage) => (stage >= 45 ? [
    { who: 'Gran', text: 'It is morning, child. The fire is out.' },
    you('Gran, why did they not go in for them?'),
    { who: 'Gran', text: 'They could not get in, child. It was too fast.', unlock: 'night' },
    { who: 'Gran', text: 'Nobody could have stopped it. Not you. Not anyone.' },
    { who: 'Gran', text: 'Look. The bus is running. Life goes on, somehow.' },
    { who: 'Gran', text: 'Come home. We will pray for them all.' }] : [
    { who: 'Gran', text: 'Stay close to me. Do not pass the rope.' },
    you('Gran, is it the Home?'),
    { who: 'Gran', text: 'It is the old wooden ward. Lord, have mercy.' },
    { who: 'Gran', text: 'The firemen are here. See if we can help.' }]),
  fireman: () => [
    { who: 'The firefighter', text: 'Stay behind the rope, please. All of you.' },
    { who: 'The firefighter', text: 'We are bringing the children out of the next building.', unlock: 'helpers' },
    { who: 'The firefighter', text: 'You, child. Can you hold this gate wide open?' },
    you('Yes, sir. I can do that.')],
  nurse4: () => [
    { who: 'Nurse Bell', text: 'You are here. Thank God somebody is here.' },
    you('Nurse, where is Miss Iris? And Miss Dora?'),
    { who: 'Nurse Bell', text: 'We are checking every name. Please be patient.' },
    { who: 'Nurse Bell', text: 'Miss Hyacinth and Miss Maude are just there. Go to them.' }],
  hyacinth4: () => [
    { who: 'Miss Hyacinth', text: 'Child. I ran. My old market feet ran.' },
    { who: 'Miss Hyacinth', text: 'I left my photograph. It does not matter now.' }],
  maude4: () => [
    { who: 'Miss Maude', text: 'Child, you came. Sit with me.' },
    { who: 'Miss Maude', text: 'I am counting the ladies. I keep losing count.' }],
  /* chapter 5 */
  gran5: () => [
    { who: 'Gran', text: 'Today the whole country is in mourning.', unlock: 'mourning' },
    { who: 'Gran', text: 'Mourning means being sad together.' },
    { who: 'Gran', text: 'Thousands of people came. Look at them all.' },
    { who: 'Gran', text: 'Listen to the people. Then find Nurse Bell.' }],
  mourner1: () => [
    { who: 'A retired nurse', text: 'I worked with old people all my life.' },
    { who: 'A retired nurse', text: 'They were somebody\'s mother. Somebody\'s teacher.' },
    { who: 'A retired nurse', text: 'We must do better for the ones still here.' }],
  mourner2: () => [
    { who: 'A neighbour', text: 'I live on Slipe Pen Road. I saw the sky that night.' },
    { who: 'A neighbour', text: 'The radio station started a fund to rebuild.', unlock: 'fund' },
    { who: 'A neighbour', text: 'I gave what I could. Plenty people did.' }],
  mourner3: () => [
    { who: 'A man in a dark suit', text: 'My aunt lived at the Home. Aunt Vie.' },
    { who: 'A man in a dark suit', text: 'I should have visited more. I know that now.' },
    { who: 'A man in a dark suit', text: 'Visit your old people, child. While you can.' }],
  nurse5: (s) => [
    { who: 'Nurse Bell', text: 'I have to tell you something hard.' },
    { who: 'Nurse Bell', text: 'Miss Iris and Miss Dora did not get out.' },
    you('...'),
    { who: 'Nurse Bell', text: 'I am so sorry. They were your friends.' },
    { who: 'Nurse Bell', text: s.promise === 'song' ? 'Miss Iris told everyone you promised her a song.' : s.promise === 'letter' ? 'Miss Iris said you would read to her again.' : 'Miss Iris was waiting for Saturday. She told me so.' },
    { who: 'Nurse Bell', text: 'They knew you cared. That is a real thing.', unlock: 'friends' },
    { who: 'Nurse Bell', text: 'Go to the rail with Gran. Say goodbye your own way.' }],
  /* chapter 6 */
  hyacinth6: (s) => [
    { who: 'Miss Hyacinth', text: 'Look how you have grown! Come, come.', unlock: 'golden' },
    { who: 'Miss Hyacinth', text: 'A new home. Concrete walls. Small houses, with gardens.' },
    { who: 'Miss Hyacinth', text: s.sit === 'hyacinth' ? 'You sat with me that Saturday. I never forgot.' : 'I grow callaloo by my door now.' },
    { who: 'Miss Hyacinth', text: 'I still miss Iris and Dora every day.' }],
  maude6: (s, stage) => (stage >= 62 ? [
    { who: 'Miss Maude', text: 'Well sorted! Now, a harder lesson.' },
    { who: 'Miss Maude', text: 'A court met in May 1981 about the fire.', unlock: 'inquest' },
    { who: 'Miss Maude', text: 'It found that nobody could be blamed in law.' },
    { who: 'Miss Maude', text: 'People still ask what started it. Which question is fair?', choices: [
      { t: 'What do we know for sure?', set: { ask: 'know' }, then: [{ who: 'Miss Maude', text: 'A fair question. Start with what is known.' }] },
      { t: 'Who told you that, and how do they know?', set: { ask: 'source' }, then: [{ who: 'Miss Maude', text: 'A fair question. Always ask where a story comes from.' }] },
      { t: 'What can we do so it never happens again?', set: { ask: 'never' }, then: [{ who: 'Miss Maude', text: 'A fair question, and the kindest one.' }] }] },
    { who: 'Miss Maude', text: 'Nobody has proved what started the fire.', unlock: 'cause' },
    { who: 'Miss Maude', text: 'So we do not guess. We remember, and we take care.' }] : [
    { who: 'Miss Maude', text: 'There you are. Still reading before bed, I hope?' },
    you('Yes, Miss Maude.'),
    { who: 'Miss Maude', text: 'People say many things about the fire.' },
    { who: 'Miss Maude', text: 'Some are facts. Some are opinions. Some are only rumours.' },
    { who: 'Miss Maude', text: 'I made cards. Sort them at the table for me.' }]),
  /* chapter 7 */
  kayla: (s, stage) => (stage >= 74 ? [
    { who: 'Kayla', text: 'You knew them. You really knew them.' },
    { who: 'Kayla', text: 'Why do we still remember them, after so long?', choices: [
      { t: 'Because each one was a person, with a name.', set: { why: 'name' }, then: [{ who: 'Kayla', text: 'Miss Iris. Miss Dora. I will remember the names.' }] },
      { t: 'So we take better care of old people.', set: { why: 'care' }, then: [{ who: 'Kayla', text: 'I will visit my grandfather this week.' }] },
      { t: 'So it never happens again.', set: { why: 'never' }, then: [{ who: 'Kayla', text: 'Then I will tell my class what you told me.' }] }] },
    { who: 'Kayla', text: 'Thank you for telling me who they were.', unlock: 'journey' }] : [
    { who: 'Kayla', text: 'Excuse me. Why are all these people here today?' },
    you('Today is the 20th of May. A day to remember.'),
    { who: 'Kayla', text: 'Who is in the big grave?', unlock: 'remember' },
    you('Old ladies from a home called Eventide. I knew some of them.'),
    { who: 'Kayla', text: 'You knew them? Tell me what happened!' },
    you('Come to the board. We will put the story in order.')]),
};

/* ---------- later visits: one short line each time, taken in turn ---------- */
export const LATER = {
  gran1: () => ['Hold my hand to cross the road.', 'Miss Iris will be glad to see you.'],
  gateman: () => ['Myers Ward is the wooden one, on the right.', 'Mind the ladies on the avenue.'],
  iris1: () => ['I know that step. Hello again.', 'The breeze is nice on this veranda.'],
  hyacinth2: () => ['Yellow yam was my best seller.', 'Mind the beds. They are close.'],
  maude2: () => ['Reading is a door, child.', 'What is nine and six? Quick!'],
  dora2: () => ['I am humming the evening hymn.', 'Do you know any choruses?'],
  nurse2: () => ['We do our best with what we have.', 'There are more ladies than beds.'],
  nurse3: () => ['It is quiet tonight.', 'Say goodnight to all four, now.'],
  iris3: () => ['Goodnight, child. Walk good.'], hyacinth3: () => ['Rest your feet, child.'], maude3: () => ['Read something tonight.'], dora3: () => ['God bless, little one.'],
  gran4: (s, stage) => (stage >= 45 ? ['Come home, child.'] : ['Stay close to me.', 'Do not pass the rope.']),
  fireman: () => ['Keep behind the rope, please.', 'Thank you for your help.'],
  police: () => ['Keep the road clear, please.', 'Stay back. Let the firemen work.'],
  nurse4: () => ['We are checking every name.'], hyacinth4: () => ['My old feet ran.'], maude4: () => ['Sit with me, child.'],
  gran5: () => ['We are sad together today.', 'Stay by me in the crowd.'],
  mourner1: () => ['We must do better.'], mourner2: () => ['Plenty people gave to the fund.'], mourner3: () => ['Visit your old people.'],
  nurse5: () => ['They knew you cared.'],
  hyacinth6: () => ['My callaloo is coming up nicely.', 'It is good to have a garden.'],
  maude6: () => ['Facts first. Then opinions. Never rumours.', 'Ask where a story comes from.'],
  kayla: () => ['I will remember the names.', 'Thank you for telling me.'],
};

/* ---------- the letter Miss Iris asks you to read (chapter 1). The letter and its writer are fictional. ---------- */
export const LETTER = ['Dear Miss Iris,', 'I still wear the blue dress you made for my wedding.', 'My daughter wants one just the same when she is big.', 'You taught me to sew a straight seam. I teach her now.', 'With love from Port Antonio, your Pauline.'];

/* ---------- chapter 2: the things to put back. where is the name of a spot in the ward. ---------- */
export const TIDY = [
  { label: 'Take the photograph to Miss Hyacinth', where: 'hyacinth', text: 'A photograph of a market stall, piled with yam.', page: 'hyacinth' },
  { label: 'Take the Bible to Miss Maude', where: 'maude', text: 'A Bible. Inside the cover: "Maude, 1921. First prize, reading."', page: 'maude' },
  { label: 'Take the comb to Miss Dora', where: 'dora', text: 'A tortoiseshell comb, kept in a hymn book.', page: 'dora' },
  { label: 'Put the radio by Miss Iris\'s bed', where: 'irisbed', text: 'A small radio. Miss Iris listens to the news every night.', page: 'iris' }];

/* ---------- chapter 3: what the radio says. The voice is fictional; it gives no detail that is not in the sources. ---------- */
export const RADIO = ['This is the evening news.', 'There was more trouble in the city today.', 'Leaders have asked everyone to keep calm.', 'And now, the weather. A warm, dry night.'];

/* ---------- chapter 6: fact, opinion or rumour. kind: 0 fact, 1 opinion, 2 rumour. ---------- */
export const SORT_KINDS = ['Fact', 'Opinion', 'Rumour'];
export const SORT = [
  { text: '"The fire began just after one in the morning."', kind: 0, why: 'A fact. Witnesses and the police said so at the time.' },
  { text: '"I think that old ward should have been replaced long ago."', kind: 1, why: 'An opinion. It is what one person thinks.' },
  { text: '"Somebody told me they know who did it."', kind: 2, why: 'A rumour. Nobody has ever proved who, or if, anyone did it.' },
  { text: '"More than 140 women died."', kind: 0, why: 'A fact. Reports give numbers from 144 to 157.' },
  { text: '"It was the saddest day Kingston ever had."', kind: 1, why: 'An opinion. Many would agree, but it cannot be measured.' },
  { text: '"I heard the fire was started on purpose."', kind: 2, why: 'A rumour. It may or may not be true. It was never proved.' }];

/* ---------- chapter 7: the story in order ---------- */
export const TIMELINE = [
  { year: '1870', text: 'The Home opens on Slipe Pen Road.' },
  { year: '20 May 1980', text: 'The Myers Ward burns in the night.' },
  { year: '26 May 1980', text: 'A day of national mourning. One grave in the park.' },
  { year: 'May 1981', text: 'A court finds nobody can be blamed in law.' },
  { year: 'About 1985', text: 'A new Golden Age Home opens for old people.' },
  { year: '20 May 2026', text: 'The first National Day of Remembrance.' }];
export const PLAQUE = ['DEDICATED', 'TO THE VICTIMS', 'OF', 'THE EVENTIDE HOME FIRE', 'MAY THEIR SOULS', 'REST IN PEACE'];

/* what the "Your journey" page says about each choice */
export const CHOICE_NAMES = {
  gift: { mango: 'You brought Miss Iris sweet mangoes.', battery: 'You brought Miss Iris batteries for her radio.', song: 'You brought Miss Iris a song.' },
  sit: { iris: 'You sat and listened to Miss Iris, the dressmaker.', hyacinth: 'You sat and listened to Miss Hyacinth, from the market.', maude: 'You sat and listened to Miss Maude, the teacher.', dora: 'You sat and listened to Miss Dora, who sang.' },
  promise: { saturday: 'You promised to come back on Saturday.', song: 'You promised Miss Iris another song.', letter: 'You promised to read her another letter.' },
  part: { flower: 'At the grave you laid a flower.', sing: 'At the grave you sang with the crowd.', quiet: 'At the grave you stood quietly.' },
  ask: { know: 'You asked: what do we know for sure?', source: 'You asked: who told you, and how do they know?', never: 'You asked: how can we stop it happening again?' },
  why: { name: 'You said we remember because each one was a person, with a name.', care: 'You said we remember so we take better care of old people.', never: 'You said we remember so it never happens again.' },
};

/* ---------- the journal. simple: for everyone. deeper: for older readers and teachers. ---------- */
export const JOURNAL = [
  { id: 'you', title: 'You and Gran', simple: ['You are a child who lives near Slipe Pen Road, in Kingston.', 'Gran visits her friend at the Eventide Home.', 'You go with her.'],
    deeper: ['You and Gran are fictional.', 'The Eventide Home, the fire of 20 May 1980 and the monument are real.'] },
  { id: 'home', title: 'The Eventide Home', simple: ['The Home opened on 1 July 1870.', 'It was for old women who were poor.', 'Later, old men and children lived there too.'],
    deeper: ['It stood on Slipe Pen Road, Kingston 5. The city paid for it from the "poor rates", a tax to help the poor.', 'The entrance in the game follows an old photograph: a white wall, two tall pillars and an iron arch with the words EVENTIDE HOME.', 'Sources: Jamaica National Heritage Trust; Ministry of Local Government.'] },
  { id: 'who', title: 'Who lived there', simple: ['By 1980 about 700 people lived at the Home.', 'About 180 people worked there.', 'It had three main buildings.'],
    deeper: ['Most residents had no family able to care for them. Some were blind or could not walk well.', 'Newspapers had reported for years that the Home was crowded and short of money.', 'The gateman is fictional. Source for the numbers: Jamaica National Heritage Trust.'] },
  { id: 'iris', title: 'Miss Iris', simple: ['Miss Iris was a dressmaker for forty years.', 'She is blind now. She knows people by their footsteps.', 'She loves her radio.'],
    deeper: ['Miss Iris in this game is fictional. She stands for the real women of Eventide.', 'Some of the real women in the ward were blind. A survivor said so in 1980 (see "The night of the fire").', 'The letter from Pauline is fictional too.'] },
  { id: 'crowded', title: 'A crowded ward', simple: ['The Myers Ward was old, and made of wood.', 'More women lived in it than it was built for.', 'So the beds stood very close together.'],
    deeper: ['The law allowed 180 people in the ward. Reports say 204 to 211 women lived there in May 1980.', 'Kingston\'s fire chief, Allen Ridgeway, called the building a "tinder box", meaning it could burn very easily.', 'No photograph of the inside was found, so the room in the game is our best guess.'] },
  { id: 'hyacinth', title: 'Miss Hyacinth', simple: ['Miss Hyacinth sold yam in the market for thirty years.', 'She keeps a photograph of her stall.'],
    deeper: ['Miss Hyacinth in this game is fictional. She stands for the real women of Eventide.', 'Many of the women had worked all their lives: in markets, fields, kitchens and other people\'s houses.'] },
  { id: 'maude', title: 'Miss Maude', simple: ['Miss Maude was a teacher.', 'She taught many children to read.', 'Her Bible was a prize for reading.'],
    deeper: ['Miss Maude in this game is fictional. She stands for the real women of Eventide.', 'In 2020 Jean Lowrie-Chin laid a wreath at the monument and said: "These elderly women, they must have done so much to build this country." (Gleaner, 20 May 2020)'] },
  { id: 'dora', title: 'Miss Dora', simple: ['Miss Dora sang in a church choir.', 'At night she sings for the other ladies.'],
    deeper: ['Miss Dora in this game is fictional. She stands for the real women of Eventide.'] },
  { id: 'staff', title: 'The people who cared', simple: ['Nurses and helpers looked after the old people.', 'There were not enough beds, or enough money.', 'They did their best.'],
    deeper: ['Nurse Bell is fictional.', 'A real helper in the ward, Vida Wedderburn, told a reporter in 1980 how staff rushed in to bring people out, and how fast the fire was.', 'This game does not blame the staff. Source: Associated Press, 21 May 1980.'] },
  { id: 'year', title: 'A hard year', simple: ['1980 was a hard year in Jamaica.', 'People were choosing a new government.', 'Some people fought about it. Many were afraid.'],
    deeper: ['A general election was held on 30 October 1980. The months before it were very violent: police counted hundreds of deaths.', 'The radio voice in the game is fictional.', 'Sources: Jamaica Observer; Jamaica National Heritage Trust.'] },
  { id: 'helpers', title: 'The helpers', simple: ['Fire engines came quickly from Kingston and St Andrew.', 'Firefighters carried children out of the next building.', 'They stopped the fire from spreading to the rest of the Home.'],
    deeper: ['The children in that building were disabled.', 'Holding the gate and giving out blankets are fictional. They are things a child might really have done to help.', 'Sources: reports from May 1980; Jamaica National Heritage Trust.'] },
  { id: 'night', title: 'The night of the fire', simple: ['The fire began just after 1 in the morning, on Tuesday 20 May 1980.', 'The old wooden ward burned very fast.', 'Some women got out. More than 140 did not.'],
    deeper: ['Firefighters could not get inside. The building fell about four minutes after they arrived.', 'Police said that day that 205 women were in the building: 144 died, 9 were missing and 52 were rescued. Later reports give from 144 to 157 deaths, and say about 58 got out.', 'Joyce Aikman lived in the ward and got out. She told a reporter: "A few of us run out, some creep, and a blind woman, she blind but she active, she run out too." (Associated Press, 21 May 1980)'] },
  { id: 'mourning', title: 'A day of mourning', simple: ['Monday 26 May 1980 was a day of national mourning.', 'Thousands of people came to National Heroes Park.', 'The women were laid to rest together, in one grave.'],
    deeper: ['About 145 women were buried in 26 wooden coffins. The grave was sealed with concrete and steel.', 'There was a service at Holy Trinity Cathedral. The Governor General and the Prime Minister read the lessons, and the Leader of the Opposition read the Gospel.', 'Gran, the mourners and their words are fictional. Sources: the Gleaner, May 1980, as reprinted in 2020 and 2023.'] },
  { id: 'fund', title: 'People gave', simple: ['A radio station started a fund to rebuild the Home.', 'People all over Jamaica gave money.'],
    deeper: ['The station was RJR. In August 1980 it was given an award for the Eventide Home Rebuilding Fund.', 'Source: a photograph record at the National Library of Jamaica.'] },
  { id: 'friends', title: 'Iris and Dora', simple: ['Miss Iris and Miss Dora did not get out.', 'It is right to be sad about them.', 'They knew that you cared.'],
    deeper: ['Miss Iris and Miss Dora are fictional, but their story is the story of many real women.', 'No list of the women who died was found in the sources we read. Some families buried their own relatives.'] },
  { id: 'golden', title: 'A new home', simple: ['About five years later a new home opened.', 'It is called the Golden Age Home.', 'It has small houses instead of one big ward.'],
    deeper: ['It is in Vineyard Town, Kingston. Sources give 1984 or 1985 for the move.', 'After the fire a committee said old people should live in small "cottage" units, not big wards.', 'People have said since that care for old people still needs to be better. In 2026, about 20 people who once lived at Eventide still lived in the Golden Age Homes.'] },
  { id: 'inquest', title: 'What the court said', simple: ['In May 1981 a court looked at how the women died.', 'It found that nobody could be blamed in law.'],
    deeper: ['This kind of court is called an inquest. Its jury met on 5 May 1981 and decided in 17 minutes that no one was criminally responsible.', 'Source: the Gleaner, 20 May 2020.'] },
  { id: 'facts', title: 'Fact, opinion, rumour', simple: ['A fact can be checked.', 'An opinion is what someone thinks.', 'A rumour is a story nobody has checked.'],
    deeper: ['The six cards are fictional sayings. The two facts on them come from reports of the time.', 'When history is uncertain, good questions are: What do we know for sure? Who says so? How do they know?'] },
  { id: 'cause', title: 'What started the fire?', simple: ['Nobody has proved what started the fire.', 'People still disagree.', 'So this game does not guess.'],
    deeper: ['On the day, the Prime Minister, Michael Manley, said the fire was "of unknown origin up to the present time" and that "the possibility of arson cannot be ruled out". Arson means starting a fire on purpose.', 'The Leader of the Opposition, Edward Seaga, said: "We only hope it was of an accidental nature."', 'The fire chief thought an electrical fault was possible. In 2026 the fire was still officially "of unknown origin". Sources: Associated Press, 21 May 1980; the Gleaner; Jamaica Information Service.'] },
  { id: 'remember', title: 'The monument', simple: ['A white monument stands by the grave in National Heroes Park.', 'Its plaque says: "Dedicated to the victims of the Eventide Home fire. May their souls rest in peace."', '20 May is now a National Day of Remembrance.'],
    deeper: ['The first Day of Remembrance was held on 20 May 2026. Forty women of the Jamaica Fire Brigade formed a guard of honour and people laid flowers.', 'The monument in the game follows a 2025 photograph.', 'Kayla is fictional. Sources: Jamaica Information Service; Ministry of Local Government; Jamaica Observer.'] },
  { id: 'journey', title: 'Your journey', simple: ['You finished the story.'],
    deeper: ['Your choices changed what people said to you. They could not change what happened: big events in this game stay as they really were.', 'A footnote is a small note at the bottom of a page. For a long time the Eventide fire was treated like one. You have read past the footnote.'] },
];
