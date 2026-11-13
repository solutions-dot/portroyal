import * as THREE from 'three';
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';
import { mergeGeometries as mergeG } from 'three/addons/utils/BufferGeometryUtils.js';
import { CL, mixers, grounded, HIPS_Y, setFallbackClip, loadClips, seamLoop, clipFor, animate, groundFeet } from '../../../engine/anim.js';
import { AU, soundPref, setSound, audioInit, out, gullCry, stepSound, crackle, chirp, cue, setG, tone, noiseHit, shipCreak, hammer, clink, uiSound } from '../../../engine/audio.js';
import { loader, onLoadFail, script, model, stage } from '../../../engine/loader.js';
soundPref('portroyal-sound');
onLoadFail((n) => { $('loadnote').hidden = false; $('loadnote').textContent = 'Part of the game did not load (' + n + '). Reload the page to try again.'; });

/* ---------- story content: plain words first, more detail behind "Dig deeper" ---------- */
const JOURNAL = [
  { id: 'galdy', title: 'Who is Lewis Galdy?',
    simple: ['Lewis Galdy was a real person. He was born in France in 1659.',
             'His family were Huguenots, French Protestants. France punished them for their faith, so Lewis sailed to Jamaica.'],
    deeper: ['We know this from the words carved on his tombstone. You can still read it at St Peter’s Church in Port Royal.',
             'Nobody wrote down the year he arrived. This game starts his story in 1690. That date is our best guess, not a fact.'] },
  { id: 'town', title: 'The town on the sand',
    simple: ['Port Royal sat on a thin strip of sand in Kingston Harbour. About 6,500 people lived here, packed close together.',
             'There was not much land, so people built upward. Some brick houses were four floors high.'],
    deeper: ['Around 1690, Port Royal was about the same size as Boston. It was one of the busiest English ports in the Americas, and brick houses were a sign of money.',
             'From 1981 to 1990, archaeologists dug up five buildings that now lie under the sea. The houses in this game are based on what they found, and on paintings made from their work.'] },
  { id: 'coins', title: 'Pieces of eight',
    simple: ['People in Port Royal paid with silver coins from Spanish lands.',
             'The big coin was called a piece of eight. It was worth eight smaller coins called reales.'],
    deeper: ['In most English colonies, people swapped goods like sugar or tobacco. Port Royal was different. So much Spanish silver arrived, through trade and through raids on Spanish ships and towns, that people used coins every day.'] },
  { id: 'people', title: 'Who lived here?',
    simple: ['People came to Port Royal from England, France, Africa and many other places.',
             'Not everyone was free. Many African people here were enslaved: forced to work, unpaid, and not allowed to leave.',
             'Abba is a free woman. That was rare.'],
    deeper: ['About 2,500 of the people in the town were enslaved Africans. Part of Port Royal’s wealth came from buying and selling human beings. This game will not hide that.',
             'Abba is a character we made up. She stands for the free Black and mixed-race people who really lived in Jamaica at this time. Church records list a free Black couple, Peter Moore and Black Betty, who married in 1677.'] },
  { id: 'harbour', title: 'The busy harbour',
    simple: ['Port Royal had one of the busiest harbours in the Americas. In the year 1688, 213 ships came here.',
             'Ships left Jamaica full of sugar, rum, cotton, ginger and wood.'],
    deeper: ['In that same year, 226 ships visited all of New England put together. One small town in Jamaica was almost as busy as a whole region.',
             'Ships also carried enslaved African people here to be sold. The money and the cruelty came in through the same harbour.'] },
  { id: 'change', title: 'Making change',
    simple: ['A piece of eight was worth eight reales. Abba\u2019s stew cost two reales, so you got six back.',
             'Sometimes people cut a coin into smaller pieces to make change. The pieces were called bits.'],
    deeper: ['The prices in this game are made up. Nobody wrote down what a bowl of stew cost in a Port Royal tavern in 1690.'] },
  { id: 'bottle', title: 'Onion bottles',
    simple: ['This round bottle is called an onion bottle, because of its shape. It held wine or other drinks.',
             'Divers found a huge number of bottles like this under the sea at Port Royal.'],
    deeper: ['Some bottles came up still sealed, with liquid inside, after more than 250 years under the sea.',
             'You can see real objects from Port Royal at the National Museum of Jamaica in Kingston.'] },
  { id: 'pewter', title: 'Pewter plates',
    simple: ['Pewter is a soft grey metal. Many people ate from pewter plates.',
             'In one sunken building, archaeologists found about 25 pewter plates stacked in a cupboard under the stairs.'],
    deeper: ['Port Royal has given the world its largest collection of pewter from the late 1600s.',
             'A pewter maker named Simon Benning was working in Jamaica by the 1660s. His son carried on the shop.'] },
  { id: 'pipes', title: 'Clay pipes',
    simple: ['Many people in Port Royal smoked tobacco in long clay pipes. Divers found so many pipes that it seemed the whole town smoked.',
             'Today we know that smoking harms the body. People in 1690 did not know that.'],
    deeper: ['Archaeologists found white clay pipes that had never been used, still waiting to be sold.',
             'Some pipes were made in Jamaica from local red clay. African craftspeople, both free and enslaved, made them.'] },
  { id: 'turtle', title: 'The turtle-shell box',
    simple: ['This little box is covered in turtle shell. A box like it was found under the sea at Port Royal.',
             'Sea turtles were easy to find near the town. People ate turtle meat and made things from the shells.'],
    deeper: ['In one sunken building, archaeologists found sea turtle shells in a room used for cutting up meat.',
             'Today sea turtles are in danger and are protected by law. Nobody should hunt them now.'] },
  { id: 'quake', title: 'The earthquake',
    simple: ['On 7 June 1692, just before noon, a huge earthquake hit Port Royal.', 'In about three minutes, most of the town was gone.'],
    deeper: ['As many as 2,000 people died that day. Thousands more died in the days and weeks after.',
             'A news sheet printed in London that year lists what people saw: houses falling, the great church and its tower coming down, the wharf covered by the sea, and a boat coming to save people.'] },
  { id: 'sand', title: 'Why the ground swallowed the town',
    simple: ['Port Royal was built on loose, wet sand.', 'When wet sand shakes hard, it acts like a liquid. Heavy houses sank straight down into it.'],
    deeper: ['Scientists call this liquefaction.', 'It is why divers found some buildings under the sea with their brick floors still in place.'] },
  { id: 'watch', title: 'The stopped watch',
    simple: ['In 1959, divers found a brass pocket watch under the sea at Port Royal.', 'Its hands had stopped at 17 minutes before noon.'],
    deeper: ['The watch was made in Amsterdam in 1686. People believe it stopped when the earthquake struck. That is how we know the time: about 11:43 in the morning.'] },
  { id: 'tomb', title: 'Swallowed, and saved',
    simple: ['This part of the story is true. Lewis Galdy was swallowed by the ground. A second shock threw him out into the sea.', 'He swam until a boat picked him up.'],
    deeper: ['His tombstone says he was \u201cmiraculously saved by swimming until a boat took him up.\u201d He lived for 47 more years.',
             'In this game, Abba is in the boat. We made that part up. Nobody wrote down who was in the boat that saved him.'] },
  { id: 'after', title: 'The days after',
    simple: ['The earthquake lasted about three minutes. The hard days came after.', 'There was little food and no clean water. Many people got sick, and thousands more died.'],
    deeper: ['At night, thieves robbed the broken houses. The town\u2019s minister wrote about them in a letter.', 'The camp in this game is made up. The hunger, the sickness and the thieves were real.'] },
  { id: 'tentp', title: 'Church in a tent',
    simple: ['The great church fell down in the earthquake.', 'So the minister held church in a tent.'],
    deeper: ['A news sheet printed in London in 1692 shows him preaching in a tent, with ruined houses all around.'] },
  { id: 'kingston', title: 'A new town across the water',
    simple: ['Most people who lived left Port Royal. They crossed the harbour and began a new town.', 'That town became Kingston, the capital of Jamaica today.'],
    deeper: ['Port Royal was built again, but smaller. It was never again the great trading town it had been.', 'A few merchants and fishermen stayed. Lewis Galdy was one of them.'] },
  { id: 'fortune', title: 'Where the money came from',
    simple: ['Lewis Galdy became rich again. He sold wine and cocoa. He also sold people.', 'He worked for a company that shipped enslaved African people to Spanish lands. This game does not hide that.'],
    deeper: ['That trade was called the Asiento. Galdy was one of its agents in Jamaica.', 'He also sat in Jamaica\u2019s Assembly, which made the island\u2019s laws.'] },
  { id: 'stone', title: 'The tombstone',
    simple: ['Lewis Galdy died in 1739. He was 80 years old.', 'His tombstone tells how the earthquake swallowed him and how he was saved. You can visit it today at St Peter\u2019s Church in Port Royal.'],
    deeper: ['As a churchwarden, he helped to get this church built again. It was finished in 1725.', 'His tomb was first at a place called Green Bay, across the harbour. It was moved here in 1953.',
             'The stone tells his story. The people he bought and sold have no stones, and most of their names were never written down.'] },
  { id: 'sugar', title: 'Sugar',
    simple: ['These big casks are full of sugar. Sugar was the main thing Jamaica sold to the world.', 'Enslaved African people grew the sugar cane and made the sugar. The work was hard and dangerous.'],
    deeper: ['A big cask like this is called a hogshead.', 'Sugar made planters and merchants rich. The people who made it were paid nothing.'] },
  { id: 'cocoa', title: 'Cocoa',
    simple: ['These sacks hold cocoa beans. People ground them up to make a chocolate drink.', 'We know that Lewis Galdy traded in cocoa.'],
    deeper: ['In the 1600s, chocolate was a drink, not a bar. People drank it hot, often with spices.'] },
  { id: 'logwood', title: 'Logwood',
    simple: ['This dark red wood is called logwood. It was not for building.', 'People boiled it to make dye for cloth.'],
    deeper: ['Many old privateers became logwood cutters on the coast of Central America. Much of their wood was shipped through Jamaica to Europe.'] },
  { id: 'scales', title: 'Weighing coins',
    simple: ['Merchants did not just count coins. They weighed them.', 'Some people shaved silver off coins to keep it. A scale showed if a coin was too light.'],
    deeper: ['Shaving coins was called clipping. It was a crime.'] },
  { id: 'market', title: 'The slave market',
    simple: ['Ships brought enslaved African people to Port Royal to be sold.', 'Families were split up on the wharf. The law allowed it. It was still wrong.'],
    deeper: ['Until 1698, one company, the Royal African Company, was the only English company allowed to bring enslaved people from Africa.',
             'We do not know the year Lewis Galdy began to buy and sell people. We know that he did. The letter in this game is made up, to show the choice in front of him.',
             'Abba\u2019s mother is made up too. Thousands of real mothers were sold in Port Royal.'] },
  { id: 'swan', title: 'The ship over the houses',
    simple: ['When the earthquake struck, the sea rushed over the wharf.', 'A ship called the Swan was by the shore. The water carried it right over the sunken houses.'],
    deeper: ['People in the water climbed onto the Swan and were saved.', 'Sam is a character we made up, but people who were there wrote about the Swan.'] },
  { id: 'kofi', title: 'Kofi\u2019s name',
    simple: ['Many enslaved people in Jamaica came from West Africa. Kofi is a West African name for a boy born on a Friday.', 'Owners often gave enslaved people new names. Many kept their own names among themselves.'],
    deeper: ['Enslaved Africans did much of the hardest work in Port Royal: loading ships, carrying goods, building and rowing.', 'Kofi is a character we made up. About 2,500 enslaved people lived in Port Royal, and most of their names were never written down.'] },
  { id: 'privateer', title: 'Pirates and privateers',
    simple: ['A privateer had papers from the government to attack enemy ships. A pirate had no papers.', 'In the 1660s, English leaders let privateers from Port Royal raid Spanish ships and towns.'],
    deeper: ['The most famous was Henry Morgan. He later became Lieutenant Governor of Jamaica.', 'By the 1680s the government had turned against the raiders. Pirates caught by the law were hanged at Gallows Point, just outside the town.', 'Sam is a character we made up.'] },
  { id: 'benning', title: 'The Bennings, pewterers',
    simple: ['Simon Benning was a real pewterer. He made plates, spoons and cups from pewter.', 'He died in 1687. His son Symon kept the shop going until the earthquake.'],
    deeper: ['Their mark was a pineapple with the letters S and B. Pewter with this mark has been found under the sea at Port Royal.', 'Marks like these help archaeologists work out who made the things they find.', 'The words of Symon Benning in this game are made up.'] },
  { id: 'heath', title: 'The Reverend Emmanuel Heath',
    simple: ['Emmanuel Heath was a real person. He was the minister of St Paul\u2019s Church in Port Royal.', 'He lived through the earthquake and wrote letters about it. We know a lot about that day because of him.'],
    deeper: ['He wrote from a ship called the Granada, out in the harbour. He went ashore to pray with the hurt and dying, and to christen children.', 'Like many people then, he believed the earthquake was God\u2019s punishment. Today, scientists explain it with loose, wet sand turning to liquid.', 'His words in this game are made up, but they follow what he wrote.'] },
];
const COINS = [
  { who: 'You', text: 'A cook wants a sack of cocoa. It costs 20 reales.' },
  { who: 'You', text: 'He gives me 3 pieces of eight. Each one is worth 8 reales. How many reales do I give back?',
    choices: [{ t: '2 reales' }, { t: '4 reales', ok: true }, { t: '6 reales' }], hint: 'Not quite. Three eights are 24. Take away 20.' },
  { who: 'You', text: 'Four reales. But one coin is too light. Someone shaved its edge!', unlock: 'scales' },
];
const WARE1 = [
  { who: 'Abba', text: 'Good day, Lewis. I need a cask of wine for The Turtle.' },
  { who: 'You', text: 'Take the one by the door. You can pay me on Friday.' },
  { who: 'Abba', text: 'There is a letter on your desk. It is from the captain of a slave ship.' },
  { who: 'Abba', text: 'My mother was sold on that wharf. Read the letter. Then decide.', unlock: 'market' },
  { who: 'You', text: 'Abba, wait. I have not said yes.' },
  { who: 'Abba', text: 'I know. That is why I came.' },
  { who: 'Abba', text: 'Good day, Lewis.' },
];
const NPCS = [
  { id: 'kofi', label: 'Talk to the dockworker', who: 'Kofi', x: 19.7, z: 2.3, ry: Math.PI + 0.5, route: [[19.7, 2.3], [19.7, -0.3], [31, -0.3]], talk: [
    { who: 'Kofi', text: 'Mind the casks. They are heavy!' },
    { who: 'You', text: 'Do you work for the captain?' },
    { who: 'Kofi', text: 'No. I am enslaved. A man says he owns me. I work, but I am not paid.' },
    { who: 'Kofi', text: 'My name is Kofi. It means I was born on a Friday. I keep my own name.', unlock: 'kofi' }],
    again: [{ who: 'Kofi', text: 'I must get back to work.' }] },
  { id: 'sailor', label: 'Talk to the sailor', who: 'Sam', x: 34.5, z: 0.55, y: 0.06, ry: Math.PI / 2, talk: [
    { who: 'Sam', anim: 'Point', text: 'Fine boat, isn’t she? Made of Jamaica cedar. Very fast!' },
    { who: 'You', text: 'Are you a pirate?' },
    { who: 'Sam', text: 'Hush! Captain Morgan had papers to fight Spain. That made us privateers, not pirates.' },
    { who: 'Sam', text: 'Now the law has changed. Pirates get hanged.', unlock: 'privateer' }],
    again: [{ who: 'Sam', text: 'We sail with the tide. Keep your money safe!' }] },
  { id: 'benning', label: 'Talk to the pewterer', who: 'Symon Benning', x: 8.6, z: 4.0, ry: Math.PI, talk: [
    { who: 'Symon Benning', text: 'Good day! I am Symon Benning. I make pewter plates and cups.' },
    { who: 'You', text: 'You make them here?' },
    { who: 'Symon Benning', text: 'Yes. I melt the metal and pour it into moulds. My father taught me.' },
    { who: 'Symon Benning', text: 'Look under a plate for our mark: a pineapple!', unlock: 'benning' }],
    again: [{ who: 'Symon Benning', text: 'Come back when you need plates!' }] },
];
const HEATH = { x: -9.65, z: 1.75, ry: Math.PI / 2 }, SURV = [[-2.6, -1.3, -0.6, 'sailor'], [-13.4, -1.6, 0.4, 'benning'], [-7.2, 3.9, Math.PI + 0.3, 'kofi']], EXTRA = [[-0.6, -0.4, -1.8, 'benning', 'Sad1', [0.62, 0.6, 0.58]], [-4.3, 3.7, 2.8, 'kofi', 'Sad2', [0.9, 0.85, 0.8]], [-14.4, 3.6, 2.2, 'sailor', 'Sad2', [0.7, 0.7, 0.66]], [-15.2, 1.4, 1.4, 'kofi', 'Cry', [0.75, 0.72, 0.7]]];
const SAM_AFTER = [
  { who: 'Sam', text: 'Mr Galdy! You are alive! I saw the ground swallow you.' },
  { who: 'Sam', text: 'The sea came over the wharf. A big ship, the Swan, floated right over the houses!' },
  { who: 'Sam', text: 'Our boat is gone. I have nothing now.', unlock: 'swan' },
  { who: 'Sam', text: 'They say even Captain Morgan’s grave is under the sea now.' }];
const KOFI_AFTER = [
  { who: 'Kofi', text: 'A wall fell by the wharf. I got out. Many did not.' },
  { who: 'Kofi', text: 'Nobody will write down their names.' },
  { who: 'Kofi', text: 'So I say their names. Every night.' }];
const BENNING_AFTER = [
  { who: 'Symon Benning', text: 'My shop is under the sea. My father’s work is gone.' },
  { who: 'You', text: 'I am sorry, Symon.' },
  { who: 'Symon Benning', text: 'Maybe one day someone will find our plates. Then they will know we were here.' }];
const HEATH_TALK = [
  { who: 'Emmanuel Heath', text: 'I am Emmanuel Heath, the minister. My church fell down.' },
  { who: 'Emmanuel Heath', text: 'Now I sleep on a ship. I come ashore to help the sick.' },
  { who: 'Emmanuel Heath', text: 'Some say God was angry with this town. Pray for us.', unlock: 'heath' }];
const AFTER1 = [
  { who: 'Abba', text: 'You are alive! I pulled so many from the water.' },
  { who: 'Abba', text: 'It has been three days. There is little food, and people are sick.', unlock: 'after' },
  { who: 'Abba', text: 'Look around. Then come back to me.' },
];
const AFTER2 = [
  { who: 'Abba', text: 'Most people are leaving. They will build a new town across the water.' },
  { who: 'Abba', text: 'You will be rich again, Lewis. But think about what you sell.' },
];
const TALK = [
  { who: 'Abba', text: 'Morning! You look lost. Are you new in Port Royal?',
    choices: ['Yes. I just got off the ship.', 'Is it that easy to tell?'] },
  { who: 'Abba', text: 'Everyone here came from somewhere else. Where is home?' },
  { who: 'You', text: 'France. We had to leave because of the way we pray.', unlock: 'galdy' },
  { who: 'Abba', text: 'Lots of people here are starting again. I am Abba. This is my tavern.', unlock: 'people' },
  { who: 'Abba', text: 'Money here is silver coins. They are called pieces of eight.', unlock: 'coins' },
  { who: 'Abba', text: 'Come inside when you are hungry. My turtle stew is the best in town!', unlock: 'town' },
];

const STEW = [
  { who: 'Abba', text: 'Welcome to The Turtle! Stew costs two reales.' },
  { who: 'You', text: 'I only have this. One piece of eight.' },
  { who: 'Abba', text: 'A piece of eight is eight reales. The stew is two. How much change do I give you?',
    choices: [{ t: 'Four reales' }, { t: 'Six reales', ok: true }, { t: 'Eight reales' }], hint: 'Not quite. Start with eight and take away two.' },
  { who: 'Abba', text: 'Six! Here is your change, and your stew.', unlock: 'change' },
  { who: 'Abba', text: 'Look around while you eat. Most things here came on a ship.' },
];
const AFTER = [{ who: 'Abba', text: 'Take your time. Look around.' }];
const FINDS = [
  { id: 'bottle', label: 'Look at the bottle', x: -198.8, z: -2.15, y: 1.02 },
  { id: 'pewter', label: 'Look at the plates', x: -198.2, z: 1.3, y: 0.78 },
  { id: 'pipes', label: 'Look at the pipes', x: -201.6, z: 1.0, y: 0.78 },
  { id: 'turtle', label: 'Look at the little box', x: -195.9, z: 2.3, y: 0.78 },
];

/* ---------- state ---------- */
const state = { started: false, x: 43, z: 0, yaw: Math.PI / 2, pitch: 0, unlocked: [], talked: false, step: 0, place: 'out', ate: false, done: false, ch: {} };
const $ = (id) => document.getElementById(id);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = matchMedia('(pointer: coarse)').matches;

/* ---------- renderer and scene ---------- */
const canvas = $('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
const PHONE = matchMedia('(pointer: coarse)').matches || Math.min(innerWidth, innerHeight) < 600; let pxr = Math.min(devicePixelRatio || 1, PHONE ? 1.25 : 1.75); renderer.setPixelRatio(pxr);
let ftAvg = 16, ftT = 0;   /* if frames run slow for a few seconds, draw fewer pixels */
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
const scene = new THREE.Scene();
const HAZE = new THREE.Color(0xcfe3ea);
scene.fog = new THREE.Fog(HAZE, 70, 900);
const camera = new THREE.PerspectiveCamera(68, 1, 0.1, 3000);
camera.rotation.order = 'YXZ';

const hemi = new THREE.HemisphereLight(0xe6f1ff, 0xb39a78, 2.3); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff1d8, 2.6); sun.position.set(-0.35, 1, 0.75); scene.add(sun);

let sky = null;
// sky dome with a soft gradient
{ const g = new THREE.SphereGeometry(2500, 24, 12); const c = []; const top = new THREE.Color(0x3f86c9), col = new THREE.Color();
  for (let i = 0; i < g.attributes.position.count; i++) { const t = Math.max(0, g.attributes.position.getY(i) / 2500); col.copy(HAZE).lerp(top, Math.pow(t, 0.55)); c.push(col.r, col.g, col.b); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3));
  sky = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false })); sky.userData.far = true; scene.add(sky); }

function noiseTex(base, spread, rep) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const d = x.createImageData(128, 128);
  for (let i = 0; i < d.data.length; i += 4) { const n = (Math.random() - 0.5) * spread; d.data[i] = base[0] + n; d.data[i + 1] = base[1] + n; d.data[i + 2] = base[2] + n * 0.8; d.data[i + 3] = 255; }
  x.putImageData(d, 0, 0); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const S = 5.2, X0 = -17.9, X1 = 17.9, SHORE = 23; const seaMat = new THREE.MeshStandardMaterial({ color: 0x2b8ea0, roughness: 0.22, metalness: 0.15 });
{ // sand, sea, far hills
  const sand = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), new THREE.MeshStandardMaterial({ map: noiseTex([203, 180, 138], 34, 60), roughness: 1 }));
  sand.rotation.x = -Math.PI / 2; sand.position.set(SHORE - 80, 0, 0); scene.add(sand);
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(5000, 5000), seaMat);
  sea.rotation.x = -Math.PI / 2; sea.position.y = -0.62; scene.add(sea);
  for (const [r, h, colr, seed] of [[1500, 230, 0x7fa3a6, 1], [1150, 120, 0x5f8f86, 2]]) {
    const pos = [], n = 160;
    for (let i = 0; i <= n; i++) { const a = -Math.PI + 2 * Math.PI * i / n, da = Math.abs(Math.atan2(Math.sin(a - 1.45), Math.cos(a - 1.45))), fade = Math.max(0, Math.min(1, (da - 0.95) / 0.7)), hh = fade * h * (0.45 + 0.3 * Math.sin(i * 0.21 + seed) + 0.18 * Math.sin(i * 0.63 + seed * 3) + 0.07 * Math.sin(i * 1.7)); pos.push(Math.cos(a) * r, -2, Math.sin(a) * r, Math.cos(a) * r, Math.max(0, hh) - 1, Math.sin(a) * r); }
    const idx = []; for (let i = 0; i < n; i++) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
    const hill = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: colr, side: THREE.DoubleSide, fog: false })); hill.userData.far = true; scene.add(hill);
  }
}

/* ---------- the ship you arrived on ---------- */
const indoor = new THREE.Group(); indoor.visible = false; scene.add(indoor); let cur = scene;
function mk(geo, mat, x, y, z, parent) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (parent || cur).add(m); return m; }

/* ---------- harbour: pier, moored ships, cargo, beached boat, nets ---------- */
let seaN = null, waves = null; const streetProps = []; const shipsM = {};
function buildHarbour() {
  const std = (map, r) => new THREE.MeshStandardMaterial({ map, roughness: r === undefined ? 0.9 : r });
  const B = (w, h, d, m, x, y, z, p) => mk(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
  const deckT = plankTex([138, 120, 96], 5, 21, 3), deckM = std(deckT), timber = std(plankTex([84, 66, 48], 3, 1, 2)), pileM = std(plankTex([70, 56, 42], 4, 1, 2)), ironM = new THREE.MeshStandardMaterial({ color: 0x1c1c1e, roughness: 0.6, metalness: 0.7 });
  const ropeM = new THREE.MeshStandardMaterial({ map: noiseTex([168, 146, 104], 30, 4), roughness: 1 }), sackM = new THREE.MeshStandardMaterial({ map: noiseTex([156, 136, 100], 30, 3), roughness: 1 });
  const x0 = SHORE - 2.5, x1 = SHORE + 23, len = x1 - x0, cx = (x0 + x1) / 2;
  B(len, 0.1, 3.4, deckM, cx, 0.0, 0);                                                              // deck planks laid across
  for (const z of [-1.62, 1.62]) { B(len, 0.22, 0.2, timber, cx, -0.14, z); B(len, 0.12, 0.16, timber, cx, 0.1, z * 1.02); }
  for (let x = x0 + 1; x < x1; x += 2.6) { B(0.2, 0.22, 3.2, timber, x, -0.16, 0);
    for (const z of [-1.72, 1.72]) { const tall = Math.round((x - x0) / 2.6) % 2 === 0; const p = mk(new THREE.CylinderGeometry(0.15, 0.17, tall ? 3.3 : 2.4, 9), pileM, x, tall ? -0.25 : -0.9, z); if (tall) mk(new THREE.CylinderGeometry(0.17, 0.15, 0.06, 9), timber, x, 1.42, z); }
    if (x < x1 - 2) for (const s of [-1, 1]) { const br = B(0.1, 0.1, 3.6, timber, x, -0.85, 0); br.rotation.x = s * 0.5; } }
  for (const [x, z] of [[SHORE + 6, 1.72], [SHORE + 11.2, 1.72], [SHORE + 8.6, -1.72], [SHORE + 16.4, -1.72]]) { const r = mk(new THREE.TorusGeometry(0.24, 0.045, 6, 14), ropeM, x, 0.75, z); r.rotation.x = Math.PI / 2; mk(new THREE.TorusGeometry(0.25, 0.045, 6, 14), ropeM, x, 0.84, z).rotation.x = Math.PI / 2; }
  const coil = (x, z, r) => { for (let i = 0; i < 3; i++) mk(new THREE.TorusGeometry(r - i * 0.02, 0.04, 6, 16), ropeM, x, 0.09 + i * 0.07, z).rotation.x = Math.PI / 2; };
  coil(SHORE + 4, -1.2, 0.3); coil(SHORE + 19, 1.15, 0.34);
  // ships: the merchantman you came on, and a Jamaica sloop across the pier
  const m = shipsM.merchant; m.position.set(SHORE + 17.5, -0.35, -5.9); scene.add(m);
  const sl = shipsM.sloop; sl.position.set(SHORE + 17.5, -0.35, 4.9); sl.rotation.y = Math.PI; scene.add(sl);
  const gp = B(1.0, 0.07, 2.3, deckM, SHORE + 17.6, 0.66, -2.1); gp.rotation.x = -0.56; for (let i = 0; i < 5; i++) { const c = B(1.0, 0.03, 0.05, timber, SHORE + 17.6, 0.2 + i * 0.25, -1.4 - i * 0.4); c.rotation.x = -0.56; }
  const line = (a, b) => { const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a), new THREE.Vector3((a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 0.25, (a[2] + b[2]) / 2), new THREE.Vector3(...b)]); scene.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0x8a744e }))); };
  line([SHORE + 8.6, 0.8, -1.72], [SHORE + 6, 3.2, -3.6]); line([SHORE + 16.4, 0.8, -1.72], [SHORE + 21.5, 2.2, -3.4]); line([SHORE + 11.2, 0.8, 1.72], [SHORE + 10.5, 1.5, 3.4]); line([SHORE + 19, 0.6, 1.72], [SHORE + 24.5, 1.9, 3.3]);
  // cargo: casks with hoops, slatted crates, sacks
  const caskG = new THREE.LatheGeometry([[0, -0.45], [0.27, -0.45], [0.33, -0.25], [0.36, 0], [0.33, 0.25], [0.27, 0.45], [0, 0.45]].map(([a, b]) => new THREE.Vector2(a, b)), 14), caskM = std(plankTex([122, 90, 56], 10, 2, 1), 0.8);
  const hoopG = [[-0.38, 0.292], [-0.2, 0.342], [0.2, 0.342], [0.38, 0.292]].map(([y, r]) => [y, new THREE.CylinderGeometry(r, r, 0.035, 14, 1, true)]);
  const cask = (x, y, z, lying) => { const g = new THREE.Group(); g.position.set(x, y + (lying ? 0.36 : 0.45), z); if (lying) { g.rotation.z = Math.PI / 2; g.rotation.y = x * 2.3; } scene.add(g); mk(caskG, caskM, 0, 0, 0, g); for (const [hy, hg] of hoopG) mk(hg, ironM, 0, hy, 0, g); };
  const crateM = std(plankTex([150, 118, 78], 4, 1, 1));
  const crate = (x, y, z, s, r) => { const g = new THREE.Group(); g.position.set(x, y + s / 2, z); g.rotation.y = r; scene.add(g); B(s, s, s, crateM, 0, 0, 0, g); for (const a of [-1, 1]) for (const b of [-1, 1]) { B(0.07, s + 0.03, 0.07, timber, a * s / 2, 0, b * s / 2, g); B(s + 0.03, 0.07, 0.07, timber, 0, a * s / 2, b * s / 2, g); B(0.07, 0.07, s + 0.03, timber, a * s / 2, b * s / 2, 0, g); } };
  const sack = (x, y, z, s) => { const k = mk(new THREE.SphereGeometry(0.32, 10, 8), sackM, x, y + 0.2 * s, z); k.scale.set(s * 1.2, 0.7 * s, s * 0.85); k.rotation.y = x; };
  const nStreet = scene.children.length;   /* everything from here on is solid: the pier casks and crates, Kofi's barrels, the crate stacks and the street cargo */
  cask(SHORE + 2.2, 0.05, 1.32); cask(SHORE + 2.95, 0.05, 1.32); cask(SHORE + 3.8, 0.05, 1.28, true); crate(SHORE + 14.6, 0.05, 1.1, 0.8, 0.2); crate(SHORE + 15.5, 0.05, 1.2, 0.6, 0.6); crate(SHORE + 14.7, 0.85, 1.1, 0.55, 0.5); sack(SHORE + 13.7, 0.05, 1.2, 1);
  for (const [x, z, k] of [[20.6, 5.4, 0], [21.3, 5.7, 0], [20.9, 6.5, 2], [19.6, -3.2, 1], [20.6, -2.8, 0], [21.5, -3.3, 1], [20.3, -3.9, 3], [21.1, -4.1, 3], [20.7, -4.0, 4]]) { if (k === 0) cask(x, 0, z); else if (k === 2) cask(x, 0, z, true); else if (k === 1) crate(x, 0, z, 0.75, x); else if (k === 3) sack(x, 0, z, 1); else sack(x, 0.3, z, 0.9); }
  for (const [x, z, k] of [[-9.6, -4.4, 0], [3.4, 4.35, 0], [4.15, 4.4, 1], [-13.2, 4.4, 0], [11.6, -4.4, 1], [12.3, -4.45, 0]]) { if (k) crate(x, 0.12, z, 0.65, 0.1); else cask(x, 0.12, z); }
  crate(19.0, 0, 3.05, 0.7, 0.1); crate(19.8, 0, 3.15, 0.7, -0.15); crate(19.4, 0.7, 3.1, 0.55, 0.3);   /* the stack Kofi carries crates from */
  for (const [x, z, k] of [[18.7, -6.1, 0], [19.4, -5.9, 0], [18.9, -6.9, 1], [19.7, -7.3, 2], [18.6, -7.9, 3], [20.4, -5.7, 1], [21.1, -6.0, 3]]) { if (k === 0) cask(x, 0, z); else if (k === 1) crate(x, 0, z, 0.72, x); else if (k === 2) cask(x, 0, z, true); else sack(x, 0, z, 1); }   /* cargo on the far side of the harbour corner */
  for (const [x, z, k] of [[18.5, 21.7, 0], [19.2, 21.9, 1], [18.6, 22.5, 0], [19.0, 23.1, 2], [21.9, 23.4, 0], [22.5, 23.0, 3], [18.5, 23.4, 1], [19.5, 22.6, 4]]) { if (k === 0) cask(x, 0, z); else if (k === 1) crate(x, 0, z, 0.72, x); else if (k === 2) cask(x, 0, z, true); else if (k === 3) sack(x, 0, z, 1); else sack(x, 0.3, z, 0.9); }   /* barrels beside the beached boat, closing the gap between the boat and the wall (the street mouth stays clear) */
  streetProps.push(...scene.children.slice(nStreet));
  // a boat drawn up on the sand, with oars, and nets drying on a rack
  { const L = 4.6, Bm = 1.5, sh = new THREE.Shape(); sh.moveTo(-L / 2, -Bm * 0.36); sh.quadraticCurveTo(0, -Bm * 0.56, L * 0.3, -Bm * 0.4); sh.quadraticCurveTo(L * 0.45, -Bm * 0.2, L / 2, 0); sh.quadraticCurveTo(L * 0.45, Bm * 0.2, L * 0.3, Bm * 0.4); sh.quadraticCurveTo(0, Bm * 0.56, -L / 2, Bm * 0.36); sh.closePath();
    const hg = new THREE.ExtrudeGeometry(sh, { depth: 0.62, bevelEnabled: false, curveSegments: 8 }); hg.rotateX(-Math.PI / 2); const p = hg.attributes.position; for (let i = 0; i < p.count; i++) { const h = p.getY(i); if (h < 0.3) { p.setZ(i, p.getZ(i) * 0.45); p.setX(i, p.getX(i) * 0.9); } } hg.computeVertexNormals();
    const boat = new THREE.Group(); boat.position.set(SHORE - 2.6, 0.0, 22.4); boat.rotation.set(0, 0.08, 0.12);   /* drawn up across the end of the beach strip: the edge of the town */ scene.add(boat); const hm = std(plankTex([96, 80, 62], 6, 3, 1)); hm.side = THREE.DoubleSide; mk(hg, hm, 0, 0, 0, boat);
    B(L * 0.86, 0.03, Bm * 0.78, new THREE.MeshStandardMaterial({ color: 0x3a2c20, roughness: 1 }), -0.1, 0.34, 0, boat); for (const x of [-1.2, -0.2, 0.9]) B(0.22, 0.04, Bm * 0.86, timber, x, 0.5, 0, boat);
    for (const z of [-0.2, 0.15]) { const o = mk(new THREE.CylinderGeometry(0.025, 0.025, 3.2, 6), timber, -0.2, 0.56, z, boat); o.rotation.z = Math.PI / 2 + 0.03; B(0.6, 0.02, 0.14, timber, 1.5, 0.52, z, boat); } }
  { const netT = cv(128, 128, (x) => { x.clearRect(0, 0, 128, 128); x.strokeStyle = 'rgba(96,84,60,0.95)'; x.lineWidth = 1.4; for (let i = -128; i < 256; i += 12) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 128, 128); x.stroke(); x.beginPath(); x.moveTo(i, 0); x.lineTo(i - 128, 128); x.stroke(); } }); netT.repeat.set(3, 1.4);
    const nx = SHORE - 3.2, nz = -8.4; for (const dx of [-2, 2]) mk(new THREE.CylinderGeometry(0.05, 0.06, 2.3, 6), timber, nx + dx, 1.15, nz); const bar = mk(new THREE.CylinderGeometry(0.04, 0.04, 4.3, 6), timber, nx, 2.2, nz); bar.rotation.z = Math.PI / 2;
    const net = mk(new THREE.PlaneGeometry(3.9, 1.9, 8, 1), new THREE.MeshBasicMaterial({ map: netT, transparent: true, side: THREE.DoubleSide, alphaTest: 0.3 }), nx, 1.25, nz); const np = net.geometry.attributes.position; for (let i = 0; i < np.count; i++) np.setZ(i, Math.sin(np.getX(i) * 2.2) * 0.12 * (1 - (np.getY(i) + 0.95) / 1.9)); }
  // shoreline: wet sand and a line of foam; gentle ripples on the water
  const wet = mk(new THREE.PlaneGeometry(3.2, 160), new THREE.MeshBasicMaterial({ color: 0x6f5d44, transparent: true, opacity: 0.35, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }), SHORE - 1.4, 0.006, 0); wet.rotation.x = -Math.PI / 2;
  const foamT = cv(64, 256, (x) => { x.clearRect(0, 0, 64, 256); for (let y = 0; y < 256; y += 2) { const w = 14 + Math.sin(y * 0.11) * 8 + Math.sin(y * 0.37) * 5 + Math.random() * 6; const g = x.createLinearGradient(32 - w, 0, 32 + w, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.6, 'rgba(255,255,255,0.75)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(32 - w, y, w * 2, 2); } }); foamT.repeat.set(1, 6);
  const foam = mk(new THREE.PlaneGeometry(1.6, 160), new THREE.MeshBasicMaterial({ map: foamT, transparent: true, depthWrite: false }), SHORE + 0.2, -0.33, 0); foam.rotation.x = -Math.PI / 2;
  const sandEdge = mk(new THREE.PlaneGeometry(1.2, 160), new THREE.MeshStandardMaterial({ map: noiseTex([176, 152, 112], 30, 30), roughness: 1 }), SHORE + 0.45, -0.19, 0); sandEdge.rotation.set(-Math.PI / 2 + 0.0, 0, 0); sandEdge.rotation.y = 0.33;
  seaN = cv(128, 128, (x) => { const d = x.createImageData(128, 128), h = new Float32Array(128 * 128); for (let i = 0; i < h.length; i++) { const u = i % 128, v = i / 128 | 0; h[i] = Math.sin(u * 0.196 + Math.sin(v * 0.147) * 2) + Math.sin(v * 0.245 + Math.sin(u * 0.098) * 1.5) * 0.7 + Math.sin((u + v) * 0.393) * 0.3; }
    for (let v = 0; v < 128; v++) for (let u = 0; u < 128; u++) { const i = v * 128 + u, dx = h[v * 128 + (u + 1) % 128] - h[i], dy = h[((v + 1) % 128) * 128 + u] - h[i]; d.data[i * 4] = 128 + dx * 150; d.data[i * 4 + 1] = 128 + dy * 150; d.data[i * 4 + 2] = 255; d.data[i * 4 + 3] = 255; } x.putImageData(d, 0, 0); });
  const wg = new THREE.PlaneGeometry(300, 300, 60, 60); wg.rotateX(-Math.PI / 2); waves = mk(wg, seaMat, SHORE + 60, -0.35, 0); waves.userData.base = wg.attributes.position.array.slice();
  seaN.colorSpace = THREE.NoColorSpace; seaN.repeat.set(160, 160); seaMat.normalMap = seaN; seaMat.normalScale.set(0.55, 0.55); seaMat.needsUpdate = true;
}

/* ---------- inside The Turtle ---------- */
const IN = { x0: -205, x1: -195, z0: -3.5, z1: 3.5, h: 2.8 }; const finds = {}; let fire = null, fireLight = null, lamp = null, stew = null;
const flames = [];
function cv(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = maxAniso; return t; }
function grainNoise(x, w, h, amt) { const d = x.getImageData(0, 0, w, h); for (let i = 0; i < d.data.length; i += 4) { const n = (Math.random() - 0.5) * amt; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n * 0.8; } x.putImageData(d, 0, 0); }
function plankTex(rgb, planks, rx, ry) { const t = cv(256, 256, (x, w, h) => { const pw = w / planks;
    for (let p = 0; p < planks; p++) { const v = (Math.random() - 0.5) * 26; x.fillStyle = `rgb(${rgb[0] + v | 0},${rgb[1] + v | 0},${rgb[2] + v * 0.8 | 0})`; x.fillRect(p * pw, 0, pw, h);
      x.strokeStyle = 'rgba(30,18,10,0.25)'; x.lineWidth = 1; for (let g = 0; g < 9; g++) { const gx = p * pw + 3 + Math.random() * (pw - 6); x.beginPath(); x.moveTo(gx, 0); x.bezierCurveTo(gx + 3, h * 0.3, gx - 3, h * 0.6, gx + 1, h); x.stroke(); }
      x.fillStyle = 'rgba(15,9,5,0.75)'; x.fillRect(p * pw, 0, 2, h); if (Math.random() < 0.5) { x.fillStyle = 'rgba(25,14,8,0.6)'; x.beginPath(); x.ellipse(p * pw + pw / 2, Math.random() * h, 3, 5, 0, 0, 7); x.fill(); } }
    grainNoise(x, w, h, 18); }); t.repeat.set(rx || 1, ry || 1); return t; }
function buildTavern() {
  cur = indoor;
  const std = (map, r) => new THREE.MeshStandardMaterial({ map, roughness: r === undefined ? 0.9 : r });
  const oak = std(plankTex([104, 76, 50], 4, 1, 1)), oakDark = std(plankTex([62, 45, 31], 3, 1, 1)), board = std(plankTex([122, 92, 62], 5, 1, 1), 0.8);
  const ceilM = std(plankTex([74, 54, 38], 8, 3, 2)), beam = new THREE.MeshStandardMaterial({ color: 0x3a2a1d, roughness: 0.95 });
  const plasterT = cv(512, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#d9ceb4'); g.addColorStop(0.55, '#d2c6aa'); g.addColorStop(1, '#a7997c'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) { x.fillStyle = `rgba(${90 + Math.random() * 40 | 0},${74 + Math.random() * 30 | 0},50,${0.012 + Math.random() * 0.025})`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 20 + Math.random() * 70, 10 + Math.random() * 40, Math.random() * 3, 0, 7); x.fill(); }
    grainNoise(x, w, h, 14); }); plasterT.wrapT = THREE.ClampToEdgeWrapping;
  const plaster = new THREE.MeshStandardMaterial({ map: plasterT, roughness: 1 });
  const brickT = cv(256, 256, (x, w, h) => { x.fillStyle = '#9b917e'; x.fillRect(0, 0, w, h); for (let r = 0; r < 8; r++) for (let i = -1; i < 4; i++) { const v = Math.random(); x.fillStyle = `rgb(${150 + v * 36 | 0},${80 + v * 22 | 0},${54 + v * 14 | 0})`; x.fillRect(i * 64 + (r % 2) * 32 + 2, r * 32 + 2, 60, 28); }
    for (let i = 0; i < 14; i++) { x.fillStyle = `rgba(40,28,20,${0.06 + Math.random() * 0.1})`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 20 + Math.random() * 50, 14 + Math.random() * 30, 0, 0, 7); x.fill(); } grainNoise(x, w, h, 24); });
  const brick = std(brickT); const floorT = brickT.clone(); floorT.repeat.set(5, 3.5); floorT.needsUpdate = true;
  const hearthT = brickT.clone(); hearthT.repeat.set(1.2, 1.6); hearthT.needsUpdate = true; const hearthM = std(hearthT);
  const pewM = new THREE.MeshStandardMaterial({ color: 0xa2a4a3, roughness: 0.38, metalness: 0.85 }), brassM = new THREE.MeshStandardMaterial({ color: 0xb08a3a, roughness: 0.4, metalness: 0.8 }), ironM = new THREE.MeshStandardMaterial({ color: 0x1c1c1e, roughness: 0.6, metalness: 0.7 });
  const glassM = new THREE.MeshStandardMaterial({ color: 0x1f3a2a, roughness: 0.18, metalness: 0.15 }), clay = new THREE.MeshStandardMaterial({ color: 0xe9e4d8, roughness: 0.8 }), stoneware = new THREE.MeshStandardMaterial({ color: 0x8a6a44, roughness: 0.5 }), celadon = new THREE.MeshStandardMaterial({ color: 0x9aa890, roughness: 0.35 });
  const waxM = new THREE.MeshStandardMaterial({ color: 0xe8dcc0, roughness: 0.7 }), flameM = new THREE.MeshBasicMaterial({ color: 0xffc66a }), sackM = new THREE.MeshStandardMaterial({ map: noiseTex([150, 130, 96], 30, 3), roughness: 1 });
  const B = (w, h, d, m, x, y, z, p) => mk(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
  const cx = (IN.x0 + IN.x1) / 2, W = IN.x1 - IN.x0, D = IN.z1 - IN.z0, H = IN.h;

  // shell of the room: brick floor, limewashed walls with the oak frame showing, plank ceiling on joists
  mk(new THREE.PlaneGeometry(W, D), std(floorT), cx, 0, 0).rotation.x = -Math.PI / 2;
  mk(new THREE.PlaneGeometry(W, D), ceilM, cx, H, 0).rotation.x = Math.PI / 2;
  const wall = (w, x, z, ry, rep) => { const m = plaster.clone(); m.map = plasterT.clone(); m.map.repeat.set(rep, 1); m.map.needsUpdate = true; const p = mk(new THREE.PlaneGeometry(w, H), m, x, H / 2, z); p.rotation.y = ry; };
  wall(W, cx, IN.z0, 0, 3); wall(W, cx, IN.z1, Math.PI, 3); wall(D, IN.x0, 0, Math.PI / 2, 2); wall(D, IN.x1, 0, -Math.PI / 2, 2);
  for (let x = IN.x0 + 0.06; x <= IN.x1; x += (W - 0.12) / 8) { B(0.13, H, 0.07, beam, x, H / 2, IN.z0 + 0.035); }
  for (const x of [IN.x0 + 0.06, -204.0, -201.75, -198.8, -195.9, IN.x1 - 0.06]) B(0.13, H, 0.07, beam, x, H / 2, IN.z1 - 0.035);
  for (let z = IN.z0 + 0.06; z <= IN.z1; z += (D - 0.12) / 6) { B(0.07, H, 0.13, beam, IN.x0 + 0.035, H / 2, z); B(0.07, H, 0.13, beam, IN.x1 - 0.035, H / 2, z); }
  B(W, 0.14, 0.08, beam, cx, 0.07, IN.z0 + 0.04); B(W, 0.14, 0.08, beam, cx, 0.07, IN.z1 - 0.04); B(0.08, 0.14, D, beam, IN.x0 + 0.04, 0.07, 0); B(0.08, 0.14, D, beam, IN.x1 - 0.04, 0.07, 0);
  B(W, 0.16, 0.09, beam, cx, H - 0.08, IN.z0 + 0.045); B(W, 0.16, 0.09, beam, cx, H - 0.08, IN.z1 - 0.045);
  for (let x = IN.x0 + 0.5; x < IN.x1; x += 0.62) B(0.1, 0.15, D, beam, x, H - 0.075, 0);
  B(W, 0.26, 0.28, beam, cx, H - 0.28, 0.4);                                                       // the big summer beam

  // street wall: leaded windows with shutters folded back, and the door
  const leadT = cv(256, 160, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#f4f6ea'); g.addColorStop(1, '#cfdccf'); x.fillStyle = g; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(52,56,58,0.9)'; x.lineWidth = 2.2;
    for (let i = -h; i < w + h; i += 22) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + h * 0.62, h); x.stroke(); x.beginPath(); x.moveTo(i, 0); x.lineTo(i - h * 0.62, h); x.stroke(); } });
  const glow = new THREE.MeshBasicMaterial({ map: leadT }), pool = new THREE.MeshBasicMaterial({ map: leadT, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false });
  for (const x of [-200.3, -197.3]) { mk(new THREE.PlaneGeometry(1.9, 1.2), glow, x, 1.72, IN.z1 - 0.012).rotation.y = Math.PI;
    for (const dx of [-0.475, 0.475]) B(0.05, 1.2, 0.05, beam, x + dx / 1, 1.72, IN.z1 - 0.03); B(0.06, 1.2, 0.06, beam, x, 1.72, IN.z1 - 0.03);
    for (const y of [1.09, 2.35]) B(2.06, 0.08, 0.09, beam, x, y, IN.z1 - 0.04); for (const dx of [-0.99, 0.99]) B(0.08, 1.34, 0.09, beam, x + dx, 1.72, IN.z1 - 0.04);
    B(2.1, 0.05, 0.2, oak, x, 1.04, IN.z1 - 0.1);                                                    // sill
    const pl = mk(new THREE.PlaneGeometry(2.0, 2.3), pool, x - 0.3, 0.012, 1.7); pl.rotation.x = -Math.PI / 2; }
  B(1.15, 2.2, 0.06, oak, -203, 1.1, IN.z1 - 0.05); for (const y of [0.45, 1.75]) B(0.9, 0.06, 0.02, ironM, -203.05, y, IN.z1 - 0.09); B(0.05, 0.14, 0.04, ironM, -202.55, 1.1, IN.z1 - 0.1);
  for (const dx of [-0.63, 0.63]) B(0.1, 2.3, 0.1, beam, -203 + dx, 1.15, IN.z1 - 0.05); B(1.36, 0.12, 0.1, beam, -203, 2.3, IN.z1 - 0.05);

  // the bar: a panelled counter, and behind it a dresser of bottles, jugs and plates
  B(5.4, 0.95, 0.65, oak, -200.9, 0.475, -2.2); B(5.6, 0.07, 0.8, board, -200.9, 0.985, -2.2);
  for (let x = -203.4; x < -198.3; x += 0.9) B(0.07, 0.8, 0.02, oakDark, x, 0.5, -1.866); B(5.4, 0.08, 0.02, oakDark, -200.9, 0.86, -1.866); B(5.4, 0.1, 0.03, oakDark, -200.9, 0.05, -1.86);
  for (const y of [1.2, 1.7, 2.2]) B(4.6, 0.045, 0.3, oakDark, -201.2, y, IN.z0 + 0.2); for (const x of [-203.5, -201.2, -198.9]) B(0.05, 1.5, 0.3, oakDark, x, 1.65, IN.z0 + 0.2);
  const prof = [[0, 0], [0.085, 0], [0.105, 0.04], [0.1, 0.09], [0.06, 0.13], [0.022, 0.17], [0.02, 0.24], [0.028, 0.245], [0, 0.245]].map(([a, b]) => new THREE.Vector2(a, b));
  const bottleG = new THREE.LatheGeometry(prof, 14);
  const jugG = new THREE.LatheGeometry([[0, 0], [0.07, 0], [0.1, 0.08], [0.095, 0.17], [0.05, 0.23], [0.045, 0.29], [0.055, 0.3], [0, 0.3]].map(([a, b]) => new THREE.Vector2(a, b)), 14);
  const jarG = new THREE.LatheGeometry([[0, 0], [0.06, 0], [0.11, 0.1], [0.115, 0.17], [0.07, 0.24], [0.075, 0.26], [0, 0.26]].map(([a, b]) => new THREE.Vector2(a, b)), 16);
  const delftT = cv(128, 128, (x) => { x.fillStyle = '#1b3f8a'; x.fillRect(0, 0, 128, 128); x.fillStyle = '#eef0ea'; x.beginPath(); x.arc(64, 64, 62, 0, 7); x.fill(); x.strokeStyle = '#2a4f9c'; x.lineWidth = 3; for (const r of [56, 40]) { x.beginPath(); x.arc(64, 64, r, 0, 7); x.stroke(); }
    x.lineWidth = 2; for (let a = 0; a < 6.28; a += 0.52) { x.beginPath(); x.moveTo(64 + Math.cos(a) * 42, 64 + Math.sin(a) * 42); x.quadraticCurveTo(64 + Math.cos(a + 0.2) * 50, 64 + Math.sin(a + 0.2) * 50, 64 + Math.cos(a + 0.26) * 55, 64 + Math.sin(a + 0.26) * 55); x.stroke(); }
    for (let a = 0; a < 6.28; a += 1.05) { x.beginPath(); x.ellipse(64 + Math.cos(a) * 18, 64 + Math.sin(a) * 18, 9, 4, a, 0, 7); x.stroke(); } });
  const delftM = [new THREE.MeshStandardMaterial({ color: 0xe8e8e0, roughness: 0.3 }), new THREE.MeshStandardMaterial({ map: delftT, roughness: 0.25 }), new THREE.MeshStandardMaterial({ color: 0xe8e8e0, roughness: 0.3 })];
  const plateG = new THREE.CylinderGeometry(0.125, 0.11, 0.014, 22), tankG = new THREE.CylinderGeometry(0.04, 0.048, 0.12, 12), handleG = new THREE.TorusGeometry(0.03, 0.007, 6, 10, Math.PI);
  const tankard = (x, y, z, r) => { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = r || 0; cur.add(g); mk(tankG, pewM, 0, 0.06, 0, g); const hd = mk(handleG, pewM, 0.045, 0.06, 0, g); hd.rotation.z = -Math.PI / 2; };
  const zs = IN.z0 + 0.2;
  for (let i = 0; i < 5; i++) mk(bottleG, glassM, -203.2 + i * 0.4, 1.2225, zs);
  for (let i = 0; i < 4; i++) { const p = mk(plateG, delftM, -200.8 + i * 0.42, 1.345, zs - 0.06); p.rotation.x = Math.PI / 2 - 0.22; }
  for (let i = 0; i < 4; i++) mk(jugG, stoneware, -203.1 + i * 0.5, 1.7225, zs); mk(jarG, celadon, -200.6, 1.7225, zs); for (let i = 0; i < 5; i++) tankard(-200.05 + i * 0.22, 1.7225, zs, 0.5 * i);
  for (let i = 0; i < 6; i++) mk(bottleG, glassM, -203.2 + i * 0.36, 2.2225, zs); for (let i = 0; i < 3; i++) { const p = mk(plateG, pewM, -200.6 + i * 0.5, 2.345, zs - 0.06); p.rotation.x = Math.PI / 2 - 0.22; }
  // tally slate and a turtle shell, the sign of the house
  mk(new THREE.PlaneGeometry(0.6, 0.45), new THREE.MeshStandardMaterial({ map: cv(128, 96, (x) => { x.fillStyle = '#23262a'; x.fillRect(0, 0, 128, 96); x.strokeStyle = '#d8d8d0'; x.lineWidth = 2; for (let r = 0; r < 3; r++) for (let i = 0; i < 4 + r * 2; i++) { x.beginPath(); x.moveTo(12 + i * 9, 14 + r * 26); x.lineTo(14 + i * 9, 30 + r * 26); x.stroke(); } x.strokeStyle = '#6b4a2c'; x.lineWidth = 6; x.strokeRect(0, 0, 128, 96); }), roughness: 0.9 }), -198.3, 1.7, IN.z0 + 0.012);
  const shellT = cv(128, 128, (x) => { x.fillStyle = '#6a4a24'; x.fillRect(0, 0, 128, 128); x.strokeStyle = '#2c1c0c'; x.lineWidth = 3; for (let r = 0; r < 4; r++) for (let i = 0; i < 4; i++) { const px = i * 34 + (r % 2) * 17 - 6, py = r * 34; x.fillStyle = `rgb(${120 + Math.random() * 40 | 0},${84 + Math.random() * 24 | 0},40)`; x.beginPath(); for (let a = 0; a < 6; a++) x.lineTo(px + 17 + Math.cos(a * 1.047) * 19, py + 17 + Math.sin(a * 1.047) * 19); x.closePath(); x.fill(); x.stroke(); } });
  const shell = mk(new THREE.SphereGeometry(0.42, 18, 10, 0, 6.3, 0, 1.2), std(shellT, 0.45), IN.x1 - 0.62, 2.1, -0.6); shell.scale.set(0.8, 0.5, 1.05); shell.rotation.z = Math.PI / 2;

  // casks on a stillage, with hoops and taps
  const caskG = new THREE.LatheGeometry([[0, -0.52], [0.34, -0.52], [0.4, -0.3], [0.44, 0], [0.4, 0.3], [0.34, 0.52], [0, 0.52]].map(([a, b]) => new THREE.Vector2(a, b)), 18);
  const caskM = std(plankTex([118, 86, 52], 10, 2, 1), 0.8);
  const cask = (x, y, z) => { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.z = Math.PI / 2; cur.add(g); mk(caskG, caskM, 0, 0, 0, g);
    for (const [hy, r] of [[-0.45, 0.362], [-0.24, 0.416], [0.24, 0.416], [0.45, 0.362]]) mk(new THREE.CylinderGeometry(r, r, 0.04, 18, 1, true), ironM, 0, hy, 0, g);
    const tap = B(0.14, 0.03, 0.03, brassM, x + 0.58, y - 0.26, z); B(0.03, 0.07, 0.03, brassM, x + 0.62, y - 0.22, z); return tap; };
  for (const z of [-2.85, -1.9]) { cask(-204.35, 0.8, z); B(0.9, 0.08, 0.1, oakDark, -204.35, 0.32, z - 0.25); B(0.9, 0.08, 0.1, oakDark, -204.35, 0.32, z + 0.25); for (const dx of [-0.38, 0.38]) B(0.1, 0.3, 0.7, oakDark, -204.35 + dx, 0.15, z); }

  // trestle tables, benches, stools and a high-backed settle
  const table = (x, z, w, d) => { B(w, 0.05, d, board, x, 0.745, z); for (const sx of [-1, 1]) { const tx = x + sx * (w / 2 - 0.28); for (const sz of [-1, 1]) { const l = B(0.07, 0.76, 0.07, oakDark, tx, 0.36, z + sz * 0.17); l.rotation.x = -sz * 0.3; } B(0.07, 0.07, d * 0.7, oakDark, tx, 0.69, z); } B(w - 0.5, 0.06, 0.05, oakDark, x, 0.3, z); };
  const bench = (x, z, w) => { B(w, 0.05, 0.28, board, x, 0.45, z); for (const sx of [-1, 1]) { B(0.05, 0.45, 0.26, oakDark, x + sx * (w / 2 - 0.16), 0.225, z); } B(w - 0.3, 0.07, 0.04, oakDark, x, 0.3, z); };
  const stool = (x, z, r) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = r; cur.add(g); B(0.34, 0.04, 0.26, board, 0, 0.47, 0, g); for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const l = B(0.04, 0.47, 0.04, oakDark, sx * 0.13, 0.235, sz * 0.09, g); l.rotation.z = -sx * 0.1; } B(0.26, 0.05, 0.03, oakDark, 0, 0.36, 0.09, g); B(0.26, 0.05, 0.03, oakDark, 0, 0.36, -0.09, g); };
  table(-198.2, 1.3, 1.9, 0.8); bench(-198.2, 0.58, 1.7); bench(-198.2, 2.02, 1.7);
  table(-201.6, 1.0, 1.9, 0.8); bench(-201.6, 0.28, 1.7); bench(-201.6, 1.72, 1.7);
  B(0.7, 0.04, 0.7, board, -195.9, 0.75, 2.3); for (const sx of [-1, 1]) for (const sz of [-1, 1]) B(0.05, 0.74, 0.05, oakDark, -195.9 + sx * 0.28, 0.37, 2.3 + sz * 0.28);
  stool(-202.6, -1.25, 0.3); stool(-200.2, -1.3, -0.2); stool(-196.9, -1.7, 0.9);
  B(0.4, 0.05, 1.7, board, -204.72, 0.45, 2.0); B(0.05, 1.5, 1.7, oak, -204.9, 0.75, 2.0); for (const dz of [-0.85, 0.85]) B(0.42, 1.05, 0.05, oak, -204.72, 0.525, 2.0 + dz); B(0.38, 0.4, 1.66, oakDark, -204.72, 0.2, 2.0);

  // the cooking hearth: brick breast, oak lintel, iron crane and pot, firewood
  for (const dz of [-1.0, 1.0]) B(0.6, 1.45, 0.4, hearthM, IN.x1 - 0.3, 0.725, -0.6 + dz * 0.9); B(0.6, 1.25, 2.2, hearthM, IN.x1 - 0.3, 2.175, -0.6);
  B(0.12, 1.45, 1.4, new THREE.MeshBasicMaterial({ color: 0x0e0907 }), IN.x1 - 0.07, 0.725, -0.6); B(0.62, 0.2, 2.3, beam, IN.x1 - 0.3, 1.5, -0.6); B(0.75, 0.05, 2.4, oak, IN.x1 - 0.36, 1.62, -0.6);
  B(0.7, 0.06, 1.5, hearthM, IN.x1 - 0.42, 0.03, -0.6);
  B(0.03, 1.1, 0.03, ironM, IN.x1 - 0.2, 0.75, -1.2); B(0.03, 0.03, 0.7, ironM, IN.x1 - 0.2, 1.2, -0.87); B(0.015, 0.4, 0.015, ironM, IN.x1 - 0.2, 1.0, -0.6);
  const pot = mk(new THREE.SphereGeometry(0.22, 14, 10), ironM, IN.x1 - 0.2, 0.72, -0.6); pot.scale.y = 0.8;
  fire = mk(new THREE.ConeGeometry(0.22, 0.5, 7), new THREE.MeshBasicMaterial({ color: 0xff9a2e }), IN.x1 - 0.22, 0.3, -0.6); const f2 = mk(new THREE.ConeGeometry(0.13, 0.32, 6), flameM, IN.x1 - 0.26, 0.22, -0.42); flames.push(f2);
  for (const [dz, r] of [[-0.2, 0.3], [0.15, -0.4], [0, 1.2]]) { const lg = mk(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 7), oakDark, IN.x1 - 0.25, 0.09, -0.6 + dz); lg.rotation.set(Math.PI / 2, 0, r); }
  for (let i = 0; i < 7; i++) { const lg = mk(new THREE.CylinderGeometry(0.055, 0.055, 0.55, 7), oak, IN.x1 - 0.45, 0.06 + (i > 3 ? 0.11 : 0), 0.95 + (i % 4) * 0.12 + (i > 3 ? 0.06 : 0)); lg.rotation.z = Math.PI / 2; }
  for (let i = 0; i < 3; i++) { const p = mk(plateG, pewM, IN.x1 - 0.5, 1.77, -1.2 + i * 0.32); p.rotation.set(0, 0, Math.PI / 2 - 0.22); } mk(jarG, celadon, IN.x1 - 0.42, 1.645, 0.1);
  fireLight = new THREE.PointLight(0xff9d4a, 0, 8, 1.7); fireLight.position.set(IN.x1 - 0.9, 0.8, -0.6); cur.add(fireLight);

  // candles and a hanging lantern
  const candle = (x, y, z) => { mk(new THREE.CylinderGeometry(0.075, 0.06, 0.015, 14), brassM, x, y + 0.008, z); mk(new THREE.CylinderGeometry(0.02, 0.024, 0.05, 8), brassM, x, y + 0.04, z); B(0.1, 0.008, 0.025, brassM, x + 0.1, y + 0.012, z);
    mk(new THREE.CylinderGeometry(0.011, 0.011, 0.12, 6), waxM, x, y + 0.12, z); const f = mk(new THREE.SphereGeometry(0.016, 6, 6), flameM, x, y + 0.2, z); f.scale.y = 1.9; flames.push(f); };
  candle(-198.75, 0.77, 1.3); candle(-201.0, 0.77, 1.05); candle(-202.9, 1.02, -2.2); candle(IN.x1 - 0.4, 1.645, -1.5);
  { const lx = -200.2, lz = 0.4, ly = H - 0.95; B(0.012, 0.5, 0.012, ironM, lx, ly + 0.42, lz); B(0.18, 0.02, 0.18, ironM, lx, ly + 0.17, lz); B(0.18, 0.02, 0.18, ironM, lx, ly - 0.13, lz); for (const sx of [-1, 1]) for (const sz of [-1, 1]) B(0.015, 0.3, 0.015, ironM, lx + sx * 0.08, ly + 0.02, lz + sz * 0.08);
    B(0.14, 0.26, 0.14, new THREE.MeshBasicMaterial({ color: 0xffd58a, transparent: true, opacity: 0.55 }), lx, ly + 0.02, lz); lamp = new THREE.PointLight(0xffd9a0, 0, 9, 1.6); lamp.position.set(lx, ly, lz); cur.add(lamp); }

  // tavern clutter: tankards, a jug, coins, sacks, a rope coil, a broom
  tankard(-198.7, 0.77, 1.08, 1); tankard(-197.75, 0.77, 1.5, 3); tankard(-202.15, 0.77, 0.85, 2); tankard(-201.3, 0.77, 1.2, 4.5); tankard(-201.9, 1.02, -2.3, 0.6);
  mk(jugG, stoneware, -202.3, 1.02, -2.05); mk(jugG, stoneware, -197.6, 0.77, 1.12);
  for (const [dx, dz] of [[0, 0], [0.05, 0.03], [-0.03, 0.05], [0.09, -0.02]]) mk(new THREE.CylinderGeometry(0.018, 0.018, 0.004, 10), pewM, -200.0 + dx, 1.022, -2.0 + dz);
  for (const [x, z, s] of [[-195.6, -2.9, 1], [-196.1, -3.0, 0.85], [-195.7, -2.4, 0.9]]) { const sk = mk(new THREE.SphereGeometry(0.3, 10, 8), sackM, x, 0.24 * s, z); sk.scale.set(s, 0.85 * s, s * 0.9); }
  const rope = mk(new THREE.TorusGeometry(0.2, 0.04, 6, 16), sackM, -204.4, 0.05, -0.7); rope.rotation.x = Math.PI / 2;
  const br = B(0.03, 1.4, 0.03, oak, -204.8, 0.72, 0.6); br.rotation.z = -0.12; B(0.1, 0.25, 0.18, sackM, -204.7, 0.13, 0.6);

  // the four things to find
  const g = {}; for (const f of FINDS) { g[f.id] = new THREE.Group(); g[f.id].position.set(f.x, f.y, f.z); cur.add(g[f.id]); }
  mk(bottleG, glassM, 0, 0, 0, g.bottle).scale.setScalar(1.25); mk(bottleG, glassM, 0.26, 0, 0.05, g.bottle);
  for (let i = 0; i < 6; i++) mk(plateG, pewM, 0, 0.009 + i * 0.016, 0, g.pewter);
  for (const [dz, r] of [[-0.06, 0.2], [0.05, -0.15], [0.14, 0.05]]) { const pg = new THREE.Group(); pg.position.set(0, 0.012, dz); pg.rotation.y = r; g.pipes.add(pg);
    const st = mk(new THREE.CylinderGeometry(0.006, 0.008, 0.34, 6), clay, 0, 0, 0, pg); st.rotation.z = Math.PI / 2; mk(new THREE.CylinderGeometry(0.016, 0.012, 0.045, 8), clay, 0.175, 0.015, 0, pg); }
  { const t = cv(64, 64, (x) => { x.fillStyle = '#c8873a'; x.fillRect(0, 0, 64, 64); x.fillStyle = '#4a2412'; for (let i = 0; i < 46; i++) { x.beginPath(); x.ellipse(Math.random() * 64, Math.random() * 64, 3 + Math.random() * 7, 2 + Math.random() * 5, Math.random() * 3, 0, 7); x.fill(); } });
    const sm = new THREE.MeshStandardMaterial({ map: t, roughness: 0.3 }), iv = new THREE.MeshStandardMaterial({ color: 0xe8dcc0, roughness: 0.5 });
    B(0.2, 0.11, 0.14, sm, 0, 0.065, 0, g.turtle); B(0.21, 0.012, 0.15, iv, 0, 0.126, 0, g.turtle); B(0.19, 0.05, 0.13, sm, 0, 0.157, 0, g.turtle); B(0.22, 0.012, 0.16, sm, 0, 0.006, 0, g.turtle); B(0.02, 0.03, 0.004, iv, 0, 0.07, 0.072, g.turtle); }
  for (const f of FINDS) { const r = new THREE.Mesh(new THREE.RingGeometry(0.27, 0.3, 32), new THREE.MeshBasicMaterial({ color: 0xd9a441, side: THREE.DoubleSide })); r.rotation.x = -Math.PI / 2; r.position.y = 0.004; g[f.id].add(r); finds[f.id] = r; }
  stew = new THREE.Group(); stew.position.set(-200.4, 1.02, -2.05); stew.visible = false; cur.add(stew);
  mk(new THREE.CylinderGeometry(0.11, 0.06, 0.07, 16), pewM, 0, 0.035, 0, stew); mk(new THREE.CylinderGeometry(0.1, 0.1, 0.01, 16), new THREE.MeshStandardMaterial({ color: 0x7a4a22, roughness: 0.6 }), 0, 0.066, 0, stew); B(0.012, 0.01, 0.16, pewM, 0.16, 0.006, 0.02, stew);
  cur = scene;
}
function setPlace(p) {
  state.place = p; const inside = p !== 'out', home = p === 'in' ? indoor : p === 'ware' ? wareG : scene;
  for (const c of scene.children) { if (c.isLight) continue; if (c === indoor) c.visible = p === 'in'; else if (c === wareG) c.visible = p === 'ware'; else if (c === afterG || c === yardG) c.visible = false; else c.visible = !inside || (p === 'ware' && c.userData.far === true); }
  home.add(abba); abba.visible = p !== 'ware'; if (galdy) home.add(galdy);
  hemi.intensity = inside ? 0.5 : 2.3; sun.intensity = inside ? 1.5 : 2.6; if (p === 'in') sun.position.set(0.3, 0.75, 1); else if (p === 'ware') sun.position.set(1, 0.7, 0.2); else sun.position.set(-0.35, 1, 0.75);
  fireLight.intensity = p === 'in' ? 16 : 0; lamp.intensity = p === 'in' ? 9 : 0; if (wLamp) wLamp.intensity = p === 'ware' ? 14 : 0;
  if (p === 'in') { ABBA.x = -201; ABBA.z = -2.95; abba.position.set(ABBA.x, 0, ABBA.z); } else if (p === 'ware') { ABBA.x = 9999; ABBA.z = 0; } else { ABBA.x = -4.15; ABBA.z = -S + 1.45; abba.position.set(ABBA.x, 0.12, ABBA.z); }
  abba.rotation.y = 0; if (ring) ring.visible = !inside && !state.talked;
}

/* ---------- models ---------- */
const WID = { h1: 6.0, h2: 5.0, h3: 7.2, h4: 6.6, h5: 5.4, h6: 5.6 };
const NORTH = ['h2', 'h6', 'h1', 'h4', 'h5', 'h3'], SOUTH = ['h3', 'h1', 'h5', 'h2', 'h4', 'h6'];
let townReady = false;
const models = {}; let abba = null; const ABBA = { x: -4.15, z: -S + 1.45 }   /* beside the tavern door, not in it */;
const maxAniso = renderer.capabilities.getMaxAnisotropy();
const TEXMAP = { Brick: ['brick', 'brick_n'], Shingle: ['shingle', 'shingle_n'], ClayTile: ['clay', 'clay_n'], Wood: ['wood', 'wood_n'], Stone: ['stone', 'stone_n'], Plaster: ['plaster', 'plaster_n'], LeadedGlass: ['glass', 'glass_n'],
  Hull: ['hull', 'hull_n'], Spar: ['hull', 'hull_n'], Tar: ['hull', 'hull_n'], Ochre: ['hull', 'hull_n'], Red: ['hull', 'hull_n'], Deck: ['deck', 'deck_n'], Sail: ['canvas'], Glass: ['glass'], Flag: ['ensign'] };
const texCache = {}, matCache = {}, texLoader = new THREE.TextureLoader();
const imgs = {};
async function decodeTex() { await Promise.all(Object.keys(window.__tex || {}).filter((k) => !imgs[k]).map((k) => new Promise((res) => { const im = new Image(); im.onload = () => { imgs[k] = im; res(); }; im.onerror = () => res(); im.src = window.__tex[k]; }))); }
function sharedTex(key, color) { if (!texCache[key] && imgs[key]) { const t = new THREE.Texture(imgs[key]); t.needsUpdate = true; t.flipY = false; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.anisotropy = maxAniso; texCache[key] = t; } return texCache[key] || null; }
function prep(root) { root.traverse((o) => { if (o.isMesh && TEXMAP[o.material.name]) { const n = o.material.name; if (!matCache[n]) { const m = o.material, [c, nm] = TEXMAP[n]; m.map = sharedTex(c, true); m.color.set(0xffffff); if (nm) m.normalMap = sharedTex(nm, false); m.needsUpdate = true; matCache[n] = m; } o.material = matCache[n]; } }); return prep0(root); }
function prep0(root) { root.traverse((o) => { if (o.isMesh) { const m = o.material; if (m.map) m.map.anisotropy = maxAniso; if (m.name === 'LeadedGlass') { m.emissive = new THREE.Color(0x4a6470); m.emissiveMap = m.map; m.roughness = 0.2; } if (o.isSkinnedMesh) o.frustumCulled = false; } }); return root; }
let mixer = null, idle = null, runA = null; const survivors = {}; let galdy = null, third = false, gWalk = false; const people = {};
const MENU = { ok: false, url: '../../../menu/' }; { const links = ['allgames', 'jhome'].map((id) => document.getElementById(id)).filter(Boolean); for (const a of links) a.hidden = true; fetch(MENU.url, { cache: 'no-store' }).then((r) => (r.ok ? r.text() : '')).then((t) => { if (/History Games/.test(t)) { MENU.ok = true; for (const a of links) a.hidden = false; } }).catch(() => {}); }   /* only when the real game menu is there */   /* the 'All games' link shows only where the game menu exists (the website, not the artifact copy) */
const TICKS = [], EXTRA_IN = [];   /* Mixamo clips from anims.glb, shared by everyone (same skeleton) */
const TALKS = ['Talk1', 'Talk2', 'Talk3']; let talkN = 0, speaker = null;
function speakerModel(who) { if (who === 'Abba') return abba; if (who === 'Kofi') return state.place === 'after' ? survivors.kofi : people.kofi; if (who === 'Emmanuel Heath') return people.heath;
  if (who === 'Sam') return state.place === 'after' ? survivors.sailor : people.sailor; if (who === 'Symon Benning') return state.place === 'after' ? survivors.benning : people.benning; return null; }
function setSpeaker(who, gesture) { const m = speakerModel(who); if (gesture && m && m.userData.anim && CL[gesture]) { if (speaker && speaker !== m && speaker.userData.anim) speaker.userData.anim.rest(); speaker = m; m.userData.anim.play(gesture, true); return; } if (speaker && speaker !== m && speaker.userData.anim) speaker.userData.anim.rest(); speaker = m; if (m && m.userData.anim && CL.Talk1) m.userData.anim.play(m.userData.sits && CL.SitTalk ? 'SitTalk' : TALKS[talkN++ % 3]); }
function endTalk(wave) { if (speaker && speaker.userData.anim) { if (wave && CL.Wave) speaker.userData.anim.play('Wave', true); else speaker.userData.anim.rest(); } speaker = null; }
const KP = { leg: 0, wait: 1.5, box: null };
function kofiTick(dt) { const n = NPCS[0], m = people.kofi, ac = m.userData.anim; if (!ac) return; if (!KP.go) { KP.go = true; ac.play('CarryIdle'); } if (KP.i === undefined) { KP.i = 0; KP.dir = 1; } const to = n.route[KP.i];   /* straight legs: off the sand, then down the middle of the pier */
  if (!KP.box) { KP.box = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.32, 0.34), new THREE.MeshStandardMaterial({ map: plankTex([150, 118, 80], 3, 1, 2), roughness: 0.9 })); scene.add(KP.box); KP.hl = m.getObjectByName('mixamorigLeftHand'); KP.hr = m.getObjectByName('mixamorigRightHand'); }
  if (speaker === m && KP.leg === 0 && !KP.down) { KP.down = [n.x + Math.sin(m.rotation.y) * 0.55, n.z + Math.cos(m.rotation.y) * 0.55, m.rotation.y]; }
  if (KP.down && n.walking) KP.down = null;
  if (KP.down) { KP.box.position.set(KP.down[0], groundYAt(KP.down[0], KP.down[1]) + 0.16, KP.down[1]); KP.box.rotation.y = KP.down[2]; KP.box.visible = m.visible; } else if (KP.hl && KP.hr) { const p1 = KP.hl.getWorldPosition(_dp), p2 = KP.hr.getWorldPosition(_ds); KP.box.position.copy(p1).add(p2).multiplyScalar(0.5); KP.box.position.y -= 0.02; KP.box.position.x += Math.sin(m.rotation.y) * 0.24; KP.box.position.z += Math.cos(m.rotation.y) * 0.24; KP.box.rotation.y = m.rotation.y;   /* held out in front, not inside him */ } if (KP.lift > 0) { KP.lift -= dt; } if (!KP.down) KP.box.visible = m.visible && KP.leg === 0 && !(KP.lift > 0);
  const near = Math.hypot(state.x - n.x, state.z - n.z) < 3.2 || speaker === m;
  if (near || KP.wait > 0) { if (n.walking) { n.walking = false; ac.play(KP.leg === 0 ? 'CarryIdle' : null); } if (!near) { KP.wait -= dt; } if (KP.wait <= 0 && !near) { n.walking = true; ac.play(KP.leg === 0 ? 'Carry' : 'Walk'); } return; }
  if (!n.walking) { n.walking = true; ac.play(KP.leg === 0 ? 'Carry' : 'Walk'); }
  const dx = to[0] - n.x, dz = to[1] - n.z, d = Math.hypot(dx, dz), sp = 1.25 * dt;
  const want = Math.atan2(dx, dz); let e = want - m.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); m.rotation.y += e * Math.min(1, dt * 5); n.ry = m.rotation.y;
  if (d <= sp) { n.x = to[0]; n.z = to[1]; const last = n.route.length - 1; if ((KP.dir > 0 && KP.i === last) || (KP.dir < 0 && KP.i === 0)) { KP.leg = 1 - KP.leg; KP.dir = -KP.dir; n.walking = false; if (KP.leg === 1 && KP.box) { KP.stack = KP.stack || []; const c = KP.box.clone(); const i = (KP.dropN = (KP.dropN || 0) + 1) % 5; if (KP.stack[i]) scene.remove(KP.stack[i]); c.position.set(31.7 + (i % 2) * 0.5, 0.06 + 0.16 + Math.floor(i / 2) * 0.33 * (i < 4 ? 1 : 0), -0.75 + (i % 3) * 0.04); c.rotation.y = i * 0.2; c.visible = true; scene.add(c); KP.stack[i] = c; }
      if (KP.leg === 0 && CL.PickUp) { KP.wait = 3.2; KP.box.visible = false; KP.lift = 2.4; ac.play('PickUp', true); } else { KP.wait = 1.6; ac.play(KP.leg === 0 ? 'CarryIdle' : null); } } KP.i += KP.dir; }
  else { n.x += dx / d * sp; n.z += dz / d * sp; }
  m.position.set(n.x, n.x > SHORE - 2.5 && Math.abs(n.z) < 1.75 ? 0.06 : 0, n.z); }
function npcShow(v) { for (const n of NPCS) if (people[n.id]) people[n.id].visible = v; }


function signTexture() {
  const c = document.createElement('canvas'); c.width = 264; c.height = 200; const x = c.getContext('2d');
  x.fillStyle = '#5d4a36'; x.fillRect(0, 0, 264, 200); x.strokeStyle = '#d9a441'; x.lineWidth = 6; x.strokeRect(8, 8, 248, 184);
  x.fillStyle = '#3f7a5c'; x.beginPath(); x.ellipse(132, 86, 62, 40, 0, 0, 7); x.fill();                       // turtle shell
  x.beginPath(); x.ellipse(206, 80, 18, 13, 0, 0, 7); x.fill();
  for (const [a, b] of [[88, 50], [176, 50], [88, 122], [176, 122]]) { x.beginPath(); x.ellipse(a, b, 20, 10, (a < 132 ? -1 : 1) * (b < 86 ? 0.6 : -0.6), 0, 7); x.fill(); }
  x.strokeStyle = '#2a563f'; x.lineWidth = 3; x.beginPath(); x.moveTo(132, 48); x.lineTo(132, 124); x.moveTo(74, 86); x.lineTo(190, 86); x.stroke();
  x.fillStyle = '#f1ead9'; x.font = '600 30px Georgia, serif'; x.textAlign = 'center'; x.fillText('THE TURTLE', 132, 174);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
let ring = null; const townObjs = [];
function buildTown() {
  const place = (k, x, z, ry) => { const m = models[k].clone(true); m.position.set(x, 0, z); m.rotation.y = ry; scene.add(m); const e = Math.max(0, Math.min(1, (x - X0) / (X1 - X0))), r = (Math.sin(x * 12.9 + z * 78.2) * 43758.5) % 1, rr = Math.abs(r);
    townObjs.push({ m, ry, sink: x < X0 ? 1.2 + rr * 1.5 : (rr > 0.72 ? 13 : 2.2 + e * 4.5 + rr * 2.5), tx: (rr - 0.5) * 0.3, tz: (((rr * 7) % 1) - 0.5) * 0.24, delay: (1 - e) * 4.5 + rr * 2, dur: 4.5 + rr * 3 }); return m; };
  let x = X0; for (const k of NORTH) { const m = place(k, x + WID[k] / 2, -S - 4, 0);
    if (k === 'h1') { const mat = new THREE.MeshBasicMaterial({ map: signTexture() }); for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.52), mat); p.position.set(s * 0.028, 3.94, 4.67); p.rotation.y = s * Math.PI / 2; m.add(p); } }
    x += WID[k]; }
  x = X0; for (const k of SOUTH) { place(k, x + WID[k] / 2, S + 4, Math.PI); x += WID[k]; }
  place('h4', X0 - 5.9, -3.4, Math.PI / 2); place('h2', X0 - 5.9, 2.4, Math.PI / 2);      // houses closing the far end of the street
  place('h6', X0 - 5.9, 8.0, Math.PI / 2); place('h3', X0 - 5.9, -10.5, Math.PI / 2);
  abba.position.set(ABBA.x, 0.12, ABBA.z); scene.add(abba);
  ring = new THREE.Mesh(new THREE.RingGeometry(0.75, 0.9, 40), new THREE.MeshBasicMaterial({ color: 0xd9a441, transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2; ring.position.set(ABBA.x, 0.14, ABBA.z + 0.2); scene.add(ring);
}

/* ---------- movement ---------- */
let holdToast = false; const keys = new Set(); const stick = { id: null, ox: 0, oy: 0, x: 0, y: 0 }; const look = { id: null, lx: 0, ly: 0 };
let busy = false;                     // true while a panel is open
addEventListener('keydown', (e) => { const k = e.key.toLowerCase();
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k) && state.started) e.preventDefault();
  keys.add(k);
  if (!state.started) return;
  if (k === 'escape') { if (!$('dialogue').hidden) { leaveTalk(); return; } closeJournal(); closeChapters(); }
  if ($('dialogue').hidden === false && (k === 'enter' || k === ' ')) { const b = $('next'); if (!b.hidden) b.click(); }
  else if ((k === 'e' || k === 'enter') && !$('talk').hidden) $('talk').click();
  else if (k === 'j') { $('journal').hidden ? openJournal() : closeJournal(); } });
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
addEventListener('blur', () => keys.clear());
canvas.addEventListener('pointerdown', (e) => { if (!state.started || busy) return; canvas.setPointerCapture(e.pointerId);
  if (e.pointerType === 'touch' && e.clientX < innerWidth * 0.42 && stick.id === null) { stick.id = e.pointerId; stick.ox = e.clientX; stick.oy = e.clientY; stick.x = stick.y = 0; const s = $('stick'); s.hidden = false; s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px'; $('nub').style.transform = 'translate(-50%,-50%)'; }
  else if (look.id === null) { look.id = e.pointerId; look.lx = e.clientX; look.ly = e.clientY; } });
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerId === stick.id) { let dx = e.clientX - stick.ox, dy = e.clientY - stick.oy; const l = Math.hypot(dx, dy), m = 48; if (l > m) { dx *= m / l; dy *= m / l; } stick.x = dx / m; stick.y = dy / m; $('nub').style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`; }
  else if (e.pointerId === look.id) { const k = e.pointerType === 'touch' ? 0.0052 : 0.0034; state.yaw -= (e.clientX - look.lx) * k; state.pitch = Math.max(-0.9, Math.min(0.9, state.pitch - (e.clientY - look.ly) * k)); look.lx = e.clientX; look.ly = e.clientY; } });
const up = (e) => { if (e.pointerId === stick.id) { stick.id = null; stick.x = stick.y = 0; $('stick').hidden = true; $('nub').style.transform = 'translate(-50%,-50%)'; } if (e.pointerId === look.id) look.id = null; };
canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);

let propC = null;
function buildPropC() { propC = []; const b = new THREE.Box3(); for (const p of streetProps) { const vis = p.visible; p.visible = true; b.setFromObject(p); p.visible = vis; if (b.isEmpty()) continue; const w = b.max.x - b.min.x, d = b.max.z - b.min.z, h = b.max.y - b.min.y; if (b.min.y > 1.2 || h < 0.25 || w > 4 || d > 4 || w * d < 0.05) continue; propC.push([b.min.x, b.min.z, b.max.x, b.max.z, p]); } }   /* built once with every prop, hidden or not; a hidden one is skipped when you move */
function camBounds(x, z) { const p = state.place; if (p === 'in') return [Math.max(IN.x0 + 0.25, Math.min(IN.x1 - 0.3, x)), Math.max(-1.75, Math.min(IN.z1 - 0.25, z))]; if (p === 'ware') return [Math.max(WX0 + 0.3, Math.min(WX1 - 0.3, x)), Math.max(-1.65, Math.min(4.65, z))];
  if (p === 'out' && !Q.ruin && NS.ready && !Q.on && !FB.on && state.z > NS.zmin - 1) return [Math.max(NS.x0 + 0.3, x), Math.max(NS.zmin + 0.2, Math.min(NS.zmax - 0.2, z))];   /* in the new street the camera stays in the new street */
  if (p === 'out' && !Q.ruin && x > X0 - 1 && x < X1 + 0.3 && Math.abs(state.z) < S) return [x, Math.max(-(S - 0.25), Math.min(S - 0.25, z))]; return [x, z]; }
function groundYAt(x, z) { if (x > SHORE - 2.5 && Math.abs(z) < 1.75) return 0.06; if (x > X0 && x < X1 && Math.abs(z) > S - 1.7 && Math.abs(z) < S + 0.1) return 0.12; return 0; }
function groundY(x, z) { if (state.place !== 'out' || Q.ruin) return 0; if (x > SHORE - 2.5 && Math.abs(z) < 1.75) return 0.06; if (x > X0 && x < X1 && Math.abs(z) > S - 1.7 && Math.abs(z) < S + 0.1) return 0.12; return 0; }
function clampPos(nx, nz) {
  if (state.place === 'ware') { nx = Math.max(WX0 + 0.5, Math.min(WX1 - 0.6, nx)); nz = Math.max(-1.4, Math.min(4.4, nz)); for (const [tx, tz, r] of [[-258.6, 2.9, 1.5], [-252.5, 1.2, 1.0]]) { const dx = nx - tx, dz = nz - tz, d = Math.hypot(dx, dz); if (d < r && d > 0) { nx = tx + dx / d * r; nz = tz + dz / d * r; } } return [nx, nz]; }
  if (state.place === 'after') { nx = Math.max(X0 + 0.6, Math.min(0.4, nx)); nz = Math.max(-3.9, Math.min(3.9, nz));
    for (const t of CAMP_TENTS) [nx, nz] = pushOut(nx, nz, t[0], t[1], t[2] / 2 + 0.35, t[4] / 2 + 0.35, t[5]);
    for (const [cx, cz, r] of [[FX, FZ, 0.75], [ABBA.x, ABBA.z, 0.65], [HEATH.x, HEATH.z, 0.65], ...SURV.map((p) => [p[0], p[1], 0.6]), ...EXTRA.map((p) => [p[0], p[1], 0.6])]) { const dx = nx - cx, dz = nz - cz, d = Math.hypot(dx, dz); if (d < r && d > 0) { nx = cx + dx / d * r; nz = cz + dz / d * r; } } return [nx, nz]; }
  if (state.place === 'yard') { nx = Math.max(YX + 0.8, Math.min(YX + 13, nx)); nz = Math.max(YZ - 13, Math.min(YZ + 4.5, nz)); const dx = nx - (YX + 6), dz = nz - (YZ - 2), d = Math.hypot(dx, dz); if (d < 1.7 && d > 0) { nx = YX + 6 + dx / d * 1.7; nz = YZ - 2 + dz / d * 1.7; } return [nx, nz]; }
  if (state.place === 'sea') return [Math.max(SHORE + 4, Math.min(SHORE + 75, nx)), Math.max(9, Math.min(75, nz))];
  if (state.place === 'in') {
    nx = Math.max(IN.x0 + 0.45, Math.min(IN.x1 - 0.95, nx)); nz = Math.max(-1.5, Math.min(IN.z1 - 0.45, nz));
    for (const [tx, tz, r] of [[-198.2, 1.3, 1.25], [-201.6, 1.0, 1.25], [-195.9, 2.3, 0.75], ...EXTRA_IN]) { const dx = nx - tx, dz = nz - tz, d = Math.hypot(dx, dz); if (d < r && d > 0) { nx = tx + dx / d * r; nz = tz + dz / d * r; } }
    return [nx, nz];
  }
  nx = Math.max(X0 - 0.2, Math.min(SHORE + 23, nx)); if (!townReady && nx < X1 + 2.5) { nx = X1 + 2.5; if (!holdToast) { holdToast = true; toast('The town is still loading.'); setTimeout(() => { holdToast = false; }, 4000); } }
  nx = Math.min(SHORE + 21.5, nx); if (nx > SHORE - 1.5) { if (Math.abs(state.z) > 1.45 || (state.x <= SHORE - 1.5 && Math.abs(nz) > 1.4)) nx = SHORE - 1.5; else nz = Math.max(-1.4, Math.min(1.4, nz)); }   /* the pier rule applies only on the pier: away from it (by the turtle pen) you stop at the water's edge instead of being snapped onto the pier */
  else if (nx > X1 + 0.3) nz = Math.max(-9, Math.min(NS.ready && !Q.on && !FB.on ? 21.3 : 9, nz));   /* the beached boat at z 22.4 closes the strip */
  else { const newSt = NS.ready && !Q.on && !FB.on, inNew = (z) => newSt && z > NS.zmin && z < NS.zmax;
    if (state.x > X1 + 0.3 && Math.abs(nz) >= S - 0.45 && !inNew(nz)) nx = X1 + 0.31;   /* step into a street only where it opens onto the harbour */
    else if (newSt && state.z > 11) { nx = Math.max(NS.x0 + 0.4, nx); nz = Math.max(NS.zmin, Math.min(NS.zmax, nz)); for (const [a, b, c, d] of NS.col) { const px = Math.max(a, Math.min(c, nx)), pz = Math.max(b, Math.min(d, nz)), dx = nx - px, dz = nz - pz, dd = Math.hypot(dx, dz); if (dd < 0.32) { if (dd > 1e-4) { nx = px + dx / dd * 0.32; nz = pz + dz / dd * 0.32; } else { nx = state.x; nz = state.z; } } } }
    else nz = Math.max(-(S - 0.45), Math.min(S - 0.45, nz)); }
  for (const [cx, cz, r] of [[ABBA.x, ABBA.z, 0.75], ...(townReady && !Q.on ? NPCS.map((n) => [n.x, n.z, n.id === 'kofi' ? 1.05 : 0.8]) : []), ...(NS.ready && !Q.on && !FB.on ? NS_PEOPLE.map((n) => [n.x, n.z, 0.7]) : []), ...(typeof SOLDIER !== 'undefined' && SOLDIER.m && SOLDIER.m.visible ? [[SOLDIER.m.position.x, SOLDIER.m.position.z, 0.7]] : [])]) { const dx = nx - cx, dz = nz - cz, d = Math.hypot(dx, dz); if (d < r && d > 0) { nx = cx + dx / d * r; nz = cz + dz / d * r; } }
  if (!Q.ruin) { if (!propC) buildPropC(); for (const [x0, z0, x1, z1, po] of propC) { if (po && !po.visible) continue; if (state.x > x0 - 0.05 && state.x < x1 + 0.05 && state.z > z0 - 0.05 && state.z < z1 + 0.05) continue;   /* already inside it (an old save): let you walk out */ const px = Math.max(x0, Math.min(x1, nx)), pz = Math.max(z0, Math.min(z1, nz)), dx = nx - px, dz = nz - pz, d = Math.hypot(dx, dz), r = 0.32; if (d < r) { if (d > 1e-4) { nx = px + dx / d * r; nz = pz + dz / d * r; } else { nx = state.x; nz = state.z; } } } }
  return [nx, nz];
}

/* ---------- interface ---------- */
let toastTimer = 0;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2600); }
function unlock(id) { if (state.unlocked.includes(id)) return; state.unlocked.push(id); uiSound('page'); saveGame(); const j = JOURNAL.find((p) => p.id === id); $('jcount').textContent = state.unlocked.length; $('jcount').hidden = false; toast('Journal: ' + j.title); }
let goalText = '', goalTimer = 0, hintTimer = 0;
function showGoal(withControls) { const el = $('goal'); if (el.textContent !== goalText && state.started) uiSound('goal'); el.textContent = goalText; el.classList.remove('folded'); el.setAttribute('aria-expanded', 'true'); clearTimeout(goalTimer);
  goalTimer = setTimeout(() => { el.textContent = 'Goal'; el.classList.add('folded'); el.setAttribute('aria-expanded', 'false'); }, 6500);
  if (withControls) showHint(); }
function showHint() { $('hint').hidden = false; clearTimeout(hintTimer); hintTimer = setTimeout(() => { $('hint').hidden = true; }, 6000); }
$('goal').onclick = () => showGoal(true);
function foundCount() { return FINDS.filter((f) => state.unlocked.includes(f.id)).length; }
function setGoal() {
  if (Q.on || state.place === 'ware' || FB.on) return;          // chapters set their own goals
  let g;
  if (!state.unlocked.includes('harbour')) g = 'Walk down the pier and into the town.';
  else if (!state.talked) g = 'Find the woman in the white head wrap.';
  else if (state.place === 'out' && !state.ate) g = 'Go into the tavern. The door is next to Abba.';
  else if (!state.ate) g = 'Ask Abba for some stew.';
  else if (foundCount() < FINDS.length) g = 'Find 4 things in the tavern. Found: ' + foundCount() + ' of ' + FINDS.length + '.';
  else if (!state.unlocked.includes('morgan')) g = 'Talk to old Ned at the table. He has a story.';
  else if (!state.unlocked.includes('forts')) g = 'Walk to Fort Charles, along the beach past the houses.';
  else g = 'You have finished the first part. Open your journal for the next part of the story.';
  if (g !== goalText) { goalText = g; showGoal(); }
  if (state.ate && foundCount() === FINDS.length && state.unlocked.includes('forts') && !state.done) { state.done = true; setTimeout(() => toast('Well done! Your journal now has ' + state.unlocked.length + ' pages.'), 3800); }
}
let convo = TALK, convoEnd = null;
function showStep() {
  const s = convo[state.step], me = s.who === 'You' || s.who === 'Lewis'; if (!me) setSpeaker(s.who, s.anim); $('who').textContent = me ? 'You' : s.who; $('dialogue').classList.toggle('me', me);   /* your own lines look different from theirs */ $('line').textContent = s.text; const ch = $('choices'); ch.replaceChildren();
  if (s.choices) { $('next').hidden = true; for (const c of s.choices) { const o = typeof c === 'string' ? { t: c, ok: true } : c; const b = document.createElement('button'); b.className = 'btn ghost'; b.textContent = o.t;
      b.onclick = () => { if (o.ok) advance(); else { $('line').textContent = s.hint + ' ' + s.text.split('. ').pop(); b.disabled = true; } }; ch.appendChild(b); } ch.firstChild.focus(); }
  else { $('next').hidden = false; $('next').textContent = state.step === convo.length - 1 ? (convo === TALK ? 'Goodbye for now' : 'Thank you') : 'Next'; $('next').focus(); }
  if (s.unlock) unlock(s.unlock);
}
function leaveTalk() { if ($('dialogue').hidden) return; uiSound('tap'); endTalk(false); $('dialogue').hidden = true; $('goal').hidden = false; busy = false; state.step = 0; convoEnd = null; setGoal(); canvas.focus(); }   /* walk away mid-talk: nothing is lost, talk again any time */
$('dclose').onclick = leaveTalk; canvas.addEventListener('pointerdown', () => { if (!$('dialogue').hidden) leaveTalk(); });   /* tapping the world outside the box also ends the talk */
function advance() { state.step++; if (state.step >= convo.length) { endTalk(convo !== WARE1); $('dialogue').hidden = true; $('goal').hidden = false; busy = false; state.step = 0; const e = convoEnd; convoEnd = null; if (e) e(); setGoal(); canvas.focus(); return; } showStep(); }
/* later visits: each person has a few more things to say, and they notice what you have done */
const heardNed = () => state.unlocked.includes('panama'), sawFort = () => state.unlocked.includes('forts');
const MORE = {
  kofi: [[() => true, 'I must get back to work.'], [() => state.ate, 'You ate at Abba’s? Her stew is good. I eat later, if there is time.'], [heardNed, 'Ned tells big stories. Not everyone on those ships was free.'], [sawFort, 'Ships come in every day. I carry what they bring.']],
  sailor: [[() => true, 'We sail with the tide. Keep your money safe!'], [heardNed, 'Ned told you about Morgan? Ha! He tells it bigger every time.'], [sawFort, 'Did they fire a gun at the fort? You can hear it across the harbour!'], [() => state.ate, 'Abba’s turtle stew! Best food on the island.']],
  benning: [[() => true, 'Come back when you need plates!'], [() => state.ate, 'Did you eat off a pewter plate at Abba’s? Maybe one of mine!'], [() => true, 'Look under any plate for the pineapple. Then you know it is ours.'], [() => true, 'Pewter is mostly tin, with a little copper mixed in to make it strong.']] };
function npcTalk(n) { const seen = state.ch.seen || (state.ch.seen = {}); const k = seen[n.id] || 0; seen[n.id] = k + 1;
  if (k === 0) return startConvo(n.talk); const opts = (MORE[n.id] || []).filter(([w]) => w()); if (!opts.length) return startConvo(n.again);
  const newer = opts.slice(1).filter(([, t]) => !(state.ch.heard || []).includes(t)); const pick = newer.length ? newer[0] : opts[(k - 1) % opts.length];   /* something new first, then take turns */
  (state.ch.heard || (state.ch.heard = [])).push(pick[1]); saveGame(); startConvo([{ who: n.who, text: pick[1] }]); }
function startConvo(c, end) { uiSound('tap'); convo = c; convoEnd = end; busy = true; keys.clear(); $('talk').hidden = true; $('hint').hidden = true; $('goal').hidden = true; $('dialogue').hidden = false; state.step = 0; showStep(); }
$('next').onclick = advance;
/* things you can walk up to and use */
const ACTIONS = [
  ...['sugar', 'cocoa', 'logwood'].map((id, i) => ({ label: ['Look at the casks', 'Look at the sacks', 'Look at the red wood'][i], r: 2.6, where: () => state.place === 'ware' && !state.unlocked.includes(id) && WGOODS[id], go: () => { unlock(id); wareMark[id].visible = false; wareGoal(); } })),
  { label: 'Sit at the desk', r: 2.4, where: () => state.place === 'ware' && wareSeen() && !W.coins && [-258.6, 2.9], go: () => startConvo(COINS, () => { W.coins = true; abba.visible = true; ABBA.x = -250.2; ABBA.z = 0.4; abba.position.set(ABBA.x, 0, ABBA.z); toast('Abba has come in.'); wareGoal(); }) },
  { label: 'Talk to Abba', r: 3.0, where: () => state.place === 'ware' && W.coins && !W.talked && [ABBA.x, ABBA.z], go: () => startConvo(WARE1, () => { W.talked = true; const ac = abba.userData.anim; if (ac && CL.WaveSlow) ac.play('WaveSlow', true); setTimeout(() => { if (state.place === 'ware') { abba.visible = false; ABBA.x = 9999; toast('Abba goes out to the wharf.'); } }, 2600); wareGoal(); }) },
  { label: 'Go out to the wharf', r: 1.8, where: () => state.place === 'ware' && [WX1 - 0.7, 0.8], go: () => card('Leave the warehouse?', ['You can come back any time from the Chapters menu.'], [{ t: 'Back to the town', go: leaveWare }, { t: 'Stay', go: hideCard }]) },
  { label: 'Read the letter', r: 2.4, where: () => state.place === 'ware' && W.talked && [-258.6, 2.9], go: readLetter },
  { label: 'Talk to Abba', r: 3.2, where: () => state.place === 'after' && [ABBA.x, ABBA.z], go: () => { if (afterDone() && Q.aTalk) startConvo(AFTER2, stayOrGo); else startConvo(AFTER1, () => { Q.aTalk = true; afterGoal(); }); } },
  { label: 'Look at the big tent', r: 3.6, where: () => state.place === 'after' && !state.unlocked.includes('tentp') && [-12.5, 0.8], go: () => { unlock('tentp'); afterGoal(); } },
  { label: 'Look across the water', r: 2.6, where: () => state.place === 'after' && !state.unlocked.includes('kingston') && [0.2, 0], go: () => { unlock('kingston'); afterGoal(); } },
  { label: 'Read the tombstone', r: 3.2, where: () => state.place === 'yard' && [YX + 6, YZ - 2], go: readStone },
  ...NPCS.map((n) => ({ label: n.label, r: 2.6, where: () => townReady && !Q.on && state.place === 'out' && people[n.id] && [n.x, n.z], go: () => npcTalk(n) })),
  { label: 'Talk to Sam', r: 2.4, where: () => state.place === 'after' && survivors.sailor && [SURV[0][0], SURV[0][1]], go: () => startConvo(state.unlocked.includes('swan') ? [{ who: 'Sam', text: 'I keep looking at the water. I can\u2019t stop.' }] : SAM_AFTER) },
  { label: 'Talk to Kofi', r: 2.4, where: () => state.place === 'after' && survivors.kofi && [SURV[2][0], SURV[2][1]], go: () => startConvo(KOFI_AFTER) },
  { label: 'Talk to Symon Benning', r: 2.4, where: () => state.place === 'after' && survivors.benning && [SURV[1][0], SURV[1][1]], go: () => startConvo(BENNING_AFTER) },
  { label: 'Talk to the minister', r: 2.6, where: () => state.place === 'after' && people.heath && people.heath.parent && [HEATH.x, HEATH.z], go: () => startConvo(state.unlocked.includes('heath') ? [{ who: 'Emmanuel Heath', text: 'God keep you, Mr Galdy.' }] : HEATH_TALK) },
  { label: 'Reach for the boat', r: 3.6, where: () => state.place === 'sea' && Q.boat && [Q.boat.position.x, Q.boat.position.z], go: () => finishQuake(false) },
  { label: 'Talk to Abba', r: 3.4, where: () => townReady && !Q.on && !FB.on && state.place === 'out' && [ABBA.x, ABBA.z], go: () => startConvo(state.talked ? AFTER : TALK, () => { state.talked = true; if (ring) ring.visible = false; }) },
  { label: 'Go into the tavern', r: 2.0, where: () => tavernReady && !Q.on && state.place === 'out' && state.talked && [-6.18, -4.5], go: () => { setPlace('in'); state.x = -203; state.z = 2.3; state.yaw = 0; state.pitch = 0; setGoal(); } },
  { label: 'Go back to the street', r: 1.3, where: () => state.place === 'in' && [-203, 3.3], go: () => { setPlace('out'); state.x = -6.18; state.z = -3.4; state.yaw = Math.PI; state.pitch = 0; setGoal(); } },
  { label: 'Talk to Abba', r: 2.3, where: () => state.place === 'in' && [-201, -1.9], go: () => startConvo(state.ate ? AFTER : STEW, () => { if (!state.ate) { state.ate = true; stew.visible = true; } }) },
  ...FINDS.map((f) => ({ label: f.label, r: 1.9, where: () => state.place === 'in' && !state.unlocked.includes(f.id) && [f.x, f.z], go: () => { unlock(f.id); finds[f.id].visible = false; setGoal(); } })),
];
let current = null;
$('talk').onclick = () => { if (current) current.go(); };
function renderJournal(sel) {
  const tabs = $('jtabs'); tabs.replaceChildren(); const open = sel || state.unlocked[state.unlocked.length - 1];
  JOURNAL.filter((p) => state.unlocked.includes(p.id)).forEach((p) => { const b = document.createElement('button'); b.className = 'tab' + (p.id === open ? ' on' : ''); b.textContent = p.title; b.onclick = () => renderJournal(p.id); tabs.appendChild(b); });
  const left = JOURNAL.length - state.unlocked.length; if (left > 0) { const m = document.createElement('button'); m.className = 'tab'; m.disabled = true; m.textContent = left + ' more to find'; tabs.appendChild(m); }
  const page = $('jpage'); page.replaceChildren(); const p = JOURNAL.find((q) => q.id === open);
  if (!p) { const e = document.createElement('p'); e.textContent = 'Your journal is empty. Talk to people in the town to fill it.'; page.appendChild(e); return; }
  const h = document.createElement('h3'); h.textContent = p.title; page.appendChild(h);
  for (const t of p.simple) { const e = document.createElement('p'); e.textContent = t; page.appendChild(e); }
  const d = document.createElement('details'); const s = document.createElement('summary'); s.textContent = 'Dig deeper'; d.appendChild(s);
  for (const t of p.deeper) { const e = document.createElement('p'); e.textContent = t; d.appendChild(e); } page.appendChild(d);
}
function openJournal() { if (!$('dialogue').hidden) return; busy = true; keys.clear(); renderJournal(); $('journal').hidden = false; $('jclose').focus(); }
function closeJournal() { if ($('journal').hidden) return; $('journal').hidden = true; busy = false; }
$('jbtn').onclick = openJournal; $('jclose').onclick = closeJournal;
function startGame() { audioInit(); state.started = true; $('title').hidden = true; $('hud').hidden = false; if (state.unlocked.length) { $('jcount').textContent = state.unlocked.length; $('jcount').hidden = false; }
  setGoal(); $('hint').textContent = isTouch ? 'Left thumb walks. Drag to look.' : 'W A S D to walk, Shift to hurry. Drag to look. E to use.'; showHint(); canvas.focus(); }
$('start').onclick = () => { startGame(); cue('begin'); };

const RESTORE = { pos: null };   /* a saved spot waits until its streets exist, or the walking rules would push you out of a street that has not loaded yet */
TICKS.push(() => { const p = RESTORE.pos; if (!p || !state.started || !townReady) return; const inNew = p[1] > S + 0.5; if (inNew && !NS.ready && !NS.err) return; RESTORE.pos = null; if (inNew && !NS.ready) return; state.x = p[0]; state.z = p[1]; state.yaw = p[2]; MV.vx = MV.vz = 0; });
/* ---------- saving: kept in this browser only ---------- */
const SAVE_KEY = 'portroyal-save-v1'; let hasSave = false, lastSave = 0;
function saveGame() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ unlocked: state.unlocked, talked: state.talked, ate: state.ate, done: state.done, ch: state.ch,
  pos: RESTORE.pos || (state.place === 'out' && !Q.on ? [state.x, state.z, state.yaw] : null) })); }   /* while a saved spot is still waiting to be restored, keep it rather than the temporary start position */ catch (e) { /* storage may be blocked; the game still plays */ } }
function loadGame() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; } }
function applySave(d) { if (!d || !Array.isArray(d.unlocked)) return; state.unlocked = d.unlocked.filter((id) => JOURNAL.some((p) => p.id === id)); state.talked = !!d.talked; state.ate = !!d.ate; state.done = !!d.done; state.ch = d.ch && typeof d.ch === 'object' ? d.ch : {};
  const p = d.pos; const okMain = (x, z) => x > X0 - 1 && x < SHORE + 24 && Math.abs(z) < 9.5 && !(x < X1 + 0.3 && Math.abs(z) > S), okCorner = (x, z) => x > X1 + 0.3 && x < SHORE && z > -9 && z < 21.3, okNew = (x, z) => x > NS.x0 && x < X1 + 3 && z > NS.zmin && z < NS.zmax;   /* the main street, the harbour-corner strip and the new street are all fine places to wake up */
  if (Array.isArray(p) && p.every(Number.isFinite) && (okMain(p[0], p[1]) || okCorner(p[0], p[1]) || okNew(p[0], p[1]))) RESTORE.pos = p;   /* put you back there once the town and the new street have loaded (see RESTORE below) */
  hasSave = state.unlocked.length > 0; }
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && state.started) saveGame(); });

/* ---------- chapters ---------- */
const FADE_TITLES = { goArrive: ['1690', 'Port Royal, Jamaica'], leaveWare: ['1690', 'Back in the town'], beginWare: ['1691', 'Lewis Galdy\u2019s warehouse'], beginQuake: ['7 June 1692', 'A hot, still morning'], beginAfter: ['Three days later', 'The camp on the beach'], toYard: ['Many years later', 'St Peter\u2019s Church, Port Royal'], leaveQuake: ['1690', 'Before the earthquake'] };
let fading = false;
function chapterFade(name, fn) { return function (...a) { if (fading) return; if (__DEV__ && new URLSearchParams(location.search).has('shot')) return fn.apply(this, a);
  fading = true; const f = $('fade'), [t, sub] = FADE_TITLES[name]; $('fadeT').textContent = t; $('fadeS').textContent = sub; $('card').hidden = true; $('dialogue').hidden = true;
  f.hidden = false; requestAnimationFrame(() => { f.classList.add('on'); }); setTimeout(() => { fn.apply(this, a); f.classList.add('txt'); }, 750);
  setTimeout(() => { f.classList.remove('txt'); }, 2500); setTimeout(() => { f.classList.remove('on'); }, 2900); setTimeout(() => { f.hidden = true; fading = false; }, 3800); }; }
function goArrive() { hideCard(); if (Q.on) { resetWorld(); Q.on = false; } setPlace('out'); state.x = 43; state.z = 0; state.yaw = Math.PI / 2; state.pitch = 0; goalText = ''; setGoal(); cue('begin'); }
const CHAPTERS = [
  { year: '1690', name: 'Arrival', go: () => goArrive(), done: () => state.ate },
  { year: '1670', name: 'Ned\u2019s story: Morgan\u2019s men', go: () => fbIntro(), done: () => state.unlocked.includes('morgan') },
  { year: '1691', name: 'The warehouse', go: () => wareIntro(), done: () => !!state.ch.ware },
  { year: '7 June 1692', name: 'The earthquake', go: () => quakeIntro(), done: () => state.unlocked.includes('tomb') },
  { year: '1692', name: 'The days after', go: () => beginAfter(), done: () => !!state.ch.after },
  { year: '1739 and today', name: 'The tombstone', go: () => toYard(), done: () => state.unlocked.includes('stone') },
];
function renderChapters() { const ul = $('chlist'); ul.replaceChildren();
  CHAPTERS.forEach((c, i) => { const open = i === 0 || state.ch.all || CHAPTERS[i - 1].done(), dn = c.done(), li = document.createElement('li'), b = document.createElement('button');
    b.className = 'chbtn' + (dn ? ' done' : ''); b.disabled = !open || !tavernReady;
    for (const [cls, txt] of [['yr', c.year], ['nm', c.name], ['st', !tavernReady ? 'Loading' : dn ? 'Done' : open ? 'Play' : 'Locked']]) { const sp = document.createElement('span'); sp.className = cls; sp.textContent = txt; b.appendChild(sp); }
    b.onclick = () => playChapter(c); li.appendChild(b); ul.appendChild(li); });
  $('chteach').hidden = !!state.ch.all; $('chreset').textContent = 'Start again'; $('chreset').dataset.armed = ''; }
function openChapters() { closeJournal(); busy = true; keys.clear(); renderChapters(); $('chapters').hidden = false; const f = $('chlist').querySelector('button:not(:disabled)'); (f || $('chclose')).focus(); }
function closeChapters() { if ($('chapters').hidden) return; $('chapters').hidden = true; busy = !$('card').hidden; if (state.started) canvas.focus(); }
function playChapter(c) { $('chapters').hidden = true; busy = false; fbReset(); if (!state.started) startGame(); c.go(); }
$('chclose').onclick = closeChapters; $('tchap').onclick = openChapters; $('jchap').onclick = openChapters;
$('chteach').onclick = () => { state.ch.all = true; saveGame(); renderChapters(); };
$('chreset').onclick = () => { const b = $('chreset'); if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'Tap again to erase all progress'; return; } try { localStorage.removeItem(SAVE_KEY); sessionStorage.setItem('pr-fresh', '1'); } catch (e) { /* ignore */ } location.reload(); };

/* ---------- sound: made in the browser, no audio files ---------- */
let stepDist = 0, lastStep = 0, camLift = 0;
function footstep() { stepSound(floorKind()); } const MV = { vx: 0, vz: 0, turn: 0, tap: null };
function floorKind() { const p = state.place, x = state.x, z = state.z;
  if (p === 'in') return 'wood'; if (p === 'ware') return Math.abs(x - (WX1 - 0.7)) < 0.6 ? 'wood' : 'stone'; if (p === 'sea') return 'water';
  if (Q.on && Q.phase === 'yard') return 'grass'; if (x > SHORE - 2.5 && Math.abs(z) < 1.75) return 'wood';
  if (!(Q.on && Q.ruin) && x > X0 && x < X1 && Math.abs(z) < S - 0.6) return 'stone'; return 'sand'; }
let auNext = 0, gullAt = 2, crackAt = 0, chirpAt = 0, murm = 0.6;
/* more of the world's sounds, all made in code */
function audioTick(t) { if (!AU.ctx || !state.started || t < auNext) return; auNext = t + 0.1;
  const p = state.place, shaking = Q.on && ['tremor', 'main', 'swallow'].includes(Q.phase), swell = 0.72 + 0.28 * Math.sin(t * 0.55) + 0.1 * Math.sin(t * 1.7);
  let sea = 0, surf = 0, wind = 0, crowd = 0, room = 0, gulls = false, fire = false, birds = false;
  if (p === 'out') { const k = Math.max(0, Math.min(1, (state.x + 5) / (SHORE + 10))); sea = (0.15 + 0.55 * k) * swell; surf = 0.04 * k * swell; wind = Q.ruin ? 0.1 : 0.05; gulls = !Q.ruin && state.x > -2; if (NS.ready && !Q.on && state.z > 11) crowd = 0.2 * Math.max(0, Math.min(1, (state.x - 2) / 8)); }
  else if (p === 'in') { crowd = 0.3; fire = true; sea = 0.03; }
  else if (p === 'ware') { room = 0.14; sea = 0.16 * swell; gulls = true; }
  else if (p === 'sea') { sea = 0.8 * swell; surf = 0.08 * swell; wind = 0.12; }
  else if (p === 'after') { sea = 0.22 * swell; wind = 0.14; }
  else if (p === 'yard') { wind = 0.07; sea = 0.08 * swell; birds = true; }
  if (shaking) { sea *= 0.4; surf = 0; crowd = 0; gulls = birds = false; }
  setG(AU.ch.sea, sea); setG(AU.ch.surf, surf); setG(AU.ch.wind, wind); setG(AU.ch.room, room);
  murm = Math.max(0.3, Math.min(1, murm + (Math.random() - 0.5) * 0.3)); setG(AU.ch.crowd, crowd * murm, 0.12); AU.ch.crowd.f.frequency.setTargetAtTime(380 + murm * 260, AU.ctx.currentTime, 0.2);
  if (gulls && t > gullAt) { gullAt = t + 6 + Math.random() * 10; gullCry(); }
  if (fire && t > crackAt) { crackAt = t + 0.05 + Math.random() * 0.35; crackle(); }
  if (birds && t > chirpAt) { chirpAt = t + 3 + Math.random() * 6; chirp(); }
  if (!shaking && p === 'out' && !Q.ruin && !FB.on && state.x > SHORE - 9 && t > creakAt) { creakAt = t + 3 + Math.random() * 6; shipCreak(); }
  if (!shaking && p === 'out' && !Q.ruin && state.x > X0 && state.x < X1 && t > hammerAt) { hammerAt = t + 5 + Math.random() * 8; hammer(); }
  if (p === 'in' && t > clinkAt) { clinkAt = t + 2.5 + Math.random() * 6; clink(); } }
let creakAt = 0, hammerAt = 0, clinkAt = 0;
/* on touch screens the joystick rests faintly at the bottom left, so young players can see where their thumb goes */
TICKS.push(() => { if (!isTouch) return; const st = $('stick'); const rest = state.started && !busy && stick.id === null && $('dialogue').hidden && $('card').hidden;
  if (rest) { st.hidden = false; st.classList.add('rest'); st.style.left = '86px'; st.style.top = (innerHeight - 96) + 'px'; } else if (stick.id === null) { st.hidden = true; st.classList.remove('rest'); } else st.classList.remove('rest'); });
/* game controllers: left stick walks, right stick looks, A talks or carries on, Y opens the journal, a bumper hurries */
const PAD = { prev: [] };
function padRead(dt) { const gp = navigator.getGamepads ? [...navigator.getGamepads()].find((g) => g && g.connected) : null; if (!gp) return null; const dz = (v) => Math.abs(v) < 0.18 ? 0 : (v - Math.sign(v) * 0.18) / 0.82;
  const b = gp.buttons.map((x) => x.pressed), was = PAD.prev, hit = (i) => b[i] && !was[i]; PAD.prev = b;
  if (hit(0)) { if (!$('card').hidden) { const c = $('cbtns').querySelector('button'); if (c) c.click(); } else if (!$('dialogue').hidden) { const ch = $('choices').querySelector('button:not([disabled])'); if (ch && !$('choices').hidden) ch.click(); else $('next').click(); } else if (!busy && current) current.go(); else if (!state.started) $('start').click(); }
  if (hit(1)) { closeJournal(); if (!$('chapters').hidden) closeChapters(); }
  if (hit(3)) { $('journal').hidden ? openJournal() : closeJournal(); }
  return { f: -dz(gp.axes[1] || 0), r: dz(gp.axes[0] || 0), lx: dz(gp.axes[2] || 0), ly: dz(gp.axes[3] || 0), hurry: b[4] || b[5] || b[7] || b[10] }; }
/* gulls wheeling over the harbour: simple flapping wings, a few at a time */
const GULLS = [];
function gullsInit() { if (GULLS.length) return; const wm = new THREE.MeshBasicMaterial({ color: 0xf4f2ec, side: THREE.DoubleSide, fog: true }), tip = new THREE.MeshBasicMaterial({ color: 0x3a3a3a, side: THREE.DoubleSide });
  for (let i = 0; i < 6; i++) { const g = new THREE.Group(); const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.22, 3, 6), wm); body.rotation.x = Math.PI / 2; g.add(body);
    const wing = (sx) => { const pv = new THREE.Group(); const w = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.13), wm); w.position.x = sx * 0.21; w.rotation.x = -Math.PI / 2; pv.add(w); const t = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.1), tip); t.position.x = sx * 0.46; t.rotation.x = -Math.PI / 2; pv.add(t); g.add(pv); return pv; };
    g.userData = { l: wing(-1), r: wing(1), cx: i < 2 ? 4 + Math.random() * 8 : SHORE + 6 + Math.random() * 18, cz: i < 2 ? 18.6 : (Math.random() - 0.5) * 22, rad: 5 + Math.random() * 7, h: 7 + Math.random() * 6, sp: (0.18 + Math.random() * 0.12) * (Math.random() < 0.5 ? -1 : 1), a: Math.random() * 6.3, ph: Math.random() * 6 };
    scene.add(g); GULLS.push(g); } }
/* ---------- a soldier of the fort's garrison: he walks the main street into the tavern, comes back out, and walks along the quay and the sand spit to Fort Charles ---------- */
const SOLDIER = { m: null, pike: null, path: [[-6.18, -4.7], [-6.18, -3.0], [-6.0, -1.1], [4, -1.2], [12, -0.9], [17, -0.6], [21.95, -2.6], [21.95, -9.0], [26, -14], [30, -22], [34.5, -29.4], [37.6, -30]], i: 5, dir: -1, wait: 0, hidden: false, walking: false };
function loadSoldier() { model('soldier').then((gl) => { const m = prep(gl.scene); const [x, z] = SOLDIER.path[SOLDIER.i]; m.position.set(x, 0, z); scene.add(m); SOLDIER.m = m; animate(m);
  const wood = new THREE.MeshStandardMaterial({ map: plankTex([112, 84, 56], 3, 1, 1), roughness: 0.9 }), iron = new THREE.MeshStandardMaterial({ color: 0x6a6e72, roughness: 0.35, metalness: 0.8 });
  const pike = new THREE.Group(); const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 1.75, 7), wood); shaft.position.y = 0.42; pike.add(shaft); const tip = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.2, 4), iron); tip.position.y = 1.39; pike.add(tip); scene.add(pike); SOLDIER.pike = pike;   /* a half-pike, carried upright */
  m.traverse((o) => { if (o.isBone && /RightHand$/.test(o.name)) SOLDIER.hand = o; }); }).catch(() => {}); }
const _sh = new THREE.Vector3();
TICKS.push((dt) => { const S0 = SOLDIER, m = S0.m; if (!m) return;
  const show = state.place === 'out' && !Q.on && !FB.on && !S0.hidden; m.visible = show; if (S0.pike) S0.pike.visible = show;
  const ac = m.userData.anim;
  if (S0.wait > 0) { S0.wait -= dt; if (S0.wait <= 0 && S0.hidden) { S0.hidden = false; } }
  else { const [tx, tz] = S0.path[S0.i], dx = tx - m.position.x, dz = tz - m.position.z, d = Math.hypot(dx, dz);
    const blocked = show && Math.hypot(state.x - m.position.x, state.z - m.position.z) < 1.5;   /* he waits rather than walk through you */
    if (d < 0.1) { const end = S0.i === 0 || S0.i === S0.path.length - 1;
      if (end) { S0.hidden = true; S0.wait = S0.i === 0 ? 14 + Math.random() * 8 : 20 + Math.random() * 10; S0.dir = S0.i === 0 ? 1 : -1; S0.i += S0.dir; if (S0.walking) { S0.walking = false; if (ac) ac.rest(); } }   /* inside the tavern, or inside the fort, for a while */
      else S0.i += S0.dir; }
    else if (blocked) { if (S0.walking) { S0.walking = false; if (ac) ac.rest(); } }
    else { if (!S0.walking) { S0.walking = true; if (ac) ac.play('Walk'); } const v = Math.min(d, 0.85 * dt); m.position.x += dx / d * v; m.position.z += dz / d * v;
      let e = Math.atan2(dx, dz) - m.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); m.rotation.y += e * Math.min(1, dt * 6); } }
  if (show && S0.pike && S0.hand) { S0.hand.getWorldPosition(_sh); S0.pike.position.copy(_sh); S0.pike.rotation.set(0.08 * Math.cos(m.rotation.y), 0, -0.08 * Math.sin(m.rotation.y)); } });
/* ---------- the helper nudge: if the player stands still or the goal does not change for a while, the goal pops open and a gold arrow shows the way ---------- */
const NUDGE_MAP = [   /* goal words -> the action (or place) that moves the story on */
  [/pier and into the town/, [18, 0]], [/Walk to the harbour/, [21, 0]], [/Fort Charles/, [14.6, -23]],
  [/woman in the white|Find Abba|Abba is at the door|Go back to Abba/, /Abba/], [/Go into the tavern/, /Go into the tavern/], [/stew/, /Abba/],
  [/Find 4 things|Look around|Check today/, /^Look at|^Look across/], [/Ned/, /old Ned/], [/tomb/, /tombstone/], [/desk/, /desk/], [/letter/, /letter/],
  [/Morgan/, /Morgan/], [/quartermaster/, /quartermaster/], [/sword drill/, /sword drill/], [/man with the crates/, /Help load/],
  [/Pick up a crate|Get another crate/, /Pick up a crate/], [/Carry it/, /Put the crate/], [/Swim/, /Reach for the boat/]];
const NUDGE = { goal: '', since: 0, still: 0, lx: 0, lz: 0, on: false, t: 0 };
function nudgeTarget() {
  const hit = NUDGE_MAP.find(([re]) => re.test(goalText)); if (!hit) return null; const want = hit[1];
  if (Array.isArray(want)) return want;
  let best = null, bd = 1e9; for (const a of ACTIONS) { if (!!FB.on !== !!a.fb || !want.test(a.label)) continue; const w = a.where(); if (!w) continue; const d = Math.hypot(state.x - w[0], state.z - w[1]); if (d < bd) { bd = d; best = w; } }
  return best;
}
const _nv = new THREE.Vector3();
TICKS.push((dt) => {
  const el = $('nudge'), now = performance.now(); if (!el) return;
  const quiet = state.started && !busy && $('dialogue').hidden && $('card').hidden && goalText && !/^Run!|sand is pulling/.test(goalText);
  if (goalText !== NUDGE.goal) { NUDGE.goal = goalText; NUDGE.since = now; NUDGE.on = false; }
  const moved = Math.hypot(state.x - NUDGE.lx, state.z - NUDGE.lz); if (moved > 0.6) { NUDGE.lx = state.x; NUDGE.lz = state.z; NUDGE.still = now; }
  if (!quiet) { NUDGE.since = Math.max(NUDGE.since, now - 30000); NUDGE.still = now; }   /* time spent reading does not count */
  const tgt = quiet ? nudgeTarget() : null;
  if (!NUDGE.on && quiet && (now - NUDGE.still > 15000 || now - NUDGE.since > 50000)) { NUDGE.on = true; showGoal(); const g = $('goal'); g.classList.remove('nudge'); void g.offsetWidth; g.classList.add('nudge'); }
  if (NUDGE.on && tgt && Math.hypot(state.x - tgt[0], state.z - tgt[1]) < 2.2) { NUDGE.on = false; NUDGE.since = NUDGE.still = now; }   /* there: the talk button takes over */
  if (!NUDGE.on || !tgt) { el.hidden = true; return; }
  el.hidden = false;
  const W = innerWidth, H = innerHeight, dx = tgt[0] - state.x, dz = tgt[1] - state.z, rel = Math.atan2(-dx, -dz) - state.yaw, a = Math.atan2(Math.sin(rel), Math.cos(rel));   /* a: 0 straight ahead, plus to the left */
  _nv.set(tgt[0], 2.2, tgt[1]).project(camera); const lab = el.querySelector('span');
  if (Math.abs(a) < 0.55 && _nv.z < 1) {   /* in front: a bouncing arrow points down at it (kept on screen even when you look up or down) */
    el.style.left = Math.max(60, Math.min(W - 60, (_nv.x + 1) / 2 * W)) + 'px'; el.style.top = Math.max(110, Math.min(H * 0.62, (1 - _nv.y) / 2 * H)) + 'px'; el.className = 'down'; const sy = (1 - _nv.y) / 2 * H; lab.textContent = sy > H * 0.75 ? 'Look down' : sy < 90 ? 'Look up' : 'Here!'; }
  else { const left = a > 0; el.style.left = (left ? 58 : W - 58) + 'px'; el.style.top = (H * 0.45) + 'px'; el.className = left ? 'left' : 'right'; lab.textContent = 'This way'; }   /* to the side or behind: a big arrow at the edge says which way to turn */
});
TICKS.push((dt) => { if (!GULLS.length) { if (state.started) gullsInit(); return; } const show = state.place === 'out' && !Q.ruin && !(Q.on && Q.phase !== 'calm'); const t = performance.now() / 1000;
  for (const g of GULLS) { g.visible = show; if (!show) continue; const u = g.userData; u.a += u.sp * dt; const x = u.cx + Math.cos(u.a) * u.rad, z = u.cz + Math.sin(u.a) * u.rad; g.position.set(x, u.h + Math.sin(t * 0.7 + u.ph) * 0.6, z); g.rotation.y = -u.a + (u.sp > 0 ? 0 : Math.PI); g.rotation.z = -Math.sign(u.sp) * 0.25;
    const glide = Math.sin(t * 0.4 + u.ph) > 0.3, f = glide ? 0.08 : Math.sin(t * 9 + u.ph) * 0.55; u.l.rotation.z = f; u.r.rotation.z = -f; } });
/* dust drifting in the tavern's window light */
let MOTES = null;
TICKS.push((dt) => { if (state.place !== 'in') { if (MOTES) MOTES.visible = false; return; }
  if (!MOTES) { const n = 140, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { pos[i * 3] = IN.x0 + 0.5 + Math.random() * (IN.x1 - IN.x0 - 1); pos[i * 3 + 1] = 0.4 + Math.random() * 2.2; pos[i * 3 + 2] = -1.6 + Math.random() * (IN.z1 + 1.4); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); MOTES = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffe2b0, size: 0.018, transparent: true, opacity: 0.55, depthWrite: false })); indoor.add(MOTES); }
  MOTES.visible = true; const p = MOTES.geometry.attributes.position, t = performance.now() / 1000; for (let i = 0; i < p.count; i++) { let y = p.getY(i) + dt * 0.03 * (0.5 + (i % 5) * 0.2); if (y > 2.7) y = 0.4; p.setY(i, y); p.setX(i, p.getX(i) + Math.sin(t * 0.3 + i) * dt * 0.02); } p.needsUpdate = true; });
function showSound() { const b = $('snd'); b.setAttribute('aria-pressed', AU.on ? 'true' : 'false'); b.setAttribute('aria-label', AU.on ? 'Sound on. Tap to turn off.' : 'Sound off. Tap to turn on.'); $('sndon').style.display = AU.on ? '' : 'none'; $('sndoff').style.display = AU.on ? 'none' : ''; }
$('snd').onclick = () => { setSound(!AU.on); showSound(); };
showSound();
addEventListener('pointerdown', () => { if (AU.ctx && AU.ctx.state !== 'running') AU.ctx.resume(); });

/* ---------- 7 June 1692 ---------- */
let moveSpeed = 2.7, eyeY = 1.62, seaLevel = -0.35;
const Q = { on: false, phase: '', t: 0, shake: 0, ruin: false, boat: null, debris: [], T: 0, ac: null, gain: null };
const DUST = new THREE.Color(0xb9a888), ease = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
function card(title, paras, buttons) { busy = true; keys.clear(); $('ctitle').textContent = title; const b = $('cbody'); b.replaceChildren(); for (const p of paras) { const e = document.createElement('p'); e.textContent = p; b.appendChild(e); }
  const bt = $('cbtns'); bt.replaceChildren(); buttons.forEach((o, i) => { const e = document.createElement('button'); e.className = 'btn' + (i ? ' ghost' : ''); e.textContent = o.t; e.onclick = o.go; bt.appendChild(e); }); $('card').hidden = false; $('talk').hidden = true; bt.firstChild.focus(); }
function hideCard() { $('card').hidden = true; busy = false; canvas.focus(); }
/* falling bricks and dust as the houses break up */
let deb = null; const debP = [], dustP = [], DEB_N = 520, _dm = new THREE.Matrix4(), _dq = new THREE.Quaternion(), _de = new THREE.Euler(), _ds = new THREE.Vector3(), _dp = new THREE.Vector3();
let dustTex = null;
function debrisInit() { if (deb) return; deb = new THREE.InstancedMesh(new THREE.BoxGeometry(0.24, 0.08, 0.12), (() => { const t = sharedTex('brick', true).clone(); t.repeat.set(0.18, 0.12); t.needsUpdate = true; return new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 }); })(), DEB_N); deb.instanceMatrix.setUsage(THREE.DynamicDrawUsage); deb.frustumCulled = false; deb.count = 0; scene.add(deb);
  const c = new THREE.Color(); for (let i = 0; i < DEB_N; i++) { const r = Math.random(); c.setRGB(0.7 + r * 0.3, 0.66 + r * 0.3, 0.62 + r * 0.3); if (i % 9 === 0) c.setRGB(1.3, 1.3, 1.25); deb.setColorAt(i, c); } deb.instanceColor.needsUpdate = true;
  dustTex = cv(64, 64, (x) => { const g = x.createRadialGradient(32, 32, 2, 32, 32, 31); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(0.5, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); }); }
function breakHouse(o) { debrisInit(); const p = o.m.position, side = p.z < 0 ? 1 : -1, w = 2.4, fz = p.z + side * 3.9;
  for (let i = 0; i < 34 && debP.length < DEB_N; i++) { const big = i < 3; debP.push({ x: p.x + (Math.random() - 0.5) * w * 2, y: 4 + Math.random() * 6, z: fz + side * Math.random() * 0.4, vx: (Math.random() - 0.5) * 1.2, vy: Math.random() * 1.5, vz: side * (0.8 + Math.random() * 2.6), rx: Math.random() * 6, ry: Math.random() * 6, rz: Math.random() * 6, w: (Math.random() - 0.5) * 12, s: big ? 1.7 + Math.random() * 0.8 : 1, rest: false, delay: Math.random() * 1.6 }); }
  for (let i = 0; i < 3; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: dustTex, color: DUST, transparent: true, opacity: 0, depthWrite: false })); sp.position.set(p.x + (i - 1) * 2.2, 1.2, fz + side * 1.2); sp.userData = { age: -i * 0.4, life: 5 + Math.random() * 2 }; scene.add(sp); dustP.push(sp); } }
function debrisTick(dt) { if (Q.phase === 'main' || Q.phase === 'swallow') for (const o of townObjs) if (!o.broke && Q.T > o.delay + 0.4 && o.m.position.x > X0 - 1) { o.broke = true; breakHouse(o); }
  if (deb) { let n = 0; for (const b of debP) { if (b.delay > 0) { b.delay -= dt; continue; } if (!b.rest) { b.vy -= 9.8 * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt; b.rx += b.w * dt; b.rz += b.w * 0.7 * dt; const floor = 0.04 * b.s;
        if (b.y < floor) { b.y = floor; if (Math.abs(b.vy) < 1.2) { b.rest = true; b.rx = Math.round(b.rx / Math.PI) * Math.PI; b.rz = Math.round(b.rz / Math.PI) * Math.PI; } b.vy = -b.vy * 0.28; b.vx *= 0.45; b.vz *= 0.45; b.w *= 0.4; } }
      _dm.compose(_dp.set(b.x, b.y, b.z), _dq.setFromEuler(_de.set(b.rx, b.ry, b.rz)), _ds.setScalar(b.s)); deb.setMatrixAt(n++, _dm); }
    deb.count = n; deb.instanceMatrix.needsUpdate = true; }
  for (let i = dustP.length - 1; i >= 0; i--) { const sp = dustP[i], u = sp.userData; u.age += dt; if (u.age < 0) continue; const k = u.age / u.life; sp.scale.setScalar(2 + k * 9); sp.position.y = 1.2 + k * 3; sp.material.opacity = Math.min(0.55, u.age * 1.2) * (1 - k); if (k >= 1) { scene.remove(sp); sp.material.dispose(); dustP.splice(i, 1); } } }
function clearDebris() { debP.length = 0; if (deb) deb.count = 0; for (const sp of dustP) { scene.remove(sp); sp.material.dispose(); } dustP.length = 0; for (const o of townObjs) o.broke = false; }
function sinkTown(T, final) { for (const o of townObjs) { const q = final === undefined ? ease((T - o.delay) / o.dur) : final; o.m.position.y = -o.sink * q + (q > 0 && q < 1 ? Math.sin(T * 40 + o.delay * 9) * 0.03 : 0); o.m.rotation.set(o.tx * q, o.ry, o.tz * q); } }
function rumble() { audioInit(); if (!AU.ctx || Q.gain) return; const c = AU.ctx, len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0); let l = 0; for (let i = 0; i < len; i++) { l = (l + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3.5; }
  const src = c.createBufferSource(); src.buffer = buf; src.loop = true; const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 150; Q.gain = c.createGain(); Q.gain.gain.value = 0; src.connect(lp); lp.connect(Q.gain); Q.gain.connect(AU.master); src.start(); }
function setPhase(p) { Q.phase = p; Q.t = 0; }
function quakeIntro() { cue('sad'); if (!townReady || !tavernReady) { toast('The town is still loading.'); return; } closeJournal(); $('card').hidden = true; $('dialogue').hidden = true; $('goal').hidden = false;
  card('7 June 1692', ['Two years later. Lewis is now a merchant.', 'Next comes the great earthquake. It is loud, and it may be scary.'], [{ t: 'Begin', go: beginQuake }, { t: 'Read what happened instead', go: () => finishQuake(true) }]); }
function beginQuake() { hideCard(); rumble(); if (state.place !== 'out') setPlace('out'); resetWorld(); Q.on = true; setPhase('calm'); state.place = 'out'; state.x = 1; state.z = 0.6; state.yaw = -Math.PI / 2; state.pitch = 0; if (ring) ring.visible = false;
  npcShow(false); goalText = 'It is a hot morning. Walk to the harbour.'; showGoal(); toast('7 June 1692, late morning'); }
function resetWorld() { Q.abbaHit = Q.abbaTrip = false; clearDebris(); if (abba && abba.userData.anim) { const st = abba.userData.anim.get('JogStumble'); if (st) st.stop(); } if (Q.abbaRun || (runA && runA.isRunning()) || (abba && abba.userData.anim && abba.userData.anim.cur !== idle)) { Q.abbaRun = false; if (runA) runA.stop(); const ac = abba.userData.anim; if (ac && ac.cur !== idle) { ac.cur.stop(); ac.cur = idle; ac.timer = 0; } idle.reset().setEffectiveWeight(1).play(); } Q.ruin = false; Q.shake = 0; Q.T = 0; sinkTown(0, 0); seaLevel = -0.35; moveSpeed = 2.7; eyeY = 1.62; scene.fog.color.copy(HAZE); scene.fog.near = 70; scene.fog.far = 900; sky.material.color.set(0xffffff); $('vig').style.opacity = 0;
  const m = shipsM.merchant, sl = shipsM.sloop; m.position.set(SHORE + 17.5, -0.35, -5.9); m.rotation.set(0, 0, 0); sl.position.set(SHORE + 17.5, -0.35, 4.9); sl.rotation.set(0, Math.PI, 0);
  if (afterG) afterG.visible = false; if (yardG) yardG.visible = false; for (const p of streetProps) p.visible = true; npcShow(true); for (const o of townObjs) o.m.visible = true; shipsM.merchant.visible = shipsM.sloop.visible = true; Q.aTalk = false;
  if (Q.boat) Q.boat.visible = false; for (const d of Q.debris) d.visible = false; ABBA.x = -4.15; ABBA.z = -S + 1.45; abba.position.set(ABBA.x, 0.12, ABBA.z); abba.visible = true; if (Q.gain) Q.gain.gain.value = 0; }
function buildSeaProps() { if (Q.boat) return; const wood = new THREE.MeshStandardMaterial({ map: plankTex([96, 80, 62], 6, 3, 1), roughness: 0.9, side: THREE.DoubleSide }), tim = new THREE.MeshStandardMaterial({ map: plankTex([110, 86, 60], 3, 1, 1), roughness: 0.9 });
  const L = 5.2, Bm = 1.7, sh = new THREE.Shape(); sh.moveTo(-L / 2, -Bm * 0.36); sh.quadraticCurveTo(0, -Bm * 0.56, L * 0.3, -Bm * 0.4); sh.quadraticCurveTo(L * 0.45, -Bm * 0.2, L / 2, 0); sh.quadraticCurveTo(L * 0.45, Bm * 0.2, L * 0.3, Bm * 0.4); sh.quadraticCurveTo(0, Bm * 0.56, -L / 2, Bm * 0.36); sh.closePath();
  const hg = new THREE.ExtrudeGeometry(sh, { depth: 0.7, bevelEnabled: false, curveSegments: 8 }); hg.rotateX(-Math.PI / 2); const p = hg.attributes.position; for (let i = 0; i < p.count; i++) if (p.getY(i) < 0.3) { p.setZ(i, p.getZ(i) * 0.45); p.setX(i, p.getX(i) * 0.9); } hg.computeVertexNormals();
  const b = new THREE.Group(); scene.add(b); mk(hg, wood, 0, -0.3, 0, b); mk(new THREE.BoxGeometry(L * 0.86, 0.03, Bm * 0.78), tim, -0.1, 0.02, 0, b); for (const x of [-1.5, 1.2]) mk(new THREE.BoxGeometry(0.24, 0.04, Bm * 0.86), tim, x, 0.2, 0, b);
  const mark = mk(new THREE.OctahedronGeometry(0.28), new THREE.MeshBasicMaterial({ color: 0xd9a441 }), 0, 3.3, 0, b); b.userData.mark = mark; Q.boat = b;
  for (let i = 0; i < 12; i++) { const k = i % 3, d = mk(k === 0 ? new THREE.CylinderGeometry(0.3, 0.3, 0.9, 10) : k === 1 ? new THREE.BoxGeometry(0.7, 0.6, 0.7) : new THREE.BoxGeometry(2.6, 0.12, 0.3), tim, SHORE + 8 + ((i * 37) % 50), 0, 12 + ((i * 53) % 55)); if (k === 0) d.rotation.z = Math.PI / 2; d.rotation.y = i * 1.3; d.userData.ph = i * 1.7; Q.debris.push(d); } }
function abbaIdle() { if (!abba || !idle) return; if (runA) runA.stop(); const ac = abba.userData.anim; if (ac) { for (const n of ['JogStumble', 'StumbleBack', 'Terrified']) { const a = ac.get(n); if (a) a.stop(); } if (ac.cur !== idle) ac.cur.stop(); ac.cur = idle; ac.timer = 0; } idle.reset().setEffectiveWeight(1).fadeIn(0.2).play(); }
function toSea() { hideCard(); buildSeaProps(); Q.ruin = true; sinkTown(0, 1); seaLevel = 0.2; moveSpeed = 2.3; $('vig').style.opacity = 0; scene.fog.color.copy(DUST); scene.fog.near = 25; scene.fog.far = 320; sky.material.color.set(0xd9cdb4);
  const m = shipsM.merchant, sl = shipsM.sloop; m.position.set(SHORE + 19, -1.2, -7); m.rotation.set(0.42, 0.15, 0.05); sl.position.set(SHORE - 6, 0.5, 13); sl.rotation.set(-0.5, 2.2, 0.08);                 // one ship heeled over, one driven up into the town
  state.place = 'sea'; state.x = SHORE + 12; state.z = 22; Q.boat.position.set(SHORE + 20, seaLevel, 32); Q.boat.rotation.y = 0.6; Q.boat.visible = true; for (const d of Q.debris) d.visible = true;
  state.yaw = Math.atan2(-(Q.boat.position.x - state.x), -(Q.boat.position.z - state.z)); state.pitch = 0; ABBA.x = Q.boat.position.x; ABBA.z = Q.boat.position.z; abba.visible = true; Q.abbaRun = false; abbaIdle(); abba.rotation.y = Math.atan2(state.x - ABBA.x, state.z - ABBA.z); setPhase('sea');
  goalText = 'Swim to the boat with the gold marker!'; showGoal(); toast('A second shock throws you into the sea.'); }
function finishQuake(skipped) { for (const id of ['quake', 'sand', 'watch', 'tomb']) unlock(id); Q.shake = 0; if (Q.gain) Q.gain.gain.value = 0; Q.phase = 'end';
  card(skipped ? 'What happened' : 'Saved', skipped ? ['Just before noon, an earthquake shook Port Royal. The wet sand under the town turned to liquid, and most of the town sank into the sea.', 'Lewis Galdy was swallowed by the ground, thrown out into the sea by a second shock, and saved by a boat.', 'Four new pages are in your journal.']
    : ['Hands pull you over the side of the boat. You are alive.', 'Behind you, most of Port Royal is under the sea.', 'Four new pages are in your journal.'],
    [{ t: 'Go on: the days after', go: beginAfter }, { t: 'Play the earthquake again', go: beginQuake }, { t: 'Go back to 1690', go: leaveQuake }]); }
function leaveQuake() { hideCard(); resetWorld(); Q.on = false; state.place = 'out'; state.x = 17; state.z = 0.4; state.yaw = Math.PI / 2; state.pitch = 0; setGoal(); goalText = ''; setGoal(); }
function quakeTick(dt, time) { Q.t += dt; const t = Q.t;
  if (Q.phase === 'calm') { if (t > 9 || state.x > 9) { setPhase('tremor'); toast('Abba: \u201cDid you feel that?\u201d'); } }
  else if (Q.phase === 'tremor') { Q.shake = t < 2.6 ? 0.22 * Math.sin(t / 2.6 * Math.PI) : 0; if (abba.userData.anim && CL.Terrified && abba.userData.anim.cur === abba.userData.anim.base && t > 0.6) abba.userData.anim.play('Terrified'); if (t > 4.6) { setPhase('main'); goalText = 'Run! Get away from the houses!'; showGoal(); } }
  else if (Q.phase === 'main') { if (!Q.abbaHit && abba.visible && abba.userData.anim && CL.StumbleBack) { Q.abbaHit = true; abba.userData.anim.play('StumbleBack', true); } Q.shake = Math.min(1, t / 1.5); Q.T = t; sinkTown(t); const k = ease(t / 5); scene.fog.color.copy(HAZE).lerp(DUST, k); scene.fog.near = 70 - 62 * k; scene.fog.far = 900 - 830 * k; sky.material.color.set(0xffffff).lerp(DUST, k * 0.8);
    if (t > 2.5 && abba.visible && !Q.abbaRun) { toast('Abba: \u201cRun! To the boats!\u201d'); if (runA) { Q.abbaRun = true; ABBA.x = 9999; const ac = abba.userData.anim; (ac ? ac.cur : idle).fadeOut(0.25); runA.reset().fadeIn(0.25).play(); if (ac) { ac.cur = runA; ac.timer = 0; } } else abba.visible = false; }
    if (Q.abbaRun) { if (!Q.abbaTrip && abba.position.x > 6 && CL.JogStumble && abba.userData.anim) { Q.abbaTrip = true; const ac = abba.userData.anim, st = ac.get('JogStumble'); st.reset().setLoop(THREE.LoopOnce).fadeIn(0.15).play(); st.clampWhenFinished = false; runA.fadeOut(0.15); setTimeout(() => { if (Q.abbaRun) { runA.reset().fadeIn(0.2).play(); st.fadeOut(0.2); } }, (st.getClip().duration - 0.2) * 1000); } abba.rotation.y = Math.PI / 2 - 0.08; abba.position.x += 4.6 * dt; abba.position.z += 0.35 * dt; if (abba.position.x > SHORE + 4) { abba.visible = false; Q.abbaRun = false; } } if (t > 8.5) { setPhase('swallow'); goalText = 'The sand is pulling you down!'; showGoal(); } }
  else if (Q.phase === 'swallow') { Q.shake = 1; Q.T += dt; sinkTown(Q.T); const k = ease(t / 3.6); eyeY = 1.62 - 1.25 * k; moveSpeed = 2.7 * (1 - 0.9 * k); $('vig').style.opacity = k;
    if (t > 4 && $('card').hidden) { Q.shake = 0.3; card('Swallowed', ['The wet sand has gone soft, like mud. You sink up to your neck.', 'You cannot move. Then the ground shakes again!'], [{ t: 'Next', go: toSea }]); } }
  else if (Q.phase === 'sea') { Q.shake = t < 1.5 ? 0.6 * (1 - t / 1.5) : (Math.sin(time * 0.5) > 0.96 ? 0.25 : 0); eyeY = seaLevel + 0.32 + Math.sin(time * 1.6) * 0.07;
    const b = Q.boat; b.position.y = seaLevel + 0.12 + Math.sin(time * 1.2) * 0.06; b.rotation.z = Math.sin(time * 0.9) * 0.05; b.userData.mark.rotation.y = time * 1.5; abba.position.set(b.position.x - 0.3, b.position.y + 0.05, b.position.z);
    for (const d of Q.debris) { d.position.y = seaLevel + Math.sin(time * 1.1 + d.userData.ph) * 0.07; d.rotation.x = Math.sin(time * 0.7 + d.userData.ph) * 0.12; }
    { const dx = state.x - b.position.x, dz = state.z - b.position.z, d = Math.hypot(dx, dz); if (d > 2.6 && t > 1.5) { const v = Math.min(1.1, 0.25 + t * 0.05) * dt; b.position.x += dx / d * v; b.position.z += dz / d * v; b.rotation.y = Math.atan2(dx, dz) + Math.PI / 2; } }   /* Abba rows toward you, so you always get there */
    if (Math.hypot(state.x - b.position.x, state.z - b.position.z) < 2.8 && $('card').hidden) finishQuake(false); }
  if (Q.gain) Q.gain.gain.value = Math.min(1, Q.shake) * 0.9;
}
/* ---------- the days after, and the ending ---------- */
let afterG = null, yardG = null;
// camp layout: x, z, width, height, length, turn. Checked with a footprint test so tents, fire, rubble and Abba never overlap.
const CAMP_TENTS = [[-12.5, 0.8, 3.6, 3.0, 4.6, Math.PI / 2], [-7.6, -1.75, 2.4, 1.9, 2.7, 0.08], [-5.2, 1.8, 2.2, 1.8, 2.5, -0.1], [-16.0, -1.9, 2.2, 1.9, 2.8, 0]], FX = -9.8, FZ = -1.7;
function pushOut(nx, nz, cx, cz, hx, hz, ry) { const c = Math.cos(ry), s2 = Math.sin(ry), dx = nx - cx, dz = nz - cz, lx = dx * c - dz * s2, lz = dx * s2 + dz * c;
  if (Math.abs(lx) >= hx || Math.abs(lz) >= hz) return [nx, nz]; let ox = lx, oz = lz; if (hx - Math.abs(lx) < hz - Math.abs(lz)) ox = Math.sign(lx || 1) * hx; else oz = Math.sign(lz || 1) * hz;
  return [cx + ox * c + oz * s2, cz - ox * s2 + oz * c]; } const YX = -100, YZ = 70;
function brickM(rx, ry) { const t = sharedTex('brick', true).clone(); t.repeat.set(rx, ry); t.needsUpdate = true; return new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 }); }
function buildAfter() { if (afterG) return; afterG = new THREE.Group(); scene.add(afterG); cur = afterG;
  const canvasM = new THREE.MeshStandardMaterial({ map: noiseTex([206, 194, 166], 26, 3), roughness: 1, side: THREE.DoubleSide }), tim = new THREE.MeshStandardMaterial({ map: plankTex([92, 72, 52], 3, 1, 2), roughness: 0.95 }), sackM = new THREE.MeshStandardMaterial({ map: noiseTex([150, 130, 100], 30, 3), roughness: 1 }), iron = new THREE.MeshStandardMaterial({ color: 0x1c1c1e, roughness: 0.6, metalness: 0.7 });
  const tent = (x, z, w, h, len, ry) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; afterG.add(g); const sh = new THREE.Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(0, h); sh.lineTo(w / 2, 0);
    const geo = new THREE.ExtrudeGeometry(sh, { depth: len, bevelEnabled: false }); geo.translate(0, 0, -len / 2); const side = mk(geo, canvasM, 0, 0, 0, g); side.material = [new THREE.MeshBasicMaterial({ visible: false }), canvasM];
    const ridge = mk(new THREE.CylinderGeometry(0.04, 0.04, len + 0.5, 6), tim, 0, h, 0, g); ridge.rotation.x = Math.PI / 2; for (const s of [-1, 1]) mk(new THREE.CylinderGeometry(0.05, 0.05, h, 6), tim, 0, h / 2, s * len / 2, g);
    const back = new THREE.Shape(); back.moveTo(-w / 2, 0); back.lineTo(0, h); back.lineTo(w / 2, 0); back.closePath(); mk(new THREE.ShapeGeometry(back), canvasM, 0, 0, -len / 2, g); };
  for (const t of CAMP_TENTS) tent(t[0], t[1], t[2], t[3], t[4], t[5]);
  for (const [dx, dz, r] of [[-0.2, 0, 0.3], [0.15, 0.1, -0.5], [0, -0.15, 1.3]]) { const l = mk(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 7), tim, FX + dx, 0.08, FZ + dz); l.rotation.set(Math.PI / 2, 0, r); }
  mk(new THREE.ConeGeometry(0.2, 0.5, 7), new THREE.MeshBasicMaterial({ color: 0xff9a2e }), FX, 0.33, FZ); for (const s of [-1, 1]) { const p = mk(new THREE.CylinderGeometry(0.02, 0.02, 1.3, 5), iron, FX + s * 0.3, 0.6, FZ); p.rotation.z = s * 0.45; } const pot = mk(new THREE.SphereGeometry(0.16, 10, 8), iron, FX, 0.7, FZ); pot.scale.y = 0.8;
  for (const [x, z, s] of [[-11.4, -2.4, 1], [-12.3, -2.6, 0.85], [-6.4, -0.1, 0.85], [-3.2, 2.5, 1], [-13.6, -2.5, 1]]) { const k = mk(new THREE.SphereGeometry(0.3, 10, 8), sackM, x, 0.2 * s, z); k.scale.set(1.2 * s, 0.7 * s, 0.9 * s); }
  const bm = brickM(1.5, 0.5); for (const [x, z, w, h, r, d] of [[-2.0, -2.4, 2.2, 0.7, 0.15, 1.2], [-1.0, 2.4, 2.0, 0.9, -0.2, 1.2], [-15.9, 2.5, 1.8, 0.5, 0.1, 1.0]]) { const b = mk(new THREE.BoxGeometry(w, h, d), bm, x, h / 2 - 0.1, z); b.rotation.set(0.12, r, 0.1); }
  for (const [x, z, l, ry, rz] of [[-4.3, -2.9, 3.0, 0.15, 0.18], [-3.6, 0.2, 2.6, -1.25, 0.12], [-9.6, 2.8, 3.0, 0.05, 0.3], [-10.8, -2.9, 2.4, -0.05, 0.1]]) { const b = mk(new THREE.BoxGeometry(l, 0.2, 0.2), tim, x, 0.35, z); b.rotation.set(0, ry, rz); }
  const fl = mk(new THREE.PlaneGeometry(160, 160), seaMat, 81.2, 0.07, 0); fl.rotation.x = -Math.PI / 2; const wet = mk(new THREE.PlaneGeometry(3, 14), new THREE.MeshBasicMaterial({ color: 0x5f4e38, transparent: true, opacity: 0.4 }), -0.2, 0.012, 0); wet.rotation.x = -Math.PI / 2;
  placeHeath();
  /* where whole houses sank out of sight, only stubs of wall, a chimney top and beams are left above the sand */
  for (const o of townObjs) { if (o.sink < 12) continue; const p = o.m.position, side = p.z < 0 ? -1 : 1, rnd = (k) => Math.abs(Math.sin(p.x * 7.1 + k * 3.7));
    for (let i = 0; i < 3; i++) { const w = 1.2 + rnd(i) * 2.2, h = 0.35 + rnd(i + 4) * 0.9, wall = mk(new THREE.BoxGeometry(w, h, 0.36), bm, p.x - 2.2 + i * 2.1 + rnd(i + 9), h / 2 - 0.15, p.z - side * (1.2 + rnd(i + 2) * 3)); wall.rotation.set(rnd(i + 5) * 0.12, rnd(i + 6) * 0.5 - 0.25, (rnd(i + 7) - 0.5) * 0.2); }
    for (let i = 0; i < 2; i++) { const b = mk(new THREE.BoxGeometry(2.4 + rnd(i + 11), 0.18, 0.18), tim, p.x - 1 + i * 2.2, 0.25, p.z - side * (2 + rnd(i + 12) * 2)); b.rotation.set(0, rnd(i + 13) * 2, 0.15 + rnd(i + 14) * 0.25); }
    const pile = mk(new THREE.ConeGeometry(1.1 + rnd(20) * 0.6, 0.5, 9), bm, p.x + 1.5, 0.15, p.z - side * 1.8); pile.rotation.y = rnd(21) * 3; }
  for (const [x, z, ry, id, clip, tint] of EXTRA) { if (!people[id]) continue; const keep = people[id].userData.anim; delete people[id].userData.anim; const m = skClone(people[id]); people[id].userData.anim = keep;
    m.traverse((o) => { if (o.isMesh) { o.material = o.material.clone(); o.material.color.setRGB(...tint); } }); m.position.set(x, 0, z); m.rotation.y = ry; m.visible = true; afterG.add(m); animate(m, clip); grounded.push(m); }
  for (const [x, z, ry, id] of SURV) { if (!people[id]) continue; const keep = people[id].userData.anim; delete people[id].userData.anim; const m = skClone(people[id]); people[id].userData.anim = keep; m.traverse((o) => { if (o.isMesh) { o.material = o.material.clone(); o.material.color.setRGB(0.78, 0.74, 0.68); } }); m.visible = true; m.position.set(x, 0, z); m.rotation.y = ry; afterG.add(m); animate(m, id === 'sailor' ? 'Sad2' : id === 'kofi' ? 'Sad1' : (CL.SitDisbelief ? 'SitDisbelief' : 'Sad2')); survivors[id] = m; grounded.push(m); if (id === 'benning' && CL.SitDisbelief) { m.userData.sits = true; const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.45), new THREE.MeshStandardMaterial({ map: plankTex([132, 100, 70], 3, 1, 2), roughness: 0.9 })); seat.position.set(x - Math.sin(ry) * 0.18, 0.21, z - Math.cos(ry) * 0.18); seat.rotation.y = ry; afterG.add(seat); } }
  cur = scene; }
function placeHeath() { const m = people.heath; if (!m || !afterG || m.parent) return; grounded.push(m); m.position.set(HEATH.x, 0, HEATH.z); m.rotation.y = HEATH.ry; afterG.add(m); animate(m, 'Pray'); m.userData.ground = 0; }
function afterDone() { return state.unlocked.includes('tentp') && state.unlocked.includes('kingston'); }
function afterGoal() { goalText = !Q.aTalk ? 'Find Abba in the camp.' : afterDone() ? 'Go back to Abba.' : 'Look around: the big tent, and the edge of the water.'; showGoal(); }
function beginAfter() { cue('sad'); hideCard(); buildAfter(); buildSeaProps(); if (state.place !== 'out') setPlace('out'); resetWorld(); Q.on = true; Q.phase = 'after'; Q.ruin = true; sinkTown(0, 1); afterG.visible = true;
  const m = shipsM.merchant, sl = shipsM.sloop; m.position.set(SHORE + 19, -1.2, -7); m.rotation.set(0.42, 0.15, 0.05); sl.position.set(SHORE - 6, 0.5, 13); sl.rotation.set(-0.5, 2.2, 0.08);
  scene.fog.color.copy(DUST); scene.fog.near = 35; scene.fog.far = 420; sky.material.color.set(0xe2d8c2);
  state.place = 'after'; state.x = -1.6; state.z = 0; state.yaw = Math.PI / 2; state.pitch = 0; ABBA.x = -8.9; ABBA.z = 0.7; for (const p of streetProps) p.visible = false; abba.position.set(ABBA.x, 0, ABBA.z); abba.visible = true; if (ring) ring.visible = false;
  npcShow(false); afterGoal(); toast('Three days later'); }
function stayOrGo() { card('Stay, or go?', ['Your town is under the sea. Across the water, people are starting again.', 'What will you do?'],
  [{ t: 'Stay and build again', go: () => card('He stayed', ['The real Lewis Galdy stayed. He grew rich and helped build a new church.'], [{ t: 'Go to the church', go: toYard }]) },
   { t: 'Cross the harbour', go: () => card('Most people left', ['Most people crossed the water. Their new town became Kingston.', 'But the real Lewis Galdy stayed. He grew rich and helped build a new church.'], [{ t: 'Go to the church', go: toYard }]) }]); }
function buildYard() { if (yardG) return; yardG = new THREE.Group(); scene.add(yardG); cur = yardG;
  const stone = new THREE.MeshStandardMaterial({ map: noiseTex([176, 172, 160], 26, 2), roughness: 0.9 }), roofM = new THREE.MeshStandardMaterial({ map: noiseTex([96, 84, 74], 30, 6), roughness: 0.95 }), dark = new THREE.MeshStandardMaterial({ color: 0x1b1a18, roughness: 0.9 }), tim = new THREE.MeshStandardMaterial({ map: plankTex([84, 62, 44], 4, 1, 1), roughness: 0.9 });
  const gr = mk(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ map: noiseTex([126, 138, 92], 36, 10), roughness: 1 }), YX, 0.02, YZ - 4); gr.rotation.x = -Math.PI / 2;
  const wall = brickM(16, 2.4); for (const [x, z, w, d] of [[YX, YZ - 19, 30, 0.5], [YX, YZ + 11, 30, 0.5], [YX - 15, YZ - 4, 0.5, 30], [YX + 15, YZ - 4, 0.5, 30]]) { mk(new THREE.BoxGeometry(w, 2.6, d), wall, x, 1.3, z); mk(new THREE.BoxGeometry(w + 0.2, 0.14, d + 0.2), stone, x, 2.67, z); }
  /* St Peter's (1725): red brick, a plain gabled nave with round-headed windows, white stone dressings, and a squat west tower */
  const cx = YX - 4, cz = YZ - 6, nw = 8, nl = 15, nh = 6, white = new THREE.MeshStandardMaterial({ color: 0xe9e3d4, roughness: 0.85 }), glass = new THREE.MeshStandardMaterial({ color: 0x1d2328, roughness: 0.3, metalness: 0.3 });
  mk(new THREE.BoxGeometry(nw, nh, nl), brickM(8, 5.5), cx, nh / 2, cz); mk(new THREE.BoxGeometry(nw + 0.3, 0.45, nl + 0.3), stone, cx, 0.22, cz);       /* walls and plinth */
  mk(new THREE.BoxGeometry(nw + 0.35, 0.28, nl + 0.35), white, cx, nh - 0.1, cz);                                                                      /* cornice */
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) for (let y = 0.6; y < nh - 0.4; y += 0.62) mk(new THREE.BoxGeometry(y % 1.24 < 0.62 ? 0.62 : 0.42, 0.28, 0.12), white, cx + sx * (nw / 2 + 0.05) - sx * 0.2, y, cz + sz * (nl / 2 + 0.01)).rotation.y = 0; /* quoins */
  const archShape = (w, h) => { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h - w / 2); s.absarc(0, h - w / 2, w / 2, 0, Math.PI, false); s.lineTo(-w / 2, 0); return s; };
  const win = (x, y, z, ry, w, h) => { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; cur.add(g);
    const sur = archShape(w + 0.36, h + 0.18); sur.holes.push(archShape(w, h)); const so = new THREE.Mesh(new THREE.ExtrudeGeometry(sur, { depth: 0.08, bevelEnabled: false, curveSegments: 14 }), white); so.position.set(0, -0.09, 0); g.add(so);
    const gl = new THREE.Mesh(new THREE.ShapeGeometry(archShape(w, h), 14), glass); gl.position.z = -0.02; g.add(gl);
    for (const yy of [h * 0.33, h * 0.62]) { const bar = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, 0.03), white); bar.position.set(0, yy, 0.01); g.add(bar); } const mul = new THREE.Mesh(new THREE.BoxGeometry(0.04, h - w / 2, 0.03), white); mul.position.set(0, (h - w / 2) / 2, 0.01); g.add(mul);
    const key = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.34, 0.12), white); key.position.set(0, h + 0.06, 0.03); g.add(key); };
  for (const z of [-5, -1.7, 1.6]) for (const s of [-1, 1]) win(cx + s * (nw / 2 + 0.02), 1.5, cz + z, s * Math.PI / 2, 1.3, 3.2);
  const a = Math.atan2(3.2, nw / 2), sl = Math.hypot(nw / 2, 3.2) + 0.4; for (const s of [-1, 1]) { const r = mk(new THREE.BoxGeometry(sl, 0.14, nl + 0.6), roofM, cx + s * (nw / 4 + 0.1), nh + 1.55, cz); r.rotation.z = -s * a; }
  for (const s of [-1, 1]) { const sh = new THREE.Shape(); sh.moveTo(-nw / 2, 0); sh.lineTo(0, 3.2); sh.lineTo(nw / 2, 0); sh.closePath(); const gm = mk(new THREE.ShapeGeometry(sh), brickM(0.25, 0.3), cx, nh, cz + s * nl / 2 + s * 0.01); gm.material.side = THREE.DoubleSide; }
  const ocu = mk(new THREE.TorusGeometry(0.55, 0.12, 8, 24), white, cx, nh + 1.25, cz - nl / 2 - 0.05); mk(new THREE.CircleGeometry(0.55, 24), glass, cx, nh + 1.25, cz - nl / 2 - 0.03).rotation.y = Math.PI; /* round window in the east gable */
  win(cx, 1.6, cz - nl / 2 - 0.02, Math.PI, 1.8, 3.6);                                                                                              /* east window over the altar */
  /* west tower: three stages with white bands, a belfry with arched openings, and a small cupola */
  const tw = 4.2, tz = cz + nl / 2 + tw / 2 - 0.2, th = 10;
  mk(new THREE.BoxGeometry(tw, th, tw), brickM(4.2, 9.5), cx, th / 2, tz); for (const y of [0.22, 4.2, 7.4]) mk(new THREE.BoxGeometry(tw + 0.2, y < 1 ? 0.45 : 0.22, tw + 0.2), y < 1 ? stone : white, cx, y, tz);
  for (const [sx, sz, ry] of [[0, 1, 0], [0, -1, Math.PI], [1, 0, Math.PI / 2], [-1, 0, -Math.PI / 2]]) { if (sz !== -1) win(cx + sx * (tw / 2 + 0.02), 8.0, tz + sz * (tw / 2 + 0.02), ry, 1.0, 1.6); if (sz === 1) win(cx, 4.8, tz + tw / 2 + 0.02, 0, 0.8, 1.6); }
  mk(new THREE.BoxGeometry(tw + 0.45, 0.32, tw + 0.45), white, cx, th + 0.1, tz); for (const sx of [-1, 1]) for (const sz of [-1, 1]) mk(new THREE.BoxGeometry(0.42, 0.75, 0.42), white, cx + sx * (tw / 2 - 0.05), th + 0.6, tz + sz * (tw / 2 - 0.05));
  const cup = new THREE.Group(); cup.position.set(cx, th + 0.26, tz); cur.add(cup); for (let i = 0; i < 8; i++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.3, 0.12), white); const an = i / 8 * Math.PI * 2; p.position.set(Math.cos(an) * 0.75, 0.65, Math.sin(an) * 0.75); cup.add(p); }
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.95, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x5f6a66, roughness: 0.6, metalness: 0.4 })); dome.position.y = 1.3; cup.add(dome);
  const vane = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 6), dark); vane.position.y = 2.6; cup.add(vane); const cr = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.05), dark); cr.position.y = 2.75; cup.add(cr);
  const dg = new THREE.Group(); dg.position.set(cx, 0, tz + tw / 2 + 0.03); cur.add(dg); const dsur = archShape(2.0, 3.0); dsur.holes.push(archShape(1.5, 2.75)); dg.add(new THREE.Mesh(new THREE.ExtrudeGeometry(dsur, { depth: 0.1, bevelEnabled: false, curveSegments: 14 }), white));
  const door = new THREE.Mesh(new THREE.ShapeGeometry(archShape(1.5, 2.75), 14), tim); door.position.z = -0.01; dg.add(door);
  const tx = YX + 6, tzz = YZ - 2; mk(new THREE.BoxGeometry(1.2, 0.2, 2.5), stone, tx, 0.1, tzz); mk(new THREE.BoxGeometry(1.0, 0.7, 2.3), brickM(2.3, 0.7), tx, 0.55, tzz);
  const ins = cv(512, 1024, (x) => { x.fillStyle = '#c9c5b8'; x.fillRect(0, 0, 512, 1024); for (let i = 0; i < 2500; i++) { x.fillStyle = `rgba(${90 + Math.random() * 60 | 0},${88 + Math.random() * 50 | 0},80,${Math.random() * 0.12})`; x.fillRect(Math.random() * 512, Math.random() * 1024, 2 + Math.random() * 6, 2 + Math.random() * 6); }
    x.strokeStyle = 'rgba(70,66,58,0.7)'; x.lineWidth = 3; x.strokeRect(22, 22, 468, 980);
    x.fillStyle = 'rgba(60,56,50,0.85)'; x.beginPath(); x.arc(256, 112, 58, 0, 7); x.lineWidth = 5; x.stroke(); x.font = '600 26px Georgia, serif'; x.textAlign = 'center'; x.fillText('L G', 256, 122);
    const lines = ['Here Lyes the Body of', 'LEWIS GALDY Esq.', 'who departed this Life at', 'Port Royal the 22d December 1739', 'Aged 80.', 'He was Born at Montpelier in France', 'but left that Country for his Religion', 'and came to settle in this Island', 'where he was swallowed up', 'in the Great Earthquake in the Year 1692', 'and By the Providence of God', 'was by another Shock thrown into the Sea', 'and Miraculously saved by swimming', 'until a Boat took him up.', 'He lived many Years after', 'in great Reputation,', 'Beloved by all that knew him', 'and much Lamented at his Death.'];
    let y = 214; for (const l of lines) { const big = l.startsWith('LEWIS'); x.font = (big ? '700 31px' : 'italic 21px') + ' Georgia, serif'; x.fillStyle = 'rgba(255,255,255,0.35)'; x.fillText(l, 257, y + 1.5); x.fillStyle = 'rgba(48,44,38,0.92)'; x.fillText(l, 256, y); y += big ? 46 : 41; } });
  ins.wrapS = ins.wrapT = THREE.ClampToEdgeWrapping;
  const slab = mk(new THREE.BoxGeometry(1.25, 0.12, 2.55), [stone, stone, new THREE.MeshStandardMaterial({ map: ins, roughness: 0.85 }), stone, stone, stone], tx, 0.96, tzz);
  const rg = mk(new THREE.RingGeometry(1.75, 1.9, 40), new THREE.MeshBasicMaterial({ color: 0xd9a441, side: THREE.DoubleSide }), tx, 0.05, tzz); rg.rotation.x = -Math.PI / 2;
  for (const [x, z] of [[YX + 3, YZ - 9], [YX + 9.5, YZ - 7], [YX + 1.5, YZ + 3]]) { mk(new THREE.BoxGeometry(0.7, 1.0, 0.14), stone, x, 0.5, z).rotation.z = 0.06; }
  const leaf = new THREE.MeshStandardMaterial({ color: 0x4f7a3c, roughness: 0.9, side: THREE.DoubleSide }), trunk = new THREE.MeshStandardMaterial({ map: noiseTex([120, 100, 78], 30, 2), roughness: 1 });
  for (const [x, z, h] of [[YX + 11, YZ - 13, 7], [YX + 12, YZ + 6, 6], [YX - 12, YZ + 7, 7.5]]) { const t = mk(new THREE.CylinderGeometry(0.16, 0.24, h, 8), trunk, x, h / 2, z); t.rotation.z = 0.06; for (let i = 0; i < 9; i++) { const f = mk(new THREE.PlaneGeometry(0.7, 3.4), leaf, x + 0.3, h, z); f.geometry.translate(0, 1.7, 0); f.rotation.set(1.15 + (i % 3) * 0.18, i * 0.7, 0, 'YXZ'); } }
  cur = scene; }
function toYard() { hideCard(); if (state.place !== 'out') setPlace('out'); state.ch.after = true; saveGame(); buildYard(); resetWorld(); Q.on = true; Q.phase = 'yard'; for (const o of townObjs) o.m.visible = false; shipsM.merchant.visible = shipsM.sloop.visible = false; abba.visible = false; npcShow(false); yardG.visible = true;
  state.place = 'yard'; state.x = YX + 11; state.z = YZ + 3.5; state.yaw = 0.95; state.pitch = 0.06; ABBA.x = 9999; goalText = 'Find the tomb beside the church.'; showGoal(); toast('St Peter\u2019s Church, Port Royal'); }
function readStone() { card('Here lies Lewis Galdy', ['\u201cHere Lyes the Body of LEWIS GALDY Esq. who departed this Life at Port Royal the 22d December 1739, Aged 80.', 'He was Born at Montpelier in France, but left that Country for his Religion, and came to settle in this Island, where he was swallowed up in the Great Earthquake in the Year 1692,', 'and By the Providence of God was by another Shock thrown into the Sea, and Miraculously saved by swimming until a Boat took him up.', 'He lived many Years after in great Reputation, Beloved by all that knew him, and much Lamented at his Death.\u201d'], [{ t: 'Go on', go: endStory }]); }
function endStory() { cue('end'); unlock('fortune'); unlock('stone'); card('The end of the story', ['Lewis Galdy lived 47 more years.', 'His stone does not say what he sold to get rich. Abba would tell it another way.', 'Two new pages are in your journal.'],
  [{ t: 'Read the journal', go: () => { hideCard(); openJournal(); } }, { t: 'Credits', go: () => { hideCard(); $('credits').hidden = false; } }, { t: 'Go back to 1690', go: leaveQuake }]); }
/* ---------- 1691: the warehouse ---------- */
let wareG = null, wLamp = null; const WX0 = -262, WX1 = -248, W = { coins: false, talked: false }, wareMark = {}, WGOODS = { sugar: [-259.5, -2.6], cocoa: [-254.6, -2.9], logwood: [-250.4, -2.9] };
function wareSeen() { return ['sugar', 'cocoa', 'logwood'].every((k) => state.unlocked.includes(k)); }
function wareGoal() { goalText = !wareSeen() ? 'Check today\u2019s cargo: the casks, the sacks and the red wood.' : !W.coins ? 'Sit at your desk and serve a customer.' : !W.talked ? 'Abba is at the door. Talk to her.' : 'Read the letter on your desk.'; showGoal(); }
function buildWare() { if (wareG) return; wareG = new THREE.Group(); wareG.visible = false; scene.add(wareG); cur = wareG;
  const B = (w, h, d, m, x, y, z, p) => mk(new THREE.BoxGeometry(w, h, d), m, x, y, z, p), std = (map, r) => new THREE.MeshStandardMaterial({ map, roughness: r === undefined ? 0.9 : r });
  const oak = std(plankTex([104, 76, 50], 4, 1, 1)), dark = new THREE.MeshStandardMaterial({ color: 0x3a2a1d, roughness: 0.95 }), board = std(plankTex([122, 92, 62], 5, 1, 1), 0.8), iron = new THREE.MeshStandardMaterial({ color: 0x1c1c1e, roughness: 0.6, metalness: 0.7 }), brass = new THREE.MeshStandardMaterial({ color: 0xb08a3a, roughness: 0.4, metalness: 0.8 }), silver = new THREE.MeshStandardMaterial({ color: 0xb9bbb8, roughness: 0.4, metalness: 0.85 });
  const sackM = new THREE.MeshStandardMaterial({ map: noiseTex([150, 126, 92], 30, 3), roughness: 1 }), paper = new THREE.MeshStandardMaterial({ color: 0xe6dcc0, roughness: 0.9 });
  const cx = (WX0 + WX1) / 2, Wd = WX1 - WX0, D = 10, H = 3.8;
  mk(new THREE.PlaneGeometry(Wd, D), brickM(7, 5), cx, 0, 0).rotation.x = -Math.PI / 2; mk(new THREE.PlaneGeometry(Wd, D), std(plankTex([70, 52, 38], 8, 4, 3)), cx, H, 0).rotation.x = Math.PI / 2;
  mk(new THREE.PlaneGeometry(Wd, H), brickM(14, 4), cx, H / 2, -5); mk(new THREE.PlaneGeometry(Wd, H), brickM(14, 4), cx, H / 2, 5).rotation.y = Math.PI; mk(new THREE.PlaneGeometry(D, H), brickM(10, 4), WX0, H / 2, 0).rotation.y = Math.PI / 2; for (const [w, z, h, y] of [[4.1, -2.95, H, H / 2], [2.5, 3.75, H, H / 2], [3.4, 0.8, H - 3.0, 3.0 + (H - 3.0) / 2]]) mk(new THREE.PlaneGeometry(w, h), brickM(w, h), WX1, y, z).rotation.y = -Math.PI / 2;
  for (let x = WX0 + 1; x < WX1; x += 2) B(0.22, 0.26, D, dark, x, H - 0.13, 0); for (const z of [-2.2, 2.2]) for (const x of [WX0 + 4.6, WX1 - 4.6]) B(0.28, H, 0.28, dark, x, H / 2, z);
  // wide doors standing open to the wharf, and a high window
  // the doorway: hinged doors swung inward, a strip of wharf outside, and the harbour beyond
  for (const s2 of [-1, 1]) { const hinge = new THREE.Group(); hinge.position.set(WX1 - 0.05, 0, 0.8 + s2 * 1.7); hinge.rotation.y = s2 * 1.48; wareG.add(hinge); B(0.07, 3.0, 1.7, oak, 0, 1.5, -s2 * 0.85, hinge); for (const y of [0.5, 2.5]) B(0.02, 0.06, 1.2, iron, -0.045, y, -s2 * 0.75, hinge); }
  for (const z of [-0.95, 2.55]) B(0.2, 3.0, 0.15, dark, WX1 - 0.05, 1.5, z); B(0.25, 0.25, 3.8, dark, WX1 - 0.05, 3.1, 0.8);
  const ext = new THREE.Group(); wareG.add(ext); { const deck = std(plankTex([150, 132, 106], 6, 4, 2)), tim = std(plankTex([84, 66, 48], 3, 1, 2)), Bx = (w, h, d, m, x, y, z) => mk(new THREE.BoxGeometry(w, h, d), m, x, y, z, ext);
    Bx(7, 0.1, 30, deck, WX1 + 3.5, -0.05, 0.8); Bx(0.25, 0.3, 30, tim, WX1 + 7, -0.15, 0.8);                      /* the wharf: deck and its edge beam */
    for (let z = -13; z <= 15; z += 2.4) { mk(new THREE.CylinderGeometry(0.16, 0.18, 2.2, 9), tim, WX1 + 7.05, -0.9, z, ext); if (Math.abs(z - 0.8) > 2 && Math.round(z) % 2 === 0) mk(new THREE.CylinderGeometry(0.13, 0.15, 0.55, 9), tim, WX1 + 6.6, 0.27, z, ext); }
    for (const [x, z] of [[WX1 + 2.2, -3.4], [WX1 + 2.9, -2.6], [WX1 + 1.9, 5.2]]) mk(new THREE.CylinderGeometry(0.34, 0.34, 0.85, 14), tim, x, 0.42, z, ext);
    const lagoon = mk(new THREE.PlaneGeometry(400, 400), seaMat, WX1 + 207, -0.45, 0.8, ext); lagoon.rotation.x = -Math.PI / 2;
    if (shipsM.sloop) { const sl = shipsM.sloop.clone(); sl.position.set(WX1 + 17, -0.35, 1.5); sl.rotation.y = Math.PI / 2; sl.visible = true; sl.traverse((o) => { if (o.isMesh && o.material && o.material.isMeshStandardMaterial) { o.material = o.material.clone(); o.material.emissive.set(0xffffff); o.material.emissiveMap = o.material.map; o.material.emissiveIntensity = 0.55; } }); ext.add(sl); } }   /* daylight outside: the inside lamps don't reach it */
  const pool = mk(new THREE.PlaneGeometry(4.5, 3.2), new THREE.MeshBasicMaterial({ color: 0xfff2cf, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }), WX1 - 2.6, 0.012, 0.8); pool.rotation.x = -Math.PI / 2;
  mk(new THREE.PlaneGeometry(1.4, 0.9), new THREE.MeshBasicMaterial({ color: 0xdfe9e2 }), cx - 2, 2.9, 4.99).rotation.y = Math.PI; for (const dx of [-0.35, 0, 0.35]) B(0.04, 0.9, 0.04, iron, cx - 2 + dx, 2.9, 4.96);
  // sugar hogsheads
  const hogG = new THREE.LatheGeometry([[0, -0.6], [0.4, -0.6], [0.48, -0.32], [0.52, 0], [0.48, 0.32], [0.4, 0.6], [0, 0.6]].map(([a, b]) => new THREE.Vector2(a, b)), 16), caskM = std(plankTex([126, 94, 58], 10, 2, 1), 0.8);
  const hog = (x, y, z) => { const g = new THREE.Group(); g.position.set(x, y + 0.6, z); wareG.add(g); mk(hogG, caskM, 0, 0, 0, g); for (const [hy, r] of [[-0.5, 0.435], [-0.25, 0.497], [0.25, 0.497], [0.5, 0.435]]) mk(new THREE.CylinderGeometry(r, r, 0.045, 16, 1, true), iron, 0, hy, 0, g); };
  for (let i = 0; i < 3; i++) { hog(-261.2 + i * 1.1, 0, -4.2); hog(-260.65 + i * 1.1, 0, -3.15); } hog(-260.65, 1.2, -4.0); hog(-259.55, 1.2, -4.0);
  // cocoa sacks, cotton bales, logwood
  let n = 0; for (const [x, y, z] of [[-255.4, 0, -4.2], [-254.5, 0, -4.3], [-253.6, 0, -4.2], [-255.0, 0, -3.5], [-254.0, 0, -3.5], [-255.0, 0.42, -4.1], [-254.1, 0.42, -4.15], [-254.5, 0.8, -4.1], [-253.3, 0, -3.4]]) { const k = mk(new THREE.SphereGeometry(0.42, 10, 8), sackM, x, y + 0.26, z); k.scale.set(1.15, 0.62, 0.85); k.rotation.y = (n++) * 0.7; }
  const bale = new THREE.MeshStandardMaterial({ map: noiseTex([214, 208, 192], 22, 2), roughness: 1 }); for (const [x, y, z] of [[-256.9, 0, -4.3], [-256.9, 0.8, -4.3], [-257.9, 0, -4.3]]) { B(0.9, 0.78, 1.1, bale, x, y + 0.4, z); for (const dz of [-0.3, 0.3]) B(0.93, 0.81, 0.04, sackM, x, y + 0.4, z + dz); }
  const lw = new THREE.MeshStandardMaterial({ map: noiseTex([118, 44, 40], 34, 2), roughness: 0.9 }); for (let r = 0; r < 4; r++) for (let i = 0; i < 6 - r; i++) { const l = mk(new THREE.CylinderGeometry(0.14, 0.15, 1.7, 7), lw, -251.6 + i * 0.3 + r * 0.15, 0.15 + r * 0.26, -4.0); l.rotation.x = Math.PI / 2; l.rotation.z = (((i * 7 + r) % 5) - 2) * 0.03; }
  for (const [x, z, sz, r] of [[-249.2, 3.6, 0.9, 0.2], [-250.45, 4.05, 0.7, 0.35], [-249.3, 3.7, 0.6, 0.9]]) { const c = B(sz, sz, sz, board, x, sz / 2 + (r > 0.8 ? 0.9 : 0), z); c.rotation.y = r; }
  const rope = mk(new THREE.TorusGeometry(0.32, 0.05, 6, 16), sackM, -252.5, 1.9, -4.93); B(0.05, 0.05, 0.2, iron, -252.5, 2.2, -4.9);
  // the counting desk: ledger, scale, coins, candle, letter, strongbox
  const dx = -258.6, dz = 2.9; B(2.0, 0.07, 1.0, board, dx, 0.9, dz); for (const sx of [-1, 1]) for (const sz of [-1, 1]) B(0.08, 0.88, 0.08, oak, dx + sx * 0.9, 0.44, dz + sz * 0.42); B(1.9, 0.5, 0.05, oak, dx, 0.6, dz + 0.45);
  const led = cv(256, 160, (x) => { x.fillStyle = '#e9dfc4'; x.fillRect(0, 0, 256, 160); x.strokeStyle = '#8a7a5c'; x.beginPath(); x.moveTo(128, 0); x.lineTo(128, 160); x.stroke(); x.strokeStyle = '#3a3026'; x.lineWidth = 1.3; for (let p = 0; p < 2; p++) for (let i = 0; i < 12; i++) { x.beginPath(); x.moveTo(14 + p * 128, 16 + i * 12); x.lineTo(70 + p * 128 + (i * 37 % 30), 16 + i * 12); x.stroke(); x.beginPath(); x.moveTo(98 + p * 128, 16 + i * 12); x.lineTo(116 + p * 128, 16 + i * 12); x.stroke(); } }); led.wrapS = led.wrapT = THREE.ClampToEdgeWrapping;
  B(0.72, 0.05, 0.46, [oak, oak, new THREE.MeshStandardMaterial({ map: led, roughness: 0.9 }), oak, oak, oak], dx - 0.35, 0.96, dz - 0.05);
  mk(new THREE.CylinderGeometry(0.09, 0.11, 0.02, 12), brass, dx + 0.45, 0.945, dz - 0.15); mk(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 6), brass, dx + 0.45, 1.15, dz - 0.15); const beam = mk(new THREE.CylinderGeometry(0.008, 0.008, 0.5, 6), brass, dx + 0.45, 1.35, dz - 0.15); beam.rotation.z = Math.PI / 2 + 0.08;
  for (const s of [-1, 1]) { mk(new THREE.CylinderGeometry(0.08, 0.06, 0.015, 12), brass, dx + 0.45 + s * 0.24, 1.14 - s * 0.02, dz - 0.15); mk(new THREE.CylinderGeometry(0.003, 0.003, 0.2, 4), brass, dx + 0.45 + s * 0.24, 1.25 - s * 0.02, dz - 0.15); }
  for (const [ox, oz, k] of [[0.75, 0.1, 5], [0.84, 0.16, 3], [0.7, 0.22, 1], [0.21, -0.14, 1]]) mk(new THREE.CylinderGeometry(0.019, 0.019, 0.005 * k, 10), silver, dx + ox, 0.937 + 0.0025 * k + (ox < 0.3 ? 0.21 : 0), dz + oz);
  mk(new THREE.CylinderGeometry(0.07, 0.055, 0.015, 12), brass, dx - 0.85, 0.943, dz + 0.3); mk(new THREE.CylinderGeometry(0.011, 0.011, 0.13, 6), paper, dx - 0.85, 1.02, dz + 0.3); const fl = mk(new THREE.SphereGeometry(0.016, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffc66a }), dx - 0.85, 1.1, dz + 0.3); fl.scale.y = 1.9;
  const lt = B(0.24, 0.004, 0.17, paper, dx + 0.1, 0.938, dz + 0.25); lt.rotation.y = 0.3; mk(new THREE.CylinderGeometry(0.018, 0.018, 0.006, 10), new THREE.MeshStandardMaterial({ color: 0x9c1f1f, roughness: 0.5 }), dx + 0.1, 0.943, dz + 0.25);
  const qp = mk(new THREE.ConeGeometry(0.012, 0.3, 5), paper, dx - 0.05, 1.02, dz - 0.2); qp.rotation.z = 0.5; mk(new THREE.CylinderGeometry(0.03, 0.035, 0.05, 8), iron, dx - 0.12, 0.96, dz - 0.25);
  B(0.4, 0.04, 0.3, board, dx, 0.5, dz + 1.0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) B(0.04, 0.5, 0.04, oak, dx + sx * 0.16, 0.25, dz + 1.0 + sz * 0.11);
  B(0.9, 0.55, 0.55, dark, -261.3, 0.275, 3.9); for (const ox of [-0.3, 0, 0.3]) B(0.05, 0.57, 0.57, iron, -261.3 + ox, 0.275, 3.9); B(0.1, 0.12, 0.03, brass, -261.3, 0.35, 3.61);
  for (const y of [1.3, 1.9]) B(2.2, 0.04, 0.3, oak, -259, y, 4.83); for (let i = 0; i < 7; i++) B(0.09 + (i % 3) * 0.02, 0.3, 0.22, i % 2 ? oak : dark, -259.9 + i * 0.13, 1.47, 4.83); for (let i = 0; i < 4; i++) mk(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 10), paper, -258.6 + i * 0.2, 2.02, 4.83);
  { const lx = -256, lz = 0.6, ly = H - 1.0; B(0.012, 0.6, 0.012, iron, lx, ly + 0.45, lz); B(0.18, 0.02, 0.18, iron, lx, ly + 0.17, lz); B(0.18, 0.02, 0.18, iron, lx, ly - 0.13, lz); B(0.14, 0.26, 0.14, new THREE.MeshBasicMaterial({ color: 0xffd58a, transparent: true, opacity: 0.55 }), lx, ly + 0.02, lz); wLamp = new THREE.PointLight(0xffd9a0, 0, 14, 1.4); wLamp.position.set(lx, ly, lz); scene.add(wLamp); }
  for (const k in WGOODS) { const r = mk(new THREE.RingGeometry(0.75, 0.86, 36), new THREE.MeshBasicMaterial({ color: 0xd9a441, side: THREE.DoubleSide }), WGOODS[k][0], 0.02, WGOODS[k][1] + 0.9); r.rotation.x = -Math.PI / 2; wareMark[k] = r; if (state.unlocked.includes(k)) r.visible = false; }
  cur = scene; }
function wareIntro() { cue('begin'); if (!townReady || !tavernReady) { toast('The town is still loading.'); return; } closeJournal(); $('dialogue').hidden = true; $('goal').hidden = false;
  card('1691', ['One year later. Lewis has his own warehouse by the wharf.', 'Ships bring goods. He sells them. That is how merchants get rich.'], [{ t: 'Begin', go: beginWare }, { t: 'Not now', go: hideCard }]); }
function beginWare() { hideCard(); if (Q.on) { resetWorld(); Q.on = false; } buildWare(); W.coins = W.talked = false; setPlace('ware'); state.x = -249.0; state.z = -0.4; state.yaw = Math.PI / 2 - 0.12; state.pitch = 0; wareGoal(); }
function readLetter() { card('The letter', ['“Mr Galdy, let us sell enslaved people to Spanish buyers. We will both get rich.”', 'It is from the captain of a slave ship.'],
  [{ t: 'Say yes', go: () => wareEnd('You said yes', ['In later years, the real Lewis Galdy made this choice. It made him rich.', 'The people who were sold had no choice at all.']) },
   { t: 'Say no', go: () => wareEnd('You said no', ['That was the right thing to do.', 'In later years, the real Lewis Galdy said yes. It made him rich. The people who were sold had no choice at all.']) }]); }
function wareEnd(title, paras) { state.ch.ware = true; saveGame(); card(title, paras, [{ t: 'Go on to 7 June 1692', go: quakeIntro }, { t: 'Go back to 1690', go: leaveWare }]); }
function leaveWare() { hideCard(); setPlace('out'); state.x = 17; state.z = 0.4; state.yaw = Math.PI / 2; state.pitch = 0; goalText = ''; setGoal(); }


/* ---------- loop ---------- */
function resize() { const w = canvas.clientWidth, h = canvas.clientHeight; if (canvas.width !== Math.floor(w * renderer.getPixelRatio()) || canvas.height !== Math.floor(h * renderer.getPixelRatio())) { renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); } }
let tavernReady = false; let last = performance.now(), bob = 0, built = false, headYaw = 0, faceAmt = 0, restQ = null, frameN = 0; const animQ = new Map(); const _q = new THREE.Quaternion(), _e = new THREE.Euler();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now; resize();
  if (state.started && !busy) {
    let f = 0, r = 0; if (keys.has('w') || keys.has('arrowup')) f += 1; if (keys.has('s') || keys.has('arrowdown')) f -= 1; if (keys.has('d')) r += 1; if (keys.has('a')) r -= 1;
    const turnT = (keys.has('arrowleft') ? 1 : 0) - (keys.has('arrowright') ? 1 : 0); MV.turn += (turnT * 1.9 - MV.turn) * Math.min(1, dt * 8); state.yaw += MV.turn * dt;   /* turning eases in and out */
    f -= stick.y; r += stick.x; const pad = padRead(dt); if (pad) { f += pad.f; r += pad.r; state.yaw -= pad.lx * 2.3 * dt; state.pitch = Math.max(-0.9, Math.min(0.9, state.pitch - pad.ly * 1.6 * dt)); } if (f || r) MV.tap = null;
    if (MV.tap) { const dx = MV.tap[0] - state.x, dz = MV.tap[1] - state.z, d = Math.hypot(dx, dz); if (d < 0.35) MV.tap = null; else { const want = Math.atan2(-dx, -dz); let e = want - state.yaw; e = Math.atan2(Math.sin(e), Math.cos(e)); state.yaw += e * Math.min(1, dt * 5); f = Math.min(1, d / 0.8) * Math.max(0, Math.cos(e)); } }   /* tap the ground to walk there */
    const l = Math.hypot(f, r); if (l > 1) { f /= l; r /= l; }
    const hurry = (keys.has('shift') || (pad && pad.hurry)) && state.place !== 'sea' && !FB.on ? 1.45 : 1;
    const top = (third && galdy && galdy.visible && state.place !== 'sea' ? Math.min(moveSpeed, 1.75) : moveSpeed) * hurry, sy = Math.sin(state.yaw), cy = Math.cos(state.yaw);
    const tvx = (-sy * f + cy * r) * top, tvz = (-cy * f - sy * r) * top, acc = (f || r) ? 9 : 12; MV.vx += (tvx - MV.vx) * Math.min(1, dt * acc); MV.vz += (tvz - MV.vz) * Math.min(1, dt * acc);   /* ease into and out of a walk */
    if (Math.hypot(MV.vx, MV.vz) < 0.02) { MV.vx = MV.vz = 0; }
    const tx = state.x + MV.vx * dt, tz = state.z + MV.vz * dt; let [nx, nz] = clampPos(tx, tz);
    if ((MV.vx || MV.vz) && Math.hypot(nx - tx, nz - tz) > 1e-4) { const [ax, az] = clampPos(tx, state.z), [bx, bz] = clampPos(state.x, tz); const da = Math.hypot(ax - state.x, az - state.z), db = Math.hypot(bx - state.x, bz - state.z), dn = Math.hypot(nx - state.x, nz - state.z);   /* slide along walls instead of stopping dead */
      if (da > dn && da >= db) { nx = ax; nz = az; } else if (db > dn) { nx = bx; nz = bz; } if (MV.tap && Math.max(da, db, dn) < 0.002) MV.tap = null; }
    if (l > 0.05 && !reduceMotion) bob += dt * 8.5 * Math.min(1, l); stepDist += Math.hypot(nx - state.x, nz - state.z); if (nx !== state.x || nz !== state.z) lastStep = performance.now(); if (stepDist > 1.35) { stepDist = 0; footstep(); } state.x = nx; state.z = nz;
  } else if (!state.started) { state.yaw = Math.PI / 2 - 0.12 + Math.sin(now / 5200) * 0.14; padRead(dt); }
  if (busy) { MV.vx = MV.vz = MV.turn = 0; MV.tap = null; padRead(dt); }   /* no drifting off after a conversation */
  camLift += (groundY(state.x, state.z) - camLift) * Math.min(1, dt * 10);
  ftAvg += (dt * 1000 - ftAvg) * 0.05; ftT += dt; if (ftT > 3 && state.started) { ftT = 0; if (ftAvg > 26 && pxr > 0.8) { pxr = Math.max(0.8, pxr - 0.2); renderer.setPixelRatio(pxr); } }
  if (Q.on) { quakeTick(dt, now / 1000); debrisTick(dt); } const sh = Q.shake * (reduceMotion ? 0.15 : 1), tt = now / 1000;
  if (galdy) { const show = third && state.started && !(Q.on && (Q.phase === 'swallow')); galdy.visible = show; if (show) { galdy.position.set(state.x, state.place === 'sea' ? seaLevel - 1.32 : groundY(state.x, state.z), state.z); galdy.rotation.y = state.yaw + Math.PI;
      const moving = stepDist > 0 && performance.now() - lastStep < 250, ac = galdy.userData.anim; if (ac && state.place === 'sea') { if (CL.Tread && ac.cur !== ac.get('Tread')) ac.play('Tread'); gWalk = null; } else if (ac && moving !== gWalk) { gWalk = moving; if (moving) ac.play(CL.Walk ? 'Walk' : null); else ac.rest(); } if (ac && gWalk && ac.cur !== ac.base) ac.cur.timeScale = Math.max(0.85, Math.min(1.7, Math.hypot(MV.vx, MV.vz) / 1.3));   /* the same walk as everyone else, its pace matched to his speed so the feet do not slide */ } }
  camera.position.set(state.x + Math.sin(tt * 31) * 0.06 * sh, eyeY + camLift + (reduceMotion ? 0 : Math.sin(bob) * 0.035) + Math.sin(tt * 37) * 0.05 * sh, state.z + Math.sin(tt * 27) * 0.05 * sh); camera.rotation.set(state.pitch + Math.sin(tt * 29) * 0.015 * sh, state.yaw, Math.sin(tt * 23) * 0.03 * sh); if (galdy && galdy.visible) { const back = state.place === 'out' ? 2.6 : 1.9, wx = camera.position.x + Math.sin(state.yaw) * back, wz = camera.position.z + Math.cos(state.yaw) * back, sx = state.x, sz = state.z; const [cx2, cz2] = camBounds(wx, wz); camera.position.x = cx2; camera.position.z = cz2; state.x = sx; state.z = sz; camera.position.y += 0.35; camera.rotation.x -= 0.12; }
  for (const [b, q] of animQ) b.quaternion.copy(q);            // put back the animation's own pose before adding ours
  if (seaN && state.place !== 'in' && state.place !== 'ware') { const t = now / 1000; seaN.offset.x = t * 0.02; seaN.offset.y = t * 0.013;
    const p = waves.geometry.attributes.position, b = waves.userData.base; if (!PHONE || (frameN & 1) === 0) for (let i = 0; i < p.count; i++) { const x = b[i * 3], z = b[i * 3 + 2]; p.setY(i, Math.sin(x * 0.42 + t * 1.3) * 0.07 + Math.sin(z * 0.31 + t * 0.9) * 0.06 + Math.sin((x + z) * 0.9 + t * 2.1) * 0.025); } p.needsUpdate = true; if ((frameN++ & (PHONE ? 7 : 3)) === 0) waves.geometry.computeVertexNormals();
    waves.position.y = seaLevel; const m = Q.ruin ? null : shipsM.merchant, sl = Q.ruin ? null : shipsM.sloop; if (m) { m.position.y = -0.35 + Math.sin(t * 0.8) * 0.05; m.rotation.x = Math.sin(t * 0.6) * 0.012; m.rotation.z = Math.sin(t * 0.45) * 0.004; } if (sl) { sl.position.y = -0.35 + Math.sin(t * 1.0 + 1) * 0.07; sl.rotation.x = Math.sin(t * 0.75 + 2) * 0.025; }
    for (const f of flagsM) { for (let i = 0; i < f.p.count; i++) { const d = f.uv.getX(i); /* 0 at the staff, 1 at the free end, so the hoist edge never leaves the pole */ f.p.setZ(i, f.base[i * 3 + 2] + (Math.sin(d * 5.5 - t * 5.2) * 0.2 + Math.sin(d * 11 - t * 8.3) * 0.05) * d * (f.k || 1)); f.p.setY(i, f.base[i * 3 + 1] + Math.sin(d * 4 - t * 3.1) * 0.05 * d * (f.ky || 1)); } f.p.needsUpdate = true; } }
  audioTick(now / 1000); if (state.started && now - lastSave > 5000) { lastSave = now; saveGame(); }
  if (mixer) mixer.update(dt); for (const mx of mixers) { const r = mx.getRoot(); let v = r.visible, o = r.parent; while (v && o) { v = o.visible; o = o.parent; } if (v) mx.update(dt); } for (const m of [abba, ...Object.values(people), ...Object.values(survivors)]) if (m && m.userData.anim) m.userData.anim.tick(dt);
  for (const m of grounded) if (m.visible && m.parent && m.parent.visible) groundFeet(m);
  for (const f of TICKS) f(dt);
  if (built && people.kofi && people.kofi.visible && CL.Carry) kofiTick(dt);
  if (built) for (const n of NPCS) { const m = people[n.id]; if (!m || !m.visible || n.walking) continue; const dx = state.x - n.x, dz = state.z - n.z; let w = n.ry; if (Math.hypot(dx, dz) < 4.5) { let d = Math.atan2(dx, dz) - n.ry; d = Math.atan2(Math.sin(d), Math.cos(d)); w = n.ry + d; } let e = w - m.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); m.rotation.y += e * Math.min(1, dt * 3); const ac = m.userData.anim; if (ac && CL.TurnL && Math.abs(e) > 0.75 && ac.cur === ac.base && speaker !== m) ac.play(e > 0 ? 'TurnL' : 'TurnR', true);   /* face whoever comes to talk */ }
  if (built && abba) {                       // extra life on top of the idle: breathing, a slow sway, and her head following you
    const t = now / 1000, sp = abba.getObjectByName('mixamorigSpine'), s2 = abba.getObjectByName('mixamorigSpine2'), hd = abba.getObjectByName('mixamorigHead'), nk = abba.getObjectByName('mixamorigNeck');
    for (const b of [sp, s2, nk, hd]) if (b) { if (!animQ.has(b)) animQ.set(b, new THREE.Quaternion()); animQ.get(b).copy(b.quaternion); }
    const add = (b, x, y, z) => { if (b) b.quaternion.multiply(_q.setFromEuler(_e.set(x, y, z))); };
    add(sp, 0, Math.sin(t * 0.35) * 0.05, Math.sin(t * 0.5) * 0.03); add(s2, Math.sin(t * 1.5) * 0.01, 0, 0);
    const dxh = state.x - ABBA.x, dzh = state.z - ABBA.z, near = !Q.abbaRun && (Math.hypot(dxh, dzh) < 4.5 || !$('dialogue').hidden);
    faceAmt += ((near ? 1 : 0) - faceAmt) * Math.min(1, dt * 3);                 // near you she stops looking around and faces you
    if (!restQ && nk && hd) { let sk = null; abba.traverse((o) => { if (!sk && o.isSkinnedMesh) sk = o.skeleton; }); if (sk) { restQ = {}; const W = (b) => new THREE.Matrix4().copy(sk.boneInverses[sk.bones.indexOf(b)]).invert();
        for (const b of [nk, hd]) { const m = new THREE.Matrix4().copy(W(b.parent)).invert().multiply(W(b)); restQ[b.name] = new THREE.Quaternion().setFromRotationMatrix(m); } } }
    if (restQ) { nk.quaternion.slerp(restQ[nk.name], faceAmt * 0.5); hd.quaternion.slerp(restQ[hd.name], faceAmt * 0.5); }
    let yaw = Math.atan2(dxh, dzh) - abba.rotation.y; yaw = Math.max(-0.7, Math.min(0.7, Math.atan2(Math.sin(yaw), Math.cos(yaw)))) * faceAmt;
    headYaw += (yaw - headYaw) * Math.min(1, dt * 4); add(nk, 0, headYaw * 0.4, 0); add(hd, Math.sin(t * 0.9) * 0.02, headYaw * 0.6, 0);
  }
  if (built) {
    const dx = state.x - ABBA.x, dz = state.z - ABBA.z, d = Math.hypot(dx, dz);
    const want = state.place === 'sea' ? Math.atan2(dx, dz) : d < 9 ? Math.max(-1.1, Math.min(1.1, Math.atan2(dx, dz))) : (state.place === 'in' ? 0 : 0.25); if (!Q.abbaRun) { const ea = want - abba.rotation.y; abba.rotation.y += ea * Math.min(1, dt * 3); const ac = abba.userData.anim; if (ac && CL.TurnLW && Math.abs(ea) > 0.8 && ac.cur === ac.base && abba.visible && !Q.on) ac.play(ea > 0 ? 'TurnLW' : 'TurnRW', true); }
    if (ring && ring.visible) { const s = 1 + (reduceMotion ? 0 : Math.sin(now / 420) * 0.08); ring.scale.set(s, s, s); }
    if (state.started) { current = null; let best = 1e9; if (!busy) for (const a of ACTIONS) { if (!!FB.on !== !!a.fb) continue; const w = a.where(); if (!w) continue; const dd = Math.hypot(state.x - w[0], state.z - w[1]); if (dd < a.r && dd < best) { best = dd; current = a; } }
      $('talk').hidden = !current || isTalk(current); if (current && !isTalk(current) && $('talk').dataset.label !== current.label) setActionButton(current);
      if (!state.unlocked.includes('harbour') && state.x < SHORE - 2) { unlock('harbour'); setGoal(); } }
    if (state.place === 'in' && fire && !reduceMotion) { const f = 0.85 + Math.sin(now / 90) * 0.08 + Math.sin(now / 37) * 0.07; fire.scale.set(1, f, 1); fireLight.intensity = 16 * f; for (let i = 0; i < flames.length; i++) { const k = 1.75 + Math.sin(now / 70 + i * 2.1) * 0.25; flames[i].scale.y = flames[i].geometry.type === 'SphereGeometry' ? k : 0.9 + (k - 1.75); } }
  }
  renderer.render(scene, camera); requestAnimationFrame(frame);
}
const flagsM = [];
async function loadAll() {
  // stage 1: only what you can see from the pier. The game can start as soon as this is in.
  await stage(['tex_harbour', 'merchant', 'sloop'], (f) => { $('bar').style.width = Math.round(f * 100) + '%'; });
  await decodeTex();
  for (const k of ['merchant', 'sloop']) { shipsM[k] = prep(window.__got[k].scene); shipsM[k].traverse((o) => { if (o.isMesh && (o.material.name === 'Rope' || o.material.name === 'Tar')) { o.material.fog = false; o.material.color.multiplyScalar(0.55); o.material.needsUpdate = true; }   /* ropes stay dark against the sky instead of fading into pale dashes in the haze */ if (o.isMesh && o.material.name === 'Flag') { const q = o.geometry.attributes.position, f = new Float32Array(q.count * 3); for (let i = 0; i < q.count; i++) { f[i * 3] = q.getX(i); f[i * 3 + 1] = q.getY(i); f[i * 3 + 2] = q.getZ(i); } const p = new THREE.BufferAttribute(f, 3); o.geometry.setAttribute('position', p); o.updateMatrixWorld(true); const sc = o.getWorldScale(new THREE.Vector3()), u = o.geometry.attributes.uv, uv = { getX: (i) => u.getX(i) }; flagsM.push({ p, base: f.slice(), uv, k: 1 / ((sc.z || 1) / (shipsM[k].scale.z || 1)), ky: 1 / ((sc.y || 1) / (shipsM[k].scale.y || 1)) }); o.frustumCulled = false; } }); }
  buildHarbour(); $('start').disabled = false; $('start').textContent = hasSave ? 'Continue' : 'Step ashore'; $('savenote').hidden = !hasSave; $('loadnote').hidden = true; document.querySelector('.track').hidden = true;
  // stage 2: the town streams in while you walk the pier
  await stage(['tex_town', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'abba', 'kofi', 'sailor', 'benning', 'anims']);
  await decodeTex(); for (const k in window.__tex) window.__tex[k] = '';
  for (const k of Object.keys(WID)) models[k] = prep(window.__got[k].scene);
  const g = window.__got.abba; abba = prep(g.scene); if (g.animations.length) { mixer = new THREE.AnimationMixer(abba); idle = mixer.clipAction(g.animations[0]); idle.play();
    { const pc = g.animations[0].clone(); pc.tracks = pc.tracks.filter((t) => t.name.endsWith('.quaternion')); setFallbackClip(pc); } }   // other bodies keep their own proportions
  if (window.__got.anims) loadClips(window.__got.anims);
  if (mixer && CL.Run) { runA = mixer.clipAction(clipFor('Run', true)); } if (mixer && idle) animate(abba, null, mixer, idle);
  for (const n of NPCS) { const m = prep(window.__got[n.id].scene); m.position.set(n.x, n.y || groundYAt(n.x, n.z), n.z); m.rotation.y = n.ry; scene.add(m); people[n.id] = m; animate(m); }
  buildTown(); if (ring) ring.visible = !state.talked; window.__got = null; townReady = true; built = true;
  // stage 3: the tavern is built in a spare moment, before you can reach its door
  setTimeout(() => { buildTavern(); try { loadSoldier(); } catch (e) {} try { buildNewStreet(); } catch (e) { NS.err = String(e && e.stack || e); document.body.dataset.nserr = NS.err.slice(0, 300); }   /* never let the extra street stop the tavern */ for (const f of FINDS) if (state.unlocked.includes(f.id)) finds[f.id].visible = false; if (state.ate) stew.visible = true; tavernReady = true; $('tchap').hidden = false; model('heath').then((g) => { people.heath = prep(g.scene); placeHeath(); }).catch(() => {}); for (const n of ['ned', 'buc1', 'buc2', 'morgan', 'gunner']) model(n).then((g) => { people[n] = prep(g.scene); pirateReady(n); }).catch(() => {});
    model('galdy').then((g) => { galdy = prep(g.scene); galdy.scale.multiplyScalar(0.94); galdy.visible = false; scene.add(galdy); animate(galdy, 'Idle'); $('view').hidden = false; }).catch(() => {}); if (!$('chapters').hidden) renderChapters(); const q = new URLSearchParams(location.search);
  if (__DEV__ && q.has('seed')) { const [sx, sz] = q.get('seed').split(',').map(Number); applySave({ unlocked: ['galdy'], talked: true, ate: false, done: false, ch: {}, pos: [sx, sz, 0] }); setTimeout(() => { document.title = 'RESTORE x=' + state.x.toFixed(2) + ' z=' + state.z.toFixed(2) + ' ns=' + NS.ready; }, 12000); }
  if (__DEV__ && q.has('shot')) { $('start').click(); if (q.get('shot') === 'talk') { state.x = -3.6; state.z = -1.4; state.yaw = 0.62; state.pitch = -0.02; setTimeout(() => $('talk').click(), 300); } if (q.get('shot') === 'abbarun') { beginQuake(); setPhase('main'); Q.t = 1.6; state.x = 5; state.z = -0.5; state.yaw = Math.PI / 2 - 0.3; } if (q.get('shot') === 'quake1') { beginQuake(); setPhase('main'); Q.t = 6.5; state.x = 6; state.yaw = Math.PI / 2 + 0.3; } if (q.get('shot') === 'quake2') { beginQuake(); toSea(); state.yaw += 0.0; } if (q.get('shot') === 'quake3') { beginQuake(); toSea(); state.x = SHORE + 14; state.z = 20; state.yaw = Math.PI / 2 + 0.35; state.pitch = 0.1; } if (q.get('shot') === 'after') { beginAfter(); state.x = -2; state.z = -1; state.yaw = Math.PI / 2 - 0.1; } if (q.get('shot') === 'after2') { beginAfter(); state.x = -12; state.z = -1; state.yaw = -Math.PI / 2 - 0.15; } if (q.get('shot') === 'yard') { toYard(); } if (q.get('shot') === 'yard2') { toYard(); state.x = YX + 6; state.z = YZ - 0.2; state.yaw = 0; state.pitch = -1.1; } if (q.get('shot') === 'church') { toYard(); state.x = YX + 9; state.z = YZ + 9; state.yaw = Math.atan2(-(YX - 4 - state.x), -(YZ - 6 - state.z)); state.pitch = 0.18; } if (q.get('shot') === 'ware') { beginWare(); } if (q.get('shot') === 'door') { beginWare(); state.x = -253; state.z = 0.6; state.yaw = -Math.PI / 2; state.pitch = 0; } if (q.get('shot') === 'ware2') { beginWare(); state.x = -256.6; state.z = 0.2; state.yaw = 0.62 + Math.PI * 0; state.yaw = Math.atan2(-(-258.6 - state.x), -(2.9 - state.z)); state.pitch = -0.25; } if (q.get('shot') === 'chapters') { openChapters(); } if (q.get('shot') === 'third') { state.x = 12; state.z = 0.3; state.yaw = Math.PI / 2; setTimeout(() => toggleView(), 4500); } if (q.get('shot') === 'kofi2') { state.x = 29; state.z = 0.9; state.yaw = Math.PI / 2; state.pitch = 0.02; } if (q.get('shot') === 'kofitalk') { state.x = 22.9; state.z = 0.9; state.yaw = Math.atan2(-(21.7 - 23.6), -(2.35 - 0.6)); setTimeout(() => { if (current) current.go(); }, 6500); } if (q.get('shot') === 'npc1') { state.x = 23.6; state.z = 0.6; state.yaw = Math.atan2(-(21.7 - 23.6), -(2.35 - 0.6)); } if (q.get('shot') === 'npc2') { state.x = 37.2; state.z = 0.2; state.yaw = Math.PI / 2 - 0.25; } if (q.get('shot') === 'npc3') { state.x = 8.6; state.z = 0.9; state.yaw = Math.PI; state.pitch = 0.05; } if (q.get('shot') === 'tav') { state.talked = state.ate = true; state.unlocked.push('harbour'); setPlace('in'); state.x = -199.0; state.z = -2.2; state.yaw = Math.atan2(-2.7, -2.2); state.pitch = -0.05; } if (q.get('shot') === 'tav2') { state.talked = state.ate = true; state.unlocked.push('harbour'); setPlace('in'); state.x = -199.6; state.z = -0.6; state.yaw = Math.atan2(2.0, -2.5); state.pitch = -0.08; } if (q.get('shot') === 'fort') { state.x = 27; state.z = -21; state.yaw = Math.atan2(-(50 - 27), -(-30 + 21)); state.pitch = 0.1; } if (q.get('shot') === 'fortin') { setTimeout(() => { state.x = 40.5; state.z = -27.5; state.fz = 'court'; state.yaw = Math.atan2(-(50 - 40.5), -(-30 + 27.5)); state.pitch = 0.12; }, 5000); } if (q.get('shot') === 'fortwall') { setTimeout(() => { state.x = 53.5; state.z = -37.2; state.fz = 'ring'; state.yaw = Math.atan2(-(62 - 53.5), -(-30 + 37.2)); state.pitch = -0.05; }, 5000); } if (q.get('shot') === 'fortair') { setTimeout(() => { state.x = 30; state.z = -12; state.yaw = Math.atan2(-(50 - 30), -(-30 + 12)); state.pitch = -0.3; eyeY = 14; }, 5000); } if (q.get('shot') === 'fort2') { setTimeout(() => { state.x = 13; state.z = -24; state.yaw = Math.PI * 0.75 + 0.2; }, 5000); } if (q.get('shot') === 'fb') { setTimeout(() => fbStart(), 4500); setTimeout(() => { state.x = SHORE - 3.4; state.z = 0.2; state.yaw = Math.PI - 0.15; state.pitch = 0.05; }, 6000); } if (q.get('shot') === 'camp4') { beginAfter(); state.x = -3; state.z = -3.2; state.yaw = Math.PI - 0.6; state.pitch = 0.05; } if (q.get('shot') === 'ned') { state.talked = state.ate = true; state.unlocked.push('harbour'); setPlace('in'); state.x = -199.4; state.z = 0.2; state.yaw = Math.atan2(-(-201.6 + 199.4), -(1.8 - 0.2)); state.pitch = -0.12; } if (q.get('shot') === 'fortflag') { setTimeout(() => { const p = FORT.fpos || [55, 12, -30]; state.x = p[0] - 9; state.z = p[2] + 7; state.fz = 'court'; state.yaw = Math.atan2(-(p[0] - state.x), -(p[2] - state.z)); state.pitch = 0.45; }, 5000); } if (q.get('shot') === 'shipflag') { setTimeout(() => { let best = null; scene.traverse((o) => { if (o.isMesh && o.material && o.material.name === 'Flag' && !best) { const b = new THREE.Box3().setFromObject(o); best = b.getCenter(new THREE.Vector3()); } }); if (!best) return; state.x = best.x + 5; state.z = best.z + 5; state.yaw = Math.atan2(-(best.x - state.x), -(best.z - state.z)); state.pitch = 0; eyeY = best.y; }, 5000); } if (q.get('shot') === 'kofistack') { state.x = 28.6; state.z = 0.4; state.yaw = -Math.PI / 2; state.pitch = -0.1; } if (q.get('shot') === 'spit') { setTimeout(() => { state.x = 24; state.z = -15; state.fz = 'spit'; state.yaw = Math.atan2(-(46 - 24), -(-32 + 15)); state.pitch = -0.04; }, 5000); } if (q.get('shot') === 'spit2') { setTimeout(() => { state.x = 34; state.z = -20; state.fz = 'spit'; state.yaw = Math.atan2(-(24 - 34), -(-24 + 20)); state.pitch = -0.1; }, 5000); } if (q.get('shot') === 'mline') { setTimeout(() => { state.x = 27.5; state.z = -28.5; state.fz = 'spit'; state.yaw = Math.atan2(-(34 - 27.5), -(-39 + 28.5)); state.pitch = -0.08; }, 5000); } if (q.get('shot') === 'gwalk') { state.x = 14; state.z = 0.4; state.yaw = Math.PI / 2; setTimeout(() => { const out = document.createElement('div'); out.id = 'frames'; out.hidden = true; document.body.appendChild(out); const G = q.get('who') === 'soldier' ? SOLDIER.m : galdy; if (!G) return; SOLDIER.m && (SOLDIER.m.visible = false); const ac = G.userData.anim; G.visible = true; G.position.set(14, 0, 0.4); G.rotation.y = Math.PI / 2 + Math.PI; if (G === SOLDIER.m) { SOLDIER.wait = 1e9; SOLDIER.hidden = false; } ac.play(q.get('clip') || 'WalkM'); ac.cur.timeScale = 1.1; ac.mx.update(0.5); const c = camera.clone(); if (q.get('cam') === 'front') c.position.set(10.6, 1.0, 2.9); else c.position.set(14, 0.95, 4.6); c.lookAt(14, 0.75, 0.4); c.fov = 26; c.aspect = canvas.width / canvas.height; c.updateProjectionMatrix();
  for (let n = 0; n < 12; n++) { ac.mx.update(1 / 12);  renderer.render(scene, c); const im = document.createElement('i'); im.textContent = canvas.toDataURL('image/jpeg', 0.75); out.appendChild(im); } }, 6000); } if (q.get('shot') === 'move') { window.addEventListener('error', (e) => { document.body.dataset.err = e.message + ' @' + e.lineno; }); const x0 = state.x, z0 = state.z; setTimeout(() => { keys.add('w'); let vmax = 0, frames = 0; const iv = setInterval(() => { vmax = Math.max(vmax, Math.hypot(MV.vx, MV.vz)); }, 50); TICKS.push(() => { frames++; }); setTimeout(() => { clearInterval(iv); document.body.dataset.v = vmax.toFixed(2) + ' frames=' + frames + ' x=' + state.x.toFixed(2); keys.delete('w'); }, 6000); }, 4000); } if (false) { setTimeout(() => { setTimeout(() => { document.title = 'MOVED ' + Math.hypot(state.x - x0, state.z - z0).toFixed(2) + ' place=' + state.place + ' v=' + MV.vx.toFixed(2) + ',' + MV.vz.toFixed(2) + ' busy=' + busy + ' started=' + state.started + ' keys=' + [...keys].join(''); }, 3000); }, 5000); } if (q.get('shot') === 'swim') { setTimeout(() => { beginQuake(); toSea(); const x0 = state.x, z0 = state.z; document.body.dataset.boat = Q.boat ? Q.boat.position.x.toFixed(1) + ',' + Q.boat.position.z.toFixed(1) + ' yaw ' + state.yaw.toFixed(2) : 'none'; keys.add('w'); setTimeout(() => { keys.delete('w'); document.title = 'SWIM ' + Math.hypot(state.x - x0, state.z - z0).toFixed(2) + ' from ' + x0.toFixed(1) + ',' + z0.toFixed(1) + ' to ' + state.x.toFixed(1) + ',' + state.z.toFixed(1) + ' place=' + state.place + ' busy=' + busy + ' card=' + !$('card').hidden + ' speed=' + moveSpeed; }, 4000); }, 4000); } if (q.get('shot') === 'boat') { setTimeout(() => { beginQuake(); toSea(); const d0 = Math.hypot(state.x - Q.boat.position.x, state.z - Q.boat.position.z); for (let i = 0; i < 400 && Q.phase === 'sea'; i++) quakeTick(0.05, i * 0.05); setTimeout(() => { document.title = 'BOAT ' + d0.toFixed(1) + ' -> ' + Math.hypot(state.x - Q.boat.position.x, state.z - Q.boat.position.z).toFixed(1) + ' phase=' + Q.phase + ' Qt=' + Q.t.toFixed(1); }, 8000); }, 4000); } if (q.get('shot') === 'mug') { state.talked = state.ate = true; state.unlocked.push('harbour'); setPlace('in'); state.x = -200.7; state.z = 0.9; state.yaw = Math.atan2(-(-201.6 + 200.7), -(1.8 - 0.9)); state.pitch = -0.3; eyeY = 1.3; } if (q.get('shot') === 'fbquit') { setTimeout(() => { fbStart(); setTimeout(() => { const a1 = FBG.group.visible; fbReset(); const a2 = FBG.group.visible; playChapter(CHAPTERS[0]); document.body.dataset.a2 = a2; setTimeout(() => { for (const t of TICKS) { try { t(0.016); } catch (e) {} } document.title = 'FBQUIT during=' + a1 + ' after=' + FBG.group.visible + ' fb=' + FB.on + ' morgan=' + (people.morgan && people.morgan.visible) + ' kofi=' + (people.kofi && people.kofi.visible); }, 800); }, 1500); }, 4000); } if (q.get('shot') === 'step') { setTimeout(() => { const raf = window.requestAnimationFrame; window.requestAnimationFrame = () => 0; const x0 = state.x, z0 = state.z, res = []; let t = last;
  const run = (n, k) => { for (let i = 0; i < n; i++) { t += 33; frame(t); } res.push(k + ':' + Math.hypot(state.x - x0, state.z - z0).toFixed(2)); };
  keys.add('w'); run(10, 'w0.33s'); run(20, 'w1s'); keys.delete('w'); run(10, 'stop0.33s'); keys.add('a'); run(30, 'strafe'); keys.delete('a'); run(10, 'end');
  state.x = SHORE - 3; state.z = 1.3; MV.vx = MV.vz = 0; const zx = state.x; state.yaw = Math.PI / 2 - 0.4; keys.add('w'); run(30, 'wallslide'); keys.delete('w'); res.push('slid_x=' + (zx - state.x).toFixed(2) + ' z=' + state.z.toFixed(2));
  MV.tap = [state.x - 3, 0.2]; run(60, 'tap'); res.push('tapdone=' + (MV.tap === null) + ' at ' + state.x.toFixed(2) + ',' + state.z.toFixed(2));
  document.title = 'STEP ' + res.join(' '); window.requestAnimationFrame = raf; }, 9000); } if (q.get('shot') === 'pad') { setTimeout(() => { window.requestAnimationFrame = () => 0; const fake = { connected: true, axes: [0, -1, 0.6, 0], buttons: Array.from({ length: 16 }, () => ({ pressed: false })) }; navigator.getGamepads = () => [fake]; const x0 = state.x, y0 = state.yaw; let t = last; for (let i = 0; i < 30; i++) { t += 33; frame(t); }
  const moved = Math.hypot(state.x - x0, state.z), turned = state.yaw - y0; fake.axes = [0, 0, 0, 0]; fake.buttons[3].pressed = true; t += 33; frame(t); document.title = 'PAD moved=' + moved.toFixed(2) + ' turned=' + turned.toFixed(2) + ' journal=' + !$('journal').hidden; }, 9000); } if (/^ns/.test(q.get('shot') || '')) { const V = { sky: [36, 0.4, Math.PI / 2 - 0.9, 1.0], sky2: [30, -0.8, Math.PI / 2 + 0.4, 0.9], nsgrass: [19.6, 5.4, Math.PI + 0.05, -0.18], nsst1: [7.6, 17.3, 0, -0.38], nsst2: [15.0, 17.3, 0, -0.38], nsback: [20.2, 16.0, Math.PI - 0.15, -0.12], nssign: [22.6, 12.2, Math.atan2(-(19.6 - 22.6), -(14.6 - 12.2)), 0.05], nsmen: [2.6, 19.4, Math.PI, 0.0], ns8: [-4.5, 19.5, Math.PI / 2 + 0.45, 0.04], ns9: [19.8, 15.5, Math.PI - 0.2, 0], ns7: [21.4, 11.2, Math.atan2(-(26.5 - 21.4), -(12.4 - 11.2)), -0.42], nsabba: [-5.2, 0.9, 0, 0.06], ns6: [21.2, 3.5, Math.atan2(-(17 - 21.2), -(14 - 3.5)), 0.02], ns5: [8.4, 17.6, Math.atan2(-(9.6 - 8.4), -(15.4 - 17.6)), -0.08], ns1: [21, 17.5, Math.PI / 2 - 0.05, 0], ns2: [7, 16.2, Math.PI - 0.35, 0.05], ns3: [19.4, 9.2, Math.atan2(-(25.2 - 19.4), -(12.4 - 9.2)), -0.12], ns4: [-1, 20.5, Math.PI / 2 + 0.6, 0] }[q.get('shot')]; setTimeout(() => { state.x = V[0]; state.z = V[1]; state.yaw = V[2]; state.pitch = V[3]; }, 7000); } if (q.get('shot') === 'nswalk') { setTimeout(() => { window.requestAnimationFrame = () => 0; renderer.render = () => {}; let t = last; const go = (yaw, n) => { state.yaw = yaw; keys.add('w'); for (let i = 0; i < n; i++) { t += 33; frame(t); } keys.delete('w'); return state.x.toFixed(1) + ',' + state.z.toFixed(1); };
  state.x = 20.5; state.z = 4; const r = ['ready=' + NS.ready, 'north:' + go(Math.PI, 150), 'west:' + go(Math.PI / 2, 160), 'east:' + go(-Math.PI / 2, 160), 'south:' + go(0, 120), 'west2:' + go(Math.PI / 2, 60)]; document.title = 'NSWALK ' + r.join(' '); }, 9000); } if (/^nudge[23]?$/.test(q.get('shot'))) { setTimeout(() => { if (q.get('shot') === 'nudge2') { state.yaw += Math.PI * 0.8; } if (q.get('shot') === 'nudge3') { state.pitch = 1.0; state.yaw += 0.3; } NUDGE.still = performance.now() - 20000; window.requestAnimationFrame = () => 0; let t = last; for (let i = 0; i < 20; i++) { t += 33; frame(t); } setTimeout(() => { const e = $('nudge'); document.title = 'NUDGE hidden=' + e.hidden + ' left=' + e.style.left + ' top=' + e.style.top + ' tf=' + e.style.transform + ' W=' + innerWidth; }, 2500); }, 7000); } if (q.get('shot') === 'leave') { setTimeout(() => { startConvo([{ who: 'Grace', text: 'Pick one.', choices: [{ t: 'A', ok: true }, { t: 'B' }] }]); setTimeout(() => { dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); document.title = 'LEAVE dialogueHidden=' + $('dialogue').hidden + ' busy=' + busy; }, 500); }, 6000); } if (q.get('shot') === 'sold1' || q.get('shot') === 'sold2') { setTimeout(() => { const two = q.get('shot') === 'sold2'; if (two && SOLDIER.m) { SOLDIER.m.position.set(25, 0, -12.5); SOLDIER.i = 9; SOLDIER.dir = 1; } state.x = two ? 21.6 : 4; state.z = two ? -7.6 : 1.6; state.yaw = two ? Math.atan2(-3.4, 4.9) : -Math.PI / 2 + 0.05; state.pitch = 0; }, 6500); } if (q.get('shot') === 'thumb') { setTimeout(() => { state.x = 30; state.z = 0.2; state.yaw = Math.PI / 2; state.pitch = 0.03; const st = document.createElement('style'); st.textContent = 'body > *:not(canvas){display:none!important}'; document.head.appendChild(st); }, 6500); } if (q.get('shot') === 'cratewalk' || q.get('shot') === 'pierwalk') { setTimeout(() => { window.requestAnimationFrame = () => 0; renderer.render = () => {}; let t = last; const pier = q.get('shot') === 'pierwalk', mid = q.get('mid'); state.x = pier ? (mid ? SHORE + 18 : SHORE + 6) : 19.4; state.z = pier ? (mid ? 0 : 1.3) : 4.6; state.yaw = pier ? Math.PI / 2 : 0; keys.add('w'); for (let i = 0; i < (q.get('mid') ? 300 : 60); i++) { t += 33; frame(t); } keys.delete('w'); const hit = (propC || []).filter((c) => c[0] < 20.3 && c[2] > 18.5 && c[1] < 3.8 && c[3] > 2.4).length; document.title = 'CRATE x=' + state.x.toFixed(2) + ' z=' + state.z.toFixed(2) + ' boxes=' + hit + ' total=' + (propC ? propC.length : -1); }, 7000); } if (q.get('shot') === 'jhome') { setTimeout(() => openJournal(), 7000); } if (q.get('shot') === 'third') { setTimeout(() => { toggleView(); setTimeout(() => { const b = new THREE.Box3().setFromObject(galdy); document.title = 'THIRD vis=' + galdy.visible + ' third=' + third + ' pos=' + galdy.position.toArray().map((v) => v.toFixed(2)) + ' box=' + b.min.toArray().map((v) => v.toFixed(2)) + '/' + b.max.toArray().map((v) => v.toFixed(2)) + ' scale=' + galdy.scale.x.toFixed(2); }, 1500); }, 7000); } if (q.get('shot') === 'chap') { setTimeout(() => openChapters(), 7000); } if (q.get('shot') === 'nsthird') { setTimeout(() => { state.x = 6; state.z = 18.4; state.yaw = Math.PI / 2; toggleView(); }, 7000); } if (q.get('shot') === 'crawlpush') { setTimeout(() => { window.requestAnimationFrame = () => 0; renderer.render = () => {}; let t = last; state.x = 21.2; state.z = 11.4; state.yaw = -Math.PI / 2 + 0.3; keys.add('w'); for (let i = 0; i < 150; i++) { t += 33; frame(t); } keys.delete('w'); document.title = 'CRAWL x=' + state.x.toFixed(2) + ' z=' + state.z.toFixed(2); }, 7000); } if (q.get('shot') === 'savewait') { setTimeout(() => { RESTORE.pos = [8, 18.6, 0]; const t0 = townReady; townReady = false; saveGame(); const d = loadGame(); townReady = t0; document.title = 'SAVEWAIT pos=' + JSON.stringify(d && d.pos); }, 7000); } if (q.get('shot') === 'meline') { setTimeout(() => startConvo([{ who: 'You', text: 'Do you work for someone?' }, { who: 'Peter', text: 'No. I am a free man.' }]), 6000); } if (q.get('shot') === 'credits') { $('credits').hidden = false; } if (q.get('shot') === 'resetc') { setTimeout(() => $('reset').click(), 4000); } if (q.get('shot') === 'camp3') { beginAfter(); state.x = -4.2; state.z = 3.4; state.yaw = Math.PI / 2 - 0.2; } if (q.get('shot') === 'npc4') { beginAfter(); state.x = -7.4; state.z = 3.2; state.yaw = Math.atan2(-(-9.65 + 7.4), -(1.75 - 3.2)); } if (q.get('shot') === 'street') { state.x = 17; state.z = 0.4; } if (q.get('shot') === 'ships') { state.x = SHORE + 1; state.z = 0.9; state.yaw = -Math.PI / 2 + 0.25; state.pitch = 0.22; } if (q.get('shot') === 'beach') { state.x = SHORE - 6; state.z = 1; state.yaw = -Math.PI / 2 - 0.9; state.pitch = -0.05; } if (q.get('shot') === 'beach2') { state.x = SHORE - 7; state.z = -2; state.yaw = -Math.PI / 2 + 0.8; state.pitch = 0.05; } if (q.get('shot') === 'in' || q.get('shot') === 'stew') { state.talked = true; state.unlocked.push('harbour'); setPlace('in'); state.x = -199.6; state.z = 2.6; state.yaw = 0.25; state.pitch = -0.12; setGoal(); if (q.get('shot') === 'stew') { state.x = -200.6; state.z = -0.6; state.yaw = 0.1; setTimeout(() => { $('talk').click(); state.step = 1; advance(); }, 400); } } } }, 300);
}
function start(saved) { try { if (sessionStorage.getItem('pr-fresh')) { sessionStorage.removeItem('pr-fresh'); saved = {}; } } catch (e) { /* ignore */ } if (!(saved && saved.started)) applySave(loadGame()); loadAll().catch(() => {}); if (saved && saved.started) { Object.assign(state, saved); if (state.place !== 'out' || state.x > SHORE + 24 || state.x < X0 - 1 || Math.abs(state.z) > 9.5) { state.place = 'out'; state.x = 17; state.z = 0.4; state.yaw = Math.PI / 2; state.pitch = 0; } $('start').addEventListener('click', () => { if (state.unlocked.length) { $('jcount').textContent = state.unlocked.length; $('jcount').hidden = false; } }, { once: true }); } requestAnimationFrame(frame); }
/* ---------- the second street: market, turtle crawl, Jews Street, the law ---------- */
JOURNAL.push(
  { id: 'markets', title: 'The markets',
    simple: ['Port Royal had three markets every day.', 'One sold herbs, fruit and birds. One sold meat and turtle. One sold fish by the wharf.', 'A watermelon cost one real.'],
    deeper: ['John Taylor visited in 1687 and 1688 and wrote down what he saw.', 'He said the fish market was on the wharf near the Wherry Bridge, and one real bought enough fish for four men.', 'Carrots and turnips were very dear. Sweet potatoes were cheap: ten or twelve pounds for one real.', 'Grace in this game is made up.'] },
  { id: 'turtles', title: 'Turtles and crawls',
    simple: ['Green turtle was one of the town’s main foods.', 'Turtlers caught them near the Cayman Islands.', 'They kept them alive in pens in the sea, called crawls.'],
    deeper: ['Ships stopping at Port Royal bought turtles to eat on long voyages.', 'Archaeologists have found turtle bones with knife marks in the sunken town.', 'So many turtles were caught that their numbers fell badly. Today green turtles are protected.', 'Peter in this game is made up.'] },
  { id: 'jewsstreet', title: 'Jews Street',
    simple: ['Many Jewish families lived in Port Royal.', 'Their families had come from Portugal and Spain, by way of Amsterdam and France.', 'Their street was called Jews Street. It had a synagogue.'],
    deeper: ['A deed from 1677 shows land bought on New Street, also called Jew Street, for a synagogue.', 'In 1672 English merchants complained to the governor that Jewish traders were taking their trade.', 'From 1690, Jews in Jamaica had to pay an extra tax.', 'A letter written on the day of the earthquake says the synagogue fell beside the writer as he turned into Jews Street to get home.', 'Jamaica’s Jewish community still lives on today, in Kingston. Daniel Mendes in this game is made up.'] },
  { id: 'freepeople', title: 'Free Black people',
    simple: ['Most Black people in Jamaica were enslaved.', 'But some were free.', 'Some were freed by their owners, often in a will.'],
    deeper: ['Church records from the 1670s show free Black people marrying and having their children baptised.', 'Some wills promised an enslaved person freedom after a number of years of work.', 'The Maroons escaped slavery and lived free in the mountains.', 'Free Black people still faced unfair laws, and these got harsher in the 1700s.'] },
  { id: 'law', title: 'Keeping the peace',
    simple: ['A constable kept the peace in the town.', 'Rule-breakers sat in the stocks, near the market bell.', 'There were two prisons: the Marshalsea for men and the Bridewell for women.'],
    deeper: ['These details come from John Taylor’s description of Port Royal in 1688.', 'Later, many captured pirates were tried and hanged at Gallows Point, near the town.', 'Constable Hart in this game is made up.'] });

const NS = { z: 18.6, zmin: 13.6, zmax: 23.2, x0: -7.5, ready: false, g: null, col: [] };
const NS_TALK = {
  grace: [
    { who: 'Grace', text: 'Fresh fruit! Herbs! Come and see!' },
    { who: 'Grace', text: 'I am Grace. I sell what grows out in the country.' },
    { who: 'Grace', text: 'The market bell rings in the morning. Then we open.' },
    { who: 'Grace', text: 'A watermelon costs one real. Carrots cost one real too. How much for both?', choices: [{ t: '2 reales', ok: true }, { t: '1 real' }, { t: '3 reales' }] },
    { who: 'Grace', text: 'Two reales! Carrots cost a lot here, you know.' },
    { who: 'Grace', text: 'Go and see the turtles by the water. Peter will show you.', unlock: 'markets' }],
  peter: [
    { who: 'Peter', text: 'Look in the pen! Those are green turtles.' },
    { who: 'Peter', text: 'We catch them near the Cayman islands and bring them here alive.' },
    { who: 'Peter', text: 'The pen is called a crawl. The turtles stay fresh in the sea.' },
    { who: 'Peter', text: 'Ships buy turtles to eat on long trips.', unlock: 'turtles' },
    { who: 'You', text: 'Do you work for someone?' },
    { who: 'Peter', text: 'No. I am a free man. My father was freed in his master’s will.' },
    { who: 'Peter', text: 'Most Black people here are enslaved. Some of us are free.', unlock: 'freepeople' }],
  mendes: [
    { who: 'Daniel Mendes', text: 'Shalom, and good day! I am Daniel Mendes, a merchant.' },
    { who: 'Daniel Mendes', text: 'My family came from Portugal, then Amsterdam. Now we live here.' },
    { who: 'Daniel Mendes', text: 'This is our synagogue. We pray here on the Sabbath.' },
    { who: 'Daniel Mendes', text: 'That is why people call this Jews Street.', unlock: 'jewsstreet' },
    { who: 'You', text: 'Is it a good place to live?' },
    { who: 'Daniel Mendes', text: 'Some English merchants do not like us. They say we take their trade.' },
    { who: 'Daniel Mendes', text: 'And we pay an extra tax, just for being Jewish.' },
    { who: 'Daniel Mendes', text: 'But here we can pray in the open. In Portugal we could not.' }],
  hart: [
    { who: 'Constable Hart', text: 'Mind yourself, young man. I am the town constable.' },
    { who: 'Constable Hart', text: 'See the stocks? Rule-breakers sit there, so everyone can see.' },
    { who: 'Constable Hart', text: 'Men who break the law go to the Marshalsea. That is the prison.' },
    { who: 'Constable Hart', text: 'Women go to the Bridewell, the other prison.' },
    { who: 'Constable Hart', text: 'Mostly I just keep the peace. Off you go now!', unlock: 'law' }] };
const NS_MORE = {
  grace: [[() => true, 'Fresh mangoes today? No, not yet. Mangoes come much later to Jamaica!'], [() => state.ate, 'You ate Abba’s turtle stew? Peter caught that turtle, I bet.'], [() => true, 'Come back in the cool of the evening. That is when the market is busy.']],
  peter: [[() => true, 'The turtles eat sea grass. We feed the pen every day.'], [() => state.unlocked.includes('markets'), 'Grace sends people to me. I send them to Grace!'], [() => true, 'A turtle can live a long, long time, if nobody catches it.']],
  mendes: [[() => true, 'Come in and see my cloth. It came from Holland.'], [() => true, 'The goldsmith next door makes rings and buttons from Spanish silver.'], [() => state.unlocked.includes('law'), 'The constable is fair. Mostly.']],
  hart: [[() => true, 'No running in the market!'], [() => state.unlocked.includes('jewsstreet'), 'Mr Mendes? An honest man. Pays his taxes, and more.'], [() => true, 'If you see a fight, come and tell me. Do not join in!']] };
const NS_PEOPLE = [
  { id: 'grace', label: 'Talk to the market seller', who: 'Grace', x: 9.6, z: 16.1, ry: 0 },
  { id: 'peter', label: 'Talk to the turtler', who: 'Peter', x: 21.0, z: 12.6, ry: Math.PI / 2 },
  { id: 'mendes', label: 'Talk to the merchant', who: 'Daniel Mendes', x: 2.2, z: 21.6, ry: Math.PI },
  { id: 'hart', label: 'Talk to the constable', who: 'Constable Hart', x: -2.6, z: 16.6, ry: Math.PI / 2 }];
function nsTalk(n) { const seen = state.ch.seen || (state.ch.seen = {}); const k = seen[n.id] || 0; seen[n.id] = k + 1; if (k === 0) return startConvo(NS_TALK[n.id]);
  const opts = NS_MORE[n.id].filter(([w]) => w()); const heard = state.ch.heard || (state.ch.heard = []); const fresh = opts.filter(([, t]) => !heard.includes(t)); const pick = fresh.length ? fresh[0] : opts[(k - 1) % opts.length]; heard.push(pick[1]); saveGame(); startConvo([{ who: n.who, text: pick[1] }]); }
ACTIONS.push(...NS_PEOPLE.map((n) => ({ label: n.label, r: 2.6, where: () => NS.ready && state.place === 'out' && !Q.on && !FB.on && people[n.id] && [n.x, n.z], go: () => nsTalk(n) })));
function houseMat(name) { if (!NS.mats) { NS.mats = {}; for (const k of Object.keys(WID)) models[k].traverse((o) => { if (o.isMesh && o.material && !NS.mats[o.material.name]) { const m = o.material.clone(); m.vertexColors = false; m.needsUpdate = true; NS.mats[o.material.name] = m; } }); } return NS.mats[name] || null; }   /* copies without the houses' baked vertex colours, which our boxes don't have */
function worldUV(geo, tile) {   /* boxes get one texture repeat per 'tile' metres, like the houses */
  geo = geo.toNonIndexed(); const p = geo.attributes.position, n = geo.attributes.normal, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) { const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)); const [a, b] = ax > 0.5 ? [p.getZ(i), p.getY(i)] : ay > 0.5 ? [p.getX(i), p.getZ(i)] : [p.getX(i), p.getY(i)]; uv[i * 2] = a / tile; uv[i * 2 + 1] = b / tile; }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return geo; }
function nsBuilding(x, z, w, d, h, col, ry, wall) {   /* the synagogue, prison and annex, dressed in the same brick, stone and tiles as the town's houses */
  const wm = houseMat(wall || 'Brick'), stoneM = houseMat('Stone'), tileM = houseMat('ClayTile');
  if (wm) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; NS.g.add(g);
    mk(worldUV(new THREE.BoxGeometry(w, h, d), 1.6), wm, 0, h / 2, 0, g);
    if (stoneM) { mk(worldUV(new THREE.BoxGeometry(w + 0.12, 0.45, d + 0.12), 1.2), stoneM, 0, 0.22, 0, g); mk(worldUV(new THREE.BoxGeometry(w + 0.2, 0.18, d + 0.2), 1.2), stoneM, 0, h - 0.05, 0, g); }   /* a stone base and cornice */
    const tri = new THREE.Shape([new THREE.Vector2(-d / 2 - 0.35, 0), new THREE.Vector2(d / 2 + 0.35, 0), new THREE.Vector2(0, h * 0.42)]); const rf = new THREE.ExtrudeGeometry(tri, { depth: w + 0.5, bevelEnabled: false }); rf.translate(0, 0, -(w + 0.5) / 2); rf.rotateY(Math.PI / 2);
    { const p = rf.attributes.position, uv = rf.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 1.4, (p.getY(i) + Math.abs(p.getZ(i))) / 1.4); }
    mk(rf, tileM || wm, 0, h + 0.04, 0, g); return g; }
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; NS.g.add(g);   /* fallback if the house materials are missing */
  const wallM = new THREE.MeshStandardMaterial({ map: noiseTex(col, 22, 3), roughness: 0.95 }); mk(new THREE.BoxGeometry(w, h, d), wallM, 0, h / 2, 0, g);
  const roofM = new THREE.MeshStandardMaterial({ map: noiseTex([96, 54, 38], 26, 4), roughness: 0.9, side: THREE.DoubleSide }); const tri = new THREE.Shape([new THREE.Vector2(-d / 2 - 0.3, 0), new THREE.Vector2(d / 2 + 0.3, 0), new THREE.Vector2(0, h * 0.36)]); const rf = new THREE.ExtrudeGeometry(tri, { depth: w + 0.4, bevelEnabled: false }); rf.translate(0, 0, -(w + 0.4) / 2); rf.rotateY(Math.PI / 2); mk(rf, roofM, 0, h, 0, g);   /* a gable roof along the length */
  return g; }
function makeTurtle(sc) {   /* a green sea turtle: domed patterned shell, pale belly, head on a neck, long front flippers, small back ones */
  const g = new THREE.Group(), u = g.userData;
  if (!NS.shellTex) { NS.shellTex = cv(256, 128, (c) => { c.fillStyle = '#5b5a34'; c.fillRect(0, 0, 256, 128);   /* scutes: plates with radiating streaks, darker seams */
      for (let col = 0; col < 8; col++) for (let row = 0; row < 3; row++) { const x0 = col * 32, y0 = [0, 30, 74][row], h = [30, 44, 54][row]; const gr = c.createRadialGradient(x0 + 16, y0 + h * 0.4, 2, x0 + 16, y0 + h * 0.5, h); gr.addColorStop(0, '#8a6a38'); gr.addColorStop(0.6, '#6a5a2e'); gr.addColorStop(1, '#3e3a20'); c.fillStyle = gr; c.fillRect(x0 + 1, y0 + 1, 30, h - 2);
        c.strokeStyle = 'rgba(30,26,12,0.9)'; c.lineWidth = 2; c.strokeRect(x0 + 1, y0 + 1, 30, h - 2); for (let k = 0; k < 6; k++) { c.strokeStyle = `rgba(${40 + Math.random() * 40},${36 + Math.random() * 30},16,0.5)`; c.lineWidth = 1; c.beginPath(); c.moveTo(x0 + 16, y0 + h * 0.4); c.lineTo(x0 + 4 + Math.random() * 24, y0 + (Math.random() < 0.5 ? 2 : h - 2)); c.stroke(); } } });
    NS.skinTex = cv(64, 64, (c) => { c.fillStyle = '#7d7a5c'; c.fillRect(0, 0, 64, 64); for (let i = 0; i < 70; i++) { c.fillStyle = `rgba(${200 + Math.random() * 40},${196 + Math.random() * 30},170,0.55)`; const s = 2 + Math.random() * 4; c.fillRect(Math.random() * 64, Math.random() * 64, s, s * 0.8); } }); NS.skinTex.wrapS = NS.skinTex.wrapT = THREE.RepeatWrapping; }
  const shellM = new THREE.MeshStandardMaterial({ map: NS.shellTex, roughness: 0.45 }), skinM = new THREE.MeshStandardMaterial({ map: NS.skinTex, roughness: 0.7 }), bellyM = new THREE.MeshStandardMaterial({ color: 0xd8cfa0, roughness: 0.8 });
  const cg = new THREE.SphereGeometry(1, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2); const cp = cg.attributes.position; for (let i = 0; i < cp.count; i++) { const z = cp.getZ(i); cp.setZ(i, z * (z > 0 ? 1.0 : 1.18)); cp.setX(i, cp.getX(i) * (1 - Math.max(0, -z) * 0.25)); } cg.computeVertexNormals();   /* longer and narrower at the back, like a heart */
  const shell = mk(cg, shellM, 0, 0, 0, g); shell.scale.set(0.34, 0.12, 0.42);
  const bel = mk(new THREE.CircleGeometry(1, 24), bellyM, 0, -0.005, 0, g); bel.rotation.x = Math.PI / 2; bel.scale.set(0.32, 0.42, 1);
  const neck = mk(new THREE.CylinderGeometry(0.045, 0.055, 0.12, 10), skinM, 0, 0.0, 0.43, g); neck.rotation.x = Math.PI / 2;
  const head = new THREE.Group(); head.position.set(0, 0.01, 0.48); g.add(head); const hd = mk(new THREE.SphereGeometry(1, 14, 10), skinM, 0, 0, 0.06, head); hd.scale.set(0.065, 0.055, 0.09); u.head = head;
  for (const sx of [-1, 1]) mk(new THREE.SphereGeometry(0.012, 6, 5), new THREE.MeshStandardMaterial({ color: 0x111111 }), sx * 0.045, 0.02, 0.1, head);
  const paddle = (len, wid) => { const sh = new THREE.Shape(); sh.moveTo(0, -wid * 0.5); sh.quadraticCurveTo(len * 0.55, -wid * 0.9, len, -wid * 0.1); sh.quadraticCurveTo(len * 0.5, wid * 0.55, 0, wid * 0.5); return new THREE.ExtrudeGeometry(sh, { depth: 0.018, bevelEnabled: false }); };
  u.fl = []; for (const [sx, z, len, wid] of [[-1, 0.24, 0.42, 0.13], [1, 0.24, 0.42, 0.13], [-1, -0.32, 0.17, 0.09], [1, -0.32, 0.17, 0.09]]) { const pv = new THREE.Group(); pv.position.set(sx * 0.24, -0.01, z); g.add(pv);
    const geo = paddle(len, wid); geo.rotateX(-Math.PI / 2); if (sx < 0) geo.scale(-1, 1, 1); geo.translate(0, -0.009, 0); const f = mk(geo, skinM, 0, 0, 0, pv); f.rotation.y = sx * (z > 0 ? -0.55 : -2.3); u.fl.push(pv); }
  g.scale.setScalar(sc); return g; }
function buildNewStreet() { if (NS.g) return; const g = new THREE.Group(); NS.g = g; scene.add(g); const prev = cur; cur = g;
  const Z = NS.z, SZ = Z + S + 4;
  /* the lane: worn sand with a darker trodden middle */
  const laneX1 = SHORE - 3.0, laneX0 = NS.x0 - 1; const lane = mk(new THREE.PlaneGeometry(laneX1 - laneX0, 2 * S - 0.6), new THREE.MeshStandardMaterial({ map: noiseTex([178, 156, 118], 30, 12), roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), (laneX0 + laneX1) / 2, 0.016, Z, g); lane.rotation.x = -Math.PI / 2;   /* stops short of the quay's wet strip, and always draws on top of the sand: no flicker */
  /* south side, west to east: the Marshalsea, the synagogue, the goldsmith, a merchant's house */
  const mar = nsBuilding(NS.x0 + 3.2, SZ - 1.4, 6, 5.4, 4.2, [138, 132, 120], Math.PI, 'Stone');
  const door = (gr, x, w, h, z) => mk(worldUV(new THREE.BoxGeometry(w, h, 0.12), 1.2), houseMat('Wood') || new THREE.MeshStandardMaterial({ map: plankTex([70, 46, 30], 4, 1, 1), roughness: 0.9 }), x, h / 2, z, gr);
  door(mar, 0, 1.1, 2.0, 2.76); for (const bx of [-1.8, 1.8]) { mk(new THREE.BoxGeometry(0.9, 0.7, 0.1), new THREE.MeshStandardMaterial({ color: 0x1b1a18 }), bx, 2.6, 2.76, mar); for (let i = -2; i <= 2; i++) mk(new THREE.CylinderGeometry(0.025, 0.025, 0.72, 6), new THREE.MeshStandardMaterial({ color: 0x3a3836, metalness: 0.6, roughness: 0.5 }), bx + i * 0.17, 2.6, 2.82, mar); }   /* barred windows */
  const syn = nsBuilding(3.4, SZ - 1.2, 8.4, 6, 5.2, [170, 98, 72], Math.PI);
  door(syn, 0, 1.4, 2.6, 3.06); const winM = houseMat('LeadedGlass') || new THREE.MeshStandardMaterial({ color: 0x24303a, roughness: 0.3, metalness: 0.2 });
  for (const wx of [-3, -1.6, 1.6, 3]) { mk(new THREE.BoxGeometry(0.7, 2.0, 0.1), winM, wx, 2.9, 3.03, syn); mk(new THREE.CircleGeometry(0.35, 18), winM, wx, 3.9, 3.085, syn); }   /* round tops make the windows arched */
  const step = mk(new THREE.BoxGeometry(2.4, 0.18, 0.7), new THREE.MeshStandardMaterial({ map: noiseTex([150, 144, 130], 18, 2) }), 0, 0.09, 3.35, syn);
  const place = (k, x, ry) => { const m = models[k].clone(true); m.position.set(x, 0, SZ); m.rotation.y = ry; g.add(m); return m; };
  const gold = place('h5', 10.3, Math.PI); const sign = new THREE.Group(); sign.position.set(0, 3.2, 4.9); gold.add(sign);
  mk(new THREE.BoxGeometry(0.06, 0.06, 0.9), new THREE.MeshStandardMaterial({ color: 0x2a2420 }), 0, 0, 0.3, sign); const ringM = new THREE.MeshStandardMaterial({ color: 0xd8b24a, metalness: 0.9, roughness: 0.25 });
  const rg = mk(new THREE.TorusGeometry(0.22, 0.05, 8, 20), ringM, 0, -0.32, 0.6, sign); rg.rotation.y = Math.PI / 2;   /* a gold ring hangs over the goldsmith's door */
  place('h2', 15.6, Math.PI);
  /* the west end of the lane is closed by a house end-on */
  const endH = models.h3.clone(true); endH.position.set(NS.x0 - 5.9, 0, Z); endH.rotation.y = Math.PI / 2; g.add(endH);
  { const an = nsBuilding(NS.x0 - 1.3, Z + 7.0, 3.0, 7.4, 3.4, [138, 132, 120], Math.PI / 2, 'Stone'); for (const zz of [-1.6, 1.6]) mk(new THREE.BoxGeometry(0.1, 0.6, 0.5), new THREE.MeshStandardMaterial({ color: 0x1b1a18 }), 1.52, 2.4, zz, an); }   /* a stone annex joins the prison to the end house: no gap */
  /* north side: market stalls against the backs of the main street's houses */
  const clothCols = [0xb04a36, 0xd8c08a, 0x4c7a5a, 0x8a5a3a]; const woodM = new THREE.MeshStandardMaterial({ map: plankTex([120, 88, 56], 4, 1, 1), roughness: 0.95 });
  makeTurtle(1);   /* makes the shared shell texture */
  const basketM = new THREE.MeshStandardMaterial({ map: cv(64, 32, (c) => { c.fillStyle = '#a8844c'; c.fillRect(0, 0, 64, 32); for (let y = 0; y < 32; y += 4) for (let x = 0; x < 64; x += 8) { c.fillStyle = ((x + y) / 4) % 2 ? '#8a6a38' : '#c09a5a'; c.fillRect(x + ((y / 4) % 2) * 4, y, 7, 3); } }), roughness: 0.95 });
  NS.pineTex = cv(64, 64, (c) => { c.fillStyle = '#9a7a2a'; c.fillRect(0, 0, 64, 64); for (let y = 0; y < 64; y += 8) for (let x = 0; x < 64; x += 8) { c.fillStyle = '#c89a3a'; c.beginPath(); c.moveTo(x + 4 + ((y / 8) % 2) * 4, y); c.lineTo(x + 8 + ((y / 8) % 2) * 4, y + 4); c.lineTo(x + 4 + ((y / 8) % 2) * 4, y + 8); c.lineTo(x + ((y / 8) % 2) * 4, y + 4); c.fill(); c.fillStyle = '#5a4418'; c.fillRect(x + 3 + ((y / 8) % 2) * 4, y + 3, 2, 2); } });
  NS.fishTex = cv(64, 32, (c) => { const g2 = c.createLinearGradient(0, 0, 0, 32); g2.addColorStop(0, '#4a6470'); g2.addColorStop(0.5, '#b8c6c8'); g2.addColorStop(1, '#e8ece6'); c.fillStyle = g2; c.fillRect(0, 0, 64, 32); for (let i = 0; i < 40; i++) { c.fillStyle = 'rgba(40,60,70,0.25)'; c.fillRect(Math.random() * 64, Math.random() * 14, 2, 2); } });
  NS.melonTex = cv(128, 32, (c) => { c.fillStyle = '#4f8a3a'; c.fillRect(0, 0, 128, 32); c.fillStyle = '#2a5a24'; for (let x = 0; x < 128; x += 16) { c.beginPath(); c.moveTo(x, 0); for (let y = 0; y <= 32; y += 4) c.lineTo(x + 3 + Math.sin(y * 0.7 + x) * 2, y); c.lineTo(x + 8, 32); for (let y = 32; y >= 0; y -= 4) c.lineTo(x + 8 + Math.sin(y * 0.6 + x) * 2, y); c.fill(); } });
  NS.meatTex = cv(32, 32, (c) => { c.fillStyle = '#8a3a2c'; c.fillRect(0, 0, 32, 32); c.fillStyle = '#e6d6b8'; c.fillRect(0, 0, 32, 5); for (let i = 0; i < 18; i++) { c.fillStyle = 'rgba(230,214,184,0.45)'; c.fillRect(Math.random() * 32, 6 + Math.random() * 26, 4, 1); } });
  const stall = (x, kind, ci) => { const s = new THREE.Group(); s.position.set(x, 0, 15.15); g.add(s); mk(new THREE.BoxGeometry(2.6, 0.85, 1.0), woodM, 0, 0.42, 0, s);
    for (const px of [-1.25, 1.25]) for (const pz of [-0.45, 0.45]) mk(new THREE.CylinderGeometry(0.04, 0.04, 2.1, 6), woodM, px, 1.05, pz, s);
    const awn = mk(new THREE.PlaneGeometry(2.9, 1.4, 6, 2), new THREE.MeshStandardMaterial({ color: clothCols[ci], side: THREE.DoubleSide, roughness: 1 }), 0, 2.05, 0.05, s); awn.rotation.x = -Math.PI / 2 + 0.28;
    const cloth = mk(new THREE.BoxGeometry(2.5, 0.015, 0.9), new THREE.MeshStandardMaterial({ map: noiseTex([200, 186, 150], 18, 2), roughness: 1 }), 0, 0.855, 0, s);   /* a linen cloth over the table */
    const M = (c, r = 0.7) => new THREE.MeshStandardMaterial({ color: c, roughness: r }), rnd = (a) => (Math.random() - 0.5) * a;
    const basket = (bx, bz, r) => { const b = mk(new THREE.CylinderGeometry(r, r * 0.8, 0.14, 16, 1, true), basketM, bx, 0.93, bz, s); b.material.side = THREE.DoubleSide; mk(new THREE.CircleGeometry(r * 0.8, 16), basketM, bx, 0.865, bz, s).rotation.x = -Math.PI / 2; mk(new THREE.TorusGeometry(r, 0.014, 5, 20), M(0x7a5a30, 0.9), bx, 1.0, bz, s).rotation.x = Math.PI / 2; };
    const heap = (bx, bz, r, geo, mat, n, top = 0.97) => { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * r * 0.75; const m = mk(geo, mat, bx + Math.cos(a) * d, top + (1 - d / r) * 0.06 + Math.random() * 0.03, bz + Math.sin(a) * d, s); m.rotation.set(rnd(1), Math.random() * 6, rnd(1)); } };
    if (kind === 'fruit') {   /* plantains, pineapples, oranges and limes in baskets */
      basket(-0.8, 0, 0.3); basket(0, 0.05, 0.28); basket(0.8, 0, 0.3);
      heap(-0.8, 0, 0.3, new THREE.SphereGeometry(0.06, 10, 8), M(0xd98a2a, 0.55), 12); heap(0.8, 0, 0.3, new THREE.SphereGeometry(0.05, 10, 8), M(0x6f9a32, 0.5), 14);
      for (let k = 0; k < 2; k++) { const pa = new THREE.Group(); pa.position.set(-0.08 + k * 0.17, 1.03, 0.05 + rnd(0.1)); s.add(pa); const body = mk(new THREE.SphereGeometry(0.075, 10, 8), new THREE.MeshStandardMaterial({ map: NS.pineTex, roughness: 0.8 }), 0, 0, 0, pa); body.scale.set(1, 1.45, 1); for (let l = 0; l < 7; l++) { const lf = mk(new THREE.ConeGeometry(0.018, 0.16, 4), M(0x3f6a2a, 0.8), 0, 0.15, 0, pa); lf.rotation.set(0.4 * Math.cos(l), l, 0.4 * Math.sin(l)); } }
      for (let h = 0; h < 3; h++) { const bunch = new THREE.Group(); bunch.position.set(-1.0 + h * 0.95, 1.85, 0.2); s.add(bunch); for (let f = 0; f < 6; f++) { const pl = mk(new THREE.CapsuleGeometry(0.025, 0.2, 3, 6), M(f % 3 ? 0x6f8a2c : 0x8a9a36, 0.6), Math.cos(f) * 0.05, -0.12, Math.sin(f) * 0.05, bunch); pl.rotation.set(0.35 * Math.cos(f), 0, 0.35 * Math.sin(f)); } mk(new THREE.CylinderGeometry(0.008, 0.008, 0.22, 4), M(0x6a5236), 0, 0, 0, bunch); }   /* plantains hang from the awning frame */
      for (const [wx, wz] of [[-0.35, -0.3], [0.42, -0.3], [0.05, -0.33]]) { const w = mk(new THREE.SphereGeometry(0.14, 16, 12), new THREE.MeshStandardMaterial({ map: NS.melonTex, roughness: 0.5 }), wx, 1.0, wz, s); w.scale.set(1.25, 0.9, 0.95); w.rotation.y = Math.random(); }   /* watermelons: one real each */
      mk(new THREE.CylinderGeometry(0.012, 0.012, 2.5, 5), woodM, 0, 1.96, 0.2, s).rotation.z = Math.PI / 2; }
    else if (kind === 'herbs') {   /* tied bunches of herbs, peppers and roots */
      const herbM = M(0x4f7a34, 0.85), stemM = M(0x8a7a4a, 0.9), tieM = M(0xb8a070, 0.9);
      for (let k = 0; k < 7; k++) { const bn = new THREE.Group(); bn.position.set(-1.0 + k * 0.3, 0.9, -0.15 + rnd(0.15)); bn.rotation.set(Math.PI / 2 - 0.15, rnd(0.6), 0); s.add(bn); for (let l = 0; l < 6; l++) { const lf = mk(new THREE.SphereGeometry(0.045, 6, 5), herbM, rnd(0.07), 0.13 + rnd(0.05), rnd(0.05), bn); lf.scale.set(1, 1.6, 0.7); } mk(new THREE.CylinderGeometry(0.018, 0.022, 0.18, 6), stemM, 0, 0, 0, bn); mk(new THREE.TorusGeometry(0.023, 0.007, 4, 10), tieM, 0, 0.03, 0, bn).rotation.x = Math.PI / 2; }
      basket(0.55, 0.22, 0.2); heap(0.55, 0.22, 0.2, new THREE.ConeGeometry(0.018, 0.08, 6), M(0xc0301e, 0.5), 18);   /* red peppers */
      basket(-0.5, 0.25, 0.2); heap(-0.5, 0.25, 0.2, new THREE.SphereGeometry(0.05, 8, 6), M(0x8a6a44, 0.95), 9);   /* yams and roots */
      for (let k = 0; k < 2; k++) { const cb = new THREE.Group(); cb.position.set(-0.05 + k * 0.28, 0.9, 0.28); cb.rotation.y = k * 0.6; s.add(cb); for (let c2 = 0; c2 < 6; c2++) { const cr = mk(new THREE.ConeGeometry(0.022, 0.2, 7), M(0xe07a22, 0.6), rnd(0.06), 0.012, rnd(0.05), cb); cr.rotation.z = Math.PI / 2; const top = mk(new THREE.ConeGeometry(0.03, 0.12, 5), M(0x4f8a34, 0.85), rnd(0.06) - 0.15, 0.03, rnd(0.05), cb); top.rotation.z = -Math.PI / 2; } }   /* carrots */
      for (let k = 0; k < 4; k++) { const hb = new THREE.Group(); hb.position.set(-0.9 + k * 0.6, 1.8, 0.2); s.add(hb); for (let l = 0; l < 6; l++) { const lf = mk(new THREE.SphereGeometry(0.04, 6, 5), M(0x6a7a3a, 0.9), rnd(0.07), -0.12 + rnd(0.06), rnd(0.07), hb); lf.scale.set(1, 1.8, 0.7); } mk(new THREE.CylinderGeometry(0.006, 0.006, 0.16, 4), stemM, 0, 0, 0, hb); }   /* bunches drying upside down */
      mk(new THREE.CylinderGeometry(0.012, 0.012, 2.5, 5), woodM, 0, 1.9, 0.2, s).rotation.z = Math.PI / 2; }
    else if (kind === 'fish') {   /* fish with tails, laid on green leaves */
      for (let k = 0; k < 4; k++) { const lf = mk(new THREE.CircleGeometry(0.3, 12), M(0x4a7a3a, 0.6), -0.9 + k * 0.6, 0.866, 0, s); lf.rotation.x = -Math.PI / 2; lf.scale.set(1, 0.6, 1); }
      const fishM = [new THREE.MeshStandardMaterial({ map: NS.fishTex, roughness: 0.3, metalness: 0.35 }), new THREE.MeshStandardMaterial({ map: NS.fishTex, color: 0xd88a6a, roughness: 0.35, metalness: 0.25 })];
      for (let k = 0; k < 9; k++) { const f = new THREE.Group(); f.position.set(-1.0 + (k % 5) * 0.48 + rnd(0.06), 0.89, k < 5 ? -0.12 : 0.18); f.rotation.y = rnd(0.5) + (k % 2) * Math.PI; s.add(f); const fm = fishM[k % 3 === 0 ? 1 : 0];
        const b = mk(new THREE.SphereGeometry(0.1, 12, 8), fm, 0, 0, 0, f); b.scale.set(1.7, 0.42, 0.55); const tail = mk(new THREE.ConeGeometry(0.06, 0.1, 3), fm, -0.2, 0, 0, f); tail.rotation.z = Math.PI / 2; tail.scale.set(1, 1, 0.25); mk(new THREE.SphereGeometry(0.01, 5, 4), M(0x111111, 0.2), 0.13, 0.01, 0.03, f); } }
    else if (kind === 'meat') {   /* salted cuts hanging from a rail, and a turtle shell */
      mk(new THREE.CylinderGeometry(0.014, 0.014, 2.5, 5), woodM, 0, 1.85, 0.2, s).rotation.z = Math.PI / 2;
      for (let k = 0; k < 5; k++) { const cut = new THREE.Group(); cut.position.set(-1.0 + k * 0.5, 1.6, 0.2); s.add(cut); mk(new THREE.CylinderGeometry(0.004, 0.004, 0.2, 3), M(0x8a7a5a), 0, 0.15, 0, cut); const m = mk(new THREE.SphereGeometry(0.1, 12, 9), new THREE.MeshStandardMaterial({ map: NS.meatTex, roughness: 0.65 }), 0, -0.05, 0, cut); m.scale.set(0.8, 1.35, 0.55); }
      if (NS.shellTex) { const cg = new THREE.SphereGeometry(1, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2); const sh = mk(cg, new THREE.MeshStandardMaterial({ map: NS.shellTex, roughness: 0.45 }), 0.55, 0.87, 0.05, s); sh.scale.set(0.3, 0.12, 0.38); sh.rotation.y = 0.5; }
      basket(-0.55, 0.05, 0.26); heap(-0.55, 0.05, 0.26, new THREE.BoxGeometry(0.1, 0.05, 0.08), new THREE.MeshStandardMaterial({ map: NS.meatTex, roughness: 0.7 }), 8); }
    NS.col.push([x - 1.4, 14.55, x + 1.4, 15.75]); return s; };
  stall(5.6, 'herbs', 1); stall(9.6, 'fruit', 0); stall(13.4, 'meat', 2); stall(16.6, 'fish', 3);
  /* the market bell on its post, and the stocks */
  const bellPost = mk(new THREE.CylinderGeometry(0.08, 0.1, 3.2, 8), woodM, 1.2, 1.6, 15.0, g); mk(new THREE.BoxGeometry(0.9, 0.1, 0.1), woodM, 1.2, 3.1, 15.0, g);
  const bell = mk(new THREE.CylinderGeometry(0.1, 0.22, 0.32, 14, 1, true), new THREE.MeshStandardMaterial({ color: 0xa8843a, metalness: 0.85, roughness: 0.35, side: THREE.DoubleSide }), 1.5, 2.86, 15.0, g); NS.bell = bell; NS.col.push([0.95, 14.75, 1.45, 15.25]);
  const stocks = new THREE.Group(); stocks.position.set(-1.4, 0, 15.2); g.add(stocks); mk(new THREE.BoxGeometry(1.8, 0.28, 0.14), woodM, 0, 0.62, 0, stocks); mk(new THREE.BoxGeometry(1.8, 0.1, 0.14), woodM, 0, 0.82, 0, stocks);
  for (const sx of [-0.85, 0.85]) mk(new THREE.BoxGeometry(0.12, 0.95, 0.2), woodM, sx, 0.47, 0, stocks); mk(new THREE.BoxGeometry(1.6, 0.06, 0.4), woodM, 0, 0.35, -0.4, stocks); NS.col.push([-2.4, 14.9, -0.4, 15.6]);
  for (const sx of [-0.45, 0.45]) { const hole = mk(new THREE.CylinderGeometry(0.06, 0.06, 0.16, 10), new THREE.MeshStandardMaterial({ color: 0x1a1612 }), sx, 0.7, 0, stocks); hole.rotation.x = Math.PI / 2; }
  /* the turtle crawl: a pen of stakes in the shallow water at the harbour corner, with turtles in it */
  const crawl = new THREE.Group(); crawl.position.set(26.5, 0, 12.4);   /* every stake stands in the water, clear of the shore */ g.add(crawl); const stakeM = new THREE.MeshStandardMaterial({ map: plankTex([96, 74, 52], 3, 1, 1), roughness: 1 });
  for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, r = 2.0; mk(new THREE.CylinderGeometry(0.05, 0.06, 1.3, 5), stakeM, Math.cos(a) * r * 1.2, 0.1, Math.sin(a) * r, crawl); }
  NS.turtles = []; for (let i = 0; i < 4; i++) { const t = makeTurtle(0.85 + Math.random() * 0.25); t.userData.a = (i % 2) * Math.PI + (i > 1 ? 1.2 : 0); t.userData.sp = 0.16; t.userData.r = i > 1 ? 1.55 : 0.55;   /* two lanes, two turtles each, opposite sides: they never bump */ t.userData.ph = Math.random() * 6; crawl.add(t); NS.turtles.push(t); }
  { const post = new THREE.Group(); post.position.set(20.1, 0, 13.9);   /* at the mouth of the new street, with the boards clear of the brick wall */ g.add(post); mk(new THREE.CylinderGeometry(0.06, 0.07, 2.6, 8), woodM, 0, 1.3, 0, post);   /* a fingerpost at the harbour corner */
    const board = (txt, y, flip) => { const tex = cv(256, 64, (c) => { c.fillStyle = '#e9dcbc'; c.fillRect(0, 0, 256, 64); c.strokeStyle = '#5a3f26'; c.lineWidth = 4; c.strokeRect(2, 2, 252, 60); c.fillStyle = '#3a2614'; c.font = 'bold 30px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 128, 34); });
      const b = mk(new THREE.BoxGeometry(1.5, 0.36, 0.05), [woodM, woodM, woodM, woodM, new THREE.MeshStandardMaterial({ map: tex }), new THREE.MeshStandardMaterial({ map: tex })], -0.7, y, 0, post); b.rotation.y = flip; };
    board('Market', 2.25, 0.12); board('Jews Street', 1.85, -0.12);   /* both point west, into the new street */ }
  { /* the harbour-corner beach strip: tufts of grass along the wall foot and the water's edge, and a scatter of stones */
    const bt = cv(64, 128, (c) => { c.clearRect(0, 0, 64, 128); for (let k = 0; k < 14; k++) { const x = 6 + Math.random() * 52, lean = (Math.random() - 0.5) * 26, h = 50 + Math.random() * 70; c.strokeStyle = `rgb(${100 + Math.random() * 60},${118 + Math.random() * 40},${52 + Math.random() * 24})`; c.lineWidth = 2 + Math.random() * 2; c.beginPath(); c.moveTo(x, 128); c.quadraticCurveTo(x + lean * 0.3, 128 - h * 0.5, x + lean, 128 - h); c.stroke(); } }); bt.wrapS = bt.wrapT = THREE.ClampToEdgeWrapping;
    const gm = new THREE.MeshStandardMaterial({ map: bt, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 1 }), tuft = (x, z, k) => { const t = new THREE.Group(); t.position.set(x, 0, z); t.rotation.y = Math.random() * 6; t.scale.set(k, k * (0.7 + Math.random() * 0.5), k); g.add(t); for (let j = 0; j < 3; j++) { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.6), gm); p.position.y = 0.3; p.rotation.y = j * Math.PI / 3; t.add(p); } };
    const spots = []; for (let z = 6.9; z < 13.2; z += 0.55 + Math.random() * 0.7) { spots.push([18.25 + Math.random() * 0.5, z]); if (Math.random() < 0.7) spots.push([22.1 + Math.random() * 0.55, z + Math.random() * 0.4]); }
    for (let z = 14.8; z < 21.0; z += 0.8 + Math.random() * 0.9) spots.push([21.7 + Math.random() * 0.9, z]);   /* along the shore past the signpost */
    for (const [x, z] of spots) tuft(x, z, 0.45 + Math.random() * 0.5);
    const stoneM = new THREE.MeshStandardMaterial({ map: noiseTex([128, 120, 108], 30, 2), roughness: 0.95, flatShading: true }), stoneG = new THREE.DodecahedronGeometry(0.5, 0);
    const stones = [[18.6, 8.1], [18.4, 10.6], [22.5, 7.6], [22.3, 9.9], [22.6, 11.8], [18.5, 12.4], [21.9, 16.2], [22.4, 18.4], [22.0, 20.2], [19.9, 9.0]];
    for (const [x, z] of stones) for (let k = 0; k < 1 + (Math.random() * 3 | 0); k++) { const r = mk(stoneG, stoneM, x + (Math.random() - 0.5) * 0.5, 0.02, z + (Math.random() - 0.5) * 0.5, g); const sc = 0.12 + Math.random() * 0.22; r.scale.set(sc * (1 + Math.random() * 0.5), sc * 0.55, sc); r.rotation.set(Math.random(), Math.random() * 6, Math.random()); } }
  NS.crawl = crawl; cur = prev;
  /* the four people */
  const PREP = (gl) => prep(gl.scene);
  for (const [id, file] of [['peter', 'turtler'], ['mendes', 'mendes'], ['hart', 'constable']]) model(file).then((gl) => { const m = PREP(gl); const n = NS_PEOPLE.find((p) => p.id === id); m.position.set(n.x, 0, n.z); m.rotation.y = n.ry; g.add(m); people[id] = m; animate(m); }).catch(() => {});
  { const keep = abba.userData.anim; delete abba.userData.anim; const m = skClone(abba); abba.userData.anim = keep; const solid = { Bodice: 0x8c2a22, Wool: 0x2f6a66 }, tint = { Linen: [1.0, 0.82, 0.42], Skin: [0.82, 0.74, 0.7], 'Human.low-poly': [0.82, 0.74, 0.7] };
    m.traverse((o) => { if (o.isMesh) { o.material = o.material.clone(); const nm = o.material.name; const sk = Object.keys(solid).find((t) => nm.startsWith(t)); if (sk) { o.material.vertexColors = false; o.material.color.setHex(solid[sk]); o.material.needsUpdate = true; }   /* her own colours: red bodice, teal skirt */
      const tk = Object.keys(tint).find((t) => nm.startsWith(t)); if (tk) o.material.color.setRGB(...tint[tk]); o.frustumCulled = false; } });
    m.scale.multiply(new THREE.Vector3(1.08, 0.95, 1.08));   /* shorter and fuller than Abba */
    const hb = m.getObjectByName('mixamorigHead'); if (hb) { m.updateMatrixWorld(true); const ws = hb.getWorldScale(new THREE.Vector3()).x || 1, bk = new THREE.Group(); bk.scale.setScalar(1 / ws); bk.position.set(0, 0.2 / ws * 0.01 * 100 * 0.01, 0); hb.add(bk);
      const top = hb.worldToLocal(hb.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.2, 0))); bk.position.copy(top);
      const wick = new THREE.MeshStandardMaterial({ map: plankTex([170, 130, 74], 6, 1, 1), roughness: 1 }); const bs = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.14, 0.13, 16, 1, true), wick); wick.side = THREE.DoubleSide; bk.add(bs);
      const pad = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 6, 14), new THREE.MeshStandardMaterial({ color: 0xc9a46a })); pad.rotation.x = Math.PI / 2; pad.position.y = -0.07; bk.add(pad);   /* a cloth ring under the basket */
      for (let i = 0; i < 7; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(0.05 + Math.random() * 0.02, 8, 6), new THREE.MeshStandardMaterial({ color: [0xd9a63a, 0x3f7a2e, 0x9a3a2a][i % 3] })); f.position.set((Math.random() - 0.5) * 0.22, 0.06, (Math.random() - 0.5) * 0.22); bk.add(f); } }
    const n = NS_PEOPLE[0]; m.position.set(n.x, 0, n.z); m.rotation.y = n.ry; g.add(m); people.grace = m; animate(m); }
  NS.ready = true; }
const STROLL = { hart: [[-4, 17.4], [6, 18.8], [14, 18.2], [6, 17.6]], mendes: [[2.2, 21.6], [4.8, 21.4], [0.6, 21.2]], peter: [[21.0, 12.6], [20.6, 13.4], [21.2, 11.9]] };
TICKS.push((dt) => {   /* the new street's people stroll, and stop to face you when you come close */
  if (!NS.ready || Q.on || FB.on || state.place !== 'out') return;
  for (const n of NS_PEOPLE) { const m = people[n.id]; if (!m) continue; const ac = m.userData.anim, u = n.st || (n.st = { i: 0, wait: 1 + Math.random() * 3, walking: false }), path = STROLL[n.id];
    if (!path) { if (!ac || speaker === m) continue; u.wait -= dt; if (u.wait <= 0) { u.wait = 6 + Math.random() * 7; ac.play(['WaveSlow', 'Point', 'Talk2', 'Talk1'][Math.random() * 4 | 0], true); } continue; }   /* sellers stay put and call out now and then */
    const near = Math.hypot(state.x - n.x, state.z - n.z) < 3.6 || (speaker === m && !$('dialogue').hidden);
    if (near || u.wait > 0) { if (!near) u.wait -= dt; if (u.walking) { u.walking = false; if (ac) ac.rest(); } continue; }
    const [tx, tz] = path[u.i], dx = tx - n.x, dz = tz - n.z, d = Math.hypot(dx, dz);
    if (d < 0.12) { u.i = (u.i + 1) % path.length; u.wait = 2 + Math.random() * 4; continue; }
    if (!u.walking) { u.walking = true; if (ac) ac.play('Walk'); }
    const v = Math.min(d, 0.75 * dt); n.x += dx / d * v; n.z += dz / d * v; m.position.x = n.x; m.position.z = n.z;
    let e = Math.atan2(dx, dz) - m.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); m.rotation.y += e * Math.min(1, dt * 6); } });
TICKS.push((dt) => { if (!NS.g) return; const show = !Q.on && !FB.on && (state.place === 'out'); NS.g.visible = show; if (!show) return; const t = performance.now() / 1000;
  for (const tu of NS.turtles) { const u = tu.userData; u.a += u.sp * dt; const st = t * 1.6 + u.ph, k = Math.sin(st);   /* green turtles 'fly' with both front flippers together */
    tu.position.set(Math.cos(u.a) * u.r * 1.2, -0.3 + Math.sin(st) * 0.025, Math.sin(u.a) * u.r); tu.rotation.set(Math.sin(st) * 0.05, Math.atan2(-1.2 * Math.sin(u.a), Math.cos(u.a)), Math.sin(t * 0.7 + u.ph) * 0.06);   /* head first, along the way it is swimming */
    u.fl[0].rotation.set(0, 0.35 + k * 0.25, -0.15 - k * 0.55); u.fl[1].rotation.set(0, -0.35 - k * 0.25, 0.15 + k * 0.55); u.fl[2].rotation.y = 0.5 + Math.sin(st + 1) * 0.2; u.fl[3].rotation.y = -0.5 - Math.sin(st + 1) * 0.2; u.head.rotation.y = Math.sin(t * 0.5 + u.ph) * 0.25; }
  NS.bell.rotation.z = Math.sin(t * 0.8) * 0.03; });

/* ---------- test-only autoplayer (?auto=<chapter>): follows what the game offers, logs it, and flags stalls ---------- */
if (__DEV__ && new URLSearchParams(location.search).has('auto')) {
  const AQ = new URLSearchParams(location.search), START = +AQ.get('auto') || 0, used = {}, LOG = [], pre = document.createElement('pre'); pre.id = 'autolog'; pre.hidden = true; document.body.appendChild(pre);
  const T0 = performance.now(), log = (m) => { LOG.push(((performance.now() - T0) / 1000).toFixed(1) + 's ' + m); pre.textContent = LOG.join('\n'); };
  window.addEventListener('error', (e) => log('JS ERROR ' + e.message + ' @' + (e.filename || '').split('/').pop() + ':' + e.lineno));
  let last = {}, lastMove = performance.now(), chap = START, started = false, stalls = 0;
  const snap = () => ({ goal: goalText, place: state.place, phase: Q.on ? Q.phase : '-', fb: FB.on ? FB.step : '-', pages: state.unlocked.length, card: $('card').hidden ? '' : $('ctitle').textContent, who: $('dialogue').hidden ? '' : $('who').textContent });
  const beginChapter = () => { state.ch.all = true; log('=== CHAPTER ' + chap + ': ' + CHAPTERS[chap].name); playChapter(CHAPTERS[chap]); started = true; lastMove = performance.now(); for (const k in used) delete used[k]; stalls = 0; };
  setInterval(() => {
    if (!tavernReady || !townReady || started === 'end') return;
    if (!started) { if (!state.started) $('start').click(); if (chap === 0) { started = true; log('=== CHAPTER 0: ' + CHAPTERS[0].name); goArrive(); } else beginChapter(); return; }
    const s = snap(); for (const k in s) if (s[k] !== last[k]) { if (k !== 'who' || s[k]) log(k + ' -> ' + JSON.stringify(s[k])); lastMove = performance.now(); } last = s;
    if (!$('card').hidden) { const b = [...$('cbtns').querySelectorAll('button')].find((x) => !x.disabled && !/^Stay$/.test(x.textContent)); if (b) { log('card button: ' + b.textContent); b.click(); } return; }
    if (!$('dialogue').hidden) { const ch = [...$('choices').querySelectorAll('button')].filter((x) => !x.disabled); if (ch.length) ch[0].click(); else $('next').click(); return; }
    if (!$('chapters').hidden || !$('journal')?.hidden) { $('chapters').hidden = true; closeJournal(); busy = false; return; }
    if (busy) return;
    if (CHAPTERS[chap].done() && performance.now() - lastMove > 4000) { log('chapter ' + chap + ' DONE'); if (++chap >= CHAPTERS.length || AQ.has('one')) { log('ALL DONE'); started = 'end'; return; } beginChapter(); return; }
    const acts = ACTIONS.filter((a) => !!FB.on === !!a.fb).map((a) => [a, a.where()]).filter(([a, w]) => w && (used[a.label + '|' + goalText] || 0) < 1 && !/wharf/.test(a.label));
    const EXIT = /back to the street|Go out|Leave|Go outside|Back to|Go home/i; const pref = acts.filter(([a]) => !EXIT.test(a.label)); const pickA = pref.length ? pref : (performance.now() - lastMove > 6000 ? acts : []);
    if (pickA.length) { const [a, w] = pickA[0]; used[a.label + '|' + goalText] = (used[a.label + '|' + goalText] || 0) + 1; state.x = w[0] + 0.7; state.z = w[1] + 0.2; if (FORT.ready && onSpit(state.x, state.z)) { try { state.fz = fz(state.x, state.z, state.fz) || state.fz; } catch (e) {} } log('do: ' + a.label + ' @' + w.map((v) => v.toFixed(1)).join(',')); a.go(); lastMove = performance.now(); return; }
    /* walk-to goals the game checks by position */
    if (/pier and into the town/.test(goalText)) { state.x = SHORE - 3; state.z = 0.3; return; }
    if (Q.on && Q.phase === 'calm') { state.x = 10; state.z = 0.4; return; }
    if (Q.on && /tremor|main|swallow/.test(Q.phase)) { Q.t += 1; if (Q.phase === 'main') { state.x = Math.min(state.x + 0.5, SHORE - 1); } }   /* headless draws few frames; move the quake clock on */
    if (Q.on && Q.phase === 'sea' && Q.boat) { state.x = Q.boat.position.x + 1; state.z = Q.boat.position.z; return; }
    if (performance.now() - lastMove > 20000) { stalls++; log('STALL #' + stalls + ' goal="' + goalText + '" place=' + state.place + ' phase=' + (Q.on ? Q.phase : '-') + ' pos=' + state.x.toFixed(1) + ',' + state.z.toFixed(1)); lastMove = performance.now(); for (const k in used) used[k] = 0; if (stalls >= 3) { log('giving up on chapter ' + chap); if (++chap >= CHAPTERS.length || AQ.has('one')) { started = 'end'; return; } beginChapter(); } }
  }, 250);
}
window.claude?.hot?.snapshot?.(() => (state.place === 'out' && !Q.on ? { ...state, step: 0 } : { ...state, step: 0, place: 'out', x: 17, z: 0.4, yaw: Math.PI / 2, pitch: 0 }));
if (window.claude?.hot?.ready) window.claude.hot.ready(start); else start(window.claude?.hot?.data ?? {});

/* every chapter change goes through a short fade with the date */
goArrive = chapterFade('goArrive', goArrive); leaveWare = chapterFade('leaveWare', leaveWare); beginWare = chapterFade('beginWare', beginWare); beginQuake = chapterFade('beginQuake', beginQuake); beginAfter = chapterFade('beginAfter', beginAfter); toYard = chapterFade('toYard', toYard); leaveQuake = chapterFade('leaveQuake', leaveQuake);

/* credits */
$('dev').onclick = () => { $('credits').hidden = false; }; $('crclose').onclick = () => { $('credits').hidden = true; }; $('chcred').onclick = () => { $('credits').hidden = false; };

/* first person or third person (see Lewis Galdy) */
function toggleView() { if (!galdy || FB.on) return;   /* in Ned’s story you are young Ned, so no Galdy view */ third = !third; $('view').setAttribute('aria-pressed', String(third)); toast(third ? 'You can see Lewis Galdy. Press V to look through his eyes again.' : 'You see through Galdy\u2019s eyes.'); }
$('view').onclick = toggleView; addEventListener('keydown', (e) => { if ((e.key === 'v' || e.key === 'V') && !e.repeat && document.activeElement?.tagName !== 'INPUT') toggleView(); });

/* reset: this chapter again, or the whole story */
function chapterNow() { if (FB.on) return 1; if (state.place === 'ware') return 2; if (Q.on && Q.phase === 'yard') return 5; if (Q.on && (Q.phase === 'after' || state.place === 'after')) return 4; if (Q.on) return 3; return 0; }
$('reset').onclick = () => { if (fading) return; closeJournal(); const i = chapterNow(), c = CHAPTERS[i];
  card('Reset', ['Start this chapter again, or start the whole story again.'], [{ t: 'Restart \u201c' + c.name + '\u201d', go: () => { hideCard(); if (i === 0) { state.x = 43; state.z = 0; } c.go(); } }, { t: 'Start the whole story again', go: () => card('Start again?', ['This wipes everything, even your journal.'], [{ t: 'Yes, start again', go: () => { try { localStorage.removeItem(SAVE_KEY); sessionStorage.setItem('pr-fresh', '1'); } catch (e) { /* ignore */ } location.reload(); } }, { t: 'No, keep playing', go: hideCard }]) }, { t: 'Cancel', go: hideCard }, ...(MENU.ok ? [{ t: 'All games', go: () => { saveGame(); location.href = MENU.url; } }] : [])]); };

/* ================= Pirates, Henry Morgan, Fort Charles ================= */
const FB = { on: false }, FORT = { ready: false };
JOURNAL.push(
  { id: 'morgan', title: 'Captain Henry Morgan',
    simple: ['Henry Morgan was the most famous privateer of Port Royal. He came from Wales.', 'The governor gave him papers to attack Spanish ships and towns. His men chose him to lead them.'],
    deeper: ['He raided Portobelo in 1668 and Maracaibo in 1669. In January 1671 his men took the city of Panama, and it burned.', 'England and Spain had just made peace, so Morgan was arrested and sent to England in 1672. Instead of being punished, he was made a knight in 1674.', 'He came back in 1675 as Lieutenant Governor of Jamaica, and the law he served now hanged pirates. Ned is a made-up character, but Morgan was real.'] },
  { id: 'funeral', title: 'Morgan’s grave',
    simple: ['Henry Morgan died in Port Royal on 25 August 1688.', 'He was buried near the town. The ships fired 22 guns for him.'],
    deeper: ['Four years later, the 1692 earthquake carried that cemetery into the sea. His grave has never been found.', 'Many stories say Morgan hid treasure in Port Royal. None of them have ever been proved.'] },
  { id: 'forts', title: 'The forts of Port Royal',
    simple: ['Six forts with cannons guarded Port Royal. Fort Charles was the first.', 'Any enemy ship had to sail past their guns to reach the harbour.'],
    deeper: ['Fort Charles was the first, begun in 1655. It is the only one that survived the 1692 earthquake, and you can still visit it today.', 'Forts James, Carlisle and Rupert sank into the sea in the earthquake.', 'Fort Charles in this game is simpler than the real one, and placed to fit the game.'] });

/* ---------- characters ---------- */
const TAV = { ned: [-201.6, 1.8, Math.PI], b1: [-199.0, -0.7, Math.PI / 2], b2: [-198.0, -0.7, -Math.PI / 2] };
const FORTP = { gunner: [14.6, -25.6, Math.PI / 2] };
function cutlass(m) { const h = m.getObjectByName('mixamorigRightHand'); if (!h || m.userData.sword) return; const g = new THREE.Group(), steel = new THREE.MeshStandardMaterial({ color: 0xc9ccd0, metalness: 0.85, roughness: 0.3 }), brass = new THREE.MeshStandardMaterial({ color: 0xb8893c, metalness: 0.7, roughness: 0.4 });
  const bl = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.68, 0.008), steel); bl.position.y = 0.42; bl.rotation.z = 0.06; g.add(bl); const gd = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.008, 6, 12, Math.PI), brass); gd.position.y = 0.06; g.add(gd); const gp = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.12, 8), new THREE.MeshStandardMaterial({ color: 0x3a2618, roughness: 0.8 })); gp.position.y = 0.0; g.add(gp);
  /* hold it across the palm: the blade runs from the little-finger side out past the thumb side, like a real grip */
  m.updateMatrixWorld(true); const loc = (n) => { const b = m.getObjectByName('mixamorigRightHand' + n); return b ? h.worldToLocal(b.getWorldPosition(new THREE.Vector3())) : null; };
  const pi = loc('Index1'), pp = loc('Pinky1'), pm = loc('Middle1'), pt = loc('Thumb1'); const ws = h.getWorldScale(new THREE.Vector3()).x || 1; g.scale.setScalar(1 / ws);
  if (pi && pp && pm) { const ax = pi.clone().sub(pp).normalize(), toward = pm.clone().normalize(), palm = pt ? new THREE.Vector3().crossVectors(ax, toward).normalize() : new THREE.Vector3(0, 0, 1);
    const grip = pm.clone().multiplyScalar(0.72).add(palm.clone().multiplyScalar(0.025 / ws)); const tipDir = ax.clone().multiplyScalar(0.92).add(toward.clone().multiplyScalar(0.39)).normalize();
    g.position.copy(grip).sub(tipDir.clone().multiplyScalar(0.05 / ws)); g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tipDir); }
  else { g.position.set(0, 0.07, 0.02); g.rotation.set(Math.PI / 2, 0, 0); }
  h.add(g); m.userData.sword = g; }
function pirateReady(n) { buildFort(); const m = people[n]; if (!m) return;
  if (n === 'ned' && indoor) { const [x, z, ry] = TAV.ned; m.position.set(x, 0, z); m.rotation.y = ry; m.userData.sits = true; indoor.add(m); animate(m, CL.SitIdle ? 'SitIdle' : CL.SitTalk ? 'SitTalk' : null);   /* Ned just sits at his table; no cup in hand */ grounded.push(m); EXTRA_IN.push([x, z, 0.5]); }
  if (n === 'buc1' || n === 'buc2') { const [x, z, ry] = n === 'buc1' ? TAV.b1 : TAV.b2; m.position.set(x, 0, z); m.rotation.y = ry; indoor.add(m); animate(m); grounded.push(m); EXTRA_IN.push([x, z, 0.55]); }
  if (n === 'gunner') { buildFort(); const [x, z, ry] = FORTP.gunner; m.position.set(x, 0, z); m.rotation.y = ry; FORT.g.add(m); animate(m); }
  if (n === 'morgan') { m.visible = false; scene.add(m); animate(m); } }

/* ---------- the tavern: a rowdy pair of old buccaneers, and Ned with his stories ---------- */
const TV = { t: 0, n: 0 };
const BRAWL = [[0, 'Drink', 'Drink'], [4.5, 'Talk1', 'Laugh'], [8.1, 'Punch', 'Block'], [9.6, 'Block', 'Punch'], [11.1, 'Laugh', 'Laugh'], [15.5, 'Talk2', 'Talk3'], [20, null, null]];
TICKS.push((dt) => { const a = people.buc1, b = people.buc2; if (!a || !b || state.place !== 'in' || !a.userData.anim) return; if (speaker === a || speaker === b) return;
  const pt = TV.t; TV.t += dt; for (const [at, c1, c2] of BRAWL) if (pt < at && TV.t >= at) { const once = (c) => c && !/Talk|Laugh|Drink/.test(c);
      if (c1) a.userData.anim.play(c1, once(c1), 3.5); else a.userData.anim.rest(); if (c2) b.userData.anim.play(c2, once(c2), 3.5); else b.userData.anim.rest();
      if (c1 === 'Punch' && TV.n++ % 2 === 0 && Math.hypot(state.x + 199, state.z) < 6) setTimeout(() => toast('Abba: “Not in my tavern, boys! Take it outside!”'), 700); }
  if (TV.t > 26) TV.t = 0; });
const BUCS = [
  { who: 'Will', text: 'Ha! Mind your feet, friend.' },
  { who: 'Jack', text: 'I sailed with Captain Morgan himself!' },
  { who: 'Will', text: 'Ask old Ned. He was really there.' }];
const NED = [
  { who: 'Ned', text: 'Sit down, lad. Want a story? I sailed with Henry Morgan when I was young.' },
  { who: 'Ned', text: 'Morgan came from Wales with nothing. Soon he led a whole fleet of ships.' },
  { who: 'You', text: 'Was he a pirate?' },
  { who: 'Ned', text: 'The governor gave him papers, so he was a privateer. The Spanish called him worse!', choices: [{ t: 'Tell me the story', ok: true }, { t: 'Maybe another time', ok: true }] },
  { who: 'Ned', text: 'Close your eyes. It is 1670. I am a ship’s boy...' }];
const NED_AGAIN = [
  { who: 'Ned', text: 'Later the King made Morgan a knight. Then he hanged pirates! Ha.' },
  { who: 'Ned', text: 'Our ship’s doctor wrote a book about us. Morgan did not like it!', unlock: 'exquemelin' },
  { who: 'Ned', text: 'He died two years ago. The ships fired 22 guns for him. I was there.', unlock: 'funeral' },
  { who: 'Ned', text: 'Go and see Fort Charles, past the last houses. Its guns keep us safe.' }];
ACTIONS.push(
  { label: 'Talk to the sailors', r: 2.2, where: () => state.place === 'in' && people.buc1 && people.buc1.parent && [-198.5, -0.7], go: () => startConvo(BUCS) },
  { label: 'Talk to old Ned', r: 2.4, where: () => state.place === 'in' && people.ned && people.ned.parent && [TAV.ned[0], TAV.ned[1]], go: () => {
      if (state.unlocked.includes('morgan')) { startConvo(NED_AGAIN, setGoal); return; }
      let chose = 'yes'; const c = NED.map((st) => st.choices ? { ...st, choices: [{ t: 'Tell me the story', ok: true }, { t: 'Maybe another time', ok: true }] } : st);
      startConvo(c.slice(0, 4), () => card('Ned’s story', ['Ned will tell you about the summer Morgan’s ships got ready to sail.', 'In his story, you are young Ned.'], [{ t: 'Hear the story', go: () => { hideCard(); fbStart(); } }, { t: 'Another time', go: hideCard }])); } });
speakerModel = ((orig) => (who) => who === 'Ned' ? people.ned : who === 'Will' ? people.buc1 : who === 'Jack' ? people.buc2 : who === 'Henry Morgan' ? people.morgan : who === 'The gunner' ? people.gunner : orig(who))(speakerModel);

/* ---------- Fort Charles ---------- */
const FW = { x0: 5, x1: 19, z0: -32, z1: -22, gate: [14, 16] };
function buildFort() { if (FORT.ready) return; const g = new THREE.Group(); scene.add(g); FORT.g = g; const prev = cur; cur = g;
  const stone = new THREE.MeshStandardMaterial({ map: noiseTex([176, 160, 132], 30, 4), roughness: 0.95 }), dark = new THREE.MeshStandardMaterial({ color: 0x1d1d1f, roughness: 0.5, metalness: 0.6 }), wood = new THREE.MeshStandardMaterial({ map: plankTex([110, 84, 58], 3, 1, 2), roughness: 0.9 });
  const wallH = 3.2, th = 1.1, { x0, x1, z0, z1, gate } = FW;
  const wall = (ax, az, bx, bz, ports) => { const len = Math.hypot(bx - ax, bz - az), ang = Math.atan2(bz - az, bx - ax), cx = (ax + bx) / 2, cz = (az + bz) / 2;
    const base = mk(new THREE.BoxGeometry(len, wallH - 0.9, th), stone, cx, (wallH - 0.9) / 2, cz); base.rotation.y = -ang;
    const n = Math.max(2, Math.round(len / 1.6)); for (let i = 0; i < n; i++) { if (ports && i % 2 === 1) continue; const t = (i + 0.5) / n, mx = ax + (bx - ax) * t, mz = az + (bz - az) * t; const mer = mk(new THREE.BoxGeometry(len / n * 0.92, 0.9, th), stone, mx, wallH - 0.45, mz); mer.rotation.y = -ang; } };
  wall(x0, z1, gate[0], z1); wall(gate[1], z1, x1, z1); wall(x1, z1, x1, z0, true); wall(x1, z0, x0, z0, true); wall(x0, z0, x0, z1);
  for (const [x, z] of [[x0, z0], [x1, z0], [x0, z1], [x1, z1]]) { mk(new THREE.BoxGeometry(2.4, wallH + 0.6, 2.4), stone, x, (wallH + 0.6) / 2, z); }
  for (const x of gate) mk(new THREE.BoxGeometry(0.6, wallH + 0.8, 1.3), stone, x, (wallH + 0.8) / 2, z1); const lin = mk(new THREE.BoxGeometry(2.6, 0.5, 1.3), stone, (gate[0] + gate[1]) / 2, wallH + 0.55, z1);
  const ground = mk(new THREE.PlaneGeometry(x1 - x0, z1 - z0 + 0.2), new THREE.MeshStandardMaterial({ map: noiseTex([168, 152, 124], 26, 8), roughness: 1, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }), (x0 + x1) / 2, 0.01, (z0 + z1) / 2); ground.rotation.x = -Math.PI / 2;
  const rampart = mk(new THREE.BoxGeometry(2.6, 1.0, z1 - z0 - 1), stone, x1 - 1.85, 0.5, (z0 + z1) / 2);   /* a raised gun platform along the sea wall */
  const step = mk(new THREE.BoxGeometry(1.2, 0.5, 1.6), stone, x1 - 3.65, 0.25, z1 - 2.2);
  FORT.guns = [];
  const gun = (x, z, ry, y) => { const c = new THREE.Group(); c.position.set(x, y, z); c.rotation.y = ry; g.add(c);
    const car = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.34, 1.3), wood); car.position.y = 0.32; c.add(car); for (const sx of [-0.36, 0.36]) for (const sz of [-0.42, 0.42]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 12), wood); w.rotation.z = Math.PI / 2; w.position.set(sx, 0.2, sz); c.add(w); }
    const br = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.2, 1.9, 14), dark); br.rotation.x = Math.PI / 2; br.position.set(0, 0.62, 0.35); c.add(br); const mz = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.035, 6, 14), dark); mz.position.set(0, 0.62, 1.3); c.add(mz);
    FORT.guns.push(c); return c; };
  for (let i = 0; i < 4; i++) gun(x1 - 1.5, z0 + 1.6 + i * 2.2, Math.PI / 2, 1.0);
  for (let i = 0; i < 3; i++) gun(x0 + 2.2 + i * 3.2, z0 + 1.4, Math.PI, 0);
  for (const [x, z] of [[x1 - 3.3, z0 + 1.0], [x0 + 1.4, z1 - 1.4]]) for (let i = 0; i < 6; i++) { const b = mk(new THREE.SphereGeometry(0.11, 10, 8), dark, x + (i % 3) * 0.23 + (i > 2 ? 0.11 : 0), 0.11 + (i > 2 ? 0.18 : 0), z + (i > 2 ? 0.1 : 0)); }
  const ph = mk(new THREE.BoxGeometry(3.4, 2.4, 2.6), stone, x0 + 3, 1.2, z1 - 3.2); const roof = mk(new THREE.ConeGeometry(2.6, 1.1, 4), new THREE.MeshStandardMaterial({ map: noiseTex([110, 70, 54], 30, 4), roughness: 0.9 }), x0 + 3, 2.95, z1 - 3.2); roof.rotation.y = Math.PI / 4; roof.scale.set(1.0, 1, 0.78);
  mk(new THREE.BoxGeometry(0.9, 1.6, 0.06), wood, x0 + 3, 0.8, z1 - 1.88);
  for (const [x, z] of [[x0 + 6, z1 - 1.2], [x0 + 6.8, z1 - 1.1], [x0 + 6.4, z1 - 1.8]]) mk(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 12), wood, x, 0.4, z);
  const pole = mk(new THREE.CylinderGeometry(0.06, 0.08, 9, 8), wood, x0 + 8.5, 4.5, (z0 + z1) / 2); const flag = cv(96, 64, (c) => { c.fillStyle = '#f2f0ea'; c.fillRect(0, 0, 96, 64); c.fillStyle = '#c8202a'; c.fillRect(40, 0, 16, 64); c.fillRect(0, 24, 96, 16); });
  const fl = mk(new THREE.PlaneGeometry(1.8, 1.2, 12, 4), new THREE.MeshStandardMaterial({ map: flag, side: THREE.DoubleSide, roughness: 0.9 }), x0 + 9.4, 8.3, (z0 + z1) / 2); FORT.flag = { p: fl.geometry.attributes.position, base: fl.geometry.attributes.position.array.slice() }; FORT.fpos = [fx - 1.05, FC.top + 10.2, fzz];
  const sign = cv(256, 64, (c) => { c.fillStyle = '#4a3a2a'; c.fillRect(0, 0, 256, 64); c.fillStyle = '#efe4c8'; c.font = '600 30px Georgia, serif'; c.textAlign = 'center'; c.fillText('FORT CHARLES', 128, 42); }); mk(new THREE.PlaneGeometry(2.4, 0.6), new THREE.MeshStandardMaterial({ map: sign, roughness: 0.9 }), (gate[0] + gate[1]) / 2, wallH + 0.55, z1 + 0.66);
  const path = mk(new THREE.PlaneGeometry(3.2, 13.5), new THREE.MeshStandardMaterial({ map: noiseTex([190, 170, 134], 26, 6), roughness: 1, transparent: true, opacity: 0.75 }), 20.4, 0.012, -15.2); path.rotation.x = -Math.PI / 2;
  cur = prev; FORT.ready = true; }
function inRect(x, z, a, b, c, d) { return x >= a && x <= b && z >= c && z <= d; }
function fortOk(x, z) { const { x0, x1, z0, z1, gate } = FW;
  if (inRect(x, z, x0 + 0.8, x1 - 3.3, z0 + 0.8, z1 - 0.8)) return !inRect(x, z, x0 + 1.0, x0 + 5.0, z1 - 4.8, z1 - 1.6);        /* courtyard, minus the powder house */
  if (inRect(x, z, gate[0] + 0.3, gate[1] - 0.3, z1 - 1.0, z1 + 0.8)) return true;                                             /* the gate */
  if (inRect(x, z, 12, SHORE - 0.6, z1 + 0.75, -8.6)) return true;                                                              /* sand between the houses and the fort */
  if (inRect(x, z, x1 + 1.5, SHORE - 0.6, z0 - 1, z1 + 0.8)) return true;                                                       /* round the sea side */
  return false; }
function fortClamp(nx, nz) { if (nz > -8.6 && state.z > -8.6) return [nx, nz]; if (fortOk(nx, nz)) return [nx, nz]; if (fortOk(nx, state.z)) return [nx, state.z]; if (fortOk(state.x, nz)) return [state.x, nz]; if (nz > -8.6 && nx > X1 + 0.3) return [nx, nz]; return [state.x, state.z]; }
const _gy = groundY; groundY = (x, z) => (state.place === 'out' && !FB.on && FORT.ready && inRect(x, z, FW.x1 - 3.15, FW.x1 - 0.5, FW.z0 + 0.5, FW.z1 - 0.5)) ? 1.0 : _gy(x, z);
function boom(x, z) { audioInit(); if (AU.ctx && AU.on) { const c = AU.ctx, t0 = c.currentTime, src = c.createBufferSource(), lp = c.createBiquadFilter(), g = out(0), o = c.createOscillator(), og = c.createGain(); src.buffer = AU.step || AU.crack; src.loop = true; src.playbackRate.value = 0.3; lp.type = 'lowpass'; lp.frequency.setValueAtTime(900, t0); lp.frequency.exponentialRampToValueAtTime(120, t0 + 1.4); g.gain.setValueAtTime(0.9, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.8); src.connect(lp); lp.connect(g); src.start(t0); src.stop(t0 + 1.9);
    o.frequency.setValueAtTime(70, t0); o.frequency.exponentialRampToValueAtTime(28, t0 + 0.8); og.gain.setValueAtTime(0.7, t0); og.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9); o.connect(og); og.connect(g); o.start(t0); o.stop(t0 + 1); }
  debrisInit(); for (let i = 0; i < 5; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: dustTex, color: 0xe8e2d6, transparent: true, opacity: 0, depthWrite: false })); sp.position.set(x + 0.6 + i * 0.5, 1.7 + Math.random() * 0.4, z + (Math.random() - 0.5) * 0.6); sp.userData = { age: -i * 0.08, life: 3 + Math.random() }; scene.add(sp); dustP.push(sp); }
  Q.shake = Math.max(Q.shake, 0.25); setTimeout(() => { if (!Q.on) Q.shake = 0; }, 350); }
TICKS.push((dt) => { if (!FORT.ready || state.place !== 'out') return; const t = performance.now() / 1000, f = FORT.flag; for (let i = 0; i < f.p.count; i++) { const d = Math.max(0, (1.05 - f.base[i * 3]) / 2.1); f.p.setZ(i, f.base[i * 3 + 2] + (Math.sin(d * 5.5 - t * 5.2) * 0.26 + Math.sin(d * 11 - t * 8.3) * 0.06) * d); f.p.setY(i, f.base[i * 3 + 1] + Math.sin(d * 4 - t * 3.1) * 0.07 * d - 0.08 * d * d); f.p.setX(i, f.base[i * 3] + 0.06 * d * (1 - Math.cos(d * 5.5 - t * 5.2))); } f.p.needsUpdate = true; if (!Q.on) for (const sp of dustP) { const u = sp.userData; if (!u.fort) continue; } });
TICKS.push((dt) => { if (Q.on || !dustP.length || debP.length) return; for (let i = dustP.length - 1; i >= 0; i--) { const sp = dustP[i], u = sp.userData; u.age += dt; if (u.age < 0) continue; const k = u.age / u.life; sp.scale.setScalar(1 + k * 5); sp.position.y += dt * 0.4; sp.material.opacity = Math.min(0.7, u.age * 2) * (1 - k); if (k >= 1) { scene.remove(sp); sp.material.dispose(); dustP.splice(i, 1); } } });
const GUNNER = [
  { who: 'The gunner', text: 'Welcome to Fort Charles! There are five more forts around the town.' },
  { who: 'The gunner', text: 'Any enemy ship has to sail past all our guns.' },
  { who: 'You', text: 'Have the guns ever been fired?' },
  { who: 'The gunner', text: 'For practice, and for honour. When Henry Morgan died, the ships fired 22 guns. Want to hear one?', unlock: 'forts' }];
ACTIONS.push(
  { label: 'Talk to the gunner', r: 2.4, where: () => FORT.ready && !Q.on && state.place === 'out' && people.gunner && [FORTP.gunner[0], FORTP.gunner[1]], go: () => startConvo(state.unlocked.includes('forts') ? [{ who: 'The gunner', text: 'Stand back and cover your ears!' }] : GUNNER, () => { setGoal(); const ac = people.gunner && people.gunner.userData.anim; if (ac && CL.Salute) ac.play('Salute', true); fireSalute(); }) });
function fireSalute() { if (!FORT.guns) return; const guns = FORT.guns.slice(0, 4); guns.forEach((c, i) => setTimeout(() => { if (state.place !== 'out' || FB.on) return; const p = new THREE.Vector3(0, 0.62, 1.4); c.localToWorld(p); boom(p.x, p.z); const br = c.children.find((o) => o.geometry && o.geometry.type === 'CylinderGeometry' && o.position.z > 0.3); if (br) { br.position.z = 0.1; setTimeout(() => { br.position.z = 0.35; }, 500); } }, 600 + i * 900)); }
TICKS.push(() => { if (FORT.g) FORT.g.visible = state.place === 'out' && !(Q.on && Q.phase === 'yard'); });

/* ---------- Ned's story: Port Royal, August 1670 ---------- */
const FBP = { morgan: [SHORE + 9.5, -0.55, -Math.PI / 2], d1: [SHORE - 4.2, 2.6, Math.PI / 2], d2: [SHORE - 2.6, 2.6, -Math.PI / 2], c1: [SHORE + 3, 0.7, Math.PI / 2], watch: [[SHORE - 3.4, 4.2, Math.PI, 'Laugh'], [SHORE - 5.6, 1.2, Math.PI * 0.7, 'Talk2'], [SHORE + 14, 0.8, -Math.PI / 2, 'Wave']] };
const FBG = { group: null, cast: [] };
JOURNAL.push({ id: 'panama', title: 'The raid on Panama',
  simple: ['In 1670 Morgan gathered many ships and over a thousand men.', 'In 1671 they walked across the land to Panama and took the city. It burned.'],
  deeper: ['Morgan’s men were paid with a share of what they captured. Most got far less than they hoped.', 'The young Ned in this story is made up. The raid was real.'] });
function fbIntro() { if (!townReady || !tavernReady || !people.morgan) { toast('The town is still loading.'); return; } closeJournal(); card('1670', ['This is old Ned’s story, from 20 years ago.', 'In it, you are young Ned, a ship’s boy.'], [{ t: 'Begin', go: () => { hideCard(); fbStart(); } }, { t: 'Not now', go: hideCard }]); }
function clone(id, tint) { const keep = people[id].userData.anim, sw = people[id].userData.sword; delete people[id].userData.anim; delete people[id].userData.sword; const m = skClone(people[id]); people[id].userData.anim = keep; if (sw) people[id].userData.sword = sw; if (tint) m.traverse((o) => { if (o.isMesh) { o.material = o.material.clone(); o.material.color.setRGB(...tint); } }); return m; }
function fbBuild() { if (FBG.group) return; const g = new THREE.Group(); g.visible = false; scene.add(g); FBG.group = g;
  const put = (m, [x, z, ry], clip) => { m.position.set(x, groundYAt(x, z), z); m.rotation.y = ry; m.visible = true; g.add(m); animate(m, clip); FBG.cast.push(m); m.userData.ground = groundYAt(x, z); grounded.push(m); return m; };
  const d1 = put(clone('buc1'), FBP.d1, 'Sword1'), d2 = put(clone('buc2'), FBP.d2, 'Sword2'); cutlass(d1); cutlass(d2); FBG.d = [d1, d2];
  put(clone('kofi', [0.9, 0.85, 0.8]), FBP.c1, 'Carry'); FBG.carrier = FBG.cast[FBG.cast.length - 1];
  for (const [x, z, ry, clip] of FBP.watch) put(clone(ry > 2 ? 'sailor' : 'buc2', [0.85, 0.8, 0.78]), [x, z, ry], clip);
  const mo = people.morgan; mo.position.set(FBP.morgan[0], 0.06, FBP.morgan[1]); mo.rotation.y = FBP.morgan[2]; g.add(mo); mo.visible = true; cutlass(mo);
  FBG.box = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.32, 0.34), new THREE.MeshStandardMaterial({ map: plankTex([150, 118, 80], 3, 1, 2), roughness: 0.9 })); g.add(FBG.box); }
const FB_TALK = [
  { who: 'Henry Morgan', text: 'You, boy! Are you the new ship’s boy? Good. Stay out of the way.' },
  { who: 'Henry Morgan', text: 'I am Admiral Henry Morgan. I have papers to fight Spain. So I am a privateer, not a pirate.' },
  { who: 'You', text: 'Where are we going, Admiral?' },
  { who: 'Henry Morgan', text: 'Somewhere rich! Every man gets a share of what we take.', anim: 'Point' },
  { who: 'Henry Morgan', text: 'Now go and watch the sword drill. Then help load the ships.', unlock: 'morgan' }];
function fbReset() {   /* put 1690 back: whatever started the next chapter, the flashback's people and props go away */
  if (!FB.on && !(FBG.group && FBG.group.visible)) return; FB.on = false; document.body.classList.remove('flash'); if (FBG.group) FBG.group.visible = false; if (people.morgan) people.morgan.visible = false;
  npcShow(true); third = !!FB.wasThird; if (KP.box) KP.box.visible = true; $('fbexit').hidden = true; }
function fbStart() { fbBuild(); FB.on = true; FB.step = 0; FB.met = false; FB.drill = false; FB.asked.clear(); if (people.morgan) { people.morgan.position.set(FBP.morgan[0], 0.06, FBP.morgan[1]); people.morgan.rotation.y = FBP.morgan[2]; } for (const m of FBG.cast) if (m.userData.sword) m.userData.sword.visible = true; FB.wasThird = third; third = false; setPlace('out'); npcShow(false); abba.visible = false; ABBA.x = 9999; if (KP.box) KP.box.visible = false; if (galdy) galdy.visible = false;
  state.x = SHORE + 15; state.z = 0; state.yaw = Math.PI / 2; state.pitch = 0; FBG.group.visible = true; document.body.classList.add('flash');
  goalText = 'Find Admiral Morgan on the pier. He has a red coat.'; showGoal(); toast('Port Royal, August 1670'); }
function fbEnd() { card('What happened next', ['The ships sailed. Morgan’s men took the city of Panama, and it burned.', 'About 1,200 men marched with him.', 'Later the King made Morgan a knight. He came back to help rule Jamaica, and hanged pirates.', 'He died in 1688. In 1692 the earthquake took his grave into the sea.'], [{ t: 'Back to the tavern', go: fbLeave }]); }
function fbLeave(early) { hideCard(); FB.on = false; document.body.classList.remove('flash'); FBG.group.visible = false; people.morgan.visible = false; npcShow(true); third = !!FB.wasThird; if (early !== true) { unlock('panama'); state.ch.ned = true; } state.talked = true; if (!state.unlocked.includes('harbour')) state.unlocked.push('harbour'); saveGame();   /* you come back inside the tavern, so the arrival goals are behind you */
  setPlace('in'); state.x = -200.4; state.z = 2.4; state.yaw = Math.PI - 0.4; state.pitch = 0; setGoal(); toast(early === true ? 'Ned: “Another time, then.”' : 'Ned: “And that is how it was. Now, who is buying?”'); }
$('fbexit').onclick = () => { if (!FB.on || busy) return; card('Leave Ned’s story?', ['You can hear it again from the Chapters menu.'], [{ t: 'Leave the story', go: () => fbLeave(true) }, { t: 'Stay', go: hideCard }]); };
TICKS.push(() => { const h = !FB.on; if ($('fbexit').hidden !== h) $('fbexit').hidden = h; if (FB.on && third) third = false; if (galdy) { const vh = FB.on; if ($('view').hidden !== vh) $('view').hidden = vh; } });
ACTIONS.push(
  { fb: true, label: 'Talk to Admiral Morgan', r: 2.6, where: () => FB.on && [FBP.morgan[0], FBP.morgan[1]], go: () => startConvo(FB.step ? [{ who: 'Henry Morgan', text: 'Still here? Go and watch the sword drill!' }] : FB_TALK, () => { FB.step = Math.max(FB.step, 1); goalText = 'Watch the sword drill on the beach.'; showGoal(); }) },
  { fb: true, label: 'Watch the sword drill', r: 3.4, where: () => FB.on && FB.step >= 1 && [(FBP.d1[0] + FBP.d2[0]) / 2, FBP.d1[1]], go: () => { const [a, b] = FBG.d; startConvo([{ who: 'Tom', text: 'Watch, boy! Feet apart, sword up. Block high, then low!' }, { who: 'Dick', text: 'If you lose, you say so. Do you give up?' }, { who: 'Tom', text: 'I give up! Ha! Again tomorrow.' }], () => { a.userData.anim.play(CL.Sheathe ? 'Sheathe' : 'Laugh', true); b.userData.anim.play('Laugh', true, 3); setTimeout(() => { a.userData.anim.play('Sword1'); b.userData.anim.play('Sword2'); }, 7000); FB.step = Math.max(FB.step, 2); goalText = 'Help load the ships. Talk to the man with the crates.'; showGoal(); }); } },
  { fb: true, label: 'Help load the ships', r: 2.6, where: () => FB.on && FB.step >= 2 && FBG.carrier && [FBG.carrier.position.x, FBG.carrier.position.z], go: () => startConvo([{ who: 'Sailor', text: 'Food, water and gunpowder. Hand me that crate, boy.' }, { who: 'Sailor', text: 'Good lad! That is the last one.' }], fbEnd) });
speakerModel = ((orig) => (who) => who === 'Tom' ? FBG.d && FBG.d[0] : who === 'Dick' ? FBG.d && FBG.d[1] : who === 'Sailor' ? FBG.carrier : orig(who))(speakerModel);
TICKS.push((dt) => { if (!FB.on || !FBG.carrier) return; const m = FBG.carrier, t = performance.now() / 1000, k = (Math.sin(t * 0.25) + 1) / 2, x = SHORE + 1 + k * 9, dir = Math.cos(t * 0.25) > 0 ? Math.PI / 2 : -Math.PI / 2;
  if (speaker === m) return; m.position.set(x, groundYAt(x, 0.7), 0.7); m.rotation.y = dir; const hl = m.getObjectByName('mixamorigLeftHand'), hr = m.getObjectByName('mixamorigRightHand'); if (hl && hr) { FBG.box.position.copy(hl.getWorldPosition(_dp)).add(hr.getWorldPosition(_ds)).multiplyScalar(0.5); FBG.box.position.x += Math.sin(dir) * 0.24; FBG.box.position.z += Math.cos(dir) * 0.24; FBG.box.rotation.y = dir; } });
TICKS.push(() => { if (!FB.on) return; const m = people.morgan; if (!m) return; const dx = state.x - m.position.x, dz = state.z - m.position.z; if (Math.hypot(dx, dz) < 5) m.rotation.y += (Math.atan2(dx, dz) - m.rotation.y) * 0.08; });
TICKS.push((dt) => {   /* whoever you can talk to turns toward you as you come near */
  if (!current || busy || !current.where) return; const w = current.where(); if (!w) return; const cands = [abba, ...Object.values(people), ...Object.values(survivors), FBG.qm, FBG.exq, FBG.carrier, ...(FBG.d || [])];
  let best = null, bd = 1.6; const p = new THREE.Vector3(); for (const m of cands) { if (!m || !m.parent || !m.visible || m.userData.sits || m === people.kofi) continue; m.getWorldPosition(p); const d = Math.hypot(p.x - w[0], p.z - w[1]); if (d < bd) { bd = d; best = m; } }
  if (!best) return; best.getWorldPosition(p); const want = Math.atan2(state.x - p.x, state.z - p.z); let e = want - best.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); best.rotation.y += e * Math.min(1, dt * 3); });
TICKS.push((dt) => { const m = speaker; if (!m || !m.parent || m.userData.sits || ($('dialogue').hidden && $('card').hidden)) return; const p = new THREE.Vector3(); m.getWorldPosition(p); const want = Math.atan2(state.x - p.x, state.z - p.z); let e = want - m.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); m.rotation.y += e * Math.min(1, dt * 4); });   /* whoever is talking to you turns to face you */
const _clampFB = clampPos; clampPos = (nx, nz) => { if (FB.on && state.place === 'out') { nx = Math.max(SHORE - 9, Math.min(SHORE + 21.5, nx)); if (nx > SHORE - 1.5) nz = Math.max(-1.4, Math.min(1.4, nz)); else nz = Math.max(-5, Math.min(6, nz)); for (const m of [people.morgan, ...FBG.cast]) { if (!m || m === FBG.carrier) continue; const dx = nx - m.position.x, dz = nz - m.position.z, d = Math.hypot(dx, dz); if (d < 0.75 && d > 0) { nx = m.position.x + dx / d * 0.75; nz = m.position.z + dz / d * 0.75; } } return [nx, nz]; } return _clampFB(nx, nz); };

FADE_TITLES.fbStart = ['August 1670', 'Ned\u2019s story']; FADE_TITLES.fbLeave = ['1690', 'Back in The Turtle'];
fbStart = chapterFade('fbStart', fbStart); fbLeave = chapterFade('fbLeave', fbLeave);

TICKS.push(() => { if (FBG.group) FBG.group.visible = FB.on; if (people.morgan && !FB.on) people.morgan.visible = false; });

/* ---------- Ned's story, deeper: Morgan's own account, the articles, the surgeon who wrote it all down, and the muster ---------- */
JOURNAL.push(
  { id: 'articles', title: 'The buccaneers’ articles',
    simple: ['Before a trip, buccaneers agreed to rules called articles.', 'Nobody got wages. They shared what they took. A ship’s boy got half a share.'],
    deeper: ['A man who was badly hurt was paid first. The surgeon Exquemelin wrote that the loss of a right arm was worth 600 pieces of eight.', 'He also wrote that this could be paid as six enslaved people. Even these rules treated human beings as money.'] },
  { id: 'exquemelin', title: 'The surgeon who wrote it down',
    simple: ['Alexandre Exquemelin was a real ship’s doctor. He sailed with Morgan to Panama.', 'He wrote a book about them in 1678. It made Morgan famous.'],
    deeper: ['When it came out in English in 1684, Morgan sued the publishers for saying false things about him. He won, and was paid £200.', 'Much of what we know about Morgan comes from that book, but historians read it carefully, because it is not always fair.'] });
const MORGAN_TOPICS = [
  { t: 'Who are you, Admiral?', lines: [
    { who: 'Henry Morgan', text: 'I am Henry Morgan, from Wales. I came to Jamaica as a young man.' },
    { who: 'Henry Morgan', text: 'When our old captain died, the men voted for me to lead them.' }] },
  { t: 'Are you a pirate?', lines: [
    { who: 'Henry Morgan', text: 'A pirate? Watch your tongue! The Governor gave me papers to fight Spain.', anim: 'Point' },
    { who: 'Henry Morgan', text: 'With papers, you are a privateer. Without them, you are a pirate. And pirates hang.' }] },
  { t: 'What happened at Portobelo?', lines: [
    { who: 'Henry Morgan', text: 'In 1668 we took Portobelo, a Spanish town with three castles.' },
    { who: 'Henry Morgan', text: 'The Spanish paid us lots of silver to get their town back.' }] },
  { t: 'And Maracaibo?', lines: [
    { who: 'Henry Morgan', text: 'Last year, three Spanish warships trapped us in a big lake.' },
    { who: 'Henry Morgan', text: 'So we filled an old ship with gunpowder and sent it at them. Boom!', anim: 'Point' },
    { who: 'Henry Morgan', text: 'Then we tricked their fort and slipped out at night. Ha!', anim: 'Laugh' }] },
  { t: 'Where are we going next?', lines: [
    { who: 'Henry Morgan', text: 'That is a secret, boy! But it is the richest Spanish city of all.' },
    { who: 'Henry Morgan', text: 'Remember this summer. People will tell stories about it.' }] }];
FB.asked = new Set();
function morganHub() { if (people.morgan) speaker = people.morgan; const left = MORGAN_TOPICS.filter((q) => !FB.asked.has(q.t)), btn = [];
  for (const q of left) btn.push({ t: q.t, go: () => { hideCard(); startConvo(q.lines, () => { FB.asked.add(q.t); if (FB.asked.size >= 3) unlock('morgan'); morganHub(); }); } });
  btn.push({ t: FB.asked.size >= 3 ? 'Thank you, Admiral' : 'Goodbye for now', go: () => { hideCard(); if (FB.asked.size >= 3) { FB.step = Math.max(FB.step, 1); fbGoal(); } } });   /* fbGoal keeps the goal where the player has got to */
  card('Admiral Henry Morgan', [FB.asked.size ? 'Ask him something else.' : '“Well, boy? Speak up. What do you want to know?”'], btn); }
const QM_TALK = [
  { who: 'Quartermaster', text: 'Ship’s boy, eh? Every man here agrees to our rules. We call them articles.' },
  { who: 'Quartermaster', text: 'Nobody gets paid wages. We share what we take. You get half a share.' },
  { who: 'Quartermaster', text: 'If a man is badly hurt, he is paid first.' },
  { who: 'Quartermaster', text: 'And no fighting each other on the ship!', unlock: 'articles' }];
const EXQ_TALK = [
  { who: 'Exquemelin', text: 'Bonjour! I am Exquemelin, the ship’s doctor. I sew up cuts.' },
  { who: 'Exquemelin', text: 'I also write down everything I see. One day it will be a book.' },
  { who: 'You', text: 'Will the Admiral like your book?' },
  { who: 'Exquemelin', text: 'Ha! Not every page, I think.', unlock: 'exquemelin' }];
const MUSTER = [
  { who: 'Henry Morgan', text: 'Men! The ships are loaded. We sail in the morning!', anim: 'Point' },
  { who: 'Henry Morgan', text: 'Every man gets his share. Every hurt man is paid first.' },
  { who: 'Henry Morgan', text: 'Stay together, and we will do great things!' }];
FBP.exq = [SHORE - 6.6, 3.75, Math.PI]; FBP.qm = [SHORE - 1.6, -3.0, Math.PI / 2];
const _fbBuild = fbBuild; fbBuild = () => { const first = !FBG.group; _fbBuild(); if (!first) return; const g = FBG.group, prev = cur; cur = g;
  const seat = mk(new THREE.BoxGeometry(0.5, 0.42, 0.45), new THREE.MeshStandardMaterial({ map: plankTex([132, 100, 70], 3, 1, 2), roughness: 0.9 }), FBP.exq[0], groundYAt(FBP.exq[0], FBP.exq[1]) + 0.21, FBP.exq[1] + 0.2);
  const desk = mk(new THREE.CylinderGeometry(0.3, 0.3, 0.72, 12), new THREE.MeshStandardMaterial({ map: plankTex([120, 88, 58], 6, 1, 2), roughness: 0.9 }), FBP.exq[0], groundYAt(FBP.exq[0], FBP.exq[1]) + 0.36, FBP.exq[1] - 0.45);
  const book = mk(new THREE.BoxGeometry(0.26, 0.03, 0.2), new THREE.MeshStandardMaterial({ color: 0xe8dcc0, roughness: 0.9 }), FBP.exq[0], desk.position.y + 0.38, FBP.exq[1] - 0.42);
  const bar = mk(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 12), new THREE.MeshStandardMaterial({ map: plankTex([120, 88, 58], 6, 1, 2), roughness: 0.9 }), FBP.qm[0] + 0.55, 0.4, FBP.qm[1]);
  const paper = mk(new THREE.BoxGeometry(0.3, 0.01, 0.22), new THREE.MeshStandardMaterial({ color: 0xefe4c6, roughness: 0.9 }), FBP.qm[0] + 0.55, 0.81, FBP.qm[1]);
  cur = prev;
  const put = (m, [x, z, ry], clip) => { m.position.set(x, groundYAt(x, z), z); m.rotation.y = ry; m.visible = true; g.add(m); animate(m, clip); FBG.cast.push(m); m.userData.ground = groundYAt(x, z); grounded.push(m); return m; };
  if (galdy) { FBG.exq = put(clone2(galdy, [0.8, 0.9, 1.05]), FBP.exq, CL.Write ? 'Write' : null); FBG.exq.userData.sits = true; }
  if (people.gunner) FBG.qm = put(clone('gunner', [0.75, 0.95, 0.8]), FBP.qm, 'Talk2'); };
function clone2(src, tint) { const keep = src.userData.anim; delete src.userData.anim; const m = skClone(src); src.userData.anim = keep; m.scale.copy(src.scale); m.traverse((o) => { if (o.isMesh) { o.material = o.material.clone(); o.material.color.setRGB(...tint); } }); return m; }
speakerModel = ((orig) => (who) => who === 'Quartermaster' ? FBG.qm : who === 'Exquemelin' ? FBG.exq : orig(who))(speakerModel);
for (let i = ACTIONS.length - 1; i >= 0; i--) if (ACTIONS[i].fb) ACTIONS.splice(i, 1);
function fbGoal() { if (FB.step >= 1 && FB.step < 2 && state.unlocked.includes('articles') && FB.drill) { FB.step = 2; goalText = 'Help load the ships. Talk to the man with the crates.'; showGoal(); } else if (FB.step === 1) { goalText = !state.unlocked.includes('articles') ? (FB.drill ? 'Talk to the quartermaster on the beach.' : 'Talk to the quartermaster. Then watch the sword drill.') : 'Watch the sword drill by the barrels.'; showGoal(); } }
ACTIONS.push(
  { fb: true, label: 'Talk to Admiral Morgan', r: 2.6, where: () => FB.on && FB.step < 3 && [people.morgan.position.x, people.morgan.position.z], go: () => { if (FB.step === 0 && !FB.met) { FB.met = true; startConvo([{ who: 'Henry Morgan', text: 'You, boy! You must be the new ship’s boy. Stay out of the way.' }], morganHub); } else morganHub(); } },
  { fb: true, label: 'Talk to the quartermaster', r: 2.4, where: () => FB.on && FB.step >= 1 && FBG.qm && [FBP.qm[0], FBP.qm[1]], go: () => startConvo(QM_TALK, fbGoal) },
  { fb: true, label: 'Talk to the surgeon', r: 2.4, where: () => FB.on && FBG.exq && [FBP.exq[0], FBP.exq[1] - 0.2], go: () => startConvo(state.unlocked.includes('exquemelin') ? [{ who: 'Exquemelin', text: 'Shh. I am writing.' }] : EXQ_TALK) },
  { fb: true, label: 'Watch the sword drill', r: 3.4, where: () => FB.on && FB.step >= 1 && [(FBP.d1[0] + FBP.d2[0]) / 2, FBP.d1[1]], go: () => { const [a, b] = FBG.d; startConvo([{ who: 'Tom', text: 'Watch, boy! Feet apart, sword up. Block high, then low!' }, { who: 'Dick', text: 'If you lose, you say so. Do you give up?' }, { who: 'Tom', text: 'I give up! Ha! Again tomorrow.' }], () => { a.userData.anim.play(CL.Sheathe ? 'Sheathe' : 'Laugh', true); b.userData.anim.play('Laugh', true, 3); setTimeout(() => { a.userData.anim.play('Sword1'); b.userData.anim.play('Sword2'); }, 6000); FB.drill = true; fbGoal(); }); } },
  { fb: true, label: 'Help load the ships', r: 2.6, where: () => FB.on && FB.step === 2 && FBG.carrier && [FBG.carrier.position.x, FBG.carrier.position.z], go: () => startConvo([{ who: 'Sailor', text: 'Food, water and gunpowder. Hand me that crate, boy.' }, { who: 'Sailor', text: 'Good lad. That is the last one. Quick, the Admiral is calling everyone!' }], fbMuster) });
function fbMuster() { FB.step = 3; const mo = people.morgan; mo.position.set(SHORE + 1.2, 0.06, 0); mo.rotation.y = -Math.PI / 2; const spots = [[SHORE - 1.2, -1.6], [SHORE - 1.6, -0.4], [SHORE - 1.5, 0.9], [SHORE - 0.9, 2.0], [SHORE - 2.6, -1.0], [SHORE - 2.7, 1.4]];
  FBG.cast.filter((m) => m !== FBG.exq && m !== FBG.carrier).forEach((m, i) => { const p = spots[i % spots.length]; m.position.set(p[0], groundYAt(p[0], p[1]), p[1]); m.userData.ground = m.position.y; m.rotation.y = Math.atan2(mo.position.x - p[0], mo.position.z - p[1]); if (m.userData.sword) m.userData.sword.visible = false; m.userData.anim.rest(); });
  state.x = SHORE - 3.6; state.z = -0.2; state.yaw = -Math.PI / 2; state.pitch = 0.04;
  startConvo(MUSTER, () => { FBG.cast.forEach((m, i) => { if (m === FBG.exq || !m.userData.anim) return; m.userData.anim.play(CL.Cheer ? (i % 3 === 0 ? 'Clap' : 'Cheer') : (i % 2 ? 'Wave' : 'Laugh'), true); }); toast('The men cheer!'); setTimeout(fbEnd, 2600); }); }

/* ---------- loading the fleet: carry three crates from the pile to the ship's boat ---------- */
const LOAD = { pile: [SHORE - 0.6, 3.4], drop: [SHORE + 12.6, -1.15], n: 0, carrying: false, need: 3 };
function loadBuild() { if (LOAD.g) return; const g = new THREE.Group(); FBG.group.add(g); LOAD.g = g; const prev = cur; cur = g;
  const crM = new THREE.MeshStandardMaterial({ map: plankTex([150, 118, 80], 3, 1, 2), roughness: 0.9 }); LOAD.crates = [];
  for (let i = 0; i < 6; i++) { const c = mk(new THREE.BoxGeometry(0.5, 0.36, 0.4), crM, LOAD.pile[0] + (i % 3) * 0.55 - 0.55, 0.18 + Math.floor(i / 3) * 0.37, LOAD.pile[1] + (i % 2) * 0.08); c.rotation.y = (i * 0.37) % 0.3; LOAD.crates.push(c); }
  const boatM = new THREE.MeshStandardMaterial({ map: plankTex([96, 72, 50], 4, 1, 2), roughness: 0.9 }); const boat = mk(new THREE.BoxGeometry(3.6, 0.5, 1.4), boatM, LOAD.drop[0], -0.35, LOAD.drop[1] - 1.6); LOAD.boat = boat; LOAD.inBoat = [];
  const ring = (x, z) => { const r = mk(new THREE.RingGeometry(0.75, 0.88, 40), new THREE.MeshBasicMaterial({ color: 0xd9a441, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }), x, 0.08, z); r.rotation.x = -Math.PI / 2; return r; };
  LOAD.r1 = ring(LOAD.pile[0], LOAD.pile[1] - 0.9); LOAD.r2 = ring(LOAD.drop[0], LOAD.drop[1]);
  LOAD.held = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.36, 0.4), crM); LOAD.held.visible = false; if (!camera.parent) scene.add(camera); camera.add(LOAD.held); LOAD.held.position.set(0, -0.55, -0.75);
  cur = prev; }
function loadReset() { if (!LOAD.g) return; LOAD.n = 0; LOAD.carrying = false; LOAD.held.visible = false; LOAD.crates.forEach((c) => { c.visible = true; }); for (const c of LOAD.inBoat) c.parent && c.parent.remove(c); LOAD.inBoat.length = 0; }
TICKS.push(() => { if (!LOAD.g) return; const on = FB.on && FB.step === 2; LOAD.r1.visible = on && !LOAD.carrying; LOAD.r2.visible = on && LOAD.carrying; if (!FB.on) LOAD.held.visible = false; });
ACTIONS.push(
  { fb: true, label: 'Pick up a crate', r: 1.6, where: () => FB.on && FB.step === 2 && !LOAD.carrying && [LOAD.pile[0], LOAD.pile[1] - 0.9], go: () => { const c = LOAD.crates.filter((k) => k.visible).pop(); if (c) c.visible = false; LOAD.carrying = true; LOAD.held.visible = true; goalText = 'Carry it to the boat on the pier (gold ring). Loaded: ' + LOAD.n + ' of ' + LOAD.need + '.'; showGoal(); } },
  { fb: true, label: 'Put the crate in the boat', r: 1.8, where: () => FB.on && FB.step === 2 && LOAD.carrying && LOAD.drop, go: () => { LOAD.carrying = false; LOAD.held.visible = false; LOAD.n++; const c = LOAD.held.clone(); c.position.set(LOAD.drop[0] - 1 + LOAD.n * 0.55, -0.0, LOAD.drop[1] - 1.6); LOAD.g.add(c); LOAD.inBoat.push(c);
      if (LOAD.n >= LOAD.need) { startConvo([{ who: 'Sailor', text: 'Good lad! That is the last one.' }, { who: 'Sailor', text: 'Quick now, the Admiral is calling everyone to the pier!' }], fbMuster); }
      else { goalText = 'Good! Get another crate. Loaded: ' + LOAD.n + ' of ' + LOAD.need + '.'; showGoal(); toast('Crate loaded!'); } } });
for (let i = ACTIONS.length - 1; i >= 0; i--) if (ACTIONS[i].fb && ACTIONS[i].label === 'Help load the ships') ACTIONS.splice(i, 1);
const _fbGoal = fbGoal; fbGoal = () => { _fbGoal(); if (FB.step === 2) { loadBuild(); goalText = LOAD.carrying ? 'Carry it to the boat on the pier (gold ring). Loaded: ' + LOAD.n + ' of ' + LOAD.need + '.' : 'Pick up a crate from the pile (gold ring). Loaded: ' + LOAD.n + ' of ' + LOAD.need + '.'; showGoal(); } };
const _fbStartL = fbStart; fbStart = (...a) => { _fbStartL(...a); };
TICKS.push(() => { if (FB.on && FB.step === 0 && LOAD.n) loadReset(); });

/* ================= Fort Charles, as John Taylor described it in 1687 =================
   "An octagon polygon", each side flanked, no bastions; 38 guns and a mortar; the old round stone tower in the middle
   kept as the powder magazine; stone and lime; the sea on three sides at the tip of the point. */
const FC = { C: [50, -30], rx: 13, rz: 10, top: 2.4, sIn: 0.66, sPar: 0.86 };
const SPIT = [[18.4, -8.6], [22.8, -8.6], [28, -12.2], [36, -15.4], [44, -16.6], [56, -17], [65.5, -21.5], [68, -30], [64.5, -40], [52.5, -44.2], [40, -43.6], [31.5, -38.5], [25.5, -30.5], [20.5, -22], [18.4, -14]];
function octV(sc) { const out = []; for (let k = 0; k < 8; k++) { const a = Math.PI / 8 + k * Math.PI / 4; out.push([FC.C[0] + FC.rx * sc * Math.cos(a), FC.C[1] - FC.rz * sc * Math.sin(a)]); } return out; }
const OCT1 = octV(1), OCTN = OCT1.map(([x, z], i) => { const [x2, z2] = OCT1[(i + 1) % 8], ex = x2 - x, ez = z2 - z, l = Math.hypot(ex, ez), nx = ez / l, nz = -ex / l, mx = (x + x2) / 2 - FC.C[0], mz = (z + z2) / 2 - FC.C[1], sg = nx * mx + nz * mz > 0 ? 1 : -1; return [nx * sg, nz * sg, Math.abs(nx * mx + nz * mz)]; });
function octS(x, z) { const dx = x - FC.C[0], dz = z - FC.C[1]; let m = 0; for (const [nx, nz, d] of OCTN) m = Math.max(m, (dx * nx + dz * nz) / d); return m; }
function inPoly(x, z, P) { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, zi] = P[i], [xj, zj] = P[j]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c; } return c; }
const RAMPS = [{ x0: FC.C[0] - 3.2, x1: FC.C[0] + 3.2, z0: FC.C[1] - FC.rz * 0.6 + 0.05, z1: FC.C[1] - FC.rz * 0.6 + 1.85, up: 1 }, { x0: FC.C[0] - 3.2, x1: FC.C[0] + 3.2, z0: FC.C[1] + FC.rz * 0.6 - 1.85, z1: FC.C[1] + FC.rz * 0.6 - 0.05, up: 1 }];
const BARR = { x0: FC.C[0] + 2.6, x1: FC.C[0] + 7.2, z0: FC.C[1] + 1.2, z1: FC.C[1] + 3.6 };
const MLINE = [[26.5, -32.5], [32.5, -39.6], [39.5, -42.2]];
function segD(x, z, [ax, az], [bx, bz]) { const ex = bx - ax, ez = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * ex + (z - az) * ez) / (ex * ex + ez * ez))); return Math.hypot(x - ax - ex * t, z - az - ez * t); }
function rampH(x, z) { for (const r of RAMPS) if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) return (x - r.x0) / (r.x1 - r.x0) * FC.top; return -1; }
function fz(x, z, prev) { const s = octS(x, z), gate = Math.abs(z - FC.C[1]) < 1.35 && x < FC.C[0];
  if (s > 1.0) { if (!inPoly(x, z, SPIT)) return null; for (let i = 0; i < MLINE.length - 1; i++) if (segD(x, z, MLINE[i], MLINE[i + 1]) < 0.75) return 'wall'; return 'spit'; }
  if (gate && s > FC.sIn - 0.02 && !(prev === 'ring' && s < FC.sPar)) return 'gate';
  if (s > FC.sPar) return 'wall'; if (s > FC.sIn) return 'ring';
  if (rampH(x, z) >= 0) return 'ramp';
  if (Math.hypot(x - FC.C[0], z - FC.C[1]) < 2.9) return 'wall'; if (x > BARR.x0 - 0.4 && x < BARR.x1 + 0.4 && z > BARR.z0 - 0.4 && z < BARR.z1 + 0.4) return 'wall';
  return 'court'; }
const FZ_OK = { spit: ['spit', 'gate'], gate: ['gate', 'spit', 'court'], court: ['court', 'gate', 'ramp'], ramp: ['ramp', 'court', 'ring'], ring: ['ring', 'ramp'] };
function onSpit(x, z) { return inPoly(x, z, SPIT); }
function fort2Clamp(nx, nz, street) { const zo = fz(state.x, state.z, state.fz), ok = (x, z) => { const zn = fz(x, z, zo); if (!zn || zn === 'wall') return null; if (zo && zo !== zn && !(FZ_OK[zo] || []).includes(zn)) return null; if (zn === 'ring' && zo === 'ramp' && rampH(state.x, state.z) < 1.9) return null; if (zn === 'ramp' && zo === 'ring' && rampH(x, z) < 1.9) return null; return zn; };
  let zn = ok(nx, nz); if (zn) { state.fz = zn; return [nx, nz]; }
  if (!onSpit(nx, nz) && nz > -9.3 && nx < SHORE) { state.fz = null; return street(nx, nz); }
  zn = ok(nx, state.z); if (zn) { state.fz = zn; return [nx, state.z]; } zn = ok(state.x, nz); if (zn) { state.fz = zn; return [state.x, nz]; } return [state.x, state.z]; }
const _clampF2 = clampPos; clampPos = (nx, nz) => { if (FORT.ready && !FB.on && state.place === 'out' && (onSpit(nx, nz) || onSpit(state.x, state.z)) && !(nz > -8.7 && state.z > -8.7)) return fort2Clamp(nx, nz, _clampF2); return _clampF2(nx, nz); };
{ const _cS = clampPos; clampPos = (nx, nz) => { let [x, z] = _cS(nx, nz); if (FORT.ready && state.place === 'out' && !FB.on && state.fz === 'spit') { let hit = false; for (const [cx, cz, r] of SPITC) { const dx = x - cx, dz = z - cz, d = Math.hypot(dx, dz); if (d < r + 0.3 && d > 1e-4) { x = cx + dx / d * (r + 0.3); z = cz + dz / d * (r + 0.3); hit = true; } } if (hit && !onSpit(x, z)) return [state.x, state.z]; } return [x, z]; }; }   /* only a prop push is checked, and only on the spit */   /* never let a prop nudge you off the sand */
groundY = (x, z) => { if (state.place === 'out' && !FB.on && FORT.ready && onSpit(x, z)) { const zn = state.fz; if (zn === 'ring') return FC.top; if (zn === 'ramp') return Math.max(0, rampH(x, z)); return 0; } return _gy(x, z); };
buildFort = function buildFort2() { if (FORT.ready) return; const g = new THREE.Group(); scene.add(g); FORT.g = g; const prev = cur; cur = g;
  const ashlar = (base, rep) => { const t = cv(256, 256, (c) => { c.fillStyle = `rgb(${base.map((v) => v - 30).join(',')})`; c.fillRect(0, 0, 256, 256); for (let r = 0; r < 8; r++) { const off = (r % 2) * 40; for (let x = -80; x < 256; x += 80) { const v = (Math.random() - 0.5) * 34, w = 70 + Math.random() * 8; c.fillStyle = `rgb(${base.map((b) => Math.max(0, Math.min(255, b + v + (Math.random() - 0.5) * 8))).join(',')})`; c.fillRect(x + off + 3, r * 32 + 3, w, 26); for (let k = 0; k < 40; k++) { c.fillStyle = `rgba(${Math.random() < 0.5 ? '60,50,40' : '255,250,235'},${Math.random() * 0.12})`; c.fillRect(x + off + 3 + Math.random() * w, r * 32 + 3 + Math.random() * 26, 2 + Math.random() * 6, 2 + Math.random() * 4); } } } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); return t; };
  const stone = new THREE.MeshStandardMaterial({ map: ashlar([150, 138, 116], 0.35), roughness: 0.95 }), stoneL = new THREE.MeshStandardMaterial({ map: ashlar([182, 172, 150], 0.5), roughness: 0.9 }), dark = new THREE.MeshStandardMaterial({ color: 0x1d1d1f, roughness: 0.5, metalness: 0.6 }), wood = new THREE.MeshStandardMaterial({ map: plankTex([110, 84, 58], 3, 1, 2), roughness: 0.9 }), bronze = new THREE.MeshStandardMaterial({ color: 0x8a6a3a, roughness: 0.4, metalness: 0.7 });
  /* the sand spit out to the point, with a wet edge */
  const shp = (P, k = 1) => { const cx = P.reduce((a, p) => a + p[0], 0) / P.length, cz = P.reduce((a, p) => a + p[1], 0) / P.length, sh = new THREE.Shape(); P.forEach(([x, z], i) => { const X = cx + (x - cx) * k, Z = cz + (z - cz) * k; i ? sh.lineTo(X, -Z) : sh.moveTo(X, -Z); }); return sh; };
  const sand = new THREE.Mesh(new THREE.ShapeGeometry(shp(SPIT)), new THREE.MeshStandardMaterial({ map: noiseTex([203, 180, 138], 34, 30), roughness: 1 })); sand.rotation.x = -Math.PI / 2; sand.position.y = 0.004; g.add(sand);
  const wet = new THREE.Mesh(new THREE.ShapeGeometry(shp(SPIT, 1.035)), new THREE.MeshStandardMaterial({ color: 0x9a8662, roughness: 1 })); wet.rotation.x = -Math.PI / 2; wet.position.y = -0.12; g.add(wet);
  const prism = (quad, y0, y1, mat) => { const sh = new THREE.Shape(); quad.forEach(([x, z], i) => i ? sh.lineTo(x, -z) : sh.moveTo(x, -z)); const geo = new THREE.ExtrudeGeometry(sh, { depth: y1 - y0, bevelEnabled: false }); const m = new THREE.Mesh(geo, mat); m.rotation.x = -Math.PI / 2; m.position.y = y0; g.add(m); return m; };
  const at = (sc, i, t) => { const A = octV(sc)[i], B = octV(sc)[(i + 1) % 8]; return [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]; };
  const band = (i, t0, t1, s0, s1, y0, y1, mat) => prism([at(s0, i, t0), at(s0, i, t1), at(s1, i, t1), at(s1, i, t0)], y0, y1, mat);
  const GATE = 3, gapT = (() => { const A = OCT1[GATE], B = OCT1[(GATE + 1) % 8], dz = B[1] - A[1]; return [(FC.C[1] - 1.5 - A[1]) / dz, (FC.C[1] + 1.5 - A[1]) / dz].sort((a, b) => a - b); })();
  FORT.guns = [];
  const gun = (x, z, ry, y, big) => { const c = new THREE.Group(); c.position.set(x, y, z); c.rotation.y = ry; g.add(c); const car = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.34, 1.3), wood); car.position.y = 0.32; c.add(car);
    for (const sx of [-0.36, 0.36]) for (const sz of [-0.42, 0.42]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 12), wood); w.rotation.z = Math.PI / 2; w.position.set(sx, 0.2, sz); c.add(w); }
    const br = new THREE.Mesh(new THREE.CylinderGeometry(0.13, big ? 0.24 : 0.2, big ? 2.2 : 1.9, 14), dark); br.rotation.x = Math.PI / 2; br.position.set(0, 0.62, 0.35); c.add(br); FORT.guns.push(c); return c; };
  for (let i = 0; i < 8; i++) {
    const segs = i === GATE ? [[0, gapT[0]], [gapT[1], 1]] : [[0, 1]];
    for (const [t0, t1] of segs) { band(i, t0, t1, FC.sIn, 1.0, 0, FC.top, stone); band(i, t0, t1, 0.985, 1.03, 0, 0.7, stoneL); }   /* rampart and its sloping foot */
    band(i, 0, 1, 0.98, 1.025, FC.top - 0.14, FC.top + 0.04, stoneL);                                                             /* cordon of pale stone */
    const n = 11, guns = i === GATE ? [] : [2, 4, 6, 8, 10].map((k) => (k - 0.5) / n); if (i === GATE) { band(i, gapT[0], gapT[1], FC.sIn, 1.0, FC.top - 0.32, FC.top, stone); }
    for (let k = 0; k < n; k++) { const t0 = k / n, t1 = (k + 1) / n, port = guns.some((t) => t > t0 && t < t1); if (port) { band(i, t0, t1, FC.sPar, 1.0, FC.top, FC.top + 0.45, stone); continue; } band(i, t0, t1, FC.sPar, 1.0, FC.top, FC.top + 1.15, stone); }
    const [nx, nz] = OCTN[i]; for (const t of guns) { const [x, z] = at(0.775, i, t); gun(x, z, Math.atan2(nx, nz), FC.top, i === 0 || i === 7); } }
  for (const t of [gapT[0] - 0.12, gapT[1] + 0.12]) { const [x, z] = at(0.775, GATE, t), [nx, nz] = OCTN[GATE]; gun(x, z, Math.atan2(nx, nz), FC.top); }   /* two guns flank the gate */
  { const [x, z] = at(0.77, 7, 0.5); const m = new THREE.Group(); m.position.set(x - 0.6, FC.top, z); g.add(m); const bed = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.3, 1.0), wood); bed.position.y = 0.15; m.add(bed); const mo = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.28, 0.75, 16, 1, true), bronze); mo.position.y = 0.6; mo.rotation.x = -0.75; m.add(mo); }   /* the mortar */
  const gx = OCT1[GATE][0] + (OCT1[GATE + 1][0] - OCT1[GATE][0]) * 0.5; for (const sz of [-1, 1]) { const d = mk(new THREE.BoxGeometry(0.12, 2.0, 1.4), wood, gx + 0.7, 1.0, FC.C[1] + sz * 2.0); d.rotation.y = sz * 0.35; }
  /* the old round tower in the middle, now the powder magazine */
  const towerM = new THREE.MeshStandardMaterial({ map: ashlar([156, 144, 120], 1), roughness: 0.95 }); towerM.map.repeat.set(4, 1.75); mk(new THREE.CylinderGeometry(2.5, 2.7, 5.6, 28), towerM, FC.C[0], 2.8, FC.C[1]); mk(new THREE.CylinderGeometry(2.75, 2.75, 0.3, 28), stoneL, FC.C[0], 5.6, FC.C[1]); const roof = mk(new THREE.ConeGeometry(2.8, 1.6, 28), new THREE.MeshStandardMaterial({ map: noiseTex([118, 76, 58], 30, 4), roughness: 0.9 }), FC.C[0], 6.55, FC.C[1]);
  mk(new THREE.BoxGeometry(0.1, 1.9, 1.1), wood, FC.C[0] - 2.62, 0.95, FC.C[1]);
  /* barracks and guardroom along the south side of the yard */
  mk(new THREE.BoxGeometry(BARR.x1 - BARR.x0, 2.6, BARR.z1 - BARR.z0), stoneL, (BARR.x0 + BARR.x1) / 2, 1.3, (BARR.z0 + BARR.z1) / 2); const br = mk(new THREE.BoxGeometry(BARR.x1 - BARR.x0 + 0.4, 0.12, 2.0), new THREE.MeshStandardMaterial({ map: noiseTex([118, 76, 58], 30, 4), roughness: 0.9 }), (BARR.x0 + BARR.x1) / 2, 3.0, (BARR.z0 + BARR.z1) / 2 - 0.55); br.rotation.x = -0.4; const br2 = br.clone(); br2.position.z += 1.1; br2.rotation.x = 0.4; g.add(br2);
  for (const x of [BARR.x0 + 1.0, BARR.x0 + 3.2]) mk(new THREE.BoxGeometry(0.9, 1.7, 0.08), wood, x, 0.85, BARR.z0 - 0.02);
  /* ramps up to the gun platform */
  for (const r of RAMPS) { const L = r.x1 - r.x0, w = r.z1 - r.z0, rp = mk(new THREE.BoxGeometry(Math.hypot(L, FC.top), 0.25, w), stoneL, (r.x0 + r.x1) / 2, FC.top / 2 - 0.1, (r.z0 + r.z1) / 2); rp.rotation.z = Math.atan2(FC.top, L); mk(new THREE.BoxGeometry(L, FC.top * 0.5, w), stone, (r.x0 + r.x1) / 2 + L * 0.25, FC.top * 0.25, (r.z0 + r.z1) / 2).scale.x = 0.5; }
  /* yard: shot, powder casks, a flagstaff on the seaward side */
  for (const [x, z] of [[FC.C[0] - 4.6, FC.C[1] - 2.6], [FC.C[0] + 4.2, FC.C[1] - 2.8]]) for (let i = 0; i < 10; i++) { const lvl = i < 6 ? 0 : i < 9 ? 1 : 2, j = lvl ? (lvl === 1 ? i - 6 : 0) : i; mk(new THREE.SphereGeometry(0.11, 10, 8), dark, x + (j % 3) * 0.23 + lvl * 0.11, 0.11 + lvl * 0.18, z + Math.floor(j / 3) * 0.22 + lvl * 0.1); }
  for (const [x, z] of [[FC.C[0] - 3.4, FC.C[1] + 2.4], [FC.C[0] - 2.8, FC.C[1] + 3.0], [FC.C[0] - 3.6, FC.C[1] + 3.2]]) mk(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 12), wood, x, 0.4, z);
  const [fx, fzz] = at(0.78, 0, 0.5); mk(new THREE.CylinderGeometry(0.07, 0.1, 11, 8), wood, fx, FC.top + 5.5, fzz); const flag = cv(96, 64, (c) => { c.fillStyle = '#f2f0ea'; c.fillRect(0, 0, 96, 64); c.fillStyle = '#c8202a'; c.fillRect(40, 0, 16, 64); c.fillRect(0, 24, 96, 16); });
  const fl = mk(new THREE.PlaneGeometry(2.1, 1.4, 12, 4), new THREE.MeshStandardMaterial({ map: flag, side: THREE.DoubleSide, roughness: 0.9 }), fx - 1.05, FC.top + 10.2, fzz); FORT.flag = { p: fl.geometry.attributes.position, base: fl.geometry.attributes.position.array.slice() };
  const sign = cv(256, 64, (c) => { c.fillStyle = '#4a3a2a'; c.fillRect(0, 0, 256, 64); c.fillStyle = '#efe4c8'; c.font = '600 30px Georgia, serif'; c.textAlign = 'center'; c.fillText('FORT CHARLES', 128, 42); }); const sg = mk(new THREE.PlaneGeometry(2.4, 0.6), new THREE.MeshStandardMaterial({ map: sign, roughness: 0.9 }), gx - 0.25, FC.top - 0.5, FC.C[1]); sg.rotation.y = -Math.PI / 2;
  /* Morgan's Line: a low stone breastwork with guns along the seaward shore */
  for (let i = 0; i < MLINE.length - 1; i++) { const [ax, az] = MLINE[i], [bx, bz] = MLINE[i + 1], L = Math.hypot(bx - ax, bz - az), w = mk(new THREE.BoxGeometry(L, 1.1, 0.9), stone, (ax + bx) / 2, 0.55, (az + bz) / 2); w.rotation.y = -Math.atan2(bz - az, bx - ax);
    for (let k = 1; k <= 2; k++) { const t = k / 3, x = ax + (bx - ax) * t, z = az + (bz - az) * t, nx = (bz - az) / L, nz = -(bx - ax) / L; gun(x - nx * 1.3, z - nz * 1.3, Math.atan2(nx, nz), 0); } }

  dressSpit(g, stone, wood, dark);
  cur = prev; FORT.ready = true; };
/* ---------- the spit: dunes, a trodden path, beach grass, sea grape, rocks, surf, a fishing boat and nets ---------- */
const SPITC = [];
function dressSpit(g, stone, wood, dark) {
  let seed = 1690; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const segD2 = (x, z, a, b) => { const dx = b[0] - a[0], dz = b[1] - a[1], t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / (dx * dx + dz * dz))); return Math.hypot(x - a[0] - dx * t, z - a[1] - dz * t); };
  const PATH = [[20.5, -9.5], [27, -16], [33, -24], [36.6, -30]];
  const pathD = (x, z) => Math.min(...PATH.slice(1).map((p, i) => segD2(x, z, PATH[i], p)));
  const edgeD = (x, z) => Math.min(...SPIT.map((p, i) => segD2(x, z, p, SPIT[(i + 1) % SPIT.length])));
  const fortD = (x, z) => Math.hypot((x - FC.C[0]) / (FC.rx + 3), (z - FC.C[1]) / (FC.rz + 3));
  const lineD = (x, z) => Math.min(...MLINE.slice(1).map((p, i) => segD2(x, z, MLINE[i], p)));
  const free = (x, z, clear = 1.6) => onSpit(x, z) && fortD(x, z) > 1 && pathD(x, z) > clear + 1 && lineD(x, z) > 2.2;
  const pick = (n, test, tries = 4000) => { const out = []; for (let k = 0; k < tries && out.length < n; k++) { const x = 18 + rnd() * 51, z = -45 + rnd() * 37; if (test(x, z)) out.push([x, z]); } return out; };
  const soft = (r, g2, b, a) => cv(128, 128, (c) => { const gr = c.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, `rgba(${r},${g2},${b},${a})`); gr.addColorStop(0.6, `rgba(${r},${g2},${b},${a * 0.6})`); gr.addColorStop(1, `rgba(${r},${g2},${b},0)`); c.fillStyle = gr; c.fillRect(0, 0, 128, 128); });
  const decal = (tex, x, z, sx, sz, ry, y) => { const m = mk(new THREE.PlaneGeometry(1, 1), new THREE.MeshStandardMaterial({ map: tex, transparent: true, depthWrite: false, roughness: 1 }), x, y, z, g); m.rotation.set(-Math.PI / 2, 0, ry); m.scale.set(sx, sz, 1); return m; };
  /* the path the soldiers wear between the town and the gate: soft darker, firmer sand */
  const trod = soft(150, 128, 92, 0.55);
  for (let i = 0; i < PATH.length - 1; i++) { const [ax, az] = PATH[i], [bx, bz] = PATH[i + 1], L = Math.hypot(bx - ax, bz - az); for (let t = 0; t <= L; t += 1.1) { const x = ax + (bx - ax) * t / L + (rnd() - 0.5) * 0.5, z = az + (bz - az) * t / L + (rnd() - 0.5) * 0.5; decal(trod, x, z, 2.6 + rnd() * 0.8, 2.2 + rnd() * 0.6, rnd() * 6, 0.012); } }
  /* shading in the sand: damp hollows and pale wind-blown patches */
  const dampT = soft(170, 148, 108, 0.45), paleT = soft(226, 210, 172, 0.3);
  for (const [x, z] of pick(26, (x, z) => onSpit(x, z) && fortD(x, z) > 1)) decal(rnd() < 0.5 ? dampT : paleT, x, z, 3 + rnd() * 5, 2 + rnd() * 3, rnd() * 6, 0.009);
  /* low dunes, mostly toward the open, windward side */
  const sandM = new THREE.MeshStandardMaterial({ map: noiseTex([198, 176, 134], 30, 3), roughness: 1 });
  for (const [x, z] of pick(14, (x, z) => free(x, z, 2.2) && edgeD(x, z) > 2.5)) { const d = mk(new THREE.SphereGeometry(1, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2), sandM, x, -0.02, z, g); d.scale.set(2.6 + rnd() * 2.6, 0.12 + rnd() * 0.16, 1.8 + rnd() * 1.6); d.rotation.y = rnd() * 6; }
  /* beach grass: tufts of thin blades, thickest on the dunes and along the top of the beach */
  const bladeT = cv(64, 128, (c) => { c.clearRect(0, 0, 64, 128); for (let k = 0; k < 14; k++) { const x = 6 + Math.random() * 52, lean = (Math.random() - 0.5) * 26, h = 60 + Math.random() * 64; c.strokeStyle = `rgb(${110 + Math.random() * 60},${120 + Math.random() * 40},${60 + Math.random() * 20})`; c.lineWidth = 2 + Math.random() * 2; c.beginPath(); c.moveTo(x, 128); c.quadraticCurveTo(x + lean * 0.3, 128 - h * 0.5, x + lean, 128 - h); c.stroke(); } });
  bladeT.wrapS = bladeT.wrapT = THREE.ClampToEdgeWrapping;
  const tuftG = (() => { const parts = []; for (let k = 0; k < 3; k++) { const p = new THREE.PlaneGeometry(0.9, 0.7); p.translate(0, 0.35, 0); p.rotateY(k * Math.PI / 3); parts.push(p); } return mergeG(parts); })();
  const grass = pick(130, (x, z) => onSpit(x, z) && fortD(x, z) > 1.02 && pathD(x, z) > 1.6 && lineD(x, z) > 1.2 && edgeD(x, z) > 0.9);
  const gi = new THREE.InstancedMesh(tuftG, new THREE.MeshStandardMaterial({ map: bladeT, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 1 }), grass.length); const o = new THREE.Object3D();
  grass.forEach(([x, z], i) => { o.position.set(x, 0, z); o.rotation.set(0, rnd() * 6, 0); const k = 0.5 + rnd() * 0.6; o.scale.set(k, k * (0.7 + rnd() * 0.5), k); o.updateMatrix(); gi.setMatrixAt(i, o.matrix); }); g.add(gi);
  /* sea grape and scrub: rounded clumps of leathery leaves */
  const leafM = new THREE.MeshStandardMaterial({ map: noiseTex([62, 92, 46], 50, 3), roughness: 0.85, flatShading: true }), bushG = new THREE.IcosahedronGeometry(0.6, 1); { const bp = bushG.attributes.position; for (let i = 0; i < bp.count; i++) { const k = 0.82 + 0.3 * (0.5 + 0.5 * Math.sin(bp.getX(i) * 37.1 + bp.getY(i) * 91.7 + bp.getZ(i) * 53.3)); bp.setXYZ(i, bp.getX(i) * k, bp.getY(i) * k, bp.getZ(i) * k); } bushG.computeVertexNormals(); }
  for (const [x, z] of pick(16, (x, z) => free(x, z, 1.8) && edgeD(x, z) > 1.8 && lineD(x, z) > 4)) { for (let k = 0; k < 3 + (rnd() * 3 | 0); k++) { const b = mk(bushG, leafM, x + (rnd() - 0.5) * 1.6, 0.25, z + (rnd() - 0.5) * 1.6, g); const sc = 0.5 + rnd() * 0.5; b.scale.set(sc * 1.2, sc * 0.75, sc); b.rotation.y = rnd() * 6; } SPITC.push([x, z, 1.3]); }
  /* rocks along the waterline */
  const rockM = new THREE.MeshStandardMaterial({ map: noiseTex([118, 112, 102], 30, 2), roughness: 0.95 }), rockG = new THREE.DodecahedronGeometry(0.5, 0);
  for (let i = 0; i < SPIT.length; i++) { const a = SPIT[i], b = SPIT[(i + 1) % SPIT.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); for (let t = rnd() * 3; t < L; t += 2 + rnd() * 4) { const x = a[0] + (b[0] - a[0]) * t / L, z = a[1] + (b[1] - a[1]) * t / L; if (pathD(x, z) < 2.5) continue; const r = mk(rockG, rockM, x, -0.12, z, g); const sc = 0.5 + rnd() * 1.1; r.scale.set(sc * (1 + rnd() * 0.5), sc * 0.6, sc); r.rotation.set(rnd(), rnd() * 6, rnd()); } }
  /* surf: a soft band of foam that breathes in and out around the shore */
  const ring = (k0, k1) => { const cx = SPIT.reduce((a, p) => a + p[0], 0) / SPIT.length, cz = SPIT.reduce((a, p) => a + p[1], 0) / SPIT.length, sh = new THREE.Shape(), hole = new THREE.Path(); SPIT.forEach(([x, z], i) => { const X = cx + (x - cx) * k1, Z = cz + (z - cz) * k1; i ? sh.lineTo(X, -Z) : sh.moveTo(X, -Z); }); [...SPIT].reverse().forEach(([x, z], i) => { const X = cx + (x - cx) * k0, Z = cz + (z - cz) * k0; i ? hole.lineTo(X, -Z) : hole.moveTo(X, -Z); }); sh.holes.push(hole); return new THREE.ShapeGeometry(sh); };
  const foamT = cv(256, 32, (c) => { for (let k = 0; k < 900; k++) { c.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`; c.fillRect(Math.random() * 256, Math.random() * 32, 2 + Math.random() * 6, 1 + Math.random() * 2); } });
  const foamM = new THREE.MeshBasicMaterial({ map: foamT, transparent: true, opacity: 0.55, depthWrite: false, color: 0xf6f4ee }); foamT.repeat.set(0.4, 0.4);
  const foam = mk(ring(1.03, 1.075), foamM, 0, -0.27, 0, g); foam.rotation.x = -Math.PI / 2;
  TICKS.push(() => { if (state.place !== 'out') return; const t = performance.now() / 1000; foamM.opacity = 0.35 + 0.25 * Math.sin(t * 0.9); foamT.offset.set(t * 0.01, Math.sin(t * 0.6) * 0.05); const k = 1 + 0.006 * Math.sin(t * 0.9); foam.scale.set(k, k, 1); });
  /* driftwood */
  const driftM = new THREE.MeshStandardMaterial({ color: 0x9c907e, roughness: 1 });
  for (const [x, z] of pick(6, (x, z) => free(x, z) && edgeD(x, z) < 2.2 && edgeD(x, z) > 0.8)) { const d = mk(new THREE.CylinderGeometry(0.07, 0.11, 1.6 + rnd() * 1.6, 7), driftM, x, 0.07, z, g); d.rotation.set(Math.PI / 2, 0, rnd() * 6); }
  /* a fishing canoe drawn up on the inner shore, nets drying on a pole rack beside it */
  const hull = new THREE.Group(); hull.position.set(24.2, 0.02, -24.5); hull.rotation.y = 1.15; g.add(hull);
  const hm = new THREE.MeshStandardMaterial({ map: plankTex([92, 70, 50], 5, 2, 1), roughness: 0.95, side: THREE.DoubleSide }), hg = new THREE.SphereGeometry(1, 20, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2); hg.scale(2.4, 0.42, 0.55);
  const hp = hg.attributes.position; for (let i = 0; i < hp.count; i++) hp.setY(i, hp.getY(i) + 0.05 * (hp.getX(i) / 2.4) ** 2); hg.computeVertexNormals(); const hl = mk(hg, hm, 0, 0.42, 0, hull);
  for (const x of [-0.9, 0.5]) mk(new THREE.BoxGeometry(0.12, 0.04, 1.0), wood, x, 0.36, 0, hull);
  const pad = mk(new THREE.CylinderGeometry(0.025, 0.025, 2.4, 6), wood, 0.2, 0.48, 0.3, hull); pad.rotation.z = Math.PI / 2 + 0.05;
  SPITC.push([24.2, -24.5, 1.4], [25.7, -23.9, 1.0], [22.7, -25.1, 1.0]);
  const netT = cv(128, 128, (c) => { c.clearRect(0, 0, 128, 128); c.strokeStyle = 'rgba(70,60,45,0.95)'; c.lineWidth = 1.4; for (let k = -128; k < 256; k += 10) { c.beginPath(); c.moveTo(k, 0); c.lineTo(k + 128, 128); c.stroke(); c.beginPath(); c.moveTo(k + 128, 0); c.lineTo(k, 128); c.stroke(); } });
  const netM = new THREE.MeshStandardMaterial({ map: netT, transparent: true, alphaTest: 0.2, side: THREE.DoubleSide, roughness: 1 }); netT.repeat.set(2, 1);
  const NX = 21.6, NZ = -20.2, NR = 0.55;
  for (const dx of [-1.4, 1.4]) { mk(new THREE.CylinderGeometry(0.05, 0.06, 1.9, 6), wood, NX + Math.cos(NR) * dx, 0.95, NZ - Math.sin(NR) * dx, g); SPITC.push([NX + Math.cos(NR) * dx, NZ - Math.sin(NR) * dx, 0.35]); }
  const rail = mk(new THREE.CylinderGeometry(0.03, 0.03, 3.0, 6), wood, NX, 1.82, NZ, g); rail.rotation.set(0, NR, Math.PI / 2);
  const ng = new THREE.PlaneGeometry(2.9, 1.5, 12, 6), np = ng.attributes.position; for (let i = 0; i < np.count; i++) { const u = np.getX(i), v = np.getY(i); np.setZ(i, 0.12 * Math.sin(u * 2.2) * (0.75 - v) + 0.04 * Math.sin(u * 7)); np.setY(i, v - 0.05 * Math.cos(u * 2.1)); } ng.computeVertexNormals();
  const net = mk(ng, netM, NX, 1.05, NZ, g); net.rotation.y = NR;
  /* a basket and a coil of line by the boat */
  mk(new THREE.CylinderGeometry(0.28, 0.22, 0.34, 12), new THREE.MeshStandardMaterial({ map: noiseTex([150, 118, 70], 30, 2), roughness: 1 }), 25.9, 0.17, -25.8, g);
  const coil = mk(new THREE.TorusGeometry(0.22, 0.05, 6, 16), new THREE.MeshStandardMaterial({ color: 0xc8b48a, roughness: 1 }), 22.9, 0.05, -23.4, g); coil.rotation.x = Math.PI / 2;
  /* round shot piled in pyramids behind Morgan's Line, ready for the guns */
  const ballG = new THREE.SphereGeometry(0.09, 10, 8);
  const pile = (x, z) => { for (let l = 0; l < 3; l++) for (let a = 0; a < 3 - l; a++) for (let b = 0; b < 3 - l; b++) mk(ballG, dark, x + (a - (2 - l) / 2) * 0.18, 0.09 + l * 0.15, z + (b - (2 - l) / 2) * 0.18, g); };
  for (let i = 0; i < MLINE.length - 1; i++) { const [ax, az] = MLINE[i], [bx, bz] = MLINE[i + 1], L = Math.hypot(bx - ax, bz - az), nx = (bz - az) / L, nz = -(bx - ax) / L; const x = (ax + bx) / 2 - nx * 2.6, z = (az + bz) / 2 - nz * 2.6; pile(x, z); SPITC.push([x, z, 0.45]); }
  /* Morgan's Line: dressed coping stones along the top */
    for (let i = 0; i < MLINE.length - 1; i++) { const [ax, az] = MLINE[i], [bx, bz] = MLINE[i + 1], L = Math.hypot(bx - ax, bz - az), ry = -Math.atan2(bz - az, bx - ax), nx = (bz - az) / L, nz = -(bx - ax) / L;
    const cap = mk(new THREE.BoxGeometry(L + 0.1, 0.14, 1.04), stone, (ax + bx) / 2, 1.17, (az + bz) / 2, g); cap.rotation.y = ry; }
}
FORTP.gunner = [FC.C[0] - 6.2, FC.C[1] + 2.2, -Math.PI / 2];
ACTIONS.forEach((a) => { if (a.label === 'Talk to the gunner') a.where = () => FORT.ready && !Q.on && state.place === 'out' && people.gunner && [FORTP.gunner[0], FORTP.gunner[1]]; });
GUNNER.splice(0, GUNNER.length,
  { who: 'The gunner', text: 'Welcome to Fort Charles! The sea is all around us. No ship gets past our guns.' },
  { who: 'The gunner', text: 'We have 38 big guns. The round tower holds the gunpowder, so no fire near it!' },
  { who: 'The gunner', text: 'Five more forts guard the town.' },
  { who: 'You', text: 'Have the guns ever been fired?' },
  { who: 'The gunner', text: 'When Henry Morgan died, the ships fired 22 guns for him. Climb the ramp and watch the sea!', unlock: 'forts' });
{ const j = JOURNAL.find((p) => p.id === 'forts'); if (j) j.deeper = ['Fort Charles was the first, begun in 1655 around a round stone tower. In 1687 a visitor, John Taylor, described it with eight sides, 38 guns and a mortar, and the old tower used to store gunpowder. That is the fort in this game.', 'It was the only fort that survived the 1692 earthquake. Forts James, Carlisle and Rupert sank into the sea.', 'Over the next hundred years it was rebuilt in red brick, into the fort you can visit in Port Royal today.']; }
const _fire = fireSalute; fireSalute = () => { if (!FORT.guns) return; const sea = FORT.guns.filter((c) => c.position.x > FC.C[0] + 4 && c.position.y > 1).slice(0, 5); sea.forEach((c, i) => setTimeout(() => { if (state.place !== 'out' || FB.on) return; const p = new THREE.Vector3(0, 0.62, 1.5); c.localToWorld(p); boom(p.x, p.z); }, 700 + i * 950)); };

/* ---------- a glowing speech mark over anyone you can talk to; the button becomes a round "talk" icon ---------- */
const BUBBLE = cv(128, 128, (c) => { const g = c.createRadialGradient(64, 64, 8, 64, 64, 62); g.addColorStop(0, 'rgba(255,190,70,0.9)'); g.addColorStop(0.35, 'rgba(255,180,60,0.45)'); g.addColorStop(1, 'rgba(255,170,50,0)'); c.fillStyle = g; c.fillRect(0, 0, 128, 128); c.fillStyle = '#f6c45c'; c.strokeStyle = 'rgba(70,45,10,0.85)'; c.lineWidth = 3; c.beginPath(); c.arc(64, 64, 15, 0, Math.PI * 2); c.fill(); c.stroke(); c.fillStyle = '#fff3d0'; c.beginPath(); c.arc(59, 59, 5, 0, Math.PI * 2); c.fill(); });
const MARKS = []; let markN = 0;
function markSprite() { if (markN < MARKS.length) return MARKS[markN++]; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: BUBBLE, transparent: true, depthWrite: false, depthTest: true, fog: false })); sp.renderOrder = 5; scene.add(sp); MARKS.push(sp); markN++; return sp; }
const isTalk = (a) => /^Talk to /.test(a.label);
const markY = (a) => /old Ned|surgeon/.test(a.label) ? 1.7 : 2.15;
const TB = { el: null, world: new THREE.Vector3(), a: null };
TICKS.push(() => { markN = 0; TB.a = null; const now = performance.now() / 1000;
  if (state.started && !busy && $('card').hidden) for (const a of ACTIONS) { if (!isTalk(a) || !!FB.on !== !!a.fb) continue; const w = a.where(); if (!w) continue; const d = Math.hypot(state.x - w[0], state.z - w[1]); if (d > 16) continue;
    const sp = markSprite(), near = a === current, home = state.place === 'in' ? indoor : state.place === 'ware' ? wareG : state.place === 'after' ? afterG : state.place === 'yard' ? yardG : scene;
    if (sp.parent !== home && home) home.add(sp);
    const base = state.place === 'sea' ? seaLevel + 1.6 : (state.place === 'out' ? groundYAt(w[0], w[1]) : 0) + markY(a);
    sp.position.set(w[0], base + Math.sin(now * 2.4 + w[0]) * 0.06, w[1]); const k = (0.4 + d * 0.035) * (1 + Math.sin(now * 2 + w[0]) * 0.1); sp.scale.set(k, k, k); sp.material.opacity = Math.max(0.6, 1 - d / 20); sp.visible = !near;
    if (near) { TB.world.set(w[0], base - 0.2, w[1]); if (home !== scene) TB.world.applyMatrix4(home.matrixWorld); TB.a = a; } }
  for (let i = markN; i < MARKS.length; i++) MARKS[i].visible = false;
  if (!TB.el) { TB.el = document.createElement('button'); TB.el.className = 'tbub'; TB.el.hidden = true; document.body.appendChild(TB.el); TB.el.addEventListener('click', (e) => { e.stopPropagation(); if (TB.a && !busy) TB.a.go(); }); }
  const show = TB.a && TB.a === current && !busy; TB.el.hidden = !show; if (!show) return;
  const p = TB.world.clone().project(camera); if (p.z > 1) { TB.el.hidden = true; return; }
  const r = canvas.getBoundingClientRect(); TB.el.style.left = (r.left + (p.x + 1) / 2 * r.width) + 'px'; TB.el.style.top = (r.top + (1 - p.y) / 2 * r.height) + 'px';
  if (TB.el.dataset.label !== TB.a.label) { TB.el.dataset.label = TB.a.label; TB.el.innerHTML = TALK_SVG + '<span class="who">' + TB.a.label.replace(/^Talk to (the )?/, '').replace(/\b\w/g, (c) => c.toUpperCase()) + '</span>'; TB.el.setAttribute('aria-label', TB.a.label); } });
/* a quick tap on the person you can talk to also starts the conversation */
let tapRing = null;
function tapMark(x, y, z) {   /* a small ring where you tapped, fading as you walk */
  if (!tapRing) { tapRing = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.22, 24), new THREE.MeshBasicMaterial({ color: 0xffd58a, transparent: true, depthWrite: false })); tapRing.rotation.x = -Math.PI / 2; tapRing.renderOrder = 4;
    TICKS.push((dt) => { if (!tapRing.parent) return; tapRing.material.opacity = Math.max(0, tapRing.material.opacity - dt * 0.9); const k = 1 + (1 - tapRing.material.opacity) * 0.6; tapRing.scale.set(k, k, 1); if (!MV.tap && tapRing.material.opacity < 0.05) tapRing.parent.remove(tapRing); }); }
  const home = state.place === 'in' ? indoor : state.place === 'ware' ? wareG : state.place === 'after' ? afterG : state.place === 'yard' ? yardG : scene; home.add(tapRing); tapRing.position.set(x, y + 0.03, z); tapRing.material.opacity = 0.9; }
{ let t0 = 0, x0 = 0, y0 = 0; canvas.addEventListener('pointerdown', (e) => { t0 = performance.now(); x0 = e.clientX; y0 = e.clientY; });
  canvas.addEventListener('pointerup', (e) => { if (performance.now() - t0 > 350 || Math.hypot(e.clientX - x0, e.clientY - y0) > 8 || busy || !state.started) return;
    if (!current || !isTalk(current) || TB.el.hidden) { if (e.pointerType !== 'mouse') return;   /* tap-to-walk is for mouse clicks only: on phones a tap is for looking */ const rc = new THREE.Raycaster(), v = new THREE.Vector2(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); rc.setFromCamera(v, camera);
      const gy = groundY(state.x, state.z), d = rc.ray.direction; if (d.y > -0.02) return; const t = (gy - rc.ray.origin.y) / d.y; const px = rc.ray.origin.x + d.x * t, pz = rc.ray.origin.z + d.z * t; if (Math.hypot(px - state.x, pz - state.z) < 25) { MV.tap = [px, pz]; tapMark(px, gy, pz); } return; }
    const r = TB.el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; if (Math.abs(e.clientX - cx) < 140 && e.clientY > cy - 60 && e.clientY < cy + 420) current.go(); }); }
const TALK_SVG = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12c0 4-4 7-9 7-1.2 0-2.4-.2-3.4-.5L3 20l1.5-4.2C3.6 14.7 3 13.4 3 12c0-4 4-7 9-7s9 3 9 7z"/><circle cx="8" cy="12" r=".6" fill="currentColor"/><circle cx="12" cy="12" r=".6" fill="currentColor"/><circle cx="16" cy="12" r=".6" fill="currentColor"/></svg>';
function setActionButton(a) { const b = $('talk'); b.dataset.label = a.label; if (isTalk(a)) { b.classList.add('icon'); b.innerHTML = TALK_SVG + '<span class="who">' + a.label.replace(/^Talk to (the )?/, '').replace(/\b\w/g, (c) => c.toUpperCase()) + '</span>'; b.setAttribute('aria-label', a.label); }
  else { b.classList.remove('icon'); b.textContent = a.label; b.removeAttribute('aria-label'); } }

function tankard(m) {   /* a pewter tankard that follows Ned's hand but stays upright, tipping only as it nears his mouth */
  const h = m.getObjectByName('mixamorigRightHand'), mid = m.getObjectByName('mixamorigRightHandMiddle1'), head = m.getObjectByName('mixamorigHead'), sp = m.getObjectByName('mixamorigSpine2'); if (!h || !m.parent) return;
  const g = new THREE.Group(), pew = new THREE.MeshStandardMaterial({ color: 0x9a9da2, metalness: 0.6, roughness: 0.4 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.046, 0.12, 16), pew); body.position.y = 0.02; g.add(body);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.043, 0.008, 16), pew); lid.position.y = 0.083; g.add(lid);
  const hd = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.008, 6, 12, Math.PI), pew); hd.position.set(0.045, 0.02, 0); hd.rotation.z = -Math.PI / 2; g.add(hd);
  m.parent.add(g); const a = new THREE.Vector3(), b = new THREE.Vector3(), hp = new THREE.Vector3(), cp = new THREE.Vector3(), q = new THREE.Quaternion(), yq = new THREE.Quaternion(), tq = new THREE.Quaternion(), X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0);
  TICKS.push(() => { if (!m.parent) { g.visible = false; return; } g.visible = m.visible; h.getWorldPosition(a); if (mid) mid.getWorldPosition(b); else b.copy(a); a.lerp(b, 0.75);
    m.parent.worldToLocal(g.position.copy(a)); g.position.y -= 0.02;
    m.getWorldQuaternion(q); const e = new THREE.Euler().setFromQuaternion(q, 'YXZ'); yq.setFromAxisAngle(Y, e.y + Math.PI / 2);   /* handle toward the palm */
    let tip = 0; if (head && sp) { head.getWorldPosition(hp); sp.getWorldPosition(cp); tip = Math.max(0, Math.min(1, (a.y - cp.y) / Math.max(0.05, hp.y - cp.y))); }
    tq.setFromAxisAngle(X, -tip * 1.3); g.quaternion.copy(yq).multiply(tq); }); }
