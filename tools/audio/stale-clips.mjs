/* Lists narrator clips not yet re-recorded with delivery: a clip is done when its file was last committed after the delivery table (commit 87970788) or is changed now: node tools/audio/stale-clips.mjs <game>
   Used while re-recording with delivery (owner, 26 November 2026): the clips still listed are the ones to record again. Prints "<index> <stem>". */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
const game = process.argv[2], root = new URL("../../", import.meta.url).pathname;
const since = +execSync("git log -1 --format=%ct 87970788", { cwd: root }).toString();
const changed = new Set(execSync("git status --porcelain", { cwd: root }).toString().split("\n").map((l) => l.slice(3)));
const fresh = (f) => { try { return +execSync(`git log -1 --format=%ct -- ${f}`, { cwd: root }).toString() > since; } catch { return false; } };
const keys = Object.keys(JSON.parse(readFileSync(`${root}games/${game}/voice-script.json`, "utf8")));
keys.forEach((k, i) => { const f = `games/${game}/site/voices/narrator-${k}.mp3`; if (!changed.has(f) && !fresh(f)) console.log(i, k); });
