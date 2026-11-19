"""Assemble ../artifact.html (fragment for publishing) and ../index.html (standalone)."""
import base64, os
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, '..')
faces = [("Le Murmure", "le-murmure", "normal"), ("Libre Caslon Display", "libre-caslon-display", "normal"),
         ("Compagnon", "compagnon", "normal"), ("Compagnon", "compagnon-light-italic", "italic")]
css = ''.join(
    "@font-face{font-family:'%s';font-style:%s;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}\n"
    % (fam, st, base64.b64encode(open(os.path.join(R, 'fonts', f + '.woff2'), 'rb').read()).decode()) for fam, f, st in faces)
logos = open(os.path.join(R, 'logos.js')).read().strip()
logos = logos[len('window.LOGOS='):].rstrip(';')
page = open(os.path.join(H, 'page.html')).read().replace('{{FONTS}}', css).replace('{{LOGOS}}', logos)
open(os.path.join(R, 'artifact.html'), 'w').write(page)
open(os.path.join(R, 'index.html'), 'w').write('<!doctype html>\n<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0}</style>\n' + page + '\n</html>\n')
print('artifact.html', os.path.getsize(os.path.join(R, 'artifact.html')) // 1024, 'KB')
