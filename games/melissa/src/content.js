/* games/melissa/src/content.js: everything people read. Plain words for ages 6 and up; harder detail goes in "Dig deeper".
   Rules (see docs/CONTENT.md): lines of about 12 words or fewer, one idea each; no em dashes; fictional people are named as fictional
   in their journal pages; real people never speak (nobody real is quoted in this game); hard history is told gently and honestly.
   Every number about the real storms is checked against a source in docs/games/melissa.md. */

/* ---------- chapters: the title card and the place caption of each ---------- */
export const CHAPTERS = [
  { year: 'August 1951', name: 'Charlie', title: 'Friday 17 August 1951', sub: 'The day Hurricane Charlie came.', caption: 'A fishing bay near Kingston, Friday 17 August 1951', caption2: "Miss Ivy's house, Friday night" },
  { year: 'September 1988', name: 'Gilbert', title: 'Sunday 11 September 1988', sub: 'The day before Hurricane Gilbert.', caption: 'Breadnut Corner, Sunday 11 September 1988', caption2: "Mass Clifford's house, Monday 12 September 1988" },
  { year: 'October 2025', name: 'Melissa is coming', title: 'Saturday 25 October 2025', sub: 'A big storm is out at sea.', caption: 'Breadnut Corner, Saturday 25 October 2025' },
  { year: 'Tuesday 28 October 2025', name: 'The storm', title: 'Monday 27 October 2025', sub: 'Night in the church hall.', caption: 'The church hall, Monday 27 October 2025' },
  { year: 'Tuesday 28 October 2025', name: 'After the storm', title: 'Tuesday 28 October 2025', sub: 'The wind has gone. What is left?', caption: 'Breadnut Corner, after the storm' },
  { year: 'The days after', name: 'Neighbours helping', title: 'The days after', sub: 'Everyone has work to do.', caption: 'Breadnut Corner, the days after Melissa' },
  { year: 'Today', name: 'Ready for next time', title: 'Today', sub: 'Breadnut Corner gets ready.', caption: 'Breadnut Corner, today' },
];

/* ---------- goals: one short sentence each. A function gets the live counters. ---------- */
export const GOALS = {
  10: () => 'Talk to Papa, Mama and Mass Cyril.',
  11: (P) => `Get ready: ${P.jobs || 0} of 3 jobs.`,
  12: () => 'Talk to Miss Ivy at her block house.',
  13: () => "Go inside Miss Ivy's house with your family.",
  14: () => 'The wind is rising. Sit down with your family.',
  15: () => 'The wind has dropped. Talk to Papa.',
  16: () => 'Well done! Next, Gilbert, in 1988.',
  20: () => 'Talk to Dad, Mama and Delroy.',
  21: (P) => `Get ready: ${P.jobs || 0} of 3 jobs.`,
  22: () => "Talk to Mass Clifford at his block house.",
  23: () => 'Go inside Mass Clifford\'s house with your family.',
  24: () => 'The wind is rising. Sit down with your family.',
  25: () => 'The wind has dropped. Talk to Dad.',
  26: () => 'Well done! Next, Melissa, in 2025.',
  30: () => 'Talk to Mum and Grandpa.',
  31: (P) => `Get ready: ${P.jobs || 0} of 4 jobs.`,
  32: () => 'Talk to Mr. Raymond about his roof.',
  33: (P) => `Hand up the nails to Mr. Raymond: ${P.nail || 0} of 3.`,
  34: () => 'Listen to the radio on the porch.',
  35: () => 'Walk to the church hall. It is the shelter.',
  36: () => 'Well done! Next, the night in the shelter.',
  40: () => 'Talk to Mum, Pastor Gayle and Nurse Simone.',
  41: (P) => `Help in the hall: ${P.jobs || 0} of 2 jobs.`,
  42: () => 'The night goes by.',
  43: () => 'The wind is very loud. Sit down with Mum and Gran.',
  44: () => 'The worst is over. Talk to Mum and Pastor Gayle.',
  45: () => 'Well done! Next, going home.',
  50: () => 'Talk to Mum and Grandpa.',
  51: () => 'Walk home along the lane. Look and listen.',
  52: () => 'You are home. Look at the house.',
  53: () => 'Talk to Mum.',
  54: () => 'Check on Miss Hyacinth, along the lane.',
  55: () => 'Well done! Next, the days after.',
  60: () => 'Talk to Mr. Raymond.',
  61: (P) => `Help your neighbours: ${P.jobs || 0} of 4 jobs.`,
  62: () => 'Talk to Jordan, by the church.',
  63: () => 'Listen. Something is coming.',
  64: () => 'The light! Go and switch it on at home.',
  65: () => 'Well done! Next, today.',
  70: () => 'Talk to Miss Campbell.',
  71: () => 'Read the Ready Plan board.',
  72: () => 'Pack the family kit.',
  73: () => 'Andre has a question. Talk to Andre.',
  74: () => 'You have finished the story. Thank you for playing! Your journey is in the Journal.',
};
export const TALK_TARGETS = { 10: ['papa51', 'mama51', 'cyril'], 12: ['ivy'], 15: ['papaR51'], 20: ['dad', 'mama', 'delroy'], 22: ['clifford'], 25: ['dadR'], 30: ['pearl', 'winston'], 32: ['raymond'], 40: ['pearlH', 'pastor', 'simone'], 44: ['pearlH', 'pastor'], 50: ['pearlA', 'winstonA'], 53: ['pearlA'], 54: ['hyacinthA'], 60: ['raymondA'], 62: ['youth'], 70: ['teacher'], 73: ['student'] };
export const NEXT_AFTER_TALK = { 10: 11, 12: 13, 15: 16, 20: 21, 22: 23, 25: 26, 30: 31, 32: 33, 40: 41, 44: 45, 50: 51, 53: 54, 54: 55, 60: 61, 62: 63, 70: 71, 73: 74 };
export const CHAPTER_END = { 16: 0, 26: 1, 36: 2, 45: 3, 55: 4, 65: 5 };   /* the last stage of each chapter but the final one, and the index of the chapter it ends */

/* what you chose, in your journey page */
export const CHOICE_NAMES = {
  first: { lane: 'You started by helping to clear the lane.', roof: 'You started by helping with the roof.', food: 'You started by taking food to Miss Hyacinth.' },
  why: { safe: 'You said we get ready to keep our families safe.', help: 'You said we get ready so we can help each other.', mend: 'You said we get ready so we can mend faster.' },
};

/* the storm scenes: a card first, the narration in order, a title card after, and the same story in plain pages for anyone who skips the scene */
export const LINES = {
  c51: { cardTitle: 'Friday 17 August 1951', page: 'charlie', page2: 'hurricanes', title: 'Saturday morning', sub: '18 August 1951',
    skip: ['Charlie came ashore on the night of 17 August 1951, just south of Kingston.', "In Miss Ivy's house, the wind lifted part of the roof. Everyone stayed low and together.", 'Your family was safe. Many people along the coast were not so lucky.'],
    b: ['It is night. The wind rises, and the rain falls hard.', 'The sea roars close by. Miss Ivy checks the door.', 'The lamp goes out. Mama holds baby Winston close.', 'The wind screams. The whole house shakes.', 'A loud bang! The roof sheets lift off.', 'Rain pours in through the open roof!', 'Papa pulls a table over you all. "Stay low. Stay together."', 'Mama hums to Winston. The storm goes on for hours.'],
    morning: 'The wind has dropped. Your family is safe.' },
  /* a cutaway at the start of Gilbert's storm scene: Kingston at midday, uptown and downtown across one street */
  kingston: { title: 'Kingston', sub: 'About midday, Monday 12 September 1988',
    b: ['Midday in Kingston. The eye of Gilbert passes over.', 'Uptown, a family shelters in a big house behind a high wall.', 'A satellite dish tears off its post and sails over the wall!', 'Downtown, in crowded yards, zinc roofs lift off and fly.', 'Gilbert hit big houses and small houses alike.'] },
  g88: { cardTitle: 'Monday 12 September 1988', page: 'gilbert', page2: 'hurricanes', title: 'Later that day', sub: '12 September 1988',
    skip: ['Around midday, the eye of Gilbert passed over Kingston.', 'In this story, an uptown garden loses its dish. Downtown, zinc roofs fly.', 'Gilbert hit big houses and small houses alike.', "Later, Mass Clifford's roof lifted off. Everyone stayed together."],
    b: ['The wind rises. Zinc roofs rattle all over the village.', 'Mass Clifford checks the door. The lamp flickers.', 'The lamp goes out. Mama holds Delroy close.', 'The wind roars like a train. The whole house shakes.', 'A loud bang! The roof sheets lift off.', 'Rain pours in through the open roof!', 'Dad pulls the mattress over you all. "Stay low. Stay together."', 'Mama sings softly to Delroy. The storm goes on for hours.'],
    morning: 'The wind has dropped. Your family is safe.' },
  m25: { cardTitle: 'Tuesday 28 October 2025', page: 'melissa', page2: 'wind', title: 'Tuesday afternoon', sub: '28 October 2025',
    skip: ['Melissa came ashore in the west of Jamaica just after midday, as a Category 5 hurricane, the strongest kind.', 'In the church hall, the wind tore a part of the roof away. Rain poured in.', 'Everyone moved together to the middle and stayed safe. Pastor Gayle led a hymn.'],
    b: ['The wind rises. Shutters bang, and the zinc roof sings.', 'The hall roof groans. Everyone goes quiet.', 'The lights go out. Mum switches on your torch.', 'The roar grows. Rain drives against the walls.', 'BANG! Part of the roof lifts away, and rain pours in!', 'Everyone moves to the middle. Mum holds you tight.', 'Pastor Gayle starts a hymn. The whole hall sings.', 'It goes on for hours. Someone keeps saying, "We are together."'],
    morning: 'The wind is quieter. Your family is safe.' },
  end: ['Hurricane Melissa was one of the strongest storms ever to hit Jamaica.', 'Many people lost their homes, and some people died. Neighbours helped each other, and Jamaica is still rebuilding.', 'Thank you for remembering. Read your journey in the Journal.'],
};
export const KIT = [
  { q: 'Water for the kit', note: 'Which is best?', opts: [{ t: 'One bottle for the whole family', ok: false, say: 'Not enough. The taps may be dry for days.' }, { t: 'Enough water for everyone, for several days', ok: true, say: 'Yes! Water first.' }] },
  { q: 'Light at night', note: 'Which is safest?', opts: [{ t: 'A candle beside the curtain', ok: false, say: 'A candle can start a fire. Not this one.' }, { t: 'A torch with spare batteries', ok: true, say: 'Yes! A torch is safe and bright.' }] },
  { q: 'Papers and medicine', note: 'Where do they go?', opts: [{ t: 'On the table, in the open', ok: false, say: 'Rain and wind could spoil them.' }, { t: 'In a sealed bag, in the go-bag', ok: true, say: 'Yes! Dry and ready to go.' }] },
];

/* the earlier storms: which came first, and which was deadliest (see docs/games/melissa.md, "Storms before Gilbert") */
export const STORMS = [
  { q: 'Which storm came first?', note: 'Pick the oldest one.', opts: [{ t: 'Hurricane Gilbert', ok: false, say: 'Gilbert was in 1988. Something older came first.' }, { t: 'The 1780 storm that destroyed Savanna-la-Mar', ok: true, say: 'Yes! That was in 1780, a very long time ago.' }, { t: 'Hurricane Charlie', ok: false, say: 'Charlie was in 1951. There was an older one.' }] },
  { q: 'In the 1900s, which storm killed the most people in Jamaica?', note: 'It was in 1951.', opts: [{ t: 'Hurricane Gilbert', ok: false, say: 'Gilbert took about 45 lives in Jamaica. Another storm took more.' }, { t: 'Hurricane Charlie', ok: true, say: 'Yes. About 150 people died in Jamaica in Charlie.' }] },
  { q: 'Melissa came ashore in Westmoreland. So did a storm in 1780.', note: 'Which town did that old storm destroy?', opts: [{ t: 'Savanna-la-Mar', ok: true, say: 'Yes! The same part of the island, 245 years apart.' }, { t: 'Port Royal', ok: false, say: 'Not this time. Port Royal had an earthquake in 1692.' }] },
];

/* ---------- conversations: TALK[id](story) gives the first, full conversation; LATER[id](story) gives short lines for later visits ---------- */
const Y = 'You';
export const TALK = {
  /* ===== chapter 1: a fishing bay near Kingston, 17 August 1951. You are Hattie, ten. ===== */
  papa51: () => [
    { who: 'Papa', text: 'Hattie, the neighbours say a bad storm is coming.' },
    { who: Y, text: 'How bad, Papa?' },
    { who: 'Papa', text: 'Nobody knows. But the sea looks strange today.', unlock: 'hurricanes' },
    { who: 'Papa', text: 'We must get ready, and quickly.' },
  ],
  mama51: () => [
    { who: 'Mama', text: 'Hattie, bring your little brother here.' },
    { who: Y, text: 'Winston is so heavy, Mama!' },
    { who: 'Mama', text: 'He is only one year old. Keep him close.' },
    { who: 'Mama', text: 'Keep calm, and help your father.' },
  ],
  cyril: () => [
    { who: 'Mass Cyril', text: 'I am pulling my canoe up the beach.' },
    { who: Y, text: 'Why, Mass Cyril?' },
    { who: 'Mass Cyril', text: 'The sea will rise. A canoe left on the water is lost.' },
    { who: 'Mass Cyril', text: 'Help me, child. Then go to Miss Ivy.' },
  ],
  ivy: () => [
    { who: 'Miss Ivy', text: 'Hattie! Bring everyone here.' },
    { who: 'Miss Ivy', text: 'My house is made of block. It is stronger than board.' },
    { who: Y, text: 'Thank you, Miss Ivy.' },
    { who: 'Miss Ivy', text: 'Come in tonight. The storm is near.' },
  ],
  papaR51: () => [
    { who: 'Papa', text: 'Everyone is safe. Thank God.' },
    { who: 'Papa', text: 'Half of this roof is gone. Many people lost their homes tonight.' },
    { who: 'Papa', text: 'Charlie was a very big storm. People will remember it for ever.' },
    { who: Y, text: 'I will remember it too.' },
  ],
  /* ===== chapter 2: Breadnut Corner, 11 September 1988. You are Pearl, twelve. ===== */
  dad: () => [
    { who: 'Dad', text: 'Pearl, the radio says a big storm is coming.' },
    { who: Y, text: 'Is it a hurricane, Dad?' },
    { who: 'Dad', text: 'Yes. It is called Gilbert.', unlock: 'hurricanes' },
    { who: 'Dad', text: 'We have not had a hurricane here for thirty-seven years.' },
    { who: 'Dad', text: 'The last was Charlie. My big sister Hattie remembers it.' },
    { who: 'Dad', text: 'Our roof is old. We must get ready today.' },
  ],
  mama: () => [
    { who: 'Mama', text: 'Pearl, did you hear your father?' },
    { who: Y, text: 'Yes, Mama. A hurricane.' },
    { who: 'Mama', text: 'A hurricane is a huge spinning storm, with wild wind.' },
    { who: 'Mama', text: 'We keep calm, and we help each other.' },
  ],
  delroy: () => [
    { who: 'Delroy', text: 'Pearl, will the wind knock down the mango tree?' },
    { who: Y, text: 'I do not know. Maybe.' },
    { who: 'Delroy', text: 'I hope the mangoes will be okay.' },
    { who: 'Delroy', text: 'Can I help carry water?' },
  ],
  clifford: () => [
    { who: 'Mass Clifford', text: 'Pearl! Tell your father to bring the family here.' },
    { who: 'Mass Clifford', text: 'My house is block. It is stronger than a board house.' },
    { who: Y, text: 'Thank you, Mass Clifford.' },
    { who: 'Mass Clifford', text: 'Come when the wind gets strong.' },
  ],
  dadR2: () => [
    { who: 'Dad', text: 'Everyone is safe. Thank God.' },
    { who: 'Dad', text: 'Half of this roof is gone. Our own house may be worse.' },
    { who: 'Dad', text: 'Gilbert was a very big storm. People will remember it for ever.' },
    { who: Y, text: 'I will remember it too.' },
  ],
  /* ===== chapter 2: Melissa is coming. You are a child of eleven. ===== */
  pearl: () => [
    { who: 'Mum', text: 'Good morning, love. Have you heard the news?' },
    { who: Y, text: 'No, Mum. What news?' },
    { who: 'Mum', text: 'A hurricane called Melissa is out at sea.' },
    { who: 'Mum', text: 'It is very strong, and it is moving very slowly.' },
    { who: 'Mum', text: 'The radio says a hurricane warning is on.' },
    { who: Y, text: 'Like Gilbert?' },
    { who: 'Mum', text: 'I was twelve when Gilbert came. I remember it well.' },
    { who: 'Mum', text: 'We do not wait, and we do not guess. We get ready.' },
  ],
  winston: () => [
    { who: 'Grandpa', text: 'In 1988, I nailed boards over our windows.' },
    { who: 'Grandpa', text: 'Now we have phones and the news. But the work is the same.' },
    { who: 'Grandpa', text: 'Water. Food. Light. A safe place.' },
    { who: Y, text: 'What is a safe place?' },
    { who: 'Grandpa', text: 'A strong building, away from the sea and the river.' },
  ],
  raymond: () => [
    { who: 'Mr. Raymond', text: 'Good morning! My roof sheets are loose. Look.', unlock: 'ready' },
    { who: 'Mr. Raymond', text: 'Wind gets under a loose sheet and lifts it off.' },
    { who: 'Mr. Raymond', text: 'My father nailed our roof well, back in Gilbert.' },
    { who: 'Mr. Raymond', text: 'Can you hand me the nails? I will fix the sheets down.' },
  ],
  /* ===== chapter 3: the church hall ===== */
  pearlH: () => [
    { who: 'Mum', text: 'We are safe here. These walls are thick.' },
    { who: 'Mum', text: 'Many families have come. Say hello, and help.' },
    { who: 'Mum', text: 'Take this torch. Keep it close.', give: 'torch' },
    { who: 'Mum', text: 'Stay near me, and near Gran.' },
  ],
  pastor: () => [
    { who: 'Pastor Gayle', text: 'Welcome. There is room for everyone.' },
    { who: 'Pastor Gayle', text: 'A shelter keeps people safe from the wind.' },
    { who: 'Pastor Gayle', text: 'We have water, bread and blankets. Please help share.' },
  ],
  simone: () => [
    { who: 'Nurse Simone', text: 'I am a health aide. I look after anyone who feels unwell.' },
    { who: 'Nurse Simone', text: 'Drink water, and try to rest.' },
    { who: 'Nurse Simone', text: 'Tell me if you feel sick or hurt. Do not wait.' },
  ],
  pearlH2: () => [
    { who: 'Mum', text: 'Thank God. We are all together.' },
    { who: 'Mum', text: 'The wind is quieter now.' },
    { who: 'Mum', text: 'Soon we will go and see what is left of home.' },
  ],
  pastor2: () => [
    { who: 'Pastor Gayle', text: 'The roof has a hole, but the hall stood.' },
    { who: 'Pastor Gayle', text: 'Let us thank God, and help each other.' },
  ],
  /* ===== chapter 4: after the storm ===== */
  pearlA: () => [
    { who: 'Mum', text: 'The wind has gone, and the sun is out.' },
    { who: 'Mum', text: 'Come. We must go and see our house.' },
    { who: 'Mum', text: 'Stay on the road. Keep away from wires.' },
  ],
  winstonA: () => [
    { who: 'Grandpa', text: 'I will stay and help Pastor Gayle.' },
    { who: 'Grandpa', text: 'You look after your mother, and your neighbours.' },
  ],
  pearlA2: () => [
    { who: 'Mum', text: 'Half our roof is gone. But we are here.' },
    { who: Y, text: 'Can we fix it?' },
    { who: 'Mum', text: 'Yes. Bit by bit. First, check on Miss Hyacinth.' },
    { who: 'Mum', text: 'She is old, and she lives alone.' },
  ],
  hyacinthA: () => [
    { who: 'Miss Hyacinth', text: 'Ah, child! I am glad to see you.' },
    { who: 'Miss Hyacinth', text: 'The wind took my whole roof. I sat in a corner and prayed.' },
    { who: Y, text: 'Are you hurt, Miss Hyacinth?' },
    { who: 'Miss Hyacinth', text: 'Only wet. Tell your mother I am well.' },
    { who: 'Miss Hyacinth', text: 'Thank you for coming. That is what neighbours are for.' },
  ],
  /* ===== chapter 5: the days after ===== */
  raymondA: () => [
    { who: 'Mr. Raymond', text: 'Good morning, neighbour. The sun is up, and there is work.' },
    { who: 'Mr. Raymond', text: 'The fallen tree blocks the lane. Trucks cannot get through.' },
    { who: 'Mr. Raymond', text: 'Your roof needs a tarp. Miss Hyacinth needs food.' },
    { who: 'Mr. Raymond', text: 'Where will you start?', choices: [
      { t: 'Clearing the lane', set: { first: 'lane' }, then: [{ who: 'Mr. Raymond', text: 'Good. Roll the logs once I cut them.' }] },
      { t: 'The roof', set: { first: 'roof' }, then: [{ who: 'Mr. Raymond', text: 'Good. Rain is the worry. Cover it quickly.' }] },
      { t: 'Food for Miss Hyacinth', set: { first: 'food' }, then: [{ who: 'Mr. Raymond', text: 'Good. She will be glad to see you.' }] }] },
  ],
  youth: () => [
    { who: 'Jordan', text: 'The church has a satellite dish now. We can call out!' },
    { who: 'Jordan', text: 'Want to call someone?' },
    { who: Y, text: 'Yes! Uncle Delroy, in Canada.' },
    { who: 'Uncle Delroy', text: 'Hello? Is it you? Thank God!' },
    { who: 'Uncle Delroy', text: 'I saw the storm on the news. I could not reach anyone.' },
    { who: Y, text: 'We are safe, Uncle. The roof is half gone.' },
    { who: 'Uncle Delroy', text: 'We will send a barrel of food and tools.' },
    { who: 'Uncle Delroy', text: 'I remember Gilbert. We will rebuild again.' },
  ],
  /* ===== chapter 6: today ===== */
  teacher: () => [
    { who: 'Miss Campbell', text: 'Welcome to Ready Day at Breadnut Corner.' },
    { who: 'Miss Campbell', text: 'Every year we remember Gilbert and Melissa, and we get ready.' },
    { who: 'Miss Campbell', text: 'Hurricanes are not new. One destroyed Savanna-la-Mar in 1780.' },
    { who: 'Miss Campbell', text: 'Read the Ready Plan. Then help us pack a family kit.' },
  ],
  student: () => [
    { who: 'Andre', text: 'Miss says Gilbert and Melissa were both huge storms.' },
    { who: 'Andre', text: 'Why do we get ready, if we cannot stop a hurricane?', choices: [
      { t: 'To keep our families safe', set: { why: 'safe' }, then: [{ who: 'Andre', text: 'Yes. Safe families, safe village.' }] },
      { t: 'So we can help each other', set: { why: 'help' }, then: [{ who: 'Andre', text: 'Yes. Neighbours help neighbours.' }] },
      { t: 'So we can mend faster', set: { why: 'mend' }, then: [{ who: 'Andre', text: 'Yes. A ready village mends faster.' }] }] },
    { who: 'Miss Campbell', text: 'Well said. Thank you for remembering.' },
  ],
};
const first = (...a) => () => a;
export const LATER = {
  papa51: () => ['Help Mass Cyril, then come back.', 'Stay close to your mother.'], mama51: () => ['Hold Winston tight.', 'Fill every bucket you can find.'], cyril: () => ['Pull hard! Tie her to the palm.'], ivy: () => ['Come early. Do not wait for the rain.'], papaR51: () => ['Stay low, Hattie. Stay together.'], mamaR51: () => ['Hush, Winston. We are safe in here.'], ivyR51: () => ['This house has stood a long time. It will stand tonight.'],
  dad: () => ['Go and help your mother.', 'Take your time, but not too much.'], mama: () => ['Stay close to me today.', 'Fill every bucket you can find.'], delroy: () => ['I am scared, but a little excited.', 'Is the mango tree okay?'], clifford: () => ['Come early. Do not wait for the rain.'],
  dadR: () => ['Stay low, Pearl. Stay together.'], mamaR: () => ['Hush, Delroy. We are safe in here.'], delroyR: () => ['The wind is so loud, Pearl.'], cliffordR: () => ['This house has stood a long time. It will stand tonight.'],
  pearl: (s) => ['Have you got your jobs done?', 'Keep your phone charged, love.'], winston: () => ['Good nails and a good plan. That is the secret.', 'Do not touch the roof. That is a job for grown-ups.'], bev: () => ['Water and tins are going fast today!', 'Everyone is buying early. That is wise.'], raymond: () => ['Careful on that ladder, now.', 'Tight sheets, safe house.'], hyacinth: () => ['I will go to the church when the time comes.', 'I remember Gilbert. Oh yes.'],
  pearlH: () => ['Rest if you can.', 'Stay close to the middle of the hall.'], pastor: () => ['We are in good hands.', 'Please keep away from the windows.'], simone: () => ['Drink some water.', 'Slow breaths. In and out.'], keisha: () => ['The wind is so loud!', 'Will you stay with me?'], marlonH: () => ['I am not scared. Okay, a little.'],
  pearlA: () => ['Mind where you step.', 'Keep away from wires.'], winstonA: () => ['Go on, I am fine.'], hyacinthA: () => ['Bless you, child.', 'I have my chair, and the sun on my face.'], raymondA: () => ['Mind that wire. Do not touch it.', 'We will clear the lane together.'],
  soldier: () => ['We bring water and food. Stay safe.', 'We will check every house.'], youth: () => ['The dish has signal only near the church.', 'The line is slow, but it works.'],
  teacher: () => ['Ready is better than sorry.', 'Good job today.'], student: () => ['I want to be a weather scientist.', 'Gilbert was before my parents were born.'], winstonT: () => ['I still have the old nails.', 'Mind the new roof. It is shiny.'],
  mama88: () => ['Stay close.'], bev88: () => ['...'],
};

/* ---------- the journal: pages open as you play. simple: for everyone. deeper: for older readers and teachers. ---------- */
export const JOURNAL = [
  { id: 'you', title: 'You', simple: ['In this story you are a made-up child. The family is made up too.', 'In 1951 you are Hattie, aged ten. In 1988 you are Pearl, aged twelve. In 2025 you are Pearl\'s child.', 'The storms are real. The family is not.'], deeper: ['Hattie, Papa, Mama, baby Winston, Mass Cyril, Miss Ivy, Pearl, Dad, Mama, Delroy, Mass Clifford, Mum, Grandpa, Gran, Mr. Raymond, Miss Bev, Miss Hyacinth, Pastor Gayle, Nurse Simone, Keisha, Marlon, Jordan, Miss Campbell and Andre are fictional.', 'Breadnut Corner is made up. The clothes, houses and tools are a general picture, not copied from photographs.', 'No real person speaks in this game.'] },
  { id: 'charlie', title: 'Hurricane Charlie, 1951', simple: ['Hurricane Charlie hit Jamaica on the night of 17 August 1951.', 'It came ashore just south of Kingston.', 'About 150 people died in Jamaica, and about 25,000 lost their homes.', 'It was Jamaica\'s deadliest natural disaster of the 1900s.'], deeper: ['Charlie was a high Category 3 hurricane. Kingston had about 17 inches of rain and winds of about 110 miles an hour.', 'The first newspaper headline said 110 dead. Later counts were higher: about 152 in Jamaica.', 'Newspapers of the time said that Morant Bay was four-fifths destroyed and that Port Royal was flattened. These are reports from 1951 that we have not checked against other sources.', 'About 70 to 80 per cent of the banana crop was destroyed, and the airport at Palisadoes lost a hangar.', 'After Charlie, Jamaica set up a Hurricane Housing Organization to rebuild homes. It joined the Department of Housing in 1956 (one source).', 'The bay, Hattie, her family and Miss Ivy in this game are made up.'] },
  { id: 'gilbert', title: 'Hurricane Gilbert, 1988', simple: ['Hurricane Gilbert crossed Jamaica on Monday 12 September 1988, from east to west.', 'It was the first hurricane to hit Jamaica in 37 years.', 'More than 100,000 homes were damaged or destroyed.', 'Hundreds of thousands of people lost their homes or their roofs.', 'About 45 people died in Jamaica.'], deeper: ['The eye passed over Kingston around midday. The storm was over the island from the morning until about six in the evening. It hit uptown and downtown alike.', 'The first report called Gilbert a Category 3 hurricane. A later study of the same records says it may have been a low Category 4.', 'Gilbert\'s lowest pressure came a day later, near Mexico, where it grew into a Category 5 storm. It killed 318 people in all the countries it crossed.', 'The whole export banana crop was destroyed, and the chicken farms were badly hit. The power and water systems stopped working, and some places waited three months for light.', 'Many people remember eating bully beef (tinned corned beef) in the weeks after Gilbert.', 'After Gilbert the disaster office was changed. In 1993 it became the Office of Disaster Preparedness and Emergency Management (ODPEM), which started the National Zonal Programme so that communities can look after themselves for at least 72 hours.', 'Many roofs rebuilt after Gilbert used metal straps at each rafter. Gilbert\'s name was retired, so no other storm will be called Gilbert.'] },
  { id: 'hurricanes', title: 'What is a hurricane?', simple: ['A hurricane is a huge spinning storm. It grows over warm sea water.', 'It has very strong wind, heavy rain and big waves.', 'The wind in a hurricane is at least 74 miles an hour.', 'Hurricane season is from 1 June to 30 November.'], deeper: ['Hurricanes are rated from Category 1 to Category 5 on the Saffir-Simpson scale. Category 1 is 74 to 95 miles an hour, Category 3 is 111 to 129, and Category 5 is 157 or more.', 'The scale measures wind only, not rain or flood water.', 'The eye is the calm middle. The eyewall around it has the strongest wind.', 'Storm surge is sea water pushed onto the land by the wind. A slow storm drops more rain on the same places for longer, so slow storms can cause the worst floods.'] },
  { id: 'warnings', title: 'Watches and warnings', simple: ['A watch means a hurricane could come.', 'A warning means a hurricane is expected soon.', 'Listen to the radio, TV and phone alerts.', 'If you are told to go to a shelter, go early.'], deeper: ['A hurricane watch is usually given about 48 hours before strong winds. A hurricane warning is usually given about 36 hours before.', 'Melissa moved so slowly that the alerts came much earlier: the watch about a week before, and the hurricane warning about three and a half days before.', 'For Gilbert in 1988, the hurricane warning came about 22 hours before the eye arrived.', 'News comes from the Meteorological Service of Jamaica and the Office of Disaster Preparedness and Emergency Management (ODPEM). The radio voice in this game is made up.'] },
  { id: 'ready', title: 'Getting ready', simple: ['Fill buckets and keep water.', 'Keep food that needs no cooking, and bread.', 'Cover windows. Fix loose roof sheets.', 'Pack a go-bag: papers in a plastic bag, a torch, a charged phone and a radio.'], deeper: ['ODPEM and the Jamaica Information Service say to keep a battery radio, torches and spare batteries, first-aid things, plastic bags and tools, and four or five days of food that needs no fridge.', 'Choose two meeting places: one just outside your home and one outside your neighbourhood. Name a family contact in another area whom everyone can phone.', 'Practise your plan every six months. Pets are not allowed in shelters, so plan for them.', 'Pick the fruit off trees and trim branches near power lines. A torch is safer than a candle.'] },
  { id: 'shelter', title: 'What is a shelter?', simple: ['A shelter is a strong building where people stay safe.', 'Many shelters are schools and church halls.', 'People bring food, water, blankets and torches.', 'Neighbours share and help each other.'], deeper: ['Before Melissa, the government said hundreds of shelters were ready. At the worst, thousands of people were in them. Counts of how many differ, so we say "thousands".', 'Even strong buildings can lose roof sheets. Keep away from windows, and stay in the middle of the hall.', 'The made-up hall in this game is not a real church.'] },
  { id: 'melissa', title: 'Hurricane Melissa, 2025', simple: ['Melissa came ashore in the west of Jamaica just after midday on Tuesday 28 October 2025.', 'It was a Category 5 hurricane, the strongest kind.', 'It was the strongest hurricane ever to hit Jamaica.', 'About 116,000 buildings were badly damaged.', 'Jamaica\'s official count is that 45 people died. We remember them.'], deeper: ['The United States National Hurricane Center says Melissa came ashore near New Hope, in Westmoreland, at about 12:25 pm, with winds of about 185 miles an hour.', 'Melissa moved very slowly while it was out at sea. Over very warm water it grew from a tropical storm to a Category 5 hurricane in about six days.', 'More than 32 inches of rain fell in the hills of Manchester. Floods and landslides blocked roads.', 'About 77 per cent of the island\'s electricity customers lost power. The whole island was declared a disaster area on 29 October.', 'The official count of 45 includes 18 in St. Elizabeth and 15 in Westmoreland. In December 2025, some more cases were still being checked.', 'In 2026 the World Meteorological Organization retired the name Melissa, so no other storm will be called Melissa.'] },
  { id: 'wind', title: 'How wind lifts a roof', simple: ['Wind blows over a roof and pulls it up, like a straw.', 'Wind also pushes in under loose sheets.', 'Once one sheet lifts, others follow.', 'Strong nails and metal straps hold a roof down.'], deeper: ['Most of the damage to homes in Melissa was to roofs. Houses of wood were destroyed, and houses of concrete block mostly lost their roofs.', 'Hurricane straps tie the roof to the top of the wall. ODPEM\'s "Strap Up Jamaica" campaign says they greatly cut the chance of a roof failing.', 'Loose sheets are dangerous to everyone nearby, and an open roof lets the rain in.','Anything loose outside can become a flying object: zinc sheets, branches and tools.'] },
  { id: 'trees', title: 'Fallen trees', simple: ['Wet soil is soft, and strong wind can push a tree right over.', 'The roots come up out of the ground.', 'Fallen trees block roads, so help cannot get through.', 'Never stand near a leaning tree.'], deeper: ['After Melissa, more than 130 roads were blocked at the peak. Soldiers, workers and neighbours cleared them with chainsaws, machetes and diggers.', 'A leaning tree can fall again without warning.'] },
  { id: 'wires', title: 'Fallen wires', simple: ['Wind can knock down poles and wires.', 'Never touch a fallen wire. It may still carry power.', 'Keep away, and keep children away.', 'Tell a grown-up, and tell the light company.'], deeper: ['ODPEM and the Jamaica Information Service say: do not touch loose or dangling wires.', 'Power can come back on without warning while a wire is on the ground. Water makes the danger worse.'] },
  { id: 'afterhouse', title: 'Coming home', simple: ['After a storm, a house can be damaged inside.', 'Look carefully. Stay out of unsafe buildings.', 'Do not walk barefoot. Watch for glass, nails and zinc.', 'Boil drinking water until the water authority says it is safe.'], deeper: ['Rain can come in through an open roof, and wet things inside can spoil. A tarp keeps more rain out until the roof is mended.', 'After Melissa, health workers also warned about flood water, which can carry germs.', 'Blue tarpaulins became a common sight in the west. More than 100,000 were handed out.'] },
  { id: 'neighbours', title: 'Neighbours', simple: ['In the first hours, neighbours help neighbours.', 'People check on old people and on families with babies.', 'They share water, food and tools.', 'Churches and schools open their doors.'], deeper: ['In the first days many roads were blocked and phones did not work. Neighbours were often the first to help.', 'More than 30 communities were cut off at first. The Jamaica Defence Force flew helicopters to reach them, and set up posts in the west.'] },
  { id: 'help', title: 'Help from far away', simple: ['Soldiers, police, workers and volunteers helped.', 'Other countries sent help.', 'Jamaicans far away sent money, tools and barrels of food.', 'It takes a long time to rebuild.'], deeper: ['The Jamaica Defence Force made a relief hub at Up Park Camp in Kingston and flew food drops and rescues. In the first weeks it gave out more than 130,000 food packages.', 'Help came from the United States, the United Kingdom, Canada, El Salvador, Caribbean countries, the European Union, the United Nations and many charities.', 'The government set up satellite internet dishes (Starlink) for helpers and communities, because many phone masts were down.', 'Jordan and Uncle Delroy are made up, but many Jamaicans abroad did send help.'] },
  { id: 'recovery', title: 'Rebuilding', simple: ['Rebuilding takes months and years.', 'Roofs, schools, clinics, roads and wires must all be fixed.', 'A year later, many families were still rebuilding.', 'Getting ready for the next storm is part of rebuilding.'], deeper: ['The World Bank and the Inter-American Development Bank estimated US$8.8 billion of damage to buildings and property, about 41 per cent of a year of Jamaica\'s income. A later assessment counted damage, losses and extra costs together at US$12.2 billion.', 'Power took months to come back. About 60 per cent was restored by 9 November 2025, 84 per cent by mid December, and 96 per cent by the end of January 2026. Westmoreland waited longest.', 'In January 2026 the government began the Shelter Recovery Programme, with roof grants called ROOFS for families to repair their homes. In October 2026 the Prime Minister said that more than 118,000 households needed help, and about half had been helped.', 'Schools were reopened in stages. The government said on 14 January 2026 that all schools were open again, though some used shifts.'] },
  { id: 'compare', title: 'Gilbert and Melissa', simple: ['Gilbert hit in 1988. Melissa hit in 2025.', 'Gilbert was a Category 3 over Jamaica by the first report. Melissa was a Category 5.', 'Gilbert damaged more than 100,000 homes. Melissa badly damaged about 116,000 buildings.', 'About 45 people died in Jamaica in each storm.', 'Both are remembered for flying roofs, and for neighbours who helped.'], deeper: ['Gilbert came ashore on the south-east coast, near Kingston, and crossed the island from east to west. Melissa came ashore in the south-west and crossed to the north-east.', 'Melissa\'s winds at landfall were about 185 miles an hour. Gilbert\'s were about 127 miles an hour in the first report, or about 132 in a later study.', 'The numbers cannot be compared exactly. The storms hit different places, in different years, and were counted in different ways. The 2025 assessment said Melissa cost more than four times as much as Gilbert, before allowing for prices rising over the years.', 'Melissa was more than the biggest storm by wind: it was also very slow, and it brought days of rain before landfall.'] },
  { id: 'storms', title: 'Storms before Gilbert', simple: ['Hurricanes have hit Jamaica for hundreds of years.', '1780: a hurricane destroyed the town of Savanna-la-Mar, in Westmoreland. The sea rose and swept over it.', '1903: a hurricane came ashore near Morant Point. It wiped out the banana crop.', '1951: Hurricane Charlie hit near Kingston. About 150 people died, and about 25,000 lost their homes.', 'Each time, Jamaicans rebuilt.'], deeper: ['1780: the Savanna-la-Mar hurricane came ashore on 3 October. A sea surge, said to be about 20 feet high, caught people who had gone to watch the waves. Nobody knows how many died. Estimates run from hundreds to over a thousand, so this game gives no number.', '1880: a hurricane hurt crops and flooded Kingston Harbour. The Gleaner says five people drowned.','1903: on 11 August a Category 3 hurricane, with winds of about 120 miles an hour, came ashore near Morant Point. The Gleaner says between 65 and 90 people died in Jamaica. Many banana growers went bankrupt.','1912: a slow hurricane arrived on 18 November, after a week of heavy rain.','1951: Charlie came ashore on the night of 17 to 18 August, as a high Category 3 hurricane, just south of Kingston. Kingston had about 17 inches of rain. The first newspaper headline said 110 dead, and later counts were higher: about 152 in Jamaica. The Gleaner calls it Jamaica\'s deadliest natural disaster of the 20th century.','1980: Hurricane Allen passed about 25 miles away, without coming ashore. The Gleaner says eight people died.','These numbers come from the Gleaner (30 October 2025), Wikipedia, and reports of the time. They differ between sources, so check them in the Gleaner archive or the National Library of Jamaica before using them in a school project.'] },
  { id: 'plan', title: 'The Ready Plan', simple: ['1. Know your risk.', '2. Make a family plan.', '3. Keep a kit.', '4. Fix the roof early.', '5. Listen to the warnings, and leave early if told.'], deeper: ['The Ready Plan board is our own wording, based on advice from ODPEM and the Jamaica Information Service.', 'ODPEM\'s National Zonal Programme helps communities look after themselves for at least 72 hours until outside help arrives.', 'In 2026, ODPEM\'s "Strap Up Jamaica" campaign asked builders and homeowners to use hurricane straps.'] },
  { id: 'kit', title: 'The family kit', simple: ['Water for everyone for several days.', 'Food that keeps.', 'A torch and spare batteries.', 'A battery radio.', 'A charged phone.', 'Medicine and papers in a sealed bag.'], deeper: ['Put the kit where everyone can find it. Check it every year, before the hurricane season.', 'Keep a first-aid kit, plastic bags, tools, and a few days of food that needs no cooking.'] },
  { id: 'who', title: 'Real and made up', simple: ['The storms, the places, the government and the helpers are real.', 'Breadnut Corner and everyone who lives there are made up.'], deeper: ['Gilbert and Melissa are real storms. The numbers are from Jamaican government and news sources, listed in the credits.', 'The story of one village stands for many villages.'] },
  { id: 'journey', title: 'Your journey', simple: ['You finished the story.'], deeper: ['Every choice you made is listed here.'] },
];
