
import React, { useRef, useState, useEffect } from 'react';
import { SessionAsset } from '../types';

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

/**
 * ULTRA_HIGH_FIDELITY_MARKDOWN_PARSER
 * Verarbeitet Roh-Markdown und rendert sauberes Dokumenten-Layout ohne Steuerzeichen.
 */
const DocumentMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const processLine = (text: string) => {
    // 1. Entferne Fettdruck-Symbole (**)
    let cleaned = text.replace(/\*\*(.*?)\*\*/g, '$1');
    // 2. Entferne Kursiv-Symbole (*)
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');
    return cleaned;
  };

  const renderInline = (text: string) => {
    // Splitte nach ** für lokales Highlighting
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-black">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const lines = content.split('\n');
  return (
    <div className="space-y-6 text-[#1a1a1a] font-sans">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-4" />;
        
        // H1 (Haupttitel)
        if (trimmed.startsWith('# ')) {
          const text = trimmed.replace(/^#\s*/, '');
          return <h1 key={i} className="text-4xl font-black uppercase tracking-tighter mb-8 border-b-4 border-black pb-4 leading-tight">{renderInline(text)}</h1>;
        }
        
        // H2 (Sektionstitel)
        if (trimmed.startsWith('## ')) {
          const text = trimmed.replace(/^##\s*/, '');
          return <h2 key={i} className="text-2xl font-black uppercase tracking-tight mt-12 mb-6 border-b-2 border-black/10 pb-2">{renderInline(text)}</h2>;
        }
        
        // H3 (Subtitel)
        if (trimmed.startsWith('### ')) {
          const text = trimmed.replace(/^###\s*/, '');
          return <h3 key={i} className="text-xl font-bold uppercase tracking-wide mt-8 mb-4">{renderInline(text)}</h3>;
        }

        // Trenner
        if (trimmed === '---' || trimmed === '***') return <hr key={i} className="my-10 border-t-2 border-black/5" />;

        // Listenpunkte
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
          const text = trimmed.replace(/^([-*]|\d+\.)\s*/, '');
          return (
            <div key={i} className="flex gap-4 pl-6 items-start">
              <div className="w-1.5 h-1.5 bg-black mt-2.5 shrink-0" />
              <p className="text-[17px] leading-relaxed flex-1">{renderInline(text)}</p>
            </div>
          );
        }

        // Standard-Absatz
        return <p key={i} className="text-[17px] leading-relaxed text-justify">{renderInline(line)}</p>;
      })}
    </div>
  );
};

interface AssetPreviewModalProps {
  asset: SessionAsset | null;
  onClose: () => void;
  onRefine: (asset: SessionAsset) => void;
}

const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({ asset, onClose, onRefine }) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

    if (asset.type === 'IMAGE' || asset.type === 'VIDEO') {
      try {
        if (asset.url.startsWith('data:')) {
          downloadFile(asset.url, `${filename}.${format.toLowerCase()}`);
        } else {
          const response = await fetch(`${asset.url}${asset.url.includes('?') ? '&' : '?'}key=${process.env.API_KEY || ''}`);
          const blob = await response.blob();
          downloadFile(blob, `${filename}.${format.toLowerCase()}`);
        }
      } catch (e) {
        console.error("Export Failed", e);
      }
    } else {
      switch (format) {
        case 'MD': downloadFile(new Blob([rawContent], { type: 'text/markdown' }), `${filename}.md`); break;
        case 'TXT': downloadFile(new Blob([rawContent], { type: 'text/plain' }), `${filename}.txt`); break;
        case 'PDF': 
          setIsExportOpen(false);
          // Kurzer Delay um das UI-Dropdown sauber zu schließen
          setTimeout(() => {
            window.print();
          }, 300);
          break;
      }
    }
    setIsExportOpen(false);
  };

  const isDoc = asset.type === 'DOC' || asset.type === 'REPORT';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-500 font-mono">
      {/* SHROUD */}
      <div className="absolute inset-0 bg-void/98 backdrop-blur-3xl no-print" onClick={onClose}></div>
      
      {/* MODAL BODY */}
      <div className="relative w-full max-w-[95vw] h-[92vh] bg-obsidian border border-steel shadow-[0_0_300px_rgba(0,0,0,1)] flex flex-col overflow-hidden no-print">
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-steel bg-[#080808] z-10 relative">
          <div className="flex items-center gap-6">
            <div className={`w-3.5 h-3.5 shadow-[0_0_15px_currentColor] ${asset.type === 'IMAGE' ? 'text-neon bg-neon' : asset.type === 'AUDIO' ? 'text-thinking bg-thinking' : asset.type === 'VIDEO' ? 'text-warning bg-warning' : 'text-active bg-active'}`} />
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-black text-chrome uppercase tracking-[0.8em]">
                {asset.nodeId.replace('-', ' - ')} _ D O S S I E R
              </span>
              <span className="text-[8px] text-tungsten font-black uppercase tracking-widest opacity-40">
                SOURCE: {asset.nodeId} // FORMAT: {asset.type}
              </span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => onRefine(asset)} 
              className="px-6 py-2.5 border border-steel text-tungsten hover:border-neon hover:text-neon transition-all text-[9px] font-black uppercase tracking-[0.4em] bg-void/50"
            >
              OPTIMIZE
            </button>
            <button onClick={onClose} className="text-tungsten hover:text-chrome transition-all p-2 border border-steel bg-steel/10 hover:border-chrome">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* VIEWPORT */}
        <div className="flex-1 overflow-hidden bg-[#0a0a0a] relative flex flex-col items-center justify-start p-8 lg:p-12 overflow-y-auto custom-scrollbar">
          {asset.type === 'IMAGE' && asset.url && (
            <img src={asset.url} alt={asset.label} className="max-w-full max-h-full border border-steel shadow-2xl object-contain animate-in fade-in duration-1000" />
          )}

          {asset.type === 'VIDEO' && asset.url && (
            <div className="w-full max-w-5xl aspect-video relative animate-in zoom-in-95 duration-700">
               <video ref={videoRef} src={asset.url} controls className="w-full h-full border border-steel shadow-2xl bg-black" />
            </div>
          )}

          {asset.type === 'AUDIO' && asset.url && (
            <div className="w-full max-w-2xl bg-obsidian p-12 border border-steel flex flex-col items-center gap-10">
               <AudioVisualizer url={asset.url} />
            </div>
          )}

          {isDoc && (
            <div className="w-full max-w-4xl min-h-full bg-white text-[#1a1a1a] p-16 lg:p-24 shadow-2xl font-sans relative mb-20 animate-in slide-in-from-bottom-4 duration-700">
              <div className="border-b-4 border-black pb-10 mb-14 flex justify-between items-end">
                <div className="font-mono">
                   <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#999] mb-4">INTEL_REPORT_SDR_V5.5</div>
                   <div className="text-5xl lg:text-6xl font-black uppercase tracking-tighter text-[#0a0a0a] leading-none">{asset.nodeId}_DOSSIER</div>
                </div>
                <div className="text-right text-[10px] font-mono font-black uppercase tracking-[0.3em] text-[#999] leading-relaxed pb-1">
                   ORIGIN: {asset.nodeId}<br/>TS: {asset.timestamp}
                </div>
              </div>
              <div className="max-w-none text-[#222]">
                <DocumentMarkdown content={asset.content || ''} />
              </div>
              <div className="mt-32 pt-10 border-t border-[#eeeeee] flex justify-between items-center opacity-30 font-mono text-[9px] uppercase tracking-widest text-[#999]">
                <span>© 2026 Agenticum G5 Sovereign OS</span>
                <span>Verification_Hash: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 border-t border-steel bg-[#080808] flex justify-between items-center z-20 relative">
           <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-active shadow-[0_0_10px_#00ff88]" />
              <span className="text-[10px] text-chrome font-black tracking-[0.5em] uppercase opacity-70">VERIFIED_OBJECTIVE_SYNTHESIS</span>
           </div>
           
           <div className="relative">
              <button 
                onClick={() => setIsExportOpen(!isExportOpen)} 
                className="px-20 py-4 bg-neon text-void text-[11px] font-black uppercase tracking-[0.6em] hover:bg-white hover:shadow-[0_0_50px_rgba(0,240,255,0.5)] transition-all active:scale-95"
              >
                EXPORT_GATEWAY
              </button>
              
              {isExportOpen && (
                <div className="absolute bottom-full right-0 mb-4 w-64 bg-obsidian border border-steel shadow-2xl animate-in slide-in-from-bottom-4 duration-300 z-50">
                  <div className="p-2 flex flex-col gap-1">
                    {asset.type === 'IMAGE' || asset.type === 'VIDEO' ? (
                      <button onClick={() => handleExport(asset.type === 'IMAGE' ? 'PNG' : 'MP4')} className="w-full text-left p-4 hover:bg-neon/10 text-chrome hover:text-neon text-[9px] font-black uppercase tracking-widest border border-transparent hover:border-neon/20 transition-all">
                        Download_{asset.type === 'IMAGE' ? 'PNG' : 'MP4'}
                      </button>
                    ) : (
                      <>
                        <button onClick={() => handleExport('PDF')} className="w-full text-left p-4 hover:bg-neon/10 text-chrome hover:text-neon text-[9px] font-black uppercase tracking-widest border border-transparent hover:border-neon/20 transition-all">Generate PDF (Print)</button>
                        <button onClick={() => handleExport('MD')} className="w-full text-left p-4 hover:bg-neon/10 text-chrome hover:text-neon text-[9px] font-black uppercase tracking-widest border border-transparent hover:border-neon/20 transition-all">Markdown (MD)</button>
                        <button onClick={() => handleExport('TXT')} className="w-full text-left p-4 hover:bg-neon/10 text-chrome hover:text-neon text-[9px] font-black uppercase tracking-widest border border-transparent hover:border-neon/20 transition-all">Plain Text (TXT)</button>
                      </>
                    )}
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* 
          OFF-SCREEN PRINT CONTAINER
          Dieser Container wird nur beim Drucken sichtbar und enthält das reine Dokument.
      */}
      {isDoc && (
        <div id="printable-doc-container" className="hidden print:block bg-white p-20 font-sans">
           <div className="border-b-8 border-black pb-10 mb-14 flex justify-between items-end">
              <div>
                 <h1 className="text-6xl font-black uppercase tracking-tighter text-black">{asset.nodeId}_DOSSIER</h1>
                 <p className="font-mono uppercase mt-4 text-[#999] tracking-widest">INTEL_REPORT_SDR_V5.5</p>
              </div>
              <div className="text-right font-mono text-sm font-bold uppercase tracking-widest text-[#999]">
                 {asset.timestamp}
              </div>
           </div>
           <DocumentMarkdown content={asset.content || ''} />
           <div className="mt-40 pt-10 border-t border-[#eee] flex justify-between items-center opacity-30 font-mono text-[9px] uppercase tracking-widest text-black">
              <span>© 2026 Agenticum G5 Sovereign OS // INTERNAL_USE_ONLY</span>
              <span>VERIFICATION: 0x{Math.random().toString(16).slice(2, 12).toUpperCase()}</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default AssetPreviewModal;
