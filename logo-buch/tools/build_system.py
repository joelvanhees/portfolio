"""Assemble ../system-artifact.html (fragment) and ../designsystem.html (standalone)."""
import json, os, re
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, '..')
fams = ("'JM Murmure'", "'JM Caslon Display'", "'JM Caslon Text'", "'JM Compagnon'", "'JM Compagnon Light'")
fonts = '\n'.join(l for l in open(os.path.join(R, 'fonts', 'fin-fonts.css')).read().split('\n') if any(("font-family:" + f + ";") in l for f in fams))
L = json.loads(open(os.path.join(R, 'logo.js')).read().strip()[len('window.LOGO='):].rstrip(';'))
logo = json.dumps({k: L[k] for k in ('wm2', 'w3', 'jvh', 's2m', 'meta')}, separators=(',', ':'))
out = open(os.path.join(H, 'system.html')).read().replace('{{FONTS}}', fonts).replace('{{LOGO}}', logo)
open(os.path.join(R, 'system-artifact.html'), 'w').write(out)
open(os.path.join(R, 'designsystem.html'), 'w').write('<!doctype html>\n<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + out + '\n</html>\n')
print('system-artifact.html', os.path.getsize(os.path.join(R, 'system-artifact.html')) // 1024, 'KB', 'fonts', fonts.count('@font-face'))
