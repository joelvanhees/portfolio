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


const FloatingConsole = ({ darkMode, toggleDarkMode, onClose, onMinimize, onTriggerCooldown }) => {
  const [input, setInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  
  // Name caching and state flow
  const [awaitingName, setAwaitingName] = useState(() => !localStorage.getItem('vanhees_user_name'));
  
  const [history, setHistory] = useState(() => {
    const cachedName = localStorage.getItem('vanhees_user_name');
    if (!cachedName) {
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
          text: `JOEL VAN HEES // SYSTEM SHELL v1.2\n==========================================\nWelcome back, ${cachedName}. Connection stable.\nType 'help' for executable commands or ask me any question.`,
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
  const getNameAddon = (userName) => {
    if (!userName) return '';
    const isChance = Math.random() < 0.25; // 25% chance
    if (!isChance) return '';
    
    const addons = [
      `, ${userName}`,
      ` - stay curious, ${userName}!`,
      `\n\nHope you're having an inspiring day, ${userName}.`,
      ` (Active Operator: ${userName})`,
      `\n\nIs there anything else I can compile for you, ${userName}?`
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
        // Name registration phase
        const name = rawInput;
        localStorage.setItem('vanhees_user_name', name);
        setAwaitingName(false);
        responseText = `Welcome, ${name}. Neural bridge online. Uplink established.\nAccess granted to architectural systems and creative diagnostics.\n\nType 'help' to see available commands or ask me any question.`;
      } else {
        const userName = localStorage.getItem('vanhees_user_name') || 'Operator';
        const nameAddon = getNameAddon(userName);

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
                  ${darkMode ? 'border-[#00FF41] text-[#00FF41]' : 'border-[#0055FF] text-[#0055FF]'}`}
              >
                [ GO_TO_CONTACT_FORM ↓ ]
              </button>
            );
            break;
          case 'cooldown':
            responseText = `[INITIALIZING COOLDOWN POOL...] Entering sensory reflection space... Enjoy the relaxation, ${userName}!`;
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
            responseText = `[INITIALIZING CHECK_YOUR_BUS...] Redirecting to literature essay: https://checkyourbus.vercel.app - Hope you like it, ${userName}!`;
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
            // Custom conversational keyword routing
            let matched = false;
            
            if (cmd === 'hi' || cmd === 'hello' || cmd === 'hallo' || cmd === 'hey' || cmd === 'moin' || cmd === 'servus' || cmd === 'yo' || cmd === 'guten tag' || cmd === 'was geht') {
              const helloResponses = [
                `Hallo ${userName}! Wie kann ich dir heute helfen? Tippe 'help' für Befehle.`,
                `Hi ${userName}! Schön, dass du den Weg in meine Kommandozeile gefunden hast. 👾`,
                `Hey ${userName}! Du tippst verdammt flüssig. Was steht heute auf der Agenda?`,
                `Moin Moin, ${userName}! Bereit, ein bisschen High-End-Code anzuschauen?`,
                `Servus, ${userName}! Suchst du nach 'projects', 'skills' oder einfach nur Inspiration?`
              ];
              responseText = helloResponses[Math.floor(Math.random() * helloResponses.length)];
              matched = true;
            } else if (cmd.includes('skill') || cmd.includes('tech') || cmd.includes('code') || cmd.includes('programmier') || cmd.includes('sprache')) {
              responseText = `TECH STACK & CAPABILITIES:\n- Frontend: React, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS\n- Creative: Three.js, WebGL, Shaders (GLSL), Canvas API, generative systems\n- Design: Figma (layout, UI/UX systems), Adobe Creative Suite (Illustrator, Photoshop, After Effects)\n- Tools: Vite, Git, Vercel, npm` + nameAddon;
              matched = true;
            } else if (cmd.includes('experience') || cmd.includes('career') || cmd.includes('werdegang') || cmd.includes('cv') || cmd.includes('studium') || cmd.includes('arbeit') || cmd.includes('beruf')) {
              responseText = `CREATIVE MILESTONES:\n- B.A. Integrated Design @ KISD (Köln) & HSD (Düsseldorf)\n- Speculative peeling car rebrand exhibited at NRW-Forum Düsseldorf\n- Social Media Director @ Salatschüssel (10M+ Likes, 200k+ followers)\n- Lead visual designer & dev for high-end boutique client portfolios` + nameAddon;
              matched = true;
            } else if (cmd.includes('service') || cmd.includes('leistung') || cmd.includes('angebot') || cmd.includes('design') || cmd.includes('webdesign')) {
              responseText = `DESIGN & DEVELOP SERVICES:\n- 3D Web Experiences (generative typography, custom WebGL visualizers)\n- Branding Systems (logo, visual identity, physical/digital brand collateral)\n- Spatial UI/UX Design (architectural typography, immersive interactions)\n- Creative Direction (collaborations, campaign visuals, digital storytelling)` + nameAddon;
              matched = true;
            } else if (cmd.includes('figma') || cmd.includes('prototype') || cmd.includes('ux') || cmd.includes('ui')) {
              responseText = `FIGMA APPROACH:\nTreating Figma not just as a layout tool, but as a space for structural modeling. All web layouts are built with pixel-perfect layouts, responsive auto-layout structures, and dynamic design tokens, ensuring a seamless translation to client-side code, ${userName}.`;
              matched = true;
            } else if (cmd.includes('sound') || cmd.includes('music') || cmd.includes('musik') || cmd.includes('soundscape') || cmd.includes('atmosphere')) {
              responseText = `SOUNDSCAPE DESIGN:\nSound is spatial. The portfolio features an immersive atmospheric soundscape designed to give weight and depth to the interactive space. Can be toggled on/off in the "Check Your Bus" project detail modal, ${userName}.`;
              matched = true;
            } else if (cmd.includes('joel') || cmd.includes('van hees') || cmd.includes('creator')) {
              responseText = `ABOUT JOEL:\nJoel van Hees is a graphic designer and creative coder based in Germany. His practice lives at the intersection of classical graphic design and experimental technology. He believes that the browser is a spatial environment ready for emotional, atmospheric, and conceptual layouts, ${userName}.`;
              matched = true;
            } else if (cmd.includes('pool') || cmd.includes('relax') || cmd.includes('pause')) {
              responseText = `[INITIALIZING COOLDOWN POOL...] Entering sensory reflection space... Take your time, ${userName}.`;
              if (onTriggerCooldown) {
                setTimeout(onTriggerCooldown, 800);
              }
              matched = true;
            } else if (cmd.includes('geld') || cmd.includes('kosten') || cmd.includes('preis') || cmd.includes('budget') || cmd.includes('zahlen') || cmd.includes('honorar') || cmd.includes('cost') || cmd.includes('price') || cmd.includes('money') || cmd.includes('charge')) {
              responseText = `PROJEKTKOSTEN & ANGEBOTE:\nFür Anfragen bezüglich Projektkosten, Budgetrahmen oder Honorarsätzen erstelle ich individuelle Angebote, die exakt auf den Umfang deines Vorhabens abgestimmt sind. Lass uns deine Vorstellungen besprechen und ein passendes Angebot kalkulieren!\n\nNutze den direkten Link zum Kontaktformular, um eine Anfrage zu senden, ${userName}:`;
              customRender = () => (
                <button 
                  onClick={() => {
                    window.location.hash = '#contact';
                  }}
                  className={`mt-2.5 px-3.5 py-2 rounded-lg border text-[10px] uppercase font-mono transition-all hover:bg-current hover:text-black cursor-pointer font-bold flex items-center gap-1.5 active:scale-95
                    ${darkMode ? 'border-[#00FF41] text-[#00FF41]' : 'border-[#0055FF] text-[#0055FF]'}`}
                >
                  [ GO_TO_CONTACT_FORM ↓ ]
                </button>
              );
              matched = true;
            }
            
            if (!matched) {
              const sassyResponses = [
                `Ich bin eine Kommandozeile, kein Orakel, ${userName}. Aber netter Versuch! 😉 Tippe 'help' für echte Befehle.`,
                `Das steht leider nicht in meinem Drehbuch, ${userName}. Frag mich doch lieber nach 'projects' oder 'skills'!`,
                `Fehler 404: Antwort nicht gefunden. Aber hey, meine glatte Schrift sieht wenigstens extrem edel aus, oder ${userName}?`,
                `Spannende Eingabe, ${userName}! Klingt fast wie ein geheimer Cheatcode, aber meine Firewall blockiert das. Probier mal 'help'.`,
                `Joel hat mir vieles beigebracht, ${userName}, aber diese Frage übersteigt meine aktuellen Schaltkreise. Frag mich mal nach 'about'!`,
                `Ich könnte dir das jetzt im Detail erklären, ${userName}, aber dann müsste ich dich in den Cooldown-Pool werfen. 🏊‍♂️ 'cooldown'`,
                `Das ist so 2025, ${userName}! Wir leben in der Zukunft. Frag mich lieber nach meinen echten 'skills' oder 'services'!`,
                `Interessanter Gedanke, ${userName}. Ich wette, die Antwort darauf liegt irgendwo im dekolonialen Bus-Essay... 🚌 'checkyourbus'`
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
        : 'bg-white/90 border-[#0055FF]/30 text-[#0055FF] shadow-[0_0_30px_rgba(0,85,255,0.15)]'
      }`}
    >
      {/* Header */}
      <div className={`px-4 py-3 flex justify-between items-center border-b font-mono text-[10px] uppercase tracking-wider
        ${darkMode ? 'border-[#00FF41]/20 bg-black/40' : 'border-[#0055FF]/20 bg-gray-50/50'}`}
      >
        <div className="flex items-center gap-3">
          {/* Apple dots style window controls */}
          <div className="flex gap-2.5 md:gap-1.5 items-center mr-1">
            <button 
              onClick={onClose}
              title="Close Window"
              className="relative w-3.5 h-3.5 md:w-3 md:h-3 rounded-full bg-[#FF5F56] hover:bg-[#E0443E] transition-all cursor-pointer border-none p-0 flex items-center justify-center group after:absolute after:-inset-2 md:after:inset-0"
            >
              <span className="text-[7px] md:text-[6px] font-bold text-black/60 opacity-0 group-hover:opacity-100 transition-opacity">×</span>
            </button>
            <button 
              onClick={() => setIsMaximized(!isMaximized)}
              title="Toggle Size"
              className="relative w-3.5 h-3.5 md:w-3 md:h-3 rounded-full bg-[#FEBC2E] hover:bg-[#DFA020] transition-all cursor-pointer border-none p-0 flex items-center justify-center group after:absolute after:-inset-2 md:after:inset-0"
            >
              <span className="text-[7px] md:text-[6px] font-bold text-black/60 opacity-0 group-hover:opacity-100 transition-opacity">↕</span>
            </button>
            <button 
              onClick={onMinimize}
              title="Minimize Window"
              className="relative w-3.5 h-3.5 md:w-3 md:h-3 rounded-full bg-[#27C93F] hover:bg-[#1AAB29] transition-all cursor-pointer border-none p-0 flex items-center justify-center group after:absolute after:-inset-2 md:after:inset-0"
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
                  darkMode ? 'text-white' : 'text-slate-900'
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
        ${darkMode ? 'border-[#00FF41]/20 bg-black/40' : 'border-[#0055FF]/20 bg-gray-50/50'}`}
      >
        <span className="opacity-75 text-base md:text-xs">joel@architect:~$</span>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={handleCommand}
          placeholder={awaitingName ? "Type your name..." : "Ask me anything (e.g. 'help')..."}
          className="flex-1 bg-transparent border-none outline-none font-mono text-base md:text-xs text-current placeholder-current opacity-40 focus:opacity-85 transition-opacity"
          autoFocus
        />
        <ChevronRight size={14} className="opacity-60" />
      </div>
    </div>
  );
};

export default FloatingConsole;
