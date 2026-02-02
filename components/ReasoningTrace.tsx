
import React, { useEffect, useRef } from 'react';
import { TraceEntry, GroundingChunk } from '../types';

interface ReasoningTraceProps {
  entries: TraceEntry[];
  isThinking: boolean;
}

const ReasoningTrace: React.FC<ReasoningTraceProps> = ({ entries, isThinking }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, isThinking]);

  const renderGrounding = (grounding: GroundingChunk[]) => {
    return (
      <div className="bg-void/60 border border-active/20 p-4 space-y-4 shadow-2xl mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-active shadow-[0_0_8px_#00ff88]" />
            <span className="text-[10px] text-active font-black uppercase tracking-[0.3em]">Verified_Strategic_Truth</span>
          </div>
          <span className="text-[8px] text-tungsten font-mono">ENCRYPTION: AES-256-GCM</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {grounding.map((chunk, idx) => {
            const isMap = !!chunk.maps;
            const link = chunk.web || chunk.maps;
            if (!link) return null;
            return (
              <a 
                key={idx} 
                href={link.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group/link text-[10px] border px-4 py-3 bg-obsidian/80 transition-all flex items-center gap-4 overflow-hidden shadow-lg ${
                  isMap ? 'border-warning/30 hover:border-warning/60 text-warning/80 hover:text-warning' : 'border-steel/30 hover:border-neon/50 text-chrome/80 hover:text-neon'
                }`}
              >
                <div className={`shrink-0 transition-colors transform group-hover/link:scale-110 ${isMap ? 'text-warning/50' : 'text-neon/50'}`}>
                  {isMap ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                   <span className="text-[8px] opacity-40 uppercase font-black tracking-tighter mb-0.5">{isMap ? 'LOC_STAMP' : 'SRC_STAMP'}_0{idx}</span>
                   <span className="truncate font-bold tracking-tight uppercase">{link.title || 'UPLINK_SOURCE_DATA'}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 lg:px-12 space-y-12 font-mono scrollbar-hide relative">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none select-none text-right">
        <div className="text-[8px] uppercase tracking-[0.8em] font-black text-neon mb-2">Cognitive_Telemetry</div>
        <div className="flex flex-col gap-1 items-end">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="flex gap-1">
               {Array.from({length: 12}).map((_, j) => (
                 <div key={j} className={`w-1 h-1 ${Math.random() > 0.6 ? 'bg-neon' : 'bg-steel/30'}`} />
               ))}
            </div>
          ))}
        </div>
      </div>

      {entries.length === 0 && !isThinking && (
        <div className="h-full flex flex-col items-center justify-center opacity-10 pointer-events-none select-none grayscale">
          <div className="text-9xl font-black tracking-tighter mb-4 opacity-10">G5</div>
          <div className="text-[10px] uppercase tracking-[1em] font-bold mb-8">Ready_For_Deployment</div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-[9px] uppercase tracking-widest text-tungsten">
            <div className="text-right">SECURITY</div><div className="text-left font-bold text-active">MAX_LEVEL</div>
            <div className="text-right">CONNECTION</div><div className="text-left font-bold text-active">STABLE_32GBPS</div>
            <div className="text-right">NODES</div><div className="text-left font-bold text-active">PERFECT_TWIN_READY</div>
          </div>
        </div>
      )}

      {entries.map((entry) => (
        <div key={entry.id} className="group animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 border-b border-steel/10 pb-2 mb-4">
            <div className={`w-1 h-4 ${
              entry.sender === 'USER' ? 'bg-chrome' : 
              entry.sender === 'AGENT' ? 'bg-neon shadow-[0_0_10px_#00f0ff]' : 
              entry.sender === 'THOUGHT' ? 'bg-thinking' :
              'bg-tungsten'
            }`} />
            <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${
              entry.sender === 'USER' ? 'text-chrome' : 
              entry.sender === 'AGENT' ? 'text-neon' : 
              entry.sender === 'THOUGHT' ? 'text-thinking' :
              'text-tungsten'
            }`}>
              {entry.sender}
            </span>
            <span className="text-[8px] text-tungsten/40 font-bold uppercase tracking-widest">{entry.timestamp}</span>
            <div className="flex-1" />
            {entry.metadata?.nodeId && (
              <div className="flex items-center gap-2">
                 <span className="text-[8px] text-tungsten/50 uppercase tracking-tighter">NODE_ID:</span>
                 <span className="text-[9px] text-neon/90 font-bold tracking-widest border border-neon/30 px-2 py-0.5 bg-neon/5 shadow-[inset_0_0_5px_rgba(0,240,255,0.1)]">{entry.metadata.nodeId}</span>
              </div>
            )}
          </div>
          
          <div className={`text-sm leading-relaxed whitespace-pre-wrap pl-5 border-l-2 ${
            entry.sender === 'USER' ? 'text-chrome/70 italic border-chrome/10' : 
            entry.sender === 'THOUGHT' ? 'text-thinking/90 italic border-thinking/30' :
            'text-chrome border-neon/20 shadow-[inset_10px_0_15px_-10px_rgba(0,240,255,0.05)]'
          }`}>
            <span className="opacity-95">{entry.content}</span>
            
            {entry.sender === 'THOUGHT' && (
              <div className="mt-4 flex flex-col gap-4">
                <div className="grid grid-cols-4 gap-2">
                  {['Grounding', 'Analysis', 'Tracking', 'Sovereign'].map((step, i) => (
                      <div key={step} className="flex flex-col gap-1">
                        <div className="h-1 bg-steel/30 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 h-full bg-thinking w-full transition-all duration-1000 animate-pulse`} />
                        </div>
                        <span className="text-[7px] text-tungsten uppercase font-black tracking-tighter">{step}</span>
                      </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 space-y-6">
              {entry.metadata?.grounding && entry.metadata.grounding.length > 0 && renderGrounding(entry.metadata.grounding)}

              {entry.metadata?.imageUrl && (
                <div className="group/img relative border-2 border-steel/40 bg-void p-2 inline-block max-w-full hover:border-neon/60 transition-all duration-300 shadow-2xl">
                  <div className="absolute top-6 right-6 z-10 opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <span className="bg-neon text-void px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,240,255,0.4)]">ASSET_NOMINAL</span>
                  </div>
                  <img src={entry.metadata.imageUrl} alt="Synthetic_Output" className="max-w-full h-auto border border-steel/20" />
                </div>
              )}

              {entry.metadata?.videoUrl && (
                <div className="border-2 border-steel/40 bg-void p-2 w-full max-w-4xl hover:border-neon/60 transition-all duration-300 shadow-2xl">
                  <div className="mb-3 flex items-center gap-3 px-3">
                    <div className="w-2 h-2 bg-error animate-pulse" />
                    <span className="text-[10px] text-chrome font-bold uppercase tracking-widest">Temporal_Cinematic_Sequence</span>
                  </div>
                  <video controls src={entry.metadata.videoUrl} className="w-full h-auto bg-black border border-steel/10" />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {isThinking && (
        <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-5xl mx-auto">
          <div className="flex items-center gap-4 border-b border-thinking/30 pb-2">
            <div className="w-2 h-4 bg-thinking animate-thinking shadow-[0_0_10px_#aa00ff]" />
            <span className="text-[11px] font-black bg-thinking text-white px-3 py-1 uppercase tracking-[0.4em] shadow-lg">Cognitive_Fabric_Processing</span>
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 bg-thinking animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
          <div className="text-sm text-thinking/80 italic pl-6 border-l-2 border-thinking/30 flex flex-col gap-3">
            <span className="animate-pulse tracking-wide uppercase text-[10px]">Syncing Mesh-Network... Validating GATES Protocols... Handshaking with Perfect Twin specialists...</span>
            <div className="w-80 h-1 bg-steel/20 relative overflow-hidden">
               <div className="absolute top-0 left-0 h-full bg-thinking animate-[loading_2.5s_infinite]" />
            </div>
          </div>
        </div>
      )}
      <div className="h-32" />
    </div>
  );
};

export default ReasoningTrace;
