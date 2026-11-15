/* Record the delivered recipe and packed geometry, including hidden measuring meshes. */
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder } from "meshoptimizer";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
await MeshoptDecoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.decoder": MeshoptDecoder });
const hash = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const rev = (p) =>
  execFileSync("git", ["-C", p, "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
const builderRoot = process.env.BUILDER_ROOT || process.cwd();
const report = {
  builderCommit: execFileSync(
    "git",
    [
      "-C",
      builderRoot,
      "log",
      "-1",
      "--format=%H",
      "--",
      "tools/garvey/era.py",
    ],
    { encoding: "utf8" },
  ).trim(),
  builderSHA256: hash(builderRoot + "/tools/garvey/era.py"),
  blender: "4.3.2",
  mpfbCommit: process.env.MPFB_SOURCE ? rev(process.env.MPFB_SOURCE) : null,
  makehumanCommit: process.env.MAKEHUMAN_SOURCE
    ? rev(process.env.MAKEHUMAN_SOURCE)
    : null,
  finishingSHA256: hash("tools/selassie/finish_person.py"),
  uniformSHA256: hash("tools/selassie/imperial_uniform.py"),
  faceSHA256: hash("tools/selassie/imperial_face.py"),
  models: [],
};
for (const f of readdirSync("games/selassie/site/models")
  .filter((n) => n.startsWith("sel_") && n.endsWith(".js"))
  .sort()) {
  const text = readFileSync("games/selassie/site/models/" + f, "utf8"),
    encoded = text.match(/="([A-Za-z0-9+/=]+)";/)?.[1];
  if (!encoded) throw new Error("No packed model " + f);
  const bin = Buffer.from(encoded, "base64"),
    doc = await io.readBinary(bin);
  let visibleTriangles = 0,
    measurementTriangles = 0,
    visibleDraws = 0;
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const hidden =
      node.getExtras().measureOnly || node.getName().startsWith("SkirtSeat");
    for (const p of mesh.listPrimitives()) {
      const n =
        (p.getIndices()?.getCount() || p.getAttribute("POSITION").getCount()) /
        3;
      if (hidden) measurementTriangles += n;
      else {
        visibleTriangles += n;
        visibleDraws++;
      }
    }
  }
  const name = f.replace(/(_lo|_focus|_crowd|_phone)?\.js$/, ""),
    recipe = "tools/selassie/people/" + name + ".json";
  report.models.push({
    file: f,
    bytes: bin.length,
    sha256: createHash("sha256").update(bin).digest("hex"),
    recipeSHA256: hash(recipe),
    visibleTriangles,
    measurementTriangles,
    visibleDraws,
  });
}
writeFileSync(
  "tools/selassie/asset-manifest.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(report.models.length + " packed models recorded");
