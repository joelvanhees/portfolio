import { useEffect, useRef, useState } from 'react';
import { X, Trophy, Zap, Play, Lock, Heart, RefreshCw } from 'lucide-react';
import * as THREE from 'three';
import { playClickSound } from '../utils/clickSound';

// --- GAME PARAMETERS ---
const OUTER_RADIUS = 1.0;
const INNER_RADIUS = 0.45;
const LANES = [-3.5, 0, 3.5]; // Left, Center, Right
const TRACK_Y = -1.6;
const BLOB_START_Y = TRACK_Y + OUTER_RADIUS; // Standing position

// Physics
const GRAVITY = -48.0;
const JUMP_FORCE = 16.5;

// Procedural environment map helper (Instant loading, 100% robust, zero network requests!)
const createProceduralEnvMap = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  
  // Base dark cyber gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, '#001a08'); // Dark emerald top
  grad.addColorStop(0.5, '#02020a'); // Dark indigo middle
  grad.addColorStop(1, '#000000'); // Pure black bottom
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);
  
  // Neon cyber reflection lights
  ctx.fillStyle = '#00ff41'; // Cyan-green neon tube
  ctx.fillRect(30, 20, 20, 88);
  
  ctx.fillStyle = '#0055ff'; // Electric blue neon tube
  ctx.fillRect(170, 30, 28, 68);
  
  ctx.fillStyle = '#ff007f'; // Hot pink cyber core
  ctx.beginPath();
  ctx.arc(100, 50, 14, 0, Math.PI * 2);
  ctx.fill();

  // Subtle grid lines in reflection
  ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 256; x += 32) {
    ctx.strokeRect(x, 0, 1, 128);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const GameView = ({ darkMode, onClose }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // React Game states
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [selectedColor, setSelectedColor] = useState('green'); // 'green', 'yellow', 'pink', 'blue'
  const [unlockedYellow, setUnlockedYellow] = useState(false);
  const [unlockedPink, setUnlockedPink] = useState(false);
  const [unlockedBlue, setUnlockedBlue] = useState(false);
  const [crystalsCollected, setCrystalsCollected] = useState(0);

  // Sync state refs to let High-Performance loop read them immediately
  const stateRef = useRef({
    isPlaying: false,
    gameOver: false,
    score: 0,
    level: 1,
    lives: 3,
    invulnerableTime: 0,
    activeColor: 'green',
    currentLane: 1, // 0 = Left, 1 = Center, 2 = Right
    jumpY: 0,
    verticalVelocity: 0,
    isJumping: false,
    speed: 35.0,
    lastObstacleSpawn: 0,
    lastCrystalSpawn: 0,
    unlockedYellow: false,
    unlockedPink: false,
    unlockedBlue: false,
    crystalsCollected: 0
  });

  const scoreRef = useRef(null);
  const levelRef = useRef(null);
  const bgMusicRef = useRef(null);
  const audioCtxRef = useRef(null);
  const trackMaterialRef = useRef(null);
  const barrierMaterialRef = useRef(null);
  const gridColorUniform = useRef({ value: new THREE.Color(0.0, 1.0, 0.25) });

  // Fetch local High Score on Mount
  useEffect(() => {
    const saved = localStorage.getItem('vanhees_runner_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
    
    // Play custom uploaded loop music "Orbital Drift Run.mp3"
    bgMusicRef.current = new Audio('/Orbital%20Drift%20Run.mp3');
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.4;
    
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (bgMusicRef.current) {
      if (isPlaying && !gameOver) {
        bgMusicRef.current.play().catch(e => console.log('Audio play failed', e));
      } else {
        bgMusicRef.current.pause();
      }
    }
  }, [isPlaying, gameOver]);

  // Sync selectedColor
  useEffect(() => {
    stateRef.current.activeColor = selectedColor;
  }, [selectedColor]);

  // Audio synthesis engine for latency-free chiptunes
  const playSynthSound = (type) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'jump') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.14);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.26);
      } else if (type === 'collect') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(698.46, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
        osc.start();
        osc.stop(ctx.currentTime + 0.29);
      } else if (type === 'gameover') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.7);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
        osc.start();
        osc.stop(ctx.currentTime + 0.71);
      }
    } catch (e) {
      // Browsers might block AudioContext
    }
  };

  // Three.js instances refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameId = useRef(null);

  // Shader Uniforms
  const timeUniform = useRef({ value: 0 });
  const velocityUniform = useRef({ value: 1.0 });

  // Game objects lists
  const obstacles = useRef([]); // { mesh, lane, z }
  const crystals = useRef([]); // { mesh, lane, z, seed }
  const obstacleGeom = useRef(null);
  const obstacleMat = useRef(null);
  const crystalGeom = useRef(null);
  const crystalMat = useRef(null);
  const innerBlobMaterial = useRef(null);

  // --- INITIALIZE THREE.JS RUNNER WORLD ---
  useEffect(() => {
    if (!canvasRef.current) return;

    const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.Fog(0x050505, 30, 100);
    sceneRef.current = scene;

    // 2. Setup Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 150);
    camera.position.set(0, 5, 12);
    cameraRef.current = camera;

    // 3. Setup Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: "high-performance"
    });
    const updateSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    setTimeout(updateSize, 0);

    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;

    // 4. Lights
    const spotLight = new THREE.SpotLight(0xffffff, 2.5);
    spotLight.position.set(10, 25, 10);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.6;
    scene.add(spotLight);

    const pointLight = new THREE.PointLight(0xaaccff, 1.5, 70);
    pointLight.position.set(-10, 10, -5);
    scene.add(pointLight);

    const fillLight = new THREE.PointLight(0x00ff41, 0.8, 40); // Cyan/Green glow from bottom
    fillLight.position.set(0, -4, 2);
    scene.add(fillLight);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x000022, 0.35));

    // 5. Procedural Reflections Generator (Zero Network requests, zero lag!)
    try {
      const proceduralEnv = createProceduralEnvMap();
      scene.environment = proceduralEnv;
      scene.environment.blur = 0.4;
    } catch (err) {
      console.log("Procedural environment map generation failed", err);
    }

    // 6. Cyber grid space background
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 1000;
    const starsPositions = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      const radius = Math.random() * 90 + 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starsPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starsPositions[i+1] = radius * Math.sin(phi) * Math.sin(theta) + 10;
      starsPositions[i+2] = radius * Math.cos(phi);

      starsColors[i] = 0.0;
      starsColors[i+1] = 1.0; // Cyber green star points
      starsColors[i+2] = 0.4;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.32,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // 7. High-Performance Translucent Glass Track (No complex GPU transmission!)
    const trackGeometry = new THREE.PlaneGeometry(12, 140);
    const trackMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x051a08, // Deep emerald green
      metalness: 0.4,
      roughness: 0.15,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    trackMaterialRef.current = trackMaterial;

    // Inject scrolling grid coordinates safely at the end of compilation to support all drivers/GPUs
    trackMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = timeUniform.current;
      shader.uniforms.uGridColor = gridColorUniform.current;
      shader.vertexShader = `varying vec2 vScrollUV;\n` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <uv_vertex>',
        `
        #include <uv_vertex>
        vScrollUV = uv;
        `
      );
      shader.fragmentShader = `varying vec2 vScrollUV;\nuniform float uTime;\nuniform vec3 uGridColor;\n` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
        #include <dithering_fragment>
        // Custom grid calculation
        float scroll = vScrollUV.y * 35.0 - uTime * 7.5;
        float gridX = step(0.96, fract(vScrollUV.x * 24.0));
        float gridY = step(0.96, fract(scroll));
        float combinedGrid = max(gridX, gridY);
        
        // Apply wireframe glow grid lines
        gl_FragColor.rgb = mix(gl_FragColor.rgb, uGridColor, combinedGrid * 0.85);
        gl_FragColor.a = mix(0.12, 0.9, combinedGrid);
        `
      );
    };

    const track = new THREE.Mesh(trackGeometry, trackMaterial);
    track.rotation.x = -Math.PI / 2;
    track.position.set(0, TRACK_Y, -40);
    scene.add(track);

    // Lateral lane boundaries (Sleek glass barriers)
    const barrierGeo = new THREE.BoxGeometry(0.12, 0.4, 140);
    const barrierMat = new THREE.MeshBasicMaterial({
      color: 0x00ff41,
      transparent: true,
      opacity: 0.28
    });
    barrierMaterialRef.current = barrierMat;

    const leftBarrier = new THREE.Mesh(barrierGeo, barrierMat);
    leftBarrier.position.set(-6, TRACK_Y + 0.2, -40);
    scene.add(leftBarrier);

    const rightBarrier = new THREE.Mesh(barrierGeo, barrierMat);
    rightBarrier.position.set(6, TRACK_Y + 0.2, -40);
    scene.add(rightBarrier);

    // 8. --- HIGH-END PHYSICS NEON BLOB (Optimized materials for zero context crashes!) ---
    const segments = isMobile ? 32 : 48;
    const outerGeometry = new THREE.SphereGeometry(OUTER_RADIUS, segments, segments);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, 
      metalness: 0.05,
      roughness: 0.12,
      transmission: 1.0, 
      thickness: 2.0,
      ior: 1.5, 
      dispersion: 0.1,
      side: THREE.DoubleSide, 
      clearcoat: 1.0, 
      clearcoatRoughness: 0.1,
      transparent: true,
      envMapIntensity: 0.4,
      iridescence: 0.2,
      iridescenceIOR: 1.3, 
      iridescenceThicknessRange: [100, 400] 
    });

    // Dynamic Shader Deformation Injection
    const injectBlobShader = (shader, intensity, frequency, speed, isInner) => {
      shader.uniforms.uTime = timeUniform.current;
      shader.uniforms.uVel = velocityUniform.current;
      shader.vertexShader = `uniform float uTime; uniform float uVel;\n` + shader.vertexShader;

      const velocityLimit = isInner ? "min(uVel, 1.0)" : "min(uVel, 1.5)";

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        float velFactor = ${velocityLimit};
        float breathe = sin(uTime * ${speed.toFixed(1)}) * 0.012;
        float noise1 = sin(position.y * ${frequency.toFixed(1)} + uTime * ${speed.toFixed(1)});
        float noise2 = cos(position.x * ${(frequency * 0.9).toFixed(1)} + uTime * ${(speed * 1.1).toFixed(1)});
        float noise3 = sin(position.z * ${(frequency * 1.1).toFixed(1)} + uTime * ${(speed * 0.9).toFixed(1)});
        float amp = ${intensity.toFixed(3)} * (1.0 + velFactor * 0.25);
        float displacement = (noise1 + noise2 + noise3) * amp;
        transformed += objectNormal * (displacement + breathe);
        `
      );
    };

    glassMaterial.onBeforeCompile = (shader) => injectBlobShader(shader, 0.12, 2.0, 1.2, false);

    const outerSphere = new THREE.Mesh(outerGeometry, glassMaterial);

    const playerGroup = new THREE.Group();
    playerGroup.position.set(0, BLOB_START_Y, 0);
    playerGroup.add(outerSphere);
    scene.add(playerGroup);

    // Inner Core (Optimized emissive/transparent material)
    const innerGeometry = new THREE.SphereGeometry(INNER_RADIUS, segments, segments);
    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xccffcc,
      metalness: 0.2,
      roughness: 0.04,
      transmission: 0.9,
      thickness: 1.2,
      attenuationDistance: 0.8,
      ior: 1.4,
      side: THREE.DoubleSide,
      clearcoat: 1.0,
      emissive: 0x003311,
      emissiveIntensity: 0.2
    });

    liquidMaterial.onBeforeCompile = (shader) => injectBlobShader(shader, 0.065, 1.4, 1.5, true);
    const innerCore = new THREE.Mesh(innerGeometry, liquidMaterial);
    playerGroup.add(innerCore);

    // Save references to dynamically swap core material properties
    innerBlobMaterial.current = liquidMaterial;

    // 9. Shared Obstacles & Crystals Templates
    obstacleGeom.current = new THREE.BoxGeometry(2.0, 1.6, 1.2);
    obstacleMat.current = new THREE.MeshPhysicalMaterial({
      color: 0xff0000, // Vibrant neon red
      metalness: 0.1,
      roughness: 0.1,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.9,
      emissive: 0xff0000, // Glow neon red
      emissiveIntensity: 2.0
    });

    crystalGeom.current = new THREE.OctahedronGeometry(0.55, 0);
    crystalMat.current = new THREE.MeshPhysicalMaterial({
      color: 0xffea00, // Vibrant bright gold crystals
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.95,
      emissive: 0xffaa00, // Glow neon gold
      emissiveIntensity: 2.0
    });

    // 10. Handle window resizing
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Keyboard handlers
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleExit();
        return;
      }
      const state = stateRef.current;
      if (!state.isPlaying || state.gameOver) return;

      if (e.key === 'ArrowLeft' || e.key === 'a') {
        state.currentLane = Math.max(0, state.currentLane - 1);
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        state.currentLane = Math.min(2, state.currentLane + 1);
      }
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        triggerJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Mobile gesture tracking
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    const handlePointerDown = (e) => {
      touchStartX = e.clientX;
      touchStartY = e.clientY;
      touchStartTime = performance.now();
    };

    const handlePointerUp = (e) => {
      const state = stateRef.current;
      if (!state.isPlaying || state.gameOver) return;

      const deltaX = e.clientX - touchStartX;
      const deltaY = e.clientY - touchStartY;
      const duration = performance.now() - touchStartTime;

      if (duration < 280) {
        // Swipe Detection
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX < 0) {
            state.currentLane = Math.max(0, state.currentLane - 1); // Swipe left
          } else {
            state.currentLane = Math.min(2, state.currentLane + 1); // Swipe right
          }
        } else if (deltaY < -40 && Math.abs(deltaY) > Math.abs(deltaX)) {
          triggerJump(); // Swipe up
        } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
          triggerJump(); // Quick tap anywhere
        }
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // --- CONTINUOUS GAMEPLAY AND PREVIEW LOOP ---
    const clock = new THREE.Clock();

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();
      timeUniform.current.value = time;

      // Update shader deformation speed parameter dynamically
      velocityUniform.current.value = 1.0 + Math.sin(time * 2.0) * 0.4;

      // Twinkle background stars
      if (starField) {
        starField.rotation.y += 0.0001;
        starField.rotation.x += 0.00004;
      }

      // Live swap environment and grid colors (Blob stays green!)
      if (innerBlobMaterial.current) {
        innerBlobMaterial.current.color.setHex(0xccffcc);
        innerBlobMaterial.current.attenuationColor.setHex(0x00ff41);
        innerBlobMaterial.current.emissive.setHex(0x004411);
      }

      if (trackMaterialRef.current && barrierMaterialRef.current) {
        const envColorMap = {
          green: { base: 0x051a08, grid: [0.0, 1.0, 0.25], barrier: 0x00ff41 },
          yellow: { base: 0x1a1a00, grid: [1.0, 0.84, 0.0], barrier: 0xffea00 },
          pink: { base: 0x1a0010, grid: [1.0, 0.0, 0.5], barrier: 0xff007f },
          blue: { base: 0x00101a, grid: [0.0, 0.5, 1.0], barrier: 0x00a2ff }
        };
        const envConfig = envColorMap[stateRef.current.activeColor] || envColorMap.green;
        
        trackMaterialRef.current.color.setHex(envConfig.base);
        barrierMaterialRef.current.color.setHex(envConfig.barrier);
        
        if (gridColorUniform.current) {
          gridColorUniform.current.value.setRGB(envConfig.grid[0], envConfig.grid[1], envConfig.grid[2]);
        }
      }

      const state = stateRef.current;

      if (state.isPlaying && !state.gameOver) {
        // --- 1. ACTIVE RUNNER LOGIC ---

        // Invulnerable timer blink
        if (state.invulnerableTime > 0) {
          state.invulnerableTime -= dt;
          outerSphere.visible = Math.floor(time * 15) % 2 === 0;
          innerCore.visible = Math.floor(time * 15) % 2 === 0;
        } else {
          outerSphere.visible = true;
          innerCore.visible = true;
        }

        // Horizontal lane target sliding
        const targetX = LANES[state.currentLane];
        playerGroup.position.x = THREE.MathUtils.lerp(playerGroup.position.x, targetX, 10.0 * dt);

        // Vertical jump physics
        if (state.isJumping) {
          state.verticalVelocity += GRAVITY * dt;
          state.jumpY += state.verticalVelocity * dt;

          if (state.jumpY <= 0) {
            state.jumpY = 0;
            state.verticalVelocity = 0;
            state.isJumping = false;
          }
        }
        playerGroup.position.y = BLOB_START_Y + state.jumpY;

        // Smooth squash scale deformation when jumping/rolling
        const squashScaleY = state.isJumping ? (1.0 + Math.min(0.2, state.jumpY * 0.1)) : (1.0 - Math.min(0.3, Math.abs(state.verticalVelocity) * 0.02));
        const squashScaleXZ = state.isJumping ? (1.0 - Math.min(0.1, state.jumpY * 0.05)) : (1.0 + Math.min(0.15, Math.abs(state.verticalVelocity) * 0.01));
        playerGroup.scale.set(squashScaleXZ, squashScaleY, squashScaleXZ);

        // Speed increases with level
        const currentSpeed = 30.0 + state.level * 4.5;

        // Continuous forward rolling animation based on speed
        playerGroup.rotation.x -= (currentSpeed / OUTER_RADIUS) * dt * 0.25;

        // Core visual counteract counter-rotation
        innerCore.rotation.x = -time * 0.45;
        innerCore.rotation.y = time * 0.15;
        outerSphere.rotation.y = time * 0.25;

        // Procedural Spawning logic (speed depends on level)
        const spawnDelay = Math.max(700, 1600 - state.level * 180);
        if (performance.now() - state.lastObstacleSpawn > spawnDelay) {
          spawnGameObstacle(scene);
          state.lastObstacleSpawn = performance.now();
        }

        if (performance.now() - state.lastCrystalSpawn > spawnDelay * 0.8) {
          spawnGameCrystal(scene);
          state.lastCrystalSpawn = performance.now();
        }

        // Move Obstacles
        for (let i = obstacles.current.length - 1; i >= 0; i--) {
          const obs = obstacles.current[i];
          obs.z += currentSpeed * dt;
          obs.mesh.position.z = obs.z;

          // Collision Check
          const onSameLane = state.currentLane === obs.lane;
          const underJumpHeight = state.jumpY < 0.7; // Low obstacle height bounding box
          const isZInRange = Math.abs(obs.z - 0.2) < 1.1;

          if (onSameLane && underJumpHeight && isZInRange && state.invulnerableTime <= 0) {
            triggerObstacleHit(scene, i);
            continue;
          }

          // Remove out-of-bounds obstacles
          if (obs.z > 12) {
            scene.remove(obs.mesh);
            obstacles.current.splice(i, 1);
          }
        }

        // Move Crystals
        for (let i = crystals.current.length - 1; i >= 0; i--) {
          const cry = crystals.current[i];
          cry.z += currentSpeed * dt;
          cry.mesh.position.z = cry.z;
          cry.mesh.position.y = BLOB_START_Y + 0.45 + Math.sin(time * 4 + cry.seed) * 0.22;
          cry.mesh.rotation.y += 2.0 * dt;

          // Collection Check
          const onSameLane = state.currentLane === cry.lane;
          const isZInRange = Math.abs(cry.z - 0.2) < 1.3;

          if (onSameLane && isZInRange) {
            triggerCollectCrystal(scene, i);
            continue;
          }

          // Remove out-of-bounds crystals
          if (cry.z > 12) {
            scene.remove(cry.mesh);
            crystals.current.splice(i, 1);
          }
        }

        // Increment score gradually using DOM refs to avoid React re-renders
        state.score += Math.max(1, 60 * dt);
        
        if (scoreRef.current) {
          scoreRef.current.innerText = Math.floor(state.score).toString().padStart(5, '0');
        }

        const nextLevel = Math.floor(state.score / 200) + 1;
        if (nextLevel > state.level) {
          state.level = nextLevel;
          if (levelRef.current) levelRef.current.innerText = `LEVEL ${nextLevel}`;
        }

        // Unlocks are triggered directly in triggerCollectCrystal to stay responsive!

        // Elegant Dynamic Camera Tracking
        const targetCamPos = new THREE.Vector3(playerGroup.position.x * 0.45, 4.5 + state.jumpY * 0.22, 10.5);
        camera.position.lerp(targetCamPos, 8.0 * dt);
        camera.lookAt(playerGroup.position.x * 0.5, BLOB_START_Y + 0.4, 0);

      } else {
        // --- 2. MENU FLOAT SHOWCASE ---
        outerSphere.visible = true;
        innerCore.visible = true;
        
        playerGroup.position.set(0, BLOB_START_Y + Math.sin(time * 1.5) * 0.15, 0);
        playerGroup.scale.set(1, 1, 1);
        playerGroup.rotation.y += 0.006;
        playerGroup.rotation.z = Math.sin(time * 0.4) * 0.08;

        innerCore.rotation.x = -time * 0.3;
        innerCore.rotation.y = time * 0.1;

        camera.position.lerp(new THREE.Vector3(0, 3.8, 8.0), 4.0 * dt);
        camera.lookAt(0, BLOB_START_Y + 0.1, 0);
      }

      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    // Resources Teardown
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);

      starsGeometry.dispose();
      starsMaterial.dispose();
      trackGeometry.dispose();
      trackMaterial.dispose();
      barrierGeo.dispose();
      barrierMat.dispose();
      outerGeometry.dispose();
      glassMaterial.dispose();
      innerGeometry.dispose();
      liquidMaterial.dispose();

      if (obstacleGeom.current) obstacleGeom.current.dispose();
      if (obstacleMat.current) obstacleMat.current.dispose();
      if (crystalGeom.current) crystalGeom.current.dispose();
      if (crystalMat.current) crystalMat.current.dispose();

      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, []);

  // Trigger Jump Mechanics
  const triggerJump = () => {
    const state = stateRef.current;
    if (state.isJumping) return;
    state.isJumping = true;
    state.verticalVelocity = JUMP_FORCE;
    playSynthSound('jump');
  };

  // Spawns a red bar obstacle on a random lane
  const spawnGameObstacle = (scene) => {
    const lane = Math.floor(Math.random() * 3);
    const mesh = new THREE.Mesh(obstacleGeom.current, obstacleMat.current);
    mesh.position.set(LANES[lane], TRACK_Y + 0.8, -80);
    scene.add(mesh);

    obstacles.current.push({
      mesh,
      lane,
      z: -80
    });
  };

  // Spawns a floating golden crystal on a random lane
  const spawnGameCrystal = (scene) => {
    const lane = Math.floor(Math.random() * 3);
    const mesh = new THREE.Mesh(crystalGeom.current, crystalMat.current);
    mesh.position.set(LANES[lane], BLOB_START_Y + 0.4, -80);
    scene.add(mesh);

    crystals.current.push({
      mesh,
      lane,
      z: -80,
      seed: Math.random() * 100
    });
  };

  // Handle obstacle hits
  const triggerObstacleHit = (scene, index) => {
    const state = stateRef.current;
    const obs = obstacles.current[index];

    // Simple red ring blast animation
    const blastGeo = new THREE.RingGeometry(0.1, 1.2, 16);
    const blastMat = new THREE.MeshBasicMaterial({
      color: 0xff003c,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const blastMesh = new THREE.Mesh(blastGeo, blastMat);
    blastMesh.position.set(obs.mesh.position.x, obs.mesh.position.y, 0.2);
    scene.add(blastMesh);

    const start = performance.now();
    const animateBlast = () => {
      const elapsed = (performance.now() - start) / 250; // 250ms burst
      if (elapsed >= 1) {
        scene.remove(blastMesh);
        blastGeo.dispose();
        blastMat.dispose();
      } else {
        blastMesh.scale.set(1 + elapsed * 3, 1 + elapsed * 3, 1);
        blastMat.opacity = 0.8 * (1 - elapsed);
        requestAnimationFrame(animateBlast);
      }
    };
    animateBlast();

    // Clean hit obstacle from scene
    scene.remove(obs.mesh);
    obstacles.current.splice(index, 1);

    // Damage logic
    setLives(prev => {
      const next = prev - 1;
      state.lives = next;
      if (next <= 0) {
        triggerGameOver();
      } else {
        state.invulnerableTime = 2.0; // 2 seconds invulnerability blink
        playSynthSound('hit');
      }
      return next;
    });
  };

  // Handle crystal collection
  const triggerCollectCrystal = (scene, index) => {
    const state = stateRef.current;
    const cry = crystals.current[index];

    // Golden blast ring burst
    const blastGeo = new THREE.RingGeometry(0.1, 0.9, 16);
    const blastMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const blastMesh = new THREE.Mesh(blastGeo, blastMat);
    blastMesh.position.set(cry.mesh.position.x, cry.mesh.position.y, 0.2);
    scene.add(blastMesh);

    const start = performance.now();
    const animateBlast = () => {
      const elapsed = (performance.now() - start) / 250;
      if (elapsed >= 1) {
        scene.remove(blastMesh);
        blastGeo.dispose();
        blastMat.dispose();
      } else {
        blastMesh.scale.set(1 + elapsed * 2.5, 1 + elapsed * 2.5, 1);
        blastMat.opacity = 0.9 * (1 - elapsed);
        requestAnimationFrame(animateBlast);
      }
    };
    animateBlast();

    // Clean crystal
    scene.remove(cry.mesh);
    crystals.current.splice(index, 1);

    // Collect logic
    playSynthSound('collect');
    state.score += 50;
    if (scoreRef.current) {
      scoreRef.current.innerText = Math.floor(state.score).toString().padStart(5, '0');
    }

    state.crystalsCollected += 1;
    setCrystalsCollected(state.crystalsCollected);

    if (state.crystalsCollected >= 10 && !state.unlockedYellow) {
      state.unlockedYellow = true;
      setUnlockedYellow(true);
    }
    if (state.crystalsCollected >= 20 && !state.unlockedPink) {
      state.unlockedPink = true;
      setUnlockedPink(true);
    }
    if (state.crystalsCollected >= 30 && !state.unlockedBlue) {
      state.unlockedBlue = true;
      setUnlockedBlue(true);
    }
  };

  // Game over state handler
  const triggerGameOver = () => {
    const state = stateRef.current;
    state.gameOver = true;
    setIsPlaying(false);
    setGameOver(true);
    playSynthSound('gameover');

    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
    }

    // Save local records
    const finalScore = state.score;
    const currentHigh = parseInt(localStorage.getItem('vanhees_runner_highscore') || '0', 10);
    if (finalScore > currentHigh) {
      localStorage.setItem('vanhees_runner_highscore', finalScore.toString());
      setHighScore(finalScore);
    }
  };

  // Launches game and resets variables
  const startGame = () => {
    const state = stateRef.current;
    
    playClickSound('open');
    setIsPlaying(true);

    if (bgMusicRef.current) {
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch(e => console.log('Music start failed', e));
    }
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLives(3);
    setCrystalsCollected(0);

    state.score = 0;
    state.level = 1;
    state.lives = 3;
    state.crystalsCollected = 0;
    state.currentLane = 1;
    state.jumpY = 0;
    state.verticalVelocity = 0;
    state.isJumping = false;
    state.invulnerableTime = 0;
    state.lastObstacleSpawn = performance.now();
    state.lastCrystalSpawn = performance.now();
    state.gameOver = false;
    state.isPlaying = true;

    // Clear active obstacles/crystals
    obstacles.current.forEach(obs => {
      if (sceneRef.current) sceneRef.current.remove(obs.mesh);
    });
    obstacles.current = [];

    crystals.current.forEach(cry => {
      if (sceneRef.current) sceneRef.current.remove(cry.mesh);
    });
    crystals.current = [];
  };

  // Return to home / Close overlay
  const handleExit = () => {
    const state = stateRef.current;
    
    playClickSound('close');
    state.isPlaying = false;
    state.gameOver = false;
    
    setIsPlaying(false);
    setGameOver(false);

    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
    }

    // Clear active obstacles/crystals
    obstacles.current.forEach(obs => {
      if (sceneRef.current) sceneRef.current.remove(obs.mesh);
    });
    obstacles.current = [];
    crystals.current.forEach(cry => {
      if (sceneRef.current) sceneRef.current.remove(cry.mesh);
    });
    crystals.current = [];

    if (onClose) {
      onClose();
    } else {
      window.location.hash = '#home';
    }
  };

  return (
    <div 
      className="fixed inset-0 w-full h-full z-[100] flex items-center justify-center p-4 sm:p-8 touch-none font-meta bg-black/75 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={handleExit}
    >
      {/* Always-visible top-right close window button outside the bezel */}
      <button 
        onClick={handleExit}
        className="absolute top-4 right-4 z-[110] p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/70 hover:text-red-500 hover:border-red-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xl"
        title="Close Game Overlay (Esc)"
      >
        <X size={20} />
      </button>

      <div 
        ref={containerRef} 
        onClick={(e) => e.stopPropagation()} // Prevent clicking game bezel from closing it
        className={`relative w-full max-w-[340px] aspect-[9/16] max-h-[82vh] md:max-h-none md:max-w-4xl md:aspect-video rounded-[2rem] overflow-hidden select-none border-4 shadow-2xl transition-all duration-700
          ${darkMode ? 'bg-black border-[#333] shadow-[0_0_60px_rgba(0,255,65,0.15)]' : 'bg-black border-white shadow-[0_0_60px_rgba(0,85,255,0.2)]'}`}
      >
        {/* CRT Scanline / Bezel Overlay for retro charm */}
        <div className="absolute inset-0 z-50 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.2))] bg-[length:100%_4px] rounded-[2rem] shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]" />

        {/* 3D WebGL screen */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-10 touch-none" />

        {/* iOS 26 Liquid Glass Minimal HUD */}
        {isPlaying && !gameOver && (
          <div className="absolute inset-x-4 md:inset-x-6 top-4 md:top-6 z-20 flex justify-between items-start pointer-events-none">
            {/* Top Left: Score & Goals */}
            <div className="flex flex-col gap-2 pointer-events-auto">
              <div className="px-4 py-2 md:px-5 md:py-3 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl flex flex-col gap-0.5 text-white shadow-2xl">
                <span className="text-[7px] md:text-[9px] uppercase opacity-40 tracking-widest font-bold">SCORE</span>
                <span ref={scoreRef} className="text-lg md:text-xl font-bold tracking-tight">{Math.floor(stateRef.current.score).toString().padStart(5, '0')}</span>
                <span className="text-[6px] md:text-[8px] opacity-30 uppercase tracking-widest pt-0.5 border-t border-white/5">BEST: {highScore}</span>
              </div>
              <div className="text-[8px] md:text-[10px] opacity-60 uppercase tracking-widest pl-2 font-bold flex flex-col gap-0.5">
                <span className="text-white/40">Parts: {crystalsCollected}</span>
                {!unlockedYellow && <span className="text-[#ffd700]/70">NEXT: YELLOW GRID (10 Parts)</span>}
                {unlockedYellow && !unlockedPink && <span className="text-[#ff007f]/70">NEXT: PINK GRID (20 Parts)</span>}
                {unlockedPink && !unlockedBlue && <span className="text-[#00a2ff]/70">NEXT: BLUE GRID (30 Parts)</span>}
                {unlockedBlue && <span className="text-[#00FF41]/70">ALL GRIDS UNLOCKED</span>}
              </div>
            </div>

            {/* Top Center: Minimal Level Indicator */}
            <div className="hidden md:flex px-5 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl items-center gap-2 text-[#00ff41] shadow-2xl pointer-events-auto mt-2">
              <Zap size={11} className="animate-pulse" />
              <span ref={levelRef} className="text-[9px] font-bold tracking-widest uppercase">LEVEL {stateRef.current.level}</span>
            </div>

            {/* Top Right: Lives and Exit */}
            <div className="flex flex-col items-end gap-3 pointer-events-auto">
              <div className="px-4 py-2 md:px-5 md:py-3 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl flex flex-col gap-1.5 shadow-2xl">
                <span className="text-[7px] md:text-[9px] uppercase opacity-40 tracking-widest font-bold text-right">LIVES</span>
                <div className="flex gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <Heart
                      key={i}
                      size={13}
                      className={`transition-all duration-300 ${
                        i < lives 
                          ? 'text-red-500 fill-red-500 filter drop-shadow-[0_0_4px_rgba(239,68,68,0.4)] scale-100' 
                          : 'text-white/10 fill-none scale-90'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleExit}
                className="p-2 md:p-2.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl text-white/60 hover:text-red-500 hover:border-red-500/30 transition-all shadow-xl cursor-pointer animate-pulse"
                title="Close Runner"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* HUD Skin Color Selector (Floating Glass Cylinder on Right) */}
        {isPlaying && !gameOver && (
          <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5 p-2 md:p-3 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl text-white shadow-2xl pointer-events-auto scale-90 md:scale-100 transform origin-right">
            <span className="text-[6px] md:text-[7px] uppercase opacity-35 tracking-wider text-center font-bold pb-1.5 border-b border-white/5 mb-0.5">COLOR</span>

            {/* Green */}
            <button
              onClick={() => setSelectedColor('green')}
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full border transition-all flex items-center justify-center cursor-pointer shadow active:scale-90
                ${selectedColor === 'green' 
                  ? 'border-[#00ff41] bg-[#00ff41]/10 scale-105 shadow-[0_0_8px_rgba(0,255,65,0.3)]' 
                  : 'border-white/10 hover:border-white/30 bg-[#00ff41]/5'}`}
              title="Neon Green"
            >
              <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#00ff41]" />
            </button>

            {/* Yellow */}
            <button
              onClick={() => unlockedYellow && setSelectedColor('yellow')}
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full border transition-all flex items-center justify-center shadow relative active:scale-90
                ${!unlockedYellow ? 'opacity-30 cursor-not-allowed bg-black/40 border-white/5' : 'cursor-pointer'}
                ${selectedColor === 'yellow' && unlockedYellow 
                  ? 'border-[#ffd700] bg-[#ffd700]/10 scale-105 shadow-[0_0_8px_rgba(255,215,0,0.3)]' 
                  : unlockedYellow 
                    ? 'border-white/10 hover:border-white/30 bg-[#ffd700]/5' 
                    : ''}`}
              title={unlockedYellow ? "Neon Yellow Grid" : "Locked (10 Parts)"}
            >
              {unlockedYellow ? (
                <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#ffd700]" />
              ) : (
                <Lock size={10} className="text-white/40" />
              )}
            </button>

            {/* Pink */}
            <button
              onClick={() => unlockedPink && setSelectedColor('pink')}
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full border transition-all flex items-center justify-center shadow relative active:scale-90
                ${!unlockedPink ? 'opacity-30 cursor-not-allowed bg-black/40 border-white/5' : 'cursor-pointer'}
                ${selectedColor === 'pink' && unlockedPink 
                  ? 'border-[#ff007f] bg-[#ff007f]/10 scale-105 shadow-[0_0_8px_rgba(255,0,127,0.3)]' 
                  : unlockedPink 
                    ? 'border-white/10 hover:border-white/30 bg-[#ff007f]/5' 
                    : ''}`}
              title={unlockedPink ? "Neon Pink Grid" : "Locked (20 Parts)"}
            >
              {unlockedPink ? (
                <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#ff007f]" />
              ) : (
                <Lock size={10} className="text-white/40" />
              )}
            </button>

            {/* Blue */}
            <button
              onClick={() => unlockedBlue && setSelectedColor('blue')}
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full border transition-all flex items-center justify-center shadow relative active:scale-90
                ${!unlockedBlue ? 'opacity-30 cursor-not-allowed bg-black/40 border-white/5' : 'cursor-pointer'}
                ${selectedColor === 'blue' && unlockedBlue 
                  ? 'border-[#00a2ff] bg-[#00a2ff]/10 scale-105 shadow-[0_0_8px_rgba(0,162,255,0.3)]' 
                  : unlockedBlue 
                    ? 'border-white/10 hover:border-white/30 bg-[#00a2ff]/5' 
                    : ''}`}
              title={unlockedBlue ? "Neon Blue Grid" : "Locked (30 Parts)"}
            >
              {unlockedBlue ? (
                <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#00a2ff]" />
              ) : (
                <Lock size={10} className="text-white/40" />
              )}
            </button>
          </div>
        )}

        {/* Main Start / Game Over Frosted Glass overlay (Now in gorgeous 3:2 Horizontal Layout!) */}
        {!isPlaying && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="relative w-full max-w-2xl p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.01] text-white shadow-[0_0_40px_rgba(0,255,65,0.08)] flex flex-col md:grid md:grid-cols-12 gap-6 items-center md:items-start text-center md:text-left animate-in fade-in zoom-in-95 duration-300">
              
              {/* Left Column (Main Panel) */}
              <div className="col-span-7 flex flex-col items-center md:items-start w-full">
                {/* Glowing menu orb */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#00ff41]/5 border border-[#00ff41]/20 shadow-[0_0_15px_rgba(0,255,65,0.1)] mb-3 animate-pulse">
                  <Zap size={18} className="text-[#00ff41]" />
                </div>

                <h1 className="text-xl md:text-2xl font-display font-extrabold tracking-tighter uppercase mb-0.5">
                  NEON BLOB RUNNER
                </h1>
                
                <p className="text-[7px] md:text-[8px] text-white/40 tracking-widest uppercase mb-4">
                  iOS 26 Liquid Glass Generative Space
                </p>

                {/* Highscore pill */}
                <div className="w-full flex justify-around border border-white/5 py-2 md:py-2.5 rounded-xl bg-white/[0.01] mb-4 font-meta text-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[7px] md:text-[8px] uppercase opacity-35">High Score</span>
                    <span className="text-xs md:text-sm font-bold text-[#00ff41]">{highScore}</span>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[7px] md:text-[8px] uppercase opacity-35">Engine</span>
                    <span className="text-xs md:text-sm font-bold text-[#00ff41]">WebGL 3D</span>
                  </div>
                </div>

                {/* CTA Glass buttons */}
                <div className="w-full flex flex-col gap-2">
                  <button
                    onClick={startGame}
                    className="w-full py-2.5 px-6 rounded-xl bg-[#00ff41] text-black font-display font-bold uppercase tracking-wider text-[10px] md:text-xs transition-all hover:scale-[1.01] hover:bg-[#00cc33] active:scale-95 shadow-[0_0_15px_rgba(0,255,65,0.22)] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Play size={12} fill="black" /> {gameOver ? 'RUN AGAIN' : 'START RUNNER'}
                  </button>

                  <button
                    onClick={handleExit}
                    className="w-full py-2.5 px-6 rounded-xl border border-white/10 bg-transparent text-white/50 font-display font-bold uppercase tracking-wider text-[9px] md:text-[10px] transition-all hover:bg-white/5 cursor-pointer"
                  >
                    RETURN TO HOME
                  </button>
                </div>
              </div>

              {/* Vertical divider */}
              <div className="hidden md:block col-span-1 w-px bg-white/10 self-stretch mx-auto my-1" />

              {/* Right Column (Instructions Panel - perfectly matching 3:2 aspect!) */}
              <div className="col-span-4 flex flex-col justify-center items-start w-full text-left font-meta text-[8px] md:text-[9px] leading-relaxed opacity-70 border-t border-white/5 md:border-t-0 pt-4 md:pt-0">
                <span className="text-[8px] uppercase opacity-40 tracking-widest font-bold mb-2">SYSTEM MANUAL</span>
                <div className="space-y-2 border-t border-white/5 pt-2 w-full">
                  <p>• <strong>KEYBOARD:</strong> <span className="underline">Left/Right Arrows (or A/D)</span> to change lanes. <span className="underline">Spacebar (or Up)</span> to jump over walls.</p>
                  <p>• <strong>TOUCH SCREEN:</strong> <span className="underline">Swipe Left/Right</span> to slide lanes. <span className="underline">Swipe Up / Tap</span> to jump.</p>
                  <p>• <strong>GOAL:</strong> Avoid red warning walls & collect golden crystals to charge core capsules.</p>
                </div>
              </div>

              {/* GAME OVER CARD OVERLAY (Ultra-Minimalist pure black screen style!) */}
              {gameOver && (
                <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300 z-50">
                  <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tighter uppercase text-red-500 mb-8 animate-pulse">
                    GAME OVER
                  </h2>

                  <div className="w-full max-w-xs flex flex-col gap-3">
                    <button
                      onClick={startGame}
                      className="w-full py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-display font-bold uppercase tracking-wider text-xs transition-all hover:scale-[1.01] active:scale-95 shadow-[0_0_15px_rgba(239,68,68,0.35)] cursor-pointer"
                    >
                      PLAY AGAIN
                    </button>
                    <button
                      onClick={handleExit}
                      className="w-full py-3 px-6 rounded-xl border border-white/10 hover:bg-white/5 text-white/50 font-display font-bold uppercase tracking-wider text-xs transition-all cursor-pointer"
                    >
                      EXIT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameView;
