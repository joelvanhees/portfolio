import { ArrowUpRight, FileText, Layers, Maximize2, Video, X } from 'lucide-react';

import HoverVideoPlayer from './visuals/HoverVideoPlayer';
import InfiniteMarqueeVisual from './visuals/InfiniteMarqueeVisual';
import SpiralTimeSphere from './visuals/SpiralTimeSphere';
import TypographicClockVisual from './visuals/TypographicClockVisual';
import BufferOverflowVisual from './visuals/BufferOverflowVisual';

import previewWebImg from '../assets/images/previewWEB.png';

import imgRef01 from '../assets/images/IMG_REF_01.jpg';
import imgRef02 from '../assets/images/IMG_REF_02.jpeg';

import exhibitionInfImg from '../assets/images/exhibitionINF.JPG';
import monsterImg from '../assets/images/monster.png';

import ikeaMerch1 from '../assets/images/ikea_merch_1.jpg';
import ikeaMerch2 from '../assets/images/ikea_merch_2.jpg';
import salatProfileImg from '../assets/images/salat_profile.png';
import threedSign1 from '../assets/images/threed_sign1.png';
import threedSign2 from '../assets/images/threed_sign2.png';
import ikeaLogo from '../assets/logos/ikea.png';
import britaLogo from '../assets/logos/brita.png';
import goveeLogo from '../assets/logos/govee.png';

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
import sugarSpotifyVideo from '../assets/branding/sugar-damage/spotify.mp4';

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
                  <SpiralTimeSphere />
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
              <>
                <div className="mt-4 aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black relative shadow-2xl">
                  <TypographicClockVisual />
                </div>

                <div className="mt-4 aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black relative shadow-2xl">
                  <BufferOverflowVisual />
                  <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white/50 bg-black/50 px-2 py-1 rounded">
                    [BUFFER_OVERFLOW.EXE] RUNNING...
                  </div>
                </div>
              </>
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
                  <div className="flex gap-6 mb-8 items-center border-b border-white/10 pb-8">
                    <img src={ikeaLogo} alt="IKEA" className="h-8 w-auto object-contain" />
                    <img src={britaLogo} alt="Brita" className="h-8 w-auto object-contain" />
                    <img src={goveeLogo} alt="Govee" className="h-8 w-auto object-contain" />
                  </div>

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
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5">
                      <video src={sugarSpotifyVideo} className="w-full h-auto" autoPlay loop muted playsInline />
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
              {selectedProject.id !== "02" && (
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
