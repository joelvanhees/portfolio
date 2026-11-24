"""Logo workshop: seals without staff ('van' above the horizon), ring-text stamps, one-line wordmarks. Writes ../logo.js"""
import json, math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from lettering import *
R = os.path.join(os.path.dirname(__file__), '..')
FR, CP, MU = "Unifraktur.ttf", "Compagnon-Roman.otf", "LeMurmure.otf"
def fit(p, x, y, w, h):
    b = p.bounds; s = min(w / (b[2] - b[0]), h / (b[3] - b[1])); q = move(p, 0, 0, s, s); bb = q.bounds
    return move(q, x + (w - (bb[2] - bb[0])) / 2 - bb[0], y + (h - (bb[3] - bb[1])) / 2 - bb[1])
def pack(parts, pad=.04):
    bs = [p.bounds for p, _ in parts]
    x0 = min(b[0] for b in bs); y0 = min(b[1] for b in bs); x1 = max(b[2] for b in bs); y1 = max(b[3] for b in bs)
    pd = max(x1 - x0, y1 - y0) * pad
    return dict(vb=[round(x0 - pd, 1), round(y0 - pd, 1), round(x1 - x0 + 2 * pd, 1), round(y1 - y0 + 2 * pd, 1)], parts=[[d(p), c] for p, c in parts])
def ring(r, w): return D(ellipse(0, 0, r, r, 200), ellipse(0, 0, r - w, r - w, 200))
def ringtext(text, r, size, start=0.0, spacing=0):
    gl, _ = glyph_paths(text, CP, size, track=spacing)
    out = []
    for g in gl:
        b = g.bounds
        if b[2] - b[0] < .5: continue
        cx = (b[0] + b[2]) / 2
        a = start + cx / r
        q = move(g, -cx, -r)                     # baseline sits on radius, glyph points outward
        out.append(move(q, rot=math.degrees(a), origin=(0, 0)))
    return U(*out)
def fill_ring(base, r, size):
    # repeat text and set tracking so it closes the circle exactly
    circ = 2 * math.pi * r
    _, w = outline(base, CP, size)
    n = max(1, round(circ / w))
    txt = base * n
    _, w2 = outline(txt, CP, size)
    gl, _ = glyph_paths(txt, CP, size)
    track = (circ - w2) / len(txt)
    return ringtext(txt, r, size, start=0, spacing=track)

W = 9
inner = ring(110, W); hz = rect(-104, -W / 2, 208, W)
van = fit(outline("van", FR, 300)[0], -62, -82, 124, 66)
JH_J = fit(outline("J", FR, 300)[0], -58, 16, 46, 66); JH_H = fit(outline("H", FR, 300)[0], 12, 16, 50, 66)
hees = fit(outline("Hees", FR, 300)[0], -70, 16, 140, 64)
s1 = U(inner, hz, van, JH_J, JH_H)
s2 = U(inner, hz, van, hees)
# stamp with ring text
outer = ring(158, 7); mid = ring(124, 3)
rt = fill_ring("ATELIER · PRESSE · DESIGN · CODE · KI · KUNST · ", 132, 17)
van3 = fit(outline("van", FR, 300)[0], -66, -86, 132, 70)
J3 = fit(outline("J", FR, 300)[0], -62, 14, 50, 72); H3 = fit(outline("H", FR, 300)[0], 12, 14, 54, 72)
hz3 = rect(-115, -3.5, 230, 7)
s3 = U(outer, mid, rt, hz3, van3, J3, H3)
vh = fit(outline("vH", FR, 300)[0], -80, -70, 160, 140)
s4 = U(outer, mid, rt, vh)
small = U(ring(110, 14), fit(outline("vH", FR, 300)[0], -74, -62, 148, 124))
# wordmarks
joel = outline("JOEL", CP, 40, track=22)[0]
vh_w = outline("van Hees", FR, 200)[0]; vb = vh_w.bounds
jb = joel.bounds; joel = move(joel, vb[0] + 8 - jb[0], vb[1] - 26 - jb[3])
w1 = U(joel, vh_w)
w2 = outline("Joel van Hees", FR, 200)[0]
w3 = outline("JOEL VAN HEES", MU, 200, track=6)[0]
# lockup: stamp left, wordmark right
wb = w1.bounds; sc = 300 / (wb[3] - wb[1]) * .62
w1l = move(w1, 0, 0, sc, sc); b = w1l.bounds; w1l = move(w1l, 200 - b[0], -(b[1] + b[3]) / 2)
L = dict(s1=pack([(s1, "i")]), s2=pack([(s2, "i")]), s3=pack([(s3, "i")]), s4=pack([(s4, "i")]), small=pack([(small, "i")]),
         w1=pack([(w1, "i")]), w2=pack([(w2, "i")]), w3=pack([(w3, "i")]), lock=pack([(s3, "i"), (w1l, "i")]))

# ── without Fraktur: classic printer's capitals (Caslon) and Le Murmure ──
CS = "LibreCaslonDisplay.ttf"
vanC = fit(outline("van", CS, 300)[0], -60, -84, 120, 62)
JC = fit(outline("J", CS, 300)[0], -56, 16, 42, 70); HC = fit(outline("H", CS, 300)[0], 10, 16, 52, 70)
s3c = U(outer, mid, rt, hz3, grow(vanC, 1.2), grow(JC, 1.2), grow(HC, 1.2))
vanM = fit(outline("VAN", MU, 300)[0], -58, -88, 116, 70)
JM = grow(fit(outline("J", MU, 300)[0], -52, 14, 40, 74), 1.6); HM = grow(fit(outline("H", MU, 300)[0], 12, 14, 44, 74), 1.6)
s3m = U(outer, mid, rt, hz3, grow(vanM, 1.2), JM, HM)
smallc = U(ring(110, 14), grow(fit(outline("vH", CS, 300)[0], -70, -56, 140, 112), 1.5))
vhc = outline("van Hees", CS, 200)[0]; vb2 = vhc.bounds
jc = outline("JOEL", CP, 40, track=22)[0]; jb2 = jc.bounds; jc = move(jc, vb2[0] + 6 - jb2[0], vb2[1] - 26 - jb2[3])
wc = U(jc, vhc)
wcb = wc.bounds; sc2 = 300 / (wcb[3] - wcb[1]) * .62
wcl = move(wc, 0, 0, sc2, sc2); b2 = wcl.bounds; wcl = move(wcl, 200 - b2[0], -(b2[1] + b2[3]) / 2)
L.update(s3c=pack([(s3c, "i")]), s3m=pack([(s3m, "i")]), smallc=pack([(smallc, "i")]), wc=pack([(wc, "i")]), lockc=pack([(s3c, "i"), (wcl, "i")]))

# ── Le Murmure: two-line wordmark (short over long, like the covers) ──
l1 = outline("JOEL", MU, 200, track=4)[0]; l2 = outline("VAN HEES", MU, 200, track=4)[0]
b1 = l1.bounds; b2 = l2.bounds; capH = b2[3] - b2[1]
l1 = move(l1, -b1[0], -b1[1]); l2 = move(l2, -b2[0], capH * 1.045 - b2[1])
# optical alignment: J stem (not its tail) flush with the top-left of V
def left_at(p, y0, y1):
    q = I(p, rect(-1e4, y0, 2e4, y1 - y0)); return q.bounds[0]
jb_ = l1.bounds; jh = jb_[3] - jb_[1]
j_stem = left_at(glyph_paths("J", MU, 200)[0][0] if False else l1, jb_[1] + jh * .15, jb_[1] + jh * .45)
vb_ = l2.bounds; vh_ = vb_[3] - vb_[1]
v_top = left_at(l2, vb_[1] + vh_ * .12, vb_[1] + vh_ * .18)  # perceived edge of the V's thick stroke
l1 = move(l1, v_top - j_stem, 0)
# keep the J tail clear of the second line
# tight leading as on the covers; the J keeps its full tail and passes in front of the V (V gets a hairline gap)
l2k = D(l2, grow(l1, 4))
wm2u = U(l1, l2)            # variant: J flows into the V (ligature)
print('J stem shift', round(v_top - j_stem, 1))
wm2 = U(l1, l2)   # J flows into the V
wm2k = U(l1, l2k)
sJ = outline("JvH", MU, 300, track=-4)[0]
smallm = U(ring(110, 14), grow(fit(sJ, -60, -66, 120, 132), 1.5))
wb3 = wm2.bounds; sc3 = 300 / (wb3[3] - wb3[1]) * .78
wml = move(wm2, 0, 0, sc3, sc3); b3 = wml.bounds; wml = move(wml, 196 - b3[0], -(b3[1] + b3[3]) / 2)
L.update(wm2k=pack([(wm2k, "i")]), wm2=pack([(wm2, "i")]), smallm=pack([(smallm, "i")]), lockm=pack([(s3m, "i"), (wml, "i")]))

# ── simple seal, no ring text: VAN over the horizon, HEES below (Le Murmure) ──
vanS = grow(fit(outline("VAN", MU, 300)[0], -44, -74, 88, 56), 1.3)
heesS = grow(fit(outline("HEES", MU, 300)[0], -54, 18, 108, 56), 1.3)
s2m = U(ring(110, W), hz, vanS, heesS)
wb4 = wm2.bounds; sc4 = 220 / (wb4[3] - wb4[1]) * .9
wml2 = move(wm2, 0, 0, sc4, sc4); b4 = wml2.bounds; wml2 = move(wml2, 150 - b4[0], -(b4[1] + b4[3]) / 2)
L.update(s2m=pack([(s2m, "i")]), lockm=pack([(s2m, "i"), (wml2, "i")]))

# ── design-system exports: plain JvH monogram + construction metrics of the two-line wordmark ──
jvh = outline("JvH", MU, 300, track=-4)[0]
L.update(jvh=pack([(jvh, "i")]),
         meta=dict(capH=round(capH, 2), l2top=round(l2.bounds[1], 2), axis=round(v_top, 2), b=[round(v, 2) for v in wm2.bounds]))

open(os.path.join(R, 'logo.js'), 'w').write('window.LOGO=' + json.dumps(L, separators=(',', ':')) + ';\n')
print('logo.js', os.path.getsize(os.path.join(R, 'logo.js')) // 1024, 'KB')
