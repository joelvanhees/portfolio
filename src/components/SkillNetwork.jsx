import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { skillLinks, skillNodes } from '../content/skills';

/*
 * The skill map.
 *
 * With no role selected it shows the authored overview. Selecting a role
 * filters to that role's skills and rearranges them into a ring.
 *
 * Everything is driven from one set of positions updated per frame, so the
 * links stay welded to the dots while the layout morphs and while the nodes
 * drift. Nodes never sit still: each wanders on its own slow Lissajous path,
 * which keeps the link pattern continuously reforming.
 *
 * Nothing may leave the window. Positions are clamped in pixels against each
 * node's measured box, so a long label cannot push a dot past the frame and
 * get sliced off at the edge.
 */

const DOT = 'w-3 h-3 md:w-4 md:h-4 rounded-full mx-auto mb-2 transition-transform duration-300';

// Ring geometry for a filtered role.
const ringPosition = (i, total) => {
  const twoRings = total > 6;
  const inner = twoRings && i % 2 === 1;
  const ringCount = twoRings ? Math.ceil(total / 2) : total;
  const ringIndex = twoRings ? Math.floor(i / 2) : i;
  const angle = (ringIndex / ringCount) * Math.PI * 2 - Math.PI / 2 + (inner ? Math.PI / ringCount : 0);
  const rx = inner ? 20 : 32;
  const ry = inner ? 18 : 28;
  return { x: 50 + Math.cos(angle) * rx, y: 50 + Math.sin(angle) * ry };
};

// Two incommensurate frequencies per axis, so a node never repeats a loop the
// eye can latch onto and the whole field keeps reforming.
const drift = (seed, t) => ({
  x: Math.sin(t * 0.21 + seed) * 3.1 + Math.sin(t * 0.13 + seed * 2.7) * 1.9,
  y: Math.cos(t * 0.17 + seed * 1.3) * 2.7 + Math.cos(t * 0.11 + seed * 0.6) * 1.6,
});

const clamp = (v, lo, hi) => (hi < lo ? (lo + hi) / 2 : Math.min(Math.max(v, lo), hi));

const SkillNetwork = ({ darkMode, className, activeRole = null }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const nodeRefs = useRef({});
  const positions = useRef({});
  const live = useRef({});
  const speed = useRef(1);
  const calmRef = useRef(false);
  const [selectedId, setSelectedId] = useState(null);
  const [panelAnchor, setPanelAnchor] = useState(null);

  const defaultClass =
    'relative w-full h-[60vh] md:h-[80vh] border border-current rounded-xl overflow-hidden mt-12 bg-black/5';

  const { visible, targets, links } = useMemo(() => {
    if (!activeRole) {
      const overview = skillNodes.filter((n) => n.base);
      return {
        visible: overview,
        targets: Object.fromEntries(overview.map((n) => [n.id, n.base])),
        links: skillLinks,
      };
    }
    const inRole = skillNodes.filter((n) => n.cats.includes(activeRole));
    const hub = inRole.find((n) => n.base && n.base.x === 50 && n.base.y === 50) ?? inRole[0];
    const spokes = inRole.filter((n) => n !== hub);
    return {
      visible: inRole,
      targets: {
        [hub.id]: { x: 50, y: 50 },
        ...Object.fromEntries(spokes.map((n, i) => [n.id, ringPosition(i, spokes.length)])),
      },
      links: spokes.map((n) => [hub.id, n.id]),
    };
  }, [activeRole]);

  const visibleIds = useMemo(() => new Set(visible.map((n) => n.id)), [visible]);
  const selectedNode = visibleIds.has(selectedId) ? skillNodes.find((n) => n.id === selectedId) : null;

  /*
   * The panel is placed where the dot was at the moment of the tap, resolved
   * to a concrete box right here in the handler. Reading the refs during
   * render instead would be both a lint error and wrong: the dot keeps
   * drifting, and the panel would chase it around the window.
   */
  const openNode = useCallback((node) => {
    const container = containerRef.current;
    const at = live.current[node.id];
    if (container && at) {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const pw = Math.min(320, w - 24);
      const ph = 150;
      const left = clamp(at.x - pw / 2, 12, Math.max(12, w - pw - 12));
      const below = at.y + 26;
      const top = below + ph > h - 12 ? Math.max(12, at.y - ph - 26) : below;
      setPanelAnchor({ left, top, width: pw });
    } else {
      setPanelAnchor(null);
    }
    setSelectedId((current) => (current === node.id ? null : node.id));
  }, []);

  /*
   * While the panel is open the field settles to a crawl so the reading is not
   * fighting the motion. It picks back up once the visitor scrolls — which
   * also closes the panel — or after a spell of nothing happening.
   */
  useEffect(() => {
    calmRef.current = Boolean(selectedNode);
    if (!selectedNode) return undefined;
    const wake = setTimeout(() => {
      calmRef.current = false;
    }, 5000);
    return () => clearTimeout(wake);
  }, [selectedNode]);

  useEffect(() => {
    if (!selectedNode) return undefined;
    const close = () => setSelectedId(null);
    const onPointerDown = (e) => {
      if (!e.target.closest('[data-skill-panel]') && !e.target.closest('[data-skill-node]')) close();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('scroll', close, { passive: true });
    window.addEventListener('resize', close, { passive: true });
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', close);
      window.removeEventListener('resize', close);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [selectedNode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    let frame;
    let t = 0;
    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${container.clientHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    const render = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      // Ease between wandering and near-still rather than switching abruptly.
      const wanted = calmRef.current ? 0.12 : 1;
      speed.current += (wanted - speed.current) * Math.min(dt * 2.5, 1);
      t += dt * speed.current;

      const w = container.clientWidth;
      const h = container.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const frameLive = {};
      visible.forEach((node) => {
        const target = targets[node.id];
        const seed = node.id.charCodeAt(0) + node.id.length;
        const current = positions.current[node.id] ?? target;
        const x = current.x + (target.x - current.x) * 0.09;
        const y = current.y + (target.y - current.y) * 0.09;
        positions.current[node.id] = { x, y };

        const wander = drift(seed, t);
        const el = nodeRefs.current[node.id];
        // Clamp against the node's own box, so neither the dot nor its label
        // can cross the frame and get clipped.
        const halfW = el ? el.offsetWidth / 2 : 40;
        const halfH = el ? el.offsetHeight / 2 : 16;
        const px = clamp(((x + wander.x) / 100) * w, halfW + 6, w - halfW - 6);
        const py = clamp(((y + wander.y) / 100) * h, halfH + 6, h - halfH - 6);

        frameLive[node.id] = { x: px, y: py };
        if (el) el.style.transform = `translate3d(${px}px, ${py}px, 0) translate3d(-50%, -50%, 0)`;
      });
      live.current = frameLive;

      ctx.strokeStyle = darkMode ? 'rgba(199, 255, 46, 0.22)' : 'rgba(0, 85, 255, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      links.forEach(([a, b]) => {
        const pa = frameLive[a];
        const pb = frameLive[b];
        if (!pa || !pb) return;
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
      });
      ctx.stroke();

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [darkMode, visible, targets, links]);

  return (
    <div ref={containerRef} className={className || defaultClass}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {skillNodes.map((node) => {
        const shown = visibleIds.has(node.id);
        return (
          <button
            key={node.id}
            data-skill-node
            ref={(el) => {
              nodeRefs.current[node.id] = el;
            }}
            type="button"
            aria-hidden={!shown}
            tabIndex={shown ? 0 : -1}
            onClick={() => openNode(node)}
            className={`absolute left-0 top-0 group bg-transparent border-none p-0 transition-opacity duration-500
              ${shown ? 'opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
          >
            <span
              className={`block ${DOT} group-hover:scale-150
                ${darkMode ? 'bg-acid shadow-[0_0_10px_rgba(199,255,46,0.5)]' : 'bg-blue-600 shadow-[0_0_10px_rgba(0,85,255,0.5)]'}`}
            />
            <span
              className={`block text-[10px] md:text-xs font-display font-bold uppercase tracking-widest text-center whitespace-nowrap opacity-70 group-hover:opacity-100 transition-opacity
                ${darkMode ? 'text-white' : 'text-black'}`}
            >
              {node.label}
            </span>
          </button>
        );
      })}

      {selectedNode && (
        <div
          data-skill-panel
          style={panelAnchor
            ? { left: `${panelAnchor.left}px`, top: `${panelAnchor.top}px`, width: `${panelAnchor.width}px` }
            : { left: '50%', bottom: '0.75rem', transform: 'translateX(-50%)', width: 'min(20rem, calc(100% - 1.5rem))' }}
          className={`absolute z-50 p-4 rounded-2xl max-h-[45%] overflow-y-auto break-words
            liquid-panel ${darkMode ? 'text-white' : 'liquid-panel--light text-black'}`}
        >
          <div className="flex items-center gap-2 mb-2 border-b border-current/10 pb-2">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              aria-label="Close"
              className="w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            />
            <span className="text-[9px] font-meta uppercase opacity-50 ml-auto">INFO_NODE</span>
          </div>
          <h4 className="font-display font-bold uppercase mb-1 text-xs">{selectedNode.label}</h4>
          <p className="font-meta text-[10px] opacity-80 leading-relaxed">{selectedNode.desc}</p>
        </div>
      )}
    </div>
  );
};

export default SkillNetwork;
