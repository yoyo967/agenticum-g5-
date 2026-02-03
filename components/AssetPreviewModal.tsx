
import React from 'react';
import { SessionAsset } from '../types';

interface AssetPreviewModalProps {
  asset: SessionAsset | null;
  onClose: () => void;
  onRefine: (asset: SessionAsset) => void;
}

const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({ asset, onClose, onRefine }) => {
  if (!asset) return null;

  const handleDownload = () => {
    if (!asset) return;
    const link = document.createElement('a');
    let url = '';

    try {
      if (asset.type === 'DOC' || asset.type === 'REPORT') {
        const blob = new Blob([asset.content || ''], { type: 'text/markdown' });
        url = URL.createObjectURL(blob);
      } else if (asset.url.startsWith('data:')) {
        // Base64 to Blob conversion
        const arr = asset.url.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        url = URL.createObjectURL(blob);
      } else {
        url = asset.url;
      }

      link.href = url;
      const ext = asset.type === 'IMAGE' ? 'png' : asset.type === 'VIDEO' ? 'mp4' : asset.type === 'AUDIO' ? 'wav' : 'md';
      link.download = `${asset.label.replace(/\s/g, '_')}.${ext}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (url.startsWith('blob:')) {
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (e) {
      console.error("Download failed:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 md:p-16 animate-in fade-in zoom-in-95 duration-500 font-mono">
      <div className="absolute inset-0 bg-void/98 backdrop-blur-3xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-[90vw] h-[90vh] bg-obsidian border border-steel shadow-[0_0_300px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-10 border-b border-steel bg-steel/5 z-10 relative">
          <div className="flex items-center gap-10">
            <div className={`w-6 h-6 shadow-[0_0_25px_currentColor] ${asset.type === 'IMAGE' ? 'text-neon bg-neon' : asset.type === 'AUDIO' ? 'text-thinking bg-thinking' : 'text-active bg-active'}`} />
            <div className="flex flex-col gap-2">
              <span className="text-xl font-black text-chrome uppercase tracking-[0.8em]">{asset.label}</span>
              <span className="text-[10px] text-tungsten font-black uppercase tracking-[0.4em] opacity-60">Uplink_Node: {asset.nodeId} // Timestamp: {asset.timestamp}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-tungsten hover:text-chrome transition-all p-5 border border-steel">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-hidden bg-void relative flex flex-col items-center justify-center p-12">
          {asset.type === 'IMAGE' && (
            <img src={asset.url} alt={asset.label} className="max-w-full max-h-full border border-steel shadow-2xl" />
          )}

          {asset.type === 'AUDIO' && (
            <div className="w-full max-w-3xl bg-obsidian p-16 border border-steel flex flex-col items-center gap-12">
               <div className="flex gap-1 h-16 items-end w-full">
                  {Array.from({length: 32}).map((_, i) => (
                    <div key={i} className="flex-1 bg-thinking animate-pulse" style={{ height: `${20+Math.random()*80}%` }} />
                  ))}
               </div>
               <audio src={asset.url} controls autoPlay className="w-full" />
            </div>
          )}

          {(asset.type === 'DOC' || asset.type === 'REPORT') && (
            <div className="w-full max-w-4xl bg-obsidian p-16 border border-steel shadow-2xl overflow-y-auto custom-scrollbar">
              <div className="text-chrome/90 text-[17px] leading-relaxed font-sans whitespace-pre-wrap">
                {asset.content}
              </div>
            </div>
          )}
        </div>

        <div className="p-10 border-t border-steel bg-obsidian flex justify-between items-center z-10">
           <span className="text-[14px] text-neon font-black tracking-tighter uppercase font-mono">{asset.id}_SYNTH_VERIFIED</span>
           <div className="flex gap-6">
              <button onClick={() => onRefine(asset)} className="px-8 py-4 border border-neon text-neon text-[11px] font-black uppercase tracking-[0.4em]">Refine</button>
              <button onClick={handleDownload} className="px-12 py-4 bg-neon text-void text-[11px] font-black uppercase tracking-[0.4em]">Download</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AssetPreviewModal;
