
import React, { useEffect, useRef, useState } from 'react';
import { TraceEntry, GroundingChunk } from '../types';

const GroundingLinks: React.FC<{ chunks: GroundingChunk[] }> = ({ chunks }) => {
  if (!chunks || chunks.length === 0) return null;
  return (
    <div className="mt-8 pt-6 border-t border-steel/20">
      <h4 className="text-[10px] font-black text-neon uppercase tracking-widest mb-4">Neural_Citations_Verified:</h4>
      <div className="flex flex-wrap gap-3">
        {chunks.map((chunk, i) => {
          const item = chunk.web || chunk.maps;
          if (!item?.uri) return null;
          return (
            <a 
              key={i} 
              href={item.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-neon/5 border border-neon/20 text-[10px] text-neon hover:bg-neon hover:text-void transition-all uppercase font-black"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              {item.title || (chunk.web ? 'Web Source' : 'Maps Location')}
            </a>
          );
        })}
      </div>
    </div>
  );
};

const TacticalMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        if (line.startsWith('###')) return <h3 key={i} className="text-neon font-black text-xl tracking-widest mt-8 uppercase">{line.replace('###', '')}</h3>;
        if (line.startsWith('##')) return <h2 key={i} className="text-chrome font-black text-2xl tracking-[0.3em] mt-10 border-b border-steel/30 pb-2 uppercase">{line.replace('##', '')}</h2>;
        if (line.startsWith('- ') || line.startsWith('* ')) return (
          <div key={i} className="flex gap-4 pl-4 group">
            <div className="w-1.5 h-1.5 bg-neon mt-2 shadow-[0_0_8px_#00f0ff] group-hover:scale-150 transition-transform" />
            <p className="text-chrome/80 leading-relaxed italic">{line.slice(2)}</p>
          </div>
        );
        return <p key={i} className="leading-relaxed text-chrome/90">{line}</p>;
      })}
    </div>
  );
};

const ReasoningTrace: React.FC<{ entries: TraceEntry[], isThinking: boolean }> = ({ entries, isThinking }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [entries, isThinking]);

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 lg:p-20 space-y-20 font-mono bg-void/5 custom-scrollbar scroll-smooth">
        <div className="max-w-6xl mx-auto w-full space-y-20 pb-20">
          {entries.map((entry) => (
            <div key={entry.id} className={`animate-in fade-in slide-in-from-bottom-8 duration-700 relative p-8 border ${entry.sender === 'NEURAL_MIRROR' ? 'border-amethyst/30 bg-amethyst/5 shadow-[0_0_40px_rgba(170,0,255,0.1)]' : 'border-transparent'}`}>
              <div className="flex items-center gap-8 border-b border-steel/30 pb-4 mb-6">
                <div className={`w-1.5 h-6 ${
                  entry.sender === 'USER' ? 'bg-chrome' : 
                  entry.sender === 'AGENT' ? 'bg-neon' : 
                  entry.sender === 'NEURAL_MIRROR' ? 'bg-amethyst shadow-[0_0_15px_#aa00ff]' :
                  'bg-active'
                }`} />
                <div className="flex flex-col">
                  <span className={`text-[11px] font-black tracking-[0.6em] uppercase leading-none ${
                    entry.sender === 'USER' ? 'text-chrome' : entry.sender === 'NEURAL_MIRROR' ? 'text-amethyst' : 'text-neon'
                  }`}>{entry.sender}</span>
                  <span className="text-[7px] text-tungsten font-black uppercase tracking-[0.4em] mt-1.5 opacity-40">Channel_Secure // Verified</span>
                </div>
                <div className="ml-auto text-[9px] text-tungsten font-bold tracking-widest opacity-40">{entry.timestamp}</div>
              </div>
              
              <div className="text-[15px] leading-relaxed pl-10 border-l border-steel/20">
                <TacticalMarkdown content={entry.content} />
                {entry.metadata?.grounding && <GroundingLinks chunks={entry.metadata.grounding} />}
              </div>
              
              {entry.metadata?.thoughtSignature && (
                <div className="mt-6 flex justify-end">
                  <span className="text-[8px] text-tungsten font-mono opacity-20 uppercase tracking-[0.3em]">Signature: {entry.metadata.thoughtSignature}</span>
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex flex-col gap-6 animate-pulse pl-10 border-l border-thinking/20">
               <div className="flex items-center gap-6">
                  <div className="w-1.5 h-6 bg-thinking shadow-[0_0_10px_#aa00ff]" />
                  <span className="text-[11px] font-black tracking-[0.6em] text-thinking uppercase">Recursive_Synthesis_In_Progress</span>
               </div>
               <div className="h-1 bg-thinking/10 w-full overflow-hidden">
                 <div className="h-full bg-thinking/40 w-1/3 animate-[loading_1.5s_infinite]" />
               </div>
            </div>
          )}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}} />
    </div>
  );
};

export default ReasoningTrace;
