
import React from 'react';

interface ProvisioningShieldProps {
  onAuthorize: () => void;
}

const ProvisioningShield: React.FC<ProvisioningShieldProps> = ({ onAuthorize }) => {
  return (
    <div className="fixed inset-0 z-[500] bg-void flex items-center justify-center p-8 md:p-12 font-mono overflow-hidden">
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_#222_0%,transparent_100%)]"></div>
      
      <div className="relative w-full max-w-3xl border border-steel bg-obsidian p-16 md:p-24 space-y-12 text-center shadow-[0_0_200px_rgba(0,0,0,1)] group animate-in zoom-in-95 duration-700">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-neon shadow-[0_0_20px_#00f0ff] opacity-40" />
        
        <div className="flex justify-center mb-10">
          <div className="w-20 h-20 bg-neon flex items-center justify-center shadow-[0_0_50px_rgba(0,240,255,0.4)]">
            <span className="text-void font-black text-4xl">G5</span>
          </div>
        </div>
        
        <div className="space-y-8">
          <h2 className="text-3xl font-black text-chrome tracking-[0.8em] uppercase">System_Provisioning</h2>
          <p className="text-[13px] text-tungsten font-bold uppercase tracking-[0.3em] leading-relaxed max-w-lg mx-auto opacity-80">
            To enable sovereign autonomous execution involving <span className="text-neon">Imagen 3 Pro</span> high-fidelity visual synthesis, an API key from a paid GCP project is required.
          </p>
        </div>

        <div className="pt-12 space-y-10">
          <button 
            onClick={onAuthorize}
            className="px-16 py-6 bg-neon text-void font-black text-[14px] uppercase tracking-[0.5em] hover:bg-white hover:shadow-[0_0_60px_#00f0ff] transition-all active:scale-95"
          >
            Authorize_Sovereign_Uplink
          </button>
          
          <div className="flex flex-col gap-4">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-[11px] text-tungsten hover:text-neon underline transition-colors uppercase tracking-[0.4em] font-black opacity-60">Strategic_Billing_Documentation</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvisioningShield;
