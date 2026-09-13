import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Gefängnisplanet ships as one document.
//
// Not as a taste decision: the sculpture's geometry is the only thing on this
// page worth taking, and a separate model file is a URL, and a URL is a
// download. Inlined, there is nothing in the network panel to right click.
// Three.js rides along for the same reason the model does — one request, one
// document, no loose parts.
//
// The cost is that the payload cannot be cached apart from the page. For a
// page people open once and scroll through, that is the cheaper half of the
// trade.

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, '..', 'microsite', 'gefaengnisplanet');
const read = (file) => readFileSync(join(source, file), 'utf8');

const SITE = 'https://joelvanhees.de';

// One page, two addresses. German is the work's own language — the title
// stays Gefängnisplanet in both — so only the prose and the metadata switch.
export const MICROSITE_PAGES = [
  { path: 'gefängnisplanet/index.html', lang: 'de', url: `${SITE}/gefängnisplanet/` },
  { path: 'prisonplanet/index.html', lang: 'en', url: `${SITE}/prisonplanet/` },
];

const DESCRIPTION = {
  de: 'Gefängnisplanet I. Eine kinetische Skulptur von Joel van Hees. Stein, Licht und ein Blick, der sich bewegt.',
  en: 'Gefängnisplanet I. A kinetic sculpture by Joel van Hees. Stone, light and a gaze that moves.',
};

export const renderMicrosite = (lang) => {
  const page = read('page.html');
  const css = read('style.css');
  const inline = (file) => `<script>${read(file)}</script>`;

  let html = page.replace('<link rel="stylesheet" href="style.css">', `<style>${css}</style>`);

  html = html.replace(
    '<script src="assets/three.r128.min.js" defer></script><script src="assets/model-v36.js" defer></script><script src="app.js" defer></script><script src="scene.js" defer></script>',
    inline('vendor/three.r128.min.js') + inline('model/eye-v36.js') + inline('guard.js') + inline('app.js') + inline('scene.js'),
  );

  if (lang === 'en') {
    html = html.replace('<html lang="de">', '<html lang="en">');
    html = html.replace(DESCRIPTION.de, DESCRIPTION.en);
  }

  // Two addresses for one page: say which is which, or a crawler picks for us.
  const de = MICROSITE_PAGES[0].url;
  const en = MICROSITE_PAGES[1].url;
  const self = lang === 'en' ? en : de;
  const head =
    `<link rel="canonical" href="${self}">` +
    `<link rel="alternate" hreflang="de" href="${de}">` +
    `<link rel="alternate" hreflang="en" href="${en}">` +
    `<link rel="alternate" hreflang="x-default" href="${de}">` +
    `<meta property="og:type" content="article">` +
    `<meta property="og:title" content="Gefängnisplanet I · Joel van Hees">` +
    `<meta property="og:description" content="${DESCRIPTION[lang]}">` +
    `<meta property="og:url" content="${self}">` +
    `<meta property="og:locale" content="${lang === 'en' ? 'en_GB' : 'de_DE'}">` +
    `<meta name="author" content="Joel van Hees">`;

  return html.replace('</head>', `${head}</head>`);
};

// /gefängnisplanet, /prisonplanet, with or without a trailing slash, encoded
// umlaut or not — and the ASCII spelling, for anything that eats the umlaut.
const ROUTE_LANG = {
  'gefängnisplanet': 'de',
  'gefaengnisplanet': 'de',
  'prisonplanet': 'en',
};

const routeFor = (url) => {
  let pathname = (url || '/').split('?')[0];
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  return ROUTE_LANG[pathname.toLowerCase().replace(/^\/+/, '').replace(/\/+$/, '')] ?? null;
};

// Serves the same documents the build writes, read fresh on every request, so
// editing the microsite in dev behaves like editing anything else.
const serve = (server) => {
  server.middlewares.use((req, res, next) => {
    const lang = routeFor(req.url);
    if (!lang) return next();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(renderMicrosite(lang));
  });
};

export const microsites = () => ({
  name: 'gefaengnisplanet-microsite',
  configureServer: serve,
  configurePreviewServer: serve,
  writeBundle(options) {
    for (const { path, lang } of MICROSITE_PAGES) {
      const file = join(options.dir, path);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, renderMicrosite(lang));
    }
  },
});
