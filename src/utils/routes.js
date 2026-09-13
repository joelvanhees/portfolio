// Path routes.
//
// The site itself runs on the hash (#work, #about, …): one shell, one bundle,
// no router. Gefängnisplanet is the exception — it is its own piece, it gets
// its own address, and an address is what people paste into a message. So this
// page, and only this page, lives on a real path.

export const PRISON_PLANET_PATHS = {
  de: '/gefängnisplanet',
  en: '/prisonplanet',
};

// What a browser, a mail client or a CMS might hand us for the same page. The
// umlaut survives a modern address bar but not every link rewriter, so the
// transliterations are part of the route, not a courtesy.
const PRISON_PLANET_ALIASES = {
  'gefängnisplanet': 'de',
  'gefaengnisplanet': 'de',
  'gefangnisplanet': 'de',
  'gefängnisplanet-i': 'de',
  'prisonplanet': 'en',
  'prison-planet': 'en',
  'prisonplanet-i': 'en',
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
 * Resolves a pathname to a standalone page, or null when the hash is in charge.
 *
 * @param {string} pathname
 * @returns {{ page: 'prisonplanet', lang: 'de' | 'en' } | null}
 */
export const resolvePathRoute = (pathname) => {
  const slug = normalize(pathname);
  if (!slug) return null;

  const lang = PRISON_PLANET_ALIASES[slug];
  if (lang) return { page: 'prisonplanet', lang };

  return null;
};
