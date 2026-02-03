
import React from 'react';
import { AgentNode, NodeStatus } from '../types';
import { ICONS } from '../constants';

interface DiagnosticPanelProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: AgentNode[];
  contextUsage: number;
}

const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({ isOpen, onClose, nodes, contextUsage }) => {
  if (!isOpen) return null;

  const totalLoad = nodes.reduce((acc, n) => acc + n.load, 0) / nodes.length;
  const activeNodesCount = nodes.filter(n => n.status !== NodeStatus.OFFLINE).length;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-end font-mono overflow-hidden">
      <div className="absolute inset-0 bg-void/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl h-full bg-void border-l border-steel shadow-[-50px_0_150px_rgba(0,0,0,1)] flex flex-col animate-in slide-in-from-right duration-700">
        <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-neon via-thinking to-active" />
        
        <div className="p-12 border-b border-steel bg-obsidian/95 backdrop-blur-3xl flex items-center justify-between relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />
          <div className="flex items-center gap-8">
            <div className="w-14 h-14 bg-neon flex items-center justify-center shadow-[0_0_40px_#00f0ff] relative group">
              <ICONS.Cpu />
              <div className="absolute inset-0 border border-white/20 group-hover:scale-125 transition-transform duration-700" />
            </div>
            <div>
              <h2 className="text-chrome font-black text-2xl uppercase tracking-[0.7em] mb-2 leading-none">OS_Diagnostic_Mesh</h2>
              <div className="flex gap-8 items-center">
                 <p className="text-[10px] text-tungsten font-black uppercase tracking-[0.4em] opacity-40">Build_v5.0.2_SDR_ULTRA</p>
                 <div className="h-3 w-[1px] bg-steel/60" />
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-active shadow-[0_0_10px_#00ff88] animate-pulse" />
                    <span className="text-[10px] text-active font-black tracking-[0.3em] uppercase">Telemetry_Verified</span>
                 </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-tungsten hover:text-chrome transition-all p-4 border border-steel hover:border-chrome bg-steel/5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="p-12 grid grid-cols-3 gap-12 border-b border-steel bg-obsidian/60 relative overflow-hidden group">
          <div className="flex flex-col gap-5">
            <span className="text-[11px] text-tungsten font-black uppercase tracking-[0.4em] opacity-40">System_Average_Load</span>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black text-chrome tracking-tighter leading-none group-hover:text-neon transition-all duration-500">{totalLoad.toFixed(1)}</span>
              <span className="text-[16px] text-neon font-black tracking-widest">%</span>
            </div>
            <div className="h-1 bg-void w-full relative">
              <div className="absolute inset-y-0 left-0 bg-neon shadow-[0_0_10px_#00f0ff]" style={{ width: `${totalLoad}%` }} />
            </div>
          </div>

          <div className="flex flex-col gap-5 border-l border-steel/40 pl-12">
            <span className="text-[11px] text-tungsten font-black uppercase tracking-[0.4em] opacity-40">Mesh_Cohesion_Ratio</span>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black text-chrome tracking-tighter leading-none group-hover:text-active transition-all duration-500">{(activeNodesCount / 8 * 100).toFixed(0)}</span>
              <span className="text-[16px] text-active font-black tracking-widest">%</span>
            </div>
            <div className="h-1 bg-void w-full relative">
              <div className="absolute inset-y-0 left-0 bg-active shadow-[0_0_10px_#00ff88]" style={{ width: `${(activeNodesCount / 8 * 100)}%` }} />
            </div>
          </div>

          <div className="flex flex-col gap-5 border-l border-steel/40 pl-12">
            <span className="text-[11px] text-tungsten font-black uppercase tracking-[0.4em] opacity-40">Cognitive_Pressure</span>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black text-chrome tracking-tighter leading-none group-hover:text-thinking transition-all duration-500">{(contextUsage / 10485.76).toFixed(1)}</span>
              <span className="text-[16px] text-thinking font-black tracking-widest">mPa</span>
            </div>
            <div className="h-1 bg-void w-full relative">
              <div className="absolute inset-y-0 left-0 bg-thinking shadow-[0_0_10px_#aa00ff]" style={{ width: `${(contextUsage / 1048576 * 100)}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide bg-void/30 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-obsidian/98 backdrop-blur-3xl z-20 border-b border-steel">
              <tr>
                <th className="px-12 py-8 text-[11px] font-black text-tungsten uppercase tracking-[0.5em] opacity-60">Node_ID</th>
                <th className="px-12 py-8 text-[11px] font-black text-tungsten uppercase tracking-[0.5em] opacity-60">Cluster_Affinity</th>
                <th className="px-12 py-8 text-[11px] font-black text-tungsten uppercase tracking-[0.5em] opacity-60">Synthesis_State</th>
                <th className="px-12 py-8 text-[11px] font-black text-tungsten uppercase tracking-[0.5em] opacity-60">Load_Δ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel/20">
              {nodes.map((node) => (
                <tr key={node.id} className="hover:bg-steel/10 transition-all group cursor-crosshair">
                  <td className="px-12 py-8">
                     <div className="flex flex-col gap-1.5">
                        <span className="text-[14px] font-black text-neon group-hover:translate-x-2 transition-transform">{node.id}</span>
                        <span className="text-[11px] font-black text-chrome uppercase tracking-widest">{node.name}</span>
                     </div>
                  </td>
                  <td className="px-12 py-8">
                    <span className="text-[10px] text-tungsten font-black uppercase tracking-[0.3em] px-4 py-1.5 border border-steel/60 bg-void group-hover:border-neon/40 transition-colors">
                       {node.cluster}
                    </span>
                  </td>
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-4">
                       <div className={`w-2.5 h-2.5 shadow-[0_0_12px_currentColor] ${
                         node.status === NodeStatus.ONLINE ? 'text-active bg-active' :
                         node.status === NodeStatus.PROCESSING ? 'text-warning bg-warning animate-ping' :
                         'text-tungsten bg-tungsten'
                       }`} />
                       <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                         node.status === NodeStatus.ONLINE ? 'text-active' :
                         node.status === NodeStatus.PROCESSING ? 'text-warning' :
                         'text-tungsten'
                       }`}>
                         {node.status}
                       </span>
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-4">
                       <div className="flex-1 h-1 bg-void relative min-w-[60px]">
                          <div className={`h-full ${node.load > 80 ? 'bg-error shadow-[0_0_8px_#ff0055]' : 'bg-neon shadow-[0_0_8px_#00f0ff]'} transition-all duration-1000`} style={{ width: `${node.load}%` }} />
                       </div>
                       <span className="text-[10px] font-black text-chrome tabular-nums">{node.load.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 border-t border-steel bg-obsidian/90 flex justify-between items-center">
           <span className="text-[9px] text-tungsten font-black uppercase tracking-[0.5em]">Diagnostic_Session_Sealed</span>
           <button onClick={onClose} className="px-12 py-4 bg-neon text-void font-black text-xs uppercase tracking-[0.6em] hover:bg-white hover:shadow-[0_0_30px_#00f0ff] transition-all active:scale-95">
             Acknowledge_Dossier
           </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPanel;
