import bpy, bmesh, math, sys, json
from mathutils import Vector, Matrix, noise
from mathutils.bvhtree import BVHTree
P=json.loads(sys.argv[-1]); OUT='/tmp/web/site/models/'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.preferences.addon_enable(module='bl_ext.user_default.mpfb')
from bl_ext.user_default.mpfb.services.humanservice import HumanService
from bl_ext.user_default.mpfb.services.targetservice import TargetService
from bl_ext.user_default.mpfb.entities.objectproperties import HumanObjectProperties
h=HumanService.create_human()
for k,v in P['body'].items(): HumanObjectProperties.set_value(k,v,entity_reference=h)
TargetService.reapply_macro_details(h)
def ov(o): return bpy.context.temp_override(object=o,active_object=o,selected_objects=[o],selected_editable_objects=[o])
with ov(h): bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
eyes=HumanService.add_mhclo_asset('/tmp/mh/makehuman/data/eyes/low-poly/low-poly.mhclo',h,asset_type='Eyes',subdiv_levels=0)
rig=HumanService.add_builtin_rig(h,'mixamo')
for m in list(h.modifiers):
    if m.type=='MASK': h.modifiers.remove(m)
for m in list(eyes.modifiers): eyes.modifiers.remove(m)
for g in list(eyes.vertex_groups): eyes.vertex_groups.remove(g)
mw=eyes.matrix_world.copy(); eyes.parent=rig; eyes.matrix_world=mw
eyes.vertex_groups.new(name='mixamorig:Head').add(list(range(len(eyes.data.vertices))),1.0,'REPLACE'); eyes.modifiers.new('Armature','ARMATURE').object=rig
bpy.context.view_layer.update()
J=lambda n: rig.matrix_world@rig.data.bones['mixamorig:'+n].head_local
HIP,KNEE,ANK,NECK,HEAD=J('Hips').z,J('LeftLeg').z,J('LeftFoot').z,J('Neck').z,J('Head').z
SH=J('LeftArm'); EL=J('LeftForeArm'); HA=J('LeftHand'); SX=SH.x; s=HEAD/1.449
print('LANDMARKS',round(HIP,3),round(KNEE,3),round(ANK,3),round(NECK,3),round(HEAD,3),[round(x,3) for x in SH],[round(x,3) for x in HA])
GI={g.name:g.index for g in h.vertex_groups}
def srgb(c): return Vector(tuple((x/255)**2.2 for x in c))
MATS={}
def colmat(name,rough=0.9):
    if name in MATS: return MATS[name]
    m=bpy.data.materials.new(name); nt=m.node_tree
    if nt is None: m.use_nodes=True; nt=m.node_tree
    b=next(n for n in nt.nodes if n.type=='BSDF_PRINCIPLED'); b.inputs['Roughness'].default_value=rough
    vc=nt.nodes.new('ShaderNodeVertexColor'); vc.layer_name='Col'; nt.links.new(vc.outputs['Color'],b.inputs['Base Color']); MATS[name]=m; return m
COL={k:srgb(v) for k,v in P['colors'].items()}
cz=lambda f:f.calc_center_median()
def side_arm(c):     # 0..1 position along the arm from shoulder to wrist, or None if not on the arm
    sx=1 if c.x>=0 else -1; a=Vector((SH.x*sx,SH.y,SH.z)); b=Vector((HA.x*sx,HA.y,HA.z)); d=b-a; t=(c-a).dot(d)/d.length_squared
    if t<-0.05 or t>1.15: return None
    if (a+d*t-c).length>0.11*s: return None
    return t
def armcut(t,sx):    # plane across the arm at fraction t, keeping the shoulder side
    a=Vector((SH.x*sx,SH.y,SH.z)); b=Vector((HA.x*sx,HA.y,HA.z)); d=(b-a).normalized(); return (a+(b-a)*t, d)
def piece(name,group,keep,offset,mat,cuts=(),shape=None,sub=False):
    o=h.copy(); o.data=h.data.copy(); o.name=name; bpy.context.scene.collection.objects.link(o)
    bm=bmesh.new(); bm.from_mesh(o.data); dl=bm.verts.layers.deform.verify(); gi=GI[group]
    bmesh.ops.delete(bm,geom=[f for f in bm.faces if not (all(v[dl].get(gi,0)>0 for v in f.verts) and keep(cz(f)))],context='FACES')
    if cuts: bmesh.ops.triangulate(bm,faces=bm.faces[:])
    for co,no,flt in cuts:
        fs=[f for f in bm.faces if flt is None or flt(cz(f))]
        bmesh.ops.bisect_plane(bm,geom=list({v for f in fs for v in f.verts})+list({e for f in fs for e in f.edges})+fs,plane_co=co,plane_no=no,clear_outer=True)
    if cuts: bmesh.ops.remove_doubles(bm,verts=bm.verts[:],dist=0.001); bmesh.ops.dissolve_degenerate(bm,edges=bm.edges[:],dist=0.001)
    if sub: bmesh.ops.subdivide_edges(bm,edges=bm.edges[:],cuts=1,use_grid_fill=True,smooth=0.3)
    bmesh.ops.recalc_face_normals(bm,faces=bm.faces[:]); bm.normal_update()
    if shape:
        for v in bm.verts: shape(v)
        bm.normal_update()
    for v in bm.verts: v.co+=v.normal*(offset(v.co) if callable(offset) else offset)
    bmesh.ops.triangulate(bm,faces=[f for f in bm.faces if len(f.verts)>4]); bmesh.ops.dissolve_degenerate(bm,edges=bm.edges[:],dist=0.0008); bmesh.ops.recalc_face_normals(bm,faces=bm.faces[:])
    bm.to_mesh(o.data); bm.free(); o.data.materials.clear(); o.data.materials.append(colmat(mat)); return o
G=P['garments']; parts=[]
def arm_ok(c,upto):
    t=side_arm(c); return t is None or t<=upto+0.06
sleeve=G.get('sleeve',0.86)
cuts_sleeve=lambda t:[(armcut(t,1)[0],armcut(t,1)[1],lambda c:c.x>SX*0.8),(armcut(t,-1)[0],armcut(t,-1)[1],lambda c:c.x<-SX*0.8)]
# shirt
parts.append(('shirt',piece('Shirt','helper-tights',lambda c:c.z>HIP-0.02 and arm_ok(c,sleeve),lambda c:0.012 if abs(c.x)>SX*0.8 else 0.008,'Shirt',
   cuts=[((0,0,NECK+0.005),(0,0,1),None),((0,-0.1,NECK-0.035*s),Vector((0,-0.5,0.87)),lambda c:c.y<0)]+cuts_sleeve(sleeve))))
if G.get('coat'):
    cs=G.get('coatsleeve',0.82); collar=NECK-0.05*s
    sl=G.get('coatsleeves',True)
    coat=piece('Coat','helper-tights',(lambda c:c.z>HIP-0.02 and arm_ok(c,cs)) if sl else (lambda c:c.z>HIP-0.02 and abs(c.x)<SX*0.9),lambda c:0.03 if abs(c.x)>SX*0.8 else 0.022,'Coat',
       cuts=[((0,0,collar),(0,0,1),None),((0,-0.1,collar-0.03),Vector((0,-0.6,0.8)),lambda c:c.y<0)]+(cuts_sleeve(cs) if sl else [((SX*0.78,0,0),(1,0,0),None),((-SX*0.78,0,0),(-1,0,0),None)]))
    parts.append(('coat',coat))
    hem=G.get('coathem')
    if hem:
        ZT=HIP+0.06; ZB=KNEE+hem
        def flare(v):
            t=max(0,(ZT-v.co.z)/(ZT-ZB)); f=1+0.16*t*t+0.05*t; v.co.x*=f; v.co.y=(v.co.y+0.02)*f*(1+0.15*t*(v.co.y>0))-0.02
        sk=piece('CoatSkirt','helper-skirt',lambda c:ZB<c.z<ZT+0.02,0.03,'Coat',cuts=[((0,0,ZB),(0,0,-1),None)],shape=flare)
        parts.append(('coatskirt',sk))
if G.get('breeches'):
    bk=G.get('breechkind','plain'); low=KNEE-0.05*s
    wide=(lambda c:0.012+0.045*max(0,min(1,(HIP-c.z)/(HIP-low)))**1.2) if bk=='slops' else 0.013
    parts.append(('breeches',piece('Breeches','helper-tights',lambda c:low-0.03<c.z<HIP+0.13 and side_arm(c) is None,wide,'Breeches',cuts=[((0,0,low),(0,0,-1),None),((0,0,HIP+0.12),(0,0,1),None)])))
if G.get('shoes'):
    parts.append(('shoes',piece('Shoes','helper-tights',lambda c:c.z<ANK+0.09,0.006,'Shoes',cuts=[((0,0,ANK+0.045),(0,0,1),None)])))
# short hair: a close cap over the scalp, edged like a hairline
WA=Vector((0,-0.115*s,HEAD+0.15*s)); WN=Vector((0,-0.20,-0.18)).normalized()
def hair_off(c):
    d=-((c-WA).dot(WN)); return 0.002+(0.006+0.004*G.get('hairvol',0)+0.0015*noise.noise(c*120))*min(1.0,max(0.0,d/0.012))**0.7
if G.get('hat')!='cap': parts.append(('hair',piece('Hair','body',lambda c:c.z>HEAD+0.02 and not (c.y<-0.06 and c.z<HEAD+0.12*s) and not (abs(c.x)>0.064*s and c.z<HEAD+0.09*s and c.y<0.035),hair_off,'Hair',cuts=[(WA,WN,None),((0,0.02,HEAD+0.035),Vector((0,0.3,-1)).normalized(),lambda c:c.y>-0.02)],sub=True)))
clothes=[o for k,o in parts]
for o in clothes:
    md=o.modifiers.new('wt','DATA_TRANSFER'); md.object=h; md.use_vert_data=True; md.data_types_verts={'VGROUP_WEIGHTS'}
    md.vert_mapping='POLYINTERP_NEAREST'; md.layers_vgroup_select_src='ALL'; md.layers_vgroup_select_dst='NAME'
    with ov(o): bpy.ops.object.modifier_move_to_index(modifier='wt',index=0); bpy.ops.object.modifier_apply(modifier='wt')
def sstep(a,b,x): t=max(0.0,min(1.0,(x-a)/(b-a))); return t*t*(3-2*t)
for k,o in parts:            # coat skirts follow both legs as one cloth, like Abba's skirt
    if k!='coatskirt': continue
    B={n:o.vertex_groups['mixamorig:'+n] for n in ('Hips','LeftUpLeg','RightUpLeg')}; idx=list(range(len(o.data.vertices)))
    for g in o.vertex_groups:
        if g.name.startswith('mixamorig:'): g.remove(idx)
    for v in o.data.vertices:
        t=max(0.0,min(1.0,(HIP+0.06-v.co.z)/0.5)); leg=0.6*sstep(0.1,0.9,t); left=sstep(-1.0,1.0,v.co.x/0.15)
        for n,val in (('Hips',1-leg),('LeftUpLeg',leg*left),('RightUpLeg',leg*(1-left))):
            if val>0.001: B[n].add([v.index],val,'REPLACE')
# extra pieces bound to one bone: hat, cap, bands, apron
def rigid(name,bm,mat,bone):
    me=bpy.data.meshes.new(name); bmesh.ops.recalc_face_normals(bm,faces=bm.faces[:]); bm.to_mesh(me); bm.free()
    o=bpy.data.objects.new(name,me); bpy.context.scene.collection.objects.link(o); me.materials.append(colmat(mat))
    for g in h.vertex_groups: o.vertex_groups.new(name=g.name)
    o.vertex_groups['mixamorig:'+bone].add(list(range(len(me.vertices))),1.0,'REPLACE'); o.parent=rig; o.modifiers.new('Armature','ARMATURE').object=rig; clothes.append(o); return o
bh=bmesh.new(); bh.from_mesh(h.data); tree=BVHTree.FromBMesh(bh)
def top_of_head():
    best=0
    for v in h.data.vertices:
        if v.co.z>best and abs(v.co.x)<0.05: best=v.co.z
    return best
TOP=top_of_head(); HC=Vector((0,J('Head').y+0.005,TOP))
if G.get('hat')=='felt':
    bm=bmesh.new(); bmesh.ops.create_cone(bm,cap_ends=True,segments=28,radius1=0.19*s,radius2=0.18*s,depth=0.012,matrix=Matrix.Translation(HC+Vector((0,0,-0.075*s))))
    bmesh.ops.create_cone(bm,cap_ends=True,segments=24,radius1=0.098*s,radius2=0.088*s,depth=0.13*s,matrix=Matrix.Translation(HC+Vector((0,0,-0.01*s))))
    bmesh.ops.create_cone(bm,cap_ends=False,segments=24,radius1=0.1*s,radius2=0.1*s,depth=0.022,matrix=Matrix.Translation(HC+Vector((0,0,-0.055*s))))
    for v in bm.verts:
        r=math.hypot(v.co.x,v.co.y-HC.y)
        if r>0.12*s: v.co.z+=0.03*((r-0.12*s)/(0.07*s))**2*(0.6+0.4*math.sin(math.atan2(v.co.y-HC.y,v.co.x)*2+1.2))   # brim turned up a little, unevenly
    rigid('Hat',bm,'Hat','Head')
if G.get('hat')=='cap':
    bm=bmesh.new(); bmesh.ops.create_uvsphere(bm,u_segments=20,v_segments=10,radius=1.0)
    bmesh.ops.delete(bm,geom=[v for v in bm.verts if v.co.z<-0.15],context='VERTS')
    for v in bm.verts:   # a Monmouth cap: a soft knitted dome that hugs the skull
        z=v.co.z; v.co=Vector((v.co.x*0.112*s,v.co.y*0.124*s,z*0.104*s))+HC+Vector((0,0.006,-0.088*s))
    bmesh.ops.create_cone(bm,cap_ends=False,segments=20,radius1=0.114*s,radius2=0.114*s,depth=0.026*s,matrix=Matrix.Translation(HC+Vector((0,0.006,-0.096*s)))@Matrix.Scale(1.09,4,Vector((0,1,0))))   # rolled brim
    rigid('Cap',bm,'Hat','Head')
if G.get('scarf'):          # a neckerchief knotted at the throat, hides the shirt's neck edge
    z=NECK-0.012*s; bm=bmesh.new(); n=24; ring=[]; C=Vector((0,J('Neck').y,z))
    for i in range(n):
        a=i/n*2*math.pi; d=Vector((math.sin(a),-math.cos(a),0)); hit=tree.ray_cast(Vector((0,J('Neck').y,z))+d*0.3,-d)[0]
        r=min(((hit-C).length if hit else 0.06),0.068); p=C+d*(r+0.02); ring.append(p)
    lo=[bm.verts.new(p+Vector((0,0,-0.03*s))+(p-C)*0.35) for p in ring]; hi=[bm.verts.new(p+Vector((0,0,0.02*s))) for p in ring]
    for i in range(n): j=(i+1)%n; bm.faces.new((lo[i],lo[j],hi[j],hi[i]))
    f=ring[0]; k=[bm.verts.new(f+Vector((dx,-0.02,dz))) for dx,dz in ((-0.018,-0.02),(0.018,-0.02),(0.01,-0.07),(-0.012,-0.066))]; bm.faces.new(k)
    rigid('Scarf',bm,'Scarf','Spine2')
if G.get('bands'):
    z=NECK-0.03*s; hit=tree.ray_cast(Vector((0,-1,z)),Vector((0,1,0)))[0]; y=(hit.y if hit else -0.06)-0.026
    bm=bmesh.new()
    for sx in (-1,1):
        vs=[bm.verts.new((sx*0.004+sx*dx,y-0.002*abs(dz),z+dz)) for dx,dz in ((0,0),(0.028,0),(0.03,-0.085),(0.002,-0.085))]; bm.faces.new(vs if sx>0 else vs[::-1])
    rigid('Bands',bm,'Bands','Spine2')
if G.get('apron'):
    bm=bmesh.new(); nu,nv=10,16; rows=[]; ZA,ZE=HIP+0.1,KNEE+0.02
    for jv in range(nv+1):
        t=jv/nv; z=ZA-t*(ZA-ZE); hw=0.15+0.03*t; row=[]
        for iu in range(nu+1):
            x=-hw+2*hw*iu/nu; hit=tree.ray_cast(Vector((x,-1.0,z)),Vector((0,1,0)))[0]
            row.append(bm.verts.new((x,(hit.y if hit else -0.12)-0.035,z)))
        rows.append(row)
    for jv in range(nv):
        for iu in range(nu): bm.faces.new((rows[jv][iu],rows[jv][iu+1],rows[jv+1][iu+1],rows[jv+1][iu]))
    ap=rigid('Apron',bm,'Apron','Hips')
bh.free()
# body: remove what the clothes fully hide, so nothing pokes through
bm=bmesh.new(); bm.from_mesh(h.data); dl=bm.verts.layers.deform.verify(); gi=GI['body']
cov_arm=max(sleeve, G.get('coatsleeve',0) if G.get('coat') and G.get('coatsleeves',True) else 0)
def hidden(c):
    if HIP+0.05<c.z<NECK-0.07*s and abs(c.x)<SX*0.8: return True
    t=side_arm(c)
    if t is not None and 0.08<t<cov_arm-0.06 and abs(c.x)>SX*0.75: return True
    if G.get('breeches') and KNEE<c.z<HIP+0.05 and abs(c.x)<SX*0.9 and side_arm(c) is None: return True
    if G.get('shoes') and c.z<ANK+0.02: return True
    return False
bmesh.ops.delete(bm,geom=[f for f in bm.faces if not all(v[dl].get(gi,0)>0 for v in f.verts) or hidden(cz(f))],context='FACES'); bm.to_mesh(h.data); bm.free()
h.data.materials.clear(); h.data.materials.append(colmat('Skin',0.68)); h.name='Body'
LIPZ=HEAD+0.025*s; BROWZ=HEAD+0.10*s
def paint(o):
    me=o.data; bm=bmesh.new(); bm.from_mesh(me); cl=bm.loops.layers.color.new('Col')
    for f in bm.faces:
        name=me.materials[f.material_index].name.split('.')[0]; base=COL[name]
        for l in f.loops:
            p=l.vert.co; col=base.copy()
            if o is h:
                if G.get('stockings') and ANK-0.01<p.z<KNEE+0.02: col=COL['Stockings'].copy()
                lip=max(0,1-((p.x/0.026)**2+((p.z-LIPZ)/0.010)**2)) if p.y<J('Head').y-0.09 else 0
                col=col.lerp(col*0.62+Vector((0.05,0.0,0.0)),min(1,lip*1.2))
                for sx in (-1,1):
                    bx=(p.x-sx*0.034*s)/0.022; bz=(p.z-BROWZ-0.003*(1-abs(bx)))/0.0045
                    br=max(0,1-(bx*bx+bz*bz)) if p.y<J('Head').y-0.07 else 0
                    col=col.lerp(COL['Hair'],min(1,br*1.6))
                k=0.94+noise.noise(p*9)*0.06
            else:
                k=0.88+noise.noise(p*14)*0.1+noise.noise(p*3)*0.08
                if p.z<KNEE and name in ('Breeches','Coat'): k*=0.85
            l[cl]=(col.x*k,col.y*k,col.z*k,1)
    bm.to_mesh(me); bm.free(); ca=me.color_attributes; ca.active_color=ca['Col']; ca.render_color_index=list(ca.keys()).index('Col')
    for p in me.polygons: p.use_smooth=True
for o in clothes+[h]: paint(o)
for m in eyes.data.materials:
    for n in m.node_tree.nodes:
        if n.type=='TEX_IMAGE' and n.image: n.image.filepath='/tmp/char/eye.png'; n.image.reload()
# relaxed arms and curled fingers, the same pose Abba uses
def aim(n,t):
    pb=rig.pose.bones[n]; bpy.context.view_layer.update(); M=pb.matrix.copy()
    q=(M.to_3x3()@Vector((0,1,0))).normalized().rotation_difference(Vector(t).normalized()); hd=M.to_translation()
    pb.matrix=Matrix.Translation(hd)@q.to_matrix().to_4x4()@Matrix.Translation(-hd)@M; bpy.context.view_layer.update()
for side,sx in (('Left',1),('Right',-1)):
    aim('mixamorig:%sArm'%side,(sx*0.22,0.03,-1)); aim('mixamorig:%sForeArm'%side,(sx*0.06,-0.32,-1)); aim('mixamorig:%sHand'%side,(0,-0.2,-1))
    for f in ('Index','Middle','Ring','Pinky'):
        pbs=[rig.pose.bones['mixamorig:%sHand%s%d'%(side,f,i)] for i in (1,2,3)]; bpy.context.view_layer.update()
        d=[(p.matrix.to_3x3()@Vector((0,1,0))).normalized() for p in pbs]; ax=d[0].cross(d[2]).normalized()
        for pb,ang in zip(pbs,(16,22,16)):
            bpy.context.view_layer.update(); M=pb.matrix.copy(); hd=M.to_translation(); pb.matrix=Matrix.Translation(hd)@Matrix.Rotation(math.radians(ang),4,ax)@Matrix.Translation(-hd)@M
bpy.context.view_layer.update()
print('TRIS',sum(len(p.vertices)-2 for o in bpy.data.objects if o.type=='MESH' for p in o.data.polygons))
bpy.ops.wm.save_as_mainfile(filepath='/tmp/npc/'+P['name']+'.blend')
bpy.ops.export_scene.gltf(filepath=OUT+P['name']+'.glb',export_image_format='JPEG',export_apply=False,export_vertex_color='NAME',export_vertex_color_name='Col',export_skins=True,export_animations=False,export_rest_position_armature=False)
# a copy for Mixamo: rest pose, with skin, so the user can pick animations for it
if P.get('fbx'):
    rig.data.pose_position='REST'; bpy.context.view_layer.update()
    bpy.ops.export_scene.fbx(filepath='/home/claude/port-royal-assets/'+P['name']+'_for_mixamo.fbx',object_types={'ARMATURE','MESH'},add_leaf_bones=False,path_mode='COPY',embed_textures=True,colors_type='SRGB',mesh_smooth_type='FACE',bake_anim=False)
    rig.data.pose_position='POSE'
