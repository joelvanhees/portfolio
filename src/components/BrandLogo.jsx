import { useEffect, useId, useMemo, useRef } from 'react';
import { LOGO_ART, LOGO_VIEWBOX } from '../content/logoArt';
import { MonoLockup, MonoMark } from '../content/logoMono';

// Brand book master coordinates for the monoline drawing.
const MONO_VIEWBOX = {
  lockup: '140.32 167.44 569.36 298.96',
  mark: '140.31 167.43 145.78 254.88',
};

/*
 * Brand marks.
 *
 * Two different drawings, chosen by surface rather than recoloured:
 *
 *  - Dark surfaces get the liquid glass artwork, translucent, with the page
 *    showing through the letterforms.
 *  - Light surfaces get the monoline signature from the brand book, drawn flat
 *    in the page's own ink. Glass on Paper reads as a washed-out object; the
 *    monoline reads as a signature, which is the editorial register the light
 *    theme is in.
 *
 * The artwork uses feTurbulence, feDisplacementMap and feSpecularLighting on a
 * loop. That is the effect, and it is not cheap. Two guards keep it from being
 * a liability:
 *
 *  - prefers-reduced-motion pauses the SVG timeline outright.
 *  - Machines that report few cores get the artwork with its animation paused
 *    as well. It still renders — same drawing, just still — rather than
 *    running a continuous filter chain on hardware that cannot afford it.
 *
 * Filters are declared inside each instance, so a paused instance costs
 * nothing beyond its first paint.
 */

const artFor = (variant, tone) =>
  LOGO_ART[`${variant}${tone === 'clear' ? 'Dark' : 'Light'}`];

const viewBoxFor = (variant, tone) =>
  LOGO_VIEWBOX[`${variant}${tone === 'clear' ? 'Dark' : 'Light'}`];

// Weak hardware gets the drawing without the running filter loop.
const prefersStill = () => {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return true;
  return (navigator.hardwareConcurrency ?? 8) <= 2;
};

const Mark = ({ variant, tone, className, title }) => {
  const svgRef = useRef(null);
  const uid = useId().replace(/[:]/g, '');
  const isGlass = tone === 'clear';
  const viewBox = isGlass ? viewBoxFor(variant, tone) : MONO_VIEWBOX[variant === 'mark' ? 'mark' : 'lockup'];
  const html = useMemo(
    () => (isGlass ? artFor(variant, tone).replaceAll('__ID__', `${uid}-`) : ''),
    [isGlass, variant, tone, uid],
  );

  useEffect(() => {
    const svg = svgRef.current;
    // The monoline has no filters and no timeline; there is nothing to pause.
    if (!svg || !isGlass) return undefined;

    const apply = () => {
      if (prefersStill()) svg.pauseAnimations?.();
      else svg.unpauseAnimations?.();
    };
    apply();

    const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    motion?.addEventListener?.('change', apply);

    // A mark scrolled out of view has no reason to keep running its filters.
    let observer;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          if (!entry.isIntersecting) svg.pauseAnimations?.();
          else apply();
        },
        { threshold: 0 },
      );
      observer.observe(svg);
    }

    return () => {
      motion?.removeEventListener?.('change', apply);
      observer?.disconnect();
    };
  }, [html, isGlass]);

  const shared = {
    ref: svgRef,
    viewBox,
    className,
    role: 'img',
    'aria-label': title,
    focusable: 'false',
    preserveAspectRatio: 'xMidYMid meet',
  };

  // The glass artwork arrives as markup and has to be injected verbatim; the
  // monoline is real JSX, so it is rendered as children instead.
  if (!isGlass) {
    return (
      <svg {...shared}>
        {variant === 'mark' ? <MonoMark /> : <MonoLockup maskId={`${uid}-counter`} />}
      </svg>
    );
  }

  return <svg {...shared} dangerouslySetInnerHTML={{ __html: html }} />;
};

/**
 * Full lockup — the signature with its "VAN HEES" descriptor.
 * `tone`: "clear" for dark surfaces, "smoke" for light ones.
 */
export const BrandLockup = ({ className = '', tone = 'clear', title = 'Joel van Hees' }) => (
  <Mark variant="lockup" tone={tone} className={className} title={title} />
);

/** Compact mark — the J on its own, for avatars and tight placements. */
export const BrandMark = ({ className = '', tone = 'clear', title = 'Joel van Hees' }) => (
  <Mark variant="mark" tone={tone} className={className} title={title} />
);

export const BrandSignature = BrandLockup;

export default BrandLockup;
