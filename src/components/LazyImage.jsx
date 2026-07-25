import { useState } from 'react';

/*
 * Without an error path a failed image left the placeholder pulsing forever
 * and the <img> stuck at opacity 0 — an image that 404s or is blocked looked
 * exactly like one still loading, permanently. A failure now settles into a
 * quiet static slot instead.
 */
const LazyImage = ({ src, alt, className, onClick, ...props }) => {
  const [status, setStatus] = useState('loading');

  return (
    <div
      className={`relative w-full h-full ${
        status === 'loading'
          ? 'animate-pulse bg-neutral-200/50 dark:bg-white/5 border border-white/5 rounded-xl'
          : status === 'failed'
            ? 'bg-neutral-200/40 dark:bg-white/[0.03] rounded-xl'
            : ''
      }`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('failed')}
        className={`${className || ''} transition-opacity duration-500 ease-out ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClick}
        {...props}
      />
      {status === 'failed' && (
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center px-3 text-center font-meta text-[10px] uppercase tracking-widest opacity-40"
        >
          {alt || 'Image unavailable'}
        </span>
      )}
    </div>
  );
};

export default LazyImage;
