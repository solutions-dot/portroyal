import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';

/* ---------- story content: plain words first, more detail behind "Dig deeper" ---------- */
const JOURNAL = [
  { id: 'galdy', title: 'Who is Lewis Galdy?',
    simple: ['Lewis Galdy was a real person. He was born in France in 1659.',
             'His family were Huguenots. That means French Protestants. In France they were punished for their religion, so Lewis sailed across the ocean to Jamaica.'],
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
             'Not everyone chose to come, and not everyone was free. Many African people here were enslaved. That means they were forced to work, were not paid, and were not allowed to leave.',
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
    deeper: ['In 1959 a diver named Edwin Link brought up a bottle that still had liquid in it. He tested what was inside. It tasted terrible.',
             'You can see real objects from Port Royal at the National Museum of Jamaica in Kingston.'] },
  { id: 'pewter', title: 'Pewter plates',
    simple: ['Pewter is a soft grey metal. Many people ate from pewter plates.',
             'In one sunken building, archaeologists found about 25 pewter plates stacked in a cupboard under the stairs.'],
    deeper: ['Port Royal has given the world its largest collection of pewter from the late 1600s.',
             'A pewter maker named Simon Benning had a workshop in the town from 1667 or even earlier.'] },
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
    simple: ['Port Royal was built on loose, wet sand.', 'When loose, wet sand is shaken very hard, it stops acting like solid ground. It flows like a liquid. Heavy brick houses sank straight down into it.'],
    deeper: ['Scientists call this liquefaction.', 'It is why divers found some buildings under the sea with their brick floors still in place.'] },
  { id: 'watch', title: 'The stopped watch',
    simple: ['In 1959, divers found a brass pocket watch under the sea at Port Royal.', 'Its hands had stopped at 17 minutes before noon.'],
    deeper: ['The watch was made in Amsterdam in 1686. People believe it stopped when the earthquake struck. That is how we know the time: about 11:43 in the morning.'] },
  { id: 'tomb', title: 'Swallowed, and saved',
    simple: ['This part of the story is true. Lewis Galdy was swallowed by the ground. A second shock threw him out into the sea.', 'He swam until a boat picked him up.'],
    deeper: ['His tombstone says he was \u201cmiraculously saved by swimming until a boat took him up.\u201d He lived for 47 more years.',
             'In this game, Abba is in the boat. We made that part up. Nobody wrote down who was in the boat that saved him.'] },
  { id: 'after', title: 'The days after',
    simple: ['The earthquake lasted about three minutes. The hard days came after.', 'People had little food and no clean water. Many who lived through the earthquake became sick. Thousands more died.'],
    deeper: ['At night, thieves robbed the broken houses. The town\u2019s minister wrote about them in a letter.', 'The camp in this game is made up. The hunger, the sickness and the thieves were real.'] },
  { id: 'tentp', title: 'Church in a tent',
    simple: ['The great church fell down in the earthquake.', 'So the minister held church in a tent.'],
    deeper: ['A news sheet printed in London in 1692 shows him preaching in a tent, with ruined houses all around.'] },
  { id: 'kingston', title: 'A new town across the water',
    simple: ['Most people who lived left Port Royal. They crossed the harbour and began a new town.', 'That town became Kingston, the capital of Jamaica today.'],
    deeper: ['Port Royal was built again, but smaller. It was never again the great trading town it had been.', 'A few merchants and fishermen stayed. Lewis Galdy was one of them.'] },
  { id: 'fortune', title: 'Where the money came from',
    simple: ['Lewis Galdy became rich again. He sold wine and cocoa. He also sold people.', 'He worked for a company that shipped enslaved African people to Spanish lands. This game does not look away from that.'],
    deeper: ['That trade was called the Asiento. Galdy was one of its agents in Jamaica.', 'He also sat in Jamaica\u2019s Assembly, which made the island\u2019s laws, and he chased pirates for the governor.'] },
  { id: 'stone', title: 'The tombstone',
    simple: ['Lewis Galdy died in 1739. He was 80 years old.', 'His tombstone tells how the earthquake swallowed him and how he was saved. You can visit it today at St Peter\u2019s Church in Port Royal.'],
    deeper: ['He helped to build this church in 1726.', 'His tomb was first at a place called Green Bay, across the harbour. It was moved here in 1953.',
             'The stone tells his story. The people he bought and sold have no stones, and most of their names were never written down.'] },
  { id: 'sugar', title: 'Sugar',
    simple: ['These big casks are full of sugar. Sugar was the main thing Jamaica sold to the world.', 'Enslaved African people grew the sugar cane and made the sugar. The work was very hard and very dangerous.'],
    deeper: ['A big cask like this is called a hogshead.', 'Sugar made planters and merchants rich. The people who made it were paid nothing.'] },
  { id: 'cocoa', title: 'Cocoa',
    simple: ['These sacks hold cocoa beans. People ground them up to make a chocolate drink.', 'We know that Lewis Galdy traded in cocoa.'],
    deeper: ['In the 1600s, chocolate was a drink, not a bar. People drank it hot, often with spices.'] },
  { id: 'logwood', title: 'Logwood',
    simple: ['This dark red wood is called logwood. It was not for building.', 'People boiled it to make dye for cloth.'],
    deeper: ['Many old privateers became logwood cutters on the coast of Central America. Much of their wood was shipped through Jamaica to Europe.'] },
  { id: 'scales', title: 'Weighing coins',
    simple: ['Merchants did not just count coins. They weighed them.', 'Some people shaved silver off the edges of coins and kept it. A scale showed if a coin was too light.'],
    deeper: ['Shaving coins was called clipping. It was a crime.'] },
  { id: 'market', title: 'The slave market',
    simple: ['Ships brought enslaved African people to Port Royal to be sold.', 'Families were split apart on the wharf. The law allowed this. It was still wrong.'],
    deeper: ['Until 1698, one company, the Royal African Company, was the only English company allowed to bring enslaved people from Africa.',
             'We do not know the year Lewis Galdy began to buy and sell people. We know that he did. The letter in this game is made up, to show the choice in front of him.',
             'Abba\u2019s mother is made up too. Thousands of real mothers were sold in Port Royal.'] },
];
const COINS = [
  { who: 'You', text: 'A ship\u2019s cook wants a sack of cocoa. The price is 20 reales.' },
  { who: 'You', text: 'He gives me 3 pieces of eight. Each one is worth 8 reales. How many reales do I give back?',
    choices: [{ t: '2 reales' }, { t: '4 reales', ok: true }, { t: '6 reales' }], hint: 'Not quite. Three eights are 24. Take away 20.' },
  { who: 'You', text: 'Four reales. But first I weigh his coins. One is too light. Someone has shaved its edge.', unlock: 'scales' },
];
const WARE1 = [
  { who: 'Abba', text: 'Good day, Lewis. I need a cask of wine for The Turtle.' },
  { who: 'You', text: 'Take the one by the door. You can pay me on Friday.' },
  { who: 'Abba', text: 'There is a letter on your desk. The captain of the slave ship left it. I know what it asks.' },
  { who: 'Abba', text: 'My mother was sold on that wharf, Lewis. Read it. Then decide what kind of merchant you are.', unlock: 'market' },
  { id: 'kofi', title: 'Kofi\u2019s name',
    simple: ['Many enslaved people in Jamaica were taken from West Africa. Kofi is an Akan name from West Africa. It is given to a boy born on a Friday.', 'Owners often gave enslaved people new names. Many people kept their own names among themselves.'],
    deeper: ['Enslaved Africans did much of the hardest work in Port Royal: loading ships, carrying goods, building and rowing.', 'Kofi is a character we made up. About 2,500 enslaved people lived in Port Royal, and most of their names were never written down.'] },
  { id: 'privateer', title: 'Pirates and privateers',
    simple: ['A privateer had a paper from the government that allowed him to attack enemy ships. A pirate had no paper, and attacked anyone.', 'In the 1660s, English leaders let privateers sail from Port Royal to raid Spanish ships and towns.'],
    deeper: ['The most famous was Henry Morgan. He later became Lieutenant Governor of Jamaica.', 'By the 1680s the government had turned against the raiders. Pirates caught by the law were hanged at Gallows Point, just outside the town.', 'Sam is a character we made up.'] },
  { id: 'benning', title: 'Simon Benning, pewterer',
    simple: ['Simon Benning was a real person. He was a pewterer: he made plates, spoons and cups from pewter.', 'He had a workshop in Port Royal from 1667 or even earlier.'],
    deeper: ['Pewter makers stamped their mark on what they made. Marks like these help archaeologists work out who made the things they find.', 'His words in this game are made up. We know about his trade from records and from objects found at Port Royal.'] },
  { id: 'heath', title: 'The Reverend Emmanuel Heath',
    simple: ['Emmanuel Heath was a real person. He was the minister of St Paul\u2019s Church in Port Royal.', 'He lived through the earthquake and wrote letters about it. Much of what we know about that day comes from him.'],
    deeper: ['He wrote from a ship called the Granada, out in the harbour. He went ashore to pray with the hurt and dying, and to christen children.', 'Like many people then, he believed the earthquake was God\u2019s punishment. Today, scientists explain it with loose, wet sand turning to liquid.', 'His words in this game are made up, but they follow what he wrote.'] },
];
const NPCS = [
  { id: 'kofi', label: 'Talk to the dockworker', who: 'Kofi', x: 21.7, z: 2.35, ry: Math.PI + 0.5, talk: [
    { who: 'Kofi', text: 'Mind the casks. They are heavy, and the captain wants them on board by noon.' },
    { who: 'You', text: 'Do you work for the captain?' },
    { who: 'Kofi', text: 'No. I am enslaved. A merchant in this town says he owns me. I work, and I am not paid.' },
    { who: 'Kofi', text: 'My mother named me Kofi, because I was born on a Friday. Here they call me something else. I keep my own name.', unlock: 'kofi' }],
    again: [{ who: 'Kofi', text: 'I have work to do. Go well.' }] },
  { id: 'sailor', label: 'Talk to the sailor', who: 'Sam', x: 34.5, z: 0.55, ry: Math.PI / 2, talk: [
    { who: 'Sam', text: 'Fine sloop, isn\u2019t she? Built of Jamaica cedar. Fast enough to catch anything on the sea.' },
    { who: 'You', text: 'Are you a pirate?' },
    { who: 'Sam', text: 'Hush! Years ago the governor gave us papers to attack Spanish ships. That made us privateers, not pirates.' },
    { who: 'Sam', text: 'Now the law has changed. Attack a ship without papers and they hang you at Gallows Point.', unlock: 'privateer' }],
    again: [{ who: 'Sam', text: 'We sail with the tide. Keep your purse close in the taverns.' }] },
  { id: 'benning', label: 'Talk to the pewterer', who: 'Simon Benning', x: 8.6, z: 3.55, ry: Math.PI, talk: [
    { who: 'Simon Benning', text: 'Good day! Simon Benning, pewterer. Plates, spoons, tankards. All made right here in Port Royal.' },
    { who: 'You', text: 'You make them here, not in England?' },
    { who: 'Simon Benning', text: 'I melt the metal and pour it into moulds. Then I scrape and polish. Look for my mark stamped underneath.' },
    { who: 'Simon Benning', text: 'This town is full of makers: silversmiths, pipe makers, carpenters. Ships bring the metal. We do the rest.', unlock: 'benning' }],
    again: [{ who: 'Simon Benning', text: 'Come back when you need plates. Good pewter lasts a lifetime.' }] },
];
const HEATH = { x: -9.65, z: 1.75, ry: Math.PI / 2 }, SURV = [[-2.6, -1.3, -0.6, 'kofi'], [-13.4, -1.6, 0.4, 'sailor']];
const HEATH_TALK = [
  { who: 'Emmanuel Heath', text: 'I am Emmanuel Heath, minister of this town. My church fell in the earthquake. I heard the tower come down.' },
  { who: 'Emmanuel Heath', text: 'I sleep on a ship in the harbour now. I come ashore to pray with the sick, and to christen the babies.' },
  { who: 'Emmanuel Heath', text: 'Many people say God punished this town for its wickedness. I fear they are right. Pray for us.', unlock: 'heath' }];
const AFTER1 = [
  { who: 'Abba', text: 'You are alive! I pulled so many from the water. Not enough.' },
  { who: 'Abba', text: 'It has been three days. There is little food, the water is bad, and people are getting sick.', unlock: 'after' },
  { who: 'Abba', text: 'At night, thieves go through the broken houses. In the day, we share what we have.' },
  { who: 'Abba', text: 'Look around. Then come back and tell me what you will do.' },
];
const AFTER2 = [
  { who: 'Abba', text: 'Most people are leaving. They are crossing the harbour to build a new town.' },
  { who: 'Abba', text: 'You are a merchant, Lewis. You will be rich again. Ask yourself what you will sell to get there.' },
];
const TALK = [
  { who: 'Abba', text: 'Morning! You look lost. Are you new in Port Royal?',
    choices: ['Yes. I just got off the ship.', 'Is it that easy to tell?'] },
  { who: 'Abba', text: 'Everyone here came from somewhere else. Where is home?' },
  { who: 'You', text: 'France. A town called Montpellier. It was not safe for my family to pray the way we do. So we left.', unlock: 'galdy' },
  { who: 'Abba', text: 'Then you are in good company. This town is full of people starting again. I am Abba. I keep this tavern.', unlock: 'people' },
  { who: 'Abba', text: 'Here is some advice. Money in this town is Spanish silver. People call the coins pieces of eight. Learn what things cost before you spend one.', unlock: 'coins' },
  { who: 'Abba', text: 'And look around you. Brick houses four floors high, on a strip of sand! Come inside when you are hungry. My turtle stew is the best on Lime Street.', unlock: 'town' },
];

const STEW = [
  { who: 'Abba', text: 'Welcome to The Turtle! A bowl of turtle stew is two reales.' },
  { who: 'You', text: 'I only have this. One piece of eight.' },
  { who: 'Abba', text: 'A piece of eight is worth eight reales. The stew is two. How many reales do I give you back?',
    choices: [{ t: 'Four reales' }, { t: 'Six reales', ok: true }, { t: 'Eight reales' }], hint: 'Not quite. Start with eight and take away two.' },
  { who: 'Abba', text: 'Six it is. Here is your change, and here is your stew. Eat while it is hot!', unlock: 'change' },
  { who: 'Abba', text: 'Look around while you eat. Almost everything in this room came here on a ship.' },
];
const AFTER = [{ who: 'Abba', text: 'Take your time. Look around. Port Royal will still be here tomorrow.' }];
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
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
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
  sky = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false })); scene.add(sky); }

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
    scene.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: colr, side: THREE.DoubleSide, fog: false })));
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
  cask(SHORE + 2.2, 0.05, 1.0); cask(SHORE + 2.9, 0.05, 1.15); cask(SHORE + 2.5, 0.05, 0.45, true); crate(SHORE + 14.6, 0.05, 1.1, 0.8, 0.2); crate(SHORE + 15.5, 0.05, 1.2, 0.6, 0.6); crate(SHORE + 14.7, 0.85, 1.1, 0.55, 0.5); sack(SHORE + 13.7, 0.05, 1.2, 1);
  for (const [x, z, k] of [[20.2, 2.8, 0], [20.9, 3.0, 0], [20.4, 3.6, 2], [19.6, -3.2, 1], [20.6, -2.8, 0], [21.5, -3.3, 1], [20.3, -3.9, 3], [21.1, -4.1, 3], [20.7, -4.0, 4]]) { if (k === 0) cask(x, 0, z); else if (k === 2) cask(x, 0, z, true); else if (k === 1) crate(x, 0, z, 0.75, x); else if (k === 3) sack(x, 0, z, 1); else sack(x, 0.3, z, 0.9); }
  const nStreet = scene.children.length;
  for (const [x, z, k] of [[-9.6, -4.4, 0], [3.4, 4.35, 0], [4.15, 4.4, 1], [-13.2, 4.4, 0], [11.6, -4.4, 1], [12.3, -4.45, 0]]) { if (k) crate(x, 0.12, z, 0.65, 0.1); else cask(x, 0.12, z); }
  streetProps.push(...scene.children.slice(nStreet));
  // a boat drawn up on the sand, with oars, and nets drying on a rack
  { const L = 4.6, Bm = 1.5, sh = new THREE.Shape(); sh.moveTo(-L / 2, -Bm * 0.36); sh.quadraticCurveTo(0, -Bm * 0.56, L * 0.3, -Bm * 0.4); sh.quadraticCurveTo(L * 0.45, -Bm * 0.2, L / 2, 0); sh.quadraticCurveTo(L * 0.45, Bm * 0.2, L * 0.3, Bm * 0.4); sh.quadraticCurveTo(0, Bm * 0.56, -L / 2, Bm * 0.36); sh.closePath();
    const hg = new THREE.ExtrudeGeometry(sh, { depth: 0.62, bevelEnabled: false, curveSegments: 8 }); hg.rotateX(-Math.PI / 2); const p = hg.attributes.position; for (let i = 0; i < p.count; i++) { const h = p.getY(i); if (h < 0.3) { p.setZ(i, p.getZ(i) * 0.45); p.setX(i, p.getX(i) * 0.9); } } hg.computeVertexNormals();
    const boat = new THREE.Group(); boat.position.set(SHORE - 2.6, 0.0, 7.2); boat.rotation.set(0, 0.5, 0.12); scene.add(boat); const hm = std(plankTex([96, 80, 62], 6, 3, 1)); hm.side = THREE.DoubleSide; mk(hg, hm, 0, 0, 0, boat);
    B(L * 0.86, 0.03, Bm * 0.78, new THREE.MeshStandardMaterial({ color: 0x3a2c20, roughness: 1 }), -0.1, 0.34, 0, boat); for (const x of [-1.2, -0.2, 0.9]) B(0.22, 0.04, Bm * 0.86, timber, x, 0.5, 0, boat);
    for (const z of [-0.2, 0.15]) { const o = mk(new THREE.CylinderGeometry(0.025, 0.025, 3.2, 6), timber, -0.2, 0.56, z, boat); o.rotation.z = Math.PI / 2 + 0.03; B(0.6, 0.02, 0.14, timber, 1.5, 0.52, z, boat); } }
  { const netT = cv(128, 128, (x) => { x.clearRect(0, 0, 128, 128); x.strokeStyle = 'rgba(96,84,60,0.95)'; x.lineWidth = 1.4; for (let i = -128; i < 256; i += 12) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 128, 128); x.stroke(); x.beginPath(); x.moveTo(i, 0); x.lineTo(i - 128, 128); x.stroke(); } }); netT.repeat.set(3, 1.4);
    const nx = SHORE - 3.2, nz = -8.4; for (const dx of [-2, 2]) mk(new THREE.CylinderGeometry(0.05, 0.06, 2.3, 6), timber, nx + dx, 1.15, nz); const bar = mk(new THREE.CylinderGeometry(0.04, 0.04, 4.3, 6), timber, nx, 2.2, nz); bar.rotation.z = Math.PI / 2;
    const net = mk(new THREE.PlaneGeometry(3.9, 1.9, 8, 1), new THREE.MeshBasicMaterial({ map: netT, transparent: true, side: THREE.DoubleSide, alphaTest: 0.3 }), nx, 1.25, nz); const np = net.geometry.attributes.position; for (let i = 0; i < np.count; i++) np.setZ(i, Math.sin(np.getX(i) * 2.2) * 0.12 * (1 - (np.getY(i) + 0.95) / 1.9)); }
  // shoreline: wet sand and a line of foam; gentle ripples on the water
  const wet = mk(new THREE.PlaneGeometry(3.2, 160), new THREE.MeshBasicMaterial({ color: 0x6f5d44, transparent: true, opacity: 0.35 }), SHORE - 1.4, 0.006, 0); wet.rotation.x = -Math.PI / 2;
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
  for (const c of scene.children) { if (c.isLight) continue; if (c === indoor) c.visible = p === 'in'; else if (c === wareG) c.visible = p === 'ware'; else if (c === afterG || c === yardG) c.visible = false; else c.visible = !inside; }
  home.add(abba); abba.visible = p !== 'ware';
  hemi.intensity = inside ? 0.5 : 2.3; sun.intensity = inside ? 1.5 : 2.6; if (p === 'in') sun.position.set(0.3, 0.75, 1); else if (p === 'ware') sun.position.set(1, 0.7, 0.2); else sun.position.set(-0.35, 1, 0.75);
  fireLight.intensity = p === 'in' ? 16 : 0; lamp.intensity = p === 'in' ? 9 : 0; if (wLamp) wLamp.intensity = p === 'ware' ? 14 : 0;
  if (p === 'in') { ABBA.x = -201; ABBA.z = -2.95; abba.position.set(ABBA.x, 0, ABBA.z); } else if (p === 'ware') { ABBA.x = 9999; ABBA.z = 0; } else { ABBA.x = -5.25; ABBA.z = -S + 1.05; abba.position.set(ABBA.x, 0.12, ABBA.z); }
  abba.rotation.y = 0; if (ring) ring.visible = !inside && !state.talked;
}

/* ---------- models ---------- */
const WID = { h1: 6.0, h2: 5.0, h3: 7.2, h4: 6.6, h5: 5.4, h6: 5.6 };
const NORTH = ['h2', 'h6', 'h1', 'h4', 'h5', 'h3'], SOUTH = ['h3', 'h1', 'h5', 'h2', 'h4', 'h6'];
const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder); let townReady = false;
function fail(n) { $('loadnote').hidden = false; $('loadnote').textContent = 'Part of the game did not load (' + n + '). Reload the page to try again.'; }
function script(n) { return new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = 'models/' + n + '.js'; sc.onload = res; sc.onerror = () => { fail(n); rej(n); }; document.head.appendChild(sc); }); }
function model(n) { return script(n).then(() => new Promise((res, rej) => { const b = atob(window.__models[n]); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); delete window.__models[n];
  loader.parse(u.buffer, '', res, () => { fail(n); rej(n); }); })); }
async function stage(names, onEach) { let done = 0; await Promise.all(names.map((n) => (n.startsWith('tex_') ? script(n) : model(n).then((g) => { window.__got = window.__got || {}; window.__got[n] = g; })).then(() => { done++; if (onEach) onEach(done / names.length); }))); }
const models = {}; let abba = null; const ABBA = { x: -5.25, z: -S + 1.05 };
const maxAniso = renderer.capabilities.getMaxAnisotropy();
const TEXMAP = { Brick: ['brick', 'brick_n'], Shingle: ['shingle', 'shingle_n'], ClayTile: ['clay', 'clay_n'], Wood: ['wood', 'wood_n'], Stone: ['stone', 'stone_n'], Plaster: ['plaster', 'plaster_n'], LeadedGlass: ['glass', 'glass_n'],
  Hull: ['hull', 'hull_n'], Spar: ['hull', 'hull_n'], Tar: ['hull', 'hull_n'], Ochre: ['hull', 'hull_n'], Red: ['hull', 'hull_n'], Deck: ['deck', 'deck_n'], Sail: ['canvas'], Glass: ['glass'], Flag: ['ensign'] };
const texCache = {}, matCache = {}, texLoader = new THREE.TextureLoader();
const imgs = {};
async function decodeTex() { await Promise.all(Object.keys(window.__tex || {}).filter((k) => !imgs[k]).map((k) => new Promise((res) => { const im = new Image(); im.onload = () => { imgs[k] = im; res(); }; im.onerror = () => res(); im.src = window.__tex[k]; }))); }
function sharedTex(key, color) { if (!texCache[key] && imgs[key]) { const t = new THREE.Texture(imgs[key]); t.needsUpdate = true; t.flipY = false; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.anisotropy = maxAniso; texCache[key] = t; } return texCache[key] || null; }
function prep(root) { root.traverse((o) => { if (o.isMesh && TEXMAP[o.material.name]) { const n = o.material.name; if (!matCache[n]) { const m = o.material, [c, nm] = TEXMAP[n]; m.map = sharedTex(c, true); m.color.set(0xffffff); if (nm) m.normalMap = sharedTex(nm, false); m.needsUpdate = true; matCache[n] = m; } o.material = matCache[n]; } }); return prep0(root); }
function prep0(root) { root.traverse((o) => { if (o.isMesh) { const m = o.material; if (m.map) m.map.anisotropy = maxAniso; if (m.name === 'LeadedGlass') { m.emissive = new THREE.Color(0x4a6470); m.emissiveMap = m.map; m.roughness = 0.2; } if (o.isSkinnedMesh) o.frustumCulled = false; } }); return root; }
let mixer = null, idle = null, peopleClip = null; const people = {}, mixers = [];
function animate(m) { if (!peopleClip) return; const mx = new THREE.AnimationMixer(m), a = mx.clipAction(peopleClip); a.play(); a.time = Math.random() * peopleClip.duration; mixers.push(mx); }
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
  if (k === 'escape') { closeJournal(); closeChapters(); }
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
const up = (e) => { if (e.pointerId === stick.id) { stick.id = null; stick.x = stick.y = 0; $('stick').hidden = true; } if (e.pointerId === look.id) look.id = null; };
canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);

function clampPos(nx, nz) {
  if (state.place === 'ware') { nx = Math.max(WX0 + 0.5, Math.min(WX1 - 0.6, nx)); nz = Math.max(-1.4, Math.min(4.4, nz)); for (const [tx, tz, r] of [[-258.6, 2.9, 1.5], [-252.5, 1.2, 1.0]]) { const dx = nx - tx, dz = nz - tz, d = Math.hypot(dx, dz); if (d < r && d > 0) { nx = tx + dx / d * r; nz = tz + dz / d * r; } } return [nx, nz]; }
  if (state.place === 'after') { nx = Math.max(X0 + 0.6, Math.min(0.4, nx)); nz = Math.max(-3.4, Math.min(3.4, nz));
    for (const t of CAMP_TENTS) [nx, nz] = pushOut(nx, nz, t[0], t[1], t[2] / 2 + 0.35, t[4] / 2 + 0.35, t[5]);
    for (const [cx, cz, r] of [[FX, FZ, 0.75], [ABBA.x, ABBA.z, 0.65], [HEATH.x, HEATH.z, 0.65], ...SURV.map((p) => [p[0], p[1], 0.6])]) { const dx = nx - cx, dz = nz - cz, d = Math.hypot(dx, dz); if (d < r && d > 0) { nx = cx + dx / d * r; nz = cz + dz / d * r; } } return [nx, nz]; }
  if (state.place === 'yard') { nx = Math.max(YX + 0.8, Math.min(YX + 13, nx)); nz = Math.max(YZ - 13, Math.min(YZ + 4.5, nz)); const dx = nx - (YX + 6), dz = nz - (YZ - 2), d = Math.hypot(dx, dz); if (d < 1.7 && d > 0) { nx = YX + 6 + dx / d * 1.7; nz = YZ - 2 + dz / d * 1.7; } return [nx, nz]; }
  if (state.place === 'sea') return [Math.max(SHORE + 4, Math.min(SHORE + 75, nx)), Math.max(9, Math.min(75, nz))];
  if (state.place === 'in') {
    nx = Math.max(IN.x0 + 0.45, Math.min(IN.x1 - 0.95, nx)); nz = Math.max(-1.5, Math.min(IN.z1 - 0.45, nz));
    for (const [tx, tz, r] of [[-198.2, 1.3, 1.25], [-201.6, 1.0, 1.25], [-195.9, 2.3, 0.75]]) { const dx = nx - tx, dz = nz - tz, d = Math.hypot(dx, dz); if (d < r && d > 0) { nx = tx + dx / d * r; nz = tz + dz / d * r; } }
    return [nx, nz];
  }
  nx = Math.max(X0 - 0.2, Math.min(SHORE + 23, nx)); if (!townReady && nx < X1 + 2.5) { nx = X1 + 2.5; if (!holdToast) { holdToast = true; toast('The town is still loading.'); setTimeout(() => { holdToast = false; }, 4000); } }
  nx = Math.min(SHORE + 21.5, nx); if (nx > SHORE - 1.5) { if (state.x <= SHORE - 1.5 && Math.abs(nz) > 1.4) nx = SHORE - 1.5; else nz = Math.max(-1.4, Math.min(1.4, nz)); }
  else if (nx > X1 + 0.3) nz = Math.max(-9, Math.min(9, nz));
  else nz = Math.max(-(S - 0.45), Math.min(S - 0.45, nz));
  for (const [cx, cz] of [[ABBA.x, ABBA.z], ...(townReady && !Q.on ? NPCS.map((n) => [n.x, n.z]) : [])]) { const dx = nx - cx, dz = nz - cz, d = Math.hypot(dx, dz); if (d < 0.75 && d > 0) { nx = cx + dx / d * 0.75; nz = cz + dz / d * 0.75; } }
  return [nx, nz];
}

/* ---------- interface ---------- */
let toastTimer = 0;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2600); }
function unlock(id) { if (state.unlocked.includes(id)) return; state.unlocked.push(id); saveGame(); const j = JOURNAL.find((p) => p.id === id); $('jcount').textContent = state.unlocked.length; $('jcount').hidden = false; toast('Journal: ' + j.title); }
let goalText = '', goalTimer = 0, hintTimer = 0;
function showGoal(withControls) { const el = $('goal'); el.textContent = goalText; el.classList.remove('folded'); el.setAttribute('aria-expanded', 'true'); clearTimeout(goalTimer);
  goalTimer = setTimeout(() => { el.textContent = 'Goal'; el.classList.add('folded'); el.setAttribute('aria-expanded', 'false'); }, 6500);
  if (withControls) showHint(); }
function showHint() { $('hint').hidden = false; clearTimeout(hintTimer); hintTimer = setTimeout(() => { $('hint').hidden = true; }, 6000); }
$('goal').onclick = () => showGoal(true);
function foundCount() { return FINDS.filter((f) => state.unlocked.includes(f.id)).length; }
function setGoal() {
  if (Q.on || state.place === 'ware') return;          // chapters set their own goals
  let g;
  if (!state.unlocked.includes('harbour')) g = 'Walk down the pier and into the town.';
  else if (!state.talked) g = 'Find the woman in the white head wrap. She keeps the tavern with the turtle sign.';
  else if (state.place === 'out' && !state.ate) g = 'Go into The Turtle. The door is right beside Abba.';
  else if (!state.ate) g = 'Abba is behind the counter. Ask her for some stew.';
  else if (foundCount() < FINDS.length) g = 'Look around the tavern. Things found: ' + foundCount() + ' of ' + FINDS.length + '.';
  else g = 'You have finished the first part. Open your journal for the next part of the story.';
  if (g !== goalText) { goalText = g; showGoal(); }
  if (state.ate && foundCount() === FINDS.length && !state.done) { state.done = true; setTimeout(() => toast('Well done! Your journal now has ' + state.unlocked.length + ' pages.'), 3800); }
}
let convo = TALK, convoEnd = null;
function showStep() {
  const s = convo[state.step]; $('who').textContent = s.who; $('line').textContent = s.text; const ch = $('choices'); ch.replaceChildren();
  if (s.choices) { $('next').hidden = true; for (const c of s.choices) { const o = typeof c === 'string' ? { t: c, ok: true } : c; const b = document.createElement('button'); b.className = 'btn ghost'; b.textContent = o.t;
      b.onclick = () => { if (o.ok) advance(); else { $('line').textContent = s.hint + ' ' + s.text.split('. ').pop(); b.disabled = true; } }; ch.appendChild(b); } ch.firstChild.focus(); }
  else { $('next').hidden = false; $('next').textContent = state.step === convo.length - 1 ? (convo === TALK ? 'Goodbye for now' : 'Thank you') : 'Next'; $('next').focus(); }
  if (s.unlock) unlock(s.unlock);
}
function advance() { state.step++; if (state.step >= convo.length) { $('dialogue').hidden = true; $('goal').hidden = false; busy = false; state.step = 0; const e = convoEnd; convoEnd = null; if (e) e(); setGoal(); canvas.focus(); return; } showStep(); }
function startConvo(c, end) { convo = c; convoEnd = end; busy = true; keys.clear(); $('talk').hidden = true; $('hint').hidden = true; $('goal').hidden = true; $('dialogue').hidden = false; state.step = 0; showStep(); }
$('next').onclick = advance;
/* things you can walk up to and use */
const ACTIONS = [
  ...['sugar', 'cocoa', 'logwood'].map((id, i) => ({ label: ['Look at the casks', 'Look at the sacks', 'Look at the red wood'][i], r: 2.6, where: () => state.place === 'ware' && !state.unlocked.includes(id) && WGOODS[id], go: () => { unlock(id); wareMark[id].visible = false; wareGoal(); } })),
  { label: 'Sit at the desk', r: 2.4, where: () => state.place === 'ware' && wareSeen() && !W.coins && [-258.6, 2.9], go: () => startConvo(COINS, () => { W.coins = true; abba.visible = true; ABBA.x = -250.2; ABBA.z = 0.4; abba.position.set(ABBA.x, 0, ABBA.z); toast('Abba has come in.'); wareGoal(); }) },
  { label: 'Talk to Abba', r: 3.0, where: () => state.place === 'ware' && W.coins && !W.talked && [ABBA.x, ABBA.z], go: () => startConvo(WARE1, () => { W.talked = true; wareGoal(); }) },
  { label: 'Read the letter', r: 2.4, where: () => state.place === 'ware' && W.talked && [-258.6, 2.9], go: readLetter },
  { label: 'Talk to Abba', r: 3.2, where: () => state.place === 'after' && [ABBA.x, ABBA.z], go: () => { if (afterDone() && Q.aTalk) startConvo(AFTER2, stayOrGo); else startConvo(AFTER1, () => { Q.aTalk = true; afterGoal(); }); } },
  { label: 'Look at the big tent', r: 3.6, where: () => state.place === 'after' && !state.unlocked.includes('tentp') && [-12.5, 0.8], go: () => { unlock('tentp'); afterGoal(); } },
  { label: 'Look across the water', r: 2.6, where: () => state.place === 'after' && !state.unlocked.includes('kingston') && [0.2, 0], go: () => { unlock('kingston'); afterGoal(); } },
  { label: 'Read the tombstone', r: 3.2, where: () => state.place === 'yard' && [YX + 6, YZ - 2], go: endStory },
  ...NPCS.map((n) => ({ label: n.label, r: 2.6, where: () => townReady && !Q.on && state.place === 'out' && people[n.id] && [n.x, n.z], go: () => startConvo(state.unlocked.includes(n.id) ? n.again : n.talk) })),
  { label: 'Talk to the minister', r: 2.6, where: () => state.place === 'after' && people.heath && people.heath.parent && [HEATH.x, HEATH.z], go: () => startConvo(state.unlocked.includes('heath') ? [{ who: 'Emmanuel Heath', text: 'God keep you, Mr Galdy.' }] : HEATH_TALK) },
  { label: 'Reach for the boat', r: 3.6, where: () => state.place === 'sea' && Q.boat && [Q.boat.position.x, Q.boat.position.z], go: () => finishQuake(false) },
  { label: 'Talk to her', r: 3.4, where: () => townReady && !Q.on && state.place === 'out' && [ABBA.x, ABBA.z], go: () => startConvo(state.talked ? AFTER : TALK, () => { state.talked = true; if (ring) ring.visible = false; }) },
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
  setGoal(); $('hint').textContent = isTouch ? 'Left thumb walks. Drag to look.' : 'W A S D to walk. Drag to look. E to use.'; showHint(); canvas.focus(); }
$('start').onclick = () => { startGame(); cue('begin'); };

/* ---------- saving: kept in this browser only ---------- */
const SAVE_KEY = 'portroyal-save-v1'; let hasSave = false, lastSave = 0;
function saveGame() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ unlocked: state.unlocked, talked: state.talked, ate: state.ate, done: state.done, ch: state.ch,
  pos: state.place === 'out' && !Q.on ? [state.x, state.z, state.yaw] : null })); } catch (e) { /* storage may be blocked; the game still plays */ } }
function loadGame() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; } }
function applySave(d) { if (!d || !Array.isArray(d.unlocked)) return; state.unlocked = d.unlocked.filter((id) => JOURNAL.some((p) => p.id === id)); state.talked = !!d.talked; state.ate = !!d.ate; state.done = !!d.done; state.ch = d.ch && typeof d.ch === 'object' ? d.ch : {};
  const p = d.pos; if (Array.isArray(p) && p.every(Number.isFinite) && p[0] > X0 - 1 && p[0] < SHORE + 24 && Math.abs(p[1]) < 9.5 && !(p[0] < X1 + 0.3 && Math.abs(p[1]) > S)) { state.x = p[0]; state.z = p[1]; state.yaw = p[2]; }
  hasSave = state.unlocked.length > 0; }
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && state.started) saveGame(); });

/* ---------- chapters ---------- */
function goArrive() { hideCard(); if (Q.on) { resetWorld(); Q.on = false; } setPlace('out'); state.x = 43; state.z = 0; state.yaw = Math.PI / 2; state.pitch = 0; goalText = ''; setGoal(); cue('begin'); }
const CHAPTERS = [
  { year: '1690', name: 'Arrival', go: goArrive, done: () => state.ate },
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
function playChapter(c) { $('chapters').hidden = true; busy = false; if (!state.started) startGame(); c.go(); }
$('chclose').onclick = closeChapters; $('tchap').onclick = openChapters; $('jchap').onclick = openChapters;
$('chteach').onclick = () => { state.ch.all = true; saveGame(); renderChapters(); };
$('chreset').onclick = () => { const b = $('chreset'); if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'Tap again to erase all progress'; return; } try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ } location.reload(); };

/* ---------- sound: made in the browser, no audio files ---------- */
const AU = { ctx: null, master: null, on: true, ch: {}, crack: null };
try { AU.on = localStorage.getItem('portroyal-sound') !== 'off'; } catch (e) { /* default on */ }
function noiseSrc(kind) { const c = AU.ctx, len = c.sampleRate * 3, b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0); let l = 0;
  for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; if (kind === 'brown') { l = (l + 0.02 * w) / 1.02; d[i] = l * 3.5; } else d[i] = w * 0.5; }
  const src = c.createBufferSource(); src.buffer = b; src.loop = true; src.start(); return src; }
function chan(kind, type, f, q) { const c = AU.ctx, fl = c.createBiquadFilter(), g = c.createGain(); fl.type = type; fl.frequency.value = f; if (q) fl.Q.value = q; g.gain.value = 0; noiseSrc(kind).connect(fl); fl.connect(g); g.connect(AU.master); g.f = fl; return g; }
function audioInit() { try { if (!AU.ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; AU.ctx = new AC(); AU.master = AU.ctx.createGain(); AU.master.gain.value = AU.on ? 0.8 : 0; AU.master.connect(AU.ctx.destination);
      AU.ch.sea = chan('brown', 'lowpass', 800); AU.ch.surf = chan('white', 'bandpass', 2200, 0.4); AU.ch.wind = chan('white', 'bandpass', 650, 0.6); AU.ch.crowd = chan('white', 'bandpass', 480, 2.2); AU.ch.room = chan('brown', 'lowpass', 160);
      const n = AU.ctx.sampleRate * 0.03, b = AU.ctx.createBuffer(1, n, AU.ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n); AU.crack = b; }
    AU.ctx.resume(); } catch (e) { AU.ctx = null; } }
function out(pan) { const c = AU.ctx, g = c.createGain(); if (c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.value = pan; g.connect(p); p.connect(AU.master); } else g.connect(AU.master); return g; }
function gullCry() { const c = AU.ctx, t0 = c.currentTime + 0.05, o = out(Math.random() * 1.6 - 0.8), bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 1.4; bp.connect(o); o.gain.value = 0.35 + Math.random() * 0.4;
  for (let i = 0, n = 2 + (Math.random() * 2 | 0); i < n; i++) { const s0 = t0 + i * 0.42, osc = c.createOscillator(), g = c.createGain(), vib = c.createOscillator(), vg = c.createGain(); osc.type = 'triangle';
    osc.frequency.setValueAtTime(1300, s0); osc.frequency.linearRampToValueAtTime(1750, s0 + 0.06); osc.frequency.exponentialRampToValueAtTime(950, s0 + 0.34); vib.frequency.value = 28; vg.gain.value = 45; vib.connect(vg); vg.connect(osc.frequency);
    g.gain.setValueAtTime(0.0001, s0); g.gain.exponentialRampToValueAtTime(0.16, s0 + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, s0 + 0.36); osc.connect(g); g.connect(bp); osc.start(s0); vib.start(s0); osc.stop(s0 + 0.4); vib.stop(s0 + 0.4); } }
function crackle() { const c = AU.ctx, s0 = c.currentTime, src = c.createBufferSource(), hp = c.createBiquadFilter(), g = out(0.3); src.buffer = AU.crack; src.playbackRate.value = 0.6 + Math.random(); hp.type = 'highpass'; hp.frequency.value = 1400; g.gain.value = 0.05 + Math.random() * 0.12; src.connect(hp); hp.connect(g); src.start(s0); }
function chirp() { const c = AU.ctx, t0 = c.currentTime + 0.02, o = out(Math.random() * 1.4 - 0.7); o.gain.value = 0.5;
  for (let i = 0; i < 3; i++) { const s0 = t0 + i * 0.13, osc = c.createOscillator(), g = c.createGain(); osc.frequency.setValueAtTime(2600, s0); osc.frequency.exponentialRampToValueAtTime(3700, s0 + 0.07); g.gain.setValueAtTime(0.0001, s0); g.gain.exponentialRampToValueAtTime(0.05, s0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, s0 + 0.08); osc.connect(g); g.connect(o); osc.start(s0); osc.stop(s0 + 0.1); } }
function cue(kind) { if (!AU.ctx) return; const c = AU.ctx, t0 = c.currentTime + 0.05, notes = { begin: [[293.66, 0], [369.99, 0.35], [440, 0.7], [587.33, 1.05]], sad: [[293.66, 0], [349.23, 0.5], [440, 1.0], [392, 1.6]], end: [[440, 0], [369.99, 0.6], [329.63, 1.2], [293.66, 1.8]] }[kind];
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400; lp.connect(AU.master);
  for (const [f, dt] of notes) for (const det of [0, 7]) { const o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = det; g.gain.setValueAtTime(0.0001, t0 + dt); g.gain.exponentialRampToValueAtTime(0.05, t0 + dt + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + 2.4); o.connect(g); g.connect(lp); o.start(t0 + dt); o.stop(t0 + dt + 2.5); } }
let auNext = 0, gullAt = 2, crackAt = 0, chirpAt = 0, murm = 0.6;
function setG(g, v, tc) { g.gain.setTargetAtTime(v, AU.ctx.currentTime, tc || 0.5); }
function audioTick(t) { if (!AU.ctx || !state.started || t < auNext) return; auNext = t + 0.1;
  const p = state.place, shaking = Q.on && ['tremor', 'main', 'swallow'].includes(Q.phase), swell = 0.72 + 0.28 * Math.sin(t * 0.55) + 0.1 * Math.sin(t * 1.7);
  let sea = 0, surf = 0, wind = 0, crowd = 0, room = 0, gulls = false, fire = false, birds = false;
  if (p === 'out') { const k = Math.max(0, Math.min(1, (state.x + 5) / (SHORE + 10))); sea = (0.15 + 0.55 * k) * swell; surf = 0.04 * k * swell; wind = Q.ruin ? 0.1 : 0.05; gulls = !Q.ruin && state.x > -2; }
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
  if (birds && t > chirpAt) { chirpAt = t + 3 + Math.random() * 6; chirp(); } }
function showSound() { const b = $('snd'); b.setAttribute('aria-pressed', AU.on ? 'true' : 'false'); b.setAttribute('aria-label', AU.on ? 'Sound on. Tap to turn off.' : 'Sound off. Tap to turn on.'); $('sndon').style.display = AU.on ? '' : 'none'; $('sndoff').style.display = AU.on ? 'none' : ''; }
$('snd').onclick = () => { AU.on = !AU.on; try { localStorage.setItem('portroyal-sound', AU.on ? 'on' : 'off'); } catch (e) { /* ignore */ } audioInit(); if (AU.master) AU.master.gain.setTargetAtTime(AU.on ? 0.8 : 0, AU.ctx.currentTime, 0.1); showSound(); };
showSound();
addEventListener('pointerdown', () => { if (AU.ctx && AU.ctx.state !== 'running') AU.ctx.resume(); });

/* ---------- 7 June 1692 ---------- */
let moveSpeed = 2.7, eyeY = 1.62, seaLevel = -0.35;
const Q = { on: false, phase: '', t: 0, shake: 0, ruin: false, boat: null, debris: [], T: 0, ac: null, gain: null };
const DUST = new THREE.Color(0xb9a888), ease = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
function card(title, paras, buttons) { busy = true; keys.clear(); $('ctitle').textContent = title; const b = $('cbody'); b.replaceChildren(); for (const p of paras) { const e = document.createElement('p'); e.textContent = p; b.appendChild(e); }
  const bt = $('cbtns'); bt.replaceChildren(); buttons.forEach((o, i) => { const e = document.createElement('button'); e.className = 'btn' + (i ? ' ghost' : ''); e.textContent = o.t; e.onclick = o.go; bt.appendChild(e); }); $('card').hidden = false; $('talk').hidden = true; bt.firstChild.focus(); }
function hideCard() { $('card').hidden = true; busy = false; canvas.focus(); }
function sinkTown(T, final) { for (const o of townObjs) { const q = final === undefined ? ease((T - o.delay) / o.dur) : final; o.m.position.y = -o.sink * q + (q > 0 && q < 1 ? Math.sin(T * 40 + o.delay * 9) * 0.03 : 0); o.m.rotation.set(o.tx * q, o.ry, o.tz * q); } }
function rumble() { audioInit(); if (!AU.ctx || Q.gain) return; const c = AU.ctx, len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0); let l = 0; for (let i = 0; i < len; i++) { l = (l + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3.5; }
  const src = c.createBufferSource(); src.buffer = buf; src.loop = true; const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 150; Q.gain = c.createGain(); Q.gain.gain.value = 0; src.connect(lp); lp.connect(Q.gain); Q.gain.connect(AU.master); src.start(); }
function setPhase(p) { Q.phase = p; Q.t = 0; }
function quakeIntro() { cue('sad'); if (!townReady || !tavernReady) { toast('The town is still loading.'); return; } closeJournal(); $('card').hidden = true; $('dialogue').hidden = true; $('goal').hidden = false;
  card('7 June 1692', ['Two years have passed. Lewis Galdy is now a merchant in Port Royal.', 'This part of the story shows the great earthquake. It is loud, and it can be scary.'], [{ t: 'Begin', go: beginQuake }, { t: 'Read what happened instead', go: () => finishQuake(true) }]); }
function beginQuake() { hideCard(); rumble(); if (state.place !== 'out') setPlace('out'); resetWorld(); Q.on = true; setPhase('calm'); state.place = 'out'; state.x = 1; state.z = 0.6; state.yaw = -Math.PI / 2; state.pitch = 0; if (ring) ring.visible = false;
  npcShow(false); goalText = 'It is a hot, still morning. Walk down to the harbour.'; showGoal(); toast('7 June 1692, late morning'); }
function resetWorld() { Q.ruin = false; Q.shake = 0; Q.T = 0; sinkTown(0, 0); seaLevel = -0.35; moveSpeed = 2.7; eyeY = 1.62; scene.fog.color.copy(HAZE); scene.fog.near = 70; scene.fog.far = 900; sky.material.color.set(0xffffff); $('vig').style.opacity = 0;
  const m = shipsM.merchant, sl = shipsM.sloop; m.position.set(SHORE + 17.5, -0.35, -5.9); m.rotation.set(0, 0, 0); sl.position.set(SHORE + 17.5, -0.35, 4.9); sl.rotation.set(0, Math.PI, 0);
  if (afterG) afterG.visible = false; if (yardG) yardG.visible = false; for (const p of streetProps) p.visible = true; npcShow(true); for (const o of townObjs) o.m.visible = true; shipsM.merchant.visible = shipsM.sloop.visible = true; Q.aTalk = false;
  if (Q.boat) Q.boat.visible = false; for (const d of Q.debris) d.visible = false; ABBA.x = -5.25; ABBA.z = -S + 1.05; abba.position.set(ABBA.x, 0.12, ABBA.z); abba.visible = true; if (Q.gain) Q.gain.gain.value = 0; }
function buildSeaProps() { if (Q.boat) return; const wood = new THREE.MeshStandardMaterial({ map: plankTex([96, 80, 62], 6, 3, 1), roughness: 0.9, side: THREE.DoubleSide }), tim = new THREE.MeshStandardMaterial({ map: plankTex([110, 86, 60], 3, 1, 1), roughness: 0.9 });
  const L = 5.2, Bm = 1.7, sh = new THREE.Shape(); sh.moveTo(-L / 2, -Bm * 0.36); sh.quadraticCurveTo(0, -Bm * 0.56, L * 0.3, -Bm * 0.4); sh.quadraticCurveTo(L * 0.45, -Bm * 0.2, L / 2, 0); sh.quadraticCurveTo(L * 0.45, Bm * 0.2, L * 0.3, Bm * 0.4); sh.quadraticCurveTo(0, Bm * 0.56, -L / 2, Bm * 0.36); sh.closePath();
  const hg = new THREE.ExtrudeGeometry(sh, { depth: 0.7, bevelEnabled: false, curveSegments: 8 }); hg.rotateX(-Math.PI / 2); const p = hg.attributes.position; for (let i = 0; i < p.count; i++) if (p.getY(i) < 0.3) { p.setZ(i, p.getZ(i) * 0.45); p.setX(i, p.getX(i) * 0.9); } hg.computeVertexNormals();
  const b = new THREE.Group(); scene.add(b); mk(hg, wood, 0, -0.3, 0, b); mk(new THREE.BoxGeometry(L * 0.86, 0.03, Bm * 0.78), tim, -0.1, 0.02, 0, b); for (const x of [-1.5, 1.2]) mk(new THREE.BoxGeometry(0.24, 0.04, Bm * 0.86), tim, x, 0.2, 0, b);
  const mark = mk(new THREE.OctahedronGeometry(0.28), new THREE.MeshBasicMaterial({ color: 0xd9a441 }), 0, 3.3, 0, b); b.userData.mark = mark; Q.boat = b;
  for (let i = 0; i < 12; i++) { const k = i % 3, d = mk(k === 0 ? new THREE.CylinderGeometry(0.3, 0.3, 0.9, 10) : k === 1 ? new THREE.BoxGeometry(0.7, 0.6, 0.7) : new THREE.BoxGeometry(2.6, 0.12, 0.3), tim, SHORE + 8 + ((i * 37) % 50), 0, 12 + ((i * 53) % 55)); if (k === 0) d.rotation.z = Math.PI / 2; d.rotation.y = i * 1.3; d.userData.ph = i * 1.7; Q.debris.push(d); } }
function toSea() { hideCard(); buildSeaProps(); Q.ruin = true; sinkTown(0, 1); seaLevel = 0.2; moveSpeed = 1.5; $('vig').style.opacity = 0; scene.fog.color.copy(DUST); scene.fog.near = 25; scene.fog.far = 320; sky.material.color.set(0xd9cdb4);
  const m = shipsM.merchant, sl = shipsM.sloop; m.position.set(SHORE + 19, -1.2, -7); m.rotation.set(0.42, 0.15, 0.05); sl.position.set(SHORE - 6, 0.5, 13); sl.rotation.set(-0.5, 2.2, 0.08);                 // one ship heeled over, one driven up into the town
  state.place = 'sea'; state.x = SHORE + 12; state.z = 22; Q.boat.position.set(SHORE + 30, seaLevel, 46); Q.boat.rotation.y = 0.6; Q.boat.visible = true; for (const d of Q.debris) d.visible = true;
  state.yaw = Math.atan2(-(Q.boat.position.x - state.x), -(Q.boat.position.z - state.z)); state.pitch = 0; ABBA.x = Q.boat.position.x; ABBA.z = Q.boat.position.z; abba.visible = true; setPhase('sea');
  goalText = 'Swim to the boat with the gold marker.'; showGoal(); toast('A second shock throws you into the sea.'); }
function finishQuake(skipped) { for (const id of ['quake', 'sand', 'watch', 'tomb']) unlock(id); Q.shake = 0; if (Q.gain) Q.gain.gain.value = 0; Q.phase = 'end';
  card(skipped ? 'What happened' : 'Saved', skipped ? ['Just before noon, an earthquake shook Port Royal. The wet sand under the town turned to liquid, and most of the town sank into the sea.', 'Lewis Galdy was swallowed by the ground, thrown out into the sea by a second shock, and saved by a boat.', 'Four new pages are in your journal.']
    : ['Hands pull you over the side of the boat. You are alive.', 'Behind you, most of Port Royal is under the sea.', 'Four new pages are in your journal.'],
    [{ t: 'Go on: the days after', go: beginAfter }, { t: 'Play the earthquake again', go: beginQuake }, { t: 'Go back to 1690', go: leaveQuake }]); }
function leaveQuake() { hideCard(); resetWorld(); Q.on = false; state.place = 'out'; state.x = 17; state.z = 0.4; state.yaw = Math.PI / 2; state.pitch = 0; setGoal(); goalText = ''; setGoal(); }
function quakeTick(dt, time) { Q.t += dt; const t = Q.t;
  if (Q.phase === 'calm') { if (t > 9 || state.x > 9) { setPhase('tremor'); toast('Abba: \u201cDid you feel that?\u201d'); } }
  else if (Q.phase === 'tremor') { Q.shake = t < 2.6 ? 0.22 * Math.sin(t / 2.6 * Math.PI) : 0; if (t > 4.6) { setPhase('main'); goalText = 'Run! Get away from the houses!'; showGoal(); } }
  else if (Q.phase === 'main') { Q.shake = Math.min(1, t / 1.5); Q.T = t; sinkTown(t); const k = ease(t / 5); scene.fog.color.copy(HAZE).lerp(DUST, k); scene.fog.near = 70 - 62 * k; scene.fog.far = 900 - 830 * k; sky.material.color.set(0xffffff).lerp(DUST, k * 0.8);
    if (t > 2.5 && abba.visible) { abba.visible = false; toast('Abba: \u201cRun! To the boats!\u201d'); } if (t > 8.5) { setPhase('swallow'); goalText = 'The sand is pulling you down!'; showGoal(); } }
  else if (Q.phase === 'swallow') { Q.shake = 1; Q.T += dt; sinkTown(Q.T); const k = ease(t / 3.6); eyeY = 1.62 - 1.25 * k; moveSpeed = 2.7 * (1 - 0.9 * k); $('vig').style.opacity = k;
    if (t > 4 && $('card').hidden) { Q.shake = 0.3; card('Swallowed', ['The wet sand has turned to liquid. It closes around you, up to your neck.', 'You cannot move. Then the ground shakes again.'], [{ t: 'Next', go: toSea }]); } }
  else if (Q.phase === 'sea') { Q.shake = t < 1.5 ? 0.6 * (1 - t / 1.5) : (Math.sin(time * 0.5) > 0.96 ? 0.25 : 0); eyeY = seaLevel + 0.32 + Math.sin(time * 1.6) * 0.07;
    const b = Q.boat; b.position.y = seaLevel + 0.12 + Math.sin(time * 1.2) * 0.06; b.rotation.z = Math.sin(time * 0.9) * 0.05; b.userData.mark.rotation.y = time * 1.5; abba.position.set(b.position.x - 0.3, b.position.y + 0.05, b.position.z);
    for (const d of Q.debris) { d.position.y = seaLevel + Math.sin(time * 1.1 + d.userData.ph) * 0.07; d.rotation.x = Math.sin(time * 0.7 + d.userData.ph) * 0.12; }
    if (Math.hypot(state.x - b.position.x, state.z - b.position.z) < 2.3 && $('card').hidden) finishQuake(false); }
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
  for (const [x, z, ry, id] of SURV) { if (!people[id]) continue; const m = skClone(people[id]); m.traverse((o) => { if (o.isMesh) { o.material = o.material.clone(); o.material.color.setRGB(0.78, 0.74, 0.68); } }); m.position.set(x, 0, z); m.rotation.y = ry; afterG.add(m); animate(m); }
  cur = scene; }
function placeHeath() { const m = people.heath; if (!m || !afterG || m.parent) return; m.position.set(HEATH.x, 0, HEATH.z); m.rotation.y = HEATH.ry; afterG.add(m); animate(m); }
function afterDone() { return state.unlocked.includes('tentp') && state.unlocked.includes('kingston'); }
function afterGoal() { goalText = !Q.aTalk ? 'Find Abba in the camp.' : afterDone() ? 'Go back to Abba.' : 'Look around: the big tent, and the edge of the water.'; showGoal(); }
function beginAfter() { cue('sad'); hideCard(); buildAfter(); buildSeaProps(); if (state.place !== 'out') setPlace('out'); resetWorld(); Q.on = true; Q.phase = 'after'; Q.ruin = true; sinkTown(0, 1); afterG.visible = true;
  const m = shipsM.merchant, sl = shipsM.sloop; m.position.set(SHORE + 19, -1.2, -7); m.rotation.set(0.42, 0.15, 0.05); sl.position.set(SHORE - 6, 0.5, 13); sl.rotation.set(-0.5, 2.2, 0.08);
  scene.fog.color.copy(DUST); scene.fog.near = 35; scene.fog.far = 420; sky.material.color.set(0xe2d8c2);
  state.place = 'after'; state.x = -1.6; state.z = 0; state.yaw = Math.PI / 2; state.pitch = 0; ABBA.x = -8.9; ABBA.z = 0.7; for (const p of streetProps) p.visible = false; abba.position.set(ABBA.x, 0, ABBA.z); abba.visible = true; if (ring) ring.visible = false;
  npcShow(false); afterGoal(); toast('Three days later'); }
function stayOrGo() { card('Stay, or go?', ['The town you knew is under the sea. Across the harbour, people are starting again.', 'What will you do?'],
  [{ t: 'Stay and build again', go: () => card('He stayed', ['The real Lewis Galdy stayed in Port Royal. He traded, grew rich, and helped to build a new church.'], [{ t: 'Go to the church', go: toYard }]) },
   { t: 'Cross the harbour', go: () => card('Most people left', ['Most survivors crossed the harbour, and their new town became Kingston.', 'But the real Lewis Galdy stayed in Port Royal. He traded, grew rich, and helped to build a new church.'], [{ t: 'Go to the church', go: toYard }]) }]); }
function buildYard() { if (yardG) return; yardG = new THREE.Group(); scene.add(yardG); cur = yardG;
  const stone = new THREE.MeshStandardMaterial({ map: noiseTex([176, 172, 160], 26, 2), roughness: 0.9 }), roofM = new THREE.MeshStandardMaterial({ map: noiseTex([96, 84, 74], 30, 6), roughness: 0.95 }), dark = new THREE.MeshStandardMaterial({ color: 0x1b1a18, roughness: 0.9 }), tim = new THREE.MeshStandardMaterial({ map: plankTex([84, 62, 44], 4, 1, 1), roughness: 0.9 });
  const gr = mk(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ map: noiseTex([126, 138, 92], 36, 10), roughness: 1 }), YX, 0.02, YZ - 4); gr.rotation.x = -Math.PI / 2;
  const wall = brickM(16, 2.4); for (const [x, z, w, d] of [[YX, YZ - 19, 30, 0.5], [YX, YZ + 11, 30, 0.5], [YX - 15, YZ - 4, 0.5, 30], [YX + 15, YZ - 4, 0.5, 30]]) { mk(new THREE.BoxGeometry(w, 2.6, d), wall, x, 1.3, z); mk(new THREE.BoxGeometry(w + 0.2, 0.14, d + 0.2), stone, x, 2.67, z); }
  const cx = YX - 4, cz = YZ - 6, nw = 8, nl = 15, nh = 6; mk(new THREE.BoxGeometry(nw, nh, nl), brickM(8, 5.5), cx, nh / 2, cz);
  const a = Math.atan2(3.2, nw / 2), sl = Math.hypot(nw / 2, 3.2) + 0.4; for (const s of [-1, 1]) { const r = mk(new THREE.BoxGeometry(sl, 0.14, nl + 0.6), roofM, cx + s * (nw / 4 + 0.1), nh + 1.55, cz); r.rotation.z = -s * a; }
  for (const s of [-1, 1]) { const sh = new THREE.Shape(); sh.moveTo(-nw / 2, 0); sh.lineTo(0, 3.2); sh.lineTo(nw / 2, 0); sh.closePath(); const gm = mk(new THREE.ShapeGeometry(sh), brickM(0.25, 0.3), cx, nh, cz + s * nl / 2); gm.material.side = THREE.DoubleSide; }
  for (const z of [-4.5, 0, 4.5]) { for (const s of [-1, 1]) { mk(new THREE.BoxGeometry(0.1, 2.8, 1.2), dark, cx + s * (nw / 2 + 0.01), 3.2, cz + z); mk(new THREE.CylinderGeometry(0.6, 0.6, 0.1, 12, 1, false, 0, Math.PI), dark, cx + s * (nw / 2 + 0.01), 4.6, cz + z).rotation.set(0, 0, Math.PI / 2 * s + (s > 0 ? 0 : Math.PI)); } }
  const tw = 4.6, tz = cz + nl / 2 + tw / 2 - 0.3; mk(new THREE.BoxGeometry(tw, 11, tw), brickM(4.5, 10), cx, 5.5, tz); mk(new THREE.BoxGeometry(tw + 0.4, 0.3, tw + 0.4), stone, cx, 11.1, tz); for (const sx of [-1, 1]) for (const sz of [-1, 1]) mk(new THREE.BoxGeometry(0.5, 0.9, 0.5), stone, cx + sx * (tw / 2 - 0.1), 11.7, tz + sz * (tw / 2 - 0.1));
  mk(new THREE.BoxGeometry(1.6, 2.6, 0.12), tim, cx, 1.3, tz + tw / 2 + 0.02); mk(new THREE.BoxGeometry(1.2, 1.6, 0.1), dark, cx, 7.5, tz + tw / 2 + 0.02);
  const tx = YX + 6, tzz = YZ - 2; mk(new THREE.BoxGeometry(1.2, 0.2, 2.5), stone, tx, 0.1, tzz); mk(new THREE.BoxGeometry(1.0, 0.7, 2.3), brickM(2.3, 0.7), tx, 0.55, tzz);
  const ins = cv(128, 256, (x) => { x.fillStyle = '#b9b6aa'; x.fillRect(0, 0, 128, 256); x.strokeStyle = '#6f6c62'; x.lineWidth = 2; x.beginPath(); x.arc(64, 44, 22, 0, 7); x.stroke(); x.strokeRect(46, 30, 36, 30); x.lineWidth = 1.5; for (let i = 0; i < 17; i++) { x.beginPath(); x.moveTo(16 + (i % 3) * 3, 84 + i * 9.5); x.lineTo(112 - (i % 4) * 5, 84 + i * 9.5); x.stroke(); } }); ins.wrapS = ins.wrapT = THREE.ClampToEdgeWrapping;
  const slab = mk(new THREE.BoxGeometry(1.25, 0.12, 2.55), [stone, stone, new THREE.MeshStandardMaterial({ map: ins, roughness: 0.85 }), stone, stone, stone], tx, 0.96, tzz);
  const rg = mk(new THREE.RingGeometry(1.75, 1.9, 40), new THREE.MeshBasicMaterial({ color: 0xd9a441, side: THREE.DoubleSide }), tx, 0.05, tzz); rg.rotation.x = -Math.PI / 2;
  for (const [x, z] of [[YX + 3, YZ - 9], [YX + 9.5, YZ - 7], [YX + 1.5, YZ + 3]]) { mk(new THREE.BoxGeometry(0.7, 1.0, 0.14), stone, x, 0.5, z).rotation.z = 0.06; }
  const leaf = new THREE.MeshStandardMaterial({ color: 0x4f7a3c, roughness: 0.9, side: THREE.DoubleSide }), trunk = new THREE.MeshStandardMaterial({ map: noiseTex([120, 100, 78], 30, 2), roughness: 1 });
  for (const [x, z, h] of [[YX + 11, YZ - 13, 7], [YX + 12, YZ + 6, 6], [YX - 12, YZ + 7, 7.5]]) { const t = mk(new THREE.CylinderGeometry(0.16, 0.24, h, 8), trunk, x, h / 2, z); t.rotation.z = 0.06; for (let i = 0; i < 9; i++) { const f = mk(new THREE.PlaneGeometry(0.7, 3.4), leaf, x + 0.3, h, z); f.geometry.translate(0, 1.7, 0); f.rotation.set(1.15 + (i % 3) * 0.18, i * 0.7, 0, 'YXZ'); } }
  cur = scene; }
function toYard() { hideCard(); if (state.place !== 'out') setPlace('out'); state.ch.after = true; saveGame(); buildYard(); resetWorld(); Q.on = true; Q.phase = 'yard'; for (const o of townObjs) o.m.visible = false; shipsM.merchant.visible = shipsM.sloop.visible = false; abba.visible = false; npcShow(false); yardG.visible = true;
  state.place = 'yard'; state.x = YX + 11; state.z = YZ + 3.5; state.yaw = 0.95; state.pitch = 0.06; ABBA.x = 9999; goalText = 'Find the tomb beside the church.'; showGoal(); toast('St Peter\u2019s Church, Port Royal'); }
function endStory() { cue('end'); unlock('fortune'); unlock('stone'); card('The end of the story', ['Lewis Galdy lived for 47 more years. His tombstone tells of his escape, and says that everyone loved him.', 'It does not say what he sold to grow rich. Abba would have told it another way.', 'Two new pages are in your journal.'],
  [{ t: 'Read the journal', go: () => { hideCard(); openJournal(); } }, { t: 'Go back to 1690', go: leaveQuake }]); }
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
  const out = mk(new THREE.PlaneGeometry(4, 6), new THREE.MeshBasicMaterial({ map: plankTex([150, 132, 106], 6, 4, 2) }), WX1 + 2, 0.005, 0.8); out.rotation.x = -Math.PI / 2;
  const view = cv(768, 512, (x, w, h) => { let g = x.createLinearGradient(0, 0, 0, h * 0.55); g.addColorStop(0, '#7fb3dc'); g.addColorStop(1, '#d9e7ee'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = '#9db7b2'; x.beginPath(); x.moveTo(0, h * 0.5); for (let i = 0; i <= 24; i++) x.lineTo(i * w / 24, h * (0.42 + 0.06 * Math.sin(i * 0.9) + 0.03 * Math.sin(i * 2.3))); x.lineTo(w, h * 0.56); x.lineTo(0, h * 0.56); x.fill();
    g = x.createLinearGradient(0, h * 0.55, 0, h); g.addColorStop(0, '#2c94a4'); g.addColorStop(1, '#1d6f7e'); x.fillStyle = g; x.fillRect(0, h * 0.55, w, h * 0.45);
    x.strokeStyle = 'rgba(255,255,255,0.25)'; x.lineWidth = 2; for (let i = 0; i < 40; i++) { const yy = h * 0.58 + Math.random() * h * 0.38, xx = Math.random() * w; x.beginPath(); x.moveTo(xx, yy); x.lineTo(xx + 20 + Math.random() * 30, yy); x.stroke(); }
    x.fillStyle = '#4b3423'; x.beginPath(); x.moveTo(w * 0.2, h * 0.6); x.lineTo(w * 0.82, h * 0.6); x.quadraticCurveTo(w * 0.86, h * 0.66, w * 0.78, h * 0.73); x.lineTo(w * 0.27, h * 0.73); x.quadraticCurveTo(w * 0.19, h * 0.68, w * 0.2, h * 0.6); x.fill();
    x.fillStyle = '#c99a4a'; x.fillRect(w * 0.2, h * 0.6, w * 0.62, h * 0.018); x.fillStyle = '#1e1712'; x.fillRect(w * 0.24, h * 0.66, w * 0.54, h * 0.012);
    x.strokeStyle = '#3b2a1c'; x.lineWidth = 6; for (const mx of [0.35, 0.52, 0.68]) { x.beginPath(); x.moveTo(w * mx, h * 0.6); x.lineTo(w * mx, h * 0.08); x.stroke(); } x.lineWidth = 4; for (const [mx, yy, ww] of [[0.35, 0.3, 0.14], [0.52, 0.22, 0.17], [0.52, 0.4, 0.2], [0.68, 0.32, 0.14]]) { x.beginPath(); x.moveTo(w * (mx - ww / 2), h * yy); x.lineTo(w * (mx + ww / 2), h * yy); x.stroke(); }
    x.strokeStyle = 'rgba(40,30,20,0.6)'; x.lineWidth = 1; for (const mx of [0.35, 0.52, 0.68]) for (const d of [-0.07, 0.07]) { x.beginPath(); x.moveTo(w * mx, h * 0.12); x.lineTo(w * (mx + d), h * 0.6); x.stroke(); }
    x.fillStyle = '#8a6c4c'; x.fillRect(0, h * 0.8, w, h * 0.2); x.fillStyle = '#5c4632'; for (let i = 0; i < 9; i++) x.fillRect(i * w / 8, h * 0.8, 8, h * 0.2); x.fillStyle = '#6b513a'; x.fillRect(0, h * 0.8, w, 6); });
  view.wrapS = view.wrapT = THREE.ClampToEdgeWrapping; mk(new THREE.PlaneGeometry(9, 6), new THREE.MeshBasicMaterial({ map: view, fog: false }), WX1 + 4, 2.4, 0.8).rotation.y = -Math.PI / 2;
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
  card('1691', ['A year has passed. Lewis Galdy now has a warehouse of his own, close to the wharf.', 'Ships bring goods in. He sells them on. This is how a merchant gets rich.'], [{ t: 'Begin', go: beginWare }, { t: 'Not now', go: hideCard }]); }
function beginWare() { hideCard(); if (Q.on) { resetWorld(); Q.on = false; } buildWare(); W.coins = W.talked = false; setPlace('ware'); state.x = -249.0; state.z = -0.4; state.yaw = Math.PI / 2 - 0.12; state.pitch = 0; wareGoal(); }
function readLetter() { card('The letter', ['\u201cMr Galdy. Spanish buyers will pay well for enslaved people from Jamaica. Put your money in with mine, and we will both be rich.\u201d', 'It is signed by the captain of a ship in the harbour.'],
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
    if (keys.has('arrowleft')) state.yaw += 1.9 * dt; if (keys.has('arrowright')) state.yaw -= 1.9 * dt;
    f -= stick.y; r += stick.x; const l = Math.hypot(f, r); if (l > 1) { f /= l; r /= l; }
    const sp = moveSpeed * dt, sy = Math.sin(state.yaw), cy = Math.cos(state.yaw);
    const [nx, nz] = clampPos(state.x + (-sy * f + cy * r) * sp, state.z + (-cy * f - sy * r) * sp);
    if (l > 0.05 && !reduceMotion) bob += dt * 8.5 * Math.min(1, l); state.x = nx; state.z = nz;
  } else if (!state.started) { state.yaw = Math.PI / 2 - 0.12 + Math.sin(now / 5200) * 0.14; }
  if (Q.on) quakeTick(dt, now / 1000); const sh = Q.shake * (reduceMotion ? 0.15 : 1), tt = now / 1000;
  camera.position.set(state.x + Math.sin(tt * 31) * 0.06 * sh, eyeY + (reduceMotion ? 0 : Math.sin(bob) * 0.035) + Math.sin(tt * 37) * 0.05 * sh, state.z + Math.sin(tt * 27) * 0.05 * sh); camera.rotation.set(state.pitch + Math.sin(tt * 29) * 0.015 * sh, state.yaw, Math.sin(tt * 23) * 0.03 * sh);
  for (const [b, q] of animQ) b.quaternion.copy(q);            // put back the animation's own pose before adding ours
  if (seaN && state.place !== 'in' && state.place !== 'ware') { const t = now / 1000; seaN.offset.x = t * 0.02; seaN.offset.y = t * 0.013;
    const p = waves.geometry.attributes.position, b = waves.userData.base; for (let i = 0; i < p.count; i++) { const x = b[i * 3], z = b[i * 3 + 2]; p.setY(i, Math.sin(x * 0.42 + t * 1.3) * 0.07 + Math.sin(z * 0.31 + t * 0.9) * 0.06 + Math.sin((x + z) * 0.9 + t * 2.1) * 0.025); } p.needsUpdate = true; if ((frameN++ & 3) === 0) waves.geometry.computeVertexNormals();
    waves.position.y = seaLevel; const m = Q.ruin ? null : shipsM.merchant, sl = Q.ruin ? null : shipsM.sloop; if (m) { m.position.y = -0.35 + Math.sin(t * 0.8) * 0.05; m.rotation.x = Math.sin(t * 0.6) * 0.012; m.rotation.z = Math.sin(t * 0.45) * 0.004; } if (sl) { sl.position.y = -0.35 + Math.sin(t * 1.0 + 1) * 0.07; sl.rotation.x = Math.sin(t * 0.75 + 2) * 0.025; }
    for (const f of flagsM) { for (let i = 0; i < f.p.count; i++) { const d = f.uv.getX(i); /* 0 at the staff, 1 at the free end, so the hoist edge never leaves the pole */ f.p.setZ(i, f.base[i * 3 + 2] + (Math.sin(d * 5.5 - t * 5.2) * 0.2 + Math.sin(d * 11 - t * 8.3) * 0.05) * d); f.p.setY(i, f.base[i * 3 + 1] + Math.sin(d * 4 - t * 3.1) * 0.05 * d); } f.p.needsUpdate = true; } }
  audioTick(now / 1000); if (state.started && now - lastSave > 5000) { lastSave = now; saveGame(); }
  if (mixer) mixer.update(dt); for (const mx of mixers) mx.update(dt);
  if (built) for (const n of NPCS) { const m = people[n.id]; if (!m || !m.visible) continue; const dx = state.x - n.x, dz = state.z - n.z; let w = n.ry; if (Math.hypot(dx, dz) < 6) { let d = Math.atan2(dx, dz) - n.ry; d = Math.atan2(Math.sin(d), Math.cos(d)); w = n.ry + Math.max(-1.3, Math.min(1.3, d)); } m.rotation.y += (w - m.rotation.y) * Math.min(1, dt * 2.5); }
  if (built && abba) {                       // extra life on top of the idle: breathing, a slow sway, and her head following you
    const t = now / 1000, sp = abba.getObjectByName('mixamorigSpine'), s2 = abba.getObjectByName('mixamorigSpine2'), hd = abba.getObjectByName('mixamorigHead'), nk = abba.getObjectByName('mixamorigNeck');
    for (const b of [sp, s2, nk, hd]) if (b) { if (!animQ.has(b)) animQ.set(b, new THREE.Quaternion()); animQ.get(b).copy(b.quaternion); }
    const add = (b, x, y, z) => { if (b) b.quaternion.multiply(_q.setFromEuler(_e.set(x, y, z))); };
    add(sp, 0, Math.sin(t * 0.35) * 0.05, Math.sin(t * 0.5) * 0.03); add(s2, Math.sin(t * 1.5) * 0.01, 0, 0);
    const dxh = state.x - ABBA.x, dzh = state.z - ABBA.z, near = Math.hypot(dxh, dzh) < 4.5 || !$('dialogue').hidden;
    faceAmt += ((near ? 1 : 0) - faceAmt) * Math.min(1, dt * 3);                 // near you she stops looking around and faces you
    if (!restQ && nk && hd) { let sk = null; abba.traverse((o) => { if (!sk && o.isSkinnedMesh) sk = o.skeleton; }); if (sk) { restQ = {}; const W = (b) => new THREE.Matrix4().copy(sk.boneInverses[sk.bones.indexOf(b)]).invert();
        for (const b of [nk, hd]) { const m = new THREE.Matrix4().copy(W(b.parent)).invert().multiply(W(b)); restQ[b.name] = new THREE.Quaternion().setFromRotationMatrix(m); } } }
    if (restQ) { nk.quaternion.slerp(restQ[nk.name], faceAmt * 0.5); hd.quaternion.slerp(restQ[hd.name], faceAmt * 0.5); }
    let yaw = Math.atan2(dxh, dzh) - abba.rotation.y; yaw = Math.max(-0.7, Math.min(0.7, Math.atan2(Math.sin(yaw), Math.cos(yaw)))) * faceAmt;
    headYaw += (yaw - headYaw) * Math.min(1, dt * 4); add(nk, 0, headYaw * 0.4, 0); add(hd, Math.sin(t * 0.9) * 0.02, headYaw * 0.6, 0);
  }
  if (built) {
    const dx = state.x - ABBA.x, dz = state.z - ABBA.z, d = Math.hypot(dx, dz);
    const want = d < 9 ? Math.max(-1.1, Math.min(1.1, Math.atan2(dx, dz))) : (state.place === 'in' ? 0 : 0.25); abba.rotation.y += (want - abba.rotation.y) * Math.min(1, dt * 3);
    if (ring && ring.visible) { const s = 1 + (reduceMotion ? 0 : Math.sin(now / 420) * 0.08); ring.scale.set(s, s, s); }
    if (state.started) { current = null; let best = 1e9; if (!busy) for (const a of ACTIONS) { const w = a.where(); if (!w) continue; const dd = Math.hypot(state.x - w[0], state.z - w[1]); if (dd < a.r && dd < best) { best = dd; current = a; } }
      $('talk').hidden = !current; if (current && $('talk').textContent !== current.label) $('talk').textContent = current.label;
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
  for (const k of ['merchant', 'sloop']) { shipsM[k] = prep(window.__got[k].scene); shipsM[k].traverse((o) => { if (o.isMesh && o.material.name === 'Flag') { const p = o.geometry.attributes.position; flagsM.push({ p, base: p.array.slice(), uv: o.geometry.attributes.uv }); } }); }
  buildHarbour(); $('start').disabled = false; $('start').textContent = hasSave ? 'Continue' : 'Step ashore'; $('savenote').hidden = !hasSave; $('loadnote').hidden = true; document.querySelector('.track').hidden = true;
  // stage 2: the town streams in while you walk the pier
  await stage(['tex_town', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'abba', 'kofi', 'sailor', 'benning']);
  await decodeTex(); for (const k in window.__tex) window.__tex[k] = '';
  for (const k of Object.keys(WID)) models[k] = prep(window.__got[k].scene);
  const g = window.__got.abba; abba = prep(g.scene); if (g.animations.length) { mixer = new THREE.AnimationMixer(abba); idle = mixer.clipAction(g.animations[0]); idle.play();
    peopleClip = g.animations[0].clone(); peopleClip.tracks = peopleClip.tracks.filter((t) => t.name.endsWith('.quaternion')); }   // other bodies keep their own proportions
  for (const n of NPCS) { const m = prep(window.__got[n.id].scene); m.position.set(n.x, 0, n.z); m.rotation.y = n.ry; scene.add(m); people[n.id] = m; animate(m); }
  buildTown(); if (ring) ring.visible = !state.talked; window.__got = null; townReady = true; built = true;
  // stage 3: the tavern is built in a spare moment, before you can reach its door
  setTimeout(() => { buildTavern(); for (const f of FINDS) if (state.unlocked.includes(f.id)) finds[f.id].visible = false; if (state.ate) stew.visible = true; tavernReady = true; $('tchap').hidden = false; model('heath').then((g) => { people.heath = prep(g.scene); placeHeath(); }).catch(() => {}); if (!$('chapters').hidden) renderChapters(); const q = new URLSearchParams(location.search);
  if (q.has('shot')) { $('start').click(); if (q.get('shot') === 'talk') { state.x = -3.6; state.z = -1.4; state.yaw = 0.62; state.pitch = -0.02; setTimeout(() => $('talk').click(), 300); } if (q.get('shot') === 'quake1') { beginQuake(); setPhase('main'); Q.t = 6.5; state.x = 6; state.yaw = Math.PI / 2 + 0.3; } if (q.get('shot') === 'quake2') { beginQuake(); toSea(); state.yaw += 0.0; } if (q.get('shot') === 'quake3') { beginQuake(); toSea(); state.x = SHORE + 14; state.z = 20; state.yaw = Math.PI / 2 + 0.35; state.pitch = 0.1; } if (q.get('shot') === 'after') { beginAfter(); state.x = -2; state.z = -1; state.yaw = Math.PI / 2 - 0.1; } if (q.get('shot') === 'after2') { beginAfter(); state.x = -12; state.z = -1; state.yaw = -Math.PI / 2 - 0.15; } if (q.get('shot') === 'yard') { toYard(); } if (q.get('shot') === 'ware') { beginWare(); } if (q.get('shot') === 'door') { beginWare(); state.x = -253; state.z = 0.6; state.yaw = -Math.PI / 2; state.pitch = 0; } if (q.get('shot') === 'ware2') { beginWare(); state.x = -256.6; state.z = 0.2; state.yaw = 0.62 + Math.PI * 0; state.yaw = Math.atan2(-(-258.6 - state.x), -(2.9 - state.z)); state.pitch = -0.25; } if (q.get('shot') === 'chapters') { openChapters(); } if (q.get('shot') === 'npc1') { state.x = 23.6; state.z = 0.6; state.yaw = Math.atan2(-(21.7 - 23.6), -(2.35 - 0.6)); } if (q.get('shot') === 'npc2') { state.x = 37.2; state.z = 0.2; state.yaw = Math.PI / 2 - 0.25; } if (q.get('shot') === 'npc3') { state.x = 8.6; state.z = 0.9; state.yaw = Math.PI; state.pitch = 0.05; } if (q.get('shot') === 'npc4') { beginAfter(); state.x = -7.4; state.z = 3.2; state.yaw = Math.atan2(-(-9.65 + 7.4), -(1.75 - 3.2)); } if (q.get('shot') === 'street') { state.x = 17; state.z = 0.4; } if (q.get('shot') === 'ships') { state.x = SHORE + 1; state.z = 0.9; state.yaw = -Math.PI / 2 + 0.25; state.pitch = 0.22; } if (q.get('shot') === 'beach') { state.x = SHORE - 6; state.z = 1; state.yaw = -Math.PI / 2 - 0.9; state.pitch = -0.05; } if (q.get('shot') === 'beach2') { state.x = SHORE - 7; state.z = -2; state.yaw = -Math.PI / 2 + 0.8; state.pitch = 0.05; } if (q.get('shot') === 'in' || q.get('shot') === 'stew') { state.talked = true; state.unlocked.push('harbour'); setPlace('in'); state.x = -199.6; state.z = 2.6; state.yaw = 0.25; state.pitch = -0.12; setGoal(); if (q.get('shot') === 'stew') { state.x = -200.6; state.z = -0.6; state.yaw = 0.1; setTimeout(() => { $('talk').click(); state.step = 1; advance(); }, 400); } } } }, 300);
}
function start(saved) { if (!(saved && saved.started)) applySave(loadGame()); loadAll().catch(() => {}); if (saved && saved.started) { Object.assign(state, saved); if (state.place !== 'out' || state.x > SHORE + 24 || state.x < X0 - 1 || Math.abs(state.z) > 9.5) { state.place = 'out'; state.x = 17; state.z = 0.4; state.yaw = Math.PI / 2; state.pitch = 0; } $('start').addEventListener('click', () => { if (state.unlocked.length) { $('jcount').textContent = state.unlocked.length; $('jcount').hidden = false; } }, { once: true }); } requestAnimationFrame(frame); }
window.claude?.hot?.snapshot?.(() => (state.place === 'out' && !Q.on ? { ...state, step: 0 } : { ...state, step: 0, place: 'out', x: 17, z: 0.4, yaw: Math.PI / 2, pitch: 0 }));
if (window.claude?.hot?.ready) window.claude.hot.ready(start); else start(window.claude?.hot?.data ?? {});
