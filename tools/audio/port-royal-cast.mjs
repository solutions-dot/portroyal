/* Port Royal's spoken lines and who says them: node tools/audio/port-royal-cast.mjs [--write]
   One distinct voice per character (owner, 26 November 2026). Light-skinned characters use Cartesia library voices; Black characters use the account's saved voices.
   Writes games/port-royal/voice-cast.json: [{ key: "<who>|<text>", who, text, spoken, voice, emotion, speed, stem }]. Docs: docs/audio/PLAN.md. */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { speakText } from "./voice-script.mjs";
const root = new URL("../../games/port-royal/", import.meta.url).pathname;
const V = {   // voice ids, from the Cartesia account and library
  roy: "f2ddbdca-59d9-4363-abeb-a197d65ea24a", griffin: "c99d36f3-5ffd-4253-803a-535c1bc9c306", gary: "dc52ada6-0e11-4684-a8fa-e0af5b7bdcb2", spencer: "3bf35adc-bcc4-464b-b834-c90c88cf6492",
  benedict: "3c0f09d6-e0d7-499c-a594-70c5b7b93048", owen: "0ea47942-be0b-4bc7-a1bf-5dba008dc1cc", clive: "b24f41fd-00a3-4cd8-992a-a0c9f13f3ef1", martin: "dcddf1f4-b114-4b5d-9158-895cbba0e406",
  rupert: "0ad65e7f-006c-47cf-bd31-52279d487913", harrison: "df89f42f-f285-4613-adbf-14eedcec4c9e", alec: "17044048-bfab-44b2-9532-9c1b65e9c217", toby: "3d5ce2fb-e56c-42f0-9ed9-4662484063b4",
  jasper: "3faa81ae-d3d8-4ab1-9e44-e50e46d33c30", finn: "15070120-82ab-48e5-87e5-c4bf28fa4bf9", oscar: "22df7143-7987-4e15-a720-d65c69a443b3",
  faye: "c6f27449-17f7-4ec6-afcc-fc4ea217b099", rosie: "dc27725f-d567-40fc-bbb7-ffd55445fe5d", sharpe: "5292be3e-f857-4a68-b239-e2f99c2bd93a", cliff: "90543854-f1d7-4ed4-b265-44eeb96e4d80",
};
// who -> [voice, base emotion, base speed]
export const CAST = {
  "Henry Morgan": ["roy", "neutral", 1.0], Ned: ["griffin", "content", 0.93], "Symon Benning": ["gary", "content", 0.97], Sam: ["spencer", "content", 1.0], Sailor: ["oscar", "content", 1.0],
  "Emmanuel Heath": ["benedict", "content", 0.95], "The gunner": ["owen", "neutral", 1.0], "Daniel Mendes": ["clive", "content", 0.97], "Constable Hart": ["martin", "neutral", 0.97],
  Exquemelin: ["rupert", "content", 0.97], Quartermaster: ["harrison", "neutral", 1.0], Tom: ["alec", "content", 1.03], Dick: ["toby", "content", 1.0], Will: ["jasper", "content", 1.02], Jack: ["finn", "excited", 1.03],
  Abba: ["faye", "content", 0.97], Grace: ["rosie", "content", 1.0], Kofi: ["sharpe", "neutral", 0.95], Peter: ["cliff", "content", 0.97],
  // Hannah: waiting for a third saved female voice (owner to choose)
};
if (import.meta.url === `file://${process.argv[1]}`) {
  const src = readFileSync(root + "src/main.js", "utf8"), seen = new Map();
  for (const m of src.matchAll(/who:\s*'([^']+)',\s*text:\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)")/g)) {
    const who = m[1], text = (m[2] ?? m[3]).replace(/\\(['"])/g, "$1").replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\s+/g, " ").trim();
    if (who === "You" || !CAST[who]) continue; const key = who + "|" + text;
    if (!seen.has(key)) { const [v, emo, sp] = CAST[who]; const heavy = /\b(sold|enslaved|owns me|not paid|sick|died|swallow|names|grave|gone|hanged|fell|pulled so many|three days|little food)\b/i.test(text), bright = /!$/.test(text) && !heavy;
      seen.set(key, { key, who, text, spoken: speakText(text), voice: V[v], voiceName: v, emotion: heavy ? "sad" : bright ? "excited" : emo, speed: heavy ? Math.min(sp, 0.9) : bright ? Math.max(sp, 1.03) : sp, stem: "c-" + createHash("sha1").update(key).digest("hex").slice(0, 8) }); }
  }
  const out = [...seen.values()]; console.log(out.length, "lines;", [...new Set(out.map((o) => o.who))].length, "characters");
  if (process.argv.includes("--write")) writeFileSync(root + "voice-cast.json", JSON.stringify(out, null, 1) + "\n");
}
