import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SpiralTimeSphere = () => {
  const mountRef = useRef(null);
  const timeRef = useRef(null);
  const hourRef = useRef(null);
  const nextHourRef = useRef(null);
  const progressRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    if (!mountRef.current) return;

    mountRef.current.innerHTML = '';

    const CONFIG = {
      count: 1500,
      radius: 23,
      speedFactor: 1.0,
      trailLength: 350,
      colors: { minute: new THREE.Color(0xffff00), second: new THREE.Color(0x00ff00), text: 'white' },
    };

    let scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.012);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    let camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 80;

    camera.userData = {
      currentLookAt: new THREE.Vector3(0, 0, 0),
      currentPos: new THREE.Vector3(0, 0, 100),
      returnTransitionStartFrame: -1,
    };

    let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const textures = {};
    const canvasHelper = document.createElement('canvas');
    const ctxHelper = canvasHelper.getContext('2d');
    canvasHelper.width = 128; canvasHelper.height = 128;

    function getNumberTexture(n, isHour = false) {
      const key = isHour ? 'h_' + n : n;
      if (textures[key]) return textures[key];

      ctxHelper.clearRect(0, 0, 128, 128);
      ctxHelper.fillStyle = CONFIG.colors.text;
      ctxHelper.font = isHour ? 'bold 100px "Courier New"' : '900 90px "Courier New"';
      ctxHelper.textAlign = 'center';
      ctxHelper.textBaseline = 'middle';
      ctxHelper.fillText(n, 64, 66);

      const tex = new THREE.CanvasTexture(canvasHelper);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      const image = new Image();
      image.src = canvasHelper.toDataURL();
      tex.image = image;
      tex.needsUpdate = true;

      textures[key] = tex;
      return tex;
    }

    const numberGroup = new THREE.Group();
    scene.add(numberGroup);

    const pathNumbersData = [];
    const decorNumbersData = [];
    const pathPositions = new Array(61);

    for (let i = 1; i <= 60; i++) {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: getNumberTexture(i),
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }));
      const t = (i / 60);
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

    function createOrb(color, isMinute) {
      const radius = isMinute ? 0.9 : 0.5;
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: color });
      const mesh = new THREE.Mesh(geometry, material);
      const canvas = document.createElement('canvas');
      canvas.width = 64; canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, '#' + color.getHexString());
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      const glowMat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), color: color, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
      const glow = new THREE.Sprite(glowMat);
      glow.scale.set(isMinute ? 9 : 7, isMinute ? 9 : 7, 1);
      mesh.add(glow);
      return mesh;
    }
    const secondOrb = createOrb(CONFIG.colors.second, false);
    const minuteOrb = createOrb(CONFIG.colors.minute, true);
    scene.add(secondOrb);
    scene.add(minuteOrb);

    const trailPositionsArr = new Float32Array(CONFIG.trailLength * 3);
    const trailColors = new Float32Array(CONFIG.trailLength * 3);
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositionsArr, 3));
    trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    const trailLine = new THREE.Line(trailGeometry, new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
    trailLine.frustumCulled = false;
    scene.add(trailLine);

    for (let i = 0; i < CONFIG.trailLength; i++) {
      const alpha = i / (CONFIG.trailLength - 1);
      const col = CONFIG.colors.second;
      trailColors[i * 3] = col.r * alpha; trailColors[i * 3 + 1] = col.g * alpha; trailColors[i * 3 + 2] = col.b * alpha;
    }

    let FRAME = 0;
    let accumulatedTime = 0;
    let glitchStartFrame = -9999;
    const colorWhite = new THREE.Color(0xffffff);
    const colorGray = new THREE.Color(0xaaaaaa);
    const colorMinute = CONFIG.colors.minute;
    const _ColorSecond = CONFIG.colors.second;

    let animationFrameId;

    const getPos = (idx) => {
      if (idx <= 0) idx = 60;
      if (idx > 60) idx = 1;
      return pathPositions[idx] || new THREE.Vector3(0, 25, 0);
    };

    function animate() {
      if (!isMountedRef.current) return;
      if (!mountRef.current || !renderer) return;

      const context = renderer.getContext();
      if (!context || context.isContextLost()) return;

      FRAME++;
      const now = new Date();
      const hrs = now.getHours();
      const mins = now.getMinutes();
      const secs = now.getSeconds();
      const ms = now.getMilliseconds();
      accumulatedTime = (hrs * 3600) + (mins * 60) + secs + (ms / 1000);

      if (timeRef.current) timeRef.current.innerText = `TIME: ${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      if (hourRef.current) hourRef.current.innerText = hrs.toString().padStart(2, '0');
      if (nextHourRef.current) nextHourRef.current.innerText = ((hrs + 1) % 24).toString().padStart(2, '0');
      if (progressRef.current) {
        const currentSecondsInHour = (mins * 60) + secs + (ms / 1000);
        progressRef.current.style.width = `${(currentSecondsInHour / 3600) * 100}%`;
      }

      if (currentHourValue !== hrs) {
        currentHourValue = hrs;
        hourUniforms.map.value = getNumberTexture(currentHourValue, true);
        glitchStartFrame = FRAME;
        hourUniforms.uGlitchPhase.value = 0.0;
        camera.userData.returnTransitionStartFrame = FRAME;
      }
      hourUniforms.uFill.value = ((mins * 60 + secs) / 3600.0);

      if (glitchStartFrame > 0 && FRAME - glitchStartFrame < (0.7 * 120)) {
        const gProgress = (FRAME - glitchStartFrame) / (0.7 * 120);
        if (gProgress <= 1.0) hourUniforms.uGlitchPhase.value = gProgress;
      } else {
        hourUniforms.uGlitchPhase.value = 0.0;
      }

      const organicTime = accumulatedTime * 0.02;
      const fieldTime = accumulatedTime * 0.2;
      const modeOscillator = (Math.sin(accumulatedTime * 0.1) + 1.0) * 0.5;

      pathNumbersData.forEach(item => {
        const { mesh, basePos, seed, value, baseScale } = item;
        let tScale = baseScale; let tCol = colorWhite; let tOp = 0.9;
        if (value === (mins === 0 ? 60 : mins)) { tScale = baseScale * 1.5; tCol = colorMinute; tOp = 1.0; }
        const normX = basePos.x / CONFIG.radius; const normZ = basePos.z / CONFIG.radius;
        const rotWave = Math.sin(Math.atan2(normZ, normX) * 3.0 + fieldTime); const vertWave = Math.sin(basePos.y * 0.1 - fieldTime);
        const waveStrength = THREE.MathUtils.lerp(rotWave, vertWave, modeOscillator);
        const noise = Math.sin(seed + organicTime + waveStrength) * 0.6;
        const jitter = Math.sin(seed * 2.1 + organicTime * 1.5) * 0.2;

        mesh.position.set(
          basePos.x + noise * 0.2,
          basePos.y + jitter * 0.2,
          basePos.z + noise * 0.2,
        );

        mesh.material.opacity = tOp;
        mesh.material.color.copy(tCol);
        mesh.scale.set(tScale, tScale, tScale);
      });

      decorNumbersData.forEach(item => {
        const { mesh, basePos, seed, baseScale } = item;
        const drift = Math.sin(seed + organicTime * 0.8) * 0.8;
        mesh.position.set(
          basePos.x + drift,
          basePos.y + drift * 0.3,
          basePos.z + drift,
        );
        mesh.material.opacity = 0.35;
        mesh.material.color.copy(colorGray);
        mesh.scale.set(baseScale, baseScale, baseScale);
      });

      const t = (secs + ms / 1000) / 60;
      const minutePos = getPos(mins);
      const secondPos = getPos(Math.floor(secs) || 60);

      const minutePosNext = getPos((mins + 1) % 60);
      const minuteInterpolated = minutePos.clone().lerp(minutePosNext, t);
      minuteOrb.position.copy(minuteInterpolated).multiplyScalar(1.02);

      const secondPosNext = getPos(((secs + 1) % 60) || 60);
      const secondInterpolated = secondPos.clone().lerp(secondPosNext, ms / 1000);
      secondOrb.position.copy(secondInterpolated).multiplyScalar(1.05);

      if (FRAME % 2 === 0) {
        for (let i = CONFIG.trailLength - 1; i > 0; i--) {
          trailPositionsArr[i * 3] = trailPositionsArr[(i - 1) * 3];
          trailPositionsArr[i * 3 + 1] = trailPositionsArr[(i - 1) * 3 + 1];
          trailPositionsArr[i * 3 + 2] = trailPositionsArr[(i - 1) * 3 + 2];
        }
        trailPositionsArr[0] = secondOrb.position.x * 1.05;
        trailPositionsArr[1] = secondOrb.position.y * 1.05;
        trailPositionsArr[2] = secondOrb.position.z * 1.05;
        trailGeometry.attributes.position.needsUpdate = true;
      }

      const camPos = camera.position.clone();
      const targetPos = new THREE.Vector3(0, 0, 0);
      const dist = camPos.distanceTo(targetPos);
      if (dist < 60) {
        camera.position.z = 60;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    }

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
      isMountedRef.current = false;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      if (scene) {
        scene.traverse((object) => {
          if (!object.isMesh) return;

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

      if (mountRef.current && renderer && renderer.domElement) {
        try {
          mountRef.current.removeChild(renderer.domElement);
        } catch {
          // Ignore if already removed
        }
      }

      renderer = null;
      scene = null;
      camera = null;
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full relative bg-black overflow-hidden">
      <div className="absolute inset-0 z-[5] pointer-events-none" style={{
        background: `linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))`,
        backgroundSize: '100% 3px',
      }} />

      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
        <div ref={hourRef} className="w-10 h-8 border border-white/80 flex items-center justify-center font-bold text-white bg-black/50 text-sm">00</div>
        <div className="w-32 h-2 border border-green-500 bg-black/20 relative">
          <div ref={progressRef} className="absolute top-0 left-0 h-full bg-yellow-400 transition-all duration-100 ease-linear" style={{ width: '0%' }} />
        </div>
        <div ref={nextHourRef} className="w-10 h-8 border border-white/80 flex items-center justify-center font-bold text-white bg-black/50 text-sm">00</div>
      </div>

      <div ref={timeRef} className="absolute bottom-4 left-4 z-30 text-[10px] font-mono text-white/40 pointer-events-none">
        SYSTEM: REALTIME SYNC<br />
        TIME: 00:00:00
      </div>
    </div>
  );
};

export default SpiralTimeSphere;
