import { useRef } from 'react';
import { Video } from 'lucide-react';

const HoverVideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((e) => console.log("Video play failed:", e));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      className="w-full h-full relative bg-black group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!src ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30">
          <Video size={48} />
        </div>
      ) : (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
        />
      )}

      <div className="absolute bottom-4 right-4 text-[10px] font-mono border px-2 py-1 rounded bg-black/50 text-white border-white/20 z-20">
        [VIDEO_FEED]
      </div>
    </div>
  );
};

export default HoverVideoPlayer;
