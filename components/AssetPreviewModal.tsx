
import React from 'react';
import { SessionAsset } from '../types';

interface AssetPreviewModalProps {
  asset: SessionAsset | null;
  onClose: () => void;
}

const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({ asset, onClose }) => {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in zoom-in-95 duration-200">
      <div className="absolute inset-0 bg-void/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-6xl bg-obsidian border border-steel shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden max-h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-steel bg-steel/10">
          <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-none ${
              asset.type === 'VIDEO' ? 'bg-error' : 
              asset.type === 'IMAGE' ? 'bg-neon' : 'bg-active'
            }`} />
            <div className="flex flex-col">
              <span className="text-[10px] text-chrome font-black uppercase tracking-[0.3em]">{asset.label}</span>
              <span className="text-[8px] text-tungsten font-mono uppercase tracking-widest">{asset.nodeId} // {asset.timestamp}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-tungsten hover:text-chrome transition-colors p-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-void flex items-center justify-center p-4 md:p-12 relative min-h-[400px]">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          {asset.type === 'IMAGE' && (
            <img 
              src={asset.url} 
              alt={asset.label} 
              className="max-w-full max-h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-steel/30" 
            />
          )}

          {asset.type === 'VIDEO' && (
            <video 
              src={asset.url} 
              controls 
              autoPlay
              className="max-w-full max-h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-steel/30" 
            />
          )}

          {asset.type === 'AUDIO' && (
            <div className="flex flex-col items-center gap-8 w-full max-w-md">
              <div className="w-full h-32 bg-active/5 border border-active/20 relative flex items-center justify-center overflow-hidden">
                <div className="flex gap-1 items-center h-full">
                  {Array.from({length: 32}).map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-active animate-pulse" 
                      style={{ height: `${Math.random() * 80 + 20}%`, animationDelay: `${i * 0.1}s` }} 
                    />
                  ))}
                </div>
              </div>
              <audio src={asset.url} controls className="w-full invert opacity-80" />
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-steel bg-steel/5 flex justify-between text-[8px] text-tungsten font-mono uppercase tracking-widest">
           <span>Asset_Status: Nominal</span>
           <span>G5_Sovereign_Validation: OK</span>
           <span>Metadata: {asset.type}_STREAM_V5</span>
        </div>
      </div>
    </div>
  );
};

export default AssetPreviewModal;
