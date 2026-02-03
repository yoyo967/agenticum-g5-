
import React, { useEffect, useRef, useState } from 'react';
import { TraceEntry, StrategicObjective, GroundingChunk } from '../types';

interface ReasoningTraceProps {
  entries: TraceEntry[];
  isThinking: boolean;
}

const ReasoningTrace: React.FC<ReasoningTraceProps> = ({ entries, isThinking }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showRawLog, setShowRawLog] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [entries, isThinking]);

  const renderThoughtSignature = (signature?: string) => {
    if (!signature) return null;
    return (
      <div className="mt-8 p-5 border border-steel/40 bg-void/80 flex items-center justify-between group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-neon/60" />
        <div className="flex gap-2">
          {signature.split('').slice(0, 16).map((char, i) => (
            <div key={i} className="w-3 h-6 bg-neon/10 flex items-center justify-center border border-white/5">
              <div 
                className="w-[1.5px] h-full bg-neon/50 animate-[pulse_1.5s_infinite]" 
                style={{ animationDelay: `${i * 0.1}s` }} 
              />
            </div>
          ))}
        </div>
        <div className="flex gap-8 items-center">
          <div className="flex flex-col items-end">
             <span className="text-[8px] text-tungsten font-black tracking-[0.8em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">
               DETERMINISTIC_SIGNATURE
             </span>
             <span className="text-[10px] text-neon font-black font-mono tracking-widest mt-1">
               {signature.slice(0, 20).toUpperCase()}
             </span>
          </div>
          <div className="w-2.5 h-2.5 bg-active shadow-[0_0_15px_#00ff88]" />
        </div>
      </div>
    );
  };

  const renderTelemetry = (entry: TraceEntry) => {
    if (!entry.metadata?.tokensUsed && !entry.metadata?.latency) return null;
    
    return (
      <div className="flex flex-wrap gap-8 mt-6 text-[9px] font-black text-tungsten tracking-[0.4em] uppercase opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-thinking" />
          <span>TOKENS: {entry.metadata.tokensUsed || 0}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-warning" />
          <span>LATENCY: {entry.metadata.latency || 0}MS</span>
        </div>
        <div className={`px-3 py-1 border border-steel/50 bg-void`}>
          SOVEREIGN_EXECUTION_STABLE
        </div>
      </div>
    );
  };

  const renderPlan = (plan: StrategicObjective[]) => (
    <div className="bg-obsidian border border-neon/30 p-12 mt-12 space-y-8 relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none select-none">
         <span className="text-[140px] font-black text-neon leading-none tracking-tighter">PLAN_X</span>
      </div>
      <div className="flex items-center gap-6 mb-10 border-b border-steel pb-8">
        <div className="w-2 h-8 bg-neon shadow-[0_0_20px_#00f0ff]" />
        <div className="flex flex-col">
          <h3 className="text-[14px] font-black text-neon uppercase tracking-[1em] leading-none">Objective_Mesh_Fabric</h3>
          <span className="text-[8px] text-tungsten font-black uppercase tracking-[0.4em] mt-3 opacity-60">Sequence_Analysis_Stabilized</span>
        </div>
      </div>
      <div className="space-y-5">
        {plan.map((obj, i) => (
          <div key={i} className={`flex items-center gap-8 p-6 border transition-all duration-700 ${
            obj.status === 'COMPLETED' ? 'border-active/40 bg-active/5' : 
            obj.status === 'ACTIVE' ? 'border-neon/40 bg-neon/10 animate-pulse' : 
            'border-steel/20 opacity-30 bg-void/40'
          }`}>
            <div className="flex flex-col items-center gap-1.5 min-w-[70px] border-r border-steel/30 pr-8">
              <span className="text-[10px] text-tungsten font-black tracking-widest uppercase opacity-40">NODE</span>
              <span className="text-3xl font-black text-chrome leading-none">{obj.assignedNode.split('-')[1]}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-5">
                <div className="flex flex-col gap-2">
                   <span className="text-[16px] font-black text-chrome uppercase tracking-widest">{obj.label}</span>
                   <span className="text-[9px] text-tungsten font-bold uppercase tracking-[0.5em] opacity-80">Assignment: {obj.assignedNode} // Alpha_Link</span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${obj.status === 'COMPLETED' ? 'text-active shadow-[0_0_15px_#00ff88]' : 'text-neon animate-pulse'}`}>{obj.status}</span>
                  <div className="flex gap-1.5">
                    {Array.from({length: 4}).map((_, j) => (
                      <div key={j} className={`w-1.5 h-1.5 ${obj.status === 'COMPLETED' ? 'bg-active' : (obj.status === 'ACTIVE' && j < (obj.progress/25) ? 'bg-neon animate-pulse' : 'bg-steel/30')}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-[3px] bg-void w-full relative overflow-hidden shadow-inner border border-white/5">
                 <div className={`h-full transition-all duration-1000 ${obj.status === 'COMPLETED' ? 'bg-active shadow-[0_0_20px_#00ff88]' : 'bg-neon shadow-[0_0_25px_#00f0ff]'}`} style={{ width: `${obj.progress}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGrounding = (grounding: GroundingChunk[]) => (
    <div className="mt-12 p-12 border border-active/40 bg-active/5 space-y-10 relative overflow-hidden shadow-[0_0_100px_rgba(0,255,136,0.1)]">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none select-none">
         <span className="text-[100px] font-black text-active leading-none tracking-tighter">SOURCE_INTEL</span>
      </div>
      <div className="flex items-center gap-6 border-b border-active/30 pb-8">
        <div className="w-5 h-5 bg-active shadow-[0_0_30px_#00ff88]" />
        <div className="flex flex-col">
          <span className="text-[14px] font-black text-active uppercase tracking-[1em] leading-none">Forensic_Verification</span>
          <span className="text-[8px] text-tungsten font-black uppercase tracking-[0.4em] mt-3 opacity-60">Validated_Web_Grounding_Protocol</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {grounding.map((chunk, idx) => {
          const item = chunk.web || chunk.maps;
          if (!item) return null;
          return (
            <a 
              key={idx} 
              href={item.uri} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[13px] text-chrome/80 hover:text-active transition-all flex items-center gap-6 group border border-steel/30 p-5 bg-void/60 hover:bg-active/10 hover:border-active/60"
            >
              <div className="w-10 h-10 border border-active/40 flex items-center justify-center shrink-0 group-hover:bg-active group-hover:text-void transition-all">
                 <span className="text-[12px] font-black">{idx + 1}</span>
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate group-hover:underline tracking-tight uppercase font-black text-[14px]">{item.title || item.uri}</span>
                <span className="text-[8px] text-tungsten font-bold tracking-[0.3em] mt-2 opacity-60">SOURCE_DOMAIN // {new URL(item.uri || '').hostname}</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex-1 relative flex flex-col overflow-hidden">
      <div className="absolute top-8 right-12 z-20 flex gap-6">
        <button 
          onClick={() => setShowRawLog(!showRawLog)}
          className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${showRawLog ? 'bg-warning text-void border-warning shadow-[0_0_15px_rgba(255,170,0,0.4)]' : 'bg-void/80 text-tungsten border-steel hover:text-chrome hover:bg-white/5'}`}
        >
          Raw_Telemetry_Terminal
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 md:p-16 lg:p-24 space-y-24 font-mono scrollbar-hide bg-void/5 relative custom-scrollbar">
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto w-full space-y-24">
          {entries.map((entry) => (
            <div key={entry.id} className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <div className="flex items-center gap-10 border-b border-steel/30 pb-6 mb-10">
                <div className={`w-2 h-7 ${
                  entry.sender === 'USER' ? 'bg-chrome shadow-[0_0_10px_#fff]' : 
                  entry.sender === 'AGENT' ? 'bg-neon shadow-[0_0_15px_#00f0ff]' : 
                  entry.sender === 'CONSENSUS' ? 'bg-active shadow-[0_0_15px_#00ff88]' :
                  entry.sender === 'MISSION_CONTROL' ? 'bg-warning shadow-[0_0_15px_#ffaa00]' : 'bg-active'
                }`} />
                <div className="flex flex-col">
                  <span className={`text-[13px] font-black tracking-[0.6em] uppercase leading-none ${
                    entry.sender === 'USER' ? 'text-chrome' : entry.sender === 'MISSION_CONTROL' ? 'text-warning' : entry.sender === 'AGENT' ? 'text-neon' : 'text-active'
                  }`}>{entry.sender}</span>
                  <span className="text-[7px] text-tungsten font-black uppercase tracking-[0.4em] mt-2 opacity-50">Transmission_Protocol: LOCKED_CHANNEL</span>
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-steel/30 via-steel/10 to-transparent" />
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-tungsten font-bold tracking-widest opacity-60">{entry.timestamp}</span>
                  <span className="text-[7px] text-neon font-black tracking-[0.3em] mt-1.5">{entry.metadata?.nodeId || 'GLOBAL_CNS'} // NODE_SYNC</span>
                </div>
              </div>
              
              <div className={`text-[16px] leading-relaxed whitespace-pre-wrap pl-12 border-l border-steel/20 ml-0.5 ${
                entry.sender === 'USER' ? 'text-tungsten italic font-medium' : 'text-chrome/95 font-medium'
              }`}>
                {showRawLog ? (
                  <div className="bg-obsidian/90 p-6 text-[11px] text-warning border border-warning/20 font-mono shadow-2xl overflow-x-auto whitespace-pre">
                    {`[RAW_TELEMETRY_${entry.id}]\n${JSON.stringify(entry.metadata || {}, null, 2)}`}
                    <div className="mt-6 border-t border-warning/10 pt-6 opacity-80">
                      {entry.content}
                    </div>
                  </div>
                ) : (
                  <div className={`${entry.sender === 'SYSTEM' ? 'text-active font-black tracking-[0.1em] bg-active/5 p-4 border border-active/20' : ''}`}>
                    {entry.content}
                  </div>
                )}
                {renderTelemetry(entry)}
                {entry.metadata?.thoughtSignature && renderThoughtSignature(entry.metadata.thoughtSignature)}
                {entry.metadata?.plan && renderPlan(entry.metadata.plan)}
                {entry.metadata?.grounding && renderGrounding(entry.metadata.grounding)}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex flex-col gap-10 animate-pulse border-l border-thinking/20 pl-12 ml-0.5">
               <div className="flex items-center gap-10 border-b border-thinking/30 pb-6">
                  <div className="w-2 h-7 bg-thinking shadow-[0_0_15px_#aa00ff]" />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-black tracking-[0.6em] text-thinking uppercase leading-none">Cognitive_Fabric_Synthesizing</span>
                    <span className="text-[7px] text-tungsten font-black uppercase tracking-[0.4em] mt-2 opacity-40">System_2_Thinking_Engagement</span>
                  </div>
               </div>
               <div className="space-y-8">
                  <div className="h-4 w-full bg-thinking/10 overflow-hidden relative border border-white/5 shadow-inner">
                     <div className="h-full bg-thinking/40 w-1/4 animate-[loading_4s_infinite]" />
                  </div>
                  <div className="h-4 w-3/4 bg-thinking/10 overflow-hidden relative border border-white/5 shadow-inner">
                     <div className="h-full bg-thinking/40 w-1/3 animate-[loading_3s_infinite_reverse]" />
                  </div>
               </div>
            </div>
          )}
        </div>
        <div className="h-64" />

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
          }
        `}} />
      </div>
    </div>
  );
};

export default ReasoningTrace;
