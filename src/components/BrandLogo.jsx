import { useId } from 'react';

/*
 * Brand marks — Joel van Hees Identity System V03.1
 *
 * Vector geometry extracted 1:1 from the brand book master. The signature is a
 * stroked monoline, so it scales without a raster fallback.
 *
 * The glass treatment is built from the same strokes rather than a second set
 * of artwork: the letterforms are painted once as the body, then re-drawn as a
 * narrow sheen along the top edge and a soft shade along the bottom, both
 * clipped back to the letterform. Per the guardrails, glass stays colorless —
 * white, grey or milky, never a chromatic gradient.
 *
 * The counter of the E is punched out with a mask instead of being filled with
 * the background color, so the mark sits on any surface without a halo.
 */

const SIGNATURE_VIEWBOX = '140.32 167.44 569.36 255.05';
const LOCKUP_VIEWBOX = '140.32 167.44 569.36 298.96';
const MARK_VIEWBOX = '140.31 167.43 145.78 254.88';

// The J — ascender, bowl, and the crossed accent above it.
const J_STROKES = [
  { d: 'M253.79 174.39L253.79 244.33', w: 13.983 },
  { d: 'M253.79 233.45C249.13 272.31 249.91 315.83 253.79 348.47C257.68 380.33 238.26 398.98 211.08 397.42C187.01 395.87 173.03 384.99 165.27 368.67', w: 49.717 },
  { d: 'M229.72 199.26L280.97 199.26M235.16 180.61L271.65 219.46M279.42 182.94L236.71 218.69', w: 10.099 },
];

// o — e — l, the remainder of the signature.
const REST_STROKES = [
  { d: 'M286.41 317.38C277.87 275.42 309.70 247.44 350.86 251.32C392.79 255.21 409.10 295.62 392.02 329.81C374.93 364.01 321.35 371.00 295.73 339.14C273.21 311.16 291.07 279.30 329.12 276.19C367.17 273.08 398.23 292.51 420.75 315.83', w: 49.717 },
  { d: 'M423.08 316.60C437.06 283.96 489.09 274.64 514.71 297.18C539.56 318.94 514.71 337.59 454.14 329.81C459.58 365.56 512.38 379.55 548.88 342.25C562.08 329.04 569.85 315.05 575.28 300.28', w: 49.717 },
  { d: 'M604.01 238.89C593.92 219.46 603.24 201.59 621.87 205.47C641.29 210.14 637.41 231.12 630.42 249.77C617.22 286.30 614.89 322.82 620.32 350.02C626.53 380.33 654.49 390.43 684.77 367.12', w: 49.717 },
];

// "VAN HEES" — the descriptor set under the signature in the full lockup.
const WORDMARK_STROKES = [
  { d: 'M336.88 440.94L345.43 464.26L353.97 440.94M363.29 464.26L371.83 440.94L380.37 464.26M366.39 456.49L377.26 456.49M389.69 464.26L389.69 440.94L406.77 464.26L406.77 440.94', w: 3.496 },
  { d: 'M433.95 440.94L433.95 464.26M451.04 440.94L451.04 464.26M433.95 452.60L451.04 452.60M461.91 440.94L478.99 440.94M461.91 452.60L475.88 452.60M461.91 464.26L478.99 464.26M489.86 440.94L506.95 440.94M489.86 452.60L503.84 452.60M489.86 464.26L506.95 464.26M532.57 443.28C528.69 440.17 518.59 439.39 516.26 445.61C513.16 454.16 534.13 450.27 533.35 458.82C532.57 465.81 520.15 466.59 514.71 461.15', w: 3.496 },
];

const COUNTER_PATH = 'M513.06 309.76C513.12 310.16 513.11 310.57 513.04 310.99C512.96 311.40 512.83 311.81 512.63 312.22C512.43 312.63 512.17 313.03 511.86 313.42C511.54 313.80 511.17 314.17 510.74 314.52C510.32 314.87 509.85 315.20 509.34 315.50C508.82 315.80 508.27 316.07 507.69 316.31C507.10 316.55 506.49 316.76 505.86 316.93C505.23 317.10 504.58 317.23 503.93 317.32C503.27 317.41 502.62 317.46 501.96 317.48C501.31 317.49 500.66 317.46 500.04 317.39C499.41 317.32 498.81 317.21 498.23 317.06C497.65 316.92 497.11 316.73 496.61 316.51C496.10 316.29 495.64 316.04 495.23 315.75C494.82 315.47 494.46 315.16 494.16 314.82C493.85 314.48 493.61 314.12 493.43 313.74C493.24 313.37 493.12 312.97 493.07 312.57C493.01 312.17 493.02 311.76 493.09 311.34C493.16 310.93 493.30 310.52 493.50 310.11C493.70 309.70 493.95 309.30 494.27 308.91C494.59 308.53 494.96 308.16 495.38 307.80C495.81 307.45 496.28 307.13 496.79 306.83C497.30 306.52 497.85 306.25 498.44 306.01C499.02 305.77 499.63 305.57 500.27 305.40C500.90 305.23 501.54 305.10 502.20 305.01C502.86 304.92 503.51 304.86 504.17 304.85C504.82 304.84 505.46 304.87 506.09 304.94C506.72 305.01 507.32 305.12 507.90 305.26C508.48 305.41 509.02 305.60 509.52 305.82C510.03 306.04 510.48 306.29 510.90 306.57C511.31 306.86 511.66 307.17 511.97 307.51C512.27 307.85 512.52 308.21 512.70 308.58C512.88 308.96 513.00 309.35 513.06 309.76Z';

const capStyle = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };

const Strokes = ({ strokes, paint, scale = 1, ...rest }) =>
  strokes.map((s, i) => (
    <path key={i} d={s.d} stroke={paint} strokeWidth={s.w * scale} {...capStyle} {...rest} />
  ));

/*
 * Glass paint. `tone` picks the material for the surface it sits on:
 * "clear" is the white glass for Carbon, "smoke" the dark glass for Paper.
 * Both stay colorless.
 */
// Region every mask and gradient is resolved against. Gradients must be in
// user space, not per-path: the star and crossbar strokes are dead-horizontal,
// so their path bounding box is zero high and an objectBoundingBox gradient
// would be undefined across them. One shared axis also means a single light
// direction for the whole mark instead of one per letter.
const FIELD = { x: 130, y: 157, width: 590, height: 320 };
const LIGHT = { x1: 0, y1: 175, x2: 0, y2: 400 };

const GlassDefs = ({ uid, strokes, tone }) => {
  const clear = tone === 'clear';
  return (
    <defs>
      <linearGradient id={`${uid}-body`} gradientUnits="userSpaceOnUse" {...LIGHT}>
        <stop offset="0%" stopColor={clear ? '#FFFFFF' : '#000000'} stopOpacity={clear ? 0.46 : 0.4} />
        <stop offset="38%" stopColor={clear ? '#FFFFFF' : '#000000'} stopOpacity={clear ? 0.26 : 0.24} />
        <stop offset="100%" stopColor={clear ? '#FFFFFF' : '#000000'} stopOpacity={clear ? 0.14 : 0.48} />
      </linearGradient>

      {/* Specular run along the top of each tube. */}
      <linearGradient id={`${uid}-sheen`} gradientUnits="userSpaceOnUse" {...LIGHT}>
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity={clear ? 0.95 : 0.6} />
        <stop offset="60%" stopColor="#FFFFFF" stopOpacity={clear ? 0.35 : 0.18} />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>

      {/* Contact shade along the bottom, which is what reads as thickness. */}
      <linearGradient id={`${uid}-shade`} gradientUnits="userSpaceOnUse" {...LIGHT}>
        <stop offset="0%" stopColor="#000000" stopOpacity="0" />
        <stop offset="55%" stopColor="#000000" stopOpacity={clear ? 0.07 : 0.2} />
        <stop offset="100%" stopColor="#000000" stopOpacity={clear ? 0.3 : 0.6} />
      </linearGradient>

      {/* The hard glint. Narrow and unblurred, this is what sells it as glass
          rather than as a soft plastic tube. */}
      <linearGradient id={`${uid}-spark`} gradientUnits="userSpaceOnUse" {...LIGHT}>
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity={clear ? 1 : 0.85} />
        <stop offset="45%" stopColor="#FFFFFF" stopOpacity={clear ? 0.6 : 0.4} />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>

      {/* Confines sheen and shade to the letterform. */}
      <mask id={`${uid}-shape`} maskUnits="userSpaceOnUse" {...FIELD}>
        <Strokes strokes={strokes} paint="#fff" />
      </mask>

      {/* Punches the counter of the E out of the finished mark. */}
      <mask id={`${uid}-counter`} maskUnits="userSpaceOnUse" {...FIELD}>
        <rect {...FIELD} fill="#fff" />
        <path d={COUNTER_PATH} fill="#000" />
      </mask>

      <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>
  );
};

const GlassBody = ({ uid, strokes }) => (
  <g mask={`url(#${uid}-counter)`}>
    <Strokes strokes={strokes} paint={`url(#${uid}-body)`} />
    <g mask={`url(#${uid}-shape)`}>
      <g filter={`url(#${uid}-soft)`}>
        <g transform="translate(0 13)">
          <Strokes strokes={strokes} paint={`url(#${uid}-shade)`} scale={0.72} />
        </g>
        <g transform="translate(0 -15)">
          <Strokes strokes={strokes} paint={`url(#${uid}-sheen)`} scale={0.3} />
        </g>
      </g>
      <g transform="translate(0 -18)">
        <Strokes strokes={strokes} paint={`url(#${uid}-spark)`} scale={0.1} />
      </g>
    </g>
  </g>
);

/*
 * The mark is genuinely transparent: a masked surface carries a
 * backdrop-filter, so whatever scrolls underneath shows through the
 * letterforms, blurred and brightened rather than hidden. The SVG on top only
 * adds the tint and the speculars.
 *
 * The mask is the letterforms rendered as an image. The counter of the E is
 * punched inside the SVG rather than by the CSS mask, so this works with a
 * plain alpha mask and needs no mask-mode support.
 */
const maskUrl = (viewBox, strokes) => {
  const paths = strokes
    .map(
      (s) =>
        `<path d="${s.d}" stroke="#fff" stroke-width="${s.w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    )
    .join('');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">` +
    `<defs><mask id="c" maskUnits="userSpaceOnUse" x="${FIELD.x}" y="${FIELD.y}" width="${FIELD.width}" height="${FIELD.height}">` +
    `<rect x="${FIELD.x}" y="${FIELD.y}" width="${FIELD.width}" height="${FIELD.height}" fill="#fff"/>` +
    `<path d="${COUNTER_PATH}" fill="#000"/></mask></defs>` +
    `<g mask="url(#c)">${paths}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

const maskStyle = (url) => ({
  maskImage: url,
  WebkitMaskImage: url,
  maskSize: 'contain',
  WebkitMaskSize: 'contain',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskPosition: 'center',
  WebkitMaskPosition: 'center',
});

const aspectOf = (viewBox) => {
  const [, , w, h] = viewBox.split(' ').map(Number);
  return `${w} / ${h}`;
};

const GlassShell = ({ className, viewBox, strokes, maskStrokes, tone, title, children }) => {
  const uid = useId().replace(/:/g, '');
  return (
    <span
      className={`jvh-mark ${className}`}
      style={{ aspectRatio: aspectOf(viewBox) }}
      role="img"
      aria-label={title}
    >
      <span aria-hidden className={`jvh-glass jvh-glass--${tone}`} style={maskStyle(maskUrl(viewBox, maskStrokes ?? strokes))} />
      <svg aria-hidden viewBox={viewBox} className="jvh-mark__art" focusable="false">
        <GlassDefs uid={uid} strokes={strokes} tone={tone} />
        <GlassBody uid={uid} strokes={strokes} />
        {children}
      </svg>
    </span>
  );
};

/**
 * Signature — the primary mark. Use wherever the name has to read as a name.
 * `tone`: "clear" (light glass, for Carbon) or "smoke" (dark glass, for Paper).
 */
export const BrandSignature = ({ className = '', tone = 'clear', title = 'Joel van Hees' }) => (
  <GlassShell
    className={className}
    viewBox={SIGNATURE_VIEWBOX}
    strokes={[...J_STROKES, ...REST_STROKES]}
    tone={tone}
    title={title}
  />
);

/**
 * Full lockup — glass signature over the flat "VAN HEES" descriptor. The
 * descriptor stays flat: at its weight a glass treatment would only muddy it,
 * so it is painted on top and left out of the mask.
 */
export const BrandLockup = ({ className = '', tone = 'clear', title = 'Joel van Hees' }) => {
  const strokes = [...J_STROKES, ...REST_STROKES];
  return (
    <GlassShell
      className={className}
      viewBox={LOCKUP_VIEWBOX}
      strokes={strokes}
      tone={tone}
      title={title}
    >
      <g opacity={tone === 'clear' ? 0.92 : 0.8}>
        <Strokes strokes={WORDMARK_STROKES} paint={tone === 'clear' ? '#FFFFFF' : '#050505'} />
      </g>
    </GlassShell>
  );
};

/**
 * Compact mark — the Signal J alone, for avatars and anywhere the full
 * signature would fall under its minimum size.
 */
export const BrandMark = ({ className = '', tone = 'clear', title = 'Joel van Hees' }) => (
  <GlassShell
    className={className}
    viewBox={MARK_VIEWBOX}
    strokes={J_STROKES}
    tone={tone}
    title={title}
  />
);

export default BrandSignature;
