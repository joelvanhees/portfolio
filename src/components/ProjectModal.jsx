import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { ArrowUpRight, FileText, Layers, Maximize2, Video, X, Volume2, VolumeX } from 'lucide-react';

import HoverVideoPlayer from './visuals/HoverVideoPlayer';
import InfiniteMarqueeVisual from './visuals/InfiniteMarqueeVisual';

const SpiralTimeSphere = lazy(() => import('./visuals/SpiralTimeSphere'));
const TypographicClockVisual = lazy(() => import('./visuals/TypographicClockVisual'));
const BufferOverflowVisual = lazy(() => import('./visuals/BufferOverflowVisual'));

import previewWebImg from '../assets/images/previewWEB.png';
import checkYourBusImg from '../assets/images/check_your_bus_cover.jpg';
import busLanguageImg from '../assets/images/check_your_bus_language.jpg';
import busAttentionImg from '../assets/images/check_your_bus_attention.jpg';
import busLiquidImg from '../assets/images/check_your_bus_liquid.jpg';
import busPerceptionImg from '../assets/images/check_your_bus_perception.jpg';

import imgRef01 from '../assets/images/IMG_REF_01.jpg';
import imgRef02 from '../assets/images/IMG_REF_02.jpeg';

import exhibitionInfImg from '../assets/images/exhibitionINF.JPG';
import monsterImg from '../assets/images/monster.png';

import ikeaMerch1 from '../assets/images/ikea_merch_1.jpg';
import ikeaMerch2 from '../assets/images/ikea_merch_2.jpg';
import salatProfileImg from '../assets/images/salat_profile.png';
import threedSign1 from '../assets/images/threed_sign1.png';
import threedSign2 from '../assets/images/threed_sign2.png';

import softBodyProcess from '../assets/branding/soft-body-home/brandingSOFTprocess.jpeg';
import softBodyLogo from '../assets/branding/soft-body-home/brandingSOFT.png';
import softBodyFinal from '../assets/branding/soft-body-home/brandingSOFTfinal.jpeg';

import prideLogo from '../assets/branding/pride-kunst/PrideKunstLOO.jpeg';
import prideBox from '../assets/branding/pride-kunst/PKlogoBOX.jpeg';

import mate1 from '../assets/branding/yerba-mate/mate1.png';
import mate2 from '../assets/branding/yerba-mate/mate2.jpg';
import mate3 from '../assets/branding/yerba-mate/mate3.jpeg';

import sugarLogo from '../assets/branding/sugar-damage/SUGARdamage.logo.jpeg';
import sugarCover from '../assets/branding/sugar-damage/SUGARdamage.cover.jpeg';

import logoJoel from '../assets/branding/logos/logoJOEL.PNG';
import logoVNC from '../assets/branding/logos/logoVNC.GIF';
import logoMichael from '../assets/branding/logos/michaelanikoleit.logo.jpg';

import { p50Data } from '../content/p50';

const ProjectModal = ({
  selectedProject,
  darkMode,
  showVideoSequence,
  setShowVideoSequence,
  setSelectedProject,
  setActiveImage,
  setActivePdf,
}) => {
  if (!selectedProject) return null;

  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const audioRef = useRef(null);

  // Interactive bus dashboard states
  const [bus1, setBus1] = useState("");
  const [bus2, setBus2] = useState("");
  const [bus3, setBus3] = useState("");
  const [showBusResult, setShowBusResult] = useState(false);

  // Soundscape audio initializer
  useEffect(() => {
    if (selectedProject?.id === "07") {
      audioRef.current = new Audio('/sound.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
      const playAudio = async () => {
        try {
          await audioRef.current.play();
          setIsPlayingSound(true);
        } catch (e) {
          console.log("Audio play blocked by browser. User interaction needed.");
        }
      };
      playAudio();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setIsPlayingSound(false);
      }
    };
  }, [selectedProject]);

  const toggleSound = () => {
    if (!audioRef.current) return;
    if (isPlayingSound) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
    }
    setIsPlayingSound(!isPlayingSound);
  };

  const handleClose = () => {
    setSelectedProject(null);
    setShowVideoSequence(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12">
      <div
        className="absolute inset-0 backdrop-blur-xl bg-black/40 transition-all duration-500"
        onClick={handleClose}
      ></div>

      <div className={`relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95 duration-300
            ${darkMode
          ? 'bg-white/5 border-white/10 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]'
          : 'bg-white/40 border-white/40 text-black shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]'
        } backdrop-blur-2xl`}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 md:p-8 border-b border-white/10 bg-inherit backdrop-blur-xl rounded-t-3xl">
          <div>
            <span className={`text-xs font-bold px-2 py-1 rounded mb-2 inline-block ${darkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
              {selectedProject.category}
            </span>
            <h2 className={`text-3xl md:text-5xl font-rubik font-bold leading-none mt-2 ${selectedProject.id === "02" ? "lowercase" : "uppercase"}`}>
              <span className="glitch-hover cursor-default block">{selectedProject.title}</span>
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={32} />
          </button>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="flex flex-col gap-6">
            <div className={`relative w-full overflow-hidden flex items-center justify-center rounded-2xl ${darkMode ? 'bg-black/50' : 'bg-white/50'}
                    ${selectedProject.id === "01" ? "aspect-[9/16] max-w-sm mx-auto" : "aspect-square"}
                 `}>
              {selectedProject.id === "02" ? (
                <div className="w-full h-full relative">
                  <Suspense fallback={<div className="flex items-center justify-center w-full h-full text-xs font-mono opacity-50">[LOADING_3D_ORB...]</div>}>
                    <SpiralTimeSphere />
                  </Suspense>
                </div>
              ) : selectedProject.id === "06" ? (
                <div className="absolute inset-0 w-full h-full">
                  <HoverVideoPlayer src="/videos/peelvid.mp4" />
                </div>
              ) : selectedProject.id === "05" ? (
                <div className="absolute inset-0 w-full h-full">
                  <InfiniteMarqueeVisual />
                </div>
              ) : selectedProject.id === "01" ? (
                <div className="absolute inset-0 w-full h-full">
                  <HoverVideoPlayer src="/videos/ikea_reel.mp4" />
                </div>
              ) : selectedProject.id === "04" ? (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <img src={logoVNC} className="w-full h-full object-contain" alt="VNC Identity" />
                </div>
              ) : selectedProject.id === "00" ? (
                <div className="w-full h-full bg-black/5 flex items-center justify-center overflow-hidden">
                  <img src={previewWebImg} className="w-full h-full object-cover" alt="Web Preview" />
                </div>
              ) : (selectedProject.visualComponent) ? (
                <div className="w-full h-full">
                  {selectedProject.visualComponent}
                </div>
              ) : (
                <div className="opacity-20">
                  {selectedProject.id === "01" ? <Video size={64} /> : <Layers size={64} />}
                </div>
              )}

              {selectedProject.id === "01" ? (
                <div className="absolute bottom-4 right-4 flex gap-2 text-xs font-mono opacity-60 pointer-events-none">
                  <Video size={12} /> VIDEO PREVIEW
                </div>
              ) : (
                !showVideoSequence && selectedProject.id !== "02" && selectedProject.id !== "04" && selectedProject.id !== "05" && (
                  <div className="absolute bottom-4 right-4 flex gap-2 text-xs font-mono opacity-60">
                    <Maximize2 size={12} /> INTERACTIVE PREVIEW
                  </div>
                )
              )}
            </div>

            {selectedProject.extraVisuals && (
              <Suspense fallback={<div className="flex items-center justify-center w-full min-h-[200px] text-xs font-mono opacity-50">[LOADING_3D_TUNNEL...]</div>}>
                <div className="mt-4 aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black relative shadow-2xl">
                  <TypographicClockVisual />
                </div>

                <div className="mt-4 aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black relative shadow-2xl">
                  <BufferOverflowVisual />
                  <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white/50 bg-black/50 px-2 py-1 rounded">
                    [BUFFER_OVERFLOW.EXE] RUNNING...
                  </div>
                </div>
              </Suspense>
            )}

            {selectedProject.id === "02" && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className={`aspect-[3/2] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                  <img src={imgRef01} alt="Concept Art" loading="lazy" className="w-full h-full object-cover cursor-zoom-in" onClick={() => setActiveImage(imgRef01)} />
                </div>
                <div className={`aspect-[3/2] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                  <img src={imgRef02} alt="UI Mockup" loading="lazy" className="w-full h-full object-cover cursor-zoom-in" onClick={() => setActiveImage(imgRef02)} />
                </div>
              </div>
            )}

            {selectedProject.id === "03" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className={`aspect-[2/3] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                  <img src={exhibitionInfImg} alt="Exhibition View" loading="lazy" className="w-full h-full object-cover cursor-zoom-in" onClick={() => setActiveImage(exhibitionInfImg)} />
                </div>

                <div className="flex flex-col gap-4">
                  <div className={`aspect-[3/2] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                    <img src={monsterImg} alt="Monster Artwork" loading="lazy" className="w-full h-full object-cover cursor-zoom-in" onClick={() => setActiveImage(monsterImg)} />
                  </div>

                  <div className={`aspect-[3/2] w-full rounded-xl border flex items-center justify-center overflow-hidden relative ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <span className="font-mono text-xs uppercase tracking-widest opacity-50">COMING SOON</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedProject.id === "06" && (
              <div className="flex flex-col gap-4 mt-4">
                {p50Data.pairs.map((pair, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4">
                    <div className={`aspect-[3/4] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                      <img src={pair.a} alt={`Student Concept ${i + 1}A`} loading="lazy" className="w-full h-full object-cover cursor-zoom-in" onClick={() => setActiveImage(pair.a)} />
                    </div>
                    <div className={`aspect-[3/4] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                      <img src={pair.b} alt={`Student Concept ${i + 1}B`} loading="lazy" className="w-full h-full object-cover cursor-zoom-in" onClick={() => setActiveImage(pair.b)} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedProject.id === "01" && (
              <div className="flex flex-col gap-4 mt-4">
                <div className={`aspect-[2/3] w-full max-w-sm mx-auto rounded-xl border flex items-center justify-center overflow-hidden relative group ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                  <img src={salatProfileImg} loading="lazy" className="w-full h-full object-cover cursor-zoom-in" alt="Profile View" onClick={() => setActiveImage(salatProfileImg)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`aspect-[2/3] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                    <img src={ikeaMerch1} loading="lazy" className="w-full h-full object-cover cursor-zoom-in" alt="Plush Toy Design" onClick={() => setActiveImage(ikeaMerch1)} />
                  </div>
                  <div className={`aspect-[2/3] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                    <img src={ikeaMerch2} loading="lazy" className="w-full h-full object-cover cursor-zoom-in" alt="Plush Toy Final" onClick={() => setActiveImage(ikeaMerch2)} />
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="flex flex-col gap-8">
            {selectedProject.brandLinks && (
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-mono uppercase tracking-widest opacity-50 mb-2">Live Channels</h3>
                {selectedProject.brandLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline opacity-80 hover:opacity-100">
                    <ArrowUpRight size={14} /> {link.label}
                  </a>
                ))}
              </div>
            )}

            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest opacity-50 mb-4">Stack</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tech.map(t => (
                  <span key={t} className={`px-3 py-1 rounded-full text-xs font-mono border ${darkMode ? 'border-white/20' : 'border-black/10'}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {selectedProject.id === "01" ? (
              <div className="space-y-12 mt-4">
                <div>
                  <h3 className="text-xl font-rubik font-bold mb-4 uppercase text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Social Media</h3>
                  <p className="text-lg font-light leading-relaxed">
                    Created artistic, experimental video content centered around the 'Salatschüssel' persona. This strategic content creation grew the channel to ~400k followers and generated over 10 million likes, establishing a massive organic reach.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-rubik font-bold mb-4 uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-yellow-400">Campaign</h3>
                  <p className="text-lg font-light leading-relaxed mb-6">
                    Directed and produced the official advertising video for IKEA Deutschland. The focus was on translating the brand's message into a format that resonates with a digital-native audience.
                  </p>

                  <div className="flex flex-col gap-4 mb-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`aspect-square w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                        <img src={threedSign1} loading="lazy" className="w-full h-full object-cover cursor-zoom-in" alt="3D Signage Process 1" onClick={() => setActiveImage(threedSign1)} />
                      </div>
                      <div className={`aspect-square w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                        <img src={threedSign2} loading="lazy" className="w-full h-full object-cover cursor-zoom-in" alt="3D Signage Process 2" onClick={() => setActiveImage(threedSign2)} />
                      </div>
                    </div>
                    <p className="font-mono text-xs opacity-60 leading-relaxed">
                      “Custom 3D signage designed in Fusion 360, produced via in-house 3D printing and used as physical set elements for the IKEA video production.”
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-rubik font-bold mb-4 uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Merchandise</h3>
                  <p className="text-lg font-light leading-relaxed mb-6">
                    Designed and produced the official 'Salatschüssel' plush toy as a physical extension of the digital brand. The process involved 3D character design, prototyping, and final production oversight.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-rubik font-bold mb-4 uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Literature & Interaction</h3>
                  <p className="text-lg font-light leading-relaxed mb-6">
                    Developed 'Check Your Bus', an interactive digital essay exploring decolonial critique (based on Machado de Oliveira's 'Hospicing Modernity') and liquid modernity. The project features custom canvas visualizations, sensory experiments, real-time reflection interfaces, and an immersive soundscape.
                  </p>

                  <div className="flex flex-col gap-4 mb-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className={`aspect-video w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                        <img src={checkYourBusImg} loading="lazy" className="w-full h-full object-cover cursor-zoom-in" alt="Check Your Bus Preview" onClick={() => setActiveImage(checkYourBusImg)} />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-2">
                      <a href="https://checkyourbus.vercel.app" target="_blank" rel="noopener noreferrer" className={`px-4 py-2 rounded-full text-xs font-mono border hover:bg-white hover:text-black transition-all ${darkMode ? 'border-white/20' : 'border-black/10'}`}>
                        [LAUNCH_LIVE_SITE ↗]
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedProject.id === "07" ? (
              <div className="space-y-12 mt-4 animate-in fade-in duration-300">
                {/* Immersive Soundscape Controller */}
                <div className={`p-6 rounded-2xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'} flex items-center justify-between shadow-2xl`}>
                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-widest opacity-50 mb-1">Atmosphere</h3>
                    <h4 className="text-lg font-bold font-syne uppercase">Immersive Soundscape</h4>
                    <p className="text-xs opacity-75 font-mono">Original audio score of the digital essay</p>
                  </div>
                  <button 
                    onClick={toggleSound}
                    className={`p-4 rounded-full border transition-all cursor-pointer ${isPlayingSound ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.4)]' : 'bg-transparent border-current hover:bg-white/10'}`}
                  >
                    {isPlayingSound ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  </button>
                </div>

                {/* Conceptual Strategy: Figma & Implementation */}
                <div>
                  <h3 className="text-xl font-rubik font-bold mb-4 uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Design & Implementation</h3>
                  <p className="text-lg font-light leading-relaxed mb-6">
                    Check Your Bus was first developed as a high-fidelity visual design system in **Figma** to establish precise glassmorphism grids, bold typographic hierarchy, and its signature electric blue and neon styling. 
                  </p>
                  <p className="text-lg font-light leading-relaxed mb-6">
                    It was subsequently custom-coded and engineered in **Vanilla HTML, CSS, and JavaScript** without any bulky external frameworks, ensuring maximum loading speed and ultra-smooth scrolling.
                  </p>
                </div>

                {/* Interactive Bus Dashboard (Simulated) */}
                <div className={`p-6 rounded-2xl border ${darkMode ? 'border-[#ccff00]/20 bg-black/40' : 'border-[#0022cc]/20 bg-[#0022cc]/5'} shadow-2xl space-y-6`}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-mono font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-[#00FF41]">
                      [BUS_DASHBOARD.EXE]
                    </h3>
                    <span className="text-[10px] font-mono opacity-50 uppercase">[STATUS: INTERACTIVE]</span>
                  </div>
                  <p className="text-sm opacity-80 leading-relaxed font-mono">
                    {'>'} Map the passengers steering your worldview right now:
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase opacity-60 mb-2">1. Who or what is driving your decisions?</label>
                      <input 
                        type="text" 
                        value={bus1} 
                        onChange={(e) => setBus1(e.target.value)}
                        placeholder="e.g. Rationality, parental expectations, ambition..." 
                        className={`w-full p-3 rounded-xl border text-sm font-mono outline-none transition-all ${darkMode ? 'bg-black/60 border-white/10 text-white focus:border-[#ccff00]' : 'bg-white border-black/10 text-black focus:border-[#0022cc]'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase opacity-60 mb-2">2. Which fear or voice shouts loudest?</label>
                      <input 
                        type="text" 
                        value={bus2} 
                        onChange={(e) => setBus2(e.target.value)}
                        placeholder="e.g. Fear of failure, not being enough..." 
                        className={`w-full p-3 rounded-xl border text-sm font-mono outline-none transition-all ${darkMode ? 'bg-black/60 border-white/10 text-white focus:border-[#ccff00]' : 'bg-white border-black/10 text-black focus:border-[#0022cc]'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase opacity-60 mb-2">3. What sits in the back, unseen?</label>
                      <input 
                        type="text" 
                        value={bus3} 
                        onChange={(e) => setBus3(e.target.value)}
                        placeholder="e.g. SUPPRESSED_DREAM.DAT, early childhood memory..." 
                        className={`w-full p-3 rounded-xl border text-sm font-mono outline-none transition-all ${darkMode ? 'bg-black/60 border-white/10 text-white focus:border-[#ccff00]' : 'bg-white border-black/10 text-black focus:border-[#0022cc]'}`}
                      />
                    </div>

                    <button 
                      onClick={() => setShowBusResult(true)}
                      disabled={!bus1 || !bus2 || !bus3}
                      className={`w-full py-3 rounded-xl font-mono text-sm font-bold uppercase transition-all duration-300 ${(!bus1 || !bus2 || !bus3) ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.01]'} ${darkMode ? 'bg-[#ccff00] text-black hover:bg-[#b5e000]' : 'bg-[#0022cc] text-white hover:bg-[#001bb3]'}`}
                    >
                      Analyze Bus Configuration
                    </button>

                    {showBusResult && (
                      <div className={`p-4 rounded-xl border animate-in fade-in slide-in-from-bottom-4 duration-500 font-mono text-xs leading-relaxed ${darkMode ? 'bg-black/80 border-[#ccff00]/40 text-[#ccff00]' : 'bg-[#0022cc]/10 border-[#0022cc]/30 text-[#0022cc]'}`}>
                        <div className="font-bold uppercase tracking-widest mb-2 text-current">[DIAGNOSTIC_REPORT]</div>
                        <p className="mb-3">
                          Diagnostics complete. Your identified passengers are coexisting: <span className="underline">"{bus1}"</span> as driver, <span className="underline">"{bus2}"</span> as the dominant voice, and <span className="underline">"{bus3}"</span> in the background.
                        </p>
                        <p className="italic opacity-85">
                          "If we cannot hold space for the complexities within us, there is no chance for us to hold space for the complexities around us." — V. Machado de Oliveira, Hospicing Modernity
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grid of screenshots & Translation */}
                <div className="space-y-6">
                  <h3 className="text-xl font-rubik font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">Interface & Translation</h3>
                  <p className="text-lg font-light leading-relaxed">
                    The project was designed fully bilingual (in both **German** and **English**) to support accessibility. Below are selected interface cards showcasing the high-fidelity design first mapped in **Figma** and then custom-engineered in pure **JavaScript** and **CSS**.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <div className={`aspect-[9/16] w-full rounded-xl border flex items-center justify-center overflow-hidden cursor-zoom-in ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                        <img src={busLanguageImg} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Bilingual Screen" onClick={() => setActiveImage(busLanguageImg)} />
                      </div>
                      <span className="font-mono text-[10px] opacity-60 uppercase text-center">[01 // LANG_SCREEN]</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className={`aspect-[9/16] w-full rounded-xl border flex items-center justify-center overflow-hidden cursor-zoom-in ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                        <img src={busPerceptionImg} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Perception Check Card" onClick={() => setActiveImage(busPerceptionImg)} />
                      </div>
                      <span className="font-mono text-[10px] opacity-60 uppercase text-center">[02 // PERCEPTION_CHECK]</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className={`aspect-[9/16] w-full rounded-xl border flex items-center justify-center overflow-hidden cursor-zoom-in ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                        <img src={busLiquidImg} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Solid Liquid Card" onClick={() => setActiveImage(busLiquidImg)} />
                      </div>
                      <span className="font-mono text-[10px] opacity-60 uppercase text-center">[03 // SOLID_LIQUID_CARD]</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className={`aspect-[9/16] w-full rounded-xl border flex items-center justify-center overflow-hidden cursor-zoom-in ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                        <img src={busAttentionImg} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Attention Extraction Card" onClick={() => setActiveImage(busAttentionImg)} />
                      </div>
                      <span className="font-mono text-[10px] opacity-60 uppercase text-center">[04 // ATTENTION_CARD]</span>
                    </div>
                  </div>
                </div>

                {/* Custom Dedicated Launch Button */}
                <div className="pt-6 border-t border-white/10 font-mono">
                  <h3 className="text-sm font-mono uppercase tracking-widest opacity-50 mb-4">Launch</h3>
                  <a 
                    href="https://checkyourbus.vercel.app" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-center transition-all hover:scale-[1.02] flex items-center justify-center gap-2 border bg-[#0022cc] text-[#ccff00] border-[#ccff00] hover:bg-[#ccff00] hover:text-[#0022cc] shadow-[0_0_20px_rgba(204,255,0,0.15)] cursor-pointer"
                  >
                    [BOARD_THE_BUS_LIVE ↗]
                  </a>
                </div>
              </div>
            ) : selectedProject.id === "04" ? (
              <div className="space-y-16 mt-8">
                <div>
                  <h3 className="text-xl font-rubik font-bold mb-4 uppercase">Pride Kunst</h3>
                  <p className="mb-4 text-sm opacity-80">Brand identity and physical extension. Logo design and production of illuminated brand objects.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5">
                      <img src={prideLogo} className="w-full h-auto object-contain" alt="Pride Logo" />
                    </div>
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5">
                      <img src={prideBox} className="w-full h-auto object-contain" alt="Pride Box" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-rubik font-bold mb-4 uppercase">Yerba Mate</h3>
                  <p className="mb-4 text-sm opacity-80">Packaging design in team context. Responsible for illustration system and visual language.</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5"><img src={mate1} alt="Yerba Mate Design 1" loading="lazy" className="w-full h-auto object-contain" /></div>
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5"><img src={mate2} alt="Yerba Mate Design 2" loading="lazy" className="w-full h-auto object-contain" /></div>
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5"><img src={mate3} alt="Yerba Mate Design 3" loading="lazy" className="w-full h-auto object-contain" /></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-rubik font-bold mb-4 uppercase">Sugar Damage</h3>
                  <p className="mb-4 text-sm opacity-80">Visual identity for pop band Sugar Damage. Logo, album artwork and animated streaming canvas.</p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5"><img src={sugarLogo} alt="Sugar Damage Logo" loading="lazy" className="w-full h-auto object-contain" /></div>
                      <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5"><img src={sugarCover} alt="Sugar Damage Cover" loading="lazy" className="w-full h-auto object-contain" /></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-rubik font-bold mb-4 uppercase">Selected Logos</h3>
                  <p className="mb-4 text-sm opacity-80">Selected logo designs for artists and creatives.</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5"><img src={logoJoel} loading="lazy" className="w-full h-auto object-contain" /></div>

                    <div className="flex flex-col items-end">
                      <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5 w-full">
                        <img src={logoVNC} loading="lazy" className="w-full h-auto object-contain" />
                      </div>
                      <span className="font-mono text-[10px] opacity-50 mt-1 uppercase">VNC_SYSTEM</span>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                      <img src={logoMichael} loading="lazy" className="w-full h-auto object-contain" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-rubik font-bold mb-4 uppercase">Soft Body Home</h3>
                  <div className="space-y-4">
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5">
                      <img src={softBodyProcess} className="w-full h-auto object-contain" alt="Process & exploration" />
                    </div>
                    <p className="font-mono text-xs opacity-60">Process & exploration</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5 mb-2">
                          <img src={softBodyLogo} className="w-full h-auto object-contain" alt="Early logo iteration" />
                        </div>
                        <p className="font-mono text-xs opacity-60">Early logo iteration</p>
                      </div>
                      <div>
                        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5 mb-2">
                          <img src={softBodyFinal} className="w-full h-auto object-contain" alt="Final logo" />
                        </div>
                        <p className="font-mono text-xs opacity-60">Final logo</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest opacity-50 mb-4">Briefing</h3>
                <p className="text-lg md:text-xl leading-relaxed font-light whitespace-pre-line">
                  {selectedProject.longDescription || selectedProject.description}
                </p>

                {selectedProject.id === "00" && selectedProject.hasPdf && (
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <button
                      onClick={() => setActivePdf(selectedProject.pdfUrl)}
                      className="group flex items-center gap-4 text-left hover:bg-white/5 p-4 rounded-xl transition-all w-full border border-transparent hover:border-white/10"
                    >
                      <div className="p-3 bg-red-500/10 text-red-500 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
                        <FileText size={24} />
                      </div>
                      <div>
                        <div className="font-bold uppercase text-sm">Designing a Website</div>
                        <div className="text-xs opacity-60 font-mono">Complete Concept and Implementation</div>
                      </div>
                      <ArrowUpRight className="ml-auto opacity-50 group-hover:opacity-100" size={16} />
                    </button>
                  </div>
                )}

                {selectedProject.id === "06" && (
                  <div className="mt-12 space-y-12">
                    <div>
                      <h3 className="text-xl font-rubik font-bold mb-4 uppercase">The Interface</h3>
                      <p className="mb-4 text-sm opacity-80">The blank posters served as an open invitation for student participation.</p>
                      <div className="grid grid-cols-2 gap-4">
                        {p50Data.blanks.map((img, idx) => (
                          <div key={idx} className={`aspect-[3/4] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                            <img src={img} alt={`Blank Poster ${idx + 1}`} loading="lazy" className="w-full h-full object-cover cursor-zoom-in" onClick={() => setActiveImage(img)} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-rubik font-bold mb-4 uppercase">Context</h3>
                      <p className="mb-4 text-sm opacity-80">Posters distributed within the university environment.</p>
                      <div className="grid grid-cols-3 gap-2">
                        {p50Data.outdoor.map((img, idx) => (
                          <div key={idx} className={`aspect-[9/16] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                            <img src={img} alt={`Outdoor Context ${idx + 1}`} loading="lazy" className="w-full h-full object-cover cursor-zoom-in" onClick={() => setActiveImage(img)} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedProject.exhibitions && (
              <div className="border-l-2 border-current pl-4">
                <h3 className="text-sm font-mono uppercase tracking-widest opacity-50 mb-4">Exhibitions</h3>
                <ul className="space-y-4">
                  {selectedProject.exhibitions.map((ex, i) => (
                    <li key={i} className="text-lg md:text-xl font-light">
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto pt-8 border-t border-white/10">
              {selectedProject.id !== "02" && selectedProject.id !== "07" && (
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${darkMode ? 'bg-[#00FF41] text-black hover:bg-[#00cc33]' : 'bg-[#0055FF] text-white hover:bg-[#0044cc]'}`}
                >
                  Launch Project <ArrowUpRight size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
