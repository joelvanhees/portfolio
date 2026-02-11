import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const TypographicClockVisual = () => {
  const mountRef = useRef(null);
  const statusRef = useRef(null);
  const phaseFillRef = useRef(null);

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

    // --- CLOCK CONFIGURATION ---
    const CLOCK_CONFIG = {
      speed: 1.5,
      objectCount: 80,
      spawnRange: { x: 80, y: 60, zStart: -600, zEnd: -50 },
    };

    const objects = [];
    const startTime = Date.now();
    let animationRunning = true;
    let animationFrameId;

    // --- TEXTURE GENERATOR (each number gets its own canvas) ---
    const textureCache = {};

    function getNumberTexture(numStr) {
      if (textureCache[numStr]) return textureCache[numStr];
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 140px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(numStr, 128, 128);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 216, 216);
      const tex = new THREE.CanvasTexture(canvas);
      textureCache[numStr] = tex;
      return tex;
    }

    // --- ORB SETUP ---
    const orbGeo = new THREE.SphereGeometry(1.5, 32, 32);

    // Glow texture via canvas
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 64;
    glowCanvas.height = 64;
    const gCtx = glowCanvas.getContext('2d');
    const grd = gCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    gCtx.fillStyle = grd;
    gCtx.fillRect(0, 0, 64, 64);
    const glowTexture = new THREE.CanvasTexture(glowCanvas);

    // Yellow Orb (Main Actor - Seconds 01-60)
    const minOrbMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const minOrb = new THREE.Mesh(orbGeo, minOrbMat);
    const minGlowMat = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xffff00,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 1.0,
    });
    const minGlow = new THREE.Sprite(minGlowMat);
    minGlow.scale.set(25, 25, 1);
    minOrb.add(minGlow);
    scene.add(minOrb);

    // Green Orb (Supporting Actor)
    const secOrbMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const secOrb = new THREE.Mesh(orbGeo, secOrbMat);
    const secGlowMat = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x00ff00,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 1.0,
    });
    const secGlow = new THREE.Sprite(secGlowMat);
    secGlow.scale.set(25, 25, 1);
    secOrb.add(secGlow);
    scene.add(secOrb);

    // --- TRAIL SYSTEM (permanent) ---
    function createTrail(color) {
      const history = [];
      const geometry = new THREE.BufferGeometry();
      const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 });
      const line = new THREE.Line(geometry, material);
      line.frustumCulled = false;
      scene.add(line);
      return { line, history, geometry };
    }

    const minTrail = createTrail(0xffff00);
    const secTrail = createTrail(0x00ff00);

    function updateTrail(trailObj, position) {
      trailObj.history.push(position.clone());
      trailObj.geometry.setFromPoints(trailObj.history);
    }

    // --- OBJECT GENERATION ---
    function createNumberBlock() {
      const group = new THREE.Group();
      const valInt = Math.floor(Math.random() * 60) + 1;
      const valStr = valInt.toString().padStart(2, '0');
      const texture = getNumberTexture(valStr);
      const material = new THREE.SpriteMaterial({
        map: texture,
        color: 0x444444,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(20, 20, 1);
      group.add(sprite);
      group.userData = {
        type: 'number',
        value: valInt,
        originalColor: new THREE.Color(0x444444),
        currentScale: 1.0,
      };
      return group;
    }

    function createDecor() {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -100, 0),
        new THREE.Vector3(0, 100, 0),
      ]);
      const mat = new THREE.LineBasicMaterial({ color: 0x111111 });
      const line = new THREE.Line(geo, mat);
      line.position.x = (Math.random() - 0.5) * 200;
      line.position.z = -Math.random() * 500;
      return line;
    }

    function spawnObject(zPos) {
      const obj = Math.random() > 0.1 ? createNumberBlock() : createDecor();
      obj.position.x = (Math.random() - 0.5) * CLOCK_CONFIG.spawnRange.x * 2;
      obj.position.y = (Math.random() - 0.5) * CLOCK_CONFIG.spawnRange.y * 2;
      obj.position.z = zPos;
      scene.add(obj);
      objects.push(obj);
    }

    // Init objects
    for (let i = 0; i < CLOCK_CONFIG.objectCount; i++) {
      const z =
        CLOCK_CONFIG.spawnRange.zStart +
        Math.random() * (CLOCK_CONFIG.spawnRange.zEnd - CLOCK_CONFIG.spawnRange.zStart);
      spawnObject(z);
    }

    // --- INTERACTION UTILS ---
    function findTarget(value) {
      let closest = null;
      let minDist = 9999;
      for (const obj of objects) {
        if (obj.userData.type === 'number' && obj.userData.value === value) {
          if (obj.position.z > -650 && obj.position.z < 25) {
            const d = Math.abs(obj.position.z - -20);
            if (d < minDist) {
              minDist = d;
              closest = obj;
            }
          }
        }
      }
      return closest;
    }

    function moveOrbToTarget(orb, targetObj, colorHex, agility, now) {
      if (targetObj) {
        orb.position.x += (targetObj.position.x - orb.position.x) * agility;
        orb.position.y += (targetObj.position.y - orb.position.y) * agility;
        orb.position.z += (targetObj.position.z - orb.position.z) * agility;

        const dist = orb.position.distanceTo(targetObj.position);
        if (dist < 30) {
          const sprite = targetObj.children[0];
          sprite.material.color.setHex(colorHex);
          sprite.material.opacity = 1.0;
          targetObj.scale.setScalar(1.5);
        }
      } else {
        orb.position.z += (-50 - orb.position.z) * 0.05;
        orb.position.x += (Math.sin(now * 0.001) * 30 - orb.position.x) * 0.02;
      }
    }

    // --- ANIMATION LOOP ---
    function animate() {
      if (!animationRunning) return;

      animationFrameId = requestAnimationFrame(animate);

      const now = Date.now();
      const elapsedSeconds = (now - startTime) / 1000;

      // Current index (0-59)
      let currentSec = Math.floor(elapsedSeconds);

      // Phase bar progress (smooth)
      const progress = Math.min(elapsedSeconds / 60, 1.0);
      if (phaseFillRef.current) {
        phaseFillRef.current.style.width = (progress * 100) + '%';
      }

      // Stop after 60s
      if (currentSec >= 60) {
        animationRunning = false;
        if (statusRef.current) statusRef.current.innerText = 'DONE';
        renderer.render(scene, camera);
        return;
      } else {
        if (statusRef.current) {
          statusRef.current.innerText = (currentSec + 1).toString().padStart(2, '0') + 's';
        }
      }

      // Scene movement (infinite scroll)
      objects.forEach((obj) => {
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
            // Strict lookahead distribution
            const lookAhead = ((currentSec + Math.floor(Math.random() * 5)) % 60) + 1;
            obj.userData.value = lookAhead;

            const tex = getNumberTexture(obj.userData.value.toString().padStart(2, '0'));
            obj.children[0].material.map = tex;
            obj.children[0].material.color.setHex(0x444444);
            obj.children[0].material.opacity = 0.3;
            obj.scale.setScalar(1);
          }
        }
      });

      // Yellow Orb: Standard Seconds (targets currentSec + 1, maps 0->1 ... 59->60)
      const targetYellow = findTarget(currentSec + 1);
      moveOrbToTarget(minOrb, targetYellow, 0xffff00, 0.1, now);

      // Green Orb: Hyper Speed with Intelligent Fallback
      const fastCycle = (Math.floor((now - startTime) / (1000 / 60)) % 60) + 1;
      let targetGreen = findTarget(fastCycle);

      if (!targetGreen) {
        const visibleCandidates = objects.filter(
          (o) => o.userData.type === 'number' && o.position.z > -400 && o.position.z < 15
        );
        if (visibleCandidates.length > 0) {
          targetGreen = visibleCandidates[Math.floor(Math.random() * visibleCandidates.length)];
        }
      }

      moveOrbToTarget(secOrb, targetGreen, 0x00ff00, 0.6, now);

      // Update permanent trails
      updateTrail(minTrail, minOrb.position);
      updateTrail(secTrail, secOrb.position);

      // Camera follows Yellow Orb (aggressive tracking)
      const targetCamX = minOrb.position.x * 0.95;
      const targetCamY = minOrb.position.y * 0.95;
      camera.position.x += (targetCamX - camera.position.x) * 0.1;
      camera.position.y += (targetCamY - camera.position.y) * 0.1;
      camera.lookAt(camera.position.x, camera.position.y, -100);

      renderer.render(scene, camera);
    }

    animate();

    // --- RESIZE ---
    const handleResize = () => {
      if (!mountRef.current || !renderer) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mountRef.current);

    // --- CLEANUP ---
    return () => {
      animationRunning = false;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      if (scene) {
        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((m) => m.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        scene.clear();
      }

      Object.values(textureCache).forEach((tex) => {
        if (tex) tex.dispose();
      });
      glowTexture.dispose();

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
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 z-[20] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Phase bar */}
      <div className="absolute top-4 left-4 flex items-center gap-3 z-[25] pointer-events-none">
        <div
          className="w-[30px] h-[30px] border-2 border-white text-white font-bold text-lg flex justify-center items-center"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          3
        </div>
        <div
          className="w-[200px] h-[8px] relative"
          style={{ border: '1px solid #00ff00', background: 'rgba(0,0,0,0.2)' }}
        >
          <div
            ref={phaseFillRef}
            className="absolute left-0 top-0 h-full"
            style={{ width: '0%', backgroundColor: '#ffff00', transition: 'width 0.1s linear' }}
          />
        </div>
        <div
          className="w-[30px] h-[30px] border-2 border-white text-white font-bold text-lg flex justify-center items-center"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          4
        </div>
      </div>

      {/* Status overlay */}
      <div className="absolute bottom-4 left-4 pointer-events-none z-[25]" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>
        System: Sequence Running<br />
        Target: 60s Exact (Range 01-60)<br />
        Status: <span ref={statusRef}>01s</span>
      </div>
    </div>
  );
};

export default TypographicClockVisual;
