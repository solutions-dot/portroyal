/* Check every spoken line in Xaymaca has a clip on disk. The player's own lines stay silent.
   node tools/xaymaca/voice-coverage.mjs  (exit 1 when a line or file is missing) */
import { existsSync, readdirSync } from "node:fs";
import { TALK, FLAVOUR, FILMS } from "../../games/xaymaca/src/content.js";
import { STEPS } from "../../games/xaymaca/src/steps.js";
import { LINE_VOICES } from "../../games/xaymaca/src/line-voices.js";
const site = new URL("../../games/xaymaca/site/", import.meta.url).pathname;
const bad = [], used = new Set();
const has = (p, where) => { used.add(p.replace(/^voices\//, "")); if (!existsSync(site + p)) bad.push(where + ": file missing " + p); };
for (const [st, who] of Object.entries(TALK)) for (const [id, L] of Object.entries(who)) L.forEach((l, i) => {
  if (l.who === "You") return;
  const v = l.voice || LINE_VOICES[l.text];
  if (!v) bad.push(`talk ${st}.${id}[${i}] ${l.who}: no clip for "${l.text}"`); else has(v, `talk ${st}.${id}[${i}]`);
});
const flav = (where, L) => (L || []).forEach((t) => { const v = LINE_VOICES[t]; if (!v) bad.push(`${where}: no clip for "${t}"`); else has(v, where); });
for (const [id, L] of Object.entries(FLAVOUR)) flav("flavour " + id, L);
for (const [st, s] of Object.entries(STEPS)) for (const k of ["flavour", "after"]) for (const [id, L] of Object.entries(s[k] || {})) flav(`step ${st} ${k} ${id}`, typeof L === "function" ? [] : L);
for (const [f, film] of Object.entries(FILMS)) film.captions.forEach(([t, text, clip]) => {
  if (!clip) bad.push(`film ${f} @${t}: no clip for "${text}"`); else has("voices/narrator-" + clip + ".mp3", `film ${f} @${t}`);
  if (/\d/.test(text)) bad.push(`film ${f} @${t}: caption has a numeral, voiced captions write numbers as words`);
});
for (const f of Object.keys(FILMS)) if (!existsSync(site + "scores/score-" + f + ".mp3")) bad.push("film " + f + ": score missing");
has("voices/narrator-ending.mp3", "ending");
const unused = readdirSync(site + "voices").filter((f) => !used.has(f));
console.log(bad.length ? bad.join("\n") : "VOICES OK: every spoken line has a clip");
if (unused.length) console.log("\nUnused clips (" + unused.length + "):\n" + unused.join("\n"));
process.exit(bad.length ? 1 : 0);
