/* Eventide's spoken lines and who says them: node tools/audio/port-royal-cast.mjs [--write]
   One distinct voice per character (owner, 26 November 2026). Light-skinned characters use Cartesia library voices; Black characters use the account's saved voices.
   Writes games/eventide/voice-cast.json: [{ key: "<who>|<text>", who, text, spoken, voice, emotion, speed, stem }]. Docs: docs/audio/PLAN.md. */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { speakText } from "./voice-script.mjs";
const root = new URL("../../games/eventide/", import.meta.url).pathname;
const V = { gran: "c6f27449-17f7-4ec6-afcc-fc4ea217b099", bell: "41f3f9c6-d6e2-438a-af5a-2069a61d62ba", hyacinth: "aa188bb9-72e0-47ab-9fc8-6b927aaf45cd", kayla: "dac044c3-0e78-4d47-913b-6e47e80e8e3e", fire: "e09b6b48-9904-49ed-9c67-6d4def9deda0", neighbour: "54e2eb56-f80c-488b-8035-ca63bb19ab1d", suit: "e10a81c4-f597-4382-a675-5cb5d5db7170", nurse: "04335f47-1c97-45ab-a42c-fab4145e52ef", dora: "8a0755f0-e939-4228-bf16-81d141498320", iris: "5ef0d4e8-2813-484b-b5c1-4327eaa74624", maude: "91558192-531d-427d-84f4-51db27aa6b5c", gate: "446ff704-529c-4aea-893d-5c8990a6bc14" };   // the gateman: "Jr cat" (aggressive male), owner, 27 November 2026
/* owner, 27 November 2026: Gran Faye Ellington, Nurse Bell "woman (middle aged)", Miss Hyacinth "Woman generic", Kayla "Kofee" (girl younger, owner 27 Nov 2026), the firefighter "Man generic", a neighbour "generic male", a man in a dark suit Winston Stona, a retired nurse Shenseea, Miss Maude "Ms lou" (older lady) (owner, 27 Nov 2026).
   Miss Iris is "Old Jamaican lady" (owner, 27 Nov 2026). Miss Dora is "Other old jamaican lady" (owner, 27 Nov 2026). Every speaker now has a voice. They are left out until a voice is named here. */
export const CAST = { Gran: ["gran", "content", 0.97], "Nurse Bell": ["bell", "content", 0.97], "Miss Hyacinth": ["hyacinth", "content", 1.0], Kayla: ["kayla", "content", 1.03], "The firefighter": ["fire", "neutral", 0.95], "A neighbour": ["neighbour", "neutral", 0.97], "A man in a dark suit": ["suit", "neutral", 0.95], "Miss Dora": ["dora", "content", 0.95], "Miss Iris": ["iris", "content", 0.95], "Miss Maude": ["maude", "content", 0.95], "The gateman": ["gate", "neutral", 1.0], "A retired nurse": ["nurse", "content", 0.97] };
const GRAVE = /\b(fire|burn|burned|burnt|died|dead|rope|pray|mercy|mourning|lost|goodbye|ward|firemen|trapped|cried|smoke|names)\b/i;
const MOOD = (who, i, t) => (/!/.test(t) && !GRAVE.test(t) ? ["excited", Math.max(CAST[who][2], 1.03)] : GRAVE.test(t) ? ["sad", 0.92] : null);
if (import.meta.url === `file://${process.argv[1]}`) {
  const src = readFileSync(root + "src/content.js", "utf8"), seen = new Map();
  for (const m of src.matchAll(/who:\s*'([^']+)',\s*text:\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)")/g)) {
    const who = m[1], text = (m[2] ?? m[3]).replace(/\\(['"])/g, "$1").replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\s+/g, " ").trim();
    if (who === "You" || !CAST[who]) continue; const key = who + "|" + text;
    if (!seen.has(key)) { const [v, emo, sp] = CAST[who]; const heavy = /\b(sold|enslaved|owns me|not paid|sick|died|swallow|names|grave|gone|hanged|fell|pulled so many|three days|little food)\b/i.test(text), bright = /!$/.test(text) && !heavy;
      seen.set(key, { key, who, text, spoken: speakText(text), voice: V[v], voiceName: v, emotion: heavy ? "sad" : bright ? "excited" : emo, speed: heavy ? Math.min(sp, 0.9) : bright ? Math.max(sp, 1.03) : sp, stem: "c-" + createHash("sha1").update(key).digest("hex").slice(0, 8) }); }
  }
  /* lines whose text is chosen by the story (s.sit === 'iris' ? 'A' : 'B'): every quoted sentence in the expression is a line */
  for (const m of src.matchAll(/who:\s*'([^']+)',\s*text:\s*(?!['"])([^\n]{0,400})/g)) {
    const who = m[1]; if (who === "You" || !CAST[who]) continue;
    for (const q of m[2].matchAll(/'((?:\\.|[^'\\])*)'/g)) { const text = q[1].replace(/\\(['"])/g, "$1").replace(/\s+/g, " ").trim(); if (text.length < 14 || !/[.!?]$/.test(text)) continue;
      const key = who + "|" + text; if (seen.has(key)) continue; const [v, emo, sp] = CAST[who]; const heavy = /\b(died|grave|gone)\b/i.test(text), bright = /!$/.test(text) && !heavy;
      seen.set(key, { key, who, text, spoken: speakText(text), voice: V[v], voiceName: v, emotion: heavy ? "sad" : bright ? "excited" : emo, speed: heavy ? Math.min(sp, 0.9) : bright ? Math.max(sp, 1.03) : sp, stem: "c-" + createHash("sha1").update(key).digest("hex").slice(0, 8) }); }
  }
  const out = [...seen.values()]; console.log(out.length, "lines;", [...new Set(out.map((o) => o.who))].length, "characters");
  if (process.argv.includes("--write")) writeFileSync(root + "voice-cast.json", JSON.stringify(out, null, 1) + "\n");
}
