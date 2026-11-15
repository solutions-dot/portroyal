/* Rebuild only this game's recipes with the current shared builder and packer. */
import { spawnSync } from "node:child_process";
import {
  readFileSync,
  readdirSync,
  mkdirSync,
  writeFileSync,
  copyFileSync,
} from "node:fs";
import path from "node:path";
const root = process.cwd(),
  out = path.resolve("build/selassie-people");
mkdirSync(out, { recursive: true });
mkdirSync("games/selassie/site/models", { recursive: true });
const wanted = process.argv.slice(2),
  recipes = readdirSync("tools/selassie/people").filter(
    (n) =>
      n.endsWith(".json") &&
      (!wanted.length || wanted.includes(n.slice(0, -5))),
  );
for (const name of recipes) {
  const recipe = JSON.parse(
    readFileSync(`tools/selassie/people/${name}`, "utf8"),
  );
  const log = path.join(out, recipe.name + ".log");
  const r = spawnSync(
    process.env.BLENDER_BIN || "blender",
    [
      "--background",
      "--python-exit-code",
      "1",
      "--python",
      path.resolve("tools/selassie/build_person.py"),
      "--",
      JSON.stringify(recipe),
    ],
    {
      env: { ...process.env, NPC_OUT: out + "/" },
      encoding: "utf8",
      maxBuffer: 16e6,
    },
  );
  writeFileSync(log, (r.stdout || "") + (r.stderr || ""));
  if (r.status !== 0) {
    console.error(readFileSync(log, "utf8").slice(-6000));
    process.exit(r.status || 1);
  }
  const p = spawnSync(
    process.execPath,
    [
      "tools/people/pack.mjs",
      "--src",
      out,
      "--out",
      "games/selassie/site/models",
      "--lo",
      recipe.name,
    ],
    { stdio: "inherit" },
  );
  if (p.status !== 0) process.exit(p.status || 1);
  copyFileSync(
    path.join(out, recipe.name + "_crowd.glb"),
    path.join(out, recipe.name + "_focus.glb"),
  );
  const focus = spawnSync(
    process.execPath,
    [
      "tools/people/pack.mjs",
      "--src",
      out,
      "--out",
      "games/selassie/site/models",
      "--max",
      "32000",
      recipe.name + "_focus",
    ],
    { stdio: "inherit" },
  );
  if (focus.status !== 0) process.exit(focus.status || 1);
  copyFileSync(
    path.join(out, recipe.name + "_crowd.glb"),
    path.join(out, recipe.name + "_phone.glb"),
  );
  const mobile = spawnSync(
    process.execPath,
    [
      "tools/people/pack.mjs",
      "--src",
      out,
      "--out",
      "games/selassie/site/models",
      "--max",
      "3200",
      recipe.name + "_phone",
    ],
    { stdio: "inherit" },
  );
  if (mobile.status !== 0) process.exit(mobile.status || 1);
  const c = spawnSync(
    process.execPath,
    [
      "tools/people/pack.mjs",
      "--src",
      out,
      "--out",
      "games/selassie/site/models",
      "--max",
      "6200",
      recipe.name + "_crowd",
    ],
    { stdio: "inherit" },
  );
  if (c.status !== 0) process.exit(c.status || 1);
  console.log("BUILT", recipe.name);
}
