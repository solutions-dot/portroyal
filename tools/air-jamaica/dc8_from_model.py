# The DC-8's glass, frames, fin, tailplane, wings, engines and gear, taken from manilov.ap's "Dc8" (Sketchfab, CC BY 4.0;
# https://sketchfab.com/3d-models/dc8-27c049ded42942c6bac5a9ae5693984c), a stretched DC-8 (Series 61/63 shape) sent by the owner on 25 November 2026.
# Run: python3 tools/air-jamaica/dc8_from_model.py <in.glb> <out.glb>   (with Blender's Python: bpy)
# What it does: levels the model so the body runs along +x with the nose forward, scales it to the DC-8's real 3.73 m body, sets the wheels on the
# ground, drops its old colours, and takes out the two plugs the stretch added (in the 20 : 16.7 ratio of the real Series 61 stretch) so it is a DC-8-50 of 45.9 m. The parts are
# joined into a few meshes named for what they are; the game gives each its material, and paints the body and fin with the livery.
import bpy, sys, math, bmesh, mathutils
inp, out = sys.argv[-2], sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=inp)
objs = [o for o in bpy.data.objects if o.type == 'MESH']
W = {o.name: o.matrix_world.copy() for o in objs}   # every part's place in the world, read before anything is unparented
for o in objs:   # bake every transform, so each mesh's points are in the world frame
    o.data = o.data.copy(); o.data.transform(W[o.name])
for o in objs: o.parent = None
for o in objs: o.matrix_world = mathutils.Matrix.Identity(4)
mat = lambda o: (o.data.materials[0].name if o.data.materials else '')
fz = [v.co.copy() for o in objs if mat(o).startswith('fuzel') for v in o.data.vertices]
cx = sum(p.x for p in fz) / len(fz); cy = sum(p.y for p in fz) / len(fz)
sxx = sum((p.x - cx) ** 2 for p in fz); syy = sum((p.y - cy) ** 2 for p in fz); sxy = sum((p.x - cx) * (p.y - cy) for p in fz)
ang = 0.5 * math.atan2(2 * sxy, sxx - syy)          # the body's direction in plan
R = mathutils.Matrix.Rotation(-ang, 4, 'Z') @ mathutils.Matrix.Translation((-cx, -cy, 0))
for o in objs: o.data.transform(R)
glass = [v.co for o in objs if mat(o).startswith('Plane04') for v in o.data.vertices]
if sum(p.x for p in glass) / len(glass) < 0:        # nose toward +x
    for o in objs: o.data.transform(mathutils.Matrix.Rotation(math.pi, 4, 'Z'))
fz = [v.co for o in objs if mat(o).startswith('fuzel') for v in o.data.vertices]
x0_, x1_ = min(p.x for p in fz), max(p.x for p in fz)
mid = [p for p in fz if x0_ + (x1_ - x0_) * 0.3 < p.x < x0_ + (x1_ - x0_) * 0.7]
width = max(p.y for p in mid) - min(p.y for p in mid); k = 3.73 / width
yc = (max(p.y for p in mid) + min(p.y for p in mid)) / 2
for o in objs: o.data.transform(mathutils.Matrix.Scale(k, 4) @ mathutils.Matrix.Translation((0, -yc, 0)))
fz = [v.co for o in objs if mat(o).startswith('fuzel') for v in o.data.vertices]
tip = max(p.x for p in fz); tail = min(p.x for p in fz)
ground = min(v.co.z for o in objs if mat(o).startswith('Torus02') for v in o.data.vertices)
mid = [p for p in fz if tail + (tip - tail) * 0.3 < p.x < tail + (tip - tail) * 0.7]; zc = (max(p.z for p in mid) + min(p.z for p in mid)) / 2
for o in objs: o.data.transform(mathutils.Matrix.Translation((22.95 - tip, 0, -ground)))
L = tip - tail; extra = L - 45.95; fwd = extra * 20 / 36.7; aft = extra * 16.7 / 36.7
print('MODEL length', round(L, 2), 'remove', round(extra, 2), 'fwd', round(fwd, 2), 'aft', round(aft, 2), 'body centre height', round(zc - ground, 3), 'scale', round(k, 4))
# Take the stretch out by squeezing the two plain parallel lengths of the tube (the section there is the same all along, so nothing changes shape):
# ahead of the wing [F0, F1] loses fwd, behind it [A0, A1] loses aft. Every point of every part, the body's included, goes through the same map, so the
# windscreen, nose, wings and tail stay exactly where they sit on the model's own body (owner, 25 November 2026: "the windshield, nose and tail do not
# sit correctly": they had been put on the game's round tube, but a DC-8's body is taller than it is wide).
F0, F1, A0, A1 = 3.6, 16.2, -16.5, -12.5
def g(x):
    if x >= F1: return x
    if x >= F0: return F1 - (F1 - x) * (F1 - F0 - fwd) / (F1 - F0)
    if x >= A1: return x + fwd
    if x >= A0: return A1 + fwd - (A1 - x) * (A1 - A0 - aft) / (A1 - A0)
    return x + fwd + aft
cats = {}
for o in objs:
    m = mat(o)
    if not len(o.data.vertices): continue
    for v in o.data.vertices: v.co.x = g(v.co.x)
    vs = [v.co for v in o.data.vertices]
    c = sum(vs, mathutils.Vector()) / len(vs)
    if m.startswith('fuzel'): kind = 'body'
    elif m.startswith('Plane04'): kind = 'glass'
    elif m.startswith('Object03'): kind = 'frame'
    elif m.startswith('Torus02'): kind = 'tyre'
    elif c.x < -12 and (max(v.y for v in vs) - min(v.y for v in vs)) < 1.6 and max(v.z for v in vs) > zc - ground + 3.5: kind = 'fin'
    elif -12 <= c.x <= 12 and (max(v.y for v in vs) - min(v.y for v in vs)) > 8: kind = 'wingskin'
    elif c.x < -12: kind = 'tailskin'
    else: kind = 'metal'
    cats.setdefault(kind, []).append(o)
for kind, os_ in cats.items():
    bpy.ops.object.select_all(action='DESELECT')
    for o in os_: o.select_set(True)
    bpy.context.view_layer.objects.active = os_[0]
    if len(os_) > 1: bpy.ops.object.join()
    j = bpy.context.view_layer.objects.active; j.name = kind; j.data.name = kind
    j.data.materials.clear(); m = bpy.data.materials.new(kind); j.data.materials.append(m)
    for l in list(j.data.uv_layers): j.data.uv_layers.remove(l)
    vs = [v.co for v in j.data.vertices]
    print('PART', kind, len(j.data.polygons), 'x', round(min(v.x for v in vs), 2), round(max(v.x for v in vs), 2), 'z', round(min(v.z for v in vs), 2), round(max(v.z for v in vs), 2))
for o in list(bpy.data.objects):
    if o.type != 'MESH': bpy.data.objects.remove(o)
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_materials='PLACEHOLDER', export_texcoords=False, export_yup=True)
