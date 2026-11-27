/* Marcus Garvey's spoken lines and who says them: node tools/audio/garvey-cast.mjs [--write] [--list]
   Sources: the talk lists (`who: 'X', text: '...'`) and `L("X", "...")` in src/*.js. Garvey, the two Amys and the story-told lines (who: NAR) are not cast: his sourced words have their own recreated-voice clips, the story's lines are the Narrator's (tools/audio/story-told-lines.mjs).
   Voices (owner, 27 November 2026, "the rest as fine for now"): Printer "Buju Male", Guide dorraine samuels, Sailor Bob Marley, Pressman "Man generic", Student Kofee, Steward Jimmy Cliff, Older man Winston Stona, Friend Spragga, Share clerk Jr cat, Engineer "generic male", Nurse Shenseea, Messenger "Young jamaican boy", Customer "young man (expressive)", Worker Faye Ellington, Woman "Woman generic", Traveller "woman (middle aged)". */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { speakText } from "./voice-script.mjs";
const root = new URL("../../games/garvey/", import.meta.url).pathname;
const V = { printer: "5f2ecbd7-34e9-48b9-b5ac-9b543078d6e6", guide: "74a89262-c877-4580-af34-28b50a665413", sailor: "2bd626f2-4c0c-44f0-940b-034afd5701eb", pressman: "e09b6b48-9904-49ed-9c67-6d4def9deda0", student: "dac044c3-0e78-4d47-913b-6e47e80e8e3e", steward: "90543854-f1d7-4ed4-b265-44eeb96e4d80", older: "e10a81c4-f597-4382-a675-5cb5d5db7170", friend: "824d2503-1dd4-4661-b657-8bc73d2fb274", clerk: "446ff704-529c-4aea-893d-5c8990a6bc14", engineer: "54e2eb56-f80c-488b-8035-ca63bb19ab1d", nurse: "04335f47-1c97-45ab-a42c-fab4145e52ef", messenger: "bfbef678-1120-4061-84bc-46ed6033bec0", customer: "9e0fa051-eaef-4108-b0fb-aa134d35044e", worker: "c6f27449-17f7-4ec6-afcc-fc4ea217b099", woman: "aa188bb9-72e0-47ab-9fc8-6b927aaf45cd", traveller: "41f3f9c6-d6e2-438a-af5a-2069a61d62ba" };
export const CAST = { Printer: ["printer", "content", 0.97], Guide: ["guide", "content", 0.97], Sailor: ["sailor", "content", 0.97], Pressman: ["pressman", "content", 0.97], Student: ["student", "content", 1.0], Steward: ["steward", "content", 0.97], "Older man": ["older", "neutral", 0.95], Friend: ["friend", "content", 1.0], "Share clerk": ["clerk", "neutral", 0.97], Engineer: ["engineer", "content", 0.95], Nurse: ["nurse", "content", 0.97], Messenger: ["messenger", "content", 1.0], Customer: ["customer", "content", 1.0], Worker: ["worker", "content", 0.95], Woman: ["woman", "content", 0.97], Traveller: ["traveller", "content", 0.97] };
const GRAVE = /\b(prison|lost|miss home|small|rumour|banned|danger|hurt|worry|worried)\b/i;
const MOOD = (who, i, t) => (/!$/.test(t) && !GRAVE.test(t) ? ["excited", Math.max(CAST[who][2], 1.03)] : GRAVE.test(t) && /\b(lost|miss home|worried|danger)\b/i.test(t) ? ["sad", Math.min(CAST[who][2], 0.92)] : null);
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
    for (const m of s.matchAll(/\bL\(\s*"([^"]+)",\s*"((?:\\.|[^"\\])*)"/g)) take(m[1], m[2]);
  }
  console.log(out.length, "lines;", out.filter((o) => o.voice).length, "with a voice");
  if (process.argv.includes("--list")) out.forEach((o, n) => console.log(n + "|" + o.who + "|" + o.emotion + "|" + o.speed + "|" + o.spoken));
  if (process.argv.includes("--write")) writeFileSync(root + "voice-cast.json", JSON.stringify(out, null, 1) + "\n");
}
