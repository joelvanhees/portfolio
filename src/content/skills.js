/*
 * The skill map behind THE OPERATOR.
 *
 * Every node declares which roles it belongs to. Nodes that carry a `base`
 * position are part of the unfiltered overview; the rest are specialist skills
 * that only surface once their role is selected, so the default view stays as
 * uncrowded as it was.
 */

// Designer leads: it is the core of the practice, the rest builds on it.
export const skillRoles = [
  { id: 'design', label: 'Designer' },
  { id: 'web', label: 'Webentwickler' },
  { id: 'threed', label: '3D Artist' },
  { id: 'ai', label: 'AI Engineer' },
];

export const skillNodes = [
  // --- Overview nodes: positioned by hand, shown when no role is selected ---
  {
    id: 'Design',
    label: 'Design',
    cats: ['design'],
    base: { x: 50, y: 50 },
    desc: 'Holistic design approach integrating strategy, aesthetics, and functionality across digital and physical mediums.',
  },
  {
    id: '3D',
    label: '3D & Product',
    cats: ['threed'],
    base: { x: 25, y: 40 },
    desc: 'Creation of three-dimensional assets and environments for product visualization and artistic expression.',
  },
  {
    id: 'Code',
    label: 'Creative Code',
    cats: ['web', 'threed'],
    base: { x: 75, y: 40 },
    desc: 'Developing custom tools and generative visual systems using code as a primary design medium.',
  },
  {
    id: 'Graphic',
    label: 'Graphic Design',
    cats: ['design'],
    base: { x: 35, y: 65 },
    desc: 'Mastery of typography, grid systems, and layout to create clear and impactful visual communication.',
  },
  {
    id: 'Comm',
    label: 'Communication',
    cats: ['design'],
    base: { x: 65, y: 65 },
    desc: 'Strategic transmission of information through visual language to achieve defined objectives.',
  },
  {
    id: 'Adobe',
    label: 'Adobe Suite',
    cats: ['design'],
    base: { x: 38, y: 28 },
    desc: 'Advanced proficiency in the Adobe Creative Cloud ecosystem, including InDesign, Photoshop, Illustrator, Premiere Pro, and After Effects for static and motion design.',
  },
  {
    id: 'Affinity',
    label: 'Affinity',
    cats: ['design'],
    base: { x: 62, y: 28 },
    desc: 'Proficiency in Affinity Designer, Photo, and Publisher as efficient alternatives for vector and raster editing.',
  },
  {
    id: 'C4D',
    label: 'Cinema 4D',
    cats: ['threed'],
    base: { x: 10, y: 20 },
    desc: 'High-end 3D motion graphics and simulation for broadcast and commercial visual effects.',
  },
  {
    id: 'Blender',
    label: 'Blender',
    cats: ['threed'],
    base: { x: 25, y: 15 },
    desc: 'Open-source 3D pipeline for modeling, sculpting, and real-time rendering.',
  },
  {
    id: 'Fusion',
    label: 'Fusion 360',
    cats: ['threed'],
    base: { x: 10, y: 60 },
    desc: 'Parametric CAD modeling for precise industrial design and product manufacturing.',
  },
  {
    id: 'Print',
    label: '3D Printing',
    cats: ['threed'],
    base: { x: 20, y: 55 },
    desc: 'Specialist in additive manufacturing and rapid prototyping. From custom commissions to my own product line, I bridge digital design and physical reality.',
  },
  {
    id: 'Xcode',
    label: 'Xcode',
    cats: ['web'],
    base: { x: 90, y: 20 },
    desc: 'Development environment for native Apple platforms, enabling the creation of bespoke iOS and macOS applications.',
  },
  {
    id: 'Touch',
    label: 'TouchDesigner',
    cats: ['web', 'threed'],
    base: { x: 90, y: 60 },
    desc: 'Node-based visual programming for real-time interactive multimedia content and installations.',
  },
  {
    id: 'React',
    label: 'React',
    cats: ['web'],
    base: { x: 75, y: 15 },
    desc: 'Building modern, reactive web interfaces and single-page applications with component-based architecture.',
  },
  {
    id: 'Story',
    label: 'Storytelling',
    cats: ['threed'],
    base: { x: 50, y: 90 },
    desc: 'Crafting compelling narratives that drive the visual identity and connect with the audience on an emotional level.',
  },
  {
    id: 'AI',
    label: 'AI Generative',
    cats: ['ai'],
    base: { x: 50, y: 75 },
    desc: 'AI native since day one. Deep expertise in LLM architecture, image/video generation, and custom model training. I provide advanced consulting and workshops, staying constantly ahead of the research curve.',
  },

  // --- Web ---
  {
    id: 'HTMLCSS',
    label: 'HTML & CSS',
    cats: ['web'],
    desc: 'Semantic markup and modern CSS — layout systems, custom properties, animation and responsive behaviour built to hold up on any screen.',
  },
  {
    id: 'JS',
    label: 'JavaScript',
    cats: ['web'],
    desc: 'The language behind the interactive layer: state, animation, canvas and WebGL work, and the glue between interface and data.',
  },
  {
    id: 'WordPress',
    label: 'WordPress',
    cats: ['web'],
    desc: 'Full WordPress builds — themes, plugins and editorial workflows for sites that clients maintain themselves.',
  },
  {
    id: 'Avada',
    label: 'Avada',
    cats: ['web'],
    desc: 'Avada builds taken past the template stage, with custom styling and structure so the result does not read as a stock theme.',
  },
  {
    id: 'CMS',
    label: 'CMS',
    cats: ['web'],
    desc: 'Content architecture that editors can actually run: sensible models, clear fields, and a structure that survives real-world use.',
  },

  // --- Design ---
  {
    id: 'Figma',
    label: 'Figma',
    cats: ['design'],
    desc: 'Interface design and design systems in Figma — components, variables and auto-layout structured for handoff into code.',
  },
  {
    id: 'Brand',
    label: 'Brand Identity',
    cats: ['design'],
    desc: 'Complete identity systems: mark, type, colour and the rules that keep them coherent across every application.',
  },

  // --- 3D / artistic ---
  {
    id: 'World',
    label: 'Worldbuilding',
    cats: ['threed'],
    desc: 'Building fictional universes with their own visual logic — characters, environments and the rules that hold them together.',
  },
  {
    id: 'Concept',
    label: 'Concept Art',
    cats: ['threed'],
    desc: 'Visual development from first sketch to finished key art, setting the look before production starts.',
  },
  {
    id: 'Sculpt',
    label: 'Sculpting',
    cats: ['threed'],
    desc: 'Digital sculpting for characters, objects and organic form, built for both render and physical output.',
  },

  // --- AI ---
  {
    id: 'AISolutions',
    label: 'AI Solutions',
    cats: ['ai'],
    desc: 'Building working products on top of AI rather than demos — scoping the problem, choosing the model, and shipping something people use.',
  },
  {
    id: 'LLM',
    label: 'LLM Integration',
    cats: ['ai'],
    desc: 'Wiring language models into real applications: APIs, tool use, retrieval, and the prompt and evaluation work that makes them reliable.',
  },
  {
    id: 'ImageGen',
    label: 'Image Generation',
    cats: ['ai'],
    desc: 'Generative imagery under art direction — controlled pipelines, consistent characters and styles, and output that fits a brand system.',
  },
  {
    id: 'VideoGen',
    label: 'Video Generation',
    cats: ['ai'],
    desc: 'Generative and AI-assisted motion, from concept clips to finished sequences integrated with conventional post-production.',
  },
  {
    id: 'Workshops',
    label: 'Workshops',
    cats: ['ai'],
    desc: 'Courses and in-house training that take teams from curious to productive, aimed at their actual tools and workflows.',
  },
  {
    id: 'AITech',
    label: 'AI Know-how',
    cats: ['ai'],
    desc: 'The technical layer underneath: how models are trained and served, where they fail, and what that means for the things built on them.',
  },
];

// Links for the unfiltered overview. Filtered views are drawn as a hub-and-
// spoke around the role instead, so they need no authored links.
export const skillLinks = [
  ['Design', '3D'], ['Design', 'Code'], ['Design', 'Story'], ['Design', 'Adobe'],
  ['Design', 'Affinity'], ['Design', 'Graphic'], ['Design', 'Comm'],
  ['3D', 'C4D'], ['3D', 'Blender'], ['3D', 'Fusion'], ['3D', 'Print'],
  ['Code', 'Xcode'], ['Code', 'Touch'], ['Code', 'React'],
  ['Story', 'AI'], ['Adobe', 'AI'],
  ['Graphic', 'Adobe'], ['Graphic', 'Affinity'],
];
