import { useEffect, useRef, useState } from 'react';
import { X, Trophy, Zap, Play, Lock, Heart, RefreshCw } from 'lucide-react';
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// --- GAME PARAMETERS ---
const OUTER_RADIUS = 1.4;
const INNER_RADIUS = 0.55;
const LANES = [-3.5, 0, 3.5]; // Left, Center, Right
const TRACK_Y = -1.6;
const BLOB_START_Y = TRACK_Y + OUTER_RADIUS; // Standing position

// Physics
const GRAVITY = -48.0;
const JUMP_FORCE = 16.5;

const GameView = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // React Game states
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [selectedColor, setSelectedColor] = useState('green'); // 'green', 'yellow', 'pink'
  const [unlockedYellow, setUnlockedYellow] = useState(false);
  const [unlockedPink, setUnlockedPink] = useState(false);

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
    speed: 35.0, // Scroll speed
    lastObstacleSpawn: 0,
    lastCrystalSpawn: 0
  });

  // Fetch local High Score on Mount
  useEffect(() => {
    const saved = localStorage.getItem('vanhees_runner_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Update unlocked states
  useEffect(() => {
    if (score >= 500 && !unlockedYellow) setUnlockedYellow(true);
    if (score >= 1500 && !unlockedPink) setUnlockedPink(true);
  }, [score, unlockedYellow, unlockedPink]);

  // Sync selectedColor and lives to stateRef
  useEffect(() => {
    stateRef.current.activeColor = selectedColor;
  }, [selectedColor]);

  // Audio synthesis engine for latency-free chiptunes
  const playSynthSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
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
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(698.46, ctx.currentTime + 0.08); // F5
        osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.16); // A5
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
      // Browsers might block AudioContext until user gesture
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
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
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

    // 5. HDRI Loader
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.environment.blur = 0.5;
      },
      undefined,
      (err) => console.log("Procedural reflections loaded.")
    );

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

    // 7. Translucent Glass Track
    const trackGeometry = new THREE.PlaneGeometry(12, 140);
    const trackMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x051a08, // deep emerald green
      metalness: 0.3,
      roughness: 0.2,
      transmission: 0.8,
      thickness: 1.0,
      side: THREE.DoubleSide,
      clearcoat: 1.0,
      transparent: true
    });

    // Inject scrolling grid coordinates directly into track vertex/fragment compilation
    trackMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = timeUniform.current;
      shader.vertexShader = `uniform float uTime;\nvarying vec2 vScrollUV;\n` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <uv_vertex>',
        `
        #include <uv_vertex>
        vScrollUV = uv;
        `
      );
      shader.fragmentShader = `uniform float uTime;\nvarying vec2 vScrollUV;\n` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `
        #include <map_fragment>
        // Scroll coordinate offset based on time
        float scroll = vScrollUV.y * 35.0 - uTime * 7.5;
        float gridX = step(0.96, sin(vScrollUV.x * 3.1415 * 3.0));
        float gridY = step(0.96, sin(scroll));
        float combinedGrid = max(gridX, gridY);
        diffuseColor.rgb += vec3(0.0, 1.0, 0.25) * combinedGrid * 0.4;
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

    const leftBarrier = new THREE.Mesh(barrierGeo, barrierMat);
    leftBarrier.position.set(-6, TRACK_Y + 0.2, -40);
    scene.add(leftBarrier);

    const rightBarrier = new THREE.Mesh(barrierGeo, barrierMat);
    rightBarrier.position.set(6, TRACK_Y + 0.2, -40);
    scene.add(rightBarrier);

    // 8. --- HIGH-END PHYSICS NEON BLOB ---
    const outerGeometry = new THREE.SphereGeometry(OUTER_RADIUS, 96, 96);
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

    // Inner Core
    const innerGeometry = new THREE.SphereGeometry(INNER_RADIUS, 96, 96);
    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xccffcc,
      metalness: 0.2,
      roughness: 0.04,
      transmission: 0.9,
      thickness: 1.2,
      attenuationColor: new THREE.Color(0x00cc41),
      attenuationDistance: 0.8,
      ior: 1.4,
      side: THREE.DoubleSide,
      clearcoat: 1.0,
      emissive: 0x003311,
      emissiveIntensity: 0.25
    });

    liquidMaterial.onBeforeCompile = (shader) => injectBlobShader(shader, 0.065, 1.4, 1.5, true);
    const innerCore = new THREE.Mesh(innerGeometry, liquidMaterial);
    playerGroup.add(innerCore);

    // Save references to dynamically swap core material properties
    innerBlobMaterial.current = liquidMaterial;

    // 9. Shared Obstacles & Crystals Templates
    obstacleGeom.current = new THREE.BoxGeometry(2.0, 1.6, 1.2);
    obstacleMat.current = new THREE.MeshPhysicalMaterial({
      color: 0xff003c, // Glowing red warning barriers
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.75,
      thickness: 0.8,
      emissive: 0x550005,
      emissiveIntensity: 0.4
    });

    crystalGeom.current = new THREE.OctahedronGeometry(0.55, 0);
    crystalMat.current = new THREE.MeshPhysicalMaterial({
      color: 0xffd700, // Shiny gold crystals
      metalness: 0.9,
      roughness: 0.08,
      clearcoat: 1.0,
      emissive: 0x775500,
      emissiveIntensity: 0.5
    });

    // 10. Handle window resizing
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Keyboard handlers
    const handleKeyDown = (e) => {
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

    // --- CONTINUOUS GAMEPLAY AND preview LOOP ---
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

      // Live swap core color configs
      if (innerBlobMaterial.current) {
        const liquidColorMap = {
          green: { color: 0xccffcc, attenuation: 0x00ff41, emissive: 0x004411 },
          yellow: { color: 0xffffcc, attenuation: 0xffd700, emissive: 0x443300 },
          pink: { color: 0xffcccc, attenuation: 0xff007f, emissive: 0x440022 }
        };
        const config = liquidColorMap[stateRef.current.activeColor] || liquidColorMap.green;
        innerBlobMaterial.current.color.setHex(config.color);
        innerBlobMaterial.current.attenuationColor.setHex(config.attenuation);
        innerBlobMaterial.current.emissive.setHex(config.emissive);
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

        // Smooth squash scale deformation when jumping
        const squashScale = 1.0 - Math.min(0.25, Math.abs(state.verticalVelocity) * 0.015);
        playerGroup.scale.set(1.0, squashScale, 1.0);

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

        // Speed increases with level
        const currentSpeed = 30.0 + state.level * 4.5;

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

        // Increment score gradually
        setScore(prev => {
          const next = prev + 1;
          state.score = next;
          const nextLevel = Math.floor(next / 200) + 1;
          if (nextLevel > state.level) {
            setLevel(nextLevel);
            state.level = nextLevel;
          }
          return next;
        });

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
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);

      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);

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
    setScore(prev => {
      const next = prev + 50;
      stateRef.current.score = next;
      return next;
    });
  };

  // Game over state handler
  const triggerGameOver = () => {
    const state = stateRef.current;
    state.gameOver = true;
    setIsPlaying(false);
    setGameOver(true);
    playSynthSound('gameover');

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
    
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLives(3);

    state.score = 0;
    state.level = 1;
    state.lives = 3;
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

  // Return to home
  const handleExit = () => {
    const state = stateRef.current;
    state.isPlaying = false;
    state.gameOver = false;
    
    setIsPlaying(false);
    setGameOver(false);

    // Clear active obstacles/crystals
    obstacles.current.forEach(obs => {
      if (sceneRef.current) sceneRef.current.remove(obs.mesh);
    });
    obstacles.current = [];
    crystals.current.forEach(cry => {
      if (sceneRef.current) sceneRef.current.remove(cry.mesh);
    });
    crystals.current = [];

    window.location.hash = '#home';
  };

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full z-40 bg-black overflow-hidden select-none font-mono touch-none">
      {/* 3D WebGL screen */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-10 touch-none" />

      {/* iOS 26 Liquid Glass Minimal HUD */}
      {isPlaying && !gameOver && (
        <div className="absolute inset-x-6 top-6 z-20 flex justify-between items-start pointer-events-none">
          {/* Top Left: Sleek Score Card */}
          <div className="px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl flex flex-col gap-0.5 text-white shadow-2xl pointer-events-auto">
            <span className="text-[9px] uppercase opacity-40 tracking-widest font-bold">SCORE</span>
            <span className="text-xl font-bold tracking-tight">{score}</span>
            <span className="text-[8px] opacity-30 uppercase tracking-widest pt-0.5 border-t border-white/5">BEST: {highScore}</span>
          </div>

          {/* Top Center: Minimal Level Indicator */}
          <div className="px-5 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl flex items-center gap-2 text-[#00ff41] shadow-2xl pointer-events-auto">
            <Zap size={11} className="animate-pulse" />
            <span className="text-[9px] font-bold tracking-widest uppercase">LEVEL {level}</span>
          </div>

          {/* Top Right: Lives and Exit */}
          <div className="flex flex-col items-end gap-3 pointer-events-auto">
            <div className="px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl flex flex-col gap-1.5 shadow-2xl">
              <span className="text-[9px] uppercase opacity-40 tracking-widest font-bold text-right">LIVES</span>
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
              className="p-2.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl text-white/60 hover:text-red-500 hover:border-red-500/30 transition-all shadow-xl cursor-pointer"
              title="Close Runner"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* HUD Skin Color Selector (Floating Glass Cylinder on Right) */}
      {isPlaying && !gameOver && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5 p-3 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl text-white shadow-2xl pointer-events-auto">
          <span className="text-[7px] uppercase opacity-35 tracking-wider text-center font-bold pb-1.5 border-b border-white/5 mb-0.5">COLOR</span>

          {/* Green */}
          <button
            onClick={() => setSelectedColor('green')}
            className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center cursor-pointer shadow active:scale-90
              ${selectedColor === 'green' 
                ? 'border-[#00ff41] bg-[#00ff41]/10 scale-105 shadow-[0_0_8px_rgba(0,255,65,0.3)]' 
                : 'border-white/10 hover:border-white/30 bg-[#00ff41]/5'}`}
            title="Neon Green"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[#00ff41]" />
          </button>

          {/* Yellow */}
          <button
            onClick={() => unlockedYellow && setSelectedColor('yellow')}
            className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center shadow relative active:scale-90
              ${!unlockedYellow ? 'opacity-30 cursor-not-allowed bg-black/40 border-white/5' : 'cursor-pointer'}
              ${selectedColor === 'yellow' && unlockedYellow 
                ? 'border-[#ffd700] bg-[#ffd700]/10 scale-105 shadow-[0_0_8px_rgba(255,215,0,0.3)]' 
                : unlockedYellow 
                  ? 'border-white/10 hover:border-white/30 bg-[#ffd700]/5' 
                  : ''}`}
            title={unlockedYellow ? "Neon Yellow" : "Locked (500 pts)"}
          >
            {unlockedYellow ? (
              <div className="w-3.5 h-3.5 rounded-full bg-[#ffd700]" />
            ) : (
              <Lock size={10} className="text-white/40" />
            )}
          </button>

          {/* Pink */}
          <button
            onClick={() => unlockedPink && setSelectedColor('pink')}
            className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center shadow relative active:scale-90
              ${!unlockedPink ? 'opacity-30 cursor-not-allowed bg-black/40 border-white/5' : 'cursor-pointer'}
              ${selectedColor === 'pink' && unlockedPink 
                ? 'border-[#ff007f] bg-[#ff007f]/10 scale-105 shadow-[0_0_8px_rgba(255,0,127,0.3)]' 
                : unlockedPink 
                  ? 'border-white/10 hover:border-white/30 bg-[#ff007f]/5' 
                  : ''}`}
            title={unlockedPink ? "Neon Pink" : "Locked (1500 pts)"}
          >
            {unlockedPink ? (
              <div className="w-3.5 h-3.5 rounded-full bg-[#ff007f]" />
            ) : (
              <Lock size={10} className="text-white/40" />
            )}
          </button>
        </div>
      )}

      {/* Main Start / Game Over Frosted Glass overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-sm p-8 rounded-3xl border border-white/10 bg-white/[0.01] text-white shadow-[0_0_40px_rgba(0,255,65,0.08)] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
            {/* Glowing menu orb */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#00ff41]/5 border border-[#00ff41]/20 shadow-[0_0_20px_rgba(0,255,65,0.1)] mb-6 animate-pulse">
              <Zap size={28} className="text-[#00ff41]" />
            </div>

            <h1 className="text-2xl font-syne font-extrabold tracking-tighter uppercase mb-1">
              NEON BLOB RUNNER
            </h1>
            
            <p className="text-[8px] text-white/40 tracking-widest uppercase mb-6">
              iOS 26 Liquid Glass Generative Space
            </p>

            {/* Highscore pill */}
            <div className="w-full flex justify-around border border-white/5 py-3 rounded-xl bg-white/[0.01] mb-6 font-mono text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-[8px] uppercase opacity-35">High Score</span>
                <span className="text-sm font-bold text-[#00ff41]">{highScore}</span>
              </div>
              <div className="w-px bg-white/10" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[8px] uppercase opacity-35">Engine</span>
                <span className="text-sm font-bold text-[#00ff41]">WebGL 3D</span>
              </div>
            </div>

            {/* User instructions */}
            <div className="w-full text-left text-[9px] space-y-1.5 opacity-55 leading-relaxed border-t border-white/5 pt-4 mb-6 font-mono">
              <p>• <strong>KEYBOARD:</strong> <span className="underline">Left/Right Arrows (or A/D)</span> to change lanes. <span className="underline">Spacebar (or Up Arrow)</span> to jump over obstacles.</p>
              <p>• <strong>TOUCH SCREEN:</strong> <span className="underline">Swipe Left/Right</span> to slide. <span className="underline">Swipe Up / Tap</span> anywhere to jump.</p>
              <p>• <strong>GOAL:</strong> Avoid red warning walls & collect golden crystal shards to unlock neon gel cores.</p>
            </div>

            {/* CTA Glass buttons */}
            <div className="w-full flex flex-col gap-2.5">
              <button
                onClick={startGame}
                className="w-full py-3 px-6 rounded-xl bg-[#00ff41] text-black font-syne font-bold uppercase tracking-wider text-xs transition-all hover:scale-[1.01] hover:bg-[#00cc33] active:scale-95 shadow-[0_0_15px_rgba(0,255,65,0.22)] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play size={12} fill="black" /> {gameOver ? 'RUN AGAIN' : 'START RUNNER'}
              </button>

              <button
                onClick={handleExit}
                className="w-full py-3 px-6 rounded-xl border border-white/10 bg-transparent text-white/50 font-syne font-bold uppercase tracking-wider text-[10px] transition-all hover:bg-white/5 cursor-pointer"
              >
                RETURN TO HOME
              </button>
            </div>

            {/* GAME OVER CARD OVERLAY */}
            {gameOver && (
              <div className="absolute inset-x-5 top-5 bottom-5 rounded-2xl bg-black/98 border border-red-500/20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/25 text-red-500 mb-4 animate-bounce">
                  <Heart size={18} />
                </div>
                <h2 className="text-xl font-syne font-extrabold uppercase text-red-500 mb-0.5">GAME OVER</h2>
                <p className="text-[8px] text-white/40 tracking-wider uppercase mb-5">Capsule core depleted</p>
                
                <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] w-full mb-5 font-mono text-center space-y-0.5">
                  <div className="text-[8px] opacity-35 uppercase">FINAL SCORE</div>
                  <div className="text-2xl font-extrabold text-white">{score}</div>
                  {score >= highScore && score > 0 && (
                    <div className="text-[8px] text-[#00ff41] uppercase tracking-widest font-bold pt-0.5">
                      ★ NEW RECORD ★
                    </div>
                  )}
                </div>

                <div className="w-full flex flex-col gap-2.5">
                  <button
                    onClick={startGame}
                    className="w-full py-3 px-6 rounded-xl bg-red-500 text-white font-syne font-bold uppercase tracking-wider text-xs transition-all hover:scale-[1.01] hover:bg-red-600 active:scale-95 shadow-[0_0_15px_rgba(239,68,68,0.25)] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={11} className="animate-spin-slow" /> RETRY RUN
                  </button>
                  <button
                    onClick={handleExit}
                    className="w-full py-3 px-6 rounded-xl border border-white/10 bg-transparent text-white/50 font-syne font-bold uppercase tracking-wider text-[10px] transition-all hover:bg-white/5 cursor-pointer"
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
