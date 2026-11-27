/* Morant Bay's spoken lines and who says them: node tools/audio/morant-bay-cast.mjs [--write] [--list]
   Writes games/morant-bay/voice-cast.json: [{ key: "<who>|<text>", who, text, spoken, voice, emotion, speed, stem }]. Hannah (the player) is silent; Paul Bogle, George William Gordon and the constable have no words.
   Voices (owner, 27 November 2026): Gran "Old Jamaican lady", Mama "woman (middle aged)", Papa "Buju Male", Deacon Clarke Winston Stona, Miss Ada "Woman generic", Sammy "Spragga" (young man, the owner's young boy voice), the clerk Harrison (library). */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { speakText } from "./voice-script.mjs";
const root = new URL("../../games/morant-bay/", import.meta.url).pathname;
const V = { gran: "5ef0d4e8-2813-484b-b5c1-4327eaa74624", mama: "41f3f9c6-d6e2-438a-af5a-2069a61d62ba", papa: "5f2ecbd7-34e9-48b9-b5ac-9b543078d6e6", deacon: "e10a81c4-f597-4382-a675-5cb5d5db7170", ada: "aa188bb9-72e0-47ab-9fc8-6b927aaf45cd", sammy: "824d2503-1dd4-4661-b657-8bc73d2fb274", clerk: "df89f42f-f285-4613-adbf-14eedcec4c9e" };
export const CAST = { Gran: ["gran", "content", 0.95], Mama: ["mama", "content", 0.97], Papa: ["papa", "content", 0.95], "Deacon Clarke": ["deacon", "neutral", 0.95], "Miss Ada": ["ada", "content", 1.0], Sammy: ["sammy", "content", 1.0], "The clerk": ["clerk", "neutral", 0.95] };
const GRAVE = /\b(hanged|dead|died|killed|shot|hungry|hunger|afraid|fire|burn|burned|soldiers|blood|cry|crying|lost|no rain|no pay)\b/i;
const MOOD = (who, i, t) => (who === "The clerk" ? null : GRAVE.test(t) ? ["sad", Math.min(CAST[who][2], 0.92)] : /!$/.test(t) ? ["excited", Math.max(CAST[who][2], 1.03)] : null);
if (import.meta.url === `file://${process.argv[1]}`) {
  const s = readFileSync(root + "src/content.js", "utf8");
  const seen = new Set(), out = []; let i = 0;
  for (const m of s.matchAll(/\bL\(\s*"([^"]+)",\s*"((?:\\.|[^"\\])*)"\s*\)/g)) {
    const who = m[1], text = m[2].replace(/\\(['"])/g, "$1").replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\s+/g, " ").trim();
    if (!CAST[who] || seen.has(who + "|" + text)) continue; seen.add(who + "|" + text);
    const [v, emo, sp] = CAST[who], mood = MOOD(who, i, text), key = who + "|" + text;
    out.push({ key, who, text, spoken: speakText(text), voice: v ? V[v] : null, voiceName: v, emotion: mood ? mood[0] : emo, speed: mood ? mood[1] : sp, stem: "c-" + createHash("sha1").update(key).digest("hex").slice(0, 8) }); i++;
  }
  console.log(out.length, "lines;", out.filter((o) => o.voice).length, "with a voice");
  if (process.argv.includes("--list")) out.forEach((o, n) => console.log(n, o.who, o.emotion, o.speed, o.text));
  if (process.argv.includes("--write")) writeFileSync(root + "voice-cast.json", JSON.stringify(out, null, 1) + "\n");
}
