"""Assemble ../logo-artifact.html (fragment) and ../logo.html (standalone)."""
import os
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, '..')
strip = lambda s, pre: s.strip()[len(pre):].rstrip(';')
pg = open(os.path.join(H, 'page.html')).read()
material = pg[pg.index('/* ---------- material renderer ---------- */'):pg.index('/* ---------- pages ---------- */')]
out = open(os.path.join(H, 'logo_page.html')).read()
for k, v in (('{{FONTS}}', open(os.path.join(R, 'fonts', 'fin-fonts.css')).read()), ('{{LOGO}}', strip(open(os.path.join(R, 'logo.js')).read(), 'window.LOGO=')), ('{{MATERIAL}}', material)):
    out = out.replace(k, v)
open(os.path.join(R, 'logo-artifact.html'), 'w').write(out)
open(os.path.join(R, 'logo.html'), 'w').write('<!doctype html>\n<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + out + '\n</html>\n')
print('logo-artifact.html', os.path.getsize(os.path.join(R, 'logo-artifact.html')) // 1024, 'KB')
