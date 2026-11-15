import { build } from "esbuild";
import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
mkdirSync("build/selassie-tests", { recursive: true });
await build({
  entryPoints: ["games/selassie/tests/story.mjs"],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: "build/selassie-tests/story.mjs",
});
const r = spawnSync(
  process.execPath,
  ["--test", "build/selassie-tests/story.mjs"],
  { stdio: "inherit" },
);
process.exit(r.status ?? 1);
