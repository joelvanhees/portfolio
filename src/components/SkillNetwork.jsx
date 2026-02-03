import { useEffect, useRef, useState } from 'react';

const SkillNetwork = ({ darkMode, className }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const defaultClass = "relative w-full h-[60vh] md:h-[80vh] border border-current rounded-xl overflow-hidden mt-12 bg-black/5";
  const appliedClass = className || defaultClass;

  const nodes = [
    { id: 'Design', x: 50, y: 50, label: 'Design', desc: "Holistic design approach integrating strategy, aesthetics, and functionality across digital and physical mediums." },
    { id: '3D', x: 25, y: 40, label: '3D & Product', desc: "Creation of three-dimensional assets and environments for product visualization and artistic expression." },
    { id: 'Code', x: 75, y: 40, label: 'Creative Code', desc: "Developing custom tools and generative visual systems using code as a primary design medium." },
    { id: 'Graphic', x: 35, y: 65, label: 'Graphic Design', desc: "Mastery of typography, grid systems, and layout to create clear and impactful visual communication." },
    { id: 'Comm', x: 65, y: 65, label: 'Communication', desc: "Strategic transmission of information through visual language to achieve defined objectives." },
    { id: 'Adobe', x: 38, y: 28, label: 'Adobe Suite', desc: "Advanced proficiency in the Adobe Creative Cloud ecosystem, including InDesign, Photoshop, Illustrator, Premiere Pro, and After Effects for static and motion design." },
    { id: 'Affinity', x: 62, y: 28, label: 'Affinity', desc: "Proficiency in Affinity Designer, Photo, and Publisher as efficient alternatives for vector and raster editing." },

    { id: 'C4D', x: 10, y: 20, label: 'Cinema 4D', desc: "High-end 3D motion graphics and simulation for broadcast and commercial visual effects." },
    { id: 'Blender', x: 25, y: 15, label: 'Blender', desc: "Open-source 3D pipeline for modeling, sculpting, and real-time rendering." },
    { id: 'Fusion', x: 10, y: 60, label: 'Fusion 360', desc: "Parametric CAD modeling for precise industrial design and product manufacturing." },
    { id: 'Print', x: 20, y: 55, label: '3D Printing', desc: "Specialist in additive manufacturing and rapid prototyping. From custom commissions to my own product line, I bridge digital design and physical reality." },
    { id: 'Xcode', x: 90, y: 20, label: 'Xcode', desc: "Development environment for native Apple platforms, enabling the creation of bespoke iOS and macOS applications." },
    { id: 'Touch', x: 90, y: 60, label: 'TouchDesigner', desc: "Node-based visual programming for real-time interactive multimedia content and installations." },
    { id: 'React', x: 75, y: 15, label: 'React', desc: "Building modern, reactive web interfaces and single-page applications with component-based architecture." },
    { id: 'Story', x: 50, y: 90, label: 'Storytelling', desc: "Crafting compelling narratives that drive the visual identity and connect with the audience on an emotional level." },
    { id: 'AI', x: 50, y: 75, label: 'AI Generative', desc: "AI native since day one. Deep expertise in LLM architecture, image/video generation, and custom model training. I provide advanced consulting and workshops, staying constantly ahead of the research curve." },
  ];

  const links = [
    ['Design', '3D'], ['Design', 'Code'], ['Design', 'Story'], ['Design', 'Adobe'], ['Design', 'Affinity'],
    ['Design', 'Graphic'], ['Design', 'Comm'],
    ['3D', 'C4D'], ['3D', 'Blender'], ['3D', 'Fusion'], ['3D', 'Print'],
    ['Code', 'Xcode'], ['Code', 'Touch'], ['Code', 'React'],
    ['Story', 'AI'], ['Adobe', 'AI'],
    ['Graphic', 'Adobe'], ['Graphic', 'Affinity'],
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const handleResize = () => {
      if (containerRef.current && canvas) {
        const { clientWidth, clientHeight } = containerRef.current;
        canvas.width = clientWidth;
        canvas.height = clientHeight;
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    handleResize();

    const render = () => {
      time += 0.005;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = darkMode ? 'rgba(0, 255, 65, 0.2)' : 'rgba(0, 85, 255, 0.2)';
      ctx.lineWidth = 1;

      const getPos = (node, t) => {
        const seed = node.id.charCodeAt(0);
        const floatX = Math.sin(t + seed) * 2;
        const floatY = Math.cos(t + seed * 0.5) * 2;

        return {
          x: (node.x / 100) * canvas.width + floatX,
          y: (node.y / 100) * canvas.height + floatY,
        };
      };

      links.forEach(([idA, idB]) => {
        const nodeA = nodes.find(n => n.id === idA);
        const nodeB = nodes.find(n => n.id === idB);
        if (nodeA && nodeB) {
          const posA = getPos(nodeA, time);
          const posB = getPos(nodeB, time);
          ctx.beginPath();
          ctx.moveTo(posA.x, posA.y);
          ctx.lineTo(posB.x, posB.y);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [darkMode]);

  return (
    <div ref={containerRef} className={appliedClass}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            animation: `float-${node.id} 6s infinite ease-in-out`,
          }}
          onClick={() => setSelectedNode(node)}
        >
          <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full mx-auto mb-2 transition-all duration-300
            ${darkMode ? 'bg-green-500 shadow-[0_0_10px_rgba(0,255,65,0.5)]' : 'bg-blue-600 shadow-[0_0_10px_rgba(0,85,255,0.5)]'}
            group-hover:scale-150
          `}></div>

          <div className={`text-[10px] md:text-xs font-syne font-bold uppercase tracking-widest text-center whitespace-nowrap opacity-70 group-hover:opacity-100 transition-opacity
              ${darkMode ? 'text-white' : 'text-black'}
          `}>
            {node.label}
          </div>
        </div>
      ))}

      {selectedNode && (
        <div
          className={`absolute z-50 p-3 rounded-xl border backdrop-blur-md shadow-2xl w-48 md:w-56 transition-all duration-300 animate-in fade-in zoom-in-95 max-h-[200px] overflow-y-auto break-words
             ${darkMode ? 'bg-black/90 border-white/20 text-white' : 'bg-white/90 border-black/20 text-black'}
           `}
          style={{
            left: `clamp(10px, ${selectedNode.x}%, calc(100% - 200px))`,
            top: selectedNode.y > 50 ? `auto` : `${selectedNode.y + 8}%`,
            bottom: selectedNode.y > 50 ? `${100 - selectedNode.y + 8}%` : `auto`,
          }}
        >
          <div className="flex items-center gap-2 mb-2 border-b border-current/10 pb-2">
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedNode(null); }}
              className="w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            />
            <span className="text-[9px] font-mono uppercase opacity-50 ml-auto">INFO_NODE</span>
          </div>
          <h4 className="font-syne font-bold uppercase mb-1 text-xs">{selectedNode.label}</h4>
          <p className="font-mono text-[10px] opacity-80 leading-relaxed">
            {selectedNode.desc}
          </p>
        </div>
      )}

      <style>{`
        ${nodes.map(n => `
          @keyframes float-${n.id} {
            0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
            50% { transform: translate(-50%, -50%) translate(${Math.sin(n.id.charCodeAt(0)) * 10}px, ${Math.cos(n.id.charCodeAt(0)) * 10}px); }
          }
        `).join('')}
      `}</style>
    </div>
  );
};

export default SkillNetwork;
