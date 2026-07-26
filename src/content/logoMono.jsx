/*
 * The monoline signature — Joel van Hees Identity System V03.1.
 *
 * Vector geometry taken 1:1 from the brand book master. Every stroke inherits
 * `currentColor`, so the mark is whatever ink the surface calls for; on the
 * light theme that is flat black, which is the point — no glass, no
 * transparency, just the drawn signature.
 *
 * The counter of the E is punched out with a mask rather than filled with the
 * background colour, so the mark sits on Paper, Acid or a photograph without
 * carrying a halo of the wrong colour with it.
 */

// `id` is supplied per instance: two marks on one page must not capture each
// other's mask.
const Counter = ({ id, height }) => (
  <mask id={id} maskUnits="userSpaceOnUse" x="140.32" y="167.44" width="569.36" height={height}>
    <rect x="140.32" y="167.44" width="569.36" height={height} fill="#fff" />
    <path
      d="M513.06 309.76C513.12 310.16 513.11 310.57 513.04 310.99C512.96 311.40 512.83 311.81 512.63 312.22C512.43 312.63 512.17 313.03 511.86 313.42C511.54 313.80 511.17 314.17 510.74 314.52C510.32 314.87 509.85 315.20 509.34 315.50C508.82 315.80 508.27 316.07 507.69 316.31C507.10 316.55 506.49 316.76 505.86 316.93C505.23 317.10 504.58 317.23 503.93 317.32C503.27 317.41 502.62 317.46 501.96 317.48C501.31 317.49 500.66 317.46 500.04 317.39C499.41 317.32 498.81 317.21 498.23 317.06C497.65 316.92 497.11 316.73 496.61 316.51C496.10 316.29 495.64 316.04 495.23 315.75C494.82 315.47 494.46 315.16 494.16 314.82C493.85 314.48 493.61 314.12 493.43 313.74C493.24 313.37 493.12 312.97 493.07 312.57C493.01 312.17 493.02 311.76 493.09 311.34C493.16 310.93 493.30 310.52 493.50 310.11C493.70 309.70 493.95 309.30 494.27 308.91C494.59 308.53 494.96 308.16 495.38 307.80C495.81 307.45 496.28 307.13 496.79 306.83C497.30 306.52 497.85 306.25 498.44 306.01C499.02 305.77 499.63 305.57 500.27 305.40C500.90 305.23 501.54 305.10 502.20 305.01C502.86 304.92 503.51 304.86 504.17 304.85C504.82 304.84 505.46 304.87 506.09 304.94C506.72 305.01 507.32 305.12 507.90 305.26C508.48 305.41 509.02 305.60 509.52 305.82C510.03 306.04 510.48 306.29 510.90 306.57C511.31 306.86 511.66 307.17 511.97 307.51C512.27 307.85 512.52 308.21 512.70 308.58C512.88 308.96 513.00 309.35 513.06 309.76Z"
      fill="#000"
    />
  </mask>
);

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

// The J — ascender, bowl and the crossed accent above it.
const JStrokes = () => (
  <>
    <path d="M253.79 174.39L253.79 244.33" strokeWidth="13.983" />
    <path
      d="M253.79 233.45C249.13 272.31 249.91 315.83 253.79 348.47C257.68 380.33 238.26 398.98 211.08 397.42C187.01 395.87 173.03 384.99 165.27 368.67"
      strokeWidth="49.717"
    />
    <path
      d="M229.72 199.26L280.97 199.26M235.16 180.61L271.65 219.46M279.42 182.94L236.71 218.69"
      strokeWidth="10.099"
    />
  </>
);

// o — e — l, the remainder of the signature.
const RestStrokes = () => (
  <>
    <path
      d="M286.41 317.38C277.87 275.42 309.70 247.44 350.86 251.32C392.79 255.21 409.10 295.62 392.02 329.81C374.93 364.01 321.35 371.00 295.73 339.14C273.21 311.16 291.07 279.30 329.12 276.19C367.17 273.08 398.23 292.51 420.75 315.83"
      strokeWidth="49.717"
    />
    <path
      d="M423.08 316.60C437.06 283.96 489.09 274.64 514.71 297.18C539.56 318.94 514.71 337.59 454.14 329.81C459.58 365.56 512.38 379.55 548.88 342.25C562.08 329.04 569.85 315.05 575.28 300.28"
      strokeWidth="49.717"
    />
    <path
      d="M604.01 238.89C593.92 219.46 603.24 201.59 621.87 205.47C641.29 210.14 637.41 231.12 630.42 249.77C617.22 286.30 614.89 322.82 620.32 350.02C626.53 380.33 654.49 390.43 684.77 367.12"
      strokeWidth="49.717"
    />
  </>
);

// The "VAN HEES" baseline of the full lockup.
const Descriptor = () => (
  <g {...strokeProps}>
    <path
      d="M336.88 440.94L345.43 464.26L353.97 440.94M363.29 464.26L371.83 440.94L380.37 464.26M366.39 456.49L377.26 456.49M389.69 464.26L389.69 440.94L406.77 464.26L406.77 440.94"
      strokeWidth="3.496"
    />
    <path
      d="M433.95 440.94L433.95 464.26M451.04 440.94L451.04 464.26M433.95 452.60L451.04 452.60M461.91 440.94L478.99 440.94M461.91 452.60L475.88 452.60M461.91 464.26L478.99 464.26M489.86 440.94L506.95 440.94M489.86 452.60L503.84 452.60M489.86 464.26L506.95 464.26M532.57 443.28C528.69 440.17 518.59 439.39 516.26 445.61C513.16 454.16 534.13 450.27 533.35 458.82C532.57 465.81 520.15 466.59 514.71 461.15"
      strokeWidth="3.496"
    />
  </g>
);

/** Full lockup: signature plus the VAN HEES baseline. */
export const MonoLockup = ({ maskId }) => (
  <>
    <Counter id={maskId} height="298.96" />
    <g {...strokeProps} mask={`url(#${maskId})`}>
      <JStrokes />
      <RestStrokes />
    </g>
    <Descriptor />
  </>
);

/** Compact mark: the Signal J alone. */
export const MonoMark = () => (
  <g {...strokeProps}>
    <JStrokes />
  </g>
);
