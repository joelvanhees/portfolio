import { useEffect, useState } from 'react';
import { ArrowUpRight, Layers, Video } from 'lucide-react';
import SkillNetwork from '../components/SkillNetwork';
import SpiralTimeSphere from '../components/visuals/SpiralTimeSphere';
import { homeCapabilities } from '../content/services';

const HomeView = ({ darkMode, projects, setSelectedProject, selectedProject }) => {
  const [terminalLine, setTerminalLine] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    const sequence = [
      { line: 1, delay: 500 },
      { line: 2, delay: 1200 },
      { line: 3, delay: 2000 },
      { line: 4, delay: 2800 },
      { line: 5, delay: 3500 },
      { line: 6, delay: 4000 },
      { line: 7, delay: 4400 },
      { line: 8, delay: 4800 },
      { line: 9, delay: 5500 },
      { line: 10, delay: 6500 },
    ];

    const timeouts = sequence.map(step =>
      setTimeout(() => {
        setTerminalLine(step.line);
        if (step.line === 10) setTimeout(() => setBootComplete(true), 1000);
      }, step.delay),
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <>
      <header className="relative min-h-screen flex flex-col justify-center px-6 pt-20 overflow-hidden">
        <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${darkMode ? 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]' : 'bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] bg-[size:24px_24px]'}`}></div>

        <div className="max-w-7xl mx-auto w-full z-10">
          <div className="flex flex-col gap-0">
            <p className={`text-sm md:text-base mb-4 tracking-widest uppercase ${darkMode ? 'text-green-500' : 'text-blue-600'}`}>
              <span className="animate-pulse">●</span> System Online
            </p>

            <h1 className="font-rubik text-[13vw] md:text-[11.5vw] leading-[0.8] tracking-tighter uppercase select-none w-full">
              <div className="glitch-hover cursor-default transition-colors block whitespace-nowrap text-left">Visual</div>
              <div className="glitch-hover cursor-default transition-colors opacity-80 block whitespace-nowrap text-center">Story</div>
              <div className="glitch-hover cursor-default transition-colors text-right block whitespace-nowrap">Teller</div>
            </h1>
          </div>

          <div className="mt-12 md:mt-24 flex flex-col md:flex-row justify-between items-end border-t border-current pt-6 opacity-80">
            <div className="max-w-md">
              <p className="text-lg md:text-xl leading-relaxed">
                Visual systems for brands, interfaces and narrative experiences.
              </p>
            </div>
            <div className="mt-6 md:mt-0 text-right font-mono text-xs md:text-sm">
              SCROLL TO INITIALIZE <br /> ↓
            </div>
          </div>
        </div>
      </header>

      <section id="about" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="sticky top-24">
            <h2 className="text-4xl md:text-6xl font-rubik font-bold mb-8 uppercase">
              <span className="glitch-hover cursor-default block">The Operator</span>
            </h2>
            <p className="text-xl leading-relaxed mb-6">
              I am a graphic designer working across brand systems, generative design and visual storytelling.
            </p>
            <p className="opacity-70 leading-relaxed mb-8 font-mono text-sm">
              My practice combines classical design discipline with experimental technologies to create scalable visual identities.
            </p>
            <div className="flex gap-4">
              <span className="border border-current px-4 py-2 rounded-full text-sm uppercase">Storyteller</span>
              <span className="border border-current px-4 py-2 rounded-full text-sm uppercase">Designer</span>
              <span className="border border-current px-4 py-2 rounded-full text-sm uppercase">Artist</span>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className={`p-6 rounded-lg font-mono text-xs md:text-sm leading-6 shadow-2xl overflow-hidden relative transition-all duration-1000 ${darkMode ? 'bg-[#0A0A0A] border border-green-900/50' : 'bg-white border border-gray-200'} flex items-center justify-center min-h-[60vh]`}>
              <div className="absolute top-6 left-6 flex gap-2 mb-4 opacity-50 z-20">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>

              <div className={`${darkMode ? 'text-green-500' : 'text-blue-600'} transition-opacity duration-500 w-full ${bootComplete ? 'opacity-0 absolute pointer-events-none' : 'opacity-100 relative'}`}>
                {terminalLine >= 1 && <p>{'>'} INITIATING IDENTITY SEQUENCE...</p>}
                {terminalLine >= 2 && <p>{'>'} SUBJECT: JOEL_VAN_HEES</p>}
                {terminalLine >= 3 && <p>{'>'} STATUS: AWAKENED</p>}
                {terminalLine >= 4 && <p className="mt-2">&nbsp;</p>}
                {terminalLine >= 5 && <p>{'>'} LOAD_SKILLS:</p>}
                {terminalLine >= 6 && <p className="pl-4 text-opacity-80 text-current">- Worldbuilding.exe [LOADED]</p>}
                {terminalLine >= 7 && <p className="pl-4 text-opacity-80 text-current">- Nasalica_Universe.dat [EXPANDING]</p>}
                {terminalLine >= 8 && <p className="pl-4 text-opacity-80 text-current">- Product_Dev_Engine.obj [ACTIVE]</p>}
                {terminalLine >= 9 && <p className="mt-2">&nbsp;</p>}
                {terminalLine >= 10 && <p className="animate-pulse">{'>'} SYSTEM_MAP: RENDERING…</p>}
              </div>

              <div className={`transition-all duration-1000 ease-out absolute inset-0 ${bootComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {bootComplete && <SkillNetwork darkMode={darkMode} className="absolute inset-0 w-full h-full border-none bg-transparent" />}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className={`py-24 px-6 ${darkMode ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between mb-16 border-b border-current pb-4">
            <h2 className="text-sm font-mono uppercase tracking-widest">Selected Data</h2>
            <span className="text-xs opacity-50">INDEX: 00—06</span>
          </div>

          <div className="grid grid-cols-1 gap-20">
            {projects.map((project) => (
              <div key={project.id} onClick={() => setSelectedProject(project)} className="group cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-4">
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded mb-2 inline-block ${darkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                      {project.category}
                    </span>
                    <h3 className={`text-4xl md:text-6xl font-rubik font-bold mt-2 transition-all duration-300 ${project.id === "02" ? "lowercase" : "uppercase"}`}>
                      <span className="glitch-hover cursor-default block">{project.title}</span>
                    </h3>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    VIEW CASE <ArrowUpRight size={16} />
                  </div>
                </div>

                <div className={`relative w-full overflow-hidden bg-gray-800 mb-6 rounded-lg ${
                  project.id === "01" ? "aspect-[9/16] md:w-1/3 mx-auto" : "aspect-video md:aspect-[2.5/1]"
                }`}>
                  <div className={`absolute inset-0 z-10 transition-opacity duration-500 opacity-20 group-hover:opacity-0 ${darkMode ? 'bg-black' : 'bg-white'}`}></div>

                  <div className={`w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-105 ${darkMode ? 'bg-[#111]' : 'bg-[#e5e5e5]'}`}>
                    {(project.visualComponent || project.id === "02" || project.id === "01") ? (
                      <div className="w-full h-full opacity-100 transition-opacity">
                        {project.id === "01" ? (
                          <video
                            src="/videos/ikea_reel.mp4"
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : project.id === "02" ? (
                          (selectedProject?.id === "02") ? (
                            <div className="w-full h-full flex items-center justify-center opacity-20">
                              <Layers size={64} />
                            </div>
                          ) : (
                            <SpiralTimeSphere />
                          )
                        ) : (
                          <div className="w-full h-full">
                            {project.visualComponent}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="opacity-20">
                        {project.id === "01" ? <Video size={64} /> : <Layers size={64} />}
                      </div>
                    )}

                    {(project.id === "02" || project.id === "01") && (
                      <div className="absolute top-4 right-4 text-[10px] font-mono border px-2 py-1 rounded bg-black/50 text-white border-white/20">
                        {project.id === "01" ? "[VIDEO_CONTENT]" : "[LIVE_RENDER]"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-current pt-4 opacity-70 group-hover:opacity-100 transition-opacity">
                  <div className="md:col-span-2">
                    <p>{project.description}</p>
                  </div>
                  <div className="md:col-span-2 flex justify-start md:justify-end gap-4 font-mono text-xs uppercase flex-wrap">
                    {project.tech.map(t => <span key={t}>[{t}]</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-24 px-6 pb-40">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm font-mono uppercase tracking-widest mb-12">Capabilities</h2>

          <div className="flex flex-col">
            {homeCapabilities.map((service) => (
              <div key={service.title} className="border-t border-current py-8 group hover:pl-4 transition-all duration-300 cursor-default">
                <div className="flex flex-col md:flex-row justify-between items-baseline">
                  <h3 className="text-3xl md:text-5xl font-rubik font-bold uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-gray-500 to-current">
                    <span className="glitch-hover cursor-default block">{service.title}</span>
                  </h3>
                  <p className="mt-2 md:mt-0 font-mono text-sm opacity-60 group-hover:opacity-100">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
            <div className="border-t border-current"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeView;
