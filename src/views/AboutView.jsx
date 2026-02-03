import portraitImg from '../assets/images/portrait.jpg';

const AboutView = ({ darkMode }) => (
  <div className="pt-32 px-6 min-h-screen max-w-7xl mx-auto pb-40">
    <div className="mb-12">
      <h1 className="text-[15vw] md:text-9xl font-rubik font-bold leading-none break-words uppercase">
        <span className="glitch-hover cursor-default block">ABOUT</span>
      </h1>
      <h2 className="text-3xl md:text-5xl font-rubik italic font-bold mt-2 opacity-80">
        <span className="glitch-hover cursor-default block">Joel van Hees</span>
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
      <div>
        <div className={`aspect-[3/4] w-full max-w-md rounded-2xl overflow-hidden relative transition-all duration-700 ${darkMode ? 'bg-[#111]' : 'bg-[#ccc]'}`}>
          <img src={portraitImg} alt="Joel van Hees" className="w-full h-full object-cover" />
        </div>
      </div>

      <div>
        <div className={`p-8 rounded-lg font-mono text-sm leading-relaxed mb-12 ${darkMode ? 'bg-[#111] border border-green-900/30' : 'bg-gray-100 border border-gray-300'}`}>
          <p className="mb-4 text-xs opacity-50">/ MANIFESTO.TXT</p>
          <p className="mb-6">
            I am a graphic designer working across brand systems, generative design and visual storytelling.
            My practice is interdisciplinary, combining graphic design, typography, motion, 3D and creative coding to develop coherent visual systems.
          </p>
          <p className="mb-6">
            I work conceptually and system-oriented, translating ideas into scalable identities, interfaces and visual narratives.
            This approach allows me to move fluently between static and dynamic media, from print and branding to real-time visuals and interactive environments.
          </p>
          <p>
            With a strong foundation in classical design principles and hands-on experience in experimental tools, I focus on building work that is structured, adaptable and context-aware.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-current pb-2">
            <span className="font-mono text-xs opacity-50">LOCATION</span>
            <span className="font-syne font-bold">COLOGNE / GERMANY</span>
          </div>
          <div className="flex justify-between items-center border-b border-current pb-2">
            <span className="font-mono text-xs opacity-50">STATUS</span>
            <span className={`font-syne font-bold ${darkMode ? 'text-green-500' : 'text-blue-500'}`}>AVAILABLE FOR JOBS</span>
          </div>
          <div className="flex justify-between items-center border-b border-current pb-2">
            <span className="font-mono text-xs opacity-50">EMAIL</span>
            <span className="font-syne font-bold">kontakt@joelvanhees.de</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AboutView;
