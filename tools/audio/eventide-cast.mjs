/* Eventide's spoken lines and who says them: node tools/audio/port-royal-cast.mjs [--write]
   One distinct voice per character (owner, 26 November 2026). Light-skinned characters use Cartesia library voices; Black characters use the account's saved voices.
   Writes games/eventide/voice-cast.json: [{ key: "<who>|<text>", who, text, spoken, voice, emotion, speed, stem }]. Docs: docs/audio/PLAN.md. */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { speakText } from "./voice-script.mjs";
const root = new URL("../../games/eventide/", import.meta.url).pathname;
const V = { faye: "c6f27449-17f7-4ec6-afcc-fc4ea217b099", sharpe: "5292be3e-f857-4a68-b239-e2f99c2bd93a" };   // Gran: Faye Ellington; the gateman: Michael Sharpe (owner, 27 November 2026)
export const CAST = { Gran: ["faye", "content", 0.97], "The gateman": ["sharpe", "content", 0.98] };
if (import.meta.url === `file://${process.argv[1]}`) {
  const src = readFileSync(root + "src/content.js", "utf8"), seen = new Map();
  for (const m of src.matchAll(/who:\s*'([^']+)',\s*text:\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)")/g)) {
    const who = m[1], text = (m[2] ?? m[3]).replace(/\\(['"])/g, "$1").replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\s+/g, " ").trim();
    if (who === "You" || !CAST[who]) continue; const key = who + "|" + text;
    if (!seen.has(key)) { const [v, emo, sp] = CAST[who]; const heavy = /\b(sold|enslaved|owns me|not paid|sick|died|swallow|names|grave|gone|hanged|fell|pulled so many|three days|little food)\b/i.test(text), bright = /!$/.test(text) && !heavy;
      seen.set(key, { key, who, text, spoken: speakText(text), voice: V[v], voiceName: v, emotion: heavy ? "sad" : bright ? "excited" : emo, speed: heavy ? Math.min(sp, 0.9) : bright ? Math.max(sp, 1.03) : sp, stem: "c-" + createHash("sha1").update(key).digest("hex").slice(0, 8) }); }
  }
  const out = [...seen.values()]; console.log(out.length, "lines;", [...new Set(out.map((o) => o.who))].length, "characters");
  if (process.argv.includes("--write")) writeFileSync(root + "voice-cast.json", JSON.stringify(out, null, 1) + "\n");
}
