/*
 * Scroll reveal — marked blocks rise into place as they enter the viewport.
 *
 * SAFETY CONTRACT
 * The CSS that hides an element is gated behind the `reveal-ready` class this
 * module sets on <html>. If the bundle fails to load, if the module throws, if
 * IntersectionObserver is missing, or if the visitor asked for reduced motion,
 * that class is never set and every block renders in its normal visible state.
 * The CSS carries the same guard a second time as a media query.
 *
 * The worst outcome of a bug in here is content that appears without
 * animating. Content that stays invisible is not a reachable state.
 */

const READY_CLASS = 'reveal-ready';
const DONE_CLASS = 'is-revealed';
const SELECTOR = '[data-reveal]';

let observer = null;
let mutations = null;
let frame = 0;

const canReveal = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  if (typeof IntersectionObserver === 'undefined') return false;
  // Honour the OS-level motion preference; the CSS checks this too.
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
};

// Blocks being watched but not yet revealed. Keeping the set lets the scroll
// handler cost nothing once the page has finished revealing.
const pending = new Set();

const reveal = (el) => {
  el.classList.add(DONE_CLASS);
  pending.delete(el);
  observer?.unobserve(el);
};

/*
 * Safety sweep.
 *
 * IntersectionObserver only reports what is intersecting at the moments it
 * samples. A fast flick-scroll on a phone can carry the viewport past a whole
 * block between two frames, and that block is then never reported — it would
 * sit invisible for the rest of the session. This catches anything the
 * observer skipped: if a block's top has passed the trigger line, it is shown,
 * whether or not the observer ever saw it.
 */
const sweep = () => {
  if (!pending.size) return;
  const line = window.innerHeight * 0.9;
  pending.forEach((el) => {
    // A view swap can unmount a block before it was ever revealed.
    if (!el.isConnected) {
      pending.delete(el);
      return;
    }
    if (el.getBoundingClientRect().top < line) reveal(el);
  });
};

/** Observe any marked block that has not been revealed yet. Safe to re-run. */
export const scan = () => {
  if (!observer) return;
  document.querySelectorAll(`${SELECTOR}:not(.${DONE_CLASS})`).forEach((el) => {
    pending.add(el);
    observer.observe(el);
  });
};

const scheduleScan = () => {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    scan();
  });
};

// One rect read per frame at most, and only while blocks are still pending.
let sweepFrame = 0;
const onScroll = () => {
  // Once everything has landed this is a single Set size check per event.
  if (sweepFrame || !pending.size) return;
  sweepFrame = requestAnimationFrame(() => {
    sweepFrame = 0;
    sweep();
  });
};

export const stop = () => {
  if (frame) cancelAnimationFrame(frame);
  if (sweepFrame) cancelAnimationFrame(sweepFrame);
  frame = 0;
  sweepFrame = 0;
  pending.clear();
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
  mutations?.disconnect();
  mutations = null;
  observer?.disconnect();
  observer = null;
  document.documentElement.classList.remove(READY_CLASS);
};

export const start = () => {
  if (observer) return stop;
  if (!canReveal()) return () => {};

  try {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      // Trigger a little before the block is fully on screen so the motion
      // reads as part of the scroll rather than as a pop once it has landed.
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    );

    document.documentElement.classList.add(READY_CLASS);
    scan();

    // Blocks mounted later — a view swap, a lazily loaded section — are picked
    // up without every component having to opt in. The nodeType check drops
    // text mutations first, which is what the scrambling headline and the
    // typing console produce constantly.
    mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches?.(SELECTOR) || node.querySelector?.(SELECTOR)) {
            scheduleScan();
            return;
          }
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  } catch {
    // Any failure here must leave the page in its plain, visible state.
    stop();
    return () => {};
  }

  return stop;
};
