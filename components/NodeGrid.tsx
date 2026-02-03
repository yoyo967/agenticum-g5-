
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
    <div className="flex flex-col h-full bg-void border-r border-steel w-72 shrink-0 overflow-hidden font-mono select-none">
      <div className="p-5 border-b border-steel bg-obsidian/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-neon shadow-[0_0_10px_#00f0ff]" />
        <h2 className="text-chrome font-black text-[11px] tracking-[0.4em] uppercase flex items-center gap-3">
          <div className="animate-pulse"><ICONS.Cpu /></div> NODE_MATRIX_FABRIC
        </h2>
        <div className="mt-2 flex justify-between text-[8px] font-black text-tungsten tracking-[0.2em] uppercase">
           <span>Uplink_SDR_v5</span>
           <span className="text-active animate-pulse">Synchronized</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-2 bg-void/50 custom-scrollbar">
        {(Object.keys(CLUSTERS) as ClusterType[]).map((clusterKey) => {
          const clusterNodes = groupedNodes[clusterKey] || [];
          if (clusterNodes.length === 0) return null;
          const isExpanded = expandedClusters.has(clusterKey);
          
          return (
            <div key={clusterKey} className="bg-obsidian/40 border border-steel/20 transition-all duration-300">
              <button 
                onClick={() => toggleCluster(clusterKey)}
                className={`w-full flex items-center justify-between px-4 py-3 transition-all ${isExpanded ? 'bg-steel/10 border-b border-steel/10' : 'hover:bg-steel/5'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-3 ${isExpanded ? 'bg-neon shadow-[0_0_5px_#00f0ff]' : 'bg-steel/40'}`} />
                  <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${isExpanded ? 'text-chrome' : 'text-tungsten'}`}>
                    {CLUSTERS[clusterKey].label}
                  </span>
                </div>
                <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90 text-neon' : 'text-tungsten opacity-40'}`}>
                  <ICONS.ChevronRight />
                </div>
              </button>
              
              {isExpanded && (
                <div className="p-1.5 space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                  {clusterNodes.map((node) => {
                    const isActive = activeNodeId === node.id;
                    const isProcessing = node.status === NodeStatus.PROCESSING;
                    return (
                      <button
                        key={node.id}
                        onClick={() => onSelectNode(node.id)}
                        className={`w-full p-3 text-left border transition-all relative group overflow-hidden ${
                          isActive 
                          ? 'border-neon bg-neon/5 shadow-[inset_0_0_20px_rgba(0,240,255,0.05)]' 
                          : 'border-steel/20 bg-void/40 hover:border-steel/60 hover:bg-steel/5'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-[8px] font-black tracking-widest uppercase ${isActive ? 'text-neon' : 'text-tungsten'}`}>
                            {node.id}
                          </span>
                          <div className={`w-1.5 h-1.5 ${isProcessing ? 'bg-warning animate-ping' : 'bg-active'} shadow-[0_0_6px_currentColor]`} />
                        </div>
                        
                        <span className={`text-[10px] font-black uppercase truncate block transition-colors ${isActive ? 'text-chrome' : 'text-tungsten group-hover:text-chrome'}`}>
                          {node.name}
                        </span>

                        <div className="mt-2.5 h-[1.5px] bg-void w-full relative overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${isActive ? 'bg-neon shadow-[0_0_8px_#00f0ff]' : 'bg-steel'}`} 
                            style={{ width: `${node.load}%` }} 
                          />
                        </div>
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
        <div className="p-6 border-t border-steel bg-obsidian/90 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-neon font-black uppercase tracking-widest">{activeNode.id}_DOSSIER</span>
            <div className="w-2 h-2 bg-neon animate-pulse" />
          </div>
          <p className="text-[9px] text-chrome/60 leading-relaxed font-bold uppercase tracking-widest">
            {activeNode.description}
          </p>
          <div className="pt-2 flex flex-col gap-2">
             <div className="flex justify-between text-[8px] font-black">
               <span className="text-tungsten uppercase">COGNITIVE_AFFINITY</span>
               <span className="text-neon">GEMINI_3_PRO</span>
             </div>
             <div className="flex justify-between text-[8px] font-black">
               <span className="text-tungsten uppercase">LATENCY_PROTOCOL</span>
               <span className="text-active">SUB_100MS</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeGrid;
