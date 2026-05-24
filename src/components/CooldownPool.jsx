import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const CooldownPool = ({ darkMode, onClose }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false, px: 0, py: 0 });

  // Grid / Simulation Dimensions
  const simWidth = 128;
  const simHeight = 128;
  const size = simWidth * simHeight;

  // Buffer 1 and Buffer 2 for wave heights
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
            // Inject wave height (attenuated by distance)
            buffer[idx] += (1 - dist / r) * force;
          }
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle high DPI screens
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    // Spawn initial random drops to create ripples
    for (let i = 0; i < 8; i++) {
      const rx = Math.random() * (simWidth - 20) + 10;
      const ry = Math.random() * (simHeight - 20) + 10;
      splash(rx, ry, 4, 300 + Math.random() * 400);
    }

    const damping = 0.985;
    let time = 0;

    const render = () => {
      time += 0.01;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      // Deep water gradient background
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      if (darkMode) {
        grad.addColorStop(0, '#020514');
        grad.addColorStop(1, '#05180f');
      } else {
        grad.addColorStop(0, '#eaf2ff');
        grad.addColorStop(1, '#d8e5ff');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Step 1: Wave equation step
      const b1 = buffer1Ref.current;
      const b2 = buffer2Ref.current;

      for (let y = 1; y < simHeight - 1; y++) {
        for (let x = 1; x < simWidth - 1; x++) {
          const idx = x + y * simWidth;
          // Standard wave equation
          b2[idx] = (
            (b1[idx - 1] +
             b1[idx + 1] +
             b1[idx - simWidth] +
             b1[idx + simWidth]) / 2
          ) - b2[idx];
          // Damping
          b2[idx] *= damping;
        }
      }

      // Swap buffers
      buffer1Ref.current = b2;
      buffer2Ref.current = b1;

      // Mouse drag splash effect
      const mouse = mouseRef.current;
      if (mouse.active) {
        // Map screen space to heightmap space
        const hx = (mouse.x / width) * simWidth;
        const hy = (mouse.y / height) * simHeight;
        // Inject splash
        splash(hx, hy, 3, 220);
      }

      // Automatically drop tiny drops randomly to keep the pool alive
      if (Math.random() < 0.03) {
        const rx = Math.random() * (simWidth - 10) + 5;
        const ry = Math.random() * (simHeight - 10) + 5;
        splash(rx, ry, 2, 100 + Math.random() * 200);
      }

      // Step 2: Draw futuristic 3D wireframe mesh deformed by ripples
      const gridCols = 44;
      const gridRows = 30;

      ctx.lineWidth = 1;

      // Horizontal Lines
      for (let r = 0; r < gridRows; r++) {
        ctx.beginPath();
        const gy = (r / (gridRows - 1)) * height;
        const hmy = (r / (gridRows - 1)) * (simHeight - 1);

        for (let c = 0; c < gridCols; c++) {
          const gx = (c / (gridCols - 1)) * width;
          const hmx = (c / (gridCols - 1)) * (simWidth - 1);

          // Bilinear sample wave height at heightmap coordinate (hmx, hmy)
          const idx = Math.floor(hmx) + Math.floor(hmy) * simWidth;
          const waveHeight = b1[idx] || 0;

          // Calculate displacement and 3D skew
          const dx = 0;
          const dy = waveHeight * 0.18; // Ripple vertical displacement

          const drawX = gx + dx;
          const drawY = gy + dy;

          if (c === 0) {
            ctx.moveTo(drawX, drawY);
          } else {
            ctx.lineTo(drawX, drawY);
          }
        }
        
        // Color matching active theme
        ctx.strokeStyle = darkMode 
          ? `rgba(0, 255, 65, ${0.12 + Math.abs(Math.sin(time + r)) * 0.08})`
          : `rgba(0, 85, 255, ${0.15 + Math.abs(Math.sin(time + r)) * 0.08})`;
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

          const dx = 0;
          const dy = waveHeight * 0.18;

          const drawX = gx + dx;
          const drawY = gy + dy;

          if (r === 0) {
            ctx.moveTo(drawX, drawY);
          } else {
            ctx.lineTo(drawX, drawY);
          }
        }

        ctx.strokeStyle = darkMode 
          ? `rgba(0, 255, 65, ${0.12 + Math.abs(Math.sin(time + c)) * 0.08})`
          : `rgba(0, 85, 255, ${0.15 + Math.abs(Math.sin(time + c)) * 0.08})`;
        ctx.stroke();
      }

      // Render futuristic floating system indicators that warp slightly
      ctx.font = '9px monospace';
      ctx.fillStyle = darkMode ? 'rgba(0, 255, 65, 0.45)' : 'rgba(0, 85, 255, 0.55)';
      ctx.textAlign = 'left';

      const indicators = [
        { text: '[ COOLDOWN MODE ACTIVE ]', x: 40, y: 50 },
        { text: `[ WATER LEVEL: 100% ]`, x: 40, y: 70 },
        { text: `[ OSCILLATIONS: ${Math.sin(time).toFixed(4)} ]`, x: 40, y: 90 },
        { text: '[ DISTURB THE WATER SURFACE ]', x: width - 240, y: 50 },
        { text: '[ PRESS ANYKEY OR END COOLDOWN ]', x: width - 240, y: 70 },
      ];

      indicators.forEach(ind => {
        // Warp text coordinate based on wave height at position
        const hmx = (ind.x / width) * simWidth;
        const hmy = (ind.y / height) * simHeight;
        const idx = Math.min(size - 1, Math.max(0, Math.floor(hmx) + Math.floor(hmy) * simWidth));
        const dy = (b1[idx] || 0) * 0.15;
        ctx.fillText(ind.text, ind.x, ind.y + dy);
      });

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [darkMode]);

  // Touch and pointer event listeners
  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current.active = true;
    mouseRef.current.x = x;
    mouseRef.current.y = y;

    // Map screen coordinate to simulation
    const hx = (x / rect.width) * simWidth;
    const hy = (y / rect.height) * simHeight;
    splash(hx, hy, 5, 600); // Big initial impact splash
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current.x = x;
    mouseRef.current.y = y;
  };

  const handlePointerUp = () => {
    mouseRef.current.active = false;
  };

  // Keyboard shortcut support (ESC exits cooldown)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 w-full h-full z-[100] overflow-hidden select-none animate-in fade-in zoom-in-95 duration-500"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block cursor-crosshair z-0" 
      />

      {/* Floating Center Panel */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center z-10 p-6">
        <div className={`p-8 md:p-12 rounded-3xl border shadow-[0_0_50px_rgba(0,0,0,0.4)] max-w-lg w-full text-center backdrop-blur-md pointer-events-auto transition-all transform hover:scale-[1.02] duration-500
          ${darkMode 
            ? 'bg-black/80 border-[#00FF41]/20 text-[#00FF41] shadow-[0_0_40px_rgba(0,255,65,0.08)]' 
            : 'bg-white/80 border-[#0055FF]/20 text-[#0055FF] shadow-[0_0_40px_rgba(0,85,255,0.08)]'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-syne font-bold mb-4 tracking-tighter leading-none uppercase">
            [ COOLDOWN POOL ]
          </h2>
          <p className="font-mono text-[11px] leading-relaxed opacity-75 mb-8">
            LET YOUR MIND DRIFT. DISTURB THE GRID SURFACE BY DRAGGING OR CLICKING THE MOUSE TO WITNESS CHAOTIC PROPAGATIONS.
          </p>

          <button
            onClick={onClose}
            className={`px-8 py-4 rounded-xl font-mono text-xs uppercase tracking-widest font-bold border transition-all cursor-pointer hover:shadow-2xl active:scale-95
              ${darkMode 
                ? 'border-[#00FF41] text-black bg-[#00FF41] hover:bg-transparent hover:text-[#00FF41] hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]' 
                : 'border-[#0055FF] text-white bg-[#0055FF] hover:bg-transparent hover:text-[#0055FF] hover:shadow-[0_0_20px_rgba(0,85,255,0.3)]'}`}
          >
            END COOLDOWN
          </button>
        </div>
      </div>
    </div>
  );
};

export default CooldownPool;
