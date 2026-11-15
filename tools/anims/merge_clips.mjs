// Put a few freshly retargeted clips into a full retarget, so a changed clip does not need the whole library retargeted again.
//   ANIMS_OUT=build/anims_few.glb ~/venv/bin/python3 tools/anims/retarget_clips.py few.json    # only the changed clips, in seconds
//   node tools/anims/merge_clips.mjs build/anims.glb build/anims_few.glb                         # replaces (or adds) them in build/anims.glb
//   node tools/anims/optimize_clips.mjs                                                          # then pack as usual
// Both files must come from retarget_clips.py (same rig, same bone names).
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
const [basePath, extraPath, outPath = basePath] = process.argv.slice(2);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const base = await io.read(basePath), extra = await io.read(extraPath), root = base.getRoot(), buf = root.listBuffers()[0];
const nodes = new Map(root.listNodes().map((n) => [n.getName(), n]));
for (const a of extra.getRoot().listAnimations()) {
  const old = root.listAnimations().find((x) => x.getName() === a.getName());
  if (old) { for (const c of old.listChannels()) c.dispose(); for (const s of old.listSamplers()) s.dispose(); old.dispose(); }
  const na = base.createAnimation(a.getName());
  for (const c of a.listChannels()) {
    const n = nodes.get(c.getTargetNode()?.getName()); if (!n) { console.warn('no bone', c.getTargetNode()?.getName()); continue; }
    const s = c.getSampler(), copy = (acc) => base.createAccessor().setType(acc.getType()).setArray(acc.getArray().slice()).setBuffer(buf);
    const ns = base.createAnimationSampler().setInput(copy(s.getInput())).setOutput(copy(s.getOutput())).setInterpolation(s.getInterpolation());
    na.addSampler(ns).addChannel(base.createAnimationChannel().setTargetNode(n).setTargetPath(c.getTargetPath()).setSampler(ns));
  }
  console.log((old ? 'replaced ' : 'added ') + a.getName());
}
await io.write(outPath, base);
