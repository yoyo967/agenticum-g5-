
import React, { useMemo, useEffect, useState } from 'react';
import { AgentNode, NodeStatus, StrategicObjective } from '../types';

interface TopologyViewProps {
  nodes: AgentNode[];
  activeNodeId: string;
  onSelectNode: (id: string) => void;
  objectives?: StrategicObjective[];
}

const TopologyView: React.FC<TopologyViewProps> = ({ nodes, activeNodeId, onSelectNode, objectives = [] }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(timer);
  }, []);

  // Generate the full 52-node fabric as static background data
  const silentFabric = useMemo(() => {
    return Array.from({ length: 44 }).map((_, i) => {
      const angle = (i / 44) * Math.PI * 2;
      const radius = 350 + Math.sin(i) * 50;
      return {
        id: `N-${100 + i}`,
        x: 400 + Math.cos(angle) * radius,
        y: 400 + Math.sin(angle) * radius,
      };
    });
  }, []);

  const layout = useMemo(() => {
    const centerX = 400;
    const centerY = 400;
    
    return nodes.map((node, i) => {
      let radius = 320;
      let angle = (i / nodes.length) * Math.PI * 2;

      if (node.cluster === 'APEX') {
        radius = 80;
        angle = (i / nodes.filter(n => n.cluster === 'APEX').length) * Math.PI * 2 + (frame * 0.005);
      } else if (node.cluster === 'STRATEGY') {
        radius = 160;
        angle += (frame * 0.002);
      } else if (node.cluster === 'INTELLIGENCE') {
        radius = 240;
        angle -= (frame * 0.001);
      }

      const orbitOffset = Math.sin(frame * 0.02 + i) * 8;
      
      return {
        id: node.id,
        x: centerX + Math.cos(angle) * (radius + orbitOffset),
        y: centerY + Math.sin(angle) * (radius + orbitOffset),
        node,
        angle
      };
    });
  }, [nodes, frame]);

  const connections = useMemo(() => {
    const lines: { x1: number, y1: number, x2: number, y2: number, id: string, type: 'CORE' | 'MESH' | 'SILENT' }[] = [];
    const apexNodes = layout.filter(l => l.node.cluster === 'APEX');
    
    layout.forEach((target, idx) => {
      const nearestApex = apexNodes.reduce((prev, curr) => {
        const dPrev = Math.hypot(target.x - prev.x, target.y - prev.y);
        const dCurr = Math.hypot(target.x - curr.x, target.y - curr.y);
        return dCurr < dPrev ? curr : prev;
      });
      
      lines.push({ 
        x1: nearestApex.x, y1: nearestApex.y, 
        x2: target.x, y2: target.y,
        id: `conn-core-${idx}`,
        type: 'CORE'
      });

      if (idx > 0 && layout[idx-1].node.cluster === target.node.cluster) {
        lines.push({
           x1: layout[idx-1].x, y1: layout[idx-1].y,
           x2: target.x, y2: target.y,
           id: `conn-mesh-${idx}`,
           type: 'MESH'
        });
      }
    });

    // Add connections to silent fabric
    silentFabric.forEach((node, i) => {
      if (i % 5 === 0) {
        const nearestElite = layout[i % layout.length];
        lines.push({
          x1: nearestElite.x, y1: nearestElite.y,
          x2: node.x, y2: node.y,
          id: `silent-conn-${i}`,
          type: 'SILENT'
        });
      }
    });

    return lines;
  }, [layout, silentFabric]);

  const missionPath = useMemo(() => {
    const path: { x1: number, y1: number, x2: number, y2: number, status: string }[] = [];
    const assignedNodes = objectives
      .filter(obj => obj.assignedNode)
      .map(obj => ({
        node: layout.find(l => l.id === obj.assignedNode),
        status: obj.status
      }))
      .filter(item => item.node);

    for (let i = 0; i < assignedNodes.length - 1; i++) {
      const start = assignedNodes[i];
      const end = assignedNodes[i + 1];
      if (start.node && end.node) {
        path.push({
          x1: start.node.x,
          y1: start.node.y,
          x2: end.node.x,
          y2: end.node.y,
          status: start.status === 'COMPLETED' && end.status === 'COMPLETED' ? 'COMPLETED' : 
                  (start.status === 'ACTIVE' || end.status === 'ACTIVE' ? 'ACTIVE' : 'PENDING')
        });
      }
    }
    return path;
  }, [objectives, layout]);

  return (
    <div className="relative w-full h-full bg-void overflow-hidden select-none cursor-crosshair font-mono animate-in fade-in duration-700">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_rgba(0,240,255,0.1)_0%,transparent_70%)] animate-pulse"></div>
      
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2 pointer-events-none">
         <div className="flex items-center gap-3">
            <div className="w-1.5 h-4 bg-neon shadow-[0_0_15px_#00f0ff]" />
            <span className="text-[10px] font-black text-neon uppercase tracking-[0.5em]">Sovereign_Mesh_Topology</span>
         </div>
         <span className="text-[8px] text-tungsten font-black uppercase tracking-widest">Global_Fabric_Status: 52_NODES_PROXIED</span>
      </div>

      <svg viewBox="0 0 800 800" className="w-full h-full p-4 drop-shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <defs>
          <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="missionGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="apexGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="400" cy="400" r="140" fill="url(#apexGlow)" className="animate-pulse" />

        <g>
          {connections.map((line) => (
            <line 
              key={line.id}
              x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} 
              stroke={line.type === 'CORE' ? '#00f0ff' : line.type === 'MESH' ? '#222222' : '#111111'} 
              strokeWidth={line.type === 'CORE' ? "0.6" : "0.4"} 
              opacity={line.type === 'CORE' ? "0.15" : line.type === 'MESH' ? "0.08" : "0.05"}
              strokeDasharray={line.type === 'SILENT' ? '2 4' : '0'}
              className="transition-all duration-1000"
            />
          ))}
        </g>

        {/* Silent Fabric Base Nodes */}
        <g opacity="0.1">
          {silentFabric.map((node) => (
            <rect key={node.id} x={node.x - 2} y={node.y - 2} width="4" height="4" fill="#333" />
          ))}
        </g>

        {layout.map((item) => {
          const isActive = activeNodeId === item.id;
          const status = item.node.status;
          const isProcessing = status === NodeStatus.PROCESSING;
          const missionData = objectives.find(obj => obj.assignedNode === item.id);
          const isMissionNode = !!missionData;
          const objStatus = missionData?.status;
          
          let clusterColor = '#222222';
          if (item.node.cluster === 'APEX') clusterColor = '#00f0ff';
          else if (item.node.cluster === 'STRATEGY') clusterColor = '#aa00ff';
          else if (item.node.cluster === 'INTELLIGENCE') clusterColor = '#00ff88';
          else if (item.node.cluster === 'CREATION') clusterColor = '#ff0055';

          let statusColor = '#00ff88';
          if (status === NodeStatus.PROCESSING) statusColor = '#ffaa00';
          if (status === NodeStatus.WARNING) statusColor = '#ff0055';
          
          return (
            <g 
              key={item.id} 
              className="group cursor-pointer"
              onClick={() => onSelectNode(item.id)}
            >
              {isProcessing && (
                <g>
                  <circle r="3" fill={clusterColor} className="shadow-[0_0_12px_currentColor]">
                    <animateMotion 
                      dur={`${1 + Math.random() * 2}s`}
                      repeatCount="indefinite" 
                      path={`M ${item.x} ${item.y} L 400 400`} 
                    />
                    <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}

              {isMissionNode && (
                <circle 
                  cx={item.x} cy={item.y} r="22" 
                  fill="none" 
                  stroke={objStatus === 'COMPLETED' ? '#00ff88' : '#00f0ff'} 
                  strokeWidth="1" 
                  strokeDasharray="4 8"
                  className="animate-[spin_25s_linear_infinite] opacity-50"
                />
              )}

              <rect 
                x={item.x - 7} y={item.y - 7} width="14" height="14" 
                fill={isActive ? '#00f0ff' : (isMissionNode && objStatus === 'COMPLETED' ? '#00ff88' : statusColor)} 
                className={`transition-all duration-500 ${isProcessing || (isMissionNode && objStatus === 'ACTIVE') ? 'animate-pulse' : ''} border border-white/10`}
                filter={isActive || (isMissionNode && objStatus === 'ACTIVE') ? 'url(#nodeGlow)' : ''}
              />

              <circle 
                cx={item.x} cy={item.y} r="12" 
                fill="none" 
                stroke={clusterColor} 
                strokeWidth="1.5" 
                opacity="0.2"
                className="group-hover:opacity-80 transition-opacity"
              />

              <text 
                x={item.x + 20} y={item.y + 4} 
                className={`text-[10px] font-black pointer-events-none uppercase tracking-widest transition-all duration-500 ${
                  isActive ? 'fill-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff]' : (isMissionNode && objStatus === 'ACTIVE' ? 'fill-[#00f0ff] animate-pulse' : 'fill-[#999999] opacity-40 group-hover:opacity-100 group-hover:fill-white')
                }`}
              >
                {item.id}
              </text>
            </g>
          );
        })}

        <g>
          {missionPath.map((line, i) => (
            <g key={`mission-path-${i}`}>
              <line 
                x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} 
                stroke={line.status === 'COMPLETED' ? '#00ff88' : 
                        line.status === 'ACTIVE' ? '#00f0ff' : '#222222'} 
                strokeWidth={line.status === 'PENDING' ? "2" : "5"}
                strokeDasharray={line.status === 'PENDING' ? "8 8" : "0"}
                opacity={line.status === 'PENDING' ? 0.3 : 1}
                filter={line.status === 'ACTIVE' ? 'url(#missionGlow)' : ''}
                className={line.status === 'ACTIVE' ? 'animate-pulse transition-all duration-700' : 'transition-all duration-1000'}
              />
            </g>
          ))}
        </g>
      </svg>

      <div className="absolute bottom-6 right-6 opacity-30 pointer-events-none">
         <div className="text-[9px] text-right font-black uppercase tracking-[0.4em] space-y-1">
            <div>MESH_ENTROPY: 0.0421</div>
            <div>FABRIC_DEPTH: 52_NODES</div>
            <div>TOPOLOGY_PROJECTION: ELITE_OCTET_SYNC</div>
         </div>
      </div>
    </div>
  );
};

export default TopologyView;
