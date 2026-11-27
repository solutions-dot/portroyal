/* Bog Walk's spoken lines and who says them: node tools/audio/bog-walk-cast.mjs [--write] [--list]
   Sources: the talk lists (`who: 'X', text: '...'` in src/content.js) and the timed lines (`say('X', '...')` in src/main.js). You (the player) are silent; the narrator quotes in say('') are not cast.
   Writes games/bog-walk/voice-cast.json: [{ key: "<who>|<text>", who, text, spoken, voice, emotion, speed, stem }]. Docs: docs/audio/PLAN.md.
   Voices (owner, 27 November 2026): Old Zeke Winston Stona, Rudy Spragga, Miss Grant "woman (middle aged)", Bass Henry Jr cat, the Gleaner man Hutton Benedict (library), Mr Bertie "generic male", the woman "Woman generic", Miss Ivy Shenseea, the conductor "Man generic", Kemar "Young jamaican boy", Mr Douparrouzel Reid Martin (library). Mr Douparrouzel is real: his one line is his own report (docs/games/bog-walk.md). */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { speakText } from "./voice-script.mjs";
const root = new URL("../../games/bog-walk/", import.meta.url).pathname;
const V = { zeke: "e10a81c4-f597-4382-a675-5cb5d5db7170", rudy: "824d2503-1dd4-4661-b657-8bc73d2fb274", grant: "41f3f9c6-d6e2-438a-af5a-2069a61d62ba", henry: "446ff704-529c-4aea-893d-5c8990a6bc14", gleaner: "3c0f09d6-e0d7-499c-a594-70c5b7b93048", bertie: "54e2eb56-f80c-488b-8035-ca63bb19ab1d", woman: "aa188bb9-72e0-47ab-9fc8-6b927aaf45cd", ivy: "04335f47-1c97-45ab-a42c-fab4145e52ef", conductor: "e09b6b48-9904-49ed-9c67-6d4def9deda0", kemar: "bfbef678-1120-4061-84bc-46ed6033bec0", douparrouzel: "dcddf1f4-b114-4b5d-9158-895cbba0e406" };
export const CAST = { "Old Zeke": ["zeke", "content", 0.93], Rudy: ["rudy", "content", 1.0], "Miss Grant": ["grant", "content", 0.97], "Bass Henry": ["henry", "neutral", 0.97], "The man from the Gleaner": ["gleaner", "neutral", 0.97], "Mr Bertie": ["bertie", "content", 0.95], "The woman": ["woman", "content", 0.97], "Miss Ivy": ["ivy", "content", 0.97], "The conductor": ["conductor", "neutral", 0.97], Kemar: ["kemar", "content", 1.0], "Mr Douparrouzel": ["douparrouzel", "neutral", 0.93] };
const GRAVE = /\b(water|flood|dead|died|drown|drowned|lost|trapped|dark|gone|father|danger|run|blame)\b/i;
const MOOD = (who, i, t) => (who === "Mr Douparrouzel" ? null : /!$/.test(t) && !GRAVE.test(t) ? ["excited", Math.max(CAST[who][2], 1.03)] : GRAVE.test(t) && /\b(trapped|drown|drowned|dead|died|lost|gone|father|danger)\b/i.test(t) ? ["sad", Math.min(CAST[who][2], 0.92)] : null);
const clean = (t) => t.replace(/\\(['"])/g, "$1").replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\s+/g, " ").trim();
if (import.meta.url === `file://${process.argv[1]}`) {
  const seen = new Set(), out = []; let i = 0;
  /* "A long line to test two rows" is layout test text in the dev build, not spoken */
  const take = (who, t) => { const text = clean(t); if (/long line to test/.test(text) || !CAST[who] || seen.has(who + "|" + text)) return; seen.add(who + "|" + text);
    const [v, emo, sp] = CAST[who], mood = MOOD(who, i, text), key = who + "|" + text;
    out.push({ key, who, text, spoken: speakText(text), voice: V[v], voiceName: v, emotion: mood ? mood[0] : emo, speed: mood ? mood[1] : sp, stem: "c-" + createHash("sha1").update(key).digest("hex").slice(0, 8) }); i++; };
  for (const f of readdirSync(root + "src").filter((f) => f.endsWith(".js"))) {
    const s = readFileSync(root + "src/" + f, "utf8");
    for (const m of s.matchAll(/who:\s*['"]([^'"]+)['"]\s*(?:,\s*anim:\s*['"][^'"]*['"])?\s*,\s*text:\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)")/g)) take(m[1], m[2] ?? m[3]);
    for (const m of s.matchAll(/\bsay\(\s*'([^']+)',\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)")/g)) take(m[1], m[2] ?? m[3]);
  }
  console.log(out.length, "lines;", out.filter((o) => o.voice).length, "with a voice");
  if (process.argv.includes("--list")) out.forEach((o, n) => console.log(n + "|" + o.who + "|" + o.emotion + "|" + o.speed + "|" + o.spoken));
  if (process.argv.includes("--write")) writeFileSync(root + "voice-cast.json", JSON.stringify(out, null, 1) + "\n");
}
