# Logobuch Joel van Hees

- `index.html` – im Browser öffnen (Magazin, wischen oder Pfeiltasten)
- `artifact.html` – gleiche Seite als Fragment für claude.ai-Artifacts
- `logos.js` – alle 33 Logos als reine Vektorpfade (keine Schrift nötig)
- `tex/` – Materialtexturen (Papier, Kraft, Karton, Beton, Baumwolle)
- `tools/` – Generator: `lettering.py` (HarfBuzz + skia-pathops), `logos.py`, `textures.py`, `build.py`
- `v1/` – erster Durchlauf (verworfen)

Schriften: Velvetyne (Le Murmure, Cantique, Interlope, Ouroboros, Trickster, Basteleur, Avara, Sligoil, Lineal, Gulax, Compagnon, Lack),
Google Fonts/OFL (Libre Caslon Display, UnifrakturMaguntia, Grenze Gotisch, IM Fell, Young Serif, Archivo, Six Caps, Space Mono),
GitHub Mona Sans, Departure Mono. Alle unter SIL Open Font License.

## Finalisten (Ausgabe 03)
- `finalisten.html` – neun komplette Systeme (Logo-Familie, Typo, Farbe, Anwendung), im Browser öffnen
- `finalisten-artifact.html` – Fragment für claude.ai-Artifacts
- `fin.js` – Querformat- und Signet-Varianten je Finalist
- `fonts/fin-fonts.css` – Schriftschnitte (Latin-Subset, WOFF2, base64)
- Generator: `tools/logos_fin.py`, `tools/fonts_fin.py`, `tools/fin.html`, `tools/build_fin.py`
