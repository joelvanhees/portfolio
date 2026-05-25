import { lazy, Suspense } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Layers, Video } from 'lucide-react';
import SkillNetwork from '../components/SkillNetwork';
const SpiralTimeSphere = lazy(() => import('../components/visuals/SpiralTimeSphere'));
import { homeCapabilities } from '../content/services';
import salatProfileImg from '../assets/images/salat_profile.png';
import LazyImage from '../components/LazyImage';
import { playUiSound } from '../utils/sounds';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?<>[]{}=/\\|~^';

function ScrambleText({ text, duration = 800, darkMode }) {
  const chars = text.split('');
  const [displayed, setDisplayed] = useState(() => 
    chars.map(char => char === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])
  );
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    let timer;

    timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed >= duration) {
        clearInterval(timer);
        setDisplayed(chars);
        setResolved(true);
      } else {
        const progress = elapsed / duration;
        const numResolved = Math.floor(progress * chars.length);
        
        setDisplayed(
          chars.map((char, i) => {
            if (char === ' ') return ' ';
            if (i < numResolved) return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
        );
      }
    }, 40);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [text, duration]);

  return (
    <span className={`transition-colors duration-500 ${resolved ? '' : (darkMode ? 'text-[#00FF41]' : 'text-[#0055FF]')}`}>
      {displayed.join('')}
    </span>
  );
}

const HomeView = ({ darkMode, projects, setSelectedProject, selectedProject, handleNav, setCooldownActive }) => {
  const [terminalLine, setTerminalLine] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const [selectedRoles, setSelectedRoles] = useState({
    Storyteller: true,
    Designer: false,
    Artist: false
  });

  const toggleRole = (role) => {
    setSelectedRoles(prev => ({
      ...prev,
      [role]: !prev[role]
    }));
  };

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

  const canvasRef = useRef(null);
  const headerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const scrollFadeRef = useRef(1);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const fade = Math.max(0, 1 - totalScroll / (docHeight || 800));
      scrollFadeRef.current = fade;
      if (canvasRef.current) {
        canvasRef.current.style.opacity = fade;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      const currentFade = scrollFadeRef.current;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      if (currentFade <= 0.01) {
        ctx.clearRect(0, 0, width, height);
        animationId = requestAnimationFrame(render);
        return;
      }

      time += 0.012;

      ctx.clearRect(0, 0, width, height);

      const cellSize = isMobile ? 70 : 75;
      const cols = Math.floor(width / cellSize) + 2;
      const rows = Math.floor(height / cellSize) + 2;

      // 1. Pre-compute displacement array once to cut CPU math calculations in half!
      const displacements = [];
      for (let r = 0; r < rows; r++) {
        displacements[r] = [];
        const gy = (r / (rows - 1)) * height;
        for (let c = 0; c < cols; c++) {
          const gx = (c / (cols - 1)) * width;

          const wave1 = Math.sin(gx * 0.004 + gy * 0.003 + time * 1.2) * 22;
          const wave2 = Math.cos(gx * 0.002 - gy * 0.005 + time * 0.8) * 14;
          const wave3 = Math.sin(-gx * 0.006 + gy * 0.008 + time * 1.5) * 6;
          
          let mouseDist = 0;
          if (mouseRef.current.active) {
            const dx = gx - mouseRef.current.x;
            const dy2 = gy - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy2 * dy2);
            if (dist < 280) {
              mouseDist = Math.sin(dist * 0.04 - time * 3.5) * 65 * (1 - dist / 280);
            }
          }

          displacements[r][c] = (wave1 + wave2 + wave3 + mouseDist) * currentFade;
        }
      }

      ctx.lineWidth = 1.0;

      // 2. Draw horizontal lines
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        const gy = (r / (rows - 1)) * height;

        for (let c = 0; c < cols; c++) {
          const gx = (c / (cols - 1)) * width;
          const drawX = gx;
          const drawY = gy + displacements[r][c];

          if (c === 0) {
            ctx.moveTo(drawX, drawY);
          } else {
            ctx.lineTo(drawX, drawY);
          }
        }

        ctx.strokeStyle = darkMode
          ? `rgba(0, 255, 65, ${currentFade * (0.05 + Math.abs(Math.sin(time + r * 0.1)) * 0.05)})`
          : `rgba(0, 85, 255, ${currentFade * (0.08 + Math.abs(Math.sin(time + r * 0.1)) * 0.05)})`;
        ctx.stroke();
      }

      // 3. Draw vertical lines
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        const gx = (c / (cols - 1)) * width;

        for (let r = 0; r < rows; r++) {
          const gy = (r / (rows - 1)) * height;
          const drawX = gx;
          const drawY = gy + displacements[r][c];

          if (r === 0) {
            ctx.moveTo(drawX, drawY);
          } else {
            ctx.lineTo(drawX, drawY);
          }
        }

        ctx.strokeStyle = darkMode
          ? `rgba(0, 255, 65, ${currentFade * (0.05 + Math.abs(Math.sin(time + c * 0.1)) * 0.05)})`
          : `rgba(0, 85, 255, ${currentFade * (0.08 + Math.abs(Math.sin(time + c * 0.1)) * 0.05)})`;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [darkMode]);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none -z-10" 
        style={{ opacity: 1 }}
      />
        <header 
          ref={headerRef}
          onMouseMove={isMobile ? undefined : handleMouseMove}
          onMouseEnter={isMobile ? undefined : () => { mouseRef.current.active = true; }}
          onMouseLeave={isMobile ? undefined : () => { mouseRef.current.active = false; }}
          onTouchStart={isMobile ? undefined : (e) => {
            mouseRef.current.active = true;
            if (e.touches && e.touches[0]) {
              handleMouseMove(e.touches[0]);
            }
          }}
          onTouchMove={isMobile ? undefined : (e) => {
            if (e.touches && e.touches[0]) {
              handleMouseMove(e.touches[0]);
            }
          }}
          onTouchEnd={isMobile ? undefined : () => {
            mouseRef.current.active = false;
          }}
          className="relative min-h-screen flex flex-col justify-between md:justify-center px-8 md:px-16 pt-32 pb-16 md:py-20 overflow-hidden bg-transparent"
        >
          <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${darkMode ? 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]' : 'bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] bg-[size:24px_24px]'}`}></div>

        <div className="w-full z-10 flex flex-col justify-between min-h-[70vh] md:min-h-0 md:justify-start pt-6 md:pt-16">
          <div className="flex flex-col gap-0 w-full">
            <p className={`text-sm md:text-base mb-6 md:mb-4 tracking-widest uppercase text-left w-full ${darkMode ? 'text-green-500' : 'text-blue-600'}`}>
              <span className="animate-pulse">●</span> System Online
            </p>

            <h1 className="font-rubik leading-[0.82] md:leading-[0.78] tracking-tighter uppercase select-none w-full block">
              <div className="glitch-hover cursor-default transition-colors block whitespace-nowrap text-left text-[18vw] md:text-[12.5vw] w-full"><ScrambleText text="Visual" duration={350} darkMode={darkMode} /></div>
              <div className="glitch-hover cursor-default transition-colors opacity-80 block whitespace-nowrap text-center text-[18vw] md:text-[12.5vw] w-full"><ScrambleText text="Story" duration={700} darkMode={darkMode} /></div>
              <div className="glitch-hover cursor-default transition-colors block whitespace-nowrap text-right text-[18vw] md:text-[12.5vw] w-full"><ScrambleText text="Teller" duration={1050} darkMode={darkMode} /></div>
            </h1>
          </div>

          <div className="max-w-7xl mx-auto w-full mt-8 md:mt-16 flex flex-col md:flex-row justify-between items-start border-t border-current pt-6 opacity-80 gap-8">
            <div className="max-w-md w-full">
              <p className="text-lg md:text-xl leading-relaxed">
                Visual systems for brands, interfaces and narrative experiences.
              </p>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-6 w-full md:w-auto">
              <div className="flex flex-wrap gap-4 justify-start md:justify-end">
                <button
                  onClick={() => {
                    const el = document.getElementById('work');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    playUiSound('click');
                  }}
                  className={`text-xs font-mono tracking-widest px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer uppercase border active:scale-95
                    ${darkMode 
                      ? 'border-[#00FF41] text-[#00FF41] bg-transparent hover:bg-[#00FF41] hover:text-black shadow-[0_0_15px_rgba(0,255,65,0.15)]' 
                      : 'border-black text-black bg-transparent hover:bg-black hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]'}`}
                >
                  WORK
                </button>
                <button
                  onClick={() => { handleNav('contact'); playUiSound('open'); }}
                  className={`text-xs font-mono tracking-widest px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer uppercase border active:scale-95
                    ${darkMode 
                      ? 'border-[#00FF41] bg-[#00FF41] text-black md:bg-transparent md:text-[#00FF41] hover:bg-[#00FF41] hover:text-black shadow-[0_0_15px_rgba(0,255,65,0.2)]' 
                      : 'border-black bg-black text-white md:bg-transparent md:text-black hover:bg-black hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]'}`}
                >
                  CONTACT
                </button>
              </div>
              <div className="text-left md:text-right font-mono text-xs md:text-sm">
                SCROLL TO INITIALIZE <br /> ↓
              </div>
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
            <div className="flex flex-wrap gap-4">
              {['Storyteller', 'Designer', 'Artist'].map((role) => {
                const isSelected = selectedRoles[role];
                return (
                  <button
                    key={role}
                    onClick={() => { toggleRole(role); playUiSound('blip'); }}
                    className={`px-4 py-2 rounded-full text-sm uppercase transition-all duration-300 border cursor-pointer active:scale-95
                      ${isSelected 
                        ? (darkMode ? 'bg-[#00FF41] border-[#00FF41] text-black shadow-[0_0_15px_rgba(0,255,65,0.3)]' : 'bg-black border-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]') 
                        : (darkMode ? 'border-[#00FF41]/40 text-[#00FF41]/80 hover:text-[#00FF41] hover:border-[#00FF41] bg-transparent' : 'border-black/30 text-black/75 hover:text-black hover:border-black bg-transparent')
                      }`}
                  >
                    {role}
                  </button>
                );
              })}
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

      <section id="work" className="py-24 px-6 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between mb-16 border-b border-current pb-4">
            <h2 className="text-sm font-mono uppercase tracking-widest">Selected Data</h2>
            <span className="text-xs opacity-50">INDEX: 00—08</span>
          </div>

          <div className="grid grid-cols-1 gap-20">
            {projects.map((project) => (
              <div key={project.id} onClick={() => setSelectedProject(project)} className="group cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-4">
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded mb-2 inline-block ${darkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                      {project.category}
                    </span>
                    <h3 className={`text-3xl sm:text-4xl md:text-6xl font-rubik font-bold mt-2 transition-all duration-300 ${project.id === "02" ? "lowercase" : "uppercase"}`}>
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
                          <LazyImage
                            src={salatProfileImg}
                            className="w-full h-full object-cover"
                            alt="Brand Collaboration Preview"
                          />
                        ) : project.id === "02" ? (
                          (selectedProject?.id === "02") ? (
                            <div className="w-full h-full flex items-center justify-center opacity-20">
                              <Layers size={64} />
                            </div>
                          ) : (
                            <Suspense fallback={<div className="flex items-center justify-center w-full h-full text-xs font-mono opacity-30">[LAUNCHING_SPHERE...]</div>}>
                              <SpiralTimeSphere />
                            </Suspense>
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
