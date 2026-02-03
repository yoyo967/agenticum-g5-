
import React, { useEffect, useState, useRef } from 'react';

interface SovereignHUDProps {
  confidence: number;
  entropy: number;
  activeNodes: number;
  activeNodesTotal: number;
  contextUsage: number;
  evolutionDelta?: number; 
  mirrorMode?: boolean; 
  onToggleMirror?: () => void; 
}

const CognitiveResonance: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1;
      ctx.moveTo(0, canvas.height / 2);

      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * 0.05 + frame * 0.1) * 15 * Math.sin(frame * 0.02);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      requestAnimationFrame(draw);
    };
    draw();
  }, []);

  return <canvas ref={canvasRef} width={200} height={40} className="w-full h-10 opacity-30" />;
};

const SovereignHUD: React.FC<SovereignHUDProps> = ({ 
  confidence, entropy, activeNodes, activeNodesTotal, contextUsage, evolutionDelta = 0.042, mirrorMode, onToggleMirror 
}) => {
  const MAX_CONTEXT = 1048576;

  return (
    <div className="flex bg-void border-b border-steel font-mono h-36 shadow-xl relative z-10 shrink-0">
      <div className="flex-1 p-5 border-r border-steel bg-obsidian/40 flex flex-col gap-3 relative group overflow-hidden select-none transition-all duration-700 hover:bg-steel/5">
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-neon/10 transition-all group-hover:bg-neon" />
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-tungsten uppercase tracking-[0.3em]">Neural_Mirror</span>
          <button 
            onClick={onToggleMirror}
            className={`px-4 py-1 border text-[8px] font-black transition-all ${mirrorMode ? 'bg-thinking border-thinking text-white shadow-[0_0_15px_#aa00ff]' : 'border-steel text-tungsten hover:border-neon hover:text-neon'}`}
          >
            {mirrorMode ? 'ACTIVE' : 'ENGAGE_TWIN'}
          </button>
        </div>
        <div className="flex items-baseline gap-3 relative z-10">
          <span className={`text-4xl font-black tracking-tighter leading-none transition-colors ${mirrorMode ? 'text-thinking' : 'text-chrome'}`}>
            {evolutionDelta.toFixed(3)}
          </span>
          <span className="text-[10px] text-tungsten font-black uppercase tracking-[0.3em] opacity-50">Δ_EVOLUTION</span>
        </div>
        <div className="mt-auto h-[4px] bg-void w-full relative overflow-hidden">
           <div className={`absolute inset-y-0 left-0 transition-all duration-1000 ${mirrorMode ? 'bg-thinking shadow-[0_0_15px_#aa00ff]' : 'bg-neon'}`} style={{ width: `${confidence}%` }} />
        </div>
      </div>
      
      <div className="flex-1 p-5 border-r border-steel bg-obsidian/40 flex flex-col gap-3">
         <span className="text-[10px] font-black text-tungsten uppercase tracking-[0.3em]">Cognitive_Resonance</span>
         <CognitiveResonance />
         <span className="text-[8px] text-neon/40 font-black uppercase tracking-widest text-center">Sync_Stable_v9</span>
      </div>

      <div className="flex-1 p-5 border-r border-steel bg-obsidian/40 flex flex-col gap-3">
         <span className="text-[10px] font-black text-tungsten uppercase tracking-[0.3em]">Cognitive_Mass</span>
         <span className="text-4xl font-black text-chrome tracking-tighter">{(contextUsage/1000).toFixed(1)}K</span>
      </div>

      <div className="flex-1 p-5 bg-obsidian/40 flex flex-col gap-3">
         <span className="text-[10px] font-black text-tungsten uppercase tracking-[0.3em]">Nodes_Synced</span>
         <span className="text-4xl font-black text-active tracking-tighter">{activeNodes}/{activeNodesTotal}</span>
      </div>
    </div>
  );
};

export default SovereignHUD;
