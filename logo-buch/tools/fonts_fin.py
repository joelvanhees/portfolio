"""Static, Latin-subset WOFF2 instances for the finalist systems -> ../fonts/fin-fonts.css (base64 @font-face)."""
import base64, io, os, sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset
FD = os.environ['FONTDIR']; R = os.path.join(os.path.dirname(__file__), '..')
U = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [0x2009, 0x2013, 0x2014, 0x2018, 0x2019, 0x201A, 0x201C, 0x201D, 0x201E, 0x2022, 0x2026, 0x2116, 0x2190, 0x2192, 0x20AC, 0x00B7, 0x2212]
SPEC = [  # alias, file, axes, style
 ("JM Murmure", "LeMurmure.otf", None, "normal"),
 ("JM Caslon Display", "LibreCaslonDisplay.ttf", None, "normal"),
 ("JM Caslon Text", "LibreCaslonText.ttf", {"wght": 400}, "normal"),
 ("JM Caslon Text", "LibreCaslonText-Italic.ttf", {"wght": 400}, "italic"),
 ("JM Sligoil", "SligoilVF.ttf", {"wght": 100}, "normal"),
 ("JM Fraktur", "Unifraktur.ttf", None, "normal"),
 ("JM Space Mono", "SpaceMono-Regular.ttf", None, "normal"),
 ("JM Space Mono Bold", "SpaceMono-Bold.ttf", None, "normal"),
 ("JM Archivo", "Archivo.ttf", {"wght": 400, "wdth": 100}, "normal"),
 ("JM Archivo Medium", "Archivo.ttf", {"wght": 560, "wdth": 100}, "normal"),
 ("JM Archivo Bold", "Archivo.ttf", {"wght": 700, "wdth": 100}, "normal"),
 ("JM Archivo Expanded", "Archivo.ttf", {"wght": 900, "wdth": 125}, "normal"),
 ("JM Trickster", "Trickster.otf", None, "normal"),
 ("JM Compagnon", "Compagnon-Roman.otf", None, "normal"),
 ("JM Compagnon Light", "Compagnon-LightItalic.otf", None, "italic"),
 ("JM Familjen", "FamiljenGrotesk.ttf", {"wght": 400}, "normal"),
 ("JM Familjen Bold", "FamiljenGrotesk.ttf", {"wght": 650}, "normal"),
 ("JM Plex Sans", "IBMPlexSans.ttf", {"wght": 400, "wdth": 100}, "normal"),
 ("JM Plex Sans Bold", "IBMPlexSans.ttf", {"wght": 600, "wdth": 100}, "normal"),
 ("JM Plex Mono", "IBMPlexMono-Regular.ttf", None, "normal"),
 ("JM Plex Mono Medium", "IBMPlexMono-Medium.ttf", None, "normal"),
 ("JM Bodoni", "BodoniModa-Italic.ttf", {"wght": 400, "opsz": 28}, "italic"),
 ("JM Newsreader", "Newsreader.ttf", {"wght": 400, "opsz": 14}, "normal"),
 ("JM Newsreader", "Newsreader-Italic.ttf", {"wght": 400, "opsz": 14}, "italic"),
 ("JM Avara", "Avara-Black.otf", None, "normal"),
 ("JM Barlow Condensed", "BarlowCondensed-Bold.ttf", None, "normal"),
 ("JM Barlow", "Barlow-Regular.ttf", None, "normal"),
 ("JM Syne", "Syne.ttf", {"wght": 800}, "normal"),
 ("JM Syne Bold", "Syne.ttf", {"wght": 700}, "normal"),
 ("JM Hanken", "HankenGrotesk.ttf", {"wght": 400}, "normal"),
 ("JM Hanken Bold", "HankenGrotesk.ttf", {"wght": 650}, "normal"),
 ("JM Lack", "Lack-Italic.otf", None, "italic"),
 ("JM Mona Expanded", "MonaSans.ttf", {"wdth": 125, "wght": 800, "opsz": 30, "ital": 0}, "normal"),
 ("JM Mona", "MonaSans.ttf", {"wdth": 100, "wght": 420, "opsz": 14, "ital": 0}, "normal"),
 ("JM Departure", "DepartureMono.otf", None, "normal"),
]
css = []; total = 0
for alias, f, axes, style in SPEC:
    tt = TTFont(os.path.join(FD, f))
    if 'fvar' in tt:
        full = {a.axisTag: a.defaultValue for a in tt['fvar'].axes}; full.update(axes or {})
        tt = instantiateVariableFont(tt, full)
    opt = subset.Options(); opt.flavor = 'woff2'; opt.layout_features = ['kern', 'liga', 'calt', 'ccmp', 'locl', 'mark', 'mkmk']; opt.name_IDs = []; opt.notdef_outline = True
    sub = subset.Subsetter(opt); sub.populate(unicodes=U); sub.subset(tt)
    buf = io.BytesIO(); tt.flavor = 'woff2'; tt.save(buf); data = buf.getvalue(); total += len(data)
    css.append("@font-face{font-family:'%s';font-style:%s;font-weight:400;font-display:block;src:url(data:font/woff2;base64,%s) format('woff2')}" % (alias, style, base64.b64encode(data).decode()))
    print(f'{alias:24s} {len(data)//1024:4d} KB')
open(os.path.join(R, 'fonts', 'fin-fonts.css'), 'w').write('\n'.join(css))
print('total', total // 1024, 'KB')
