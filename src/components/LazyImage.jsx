import { useState } from 'react';

const LazyImage = ({ src, alt, className, onClick, ...props }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative w-full h-full ${loaded ? '' : 'animate-pulse bg-neutral-200/50 dark:bg-white/5 border border-white/5 rounded-xl'}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`${className || ''} transition-opacity duration-500 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClick}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
