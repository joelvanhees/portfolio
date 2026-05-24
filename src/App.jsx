import { useEffect, useMemo, useState } from 'react';
import { Menu, X, Terminal } from 'lucide-react';

import HomeView from './views/HomeView';
import WorkView from './views/WorkView';
import ServicesView from './views/ServicesView';
import AboutView from './views/AboutView';
import ContactView from './views/ContactView';
import ProjectModal from './components/ProjectModal';
import FloatingConsole from './components/FloatingConsole';
import CooldownPool from './components/CooldownPool';

import { buildProjects } from './content/projects.jsx';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activePage, setActivePage] = useState('home');
  const [legalOpen, setLegalOpen] = useState(false);
  const [showVideoSequence, setShowVideoSequence] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [activePdf, setActivePdf] = useState(null);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [consoleMinimized, setConsoleMinimized] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trailPos, setTrailPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(true);

  const projects = useMemo(() => buildProjects({ setActiveImage }), [setActiveImage]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let animationId;

    const updateTrail = () => {
      setTrailPos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      animationId = requestAnimationFrame(updateTrail);
    };
    updateTrail();

    return () => cancelAnimationFrame(animationId);
  }, [mousePos, isMobile]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
  }, [activePage]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validPages = ['home', 'work', 'services', 'about', 'contact'];
      if (validPages.includes(hash)) {
        setActivePage(hash);
      } else {
        setActivePage('home');
        if (hash === '' || !validPages.includes(hash)) {
          window.history.replaceState(null, '', '#home');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNav = (page) => {
    window.location.hash = page;
    setMenuOpen(false);
  };

  const handleStartProject = () => {
    setSelectedProject(null);
    handleNav('contact');
  };

  return (
    <div className={`min-h-screen w-full relative transition-colors duration-700 ease-in-out font-mono selection:bg-green-500 selection:text-black overflow-x-hidden ${darkMode ? 'bg-[#050505] text-[#E0E0E0]' : 'bg-[#F0F0F0] text-[#111]'}`}>
      <style>{`
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-rubik { font-family: 'Rubik80sFade', 'Syne', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }

        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
        .glitch-hover:hover {
          animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
          color: ${darkMode ? '#00FF41' : '#0055FF'};
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${darkMode ? '#111' : '#ddd'}; }
        ::-webkit-scrollbar-thumb { background: ${darkMode ? '#333' : '#999'}; }
        ::-webkit-scrollbar-thumb:hover { background: ${darkMode ? '#00FF41' : '#0055FF'}; }

        @media (pointer: fine) {
          body, a, button, input, textarea, select, [role="button"], .cursor-pointer {
            cursor: none !important;
          }
        }
      `}</style>

      <div className={`fixed inset-0 pointer-events-none opacity-[0.03] z-0 ${darkMode ? 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]' : 'bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] bg-[size:24px_24px]'}`}></div>

      <div
        className={`fixed top-0 left-0 h-1 z-50 transition-all duration-100 ${darkMode ? 'bg-[#00FF41]' : 'bg-[#0055FF]'}`}
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <nav className="fixed w-full z-40 px-6 py-6 flex justify-between items-center text-white">
        <button
          onClick={() => handleNav('home')}
          className="text-lg md:text-xl font-bold tracking-tighter cursor-pointer transition-all duration-300 hover:scale-105 flex items-center gap-2 bg-transparent border-none p-0"
          style={{
            background: darkMode
              ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 45%, rgba(0,0,0,0.3) 50%, rgba(255,255,255,0.2) 55%, rgba(255,255,255,0.7) 100%)'
              : 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 45%, rgba(255,255,255,0.2) 50%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.6) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: darkMode
              ? '-0.8px -0.8px 0px rgba(255,255,255,0.5), 0.8px 0.8px 0px rgba(0,0,0,0.85), 0px 4px 10px rgba(0,0,0,0.45)'
              : '-0.8px -0.8px 0px rgba(255,255,255,0.95), 0.8px 0.8px 0px rgba(0,0,0,0.25), 0px 3px 8px rgba(0,0,0,0.18)',
            filter: darkMode
              ? 'drop-shadow(0px 8px 16px rgba(0,0,0,0.35))'
              : 'drop-shadow(0px 4px 10px rgba(0,0,0,0.12))',
          }}
        >
          JOEL VAN HEES <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-mono tracking-widest ${darkMode ? 'bg-[#00FF41]/15 text-[#00FF41] border border-[#00FF41]/25' : 'bg-[#0055FF]/10 text-[#0055FF] border border-[#0055FF]/20'}`}>[ARCHITECT]</span>
        </button>

        <div className="flex items-center gap-6 mix-blend-difference">
          <button
            onClick={() => {
              if (consoleOpen) {
                if (consoleMinimized) {
                  setConsoleMinimized(false);
                } else {
                  setConsoleOpen(false);
                  setConsoleMinimized(false);
                }
              } else {
                setConsoleOpen(true);
                setConsoleMinimized(false);
              }
            }}
            className="flex items-center gap-1.5 text-xs border border-white/20 px-3 py-1 rounded-full hover:bg-white hover:text-black transition-all"
          >
            <Terminal size={12} />
            {consoleOpen && !consoleMinimized ? 'SHELL: CLOSE' : 'SHELL: OPEN'}
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="hidden md:flex items-center gap-2 text-xs border border-white/20 px-3 py-1 rounded-full hover:bg-white hover:text-black transition-all"
          >
            {darkMode ? <div className="w-2 h-2 rounded-full bg-[#00FF41]" /> : <div className="w-2 h-2 rounded-full bg-[#0055FF]" />}
            {darkMode ? 'SYSTEM: DARK' : 'SYSTEM: LIGHT'}
          </button>

          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className={`fixed inset-0 z-30 flex flex-col justify-center items-center gap-8 text-4xl md:text-6xl font-syne font-bold ${darkMode ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-xl`}>
          {['HOME', 'WORK', 'SERVICES', 'ABOUT', 'CONTACT'].map((item, i) => (
            <button
              key={item}
              onClick={() => handleNav(item.toLowerCase())}
              className={`hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ${activePage === item.toLowerCase() ? (darkMode ? 'text-[#00FF41]' : 'text-[#0055FF]') : ''}`}
            >
              {`0${i} // ${item}`}
            </button>
          ))}
        </div>
      )}

      {activePage === 'home' && <HomeView darkMode={darkMode} projects={projects} setSelectedProject={setSelectedProject} selectedProject={selectedProject} />}
      {activePage === 'work' && <WorkView darkMode={darkMode} />}
      {activePage === 'services' && <ServicesView darkMode={darkMode} />}
      {activePage === 'about' && <AboutView darkMode={darkMode} />}
      {activePage === 'contact' && <ContactView darkMode={darkMode} />}

      {legalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-12">
          <div
            className="absolute inset-0 backdrop-blur-xl bg-black/40 transition-all duration-500"
            onClick={() => setLegalOpen(false)}
          ></div>

          <div className={`relative w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-3xl border shadow-2xl p-8 md:p-12 transition-all duration-300 animate-in fade-in zoom-in-95
                ${darkMode
              ? 'bg-[#050505] border-white/10 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]'
              : 'bg-white border-white/40 text-black shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]'
            }`}
          >
            <div className="flex justify-between items-start mb-8 border-b border-current pb-4">
              <h2 className="text-3xl font-syne font-bold">LEGAL DATA</h2>
              <button onClick={() => setLegalOpen(false)} className="p-2 hover:opacity-50"><X size={24} /></button>
            </div>

            <div className="font-mono text-sm space-y-8 leading-relaxed opacity-80">
              <section>
                <h3 className="text-xl font-bold mb-4 uppercase">Impressum</h3>
                <p className="mb-2">Angaben gemäß § 5 TMG</p>
                <p>
                  Joel van Hees<br />
                  Köln<br />
                  Deutschland
                </p>

                <p className="mt-4">
                  <strong>Kontakt:</strong><br />
                  E-Mail: kontakt@joelvanhees.de
                </p>

                <p className="mt-4">
                  <strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong><br />
                  Joel van Hees<br />
                  Köln, Deutschland
                </p>

                <p className="mt-4">
                  <strong>Haftungsausschluss:</strong><br />
                  Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
                </p>
              </section>

              <section className="border-t border-current pt-8">
                <h3 className="text-xl font-bold mb-4 uppercase">Datenschutzerklärung</h3>

                <h4 className="font-bold mt-4">1. Datenschutz auf einen Blick</h4>
                <p>
                  <strong>Allgemeine Hinweise:</strong> Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                </p>
                <p className="mt-2">
                  <strong>Datenerfassung auf dieser Website:</strong> Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                </p>

                <h4 className="font-bold mt-4">2. Hosting</h4>
                <p>
                  Wir hosten die Inhalte unserer Website bei folgendem Anbieter (z.B. Vercel / Netlify). Der Anbieter erhebt Daten über Zugriffe auf die Seite und speichert diese als „Server-Logfiles“ ab. Diese Daten werden nicht mit anderen Datenquellen zusammengeführt.
                </p>

                <h4 className="font-bold mt-4">3. Allgemeine Hinweise und Pflichtinformationen</h4>
                <p>
                  <strong>Datenschutz:</strong> Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                </p>
                <p className="mt-2">
                  <strong>Hinweis zur verantwortlichen Stelle:</strong><br />
                  Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br />
                  Joel van Hees<br />
                  Köln, Deutschland<br />
                  E-Mail: kontakt@joelvanhees.de
                </p>
                <p className="mt-2">
                  <strong>Widerruf Ihrer Einwilligung zur Datenverarbeitung:</strong> Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per E-Mail an uns.
                </p>
                <p className="mt-2">
                  <strong>Beschwerderecht bei der zuständigen Aufsichtsbehörde:</strong> Im Falle von Verstößen gegen die DSGVO steht dem Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde zu.
                </p>
                <p className="mt-2">
                  <strong>Recht auf Datenübertragbarkeit:</strong> Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen.
                </p>

                <h4 className="font-bold mt-4">4. Datenerfassung auf dieser Website</h4>
                <p>
                  <strong>Kontaktanfragen:</strong> Wenn Sie uns per E-Mail kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      <ProjectModal
        selectedProject={selectedProject}
        darkMode={darkMode}
        showVideoSequence={showVideoSequence}
        setShowVideoSequence={setShowVideoSequence}
        setSelectedProject={setSelectedProject}
        setActiveImage={setActiveImage}
        setActivePdf={setActivePdf}
        onStartProject={handleStartProject}
      />

      {activeImage && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all animate-in fade-in duration-300 cursor-zoom-out"
          onClick={() => setActiveImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setActiveImage(null); }}
          >
            <X size={32} />
          </button>
          <img
            src={activeImage}
            alt="Fullscreen view"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {activePdf && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setActivePdf(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white hover:text-red-500 transition-colors z-50 bg-black rounded-full border border-white/20"
            onClick={(e) => { e.stopPropagation(); setActivePdf(null); }}
          >
            <X size={32} />
          </button>
          <iframe
            src={activePdf}
            className="w-full h-full rounded-xl bg-white shadow-2xl"
            title="PDF Preview"
            onClick={(e) => e.stopPropagation()}
          ></iframe>
        </div>
      )}

      <footer id="contact" className={`py-24 px-6 ${darkMode ? 'bg-[#00FF41] text-black' : 'bg-[#0055FF] text-white'}`}>
        <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[50vh]">
          <div>
            <h2 className="text-6xl md:text-9xl font-rubik font-bold tracking-tighter leading-none mb-8">
              LET&apos;S <br /> BUILD.
            </h2>
            <button onClick={() => handleNav('contact')} className="text-xl md:text-2xl font-mono underline decoration-2 underline-offset-4 hover:no-underline">
              kontakt@joelvanhees.de
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-8 font-mono text-sm uppercase">
            <div className="flex gap-4">
              <a href="https://www.instagram.com/joelvn20?igsh=cG91ZjEzYnh5azAx&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:line-through">Instagram</a>
            </div>
            <div className="text-right">
              <p>© {new Date().getFullYear()} Joel van Hees</p>
              <button onClick={() => setLegalOpen(true)} className="mt-4 text-[10px] opacity-60 hover:opacity-100 hover:underline">
                IMPRESSUM / DATENSCHUTZ
              </button>
            </div>
          </div>
        </div>
      </footer>
      {consoleOpen && !consoleMinimized && (
        <FloatingConsole 
          darkMode={darkMode} 
          toggleDarkMode={() => setDarkMode(!darkMode)} 
          onClose={() => {
            setConsoleOpen(false);
            setConsoleMinimized(false);
          }} 
          onMinimize={() => setConsoleMinimized(true)}
          onTriggerCooldown={() => setCooldownActive(true)}
        />
      )}
      {consoleOpen && consoleMinimized && (
        <button
          onClick={() => setConsoleMinimized(false)}
          title="Restore System Shell"
          className={`fixed bottom-6 right-6 p-4 rounded-full border shadow-2xl z-[90] cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce
            ${darkMode 
              ? 'bg-black border-[#00FF41]/40 text-[#00FF41] hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] shadow-[0_0_10px_rgba(0,255,65,0.2)]' 
              : 'bg-white border-[#0055FF]/40 text-[#0055FF] hover:shadow-[0_0_20px_rgba(0,85,255,0.4)] shadow-[0_0_10px_rgba(0,85,255,0.2)]'}`}
        >
          <Terminal size={22} className="animate-pulse" />
        </button>
      )}
      {cooldownActive && (
        <CooldownPool 
          darkMode={darkMode} 
          onClose={() => setCooldownActive(false)} 
        />
      )}
      {!isMobile && (
        <div 
          className={`fixed w-8 h-8 rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 transition-shadow duration-300
            ${darkMode 
              ? 'bg-white/5 border border-white/30 shadow-[inset_0_2.5px_5px_rgba(255,255,255,0.4),inset_0_-2.5px_5px_rgba(0,0,0,0.45),0_6px_20px_rgba(0,0,0,0.35)]' 
              : 'bg-white/20 border border-white/55 shadow-[inset_0_2.5px_5px_rgba(255,255,255,0.6),inset_0_-2.5px_5px_rgba(0,0,0,0.25),0_6px_18px_rgba(0,0,0,0.18)]'} backdrop-blur-[10px]`}
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        />
      )}
    </div>
  );
};

export default App;
