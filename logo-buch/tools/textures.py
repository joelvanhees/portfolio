"""Procedural material scans: paper, kraft, black card, concrete, cotton. Writes ../tex/*.jpg"""
import numpy as np, os
from PIL import Image, ImageDraw, ImageFilter
rng = np.random.default_rng(7); N = 1024
OUT = os.path.join(os.path.dirname(__file__), '..', 'tex')
def fbm(n=N, octaves=6, base=4):
    out = np.zeros((n, n))
    for o in range(octaves):
        f = base * 2 ** o
        small = rng.random((f, f))
        img = Image.fromarray((small * 255).astype(np.uint8)).resize((n, n), Image.BICUBIC)
        out += np.asarray(img, float) / 255 / (1.7 ** o)
    out -= out.min(); return out / out.max()
def fibers(n, count, length, alpha, light=True, width=1):
    im = Image.new('L', (n, n), 0); dr = ImageDraw.Draw(im)
    for _ in range(count):
        x, y = rng.random(2) * n; a = rng.random() * np.pi; l = length * (.4 + rng.random())
        pts = [(x, y)]
        for k in range(6):
            a += rng.normal(0, .25); x += np.cos(a) * l / 6; y += np.sin(a) * l / 6; pts.append((x, y))
        dr.line(pts, fill=int(alpha * (.5 + rng.random() * .5)), width=width)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(.6)), float) / 255
def save(name, rgb):
    Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).save(os.path.join(OUT, name), quality=86, optimize=True)
def tint(lum, c, amt):
    return np.stack([lum * 0 + c[i] for i in range(3)], -1) + (lum[..., None] - .5) * amt
grain = rng.normal(0, 1, (N, N))
# paper: cool off-white cotton paper
cl = fbm(); fl = fibers(N, 2600, 26, 90); fd = fibers(N, 900, 18, 60)
lum = .5 + (cl - .5) * .5 + fl * .35 - fd * .3 + grain * .025
save('paper.jpg', tint(lum, (238, 237, 232), 26))
# kraft
cl = fbm(base=3); fl = fibers(N, 3800, 30, 120); fd = fibers(N, 2600, 24, 140)
lum = .5 + (cl - .5) * .7 + fl * .4 - fd * .45 + grain * .05
save('kraft.jpg', tint(lum, (186, 150, 108), 70))
# black card
cl = fbm(); fl = fibers(N, 2200, 24, 70)
lum = .5 + (cl - .5) * .5 + fl * .5 + grain * .04
save('black.jpg', tint(lum, (24, 24, 26), 22))
# concrete
cl = fbm(base=2, octaves=8); pits = (rng.random((N, N)) > .9975).astype(float)
pits = np.asarray(Image.fromarray((pits * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1)), float) / 255
lum = .5 + (cl - .5) * .9 - pits * .6 + grain * .06
save('concrete.jpg', tint(lum, (150, 150, 146), 90))
# cotton: dark jersey knit
y, x = np.mgrid[0:N, 0:N]
knit = (np.sin(x * 2 * np.pi / 6 + np.sin(y * 2 * np.pi / 10) * 1.2) * .5 + .5)
lum = .5 + (knit - .5) * .35 + (fbm(base=8) - .5) * .4 + grain * .08
save('cotton.jpg', tint(lum, (30, 32, 36), 40))
print(os.listdir(OUT))
