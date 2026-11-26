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
const out = path.resolve("build/xaymaca-people"),
  models = "games/xaymaca/site/models";
mkdirSync(out, { recursive: true });
mkdirSync(models, { recursive: true });
/* --repack (or REPACK=1): pack again from the bodies already built in build/xaymaca-people, with no Blender (after a change to tools/people/pack.mjs). */
const REPACK = process.argv.includes("--repack") || process.env.REPACK === "1";
const wanted = process.argv.slice(2).filter((a) => !a.startsWith("--"));
function pack(args) {
  const p = spawnSync(
    process.execPath,
    ["tools/people/pack.mjs", "--src", out, "--out", models, ...args],
    { stdio: "inherit" },
  );
  if (p.status !== 0) process.exit(p.status || 1);
}
/* "variants": ["lean", "wide"] in a recipe also builds <name>_b, <name>_c (and _d) with those faces and a slightly different build, as
   tools/people/rebuild.mjs does for the other games, so a crowd (the ten paddlers of a canoe) need not put one face side by side (engine/faces.js).
   Name a variant on the command line (xa_man_b) to build only that one. */
const all = [];
for (const file of readdirSync("tools/xaymaca/people").filter((n) => n.endsWith(".json"))) {
  const P = JSON.parse(readFileSync(`tools/xaymaca/people/${file}`, "utf8"));
  const { variants = [], ...base } = P;
  all.push(base);
  variants.forEach((entry, vi) => {   /* an entry is a face name, or [face, build] to set how far the build moves (default 1, -1, 0.4) */
    const [face, sg] = Array.isArray(entry) ? entry : [entry, [1, -1, 0.4][vi]];
    const V = JSON.parse(JSON.stringify(base));
    V.name = base.name + ["_b", "_c", "_d"][vi];
    V.face = face;
    V.crowd = true;
    V.body.weight = Math.max(0.2, Math.min(0.85, (V.body.weight ?? 0.5) + 0.07 * sg));
    V.body.age = Math.max(0.2, Math.min(0.9, (V.body.age ?? 0.4) + 0.05 * sg));
    V.body.height = Math.max(0.3, Math.min(0.7, (V.body.height ?? 0.5) - 0.03 * sg));
    if (V.garments.hairlen !== undefined) V.garments.hairlen = +(V.garments.hairlen * [1.15, 0.8, 1.05][vi]).toFixed(2);
    all.push(V);
  });
}
for (const recipe of all.filter((r) => !wanted.length || wanted.includes(r.name))) {
  const log = path.join(out, recipe.name + ".log"),
    script = path.resolve("tools/xaymaca/build_person.py"),
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
