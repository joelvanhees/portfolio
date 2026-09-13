import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

import { playClickSound } from '../utils/clickSound';

// Deliberately empty. The page owns its two addresses
// (/gefängnisplanet and /prisonplanet) and nothing else yet — the content
// comes in its own pass. What is here is the frame that content drops into:
// the title, the language pair, and the way back.

const COPY = {
  de: {
    lang: 'de',
    other: 'en',
    otherLabel: 'EN',
    kicker: 'Kinetische Skulptur',
    title: 'Gefängnisplanet I',
    standfirst: 'Ein Gefängnis, das dir niemand baut. Du baust es selbst.',
    status: 'Diese Seite wird gerade gefüllt.',
    back: 'Zurück zur Startseite',
    documentTitle: 'Gefängnisplanet I | Joel van Hees',
  },
  en: {
    lang: 'en',
    other: 'de',
    otherLabel: 'DE',
    kicker: 'Kinetic sculpture',
    title: 'Prison Planet I',
    standfirst: 'A prison nobody builds for you. You build it yourself.',
    status: 'This page is being written.',
    back: 'Back to the home page',
    documentTitle: 'Prison Planet I | Joel van Hees',
  },
};

const PrisonPlanetView = ({ darkMode, lang = 'de', onNavigate, onSwitchLanguage }) => {
  const copy = COPY[lang] ?? COPY.de;

  // The shell is one document, so the page has to state its own language and
  // title — otherwise this reads to a crawler as whatever the home page said.
  useEffect(() => {
    const previousTitle = document.title;
    const previousLang = document.documentElement.lang;

    document.title = copy.documentTitle;
    document.documentElement.lang = copy.lang;

    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLang;
    };
  }, [copy]);

  const accent = darkMode ? 'text-[#C7FF2E]' : 'text-[#0055FF]';
  const hairline = darkMode ? 'bg-white/15' : 'bg-black/10';

  return (
    <div className="pt-40 md:pt-48 px-6 sm:px-12 lg:px-16 min-h-screen max-w-5xl mx-auto pb-24 md:pb-40">
      <div data-reveal>
        <div className="flex items-baseline justify-between gap-6 mb-8">
          <p className="font-meta text-[10px] uppercase tracking-[0.22em] opacity-45">
            {copy.kicker}
          </p>

          <button
            onClick={() => {
              onSwitchLanguage?.(copy.other);
              playClickSound('click');
            }}
            className={`font-meta text-[11px] uppercase tracking-[0.18em] px-4 py-2 rounded-full border transition-all active:scale-95
              ${darkMode
                ? 'border-white/20 text-white hover:bg-white hover:text-black'
                : 'border-black/20 text-black hover:bg-black hover:text-white'}`}
          >
            {copy.otherLabel}
          </button>
        </div>

        <h1 className="font-display font-bold uppercase tracking-tight text-5xl md:text-7xl leading-[0.95]">
          <span className="glitch-hover cursor-default block">{copy.title}</span>
        </h1>

        <p className="font-meta text-base md:text-lg opacity-70 mt-6 max-w-2xl">
          {copy.standfirst}
        </p>
      </div>

      <div className={`h-px my-12 md:my-16 ${hairline}`} />

      <div data-reveal className="min-h-[30vh]">
        <p className={`font-meta text-xs uppercase tracking-[0.18em] ${accent}`}>
          {copy.status}
        </p>
      </div>

      <button
        onClick={() => {
          onNavigate?.('home');
          playClickSound('click');
        }}
        className="mt-16 inline-flex items-center gap-2 font-meta text-[11px] uppercase tracking-[0.18em] opacity-60 hover:opacity-100 transition-opacity"
      >
        <ArrowLeft size={14} />
        {copy.back}
      </button>
    </div>
  );
};

export default PrisonPlanetView;
