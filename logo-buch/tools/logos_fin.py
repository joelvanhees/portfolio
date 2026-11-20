"""Lockup families for the 9 finalists: primary (from logos.js), secondary (horizontal) and signet.
Writes ../fin.js.   Run: FONTDIR=<fonts> python3 logos_fin.py"""
import json, math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from lettering import *

R = os.path.join(os.path.dirname(__file__), '..')
LG = json.loads(open(os.path.join(R, 'logos.js')).read().strip()[len('window.LOGOS='):].rstrip(';'))

def pack(parts):
    ps = [(p, c) for p, c in parts if p is not None]
    bs = [p.bounds for p, _ in ps]
    x0 = min(b[0] for b in bs); y0 = min(b[1] for b in bs); x1 = max(b[2] for b in bs); y1 = max(b[3] for b in bs)
    pad = max(x1 - x0, y1 - y0) * .03
    return dict(vb=[round(x0 - pad, 1), round(y0 - pad, 1), round(x1 - x0 + 2 * pad, 1), round(y1 - y0 + 2 * pad, 1)],
                parts=[[d(p), c] for p, c in ps])
def prim(i): l = LG[i]; return dict(vb=l['vb'], parts=l['parts'])
def at0(p, x=0, y=0): b = p.bounds; return move(p, x - b[0], y - b[1])
def stripes(p, n=8, k=1.18):
    b = p.bounds; h = b[3] - b[1]; band = h / (n * 2 - 1)
    return I(p, U(*[rect(b[0] - 5, b[1] + i * 2 * band, b[2] - b[0] + 10, band * k) for i in range(n)]))
def stencil(glyphs, counters, hbars=()):
    out = []
    for i, g in enumerate(glyphs):
        b = g.bounds
        if b[2] - b[0] < 1: continue
        cut = 9 * (b[3] - b[1]) / 140
        if i in counters:
            cx = (b[0] + b[2]) / 2; g = D(g, rect(cx - cut / 2, b[1] - 5, cut, b[3] - b[1] + 10))
        if i in hbars:
            g = D(g, rect(b[0] + (b[2] - b[0]) * .3, b[1] - 5, cut, b[3] - b[1] + 10), rect(b[0] + (b[2] - b[0]) * .66, b[1] - 5, cut, b[3] - b[1] + 10))
        out.append(g)
    return U(*out)

F = {}
# 01 Le Murmure
F['murmure'] = dict(
    primary=prim(0),
    secondary=pack([(outline("JOEL VAN HEES", "LeMurmure.otf", 200, track=6)[0], "i")]),
    signet=pack([(outline("JvH", "LeMurmure.otf", 300, track=-4)[0], "i")]))
# 05 Fraktur
F['fraktur'] = dict(
    primary=prim(4),
    secondary=pack([(outline("Joel van Hees", "Unifraktur.ttf", 150)[0], "i")]),
    signet=pack([(outline("J", "Unifraktur.ttf", 260)[0], "i")]))
# 08 Trickster
F['trickster'] = dict(
    primary=prim(7),
    secondary=pack([(outline("Joel van Hees", "Trickster.otf", 150)[0], "i")]),
    signet=pack([(outline("vH", "Trickster.otf", 280)[0], "i")]))
# 16 Streifen
AX = {"wdth": 125, "wght": 900}
F['streifen'] = dict(
    primary=prim(15),
    secondary=pack([(stripes(outline("JOEL VAN HEES", "Archivo.ttf", 120, var=AX, track=2)[0], n=6), "i")]),
    signet=pack([(stripes(outline("J", "Archivo.ttf", 260, var=AX)[0]), "i")]))
# 18 Vignelli
VA = {"wdth": 100, "wght": 560}
sq = rect(0, 0, 300, 300); j = outline("j", "Archivo.ttf", 150, 26, 270, var=VA)[0]
F['vignelli'] = dict(
    primary=prim(17),
    secondary=pack([(rect(0, -96, 28, 28), "a"), (outline("joel van hees", "Archivo.ttf", 100, 44, 0, var=VA, track=-3)[0], "i")]),
    signet=pack([(D(sq, j), "i")]))
# 24 Schreibmaschine
g, w = glyph_paths("jvh", "Compagnon-Roman.otf", 220)
vb_ = g[1].bounds
F['schreibmaschine'] = dict(
    primary=prim(23),
    secondary=pack([(outline("joel van hees", "Compagnon-Roman.otf", 90, track=-4)[0], "i"),
                    (rect(glyph_paths("joel van hees", "Compagnon-Roman.otf", 90, track=-4)[0][5].bounds[0] - 6, -34, glyph_paths("joel van hees", "Compagnon-Roman.otf", 90, track=-4)[0][7].bounds[2] - glyph_paths("joel van hees", "Compagnon-Roman.otf", 90, track=-4)[0][5].bounds[0] + 12, 6), "a")]),
    signet=pack([(U(*g), "i"), (rect(vb_[0] - 10, (vb_[1] + vb_[3]) / 2 - 5, vb_[2] - vb_[0] + 20, 10), "a")]))
# 25 Schablone
gl, _ = glyph_paths("JOEL VAN HEES", "Avara-Black.otf", 150, track=4)
hg, _ = glyph_paths("H", "Avara-Black.otf", 300)
F['schablone'] = dict(
    primary=prim(24),
    secondary=pack([(stencil(gl, counters=(1, 6), hbars=(9,)), "i")]),
    signet=pack([(stencil(hg, counters=(), hbars=(0,)), "i")]))
# 28 Konstrukt
kp = LG[27]
kw = outline("JOEL", "Syne.ttf", 120, 0, 0, var={"wght": 800}, track=-2)[0]
kw2 = outline("VAN HEES", "Syne.ttf", 120, 0, 112, var={"wght": 800}, track=-2)[0]
F['konstrukt'] = dict(primary=prim(27), secondary=None, signet=None, word=pack([(kw, "i"), (kw2, "i")]))
# 33 Tempo
p, w = outline("JOEL VAN HEES", "Lack-Italic.otf", 120)
pb = p.bounds; hgt = pb[3] - pb[1]
lines = U(*[poly([(pb[0] - 190 + i * 30 + 14, pb[1] + hgt * (.16 + i * .26)), (pb[0] - 10 + 14, pb[1] + hgt * (.16 + i * .26)), (pb[0] - 10, pb[1] + hgt * (.16 + i * .26) + hgt * .13), (pb[0] - 190 + i * 30, pb[1] + hgt * (.16 + i * .26) + hgt * .13)]) for i in range(3)])
s, sw = outline("vh", "Lack-Italic.otf", 260)
sb = s.bounds; sh = sb[3] - sb[1]
sl = U(*[poly([(sb[0] - 150 + i * 26 + 18, sb[1] + sh * (.18 + i * .26)), (sb[0] - 12 + 18, sb[1] + sh * (.18 + i * .26)), (sb[0] - 12, sb[1] + sh * (.18 + i * .26) + sh * .13), (sb[0] - 150 + i * 26, sb[1] + sh * (.18 + i * .26) + sh * .13)]) for i in range(3)])
F['tempo'] = dict(primary=prim(32), secondary=pack([(p, "i"), (lines, "i")]), signet=pack([(s, "i"), (sl, "i")]))

open(os.path.join(R, 'fin.js'), 'w').write('window.FIN=' + json.dumps(F, separators=(',', ':')) + ';\n')
print('fin.js', os.path.getsize(os.path.join(R, 'fin.js')) // 1024, 'KB')
