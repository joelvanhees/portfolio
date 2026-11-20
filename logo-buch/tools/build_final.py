"""Assemble ../final-artifact.html (fragment) and ../finalisten.html (standalone)."""
import base64, os
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, '..')
ui = ''.join("@font-face{font-family:'%s';font-style:%s;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}\n"
    % (fam, st, base64.b64encode(open(os.path.join(R, 'fonts', f + '.woff2'), 'rb').read()).decode())
    for fam, f, st in [("Le Murmure", "le-murmure", "normal"), ("Libre Caslon Display", "libre-caslon-display", "normal"), ("Compagnon", "compagnon", "normal")])
strip = lambda s, pre: s.strip()[len(pre):].rstrip(';')
logos = strip(open(os.path.join(R, 'logos.js')).read(), 'window.LOGOS=')
fin = strip(open(os.path.join(R, 'fin.js')).read(), 'window.FIN=')
pg = open(os.path.join(H, 'page.html')).read()
a = pg.index('/* ---------- material renderer ---------- */'); b = pg.index('/* ---------- pages ---------- */')
material = pg[a:b]
out = open(os.path.join(H, 'final.html')).read()
for k, v in (('{{FONTS}}', open(os.path.join(R, 'fonts', 'fin-fonts.css')).read()), ('{{UIFONTS}}', ui), ('{{LOGOS}}', logos), ('{{FIN}}', fin), ('{{MATERIAL}}', material), ('{{TOPCSS}}', open(os.path.join(H,'top5_extra.css')).read()), ('{{TOPJS}}', open(os.path.join(H,'top5_extra.js')).read()), ('{{FINALCSS}}', open(os.path.join(H,'final_extra.css')).read()), ('{{FINALJS}}', open(os.path.join(H,'final_extra.js')).read())):
    out = out.replace(k, v)
open(os.path.join(R, 'final-artifact.html'), 'w').write(out)
open(os.path.join(R, 'finale.html'), 'w').write('<!doctype html>\n<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + out + '\n</html>\n')
print('final-artifact.html', os.path.getsize(os.path.join(R, 'final-artifact.html')) // 1024, 'KB')
