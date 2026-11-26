/* Lists the text the narrator reads in the games that have no film captions: chapter title cards, camera-scene captions (say) and closers.
   node tools/audio/voice-lines.mjs <game> [--write]   prints  stem | spoken text  ; --write saves games/<game>/voice-lines.json
   The key is the exact on-screen text, so voices/index.json can map text to clip (engine/narrator.js). Docs: docs/AUDIO.md. */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { speakText } from "./voice-script.mjs";
const game = process.argv[2], write = process.argv.includes("--write");
const root = new URL("../../games/", import.meta.url).pathname;
const norm = (t) => String(t).replace(/\s+/g, " ").trim();
const keys = new Map();
const add = (k, any) => { k = norm(k.replace(/\\(['"`])/g, "$1")); if (/\\$/.test(k) || (!any && !/[.!?]/.test(k))) return; if (k.length > 3 && !keys.has(k)) keys.set(k, "n-" + createHash("sha1").update(k).digest("hex").slice(0, 8)); };
let m = {}; try { m = await import(`${root}${game}/src/content.js`); } catch { /* no content.js */ }
for (const c of m.CHAPTERS || []) { const t = c.title || c.name, sub = c.sub || ""; if (t && sub) add(t + ". " + sub); else if (t && game === "tivoli") add(t, true); }
const src = readFileSync(`${root}${game}/src/main.js`, "utf8");
for (const x of src.matchAll(/\bsay\(\s*(['"`])((?:\\.|(?!\1).)+?)\1/g)) if (!/\$\{|^You$/.test(x[2]) && x[2].length > 12) add(x[2]);
for (const x of src.matchAll(/\b(?:chapterFade|titleFade)\(\s*(?:\$\('fade'\),\s*)?'([^']+)',\s*'([^']+)'/g)) add(x[1] + ". " + x[2]);
const out = [...keys].map(([key, stem]) => ({ key, stem, text: speakText(key) }));
for (const o of out) console.log(o.stem, "|", o.text);
console.log(out.length, "lines");
if (write) writeFileSync(`${root}${game}/voice-lines.json`, JSON.stringify(out, null, 1) + "\n");
