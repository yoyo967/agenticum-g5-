
import React, { useState, useEffect, useMemo } from 'react';

interface FinalityProtocolProps {
  isActive: boolean;
  onVerified: () => void;
}

const FinalityProtocol: React.FC<FinalityProtocolProps> = ({ isActive, onVerified }) => {
  const [holdProgress, setHoldProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const [status, setStatus] = useState('AWAITING_SOVEREIGN_OBJECTIVE_SIGNATURE');

  const logs = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    hex: `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
    label: ['ARTIFACT_PACK', 'SEALING_VAULT', 'HASH_FINALITY', 'UPLINK_TERM', 'OS_FREEZE', 'DETERM_LOCK'][Math.floor(Math.random()*6)]
  })), [isActive]);

  useEffect(() => {
    let interval: number;
    if (isPressing) {
      interval = window.setInterval(() => {
        setHoldProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setStatus('SIGNATURE_VERIFIED_//_SEALING_VAULT_DEEP');
            setTimeout(onVerified, 2000);
            return 100;
          }
          return p + 2.0; 
        });
      }, 30);
    } else {
      setHoldProgress(p => Math.max(0, p - 10));
    }
    return () => clearInterval(interval);
  }, [isPressing, onVerified]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[400] bg-void/98 backdrop-blur-[40px] flex flex-col items-center justify-center p-8 md:p-16 font-mono overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#ffffff_0%,transparent_100%)] animate-pulse" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* Cinematic Telemetry Rain */}
      <div className="absolute inset-y-0 left-10 w-48 overflow-hidden opacity-20 hidden lg:block pointer-events-none border-r border-white/5">
        <div className="flex flex-col gap-4 animate-[scroll_30s_linear_infinite]">
          {[...logs, ...logs].map((l, i) => (
            <div key={i} className="text-[9px] text-neon font-black tracking-widest uppercase">
              {l.hex} // {l.label} // <span className="text-active">OK</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute inset-y-0 right-10 w-48 overflow-hidden opacity-20 hidden lg:block pointer-events-none border-l border-white/5">
        <div className="flex flex-col gap-4 animate-[scroll_25s_linear_infinite_reverse]">
          {[...logs, ...logs].map((l, i) => (
            <div key={i} className="text-[9px] text-neon font-black tracking-widest uppercase text-right">
              <span className="text-active">OK</span> // {l.label} // {l.hex}
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-5xl border border-steel bg-obsidian text-center shadow-[0_0_300px_rgba(0,0,0,1)] p-20 md:p-32 space-y-24 animate-in zoom-in-95 duration-1000 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-neon to-transparent shadow-[0_0_40px_#00f0ff] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5" />
        
        <div className="space-y-12 relative z-10">
          <div className="flex justify-center mb-16">
            <div className="w-24 h-24 bg-neon flex items-center justify-center shadow-[0_0_80px_rgba(0,240,255,0.6)] relative group transition-all duration-700 hover:scale-110">
              <span className="text-void font-black text-5xl z-10 tracking-tighter">G5</span>
              <div className="absolute inset-0 border-4 border-neon animate-ping opacity-30" />
              <div className="absolute -inset-4 border border-white/10 group-hover:border-neon/40 transition-all duration-1000" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-6xl font-black text-chrome tracking-[1.2em] uppercase leading-none pl-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">Finality</h2>
            <div className="flex items-center justify-center gap-12 mt-4">
               <div className="h-[1.5px] w-32 bg-gradient-to-r from-transparent to-steel" />
               <p className="text-[14px] text-tungsten font-black tracking-[0.8em] uppercase opacity-60">Objective_Consensus_Seal</p>
               <div className="h-[1.5px] w-32 bg-gradient-to-l from-transparent to-steel" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-20 relative z-10">
          <div 
            onMouseDown={() => setIsPressing(true)}
            onMouseUp={() => setIsPressing(false)}
            onMouseLeave={() => setIsPressing(false)}
            onTouchStart={() => setIsPressing(true)}
            onTouchEnd={() => setIsPressing(false)}
            className={`relative w-72 h-72 border-4 border-steel transition-all duration-700 cursor-crosshair active:scale-95 group overflow-hidden ${isPressing ? 'border-neon shadow-[0_0_60px_rgba(0,240,255,0.4)]' : 'hover:border-steel/80 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]'}`}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-48 h-48 border-2 border-neon/10 rotate-45 transition-all duration-1000 ease-out ${isPressing ? 'scale-150 rotate-[405deg] border-neon shadow-[0_0_60px_#00f0ff]' : ''}`} />
              <div className={`absolute w-40 h-40 border-2 border-active/10 -rotate-45 transition-all duration-1500 ease-out ${isPressing ? 'scale-125 rotate-[315deg] border-active shadow-[0_0_60px_#00ff88]' : ''}`} />
            </div>
            
            <svg className="absolute inset-0 w-full h-full -rotate-90 scale-[1.2] pointer-events-none">
              <circle 
                cx="144" cy="144" r="138" 
                fill="none" 
                stroke="#00f0ff" 
                strokeWidth="10" 
                strokeDasharray="867" 
                strokeDashoffset={867 - (867 * holdProgress / 100)}
                className="transition-all duration-100"
                strokeLinecap="square"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12 z-20">
              <span className={`text-[16px] font-black uppercase tracking-[0.8em] transition-all duration-700 ${isPressing ? 'text-neon scale-125 drop-shadow-[0_0_15px_#00f0ff]' : 'text-tungsten opacity-40 group-hover:opacity-100'}`}>
                {isPressing ? 'SEALING...' : 'EXEC_LOCK'}
              </span>
              {isPressing && (
                 <div className="mt-6 flex flex-col items-center gap-3">
                    <span className="text-[16px] text-neon font-black tracking-[0.2em]">{holdProgress.toFixed(0)}%</span>
                    <div className="w-24 h-1 bg-neon/20 overflow-hidden border border-white/5">
                       <div className="h-full bg-neon animate-[pulse_0.5s_infinite]" style={{ width: `${holdProgress}%` }} />
                    </div>
                 </div>
              )}
            </div>
          </div>

          <div className="space-y-8 w-full max-w-lg">
            <span className={`text-[15px] font-black uppercase tracking-[1em] transition-all duration-700 ${holdProgress > 80 ? 'text-active drop-shadow-[0_0_20px_#00ff88]' : 'text-neon'} animate-pulse block`}>
              {status}
            </span>
            <div className="w-full h-1.5 bg-void relative overflow-hidden shadow-2xl border border-white/10">
              <div 
                className={`absolute inset-y-0 left-0 transition-all duration-100 shadow-[0_0_30px_currentColor] ${holdProgress > 80 ? 'bg-active' : 'bg-neon'}`} 
                style={{ width: `${holdProgress}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-24 text-left border-t border-steel pt-16 relative z-10">
           <div className="flex flex-col gap-4">
             <span className="text-[11px] text-tungsten font-black uppercase tracking-[0.6em] opacity-40">System_Forensic_Sig_Hash</span>
             <span className="text-[14px] text-chrome font-black tracking-[0.2em] font-mono drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">0x7F2B-CNS-ED09-VAULT-LOCKED</span>
           </div>
           <div className="flex flex-col gap-4 text-right">
             <span className="text-[11px] text-tungsten font-black uppercase tracking-[0.6em] opacity-40">Global_Sovereign_Consensus</span>
             <span className="text-[14px] text-active font-black uppercase tracking-[0.8em] shadow-[0_0_25px_rgba(0,255,136,0.2)] bg-active/5 px-4 py-2 border border-active/20">DETERMINISTIC_SYNC_OK</span>
           </div>
        </div>
        
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-neon/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-thinking/5 rounded-full blur-[150px] pointer-events-none" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
      `}} />
    </div>
  );
};

export default FinalityProtocol;
