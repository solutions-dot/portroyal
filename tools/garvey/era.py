# Garvey-era characters (about 1900 to 1930). A copy of tools/people/npc.py with extra garments:
#   trousers, waistcoat, collar, tie, flat cap (hat:'flat'), and for women a long skirt, a high-necked blouse (highneck) and a bun.
# It also builds Port Royal's people (recipes in tools/people/, top-level "era": 1690): tools/people/npc.py is the old builder, kept only for reference.
# Everything that is new for 1690 sits behind OLD (era before 1800) or behind garments no later recipe uses (coat, bands, cap, slops), so later eras build the same as before.
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
for _n,_w in P.get('targets',{}).items():      # finer shaping of the face and body (MakeHuman's own targets), for a likeness
    for _nn in ([_n.replace('lr-','l-'),_n.replace('lr-','r-')] if _n.startswith('lr-') else [_n]): TargetService.load_target(h,TargetService.target_full_path(_nn),weight=_w,name=_nn)
def ov(o): return bpy.context.temp_override(object=o,active_object=o,selected_objects=[o],selected_editable_objects=[o])
with ov(h): bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
if P.get('upscale'):       # a child is built at a child's shape, then enlarged so the hips sit near an adult's height: every animation clip then fits, and the game shrinks the child back with its scale
    for v in h.data.vertices: v.co*=P['upscale']
    h.data.update()
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
bh=bmesh.new(); bh.from_mesh(h.data); tree=BVHTree.FromBMesh(bh)
def sstep(a,b,x): t=max(0.0,min(1.0,(x-a)/(b-a))); return t*t*(3-2*t)
LHIP,LKNEE,LANK=J('LeftUpLeg'),J('LeftLeg'),J('LeftFoot'); NJ=J('Neck')
_c=tree.ray_cast(Vector((0,LHIP.y,0.3*s)),Vector((0,0,1)))[0]; CROTCH=_c.z if _c else HIP-0.09*s   # where the legs part
def leg_axis(z,sx):      # the point on a leg's own centre line at height z
    a,b=(LHIP,LKNEE) if z>LKNEE.z else (LKNEE,LANK); t=max(-0.3,min(1.3,(a.z-z)/(a.z-b.z))); q=a.lerp(b,t); return Vector((q.x*sx,q.y,z))
def arm_axis(c):         # nearest point on the arm's centre line (shoulder, elbow, wrist), and how far along it is (0 to 1)
    sx=1 if c.x>=0 else -1; best=None; L1=(EL-SH).length; L2=(HA-EL).length
    for a,b,t0,t1 in ((SH,EL,0,L1/(L1+L2)),(EL,HA,L1/(L1+L2),1)):
        a=Vector((a.x*sx,a.y,a.z)); b=Vector((b.x*sx,b.y,b.z)); d=b-a; t=max(0,min(1,(c-a).dot(d)/d.length_squared)); q=a+d*t
        if best is None or (q-c).length<best[0]: best=((q-c).length,q,t0+(t1-t0)*t)
    return best[1],best[2]
def rad_out(z,a,yc=None):    # distance from the body's middle line out to its surface, at height z, in direction a (0 is the front)
    o=Vector((0,NJ.y if yc is None else yc,z)); d=Vector((math.sin(a),-math.cos(a),0)); hit=tree.ray_cast(o,d)[0]
    return (hit-o).length if hit else 0.1
def srgb(c): return Vector(tuple((x/255)**2.2 for x in c))
MATS={}
def colmat(name,rough=0.9):
    if name in MATS: return MATS[name]
    m=bpy.data.materials.new(name); nt=m.node_tree
    if nt is None: m.use_nodes=True; nt=m.node_tree
    b=next(n for n in nt.nodes if n.type=='BSDF_PRINCIPLED'); b.inputs['Roughness'].default_value=rough
    vc=nt.nodes.new('ShaderNodeVertexColor'); vc.layer_name='Col'; nt.links.new(vc.outputs['Color'],b.inputs['Base Color']); MATS[name]=m; return m
COL={k:srgb(v) for k,v in P['colors'].items()}
for k,v in (('Sole',(34,26,22)),('Belt',(52,36,26)),('Buttons',(226,220,204)),('Buckle',(150,130,80)),('Band',(30,28,30)),('Ribbon',(200,40,60)),('Sock',(236,232,224))): COL.setdefault(k,srgb(v))
if 'Shirt' in COL: COL.setdefault('Collar',COL['Shirt'])      # a collar is the shirt's own cloth unless the recipe says otherwise
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
        if v.co.y<0 and abs(v.co.x)<SX*0.8 and HIP-0.02<v.co.z<CHEST_TOP+0.02: cols.setdefault(round(v.co.x/0.02),[]).append(v)
    for k,vs in cols.items():
        vs.sort(key=lambda v:-v.co.z); lo=0.0
        for v in vs:
            lo=min(lo,v.co.y)
            if v.co.y>lo:
                k=max(0.0,min(1.0,(v.co.z-(WAIST+0.02))/0.10))   # full hang over the belly, gathered back in above the waistband
                hang=lo+(v.co.y-lo)*0.15; v.co.y=v.co.y+(hang-v.co.y)*k*k
    bm.normal_update()
def smooth_edge(bm,iters=6,ok=None):
    # cuts made on part of the mesh leave a stair-stepped edge: relax each boundary vertex toward its two boundary neighbours
    for _ in range(iters):
        mv={}
        for v in bm.verts:
            if not v.is_boundary or (ok and not ok(v.co)): continue
            nb=[e.other_vert(v) for e in v.link_edges if e.is_boundary]
            if len(nb)==2: mv[v]=(nb[0].co+nb[1].co)*0.5
        for v,c in mv.items(): v.co=v.co.lerp(c,0.55)
    bm.normal_update()
def trim_seat(bm):
    # keep breeches from ballooning out behind: cap how far the seat sticks out past the small of the back
    ys=[v.co.y for v in bm.verts if v.co.y>0 and abs(v.co.z-(HIP+0.1))<0.02]
    if not ys: return
    cap=max(ys)+0.012
    for v in bm.verts:
        if v.co.y>cap: v.co.y=cap+(v.co.y-cap)*0.3
    bm.normal_update()
G=P['garments']; parts=[]; OLD=P.get('era',1915)<1800
if G.get('trousers'): G['breeches']=True; G['breechkind']='trousers'
WAIST=HIP+0.13 if G.get('breeches') else HIP+0.02   # with breeches the shirt is tucked in under their waistband
def arm_ok(c,upto):
    t=side_arm(c); return t is None or t<=upto+0.06
sleeve=G.get('sleeve',0.86)
cuts_sleeve=lambda t:[(armcut(t,1)[0],armcut(t,1)[1],lambda c:c.x>SX*0.8 and (OLD or side_arm(c) is not None)),(armcut(t,-1)[0],armcut(t,-1)[1],lambda c:c.x<-SX*0.8 and (OLD or side_arm(c) is not None))]
CK=G.get('collar')
if CK: CK='stand' if CK is True and P.get('era',1915)<1925 and not G.get('softcollar') else ('turn' if CK is True else CK)
if OLD and not CK and not G.get('bands') and not (G.get('coat') and G.get('coatsleeves',True)): CK='band'      # a 1690 shirt worn without a coat ends in a narrow neckband, open at the throat: it is built like the later collars, so its edge is clean and no skin shows under it
FLAT=CK in ('camp','round')      # the flat collars of the 1950s: 'camp' is an open pointed collar over a V neck (men's sports shirts, women's blouses), 'round' a flat round collar on a close neckline
VD=G.get('vdepth',0.13 if G.get('woman') else 0.115)*s; VZ=NECK-VD; VK=G.get('vslope',2.1)      # the V of a camp collar: its lowest point, and how steep its sides are
NCUT=NECK-(0.004 if G.get('highneck') else (0.014 if CK and CK not in ('open','camp') else 0.035))*s-(0.06*s if G.get('coat') and G.get('coatsleeves',True) else 0)
def sleeve_tube(r0,r1,cuff=None,blend=False):
    def f(v):
        c=v.co
        if abs(c.x)<SX*0.92: return
        q,t=arm_axis(c); d=c-q; r=d.length or 1e-6; k=sstep(0.06,0.2,t)*(1-sstep(0.075,0.10,r/s)); R=(r0+(r1-r0)*t)*s
        if blend: k*=sstep(SX*0.92,SX*1.12,abs(c.x))      # eased in from the shoulder, so the cloth does not crease at the armpit
        if cuff and t>cuff[0]: R=cuff[1]*s
        rn=max(r+0.004,R); v.co=q+d/r*(r+(rn-r)*k)
    return f
def puff_tube(end):      # a short puffed sleeve: full and round from the shoulder, gathered into a snug band just above its end
    def f(v):
        c=v.co
        if abs(c.x)<SX*0.92: return
        q,t=arm_axis(c); d=c-q; r=d.length or 1e-6; u=min(1.0,t/max(0.05,end-0.035)); k=sstep(0.02,0.10,t)*(1-sstep(0.075,0.10,r/s))
        R=(0.046+G.get('puff',1.0)*0.034*math.sin(math.pi*u**0.85)**0.7)*s if u<1 else 0
        rn=max(r+0.003,R); v.co=q+d/r*(r+(rn-r)*k)
    return f
# shirt
def under_coat(c):   # the shirt sleeve between shoulder and cuff is hidden by the coat sleeve; leaving it there made it push through on the backs of the arms
    if not (G.get('coat') and G.get('coatsleeves',True)): return False
    t=side_arm(c); return t is not None and 0.1<t<G.get('coatsleeve',0.82)-0.1
parts.append(('shirt',piece('Shirt','helper-tights',lambda c:c.z>(HIP+0.07 if G.get('breeches') else HIP-0.02) and arm_ok(c,sleeve) and not under_coat(c),lambda c:0.012 if abs(c.x)>SX*0.8 else 0.008,'Shirt',shape=sleeve_tube(0.053,0.042,(sleeve-0.07,0.036) if sleeve>0.8 else None) if not G.get('woman') else (puff_tube(sleeve) if G.get('puff') else sleeve_tube(0.050,0.038,(sleeve-0.06,0.032) if sleeve>0.8 else None)),post=((lambda bm:smooth_edge(bm,ok=lambda c:not (c.y<0 and c.z>VZ-0.012 and abs(c.x)<0.075*s))) if G.get('woman') and CK=='camp' else smooth_edge if G.get('woman') else ((smooth_edge if OLD else None) if G.get('coat') else ((lambda bm:(drape_front(bm),smooth_edge(bm))) if G.get('smooth') else drape_front))),
   cuts=[((0,0,NECK+0.005-(0.062*s if G.get('coat') and G.get('coatsleeves',True) else 0)),(0,0,1),None),((0,-0.1,NCUT),Vector((0,-0.5,0.87)),lambda c:c.y<0)]+([((0,0,VZ),Vector((-VK,0,1)).normalized(),lambda c:c.y<0 and c.x>0),((0,0,VZ),Vector((VK,0,1)).normalized(),lambda c:c.y<0 and c.x<0)] if CK=='camp' else [])+cuts_sleeve(sleeve))))   # under a coat the shirt stays below the coat's collar; a camp collar opens the front in a narrow V
if G.get('coat'):
    cs=G.get('coatsleeve',0.82); collar=NECK-0.012*s
    sl=G.get('coatsleeves',True)
    coat=piece('Coat','helper-tights',(lambda c:c.z>HIP-0.02 and arm_ok(c,cs)) if sl else (lambda c:c.z>HIP-0.02 and abs(c.x)<SX*0.9),lambda c:0.03 if abs(c.x)>SX*0.8 else 0.022,'Coat',shape=sleeve_tube(0.041,0.037,(cs-0.13,0.047),blend=True) if sl else None,post=lambda bm:(drape_front(bm),smooth_edge(bm,3 if sl else 10)),
       cuts=[((0,0,collar),(0,0,1),None),((0,-0.1,collar-0.045*s),Vector((0,-0.6,0.8)),lambda c:c.y<0)]+(cuts_sleeve(cs) if sl else [((SX*0.78,0,0),(1,0,0),None),((-SX*0.78,0,0),(-1,0,0),None)]))
    parts.append(('coat',coat))
    hem=G.get('coathem')
    if hem:
        ZT=HIP+0.06; ZB=KNEE+hem
        def flare(v):
            t=max(0,(ZT-v.co.z)/(ZT-ZB)); f=1+0.26*t*t+0.07*t; v.co.x*=f; v.co.y=(v.co.y+0.02)*f*(1+0.15*t*(v.co.y>0))-0.02
        op=G.get('coatopen',True)   # 1690 coats hang open at the front below the waist: an opening that widens to the hem, so the knees pass through instead of poking out
        front_gap=lambda c: op and c.y<-0.01 and abs(c.x)<0.018+0.075*max(0.0,min(1.0,(ZT-c.z)/(ZT-ZB)))
        back_vent=lambda c: op and c.y>0.01 and abs(c.x)<0.008+0.035*max(0.0,min(1.0,(ZT-c.z-0.08)/(ZT-ZB)))   # and a vent up the back, as 1690 coats had
        sk=piece('CoatSkirt','helper-skirt',lambda c:ZB<c.z<ZT+0.02 and not front_gap(c) and not back_vent(c),lambda c:(0.028+0.017*sstep(ZT-0.01,ZT-0.13,c.z)) if c.y<-0.02 else 0.03,'Coat',cuts=[((0,0,ZB),(0,0,-1),None)],shape=flare,post=lambda bm:smooth_edge(bm,4,lambda c:c.z<ZT-0.06 and c.z>ZB+0.004))
        parts.append(('coatskirt',sk))
if G.get('breeches'):
    bk=G.get('breechkind','plain'); low=(ANK+(0.035 if not G.get('shorts') else 0)) if bk=='trousers' else KNEE-0.05*s
    if G.get('shorts'): low=KNEE+0.05*s
    wide=0.012 if bk in ('trousers','slops') else 0.013
    def breech_leg(v):
        # 1690 breeches are cut full and gathered into a band below the knee; a sailor's slops are wide open tubes. Either way the cloth hangs from the thigh instead of clinging to it
        z=v.co.z
        if z>CROTCH+0.07: return
        k=sstep(CROTCH+0.07,CROTCH-0.05,z); sx=1 if v.co.x>=0 else -1; ax=leg_axis(z,sx); t=max(0.0,min(1.0,(CROTCH-z)/(CROTCH-low)))
        d=Vector((v.co.x-ax.x,v.co.y-ax.y)); r=d.length or 1e-6; a=math.atan2(d.x*sx,-d.y)
        if bk=='slops': R=(0.096+0.024*t)*s+0.003*math.sin(a*5+z*40)*t
        else: R=(0.094-0.006*t)*s*(1-0.30*sstep(0.78,0.97,t))+0.0025*math.sin(a*6)*math.sin(t*math.pi)
        if G.get('coat') and G.get('coathem') and t<0.72: R=r+0.004+(R-r-0.004)*sstep(1.5,0.8,abs(a))      # under a coat's skirt the fullness is kept to the front, where the coat is open: at the sides and back the breeches lie close, so they cannot push out through the skirt
        rn=r+(max(r+0.006,R)-r)*k; v.co.x=ax.x+d.x/r*rn; v.co.y=ax.y+d.y/r*rn
        if v.co.x*sx<0.004: v.co.x=0.004*sx
    LEGW=G.get('legwidth',1.0)
    def trouser_leg(v):
        # cloth does not cling: below the seat each leg becomes a tube that hangs from the thigh, a little narrower at the hem, with a soft crease and a break over the shoe
        z=v.co.z
        if z>CROTCH+0.07: return
        k=sstep(CROTCH+0.07,CROTCH-0.05,z); sx=1 if v.co.x>=0 else -1; ax=leg_axis(z,sx); t=max(0.0,min(1.0,(CROTCH-z)/(CROTCH-low)))
        ax.y-=0.012*s*math.sin(t*math.pi)   # the knee sits forward of the straight line from hip to ankle
        d=Vector((v.co.x-ax.x,v.co.y-ax.y)); r=d.length or 1e-6; a=math.atan2(d.x*sx,-d.y)
        R=(0.090-0.018*t)*s*LEGW*(1+0.05*math.cos(a)*(0.3+t))+0.002*math.sin(z*60+a*2)*t   # egg shaped: the crease in front; small folds lower down
        rn=r+(max(r+0.007,R)-r)*k; v.co.x=ax.x+d.x/r*rn; v.co.y=ax.y+d.y/r*rn
        if v.co.x*sx<0.004: v.co.x=0.004*sx
        if t>0.9: v.co.y-=0.012*s*(t-0.9)/0.1   # the hem breaks forward over the shoe
    parts.append(('breeches',piece('Breeches','helper-tights',lambda c:low-0.03<c.z<HIP+0.13 and side_arm(c) is None,wide,'Breeches',post=trim_seat,shape=trouser_leg if bk=='trousers' else breech_leg,cuts=[((0,0,low),(0,0,-1),None),((0,0,HIP+0.12),(0,0,1),None)])))
if G.get('waistcoat'):
    wcol=NECK-0.02*s
    parts.append(('waistcoat',piece('Waistcoat','helper-tights',lambda c:c.z>HIP+0.03 and abs(c.x)<SX*0.9,lambda c:0.03 if abs(c.x)>SX*0.8 else 0.022,'Waistcoat',post=lambda bm:(drape_front(bm),smooth_edge(bm)),
        cuts=[((0,0,wcol),(0,0,1),None)]+([((0,0,wcol-0.17*s),Vector((-1.1,0,1)).normalized(),lambda c:c.y<0 and c.x>0),((0,0,wcol-0.17*s),Vector((1.1,0,1)).normalized(),lambda c:c.y<0 and c.x<0)] if G.get('vwaist') else [((0,-0.1,wcol-0.13*s),Vector((0,-0.6,0.8)),lambda c:c.y<0)])+[((SX*0.78,0,0),(1,0,0),None),((-SX*0.78,0,0),(-1,0,0),None)])))
if G.get('jacket'):   # a plain suit jacket: waist-length hem, sleeves to the wrist, a V opening over the waistcoat
    jcol=NECK-0.012*s; jcs=G.get('jacketsleeve',0.9)
    vz=jcol-0.20*s   # the V opening: two angled cuts, one each side of the middle, so only a narrow wedge is removed and the shoulders stay covered
    parts.append(('jacket',piece('Jacket','helper-tights',lambda c:c.z>HIP+0.03 and arm_ok(c,jcs),lambda c:0.022 if abs(c.x)>SX*0.8 else 0.017,'Jacket',shape=sleeve_tube(0.054,0.045),post=lambda bm:(drape_front(bm),smooth_edge(bm)),
        cuts=[((0,0,jcol),(0,0,1),None),((0,0,vz),Vector((-1.5,0,1)).normalized(),lambda c:c.y<0 and c.x>0),((0,0,vz),Vector((1.5,0,1)).normalized(),lambda c:c.y<0 and c.x<0)]+cuts_sleeve(jcs))))
SKB=ANK+0.07+G.get('hem',0)*(KNEE-ANK-0.07)      # the skirt's hem: hem 0 is the ankle, 1 the knee
if G.get('jacket'):
    JT=HIP+0.07; JB=CROTCH-G.get('jackethem',0.05)*s
    def jflare(v): t=max(0,(JT-v.co.z)/(JT-JB)); f=1+0.05*t; v.co.x*=f; v.co.y=(v.co.y+0.02)*f-0.02
    parts.append(('jacketskirt',piece('JacketSkirt','helper-skirt',lambda c:JB<c.z<JT+0.02,0.024,'Jacket',cuts=[((0,0,JB),(0,0,-1),None)],shape=jflare)))
if G.get('skirt'):
    ZT=HIP+0.08; ZB=SKB; FL=G.get('flare',1.0); NP=G.get('pleats',9)
    def flare2(v):
        t=max(0,(ZT-v.co.z)/(ZT-ANK-0.07)); f=1+(0.12*t*t+0.06*t)*FL; v.co.x*=f; v.co.y=(v.co.y+0.02)*f*(1+0.10*t*(v.co.y>0))-0.02
        a=math.atan2(v.co.x,-(v.co.y+0.02)); w=1+0.03*FL*min(1.0,t*3)*math.sin(a*NP+0.6)*(0.4+t); v.co.x*=w; v.co.y=(v.co.y+0.02)*w-0.02   # soft folds that deepen toward the hem
    parts.append(('skirt',piece('Skirt','helper-skirt',lambda c:ZB<c.z<ZT+0.02,0.03,'Skirt',cuts=[((0,0,ZB),(0,0,-1),None)],shape=flare2,sub=True)))
def shoe_post(bm):      # a leather shoe is one smooth shape: no toes show through it
    smooth_edge(bm); vs=[v for v in bm.verts if not v.is_boundary and v.co.z<ANK+0.03]
    for _ in range(8): bmesh.ops.smooth_vert(bm,verts=vs,factor=0.5,use_axis_x=True,use_axis_y=True,use_axis_z=True)
    bm.normal_update()
    for v in vs: v.co+=v.normal*0.002
if G.get('shoes'):
    LOWCUT=G.get('lowshoes',bool(G.get('skirt')))     # with a skirt: a low court shoe that shows the top of the foot; otherwise a laced shoe to the ankle
    parts.append(('shoes',piece('Shoes','helper-tights',lambda c:c.z<ANK+0.09,0.006,'Shoes',post=shoe_post if OLD else smooth_edge,cuts=[((0,0,ANK*0.82),(0,0,1),None)] if LOWCUT else [((0,0,ANK+0.045),(0,0,1),None)])))
if os.environ.get('PROBE'):
    for gn in ('scalp','lips','ears'):
        gi_=GI[gn]; vs=[v.co for v in h.data.vertices if any(g.group==gi_ and g.weight>0 for g in v.groups)]
        print('PROBE',gn,len(vs),'x',round(min(c.x for c in vs),3),round(max(c.x for c in vs),3),'y',round(min(c.y for c in vs),3),round(max(c.y for c in vs),3),'z',round(min(c.z for c in vs),3),round(max(c.z for c in vs),3))
    print('PROBE HEAD',round(HEAD,3),'s',round(s,3),'headY',round(J('Head').y,3))
    fr=[v.co for v in h.data.vertices if any(g.group==GI['scalp'] and g.weight>0 for g in v.groups) and abs(v.co.x)<0.01]; print('PROBE scalp mid front',sorted([(round(c.y,3),round(c.z,3)) for c in fr])[:4])
# short hair: a close cap over the scalp, edged like a hairline
WA=Vector((0,-0.115*s,HEAD+(0.15+G.get('recede',0))*s)); WN=Vector((0,-0.20,-0.18)).normalized()
def hair_post(bm):
    # hair grows from the scalp: thin at the hairline, fuller a little way in. 'ramp' (0 at the edge, 1 inside) is kept on the mesh so the colour can fade into the skin there
    rl=bm.verts.layers.float.new('ramp'); dist={v:0 for v in bm.verts if v.is_boundary}; front=list(dist)
    while front:
        nx=[]
        for v in front:
            for e in v.link_edges:
                o=e.other_vert(v)
                if o not in dist: dist[o]=dist[v]+e.calc_length(); nx.append(o)
        front=nx
    bm.normal_update(); vol=(min(G.get('hairvol',0),0.25) if G.get('hat') else G.get('hairvol',0)); big=0.03 if G.get('hair')=='afro' and not G.get('hat') else 0.006
    for v in bm.verts:
        r=min(1.0,dist.get(v,1)/0.022)**0.8
        if G.get('fade'): r*=1-G['fade']*sstep(0.035*s,0.10*s,TOPZ-v.co.z)*(0.35+0.65*sstep(0.03*s,0.06*s,abs(v.co.x)))   # sides and back cut very short, so the skin shows through
        if G.get('bays'):      # the hairline has gone back at each temple, leaving a rounded bay of bare skin either side of the middle
            for sx in (-1,1): r*=sstep(0.5,1.0,(v.co-(F0+Vector((sx*0.054*s,0.004*s,0.010*s)))).length/(G['bays']*0.046*s))
        v[rl]=r; v.co+=v.normal*((0.0025+big*vol+0.0022*noise.noise(v.co*150))*r)
    smooth_edge(bm,3)
F0=min([v.co for v in h.data.vertices if abs(v.co.x)<0.012 and v.co.y<J('Head').y-0.06 and any(g.group==GI['scalp'] and g.weight>0 for g in v.groups)],key=lambda c:c.z)   # the middle of the natural hairline
SCALP=GI['scalp']; TOPZ=max(v.co.z for v in h.data.vertices if abs(v.co.x)<0.05 and any(g.group==SCALP and g.weight>0 for g in v.groups))
def _hair_cuts():
    if not (G.get('recede') or G.get('temples')): return []
    fr=[v.co for v in h.data.vertices if abs(v.co.x)<0.012 and v.co.y<J('Head').y-0.06 and any(g.group==SCALP and g.weight>0 for g in v.groups)]; f0=min(fr,key=lambda c:c.z)   # the middle of the natural hairline
    out=[(f0+Vector((0,0,G.get('recede',0)*s)),Vector((0,-0.55,-0.83)).normalized(),lambda c:c.y<J('Head').y-0.03)]
    if G.get('temples'): out+=[(f0+Vector((sx*0.052*s,0.010*s,(G.get('recede',0)+0.002)*s)),Vector((sx*0.50,-0.50,-0.70)).normalized(),(lambda c,sx=sx:c.x*sx>0.02*s and c.y<J('Head').y-0.03)) for sx in (-1,1)]
    return out
if G.get('hair')!='none': parts.append(('hair',piece('Hair','scalp',lambda c:True,0.0006,'Hair',cuts=_hair_cuts(),sub=True,post=hair_post)))
# a knitted cap and a neckerchief made from the body's own surface, so they fit and move with it
if G.get('hat')=='cap':
    Jy=J('Head').y
    parts.append(('cap',piece('Cap','body',lambda c:c.z>HEAD+0.02,0.013,'Hat',cuts=[((0,Jy,HEAD+0.088*s),Vector((0,-0.075,-0.2)).normalized(),None)],sub=True)))
if G.get('scarf'):
    parts.append(('scarf',piece('Scarf','body',lambda c:NECK-0.045*s<c.z<NECK+0.03*s and abs(c.x)<0.085,lambda c:0.018+0.02*max(0.0,min(1.0,(NECK-c.z)/(0.045*s))),'Scarf')))
clothes=[o for k,o in parts]
for o in clothes:
    md=o.modifiers.new('wt','DATA_TRANSFER'); md.object=h; md.use_vert_data=True; md.data_types_verts={'VGROUP_WEIGHTS'}
    md.vert_mapping='POLYINTERP_NEAREST'; md.layers_vgroup_select_src='ALL'; md.layers_vgroup_select_dst='NAME'
    with ov(o): bpy.ops.object.modifier_move_to_index(modifier='wt',index=0); bpy.ops.object.modifier_apply(modifier='wt')
def smooth_weights(o,sel,iters=5):
    # bone weights are copied from the nearest skin, so where a loose sleeve passes the side of the chest some points follow the arm and their neighbours the ribs: the cloth tears into a zigzag when the arm swings.
    # Averaging each point's weights with its neighbours' makes the cloth bend as one piece
    me=o.data; nb={v.index:[] for v in me.vertices}
    for e in me.edges: a,b=e.vertices; nb[a].append(b); nb[b].append(a)
    W=[{g.group:g.weight for g in v.groups if g.weight>0} for v in me.vertices]; pick=[v.index for v in me.vertices if sel(v.co)]
    for _ in range(iters):
        N={}
        for i in pick:
            if not nb[i]: continue
            acc={}
            for j in nb[i]:
                for g,w in W[j].items(): acc[g]=acc.get(g,0)+w/len(nb[i])
            mix={g:0.5*W[i].get(g,0)+0.5*acc.get(g,0) for g in set(W[i])|set(acc)}; top=sorted(mix.items(),key=lambda x:-x[1])[:4]; tot=sum(w for g,w in top) or 1; N[i]={g:w/tot for g,w in top}
        for i,d in N.items(): W[i]=d
    for i in pick:
        for gi_ in [g.group for g in me.vertices[i].groups]: o.vertex_groups[gi_].remove([i])
        for g,w in W[i].items():
            if w>0.002: o.vertex_groups[g].add([i],w,'REPLACE')
if OLD:
    for k,o in parts:
        if k in ('shirt','coat'): smooth_weights(o,lambda c:abs(c.x)>SX*0.3 and c.z>HIP+0.12,16)
        if k=='breeches':      # each leg of the breeches follows its own leg only: wide slops took some weight from the other thigh and tore at the hem
            for v in o.data.vertices:
                if v.co.z>CROTCH or abs(v.co.x)<0.002: continue
                ws=[(g.group,g.weight) for g in v.groups]; bad=[gi_ for gi_,w in ws if ('Right' if v.co.x>0 else 'Left') in o.vertex_groups[gi_].name]
                if not bad: continue
                for gi_ in bad: o.vertex_groups[gi_].remove([v.index])
                keep=[(gi_,w) for gi_,w in ws if gi_ not in bad]; tot=sum(w for gi_,w in keep)
                if tot<1e-4: o.vertex_groups['mixamorig:'+('Left' if v.co.x>0 else 'Right')+'UpLeg'].add([v.index],1.0,'REPLACE')
                else:
                    for gi_,w in keep: o.vertex_groups[gi_].add([v.index],w/tot,'REPLACE')
            smooth_weights(o,lambda c:c.z<CROTCH+0.06,3)
for k,o in parts:            # coat skirts follow both legs as one cloth, like Abba's skirt
    if k not in ('coatskirt','skirt','jacketskirt'): continue
    B={n:o.vertex_groups['mixamorig:'+n] for n in ('Hips','LeftUpLeg','RightUpLeg')}; idx=list(range(len(o.data.vertices)))
    for g in o.vertex_groups:
        if g.name.startswith('mixamorig:'): g.remove(idx)
    for v in o.data.vertices:
        t=max(0.0,min(1.0,(HIP+0.06-v.co.z)/0.5)); leg=(0.3 if k=='jacketskirt' else 0.6)*sstep(0.1,0.9,t); left=sstep(-1.0,1.0,v.co.x/0.15)
        if k=='coatskirt': front=sstep(0.02,-0.07,v.co.y); leg=front*0.95*sstep(-0.15,0.45,t)+(1-front)*0.25*sstep(0.1,0.9,t)   # the front panels ride on their own thigh (the knee carries them forward), the back hangs from the hips and opens at the vent
        for n,val in (('Hips',1-leg),('LeftUpLeg',leg*left),('RightUpLeg',leg*(1-left))):
            if val>0.001: B[n].add([v.index],val,'REPLACE')
# extra pieces bound to one bone: hat, cap, bands, apron
def rigid(name,bm,mat,bone):
    me=bpy.data.meshes.new(name); bmesh.ops.recalc_face_normals(bm,faces=bm.faces[:]); bm.to_mesh(me); bm.free()
    o=bpy.data.objects.new(name,me); bpy.context.scene.collection.objects.link(o); me.materials.append(colmat(mat))
    for g in h.vertex_groups: o.vertex_groups.new(name=g.name)
    o.vertex_groups['mixamorig:'+bone].add(list(range(len(me.vertices))),1.0,'REPLACE'); o.parent=rig; o.modifiers.new('Armature','ARMATURE').object=rig; clothes.append(o); return o
def top_of_head():
    best=0
    for v in h.data.vertices:
        if v.co.z>best and abs(v.co.x)<0.05: best=v.co.z
    return best
TOP=top_of_head(); HC=Vector((0,J('Head').y+0.005,TOP))
TORSO=('Hips','Spine','Spine1','Spine2','Neck','LeftShoulder','RightShoulder')
def soft(name,bm,mat,only=TORSO):     # an extra piece that bends with the body: it takes its bone weights from the nearest skin, but only for the bones in `only` (so a collar never follows an arm)
    me=bpy.data.meshes.new(name); bmesh.ops.recalc_face_normals(bm,faces=bm.faces[:]); bm.to_mesh(me); bm.free()
    o=bpy.data.objects.new(name,me); bpy.context.scene.collection.objects.link(o); me.materials.append(colmat(mat))
    md=o.modifiers.new('wt','DATA_TRANSFER'); md.object=h; md.use_vert_data=True; md.data_types_verts={'VGROUP_WEIGHTS'}
    md.vert_mapping='POLYINTERP_NEAREST'; md.layers_vgroup_select_src='ALL'; md.layers_vgroup_select_dst='NAME'
    with ov(o): bpy.ops.object.modifier_apply(modifier='wt')
    ok={o.vertex_groups['mixamorig:'+n].index for n in only if 'mixamorig:'+n in o.vertex_groups}; idx=list(range(len(me.vertices)))
    for v in me.vertices:
        w=[(g.group,g.weight) for g in v.groups if g.group in ok and g.weight>0]; tot=sum(x[1] for x in w)
        for g in list(v.groups): o.vertex_groups[g.group].remove([v.index])
        if tot<1e-4: nb=min(only,key=lambda n:(J(n)-v.co).length); (o.vertex_groups.get('mixamorig:'+nb) or o.vertex_groups.new(name='mixamorig:'+nb)).add([v.index],1.0,'REPLACE')   # nothing usable nearby: follow the nearest of the allowed bones
        else:
            for gi_,wt in w: o.vertex_groups[gi_].add([v.index],wt/tot,'REPLACE')
    o.parent=rig; o.modifiers.new('Armature','ARMATURE').object=rig; clothes.append(o); return o
def tree_of(o):
    b=bmesh.new(); b.from_mesh(o.data); return BVHTree.FromBMesh(b)
PART=dict(parts)
SHT=tree_of(PART['shirt'])
def shirt_front(z,x=0.0):      # the y of the shirt's front surface
    hit=SHT.ray_cast(Vector((x,-1,z)),Vector((0,1,0)))[0]; return hit.y if hit else _front(z)-0.008
def quadstrip(bm,rows,flip=False,close=False):
    for r0,r1 in zip(rows,rows[1:]):
        n=len(r0)
        for k in range(n if close else n-1):
            q=(r0[k],r0[(k+1)%n],r1[(k+1)%n],r1[k]); bm.faces.new(q[::-1] if flip else q)
def neck_ring(z):        # the neck's outline at height z as an ellipse: (centre y, half width, half depth), from three measurements
    rf,rb,rs=rad_out(z,0),rad_out(z,math.pi),rad_out(z,math.pi/2); ry=(rf+rb)/2; return NJ.y+(rb-rf)/2,min(rs,ry*1.2),ry
def collar_pt(a,zb,zf,grow):     # a point on a ring round the neck: height zb at the nape, zf at the throat
    f=0.5+0.5*math.cos(a); z=zb+(zf-zb)*f**1.5; yc,rx,ry=neck_ring(zb+(zf-zb)*0.35); return Vector((math.sin(a)*(rx+grow),yc-math.cos(a)*(ry+grow),z))
def collar_base(a): return NECK-0.004-0.008*s*(0.5+0.5*math.cos(a))**1.5
def on_shirt(p,off):      # the nearest point of the shirt to p, lifted off the cloth by `off`
    loc,nrm,_i,_d=SHT.find_nearest(p); return loc+nrm*off
if FLAT:
    # A flat collar that lies on the shirt. Each row runs from the seam at the neckline out to the collar's edge. 'camp': the leaf carries on down each side of the V and ends in a long point
    # that angles outward and down (a notch where it meets the front edge); it stands a little at the nape. 'round': a flat band with rounded ends that meet at the throat.
    bm=bmesh.new(); rows=[]; LW=G.get('leaf',0.047 if G.get('woman') else 0.064)*s; camp=CK=='camp'
    xw=(VD-0.012*s)/VK; a0=0.62 if camp else 0.10; nn=14; nv=6 if camp else 0
    def neck_row(a,wk=1.0):
        f=0.5+0.5*math.cos(a); back=(1-f)**1.2; S=collar_pt(a,NECK+0.004,NECK-0.030*s if camp else NECK-0.012*s,0.010); D=Vector((math.sin(a),-math.cos(a),0)); w=LW*(0.72+0.28*f)*wk
        stand=(0.014*s*back if camp else 0.003*s)
        base=on_shirt(S,0.004); top=S+Vector((0,0,stand))-D*0.002+(base-S)*0.5; mid=on_shirt(S+D*w*0.5+Vector((0,0,-w*0.25)),0.009+0.004*back); out=on_shirt(S+D*w*0.9+Vector((0,0,-w*0.55)),0.006)
        return [base,top,mid,out]
    def v_row(t,sx):      # down the edge of the V: t 0 at its top corner, 1 at the notch
        x=sx*xw*(1-0.62*t); z=VZ+VK*abs(x)-0.002; S=Vector((x,shirt_front(z,x)-0.004,z)); D=Vector((sx*0.86,0,-0.5)); w=LW*(1.0+0.12*t)
        base=on_shirt(S,0.004); mid=on_shirt(S+D*w*0.5,0.009); out=on_shirt(S+D*w,0.006)
        return [base,base.lerp(mid,0.3)+Vector((0,-0.002,0)),mid,out]
    side=[]
    for k in range(nn+1): side.append(math.pi-(math.pi-a0)*k/nn)
    R=[neck_row(a,1.0 if camp or k<nn-2 else (0.82 if k==nn-2 else (0.55 if k==nn-1 else 0.12))) for k,a in enumerate(side)]            # the wearer's one side, nape to front
    Lr=[neck_row(-a,1.0 if camp or k<nn-2 else (0.82 if k==nn-2 else (0.55 if k==nn-1 else 0.12))) for k,a in enumerate(side)]
    rows=[r for r in reversed([v_row((i+1)/nv,1) for i in range(nv)])]+[r for r in reversed(R)][:-1]+[Lr[0]]+Lr[1:]+[v_row((i+1)/nv,-1) for i in range(nv)] if camp else [r for r in reversed(R)][:-1]+Lr
    quadstrip(bm,[[bm.verts.new(q) for q in row] for row in rows]); soft('Collar',bm,'Collar',only=('Spine2','Neck','LeftShoulder','RightShoulder'))
if CK and not FLAT:
    # a shirt collar built round the neck itself: a band that stands up from the shirt's neck opening and, for a turn-down collar, a leaf folded over it that ends in two points at the front
    bm=bmesh.new(); seg=32; gap={'stand':0.05,'turn':0.07,'open':0.42,'band':0.16}[CK]; rows=[]; hs=(0.046 if CK=='stand' else (0.014 if CK=='band' else 0.034))*s
    for k in range(seg+1):
        a=gap+(2*math.pi-2*gap)*k/seg; f=0.5+0.5*math.cos(a)
        b0=collar_pt(a,NECK-0.004,NECK-0.004-0.008*s,0.016); row=[]
        if CK!='open':      # under the seam the collar carries on down as a yoke that lies on the skin beneath the shirt, so no skin shows between collar and shirt when the body moves
            for dz in (0.085,0.045):
                zz=b0.z-dz*s*(0.45+0.55*f); rr=rad_out(zz,a)+0.0055; row.append(Vector((math.sin(a)*rr,NJ.y-math.cos(a)*rr,zz)))
        row+=[b0,collar_pt(a,NECK-0.004+hs,NECK-0.012*s+hs,0.007)]
        if CK not in ('stand','band'):
            fr=max(0.0,(f-0.80)/0.20); q=collar_pt(a,NECK-0.004+hs+0.002,NECK-0.012*s+hs+0.002,0.013); e=collar_pt(a,NECK-0.008*s,NECK-0.02*s,0.030) if not (G.get('jacket') or G.get('waistcoat')) else collar_pt(a,NECK+0.004*s,NECK-0.012*s,0.022)
            r0=math.hypot(e.x,e.y-NJ.y); r1=rad_out(e.z,a)+(0.013 if not (G.get('jacket') or G.get('waistcoat')) else 0.011)
            if r1>r0: e.x*=r1/r0; e.y=NJ.y+(e.y-NJ.y)*r1/r0
            if fr>0:      # the points: longer, lying on the shirt front, spread a little apart
                sx=1 if math.sin(a)>=0 else -1; zp=NECK-0.058*s; xp=sx*0.034*s; tip=Vector((xp,shirt_front(zp,xp)-0.008,zp)); e=e.lerp(tip,fr**0.8)
            row+=[q,e]
        rows.append([bm.verts.new(q) for q in row])
    quadstrip(bm,[list(r) for r in zip(*rows)]); soft('Collar',bm,'Shirt' if CK=='band' else 'Collar',only=('Spine2','Neck','LeftShoulder','RightShoulder'))
if G.get('tie'):         # a tie: a knot in the collar's opening and a blade that lies on the shirt, wider toward its tip
    bm=bmesh.new(); zk=collar_base(0)+0.016*s; n=8; L=(0.30 if not (G.get('waistcoat') or G.get('jacket')) else 0.24)*s; rows=[]
    for t in range(n+1):
        f=t/n; z=zk-0.014*s-L*f; w=(0.013+0.022*f)*s if f<0.9 else 0.035*s*(1-f)/0.1+0.002; y=shirt_front(z)-0.007
        rows.append([bm.verts.new((-w,y,z)),bm.verts.new((0,y-0.004,z)),bm.verts.new((w,y,z))])
    quadstrip(bm,rows)
    yk=shirt_front(zk-0.01*s)-0.014; kv=[bm.verts.new((dx*s,yk+dy,zk+dz*s)) for dx,dy,dz in ((-0.019,0.004,0.012),(0.019,0.004,0.012),(0.012,0.004,-0.018),(-0.012,0.004,-0.018),(-0.012,-0.008,0.010),(0.012,-0.008,0.010),(0.008,-0.008,-0.014),(-0.008,-0.008,-0.014))]
    for q in ((4,5,6,7),(0,4,7,3),(5,1,2,6),(7,6,2,3),(0,1,5,4)): bm.faces.new([kv[i] for i in q])
    soft('Tie',bm,'Tie',only=('Spine2','Spine1','Spine','Neck'))
if G.get('buttons',not G.get('woman') and not OLD) and not G.get('coat'):      # the shirt's front band and its buttons
    bm=bmesh.new(); z1=(VZ-0.004*s) if CK=='camp' else collar_base(0)-0.012*s; z0=WAIST+0.01; n=10; rows=[]
    for t in range(n+1):
        z=z1+(z0-z1)*t/n; y=shirt_front(z)-0.003; rows.append([bm.verts.new((-0.014*s,y,z)),bm.verts.new((0.014*s,y,z))])
    quadstrip(bm,rows); soft('Placket',bm,'Shirt')
    if not G.get('tie') or True:
        bm=bmesh.new(); nb=max(3,int((z1-z0)/(0.075*s)))
        for i in range(nb):
            z=z1-0.03*s-(z1-z0-0.04*s)*i/(nb-1); y=shirt_front(z)-0.006
            bmesh.ops.create_circle(bm,cap_ends=True,segments=6,radius=0.0055*s,matrix=Matrix.Translation((0,y,z))@Matrix.Rotation(math.pi/2,4,'X'))
        soft('Buttons',bm,'Buttons')
if G.get('trousers') and G.get('belt',True) and (not G.get('waistcoat') or G.get('belt')=='always') and not G.get('apron') and not G.get('jacket'):     # a belt round the waistband, with a buckle
    TT=tree_of(PART['breeches']); bm=bmesh.new(); seg=28; rows=[]
    for z,e in ((HIP+0.082,0.004),(HIP+0.083,0.009),(HIP+0.113,0.009),(HIP+0.114,0.004)):
        ring=[]
        for k in range(seg):
            a=2*math.pi*k/seg; d=Vector((math.sin(a),-math.cos(a),0)); o=Vector((0,J('Hips').y,z)); hit=TT.ray_cast(o,d)[0]; r=((hit-o).length if hit else 0.15)+e; ring.append(bm.verts.new(o+d*r))
        rows.append(ring)
    quadstrip(bm,rows,close=True); soft('Belt',bm,'Belt',only=('Hips','Spine'))
    bm=bmesh.new(); o=Vector((0,J('Hips').y,HIP+0.098)); hit=TT.ray_cast(o,Vector((0,-1,0)))[0]; yb=(hit.y if hit else -0.12)-0.012
    if not G.get('waistcoat'): bmesh.ops.create_cube(bm,size=1,matrix=Matrix.Translation((0,yb,HIP+0.098))@Matrix.Diagonal((0.044*s,0.006,0.038*s,1))); soft('Buckle',bm,'Buckle',only=('Hips','Spine'))
if G.get('jacket'):      # lapels that lie along the jacket's opening, and its buttons
    JK=tree_of(PART['jacket']); jy=lambda x,z:(lambda hit:(hit.y if hit else _front(z)-0.02))(JK.ray_cast(Vector((x,-1,z)),Vector((0,1,0)))[0])
    jcol_=NECK-0.012*s; vz_=jcol_-0.20*s; bm=bmesh.new()
    for sx in (-1,1):
        rows=[]
        for i in range(9):
            t=i/8; xi=0.004+t*0.105*s; zi=vz_+1.5*t*0.105*s; w=(0.058*math.sin(min(t,0.72)/0.72*math.pi/2)**0.8 if t<=0.72 else 0.036)*s
            xo=xi+w*0.80; zo=zi-w*0.45+(0.012*s if t>0.72 else 0)
            rows.append([bm.verts.new((sx*xi,jy(xi+0.012,zi-0.01)-0.004,zi)),bm.verts.new((sx*xo,jy(xo,zo)-0.011,zo))])
        quadstrip(bm,rows,flip=(sx<0))
    soft('Lapels',bm,'Jacket'); bm=bmesh.new()
    for i in range(2):
        z=vz_-0.035*s-0.075*s*i; bmesh.ops.create_circle(bm,cap_ends=True,segments=8,radius=0.009*s,matrix=Matrix.Translation((0.012*s,jy(0.012*s,z)-0.004,z))@Matrix.Rotation(math.pi/2,4,'X'))
    soft('JButtons',bm,'Buttons')
if G.get('pocket'):      # a patch pocket on the chest: a slightly raised panel with a rounded bottom, in its own material (a shade darker than the shirt unless the game sets it)
    COL.setdefault('Pocket',COL['Shirt']*0.86); bm=bmesh.new(); px=0.088*s; pz=VZ-0.035*s; pw=0.040*s; ph=0.088*s; rows=[]
    for j in range(5):
        v=j/4; half=pw*(1.0 if v<0.75 else 0.82); rows.append([bm.verts.new(on_shirt(Vector((px+half*(i/2-1),-0.3,pz-ph*v)).lerp(Vector((px+half*(i/2-1),shirt_front(pz-ph*v,px+half*(i/2-1)),pz-ph*v)),1.0),0.0035)) for i in range(5)])
    quadstrip(bm,rows); soft('Pocket',bm,'Pocket',only=('Spine2','Spine1','Spine'))
if G.get('skirt') and G.get('belt'):     # a narrow belt where the bodice meets the skirt (or, with sash, a deep smooth waistband over the top of the skirt and the bottom of the blouse)
    TT=tree_of(PART['skirt']); bm=bmesh.new(); seg=28; rows=[]
    SA=G.get('sash'); seg=48 if SA else seg; zs=((HIP+0.060,0.004),(HIP+0.062,0.011),(HIP+0.083,0.012),(HIP+0.105,0.012),(HIP+0.127,0.012),(HIP+0.148,0.011),(HIP+0.150,0.004)) if SA else ((HIP+0.070,0.003),(HIP+0.071,0.007),(HIP+0.094,0.007),(HIP+0.095,0.003))
    for z,e in zs:
        ring=[]
        for k in range(seg):
            a=2*math.pi*k/seg; d=Vector((math.sin(a),-math.cos(a),0)); o=Vector((0,J('Hips').y,z)); hit=TT.ray_cast(o,d)[0]; h2=SHT.ray_cast(o+d*0.4,-d)[0] if SA else None; r=max((hit-o).length if hit else 0.0,(h2-o).length if h2 else 0.0) or 0.15; ring.append(bm.verts.new(o+d*(r+e)))
        rows.append(ring)
    quadstrip(bm,rows,close=True); soft('Belt',bm,'Belt',only=('Hips','Spine','Spine1'))
if G.get('shoes'):       # a sole under each shoe, a little wider than the upper, with a heel
    SO=PART['shoes']; bm=bmesh.new()
    for sx in (-1,1):
        vs=[v.co for v in SO.data.vertices if v.co.x*sx>0 and v.co.z<ANK*0.36]
        if not vs: continue
        zmin=min(c.z for c in vs); cx=sum(c.x for c in vs)/len(vs); y0=min(c.y for c in vs); y1=max(c.y for c in vs); cy=(y0+y1)/2; seg=24; rad=[0.0]*seg
        for c in vs:
            k=int((math.atan2(c.x-cx,-(c.y-cy))%(2*math.pi))/(2*math.pi)*seg)%seg; rad[k]=max(rad[k],math.hypot(c.x-cx,c.y-cy))
        rad=[max(rad[k],0.7*max(rad[(k-1)%seg],rad[(k+1)%seg])) for k in range(seg)]; rad=[(rad[(k-1)%seg]+2*rad[k]+rad[(k+1)%seg])/4 for k in range(seg)]
        for v in SO.data.vertices:      # the upper's sides come straight down to the sole instead of curling under the foot
            c=v.co
            if c.x*sx>0 and c.z<zmin+0.022*s:
                u=(math.atan2(c.x-cx,-(c.y-cy))%(2*math.pi))/(2*math.pi)*seg; k=int(u)%seg; r=math.hypot(c.x-cx,c.y-cy); t=min(1.0,(zmin+0.022*s-c.z)/(0.012*s)); rk=rad[k]
                if OLD: k0=int(math.floor(u-0.5))%seg; fu=(u-0.5)%1.0; rk=rad[k0]*(1-fu)+rad[(k0+1)%seg]*fu      # between two outline points, so the edge has no steps
                if 1e-5<r<rk: f=1+(rk/r-1)*t*min(1.0,r/(rk*0.6)); c.x=cx+(c.x-cx)*f; c.y=cy+(c.y-cy)*f
        def ring(z,grow,arch):
            out=[]
            for k in range(seg):
                a=2*math.pi*(k+0.5)/seg; r=rad[k]+grow; x=cx+math.sin(a)*r; y=cy-math.cos(a)*r; t=(y-y0)/(y1-y0)   # t: 0 at the toe, 1 at the heel
                out.append(bm.verts.new((x,y,z+(arch*sstep(0.42,0.52,t)*(1-sstep(0.66,0.72,t)) if arch else 0))))
            return out
        # the sole wraps the rounded underside of the upper, so the two read as one shoe: its wall rises to the widest part of the upper, with a narrow welt, a bevelled edge and a raised arch
        r1=ring(zmin+0.008*s,0.0008*s,0); r2=ring(zmin+0.004*s,0.0012*s,0); r3=ring(zmin-0.004*s,0.0012*s,0.006*s); r4=ring(zmin-0.006*s,-0.002*s,0.006*s)
        quadstrip(bm,[r1,r2,r3,r4],close=True,flip=True); bm.faces.new(r4[::-1])
    soft('Sole',bm,'Sole',only=('LeftFoot','RightFoot','LeftToeBase','RightToeBase'))
if G.get('shoes') and G.get('buckles'):      # 1690 shoes: a tongue that stands up in front of the ankle and a small metal buckle on the instep
    ST=tree_of(PART['shoes']); bm=bmesh.new(); bt=bmesh.new()
    for sx in (-1,1):
        x0=LANK.x*sx; top=ST.ray_cast(Vector((x0,LANK.y-0.035*s,ANK+0.2)),Vector((0,0,-1)))[0]; hit=ST.ray_cast(Vector((x0,LANK.y-0.072*s,ANK+0.2)),Vector((0,0,-1)))
        if not hit[0] or not top: continue
        c=hit[0]; nrm=hit[1]; fw=Vector((0,-1,0)); fw=(fw-nrm*fw.dot(nrm)).normalized(); sd=nrm.cross(fw).normalized()
        M=Matrix((sd,fw,nrm)).transposed().to_4x4(); M.translation=c+nrm*0.004
        for dx,dy,w,d in ((0,0.009,0.029,0.0045),(0,-0.009,0.029,0.0045),(0.0125,0,0.0045,0.0225),(-0.0125,0,0.0045,0.0225)): bmesh.ops.create_cube(bm,size=1,matrix=M@Matrix.Translation((dx*s,dy*s,0))@Matrix.Diagonal((w*s,d*s,0.005*s,1)))
        rows=[]
        for i in range(4):
            f=i/3; z=top.z-0.004+0.034*s*f; y=top.y-0.016*s+0.010*s*f; w=(0.020+0.004*f)*s; rows.append([bt.verts.new((x0-w,y+0.006*s,z)),bt.verts.new((x0,y-0.004*s,z)),bt.verts.new((x0+w,y+0.006*s,z))])
        quadstrip(bt,rows)
    COL.setdefault('ShoeBuckle',srgb((176,170,150))); soft('ShoeBuckle',bm,'ShoeBuckle',only=('LeftFoot','RightFoot')); soft('ShoeTongue',bt,'Shoes',only=('LeftFoot','RightFoot'))
if G.get('moustache'):      # a moustache: a shaped piece that follows the upper lip, full in the middle and tapering to each corner of the mouth
    lg=GI['lips']; lv=[v.co for v in h.data.vertices if any(g.group==lg and g.weight>0 for g in v.groups)]
    lt=max(c.z for c in lv if abs(c.x)<0.004); W=max(abs(c.x) for c in lv)*G.get('moustachewidth',1.0); Hm=(G.get('moustache') if isinstance(G.get('moustache'),float) else 0.013)*s
    def face(x,z):
        hit=tree.ray_cast(Vector((x,-1,z)),Vector((0,1,0)))[0]; return hit.y if hit else -0.1
    bm=bmesh.new(); rl=bm.verts.layers.float.new('ramp'); rows=[]; nu=34; nv=8; lb=min(c.z for c in lv); droop=G.get('moustachedroop',0.0)*(lt-lb)
    for i in range(nu+1):
        u=-1+2*i/nu; au=abs(u); x=u*W; hh=Hm*(1.05-0.42*au**2.0); zt=lt+Hm*0.95-droop*au**2.4-0.003*s*au*au; zb=zt-hh; row=[]   # full across the lip; the ends curve down round the corners of the mouth
        for j in range(nv+1):
            v=j/nv; z=zt+(zb-zt)*v
            # how thick the hair is here: full in the body of each half, thinner under the middle of the nose, and feathering out to nothing at every edge, unevenly
            dens=min(1.0,min(v,1-v)*5.0)**0.7*min(1.0,(1-au)*6.0)**0.8*(1-0.3*max(0.0,1-au/0.10)*max(0.0,1-v/0.4))
            dens=max(0.0,min(1.0,dens*(0.86+0.5*noise.noise(Vector((x*260,z*260,3.0))))))
            q=bm.verts.new((x,face(x,z)-0.0008-0.0042*dens,z)); q[rl]=dens; row.append(q)
        rows.append(row)
    quadstrip(bm,rows); rigid('Moustache',bm,'Hair','Head')
def _front(z):
    hit=tree.ray_cast(Vector((0,-1,z)),Vector((0,1,0)))[0]; return hit.y if hit else -0.08
def _radius(z,a):
    o=Vector((0,J('Neck').y,z)); d=Vector((math.sin(a),-math.cos(a),0)); hit=tree.ray_cast(o+d*0.3,-d)[0]
    return (hit-o).length if hit else 0.06
def head_fit(grow=0.008):      # the head's outline at brow height, where a hat sits
    BZ=TOP-0.085*s; xs=[];ys=[]
    for v in h.data.vertices:
        if abs(v.co.z-(BZ+0.012*s))<0.012*s and v.co.z>HEAD: xs.append(v.co.x); ys.append(v.co.y)
    return (max(xs)+min(xs))/2,(max(ys)+min(ys))/2,(max(xs)-min(xs))/2+grow,(max(ys)-min(ys))/2+grow,BZ
def lathe(bm,prof,fit,seg=28,mod=None,cap=True):      # turn a profile [(how far out, how high)...] round the head's outline; mod(a,i,out,up) can bend it
    cx,cy,rx,ry,BZ=fit; rings=[]
    for i,(dr,dz) in enumerate(prof):
        ring=[]
        for k in range(seg):
            a=2*math.pi*k/seg; d,z=mod(a,i,dr,dz) if mod else (dr,dz); ring.append(bm.verts.new((cx+math.sin(a)*(rx+d),cy-math.cos(a)*(ry+d),BZ+z)))
        rings.append(ring)
    quadstrip(bm,rings,close=True)
    if cap: bm.faces.new(rings[-1])
    return rings
CRH=0.085*s   # from the brow up to the top of the head
HATS=G.get('hat'); HATS=[] if not HATS else ([(HATS,'Hat')] if isinstance(HATS,str) else [tuple(x) for x in HATS])     # one hat, or several [kind, material name] so a game can show one and hide the others
for _k,_m in HATS: COL.setdefault(_m,COL.get('Hat',srgb((60,56,52)))); COL.setdefault(_m+'Band',COL['Band'])
def build_hat(HK,HM):
    if HK=='felt' and OLD:
        # a 1690 felt hat: a low round crown and a broad brim that curls up a little, unevenly, turned round the head's own outline so it sits down on the brow
        fit=head_fit(); bm=bmesh.new(); BR=G.get('brim',1.0); Hc=CRH+0.036*s
        def mod(a,i,d,z):
            if i<=1: return d,z+(0.020 if i==0 else 0.004)*s*(0.55+0.45*math.sin(a*2+1.2))
            return d,z
        lathe(bm,[(0.086*s*BR,0.0),(0.046*s*BR,-0.003*s),(0.002,0.003*s),(0.0,Hc*0.5)]+[(-0.024*s*(1-math.cos(t*math.pi/2)),Hc-0.024*s*(1-math.sin(t*math.pi/2))) for t in (0.0,0.3,0.55,0.8,1.0)]+[(-0.05*s,Hc+0.002*s),(-0.085*s,Hc+0.003*s)],fit,seg=32,mod=mod)
        rigid(HM,bm,HM,'Head'); bb=bmesh.new(); lathe(bb,[(0.0045,0.005*s),(0.0045,0.024*s)],fit,seg=32,cap=False); COL[HM+'Band']=COL[HM]*0.55; rigid(HM+'Band',bb,HM+'Band','Head')
    elif HK=='felt':
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
        rigid(HM,bm,HM,'Head')
    if HK=='flat':
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
        rigid(HM,bm,HM,'Head')
    if HK in ('trilby','straw','bowler','top','church','peaked','pillbox'):
        fit=head_fit(); bm=bmesh.new(); bb=bmesh.new(); BR=G.get('brim',1.0)
        if HK=='trilby':      # a felt hat with a pinched crown and a brim snapped down in front
            Hc=CRH+0.032*s
            def mod(a,i,d,z):
                if i<=1: return d,z+0.012*s*(-math.cos(a))*(1.0 if i==0 else 0.3)+(0.006*s*abs(math.sin(a)) if i==0 else 0)
                if i>=4: return d-0.010*s*max(0,math.cos(a))**2,z-(0.016*s*(1-abs(math.sin(a)))**2 if i==5 else 0)+0.008*s*math.cos(a)*-1*(i>=4)
                return d,z
            lathe(bm,[(0.056*s*BR,0.0),(0.0,0.006*s),(0.0,0.03*s),(-0.008*s,Hc*0.7),(-0.020*s,Hc),(-0.05*s,Hc-0.004*s)],fit,mod=mod)
            lathe(bb,[(0.003,0.008*s),(0.003,0.032*s)],fit,cap=False)
        if HK=='straw':       # a woven straw hat: a wide, slightly wavy brim and a low flat crown
            Hc=CRH+0.03*s
            lathe(bm,[(0.085*s*BR,-0.004*s),(0.0,0.008*s),(-0.004*s,Hc),(-0.03*s,Hc+0.004*s)],fit,mod=lambda a,i,d,z:(d,z+(0.008*s*math.sin(a*3+1) if i==0 else 0)))
            lathe(bb,[(0.003,0.010*s),(0.002,0.032*s)],fit,cap=False)
        if HK=='bowler':
            Hc=CRH+0.035*s; lathe(bm,[(0.034*s,0.006*s),(0.03*s,-0.002*s),(0.0,0.004*s)]+[(-0.062*s*(1-math.cos(t*math.pi/2)),0.004*s+(Hc)*math.sin(t*math.pi/2)) for t in (0.3,0.55,0.75,0.9,1.0)],fit,mod=lambda a,i,d,z:(d,z+(0.010*s*abs(math.sin(a)) if i<2 else 0)))
            lathe(bb,[(0.003,0.006*s),(0.003,0.026*s)],fit,cap=False)
        if HK=='top':         # a tall silk hat
            Hc=CRH+0.115*s; lathe(bm,[(0.042*s,0.004*s),(0.0,0.004*s),(-0.004*s,Hc*0.5),(0.004*s,Hc),(-0.03*s,Hc)],fit,mod=lambda a,i,d,z:(d,z+(0.014*s*abs(math.sin(a)) if i==0 else 0)))
            lathe(bb,[(0.003,0.006*s),(0.003,0.030*s)],fit,cap=False)
        if HK=='church':      # a woman's Sunday hat of the 1950s: a shallow crown and a brim that dips, with a ribbon
            Hc=CRH+0.014*s; lathe(bm,[(0.078*s*BR,-0.022*s),(0.04*s*BR,-0.004*s),(0.0,0.006*s),(0.0,Hc*0.55),(-0.012*s,Hc*0.9),(-0.045*s,Hc)],fit,mod=lambda a,i,d,z:(d*(1+0.25*max(0,math.cos(a))) if i==0 else d,z+(0.016*s*abs(math.sin(a)) if i==0 else 0)))
            lathe(bb,[(0.003,0.010*s),(0.002,0.030*s)],fit,cap=False)
            for sx in (-1,1): bmesh.ops.create_uvsphere(bb,u_segments=8,v_segments=5,radius=0.022*s,matrix=Matrix.Translation((fit[0]+fit[2]*0.8,fit[1]+sx*0.022*s+0.03,fit[4]+0.024*s))@Matrix.Diagonal((0.5,1.0,0.7,1)))
        if HK=='pillbox':
            f2=(fit[0],fit[1]+0.012*s,fit[2]*0.86,fit[3]*0.86,fit[4]+0.03*s); lathe(bm,[(0.0,0.0),(0.002,CRH+0.012*s-0.03*s),(-0.03*s,CRH+0.018*s-0.03*s)],f2)
        if HK=='peaked':      # a uniform cap: a stiff band, a wide flat top that tilts up at the front, a shiny peak
            lathe(bm,[(0.001,0.0),(0.001,0.032*s),(0.026*s,CRH-0.006*s),(0.018*s,CRH+0.008*s),(-0.05*s,CRH+0.012*s)],fit,mod=lambda a,i,d,z:(d,z+(0.012*s*math.cos(a) if i>=2 else 0)))
            lathe(bb,[(0.003,0.004*s),(0.003,0.030*s)],fit,cap=False)
            cx,cy,rx,ry,BZ=fit; rows=[]
            for k in range(9):
                a=-0.95+1.9*k/8; w=math.cos(a/0.95*math.pi/2)**0.6; rows.append([bb.verts.new((cx+math.sin(a)*(rx+0.001),cy-math.cos(a)*(ry+0.001),BZ+0.006*s)),bb.verts.new((cx+math.sin(a)*(rx+0.058*s*w),cy-math.cos(a)*(ry+0.058*s*w),BZ-0.012*s*w))])
            quadstrip(bb,rows); bmesh.ops.create_uvsphere(bm,u_segments=8,v_segments=5,radius=0.014*s,matrix=Matrix.Translation((cx,cy-ry-0.008*s,BZ+0.048*s))@Matrix.Diagonal((1,0.3,1.2,1)))
        rigid(HM,bm,HM,'Head')
        if len(bb.verts): rigid(HM+'Band',bb,HM+'Band','Head')
        else: bb.free()
    if HK=='wrap':            # a head tie: cloth wound round the head and knotted, made from the scalp's own surface so it fits
        Jy=J('Head').y
        o=piece(HM+'Wrap','body',lambda c:c.z>HEAD+0.06*s,lambda c:0.016+0.006*math.sin(c.z*90+c.x*40),HM,cuts=[((0,Jy,HEAD+0.118*s),Vector((0,-0.25,-0.2)).normalized(),None)],sub=True)
        md=o.modifiers.new('wt','DATA_TRANSFER'); md.object=h; md.use_vert_data=True; md.data_types_verts={'VGROUP_WEIGHTS'}; md.vert_mapping='POLYINTERP_NEAREST'; md.layers_vgroup_select_src='ALL'; md.layers_vgroup_select_dst='NAME'
        with ov(o): bpy.ops.object.modifier_apply(modifier='wt')
        clothes.append(o); bm=bmesh.new()
        for dx,dz,r in ((0.0,0.0,0.03),(-0.035,0.012,0.024),(0.035,0.014,0.022)): bmesh.ops.create_uvsphere(bm,u_segments=8,v_segments=6,radius=r*s,matrix=Matrix.Translation((dx*s,J('Head').y-0.075*s,TOP-0.018*s+dz*s))@Matrix.Diagonal((1.2,0.8,0.8,1)))
        rigid(HM+'Knot',bm,HM,'Head')

for _k,_m in HATS:
    if _k!='cap': build_hat(_k,_m)
HS=G.get('hair')
if HS in ('puffs','plaits'):      # a girl's hair: two puffs, or two plaits, each tied with a ribbon
    bm=bmesh.new(); bb=bmesh.new(); zb=TOP-0.045*s; yb=J('Head').y+0.035*s
    for sx in (-1,1):
        o=Vector((0,yb,zb)); d=Vector((sx,0.25,0.15)).normalized(); hit=tree.ray_cast(o+d*0.3,-d)[0]; root=hit if hit else o+d*0.08
        if HS=='puffs':
            bmesh.ops.create_icosphere(bm,subdivisions=2,radius=0.052*s,matrix=Matrix.Translation(root+d*0.035*s))
        else:
            for i in range(6): q=root+Vector((sx*0.012*s*i*0.3,0.004*s*i,-0.034*s*i)); bmesh.ops.create_uvsphere(bm,u_segments=7,v_segments=5,radius=(0.021-0.0015*i)*s,matrix=Matrix.Translation(q)@Matrix.Diagonal((1,1,1.25,1)))
        rq=root+d*0.004 if HS=='puffs' else root+Vector((sx*0.012*s*1.5,0.02*s,-0.034*s*5))
        bmesh.ops.create_uvsphere(bb,u_segments=8,v_segments=5,radius=0.022*s,matrix=Matrix.Translation(rq)@Matrix.Diagonal((1,1,0.45,1)))
    for v in bm.verts: v.co+=Vector((noise.noise(v.co*60),noise.noise(v.co*60+Vector((5,0,0))),noise.noise(v.co*60+Vector((0,5,0)))))*0.004
    rigid('Puffs',bm,'Hair','Head'); rigid('Ribbons',bb,'Ribbon','Head')
if G.get('bun'):         # hair gathered into a bun at the back of the head
    zb=TOP-0.07*s; hit=tree.ray_cast(Vector((0,1,zb)),Vector((0,-1,0)))[0]; yb=(hit.y if hit else 0.09)+0.022
    bm=bmesh.new(); bmesh.ops.create_uvsphere(bm,u_segments=12,v_segments=8,radius=0.048*s,matrix=Matrix.Translation((0,yb,zb))@Matrix.Diagonal((1.15,0.85,0.9,1)))
    rigid('Bun',bm,'Hair','Head')
if G.get('scarf'):          # the knot at the throat
    z=NECK-0.05*s; hit=tree.ray_cast(Vector((0,-1,z)),Vector((0,1,0)))[0]; y=(hit.y if hit else -0.07)-0.03; bm=bmesh.new()
    k=[bm.verts.new((dx,y,z+dz)) for dx,dz in ((-0.02,0.0),(0.02,0.0),(0.012,-0.06),(-0.014,-0.056))]; bm.faces.new(k)
    rigid('Knot',bm,'Scarf','Spine2')
if G.get('bands'):
    # a 1690 cravat: a soft linen neckcloth wound round the throat and tied in front, its two ends falling over the chest.
    # Built like the later shirt collars: a band round the neck itself with a yoke under it that lies on the skin beneath the coat, and bone weights from the torso only,
    # so it turns with the neck, no skin shows under it and it never pokes out through the coat's collar.
    CT=tree_of(PART['coat']) if G.get('coat') else SHT
    def cfront(z,x=0.0):
        hit=CT.ray_cast(Vector((x,-1,z)),Vector((0,1,0)))[0]; return hit.y if hit else shirt_front(z,x)
    bm=bmesh.new(); seg=28; hs=0.036*s; cols=[]
    for k in range(seg):
        a=2*math.pi*k/seg; f=0.5+0.5*math.cos(a); b0=collar_pt(a,NECK-0.004,NECK-0.004-0.008*s,0.016); col=[]
        for dz in (0.085,0.045):
            zz=b0.z-dz*s*(0.25+0.75*f); rr=rad_out(zz,a)+0.004; col.append(Vector((math.sin(a)*rr,NJ.y-math.cos(a)*rr,zz)))
        col+=[b0,collar_pt(a,NECK-0.004+hs*0.5,NECK-0.012*s+hs*0.5,0.0155+0.0012*math.sin(a*3+0.5)),collar_pt(a,NECK-0.004+hs,NECK-0.012*s+hs,0.009),collar_pt(a,NECK-0.004+hs-0.005,NECK-0.012*s+hs-0.005,0.002)]
        cols.append([bm.verts.new(q) for q in col])
    rings=[list(r) for r in zip(*cols)]; quadstrip(bm,rings[2:],close=True); by=bmesh.new(); quadstrip(by,[[by.verts.new(v.co) for v in r] for r in rings[:3]],close=True)
    for v in rings[0]+rings[1]: bm.verts.remove(v)
    soft('Bands',bm,'Bands',only=('Spine2','Neck','LeftShoulder','RightShoulder')); soft('BandsYoke',by,'Bands',only=TORSO+('LeftArm','RightArm'))      # the yoke lies on the skin under the coat, so it moves as the skin does (shoulders and upper arms too) and stays under the coat when the shoulders lift
    bm=bmesh.new(); yb=collar_pt(0,NECK-0.004,NECK-0.004-0.008*s,0.016); zk=yb.z-0.006*s; yk=min(yb.y,cfront(zk))-0.007        # the knot, then the two hanging ends: they lie on the coat, a little splayed, widening to the hem
    knot=bmesh.ops.create_uvsphere(bm,u_segments=10,v_segments=6,radius=0.015*s,matrix=Matrix.Translation((0,yk,zk)))
    for v in knot['verts']: v.co.x=v.co.x*1.6; v.co.y=yk+(v.co.y-yk)*0.7; v.co.z=zk+(v.co.z-zk)*0.9
    for sx in (-1,1):
        n=8; L=0.15*s; rows=[]
        for t in range(n+1):
            f=t/n; z=zk-0.004-L*f; w=(0.022+0.020*f)*s; cx=sx*(0.007+0.013*f)*s
            y=min(cfront(z,cx-w*0.5),cfront(z,cx),cfront(z,cx+w*0.5))-0.005-0.004*math.sin(f*3.1)
            if f<0.3: y=min(y,yk+0.002)
            rows.append([bm.verts.new((cx-w*0.5,y,z)),bm.verts.new((cx,y-0.003,z)),bm.verts.new((cx+w*0.5,y,z))])
        quadstrip(bm,rows,flip=(sx<0))
    soft('BandsEnds',bm,'Bands',only=('Spine2','Spine1','Spine'))
if G.get('coat') and OLD:      # the coat's neck edge: a narrow facing in the coat's own cloth that lies over the top of the coat round the sides and back of the neck.
    # The coat is cut from a helper mesh that stops short of the neck, so when the shoulders lift a gap opened there and skin showed; the facing bridges it and moves as the skin does
    bm=bmesh.new(); seg=24; cols=[]; a0=0.62
    for k in range(seg+1):
        a=a0+(2*math.pi-2*a0)*k/seg; e=min(1.0,min(k,seg-k)/2.0); b0=collar_pt(a,NECK-0.004,NECK-0.004-0.008*s,0.016); col=[collar_pt(a,NECK-0.004+0.011*s*e,NECK-0.004-0.008*s+0.011*s*e,0.0205),collar_pt(a,NECK-0.004,NECK-0.004-0.008*s,0.0235)]
        for dz in (0.028,0.062):
            zz=b0.z-dz*s*(0.4+0.6*e); rr=rad_out(zz,a)+0.0265; col.append(Vector((math.sin(a)*rr,NJ.y-math.cos(a)*rr,zz)))
        cols.append([bm.verts.new(q) for q in col])
    quadstrip(bm,[list(r) for r in zip(*cols)]); soft('CoatNeck',bm,'Coat',only=TORSO+('LeftArm','RightArm'))
if G.get('coat') and G.get('coatbuttons',OLD):      # a row of buttons down the coat's front, from the neck to the waist
    CT=tree_of(PART['coat']); bm=bmesh.new(); z1=NECK-0.085*s; z0=HIP+0.075; nb=max(4,int((z1-z0)/(0.052*s)))
    for i in range(nb+1):
        z=z1+(z0-z1)*i/nb; hit=CT.ray_cast(Vector((0.010*s,-1,z)),Vector((0,1,0)))[0]
        if hit: bmesh.ops.create_circle(bm,cap_ends=True,segments=6,radius=0.0075*s,matrix=Matrix.Translation((0.010*s,hit.y-0.004,z))@Matrix.Rotation(math.pi/2,4,'X'))
    COL.setdefault('CoatButtons',COL['Coat']*0.5); soft('CoatButtons',bm,'CoatButtons')
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
    if OLD:      # the apron rides on the thighs like the front of a coat's skirt, so a knee lifts it instead of coming through it
        B={n:ap.vertex_groups['mixamorig:'+n] for n in ('Hips','LeftUpLeg','RightUpLeg')}; B['Hips'].remove(list(range(len(ap.data.vertices))))
        for v in ap.data.vertices:
            t=max(0.0,min(1.0,(HIP+0.06-v.co.z)/0.5)); leg=0.95*sstep(-0.15,0.45,t); left=sstep(-1.0,1.0,v.co.x/0.15)
            for n,val in (('Hips',1-leg),('LeftUpLeg',leg*left),('RightUpLeg',leg*(1-left))):
                if val>0.001: B[n].add([v.index],val,'REPLACE')
bh.free()
if G.get('jacket'):      # under a jacket only the shirt's front, collar zone and cuffs can be seen: cut the rest away, so nothing can poke through the jacket and the body is lighter
    o=PART['shirt']; bm=bmesh.new(); bm.from_mesh(o.data)
    def seen(c):
        if c.z>NECK-0.06*s: return True
        if c.y<0 and abs(c.x)<0.13*s and c.z>NECK-0.30*s: return True
        t=side_arm(c); return t is not None and t>G.get('jacketsleeve',0.9)-0.14
    bmesh.ops.delete(bm,geom=[f for f in bm.faces if not seen(cz(f))],context='FACES'); bm.to_mesh(o.data); bm.free()
if G.get('coat') and OLD:      # under a coat only the shirt's cuffs can be seen (all of each sleeve, when the coat has none): cut the rest away
    o=PART['shirt']; bm=bmesh.new(); bm.from_mesh(o.data); _sl=G.get('coatsleeves',True); _cs=G.get('coatsleeve',0.82)
    def seen(c):
        if not _sl: return abs(c.x)>SX*0.55 or c.z>NECK-0.09*s      # a coat with no sleeves: the shirt's shoulders and sleeves show
        t=side_arm(c); return t is not None and t>_cs-0.14
    bmesh.ops.delete(bm,geom=[f for f in bm.faces if not seen(cz(f))],context='FACES'); bm.to_mesh(o.data); bm.free()
# body: remove what the clothes fully hide, so nothing pokes through
bm=bmesh.new(); bm.from_mesh(h.data); dl=bm.verts.layers.deform.verify(); gi=GI['body']
cov_arm=max(sleeve, G.get('coatsleeve',0) if G.get('coat') and G.get('coatsleeves',True) else 0, G.get('jacketsleeve',0.9) if G.get('jacket') else 0)
def hidden(c):
    if CK=='camp' and c.y<0 and c.z>VZ-0.03*s+VK*0.55*abs(c.x): return False      # the neck and a little chest show inside the V of a camp collar
    if HIP+0.05<c.z<NECK-(0.045 if CK=='round' else 0.022 if (CK and CK not in ('open','camp')) or G.get('bands') else 0.07)*s and abs(c.x)<SX*0.8: return True   # with a collar, its yoke covers the skin right up to the collar's seam
    t=side_arm(c)
    if t is not None and 0.08<t<cov_arm-0.06 and abs(c.x)>SX*0.75: return True
    if OLD and abs(c.x)>SX*0.75 and HIP+0.05<c.z<NECK-0.03*s and arm_axis(c)[1]<cov_arm-0.09: return True      # the armpit, the side of the chest and the shoulder under a shirt or coat: left in, the skin showed through at the back of the armpit when the arm swung
    if G.get('breeches') and ((KNEE+0.08*s if G.get('shorts') else ANK+0.03) if G.get('trousers') else KNEE)<c.z<HIP+0.05 and math.hypot(c.x-leg_axis(c.z,1 if c.x>0 else -1).x,c.y-LHIP.y)<0.16*s: return True
    if G.get('skirt') and SKB+0.10<c.z<HIP+0.05 and side_arm(c) is None: return True
    if G.get('shoes') and c.z<(ANK*0.5 if LOWCUT else ANK+0.02): return True
    return False
bmesh.ops.delete(bm,geom=[f for f in bm.faces if not all(v[dl].get(gi,0)>0 for v in f.verts) or hidden(cz(f))],context='FACES'); bm.to_mesh(h.data); bm.free()
h.data.materials.clear(); h.data.materials.append(colmat('Skin',0.68)); h.name='Body'
LIPZ=HEAD+0.025*s; BROWZ=HEAD+0.10*s
def paint(o):
    me=o.data; bm=bmesh.new(); bm.from_mesh(me); cl=bm.loops.layers.color.new('Col'); RL=bm.verts.layers.float.get('ramp') if o.name in ('Hair','Moustache') else None
    for f in bm.faces:
        name=me.materials[f.material_index].name.split('.')[0]; base=COL[name]
        for l in f.loops:
            p=l.vert.co; col=base.copy()
            if o is h:
                if G.get('stockings') and ANK-0.01<p.z<KNEE+0.02: col=COL['Stockings'].copy()
                if G.get('socks') and p.z<ANK+G['socks']*(KNEE-ANK): col=COL['Sock'].copy()
                lip=max(0,1-((p.x/0.026)**2+((p.z-LIPZ)/0.010)**2)) if p.y<J('Head').y-0.09 else 0
                col=col.lerp(col*0.62+Vector((0.05,0.0,0.0)),min(1,lip*1.2))
                for sx in (-1,1):
                    bx=(p.x-sx*0.034*s)/(0.022*G.get('browwide',1.0)); bz=(p.z-BROWZ-0.003*(1-abs(bx)))/(0.0045*G.get('brows',1.0))
                    br=max(0,1-(bx*bx+bz*bz)) if p.y<J('Head').y-0.07 else 0
                    col=col.lerp(COL['Hair'],min(1,br*1.6))
                k=0.94+noise.noise(p*9)*0.06
            else:
                k=0.88+noise.noise(p*14)*0.1+noise.noise(p*3)*0.08
                if RL is not None: col=COL['Skin'].lerp(col,min(1.0,l.vert[RL]*1.7) if o.name=='Hair' else min(1.0,l.vert[RL]*1.25)**0.8); k=0.9+noise.noise(p*90)*0.14
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
bpy.ops.export_scene.gltf(filepath=OUT+P['name']+'.glb',export_image_format='JPEG',export_apply=False,export_vertex_color='NAME',export_vertex_color_name='Col',export_skins=True,export_animations=False,export_rest_position_armature=False)
# a copy for Mixamo: rest pose, with skin, so the user can pick animations for it
if P.get('fbx'):
    rig.data.pose_position='REST'; bpy.context.view_layer.update()
    bpy.ops.export_scene.fbx(filepath=os.path.abspath('build/people/'+P['name']+'_for_mixamo.fbx'),object_types={'ARMATURE','MESH'},add_leaf_bones=False,path_mode='COPY',embed_textures=True,colors_type='SRGB',mesh_smooth_type='FACE',bake_anim=False)
    rig.data.pose_position='POSE'
