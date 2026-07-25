import { useEffect, useMemo, useRef, useState } from 'react';
import { skillLinks, skillNodes } from '../content/skills';

/*
 * The skill map.
 *
 * With no role selected it shows the authored overview. Selecting a role
 * filters to that role's skills and rearranges them into a ring, so a
 * selection reads as an answer rather than as the same picture with holes in
 * it.
 *
 * Dots and links are driven from one set of positions updated per frame, so
 * the lines stay attached to the dots while the layout morphs. Only transform
 * and opacity are touched on the DOM side.
 */

const DOT = 'w-3 h-3 md:w-4 md:h-4 rounded-full mx-auto mb-2 transition-transform duration-300';

// Ring geometry for a filtered role. Elliptical because the container is
// wider than it is tall, and split across two radii once there are enough
// nodes that a single ring would collide its own labels.
const ringPosition = (i, total) => {
  const twoRings = total > 6;
  const inner = twoRings && i % 2 === 1;
  const ringCount = twoRings ? Math.ceil(total / 2) : total;
  const ringIndex = twoRings ? Math.floor(i / 2) : i;
  const angle = (ringIndex / ringCount) * Math.PI * 2 - Math.PI / 2 + (inner ? Math.PI / ringCount : 0);
  const rx = inner ? 21 : 35;
  const ry = inner ? 19 : 31;
  return { x: 50 + Math.cos(angle) * rx, y: 50 + Math.sin(angle) * ry };
};

const SkillNetwork = ({ darkMode, className, activeRole = null }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const nodeRefs = useRef({});
  const positions = useRef({});
  const [selectedId, setSelectedId] = useState(null);

  const defaultClass =
    'relative w-full h-[60vh] md:h-[80vh] border border-current rounded-xl overflow-hidden mt-12 bg-black/5';

  // Which nodes are on screen, and where they are headed.
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
    // The node that already sits at the centre of the overview leads the ring.
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

  // Derived rather than synced: a node filtered out by a role change simply
  // stops resolving, so its panel disappears without an effect writing state.
  const selectedNode = visibleIds.has(selectedId)
    ? skillNodes.find((n) => n.id === selectedId)
    : null;

  /*
   * The panel used to stay open once it had been opened — scrolling away or
   * tapping elsewhere left it hanging over the page. It now closes on any of
   * those, which is what every other popover on a page does.
   */
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
    let frame;
    let time = 0;

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

    const render = () => {
      time += 0.005;
      const w = container.clientWidth;
      const h = container.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const live = {};
      visible.forEach((node) => {
        const target = targets[node.id];
        const seed = node.id.charCodeAt(0);
        const current = positions.current[node.id] ?? target;
        // Ease toward the target so a role change reads as a rearrangement.
        const x = current.x + (target.x - current.x) * 0.09;
        const y = current.y + (target.y - current.y) * 0.09;
        positions.current[node.id] = { x, y };

        const px = (x / 100) * w + Math.sin(time + seed) * 3;
        const py = (y / 100) * h + Math.cos(time + seed * 0.5) * 3;
        live[node.id] = { px, py };

        const el = nodeRefs.current[node.id];
        if (el) el.style.transform = `translate3d(${px}px, ${py}px, 0) translate3d(-50%, -50%, 0)`;
      });

      ctx.strokeStyle = darkMode ? 'rgba(199, 255, 46, 0.22)' : 'rgba(0, 85, 255, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      links.forEach(([a, b]) => {
        const pa = live[a];
        const pb = live[b];
        if (!pa || !pb) return;
        ctx.moveTo(pa.px, pa.py);
        ctx.lineTo(pb.px, pb.py);
      });
      ctx.stroke();

      frame = requestAnimationFrame(render);
    };

    render();
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
            onClick={() => setSelectedId((current) => (current === node.id ? null : node.id))}
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
          className={`absolute z-50 left-1/2 -translate-x-1/2 bottom-3 w-[min(20rem,calc(100%-1.5rem))] p-4 rounded-2xl max-h-[45%] overflow-y-auto break-words
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
