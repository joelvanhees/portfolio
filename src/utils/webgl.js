/*
 * WebGL availability, probed once.
 *
 * Managed laptops routinely ship with WebGL disabled by policy or blocked by a
 * GPU driver blocklist. three.js throws when it cannot get a context, and an
 * uncaught throw during render takes the whole React tree down — which on this
 * site means an empty #root over a near-black body, i.e. a blank page.
 *
 * Every WebGL-backed component asks here first and renders a static fallback
 * instead of attempting a context it cannot have.
 */

let cached = null;

export const hasWebGL = () => {
  if (cached !== null) return cached;
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    cached = Boolean(gl);
    // Release the probe context immediately; browsers cap how many may exist.
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
};

/*
 * Even with a context available, creation can still fail — a lost context, an
 * exhausted context pool, a driver giving up. This keeps that failure local to
 * the component instead of letting it escape into the render tree.
 */
export const createRendererSafely = (factory) => {
  if (!hasWebGL()) return null;
  try {
    return factory();
  } catch (error) {
    console.warn('WebGL renderer unavailable, falling back:', error?.message ?? error);
    return null;
  }
};

// Keeps big buffers off weak integrated GPUs.
export const safePixelRatio = () => Math.min(window.devicePixelRatio || 1, 2);
