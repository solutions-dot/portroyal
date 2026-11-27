/* The White Witch of Rose Hall's spoken lines and who says them: node tools/audio/rose-hall-cast.mjs [--write] [--list]
   Writes games/rose-hall/voice-cast.json: [{ key: "<who>|<text>", who, text, spoken, voice, emotion, speed, stem }]. 
   Voices (owner, 27 November 2026): Miss Bryan "woman (middle aged)", Tia "young child", Mrs Lindo dorraine samuels, Sister Reid "Woman generic"; the player is silent. */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { speakText } from "./voice-script.mjs";
const root = new URL("../../games/rose-hall/", import.meta.url).pathname;
const V = { bryan: "41f3f9c6-d6e2-438a-af5a-2069a61d62ba", tia: "b883942d-facf-4719-917d-b164d2f3d93b", lindo: "74a89262-c877-4580-af34-28b50a665413", reid: "aa188bb9-72e0-47ab-9fc8-6b927aaf45cd" };
/* owner, 27 November 2026: Miss Bryan "woman (middle aged)", Tia "young child" (Rosie was too abrasive), Mrs Lindo dorraine samuels, Sister Reid "Woman generic" */
export const CAST = { "Miss Bryan": ["bryan", "content", 0.97], Tia: ["tia", "content", 1.03], "Mrs Lindo": ["lindo", "neutral", 0.97], "Sister Reid": ["reid", "neutral", 0.95] };
const MOOD = (who, i, t) => (who === "Miss Bryan" && /\b(real cruelty|names|held|stones)\b/i.test(t) ? ["sad", 0.93] : /!/.test(t) ? ["excited", Math.max(CAST[who][2], 1.03)] : who === "Tia" && /\b(afraid|scared|shak|arm|dark|shadow)\b/i.test(t) ? ["sad", 0.97] : null);
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
