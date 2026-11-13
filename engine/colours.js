import { Float32BufferAttribute } from 'three';

// Old Blender exports wrote linear colours into an sRGB byte layer. Undo only
// that second transfer, leaving the recipe colours, shading and alpha intact.
export const undoByteColourTransfer = (v) => v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
const corrected = new WeakSet();
export function repairLegacyVertexColours(gltf) {
  const scene = gltf.scene;
  if (scene.userData.vertexColorSpace === 'linear') return gltf;
  let character = false;
  scene.traverse((o) => { if (o.isSkinnedMesh) character = true; });
  if (!character) return gltf; // Scenery and textures already have correct colours.
  scene.traverse((o) => {
    const g = o.geometry, c = g && g.getAttribute('color');
    if (!c || corrected.has(g)) return;
    const values = new Float32Array(c.count * c.itemSize);
    for (let i = 0; i < c.count; i++) {
      values[i * c.itemSize] = undoByteColourTransfer(c.getX(i));
      values[i * c.itemSize + 1] = undoByteColourTransfer(c.getY(i));
      values[i * c.itemSize + 2] = undoByteColourTransfer(c.getZ(i));
      if (c.itemSize === 4) values[i * c.itemSize + 3] = c.getW(i);
    }
    g.setAttribute('color', new Float32BufferAttribute(values, c.itemSize));
    corrected.add(g);
  });
  scene.userData.vertexColorSpace = 'linear';
  return gltf;
}
