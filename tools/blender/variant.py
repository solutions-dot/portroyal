import bpy, bmesh, math, random
from mathutils import Vector, Euler, Matrix, noise
from mathutils.bvhtree import BVHTree
T='/tmp/build/tex/'; OUT='/home/claude/port-royal-assets/'
bpy.ops.wm.read_factory_settings(use_empty=True)
TILE={}
def mat(name,tex=None,rough=0.85,color=None,metal=0.0,tile=(1,1)):
    m=bpy.data.materials.new(name); nt=m.node_tree
    if nt is None: m.use_nodes=True; nt=m.node_tree
    b=next(n for n in nt.nodes if n.type=='BSDF_PRINCIPLED'); b.inputs['Roughness'].default_value=rough; b.inputs['Metallic'].default_value=metal
    vc=nt.nodes.new('ShaderNodeVertexColor'); vc.layer_name='Col'
    if tex:
        t=nt.nodes.new('ShaderNodeTexImage'); t.image=bpy.data.images.load(T+tex+'.png',check_existing=True)
        mx=nt.nodes.new('ShaderNodeMix'); mx.data_type='RGBA'; mx.blend_type='MULTIPLY'; mx.inputs[0].default_value=1.0
        nt.links.new(t.outputs['Color'],mx.inputs[6]); nt.links.new(vc.outputs['Color'],mx.inputs[7]); nt.links.new(mx.outputs[2],b.inputs['Base Color'])
        t2=nt.nodes.new('ShaderNodeTexImage'); t2.image=bpy.data.images.load(T+tex+'_n.png',check_existing=True); t2.image.colorspace_settings.name='Non-Color'
        nm=nt.nodes.new('ShaderNodeNormalMap'); nt.links.new(t2.outputs['Color'],nm.inputs['Color']); nt.links.new(nm.outputs['Normal'],b.inputs['Normal'])
    else:
        nt.links.new(vc.outputs['Color'],b.inputs['Base Color'])
    m['base']=color or (1,1,1); TILE[name]=tile; return m
CV=0.30
BRICK=mat('Brick','brick',0.9,tile=(0.92,0.90)); SHING=mat('Shingle','shingle',0.9,tile=(1.3,8*CV)); CLAY=mat('ClayTile','clay',0.8,tile=(1.2,8*CV))
WOOD=mat('Wood','wood',0.8,tile=(0.8,0.8)); STONE=mat('Stone','stone',0.9); PLASTER=mat('Plaster','plaster',0.95,tile=(1.6,1.6))
GLASS=mat('LeadedGlass','glass',0.25,tile=(0.5,0.5)); IRON=mat('Iron',None,0.6,color=(0.03,0.03,0.035),metal=0.8)
scol=bpy.context.scene.collection
ALL=[]
def house(name,x0,W,D,floors,FH=2.9,wall='brick',roof='shingle',gable_front=False,pitch=42,seed=0):
    rnd=random.Random(seed); objs=[]; F=-4.0; yc=F+D/2; H=FH*floors
    XF=Matrix.Translation((x0,0,0)); WALL=BRICK if wall=='brick' else PLASTER; ROOF=SHING if roof=='shingle' else CLAY
    def box(nm,sx,sy,sz,loc,m,rot=None,xf=None):
        me=bpy.data.meshes.new(nm); bm=bmesh.new(); bmesh.ops.create_cube(bm,size=1)
        for v in bm.verts: v.co=Vector((v.co.x*sx,v.co.y*sy,v.co.z*sz))
        bm.to_mesh(me); bm.free(); o=bpy.data.objects.new(nm,me)
        L=Matrix.Translation(loc)@(Euler(rot,'XYZ').to_matrix().to_4x4() if rot else Matrix())
        o.matrix_world=(xf or XF)@L; me.materials.append(m); scol.objects.link(o); objs.append(o); o['H']=H; return o
    body=box('Walls',W,D,H,(0,yc,H/2),WALL)
    dl=-W/2+0.55; ops=[(dl+0.575,0.18,1.15,2.25,'door')]
    sl_,sr_=dl+1.15+0.55,W/2-0.5; ops.append(((sl_+sr_)/2,0.95,sr_-sl_,1.5,'shop'))
    n=2 if W<6.5 else 3
    for fl in range(1,floors):
        for i in range(n): ops.append((-W/2+W*(i+0.5)/n,fl*FH+0.75,1.0,1.5 if fl<floors-1 else 1.35,'win'))
    cut=[]
    for cx,z,w,h,k in ops: cut.append(box('cut',w,0.6,h,(cx,F,z+h/2),WALL))
    bpy.context.view_layer.update()
    for c in cut:
        md=body.modifiers.new('b','BOOLEAN'); md.operation='DIFFERENCE'; md.object=c
        with bpy.context.temp_override(object=body,active_object=body,selected_objects=[body]): bpy.ops.object.modifier_apply(modifier=md.name)
        objs.remove(c); bpy.data.objects.remove(c)
    def head(cx,z,w,h):
        if wall=='brick': box('Soldier',w+0.34,0.05,0.24,(cx,F-0.012,z+h+0.12),BRICK)     # gauged brick flat arch
        else: box('Lintel',w+0.36,0.07,0.2,(cx,F-0.01,z+h+0.1),WOOD)
    def window(cx,z,w,h,bv=1):
        box('Glass',w,0.02,h,(cx,F+0.24,z+h/2),GLASS); fy=F+0.18; t=0.075
        box('Frame',w,0.07,t,(cx,fy,z+t/2),WOOD); box('Frame',w,0.07,t,(cx,fy,z+h-t/2),WOOD)
        for sx in (-1,1): box('Frame',t,0.07,h,(cx+sx*(w/2-t/2),fy,z+h/2),WOOD)
        for i in range(bv): box('Mullion',0.05,0.06,h,(cx-w/2+w*(i+1)/(bv+1),fy,z+h/2),WOOD)
        box('Transom',w,0.06,0.05,(cx,fy,z+h*0.55),WOOD)
        box('Sill',w+0.22,0.2,0.07,(cx,F-0.02,z-0.035),WOOD if wall!='brick' else STONE); head(cx,z,w,h)
    for cx,z,w,h,k in ops:
        if k=='win':
            window(cx,z,w,h)
            if rnd.random()<0.5:                                   # some shutters left open
                for sx in (-1,1): box('Shutter',w/2-0.03,0.035,h,(cx+sx*(w*0.75+0.02),F-0.02,z+h/2),WOOD)
        elif k=='shop':
            window(cx,z,w,h,3)
            box('Counter',w,0.5,0.05,(cx,F-0.27,z-0.02),WOOD)
            for dx in (-w/2+0.2,w/2-0.2): box('Bracket',0.06,0.06,0.5,(cx+dx,F-0.3,z-0.27),WOOD,(math.radians(-35),0,0))
            box('Awning',w,0.8,0.04,(cx,F-0.35,z+h+0.3),WOOD,(math.radians(-26),0,0))
            for dx in (-w/2+0.1,w/2-0.1): box('Prop',0.03,0.03,0.85,(cx+dx,F-0.45,z+h-0.1),IRON,(math.radians(40),0,0))
        else:
            box('Door',w,0.07,h,(cx,F+0.2,z+h/2),WOOD)
            for sx in (-1,1): box('Frame',0.09,0.1,h,(cx+sx*(w/2-0.045),F+0.14,z+h/2),WOOD)
            for dz in (0.45,h-0.45): box('Hinge',w*0.7,0.02,0.07,(cx-w*0.12,F+0.155,z+dz),IRON)
            box('Latch',0.05,0.05,0.16,(cx+w/2-0.2,F+0.14,z+1.05),IRON); head(cx,z,w,h)
            box('Step',w+0.4,0.45,0.07,(cx,F-0.22,0.155),STONE)
    if wall=='brick':
        for fl in range(1,floors): box('StringCourse',W,0.1,0.15,(0,F-0.03,fl*FH),BRICK)
        box('Plinth',W,0.08,0.4,(0,F-0.03,0.2),STONE) if False else None
        box('Pavement',W,1.7,0.12,(0,F-0.85,0.06),BRICK)
    else:                                                          # exposed oak frame over limewashed panels
        bz=0.16
        for fl in range(0,floors+1): box('Beam',W+0.02,0.07,bz+0.04,(0,F-0.03,max(fl*FH,0.1)),WOOD)
        for sx in (-1,1): box('Beam',bz+0.04,0.07,H,(sx*(W/2-0.1),F-0.03,H/2),WOOD)
        for fl in range(floors):
            x=-W/2+0.85
            while x<W/2-0.6:
                if not any((z<(fl+1)*FH and z+h>fl*FH and abs(x-cx)<w/2+0.3) for cx,z,w,h,k in ops):
                    box('Beam',bz*0.8,0.06,FH,(x,F-0.03,fl*FH+FH/2),WOOD)
                x+=0.8
        for sx in (-1,1): box('Beam',0.12,0.06,0.95,(sx*(W/2-0.5),F-0.032,(floors-1)*FH+0.48),WOOD,(0,math.radians(sx*40),0))
        box('Step',W,1.2,0.05,(0,F-0.6,0.025),STONE)
    # ---- roof, built in its own frame so the ridge can run either way
    Wr,Dr=(W,D) if not gable_front else (D,W)
    RM=Matrix.Translation((x0,yc,H))@(Matrix.Rotation(math.radians(90),4,'Z') if gable_front else Matrix())
    a=math.radians(pitch); rise=Dr/2*math.tan(a); sl=math.hypot(Dr/2,rise); ov=0.38
    me=bpy.data.meshes.new('Gables'); bm=bmesh.new()
    vs=[bm.verts.new(p) for p in [(-Wr/2,-Dr/2,0),(-Wr/2,Dr/2,0),(-Wr/2,0,rise),(Wr/2,-Dr/2,0),(Wr/2,Dr/2,0),(Wr/2,0,rise)]]
    for f in ((0,1,2),(5,4,3),(0,3,4,1),(1,4,5,2),(2,5,3,0)): bm.faces.new([vs[i] for i in f])
    bmesh.ops.recalc_face_normals(bm,faces=bm.faces); bm.to_mesh(me); bm.free()
    g=bpy.data.objects.new('Gables',me); me.materials.append(WALL); scol.objects.link(g); g.matrix_world=RM; objs.append(g); g['H']=H
    nc=int(math.ceil((sl+ov)/CV))
    for sgn,rz in ((-1,0),(1,math.pi)):
        d=Vector((0,-sgn*math.cos(a),math.sin(a))); nrm=Vector((0,sgn*math.sin(a),math.cos(a))); eave=Vector((0,sgn*(Dr/2),0))-d*ov if False else Vector((0,sgn*Dr/2,0))+Vector((0,sgn*math.cos(a),-math.sin(a)))*ov
        for i in range(nc):                                      # overlapping courses give a stepped, uneven roof
            c=eave+d*(i*CV+CV*0.7)+nrm*(0.05+rnd.uniform(0,0.008))
            o=box('RoofCourse',Wr+0.34,CV*1.45,0.028,c,ROOF,(a+math.radians(3.5),0,rz),xf=RM); o['uoff']=rnd.random(); o['sag']=(Wr,i/nc)
        for sx in (-1,1): box('Barge',0.045,sl+ov,0.17,Vector((sx*(Wr/2+0.15),sgn*Dr/4,rise/2))+Vector((0,sgn*math.cos(a),-math.sin(a)))*(ov/2)+nrm*0.0,WOOD,(a,0,rz),xf=RM)
    o=box('Ridge',Wr+0.34,0.3,0.1,(0,0,rise+0.07),ROOF,xf=RM); o['sag']=(Wr,1.0)
    ch=rise+1.4; box('Chimney',0.75,0.95,ch,(Wr/2-0.4,0,ch/2),BRICK,xf=RM); box('ChimneyBand',0.9,1.1,0.12,(Wr/2-0.4,0,ch-0.45),BRICK,xf=RM); box('ChimneyCap',0.86,1.06,0.08,(Wr/2-0.4,0,ch+0.04),STONE,xf=RM)
    for fl_y,s in ((-Dr/2,-1),(Dr/2,1)): box('Eaves',Wr,0.14,0.2,(0,fl_y+s*0.05,-0.1),WOOD,xf=RM)
    if gable_front:                                               # loft door and hoist beam, as on a merchant's store
        box('LoftDoor',0.95,0.06,1.25,(0,F-0.02,H+0.75),WOOD); box('Soldier',1.25,0.05,0.22,(0,F-0.012,H+1.49),BRICK) if wall=='brick' else None
        box('Hoist',0.13,1.1,0.13,(0,F-0.5,H+rise-0.55),WOOD); box('Hook',0.03,0.03,0.3,(0,F-0.95,H+rise-0.75),IRON)
    else:
        box('Dormer',1.2,1.6,1.3,(0,F+1.8,H+1.55),WOOD); box('Glass',0.8,0.02,0.75,(0,F+0.995,H+1.6),GLASS)
        for dx in (-0.43,0.43): box('Frame',0.07,0.05,0.89,(dx,F+0.98,H+1.6),WOOD)
        for dz in (-0.41,0.41): box('Frame',0.93,0.05,0.07,(0,F+0.98,H+1.6+dz),WOOD)
        box('RoofCourse',1.5,1.95,0.05,(0,F+1.8,H+2.33),ROOF,(math.radians(14),0,0))
    sx=0.0 if n==2 else -W/6; sz=FH+1.5
    box('SignBracket',0.05,1.15,0.05,(sx,F-0.575,sz),IRON); box('SignBrace',0.04,0.9,0.04,(sx,F-0.38,sz-0.33),IRON,(math.radians(-40),0,0))
    for dy in (-0.42,-0.92): box('SignChain',0.02,0.02,0.16,(sx,F+dy,sz-0.1),IRON)
    box('SignBoard',0.05,0.72,0.56,(sx,F-0.67,sz-0.46),WOOD)
    objs[:]=[o for o in objs if o is not None]
    return name,objs

BIG=('Walls','Gables','RoofCourse','Chimney','Pavement','Dormer','Ridge','Step','Barge','Beam')
def grid_cut(o,step):
    bm=bmesh.new(); bm.from_mesh(o.data)
    for ax in range(3):
        cs=[v.co[ax] for v in bm.verts]; lo,hi=min(cs),max(cs); c=lo+step
        while c<hi-0.05:
            co=[0,0,0]; no=[0,0,0]; co[ax]=c; no[ax]=1
            bmesh.ops.bisect_plane(bm,geom=bm.verts[:]+bm.edges[:]+bm.faces[:],plane_co=co,plane_no=no); c+=step
    bm.to_mesh(o.data); bm.free()
def finish(o):
    me=o.data; nm=o.name.split('.')[0]; mname=me.materials[0].name; tw,th=TILE[mname]
    if nm in BIG: grid_cut(o,0.45 if nm!='RoofCourse' else 0.6)
    bm=bmesh.new(); bm.from_mesh(me)
    if 'sag' in o.keys():                                         # old roofs sag between the gables
        Wr,k=o['sag']
        for v in bm.verts: v.co.z-=0.07*k*math.sin(math.pi*min(1,max(0,v.co.x/Wr+0.5)))+noise.noise(Vector((v.co.x*1.7,k*9,0)))*0.012
    uv=bm.loops.layers.uv.verify(); cl=bm.loops.layers.color.new('Col'); uo=o.get('uoff',0.0); H=o.get('H',9)
    base=Vector(bpy.data.materials[mname]['base']); roof=mname in ('Shingle','ClayTile'); M=o.matrix_world
    for f in bm.faces:
        n=f.normal; ax=max(range(3),key=lambda i:abs(n[i]))
        for l in f.loops:
            c=l.vert.co; u,v=((c.x,c.y) if ax==2 else (c.x,c.z) if ax==1 else (c.y,c.z))
            if nm=='Soldier': u,v=v,u
            l[uv].uv=(u/tw+uo,v/th+(0.5 if nm=='RoofCourse' else 0))
            p=M@c; n1=noise.noise(p*0.45); n2=noise.noise(Vector((p.x*3.1,p.y*3.1,p.z*0.25)))
            k=0.92+n1*0.2; tint=Vector((1,1,1))
            if n2>0.15: k*=1-min((n2-0.15)*0.9,0.3)
            if roof:
                k*=0.9+noise.noise(p*1.3)*0.22; tint=tint.lerp(Vector((0.78,0.88,0.72)),max(0,noise.noise(p*0.7+Vector((9,9,9))))*0.9)
            else:
                if p.z<1.6: q=(1-p.z/1.6)**1.5; k*=1-0.4*q; tint=tint.lerp(Vector((0.78,0.86,0.70)),q*0.8)
                if H-0.7<p.z<H+0.1: k*=0.84
            if nm in ('Beam','Barge','Eaves','Hoist','LoftDoor'): k*=0.5
            if mname=='Plaster' and n2>0.05: tint=tint.lerp(Vector((0.86,0.8,0.66)),0.5)       # rain streaks on limewash
            k=max(0.25,min(1.0,k)); l[cl]=(base.x*tint.x*k,base.y*tint.y*k,base.z*tint.z*k,1)
    bm.to_mesh(me); bm.free()

import sys, json
OUT='/tmp/web/site/models/'
V=json.loads(sys.argv[-1])
HOUSES=[house(V['name'],0.0,V['W'],V['D'],V['floors'],FH=V.get('FH',2.9),wall=V['wall'],roof=V['roof'],gable_front=V.get('gable',False),pitch=V.get('pitch',42),seed=V['seed'])]
bpy.context.view_layer.update()
for nm,objs in HOUSES:
    for o in objs: finish(o)
bpy.context.view_layer.update()
# ---- bake soft contact shadows into the vertex colours
V=[];P=[]
for nm,objs in HOUSES:
    for o in objs:
        b=len(V); M=o.matrix_world; V+= [M@v.co for v in o.data.vertices]; P+=[[b+i for i in p.vertices] for p in o.data.polygons]
b=len(V); V+=[Vector((-40,-40,0)),Vector((40,-40,0)),Vector((40,40,0)),Vector((-40,40,0))]; P.append([b,b+1,b+2,b+3])
tree=BVHTree.FromPolygons(V,P); rr=random.Random(4); dirs=[]
while len(dirs)<14:
    d=Vector((rr.uniform(-1,1),rr.uniform(-1,1),rr.uniform(0.15,1)))
    if 0.2<d.length<1: dirs.append(d.normalized())
for nm,objs in HOUSES:
    for o in objs:
        me=o.data; M=o.matrix_world; R=M.to_3x3(); ca=me.color_attributes['Col'].data
        for p in me.polygons:
            n=(R@p.normal).normalized(); q=n.to_track_quat('Z','Y')
            for li in p.loop_indices:
                w=M@me.vertices[me.loops[li].vertex_index].co; w=w+(M@p.center-w)*0.04+n*0.012
                hit=sum(1 for d in dirs if tree.ray_cast(w,q@d,1.1)[0] is not None)
                k=1-0.72*(hit/len(dirs))**0.9; c=ca[li].color; ca[li].color=(c[0]*k,c[1]*k,c[2]*k,1)
tris=0
for nm,objs in HOUSES:
    root=bpy.data.objects.new(nm,None); scol.objects.link(root); groups={}
    for o in objs: groups.setdefault(o.data.materials[0].name,[]).append(o)
    parts=[]
    for mn,grp in groups.items():
        with bpy.context.temp_override(active_object=grp[0],selected_editable_objects=grp,selected_objects=grp,object=grp[0]):
            if len(grp)>1: bpy.ops.object.join()
        o=grp[0]; o.name=nm+'_'+mn; ca=o.data.color_attributes; ca.active_color=ca['Col']; ca.render_color_index=list(ca.keys()).index('Col')
        parts.append(o); t=sum(len(p.vertices)-2 for p in o.data.polygons); tris+=t
    for o in bpy.data.objects: o.select_set(False)
    for o in parts+[root]: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=OUT+nm+'.glb',use_selection=True,export_image_format='NONE',export_apply=True,export_vertex_color='NAME',export_vertex_color_name='Col')
    print('HOUSE',nm,sum(len(p.vertices)-2 for o in parts for p in o.data.polygons))

