import { useState, useRef, useEffect } from 'react';
import { Terminal, ChevronRight } from 'lucide-react';

const FloatingConsole = ({ darkMode, toggleDarkMode, onClose, onMinimize, onTriggerCooldown }) => {
  const [input, setInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [history, setHistory] = useState([
    { text: 'JOEL VAN HEES [SYSTEM SHELL v1.1]', isSystem: true },
    { text: 'Type "help" for executable commands or ask general questions.', isSystem: true },
    { text: '', isSystem: true },
  ]);
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key !== 'Enter') return;
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { text: `joel@architect:~$ ${input}`, isInput: true }];

    // Standard commands
    switch (cmd) {
      case 'help':
        newHistory.push({
          text: `Available commands:\n  about         - Creative practice manifesto\n  projects      - Index of selected works\n  contact       - Get in touch directly (with uplink trigger)\n  cooldown      - Enter sensory water grid reflection space\n  theme         - Toggle Dark/Light Mode\n  checkyourbus  - Launch literature diagnostic\n  clear         - Clear terminal history\n  exit          - Close shell`,
        });
        break;
      case 'about':
        newHistory.push({
          text: 'Joel van Hees - Graphic Designer & Creative Coder.\nCombining classical design disciplines with experimental canvas/WebGL technologies to build high-end generative spaces and scalable digital brand systems.',
        });
        break;
      case 'projects':
        newHistory.push({
          text: 'SELECTED DATA INDEX:\n  02 // spiral down time\n  01 // brand collaboration\n  07 // check your bus\n  00 // web design as spatial experience\n  03 // nasalica\n  04 // branding systems\n  06 // concept vehicle rebrand\n  05 // poster series',
        });
        break;
      case 'contact':
        newHistory.push({
          text: 'EMAIL: kontakt@joelvanhees.de\nINSTAGRAM: @joelvn20\nPORTFOLIO: joelvanhees.de\n',
          customRender: () => (
            <button 
              onClick={() => {
                window.location.hash = '#contact';
              }}
              className={`mt-2 px-3 py-1.5 rounded-lg border text-[10px] uppercase font-mono transition-all hover:bg-current hover:text-black cursor-pointer font-bold flex items-center gap-1.5 active:scale-95
                ${darkMode ? 'border-[#00FF41] text-[#00FF41]' : 'border-[#0055FF] text-[#0055FF]'}`}
            >
              [ GO_TO_CONTACT_FORM ↓ ]
            </button>
          )
        });
        break;
      case 'cooldown':
        newHistory.push({
          text: '[INITIALIZING COOLDOWN POOL...] Entering sensory reflection space...'
        });
        if (onTriggerCooldown) {
          setTimeout(onTriggerCooldown, 800);
        }
        break;
      case 'theme':
        toggleDarkMode();
        newHistory.push({ text: `System toggled. Current state: ${!darkMode ? 'DARK' : 'LIGHT'}` });
        break;
      case 'checkyourbus':
        window.open('https://checkyourbus.vercel.app', '_blank', 'noopener,noreferrer');
        newHistory.push({ text: '[INITIALIZING CHECK_YOUR_BUS...] Redirecting to literature essay: https://checkyourbus.vercel.app' });
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'exit':
        onClose();
        return;
      default:
        // Expanded keyword matching / Interactive Q&A
        let matched = false;
        
        if (cmd.includes('skill') || cmd.includes('tech') || cmd.includes('code') || cmd.includes('programmier') || cmd.includes('sprache')) {
          newHistory.push({
            text: 'TECH STACK & CAPABILITIES:\n- Frontend: React, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS\n- Creative: Three.js, WebGL, Shaders (GLSL), Canvas API, generative systems\n- Design: Figma (layout, UI/UX systems), Adobe Creative Suite (Illustrator, Photoshop, After Effects)\n- Tools: Vite, Git, Vercel, npm'
          });
          matched = true;
        } else if (cmd.includes('experience') || cmd.includes('career') || cmd.includes('werdegang') || cmd.includes('cv') || cmd.includes('studium') || cmd.includes('arbeit') || cmd.includes('beruf')) {
          newHistory.push({
            text: 'CREATIVE MILESTONES:\n- B.A. Integrated Design @ KISD (Köln) & HSD (Düsseldorf)\n- Speculative peeling car rebrand exhibited at NRW-Forum Düsseldorf\n- Social Media Director @ Salatschüssel (10M+ Likes, 200k+ followers)\n- Lead visual designer & dev for high-end boutique client portfolios'
          });
          matched = true;
        } else if (cmd.includes('service') || cmd.includes('leistung') || cmd.includes('angebot') || cmd.includes('design') || cmd.includes('webdesign')) {
          newHistory.push({
            text: 'DESIGN & DEVELOP SERVICES:\n- 3D Web Experiences (generative typography, custom WebGL visualizers)\n- Branding Systems (logo, visual identity, physical/digital brand collateral)\n- Spatial UI/UX Design (architectural typography, immersive interactions)\n- Creative Direction (collaborations, campaign visuals, digital storytelling)'
          });
          matched = true;
        } else if (cmd.includes('figma') || cmd.includes('prototype') || cmd.includes('ux') || cmd.includes('ui')) {
          newHistory.push({
            text: 'FIGMA APPROACH:\nTreating Figma not just as a layout tool, but as a space for structural modeling. All web layouts are built with pixel-perfect layouts, responsive auto-layout structures, and dynamic design tokens, ensuring a seamless translation to client-side code.'
          });
          matched = true;
        } else if (cmd.includes('sound') || cmd.includes('music') || cmd.includes('musik') || cmd.includes('soundscape') || cmd.includes('atmosphere')) {
          newHistory.push({
            text: 'SOUNDSCAPE DESIGN:\nSound is spatial. The portfolio features an immersive atmospheric soundscape designed to give weight and depth to the interactive space. Can be toggled on/off in the "Check Your Bus" project detail modal.'
          });
          matched = true;
        } else if (cmd.includes('joel') || cmd.includes('van hees') || cmd.includes('creator')) {
          newHistory.push({
            text: 'ABOUT JOEL:\nJoel van Hees is a graphic designer and creative coder based in Germany. His practice lives at the intersection of classical graphic design and experimental technology. He believes that the browser is a spatial environment ready for emotional, atmospheric, and conceptual layouts.'
          });
          matched = true;
        } else if (cmd.includes('pool') || cmd.includes('relax') || cmd.includes('pause')) {
          newHistory.push({
            text: '[INITIALIZING COOLDOWN POOL...] Entering sensory reflection space...'
          });
          if (onTriggerCooldown) {
            setTimeout(onTriggerCooldown, 800);
          }
          matched = true;
        }
        
        if (!matched) {
          newHistory.push({ 
            text: `shell: command or question not understood: "${cmd}".\nType "help" for active commands or ask me about "services", "skills", "experience", "joel", "figma", etc.` 
          });
        }
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className={`fixed bottom-24 right-6 rounded-2xl border shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5
      ${isMaximized 
        ? 'w-[90vw] md:w-[720px] h-[60vh] md:h-[500px]' 
        : 'w-[320px] md:w-[480px] h-[320px]'
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
          <div className="flex gap-1.5 items-center mr-1">
            <button 
              onClick={onClose}
              title="Close Window"
              className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#E0443E] transition-all cursor-pointer border-none p-0 flex items-center justify-center group"
            >
              <span className="text-[6px] font-bold text-black/60 opacity-0 group-hover:opacity-100 transition-opacity">×</span>
            </button>
            <button 
              onClick={() => setIsMaximized(!isMaximized)}
              title="Toggle Size"
              className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#DFA020] transition-all cursor-pointer border-none p-0 flex items-center justify-center group"
            >
              <span className="text-[6px] font-bold text-black/60 opacity-0 group-hover:opacity-100 transition-opacity">↕</span>
            </button>
            <button 
              onClick={onMinimize}
              title="Minimize Window"
              className="w-3 h-3 rounded-full bg-[#27C93F] hover:bg-[#1AAB29] transition-all cursor-pointer border-none p-0 flex items-center justify-center group"
            >
              <span className="text-[6px] font-bold text-black/60 opacity-0 group-hover:opacity-100 transition-opacity">−</span>
            </button>
          </div>
          <span className="opacity-70 flex items-center gap-1.5 font-bold">
            <Terminal size={10} /> SYSTEM SHELL // joel@architect:~
          </span>
        </div>
      </div>

      {/* Output screen */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2 whitespace-pre-wrap">
        {history.map((log, i) => (
          <div 
            key={i} 
            className={`
              ${log.isSystem ? 'opacity-50' : ''} 
              ${log.isInput ? 'font-bold opacity-90' : ''}
            `}
          >
            <div>{log.text}</div>
            {log.customRender && log.customRender()}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* Input prompt */}
      <div className={`p-3 border-t flex items-center gap-2 font-mono text-xs
        ${darkMode ? 'border-[#00FF41]/20 bg-black/40' : 'border-[#0055FF]/20 bg-gray-50/50'}`}
      >
        <span className="opacity-75">joel@architect:~$</span>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={handleCommand}
          placeholder="Ask me anything (e.g. 'help')..."
          className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-current placeholder-current opacity-40 focus:opacity-85 transition-opacity"
          autoFocus
        />
        <ChevronRight size={14} className="opacity-60" />
      </div>
    </div>
  );
};

export default FloatingConsole;
