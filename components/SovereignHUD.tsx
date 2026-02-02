
import React from 'react';
import { ICONS } from '../constants';

interface SovereignHUDProps {
  confidence: number;
  entropy: number;
  activeNodes: number;
}

const SovereignHUD: React.FC<SovereignHUDProps> = ({ confidence, entropy, activeNodes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-steel/20 border-b border-steel">
      <div className="p-3 border-r border-steel/50 flex flex-col gap-1 relative overflow-hidden group">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[8px] text-tungsten font-black uppercase tracking-widest">Strategic_Truth_Threshold</span>
          <span className="text-[10px] text-neon font-mono font-bold tracking-tighter">{confidence.toFixed(2)}%</span>
        </div>
        <div className="h-1 bg-steel/30 relative overflow-hidden">
          <div 
            className="h-full bg-neon transition-all duration-700 shadow-[0_0_10px_rgba(0,240,255,0.4)]" 
            style={{ width: `${confidence}%` }} 
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[loading_2s_infinite]"></div>
        </div>
        <div className="flex justify-between text-[7px] text-tungsten font-mono mt-1 uppercase tracking-tighter">
          <span>GATES_PROTOCOL_VERIFIED</span>
          <span className="text-active font-black">Sovereign_Finality</span>
        </div>
      </div>

      <div className="p-3 border-r border-steel/50 flex flex-col gap-1 relative overflow-hidden">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[8px] text-tungsten font-black uppercase tracking-widest">Orchestration_Entropy</span>
          <span className="text-[10px] text-warning font-mono font-bold tracking-tighter">{entropy.toFixed(3)} Δ</span>
        </div>
        <div className="flex gap-0.5 h-1">
          {Array.from({length: 40}).map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 transition-all duration-300 ${i < (entropy * 8) ? 'bg-warning shadow-[0_0_5px_rgba(255,170,0,0.5)]' : 'bg-steel/30'}`} 
            />
          ))}
        </div>
        <div className="flex justify-between text-[7px] text-tungsten font-mono mt-1 uppercase tracking-tighter">
          <span>Synchronicity_Stability</span>
          <span className={`font-black ${entropy > 7 ? 'text-error animate-pulse' : 'text-active'}`}>
            {entropy > 7 ? 'HIGH_ENTROPY_DETECTED' : 'SYSTEM_STABLE'}
          </span>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-1 relative overflow-hidden">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[8px] text-tungsten font-black uppercase tracking-widest">Mesh_Network_Health</span>
          <span className="text-[10px] text-chrome font-mono font-bold tracking-tighter">{activeNodes}/52 ONLINE</span>
        </div>
        <div className="grid grid-cols-[repeat(13,1fr)] gap-[1px] h-1">
          {Array.from({length: 52}).map((_, i) => (
            <div 
              key={i} 
              className={`h-full transition-colors duration-500 ${i < activeNodes ? 'bg-active' : 'bg-error/20 animate-pulse'}`} 
            />
          ))}
        </div>
        <div className="flex justify-between text-[7px] text-tungsten font-mono mt-1 uppercase tracking-tighter">
          <span>Perfect_Twin_Matrix</span>
          <span className="text-chrome/50 font-bold">V5.0.2_STABLE_REPLICATION</span>
        </div>
      </div>
    </div>
  );
};

export default SovereignHUD;
