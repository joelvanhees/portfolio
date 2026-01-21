import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Menu, X, ArrowUpRight, Globe, Box, Layers, Play, Mail, Terminal, Cpu, Eye, Maximize2, Minimize2, Video, ChevronRight, Send, Download, PenTool, Layout, FileImage, Disc, CheckCircle, Loader, FileText } from 'lucide-react';
import * as THREE from 'three';

// --- ASSET IMPORTS ---
// Haupt-Preview Bilder
import nasalicaImg from './assets/images/nasalica_preview.jpg';
import brandingImg from './assets/images/branding_preview.jpg';
import posterImg from './assets/images/poster_preview.jpg';
import carImg from './assets/images/car_preview.jpg'; // Dient als Main Preview für P50
// Web Design Project Asset
import previewWebImg from './assets/images/previewWEB.png';
// PDF Import
import pdfFile from './assets/pdf/feinkonzept_joelvanhees.pdf';

// IKEA Projekt Bilder
import ikeaMerch1 from './assets/images/ikea_merch_1.jpg';
import ikeaMerch2 from './assets/images/ikea_merch_2.jpg';
import salatProfileImg from './assets/images/salat_profile.png';
import threedSign1 from './assets/images/threed_sign1.png';
import threedSign2 from './assets/images/threed_sign2.png';
import ikeaLogo from './assets/logos/ikea.png';
import britaLogo from './assets/logos/brita.png';
import goveeLogo from './assets/logos/govee.png';

// Project 02 Images
import imgRef01 from './assets/images/IMG_REF_01.jpg';
import imgRef02 from './assets/images/IMG_REF_02.jpeg';

// Project 03 Images (NASALICA)
import exhibitionInfImg from './assets/images/exhibitionINF.JPG';
import monsterImg from './assets/images/monster.png';

// Branding Systems Assets
import softBodyProcess from './assets/branding/soft-body-home/brandingSOFTprocess.jpeg';
import softBodyLogo from './assets/branding/soft-body-home/brandingSOFT.png';
import softBodyFinal from './assets/branding/soft-body-home/brandingSOFTfinal.jpeg';

import prideLogo from './assets/branding/pride-kunst/PrideKunstLOO.jpeg';
import prideBox from './assets/branding/pride-kunst/PKlogoBOX.jpeg';

import mate1 from './assets/branding/yerba-mate/mate1.png';
import mate2 from './assets/branding/yerba-mate/mate2.jpg';
import mate3 from './assets/branding/yerba-mate/mate3.jpeg';

import sugarLogo from './assets/branding/sugar-damage/SUGARdamage.logo.jpeg';
import sugarCover from './assets/branding/sugar-damage/SUGARdamage.cover.jpeg';
// Note: spotify.mp4 handled via path string

import logoJoel from './assets/branding/logos/logoJOEL.PNG';
import logoVNC from './assets/branding/logos/logoVNC.GIF';
import logoMichael from './assets/branding/logos/michaelanikoleit.logo.jpg';


// Portrait
import portraitImg from './assets/images/portrait.jpg';

// --- PEEL P50 PROJECT ASSETS (NEU) ---
// Student Drawings (1-6) - .jpg lowercase
import p50_1a from './assets/images/p50/1a.jpg'; import p50_1b from './assets/images/p50/1b.jpg';
import p50_2a from './assets/images/p50/2a.jpg'; import p50_2b from './assets/images/p50/2b.jpg';
import p50_3a from './assets/images/p50/3a.jpg'; import p50_3b from './assets/images/p50/3b.jpg';
import p50_4a from './assets/images/p50/4a.jpg'; import p50_4b from './assets/images/p50/4b.jpg';
import p50_5a from './assets/images/p50/5a.jpg'; import p50_5b from './assets/images/p50/5b.jpg';
import p50_6a from './assets/images/p50/6a.jpg'; import p50_6b from './assets/images/p50/6b.jpg';

// Blank Posters - .JPG uppercase
import p50_blankA from './assets/images/p50/blankPOSTER.JPG';
import p50_blankB from './assets/images/p50/blankPOSTERb.JPG';

// Outdoor Context - .JPG uppercase
import p50_out1 from './assets/images/p50/outdoor1.JPG';
import p50_out2 from './assets/images/p50/outdoor2.JPG';
import p50_out3 from './assets/images/p50/outdoor3.JPG';

// --- POSTER SERIES ASSETS (NEW ADDITION) ---
import posterForME from './assets/images/posters/posterForME.jpg';
import posterCLIENT from './assets/images/posters/posterCLIENT.jpg';
import posterPOLITIC from './assets/images/posters/posterPOLITIC.jpg';
import posterRECIPE from './assets/images/posters/posterRECIPE.jpg';
import posterCONSERV from './assets/images/posters/posterCONSERV.jpg';

// Data Structure for Peel Project Layout
const p50Data = {
  pairs: [
    { a: p50_1a, b: p50_1b },
    { a: p50_2a, b: p50_2b },
    { a: p50_3a, b: p50_3b },
    { a: p50_4a, b: p50_4b },
    { a: p50_5a, b: p50_5b },
    { a: p50_6a, b: p50_6b },
  ],
  blanks: [p50_blankA, p50_blankB],
  outdoor: [p50_out1, p50_out2, p50_out3]
};

// --- POSTER DATA STRUCTURE (NEW ADDITION) ---
const posterData = [
  { img: posterForME, target: "[TARGET: THE SELF]", caption: "100% Autonomy. Exploring personal aesthetic preferences without external constraints." },
  { img: posterCLIENT, target: "[TARGET: THE PEER]", caption: "Collaborative Tension. The challenge of translating another artist's vision into a coherent graphic identity." },
  { img: posterPOLITIC, target: "[TARGET: THE PUBLIC]", caption: "Visual Activism. Using layout and typography to amplify a sociocritical message." },
  { img: posterRECIPE, target: "[TARGET: THE CONSUMER]", caption: "Engagement First. Using decoration and visual hooks to maximize attention for everyday information." },
  { img: posterCONSERV, target: "[TARGET: THE TRADITIONALIST]", caption: "Total Restraint. Minimalist function over form to build trust with a conservative audience." }
];

// --- VISUAL SYSTEM: INFINITE MARQUEE (NEW COMPONENT) ---
const InfiniteMarqueeVisual = () => {
  return (
    <div className="w-full h-full bg-[#111] overflow-hidden flex items-center relative select-none">
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
      <div className="flex w-max animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused]">
        {[...posterData, ...posterData].map((slide, i) => (
          <div key={i} className="flex flex-col w-[140px] md:w-[180px] mx-4 flex-shrink-0">
            <div className="aspect-[2/3] w-full overflow-hidden border border-white/10 mb-3 bg-black">
               <img src={slide.img} alt={slide.target} className="w-full h-full object-cover" />
            </div>
            <div className="font-mono text-[9px] leading-tight text-white/60">
               <strong className="block text-white mb-1">{slide.target}</strong>
               {slide.caption}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,black_0%,transparent_5%,transparent_95%,black_100%)]"></div>
    </div>
  );
};

// --- HELPER: HOVER VIDEO PLAYER ---
const HoverVideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video play failed:", e));
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div 
      className="w-full h-full relative bg-black group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!src ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30">
            <Video size={48} />
        </div>
      ) : (
        <video 
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
        />
      )}
      
      <div className="absolute bottom-4 right-4 text-[10px] font-mono border px-2 py-1 rounded bg-black/50 text-white border-white/20 z-20">
        [VIDEO_FEED]
      </div>
    </div>
  );
};

// --- VISUAL 1: SPIRAL TIME SPHERE (CRITICAL FIX APPLIED) ---
const SpiralTimeSphere = ({ darkMode }) => {
  const mountRef = useRef(null);
  const timeRef = useRef(null);
  const hourRef = useRef(null);
  const nextHourRef = useRef(null);
  const progressRef = useRef(null);
  const isMountedRef = useRef(true); // Flag to track mount state

  useEffect(() => {
    isMountedRef.current = true;
    if (!mountRef.current) return;

    // --- SETUP ---
    // Cleaning container ensures no duplicate canvases
    mountRef.current.innerHTML = '';

    const CONFIG = {
      count: 1500,
      radius: 23,
      speedFactor: 1.0,
      trailLength: 350,
      colors: { minute: new THREE.Color(0xffff00), second: new THREE.Color(0x00ff00), text: 'white' }
    };

    let scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.012);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    let camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 80;
    
    camera.userData = { 
      currentLookAt: new THREE.Vector3(0, 0, 0),
      currentPos: new THREE.Vector3(0, 0, 100),
      returnTransitionStartFrame: -1
    };

    let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); 
    mountRef.current.appendChild(renderer.domElement);

    // Track textures to dispose them later
    const textures = {};
    const canvasHelper = document.createElement('canvas');
    const ctxHelper = canvasHelper.getContext('2d');
    canvasHelper.width = 128; canvasHelper.height = 128;

    function getNumberTexture(n, isHour = false) {
      const key = isHour ? 'h_' + n : n;
      if (textures[key]) return textures[key];
      
      ctxHelper.clearRect(0, 0, 128, 128);
      ctxHelper.fillStyle = CONFIG.colors.text;
      ctxHelper.font = isHour ? 'bold 100px "Courier New"' : '900 90px "Courier New"';
      ctxHelper.textAlign = 'center';
      ctxHelper.textBaseline = 'middle';
      ctxHelper.fillText(n, 64, 66);
      
      const tex = new THREE.CanvasTexture(canvasHelper);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      const image = new Image();
      image.src = canvasHelper.toDataURL();
      tex.image = image;
      tex.needsUpdate = true;
      
      textures[key] = tex; // Save reference
      return tex;
    }

    const numberGroup = new THREE.Group();
    scene.add(numberGroup);

    const pathNumbersData = []; 
    const decorNumbersData = [];
    const pathPositions = new Array(61); 

    // Create Path Sprites
    for (let i = 1; i <= 60; i++) {
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ 
            map: getNumberTexture(i), 
            color: 0xffffff,
            transparent: true,
            opacity: 0.9, 
            depthWrite: false,
            blending: THREE.AdditiveBlending
        }));
        const t = (i / 60); 
        const theta = t * Math.PI * 8; 
        const phi = Math.acos(1 - 2 * t);
        const x = CONFIG.radius * Math.sin(phi) * Math.cos(theta);
        const y = CONFIG.radius * Math.cos(phi);
        const z = CONFIG.radius * Math.sin(phi) * Math.sin(theta);
        
        sprite.position.set(x, y, z);
        sprite.scale.set(4.0, 4.0, 4.0); 
        numberGroup.add(sprite);
        pathPositions[i] = new THREE.Vector3(x, y, z);
        
        pathNumbersData.push({
            mesh: sprite,
            basePos: new THREE.Vector3(x, y, z),
            seed: Math.random() * 100,
            value: i,
            baseScale: 4.0
        });
    }
    pathPositions[0] = pathPositions[60]; 

    // Create Decor Sprites
    for (let i = 0; i < CONFIG.count; i++) {
        const val = Math.floor(Math.random() * 60) + 1;
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: getNumberTexture(val),
            color: 0xaaaaaa, 
            transparent: true,
            opacity: 0.35, 
            depthWrite: false,
            blending: THREE.AdditiveBlending
        }));
        const goldenRatio = (1 + 5**0.5) / 2;
        const idx = i + 0.5;
        const phi = Math.acos(1 - 2 * idx / CONFIG.count);
        const theta = 2 * Math.PI * idx / goldenRatio;
        const x = CONFIG.radius * Math.sin(phi) * Math.cos(theta);
        const y = CONFIG.radius * Math.cos(phi);
        const z = CONFIG.radius * Math.sin(phi) * Math.sin(theta);
        const pos = new THREE.Vector3(x, y, z).normalize().multiplyScalar(CONFIG.radius + (Math.random()-0.5));
        sprite.position.copy(pos);
        sprite.scale.set(2.0, 2.0, 2.0); 
        numberGroup.add(sprite);
        decorNumbersData.push({
            mesh: sprite,
            basePos: pos,
            seed: Math.random() * 100,
            value: -1, 
            baseScale: 2.0
        });
    }

    let currentHourValue = new Date().getHours();
    const hourUniforms = {
        map: { value: getNumberTexture(currentHourValue, true) },
        uFill: { value: 0.0 }, 
        uColorBottom: { value: CONFIG.colors.minute },
        uColorTop: { value: CONFIG.colors.second },
        uOpacity: { value: 0.95 },
        uGlitchPhase: { value: 0.0 }
    };
    
    const hourMaterial = new THREE.ShaderMaterial({
        uniforms: hourUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `
            uniform sampler2D map; uniform float uFill; uniform vec3 uColorBottom; uniform vec3 uColorTop; uniform float uOpacity; uniform float uGlitchPhase; varying vec2 vUv;
            float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }
            void main() {
                vec2 p = vUv;
                float phase = uGlitchPhase;
                if (phase > 0.01 && phase < 0.99) {
                    float noise = rand(vec2(p.y, phase));
                    p.x += (noise - 0.5) * 0.15 * sin(phase * 15.0) * step(0.1, phase);
                    p.y = (p.y - 0.5) * (1.0 - sin(phase * 3.1415) * 0.3) + 0.5;
                }
                vec4 texColor = texture2D(map, p);
                if (texColor.a < 0.1) discard;
                vec3 finalColor = vec3(1.0);
                if (vUv.y < mix(0.3, 0.81, uFill)) finalColor = mix(uColorBottom, uColorTop, vUv.y);
                float shutter = 1.0;
                if (phase > 0.5 && phase < 0.9) shutter = step(0.4, rand(vec2(phase * 10.0, 0.0))); 
                gl_FragColor = vec4(finalColor, texColor.a * uOpacity * shutter);
            }
        `
    });
    
    const hourGeometry = new THREE.PlaneGeometry(1, 1);
    const hourMesh = new THREE.Mesh(hourGeometry, hourMaterial);
    hourMesh.scale.set(14, 14, 1); 
    hourMesh.position.set(0, 0, 0);
    scene.add(hourMesh);

    function createOrb(color, isMinute) {
        const radius = isMinute ? 0.9 : 0.5; 
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const mesh = new THREE.Mesh(geometry, material);
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(32,32,0, 32,32,32);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.3, '#' + color.getHexString());
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0,0,64,64);
        const glowMat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), color: color, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
        const glow = new THREE.Sprite(glowMat);
        glow.scale.set(isMinute ? 9 : 7, isMinute ? 9 : 7, 1); 
        mesh.add(glow);
        return mesh;
    }
    const secondOrb = createOrb(CONFIG.colors.second, false);
    const minuteOrb = createOrb(CONFIG.colors.minute, true);
    scene.add(secondOrb);
    scene.add(minuteOrb);

    const trailPositionsArr = new Float32Array(CONFIG.trailLength * 3);
    const trailColors = new Float32Array(CONFIG.trailLength * 3);
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositionsArr, 3));
    trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    const trailLine = new THREE.Line(trailGeometry, new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
    trailLine.frustumCulled = false; 
    scene.add(trailLine);
    
    for (let i = 0; i < CONFIG.trailLength; i++) {
        const alpha = i / (CONFIG.trailLength - 1);
        const col = CONFIG.colors.second;
        trailColors[i*3] = col.r * alpha; trailColors[i*3+1] = col.g * alpha; trailColors[i*3+2] = col.b * alpha;
    }

    let FRAME = 0;
    let accumulatedTime = 0;
    let glitchStartFrame = -9999;
    const colorWhite = new THREE.Color(0xffffff);
    const colorGray = new THREE.Color(0xaaaaaa);
    const colorMinute = CONFIG.colors.minute;
    const colorSecond = CONFIG.colors.second;
    
    let animationFrameId;

    const getPos = (idx) => {
       if (idx <= 0) idx = 60; 
       if (idx > 60) idx = 1;
       return pathPositions[idx] || new THREE.Vector3(0,25,0);
    }

    function animate() {
      // Safety guard: if unmounted, stop immediately
      if (!isMountedRef.current) return;
      if (!mountRef.current || !renderer) return; 
      
      const context = renderer.getContext();
      if (!context || context.isContextLost()) return;

      FRAME++;
      const now = new Date();
      const hrs = now.getHours();
      const mins = now.getMinutes();
      const secs = now.getSeconds();
      const ms = now.getMilliseconds();
      accumulatedTime = (hrs * 3600) + (mins * 60) + secs + (ms/1000);

      if (timeRef.current) timeRef.current.innerText = `TIME: ${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
      if (hourRef.current) hourRef.current.innerText = hrs.toString().padStart(2, '0');
      if (nextHourRef.current) nextHourRef.current.innerText = ((hrs + 1) % 24).toString().padStart(2, '0');
      if (progressRef.current) {
         const currentSecondsInHour = (mins * 60) + secs + (ms/1000);
         progressRef.current.style.width = `${(currentSecondsInHour / 3600) * 100}%`;
      }

      if (currentHourValue !== hrs) {
          currentHourValue = hrs;
          hourUniforms.map.value = getNumberTexture(currentHourValue, true);
          glitchStartFrame = FRAME;
          hourUniforms.uGlitchPhase.value = 0.0;
          camera.userData.returnTransitionStartFrame = FRAME;
      }
      hourUniforms.uFill.value = ((mins * 60 + secs) / 3600.0);

      if (glitchStartFrame > 0 && FRAME - glitchStartFrame < (0.7 * 120)) {
          const gProgress = (FRAME - glitchStartFrame) / (0.7 * 120);
          if (gProgress <= 1.0) hourUniforms.uGlitchPhase.value = gProgress;
      } else {
          hourUniforms.uGlitchPhase.value = 0.0;
      }

      const organicTime = accumulatedTime * 0.02; 
      const fieldTime = accumulatedTime * 0.2; 
      const modeOscillator = (Math.sin(accumulatedTime * 0.1) + 1.0) * 0.5;

      pathNumbersData.forEach(item => {
          const { mesh, basePos, seed, value, baseScale } = item;
          let tScale = baseScale; let tCol = colorWhite; let tOp = 0.9;
          if (value === (mins === 0 ? 60 : mins)) { tScale = baseScale * 1.5; tCol = colorMinute; tOp = 1.0; }
          const normX = basePos.x / CONFIG.radius; const normZ = basePos.z / CONFIG.radius; 
          const rotWave = Math.sin(Math.atan2(normZ, normX) * 3.0 + fieldTime); const vertWave = Math.sin(basePos.y * 0.1 - fieldTime);
          const waveStrength = THREE.MathUtils.lerp(rotWave, vertWave, modeOscillator);
          const breath = waveStrength * 0.5; 
          const wx = Math.sin(organicTime + seed * 0.1) * 0.1; const wy = Math.cos(organicTime * 0.8 + seed * 0.2) * 0.1; const wz = Math.sin(organicTime * 1.2 + seed * 0.3) * 0.1;
          mesh.position.set(basePos.x + wx + (normX * breath), basePos.y + wy + (breath * 0.4), basePos.z + wz + (normZ * breath));
          mesh.scale.lerp(new THREE.Vector3(tScale, tScale, tScale), 0.2);
          mesh.material.color.lerp(tCol, 0.2);
          mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, tOp, 0.2);
      });

      decorNumbersData.forEach(item => {
          const { mesh, basePos, seed, baseScale } = item;
          let tScale = baseScale; let tCol = colorGray; let tOp = 0.35;
          const normX = basePos.x / CONFIG.radius; const normZ = basePos.z / CONFIG.radius;
          const rotWave = Math.sin(Math.atan2(normZ, normX) * 3.0 + fieldTime); const vertWave = Math.sin(basePos.y * 0.1 - fieldTime);
          const waveStrength = THREE.MathUtils.lerp(rotWave, vertWave, modeOscillator);
          const breath = waveStrength * 0.5;
          const wx = Math.sin(organicTime + seed * 0.1) * 0.1; const wy = Math.cos(organicTime * 0.8 + seed * 0.2) * 0.1; const wz = Math.sin(organicTime * 1.2 + seed * 0.3) * 0.1;
          const currentPos = new THREE.Vector3(basePos.x + wx + (normX * breath), basePos.y + wy + (breath * 0.4), basePos.z + wz + (normZ * breath));
          mesh.position.copy(currentPos);
          if (currentPos.distanceTo(secondOrb.position) < 4.0) { tScale = baseScale * 1.5; tCol = colorSecond; tOp = 1.0; }
          mesh.scale.lerp(new THREE.Vector3(tScale, tScale, tScale), 0.2);
          mesh.material.color.lerp(tCol, 0.2);
          mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, tOp, 0.2);
      });

      hourMesh.position.y = Math.sin(organicTime) * 2;

      const minIndex = (mins === 0 ? 60 : mins);
      minuteOrb.position.lerp(getPos(minIndex), 0.1); 
      minuteOrb.position.normalize().multiplyScalar(CONFIG.radius + 3.0);

      const secIndex = (secs === 0 ? 60 : secs);
      const nextSecIndex = (secIndex % 60) + 1;
      const targetSecPos = new THREE.Vector3().lerpVectors(getPos(secIndex), getPos(nextSecIndex), ms / 1000);
      const chaosTime = Date.now() * 0.003;
      const chaos = new THREE.Vector3(Math.sin(chaosTime * 1.5), Math.cos(chaosTime * 1.8), Math.sin(chaosTime * 2.1)).multiplyScalar(2.0);
      const finalSecPos = targetSecPos.clone().normalize().multiplyScalar(CONFIG.radius - 3.5).add(chaos);
      secondOrb.position.lerp(finalSecPos, 0.15); 

      const arr = trailLine.geometry.attributes.position.array;
      for (let i = 0; i < (CONFIG.trailLength - 1) * 3; i++) arr[i] = arr[i+3];
      const li = (CONFIG.trailLength - 1) * 3;
      arr[li] = secondOrb.position.x; arr[li+1] = secondOrb.position.y; arr[li+2] = secondOrb.position.z;
      trailLine.geometry.attributes.position.needsUpdate = true;

      const isJump = (secs >= 59 || secs <= 1);
      let targetPos = isJump ? minuteOrb.position.clone() : targetSecPos.clone();
      let targetLook = isJump ? minuteOrb.position.clone() : targetSecPos.clone();
      
      const zoomCycle = Math.sin(accumulatedTime * 0.2); 
      const tZoom = (zoomCycle + 1) / 2;
      const offsetClose = new THREE.Vector3(12, 8, 16);            
      const offsetWide = new THREE.Vector3(30, 20, 45); 
      const offsetMedium = new THREE.Vector3(20, 15, 30);
      const currentOffset = offsetMedium.clone().lerp(offsetWide, tZoom * 0.2); 

      const desiredPos = targetPos.add(currentOffset);
      const desiredLookAt = targetLook.lerp(new THREE.Vector3(0,0,0), 0.3); 

      camera.position.lerp(desiredPos, 0.005);
      camera.userData.currentLookAt.lerp(desiredLookAt, 0.01); 
      camera.lookAt(camera.userData.currentLookAt);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
        if (!mountRef.current || !camera || !renderer) return;
        const newWidth = mountRef.current.clientWidth;
        const newHeight = mountRef.current.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mountRef.current);

    // --- AGGRESSIVE CLEANUP FUNCTION (CRITICAL FIX FOR CRASH) ---
    return () => {
        isMountedRef.current = false; // Trigger Stop Loop
        cancelAnimationFrame(animationFrameId);
        resizeObserver.disconnect();
        
        // Dispose of Scene Children
        if (scene) {
            scene.traverse((object) => {
                if (!object.isMesh) return;
                
                if (object.geometry) {
                    object.geometry.dispose();
                }

                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach((material) => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
            // Explicitly remove all children
            scene.clear();
        }

        // Dispose of Textures
        Object.values(textures).forEach(tex => {
            if (tex) tex.dispose();
        });

        // Dispose of Renderer
        if (renderer) {
            renderer.dispose();
            // FORCE LOSE CONTEXT
            const gl = renderer.getContext();
            if (gl && gl.getExtension('WEBGL_lose_context')) {
                gl.getExtension('WEBGL_lose_context').loseContext();
            }
        }
        
        if (mountRef.current && renderer && renderer.domElement) {
            try {
                mountRef.current.removeChild(renderer.domElement);
            } catch (e) {
                // Ignore if already removed
            }
        }

        // Nullify references to help GC
        renderer = null;
        scene = null;
        camera = null;
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full relative bg-black overflow-hidden">
        <div className="absolute inset-0 z-[5] pointer-events-none" style={{
            background: `linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))`,
            backgroundSize: '100% 3px'
        }} />
        
       <div className="absolute top-4 left-4 z-20 flex items-center gap-3 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
          <div ref={hourRef} className="w-10 h-8 border border-white/80 flex items-center justify-center font-bold text-white bg-black/50 text-sm">00</div>
          <div className="w-32 h-2 border border-green-500 bg-black/20 relative">
              <div ref={progressRef} className="absolute top-0 left-0 h-full bg-yellow-400 transition-all duration-100 ease-linear" style={{ width: '0%' }} />
          </div>
          <div ref={nextHourRef} className="w-10 h-8 border border-white/80 flex items-center justify-center font-bold text-white bg-black/50 text-sm">00</div>
       </div>

       <div ref={timeRef} className="absolute bottom-4 left-4 z-30 text-[10px] font-mono text-white/40 pointer-events-none">
          SYSTEM: REALTIME SYNC<br/>
          TIME: 00:00:00
       </div>
    </div>
  );
};

// --- VISUAL 2: REALTIME TYPOGRAPHIC CLOCK ---
const TypographicClockVisual = ({ darkMode }) => {
  const mountRef = useRef(null);
  const timeRef = useRef(null);
  const hourRef = useRef(null);
  const nextHourRef = useRef(null);
  const progressRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    mountRef.current.innerHTML = '';

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.002);
    scene.background = new THREE.Color(0x000000);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    camera.position.z = 20;

    let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const CLOCK_CONFIG = {
        speed: 1.5,
        objectCount: 80,
        spawnRange: { x: 80, y: 60, zStart: -600, zEnd: -50 },
    };

    const objects = [];
    const textureCache = {};

    function getNumberTexture(numStr) {
        if (textureCache[numStr]) return textureCache[numStr];
        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff'; 
        ctx.font = `bold 140px "Courier New", monospace`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(numStr, 128, 128);
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, 216, 216);
        const tex = new THREE.CanvasTexture(canvas);
        textureCache[numStr] = tex;
        return tex;
    }

    const orbGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 32; glowCanvas.height = 32;
    const gCtx = glowCanvas.getContext('2d');
    const grd = gCtx.createRadialGradient(16,16,0, 16,16,16);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    gCtx.fillStyle = grd; gCtx.fillRect(0,0,32,32);
    const glowTex = new THREE.CanvasTexture(glowCanvas);

    const minOrbMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const minOrb = new THREE.Mesh(orbGeo, minOrbMat);
    const minGlowMat = new THREE.SpriteMaterial({ map: glowTex, color: 0xffff00, transparent: true, blending: THREE.AdditiveBlending, opacity: 1.0 });
    const minGlow = new THREE.Sprite(minGlowMat);
    minGlow.scale.set(25, 25, 1);
    minOrb.add(minGlow);
    scene.add(minOrb);

    const secOrbMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const secOrb = new THREE.Mesh(orbGeo, secOrbMat);
    const secGlowMat = new THREE.SpriteMaterial({ map: glowTex, color: 0x00ff00, transparent: true, blending: THREE.AdditiveBlending, opacity: 1.0 });
    const secGlow = new THREE.Sprite(secGlowMat);
    secGlow.scale.set(25, 25, 1);
    secOrb.add(secGlow);
    scene.add(secOrb);

    function createTrail(color) {
        const history = [];
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.5 });
        const line = new THREE.Line(geometry, material);
        line.frustumCulled = false;
        scene.add(line);
        return { line, history, geometry };
    }
    const minTrail = createTrail(0xffff00);
    const secTrail = createTrail(0x00ff00);

    function updateTrail(trailObj, position) {
        trailObj.history.push(position.clone());
        if (trailObj.history.length > 300) trailObj.history.shift();
        trailObj.geometry.setFromPoints(trailObj.history);
    }

    function createNumberBlock(fixedNumber = null) {
        const group = new THREE.Group();
        let valInt = fixedNumber !== null ? fixedNumber : Math.floor(Math.random() * 60);
        let valStr = valInt.toString().padStart(2, '0');
        const texture = getNumberTexture(valStr);
        const material = new THREE.SpriteMaterial({ map: texture, color: 0x444444, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(20, 20, 1);
        group.add(sprite);
        group.userData = { type: 'number', value: valInt, originalColor: new THREE.Color(0x444444), currentScale: 1.0 };
        return group;
    }

    function createDecor() {
        const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -100, 0), new THREE.Vector3(0, 100, 0)]);
        const mat = new THREE.LineBasicMaterial({ color: 0x111111 });
        const line = new THREE.Line(geo, mat);
        line.position.x = (Math.random() - 0.5) * 200;
        line.position.z = -Math.random() * 500;
        return line;
    }

    function spawnObject(zPos) {
        let obj;
        if (Math.random() > 0.1) {
            obj = createNumberBlock();
        } else {
            obj = createDecor();
        }
        obj.position.x = (Math.random() - 0.5) * CLOCK_CONFIG.spawnRange.x * 2;
        obj.position.y = (Math.random() - 0.5) * CLOCK_CONFIG.spawnRange.y * 2;
        obj.position.z = zPos;
        scene.add(obj);
        objects.push(obj);
    }

    for (let i = 0; i < CLOCK_CONFIG.objectCount; i++) {
        const z = CLOCK_CONFIG.spawnRange.zStart + Math.random() * (CLOCK_CONFIG.spawnRange.zEnd - CLOCK_CONFIG.spawnRange.zStart);
        spawnObject(z);
    }

    let animationFrameId;

    function findTarget(value) {
        let closest = null;
        let minDist = 9999;
        for (let obj of objects) {
            if (obj.userData.type === 'number' && obj.userData.value === value) {
                if (obj.position.z > -650 && obj.position.z < 25) {
                    const d = Math.abs(obj.position.z - (-20));
                    if (d < minDist) { minDist = d; closest = obj; }
                }
            }
        }
        return closest;
    }

    function moveOrbToTarget(orb, targetObj, colorHex, agility) {
        if (targetObj) {
            orb.position.x += (targetObj.position.x - orb.position.x) * agility;
            orb.position.y += (targetObj.position.y - orb.position.y) * agility;
            orb.position.z += (targetObj.position.z - orb.position.z) * agility;
            const dist = orb.position.distanceTo(targetObj.position);
            if (dist < 40) {
                const sprite = targetObj.children[0];
                sprite.material.color.setHex(colorHex);
                sprite.material.opacity = 1.0;
                targetObj.scale.setScalar(1.5);
            }
        } else {
            orb.position.z += ( -50 - orb.position.z ) * 0.05;
            orb.position.x += ( Math.sin(Date.now() * 0.001) * 30 - orb.position.x ) * 0.02;
        }
    }

    function animate() {
        if (!mountRef.current || !renderer) return;

        const now = new Date();
        const hrs = now.getHours();
        const mins = now.getMinutes();
        const secs = now.getSeconds();
        const ms = now.getMilliseconds();

        if (timeRef.current) {
             timeRef.current.innerText = `TIME: ${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
        }
        if (hourRef.current) {
             hourRef.current.innerText = hrs.toString().padStart(2, '0');
        }
        if (nextHourRef.current) {
             nextHourRef.current.innerText = ((hrs + 1) % 24).toString().padStart(2, '0');
        }
        if (progressRef.current) {
             const currentSecondsInHour = (mins * 60) + secs + (ms/1000);
             progressRef.current.style.width = `${(currentSecondsInHour / 3600) * 100}%`;
        }

        objects.forEach(obj => {
            obj.position.z += CLOCK_CONFIG.speed;
            if (obj.userData.type === 'number') {
                const sprite = obj.children[0];
                sprite.material.color.lerp(obj.userData.originalColor, 0.1);
                obj.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
                sprite.material.opacity += (0.3 - sprite.material.opacity) * 0.1;
            }
            if (obj.position.z > 20) {
                obj.position.z = CLOCK_CONFIG.spawnRange.zStart;
                obj.position.x = (Math.random() - 0.5) * CLOCK_CONFIG.spawnRange.x * 2;
                obj.position.y = (Math.random() - 0.5) * CLOCK_CONFIG.spawnRange.y * 2;
                if (obj.userData.type === 'number') {
                    const rand = Math.random();
                    let assignedVal;
                    if (rand < 0.25) assignedVal = mins;
                    else if (rand < 0.5) assignedVal = (secs + 5 + Math.floor(Math.random() * 10)) % 60;
                    else assignedVal = Math.floor(Math.random() * 60);
                    obj.userData.value = assignedVal;
                    const tex = getNumberTexture(assignedVal.toString().padStart(2, '0'));
                    obj.children[0].material.map = tex;
                }
            }
        });

        const targetMinute = findTarget(mins);
        moveOrbToTarget(minOrb, targetMinute, 0xffff00, 0.05);

        const targetSecond = findTarget(secs);
        moveOrbToTarget(secOrb, targetSecond, 0x00ff00, 0.2);

        updateTrail(minTrail, minOrb.position);
        updateTrail(secTrail, secOrb.position);

        const targetCamX = minOrb.position.x * 0.8;
        const targetCamY = minOrb.position.y * 0.8;
        camera.position.x += (targetCamX - camera.position.x) * 0.05;
        camera.position.y += (targetCamY - camera.position.y) * 0.05;
        camera.lookAt(camera.position.x, camera.position.y, -100);

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
        if (!mountRef.current || !camera || !renderer) return;
        const newWidth = mountRef.current.clientWidth;
        const newHeight = mountRef.current.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mountRef.current);

    // --- AGGRESSIVE CLEANUP FUNCTION (CRITICAL FIX FOR CRASH) ---
    return () => {
        cancelAnimationFrame(animationFrameId);
        resizeObserver.disconnect();
        
        // Dispose of Scene Children
        if (scene) {
            scene.traverse((object) => {
                if (!object.isMesh) return;
                
                if (object.geometry) {
                    object.geometry.dispose();
                }

                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach((material) => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
             scene.clear();
        }

        Object.values(textureCache).forEach(tex => {
             if (tex) tex.dispose();
        });

        // Dispose of Renderer
        if (renderer) {
            renderer.dispose();
            const gl = renderer.getContext();
            if (gl && gl.getExtension('WEBGL_lose_context')) {
                gl.getExtension('WEBGL_lose_context').loseContext();
            }
        }
        
        if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
        }
        renderer = null;
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full relative bg-black overflow-hidden">
        {/* Fade Overlay */}
        <div ref={overlayRef} className="absolute inset-0 bg-black opacity-0 pointer-events-none z-[100] transition-opacity duration-100 ease-linear" />
        {/* Scanlines */}
        <div className="absolute inset-0 z-[5] pointer-events-none" style={{
            background: `linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))`,
            backgroundSize: '100% 3px'
        }} />
    </div>
  );
};

// --- VISUAL 3: BUFFER OVERFLOW (FIXED & ROBUST) ---
const BufferOverflowVisual = ({ darkMode }) => {
  const mountRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    mountRef.current.innerHTML = '';

    const TEXT_CONTENT = "NOW IS GONE"; 
    const BG_COLOR = "#000000";
    
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.025); 

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    const START_CAM_POS = new THREE.Vector3(0, 5, 10);
    camera.position.copy(START_CAM_POS);

    const camLight = new THREE.PointLight(0xffaa00, 0.8, 60);
    camera.add(camLight);
    scene.add(camera);

    let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x111111); 
    scene.add(ambientLight);
    
    const greenLight = new THREE.PointLight(0x39ff14, 2, 30);
    scene.add(greenLight);
    const yellowLight = new THREE.PointLight(0xffff00, 2, 30);
    scene.add(yellowLight);
    
    const tunnelLight = new THREE.PointLight(0x00ffff, 2, 100); 
    tunnelLight.position.set(0, -20, 0);
    scene.add(tunnelLight);

    function createTextTexture(text) {
        const canvas = document.createElement('canvas');
        canvas.width = 4096; 
        canvas.height = 2048; 
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let fontSize = 100; 
        ctx.font = `900 ${fontSize}px "Arial Black", "Impact", sans-serif`;
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = 'left'; 
        ctx.textBaseline = 'middle';

        let baseString = text.trim() + " • ";
        let textWidth = ctx.measureText(baseString).width;
        let repetitions = Math.round(canvas.width / textWidth);
        if (repetitions < 1) repetitions = 1;
        
        let scaleFactor = (canvas.width / repetitions) / textWidth;
        
        const rows = 16; 
        const lineHeight = canvas.height / rows;

        for (let i = 0; i < rows; i++) { 
            ctx.save();
            ctx.translate(0, i * lineHeight + lineHeight/2);
            ctx.scale(scaleFactor, 1); 
            ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
            ctx.shadowBlur = 5; 
            for(let r=0; r<repetitions; r++) {
                ctx.fillText(baseString, r * textWidth, 0);
            }
            ctx.restore();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        return texture;
    }

    const typoTexture = createTextTexture(TEXT_CONTENT);

    const points = [];
    const segments = 200;
    const maxRadius = 7.0;
    const tubeRadius = 0.3; 
    
    function getSurfaceY(x) {
        let y = -1.5 / Math.pow(Math.max(x, 0.005), 1.3);
        y += 0.6;
        if (x > 3.5) {
            const factor = (x - 3.5) / 3.5;
            y = y * (1 - factor * 0.3); 
        }
        return y;
    }
    
    function getFunnelSlopeFactor(x) {
        const d = 0.01;
        const y1 = getSurfaceY(Math.max(x, tubeRadius));
        const y2 = getSurfaceY(Math.max(x + d, tubeRadius));
        const slope = (y2 - y1) / d;
        return Math.sqrt(1 + slope * slope);
    }

    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const t_distorted = Math.pow(t, 0.7); 
        let x = maxRadius * (1 - t_distorted) + tubeRadius * t_distorted;
        let y = getSurfaceY(x);
        points.push(new THREE.Vector2(x, y));
    }
    const lastY = points[points.length - 1].y;
    points.push(new THREE.Vector2(tubeRadius, lastY - 2));

    const funnelGeometry = new THREE.LatheGeometry(points, 120);
    const material = new THREE.MeshBasicMaterial({ map: typoTexture, side: THREE.DoubleSide, color: 0xffffff });
    const funnel = new THREE.Mesh(funnelGeometry, material);
    scene.add(funnel);

    const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x00ff00, wireframe: true, transparent: true, opacity: 0.05, side: THREE.DoubleSide, depthTest: false, blending: THREE.AdditiveBlending
    });
    const wireframeFunnel = new THREE.Mesh(funnelGeometry, wireframeMat);
    wireframeFunnel.scale.set(1.005, 1.005, 1.005);
    scene.add(wireframeFunnel);

    function createTunnelTexture(scaleY = 1.0) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 6;
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 15;
        ctx.lineCap = 'round';
        
        const numRings = 20;
        for(let i=0; i<numRings; i++) {
            const y = (i / numRings) * canvas.height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
        ctx.lineWidth = 2;
        const numLines = 8;
        for(let i=0; i<numLines; i++) {
            const x = (i / numLines) * canvas.width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 10 * scaleY); 
        return tex;
    }

    const tunnelRadius = 4.0; 
    const SPLIT_START_Y = -30.0; 
    
    const mainTunnelHeight = 30.0;
    const mainTunnelGeo = new THREE.CylinderGeometry(tunnelRadius, tunnelRadius, mainTunnelHeight, 64, 1, true);
    const mainTunnelTex = createTunnelTexture(mainTunnelHeight / 300.0); 
    
    const mainTunnelMat = new THREE.MeshBasicMaterial({ 
        map: mainTunnelTex, 
        side: THREE.BackSide, 
        color: 0xffffff,
        transparent: true,
        opacity: 1.0 
    });
    
    const tunnelMesh = new THREE.Mesh(mainTunnelGeo, mainTunnelMat);
    tunnelMesh.position.y = -mainTunnelHeight / 2; 
    scene.add(tunnelMesh);

    const branchRadius = 2.5; 
    const branchHeight = 200.0;
    const branchGeo = new THREE.CylinderGeometry(branchRadius, branchRadius, branchHeight, 64, 1, true);
    branchGeo.translate(0, -branchHeight / 2, 0);
    
    const branchTex = createTunnelTexture(branchHeight / 300.0);
    
    const leftBranchMat = new THREE.MeshBasicMaterial({ map: branchTex, side: THREE.BackSide, color: 0xffffff });
    const rightBranchMat = new THREE.MeshBasicMaterial({ map: branchTex, side: THREE.BackSide, color: 0xffffff });

    const leftBranch = new THREE.Mesh(branchGeo, leftBranchMat);
    const rightBranch = new THREE.Mesh(branchGeo, rightBranchMat);
    
    leftBranch.position.set(0, SPLIT_START_Y, 0);
    rightBranch.position.set(0, SPLIT_START_Y, 0);
    
    const branchAngle = 0.38; 
    leftBranch.rotation.z = -branchAngle; 
    rightBranch.rotation.z = branchAngle; 
    
    scene.add(leftBranch);
    scene.add(rightBranch);

    const sphereGeo = new THREE.SphereGeometry(0.15, 32, 32);
    const greenMat = new THREE.MeshPhysicalMaterial({
        color: 0x39ff14, emissive: 0x39ff14, emissiveIntensity: 2.0, roughness: 0.1, metalness: 0.5
    });
    const greenSphere = new THREE.Mesh(sphereGeo, greenMat);
    scene.add(greenSphere);

    const yellowGeo = new THREE.SphereGeometry(0.30, 32, 32); 
    const yellowMat = new THREE.MeshPhysicalMaterial({
        color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 1.5, roughness: 0.1, metalness: 0.5
    });
    const yellowSphere = new THREE.Mesh(yellowGeo, yellowMat);
    scene.add(yellowSphere);

    let simTime = 0; 
    const TOTAL_DURATION = 30.0; 
    const START_RADIUS = 6.8;
    const HOLE_RADIUS = tubeRadius + 0.1;
    
    const FADE_START_TIME = 42.0; 
    const RESET_TIME = 47.0; 

    let greenState = { angle: 0, radius: START_RADIUS, vy: 0, isFalling: false, yPos: 0 };
    let yellowState = { angle: 0.5, radius: START_RADIUS, vy: 0, isFalling: false, yPos: 0 };

    const _currentCameraPos = new THREE.Vector3().copy(START_CAM_POS);
    const _lookAtPos = new THREE.Vector3();
    const _targetCam = new THREE.Vector3();
    const _lookTarget = new THREE.Vector3();
    const _midPoint = new THREE.Vector3();
    
    let smoothAvgY = 0;

    function resetSimulation() {
        simTime = 0;
        yellowState.radius = START_RADIUS; yellowState.angle = 0.5; yellowState.isFalling = false; yellowState.vy = 0;
        greenState.radius = START_RADIUS; greenState.angle = 0; greenState.isFalling = false; greenState.vy = 0;
        yellowSphere.scale.setScalar(1); greenSphere.scale.setScalar(1);
        smoothAvgY = 0;
        
        if(overlayRef.current) overlayRef.current.style.opacity = 0;

        camera.position.copy(START_CAM_POS);
        _currentCameraPos.copy(START_CAM_POS);
        _lookAtPos.set(0,0,0);
        camera.lookAt(_lookAtPos);
        camera.fov = 60; camera.updateProjectionMatrix(); camera.rotation.z = 0;
    }

    const clock = new THREE.Clock();
    let animationFrameId;

    function animate() {
        if (!mountRef.current || !renderer) return;

        animationFrameId = requestAnimationFrame(animate);
        
        const delta = Math.min(clock.getDelta(), 0.05); 
        simTime += delta;

        if (simTime > RESET_TIME) resetSimulation();
        
        if (simTime > FADE_START_TIME && overlayRef.current) {
            let f = (simTime - FADE_START_TIME) / (RESET_TIME - FADE_START_TIME);
            overlayRef.current.style.opacity = Math.min(Math.max(f, 0), 1);
        }

        const rotSpeed = (Math.PI * 2) / 60;
        funnel.rotation.y += rotSpeed * delta;
        
        let suctionSpeed = 0.0002 + (simTime / TOTAL_DURATION) * 0.0008;
        typoTexture.offset.y -= suctionSpeed; 

        let t = Math.min(simTime / TOTAL_DURATION, 1.0);

        const forceFall = simTime >= TOTAL_DURATION || yellowState.radius <= HOLE_RADIUS + 0.05 || greenState.radius <= HOLE_RADIUS + 0.05;

        if (!yellowState.isFalling && !forceFall) {
            let radFactor = Math.pow(1 - t, 1.5); 
            yellowState.radius = HOLE_RADIUS + (START_RADIUS - HOLE_RADIUS) * radFactor;
            let effectiveR = Math.max(yellowState.radius, 0.1);
            let angSpeedY = 0.5 + (2.0 / (effectiveR * 1.5)); 
            yellowState.angle += delta * angSpeedY;
            
            let slope = getFunnelSlopeFactor(yellowState.radius);
            yellowState.yPos = getSurfaceY(yellowState.radius) + (0.30 * slope);
        } else {
            yellowState.isFalling = true;
            if (yellowState.yPos < -12.0) {
                yellowState.yPos -= 3.0 * delta;
                yellowState.radius = THREE.MathUtils.lerp(yellowState.radius, 3.2, 0.1);
                yellowState.angle += delta * 2.5;
            } else {
                yellowState.angle += delta * 6.0; 
                yellowState.yPos -= 2.5 * delta; 
                yellowState.radius = THREE.MathUtils.lerp(yellowState.radius, 0.0, 0.1);
            }
        }

        if (!greenState.isFalling && !forceFall) {
            let targetGreenR = Math.max(yellowState.radius - 0.5, HOLE_RADIUS + 0.05);
            greenState.radius = targetGreenR;
            let gEffectiveR = Math.max(greenState.radius, 0.08);
            let angSpeedG = 0.5 + (2.0 / (gEffectiveR * 1.5)); 
            angSpeedG *= 2.5; 
            greenState.angle += delta * angSpeedG;

            let slope = getFunnelSlopeFactor(greenState.radius);
            greenState.yPos = getSurfaceY(greenState.radius) + (0.15 * slope);
        } else {
            greenState.isFalling = true;
            if (greenState.yPos < -12.0) {
                greenState.yPos -= 3.0 * delta;
                greenState.radius = THREE.MathUtils.lerp(greenState.radius, 3.2, 0.1);
                greenState.angle -= delta * 2.5;
            } else {
                greenState.angle += delta * 9.0;
                greenState.yPos -= 2.5 * delta;
                greenState.radius = THREE.MathUtils.lerp(greenState.radius, 0.0, 0.1);
            }
        }

        let currentRealMidY = (yellowState.yPos + greenState.yPos) / 2;
        let yellowCenterX = 0;
        let greenCenterX = 0;

        if (currentRealMidY < SPLIT_START_Y) {
            let d = SPLIT_START_Y - currentRealMidY;
            let deviation = d * Math.tan(branchAngle);
            yellowCenterX = deviation;
            greenCenterX = -deviation;
        }

        let yX = yellowCenterX + Math.cos(yellowState.angle) * yellowState.radius;
        let yZ = Math.sin(yellowState.angle) * yellowState.radius;
        let yY = 0;
        if (!yellowState.isFalling) {
            let slope = getFunnelSlopeFactor(yellowState.radius);
            yY = getSurfaceY(yellowState.radius) + (0.30 * slope);
        } else {
            yY = yellowState.yPos;
        }
        yellowSphere.position.set(yX, yY, yZ);

        let gX = greenCenterX + Math.cos(greenState.angle) * greenState.radius;
        let gZ = Math.sin(greenState.angle) * greenState.radius;
        let gY = 0;
        if (!greenState.isFalling) {
            let slope = getFunnelSlopeFactor(greenState.radius);
            gY = getSurfaceY(greenState.radius) + (0.15 * slope);
        } else {
            gY = greenState.yPos;
        }
        greenSphere.position.set(gX, gY, gZ);

        yellowLight.position.copy(yellowSphere.position).add(new THREE.Vector3(0, 0.5, 0));
        greenLight.position.copy(greenSphere.position).add(new THREE.Vector3(0, 0.5, 0));
        
        if (yellowState.isFalling) {
            tunnelLight.position.y = yellowState.yPos - 20;
        }

        let midX = (yellowSphere.position.x + greenSphere.position.x) / 2;
        let midZ = (yellowSphere.position.z + greenSphere.position.z) / 2;
        _midPoint.set(midX, currentRealMidY, midZ);
        let avgRadius = (yellowState.radius + greenState.radius) / 2;
        const isDiving = yellowState.isFalling || greenState.isFalling;

        if (isDiving) {
            const entryY = 0.6;
            let fallDepth = entryY - currentRealMidY; 
            let transitionFactor = THREE.MathUtils.clamp(fallDepth / 1.5, 0, 1);
            transitionFactor = Math.pow(transitionFactor, 0.5);

            let targetX = THREE.MathUtils.lerp(0, _midPoint.x, transitionFactor);
            let targetZ = THREE.MathUtils.lerp(0, _midPoint.z, transitionFactor);
            let currentOffset = THREE.MathUtils.lerp(4.5, 6.0, transitionFactor);
            _targetCam.set(targetX, currentRealMidY + currentOffset, targetZ);

            let lookTargetX = THREE.MathUtils.lerp(0, _midPoint.x, transitionFactor);
            let lookTargetZ = THREE.MathUtils.lerp(0, _midPoint.z, transitionFactor);
            _lookTarget.set(lookTargetX, currentRealMidY, lookTargetZ);

            if (currentRealMidY < -12.0 && transitionFactor > 0.98) {
                _targetCam.set(0, currentRealMidY + 5.0, 0);
                _lookTarget.set(0, currentRealMidY, 0);
                if (currentRealMidY < SPLIT_START_Y + 5.0) {
                      _targetCam.x = 0; _targetCam.z = 0;
                      _lookTarget.x = 0; _lookTarget.z = 0;
                }
            }

            const nearCylinderEntry = isDiving && currentRealMidY < -10.5 && currentRealMidY > -12.0;
            if (nearCylinderEntry) {
                _targetCam.x *= 0.3; _targetCam.z *= 0.3; _targetCam.y -= 1.0;
            }

            _currentCameraPos.lerp(_targetCam, 0.1);
            let lookLerpSpeed = 0.05 + (0.15 * transitionFactor);
            _lookAtPos.lerp(_lookTarget, lookLerpSpeed);

            camera.fov = THREE.MathUtils.lerp(camera.fov, 100, 0.05);
            if (nearCylinderEntry) {
                camera.fov = THREE.MathUtils.lerp(camera.fov, 70, 0.1);
            }
            camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, 0, 0.1);

        } else {
            smoothAvgY = THREE.MathUtils.lerp(smoothAvgY, currentRealMidY, 0.1);
            let proximityToHole = (avgRadius / START_RADIUS); 
            let targetDist = 2.0 + (proximityToHole * 5.0); 

            let camAngle = yellowState.angle - 0.5; 
            let targetCamX = Math.cos(camAngle) * targetDist;
            let targetCamZ = Math.sin(camAngle) * targetDist;
            let targetCamY = smoothAvgY + 2.5 + (proximityToHole * 2.0); 

            if (avgRadius < 1.8) {
                let centerProgress = 1.0 - (Math.max(avgRadius, 0.1) / 1.8);
                centerProgress = Math.pow(centerProgress, 2); 
                targetCamX = THREE.MathUtils.lerp(targetCamX, 0, centerProgress);
                targetCamZ = THREE.MathUtils.lerp(targetCamZ, 0, centerProgress);
                let fixedEntryY = 0.6 + 4.5;
                targetCamY = THREE.MathUtils.lerp(targetCamY, fixedEntryY, centerProgress);
            }

            _targetCam.set(targetCamX, targetCamY, targetCamZ);
            _lookTarget.copy(_midPoint);
            _lookTarget.y = smoothAvgY;

            if (avgRadius < 4.5) {
                let centerWeight = 1.0 - Math.max(0, (avgRadius - 0.5) / 4.0);
                centerWeight = centerWeight * centerWeight * (3 - 2 * centerWeight);
                _lookTarget.x = THREE.MathUtils.lerp(_midPoint.x, 0, centerWeight);
                _lookTarget.z = THREE.MathUtils.lerp(_midPoint.z, 0, centerWeight);
                let holeDeepFocusY = -15.0; 
                _lookTarget.y = THREE.MathUtils.lerp(smoothAvgY, holeDeepFocusY, centerWeight * 0.5); 
            }

            if (avgRadius < 1.2) {
                const holeY = getSurfaceY(tubeRadius);
                let strictCenter = 1.0 - (Math.max(avgRadius, 0.0) / 1.2);
                _lookTarget.x = THREE.MathUtils.lerp(_lookTarget.x, 0, strictCenter);
                _lookTarget.z = THREE.MathUtils.lerp(_lookTarget.z, 0, strictCenter);
                _lookTarget.y = THREE.MathUtils.lerp(_lookTarget.y, holeY - 2.0, strictCenter * 0.5);
            }

            const inEntryZone = (!isDiving) && (avgRadius < 1.4);
            if (inEntryZone) {
                _targetCam.x = 0; _targetCam.z = 0;
                _lookTarget.x = 0; _lookTarget.z = 0;
            }

            _currentCameraPos.lerp(_targetCam, 0.08); 
            _lookAtPos.lerp(_lookTarget, 0.1);
            camera.fov = THREE.MathUtils.lerp(camera.fov, 60, 0.05); 
            camera.rotation.z *= 0.95; 
        }

        camera.position.copy(_currentCameraPos);
        camera.lookAt(_lookAtPos);
        camera.updateProjectionMatrix();

        renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
        if (!mountRef.current || !camera || !renderer) return;
        const newWidth = mountRef.current.clientWidth;
        const newHeight = mountRef.current.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mountRef.current);

    // --- AGGRESSIVE CLEANUP FUNCTION (CRITICAL FIX FOR CRASH) ---
    return () => {
        cancelAnimationFrame(animationFrameId);
        resizeObserver.disconnect();
        
        // Dispose of Scene Children
        if (scene) {
            scene.traverse((object) => {
                if (!object.isMesh) return;
                
                if (object.geometry) {
                    object.geometry.dispose();
                }

                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach((material) => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
             scene.clear();
        }

        // Dispose of known textures explicitly instead of iterating undefined 'textures' object
        if (typoTexture) typoTexture.dispose();
        if (mainTunnelTex) mainTunnelTex.dispose();
        if (branchTex) branchTex.dispose();

        // Dispose of Renderer
        if (renderer) {
            renderer.dispose();
            const gl = renderer.getContext();
            if (gl && gl.getExtension('WEBGL_lose_context')) {
                gl.getExtension('WEBGL_lose_context').loseContext();
            }
        }
        
        if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
        }
        renderer = null;
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full relative bg-black overflow-hidden">
        {/* Fade Overlay */}
        <div ref={overlayRef} className="absolute inset-0 bg-black opacity-0 pointer-events-none z-[100] transition-opacity duration-100 ease-linear" />
        {/* Scanlines */}
        <div className="absolute inset-0 z-[5] pointer-events-none" style={{
            background: `linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))`,
            backgroundSize: '100% 3px'
        }} />
    </div>
  );
};
// --- SKILL NODE NETWORK COMPONENT ---
const SkillNetwork = ({ darkMode, className }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Default Style for Services Page (Independent)
  const defaultClass = "relative w-full h-[60vh] md:h-[80vh] border border-current rounded-xl overflow-hidden mt-12 bg-black/5";
  const appliedClass = className || defaultClass;

  // Node Data with Descriptions
  const nodes = [
    { id: 'Design', x: 50, y: 50, label: 'Design', desc: "Holistic design approach integrating strategy, aesthetics, and functionality across digital and physical mediums." },
    
    // Inner Ring
    { id: '3D', x: 25, y: 40, label: '3D & Product', desc: "Creation of three-dimensional assets and environments for product visualization and artistic expression." },
    { id: 'Code', x: 75, y: 40, label: 'Creative Code', desc: "Developing custom tools and generative visual systems using code as a primary design medium." },
    { id: 'Graphic', x: 35, y: 65, label: 'Graphic Design', desc: "Mastery of typography, grid systems, and layout to create clear and impactful visual communication." },
    { id: 'Comm', x: 65, y: 65, label: 'Communication', desc: "Strategic transmission of information through visual language to achieve defined objectives." },
    { id: 'Adobe', x: 38, y: 28, label: 'Adobe Suite', desc: "Advanced proficiency in the Adobe Creative Cloud ecosystem, including InDesign, Photoshop, Illustrator, Premiere Pro, and After Effects for static and motion design." },
    { id: 'Affinity', x: 62, y: 28, label: 'Affinity', desc: "Proficiency in Affinity Designer, Photo, and Publisher as efficient alternatives for vector and raster editing." },

    // Outer Ring
    { id: 'C4D', x: 10, y: 20, label: 'Cinema 4D', desc: "High-end 3D motion graphics and simulation for broadcast and commercial visual effects." },       
    { id: 'Blender', x: 25, y: 15, label: 'Blender', desc: "Open-source 3D pipeline for modeling, sculpting, and real-time rendering." }, 
    { id: 'Fusion', x: 10, y: 60, label: 'Fusion 360', desc: "Parametric CAD modeling for precise industrial design and product manufacturing." },
    { id: 'Print', x: 20, y: 55, label: '3D Printing', desc: "Specialist in additive manufacturing and rapid prototyping. From custom commissions to my own product line, I bridge digital design and physical reality." },
    { id: 'Xcode', x: 90, y: 20, label: 'Xcode', desc: "Development environment for native Apple platforms, enabling the creation of bespoke iOS and macOS applications." },        
    { id: 'Touch', x: 90, y: 60, label: 'TouchDesigner', desc: "Node-based visual programming for real-time interactive multimedia content and installations." },
    { id: 'React', x: 75, y: 15, label: 'React', desc: "Building modern, reactive web interfaces and single-page applications with component-based architecture." },        
    { id: 'Story', x: 50, y: 90, label: 'Storytelling', desc: "Crafting compelling narratives that drive the visual identity and connect with the audience on an emotional level." }, 
    { id: 'AI', x: 50, y: 75, label: 'AI Generative', desc: "AI native since day one. Deep expertise in LLM architecture, image/video generation, and custom model training. I provide advanced consulting and workshops, staying constantly ahead of the research curve." },        
  ];

  const links = [
    ['Design', '3D'], ['Design', 'Code'], ['Design', 'Story'], ['Design', 'Adobe'], ['Design', 'Affinity'],
    ['Design', 'Graphic'], ['Design', 'Comm'],
    ['3D', 'C4D'], ['3D', 'Blender'], ['3D', 'Fusion'], ['3D', 'Print'],
    ['Code', 'Xcode'], ['Code', 'Touch'], ['Code', 'React'],
    ['Story', 'AI'], ['Adobe', 'AI'],
    ['Graphic', 'Adobe'], ['Graphic', 'Affinity']
  ];

  // Animation State
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // RESIZE HANDLING - Using ResizeObserver for robustness
    const handleResize = () => {
      if (containerRef.current && canvas) {
        const { clientWidth, clientHeight } = containerRef.current;
        // Set actual canvas pixel size to match display size
        canvas.width = clientWidth;
        canvas.height = clientHeight;
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    // Initial size set
    handleResize();

    const render = () => {
      time += 0.005;
      
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Lines
      ctx.strokeStyle = darkMode ? 'rgba(0, 255, 65, 0.2)' : 'rgba(0, 85, 255, 0.2)';
      ctx.lineWidth = 1;

      // Helper to get actual XY coordinates with floating effect
      const getPos = (node, t) => {
        // Pseudo-random float based on ID characters
        const seed = node.id.charCodeAt(0); 
        const floatX = Math.sin(t + seed) * 2; // Float range X
        const floatY = Math.cos(t + seed * 0.5) * 2; // Float range Y
        
        return {
          x: (node.x / 100) * canvas.width + floatX,
          y: (node.y / 100) * canvas.height + floatY
        };
      };

      links.forEach(([idA, idB]) => {
        const nodeA = nodes.find(n => n.id === idA);
        const nodeB = nodes.find(n => n.id === idB);
        if (nodeA && nodeB) {
          const posA = getPos(nodeA, time);
          const posB = getPos(nodeB, time);
          ctx.beginPath();
          ctx.moveTo(posA.x, posA.y);
          ctx.lineTo(posB.x, posB.y);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [darkMode]);

  return (
    <div ref={containerRef} className={appliedClass}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      
      {/* HTML Overlay for Nodes (Better text rendering & interaction) */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{ 
            left: `${node.x}%`, 
            top: `${node.y}%`,
            animation: `float-${node.id} 6s infinite ease-in-out` 
          }}
          onClick={() => setSelectedNode(node)}
        >
          {/* Node Dot */}
          <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full mx-auto mb-2 transition-all duration-300
            ${darkMode ? 'bg-green-500 shadow-[0_0_10px_rgba(0,255,65,0.5)]' : 'bg-blue-600 shadow-[0_0_10px_rgba(0,85,255,0.5)]'}
            group-hover:scale-150
          `}></div>
          
          {/* Label */}
          <div className={`text-[10px] md:text-xs font-syne font-bold uppercase tracking-widest text-center whitespace-nowrap opacity-70 group-hover:opacity-100 transition-opacity
              ${darkMode ? 'text-white' : 'text-black'}
          `}>
            {node.label}
          </div>
        </div>
      ))}
      
      {/* Info Overlay (Mac-Window Style) - Optimized Logic for Vertical Position */}
      {selectedNode && (
         <div 
           className={`absolute z-50 p-3 rounded-xl border backdrop-blur-md shadow-2xl w-48 md:w-56 transition-all duration-300 animate-in fade-in zoom-in-95 max-h-[200px] overflow-y-auto break-words
             ${darkMode ? 'bg-black/90 border-white/20 text-white' : 'bg-white/90 border-black/20 text-black'}
           `}
           style={{
             left: `clamp(10px, ${selectedNode.x}%, calc(100% - 200px))`,
             // Conditional positioning: if node is low (> 50%), render ABOVE, else render BELOW
             top: selectedNode.y > 50 
                   ? `auto` 
                   : `${selectedNode.y + 8}%`,
             bottom: selectedNode.y > 50 
                   ? `${100 - selectedNode.y + 8}%` 
                   : `auto`
           }}
         >
            <div className="flex items-center gap-2 mb-2 border-b border-current/10 pb-2">
               <button 
                 onClick={(e) => { e.stopPropagation(); setSelectedNode(null); }}
                 className="w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
               />
               <span className="text-[9px] font-mono uppercase opacity-50 ml-auto">INFO_NODE</span>
            </div>
            <h4 className="font-syne font-bold uppercase mb-1 text-xs">{selectedNode.label}</h4>
            <p className="font-mono text-[10px] opacity-80 leading-relaxed">
              {selectedNode.desc}
            </p>
         </div>
      )}

      {/* Floating Keyframes generation for CSS (inline to keep single file) */}
      <style>{`
        ${nodes.map(n => `
          @keyframes float-${n.id} {
            0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
            50% { transform: translate(-50%, -50%) translate(${Math.sin(n.id.charCodeAt(0)) * 10}px, ${Math.cos(n.id.charCodeAt(0)) * 10}px); }
          }
        `).join('')}
      `}</style>
    </div>
  );
};
// --- RESTORED WORK VIEW COMPONENT (TIMELINE) ---
const WorkView = ({ darkMode }) => {
  const timeline = [
    { year: "08.2025 — Present", role: "Integrated Design (B.A.)", desc: "Studies at KISD (Köln International School of Design)." },
    { year: "2024 — Present", role: "Freelance Designer & Artist", desc: "Focusing on industrial design, digital product development, and narrative systems." },
    { year: "2024", role: "Exhibition: Superheroes", desc: "Featured in the 'Superheroes' exhibition at NRW-Forum Düsseldorf / Next Museum. Project: Nasalica." },
    { year: "2023 — 2025", role: "Communication Design (B.A.)", desc: "4 Semesters at HSD (Peter Behrens School of Arts). Specialized in narrative structures and visual communication." },
    { year: "2023", role: "Product Launch: Hung Hook", desc: "Industrial design, prototyping, and establishing global e-commerce distribution for a 3D printed product." },
    { year: "2023", role: "Founder: PRIDE-KUNST", desc: "Art Direction & Brand Building. Created a consistent visual identity system." },
    { year: "2021 — 2023", role: "Integrated Design Research", desc: "Studies at KISD (Köln International School of Design). Focus on design theory and experimental practice." }
  ];

  return (
    <div className="pt-32 px-6 min-h-screen max-w-7xl mx-auto pb-40">
      {/* A) Page Headline: font-rubik */}
      <h1 className="text-[12vw] md:text-9xl font-rubik font-bold mb-24 w-full break-words uppercase">
        <span className="glitch-hover cursor-default block">TIMELINE_</span>
      </h1>
      
      <div className="relative border-l border-current ml-4 md:ml-12 pl-12 md:pl-24 space-y-24 pb-24">
        {timeline.map((item, i) => (
          <div key={i} className="relative group">
            <div className={`absolute -left-[53px] md:-left-[101px] top-2 w-4 h-4 rounded-full border-2 border-current bg-transparent transition-all duration-300 group-hover:bg-current ${darkMode ? 'group-hover:shadow-[0_0_20px_rgba(0,255,65,0.5)]' : 'group-hover:shadow-[0_0_20px_rgba(0,85,255,0.5)]'}`}></div>
            <span className="font-mono text-sm opacity-50 mb-2 block">{item.year}</span>
            {/* B) Section Headline: font-rubik */}
            <h3 className="text-3xl md:text-5xl font-rubik font-bold uppercase mb-4">
               <span className="glitch-hover cursor-default block">{item.role}</span>
            </h3>
            <p className="max-w-xl text-lg opacity-80 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
// --- SUB-PAGES ---

const HomeView = ({ darkMode, projects, setSelectedProject, selectedProject }) => {
  const [terminalLine, setTerminalLine] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    // Typewriter timing sequence
    const sequence = [
        { line: 1, delay: 500 },  // INITIATING...
        { line: 2, delay: 1200 }, // SUBJECT...
        { line: 3, delay: 2000 }, // STATUS...
        { line: 4, delay: 2800 }, // BLANK
        { line: 5, delay: 3500 }, // LOAD_SKILLS:
        { line: 6, delay: 4000 }, // - Worldbuilding
        { line: 7, delay: 4400 }, // - Nasalica
        { line: 8, delay: 4800 }, // - Product_Dev
        { line: 9, delay: 5500 }, // BLANK
        { line: 10, delay: 6500 } // SYSTEM_MAP...
    ];

    const timeouts = sequence.map(step => 
      setTimeout(() => {
        setTerminalLine(step.line);
        if (step.line === 10) setTimeout(() => setBootComplete(true), 1000);
      }, step.delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
  <>
    <header className="relative min-h-screen flex flex-col justify-center px-6 pt-20 overflow-hidden">
        {/* Global Grid Background for Home View */}
        <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${darkMode ? 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]' : 'bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] bg-[size:24px_24px]'}`}></div>

        <div className="max-w-7xl mx-auto w-full z-10">
          <div className="flex flex-col gap-0">
            {/* SYSTEM ONLINE - Linksbündig (Standard) */}
            <p className={`text-sm md:text-base mb-4 tracking-widest uppercase ${darkMode ? 'text-green-500' : 'text-blue-600'}`}>
              <span className="animate-pulse">●</span> System Online
            </p>
            
            {/* HEADLINE ANPASSUNG: VISUAL LINKS, STORY MITTE, TELLER RECHTS */}
            {/* A) Page Headline: font-rubik */}
            <h1 className="font-rubik text-[13vw] md:text-[11.5vw] leading-[0.8] tracking-tighter uppercase select-none w-full">
              {/* Visual -> text-left (Ausgerichtet mit System Online) */}
              <div className="glitch-hover cursor-default transition-colors block whitespace-nowrap text-left">Visual</div>
              
              {/* Story -> text-center (Bleibt mittig) */}
              <div className="glitch-hover cursor-default transition-colors opacity-80 block whitespace-nowrap text-center">Story</div>
              
              {/* Teller -> text-right (Bleibt rechts) */}
              <div className="glitch-hover cursor-default transition-colors text-right block whitespace-nowrap">Teller</div>
            </h1>
          </div>

          <div className="mt-12 md:mt-24 flex flex-col md:flex-row justify-between items-end border-t border-current pt-6 opacity-80">
            <div className="max-w-md">
              <p className="text-lg md:text-xl leading-relaxed">
                Visual systems for brands, interfaces and narrative experiences.
              </p>
            </div>
            <div className="mt-6 md:mt-0 text-right font-mono text-xs md:text-sm">
                SCROLL TO INITIALIZE <br/> ↓
            </div>
          </div>
        </div>
    </header>

    <section id="about" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="sticky top-24">
              {/* B) Section Headline: font-rubik */}
              <h2 className="text-4xl md:text-6xl font-rubik font-bold mb-8 uppercase">
                  <span className="glitch-hover cursor-default block">The Operator</span>
              </h2>
              <p className="text-xl leading-relaxed mb-6">
                I am a graphic designer working across brand systems, generative design and visual storytelling.
              </p>
              <p className="opacity-70 leading-relaxed mb-8 font-mono text-sm">
                My practice combines classical design discipline with experimental technologies to create scalable visual identities.
              </p>
              <div className="flex gap-4">
                <span className="border border-current px-4 py-2 rounded-full text-sm uppercase">Storyteller</span>
                <span className="border border-current px-4 py-2 rounded-full text-sm uppercase">Designer</span>
                <span className="border border-current px-4 py-2 rounded-full text-sm uppercase">Artist</span>
              </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className={`p-6 rounded-lg font-mono text-xs md:text-sm leading-6 shadow-2xl overflow-hidden relative transition-all duration-1000 ${darkMode ? 'bg-[#0A0A0A] border border-green-900/50' : 'bg-white border border-gray-200'} flex items-center justify-center min-h-[60vh]`}>
                <div className="absolute top-6 left-6 flex gap-2 mb-4 opacity-50 z-20">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                
                {/* Terminal Code Text - Disappears completely */}
                <div className={`${darkMode ? 'text-green-500' : 'text-blue-600'} transition-opacity duration-500 w-full ${bootComplete ? 'opacity-0 absolute pointer-events-none' : 'opacity-100 relative'}`}>
                    {terminalLine >= 1 && <p>{'>'} INITIATING IDENTITY SEQUENCE...</p>}
                    {terminalLine >= 2 && <p>{'>'} SUBJECT: JOEL_VAN_HEES</p>}
                    {terminalLine >= 3 && <p>{'>'} STATUS: AWAKENED</p>}
                    {terminalLine >= 4 && <p className="mt-2">&nbsp;</p>}
                    {terminalLine >= 5 && <p>{'>'} LOAD_SKILLS:</p>}
                    {terminalLine >= 6 && <p className="pl-4 text-opacity-80 text-current">- Worldbuilding.exe [LOADED]</p>}
                    {terminalLine >= 7 && <p className="pl-4 text-opacity-80 text-current">- Nasalica_Universe.dat [EXPANDING]</p>}
                    {terminalLine >= 8 && <p className="pl-4 text-opacity-80 text-current">- Product_Dev_Engine.obj [ACTIVE]</p>}
                    {terminalLine >= 9 && <p className="mt-2">&nbsp;</p>}
                    {terminalLine >= 10 && <p className="animate-pulse">{'>'} SYSTEM_MAP: RENDERING…</p>}
                </div>

                {/* Network Visualization - Takes full absolute space */}
                 <div className={`transition-all duration-1000 ease-out absolute inset-0 ${bootComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {bootComplete && <SkillNetwork darkMode={darkMode} className="absolute inset-0 w-full h-full border-none bg-transparent" />}
                </div>
            </div>
          </div>
        </div>
    </section>

    <section id="work" className={`py-24 px-6 ${darkMode ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between mb-16 border-b border-current pb-4">
              <h2 className="text-sm font-mono uppercase tracking-widest">Selected Data</h2>
              <span className="text-xs opacity-50">INDEX: 00—06</span>
          </div>

          <div className="grid grid-cols-1 gap-20">
            {projects.map((project, index) => (
              <div key={project.id} onClick={() => setSelectedProject(project)} className="group cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-4">
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded mb-2 inline-block ${darkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                      {project.category}
                    </span>
                    {/* B) Project Headline: font-rubik */}
                    <h3 className={`text-4xl md:text-6xl font-rubik font-bold mt-2 transition-all duration-300 ${project.id === "02" ? "lowercase" : "uppercase"}`}>
                        <span className="glitch-hover cursor-default block">{project.title}</span>
                    </h3>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    VIEW CASE <ArrowUpRight size={16} />
                  </div>
                </div>

                <div className={`relative w-full overflow-hidden bg-gray-800 mb-6 rounded-lg ${
                  project.id === "01" ? "aspect-[9/16] md:w-1/3 mx-auto" : "aspect-video md:aspect-[2.5/1]"
                }`}>
                  <div className={`absolute inset-0 z-10 transition-opacity duration-500 opacity-20 group-hover:opacity-0 ${darkMode ? 'bg-black' : 'bg-white'}`}></div>
                  
                  <div className={`w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-105 ${darkMode ? 'bg-[#111]' : 'bg-[#e5e5e5]'}`}>
                      {/* --- FIX: PREVENT 3D CRASH --- */}
                      {/* Only render Spiral preview if modal is NOT open for this project */}
                      {(project.visualComponent || project.id === "02" || project.id === "01") ? (
                        <div className="w-full h-full opacity-100 transition-opacity">
                            {/* Project 01: Video */}
                            {project.id === "01" ? (
                                <HoverVideoPlayer src="/videos/ikea_reel.mp4" />
                            ) : project.id === "02" ? (
                                // Project 02: Spiral - EXCLUSIVE RENDER CHECK
                                (selectedProject?.id === "02") ? (
                                   // Placeholder if modal is open to free up WebGL context
                                   <div className="w-full h-full flex items-center justify-center opacity-20">
                                      <Layers size={64} />
                                   </div>
                                ) : (
                                   <SpiralTimeSphere darkMode={darkMode} />
                                )
                            ) : (
                                // Other Projects - Including NEW Web Project (ID 00) which passes an IMG tag
                                <div className="w-full h-full">
                                    {project.visualComponent}
                                </div>
                            )}
                        </div>
                      ) : (
                        <div className="opacity-20">
                            {project.id === "01" ? <Video size={64} /> : <Layers size={64} />}
                        </div>
                      )}
                      
                      {(project.id === "02" || project.id === "01") && (
                        <div className="absolute top-4 right-4 text-[10px] font-mono border px-2 py-1 rounded bg-black/50 text-white border-white/20">
                            {project.id === "01" ? "[VIDEO_CONTENT]" : "[LIVE_RENDER]"}
                        </div>
                      )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-current pt-4 opacity-70 group-hover:opacity-100 transition-opacity">
                    <div className="md:col-span-2">
                      <p>{project.description}</p>
                      {/* LOGOS IN PREVIEW - CORRECTED PLACEMENT */}
                      {project.id === "01" && (
                        <div className="flex gap-6 mt-6 items-center">
                            <img src={ikeaLogo} alt="IKEA" className="h-6 w-auto object-contain" />
                            <img src={britaLogo} alt="Brita" className="h-6 w-auto object-contain" />
                            <img src={goveeLogo} alt="Govee" className="h-6 w-auto object-contain" />
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2 flex justify-start md:justify-end gap-4 font-mono text-xs uppercase flex-wrap">
                      {project.tech.map(t => <span key={t}>[{t}]</span>)}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </section>

    {/* RESTORED SERVICES LIST ON HOME PAGE */}
    <section id="services" className="py-24 px-6 pb-40">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm font-mono uppercase tracking-widest mb-12">Capabilities</h2>
          
          <div className="flex flex-col">
            {[
              { title: "Brand Identity", desc: "Logo, Strategie, Design Systeme" },
              { title: "Web & Interface", desc: "UX/UI, React, Framer" },
              { title: "3D & Motion", desc: "Blender, Animation, Visuals" },
              { title: "Creative Direction", desc: "Konzept, Storytelling, Regie" }
            ].map((service, i) => (
              <div key={i} className="border-t border-current py-8 group hover:pl-4 transition-all duration-300 cursor-default">
                <div className="flex flex-col md:flex-row justify-between items-baseline">
                  {/* B) Service Headline: font-rubik */}
                  <h3 className="text-3xl md:text-5xl font-rubik font-bold uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-gray-500 to-current">
                      <span className="glitch-hover cursor-default block">{service.title}</span>
                  </h3>
                  <p className="mt-2 md:mt-0 font-mono text-sm opacity-60 group-hover:opacity-100">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
            <div className="border-t border-current"></div>
          </div>
        </div>
    </section>
  </>
  );
};

const ServicesView = ({ darkMode }) => {
  return (
    <div className="pt-32 px-6 min-h-screen max-w-7xl mx-auto pb-40">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        {/* A) Page Headline: font-rubik */}
        <h1 className="text-[12vw] md:text-9xl font-rubik font-bold w-full break-words uppercase">
            <span className="glitch-hover cursor-default block">NETWORK_</span>
        </h1>
        <p className="font-mono text-sm opacity-60 text-right max-w-xs mt-4 md:mt-0">
          Interconnected disciplines forming a holistic design system.
        </p>
      </div>
      
      {/* Moved Text Grid ABOVE the Network Visualization to fix overlap and hierarchy */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 opacity-80 font-mono text-xs uppercase">
         <div>
            <h4 className="border-b border-current pb-2 mb-2 font-bold">3D & Product</h4>
            <ul><li>Cinema 4D</li><li>Blender</li><li>Fusion 360</li><li>Prototyping</li></ul>
         </div>
         <div>
            <h4 className="border-b border-current pb-2 mb-2 font-bold">Code & Tech</h4>
            <ul><li>Xcode</li><li>TouchDesigner</li><li>React / WebGL</li></ul>
         </div>
         <div>
            <h4 className="border-b border-current pb-2 mb-2 font-bold">Visual</h4>
            <ul><li>Communication Design</li><li>Graphic Design</li><li>Adobe Suite</li><li>Affinity Suite</li></ul>
         </div>
         <div>
            <h4 className="border-b border-current pb-2 mb-2 font-bold">Narrative</h4>
            <ul><li>Worldbuilding</li><li>Storytelling</li><li>Concept</li></ul>
         </div>
      </div>

      <SkillNetwork darkMode={darkMode} />
    </div>
  );
};
const AboutView = ({ darkMode }) => (
  <div className="pt-32 px-6 min-h-screen max-w-7xl mx-auto pb-40">
      {/* HEADER OUTSIDE THE GRID - Ensures perfect vertical alignment of content */}
    <div className="mb-12">
        {/* A) Page Headline: font-rubik */}
        <h1 className="text-[15vw] md:text-9xl font-rubik font-bold leading-none break-words uppercase">
            <span className="glitch-hover cursor-default block">ABOUT</span>
        </h1>
        {/* B) Section Headline: font-rubik */}
        <h2 className="text-3xl md:text-5xl font-rubik italic font-bold mt-2 opacity-80">
            <span className="glitch-hover cursor-default block">Joel van Hees</span>
        </h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
      {/* LEFT: IMAGE */}
      <div>
        <div className={`aspect-[3/4] w-full max-w-md rounded-2xl overflow-hidden relative transition-all duration-700 ${darkMode ? 'bg-[#111]' : 'bg-[#ccc]'}`}>
           {/* Portrait Image */}
           <img src={portraitImg} alt="Joel van Hees" className="w-full h-full object-cover" />
        </div>
      </div>
      
      {/* RIGHT: TEXT - Now aligned to the top of the image */}
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
             <span className="font-syne font-bold">CONTACT@JOELVANHEES.DE</span>
           </div>
        </div>
      </div>
    </div>
  </div>
);

const ContactView = ({ darkMode }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, sending, success

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');

        // Simulate a brief loading state for UX
        setTimeout(() => {
            const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
            const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
            
            // Construct mailto link
            const mailtoLink = `mailto:contact@joelvanhees.de?subject=${subject}&body=${body}`;
            
            // Trigger mail client
            window.location.href = mailtoLink;
            
            // Set success state
            setStatus('success');
            
            // Reset form after a delay
            setTimeout(() => {
                setStatus('idle');
                setFormData({ name: '', email: '', message: '' });
            }, 3000);
        }, 1500);
    };

  return (
    <div className="pt-32 px-6 min-h-screen max-w-7xl mx-auto flex items-center justify-center pb-40">
      <div className={`w-full max-w-2xl backdrop-blur-xl rounded-3xl p-8 md:p-12 border shadow-2xl relative overflow-hidden group transition-all duration-500
        ${darkMode 
          ? 'bg-white/5 border-white/10 text-white shadow-[0_0_50px_rgba(0,255,65,0.1)]' 
          : 'bg-white/60 border-white/40 text-black shadow-[0_0_50px_rgba(0,85,255,0.1)]'
        }`}
      >
        {/* Decorative Glare */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          {/* B) Section Headline: font-rubik */}
          <h2 className="text-4xl md:text-5xl font-rubik font-bold mb-2 uppercase">
              <span className="glitch-hover cursor-default block">INITIATE UPLINK</span>
          </h2>
          <p className="font-mono text-sm opacity-60 mb-12">Send a signal. I will respond.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="group/input relative">
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder=" " 
                className={`peer w-full bg-transparent border-b-2 outline-none py-2 font-syne text-xl transition-all ${darkMode ? 'border-white/20 focus:border-green-500' : 'border-black/20 focus:border-blue-500'}`} 
              />
              <label className={`absolute left-0 top-2 font-mono text-xs uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm ${darkMode ? 'text-white/50' : 'text-black/50'}`}>Identity / Name</label>
            </div>

            <div className="group/input relative">
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder=" " 
                className={`peer w-full bg-transparent border-b-2 outline-none py-2 font-syne text-xl transition-all ${darkMode ? 'border-white/20 focus:border-green-500' : 'border-black/20 focus:border-blue-500'}`} 
              />
              <label className={`absolute left-0 top-2 font-mono text-xs uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm ${darkMode ? 'text-white/50' : 'text-black/50'}`}>Frequency / Email</label>
            </div>

            <div className="group/input relative">
              <textarea 
                name="message"
                rows={4} 
                value={formData.message}
                onChange={handleChange}
                required
                placeholder=" " 
                className={`peer w-full bg-transparent border-b-2 outline-none py-2 font-mono text-sm resize-none transition-all ${darkMode ? 'border-white/20 focus:border-green-500' : 'border-black/20 focus:border-blue-500'}`}
              ></textarea>
              <label className={`absolute left-0 top-2 font-mono text-xs uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm ${darkMode ? 'text-white/50' : 'text-black/50'}`}>Transmission Data</label>
            </div>

            <button 
                type="submit" 
                disabled={status === 'sending' || status === 'success'}
                className={`w-full py-6 rounded-xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02] flex items-center justify-center gap-2 mt-8 
                  ${status === 'success' 
                    ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                    : (darkMode ? 'bg-[#00FF41] text-black hover:bg-[#00cc33] shadow-[0_0_20px_rgba(0,255,65,0.4)]' : 'bg-[#0055FF] text-white hover:bg-[#0044cc] shadow-[0_0_20px_rgba(0,85,255,0.4)]')
                  }
                  ${status === 'sending' ? 'opacity-70 cursor-wait' : ''}
                `}
            >
              {status === 'sending' ? (
                  <>TRANSMITTING... <Loader className="animate-spin" size={18}/></>
              ) : status === 'success' ? (
                  <>SIGNAL SENT <CheckCircle size={18}/></>
              ) : (
                  <>SEND SIGNAL <Send size={18} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activePage, setActivePage] = useState('home'); 
  const [legalOpen, setLegalOpen] = useState(false); // State for Impressum/Datenschutz Modal
  const [showVideoSequence, setShowVideoSequence] = useState(false); // VIDEO STATE FOR PROJECT 02
  const [activeImage, setActiveImage] = useState(null); // LIGHTBOX STATE
  
  // PDF OVERLAY STATE
  const [activePdf, setActivePdf] = useState(null);

  // Use useMemo to prevent recreation of project list on every render
  // UPDATED ORDER AND TEXT AS REQUESTED
  const projects = useMemo(() => [
    {
      id: "02",
      category: "TYPE / TECH / SYSTEM",
      title: "spiral down time",
      description: "A real-time generative time system turning seconds into spatial typography. Modular, adaptive and rendered live.",
      longDescription: "Spiral Down Time explores time as a spatial and typographic system rather than a linear unit. Built with JavaScript and WebGL, the project visualizes hours, minutes and seconds as an evolving generative structure. The system reacts live, creating a continuously transforming interface that combines typography, motion and code into one coherent visual language.",
      tech: ["JavaScript", "Three.js", "WebGL", "Generative Typography"],
      visualComponent: null, // RENDERED DYNAMICALLY IN MODAL TO FIX 3D FREEZE
      link: "#",
      extraVisuals: true,
      featured: true,
      exhibitions: [
        "Mid Term Exhibition @ KISD Cologne",
        "AUSSTEHEND: EMAF 2026, New Mexico"
      ]
    },
    {
      id: "01",
      category: "BRAND / VISUAL CONTENT",
      title: "Brand Collaboration", // Updated title for clarity
      description: "Built a viral social media brand from scratch (10M+ Likes), maintaining full creative control. Partnered with industry leaders like IKEA, Brita, and Govee to deliver authentic, high-impact campaigns.",
      longDescription: "", // Not used directly for project 01, custom render logic instead
      tech: ["Creative Direction", "Visual Concept", "Editing", "Social Formats"],
      visualComponent: <Video size={64} className="opacity-50" />,
      link: "#",
      featured: true,
      brandLinks: [
          { label: "TikTok: @salatschuessel_", url: "https://www.tiktok.com/@salatschuessel_?_r=1&_t=ZG-937qLOmgxsn" },
          { label: "Instagram: @salatschuessel_", url: "https://www.instagram.com/salatschuessel_?igsh=MWZyNnhicGM2ZWkxdA==" }
      ],
      extraImages: false // Custom handled
    },
    {
      id: "00",
      category: "WEB / SPATIAL / INTERACTION",
      title: "Web Design as Spatial Experience",
      // SHORTENED TEXT HERE:
      description: "A portfolio that acts as a design practice itself. Merging layout, motion, and 3D into a seamless spatial experience.",
      longDescription: "This website treats the browser as a spatial environment rather than a static page. Every scroll interaction and transition was built from scratch to merge structure with movement.\n\nDeveloped alongside a client project for a professional artist, this work focuses on translating content into immersive digital experiences using Webflow, Spline, and custom code.",
      tech: ["Webflow", "Spline", "Three.js", "Concept"],
      visualComponent: <img src={previewWebImg} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Web Design Preview" />,
      link: "#",
      featured: true,
      hasPdf: true, // Special Flag for PDF Button
      pdfUrl: pdfFile // Reference to imported PDF
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
        "Superheroes Exhibition @ NRW-Forum Düsseldorf / Next Museum"
      ]
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
      featured: true
    },
    {
      id: "06",
      category: "CONCEPT / 3D / BRAND",
      // CHANGE 1: TITLE CHANGED
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
      featured: true
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
      featured: true
    }
  ], [darkMode, setActiveImage]);

  // Reset scroll on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleNav = (page) => {
    setActivePage(page);
    setMenuOpen(false);
  };

  return (
    <div className={`min-h-screen w-full relative transition-colors duration-700 ease-in-out font-mono selection:bg-green-500 selection:text-black overflow-x-hidden ${darkMode ? 'bg-[#050505] text-[#E0E0E0]' : 'bg-[#F0F0F0] text-[#111]'}`}>
      
      {/* ... styles ... */}
      <style>{`
        @font-face {
          font-family: 'Rubik80sFade';
          src: url('/fonts/Rubik80sFade-Regular.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;700;800&display=swap');
        
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-rubik { font-family: 'Rubik80sFade', 'Syne', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
        .glitch-hover:hover {
          animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
          color: ${darkMode ? '#00FF41' : '#0055FF'};
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${darkMode ? '#111' : '#ddd'}; }
        ::-webkit-scrollbar-thumb { background: ${darkMode ? '#333' : '#999'}; }
        ::-webkit-scrollbar-thumb:hover { background: ${darkMode ? '#00FF41' : '#0055FF'}; }
      `}</style>
      
      {/* GLOBAL BACKGROUND GRID - Now visible on ALL pages for consistency */}
      <div className={`fixed inset-0 pointer-events-none opacity-[0.03] z-0 ${darkMode ? 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]' : 'bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] bg-[size:24px_24px]'}`}></div>

      <div 
        className={`fixed top-0 left-0 h-1 z-50 transition-all duration-100 ${darkMode ? 'bg-[#00FF41]' : 'bg-[#0055FF]'}`}
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <nav className="fixed w-full z-40 px-6 py-6 flex justify-between items-center mix-blend-difference text-white">
        <div 
          onClick={() => handleNav('home')}
          className="text-xl font-bold tracking-tighter hover:opacity-70 cursor-pointer"
        >
          JOEL VAN HEES <span className="text-xs opacity-50 ml-2 hidden md:inline-block">[ARCHITECT_NODE]</span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="hidden md:flex items-center gap-2 text-xs border border-white/20 px-3 py-1 rounded-full hover:bg-white hover:text-black transition-all"
          >
            {darkMode ? <div className="w-2 h-2 rounded-full bg-[#00FF41]" /> : <div className="w-2 h-2 rounded-full bg-[#0055FF]" />}
            {darkMode ? 'SYSTEM: DARK' : 'SYSTEM: LIGHT'}
          </button>

          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className={`fixed inset-0 z-30 flex flex-col justify-center items-center gap-8 text-4xl md:text-6xl font-syne font-bold ${darkMode ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-xl`}>
          {['HOME', 'WORK', 'SERVICES', 'ABOUT', 'CONTACT'].map((item, i) => (
            <button 
              key={item} 
              onClick={() => handleNav(item.toLowerCase())} 
              className={`hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ${activePage === item.toLowerCase() ? (darkMode ? 'text-[#00FF41]' : 'text-[#0055FF]') : ''}`}
            >
              {`0${i} // ${item}`}
            </button>
          ))}
        </div>
      )}

      {/* PAGE ROUTING */}
      {/* --- FIX: PASS SELECTED PROJECT TO HOME VIEW --- */}
      {activePage === 'home' && <HomeView darkMode={darkMode} projects={projects} setSelectedProject={setSelectedProject} selectedProject={selectedProject} />}
      {activePage === 'work' && <WorkView darkMode={darkMode} />}
      {activePage === 'services' && <ServicesView darkMode={darkMode} />}
      {activePage === 'about' && <AboutView darkMode={darkMode} />}
      {activePage === 'contact' && <ContactView darkMode={darkMode} />}

      {/* IMPRESSUM / DATENSCHUTZ MODAL */}
      {legalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-12">
            <div 
                className="absolute inset-0 backdrop-blur-xl bg-black/40 transition-all duration-500" 
                onClick={() => setLegalOpen(false)}
            ></div>
            
            <div className={`relative w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-3xl border shadow-2xl p-8 md:p-12 transition-all duration-300 animate-in fade-in zoom-in-95
                ${darkMode 
                ? 'bg-[#050505] border-white/10 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]' 
                : 'bg-white border-white/40 text-black shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]'
                }`}
            >
                <div className="flex justify-between items-start mb-8 border-b border-current pb-4">
                    <h2 className="text-3xl font-syne font-bold">LEGAL DATA</h2>
                    <button onClick={() => setLegalOpen(false)} className="p-2 hover:opacity-50"><X size={24} /></button>
                </div>
                
                <div className="font-mono text-sm space-y-8 leading-relaxed opacity-80">
                    <section>
                        <h3 className="text-xl font-bold mb-4 uppercase">Impressum</h3>
                        <p className="mb-2">Angaben gemäß § 5 TMG</p>
                        <p>
                            Joel van Hees<br/>
                            [Musterstraße 1] (HIER ADRESSE EINFÜGEN)<br/>
                            [509] [Musterstadt] (HIER PLZ/ORT EINFÜGEN)<br/>
                            Deutschland
                        </p>
                        
                        <p className="mt-4">
                            <strong>Kontakt:</strong><br/>
                            E-Mail: contact@joelvanhees.de
                        </p>

                        <p className="mt-4">
                            <strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong><br/>
                            Joel van Hees<br/>
                            [Adresse wie oben]
                        </p>

                        <p className="mt-4">
                            <strong>Haftungsausschluss:</strong><br/>
                            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
                        </p>
                    </section>

                    <section className="border-t border-current pt-8">
                        <h3 className="text-xl font-bold mb-4 uppercase">Datenschutzerklärung</h3>
                        
                        <h4 className="font-bold mt-4">1. Datenschutz auf einen Blick</h4>
                        <p>
                            <strong>Allgemeine Hinweise:</strong> Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                        </p>
                        <p className="mt-2">
                            <strong>Datenerfassung auf dieser Website:</strong> Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                        </p>

                        <h4 className="font-bold mt-4">2. Hosting</h4>
                        <p>
                            Wir hosten die Inhalte unserer Website bei folgendem Anbieter (z.B. Vercel / Netlify). Der Anbieter erhebt Daten über Zugriffe auf die Seite und speichert diese als „Server-Logfiles“ ab. Diese Daten werden nicht mit anderen Datenquellen zusammengeführt.
                        </p>

                        <h4 className="font-bold mt-4">3. Allgemeine Hinweise und Pflichtinformationen</h4>
                        <p>
                            <strong>Datenschutz:</strong> Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                        </p>
                        <p className="mt-2">
                            <strong>Hinweis zur verantwortlichen Stelle:</strong><br/>
                            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br/>
                            Joel van Hees<br/>
                            [Adresse wie im Impressum]<br/>
                            E-Mail: contact@joelvanhees.de
                        </p>
                        <p className="mt-2">
                            <strong>Widerruf Ihrer Einwilligung zur Datenverarbeitung:</strong> Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per E-Mail an uns.
                        </p>
                        <p className="mt-2">
                            <strong>Beschwerderecht bei der zuständigen Aufsichtsbehörde:</strong> Im Falle von Verstößen gegen die DSGVO steht dem Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde zu.
                        </p>
                        <p className="mt-2">
                            <strong>Recht auf Datenübertragbarkeit:</strong> Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen.
                        </p>

                        <h4 className="font-bold mt-4">4. Datenerfassung auf dieser Website</h4>
                        <p>
                            <strong>Kontaktanfragen:</strong> Wenn Sie uns per E-Mail kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                        </p>
                    </section>
                </div>
            </div>
        </div>
      )}

      {/* GLOBAL PROJECT MODAL (Accessible from anywhere) */}
      {selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12">
          <div 
            className="absolute inset-0 backdrop-blur-xl bg-black/40 transition-all duration-500" 
            onClick={() => { setSelectedProject(null); setShowVideoSequence(false); }}
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
                  {/* B) Project Headline in Modal: font-rubik */}
                  <h2 className={`text-3xl md:text-5xl font-rubik font-bold leading-none mt-2 ${selectedProject.id === "02" ? "lowercase" : "uppercase"}`}>
                    <span className="glitch-hover cursor-default block">{selectedProject.title}</span>
                  </h2>
               </div>
               <button 
                 onClick={() => { setSelectedProject(null); setShowVideoSequence(false); }}
                 className="p-2 rounded-full hover:bg-white/10 transition-colors"
               >
                 <X size={32} />
               </button>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
               
               {/* Left Column: Visuals & Extra Images */}
               <div className="flex flex-col gap-6">
                 {/* Main Visual */}
                 <div className={`relative w-full overflow-hidden flex items-center justify-center rounded-2xl ${darkMode ? 'bg-black/50' : 'bg-white/50'} 
                    ${selectedProject.id === "01" ? "aspect-[9/16] max-w-sm mx-auto" : "aspect-square"}
                 `}>
                    {/* DYNAMIC RENDERING: Logic simplified to ensure no accidental opacity is applied */}
                    {selectedProject.id === "02" ? (
                        showVideoSequence ? (
                            <div className="w-full h-full relative bg-black group">
                                <video
                                  src="/videos/spiral_down_time_sequence.mp4"
                                  className="w-full h-full object-cover"
                                  controls
                                  autoPlay
                                  playsInline
                                />
                                <button
                                  onClick={() => setShowVideoSequence(false)}
                                  className="absolute top-4 left-4 z-50 bg-black/50 text-white px-4 py-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all flex items-center gap-2 text-xs font-mono"
                                >
                                  <ChevronRight className="rotate-180" size={14}/> RETURN_TO_SYSTEM
                                </button>
                            </div>
                        ) : (
                            <div className="w-full h-full relative">
                                <SpiralTimeSphere darkMode={darkMode} />
                                {/* --- BUTTON MOVED HERE FOR PROJECT 02 --- */}
                                <button
                                  onClick={(e) => {
                                     e.preventDefault();
                                     setShowVideoSequence(true);
                                  }}
                                  className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#00FF41] text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-[#00cc33] transition-all shadow-[0_0_20px_rgba(0,255,65,0.4)] flex items-center gap-2 text-sm"
                                >
                                  WATCH FILM SEQUENCE <Play size={16} />
                                </button>
                            </div>
                        )
                    ) : selectedProject.id === "06" ? (
                        // CHANGE 2: PEEL VIDEO IN MODAL
                        <div className="absolute inset-0 w-full h-full">
                           <HoverVideoPlayer src="/videos/peelvid.mp4" />
                        </div>
                    ) : selectedProject.id === "05" ? (
                        // ADAPTIVE VISUAL SYSTEMS / POSTER SERIES
                        <div className="absolute inset-0 w-full h-full">
                            <InfiniteMarqueeVisual />
                        </div>
                    ) : selectedProject.id === "01" ? (
                        // BRAND COLLABORATION PREVIEW: Video Only
                        <div className="absolute inset-0 w-full h-full">
                           <HoverVideoPlayer src="/videos/ikea_reel.mp4" />
                        </div>
                    ) : selectedProject.id === "04" ? (
                       // BRANDING SYSTEM PREVIEW: Logo VNC Animation
                       <div className="w-full h-full bg-black flex items-center justify-center">
                          <img src={logoVNC} className="w-full h-full object-contain" alt="VNC Identity" />
                       </div>
                    ) : selectedProject.id === "00" ? (
                        // NEW PROJECT 00: PURE 3:2 FORMAT, NO MASK
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
                    
                    {/* Overlay badges */}
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

                 {/* Extra Running Code Blocks (Only for Project 02: Spiral Down Time) */}
                 {selectedProject.extraVisuals && (
                   <>
                     {/* 2. TYPOGRAPHIC CLOCK */}
                     <div className="mt-4 aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black relative shadow-2xl">
                        <TypographicClockVisual darkMode={darkMode} />
                     </div>

                     {/* 3. BUFFER OVERFLOW */}
                     <div className="mt-4 aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black relative shadow-2xl">
                        <BufferOverflowVisual darkMode={darkMode} />
                        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white/50 bg-black/50 px-2 py-1 rounded">
                           [BUFFER_OVERFLOW.EXE] RUNNING...
                        </div>
                     </div>
                   </>
                 )}

                 {/* --- MOVED LEFT: Extra Images Project 02 (Spiral) --- */}
                 {selectedProject.id === "02" && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                       <div className={`aspect-[3/2] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                          <img src={imgRef01} alt="Concept Art" className="w-full h-full object-cover cursor-zoom-in" onClick={() => setActiveImage(imgRef01)} />
                       </div>
                       <div className={`aspect-[3/2] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                          <img src={imgRef02} alt="UI Mockup" className="w-full h-full object-cover cursor-zoom-in" onClick={() => setActiveImage(imgRef02)} />
                       </div>
                    </div>
                 )}

                 {/* --- MOVED LEFT: Extra Images Project 03 (NASALICA) --- */}
                 {selectedProject.id === "03" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {/* 1. Exhibition Photo (2:3) */}
                       <div className={`aspect-[2/3] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                          <img src={exhibitionInfImg} alt="Exhibition View" className="w-full h-full object-cover cursor-zoom-in" onClick={() => setActiveImage(exhibitionInfImg)} />
                       </div>
                       
                       <div className="flex flex-col gap-4">
                           {/* 2. Monster Artwork (3:2) */}
                           <div className={`aspect-[3/2] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                             <img src={monsterImg} alt="Monster Artwork" className="w-full h-full object-cover cursor-zoom-in" onClick={() => setActiveImage(monsterImg)} />
                           </div>
                           
                           {/* 3. Hidden Slot (Coming Soon) */}
                           <div className={`aspect-[3/2] w-full rounded-xl border flex items-center justify-center overflow-hidden relative ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                             <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                 <span className="font-mono text-xs uppercase tracking-widest opacity-50">COMING SOON</span>
                             </div>
                           </div>
                       </div>
                    </div>
                 )}

                 {/* --- MOVED LEFT: Extra Images Project 06 (Concept Vehicle / Peel P50) --- */}
                 {/* Updated Logic: Render all pairs vertically */}
                 {selectedProject.id === "06" && (
                    <div className="flex flex-col gap-4 mt-4">
                        {p50Data.pairs.map((pair, i) => (
                             <div key={i} className="grid grid-cols-2 gap-4">
                                <div className={`aspect-[3/4] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                                    <img src={pair.a} alt={`Student Concept ${i+1}A`} className="w-full h-full object-cover cursor-zoom-in" onClick={() => setActiveImage(pair.a)} />
                                </div>
                                <div className={`aspect-[3/4] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                                    <img src={pair.b} alt={`Student Concept ${i+1}B`} className="w-full h-full object-cover cursor-zoom-in" onClick={() => setActiveImage(pair.b)} />
                                </div>
                             </div>
                        ))}
                    </div>
                 )}

                 {/* --- MOVED LEFT: Extra Images Project 01 (Brand Collab) --- */}
                 {selectedProject.id === "01" && (
                    <div className="flex flex-col gap-4 mt-4">
                        {/* PHONE IMAGE AT TOP LEFT OF OVERLAY CONTENT */}
                       <div className={`aspect-[2/3] w-full max-w-sm mx-auto rounded-xl border flex items-center justify-center overflow-hidden relative group ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                          <img src={salatProfileImg} className="w-full h-full object-cover cursor-zoom-in" alt="Profile View" onClick={() => setActiveImage(salatProfileImg)} />
                       </div>

                       {/* --- EDITED: REMOVED DUPLICATE VIDEO FEED & UPDATED MERCH IMAGES TO VERTICAL --- */}
                       <div className="grid grid-cols-2 gap-4">
                           <div className={`aspect-[2/3] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                             {/* REMOVED OPACITY WRAPPER HERE */}
                             <img src={ikeaMerch1} className="w-full h-full object-cover cursor-zoom-in" alt="Plush Toy Design" onClick={() => setActiveImage(ikeaMerch1)} />
                           </div>
                           <div className={`aspect-[2/3] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                             {/* REMOVED OPACITY WRAPPER HERE */}
                             <img src={ikeaMerch2} className="w-full h-full object-cover cursor-zoom-in" alt="Plush Toy Final" onClick={() => setActiveImage(ikeaMerch2)} />
                           </div>
                       </div>
                    </div>
                 )}

                 {/* --- PDF BUTTON MOVED HERE (LEFT COLUMN) FOR PROJECT 00 --- */}
                 {selectedProject.id === "00" && selectedProject.hasPdf && (
                    <button 
                      onClick={() => setActivePdf(selectedProject.pdfUrl)}
                      className={`group flex items-center gap-4 text-left p-4 rounded-xl transition-all w-full border ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10'}`}
                    >
                        <div className="p-3 bg-red-500/10 text-red-500 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
                           <FileText size={24} />
                        </div>
                        <div>
                           <div className="font-bold uppercase text-sm">Designing a Website</div>
                           <div className="text-xs opacity-60 font-mono">Concept & Documentation</div>
                        </div>
                        <ArrowUpRight className="ml-auto opacity-50 group-hover:opacity-100" size={16} />
                    </button>
                 )}
               </div>

               {/* Right Column: Text & Content */}
               <div className="flex flex-col gap-8">
                 {/* --- NEW: BRAND LINKS SECTION (MOVED UP) --- */}
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

                 {/* --- CUSTOM LAYOUT FOR IKEA (ID 01) --- */}
                 {selectedProject.id === "01" ? (
                   <div className="space-y-12 mt-4">
                       <div>
                         {/* LOGOS INSIDE OVERLAY */}
                         <div className="flex gap-6 mb-8 items-center border-b border-white/10 pb-8">
                            <img src={ikeaLogo} alt="IKEA" className="h-8 w-auto object-contain" />
                            <img src={britaLogo} alt="Brita" className="h-8 w-auto object-contain" />
                            <img src={goveeLogo} alt="Govee" className="h-8 w-auto object-contain" />
                         </div>

                         {/* B) Section Headline in Modal: font-rubik */}
                         <h3 className="text-xl font-rubik font-bold mb-4 uppercase text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Social Media</h3>
                         <p className="text-lg font-light leading-relaxed">
                           Created artistic, experimental video content centered around the 'Salatschüssel' persona. This strategic content creation grew the channel to ~400k followers and generated over 10 million likes, establishing a massive organic reach.
                         </p>
                       </div>

                       <div>
                         {/* B) Section Headline in Modal: font-rubik */}
                         <h3 className="text-xl font-rubik font-bold mb-4 uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-yellow-400">Campaign</h3>
                         <p className="text-lg font-light leading-relaxed mb-6">
                           Directed and produced the official advertising video for IKEA Deutschland. The focus was on translating the brand's message into a format that resonates with a digital-native audience.
                         </p>
                         
                         {/* --- REQUESTED INSERTION: 3D SIGNAGE IMAGES & TEXT --- */}
                         <div className="flex flex-col gap-4 mb-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`aspect-square w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                                    <img src={threedSign1} className="w-full h-full object-cover cursor-zoom-in" alt="3D Signage Process 1" onClick={() => setActiveImage(threedSign1)} />
                                </div>
                                <div className={`aspect-square w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                                    <img src={threedSign2} className="w-full h-full object-cover cursor-zoom-in" alt="3D Signage Process 2" onClick={() => setActiveImage(threedSign2)} />
                                </div>
                            </div>
                            <p className="font-mono text-xs opacity-60 leading-relaxed">
                                “Custom 3D signage designed in Fusion 360, produced via in-house 3D printing and used as physical set elements for the IKEA video production.”
                            </p>
                         </div>
                       </div>

                       <div>
                         {/* B) Section Headline in Modal: font-rubik */}
                         <h3 className="text-xl font-rubik font-bold mb-4 uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Merchandise</h3>
                         <p className="text-lg font-light leading-relaxed mb-6">
                           Designed and produced the official 'Salatschüssel' plush toy as a physical extension of the digital brand. The process involved 3D character design, prototyping, and final production oversight.
                         </p>
                       </div>
                   </div>
                 ) : selectedProject.id === "04" ? (
                   // --- BRANDING SYSTEMS LAYOUT (ID 04) ---
                   <div className="space-y-16 mt-8">
                       {/* 1. Pride Kunst */}
                       <div>
                       {/* B) Section Headline in Modal: font-rubik */}
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

                       {/* 2. Yerba Mate */}
                       <div>
                       {/* B) Section Headline in Modal: font-rubik */}
                       <h3 className="text-xl font-rubik font-bold mb-4 uppercase">Yerba Mate</h3>
                       <p className="mb-4 text-sm opacity-80">Packaging design in team context. Responsible for illustration system and visual language.</p>
                       <div className="grid grid-cols-3 gap-2">
                           <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5"><img src={mate1} className="w-full h-auto object-contain" /></div>
                           <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5"><img src={mate2} className="w-full h-auto object-contain" /></div>
                           <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5"><img src={mate3} className="w-full h-auto object-contain" /></div>
                       </div>
                       </div>

                       {/* 3. Sugar Damage */}
                       <div>
                       {/* B) Section Headline in Modal: font-rubik */}
                       <h3 className="text-xl font-rubik font-bold mb-4 uppercase">Sugar Damage</h3>
                       <p className="mb-4 text-sm opacity-80">Visual identity for pop band Sugar Damage. Logo, album artwork and animated streaming canvas.</p>
                       <div className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                               <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5"><img src={sugarLogo} className="w-full h-auto object-contain" /></div>
                               <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5"><img src={sugarCover} className="w-full h-auto object-contain" /></div>
                           </div>
                           <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5">
                                   <video src="src/assets/branding/sugar-damage/spotify.mp4" className="w-full h-auto" autoPlay loop muted playsInline />
                           </div>
                       </div>
                       </div>

                       {/* 4. Selected Logos */}
                       <div>
                           {/* B) Section Headline in Modal: font-rubik */}
                           <h3 className="text-xl font-rubik font-bold mb-4 uppercase">Selected Logos</h3>
                           <p className="mb-4 text-sm opacity-80">Selected logo designs for artists and creatives.</p>
                           <div className="grid grid-cols-3 gap-4">
                               {/* Joel */}
                               <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5"><img src={logoJoel} className="w-full h-auto object-contain" /></div>
                               
                               {/* VNC - DUPLICATE */}
                               <div className="flex flex-col items-end">
                                   <div className="rounded-xl overflow-hidden border border-white/10 bg-black/5 w-full">
                                        <img src={logoVNC} className="w-full h-auto object-contain" />
                                   </div>
                                   <span className="font-mono text-[10px] opacity-50 mt-1 uppercase">VNC_SYSTEM</span>
                               </div>

                               {/* Michael - MOVED & STYLED */}
                               <div className="rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                                   <img src={logoMichael} className="w-full h-auto object-contain" />
                               </div>
                           </div>
                       </div>

                       {/* 5. Soft Body Home */}
                       <div>
                       {/* B) Section Headline in Modal: font-rubik */}
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
                   // --- STANDARD LAYOUT FOR OTHER PROJECTS ---
                   <div>
                       <h3 className="text-sm font-mono uppercase tracking-widest opacity-50 mb-4">Briefing</h3>
                       <p className="text-lg md:text-xl leading-relaxed font-light whitespace-pre-line">
                         {selectedProject.longDescription || selectedProject.description}
                       </p>
                       
                       {/* --- SPECIAL PDF DOWNLOAD BUTTON FOR PROJECT 00 --- */}
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

                       {/* --- CUSTOM RIGHT COLUMN FOR PEEL P50 (ID 06) --- */}
                       {selectedProject.id === "06" && (
                          <div className="mt-12 space-y-12">
                              {/* The Interface */}
                              <div>
                                  <h3 className="text-xl font-rubik font-bold mb-4 uppercase">The Interface</h3>
                                  <p className="mb-4 text-sm opacity-80">The blank posters served as an open invitation for student participation.</p>
                                  <div className="grid grid-cols-2 gap-4">
                                      {p50Data.blanks.map((img, idx) => (
                                          <div key={idx} className={`aspect-[3/4] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                                              <img src={img} alt={`Blank Poster ${idx+1}`} className="w-full h-full object-cover cursor-zoom-in" onClick={() => setActiveImage(img)} />
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              {/* Context / Outdoor */}
                              <div>
                                  <h3 className="text-xl font-rubik font-bold mb-4 uppercase">Context</h3>
                                  <p className="mb-4 text-sm opacity-80">Posters distributed within the university environment.</p>
                                  <div className="grid grid-cols-3 gap-2">
                                      {p50Data.outdoor.map((img, idx) => (
                                          <div key={idx} className={`aspect-[9/16] w-full rounded-xl border flex items-center justify-center overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                                              <img src={img} alt={`Outdoor Context ${idx+1}`} className="w-full h-full object-cover cursor-zoom-in" onClick={() => setActiveImage(img)} />
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                       )}
                   </div>
                 )}
                 
                 {/* --- EXHIBITIONS SECTION --- */}
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
                    <a 
                      href={selectedProject.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${darkMode ? 'bg-[#00FF41] text-black hover:bg-[#00cc33]' : 'bg-[#0055FF] text-white hover:bg-[#0044cc]'}`}
                      // Remove onClick handler here for Project 02, as the button is now in the left column
                      style={{ display: selectedProject.id === "02" ? 'none' : 'flex' }}
                    >
                        {selectedProject.id === "02" ? (
                          <>WATCH FILM SEQUENCE <Play size={18} /></>
                        ) : (
                          <>Launch Project <ArrowUpRight size={18} /></>
                        )}
                    </a>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* --- LIGHTBOX OVERLAY --- */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all animate-in fade-in duration-300 cursor-zoom-out"
          onClick={() => setActiveImage(null)}
        >
          <button 
            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setActiveImage(null); }}
          >
            <X size={32} />
          </button>
          <img 
            src={activeImage} 
            alt="Fullscreen view" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      {/* --- PDF OVERLAY --- */}
      {activePdf && (
        <div 
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setActivePdf(null)}
        >
           <button 
             className="absolute top-4 right-4 p-2 text-white hover:text-red-500 transition-colors z-50 bg-black rounded-full border border-white/20"
             onClick={(e) => { e.stopPropagation(); setActivePdf(null); }}
           >
             <X size={32} />
           </button>
           <iframe 
             src={activePdf} 
             className="w-full h-full rounded-xl bg-white shadow-2xl"
             title="PDF Preview"
             onClick={(e) => e.stopPropagation()}
           ></iframe>
        </div>
      )}

      {/* GLOBAL FOOTER (Always visible) */}
      <footer id="contact" className={`py-24 px-6 ${darkMode ? 'bg-[#00FF41] text-black' : 'bg-[#0055FF] text-white'}`}>
        <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[50vh]">
          <div>
            {/* A) Page Headline in Footer: font-rubik */}
            <h2 className="text-6xl md:text-9xl font-rubik font-bold tracking-tighter leading-none mb-8">
              LET'S <br/> BUILD.
            </h2>
            <button onClick={() => handleNav('contact')} className="text-xl md:text-2xl font-mono underline decoration-2 underline-offset-4 hover:no-underline">
              contact@joelvanhees.de
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-8 font-mono text-sm uppercase">
            <div className="flex gap-4">
               <a href="https://www.instagram.com/joelvanhees?igsh=cG91ZjEzYnh5azAx&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:line-through">Instagram</a>
            </div>
            <div className="text-right">
              <p>© {new Date().getFullYear()} Joel van Hees</p>
              <button onClick={() => setLegalOpen(true)} className="mt-4 text-[10px] opacity-60 hover:opacity-100 hover:underline">
                  IMPRESSUM / DATENSCHUTZ
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;