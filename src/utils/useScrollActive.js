import { useEffect, useRef, useState } from 'react';

/*
 * Which item in a list is currently "at" the reading line.
 *
 * Used to light up one row at a time as the visitor scrolls, so a long list
 * reads as a position indicator rather than a static block. Returns -1 while
 * nothing is in range.
 *
 * Measurement is one rect read per item per animation frame, and only while
 * scrolling — cheap enough for the handful of rows this is used on.
 */
export const useScrollActive = (count, { line = 0.42, minScroll = 0 } = {}) => {
  const refs = useRef([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      // Nothing is active before the visitor has scrolled. Without this the
      // entry nearest the line at rest is lit the moment the page loads, which
      // reads as a mis-set colour rather than as a scroll position.
      if (window.scrollY < minScroll) {
        setActive((current) => (current === -1 ? current : -1));
        return;
      }
      const focus = window.innerHeight * line;
      let best = -1;
      let bestDistance = Infinity;
      refs.current.slice(0, count).forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const distance = Math.abs((rect.top + rect.bottom) / 2 - focus);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });
      setActive((current) => (current === best ? current : best));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    // Deferred, not called inline: writing state straight from an effect body
    // costs an extra render pass.
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [count, line, minScroll]);

  const setRef = (i) => (el) => {
    refs.current[i] = el;
  };

  return { active, setRef };
};

export default useScrollActive;
