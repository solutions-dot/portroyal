/* Delivery (emotion and pace) for each narrator line, so the voice fits the scene and is never read flat (owner, 26 November 2026).
   node tools/audio/delivery.mjs <game> [--write]    prints counts; --write adds "emotion" and "speed" to voice-script.json / voice-lines.json
   Emotions are Cartesia's (content, neutral, excited, sad). Speed 0.85 to 1.1. A scene has a base; a line may be lifted or lowered by its words. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
const root = new URL("../../games/", import.meta.url).pathname;
const C = (speed = 1) => ({ emotion: "content", speed }), N = (speed = 1) => ({ emotion: "neutral", speed }), S = (speed = 0.9) => ({ emotion: "sad", speed }), X = (speed = 1.05) => ({ emotion: "excited", speed });
// base delivery per film (voice-script games); lines games use LINES below
const FILM = {
  "air-jamaica": { takeoff: C(1), landing: C(0.97), reveal: X(1.05), newflight: C(1.02), lastlanding: S(0.9) },
  hutchinson: { opening: N(0.93), towers: N(0.92), search: N(0.92), warrant: N(0.95), morning: S(0.9) },
  "morant-bay": { dry: S(0.92), walk: N(0.93), home: S(0.9), meeting: N(0.92), warrant: N(0.97), bay: N(0.95), riot: N(0.95), soldiers: N(0.93), burning: S(0.9), courts: S(0.88), dawn: S(0.9), today: C(0.95) },
  "rose-hall": { legend: N(0.9), arrive: C(0.97), aisle: S(0.93), pages: N(0.95) },
  selassie: { arrival: C(1) },
  "shark-papers": { dawn: C(0.97), catch: X(1.03), alongside: C(0.98), verdict: N(0.95) },
  windrush: { departure: S(0.93), arrival: C(0.98) },
};
const LINES = {
  kendal: C(1), eventide: C(0.95), melissa: C(0.97), nanny: N(0.93), tivoli: N(0.93), "bog-walk": N(0.95), garvey: C(0.97), "port-royal": C(0.97),
};
const BRIGHT = /!$|\bcheer|\bsea!|\bwe go\b/i;                       // exclamations: a lift
const HEAVY = /\b(died|dead|death|hanged|fire|falls in|roof|burn|smoke|sirens|orange|taken|lost|flower|quiet|brakes|whistle blasts|ringing fades|dark|mourning|remembrance|ruin|empty)\b/i;   // grave words: lower and slower
export function deliveryFor(game, film, text) {
  let d = (FILM[game] && FILM[game][film]) || LINES[game] || C(1);
  if (HEAVY.test(text) && d.emotion !== "sad") d = { emotion: game === "kendal" || game === "eventide" || game === "melissa" ? "sad" : d.emotion, speed: Math.min(d.speed, 0.92) };
  if (BRIGHT.test(text) && !HEAVY.test(text) && d.emotion !== "sad") d = { emotion: "excited", speed: Math.max(d.speed, 1.03) };
  return d;
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const game = process.argv[2], write = process.argv.includes("--write");
  const f1 = `${root}${game}/voice-script.json`, f2 = `${root}${game}/voice-lines.json`;
  const tally = {}; const note = (d) => { const k = d.emotion + " " + d.speed; tally[k] = (tally[k] || 0) + 1; };
  if (existsSync(f1)) { const j = JSON.parse(readFileSync(f1, "utf8")); for (const v of Object.values(j)) { const d = deliveryFor(game, v.film, v.text); Object.assign(v, d); note(d); } if (write) writeFileSync(f1, JSON.stringify(j, null, 1) + "\n"); }
  if (existsSync(f2)) { const j = JSON.parse(readFileSync(f2, "utf8")); for (const v of j) { const d = deliveryFor(game, null, v.text); Object.assign(v, d); note(d); } if (write) writeFileSync(f2, JSON.stringify(j, null, 1) + "\n"); }
  console.log(game, JSON.stringify(tally));
}
