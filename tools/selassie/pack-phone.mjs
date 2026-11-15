/* Repack existing joined sources without rerunning Blender. */
import { copyFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
const dir = "build/selassie-people";
for (const f of readdirSync(dir).filter((f) => f.endsWith("_crowd.glb"))) {
  const name = f.slice(0, -10);
  copyFileSync(`${dir}/${f}`, `${dir}/${name}_phone.glb`);
  const p = spawnSync(
    process.execPath,
    [
      "tools/people/pack.mjs",
      "--src",
      dir,
      "--out",
      "games/selassie/site/models",
      "--max",
      "3200",
      name + "_phone",
    ],
    { stdio: "inherit" },
  );
  if (p.status) process.exit(p.status);
}
