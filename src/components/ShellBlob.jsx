import React from 'react';

const ShellBlob = ({ isThinking, darkMode, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center transition-all duration-500 ${className} ${isThinking ? 'scale-110' : 'scale-100'}`}>
      <div 
        className={`w-full h-full animate-[shellblob_4s_infinite_alternate] backdrop-blur-md border border-white/20 transition-all duration-300
          ${darkMode ? 'bg-[#00FF41]/30 shadow-[0_0_15px_rgba(0,255,65,0.4),inset_0_0_10px_rgba(0,255,65,0.4)]' : 'bg-[#0055FF]/30 shadow-[0_0_15px_rgba(0,85,255,0.4),inset_0_0_10px_rgba(0,85,255,0.4)]'}
          ${isThinking ? (darkMode ? 'bg-[#00FF41]/70 shadow-[0_0_35px_rgba(0,255,65,0.8),inset_0_0_20px_rgba(0,255,65,0.8)]' : 'bg-[#0055FF]/70 shadow-[0_0_35px_rgba(0,85,255,0.8),inset_0_0_20px_rgba(0,85,255,0.8)]') : ''}
        `}
        style={{
          borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
        }}
      ></div>
      <style>{`
        @keyframes shellblob {
          0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(0deg) scale(1); }
          50% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(180deg) scale(1.05); }
          100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(360deg) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ShellBlob;
