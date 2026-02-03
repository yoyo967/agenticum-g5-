
import React from 'react';
import { SessionAsset } from '../types';

interface AssetRepositoryProps {
  assets: SessionAsset[];
  onPreview: (asset: SessionAsset) => void;
  onOpenDossier: () => void;
  onRefine: (asset: SessionAsset) => void;
}

const AssetRepository: React.FC<AssetRepositoryProps> = ({ assets, onPreview, onOpenDossier, onRefine }) => {
  return (
    <div className="w-80 bg-void border-l border-steel flex flex-col h-full overflow-hidden select-none font-mono relative z-20">
      <div className="p-8 border-b border-steel bg-obsidian/95 relative">
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-neon/40 shadow-[0_0_10px_#00f0ff]" />
        <h3 className="text-[12px] font-black text-chrome uppercase tracking-[0.5em]">Artifact_Vault</h3>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-[2px] bg-steel/20 custom-scrollbar">
        {assets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-10">
            <p className="text-[10px] font-black text-tungsten uppercase tracking-[0.5em]">Awaiting_Output</p>
          </div>
        ) : (
          assets.map((asset) => (
            <div 
              key={asset.id}
              onClick={() => onPreview(asset)}
              className="group cursor-pointer bg-obsidian/40 hover:bg-steel/10 border-b border-steel/10 p-6 relative transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[8px] font-black tracking-[0.3em] uppercase px-2 py-1 border ${asset.type === 'IMAGE' ? 'border-neon text-neon' : asset.type === 'AUDIO' ? 'border-thinking text-thinking' : 'border-active text-active'}`}>{asset.nodeId}</span>
              </div>
              <div className="aspect-video bg-void border border-steel/20 relative flex items-center justify-center overflow-hidden">
                {asset.type === 'IMAGE' ? (
                  <img src={asset.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                ) : (
                  <span className="text-[8px] text-tungsten font-black uppercase tracking-widest">{asset.type}_ARTIFACT</span>
                )}
              </div>
              <div className="mt-4">
                <span className="text-[11px] text-chrome font-black tracking-tight uppercase truncate block">{asset.label}</span>
                <span className="text-[8px] text-tungsten opacity-40 uppercase font-black block mt-1">{asset.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-8 border-t border-steel bg-obsidian/95">
        <button disabled={assets.length === 0} onClick={onOpenDossier} className="w-full py-5 bg-neon/5 border border-neon/30 text-[11px] font-black text-neon hover:bg-neon hover:text-void transition-all uppercase tracking-[0.6em] disabled:opacity-20">Forge_Campaign_Package</button>
      </div>
    </div>
  );
};

export default AssetRepository;
