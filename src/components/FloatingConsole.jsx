import { useState, useRef, useEffect } from 'react';
import { Terminal, X, ChevronRight } from 'lucide-react';

const FloatingConsole = ({ darkMode, toggleDarkMode, onClose }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { text: 'JOEL VAN HEES [SYSTEM SHELL v1.0]', isSystem: true },
    { text: 'Type "help" for a list of available commands.', isSystem: true },
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

    switch (cmd) {
      case 'help':
        newHistory.push({
          text: `Available commands:\n  about         - Creative practice manifesto\n  projects      - Index of selected works\n  contact       - Get in touch directly\n  theme         - Toggle Dark/Light Mode\n  checkyourbus  - Launch literature diagnostic\n  clear         - Clear terminal history\n  exit          - Close shell`,
        });
        break;
      case 'about':
        newHistory.push({
          text: 'Joel van Hees - Graphic Designer & Creative Coder.\nCombining classical design disciplines with experimental canvas/WebGL technologies to build high-end generative spaces and scalable digital brand systems.',
        });
        break;
      case 'projects':
        newHistory.push({
          text: 'SELECTED DATA INDEX:\n  02 // spiral down time\n  01 // brand collaboration\n  00 // web design as spatial experience\n  03 // nasalica\n  04 // branding systems\n  06 // concept vehicle rebrand\n  05 // poster series\n  07 // check your bus',
        });
        break;
      case 'contact':
        newHistory.push({
          text: 'EMAIL: kontakt@joelvanhees.de\nINSTAGRAM: @joelvn20\nPORTFOLIO: joelvanhees.de',
        });
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
        newHistory.push({ text: `shell: command not found: ${cmd}. Type "help" for a list of commands.` });
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className={`fixed bottom-24 right-6 w-[320px] md:w-[480px] h-[320px] rounded-2xl border shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5
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
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
          </div>
          <span className="opacity-70 flex items-center gap-1.5 font-bold">
            <Terminal size={10} /> SYSTEM SHELL // joel@architect:~
          </span>
        </div>
        <button onClick={onClose} className="hover:opacity-60 transition-opacity">
          <X size={14} />
        </button>
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
            {log.text}
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
          placeholder="Type command (e.g. 'help')..."
          className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-current placeholder-current opacity-40 focus:opacity-85 transition-opacity"
          autoFocus
        />
        <ChevronRight size={14} className="opacity-60" />
      </div>
    </div>
  );
};

export default FloatingConsole;
