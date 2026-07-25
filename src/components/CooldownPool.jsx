import { useEffect, useRef, useState } from 'react';
import { X, Code, Shield, Eye, Layers, Info } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { playClickSound } from '../utils/clickSound';

const CooldownPool = ({ darkMode, onClose }) => {
  const canvasRef = useRef(null);
  const glCanvasRef = useRef(null);
  const requestRef = useRef(null);
  const glRequestRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false, px: 0, py: 0 });
  const mouseCoords = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  const onWaterClickRef = useRef(null);
  const pointerDownPos = useRef({ x: 0, y: 0 });

  const [loading, setLoading] = useState(true);
  const [isHoveringPool, setIsHoveringPool] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [infoClosed, setInfoClosed] = useState(false);
  const [infoOpenManual, setInfoOpenManual] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- AUDIO EFFECTS: WATER LOOP & PROCEDURAL BUBBLES ---
  useEffect(() => {
    // 1. Water loop
    const waterAudio = new Audio('/water.mp3');
    waterAudio.loop = true;
    waterAudio.volume = 0.35;
    
    const playPromise = waterAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => console.log("Water audio playback blocked:", err));
    }

    // 2. Procedural bubble triggers
    const bubblesAudio = new Audio('/bubbles.mp3');
    bubblesAudio.volume = 0.35;

    const bubbleInterval = setInterval(() => {
      if (Math.random() < 0.45) {
        bubblesAudio.currentTime = 0;
        bubblesAudio.volume = 0.15 + Math.random() * 0.3; // Randomize volume for organic feel
        bubblesAudio.play().catch(err => console.log("Bubbles audio playback blocked:", err));
      }
    }, 7000);

    // Cleanup
    return () => {
      waterAudio.pause();
      waterAudio.currentTime = 0;
      bubblesAudio.pause();
      bubblesAudio.currentTime = 0;
      clearInterval(bubbleInterval);
    };
  }, []);

  // --- 1. 2D VECTOR WAVE HEIGHTMAP ARRAYS ---
  const simWidth = 128;
  const simHeight = 128;
  const size = simWidth * simHeight;
  const buffer1Ref = useRef(new Float32Array(size));
  const buffer2Ref = useRef(new Float32Array(size));

  // Splash helper to inject water height at a coordinate
  const splash = (x, y, r, force) => {
    const buffer = buffer1Ref.current;
    const cx = Math.floor(x);
    const cy = Math.floor(y);

    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const sx = cx + dx;
        const sy = cy + dy;

        if (sx >= 0 && sx < simWidth && sy >= 0 && sy < simHeight) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < r) {
            const idx = sx + sy * simWidth;
            buffer[idx] += (1 - dist / r) * force;
          }
        }
      }
    }
  };

  // --- 2. 2D BACKGROUND GRID ANIMATION EFFECT ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    // Initial drops
    for (let i = 0; i < 6; i++) {
      const rx = Math.random() * (simWidth - 20) + 10;
      const ry = Math.random() * (simHeight - 20) + 10;
      splash(rx, ry, 4, 300 + Math.random() * 300);
    }

    const damping = 0.985;
    let time = 0;

    const render = () => {
      time += 0.01;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      // Gradient backdrop
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      if (darkMode) {
        grad.addColorStop(0, '#020308');
        grad.addColorStop(1, '#050c18');
      } else {
        grad.addColorStop(0, '#f2f6ff');
        grad.addColorStop(1, '#e2ecff');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const b1 = buffer1Ref.current;
      const b2 = buffer2Ref.current;

      // Wave simulation step
      for (let y = 1; y < simHeight - 1; y++) {
        for (let x = 1; x < simWidth - 1; x++) {
          const idx = x + y * simWidth;
          b2[idx] = ((b1[idx - 1] + b1[idx + 1] + b1[idx - simWidth] + b1[idx + simWidth]) / 2) - b2[idx];
          b2[idx] *= damping;
        }
      }

      buffer1Ref.current = b2;
      buffer2Ref.current = b1;

      // Mouse interactive ripple injection
      const mouse = mouseRef.current;
      if (mouse.active) {
        const hx = (mouse.x / width) * simWidth;
        const hy = (mouse.y / height) * simHeight;
        splash(hx, hy, 3, 200);
      }

      // Auto drops
      if (Math.random() < 0.02) {
        const rx = Math.random() * (simWidth - 10) + 5;
        const ry = Math.random() * (simHeight - 10) + 5;
        splash(rx, ry, 2, 100 + Math.random() * 200);
      }

      // Render wireframe vector grid
      const gridCols = 36;
      const gridRows = 24;
      ctx.lineWidth = 1;

      // Horizontal Lines
      for (let r = 0; r < gridRows; r++) {
        ctx.beginPath();
        const gy = (r / (gridRows - 1)) * height;
        const hmy = (r / (gridRows - 1)) * (simHeight - 1);

        for (let c = 0; c < gridCols; c++) {
          const gx = (c / (gridCols - 1)) * width;
          const hmx = (c / (gridCols - 1)) * (simWidth - 1);

          const idx = Math.floor(hmx) + Math.floor(hmy) * simWidth;
          const waveHeight = b1[idx] || 0;
          const dy = waveHeight * 0.14;

          if (c === 0) {
            ctx.moveTo(gx, gy + dy);
          } else {
            ctx.lineTo(gx, gy + dy);
          }
        }
        ctx.strokeStyle = darkMode 
          ? `rgba(136, 204, 255, ${0.22 + Math.abs(Math.sin(time + r * 0.2)) * 0.12})`
          : `rgba(0, 119, 255, ${0.28 + Math.abs(Math.sin(time + r * 0.2)) * 0.12})`;
        ctx.stroke();
      }

      // Vertical Lines
      for (let c = 0; c < gridCols; c++) {
        ctx.beginPath();
        const gx = (c / (gridCols - 1)) * width;
        const hmx = (c / (gridCols - 1)) * (simWidth - 1);

        for (let r = 0; r < gridRows; r++) {
          const gy = (r / (gridRows - 1)) * height;
          const hmy = (r / (gridRows - 1)) * (simHeight - 1);

          const idx = Math.floor(hmx) + Math.floor(hmy) * simWidth;
          const waveHeight = b1[idx] || 0;
          const dy = waveHeight * 0.14;

          if (r === 0) {
            ctx.moveTo(gx, gy + dy);
          } else {
            ctx.lineTo(gx, gy + dy);
          }
        }
        ctx.strokeStyle = darkMode 
          ? `rgba(136, 204, 255, ${0.22 + Math.abs(Math.sin(time + c * 0.2)) * 0.12})`
          : `rgba(0, 119, 255, ${0.28 + Math.abs(Math.sin(time + c * 0.2)) * 0.12})`;
        ctx.stroke();
      }

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [darkMode]);

  // --- 3. THREE.JS 3D GLASS POOL ANIMATION EFFECT ---
  useEffect(() => {
    const canvas = glCanvasRef.current;
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Adjust camera properties for elite composition
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 7, 13);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 6;
    controls.maxDistance = 22;
    controls.target.set(0, 1.2, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent clipping under floor

    // Environment reflections
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloofendal_48d_partly_cloudy_puresky_1k.hdr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.background = texture; // FULL HDR SKY BACKGROUND ACTIVATED
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('Failed to load HDR environment map', err);
        setLoading(false);
      }
    );

    // Directional lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(6, 12, 6);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Ambient light filler
    const ambientLight = new THREE.AmbientLight(0xffffff, darkMode ? 0.35 : 0.6);
    scene.add(ambientLight);

    // Loader textures
    const textureLoader = new THREE.TextureLoader();
    const normalMap = textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/water/Water_1_M_Normal.jpg'
    );
    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(4, 4);

    // Water physical refractive material
    const waterMaterial = new THREE.MeshPhysicalMaterial({
      color: darkMode ? 0x88ccff : 0xaaddff,
      metalness: 0.0,
      roughness: 0.02,
      transmission: 1.0,
      thickness: 1.8,
      ior: 1.333,
      attenuationColor: new THREE.Color(0x00cccc),
      attenuationDistance: 4.0,
      normalMap: normalMap,
      clearcoat: 1.0,
      side: THREE.DoubleSide,
    });

    // Custom GLSL waves shader injection
    waterMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uRipples = { value: [
        new THREE.Vector4(0, 0, 0, 0),
        new THREE.Vector4(0, 0, 0, 0),
        new THREE.Vector4(0, 0, 0, 0),
        new THREE.Vector4(0, 0, 0, 0)
      ] };
      waterMaterial.userData.shader = shader;

      shader.vertexShader = `
        varying vec3 vLocalPos;
        uniform float uTime;
        uniform vec4 uRipples[4]; // xy = local XZ center, z = spawnTime, w = active (1.0)

        vec3 getWaveOffset(vec3 p) {
          float time = uTime * 1.8;
          vec3 finalPos = vec3(0.0);
          
          float dist = length(p.xz);
          float agitation = smoothstep(0.0, 4.0, dist) * 0.7 + 0.3;
          float w1 = sin(p.x * 2.5 + time) * 0.035 * agitation;
          float w2 = cos(p.z * 2.0 + time * 1.1) * 0.035 * agitation;
          finalPos.y += w1 + w2;

          // Sum up active radial ripples from clicks
          for (int i = 0; i < 4; i++) {
            if (uRipples[i].w > 0.5) {
              float rippleDist = distance(p.xz, uRipples[i].xy);
              float age = time - uRipples[i].z * 1.8;
              if (age > 0.0 && age < 6.0) {
                // Wave propagation: speed = 1.5 units/second
                float waveFront = age * 1.5;
                float distToWaveFront = abs(rippleDist - waveFront);
                
                // Gaussian envelope for the wave front ripple
                float rippleHeight = sin(rippleDist * 12.0 - age * 8.0) * 0.08;
                float envelope = exp(-distToWaveFront * distToWaveFront * 12.0); // sharp wave front
                float ageFade = smoothstep(6.0, 0.0, age); // fade out over 6 seconds
                
                finalPos.y += rippleHeight * envelope * ageFade;
              }
            }
          }

          return finalPos;
        }
      ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vLocalPos = position; 
        
        bool isTop = position.y > 0.9; 

        if (isTop) {
          vec3 waveOffset = getWaveOffset(position);
          transformed.y += waveOffset.y;

          float d = 0.05;
          vec3 pX = position + vec3(d, 0.0, 0.0);
          vec3 pZ = position + vec3(0.0, 0.0, d);
          vec3 wX = getWaveOffset(pX);
          vec3 wZ = getWaveOffset(pZ);
          vec3 pOrg = position + vec3(0.0, waveOffset.y, 0.0);
          vec3 vX = (pX + vec3(0.0, wX.y, 0.0)) - pOrg;
          vec3 vZ = (pZ + vec3(0.0, wZ.y, 0.0)) - pOrg;
          objectNormal = normalize(cross(vZ, vX));
        }
        `
      );
    };

    const waterGeometry = new THREE.CylinderGeometry(3.9, 3.9, 2.0, 128, 64);
    const waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
    waterMesh.position.y = 1.5;
    waterMesh.castShadow = true;
    waterMesh.renderOrder = 0;
    scene.add(waterMesh);

    // Glass material for pool basin and glass floor plate
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: darkMode ? 0xffffff : 0xeeeeee,
      metalness: 0.0,
      roughness: 0.04,
      transmission: 1.0,
      transparent: true,
      opacity: darkMode ? 0.25 : 0.35,
      depthWrite: false,
      ior: 1.52,
      side: THREE.FrontSide,
      clearcoat: 1.0,
    });

    // Glass pool basin
    const points = [];
    const floorThickness = 0.5;
    const outerRadius = 4.5;
    const height = 3.0;
    points.push(new THREE.Vector2(0.001, 0));
    points.push(new THREE.Vector2(outerRadius, 0));
    points.push(new THREE.Vector2(outerRadius, height));
    points.push(new THREE.Vector2(4.0, height));
    points.push(new THREE.Vector2(4.0, floorThickness));
    points.push(new THREE.Vector2(0.001, floorThickness));

    const basinGeometry = new THREE.LatheGeometry(points, 64);
    const basin = new THREE.Mesh(basinGeometry, glassMaterial);
    basin.castShadow = true;
    basin.receiveShadow = true;
    basin.renderOrder = 1;
    scene.add(basin);

    // Glass floor plate
    const glassFloorGeometry = new THREE.CylinderGeometry(40, 40, 0.4, 64);
    const glassFloor = new THREE.Mesh(glassFloorGeometry, glassMaterial);
    glassFloor.position.y = -0.2;
    glassFloor.receiveShadow = true;
    scene.add(glassFloor);

    // 3D Interactive Ripples State
    const activeRipples = [
      new THREE.Vector4(0, 0, 0, 0),
      new THREE.Vector4(0, 0, 0, 0),
      new THREE.Vector4(0, 0, 0, 0),
      new THREE.Vector4(0, 0, 0, 0)
    ];
    let nextRippleIndex = 0;

    const clickRaycaster = new THREE.Raycaster();
    const clickMouse = new THREE.Vector2();

    onWaterClickRef.current = (e) => {
      const glCanvas = glCanvasRef.current;
      if (!glCanvas) return;
      const rect = glCanvas.getBoundingClientRect();
      
      // Calculate normalized device coordinates
      clickMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      clickMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      clickRaycaster.setFromCamera(clickMouse, camera);

      // Check intersections with waterMesh
      const intersects = clickRaycaster.intersectObject(waterMesh);
      if (intersects.length > 0) {
        const intersection = intersects[0];
        
        // We only want to trigger ripples if we click/tap on the top surface of the pool (world Y > 2.4)
        if (intersection.point.y > 2.4) {
          const localPoint = waterMesh.worldToLocal(intersection.point.clone());
          
          const t = clock.getElapsedTime();
          activeRipples[nextRippleIndex].set(localPoint.x, localPoint.z, t, 1.0);
          nextRippleIndex = (nextRippleIndex + 1) % 4;

          playClickSound('click');
        }
      }
    };

    // Render loop
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Update shader uniforms using cloned array to ensure Three.js re-uploads to GPU
      if (waterMaterial.userData.shader) {
        waterMaterial.userData.shader.uniforms.uTime.value = time;
        waterMaterial.userData.shader.uniforms.uRipples.value = activeRipples.map(r => r.clone());
      }

      // Normal map offsets
      if (waterMaterial.normalMap) {
        waterMaterial.normalMap.offset.x = time * 0.015;
        waterMaterial.normalMap.offset.y = time * 0.008;
      }

      // Raycast to check hover
      raycaster.current.setFromCamera(mouseCoords.current, camera);
      const intersects = raycaster.current.intersectObjects([basin, waterMesh]);
      setIsHoveringPool(intersects.length > 0);

      controls.update();
      renderer.render(scene, camera);

      glRequestRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup resources
    return () => {
      window.removeEventListener('resize', handleResize);
      if (glRequestRef.current) cancelAnimationFrame(glRequestRef.current);
      
      controls.dispose();
      basinGeometry.dispose();
      glassFloorGeometry.dispose();
      waterGeometry.dispose();
      glassMaterial.dispose();
      waterMaterial.dispose();
      if (normalMap) normalMap.dispose();
      renderer.dispose();
    };
  }, [darkMode]);

  // Pointer interactions
  const handlePointerDown = (e) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current.active = true;
    mouseRef.current.x = x;
    mouseRef.current.y = y;

    const hx = (x / rect.width) * simWidth;
    const hy = (y / rect.height) * simHeight;
    splash(hx, hy, 5, 550);
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current.x = x;
    mouseRef.current.y = y;

    // Raycast normalized coordinates [-1, 1]
    mouseCoords.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseCoords.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const handlePointerUp = (e) => {
    mouseRef.current.active = false;

    // Only trigger water ripple click if pointer did not move much (i.e. click/tap, not drag to orbit)
    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    const moveDist = Math.sqrt(dx * dx + dy * dy);

    if (moveDist < 6) {
      if (onWaterClickRef.current) {
        onWaterClickRef.current(e);
      }
    }
  };

  // Keyboard shortcut listener (ESC exits cooldown)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 w-full h-full z-[100] overflow-hidden select-none bg-black animate-in fade-in duration-500"
      style={{ touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* 2D Background Math Vector Lines Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-15" 
      />

      {/* 3D Foreground Three.js WebGL Glass Pool Canvas */}
      <canvas 
        ref={glCanvasRef} 
        className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing" 
        style={{ touchAction: 'none' }}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm transition-opacity duration-300">
          <div className={`p-8 rounded-3xl border flex flex-col items-center gap-4 text-center max-w-xs
            ${darkMode 
              ? 'bg-black/90 border-[#00FF41]/20 text-[#00FF41]' 
              : 'bg-white/95 border-[#0055FF]/20 text-[#0055FF]'}`}
          >
            <div className="w-8 h-8 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <p className="font-meta text-xs uppercase tracking-widest">[ COOLDOWN_POOL: LOADING_3D_ASSETS ]</p>
          </div>
        </div>
      )}

      {/* Interactive Raycast Hover Info Card */}
      <div 
        className={`absolute bottom-24 left-6 right-6 md:left-6 md:right-auto z-40 max-w-sm font-meta text-[10px] md:text-xs transition-all duration-500 ease-out transform pointer-events-none
          ${(infoOpenManual || (!isMobileDevice && isHoveringPool && !infoClosed)) 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-95'}`}
      >
        <div className={`p-5 md:p-6 rounded-2xl border shadow-2xl backdrop-blur-md flex flex-col gap-2.5 pointer-events-auto
          ${darkMode 
            ? 'bg-black/85 border-[#00FF41]/35 text-[#00FF41] shadow-[0_0_40px_rgba(0,255,65,0.15)] shadow-black/80' 
            : 'bg-white/90 border-[#0055FF]/35 text-[#0055FF] shadow-[0_0_30px_rgba(0,85,255,0.15)] shadow-black/10'}`}
        >
          <div className="flex justify-between items-center border-b border-current pb-2">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] md:text-xs">
              <button 
                onClick={() => {
                  setInfoClosed(true);
                  setInfoOpenManual(false);
                  playClickSound('close');
                }}
                className="w-6 h-6 md:w-3.5 md:h-3.5 rounded-full bg-[#FF5F56] hover:bg-[#E0443E] transition-all cursor-pointer border-none p-0 flex items-center justify-center pointer-events-auto text-black/60 font-bold active:scale-90"
                title="Schließen"
              >
                <span className="text-xs md:text-[8px] md:hidden">×</span>
              </button>
              <Code size={14} className="ml-1.5 animate-pulse" />
              <span>[ SYSTEM CORE: GLASS LIQUID BASIN ]</span>
            </div>
          </div>
          <p className="leading-relaxed opacity-95 text-[11px]">
            Designed, developed, and mathematically modeled by <strong className="underline">Joel van Hees</strong>.
          </p>
          <div className="space-y-1.5 opacity-80 leading-normal text-[10px] md:text-[10px] pt-1">
            <p>• <strong>Basin Architecture:</strong> Procedural <span className="underline">LatheGeometry</span> defining 64 structural glass vectors.</p>
            <p>• <strong>Fluid Physics:</strong> Cylinder volume deforms using a custom GLSL vertex shader inject performing real-time multi-frequency sine wave calculations.</p>
            <p>• <strong>Optics:</strong> PBR <span className="underline">MeshPhysicalMaterial</span> utilizing dual-refractive layers, glass clearcoat (1.0), water thickness (1.8), and specific index-of-refraction indices (IOR: 1.33 / 1.52).</p>
            <p>• <strong>Lighting & Environment:</strong> ACES Filmic Tone Mapping and PCF Soft Shadows combined with kloofendal partly cloudy HDR sky mapping.</p>
          </div>
        </div>
      </div>

      {/* Floating Center / Top Panel HUD (Minimized so user can fully enjoy 3D space) */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center z-30 w-full px-6 text-center">
        <div className={`px-5 py-2.5 rounded-full border shadow-xl backdrop-blur-md flex items-center gap-3 pointer-events-auto transition-all transform hover:scale-105 duration-300
          ${darkMode 
            ? 'bg-black/75 border-[#00FF41]/20 text-[#00FF41] shadow-black/65' 
            : 'bg-white/80 border-[#0055FF]/20 text-[#0055FF] shadow-black/10'}`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <h2 className="text-[10px] md:text-xs font-meta uppercase tracking-widest font-bold">
            [ SENSORY COOLDOWN POOL ACTIVE ]
          </h2>
          <span className="hidden md:inline text-[9px] opacity-40">|</span>
          <span className="hidden md:inline text-[9px] font-meta opacity-60 uppercase">ORBIT: LEFT-DRAG  •  PAN: RIGHT-DRAG  •  ZOOM: SCROLL</span>
        </div>
      </div>

      {/* Action panel at the bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3">
        <button
          onClick={() => { onClose(); playClickSound('close'); }}
          className={`px-8 py-4 rounded-xl font-meta text-xs uppercase tracking-widest font-bold border transition-all cursor-pointer hover:shadow-2xl active:scale-95 shadow-lg
            ${darkMode 
              ? 'border-[#00FF41] text-black bg-[#00FF41] hover:bg-transparent hover:text-[#00FF41] hover:shadow-[0_0_20px_rgba(0,255,65,0.35)] shadow-black/60' 
              : 'border-[#0055FF] text-white bg-[#0055FF] hover:bg-transparent hover:text-[#0055FF] hover:shadow-[0_0_20px_rgba(0,85,255,0.35)] shadow-black/15'}`}
        >
          END COOLDOWN
        </button>
      </div>

      {/* Floating Info Toggle Button (perfectly visible on both mobile and desktop) */}
      <button
        onClick={() => {
          setInfoOpenManual(prev => !prev);
          setInfoClosed(false);
          playClickSound('click');
        }}
        title="Details anzeigen"
        className={`absolute bottom-6 left-6 p-4 rounded-full border shadow-2xl z-40 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center
          ${darkMode 
            ? 'bg-black/80 border-[#00FF41]/40 text-[#00FF41] hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]' 
            : 'bg-white/90 border-[#0055FF]/40 text-[#0055FF] hover:shadow-[0_0_20px_rgba(0,85,255,0.4)]'}`}
      >
        <Info size={18} />
      </button>

      {/* Top right close button */}
      <button 
        onClick={() => { onClose(); playClickSound('close'); }}
        title="Exit Cooldown (ESC)"
        className={`absolute top-6 right-6 p-3 rounded-full border z-40 transition-all hover:scale-110 active:scale-95 shadow-lg cursor-pointer
          ${darkMode 
            ? 'bg-black/80 border-white/10 text-white hover:text-[#00FF41] hover:border-[#00FF41]/40' 
            : 'bg-white/90 border-black/10 text-black hover:text-[#0055FF] hover:border-[#0055FF]/40'}`}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default CooldownPool;
