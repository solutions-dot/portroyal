/* Port Royal's look scenes read one sentence at a time (closeLook: explicit lines, or the first journal paragraph of the object split into sentences).
   node tools/audio/look-lines-pr.mjs [--write] adds those sentences to games/port-royal/voice-lines.json. */
import { readFileSync, writeFileSync } from "node:fs"; import { createHash } from "node:crypto";
import { speakText } from "./voice-script.mjs";
const root = new URL("../../games/port-royal/", import.meta.url).pathname, s = readFileSync(root + "src/main.js", "utf8");
const have = JSON.parse(readFileSync(root + "voice-lines.json", "utf8")), known = new Set(have.map((l) => l.key)), norm = (t) => t.replace(/\s+/g, " ").trim();
const first = (id) => { const m = s.match(new RegExp("\\{ id: '" + id + "', title: [^\\n]*\\n\\s+simple: \\[\\s*'((?:\\\\.|[^'\\\\])*)'")); return m ? m[1].replace(/\\u2019/g, "’").replace(/\\'/g, "'") : null; };
const sentences = [];
for (const id of ["bottle", "pewter", "pipes", "turtle", "sugar", "cocoa", "logwood", "tentp", "kingston"]) { const f = first(id); if (f) sentences.push(...f.split(/(?<=[.!?])\s+/)); else console.log("no journal text for", id); }
sentences.push("A letter lies open on the desk.", "An old stone, its letters worn by the sea air.");
const add = []; for (const t of sentences) { const key = norm(t); if (known.has(key)) continue; known.add(key); add.push({ key, stem: "n-" + createHash("sha1").update(key).digest("hex").slice(0, 8), text: speakText(key), emotion: "neutral", speed: 0.95 }); }
console.log(add.length, "look sentences,", add.reduce((n, o) => n + o.text.length, 0), "chars"); add.forEach((a, i) => console.log(i + "|" + a.text));
if (process.argv.includes("--write")) writeFileSync(root + "voice-lines.json", JSON.stringify([...have, ...add], null, 1) + "\n");
