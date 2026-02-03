import { timeline } from '../content/timeline';

const WorkView = ({ darkMode }) => {
  return (
    <div className="pt-32 px-6 min-h-screen max-w-7xl mx-auto pb-40">
      <h1 className="text-[12vw] md:text-9xl font-rubik font-bold mb-24 w-full break-words uppercase">
        <span className="glitch-hover cursor-default block">TIMELINE_</span>
      </h1>

      <div className="relative border-l border-current ml-4 md:ml-12 pl-12 md:pl-24 space-y-24 pb-24">
        {timeline.map((item, i) => (
          <div key={i} className="relative group">
            <div className={`absolute -left-[53px] md:-left-[101px] top-2 w-4 h-4 rounded-full border-2 border-current bg-transparent transition-all duration-300 group-hover:bg-current ${darkMode ? 'group-hover:shadow-[0_0_20px_rgba(0,255,65,0.5)]' : 'group-hover:shadow-[0_0_20px_rgba(0,85,255,0.5)]'}`}></div>
            <span className="font-mono text-sm opacity-50 mb-2 block">{item.year}</span>
            <h3 className="text-3xl md:text-5xl font-rubik font-bold uppercase mb-4">
              <span className="glitch-hover cursor-default block">{item.role}</span>
            </h3>
            <p className="max-w-xl text-lg opacity-80 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkView;
