# Garvey-era characters (about 1900 to 1930). A copy of tools/people/npc.py with extra garments:
#   trousers, waistcoat, collar, tie, flat cap (hat:'flat'), and for women a long skirt, a high-necked blouse (highneck) and a bun.
# It also builds Port Royal's people (recipes in tools/people/, top-level "era": 1690): tools/people/npc.py is the old builder, kept only for reference.
# Everything that is new for 1690 sits behind OLD (era before 1800) or behind garments no later recipe uses (coat, bands, cap, slops), so later eras build the same as before.
import bpy, re, bmesh, math, sys, json, mathutils
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
# "face": a named face shape from tools/people/faces.json, so the people of one game do not all share one face; the recipe's own targets are added on top of it.
# Every face also gets slightly lowered upper lids ("eyes", default 0.3; 0 leaves them wide): fully open, every person seemed to stare.
_T=dict(json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','people','faces.json'))).get(P.get('face'),{})) if P.get('face') else {}
_ey=P.get('eyes',0.0 if P.get('upscale') else 0.3)      # a child keeps wide eyes: with lowered lids and full brows a small child wore a stern adult's frown
if _ey>0: _T['lr-eye-height2-decr']=_ey
# A friendly look (owner, 16 November 2026: "everyone has a serious face"): the corners of the mouth lifted a little and the cheeks a touch fuller, more on a child.
# "smile" in the recipe sets it (0 for a grave face; default 0.45, a child 0.8).
_sm=P.get('smile',0.8 if P.get('upscale') else 0.45)
if _sm>0: _T['mouth-angles-up']=min(1.0,_sm); _T['lr-cheek-trans-up']=min(1.0,_sm*0.5); _T['eyebrows-trans-up']=min(1.0,_sm*0.5)
if P.get('upscale'): _T.setdefault('lr-cheek-volume-incr',0.3)
# a man's chest (owner, 16 November 2026: "these look like breasts on the men"): MakeHuman's male chest keeps rounded pectoral mounds with a fold under each at the side.
# Every man gets a flatter chest unless his recipe sets these targets itself (or "malechest": 0).
if P['body'].get('gender',1)>0.5 and not P['garments'].get('woman') and P.get('malechest',1):
    for _k,_w in (('torso-muscle-pectoral-decr',1.0),('breast-point-decr',1.0),('breast-volume-vert-up',0.6),('measure-bust-circ-decr',0.7)): _T.setdefault(_k,_w*P.get('malechest',1))
_T.update(P.get('targets',{}))
for _n,_w in _T.items():      # finer shaping of the face and body (MakeHuman's own targets), for a likeness
    for _nn in ([_n.replace('lr-','l-'),_n.replace('lr-','r-')] if _n.startswith('lr-') else [_n]): TargetService.load_target(h,TargetService.target_full_path(_nn),weight=_w,name=_nn)
def ov(o): return bpy.context.temp_override(object=o,active_object=o,selected_objects=[o],selected_editable_objects=[o])
with ov(h): bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
if P.get('upscale'):       # a child is built at a child's shape, then enlarged so the hips sit near an adult's height: every animation clip then fits, and the game shrinks the child back with its scale
    for v in h.data.vertices: v.co*=P['upscale']
    h.data.update()
eyes=HumanService.add_mhclo_asset(os.path.join(os.environ.get('MAKEHUMAN','/tmp/mh/makehuman'),'data/eyes/low-poly/low-poly.mhclo'),h,asset_type='Eyes',subdiv_levels=0)
rig=HumanService.add_builtin_rig(h,'mixamo')
if P.get('outfit'):      # a fitted garment (tools/people/outfit.py): fitted now, while the body is still MakeHuman's own mesh
    OUTFIT_PHASE='fit'; _ofp=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','people','outfit.py'); exec(compile(open(_ofp).read(),_ofp,'exec'))
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
def sstep(a,b,x): t=max(0.0,min(1.0,(x-a)/(b-a))); return t*t*(3-2*t)
def flat_chest(k):
    # A man's chest must not read as a bust (owner, 16 November 2026). MakeHuman's male chest and ribs stand well forward of the belly; under a shirt, with the standing clip's
    # lean, that showed as a rounded dome from collar to belt. Before any cloth is cut from the skin, the front of his torso is brought back toward a nearly straight line from
    # the belly (just above the belt) to the collarbones, with a slight outward curve left in it, k of the way (garments.chest, default 0.5; it was 0.9 until the standing
    # posture itself was put right in engine/anim.js, POSTURE). Women, and recipes that set garments.chest to 0, keep their shape.
    bm=bmesh.new(); bm.from_mesh(h.data); dl=bm.verts.layers.deform.verify(); gi=GI['body']; za,zb=HIP+0.11*s,NECK-0.05*s
    _b=bm.copy(); _d=_b.verts.layers.deform.verify(); bmesh.ops.delete(_b,geom=[f for f in _b.faces if not all(v[_d].get(gi,0)>0 for v in f.verts)],context='FACES'); _t=BVHTree.FromBMesh(_b)      # the skin alone: the mesh also holds helper shapes that stand clear of the body
    def front(z):
        hit=_t.ray_cast(Vector((0,-0.6,z)),Vector((0,1,0)))[0]; return hit.y if hit else None
    ya,yb=front(za),front(zb)
    zp=NECK-0.17*s      # the height of the chest's fullest point
    if ya is None or yb is None: bm.free(); return
    vs=[]
    for v in bm.verts:
        c=v.co
        if v[dl].get(gi,0)<=0 or not za<c.z<zb or abs(c.x)>SX*0.97 or c.y>0: continue
        # the line: straight up from the belly at the belt to the chest, which may stand 1 cm proud of it, then back to the collarbones. (It ran from the belly to the
        # collarbone with a curve in the middle, so the fullest point was below the chest: flat at the top, then a bulge. Owner, 16 November 2026.)
        if c.z<zp: lim=ya-0.010*s*sstep(za,zp,c.z)
        else: u=(c.z-zp)/(zb-zp); lim=(ya-0.010*s)+(yb-(ya-0.010*s))*u-0.006*s*math.sin(math.pi*u)
        if c.y<lim: c.y=lim+(c.y-lim)*(1-min(1.0,k*1.9)*(1-sstep(SX*0.80,SX*0.97,abs(c.x)))); vs.append(v)
    # and the sides: from the waist up to just under the armpit his ribs may widen by no more than 2.5 cm a side. Wider, with the waist drawn in at the belt, the shirt's
    # sides swelled under the arms and the shadow under them drew the outline of a bust (seen in the game's own stance, 16 November 2026)
    zc=SH.z-0.115*s
    def half(z):
        hit=_t.ray_cast(Vector((0.6,(ya+0.10) if z<za+0.05 else NJ.y,z)),Vector((-1,0,0)))[0]; return hit.x if hit else None
    xa=half(za)
    if xa is not None and zc>za+0.05:
        for v in bm.verts:
            c=v.co
            if v[dl].get(gi,0)<=0 or not za<c.z<zc+0.05*s or abs(c.x)>SX*0.99: continue
            lim=xa+0.025*s*min(1.0,(c.z-za)/(zc-za))
            if abs(c.x)>lim:
                f=k*(1-sstep(zc,zc+0.05*s,c.z)); nx=lim+(abs(c.x)-lim)*(1-f); c.x=nx if c.x>0 else -nx
                if v not in vs: vs.append(v)
    for _ in range(6):      # soften the line where the change begins and ends
        nw={v:sum((e.other_vert(v).co for e in v.link_edges),Vector())/len(v.link_edges) for v in vs}
        for v in vs: v.co=v.co.lerp(nw[v],0.5)
    _b.free(); bm.to_mesh(h.data); bm.free(); h.data.update()
if not P['garments'].get('woman') and P['body'].get('gender',1)>0.5 and P['garments'].get('chest',1.0)>0: flat_chest(P['garments'].get('chest',1.0))
bh=bmesh.new(); bh.from_mesh(h.data); tree=BVHTree.FromBMesh(bh)
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
    if (a+d*t-c).length>(0.15 if (P.get('era',1915)>=1800 and 0.1<t<0.7) else 0.11)*s: return None      # later eras: the relaxed arm bends at the elbow, so the cloth round the elbow is still the arm's
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
        bmesh.ops.bisect_plane(bm,geom=list(dict.fromkeys(v for f in fs for v in f.verts))+list(dict.fromkeys(e for f in fs for e in f.edges))+fs,plane_co=co,plane_no=no,clear_outer=True)
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
    if not OLD: return      # later eras get their ease from the eased outline (see 'Cloth with ease' below)
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
if G.get('skirt') and not OLD and not G.get('belt') and G.get('waistband',True):      # a later skirt without a belt gets its own waistband, in the skirt's cloth: it covers the join of blouse and skirt, which otherwise flickered and showed ragged when seated
    G['belt']=True
    if 'Belt' not in P['colors'] and 'Skirt' in COL: COL['Belt']=COL['Skirt']*0.88      # the skirt's own cloth, a shade deeper at the seam
EASE_OLD=OLD and not G.get('woman') and (not G.get('coat') or not G.get('coatsleeves',True))      # (and under a sleeveless coat, whose shirt sleeves are seen whole: without the ease they folded into dark patches, owner 17 November 2026)      # a 1690 man's shirt worn without a coat: drape_front alone left the chest as two mounds over a hollow, cut back in to the waistband, so it gets the ease too
if G.get('trousers'): G['breeches']=True; G['breechkind']='trousers'
WAIST=HIP+0.13 if G.get('breeches') else HIP+0.02   # with breeches the shirt is tucked in under their waistband
def arm_ok(c,upto):
    t=side_arm(c); return t is None or t<=upto+0.06
sleeve=G.get('sleeve',0.86)
cuts_sleeve=lambda t:[(armcut(t,1)[0],armcut(t,1)[1],lambda c:c.x>SX*0.8 and (OLD or side_arm(c) is not None)),(armcut(t,-1)[0],armcut(t,-1)[1],lambda c:c.x<-SX*0.8 and (OLD or side_arm(c) is not None))]
CK=G.get('collar')
if CK: CK='stand' if CK is True and P.get('era',1915)<1925 and not G.get('softcollar') else ('turn' if CK is True else CK)
if OLD and not CK and 'collar' in G and not G.get('bands'): CK='plain'      # "collar": false on an old shirt: a plain rounded opening, no band (Nanny Town's Maroon men, 21 November 2026)
if OLD and not CK and not G.get('bands') and not (G.get('coat') and G.get('coatsleeves',True)): CK='band'      # a 1690 shirt worn without a coat ends in a narrow neckband, open at the throat: it is built like the later collars, so its edge is clean and no skin shows under it
if not OLD and not CK and not G.get('scarf'): CK='plain'      # later eras too: a shirt, blouse or frock with no collar ends in a clean round opening, cut and finished by neckwear.py (owner, 21 November 2026: "most just need a round opening for the garment")
FLAT=CK in ('camp','round')      # the flat collars of the 1950s: 'camp' is an open pointed collar over a V neck (men's sports shirts, women's blouses), 'round' a flat round collar on a close neckline
VD=G.get('vdepth',0.13 if G.get('woman') else 0.115)*s; VZ=NECK-VD; VK=G.get('vslope',2.1)      # the V of a camp collar: its lowest point, and how steep its sides are
NCUT=NECK-(0.004 if G.get('highneck') else (0.014 if CK and CK not in ('open','camp') else 0.035))*s-(0.06*s if G.get('coat') and G.get('coatsleeves',True) else 0)
def shoulder_off(c,base):      # later eras: across the top of the shoulders a waistcoat or a jacket lies close (about 1 cm), as cloth does there; the fixed offset meant for the body
    # below the chest stood the waistcoat 1.6 cm off the shirt there and the jacket on top of it, so the jacket's shoulders rose above the base of the neck like padding (owner, 21 November 2026)
    k=sstep(SH.z-0.03*s,SH.z+0.035*s,c.z)*(1-sstep(SX*1.05,SX*1.25,abs(c.x))); return base+(0.010-base)*k
# A sleeve is a tube, sized from the arm's own measurements (21 November 2026). The old rule took the larger of a fixed tube and "the arm plus 4 mm" at every point, so on a
# strong or heavy arm the cloth followed the shoulder muscle and the biceps and the sleeve read as padding (owner: "shaped funny at the top by his shoulders and looks like
# padding"; the old man in Kendal seemed to have a bodybuilder's arms). _ARM_R is the arm's greatest radius at 29 stations from shoulder to wrist, made to narrow steadily
# toward the wrist and smoothed: every point of a sleeve at one station sits at one radius, that measure plus the garment's ease, so the cloth hides the muscles under it.
def _arm_profile():
    N=28; L1=(EL-SH).length; L2=(HA-EL).length; tt=L1/(L1+L2); raw=[]; offs=[]; CAP=0.085*s
    _b=bmesh.new(); _b.from_mesh(h.data); _d=_b.verts.layers.deform.verify(); bmesh.ops.delete(_b,geom=[f for f in _b.faces if not all(v[_d].get(GI['body'],0)>0 for v in f.verts)],context='FACES'); tree=BVHTree.FromBMesh(_b)      # the skin alone: the full mesh also holds helper shapes in and round the arm, which measured a centimetre too wide
    def far(o,dr):      # how far the arm's outermost surface is from o along dr (the mesh also holds small helper shapes inside the arm), or None past the cap
        p=o.copy(); f=None; go=0.0
        for _ in range(6):
            hit=tree.ray_cast(p,dr,CAP-go)[0]
            if hit is None: break
            go=(hit-o).length; f=go; p=hit+dr*0.0015
        return f
    for i in range(N+1):
        t=i/N; a,b,u=(SH,EL,t/tt) if t<tt else (EL,HA,(t-tt)/(1-tt)); q=a.lerp(b,u); d=(b-a).normalized()
        e1=d.cross(Vector((0,1,0))); e1=e1.normalized() if e1.length>1e-4 else Vector((0,0,1)); e1=-e1 if e1.z<0 else e1; e2=d.cross(e1).normalized()      # e1 points up and away from the body, e2 to the front or the back
        # the bone does not run down the middle of the arm: find the middle first (front to back always; up and down only where both sides are the arm's own)
        f2a,f2b=far(q,e2),far(q,-e2); off=e2*((f2a-f2b)/2) if f2a and f2b else Vector((0,0,0)); f1a,f1b=far(q,e1),far(q,-e1)
        if f1a and f1b and t>0.3: off+=e1*((f1a-f1b)/2)
        c=q+off; m=0.0
        for k in range(16):
            if math.cos(2*math.pi*k/16)<-0.3 and t<0.5: continue      # on the upper arm the side that faces the chest is left out: its rays meet the ribs
            fr=far(c,e1*math.cos(2*math.pi*k/16)+e2*math.sin(2*math.pi*k/16))
            if fr: m=max(m,fr)
        raw.append(m); offs.append(off)
    i0=int(0.22*N)      # above this the rays meet the chest and the shoulder: the sleeve head keeps the upper arm's size and the bone's own line
    for i in range(i0): raw[i]=0.0; offs[i]=offs[i0]*(i/i0)
    R=raw[:]
    for i in range(N-1,-1,-1): R[i]=max(R[i],R[i+1])      # never wider further down the arm
    for _ in range(3): R=[max(raw[i],(R[max(0,i-1)]+2*R[i]+R[min(N,i+1)])/4) for i in range(N+1)]
    for _ in range(3): offs=[(offs[max(0,i-1)]+offs[i]*2+offs[min(N,i+1)])/4 for i in range(N+1)]
    _b.free(); return R,raw,offs
_ARM_R,_ARM_RAW,_ARM_OFF=_arm_profile(); print('ARM radius, shoulder to wrist (mm):',[round(x*1000) for x in _ARM_RAW[::4]])
def _arm_r(t,tab=None):
    tab=tab or _ARM_R; f=max(0.0,min(1.0,t))*(len(tab)-1); i=min(len(tab)-2,int(f)); return tab[i]+(tab[i+1]-tab[i])*(f-i)
def _arm_mid(q,t,sx):      # the middle of the arm at station t, from the point q on the bone's line
    f=max(0.0,min(1.0,t))*(len(_ARM_OFF)-1); i=min(len(_ARM_OFF)-2,int(f)); o=_ARM_OFF[i].lerp(_ARM_OFF[i+1],f-i); return q+Vector((o.x*sx,o.y,o.z))
def sleeve_tube_old(r0,r1,cuff=None,blend=False):      # the 1690 coat keeps the sleeve rule it was tailored with (a full sleeve into a wide cuff: the larger of a fixed tube and the cloth as it lies).
    # The measured taper below was tried on it on 21 November 2026 and came out in rings, because the coat's cuff is narrower than its sleeve; main's coats were not at fault.
    def f(v):
        c=v.co
        if abs(c.x)<SX*0.92: return
        q,t=arm_axis(c); d=c-q; r=d.length or 1e-6; k=sstep(0.06,0.2,t)*(1-sstep(0.075,0.10,r/s)); R=(r0+(r1-r0)*t)*s
        if blend: k*=sstep(SX*0.92,SX*1.12,abs(c.x))
        if cuff and not OLD: R=R+(cuff[1]*s-R)*sstep(cuff[0]-0.14,cuff[0],t)
        elif cuff and t>cuff[0]: R=cuff[1]*s
        rn=max(r+0.004,R); v.co=q+d/r*(r+(rn-r)*k)
    return f
def sleeve_tube(r0,r1,cuff=None,blend=False,ease=0.005):
    # one straight taper from the shoulder to the wrist: the fixed tube, widened at the shoulder end just enough to clear the arm by `ease` at every station (a tube that
    # kept the upper arm's full size all the way to the elbow read as a sausage; one that followed the arm read as muscle)
    n=len(_ARM_RAW)-1; _big=max(_ARM_RAW[int(0.22*n):int(0.5*n)]); r0=min(r0,(_big+0.008+ease)/s); r1=min(r1,(_ARM_RAW[n]+0.012+ease)/s)      # never more than about a centimetre of room on a thin arm: the fixed tube was sized for a grown man, and on a boy or a slim woman a short sleeve stood out as a wide bell (owner, 21 November 2026: "shoulders for boy are way too puffy")
    R1=max(r1*s,_ARM_RAW[n]+ease); R0=max([r0*s]+[(_ARM_RAW[i]+ease-R1*(i/n))/(1-i/n) for i in range(int(0.22*n),int(0.9*n))])
    def f(v):
        c=v.co
        if abs(c.x)<SX*0.92: return
        q,t=arm_axis(c); r_b=(c-q).length; q=_arm_mid(q,t,1 if c.x>=0 else -1); d=c-q; r=d.length or 1e-6; R=max(R0+(R1-R0)*t,_arm_r(t,_ARM_RAW)+ease+0.004); k=sstep(0.0,0.10,t)*(1-sstep(0.092,0.118,r_b/s))      # the whole sleeve from just below the shoulder seam, and every point of a thick arm: starting at a fifth of the way down and reaching only 7.5 cm, it left the shoulder muscle and the outside of a strong upper arm as they were, in lumps (owner, 21 November 2026: "very lumpy")
        k*=sstep(SX*0.92,SX*1.02,abs(c.x))      # eased in from the armhole, so the chest beside the arm is not pulled out      # (a wider reach was tried and pulled the side of a jacket's skirt out beside the hanging arm, into a bell: the Emperor's tunic, 21 November 2026)
        if blend: k*=sstep(SX*0.92,SX*1.12,abs(c.x))      # eased in from the shoulder, so the cloth does not crease at the armpit
        if cuff and not OLD: R=R+(max(cuff[1]*s,_arm_r(t,_ARM_RAW)+0.004)-R)*sstep(cuff[0]-0.14,cuff[0],t)      # later eras: the sleeve narrows smoothly into its cuff (a step left it a wide bell round the wrist)
        elif cuff and t>cuff[0]: R=max(cuff[1]*s,_arm_r(t,_ARM_RAW)+0.004)
        v.co=q+d/r*(r+(R-r)*k)
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
def neck_edge(bm):      # later eras: the shirt's neckline was left as the plane cuts made it, stair-stepped across the triangles, and the steps showed as teeth above the collar. Relax it (not the V of a camp collar, whose straight sides the collar follows)
    smooth_edge(bm,ok=lambda c:c.z>NECK-0.05*s and not (CK=='camp' and c.y<0 and abs(c.x)<0.075*s))
def under_coat(c):   # the shirt sleeve between shoulder and cuff is hidden by the coat sleeve; leaving it there made it push through on the backs of the arms
    if not (G.get('coat') and G.get('coatsleeves',True)): return False
    t=side_arm(c); return t is not None and 0.1<t<G.get('coatsleeve',0.82)-0.1
# untucked (2010 and later): a T-shirt hangs loose over the waistband to the top of the thigh
parts.append(('shirt',piece('Shirt','helper-tights',lambda c:c.z>((HIP+0.095 if OLD else (HIP+0.090 if P.get('era',1915)<1940 else HIP+0.100)) if G.get('breeches') and not G.get('untucked') else HIP-(0.075 if G.get('untucked') else 0.02)) and arm_ok(c,sleeve) and not under_coat(c),lambda c:0.003 if OLD and G.get('breeches') and c.z<HIP+0.13 else (0.012 if abs(c.x)>SX*0.8 else 0.008),'Shirt',shape=sleeve_tube(0.053,0.042,(sleeve-0.07,0.036 if OLD else 0.031) if sleeve>0.8 else None) if not G.get('woman') else (puff_tube(sleeve) if G.get('puff') else sleeve_tube(0.050,0.038,(sleeve-0.06,0.032 if OLD else 0.029) if sleeve>0.8 else None)),post=((lambda bm:smooth_edge(bm,ok=lambda c:not (c.y<0 and c.z>VZ-0.012 and abs(c.x)<0.075*s))) if G.get('woman') and CK=='camp' else smooth_edge if G.get('woman') else ((smooth_edge if OLD else None) if G.get('coat') else ((lambda bm:(drape_front(bm),smooth_edge(bm))) if G.get('smooth') else (drape_front if OLD else neck_edge)))),
   cuts=[((0,0,NECK+0.005-(0.062*s if G.get('coat') and G.get('coatsleeves',True) else 0)),(0,0,1),None),((0,-0.1,NCUT),Vector((0,-0.5,0.87)),lambda c:c.y<0)]+([((0,0,VZ),Vector((-VK,0,1)).normalized(),lambda c:c.y<0 and c.x>0),((0,0,VZ),Vector((VK,0,1)).normalized(),lambda c:c.y<0 and c.x<0)] if CK=='camp' else [])+cuts_sleeve(sleeve))))   # under a coat the shirt stays below the coat's collar; a camp collar opens the front in a narrow V
if G.get('coat'):
    cs=G.get('coatsleeve',0.82); collar=NECK-0.012*s
    sl=G.get('coatsleeves',True)
    coat=piece('Coat','helper-tights',(lambda c:c.z>HIP-0.02 and arm_ok(c,cs)) if sl else (lambda c:c.z>HIP-0.02 and abs(c.x)<SX*0.9),lambda c:0.03 if abs(c.x)>SX*0.8 else 0.022,'Coat',shape=sleeve_tube_old(0.041,0.037,(cs-0.13,0.047),blend=True) if sl else None,post=lambda bm:(drape_front(bm),smooth_edge(bm,3 if sl else 10)),
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
        sk=piece('CoatSkirt','helper-skirt',lambda c:ZB<c.z<ZT+0.02 and not front_gap(c) and not back_vent(c),lambda c:(0.028+(0.034 if G.get('breeches') else 0.017)*sstep(ZT-0.01,ZT-0.13,c.z)) if c.y<-0.02 else 0.036,'Coat',cuts=[((0,0,ZB),(0,0,-1),None)],shape=flare,post=lambda bm:smooth_edge(bm,4,lambda c:c.z<ZT-0.06 and c.z>ZB+0.004))
        parts.append(('coatskirt',sk))
if G.get('breeches'):
    bk=G.get('breechkind','plain'); low=(ANK+(0.035 if not G.get('shorts') else 0)) if bk=='trousers' else KNEE-0.05*s
    if G.get('shorts'): low=KNEE+0.05*s-G.get('shortslen',0)*s      # shortslen (metres, at a normal height): how far below that the hem comes; Tivoli's 2010 cut-offs reach just below the knee
    wide=0.012 if bk in ('trousers','slops') else 0.013
    if OLD: wide=lambda c,_w=wide:_w+0.004*sstep(HIP+0.04,HIP+0.09,c.z)      # the waistband stands a little off the tucked shirt
    def breech_leg(v):
        # 1690 breeches are cut full and gathered into a band below the knee; a sailor's slops are wide open tubes. Either way the cloth hangs from the thigh instead of clinging to it
        z=v.co.z
        if z>CROTCH+0.07: return
        k=sstep(CROTCH+0.07,CROTCH-0.05,z); sx=1 if v.co.x>=0 else -1; ax=leg_axis(z,sx); t=max(0.0,min(1.0,(CROTCH-z)/(CROTCH-low)))
        d=Vector((v.co.x-ax.x,v.co.y-ax.y)); r=d.length or 1e-6; a=math.atan2(d.x*sx,-d.y)
        if bk=='slops': R=(0.096+0.024*t)*s+0.003*math.sin(a*5+z*40)*t
        elif bk=='drawers': R=(0.084-0.016*t)*s      # loose drawers to the knee, open at the hem (Nanny Town's Maroon men): one straight taper, no gather
        else: R=(0.087-0.019*t)*s*(1-0.10*sstep(0.80,0.97,t))+0.0012*math.sin(a*6)*math.sin(t*math.pi)      # knee breeches: easy over the thigh, narrowing steadily to the band below the knee (cut full all the way down and then gathered by a third, they flared like a jockey's breeches: owner, 21 November 2026)
        if G.get('coat') and G.get('coathem') and t<0.72: R=r+0.004+(R-r-0.004)*sstep(1.5,0.8,abs(a))      # under a coat's skirt the fullness is kept to the front, where the coat is open: at the sides and back the breeches lie close, so they cannot push out through the skirt
        rn=r+(max(r+0.006,R)-r)*k; v.co.x=ax.x+d.x/r*rn; v.co.y=ax.y+d.y/r*rn
        if v.co.x*sx<0.004: v.co.x=0.004*sx
    LEGW=G.get('legwidth',1.0)
    def _thigh_r():      # the thigh's radius about the leg's own line a little below the fork: the average of the outside, the front and the back, on the skin (the inside faces the other leg)
        z=CROTCH-0.04*s; o=leg_axis(z,1); rs=[]
        for d in ((1,0,0),(0.7,-0.7,0),(0,-1,0),(0.7,0.7,0),(0,1,0)):
            hit=SKIN_EARLY.ray_cast(o,Vector(d).normalized(),0.13*s)[0]
            if hit is not None: rs.append((hit-o).length)
        return (sum(rs)/len(rs) if rs else 0.07*s)+0.008
    _sb0=bmesh.new(); _sb0.from_mesh(h.data); _sd0=_sb0.verts.layers.deform.verify(); bmesh.ops.delete(_sb0,geom=[f for f in _sb0.faces if not all(v[_sd0].get(GI['body'],0)>0 for v in f.verts)],context='FACES'); SKIN_EARLY=BVHTree.FromBMesh(_sb0)
    _SHORT_R=_thigh_r() if G.get('shorts') else 0.0; _sb0.free(); print('SHORTS thigh radius mm',round(_SHORT_R*1000))
    SHORTS=G.get('shorts',False)
    def trouser_leg(v):
        # cloth does not cling: below the seat each leg becomes a tube that hangs from the thigh, a little narrower at the hem, with a soft crease and a break over the shoe
        z=v.co.z
        if z>CROTCH+0.07: return
        k=sstep(CROTCH+0.07,CROTCH-0.05,z); sx=1 if v.co.x>=0 else -1; ax=leg_axis(z,sx); t=max(0.0,min(1.0,(CROTCH-z)/(CROTCH-low)))
        ax.y-=0.012*s*math.sin(t*math.pi)   # the knee sits forward of the straight line from hip to ankle
        d=Vector((v.co.x-ax.x,v.co.y-ax.y)); r=d.length or 1e-6; a=math.atan2(d.x*sx,-d.y)
        R=(0.083-0.026*t)*s*LEGW*(1+0.04*math.cos(a)*(0.3+t))+0.0012*math.sin(z*60+a*2)*t   # egg shaped: the crease in front; small folds lower down. Fitted: about 8 cm at the top of the thigh narrowing to under 6 at the hem (9 to 7 cm stood off the leg and flared: owner, 21 November 2026)
        if SHORTS:
            # One straight line from the top of the thigh to a level hem (owner, 21 November 2026: "these flared shorts should be smoothed out a little more"). They used to follow the
            # thigh with a little ease, so they swelled at mid-thigh and came in again at the hem. _SHORT_R is the thigh's greatest radius just below the fork, plus ease.
            R=_SHORT_R*(1-0.10*t)*LEGW
        rn=r+(max(r+0.007,R)-r)*k; v.co.x=ax.x+d.x/r*rn; v.co.y=ax.y+d.y/r*rn
        if v.co.x*sx<0.004: v.co.x=0.004*sx
        if not SHORTS and t>0.9: v.co.y-=0.012*s*(t-0.9)/0.1   # the hem breaks forward over the shoe
    parts.append(('breeches',piece('Breeches','helper-tights',lambda c:low-0.03<c.z<HIP+0.13 and side_arm(c) is None,wide,'Breeches',post=((lambda bm:(trim_seat(bm),smooth_edge(bm,8,lambda c:c.z>HIP+0.08))) if OLD else trim_seat),shape=trouser_leg if bk=='trousers' else breech_leg,cuts=[((0,0,low),(0,0,-1),None),((0,0,HIP+0.12),(0,0,1),None)])))
if G.get('waistcoat'):
    wcol=NECK-(0.075 if FLAT else 0.02)*s      # under a flat collar the waistcoat's neckline lies lower, so the collar's leaf lies over it   Only the front opening: cut straight across at this height, the waistcoat lost both shoulders and looked unfinished (owner, 17 November 2026, approved); its shoulders reach the neck as a real waistcoat's do.
    WVZ,WVK=(wcol-0.17*s,1.1) if OLD else (NECK-0.20*s,(wcol-NECK+0.20*s)/(0.085*s))      # the V's point and how steep its sides are: later eras meet at the top button, about a hand below the collarbone, in two straight edges that open to about a hand's width at the top
    parts.append(('waistcoat',piece('Waistcoat','helper-tights',lambda c:c.z>HIP+0.03 and abs(c.x)<SX*0.9,(lambda c:0.03 if abs(c.x)>SX*0.8 else 0.022) if OLD else (lambda c:shoulder_off(c,0.03 if abs(c.x)>SX*0.8 else 0.022)),'Waistcoat',post=lambda bm:(drape_front(bm),smooth_edge(bm)),
        cuts=[((0,0,NECK-0.02*s),(0,0,1),None)]+([((0,0,WVZ),Vector((-WVK,0,1)).normalized(),lambda c:c.y<0 and c.x>0),((0,0,WVZ),Vector((WVK,0,1)).normalized(),lambda c:c.y<0 and c.x<0)] if G.get('vwaist') else [((0,-0.1,wcol-0.13*s),Vector((0,-0.6,0.8)),lambda c:c.y<0)])+[((SX*0.78,0,0),(1,0,0),lambda c:c.z>SH.z-0.12*s),((-SX*0.78,0,0),(-1,0,0),lambda c:c.z>SH.z-0.12*s)])))      # the armholes, down to just under the armpit only: cut at every height, the side of the waistcoat was sliced open wherever a belly or hips came out past the cut, and the shirt showed there as a white flap (owner, 21 November 2026: "the side of the coat looks torn")
def jacket_seen(c):      # what of the shirt can be seen under a jacket: the front in its V, the collar's foot round the neck, the cuffs (used to trim the shirt, and to fit the jacket over only that)
    if c.z>NECK-(0.06 if (c.y<0 or OLD) else 0.026)*s and (OLD or math.hypot(c.x,c.y-NJ.y)<0.13*s): return True      # later eras: only round the neck (across the whole width, the band ran out over the tops of the shirt's sleeves and stood out under the jacket's shoulders like padding: owner, 21 November 2026)
    if c.y<0 and abs(c.x)<0.13*s and c.z>NECK-0.30*s: return True
    t=side_arm(c); return t is not None and t>G.get('jacketsleeve',0.9)-0.14
def jacket_waistcoat_seen(c):      # and of a waistcoat under a jacket, only the wedge in the jacket's V and a narrow margin round it
    _vz=NECK-0.012*s-0.20*s; return not (c.y>0.0 or abs(c.x)>max(0.0,c.z-_vz)/1.5+0.015*s or c.z<_vz-0.05*s)
if G.get('jacket'):   # a plain suit jacket: waist-length hem, sleeves to the wrist, a V opening over the waistcoat
    jcol=NECK-0.012*s; jcs=G.get('jacketsleeve',0.9)
    vz=jcol-0.20*s   # the V opening: two angled cuts, one each side of the middle, so only a narrow wedge is removed and the shoulders stay covered
    parts.append(('jacket',piece('Jacket','helper-tights',lambda c:c.z>HIP+0.03 and arm_ok(c,jcs),(lambda c:0.022 if abs(c.x)>SX*0.8 else 0.017) if OLD else (lambda c:shoulder_off(c,0.016 if abs(c.x)>SX*0.8 else 0.017)),'Jacket',shape=sleeve_tube(0.054,0.045,ease=0.016) if OLD else sleeve_tube_old(0.046,0.039,(jcs-0.02,0.036)),      # (the generated jacket is worn only by uniforms now, the Emperor's tunic among them: it keeps the sleeve it had. The measured taper belled it out at the wrist and pulled the skirt out beside the arm)      # later eras: a suit sleeve has about 1.5 cm of ease over the arm (2.2 cm on a 5 cm tube puffed the sleeve heads into domes)post=lambda bm:(drape_front(bm),smooth_edge(bm)),
        cuts=[((0,0,jcol),(0,0,1),None),((0,0,vz),Vector((-1.5,0,1)).normalized(),lambda c:c.y<0 and c.x>0),((0,0,vz),Vector((1.5,0,1)).normalized(),lambda c:c.y<0 and c.x<0)]+cuts_sleeve(jcs))))
SKB=ANK+0.07+G.get('hem',0)*(KNEE-ANK-0.07)      # the skirt's hem: hem 0 is the ankle, 1 the knee
if G.get('jacket'):
    JT=HIP+0.07; JB=CROTCH-G.get('jackethem',0.05 if OLD else -0.05)*s
    def jflare(v): t=max(0,(JT-v.co.z)/(JT-JB)); f=1+0.05*t; v.co.x*=f; v.co.y=(v.co.y+0.02)*f-0.02
    parts.append(('jacketskirt',piece('JacketSkirt','helper-skirt',lambda c:JB<c.z<JT+0.02,0.024,'Jacket',cuts=[((0,0,JB),(0,0,-1),None)],shape=jflare)))
if G.get('skirt'):
    ZT=HIP+0.08; ZB=SKB; FL=G.get('flare',1.0); NP=G.get('pleats',9)
    def flare2(v):
        t=max(0,(ZT-v.co.z)/(ZT-ANK-0.07)); f=1+(0.12*t*t+0.06*t)*FL; v.co.x*=f; v.co.y=(v.co.y+0.02)*f*(1+0.10*t*(v.co.y>0))-0.02
        a=math.atan2(v.co.x,-(v.co.y+0.02)); w=1+0.03*FL*min(1.0,t*3)*math.sin(a*NP+0.6)*(0.4+t); v.co.x*=w; v.co.y=(v.co.y+0.02)*w-0.02   # soft folds that deepen toward the hem
    parts.append(('skirt',piece('Skirt','helper-skirt',lambda c:ZB<c.z<ZT+0.02,0.03 if OLD else (lambda c:0.012+0.018*sstep(HIP+0.07,HIP-0.05,c.z)),'Skirt',cuts=[((0,0,ZB),(0,0,-1),None)],shape=flare2,sub=True)))
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
_H=G.get('hat'); _CAP=[m for k,m in ([(_H,'Hat')] if isinstance(_H,str) else [tuple(x) for x in (_H or [])]) if k=='cap']   # the cap, given alone ("cap") or in the list of hats ([["cap", "Hat"]]), with its material name
if _CAP:
    Jy=J('Head').y
    parts.append(('cap',piece('Cap','body',lambda c:c.z>HEAD+0.02,0.016,_CAP[0],cuts=[((0,Jy,HEAD+0.088*s),Vector((0,-0.075,-0.2)).normalized(),None)],sub=True)))
if G.get('scarf'):
    parts.append(('scarf',piece('Scarf','body',lambda c:NECK-0.045*s<c.z<NECK+0.03*s and abs(c.x)<0.085,lambda c:0.018+0.02*max(0.0,min(1.0,(NECK-c.z)/(0.045*s))),'Scarf')))
if not OLD or EASE_OLD:
    # Cloth with ease (every era after 1800, and a 1690 man's shirt worn without a coat). A shirt cut from the body's own surface clings like paint: it shows each muscle and tucks in under the chest.
    # Real cloth spans the hollows (it cannot dip between the shoulder blades or under the bust) and hangs from the fullest part of the chest and back until the waistband gathers it in.
    # EVR is the torso's own outline (height by angle round the spine), EVH the same outline with the hollows bridged and the hang added. Each layer then sits a set distance outside EVH,
    # so shirt, waistcoat and jacket keep a clear gap between them everywhere instead of fighting for the same few millimetres.
    _hy=J('Hips').y; YCz=lambda z:_hy+(NJ.y-_hy)*max(0.0,min(1.0,(z-HIP)/(NECK-HIP))); EZ0=CROTCH+0.012; EDZ=0.008; ENZ=int((NECK+0.02-EZ0)/EDZ)+2; ENA=72
    TUCK=(HIP+(0.14 if OLD else 0.125)) if G.get('breeches') else (HIP+0.158 if G.get('sash') else HIP+0.10); ARMPIT=SH.z-0.085*s
    _sb=bmesh.new(); _sb.from_mesh(h.data); _sd=_sb.verts.layers.deform.verify(); bmesh.ops.delete(_sb,geom=[f for f in _sb.faces if not all(v[_sd].get(GI['body'],0)>0 for v in f.verts)],context='FACES'); SKIN=BVHTree.FromBMesh(_sb)      # the skin alone: the full mesh also holds helper shapes inside and around the body
    def _evrow(z):
        out=[]
        for k in range(ENA):
            a=2*math.pi*k/ENA; d=Vector((math.sin(a),-math.cos(a),0)); o=Vector((0,YCz(z),z)); hit=SKIN.ray_cast(o,d)[0]; r=(hit-o).length if hit else 0.12
            out.append(min(r,SX*0.93/max(1e-3,abs(d.x))))      # at the shoulders the body runs on into the arm: the torso's cloth stops at the armhole
        return out
    def _evhull(r):      # bridge the hollows of one outline: no point may lie inside the straight line between two others
        n=len(r)
        for _ in range(2):
            q=r[:]
            for k in range(n):
                for j in range(1,(n//7 if G.get('woman') else n//4)+1):      # a man's shirt also spans from the chest across to the shoulder and the back, so the chest shows no mounds
                    a,b=r[(k-j)%n],r[(k+j)%n]; c=2*a*b*math.cos(2*math.pi*j/n)/(a+b)
                    if c>q[k]: q[k]=c
            r=q
        return r
    # how steeply loose cloth falls back in below the chest. A man's shirt or coat falls almost straight from the chest to the waist (it must not show the chest as two mounds
    # with a hollow under them), so at his front it falls in only 3.5 cm in a metre; a blouse follows the figure more (22 cm in a metre)
    _slope=[(0.22/max(0.2,G.get('hang',1.0))) if (G.get('woman') or math.cos(2*math.pi*k/ENA)<0.1) else 0.035/G.get('hang',1.0) for k in range(ENA)]
    EVR=[_evrow(EZ0+i*EDZ) for i in range(ENZ)]
    for i in range(max(1,int((NECK-0.03*s-EZ0)/EDZ)),ENZ):      # the top rows reach the jaw: left in, the chin stood 5 cm proud of the throat and the cloth was stretched from it down to the belt like a tent,
        for k in range(ENA): EVR[i][k]=min(EVR[i][k],EVR[i-1][k]+0.002)      # which gave every man a rounded bust (found 16 November 2026). Above the base of the neck the outline may not widen again
    _eh=[_evhull(r) for r in EVR]; _hd=[r[:] for r in _eh]; _hu=[r[:] for r in _eh]; HANG=G.get('hang',1.0)
    for i in range(ENZ-2,-1,-1):
        for k in range(ENA): _hd[i][k]=max(_eh[i][k],_hd[i+1][k]-_slope[k]*EDZ)      # falling from the chest and the shoulder blades
    for i in range(1,ENZ):
        for k in range(ENA): _hu[i][k]=max(_eh[i][k],_hu[i-1][k]-(0.5 if G.get('woman') else 0.28)*EDZ) if math.cos(2*math.pi*k/ENA)>0.35 and EZ0+i*EDZ>TUCK+0.06 else _eh[i][k]       # and, on the front only, rising from the bust to the collarbone (a man's shirt runs on flatter from the chest to the collarbone, so the chest does not read as two mounds)
    EVH=[[max(_hd[i][k],_hu[i][k]) for k in range(ENA)] for i in range(ENZ)]
    if not G.get('woman'):      # a man's cloth spans straight from the fullest part of the chest down to the waistband, like a sheet laid over the body: seen from the side it
        # neither hangs out from the chest like a shelf nor follows a belly or the chest's own curve. Each column (one angle round the body) becomes its upper convex hull over height
        zs=[EZ0+i*EDZ for i in range(ENZ)]
        for k in range(ENA):
            col=[_eh[i][k] for i in range(ENZ)]; hull=[]; i_t=max(0,min(ENZ-2,int((TUCK-EZ0)/EDZ)))      # from the waistband up: below it the cloth is tucked in
            for i in range(i_t,ENZ):
                while len(hull)>=2:
                    i0,i1=hull[-2],hull[-1]
                    if (col[i1]-col[i0])*(zs[i]-zs[i0])<=(col[i]-col[i0])*(zs[i1]-zs[i0]): hull.pop()
                    else: break
                hull.append(i)
            for a_,b_ in zip(hull,hull[1:]):
                for i in range(a_,b_+1): EVH[i][k]=col[a_]+(col[b_]-col[a_])*(zs[i]-zs[a_])/(zs[b_]-zs[a_])
    for _ in range(2 if G.get('woman') else 4): EVH=[[(EVH[max(0,i-1)][k]+EVH[min(ENZ-1,i+1)][k]+EVH[i][(k-1)%ENA]+EVH[i][(k+1)%ENA]+2*EVH[i][k])/6 for k in range(ENA)] for i in range(ENZ)]
    EVH=[[max(EVH[i][k],_eh[i][k]) for k in range(ENA)] for i in range(ENZ)]
    if os.environ.get('EASE_DEBUG'):
        for i in list(range(0,ENZ,3))+[ENZ-3,ENZ-2,ENZ-1]: print('EASE z=%.3f'%(EZ0+i*EDZ),' '.join('%s raw %.3f hull %.3f out %.3f |'%(n,EVR[i][k],_eh[i][k],EVH[i][k]) for n,k in (('front',0),('f30',6),('side',18),('back',36))))
    def env(z,a):
        fi=(z-EZ0)/EDZ; i=max(0,min(ENZ-2,int(fi))); t=max(0.0,min(1.0,fi-i)); fk=(a%(2*math.pi))/(2*math.pi)*ENA; k=int(fk)%ENA; u=fk-int(fk); k2=(k+1)%ENA
        f=lambda M:(M[i][k]*(1-u)+M[i][k2]*u)*(1-t)+(M[i+1][k]*(1-u)+M[i+1][k2]*u)*t
        return f(EVR),f(EVH),f(_eh)
    def ease(o,c,tuck=None,gather=True):
        # move a garment's torso out to the eased outline plus c. tuck: below the waistband the cloth lies this close to the body (a shirt tucked into trousers or a skirt);
        # gather=False lets it hang straight on down (a jacket)
        bm=bmesh.new(); bm.from_mesh(o.data); moved=[]; ZS=SH.z+0.045*s
        for v in bm.verts:
            x,y,z=v.co
            if z>ZS: continue
            wx=1.0 if z<ARMPIT-0.03 else 1-sstep(SX*0.80,SX*1.0,abs(x))*sstep(ARMPIT-0.03,ARMPIT,z)
            if z<ARMPIT and side_arm(v.co) is not None and abs(x)>SX*1.02: wx=0.0
            wx*=1-sstep(SH.z-0.035*s,ZS,z)      # the top of the shoulders keeps the body's own line
            if wx<=0: continue
            moved.append(v); yc=YCz(z); dx,dy=x,y-yc; r=math.hypot(dx,dy) or 1e-6; raw,hg,_hl=env(z,math.atan2(dx,-dy)); w=sstep(TUCK,TUCK+0.08,z) if gather else sstep(HIP-0.02,HIP+0.20,z)
            r2=max(r,raw+(hg-raw)*w+c)
            if tuck is not None: r2=r2+(raw+tuck-r2)*(1-sstep(TUCK-0.004,TUCK+0.035,z))
            rn=r+(r2-r)*wx; v.co.x=dx*rn/r; v.co.y=yc+dy*rn/r
        sm=[v for v in moved if not v.is_boundary]
        for _ in range(3): bmesh.ops.smooth_vert(bm,verts=sm,factor=0.5,use_axis_x=True,use_axis_y=True,use_axis_z=True)
        bm.normal_update(); bm.to_mesh(o.data); bm.free()
if not OLD and dict(parts).get('shirt'):      # the sleeves are evened out as cloth: the tube is worked out round a line that bends at the elbow, which left a pinched ring there
    _o=dict(parts)['shirt']; _b=bmesh.new(); _b.from_mesh(_o.data)
    _sv=[v for v in _b.verts if not v.is_boundary and abs(v.co.x)>SX*1.0 and side_arm(v.co) is not None]
    for _ in range(8): bmesh.ops.smooth_vert(_b,verts=_sv,factor=0.5,use_axis_x=True,use_axis_y=True,use_axis_z=True)
    _b.to_mesh(_o.data); _b.free()
clothes=[o for k,o in parts]
for o in clothes:
    md=o.modifiers.new('wt','DATA_TRANSFER'); md.object=h; md.use_vert_data=True; md.data_types_verts={'VGROUP_WEIGHTS'}
    md.vert_mapping='POLYINTERP_NEAREST'; md.layers_vgroup_select_src='ALL'; md.layers_vgroup_select_dst='NAME'
    with ov(o): bpy.ops.object.modifier_move_to_index(modifier='wt',index=0); bpy.ops.object.modifier_apply(modifier='wt')
if EASE_OLD and G.get('breeches'):      # the shirt's tail inside the breeches is always hidden: trimmed below HIP+0.10, inside the waistband (seated, it bunched out through the front of the breeches); the shirt still overlaps the breeches up to the waistband
    _o=dict(parts)['shirt']; _b=bmesh.new(); _b.from_mesh(_o.data); bmesh.ops.delete(_b,geom=[f for f in _b.faces if cz(f).z<HIP+0.10 and side_arm(cz(f)) is None],context='FACES'); bmesh.ops.delete(_b,geom=[v for v in _b.verts if not v.link_faces],context='VERTS'); _b.to_mesh(_o.data); _b.free()
if EASE_OLD:      # 1690: only the shirt; it blouses out above the breeches' waistband (TUCK is above the band) and falls nearly straight from the chest
    ease(dict(parts)['shirt'],0.009,tuck=0.006 if G.get('breeches') else 0.003)      # tucked into breeches it fills the band (tucked tight, it left an open lip of breeches round it)
if not OLD:      # the ease comes after the bone weights are copied: each point of cloth keeps the weights of the skin it started on, so loose cloth by the armpit does not follow the arm
    for k,o in parts:
        if k=='shirt': ease(o,0.009,tuck=0.003) if not G.get('untucked') else ease(o,0.014,gather=False)
        if k=='waistcoat': ease(o,0.019)
        if k=='jacket': ease(o,0.026 if G.get('waistcoat') else 0.019,gather=False)
        if k=='jacketskirt': ease(o,0.026 if G.get('waistcoat') else 0.019,gather=False)
        if k=='skirt': ease(o,0.010)
        if k=='breeches' and G.get('trousers'):      # trousers do not cling round the seat and the fork: the cloth spans from hip to hip and falls to the legs
            bm=bmesh.new(); bm.from_mesh(o.data); moved=[]
            for v in bm.verts:
                x,y,z=v.co; wz=sstep(CROTCH-0.02,CROTCH+0.04,z)
                if wz<=0 or z>HIP+0.14: continue
                yc=YCz(z); dx,dy=x,y-yc; r=math.hypot(dx,dy) or 1e-6; raw,hg,hl=env(z,math.atan2(dx,-dy)); r2=max(r,hl+0.012); rn=r+(r2-r)*wz; v.co.x=dx*rn/r; v.co.y=yc+dy*rn/r; moved.append(v)
            sm=[v for v in moved if not v.is_boundary]
            for _ in range(3): bmesh.ops.smooth_vert(bm,verts=sm,factor=0.5,use_axis_x=True,use_axis_y=True,use_axis_z=True)
            bm.normal_update(); bm.to_mesh(o.data); bm.free()
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
def o_is_bone(o,gi): return o.vertex_groups[gi].name.startswith('mixamorig:')
def _smooth_bones(o,sel,iters):      # like smooth_weights, but only the bone groups are read and written (the MakeHuman helper groups carry weight 1 and would crowd the bones out)
    me=o.data; nbr={v.index:[] for v in me.vertices}
    for e in me.edges: x_,y_=e.vertices; nbr[x_].append(y_); nbr[y_].append(x_)
    bone={g.index for g in o.vertex_groups if g.name.startswith('mixamorig:')}
    W=[{g.group:g.weight for g in v.groups if g.group in bone and g.weight>0} for v in me.vertices]; pick=[v.index for v in me.vertices if sel(v.co)]
    for _ in range(iters):
        N={}
        for i_ in pick:
            if not nbr[i_]: continue
            acc={}
            for j_ in nbr[i_]:
                tj=sum(W[j_].values()) or 1
                for g_,w_ in W[j_].items(): acc[g_]=acc.get(g_,0)+w_/tj/len(nbr[i_])
            ti=sum(W[i_].values()) or 1
            mix={g_:0.5*W[i_].get(g_,0)/ti+0.5*acc.get(g_,0) for g_ in set(W[i_])|set(acc)}; top=sorted(mix.items(),key=lambda x:-x[1])[:4]; tot=sum(w_ for g_,w_ in top) or 1; N[i_]={g_:w_/tot for g_,w_ in top}
        for i_,d_ in N.items(): W[i_]=d_
    for i_ in pick:
        for g_ in [g.group for g in me.vertices[i_].groups if g.group in bone]: o.vertex_groups[g_].remove([i_])
        for g_,w_ in W[i_].items():
            if w_>0.002: o.vertex_groups[g_].add([i_],w_,'REPLACE')
def neck_to_chest(o):
    # The base of the neck, where a neckline lies, follows the chest and not the neck: the skin there and the shirt's neck ring get the same rule,
    # so when the head nods neither comes through the other. Above the neckline the neck turns as before.
    _nb={g.index for g in o.vertex_groups if g.name in ('mixamorig:Neck','mixamorig:Head')}; _s2=o.vertex_groups['mixamorig:Spine2']
    for _v in o.data.vertices:
        _f=sstep(NECK-0.045*s,NECK+0.005*s,_v.co.z)
        if _f>=1 or _v.co.z<NECK-0.12*s: continue
        _ws=[(g.group,g.weight) for g in _v.groups if o.vertex_groups[g.group].name.startswith('mixamorig:')]; _mv=sum(w for gi,w in _ws if gi in _nb)*(1-_f)
        if _mv<1e-4: continue
        for gi,w in _ws:
            if gi in _nb:
                if w*_f>0.002: o.vertex_groups[gi].add([_v.index],w*_f,'REPLACE')
                else: o.vertex_groups[gi].remove([_v.index])
        _cur=next((g.weight for g in _v.groups if g.group==_s2.index),0.0); _s2.add([_v.index],_cur+_mv,'REPLACE')
def shirt_weights(_sh):      # the shirt's front and back, well inside the armholes, lose the arm weights of the skin there, and its torso's weights are evened out (see below, 'The layers of the torso')
    _arm={g.index for g in _sh.vertex_groups if g.name.startswith('mixamorig:') and ('Arm' in g.name or 'Hand' in g.name)}
    for _v in _sh.data.vertices:
        _f=sstep(SX*0.70,SX*0.95,abs(_v.co.x))
        if _f>=1 or _v.co.z<HIP: continue
        _ws=[(g.group,g.weight) for g in _v.groups if o_is_bone(_sh,g.group)]
        _new=[(gi,w*(_f if gi in _arm else 1.0)) for gi,w in _ws]; _tot=sum(w for gi,w in _new)
        if _tot<1e-4: continue
        for gi,w in _ws: _sh.vertex_groups[gi].remove([_v.index])
        for gi,w in _new:
            if w/_tot>0.002: _sh.vertex_groups[gi].add([_v.index],w/_tot,'REPLACE')
    _smooth_bones(_sh,lambda c:abs(c.x)<SX*0.95 and HIP+0.02<c.z<NECK-0.01,10)      # and the torso's weights are evened out, so the cloth bends as one piece and its edges stay straight
    if G.get('elbow',1)>0: _smooth_bones(_sh,lambda c:side_arm(c) is not None and 0.36<side_arm(c)<0.74 and abs(c.x)>SX*0.9,int(8*G.get('elbow',1)))      # and the sleeve round the elbow, so a bent arm folds the cloth softly instead of ballooning the upper sleeve and stretching the inside of the bend
    if G.get('shoulder',1)>0: _smooth_bones(_sh,lambda c:SX*0.55<abs(c.x)<SX*1.25 and SH.z-0.145*s<c.z<NECK+0.02 and (side_arm(c) is None or side_arm(c)<0.22),int(12*G.get('shoulder',1)))      # the shoulder cap, from the chest across to the top of the sleeve, is evened out as one piece: with the arm's weights stopping short, the cloth folded into a notch at the back of the shoulder and the sleeve top stood boxy when the arm went up (owner, 16 November 2026)
    neck_to_chest(_sh)
if not OLD:
    # A last clearance pass. Whatever the shapes above did, no point of a garment may lie inside, or closer than MIN to, the layer under it: the skin, then the shirt, then the waistcoat.
    # Each point is pushed out along the face it is nearest to, twice, so edges that were cut, eased and smoothed cannot leave a speck of the layer beneath showing through.
    def _tr(o):
        b=bmesh.new(); b.from_mesh(o.data); b.normal_update(); return BVHTree.FromBMesh(b)
    def clear_layer(o,under,mn,reach=0.03):
        # Each point that is inside, or closer than mn to, the layer beneath gets a push along that layer's normal. The pushes are then spread to the neighbours
        # (each point takes the biggest push within two rings, then the pushes are averaged three times), so the cloth moves out as one smooth piece.
        # Pushing points one by one, and leaving the cut edges where they were, folded the faces along a V neck or a hem over onto their backs: seen from the front they vanished
        # and the cloth beneath showed through in saw teeth.
        for _ in range(2):
            bm=bmesh.new(); bm.from_mesh(o.data); bm.verts.ensure_lookup_table(); D={}
            for v in bm.verts:
                wn=1.0      # the neck's own line is pushed too (the collars are built afterwards, on the cleared shirt): left where it was cut, the skin of the neck came through it
                best=None
                for t in under:
                    loc,nrm,_i,dd=t.find_nearest(v.co,reach)
                    if loc is None: continue
                    sd=(v.co-loc).dot(nrm)
                    if sd<mn and (best is None or (mn-sd)>best.length): best=nrm*(mn-sd)*wn
                if best is not None: D[v.index]=best
            if not D: bm.free(); return
            nb=[[e.other_vert(v).index for e in v.link_edges] for v in bm.verts]; Z=Vector((0,0,0))
            for _r in range(2):
                N={}
                for i_ in range(len(bm.verts)):
                    c=[D[j_] for j_ in nb[i_]+[i_] if j_ in D]
                    if c: N[i_]=max(c,key=lambda q:q.length)
                D=N
            for _r in range(3):
                D={i_:(D.get(i_,Z)*2+sum((D.get(j_,Z) for j_ in nb[i_]),Vector((0,0,0))))/(2+len(nb[i_])) for i_ in range(len(bm.verts)) if i_ in D or any(j_ in D for j_ in nb[i_])}
            for i_,d in D.items(): bm.verts[i_].co+=d
            smooth_edge(bm,3); bm.normal_update(); bm.to_mesh(o.data); bm.free()
    _P={k:o for k,o in parts}; _skin=[SKIN]
    if 'breeches' in _P:
        # Each trouser leg follows its own leg only (a wide leg took weights from the other thigh and from the calf behind it, and its outline broke into teeth when striding),
        # and the weights down each leg are evened out so the tube bends as one piece and its hem stays a clean ring.
        _bo=_P['breeches']
        for _v in _bo.data.vertices:
            if _v.co.z>CROTCH or abs(_v.co.x)<0.002: continue
            _ws=[(g.group,g.weight) for g in _v.groups if o_is_bone(_bo,g.group)]; _bad=[gi for gi,w in _ws if ('Right' if _v.co.x>0 else 'Left') in _bo.vertex_groups[gi].name]
            if not _bad: continue
            for gi in _bad: _bo.vertex_groups[gi].remove([_v.index])
            _keep=[(gi,w) for gi,w in _ws if gi not in _bad]; _tot=sum(w for gi,w in _keep)
            if _tot<1e-4: _bo.vertex_groups['mixamorig:'+('Left' if _v.co.x>0 else 'Right')+'UpLeg'].add([_v.index],1.0,'REPLACE')
            else:
                for gi,w in _keep: _bo.vertex_groups[gi].add([_v.index],w/_tot,'REPLACE')
        _smooth_bones(_bo,lambda c:c.z<CROTCH+0.04 and abs(c.x)>0.004,6)
    if 'shirt' in _P:
        # The layers of the torso share one set of bone weights. First the shirt's front and back, well inside the armholes, lose the arm weights the skin there carries
        # (the skin of the chest follows the arm a little, and cloth that did so bent into ridges). Then each waistcoat and jacket takes its weights from the shirt under it,
        # read from the nearest face and blended across it, so neighbouring points move alike and the layers can never slide through one another.
        _sh=_P['shirt']; shirt_weights(_sh)
        for _q in ('waistcoat','jacket'):
            if _q not in _P: continue
            _lo=_P[_q]; _md=_lo.modifiers.new('wt2','DATA_TRANSFER'); _md.object=_sh; _md.use_vert_data=True; _md.data_types_verts={'VGROUP_WEIGHTS'}
            _md.vert_mapping='POLYINTERP_NEAREST'; _md.layers_vgroup_select_src='ALL'; _md.layers_vgroup_select_dst='NAME'
            with ov(_lo): bpy.ops.object.modifier_move_to_index(modifier='wt2',index=0); bpy.ops.object.modifier_apply(modifier='wt2')
            if _q=='jacket' and G.get('shoulder',1)>0: _smooth_bones(_lo,lambda c:SX*0.55<abs(c.x)<SX*1.45 and SH.z-0.145*s<c.z<NECK+0.04 and (side_arm(c) is None or side_arm(c)<0.25),int(12*G.get('shoulder',1)))      # a jacket's shoulder stands further out than the shirt's: its own shoulder cap is evened out too, or it tore when the arms went up
    if 'shirt' in _P and 'breeches' in _P:
        # the tucked-in tail of the shirt moves with the trousers' waist, not with the spine: when a person sits, the waistband and the shirt under it then fold together
        from mathutils.kdtree import KDTree as _KD
        _bo=_P['breeches']; _kd=_KD(len(_bo.data.vertices))
        for _v in _bo.data.vertices: _kd.insert(_v.co,_v.index)
        _kd.balance()
        for _so in [_P[_q] for _q in ('shirt','waistcoat','jacket') if _q in _P]:      # every layer of the torso, so they keep moving as one
          for _v in _so.data.vertices:
            _k=(1-sstep(HIP+0.125,HIP+0.185,_v.co.z))*(1-sstep(SX*0.7,SX*0.9,abs(_v.co.x)))      # the torso only: a cuff hanging at hip height keeps its arm's weights
            if _k<=0.001: continue
            _co,_j,_d=_kd.find(_v.co); _wb={g.group:g.weight for g in _bo.data.vertices[_j].groups if o_is_bone(_bo,g.group)}; _wo={g.group:g.weight for g in _v.groups if o_is_bone(_so,g.group)}      # bone groups only
            _tb=sum(_wb.values()) or 1; _to=sum(_wo.values()) or 1; _wb={a_:b_/_tb for a_,b_ in _wb.items()}; _wo={a_:b_/_to for a_,b_ in _wo.items()}
            for _gi in list(_wo): _so.vertex_groups[_gi].remove([_v.index])
            _mix={}
            for _gi,_w in _wo.items(): _mix[_gi]=_mix.get(_gi,0)+_w*(1-_k)
            for _gi,_w in _wb.items(): _mix[_gi]=_mix.get(_gi,0)+_w*_k
            _tot=sum(_mix.values()) or 1
            for _gi,_w in _mix.items():
                if _w/_tot>0.002: _so.vertex_groups[_gi].add([_v.index],_w/_tot,'REPLACE')
          _smooth_bones(_so,lambda c:HIP+0.02<c.z<HIP+0.13 and abs(c.x)<SX*0.7,4)      # the blend reads the nearest point of the trousers, so it is evened out: the hem of a shirt, waistcoat or jacket over the waistband stays one smooth line
    if 'shirt' in _P: clear_layer(_P['shirt'],_skin,0.006)
    _sh=[_tr(_P['shirt'])] if 'shirt' in _P else []
    if 'breeches' in _P: clear_layer(_P['breeches'],_skin+_sh,0.007)
    if 'breeches' in _P:      # the waistband: the pushes folded its top edge under itself in places (a hidden lip the eye cannot see but the cloth check can). Relax the band, then lift it clear once more point by point
        bm=bmesh.new(); bm.from_mesh(_P['breeches'].data); band=[v for v in bm.verts if v.co.z>HIP+0.07]
        for _ in range(4): bmesh.ops.smooth_vert(bm,verts=band,factor=0.5,use_axis_x=True,use_axis_y=True,use_axis_z=False)
        for v in band:
            for t in _skin+_sh:
                loc,nrm,_i,dd=t.find_nearest(v.co,0.03)
                if loc is not None and (v.co-loc).dot(nrm)<0.007: v.co+=nrm*(0.007-(v.co-loc).dot(nrm))
        bm.normal_update(); bm.to_mesh(_P['breeches'].data); bm.free()
    if G.get('untucked') and 'shirt' in _P and 'breeches' in _P:
        # an untucked shirt hangs straight from the waist to a level hem: eased over the body alone it ballooned at the belly, curled in underneath and ended in a ragged edge with a notch at the back (owner, 17 November 2026)
        clear_layer(_P['shirt'],_skin+[_tr(_P['breeches'])],0.006,reach=0.05)
        _o=_P['shirt']; _bm=bmesh.new(); _bm.from_mesh(_o.data); _z1=HIP+0.16; _z0=HIP-0.075; _nb=36; _bin=lambda c,cy:(math.atan2(c.x,-(c.y-cy))+math.pi)/(2*math.pi)*_nb
        _ring=[v for v in _bm.verts if abs(v.co.z-_z1)<0.02 and abs(v.co.x)<SX*0.8]
        if _ring:
            _cy=sum(v.co.y for v in _ring)/len(_ring); _rw=[0.0]*_nb; _rm=[0.0]*_nb
            for v in _bm.verts:
                if abs(v.co.x)>SX*0.8 or v.co.z>_z1+0.02: continue
                k=int(_bin(v.co,_cy))%_nb; r=math.hypot(v.co.x,v.co.y-_cy); _rm[k]=max(_rm[k],r)
                if v.co.z>_z1-0.02: _rw[k]=max(_rw[k],r)
            for L in (_rw,_rm):
                for _ in range(_nb):
                    for k in range(_nb):
                        if L[k]==0: L[k]=max(L[k-1],L[(k+1)%_nb])
                L[:]=[max(L[k-1],L[k],L[(k+1)%_nb]) for k in range(_nb)]
                for _ in range(2): L[:]=[(L[k-1]+2*L[k]+L[(k+1)%_nb])/4 for k in range(_nb)]
            for v in _bm.verts:      # one straight line from the waist out to the widest thing under the shirt (the hips, the shorts' waistband) and down to the hem
                if v.co.z>=_z1 or abs(v.co.x)>SX*0.8: continue
                a=_bin(v.co,_cy); k=int(a)%_nb; fr=a-int(a); r=math.hypot(v.co.x,v.co.y-_cy); rw=_rw[k]*(1-fr)+_rw[(k+1)%_nb]*fr; rm=max(rw,_rm[k]*(1-fr)+_rm[(k+1)%_nb]*fr)+0.002
                tr=rw+(rm-rw)*min(1.0,(_z1-v.co.z)/(_z1-_z0))
                if r>1e-4: q=tr/r; v.co.x*=q; v.co.y=_cy+(v.co.y-_cy)*q
            _bm.to_mesh(_o.data); _bm.free(); _o.data.update(); clear_layer(_o,_skin+[_tr(_P['breeches'])],0.006,reach=0.05); _bm=bmesh.new(); _bm.from_mesh(_o.data)
            for v in _bm.verts:
                if v.is_boundary and v.co.z<_z0+0.06 and abs(v.co.x)<SX*0.8: v.co.z=_z0
            _bm.to_mesh(_o.data)
        _bm.free(); _o.data.update(); _sh=[_tr(_P['shirt'])]      # an untucked shirt lies over the trousers
    if 'skirt' in _P: clear_layer(_P['skirt'],_skin+_sh,0.004)
    _lay=_sh+([_tr(_P['breeches'])] if 'breeches' in _P else [])
    if 'waistcoat' in _P: clear_layer(_P['waistcoat'],_skin+_lay,0.008)
    _lay2=_lay+([_tr(_P['waistcoat'])] if 'waistcoat' in _P else [])
    def _tr_sel(o,sel):      # a tree of only the faces of o that sel keeps
        b=bmesh.new(); b.from_mesh(o.data); bmesh.ops.delete(b,geom=[f for f in b.faces if not sel(f.calc_center_median())],context='FACES'); b.normal_update(); t_=BVHTree.FromBMesh(b); b.free(); return t_
    if not OLD and 'jacket' in _P:      # the jacket is fitted over what stays under it: the shirt and the waistcoat are trimmed to what can be seen (below), so fitting it over their whole sleeves and backs only pushed it out
        _lay3=([_tr_sel(_P['shirt'],jacket_seen)] if 'shirt' in _P else [])+([_tr(_P['breeches'])] if 'breeches' in _P else [])+([_tr_sel(_P['waistcoat'],jacket_waistcoat_seen)] if 'waistcoat' in _P else [])
    else: _lay3=_lay2
    for _k in ('jacket','jacketskirt'):
        if _k in _P: clear_layer(_P[_k],_skin+(_lay3 if _k=='jacket' else _lay2),0.005)
    def recut(o,planes,sel):
        # cut again on the finished shape: the ease, the clearance and the smoothing bend an edge that was cut early, so a V came out as a wavy U. A plane cut made now is straight
        bm=bmesh.new(); bm.from_mesh(o.data)
        _mid=[f for f in bm.faces if sel(cz(f))]      # first a seam down the middle, so no face lies across it: a face that did was cut by one side's plane only and left a torn tab at the point of the V (owner, 21 November 2026)
        if _mid: bmesh.ops.bisect_plane(bm,geom=list(dict.fromkeys(v for f in _mid for v in f.verts))+list(dict.fromkeys(e for f in _mid for e in f.edges))+_mid,plane_co=(0,0,0),plane_no=(1,0,0),dist=1e-5)
        for co,no,flt in planes:
            fs=[f for f in bm.faces if sel(cz(f)) and (flt is None or flt(cz(f)))]
            if not fs: continue
            bmesh.ops.bisect_plane(bm,geom=list(dict.fromkeys(v for f in fs for v in f.verts))+list(dict.fromkeys(e for f in fs for e in f.edges))+fs,plane_co=co,plane_no=no,clear_outer=True)
        bmesh.ops.delete(bm,geom=[v for v in bm.verts if not v.link_faces],context='VERTS')
        bm.normal_update(); bm.to_mesh(o.data); bm.free()
    if 'waistcoat' in _P and G.get('vwaist'):
        RECUT_V=lambda: recut(_P['waistcoat'],[((0.013,0,WVZ-0.008),Vector((-WVK,0,1)).normalized(),lambda c:c.x>0),((-0.013,0,WVZ-0.008),Vector((WVK,0,1)).normalized(),lambda c:c.x<0)],      # (6 mm wider and 8 mm deeper than the first cut: where the first cut's wavy edge lay inside this one, it stayed as a notch)
              lambda c:c.y<0 and c.z>WVZ-0.09 and abs(c.x)<SX*0.9)      # (well below the point: a face whose middle lay under it but which reached above was left uncut, a notch in the V's edge)
        RECUT_V()
if OLD:
    for k,o in parts:
        if k in ('shirt','coat'): smooth_weights(o,(lambda c:c.z>HIP+0.12 and abs(c.x)>SX*0.85) if (k=='shirt' and EASE_OLD) else (lambda c:c.z>HIP+0.12),16)      # (a shirt with ease: the sleeves only; its torso is evened out by shirt_weights below)
        if k=='shirt' and EASE_OLD: shirt_weights(o)
        if k=='coat': shirt_weights(o)      # a coat's front and back, well inside the armholes, follow the chest, not the swinging arms (they creased into dark flaps at the shoulders when walking)      # as in later eras: the chest of the shirt no longer follows the arms (it bent into mounds and tore at the armholes), and the neckline follows the chest like the skin under it
        if k=='breeches':      # each leg of the breeches follows its own leg only: wide slops took some weight from the other thigh and tore at the hem
            _nb={}
            for e in o.data.edges:
                a_,b_=e.vertices; _nb.setdefault(a_,[]).append(b_); _nb.setdefault(b_,[]).append(a_)
            def _side(v):      # a point right on the middle line (the inside seam of each leg) belongs to the leg its neighbours are on; left undecided it followed both and was pulled out in a spike when the legs parted
                if abs(v.co.x)>=0.002: return v.co.x
                sx=sum(o.data.vertices[j].co.x for j in _nb.get(v.index,[])); return sx if abs(sx)>1e-5 else 0.0
            for v in o.data.vertices:
                sd=_side(v)
                if v.co.z>CROTCH or sd==0.0: continue
                ws=[(g.group,g.weight) for g in v.groups]; bad=[gi_ for gi_,w in ws if ('Right' if sd>0 else 'Left') in o.vertex_groups[gi_].name]
                if not bad: continue
                for gi_ in bad: o.vertex_groups[gi_].remove([v.index])
                keep=[(gi_,w) for gi_,w in ws if gi_ not in bad]; tot=sum(w for gi_,w in keep)
                if tot<1e-4: o.vertex_groups['mixamorig:'+('Left' if sd>0 else 'Right')+'UpLeg'].add([v.index],1.0,'REPLACE')
                else:
                    for gi_,w in keep: o.vertex_groups[gi_].add([v.index],w/tot,'REPLACE')
            smooth_weights(o,lambda c:c.z<CROTCH+0.06 and (c.z>CROTCH-0.03 or abs(c.x)>0.01),3)      # (not across the inside seams below the fork, which would mix the two legs again)
if OLD and 'breeches' in dict(parts):      # 1690 breeches: the fork above the split legs is evened out too (seated, it crumpled into spikes); below CROTCH-0.02 each leg keeps its own weights
    _smooth_bones(dict(parts)['breeches'],lambda c:(abs(c.x)<0.10 and CROTCH-0.02<c.z<CROTCH+0.10) or (abs(c.x)<0.035 and CROTCH-0.08<c.z<=CROTCH-0.02),14)
if not OLD and 'breeches' in dict(parts):      # later trousers: at the fork each point took weights from both thighs and the hips unevenly, and seated (legs apart) single points were pulled two ways into spikes. The fork's weights are evened out over a wide patch
    _smooth_bones(dict(parts)['breeches'],lambda c:abs(c.x)<0.09 and CROTCH-0.07<c.z<CROTCH+0.10,14)
for k,o in parts:            # coat skirts follow both legs as one cloth, like Abba's skirt
    if k not in ('coatskirt','skirt','jacketskirt'): continue
    B={n:o.vertex_groups['mixamorig:'+n] for n in ('Hips','LeftUpLeg','RightUpLeg','LeftLeg','RightLeg')}; idx=list(range(len(o.data.vertices)))
    for g in o.vertex_groups:
        if g.name.startswith('mixamorig:'): g.remove(idx)
    for v in o.data.vertices:
        t=max(0.0,min(1.0,(HIP+0.06-v.co.z)/0.5)); leg=(0.3 if k=='jacketskirt' else (0.6 if (OLD or k=='coatskirt') else 0.9))*sstep(0.1,0.9,t); left=sstep(-1.0,1.0,v.co.x/0.15)      # a later skirt rides almost wholly on the legs, so a leg that swings forward carries the cloth with it instead of pushing through
        if k=='coatskirt': front=sstep(0.13,-0.02,v.co.y); leg=front*0.95*sstep(-0.15,0.45,t)+(1-front)*0.6*sstep(-0.05,0.7,t)      # the sides follow the thighs too (left with the hips, a striding thigh swung out through the side of the skirt); the back still hangs from the hips
        if k=='coatskirt' and G.get('coatopen',True): left=sstep(-0.004,0.004,v.co.x)      # an open coat's panels (two in front, two either side of the back vent) are separate cloths: each follows its own leg only      # an open coat's two front panels are separate cloths: each follows its own leg only (blended across the middle, the striding thigh came through the other panel's edge)   # the front panels ride on their own thigh (the knee carries them forward), the back hangs from the hips and opens at the vent
        shin=0.0
        if k=='skirt' and not OLD:      # below the knee a later skirt passes in part to the shins, all round: seated, it falls over the knees and down instead of standing out from the thighs like a tray
            shin=0.7*sstep(KNEE+0.07,KNEE-0.08,v.co.z)
        for n,val in (('Hips',1-leg),('LeftUpLeg',leg*left*(1-shin)),('RightUpLeg',leg*(1-left)*(1-shin)),('LeftLeg',leg*left*shin),('RightLeg',leg*(1-left)*shin)):
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
def soft(name,bm,mat,only=TORSO,src=None):     # an extra piece that bends with the body: it takes its bone weights from the nearest skin, but only for the bones in `only` (so a collar never follows an arm)
    me=bpy.data.meshes.new(name); bmesh.ops.recalc_face_normals(bm,faces=bm.faces[:]); bm.to_mesh(me); bm.free()
    o=bpy.data.objects.new(name,me); bpy.context.scene.collection.objects.link(o); me.materials.append(colmat(mat))
    if src is not None:
        for g in src.vertex_groups:
            if g.name not in o.vertex_groups: o.vertex_groups.new(name=g.name)
    md=o.modifiers.new('wt','DATA_TRANSFER'); md.object=src or h; md.use_vert_data=True; md.data_types_verts={'VGROUP_WEIGHTS'}
    md.vert_mapping='POLYINTERP_NEAREST'; md.layers_vgroup_select_src='ALL'; md.layers_vgroup_select_dst='NAME'
    with ov(o): bpy.ops.object.modifier_apply(modifier='wt')
    ok={o.vertex_groups['mixamorig:'+n].index for n in only if 'mixamorig:'+n in o.vertex_groups}; idx=list(range(len(me.vertices)))
    for v in (me.vertices if src is None else []):      # with src the piece keeps every weight of the cloth it lies on, so the two move as one
        w=[(g.group,g.weight) for g in v.groups if g.group in ok and g.weight>0]; tot=sum(x[1] for x in w)
        for g in list(v.groups): o.vertex_groups[g.group].remove([v.index])
        if tot<1e-4: nb=min(only,key=lambda n:(J(n)-v.co).length); (o.vertex_groups.get('mixamorig:'+nb) or o.vertex_groups.new(name='mixamorig:'+nb)).add([v.index],1.0,'REPLACE')   # nothing usable nearby: follow the nearest of the allowed bones
        else:
            for gi_,wt in w: o.vertex_groups[gi_].add([v.index],wt/tot,'REPLACE')
    o.parent=rig; o.modifiers.new('Armature','ARMATURE').object=rig; clothes.append(o); return o
def tree_of(o):
    b=bmesh.new(); b.from_mesh(o.data); return BVHTree.FromBMesh(b)
PART=dict(parts)
ON=lambda k:None if OLD else PART.get(k)      # later eras: a piece that lies on a garment (collar, front band, buttons, pocket, tie, lapels) takes its bone weights from that garment
if not OLD and 'SKIN' in globals():      # over the top of the shoulders the shirt keeps the body's own line (no ease there), and where the skin rose a little it came through: keep it at least 4 mm clear
    _b=bmesh.new(); _b.from_mesh(PART['shirt'].data); _mv=[]
    for v in _b.verts:
        if v.co.z<SH.z-0.05: continue
        loc,nrm,_i,_d=SKIN.find_nearest(v.co,0.03)
        if loc is None: continue
        sd=(v.co-loc).dot(nrm)
        if sd<0.004: v.co+=nrm*(0.004-sd); _mv.append(v)
    _b.to_mesh(PART['shirt'].data); _b.free()
SHT=tree_of(PART['shirt'])
def shirt_front(z,x=0.0):      # the y of the shirt's front surface
    hit=SHT.ray_cast(Vector((x,-1,z)),Vector((0,1,0)))[0]; sk=(SKIN if 'SKIN' in globals() else tree).ray_cast(Vector((x,-1,z)),Vector((0,1,0)))[0]      # the skin alone: the full mesh also holds helper shapes that stand in front of the body
    if hit and (CK!='camp' or sk is None or hit.y<sk.y+0.01): return hit.y
    return (sk.y if sk else _front(z))-0.008      # the ray went through an opening (the V of a camp collar) and met the back of the shirt from inside: the front is the skin's, not the back's (only a camp collar's V is open low enough for this)
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
def ring_fix(rows,j,under=None,mn=0.0,inside=None,imn=0.0,iters=4):
    # Even out one line of a collar (point j of every row) along the ring. Measured one by one, a point could land far from its neighbours (a ray that just missed the shoulder,
    # the nearest point of a shirt that turns at the collarbone), and each such point stood up as a tooth. First a running median of five (round the neck's axis, so the ring
    # keeps its size) removes single spikes, then the line is smoothed. under: lift it at least mn clear of that surface; the lifts are spread along the ring, so the line
    # moves out as one smooth curve instead of point by point. inside: keep it at least imn inside that surface (a yoke that must stay under the shirt).
    n=len(rows); cyl=lambda q:(math.atan2(q.x,-(q.y-NJ.y)),math.hypot(q.x,q.y-NJ.y),q.z); P=[rows[i][j].copy() for i in range(n)]
    C=[cyl(q) for q in P]
    for i in range(2,n-2):
        a,_r,_z=C[i]; r=sorted(c[1] for c in C[i-2:i+3])[2]; z=sorted(c[2] for c in C[i-2:i+3])[2]; P[i]=Vector((math.sin(a)*r,NJ.y-math.cos(a)*r,z))
    for _ in range(iters): P=[P[i] if i in (0,n-1) else (P[i-1]+P[i]*2+P[i+1])/4 for i in range(n)]
    if under is not None:
        Z=Vector((0,0,0)); D=[]
        for q in P:
            loc,nrm,_i,_d=under.find_nearest(q,0.05); sd=(q-loc).dot(nrm) if loc is not None else mn
            if loc is not None and (q-loc-nrm*sd).length>0.004: sd=mn      # off the edge of that surface: nothing is under the point there
            D.append(nrm*(mn-sd) if sd<mn else Z.copy())
        D=[max(D[max(0,i-2):i+3],key=lambda d:d.length) for i in range(n)]
        for _ in range(3): D=[(D[max(0,i-1)]+D[i]*2+D[min(n-1,i+1)])/4 for i in range(n)]
        P=[q+d for q,d in zip(P,D)]
    if inside is not None:
        for i,q in enumerate(P):
            loc,nrm,_i,_d=inside.find_nearest(q,0.05)
            if loc is not None and (q-loc).dot(nrm)>-imn: P[i]=q-nrm*((q-loc).dot(nrm)+imn)
    for i in range(n): rows[i][j]=P[i]
def ring_weights(o,n,m,iters=8,flat=False):
    # A collar is built as n rows of m points round the neck, and each point copied its bone weights from the nearest point of the shirt. Neighbouring points often found
    # different shirt points (the neck edge, the shoulder, even the top of a sleeve), so one point followed the arm or the head and the next the chest: in any pose the edge
    # tore into saw teeth. Here the arms' share goes to their shoulder and the head's to the neck, and the weights are evened out along the ring, so the collar bends as one band.
    me=o.data; vg=o.vertex_groups; MAP={'Head':'Neck','LeftArm':'LeftShoulder','LeftForeArm':'LeftShoulder','LeftHand':'LeftShoulder','RightArm':'RightShoulder','RightForeArm':'RightShoulder','RightHand':'RightShoulder','Spine':'Spine1','Hips':'Spine1'}
    if flat: MAP={'Head':'Spine2','Neck':'Spine2','Spine':'Spine1','Hips':'Spine1'}      # a flat collar lies on the blouse and must move as the blouse under it does, arm weights included (moved to the shoulder, the blouse dropped away under it when the arms reached down and the collar stood up like a wing); only the neck's share goes to the chest      # a flat collar lies on the shoulders: following the neck, its back stood up when the head bowed      # a flat collar lies on the shoulders: following the neck, its back stood up in a flap when the head bowed
    W=[]
    for v in me.vertices:
        d={}
        for g in v.groups:
            nm=vg[g.group].name
            if not nm.startswith('mixamorig:') or g.weight<=0: continue
            b=MAP.get(nm[10:],nm[10:]); d[b]=d.get(b,0)+g.weight
        t=sum(d.values()) or 1; W.append({k:w/t for k,w in d.items()} if d else {'Spine2':1.0})
    for _ in range(iters):
        N=[]
        for i in range(n):
            for j in range(m):
                acc={}
                for ii,wt in ((max(0,i-1),1),(i,2),(min(n-1,i+1),1)):
                    for k,w in W[ii*m+j].items(): acc[k]=acc.get(k,0)+w*wt/4
                N.append(acc)
        W=N
    for v in me.vertices:
        for g in [g.group for g in v.groups if vg[g.group].name.startswith('mixamorig:')]: vg[g].remove([v.index])
    for v,d in zip(me.vertices,W):
        for k,w in d.items():
            if w>0.002: (vg.get('mixamorig:'+k) or vg.new(name='mixamorig:'+k)).add([v.index],w,'REPLACE')
def on_shirt(p,off):      # the nearest point of the shirt to p, lifted off the cloth by `off`
    loc,nrm,_i,_d=SHT.find_nearest(p); return loc+nrm*off
NW_SEAMLESS=False; NW_PLACKET_TOP=None
if CK in ('stand','turn','open','camp','round','band','plain') and PART.get('shirt') and 'SKIN' in globals():      # later eras: collars and ties are built by neckwear.py, attached to the shirt (21 November 2026: the old code here had grown into a stack of patches and the collars came out jagged)
    _nwp=os.path.join(os.path.dirname(os.path.abspath(__file__)),'neckwear.py'); exec(compile(open(_nwp).read(),_nwp,'exec'))
elif CK:      # the 1690 neckband
    # a shirt collar built round the neck itself: a band that stands up from the shirt's neck opening and, for a turn-down collar, a leaf folded over it that ends in two points at the front
    bm=bmesh.new(); seg=32; gap={'stand':0.05,'turn':0.07,'open':0.42,'band':0.16}[CK]; rows=[]; hs=(0.046 if CK=='stand' else (0.014 if CK=='band' else 0.034))*s
    for k in range(seg+1):
        a=gap+(2*math.pi-2*gap)*k/seg; f=0.5+0.5*math.cos(a)
        b0=collar_pt(a,NECK-0.004,NECK-0.004-0.008*s,0.016); row=[]
        if CK!='open' and G.get('yoke',0):      # (off by default since 17 November 2026: the skin under the shirt is tucked in and bound to it, and the yoke showed through the shirt's neck as a ragged band at the back) under the seam the collar carries on down as a yoke that lies on the skin beneath the shirt, so no skin shows between collar and shirt when the body moves
            for dz in ((0.022,) if G.get('yoke',0)==1 else (0.034,0.017)):      # one short row of yoke, close on the skin: 8.5 cm deep and 5.5 mm off the skin, it ran up against the shirt and came through it in ragged patches (owner, 17 November 2026)
                zz=b0.z-dz*s*(0.45+0.55*f); rr=rad_out(zz,a)+0.0025; row.append(Vector((math.sin(a)*rr,NJ.y-math.cos(a)*rr,zz)))
        row+=[b0,collar_pt(a,NECK-0.004+hs,NECK-0.012*s+hs,0.007)]
        if CK not in ('stand','band'):
            fr=max(0.0,(f-0.80)/0.20); q=collar_pt(a,NECK-0.004+hs+0.0045,NECK-0.012*s+hs+0.0045,0.010); e=collar_pt(a,NECK-0.008*s,NECK-0.02*s,0.030) if not (G.get('jacket') or G.get('waistcoat')) else collar_pt(a,NECK+0.004*s,NECK-0.012*s,0.022)      # q: the fold sits just over the band's top edge, so the edge does not show as a dark rim at the back
            r0=math.hypot(e.x,e.y-NJ.y); r1=rad_out(e.z,a)+(0.013 if not (G.get('jacket') or G.get('waistcoat')) else 0.011)
            if r1>r0: e.x*=r1/r0; e.y=NJ.y+(e.y-NJ.y)*r1/r0
            if fr>0:      # the points: longer, lying on the shirt front, spread a little apart
                sx=1 if math.sin(a)>=0 else -1; zp=NECK-0.058*s; xp=sx*0.034*s; tip=Vector((xp,shirt_front(zp,xp)-0.008,zp)); e=e.lerp(tip,fr**0.8)
            row+=[q,e]
        rows.append(row)
    if not OLD or EASE_OLD:      # every line of the collar is evened out along the ring (see ring_fix); the yoke stays on the skin and under the shirt, the band and the leaf stay clear of the shirt (the 1690 neckband had the same teeth)
        ny=0 if (CK=='open' or not G.get('yoke',0)) else (1 if G.get('yoke',0)==1 else 2)
        for j in range(len(rows[0])):
            if j<ny: ring_fix(rows,j,SKIN,0.003,SHT,0.0045)      # the yoke 4.5 mm inside the shirt: at 2 mm the two surfaces fought for the same pixels and showed as ragged patches under the collar (owner, 17 November 2026)
            elif j in (ny+1,ny+2) and G.get('collarfit',1): ring_fix(rows,j,SKIN,0.005 if j==ny+1 else 0.008)      # the band's top edge and the fold stand clear of the neck itself all the way round (measured from an ellipse, the neck came through the band in a ragged line at the throat, and lifted over the shirt it stood up in two teeth at the back: owner, 17 November 2026)
            else: ring_fix(rows,j,SHT,0.003 if j==ny else 0.004)
        for row in rows:      # and then hard: each yoke point well inside the shirt and the seam just on it, so the band meets the shirt in one clean line (smoothed, the yoke crossed the shirt and showed as ragged patches: owner, 17 November 2026)
            for j in range(ny):
                loc,nrm,_i,_d=SHT.find_nearest(row[j])
                if loc is not None and (row[j]-loc).dot(nrm)>-0.0045: row[j]=loc-nrm*0.0045
            for j in range(ny+(3 if G.get('collarfit',1) else 2),len(row)):      # the folded leaf lies on the shirt, never in it: each of its points at least 4 mm over the shirt (measured from the skin, the leaf sank into an eased shirt and the shirt showed through it in patches)
                loc,nrm,_i,_d=SHT.find_nearest(row[j])
                if loc is not None and (row[j]-loc).dot(nrm)<0.004: row[j]=loc+nrm*0.004
            if CK!='open':      # the band's lowest row goes just under the shirt's neck edge, so no slit of skin opens between them (with no yoke under it)
                loc,nrm,_i,_d=SHT.find_nearest(row[ny])
                if loc is not None: row[ny]=loc+nrm*(0.0012 if ny else -0.004)
    rows=[[bm.verts.new(q) for q in row] for row in rows]
    quadstrip(bm,[list(r) for r in zip(*rows)]); _co=soft('Collar',bm,'Shirt' if CK=='band' else 'Collar',only=('Spine2','Neck','LeftShoulder','RightShoulder'),src=ON('shirt'))
    if not OLD or EASE_OLD: ring_weights(_co,len(rows),len(rows[0]))
    _cb=bmesh.new(); _cb.from_mesh(_co.data); _cb.normal_update(); _fl=[f for f in _cb.faces if f.normal.dot(Vector((cz(f).x,cz(f).y-NJ.y,0)))<0]      # every face of the band and its folded leaf looks outward from the neck: the automatic normals of a strip that folds back on itself flipped some faces, which drew as grey blocks on the collar (owner, 17 November 2026)
    if _fl: bmesh.ops.reverse_faces(_cb,faces=_fl)
    _cb.to_mesh(_co.data); _cb.free(); _co.data.update()
if G.get('buttons',not G.get('woman') and not OLD) and not G.get('coat'):      # the shirt's front band and its buttons
    bm=bmesh.new(); z1=NW_PLACKET_TOP if NW_PLACKET_TOP is not None else ((VZ-0.004*s) if CK=='camp' else collar_base(0)-0.012*s); z0=WAIST+0.01
    if G.get('waistcoat') and G.get('vwaist') and not OLD and 'WVZ' in globals(): z0=max(z0,WVZ+0.012)      # under a V waistcoat the band stops just above the point of the V: carried on down, it came through the waistcoat's edge beside the point as a notch (owner, 21 November 2026: "torn in the center")
    if G.get('skirt') and G.get('belt'): z0=max(z0,HIP+(0.118 if G.get('sash') else 0.092))      # the band stops where the belt or sash covers it, so it never lies on top of them
    n=10 if OLD else 24; rows=[]
    for t in range(n+1):
        z=z1+(z0-z1)*t/n; y=min(shirt_front(z,-0.014*s),shirt_front(z),shirt_front(z,0.014*s))-(0.003 if OLD else 0.0045); rows.append([bm.verts.new((-0.014*s,y,z)),bm.verts.new((0.014*s,y,z))])      # later eras: a finer strip that clears the shirt across its whole width
    quadstrip(bm,rows); soft('Placket',bm,'Shirt',src=ON('shirt'))
    if not G.get('tie') or True:
        bm=bmesh.new(); nb=max(3,int((z1-z0)/(0.075*s)))
        for i in range(nb):
            z=z1-0.03*s-(z1-z0-0.04*s)*i/(nb-1); y=shirt_front(z)-0.006
            bmesh.ops.create_circle(bm,cap_ends=True,segments=6,radius=0.0055*s,matrix=Matrix.Translation((0,y,z))@Matrix.Rotation(math.pi/2,4,'X'))
        soft('Buttons',bm,'Buttons',src=ON('shirt'))
if G.get('trousers') and G.get('belt',True) and (not G.get('waistcoat') or G.get('belt')=='always') and not G.get('apron') and not G.get('jacket'):     # a belt round the waistband, with a buckle
    TT=tree_of(PART['breeches']); bm=bmesh.new(); seg=28; rows=[]; WCT=tree_of(PART['waistcoat']) if PART.get('waistcoat') else None; cov={}
    for z,e in ((HIP+0.082,0.004),(HIP+0.083,0.009),(HIP+0.113,0.009),(HIP+0.114,0.004)):
        ring=[]
        for k in range(seg):
            a=2*math.pi*k/seg; d=Vector((math.sin(a),-math.cos(a),0)); o=Vector((0,J('Hips').y,z)); hit=TT.ray_cast(o,d)[0]; r0=(hit-o).length if hit else 0.15; r=r0+e
            if WCT is not None:      # under a waistcoat the belt lies flat on the trousers, 4 mm inside the waistcoat: standing its full 9 mm off them it came through the waistcoat's back as a strip (the seen check, 17 November 2026)
                hw=WCT.ray_cast(o,d)[0]
                if hw is not None: r=max(r0+0.002,min(r,(hw-o).length-0.004)); cov[k]=cov.get(k,0)+1
            ring.append(bm.verts.new(o+d*r))
        rows.append(ring)
    quadstrip(bm,rows,close=True)
    if WCT is not None:      # and the part of the belt that lies wholly under the waistcoat is left out: nobody sees it, and it moves with the hips while the waistcoat moves with the chest, so it came through the waistcoat's back whenever the body bent
        hid=[k for k in range(seg) if cov.get(k,0)==4 and cov.get((k-1)%seg,0)==4 and cov.get((k+1)%seg,0)==4]; dead=set()
        for k in hid:
            for row in rows: dead.add(row[k])
        bmesh.ops.delete(bm,geom=list(dead),context='VERTS')
    if len(bm.faces): soft('Belt',bm,'Belt',only=('Hips','Spine'))      # a belt wholly under the waistcoat is not made at all
    else: bm.free()
    bm=bmesh.new(); o=Vector((0,J('Hips').y,HIP+0.098)); hit=TT.ray_cast(o,Vector((0,-1,0)))[0]; yb=(hit.y if hit else -0.12)-0.012
    if not G.get('waistcoat'): bmesh.ops.create_cube(bm,size=1,matrix=Matrix.Translation((0,yb,HIP+0.098))@Matrix.Diagonal((0.044*s,0.006,0.038*s,1))); soft('Buckle',bm,'Buckle',only=('Hips','Spine'))
if OLD and G.get('breeches') and not G.get('coat'):      # a waistband: a narrow band of the breeches' own cloth round their top edge, so that edge (cut across a curved body) reads as a clean seam
    TT=tree_of(PART['breeches']); bm=bmesh.new(); seg=32; rows=[]
    for z,e in ((HIP+0.078,0.0),(HIP+0.082,0.003),(HIP+0.135,0.003),(HIP+0.139,0.0)):      # a flat band, not a roll, deep enough to cover the wavy top of the breeches and the tucked shirt under it
        ring=[]
        for k in range(seg):
            a=2*math.pi*k/seg; d=Vector((math.sin(a),-math.cos(a),0)); o=Vector((0,J('Hips').y,z-0.03)); hit=TT.ray_cast(o+d*0.4,-d)[0]; o2=Vector((0,J('Hips').y,z)); h2=SHT.ray_cast(o2,d,0.3)[0]; r=max(((hit-o).length if hit else 0.15),((h2-o2).length+0.002) if h2 is not None else 0.0)+e
            if z>HIP+0.137 and h2 is not None: r=(h2-o2).length+0.002      # the top edge closes in onto the shirt: no open lip of band stands round it
            ring.append(bm.verts.new(o+d*r+Vector((0,0,0.03))))      # never inside the shirt that blouses over it (measured from the inside out: from outside, a ray met the hanging sleeve first)
        rows.append(ring)
    quadstrip(bm,rows,close=True,flip=True); soft('Waistband',bm,'Breeches',only=('Hips','Spine'))
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
    _lp=soft('Lapels',bm,'Jacket',only=('Spine2','Spine1','Neck','LeftShoulder','RightShoulder')); _smooth_bones(_lp,lambda c:True,8); bm=bmesh.new()      # the lapels lie on the chest: with the jacket's own arm weights, the lapel on the side of a raised arm tore into slivers
    for i in range(2):
        z=vz_-0.035*s-0.075*s*i; bmesh.ops.create_circle(bm,cap_ends=True,segments=8,radius=0.009*s,matrix=Matrix.Translation((0.012*s,jy(0.012*s,z)-0.004,z))@Matrix.Rotation(math.pi/2,4,'X'))
    soft('JButtons',bm,'Buttons',src=ON('jacket'))
if G.get('waistcoat') and not OLD and not G.get('jacket') and G.get('vwaist'):      # a row of small buttons down the waistcoat's front, from the point of the V to the hem (material WaistcoatButtons: a game that hides the Waistcoat hides these with it)
    WT=tree_of(PART['waistcoat']); bm=bmesh.new(); z1=WVZ-0.022*s; z0=HIP+0.07; nb=5
    for i in range(nb):
        z=z1+(z0-z1)*i/(nb-1)
        if G.get('apron') and z<HIP+0.14: continue      # under an apron's top they cannot be seen, and a seated pose pushed them through it
        hit=WT.ray_cast(Vector((0,-1,z)),Vector((0,1,0)))
        if hit[0] is not None: bmesh.ops.create_circle(bm,cap_ends=True,segments=8,radius=0.0065*s,matrix=Matrix.Translation(hit[0]-Vector((0,0.0025,0)))@Matrix.Rotation(math.pi/2,4,'X'))
    COL.setdefault('WaistcoatButtons',COL['Waistcoat']*0.45); soft('WaistcoatButtons',bm,'WaistcoatButtons',src=PART['waistcoat'])
if G.get('pocket'):      # a patch pocket on the chest: a slightly raised panel with a rounded bottom, in its own material (a shade darker than the shirt unless the game sets it)
    COL.setdefault('Pocket',COL['Shirt']*0.86); bm=bmesh.new(); px=0.088*s; pz=VZ-0.035*s; pw=0.040*s; ph=0.088*s; rows=[]
    for j in range(5):
        v=j/4; half=pw*(1.0 if v<0.75 else 0.82); rows.append([bm.verts.new(on_shirt(Vector((px+half*(i/2-1),-0.3,pz-ph*v)).lerp(Vector((px+half*(i/2-1),shirt_front(pz-ph*v,px+half*(i/2-1)),pz-ph*v)),1.0),0.0035)) for i in range(5)])
    quadstrip(bm,rows); _pk=soft('Pocket',bm,'Pocket',only=('Spine2','Spine1','Spine')); _smooth_bones(_pk,lambda c:True,6)      # chest weights only (with the shirt's, its edge followed the raised arm and tore)
if G.get('skirt') and G.get('belt'):     # a narrow belt where the bodice meets the skirt (or, with sash, a deep smooth waistband over the top of the skirt and the bottom of the blouse)
    TT=tree_of(PART['skirt']); bm=bmesh.new(); seg=28; rows=[]
    SA=G.get('sash'); seg=48 if SA else seg; zs=((HIP+0.078,0.0005),(HIP+0.080,0.003),(HIP+0.100,0.0035),(HIP+0.120,0.003),(HIP+0.122,0.0005)) if SA else ((HIP+0.070,0.001),(HIP+0.071,0.004),(HIP+0.094,0.004),(HIP+0.095,0.001))      # a flat band about 4 mm thick: thicker, it read as a roll
    RR=[]
    for z,e in zs:
        rr_=[]
        for k in range(seg):
            a=2*math.pi*k/seg; d=Vector((math.sin(a),-math.cos(a),0)); o=Vector((0,J('Hips').y,z)); hit=TT.ray_cast(o,d)[0]; h2=SHT.ray_cast(o,d)[0]; rr_.append(max((hit-o).length if hit else 0.0,(h2-o).length if h2 else 0.0) or 0.15)
        RR.append(rr_)
    if True:      # a belt or sash is one straight band lying snug on the join of bodice and skirt: at each angle it takes the widest of its rows over both blouse and skirt (so the folds of the skirt beneath cannot wave its edge and it never tilts out into a lip), then it is evened out round the body
        raw=[max(r_[k] for r_ in RR) for k in range(seg)]; col=raw[:]
        for _ in range(8): col=[max(raw[k],(col[(k-1)%seg]+col[k]*2+col[(k+1)%seg])/4) for k in range(seg)]
        RR=[col for _ in RR]
    for (z,e),rr_ in zip(zs,RR):
        ring=[]
        for k in range(seg):
            a=2*math.pi*k/seg; d=Vector((math.sin(a),-math.cos(a),0)); o=Vector((0,J('Hips').y,z)); r=rr_[k]+e
            ring.append(bm.verts.new(o+d*r))
        rows.append(ring)
    ring=[]      # a flat rim across the top of the band onto the blouse, so no gap shows behind it (the band itself stays straight)
    for k in range(seg):
        a=2*math.pi*k/seg; d=Vector((math.sin(a),-math.cos(a),0)); z=zs[-1][0]; o=Vector((0,J('Hips').y,z)); h2=SHT.ray_cast(o,d)[0]
        ring.append(bm.verts.new(o+d*min(RR[-1][k],((h2-o).length+0.0008) if h2 is not None else RR[-1][k])))
    rows.append(ring)
    quadstrip(bm,rows,close=True); soft('Belt',bm,'Belt',src=ON('shirt'))      # with the blouse's own weights: seated, the waist bends forward, and a belt on the hips stood off it as a ring
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
    COL.setdefault('ShoeBuckle',srgb((176,170,150))); soft('ShoesBuckle',bm,'ShoeBuckle',only=('LeftFoot','RightFoot')); soft('ShoesTongue',bt,'Shoes',only=('LeftFoot','RightFoot'))
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
    BZ=TOP-0.085*s-G.get('hatdrop',0)*s; xs=[];ys=[]      # hatdrop (metres): the hat sits this much lower on the head. TOP is measured on a helper shape about 13 mm above the real skull, so a stiff cap rode high (owner, 16 November 2026: the Emperor's and the police caps)
    for v in h.data.vertices:
        if abs(v.co.z-(BZ+0.012*s))<0.012*s and v.co.z>HEAD: xs.append(v.co.x); ys.append(v.co.y)
    return (max(xs)+min(xs))/2,(max(ys)+min(ys))/2,(max(xs)-min(xs))/2+grow,(max(ys)-min(ys))/2+grow,BZ
def lathe(bm,prof,fit,seg=28,mod=None,cap=True):      # turn a profile [(how far out, how high)...] round the head's outline; mod(a,i,out,up) can bend it
    cx,cy,rx,ry,BZ=fit; rings=[]
    for i,(dr,dz) in enumerate(prof):
        ring=[]
        for k in range(seg):
            a=2*math.pi*k/seg; d,z=mod(a,i,dr,dz) if mod else (dr,dz); q=Vector((cx+math.sin(a)*(rx+d),cy-math.cos(a)*(ry+d),BZ+z))
            if not OLD and d<0.02:      # a head is not an ellipse: where the skull (and the hair on it) comes out further than the hat's outline, the hat goes round it
                c0=Vector((cx,cy,BZ+z)); dv=q-c0; L=dv.length
                if L>1e-4:
                    hit=SKIN.ray_cast(c0,dv/L)[0]; need=((hit-c0).length+0.0105+max(0.0,min(d,0.005))) if hit else 0
                    if L<need: q=c0+dv/L*need
            ring.append(bm.verts.new(q))
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
    elif HK=='felt' and not OLD:
        # a felt hat of 1800 to 1930, turned round the head like the others (see lathe): a ring of brim, a crown that clears the hair, a band on the crown. One closed shell, so no part of it lies inside another.
        fit=head_fit(0.008); BR=G.get('brim',1.0); bm=bmesh.new(); bb=bmesh.new(); Hh=(TOP-fit[4])+(0.022+0.012*min(BR,1.0))*s      # the crown clears the skull by 2 to 3.5 cm (it stood 7 cm clear, a stovepipe on every felt hat: owner, 16 November 2026)
        def mod(a,i,d,z):
            if i in (3,4): return d,z+0.020*0.5*(0.5+0.5*math.sin(a*2+1.2))*max(0.0,(d-0.03*s)/(0.06*s))      # the brim turns up a little, unevenly
            return d,z
        rr=lathe(bm,[(0.008,Hh-0.006),(0.0165,Hh*0.70),(0.019,0.004),(0.085*s*BR,0.004),(0.085*s*BR,-0.004),(0.020,-0.004),(0.016,-0.004),(0.016,Hh*0.5),(0.008,Hh-0.012)],fit,seg=32,mod=mod,cap=False); quadstrip(bm,[rr[-1],rr[0]],close=True); bm.faces.new(rr[-1])      # a closed shell, from the crown's top down the outside, along the brim and back up the inside
        lathe(bm,[(0.008,Hh-0.006),(-0.004,Hh+0.004),(-0.030*s,Hh+0.008)],fit,seg=32)      # a rounded top to the crown (owner, 21 November 2026: "ensure the hats are correctly placed"). The crown used to end in a flat dish with
        # a rim, its sides stepped out toward the brim and the band stood 5 mm proud of them, so the hat read as three stacked rings perched on the head.
        lathe(bb,[(0.0205,0.026*s),(0.0205,0.006*s)],fit,seg=32,cap=False)      # the ribbon lies on the crown's base, 2 mm proud
        rigid(HM,bm,HM,'Head'); rigid(HM+'Band',bb,HM+'Band','Head')
    elif HK=='felt':
        # fit the crown to this head: measure the skull's outline at brow height so the hat sits down over it
        BZ=TOP-0.085*s-G.get('hatdrop',0)*s; xs=[];ys=[]      # hatdrop (metres): the hat sits this much lower on the head. TOP is measured on a helper shape about 13 mm above the real skull, so a stiff cap rode high (owner, 16 November 2026: the Emperor's and the police caps)
        for v in h.data.vertices:
            if abs(v.co.z-(BZ+0.012*s))<0.012*s: xs.append(v.co.x); ys.append(v.co.y)
        cx=(max(xs)+min(xs))/2; cy=(max(ys)+min(ys))/2; rx=(max(xs)-min(xs))/2+0.008+(0.010 if not OLD else 0); ry=(max(ys)-min(ys))/2+0.008+(0.010 if not OLD else 0)      # later eras: room for the hair under the crown
        C0=Vector((cx,cy,BZ)); bm=bmesh.new()
        # brim: wide disc at brow level
        BR=G.get('brim',1.0)   # 1 is the wide 1690 brim; about 0.4 gives a short brim
        g=bmesh.ops.create_cone(bm,cap_ends=True,segments=32,radius1=1,radius2=1,depth=0.01,matrix=Matrix.Translation(C0))
        for v in g['verts']: d=v.co-C0; v.co.x=cx+d.x*(rx+0.085*s*BR); v.co.y=cy+d.y*(ry+0.075*s*BR)
        # crown: elliptical, from just under the brim up past the top of the head, tapering slightly
        H=(TOP-BZ)+0.06*s*(0.35+0.65*min(BR,1.0))   # a short-brimmed hat also has a lower crown
        g=bmesh.ops.create_cone(bm,cap_ends=True,segments=28,radius1=1,radius2=0.94 if not OLD else 0.9,depth=H+(0.010 if not OLD else 0),matrix=Matrix.Translation(C0+Vector((0,0,H/2-0.004))))
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
        BZ=TOP-0.085*s-G.get('hatdrop',0)*s; xs=[];ys=[]      # hatdrop (metres): the hat sits this much lower on the head. TOP is measured on a helper shape about 13 mm above the real skull, so a stiff cap rode high (owner, 16 November 2026: the Emperor's and the police caps)
        for v in h.data.vertices:
            if abs(v.co.z-(BZ+0.012*s))<0.012*s: xs.append(v.co.x); ys.append(v.co.y)
        cx=(max(xs)+min(xs))/2; cy=(max(ys)+min(ys))/2; rx=(max(xs)-min(xs))/2+0.010; ry=(max(ys)-min(ys))/2+0.010
        bm=bmesh.new(); zc=BZ+0.022*s; rv=(TOP-zc)+0.012*s
        band=bmesh.ops.create_cone(bm,cap_ends=False,segments=28,radius1=1,radius2=1,depth=0.026*s,matrix=Matrix.Translation((cx,cy,BZ+0.010*s)))
        for v in band['verts']: d=v.co-Vector((cx,cy,BZ+0.010*s)); v.co.x=cx+d.x*rx; v.co.y=cy+d.y*ry
        dome=bmesh.ops.create_uvsphere(bm,u_segments=28,v_segments=10,radius=1,matrix=Matrix.Translation((cx,cy-0.010*s,zc)))
        for v in dome['verts']: d=v.co-Vector((cx,cy-0.010*s,zc)); v.co=Vector((cx+d.x*rx*1.22,cy-0.010*s+d.y*ry*1.22,zc+d.z*rv))
        bmesh.ops.delete(bm,geom=[f for f in bm.faces if f.calc_center_median().z<zc-0.001 and all(v in dome['verts'] for v in f.verts)],context='FACES')
        # the underside of the dome, from its rim in to the top of the band: left open, a strip of forehead and hair showed between the cap and its band (owner, 16 November 2026)
        _n=28; _o=[bm.verts.new((cx+math.cos(2*math.pi*k/_n)*rx*1.22,cy-0.010*s+math.sin(2*math.pi*k/_n)*ry*1.22,zc)) for k in range(_n)]; _i=[bm.verts.new((cx+math.cos(2*math.pi*k/_n)*rx*0.99,cy+math.sin(2*math.pi*k/_n)*ry*0.99,BZ+0.022*s)) for k in range(_n)]
        for k in range(_n): bm.faces.new((_o[k],_o[(k+1)%_n],_i[(k+1)%_n],_i[k]))
        # the peak: a short stiff wedge with a top and an underside (a single sheet showed as a spike from the side), starting under the dome's front
        pk=[bm.verts.new((cx+dx*rx,cy-ry*dy,BZ+dz)) for dx,dy,dz in ((-0.72,0.90,0.020),(0.72,0.90,0.020),(0.56,1.50,-0.004),(-0.56,1.50,-0.004))]; pu=[bm.verts.new(v.co+Vector((0,0,-0.007*s))) for v in pk]
        bm.faces.new(pk); bm.faces.new(pu[::-1])
        for k in range(4): bm.faces.new((pk[k],pu[k],pu[(k+1)%4],pk[(k+1)%4]))
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
            _hd=G.get('hatdrop',0)*s; lathe(bm,[(0.001,0.0),(0.001,0.032*s),(0.026*s,CRH-0.006*s+_hd*0.3),(0.018*s,CRH+0.008*s+_hd*0.3),(-0.05*s,CRH+0.012*s+_hd*0.3)],fit,mod=lambda a,i,d,z:(d,z+(0.012*s*math.cos(a) if i>=2 else 0)))
            lathe(bb,[(0.003,0.004*s),(0.003,0.030*s)],fit,cap=False)
            cx,cy,rx,ry,BZ=fit; rows=[]
            for k in range(9):
                a=-0.95+1.9*k/8; w=math.cos(a/0.95*math.pi/2)**0.6; rows.append([bb.verts.new((cx+math.sin(a)*(rx+0.001),cy-math.cos(a)*(ry+0.001),BZ+0.006*s)),bb.verts.new((cx+math.sin(a)*(rx+0.058*s*w),cy-math.cos(a)*(ry+0.058*s*w),BZ-0.012*s*w))])
            quadstrip(bb,rows); bmesh.ops.create_uvsphere(bm,u_segments=8,v_segments=5,radius=0.014*s,matrix=Matrix.Translation((cx,cy-ry-0.008*s,BZ+0.048*s))@Matrix.Diagonal((1,0.3,1.2,1)))
        rigid(HM,bm,HM,'Head')
        if len(bb.verts): rigid(HM+'Band',bb,HM+'Band','Head')
        else: bb.free()
    if HK=='wrap':            # a head tie: cloth wound round the head and knotted, made from the scalp's own surface so it fits
        def wrap_edge(bm):      # the wrap's edge is drawn in onto the head, so it does not stand out from the temples and nape as fins, and its line is smoothed (owner, 17 November 2026)
            bm.normal_update(); rim={v for v in bm.verts if v.is_boundary}; r1={e.other_vert(v) for v in rim for e in v.link_edges}-rim; r2={e.other_vert(v) for v in r1 for e in v.link_edges}-rim-r1
            for vs,k in ((rim,0.013),(r1,0.008),(r2,0.004)):
                for v in vs: v.co-=v.normal*k
            smooth_edge(bm,10)
        Jy=J('Head').y
        o=piece(HM+'Wrap','body',lambda c:c.z>HEAD+(0.06-0.035*G.get('wrapbrow',0)*sstep(Jy+0.02,Jy+0.07,c.y)-(0.075 if G.get('bun') else 0.0)*sstep(Jy+0.03,Jy+0.09,c.y))*s,lambda c:0.016+0.006*math.sin(c.z*90+c.x*40),HM,cuts=[((0,Jy-0.05*G.get('wrapbrow',0),HEAD+(0.118-0.05*G.get('wrapbrow',0))*s),Vector((0,-0.25,-0.2)).normalized(),None)],sub=True,post=wrap_edge)      # (with a bun, the wrap comes down the back of the head over it, to the nape) wrapbrow (0 to 1): how far the front edge comes down toward the brow (1690 wraps covered the hair to the hairline; a 1950s head tie showed the front hair)
        md=o.modifiers.new('wt','DATA_TRANSFER'); md.object=h; md.use_vert_data=True; md.data_types_verts={'VGROUP_WEIGHTS'}; md.vert_mapping='POLYINTERP_NEAREST'; md.layers_vgroup_select_src='ALL'; md.layers_vgroup_select_dst='NAME'
        with ov(o): bpy.ops.object.modifier_apply(modifier='wt')
        clothes.append(o); bm=bmesh.new()
        if G.get('wrapbrow') and PART.get('hair'):      # under a wrap that comes down to the brow, the hair at the front and sides is hidden: removed, so no strands poke out by the ears (the nape keeps a little)
            _hb=bmesh.new(); _hb.from_mesh(PART['hair'].data); bmesh.ops.delete(_hb,geom=[f for f in _hb.faces if cz(f).z>HEAD+0.01*s],context='FACES'); bmesh.ops.delete(_hb,geom=[v for v in _hb.verts if not v.link_faces],context='VERTS'); _hb.to_mesh(PART['hair'].data); _hb.free()
        # the knot: one smooth, flattened knot of cloth lying on the front of the wrap, half sunk into it (three round balls, two of them standing out at the sides, read as ears)
        WT=tree_of(o); c0=Vector((0,Jy,TOP-0.05*s)); d=Vector((0,-0.72,0.69)).normalized(); hit=WT.ray_cast(c0+d*0.3,-d)[0]; p=hit if hit is not None else c0+d*0.1
        R=d.to_track_quat('Z','Y').to_matrix().to_4x4()
        bmesh.ops.create_uvsphere(bm,u_segments=16,v_segments=10,radius=0.025*s,matrix=Matrix.Translation(p+d*0.001)@R@Matrix.Diagonal((1.5,0.85,0.55,1)))
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
    # Under a hat the bun sits low on the back of the head, clear of the brim. It is half sunk into the skull, so it is part of the head and never floats behind the neck
    # (lowered further for a head wrap, it hung off the nape as a separate ball: owner, 17 November 2026). A head wrap is then shaped round it, so the wrap covers the bun.
    _lowbun=bool(HATS) and not OLD; zb=TOP-(0.135 if _lowbun else 0.07)*s; _br=(0.038 if _lowbun else 0.048)*s
    _sk=globals().get('SKIN') or tree; hit=_sk.ray_cast(Vector((0,0.6,zb)),Vector((0,-1,0)))[0]; yb=(hit.y if hit else 0.09)+_br*0.35
    bm=bmesh.new(); bmesh.ops.create_uvsphere(bm,u_segments=14,v_segments=9,radius=_br,matrix=Matrix.Translation((0,yb,zb))@Matrix.Diagonal((1.15,0.85,0.9,1)))
    rigid('Bun',bm,'Hair','Head')
def smooth_wrap():
    # A head wrap is one smooth shell of cloth over the whole top and back of the head, the hair and the bun (owner, 17 November 2026: the wrap cut from the scalp was
    # lumpy, the bun bulged out under it, hair poked out at the sides and the knot sat on top like a second bun). It is the convex hull of the skull, the hair and the bun
    # above the wrap's lower edge, made fine and relaxed, set 5 mm clear, with its edge drawn onto the head; the knot lies flat on the front.
    sk=globals().get('SKIN') or tree; Jy=J('Head').y
    for w in [o for o in bpy.data.objects if o.type=='MESH' and o.name.endswith('Wrap') and o.data.materials]:
        HMn=w.name[:-4]; edge=lambda c:HEAD+(0.125-0.022*G.get('wrapbrow',0)-(0.105-0.022*G.get('wrapbrow',0))*sstep(Jy-0.03,Jy+0.07,c.y))*s      # wrapbrow brings the front edge down to the brow      # the edge: across the forehead at the hairline, down behind the ears to the nape
        pts=[]
        for o in [h]+[x for x in bpy.data.objects if x.type=='MESH' and x.data.materials and x.data.materials[0].name=='Hair']:
            mw=o.matrix_world
            for v in o.data.vertices:
                c=mw@v.co
                if o is h and not (abs(c.x)<0.12 and c.z>HEAD-0.05*s): continue
                if c.z>edge(c)-0.006: pts.append(c)
        if len(pts)<50: continue
        b=bmesh.new()
        for c in pts: b.verts.new(c)
        bmesh.ops.convex_hull(b,input=b.verts[:]); bmesh.ops.delete(b,geom=[v for v in b.verts if not v.link_faces],context='VERTS')
        bmesh.ops.delete(b,geom=[f for f in b.faces if all(v.co.z<edge(v.co)+0.002 for v in f.verts)],context='FACES')
        for _ in range(3): bmesh.ops.subdivide_edges(b,edges=b.edges[:],cuts=1,use_grid_fill=True,smooth=0.0)
        for _ in range(6): bmesh.ops.smooth_vert(b,verts=[v for v in b.verts if not v.is_boundary],factor=0.5,use_axis_x=True,use_axis_y=True,use_axis_z=True)
        bmesh.ops.delete(b,geom=[f for f in b.faces if cz(f).z<edge(cz(f))],context='FACES'); bmesh.ops.delete(b,geom=[v for v in b.verts if not v.link_faces],context='VERTS')
        smooth_edge(b,12); b.normal_update()
        for v in b.verts:      # 5 mm clear of skin and hair everywhere, a soft fold or two in the cloth, and the edge drawn onto the head
            v.co+=v.normal*(0.005+0.0010*math.sin(v.co.z*140+v.co.x*60)*sstep(edge(v.co),edge(v.co)+0.03,v.co.z))
            if v.is_boundary:
                loc,nrm,_i,_d=sk.find_nearest(v.co)
                if loc is not None: v.co=loc+nrm*0.004
        bmesh.ops.recalc_face_normals(b,faces=b.faces[:]); me=w.data; b.to_mesh(me); b.free()
        for g in list(w.vertex_groups): w.vertex_groups.remove(g)
        for g in h.vertex_groups: w.vertex_groups.new(name=g.name)
        w.vertex_groups['mixamorig:Head'].add(list(range(len(me.vertices))),1.0,'REPLACE')      # all of it moves with the head
        k=bpy.data.objects.get(HMn+'Knot')
        if k:      # the knot: a flat twist on the front of the wrap, sunk into it, not a ball on top
            WT=tree_of(w); c0=Vector((0,Jy,TOP-0.07*s)); d=Vector((0,-0.80,0.60)).normalized(); hit=WT.ray_cast(c0,d,0.4)[0]      # from inside the head out to the wrap, so it always lands on it
            if hit is None: bpy.data.objects.remove(k,do_unlink=True); continue
            p=hit; bk=bmesh.new(); R=d.to_track_quat('Z','Y').to_matrix().to_4x4(); bmesh.ops.create_uvsphere(bk,u_segments=16,v_segments=10,radius=0.022*s,matrix=Matrix.Translation(p-d*0.002)@R@Matrix.Diagonal((1.7,0.7,0.38,1)))
            bk.to_mesh(k.data); bk.free(); kg=k.vertex_groups.get('mixamorig:Head') or k.vertex_groups.new(name='mixamorig:Head'); kg.add(list(range(len(k.data.vertices))),1.0,'REPLACE')      # new points need their weight again, or they are left behind when the head moves
    print('SMOOTH WRAP')      # (painted with every other piece further on)
if any(k=='wrap' for k,_m in HATS) and G.get('wrapstyle','smooth')=='smooth': smooth_wrap()
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
        a=2*math.pi*k/seg; f=0.5+0.5*math.cos(a); b0=collar_pt(a,NECK-0.004,NECK-0.004-0.008*s,0.013); col=[]
        for dz in (0.085,0.045):
            zz=b0.z-dz*s*(0.25+0.75*f)*sstep(0.80,0.55,abs(math.atan2(math.sin(a),math.cos(a)))); rr=rad_out(zz,a)+0.004;      # the yoke fills the coat's low front only: round the sides and back the coat's own neck facing covers the join
            col.append(Vector((math.sin(a)*rr,NJ.y-math.cos(a)*rr,zz)))
        col+=[b0,collar_pt(a,NECK-0.004+hs*0.5,NECK-0.012*s+hs*0.5,0.010+0.0012*math.sin(a*3+0.5)),collar_pt(a,NECK-0.004+hs,NECK-0.012*s+hs,0.006),collar_pt(a,NECK-0.004+hs-0.005,NECK-0.012*s+hs-0.005,0.0015)]      # (3 to 4 mm closer to the neck: further out it touched the coat's neck when walking)
        cols.append([bm.verts.new(q) for q in col])
    rings=[list(r) for r in zip(*cols)]; quadstrip(bm,rings[2:],close=True); by=bmesh.new(); quadstrip(by,[[by.verts.new(v.co) for v in r] for r in rings[:3]],close=True)
    for v in rings[0]+rings[1]: bm.verts.remove(v)
    _cb=soft('Collar',bm,'Bands',only=('Spine2','Neck','LeftShoulder','RightShoulder')); ring_weights(_cb,seg,len(rings)-2); soft('CollarYoke',by,'Bands',only=TORSO+('LeftArm','RightArm'))      # (the band's weights evened round the neck, as later collars: point by point it tore into teeth when he walked)      # the yoke lies on the skin under the coat, so it moves as the skin does (shoulders and upper arms too) and stays under the coat when the shoulders lift
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
    soft('ScarfEnds',bm,'Bands',only=('Spine2','Spine1','Spine'))
if G.get('coat') and OLD and G.get('coatsleeves',True):      # the coat's neck edge: a narrow facing in the coat's own cloth that lies over the top of the coat round the sides and back of the neck.
    # The coat is cut from a helper mesh that stops short of the neck, so when the shoulders lift a gap opened there and skin showed; the facing bridges it and moves as the skin does
    bm=bmesh.new(); seg=24; cols=[]; a0=0.62
    for k in range(seg+1):
        a=a0+(2*math.pi-2*a0)*k/seg; e=min(1.0,min(k,seg-k)/2.0); b0=collar_pt(a,NECK-0.004,NECK-0.004-0.008*s,0.016); col=[collar_pt(a,NECK-0.004+0.011*s*e,NECK-0.004-0.008*s+0.011*s*e,0.0205),collar_pt(a,NECK-0.004,NECK-0.004-0.008*s,0.0235)]
        for dz in (0.028,0.062):
            zz=b0.z-dz*s*(0.4+0.6*e); rr=rad_out(zz,a)+0.0265; col.append(Vector((math.sin(a)*rr,NJ.y-math.cos(a)*rr,zz)))
        cols.append([bm.verts.new(q) for q in col])
    quadstrip(bm,[list(r) for r in zip(*cols)]); _cn=soft('CoatNeck',bm,'Coat',only=TORSO+('LeftArm','RightArm')); ring_weights(_cn,seg+1,len(cols[0]))      # evened round the neck too (dark flaps stood up from it when walking)
if G.get('coat') and G.get('coatbuttons',OLD):      # a row of buttons down the coat's front, from the neck to the waist
    CT=tree_of(PART['coat']); bm=bmesh.new(); z1=NECK-0.085*s; z0=HIP+0.075; nb=max(4,int((z1-z0)/(0.052*s)))
    for i in range(nb+1):
        z=z1+(z0-z1)*i/nb; hit=CT.ray_cast(Vector((0.010*s,-1,z)),Vector((0,1,0)))[0]
        if hit: bmesh.ops.create_circle(bm,cap_ends=True,segments=6,radius=0.0075*s,matrix=Matrix.Translation((0.010*s,hit.y-0.004,z))@Matrix.Rotation(math.pi/2,4,'X'))
    COL.setdefault('CoatButtons',COL['Coat']*0.5); soft('CoatButtons',bm,'CoatButtons')
if G.get('apron'):
    # An apron, made again from scratch (owner, 21 November 2026: "check the placements of aprons ... not have the underlying textures show through ... show a string around the
    # waist ... ensure it places against the body believably"). The old one was a flat card hung in front of the legs: it stood off the body like a board, the shirt showed in
    # specks along its top edge, and nothing held it on. This one is cloth worked out round the body's own middle line:
    #  - the panel wraps the front of the body from hip to hip. At each height and angle it lies on the outermost thing beneath it (trousers, skirt, shirt, waistcoat, coat),
    #    7 mm clear, and below the fullest part of the hips and thighs it hangs: it never tucks in under a row above, so it falls straight past the fork and between the legs;
    #  - a waistband goes right round the waist over the panel's top edge (so nothing shows above the panel), and is tied at the back in a small knot with two hanging ends;
    #  - all of it is one piece, material Apron, so a game that hides or colours the apron takes the string with it. It rides on the thighs as before, so a knee lifts it.
    _hy=J('Hips').y; _under=[(k,tree_of(PART[k])) for k in ('breeches','skirt','shirt','waistcoat','coat','coatskirt','jacket','jacketskirt') if PART.get(k)] or [('body',tree)]
    def _out(a,z,cap=0.6):      # how far the outermost cloth is from the body's middle line at height z, in direction a (0 is the front), or 0 if nothing is there
        d=Vector((math.sin(a),-math.cos(a),0)); o=Vector((0,_hy,z)); best=0.0
        for k_,t_ in _under:
            if k_ in ('shirt','waistcoat','jacket') and z<HIP+0.03: continue      # below the hips only what hangs there counts (a sleeve or a hand beside the thigh is not the apron's to lie on)
            hit=t_.ray_cast(o+d*cap,-d,cap)[0]
            if hit is not None: best=max(best,(hit-o).length)
        return best
    wide='skirt' in PART or OLD; ZA=HIP+(0.132 if 'skirt' in PART else 0.124)      # the band sits on the top edge of the trousers or skirt, over the join with the shirt (and over a bodice's bottom edge)
    ZE=(SKB+0.10) if 'skirt' in PART else KNEE+0.02; AH=1.30 if wide else 1.12      # the top, the hem, and how far round each side it reaches (radians from the front)
    def apron_from(src,name):
        # Over a skirt the apron is cut from the skirt itself: the skirt's own front, from the band to a hand above the hem and from hip to hip, lifted 12 mm off it, with
        # the skirt's own bone weights. It moves exactly as the skirt moves, so the skirt can never come through it in a stride or on a seat. (Hung from the hips and
        # thighs like a man's apron, it was left behind by a full skirt's swing and the skirt showed through it in patches.)
        o=src.copy(); o.data=src.data.copy(); o.name=name; bpy.context.scene.collection.objects.link(o); b=bmesh.new(); b.from_mesh(o.data)
        def cut(co,no):
            bmesh.ops.bisect_plane(b,geom=b.verts[:]+b.edges[:]+b.faces[:],plane_co=Vector(co),plane_no=Vector(no).normalized(),clear_outer=True,dist=1e-5)
        cut((0,_hy+0.01,0),(0,1,0)); cut((0,_hy,0),(math.cos(AH),math.sin(AH),0)); cut((0,_hy,0),(-math.cos(AH),math.sin(AH),0)); cut((0,0,ZA-0.004),(0,0,1)); cut((0,0,ZE),(0,0,-1))
        b.normal_update()
        for v in b.verts:
            rad=Vector((v.co.x,v.co.y-_hy,0)); n=v.normal if v.normal.dot(rad)>=0 else -v.normal; v.co+=Vector((n.x,n.y,0)).normalized()*0.012 if Vector((n.x,n.y,0)).length>1e-6 else Vector((0,-0.012,0))
        b.to_mesh(o.data); b.free(); o.data.materials.clear(); o.data.materials.append(colmat('Apron'))
        if 'Col' in o.data.color_attributes: o.data.color_attributes.remove(o.data.color_attributes['Col'])
        clothes.append(o); return o
    bm=bmesh.new(); pt=lambda a,z,r:(math.sin(a)*r,_hy-math.cos(a)*r,z)
    if 'skirt' in PART: ap=apron_from(PART['skirt'],'Apron'); APRON_SEAT=True
    else:
        nu,nv=24,28; A=[-AH+2*AH*i/nu for i in range(nu+1)]; Z=[ZA-(ZA-ZE)*j/nv for j in range(nv+1)]
        _da=AH/nu/2.5; R=[[max(_out(a+q*_da,z) for q in (-2,-1,0,1,2)) for a in A] for z in Z]      # the fullest of what lies under each point and beside it (a skirt's folds are narrower than the apron's own points)
        for j in range(1,nv+1):      # it hangs: never further in than the row above (less a slight taper), so it bridges the fork and the gap between the legs
            for i in range(nu+1): R[j][i]=max(R[j][i],R[j-1][i]-0.06*(Z[j-1]-Z[j]))
        for i in range(nu+1):
            if R[0][i]<=0: R[0][i]=max(R[0]) or 0.14
        raw=[row[:] for row in R]
        for _ in range(3): R=[[max(raw[j][i],(R[j][max(0,i-1)]+2*R[j][i]+R[j][min(nu,i+1)]+R[max(0,j-1)][i]+R[min(nv,j+1)][i])/6) for i in range(nu+1)] for j in range(nv+1)]      # evened out, never inside what it lies on
        rows=[[bm.verts.new(pt(A[i],Z[j],R[j][i]+0.007+(0.020 if 'skirt' in PART else 0.014)*min(1.0,j/9))) for i in range(nu+1)] for j in range(nv+1)]      # held close at the band, hanging 2 to 3 cm clear below it, so a thigh that swings forward in a stride stays behind it
        for j in range(nv):
            for i in range(nu): bm.faces.new((rows[j][i],rows[j][i+1],rows[j+1][i+1],rows[j+1][i]))
    # the waistband and its ends
    NB=56; AB=[2*math.pi*k/NB for k in range(NB)]; RB=[_out(a,ZA-0.004) or 0.14 for a in AB]
    for _ in range(4): RB=[max(RB[k],(RB[k-1]+2*RB[k]+RB[(k+1)%NB])/4) for k in range(NB)]
    hh=0.009; ring=[]
    for k,a in enumerate(AB):
        r=RB[k]+0.011      # over the panel's top edge
        ring.append([bm.verts.new(pt(a,ZA-0.004+dz,r+dr)) for dz,dr in ((hh,0.0),(0.0,0.0025),(-hh,0.0),(-hh,-0.0045),(hh,-0.0045))])
    for k in range(NB):
        for m in range(5): bm.faces.new((ring[k][m],ring[(k+1)%NB][m],ring[(k+1)%NB][(m+1)%5],ring[k][(m+1)%5]))
    rk=RB[NB//2]+0.011; kc=Vector(pt(math.pi,ZA-0.004,rk+0.006))      # the knot, in the middle of the back
    bmesh.ops.create_uvsphere(bm,u_segments=8,v_segments=5,radius=1.0,matrix=Matrix.Translation(kc)@Matrix.Diagonal((0.013,0.007,0.010,1)))
    for sx in (1,-1):      # two ends hang from it, a little apart, lying on the cloth
        prev=None
        for q in range(7):
            f=q/6; a=math.pi+sx*(0.03+0.10*f); z=ZA-0.010-0.105*f; r=max(_out(a,z),_out(a,z+0.02)*0.0)+0.0075+0.004*(1-f); w=0.007
            c=Vector(pt(a,z,r)); tng=Vector((math.cos(a),math.sin(a),0)); pair=(bm.verts.new(c-tng*w),bm.verts.new(c+tng*w))
            if prev: bm.faces.new((prev[0],prev[1],pair[1],pair[0]))
            prev=pair
    if 'skirt' in PART:      # over a skirt the band is its own piece (ApronBand, material Apron), on the hips
        _bd=rigid('ApronBand',bm,'Apron','Hips')
        for p_ in _bd.data.polygons: p_.use_smooth=True
    else:
        ap=rigid('Apron',bm,'Apron','Hips')
        for p_ in ap.data.polygons: p_.use_smooth=True
        B={n:ap.vertex_groups['mixamorig:'+n] for n in ('Hips','LeftUpLeg','RightUpLeg','LeftLeg','RightLeg')}; B['Hips'].remove(list(range(len(ap.data.vertices))))
        for v in ap.data.vertices:      # it rides on the thighs like the front of a coat's skirt, so a knee lifts it instead of coming through it; the band stays on the hips
            z=v.co.z; band=z>ZA-0.022 or v.co.y>_hy+0.02      # the band, its knot and ends stay on the hips
            t=max(0.0,min(1.0,(HIP+0.06-z)/0.5)); leg=0.0 if band else sstep(HIP+0.03,HIP-0.09,z); left=sstep(-0.4,0.4,v.co.x/0.15); shin=sstep(KNEE+0.04,KNEE-0.08,z)      # from the band down to the hip joint it stays on the hips, so seated it lies against the belly and then turns over the lap; below that each side follows its own thigh (shared across the whole width, the forward thigh came through it in a stride); below the knee it follows the shin, so seated it falls from the knees
            for n,val in (('Hips',1-leg),('LeftUpLeg',leg*left*(1-shin)),('RightUpLeg',leg*(1-left)*(1-shin)),('LeftLeg',leg*left*shin),('RightLeg',leg*(1-left)*shin)):
                if val>0.001: B[n].add([v.index],val,'REPLACE')
bh.free()
if G.get('skirt') and not OLD and G.get('seatskirt',True):      # a second skirt for sitting and kneeling (material Skirt, object SkirtSeat). One skirt cannot both flare when standing and lie over a lap:
    # weighted to the legs, the flare swung through wide arcs and tore. This one is cut close round both thighs as one piece (the outline of the two legs together, so it bridges
    # the gap between them), follows the thighs to the knee and the shins below it, so seated it lies over the lap and falls straight from the knees. The game shows it only
    # while a seated or kneeling clip plays, and hides the standing skirt then (engine/anim.js, seatSkirt)
    if PART.get('shirt') and (G.get('belt') or G.get('waistcoat')):      # the blouse's tail below the waist (only under a belt or sash, which covers the cut edge) is always under one skirt or the other: cut it off, or seated it came through the back of the seated skirt
        _o=PART['shirt']; _b=bmesh.new(); _b.from_mesh(_o.data); _zc=HIP+(0.10 if G.get('sash') else 0.085)      # one straight cut, then the edge is evened out: deleting whole faces left it in teeth
        _tor=[f for f in _b.faces if side_arm(cz(f)) is None]; _g=list(dict.fromkeys(v for f in _tor for v in f.verts))+list(dict.fromkeys(e for f in _tor for e in f.edges))+_tor
        bmesh.ops.bisect_plane(_b,geom=_g,plane_co=(0,0,_zc),plane_no=(0,0,1),clear_inner=True); bmesh.ops.delete(_b,geom=[v for v in _b.verts if not v.link_faces],context='VERTS')
        _rim=[v for v in _b.verts if v.is_boundary and abs(v.co.z-_zc)<0.002]
        for v in _rim: v.co.z=_zc
        _b.to_mesh(_o.data); _b.free()
    if PART.get('shirt'):      # the blouse's tail tucked into the skirt follows the hips only: with the skin's leg weights it swung out with the thighs and came through the seated skirt
        _so=PART['shirt']; _hg=_so.vertex_groups.get('mixamorig:Hips') or _so.vertex_groups.new(name='mixamorig:Hips')
        for v in _so.data.vertices:
            t=sstep(HIP+0.07,HIP+0.02,v.co.z)
            if t<=0 or side_arm(v.co) is not None: continue
            ws={g.group:g.weight for g in v.groups if _so.vertex_groups[g.group].name.startswith('mixamorig:')}
            for gi_,w in ws.items(): _so.vertex_groups[gi_].add([v.index],w*(1-t),'REPLACE')
            _hg.add([v.index],ws.get(_hg.index,0)*(1-t)+t,'REPLACE')
    ST=tree_of(PART['skirt']); SN=48; srows=[]; zs=[]; z=HIP+(0.085 if G.get('belt') else 0.10)      # with no belt over the join, the seated skirt's top is the waistline people see: as high as the standing skirt's
    while z>SKB: zs.append(z); z-=0.012
    zs.append(SKB)
    def _legpts(z):
        pts=[]
        for sx in (1,-1):
            ax=leg_axis(z,sx); o=Vector((ax.x,ax.y,z))
            for k in range(36):
                a=2*math.pi*k/36; d=Vector((math.sin(a),-math.cos(a),0)); hit=SKIN.ray_cast(o,d,0.14)[0]; pts.append((o+d*((hit-o).length if hit else 0.07)).to_2d())
        return pts
    for z in zs:
        if z>CROTCH+0.02: pts=[(Vector((0,YCz(z)))+Vector((math.sin(a),-math.cos(a)))*env(z,a)[0]) for a in (2*math.pi*k/72 for k in range(72))]
        else: pts=_legpts(z)
        hull=[pts[i] for i in mathutils.geometry.convex_hull_2d(pts)]
        c=sum(hull,Vector((0,0)))/len(hull); ring=[]
        for k in range(SN):
            a=2*math.pi*k/SN; d=Vector((math.sin(a),-math.cos(a))); best=0.0
            for i in range(len(hull)):      # where the ray from the middle leaves the outline
                p0,p1=hull[i],hull[(i+1)%len(hull)]; e=p1-p0; den=d.x*e.y-d.y*e.x
                if abs(den)<1e-9: continue
                w=p0-c; tt=(w.x*e.y-w.y*e.x)/den; uu=(w.x*d.y-w.y*d.x)/den
                if tt>0 and -1e-6<=uu<=1+1e-6: best=max(best,tt)
            off=0.012+0.006*sstep(CROTCH,SKB,z)
            if z<CROTCH: off=off-(off-0.004)*sstep(-0.3,-0.8,d.y)      # close over the tops of the thighs (4 mm), where seated hands rest: further out, the hands sank into the cloth
            r=best+off
            if z>HIP+0.02:      # at the top it meets the standing skirt, so the belt or sash over the join lies flush in either skirt
                hit=ST.ray_cast(Vector((c.x,c.y,z)),Vector((d.x,d.y,0)),0.4)[0]
                if hit is not None: r=r+(min((hit.to_2d()-c).length+(0.0 if G.get('belt') else 0.002),best+0.02)-r)*sstep(HIP+0.02,HIP+0.06,z)      # never more than 2 cm off the body: at the sides a ray found the flare and the top stood out in wings
            if z>HIP+0.02 and not G.get('belt'):      # no belt: a smooth ring that clears the blouse (copying the standing skirt brought its pleat waves, which read as a ragged top)
                h2=SHT.ray_cast(Vector((c.x,c.y,z)),Vector((d.x,d.y,0)),0.4)[0]; w=sstep(HIP+0.02,HIP+0.06,z)
                r=r*(1-w)+max(best+0.012,((h2.to_2d()-c).length+0.004) if h2 is not None else best+0.012)*w
            q=c+d*r; ring.append((q.x,q.y,z))
        if z>HIP+0.02 and not G.get('belt'):
            for _ in range(3):
                rr=[math.hypot(p_[0]-c.x,p_[1]-c.y) for p_ in ring]; rr=[max(rr[k],(rr[k-1]+2*rr[k]+rr[(k+1)%SN])/4) for k in range(SN)]
                ring=[(c.x+math.sin(2*math.pi*k/SN)*rr[k],c.y-math.cos(2*math.pi*k/SN)*rr[k],z) for k in range(SN)]
        srows.append(ring)
    bm_s=bmesh.new(); vr=[[bm_s.verts.new(p) for p in r] for r in srows]; quadstrip(bm_s,vr,close=True)
    ss=rigid('SkirtSeat',bm_s,'Skirt','Hips')
    B={n:ss.vertex_groups['mixamorig:'+n] for n in ('Hips','LeftUpLeg','RightUpLeg','LeftLeg','RightLeg')}; B['Hips'].remove(list(range(len(ss.data.vertices))))
    for v in ss.data.vertices:
        x,y,z=v.co; wb=sstep(-0.03,0.06,y); legw=((1-sstep(CROTCH-0.06,HIP-0.01,z))*(1-wb)+(1-sstep(CROTCH-0.12,CROTCH,z))*wb)*(1-sstep(HIP-0.03,HIP+0.01,z));      # the top band stays on the hips all round, like the belt over it: with any thigh weight it lifted away from the body into a rim when she sat
             # the back stays with the hips down to the seat: seated, it no longer sinks in and shows the blouse
        sh=sstep(KNEE+0.035,KNEE-0.035,z); left=sstep(-1.0,1.0,x/0.09)
        for n,val in (('Hips',1-legw),('LeftUpLeg',legw*left*(1-sh)),('RightUpLeg',legw*(1-left)*(1-sh)),('LeftLeg',legw*left*sh),('RightLeg',legw*(1-left)*sh)):
            if val>0.001: B[n].add([v.index],val,'REPLACE')
    if PART.get('shirt'):      # the top band takes the blouse's own weights, like the belt over it, so belt, blouse and skirt top bend as one when she sits (on the hips alone, the top rode up over the belt in front)
        from mathutils.kdtree import KDTree
        _so=PART['shirt']; _kd=KDTree(len(_so.data.vertices))
        for _v in _so.data.vertices: _kd.insert(_v.co,_v.index)
        _kd.balance(); _bn={g.index:g.name for g in _so.vertex_groups}
        for v in ss.data.vertices:
            tb=sstep(HIP-0.08,HIP+0.01,v.co.z)
            if tb<=0: continue
            _co,_i,_d=_kd.find(v.co); sw={_bn[g.group]:g.weight for g in _so.data.vertices[_i].groups if _bn[g.group].startswith('mixamorig:') and g.weight>0}; t=sum(sw.values()) or 1
            old={ss.vertex_groups[g.group].name:g.weight for g in v.groups}
            for g in list(v.groups): ss.vertex_groups[g.group].remove([v.index])
            mix={k:old.get(k,0)*(1-tb)+sw.get(k,0)/t*tb for k in set(old)|set(sw)}
            for k,w in mix.items():
                if w>0.001: (ss.vertex_groups.get(k) or ss.vertex_groups.new(name=k)).add([v.index],w,'REPLACE')
if globals().get('APRON_SEAT') and 'ss' in globals(): apron_from(ss,'ApronSeat')      # the apron for sitting and kneeling, cut from the seated skirt: the engine shows it with that skirt (engine/anim.js seatSkirt)
if G.get('jacket'):      # under a jacket only the shirt's front, collar zone and cuffs can be seen: cut the rest away, so nothing can poke through the jacket and the body is lighter
    o=PART['shirt']; bm=bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.delete(bm,geom=[f for f in bm.faces if not jacket_seen(cz(f))],context='FACES'); bm.to_mesh(o.data); bm.free()
    if PART.get('waistcoat'):      # and of the waistcoat only its front shows, through the jacket's opening: the sides and the back are cut away, so they cannot come through the jacket
        o=PART['waistcoat']; bm=bmesh.new(); bm.from_mesh(o.data); bmesh.ops.delete(bm,geom=[f for f in bm.faces if not jacket_waistcoat_seen(cz(f))],context='FACES'); bm.to_mesh(o.data); bm.free()      # only the wedge in the jacket's V and a narrow margin round it: elsewhere a light copy's simplified jacket let it through
if G.get('coat') and OLD:      # under a coat only the shirt's cuffs can be seen (all of each sleeve, when the coat has none): cut the rest away
    o=PART['shirt']; bm=bmesh.new(); bm.from_mesh(o.data); _sl=G.get('coatsleeves',True); _cs=G.get('coatsleeve',0.82)
    def seen(c):
        if not _sl: return side_arm(c) is not None or abs(c.x)>SX*0.80 or c.z>NECK-0.07*s      # the whole sleeve stays (cut back to the coat's armhole, the back of each sleeve had holes in it: owner, 17 November 2026)      # (only the sleeves past the coat's armhole, and the neck: the shirt's shoulders under the coat came through it in patches, 17 November 2026)      # (and the neck opening) a coat with no sleeves: the shirt's shoulders and sleeves show (from SX*0.55 in, bits of the shirt's chest were kept and showed through the coat as two white slivers)
        t=side_arm(c); return t is not None and t>_cs-0.14
    bmesh.ops.delete(bm,geom=[f for f in bm.faces if not seen(cz(f))],context='FACES'); bm.to_mesh(o.data); bm.free()
    if not _sl:      # a sleeve that folds over itself: any face of it lying under another face of the same sleeve (seen from the arm's line outward) is an inner fold, and is removed (it drew as dark speckled patches on the back of the arm)
        bm=bmesh.new(); bm.from_mesh(o.data); bm.normal_update(); _bt=BVHTree.FromBMesh(bm); _in=[]
        for f in bm.faces:
            c=cz(f)
            if side_arm(c) is None: continue
            ax=arm_axis(c)[0]; d=c-ax
            if d.length<1e-5: continue
            d.normalize(); hit,_n,_i,_dd=_bt.ray_cast(c+d*0.0015,d,0.04)
            if hit is not None and _i!=f.index: _in.append(f)
        bmesh.ops.delete(bm,geom=_in,context='FACES'); bmesh.ops.delete(bm,geom=[v for v in bm.verts if not v.link_faces],context='VERTS'); print('SLEEVE FOLDS REMOVED',len(_in))
        bm.to_mesh(o.data); bm.free(); o.data.update()
    if not _sl:      # the shirt's sleeves are seen whole under a sleeveless coat: cut from the coarse helper body, their big faces showed as dark flat patches (owner, 17 November 2026). They are made finer and relaxed
        bm=bmesh.new(); bm.from_mesh(o.data); bmesh.ops.remove_doubles(bm,verts=bm.verts[:],dist=0.0015)
        for _ in range(2): bmesh.ops.subdivide_edges(bm,edges=bm.edges[:],cuts=1,use_grid_fill=True,smooth=1.0)
        bmesh.ops.smooth_vert(bm,verts=[v for v in bm.verts if not v.is_boundary],factor=0.4,use_axis_x=True,use_axis_y=True,use_axis_z=True)
        smooth_edge(bm,14)      # and its cut edges (seen through the coat's open sides) run clean, not in steps
        bm.to_mesh(o.data); bm.free(); o.data.update()
# body: remove what the clothes fully hide, so nothing pokes through
bm=bmesh.new(); bm.from_mesh(h.data); dl=bm.verts.layers.deform.verify(); gi=GI['body']
cov_arm=max(sleeve, G.get('coatsleeve',0) if G.get('coat') and G.get('coatsleeves',True) else 0, G.get('jacketsleeve',0.9) if G.get('jacket') else 0)
def hidden(c):
    if CK=='camp' and c.y<0 and c.z>VZ-0.03*s+VK*0.55*abs(c.x): return False      # the neck and a little chest show inside the V of a camp collar
    if NW_SEAMLESS and HIP+0.05<c.z<SEAM_Z(nw_ang(c))-0.010 and abs(c.x)<SX*0.8: return True      # a collar sewn to the shirt (neckwear.py): the skin goes up to 1 cm under the seam, wherever the seam runs
    if NW_SEAMLESS and CK!='camp' and (abs(c.x)<SX*0.8 or (abs(c.x)<SX*1.05 and c.z>SH.z+0.01)) and HIP+0.05<c.z<SEAM_Z(nw_ang(c))+0.03 and math.hypot(c.x,c.y-nw_cy(c.z))>SEAM_R(nw_ang(c))+0.007: return True      # and the slope of the shoulder outside the seam, which on a woman or a child rises above the seam's own height: left in, it showed through the cloth as a patch on top of the shoulder (out to the shoulder joint: between 0.8 of the way there and the arm's own rule a strip was covered by neither)
    if not NW_SEAMLESS and HIP+0.05<c.z<NECK-(0.008 if CK=='round' else 0.022 if (CK and CK not in ('open','camp')) or G.get('bands') else 0.07)*s and abs(c.x)<SX*0.8: return True   # with a collar, its yoke covers the skin right up to the collar's seam
    t=side_arm(c)
    if t is not None and 0.08<t<cov_arm-0.06 and abs(c.x)>SX*0.75: return True
    if OLD and G.get('breeches') and KNEE<c.z<HIP+0.05 and abs(c.x)<0.12: return True      # the cleft of the seat, between the two legs of the breeches: left bare, skin showed in flecks there
    if OLD and abs(c.x)>SX*0.75 and HIP+0.05<c.z<NECK-0.03*s and arm_axis(c)[1]<cov_arm-0.09: return True      # the armpit, the side of the chest and the shoulder under a shirt or coat: left in, the skin showed through at the back of the armpit when the arm swung
    if G.get('breeches') and ((KNEE+0.08*s-G.get('shortslen',0)*s if G.get('shorts') else ANK+0.03) if G.get('trousers') else (KNEE-0.05*s+0.012 if OLD else KNEE))<c.z<HIP+0.05 and math.hypot(c.x-leg_axis(c.z,1 if c.x>0 else -1).x,c.y-LHIP.y)<0.16*s: return True
    if G.get('skirt') and SKB+(0.10 if OLD else 0.035)<c.z<HIP+0.05 and side_arm(c) is None and abs(c.x)<0.30: return True      # (the legs only: with the arms held out, the fingers hang at this height and were cut off as 'leg under the skirt') later eras keep only 3.5 cm of leg above the hem (seated, a taller band lay under the lap and came through the seated skirt)
    if G.get('shoes') and c.z<(ANK*0.5 if LOWCUT else ANK+0.02): return True
    return False
def lining_of(c):      # which garment covers this hidden piece of the body
    if c.z>NECK-0.07*s or (G.get('shoes') and c.z<ANK+0.02): return None
    if G.get('breeches') and c.z<HIP+0.15: return 'Breeches' if c.z<(HIP+0.06 if EASE_OLD else HIP+0.12) and not G.get('coathem') else None      # (a tucked shirt fills the breeches above HIP+0.06: no lining there, it only crossed the shirt)      # no lining right at the waistband, where shirt and breeches overlap; none under a coat's skirt either (seated, it came through the skirt where the breeches already lie)
    if EASE_OLD or (G.get('coat') and not G.get('coatsleeves',True)): return None      # (and the shirt sleeves under a sleeveless coat) a shirt with ease stands clear of the body and no longer folds in at the chest, so it needs no lining (left in, the lining came through it at the front when walking)
    if G.get('coat') and G.get('coatsleeves',True): return 'Coat'
    return 'Shirt'
if OLD:
    # The hidden body is not thrown away: it stays as a lining in the colour of the cloth that covers it. Loose cloth creases when an arm drops or a knee bends,
    # and with nothing behind it a crease opened as a dark hole (or, with the skin left in, as a patch of skin). Now whatever shows in a crease is the same cloth
    lo=h.copy(); lo.data=h.data.copy(); lo.name='Lining'; bpy.context.scene.collection.objects.link(lo); lb=bmesh.new(); lb.from_mesh(lo.data); ld=lb.verts.layers.deform.verify(); kinds=[]
    for f in list(lb.faces):
        c=cz(f); m=lining_of(c) if all(v[ld].get(gi,0)>0 for v in f.verts) and hidden(c) else None
        if m is None: lb.faces.remove(f)
        else:
            if m not in kinds: kinds.append(m)
            f.material_index=kinds.index(m)
    bmesh.ops.delete(lb,geom=[v for v in lb.verts if not v.link_faces],context='VERTS'); lb.normal_update()
    for v in lb.verts: v.co-=v.normal*0.008      # (4 mm in, it came through the breeches when seated)
    _mi=[f.material_index for f in lb.faces]; lb.to_mesh(lo.data); lb.free(); lo.data.materials.clear()
    for m in kinds: lo.data.materials.append(colmat(m))
    for p,k in zip(lo.data.polygons,_mi): p.material_index=k      # set again: clearing the material slots resets every face to the first one (Blender 5), which put the shirt's colour inside the breeches
    if kinds:      # nobody sees its shape, so it is thinned to about a third of its triangles
        md=lo.modifiers.new('thin','DECIMATE'); md.ratio=0.34
        with ov(lo): bpy.ops.object.modifier_move_to_index(modifier='thin',index=0); bpy.ops.object.modifier_apply(modifier='thin')
    if kinds: clothes.append(lo)
    else: bpy.data.objects.remove(lo)
_covs=[]
if not OLD:
    # Later eras: skin that lies under a garment no game ever hides (shirt, trousers, skirt, jacket) is removed wherever it is well inside that garment's edges.
    # What is not there cannot show through, in any pose. Skin near an opening (a cuff, a neckline, a hem) stays, because the eye can see a little way in.
    from mathutils.kdtree import KDTree
    for _k in ('shirt','breeches','skirt','jacket','jacketskirt'):
        _o=PART.get(_k)
        if not _o or not len(_o.data.polygons): continue
        _b=bmesh.new(); _b.from_mesh(_o.data); _b.normal_update(); _bv=[v.co.copy() for v in _b.verts if v.is_boundary]; _kd=KDTree(max(1,len(_bv)))
        for _i,_c in enumerate(_bv): _kd.insert(_c,_i)
        _kd.balance(); _covs.append((BVHTree.FromBMesh(_b),_kd,_k,len(_bv)))
bm.normal_update()
def covered(f):
    c=cz(f); n=f.normal
    if CK=='camp' and c.y<0 and c.z>VZ-0.03*s+VK*0.55*abs(c.x): return False
    if c.z<HIP+0.10 and abs(c.x)>SX*0.85: return False      # never a hand: with the arms held out, the fingers' inner faces looked straight at the skirt (its test reaches 30 cm) and were deleted, leaving stumps
    for bt,kd,k,nb in _covs:
        loc,nrm,_i,dist=bt.ray_cast(c+n*0.0005,n,0.30 if k=='skirt' else 0.08)
        if loc is None or nrm.dot(n)<0.15: continue
        if nb and kd.find(loc)[2]<(0.10 if k=='skirt' else 0.045): continue
        return True
    return False
bmesh.ops.delete(bm,geom=[f for f in bm.faces if not all(v[dl].get(gi,0)>0 for v in f.verts) or hidden(cz(f)) or (_covs and covered(f))],context='FACES')
if os.environ.get('NECKDBG') and NW_SEAMLESS:
    for f in bm.faces:
        c=cz(f); r=math.hypot(c.x,c.y-nw_cy(c.z)); a_=nw_ang(c)
        if NECK-0.10<c.z<NECK+0.02 and r>SEAM_R(a_)+0.004: print('NECKDBG x %.3f y %.3f z %.3f r %.3f seamR %.3f seamZ %.3f SX %.3f NECK %.3f hidden %s'%(c.x,c.y,c.z,r,SEAM_R(a_),SEAM_Z(a_),SX,NECK,hidden(c)))
bm.to_mesh(h.data); bm.free()
if not NW_SEAMLESS and ((FLAT and CK=='round') or not CK) and not OLD and PART.get('shirt'):      # (also a plain neckline with no collar, as Abba's shift) under a round collar the slope of the shoulders rose just above the shirt's neckline and showed in flecks beside the collar: pull that band of skin in a little (the neck itself is left alone)
    _nc,_nw,_nd=neck_ring(NECK+0.01); h.data.update()
    for v in h.data.vertices:
        x,y,z=v.co
        if not (NECK-0.02<z<NECK+0.025): continue
        e=math.hypot(x/_nw,(y-_nc)/_nd)
        if e>1.15: v.co-=v.normal*0.006*sstep(1.15,1.35,e)*sstep(NECK+0.025,NECK+0.01,z)
if not OLD and PART.get('shirt') and CK!='camp':      # the skin just under the shirt round the neck moves exactly as the shirt does: with its own weights it rose through the cloth beside the neck at some moments of the idle (the cloth check leaves necklines out, so only a close look found it)
    from mathutils.kdtree import KDTree
    _so=PART['shirt']; _kd=KDTree(len(_so.data.vertices))
    for _v in _so.data.vertices: _kd.insert(_v.co,_v.index)
    _kd.balance(); _sn={g.index:g.name for g in _so.vertex_groups}
    for v in h.data.vertices:
        x,y,z=v.co
        if not (NECK-0.12*s<z<NECK+0.01) or side_arm(v.co) is not None: continue
        _c,_i,_d=_kd.find(v.co)
        if _d>0.03: continue
        k=sstep(NECK+0.01,NECK-0.02,z)      # blended in just below the neckline, so the neck above keeps its own movement
        sw={_sn[g.group]:g.weight for g in _so.data.vertices[_i].groups if _sn[g.group].startswith('mixamorig:') and g.weight>0}; ts=sum(sw.values()) or 1
        old={h.vertex_groups[g.group].name:g.weight for g in v.groups if h.vertex_groups[g.group].name.startswith('mixamorig:')}; to=sum(old.values()) or 1
        for g in list(v.groups):
            if h.vertex_groups[g.group].name.startswith('mixamorig:'): h.vertex_groups[g.group].remove([v.index])
        for n in set(old)|set(sw):
            w=old.get(n,0)/to*(1-k)+sw.get(n,0)/ts*k
            if w>0.002: (h.vertex_groups.get(n) or h.vertex_groups.new(name=n)).add([v.index],w,'REPLACE')
if not OLD or EASE_OLD: neck_to_chest(h)      # the skin at the base of the neck follows the chest, like the shirt's neckline that lies on it
h.data.materials.clear(); h.data.materials.append(colmat('Skin',0.68)); h.name='Body'
if not OLD and G.get('socks'):
    # socks are their own material, cut along one clean line round each leg: painted on the skin, their top edge smeared into the skin once a light copy was simplified.
    # As a separate part of the mesh its edge is a border, which the packer keeps exactly
    ZSK=ANK+G['socks']*(KNEE-ANK); bm=bmesh.new(); bm.from_mesh(h.data)
    _g=[f for f in bm.faces if abs(cz(f).z-ZSK)<0.06]; bmesh.ops.bisect_plane(bm,geom=list(dict.fromkeys(v for f in _g for v in f.verts))+list(dict.fromkeys(e for f in _g for e in f.edges))+_g,plane_co=(0,0,ZSK),plane_no=(0,0,1))
    bmesh.ops.triangulate(bm,faces=[f for f in bm.faces if len(f.verts)>4])
    for f in bm.faces: f.material_index=1 if cz(f).z<ZSK else 0
    bm.to_mesh(h.data); bm.free(); h.data.materials.append(colmat('Sock',0.85))
def tuck_skin():
    # Skin that is still there under the top of a shirt, jacket or coat (the slope of the shoulders and the base of the neck, kept because it is near the neck opening) came
    # through the cloth as small patches when the shoulders moved (seen on every Nanny Town and Selassie man, 16 November 2026). Each such point of skin, more than 12 mm in
    # from the garment's open edge, is set 8 mm deeper and takes the bone weights of the cloth right over it, so it moves exactly as the cloth does and cannot pass it.
    from mathutils.kdtree import KDTree
    o=PART.get('jacket') or PART.get('coat') or PART.get('shirt')
    if o is None or not len(o.data.polygons): return
    b=bmesh.new(); b.from_mesh(o.data); b.normal_update(); bt=BVHTree.FromBMesh(b); edge=[v.co.copy() for v in b.verts if v.is_boundary]; b.free()
    ke=KDTree(max(1,len(edge)))
    for i,c in enumerate(edge): ke.insert(c,i)
    ke.balance(); kv=KDTree(len(o.data.vertices))
    for v in o.data.vertices: kv.insert(v.co,v.index)
    kv.balance(); on={g.index:g.name for g in o.vertex_groups}; h.data.update(); n=0
    for v in h.data.vertices:
        c=v.co
        if not NECK-0.13*s<c.z<NECK+0.03*s or abs(c.x)>SX*1.12: continue
        hit=bt.ray_cast(c+v.normal*0.0005,v.normal,0.03)[0]
        if hit is None or (edge and ke.find(hit)[2]<0.012): continue
        near=o.data.vertices[kv.find(hit)[1]]; bw={on[g.group]:g.weight for g in near.groups if on[g.group].startswith('mixamorig:') and g.weight>0}
        if not bw: continue
        for g in list(v.groups):
            if h.vertex_groups[g.group].name.startswith('mixamorig:'): h.vertex_groups[g.group].remove([v.index])
        for nm,w in bw.items(): (h.vertex_groups.get(nm) or h.vertex_groups.new(name=nm)).add([v.index],w,'REPLACE')
        v.co=c-v.normal*0.008; n+=1
    print('TUCKED SKIN',n)
def fit_waist():
    # The top of the trousers or breeches fits the shirt above it (owner, 16 November 2026: "ensure the pants fit the new chest size"). With the slimmer male chest the
    # shirt narrowed into the waist and the waistband stood out past it, front, sides and back. Each point of the band, round the body at its own angle, is drawn in to
    # 6 mm outside the shirt just above the band (never inside the body), fading out 9 cm below the top. A jacket or coat over it is left alone.
    br=PART.get('breeches'); sh=PART.get('shirt')
    if br is None or sh is None or G.get('jacket') or G.get('coat') or G.get('skirt'): return
    top=max(v.co.z for v in br.data.vertices if abs(v.co.x)<0.12)
    b=bmesh.new(); b.from_mesh(sh.data); st=BVHTree.FromBMesh(b); b.free()
    ys=[v.co.y for v in sh.data.vertices if abs(v.co.z-(top+0.03))<0.01]
    if len(ys)<10: return
    cy=(max(ys)+min(ys))/2; zr=top+0.025
    def rad(o,a):
        d=Vector((math.sin(a),-math.cos(a),0)); hit=o.ray_cast(Vector((0,cy,zr))+d*0.5,-d,0.5)[0]; return (hit-Vector((0,cy,zr))).length if hit else None
    n=0
    for v in br.data.vertices:
        c=v.co
        if c.z<top-0.09 or abs(c.x)>0.30: continue
        dx,dy=c.x,c.y-cy; r=math.hypot(dx,dy)
        if r<1e-4: continue
        rs=rad(st,math.atan2(dx,-dy)); rb=rad(tree,math.atan2(dx,-dy))
        if rs is None: continue
        lim=max(rs+0.006,(rb or 0)+0.008)
        if r>lim:
            f=sstep(top-0.09,top-0.03,c.z); r2=r+(lim-r)*f; c.x=dx*r2/r; c.y=cy+dy*r2/r; n+=1
    br.data.update(); print('FITTED WAIST',n)
fit_waist()
if G.get('tuckskin',1): tuck_skin()
def tuck_under_collar():
    # The same for a flat collar (round or camp): skin of the neck and shoulders lying under the collar's leaf, below its seam, is set 8 mm deeper and bound to the collar,
    # so it cannot come through at the nape when the head bows (it showed as a streak of skin across the back of the collar: owner, 17 November 2026).
    co=bpy.data.objects.get('Collar')
    if co is None or not FLAT or NW_SEAMLESS or not len(co.data.polygons): return      # (not for a collar sewn to the shirt: neckwear.py)
    from mathutils.kdtree import KDTree
    b=bmesh.new(); b.from_mesh(co.data); b.normal_update(); bt=BVHTree.FromBMesh(b); top=[v.co.copy() for v in b.verts if v.is_boundary and v.co.z>NECK-0.02*s]; b.free()
    kt=KDTree(max(1,len(top)))
    for i,c in enumerate(top): kt.insert(c,i)
    kt.balance(); kv=KDTree(len(co.data.vertices))
    for v in co.data.vertices: kv.insert(v.co,v.index)
    kv.balance(); on={g.index:g.name for g in co.vertex_groups}; n=0
    for v in h.data.vertices:
        c=v.co
        if not NECK-0.10*s<c.z<NECK+0.04*s: continue
        hit=bt.ray_cast(c+v.normal*0.0005,v.normal,0.03)[0]
        if hit is None: hit=bt.ray_cast(c-v.normal*0.0005,-v.normal,0.01)[0]
        if hit is None: continue
        dtop=kt.find(c)[2] if top else 1.0; feather=min(1.0,max(0.0,(dtop-0.002)/0.016))      # sunk less near the collar's top edge, fully 1.8 cm below it: the skin's edge under the collar is then one smooth line, not a saw-tooth where some points were pushed in and their neighbours left out (owner, 17 November 2026: jagged collars)
        near=co.data.vertices[kv.find(hit)[1]]; bw={on[g.group]:g.weight for g in near.groups if on[g.group].startswith('mixamorig:') and g.weight>0}
        if not bw: continue
        for g in list(v.groups):
            if h.vertex_groups[g.group].name.startswith('mixamorig:'): h.vertex_groups[g.group].remove([v.index])
        for nm,w in bw.items(): (h.vertex_groups.get(nm) or h.vertex_groups.new(name=nm)).add([v.index],w,'REPLACE')
        v.co=c-v.normal*(0.0015+0.0065*feather); n+=1
    print('TUCKED UNDER COLLAR',n)
if G.get('tuckskin',1): tuck_under_collar()
def tuck_under_skirt():
    # Skin at the waist under the top of a skirt (the band the belt covers and a hand's width below it) came through the skirt just under the belt when the body bent
    # forward to talk or walk (owner, 17 November 2026: "the belt also is exposing something underneath"). Each such point of skin is set 8 mm deeper and takes the bone
    # weights of the skirt right over it, so it moves exactly as the skirt does and cannot pass it. One rule for every body with a skirt.
    sk=PART.get('skirt')
    if sk is None or not len(sk.data.polygons): return
    from mathutils.kdtree import KDTree
    b=bmesh.new(); b.from_mesh(sk.data); b.normal_update(); bt=BVHTree.FromBMesh(b); b.free()
    kv=KDTree(len(sk.data.vertices))
    for v in sk.data.vertices: kv.insert(v.co,v.index)
    kv.balance(); on={g.index:g.name for g in sk.vertex_groups}; n=0
    Jy=J('Hips').y; covers=[x for x in (PART.get('shirt'),sk) if x is not None and len(x.data.polygons)]; trees=[]
    for x in covers:
        bb=bmesh.new(); bb.from_mesh(x.data); bb.normal_update(); trees.append(BVHTree.FromBMesh(bb)); bb.free()
    dead=set()
    for v in h.data.vertices:      # loose patches of the body's own skin at the waist, under the blouse or the skirt, came out between the belt and the skirt when the body bent
        c=v.co
        if not HIP-0.06<c.z<HIP+0.16: continue
        ws={h.vertex_groups[g.group].name:g.weight for g in v.groups if h.vertex_groups[g.group].name.startswith('mixamorig:')}
        if not ws: continue
        top=max(ws,key=ws.get)
        if not re.match(r'mixamorig:(Hips|Spine\d?|LeftUpLeg|RightUpLeg)$',top): continue      # the body's own skin (a hand resting on the hip keeps its skin)
        o=Vector((0,Jy,c.z)); d=Vector((c.x,c.y-Jy,0)); r=d.length
        if r<1e-4: continue
        d/=r
        if any((lambda hh:hh is not None and (hh-o).length>=r-0.004)(T.ray_cast(o,d,0.6)[0]) for T in trees): dead.add(v.index)
    if dead:
        b=bmesh.new(); b.from_mesh(h.data); b.verts.ensure_lookup_table(); bmesh.ops.delete(b,geom=[b.verts[k] for k in dead],context='VERTS'); b.to_mesh(h.data); b.free(); h.data.update(); n=len(dead)
    print('TUCKED UNDER SKIRT',n)
if G.get('tuckskin',1) and G.get('skirt'): tuck_under_skirt()
LIPZ=HEAD+0.025*s; BROWZ=HEAD+0.10*s
if not OLD and PART.get('waistcoat') and PART.get('shirt') and not P.get('outfit'):
    # A waistcoat holds the shirt in. Where the shirt blouses out over the waistband it came through the waistcoat's side as a white flap (owner, 21 November 2026:
    # "the side of the coat looks torn"). Every point of the shirt's body that lies outside the waistcoat, or less than 5 mm inside it, is set 6 mm inside it.
    # (A longer reach for the waistcoat's own clearance was tried instead and pushed its side out into a shelf.)
    _wb=bmesh.new(); _wb.from_mesh(PART['waistcoat'].data); _wb.normal_update(); _wt=BVHTree.FromBMesh(_wb); _wb.free(); _n=0
    for v in PART['shirt'].data.vertices:
        if side_arm(v.co) is not None and abs(v.co.x)>SX*0.95: continue
        loc,nrm,_i,_d=_wt.find_nearest(v.co,0.06)
        if loc is None: continue
        sd=(v.co-loc).dot(nrm)
        if (v.co-loc-nrm*sd).length>0.004 or sd<-0.005: continue
        v.co=v.co-nrm*(sd+0.006); _n+=1
    PART['shirt'].data.update(); print('SHIRT HELD IN under the waistcoat',_n)
if 'RECUT_V' in globals() and PART.get('waistcoat') and not P.get('outfit'): RECUT_V()      # and once more at the very end: later steps (weights, tucks, clearances) moved the edge's points by a few millimetres and the V came out wavy on one side
if P.get('outfit'):      # the fitted garment takes the place of the generated pieces it replaces
    OUTFIT_PHASE='finish'; exec(compile(open(_ofp).read(),_ofp,'exec'))
# Colours. The layer below is a float layer, so the linear colours made by srgb() above are exported as they are, and the scene is marked
# vertexColorSpace: linear (engine/colours.js repairs older bodies without the mark). So a recipe colour means the same colour in every game (docs/PIPELINE.md, "Skin").
def paint(o):
    me=o.data; bm=bmesh.new(); bm.from_mesh(me); cl=bm.loops.layers.float_color.new('Col'); RL=bm.verts.layers.float.get('ramp') if o.name in ('Hair','Moustache') else None
    for f in bm.faces:
        name=me.materials[f.material_index].name.split('.')[0]; base=COL[name]
        for l in f.loops:
            p=l.vert.co; col=base.copy()
            if o is h:
                if G.get('stockings') and ANK-0.01<p.z<KNEE+0.02: col=COL['Stockings'].copy()
                if G.get('socks') and OLD and p.z<ANK+G['socks']*(KNEE-ANK): col=COL['Sock'].copy()      # later eras: socks are their own material (see above)
                lip=max(0,1-((p.x/0.026)**2+((p.z-LIPZ)/0.010)**2)) if p.y<J('Head').y-0.09 else 0
                col=col.lerp(col*0.62+Vector((0.05,0.0,0.0)),min(1,lip*1.2))
                for sx in (-1,1):      # eyebrows, placed from the eyes themselves (a set height above the neck missed the brow on children, elders and shaped faces, and at 4.5 mm they hardly showed)
                    e=EYE[sx]; bx=(p.x-e.x*1.16)/(1.12*ER*G.get('browwide',1.0)); out=bx*sx      # out: -1 at the nose end, +1 at the temple
                    bz=(p.z-(e.z+ER*0.62+ER*0.13*(1-(out-0.1)**2)-ER*0.05*out))/(ER*0.235*G.get('brows',0.5 if P.get('upscale') else 0.7 if G.get('woman') else 1.0)*(1.0-0.42*max(0.0,out)))      # a low arch, its inner end a little the higher (level or lower, it read as a frown), fuller toward the nose and thinning to the temple; finer on women and children unless the recipe sets brows
                    br=max(0,1-(bx*bx+bz*bz)) if p.y<e.y+ER*1.2 else 0
                    col=col.lerp(BROWCOL,min(1,br*2.6)*0.9)
                k=0.94+noise.noise(p*9)*0.06
            else:
                k=0.88+noise.noise(p*14)*0.1+noise.noise(p*3)*0.08
                if RL is not None: col=COL['Skin'].lerp(col,min(1.0,l.vert[RL]*1.7) if o.name=='Hair' else min(1.0,l.vert[RL]*1.25)**0.8); k=0.9+noise.noise(p*90)*0.14
                if p.z<KNEE and name in ('Breeches','Coat'): k*=0.85
            l[cl]=(col.x*k,col.y*k,col.z*k,1)
    bm.to_mesh(me); bm.free(); ca=me.color_attributes; ca.active_color=ca['Col']; ca.render_color_index=list(ca.keys()).index('Col')
    for p in me.polygons: p.use_smooth=True
_ew=[eyes.matrix_world@v.co for v in eyes.data.vertices]; EYE={sx:sum((c for c in _ew if c.x*sx>0),Vector())/max(1,sum(1 for c in _ew if c.x*sx>0)) for sx in (-1,1)}
ER=max((c-EYE[1]).length for c in _ew if c.x>0)      # the eyeball's radius: the scale of the face (a child's is smaller)
_hc=COL['Hair']; BROWCOL=_hc if max(_hc)<0.25 else _hc.lerp(COL['Skin']*0.55,0.5)      # grey or white hair: a soft grey brow, not a white bar across the forehead
def brow_mesh():      # the brow is painted on the skin's own points; where it lies they are made four times finer, so its edge is a clean line and not a few big triangles
    bm=bmesh.new(); bm.from_mesh(h.data)
    for _ in range(2):
        es=[e for e in bm.edges if all(any(abs(v.co.x-EYE[sx].x*1.16)<ER*1.35 and EYE[sx].z+ER*0.2<v.co.z<EYE[sx].z+ER*1.15 and v.co.y<EYE[sx].y+ER*1.2 for sx in (-1,1)) for v in e.verts)]
        bmesh.ops.subdivide_edges(bm,edges=es,cuts=1,use_grid_fill=True)
    bmesh.ops.triangulate(bm,faces=[f for f in bm.faces if len(f.verts)>4]); bm.to_mesh(h.data); bm.free()
brow_mesh()
for o in clothes+[h]: paint(o)
for m in eyes.data.materials:
    for n in m.node_tree.nodes:
        if n.type=='TEX_IMAGE' and n.image: n.image.filepath=os.path.abspath('shared/rig/eye.png'); n.image.reload()
# relaxed arms and curled fingers, the same pose Abba uses
if 'breeches' in PART and not P.get('outfit'):      # (a fitted garment keeps MakeHuman's own weights) the bottom of a jacket and the tucked part of a shirt move with the trousers under them: on the hips' weights alone, a seated thigh rose through the jacket's hem, and a tucked shirt slid out over the waistband
    from mathutils.kdtree import KDTree
    _br=PART['breeches']; _kd=KDTree(len(_br.data.vertices))
    for _v in _br.data.vertices: _kd.insert(_v.co,_v.index)
    _kd.balance(); _bn={g.index:g.name for g in _br.vertex_groups}; _btop=max(v.co.z for v in _br.data.vertices if abs(v.co.x)<0.12)
    for _k,_z0,_z1 in (('jacket',HIP+0.03,HIP+0.12),('coat',HIP-0.02,HIP+0.10))+((('shirt',CROTCH-0.06,_btop),) if not G.get('untucked') else ()):
        _o=PART.get(_k)
        if _o is None: continue
        for v in _o.data.vertices:
            if side_arm(v.co) is not None and abs(v.co.x)>SX*0.8: continue
            f=sstep(_z1,_z1-0.04,v.co.z) if _k=='shirt' else sstep(_z1,_z0,v.co.z)
            if f<=0 or v.co.z<_z0-0.01: continue
            _c,_i,_d=_kd.find(v.co)
            if _d>0.06: continue
            bw={_bn[g.group]:g.weight for g in _br.data.vertices[_i].groups if _bn[g.group].startswith('mixamorig:') and g.weight>0}; tb=sum(bw.values()) or 1
            old={_o.vertex_groups[g.group].name:g.weight for g in v.groups if _o.vertex_groups[g.group].name.startswith('mixamorig:')}; to=sum(old.values()) or 1
            for g in list(v.groups):
                if _o.vertex_groups[g.group].name.startswith('mixamorig:'): _o.vertex_groups[g.group].remove([v.index])
            for n in set(old)|set(bw):
                w=old.get(n,0)/to*(1-f)+bw.get(n,0)/tb*f
                if w>0.002: (_o.vertex_groups.get(n) or _o.vertex_groups.new(name=n)).add([v.index],w,'REPLACE')
    if PART.get('shirt') and not OLD and G.get('trousers') and not G.get('skirt') and not G.get('untucked'):      # later trousers: the shirt tail more than 3 cm inside the waistband is never seen; seated, it pushed out at the fork
        _sb=bmesh.new(); _sb.from_mesh(PART['shirt'].data); bmesh.ops.delete(_sb,geom=[f for f in _sb.faces if cz(f).z<_btop-0.03 and side_arm(cz(f)) is None],context='FACES'); bmesh.ops.delete(_sb,geom=[v for v in _sb.verts if not v.link_faces],context='VERTS'); _sb.to_mesh(PART['shirt'].data); _sb.free()
    if PART.get('shirt') and not G.get('untucked'):      # and a tucked shirt lies inside the breeches' waist, never over it
        _bt=tree_of(_br); _sb=bmesh.new(); _sb.from_mesh(PART['shirt'].data)
        for v in _sb.verts:
            x,y,z=v.co
            if not (CROTCH-0.06<z<_btop-0.004) or (side_arm(v.co) is not None and abs(x)>SX*0.8): continue
            o_=Vector((0,YCz(z) if 'YCz' in globals() else J('Hips').y,z)); d=Vector((x,y-o_.y,0))
            if d.length<1e-4: continue
            d.normalize(); hit=_bt.ray_cast(o_,d,0.4)[0]
            if hit is None: continue
            rb=(hit-o_).length; rs=(v.co-o_).length
            if rs>rb-0.003: v.co=o_+d*(rb-0.004)
        _sb.to_mesh(PART['shirt'].data); _sb.free()
for _o in [x for x in bpy.data.objects if x.type=='MESH' and x.vertex_groups]:      # no point of any piece may follow only a helper group (neutral_bone and the like never move): it stayed behind as a spike when the body moved. It takes the bone weights of its nearest neighbour that has them
    from mathutils.kdtree import KDTree
    _bones={g.index for g in _o.vertex_groups if g.name.startswith('mixamorig:')}; _ok=[v for v in _o.data.vertices if any(g.group in _bones and g.weight>0.01 for g in v.groups)]; _bad=[v for v in _o.data.vertices if not any(g.group in _bones and g.weight>0.01 for g in v.groups)]
    if not _bad or not _ok: continue
    _kd=KDTree(len(_ok))
    for _i,_v in enumerate(_ok): _kd.insert(_v.co,_i)
    _kd.balance()
    _adj={}
    for _e in _o.data.edges:
        _a,_b2=_e.vertices; _adj.setdefault(_a,[]).append(_b2); _adj.setdefault(_b2,[]).append(_a)
    _okset={_v.index for _v in _ok}
    def _conn(_v):      # the nearest point joined to it through the cloth (the nearest in space could be on the other leg, across the gap between them)
        seen={_v.index}; front=[_v.index]
        for _ in range(12):
            nxt=[]
            for i in front:
                for j in _adj.get(i,[]):
                    if j in seen: continue
                    if j in _okset: return _o.data.vertices[j]
                    seen.add(j); nxt.append(j)
            front=nxt
        return None
    for _v in _bad:
        _src=_conn(_v)
        if _src is None: _c,_i,_d=_kd.find(_v.co); _src=_ok[_i]
        for g in list(_v.groups): _o.vertex_groups[g.group].remove([_v.index])
        for g in _src.groups:
            if g.group in _bones and g.weight>0.001: _o.vertex_groups[g.group].add([_v.index],g.weight,'REPLACE')
if OLD and PART.get('breeches') and G.get('breechkind','plain')!='trousers':      # 1690 breeches gathered below the knee: the band below the knee follows the shin (on the thigh alone it stood out behind the bent knee)
    _o=PART['breeches']; _vg=_o.vertex_groups
    for v in _o.data.vertices:
        f=sstep(KNEE+0.01,KNEE-0.04,v.co.z)
        if f<=0: continue
        sd='Left' if v.co.x>0 else 'Right'; up=_vg.get('mixamorig:'+sd+'UpLeg'); lg=_vg.get('mixamorig:'+sd+'Leg') or _vg.new(name='mixamorig:'+sd+'Leg')
        wu=next((g.weight for g in v.groups if up and g.group==up.index),0.0)
        if wu<=0: continue
        up.add([v.index],wu*(1-f),'REPLACE'); wl=next((g.weight for g in v.groups if g.group==lg.index),0.0); lg.add([v.index],wl+wu*f,'REPLACE')
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
if os.environ.get('FOLDS'):      # how many faces of each piece face the wrong way (folded over), which a game draws as a hole
    for o in clothes:
        b=bmesh.new(); b.from_mesh(o.data); b.normal_update(); nf=0
        for f in b.faces:
            ad=[g for e in f.edges for g in e.link_faces if g is not f]
            if ad and f.normal.dot(sum((g.normal for g in ad),Vector((0,0,0))))<0: nf+=1
        if nf: print('FOLDS',o.name,nf,'of',len(b.faces))
        b.free()
def face_out():
    # Every face of the body's own clothes looks outward, the way the skin under it looks (the nearest point of the skin gives the direction). Cut, eased and pushed cloth
    # left some faces turned inward, and with two-sided cloth they drew as dark speckled patches, on the backs of the sleeves above all (Port Royal's pewterer, owner, 17 November 2026).
    sk=globals().get('SKIN') or tree
    for k in ('shirt','coat','waistcoat','jacket','breeches','skirt','apron'):
        o=PART.get(k)
        if o is None or not len(o.data.polygons): continue
        b=bmesh.new(); b.from_mesh(o.data); b.normal_update(); fl=[]
        for f in b.faces:
            c=cz(f); loc,nrm,_i,_d=sk.find_nearest(c)
            if loc is None: continue
            if f.normal.dot(nrm)<0: fl.append(f)
        if fl: bmesh.ops.reverse_faces(b,faces=fl); print('TURNED OUT',k,len(fl))
        b.to_mesh(o.data); b.free(); o.data.update()
face_out()
# The face is marked on the skin (1 on every point from the brow to the chin, cheek to cheek), and carried into the .glb as the attribute _FACE. tools/people/pack.mjs gives the
# marked part its own share of triangles when it makes a light, crowd or phone copy, so eyes, brows and lips survive (simplified with the rest of the skin, a face in a crowd lost them).
_fa=h.data.attributes.new('_FACE','FLOAT','POINT')
for v in h.data.vertices:
    c=v.co; _fa.data[v.index].value=1.0 if (c.y<EYE[1].y+ER*2.4 and EYE[1].z-ER*4.4<c.z<EYE[1].z+ER*1.7 and abs(c.x)<EYE[1].x+ER*2.3) else 0.0
print('TRIS',sum(len(p.vertices)-2 for o in bpy.data.objects if o.type=='MESH' for p in o.data.polygons))
os.makedirs('build/people',exist_ok=True); bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath('build/people/'+P['name']+'.blend'))
bpy.context.scene['vertexColorSpace'] = 'linear'
bpy.ops.export_scene.gltf(export_extras=True,filepath=OUT+P['name']+'.glb',export_image_format='JPEG',export_apply=False,export_vertex_color='NAME',export_vertex_color_name='Col',export_skins=True,export_animations=False,export_rest_position_armature=False,export_attributes=True)
# a copy for Mixamo: rest pose, with skin, so the user can pick animations for it
if P.get('fbx'):
    rig.data.pose_position='REST'; bpy.context.view_layer.update()
    bpy.ops.export_scene.fbx(filepath=os.path.abspath('build/people/'+P['name']+'_for_mixamo.fbx'),object_types={'ARMATURE','MESH'},add_leaf_bones=False,path_mode='COPY',embed_textures=True,colors_type='SRGB',mesh_smooth_type='FACE',bake_anim=False)
    rig.data.pose_position='POSE'
