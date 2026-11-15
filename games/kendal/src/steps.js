/* games/kendal/src/steps.js: the story of Kendal 1957 as step tables for engine/story.js (docs/STANDARD.md, "Story flow").
   One entry per stage. Only the people in a step's needs.talk move that step on and get the gold mark; everyone else gives a short
   flavour line. Counts are added to the goal by the engine. The visible change for each "do" need is registered in main.js
   (STORY.shows), because it moves things in the scene. Rules: one short sentence per goal (owner rule 2), no em dashes. */

export const STEPS = {
  /* ===== chapter 1: the Spanish Town road, about 1844 ===== */
  10: { goal: 'Talk to Mass Dudley, Miss Cleo and the traveller.', needs: { talk: ['dudley', 'cleo', 'traveller'] }, next: 11 },
  11: { goal: 'Help Mass Dudley load his mule.', needs: { do: [{ id: 'mule', n: 3 }] }, next: 12 },
  12: { goal: 'Walk down the road to the men with the red and white poles.', needs: { go: ['poles'] }, at: { poles: [30, 0] }, next: 13 },
  13: { goal: 'Talk to the surveyor.', needs: { talk: ['surveyor'] }, next: 14 },
  14: { goal: 'Well done! Next, the day of the first train.', wait: true },
  /* ===== chapter 2: the first train, 21 November 1845 ===== */
  20: { goal: 'Talk to Mass Dudley, the boy and the clerk.', needs: { talk: ['dudley2', 'boy', 'clerk'] }, next: 21 },
  21: { goal: 'Look at the engine, the Projector.', needs: { do: ['engine'] }, next: 22 },
  22: { goal: 'Climb aboard the open carriage.', needs: { do: ['board'] }, next: 23 },
  23: { goal: 'Ride to Spanish Town. Look at the crowds!', wait: true },
  23.5: { goal: 'Help the water boy. Pass the bucket along.', needs: { do: [{ id: 'water', n: 3, carry: 'bucket' }] }, next: 23.6 },
  23.6: { goal: 'Ride to Spanish Town. Look at the crowds!', wait: true },
  24: { goal: 'Hold on. The train is going home, fast.', wait: true },
  25: { goal: 'Well done! Next, the railway reaches the hills.', wait: true },
  /* ===== chapter 3: a hill station, the 1890s ===== */
  30: { goal: 'Talk to Mr. Gordon, Mr. Abel, Ezra and Miss Ruby.', needs: { talk: ['gordon', 'abel', 'ezraboy', 'ruby'] }, next: 31 },
  31: { goal: 'Carry banana bunches from the pile to the wagon.', needs: { do: [{ id: 'bunch', n: 4, carry: 'bunch' }] }, next: 32 },
  32: { goal: 'Listen! A train is coming up the hill.', wait: true },
  33: { goal: 'Talk to Mr. Abel about the brakes.', needs: { talk: ['abel'] }, next: 34 },
  34: { goal: 'Check the brakes along the train.', needs: { do: ['b0', 'b1', 'b2'] }, next: 35 },
  35: { goal: 'Well done! Next, a Sunday in 1957.', wait: true },
  /* ===== chapter 4: the excursion, Sunday 1 September 1957 ===== */
  40: { goal: 'Talk to Gran, Lloyd and Mass Ezra on the platform.', needs: { talk: ['gran', 'lloyd', 'ezra'] }, next: 41 },
  41: { goal: 'Walk along the train to the last coach. Climb aboard.', needs: { do: ['board57'] }, next: 42 },
  42: { goal: 'Enjoy the ride to Montego Bay. Look out of the windows.', wait: true },
  43: { goal: 'Enjoy the beach. Splash, build or listen: {n} of {of}.', needs: { do: [{ id: 'fun', n: 2 }] }, explore: true, next: 44 },
  44: { goal: 'The sun is going down. Talk to Gran.', needs: { talk: ['gran4'] }, next: 45 },
  45: { goal: 'Well done! Next, the train home.', wait: true },
  /* ===== chapter 5: the night train ===== */
  50: { goal: 'Talk to Gran, Lloyd and the mother with her baby.', needs: { talk: ['gran5', 'lloyd5', 'mother'] }, next: 51 },
  51: { goal: 'The train is moving. Look out of the windows.', needs: { do: ['w0', 'w1'] }, next: 52 },
  52: { goal: 'Sit down with Gran and hold on.', needs: { do: ['seat'] }, next: 53 },
  53: { goal: 'Hold on!', wait: true },
  /* ===== chapter 6: the long night at Kendal ===== */
  60: { goal: 'Talk to Gran and Mr. Clive.', needs: { talk: ['gran6', 'clive'] }, next: 61 },
  61: { goal: 'Fill a bucket at the pipe. Take it to the nurse.', needs: { do: [{ id: 'water', n: 2, carry: 'bucket' }] }, next: 62 },
  62: { goal: 'A little girl is lost. Talk to her.', needs: { talk: ['dawn'] }, next: 63 },
  63: { goal: 'Take the girl to the calling place, by the lamp.', needs: { do: ['calling'] }, next: 64 },
  64: { goal: 'Hold your lamp up, so the helpers can see the way.', needs: { do: ['lamp'] }, next: 65 },
  65: { goal: 'The night is long. Wait for the morning with Gran.', wait: true },
  66: { goal: 'The sun is up. Talk to Gran and Mr. Clive.', needs: { talk: ['gran6', 'clive'] }, next: 67 },
  67: { goal: 'Morning at Kendal. The next chapter is in Chapters.', wait: true },
  /* ===== chapter 7: Kendal today ===== */
  70: { goal: 'Meet Miss Joy and Andre at the memorial.', needs: { talk: ['joy', 'andre'] }, next: 71 },
  71: { goal: 'Look at the storyboard and the monument.', needs: { do: ['sb', 'mn'] }, explore: true, next: 72 },
  72: { goal: 'Leave a flower at the monument.', needs: { do: ['flower'] }, next: 73 },
  73: { goal: 'Andre has a question. Talk to Andre.', needs: { talk: ['andre'] }, next: 74 },
  74: { goal: 'You have finished the story. Thank you for playing! Your journey is in the Journal.', end: true },
};

/* which place each stage happens in (for ?test=flow, which brings each place in turn) */
export function placeOfStage(s) {
  if (s < 20) return 'road'; if (s === 23 || s === 23.5 || s === 23.6 || s === 24) return 'ride45'; if (s < 30) return 'station45'; if (s < 40) return 'hill';
  if (s <= 41) return 'kingston57'; if (s === 42) return 'coach'; if (s < 50) return 'beach'; if (s < 60) return 'coach'; if (s < 70) return 'crash'; return 'memorial';
}
