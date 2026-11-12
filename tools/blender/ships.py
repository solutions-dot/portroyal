import bpy, bmesh, math, random, sys
import numpy as np
from PIL import Image
from mathutils import Vector, Matrix, Euler, noise
from mathutils.bvhtree import BVHTree
T='/tmp/ship/'; OUT='/tmp/web/site/models/'
rng=np.random.default_rng(3)
def tn(S,c,seed):
    r=np.random.default_rng(seed).random((c,c)); r=np.pad(r,2,mode='wrap'); k=S//c
    im=Image.fromarray((r*255).astype('uint8')).resize(((c+4)*k,(c+4)*k),Image.BICUBIC)
    return np.asarray(im).astype(float)[2*k:2*k+S,2*k:2*k+S]/255
def planks(name,base,rows,seed,S=512):
    col=np.zeros((S,S,3)); hm=np.ones((S,S)); rh=S//rows; r=np.random.default_rng(seed)
    for i in range(rows):
        c=np.array(base,float)+r.normal(0,1)*np.array([10,8,6]); col[i*rh:(i+1)*rh]=c
        col[i*rh:i*rh+3]=c*0.35; hm[i*rh:i*rh+3]=0
        for k in range(2):
            x=int(r.integers(0,S)); col[i*rh:(i+1)*rh,x:x+3]=c*0.45; hm[i*rh:(i+1)*rh,x:x+3]=0.3
    g=r.random((S//6,8)); g=np.asarray(Image.fromarray((g*255).astype('uint8')).resize((S,S),Image.BICUBIC)).astype(float)/255-0.5
    col+=(g*30)[...,None]+((tn(S,8,seed+5)-0.5)*26)[...,None]
    Image.fromarray(np.clip(col,0,255).astype('uint8')).save(T+name+'.png')
    h=hm+g*0.3; gx=(np.roll(h,-1,1)-np.roll(h,1,1))*2; gy=(np.roll(h,-1,0)-np.roll(h,1,0))*2; l=np.sqrt(gx*gx+gy*gy+1)
    Image.fromarray(((np.stack([-gx/l,gy/l,1/l],-1)*0.5+0.5)*255).astype('uint8')).save(T+name+'_n.png')
planks('hull',[150,120,88],8,1); planks('deck',[168,150,120],10,2)
S=256; c=np.array([206,196,170.])[None,None,:]+((tn(S,64,7)-0.5)*26+(tn(S,8,8)-0.5)*30)[...,None]; Image.fromarray(np.clip(c,0,255).astype('uint8')).save(T+'canvas.png')
f=np.zeros((120,200,3)); f[:]=[178,34,40]; f[:60,:80]=[240,238,230]; f[24:36,:80]=[190,30,36]; f[:60,34:46]=[190,30,36]; Image.fromarray(f.astype('uint8')).save(T+'ensign.png')
import shutil; shutil.copy('/tmp/build/tex/glass.png',T+'glass.png')

def build(kind):
    bpy.ops.wm.read_factory_settings(use_empty=True); scol=bpy.context.scene.collection; objs=[]; rnd=random.Random(5)
    def mat(name,tex=None,rough=0.85,color=(1,1,1),metal=0.0,normal=True):
        m=bpy.data.materials.new(name); nt=m.node_tree
        if nt is None: m.use_nodes=True; nt=m.node_tree
        b=next(n for n in nt.nodes if n.type=='BSDF_PRINCIPLED'); b.inputs['Roughness'].default_value=rough; b.inputs['Metallic'].default_value=metal
        vc=nt.nodes.new('ShaderNodeVertexColor'); vc.layer_name='Col'
        if tex:
            t=nt.nodes.new('ShaderNodeTexImage'); t.image=bpy.data.images.load(T+tex+'.png',check_existing=True)
            mx=nt.nodes.new('ShaderNodeMix'); mx.data_type='RGBA'; mx.blend_type='MULTIPLY'; mx.inputs[0].default_value=1.0
            nt.links.new(t.outputs['Color'],mx.inputs[6]); nt.links.new(vc.outputs['Color'],mx.inputs[7]); nt.links.new(mx.outputs[2],b.inputs['Base Color'])
            if normal:
                t2=nt.nodes.new('ShaderNodeTexImage'); t2.image=bpy.data.images.load(T+tex+'_n.png',check_existing=True); t2.image.colorspace_settings.name='Non-Color'
                nm=nt.nodes.new('ShaderNodeNormalMap'); nt.links.new(t2.outputs['Color'],nm.inputs['Color']); nt.links.new(nm.outputs['Normal'],b.inputs['Normal'])
        else: nt.links.new(vc.outputs['Color'],b.inputs['Base Color'])
        m['base']=color; m.use_backface_culling=False; return m
    HULL=mat('Hull','hull'); DECK=mat('Deck','deck'); SPAR=mat('Spar','hull',color=(0.62,0.5,0.36)); DARK=mat('Tar','hull',color=(0.2,0.17,0.15))
    ROPE=mat('Rope',None,0.95,(0.16,0.12,0.09)); SAIL=mat('Sail','canvas',0.95,normal=False); IRON=mat('Iron',None,0.6,(0.05,0.05,0.055),0.7)
    GLASS=mat('Glass','glass',0.25,normal=False); FLAG=mat('Flag','ensign',0.9,normal=False); OCHRE=mat('Ochre','hull',color=(0.95,0.7,0.3)); RED=mat('Red','hull',color=(0.7,0.2,0.16))
    def new(name,bm,m,world=None):
        me=bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); o=bpy.data.objects.new(name,me); me.materials.append(m); scol.objects.link(o)
        if world is not None: o.matrix_world=world
        objs.append(o); return o
    def box(name,sx,sy,sz,loc,m,rot=None,uvs=1.2):
        bm=bmesh.new(); bmesh.ops.create_cube(bm,size=1)
        for v in bm.verts: v.co=Vector((v.co.x*sx,v.co.y*sy,v.co.z*sz))
        o=new(name,bm,m,Matrix.Translation(loc)@(Euler(rot,'XYZ').to_matrix().to_4x4() if rot else Matrix())); o['uvs']=uvs; return o
    def spar(name,p1,p2,r1,r2,m,seg=8,lump=0.0):
        p1=Vector(p1); p2=Vector(p2); d=p2-p1; L=d.length; bm=bmesh.new(); n=max(2,int(L/0.5)) if lump else 1
        rings=[]
        for i in range(n+1):
            t=i/n; r=r1+(r2-r1)*t; ring=[]
            for k in range(seg):
                a=2*math.pi*k/seg; rr=r*(1+lump*(rnd.random()-0.3)) if lump else r
                ring.append(bm.verts.new((math.cos(a)*rr,math.sin(a)*rr*(0.8 if lump else 1)-(r*0.5 if lump else 0),t*L)))
            rings.append(ring)
        for i in range(n):
            for k in range(seg): bm.faces.new((rings[i][k],rings[i][(k+1)%seg],rings[i+1][(k+1)%seg],rings[i+1][k]))
        bm.faces.new(rings[0][::-1]); bm.faces.new(rings[-1])
        q=Vector((0,0,1)).rotation_difference(d.normalized()); o=new(name,bm,m,Matrix.Translation(p1)@q.to_matrix().to_4x4()); o['uvs']=1.0; return o
    def rope(p1,p2,r=0.018): o=spar('Rope',p1,p2,r,r,ROPE,3); o['noao']=1; return o

    if kind=='merchant': L,B,Dr,F,BW,NS=27.0,7.0,2.7,2.5,0.95,34
    else: L,B,Dr,F,BW,NS=16.5,5.0,1.9,1.45,0.6,28
    sm=lambda a,b,x: (lambda t:t*t*(3-2*t))(max(0.0,min(1.0,(x-a)/(b-a))))
    def hb(t):
        if kind=='merchant':
            if t<0.3: f=0.7+0.3*sm(0,0.3,t)
            elif t<0.6: f=1.0
            else: f=max(0.0,1-((t-0.6)/0.4)**2.6)**0.55
        else:
            if t<0.35: f=0.74+0.26*sm(0,0.35,t)
            elif t<0.48: f=1.0
            else: f=max(0.0,1-((t-0.48)/0.52)**2.0)**0.7
        return max(0.07,B/2*f)
    def sheer(t):
        z=F+ (1.3 if kind=='merchant' else 0.75)*max(0,1-t/0.4)**2 + (1.0 if kind=='merchant' else 0.75)*max(0,(t-0.6)/0.4)**2
        if kind=='merchant': z+=1.25*(1-sm(0.27,0.29,t))+0.85*sm(0.80,0.82,t)
        else: z+=0.5*(1-sm(0.24,0.26,t))
        return z
    def keel(t): return -Dr+(Dr+0.9)*max(0,(t-0.86)/0.14)**1.8
    def g(s,t):
        s0=0.34+0.5*max(0,1-t/0.3)**1.5+0.3*max(0,(t-0.6)/0.4)
        w=min(1.0,(max(s,0.0)/s0))**0.62 if s<s0 else 1.0
        if kind=='merchant' and s>0.72: w*=1-0.1*(s-0.72)/0.28
        return w
    NP=11; X=lambda t:-L/2+t*L
    def prof(t):
        zk,zs,h=keel(t),sheer(t),hb(t); return [(max(0.06,h*g(i/(NP-1),t)), zk+(zs-zk)*i/(NP-1)) for i in range(NP)]
    bm=bmesh.new(); uv=bm.loops.layers.uv.verify(); cl=bm.loops.layers.color.new('Col'); grid={}
    for i in range(NS):
        t=i/(NS-1); pr=prof(t)
        for side in (1,-1):
            gl=0
            for k,(w,z) in enumerate(pr):
                if k: gl+=math.hypot(w-pr[k-1][0],z-pr[k-1][1])
                v=bm.verts.new((X(t),side*w,z)); grid[(i,side,k)]=(v,gl,k/(NP-1),z)
    def hcol(s,z,t):
        if z<0.12: return (0.86,0.83,0.74)                       # tallowed 'white stuff' below the waterline
        fz=z/sheer(t)
        if 0.34<fz<0.50: return (0.13,0.11,0.10)                 # the black wale
        if kind=='merchant' and fz>0.66: return (1.0,0.72,0.30)  # ochre upper works
        if kind=='sloop' and fz>0.72: return (0.50,0.20,0.15)
        return (0.60,0.47,0.34)
    def quad(a,b,c,d,t):
        f=bm.faces.new((a[0],b[0],c[0],d[0]))
        for l,src in zip(f.loops,(a,b,c,d)):
            l[uv].uv=(l.vert.co.x/1.6,src[1]/1.6); k=0.85+noise.noise(l.vert.co*0.5)*0.2
            if 0.12<src[3]<0.7: k*=0.75+0.25*sm(0.12,0.7,src[3])
            c3=hcol(src[2],src[3],t); l[cl]=(c3[0]*k,c3[1]*k,c3[2]*k,1)
    for i in range(NS-1):
        for side in (1,-1):
            for k in range(NP-1):
                a,b,c,d=grid[(i,side,k)],grid[(i+1,side,k)],grid[(i+1,side,k+1)],grid[(i,side,k+1)]
                quad(*( (a,b,c,d) if side==1 else (d,c,b,a) ), i/(NS-1))
    for k in range(NP-1):                                         # transom
        a,b,c,d=grid[(0,-1,k)],grid[(0,1,k)],grid[(0,1,k+1)],grid[(0,-1,k+1)]; f=bm.faces.new((a[0],b[0],c[0],d[0]))
        for l,src in zip(f.loops,(a,b,c,d)): l[uv].uv=(l.vert.co.y/1.6,l.vert.co.z/1.6); c3=hcol(src[2],src[3],0); l[cl]=(c3[0]*0.9,c3[1]*0.9,c3[2]*0.9,1)
    bmesh.ops.recalc_face_normals(bm,faces=bm.faces[:]); hull=new('HullShell',bm,HULL); hull['keep']=1
    # deck
    def deckz(t): return sheer(t)-BW
    def deckw(t): zk,zs=keel(t),sheer(t); return max(0.05,hb(t)*g((deckz(t)-zk)/(zs-zk),t)-0.04)
    bm=bmesh.new(); uv=bm.loops.layers.uv.verify(); cl=bm.loops.layers.color.new('Col'); ND=90; rows=[]
    for i in range(ND+1):
        t=i/ND*0.985; rows.append((bm.verts.new((X(t),deckw(t),deckz(t))),bm.verts.new((X(t),-deckw(t),deckz(t)))))
    for i in range(ND):
        f=bm.faces.new((rows[i][1],rows[i+1][1],rows[i+1][0],rows[i][0]))
        for l in f.loops: l[uv].uv=(l.vert.co.x/2.0,l.vert.co.y/2.0); k=0.8+noise.noise(l.vert.co*0.8)*0.18; l[cl]=(k,k,k,1)
    bmesh.ops.recalc_face_normals(bm,faces=bm.faces[:]); dk=new('DeckPlanks',bm,DECK); dk['keep']=1
    for f in dk.data.polygons:
        if f.normal.z<0: f.flip()
    P=lambda t,y=0,dz=0: Vector((X(t),y,deckz(t)+dz))
    # rail caps along the bulwark, rudder, stem
    for side in (1,-1):
        for i in range(NS-1):
            t0,t1=i/(NS-1),(i+1)/(NS-1); a=Vector((X(t0),side*hb(t0)*g(1,t0),sheer(t0))); b=Vector((X(t1),side*hb(t1)*g(1,t1),sheer(t1)))
            if (b-a).length<1.6: spar('Rail',a,b,0.07,0.07,DARK,4)
    box('Rudder',0.9,0.14,Dr+1.2,(-L/2-0.42,0,(-Dr+1.2)/2),HULL); spar('Stem',(X(0.9),0,keel(0.9)-0.05),(L/2+0.12,0,sheer(1)+0.55),0.16,0.12,DARK,4)
    box('Keel',L*0.86,0.2,0.3,(-L*0.07,0,-Dr-0.1),HULL)
    def step(t,h):                                                 # bulkhead at a break in the deck
        box('Bulkhead',0.12,2*deckw(t),h,(X(t),0,deckz(t+0.03 if h<0 else t-0.03)+abs(h)/2),HULL,uvs=1.6)
        for y in (-deckw(t)+0.3,deckw(t)-0.3) if kind=='merchant' else (): box('Ladder',0.5,0.6,0.06,(X(t)+(0.3 if t<0.5 else -0.3),y,deckz(t)-0.6),DECK,(0,math.radians(50 if t<0.5 else -50),0))
        spar('BreakRail',P(t,-deckw(t),0.85 if t<0.5 else 0.85),P(t,deckw(t),0.85),0.05,0.05,DARK,4)
    def mast(t,H,r,rake=0.0,top=None,topmast=0,yards=(),name='Mast'):
        base=Vector((X(t),0,deckz(t)-0.4)); d=Vector((-math.sin(rake),0,math.cos(rake))); head=base+d*H
        spar(name,base,head,r,r*0.7,SPAR,10)
        tm=head
        if top:
            c=base+d*(H-1.4); bm=bmesh.new(); bmesh.ops.create_cone(bm,cap_ends=True,segments=14,radius1=top,radius2=top,depth=0.09); o=new('Top',bm,SPAR,Matrix.Translation(c)); o['uvs']=1.0
            for a in range(0,360,45): pass
        if topmast:
            tb=base+d*(H-1.6)+Vector((0.22,0,0)); tm=tb+d*topmast; spar(name+'Top',tb,tm,r*0.6,r*0.38,SPAR,8)
            if top:
                for side in (1,-1):
                    for dx in (-0.35,0,0.35): rope(base+d*(H-1.4)+Vector((dx,side*top*0.95,0.05)),tb+d*(topmast-0.6))
        for (h,w,sail) in yards:
            c=base+d*h+Vector((0.3,0,0)); spar('Yard',c+Vector((0,-w/2,0)),c+Vector((0,w/2,0)),0.09,0.09,SPAR,6)
            if sail: s=spar('Furled',c+Vector((0.02,-w*0.44,-0.02)),c+Vector((0.02,w*0.44,-0.02)),0.21,0.21,SAIL,8,lump=0.45)
            for side in (1,-1): rope(c+Vector((0,side*w/2,0)),base+d*min(H+topmast-0.3,h+w*0.32)+Vector((0.2,0,0)),0.012)
        return base,head,tm,d
    def shrouds(t,base,d,H,n,spread=0.5,top=None):
        for side in (1,-1):
            tops=base+d*(H-1.55); feet=[]
            for i in range(n):
                tt=t-(i*spread+0.2)/L; f=Vector((X(tt),side*(hb(tt)*g(1,tt)+0.12),sheer(tt)-0.05)); feet.append(f); rope(f,tops+Vector((0,side*0.12,0)),0.02)
            tt0,tt1=t-0.2/L,t-((n-1)*spread+0.2)/L; box('Channel',(n-1)*spread+0.6,0.3,0.06,(X((tt0+tt1)/2),side*(hb(t)*g(1,t)+0.05),sheer((tt0+tt1)/2)-0.12),DARK)
            a0,a1=feet[0],feet[-1]; hh=(tops-a0).length; k=0.5
            while k<hh-1.2:
                u=k/hh; rope(a0+(tops-a0)*u,a1+(tops-a1)*u,0.011); k+=0.42
    def cannon(t,side,ang=0):
        y=side*(deckw(t)-0.75); z=deckz(t); box('Carriage',1.0,0.5,0.28,(X(t),y,z+0.22),RED,(0,0,math.radians(90)))
        spar('Gun',(X(t),y-side*0.55,z+0.45),(X(t),y+side*0.85,z+0.45),0.13,0.09,IRON,8)
    def anchor(t,side):
        p=Vector((X(t),side*(hb(t)*g(1,t)+0.18),sheer(t)-0.7)); spar('AnchorShank',p,p+Vector((-1.9,0,-0.5)),0.05,0.05,IRON,5); box('AnchorStock',0.12,1.5,0.12,p+Vector((0,0,0.02)),SPAR)
        e=p+Vector((-1.9,0,-0.5))
        for s2 in (1,-1): spar('AnchorArm',e,e+Vector((0.45,0,s2*0.6)),0.05,0.03,IRON,5)
    def flag(p,h=1.0,w=1.7,lean=0.0):
        bm=bmesh.new(); uv=bm.loops.layers.uv.verify(); cl=bm.loops.layers.color.new('Col'); n=8; vs=[]
        for i in range(n+1):
            x=-w*i/n; y=math.sin(i*0.9)*0.08*i/n; zb=p.z-h-0.12*i/n; zt=p.z-0.1*i/n; vs.append((bm.verts.new((p.x+x+lean*(p.z-zb),p.y+y,zb)),bm.verts.new((p.x+x+lean*(p.z-zt),p.y+y,zt))))   # the hoist edge follows the leaning staff
        for i in range(n):
            f=bm.faces.new((vs[i][0],vs[i+1][0],vs[i+1][1],vs[i][1]))
            for l,(uu,vv) in zip(f.loops,((i/n,0),((i+1)/n,0),((i+1)/n,1),(i/n,1))): l[uv].uv=(uu,vv); l[cl]=(1,1,1,1)
        o=new('Ensign',bm,FLAG); o['keep']=1; o['noao']=1
    def hatch(t,w,l): box('Coaming',l,w,0.3,P(t,0,0.15),HULL); box('Grating',l-0.16,w-0.16,0.04,P(t,0,0.31),DARK)

    if kind=='merchant':
        step(0.28,1.25); step(0.81,-0.85)
        fb,fh,ft,fd=mast(0.80,14.5,0.3,0,top=0.95,topmast=8.0,yards=((9.3,12.0,1),(19.0,7.0,1)),name='ForeMast')
        mb,mh,mt,md=mast(0.50,16.5,0.34,0.02,top=1.05,topmast=9.0,yards=((10.2,13.5,1),(21.6,7.8,1)),name='MainMast')
        zb,zh,zt,zd=mast(0.19,11.5,0.24,0.04,top=0.75,topmast=4.5,yards=((14.2,4.6,1),),name='MizzenMast')
        shrouds(0.80,fb,fd,14.5,5); shrouds(0.50,mb,md,16.5,6); shrouds(0.19,zb,zd,11.5,4,0.45)
        ly0=zb+zd*7.2+Vector((-4.6,0.25,-3.6)); ly1=zb+zd*7.2+Vector((4.2,0.25,3.4)); spar('LateenYard',ly0,ly1,0.08,0.06,SPAR,6); spar('Furled',ly0+(ly1-ly0)*0.06+Vector((0,0,-0.05)),ly0+(ly1-ly0)*0.94+Vector((0,0,-0.05)),0.17,0.17,SAIL,8,lump=0.4)
        bs0=Vector((X(0.93),0,sheer(0.93)-0.3)); bs1=bs0+Vector((math.cos(0.5),0,math.sin(0.5)))*9.0; spar('Bowsprit',bs0,bs1,0.26,0.16,SPAR,8)
        sy=bs0+(bs1-bs0)*0.62+Vector((0,0,-0.35)); spar('SpritYard',sy+Vector((0,-3.6,0)),sy+Vector((0,3.6,0)),0.07,0.07,SPAR,6); spar('Furled',sy+Vector((0,-3.2,-0.03)),sy+Vector((0,3.2,-0.03)),0.16,0.16,SAIL,8,lump=0.4)
        spar('SpritTopmast',bs1+Vector((-0.3,0,0)),bs1+Vector((-0.3,0,3.4)),0.09,0.06,SPAR,6); bm=bmesh.new(); bmesh.ops.create_cone(bm,cap_ends=True,segments=10,radius1=0.38,radius2=0.38,depth=0.06); new('Top',bm,SPAR,Matrix.Translation(bs1+Vector((-0.3,0,1.5))))['uvs']=1.0
        rope(fh,bs0+(bs1-bs0)*0.75,0.03); rope(ft,bs1,0.02); rope(mh,fb+fd*2.0,0.035); rope(mt,fh,0.02); rope(zh,mb+md*3.0,0.025); rope(zt,mh,0.015)
        for side in (1,-1):
            rope(ft,Vector((X(0.70),side*hb(0.7),sheer(0.7))),0.016); rope(mt,Vector((X(0.38),side*hb(0.38),sheer(0.38))),0.016)
            anchor(0.9,side)
        hatch(0.62,2.2,2.6); hatch(0.40,1.8,1.8)
        bm=bmesh.new(); bmesh.ops.create_cone(bm,cap_ends=True,segments=10,radius1=0.5,radius2=0.36,depth=1.0); new('Capstan',bm,SPAR,Matrix.Translation(P(0.70,0,0.5)))['uvs']=1.0
        # great cabin: stern windows, taffrail and lantern
        zt0=sheer(0)-BW-1.9
        for y in (-1.5,-0.5,0.5,1.5):
            box('SternWindow',0.06,0.72,0.9,(-L/2-0.02,y,zt0+0.9),GLASS,uvs=0.5); box('SternFrame',0.1,0.08,1.0,(-L/2-0.03,y-0.42,zt0+0.9),OCHRE); 
        box('SternFrame',0.1,0.08,1.0,(-L/2-0.03,1.92,zt0+0.9),OCHRE)
        for dz in (0.38,1.42): box('SternFrame',0.1,4.0,0.09,(-L/2-0.03,0,zt0+dz),OCHRE)
        box('Taffrail',0.14,2*hb(0)*g(1,0)+0.1,0.16,(-L/2,0,sheer(0)+0.05),OCHRE)
        spar('LanternPost',(-L/2,0,sheer(0)),(-L/2-0.3,0,sheer(0)+1.3),0.04,0.04,IRON,5); box('Lantern',0.34,0.34,0.5,(-L/2-0.32,0,sheer(0)+1.55),OCHRE); box('LanternGlass',0.28,0.28,0.34,(-L/2-0.32,0,sheer(0)+1.55),GLASS,uvs=0.4)
        st0=Vector((-L/2+0.4,1.6,sheer(0.02))); spar('EnsignStaff',st0,st0+Vector((-1.2,0,4.6)),0.05,0.035,SPAR,5); flag(st0+Vector((-1.2,0,4.6))*0.985+Vector((-0.03,0,0)),1.5,2.5,lean=1.2/4.6)
        spar('Whipstaff',P(0.24,0,0),P(0.24,0,1.3),0.03,0.03,SPAR,5)
        # ship's boat stowed on the main hatch side
        for i,(yy,ss) in enumerate(((1.9,1),)):
            box('BoatHull',4.6,1.5,0.5,P(0.52,-2.1,0.45),HULL); box('BoatThwart',0.2,1.5,0.05,P(0.5,-2.1,0.66),DECK); box('BoatThwart',0.2,1.5,0.05,P(0.55,-2.1,0.66),DECK)
    else:
        step(0.25,0.5)
        rk=math.radians(4); mb,mh,mt,md=mast(0.58,13.5,0.22,rk,topmast=6.0,yards=((16.2,6.2,1),),name='Mast')
        shrouds(0.58,mb,md,13.5,4,0.45)
        gooseneck=mb+md*2.0; boom_end=gooseneck+Vector((-10.2,0,0.5)); spar('Boom',gooseneck,boom_end,0.1,0.07,SPAR,6)
        spar('Furled',gooseneck+Vector((-0.4,0,0.2)),boom_end+Vector((0.5,0,0.2)),0.24,0.2,SAIL,8,lump=0.4)
        spar('Gaff',gooseneck+Vector((-0.2,0,0.5)),gooseneck+Vector((-6.4,0,1.0)),0.07,0.05,SPAR,6)
        rope(boom_end,mb+md*12.0,0.014); rope(boom_end,Vector((-L/2+0.3,0,sheer(0)+0.1)),0.016)
        bs0=Vector((X(0.9),0,sheer(0.9)-0.15)); bs1=bs0+Vector((math.cos(0.2),0,math.sin(0.2)))*8.5; spar('Bowsprit',bs0,bs1,0.17,0.09,SPAR,7)
        rope(mb+md*12.2,bs1,0.022); rope(mt,bs1,0.014); rope(mb+md*11.5,Vector((X(0.985),0,sheer(0.985))),0.022)
        spar('Furled',mb+md*11.0+(bs1-(mb+md*11.0))*0.72,bs1+Vector((-0.4,0,0.05)),0.13,0.1,SAIL,6,lump=0.3)
        for side in (1,-1):
            rope(mt,Vector((X(0.40),side*hb(0.4),sheer(0.4))),0.014); rope(mh,Vector((X(0.30),side*hb(0.3),sheer(0.3))),0.014)
            for t in (0.36,0.46,0.68): cannon(t,side)
            for t in (0.30,0.74): spar('Swivel',Vector((X(t),side*hb(t)*g(1,t),sheer(t)+0.05)),Vector((X(t)+0.1,side*(hb(t)*g(1,t)+0.5),sheer(t)+0.42)),0.045,0.035,IRON,6)
        anchor(0.88,1); hatch(0.44,1.4,1.6); hatch(0.72,0.9,1.0)
        spar('Tiller',P(0.02,0,0.75),P(0.16,0,0.95),0.05,0.035,SPAR,5); box('Windlass',0.5,1.8,0.4,P(0.82,0,0.3),SPAR)
        st0=Vector((-L/2+0.3,0.9,sheer(0.02))); spar('EnsignStaff',st0,st0+Vector((-0.8,0,3.4)),0.04,0.03,SPAR,5); flag(st0+Vector((-0.8,0,3.4))*0.985+Vector((-0.025,0,0)),1.1,1.9,lean=0.8/3.4)
        for i in range(3): box('Cask',0.5,0.5,0.7,P(0.50+i*0.03,(-1.2,0.2,1.3)[i]*0.9,0.35),HULL)
    bpy.context.view_layer.update()
    # UVs + colour for the box/spar parts, then baked contact shadows
    for o in objs:
        if 'keep' in o.keys(): continue
        me=o.data; base=Vector(me.materials[0]['base']); sc=o.get('uvs',1.2); bm=bmesh.new(); bm.from_mesh(me); uv=bm.loops.layers.uv.verify(); cl=bm.loops.layers.color.new('Col')
        for f in bm.faces:
            n=f.normal; ax=max(range(3),key=lambda i:abs(n[i]))
            for l in f.loops:
                c=l.vert.co; u,v=((c.x,c.y) if ax==2 else (c.x,c.z) if ax==1 else (c.z,c.y)); l[uv].uv=(u/sc,v/sc)
                k=0.86+noise.noise((o.matrix_world@c)*0.9)*0.16; l[cl]=(base.x*k,base.y*k,base.z*k,1)
        bm.to_mesh(me); bm.free()
    V=[];Pp=[]
    for o in objs:
        if 'noao' in o.keys(): continue
        b=len(V); M=o.matrix_world; V+=[M@v.co for v in o.data.vertices]; Pp+=[[b+i for i in p.vertices] for p in o.data.polygons]
    tree=BVHTree.FromPolygons(V,Pp); rr=random.Random(4); dirs=[]
    while len(dirs)<12:
        dv=Vector((rr.uniform(-1,1),rr.uniform(-1,1),rr.uniform(0.1,1)))
        if 0.2<dv.length<1: dirs.append(dv.normalized())
    for o in objs:
        if 'noao' in o.keys(): continue
        me=o.data; M=o.matrix_world; R=M.to_3x3(); ca=me.color_attributes['Col'].data
        for p in me.polygons:
            n=(R@p.normal).normalized()
            if o.name.startswith('HullShell') and (M@p.center).z>0 and abs(n.z)<0.9 and False: pass
            q=n.to_track_quat('Z','Y')
            for li in p.loop_indices:
                w=M@me.vertices[me.loops[li].vertex_index].co; w=w+(M@p.center-w)*0.05+n*0.02
                hit=sum(1 for dv in dirs if tree.ray_cast(w,q@dv,1.2)[0] is not None)
                k=1-0.6*(hit/len(dirs)); c=ca[li].color; ca[li].color=(c[0]*k,c[1]*k,c[2]*k,1)
    root=bpy.data.objects.new('ship_'+kind,None); scol.objects.link(root); groups={}; tris=0
    for o in objs: groups.setdefault(o.data.materials[0].name,[]).append(o)
    for mn,grp in groups.items():
        with bpy.context.temp_override(active_object=grp[0],selected_editable_objects=grp,selected_objects=grp,object=grp[0]):
            if len(grp)>1: bpy.ops.object.join()
        o=grp[0]; o.name=kind+'_'+mn; ca=o.data.color_attributes; ca.active_color=ca['Col']; ca.render_color_index=list(ca.keys()).index('Col'); o.parent=root
        tris+=sum(len(p.vertices)-2 for p in o.data.polygons)
    print('SHIP',kind,'tris',tris)
    bpy.ops.export_scene.gltf(filepath=OUT+kind+'.glb',export_image_format='NONE',export_apply=True,export_vertex_color='NAME',export_vertex_color_name='Col')
    bpy.ops.wm.save_as_mainfile(filepath='/tmp/ship/'+kind+'.blend')
build(sys.argv[-1])
