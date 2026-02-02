
import React from 'react';
import { SessionAsset } from '../types';

interface AssetRepositoryProps {
  assets: SessionAsset[];
  onPreview: (asset: SessionAsset) => void;
}

const AssetRepository: React.FC<AssetRepositoryProps> = ({ assets, onPreview }) => {
  return (
    <div className="w-64 bg-void border-l border-steel flex flex-col h-full overflow-hidden select-none">
      <div className="p-4 border-b border-steel bg-obsidian/50 flex flex-col gap-1 relative">
        <div className="absolute top-0 right-0 w-1 h-full bg-neon/30"></div>
        <h3 className="text-[10px] font-black text-chrome uppercase tracking-[0.3em]">Strategic_Assets</h3>
        <span className="text-[7px] text-tungsten uppercase tracking-widest font-bold">Session_Repository_V5</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-2">
        {assets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 py-12 px-4 text-center">
            <div className="w-8 h-8 border border-dashed border-tungsten mb-4 flex items-center justify-center">
              <span className="text-[10px] font-mono">+</span>
            </div>
            <p className="text-[8px] font-mono uppercase leading-relaxed tracking-widest">
              No_Assets_In_Buffer<br />Deploy_Nodes_To_Generate
            </p>
          </div>
        ) : (
          assets.map((asset) => (
            <div 
              key={asset.id}
              onClick={() => onPreview(asset)}
              className="group cursor-pointer bg-steel/5 border border-steel/20 hover:border-neon/40 transition-all p-2 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-1.5">
                <span className="text-[7px] font-mono text-tungsten tracking-tighter uppercase">{asset.nodeId}</span>
                <span className={`text-[6px] font-black px-1 py-0.5 border ${
                  asset.type === 'VIDEO' ? 'text-error border-error/30' : 
                  asset.type === 'IMAGE' ? 'text-neon border-neon/30' : 
                  asset.type === 'AUDIO' ? 'text-active border-active/30' : 
                  'text-chrome border-steel'
                }`}>
                  {asset.type}
                </span>
              </div>
              
              <div className="aspect-video bg-void/50 border border-steel/10 relative overflow-hidden flex items-center justify-center">
                {asset.type === 'IMAGE' && (
                  <img src={asset.url} alt={asset.label} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                )}
                {asset.type === 'VIDEO' && (
                  <div className="text-[10px] text-error/50">▶ TEMPORAL</div>
                )}
                {asset.type === 'AUDIO' && (
                  <div className="text-[10px] text-active/50">≋ ACOUSTIC</div>
                )}
              </div>

              <div className="mt-2 flex flex-col gap-0.5">
                <span className="text-[9px] text-chrome font-bold tracking-tight truncate uppercase">{asset.label}</span>
                <span className="text-[7px] text-tungsten font-mono">{asset.timestamp}</span>
              </div>

              <div className="absolute inset-0 bg-neon/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-steel bg-obsidian/50 text-[8px] text-tungsten font-mono space-y-1">
        <div className="flex justify-between">
          <span>UPLINK_STABLE</span>
          <span className="text-neon">100%</span>
        </div>
        <div className="h-0.5 bg-steel/30">
          <div className="h-full bg-neon w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default AssetRepository;
