import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(prev => prev < 100 ? prev + 1 : 100);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full bg-obsidian flex flex-col items-center justify-center overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-steel/60 via-obsidian to-obsidian"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      </div>

      <div className="absolute top-10 left-10 flex flex-col gap-2 font-mono text-[10px] text-tungsten opacity-40 uppercase tracking-widest">
        <span>G5_CORE_BOOT_SEQUENCE</span>
        <span>AUTH_V5.0.2</span>
        <div className="w-48 h-1 bg-steel/30 mt-2">
           <div className="h-full bg-neon transition-all duration-300" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <div className="flex items-center justify-center gap-4 mb-10 animate-pulse">
            <div className="w-10 h-10 bg-neon flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.5)]">
              <span className="text-void font-black text-xl">G5</span>
            </div>
            <div className="h-[1px] w-20 bg-steel/50" />
            <span className="text-tungsten font-mono text-[10px] tracking-[0.8em] uppercase">Tactical_Intelligence_Fabric</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-chrome tracking-tighter mb-6 uppercase">
          License a<br />
          <span className="text-neon drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">Civilization.</span>
        </h1>
        
        <p className="text-tungsten font-mono text-[11px] mb-16 max-w-2xl mx-auto leading-relaxed uppercase tracking-[0.2em] opacity-60">
          Agenticum G5 is a decentralized cognitive ecosystem. 52 specialized agents. One orchestrator. Built for the Action Era.
        </p>

        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={onEnter}
            className="group relative px-20 py-5 bg-void border border-neon text-neon font-black uppercase tracking-[0.4em] overflow-hidden transition-all hover:bg-neon hover:text-void hover:shadow-[0_0_50px_rgba(0,240,255,0.5)] text-sm"
          >
            <span className="relative z-10">Authorize_Access</span>
            <div className="absolute inset-0 bg-neon transform -translate-x-full transition-transform group-hover:translate-x-0 duration-500"></div>
          </button>
          <span className="text-[9px] text-steel font-mono uppercase tracking-[0.4em]">Requires Clearance: Root_Operator</span>
        </div>
      </div>

      {/* Side Numbers */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-4 font-mono text-[8px] text-tungsten opacity-20">
         {Array.from({length: 10}).map((_, i) => (
           <div key={i} className="flex gap-4 items-center">
             <span>0{i}_NODE_STABLE</span>
             <div className="w-12 h-[1px] bg-steel" />
           </div>
         ))}
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-0 w-full p-6 border-t border-steel bg-void/80 flex flex-wrap justify-center gap-x-12 gap-y-3 text-[10px] text-tungsten font-mono uppercase tracking-[0.3em] backdrop-blur-md">
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-active rounded-none" /> 52_NODES_ONLINE</span>
        <span className="hidden md:inline opacity-30">|</span>
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-neon rounded-none" /> GEMINI_3_PRO_FABRIC</span>
        <span className="hidden md:inline opacity-30">|</span>
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-thinking rounded-none" /> ACTIONS_DEPLOYED: 0x88AF</span>
      </div>
    </div>
  );
};

export default LandingPage;
