import bpy, os
# Crowd copies are joined before packing, while every vertex still has its
# original named weights. One painted material plus the original eyes is two
# draw calls, instead of one call for each garment of every person.
# Seated wearers can use the full model with its alternate skirt.
for o in list(bpy.context.scene.objects):
    if o.type=='MESH' and o.name.startswith('SkirtSeat'):bpy.data.objects.remove(o,do_unlink=True)
mesh_objects=[o for o in bpy.context.scene.objects if o.type=='MESH']
# Invisible garment geometry preserves the shared engine's clothing measurements
# for hand clearance. Joining the visible materials must not remove that API.
for o in mesh_objects:
    if o.name in ('Skirt','Breeches','Apron','JacketSkirt','CoatSkirt'):
        proxy=o.copy();proxy.data=o.data.copy();proxy.name=o.name+'Measure';proxy['measureOnly']=True;bpy.context.scene.collection.objects.link(proxy)
crowdmat=colmat('Crowd');COL['Crowd']=Vector((1,1,1))
for o in mesh_objects:
    colours=o.data.color_attributes.get('Col')
    if colours:
        for face in o.data.polygons:
            mat=o.data.materials[face.material_index]
            if mat.name=='Skin':
                for loop in face.loop_indices:
                    c=colours.data[loop].color
                    colours.data[loop].color=(min(1,c[0]*1.55),min(1,c[1]*1.55),min(1,c[2]*1.55),c[3])
    for i,mat in enumerate(o.data.materials):
        if not any(n.type=='TEX_IMAGE' for n in mat.node_tree.nodes):o.data.materials[i]=crowdmat
bpy.ops.object.select_all(action='DESELECT')
for o in mesh_objects:o.select_set(True)
bpy.context.view_layer.objects.active=h
bpy.ops.object.join();h.name='Crowd'
kwargs=dict(export_extras=True,filepath=os.path.join(OUT,P['name']+'_crowd.glb'),export_image_format='JPEG',export_apply=False,export_skins=True,export_animations=False,export_attributes=True)
props=bpy.ops.export_scene.gltf.get_rna_type().properties
if 'export_vertex_color_name' in props:kwargs.update(export_vertex_color='NAME',export_vertex_color_name='Col')
else:kwargs['export_vertex_color']='ACTIVE'
if 'export_rest_position_armature' in props:kwargs['export_rest_position_armature']=False
bpy.ops.export_scene.gltf(**kwargs)
