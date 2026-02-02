
import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [percent, setPercent] = useState(0);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authStatus, setAuthStatus] = useState('AWAITING_CREDENTIALS');

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(prev => prev < 100 ? prev + 1 : 100);
    }, 15);
    return () => clearInterval(interval);
  }, []);

  const handleAuthorize = async () => {
    setIsAuthorizing(true);
    setAuthStatus('VALIDATING_IDENTITY...');

    try {
      // Check if API key is already selected for high-end models (Veo/Gemini 3 Pro)
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      
      if (!hasKey) {
        setAuthStatus('PROMPTING_API_KEY_SELECTION...');
        await (window as any).aistudio.openSelectKey();
        // Proceeding assuming selection was successful to avoid race conditions
      }

      setAuthStatus('ACCESS_GRANTED. INITIALIZING_FABRIC...');
      setTimeout(() => {
        onEnter();
      }, 800);
    } catch (error) {
      console.error("Auth_Fault:", error);
      // Fallback: Proceed anyway but log the error, app might use process.env.API_KEY directly
      onEnter();
    }
  };

  return (
    <div className="relative h-screen w-full bg-obsidian flex flex-col items-center justify-center overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-steel/60 via-obsidian to-obsidian"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,240,255,0.06),rgba(0,0,0,0.02),rgba(0,240,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      </div>

      <div className="absolute top-10 left-10 flex flex-col gap-2 font-mono text-[10px] text-tungsten opacity-40 uppercase tracking-widest">
        <span>G5_CORE_BOOT_SEQUENCE</span>
        <span>AUTH_V5.0.2_EN</span>
        <div className="w-48 h-1 bg-steel/30 mt-2">
           <div className="h-full bg-neon transition-all duration-300 shadow-[0_0_10px_#00f0ff]" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <div className="flex items-center justify-center gap-4 mb-10">
            <div className={`w-10 h-10 bg-neon flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.5)] ${isAuthorizing ? 'animate-ping' : 'animate-pulse'}`}>
              <span className="text-void font-black text-xl">G5</span>
            </div>
            <div className="h-[1px] w-20 bg-steel/50" />
            <span className="text-tungsten font-mono text-[10px] tracking-[0.8em] uppercase">Tactical_Intelligence_Fabric</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-chrome tracking-tighter mb-6 uppercase">
          License a<br />
          <span className="text-neon drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">Civilization.</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left border-y border-steel/30 py-10">
          <div className="space-y-3">
             <h4 className="text-neon font-black text-[11px] uppercase tracking-widest">01. Agentic AI</h4>
             <p className="text-tungsten font-mono text-[10px] uppercase leading-relaxed">Proactive action instead of passive chat. Eliminating generative latency through sovereign autonomy.</p>
          </div>
          <div className="space-y-3 border-x border-steel/30 px-8">
             <h4 className="text-active font-black text-[11px] uppercase tracking-widest">02. Perfect Twin</h4>
             <p className="text-tungsten font-mono text-[10px] uppercase leading-relaxed">A 52-node mesh architecture replicating a complete industrial marketing organization.</p>
          </div>
          <div className="space-y-3">
             <h4 className="text-thinking font-black text-[11px] uppercase tracking-widest">03. Cross-Modal</h4>
             <p className="text-tungsten font-mono text-[10px] uppercase leading-relaxed">Sight, sound, and understanding. Unified reasoning across text, image, video, and audio.</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={handleAuthorize}
            disabled={isAuthorizing}
            className="group relative px-20 py-5 bg-void border border-neon text-neon font-black uppercase tracking-[0.4em] overflow-hidden transition-all hover:bg-neon hover:text-void hover:shadow-[0_0_50px_rgba(0,240,255,0.5)] text-sm disabled:opacity-50"
          >
            <span className="relative z-10">{isAuthorizing ? 'Authorizing...' : 'Authorize_Access'}</span>
            <div className="absolute inset-0 bg-neon transform -translate-x-full transition-transform group-hover:translate-x-0 duration-500"></div>
          </button>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-[9px] text-steel font-mono uppercase tracking-[0.4em]">Requires Clearance: Root_Operator</span>
            {isAuthorizing && (
              <span className="text-[8px] text-neon font-mono uppercase tracking-[0.2em] animate-pulse">
                Status: {authStatus}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Side HUD Elements */}
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
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-neon rounded-none" /> THE_PERFECT_TWIN_V5</span>
        <span className="hidden md:inline opacity-30">|</span>
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-thinking rounded-none" /> CROSS_MODAL_ACTIVE</span>
      </div>
    </div>
  );
};

export default LandingPage;
