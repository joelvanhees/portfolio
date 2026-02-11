import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BufferOverflowVisual = () => {
  const mountRef = useRef(null);
  const fadeRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    mountRef.current.innerHTML = '';

    const TEXT_CONTENT = 'NOW IS GONE';
    const BG_COLOR = '#000000';

    const scene = new THREE.Scene();
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

    let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    const greenLight = new THREE.PointLight(0x39ff14, 2, 30);
    scene.add(greenLight);
    const yellowLight = new THREE.PointLight(0xffff00, 2, 30);
    scene.add(yellowLight);

    const tunnelLight = new THREE.PointLight(0x00ffff, 2, 100);
    tunnelLight.position.set(0, -20, 0);
    scene.add(tunnelLight);

    // --- TEXT TEXTURE ---
    function createTextTexture(text) {
      const canvas = document.createElement('canvas');
      canvas.width = 4096;
      canvas.height = 2048;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fontSize = 100;
      ctx.font = `900 ${fontSize}px "Arial Black", "Impact", sans-serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      const baseString = text.trim() + ' \u2022 ';
      const textWidth = ctx.measureText(baseString).width;
      let repetitions = Math.round(canvas.width / textWidth);
      if (repetitions < 1) repetitions = 1;
      const scaleFactor = (canvas.width / repetitions) / textWidth;

      const rows = 16;
      const lineHeight = canvas.height / rows;

      for (let i = 0; i < rows; i++) {
        ctx.save();
        ctx.translate(0, i * lineHeight + lineHeight / 2);
        ctx.scale(scaleFactor, 1);
        ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
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

    // --- FUNNEL GEOMETRY ---
    const funnelPoints = [];
    const segments = 200;
    const maxRadius = 7.0;
    const tubeRadius = 0.3;

    function getSurfaceY(x) {
      let y = -1.5 / Math.pow(Math.max(x, 0.005), 1.3);
      y += 0.6;
      if (x > 3.5) {
        const factor = (x - 3.5) / 3.5;
        y = y * (1 - factor * 0.3);
      }
      return y;
    }

    function getFunnelSlopeFactor(x) {
      const d = 0.01;
      const y1 = getSurfaceY(Math.max(x, tubeRadius));
      const y2 = getSurfaceY(Math.max(x + d, tubeRadius));
      const slope = (y2 - y1) / d;
      return Math.sqrt(1 + slope * slope);
    }

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const tDistorted = Math.pow(t, 0.7);
      const x = maxRadius * (1 - tDistorted) + tubeRadius * tDistorted;
      const y = getSurfaceY(x);
      funnelPoints.push(new THREE.Vector2(x, y));
    }

    const lastY = funnelPoints[funnelPoints.length - 1].y;
    funnelPoints.push(new THREE.Vector2(tubeRadius, lastY - 2));

    const funnelGeometry = new THREE.LatheGeometry(funnelPoints, 120);
    const funnelMaterial = new THREE.MeshBasicMaterial({ map: typoTexture, side: THREE.DoubleSide, color: 0xffffff });
    const funnel = new THREE.Mesh(funnelGeometry, funnelMaterial);
    scene.add(funnel);

    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x00ff00, wireframe: true, transparent: true, opacity: 0.05,
      side: THREE.DoubleSide, depthTest: false, blending: THREE.AdditiveBlending,
    });
    const wireframeFunnel = new THREE.Mesh(funnelGeometry, wireframeMat);
    wireframeFunnel.scale.set(1.005, 1.005, 1.005);
    scene.add(wireframeFunnel);

    // --- TUNNEL TEXTURE ---
    function createTunnelTexture(scaleY = 1.0) {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 15;
      ctx.lineCap = 'round';

      const numRings = 20;
      for (let i = 0; i < numRings; i++) {
        const y = (i / numRings) * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
      ctx.lineWidth = 2;
      const numLines = 8;
      for (let i = 0; i < numLines; i++) {
        const x = (i / numLines) * canvas.width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 10 * scaleY);
      return tex;
    }

    // --- MAIN TUNNEL ---
    const tunnelRadius = 4.0;
    const SPLIT_START_Y = -30.0;

    const mainTunnelHeight = 30.0;
    const mainTunnelGeo = new THREE.CylinderGeometry(tunnelRadius, tunnelRadius, mainTunnelHeight, 64, 1, true);
    const mainTunnelTex = createTunnelTexture(mainTunnelHeight / 300.0);
    const mainTunnelMat = new THREE.MeshBasicMaterial({
      map: mainTunnelTex, side: THREE.BackSide, color: 0xffffff, transparent: true, opacity: 1.0,
    });
    const tunnelMesh = new THREE.Mesh(mainTunnelGeo, mainTunnelMat);
    tunnelMesh.position.y = -mainTunnelHeight / 2;
    scene.add(tunnelMesh);

    // --- BRANCH GEOMETRY (FORK) ---
    const branchRadius = 2.5;
    const branchHeight = 200.0;
    const branchAngle = 0.38;
    const branchGeo = new THREE.CylinderGeometry(branchRadius, branchRadius, branchHeight, 64, 1, true);
    branchGeo.translate(0, -branchHeight / 2, 0);

    const branchTex = createTunnelTexture(branchHeight / 300.0);

    const leftBranch = new THREE.Mesh(branchGeo, new THREE.MeshBasicMaterial({ map: branchTex, side: THREE.BackSide, color: 0xffffff }));
    const rightBranch = new THREE.Mesh(branchGeo, new THREE.MeshBasicMaterial({ map: branchTex, side: THREE.BackSide, color: 0xffffff }));

    leftBranch.position.set(0, SPLIT_START_Y, 0);
    rightBranch.position.set(0, SPLIT_START_Y, 0);
    leftBranch.rotation.z = -branchAngle;
    rightBranch.rotation.z = branchAngle;
    scene.add(leftBranch);
    scene.add(rightBranch);

    // --- SPHERES (ORBS) ---
    const sphereGeo = new THREE.SphereGeometry(0.15, 32, 32);
    const greenMat = new THREE.MeshPhysicalMaterial({
      color: 0x39ff14, emissive: 0x39ff14, emissiveIntensity: 2.0, roughness: 0.1, metalness: 0.5,
    });
    const greenSphere = new THREE.Mesh(sphereGeo, greenMat);
    scene.add(greenSphere);

    const yellowGeo = new THREE.SphereGeometry(0.30, 32, 32);
    const yellowMat = new THREE.MeshPhysicalMaterial({
      color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 1.5, roughness: 0.1, metalness: 0.5,
    });
    const yellowSphere = new THREE.Mesh(yellowGeo, yellowMat);
    scene.add(yellowSphere);

    // --- STATE ---
    let simTime = 0;
    const TOTAL_DURATION = 30.0;
    const START_RADIUS = 6.8;
    const HOLE_RADIUS = tubeRadius + 0.1;
    const FADE_START_TIME = 42.0;
    const RESET_TIME = 47.0;

    let greenState = { angle: 0, radius: START_RADIUS, vy: 0, isFalling: false, yPos: 0 };
    let yellowState = { angle: 0.5, radius: START_RADIUS, vy: 0, isFalling: false, yPos: 0 };

    const _currentCameraPos = new THREE.Vector3().copy(START_CAM_POS);
    const _lookAtPos = new THREE.Vector3();
    const _targetCam = new THREE.Vector3();
    const _lookTarget = new THREE.Vector3();
    const _midPoint = new THREE.Vector3();

    let smoothAvgY = 0;

    function resetSimulation() {
      simTime = 0;
      yellowState = { angle: 0.5, radius: START_RADIUS, vy: 0, isFalling: false, yPos: 0 };
      greenState = { angle: 0, radius: START_RADIUS, vy: 0, isFalling: false, yPos: 0 };
      yellowSphere.scale.setScalar(1);
      greenSphere.scale.setScalar(1);
      smoothAvgY = 0;

      if (fadeRef.current) fadeRef.current.style.opacity = 0;

      camera.position.copy(START_CAM_POS);
      _currentCameraPos.copy(START_CAM_POS);
      _lookAtPos.set(0, 0, 0);
      camera.lookAt(_lookAtPos);
      camera.fov = 60;
      camera.updateProjectionMatrix();
      camera.rotation.z = 0;
    }

    const clock = new THREE.Clock();
    let animationFrameId;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);
      simTime += delta;

      // Loop reset
      if (simTime > RESET_TIME) resetSimulation();

      // Fade overlay for loop transition
      if (simTime > FADE_START_TIME) {
        const f = (simTime - FADE_START_TIME) / (RESET_TIME - FADE_START_TIME);
        if (fadeRef.current) fadeRef.current.style.opacity = Math.min(Math.max(f, 0), 1);
      }

      const rotSpeed = (Math.PI * 2) / 60;
      funnel.rotation.y += rotSpeed * delta;

      // Typo suction effect
      let suctionSpeed = 0.0002 + (simTime / TOTAL_DURATION) * 0.0008;
      typoTexture.offset.y -= suctionSpeed;

      const t = Math.min(simTime / TOTAL_DURATION, 1.0);

      // --- PHYSICS UPDATE ---
      const forceFall = simTime >= TOTAL_DURATION || yellowState.radius <= HOLE_RADIUS + 0.05 || greenState.radius <= HOLE_RADIUS + 0.05;

      // YELLOW
      if (!yellowState.isFalling && !forceFall) {
        const radFactor = Math.pow(1 - t, 1.5);
        yellowState.radius = HOLE_RADIUS + (START_RADIUS - HOLE_RADIUS) * radFactor;
        const effectiveR = Math.max(yellowState.radius, 0.1);
        const angSpeedY = 0.5 + (2.0 / (effectiveR * 1.5));
        yellowState.angle += delta * angSpeedY;
        const slope = getFunnelSlopeFactor(yellowState.radius);
        yellowState.yPos = getSurfaceY(yellowState.radius) + (0.30 * slope);
      } else {
        yellowState.isFalling = true;
        if (yellowState.yPos < -12.0) {
          yellowState.yPos -= 3.0 * delta;
          yellowState.radius = THREE.MathUtils.lerp(yellowState.radius, 3.2, 0.1);
          yellowState.angle += delta * 2.5;
        } else {
          yellowState.angle += delta * 6.0;
          yellowState.yPos -= 2.5 * delta;
          yellowState.radius = THREE.MathUtils.lerp(yellowState.radius, 0.0, 0.1);
        }
      }

      // GREEN
      if (!greenState.isFalling && !forceFall) {
        const targetGreenR = Math.max(yellowState.radius - 0.5, HOLE_RADIUS + 0.05);
        greenState.radius = targetGreenR;
        const gEffectiveR = Math.max(greenState.radius, 0.08);
        let angSpeedG = 0.5 + (2.0 / (gEffectiveR * 1.5));
        angSpeedG *= 2.5;
        greenState.angle += delta * angSpeedG;
        const slope = getFunnelSlopeFactor(greenState.radius);
        greenState.yPos = getSurfaceY(greenState.radius) + (0.15 * slope);
      } else {
        greenState.isFalling = true;
        if (greenState.yPos < -12.0) {
          greenState.yPos -= 3.0 * delta;
          greenState.radius = THREE.MathUtils.lerp(greenState.radius, 3.2, 0.1);
          greenState.angle -= delta * 2.5;
        } else {
          greenState.angle += delta * 9.0;
          greenState.yPos -= 2.5 * delta;
          greenState.radius = THREE.MathUtils.lerp(greenState.radius, 0.0, 0.1);
        }
      }

      // --- SPLIT & BRANCH LOGIC ---
      const currentRealMidY = (yellowState.yPos + greenState.yPos) / 2;

      let yellowCenterX = 0;
      let greenCenterX = 0;

      if (currentRealMidY < SPLIT_START_Y) {
        const d = SPLIT_START_Y - currentRealMidY;
        const deviation = d * Math.tan(branchAngle);
        yellowCenterX = deviation;
        greenCenterX = -deviation;
      }

      // SET POSITIONS
      const yX = yellowCenterX + Math.cos(yellowState.angle) * yellowState.radius;
      const yZ = Math.sin(yellowState.angle) * yellowState.radius;
      let yY;
      if (!yellowState.isFalling) {
        const slope = getFunnelSlopeFactor(yellowState.radius);
        yY = getSurfaceY(yellowState.radius) + (0.30 * slope);
      } else {
        yY = yellowState.yPos;
      }
      yellowSphere.position.set(yX, yY, yZ);

      const gX = greenCenterX + Math.cos(greenState.angle) * greenState.radius;
      const gZ = Math.sin(greenState.angle) * greenState.radius;
      let gY;
      if (!greenState.isFalling) {
        const slope = getFunnelSlopeFactor(greenState.radius);
        gY = getSurfaceY(greenState.radius) + (0.15 * slope);
      } else {
        gY = greenState.yPos;
      }
      greenSphere.position.set(gX, gY, gZ);

      // Lights follow orbs
      yellowLight.position.copy(yellowSphere.position).add(new THREE.Vector3(0, 0.5, 0));
      greenLight.position.copy(greenSphere.position).add(new THREE.Vector3(0, 0.5, 0));

      if (yellowState.isFalling) {
        tunnelLight.position.y = yellowState.yPos - 20;
      }

      // --- CAMERA LOGIC ---
      const midX = (yellowSphere.position.x + greenSphere.position.x) / 2;
      const midZ = (yellowSphere.position.z + greenSphere.position.z) / 2;
      _midPoint.set(midX, currentRealMidY, midZ);
      const avgRadius = (yellowState.radius + greenState.radius) / 2;
      const isDiving = yellowState.isFalling || greenState.isFalling;

      if (isDiving) {
        const entryY = 0.6;
        const fallDepth = entryY - currentRealMidY;
        let transitionFactor = THREE.MathUtils.clamp(fallDepth / 1.5, 0, 1);
        transitionFactor = Math.pow(transitionFactor, 0.5);

        let targetX = THREE.MathUtils.lerp(0, _midPoint.x, transitionFactor);
        let targetZ = THREE.MathUtils.lerp(0, _midPoint.z, transitionFactor);
        const currentOffset = THREE.MathUtils.lerp(4.5, 6.0, transitionFactor);
        _targetCam.set(targetX, currentRealMidY + currentOffset, targetZ);

        const lookTargetX = THREE.MathUtils.lerp(0, _midPoint.x, transitionFactor);
        const lookTargetZ = THREE.MathUtils.lerp(0, _midPoint.z, transitionFactor);
        _lookTarget.set(lookTargetX, currentRealMidY, lookTargetZ);

        if (currentRealMidY < -12.0 && transitionFactor > 0.98) {
          _targetCam.set(0, currentRealMidY + 5.0, 0);
          _lookTarget.set(0, currentRealMidY, 0);

          if (currentRealMidY < SPLIT_START_Y + 5.0) {
            _targetCam.x = 0;
            _targetCam.z = 0;
            _lookTarget.x = 0;
            _lookTarget.z = 0;
          }
        }

        const nearCylinderEntry = currentRealMidY < -10.5 && currentRealMidY > -12.0;
        if (nearCylinderEntry) {
          _targetCam.x *= 0.3;
          _targetCam.z *= 0.3;
          _targetCam.y -= 1.0;
        }

        _currentCameraPos.lerp(_targetCam, 0.1);

        const lookLerpSpeed = 0.05 + (0.15 * transitionFactor);
        _lookAtPos.lerp(_lookTarget, lookLerpSpeed);

        camera.fov = THREE.MathUtils.lerp(camera.fov, 100, 0.05);

        if (nearCylinderEntry) {
          camera.fov = THREE.MathUtils.lerp(camera.fov, 70, 0.1);
        }

        camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, 0, 0.1);
      } else {
        // --- FUNNEL MODE ---
        smoothAvgY = THREE.MathUtils.lerp(smoothAvgY, currentRealMidY, 0.1);
        const proximityToHole = avgRadius / START_RADIUS;
        const targetDist = 2.0 + (proximityToHole * 5.0);

        const camAngle = yellowState.angle - 0.5;
        let targetCamX = Math.cos(camAngle) * targetDist;
        let targetCamZ = Math.sin(camAngle) * targetDist;
        let targetCamY = smoothAvgY + 2.5 + (proximityToHole * 2.0);

        if (avgRadius < 1.8) {
          let centerProgress = 1.0 - (Math.max(avgRadius, 0.1) / 1.8);
          centerProgress = Math.pow(centerProgress, 2);
          targetCamX = THREE.MathUtils.lerp(targetCamX, 0, centerProgress);
          targetCamZ = THREE.MathUtils.lerp(targetCamZ, 0, centerProgress);
          const fixedEntryY = 0.6 + 4.5;
          targetCamY = THREE.MathUtils.lerp(targetCamY, fixedEntryY, centerProgress);
        }

        _targetCam.set(targetCamX, targetCamY, targetCamZ);
        _lookTarget.copy(_midPoint);
        _lookTarget.y = smoothAvgY;

        if (avgRadius < 4.5) {
          let centerWeight = 1.0 - Math.max(0, (avgRadius - 0.5) / 4.0);
          centerWeight = centerWeight * centerWeight * (3 - 2 * centerWeight);
          _lookTarget.x = THREE.MathUtils.lerp(_midPoint.x, 0, centerWeight);
          _lookTarget.z = THREE.MathUtils.lerp(_midPoint.z, 0, centerWeight);
          const holeDeepFocusY = -15.0;
          _lookTarget.y = THREE.MathUtils.lerp(smoothAvgY, holeDeepFocusY, centerWeight * 0.5);
        }

        if (avgRadius < 1.2) {
          const holeY = getSurfaceY(tubeRadius);
          const strictCenter = 1.0 - (Math.max(avgRadius, 0.0) / 1.2);
          _lookTarget.x = THREE.MathUtils.lerp(_lookTarget.x, 0, strictCenter);
          _lookTarget.z = THREE.MathUtils.lerp(_lookTarget.z, 0, strictCenter);
          _lookTarget.y = THREE.MathUtils.lerp(_lookTarget.y, holeY - 2.0, strictCenter * 0.5);
        }

        const inEntryZone = avgRadius < 1.4;
        if (inEntryZone) {
          _targetCam.x = 0;
          _targetCam.z = 0;
          _lookTarget.x = 0;
          _lookTarget.z = 0;
        }

        _currentCameraPos.lerp(_targetCam, 0.08);
        _lookAtPos.lerp(_lookTarget, 0.1);
        camera.fov = THREE.MathUtils.lerp(camera.fov, 60, 0.05);
        camera.rotation.z *= 0.95;
      }

      camera.position.copy(_currentCameraPos);
      camera.lookAt(_lookAtPos);
      camera.updateProjectionMatrix();

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
      {/* Fade overlay for loop transition */}
      <div
        ref={fadeRef}
        className="absolute inset-0 bg-black pointer-events-none z-[100]"
        style={{ opacity: 0, transition: 'opacity 0.1s linear' }}
      />
      {/* Scanlines */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))',
          backgroundSize: '100% 3px',
        }}
      />
    </div>
  );
};

export default BufferOverflowVisual;
