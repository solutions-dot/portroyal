/* games/tivoli/src/content.js: every word the player reads in the story, in one place (the same idea as Kendal's content.js).
   Rules (CLAUDE.md): short lines, about 12 words or fewer, one idea each; plain words for ages 6 and up; no em dashes; every fact comes from the Research tables in
   docs/games/tivoli.md; real people say nothing (they appear only as facts in the journal); every fictional person is named as fictional in the journal.
   The framing (proposed, to be confirmed by the owner): the elder is Ivy, in 2010 a grandmother. In the early chapters you walk through her memories as a child. */

export const CHAPTERS = [
  { id: 1, name: 'Back-o-Wall', when: 'Before the 1960s', line: 'A crowded part of West Kingston, through Ivy’s eyes.', playable: true },
  { id: 2, name: 'The new Tivoli', when: 'The 1960s', line: 'New homes are built where Back-o-Wall stood.', playable: false },
  { id: 3, name: 'Politics and power', when: '1970s to 2009', line: 'How leaders, parties and gangs grew together.', playable: false },
  { id: 4, name: 'May 2010: before', when: 'May 2010', line: 'Barricades, a state of emergency, and a family waiting.', playable: false },
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
      { who: 'Miss Pearl', text: 'Go and see Roy in the lane. He has news.' },
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
    pearl: ['Go on, child. See what Roy says.', 'We have each other.'],
    roy: ['Whatever happens, we stay together.'],
  },
  end: {
    title: 'Back-o-Wall',
    lines: ['In 1963 the Government began to clear Back-o-Wall.', 'The last part was cleared on 12 July 1966.', 'Ivy, her gran and Mass Roy are made up.', 'What happened to Back-o-Wall was real.'],
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
