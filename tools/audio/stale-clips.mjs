/* Lists narrator clips not yet re-recorded since the last commit (their file is unchanged in git): node tools/audio/stale-clips.mjs <game>
   Used while re-recording with delivery (owner, 26 November 2026): the clips still listed are the ones to record again. Prints "<index> <stem>". */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
const game = process.argv[2], root = new URL("../../", import.meta.url).pathname;
const changed = new Set(execSync("git status --porcelain", { cwd: root }).toString().split("\n").map((l) => l.slice(3)));
const keys = Object.keys(JSON.parse(readFileSync(`${root}games/${game}/voice-script.json`, "utf8")));
keys.forEach((k, i) => { if (!changed.has(`games/${game}/site/voices/narrator-${k}.mp3`)) console.log(i, k); });
