"""Game-only hair and uniform details, fitted to each recipe's actual surfaces."""
import bpy, bmesh, math, os
from mathutils import Vector
from mathutils.bvhtree import BVHTree
# Finishing weights are sampled in the bind pose, just like the shared builder.
rig.data.pose_position='REST';bpy.context.view_layer.update()
kind=P.get('kit')
changed=False
if P['name'] in ('sel_rastaelder66','sel_rastaman66','sel_emperor66','sel_planno66'):
    for name in ['Buttons','Placket']:
        o=bpy.data.objects.get(name)
        if o:bpy.data.objects.remove(o,do_unlink=True)
    changed=True
# Adina's blouse needs a little more room at the back of the shoulder.
if P['name']=='sel_adina66':
    shirt=PART['shirt']
    for v in shirt.data.vertices:
        if NECK-.10<v.co.z<NECK+.02 and abs(v.co.x)<SX*.8:
            v.co+=v.normal*.006
    changed=True
if kind:
    changed=True
    hy=J('Head').y
    from pathlib import Path
    exec(compile(Path('tools/selassie/imperial_face.py').read_text(),'imperial_face.py','exec'),globals())
    def sphere(name,loc,scale,material,bone='Head',surface=None):
        bpy.ops.mesh.primitive_uv_sphere_add(segments=12,ring_count=6,location=loc)
        o=bpy.context.object;o.name=name;o.scale=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
        o.data.materials.append(colmat(material))
        if surface:
            # Small uniform pieces follow the same nearby bones as the cloth.
            for g in surface.vertex_groups:o.vertex_groups.new(name=g.name)
            for v in o.data.vertices:
                p=o.matrix_world@v.co
                near=min(surface.data.vertices,key=lambda q:(q.co-p).length_squared)
                for g in near.groups:o.vertex_groups[g.group].add([v.index],g.weight,'REPLACE')
        else:
            group=o.vertex_groups.new(name='mixamorig:'+bone);group.add(list(range(len(o.data.vertices))),1.,'REPLACE')
        o.modifiers.new('Armature','ARMATURE').object=rig;o.parent=rig;paint(o);return o
    if kind=='locks':
        # Many separate locs from the scalp (tools/selassie/locs.py); a tam recipe gets its tam and a few locs below it further down.
        exec(compile(Path('tools/selassie/locs.py').read_text(),'locs.py','exec'),globals())
        # how many locs, how far the longest fall down the back (metres), the share that are grey, and how thick: each man his own
        LOCS={'sel_rastaelder66':(130,.46,.5,1.0),'sel_rastaman66':(140,.36,0,1.1),'sel_planno66':(120,.26,.1,1.15),'sel_levi66':(110,.22,0,.95)}
        if not P.get('tam'):
            n_,lb_,gr_,th_=LOCS.get(P['name'],(120,.3,0,1.0))
            make_locs(sum(map(ord,P['name'])),n_,lb_,P['colors']['Hair'],gr_,thick=th_)
            for o in [o for o in bpy.data.objects if o.name.startswith('Locks')]:o.vertex_groups.new(name='_locs').add(list(range(len(o.data.vertices))),1.,'REPLACE')      # marked, so the crowd copy below can take them out of the joined hair again
    if kind=='emperor':
        from pathlib import Path
        exec(compile(Path('tools/selassie/imperial_uniform.py').read_text(),'imperial_uniform.py','exec'),globals())
if P.get('tam'):
    # The builder's cap is replaced by a knitted tam fitted to this head and its short hair (tools/selassie/locs.py): a ribbed band,
    # a soft body slouching back, bands of red, gold and green. The locs are gathered inside it; a few fall from under its back edge.
    from pathlib import Path
    exec(compile(Path('tools/selassie/locs.py').read_text(),'locs.py','exec'),globals())
    for old in [o for o in bpy.data.objects if o.type=='MESH' and (o.name.startswith('Locks') or any(m.name=='Tam' for m in o.data.materials))]:
        if old in clothes:clothes.remove(old)
        bpy.data.objects.remove(old,do_unlink=True)
    make_tam(sum(map(ord,P['name'])))
    make_locs(sum(map(ord,P['name']))+7,8,.26,P['colors']['Hair'],0,roots=[(math.pi+o,-.3) for o in (-.9,-.6,-.3,0,.3,.6,.9,.15)])
    changed=True
if P.get('uniform')=='police':
    band=bpy.data.objects.get('CapBand')
    if band:
        ca=band.data.color_attributes.get('Col');bottom=min(v.co.z for v in band.data.vertices)
        for f in band.data.polygons:
            c=f.center if hasattr(f,'center') else sum((band.data.vertices[k].co for k in f.vertices),Vector())/len(f.vertices)
            cell=int((math.atan2(c.x,c.y-J('Head').y)+math.pi)*18/math.pi);row=int((c.z-bottom)/.012)
            col=[220,190,67] if (cell+row)%2 else [24,32,33]
            if c.z<bottom+.014:col=[24,32,33]
            for k in f.loop_indices:ca.data[k].color=(*srgb(col),1)
        changed=True
if P['name'] in ('sel_rastaman66','sel_rastatam66','sel_emperor66','sel_police66','sel_levi66','sel_rastawoman66'):
    limit=G.get('jacketsleeve',.96) if G.get('jacket') else G.get('coatsleeve',.96) if G.get('coat') else G.get('sleeve',.3)
    # the arm is kept a little way up inside the sleeve: cut away to just past the hem, the sleeve's end stood open and its far inside wall showed as a pale flap
    bm=bmesh.new();bm.from_mesh(h.data)
    hide=[]
    for f in bm.faces:
        c=f.calc_center_median();t=side_arm(c)
        if (t is not None and .08<t<limit-.035 and abs(c.x)>SX*.75) or (P['name'] in ('sel_emperor66','sel_police66') and HIP-.15<c.z<NECK-.025 and abs(c.x)<SX*1.08):hide.append(f)
    bmesh.ops.delete(bm,geom=hide,context='FACES');bm.to_mesh(h.data);bm.free();changed=True
if P.get('uniform')=='police':
    # The red tunic is the outer garment. Its hidden shirt is unnecessary.
    # The shirt under the tunic stays, in the tunic's own red: with it removed, bare skin showed in two gaps between the collar and the tunic at the back of the neck.
    shirt=bpy.data.objects.get('Shirt')
    if shirt:
        shirt.data.materials[0]=colmat('Coat');_c=shirt.data.color_attributes.get('Col')
        if _c:
            for c in _c.data:c.color=(*COL['Coat'],1)
    collar=bpy.data.objects.get('Collar')
    if collar:collar.data.materials[0]=colmat('Coat')
    coat=PART.get('coat');old=bpy.data.objects.get('Belt')
    if coat:
        if old:bpy.data.objects.remove(old,do_unlink=True)
        old=bpy.data.objects.get('Buckle')
        if old:bpy.data.objects.remove(old,do_unlink=True)
        bt=tree_of(coat);bm=bmesh.new();rows=[]
        for z in [HIP+.05,HIP+.11]:
            ring=[]
            for i in range(41):
                a=i/40*math.pi*2;c=Vector((0,J('Hips').y,z));d=Vector((math.sin(a),-math.cos(a),0));hit=bt.ray_cast(c,d)[0];r=(hit-c).length if hit else .17;ring.append(bm.verts.new(c+d*(r+.01)))
            rows.append(ring)
        quadstrip(bm,rows);o=soft('White belt',bm,'Belt',src=coat);paint(o)
if P.get('uniform')=='police':
    coat=PART['coat'];ct=tree_of(coat);bm=bmesh.new()
    for i in range(6):
        z=NECK-.075-i*.075
        if z<=HIP+.13:continue
        points=[]
        for k in range(13):
            angle=k/12*math.pi*2;x=.006*math.cos(angle);zz=z+.006*math.sin(angle)
            hit=ct.ray_cast(Vector((x,J('Head').y-.7,zz)),Vector((0,1,0)))[0]
            if hit:points.append(bm.verts.new(hit+Vector((0,-.010,0))))
        if len(points)>2:bm.faces.new(points)
    o=soft('Coat buttons',bm,'Coat',src=coat);paint(o)
    ca=o.data.color_attributes.get('Col')
    for c in ca.data:c.color=(*COL['Buttons'],1)
    # Paint the red piping onto the trousers themselves: no floating strip or
    # second deforming surface can cut into the black cloth.
    breeches=PART['breeches'];ca=breeches.data.color_attributes.get('Col')
    for face in breeches.data.polygons:
        for li in face.loop_indices:
            v=breeches.data.vertices[breeches.data.loops[li].vertex_index].co
            axis=leg_axis(v.z,1 if v.x>=0 else -1)
            if ANK+.03<v.z<HIP+.05 and abs(v.y-axis.y)<.012 and abs(v.x)>abs(axis.x):ca.data[li].color=(*COL['Coat'],1)
if P.get('uniform')=='police':
    # The skin at the back and sides of the neck just under the tunic's collar is painted in the tunic's red (divided by the 1.55 the game lightens skin by): where the
    # collar's seam opened in a pose, two patches of bare neck showed.
    _c=h.data.color_attributes.get('Col');_ny=J('Neck').y
    if _c:
        for face in h.data.polygons:
            for li in face.loop_indices:
                v=h.data.vertices[h.data.loops[li].vertex_index].co
                if NECK-.07<v.z<NECK+.014 and v.y>_ny-.02:_c.data[li].color=(COL['Coat'][0]/1.55,COL['Coat'][1]/1.55,COL['Coat'][2]/1.55,1)
        changed=True
# Hide only the covered armpit skin on these two fitted short-sleeve recipes.
# The bare arm and every finger remain intact.
if P['name'] in ('sel_levi66','sel_rastawoman66'):
    bm=bmesh.new();bm.from_mesh(h.data);covered=[]
    for f in bm.faces:
        c=f.calc_center_median();t=side_arm(c)
        if SH.z-.09<c.z<SH.z+.07 and SX*.55<abs(c.x)<SX*1.18 and (t is None or t<G.get('sleeve',.3)-.04):covered.append(f)
    bmesh.ops.delete(bm,geom=covered,context='FACES');bm.to_mesh(h.data);bm.free();changed=True
# Return to the common relaxed preview pose before exporting.
rig.data.pose_position='POSE';bpy.context.view_layer.update()
# Keep the complete close-up geometry but combine pieces of the same hair or
# regalia material into one skinned draw. Named weights survive Blender's join.
for material,label in [('Hair','Hair'),('Insignia','Regalia')]+([('Jacket','Jacket')] if kind=='emperor' else [])+[('Ribbon'+str(i),'Ribbon'+str(i)) for i in range(6)]:
    meshes=[o for o in bpy.context.scene.objects if o.type=='MESH' and len(o.data.materials)==1 and o.data.materials[0].name==material and o.name!='JacketSkirt']
    if len(meshes)>1:
        bpy.ops.object.select_all(action='DESELECT')
        for o in meshes:o.select_set(True)
        bpy.context.view_layer.objects.active=meshes[0];bpy.ops.object.join();meshes[0].name=label;changed=True
if changed:
    kwargs=dict(export_extras=True,filepath=os.path.join(OUT,P['name']+'.glb'),export_image_format='JPEG',export_apply=False,export_skins=True,export_animations=False,export_attributes=True)
    props=bpy.ops.export_scene.gltf.get_rna_type().properties
    if 'export_vertex_color_name' in props:kwargs.update(export_vertex_color='NAME',export_vertex_color_name='Col')
    else:kwargs['export_vertex_color']='ACTIVE'
    if 'export_rest_position_armature' in props:kwargs['export_rest_position_armature']=False
    bpy.ops.export_scene.gltf(**kwargs)
# Crowd copies are joined before packing, while every vertex still has its
# original named weights. One painted material plus the original eyes is two
# draw calls, instead of one call for each garment of every person.
# This story has no seated actors. Keep the shared alternate skirt in the raw
# inspection model, and leave it out of the joined standing render versions.
for o in list(bpy.context.scene.objects):
    if o.type=='MESH' and o.name.startswith('SkirtSeat'):bpy.data.objects.remove(o,do_unlink=True)
mesh_objects=[o for o in bpy.context.scene.objects if o.type=='MESH']
# Invisible garment geometry preserves the shared engine's clothing measurements
# for hand clearance. Joining the visible materials must not remove that API.
for o in mesh_objects:
    if o.name in ('Skirt','Breeches','Apron','JacketSkirt','CoatSkirt'):
        proxy=o.copy();proxy.data=o.data.copy();proxy.name=o.name+'Measure';proxy['measureOnly']=True;bpy.context.scene.collection.objects.link(proxy)
# Crowd and phone copies (16 November 2026, after the owner's note that the Rastafari men in the crowd had lost their faces):
# 1. Fewer, thicker, four-sided locs. Simplifying the full set to a tenth left shards and a bald crown.
if kind=='locks' and not P.get('tam') and any(o.type=='MESH' and '_locs' in o.vertex_groups for o in bpy.data.objects):
    for o in [o for o in bpy.data.objects if o.type=='MESH' and '_locs' in o.vertex_groups]:      # the full locs come out of the joined hair
        gi_=o.vertex_groups['_locs'].index;b_=bmesh.new();b_.from_mesh(o.data);d_=b_.verts.layers.deform.verify()
        bmesh.ops.delete(b_,geom=[v for v in b_.verts if v[d_].get(gi_,0)>.5],context='VERTS');b_.to_mesh(o.data);b_.free()
    rig.data.pose_position='REST';bpy.context.view_layer.update()
    n_,lb_,gr_,th_=LOCS.get(P['name'],(120,.3,0,1.0))
    make_locs(sum(map(ord,P['name'])),int(n_*.5),lb_,P['colors']['Hair'],gr_,thick=th_*1.5,light=True)
    rig.data.pose_position='POSE';bpy.context.view_layer.update()
mesh_objects=[o for o in bpy.context.scene.objects if o.type=='MESH' and not o.get('measureOnly')]      # the measuring copies stay apart, as before
# 2. The scalp under the hair is painted in the hair's colour: when a simplified cap of hair sinks, what shows is hair, not a bald patch.
_hair=[o for o in mesh_objects if o.data.materials and o.data.materials[0].name=='Hair' and not o.name.startswith('Locks')]
if _hair:
    _b=bmesh.new()
    for o in _hair:_b.from_mesh(o.data)
    _ht=BVHTree.FromBMesh(_b);_b.free();_cl=h.data.color_attributes.get('Col');_hc=srgb(P['colors']['Hair'])
    if _cl:
        for face in h.data.polygons:
            if h.data.materials[face.material_index].name!='Skin' or face.center.z<HEAD+.02:continue
            if _ht.ray_cast(face.center+face.normal*.0005,face.normal,.03)[0] is None:continue
            for loop in face.loop_indices:_cl.data[loop].color=(_hc[0]/1.55,_hc[1]/1.55,_hc[2]/1.55,1)      # the skin's colours are lightened by 1.55 just below
# 3. The eyes keep their texture coordinates: joined under another layer name they lost them, and every eye was drawn in one flat colour.
if h.data.uv_layers and eyes.data.uv_layers:eyes.data.uv_layers[0].name=h.data.uv_layers[0].name
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
