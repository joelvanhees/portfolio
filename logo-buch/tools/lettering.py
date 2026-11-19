"""Tiny lettering toolkit: shape text with HarfBuzz (real kerning/ligatures),
turn glyphs into outlines, and do boolean ops with skia-pathops.
Every logo ends up as pure vector paths — no font dependency."""
import uharfbuzz as hb, pathops
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import RecordingPen, DecomposingRecordingPen
def _draw(gs, g, pen):
    r = DecomposingRecordingPen(gs); gs[g].draw(r); r.replay(pen)
from fontTools.varLib.instancer import instantiateVariableFont
import os, functools
FD = os.environ.get('FONTDIR', 'fonts')

@functools.lru_cache(None)
def _load(name, var=()):
    path = os.path.join(FD, name)
    tt = TTFont(path)
    if var and 'fvar' in tt:
        tt = instantiateVariableFont(tt, dict(var), inplace=False)
    blob = hb.Blob.from_file_path(path)
    face = hb.Face(blob); font = hb.Font(face)
    if var: font.set_variations(dict(var))
    return tt, font

def shape(text, name, size=100, var=(), feats=None, track=0):
    """Return list of (glyphname, x, y) in px plus total width."""
    tt, font = _load(name, tuple(sorted(var.items())) if isinstance(var, dict) else var)
    upm = tt['head'].unitsPerEm
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(font, buf, feats or {"kern": True, "liga": True})
    order = tt.getGlyphOrder(); s = size / upm
    x = 0; out = []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        out.append((order[info.codepoint], x + pos.x_offset * s, pos.y_offset * s))
        x += pos.x_advance * s + track
    return out, x - track, tt, s

def outline(text, name, size=100, x=0, y=0, var=(), feats=None, track=0, kern=None):
    """pathops.Path of the set text, baseline at y (SVG coords, y down).
    kern: dict index->extra px added before glyph i (manual optical kerning)."""
    glyphs, w, tt, s = shape(text, name, size, var, feats, track)
    gs = tt.getGlyphSet()
    p = pathops.Path(); pen = p.getPen()
    shift = 0
    for i, (g, gx, gy) in enumerate(glyphs):
        if kern and i in kern: shift += kern[i]
        tp = TransformPen(pen, (s, 0, 0, -s, x + gx + shift, y - gy))
        _draw(gs, g, tp)
    w += shift
    return clean(p), w

def clean(p):
    try:
        return pathops.simplify(p, fix_winding=True)
    except Exception:
        return p

def glyph_paths(text, name, size=100, x=0, y=0, var=(), feats=None, track=0):
    """List of separate pathops paths, one per glyph (for per-letter surgery)."""
    glyphs, w, tt, s = shape(text, name, size, var, feats, track)
    gs = tt.getGlyphSet(); res = []
    for g, gx, gy in glyphs:
        p = pathops.Path(); tp = TransformPen(p.getPen(), (s, 0, 0, -s, x + gx, y - gy)); _draw(gs, g, tp)
        res.append(clean(p))
    return res, w

def rect(x, y, w, h):
    p = pathops.Path(); p.moveTo(x, y); p.lineTo(x + w, y); p.lineTo(x + w, y + h); p.lineTo(x, y + h); p.close(); return p

def poly(pts):
    p = pathops.Path(); p.moveTo(*pts[0])
    for q in pts[1:]: p.lineTo(*q)
    p.close(); return p

def ellipse(cx, cy, rx, ry, n=96):
    import math
    return poly([(cx + rx * math.cos(2 * math.pi * i / n), cy + ry * math.sin(2 * math.pi * i / n)) for i in range(n)])

def U(*ps):
    r = ps[0]
    for q in ps[1:]: r = pathops.op(r, q, pathops.PathOp.UNION, fix_winding=True)
    return r
def D(a, *bs):
    for b in bs: a = pathops.op(a, b, pathops.PathOp.DIFFERENCE, fix_winding=True)
    return a
def I(a, b): return pathops.op(a, b, pathops.PathOp.INTERSECTION, fix_winding=True)
def X(a, b): return pathops.op(a, b, pathops.PathOp.XOR, fix_winding=True)

def move(p, dx=0, dy=0, sx=1, sy=None, rot=None, origin=(0, 0)):
    import math
    sy = sx if sy is None else sy
    r = pathops.Path(); pen = r.getPen()
    if rot:
        a = math.radians(rot); c, s_ = math.cos(a), math.sin(a); ox, oy = origin
        m = (c * sx, s_ * sx, -s_ * sy, c * sy, ox - c * ox + s_ * oy + dx, oy - s_ * ox - c * oy + dy)
    else:
        m = (sx, 0, 0, sy, dx, dy)
    p.draw(TransformPen(pen, m)); return r

def d(p):
    pen = SVGPathPen(None, ntos=lambda v: ('%.2f' % v).rstrip('0').rstrip('.'))
    p.draw(pen); return pen.getCommands()

def bbox(p):
    return p.bounds  # (xmin, ymin, xmax, ymax)

def stroke(p, w, cap='round', join='round'):
    q = pathops.Path(p)
    caps = {'round': pathops.LineCap.ROUND_CAP, 'butt': pathops.LineCap.BUTT_CAP, 'square': pathops.LineCap.SQUARE_CAP}
    joins = {'round': pathops.LineJoin.ROUND_JOIN, 'miter': pathops.LineJoin.MITER_JOIN, 'bevel': pathops.LineJoin.BEVEL_JOIN}
    q.stroke(w, caps[cap], joins[join], 4)
    q.convertConicsToQuads()
    return clean(q)

def grow(p, w):
    """Dilate a filled shape by w (for over/under gaps)."""
    return U(p, stroke(p, 2 * w))

def line(*pts):
    p = pathops.Path(); p.moveTo(*pts[0])
    for q in pts[1:]: p.lineTo(*q)
    return p

def qcurve(p0, c, p1, n=40):
    pts = []
    for i in range(n + 1):
        t = i / n
        pts.append(((1-t)**2*p0[0] + 2*(1-t)*t*c[0] + t*t*p1[0], (1-t)**2*p0[1] + 2*(1-t)*t*c[1] + t*t*p1[1]))
    return pts
