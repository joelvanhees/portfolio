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

## Top 5 (Ausgabe 04)
- `top5.html` – Le Murmure, Fraktur, Trickster, Vignelli, Schreibmaschine: Korrespondenz, Editorial, Komponenten, Social/Merch, Kombinationen
- `top5-artifact.html` – Fragment für claude.ai
- Generator: `tools/top5.html`, `tools/top5_extra.js`, `tools/top5_extra.css`, `tools/build_top5.py`
- Navigation repariert: Zurück-Button war durch `all:unset` nicht klickbar; Seitenstand wird nicht mehr in die Adresse geschrieben

## Finale (Ausgabe 05)
- `finale.html` – drei zusammengeführte Systeme (Atelier, Kasten, Presse) + Entscheidungsseite
- `final-artifact.html` – Fragment für claude.ai
- Generator: `tools/final.html`, `tools/final_extra.js`, `tools/final_extra.css`, `tools/build_final.py`

## Atelier & Presse (Ausgabe 06) – das zusammengeführte System
- `atelier-presse.html` – Siegel mit Symbolik, Logo-Familie, Typo, Farbe, zwei Räume, Korrespondenz, Editorial, Web, Merch, Regeln
- `haus-artifact.html` – Fragment für claude.ai
- `haus.js` – neu gezeichnetes Siegel (Vierzeichen), Lockups, Kleinform
- Generator: `tools/logos_haus.py`, `tools/haus.html`, `tools/haus_extra.js`, `tools/haus_extra.css`, `tools/build_haus.py`

## Logo-Werkstatt (Ausgabe 07)
- `logo.html` – Neuanfang: Siegel ohne Stab („van“ oben), Stempel mit Umschrift, Wortmarken A–C, Anwendungen
- `logo-artifact.html` – Fragment für claude.ai
- Generator: `tools/logos_logo.py`, `tools/logo_page.html`, `tools/build_logo.py`
