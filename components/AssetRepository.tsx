
import React from 'react';
import { SessionAsset } from '../types';

interface AssetRepositoryProps {
  assets: SessionAsset[];
  onPreview: (asset: SessionAsset) => void;
  onOpenDossier: () => void;
  onRefine: (asset: SessionAsset) => void;
}

const AssetRepository: React.FC<AssetRepositoryProps> = ({ assets, onPreview, onOpenDossier }) => {
  return (
    <div className="w-80 bg-void border-l border-steel flex flex-col h-full overflow-hidden select-none font-mono relative z-20">
      <div className="p-8 border-b border-steel bg-obsidian/95 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-neon group-hover:h-full group-hover:opacity-5 transition-all duration-700" />
        <div className="flex justify-between items-center relative z-10">
           <h3 className="text-[11px] font-black text-chrome uppercase tracking-[0.6em]">Artifact_Vault</h3>
           <div className="w-1.5 h-1.5 bg-active rounded-full animate-pulse shadow-[0_0_10px_#00ff88]" />
        </div>
        <div className="mt-2 text-[7px] text-tungsten font-black uppercase tracking-widest opacity-40">
           Integrity_Lock: G5_SECURE
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide bg-steel/5 custom-scrollbar">
        {assets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-10">
            <div className="w-12 h-12 border border-tungsten mb-4 rotate-45" />
            <p className="text-[9px] font-black text-tungsten uppercase tracking-[0.5em]">Awaiting_Output</p>
          </div>
        ) : (
          assets.map((asset) => (
            <div 
              key={asset.id}
              onClick={() => onPreview(asset)}
              className="group cursor-pointer bg-obsidian/40 hover:bg-steel/10 border-b border-steel/10 p-6 relative transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[8px] font-black tracking-[0.3em] uppercase px-2 py-1 border border-steel group-hover:border-neon group-hover:text-neon transition-colors">{asset.nodeId}</span>
                {asset.isRefined && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-3 bg-thinking shadow-[0_0_8px_#aa00ff]" />
                    <span className="text-[7px] text-thinking font-black uppercase tracking-widest">Mirror_Verified</span>
                  </div>
                )}
              </div>

              <div className="aspect-video bg-void border border-steel/20 relative flex items-center justify-center overflow-hidden">
                {asset.type === 'IMAGE' ? (
                  <img src={asset.url} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border border-steel/40 rotate-45 group-hover:border-neon transition-colors" />
                    <span className="text-[7px] text-tungsten font-black uppercase tracking-widest">{asset.type}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-neon/0 group-hover:bg-neon/5 transition-all duration-700" />
              </div>

              <div className="mt-4 space-y-2">
                <span className="text-[10px] text-chrome font-black tracking-tight uppercase truncate block group-hover:text-neon transition-colors">{asset.label}</span>
                <div className="flex justify-between items-center text-[7px] text-tungsten font-black uppercase tracking-widest opacity-40">
                   <span>{asset.timestamp}</span>
                   <span className="text-active">Verified</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-8 border-t border-steel bg-obsidian/95 space-y-4">
        <div className="flex justify-between text-[8px] font-black text-tungsten uppercase tracking-widest opacity-40">
           <span>Sub_Neural_Storage</span>
           <span>{assets.length} / ∞</span>
        </div>
        <button 
          disabled={assets.length === 0} 
          onClick={onOpenDossier} 
          className="w-full py-5 bg-neon/5 border border-neon/30 text-[10px] font-black text-neon hover:bg-neon hover:text-void transition-all uppercase tracking-[0.6em] disabled:opacity-20 active:scale-95 shadow-[0_0_30px_rgba(0,240,255,0.1)]"
        >
          Forge_Full_Archive
        </button>
      </div>
    </div>
  );
};

export default AssetRepository;
