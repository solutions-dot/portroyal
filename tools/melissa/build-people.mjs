/* Build Hurricane Melissa's bodies with the shared builder (tools/garvey/era.py) and pack each as a full body and a light copy (_lo), as
   tools/melissa/people/README.md says. Every garment stays its own material, so games/melissa/src/cast.js can recolour it per person.
   BPY_PYTHON=/tmp/venv/bin/python3 MAKEHUMAN=/tmp/mh/makehuman node tools/melissa/build-people.mjs [names] */
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
const out = path.resolve("build/melissa-people"), models = "games/melissa/site/models";
mkdirSync(out, { recursive: true });
const wanted = process.argv.slice(2), py = process.env.BPY_PYTHON || "python3";
for (const n of readdirSync("tools/melissa/people").filter((n) => n.endsWith(".json") && (!wanted.length || wanted.includes(n.slice(0, -5))))) {
  const recipe = readFileSync(`tools/melissa/people/${n}`, "utf8"), name = JSON.parse(recipe).name;
  const r = spawnSync(py, [path.resolve("tools/garvey/era.py"), "--", JSON.stringify(JSON.parse(recipe))], { env: { ...process.env, NPC_OUT: out + "/" }, encoding: "utf8", maxBuffer: 16e6 });
  writeFileSync(path.join(out, name + ".log"), (r.stdout || "") + (r.stderr || ""));
  if (r.status !== 0) { console.error((r.stdout + r.stderr).slice(-4000)); process.exit(1); }
  const p = spawnSync(process.execPath, ["tools/people/pack.mjs", "--src", out, "--out", models, "--lo", name], { stdio: "inherit" });
  if (p.status !== 0) process.exit(1);
  console.log("BUILT", name);
}
