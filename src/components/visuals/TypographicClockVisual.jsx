import { useEffect, useRef } from 'react';
import * as THREE from 'three';

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
    const grd = gCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    gCtx.fillStyle = grd; gCtx.fillRect(0, 0, 32, 32);
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
      spawnObject(-Math.random() * (CLOCK_CONFIG.spawnRange.zStart - CLOCK_CONFIG.spawnRange.zEnd) + CLOCK_CONFIG.spawnRange.zEnd);
    }

    let lastMinute = null;
    let lastSecond = null;
    let animationFrameId;

    function animate() {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const second = now.getSeconds();
      const millis = now.getMilliseconds();

      if (timeRef.current) timeRef.current.innerText = `TIME: ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
      if (hourRef.current) hourRef.current.innerText = hour.toString().padStart(2, '0');
      if (nextHourRef.current) nextHourRef.current.innerText = ((hour + 1) % 24).toString().padStart(2, '0');
      if (progressRef.current) {
        const currentSecondsInHour = (minute * 60) + second + (millis / 1000);
        progressRef.current.style.width = `${(currentSecondsInHour / 3600) * 100}%`;
      }

      objects.forEach((obj) => {
        obj.position.z += CLOCK_CONFIG.speed;
        if (obj.position.z > 20) {
          scene.remove(obj);
          objects.splice(objects.indexOf(obj), 1);
          spawnObject(CLOCK_CONFIG.spawnRange.zStart);
        }
      });

      const minPos = new THREE.Vector3(Math.sin(minute * 0.1047) * 10, Math.cos(minute * 0.1047) * 10, 0);
      const secPos = new THREE.Vector3(Math.sin(second * 0.1047) * 12, Math.cos(second * 0.1047) * 12, 0);
      minOrb.position.copy(minPos);
      secOrb.position.copy(secPos);
      updateTrail(minTrail, minPos);
      updateTrail(secTrail, secPos);

      if (lastMinute !== minute || lastSecond !== second) {
        lastMinute = minute;
        lastSecond = second;
        if (overlayRef.current) {
          overlayRef.current.style.opacity = 1;
          setTimeout(() => {
            if (overlayRef.current) overlayRef.current.style.opacity = 0;
          }, 60);
        }
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
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

      Object.values(textureCache).forEach(tex => {
        if (tex) tex.dispose();
      });

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

export default TypographicClockVisual;
