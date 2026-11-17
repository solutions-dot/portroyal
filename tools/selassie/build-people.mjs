/* Rebuild only this game's recipes with the current shared builder and packer. */
import { spawnSync } from "node:child_process";
import {
  readFileSync,
  readdirSync,
  mkdirSync,
  existsSync,
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
/* "variants": ["broad", "lean"] in a recipe builds more crowd bodies with those faces and a slightly different build and hair, <name>_b, <name>_c (and <name>_d for a third)
   (17 November 2026), so a crowd need not put one face side by side (engine/faces.js). Only the joined crowd and phone copies are kept: variants are
   background people. VARIANTS_ONLY=1 builds just the variants and leaves the recipe's own five copies as they are; VARIANTS_ONLY=new builds only variants that have no file yet. */
function buildOne(recipe) {
  const log = path.join(out, recipe.name + ".log");
  const r = spawnSync(
    process.env.BLENDER_BIN || "blender",
    ["--background", "--python-exit-code", "1", "--python", path.resolve("tools/selassie/build_person.py"), "--", JSON.stringify(recipe)],
    { env: { ...process.env, NPC_OUT: out + "/" }, encoding: "utf8", maxBuffer: 16e6 },
  );
  writeFileSync(log, (r.stdout || "") + (r.stderr || ""));
  if (r.status !== 0) {
    console.error(readFileSync(log, "utf8").slice(-6000));
    process.exit(r.status || 1);
  }
}
function packCopy(name, tier, max) {
  copyFileSync(path.join(out, name + "_crowd.glb"), path.join(out, name + tier + ".glb"));
  const p = spawnSync(process.execPath, ["tools/people/pack.mjs", "--src", out, "--out", "games/selassie/site/models", "--max", max, name + tier], { stdio: "inherit" });
  if (p.status !== 0) process.exit(p.status || 1);
}
function buildVariants(recipe) {
  for (const [vi, face] of (recipe.variants || []).entries()) {
    const V = JSON.parse(JSON.stringify(recipe)), sg = [1, -1, 0.4][vi];
    V.name = recipe.name + ["_b", "_c", "_d"][vi];
    if (process.env.VARIANTS_ONLY === "new" && existsSync(`games/selassie/site/models/${V.name}_crowd.js`)) continue; // only the variants not built yet
    V.face = face;
    delete V.variants;
    V.body.weight = Math.max(0.2, Math.min(0.85, (V.body.weight ?? 0.5) + 0.07 * sg));
    V.body.age = Math.max(0.15, Math.min(0.9, (V.body.age ?? 0.4) + 0.05 * sg));
    V.body.height = Math.max(0.3, Math.min(0.7, (V.body.height ?? 0.5) - 0.03 * sg + (vi === 2 ? 0.05 : 0)));
    if (V.garments.hairvol !== undefined) V.garments.hairvol = +(V.garments.hairvol * [1.5, 0.6, 1.2][vi]).toFixed(2);
    buildOne(V);
    packCopy(V.name, "_phone", "3200");
    const c = spawnSync(process.execPath, ["tools/people/pack.mjs", "--src", out, "--out", "games/selassie/site/models", "--max", "6200", V.name + "_crowd"], { stdio: "inherit" });
    if (c.status !== 0) process.exit(c.status || 1);
    console.log("BUILT", V.name, "(" + face + ")");
  }
}
for (const name of recipes) {
  const recipe = JSON.parse(
    readFileSync(`tools/selassie/people/${name}`, "utf8"),
  );
  if (process.env.VARIANTS_ONLY) {
    buildVariants(recipe);
    continue;
  }
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
  buildVariants(recipe);
}
