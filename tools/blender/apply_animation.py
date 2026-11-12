import bpy, sys
OUT='/home/claude/port-royal-assets/'
bpy.ops.wm.open_mainfile(filepath='/tmp/char/char.blend')
ours=bpy.data.objects['Human.rig']
before=set(bpy.data.objects)
bpy.ops.import_scene.fbx(filepath=sys.argv[-1],automatic_bone_orientation=False)
new=[o for o in bpy.data.objects if o not in before]
arm=[o for o in new if o.type=='ARMATURE'][0]
act=arm.animation_data.action; act.name='Idle'
slot=arm.animation_data.action_slot if hasattr(arm.animation_data,'action_slot') else None
for o in new: bpy.data.objects.remove(o)
import re
ARM=re.compile(r'Shoulder|Arm|Hand')
for pb in ours.pose.bones:
    if not ARM.search(pb.name): pb.matrix_basis.identity()
removed=0
try:
    for layer in act.layers:
        for strip in layer.strips:
            for sl in act.slots:
                cb=strip.channelbag(sl)
                if cb:
                    for fc in [f for f in cb.fcurves if ARM.search(f.data_path)]: cb.fcurves.remove(fc); removed+=1
except Exception as e: print('FCERR',repr(e))
print('REMOVED',removed)
ours.animation_data_create(); ours.animation_data.action=act
try:
    if act.slots: ours.animation_data.action_slot=act.slots[0]
except Exception as e: print('SLOT',repr(e))
sc=bpy.context.scene; sc.frame_start=1; sc.frame_end=int(act.frame_range[1]); sc.render.fps=30
sc.frame_set(120); bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath='/tmp/char/idle.blend')
for o in bpy.data.objects: o.select_set(False)
r=bpy.ops.export_scene.gltf(filepath=OUT+'abba_animated.glb',export_image_format='JPEG',export_apply=False,export_vertex_color='NAME',export_vertex_color_name='Col',export_skins=True,export_animations=True,export_frame_step=2,export_force_sampling=True,export_optimize_animation_size=True)
print('EXPORT',r)
