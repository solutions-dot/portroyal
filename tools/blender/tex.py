import numpy as np
from PIL import Image, ImageFilter
rng=np.random.default_rng(7)
T='/tmp/build/tex/'
def noise(h,w,scale,seed):
    r=np.random.default_rng(seed)
    small=r.random((max(2,h//scale),max(2,w//scale)))
    im=Image.fromarray((small*255).astype('uint8')).resize((w,h),Image.BICUBIC)
    return np.asarray(im).astype(float)/255
def normal_from_height(hm,strength=2.0):
    gx=(np.roll(hm,-1,1)-np.roll(hm,1,1))*strength
    gy=(np.roll(hm,-1,0)-np.roll(hm,1,0))*strength
    nz=np.ones_like(hm); l=np.sqrt(gx*gx+gy*gy+1)
    n=np.stack([-gx/l,gy/l,nz/l],-1)
    return Image.fromarray(((n*0.5+0.5)*255).astype('uint8'))
def save(arr,name): Image.fromarray(np.clip(arr,0,255).astype('uint8')).save(T+name)

# --- brick, English bond: 4 stretchers wide, 12 courses high per tile
S=1024; rows=12; rh=S//rows; m=5
col=np.zeros((S,S,3)); hm=np.zeros((S,S))
mortar=np.array([186,176,158.])
col[:]=mortar
for r in range(rows):
    header=(r%2==1)
    n=8 if header else 4
    bw=S/n; off=bw/2 if header else 0
    for i in range(n+1):
        x0=int(i*bw-off)+m//2; x1=int((i+1)*bw-off)-m//2
        y0=r*rh+m//2; y1=(r+1)*rh-m//2
        base=np.array([150,72,52.])+rng.normal(0,1)*np.array([16,9,7])
        k=rng.random()
        if k<0.12: base=base*0.72            # over-fired dark bricks
        elif k>0.9: base=base*1.12+np.array([8,6,0])
        for xa,xb in ((x0,x1),(x0+S,x1+S),(x0-S,x1-S)):
            xa2,xb2=max(xa,0),min(xb,S)
            if xb2>xa2:
                col[y0:y1,xa2:xb2]=base; hm[y0:y1,xa2:xb2]=1
g=noise(S,S,4,1)-0.5; g2=noise(S,S,48,2)-0.5
col+= (g*26+g2*30)[...,None]
hmb=np.asarray(Image.fromarray((hm*255).astype('uint8')).filter(ImageFilter.GaussianBlur(2))).astype(float)/255
save(col,'brick.png'); normal_from_height(hmb+g*0.15,3.0).save(T+'brick_n.png')

# --- clay roof tiles: 6 columns x 8 rows
S=512; col=np.zeros((S,S,3)); hm=np.zeros((S,S)); R=8; C=6; th=S//R; tw=S/C
for r in range(R):
    off=tw/2 if r%2 else 0
    for i in range(C+1):
        base=np.array([168,84,52.])+rng.normal(0,1)*np.array([15,9,6])
        if rng.random()<0.15: base*=0.75
        x0=int(i*tw-off)+1; x1=int((i+1)*tw-off)-1
        for xa,xb in ((x0,x1),(x0-S,x1-S),(x0+S,x1+S)):
            xa2,xb2=max(xa,0),min(xb,S)
            if xb2>xa2:
                ramp=np.linspace(0.62,1.08,th)[:,None]      # top of tile sits under the course above
                col[r*th:(r+1)*th,xa2:xb2]=base*ramp[...,None]
                hm[r*th:(r+1)*th,xa2:xb2]=np.linspace(0,1,th)[:,None]
g=noise(S,S,3,3)-0.5
col+=(g*22)[...,None]
save(col,'tile.png'); normal_from_height(hm+g*0.1,2.5).save(T+'tile_n.png')

# --- wood planks (vertical), 4 planks per tile
S=512; col=np.zeros((S,S,3)); hm=np.ones((S,S)); P=4; pw=S//P
for p in range(P):
    base=np.array([92,62,40.])+rng.normal(0,1)*np.array([9,7,5])
    col[:,p*pw:(p+1)*pw]=base
    col[:,p*pw:p*pw+3]=base*0.35; hm[:,p*pw:p*pw+3]=0
r=np.random.default_rng(5).random((S//64,S))
grain=np.asarray(Image.fromarray((r*255).astype('uint8')).resize((S,S),Image.BICUBIC)).astype(float)/255-0.5
col+=(grain*34)[...,None]+((noise(S,S,40,9)-0.5)*20)[...,None]
save(col,'wood.png'); normal_from_height(hm+grain*0.25,2.0).save(T+'wood_n.png')

# --- limestone / plaster
S=256; g=noise(S,S,2,11)-0.5; g2=noise(S,S,32,12)-0.5
col=np.array([196,188,170.])[None,None,:]+(g*18+g2*22)[...,None]
save(col,'stone.png'); normal_from_height(g*0.6+g2,1.5).save(T+'stone_n.png')

# --- leaded glass, diamond quarries
S=512; yy,xx=np.mgrid[0:S,0:S]; n=4; p=S/n
a=((xx+yy)%p); b=((xx-yy)%p)
lead=(np.minimum(a,p-a)<3)|(np.minimum(b,p-b)<3)
cell=(np.floor((xx+yy)/p)*7+np.floor((xx-yy)/p)*13)%5
glass=np.array([38,52,56.])[None,None,:]+(cell[...,None]-2)*np.array([4,6,6.])
glass+=((noise(S,S,24,21)-0.5)*14)[...,None]
col=np.where(lead[...,None],np.array([70,72,74.]),glass)
save(col,'glass.png')
hm=np.asarray(Image.fromarray((lead*255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.5))).astype(float)/255
normal_from_height(hm,3.0).save(T+'glass_n.png')
print('textures done')
