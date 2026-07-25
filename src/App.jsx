import { useEffect, useMemo, useState, useRef, lazy, Suspense } from 'react';
import { Menu, X, Terminal } from 'lucide-react';

import HomeView from './views/HomeView';
import WorkView from './views/WorkView';
import ServicesView from './views/ServicesView';
import AboutView from './views/AboutView';
import ContactView from './views/ContactView';
import GameView from './views/GameView';
import FloatingConsole from './components/FloatingConsole';
import { BrandSignature, BrandMark } from './components/BrandLogo';

const ProjectModal = lazy(() => import('./components/ProjectModal'));
const CooldownPool = lazy(() => import('./components/CooldownPool'));
import ShellBlob from './components/ShellBlob';

import { buildProjects } from './content/projects.jsx';
import { playClickSound } from './utils/clickSound';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activePage, setActivePage] = useState('home');
  const [gameOpen, setGameOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [showVideoSequence, setShowVideoSequence] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [activePdf, setActivePdf] = useState(null);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [consoleMinimized, setConsoleMinimized] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [secretOpen, setSecretOpen] = useState(false);
  const [secretBypass, setSecretBypass] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [userName, setUserName] = useState('');
  const [awaitingName, setAwaitingName] = useState(true);
  const cursorRef = useRef(null);
  const scrollBarRef = useRef(null);



  const projects = useMemo(() => buildProjects({ setActiveImage }), [setActiveImage]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = windowHeight > 0 ? totalScroll / windowHeight : 0;
      if (scrollBarRef.current) {
        scrollBarRef.current.style.width = `${progress * 100}%`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate3d(-50%, -50%, 0)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#050505';
      document.body.style.color = '#E0E0E0';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#FFFFFF';
      document.body.style.color = '#000000';
    }
  }, [darkMode]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Disable smooth scrolling temporarily to prevent page-change layout jumps
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Scroll immediately and instantly
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    // Reinforce scroll in the next frame to prevent browser layout jumping
    const handle = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.body.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      
      // Restore smooth scroll behavior in the next cycle
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = originalScrollBehavior;
      }, 50);
    });

    return () => {
      cancelAnimationFrame(handle);
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
    };
  }, [activePage]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validPages = ['home', 'work', 'services', 'about', 'contact', 'game', 'secret', 'mixer', 'skinbar'];
      if (validPages.includes(hash)) {
        if (hash === 'game') {
          setGameOpen(true);
          setActivePage((prev) => {
            const pageToSet = prev === 'game' ? 'home' : prev;
            window.history.replaceState(null, '', `#${pageToSet}`);
            return pageToSet;
          });
        } else if (hash === 'secret' || hash === 'mixer' || hash === 'skinbar') {
          setSecretOpen(true);
          setSecretBypass(true);
          setActivePage((prev) => {
            const pageToSet = (prev === 'secret' || prev === 'mixer' || prev === 'skinbar') ? 'home' : prev;
            window.history.replaceState(null, '', `#${pageToSet}`);
            return pageToSet;
          });
        } else {
          setActivePage(hash);
        }
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
    <div className={`min-h-screen w-full relative transition-colors duration-700 ease-in-out font-meta selection:bg-green-500 selection:text-black overflow-x-hidden bg-transparent ${darkMode ? 'text-[#E0E0E0]' : 'text-black'}`}>
      <style>{`
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
          color: ${darkMode ? '#00FF41' : '#000000'};
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${darkMode ? '#111' : '#ddd'}; }
        ::-webkit-scrollbar-thumb { background: ${darkMode ? '#333' : '#999'}; }
        ::-webkit-scrollbar-thumb:hover { background: ${darkMode ? '#00FF41' : '#000000'}; }
      `}</style>

      <div className={`fixed inset-0 pointer-events-none z-0 ${
        darkMode 
          ? 'opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]' 
          : 'opacity-[0.09] bg-[linear-gradient(to_right,#00000022_1px,transparent_1px),linear-gradient(to_bottom,#00000022_1px,transparent_1px)]'
      } bg-[size:24px_24px]`}></div>

      <div
        ref={scrollBarRef}
        className={`fixed top-0 left-0 h-1 z-50 transition-all duration-100 ${darkMode ? 'bg-[#00FF41]' : 'bg-black'}`}
        style={{ width: '0%' }}
      />

      <nav className={`fixed w-full z-[55] px-6 sm:px-12 lg:px-16 py-8 sm:py-6 md:py-8 flex justify-between items-center bg-transparent pointer-events-none transition-colors duration-700 ${darkMode ? 'text-white' : 'text-black'}`}>
        <button
          onClick={() => handleNav('home')}
          className="cursor-pointer transition-all duration-300 hover:scale-105 flex items-center gap-1.5 bg-transparent border-none p-0 pointer-events-auto"
        >
          <BrandSignature className="h-4 sm:h-5 md:h-7 w-auto" />
          <span className={`text-[7px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded uppercase font-meta tracking-widest ${darkMode ? 'bg-[#00FF41]/15 text-[#00FF41] border border-[#00FF41]/25' : 'bg-black/5 text-black border border-black/20'}`}>[ARCHITECT]</span>
        </button>

        <div className="flex items-center gap-3 sm:gap-6 pointer-events-none">
          <button
            onClick={() => {
              if (consoleOpen) {
                if (consoleMinimized) {
                  setConsoleMinimized(false);
                  playClickSound('open');
                } else {
                  setConsoleOpen(false);
                  setConsoleMinimized(false);
                  playClickSound('close');
                }
              } else {
                setConsoleOpen(true);
                setConsoleMinimized(false);
                playClickSound('open');
              }
            }}
            className={`flex items-center gap-1.5 text-[11px] sm:text-xs border px-3.5 py-1.5 sm:px-3 sm:py-1 rounded-full transition-all pointer-events-auto active:scale-95
              ${consoleOpen 
                ? (darkMode ? 'border-[#00FF41] text-[#00FF41] bg-[#00FF41]/10' : 'border-[#0055FF] text-[#0055FF] bg-[#0055FF]/10') 
                : (darkMode ? 'border-white/20 text-white hover:bg-white hover:text-black' : 'border-black/20 text-black hover:bg-black hover:text-white')}`}
          >
            <Terminal size={12} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${consoleOpen ? 'text-[#00FF41]' : ''}`} />
            {consoleOpen && !consoleMinimized ? 'SHELL: CLOSE' : 'SHELL: OPEN'}
          </button>

          <button
            onClick={() => {
              setDarkMode(!darkMode);
              playClickSound('click');
            }}
            className={`hidden md:flex items-center gap-2 text-xs border px-3 py-1 rounded-full transition-all pointer-events-auto
              ${darkMode 
                ? 'border-white/20 text-white hover:bg-white hover:text-black' 
                : 'border-black/20 text-black hover:bg-black hover:text-white'}`}
          >
            {darkMode ? <div className="w-2 h-2 rounded-full bg-[#00FF41]" /> : <div className="w-2 h-2 rounded-full bg-[#0055FF]" />}
            {darkMode ? 'SYSTEM: DARK' : 'SYSTEM: LIGHT'}
          </button>

          <button 
            onClick={() => {
              setMenuOpen(!menuOpen);
              playClickSound('click');
            }} 
            className={`focus:outline-none flex items-center justify-center p-2 rounded-lg transition-colors pointer-events-auto
              ${darkMode 
                ? 'hover:bg-white/10 active:bg-white/20' 
                : 'hover:bg-black/10 active:bg-black/20'}`}
            title="Toggle Menu"
          >
            {menuOpen 
              ? <X size={24} className="w-6 h-6 sm:w-8 sm:h-8" /> 
              : <Menu size={24} className="w-6 h-6 sm:w-8 sm:h-8" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-30" onClick={() => { setMenuOpen(false); playClickSound('close'); }}>
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-24 right-4 md:right-8 w-64 md:w-80 rounded-2xl flex flex-col justify-start items-end p-6 md:p-8 gap-5 text-lg md:text-xl font-display font-bold border shadow-2xl transition-all duration-500 animate-in slide-in-from-right-8 ${darkMode ? 'bg-black/60 border-[#00FF41]/20 shadow-[0_0_30px_rgba(0,255,65,0.1)]' : 'bg-white border-black shadow-[0_0_35px_rgba(0,0,0,0.25)]'} backdrop-blur-xl`}
          >
            <button
              onClick={() => {
                setSecretOpen(true);
                setMenuOpen(false);
                playClickSound('open');
              }}
              className="mb-2 bg-transparent border-none p-0 cursor-pointer focus:outline-none hover:scale-110 transition-all duration-500 drop-shadow-[0_0_20px_rgba(0,255,65,0.2)] flex items-center justify-center pointer-events-auto"
              title="Geheimes Mixer Rezeptbuch"
            >
              <BrandMark className="h-16 md:h-20 w-auto" />
            </button>
            {['HOME', 'WORK', 'SERVICES', 'ABOUT', 'CONTACT'].map((item, i) => (
              <button
                key={item}
                onClick={() => {
                  handleNav(item.toLowerCase());
                  playClickSound('click');
                }}
                className={`hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ${activePage === item.toLowerCase() ? (darkMode ? 'text-[#00FF41]' : 'text-black underline decoration-2 underline-offset-4') : (darkMode ? '' : 'text-black/50')}`}
              >
                {`0${i} // ${item}`}
              </button>
            ))}
            {/* Additional Menu Actions */}
            <div className="flex flex-col gap-3 mt-4 w-full items-end">
              <button
                onClick={() => {
                  setCooldownActive(true);
                  setMenuOpen(false);
                  playClickSound('open');
                }}
                className={`w-full text-right text-xs font-meta tracking-widest px-6 py-2.5 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer
                  ${darkMode 
                    ? 'border border-[#00d2ff]/40 bg-[#00d2ff]/10 text-[#00d2ff] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.15),0_0_15px_rgba(0,210,255,0.2)] hover:bg-[#00d2ff]/25 hover:border-[#00d2ff]/80 hover:text-[#39ebff]' 
                    : 'border border-black bg-black text-white hover:bg-black/90 shadow-[0_4px_12px_rgba(0,0,0,0.15)]'}`}
              >
                COOL DOWN
              </button>

              <button
                onClick={() => {
                  handleNav('game');
                  setMenuOpen(false);
                  playClickSound('open');
                }}
                className={`w-full text-right text-xs font-meta tracking-widest px-6 py-2.5 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer
                  ${darkMode 
                    ? 'border border-[#00ff41]/40 bg-[#00ff41]/10 text-[#00ff41] shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),0_4px_12px_rgba(0,0,0,0.15),0_0_15px_rgba(0,255,65,0.15)] hover:bg-[#00ff41]/25 hover:border-[#00ff41]/80 hover:text-[#52ff84]' 
                    : 'border border-black bg-white text-black hover:bg-black hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]'}`}
              >
                BLOB RUN ⌁
              </button>

              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                  playClickSound('click');
                }}
                className={`w-full text-right text-xs font-meta tracking-widest px-6 py-2.5 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer
                  ${darkMode 
                    ? 'border border-white/20 bg-white/5 text-white hover:bg-white hover:text-black shadow-[inset_0_2px_4px_rgba(255,255,255,0.15)]' 
                    : 'border border-black bg-black text-white hover:bg-black/90 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]'}`}
              >
                THEME: {darkMode ? 'LIGHT ☼' : 'DARK ☾'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activePage === 'home' && <HomeView darkMode={darkMode} projects={projects} setSelectedProject={setSelectedProject} selectedProject={selectedProject} handleNav={handleNav} setCooldownActive={setCooldownActive} />}
      {activePage === 'work' && <WorkView darkMode={darkMode} />}
      {activePage === 'services' && <ServicesView darkMode={darkMode} />}
      {activePage === 'about' && <AboutView darkMode={darkMode} />}
      {activePage === 'contact' && <ContactView darkMode={darkMode} />}
      {gameOpen && (
        <GameView 
          darkMode={darkMode} 
          onClose={() => setGameOpen(false)} 
        />
      )}

      {legalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-12">
          <div
            className="absolute inset-0 backdrop-blur-xl bg-black/40 transition-all duration-500"
            onClick={() => { setLegalOpen(false); playClickSound('close'); }}
          ></div>

          <div className={`relative w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-3xl border shadow-2xl p-8 md:p-12 transition-all duration-300 animate-in fade-in zoom-in-95
                ${darkMode
              ? 'bg-[#050505] border-white/10 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]'
              : 'bg-white border-white/40 text-black shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]'
            }`}
          >
            <div className="flex justify-between items-start mb-8 border-b border-current pb-4">
              <h2 className="text-3xl font-display font-bold">LEGAL DATA</h2>
              <button onClick={() => { setLegalOpen(false); playClickSound('close'); }} className="p-2 hover:opacity-50"><X size={24} /></button>
            </div>

            <div className="font-meta text-sm space-y-8 leading-relaxed opacity-80">
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

      {selectedProject && (
        <Suspense fallback={null}>
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
        </Suspense>
      )}

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

      <footer id="footer-contact" className={`py-24 px-6 ${darkMode ? 'bg-[#00FF41] text-black' : 'bg-[#0055FF] text-white'}`}>
        <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[50vh]">
          <div>
            <h2 className="text-6xl md:text-9xl font-rubik font-bold tracking-tighter leading-none mb-8">
              LET&apos;S <br /> BUILD.
            </h2>
            <button onClick={() => handleNav('contact')} className="text-xl md:text-2xl font-meta underline decoration-2 underline-offset-4 hover:no-underline">
              kontakt@joelvanhees.de
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-8 font-meta text-sm uppercase">
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
          userName={userName}
          setUserName={setUserName}
          awaitingName={awaitingName}
          setAwaitingName={setAwaitingName}
        />
      )}
      {!isMobile && (!consoleOpen || consoleMinimized) && (
        <button
          onClick={() => {
            if (!consoleOpen) {
              setConsoleOpen(true);
            }
            setConsoleMinimized(false);
          }}
          title={consoleMinimized ? "Restore System Shell" : "Open System Shell"}
          className="fixed bottom-6 right-6 z-[90] cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-2 flex items-center justify-center border-none bg-transparent outline-none drop-shadow-2xl"
        >
          <ShellBlob isThinking={false} darkMode={darkMode} className="w-32 h-32 md:w-44 md:h-44 pointer-events-none" />
        </button>
      )}
      {cooldownActive && (
        <Suspense fallback={null}>
          <CooldownPool 
            darkMode={darkMode} 
            onClose={() => setCooldownActive(false)} 
          />
        </Suspense>
      )}
      {!isMobile && (
        <div 
          ref={cursorRef}
          className={`fixed w-2 h-2 rounded-full pointer-events-none z-[100] transition-colors duration-500 -translate-x-1/2 -translate-y-1/2
            ${darkMode ? 'bg-[#00FF41] shadow-[0_0_8px_#00FF41]' : 'bg-[#0055FF] shadow-[0_0_8px_#0055FF]'}`}
          style={{ left: 0, top: 0, transform: 'translate3d(0px, 0px, 0)' }}
        />
      )}
      {secretOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => { setSecretOpen(false); setSecretBypass(false); playClickSound('close'); }}></div>
          
          <div className="relative w-full h-full md:w-[480px] md:h-[90vh] md:max-h-[900px] md:rounded-[40px] md:border md:border-white/10 md:shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:overflow-hidden md:bg-[#E9E5DD] flex flex-col z-10 animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={() => { setSecretOpen(false); setSecretBypass(false); playClickSound('close'); }}
              className="absolute top-4 right-4 z-[9999] w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-black hover:scale-105 transition-all duration-200 cursor-pointer font-bold text-lg active:scale-95 shadow-md"
              title="Schließen"
            >
              ×
            </button>
            
            <iframe 
              src={secretBypass ? "/secret-mixer.html?bypass=true&v=7" : "/secret-mixer.html?v=7"}
              className="w-full h-full border-none"
              title="Skin Bar - Mixer Rezeptbuch"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
