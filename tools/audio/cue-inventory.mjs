/* Lists the narration cues every game already has in its script: film captions, chapter openers, chapter closers and end cards.
   node tools/audio/cue-inventory.mjs [game]   prints a count table; with a game, prints its cues. Used to plan docs/audio/. */
const GAMES = ["air-jamaica","bog-walk","eventide","garvey","hutchinson","kendal","melissa","morant-bay","nanny","port-royal","rose-hall","selassie","shark-papers","tivoli","windrush","xaymaca"];
const only = process.argv[2];
const load = async (g) => { try { return await import(`../../games/${g}/src/content.js`); } catch { return null; } };
const txt = (x) => (typeof x === "string" ? x : Array.isArray(x) ? x.map(txt).join(" ") : x && typeof x === "object" ? Object.values(x).map(txt).join(" ") : "");
export async function cues(g) {
  const m = await load(g); if (!m) return null;
  const out = { films: [], chapters: [], ends: [], cards: [] };
  for (const [id, f] of Object.entries(m.FILMS || {})) out.films.push({ id, title: f.title, duration: f.duration, captions: (f.captions || []).map((c) => ({ t: c[0], text: c[1], clip: c[2] })) });
  if (m.ARRIVAL_CAPTIONS) out.films.push({ id: "arrival", title: "Arrival", captions: (Array.isArray(m.ARRIVAL_CAPTIONS) ? m.ARRIVAL_CAPTIONS : Object.values(m.ARRIVAL_CAPTIONS)).map((c) => ({ t: c[0], text: c[1] ?? txt(c) })) });
  (m.CHAPTERS || []).forEach((c, i) => out.chapters.push({ i: i + 1, name: c.name || c.title, intro: c.intro || c.caption || c.blurb || "" }));
  for (const [id, c] of Object.entries(m.CHAPTER_END || {})) out.ends.push({ id, text: txt(c) });
  for (const [id, c] of Object.entries(m.CARDS || {})) out.cards.push({ id, title: c.title, text: txt(c.lines || c) });
  return out;
}
if (import.meta.url === `file://${process.argv[1]}`) {
  if (only) console.log(JSON.stringify(await cues(only), null, 1));
  else for (const g of GAMES) { const c = await cues(g); console.log(g.padEnd(13), c ? `films ${c.films.length} (${c.films.reduce((n, f) => n + f.captions.length, 0)} captions)  chapters ${c.chapters.length}  chapter-ends ${c.ends.length}  cards ${c.cards.length}` : "no src/content.js"); }
}
