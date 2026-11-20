"""The married system 'Atelier & Presse': refined printer's seal (sign of four), lockups. Writes ../haus.js"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from lettering import *
R = os.path.join(os.path.dirname(__file__), '..')
LG = json.loads(open(os.path.join(R, 'logos.js')).read().strip()[len('window.LOGOS='):].rstrip(';'))
def fit(p, x, y, w, h):
    b = p.bounds; s = min(w / (b[2] - b[0]), h / (b[3] - b[1])); q = move(p, 0, 0, s, s); bb = q.bounds
    return move(q, x + (w - (bb[2] - bb[0])) / 2 - bb[0], y + (h - (bb[3] - bb[1])) / 2 - bb[1])
def pack(parts, pad=.03):
    bs = [p.bounds for p, _ in parts]
    x0 = min(b[0] for b in bs); y0 = min(b[1] for b in bs); x1 = max(b[2] for b in bs); y1 = max(b[3] for b in bs)
    pd = max(x1 - x0, y1 - y0) * pad
    return dict(vb=[round(x0 - pd, 1), round(y0 - pd, 1), round(x1 - x0 + 2 * pd, 1), round(y1 - y0 + 2 * pd, 1)], parts=[[d(p), c] for p, c in parts])
W = 10  # one stroke weight for the whole seal
ring = D(ellipse(0, 0, 110, 110, 160), ellipse(0, 0, 110 - W, 110 - W, 160))
horizon = rect(-106, -W / 2, 212, W)
staff = rect(-W / 2, -212, W, 212)
four = U(stroke(line((0, -212), (-50, -158), (26, -158)), W, cap='butt', join='miter'))
frame = U(ring, horizon, staff, four)
J = grow(fit(outline("J", "LeMurmure.otf", 300)[0], -60, 16, 48, 62), 1.6)
Hh = grow(fit(outline("H", "LeMurmure.otf", 300)[0], 14, 16, 48, 62), 1.6)
v = fit(outline("v", "Unifraktur.ttf", 300)[0], -72, -70, 50, 50)
seal = U(frame, J, Hh, v)
num = fit(outline("3", "Compagnon-Roman.otf", 300)[0], 26, -62, 34, 44)
word_line = outline("JOEL VAN HEES", "LeMurmure.otf", 200, track=6)[0]
st = [outline(t, "LeMurmure.otf", 100)[0] for t in ("JOEL", "VAN", "HEES")]
def stack(width, x, ytop, gap):
    out = []; y = ytop
    for p in st:
        b = p.bounds; s = width / (b[2] - b[0]); q = move(p, x - b[0] * s, y - b[1] * s, s); out.append(q); y += (b[3] - b[1]) * s + gap
    return U(*out), y - gap
stk, ybot = stack(120, 150, -110, 8)
# scale stack to circle height (220)
b = stk.bounds; s = 220 / (b[3] - b[1]); stk = move(stk, 0, 0, s, s); b = stk.bounds; stk = move(stk, 150 - b[0], -110 - b[1])
wl = word_line; b = wl.bounds; s = 300 / (b[2] - b[0]); wl2 = move(wl, 0, 0, s, s); b = wl2.bounds; wl2 = move(wl2, -150 - b[0], 150 - b[1])
H = dict(
  seal=pack([(seal, "i")]),
  edition=pack([(seal, "i"), (num, "a")]),
  small=pack([(frame, "i")]),
  word=pack([(word_line, "i")]),
  stack=dict(vb=LG[0]['vb'], parts=LG[0]['parts']),
  lockup=pack([(seal, "i"), (stk, "i")]),
  lockupv=pack([(seal, "i"), (wl2, "i")]),
  signet=pack([(outline("JvH", "LeMurmure.otf", 300, track=-4)[0], "i")]),
  fraktur=pack([(outline("van Hees", "Unifraktur.ttf", 170)[0], "i"), (outline("JOEL", "SpaceMono-Bold.ttf", 26, 4, -150, track=14)[0], "i")]),
  frakJ=pack([(outline("J", "Unifraktur.ttf", 260)[0], "i")]),
  old=dict(vb=LG[21]['vb'], parts=LG[21]['parts']),
  raw=dict(frame=d(frame), J=d(J), H=d(Hh), v=d(v), num=d(num)))
open(os.path.join(R, 'haus.js'), 'w').write('window.HAUS=' + json.dumps(H, separators=(',', ':')) + ';\n')
print('haus.js', os.path.getsize(os.path.join(R, 'haus.js')) // 1024, 'KB', 'J', J.bounds, 'H', Hh.bounds, 'v', v.bounds)
