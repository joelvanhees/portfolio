import { posterSeriesSlides } from '../../content/posterSeries';

const InfiniteMarqueeVisual = () => {
  return (
    <div className="w-full h-full bg-[#111] overflow-hidden flex items-center relative select-none">
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
      <div className="flex w-max animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused]">
        {[...posterSeriesSlides, ...posterSeriesSlides].map((slide, i) => (
          <div key={i} className="flex flex-col w-[140px] md:w-[180px] mx-4 flex-shrink-0">
            <div className="aspect-[2/3] w-full overflow-hidden border border-white/10 mb-3 bg-black">
              <img src={slide.img} alt={slide.target} className="w-full h-full object-cover" />
            </div>
            <div className="font-mono text-[9px] leading-tight text-white/60">
              <strong className="block text-white mb-1">{slide.target}</strong>
              {slide.caption}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,black_0%,transparent_5%,transparent_95%,black_100%)]"></div>
    </div>
  );
};

export default InfiniteMarqueeVisual;
