"""Makes the web copies of the PastPort - Jamaica logo that the menu uses.

    python3 -I tools/menu/make_logo_assets.py "pastport logo.png" menu

Needs Pillow and numpy. Reads the owner's original artwork and writes four files into menu/:
  pastport-logo.webp      1200 px wide, for the intro
  pastport-logo-sm.webp   420 px wide, for the menu header and the About page
  pastport-jamaica.webp   a mask that is solid only where the gold "Jamaica" script is, so the intro can cycle its colour
  pastport-icon.png       a 192 px tab icon
The empty edges are trimmed and 28 px of room is added all round, so glows never get clipped.

The mask: the thick gold strokes are the sure part (an "opening" removes thin lines). Thin dry-brush tips are then grown back
out from them, one pixel at a time, through gold pixels only. The gold edge lines round the letters are kept out, because they always
sit right against the cream letter fill and the script's tips never do. Check it by painting the script another colour and zooming in.
"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

src, out = sys.argv[1], sys.argv[2]
PAD = 28
im = Image.open(src).convert('RGBA')
a = np.array(im)
ys, xs = np.where(a[..., 3] > 8)
x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
canvas = Image.new('RGBA', (x1 - x0 + 2 * PAD, y1 - y0 + 2 * PAD), (0, 0, 0, 0))
canvas.paste(im.crop((x0, y0, x1, y1)), (PAD, PAD))
full = np.array(canvas)
H, W = full.shape[:2]
r, g, b, al = [full[..., i].astype(int) for i in range(4)]

gold = (al > 200) & (r > 200) & (g > 140) & (g < 215) & (b < 100)
goldish = (al > 100) & (r > 170) & (g > 100) & (b < 150)     # includes soft edge pixels, not the dark outline
cream = (al > 200) & (r > 225) & (g > 205) & (b > 140)        # the letters' fill and the stamp's paper
region = np.zeros((H, W), bool)
region[int(H * 0.60):, int(W * 0.33):] = True                 # the lower right, where the script is


def img(m):
    return Image.fromarray(m.astype(np.uint8) * 255)


def grow(m):  # one pixel in every direction
    o = m.copy()
    o[1:] |= m[:-1]; o[:-1] |= m[1:]; o[:, 1:] |= m[:, :-1]; o[:, :-1] |= m[:, 1:]
    o[1:, 1:] |= m[:-1, :-1]; o[:-1, :-1] |= m[1:, 1:]; o[1:, :-1] |= m[:-1, 1:]; o[:-1, 1:] |= m[1:, :-1]
    return o


near_cream = np.array(img(cream).filter(ImageFilter.MaxFilter(15))) > 0
cand = goldish & region & ~near_cream
cur = np.array(img(gold & region & ~near_cream).filter(ImageFilter.MinFilter(9)).filter(ImageFilter.MaxFilter(9))) > 0
for _ in range(70):
    cur = grow(cur) & cand
mask = grow(grow(cur)) & goldish & region & ~(np.array(img(cream).filter(ImageFilter.MaxFilter(5))) > 0)
mask_img = img(mask).filter(ImageFilter.GaussianBlur(0.8))


def save(image, name, **kw):
    image.save(os.path.join(out, name), **kw)
    print('wrote %-22s %5.0f KB' % (name, os.path.getsize(os.path.join(out, name)) / 1024))


big = canvas.resize((1200, round(1200 * H / W)), Image.LANCZOS)
save(big, 'pastport-logo.webp', quality=92, method=6)
save(canvas.resize((420, round(420 * H / W)), Image.LANCZOS), 'pastport-logo-sm.webp', quality=90, method=6)
m = Image.new('RGBA', big.size, (255, 255, 255, 0))
m.putalpha(mask_img.resize(big.size, Image.LANCZOS))
save(m, 'pastport-jamaica.webp', lossless=True, method=6)
icon = Image.new('RGBA', (192, 192), (0, 0, 0, 0))
ImageDraw.Draw(icon).rounded_rectangle((0, 0, 191, 191), 40, fill=(6, 40, 61, 255))
lg = canvas.resize((172, round(172 * H / W)), Image.LANCZOS)
icon.alpha_composite(lg, (10, (192 - lg.size[1]) // 2))
save(icon, 'pastport-icon.png', optimize=True)
print('logo aspect for the CSS: %d / %d' % big.size)
