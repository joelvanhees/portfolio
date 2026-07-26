import portraitImg from '../assets/images/portrait.jpg';
import ScrollTypewriter from '../components/ScrollTypewriter';

const AboutView = ({ darkMode }) => (
  <div className="pt-32 px-6 min-h-screen max-w-7xl mx-auto pb-14 md:pb-40">
    <div data-reveal className="mb-5 md:mb-12">
      <h1 className="text-[15vw] md:text-9xl font-rubik font-bold leading-none break-words uppercase">
        <span className="glitch-hover cursor-default block">ABOUT</span>
      </h1>
      <h2 className="text-3xl md:text-5xl font-rubik italic font-bold mt-2 opacity-80">
        <span className="glitch-hover cursor-default block">joel van hees</span>
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-16 items-start">
      <div data-reveal>
        <div className={`aspect-[3/4] w-full max-w-md rounded-2xl overflow-hidden relative transition-all duration-700 ${darkMode ? 'bg-[#111]' : 'bg-[#ccc]'}`}>
          <img src={portraitImg} alt="Joel van Hees" className="w-full h-full object-cover" />
        </div>
      </div>

      <div data-reveal style={{ '--reveal-delay': '75ms' }}>
        <div className={`p-8 rounded-lg font-meta text-sm leading-relaxed mb-6 md:mb-12 ${darkMode ? 'bg-[#111] border border-acid-deep/30' : 'bg-gray-100 border border-gray-300'}`}>
          <p className="mb-4 text-xs opacity-50">/ MANIFESTO.TXT</p>
          {/* Typed out by scroll position, so the file reads as if it is being
              written while you move through it. */}
          <p className="mb-6">
            <ScrollTypewriter text="I am a multidisciplinary designer and web developer. My practice spans brand systems, web development, generative design and visual storytelling — combining typography, motion, 3D, industrial design and creative coding into coherent systems rather than isolated artefacts." />
          </p>
          <p className="mb-6">
            <ScrollTypewriter
              start={0.78}
              end={0.28}
              text="I work conceptually and system-oriented, translating ideas into scalable identities, interfaces and visual narratives. Web development is a core part of that: I build the sites and interfaces myself, in React, WebGL and custom shaders, so the concept survives all the way into production."
            />
          </p>
          <p>
            <ScrollTypewriter
              start={0.7}
              end={0.22}
              text="The range is deliberate. Classical design principles, frontend engineering and physical fabrication are not separate disciplines to me but one practice, which is why a project can end as a brand system, a website or a kinetic sculpture depending on what the idea actually needs."
            />
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-current pb-2">
            <span className="font-meta text-xs opacity-50">LOCATION</span>
            <span className="font-display font-bold">COLOGNE / GERMANY</span>
          </div>
          <div className="flex justify-between items-center border-b border-current pb-2">
            <span className="font-meta text-xs opacity-50">STATUS</span>
            <span className={`font-display font-bold ${darkMode ? 'text-acid' : 'text-blue-500'}`}>AVAILABLE FOR PROJECTS</span>
          </div>
          <div className="flex justify-between items-center border-b border-current pb-2">
            <span className="font-meta text-xs opacity-50">EMAIL</span>
            <span className="font-display font-bold">kontakt@joelvanhees.de</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AboutView;
