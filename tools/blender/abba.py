import bpy, bmesh, math, sys
from mathutils import Vector, noise
OUT='/home/claude/port-royal-assets/'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.preferences.addon_enable(module='bl_ext.user_default.mpfb')
from bl_ext.user_default.mpfb.services.humanservice import HumanService
from bl_ext.user_default.mpfb.services.targetservice import TargetService
from bl_ext.user_default.mpfb.entities.objectproperties import HumanObjectProperties
h=HumanService.create_human()
for k,v in dict(gender=0.0,age=0.5,muscle=0.45,weight=0.5,height=0.5,proportions=0.6,african=0.5,caucasian=0.5,asian=0.0,cupsize=0.45,firmness=0.6).items():
    HumanObjectProperties.set_value(k,v,entity_reference=h)
TargetService.reapply_macro_details(h)
def ov(o): return bpy.context.temp_override(object=o,active_object=o,selected_objects=[o],selected_editable_objects=[o])
with ov(h): bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
try:
    eyes=HumanService.add_mhclo_asset('/tmp/mh/makehuman/data/eyes/low-poly/low-poly.mhclo',h,asset_type='Eyes',subdiv_levels=0); print('EYES',eyes.name)
except Exception as e: print('EYEERR',repr(e)); eyes=None
rig=HumanService.add_builtin_rig(h,'mixamo')
for m in list(h.modifiers):
    if m.type=='MASK': h.modifiers.remove(m)
if eyes:                                   # eyes must ride on the head bone, or they are left behind when she moves
    for m in list(eyes.modifiers): eyes.modifiers.remove(m)
    for g in list(eyes.vertex_groups): eyes.vertex_groups.remove(g)
    mw=eyes.matrix_world.copy(); eyes.parent=rig; eyes.matrix_world=mw
    vg=eyes.vertex_groups.new(name='mixamorig:Head'); vg.add(list(range(len(eyes.data.vertices))),1.0,'REPLACE')
    md=eyes.modifiers.new('Armature','ARMATURE'); md.object=rig

GI={g.name:g.index for g in h.vertex_groups}

def colmat(name,rough=0.9):
    m=bpy.data.materials.new(name); nt=m.node_tree
    if nt is None: m.use_nodes=True; nt=m.node_tree
    b=next(n for n in nt.nodes if n.type=='BSDF_PRINCIPLED'); b.inputs['Roughness'].default_value=rough
    vc=nt.nodes.new('ShaderNodeVertexColor'); vc.layer_name='Col'; nt.links.new(vc.outputs['Color'],b.inputs['Base Color']); return m
SKIN=colmat('Skin',0.68); LINEN=colmat('Linen',0.95); WOOL=colmat('Wool',0.95); BODICE=colmat('Bodice',0.9); LEATHER=colmat('Leather',0.7)
def srgb(r,g,b): 
    f=lambda c:(c/255)**2.2
    return Vector((f(r),f(g),f(b)))
C=dict(Skin=srgb(170,116,82),Linen=srgb(214,205,184),Wool=srgb(96,74,58),Bodice=srgb(52,62,84),Leather=srgb(48,34,26))

def piece(name,group,keep,offset=0.0,mats=None,shape=None,cuts=(),extra=None,pre=None,clean=True):
    o=h.copy(); o.data=h.data.copy(); o.name=name; bpy.context.scene.collection.objects.link(o)
    bm=bmesh.new(); bm.from_mesh(o.data); dl=bm.verts.layers.deform.verify(); gi=GI[group]
    dead=[f for f in bm.faces if not (all(v[dl].get(gi,0)>0 for v in f.verts) and keep(f))]
    bmesh.ops.delete(bm,geom=dead,context='FACES')
    if cuts: bmesh.ops.triangulate(bm,faces=bm.faces[:])
    for co,no,flt in cuts:
        fs=[f for f in bm.faces if flt is None or flt(f.calc_center_median())]
        geom=list({v for f in fs for v in f.verts})+list({e for f in fs for e in f.edges})+fs
        bmesh.ops.bisect_plane(bm,geom=geom,plane_co=co,plane_no=no,clear_outer=True)
    if cuts:
        bmesh.ops.remove_doubles(bm,verts=bm.verts[:],dist=0.001); bmesh.ops.dissolve_degenerate(bm,edges=bm.edges[:],dist=0.001)
    if pre: pre(bm)
    bmesh.ops.recalc_face_normals(bm,faces=bm.faces[:]); bm.normal_update()
    if shape: 
        for v in bm.verts: shape(v)
        bm.normal_update()
    if callable(offset):
        for v in bm.verts: v.co+=v.normal*offset(v.co)
    elif offset:
        for v in bm.verts: v.co+=v.normal*offset
    if extra: extra(bm)
    if clean:
        bmesh.ops.triangulate(bm,faces=[f for f in bm.faces if len(f.verts)>4])
        bmesh.ops.dissolve_degenerate(bm,edges=bm.edges[:],dist=0.0008); bmesh.ops.recalc_face_normals(bm,faces=bm.faces[:])
    bm.to_mesh(o.data); bm.free()
    o.data.materials.clear()
    for m in mats: o.data.materials.append(m)
    return o
cz=lambda f:f.calc_center_median()
# shift (linen) + bodice (wool stays) from the tights helper
def top_keep(f):
    c=cz(f); return 0.90<c.z and abs(c.x)<0.40
arm=lambda c:abs(c.x)>0.20
tc=[((0,0,0.958),(0,0,-1),None),((0,-0.1,1.335),Vector((0,-0.345,0.94)),None),
    ((0.30,0,1.145),(0.673,0,-0.74),arm),((-0.30,0,1.145),(-0.673,0,-0.74),arm),
    ((0,0,1.268),(0,0,1),lambda c:False),((0,0,1.268),(0,0,-1),lambda c:False)]
top=piece('ShiftAndBodice','helper-tights',top_keep,offset=lambda c:0.007 if abs(c.x)<0.175 else 0.016,mats=[LINEN,BODICE],cuts=tc[:4],
          extra=lambda bm:[bmesh.ops.bisect_plane(bm,geom=bm.verts[:]+bm.edges[:]+bm.faces[:],plane_co=co,plane_no=no) for co,no in (((0,0,1.268),(0,0,1)),((0.176,0,0),(1,0,0)),((-0.176,0,0),(1,0,0)))])
for p in top.data.polygons:
    c=p.center; p.material_index=1 if (abs(c.x)<0.176 and c.z<1.268) else 0
# skirt with added fullness and folds
ZT,ZB=0.984,0.123
def full(v):
    t=max(0,(ZT-v.co.z)/(ZT-ZB)); a=math.atan2(v.co.y+0.02,v.co.x)
    s=(1+0.66*t*t+0.12*t)*(1+0.06*t*math.sin(a*16)+0.03*t*math.sin(a*7+1))
    v.co.x*=s; v.co.y=(v.co.y+0.02)*s-0.02
    if v.co.y>0: v.co.y*=1+0.45*t*t          # extra cloth at the back so the trailing leg stays covered
    v.co.z=ZT-(ZT-v.co.z)*1.03
skirt=piece('Skirt','helper-skirt',lambda f:True,offset=0.004,mats=[WOOL],shape=full)
from mathutils.bvhtree import BVHTree
def make_apron():
    bs=bmesh.new(); bs.from_mesh(skirt.data); tree=BVHTree.FromBMesh(bs)
    me=bpy.data.meshes.new('Apron'); bm=bmesh.new(); nu,nv=12,24; rows=[]; ZA,ZE=0.972,0.36
    for jv in range(nv+1):
        t=jv/nv; z=ZA-t*(ZA-ZE); hw=0.15+0.06*t; row=[]; last=-0.15
        for iu in range(nu+1):
            x=-hw+2*hw*iu/nu; hit=tree.ray_cast(Vector((x,-1.0,z)),Vector((0,1,0)))[0]
            y=(hit.y if hit else last); last=y
            row.append(bm.verts.new((x,y-0.014-0.004*math.sin(iu*1.3+jv*0.4)*t,z)))
        rows.append(row)
    for jv in range(nv):
        for iu in range(nu): bm.faces.new((rows[jv][iu],rows[jv+1][iu],rows[jv+1][iu+1],rows[jv][iu+1]))
    bmesh.ops.recalc_face_normals(bm,faces=bm.faces)
    if sum((f.normal.y for f in bm.faces))>0: bmesh.ops.reverse_faces(bm,faces=bm.faces)
    bm.to_mesh(me); bm.free(); bs.free()
    o=bpy.data.objects.new('Apron',me); bpy.context.scene.collection.objects.link(o); me.materials.append(LINEN)
    for g in h.vertex_groups: o.vertex_groups.new(name=g.name)
    o.parent=rig; m=o.modifiers.new('Armature','ARMATURE'); m.object=rig
    return o
apron=make_apron()
shoes=piece('Shoes','helper-tights',lambda f:cz(f).z<0.16,offset=0.005,mats=[LEATHER],cuts=[((0,0,0.105),(0,0,1),None)])
from mathutils import Matrix
def knot(bm):
    back=[v for v in bm.verts if abs(v.co.x)<0.03 and v.co.y>0.0]
    zmin=min(v.co.z for v in back); a=max((v for v in back if v.co.z<zmin+0.035),key=lambda v:v.co.y).co.copy()
    c=a+Vector((0,0.010,0.016))                      # sits on the cloth at the nape, slightly sunk in
    for off,sc in (((0,0,0),(1.2,0.7,0.85)),((0.02,0.004,-0.042),(0.5,0.38,1.15)),((-0.02,0.004,-0.042),(0.5,0.38,1.15))):
        bmesh.ops.create_icosphere(bm,subdivisions=2,radius=0.034,matrix=Matrix.Translation(c+Vector(off))@Matrix.Diagonal((*sc,1)))
WA=Vector((0,-0.125,1.588)); WN=Vector((0,-0.133,-0.215)).normalized()
def wrap_off(c):
    d=-((c-WA).dot(WN)); base=0.015+0.014*max(0,min(1,(c.z-1.55)/0.07)); a=math.atan2(c.y,c.x)
    band=0.009*max(0,1-d/0.03)**0.5                                   # rolled band along the brow and nape
    groove=-0.005*math.exp(-((d-0.038)/0.008)**2)
    folds=0.004*math.sin(d*150+a*2.0)*min(1,max(0,(d-0.045)/0.03))+0.002*math.sin(a*7+d*60)   # wound layers of cloth
    return 0.002+(base+band+groove+folds)*min(1.0,max(0.0,d/0.009))**0.6      # the edge tucks back onto the skin
wrap=piece('HeadWrap','body',lambda f:cz(f).z>1.40,offset=wrap_off,mats=[LINEN],cuts=[(WA,WN,None)],extra=knot,
           pre=lambda bm:bmesh.ops.subdivide_edges(bm,edges=bm.edges[:],cuts=1,use_grid_fill=True,smooth=0.3))
clothes=[top,skirt,apron,shoes,wrap]
for o in clothes:
    md=o.modifiers.new('wt','DATA_TRANSFER'); md.object=h; md.use_vert_data=True; md.data_types_verts={'VGROUP_WEIGHTS'}
    md.vert_mapping='POLYINTERP_NEAREST'; md.layers_vgroup_select_src='ALL'; md.layers_vgroup_select_dst='NAME'
    try:
        with ov(o): bpy.ops.object.modifier_move_to_index(modifier='wt',index=0); bpy.ops.object.modifier_apply(modifier='wt')
    except Exception as e: print('WT',o.name,repr(e))
# skirt and apron: one cloth shared by both legs, so it drapes between them instead of splitting
def sstep(a,b,x):
    t=max(0.0,min(1.0,(x-a)/(b-a))); return t*t*(3-2*t)
def skirt_weights(o,amount=0.85):
    B={k:o.vertex_groups['mixamorig:'+k] for k in ('Hips','LeftUpLeg','LeftLeg','RightUpLeg','RightLeg')}
    idx=list(range(len(o.data.vertices)))
    for g in o.vertex_groups:
        if g.name.startswith('mixamorig:'): g.remove(idx)
    for v in o.data.vertices:
        z=v.co.z; t=max(0.0,min(1.0,(0.984-z)/(0.984-0.123)))
        leg=amount*sstep(0.10,0.60,t)                       # the waist stays with the hips; the hem follows the legs
        left=sstep(-1.0,1.0,v.co.x/(0.09+0.20*t))           # cloth between the legs is shared half and half
        knee=0.55*sstep(0.52,0.38,z)                        # below the knee, some pull from the shin
        w={'Hips':1-leg,'LeftUpLeg':leg*left*(1-knee),'LeftLeg':leg*left*knee,'RightUpLeg':leg*(1-left)*(1-knee),'RightLeg':leg*(1-left)*knee}
        for k,val in w.items():
            if val>0.001: B[k].add([v.index],val,'REPLACE')
skirt_weights(skirt); skirt_weights(apron)
# body: drop helpers and whatever the clothes hide
bm=bmesh.new(); bm.from_mesh(h.data); dl=bm.verts.layers.deform.verify(); gi=GI['body']
def hidden(c): return (0.19<c.z<0.965 and abs(c.x)<0.33) or (0.965<=c.z<1.25 and abs(c.x)<0.165) or c.z<0.085
dead=[f for f in bm.faces if not all(v[dl].get(gi,0)>0 for v in f.verts) or hidden(cz(f))]
bmesh.ops.delete(bm,geom=dead,context='FACES'); bm.to_mesh(h.data); bm.free()
h.data.materials.clear(); h.data.materials.append(SKIN); h.name='Body'
# colour everything through vertex colours
def paint(o):
    me=o.data; bm=bmesh.new(); bm.from_mesh(me); cl=bm.loops.layers.float_color.new('Col')
    for f in bm.faces:
        base=C[me.materials[f.material_index].name]
        for l in f.loops:
            p=l.vert.co; k=1.0
            if o is h:
                col=base.copy()
                lip=max(0,1-((p.x/0.027)**2+((p.z-LIPZ)/0.011)**2)) if p.y<-0.112 else 0
                col=col.lerp(srgb(158,66,62),min(1,lip*1.2))
                for sx in (-1,1):
                    bx=(p.x-sx*0.033)/0.022; bz=(p.z-BROWZ-0.003*(1-abs(bx)))/0.0038
                    br=max(0,1-(bx*bx+bz*bz)) if p.y<-0.095 else 0
                    col=col.lerp(srgb(30,20,16),min(1,br*1.6))
                k=0.94+noise.noise(p*9)*0.06
            else:
                col=base.copy(); k=0.9+noise.noise(p*14)*0.1+noise.noise(p*3)*0.08
                if o in (skirt,apron) and p.z<0.4: k*=0.6+p.z      # dust and wet at the hem
                if o is shoes: k*=0.85
                if o is wrap:
                    dd=-((p-WA).dot(WN)); k*=0.86+0.14*(0.5+0.5*math.sin(dd*150+math.atan2(p.y,p.x)*2.0)) if dd>0.045 else (0.8 if 0.03<dd<=0.045 else 1.0)
            l[cl]=(col.x*k,col.y*k,col.z*k,1)
    bm.to_mesh(me); bm.free()
    ca=me.color_attributes; ca.active_color=ca['Col']; ca.render_color_index=list(ca.keys()).index('Col')
    for p in me.polygons: p.use_smooth=True
LIPZ=float(sys.argv[-2]); BROWZ=float(sys.argv[-1])
for o in clothes+[h]: paint(o)
if eyes:
    for m in eyes.data.materials:
        for n in m.node_tree.nodes:
            if n.type=='TEX_IMAGE' and n.image: n.image.filepath='/tmp/char/eye.png'; n.image.reload()
            if n.type=='BSDF_PRINCIPLED': n.inputs['Roughness'].default_value=0.2
tris=sum(len(p.vertices)-2 for o in bpy.data.objects if o.type=='MESH' for p in o.data.polygons); print('TRIS',tris)
print('OBJ',[(o.name,o.parent.name if o.parent else None,[m.type for m in o.modifiers]) for o in bpy.data.objects])
try:
    bpy.ops.export_scene.fbx(filepath=OUT+'abba_for_mixamo.fbx',object_types={'ARMATURE','MESH'},add_leaf_bones=False,path_mode='COPY',embed_textures=True,colors_type='SRGB',mesh_smooth_type='FACE',bake_anim=False)
    print('FBX ok')
except Exception as e: print('FBXERR',repr(e))
bpy.context.scene['vertexColorSpace'] = 'linear'
bpy.ops.export_scene.gltf(export_extras=True,filepath=OUT+'lead_character_apose.glb',export_image_format='JPEG',export_apply=False,export_vertex_color='NAME',export_vertex_color_name='Col',export_skins=True)
from mathutils import Matrix
def aim(n,t):
    pb=rig.pose.bones[n]; bpy.context.view_layer.update(); M=pb.matrix.copy()
    q=(M.to_3x3()@Vector((0,1,0))).normalized().rotation_difference(Vector(t).normalized()); hd=M.to_translation()
    pb.matrix=Matrix.Translation(hd)@q.to_matrix().to_4x4()@Matrix.Translation(-hd)@M; bpy.context.view_layer.update()
for side,sx in (('Left',1),('Right',-1)):
    aim('mixamorig:%sArm'%side,(sx*0.27,0.03,-1)); aim('mixamorig:%sForeArm'%side,(sx*0.08,-0.42,-1)); aim('mixamorig:%sHand'%side,(sx*0.0,-0.25,-1))
    for f in ('Index','Middle','Ring','Pinky'):
        pbs=[rig.pose.bones['mixamorig:%sHand%s%d'%(side,f,i)] for i in (1,2,3)]
        bpy.context.view_layer.update()
        d=[(p.matrix.to_3x3()@Vector((0,1,0))).normalized() for p in pbs]
        ax=d[0].cross(d[2])                      # the fingers already bend slightly toward the palm; keep bending the same way
        print('BEND',side,f,round(math.degrees(d[0].angle(d[2])),1),[round(x,2) for x in ax.normalized()])
        ax.normalize()
        for pb,ang in zip(pbs,(16,22,16)):
            bpy.context.view_layer.update(); M=pb.matrix.copy(); hd=M.to_translation()
            pb.matrix=Matrix.Translation(hd)@Matrix.Rotation(math.radians(ang),4,ax)@Matrix.Translation(-hd)@M
bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath='/tmp/char/char.blend')
bpy.context.scene['vertexColorSpace'] = 'linear'
bpy.ops.export_scene.gltf(export_extras=True,filepath=OUT+'lead_character_draft.glb',export_image_format='JPEG',export_apply=False,export_vertex_color='NAME',export_vertex_color_name='Col',export_skins=True,export_rest_position_armature=False)
