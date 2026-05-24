import { useEffect, useState } from 'react';
import logoJpg from '../assets/images/vanhees_logo.jpg';

const TransparentLogo = ({ className = '', alt = 'van Hees Logo' }) => {
  const [src, setSrc] = useState(logoJpg);

  useEffect(() => {
    const img = new Image();
    img.src = logoJpg;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        // Loop through all pixels and make black background transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          
          // Pure black or close-to-black pixels (R, G, B < 30) are made transparent
          if (r < 30 && g < 30 && b < 30) {
            data[i+3] = 0; // set alpha channel to 0
          }
        }
        ctx.putImageData(imgData, 0, 0);
        setSrc(canvas.toDataURL('image/png'));
      } catch (e) {
        console.error('Canvas processing failed, using fallback source', e);
      }
    };
  }, []);

  return (
    <img 
      src={src} 
      className={`object-contain pointer-events-none ${className}`} 
      alt={alt} 
      style={{ mixBlendMode: 'normal' }}
    />
  );
};

export default TransparentLogo;
