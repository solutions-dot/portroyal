# Eventide 1980 characters. A copy of tools/garvey/era.py (itself a copy of tools/people/npc.py) with extra pieces for 1980 Kingston:
#   a head tie (headtie), a dress hem at mid-calf or knee (hem: 0 ankle .. 1 knee), a cardigan, glasses,
#   knee shorts (breechkind:'shorts') and short white socks (socks) for children.
# Kept separate so the Garvey and Port Royal tools are untouched while other work goes on; fold back in later.
# Run: MAKEHUMAN=~/mh/makehuman NPC_OUT=build/people/ ~/venv/bin/python3 tools/eventide/people.py "$(cat tools/eventide/people/iris1980.json)"
import bpy, bmesh, math, sys, json
from mathutils import Vector, Matrix, noise
from mathutils.bvhtree import BVHTree
import os
P=json.loads(sys.argv[-1]); OUT=os.environ.get('NPC_OUT','games/port-royal/site/models/')   # where the .glb goes; see docs/PIPELINE.md
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
eyes=HumanService.add_mhclo_asset(os.path.join(os.environ.get('MAKEHUMAN','/tmp/mh/makehuman'),'data/eyes/low-poly/low-poly.mhclo'),h,asset_type='Eyes',subdiv_levels=0)
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
def piece(name,group,keep,offset,mat,cuts=(),shape=None,sub=False,post=None):
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
    if post: post(bm)
    bmesh.ops.triangulate(bm,faces=[f for f in bm.faces if len(f.verts)>4]); bmesh.ops.dissolve_degenerate(bm,edges=bm.edges[:],dist=0.0008); bmesh.ops.recalc_face_normals(bm,faces=bm.faces[:])
    bm.to_mesh(o.data); bm.free(); o.data.materials.clear(); o.data.materials.append(colmat(mat)); return o
CHEST_TOP=NECK-0.10*s
def drape_front(bm):
    # a man's linen shirt or wool coat lies flat across the chest and falls straight down from it:
    # (1) flatten the two pectoral mounds toward the breastbone line, (2) never let cloth tuck back in under them
    rows={}
    for v in bm.verts:
        if v.co.y<0 and abs(v.co.x)<SX*0.85 and HIP<v.co.z<CHEST_TOP+0.04: rows.setdefault(round(v.co.z/0.012),[]).append(v)
    for k,vs in rows.items():
        mid=[v for v in vs if abs(v.co.x)<0.03]
        if not mid: continue
        ym=sum(v.co.y for v in mid)/len(mid)
        for v in vs:
            w=max(0.0,1-abs(v.co.x)/(SX*0.85))**0.7
            if v.co.y<ym: v.co.y=v.co.y+(ym-v.co.y)*0.7*w
    cols={}
    for v in bm.verts:
        if v.co.y<0 and abs(v.co.x)<SX*0.8 and HIP-0.02*s<v.co.z<CHEST_TOP+0.02: cols.setdefault(round(v.co.x/0.02),[]).append(v)
    for k,vs in cols.items():
        vs.sort(key=lambda v:-v.co.z); lo=0.0
        for v in vs:
            lo=min(lo,v.co.y)
            if v.co.y>lo:
                k=max(0.0,min(1.0,(v.co.z-(WAIST+0.02))/0.10))   # full hang over the belly, gathered back in above the waistband
                hang=lo+(v.co.y-lo)*0.15; v.co.y=v.co.y+(hang-v.co.y)*k*k
    bm.normal_update()
def smooth_edge(bm,iters=6):
    # cuts made on part of the mesh leave a stair-stepped edge: relax each boundary vertex toward its two boundary neighbours
    for _ in range(iters):
        mv={}
        for v in bm.verts:
            if not v.is_boundary: continue
            nb=[e.other_vert(v) for e in v.link_edges if e.is_boundary]
            if len(nb)==2: mv[v]=(nb[0].co+nb[1].co)*0.5
        for v,c in mv.items(): v.co=v.co.lerp(c,0.55)
    bm.normal_update()
def trim_seat(bm):
    # keep breeches from ballooning out behind: cap how far the seat sticks out past the small of the back
    ys=[v.co.y for v in bm.verts if v.co.y>0 and abs(v.co.z-(HIP+0.1*s))<0.02]
    if not ys: return
    cap=max(ys)+0.012
    for v in bm.verts:
        if v.co.y>cap: v.co.y=cap+(v.co.y-cap)*0.3
    bm.normal_update()
G=P['garments']; parts=[]
if G.get('trousers'): G['breeches']=True; G['breechkind']='trousers'
WAIST=HIP+0.13*s if G.get('breeches') else HIP+0.02*s   # with breeches the shirt is tucked in under their waistband
def arm_ok(c,upto):
    if abs(c.x)<SX*0.95: return True   # torso, not arm (short sleeves used to leave holes at the waist)
    t=side_arm(c); return t is None or t<=upto+0.06
sleeve=G.get('sleeve',0.86)
def cuts_sleeve(t):   # a plane across each arm at the sleeve end; only the sleeve near it is cut, never the side of the body (on children the waist is close to the arm line)
    out=[]
    for sx in (1,-1):
        P,N=armcut(t,sx); out.append((P,N,lambda c,P=P,sx=sx:c.x*sx>SX*0.8 and (c-P).length<0.12*s))
    return out
# shirt
parts.append(('shirt',piece('Shirt','helper-tights',lambda c:c.z>(HIP+0.07*s if G.get('breeches') else HIP-0.02*s) and arm_ok(c,sleeve),lambda c:0.012 if abs(c.x)>SX*0.8 else 0.008,'Shirt',post=(smooth_edge if G.get('woman') else (None if G.get('coat') else ((lambda bm:(drape_front(bm),smooth_edge(bm))) if G.get('smooth') else drape_front))),
   cuts=[((0,0,NECK+0.005-(0.062*s if G.get('coat') else 0)),(0,0,1),None),((0,-0.1,NECK-(0.004 if G.get('highneck') else 0.035)*s-(0.06*s if G.get('coat') else 0)),Vector((0,-0.5,0.87)),lambda c:c.y<0)]+cuts_sleeve(sleeve))))   # under a coat the shirt stays below the coat's collar
if G.get('coat'):
    cs=G.get('coatsleeve',0.82); collar=NECK-0.012*s
    sl=G.get('coatsleeves',True)
    coat=piece('Coat','helper-tights',(lambda c:c.z>HIP-0.02*s and arm_ok(c,cs)) if sl else (lambda c:c.z>HIP-0.02*s and abs(c.x)<SX*0.9),lambda c:0.03 if abs(c.x)>SX*0.8 else 0.022,'Coat',post=drape_front,
       cuts=[((0,0,collar),(0,0,1),None),((0,-0.1,collar-0.045*s),Vector((0,-0.6,0.8)),lambda c:c.y<0)]+(cuts_sleeve(cs) if sl else [((SX*0.78,0,0),(1,0,0),None),((-SX*0.78,0,0),(-1,0,0),None)]))
    parts.append(('coat',coat))
    hem=G.get('coathem')
    if hem:
        ZT=HIP+0.06*s; ZB=KNEE+hem
        def flare(v):
            t=max(0,(ZT-v.co.z)/(ZT-ZB)); f=1+0.16*t*t+0.05*t; v.co.x*=f; v.co.y=(v.co.y+0.02)*f*(1+0.15*t*(v.co.y>0))-0.02
        sk=piece('CoatSkirt','helper-skirt',lambda c:ZB<c.z<ZT+0.02,0.03,'Coat',cuts=[((0,0,ZB),(0,0,-1),None)],shape=flare)
        parts.append(('coatskirt',sk))
if G.get('breeches'):
    bk=G.get('breechkind','plain'); low=(ANK+0.04) if bk=='trousers' else (KNEE+0.07*s if bk=='shorts' else KNEE-0.05*s)
    wide=(lambda c:0.012+0.045*max(0,min(1,(HIP-c.z)/(HIP-low)))**1.2) if bk=='slops' else (0.030 if bk=='trousers' else (0.015 if bk=='shorts' else 0.013))
    parts.append(('breeches',piece('Breeches','helper-tights',lambda c:low-0.03<c.z<HIP+0.13*s and side_arm(c) is None,wide,'Breeches',post=trim_seat,cuts=[((0,0,low),(0,0,-1),None),((0,0,HIP+0.12*s),(0,0,1),None)])))
if G.get('waistcoat'):
    wcol=NECK-0.02*s
    parts.append(('waistcoat',piece('Waistcoat','helper-tights',lambda c:c.z>HIP+0.03*s and abs(c.x)<SX*0.9,lambda c:0.03 if abs(c.x)>SX*0.8 else 0.022,'Waistcoat',post=lambda bm:(drape_front(bm),smooth_edge(bm)),
        cuts=[((0,0,wcol),(0,0,1),None)]+([((0,0,wcol-0.17*s),Vector((-1.1,0,1)).normalized(),lambda c:c.y<0 and c.x>0),((0,0,wcol-0.17*s),Vector((1.1,0,1)).normalized(),lambda c:c.y<0 and c.x<0)] if G.get('vwaist') else [((0,-0.1,wcol-0.13*s),Vector((0,-0.6,0.8)),lambda c:c.y<0)])+[((SX*0.78,0,0),(1,0,0),None),((-SX*0.78,0,0),(-1,0,0),None)])))
if G.get('jacket'):   # a plain suit jacket: waist-length hem, sleeves to the wrist, a V opening over the waistcoat
    jcol=NECK-0.012*s; jcs=G.get('jacketsleeve',0.9)
    vz=jcol-0.20*s   # the V opening: two angled cuts, one each side of the middle, so only a narrow wedge is removed and the shoulders stay covered
    parts.append(('jacket',piece('Jacket','helper-tights',lambda c:c.z>HIP-0.12*s and arm_ok(c,jcs),lambda c:0.022 if abs(c.x)>SX*0.8 else 0.017,'Jacket',post=lambda bm:(drape_front(bm),smooth_edge(bm)),
        cuts=[((0,0,jcol),(0,0,1),None),((0,0,vz),Vector((-1.5,0,1)).normalized(),lambda c:c.y<0 and c.x>0),((0,0,vz),Vector((1.5,0,1)).normalized(),lambda c:c.y<0 and c.x<0)]+cuts_sleeve(jcs))))
SKIRT_ZB=ANK+0.07+(KNEE-ANK-0.07)*G.get('hem',0.0)   # the hem: 0 is the ankle (1914 dresses), about 0.5 mid-calf, 1 the knee
if G.get('cardigan'):
    ccol=NECK-0.010*s; ccs=G.get('cardigansleeve',0.92); cvz=ccol-0.26*s
    parts.append(('cardigan',piece('Cardigan','helper-tights',lambda c:c.z>HIP-0.10*s and arm_ok(c,ccs),lambda c:0.03 if abs(c.x)>SX*0.8 else 0.028,'Cardigan',post=lambda bm:smooth_edge(bm,14),
        cuts=[((0,0,ccol),(0,0,1),None),((0,0,cvz),Vector((-3.5,0,1)).normalized(),lambda c:c.y<0 and c.x>0),((0,0,cvz),Vector((3.5,0,1)).normalized(),lambda c:c.y<0 and c.x<0),
              ((0.012,0,0),(-1,0,0),lambda c:c.y<0 and c.z<cvz+0.01 and c.x<0.012 and c.x>-0.03)]+cuts_sleeve(ccs))))
if G.get('skirt'):
    ZT=HIP+0.08*s; ZB=SKIRT_ZB
    def flare2(v):
        t=max(0,(ZT-v.co.z)/(ZT-ZB)); f=1+0.12*t*t+0.06*t; v.co.x*=f; v.co.y=(v.co.y+0.02)*f*(1+0.10*t*(v.co.y>0))-0.02
    parts.append(('skirt',piece('Skirt','helper-skirt',lambda c:ZB<c.z<ZT+0.02,lambda c:0.012+0.018*min(1.0,max(0.0,(ZT+0.02-c.z)/(0.10*s))),'Skirt',cuts=[((0,0,ZB),(0,0,-1),None)],shape=flare2)))
if G.get('shoes'):
    parts.append(('shoes',piece('Shoes','helper-tights',lambda c:c.z<ANK+0.09,0.006,'Shoes',cuts=[((0,0,ANK+0.045),(0,0,1),None)])))
# short hair: a close cap over the scalp, edged like a hairline
WA=Vector((0,-0.115*s,HEAD+0.15*s)); WN=Vector((0,-0.20,-0.18)).normalized()
def hair_off(c):
    d=-((c-WA).dot(WN)); return 0.002+(0.006+0.004*(min(G.get('hairvol',0),0.25) if G.get('hat') in ('felt','flat') else G.get('hairvol',0))+0.0015*noise.noise(c*120))*min(1.0,max(0.0,d/0.012))**0.7
if G.get('hat')!='cap' and not G.get('headtie'): parts.append(('hair',piece('Hair','body',lambda c:c.z>HEAD+0.02 and not (c.y<-0.06 and c.z<HEAD+0.12*s) and not (abs(c.x)>0.064*s and c.z<HEAD+0.09*s and c.y<0.035),hair_off,'Hair',cuts=[(WA,WN,None),((0,0.02,HEAD+0.035),Vector((0,0.3,-1)).normalized(),lambda c:c.y>-0.02)],sub=True)))
# a knitted cap and a neckerchief made from the body's own surface, so they fit and move with it
if G.get('hat')=='cap':
    Jy=J('Head').y
    parts.append(('cap',piece('Cap','body',lambda c:c.z>HEAD+0.02,0.013,'Hat',cuts=[((0,Jy,HEAD+0.088*s),Vector((0,-0.075,-0.2)).normalized(),None)],sub=True)))
if G.get('headtie'):
    Jy=J('Head').y
    def tie_post(bm):
        for _ in range(8): bmesh.ops.smooth_vert(bm,verts=bm.verts[:],factor=0.5,use_axis_x=True,use_axis_y=True,use_axis_z=True)
        smooth_edge(bm,10)
    TP=Vector((0,Jy,HEAD+0.062*s)); TN=Vector((0,-0.62,-1)).normalized()
    tie_off=lambda c:0.005+0.019*min(1.0,max(0.0,-(c-TP).dot(TN)/(0.035*s)))+0.003*noise.noise(c*38)
    parts.append(('headtie',piece('Headtie','body',lambda c:c.z>HEAD-0.02*s,tie_off,'Hat',post=tie_post,
        cuts=[(TP,TN,None)],sub=True)))
if G.get('scarf'):
    parts.append(('scarf',piece('Scarf','body',lambda c:NECK-0.045*s<c.z<NECK+0.03*s and abs(c.x)<0.085,lambda c:0.018+0.02*max(0.0,min(1.0,(NECK-c.z)/(0.045*s))),'Scarf')))
clothes=[o for k,o in parts]
for o in clothes:
    md=o.modifiers.new('wt','DATA_TRANSFER'); md.object=h; md.use_vert_data=True; md.data_types_verts={'VGROUP_WEIGHTS'}
    md.vert_mapping='POLYINTERP_NEAREST'; md.layers_vgroup_select_src='ALL'; md.layers_vgroup_select_dst='NAME'
    with ov(o): bpy.ops.object.modifier_move_to_index(modifier='wt',index=0); bpy.ops.object.modifier_apply(modifier='wt')
def sstep(a,b,x): t=max(0.0,min(1.0,(x-a)/(b-a))); return t*t*(3-2*t)
for k,o in parts:            # coat skirts follow both legs as one cloth, like Abba's skirt
    if k not in ('coatskirt','skirt'): continue
    B={n:o.vertex_groups['mixamorig:'+n] for n in ('Hips','LeftUpLeg','RightUpLeg')}; idx=list(range(len(o.data.vertices)))
    for g in o.vertex_groups:
        if g.name.startswith('mixamorig:'): g.remove(idx)
    for v in o.data.vertices:
        t=max(0.0,min(1.0,(HIP+0.06*s-v.co.z)/0.5)); leg=0.6*sstep(0.1,0.9,t); left=sstep(-1.0,1.0,v.co.x/0.15)
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
    # fit the crown to this head: measure the skull's outline at brow height so the hat sits down over it
    BZ=TOP-0.085*s; xs=[];ys=[]
    for v in h.data.vertices:
        if abs(v.co.z-(BZ+0.012*s))<0.012*s: xs.append(v.co.x); ys.append(v.co.y)
    cx=(max(xs)+min(xs))/2; cy=(max(ys)+min(ys))/2; rx=(max(xs)-min(xs))/2+0.008; ry=(max(ys)-min(ys))/2+0.008
    C0=Vector((cx,cy,BZ)); bm=bmesh.new()
    # brim: wide disc at brow level
    BR=G.get('brim',1.0)   # 1 is the wide 1690 brim; about 0.4 gives a short brim
    g=bmesh.ops.create_cone(bm,cap_ends=True,segments=32,radius1=1,radius2=1,depth=0.01,matrix=Matrix.Translation(C0))
    for v in g['verts']: d=v.co-C0; v.co.x=cx+d.x*(rx+0.085*s*BR); v.co.y=cy+d.y*(ry+0.075*s*BR)
    # crown: elliptical, from just under the brim up past the top of the head, tapering slightly
    H=(TOP-BZ)+0.06*s*(0.35+0.65*min(BR,1.0))   # a short-brimmed hat also has a lower crown
    g=bmesh.ops.create_cone(bm,cap_ends=True,segments=28,radius1=1,radius2=0.9,depth=H,matrix=Matrix.Translation(C0+Vector((0,0,H/2-0.004))))
    for v in g['verts']: d=v.co-C0; v.co.x=cx+d.x*rx; v.co.y=cy+d.y*ry
    # hat band
    g=bmesh.ops.create_cone(bm,cap_ends=False,segments=28,radius1=1,radius2=0.985,depth=0.022*s,matrix=Matrix.Translation(C0+Vector((0,0,0.016*s))))
    for v in g['verts']: d=v.co-C0; v.co.x=cx+d.x*(rx+0.002); v.co.y=cy+d.y*(ry+0.002)
    for v in bm.verts:
        d=v.co-C0; r=math.hypot(d.x/(rx+0.085*s*BR),d.y/(ry+0.075*s*BR))
        if r>0.62 and abs(d.z)<0.01: v.co.z+=0.028*((r-0.62)/0.38)**2*(0.6+0.4*math.sin(math.atan2(d.y,d.x)*2+1.2))   # brim turned up a little, unevenly
    rigid('Hat',bm,'Hat','Head')
if G.get('hat')=='flat':
    # a flat (newsboy) cap: a band at the brow, a low dome that puffs out past it, and a short stiff peak at the front
    BZ=TOP-0.085*s; xs=[];ys=[]
    for v in h.data.vertices:
        if abs(v.co.z-(BZ+0.012*s))<0.012*s: xs.append(v.co.x); ys.append(v.co.y)
    cx=(max(xs)+min(xs))/2; cy=(max(ys)+min(ys))/2; rx=(max(xs)-min(xs))/2+0.010; ry=(max(ys)-min(ys))/2+0.010
    bm=bmesh.new(); zc=BZ+0.022*s; rv=(TOP-zc)+0.012*s
    band=bmesh.ops.create_cone(bm,cap_ends=False,segments=28,radius1=1,radius2=1,depth=0.026*s,matrix=Matrix.Translation((cx,cy,BZ+0.010*s)))
    for v in band['verts']: d=v.co-Vector((cx,cy,BZ+0.010*s)); v.co.x=cx+d.x*rx; v.co.y=cy+d.y*ry
    dome=bmesh.ops.create_uvsphere(bm,u_segments=28,v_segments=10,radius=1,matrix=Matrix.Translation((cx,cy-0.010*s,zc)))
    for v in dome['verts']: d=v.co-Vector((cx,cy-0.010*s,zc)); v.co=Vector((cx+d.x*rx*1.22,cy-0.010*s+d.y*ry*1.22,zc+d.z*rv))
    bmesh.ops.delete(bm,geom=[f for f in bm.faces if f.calc_center_median().z<zc-0.001 and all(v in dome['verts'] for v in f.verts)],context='FACES')
    pk=[bm.verts.new((cx+dx*rx,cy-ry*dy,BZ+dz)) for dx,dy,dz in ((-0.70,0.95,0.018),(0.70,0.95,0.018),(0.58,1.62,-0.010),(-0.58,1.62,-0.010))]
    bm.faces.new(pk)
    rigid('Hat',bm,'Hat','Head')
def _front(z):
    hit=tree.ray_cast(Vector((0,-1,z)),Vector((0,1,0)))[0]; return hit.y if hit else -0.08
def _radius(z,a):
    o=Vector((0,J('Neck').y,z)); d=Vector((math.sin(a),-math.cos(a),0)); hit=tree.ray_cast(o+d*0.3,-d)[0]
    return (hit-o).length if hit else 0.06
if G.get('collar'):      # a stiff white standing collar round the neck
    bm=bmesh.new(); seg=20; rings=[]
    for zz,extra in ((NECK+0.004*s,0.007),(NECK+0.050*s,0.006)):
        side=_radius(zz,math.pi/2)+extra; back=_radius(zz,math.pi)+extra; ring=[]
        for k in range(seg):
            a=2*math.pi*k/seg; bk=back+(0.016 if math.cos(a)>0 else 0); r=1/math.sqrt((math.sin(a)/side)**2+(math.cos(a)/bk)**2); ring.append(bm.verts.new((math.sin(a)*r,J('Neck').y-math.cos(a)*r,zz)))
        rings.append(ring)
    for r0,r1 in zip(rings,rings[1:]):
        for k in range(seg): bm.faces.new((r0[k],r0[(k+1)%seg],r1[(k+1)%seg],r1[k]))
    rigid('Collar',bm,'Collar','Spine2')
if G.get('tie'):         # a plain tie: a small knot and a narrow strip lying on the chest
    bm=bmesh.new(); zk=NECK-0.018*s; n=6; L=0.20*s; row=[]
    for t in range(n+1):
        f=t/n; z=zk-0.012-L*f; w=0.014+0.012*f*(1 if f<0.85 else 0.4); y=_front(z)-0.012
        row.append((bm.verts.new((-w,y,z)),bm.verts.new((w,y,z))))
    for (a0,a1),(b0,b1) in zip(row,row[1:]): bm.faces.new((a0,a1,b1,b0))
    yk=_front(zk)-0.012; bmesh.ops.create_uvsphere(bm,u_segments=8,v_segments=6,radius=0.014,matrix=Matrix.Translation((0,yk,zk)))
    rigid('Tie',bm,'Tie','Spine2')
if G.get('bun'):         # hair gathered into a bun at the back of the head
    zb=TOP-0.07*s; hit=tree.ray_cast(Vector((0,1,zb)),Vector((0,-1,0)))[0]; yb=(hit.y if hit else 0.09)+0.022
    bm=bmesh.new(); bmesh.ops.create_uvsphere(bm,u_segments=12,v_segments=8,radius=0.048*s,matrix=Matrix.Translation((0,yb,zb))@Matrix.Diagonal((1.15,0.85,0.9,1)))
    rigid('Bun',bm,'Hair','Head')
if G.get('headtie'):     # the knot at the back of the head, two lobes and short ends
    zb=HEAD+0.075*s; hit=tree.ray_cast(Vector((0,1,zb)),Vector((0,-1,0)))[0]; yb=(hit.y if hit else 0.09)+0.034
    bm=bmesh.new()
    for dx in (-0.032*s,0.032*s):
        bmesh.ops.create_uvsphere(bm,u_segments=10,v_segments=7,radius=0.03*s,matrix=Matrix.Translation((dx,yb,zb))@Matrix.Diagonal((1.25,0.7,0.85,1)))
    bmesh.ops.create_uvsphere(bm,u_segments=8,v_segments=6,radius=0.019*s,matrix=Matrix.Translation((0,yb+0.006,zb)))
    rigid('TieKnot',bm,'Hat','Head')
if G.get('glasses'):     # plain round-rimmed glasses: two rims, a bridge and two arms back to the ears
    ev=[eyes.matrix_world@v.co for v in eyes.data.vertices]; bm=bmesh.new()
    for sx in (1,-1):
        side=[v for v in ev if v.x*sx>0]; c=sum(side,Vector())/len(side); r=0.021*s; yf=min(v.y for v in side)-0.014
        g=bmesh.ops.create_cone(bm,cap_ends=False,segments=18,radius1=r,radius2=r,depth=0.004,matrix=Matrix.Translation((c.x,yf,c.z))@Matrix.Rotation(math.radians(90),4,'X'))
        a0=Vector((sx*(abs(c.x)+r),yf,c.z+0.004)); a1=Vector((sx*0.072*s,yf+0.10*s,c.z+0.004))
        q=[bm.verts.new(a0),bm.verts.new(a1),bm.verts.new(a1+Vector((0,0,0.004))),bm.verts.new(a0+Vector((0,0,0.004)))]; bm.faces.new(q if sx>0 else q[::-1])
        if sx>0: bx=abs(c.x)-r; bz=c.z+0.006; byf=yf
    q=[bm.verts.new(v) for v in ((-bx,byf,bz),(bx,byf,bz),(bx,byf,bz+0.004),(-bx,byf,bz+0.004))]; bm.faces.new(q)
    rigid('Glasses',bm,'Glasses','Head')
if G.get('scarf'):          # the knot at the throat
    z=NECK-0.05*s; hit=tree.ray_cast(Vector((0,-1,z)),Vector((0,1,0)))[0]; y=(hit.y if hit else -0.07)-0.03; bm=bmesh.new()
    k=[bm.verts.new((dx,y,z+dz)) for dx,dz in ((-0.02,0.0),(0.02,0.0),(0.012,-0.06),(-0.014,-0.056))]; bm.faces.new(k)
    rigid('Knot',bm,'Scarf','Spine2')
if G.get('bands'):
    # a 1690 cravat: a soft linen neckcloth wound round the throat, tied in front, its two ends falling over the chest
    def front(z):
        hit=tree.ray_cast(Vector((0,-1,z)),Vector((0,1,0)))[0]; return hit.y if hit else -0.08
    def radius(z,a):
        o=Vector((0,J('Neck').y,z)); d=Vector((math.sin(a),-math.cos(a),0)); hit=tree.ray_cast(o+d*0.3,-d)[0]
        return (hit-o).length if hit else 0.06
    bm=bmesh.new(); seg=20; rings=[]
    for zz in (NECK-0.04*s,NECK-0.018*s,NECK+0.006*s):        # the wrap round the neck
        ring=[]
        for k in range(seg):
            a=2*math.pi*k/seg; r=radius(zz,a)+0.008; ring.append(bm.verts.new((math.sin(a)*r,J('Neck').y-math.cos(a)*r,zz)))
        rings.append(ring)
    for r0,r1 in zip(rings,rings[1:]):
        for k in range(seg): bm.faces.new((r0[k],r0[(k+1)%seg],r1[(k+1)%seg],r1[k]))
    zk=NECK-0.05*s; yk=front(zk)-0.03        # the knot
    knot=bmesh.ops.create_uvsphere(bm,u_segments=10,v_segments=6,radius=0.016,matrix=Matrix.Translation((0,yk,zk)))
    for v in knot['verts']: v.co.x=v.co.x*1.7; v.co.y=yk+(v.co.y-yk)*0.6; v.co.z=zk+(v.co.z-zk)*0.85
    # the two hanging ends, following the chest, slightly splayed and widening to a lace edge
    for sx in (-1,1):
        n=7; L=0.16*s; row=[]
        for t in range(n+1):
            f=t/n; z=zk-0.01-L*f; w=0.024+0.02*f; cx=sx*(0.008+0.012*f); y=front(z)-0.03-0.006*math.sin(f*3.1)
            row.append((bm.verts.new((cx-w*0.5,y,z)),bm.verts.new((cx+w*0.5,y,z))))
        for (a0,a1),(b0,b1) in zip(row,row[1:]):
            q=(a0,a1,b1,b0); bm.faces.new(q if sx>0 else q[::-1])
    rigid('Bands',bm,'Bands','Spine2')
if G.get('apron'):
    bm=bmesh.new(); nu,nv=10,16; rows=[]; ZA,ZE=HIP+0.1*s,KNEE+0.02
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
cov_arm=max(sleeve, G.get('coatsleeve',0) if G.get('coat') and G.get('coatsleeves',True) else 0, G.get('jacketsleeve',0.9) if G.get('jacket') else 0, G.get('cardigansleeve',0.92) if G.get('cardigan') else 0)
def hidden(c):
    if HIP+0.05*s<c.z<NECK-0.07*s and abs(c.x)<SX*0.8: return True
    t=side_arm(c)
    if t is not None and 0.08<t<cov_arm-0.06 and abs(c.x)>SX*0.75: return True
    if G.get('breeches') and (ANK+0.03 if G.get('trousers') else (KNEE+0.10*s if G.get('breechkind')=='shorts' else KNEE))<c.z<HIP+0.05*s and abs(c.x)<SX*0.9 and side_arm(c) is None: return True
    if G.get('skirt') and SKIRT_ZB+0.04<c.z<HIP+0.05*s and side_arm(c) is None: return True
    if G.get('shoes') and c.z<ANK+0.02: return True
    return False
bmesh.ops.delete(bm,geom=[f for f in bm.faces if not all(v[dl].get(gi,0)>0 for v in f.verts) or hidden(cz(f))],context='FACES'); bm.to_mesh(h.data); bm.free()
h.data.materials.clear(); h.data.materials.append(colmat('Skin',0.68)); h.name='Body'
LIPZ=HEAD+0.025*s; BROWZ=HEAD+0.10*s
def paint(o):
    me=o.data; bm=bmesh.new(); bm.from_mesh(me); cl=bm.loops.layers.float_color.new('Col')
    for f in bm.faces:
        name=me.materials[f.material_index].name.split('.')[0]; base=COL[name]
        for l in f.loops:
            p=l.vert.co; col=base.copy()
            if o is h:
                if G.get('stockings') and ANK-0.01<p.z<KNEE+0.02: col=COL['Stockings'].copy()
                if G.get('socks') and ANK-0.01<p.z<ANK+0.17*s: col=COL['Socks'].copy()
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
        if n.type=='TEX_IMAGE' and n.image: n.image.filepath=os.path.abspath('shared/rig/eye.png'); n.image.reload()
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
os.makedirs('build/people',exist_ok=True); bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath('build/people/'+P['name']+'.blend'))
bpy.context.scene['vertexColorSpace'] = 'linear'
bpy.ops.export_scene.gltf(export_extras=True,filepath=OUT+P['name']+'.glb',export_image_format='JPEG',export_apply=False,export_vertex_color='NAME',export_vertex_color_name='Col',export_skins=True,export_animations=False,export_rest_position_armature=False)
# a copy for Mixamo: rest pose, with skin, so the user can pick animations for it
if P.get('fbx'):
    rig.data.pose_position='REST'; bpy.context.view_layer.update()
    bpy.ops.export_scene.fbx(filepath=os.path.abspath('build/people/'+P['name']+'_for_mixamo.fbx'),object_types={'ARMATURE','MESH'},add_leaf_bones=False,path_mode='COPY',embed_textures=True,colors_type='SRGB',mesh_smooth_type='FACE',bake_anim=False)
    rig.data.pose_position='POSE'
