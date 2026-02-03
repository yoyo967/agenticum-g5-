
import React, { useState } from 'react';
import { AgentNode, NodeStatus, ClusterType } from '../types';
import { ICONS, CLUSTERS } from '../constants';

interface NodeGridProps {
  nodes: AgentNode[];
  activeNodeId: string;
  onSelectNode: (id: string) => void;
}

const NodeGrid: React.FC<NodeGridProps> = ({ nodes, activeNodeId, onSelectNode }) => {
  const [expandedClusters, setExpandedClusters] = useState<Set<ClusterType>>(new Set(['APEX', 'STRATEGY', 'INTELLIGENCE', 'CREATION']));

  const toggleCluster = (cluster: ClusterType) => {
    const next = new Set(expandedClusters);
    if (next.has(cluster)) next.delete(cluster);
    else next.add(cluster);
    setExpandedClusters(next);
  };

  const groupedNodes = nodes.reduce((acc, node) => {
    if (!acc[node.cluster]) acc[node.cluster] = [];
    acc[node.cluster].push(node);
    return acc;
  }, {} as Record<ClusterType, AgentNode[]>);

  const activeNode = nodes.find(n => n.id === activeNodeId);

  return (
    <div className="flex flex-col h-full bg-void border-r border-steel w-80 shrink-0 overflow-hidden font-mono select-none">
      <div className="p-8 border-b border-steel bg-obsidian/95 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-neon shadow-[0_0_20px_#00f0ff] group-hover:w-full group-hover:opacity-5 transition-all duration-700" />
        <h2 className="text-chrome font-black text-[12px] tracking-[0.5em] uppercase flex items-center gap-4 relative z-10">
          <div className="animate-pulse text-neon"><ICONS.Cpu /></div> NODE_MATRIX_FABRIC
        </h2>
        <div className="mt-3 flex justify-between text-[8px] font-black text-tungsten tracking-[0.3em] uppercase opacity-40">
           <span>Uplink_SDR_v10.2</span>
           <span className="text-active animate-pulse">Synchronized</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3 bg-void/50 custom-scrollbar">
        {(Object.keys(CLUSTERS) as ClusterType[]).map((clusterKey) => {
          const clusterNodes = groupedNodes[clusterKey] || [];
          if (clusterNodes.length === 0) return null;
          const isExpanded = expandedClusters.has(clusterKey);
          
          return (
            <div key={clusterKey} className="bg-obsidian/60 border border-steel/20 transition-all duration-500 overflow-hidden">
              <button 
                onClick={() => toggleCluster(clusterKey)}
                className={`w-full flex items-center justify-between px-5 py-4 transition-all ${isExpanded ? 'bg-steel/10 border-b border-steel/20' : 'hover:bg-steel/5'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-1.5 h-4 transition-all duration-500 ${isExpanded ? 'bg-neon shadow-[0_0_10px_#00f0ff]' : 'bg-steel/40'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${isExpanded ? 'text-chrome' : 'text-tungsten'}`}>
                    {CLUSTERS[clusterKey].label}
                  </span>
                </div>
                <div className={`transition-transform duration-500 ${isExpanded ? 'rotate-90 text-neon' : 'text-tungsten opacity-20'}`}>
                  <ICONS.ChevronRight />
                </div>
              </button>
              
              {isExpanded && (
                <div className="p-2.5 space-y-2 animate-in slide-in-from-top-2 duration-500">
                  {clusterNodes.map((node) => {
                    const isActive = activeNodeId === node.id;
                    const isProcessing = node.status === NodeStatus.PROCESSING;
                    return (
                      <button
                        key={node.id}
                        onClick={() => onSelectNode(node.id)}
                        className={`w-full p-4 text-left border-2 transition-all relative group overflow-hidden ${
                          isActive 
                          ? 'border-neon bg-neon/10 shadow-[inset_0_0_30px_rgba(0,240,255,0.05)]' 
                          : 'border-steel/20 bg-void/60 hover:border-steel/60 hover:bg-steel/5'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-[9px] font-black tracking-widest uppercase transition-colors ${isActive ? 'text-neon' : 'text-tungsten opacity-60'}`}>
                            {node.id}
                          </span>
                          <div className={`w-2 h-2 ${isProcessing ? 'bg-warning animate-ping' : 'bg-active'} shadow-[0_0_10px_currentColor] rounded-full`} />
                        </div>
                        
                        <span className={`text-[11px] font-black uppercase truncate block transition-colors tracking-tight ${isActive ? 'text-chrome' : 'text-tungsten group-hover:text-chrome'}`}>
                          {node.name}
                        </span>

                        <div className="mt-4 h-[2px] bg-void/80 w-full relative overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${isActive ? 'bg-neon shadow-[0_0_10px_#00f0ff]' : 'bg-steel/40'}`} 
                            style={{ width: `${node.load}%` }} 
                          />
                        </div>
                        
                        {isActive && (
                          <div className="absolute top-0 right-0 p-1 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity">
                             <div className="text-[24px] font-black tracking-tighter leading-none select-none">{node.id.split('-')[1]}</div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activeNode && (
        <div className="p-8 border-t-2 border-steel bg-obsidian/95 space-y-6 animate-in slide-in-from-bottom-4 duration-700 relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-neon/20" />
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-neon font-black uppercase tracking-[0.6em]">{activeNode.id}_LOGS</span>
            <div className="flex gap-1.5">
               <div className="w-1.5 h-1.5 bg-neon rounded-full" />
               <div className="w-1.5 h-1.5 bg-neon/20 rounded-full" />
               <div className="w-1.5 h-1.5 bg-neon/20 rounded-full" />
            </div>
          </div>
          <p className="text-[10px] text-chrome/60 leading-relaxed font-bold uppercase tracking-widest italic">
            {activeNode.description}
          </p>
          <div className="pt-4 flex flex-col gap-3 border-t border-steel/20">
             <div className="flex justify-between text-[9px] font-black">
               <span className="text-tungsten uppercase tracking-widest opacity-40">COGNITIVE_AFFINITY</span>
               <span className="text-neon">GEMINI_3_PRO</span>
             </div>
             <div className="flex justify-between text-[9px] font-black">
               <span className="text-tungsten uppercase tracking-widest opacity-40">LATENCY_PROTOCOL</span>
               <span className="text-active">SUB_100MS_SYNC</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeGrid;
