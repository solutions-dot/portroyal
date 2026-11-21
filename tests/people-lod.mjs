import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const models = [
  ['tivoli', 'soldier2010_lo', 'Skin'],
  ['tivoli', 'police2010_lo', 'Skin'],
  ['eventide', 'boy_lo', 'Skin'],
  ['selassie', 'sel_boy66_phone', 'Crowd'],
  ['windrush', 'wr_man18_phone', 'Crowd'],
];

for (const [game, model, skin] of models) {
  test(`${game} ${model} keeps a detailed head and textured eyes`, () => {
    const js = readFileSync(`games/${game}/site/models/${model}.js`, 'utf8');
    const glb = Buffer.from(js.match(/="([A-Za-z0-9+/=]+)";/)?.[1] || '', 'base64');
    assert.equal(glb.toString('ascii', 0, 4), 'glTF');
    const asset = JSON.parse(glb.toString('utf8', 20, 20 + glb.readUInt32LE(12)));
    const primitives = asset.meshes.flatMap((mesh) => mesh.primitives);
    const body = primitives.filter((part) => asset.materials[part.material].name === skin);
    const bounds = body.map((part) => asset.accessors[part.attributes.POSITION]);
    const bottom = Math.min(...bounds.map((part) => part.min[1]));
    const top = Math.max(...bounds.map((part) => part.max[1]));
    assert.ok(body.some((part, i) =>
      bounds[i].min[1] > bottom + (top - bottom) * 0.8 &&
      asset.accessors[part.indices].count / 3 >= 1000
    ), 'head needs its own geometry above the neck');
    const eyes = primitives.find((part) => asset.materials[part.material].name === 'Human.low-poly');
    assert.ok(eyes && eyes.attributes.TEXCOORD_0 !== undefined);
    assert.ok(asset.materials[eyes.material].pbrMetallicRoughness.baseColorTexture);
  });
}
