import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createRendererSafely } from '../utils/webgl';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

let globalCachedEnvMap = null;

const ShellBlob = ({ isThinking, darkMode, className = "" }) => {
  const mountRef = useRef(null);
  const timeUniformRef = useRef({ value: 0 });
  const velocityUniformRef = useRef({ value: 1.0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // --- SETUP ---
    const scene = new THREE.Scene();

    // Make background transparent so it blends into the UI
    const renderer = createRendererSafely(() => new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }));
    // No context on this machine: leave the slot empty rather than throw.
    if (!renderer) return undefined;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    // Size based on parent container
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 300);
    camera.position.set(0, 0, 8);

    // --- SHADER INJEKTION ---
    const timeUniform = timeUniformRef.current;
    const velocityUniform = velocityUniformRef.current;

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

    // --- MATERIALIEN ---
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
    
    // Liquid Material reacts to darkMode
    const neonGreen = 0xC7FF2E;
    const neonBlue = 0x0055ff;
    const liquidColor = darkMode ? neonGreen : neonBlue;
    const attenuationColor = darkMode ? 0x9FCC25 : 0x0033cc;
    const emissiveColor = darkMode ? 0x283309 : 0x001133;

    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: liquidColor,
      metalness: 0.2,
      roughness: 0.04,
      transmission: 0.9,
      thickness: 1.2,
      attenuationColor: new THREE.Color(attenuationColor),
      attenuationDistance: 0.8,
      ior: 1.4,
      side: THREE.DoubleSide,
      clearcoat: 1.0,
      emissive: emissiveColor,
      emissiveIntensity: 0.2
    });
    liquidMaterial.onBeforeCompile = (shader) => injectBlobShader(shader, 0.06, 1.4, 1.5, true);

    // --- OBJEKTE ---
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

    // --- LICHT & BELEUCHTUNG ---
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

    // HDRI für Glas-Reflektionen
    if (globalCachedEnvMap) {
      scene.environment = globalCachedEnvMap;
    } else {
      // Corporate networks block third-party CDNs; the blob simply keeps its
      // lighting rather than the load failing loudly.
      new RGBELoader().load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        globalCachedEnvMap = texture;
        scene.environment = texture; 
        scene.environment.blur = 0.8; 
      }, undefined, () => {
        // Blocked or offline: the lights already in the scene carry it.
      });
    }

    // --- LOOP ---
    const clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      
      // Shader Zeit aktualisieren
      timeUniform.value = time;
      
      // Pulsierende Shader-"Geschwindigkeit" simulieren
      const thinkingFactor = isThinking ? 2.5 : 1.0;
      velocityUniform.value = 1.0 + Math.sin(time * thinkingFactor) * 0.5;

      // Sanftes Schweben und Rotieren
      blobGroup.position.y = Math.sin(time * 1.5) * 0.2;
      blobGroup.rotation.y = time * 0.2 * thinkingFactor;
      blobGroup.rotation.z = Math.sin(time * 0.5) * 0.1;
      
      // Innerer Kern dreht sich leicht gegenläufig
      innerCore.rotation.x = -time * 0.3 * thinkingFactor;
      innerCore.rotation.y = time * 0.1 * thinkingFactor;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (mountRef.current) {
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      outerGeometry.dispose();
      innerGeometry.dispose();
      glassMaterial.dispose();
      liquidMaterial.dispose();
    };
  }, [darkMode, isThinking]);

  return (
    <div 
      ref={mountRef} 
      className={`relative flex items-center justify-center transition-all duration-500 overflow-visible ${className} ${isThinking ? 'scale-125 drop-shadow-[0_0_15px_rgba(199,255,46,0.6)]' : 'scale-100 drop-shadow-md'}`}
    />
  );
};

export default ShellBlob;
