
import React, { useState } from 'react';
import { SessionAsset, StrategicObjective } from '../types';

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  objectives: StrategicObjective[];
  assets: SessionAsset[];
}

const DossierModal: React.FC<DossierModalProps> = ({ isOpen, onClose, objectives, assets }) => {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthProgress, setSynthProgress] = useState(0);

  if (!isOpen) return null;

  // Hilfsfunktion: Wandelt Data-URLs (Base64) sicher in Blobs um
  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const downloadSingleAsset = (asset: SessionAsset) => {
    const link = document.createElement('a');
    let url = '';
    
    try {
      if (asset.type === 'DOC' || asset.type === 'REPORT') {
        const blob = new Blob([asset.content || ''], { type: 'text/markdown' });
        url = URL.createObjectURL(blob);
      } else if (asset.url.startsWith('data:')) {
        const blob = dataURLtoBlob(asset.url);
        url = URL.createObjectURL(blob);
      } else {
        url = asset.url;
      }

      link.href = url;
      const ext = asset.type === 'IMAGE' ? 'png' : asset.type === 'VIDEO' ? 'mp4' : asset.type === 'AUDIO' ? 'wav' : 'md';
      link.download = `${asset.label.replace(/\s/g, '_')}_${asset.nodeId}.${ext}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Ressourcen-Cleanup nach kurzem Delay
      if (url.startsWith('blob:')) {
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (e) {
      console.error("Download failed for asset:", asset.id, e);
    }
  };

  const synthesizeFullDossier = () => {
    setIsSynthesizing(true);
    setSynthProgress(0);
    
    const interval = setInterval(() => {
      setSynthProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          executeFinalSynthesis();
          return 100;
        }
        return p + 5;
      });
    }, 50);
  };

  const executeFinalSynthesis = () => {
    let doc = `# AGENTICUM G5 - SOVEREIGN CAMPAIGN DOSSIER\n`;
    doc += `Generated: ${new Date().toLocaleString()}\n`;
    doc += `Classification: INDUSTRIAL_SECRET_//_LEVEL_OMEGA\n\n`;
    
    doc += `## 1. STRATEGIC OBJECTIVES\n`;
    objectives.forEach((obj, idx) => {
      doc += `### STEP 0${idx + 1}: ${obj.label} (Node ${obj.assignedNode})\n`;
      doc += `> ${obj.description}\n\nStatus: ${obj.status}\n\n`;
    });

    doc += `\n## 2. SYNTHESIZED INTEL REPORTS\n`;
    assets.filter(a => a.type === 'DOC' || a.type === 'REPORT').forEach(a => {
      doc += `### [${a.nodeId}] ${a.label}\n`;
      doc += `${a.content || 'Binary Artifact'}\n\n---\n\n`;
    });

    const blob = new Blob([doc], { type: 'text/markdown' });
    const dossierUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = dossierUrl;
    link.download = `G5_Sovereign_Campaign_Full_Archive.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(dossierUrl), 2000);

    // Gestaffelter Download der Medien-Assets zur Vermeidung von Browser-Blockaden
    const mediaAssets = assets.filter(a => a.type !== 'DOC' && a.type !== 'REPORT');
    mediaAssets.forEach((asset, index) => {
      setTimeout(() => downloadSingleAsset(asset), (index + 1) * 800);
    });

    setTimeout(() => {
      setIsSynthesizing(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 md:p-12 font-mono overflow-hidden">
      <div className="absolute inset-0 bg-void/98 backdrop-blur-3xl" onClick={onClose} />
      
      <div className="relative w-full max-w-7xl h-full bg-obsidian border border-steel shadow-[0_0_200px_rgba(0,0,0,1)] flex flex-col animate-in zoom-in-95 duration-700">
        {isSynthesizing && (
          <div className="absolute inset-0 z-[100] bg-void/95 backdrop-blur-3xl flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500">
            <div className="w-32 h-32 bg-neon flex items-center justify-center shadow-[0_0_60px_rgba(0,240,255,0.4)] relative">
              <span className="text-void font-black text-5xl z-10 animate-pulse">G5</span>
              <div className="absolute inset-0 border-4 border-neon animate-ping opacity-20" />
            </div>
            <div className="flex flex-col items-center gap-6 w-96">
              <span className="text-[14px] font-black text-chrome uppercase tracking-[0.8em]">Sovereign_Synthesis_Active</span>
              <div className="w-full h-1.5 bg-steel/30 relative overflow-hidden shadow-inner">
                <div className="absolute inset-y-0 left-0 bg-neon shadow-[0_0_20px_#00f0ff] transition-all duration-300" style={{ width: `${synthProgress}%` }} />
              </div>
              <div className="flex justify-between w-full text-[10px] text-tungsten font-black uppercase tracking-widest">
                 <span>{synthProgress}%_COMPILED</span>
                 <span className="animate-pulse">SEALING_ARTIFACTS...</span>
              </div>
            </div>
          </div>
        )}

        <div className="p-10 border-b border-steel flex justify-between items-center bg-steel/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon to-transparent opacity-40" />
          <div className="flex items-center gap-8">
            <div className="w-14 h-14 bg-neon flex items-center justify-center shadow-[0_0_30px_#00f0ff]">
              <span className="text-void font-black text-3xl">G5</span>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-black text-chrome tracking-[0.5em] uppercase leading-none">Campaign_Archive_Hub</h1>
              <span className="text-[11px] text-tungsten font-black uppercase tracking-[0.8em] opacity-60">Sovereign_OS // Artifact_Preservation</span>
            </div>
          </div>
          <button onClick={onClose} className="px-8 py-3 border border-steel text-[11px] font-black text-tungsten hover:text-chrome hover:border-chrome transition-all uppercase tracking-[0.4em] bg-steel/5">Terminal_Exit</button>
        </div>

        <div className="flex-1 overflow-y-auto p-16 space-y-24 scrollbar-hide custom-scrollbar">
          <section className="space-y-10">
            <div className="flex items-center gap-6">
              <div className="w-4 h-4 bg-neon shadow-[0_0_15px_#00f0ff]" />
              <h2 className="text-[18px] font-black text-neon uppercase tracking-[0.6em]">System_Synthesis_Summary</h2>
            </div>
            <div className="grid grid-cols-4 gap-12 border border-steel/20 p-12 bg-void/40 relative overflow-hidden group">
              <div className="absolute inset-0 bg-neon/0 group-hover:bg-neon/5 transition-all duration-700" />
              {[
                { label: 'Cycle_Status', value: 'FINALIZED', color: 'text-active' },
                { label: 'Mesh_Sync', value: `${objectives.length}/8`, color: 'text-chrome' },
                { label: 'Artifact_Count', value: assets.length, color: 'text-chrome' },
                { label: 'Integrity', value: '100%', color: 'text-neon' }
              ].map(stat => (
                <div key={stat.label} className="flex flex-col gap-3 relative z-10">
                  <span className="text-[10px] text-tungsten font-black uppercase tracking-widest opacity-60">{stat.label}</span>
                  <span className={`text-5xl font-black ${stat.color} tracking-tighter`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-12">
            <div className="flex items-center gap-6">
              <div className="w-4 h-4 bg-thinking shadow-[0_0_15px_#aa00ff]" />
              <h2 className="text-[18px] font-black text-thinking uppercase tracking-[0.6em]">Strategic_Intel_Grid</h2>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {assets.filter(a => a.type === 'DOC' || a.type === 'REPORT').map((asset) => (
                <div key={asset.id} className="p-12 bg-obsidian border border-steel/30 relative group hover:border-thinking/40 transition-all duration-500 shadow-xl">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                     <span className="text-[140px] font-black text-chrome leading-none">INTEL</span>
                  </div>
                  <div className="flex justify-between items-center mb-10 border-b border-steel/40 pb-6">
                    <div className="flex flex-col gap-1">
                       <span className="text-[12px] font-black text-thinking uppercase tracking-[0.4em]">[{asset.nodeId}] // {asset.label}</span>
                       <span className="text-[8px] text-tungsten font-black uppercase tracking-widest">Sovereign_Hash: {asset.id}_VERIFIED</span>
                    </div>
                    <button onClick={() => downloadSingleAsset(asset)} className="text-[10px] text-tungsten hover:text-chrome font-black uppercase border border-steel px-4 py-2 hover:bg-steel/10 transition-all">Download_MD</button>
                  </div>
                  <div className="text-[15px] text-chrome/80 leading-relaxed font-sans whitespace-pre-wrap max-h-[400px] overflow-y-auto scrollbar-hide pr-8">
                    {asset.content}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-12 pb-24">
            <div className="flex items-center gap-6">
              <div className="w-4 h-4 bg-active shadow-[0_0_15px_#00ff88]" />
              <h2 className="text-[18px] font-black text-active uppercase tracking-[0.6em]">Acoustic_&_Visual_Vault</h2>
            </div>
            <div className="grid grid-cols-3 gap-8">
              {assets.filter(a => a.type !== 'DOC' && a.type !== 'REPORT').map((asset) => (
                <div key={asset.id} className="group relative aspect-video bg-void border border-steel/30 overflow-hidden hover:border-neon transition-all duration-500 shadow-2xl">
                  {asset.type === 'IMAGE' ? (
                    <img src={asset.url} alt={asset.label} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-steel/5">
                       <div className={`w-12 h-12 border-2 ${asset.type === 'VIDEO' ? 'border-warning animate-pulse' : 'border-thinking'} mb-4`} />
                       <span className="text-[10px] text-tungsten font-black uppercase tracking-widest opacity-60">{asset.type}_ARTIFACT</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-obsidian/95 backdrop-blur-xl border-t border-steel translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex justify-between items-center z-10">
                     <div className="flex flex-col gap-1">
                        <span className="text-[11px] text-chrome font-black uppercase truncate block tracking-widest">{asset.label}</span>
                        <span className="text-[8px] text-tungsten font-black uppercase tracking-widest">Node_Origin: {asset.nodeId}</span>
                     </div>
                     <button onClick={() => downloadSingleAsset(asset)} className="p-2 border border-steel text-tungsten hover:text-neon hover:border-neon transition-all">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-10 border-t border-steel bg-obsidian/95 flex justify-between items-center z-20 backdrop-blur-3xl relative">
           <div className="absolute top-0 left-0 w-full h-[1px] bg-steel/40" />
           <div className="flex flex-col gap-1">
              <span className="text-[10px] text-tungsten font-black uppercase tracking-widest opacity-60">Sovereign_OS_Finality</span>
              <span className="text-[14px] text-neon font-black font-mono tracking-tighter">G5_SYS_STABLE_UPLINK</span>
           </div>
           <div className="flex gap-6">
              <button onClick={onClose} className="px-10 py-5 border border-steel text-tungsten font-black text-xs uppercase tracking-[0.5em] hover:text-chrome hover:border-chrome transition-all bg-steel/5">Archive_Hub</button>
              <button 
                onClick={synthesizeFullDossier}
                className="px-16 py-5 bg-neon text-void font-black text-xs uppercase tracking-[0.5em] hover:shadow-[0_0_60px_#00f0ff] transition-all active:scale-95 relative overflow-hidden group"
              >
                <span className="relative z-10">Synthesize_Global_Archive</span>
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DossierModal;
