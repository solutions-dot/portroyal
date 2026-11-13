import bpy, sys, json
# retarget each Mixamo clip onto our rig by copying WORLD bone rotations (so A-pose vs T-pose rest doesn't matter), then bake
clips=json.loads(open(sys.argv[-1]).read())
import os
bpy.ops.wm.open_mainfile(filepath=os.path.abspath('shared/rig/char.blend'))   # Abba's rig: every character shares this skeleton
ours=bpy.data.objects['Human.rig']
for pb in ours.pose.bones: pb.matrix_basis.identity()
ours.animation_data_create(); ours.animation_data.action=None
sc=bpy.context.scene; sc.render.fps=30
for name,path in clips.items():
    path=path if os.path.isabs(path) else os.path.abspath(os.path.join('shared/anim-sources',path))   # clips.json lists file names in shared/anim-sources
    before=set(bpy.data.objects)
    bpy.ops.import_scene.fbx(filepath=path,automatic_bone_orientation=False)
    new=[o for o in bpy.data.objects if o not in before]
    src=[o for o in new if o.type=='ARMATURE'][0]
    src.matrix_world=ours.matrix_world.copy()
    act=src.animation_data.action; f0,f1=int(act.frame_range[0]),int(act.frame_range[1])
    cons=[]
    for pb in ours.pose.bones:
        if pb.name not in src.pose.bones: continue
        c=pb.constraints.new('COPY_ROTATION'); c.target=src; c.subtarget=pb.name; c.target_space='WORLD'; c.owner_space='WORLD'; cons.append((pb,c))
        if 'Hips' in pb.name:
            c2=pb.constraints.new('COPY_LOCATION'); c2.target=src; c2.subtarget=pb.name; c2.target_space='WORLD'; c2.owner_space='WORLD'; cons.append((pb,c2))
    for o in bpy.data.objects: o.select_set(o==ours)
    bpy.context.view_layer.objects.active=ours; bpy.ops.object.mode_set(mode='POSE'); bpy.ops.pose.select_all(action='SELECT')
    bpy.ops.nla.bake(frame_start=f0,frame_end=f1,step=1,only_selected=False,visual_keying=True,clear_constraints=True,use_current_action=False,bake_types={'POSE'})
    bpy.ops.object.mode_set(mode='OBJECT')
    baked=ours.animation_data.action; baked.name=name; baked.use_fake_user=True
    ours.animation_data.action=None
    for pb in ours.pose.bones: pb.matrix_basis.identity()
    tr=ours.animation_data.nla_tracks.new(); tr.name=name; st=tr.strips.new(name,f0,baked)
    try:
        if baked.slots: st.action_slot=baked.slots[0]
    except Exception as e: print('SLOT',repr(e))
    for o in new: bpy.data.objects.remove(o)
    print('CLIP',name,f0,f1)
for o in bpy.data.objects: o.select_set(o==ours)
bpy.context.view_layer.objects.active=ours
r=bpy.ops.export_scene.gltf(filepath=os.path.abspath('build/anims.glb'),use_selection=True,export_skins=True,export_animations=True,export_animation_mode='NLA_TRACKS',export_frame_step=2,export_force_sampling=True,export_optimize_animation_size=True,export_def_bones=True)
print('EXPORT',r)
