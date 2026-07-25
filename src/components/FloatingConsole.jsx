import { useState, useRef, useEffect } from 'react';
import { Terminal, ChevronRight } from 'lucide-react';
import ShellBlob from './ShellBlob';
import { playClickSound } from '../utils/clickSound';
import { matchIntent } from '../utils/shellMatch';
import { shellIntents } from '../content/shellIntents';


// TypewriterText component to emulate realistic human typing with variable speeds and pauses
const TypewriterText = ({ text, speed = 'normal' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0); // Reset index on text change
    
    let index = 0;
    let timer;
    const baseSpeed = speed === 'fast' ? 4 + Math.random() * 4 : 10 + Math.random() * 14;

    const type = () => {
      if (index < text.length) {
        index++;
        setCurrentIndex(index);
        
        let nextDelay = baseSpeed;
        const char = text.charAt(index - 1);
        if (char === '.' || char === '!' || char === '?') {
          nextDelay += speed === 'fast' ? 30 + Math.random() * 20 : 180 + Math.random() * 60;
        } else if (char === '\n') {
          nextDelay += speed === 'fast' ? 40 + Math.random() * 20 : 200 + Math.random() * 80;
        } else if (char === ' ') {
          nextDelay += speed === 'fast' ? Math.random() * 2 : Math.random() * 8;
        }
        
        timer = setTimeout(type, nextDelay);
      }
    };

    // Slight initial delay to feel more organic
    timer = setTimeout(type, speed === 'fast' ? 20 : 60);

    return () => clearTimeout(timer);
  }, [text, speed]);

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
          text: "JOEL VAN HEES // ARCHITECTURAL SYSTEM SHELL\n\nBefore we initialize, please tell me: What is your name?",
          isInput: false,
          isFirstMessage: true
        }
      ];
    } else {
      return [
        {
          text: `JOEL VAN HEES // SYSTEM SHELL\n\nWelcome back, ${userName}. Connection stable.\nType 'help' for executable commands or ask me any question.`,
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
    playClickSound('click');
    const rawInput = input.trim();
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

        /*
         * One matcher, no cascade. The old code tried nine exact commands in a
         * switch and then a chain of substring tests. That is why "hilfe" and
         * "projekte" failed outright, while "portfolio" answered with the
         * location ("p-ort-folio"), "build" with the Figma essay ("b-ui-ld")
         * and "display" with the game ("dis-play"). Intents are scored on whole
         * words now and the best one wins, so declaration order no longer
         * decides the answer.
         */
        const { intent, suggestions } = matchIntent(rawInput, shellIntents);

        if (!intent) {
          // Nothing is guessed below the threshold; the nearest topics are
          // more use than a witty error.
          const nearest = suggestions.length ? suggestions : ['about', 'projects', 'contact'];
          responseText =
            `Das konnte ich nicht sicher zuordnen, ${activeUser}.\n` +
            `Meintest du: ${nearest.map((s) => `'${s}'`).join(', ')}?\n` +
            `'help' zeigt alles — du kannst auch einfach in eigenen Worten fragen.`;
        } else {
          if (intent.action === 'clear') {
            setHistory([]);
            setInput('');
            setIsThinking(false);
            return;
          }
          if (intent.action === 'exit') {
            onClose();
            return;
          }
          if (intent.action === 'theme') toggleDarkMode();
          if (intent.action === 'cooldown' && onTriggerCooldown) setTimeout(onTriggerCooldown, 800);
          if (intent.action === 'checkyourbus') {
            window.open('https://checkyourbus.vercel.app', '_blank', 'noopener,noreferrer');
          }

          responseText = intent.respond({
            user: activeUser,
            addon: nameAddon,
            nextTheme: !darkMode ? 'DARK' : 'LIGHT',
          });

          if (intent.action === 'contact-form') {
            customRender = () => (
              <button
                onClick={() => {
                  window.location.hash = '#contact';
                }}
                className={`mt-2.5 px-3.5 py-2 rounded-lg border text-[10px] uppercase font-meta transition-all hover:bg-current hover:text-black cursor-pointer font-bold flex items-center gap-1.5 active:scale-95
                  ${darkMode ? 'border-[#C7FF2E] text-[#C7FF2E]' : 'border-black text-black hover:bg-black hover:text-white'}`}
              >
                [ GO_TO_CONTACT_FORM ↓ ]
              </button>
            );
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
        ? 'bg-black/90 border-[#C7FF2E]/30 text-[#C7FF2E] shadow-[0_0_30px_rgba(0,255,0,0.15)]' 
        : 'bg-white border-black text-black shadow-[0_0_35px_rgba(0,0,0,0.25)]'
      }`}
    >
      {/* Header */}
      <div className={`px-4 py-3 flex justify-between items-center border-b font-meta text-[10px] uppercase tracking-wider
        ${darkMode ? 'border-[#C7FF2E]/20 bg-black/40' : 'border-black bg-white'}`}
      >
        <div className="flex items-center gap-3">
          {/* Apple dots style window controls */}
          <div className="flex gap-3 md:gap-1.5 items-center mr-1">
            <button 
              onClick={() => { onClose(); playClickSound('close'); }}
              title="Close Window"
              className="relative w-6 h-6 md:w-3 md:h-3 rounded-full bg-[#FF5F56] hover:bg-[#E0443E] transition-all cursor-pointer border-none p-0 flex items-center justify-center group active:scale-90"
            >
              <span className="text-xs md:text-[6px] font-bold text-black/60 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">×</span>
            </button>
            <button 
              onClick={() => { setIsMaximized(!isMaximized); playClickSound('click'); }}
              title="Toggle Size"
              className="hidden md:flex relative w-3.5 h-3.5 md:w-3 md:h-3 rounded-full bg-[#FEBC2E] hover:bg-[#DFA020] transition-all cursor-pointer border-none p-0 items-center justify-center group"
            >
              <span className="text-[7px] md:text-[6px] font-bold text-black/60 opacity-0 group-hover:opacity-100 transition-opacity">↕</span>
            </button>
            <button 
              onClick={() => { onMinimize(); playClickSound('close'); }}
              title="Minimize Window"
              className="hidden md:flex relative w-3.5 h-3.5 md:w-3 md:h-3 rounded-full bg-[#27C93F] hover:bg-[#1AAB29] transition-all cursor-pointer p-0 flex items-center justify-center group active:scale-90"
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
        className="console-output-screen flex-1 p-4 overflow-y-auto font-meta text-[11px] leading-relaxed space-y-2.5"
      >
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-current/10 font-display">
          <ShellBlob isThinking={isThinking} darkMode={darkMode} className="w-16 h-16 md:w-24 md:h-24 shrink-0 drop-shadow-[0_0_15px_currentColor]" />
          <div className="flex flex-col justify-center opacity-70 font-display">
            <div className="font-bold mb-1 tracking-wider text-xs">JOEL VAN HEES [SYSTEM SHELL v1.2]</div>
            <div className="text-[10px]">Type "help" for executable commands or ask general questions.</div>
          </div>
        </div>

        {/* History rendering with differentiated fonts */}
        {history.map((log, i) => {
          if (log.isInput) {
            return (
              <div key={i} className="font-meta text-xs font-bold opacity-90 mb-2.5 text-current flex items-start gap-1">
                <span>{log.text}</span>
              </div>
            );
          } else {
            return (
              <div 
                key={i} 
                className={`font-display tracking-wide text-xs leading-relaxed opacity-95 mb-4 border-l border-current/25 pl-3.5 py-0.5 ${
                  darkMode ? 'text-white' : 'text-black'
                }`}
              >
                <TypewriterText text={log.text} speed={log.isFirstMessage ? 'fast' : 'normal'} />
                {log.customRender && (
                  <div className="mt-2 font-meta">
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
      <div className={`p-3 border-t flex items-center gap-2 font-meta text-xs
        ${darkMode ? 'border-[#C7FF2E]/20 bg-black/40' : 'border-black bg-white'}`}
      >
        <span className="opacity-75 text-base md:text-xs">joel@architect:~$</span>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={handleCommand}
          placeholder={awaitingName ? "Type your name..." : "Ask me anything (e.g. 'help')..."}
          className={`flex-1 bg-transparent border-none outline-none font-meta text-base md:text-xs text-current placeholder-current transition-opacity ${darkMode ? 'opacity-40 focus:opacity-85' : 'opacity-100'}`}
          autoFocus
        />
        <ChevronRight size={14} className="opacity-60" />
      </div>
    </div>
  );
};

export default FloatingConsole;
