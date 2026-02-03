
import React, { useEffect, useState } from 'react';

interface SovereignHUDProps {
  confidence: number;
  entropy: number;
  activeNodes: number;
  activeNodesTotal: number;
  contextUsage: number;
}

const SovereignHUD: React.FC<SovereignHUDProps> = ({ confidence, entropy, activeNodes, activeNodesTotal, contextUsage }) => {
  const MAX_CONTEXT = 1048576; // 1M tokens
  const contextPercent = Math.min(100, (contextUsage / MAX_CONTEXT) * 100);
  const [waveData, setWaveData] = useState<number[]>(Array.from({ length: 60 }, () => 5 + Math.random() * 20));

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveData(prev => {
        const next = [...prev.slice(1), 5 + Math.random() * 60];
        return next;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const Panel = ({ color, label, value, unit, percent, subLabel, children }: any) => (
    <div className="flex-1 p-5 border-r border-steel bg-obsidian/40 flex flex-col gap-3 relative group overflow-hidden select-none transition-all duration-700 hover:bg-steel/5">
      <div className={`absolute top-0 left-0 w-full h-[1.5px] bg-${color}/10 transition-all group-hover:bg-${color} group-hover:shadow-[0_0_10px_currentColor]`} />
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-tungsten uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-opacity">{label}</span>
        <span className={`text-[9px] text-${color} font-black uppercase tracking-widest`}>{unit}</span>
      </div>
      <div className="flex items-baseline gap-3 relative z-10">
        <span className="text-4xl font-black text-chrome tracking-tighter leading-none">{value}</span>
        {subLabel && <span className="text-[10px] text-tungsten font-black uppercase tracking-[0.3em] opacity-50">{subLabel}</span>}
      </div>
      <div className="mt-auto relative">
        {children}
        <div className="h-[4px] bg-void w-full relative overflow-hidden shadow-inner border border-white/5">
          <div 
            className={`absolute inset-y-0 left-0 bg-${color} shadow-[0_0_15px_currentColor] transition-all duration-1000 ease-out`} 
            style={{ width: `${percent}%` }} 
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex bg-void border-b border-steel font-mono h-36 shadow-xl relative z-10 shrink-0">
      <Panel color="neon" label="Mesh_Confidence" value={confidence.toFixed(1)} unit="SYNC_ALPHA" percent={confidence} subLabel="PROB_STABLE" />
      
      <div className="flex-1 p-5 border-r border-steel bg-obsidian/40 flex flex-col gap-3 relative overflow-hidden group select-none transition-all duration-700 hover:bg-steel/5">
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-warning/10 transition-all group-hover:bg-warning group-hover:shadow-[0_0_10px_currentColor]" />
        <div className="flex justify-between items-center">
           <span className="text-[10px] font-black text-tungsten uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-opacity">Dynamic_Entropy</span>
           <span className="text-[9px] text-warning font-black tracking-widest animate-pulse uppercase">Active</span>
        </div>
        <div className="flex items-baseline gap-3 relative z-10">
           <span className="text-4xl font-black text-chrome tracking-tighter leading-none">{entropy.toFixed(4)}</span>
           <span className="text-[12px] text-warning font-black opacity-60">Δ_FLUX</span>
        </div>
        <div className="mt-auto flex gap-[1.5px] h-10 items-end opacity-10 group-hover:opacity-40 transition-all duration-700">
          {waveData.map((h, i) => (
            <div key={i} className="flex-1 bg-warning transition-all duration-300" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      <Panel 
        color="thinking" 
        label="Cognitive_Mass" 
        value={(contextUsage / 1000).toFixed(1)} 
        unit="KT_MEM" 
        percent={contextPercent} 
        subLabel={`/ ${(MAX_CONTEXT/1000).toFixed(0)}KT`} 
      >
        <div className="absolute -top-12 right-0 opacity-5 group-hover:opacity-20 transition-opacity pointer-events-none">
           <span className="text-[32px] font-black text-thinking tracking-tighter">MEM_MAP</span>
        </div>
      </Panel>
      
      <div className="flex-1 p-5 flex flex-col gap-3 bg-obsidian/40 relative overflow-hidden group select-none transition-all duration-700 hover:bg-steel/5">
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-active/10 transition-all group-hover:bg-active group-hover:shadow-[0_0_10px_currentColor]" />
        <div className="flex justify-between items-center">
           <span className="text-[10px] font-black text-tungsten uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-opacity">Sovereign_Mesh</span>
           <span className="text-[9px] text-active font-black tracking-widest uppercase flex items-center gap-1.5">
             <div className="w-1 h-1 bg-active rounded-full shadow-[0_0_5px_currentColor]" /> Nominal
           </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black text-chrome tracking-tighter leading-none">{activeNodes}</span>
          <span className="text-[10px] text-tungsten font-black uppercase tracking-[0.3em] opacity-50">/ {activeNodesTotal} ELITE</span>
        </div>
        <div className="mt-auto">
           <div className="grid grid-cols-[repeat(8,1fr)] gap-1.5 h-3 mb-2.5">
            {Array.from({length: activeNodesTotal}).map((_, i) => (
              <div key={i} className={`h-full transition-all duration-700 relative ${i < activeNodes ? 'bg-active shadow-[0_0_8px_#00ff88]' : 'bg-steel/10 opacity-5'}`}>
                {i < activeNodes && <div className="absolute inset-0 bg-white/10 animate-pulse" />}
              </div>
            ))}
          </div>
          <div className="h-[4px] bg-void w-full relative overflow-hidden shadow-inner border border-white/5">
            <div className="absolute inset-y-0 left-0 bg-active shadow-[0_0_15px_#00ff88] transition-all duration-1000" style={{ width: `${(activeNodes/activeNodesTotal)*100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SovereignHUD;
