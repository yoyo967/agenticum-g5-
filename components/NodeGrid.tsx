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

  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.ONLINE: return 'bg-active';
      case NodeStatus.PROCESSING: return 'bg-warning animate-pulse';
      case NodeStatus.WARNING: return 'bg-error shadow-[0_0_8px_#ff0055]';
      case NodeStatus.OFFLINE: return 'bg-tungsten opacity-30';
      default: return 'bg-tungsten';
    }
  };

  const groupedNodes = nodes.reduce((acc, node) => {
    if (!acc[node.cluster]) acc[node.cluster] = [];
    acc[node.cluster].push(node);
    return acc;
  }, {} as Record<ClusterType, AgentNode[]>);

  return (
    <div className="flex flex-col h-full bg-void border-r border-steel w-72 shrink-0 overflow-hidden select-none">
      <div className="p-4 border-b border-steel flex items-center justify-between bg-obsidian/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-neon/50"></div>
        <h2 className="text-chrome font-bold text-[10px] tracking-[0.3em] uppercase flex items-center gap-3">
          <ICONS.Cpu /> NODE_FABRIC_OS
        </h2>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-neon font-mono font-bold leading-none tracking-tighter">52/52</span>
          <span className="text-[7px] text-tungsten uppercase font-bold tracking-widest">Active_Units</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide p-1 space-y-3 pt-2">
        {(Object.keys(CLUSTERS) as ClusterType[]).map((clusterKey) => {
          const clusterNodes = groupedNodes[clusterKey] || [];
          const isExpanded = expandedClusters.has(clusterKey);
          
          return (
            <div key={clusterKey} className="space-y-0.5">
              <button 
                onClick={() => toggleCluster(clusterKey)}
                className="w-full flex items-center justify-between px-2 py-1.5 bg-steel/10 border-b border-steel/20 group hover:bg-steel/20 transition-all duration-75"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-1 h-3 ${isExpanded ? 'bg-neon' : 'bg-steel'} transition-colors duration-200`} />
                  <span className="text-[9px] font-black text-tungsten uppercase tracking-widest group-hover:text-chrome transition-colors">
                    {CLUSTERS[clusterKey].label}
                  </span>
                </div>
                <span className={`text-[8px] text-tungsten transition-transform duration-200 ${isExpanded ? 'rotate-90 text-neon' : ''}`}>
                  <ICONS.ChevronRight />
                </span>
              </button>
              
              {isExpanded && (
                <div className="grid grid-cols-1 gap-[1px] bg-steel/5">
                  {clusterNodes.map((node) => (
                    <button
                      key={node.id}
                      onClick={() => onSelectNode(node.id)}
                      className={`w-full p-2 text-left border-l-2 transition-all duration-75 group flex flex-col gap-0.5 relative overflow-hidden ${
                        activeNodeId === node.id 
                        ? 'border-neon bg-neon/5' 
                        : 'border-transparent hover:bg-steel/10'
                      }`}
                    >
                      {activeNodeId === node.id && (
                        <div className="absolute top-0 right-0 w-8 h-8 opacity-10">
                          <ICONS.Terminal />
                        </div>
                      )}
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[8px] font-mono font-bold tracking-tighter ${activeNodeId === node.id ? 'text-neon' : 'text-tungsten'}`}>
                          {node.id}
                        </span>
                        <div className={`w-1.5 h-1.5 rounded-none ${getStatusColor(node.status)}`} />
                      </div>
                      <span className={`text-[10px] font-bold tracking-tight uppercase ${activeNodeId === node.id ? 'text-chrome' : 'text-tungsten/80'} truncate`}>
                        {node.name}
                      </span>
                      {activeNodeId === node.id && (
                        <div className="mt-1.5 flex items-center gap-2">
                           <div className="flex-1 bg-steel/20 h-0.5">
                              <div className="bg-neon h-full animate-pulse" style={{ width: `${node.load}%` }} />
                           </div>
                           <span className="text-[7px] text-neon/60 font-mono">LD:{node.load}%</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-steel bg-obsidian/80 backdrop-blur-md relative">
        <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
          <ICONS.Shield />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[8px] text-tungsten font-bold uppercase tracking-widest">Compute_Grid_Status</span>
            <span className="text-[9px] text-active font-mono font-bold tracking-tighter">NOMINAL</span>
          </div>
          <div className="flex gap-0.5 h-1.5">
            {Array.from({length: 24}).map((_, i) => (
              <div key={i} className={`flex-1 ${i < 22 ? 'bg-active/80' : i < 23 ? 'bg-warning animate-pulse' : 'bg-steel/30'}`} />
            ))}
          </div>
          <div className="flex justify-between text-[7px] font-mono text-tungsten/60 uppercase">
             <span>SECURE_BRIDGE: OK</span>
             <span>P_LATENCY: 12ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeGrid;