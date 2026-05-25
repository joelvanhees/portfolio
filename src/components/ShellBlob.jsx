import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

let globalCachedEnvMap = null;

const ShellBlob = ({ isThinking, darkMode, className = "" }) => {
  const mountRef = useRef(null);
  const darkModeRef = useRef(darkMode);
  const isThinkingRef = useRef(isThinking);

  // Keep refs in sync without recreating the Three.js scene
  useEffect(() => { darkModeRef.current = darkMode; }, [darkMode]);
  useEffect(() => { isThinkingRef.current = isThinking; }, [isThinking]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    // --- SETUP ---
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 300);
    camera.position.set(0, 0, 8);

    // --- SHADER INJECTION ---
    const timeUniform = { value: 0 };
    const velocityUniform = { value: 1.0 };

    function injectBlobShader(shader, intensity, frequency, speed, isInner) {
      shader.uniforms.uTime = timeUniform;
      shader.uniforms.uVel = velocityUniform;
      shader.vertexShader = `uniform float uTime; uniform float uVel;\n` + shader.vertexShader;

      const velocityLimit = isInner ? "min(uVel, 1.0)" : "min(uVel, 1.5)";

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        float velFactor = ${velocityLimit};
        
        float breathe = sin(uTime * ${speed.toFixed(1)}) * 0.01;
        
        float noise1 = sin(position.y * ${frequency.toFixed(1)} + uTime * ${speed.toFixed(1)});
        float noise2 = cos(position.x * ${(frequency * 0.9).toFixed(1)} + uTime * ${(speed * 1.1).toFixed(1)});
        float noise3 = sin(position.z * ${(frequency * 1.1).toFixed(1)} + uTime * ${(speed * 0.9).toFixed(1)});
        
        float amp = ${intensity.toFixed(2)} * (1.0 + velFactor * 0.2); 
        float displacement = (noise1 + noise2 + noise3) * amp;
        
        transformed += objectNormal * (displacement + breathe);
        `
      );
    }

    // --- MATERIALS ---
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, 
      metalness: 0.05,
      roughness: 0.12,
      transmission: 1.0, 
      thickness: 2.0,
      ior: 1.5, 
      side: THREE.DoubleSide, 
      clearcoat: 1.0, 
      clearcoatRoughness: 0.1,
      transparent: true,
      envMapIntensity: 0.4,
    });
    glassMaterial.onBeforeCompile = (shader) => injectBlobShader(shader, 0.12, 2.0, 1.2, false);
    
    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00ff66,
      metalness: 0.2,
      roughness: 0.04,
      transmission: 0.9,
      thickness: 1.2,
      attenuationColor: new THREE.Color(0x00cc22),
      attenuationDistance: 0.8,
      ior: 1.4,
      side: THREE.DoubleSide,
      clearcoat: 1.0,
      emissive: 0x003311,
      emissiveIntensity: 0.2
    });
    liquidMaterial.onBeforeCompile = (shader) => injectBlobShader(shader, 0.06, 1.4, 1.5, true);

    // Track current dark mode to only update material when it actually changes
    let prevDarkMode = darkModeRef.current;

    // --- OBJECTS ---
    const OUTER_RADIUS = 1.4;
    const INNER_RADIUS = 0.55; 

    const blobGroup = new THREE.Group();
    scene.add(blobGroup);

    const outerGeometry = new THREE.SphereGeometry(OUTER_RADIUS, 32, 32);
    const outerSphere = new THREE.Mesh(outerGeometry, glassMaterial);
    blobGroup.add(outerSphere);

    const innerGeometry = new THREE.SphereGeometry(INNER_RADIUS, 32, 32);
    const innerCore = new THREE.Mesh(innerGeometry, liquidMaterial);
    blobGroup.add(innerCore);

    // --- LIGHTING ---
    const spotLight = new THREE.SpotLight(0xffffff, 2.0); 
    spotLight.position.set(5, 10, 5);
    scene.add(spotLight);

    const pointLight = new THREE.PointLight(0xaaccff, 1.0, 100);
    pointLight.position.set(-5, 5, -5);
    scene.add(pointLight);

    const fillLight = new THREE.PointLight(0x0044ff, 0.5, 50);
    fillLight.position.set(0, -5, 0);
    scene.add(fillLight);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x000022, 0.3));

    // HDRI for glass reflections
    if (globalCachedEnvMap) {
      scene.environment = globalCachedEnvMap;
    } else {
      new RGBELoader().load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        globalCachedEnvMap = texture;
        scene.environment = texture; 
      });
    }

    // --- RENDER LOOP ---
    const clock = new THREE.Clock();
    let animationId;
    let lastRenderTime = 0;
    const FRAME_INTERVAL = 1000 / 30; // 30fps is smooth enough for the blob

    const animate = (timestamp) => {
      animationId = requestAnimationFrame(animate);

      // Throttle to 30fps
      if (timestamp - lastRenderTime < FRAME_INTERVAL) return;
      lastRenderTime = timestamp;

      const time = clock.getElapsedTime();
      
      timeUniform.value = time;
      
      const thinking = isThinkingRef.current;
      const thinkingFactor = thinking ? 2.5 : 1.0;
      velocityUniform.value = 1.0 + Math.sin(time * thinkingFactor) * 0.5;

      // Update liquid color when darkMode changes (via ref, not re-mount)
      const currentDark = darkModeRef.current;
      if (currentDark !== prevDarkMode) {
        prevDarkMode = currentDark;
        liquidMaterial.color.set(currentDark ? 0x00ff66 : 0x0055ff);
        liquidMaterial.attenuationColor.set(currentDark ? 0x00cc22 : 0x0033cc);
        liquidMaterial.emissive.set(currentDark ? 0x003311 : 0x001133);
        liquidMaterial.needsUpdate = true;
      }

      // Smooth floating and rotation
      blobGroup.position.y = Math.sin(time * 1.5) * 0.2;
      blobGroup.rotation.y = time * 0.2 * thinkingFactor;
      blobGroup.rotation.z = Math.sin(time * 0.5) * 0.1;
      
      innerCore.rotation.x = -time * 0.3 * thinkingFactor;
      innerCore.rotation.y = time * 0.1 * thinkingFactor;

      renderer.render(scene, camera);
    };

    animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (container) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement) {
        try { container.removeChild(renderer.domElement); } catch {}
      }
      renderer.dispose();
      outerGeometry.dispose();
      innerGeometry.dispose();
      glassMaterial.dispose();
      liquidMaterial.dispose();
    };
  }, []); // Empty deps: scene is created once, never torn down

  return (
    <div 
      ref={mountRef} 
      className={`relative flex items-center justify-center overflow-visible ${className} ${isThinking ? 'scale-125' : 'scale-100'}`}
      style={{ transition: 'transform 0.5s ease' }}
    />
  );
};

export default ShellBlob;
