import { useEffect, useState } from 'react';
import SkillNetwork from './SkillNetwork';

/*
 * The window the skill map lives in, with working chrome.
 *
 * red    — closes it. Picking any role brings it back.
 * yellow — collapses it to its title bar.
 * green  — takes it fullscreen as an overlay.
 *
 * Shared by the home page and the network page so both behave identically.
 */

const Light = ({ colour, hover, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`w-3 h-3 rounded-full ${colour} ${hover} transition-colors cursor-pointer`}
  />
);

const SkillWindow = ({ darkMode, activeRole, title = 'SYSTEM_MAP', className = '', frame = true }) => {
  const [mode, setMode] = useState('normal'); // normal | minimized | fullscreen | closed
  const [seenRole, setSeenRole] = useState(activeRole);

  // Choosing a role is what brings a closed window back. Adjusted during
  // render rather than in an effect, which avoids the extra pass an effect
  // writing state would cost.
  if (seenRole !== activeRole) {
    setSeenRole(activeRole);
    if (mode === 'closed') setMode('normal');
  }

  // Escape leaves fullscreen rather than trapping the visitor there.
  useEffect(() => {
    if (mode !== 'fullscreen') return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMode('normal');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mode]);

  const bar = (
    <div className="flex items-center gap-2 px-4 py-3 shrink-0">
      <Light colour="bg-red-500" hover="hover:bg-red-400" label="Close map" onClick={() => setMode('closed')} />
      <Light
        colour="bg-yellow-500"
        hover="hover:bg-yellow-400"
        label={mode === 'minimized' ? 'Restore map' : 'Minimise map'}
        onClick={() => setMode((m) => (m === 'minimized' ? 'normal' : 'minimized'))}
      />
      <Light
        colour="bg-acid"
        hover="hover:bg-acid-light"
        label={mode === 'fullscreen' ? 'Exit fullscreen' : 'Fullscreen map'}
        onClick={() => setMode((m) => (m === 'fullscreen' ? 'normal' : 'fullscreen'))}
      />
      <span className="ml-auto font-meta text-[10px] uppercase tracking-widest opacity-40">
        {title}
        {mode === 'minimized' ? ' · MINIMISED' : ''}
      </span>
    </div>
  );

  const shell = `rounded-2xl overflow-hidden border ${
    darkMode ? 'border-white/10 bg-black/40' : 'border-black/10 bg-white/50'
  } backdrop-blur-xl`;

  if (mode === 'closed') {
    return (
      <div className={`${frame ? shell : ''} ${className} flex items-center justify-center py-6 px-4`}>
        <p className="font-meta text-[10px] uppercase tracking-widest opacity-40 text-center">
          {title} closed · pick a role to reopen
        </p>
      </div>
    );
  }

  if (mode === 'minimized') {
    return <div className={`${frame ? shell : ''} ${className}`}>{bar}</div>;
  }

  if (mode === 'fullscreen') {
    return (
      <>
        {/* The slot keeps its place in the layout so nothing below jumps. */}
        <div className={`${frame ? shell : ''} ${className}`}>{bar}</div>
        <div className="fixed inset-0 z-[120] p-3 md:p-8 flex" role="dialog" aria-modal="true" aria-label={title}>
          <div
            className={`liquid-panel ${darkMode ? 'text-white' : 'liquid-panel--light text-black'} rounded-3xl w-full h-full flex flex-col overflow-hidden`}
          >
            {bar}
            <div className="relative flex-1">
              <SkillNetwork
                darkMode={darkMode}
                activeRole={activeRole}
                className="absolute inset-0 w-full h-full overflow-hidden"
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={`${frame ? shell : ''} ${className} flex flex-col`}>
      {bar}
      <div className={`relative flex-1 ${frame ? 'min-h-[52vh] md:min-h-[60vh]' : ''}`}>
        <SkillNetwork
          darkMode={darkMode}
          activeRole={activeRole}
          className="absolute inset-0 w-full h-full overflow-hidden"
        />
      </div>
    </div>
  );
};

export default SkillWindow;
