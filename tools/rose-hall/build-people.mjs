/* Rebuild only this game's recipes with the current shared builder and packer.
   BPY_PYTHON=~/venv/bin/python3 runs the builder through the bpy module instead of a Blender binary (BLENDER_BIN, default "blender").
   A recipe with "crowd": true is a background body: it gets the raw inspection body (for ?test=cloth and seated women), a crowd copy and a
   phone copy, but no focus or light copy. Everyone else (anyone the player talks to) also gets the focus copy. */
import { spawnSync } from "node:child_process";
import {
  readFileSync,
  readdirSync,
  mkdirSync,
  writeFileSync,
  copyFileSync,
  rmSync,
  existsSync,
} from "node:fs";
import path from "node:path";
const out = path.resolve("build/rose-hall-people"),
  models = "games/rose-hall/site/models";
mkdirSync(out, { recursive: true });
mkdirSync(models, { recursive: true });
/* --repack (or REPACK=1): pack again from the bodies already built in build/rose-hall-people, with no Blender (after a change to tools/people/pack.mjs). */
const REPACK = process.argv.includes("--repack") || process.env.REPACK === "1";
const wanted = process.argv.slice(2).filter((a) => !a.startsWith("--")),
  recipes = readdirSync("tools/rose-hall/people").filter(
    (n) =>
      n.endsWith(".json") &&
      (!wanted.length || wanted.includes(n.slice(0, -5))),
  );
function pack(args) {
  const p = spawnSync(
    process.execPath,
    ["tools/people/pack.mjs", "--src", out, "--out", models, ...args],
    { stdio: "inherit" },
  );
  if (p.status !== 0) process.exit(p.status || 1);
}
for (const name of recipes) {
  const recipe = JSON.parse(
    readFileSync(`tools/rose-hall/people/${name}`, "utf8"),
  );
  const log = path.join(out, recipe.name + ".log"),
    script = path.resolve("tools/rose-hall/build_person.py"),
    bpy = process.env.BPY_PYTHON;
  const built = ["", "_crowd"].map((t) => path.join(out, recipe.name + t + ".glb"));
  if (REPACK && !built.every((f) => existsSync(f))) { console.error("--repack: no built body to pack for " + recipe.name + " (" + built.filter((f) => !existsSync(f)).join(", ") + "). Build it once with Blender first."); process.exit(1); }
  const r = REPACK ? { status: 0, stdout: "repacked from the built body, no Blender\n", stderr: "" } : spawnSync(
    bpy || process.env.BLENDER_BIN || "blender",
    bpy
      ? [script, "--", JSON.stringify(recipe)]
      : [
          "--background",
          "--python-exit-code",
          "1",
          "--python",
          script,
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
  const crowd = path.join(out, recipe.name + "_crowd.glb");
  if (recipe.crowd) {
    pack([recipe.name]);
    for (const old of ["_lo", "_focus"]) {
      const f = path.join(models, recipe.name + old + ".js");
      if (existsSync(f)) rmSync(f);
    }
  } else {
    pack([recipe.name]);
    copyFileSync(crowd, path.join(out, recipe.name + "_focus.glb"));
    pack(["--max", "32000", recipe.name + "_focus"]);
  }
  copyFileSync(crowd, path.join(out, recipe.name + "_phone.glb"));
  pack(["--max", "3200", recipe.name + "_phone"]);
  pack(["--max", "6200", recipe.name + "_crowd"]);
  console.log("BUILT", recipe.name);
}
