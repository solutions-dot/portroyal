/* Makes the spoken version of every film caption for a game: numbers as words, short titles spelled out, hard names respelled.
   node tools/audio/voice-script.mjs <game> [--write]    prints "stem | spoken | caption"; --write saves games/<game>/voice-script.json
   Clip names are  <film>-<second>  (narrator-<film>-<second>.mp3). Docs: docs/AUDIO.md. */
import { writeFileSync } from "node:fs";
import { cues } from "./cue-inventory.mjs";
const ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
const TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split(" ");
const below100 = (n) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : ""));
const below1000 = (n) => (n < 100 ? below100(n) : ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " and " + below100(n % 100) : ""));
export const words = (n) => (n < 1000 ? below1000(n) : n < 1e6 ? below1000(Math.floor(n / 1000)) + " thousand" + (n % 1000 ? (n % 1000 < 100 ? " and " : " ") + below1000(n % 1000) : "") : String(n));
const year = (n) => { if (n >= 2000 && n < 2010) return "two thousand" + (n > 2000 ? " and " + ONES[n - 2000] : ""); if (n >= 2010 && n < 2100) return "twenty " + below100(n - 2000); const a = Math.floor(n / 100), b = n % 100; return below100(a) + " " + (b === 0 ? "hundred" : b < 10 ? "oh " + ONES[b] : below100(b)); };
const ORD = { 1: "first", 2: "second", 3: "third", 4: "fourth", 5: "fifth", 6: "sixth", 7: "seventh", 8: "eighth", 9: "ninth", 10: "tenth", 11: "eleventh", 12: "twelfth", 13: "thirteenth", 14: "fourteenth", 15: "fifteenth", 16: "sixteenth", 17: "seventeenth", 18: "eighteenth", 19: "nineteenth", 20: "twentieth", 30: "thirtieth" };
const ordinal = (n) => ORD[n] || (n < 100 ? TENS[Math.floor(n / 10)] + "-" + ORD[n % 10] : String(n));
const MONTH = "January|February|March|April|May|June|July|August|September|October|November|December";
// the model says the same respelling differently by context (owner, 26 November 2026): the opening line of Air Jamaica is right with "pal-e-say-doze", the others with "Palesaydoze"
const RESPELL = [[/gallery, Palisadoes/g, "gallery, pal-e-say-doze"], [/There it is\. Palisadoes\./g, "There it is. The airport, pal-e-say-doze."], [/Palisadoes/g, "Palesaydoze"], [/\bthot\b/g, "thought"]];
export function speak(s) {
  let t = s.replace(/[“”"]/g, "").replace(/’/g, "'").replace(/…/g, "...").replace(/\.\.\./g, ", ").replace(/ — | – /g, ", ").replace(/\bLEGEND\.\s*/g, "Legend. ").replace(/\bMr\b\.?/g, "Mister").replace(/\bMrs\b\.?/g, "Missus").replace(/\bDr\b\.?/g, "Doctor").replace(/\bSt\b\.?(?=\s)/g, "Saint").replace(/\bCapt\b\.?/g, "Captain").replace(/\bLieut\b\.?/g, "Lieutenant").replace(/ \/ /g, " ");
  t = t.replace(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)? (${MONTH})\\b`, "g"), (_, d, m) => "the " + ordinal(+d) + " of " + m);
  t = t.replace(/\b(1[0-9]{3}|20[0-9]{2})s\b/g, (_, y) => year(+y).replace(/y$/, "ie") + "s");
  t = t.replace(/\b(1[0-9]{3}|20[0-9]{2})\b/g, (_, y) => year(+y));
  t = t.replace(/\b(\d+)(?:st|nd|rd|th)\b/g, (_, n) => ordinal(+n));
  t = t.replace(/(\d+)%/g, (_, n) => words(+n) + " per cent");
  t = t.replace(/\b\d{1,3}(?:,\d{3})+\b/g, (m) => words(+m.replace(/,/g, "")));
  t = t.replace(/\b\d+\b/g, (n) => words(+n));
  for (const [a, b] of RESPELL) t = t.replace(a, b);
  if (/^[A-Z][^:a-z]*(?: (?:the|first|second|[A-Z][a-z]+))*: [“"][^“”"]*[”"]$/.test(s) && /^((The )?(first |second )?[A-Z][a-z]+( [A-Z][a-z]+)?)$/.test(s.split(":")[0])) t = t.replace(/^([^:]{3,28}): /, "$1 says, ").replace(/([.!?]) ([a-z])/g, (_, p, c) => p + " " + c.toUpperCase());
  t = t.replace(/([.!?]) ([a-z])/g, (_, p, c) => p + " " + c.toUpperCase());
  return t.replace(/\s+/g, " ").trim().replace(/^[,;:\s]+/, "").replace(/^[a-z]/, (c) => c.toUpperCase());
}
export { speak as speakText };
const direct = import.meta.url === `file://${process.argv[1]}`;
const game = process.argv[2], write = process.argv.includes("--write");
if (direct && game) {
  const c = await cues(game), out = {};
  for (const f of c.films) f.captions.forEach((cap) => { const stem = `${f.id}-${String(cap.t).replace(".", "_")}`; out[stem] = { text: speak(cap.text), caption: cap.text, film: f.id, t: cap.t }; });
  for (const [k, v] of Object.entries(out)) console.log(k.padEnd(22), "|", v.text, v.text === v.caption ? "" : "   <= " + v.caption);
  if (write) writeFileSync(new URL(`../../games/${game}/voice-script.json`, import.meta.url), JSON.stringify(out, null, 1) + "\n");
}
