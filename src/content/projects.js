import { Video } from 'lucide-react';

import nasalicaImg from '../assets/images/nasalica_preview.jpg';
import brandingImg from '../assets/images/branding_preview.jpg';
import posterImg from '../assets/images/poster_preview.jpg';
import carImg from '../assets/images/car_preview.jpg';
import previewWebImg from '../assets/images/previewWEB.png';
import pdfFile from '../assets/pdf/feinkonzept_joelvanhees.pdf';

import ikeaLogo from '../assets/logos/ikea.png';
import britaLogo from '../assets/logos/brita.png';
import goveeLogo from '../assets/logos/govee.png';

export const brandLogos = { ikeaLogo, britaLogo, goveeLogo };

export const buildProjects = ({ setActiveImage }) => [
  {
    id: "02",
    category: "TYPE / TECH / SYSTEM",
    title: "spiral down time",
    description: "A real-time generative time system turning seconds into spatial typography. Modular, adaptive and rendered live.",
    longDescription: "Spiral Down Time explores time as a spatial and typographic system rather than a linear unit. Built with JavaScript and WebGL, the project visualizes hours, minutes and seconds as an evolving generative structure. The system reacts live, creating a continuously transforming interface that combines typography, motion and code into one coherent visual language.",
    tech: ["JavaScript", "Three.js", "WebGL", "Generative Typography"],
    visualComponent: null,
    link: "#",
    extraVisuals: true,
    featured: true,
    exhibitions: [
      "Mid Term Exhibition @ KISD Cologne",
      "AUSSTEHEND: EMAF 2026, New Mexico",
    ],
  },
  {
    id: "01",
    category: "BRAND / VISUAL CONTENT",
    title: "Brand Collaboration",
    description: "Built a viral social media brand from scratch (10M+ Likes), maintaining full creative control. Partnered with industry leaders like IKEA, Brita, and Govee to deliver authentic, high-impact campaigns.",
    longDescription: "",
    tech: ["Creative Direction", "Visual Concept", "Editing", "Social Formats"],
    visualComponent: <Video size={64} className="opacity-50" />,
    link: "#",
    featured: true,
    brandLinks: [
      { label: "TikTok: @salatschuessel_", url: "https://www.tiktok.com/@salatschuessel_?_r=1&_t=ZG-937qLOmgxsn" },
      { label: "Instagram: @salatschuessel_", url: "https://www.instagram.com/salatschuessel_?igsh=MWZyNnhicGM2ZWkxdA==" },
    ],
    extraImages: false,
  },
  {
    id: "00",
    category: "WEB / SPATIAL / INTERACTION",
    title: "Web Design as Spatial Experience",
    description: "A portfolio that acts as a design practice itself. Merging layout, motion, and 3D into a seamless spatial experience.",
    longDescription: "This website treats the browser as a spatial environment rather than a static page. Every scroll interaction and transition was built from scratch to merge structure with movement.\n\nDeveloped alongside a client project for a professional artist, this work focuses on translating content into immersive digital experiences using Webflow, Spline, and custom code.",
    tech: ["Webflow", "Spline", "Three.js", "Concept"],
    visualComponent: <img src={previewWebImg} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Web Design Preview" />,
    link: "#",
    featured: true,
    hasPdf: true,
    pdfUrl: pdfFile,
  },
  {
    id: "03",
    category: "WORLD BUILDING / VISUAL IP",
    title: "NASALICA",
    description: "A retro-futuristic sci-fi universe built through visual systems, characters and narrative design.",
    longDescription: "Nasalica is an original science-fiction universe developed through visual storytelling and worldbuilding. The project combines character design, environmental systems and narrative structure into a coherent visual IP. It was exhibited as part of the “Superheroes” exhibition and serves as an exploration of how graphic language can build complex fictional worlds.",
    tech: ["Illustration", "Worldbuilding", "Visual Systems", "Narrative Design"],
    visualComponent: <img src={nasalicaImg} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 cursor-zoom-in" alt="Nasalica Preview" onClick={() => setActiveImage(nasalicaImg)} />,
    link: "#",
    featured: true,
    exhibitions: [
      "Superheroes Exhibition @ NRW-Forum Düsseldorf / Next Museum",
    ],
  },
  {
    id: "04",
    category: "BRANDING / IDENTITY",
    title: "Branding Systems",
    description: "Development of flexible brand identities across music, art and cultural projects.",
    longDescription: "This project bundles multiple branding systems developed for independent cultural and commercial clients. The work includes logo design, typography, color systems and visual applications across digital and print. Each identity was designed as a scalable system rather than a static mark, allowing consistent communication across platforms.",
    tech: ["Brand Strategy", "Logo Design", "Typography", "Visual Identity"],
    visualComponent: <img src={brandingImg} className="w-full h-full object-cover cursor-zoom-in" alt="Branding Preview" onClick={() => setActiveImage(brandingImg)} />,
    link: "#",
    featured: true,
  },
  {
    id: "06",
    category: "CONCEPT / 3D / BRAND",
    title: "CONCEPT VEHICLE REBRAND",
    description: "A speculative rebranding project translating graphic identity into a three-dimensional product concept.",
    longDescription: `This project explores rebranding as an open design experiment rather than a finished identity.

The Peel P50, the smallest production car ever built, was used as the basis for a fictional rebrand developed as an individual university project at HSD Düsseldorf. Instead of designing a closed visual system, the project intentionally shifted authorship outward and turned the rebranding process itself into the core concept.

A series of posters showing the P50 as a reduced outline were designed and distributed across the university together with pens. Students from design and architecture were invited to draw directly onto the posters. No briefing. No guidelines. The posters functioned as open interfaces for intuitive visual expression.

The resulting drawings ranged from structured patterns to spontaneous gestures and ornamental systems. Collected within a creative academic environment, they formed a diverse visual archive shaped by many individual design languages.

Selected drawings were digitized and translated into print ready visuals using AI based image processing. These visuals were applied to a three dimensional model of the P50 and experienced through AR and VR. This step allowed the hand drawn patterns to move from paper into space and onto the object itself.

The project addresses a niche audience of collectors who treat microcars as cultural artifacts rather than functional vehicles. By exposing this audience to design languages emerging from a younger creative environment, the project reframes luxury as cultural relevance, authorship, and collectability.

The outcome is not a single brand identity, but a spectrum of possible expressions.
The P50 becomes a platform rather than a product.`,
    tech: ["Branding", "3D Modeling", "Visual Concept", "Product Visualization"],
    visualComponent: <img src={carImg} className="w-full h-full object-cover cursor-zoom-in" alt="Car Preview" onClick={() => setActiveImage(carImg)} />,
    link: "#",
    featured: true,
  },
  {
    id: "05",
    category: "POSTER / VISUAL EXPERIMENT",
    title: "Poster Series",
    description: "A curated selection of poster designs exploring typography, composition and visual rhythm.",
    longDescription: "GRADIENT OF CONSTRAINT\n\nThe poster series explores adaptability through constraint. A visual sequence moving from total autonomy to total reduction.\n\n1. [THE SELF] – Maximum Freedom\n2. [THE PEER] – Collaborative Tension\n3. [THE PUBLIC] – Visual Activism\n4. [THE CONSUMER] – Engagement First\n5. [THE TRADITIONALIST] – Total Restraint",
    tech: ["Graphic Design", "Typography", "Layout", "Print"],
    visualComponent: <img src={posterImg} className="w-full h-full object-cover cursor-zoom-in" alt="Poster Preview" onClick={() => setActiveImage(posterImg)} />,
    link: "#",
    featured: true,
  },
];
