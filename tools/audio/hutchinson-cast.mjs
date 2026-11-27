/* The Mad Master's spoken lines and who says them: node tools/audio/hutchinson-cast.mjs [--write] [--list]
   Writes games/hutchinson/voice-cast.json: [{ key: "<who>|<text>", who, text, spoken, voice, emotion, speed, stem }]. Hutchinson, Callendar and Hector never speak (docs/games/hutchinson.md).
   Voices (owner, 27 November 2026): Sampson "Man generic", Dr Hutton Benedict (library), Cubba Faye Ellington, Juba Rosie, Cudjoe Winston Stona, Captain Reid Martin (library), the clerk Jasper (library). */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { speakText } from "./voice-script.mjs";
const root = new URL("../../games/hutchinson/", import.meta.url).pathname;
const V = { sampson: "e09b6b48-9904-49ed-9c67-6d4def9deda0", hutton: "3c0f09d6-e0d7-499c-a594-70c5b7b93048", cubba: "c6f27449-17f7-4ec6-afcc-fc4ea217b099", juba: "dc27725f-d567-40fc-bbb7-ffd55445fe5d", cudjoe: "e10a81c4-f597-4382-a675-5cb5d5db7170", reid: "dcddf1f4-b114-4b5d-9158-895cbba0e406", clerk: "3faa81ae-d3d8-4ab1-9e44-e50e46d33c30" };
/* owner, 27 November 2026: Sampson "Man generic", Dr Hutton Benedict (library), Cubba Faye Ellington, Juba Rosie, Cudjoe Winston Stona, Captain Reid Martin (library), the clerk Jasper (library) */
export const CAST = { Sampson: ["sampson", "content", 0.97], "Dr Hutton": ["hutton", "content", 0.95], Cubba: ["cubba", "content", 0.9], Juba: ["juba", "neutral", 0.9], Cudjoe: ["cudjoe", "sad", 0.9], "Captain Reid": ["reid", "neutral", 0.97], "The clerk": ["clerk", "neutral", 1.0] };
const GRAVE = /\b(dead|died|die|bones|hole|names?|carry|carried|killed|buried|bodies|slave|slaves|never|lost|afraid|danger|hush)\b/i;
const MOOD = (who, i, t) => (who === "Cudjoe" ? ["sad", 0.9] : GRAVE.test(t) && who !== "The clerk" && who !== "Captain Reid" ? ["sad", Math.min(CAST[who][2], 0.92)] : /!$/.test(t) ? ["excited", Math.max(CAST[who][2], 1.03)] : null);
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
