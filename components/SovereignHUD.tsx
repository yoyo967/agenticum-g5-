
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

const NeuralFlux: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      ctx.globalAlpha = 0.3;
      
      const mid = canvas.height / 2;
      ctx.moveTo(0, mid);

      for (let x = 0; x < canvas.width; x += 2) {
        const y = mid + Math.sin(x * 0.02 + frame * 0.05) * 15 * Math.sin(frame * 0.01);
        const y2 = mid + Math.cos(x * 0.03 - frame * 0.08) * 10;
        ctx.lineTo(x, (y + y2) / 2);
      }
      ctx.stroke();
      requestAnimationFrame(draw);
    };
    draw();
  }, []);

  return <canvas ref={canvasRef} width={300} height={60} className="w-full h-14 opacity-40" />;
};

const SovereignHUD: React.FC<SovereignHUDProps> = ({ 
  confidence, entropy, activeNodes, activeNodesTotal, contextUsage, evolutionDelta = 0.042, mirrorMode, onToggleMirror 
}) => {
  return (
    <div className="flex bg-void border-b border-steel font-mono h-40 shadow-2xl relative z-10 shrink-0 select-none">
      {/* SECTION 01: ARCHITECT STATUS */}
      <div className="flex-[1.2] p-6 border-r border-steel bg-obsidian/60 flex flex-col justify-between relative group overflow-hidden transition-all duration-700 hover:bg-steel/5">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-neon/10 transition-all group-hover:bg-neon shadow-[0_0_15px_#00f0ff]" />
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-neon uppercase tracking-[0.5em]">Architect_Verified</span>
            <span className="text-[18px] font-black text-chrome uppercase tracking-[0.2em]">Yahya Yildirim</span>
          </div>
          <button 
            onClick={onToggleMirror}
            className={`px-5 py-2 border text-[9px] font-black transition-all ${mirrorMode ? 'bg-thinking border-thinking text-white shadow-[0_0_20px_#aa00ff]' : 'border-steel text-tungsten hover:border-neon hover:text-neon'}`}
          >
            {mirrorMode ? 'TWIN_ACTIVE' : 'ENGAGE_MIRROR'}
          </button>
        </div>
        <div className="flex items-end justify-between mt-auto">
           <div className="flex flex-col">
              <span className="text-[9px] text-tungsten font-black uppercase tracking-widest opacity-40">Δ_EVOLUTION</span>
              <span className={`text-3xl font-black tracking-tighter ${mirrorMode ? 'text-thinking' : 'text-chrome'}`}>{evolutionDelta.toFixed(4)}</span>
           </div>
           <div className="text-right">
              <span className="text-[9px] text-tungsten font-black uppercase tracking-widest opacity-40">KERNEL_HASH</span>
              <span className="text-[11px] font-black text-chrome block">G5_SDR_{Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
           </div>
        </div>
      </div>
      
      {/* SECTION 02: NEURAL FLUX */}
      <div className="flex-1 p-6 border-r border-steel bg-obsidian/40 flex flex-col justify-between">
         <span className="text-[10px] font-black text-tungsten uppercase tracking-[0.4em] opacity-50">Cognitive_Flux_Resonance</span>
         <NeuralFlux />
         <div className="flex justify-between items-center text-[8px] font-black text-neon uppercase tracking-[0.3em] opacity-40">
            <span>SYNC_LEVEL_09</span>
            <div className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse" />
            <span>THOUGHT_CAP: 32K</span>
         </div>
      </div>

      {/* SECTION 03: COGNITIVE MASS */}
      <div className="flex-1 p-6 border-r border-steel bg-obsidian/60 flex flex-col justify-between">
         <span className="text-[10px] font-black text-tungsten uppercase tracking-[0.4em] opacity-50">Memory_Allocation</span>
         <div className="flex flex-col">
            <span className="text-5xl font-black text-chrome tracking-tighter leading-none">{(contextUsage/1024).toFixed(1)}M</span>
            <span className="text-[10px] text-tungsten font-black uppercase tracking-widest mt-2">Tokens_In_Context</span>
         </div>
         <div className="h-[2px] bg-steel/30 w-full relative">
            <div className="absolute inset-y-0 left-0 bg-neon transition-all duration-1000" style={{ width: `${Math.min(100, (contextUsage/1048576)*100)}%` }} />
         </div>
      </div>

      {/* SECTION 04: NODE TELEMETRY */}
      <div className="flex-1 p-6 bg-obsidian/40 flex flex-col justify-between group">
         <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-tungsten uppercase tracking-[0.4em] opacity-50">Nodes_Synchronized</span>
            <div className="w-3 h-3 bg-active shadow-[0_0_15px_#00ff88] rounded-full animate-pulse" />
         </div>
         <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-active tracking-tighter leading-none">{activeNodes}</span>
            <span className="text-2xl font-black text-steel">/ {activeNodesTotal}</span>
         </div>
         <span className="text-[9px] text-tungsten font-black uppercase tracking-[0.6em] opacity-40 group-hover:opacity-100 transition-opacity">Full_Swarm_Operational</span>
      </div>
    </div>
  );
};

export default SovereignHUD;
