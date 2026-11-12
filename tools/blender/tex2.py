import numpy as np
from PIL import Image, ImageFilter
rng=np.random.default_rng(11); T='/tmp/build/tex/'
def tnoise(S,cells,seed):
    r=np.random.default_rng(seed).random((cells,cells)); r=np.pad(r,2,mode='wrap')
    k=S//cells; im=Image.fromarray((r*255).astype('uint8')).resize(((cells+4)*k,(cells+4)*k),Image.BICUBIC)
    return np.asarray(im).astype(float)[2*k:2*k+S,2*k:2*k+S]/255
def nrm(hm,s): 
    gx=(np.roll(hm,-1,1)-np.roll(hm,1,1))*s; gy=(np.roll(hm,-1,0)-np.roll(hm,1,0))*s
    l=np.sqrt(gx*gx+gy*gy+1); n=np.stack([-gx/l,gy/l,1/l],-1)
    return Image.fromarray(((n*0.5+0.5)*255).astype('uint8'))
def save(a,n): Image.fromarray(np.clip(a,0,255).astype('uint8')).save(T+n)
# weathered brick, English bond
S=1024; rows=12; rh=S//rows
col=np.zeros((S,S,3)); hm=np.zeros((S,S)); col[:]=np.array([186,178,160.])
for r in range(rows):
    hd=(r%2==1); n=8 if hd else 4; bw=S/n; off=bw/2 if hd else 0
    for i in range(n+1):
        m=int(rng.integers(4,8))
        base=np.array([172,92,58.])+rng.normal(0,1)*np.array([20,11,8]); k=rng.random(); h=1.0
        if k<0.08: base=base*0.8
        elif k>0.88: base=base*1.1+np.array([10,10,6])
        if rng.random()<0.07: h=0.55; base=base*0.8          # spalled face
        x0=int(i*bw-off)+m//2; x1=int((i+1)*bw-off)-m//2; y0=r*rh+m//2; y1=(r+1)*rh-m//2
        for xa,xb in ((x0,x1),(x0+S,x1+S),(x0-S,x1-S)):
            xa,xb=max(xa,0),min(xb,S)
            if xb>xa: col[y0:y1,xa:xb]=base; hm[y0:y1,xa:xb]=h
f=tnoise(S,256,1)-0.5; mid=tnoise(S,16,2)-0.5; big=tnoise(S,4,3)-0.5
col+=(f*34+mid*14)[...,None]
salt=np.clip((tnoise(S,8,4)-0.68)*6,0,1)[...,None]            # salt bloom from sea air
soot=np.clip((tnoise(S,32,5)-0.72)*5,0,1)[...,None]
hmb=np.asarray(Image.fromarray((hm*255).astype('uint8')).filter(ImageFilter.GaussianBlur(2.5))).astype(float)/255
save(col,'brick.png'); nrm(hmb+f*0.3+mid*0.3,3.5).save(T+'brick_n.png')
# weathered wooden shingles
S=512; R=8; th=S//R; col=np.zeros((S,S,3)); hm=np.zeros((S,S))
for r in range(R):
    x=-int(rng.integers(0,40))
    while x<S:
        w=int(rng.integers(44,96)); k=rng.random()
        base=np.array([112,100,86.])+rng.normal(0,1)*np.array([12,11,10])
        if k<0.2: base=np.array([148,144,136.])+rng.normal(0,6)       # sun-bleached silver
        elif k>0.85: base=base*0.6                                    # damp, dark
        xa,xb=max(x+1,0),min(x+w-1,S); drop=int(rng.integers(0,5))
        if xb>xa:
            ramp=np.linspace(0.5,1.05,th)[:,None]
            col[r*th:(r+1)*th,xa:xb]=base*ramp[...,None]; hm[r*th:(r+1)*th,xa:xb]=np.linspace(0,1,th)[:,None]
            col[(r+1)*th-2-drop:(r+1)*th,xa:xb]*=0.45
        x+=w
g=np.random.default_rng(8).random((S,S//96+1)); g=np.asarray(Image.fromarray((g*255).astype('uint8')).resize((S,S),Image.BICUBIC)).astype(float)/255-0.5
g2=np.random.default_rng(9).random((8,S)); g2=np.asarray(Image.fromarray((g2*255).astype('uint8')).resize((S,S),Image.BICUBIC)).astype(float)/255-0.5
col+=(g2*30)[...,None]+((tnoise(S,8,6)-0.5)*26)[...,None]
save(col,'shingle.png'); nrm(hm+g2*0.3,2.5).save(T+'shingle_n.png')
# sun-bleached planks
S=512; P=4; pw=S//P; col=np.zeros((S,S,3)); hm=np.ones((S,S))
for p in range(P):
    base=np.array([104,88,72.])+rng.normal(0,1)*np.array([10,9,8]); col[:,p*pw:(p+1)*pw]=base
    col[:,p*pw:p*pw+4]=base*0.3; hm[:,p*pw:p*pw+4]=0
col+=(g2*38)[...,None]+((tnoise(S,8,7)-0.5)*30)[...,None]
save(col,'wood.png'); nrm(hm+g2*0.35,2.2).save(T+'wood_n.png')
# stained limestone
S=256; a=tnoise(S,64,11)-0.5; b=tnoise(S,8,12)-0.5
save(np.array([170,164,148.])[None,None,:]+(a*22+b*40)[...,None],'stone.png'); nrm(a*0.7+b,1.8).save(T+'stone_n.png')
print('ok')
