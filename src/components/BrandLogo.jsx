import { useEffect, useId, useMemo, useRef } from 'react';
import { LOGO_ART, LOGO_VIEWBOX } from '../content/logoArt';

/*
 * Brand marks — the supplied liquid glass artwork.
 *
 * Each mark exists as a dark-surface and a light-surface drawing; they differ
 * in more than the backdrop, so the theme picks the whole artwork rather than
 * recolouring one.
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
  const viewBox = viewBoxFor(variant, tone);
  const html = useMemo(() => artFor(variant, tone).replaceAll('__ID__', `${uid}-`), [variant, tone, uid]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;

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
  }, [html]);

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label={title}
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
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
