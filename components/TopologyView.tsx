
import React, { useMemo } from 'react';
import { AgentNode, NodeStatus, ClusterType } from '../types';

interface TopologyViewProps {
  nodes: AgentNode[];
  activeNodeId: string;
  onSelectNode: (id: string) => void;
}

const TopologyView: React.FC<TopologyViewProps> = ({ nodes, activeNodeId, onSelectNode }) => {
  // Generate a circular layout for the 52 nodes
  const layout = useMemo(() => {
    const centerX = 400;
    const centerY = 400;
    const innerRadius = 120;
    const outerRadius = 300;

    return nodes.map((node, i) => {
      // Stratify by cluster?
      const isApex = node.cluster === 'APEX';
      const angle = (i / nodes.length) * Math.PI * 2;
      const radius = isApex ? innerRadius : outerRadius + (Math.sin(i * 10) * 20);
      
      return {
        id: node.id,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        node
      };
    });
  }, [nodes]);

  const connections = useMemo(() => {
    const lines = [];
    const apexNodes = layout.filter(l => l.node.cluster === 'APEX');
    
    // Connect everything to Apex nodes
    for (const apex of apexNodes) {
      for (const target of layout) {
        if (apex.id === target.id) continue;
        if (Math.random() > 0.96) { // Sparse connections for aesthetic
          lines.push({ x1: apex.x, y1: apex.y, x2: target.x, y2: target.y });
        }
      }
    }
    return lines;
  }, [layout]);

  return (
    <div className="relative w-full h-full bg-void overflow-hidden select-none cursor-crosshair group">
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon via-transparent to-transparent"></div>
      
      <svg viewBox="0 0 800 800" className="w-full h-full p-8 md:p-12 lg:p-20">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Connection Lines */}
        <g opacity="0.1">
          {connections.map((line, i) => (
            <line 
              key={i} 
              x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} 
              stroke="var(--neon-cyan)" 
              strokeWidth="0.5" 
              className="animate-pulse"
              style={{ animationDelay: `${Math.random() * 2}s` }}
            />
          ))}
        </g>

        {/* Nodes */}
        {layout.map((item) => {
          const isActive = activeNodeId === item.id;
          const status = item.node.status;
          const color = status === NodeStatus.ONLINE ? '#00ff88' : status === NodeStatus.PROCESSING ? '#ffaa00' : '#ff0055';
          
          return (
            <g 
              key={item.id} 
              className="cursor-pointer transition-all duration-300"
              onClick={() => onSelectNode(item.id)}
            >
              {/* Active Ring */}
              {isActive && (
                <circle 
                  cx={item.x} cy={item.y} r="8" 
                  fill="none" stroke="#00f0ff" strokeWidth="1" 
                  className="animate-ping"
                />
              )}
              
              {/* Node Point */}
              <rect 
                x={item.x - 2} y={item.y - 2} width="4" height="4" 
                fill={isActive ? '#00f0ff' : color} 
                className={status === NodeStatus.PROCESSING ? 'animate-pulse' : ''}
                filter={isActive ? 'url(#glow)' : ''}
              />

              {/* ID Tag (Only on hover or active) */}
              <text 
                x={item.x + 6} y={item.y + 4} 
                className={`text-[6px] font-mono transition-opacity duration-300 pointer-events-none uppercase tracking-tighter ${
                  isActive ? 'opacity-100 fill-neon font-black' : 'opacity-0 fill-tungsten group-hover:opacity-40'
                }`}
              >
                {item.id}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend & Telemetry */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2 bg-obsidian/80 border border-steel p-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-neon shadow-[0_0_8px_#00f0ff]"></div>
          <span className="text-[9px] text-chrome font-black uppercase tracking-widest">Selected_Node: {activeNodeId}</span>
        </div>
        <div className="flex items-center gap-3 opacity-60">
          <div className="w-2 h-2 bg-active"></div>
          <span className="text-[8px] text-tungsten font-bold uppercase tracking-widest">Active_Mesh_Integrity: 100%</span>
        </div>
        <div className="flex items-center gap-3 opacity-60">
          <div className="w-2 h-2 bg-warning"></div>
          <span className="text-[8px] text-tungsten font-bold uppercase tracking-widest">Neural_Sync: {Math.floor(Math.random() * 5 + 95)}%</span>
        </div>
      </div>

      <div className="absolute top-6 right-6 text-right">
        <div className="text-[8px] text-neon/40 font-mono uppercase tracking-[0.5em] mb-1">Topology_V5.0_Visualizer</div>
        <div className="text-[12px] text-chrome font-black uppercase tracking-[0.2em]">{activeNodeId}_COORD_STREAM</div>
      </div>
    </div>
  );
};

export default TopologyView;
