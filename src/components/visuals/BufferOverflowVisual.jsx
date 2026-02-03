import { useEffect, useRef } from 'react';
import * as THREE from 'three';

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
        ctx.translate(0, i * lineHeight + lineHeight / 2);
        ctx.scale(scaleFactor, 1);
        ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
        ctx.shadowBlur = 5;
        for (let r = 0; r < repetitions; r++) {
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
      return Math.sin(x * 0.4) * 0.2;
    }

    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1);
      const angle = t * Math.PI * 4;
      const radius = maxRadius - t * maxRadius * 0.7;
      const x = Math.cos(angle) * radius;
      const z = -t * 60;
      const y = getSurfaceY(x);
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 400, tubeRadius, 16, false);

    const material = new THREE.MeshStandardMaterial({
      map: typoTexture,
      emissive: new THREE.Color(0x111111),
      emissiveIntensity: 0.8,
      side: THREE.DoubleSide,
      roughness: 0.4,
      metalness: 0.2,
    });

    const tube = new THREE.Mesh(geometry, material);
    scene.add(tube);

    let animationFrameId;
    let time = 0;

    const animate = () => {
      time += 0.004;
      tube.rotation.z = Math.sin(time * 0.3) * 0.2;
      tube.rotation.x = Math.cos(time * 0.2) * 0.1;
      tube.material.map.offset.y -= 0.002;

      camera.position.z = 10 + Math.sin(time * 0.5) * 0.3;
      camera.position.y = 5 + Math.sin(time * 0.4) * 0.5;
      camera.lookAt(0, 0, -10);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

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

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      if (scene) {
        scene.traverse((object) => {
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

      if (typoTexture) typoTexture.dispose();

      if (renderer) {
        renderer.dispose();
        const gl = renderer.getContext();
        if (gl && gl.getExtension('WEBGL_lose_context')) {
          gl.getExtension('WEBGL_lose_context').loseContext();
        }
      }

      if (mountRef.current && renderer?.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer = null;
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full relative bg-black overflow-hidden">
      <div ref={overlayRef} className="absolute inset-0 bg-black opacity-0 pointer-events-none z-[100] transition-opacity duration-100 ease-linear" />
      <div className="absolute inset-0 z-[5] pointer-events-none" style={{
        background: `linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))`,
        backgroundSize: '100% 3px',
      }} />
    </div>
  );
};

export default BufferOverflowVisual;
