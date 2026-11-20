import { useEffect, useRef } from 'react';
import { createWafStream } from './wafStream';

// Background-only WAF animation (no text). Fills its parent; give the parent a size.
const WafStreamVisual = ({ className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const stream = createWafStream(canvas);
    // Only animate while on screen.
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? stream.start() : stream.stop()));
    io.observe(canvas);
    return () => { io.disconnect(); stream.destroy(); };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`block w-full h-full pointer-events-none ${className}`}
    />
  );
};

export default WafStreamVisual;
