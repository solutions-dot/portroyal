/* games/tivoli/src/content.js: every word the player reads in the story, in one place (the same idea as Kendal's content.js).
   Rules (CLAUDE.md): short lines, about 12 words or fewer, one idea each; plain words for ages 6 and up; no em dashes; every fact comes from the Research tables in
   docs/games/tivoli.md; real people say nothing (they appear only as facts in the journal); every fictional person is named as fictional in the journal.
   The framing (proposed, to be confirmed by the owner): the elder is Ivy, in 2010 a grandmother. In the early chapters you walk through her memories as a child. */

export const CHAPTERS = [
  { id: 1, name: 'Back-o-Wall', when: 'Before the 1960s', line: 'A crowded part of West Kingston, through Ivy’s eyes.', playable: true },
  { id: 2, name: 'The new Tivoli', when: 'The 1960s', line: 'New homes are built where Back-o-Wall stood.', playable: true },
  { id: 3, name: 'Politics and power', when: '1970s to 2009', line: 'How leaders, parties and gangs grew together.', playable: false },
  { id: 4, name: 'May 2010: before', when: 'Sunday 23 May 2010', line: 'Barricades, a state of emergency, and a family waiting.', playable: true },
  { id: 5, name: 'May 2010: the day', when: 'Monday 24 May 2010', line: 'A loud day. You watch from a window.', playable: true },
  { id: 6, name: 'After', when: 'May 2010 and after', line: 'Finding people. Funerals. The inquiries.', playable: false },
  { id: 7, name: 'The report', when: '2016 and 2017', line: 'What the Commission found, and the disagreement.', playable: false },
  { id: 8, name: 'Today', when: 'Now', line: 'The community now.', playable: false },
];

/* ---------- Chapter 1: Back-o-Wall. All three people are fictional. The place is imagined (we have no photographs or oral histories yet); the journal says so. ---------- */
export const CH1 = {
  start: ['Gran Ivy remembers.', 'Walk through her memory of Back-o-Wall.', 'Ivy was a girl then.'],
  goals: ['Talk to Ivy in the yard.', 'Talk to Ivy’s gran.', 'Talk to Mass Roy in the lane.', 'Walk to the end of the lane.'],
  talk: {
    ivy: [
      { who: 'Ivy', text: 'Hello! I am Ivy. This is my yard.' },
      { who: 'You', text: 'Hello Ivy. What is this place?' },
      { who: 'Ivy', text: 'This is Back-o-Wall. Lots of families live here.' },
      { who: 'Ivy', text: 'Gran and I live in that house.' },
      { who: 'Ivy', text: 'Gran says the Government owns this land.', unlock: 'backowall' },
    ],
    pearl: [
      { who: 'Miss Pearl', text: 'Mind the step, child. It is a crowded yard.' },
      { who: 'Miss Pearl', text: 'We built this house ourselves, board by board.' },
      { who: 'You', text: 'Is it hard to find a home?' },
      { who: 'Miss Pearl', text: 'Very hard. There are not enough homes in Kingston.' },
      { who: 'Miss Pearl', text: 'Mind how you go, child.' },
    ],
    roy: [
      { who: 'Mass Roy', text: 'Have you heard? The Government wants this land.' },
      { who: 'Mass Roy', text: 'They say they will clear Back-o-Wall.' },
      { who: 'You', text: 'Where will everyone go?' },
      { who: 'Mass Roy', text: 'Nobody knows. Nobody has told us.' },
      { who: 'Mass Roy', text: 'But we look after each other here.', unlock: 'clearance' },
    ],
  },
  later: {
    ivy: ['I hope Gran is not worried.', 'Gran is brave, but she is thinking hard.'],
    pearl: ['We have each other.', 'Mind the step, child.'],
    roy: ['Whatever happens, we stay together.'],
  },
  end: {
    title: 'Back-o-Wall',
    lines: ['In 1963 the Government began to clear Back-o-Wall.', 'The last part was cleared on 12 July 1966.', 'Ivy, her gran and Mass Roy are made up.', 'What happened to Back-o-Wall was real.'],
  },
};

/* ---------- Chapter 2: the new Tivoli Gardens, 1960s. Ivy, Miss Pearl and Mr Clarke are fictional. The place is a general picture (newtivoli.js).
   Facts (docs/games/tivoli.md, Research): built in the 1960s where Back-o-Wall stood; homes by the Ministry of Housing; the West Kingston Trust paid for a clinic, a creche,
   schools and a community centre with drama, singing and a steel band; some say the clearing left many families homeless. Every talk works in any order. ---------- */
export const CH2 = {
  start: ['Gran Ivy remembers.', 'A few years later. A new place called Tivoli Gardens.', 'Ivy and her gran have a new home.'],
  goals: ['Talk to Ivy on the path.', 'Talk to Ivy’s gran by the flats.', 'Talk to Mr Clarke by the community centre.', 'Go to the community centre door.'],
  talk: {
    ivy: [
      { who: 'Ivy', text: 'Look! We live here now.' },
      { who: 'You', text: 'Where is this?' },
      { who: 'Ivy', text: 'Tivoli Gardens. It is new.' },
      { who: 'Ivy', text: 'It was built where Back-o-Wall used to be.', unlock: 'newtivoli' },
      { who: 'Ivy', text: 'Our flat is upstairs. I can see the whole yard!' },
    ],
    pearl: [
      { who: 'Miss Pearl', text: 'Hello, child. Our new home is in this block.' },
      { who: 'Miss Pearl', text: 'The Government built these flats.' },
      { who: 'You', text: 'Did everyone from Back-o-Wall get a flat?' },
      { who: 'Miss Pearl', text: 'No. Some people say many families had nowhere to go.' },
      { who: 'Miss Pearl', text: 'I think of our old neighbours every day.' },
    ],
    clarke: [
      { who: 'Mr Clarke', text: 'Welcome to the community centre!' },
      { who: 'Mr Clarke', text: 'Here we have drama, singing and a steel band.' },
      { who: 'You', text: 'What else is here?' },
      { who: 'Mr Clarke', text: 'A clinic, a crèche for babies, and schools.' },
      { who: 'Mr Clarke', text: 'Come inside and hear the band practise.' },
    ],
  },
  later: {
    ivy: ['Gran says I must be good in the new place.', 'I like the trees. They are small now.'],
    pearl: ['It is a nice flat. But I miss the old yard.', 'Mind the stairs, child.'],
    clarke: ['The door is just there.', 'Everyone is welcome here.'],
  },
  end: {
    title: 'The new Tivoli',
    lines: ['Tivoli Gardens was built in the 1960s.', 'It had new homes, a clinic, a crèche, schools and a community centre.', 'People still disagree about the clearing that came first.', 'Ivy, her gran and Mr Clarke are made up.'],
  },
};

/* ---------- Chapter 4: Sunday 23 May 2010, the day before. You are Ivy's grandchild (fictional). Gran Ivy, Miss Dawn and Mr Brown are fictional. The street is made up.
   Facts (journal pages "The man the US wanted" and "Monday 24 May 2010"): the US asked for Christopher Coke in 2009; the Government agreed on 18 May 2010;
   a state of emergency was declared on 23 May 2010; barricades blocked the entrances before the operation. Who built the barricades is not stated: our sources do not say. ---------- */
export const CH4 = {
  start: ['Sunday 23 May 2010.', 'You live in Tivoli Gardens with Gran Ivy.', 'The girl from Back-o-Wall is a grandmother now.'],
  goals: ['Talk to Gran Ivy by the gate.', 'Talk to Miss Dawn at the shop.', 'Talk to Mr Brown near the bus stop.', 'Go home through the gate.'],
  talk: {
    gran: [
      { who: 'Gran Ivy', text: 'There you are! Stay close to me today.' },
      { who: 'You', text: 'Why, Gran?' },
      { who: 'Gran Ivy', text: 'The radio says there is a state of emergency.' },
      { who: 'Gran Ivy', text: 'Police and soldiers have extra powers now.' },
      { who: 'Gran Ivy', text: 'Soon we go inside and stay together.' },
    ],
    dawn: [
      { who: 'Miss Dawn', text: 'Hello, darling. How is your Gran?' },
      { who: 'You', text: 'She is worried. What is happening?' },
      { who: 'Miss Dawn', text: 'The United States wants a man from here.' },
      { who: 'Miss Dawn', text: 'Last week the Government agreed to send him.', unlock: 'extradition' },
      { who: 'Miss Dawn', text: 'I am closing the shop early. Take care.' },
    ],
    brown: [
      { who: 'Mr Brown', text: 'Look down the road, youngster.' },
      { who: 'Mr Brown', text: 'Barricades block the way in now.' },
      { who: 'You', text: 'Who put them there?' },
      { who: 'Mr Brown', text: 'People will argue about that for years.' },
      { who: 'Mr Brown', text: 'Keep away from them. Stay with your Gran.' },
    ],
  },
  later: {
    gran: ['Not long now, then we go in.', 'Hold my hand when we cross.'],
    dawn: ['Go on home, darling.', 'Tell your Gran I said hello.'],
    brown: ['Keep away from the barricade.', 'Go home safe.'],
  },
  end: {
    title: 'May 2010: before',
    lines: ['On 23 May 2010 the Government declared a state of emergency.', 'Barricades blocked the roads into Tivoli Gardens.', 'The next day, soldiers and police went in.', 'Gran Ivy, Miss Dawn and Mr Brown are made up.'],
  },
};

/* ---------- The journal. simple: for everyone. deeper: "Dig deeper", for older readers. Pages are listed in the order they are written here. ---------- */
export const JOURNAL = [
  { id: 'backowall', title: 'Back-o-Wall', from: 1,
    simple: ['Back-o-Wall was a crowded part of West Kingston.', 'Families built homes of zinc and board.', 'Many Rastafari lived there, and many other families.'],
    deeper: ['People disagree about how many lived there.', 'Edward Seaga said about 1,500 people lived on 40 acres.', 'Historian Clinton Hutton said about 2,300 huts were bulldozed between 1963 and 1966.', 'Jamaica did not have enough homes for ordinary people. Hutton says that is part of this story.', 'Ivy, Miss Pearl and Mass Roy in this game are fictional. We have no photographs or memories to copy, so the scenes are our own imagining.'] },
  { id: 'clearance', title: 'The clearing', from: 1,
    simple: ['In 1963 the Government began to clear Back-o-Wall.', 'Bulldozers knocked down the homes.', 'New homes were built there. They became Tivoli Gardens.', 'The last part was cleared on 12 July 1966.'],
    deeper: ['Before 12 July 1966 there was fighting in West Kingston. One man died and about 30 people were badly hurt.', 'The Government told people to leave by midnight on 11 July.', 'Over 800 shacks were pulled down, and then burned.', 'Churches helped some families find a place to stay.', 'People still disagree. Some say it was needed to stop violence. Others say it left many families homeless.'] },
  { id: 'newtivoli', title: 'Tivoli Gardens is built', from: 2,
    simple: ['Tivoli Gardens was built in the 1960s.', 'It was built where Back-o-Wall had been.', 'It had new homes, a clinic, a crèche and schools.', 'Its community centre had drama, singing and a steel band.'],
    deeper: ['The Ministry of Housing built the homes.', 'A group called the West Kingston Trust paid for the clinic, crèche, schools and community centre.', 'Sources give different dates. One says building ran from 1963 to 1965.', 'Some people say the clearing left many families from Back-o-Wall with no home.', 'Some say the new homes helped one political party grow strong in the area. Chapter 3 tells more.', 'Ivy, Miss Pearl and Mr Clarke in this game are fictional. The flats in this chapter are a general picture, not a copy of the real streets.'] },
  { id: 'extradition', title: 'The man the US wanted', from: 5,
    simple: ['In 2009 the United States asked Jamaica for Christopher Coke.', 'The United States said he led a gang.', 'Jamaica took many months to agree.', 'On 23 May 2010 the Government declared a state of emergency.'],
    deeper: ['The request came on 25 August 2009.', 'The Government agreed on 18 May 2010.', 'Coke was arrested on 22 June 2010 and sent to the United States.', 'In 2012 a US court gave him 23 years in prison.'] },
  { id: 'day', title: 'Monday 24 May 2010', from: 5,
    simple: ['Soldiers and police went into Tivoli Gardens at about midday.', 'Gunfire went on for hours.', 'About 70 civilians died. One soldier died too.', 'Many people were held for days.'],
    deeper: ['The numbers differ: 69, 73, 74 or 76 civilians, depending on the source.', 'The Public Defender’s report in 2013 said 76 civilians and one soldier died.', 'Barricades blocked the entrances to Tivoli Gardens before the operation.', 'The Public Defender later said over 10,000 people were held, some for up to a week.', 'The street in this game is made up.'] },
  { id: 'dispute', title: 'What people disagree about', from: 5,
    simple: ['Soldiers and police said armed men fought them.', 'Many neighbours said they never saw armed men inside.', 'People still disagree about what happened.'],
    deeper: ['Some people say civilians were killed after the soldiers had control. The commanders said they knew of none.', 'The army fired 37 mortar rounds into three open spaces. The Commission called that “a serious error of judgement”. A former army chief disagreed.', 'The Public Defender looked at 44 deaths as possible unlawful killings.', 'The Commission found strong evidence that some police took part in unlawful killings. The police’s own review in 2017 cleared the five officers it had criticised.'] },
  { id: 'after', title: 'After', from: 5,
    simple: ['A Commission of Enquiry looked at what happened.', 'It said the people of Tivoli Gardens should get an apology and money.', 'In 2017 the Prime Minister said sorry in Parliament.'],
    deeper: ['The Commission was led by Sir David Simmons. Its report came out on 15 June 2016.', 'It made 51 recommendations, including counselling for people who suffered.', 'The Government paid grants for burials and damage, and over J$300 million by 2020.', 'The Public Defender said in 2020 that nobody in the police or the army had been held to account.'] },
];

/* the journal's unlock rule: a chapter unlocks its pages when it is finished (or, for the street scene, when it is watched or read) */
export const PAGES_FOR = (chapter) => JOURNAL.filter((p) => p.from === chapter).map((p) => p.id);
