
import React from 'react';

interface GATESOverlayProps {
  isActive: boolean;
  step: 'GROUNDING' | 'ANALYSIS' | 'TRACKING' | 'EVOLUTION' | 'SOVEREIGN' | null;
  nodeId: string;
}

const GATESOverlay: React.FC<GATESOverlayProps> = ({ isActive, step, nodeId }) => {
  if (!isActive) return null;

  const steps = [
    { key: 'GROUNDING', label: 'GROUNDING_UPLINK' },
    { key: 'ANALYSIS', label: 'CAUSAL_ANALYSIS' },
    { key: 'TRACKING', label: 'LITERAL_TRACKING' },
    { key: 'EVOLUTION', label: 'SYNTHETIC_EVOLUTION' },
    { key: 'SOVEREIGN', label: 'SOVEREIGN_FINALITY' }
  ];

  const currentIdx = steps.findIndex(s => s.key === step);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void/60 backdrop-blur-md pointer-events-none font-mono">
      <div className="relative p-16 border-4 border-active/40 bg-void/95 shadow-[0_0_100px_rgba(0,255,136,0.2)]">
        <div className="flex flex-col gap-10 items-center min-w-[350px]">
          <div className="flex items-center gap-6 border-b border-active/20 pb-8 w-full justify-center">
            <div className="w-6 h-6 bg-active shadow-[0_0_25px_#00ff88] animate-ping" />
            <h2 className="text-2xl font-black text-active tracking-[0.8em] uppercase">GATES_PROTOCOL</h2>
          </div>

          <div className="flex flex-col gap-6 w-full">
            {steps.map((s, idx) => {
              const isCurrent = step === s.key;
              const isPast = currentIdx > idx;
              return (
                <div key={s.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`w-3 h-3 ${isPast ? 'bg-active shadow-[0_0_10px_#00ff88]' : isCurrent ? 'bg-active animate-pulse shadow-[0_0_15px_#00ff88]' : 'bg-steel/30'}`} />
                    <span className={`text-[12px] font-black tracking-[0.4em] ${isPast || isCurrent ? 'text-active' : 'text-tungsten/40'}`}>
                      {s.label}
                    </span>
                  </div>
                  <div className="text-[10px] font-black">
                    {isPast ? <span className="text-active">VERIFIED</span> : isCurrent ? <span className="text-active animate-pulse">ACTIVE</span> : <span className="text-tungsten/20">PENDING</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 pt-8 border-t border-active/20 w-full text-center">
            <span className="text-[9px] text-tungsten font-black uppercase tracking-[0.6em] opacity-60">Currently_Engaging_Node</span>
            <div className="text-3xl text-chrome font-black tracking-widest mt-2">
              {nodeId || 'SYSTEM'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-[10px] text-tungsten font-black uppercase tracking-[1em] opacity-40 animate-pulse">
        Parallel_Consensus_In_Progress
      </div>
    </div>
  );
};

export default GATESOverlay;
