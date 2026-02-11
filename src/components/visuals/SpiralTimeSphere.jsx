import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SpiralTimeSphere = () => {
  const mountRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const container = mountRef.current;
    if (!container) return;

    container.innerHTML = '';

    // --- CONFIG ---
    const CONFIG = {
      count: 1500,
      radius: 23,
      speedFactor: 1.0,
      trailLength: 350,
      colors: {
        minute: new THREE.Color(0xffff00),
        second: new THREE.Color(0x00ff00),
        text: 'white',
      },
    };

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.012);

    let width = container.clientWidth;
    let height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 80;

    camera.userData = {
      currentLookAt: new THREE.Vector3(0, 0, 0),
      currentPos: new THREE.Vector3(0, 0, 100),
      returnTransitionStartFrame: -1,
    };

    let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- TEXTURE GENERATION ---
    const textures = {};

    function getNumberTexture(n, isHour = false) {
      const key = isHour ? 'h_' + n : n;
      if (textures[key]) return textures[key];

      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, 128, 128);
      ctx.fillStyle = CONFIG.colors.text;
      ctx.font = isHour ? 'bold 100px "Courier New"' : '900 90px "Courier New"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 60 becomes 00
      let displayStr = n.toString();
      if (!isHour && n === 60) {
        displayStr = '00';
      }

      ctx.fillText(displayStr, 64, 66);

      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;

      textures[key] = tex;
      return tex;
    }

    const numberGroup = new THREE.Group();
    scene.add(numberGroup);

    const pathNumbersData = [];
    const decorNumbersData = [];
    const pathPositions = new Array(61);

    // --- 1. PATH SPRITES ---
    for (let i = 1; i <= 60; i++) {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: getNumberTexture(i),
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }));

      const t = i / 60;
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
        baseScale: 4.0,
      });
    }
    pathPositions[0] = pathPositions[60];

    // --- 2. DECO SPRITES ---
    for (let i = 0; i < CONFIG.count; i++) {
      const val = Math.floor(Math.random() * 60) + 1;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: getNumberTexture(val),
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }));

      const goldenRatio = (1 + 5 ** 0.5) / 2;
      const idx = i + 0.5;
      const phi = Math.acos(1 - 2 * idx / CONFIG.count);
      const theta = 2 * Math.PI * idx / goldenRatio;

      const x = CONFIG.radius * Math.sin(phi) * Math.cos(theta);
      const y = CONFIG.radius * Math.cos(phi);
      const z = CONFIG.radius * Math.sin(phi) * Math.sin(theta);

      const pos = new THREE.Vector3(x, y, z).normalize().multiplyScalar(CONFIG.radius + (Math.random() - 0.5));
      sprite.position.copy(pos);
      sprite.scale.set(2.0, 2.0, 2.0);
      numberGroup.add(sprite);

      decorNumbersData.push({
        mesh: sprite,
        basePos: pos,
        seed: Math.random() * 100,
        value: -1,
        baseScale: 2.0,
      });
    }

    // --- 3. HOUR GLITCH SHADER ---
    let currentHourValue = new Date().getHours();

    const hourUniforms = {
      map: { value: getNumberTexture(currentHourValue, true) },
      uFill: { value: 0.0 },
      uColorBottom: { value: CONFIG.colors.minute },
      uColorTop: { value: CONFIG.colors.second },
      uOpacity: { value: 0.95 },
      uGlitchPhase: { value: 0.0 },
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
      `,
    });

    const hourGeometry = new THREE.PlaneGeometry(1, 1);
    const hourMesh = new THREE.Mesh(hourGeometry, hourMaterial);
    hourMesh.scale.set(14, 14, 1);
    hourMesh.position.set(0, 0, 0);
    scene.add(hourMesh);

    // --- 4. ORBS ---
    function createOrb(color, isMinute) {
      const radius = isMinute ? 0.9 : 0.5;
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: color });
      const mesh = new THREE.Mesh(geometry, material);

      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, '#' + color.getHexString());
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);

      const glowMat = new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(canvas),
        color: color,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const glow = new THREE.Sprite(glowMat);
      glow.scale.set(isMinute ? 9 : 7, isMinute ? 9 : 7, 1);
      mesh.add(glow);
      return mesh;
    }

    const secondOrb = createOrb(CONFIG.colors.second, false);
    const minuteOrb = createOrb(CONFIG.colors.minute, true);
    scene.add(secondOrb);
    scene.add(minuteOrb);

    // --- 5. TRAIL ---
    const trailPositionsArr = new Float32Array(CONFIG.trailLength * 3);
    const trailColors = new Float32Array(CONFIG.trailLength * 3);
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositionsArr, 3));
    trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    const trailLine = new THREE.Line(trailGeometry, new THREE.LineBasicMaterial({
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    }));
    trailLine.frustumCulled = false;
    scene.add(trailLine);

    for (let i = 0; i < CONFIG.trailLength; i++) {
      const alpha = i / (CONFIG.trailLength - 1);
      const col = CONFIG.colors.second;
      trailColors[i * 3] = col.r * alpha;
      trailColors[i * 3 + 1] = col.g * alpha;
      trailColors[i * 3 + 2] = col.b * alpha;
    }

    // --- ANIMATION VARIABLES ---
    let FRAME = 0;
    let accumulatedTime = 0;
    let glitchStartFrame = -9999;
    const colorWhite = new THREE.Color(0xffffff);
    const colorGray = new THREE.Color(0xaaaaaa);
    const colorMinute = CONFIG.colors.minute;
    const colorSecond = CONFIG.colors.second;

    // Shockwave variables
    let shockwaveActive = false;
    let shockwaveStartTime = 0;
    let lastSec = -1;

    let animationFrameId;

    const getPos = (idx) => {
      if (idx <= 0) idx = 60;
      if (idx > 60) idx = 1;
      return pathPositions[idx] || new THREE.Vector3(0, 25, 0);
    };

    // --- MAIN ANIMATION ---
    function animate() {
      if (!isMountedRef.current) return;
      if (!container || !renderer) return;

      const context = renderer.getContext();
      if (!context || context.isContextLost()) return;

      animationFrameId = requestAnimationFrame(animate);

      FRAME++;
      const now = new Date();
      const hrs = now.getHours();
      const mins = now.getMinutes();
      const secs = now.getSeconds();
      const ms = now.getMilliseconds();

      accumulatedTime = (hrs * 3600) + (mins * 60) + secs + (ms / 1000);

      // --- SHOCKWAVE TRIGGER LOGIC ---
      if (lastSec !== secs) {
        if (secs === 0) {
          shockwaveActive = true;
          shockwaveStartTime = accumulatedTime;
        }
        lastSec = secs;
      }

      // --- SHOCKWAVE CALCULATION ---
      let waveY = -999;
      let isWaveFrame = false;

      if (shockwaveActive) {
        const dur = 4.0;
        const elapsed = accumulatedTime - shockwaveStartTime;
        if (elapsed < dur && elapsed >= 0) {
          const prog = elapsed / dur;
          waveY = -45 + (prog * 90);
          isWaveFrame = true;
        } else if (elapsed >= dur) {
          shockwaveActive = false;
        }
      }

      // Hour change logic
      if (currentHourValue !== hrs) {
        currentHourValue = hrs;
        hourUniforms.map.value = getNumberTexture(currentHourValue, true);
        glitchStartFrame = FRAME;
        hourUniforms.uGlitchPhase.value = 0.0;
        camera.userData.returnTransitionStartFrame = FRAME;
      }
      hourUniforms.uFill.value = ((mins * 60 + secs) / 3600.0);

      // Glitch effect
      if (glitchStartFrame > 0 && FRAME - glitchStartFrame < (0.7 * 120)) {
        const gProgress = (FRAME - glitchStartFrame) / (0.7 * 120);
        if (gProgress <= 1.0) hourUniforms.uGlitchPhase.value = gProgress;
      } else {
        hourUniforms.uGlitchPhase.value = 0.0;
      }

      const organicTime = accumulatedTime * 0.02;
      const fieldTime = accumulatedTime * 0.2;
      const modeOscillator = (Math.sin(accumulatedTime * 0.1) + 1.0) * 0.5;

      // Update Path Numbers
      pathNumbersData.forEach(item => {
        const { mesh, basePos, seed, value, baseScale } = item;
        let tScale = baseScale;
        let tCol = colorWhite;
        let tOp = 0.9;

        if (value === (mins === 0 ? 60 : mins)) {
          tScale = baseScale * 1.5;
          tCol = colorMinute;
          tOp = 1.0;
        }

        const normX = basePos.x / CONFIG.radius;
        const normZ = basePos.z / CONFIG.radius;

        const rotWave = Math.sin(Math.atan2(normZ, normX) * 3.0 + fieldTime);
        const vertWave = Math.sin(basePos.y * 0.1 - fieldTime);
        const waveStrength = THREE.MathUtils.lerp(rotWave, vertWave, modeOscillator);
        const breath = waveStrength * 0.5;

        const wx = Math.sin(organicTime + seed * 0.1) * 0.1;
        const wy = Math.cos(organicTime * 0.8 + seed * 0.2) * 0.1;
        const wz = Math.sin(organicTime * 1.2 + seed * 0.3) * 0.1;

        let px = basePos.x + wx + (normX * breath);
        let py = basePos.y + wy + (breath * 0.4);
        let pz = basePos.z + wz + (normZ * breath);

        // SHOCKWAVE
        if (isWaveFrame) {
          const distY = Math.abs(basePos.y - waveY);
          const bandwidth = 15.0;

          if (distY < bandwidth) {
            const normDist = distY / bandwidth;
            const falloff = 0.5 * (1 + Math.cos(normDist * Math.PI));
            const wavePhase = (basePos.y * 0.4) - (accumulatedTime * 8.0);
            const expansion = Math.sin(wavePhase) * falloff * 2.5;

            px += normX * expansion;
            pz += normZ * expansion;
            py += falloff * 1.5;
          }
        }

        mesh.position.set(px, py, pz);
        mesh.scale.lerp(new THREE.Vector3(tScale, tScale, tScale), 0.2);
        mesh.material.color.lerp(tCol, 0.2);
        mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, tOp, 0.2);
      });

      // Update Decor Numbers
      decorNumbersData.forEach(item => {
        const { mesh, basePos, seed, baseScale } = item;
        let tScale = baseScale;
        let tCol = colorGray;
        let tOp = 0.35;

        const normX = basePos.x / CONFIG.radius;
        const normZ = basePos.z / CONFIG.radius;
        const rotWave = Math.sin(Math.atan2(normZ, normX) * 3.0 + fieldTime);
        const vertWave = Math.sin(basePos.y * 0.1 - fieldTime);
        const waveStrength = THREE.MathUtils.lerp(rotWave, vertWave, modeOscillator);
        const breath = waveStrength * 0.5;

        const wx = Math.sin(organicTime + seed * 0.1) * 0.1;
        const wy = Math.cos(organicTime * 0.8 + seed * 0.2) * 0.1;
        const wz = Math.sin(organicTime * 1.2 + seed * 0.3) * 0.1;

        let px = basePos.x + wx + (normX * breath);
        let py = basePos.y + wy + (breath * 0.4);
        let pz = basePos.z + wz + (normZ * breath);

        // SHOCKWAVE (Deco)
        if (isWaveFrame) {
          const distY = Math.abs(basePos.y - waveY);
          const bandwidth = 15.0;

          if (distY < bandwidth) {
            const normDist = distY / bandwidth;
            const falloff = 0.5 * (1 + Math.cos(normDist * Math.PI));
            const wavePhase = (basePos.y * 0.4) - (accumulatedTime * 8.0);
            const expansion = Math.sin(wavePhase) * falloff * 2.0;

            px += normX * expansion;
            pz += normZ * expansion;
            py += falloff * 1.2;
          }
        }

        const currentPos = new THREE.Vector3(px, py, pz);
        mesh.position.copy(currentPos);

        if (currentPos.distanceTo(secondOrb.position) < 4.0) {
          tScale = baseScale * 1.5;
          tCol = colorSecond;
          tOp = 1.0;
        }

        mesh.scale.lerp(new THREE.Vector3(tScale, tScale, tScale), 0.2);
        mesh.material.color.lerp(tCol, 0.2);
        mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, tOp, 0.2);
      });

      hourMesh.position.y = Math.sin(organicTime) * 2;

      // Minute Orb Position
      const minIndex = (mins === 0 ? 60 : mins);
      minuteOrb.position.lerp(getPos(minIndex), 0.1);
      minuteOrb.position.normalize().multiplyScalar(CONFIG.radius + 3.0);

      // Second Orb Position
      const secIndex = (secs === 0 ? 60 : secs);
      const nextSecIndex = (secIndex % 60) + 1;
      const targetSecPos = new THREE.Vector3().lerpVectors(getPos(secIndex), getPos(nextSecIndex), ms / 1000);

      const chaosTime = Date.now() * 0.003;
      const chaos = new THREE.Vector3(
        Math.sin(chaosTime * 1.5),
        Math.cos(chaosTime * 1.8),
        Math.sin(chaosTime * 2.1),
      ).multiplyScalar(2.0);
      const finalSecPos = targetSecPos.clone().normalize().multiplyScalar(CONFIG.radius - 3.5).add(chaos);
      secondOrb.position.lerp(finalSecPos, 0.15);

      // Trail Update
      const arr = trailLine.geometry.attributes.position.array;
      for (let i = 0; i < (CONFIG.trailLength - 1) * 3; i++) arr[i] = arr[i + 3];
      const li = (CONFIG.trailLength - 1) * 3;
      arr[li] = secondOrb.position.x;
      arr[li + 1] = secondOrb.position.y;
      arr[li + 2] = secondOrb.position.z;
      trailLine.geometry.attributes.position.needsUpdate = true;

      // Camera
      const isJump = (secs >= 59 || secs <= 1);
      let targetPos = isJump ? minuteOrb.position.clone() : targetSecPos.clone();
      let targetLook = isJump ? minuteOrb.position.clone() : targetSecPos.clone();

      const zoomCycle = Math.sin(accumulatedTime * 0.2);
      const tZoom = (zoomCycle + 1) / 2;

      const offsetWide = new THREE.Vector3(30, 20, 45);
      const offsetMedium = new THREE.Vector3(20, 15, 30);
      const currentOffset = offsetMedium.clone().lerp(offsetWide, tZoom * 0.2);

      const desiredPos = targetPos.add(currentOffset);
      const desiredLookAt = targetLook.lerp(new THREE.Vector3(0, 0, 0), 0.3);

      camera.position.lerp(desiredPos, 0.005);
      camera.userData.currentLookAt.lerp(desiredLookAt, 0.01);
      camera.lookAt(camera.userData.currentLookAt);

      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      isMountedRef.current = false;
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

      Object.values(textures).forEach(tex => {
        if (tex) tex.dispose();
      });

      if (renderer) {
        renderer.dispose();
        const gl = renderer.getContext();
        if (gl && gl.getExtension('WEBGL_lose_context')) {
          gl.getExtension('WEBGL_lose_context').loseContext();
        }
      }

      if (container && renderer && renderer.domElement) {
        try {
          container.removeChild(renderer.domElement);
        } catch {
          // Ignore if already removed
        }
      }

      renderer = null;
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full relative bg-black overflow-hidden">
      <div className="absolute inset-0 z-[10] pointer-events-none" style={{ background: '#000', opacity: 0, transition: 'opacity 0.1s linear' }} />

      <div className="absolute inset-0 z-[5] pointer-events-none" style={{
        background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))',
        backgroundSize: '100% 3px',
      }} />

      <div className="absolute bottom-[15px] right-[20px] z-[20] pointer-events-none" style={{
        color: '#666',
        fontFamily: '"Courier New", monospace',
        fontSize: '11px',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        opacity: 0.8,
      }}>
        &copy; Joel van Hees
      </div>
    </div>
  );
};

export default SpiralTimeSphere;
