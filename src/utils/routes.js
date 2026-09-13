// Path routes.
//
// The portfolio runs on the hash (#work, #about, …): one shell, one bundle, no
// router. Gefängnisplanet is not one of its views — it is its own document,
// with its own type, its own navigation and its own palette, written to
// /gefängnisplanet/ and /prisonplanet/ at build time (scripts/microsites.mjs).
//
// So this file is a safety net, not a router. Any host that resolves a
// directory index serves those documents before the app is ever loaded. If one
// does not, the shell boots on a path it does not own, and sends the reader to
// the address that works instead of silently showing the home page.

export const PRISON_PLANET_PATHS = {
  de: '/gefängnisplanet/',
  en: '/prisonplanet/',
};

// What a browser, a mail client or a link rewriter might hand us for the same
// page. The umlaut survives a modern address bar but not every rewriter, so the
// transliterations are part of the route, not a courtesy.
const PRISON_PLANET_ALIASES = {
  'gefängnisplanet': 'de',
  'gefaengnisplanet': 'de',
  'gefangnisplanet': 'de',
  'prisonplanet': 'en',
  'prison-planet': 'en',
};

// `/GEFÄNGNISPLANET/` and `/gef%C3%A4ngnisplanet` are the same page.
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
 * @returns {{ page: 'prisonplanet', lang: 'de' | 'en', href: string } | null}
 */
export const resolvePathRoute = (pathname) => {
  const slug = normalize(pathname);
  if (!slug) return null;

  const lang = PRISON_PLANET_ALIASES[slug];
  if (!lang) return null;

  return { page: 'prisonplanet', lang, href: PRISON_PLANET_PATHS[lang] };
};
