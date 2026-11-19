"""Builds all 33 marks as pure vector paths and writes ../logos.js.
Run:  FONTDIR=<fonts> python3 logos.py"""
import json, math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from lettering import *

L = []
def add(t, n, ref, f, mat, parts, accent=None, extra=None):
    ps = [(p, c) for p, c in parts if p is not None]
    xs = [p.bounds for p, _ in ps]
    x0 = min(b[0] for b in xs); y0 = min(b[1] for b in xs); x1 = max(b[2] for b in xs); y1 = max(b[3] for b in xs)
    pad = max(x1 - x0, y1 - y0) * .035
    L.append(dict(t=t, n=n, ref=ref, f=f, mat=mat, accent=accent,
                  vb=[round(x0 - pad, 1), round(y0 - pad, 1), round(x1 - x0 + 2 * pad, 1), round(y1 - y0 + 2 * pad, 1)],
                  parts=[[d(p), c] for p, c in ps], extra=extra))

def at0(p, x=0, y=0):
    b = p.bounds; return move(p, x - b[0], y - b[1])
def fit(p, x, y, w, h, keep=True):
    b = p.bounds; sx = w / (b[2] - b[0]); sy = h / (b[3] - b[1])
    if keep: sx = sy = min(sx, sy)
    q = move(p, 0, 0, sx, sy); bb = q.bounds
    return move(q, x + (w - (bb[2] - bb[0])) / 2 - bb[0], y + (h - (bb[3] - bb[1])) / 2 - bb[1])
def W(p): b = p.bounds; return b[2] - b[0]
def H(p): b = p.bounds; return b[3] - b[1]
def centerx(p, cx): b = p.bounds; return move(p, cx - (b[0] + b[2]) / 2, 0)

# 01 ── Le Murmure, justified stack ──────────────────────────────
def stackjust(lines, font, width, gap, var=()):
    out = []; y = 0
    for t in lines:
        p, _ = outline(t, font, 100, 0, 0, var)
        b = p.bounds; s = width / (b[2] - b[0])
        q = move(p, -b[0] * s, -b[1] * s + y, s); out.append(q); y += (b[3] - b[1]) * s + gap
    return U(*out)
add("Le Murmure", "Drei Zeilen, auf eine Breite justiert. Hochformatig wie ein Modeplakat, dabei ganz ruhig.",
    "Pariser Mode- und Theaterplakate", "Le Murmure · Velvetyne", "print",
    [(stackjust(["JOEL", "VAN", "HEES"], "LeMurmure.otf", 300, 10), "i")])

# 02 ── Cantique with hairline descender ─────────────────────────
p, w = outline("Joel van Hees", "Cantique.otf", 120, 0, 0)
gl, _ = glyph_paths("Joel van Hees", "Cantique.otf", 120, 0, 0)
jb = gl[0].bounds
y = 30
hair = poly([(jb[0] + 18, y - 1.4), (w + 6, y - .25), (w + 6, y + .25), (jb[0] + 18, y + 1.4)])
add("Cantique", "Das lange J der Cantique läuft als Haarlinie unter dem ganzen Namen weiter.",
    "Couture-Etiketten, Didone-Luxus", "Cantique · Velvetyne", "foil",
    [(U(p, hair), "i")])

# 03 ── Interlope signature ──────────────────────────────────────
p, w = outline("Joel van Hees", "Interlope.otf", 130, 0, 0)
add("Signatur", "Kalligrafische Kursive mit echten Schwüngen. Als Prägung auf Karton fühlt sie sich nach Atelier an.",
    "Couture-Signaturen der 50er", "Interlope · Velvetyne", "press", [(p, "i")])

# 04 ── Cassandre-style woven vertical monogram ──────────────────
F = "Avara-Black.otf"
J = outline("J", F, 300)[0]; V = outline("V", F, 300)[0]; Hh = outline("H", F, 300)[0]
J = centerx(at0(J, 0, 0), -22); V = centerx(at0(V, 0, 118), 10); Hh = centerx(at0(Hh, 0, 250), -4)
V = D(V, grow(J, 7)); J = J
Hh2 = D(Hh, grow(V, 7))
add("Cassandre-Monogramm", "J, V und H senkrecht verflochten. Die Buchstaben liegen übereinander, getrennt durch eine feine Lücke.",
    "A. M. Cassandre, YSL-Monogramm 1961", "Avara Black, verflochten", "foil",
    [(U(J, V, Hh2), "i")])

# 05 ── Fraktur ──────────────────────────────────────────────────
p, w = outline("van Hees", "Unifraktur.ttf", 170, 0, 0)
sub, sw = outline("JOEL", "SpaceMono-Bold.ttf", 26, 4, -150, track=14)
add("Fraktur", "Gebrochene Schrift mit einer harten Mono-Zeile dazu. Kunst, Tattoo und Streetwear in einem.",
    "Blackletter in Streetwear und Tattoo-Kultur", "UnifrakturMaguntia · Space Mono", "tee",
    [(p, "i"), (sub, "i")])

# 06 ── Hanko seal ───────────────────────────────────────────────
G = ("GrenzeGotisch.ttf", {"wght": 800})
sq = rect(0, 0, 300, 300)
ring = D(rect(14, 14, 272, 272), rect(22, 22, 256, 256))
j = fit(outline("J", G[0], 200, var=G[1])[0], 34, 34, 104, 232, keep=False)
v = fit(outline("V", G[0], 200, var=G[1])[0], 156, 34, 110, 104, keep=False)
h = fit(outline("H", G[0], 200, var=G[1])[0], 156, 158, 110, 108, keep=False)
add("Hanko", "Ein Namenssiegel, das die Fläche ganz füllt. Rot auf Papier, die Signatur auf jedem Kunstdruck.",
    "Japanische Hanko-Siegel", "Grenze Gotisch, gestaucht", "stamp",
    [(D(sq, ring, j, v, h), "a")], accent="#C4302B")

# 07 ── Ouroboros ────────────────────────────────────────────────
p, w = outline("Joel", "Ouroboros.otf", 240, 0, 0)
add("Ouroboros", "Fett, rund, ein bisschen psychedelisch. Riso in zwei Farben, leicht verschoben.",
    "Fillmore-Konzertplakate 1967", "Ouroboros · Velvetyne", "riso", [(p, "i")], accent="#FF4F7B")

# 08 ── Trickster ────────────────────────────────────────────────
p, w = outline("van Hees", "Trickster.otf", 170, 0, 0)
add("Trickster", "Kanten wie mit dem Cutter geschnitten. Klingt nach Plattenlabel und Siebdruckwerkstatt.",
    "Independent-Plattenlabels", "Trickster · Velvetyne", "riso", [(p, "i")], accent="#2F6BFF")

# 09 ── Basteleur ────────────────────────────────────────────────
a = centerx(outline("Joel", "Basteleur-Bold.otf", 210, 0, 0)[0], 0)
b = centerx(outline("van Hees", "Basteleur-Bold.otf", 96, 0, 110)[0], 0)
add("Basteleur", "Weiche Serifen mit Jugendstil-Anklang. Auf Karton geprägt wirkt es wie ein altes Ladenschild.",
    "Jugendstil-Ladenschilder", "Basteleur Bold · Velvetyne", "press", [(U(a, b), "i")])

# 10 ── Avara italic ─────────────────────────────────────────────
a, aw = outline("Joel", "Avara-BoldItalic.otf", 260, 0, 0)
b, bw = outline("van Hees", "Avara-BoldItalic.otf", 58, aw - 250, 62)
add("Avara", "Scharfe Kursive, der Nachname sitzt klein unter dem Bogen. Wie der Titel eines Kunstmagazins.",
    "Unabhängige Kunstmagazine", "Avara Bold Italic · Velvetyne", "print", [(a, "i"), (b, "i")])

# 11 ── Departure Mono pixel ─────────────────────────────────────
a, aw = outline("JVH", "DepartureMono.otf", 240, 0, 0)
ab = a.bounds
cur = rect(aw + 14, ab[1], 58, ab[3] - ab[1])
sub, _ = outline("joel van hees", "DepartureMono.otf", 30, 0, 64)
add("Pixel", "Bitmap-Buchstaben aus echtem Pixelraster, der Cursor blinkt mit. Stark als Favicon und Patch.",
    "Susan Kare, Macintosh 1984", "Departure Mono", "screen", [(a, "i"), (cur, "a"), (sub, "i")], accent="#3DFF8A")

# 12 ── Sligoil between rules ────────────────────────────────────
p, w = outline("joel van hees", "SligoilVF.ttf", 110, 0, 0, var={"wght": 120}, track=-3)
pb = p.bounds
r1 = rect(pb[0], pb[1] - 34, w, 12); r2 = rect(pb[0], pb[3] + 22, w, 12)
add("Sligoil", "Kleinbuchstaben zwischen zwei schweren Linien. Sachlich, aber mit eigenwilligen Rundungen.",
    "Experimental Jetset, Amsterdam", "Sligoil · Velvetyne", "print", [(U(p, r1, r2), "i")])

# 13 ── Six Caps in a bar ────────────────────────────────────────
p, w = outline("JOEL VAN HEES", "SixCaps.ttf", 260, 0, 0, track=4)
pb = p.bounds
bar = rect(pb[0] - 26, pb[1] - 26, (pb[2] - pb[0]) + 52, (pb[3] - pb[1]) + 52)
add("Six Caps", "Extrem schmale Versalien, negativ aus einem Balken geschnitten. Für Plakate, Banner, Tapes.",
    "Schweizer Konzertplakate", "Six Caps", "print", [(D(bar, p), "i")])

# 14 ── New Alphabet construction ────────────────────────────────
s = 20
def crou(*pts): return stroke(line(*pts), s, cap='butt', join='miter')
jj = crou((60, 0), (60, 120), (40, 140), (0, 140))
vv = U(crou((100, 0), (100, 110), (130, 140)), crou((130, 140), (160, 110), (160, 0)))
hh = U(crou((200, 0), (200, 150)), crou((260, 0), (260, 150)), crou((200, 75), (260, 75)))
add("New Alphabet", "Nur Senkrechte, Waagerechte und 45°-Ecken. Ein Zeichen, gebaut für Bildschirme.",
    "Wim Crouwel, New Alphabet 1967", "Eigenkonstruktion, Raster 20", "screen", [(U(jj, vv, hh), "i")], accent="#3DFF8A")

# 15 ── Mona Sans ultra wide ─────────────────────────────────────
p, w = outline("VAN HEES", "MonaSans.ttf", 120, 0, 0, var={"wdth": 125, "wght": 900}, track=-2)
j, _ = outline("JOEL", "MonaSans.ttf", 22, 2, -112, var={"wdth": 125, "wght": 700}, track=8)
add("Breitbild", "Maximal breite Grotesk, knapp gesetzt. Klingt nach Studio, Motorsport und Tech.",
    "Eurostile und Breitband-Grotesk der 60er", "Mona Sans, wdth 125 / wght 900", "print", [(p, "i"), (j, "i")])

# 16 ── IBM stripes ──────────────────────────────────────────────
p, w = outline("JVH", "Archivo.ttf", 240, 0, 0, var={"wdth": 125, "wght": 900}, track=6)
pb = p.bounds; n = 8; hgt = pb[3] - pb[1]; band = hgt / (n * 2 - 1)
stripes = U(*[rect(pb[0] - 5, pb[1] + i * 2 * band, w + 10, band * 1.18) for i in range(n)])
add("Streifen", "Acht Linien schneiden die Buchstaben. Liest sich auf Distanz als Fläche, aus der Nähe als Raster.",
    "Paul Rand, IBM 1972", "Archivo Expanded Black, 8 Streifen", "riso", [(I(p, stripes), "i")], accent="#2047E0")

# 17 ── Saul Bass cut paper ──────────────────────────────────────
gl, w = glyph_paths("Joel", "Archivo.ttf", 230, 0, 0, var={"wdth": 88, "wght": 850})
rots = [-6, 4, -3, 7]; dy = [0, -10, 6, -4]
letters = [move(g, 0, dy[i], rot=rots[i], origin=((g.bounds[0] + g.bounds[2]) / 2, -80)) for i, g in enumerate(gl)]
lt = U(*letters); lb = lt.bounds
slab = poly([(lb[0] - 40, lb[1] - 30), (lb[2] + 30, lb[1] - 46), (lb[2] + 46, lb[3] + 28), (lb[0] - 26, lb[3] + 40)])
add("Scherenschnitt", "Von Hand geschnittene Buchstaben, jeder leicht verdreht. Raue Kante wie Papier.",
    "Saul Bass, Filmtitel der 50er", "Archivo, geschnitten und rotiert", "print",
    [(D(slab, lt), "r")])

# 18 ── Vignelli box ─────────────────────────────────────────────
VA = {"wdth": 100, "wght": 560}
box = rect(0, 0, 300, 300)
t1, _ = outline("joel", "Archivo.ttf", 64, 22, 168, var=VA, track=-2)
t2, _ = outline("van", "Archivo.ttf", 64, 22, 222, var=VA, track=-2)
t3, _ = outline("hees", "Archivo.ttf", 64, 22, 276, var=VA, track=-2)
add("Vignelli", "Ein schwarzes Quadrat, drei Wörter klein unten links. Diszipliniert und unverwechselbar.",
    "Massimo Vignelli, Knoll 1966", "Archivo Medium", "print", [(D(box, t1, t2, t3), "i")])

# 19 ── CBS eye in Joel ──────────────────────────────────────────
gl, w = glyph_paths("Joel", "Archivo.ttf", 220, 0, 0, var={"wdth": 100, "wght": 760})
ob = gl[1].bounds; cx = (ob[0] + ob[2]) / 2; cy = (ob[1] + ob[3]) / 2
R = (ob[3] - ob[1]) * 1.05; ew = (ob[2] - ob[0]) * 1.5
c1 = ellipse(cx, cy + R * .55, R * 1.05, R * 1.05); c2 = ellipse(cx, cy - R * .55, R * 1.05, R * 1.05)
alm = I(c1, c2); alm = fit(alm, cx - ew / 2, cy - R * .36, ew, R * .72, keep=False)
ringE = D(alm, fit(alm, cx - ew / 2 + 11, cy - R * .36 + 8, ew - 22, R * .72 - 16, keep=False))
iris = ellipse(cx, cy, R * .27, R * .27)
eye = U(ringE, D(iris, ellipse(cx, cy, R * .13, R * .13)), ellipse(cx, cy, R * .07, R * .07))
shift = (ew - (ob[2] - ob[0])) / 2
add("Auge", "Das o in Joel ist ein Auge. Nimmt deine Augen-Skulpturen auf und liest sich trotzdem als Name.",
    "William Golden, CBS-Auge 1951", "Archivo Bold, Auge konstruiert", "print",
    [(U(move(gl[0], -shift), eye, move(gl[2], shift), move(gl[3], shift)), "i")])

# 20 ── Lubalin ligature ─────────────────────────────────────────
LV = {"wght": 1100}
gl, w = glyph_paths("JvH", "LinealVF.ttf", 260, 0, 0, var=LV)
jj, vv, hh = gl
vv = move(vv, -46); hh = move(hh, -70)
add("Ligatur", "J, v und H rücken zusammen, bis sie sich berühren. Eine geschlossene Form, gebaut wie ein Zeichen.",
    "Herb Lubalin, Avant Garde 1968", "Lineal Heavy · Velvetyne, unterschnitten", "press", [(U(jj, vv, hh), "i")])

# 21 ── Saville caps ─────────────────────────────────────────────
a, aw = outline("JOEL VAN HEES", "LibreCaslonDisplay.ttf", 72, 0, 0, track=16)
b, bw = outline("DESIGN  ·  CODE  ·  KI  ·  KUNST", "LibreCaslonDisplay.ttf", 17, 0, 46, track=6)
b = move(b, (aw - bw) / 2)
add("Versalien", "Klassische Antiqua, weit gesperrt, sonst nichts. Wirkt teuer, weil es so wenig macht.",
    "Peter Saville, Burberry 2018", "Libre Caslon Display", "press", [(a, "i"), (b, "i")])

# 22 ── Printer's mark ───────────────────────────────────────────
ringC = D(ellipse(0, 0, 110, 110), ellipse(0, 0, 101, 101))
cross = U(rect(-104, -4, 208, 8), rect(-4, -190, 8, 190), rect(-34, -162, 68, 8), stroke(line((-4, -190), (30, -212), (46, -196)), 8, cap='butt'))
j = fit(outline("J", "IMFell.ttf", 120)[0], -80, 16, 60, 74)
h = fit(outline("H", "IMFell.ttf", 120)[0], 16, 16, 66, 70)
v = fit(outline("v", "IMFellItalic.ttf", 120)[0], -84, -82, 62, 58)
hs = fit(outline("1670", "IMFell.ttf", 120)[0], 18, -60, 64, 24)
add("Druckermarke", "Kreis, Kreuz und Initialen wie die Zeichen der frühen Buchdrucker. Gemacht für Stempel und Exlibris.",
    "Druckerzeichen der Renaissance", "IM Fell English, Eigenkonstruktion", "stamp",
    [(U(ringC, cross, j, h, v), "i")], accent="#1D2A44")

# 23 ── IM Fell edition ──────────────────────────────────────────
a, aw = outline("Joel", "IMFell.ttf", 130, 0, 0)
b, bw = outline("van", "IMFellItalic.ttf", 130, aw + 26, 0)
c, cw = outline("Hees", "IMFell.ttf", 130, aw + bw + 52, 0)
add("Fell", "Historische Lettern mit allen Unregelmäßigkeiten des Bleisatzes. Für Editionen und Zertifikate.",
    "Fell Types, Oxford 1670er", "IM Fell English", "press", [(U(a, b, c), "i")])

# 24 ── Typewriter strike ────────────────────────────────────────
a, aw = outline("JOEL VAN HEES", "Compagnon-Roman.otf", 76, 0, 0, track=-4)
gl, _ = glyph_paths("JOEL VAN HEES", "Compagnon-Roman.otf", 76, 0, 0, track=-4)
vb0 = gl[5].bounds; vb1 = gl[7].bounds
strike = rect(vb0[0] - 6, -30, vb1[2] - vb0[0] + 12, 5)
add("Schreibmaschine", "Das van ist durchgestrichen, bleibt aber lesbar. Ein Satz wie aus einem Konzeptkunst-Katalog.",
    "Konzeptkunst, Lawrence Weiner", "Compagnon · Velvetyne", "print", [(a, "i"), (strike, "a")], accent="#E2412F")

# 25 ── Stencil with real bridges ────────────────────────────────
gl, w = glyph_paths("van Hees", "Avara-Black.otf", 190, 0, 0)
out = []
for i, g in enumerate(gl):
    b = g.bounds
    if (b[2] - b[0]) < 1: continue
    cx = (b[0] + b[2]) / 2
    if i in (1, 5, 6):  # a e e
        g = D(g, rect(cx - 4.5 + (6 if i == 1 else 0), b[1] - 5, 9, b[3] - b[1] + 10))
    if i == 4:  # H crossbar cuts
        g = D(g, rect(b[0] + (b[2] - b[0]) * .3, b[1] - 5, 9, b[3] - b[1] + 10), rect(b[0] + (b[2] - b[0]) * .66, b[1] - 5, 9, b[3] - b[1] + 10))
    out.append(g)
add("Schablone", "Echte Stege in jedem Buchstaben mit Innenraum. Lässt sich wirklich ausschneiden und sprühen.",
    "Le Corbusier, Schablonen-Lettering 1930er", "Avara Black, Stege eingeschnitten", "spray", [(U(*out), "i")])

# 26 ── Glass J ──────────────────────────────────────────────────
j = at0(outline("J", "Ouroboros.otf", 300)[0], 0, 0)
jf = move(j, W(j) + 70)
add("Glas", "Links Glas für Bildschirm und Motion, rechts die flache Druckversion. Gleiche Form, beide funktionieren.",
    "Apple Liquid Glass 2025, mit 2D-Pendant", "Ouroboros J · Velvetyne", "glass", [(j, "g"), (jf, "i")])

# 27 ── Mona Sans width ramp ─────────────────────────────────────
x = 0; parts = []
for ch, wd in (("J", 75), ("V", 100), ("H", 125)):
    p, w = outline(ch, "MonaSans.ttf", 250, x, 0, var={"wdth": wd, "wght": 900}); parts.append(p); x += w + 6
add("Breitenverlauf", "J schmal, V normal, H breit. Ein Zeichen, das sich dehnen und als Animation atmen kann.",
    "Variable Identitäten, z. B. Mona Sans", "Mona Sans, wdth 75 → 125", "screen", [(U(*parts), "i")], accent="#3DFF8A")

# 28 ── Konstrukt (own mark refined) ─────────────────────────────
arc = stroke(line(*([(40, 30), (150, 30)] + [(150 + 60 * math.sin(a / 20 * math.pi / 2), 90 - 60 * math.cos(a / 20 * math.pi / 2)) for a in range(1, 21)] + [(210, 128)])), 22, cap='butt', join='miter')
o = D(ellipse(108, 128, 54, 54), rect(104, 60, 8, 140))
e1 = rect(100, 198, 80, 26); e2 = rect(100, 236, 52, 20)
lL = stroke(line((200, 196), (200, 270), (92, 270)), 22, cap='butt', join='miter')
add("Konstrukt", "Dein JOEL-Zeichen, neu gezeichnet. Gleiche Idee, sauberes Raster, Riso-Versatz als Material statt als Effekt.",
    "Dein Bestand · El Lissitzky", "Eigenkonstruktion", "riso", [(U(arc, o, e1, lL), "i"), (e2, "a")], accent="#FF4F7B")

# 29 ── Green pebble evolved ─────────────────────────────────────
blobpts = []
for k in range(180):
    a = 2 * math.pi * k / 180
    r = 120 + 7 * math.sin(3 * a + .6) + 4 * math.cos(5 * a)
    blobpts.append((r * math.cos(a), r * math.sin(a)))
blob = poly(blobpts)
AV = {"wdth": 112, "wght": 800}
t1 = centerx(outline("van", "Archivo.ttf", 82, 0, -8, var=AV, track=-3)[0], 0)
t2 = centerx(outline("Hees", "Archivo.ttf", 82, 0, 62, var=AV, track=-3)[0], -2)
add("Kiesel", "Dein grünes Logo, flach und präzise. Die Form ist leicht unregelmäßig, das Wort optisch zentriert.",
    "Dein Bestand", "Archivo Expanded ExtraBold", "print", [(D(blob, t1, t2), "a")], accent="#17A938")

# 30 ── Gulax ────────────────────────────────────────────────────
p, w = outline("joel", "Gulax.otf", 260, 0, 0)
add("Gulax", "Eckig-verspielte Buchstaben wie aus dem Baukasten. Funktioniert als Sticker, Patch und Pin.",
    "Bastel-Ästhetik der Velvetyne-Szene", "Gulax · Velvetyne", "print", [(p, "i")])

# 31 ── Lineal ring ──────────────────────────────────────────────
ringL = D(ellipse(0, 0, 140, 140), ellipse(0, 0, 136, 136))
t, w = outline("jvh", "LinealVF.ttf", 150, 0, 0, var={"wght": 120})
t = fit(t, -80, -62, 160, 120)
add("Ring", "Haarfeine Geometrie im Kreis. Für Silberfolie, Gravur, Ringe und kleine Editionen.",
    "Herbert Bayer, Bauhaus Dessau", "Lineal Thin · Velvetyne", "foil", [(U(ringL, t), "i")])

# 32 ── Young Serif with ee ligature ─────────────────────────────
gl, w = glyph_paths("Joel van Hees", "YoungSerif.ttf", 130, 0, 0)
gl = [g for g in gl if (g.bounds[2] - g.bounds[0]) > 0]
# glyph order: J o e l v a n H e e s → move second e left to touch
gl[9] = move(gl[9], -9); gl[10] = move(gl[10], -9)
add("Young Serif", "Warme, kräftige Serife, die zwei e in Hees verschmelzen. Freundlich wie ein Buchverlag.",
    "Cooper-Black-Wärme, Verlagslogos", "Young Serif, ee-Ligatur", "print", [(U(*gl), "i")])

# 33 ── Lack speed ───────────────────────────────────────────────
p, w = outline("van hees", "Lack-Italic.otf", 160, 0, 0)
pb = p.bounds; hgt = pb[3] - pb[1]
lines = U(*[poly([(pb[0] - 190 + i * 30 + 14, pb[1] + hgt * (.16 + i * .26)), (pb[0] - 10 + 14, pb[1] + hgt * (.16 + i * .26)), (pb[0] - 10, pb[1] + hgt * (.16 + i * .26) + hgt * .13), (pb[0] - 190 + i * 30, pb[1] + hgt * (.16 + i * .26) + hgt * .13)]) for i in range(3)])
add("Tempo", "Schräge, schnelle Grotesk mit Fahrtstreifen. Für Motion, Merch und alles, was sich bewegt.",
    "Motorsport-Logos der 80er", "Lack Italic", "print", [(p, "i"), (move(lines, 0, 0, 1, 1), "i")])

assert len(L) == 33, len(L)
out = os.path.join(os.path.dirname(__file__), '..', 'logos.js')
open(out, 'w').write('window.LOGOS=' + json.dumps(L, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('wrote', out, os.path.getsize(out) // 1024, 'KB')
