// Path routes.
//
// The portfolio runs on the hash (#work, #about, …): one shell, one bundle, no
// router. AKKOMMODATION is not one of its views — it is its own document, with
// its own type, its own navigation and its own palette, shipped as static
// files under /akkommodation/ (public/akkommodation/).
//
// So this file is a safety net, not a router. Any host that resolves a
// directory index serves that document before the app is ever loaded. If one
// does not, the shell boots on a path it does not own, and sends the reader to
// the address that works instead of silently showing the home page.

export const AKKOMMODATION_PATHS = {
  de: '/akkommodation/',
  en: '/akkommodation/en.html',
};

// What a browser, a mail client or a link rewriter might hand us for the same
// page. The umlaut survives a modern address bar but not every rewriter, so the
// transliterations are part of the route, not a courtesy.
//
// The Gefängnisplanet spellings are the work's former addresses. vercel.json
// answers them with a 301, so in normal operation they never reach the app;
// they stay here for the case where the redirect does not run.
const AKKOMMODATION_ALIASES = {
  'akkommodation': 'de',
  'gefängnisplanet': 'de',
  'gefaengnisplanet': 'de',
  'gefangnisplanet': 'de',
  'prisonplanet': 'en',
  'prison-planet': 'en',
};

// `/AKKOMMODATION/` and `/akkommodation` are the same page.
const normalize = (pathname) => {
  let value = pathname || '/';
  try {
    value = decodeURIComponent(value);
  } catch {
    // A malformed escape is not a route. Match on the raw string instead of
    // throwing out of the router.
  }
  return value.toLowerCase().replace(/^\/+/, '').replace(/\/+$/, '');
};

/**
 * Resolves a pathname to a standalone document, or null when the hash is in
 * charge.
 *
 * @param {string} pathname
 * @returns {{ page: 'akkommodation', lang: 'de' | 'en', href: string } | null}
 */
export const resolvePathRoute = (pathname) => {
  const slug = normalize(pathname);
  if (!slug) return null;

  const lang = AKKOMMODATION_ALIASES[slug];
  if (!lang) return null;

  return { page: 'akkommodation', lang, href: AKKOMMODATION_PATHS[lang] };
};
