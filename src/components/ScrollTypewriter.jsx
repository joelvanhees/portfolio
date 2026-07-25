import { useEffect, useRef } from 'react';

/*
 * Text that types itself out as the visitor scrolls through it.
 *
 * The character count is a function of scroll position, not of elapsed time,
 * so scrolling fast types fast, scrolling back untypes, and stopping stops the
 * typing dead — which is what makes it read as live rather than as a canned
 * animation.
 *
 * Every character is its own span, hidden with `visibility` rather than being
 * removed, so the paragraph occupies its final size from the first frame and
 * nothing below it reflows while typing. Characters start visible and are
 * hidden by the effect, so if the script never runs the full text is simply
 * there.
 */
const ScrollTypewriter = ({ text, className = '', start = 0.9, end = 0.35 }) => {
  const hostRef = useRef(null);
  const charsRef = useRef([]);
  const shownRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const chars = charsRef.current.filter(Boolean);
    if (!host || !chars.length) return undefined;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduced) return undefined; // leave the text as rendered: fully visible

    let frame = 0;

    const apply = (next) => {
      const previous = shownRef.current ?? chars.length;
      if (next === previous) return;
      const from = Math.min(next, previous);
      const to = Math.max(next, previous);
      for (let i = from; i < to; i += 1) {
        chars[i].style.visibility = i < next ? 'visible' : 'hidden';
      }
      shownRef.current = next;
    };

    const measure = () => {
      frame = 0;
      const rect = host.getBoundingClientRect();
      const from = window.innerHeight * start;
      const to = window.innerHeight * end;
      const progress = (from - rect.top) / Math.max(from - to, 1);
      apply(Math.round(Math.min(Math.max(progress, 0), 1) * chars.length));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      chars.forEach((c) => {
        c.style.visibility = '';
      });
    };
  }, [text, start, end]);

  return (
    <span ref={hostRef} className={className}>
      {Array.from(text).map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            charsRef.current[i] = el;
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default ScrollTypewriter;
