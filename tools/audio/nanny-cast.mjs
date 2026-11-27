/* Nanny Town's spoken lines and who says them: node tools/audio/nanny-cast.mjs [--write]
   Writes games/nanny/voice-cast.json: [{ key: "<who>|<text>", who, text, spoken, voice, emotion, speed, stem }]. Nanny never speaks (docs/games/nanny.md).
   Voices (owner, 27 November 2026): Mama dorraine samuels, Cubbenah Bob Marley, Auntie Mimba Faye Ellington, Quamin Jimmy Cliff; Beneba "young child", Phibba "Small girl child". Docs: docs/audio/PLAN.md. */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { speakText } from "./voice-script.mjs";
const root = new URL("../../games/nanny/", import.meta.url).pathname;
const V = { mama: "74a89262-c877-4580-af34-28b50a665413", cubbenah: "2bd626f2-4c0c-44f0-940b-034afd5701eb", mimba: "c6f27449-17f7-4ec6-afcc-fc4ea217b099", quamin: "90543854-f1d7-4ed4-b265-44eeb96e4d80", beneba: "b883942d-facf-4719-917d-b164d2f3d93b", phibba: "7ea04cdd-1d37-49f1-b724-e07f36db60de" };
export const CAST = { Mama: ["mama", "content", 0.95], Cubbenah: ["cubbenah", "content", 0.97], "Auntie Mimba": ["mimba", "content", 0.93], Quamin: ["quamin", "content", 0.97], Beneba: ["beneba", "content", 1.03], Phibba: ["phibba", "sad", 0.95] };
/* the scene's mood, by the order lines appear in the file (see the numbered dump: node tools/audio/nanny-cast.mjs --list) */
const MOOD = (who, i, t) => {
  if (who === "Mama") { if (i <= 4) return ["neutral", 0.9]; if (i >= 64 && i <= 68) return ["excited", 1.05]; if (i >= 67 && i <= 76 || i === 63) return ["sad", 0.9]; return null; }
  if (who === "Cubbenah") { if (i === 31) return ["excited", 1.03]; if (i >= 55 && i <= 57) return ["neutral", 0.93]; if (i === 60 || i >= 81 && i <= 84) return ["sad", 0.92]; return null; }
  if (who === "Quamin") { if (i >= 8 && i <= 10) return ["neutral", 0.9]; if (i === 44) return ["neutral", 0.95]; return null; }
  if (who === "Beneba" && i === 69) return ["excited", 1.05];
  return null;
};
if (import.meta.url === `file://${process.argv[1]}`) {
  const s = readFileSync(root + "src/content.js", "utf8"), names = Object.fromEntries([...s.matchAll(/\b([A-Z]{2}) = '([^']+)'/g)].map((m) => [m[1], m[2]]));
  const seen = new Set(), out = []; let i = 0;
  for (const m of s.matchAll(/who:\s*([A-Z]{2}|'[^']+'),\s*text:\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)")/g)) {
    const who = names[m[1]] || m[1].replace(/'/g, ""), text = (m[2] ?? m[3]).replace(/\\(['"])/g, "$1").replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\s+/g, " ").trim();
    if (!CAST[who] || seen.has(who + "|" + text)) continue; seen.add(who + "|" + text);
    const [v, emo, sp] = CAST[who], mood = MOOD(who, i, text), key = who + "|" + text;
    out.push({ key, who, text, spoken: speakText(text), voice: v ? V[v] : null, voiceName: v, emotion: mood ? mood[0] : emo, speed: mood ? mood[1] : sp, stem: "c-" + createHash("sha1").update(key).digest("hex").slice(0, 8) }); i++;
  }
  console.log(out.length, "lines;", out.filter((o) => o.voice).length, "with a voice");
  if (process.argv.includes("--list")) out.forEach((o, n) => console.log(n, o.who, o.emotion, o.speed, o.text));
  if (process.argv.includes("--write")) writeFileSync(root + "voice-cast.json", JSON.stringify(out, null, 1) + "\n");
}
