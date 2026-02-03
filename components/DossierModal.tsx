
import React, { useState, useRef } from 'react';
import { SessionAsset, StrategicObjective } from '../types';
import { generateBriefingAudio } from '../services/geminiService';

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  objectives: StrategicObjective[];
  assets: SessionAsset[];
}

const DossierModal: React.FC<DossierModalProps> = ({ isOpen, onClose, objectives, assets }) => {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [briefingUrl, setBriefingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (!isOpen) return null;

  const handlePlayBriefing = async () => {
    if (briefingUrl) {
      audioRef.current?.play();
      return;
    }

    setIsBriefingLoading(true);
    try {
      const summaryText = assets
        .filter(a => a.type === 'REPORT' || a.type === 'DOC')
        .map(a => a.content)
        .join('\n\n')
        .slice(0, 2000); 

      const url = await generateBriefingAudio(summaryText);
      setBriefingUrl(url);
      setTimeout(() => {
        if (audioRef.current) audioRef.current.play();
      }, 300);
    } catch (e) {
      console.error("Briefing synthesis failed", e);
    } finally {
      setIsBriefingLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-8 font-mono overflow-hidden">
      <div className="absolute inset-0 bg-void/98 backdrop-blur-3xl" onClick={onClose} />
      
      <div className="relative w-full max-w-7xl h-full bg-obsidian border border-steel shadow-[0_0_200px_rgba(0,0,0,1)] flex flex-col animate-in zoom-in-95 duration-700">
        <div className="p-10 border-b border-steel flex justify-between items-center bg-steel/5">
          <div className="flex items-center gap-8">
            <div className="w-12 h-12 bg-neon flex items-center justify-center shadow-[0_0_20px_#00f0ff]"><span className="text-void font-black text-2xl">G5</span></div>
            <h1 className="text-2xl font-black text-chrome tracking-[0.5em] uppercase leading-none">Campaign_Artifact_Hub</h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handlePlayBriefing}
              disabled={isBriefingLoading}
              className={`px-6 py-2 border flex items-center gap-3 transition-all ${isBriefingLoading ? 'border-steel text-tungsten animate-pulse' : 'border-thinking text-thinking hover:bg-thinking hover:text-void'}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest">{isBriefingLoading ? 'Synthesizing...' : 'Play_Audio_Briefing'}</span>
            </button>
            <button onClick={onClose} className="text-tungsten hover:text-chrome border border-steel px-6 py-2 uppercase tracking-widest text-[10px] font-black">Close_Dossier</button>
          </div>
        </div>

        {briefingUrl && <audio ref={audioRef} src={briefingUrl} className="hidden" />}

        <div className="flex-1 overflow-y-auto p-12 space-y-16 custom-scrollbar">
           <div className="grid grid-cols-4 gap-8">
              {[
                { label: 'Artifacts', value: assets.length },
                { label: 'Intelligence', value: assets.filter(a => a.type === 'REPORT').length },
                { label: 'Media', value: assets.filter(a => a.type === 'IMAGE' || a.type === 'VIDEO').length },
                { label: 'Integrity', value: 'Verified' }
              ].map(stat => (
                <div key={stat.label} className="p-8 border border-steel/20 bg-void/40 flex flex-col gap-2">
                   <span className="text-[9px] text-tungsten font-black uppercase tracking-widest">{stat.label}</span>
                   <span className="text-3xl font-black text-chrome">{stat.value}</span>
                </div>
              ))}
           </div>

           <div className="space-y-8">
              <h3 className="text-[14px] font-black text-neon uppercase tracking-[0.6em]">Consensus_Artifact_Registry</h3>
              <div className="grid grid-cols-1 gap-4">
                {assets.map(asset => (
                  <div key={asset.id} className="p-6 border border-steel/20 bg-obsidian/40 flex justify-between items-center group hover:border-neon transition-all">
                    <div className="flex items-center gap-6">
                       <div className={`w-1.5 h-6 ${asset.type === 'IMAGE' ? 'bg-neon' : asset.type === 'VIDEO' ? 'bg-warning' : 'bg-thinking'}`} />
                       <div className="flex flex-col">
                          <span className="text-[12px] font-black text-chrome uppercase tracking-widest">{asset.label}</span>
                          <span className="text-[8px] text-tungsten uppercase tracking-[0.2em]">{asset.nodeId} // {asset.type} // {asset.timestamp}</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="p-10 border-t border-steel bg-obsidian/95 flex justify-end gap-6">
           <button onClick={onClose} className="px-10 py-5 border border-steel text-tungsten font-black text-xs uppercase tracking-[0.5em] hover:text-chrome transition-all">Archive_Exit</button>
           <button className="px-16 py-5 bg-neon text-void font-black text-xs uppercase tracking-[0.5em] hover:shadow-[0_0_60px_#00f0ff] transition-all disabled:opacity-30" disabled={assets.length === 0}>Download_Master_Archive</button>
        </div>
      </div>
    </div>
  );
};

export default DossierModal;
