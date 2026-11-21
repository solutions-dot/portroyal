# Try a garment on: fit MakeHuman garments (.mhclo) to a body and write a .glb to look at, with no skeleton, hair or game clothes.
#   python3 tools/wardrobe/tryon.py '<json>'
# json: {"out": "build/wardrobe/x.glb", "body": {macros}, "targets": {...}, "upscale": 1.26, "garments": ["path/to/a.mhclo", ...], "hide": true}
# "hide": true removes the skin each garment says it covers (its delete group), as the game build does. Used by tools/wardrobe/catalogue.mjs.
import bpy, sys, json, os
P = json.loads(sys.argv[-1])
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.preferences.addon_enable(module='bl_ext.user_default.mpfb')
from bl_ext.user_default.mpfb.services.humanservice import HumanService
from bl_ext.user_default.mpfb.services.targetservice import TargetService
from bl_ext.user_default.mpfb.entities.objectproperties import HumanObjectProperties
h = HumanService.create_human()
for k, v in P['body'].items(): HumanObjectProperties.set_value(k, v, entity_reference=h)
TargetService.reapply_macro_details(h)
for n, w in (P.get('targets') or {}).items():
    for nn in ([n.replace('lr-', 'l-'), n.replace('lr-', 'r-')] if n.startswith('lr-') else [n]):
        TargetService.load_target(h, TargetService.target_full_path(nn), weight=w, name=nn)
with bpy.context.temp_override(object=h, active_object=h, selected_objects=[h]): bpy.ops.object.shape_key_remove(all=True, apply_mix=True)
COL = [(0.85, 0.83, 0.78), (0.20, 0.20, 0.24), (0.45, 0.30, 0.25), (0.35, 0.38, 0.45), (0.5, 0.2, 0.2), (0.6, 0.6, 0.4)]
def mat(name, rgb):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes.get('Principled BSDF'); b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Roughness'].default_value = 0.9; return m
objs = []
for i, g in enumerate(P.get('garments', [])):
    o = HumanService.add_mhclo_asset(os.path.abspath(g), h, asset_type='Clothes', subdiv_levels=0)
    keep_tex = P.get('textured')
    if not keep_tex: o.data.materials.clear(); o.data.materials.append(mat('G%d' % i, COL[i % len(COL)]))
    objs.append(o); print('FITTED', os.path.basename(g), len(o.data.vertices), 'points', len(o.data.polygons), 'faces')
for o in [h] + objs:
    for m in list(o.modifiers):
        if m.type == 'MASK' and not P.get('hide'): o.modifiers.remove(m)
        elif m.type == 'MASK':
            with bpy.context.temp_override(object=o, active_object=o, selected_objects=[o]): bpy.ops.object.modifier_apply(modifier=m.name)
        elif m.type != 'ARMATURE': o.modifiers.remove(m)
# the body: only the skin (the helper shapes MakeHuman carries are left out)
import bmesh
bm = bmesh.new(); bm.from_mesh(h.data); dl = bm.verts.layers.deform.verify(); gi = h.vertex_groups['body'].index
bmesh.ops.delete(bm, geom=[v for v in bm.verts if v[dl].get(gi, 0) <= 0], context='VERTS'); bm.to_mesh(h.data); bm.free()
h.data.materials.clear(); h.data.materials.append(mat('Skin', (0.42, 0.25, 0.17)))
if P.get('upscale'):
    for o in [h] + objs:
        for v in o.data.vertices: v.co *= P['upscale']
for o in [h] + objs:
    for p in o.data.polygons: p.use_smooth = True
os.makedirs(os.path.dirname(os.path.abspath(P['out'])), exist_ok=True)
for o in bpy.data.objects: o.select_set(o in [h] + objs)
bpy.ops.export_scene.gltf(filepath=os.path.abspath(P['out']), use_selection=True, export_apply=True, export_yup=True, export_materials='EXPORT', export_image_format='AUTO' if P.get('textured') else 'NONE')
print('WROTE', P['out'])
