
import React, { useRef, useState, useEffect } from 'react';
import { SessionAsset } from '../types';

interface AssetPreviewModalProps {
  asset: SessionAsset | null;
  onClose: () => void;
  onRefine: (asset: SessionAsset) => void;
}

const AudioVisualizer: React.FC<{ url: string }> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio || !url) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(audio);
      const analyzer = audioCtx.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);
      analyzer.connect(audioCtx.destination);

      const dataArray = new Uint8Array(analyzer.frequencyBinCount);

      const draw = () => {
        animationRef.current = requestAnimationFrame(draw);
        analyzer.getByteFrequencyData(dataArray);
        ctx.fillStyle = '#080808';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / dataArray.length) * 2.5;
        let x = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const barHeight = dataArray[i] / 2;
          ctx.fillStyle = `#aa00ff`;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      };
      draw();
      return () => {
        cancelAnimationFrame(animationRef.current);
        audioCtx.close().catch(() => {});
      };
    } catch (e) {
      console.error("Audio Context Init Failed:", e);
    }
  }, [url]);

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <canvas ref={canvasRef} width={600} height={200} className="w-full border-b border-thinking/20" />
      {url && <audio ref={audioRef} src={url} controls autoPlay className="w-full" />}
    </div>
  );
};

const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({ asset, onClose, onRefine }) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  if (!asset) return null;

  const downloadFile = (content: Blob | string, filename: string) => {
    const url = typeof content === 'string' ? content : URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (typeof content !== 'string') setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleExport = async (format: string) => {
    const filename = `${asset.label.replace(/\s/g, '_')}_${asset.nodeId}`;
    const rawContent = asset.content || '';

    if (asset.type === 'IMAGE') {
      const response = await fetch(asset.url);
      const blob = await response.blob();
      downloadFile(blob, `${filename}.${format.toLowerCase()}`);
    } else {
      switch (format) {
        case 'MD': downloadFile(new Blob([rawContent], { type: 'text/markdown' }), `${filename}.md`); break;
        case 'TXT': downloadFile(new Blob([rawContent], { type: 'text/plain' }), `${filename}.txt`); break;
        case 'PDF': window.print(); break;
      }
    }
    setIsExportOpen(false);
  };

  const isDoc = asset.type === 'DOC' || asset.type === 'REPORT';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in zoom-in-95 duration-500 font-mono">
      <div className="absolute inset-0 bg-void/98 backdrop-blur-3xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-[95vw] h-[92vh] bg-obsidian border border-steel shadow-[0_0_300px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-8 border-b border-steel bg-steel/5 z-10 relative">
          <div className="flex items-center gap-8">
            <div className={`w-6 h-6 shadow-[0_0_25px_currentColor] ${asset.type === 'IMAGE' ? 'text-neon bg-neon' : asset.type === 'AUDIO' ? 'text-thinking bg-thinking' : asset.type === 'VIDEO' ? 'text-warning bg-warning' : 'text-active bg-active'}`} />
            <div className="flex flex-col gap-1">
              <span className="text-lg font-black text-chrome uppercase tracking-[0.6em]">{asset.label}</span>
              <span className="text-[9px] text-tungsten font-black uppercase tracking-[0.4em] opacity-60">Source: {asset.nodeId} // Format: {asset.type}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => onRefine(asset)} className="px-6 py-3 border border-neon/30 text-neon hover:bg-neon hover:text-void transition-all text-[9px] font-black uppercase tracking-widest">Optimize</button>
            <button onClick={onClose} className="text-tungsten hover:text-chrome transition-all p-3 border border-steel">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-void relative flex flex-col items-center justify-center p-8 lg:p-16 overflow-y-auto">
          {asset.type === 'IMAGE' && asset.url && (
            <img src={asset.url} alt={asset.label} className="max-w-full max-h-full border border-steel shadow-2xl object-contain animate-in fade-in duration-1000" />
          )}

          {asset.type === 'VIDEO' && asset.url && (
            <div className="w-full max-w-5xl aspect-video relative group">
               <video ref={videoRef} src={asset.url} controls className="w-full h-full border border-steel shadow-2xl" />
               <div className="absolute top-4 left-4 p-2 bg-void/80 border border-warning/40 text-warning text-[8px] font-black uppercase tracking-widest">Veo_3.1_Production</div>
            </div>
          )}

          {asset.type === 'AUDIO' && asset.url && (
            <div className="w-full max-w-2xl bg-obsidian p-12 border border-steel flex flex-col items-center gap-10">
               <AudioVisualizer url={asset.url} />
               <div className="text-[10px] text-thinking font-black uppercase tracking-[0.4em]">Synthetic_Voice_Relay</div>
            </div>
          )}

          {isDoc && (
            <div ref={printRef} className="w-full max-w-5xl min-h-full bg-[#fdfdfd] text-[#1a1a1a] p-16 lg:p-24 shadow-2xl font-sans relative border border-steel/10">
              <div className="border-b-4 border-[#1a1a1a] pb-6 mb-12 flex justify-between items-end">
                <div>
                   <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#666] mb-2">Intel_Report_SDR_v5.5</div>
                   <div className="text-4xl font-black uppercase tracking-tight">{asset.label}</div>
                </div>
                <div className="text-right text-[10px] font-bold uppercase tracking-[0.3em] text-[#666]">
                   Node: {asset.nodeId}<br/>Timestamp: {asset.timestamp}
                </div>
              </div>
              <div className="prose prose-lg max-w-none whitespace-pre-wrap text-[#222] leading-[1.8] text-[17px]">
                {asset.content}
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-steel bg-obsidian flex justify-between items-center z-20">
           <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-active shadow-[0_0_10px_#00ff88]" />
              <span className="text-[11px] text-chrome font-black tracking-widest uppercase">Verified_Objective_Synthesis</span>
           </div>
           
           <div className="relative">
              <button onClick={() => setIsExportOpen(!isExportOpen)} className="px-12 py-4 bg-neon text-void text-[11px] font-black uppercase tracking-[0.5em] hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] transition-all">Export_Gateway</button>
              {isExportOpen && (
                <div className="absolute bottom-full right-0 mb-4 w-64 bg-obsidian border border-steel shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                  <div className="p-2 flex flex-col gap-1">
                    {asset.type === 'IMAGE' ? (
                      <>
                        <button onClick={() => handleExport('PNG')} className="w-full text-left p-4 hover:bg-neon/10 text-chrome hover:text-neon text-[10px] font-black uppercase tracking-widest">Lossless (PNG)</button>
                        <button onClick={() => handleExport('JPEG')} className="w-full text-left p-4 hover:bg-neon/10 text-chrome hover:text-neon text-[10px] font-black uppercase tracking-widest">Compact (JPG)</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleExport('PDF')} className="w-full text-left p-4 hover:bg-neon/10 text-chrome hover:text-neon text-[10px] font-black uppercase tracking-widest">Document (PDF)</button>
                        <button onClick={() => handleExport('TXT')} className="w-full text-left p-4 hover:bg-neon/10 text-chrome hover:text-neon text-[10px] font-black uppercase tracking-widest">Text (TXT)</button>
                      </>
                    )}
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AssetPreviewModal;
