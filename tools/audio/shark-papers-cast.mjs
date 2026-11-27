/* The Shark Papers' spoken lines and who says them: node tools/audio/shark-papers-cast.mjs [--write] [--list]
   Writes games/shark-papers/voice-cast.json: [{ key: "<who>|<text>", who, text, spoken, voice, emotion, speed, stem }]. 
   Voices (owner, 27 November 2026): Mr Fitton Roy, Ben "young man (expressive)", Mr Cato Jimmy Cliff, Mr Wylie Gary, the clerk Harrison. Jem (the player) is silent. */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { speakText } from "./voice-script.mjs";
const root = new URL("../../games/shark-papers/", import.meta.url).pathname;
const V = { fitton: "f2ddbdca-59d9-4363-abeb-a197d65ea24a", wylie: "dc52ada6-0e11-4684-a8fa-e0af5b7bdcb2", clerk: "df89f42f-f285-4613-adbf-14eedcec4c9e", cato: "90543854-f1d7-4ed4-b265-44eeb96e4d80", ben: "9e0fa051-eaef-4108-b0fb-aa134d35044e" };
/* owner, 27 November 2026: Mr Fitton Roy (library), Ben "young man (expressive)", Mr Cato Jimmy Cliff, Mr Wylie Gary (library), the clerk Harrison (library) */
export const CAST = { "Mr Fitton": ["fitton", "content", 1.0], Ben: ["ben", "content", 1.0], "Mr Cato": ["cato", "neutral", 0.95], "Mr Wylie": ["wylie", "content", 1.02], "The clerk": ["clerk", "neutral", 0.97] };
const MOOD = (who, i, t) => (/!/.test(t) && who !== "The clerk" ? ["excited", Math.max(CAST[who][2], 1.03)] : /\b(owns me|keeps the pay)\b/i.test(t) ? ["sad", 0.93] : null);
if (import.meta.url === `file://${process.argv[1]}`) {
  const s = readFileSync(root + "src/content.js", "utf8");
  const seen = new Set(), out = []; let i = 0;
  const found = [...s.matchAll(/\bL\(\s*"([^"]+)",\s*"((?:\\.|[^"\\])*)"\s*\)/g), ...s.matchAll(/who:\s*['"]([^'"]+)['"],\s*text:\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)")/g)].sort((a, b) => a.index - b.index);
  for (const m of found) {
    const who = m[1], text = (m[2] ?? m[3]).replace(/\\(['"])/g, "$1").replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\s+/g, " ").trim();
    if (!CAST[who] || seen.has(who + "|" + text)) continue; seen.add(who + "|" + text);
    const [v, emo, sp] = CAST[who], mood = MOOD(who, i, text), key = who + "|" + text;
    out.push({ key, who, text, spoken: speakText(text), voice: v ? V[v] : null, voiceName: v, emotion: mood ? mood[0] : emo, speed: mood ? mood[1] : sp, stem: "c-" + createHash("sha1").update(key).digest("hex").slice(0, 8) }); i++;
  }
  console.log(out.length, "lines;", out.filter((o) => o.voice).length, "with a voice");
  if (process.argv.includes("--list")) out.forEach((o, n) => console.log(n, o.who, o.emotion, o.speed, o.text));
  if (process.argv.includes("--write")) writeFileSync(root + "voice-cast.json", JSON.stringify(out, null, 1) + "\n");
}
