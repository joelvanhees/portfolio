/*
 * Everything the shell can answer, as data.
 *
 * `terms` are matched as whole words, prefixes or near-spellings — never as
 * bare substrings — so a term like "ort" can no longer be found inside
 * "portfolio". Each intent lists the ways people actually ask for it, in
 * German and English, including the plain command name.
 *
 * `action` is handled by the console: the text here stays declarative.
 */

export const shellIntents = [
  {
    id: 'help',
    terms: ['help', 'hilfe', 'commands', 'befehle', 'kommandos', 'menu', 'usage', 'anleitung', 'was kannst du', 'what can you do', 'optionen', 'options'],
    respond: ({ addon }) =>
      `Available commands:\n  about         - Creative practice manifesto\n  projects      - Index of selected works\n  contact       - Get in touch directly (with uplink trigger)\n  cooldown      - Enter sensory water grid reflection space\n  theme         - Toggle Dark/Light Mode\n  checkyourbus  - Launch literature diagnostic\n  clear         - Clear terminal history\n  exit          - Close shell\n\nYou do not have to type them exactly — ask in your own words.${addon}`,
  },
  {
    id: 'about',
    broad: true,
    terms: ['about', 'ueber', 'manifesto', 'manifest', 'praxis', 'practice', 'yourself', 'selbst', 'vorstellen', 'introduce', 'summary'],
    respond: ({ addon }) =>
      `Joel van Hees - Graphic Designer & Creative Coder.\nCombining classical design disciplines with experimental canvas/WebGL technologies to build high-end generative spaces and scalable digital brand systems.${addon}`,
  },
  {
    id: 'profile',
    broad: true,
    terms: ['joel', 'van hees', 'creator', 'wer ist', 'who is', 'wer bist', 'who are you', 'person', 'hinter', 'behind', 'biografie', 'biography', 'profile', 'profil', 'steckbrief', 'bio'],
    respond: () =>
      `PROFILE SUMMARY:\nJoel van Hees is an integrated graphic designer and developer living in Cologne. He merges classical design disciplines (composition, strict grid typography, brand strategy) with experimental frontend technologies (Three.js, custom shaders, reactive DOM interactions). He treats the web browser as an emotional, narrative canvas ready for deep atmosphere.`,
  },
  {
    id: 'projects',
    terms: ['projects', 'projekte', 'projekt', 'project', 'work', 'works', 'arbeiten', 'portfolio', 'cases', 'referenzen', 'index', 'selected'],
    respond: ({ addon }) =>
      `SELECTED DATA INDEX:\n  02 // spiral down time\n  01 // brand collaboration\n  07 // check your bus\n  00 // web design as spatial experience\n  03 // nasalica\n  04 // branding systems\n  06 // concept vehicle rebrand\n  05 // poster series${addon}`,
  },
  {
    id: 'contact',
    terms: ['contact', 'kontakt', 'email', 'mail', 'reach', 'erreichen', 'schreiben', 'write', 'nachricht', 'message', 'uplink', 'anfrage', 'hire', 'buchen', 'instagram', 'social'],
    action: 'contact-form',
    respond: ({ user }) =>
      `SYSTEM CONTACT UPLINK:\nReady to establish connection? Reach out via:\n- Direct Mail: kontakt@joelvanhees.de\n- Instagram: @joelvanhees\n\nClick the button below to jump straight to the contact terminal, ${user}:`,
  },
  {
    id: 'pricing',
    terms: ['kosten', 'preis', 'preise', 'budget', 'honorar', 'geld', 'cost', 'costs', 'price', 'pricing', 'money', 'rate', 'rates', 'angebot', 'quote', 'teuer', 'was kostet'],
    action: 'contact-form',
    respond: ({ user }) =>
      `PROJEKTKOSTEN & ANGEBOTE:\nFür Anfragen bezüglich Projektkosten, Budgetrahmen oder Honorarsätzen erstelle ich individuelle Angebote, die exakt auf den Umfang deines Vorhabens abgestimmt sind. Lass uns deine Vorstellungen besprechen und ein passendes Angebot kalkulieren!\n\nNutze den direkten Link zum Kontaktformular, um eine Anfrage zu senden, ${user}:`,
  },
  {
    id: 'skills',
    terms: ['skill', 'skills', 'tech', 'technologie', 'technologien', 'stack', 'code', 'coding', 'programmieren', 'programmierung', 'sprache', 'sprachen', 'three', 'threejs', 'webgl', 'react', 'glsl', 'framework', 'javascript', 'css', 'html', 'shader', 'blender', 'cinema', 'c4d', 'fusion', 'touchdesigner', 'xcode', 'wordpress', 'avada', 'cms', 'tools', 'werkzeuge', 'software'],
    respond: ({ addon }) =>
      `TECHNICAL CAPABILITIES & DEVELOPER ENGINE:\n\n- FRONTEND LAYER: React, Modern ES6+ JavaScript, Semantic HTML5, CSS3, Tailwind CSS\n- IMMERSIVE CREATIVE LAYER: Three.js, Canvas API, WebGL, custom GLSL Shaders, generative systems\n- DIGITAL BRAND DESIGN: Figma (UI/UX layout systems, adaptive auto-layout, tokens), Adobe Creative Suite (Illustrator, Photoshop, After Effects)\n- BUILD ENGINES & WORKFLOW: Vite, Git, Vercel, npm, high-performance optimization.${addon}`,
  },
  {
    id: 'experience',
    terms: ['experience', 'erfahrung', 'career', 'werdegang', 'cv', 'lebenslauf', 'studium', 'studiert', 'beruf', 'schule', 'kisd', 'hsd', 'timeline', 'ausbildung'],
    respond: () =>
      `CREATIVE MILESTONES & ACADEMIC GROUNDING:\n\n- STUDY: B.A. Integrated Design studied at KISD (Köln) and HSD (Düsseldorf).\n- EXHIBITION: Speculative interactive brand installation exhibited at the NRW-Forum Düsseldorf.\n- SOCIAL ENGINE: Director of Social Media at "Salatschüssel" (scaled the community channel to over 10M+ Likes and 200,000+ active followers).\n- BOUTIQUE SERVICES: Custom branding systems and generative web systems developed for premium client portfolios.`,
  },
  {
    id: 'services',
    terms: ['service', 'services', 'leistung', 'leistungen', 'angebote', 'design', 'webdesign', 'branding', 'concept', 'creative direction', 'identity', 'what do you offer'],
    respond: ({ addon }) =>
      `DESIGN & DEVELOPMENT SERVICES:\n\n- 3D WEB EXPERIENCES: Immersive WebGL spaces, procedural typographic canvas installations, and reactive interactive visualizations.\n- BRANDING SYSTEMS: Scalable visual identities, logo architecture, typography standards, and integrated physical/digital collateral.\n- SPATIAL UI/UX SYSTEMS: Concept-driven, responsive layouts, design token libraries in Figma, and micro-interactions.\n- CREATIVE DIRECTION: Collaborative conceptual campaigns, video storytelling, and experimental design technologies.${addon}`,
  },
  {
    id: 'figma',
    terms: ['figma', 'prototype', 'prototyping', 'wireframe', 'wireframes', 'interface', 'handoff', 'autolayout', 'design system', 'design tokens'],
    respond: ({ user }) =>
      `FIGMA INTERFACE ARCHITECTURE:\nI treat Figma not merely as an ad-hoc layout sheet, but as a systematic model for structural code translation. Every visual draft uses strict auto-layout formulas, component hierarchies, and responsive padding variables. This guarantees that all UI patterns adapt beautifully to any viewport when written in React or CSS, ${user}.`,
  },
  {
    id: 'ai',
    terms: ['ai', 'ki', 'llm', 'gpt', 'model', 'modelle', 'generative', 'bildgenerierung', 'videogenerierung', 'prompt', 'prompts', 'machine learning', 'kuenstliche intelligenz'],
    respond: ({ user }) =>
      `AI ENGINEERING:\nAI native since day one — building working products on top of models rather than demos. LLM integration (APIs, tool use, retrieval, evaluation), controlled image and video generation under art direction, and workshops that take teams from curious to productive on their own tools. Ask me about a concrete use case, ${user}.`,
  },
  {
    id: 'sound',
    terms: ['sound', 'sounds', 'music', 'musik', 'soundscape', 'audio', 'atmosphere', 'ton'],
    respond: ({ user }) =>
      `ATMOSPHERIC SOUNDSCAPE SYNTHESIS:\nSound shapes spatial depth. My portfolio integrates custom-engineered ambient tracks (like "Orbital Drift Run.mp3" in the Blob Runner overlay) and atmospheric sounds to establish emotional presence in digital installations. Audio controls are modular and easy to toggle directly inside project overlays, ${user}.`,
  },
  {
    id: 'location',
    terms: ['location', 'standort', 'stadt', 'koeln', 'cologne', 'germany', 'deutschland', 'wohnst', 'based', 'where', 'wo bist du', 'remote'],
    respond: ({ addon }) =>
      `LOCATION IN PROFILE:\nMy creative practice is based in Cologne, Germany—a historic hub for experimental media, art, and integrated design studies. I work with clients both locally in North Rhine-Westphalia and globally via digital neural uplinks.${addon}`,
  },
  {
    id: 'hobbies',
    terms: ['hobby', 'hobbys', 'hobbies', 'freizeit', 'sport', 'privat', 'personal', 'fun'],
    respond: ({ user }) =>
      `PERSONAL CHANNELS:\nBeyond commercial systems, I enjoy speculative design, chiptune sound synthesis, generative mathematics, and exploring experimental game loops. I'm fascinated by liquid-glass aesthetics, water simulations, and the intersection of music and dynamic motion, ${user}.`,
  },
  {
    id: 'vision',
    terms: ['vision', 'philosophie', 'philosophy', 'ansatz', 'approach', 'inspiration', 'future', 'zukunft', 'ziel', 'ziele', 'werte', 'values'],
    respond: ({ user }) =>
      `CREATIVE PRACTICE MANIFESTO:\n"The browser is not a static page—it is a spatial environment." My goal is to build digital spaces that evoke emotional, memorable, and atmospheric resonance. I believe that brand identities in the future should not just be looked at, but experienced and explored interactively. Let's shape the visual standards of tomorrow, ${user}.`,
  },
  {
    id: 'game',
    terms: ['game', 'games', 'runner', 'blob run', 'spiel', 'spielen', 'play', 'arcade'],
    respond: ({ user }) =>
      `SYSTEM RUNNER [BLOB RUNNER ⌁]:\nHave you tried my high-performance WebGL 3D game yet? It runs in a beautiful, retro-cyber glassmorphic TV console and is extremely fast! You have to dodge red warning barriers and collect golden shards to unlock glowing core colors. Click the glowing pulsing blob in the bottom right corner of the screen to close the console and enter the running lane, ${user}!`,
  },
  {
    id: 'cooldown',
    terms: ['cooldown', 'cool down', 'pool', 'relax', 'pause', 'break', 'wasser', 'water', 'entspannen', 'chill'],
    action: 'cooldown',
    respond: ({ user }) => `[INITIALIZING COOLDOWN POOL...] Entering sensory reflection space... Take a moment to relax, ${user}.`,
  },
  {
    id: 'theme',
    terms: ['theme', 'dark mode', 'light mode', 'darkmode', 'hell', 'dunkel', 'nachtmodus', 'appearance', 'umschalten', 'toggle'],
    action: 'theme',
    respond: ({ nextTheme, addon }) => `System toggled. Current state: ${nextTheme}${addon}`,
  },
  {
    id: 'checkyourbus',
    terms: ['checkyourbus', 'check your bus', 'literature', 'literatur', 'essay', 'bus'],
    action: 'checkyourbus',
    respond: ({ user }) =>
      `[INITIALIZING CHECK_YOUR_BUS...] Redirecting to literature essay: https://checkyourbus.vercel.app - Hope you like it, ${user}!`,
  },
  {
    id: 'greeting',
    terms: ['hi', 'hallo', 'hello', 'hey', 'moin', 'servus', 'yo', 'guten tag', 'was geht', 'gruess dich'],
    respond: ({ user }) => {
      const lines = [
        `Hallo ${user}! Wie kann ich dir heute helfen? Tippe 'help' für Befehle.`,
        `Hi ${user}! Schön, dass du den Weg in meine Kommandozeile gefunden hast. 👾`,
        `Hey ${user}! Du tippst verdammt flüssig. Was steht heute auf der Agenda?`,
        `Moin Moin, ${user}! Bereit, ein bisschen High-End-Code anzuschauen?`,
        `Servus, ${user}! Suchst du nach 'projects', 'skills' oder einfach nur Inspiration?`,
      ];
      return lines[Math.floor(Math.random() * lines.length)];
    },
  },
  { id: 'clear', terms: ['clear', 'cls', 'leeren', 'reset', 'aufraeumen'], action: 'clear', respond: () => '' },
  { id: 'exit', terms: ['exit', 'quit', 'close', 'schliessen', 'beenden', 'tschuess', 'bye'], action: 'exit', respond: () => '' },
];

// What each intent is called when the shell offers it as a suggestion.
export const intentLabels = Object.fromEntries(shellIntents.map((i) => [i.id, i.id]));

export default shellIntents;
