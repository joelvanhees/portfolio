import { useState, useRef, useEffect } from 'react';
import { Terminal, ChevronRight } from 'lucide-react';
import ShellBlob from './ShellBlob';

// TypewriterText component to emulate realistic human typing with variable speeds and pauses
const TypewriterText = ({ text }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0); // Reset index on text change
    
    let index = 0;
    let timer;
    const baseSpeed = 10 + Math.random() * 14; // 10ms - 24ms base speed

    const type = () => {
      if (index < text.length) {
        index++;
        setCurrentIndex(index);
        
        let nextDelay = baseSpeed;
        const char = text.charAt(index - 1);
        if (char === '.' || char === '!' || char === '?') {
          nextDelay += 180 + Math.random() * 60;
        } else if (char === '\n') {
          nextDelay += 200 + Math.random() * 80;
        } else if (char === ' ') {
          nextDelay += Math.random() * 8;
        }
        
        timer = setTimeout(type, nextDelay);
      }
    };

    // Slight initial delay to feel more organic
    timer = setTimeout(type, 60);

    return () => clearTimeout(timer);
  }, [text]);

  // Keep screen scrolled down as index increases
  useEffect(() => {
    const screen = document.getElementById('console-scroll-screen');
    if (screen) {
      screen.scrollTop = screen.scrollHeight;
    }
  }, [currentIndex]);

  return <span className="whitespace-pre-wrap">{text.slice(0, currentIndex)}</span>;
};

const FloatingConsole = ({ 
  darkMode, 
  toggleDarkMode, 
  onClose, 
  onMinimize, 
  onTriggerCooldown,
  userName,
  setUserName,
  awaitingName,
  setAwaitingName
}) => {
  const [input, setInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  
  // History is initialized using the temporary in-memory userName prop (100% GDPR compliant!)
  const [history, setHistory] = useState(() => {
    if (!userName) {
      return [
        {
          text: "JOEL VAN HEES // ARCHITECTURAL SYSTEM SHELL v1.2\n==========================================\nNeural bridge connecting... Online.\n\nBefore we initialize, please tell me: What is your name?",
          isInput: false,
          isFirstMessage: true
        }
      ];
    } else {
      return [
        {
          text: `JOEL VAN HEES // SYSTEM SHELL v1.2\n==========================================\nWelcome back, ${userName}. Connection stable.\nType 'help' for executable commands or ask me any question.`,
          isInput: false,
          isFirstMessage: true
        }
      ];
    }
  });

  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Helper to occasionally address the user namentlich (with a 25% chance)
  const getNameAddon = (nameToUse) => {
    if (!nameToUse) return '';
    const isChance = Math.random() < 0.25; // 25% chance
    if (!isChance) return '';
    
    const addons = [
      `, ${nameToUse}`,
      ` - stay curious, ${nameToUse}!`,
      `\n\nHope you're having an inspiring day, ${nameToUse}.`,
      ` (Active Operator: ${nameToUse})`,
      `\n\nIs there anything else I can compile for you, ${nameToUse}?`
    ];
    return addons[Math.floor(Math.random() * addons.length)];
  };

  const handleCommand = (e) => {
    if (e.key !== 'Enter') return;
    const rawInput = input.trim();
    const cmd = rawInput.toLowerCase();
    if (!rawInput) return;

    const newHistory = [...history, { text: `joel@architect:~$ ${rawInput}`, isInput: true }];
    setHistory(newHistory);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      let responseText = '';
      let customRender = null;

      if (awaitingName) {
        // Name registration phase (stored in memory, not disk)
        const name = rawInput;
        setUserName(name);
        setAwaitingName(false);
        responseText = `Welcome, ${name}. Neural bridge online. Uplink established.\nAccess granted to architectural systems and creative diagnostics.\n\nType 'help' to see available commands or ask me any question.`;
      } else {
        const activeUser = userName || 'Operator';
        const nameAddon = getNameAddon(activeUser);

        switch (cmd) {
          case 'help':
            responseText = `Available commands:\n  about         - Creative practice manifesto\n  projects      - Index of selected works\n  contact       - Get in touch directly (with uplink trigger)\n  cooldown      - Enter sensory water grid reflection space\n  theme         - Toggle Dark/Light Mode\n  checkyourbus  - Launch literature diagnostic\n  clear         - Clear terminal history\n  exit          - Close shell` + nameAddon;
            break;
          case 'about':
            responseText = `Joel van Hees - Graphic Designer & Creative Coder.\nCombining classical design disciplines with experimental canvas/WebGL technologies to build high-end generative spaces and scalable digital brand systems.` + nameAddon;
            break;
          case 'projects':
            responseText = `SELECTED DATA INDEX:\n  02 // spiral down time\n  01 // brand collaboration\n  07 // check your bus\n  00 // web design as spatial experience\n  03 // nasalica\n  04 // branding systems\n  06 // concept vehicle rebrand\n  05 // poster series` + nameAddon;
            break;
          case 'contact':
            responseText = `EMAIL: kontakt@joelvanhees.de\nINSTAGRAM: @joelvn20\nPORTFOLIO: joelvanhees.de\n` + nameAddon;
            customRender = () => (
              <button 
                onClick={() => {
                  window.location.hash = '#contact';
                }}
                className={`mt-2.5 px-3.5 py-2 rounded-lg border text-[10px] uppercase font-mono transition-all hover:bg-current hover:text-black cursor-pointer font-bold flex items-center gap-1.5 active:scale-95
                  ${darkMode ? 'border-[#00FF41] text-[#00FF41]' : 'border-black text-black hover:bg-black hover:text-white'}`}
              >
                [ GO_TO_CONTACT_FORM ↓ ]
              </button>
            );
            break;
          case 'cooldown':
            responseText = `[INITIALIZING COOLDOWN POOL...] Entering sensory reflection space... Enjoy the relaxation, ${activeUser}!`;
            if (onTriggerCooldown) {
              setTimeout(onTriggerCooldown, 800);
            }
            break;
          case 'theme':
            toggleDarkMode();
            responseText = `System toggled. Current state: ${!darkMode ? 'DARK' : 'LIGHT'}${nameAddon}`;
            break;
          case 'checkyourbus':
            window.open('https://checkyourbus.vercel.app', '_blank', 'noopener,noreferrer');
            responseText = `[INITIALIZING CHECK_YOUR_BUS...] Redirecting to literature essay: https://checkyourbus.vercel.app - Hope you like it, ${activeUser}!`;
            break;
          case 'clear':
            setHistory([]);
            setInput('');
            setIsThinking(false);
            return;
          case 'exit':
            onClose();
            return;
          default:
            // --- MASSIVE COMPREHENSIVE CONVERSATIONAL ROUTING DATABASE ---
            let matched = false;
            
            // Greetings
            if (cmd === 'hi' || cmd === 'hello' || cmd === 'hallo' || cmd === 'hey' || cmd === 'moin' || cmd === 'servus' || cmd === 'yo' || cmd === 'guten tag' || cmd === 'was geht') {
              const helloResponses = [
                `Hallo ${activeUser}! Wie kann ich dir heute helfen? Tippe 'help' für Befehle.`,
                `Hi ${activeUser}! Schön, dass du den Weg in meine Kommandozeile gefunden hast. 👾`,
                `Hey ${activeUser}! Du tippst verdammt flüssig. Was steht heute auf der Agenda?`,
                `Moin Moin, ${activeUser}! Bereit, ein bisschen High-End-Code anzuschauen?`,
                `Servus, ${activeUser}! Suchst du nach 'projects', 'skills' oder einfach nur Inspiration?`
              ];
              responseText = helloResponses[Math.floor(Math.random() * helloResponses.length)];
              matched = true;
            } 
            // Budget, Prices and Costs (Resolves directly to contact button)
            else if (cmd.includes('geld') || cmd.includes('kosten') || cmd.includes('preis') || cmd.includes('budget') || cmd.includes('zahlen') || cmd.includes('honorar') || cmd.includes('cost') || cmd.includes('price') || cmd.includes('money') || cmd.includes('charge')) {
              responseText = `PROJEKTKOSTEN & ANGEBOTE:\nFür Anfragen bezüglich Projektkosten, Budgetrahmen oder Honorarsätzen erstelle ich individuelle Angebote, die exakt auf den Umfang deines Vorhabens abgestimmt sind. Lass uns deine Vorstellungen besprechen und ein passendes Angebot kalkulieren!\n\nNutze den direkten Link zum Kontaktformular, um eine Anfrage zu senden, ${activeUser}:`;
              customRender = () => (
                <button 
                  onClick={() => {
                    window.location.hash = '#contact';
                  }}
                  className={`mt-2.5 px-3.5 py-2 rounded-lg border text-[10px] uppercase font-mono transition-all hover:bg-current hover:text-black cursor-pointer font-bold flex items-center gap-1.5 active:scale-95
                    ${darkMode ? 'border-[#00FF41] text-[#00FF41]' : 'border-black text-black hover:bg-black hover:text-white'}`}
                >
                  [ GO_TO_CONTACT_FORM ↓ ]
                </button>
              );
              matched = true;
            }
            // Technical Stack, Programming and Code
            else if (cmd.includes('skill') || cmd.includes('tech') || cmd.includes('code') || cmd.includes('programmier') || cmd.includes('sprache') || cmd.includes('three') || cmd.includes('webgl') || cmd.includes('react') || cmd.includes('glsl') || cmd.includes('framework')) {
              responseText = `TECHNICAL CAPABILITIES & DEVELOPER ENGINE:\n\n- FRONTEND LAYER: React, Modern ES6+ JavaScript, Semantic HTML5, CSS3, Tailwind CSS\n- IMMERSIVE CREATIVE LAYER: Three.js, Canvas API, WebGL, custom GLSL Shaders, generative systems\n- DIGITAL BRAND DESIGN: Figma (UI/UX layout systems, adaptive auto-layout, tokens), Adobe Creative Suite (Illustrator, Photoshop, After Effects)\n- BUILD ENGINES & WORKFLOW: Vite, Git, Vercel, npm, high-performance optimization.` + nameAddon;
              matched = true;
            } 
            // Experience and Milestones
            else if (cmd.includes('experience') || cmd.includes('career') || cmd.includes('werdegang') || cmd.includes('cv') || cmd.includes('studium') || cmd.includes('arbeit') || cmd.includes('beruf') || cmd.includes('schule') || cmd.includes('kisd') || cmd.includes('hsd')) {
              responseText = `CREATIVE MILESTONES & ACADEMIC GROUNDING:\n\n- STUDY: B.A. Integrated Design studied at KISD (Köln) and HSD (Düsseldorf).\n- EXHIBITION: Speculative interactive brand installation exhibited at the NRW-Forum Düsseldorf.\n- SOCIAL ENGINE: Director of Social Media at "Salatschüssel" (scaled the community channel to over 10M+ Likes and 200,000+ active followers).\n- BOUTIQUE SERVICES: Custom branding systems and generative web systems developed for premium client portfolios.`;
              matched = true;
            } 
            // Design, Art and Concept Services
            else if (cmd.includes('service') || cmd.includes('leistung') || cmd.includes('angebot') || cmd.includes('design') || cmd.includes('webdesign') || cmd.includes('concept') || cmd.includes('creative direction')) {
              responseText = `DESIGN & DEVELOPMENT SERVICES:\n\n- 3D WEB EXPERIENCES: Immersive WebGL spaces, procedural typographic canvas installations, and reactive interactive visualizations.\n- BRANDING SYSTEMS: Scalable visual identities, logo architecture, typography standards, and integrated physical/digital collateral.\n- SPATIAL UI/UX SYSTEMS: Concept-driven, responsive layouts, design token libraries in Figma, and micro-interactions.\n- CREATIVE DIRECTION: Collaborative conceptual campaigns, video storytelling, and experimental design technologies.` + nameAddon;
              matched = true;
            } 
            // Figma specific approaches
            else if (cmd.includes('figma') || cmd.includes('prototype') || cmd.includes('ux') || cmd.includes('ui') || cmd.includes('wireframe') || cmd.includes('layout')) {
              responseText = `FIGMA INTERFACE ARCHITECTURE:\nI treat Figma not merely as an ad-hoc layout sheet, but as a systematic model for structural code translation. Every visual draft uses strict auto-layout formulas, component hierarchies, and responsive padding variables. This guarantees that all UI patterns adapt beautifully to any viewport when written in React or CSS, ${activeUser}.`;
              matched = true;
            } 
            // Music, soundscapes and atmospheres
            else if (cmd.includes('sound') || cmd.includes('music') || cmd.includes('musik') || cmd.includes('soundscape') || cmd.includes('atmosphere') || cmd.includes('audio')) {
              responseText = `ATMOSPHERIC SOUNDSCAPE SYNTHESIS:\nSound shapes spatial depth. My portfolio integrates custom-engineered ambient tracks (like "Orbital Drift Run.mp3" in the Blob Runner overlay) and atmospheric sounds to establish emotional presence in digital installations. Audio controls are modular and easy to toggle directly inside project overlays, ${activeUser}.`;
              matched = true;
            } 
            // Background on Cologne, Germany or cities
            else if (cmd.includes('stadt') || cmd.includes('koeln') || cmd.includes('cologne') || cmd.includes('germany') || cmd.includes('deutschland') || cmd.includes('ort') || cmd.includes('location')) {
              responseText = `LOCATION IN PROFILE:\nMy creative practice is based in Cologne, Germany—a historic hub for experimental media, art, and integrated design studies. I work with clients both locally in North Rhine-Westphalia and globally via digital neural uplinks.` + nameAddon;
              matched = true;
            }
            // General info about Joel van Hees himself
            else if (cmd.includes('joel') || cmd.includes('van hees') || cmd.includes('creator') || cmd.includes('wer') || cmd.includes('who') || cmd.includes('person')) {
              responseText = `PROFILE SUMMARY:\nJoel van Hees is an integrated graphic designer and developer living in Cologne. He merges classical design disciplines (composition, strict grid typography, brand strategy) with experimental frontend technologies (Three.js, custom shaders, reactive DOM interactions). He treats the web browser as an emotional, narrative canvas ready for deep atmosphere.`;
              matched = true;
            } 
            // Hobbies and personal preferences
            else if (cmd.includes('hobby') || cmd.includes('freizeit') || cmd.includes('sport') || cmd.includes('privat') || cmd.includes('personal')) {
              responseText = `PERSONAL CHANNELS:\nBeyond commercial systems, I enjoy speculative design, chiptune sound synthesis, generative mathematics, and exploring experimental game loops. I'm fascinated by liquid-glass aesthetics, water simulations, and the intersection of music and dynamic motion, ${activeUser}.`;
              matched = true;
            }
            // Vision, inspiration and philosophy
            else if (cmd.includes('vision') || cmd.includes('philosophie') || cmd.includes('vision') || cmd.includes('ansatz') || cmd.includes('inspiration') || cmd.includes('future') || cmd.includes('ziel') || cmd.includes('zukunft')) {
              responseText = `CREATIVE PRACTICE MANIFESTO:\n"The browser is not a static page—it is a spatial environment." My goal is to build digital spaces that evoke emotional, memorable, and atmospheric resonance. I believe that brand identities in the future should not just be looked at, but experienced and explored interactively. Let's shape the visual standards of tomorrow, ${activeUser}.`;
              matched = true;
            }
            // Blob Runner game loops
            else if (cmd.includes('game') || cmd.includes('gameover') || cmd.includes('runner') || cmd.includes('play') || cmd.includes('spielen') || cmd.includes('spiel') || cmd.includes('blob run')) {
              responseText = `SYSTEM RUNNER [BLOB RUNNER ⌁]:\nHave you tried my high-performance WebGL 3D game yet? It runs in a beautiful, retro-cyber glassmorphic TV console and is extremely fast! You have to dodge red warning barriers and collect golden shards to unlock glowing core colors. Click the glowing pulsing blob in the bottom right corner of the screen to close the console and enter the running lane, ${activeUser}!`;
              matched = true;
            }
            // Cooldown room
            else if (cmd.includes('pool') || cmd.includes('relax') || cmd.includes('pause') || cmd.includes('cooldown') || cmd.includes('wasser') || cmd.includes('water')) {
              responseText = `[INITIALIZING COOLDOWN POOL...] Entering sensory reflection space... Take a moment to relax, ${activeUser}.`;
              if (onTriggerCooldown) {
                setTimeout(onTriggerCooldown, 800);
              }
              matched = true;
            }
            // Contact uplink
            else if (cmd.includes('kontakt') || cmd.includes('email') || cmd.includes('mail') || cmd.includes('write') || cmd.includes('nachricht') || cmd.includes('uplink') || cmd.includes('schreiben')) {
              responseText = `SYSTEM CONTACT UPLINK:\nReady to establish connection? Reach out via:\n- Direct Mail: kontakt@joelvanhees.de\n- Instagram: @joelvn20\n\nClick the button below to jump straight to the contact terminal, ${activeUser}:`;
              customRender = () => (
                <button 
                  onClick={() => {
                    window.location.hash = '#contact';
                  }}
                  className={`mt-2.5 px-3.5 py-2 rounded-lg border text-[10px] uppercase font-mono transition-all hover:bg-current hover:text-black cursor-pointer font-bold flex items-center gap-1.5 active:scale-95
                    ${darkMode ? 'border-[#00FF41] text-[#00FF41]' : 'border-black text-black hover:bg-black hover:text-white'}`}
                >
                  [ GO_TO_CONTACT_FORM ↓ ]
                </button>
              );
              matched = true;
            }
            
            // Standard witty fallback responses (Expanded and highly descriptive!)
            if (!matched) {
              const sassyResponses = [
                `Ich bin eine Kommandozeile, kein Orakel, ${activeUser}. Aber netter Versuch! 😉 Tippe 'help' für echte Befehle.`,
                `Das steht leider nicht in meinem Drehbuch, ${activeUser}. Frag mich doch lieber nach 'projects' oder 'skills'!`,
                `Fehler 404: Antwort nicht gefunden. Aber hey, meine glatte Schrift sieht wenigstens extrem edel aus, oder ${activeUser}?`,
                `Spannende Eingabe, ${activeUser}! Klingt fast wie ein geheimer Cheatcode, aber meine Firewall blockiert das. Probier mal 'help'.`,
                `Joel hat mir vieles beigebracht, ${activeUser}, aber diese Frage übersteigt meine aktuellen Schaltkreise. Frag mich mal nach 'about'!`,
                `Ich könnte dir das jetzt im Detail erklären, ${activeUser}, aber dann müsste ich dich in den Cooldown-Pool werfen. 🏊‍♂️ 'cooldown'`,
                `Das ist so 2025, ${activeUser}! Wir leben in der Zukunft. Frag mich lieber nach meinen echten 'skills' oder 'services'!`,
                `Interessanter Gedanke, ${activeUser}. Ich wette, die Antwort darauf liegt irgendwo im dekolonialen Bus-Essay... 🚌 'checkyourbus'`
              ];
              responseText = sassyResponses[Math.floor(Math.random() * sassyResponses.length)];
            }
        }
      }

      setHistory((prev) => [...prev, { text: responseText, customRender, isInput: false }]);
      setIsThinking(false);
    }, 500 + Math.random() * 300); // 500ms - 800ms natural processing delay
  };

  return (
    <div className={`fixed z-50 rounded-2xl border shadow-2xl flex flex-col overflow-hidden backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5
      ${isMaximized 
        ? 'bottom-4 left-4 right-4 h-[80vh] md:bottom-24 md:right-6 md:left-auto md:w-[720px] md:h-[500px]' 
        : 'bottom-20 left-4 right-4 h-[380px] md:bottom-24 md:right-6 md:left-auto md:w-[480px] md:h-[320px]'
      }
      ${darkMode 
        ? 'bg-black/90 border-[#00FF41]/30 text-[#00FF41] shadow-[0_0_30px_rgba(0,255,0,0.15)]' 
        : 'bg-white border-black text-black shadow-[0_0_35px_rgba(0,0,0,0.25)]'
      }`}
    >
      {/* Header */}
      <div className={`px-4 py-3 flex justify-between items-center border-b font-mono text-[10px] uppercase tracking-wider
        ${darkMode ? 'border-[#00FF41]/20 bg-black/40' : 'border-black bg-white'}`}
      >
        <div className="flex items-center gap-3">
          {/* Apple dots style window controls */}
          <div className="flex gap-3 md:gap-1.5 items-center mr-1">
            <button 
              onClick={onClose}
              title="Close Window"
              className="relative w-6 h-6 md:w-3 md:h-3 rounded-full bg-[#FF5F56] hover:bg-[#E0443E] transition-all cursor-pointer border-none p-0 flex items-center justify-center group active:scale-90"
            >
              <span className="text-xs md:text-[6px] font-bold text-black/60 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">×</span>
            </button>
            <button 
              onClick={() => setIsMaximized(!isMaximized)}
              title="Toggle Size"
              className="hidden md:flex relative w-3.5 h-3.5 md:w-3 md:h-3 rounded-full bg-[#FEBC2E] hover:bg-[#DFA020] transition-all cursor-pointer border-none p-0 items-center justify-center group"
            >
              <span className="text-[7px] md:text-[6px] font-bold text-black/60 opacity-0 group-hover:opacity-100 transition-opacity">↕</span>
            </button>
            <button 
              onClick={onMinimize}
              title="Minimize Window"
              className="hidden md:flex relative w-3.5 h-3.5 md:w-3 md:h-3 rounded-full bg-[#27C93F] hover:bg-[#1AAB29] transition-all cursor-pointer border-none p-0 items-center justify-center group"
            >
              <span className="text-[7px] md:text-[6px] font-bold text-black/60 opacity-0 group-hover:opacity-100 transition-opacity">−</span>
            </button>
          </div>
          <span className="opacity-90 flex items-center gap-2 font-bold ml-2">
            SYSTEM SHELL // joel@architect:~
          </span>
        </div>
      </div>

      {/* Output screen */}
      <div 
        id="console-scroll-screen" 
        className="console-output-screen flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2.5"
      >
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-current/10 font-syne">
          <ShellBlob isThinking={isThinking} darkMode={darkMode} className="w-16 h-16 md:w-24 md:h-24 shrink-0 drop-shadow-[0_0_15px_currentColor]" />
          <div className="flex flex-col justify-center opacity-70 font-syne">
            <div className="font-bold mb-1 tracking-wider text-xs">JOEL VAN HEES [SYSTEM SHELL v1.2]</div>
            <div className="text-[10px]">Type "help" for executable commands or ask general questions.</div>
          </div>
        </div>

        {/* History rendering with differentiated fonts */}
        {history.map((log, i) => {
          if (log.isInput) {
            return (
              <div key={i} className="font-mono text-xs font-bold opacity-90 mb-2.5 text-current flex items-start gap-1">
                <span>{log.text}</span>
              </div>
            );
          } else {
            return (
              <div 
                key={i} 
                className={`font-syne tracking-wide text-xs leading-relaxed opacity-95 mb-4 border-l border-current/25 pl-3.5 py-0.5 ${
                  darkMode ? 'text-white' : 'text-black'
                }`}
              >
                <TypewriterText text={log.text} />
                {log.customRender && (
                  <div className="mt-2 font-mono">
                    {log.customRender()}
                  </div>
                )}
              </div>
            );
          }
        })}
        <div ref={logEndRef} />
      </div>

      {/* Input prompt */}
      <div className={`p-3 border-t flex items-center gap-2 font-mono text-xs
        ${darkMode ? 'border-[#00FF41]/20 bg-black/40' : 'border-black bg-white'}`}
      >
        <span className="opacity-75 text-base md:text-xs">joel@architect:~$</span>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={handleCommand}
          placeholder={awaitingName ? "Type your name..." : "Ask me anything (e.g. 'help')..."}
          className={`flex-1 bg-transparent border-none outline-none font-mono text-base md:text-xs text-current placeholder-current transition-opacity ${darkMode ? 'opacity-40 focus:opacity-85' : 'opacity-100'}`}
          autoFocus
        />
        <ChevronRight size={14} className="opacity-60" />
      </div>
    </div>
  );
};

export default FloatingConsole;
