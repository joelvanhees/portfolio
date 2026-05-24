import { useEffect, useRef, useState } from 'react';
import { X, Trophy, Heart, Shield, RefreshCw, Zap, Play, Lock } from 'lucide-react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// --- CONFIGURATION ---
const OUTER_RADIUS = 1.4;
const INNER_RADIUS = 0.55; 
const FLOOR_LEVEL = -4.0; 
const SPHERE_Y_POS = FLOOR_LEVEL + OUTER_RADIUS * 0.95;

const OUTER_SMOOTHING = 3.5; 
const LIQUID_SPRING = 8.0;   
const LIQUID_DAMPING = 0.88; 

// Physics
const GRAVITY = -45.0;
const JUMP_FORCE = 16.0;
const DOUBLE_JUMP_FORCE = 20.0;
const PLATFORM_RADIUS = 30; 
const MOVEMENT_LIMIT = PLATFORM_RADIUS - 2.0; 
const MAX_OFFSET_RADIUS = (OUTER_RADIUS - INNER_RADIUS) * 0.65;

const GameView = ({ darkMode }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [selectedColor, setSelectedColor] = useState('green'); // 'green', 'yellow', 'pink'
  const [unlockedYellow, setUnlockedYellow] = useState(false);
  const [unlockedPink, setUnlockedPink] = useState(false);

  // References for game loop
  const stateRef = useRef({
    score: 0,
    level: 1,
    lives: 3,
    invulnerableTime: 0,
    lastObstacleSpawn: 0,
    lastCrystalSpawn: 0,
    activeColor: 'green'
  });

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem('vanhees_blob_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Update unlocked colors based on score
  useEffect(() => {
    if (score >= 500 && !unlockedYellow) {
      setUnlockedYellow(true);
    }
    if (score >= 1500 && !unlockedPink) {
      setUnlockedPink(true);
    }
  }, [score, unlockedYellow, unlockedPink]);

  // Update inner state ref when React states change
  useEffect(() => {
    stateRef.current.lives = lives;
    stateRef.current.score = score;
    stateRef.current.level = level;
    stateRef.current.activeColor = selectedColor;
  }, [lives, score, level, selectedColor]);

  // THREE.js References
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameId = useRef(null);
  
  // Physics simulation refs
  const currentPos = useRef(new THREE.Vector3(0, SPHERE_Y_POS, 0));
  const targetPos = useRef(new THREE.Vector3(0, SPHERE_Y_POS, 0));
  const lastPos = useRef(new THREE.Vector3(0, SPHERE_Y_POS, 0));
  const innerPos = useRef(new THREE.Vector3(0, SPHERE_Y_POS - 0.5, 0));
  const innerVelocity = useRef(new THREE.Vector3());
  
  // Jump variables
  const verticalVelocity = useRef(0);
  const jumpCount = useRef(0);
  const lastJumpTime = useRef(0);

  // Keyboard controls state
  const keysPressed = useRef({
    ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
    w: false, s: false, a: false, d: false, Space: false
  });

  // Game objects arrays
  const obstacles = useRef([]);
  const crystals = useRef([]);
  const particleSystems = useRef([]);
  
  // THREE Materials references to dynamically update shader values
  const timeUniform = useRef({ value: 0 });
  const velocityUniform = useRef({ value: 0 });
  const innerBlobMaterial = useRef(null);

  // --- AUDIO SYNTH FOR ARCADE SOUND EFFECTS ---
  const playSynthSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'jump') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.31);
      } else if (type === 'collect') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.31);
      } else if (type === 'gameover') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.start();
        osc.stop(ctx.currentTime + 0.81);
      }
    } catch (e) {
      // AudioContext blocked or not supported
    }
  };

  // --- INITIALIZE THREE.JS WORLD ---
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.Fog(0x050505, 40, 180);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(0, 10, 30);
    camera.layers.enable(1); // Enable Layer 1 (for outer iridescent bubble)
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Environment Lighting (Polyhaven HDRI fallback to simple directional)
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.environment.blur = 0.35;
      },
      undefined,
      (err) => console.log("HDRI loading skipped, using procedural lighting defaults.")
    );

    // Lights
    const spotLight = new THREE.SpotLight(0xffffff, 2.5);
    spotLight.position.set(20, 45, 15);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(1024, 1024);
    spotLight.shadow.bias = -0.0004;
    scene.add(spotLight);

    const pointLight = new THREE.PointLight(0xaaccff, 1.2, 80);
    pointLight.position.set(-15, 20, -10);
    scene.add(pointLight);

    const fillLight = new THREE.PointLight(0x00ff41, 0.7, 50); // Glowing green fill
    fillLight.position.set(0, -6, 0);
    scene.add(fillLight);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x000022, 0.4));

    // Starfield background
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 1200;
    const starsPositions = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      const radius = Math.random() * 120 + 70;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starsPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starsPositions[i+1] = radius * Math.sin(phi) * Math.sin(theta);
      starsPositions[i+2] = radius * Math.cos(phi);

      starsColors[i] = 0.0;
      starsColors[i+1] = 1.0; // Glowing green stars
      starsColors[i+2] = 0.3;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Floor Platform
    const floorGeometry = new THREE.CircleGeometry(PLATFORM_RADIUS, 96);
    const floorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x07070a,
      metalness: 0.6,
      roughness: 0.25,
      side: THREE.DoubleSide,
      clearcoat: 1.0,
      emissive: 0x001105, // Subtle green edge emission
      emissiveIntensity: 0.4
    });

    // Custom Floor displacement shader
    floorMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = timeUniform.current;
      shader.vertexShader = `uniform float uTime;\n` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        float dist = length(position.xy);
        float edgeMask = 1.0 - smoothstep(${PLATFORM_RADIUS} * 0.88, ${PLATFORM_RADIUS}, dist);
        float displacement = sin(position.x * 0.4 + uTime * 0.8) * cos(position.y * 0.4 + uTime * 0.6) * 0.05 * edgeMask;
        transformed.z += displacement;
        `
      );
    };

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = FLOOR_LEVEL;
    floor.receiveShadow = true;
    scene.add(floor);

    // Cyber grid rings
    const polarGrid = new THREE.PolarGridHelper(PLATFORM_RADIUS, 12, 8, 64, 0x00ff41, 0x004411);
    polarGrid.position.y = FLOOR_LEVEL + 0.04;
    polarGrid.material.transparent = true;
    polarGrid.material.opacity = 0.22;
    polarGrid.material.depthWrite = false;
    scene.add(polarGrid);

    // --- PLAYER NEON BLOB ---
    const outerGeometry = new THREE.SphereGeometry(OUTER_RADIUS, 96, 96);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.06,
      transmission: 1.0,
      thickness: 1.4,
      ior: 1.46,
      transparent: true,
      envMapIntensity: 0.25,
      iridescence: 1.0,
      iridescenceIOR: 2.1,
      iridescenceThicknessRange: [150, 750]
    });

    // Custom vertex deformation shader
    const injectBlobShader = (shader, intensity, frequency, speed, isInner) => {
      shader.uniforms.uTime = timeUniform.current;
      shader.uniforms.uVel = velocityUniform.current;
      shader.vertexShader = `uniform float uTime; uniform float uVel;\n` + shader.vertexShader;

      const velocityLimit = isInner ? "min(uVel, 1.2)" : "min(uVel, 1.6)";

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        float vel = ${velocityLimit};
        float breathe = sin(uTime * ${speed.toFixed(1)}) * 0.012;
        float n1 = sin(position.y * ${frequency.toFixed(1)} + uTime * ${speed.toFixed(1)});
        float n2 = cos(position.x * ${(frequency * 0.95).toFixed(1)} + uTime * ${(speed * 1.05).toFixed(1)});
        float n3 = sin(position.z * ${(frequency * 1.05).toFixed(1)} + uTime * ${(speed * 0.95).toFixed(1)});
        float amp = ${intensity.toFixed(3)} * (1.0 + vel * 0.35);
        float displacement = (n1 + n2 + n3) * amp;
        ${!isInner ? 'float groundFlatten = smoothstep(-1.2, -0.6, position.y); displacement *= groundFlatten;' : ''}
        transformed += objectNormal * (displacement + breathe);
        `
      );
    };

    glassMaterial.onBeforeCompile = (shader) => injectBlobShader(shader, 0.11, 2.2, 1.4, false);

    const outerSphere = new THREE.Mesh(outerGeometry, glassMaterial);
    outerSphere.layers.set(1); // Set to layer 1 for specular glass highlights
    outerSphere.castShadow = true;
    outerSphere.receiveShadow = true;

    const rollingGroup = new THREE.Group();
    rollingGroup.position.set(0, SPHERE_Y_POS, 0);
    rollingGroup.add(outerSphere);
    scene.add(rollingGroup);

    // Inner liquid neon core
    const innerGeometry = new THREE.SphereGeometry(INNER_RADIUS, 96, 96);
    
    // Dynamic color setup
    const liquidColorMap = {
      green: { color: 0xccffcc, attenuation: 0x00ff41, emissive: 0x004411 },
      yellow: { color: 0xffffcc, attenuation: 0xffd700, emissive: 0x443300 },
      pink: { color: 0xffcccc, attenuation: 0xff007f, emissive: 0x440022 }
    };
    
    const initialConfig = liquidColorMap[stateRef.current.activeColor];
    
    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: initialConfig.color,
      metalness: 0.15,
      roughness: 0.05,
      transmission: 0.92,
      thickness: 1.1,
      attenuationColor: new THREE.Color(initialConfig.attenuation),
      attenuationDistance: 0.7,
      ior: 1.42,
      side: THREE.DoubleSide,
      clearcoat: 1.0,
      emissive: initialConfig.emissive,
      emissiveIntensity: 0.35
    });

    liquidMaterial.onBeforeCompile = (shader) => injectBlobShader(shader, 0.065, 1.5, 1.7, true);
    innerBlobMaterial.current = liquidMaterial;

    const innerCore = new THREE.Mesh(innerGeometry, liquidMaterial);
    scene.add(innerCore);

    // Handle resizing
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- GAME ACTIONS & KEYBOARD LISTENERS ---
    const handleKeyDown = (e) => {
      const k = e.key;
      if (keysPressed.current[k] !== undefined) {
        keysPressed.current[k] = true;
      }
      if (k === ' ') {
        keysPressed.current.Space = true;
        triggerJump();
      }
      if (k === 'w' || k === 'ArrowUp') triggerJump();
    };

    const handleKeyUp = (e) => {
      const k = e.key;
      if (keysPressed.current[k] !== undefined) {
        keysPressed.current[k] = false;
      }
      if (k === ' ') {
        keysPressed.current.Space = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Handle Pointer / Touch tracking
    const handlePointerMove = (e) => {
      if (!isPlaying || gameOver) return;
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseZ = -(e.clientY / window.innerHeight) * 2 + 1;
      
      // Map pointer directly to platform coordinates
      targetPos.current.x = mouseX * (MOVEMENT_LIMIT * 0.9);
      targetPos.current.z = -mouseZ * (MOVEMENT_LIMIT * 0.9);
    };

    const handlePointerDown = (e) => {
      if (!isPlaying || gameOver) return;
      triggerJump();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);

    // Cleanup resources
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      starsGeometry.dispose();
      starsMaterial.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      outerGeometry.dispose();
      glassMaterial.dispose();
      innerGeometry.dispose();
      liquidMaterial.dispose();
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [isPlaying, gameOver]);

  // Jump Action trigger
  const triggerJump = () => {
    const now = performance.now();
    if (now - lastJumpTime.current > 240 && jumpCount.current < 2) {
      const force = (jumpCount.current === 0) ? JUMP_FORCE : DOUBLE_JUMP_FORCE;
      verticalVelocity.current = force;
      jumpCount.current++;
      lastJumpTime.current = now;
      innerVelocity.current.y -= 4.5; // Squash deformation trigger
      playSynthSound('jump');
    }
  };

  // --- GAME START & LOOP CONTROLLER ---
  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLives(3);
    
    // Reset positions
    currentPos.current.set(0, SPHERE_Y_POS, 0);
    targetPos.current.set(0, SPHERE_Y_POS, 0);
    lastPos.current.set(0, SPHERE_Y_POS, 0);
    innerPos.current.set(0, SPHERE_Y_POS - 0.5, 0);
    innerVelocity.current.set(0, 0, 0);
    verticalVelocity.current = 0;
    jumpCount.current = 0;

    // Reset arrays
    obstacles.current.forEach(obs => sceneRef.current.remove(obs.mesh));
    obstacles.current = [];
    crystals.current.forEach(cry => sceneRef.current.remove(cry.mesh));
    crystals.current = [];
    
    stateRef.current = {
      score: 0,
      level: 1,
      lives: 3,
      invulnerableTime: 0,
      lastObstacleSpawn: performance.now(),
      lastCrystalSpawn: performance.now(),
      activeColor: selectedColor
    };

    // Spawn first crystal
    spawnCrystal();

    // Start Game Loop
    const clock = new THREE.Clock();
    
    const gameLoop = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();
      timeUniform.current.value = time;

      // Update shader liquid core colors dynamically if modified
      if (innerBlobMaterial.current) {
        const liquidColorMap = {
          green: { color: 0xccffcc, attenuation: 0x00ff41, emissive: 0x004411 },
          yellow: { color: 0xffffcc, attenuation: 0xffd700, emissive: 0x443300 },
          pink: { color: 0xffcccc, attenuation: 0xff007f, emissive: 0x440022 }
        };
        const config = liquidColorMap[stateRef.current.activeColor];
        innerBlobMaterial.current.color.setHex(config.color);
        innerBlobMaterial.current.attenuationColor.setHex(config.attenuation);
        innerBlobMaterial.current.emissive.setHex(config.emissive);
      }

      // 1. Invulnerability blinking animation
      if (stateRef.current.invulnerableTime > 0) {
        stateRef.current.invulnerableTime -= dt;
        const outerMesh = sceneRef.current.getObjectByProperty('type', 'Mesh'); // Fallback check
        if (outerMesh) {
          outerMesh.visible = Math.floor(time * 15) % 2 === 0;
        }
      } else {
        const outerMesh = sceneRef.current.getObjectByProperty('type', 'Mesh');
        if (outerMesh) outerMesh.visible = true;
      }

      // 2. Desktop Keyboard movement controls
      const speed = 25.0;
      const keys = keysPressed.current;
      let dx = 0;
      let dz = 0;
      
      if (keys.ArrowLeft || keys.a) dx = -speed * dt;
      if (keys.ArrowRight || keys.d) dx = speed * dt;
      if (keys.ArrowUp || keys.w) dz = -speed * dt;
      if (keys.ArrowDown || keys.s) dz = speed * dt;

      if (dx !== 0 || dz !== 0) {
        targetPos.current.x = THREE.MathUtils.clamp(targetPos.current.x + dx, -MOVEMENT_LIMIT, MOVEMENT_LIMIT);
        targetPos.current.z = THREE.MathUtils.clamp(targetPos.current.z + dz, -MOVEMENT_LIMIT, MOVEMENT_LIMIT);
      }

      // Smoothly interpolate outer blob position
      const lerp = 1.0 - Math.exp(-OUTER_SMOOTHING * dt);
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerp;
      currentPos.current.z += (targetPos.current.z - currentPos.current.z) * lerp;

      // 3. Vertical jump physics
      verticalVelocity.current += GRAVITY * dt;
      currentPos.current.y += verticalVelocity.current * dt;

      // Floor boundary collision
      if (currentPos.current.y < SPHERE_Y_POS) {
        currentPos.current.y = SPHERE_Y_POS;
        if (verticalVelocity.current < -6) {
          verticalVelocity.current = -verticalVelocity.current * 0.25; // bouncy landing
        } else {
          verticalVelocity.current = 0;
        }
        jumpCount.current = 0; 
      }

      // Platform boundaries limit check
      const rad = currentPos.current.length();
      if (rad > MOVEMENT_LIMIT) {
        const factor = MOVEMENT_LIMIT / rad;
        currentPos.current.x *= factor;
        currentPos.current.z *= factor;
      }

      // Roll animation calculations
      const frameMove = new THREE.Vector3().subVectors(currentPos.current, lastPos.current);
      frameMove.y = 0;
      const movDist = frameMove.length();
      const rawSpeed = movDist / dt;
      velocityUniform.current.value = THREE.MathUtils.lerp(velocityUniform.current.value, Math.min(rawSpeed * 0.5, 3.0), 0.1);

      const blobGroup = sceneRef.current.children.find(c => c.type === 'Group');
      if (blobGroup && movDist > 0.0001) {
        blobGroup.position.copy(currentPos.current);
        const rollingAxis = new THREE.Vector3(frameMove.z, 0, -frameMove.x).normalize();
        const angle = movDist / OUTER_RADIUS;
        const q = new THREE.Quaternion().setFromAxisAngle(rollingAxis, angle);
        blobGroup.quaternion.premultiply(q);
      } else if (blobGroup) {
        blobGroup.position.copy(currentPos.current);
      }

      // 4. Liquid interior gel physics
      const offset = new THREE.Vector3(0, -(OUTER_RADIUS - INNER_RADIUS - 0.25), 0);
      const desiredPos = new THREE.Vector3().copy(currentPos.current).add(offset);
      const force = new THREE.Vector3().subVectors(desiredPos, innerPos.current).multiplyScalar(LIQUID_SPRING);
      
      innerVelocity.current.add(force.multiplyScalar(dt));
      innerVelocity.current.multiplyScalar(Math.pow(LIQUID_DAMPING, dt * 60));
      
      const nextInner = innerPos.current.clone().add(innerVelocity.current.clone().multiplyScalar(dt));

      // Prevent inner gel from clipping outer boundaries
      const offsetCenter = new THREE.Vector3().subVectors(nextInner, currentPos.current);
      const distCenter = offsetCenter.length();
      if (distCenter > MAX_OFFSET_RADIUS) {
        offsetCenter.normalize().multiplyScalar(MAX_OFFSET_RADIUS);
        nextInner.copy(currentPos.current).add(offsetCenter);
        const normal = offsetCenter.clone().normalize();
        const velD = innerVelocity.current.dot(normal);
        if (velD > 0) {
          innerVelocity.current.sub(normal.multiplyScalar(velD));
        }
      }
      
      innerPos.current.copy(nextInner);
      
      const innerCoreMesh = sceneRef.current.children.find(c => c.geometry && c.geometry.type === 'SphereGeometry' && c.layers.mask === 1); // Select inside core
      if (innerCoreMesh) {
        innerCoreMesh.position.copy(innerPos.current);
        innerCoreMesh.rotation.x = innerVelocity.current.z * 0.18;
        innerCoreMesh.rotation.z = -innerVelocity.current.x * 0.18;
      }

      lastPos.current.copy(currentPos.current);

      // Camera Tracking
      const idealCam = new THREE.Vector3().copy(currentPos.current).add(new THREE.Vector3(0, 8.5, 17));
      cameraRef.current.position.lerp(idealCam, 1.0 - Math.exp(-3.0 * dt));
      if (cameraRef.current.position.y < FLOOR_LEVEL + 1.2) cameraRef.current.position.y = FLOOR_LEVEL + 1.2;
      cameraRef.current.lookAt(currentPos.current.x, currentPos.current.y, currentPos.current.z);

      // --- OBSTACLES SPAWNING & UPDATE (Expanding red neon rings) ---
      const spawnInterval = Math.max(1200, 3000 - stateRef.current.level * 280);
      if (performance.now() - stateRef.current.lastObstacleSpawn > spawnInterval) {
        spawnObstacle();
        stateRef.current.lastObstacleSpawn = performance.now();
      }

      // Update obstacles
      for (let i = obstacles.current.length - 1; i >= 0; i--) {
        const obs = obstacles.current[i];
        obs.radius += obs.speed * dt;
        
        // Resize ring mesh
        obs.mesh.scale.set(obs.radius, obs.radius, 1);
        
        // Check collision
        const playerDist = currentPos.current.length();
        const heightCheck = currentPos.current.y < FLOOR_LEVEL + 2.0;
        
        if (
          Math.abs(playerDist - obs.radius) < 1.1 && 
          heightCheck && 
          stateRef.current.invulnerableTime <= 0
        ) {
          triggerDamage();
        }

        // Remove out-of-bounds obstacles
        if (obs.radius > PLATFORM_RADIUS * 1.1) {
          sceneRef.current.remove(obs.mesh);
          obs.mesh.geometry.dispose();
          obs.mesh.material.dispose();
          obstacles.current.splice(i, 1);
        }
      }

      // --- UPDATE COLLECTIBLE CRYSTALS ---
      crystals.current.forEach(cry => {
        cry.mesh.rotation.y += 1.8 * dt;
        cry.mesh.rotation.x += 0.8 * dt;
        cry.mesh.position.y = FLOOR_LEVEL + 1.2 + Math.sin(time * 3 + cry.seed) * 0.35;

        // Check collection collision
        const distToPlayer = currentPos.current.distanceTo(cry.mesh.position);
        if (distToPlayer < 2.3) {
          triggerCollect(cry);
        }
      });

      // Gradually increase score
      setScore(prev => {
        const next = prev + 1;
        // Level up every 250 points
        const nextLevel = Math.floor(next / 250) + 1;
        if (nextLevel > stateRef.current.level) {
          setLevel(nextLevel);
        }
        return next;
      });

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    clock.start();
    gameLoop();
  };

  // --- GAMEPLAY MECHANICS ---
  
  // Spawns a glowing neon red expansion energy ring
  const spawnObstacle = () => {
    const ringGeo = new THREE.RingGeometry(0.9, 1.0, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff0033, // Hot neon red
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = FLOOR_LEVEL + 0.15;
    sceneRef.current.add(ringMesh);

    const speedBase = 8.5 + level * 1.8;
    obstacles.current.push({
      mesh: ringMesh,
      radius: 0.1,
      speed: speedBase,
      maxRadius: PLATFORM_RADIUS
    });
  };

  // Spawns a floating golden crystal
  const spawnCrystal = () => {
    const cryGeo = new THREE.OctahedronGeometry(0.65, 0);
    const cryMat = new THREE.MeshPhysicalMaterial({
      color: 0xffd700, // Shiny gold
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xaa6600,
      emissiveIntensity: 0.8,
      clearcoat: 1.0
    });
    const cryMesh = new THREE.Mesh(cryGeo, cryMat);
    
    // Random position on the platform
    const angle = Math.random() * Math.PI * 2;
    const distance = 5.0 + Math.random() * (MOVEMENT_LIMIT - 6.0);
    
    cryMesh.position.set(
      Math.cos(angle) * distance,
      FLOOR_LEVEL + 1.2,
      Math.sin(angle) * distance
    );
    cryMesh.castShadow = true;
    sceneRef.current.add(cryMesh);

    crystals.current.push({
      mesh: cryMesh,
      seed: Math.random() * 100
    });
  };

  // Triggers damage when hit
  const triggerDamage = () => {
    setLives(prev => {
      const next = prev - 1;
      if (next <= 0) {
        triggerGameOver();
      } else {
        stateRef.current.invulnerableTime = 2.0; // 2 seconds invulnerability
        playSynthSound('hit');
      }
      return next;
    });
  };

  // Triggers collectible crystal claim
  const triggerCollect = (crystal) => {
    playSynthSound('collect');
    
    // Spawn simple collection explosion
    const splashGeo = new THREE.RingGeometry(0.1, 0.7, 16);
    const splashMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const splashMesh = new THREE.Mesh(splashGeo, splashMat);
    splashMesh.position.copy(crystal.mesh.position);
    splashMesh.rotation.x = -Math.PI / 2;
    sceneRef.current.add(splashMesh);

    // Simple scale-out fade animation for collection splash
    const start = performance.now();
    const animateSplash = () => {
      const elapsed = (performance.now() - start) / 300; // 300ms animation
      if (elapsed >= 1) {
        sceneRef.current.remove(splashMesh);
        splashGeo.dispose();
        splashMat.dispose();
      } else {
        splashMesh.scale.set(1 + elapsed * 3, 1 + elapsed * 3, 1);
        splashMat.opacity = 0.9 * (1 - elapsed);
        requestAnimationFrame(animateSplash);
      }
    };
    animateSplash();

    // Remove crystal from scene
    sceneRef.current.remove(crystal.mesh);
    crystal.mesh.geometry.dispose();
    crystal.mesh.material.dispose();
    crystals.current = crystals.current.filter(c => c !== crystal);

    // Add score +50 and spawn next
    setScore(prev => prev + 50);
    spawnCrystal();
  };

  // Triggers Game Over sequence
  const triggerGameOver = () => {
    setIsPlaying(false);
    setGameOver(true);
    playSynthSound('gameover');

    // Remove loop frame callback
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    // Save high score
    const finalScore = stateRef.current.score;
    const currentHigh = parseInt(localStorage.getItem('vanhees_blob_highscore') || '0', 10);
    if (finalScore > currentHigh) {
      localStorage.setItem('vanhees_blob_highscore', finalScore.toString());
      setHighScore(finalScore);
    }
  };

  // Exit game and clean up back to main menu
  const handleExit = () => {
    setIsPlaying(false);
    setGameOver(false);
    window.location.hash = '#home';
  };

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full z-40 bg-black overflow-hidden select-none font-mono">
      {/* 3D WebGL game screen */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-10" />

      {/* Glossy translucent HUD overlay */}
      {isPlaying && !gameOver && (
        <div className="absolute top-6 inset-x-6 z-20 flex justify-between items-start pointer-events-none">
          {/* Top Left: Score & Highscore */}
          <div className="p-4 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col gap-1 text-white shadow-2xl pointer-events-auto">
            <span className="text-[10px] uppercase opacity-50 tracking-widest flex items-center gap-1.5 font-bold">
              <Trophy size={11} className="text-yellow-400" /> Score
            </span>
            <span className="text-2xl font-bold tracking-tight text-white">{score}</span>
            <span className="text-[9px] opacity-40 uppercase tracking-wider pt-0.5 border-t border-white/5">
              Best: {highScore}
            </span>
          </div>

          {/* Top Center: Current Level */}
          <div className="px-5 py-2.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-md flex items-center gap-3 text-[#00ff41] shadow-2xl pointer-events-auto">
            <Zap size={13} className="animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">LEVEL {level}</span>
          </div>

          {/* Top Right: Lives Indicator & Exit */}
          <div className="flex flex-col items-end gap-3 pointer-events-auto">
            <div className="p-4 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col gap-2.5 shadow-2xl">
              <span className="text-[10px] uppercase opacity-50 tracking-widest font-bold text-right">LIVES</span>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    size={16}
                    className={`transition-all duration-300 ${
                      i < lives 
                        ? 'text-red-500 fill-red-500 filter drop-shadow-[0_0_4px_rgba(239,68,68,0.5)] scale-100' 
                        : 'text-white/20 fill-none scale-90'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <button
              onClick={handleExit}
              className="p-3 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-white hover:text-red-500 hover:border-red-500/40 transition-all shadow-xl cursor-pointer"
              title="Beenden"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Side Panel HUD: Skin Color Selector (Only visible during gameplay) */}
      {isPlaying && !gameOver && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 p-3.5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md text-white shadow-2xl pointer-events-auto">
          <span className="text-[9px] uppercase opacity-40 tracking-wider text-center font-bold pb-2 border-b border-white/5 mb-1">
            CORE COLOR
          </span>

          {/* Skin 1: Neon Green (Default) */}
          <button
            onClick={() => setSelectedColor('green')}
            className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer shadow-lg active:scale-90
              ${selectedColor === 'green' 
                ? 'border-[#00ff41] bg-[#00ff41]/20 scale-105 shadow-[0_0_12px_rgba(0,255,65,0.4)]' 
                : 'border-white/20 hover:border-white/50 bg-[#00ff41]/5'}`}
            title="Neon Green"
          >
            <div className="w-4 h-4 rounded-full bg-[#00ff41]" />
          </button>

          {/* Skin 2: Neon Yellow (Unlocked at 500) */}
          <button
            onClick={() => unlockedYellow && setSelectedColor('yellow')}
            className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center shadow-lg relative active:scale-90
              ${!unlockedYellow ? 'opacity-40 cursor-not-allowed bg-black/40 border-white/10' : 'cursor-pointer'}
              ${selectedColor === 'yellow' && unlockedYellow 
                ? 'border-[#ffd700] bg-[#ffd700]/20 scale-105 shadow-[0_0_12px_rgba(255,215,0,0.4)]' 
                : unlockedYellow 
                  ? 'border-white/20 hover:border-white/50 bg-[#ffd700]/5' 
                  : ''}`}
            title={unlockedYellow ? "Neon Yellow" : "Locked (500 pts)"}
          >
            {unlockedYellow ? (
              <div className="w-4 h-4 rounded-full bg-[#ffd700]" />
            ) : (
              <Lock size={12} className="text-white/55" />
            )}
          </button>

          {/* Skin 3: Neon Pink (Unlocked at 1500) */}
          <button
            onClick={() => unlockedPink && setSelectedColor('pink')}
            className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center shadow-lg relative active:scale-90
              ${!unlockedPink ? 'opacity-40 cursor-not-allowed bg-black/40 border-white/10' : 'cursor-pointer'}
              ${selectedColor === 'pink' && unlockedPink 
                ? 'border-[#ff007f] bg-[#ff007f]/20 scale-105 shadow-[0_0_12px_rgba(255,0,127,0.4)]' 
                : unlockedPink 
                  ? 'border-white/20 hover:border-white/50 bg-[#ff007f]/5' 
                  : ''}`}
            title={unlockedPink ? "Neon Pink" : "Locked (1500 pts)"}
          >
            {unlockedPink ? (
              <div className="w-4 h-4 rounded-full bg-[#ff007f]" />
            ) : (
              <Lock size={12} className="text-white/55" />
            )}
          </button>
        </div>
      )}

      {/* Main Start Menu / Game Over Screen Overlay */}
      {(!isPlaying) && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-md p-8 rounded-3xl border border-white/10 bg-[#050505]/95 text-white shadow-[0_0_50px_rgba(0,255,65,0.1)] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
            {/* Logo Motif inside Menu */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#00ff41]/5 border border-[#00ff41]/20 shadow-[0_0_20px_rgba(0,255,65,0.12)] mb-6 animate-pulse">
              <Zap size={36} className="text-[#00ff41]" />
            </div>

            <h1 className="text-3xl font-syne font-extrabold tracking-tighter uppercase mb-2">
              NEON BLOB RUN
            </h1>
            
            <p className="text-xs text-white/55 tracking-widest uppercase mb-8">
              Generative Jump & Physics Arcade
            </p>

            {/* HIGH SCORE display */}
            <div className="w-full flex justify-around border border-white/5 py-4 rounded-2xl bg-white/[0.02] mb-8 font-mono">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase opacity-40">Personal Best</span>
                <span className="text-lg font-bold text-[#00ff41]">{highScore}</span>
              </div>
              <div className="w-px bg-white/10" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase opacity-40">Difficulty</span>
                <span className="text-lg font-bold text-yellow-400">Dynamic</span>
              </div>
            </div>

            {/* Instruction manual */}
            <div className="w-full text-left text-[10px] space-y-2 opacity-60 leading-relaxed border-t border-white/5 pt-4 mb-8 font-mono">
              <p>• <strong>DESKTOP:</strong> Mouse Pointer moves. <span className="underline">Up-Arrow</span> or <span className="underline">Spacebar</span> jumps. Press twice to Double Jump!</p>
              <p>• <strong>MOBILE:</strong> Drag anywhere to guide the blob. <span className="underline">Tap / Swipe Up</span> to jump!</p>
              <p>• <strong>GOAL:</strong> Avoid expanding red energy rings & collect golden crystal shards to unlock neon gel cores.</p>
            </div>

            {/* Actions */}
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={startGame}
                className="w-full py-4 rounded-xl bg-[#00ff41] text-black font-syne font-bold uppercase tracking-wider text-sm transition-all hover:scale-[1.02] hover:bg-[#00cc33] active:scale-95 shadow-[0_0_20px_rgba(0,255,65,0.3)] cursor-pointer flex items-center justify-center gap-2"
              >
                <Play size={16} fill="black" /> {gameOver ? 'AGAIN / PLAY' : 'LAUNCH GAME'}
              </button>

              <button
                onClick={handleExit}
                className="w-full py-4 rounded-xl border border-white/15 bg-transparent text-white/70 font-syne font-bold uppercase tracking-wider text-xs transition-all hover:bg-white/5 cursor-pointer"
              >
                RETURN TO HOME
              </button>
            </div>

            {/* GAME OVER CARD ADDITION */}
            {gameOver && (
              <div className="absolute inset-x-6 top-6 bottom-6 rounded-2xl bg-black/95 border border-red-500/20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/30 text-red-500 mb-4 animate-bounce">
                  <Heart size={22} />
                </div>
                <h2 className="text-2xl font-syne font-extrabold uppercase text-red-500 mb-1">GAME OVER</h2>
                <p className="text-[10px] text-white/55 tracking-wider uppercase mb-6">Capacitive core depleted</p>
                
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] w-full mb-6 font-mono text-center space-y-1">
                  <div className="text-[10px] opacity-40 uppercase">FINAL SCORE</div>
                  <div className="text-3xl font-extrabold text-white">{score}</div>
                  {score >= highScore && score > 0 && (
                    <div className="text-[9px] text-[#00ff41] uppercase tracking-widest font-bold pt-1">
                      ★ NEW RECORD! ★
                    </div>
                  )}
                </div>

                <div className="w-full flex flex-col gap-3">
                  <button
                    onClick={startGame}
                    className="w-full py-4 rounded-xl bg-red-500 text-white font-syne font-bold uppercase tracking-wider text-sm transition-all hover:scale-[1.02] hover:bg-red-600 active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.3)] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} className="animate-spin-slow" /> RETRY MISSION
                  </button>
                  <button
                    onClick={handleExit}
                    className="w-full py-4 rounded-xl border border-white/10 bg-transparent text-white/60 font-syne font-bold uppercase tracking-wider text-xs transition-all hover:bg-white/5 cursor-pointer"
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
  );
};

export default GameView;
